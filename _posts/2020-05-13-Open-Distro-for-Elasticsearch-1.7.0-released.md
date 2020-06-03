---
layout: posts
author: Alolita Sharma
comments: true
title: "Open Distro for Elasticsearch 1.7.0 Released"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

Open Distro for Elasticsearch 1.7.0 is now available for [download](https://opendistro.github.io/for-elasticsearch/downloads.html). [Upgrade to 1.7.0](https://opendistro.github.io/for-elasticsearch/downloads.html) to leverage the latest features and bug fixes.

The release consists of Apache 2.0 licensed Elasticsearch version 7.6.1, Kibana version 7.6.1, new plugins for anomaly detection and SQL workbench, a new SQL ODBC driver and SQL CLI client. Other plugins in the distribution include alerting, index management, performance analyzer, security, SQL and machine learning with k-NN. A SQL JDBC driver and PerfTop, a client for Performance Analyzer are also available for download.

## Download the latest packages

You can find Docker Hub images [Open Distro for Elasticsearch 1.7.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.7.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.7.0 or uses the latest tag.

If you’re using RPMs or DEBs, see our documentation on how to install Open Distro for Elasticsearch with [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and install Open Distro for Elasticsearch with [Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). A [tarball](https://opendistro.github.io/for-elasticsearch-docs/docs/install/tar/) is also available for testing and other applications.

A [Windows ready package](https://opendistro.github.io/for-elasticsearch-docs/docs/install/windows/) supporting version 1.7.0 enables users to easily install Elasticsearch and Kibana on Windows.

If you’re using Kubernetes, check out the [Helm chart](https://opendistro.github.io/for-elasticsearch-docs/docs/install/helm/) to install Open Distro for Elasticsearch.

You can find Open Distro for Elasticsearch security, alerting notification and job scheduler artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch).

You can download the latest versions of Open Distro for Elasticsearch’s [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) on NPM, Open Distro for Elasticsearch’s latest [SQL CLI client](https://pypi.org/project/odfe-sql-cli/) on PyPi. SQL drivers supporting ODBC and [JDBC](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-clients/opendistro-sql-jdbc/opendistro-sql-jdbc-1.7.0.0.jar) are also available.

## Release Highlights

* The [anomaly detection](https://github.com/opendistro-for-elasticsearch/anomaly-detection) plugin has moved out of the preview phase and is now generally available. It comes with a easy-to-use [Kibana](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin) user interface and supports [real-time anomaly detection](https://opendistro.github.io/for-elasticsearch/blog/odfe-updates/2020/05/Real-time-Anomaly-Detection-is-now-available-in-Open-Distro-for-Elasticsearch-1.7.0/).
* The SQL plugin has greatly expanded its supported operations, added a new [Kibana](https://github.com/opendistro-for-elasticsearch/sql-kibana-plugin) user interface, and now has an interactive [CLI](https://github.com/opendistro-for-elasticsearch/sql-cli)with autocomplete.
* A new [SQL ODBC driver](https://github.com/opendistro-for-elasticsearch/sql-odbc) is also now available.
* A new package, the [Open Distro for Elasticsearch 1.7.0 AMI](https://opendistro.github.io/for-elasticsearch-docs/docs/install/ami/), is now available for use with Amazon EC2. Search for “open distro” when you start a new instance.

Please take a look at the detailed 1.7.0 [release notes](https://github.com/opendistro-for-elasticsearch/opendistro-build/blob/master/release-notes/opendistro-for-elasticsearch-release-notes-1.7.0.md) for the latest features, enhancements, infra and documentation updates and bug fixes.

[Upgrade to 1.7.0](https://opendistro.github.io/for-elasticsearch/downloads.html) to leverage the latest features and bug fixes.

## Come join our community!

There are many easy ways to participate in the Open Distro community!

Ask questions and share your knowledge with other community members on the Open Distro [discussion forums](https://discuss.opendistrocommunity.dev/).

Attend our bi-weekly online [community meetup](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group) to learn more about Elasticsearch, security, performance, machine learning and more.

File an issue, request an enhancement or feature you need or suggest a plugin you need at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch).

Contribute code, tests, documentation and even release packages at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch). If you want to showcase how you’re using Open Distro, write a blog post for [opendistro.github.io/blog](https://opendistro.github.io/blog). If you’re interested, please reach out to us on Twitter. You can find me @alolita or Jon at @jon_handler.

Check out what's in development and get involved in components like the [Performance Analyzer RCA Engine](https://github.com/opendistro-for-elasticsearch/performance-analyzer-rca).

We also invite you to get involved in ongoing development of new Open Distro for Elasticsearch plugins, clients, drivers. Contribute code, documentation or tests for [Performance Analyzer RCA Engine](https://github.com/opendistro-for-elasticsearch/performance-analyzer-rca).

You can also track upcoming features in Open Distro for Elasticsearch by watching the code repositories or checking the [project website.](https://opendistro.github.io/for-elasticsearch/features/comingsoon.html)

Thanks again for using and contributing to Open Distro for Elasticsearch and being part of the project’s growing community!

## About the Author

Alolita Sharma is a Principal Technologist at AWS focused on all things open source including Open Distro for Elasticsearch. You can find her on GitHub or Twitter @alolita.
