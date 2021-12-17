---
layout: redirect
excerpt: " "
author: Alolita Sharma
comments: true
title: "Open Distro 1.2.1 Released"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
new_url: https://opensearch.org/blog/odfe-updates/2019/11/Open-Distro-for-Elasticsearch-1.2.1-released/
---

Open Distro for Elasticsearch version 1.2.1 is available for download. 

## **What’s included in version 1.2.1**

Version 1.2.1 includes upstream open source versions of Elasticsearch 7.2.1, Kibana 7.2.1, and all Open Distro plugins including Alerting, Performance Analyzer, Security, SQL, and corresponding Kibana plugins too. A SQL JDBC driver and PerfTop, a client for Performance Analyzer, also comes with the distribution. You can find details on enhancements, bug fixes, and new features in the release notes for each plugin on GitHub. See Open Distro’s [version history](https://opendistro.github.io/for-elasticsearch-docs/version-history/) table if you need to use a previous release of the distribution.

## **Download the latest packages**

Docker images for this release of[ Open Distro for Elasticsearch](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Kibana](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) can be downloaded from Docker Hub. If you are using Docker, make sure your compose file specifies 1.2.1 or uses the latest tag. Additionally,[ RPM](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/),[ Debian](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/) and [Linux tarball](https://opendistro.github.io/for-elasticsearch-docs/docs/install/tar/) packages are available for installation. You can download the PerfTop client [here](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) and our SQL JDBC driver [ here](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-clients/opendistro-sql-jdbc/opendistro-sql-jdbc-0.9.0.0.jar). You can also find our Security plugin artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch). As many of you may already have discovered, the 1.2.1 artifacts and packages have been available for download since early November.

## **Release details**

### **ALERTING**

* Update build.gradle and release notes for v1.2.0.1 [(#105)](https://github.com/opendistro-for-elasticsearch/alerting/pull/105)
* Upgrade to ES 7.2.1 [(#110)](https://github.com/opendistro-for-elasticsearch/alerting/pull/110)
* Alerting Anomaly detection integration [*](https://github.com/opendistro-for-elasticsearch/alerting/commit/ae1cfc6f829de1d445a0ee5257cbaacc4f87eaf3)
* Update plugin version [*](https://github.com/opendistro-for-elasticsearch/alerting/commit/37287521a5231bd7446555586233198c8d4d9676)
* Fix parse exception of ad result response [(#132)](https://github.com/opendistro-for-elasticsearch/alerting/pull/132)

### **ALERTING KIBANA UI**

* Update package.json and release notes [(#99)](https://github.com/opendistro-for-elasticsearch/alerting-kibana-plugin/pull/99)
* Alerting Anomaly detection integration[*](https://github.com/opendistro-for-elasticsearch/alerting-kibana-plugin/commit/987c22cb57633e1615b809bdf017ca017bf2a598)

### **PERFORMANCE ANALYZER**

* Update PerformanceAnalyzer to support ElasticSearch v7.2.1[*](https://github.com/opendistro-for-elasticsearch/performance-analyzer/commit/0f513119f2a61293b2429eca3d162196d1833963)
* Merge pull request [(#76)](https://github.com/opendistro-for-elasticsearch/performance-analyzer/pull/76)

### **SECURITY**

* Support for ES 7.2.1 [(#153)](https://github.com/opendistro-for-elasticsearch/security/pull/153)
* Extended proxy authenticator to pass additional attributes via header [(#174)](https://github.com/opendistro-for-elasticsearch/security/pull/174)

### **SECURITY ADVANCED MODULES**

* Support for ES 7.2.1 [(#49)](https://github.com/opendistro-for-elasticsearch/security-advanced-modules/pull/49)

### **SECURITY PARENT**

* Support for ES 7.2.1 [(#26)](https://github.com/opendistro-for-elasticsearch/security-parent/pull/26)

### **SECURITY KIBANA UI**

* Support for ES 7.2.1 [(#106)](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/pull/106)
* Update opendistro_security version to 7.2.1[*](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/commit/e3432d7e29df19a519d1b8a02aa1dd164a934eaf)
* Update Open Distro version 1.2.1.0 for security kibana plugin [(#107)](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/pull/107)

### **SQL**

* Support for Open Distro 1.2.1 [(#219)](https://github.com/opendistro-for-elasticsearch/sql/pull/219)

### **SQL JDBC**

* Changed version to 1.2.1 and updated release notes [(#27)](https://github.com/opendistro-for-elasticsearch/sql-jdbc/pull/27)
* Update version in version.java

### **JOB SCHEDULER**

* Support Elasticsearch 7.2.1 [(#27)](https://github.com/opendistro-for-elasticsearch/job-scheduler/pull/27)

### **PERFTOP**

* Update PerfTop to support OpenDistro 1.2.1 release[*](https://github.com/opendistro-for-elasticsearch/perftop/commit/73aff7068b330100e47ccf1bb89f8b009a60018a)
* Update version 1.2.1 on package.json[*](https://github.com/opendistro-for-elasticsearch/perftop/commit/3747dc265d2c6c59520de5e64172d3841ead7095)
* Fix vulnerabilities[*](https://github.com/opendistro-for-elasticsearch/perftop/commit/5c400aecf0e5702e683936e2a4a114d49aa3f7d7)
* Merge pull request [(#31)](https://github.com/opendistro-for-elasticsearch/perftop/pull/31)

You can find the latest release notes for each component at these URLs:[ Alerting](https://github.com/opendistro-for-elasticsearch/alerting/releases),[ Alerting Kibana UI](https://github.com/opendistro-for-elasticsearch/alerting-kibana-plugin/releases),[ Performance Analyzer](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/opendistro-1.0/release-notes),[ PerfTop](https://github.com/opendistro-for-elasticsearch/perftop/blob/opendistro-1.0/release-notes),[ Security](https://github.com/opendistro-for-elasticsearch/security/releases),[ Security Kibana UI](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/releases),[ SQL](https://github.com/opendistro-for-elasticsearch/sql/releases),[ SQL JDBC](https://github.com/opendistro-for-elasticsearch/sql-jdbc/releases) driver, and[ Job Scheduler](https://github.com/opendistro-for-elasticsearch/job-scheduler/releases).

## **Features in development**

Check out and contribute to features in development! You can also download and use the development versions of these plugins to test, experiment, and provide feedback.

* [k-NN](https://github.com/opendistro-for-elasticsearch/k-NN)
* [Index Management](https://github.com/opendistro-for-elasticsearch/index-management)
* [Index Management Kibana UI](https://github.com/opendistro-for-elasticsearch/index-management-kibana-plugin)
* [Anomaly Detection](https://github.com/opendistro-for-elasticsearch/anomaly-detection/)
* [Anomaly Detection Kibana UI](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin)

## **RCA design RFC needs your feedback**

We’d love to get your feedback on the Performance Analyzer Root Cause Analysis (RCA) design RFC. Review it[ here](https://github.com/opendistro-for-elasticsearch/performance-analyzer/tree/master/rca). You can provide comments[ here](https://github.com/opendistro-for-elasticsearch/performance-analyzer/issues/73).

### **Questions?**

Please feel free to ask questions on the [project community discussion forum](https://discuss.opendistrocommunity.dev/). I also invite you to help answer questions on the forums for other community members. We also have a 30-minute online community meeting every two weeks that you can [join](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group/) to ask questions.

### **Report a bug or request a feature?**

You can file bugs, request features, or propose new ideas to enhance Open Distro on our [GitHub community](https://github.com/opendistro-for-elasticsearch/community/issues) issues page. If you find bugs or want to propose a feature for a particular plug-in, you can go to the specific repo and file an issue on the plug-in repo.

### **Getting Started?**

If you’re getting started on building your open source contribution karma, you can select an issue tagged as a “Good First Issue” to start contributing to Open Distro for Elasticsearch. There is extensive[ technical documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/install/) on the project website to help you get started.

Feel free to reach out to me (alolitas) if you have any questions. Thanks for using Open Distro for Elasticsearch. Go build with Open Distro!

## About the Author

Alolita Sharma is a Principal Technologist at AWS focused on all things open source including Open Distro for Elasticsearch. You can find her on Twitter @alolita.
