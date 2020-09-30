---
layout: posts
author: Viraj Phanse
comments: true
title: "Open Distro for Elasticsearch 1.10.1 is now available"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---
We are pleased to announce the release of [Open Distro for Elasticsearch 1.10.1](https://opendistro.github.io/for-elasticsearch/downloads.html) that supports three different [sample detectors and corresponding indices](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/272) in Anomaly Detection, adding an [email destination](https://github.com/opendistro-for-elasticsearch/alerting/pull/244) in Alerting, [warmup API](https://github.com/opendistro-for-elasticsearch/k-NN#warmup-api) in k-NN and [command line interface](https://github.com/opendistro-for-elasticsearch/anomaly-detection/tree/master/cli) in Anomaly Detection, and has an enhanced Kibana Security Plugin which also adds the ability to manage audit logging configurations. Open Distro for Elasticsearch 1.10.1 and Open Distro for Elasticsearch Kibana 1.10.1 can be downloaded [here](https://opendistro.github.io/for-elasticsearch/downloads.html).

Open Distro for Elasticsearch 1.10.1 includes version 7.9.1 of Open Source Elasticsearch and Kibana, plus Apache-2.0-licensed extensions that provide alerting, anomaly detection, index management, performance analysis, security, SQL, and k-NN features. Other components, including ODBC and JDBC drivers, a command-line SQL client, and a command-line performance visualization tool (“PerfTop”) are also available to download. 


## Download the latest packages

You can find Docker Hub images [Open Distro for Elasticsearch 1.10.1](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.10.1](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.10.1 or uses the ‘latest’ tag.

If you’re using RPMs or DEBs, see our documentation on how to install Open Distro for Elasticsearch with [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and install Open Distro for Elasticsearch with [Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). A [tarball](https://opendistro.github.io/for-elasticsearch-docs/docs/install/tar/) is also available for testing and other applications.

A [Windows package](https://opendistro.github.io/for-elasticsearch-docs/docs/install/windows/) supporting version 1.10.1 enables users to install Elasticsearch and Kibana on Windows. If you’re using Kubernetes, check out the [Helm chart](https://opendistro.github.io/for-elasticsearch-docs/docs/install/helm/) to install Open Distro for Elasticsearch.

You can find Open Distro for Elasticsearch security, alerting notification and job scheduler artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch).

You can download the latest versions of Open Distro for Elasticsearch’s [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) on npm.org, Open Distro for Elasticsearch’s latest [SQL CLI client](https://pypi.org/project/odfe-sql-cli/) on [PyPi](https://pypi.org/project/odfe-sql-cli/). SQL drivers supporting [ODBC](https://opendistro.github.io/for-elasticsearch-docs/docs/sql/odbc/) and [JDBC](https://opendistro.github.io/for-elasticsearch-docs/docs/sql/jdbc/) are also available.


## Release Highlights

* Anomaly Detection supports three different types of [sample detectors and corresponding indices](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin/pull/272) that allow users to detect sample anomalies using logs related to HTTP response codes, eCommerce orders, and CPU and memory of a host.
* The Alerting feature supports [email destinations](https://github.com/opendistro-for-elasticsearch/alerting/pull/244) to send notifications without using a web hook. 
* The updated Kibana Security Plugin streamlines security workflows, improves usability and adds audit and compliance logging configuration.     
* Anomaly Detection supports a [command line interface](https://github.com/opendistro-for-elasticsearch/anomaly-detection/tree/master/cli) that allows users to create, start, stop and delete detectors, and work with multiple clusters using named profiles.
* K-NN supports [warmup API](https://github.com/opendistro-for-elasticsearch/k-NN#warmup-api) that allows users to explicitly load indices’ graphs used for approximate k-NN search into memory before performing their search workload. With this API, users no longer need to run random queries to prevent initial latency penalties for loading graphs into the cache.
See the 1.10.1 [release notes](https://github.com/opendistro-for-elasticsearch/opendistro-build/blob/master/release-notes/opendistro-for-elasticsearch-release-notes-1.10.1.md) for a complete list of new features, enhancements, and bug fixes. 


## Come join our community!

There are many easy ways to participate in the Open Distro community!

Ask questions and share your knowledge with other community members on the [Open Distro discussion forums](https://discuss.opendistrocommunity.dev/).
Attend our [bi-weekly online community meetup](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group) to learn more about Elasticsearch, security, performance, machine learning and more.

File an issue, request an enhancement or suggest a plugin at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch).

Contribute code, tests, documentation and even release packages at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch). If you want to showcase how you’re using Open Distro, write a blog post at [opendistro.github.io/for-elasticsearch/blog](https://opendistro.github.io/for-elasticsearch/blog/). If you’re interested, please reach out to me on Twitter. You can find me at [@vrphanse](https://twitter.com/vrphanse?lang=en).

We also invite you to get involved in ongoing development of new Open Distro for Elasticsearch plugins, clients, drivers. Contribute code, documentation or features to [Open Distro for Elasticsearch](https://github.com/orgs/opendistro-for-elasticsearch/projects/3#column-9370461). 

You can also track upcoming features in Open Distro for Elasticsearch by watching the code repositories or checking the [roadmap](https://github.com/orgs/opendistro-for-elasticsearch/projects/3).

Thanks again for using and contributing to Open Distro for Elasticsearch and being part of the project’s growing community!


## About the Author(s)

Viraj Phanse is a product management leader at Amazon Web Services for Analytics/Search Services. You can find him on GitHub or Twitter [@vrphanse](https://twitter.com/vrphanse?lang=en)
