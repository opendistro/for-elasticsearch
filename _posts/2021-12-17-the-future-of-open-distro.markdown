---
layout: posts
author: Eli Fisher
comments: true
title: The Future of Open Distro
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

Open Distro in an Apache 2.0-licensed distribution of software that includes open source Elasticsearch and Kibana packaged with a number of feature-adding plugins built by AWS. The open source Elasticsearch and Kibana portions of the distribution come from the upstream downloadable artifacts ranging from versions 6.5.4 to 7.10.2. These Elasticsearch and Kibana artifacts are not forks and the current maintenance policy for upstream Elasticsearch outlines that the most recent minor release for the current major version and the most recent minor release of the previous major version will be maintained.  

Last week the OpenSearch team [published](https://opensearch.org/blog/releases/2021/12/update-to-1-2-1/) a new version of Open Distro in regards to the recent CVEs reported in relastionship to Log4j. One of the challenges underscored during this work was that there was no upstream patch version of open source Elasticsearch 7.10 with updates relating to the Log4j issue. In this situation, Open Distro was [updated](https://opendistro.github.io/for-elasticsearch/blog/2021/12/update-to-1-13-3/) in accordance with the advisory guidance. However, given the upstream maintenance policy for open source Elasticsearch, we cannot guarantee fixes for new critical issues in open source Elasticsearch and Kibana 7.10 will always be feasible.

Because of this, **we strongly recommend that anyone who uses Open Distro migrate to OpenSearch** where we can make critical updates to the search engine and dashboard code bases. To help facilitate this transition, there are a number of steps that will be taken.

1. We will be building tools designed to help automate upgrading to OpenSearch.
2. We will continue to provide patches to Open Distro plugins for critical security issues and distribute updated versions of the impacted plugins as downloadable zips on their respective GitHub repos. 