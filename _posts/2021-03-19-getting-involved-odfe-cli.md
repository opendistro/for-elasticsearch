---
layout: posts
author: Vijayan Balasubramanian
comments: true
title: "Getting involved with ODFE-CLI"
categories:
- contribution
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

Open Distro for Elasticsearch Command Line Interface (ODFE-CLI) is a tool that lets you manage your Open Distro for Elasticsearch cluster from the command line and automate tasks. This CLI  was designed to have one binary for all Open Distro plugins as well as support for Elasticsearch core commands, allowing you to use a single tool to perform Elasticsearch operations as well as configure, manage, and use Open Distro plugins. ODFE-CLI is written in [golang](https://golang.org/) and emphasizes clean, unit testable code which is easy to extend. [Version 1.0 of ODFE-CLI](https://opendistro.github.io/for-elasticsearch/downloads.html#connect) was released in January 2021 and includes support for the Anomaly Detection plugin. 

In upcoming versions, the Open Distro team is looking to expand the functionality to cover more features. As a user, ODFE-CLI will enable you to compose many simple operations into short shell scripts that would otherwise require a trip to Kibana or complex and fragile cURL commands. The goal is to have a scriptable abstraction toolkit available from your favorite terminal software, increasing productivity. 

The best person to build this type of software is the person who would actually use it on a daily basis. The ODFE-CLI team has setup [help-wanted](https://github.com/opendistro-for-elasticsearch/odfe-cli/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)  labels on the repo where you can contribute and help make ODFE-CLI the software you want to use everyday. The team has even created a  [good-first-issue](https://github.com/opendistro-for-elasticsearch/odfe-cli/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) label for those who have never contributed before. Contributing to ODFE-CLI is low friction - if you know even a little bit of golang you’ll be right at home. In addition, the team has committed to being active in the [GitHub repo](https://github.com/opendistro-for-elasticsearch/odfe-cli/) and on the [ODFE-CLI forum category](https://discuss.opendistrocommunity.dev/c/cli/55) to assist anyone wanting to get involved. As an independent binary from the rest of Open Distro, the team can release new versions often, reducing the lag between your contribution and it being available to the wider community. Now the ball is in your court - let’s go and build ODFE-CLI into the tool you’ve always wanted!

