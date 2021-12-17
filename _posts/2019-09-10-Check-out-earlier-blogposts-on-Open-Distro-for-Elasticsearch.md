---
layout: redirect
excerpt: " "
author: Alolita Sharma
comments: true
title: "Check out earlier blog posts on Open Distro"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"

new_url: https://opensearch.org/blog/odfe-updates/2019/09/Check-out-earlier-blogposts-on-Open-Distro-for-Elasticsearch/
---
Hi Open Distro blog readers,

Check out earlier blogs posts for Open Distro for Elasticsearch which were published on the AWSOpen blog. Going forward, bookmark the Open Distro blog as your source for in-depth, technical articles on the project. You’ll find how-tos, release notes, case studies, event announcements, and if you’re inspired to contribute, your own content, too!

<b>Add Single Sign-On (SSO) to Open Distro for Elasticsearch Kibana Using SAML and Okta</b>

by Jagadeesh Pusapadi, Aug 16 2019

Open Distro for Elasticsearch Security implements the web browser single sign-on (SSO) profile of the SAML 2.0 protocol. This enables you to configure federated access with any SAML 2.0 compliant identity provider (IdP). In a prior post, I discussed setting up SAML-based SSO using Microsoft Active Directory Federation Services (ADFS). In this post, I’ll cover the Okta-specific configuration.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-saml-okta/)

<b>Demystifying Elasticsearch Shard Allocation</b>

by Vigya Sharma and Jon Handler, Aug 13 2019

At the core of Open Distro for Elasticsearch’s ability to provide a seamless scaling experience, lies its ability distribute its workload across machines. This is achieved via sharding. When you create an index you set a primary and replica shard count for that index. Elasticsearch distributes your data and requests across those shards, and the shards across your data nodes.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-elasticsearch-shard-allocation/)

<b>Open Distro for Elasticsearch 1.1.0 Released</b>

by Alolita Sharma and Jon Handler, Aug 07 2019

We are happy to announce that Open Distro for Elasticsearch 1.1.0 is now available for download! Version 1.1.0 includes the upstream open source versions of Elasticsearch 7.1.1, Kibana 7.1.1, and the latest updates for alerting, SQL, security, performance analyzer, and Kibana plugins, as well as the SQL JDBC driver. You can find details on enhancements, bug fixes, and more in the release notes for each plugin in their respective GitHub repositories.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-1-1-0-released/)

<b>Use Elasticsearch’s rollover API For Efficient Storage Distribution</b>

by Jon Handler, Aug 06 2019

Many Open Distro for Elasticsearch users manage data life cycle in their clusters by creating an index based on a standard time period, usually one index per day. This pattern has many advantages - ingest tools like Logstash support index rollover out of the box; defining a retention window is straightforward; and deleting old data is as simple as dropping an index.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-rollover-storage-best-practice/)

<b>Add Single Sign-On to Open Distro for Elasticsearch Kibana Using SAML and ADFS</b>

by Jagadeesh Pusapadi, Aug 02 2019

Open Distro for Elasticsearch Security (Open Distro Security) comes with authentication and access control out of the box. Prior posts have discussed LDAP integration with Open Distro for Elasticsearch and JSON Web Token authentication with Open Distro for Elasticsearch.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-single-sign-on-saml-adfs/)

<b>Open Distro for Elasticsearch version 1.0.0 is now available</b>

by Alolita Sharma, Jul 01 2019

Open Distro for Elasticsearch 1.0.0 is now available for you to download and run! The 1.0.0 release includes Elasticsearch 7.0.1 and Kibana 7.0.1 from upstream and the latest versions of the Open Distro for Elasticsearch plugins for alerting, performance analyzer, SQL, and security. The Kibana UI components for security and alerting are also part of this release. You can find Open Distro for Elasticsearch Docker images and Kibana Docker images on Docker Hub.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-version-1-0-0-available/)

<b>Manage Your Open Distro for Elasticsearch Alerting Monitors With odfe-monitor-cli</b>

by Mihir Soni, Jun 12 2019

When you use Open Distro for Elasticsearch Alerting, you create monitors in Kibana. Setting up monitors with a UI is fast and convenient, making it easy to get started. If monitoring is a major workload for your cluster, though, you may have hundreds or even thousands of monitors to create, update, and tune over time. Setting so many monitors using the Kibana UI would be time-consuming and tedious.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-alerting-monitors-command-line/)

<b>Set up Multi-Tenant Kibana Access in Open Distro for Elasticsearch</b>

by Jon Handler, Jun 04 2019

Elasticsearch has become a default choice for storing and analyzing log data to deliver insights on your application’s performance, your security stance, and your users’ interactions with your application. It’s so useful that many teams adopt Elasticsearch early in their development cycle to support DevOps. This grass-roots adoption often mushrooms into a confusing set of clusters and users across a large organization.

[Read more](https://aws.amazon.com/blogs/opensource/multi-tenant-kibana-open-distro-for-elasticsearch/)

<b>New! Open Distro for Elasticsearch’s Job Scheduler Plugin</b>

by Alolita Sharma and Jon Handler, May 29 2019

Open Distro for Elasticsearch’s JobScheduler plugin provides a framework for developers to accomplish common, scheduled tasks on their cluster. You can implement Job Scheduler’s Service Provider Interface (SPI) to take snapshots, manage your data’s lifecycle, run periodic jobs, and much more. When you use Job Scheduler, you build a plugin that implements interfaces provided in the Job Scheduler library.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-job-scheduler-plugin/)

<b>Store Open Distro for Elasticsearch’s Performance Analyzer Output in Elasticsearch</b>

by Jon Handler, May 25 2019

Open Distro for Elasticsearch‘s Performance Analyzer plugin exposes a REST API that returns metrics from your Elasticsearch cluster. To get the most out of these metrics, you can store them in Elasticsearch and use Kibana to visualize them. While you can use Open Distro for Elasticsearch’s PerfTop to build visualizations, PerfTop doesn’t retain data and is meant to be lightweight.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearchs-performance-analyzer-kibana/)

<b>Use JSON Web Tokens (JWTs) to Authenticate in Open Distro for Elasticsearch and Kibana</b>

by Neeraj Prashar and Jon Handler, May 23 2019

Token-based authentication systems are popular in the world of web services. They provide many benefits, including (but not limited to) security, scalability, statelessness, and extensibility. With Amazon’s Open Distro for Elasticsearch, users now have an opportunity to take advantage of the numerous security features included in the Security plugin. One such feature is the ability to authenticate users with JSON Web Tokens (JWT) for a single sign-on experience.

[Read more](https://aws.amazon.com/blogs/opensource/json-web-tokens-jwt-authenticate-open-distro-for-elasticsearch-kibana/)

<b>Build Your Own - Open Distro for Elasticsearch Build Scripts Now Available</b>

by Alolita Sharma, May 16 2019

Want to craft your own Docker images using Open Distro for Elasticsearch build scripts? Or build your RPM or Debian packages to customize your own Open Distro for Elasticsearch stack? Our build scripts for Elasticsearch and for Kibana are now available for you to do just that.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-build-scripts-available/)

<b>Running Open Distro for Elasticsearch on Kubernetes</b>

by Saad Rana, May 15 2019

This post is a walk-through on deploying Open Distro for Elasticsearch on Kubernetes as a production-grade deployment.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-on-kubernetes/)

<b>Run Rally with Open Distro for Elasticsearch</b>

by Atri Sharma and Jon Handler, May 09 2019

It’s hard to size and scale an Elasticsearch cluster. You need to have sufficient storage for your data, but your mappings and the contents of the data are key components to your data’s size on disk. You need capacity for your queries and updates, but the amounts of CPU, JVM, disk, and network bandwidth you use are critically dependent on the queries you run and the updates you send.

[Read more](https://https://aws.amazon.com/blogs/opensource/esrally-open-distro-for-elasticsearch/)

<b>Open Distro for Elasticsearch 0.9.0 Now Available</b>

by Alolita Sharma, May 03 2019

The 0.9.0 release includes Elasticsearch 6.7.1, Kibana 6.7.1 from upstream and the latest Open Distro plugins which include the alerting plugin, the performance analyzer, the SQL plugin and the security plugin. The Kibana UI components for the Open Distro plugins are also part of this release. You can find the details on enhancements, bug fixes, and more in the release notes for each plugin in their respective GitHub repository.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-0-9-0-now-available/)

<b>LDAP Integration for Open Distro for Elasticsearch</b>

by Jagadeesh Pusapadi, Apr 19 2019

Open Distro for Elasticsearch’s security plugin comes with authentication and access control out of the box. In prior posts we showed how you can change your admin password in Open Distro for Elasticsearch and how you can add your own SSL certificates to Open Distro for Elasticsearch.

[Read more](https://aws.amazon.com/blogs/opensource/ldap-integration-for-open-distro-for-elasticsearch/)

<b>Open Distro for Elasticsearch Debian Packages Now Available for Version 0.8.0</b>

by Allen Yin and Alolita Sharma, Apr 17 2019

You can now download Open Distro for Elasticsearch version 0.8.0 for Debian and Ubuntu environments. Open Distro for Elasticsearch 0.8.0 is built on the Apache 2.0 licensed versions of Elasticsearch and Kibana 6.6.2. See the Open Distro for Elasticsearch downloads page for instructions on how to download and install the .deb packages.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-debian-packages-available-0-8-0/)

<b>Lightweight Debugging with Performance Analyzer and PerfTop in Open Distro for Elasticsearch</b>

by Jon Handler, Apr 12 2019

When you want to monitor your Elasticsearch cluster or debug an issue, you have a number of choices. You can use the various cat and stats APIs to pull information out of the cluster. You can monitor and profile the JVM itself. These options can be cumbersome, and they lack visual displays. While you could push cat and stats data back into Elasticsearch and visualize with Kibana, sometimes you want a more lightweight method.

[Read more](https://aws.amazon.com/blogs/opensource/analyze-your-open-distro-for-elasticsearch-cluster-using-performance-analyzer-and-perftop/)

<b>New Release! Open Distro for Elasticsearch version 0.8.0</b>

by Alolita Sharma, Apr 10 2019

Open Distro for Elasticsearch 0.8.0 is now available for you to download and run. Release highlights include support for Elasticsearch 6.6.2, Kibana 6.6.2 and various minor enhancements and bug fixes for the plugins. The alerting plugin has been updated to the latest Kotlin version 1.3. The SQL plugin index pattern queries have been fixed in the JDBC driver.

[Read more](https://aws.amazon.com/blogs/opensource/update-open-distro-for-elasticsearch-version-0-8-0/)

<b>Use Open Distro for Elasticsearch to Alert on Security Events</b>

by Shivang Doshi, Apr 05 2019

Open Distro for Elasticsearch’s Security plugin ships with the capability to create an audit log to track access to your cluster. You can surface various types of audit events like authentications, and failed logins. In a prior post, we covered the basics of setting an alert in Open Distro for Elasticsearch.

[Read more](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-alert-security-events/)

<b>Set an Alert in Open Distro for Elasticsearch</b>

by Jon Handler, Apr 03 2019

One of Elasticsearch’s primary use cases is log analytics - you collect logs from your infrastructure, transform each log line into JSON documents, and send those documents to Elasticsearch’s bulk API. A transformed log line contains many fields, each containing values.

[Read more](https://aws.amazon.com/blogs/opensource/iot-alerting-open-distro-for-elasticsearch/)

<b>Add Your Own SSL Certificates to Open Distro for Elasticsearch</b>

by Jagadeesh Pusapadi and Jon Handler, Mar 29 2019

Open Distro for Elasticsearch’s security plugin comes with authentication and access control out of the box. To make it easy to get started, the binary distributions contain passwords and SSL certificates that let you try out the plugin.

[Read more](https://aws.amazon.com/blogs/opensource/add-ssl-certificates-open-distro-for-elasticsearch/)

<b>Build and Run the Open Distro For Elasticsearch SQL Plugin with Elasticsearch OSS</b>

by Jon Handler, Mar 27 2019

Open Distro for Elasticsearch comprises four plugins - SQL, Security, Alerting and Performance.  In this blog post, we start with the SQL plugin. Other plugins have different codebases and compilation methods. Stay tuned!

[Read more](https://aws.amazon.com/blogs/opensource/build-run-sql-plugin-open-distro-elasticsearch-oss/)

<b>Change your Admin Passwords in Open Distro for Elasticsearch</b>

by Jon Handler, Mar 21 2019

Open Distro for Elasticsearch ships with an advanced security plugin. The plugin comes pre-configured with a number of different users and default passwords for them – of course, you will want to change those defaults! Passwords for some of the preconfigured users—kibanaro, logstash, readall, and snapshotrestore—are available to change in the Security UI in Kibana. The admin and kibanaserver users are set to read-only, and must be changed in the configuration files.

[Read more](https://aws.amazon.com/blogs/opensource/change-passwords-open-distro-for-elasticsearch/)

<b>Get Up and Running with Open Distro for Elasticsearch</b>

by Jon Handler, Mar 19 2019

On March 11, 2019, we released Open Distro for Elasticsearch, a value-added distribution of Elasticsearch that is 100% open source (Apache 2.0 license) and supported by AWS.

[Read more](https://aws.amazon.com/blogs/opensource/running-open-distro-for-elasticsearch/)

Enjoy!
