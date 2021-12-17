---
layout: redirect
excerpt: " "
author: Alolita Sharma, Partha Kanuparthy and Balaji Kannan
comments: true
title: "Introducing Root Cause Analysis with Open Distro"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
new_url: https://opensearch.org/blog/odfe-updates/2019/10/Introducing-Root-Cause-Analysis-with-Open-Distro-for-Elasticsearch/
---
If you’re interested in the operational behavior of your Elasticsearch cluster, then root cause analysis can help you identify fundamental issues that affect availability and performance of the cluster. Root cause analysis (RCA) is a problem solving technique used to examine symptoms of problems you’re interested in solving and to work backwards from those symptoms to the causes of the problems.

We are building a root cause analysis engine for Open Distro for Elasticsearch. This smart engine along with Performance Analyzer will help users improve availability and performance of their Elasticsearch clusters. While we design the root cause analysis engine, you can [weigh in with your feedback on the design proposal](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/master/rca/rfc-rca.pdf). We’d love it if you add your comments and use cases so that Open Distro for Elasticsearch will support your needs too!

Open Distro for Elasticsearch comes with a Performance Analyzer plugin that helps [compute and expose diagnostic metrics for Elasticsearch clusters](https://opendistro.github.io/for-elasticsearch/blog/open%20distro%20for%20elasticsearch%20updates/2019/05/Store-Open-Distro-for-Elasticsearch-s-Performance-Analyzer-Output-in-Elasticsearch/). This useful tool enables Elasticsearch users to measure and understand bottlenecks in their clusters. Open Distro for Elasticsearch also bundles a light weight client - [PerfTop](https://github.com/opendistro-for-elasticsearch/perftop). You can learn more about [debugging with PerfTop](https://opendistro.github.io/for-elasticsearch/blog/open%20distro%20for%20elasticsearch%20updates/2019/04/Lightweight-Debugging-with-Performance-Analyzer-and-PerfTop-in-Open-Distro-for-Elasticsearch/) which provides real time visualization of Performance Analyzer’s diagnostic metrics.

[The root cause analysis framework](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/master/rca/rfc-rca.pdf) extends on the Performance Analyzer architecture by building a data flow graph that computes root causes.

If you have any questions, please feel free to reach out to us. You can tag us on GitHub (Alolita [@alolita](https://github.com/alolita), Partha [@aesgithub](https://github.com/aesgithub), Balaji [@sendkb](https://github.com/sendkb)) with your questions.

We anticipate starting development on RCA framework in the next couple of weeks. We invite the community to collaborate with us on building this framework, and in making Elasticsearch manageability more seamless.

With your interest and feedback, the root cause analysis framework will become a valuable tool for everyone using Open Distro for Elasticsearch.

Look forward to your feedback!

Alolita Sharma, Partha Kanuparthy, Balaji Kannan
