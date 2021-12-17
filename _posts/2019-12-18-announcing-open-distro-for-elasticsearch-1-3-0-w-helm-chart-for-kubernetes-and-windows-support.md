---
layout: redirect
excerpt: " "
author: Pavani Baddepudi
comments: true
title: "Announcing Open Distro 1.3.0, Helm chart for Kubernetes and Windows support"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
new_url: https://opensearch.org/blog/odfe-updates/2019/12/announcing-open-distro-for-elasticsearch-1-3-0-w-helm-chart-for-kubernetes-and-windows-support/
---
We are pleased to announce the release of Open Distro for Elasticsearch 1.3.0.  Version 1.3.0 includes the upstream open source versions of Elasticsearch 7.3.2, Kibana 7.3.2 and the latest updates for the alerting, SQL, security, performance analyzer and Kibana plugins. We are excited to announce the general availability of Open Distro for Elasticsearch Index Management, installer for Windows deployments, Helm chart support for Kubernetes and cloud formation templates for Elasticsearch deployments. We would like to thank the community for their contributions and support that enabled us to release some of these new features.  Here are the full [release notes](https://discuss.opendistrocommunity.dev/t/open-distro-for-elasticsearch-1-3-0-released-with-helm-chart-for-kubernetes-and-windows-support/2028).

## Download the latest packages

You can find Docker Hub images [Open Distro for Elasticsearch 1.3.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.3.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.3.0 or uses the latest tag. See our documentation on how to install Open Distro for Elasticsearch with [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and install Open Distro for Elasticsearch with [Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). You can find our Open Distro for Elasticsearch security plugin artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch). You can download the latest versions of  Open Distro for Elasticsearch’s [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop), and Open Distro for Elasticsearch’s [SQL JDBC driver](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-clients/opendistro-sql-jdbc/opendistro-sql-jdbc-0.9.0.0.jar).

## New Features

### Index Management

The Index management plugin in Open Distro for Elasticsearch provides an automated system for recurring index state management tasks, eliminating the need rely on external systems to execute them periodically. The Kibana plugin for index management provides users an administrative panel to monitor the indices and apply policies at different stages in its lifecycle based on user defined criteria like index age, size, or number of documents. Index state management lets users define unlimited custom policies to be applied to index patterns, and move indices from one state to another. Within each state users can define a list of actions to perform and the criteria to transition to a new state.

### Open Distro for Elasticsearch Deployment for Kubernetes

With the new Helm chart for Open Distro for Elasticsearch, users can scale out Elasticsearch deployments in Kubernetes and Amazon EKS. This Helm chart supports installation and update of Elasticsearch and Kibana. The Helm chart enables users to set up master, client and data nodes. It also provides options for security settings like TLS, custom certificates, RBAC, multi-tenancy for the cluster.

### Cloud formation templates

Users can now create a full Open Distro for Elasticsearch cluster, including secure networking provided through VPC, configurable data notes, master nodes and a client node. The client node provides Kibana access with a public IP address. <Add link to these templates>

## Packages and features under development

We’re also excited to announce an alpha version of a Windows installer and new plugins in development. We invite you to join in to submit issues and PRs on features, bugs, and tests you need or build.

### Open Distro for Elasticsearch deployment on Windows

With Windows exe supporting version 1.3.0, users can now easily install Elasticsearch and Kibana on Windows and run it as a service. This service has been tested on Windows 10 and Windows Server 2019.

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

Pavani Baddepudi is a Senior product manager working on search services at Amazon Web Services.
