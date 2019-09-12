---
layout: posts
author: Mihir Soni
comments: true
title: Manage Your Open Distro for Elasticsearch Alerting Monitors With odfe-monitor-cli
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/06/12/Monitor-Text-2-1024x473.jpg"
---

When you use [Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/) Alerting, you create monitors in Kibana. Setting up monitors with a UI is fast and convenient, making it easy to get started. If monitoring is a major workload for your cluster, though, you may have hundreds or even thousands of monitors to create, update, and tune over time. Setting so many monitors using the Kibana UI would be time-consuming and tedious. Fortunately, the [Alerting plugin](https://github.com/opendistro-for-elasticsearch/alerting) has a [REST API](https://opendistro.github.io/for-elasticsearch-docs/docs/alerting/api/) that makes it easier for you to manage your monitors from the command line.

If you’re new to the alerting features in Open Distro for Elasticsearch, take a look at some prior posts, where we covered [the basics of setting up a monitor in Kibana](https://aws.amazon.com/blogs/opensource/iot-alerting-open-distro-for-elasticsearch/) and [alerting on Open Distro for Elasticsearch Security audit logs](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-alert-security-events/).

The Alerting plugin’s REST API lets you perform CRUD and other operations on your monitors. `odfe-monitor-cli` uses this API for its requests, but lets you save your monitors in YAML files. You can build an automated pipeline to deploy monitors to your cluster and use that pipeline to deploy the same monitors to multiple clusters that support development, testing, and production. You can maintain your monitors in a source control system for sharing, versioning, and review. The CLI helps you guard against drift by reading monitors from your cluster and diffing them against your YAML files.
This blog post explains how to manage your monitors using YAML files through [`odfe-monitor-cli`](https://github.com/mihirsoni/odfe-alerting), available on GitHub under the Apache 2.0 license.


## Prerequisite

`odfe-monitor-cli` currently uses HTTP basic authentication. Make sure basic authentication is enabled on your cluster.

## Install** **`odfe-monitor-cli`

The install process is a single command:

```
`curl -sfL https://raw.githubusercontent.com/mihirsoni/odfe-monitor-cli/master/godownloader.sh | bash -s -- -b /usr/local/bin`
```

Note: See [the `odfe-monitor-cli` README](https://github.com/mihirsoni/odfe-alerting/blob/master/README.MD) for other installation methods and instructions on how to build from source.
Once installation is successful, verify that it works as expected:

```
$ odfe-monitor-cli
This application will help you to manage the Opendistro alerting monitors using YAML files.

Usage:
  odfe-monitor-cli [command]
...
```

## Create and sync destinations

You define destinations in Open Distro for Elasticsearch Alerting to specify where messages (Slack, Chime, or custom) should be sent. `odfe-monitor-cli` doesn’t support managing destinations yet, so you need to use the Kibana UI to create them.
First, navigate to `https://localhost:5601` to access Kibana. Log in, and select the Alerting tab. Select Destinations, and create a destination.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/06/12/Screen-Shot-2019-06-03-at-5.50.40-PM.jpg" style="width: 100%;">
</div>

On your computer, create a new directory, `odfe-monitor-cli.`This directory will hold the monitors you create, and any monitors or destinations you sync from your cluster.


```
$ mkdir odfe-monitor-cli
$ cd odfe-monitor-cli
$ odfe-monitor-cli sync --destinations #Sync remote destination
```

The final command in that sequence fetches all remote destinations and writes them to a new file, `destinations.yml`. The file contains a map of destination names and IDs. You’ll use the destination name later when you create a monitor. If you view the file using `cat destinations.yml`, it should look like this:

```
#destinations.yml file content
sample_destination: _6wzIGsBoP5_pydBFBzc
```

If you already have existing monitors on your cluster and would like to preserve them, you can sync those, as well. If not, skip this step. This command fetches all remote monitors to `monitors.yml`:

```
odfe-monitor-cli sync --monitors #Sync existing remote monitors
```

You can add additional directories under your root directory and break your monitors into multiple YAML files, organizing them however you see fit. When you use `odfe-monitor-cli` to send changes to your cluster, it walks the entire directory structure under the current directory, finding all `.yml` files. Use the `--rootDir` option to change the root directory to traverse.

## Create a new monitor

Use a text editor to create a new file `error-count-alert.yml`. Copy and paste the yml below to that file, and change `destinationId` to the name of an existing destination. You can place your file anywhere in or below the `odfe-monitor-cli` directory.


```
- name: 'Sample Alerting monitor'
  schedule:
    period:
      interval: 10
      unit: MINUTES
  enabled: true
  inputs:
    - search:
        indices:
          - log* # Change this as per monitor, this is just an example
        query: # This block should be valid Elasticsearch query
          size: 0
          query:
            match_all: {
              boost: 1.0
            }
  triggers:
    - name: '500'
      severity: '2'
      condition: | #This is how you can create multiline
        // Performs some crude custom scoring and returns true if that score exceeds a certain value
        int score = 0;
        for (int i = 0; i < ctx.results[0].hits.hits.length; i++) {
          // Weighs 500 errors 10 times as heavily as 503 errors
          if (ctx.results[0].hits.hits[i]._source.http_status_code == "500") {
            score += 10;
          } else if (ctx.results[0].hits.hits[i]._source.http_status_code == "503") {
            score += 1;
          }
        }
        if (score > 99) {
          return true;
        } else {
          return true;
        }
      actions:
        - name: Sample Action
          destinationId: sample_destination #This destination should be available in destinations.yaml file otherwise it will throw an error.
          subject: 'There is an error'
          message: |
            Monitor {{ctx.monitor.name}} just entered an alert state. Please investigate the issue.
            - Trigger: {{ctx.trigger.name}}
            - Severity: {{ctx.trigger.severity}}
            - Period start: {{ctx.periodStart}}
            - Period end: {{ctx.periodEnd}}
```

`odfe-monitor-cli` provides a `diff` command that retrieves monitors from your cluster and walks your local directory structure to show you any differences between your cluster’s monitors and your local monitors. You can use the `diff` command to validate that no one has changed the monitors in your cluster. For now, call the `diff` command to verify that it finds the new monitor you just created.

```
$ odfe-monitor-cli diff
---------------------------------------------------------
 These monitors are currently missing in alerting
---------------------------------------------------------
name: 'Sample Alerting monitor'
type: 'monitor'
schedule:
...
```

After verifying the diff, you could get any new or changed monitors reviewed by peers, or approved by your management or security department.
You use the `push` command to send your local changes to your Open Distro for Elasticsearch cluster. When you use `push`, `odfe-monitor-cli` calls the [Run Monitor API](https://opendistro.github.io/for-elasticsearch-docs/docs/alerting/api/#run-monitor) to verify your monitor configurations and ensure that there are no errors. If any error occurs, `odfe-monitor-cli` displays the error with details. You can fix them and re-run the `push` command until you get a clean run.
By default, the `push` command runs in dry run mode, simply diffing and checking the syntax of any additions. Because it doesn’t publish anything to the cluster, it won’t publish any accidental changes. Use the `--submit` option to send your changes to your cluster when you’re ready:
`$ odfe-monitor-cli push --submit`
The `push` command does the following:

* Runs and validates modified and new monitors.
* Creates new monitors and updates existing monitors when the `--submit` flag is provided.
    Warning: Pushing changes with `--submit` overrides any changes you have made to existing monitors on your cluster (via Kibana or any other way).
* Does not delete any monitors. Provide `--delete` along with `--submit` to delete all untracked monitors. Be careful! You can’t un-delete monitors.

## Conclusion

This post introduced you to `odfe-monitor-cli`, a command-line interface for managing monitors on your Open Distro for Elasticsearch cluster. `odfe-monitor-cli` makes it easy to store your monitors in version control and deploy these monitors to your Open Distro for Elasticsearch cluster. You can validate that your monitors work as intended and share monitors between environments.
Have an issue or question? Want to contribute? Check out the [_Open Distro for Elasticsearch forums_](https://discuss.opendistrocommunity.dev/). You can [_file issues here_](https://github.com/opendistro-for-elasticsearch/community/issues). We welcome your participation on the project! See you on the forums and code repos!

