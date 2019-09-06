---
layout: posts
author: Alolita Sharma
comments: true
title: Open Distro for Elasticsearch version 1.0.0 is now available
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---
Open Distro for Elasticsearch 1.0.0 is now available for you to download and run!
The 1.0.0 release includes Elasticsearch 7.0.1 and Kibana 7.0.1 from upstream and the latest versions of the Open Distro for Elasticsearch plugins for alerting, performance analyzer, SQL, and security. The Kibana UI components for security and alerting are also part of this release.
You can find [Open Distro for Elasticsearch Docker images](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and [Kibana Docker images](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) on Docker hub. If you are using Docker, make sure your compose file specifies 1.0.0 or uses the latest tag. Additionally, [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and [Debian](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/) packages are available for installation. You can update to the latest version of our [PerfTop client](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) and our [SQL JDBC driver](https://opendistro.github.io/for-elasticsearch/downloads.html).
If you’re a developer interested in using individual Open Distro for Elasticsearch plugins, you can now learn how to download and install[plugin ZIP files](https://opendistro.github.io/for-elasticsearch-docs/docs/install/plugins/) for Security, Alerting, and SQL from our[documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/install/plugins/). Additionally, you can find our Security plugin on[Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch). If you’re getting started on building your open source contribution karma, find an issue tagged as a “good first issue” in one of our repos to start contributing to Open Distro for Elasticsearch!

## Release Highlights

All plugins now support Elasticsearch and Kibana release 7.0.1.
Open Distro for Elasticsearch Alerting adds action throttling support in its Kibana UI and visual monitors to specify `where` criteria in a query.
Open Distro for Elasticsearch Security adds support for a new configuration syntax and a streamlined YAML configuration. This release has a new version of the LDAP/Active Directory module, which supports querying of multiple role bases and more sophisticated connection pooling.
Open Distro for Elasticsearch SQL adds more test coverage and provides the capability to enable and disable SQL features. The SQL JDBC driver adds time zone conversion for datetime fields.
Open Distro now includes Job Scheduler which exposes a service provider interface (SPI) for other plugins to schedule periodic jobs. The Job Scheduler supports interval and cron scheduling, and allows the extension plugin to enforce singleton job instances using locking.

## PRs included this release

You can find details on enhancements, bug fixes, and more in the release notes for each plugin in their respective GitHub repositories. See [Alerting](https://github.com/opendistro-for-elasticsearch/alerting/releases), [Alerting Kibana UI](https://github.com/opendistro-for-elasticsearch/alerting-kibana-plugin/releases), [Performance Analyzer](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/opendistro-1.0/release-notes), [PerfTop](https://github.com/opendistro-for-elasticsearch/perftop/blob/opendistro-1.0/release-notes), [Security](https://github.com/opendistro-for-elasticsearch/security/releases), [Security Kibana UI](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/releases), [SQL](https://github.com/opendistro-for-elasticsearch/sql/releases), [SQL JDBC](https://github.com/opendistro-for-elasticsearch/sql-jdbc/releases) driver and [Job Scheduler](https://github.com/opendistro-for-elasticsearch/job-scheduler/releases). You can find full details in the [release notes](https://discuss.opendistrocommunity.dev/t/open-distro-for-elasticsearch-1-0-0-is-now-available/986/2).

## Questions

Please feel free to ask questions on the[project community discussion forum](https://discuss.opendistrocommunity.dev/).

## Report a bug or request a feature

You can file a bug, request a feature, or propose new ideas to enhance Open Distro for Elasticsearch on our [GitHub community](https://github.com/opendistro-for-elasticsearch/community/issues) issues page. If you find bugs or want to propose a feature for a particular plugin, create an issue in the individual plugin repository. Check out the [full project source](https://github.com/opendistro-for-elasticsearch/).


