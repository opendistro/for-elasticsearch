---
layout: posts
author: Atri Sharma and Jon Handler
comments: true
title: Running Open Distro for Elasticsearch on Kubernetes
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/22/open_disto-elasticsearch-logo-800x400.jpg"
---

It’s hard to size and scale an Elasticsearch cluster. You need to have sufficient storage for your data, but your mappings and the contents of the data are key components to your data’s size on disk. You need capacity for your queries and updates, but the amounts of CPU, JVM, disk, and network bandwidth you use are critically dependent on the queries you run and the updates you send. There’s no formula guaranteed to get it right: instead, you deploy, monitor, and adjust.

To test your deployment, you can play back your own logs and data, or you can use an automated tool. Elastic has created [Rally](https://github.com/elastic/rally/tree/master/esrally), a performance testing framework for Elasticsearch which you can use to generate a simulated load for your [Open Distro for Elasticsearch](https://github.com/opendistro-for-elasticsearch/) cluster. Through testing, you can ensure that your cluster is sized correctly and its performance is within your desired specifications.

Rally is full-featured, letting you run your own tests against your Elasticsearch cluster. Rally “tracks” are different types of benchmarks that you can run to exercise and measure your workload. You can add new tracks to extend Rally for custom workloads, or use one of the pre-configured tracks. In this blog post, you will run Rally on an Open Distro for Elasticsearch instance and measure its performance.

## Set up

You can follow our documentation to [set up Open Distro for Elasticsearch via RPM](https://opendistro.github.io/for-elasticsearch-docs/docs/install/rpm/)or you can follow the instructions in our prior post to [set up Open Distro for Elasticsearch with Docker Desktop.](https://aws.amazon.com/blogs/opensource/running-open-distro-for-elasticsearch/)
Rally is Python code. You need to [install Python 3](https://realpython.com/installing-python/) and [install pip 3](https://pip.pypa.io/en/stable/installing/) on the host where you plan to run Rally.

To install Rally, run:

`$ pip3 install esrally`

Rally supports custom configurations allowing you to fine tune many aspects of your test, including the location of your benchmarking directory, the tests you want to run, the level of forensic data to store, and more. You can [read the Rally docs](https://esrally.readthedocs.io/en/stable/) to find out how to customize your tests. For this post, start with the default configuration:

`$ esrally configure`

Rally will set up configuration, data, and log directories in your home directory under the .rally directory.

## Run your first race

By default, Rally creates an Elasticsearch cluster to test. You already have an Open Distro for Elasticsearch cluster running. You can use the `--pipeline benchmark-only` command line parameter to point Rally at your existing cluster instead.

Rally’s *tracks* **specify test configurations. There are twelve pre-configured tracks, each complete with data sets. You can see these tracks with the command `esrally list tracks`. For your first test, you’ll use the *nyc_taxis* track.

The `--client-options` are where you specify credentials that allow Rally to authenticate against the security plugin. I’ve used the default credentials for the admin user (which I haven’t changed, though best practice is to change them). I also specified `verify-certs:false`, since Rally will reject the demo certificate.

`esrally --pipeline benchmark-only --track=nyc_taxis``--challenge append-no-conflicts-index-only``--target-host=http://localhost:9200``--client-options=``"use_ssl:true,basic_auth_user:'admin',basic_auth_password:'admin',verify_certs:false"`

The above command assumes you are running Open Distro for Elasticsearch’s Security plugin with basic auth and SSL transport. Be sure to replace the username and password with your own.

Rally will download a portion of the [New York City Taxi and Limousine Trip Record data set.](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page) It will send the data to Elasticsearch and run corresponding search workloads. At the end, Rally issues a summary of indexing times, query latencies, and cluster metrics.

## Where to go from here

You can customize Rally’s tracks, or create your own track to load your data and run your queries against Open Distro for Elasticsearch. With solid testing, you can dial in your cluster’s instance types and your shard strategy for your workload. With the right setup, Open Distro for Elasticsearch will be easier to run and manage.

Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

