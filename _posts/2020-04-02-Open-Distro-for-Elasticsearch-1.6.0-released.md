---
layout: posts
author: Alolita Sharma
comments: true
title: "Open Distro for Elasticsearch 1.6.0 Released"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---


Open Distro for Elasticsearch 1.6.0 is now available for [download](https://opendistro.github.io/for-elasticsearch/downloads.html).

This release consists of Apache-2 licensed Elasticsearch 7.6.1, Kibana 7.6.1 and plugins for alerting, index management, performance analyzer, security, SQL and machine learning with k-NN. Also included are a SQL JDBC driver and PerfTop, a client for Performance Analyzer.

## Download the latest packages

You can find Docker Hub images [Open Distro for Elasticsearch 1.6.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.6.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.6.0 or uses the latest tag.

If you're using RPMs or DEBs, see our documentation on how to install Open Distro for Elasticsearch with [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and install Open Distro for Elasticsearch with [Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). A [tarball](https://opendistro.github.io/for-elasticsearch-docs/docs/install/tar/) is also available for testing and other applications.

With [Windows exe](https://opendistro.github.io/for-elasticsearch-docs/docs/install/windows/) supporting version 1.6.0, users can now easily install Elasticsearch and Kibana on Windows.

If you're using Kubernetes, check out the [Helm chart](https://opendistro.github.io/for-elasticsearch-docs/docs/install/helm/) to install Open Distro for Elasticsearch.

You can find our Open Distro for Elasticsearch security plugin artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch). You can download the latest versions of Open Distro for Elasticsearch’s [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop), and Open Distro for Elasticsearch’s [SQL JDBC driver](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-clients/opendistro-sql-jdbc/opendistro-sql-jdbc-1.6.0.0.jar).

## Release highlights

Release highlights include security plugin optimization for a faster version of the implied permission type, memoization of results for batch requests, implementation of lazy loading for efSearch parameter in the k-NN plugin, improved exception handling and report date handling using standard formats for the SQL plugin.

Please take a look at the 1.6.0 [release notes](https://github.com/opendistro-for-elasticsearch/) for the latest features, enhancements, infra and config updates and bug fixes. [Upgrade to 1.6.0](https://opendistro.github.io/for-elasticsearch/downloads.html) to leverage the latest features and bug fixes.

We invite you to get involved in ongoing development of new Open Distro for Elasticsearch plugins. Consider contributing code, documentation or tests for [Performance Analyzer RCA Engine](https://github.com/opendistro-for-elasticsearch/performance-analyzer-rca),  machine learning components like [Anomaly Detection](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin) and its [Kibana UI](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin)as well as the [_SQL ODBC Driver_](https://github.com/opendistro-for-elasticsearch/sql-odbc).

## Come join our community!

There are many easy ways to participate. Ask questions and share your knowledge with other community members on the Open Distro [discussion forums](https://discuss.opendistrocommunity.dev/). Attend our bi-weekly online [community meetup](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group) to learn more about Elasticsearch, security, performance, machine learning and more.

File an issue, request an enhancement you need or suggest a plugin you need at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch). Contribute code, tests, documentation and even release packages at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch). If you want to showcase how you’re using Open Distro, write a blog post for [opendistro.github.io/blog](https://opendistro.github.io/blog). Please reach out to us on Twitter. You can find me @alolita or Jon at @jon_handler.

Stay safe. Stay healthy!

## About the Author

Alolita Sharma is a Principal Technologist at AWS focused on all things open source including Open Distro for Elasticsearch. You can find her on Twitter @alolita.
