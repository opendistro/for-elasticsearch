---
layout: page
auther: Jon Handler
title: Use Elasticsearch’s _rollover API For Efficient Storage Distribution
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/06/Rollover1.jpg"
---

Many [Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/) users manage data life cycle in their clusters by creating an index based on a standard time period, usually one index per day. This pattern has many advantages: ingest tools like Logstash support index rollover out of the box; defining a retention window is straightforward; and deleting old data is as simple as dropping an index.

If your workload has multiple data streams with different data sizes per stream, you can run into problems: Your resource usage, especially your storage per node, can become unbalanced, or “skewed.” When that happens, some nodes will become overloaded or run out of storage before other nodes, and your cluster can fall over.

You can use the _rollover API to manage the size of your indexes. You call _rollover on a regular schedule, with a threshold that defines when Elasticsearch should create a new index and start writing to it. That way, each index is as close to the same size as possible. When Elasticsearch distributes the shards for your index to nodes in your cluster, you use storage from each node as evenly as possible.

<!-- more -->

## What is skew?

Elasticsearch distributes shards to nodes based primarily on the count of shards on each node (it’s more complicated than that, but that’s a good first approximation). When you have a single index, because the shards are all approximately the same size, you can ensure even distribution of data by making your shard count divisible by your node count. For example, if you have five primaries and one replica, or ten total shards, and you deploy two nodes, you will have five shards on each node (Elasticsearch always places a primary and its first replica on different nodes).


![](https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/06/Rollover1.jpg)


When you have multiple indexes, you get heterogeneity in the storage per node. For example, say your application is generating one GB of log data per day and your VPC Flow Logs are ten GB per day. For both of these data streams, you use one primary shard,and one replica, following the best practice of up to 50GB per shard. Further, assume you have six nodes in your cluster. After seven days, each index has 14 total shards (one primary and one replica per day). Your cluster might look like the following – in the best case, you have even distribution of data:


![](https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/06/Rollover2.jpg)


In the worst case, assume you have five nodes. Then your shard count is indivisible by your node count, so larger shards can land together on one node, as in the image below. The nodes with larger shards use ten times more storage than the nodes with smaller shards.
While this example is somewhat manufactured, it represents a real problem that Elasticsearch users must solve.


![](https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/06/Rollover3.jpg)


## Rollover instead!

The [_rollover API](https://www.elastic.co/guide/en/elasticsearch/reference/7.0/indices-rollover-index.html) creates a new index when you hit a threshold that you define in the call. First, you create an [_alias](https://www.elastic.co/guide/en/elasticsearch/reference/7.0/indices-aliases.html) for reading and writing the current index. Then you use cron or other scheduling tool to call the _rollover API on a regular basis, e.g. every minute. When your index exceeds the threshold, Elasticsearch creates a new index behind the alias, and you continue writing to that alias.
To create an alias for your index, call the _aliases API:


```json
`POST _aliases
{"actions": [
	{
		"add": {
			"index": "weblogs-000001",
			"alias": "weblogs",
			"is_write_index": true
		}
	}
  ]
}`
```
<br>
You must set is_write_index to true to tell _rollover which index it needs to update.
When you call the _rollover API:


```json
`POST /weblogs/_rollover {"conditions": {"max_size":  "10gb"}}`
```
<br>
You will receive a response that details which of the conditions, if any, is true and whether Elasticsearch created a new index as a result of the call. If you name your indexes with a trailing number (e.g. -000001), Elasticsearch increments the number for the next index it creates. In either case, you can continue to write to the alias, uninterrupted.
Elasticsearch 7.x accepts three conditions: max_age, max_docs, and max_size. If you call _rollover with the same max_size across all of your indexes, they will all roll over at approximately the same size. [Note: Size is difficult to nail down in a distributed system. Don’t expect that you will hit exactly the same size. Variation is normal. In fact, earlier versions of Elasticsearch don’t accept max_size as a condition. For those versions, you can use max_docs, normalizing for your document size.]
The one significant tradeoff is in lifecycle management. Returning to our prior example, let’s say you roll over on ten GB of index. The data stream with ten GB daily will roll over every day. The data stream with one GB of index daily will roll over every ten days. You need to manage these indexes at different times, based on their size. Data in the lower-volume indexes will persist for longer than data in higher-volume indices.

## Conclusion

When running an Elasticsearch cluster with multiple data streams of different sizes, typically for log analytics, you use the _rollover API to maintain a more nearly even distribution of data in your cluster’s nodes. This prevents skew in your storage usage and results in a more stable cluster.
Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).



