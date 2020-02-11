---
layout: posts
author: Pavani Baddepudi
comments: true
title: "Open Distro for Elasticsearch 1.4.0 with K-nearest neighbor (k-NN) search support is now available"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---
We are happy to announce the release of Open Distro for Elasticsearch 1.4.0. Version 1.4.0 includes the upstream open source versions of Elasticsearch 7.4.2, Kibana 7.4.2 and the latest updates for the alerting, SQL, security, performance analyzer and Kibana plugins. We are also pleased to announce the general availability of Open Distro for Elasticsearch k-NN plugin, and installer for Windows deployments. We would like to thank the community for their contributions and support in testing out the new features.  Here are the full [release notes](https://github.com/opendistro-for-elasticsearch/opendistro-build/blob/master/release-notes/release-notes-odfe-1.4.0.md). 
## Download the latest packages

You can find Docker Hub images [Open Distro for Elasticsearch 1.4.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.4.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.4.0 or uses the latest tag. See our documentation on how to install Open Distro for Elasticsearch with [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and install Open Distro for Elasticsearch with [Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). You can find our Open Distro for Elasticsearch security plugin artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch). You can download the latest versions of Open Distro for Elasticsearch’s [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop), and Open Distro for Elasticsearch’s [SQL JDBC driver](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-clients/opendistro-sql-jdbc/opendistro-sql-jdbc-0.9.0.0.jar).

Note:  k-NN plugin is only available as part of docker image in this release.

## New Features

### k-NN plugin 

Our new k-NN search plugin enables high scale, low latency nearest neighbor search on billions of documents across thousands of dimensions with the same ease as running any regular Elasticsearch query. Built using the [Non-Metric Space Library](https://github.com/nmslib/nmslib) (NMSLIB), this plugin can power use cases such as product recommendations, fraud detection, and image, video, and related document search. We have extended the Apache Lucene codec to introduce a new file format to store vector data. k-NN Search uses the standard Elasticsearch mapping and query syntax —to designate a field as a k-NN vector you can simply map it to the new k-NN field type provided by the k-NN plugin. k-NN functionality integrates seamlessly with other Elasticsearch features. This provides users  the flexibility to use Elasticsearch’s extensive search features such as 
aggregations and filtering with k-NN to further improve the search results. Learn more at [k-NN](https://github.com/opendistro-for-elasticsearch/k-NN)


## Packages and features under development

### Anomaly Detection

Machine learning based anomaly detection has been released as an alpha plugin and is under active development. The anomaly detection feature can handle large volumes of high dimensional data and detect outliers in real-time. The anomaly detection feature depends on the underlying [Random Cut Forest](https://github.com/aws/random-cut-forest-by-aws) (RCF) library, a proven algorithm for streaming use cases. RCF is also now open source  and provides better visibility into the anomaly detection decision framework.  

### Performance Analyzer Root Cause Analysis (RCA) framework

The Performance Analyzer RCA is a framework that builds on the Performance Analyzer engine to support Root Cause Analysis (RCA) of performance and reliability problems in Elasticsearch clusters. This framework executes real time root cause analyses using Performance Analyzer metrics. You can now weigh in your feedback on the [design proposal](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/master/rca/rfc-rca.pdf) released recently.

## Questions?

Please feel free to ask questions on the Open Distro for Elasticsearch [community discussion forum](https://discuss.opendistrocommunity.dev/).

## Report a bug or request a feature

Please feel free to file a bug or an issue, request a feature, or propose new ideas to enhance [Open Distro for Elasticsearch](https://github.com/opendistro-for-elasticsearch/community/issues). To file bugs, raise a PR or propose a feature for a particular plugin, navigate to the specific plugin repository and add an issue. This will help us manage the content better.

## Getting Started

Feel free to select an issue tagged as a “Good First Issue” in the plugin repos to start contributing to Open Distro for Elasticsearch. Read the Open Distro [technical documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/install/) on the project website to help you get started. We look forward to sharing new ideas, seek feedback and development Open Distro collaboratively with you!

## About the Author

Pavani Baddepudi is a senior product manager working on search services at Amazon Web Services.
