---
layout: posts
author: Shivang Doshi
comments: true
title: "Use Open Distro for Elasticsearch to Alert on Security Events"
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/05/image8-Monitor-Triggered-1024x580.png"
---

[Open Distro for Elasticsearch’s Security plugin](https://github.com/opendistro-for-elasticsearch/security) ships with the capability to create an audit log to track access to your cluster. You can surface various types of audit events like authentications, and failed logins. In a prior post, we covered the basics of [setting an alert in Open Distro for Elasticsearch](https://aws.amazon.com/blogs/opensource/iot-alerting-open-distro-for-elasticsearch/). In this post, we will couple the security plugin with the [A](https://github.com/opendistro-for-elasticsearch/alerting)[lerting plugin](https://github.com/opendistro-for-elasticsearch/alerting) to enable alerts on failed login attempts. You can expand this pattern to get notified whenever there are potentially malicious attempts to access your Elasticsearch cluster.

## Set Up Your Monitor

Audit logging is enabled by setting `opendistro_security.audit.type`:` internal_elasticsearch` in your `elasticsearch`.`yml` file. Our Docker and rpm distributions enable this setting by default.

Open your Kibana dashboard, go to the Alerting tab, and click on Create Monitor. Give the monitor a name and the Schedule of when you want it to run. I named my monitor Audit Unauthorized Access Events, and set it to run Every 1 minute.

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/04/Image1-Create-Monitor-1024x580.png" style="width: 100%; max-width: 600px;">
</div>

On the same page, scroll down to the Define Monitor section; this is where you define which index you want to monitor and an extraction condition for the data you will use to set a trigger for alerts. Set the index to `security-auditlog-*`, the destination for the security plugin’s audit logs. Define the monitor condition as WHEN count() OVER all documents FOR THE LAST 5 minute(s). Click on the Create button at the bottom to create your monitor.

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/04/image2-Define-Monitor-1024x580.png" style="width: 100%; max-width: 600px;">
</div>

You can also define the monitor using an extraction query. For example, if you just want to monitor Failed Login attempts in the last 5 minutes, then the extraction query might look like:

```json
`{"query": {"bool": {"must": [{"match": {"audit_category": {"query": "FAILED_LOGIN"}}},{"range" : {"audit_utc_timestamp" : {"gte" : "now-5m"}}}]}},"sort": [{"audit_utc_timestamp" : {"order" : "desc"}}]}`
```

## Set Up Your Trigger

Next, you need to create a trigger for this monitor. A trigger allows you to perform an action when the trigger’s condition on the monitor is met. I’ll create a trigger which sends an alert when my monitor query returns one or more results. Set the Trigger name to Unauthorized Access Events on ES Cluster, Severity level to 1, and Trigger condition to Above 1:

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/04/image3-Define-Trigger-1024x582.png" style="width: 100%; max-width: 600px;">
</div>

Scroll down and add an action for this trigger. I’ve configured an Amazon Chime room notification. Set the Action name to Notify OnCall, the Destination name to Chime, the Message subject to Unauthorized Access Events on ES Cluster, and add a descriptive Message. I copied my message [from our documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/alerting/monitors/#add-actions):

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/04/image4-configure-actions-1024x578.png" style="width: 100%; max-width: 600px;">
</div>

This is how the monitor dashboard looks once everything is created:

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/04/image5-Monitor-Overview-1-1024x581.png" style="width: 100%; max-width: 600px;">
</div>

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/04/image6-Monitor-Overview-2-1024x576.png" style="width: 100%; max-width: 600px;">
</div>

The green bar shows that there were no triggers in the recent past. You can create a trigger and alert by logging out from Kibana and using bad credentials to create a failed login attempt. Log back in again (with your real credentials) and you’ll see something like this (note the red in the bar at the corresponding timestamp:

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/05/image8-Monitor-Triggered-1024x580.png" style="width: 100%; max-width: 600px;">
</div>

You will also get an “Unauthorized Access Event” notification like this:

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/05/image9-Alert-Message-Received-1-1024x200.png" style="width: 100%; max-width: 600px;">
</div>


## Conclusion

In this post, we explored alerting on failed logins. The Security plugin supports [many more auditing categories](https://opendistro.github.io/for-elasticsearch-docs/docs/security/audit-logs-field-reference/). You can write complex extraction queries to alert on specific use cases such as repeated attempts to access a particular index.

You can also configure the data audit that logging generates by enabling/disabling certain categories in your `elasticsearch.yml`. You can find the list of those settings in [Audit Logs – Open Distro for Elasticsearch Documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/security/audit-logs/#exclude-categories).

Audit logging is useful in maintaining compliance and in the aftermath of a security breach. When used with Alerting, it can help you proactively defend your cluster.

Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

