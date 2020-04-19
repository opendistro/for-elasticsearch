---
layout: posts
author: Vigya Sharma, Jon Handler
comments: true
title: "The Elasticsearch Weight Function"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

Distributed systems scale by coordinating and distributing their workloads horizontally, across several machines. In Elasticsearch, this is done by partitioning indexes into shards and distributing them across data nodes in the cluster.

![The Elasticsearch Weight Function]({{ site.baseurl }}/assets/media/blog-images/es-weights-stone-tower-by-the-beach-by-yuri-samoilov-ccbysa3-0.jpg){: .blog-image }
<p align="left">
The Elasticsearch Weight Function<br>
Image credit: <a href="https://yuri.samoilov.online">Yuri Samoilov</a>
</p>

Shards receive read and write traffic, and consume resources like disk, memory, JVM heap, and network. The overall resource consumption (workload) on a data node, depends on the shards it holds and the traffic they receive. Thus, a balanced distribution of shards corresponds to even workloads and efficient node utilization. In Elasticsearch, this responsibility belongs to the `ShardsAllocator` component.

In a [_previous post_](https://aws.amazon.com/blogs/opensource/open-distro-elasticsearch-shard-allocation/), we discussed the internal Elasticsearch algorithms for allocation and rebalance. Each shard is compared against eligible destination nodes, and the best fit is chosen. These comparisons require some internal yardstick to rank nodes, which is provided by the Shard Allocation Weight Function.

In this post, I will dive into the default weight function implementation to weigh the pros and cons of the default algorithm and look at some of the considerations in making shard allocation more responsive to transient signals. You will gain a deeper understanding of shard placement in your clusters, why Elasticsearch chose a particular node for a shard, and how future placement decisions will be evaluated. Knowing this will help you design for future workloads and scaling requirements.


## The Weight Function

Weight function, in Elasticsearch, is a neat abstraction to process parameters that influence a shard’s resource footprint on a node, and assign measurable weight values to each shard - node combination. The node with lowest weight value is considered as the best destination for shard in question. Similarly, a high difference in weight values implies imbalance – shards must be moved from high to low weighted nodes.

The [_default weight function_](https://github.com/elastic/elasticsearch/blob/master/server/src/main/java/org/elasticsearch/cluster/routing/allocation/allocator/BalancedShardsAllocator.java#L207-L243) uses two parameters to balance shards <sup id="a2">[2](#f2)</sup>

* Total number of shards on a node across all indexes.
* Number of shards on a node for given index.

```

shard-weight = theta0 * (num-shards-on-node – mean-shards-per-node)
index-weight = theta1 * (num-index-shards-on-node – mean-shards-per-node-for-index)
Weight (shard, node) = shard-weight + index-weight

# theta0 and theta1 are user configurable constants.
# theta0 + theta1 = 1
# mean-shards-per-node = num-of-shards-in-cluster / num-nodes-in-cluster
# mean-shards-per-node-for-index = num-shards-in-cluster-for-index / num-nodes-in-cluster

```


The function ensures that all nodes hold the same number of shards, and shards for each index are spread across nodes.
If a node holds too many shards, its deviation from `mean-shards-per-node` is high, which increases the shard-weight factor. If too many shards of an index land on the same node, its deviation from `mean-shards-per-node-for-index` goes up, increasing the index-weight factor. Both of these increase the overall weight for shard on a node, indicating that shard be moved to a node with lesser weight.

The contribution of each factor can be controlled by [two dynamic settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/shards-allocation.html#_shard_balancing_heuristics).

* `cluster.routing.allocation.balance.shard` – Controls shard-weight (Reduced to `theta0` in above equations [[code](https://github.com/elastic/elasticsearch/blob/master/server/src/main/java/org/elasticsearch/cluster/routing/allocation/allocator/BalancedShardsAllocator.java#L221-L222)])
* `cluster.routing.allocation.balance.index` – Controls index-weight (Reduced to `theta1` in above equations [[code](https://github.com/elastic/elasticsearch/blob/master/server/src/main/java/org/elasticsearch/cluster/routing/allocation/allocator/BalancedShardsAllocator.java#L221-L222)])


There is another knob to control rebalancing — `cluster.routing.allocation.balance.threshold`. Shard balancing is an optimization problem. Moving a shard from one node to another demands system resources like CPU and network. At some point, the benefit achieved by rebalancing ceases to outweigh the cost of moving shards around. The threshold setting lets us fine-tune this tradeoff. Elasticsearch will rebalance only if the weight delta between nodes, is higher than configured threshold [[_code_](https://github.com/elastic/elasticsearch/blob/master/server/src/main/java/org/elasticsearch/cluster/routing/allocation/allocator/BalancedShardsAllocator.java#L405-L416)].

Any non-negative float value is acceptable for the threshold variable. Elasticsearch will rebalance shards, if the weight difference after rebalance is more than this threshold. Deciding the right value for this threshold however, is involved. You could substitute the number of nodes, shards, and shards per index into the weight function above to get an idea. Or experiment with some values to see what works best.

## The Beauty of Using Shard Count

Simple solutions to complex problems have intangible engineering value. Shard count provides a simple, lightweight heuristic around how loaded a node is. And for a majority of use cases, it is a reasonable signal. Nodes with more shards get more traffic, and have more disk, CPU, and memory consumption as compared to nodes with fewer shards. Equalizing on shard count works especially well, if all your indexes handle similar workloads.

Shard allocation can be seen as a modified bin-packing problem. You want to distribute `m items` (shards) across `n bins` (nodes) so as to minimize load on the most loaded bin.

Using shard count as the balancing signal, simplifies this problem since shard count is a uniform, deterministic value. Assigning items (shards) to the least filled bin (node) so that all bins fill up uniformly gives even distribution. Changing this to actual resource usage signals like JVM, CPU, disk or network footprint of a shard, makes the items non-uniform, which considerably complicates the problem space

Shard count is a uniform signal. Metrics like JVM heap, CPU or memory consumption fluctuate very frequently, and require smoothing approximation mechanisms like moving averages. Using shard count eliminates this extra need for signal cleanup.

Changes to shard count, like adding/deleting indexes, changing replica counts for existing indexes, or shrink/split APIs, all go via cluster state updates.  Distributing these changes in cluster state allows for the current event driven model for shard balancer, where all allocation and rebalance scenarios are evaluated only in response to cluster state updates (or explicit [_reroute_](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-reroute.html) API calls).

In contrast, balancing on metrics like shard size (disk usage) requires periodic rebalance checks based on updated shard sizes. Elasticsearch does have a periodic internal monitor to track disk usage. But it is used by the balancer, only when disk watermarks are breached. At which point, the node stops receiving new shards (low watermark) or moves existing shards out (high watermark). Disk usage does not factor into shard balancing until watermarks are hit.


## Road Ahead

The shard count heuristic provided a good foundational metric for early Elasticsearch versions. If you are running a small to medium sized cluster, or even a production grade cluster with homogeneous workloads, it can provide acceptable performance. But at AWS scale, we see clusters pushed to their limits. When throwing more machines ceases to help with a problem, we must go back and think from first principles.

### Beyond Homogeneity

At petabyte scale, non-uniform workloads are a norm rather than the exception. For example, you might be supporting an enterprise-wide analytics platform with many different business units storing their own indexes. Shards across such indexes can vary significantly in ingestion rates and query traffic. One team might index several gigabytes of data every hour, while another may take a month to ingest 1gb.

Workarounds today involve splitting your cluster by workload and using cross cluster search, index rollover by time (e.g. daily) or shard size, or creating an index life cycle with hot, warm and cold stages. Individually, these features solve separate important problems. Using them for load balancing however, is trying to force homogeneity onto a problem that is inherently diverse.

These workarounds have drawbacks.

Cross cluster is great to organize and split clusters by business use cases. You could create a cluster for finance and another one for inventory. But predicting workloads, creating uniform cluster splits and mapping each team to the right cluster, incurs significant management overhead. Not to mention the boiler plate cost of each split cluster.

Rolling over by size or time still creates skewed indexes within the rollover window. Rotating at smaller sizes reduces skew, but quickly explodes to an unstable cluster with too many shards. Index lifecycle is great for archiving old data and clearing up resources. But it is not a guarantee of uniformity. One team’s hot shard may have lower footprint than what another team considers a cold shard.

We need to embrace that shards have inherently diverse resource requirements, and balancing should consider their individual footprints.


### Diverse Signals, Hybrid Clusters

Shards could be balanced by *shard heat* – the actual resource footprint of a shard. Signals like JVM heap, CPU, memory, network and disk consumption could be actual indicators for shard heat. Balancing would then, map shard heat to resource availability on nodes.

The present-day shard count is a placeholder signal that occasionally correlates with resource consumption. Future balancers should consider multiple relevant signals. For example, shard size alone is a good signal for disk usage, but not sufficient by itself. Large shards are often cold shards from index rollovers. And in most modern-day systems, JVM heap and CPU, are more precious than disk space. To work across these multiple dimensions, resources could define priority – balance on memory before disk usage.

Mapping shard requirement to resource availability opens gates for diversity in resources as well. Clusters can comprise hybrid nodes with different capabilities to best fit the price-performance metric.


### Compute Intensive in Critical Path

Our former post described algorithms used to check for `move` and `rebalance` operations. These operations run in the order of `num-shards * num-nodes`, and are performed by the master node alone during cluster state changes.

This incurs significant processing cost in clusters with high shard and node count. While shard movement is a cluster state change decision that has to happen at master, checking for imbalance could be made periodic and moved out of the state update path.

### Indexing Hot Spots

The current count-based weight function considers deviation from mean in `total-node-shard-count` and `index-level-node-shard-count`. In a sufficiently sized cluster, each node can hold a few hundred shards. In contrast, a single index would typically have only 5-10 shards.

When you add an empty node to this cluster, during cluster scale out or failed node replacement, the new node joins with zero shard count. If you calculate the weight for this node, the total shard count deviation heavily outweighs the deviation created due to index level shard count. Even when all shards of an index land on the new node, its net weight is still very low due to the large negative factor added by `total-node-shard-count – mean-node-shard-count`.

This low weight value keeps the new node as `most eligible` for receiving all shards of any new index. It is only when the node gets sufficiently filled up, and `total-node-shard-count` approaches `mean-node-shard-count`, that the `index-weight` becomes significant. At this point, balancer *moves* the new index shards, out of this new node.

This is the index-level shard allocation hot spot problem. In any cluster of reasonable size, if you add a single node, or replace a failed node, all shards of any newly created index land on the newly added node. Since new indexes are usually high traffic targets, this node then becomes an indexing bottleneck in the cluster. The node continues to remain as a hotspot until shards from other nodes fill it up, which can be considerably long, since shard movement takes time. Furthermore, there is an added overhead of moving the new shards out when the node finally gets filled up and `index-weight` kicks in.


## Parting Thoughts

Customer obsession and diving deep, are guiding principles at AWS. The problems we discuss here, were realized working backwards from actual customer issues. Shard balancing is an involved multi-variable optimization problem. The default allocator implementations served as a good starting ground, it powers the distributed engine we all love today. But as we push the envelope with scale, we must innovate and re-imagine the future of these components.

We are working on the ideas discussed above <sup id="a3">[3](#f3)</sup>, and will keep the open-source community involved in our progress. Suggestions, ideas and inputs from the OpenDistro for Elasticsearch community are welcome. You can post your suggestions [here](https://github.com/opendistro-for-elasticsearch/community/issues).

### Footnotes

1. <small id="f1">There are other functions that also consume node resources – like cluster coordination on master node, query coordination and result aggregation on coordinator node, or ingestion related tasks on ingest nodes. But since shards are at the center of any activity in Elasticsearch, shard footprint is the dominant resource utilization signal on data nodes.</small>
2. <small id="f2">As of this writing, i.e. Elasticsearch v7.6.1</small>
3. <small id="f3">Solving indexing hot spots with allocation constraints. [See Issue](https://github.com/elastic/elasticsearch/issues/43350)</small>


## About the Authors

Vigya Sharma is a Senior Software Engineer at Amazon Web Services. His projects focus on providing a managed service experience to AWS Elasticsearch customers. Vigya is passionate about distributed systems and likes to solve problems around large scale systems. Vigya holds a Masters degree in Computer Science from IIT Delhi.


Jon Handler is a Principal Solutions Architect at Amazon Web Services based in Palo Alto, CA. Jon works closely with the CloudSearch and Elasticsearch teams, providing help and guidance to a broad range of customers who have search workloads that they want to move to the AWS Cloud. Prior to joining AWS, Jon's career as a software developer included four years of coding a large-scale, eCommerce search engine. Jon holds a Bachelor of the Arts from the University of Pennsylvania, and a Master of Science and a Ph.D. in Computer Science and Artificial Intelligence from Northwestern University. You can follow him on Twitter @_searchgeek.
