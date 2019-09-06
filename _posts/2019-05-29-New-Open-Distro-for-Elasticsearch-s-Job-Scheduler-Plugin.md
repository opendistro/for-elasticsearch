---
layout: posts
author: Alolita Sharma and Jon Handler
comments: true
title: New! Open Distro for Elasticsearch’s Job Scheduler Plugin
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

[Open Distro for Elasticsearch’s JobScheduler plugin](https://github.com/opendistro-for-elasticsearch/job-scheduler) provides a framework for developers to accomplish common, scheduled tasks on their cluster. You can implement Job Scheduler’s Service Provider Interface (SPI) to take snapshots, manage your data’s lifecycle, run periodic jobs, and much more.
When you use Job Scheduler, you build a plugin that implements interfaces provided in the Job Scheduler library. You can schedule jobs by specifying an interval, or using a Unix Cron expression to define a more flexible schedule to execute your job. Job Scheduler has a sweeper that listens for update events on the Elasticsearch cluster, and a scheduler that manages when jobs run.

**Build, install, code, run!**

You can build and install the Job Scheduler plugin by following the instructions in the [Open Distro for Elasticsearch Job Scheduler GitHub repo](https://github.com/opendistro-for-elasticsearch/job-scheduler).

Please take a look at the source code – play with it, build with it! Let us know if it doesn’t support your use case or if you have ideas for how to improve it. The `sample-extension-plugin` [example code](https://github.com/opendistro-for-elasticsearch/job-scheduler/tree/master/sample-extension-plugin) in the Job Scheduler source repo provides a complete example of using Job Scheduler.

Join in on GitHub to improve project documentation, add examples, [submit feature requests](https://github.com/opendistro-for-elasticsearch/job-scheduler/issues), and [file bug reports](https://github.com/opendistro-for-elasticsearch/job-scheduler/issues). Check out the code, build a plugin, and open a pull request – we’re happy to review and figure out steps to integrate. We welcome your participation on the project. If you have any questions, don’t hesitate to ask on the [community discussion forums](https://discuss.opendistrocommunity.dev/).



