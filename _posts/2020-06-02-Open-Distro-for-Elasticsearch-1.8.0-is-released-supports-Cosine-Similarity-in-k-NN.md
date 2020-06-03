---
layout: posts
author: Viraj Phanse, Pavani Baddepudi, Alolita Sharma
comments: true
title: "Open Distro for Elasticsearch 1.8.0 is released, supports Cosine Similarity in k-NN"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

We are pleased to announce the release for Open Distro for Elasticsearch 1.8.0. that now supports cosine similarity distance metric with k-NN. We released k-NN similarity search feature in Open Distro for Elasticsearch 1.4.0 with support for Euclidean distance to calculate similarity between the vectors. With cosine similarity, you can now measure the orientation between two vectors while Euclidean distance is used to measure the magnitude. We would also like to thank our community for contributing snapshot support in Index Management. This feature enables users to define snapshot action in Index State Management for retention and to migrate indices from one cluster to another. Open Distro for Elasticsearch 1.8.0 can be downloaded [here](https://opendistro.github.io/for-elasticsearch/downloads.html).

The release consists of Apache 2.0 licensed Elasticsearch version 7.7.0, and Kibana version 7.7.0. This distribution also includes alerting, anomaly detection, index management, performance analyzer, security, SQL and k-NN plugins. Other components including SQL Workbench, SQL ODBC and JDBC drivers, SQL CLI client, and PerfTop, a client for Performance Analyzer are also available for download.


## Download the latest packages

You can find Docker Hub images [Open Distro for Elasticsearch 1.8.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.8.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.8.0 or uses the ‘latest’ tag.

If you’re using RPMs or DEBs, see our documentation on how to install Open Distro for Elasticsearch with [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and install Open Distro for Elasticsearch with [Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). A [tarball](https://opendistro.github.io/for-elasticsearch-docs/docs/install/tar/) is also available for testing and other applications.

A [Windows ready package](https://opendistro.github.io/for-elasticsearch-docs/docs/install/windows/) supporting version 1.8.0 enables users to easily install Elasticsearch and Kibana on Windows.
If you’re using Kubernetes, check out the [Helm chart](https://opendistro.github.io/for-elasticsearch-docs/docs/install/helm/) to install Open Distro for Elasticsearch.

You can find Open Distro for Elasticsearch security, alerting notification and job scheduler artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch).

You can download the latest versions of Open Distro for Elasticsearch’s [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) on npm.org, [Open Distro for Elasticsearch’s latest SQL CLI client](https://pypi.org/project/odfe-sql-cli/) on PyPi. SQL drivers supporting ODBC and [JDBC are also available.](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-clients/opendistro-sql-jdbc/opendistro-sql-jdbc-1.7.0.0.jar)

## Release Highlights

* New feature [Cosine Similarity](https://github.com/opendistro-for-elasticsearch/k-NN/pull/90) is available for use in k-NN plugin.
* The [snapshot](https://github.com/opendistro-for-elasticsearch/index-management/pull/135) feature is now available in the Index Management plugin.
* Anomaly Detection plugin releases the new [count aggregation](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/169) feature to detect anomalies.
* [PerfTop CLI](https://opendistro.github.io/for-elasticsearch/downloads.html#PerfTop), a client to interact with Performance Analyzer.

Please take a look at the [1.8.0 release notes](https://github.com/opendistro-for-elasticsearch/opendistro-build/blob/master/release-notes/release-notes-odfe-1.7.0.md) for the latest features, enhancements, infra and documentation updates and bug fixes. [Upgrade to 1.8.0](https://opendistro.github.io/for-elasticsearch/downloads.html) to leverage the latest features and bug fixes.


## Come join our community!

There are many easy ways to participate in the Open Distro community!

Ask questions and share your knowledge with other community members on the Open Distro [discussion forums](https://discuss.opendistrocommunity.dev/).

Attend our bi-weekly online [community meetup](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group) to learn more about Elasticsearch, security, performance, machine learning and more.

File an issue, request an enhancement you need or suggest a plugin you need at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch).

Contribute code, tests, documentation and even release packages at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch). If you want to showcase how you’re using Open Distro, write a blog post for [opendistro.github.io/blog](https://opendistro.github.io/blog). If you’re interested, please reach out to us on Twitter. You can find us at Viraj at @vrphanse or Alolita at @alolita or Jon at @jon_handler.

We also invite you to get involved in ongoing development of new Open Distro for Elasticsearch plugins, clients, drivers. Contribute code, documentation or tests for [Performance Analyzer RCA Engine.](https://github.com/opendistro-for-elasticsearch/performance-analyzer-rca)

You can also track upcoming features in Open Distro for Elasticsearch by watching the code repositories or checking the [project website.](https://opendistro.github.io/for-elasticsearch/features/comingsoon.html)

Thanks again for using and contributing to Open Distro for Elasticsearch and being part of the project’s growing community!


## About the Authors

Viraj Phanse is a Senior Product Manager at Amazon Web Services for Search Services. You can find him on GitHub or Twitter @vrphanse.

Pavani Baddepudi is a Senior Product Manager working in Search Services at Amazon Web Services.

Alolita Sharma is a Principal Technologist at AWS focused on all things open source including Open Distro for Elasticsearch. You can find her on GitHub or Twitter @alolita.
