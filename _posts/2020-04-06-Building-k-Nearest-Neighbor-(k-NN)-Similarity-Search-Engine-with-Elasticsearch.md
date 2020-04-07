---
layout: posts
author: Vamshi Vijay Nakkirtha, Lai Jiang, Chris Swierczewski, Jack Mazanec
comments: true
title: "Build K-Nearest Neighbor (k-NN) Similarity Search Engine with Elasticsearch"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

Recently, we launched k-NN similarity search feature on Open Distro for Elasticsearch. We are excited for the community to try out this feature and welcome you to come join in and contribute in building additional capabilities into Open Distro for Elasticsearch.

A k-nearest neighbors (k-NN) algorithm is a technique for performing similarity search: given a query data point, what are the k data points in an index that are most similar to the query? k-NN is largely popular for its use in content-based recommendation systems. For example, in a music streaming service, when a user generates an on-demand playlist, the recommendation system adds the songs that match the attributes of that playlist using k-NN. In a k-NN search algorithm, the elements of a data set are represented by vectors. Each song is a vector, containing several dimensions (attributes) like artist, album, genre, year of release, etc. The search assumes you have a defined distance function between the data elements (vectors) and returns most similar items to the one provided as input, where closest distance translates to item similarity. Other use cases with similarity search include fraud detection, image recognition, and semantic document retrieval.

We evaluated four primary dimensions to measure the effectiveness of a k-NN algorithm:

1. **Speed** - How quickly does the algorithm return the approximate k-nearest neighbors, measured in latency of a single or batch query?
2. **Recall** - How accurate are the results, measured by ratio of the returned k-nearest neighbors indeed in the list of the actual k nearest neighbors to the value of k?
3. **Scalability** - Can the algorithm handle data sets with millions or billions of vectors and thousands of dimensions?
4. **Updates** - Does the algorithm allow addition, deletion, and updating points without having to rebuild an index, a process that can take hours or more?

We selected “[**Hierarchical Navigable Small World**](https://arxiv.org/pdf/1603.09320.pdf)” (HNSW) graphs developed under the open source library “**Non-Metric Space Library**" ([NMSLIB](https://github.com/nmslib/nmslib)) as it aligned with our architectural requirements and met most of our evaluation criteria. Given a dataset, the algorithm constructs a graph on the data such that the greedy search algorithm finds the approximate nearest neighbor to a query in logarithmic time. HSNW consistently outperforms other libraries in this space based on [ANN benchmark](https://github.com/erikbern/ann-benchmarks) metrics. HNSW excels at speed, recall, and cost, though it is restricted in scalability and updates. While the HNSW algorithm allows incremental addition of points, it forbids deletion and modification of indexed points. We offset the scalability and updates challenges by leveraging Elasticsearch’s distributed architecture, which scales with large data sets and inherently supports incremental updates to the data sets that become available in the search results in near real-time. The rest of this post discusses the integration of NMSLIB with Elasticsearch and the customizations made to support the feature in Elasticsearch.


## Hierarchical Navigable Small World Algorithm (HNSW)

The HNSW graph algorithm is a fast and accurate solution to the approximate k-nearest neighbors (k-NN) search problem.

A straightforward, yet naive solution to the k-NN problem is to first compute the distances from a given query point to every data point within an index and then select the data points with the smallest k distances to the query. While this approach is effective when the index contains ten thousand or fewer data points, it does not scale to the sizes of datasets used by our customers. An approximate k-NN (ANN) algorithm may greatly reduce search latency at the cost of precision. When designing an ANN algorithm there are two general approaches to improve latency:

1. Compute fewer distances and
2. Make distance computations cheaper

The HNSW algorithm focuses on the first of these approaches by building a graph data structure on the constituent points of the data set.

With a graph data structure on the data set, approximate nearest neighbors can be found using graph traversal methods. Given a query point, we find its nearest neighbors by starting at a random point in the graph and computing its distance to the query point. From this entry point, we explore the graph, computing the distance to the query of each newly visited data point until the traversal can find no closer data points. To compute fewer distances while still retaining high accuracy, the HNSW algorithm builds on top of previous work on Navigable Small World (NSW) graphs. The NSW algorithm builds a graph with two key properties. The “small world” property is such that the number of edges in the shortest path between any pair of points grows poly-logarithmically with the number of points in the graph. The “navigable” property asserts that the greedy algorithm is likely to stay on this shortest path. Combining these two properties results in a graph structure so the greedy algorithm is likely to find the nearest data point to a query in logarithmic time.

![k-NN Graph Figure 1]({{ site.baseurl }}/assets/media/blog-images/knn_graph_1.png){: .blog-image }
*Figure 1: A depiction of an NSW graph built on blue data points. The dark blue edges represent long-range connections that help ensure the small-world property. Starting at the entry point, at each iteration the greedy algorithm will move to the neighbor closest to the query point. The chosen path from the entry point to the query’s nearest neighbor is highlighted in magenta and, by the “navigable” property, is likely to be the shortest path from the entry point to the query’s nearest neighbor.* HNSW extends the NSW algorithm by building multiple layers of interconnected NSW-like graphs. The top layer is a coarse graph built on a small subset of the data points in the index. Each lower layer incorporates more points in its graph until reaching the bottom layer, which consists of an NSW-like graph on every data point. To find the approximate nearest neighbors to a query, the search process finds the nearest neighbors in the graph at the top layer and uses these points as the entry points to the subsequent layer. This strategy results in a nearest neighbors search algorithm which runs logarithmically with respect to the number of data points in the index.

### Non Metric Space Library (NMSLIB)

NMSLIB, an Apache 2 licensed library, is the open source implementation of HNSW. It is lightweight and works particularly well for our use cases that that requires minimal impact on the Elasticsearch application workloads. To index the vectors and to query the nearest neighbors for the given query vector, our k-NN plugin makes calls to the NMSLIB implementation of HNSW. We use the Java Native Interface (JNI) to bridge between Elasticsearch written in Java and C++ libraries in NMSLIB.  Although we use Euclidean distance vector to calculate the proximity, NMSLIB can be easily extended to add new search methods and distance functions (like cosine similarity) in the future.

## Elasticsearch Integration with Approximate k-NN Search

Elasticsearch’s distributed engine allows us to distribute the millions of vectors across multiple shards spread across multiple nodes within a cluster and scales horizontally as the data grows. Users can also take advantage of Elasticsearch’s support for index updates to make any modifications to the data set and reflect the changes in the results in near real-time. While Elasticsearch’s plugin-based architecture makes it easy to add extensions, we had to make some customizations to support the Approximate Nearest Neighbor (ANN) Search.

First, we added a new field type, **knn_vector**, using the Mapper plugin, to represent the vectors as a an array of floating point numbers in a document. ANN requires support for storing high cardinality vectors. The **knn_vector** field support vectors up to 10k dimensions. We also introduced a new Apache Lucene codec, **KNNCodec**, to add a new index file format for storing and retrieving the vectors and make Apache Lucene aware of the graphs built by NMSLIB. These file formats co-exist with the other Apache Lucene file formats and are immutable just like the other Apache Lucene files, making them file system cache friendly and thread safe.

Let’s create a KNN index **myindex** and add data of type knn_vector to the field my_vector. You could then index your documents as you would normally do using any of Elasticsearch index APIs.

````json
PUT /myindex
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 2
      }
    }
  }
}

````



````json
PUT /myindex/_doc/1
{
  "my_vector": [1.5, 2.5]
}

PUT/myindex/_doc/2
{
  "my_vector": [2.5, 3.5]
}
````

We also added a new query clause `knn`. You can use the this clause in the query DSL and specify the point of interest as my_vector (knn_vector) and the number of nearest neighbors to fetch as ‘k’. The response below, which shows 2 nearest docs as defined by k to the input point [3, 4]. The score indicates the distance between the two vectors and is the deciding factor for selecting the neighbors.

````json
POST /myindex/_search
{
  "size": 2,
  "query": {
    "knn": {
      "my_vector": {
        "vector": [3, 4],
        "k": 2
      }
    }
  }
}

Output:

{
  "took": 7,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.5857864,
    "hits": [{
        "_index": "myindex",
        "_type": "_doc",
        "_id": "2",
        "_score": 0.5857864,
        "_source": {
          "my_vector": [
            2.5,
            3.5
          ]
        }
      },
      {
        "_index": "myindex",
        "_type": "_doc",
        "_id": "1",
        "_score": 0.32037726,
        "_source": {
          "my_vector": [
            1.5,
            2.5
          ]
        }
      }
    ]
  }
}
````

You can also combine the `knn` query clause with other query clauses as you would normally do with compound queries. In the example provided, the user first runs the `knn` query to find the closest five neighbors (k=5) to the vector [3,4] and then applies post filter to the results using the boolean query to focus on items that are priced less than 15 units.

````json
POST /myindex/_search
{
  "size": 5,
  "query": {
    "bool": {
      "must": {
        "knn": {
          "my_vector": {
            "vector": [3, 4],
            "k": 5
          }
        }
      },
      "filter": {
        "range": {
          "price": {
            "lt": 15
          }
        }
      }
    }
  }
}
````

### Memory Monitoring

The NSW graphs, created by the underlying NMSLIB C++ library, are loaded outside Elasticsearch JVM, and the garbage collection does not reclaim the memory used by the graphs. We developed a monitoring solution using Guava cache to limit memory consumption by the graphs to prevent OOM (out of memory) issues and to trigger garbage collection when the indices are deleted or when the existing segments are merged to newer segments as part of segment merges. We also introduced an additional stats API to monitor the cache metrics like totalLoadTime, evictionCount, hitCount, graphMemoryUsage to assist with efficient memory management. Refer to the [Open Distro for Elasticsearch documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/knn/settings/) for the complete set of metrics.

## Conclusion

Our new k-NN solution enables you to build a scalable, distributed, and reliable framework for similarity searches. You can further enhance the results with strong analytics and query support from Elasticsearch. The current solution leverages Euclidean distance to calculate the nearest neighbors. We plan to add support for cosine similarity in the future.

We encourage you to try out this solution on Open Distro for Elasticsearch or on Amazon Elasticsearch Service and provide your valuable feedback to our research and engineering team at [https://github.com/opendistro-for-elasticsearch/k-NN](https://github.com/opendistro-for-elasticsearch/k-NN).

## About the Authors

Vamshi Vijay Nakkirtha is a software engineer working on Amazon Elasticsearch Service and Open Distro for Elasticsearch. His primary interests include distributed systems. He is an active contributor to various plugins in Open Distro for Elasticsearch.

Lai Jiang is a software engineer working on machine learning and Elasticsearch at Amazon Web Services. His primary interests are algorithms and math. He is an active contributor to Open Distro for Elasticsearch.

Chris Swierczewski is an applied scientist in Amazon AI. He enjoys hiking and backpacking with his wife and their dogs, River and Bosco.

Jack Mazanec is a software engineer working on Amazon Elasticsearch Service and Open Distro for Elasticsearch. His primary interests include machine learning, operating systems and distributed systems. Outside of work, he enjoys skiing and watching sports.
