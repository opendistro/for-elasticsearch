---
layout: posts
author: Pallavi Priyadarshini
comments: true
title: "Announcing the experimental release of Cross-Cluster Replication"
category:
- releases
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---

Today we are excited to announce the experimental release of Cross-Cluster Replication in Open Distro for Elasticsearch, which enables customers to replicate indices from one Elasticsearch cluster to another.  The key drivers for the new native replication feature are:

* **High Availability:** Cross-cluster replication ensures uninterrupted service availability with the ability to failover to an alternate cluster in case of failure or outages on the primary cluster.
* **Reduced Latency:** Replicating data to a cluster that is closer to the application users minimizes the query latency. ****
* **Horizontal scalability:** Splitting a query heavy workload across multiple replica clusters improves application availability.
* **Aggregated reports:** Enterprise customers can roll up reports continually from smaller clusters belonging to different lines of business into a central cluster for consolidated reports, dashboards or visualizations.

This experimental release is not intended for production use. Users can try out the plugin in a sandbox environment and provide feedback on issues and enhancements. 


## Introducing Cross-Cluster Replication

Cross-Cluster Replication follows an active-passive replication model where the *follower cluster* (where the data is replicated) pulls data from the *leader (source) cluster*. The tenets that guided our feature design are:

* **Secure**: Cross-cluster replication should offer strong security controls for all flows and APIs.
* **Accuracy**: There must be no difference between the intended contents of the follower index and the leader index.
* **Performance**: Replication should not impact indexing rate of the leader cluster. 
* **Eventual Consistency**: The replication lag between the leader and the follower cluster should be under a few seconds.
* **Resource usage**: Replication should use minimal resources.

The replication feature is implemented as an Elasticsearch plugin that exposes APIs to control replication, spawns background persistent tasks to asynchronously replicate indices and utilizes snapshot repository abstraction to facilitate bootstrap. Replication relies on [cross-cluster connection setup](https://github.com/opendistro-for-elasticsearch/cross-cluster-replication/blob/main/HANDBOOK.md#setup-cross-cluster-connectivity) from the follower cluster to the leader cluster for connectivity. The replication plugin offers seamless integration with the [Open Distro for Elasticsearch Security plugin](https://opendistro.github.io/for-elasticsearch-docs/docs/security/). Users can encrypt cross-cluster traffic via the node-to-node encryption feature and control access for replication activities via the security plugin. 

Upon establishing secure connectivity between the clusters, users can start replicating indices from the leader cluster onto the follower cluster. The feature also allows for replication of indices using wildcard pattern matching and provides controls to stop replication. Once replication is started on an index, it initiates a background persistent task on the primary shard in the follower cluster that continuously polls corresponding shards from the leader index for updates. [The Request for Comments (RFC)](https://github.com/opendistro-for-elasticsearch/cross-cluster-replication/blob/main/docs/RFC.md) document provides more details on the feature, its underlying security and permission models, and the supported APIs. 

## Getting Started 

The cross-cluster replication plugin currently supports Elasticsearch version 7.10.2. Following steps will help you install the replication plugin on a test cluster.

### Step 1: Spin up two test clusters with Open Distro for Elasticsearch 1.13 and install the replication plugin

Clone the cross-cluster-replication repository and spin up the clusters from the [packaged example](https://github.com/opendistro-for-elasticsearch/cross-cluster-replication/tree/main/examples/sample) via docker-compose.

```
# 1. Clone the cross-cluster-replication repo
git clone https://github.com/opendistro-for-elasticsearch/cross-cluster-replication.git 

# 2. Navigate to example directory
cd cross-cluster-replication/examples/sample

# 3. Build local image with replication plugin
docker build -t open-distro-for-es-with-replication ./open-distro-for-es-with-replication

# 4. Bring up 2 clusters with replication plugin installed
docker-compose up

# 5. Set variables for readability (in different terminal window/tab where you will run rest of the steps)
export LEADER=localhost:9200
export FOLLOWER=localhost:9201
export LEADER_IP=172.18.0.10
```

**If you are setting this up on your own Open Distro for Elasticsearch 1.13 cluster, please follow [instructions](https://github.com/opendistro-for-elasticsearch/cross-cluster-replication/blob/main/HANDBOOK.md#setup-for-custom-open-distro-for-elasticsearch-clusters) in the handbook.**

### Step 2: Setup cross-cluster connectivity

Setup remote cluster connection from follower cluster to the leader cluster. The Open Distro for Elasticsearch security plugin ensures the cross-cluster traffic is encrypted if enabled.

```
# NOTE: Using admin user for demo purposes only
curl -k -u admin:admin -XPUT "https://${FOLLOWER}/_cluster/settings?pretty" \
-H 'Content-Type: application/json' -d"
{
  \"persistent\": {
    \"cluster\": {
      \"remote\": {
        \"leader-cluster\": {
          \"seeds\": [ \"${LEADER_IP}:9300\" ]
        }
      }
    }
  }
}
"
```

### Step 3: Populate leader cluster with sample data

```
curl -k -u admin:admin -XPUT "https://${LEADER}/leader-01?pretty" \
-H 'Content-Type: application/json' -d'
{
  "settings": {
    "index": {
      "number_of_shards": 1,  
      "number_of_replicas": 0 
    }
  }
}
'

# Populate data
curl -k -u admin:admin -XPOST "https://${LEADER}/leader-01/_doc/1" \
-H 'Content-Type: application/json' -d '{"value" : "data1"}'

```

### Step 4: Configure permissions

The required permissions are documented in the [security section](https://github.com/opendistro-for-elasticsearch/cross-cluster-replication/blob/main/HANDBOOK.md#security) of the handbook. The script from the sample helps in configuring the required minimal permissions for a user named “testuser”.

```
sh ./setup_permissions.sh "${LEADER}"
sh ./setup_permissions.sh "${FOLLOWER}"
```

### Step 5: Start replication

Now you can begin replication as follows.

```
curl -k -u testuser:testuser -XPUT \
"https://${FOLLOWER}/_opendistro/_replication/follower-01/_start?pretty" \
-H 'Content-type: application/json' \
-d'{"remote_cluster":"leader-cluster", "remote_index": "leader-01"}'
```

### Step 6: Make changes to data on leader index

```
# 1. Modify doc with id 1
curl -k -u admin:admin -XPOST "https://${LEADER}/leader-01/_doc/1" \
-H 'Content-Type: application/json' -d '{"value" : "data1-modified"}'

# 2. Add doc with id 2
curl -k -u admin:admin -XPOST "https://${LEADER}/leader-01/_doc/2" \
-H 'Content-Type: application/json' -d '{"value" : "data2"}'
```

### Step 7: Validate replicated content on the follower

```
# 1. Validate replicated index exists
curl -k -u admin:admin -XGET "https://${FOLLOWER}/_cat/indices"
# The above should list "follower-01" as on of the index as well

# 2. Check content of follower-01
curl -k -u admin:admin -XGET "https://${FOLLOWER}/follower-01/_search?pretty"
# The above should list 2 documents with id 1 and 2 and matching content of
# leader-01 index on $LEADER cluster
```

At this point, any changes to `leader-01` continues to be replicated to `follower-01`.

### Step 8: Stop replication

Stopping replication opens up the replicated index on the follower cluster for writes. This can be leveraged to failover to the follower cluster when the need arises.

```
curl -k -u testuser:testuser -XPOST \
"https://${FOLLOWER}/_opendistro/_replication/follower-01/_stop?pretty" \
-H 'Content-type: application/json' -d'{}'

# You can confirm data isn't replicated any more by making modifications to
# leader-01 index on $LEADER cluster 
```

### Handbook for more details

The [handbook](https://github.com/opendistro-for-elasticsearch/cross-cluster-replication/blob/main/HANDBOOK.md) in the cross-cluster replication repository provides additonal examples with details.

## Summary

In this post, we introduced cross-cluster replication with a discussion on its motivation, design tenets, user experience and instructions to try out the experimental release. This release includes the foundational features of cross-cluster replication. We are adding more exciting features like resiliency and performance improvements in the next phases.  We invite the community to collaborate with us to build out this feature, and to make cross-cluster replication resilient, efficient, and performant.

## Contributing to cross-cluster replication 

You can start contributing to the replication project in many ways. Ask questions and share your knowledge with other community members on the Open Distro [discussion forums](https://discuss.opendistrocommunity.dev/c/cross-cluster-replication/53) or through our online [community meetup](https://www.meetup.com/Open-Distro-for-Elasticsearch-Meetup-Group). Share your [feedback and comments](https://github.com/opendistro-for-elasticsearch/cross-cluster-replication/issues/1) on the overall goals, user-experience, architecture and features of the replication project. Moreover, submit [pull requests](https://github.com/opendistro-for-elasticsearch/cross-cluster-replication/blob/main/CONTRIBUTING.md#contributing-via-pull-requests) using community guidelines to collaborate with us on new feature development and bug resolution.


## About the Authors

**Pallavi Priyadarshini** is an Engineering Manager at Amazon Web Services, leading the design and development of high-performing and at-scale analytics technologies.

**Gopala Krishna** is a Senior Software Engineer working on Search Services at Amazon Web Services. His primary interests are distributed systems, networking and search. He is an active contributor to Open Distro for Elasticsearch.

**Saikumar Karanam** is a Software engineer working on Search Services at Amazon Web Services. His interests are distributed systems, networking and machine learning. He is an active contributor to Open Distro for Elasticsearch.
