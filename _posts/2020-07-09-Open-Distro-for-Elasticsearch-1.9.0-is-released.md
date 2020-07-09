---
layout: posts
author: Viraj Phanse
comments: true
title: "Open Distro for Elasticsearch 1.9.0 is now available"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---
We are pleased to announce the release for [Open Distro for Elasticsearch 1.9.0](https://opendistro.github.io/for-elasticsearch/downloads.html) that introduces [Root Cause Analysis Engine in Performance Analyzer](https://github.com/opendistro-for-elasticsearch/performance-analyzer-rca), batch actions like [start, stop](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/195) and [delete](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/204) for anomaly detectors in Anomaly Detection, [support for remote cluster indexes](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/244) in Anomaly Detection, and an ability to [set index priority action](https://github.com/opendistro-for-elasticsearch/index-management/pull/241) in Index State Management feature. Open Distro for Elasticsearch 1.9.0 can be downloaded [here](https://opendistro.github.io/for-elasticsearch/downloads.html).

The release consists of Apache 2.0 licensed Elasticsearch version 7.8.0, and Kibana version 7.8.0. This distribution also includes alerting, anomaly detection, index management, performance analyzer, security, SQL and k-NN plugins. Other components including SQL Workbench, SQL ODBC and JDBC drivers, SQL CLI client, and PerfTop, a client for Performance Analyzer are also available for download.

## Download the latest packages

You can find [Docker Hub images Open Distro for Elasticsearch 1.9.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.9.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana)on Docker Hub. Make sure your compose file specifies 1.9.0 or uses the ‘latest’ tag.
If you’re using RPMs or DEBs, see our documentation on how to install [Open Distro for Elasticsearch with RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and install [Open Distro for Elasticsearch with Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). A [tarball](https://opendistro.github.io/for-elasticsearch-docs/docs/install/tar/) is also available for testing and other applications.
A [Windows ready package](https://opendistro.github.io/for-elasticsearch-docs/docs/install/windows/) supporting version 1.9.0 enables users to easily install Elasticsearch and Kibana on Windows. If you’re using Kubernetes, check out the [Helm chart](https://opendistro.github.io/for-elasticsearch-docs/docs/install/helm/) to install Open Distro for Elasticsearch.
You can find Open Distro for Elasticsearch security, alerting notification and job scheduler artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch).
You can download the latest versions of [Open Distro for Elasticsearch’s PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) on npm.org, Open Distro for Elasticsearch’s latest [SQL CLI client](https://pypi.org/project/odfe-sql-cli/) on PyPi. SQL drivers supporting [ODBC and JDBC](https://opendistro.github.io/for-elasticsearch/downloads.html#SQL) are also available.

## Release Highlights

* Introducing [Root Cause Analysis Engine](https://github.com/opendistro-for-elasticsearch/performance-analyzer-rca) in Performance Analyzer to facilitate conducting root cause analysis (RCA) for performance and reliability problems in Elasticsearch clusters
* Allowing batch actions such as [start, stop](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/195) and [delete](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/204) on anomaly detectors as part of the Anomaly Detection feature
* [Support for remote cluster indexes](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/244) in Anomaly Detection
* Introduce an ability to [set index priority action](https://github.com/opendistro-for-elasticsearch/index-management/pull/241) so that users are allowed to set the order of index recovery in Index State Management

Please take a look at the [1.9.0 release notes](https://github.com/opendistro-for-elasticsearch/opendistro-build/blob/master/release-notes/opendistro-for-elasticsearch-release-notes-1.9.0.md) or the latest features, enhancements, infra and documentation updates and bug fixes. Upgrade to  [1.9.0](https://opendistro.github.io/for-elasticsearch/downloads.html) to leverage the latest features and bug fixes.

## Come join our community!

There are many easy ways to participate in the Open Distro community!

Ask questions and share your knowledge with other community members on the [Open Distro discussion forums](https://discuss.opendistrocommunity.dev/).
Attend our [bi-weekly online community meetup](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group) to learn more about Elasticsearch, security, performance, machine learning and more.

File an issue, request an enhancement you need or suggest a plugin you need at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch).

Contribute code, tests, documentation and even release packages at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch). If you want to showcase how you’re using Open Distro, write a blog post for [opendistro.github.io/blog](https://opendistro.github.io/blog). If you’re interested, please reach out to me on Twitter. You can find me at @vrphanse.

We also invite you to get involved in ongoing development of new Open Distro for Elasticsearch plugins, clients, drivers. Contribute code, documentation or upcoming features like [Kibana Reports](https://github.com/opendistro-for-elasticsearch/kibana-reports), and [Historical Workbench in Anomaly detection](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/issues/214).

You can also track upcoming features in Open Distro for Elasticsearch by watching the code repositories or checking the [roadmap](https://github.com/orgs/opendistro-for-elasticsearch/projects/3)

Thanks again for using and contributing to Open Distro for Elasticsearch and being part of the project’s growing community!

## About the Author(s)

Viraj Phanse is a Senior Product Manager at Amazon Web Services for Search Services. You can find them on GitHub or Twitter @vrphanse
