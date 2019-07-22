---
layout: page
title: Open Distro for Elasticsearch 1.0 is now available!
categories:
- Open Distro for Elasticsearch
feature_image: "https://picsum.photos/2560/600?image=872"
---

Open Distro for Elasticsearch 1.0.0 is now available for you to download and run with

The 1.0.0 release includes Elasticsearch 7.0.1 and Kibana 7.0.1 from upstream and the latest versions of the Open Distro for Elasticsearch plugins for alerting, performance analyzer, SQL and security. The Kibana UI components for security and alerting are also part of this release.


<!-- more -->

Docker images for this release of Open Distro for Elasticsearch and Kibana can be downloaded from Docker Hub. If you are using Docker, make sure your compose file specifies 1.0.0 or uses the latest tag. Additionally, RPMs and Debian packages are available for installation. You can also download the PerfTop client here and our SQL JDBC driver here.

If you’re a developer interested in using individual Open Distro for Elasticsearch plugins, you can now learn how to download and install plugin ZIP files for Security, Alerting, and SQL from our documentation. Additionally, you can find our Security plugin on Maven Central. Also if you are looking to build positive open source contribution karma, you can start by visiting our GitHub repos, finding an issue tagged as a “good first issue” and start contributing!

Release Highlights

All plugins now support for Elasticsearch and Kibana release 7.0.1.

Alerting added a new feature for action throttling which allows you to set alert notification intervals that are less frequent than monitoring interval to reduce being spammed with notifications. Additionally, where criteria have been added to the visual monitor definitions, allowing for more flexible monitor definitions without using JSON.

Security added the ability to create tenants independent of roles and manage and map them separately simplifying management and usability. A new version of the LDAP/Active Directory module has also been added which supports querying of multiple role bases and more sophisticated connection pooling.

SQL added config for enabling and disabling SQL, expanded test coverage and additional bug fixes. The SQL JDBC driver added time zone conversion for datetime fields.

Open Distro is also now bundling Job Scheduler which provides a service provider interface (SPI) for other plugins to schedule periodic jobs. The Job Scheduler supports interval and cron scheduling, and allows the extension plugin to enforce singleton job instances using locking.

Release Notes

Detailed release notes for each plugin can be found on the project website.

Questions

Please feel free to ask questions on the project [community discussion forum].

Report a bug or request a feature

You can file a bug, request a feature, or propose new ideas to enhance Open Distro for Elasticsearch on our [GitHub community] issues page. If you find bugs or want to propose a feature for a particular plugin, create an issue in the individual plugin repository.

If you run into any issues using our build scripts, please let us know by filing an issue.

Happy downloading!