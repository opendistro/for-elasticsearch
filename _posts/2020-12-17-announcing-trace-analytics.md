---
layout: posts
author: Rajiv Taori 
comments: true
title: "Announcing alpha availability of Trace Analytics for distributed tracing"
categories:
- releases
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---


Today we are excited to announce an alpha release of Trace Analytics, a new capability in Open Distro for Elasticsearch, that enables developers to find and fix performance problems in distributed applications. By adding trace data to the existing log analytics capabilities of Open Distro for Elasticsearch, developers can use a single solution to both isolate the source of performance problems and diagnose their root cause. By building on [OpenTelemetry](https://opentelemetry.io/), a Cloud Native Computing Foundation (CNCF) project, which provides a single set of APIs, libraries, agents, and collector services to capture distributed traces, we are opening up applications to be monitored by Open Distro for Elasticsearch without requiring developers to re-instrument their applications. 

As more applications move to the cloud and shift to distributed models, troubleshooting can become increasingly challenging for developers and IT Ops. Distributed applications can be composed of hundreds of shared services, enabling each service to scale and evolve independently. However, managing and monitoring distributed applications with traditional methods that rely on analyzing logs and metrics of each component in their own silo, does not provide end-to-end visibility. The inability to quickly identify the source of performance and availability issues, leads to long problem resolution times, and degraded customer experiences.

To fill this gap, many developers today use open source tools like Jaeger and Zipkin to collect trace data, which is a specialized form of machine generated data that follows requests and responses across a microservices architecture. Trace Analytics builds on the trace data collection from Jaeger, Zipkin, and OpenTelemetry SDKs by providing new insights on application performance. For example, aggregating similar traces into “trace groups” enables percentile performance monitoring (P80, P90, P95, etc.) of key application transaction activity, and creation of “service maps” from trace data provides developers a real-time view of service performance and service dependencies. Monitoring application transaction activity and service performance can help to quickly identify errors and anomalous latencies, effectively enabling developers to “find the needle in the haystack.” In addition, after trace data has identified the source of a problem, developers can use trace identifiers propagated in log events to investigate and identify root cause. 


## Trace Analytics highlights

Today Trace Analytics alpha release is available in Open Distro for Elasticsearch. In addition to supporting [OpenTelemetry SDKs](https://opentelemetry.io/docs/concepts/instrumenting/), Trace Analytics supports integration with [Jaeger](https://www.jaegertracing.io/) and [Zipkin](https://zipkin.io/) SDKs, two popular open source distributed tracing systems. The Trace Analytics feature uses open source components such as the OpenTelemetry collector, and also adds new open source components to Open Distro for Elasticsearch, such as Data Prepper and a Kibana plugin, which are described in more detail below.

* Trace Analytics uses the [OpenTelemetry](https://opentelemetry.io/docs/collector/) [collector](https://opentelemetry.io/docs/collector/) as the default collector for collection of trace data, with support for both the OpenTelemetry and [OpenTracing](https://opentracing.io/) standards. Trace Analytics supports application SDK’s compatible with both the OpenTelemetry standard and the [OpenTracing](https://opentracing.io/) standard (such as [Jaeger](https://www.jaegertracing.io/) and [Zikpin](https://zipkin.io/)).
* Trace Analytics also integrates with [AWS Distro for OpenTelemetry](https://aws-otel.github.io/), which is a distribution of OpenTelemetry APIs, SDKs, and agents/collectors. It is a performant and secure distribution of OpenTelemetry components that has been tested for production use and is supported by AWS. Customers can use AWS Distro for OpenTelemetry to collect traces and metrics for multiple monitoring solutions, including Open Distro for Elasticsearch and AWS X-Ray for traces, and Amazon CloudWatch for metrics.
* [Data Prepper](https://github.com/opendistro-for-elasticsearch/Data-Prepper) is a new component of Open Distro for Elasticsearch that receives trace data from the OpenTelemetry collector, and aggregates, transforms, and normalizes it for analysis and visualization in Kibana. Details on how to configure Data Prepper for Trace Analytics can be found [Readme for Data Prepper](https://github.com/opendistro-for-elasticsearch/Data-Prepper/blob/master/README.md).
* A new [Trace Analytics Kibana plugin](https://github.com/opendistro-for-elasticsearch/trace-analytics/) enables views of each individual trace in a waterfall-style graph of all the related trace and span executions, which makes to easy to identify all the service invocations for each trace, time spent in each service and each span, and the payload content of each span, including errors.
* The Trace Analytics Kibana plugin also aggregates trace data into Trace Group views and Service Map views, to enable monitoring insights of application performance on trace data. By going beyond the ability to search and analyze individual traces, these features enable developers to proactively identify application performance issues, not just react to problems when they occur. Details on how to configure it can be found in the [Readme for Trace Analytics Kibana plugin](https://github.com/opendistro-for-elasticsearch/trace-analytics/blob/main/README.md).



## Getting Started with Trace Analytics using a sample application

Let’s walk through the steps of installing a Docker image with a sample app that is instrumented with the OpenTelemetry SDK, and monitoring the applications performance using Trace Analytics.

### Prerequisite

- Git
- Docker - any above version 18.06.0+

### Step 1: Git clone the Data Prepper github project

```
git clone https://github.com/opendistro-for-elasticsearch/Data-Prepper.git 
```

### Step 2: Change to example `trace-analytics-sample-app` directory

```
cd Data-Prepper/examples/trace-analytics-sample-app 
```

### Step 3: Launch the `docker-compose`

```
docker-compose up -d  
```

Note: This step could take 10-15 minutes and to complete

### Step 4: Access sample application

The sample application Docker setup also launched Elasticsearch and Kibana, so it takes about 5 minutes for everything to be available. The sample application has simple UI which has 5 actions which produce traces. To use this UI navigate to  `http://localhost:8089/`.  
You should see a page like the image below. You can click on any of the buttons to generate transactions which will be captured as traces by Trace Analytics.

![Screenshot of Demo](/for-elasticsearch/assets/media/blog-images/2020-12-14-announcing-trace-analytics-1.png){: .img-fluid}

###  Step 5: Connect to the Trace Analytics Kibana plug-in to view results

Navigate to the Trace Analytics Kibana plugin at 
[`http://localhost:5601/app/opendistro-trace-analytics`](http://localhost:5601/app/opendistro-trace-analytics). This step will ask for Kibana username and password, which by default is set to admin/admin. Once authenticated, you should see the main Dashboard with additional tabs for Traces and Services.

The dashboard tab shows a summary of all traces aggregated by Trace Groups. Each trace group represents all traces that share a common API endpoint and API operation name. Each trace group shows the range of latency for the selected time range, along with the average latency, 24-hour latency trend thumbnail, error rate, and trace count. By clicking on a field in blue, you can filter this view by the selected attribute such as time range, percentile performance, or trace group name.

![Screenshot of UI](/for-elasticsearch/assets/media/blog-images/2020-12-14-announcing-trace-analytics-2.png){: .img-fluid}

Selecting the trace count drills down into the Traces tab to see a list of all the selected traces. This list of traces can be sorted by clicking on any of the column headers such as Trace ID and Latency. 
![Screenshot of UI](/for-elasticsearch/assets/media/blog-images/2020-12-14-announcing-trace-analytics-3.png){: .img-fluid}

Clicking on a trace ID allows you to drill into a detailed view of the trace execution performance. You can see a service performance view, and a waterfall performance view of the trace. 

* The service performance view shows total time spent in each service in the trace execution path. For example, time spent in multiple calls to the same service are aggregated to summarize the total time spent in that service. 
* The waterfall performance view show all the trace and span performance details in the order of execution.

![Screenshot of UI](/for-elasticsearch/assets/media/blog-images/2020-12-14-announcing-trace-analytics-4.png){: .img-fluid}

The Service tab has a tabular view of all services, and a network graph view of the interconnected services built from aggregating information from all trace data. On the Service Map view you can select the buttons for latency, error rate, and throughput, to view these performance attributes for each service over the selected time range.

![Screenshot of UI](/for-elasticsearch/assets/media/blog-images/2020-12-14-announcing-trace-analytics-5.png){: .img-fluid}

For this sample application above, we see how Trace Analytics can help identify key transaction execution paths as Trace Groups, monitor their performance to identify outlier (e.g P95 performance) trace instances, and drill into those instances to identify the service bottleneck. Trace identifiers can also be used to search for log events on the service node to get to root cause. An end-to-end view of the application in a Service Map also help identify upstream and downstream dependencies of key services, to further accelerate identification of root cause.

### Summary

In this post, we introduced Trace Analytics and walked through an example on how to use the OpenTelemetry SDK to send trace data to Open Distro for Elasticsearch. With OpenTelemetry, developers can instrument their applications once using open source OpenTelemetry APIs and SDKs, and send traces to Open Distro for Elasticsearch or any monitoring backend of their choice. Trace Analytics enables developers and IT operators to find and fix performance problems in distributed applications leading to faster problem resolution times. Learn more about Trace Analytics and how to get started using tracing on your applications in our [documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/trace/). You can also connect with us and provide feedback in our [forum](https://discuss.opendistrocommunity.dev/c/trace-analytics/49).


