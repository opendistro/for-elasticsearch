---
layout: posts
author: Viraj Phanse
comments: true
title: "Open Distro for Elasticsearch 1.12.0 is now available"
categories:
- releases
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

We are pleased to announce the release of [Open Distro for Elasticsearch 1.12.0](https://opendistro.github.io/for-elasticsearch/downloads.html). New features in this release include Kibana reports, Gantt chart visualizations, rollups in index management, and support for Hamming distance in k-NN. You can grab a copy from our new [Getting Started & Downloads page](https://opendistro.github.io/for-elasticsearch/downloads.html).

Open Distro for Elasticsearch 1.12.0 includes version 7.10 of open source Elasticsearch and Kibana, plus Apache 2.0-licensed plugins that provide alerting, anomaly detection, index management, performance analysis, security, SQL, k-NN, and more. Other components, including ODBC and JDBC drivers, a command line SQL client, and a command line performance visualization tool (“PerfTop”) are also available to download.

**Release Highlights**

* You can now share reports in PDF, CSV, and PNG format with [Kibana Reports](https://github.com/opendistro-for-elasticsearch/kibana-reports). You can schedule or immediately generate reports from the Dashboard, Visualize, and Discover panels.
* We introduced a new visualization in Kibana that provides you with an ability to embed Gantt charts into dashboards to enable visualization of events, steps and tasks as horizontal bars. One of the primary uses of Gantt charts is in visualizing distributed trace data in time-based execution sequence. An [alpha release](/for-elasticsearch/blog/releases/2020/12/announcing-trace-analytics/) of [Trace Analytics](https://opendistro.github.io/for-elasticsearch-docs/docs/trace/) is also available today, which is a new feature for distributed tracing that supports OpenTelemetry, Jaeger, and Zipkin tracing libraries. By adding trace data to the existing log analytics capabilities of Open Distro for Elasticsearch, developers can perform targeted root cause analysis, reducing problem resolution times.
* As time-series data grows to considerable sizes over time, it can slow down your aggregations, and incur a substantial storage cost. Also, the usefulness of high granularity data reduces with time. [Rollups](https://github.com/opendistro-for-elasticsearch/index-management/tree/rollup-dev) lets you summarize the data and helps you preserve useful aggregations that can be leveraged for analytics while drastically reducing storage costs. 
* [Hamming distance](https://github.com/opendistro-for-elasticsearch/k-NN/issues/264) can now be used as a distance metric for similarity search. Hamming distance measures similarity by comparing two binary data strings and is commonly used in image retrieval, fraud detection, and recognizing duplicate webpages. 

See the [release notes](https://github.com/opendistro-for-elasticsearch/opendistro-build/blob/master/release-notes/opendistro-for-elasticsearch-release-notes-1.11.0.md) for a complete list of new features, enhancements, and bug fixes.

**Download the latest packages**

You can find [Docker Hub images Open Distro for Elasticsearch 1.12.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Open Distro for Elasticsearch Kibana 1.12.0](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker Hub. Make sure your compose file specifies 1.12.0 or uses the “latest” tag. If you’re using RPMs or DEBs, see our documentation on how to install Open Distro for Elasticsearch with [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and [Debian packages](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/). A [tarball](https://opendistro.github.io/for-elasticsearch-docs/docs/install/tar/) is also available for testing and other applications. A [Windows package](https://opendistro.github.io/for-elasticsearch-docs/docs/install/windows/) supporting version 1.12.0 enables users to install Elasticsearch and Kibana on Windows. If you’re using Kubernetes, check out the [Helm chart](https://opendistro.github.io/for-elasticsearch-docs/docs/install/helm/) to install Open Distro for Elasticsearch.You can find Open Distro for Elasticsearch security, alerting notification and job scheduler artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch). You can download the latest versions of Open Distro for Elasticsearch’s [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) on npm.org, Open Distro for Elasticsearch’s latest [SQL CLI client](https://pypi.org/project/odfe-sql-cli/) on [PyPi](https://pypi.org/project/odfe-sql-cli/). SQL drivers supporting [ODBC](https://opendistro.github.io/for-elasticsearch-docs/docs/sql/odbc/) and [JDBC](https://opendistro.github.io/for-elasticsearch-docs/docs/sql/jdbc/) are also available.

**Join the community!**

If you aren’t yet participating in the Open Distro for Elasticsearch community we would love to have you onboard. A few ways to participate:

* Ask questions and share your knowledge with other community members on the [Open Distro discussion forums](https://discuss.opendistrocommunity.dev/).
* Attend our [bi-weekly online community meetup](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group) to learn more about Elasticsearch, security, performance, machine learning and more.
* File an issue, request an enhancement, or suggest a plugin at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch).
* Contribute code, tests, documentation, and release packages at [github.com/opendistro-for-elasticsearch](https://github.com/opendistro-for-elasticsearch).
* Track upcoming features in the Open Distro for Elasticsearch [roadmap](https://github.com/orgs/opendistro-for-elasticsearch/projects/3).
* Showcase how you’re using Open Distro for Elasticsearch on our [blog](https://opendistro.github.io/for-elasticsearch/blog/). Reach out to [@stockholmux](https://twitter.com/stockholmux?lang=en) and [@vrphanse](https://twitter.com/vrphanse?lang=en) on Twitter to discuss collaborating on a blog post or article.

If you’re already part of our community of users and contributors, a hearty ‘thank you’ from the entire team goes to you. We’re glad you’ve joined us on this journey and we deeply hope that this release solves a few problems and delights you along the way.

**About the Authors**

Viraj Phanse is a product management leader at Amazon Web Services for Analytics/Search Services. You can find him on GitHub or Twitter [@vrphanse](https://twitter.com/vrphanse?lang=en)

Kyle Davis is the developer advocate dedicated to Open Distro for Elasticsearch. You can find him on Github or Twitter [@stockholmux](https://twitter.com/stockholmux).