---
layout: mute
author: Rajiv Taori
comments: true
title: "Data Prepper enhancements for monitoring and horizontal scalability"
category:
- releases
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

We are pleased to announce a beta version (0.8.0-beta) of Data Prepper is available for download and includes enhancements for new monitoring metrics and horizontal scalability. [Data Prepper](https://github.com/opendistro-for-elasticsearch/data-prepper) receives trace data from the OpenTelemetry collector, and aggregates, transforms, and normalizes it for analysis and visualization in the Trace Analytics Kibana plugin. We have previously announced [alpha availability](https://opendistro.github.io/for-elasticsearch/blog/releases/2020/12/announcing-trace-analytics/) of Trace Analytics on Open Distro for Elasticsearch. You can get the latest version from the [Getting Started & Downloads page](https://opendistro.github.io/for-elasticsearch/downloads.html).

Metrics state for Data Prepper instances can be accessed via an API in a format that is compatible with [Prometheus](https://prometheus.io/) monitoring. Metrics API is accessible at `/metrics/prometheus`, and includes metrics for monitoring the prepper, sink, and buffer components. These metrics can be used to make decisions on horizontal scaling of Data Prepper, which may be required when processing higher throughput Trace Analytics workloads. To enable horizontal scaling, you can run Data Prepper instances in a cluster with requests distributed by a load balancer. The creation of service maps in Trace Analytics requires certain span information to be held in memory on Data Prepper nodes, and therefore requires instances in a Data Prepper cluster to forward requests to other specific instances within the cluster. A peer forwarder capability in Data Prepper has been added to support this.

Details on how to configure Data Prepper for Trace Analytics can be found in [Readme for Data Prepper](https://github.com/opendistro-for-elasticsearch/Data-Prepper/blob/master/README.md), and in the [release notes](https://github.com/opendistro-for-elasticsearch/data-prepper/tree/main/release/release-notes).

If you’re already part of our community of users and contributors to Trace Analytics and OpenTelemetry support, a hearty ‘thank you’ from the entire team goes to you. We’re glad you’ve joined us on this journey and we deeply hope that this release solves a few problems and delights you along the way.