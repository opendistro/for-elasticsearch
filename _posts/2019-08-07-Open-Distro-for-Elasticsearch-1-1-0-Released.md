---
layout: posts
author: Alolita Sharma and Jon Handler
comments: true
title: Open Distro for Elasticsearch 1.1.0 Released
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

We are happy to announce that Open Distro for Elasticsearch 1.1.0 is now available for download!
Version 1.1.0 includes the upstream open source versions of Elasticsearch 7.1.1, Kibana 7.1.1, and the latest updates for alerting, SQL, security, performance analyzer, and Kibana plugins, as well as the SQL JDBC driver. You can find details on enhancements, bug fixes, and more in the release notes for each plugin in their respective GitHub repositories. See [Open Distro’s version history table](https://opendistro.github.io/for-elasticsearch-docs/version-history/) for previous releases.

## Download the latest packages

You can find [Docker Hub images Open Distro for Elasticsearch 1.1.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.1.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.1.0 or uses the latest tag. See our documentation on how to [install Open Distro for Elasticsearch with RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and [install Open Distro for Elasticsearch with Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). You can find our [Open Distro for Elasticsearch’s Security plugin artifacts on Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch).

We have updated our tools as well! You can download [Open Distro for Elasticsearch’s PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop), and [Open Distro for Elasticsearch’s SQL JDBC driver](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-clients/opendistro-sql-jdbc/opendistro-sql-jdbc-0.9.0.0.jar).

For more detail, see our [release notes for Open Distro for Elasticsearch 1.1.0](https://discuss.opendistrocommunity.dev/t/open-distro-for-elasticsearch-1-1-0-rolls-out-check-out-new-features-in-development/1266).

## New features in development

We’re also excited to pre-announce new plugins in development. We’ve made available pre-release alpha versions of these plugin artifacts for developers (see below for links) to integrate into their applications. We invite you to join in to submit issues and PRs on features, bugs, and tests you need or build.

### k-NN Search

[Open Distro for Elasticsearch’s k-nearest neighbor (k-NN) search plugin](https://github.com/opendistro-for-elasticsearch/k-NN) will enable high-scale, low-latency nearest neighbor search on billions of documents across thousands of dimensions with the same ease as running any regular Elasticsearch query. The k-NN plugin relies on the [Non-Metric Space Library](https://github.com/nmslib/nmslib) (NMSLIB). It will power use cases such as recommendations, fraud detection, and related document search. We are extending the Apache Lucene codec to introduce a new file format to store vector data. k-NN search uses the standard Elasticsearch mapping and query syntax: to designate a field as a k-NN vector you simply map it to the new k-NN field type provided by the k-NN plugin.

### Index management

[Open Distro for Elasticsearch Index Management](https://github.com/opendistro-for-elasticsearch/index-management) will enable you to run periodic operations on your indexes, eliminating the need to build and manage external systems for these tasks. You will define custom policies to optimize and move indexes, applied based on wildcard index patterns. Policies are finite-state automata. Policies define states and transitions (Actions). The first release of Index Management will support force merge, delete, rollover, snapshot, replica_count, close/open, read_only/read_write actions, and more. Index Management will be configurable via REST or the associated Kibana plugin. We’ve made artifacts of the alpha version of [Open Distro for Elasticsearch Index Management](https://github.com/opendistro-for-elasticsearch/index-management/releases/tag/alpha-rc1) and [Open Distro for Elasticsearch Kibana Index Management](https://github.com/opendistro-for-elasticsearch/index-management-kibana-plugin/releases/tag/alpha-rc1) available on GitHub.

### Job scheduler

[Open Distro for Elasticsearch’s Job Scheduler plugin](https://discuss.opendistrocommunity.dev/t/open-distro-for-elasticsearch-adds-a-job-scheduler/775) is a library that enables you to build plugins that can run periodic jobs on your cluster. You can use Job Scheduler for a variety of use cases, from taking snapshots once per hour, to deleting indexes more than 90 days old, to providing scheduled reports. Read our [announcement page for Open Distro for Elasticsearch Job Scheduler](https://discuss.opendistrocommunity.dev/t/open-distro-for-elasticsearch-adds-a-job-scheduler/775) for more details.

### SQL Kibana UI

Open Distro for Elasticsearch’s Kibana UI for SQL will make it easier for you to run SQL queries and explore your data. This plugin will support SQL syntax highlighting and output results in the familiar tabular format. The SQL Kibana UI will support nested documents, allowing you to expand columns with these documents and drill down into the nested data. You will also be able to translate your SQL query to Elasticsearch query DSL with a single click and download results of the query as a CSV file.

### Questions?

Please feel free to ask questions on the [Open Distro for Elasticsearch community discussion forum](https://discuss.opendistrocommunity.dev/).

### Report a bug or request a feature

You can [file a bug, request a feature, or propose new ideas to enhance Open Distro for Elasticsearch](https://github.com/opendistro-for-elasticsearch/community/issues). If you find bugs or want to propose a feature for a particular plug-in, you can go to the specific repo and file an issue on the plug-in repo.

### Getting Started

If you’re getting started on building your open source contribution karma, you can select an issue tagged as a “Good First Issue” to start contributing to Open Distro for Elasticsearch. Read the [Open Distro technical documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/install/) on the project website to help you get started.
Go develop! And contribute to Open Distro 🙂

