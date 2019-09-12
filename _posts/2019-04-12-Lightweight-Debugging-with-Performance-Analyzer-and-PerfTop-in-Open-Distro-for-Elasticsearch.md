---
layout: posts
author: Jon Handler
comments: true
title: Lightweight Debugging with Performance Analyzer and PerfTop in Open Distro for Elasticsearch
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/12/perftop_diagram1.jpeg"
---
When you want to monitor your Elasticsearch cluster or debug an issue, you have a number of choices. You can use the various _cat and stats APIs to pull information out of the cluster. You can monitor and profile the JVM itself. These options can be cumbersome, and they lack visual displays. While you could push _cat and stats data back into Elasticsearch and visualize with Kibana, sometimes you want a more lightweight method.
[Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/) ships with two components that combine to give you the lightweight tool you need to quickly retrieve and display core metrics. [Performance Analyzer](https://github.com/opendistro-for-elasticsearch/performance-analyzer) is an agent and REST API that allows you to query numerous performance metrics for your cluster, including aggregations of those metrics, independent of the Java Virtual Machine (JVM). Performance Analyzer runs on and collects metrics from the same nodes that you use to run Elasticsearch. [PerfTop](https://github.com/opendistro-for-elasticsearch/perftop) is a lightweight, command-line tool patterned after Linux’s *top* command. You use simple JSON to define dashboards; PerfTop displays these dashboards in your favorite terminal application.

## Setup

Performance Analyzer is part of the binary distribution of Open Distro for Elasticsearch. You run it when you run Open Distro. I wrote some simple instructions on [getting up and running](https://aws.amazon.com/blogs/opensource/running-open-distro-for-elasticsearch/) with Docker for Mac OS. You can follow those instructions, or follow the more detailed [instructions in the Open Distro for Elasticsearch documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/install/) for .rpm or Docker installs.
You can find the PerfTop binary for your Linux or Mac OS system on [our downloads page](https://opendistro.github.io/for-elasticsearch/downloads.html).

## Running

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/12/perftop_diagram1.jpeg" style="width: 100%;">
</div>

PerfTop is a Javascript application that polls Performance Analyzer’s API to pull metrics and display them in Graphs—widgets that display one or more metrics across one or more of their dimensions. You specify which metrics and graphs PerfTop displays by providing a dashboard configuration. Your configuration defines a grid of rows and columns. You place graphs on this grid, sizing them with row and column counts.

## Metrics

[Performance Analyzer provides data for more than 75 metrics](https://opendistro.github.io/for-elasticsearch-docs/docs/pa/reference/), covering everything from network to disk to internal modules like the garbage collector. Some of the more interesting categories of metrics are:

* 
    * Paging_*, and Sched_*: these cover low-level operating system metrics and will help you understand how the operating system is running jobs and how well it is caching Lucene’s underlying data structures
    * IO_*: Monitor the demand on and performance of I/O operations. This can be especially important to validate that your disk can deliver the desired read and write rates for your workload.
    * Cache_*: Elasticsearch caches various data internally. You can use these metrics to find the efficiency of its caching.
    * Refresh_*, Flush_*, and Merge_*: Use these metrics to monitor the efficiency of your write operations. If you’re spending too much time refreshing, flushing, and merging, increase your *refresh_interval*.
    * *_Memory: Dig into the usage of your JVM memory. With these metrics you can uncover systematic problems with your mappings, or shard strategy.
    * Disk_*, Net_*: expose underlying usage of your disk and network.
    * Threadpool_*: examine how work is being distributed within your cluster. Look for resource insufficiencies by finding where your data is queueing.

## Dimensions

Depending on the metric, Performance Analyzer exposes one or more dimensions for that metric. For example, the Threadpool_* metrics all have a single dimension, ThreadPoolType. When you add one of the threadpool metrics to a graph, it will show each of the values for the dimension (individual thread pool queues) in the graph, up to its allocated space on the grid.
If a metric has more than one dimension, you can display multiple dimensions in the same graph. You specify a comma-separated string in your configuration. See below.

## Aggregations

You can aggregate the underlying data for a metric/dimension in the usual ways—sum, avg, min, and max.

## Defining Dashboards

PerfTop comes with four dashboards included. You can use those to get a feel for using PerfTop and customize them for your own use. This post gives you the basics of the structure and contents of a dashboard file. Stay tuned for a deeper dive.
You define a dashboard by creating a JSON file, and specifying that file on the command line when you run PerfTop. A dashboard comprises an initial section with the Performance Analyzer’s endpoint, and the grid size, followed by a collection of graphs. You can specify zero or many tables, lines, and bars in the graphs section.

```
`{"endpoint": "localhost:9600","gridOptions": {"rows": 12,"cols": 12},"graphs": {"tables": [],"lines": [],"bars": []}}`
```

When you define table, line, and bar graphs, you specify the metrics, dimensions, and aggregations for that graph. You specify parameters that control the display of the graph as well, including the grid size of the graph and optional parameters for that graph type.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/12/Table-1024x324.png" style="width: 100%;">
</div>

The above table, from the example ClusterOverview.json dashboard shows three metrics: CPU_Utilization, IO_ReadThroughput, and IO_WriteThroughput. Its JSON description uses a comma-separated string with these metrics. Each metric displays three dimensions: Operation, IndexName, and ShardID, aggregated with sum in all cases. When you display multiple dimensions, the aggregations and dimensions you provide are both comma-separated strings, must be of the same length, and are parsed and interpreted left-to right, one dimension and one aggregation at a time:

```
`    "tables": [{"queryParams" : {"metrics": "CPU_Utilization,IO_ReadThroughput,IO_WriteThroughput","dimensions": "Operation,IndexName,ShardID","aggregates": "sum,sum,sum","sortBy": "CPU_Utilization"},"options": {"gridPosition": {"row": 0,"col": 0,"rowSpan": 4,"colSpan": 7},"label": "Resource Metrics","keys": false,"fg": "green","selectedFg": "green","selectedBg": " ","columnSpacing": 1,"refreshInterval": 5000}},…`
```

## Conclusion

This post aimed to get you started with Open Distro for Elasticsearch’s Performance Analyzer and PerfTop. We’ve barely scratched the surface of the metrics available in Performance Analyzer. You can and should dig in to the underlying disk, network, cpu, and process usage to monitor and correct resource bottlenecks in your Open Distro for Elasticsearch clusters. You can use PerfTop as a lightweight dashboard and debugging tool to quickly identify and correct issues with your cluster.
Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

