---
layout: posts
author: Jon Handler
comments: true
title: Store Open Distro for Elasticsearch’s Performance Analyzer Output in Elasticsearch
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/24/image3.png"
---

[Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/)‘s [Performance Analyzer](https://github.com/opendistro-for-elasticsearch/performance-analyzer) plugin exposes a REST API that returns metrics from your Elasticsearch cluster. To get the most out of these metrics, you can store them in Elasticsearch and use Kibana to visualize them. While you can use Open Distro for Elasticsearch’s [PerfTop](https://github.com/opendistro-for-elasticsearch/perftop) to build visualizations, PerfTop doesn’t retain data and is meant to be lightweight.
In this post, I’ll explore Performance Analyzer’s API through a code sample that reads Performance Analyzer’s metrics and writes them to Elasticsearch. You might wonder why Performance Analyzer doesn’t do that already (we welcome your pull requests!). Performance Analyzer is designed as a lightweight co-process for Elasticsearch that decouples Elasticsearch monitoring from Elasticsearch failures. If your Elasticsearch cluster is in trouble, it might not be able to respond to requests, and Kibana might be down. If you adopt the sample code, I recommend that you send the data to a different Open Distro for Elasticsearch cluster to avoid this issue.
You can follow along with the sample code I published in our [GitHub Community repository](https://github.com/opendistro-for-elasticsearch/community). The code is in the `pa-to-es` folder when you clone the repository. You can find information about the other code samples in [past blog posts](https://aws.amazon.com/blogs/opensource/category/analytics/open-distro-for-elasticsearch/).

## Code overview

The `pa-to-es` folder contains three Python files (Python version 3.x required) and an Elasticsearch template that sets the type of the @timestamp field to be `date`. main.py is the application, consisting of an infinite loop that calls Performance Analyzer – pulling metrics, parsing those metrics, and sending them to Elasticsearch:

```json
    while 1:
        print('Gathering docs')
        docs = MetricGatherer().get_all_metrics()
        print('Sending docs: ', len(docs))
        MetricWriter(get_args()).put_doc_batches(docs)
```

As you can see, `main.py` supplies two classes — `MetricGatherer` and `MetricWriter`— to communicate with Elasticsearch. `MetricGatherer.get_all_metrics()` loops through the working metric descriptions in `metric_descriptions.py` calling `get_metric()` for each.
To get the metrics, MetricGatherer generates a URL of the form:
`http://localhost:9600/_opendistro/_performanceanalyzer/metrics?metrics=<metric>&dim=<dimensions>&agg=<aggregation>&nodes=all`
(You can get more details on Performance Analyzer’s API in our documentation.) The metric descriptions are `namedtuple`s, providing metric/dimension/aggregation trios. It would be more efficient to send multiples, but I found parsing the results so much more complicated that it made any performance gains less important. To determine the metric descriptions, I generated all of the possible combinations of metric/dimension/aggregation, tested, and retained the working descriptions in `metric_descriptions.py`. It would be great to build an API that exposes valid combinations rather than working from a static set of descriptions (did I mention, we welcome all pull requests?).
`MetricGatherer` uses `result_parse.ResultParser` to interpret the output of the call to Performance Analyzer. The output JSON consists of one element per node. Within that element, it returns a list of `fields`, followed by a set of `records`:

```json
{
  "XU9kOXBBQbmFSvkGLv4iGw": {
    "timestamp": 1558636900000,
     "data": {
      "fields":[
        {
          "name":"ShardID",
          "type":"VARCHAR"
        },
        {
          "name":"Latency",
          "type":"DOUBLE"
        },
        {
          "name":"CPU_Utilization",
          "type":"DOUBLE"
        }
      ],
      "records":[
        [
          null,
          null,
          0.016093937677199393
        ]
      ]
    }
  }, ...
```

`ResultParser` zips together the separated field names and values and generates a `dict`, skipping empty values. The `records` generator function uses this dict as the basis for its return, adding the timestamp from the original return body. `records` also adds the node name and the aggregation as fields in the `dict` to facilitate visualizing the data in Kibana.
`MetricWriter` closes the loop, taking the collection of `dict`s, each of which will be written as a document to Elasticsearch, building a `_bulk` body, and `POST`ing that batch to Elasticsearch. As written, the code is hard-wired to send the `_bulk` to `https://localhost:9200`. In practice, you’ll want to change the output to go to a different Elasticsearch cluster. The authentication for the POST request is admin:admin – be sure to change that when you [change your passwords for Open Distro for Elasticsearch](https://aws.amazon.com/blogs/opensource/change-passwords-open-distro-for-elasticsearch/).

## Add the template to your cluster

You can run the code as written, and you will see data flow into your Open Distro for Elasticsearch cluster. However, the timestamp returned by Performance Analyzer is a long int, Elasticsearch will set the mapping as `number`, and you won’t be able to use Kibana’s time-based functions for the index. I could truncate the timestamp or rewrite it so that the mapping is automatically detected. I chose instead to set a template.
The below template (`template.json` in the `pa-to-es` folder) sets the field type for @timestamp to `date`. You need to send this template to Elasticsearch before you send any data, auto-creating the index. (If you already ran `pa-to-es`, don’t worry, just `DELETE` any indices that it created.) You can use Kibana’s developer pane to send the template to Elasticsearch.
Navigate to `https://localhost:5601`. Log in, dismiss the splash screen, and select the DevTools tab. Click Get to work. Copy-paste the below text into the interactive pane and click the triangle to the right. (Depending on the version of Elasticsearch you’re running, you may receive a warning about type removal. It’s OK to ignore this warning.)

```json
POST _template/pa 
{
    "index_patterns": ["pa-*"],
    "settings": {
        "number_of_shards": 1
    },
    "mappings": {
        "log": {
            "properties": {
                "@timestamp": {
                    "type": "date"
                }
            }
        }
    }
}
```


## Monitoring Elasticsearch

I [ran esrally](https://aws.amazon.com/blogs/opensource/esrally-open-distro-for-elasticsearch/), with the `http_logs` track against my Open Distro for Elasticsearch, and also ran `main.py` to gather metrics. I then used the data to build a Kibana dashboard for monitoring my cluster.

<div style="text-align: center; margin: 15px 0;">
	<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/24/image3.png" style="width: 100%;">
</div>


## Conclusion

The metrics stored in Elasticsearch documents have a single metric/dimensions/aggregation combination, giving you freedom to build Kibana visualizations at the finest granularity. For example, my dashboard exposes CPU utilization down to the Elasticsearch operation level, by shard, the disk wait time on each node, and read and write throughput for each operation. In a future post, I will dive deep on building out dashboards and other visualizations with Performance Analyzer data.

