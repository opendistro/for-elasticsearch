---
layout: redirect
excerpt: " "
author: Pavani Baddepudi
comments: true
title: "Real-time Anomaly Detection is now available in Open Distro 1.7.0"
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
new_url: https://opensearch.org/blog/odfe-updates/2020/05/Real-time-Anomaly-Detection-is-now-available-in-Open-Distro-for-Elasticsearch-1.7.0/
---

We are excited to announce the general availability of real-time [anomaly detection](https://github.com/opendistro-for-elasticsearch/anomaly-detection) for streaming applications in this [release](https://opendistro.github.io/for-elasticsearch/blog/odfe-updates/2020/05/Open-Distro-for-Elasticsearch-1.7.0-released/). We would like to thank the community for their feedback on the preview release of the feature. The anomaly detection feature is built on [RCF](https://github.com/aws/random-cut-forest-by-aws) (Random Cut Forest), an unsupervised algorithm, that detects anomalies on live data and identifies issues as they evolve in real time. RCF is a proven algorithm built on years of academic and industry research. We are glad to announce the general availability of the open source RCF libraries for the greater benefit of our data science community. 

 One of our key considerations was to design the anomaly detection to be lightweight so there is no overhead on the system resources processing application workloads. The computation of anomaly models are distributed across the nodes in Elasticsearch cluster, which makes the implementation highly scalable, and not requiring dedicated machine learning nodes. For more deep dive into anomaly detection system design and RCF algorithm, we recommend these previously released blogs:  [Real-time Anomaly Detection in Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/blog/odfe-updates/2019/11/real-time-anomaly-detection-in-open-distro-for-elasticsearch/) and [Random Cut Forests.](https://opendistro.github.io/for-elasticsearch/blog/odfe-updates/2019/11/random-cut-forests/)

Our new [Kibana user interface](https://github.com/opendistro-for-elasticsearch/anomaly-detection-kibana-plugin) for anomaly detection makes it easy for users with no prior machine learning knowledge to take advantage of the feature. The rich visualizations make it easy for users to detect the data points that contributed to an anomaly. The plugin is integrated with Open Distro for Elasticsearch [Alerting](https://github.com/opendistro-for-elasticsearch/alerting) to notify users through various supported channels as the anomalies are detected.

Figure 1: The new Anomaly Detection dashboard

![Figure 1: Anomaly detection dashboard]({{ site.baseurl }}/assets/media/blog-images/screencapture-search-ad-test-74-fnrhfsq36xu3idzglaawimnzhi-us-east-1-es-amazonaws-plugin-kibana-app-opendistro-anomaly-detection-kibana-2020-05-13-18_47_04.png){: .blog-image }

Figure 2: The Anomaly Detection results view

![Figure 2: Anomaly detector results view]({{ site.baseurl }}/assets/media/blog-images/screencapture-search-ad-test-74-fnrhfsq36xu3idzglaawimnzhi-us-east-1-es-amazonaws-plugin-kibana-app-opendistro-anomaly-detection-kibana-2020-05-13-18_26_59.png){: .blog-image }

## About the Author

Pavani Baddepudi is a senior product manager working on search services at Amazon Web Services.
