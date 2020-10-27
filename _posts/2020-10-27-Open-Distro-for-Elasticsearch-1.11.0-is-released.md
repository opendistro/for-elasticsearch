---
layout: posts
author: Viraj Phanse
comments: true
title: "Open Distro for Elasticsearch 1.11.0 is now available"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---
We are pleased to announce the release of [Open Distro for Elasticsearch 1.11.0](https://opendistro.github.io/for-elasticsearch/downloads.html). This release adds several new features including a new pipe-based query syntax, high cardinality data support for Anomaly Detection, fine-grained access control support for Alerting and Anomaly Detection, SQL window functions, custom scoring in k-NN, and a new notebook reporting feature. Open Distro for Elasticsearch 1.11.0 can be downloaded [here](https://opendistro.github.io/for-elasticsearch/downloads.html).

Open Distro for Elasticsearch 1.11.0 includes version 7.9.1 of open source Elasticsearch and Kibana, plus Apache-2.0-licensed extensions that provide alerting, anomaly detection, index management, performance analysis, security, SQL, k-NN, and more. Other components, including ODBC and JDBC drivers, a command-line SQL client, and a command-line performance visualization tool (“PerfTop”) are also available to download.

## Release Highlights

* [Piped Processing Language (PPL)](https://opendistro.github.io/for-elasticsearch-docs/docs/ppl/) lets you explore, discover, and find data stored in Elasticsearch using a set of commands delimited by pipes (|). PPL extends Elasticsearch to support a standard set of commands and functions. 
* [High cardinality support in Anomaly Detection](https://github.com/opendistro-for-elasticsearch/anomaly-detection/issues/147) provides granular insights from high-volume log streams by identifying and isolating anomalies to unique entities like hostnames or IP addresses. 
* With fine grained access control support for [Anomaly Detection](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/pull/538) and [Alerting](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/pull/532), you can now delegate permissions to non-administrative users to access and configure these plug-ins.
* With [window functions](https://github.com/opendistro-for-elasticsearch/sql/pull/753) in SQL, you can define a frame or window of rows with a given length around the current row, and performs a calculation across the set of data in the window.
* [Custom scoring in k-NN](https://github.com/opendistro-for-elasticsearch/k-NN/pull/196) enables complex pre-filtering of your documents and dynamic application of k-NN on the filtered documents to improve the similarity search results. 
* [Kibana Notebooks](https://opendistro.github.io/for-elasticsearch-docs/docs/kibana/notebooks/) provides you with an ability to interactively and collaboratively develop rich reports backed by live data. Common use cases for notebooks include creating postmortem reports, designing run books, building live infrastructure reports, or even documentation.

See the [release notes](https://github.com/opendistro-for-elasticsearch/opendistro-build/blob/master/release-notes/opendistro-for-elasticsearch-release-notes-1.11.0.md) for a complete list of new features, enhancements, and bug fixes.

## Download the latest packages

You can find [Docker Hub images Open Distro for Elasticsearch 1.11.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.11.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.11.0 or uses the ‘latest’ tag.

If you’re using RPMs or DEBs, see our documentation on how to install Open Distro for Elasticsearch with [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and [Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). A [tarball](https://opendistro.github.io/for-elasticsearch-docs/docs/install/tar/) is also available for testing and other applications.

A [Windows package](https://opendistro.github.io/for-elasticsearch-docs/docs/install/windows/) supporting version 1.11.0 enables users to install Elasticsearch and Kibana on Windows. If you’re using Kubernetes, check out the [Helm chart](https://opendistro.github.io/for-elasticsearch-docs/docs/install/helm/) to install Open Distro for Elasticsearch.

You can find Open Distro for Elasticsearch security, alerting notification and job scheduler artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch).

You can download the latest versions of Open Distro for Elasticsearch’s [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) on npm.org, Open Distro for Elasticsearch’s latest [SQL CLI client](https://pypi.org/project/odfe-sql-cli/) on [PyPi](https://pypi.org/project/odfe-sql-cli/). SQL drivers supporting [ODBC](https://opendistro.github.io/for-elasticsearch-docs/docs/sql/odbc/) and [JDBC](https://opendistro.github.io/for-elasticsearch-docs/docs/sql/jdbc/) are also available.

## Join the community!

There are many easy ways to participate in the Open Distro for Elasticsearch community.

* Ask questions and share your knowledge with other community members on the [Open Distro discussion forums](https://discuss.opendistrocommunity.dev/). 
* Attend our [bi-weekly online community meetup](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group) to learn more about Elasticsearch, security, performance, machine learning and more.
* File an issue, request an enhancement, or suggest a plugin at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch).
* Contribute code, tests, documentation, and release packages at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch).
* Track upcoming features in the Open Distro for Elasticsearch [roadmap](https://github.com/orgs/opendistro-for-elasticsearch/projects/3).
* Showcase how you’re using Open Distro for Elasticsearch on our [blog](https://opendistro.github.io/for-elasticsearch/blog/). Reach out to [@stockholmux](https://twitter.com/stockholmux?lang=en) and [@vrphanse](https://twitter.com/vrphanse?lang=en) on Twitter to discuss collaborating on a blog post or article.

Thank you for using and contributing to Open Distro for Elasticsearch, and for being part of the project’s growing community!

## About the Author(s)

Viraj Phanse is a product management leader at Amazon Web Services for Analytics/Search Services. You can find him on GitHub or Twitter [@vrphanse](https://twitter.com/vrphanse?lang=en)
