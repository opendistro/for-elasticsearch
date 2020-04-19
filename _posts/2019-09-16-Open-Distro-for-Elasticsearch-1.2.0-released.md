---
layout: posts
author: Alolita Sharma
comments: true
title: "Open Distro for Elasticsearch 1.2.0 Released"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

# Open Distro for Elasticsearch 1.2.0 is now available with new Linux tarball packages

Open Distro for Elasticsearch 1.2.0 is now available for download.

## **What’s Included in 1.2.0**

Release 1.2.0 includes upstream open source versions of Elasticsearch 7.2.0, Kibana 7.2.0 and all Open Distro plugins including alerting, performance analyzer, security, SQL, Kibana plugins for alerting, security, SQL, and the SQL JDBC driver. It also includes PerfTop, a client for Performance Analyzer. You can find details on enhancements, bug fixes, and more in the release notes for each plugin on GitHub. See Open Distro’s[ version history](https://opendistro.github.io/for-elasticsearch-docs/version-history/) table if you need to use a previous release of the distribution.

## **Download the Latest Packages**

Docker images for this release of[ Open Distro for Elasticsearch](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch) and[ Kibana](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch-kibana) can be downloaded from Docker Hub. If you are using Docker, make sure your compose file specifies 1.2.0 or uses the latest tag. Additionally, [RPMs](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/) and [Debian](https://opendistro.github.io/for-elasticsearch-docs/docs/install/deb/) packages are available for installation. You can download the PerfTop client [here](https://www.npmjs.com/package/@aws/opendistro-for-elasticsearch-perftop) and our SQL JDBC driver [here](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-clients/opendistro-sql-jdbc/opendistro-sql-jdbc-0.9.0.0.jar). You can also find our Security plugin artifacts on [Maven Central](https://mvnrepository.com/artifact/com.amazon.opendistroforelasticsearch).

Also check out the new Open Distro for Elasticsearch [Linux tarball](https://opendistro.github.io/for-elasticsearch/downloads.html) for version 1.2.0 as well as the [Linux tarball for Open Distro Kibana version 1.2.0](https://opendistro.github.io/for-elasticsearch/downloads.html).

## **Release Details**

### **ALERTING**

* Cleanup ElasticThreadContextElement (#[95](https://github.com/opendistro-for-elasticsearch/alerting/pull/95))
* Don't allow interval to be set with 0 or negative values (#[92](https://github.com/opendistro-for-elasticsearch/alerting/pull/92))
* Update execute API to keep thread context. Use the ElasticThreadContextElement when executing a monitor to preserve the context variables needed (#[90](https://github.com/opendistro-for-elasticsearch/alerting/pull/90))

### **ALERTING KIBANA UI**

* Bump fstream from 1.0.11 to 1.0.12 (#[82](https://github.com/opendistro-for-elasticsearch/alerting-kibana-plugin/pull/82))

### **PERFORMANCE ANALYZER**

* Add RCA RFC (#72)
* Reorder imports, refactor unit tests
* Fix unit tests on Mac. Fix Null Pointer Exception during MasterServiceEventMetrics collection
* Fix NullPointerException when Performance Analyzer starts collecting metrics before master node is fully up

### **SECURITY**

* Make permissions for protected index equal to that of the security index. Protected Index Kibana Fix 1.1 (#[132](https://github.com/opendistro-for-elasticsearch/security/pull/132))
* Add ability to block indices and index patterns to certain roles, adding another level of protection for these indices. Ability to protect indices even further. (#[126](https://github.com/opendistro-for-elasticsearch/security/pull/126))
* Initialize opendistro index if injected user enabled. (#[125](https://github.com/opendistro-for-elasticsearch/security/pull/125))
* Fix security configuration
* Bump com.fasterxml.jackson.core to version 2.9.9.2

### **SECURITY ADVANCED MODULES**

* Add supporting changes for protected index. Changes to support PrivilegesEvaluator in OpenDistroSecurityFlsDlsIndexSearcherWrapper. (#[37](https://github.com/opendistro-for-elasticsearch/security-advanced-modules/pull/37))
* Fix API endpoint naming
* Fix security configuration
* Bump com.fasterxml.jackson.core to version 2.9.9.2

### **SECURITY KIBANA UI**

* Fixed incorrect argument order when calling build.sh
* Fix password validation error
* Add ability to configure logout_url for 1.2 (#[82](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/pull/82))
* Fix API endpoint naming

### **SQL**

* Support vanilla LEFT JOIN on nested docs (#[167](https://github.com/opendistro-for-elasticsearch/sql/pull/167))
* Add parent for SQLExpr in AST if missing (#[180](https://github.com/opendistro-for-elasticsearch/sql/pull/180))
* Ignore easily broken test on join limit hint (#[181](https://github.com/opendistro-for-elasticsearch/sql/pull/181))
* Support using attributes aliases in nested query where condition (#[178](https://github.com/opendistro-for-elasticsearch/sql/pull/178))
* Added 2 new functions LOWER and UPPER that receive field name and locale (#[177](https://github.com/opendistro-for-elasticsearch/sql/pull/177))
* Changed identifier generation strategy to id per function name instead of global id (#[128](https://github.com/opendistro-for-elasticsearch/sql/pull/128))
* Added ability to have aliases for ORDER BY and GROUP BY expressions (#[171](https://github.com/opendistro-for-elasticsearch/sql/pull/171))
* Removed timeouts from flaky tests, replacing them with mocked clock to check invariants (#[172](https://github.com/opendistro-for-elasticsearch/sql/pull/172))
* Fix for inlines corresponding to fields and expressions in parser and AggregationQueryAction (#[162](https://github.com/opendistro-for-elasticsearch/sql/pull/162))
* Inline ORDER BY expressions (#[168](https://github.com/opendistro-for-elasticsearch/sql/pull/168))
* Enhance ORDER BY to support cases (#[158](https://github.com/opendistro-for-elasticsearch/sql/pull/158))
* Return all fields when * and fieldName are selected (#[165](https://github.com/opendistro-for-elasticsearch/sql/pull/165))
* Adding left-out import statement from resolving conflict during merge (#[164](https://github.com/opendistro-for-elasticsearch/sql/pull/164))
* Supports queries with WHERE clauses that have True/False in the condition (#[157](https://github.com/opendistro-for-elasticsearch/sql/pull/157))
* Enabled checkstyle and fixed the issues for the code to build (#[163](https://github.com/opendistro-for-elasticsearch/sql/pull/163))
* More records in aggregation query output for script functions (#[160](https://github.com/opendistro-for-elasticsearch/sql/pull/160), #[156](https://github.com/opendistro-for-elasticsearch/sql/pull/156))
* Added support for PERCENTILES in JDBC driver; Fix for #26 (#[146](https://github.com/opendistro-for-elasticsearch/sql/pull/146))
* Fix single condition results for text+keyword field for nested query (#[135](https://github.com/opendistro-for-elasticsearch/sql/pull/135))
* Added .vscode and build/ to .gitignore (#[139](https://github.com/opendistro-for-elasticsearch/sql/pull/139))
* Support IN predicate subquery (#[126](https://github.com/opendistro-for-elasticsearch/sql/pull/126))
* Fix bug, terminate integTestCluster even when integration test failed (#[133](https://github.com/opendistro-for-elasticsearch/sql/pull/133))
* Fixed unit test failure that was identified on a Jenkins: date format needs to be in UTC for proper comparison (#[130](https://github.com/opendistro-for-elasticsearch/sql/pull/130))

### **SQL JDBC**

* Support customer AWS credential providers (#[22](https://github.com/opendistro-for-elasticsearch/sql-jdbc/pull/22))

### **JOB SCHEDULER, PERFTOP, SECURITY PARENT**

* No changes.

You can find the latest release notes for each component at these URLs:[ Alerting](https://github.com/opendistro-for-elasticsearch/alerting/releases),[ Alerting Kibana UI](https://github.com/opendistro-for-elasticsearch/alerting-kibana-plugin/releases),[ Performance Analyzer](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/opendistro-1.0/release-notes),[ PerfTop](https://github.com/opendistro-for-elasticsearch/perftop/blob/opendistro-1.0/release-notes),[ Security](https://github.com/opendistro-for-elasticsearch/security/releases),[ Security Kibana UI](https://github.com/opendistro-for-elasticsearch/security-kibana-plugin/releases),[ SQL](https://github.com/opendistro-for-elasticsearch/sql/releases),[ SQL JDBC](https://github.com/opendistro-for-elasticsearch/sql-jdbc/releases) driver, and[ Job Scheduler](https://github.com/opendistro-for-elasticsearch/job-scheduler/releases).

## **Features In Development**

Check out and contribute to features in development! You can also download and use the development versions of these plugins to test, experiment, and provide feedback.

* [k-NN](https://github.com/opendistro-for-elasticsearch/k-NN) search
* [Index Management](https://github.com/opendistro-for-elasticsearch/index-management)
* [Index Management Kibana UI](https://github.com/opendistro-for-elasticsearch/index-management-kibana-plugin)

## **RCA Design RFC is now open for comments**

We’d love to get your feedback on the Performance Analyzer Root Cause Analysis (RCA) design RFC. Review it [here](https://github.com/opendistro-for-elasticsearch/performance-analyzer/tree/master/rca). You can provide comments [here](https://github.com/opendistro-for-elasticsearch/performance-analyzer/issues/73).

### **Questions?**

Please feel free to ask questions on the [project community discussion forum](https://discuss.opendistrocommunity.dev/). I also invite you to help answer questions on the forums for other community members to learn from.

### **Report a bug or request a feature?**

You can file bugs, request features, or propose new ideas to enhance Open Distro on our[ GitHub community](https://github.com/opendistro-for-elasticsearch/community/issues) issues page. If you find bugs or want to propose a feature for a particular plug-in, you can go to the specific repo and file an issue on the plug-in repo.

### **Getting Started?**

If you’re getting started on building your open source contribution karma, you can select an issue tagged as a “Good First Issue” to start contributing to Open Distro for Elasticsearch. There is extensive[ technical documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/install/) on the project website to help you get started.

Go build with Open Distro for Elasticsearch! 🚀

## About the Author

Alolita Sharma is a Principal Technologist at AWS focused on all things open source including Open Distro for Elasticsearch. You can find her on Twitter @alolita.
