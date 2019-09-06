---
layout: posts
author: Alolita Sharma
comments: true
title: Running Open Distro for Elasticsearch on Kubernetes
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/14/opendistro-elk-saadrana-white-1024x556.png"
---

This post is a walk-through on deploying Open Distro for Elasticsearch on Kubernetes as a production-grade deployment.

[Ring is an Amazon subsidiary](https://blog.ring.com/2018/04/12/ring-now-part-amazon-family/) specializing in the production of smart devices for home security. With its signature product, the [Ring Video Doorbell](https://shop.ring.com/collections/video-doorbells//products/video-doorbell-2) and [Neighborhood Security feed](https://shop.ring.com/pages/neighbors) for many major cities, Ring is pursuing a mission to reduce crime in communities around the world. At Ring, we needed a scalable solution for storing and querying heavy volumes of security log data produced by Ring devices.

We had a few requirements for this log aggregation and querying platform. These included user authentication and Role-based Access Control (RBAC) for accessing logs, and SAML support for integrating authentication with our existing Single Sign-On infrastructure. We also required all communication to and within the platform to be encrypted in transit, as logs may contain sensitive data. Our final requirement was a monitoring system that could be used for security alerting, based on the incoming log data.

Open Distro for Elasticsearch provides several methods of authentication ranging from HTTP Basic authentication to Kerberos ticket-based authentication. Open Distro for Elasticsearch also provides a rich set of role-based access control (RBAC) features that allow locking down access to ingested log data at a very granular level. This makes securing our central logging platform very simple.

In addition, Open Distro for Elasticsearch provides SAML support for [Kibana,](https://github.com/elastic/kibana) the open source front-end UI for Elasticsearch. This SAML support allows for integrating the authentication with several Identity Providers such as AWS Single Sign-On or Okta. All communication to, from, and within the platform uses TLS encryption, which fulfills our encryption requirements as well.

Lastly, Open Distro for Elasticsearch offers alerting and monitoring services that allow setting up of custom security alerts and system health monitoring. Open Distro for Elasticsearch answered many of our needs for Ring’s Security Observability infrastructure.
As part of Ring’s Security Operations, we were already using Amazon Elastic Container Service for Kubernetes ([Amazon EKS](https://aws.amazon.com/eks/)) for deploying and maintaining a Kubernetes cluster responsible for housing our security tooling.

The team decided to deploy Open Distro for Elasticsearch in Kubernetes as a scaled-out deployment. Kubernetes is a very popular container orchestration platform and, as our logging requirements grow, Kubernetes allows us to continue scaling up the platform with ease and agility. It also reduces reliance on a configuration management infrastructure.
In this post, we’ll share some lessons we learned which we hope will help others in solving similar challenges.

## Prerequisites

This walk-through is focused on a deployment in Amazon EKS, the managed Containers-as-a-Service offering from AWS.

Please ensure that all dependent Kubernetes plugins are deployed in the cluster being used, such as `external-dns` or `KIAM`.

Ensure access to the cluster using the `kubectl` binary and corresponding `kubeconfig` credentials file.

Annotations for `external-dns` will not work if the `external-dns` service is not deployed. You can deploy it using the [community-developed Helm chart](https://github.com/helm/charts/tree/master/stable/external-dns).

Annotations for pod IAM roles will not work if KIAM is not deployed. You can deploy KIAM using its [community developed Helm chart](https://github.com/helm/charts/tree/master/stable/kiam).
This deployment requires TLS certificates to be bootstrapped, as well as an existing Certificate Authority for issuing said certificates. See our earlier post on how to [Add Your Own SSL Certificates to Open Distro for Elasticsearch](https://aws.amazon.com/blogs/opensource/add-ssl-certificates-open-distro-for-elasticsearch/) for more information on generating your own certificates.

## Project plan

Based on our previous experience deploying the community-developed version of Elasticsearch on Kubernetes, I decided to follow the same pattern with Open Distro for Elasticsearch.

This is the architecture we aimed for:

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/14/opendistro-elk-saadrana-white-1024x556.png" style="width: 100%;">
</div>

We decided to use Amazon EKS for a managed Kubernetes cluster, bearing in mind the following considerations:

* Ring Security already has a running Kubernetes cluster in Amazon EKS with the ability to scale worker nodes up or down for security tooling, which can easily be used to host this Open Distro for Elasticsearch cluster.
* The Cluster consists of eight m5.2xlarge instances being used as worker nodes, making it large enough to host our Elasticsearch cluster.
* Amazon EKS saves us the hassle of managing our own Kubernetes API server by providing a managed one, so patching and security for Kubernetes is very simple.

We started off with an eight-node test deployment that could eventually be scaled to a production deployment.
We also decided to use the official Docker images provided by the Open Distro team, to save us the trouble of managing our own container images and container registry.
The Elasticsearch cluster we planned would consist of three master nodes, two client/coordinating nodes, and three data nodes.
We chose the Kubernetes resource types for the respective Elasticsearch node types as following:

* Deployment for master nodes (stateless)
* Deployment for client nodes (stateless)
* StatefulSet for data nodes (stateful)

Our cluster’s Elasticsearch API is fronted by an AWS Network Load Balancer (NLB), deployed using the Kubernetes Service resource type.
We decided to use Kubernetes taints and the anti-affinity API spec to ensure that Elasticsearch master, client, and data nodes are spun up on separate EC2 worker nodes. In conjunction, we decided to use the Kubernetes tolerations API spec to ensure that Elasticsearch master and client nodes are spun up on dedicated EC2 worker nodes for each container.

## Creating initial resources

Start by cloning the [Open Distro for Elasticsearch community repository](https://github.com/opendistro-for-elasticsearch/community). This repository contains Kubernetes manifests for a sample deployment of Open Distro for Elasticsearch. The files are named based on the resource types they create, starting with a digit that indicates which file takes precedence upon deployment.
From the root of this repository, navigate to the `open-distro-elasticsearch-kubernetes` folder:


```
`$ cd open-distro-elasticsearch-kubernetes`
```

Once there, navigate to the `elasticsearch` subfolder using the command `cd elasticsearch`. This folder contains our sample Open Distro for Elasticsearch deployment on Kubernetes.
Next, create a Kubernetes namespace to house the Elasticsearch cluster assets, using the [10-es-namespace.yml file](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/10-es-namespace.yml):


```
`$ kubectl apply -f 10-es-namespace.yml`
```

Create a discovery service using the Kubernetes `Service` resource type in the [20-es-svc-discovery.yml file](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/20-es-svc-discovery.yml) to allow master nodes to be discoverable over broadcast port 9300:


```
`$ kubectl apply -f 20-es-svc-discovery.yml`
```

Create a Kubernetes `ServiceAccount` as a requirement for future `StatefulSets` using [file 20-es-service-account.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/20-es-service-account.yml):


```
`$ kubectl apply -f 20-es-service-account.yml`
```

Create a Kubernetes `StorageClass` resource for AWS Elastic Block Storage drives as gp2 storage (attached to data nodes) using [file 25-es-sc-gp2.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/25-es-sc-gp2.yml):


```
`$ kubectl apply -f 25-es-sc-gp2.yml`
```

Create a Kubernetes `ConfigMap` resource type (which will be used to bootstrap the relevant Elasticsearch configs such as `elasticsearch.yml` and `logging.yml` onto the containers upon deployment) using [file 30-es-configmap.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/30-es-configmap.yml):


```
`$ kubectl apply -f 30-es-configmap.yml`
```

This `ConfigMap` resource contains two configuration files required by Open Distro for Elasticsearch, `elasticsearch.yml` and `logging.yml`. These files have been supplied with settings that meet our requirements; you may need to change them depending on your own specific deployment requirements.

## API ingress using Kubernetes service and AWS Network Load Balancer

Deploy a Kubernetes `Service` resource for an ingress point to the Elasticsearch API.
Create the resource using file [35-es-service.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/35-es-service.yml):


```
`$ kubectl apply -f 35-es-service.yml`
```

This resource type uses the `annotations` key to create a corresponding internal Network Load Balancer (NLB) in AWS.
The `annotations` section below defines key/value pairs for the configuration settings in the AWS Network Load Balancer that this manifest will set up:


```
`annotations:
    # Service external-dns has to be deployed for this A record to be created in AWS Route53
    external-dns.alpha.kubernetes.io/hostname: elk.sec.example.com

    # Defined ELB backend protocol as HTTPS to allow connection to Elasticsearch API
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: https

    # Load Balancer type that will be launched in AWS, ELB or NLB.
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"

    # ARN of ACM certificate registered to the deployed ELB for handling connections over TLS
    # ACM certificate should be issued to the DNS hostname defined earlier (elk.sec.example.com)
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-east-1:111222333444:certificate/c69f6022-b24f-43d9-b9c8-dfe288d9443d"
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
    service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "true"
    service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"

    # Annotation to create internal only ELB
    service.beta.kubernetes.io/aws-load-balancer-internal: 0.0.0.0/0`
```

The `external-dns.alpha.kubernetes.io/hostname` key is used to set up the AWS Route53 DNS A Record entry for this newly-created NLB.

Other key/value pairs in this annotations spec define configuration options of the ELB being spun up. This includes the Load Balancer’s backend protocol, TLS Certificate being sourced from AWS Certificate Manager (ACM), or whether the NLB will be external or internal.
The annotations within the Kubernetes manifest are commented to clarify their respective purposes.

Open Distro for Elasticsearch requires us to open three ports on the ingress point: ports 9200 (for HTTPS/REST access), 9300 (for transport layer access), and 9600 (for accessing metrics using performance analyzer or other services). We open these ports within the same Kubernetes manifest.

## Security and TLS configuration

This section deals with bootstrapping TLS certificates using a Kubernetes Secrets object.
Create a Kubernetes Secrets resource which will be used to bootstrap the relevant TLS certificates and private keys onto the containers upon deployment using file [35-es-bootstrap-secrets.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/35-es-bootstrap-secrets.yml):


```
`$ kubectl apply -f 35-es-bootstrap-secrets.yml`
```

Required certificates include one certificate chain for the issued certificate defined in the `elk-crt.pem` portion of the `Secrets` object, one corresponding private key for the issued certificate in the `elk-key.pem` portion, and finally your root CA’s certificate to add it to the trusted CA chain in the `elk-root-ca.pem` portion.

You also need to bootstrap admin certificates for using the cluster security initialization script provided by default, and for setting up Elasticsearch user passwords. These certificates correspond to the same certificate and key types mentioned earlier for configuring TLS.
The portions of the Secrets object dealing with admin certificates are `admin-crt.pem` for the trusted certificate chain, `admin-key.pem` for the corresponding private key for this certificate, and `admin-root-ca.pem` for the root CA(s) certificate.

Our certificate data has, of course, been redacted from the `35-es-bootstrap-secrets.yml` for security reasons. Add in your own certificates and private keys issued by your own certificate authority.

Within the `ConfigMap` that we created earlier, there are two separate parts to the config options that load the relevant certs: one deals with TLS configuration for the REST layer of Elasticsearch, and the other deals with the SSL configuration on the transport layer of Elasticsearch. You can see these in the comments in the `elasticsearch.yml` portion of the `ConfigMap`. The passphrases for both the transport layer and REST layer private keys are loaded into the containers using environment variables, which we will go over in a later section.

## Node configuration and deployment

### Master nodes

Create a Kubernetes Deployment resource for deploying three Elasticsearch master nodes using file [40-es-master-deploy.yml.](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/40-es-master-deploy.yml)Some parameters in this deployment that need to be configured to suit your own deployment. Within the `spec.template.annotations` in file [40-es-master-deploy.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/40-es-master-deploy.yml), you need to supply a role name that the pod is able to assume from AWS IAM:


```
`annotations:
  iam.amazonaws.com/role: <ARN_OF_IAM_ROLE_FOR_CONTAINER>`
```

You can use the `iam.amazonaws.com/role` annotation to define the role you want the pod to assume by changing the value of the `iam.amazonaws.com/role` to the desired IAM role’s name. This is useful to allow the Elasticsearch nodes to access the AWS API securely.
The number of master nodes can be changed by changing the value of `spec.replicas` to the desired number:


```
`spec:
  replicas: 3 # Number of Elasticsearch master nodes to deploy`
```

[Elasticsearch best practices](https://qbox.io/blog/split-brain-problem-elasticsearch) recommend three master nodes to avoid data synchronization errors and split-brain scenarios.
Environment variables within the containers will be used to input the private key passphrases for the private key being used for TLS by both the transport socket and the HTTP layer in Open Distro. The following section deals with configuring both these passphrases:


```
`- name: TRANSPORT_TLS_PEM_PASS
  value: "REPLACE_WITH_TLS_PRIVATE_KEY_PASSPHRASE"
- name: HTTP_TLS_PEM_PASS
  value: "REPLACE_WITH_TLS_PRIVATE_KEY_PASSPHRASE"`
```

The `ConfigMap` and `Secrets` resources that we created earlier are loaded as volumes under the `volumes` spec:


```
`volumes:
  - name: config
    configMap:
      name: elasticsearch
  - name: certs
    secret:
      secretName: elasticsearch-tls-data`
```

These volumes are then mounted onto the containers using the `volumeMounts` spec where the config and certificate files are loaded onto the designated file paths:


```
`  volumeMounts:
    - mountPath: /usr/share/elasticsearch/config/elasticsearch.yml
      name: config
      subPath: elasticsearch.yml
    - mountPath: /usr/share/elasticsearch/config/logging.yml
      name: config
      subPath: logging.yml
    - ... (see the [source file](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/40-es-master-deploy.yml) for the full text)`
```

An initContainers script is used to increase the `vm.max_map_count` value to `262144` for the worker node by default (otherwise, virtual memory allocation by the operating system will be too low for Elasticsearch to index data without running into out-of-memory exceptions). This is explained in greater detail in [“Virtual Memory” in the Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html).
Since we are using node labels to define which worker nodes these pods will be deployed to, the following affinity spec is required, with appropriate node labels:


```
`    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: type # Replace this with corresponding worker node label's key
            operator: In
            values:
            - general # Replace this with corresponding worker node label's value`
```

These key/value pairs should be changed depending on the worker node labels being used in the EKS cluster’s setup.

We are also exposing ports 9200 (HTTPS/REST API Access), 9300 (Transport Socket), and 9600 (Metrics Access) on the resulting containers to allow for clustering. This is done using the following section of the Kubernetes Deployment manifest:


```
`    ports:
    - containerPort: 9300
      name: transport
    - containerPort: 9200
      name: http
    - containerPort: 9600
      name: metrics`
```

Once all the aforementioned configuration is completed, you can deploy the master nodes:


```
`$ kubectl apply -f 40-es-master-deploy.yml`
```

Check for the master node pods to come up:


```
`$ kubectl -n elasticsearch get pods`
```

If the master nodes are up and running correctly, the output should look like:


```
`NAME                         READY     STATUS    RESTARTS   AGE
es-master-78f97f98d9-275sl   1/1       Running   0          1d
es-master-78f97f98d9-kwqxt   1/1       Running   0          1d
es-master-78f97f98d9-lp6bn   1/1       Running   0          1d`
```

You can see whether the master nodes are successfully running by checking the log output of any of these master nodes:


```
`$ kubectl -n elasticsearch logs -f es-master-78f97f98d9-275sl`
```

If the log output contains the following message string, it means that the Elasticsearch master nodes have clustered successfully:

`[2019-04-04T06:34:16,816][INFO ][o.e.c.s.ClusterApplierService] [es-master-78f97f98d9-275sl] detected_master {es-master-78f97f98d9-kwqxt}`

### Client nodes

Create a Kubernetes `Deployment` resource for deploying two Elasticsearch client/coordinating nodes using file [50-es-client-deploy.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/50-es-client-deploy.yml). There are certain parameters in this file that need to be configured for your deployment.
Within the `spec.template.annotations` in file [50-es-client-deploy.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/50-es-client-deploy.yml), you need to supply a role name that the pod is able to assume from AWS IAM:


```
`  iam.amazonaws.com/role: <ARN_OF_IAM_ROLE_FOR_CONTAINER>`
```

The number of client nodes can be changed by changing the value of `spec.replicas` to the desired number:


```
`spec:
  replicas: 2 # Number of Elasticsearch client nodes to deploy`
```

We have chosen two coordinating/client nodes for this test cluster. This number can be increased based on the volume of incoming traffic.

Replace the values of the following environment variables with the same private key passphrases provided to the master node deployment:


```
`- name: TRANSPORT_TLS_PEM_PASS
  value: "REPLACE_WITH_TLS_PRIVATE_KEY_PASSPHRASE"
- name: HTTP_TLS_PEM_PASS
  value: "REPLACE_WITH_TLS_PRIVATE_KEY_PASSPHRASE"`
```

The same ConfigMap and Secrets resources are used by this deployment as with the master node deployment earlier. They have the same configuration and the same method of bootstrapping so we will skip that to avoid repetition in this section.

Virtual memory allocation is performed in the same way as for the master node deployment.
One key difference to note is the Weighted Anti-Affinity applied to this client node deployment, to prevent the client nodes from scheduling on the same worker nodes as the master nodes:


```
`affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 1
          podAffinityTerm:
            topologyKey: "kubernetes.io/hostname"
            labelSelector:
              matchLabels:
                component: elasticsearch
                role: client`
```

The same port configuration as the master node deployment applies here.
Once all the aforementioned configuration is completed, you can deploy the client nodes:


```
`$ kubectl apply -f 50-es-client-deploy.yml`
```

Check for the client node pods to come up:


```
`$ kubectl -n elasticsearch get pods`
```

If the client nodes are up and running, your output will look like:


```
`NAME                         READY     STATUS    RESTARTS   AGE
es-client-855f48886-75cz8    1/1       Running   0          1d
es-client-855f48886-r4vzn    1/1       Running   0          1d
es-master-78f97f98d9-275sl   1/1       Running   0          1d
es-master-78f97f98d9-kwqxt   1/1       Running   0          1d
es-master-78f97f98d9-lp6bn   1/1       Running   0          1d`
```

You can see if the client nodes are successfully running by checking the log output of any of these client nodes:


```
`$ kubectl -n elasticsearch logs -f es-client-855f48886-75cz8`
```

If the log output contains the following message string, the Elasticsearch client nodes have clustered successfully:


```
`[2019-04-04T06:35:57,180][INFO ][o.e.c.s.ClusterApplierService] [es-client-855f48886-75cz8] detected_master {es-master-78f97f98d9-kwqxt}`
```

### Data nodes

Create a Kubernetes Service resource for a Kubernetes internal ingress point to the Elasticsearch data nodes, using file [60-es-data-svc.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/60-es-data-svc.yml):


```
`$ kubectl apply -f 60-es-data-svc.yml`
```

This will create a local Service resource within the EKS cluster to allow access to the Elasticsearch data nodes.

Create a Kubernetes StatefulSet resource for deploying three Elasticsearch data nodes using file [70-es-data-sts.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/70-es-data-sts.yml). These are stateful nodes that will be storing the indexed data.

Some parameters need to be configured specifically for your own deployment.
Within the `spec.template.annotations` in file 70-es-data-sts.yml, you need to supply a role name that the pod is able to assume from AWS IAM:


```
`annotations:
  iam.amazonaws.com/role: <ARN_OF_IAM_ROLE_FOR_CONTAINER>`
```

The number of data nodes can be changed by changing the value of `spec.replicas`:


```
`spec:
  replicas: 3 # Number of Elasticsearch data nodes to deploy`
```

We have chosen three data nodes for this test cluster. This number can be increased based on your own requirements.

Replace the values of the following environment variables with the same private key passphrases provided to the master and client node deployments as shown:


```
`- name: TRANSPORT_TLS_PEM_PASS
  value: "REPLACE_WITH_TLS_PRIVATE_KEY_PASSPHRASE"
- name: HTTP_TLS_PEM_PASS
  value: "REPLACE_WITH_TLS_PRIVATE_KEY_PASSPHRASE"`
```

The same ConfigMap and Secrets resources are used by this deployment as with the master and client node deployments earlier. They use the same configuration and the same method of bootstrapping, so we won’t repeat those in this section.

Virtual memory allocation is performed in the same way as for the master node deployment.
The `serviceName: elasticsearch-data` definition is configured to use the data service we created earlier in the 60-es-data-svc.yml file.

The `volumeClaimTemplates` section in the 70-es-data-sts.yml file provisions storage volumes for these stateful nodes:


```
`  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ ReadWriteOnce ]
      storageClassName: elk-gp2
      resources:
        requests:
          storage: 2Ti`
```

This defines the provisioning of EBS storage volumes for every pod in the `StatefulSet` and attaches the storage volume to the pod as a mount point. The `storageClassName` key referenced here is the name of the `StorageClass` resource that we defined initially in file `[25-es-sc-gp2.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/25-es-sc-gp2.yml)`

We also use an extra `initContainers` section here to allow the Elasticsearch user with UID and GID 1000 read and write permissions to the provisioned EBS volume, using the `fixmount` script:


```
`- name: fixmount
    command: [ 'sh', '-c', 'chown -R 1000:1000 /usr/share/elasticsearch/data' ]
    image: busybox
    volumeMounts:
      - mountPath: /usr/share/elasticsearch/data
        name: data`
```

Once all configuration has been completed, we can deploy these Elasticsearch data nodes:


```
`$ kubectl apply -f 70-es-data-sts.yml`
```

Check for the data node pods to come up:


```
`$ kubectl -n elasticsearch get pods`
```

If the data nodes are up and running, your output will look like:


```
`NAME                         READY     STATUS    RESTARTS   AGE
es-client-855f48886-75cz8    1/1       Running   0          1d
es-client-855f48886-r4vzn    1/1       Running   0          1d
es-data-0                    1/1       Running   0          1d
es-data-1                    1/1       Running   0          1d
es-data-2                    1/1       Running   0          1d
es-master-78f97f98d9-275sl   1/1       Running   0          1d
es-master-78f97f98d9-kwqxt   1/1       Running   0          1d
es-master-78f97f98d9-lp6bn   1/1       Running   0          1d`
```

You can see whether the data nodes are successfully running by checking the log output of any of these data nodes:


```
`$ kubectl -n elasticsearch logs -f es-data-0`
```

If the log output contains the following message string, the Elasticsearch data nodes have clustered successfully and are ready to start indexing data:


```
`[2019-04-04T06:37:57,208][INFO ][o.e.c.s.ClusterApplierService] [es-data-0] detected_master {es-master-78f97f98d9-kwqxt}`
```

At this point the cluster has been successfully deployed, but you still need to initialize it with the default users and their passwords. This security initialization is covered in the following section.

## Cluster security initialization

As described in the [documentation for Open Distro for Elasticsearch,](https://opendistro.github.io/for-elasticsearch-docs/docs/install/docker-security/) after deployment is complete, a cluster has to be initialized with security before it can be made available for use.
This is done through two files that reside on the containers running Open Distro for Elasticsearch.
To start the initialization process, use the following command to gain shell access to one of master nodes:


```
`$ kubectl -n elasticsearch exec -it es-master-78f97f98d9-275sl -- bash`
```

Once you have shell access to the running Elasticsearch pod, navigate to the Open Distro tools directory with `cd /usr/share/elasticsearch/plugins/opendistro_security/tools` and execute:


```
`$ chmod +x hash.sh`
```

This will make the password hashing script executable. Now you can use this script to generate bcrypt hashed passwords for your default users. The default users can be seen in file `/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml` which by default looks like the following example for the `admin` user (I’ve omitted the rest of the file for brevity):


```
`# This is the internal user database
# The hash value is a bcrypt hash and can be generated with plugin/tools/hash.sh

# Still using default password: admin
admin:
  readonly: true
  hash: $2y$12$SFNvhLHf7MPCpRCq00o/BuU8GMdcD.7BymhT80YHNISBHsEXAMPLE
  roles:
    - admin
  attributes:
    #no dots allowed in attribute names
    attribute1: value1
    attribute2: value2
    attribute3: value3`
```

To change the passwords in the `internal_users.yml` file, start by generating hashed passwords for each user in the file using the `hash.sh` script:


```
`$ ./hash.sh -p <password you want to hash>`
```

For example, if I want to change the password of the admin user, I would do the following:


```
`[root@es-master-78f97f98d9-275sl tools]# ./hash.sh -p ThisIsAStrongPassword9876212
$2y$12$yMchvPrjvqbwweYihFiDyePfUj3CEqgps3X1ACciPjtbibEXAMPLE`
```

The output string is the bcrypt hashed password. We will now replace the hash for the admin user in the `internal_users.yml` file with this hash.
This snippet shows an updated `internal_users.yml` file:


```
`# This is the internal user database
# The hash value is a bcrypt hash and can be generated with plugin/tools/hash.sh

# Password changed for user admin
admin:
  readonly: true
  hash: $2y$12$yMchvPrjvqbwweYihFiDyePfUj3CEqgps3X1ACciPjtbibEXAMPLE
  roles:
    - admin
  attributes:
    #no dots allowed in attribute names
    attribute1: value1
    attribute2: value2
    attribute3: value3`
```

This step needs to be performed for all users within the `internal_users.yml` file. Do this for each user defined in this file and store the plaintext version of the password securely, as some of these will be required in the future.

The initialization process is performed using the `/usr/share/elasticsearch/plugins/opendistro_security/tools/securityadmin.sh` script.

The initialization command requires certain parameters, and should look like:


```
`$ /usr/share/elasticsearch/plugins/opendistro_security/tools/securityadmin.sh -cacert /usr/share/elasticsearch/config/admin-root-ca.pem -cert /usr/share/elasticsearch/config/admin-crt.pem -key /usr/share/elasticsearch/config/admin-key.pem -cd /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/ -keypass <replace-with-passphrase-for-admin-private-key> -h <replace-with-IP-of-master-nodes> -nhnv -icl`
```

This command specifies what admin client TLS certificate and private key to use to execute the script successfully. This is the second set of certificates that we loaded earlier as part of the `ConfigMap` for our cluster deployment.

The -cd flag specifies the directory in which the initialization configs are stored. The -keypass flag must be set to the passphrase chosen when the admin client private key was generated. The -h flag specifies what hostname to use, in this case the internal IP address of the pod we’re shelling into.

If it runs successfully and is able to initialize the cluster, the output will look like:


```
`Open Distro Security Admin v6
Will connect to 10.30.128.125:9300 ... done
Elasticsearch Version: 6.5.4
Open Distro Security Version: 0.7.0.1
Connected as CN=admin.example.com
Contacting elasticsearch cluster 'elasticsearch' and wait for YELLOW clusterstate ...
Clustername: logs
Clusterstate: GREEN
Number of nodes: 8
Number of data nodes: 3
.opendistro_security index already exists, so we do not need to create one.
Populate config from /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/
Will update 'security/config' with /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/config.yml
   SUCC: Configuration for 'config' created or updated
Will update 'security/roles' with /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/roles.yml
   SUCC: Configuration for 'roles' created or updated
Will update 'security/rolesmapping' with /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/roles_mapping.yml
   SUCC: Configuration for 'rolesmapping' created or updated
Will update 'security/internalusers' with /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml
   SUCC: Configuration for 'internalusers' created or updated
Will update 'security/actiongroups' with /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/action_groups.yml
   SUCC: Configuration for 'actiongroups' created or updated
Done with success`
```

The Open Distro for Elasticsearch cluster has now been successfully deployed, configured, and initialized! You can now move on to a Kibana deployment.

## Kibana Deployment

After Elasticsearch is running successfully, you will need to access it through the Kibana UI.
From the root of the community repository you cloned earlier, navigate to the `open-distro-elasticsearch-kubernetes` folder:


```
`$ cd open-distro-elasticsearch-kubernetes`
```

Once there, navigate to the `kibana` subfolder using command `cd kibana`.
Then create a Kubernetes namespace to house the Kibana assets using file [10-kb-namespace.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/kibana/10-kb-namespace.yml):


```
`$ kubectl apply -f 10-kb-namespace.yml`
```

Create a Kubernetes `ConfigMap` resource which will be used to bootstrap Kibana’s main config file `kibana.yml` onto the Kibana container upon deployment using file [20-kb-configmap.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/kibana/20-kb-configmap.yml):


```
`$ kubectl apply -f 20-kb-configmap.yml`
```

Create a Kubernetes Secrets resource for bootstrapping TLS certificates and private keys for TLS configuration on the Kibana pods using file [25-kb-bootstrap-secrets.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/kibana/25-kb-bootstrap-secrets.yml):


```
`$ kubectl apply -f 25-kb-bootstrap-secrets.yml`
```

Within the [25-kb-bootstrap-secrets.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/kibana/25-kb-bootstrap-secrets.yml) file, you will replace empty certificate data sections with each of your relevant certificates and private keys.
Replace the `elasticsearch.url` parameter with the DNS name you chose when deploying the Service for Elasticsearch in file [35-es-service.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/35-es-service.yml).
Create a Kubernetes `Deployment` resource for deploying a single Kibana node using file [30-kb-deploy.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/kibana/30-kb-deploy.yml):


```
`$ kubectl apply -f 30-kb-deploy.yml`
```

Within this deployment are several environment variables:


```
`env:
    - name: CLUSTER_NAME
      value: logs
    - name: ELASTICSEARCH_USERNAME
      value: kibanaserver
    # Replace with URL of Elasticsearch API
    - name: ELASTICSEARCH_URL
      value: <URL_OF_ELASTICSEARCH_API>
    # Replace with password chosen during cluster initialization
    - name: ELASTICSEARCH_PASSWORD
      value: <PASSWORD_CHOSEN_DURING_CLUSTER_INITIALIZATION>
    # Replace with key passphrase for key used to generate Kibana TLS cert
    - name: KEY_PASSPHRASE
      value: <PASSPHRASE_FOR_KIBANA_TLS_PRIVATE_KEY>
    # 32-character random string to be used as cookie password by security plugin
    - name: COOKIE_PASS
      value: <COOKIE_PASS_FOR_SECURITY_PLUGIN_32CHARS>`
```

Environment variables that require configuration are commented within the [30-kb-deploy.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/kibana/30-kb-deploy.yml) file.
Begin by replacing the ``<URL_OF_ELASTICSEARCH_API>`` part with the DNS name you chose during the Elasticsearch deployment. This was configured in file [35-es-service.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/elasticsearch/35-es-service.yml) under the `external-dns.alpha.kubernetes.io/hostname` annotation.
Replace the ``<PASSWORD_CHOSEN_DURING_CLUSTER_INITIALIZATION>`` with the password set for the `kibanaserver` user during cluster initialization.
Next, replace ``<PASSPHRASE_FOR_KIBANA_TLS_PRIVATE_KEY>`` with the passphrase chosen for the private key of the bootstrapped Kibana TLS certificate.
Lastly, replace ``<COOKIE_PASS_FOR_SECURITY_PLUGIN_32CHARS>`` with a 32-character random string which will be used in encrypted session cookies by the security plugin.
Create a Kubernetes `Service` resource type for an ingress point to Kibana’s Web UI, which uses annotations to create a corresponding external-facing Network Load Balancer in AWS. This allows ingress into the cluster using file [40-kb-service.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/kibana/40-kb-service.yml):


```
`$ kubectl apply -f 40-kb-service.yml`
```

This Service deployment will create an external-facing Network Load Balancer for UI access to Kibana, and will map port 443 to port 5601 on which the Kibana API runs.

It will also register the Network Load Balancer with an ACM certificate for the chosen DNS hostname, as long as it is provided with a valid ACM certificate ARN under the `service.beta.kubernetes.io/aws-load-balancer-ssl-cert` annotation.

Kibana will take a few moments to get up and running. Once Kibana is running, you should be able to access the Kibana UI using the DNS address you chose when you deployed the Kibana service using file [40-kb-service.yml](https://github.com/opendistro-for-elasticsearch/community/blob/master/open-distro-elasticsearch-kubernetes/kibana/40-kb-service.yml).

This parameter was set in the `external-dns.alpha.kubernetes.io/hostname` annotation, for example `kibana.sec.example.com`. Once Kibana is available you will see:

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/14/ODFE-Kibana-login-screen-300x276.jpg" style="width: 100%; max-width:300px">
</div>

Log in with your previously configured admin credentials to gain access to the cluster and use Elasticsearch.

## Conclusion

Congratulations! You now have a production grade deployment of Open Distro for Elasticsearch. You deployed three master nodes, two client nodes, and three data nodes. You secured your cluster with internal TLS and role-based access control. You can easily scale or rescale your cluster to fit your workload.

Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

## Acknowledgements

Thanks to:

* [Zack Doherty](https://github.com/zdoherty) (Senior SRE – Tinder Engineering) for all his help with Kubernetes internals.
* [Pires](https://github.com/pires) for his work on the Open-source Elasticsearch deployment in Kubernetes.
* The Open Distro for Elasticsearch team for their support and guidance in writing this post.
* The Ring Security Team for their support and encouragement.


