---
layout: posts
author: Anshul Agarwal
comments: true
title: "Introducing Asynchronous Search in Open Distro for Elasticsearch"
categories:
- releases
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---


We are excited to announce the release of Asynchronous Search APIs in Open Distro for Elasticsearch version 1.13.0. The regular Search API in Elasticsearch allows you to search across datasets using a query request that waits to obtains the entire result set from the shards before returning a response. However, for large data sets, spanning many shards or multiple clusters, or against warm indices, the query may take long to return the result, often resulting in client timeouts. With the new asynchronous search feature, you can start using results as they become available and monitor the progress of the request as it continues to run in background. The results from the query can also be stored in an index for retrieval at a later time.

Asynchronous Search can be great solution for setups with large volume of data where users need to run query with wildcard parameters that need to scan almost the entire dataset. With the regular Search API the query can take a lot longer than average and it can timeout even before the result set becomes available. With Asynchronous Search, if the query is taking longer you can retrieve the results that have been collated so far and continue to go back for more results as and when they become available. The Asynchronous Search continues to run in the background and collect results till the entire result set is available, which can then be persisted in an index for later use.

## Asynchronous Search APIs

Asynchronous Search supports APIs for submitting, fetching partial results incrementally, cancelling an asynchronous search, and querying stats on asynchronous searches. For more details on each of the APIs below, please refer to the [documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/async/).

1. **Submit Asynchronous Search**
    To perform an asynchronous search, send requests to `_opendistro/_asynchronous_search`, with your query in the request body to target either an index pattern or all indices:
    
    ```
    POST <index-pattern>/_opendistro/_asynchronous_search
        
    POST _opendistro/_asynchronous_search
    ```
        
    The response will return an asynchronous search ID that can be used to retrieve results at a later point in time. 
    
    Sample Request:
    ```
    POST _opendistro/_asynchronous_search/?pretty&size=10&wait_for_completion_timeout=1ms&keep_on_completion=true&request_cache=false
    {
      "aggs": {
        "city": {
          "terms": {
            "field": "city",
            "size": 10
          }
        }
      }
    }
    ```

    Sample Response:
    ```
    {
      "id": "FklfVlU4eFdIUTh1Q1hyM3ZnT19fUVEUd29KLWZYUUI3TzRpdU5wMjRYOHgAAAAAAAAABg==",
      "state": "RUNNING",
      "start_time_in_millis": 1599833301297,
      "expiration_time_in_millis": 1600265301297,
      "response": {
      ...
      }
    }
    ```
2. **Get Asynchronous Search**
  After you submit an asynchronous search request, you can request responses, even if partial, at time of request with the ID that you see in the asynchronous search response.
  
    ```
    GET _opendistro/_asynchronous_search/<ID>
    ```
    
    The below sample request gets the partial response for the asynchronous search that is already running (state=RUNNING). The response shows the count of successful shard executions and the total shards to be queried against. 
    
    Sample Request:
    ```
    GET _opendistro/_asynchronous_search/
    FklfVlU4eFdIUTh1Q1hyM3ZnT19fUVEUd29KLWZYUUI3TzRpdU5wMjRYOHgAAAAAAAAABg==
    ```

    Sample Response with state RUNNING:
    ```
    {
      "id": "Fk9lQk5aWHJIUUltR2xGWnpVcWtFdVEURUN1SWZYUUJBVkFVMEJCTUlZUUoAAAAAAAAAAg==",
      "state": "RUNNING",
      "start_time_in_millis": 1599833907465,
      "expiration_time_in_millis": 1600265907465,
      "response": {
        "took": 83,
        "timed_out": false,
        "_shards": {
          "total": 20,
          "successful": 10,
          "skipped": 0,
          "failed": 0
        }
        ...
      } 
    }
    ```

    Once the asynchronous search completes i.e after all the shards have been successfully queried against and the initial asynchronous search had the keep_on_completion query parameter set to true, the response will be stored in the system index for later retrieval and the state in the response will be set to STORE_RESIDENT as shown below.

    Sample Response with state STORE_RESIDENT:
    ```
    {
      "id": "Fk9lQk5aWHJIUUltR2xGWnpVcWtFdVEURUN1SWZYUUJBVkFVMEJCTUlZUUoAAAAAAAAAAg==",
      "state": "STORE_RESIDENT",
      "start_time_in_millis": 1599833907465,
      "expiration_time_in_millis": 1600265907465,
      "response": {
        "took": 100,
        "timed_out": false,
        "_shards": {
          "total": 20,
          "successful": 20,
          "skipped": 0,
          "failed": 0
        }
        ...
      } 
    }
    ```

3. **Delete Asynchronous Search**
    You can use a `DELETE` request to delete any ongoing asynchronous search by its ID. If the search is still running, it’s cancelled. 
    
    ```
    DELETE _opendistro/_asynchronous_search/<ID>?pretty
    ```

    Sample Request:
    ```
    DELETE _opendistro/_asynchronous_search/Fk9lQk5aWHJIUUltR2xGWnpVcWtFdVEURUN1SWZYUUJBVkFVMEJCTUlZUUoAAAAAAAAAAg==
    ```

    **Sample Response**
    ```
    {
      "acknowledged": "true"
    }
    ```

4. **Asynchronous Search Stats**
    You can use the `opendistro/_asynchronous_search/stats` API to get status of* the asynchronous searches per coordinator node
    
    ```
    GET _opendistro/_asynchronous_search/stats?pretty
    ```
    Sample Response:
    ```
    {
      "_nodes": {
        "total": 8,
        "successful": 8,
        "failed": 0
      },
      "cluster_name": "264071961897:asynchronous-search",
      "nodes": {
        "JKEFl6pdRC-xNkKQauy7Yg": {
          "asynchronous_search_stats": {
            "submitted": 18236,
            "initialized": 112,
            "search_failed": 56,
            "search_completed": 56,
            "rejected": 18124,
            "persist_failed": 0,
            "cancelled": 1,
            "running_current": 399,
            "persisted": 100
          }
        }
      }
    }
    ```

5. **Cross-Cluster Asynchronous Search**
  Cross-cluster asynchronous search lets you perform long running queries and aggregations across multiple connected domains (See [Cross-Cluster Search](https://opendistro.github.io/for-elasticsearch-docs/docs/security/access-control/cross-cluster-search/#cross-cluster-search))

    Sample Request:
    ```
    POST _opendistro/remote_cluster_alias:index-2021-03,index-2021-03/_asynchronous_search/?pretty&size=10&wait_for_completion_timeout=1ms&keep_on_completion=true&request_cache=false
    {
      "aggs": {
        "city": {
          "terms": {
            "field": "city",
            "size": 10
          }
        }
      }
    }
    ```

    Sample Response:
    ```
    {
      "id": "FklfVlU4eFdIUTh1Q1hyM3ZnT19fUVEUd29KLWZYUUI3TzRpdU5wMjRYOHgAAAAAAAAABg==",
      "state": "RUNNING",
      "start_time_in_millis": 1599833301297,
      "expiration_time_in_millis": 1600265301297,
      "response": {
      ...
      }
    }
    ```

## Conclusion

Asynchronous Search is useful when querying large data sets across many shards or multiple clusters. The Asynchronous Search queries continue to gather results in the background and the result set is updated and persisted for a user specified configurable time interval. The queries will eventually return the complete result set and can be stored in an index for later analysis.

We encourage you to try these new APIs on Open Distro for Elasticsearch and provide your valuable feedback to our engineering team on the [Github repo for Asynchronous Search](https://github.com/opendistro-for-elasticsearch/asynchronous-search). We also welcome community contributions and invite you to check out the [contribution guidelines](https://github.com/opendistro-for-elasticsearch/asynchronous-search/blob/master/CONTRIBUTING.md) to get more involved.

## About the authors

**Bukhtawar Khan** is a Software Engineer working on Search Services at Amazon Web Services. He is interested in distributed and autonomous systems. He is an active contributor to Open Distro for Elasticsearch.

**Anshul Agarwal** is a Software Engineer working on Search Services at Amazon Web Services. His primary interests are Distributed Systems and Networking at Scale.

**Surya Nistala** is a Software Engineer working on Search Services at Amazon Web Services. His primary interests are hybrid cloud, distributed systems, and serverless computing.

**Mital Awachat** is a Software Engineer working on Search Services at Amazon Web Services. His primary interests are Distributed Systems. 

**Ranjith Ramachandra** is an Engineering Manager working on Search Services at Amazon Web Services.


