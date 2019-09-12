---
layout: posts
author: Jagadeesh Pusapadi and Jon Handler
comments: true
title: "Add Your Own SSL Certificates to Open Distro for Elasticsearch"
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/22/open_disto-elasticsearch-logo-800x400.jpg"
---
[Open Distro for Elasticsearch’s](https://github.com/opendistro-for-elasticsearch/) security plugin comes with authentication and access control out of the box. To make it easy to get started, the binary distributions contain passwords and SSL certificates that let you try out the plugin. Before adding any of your private data, you need to change the default passwords and certificates. In a prior post, we showed how you can [change your admin password in Open Distro for Elasticsearch](https://aws.amazon.com/blogs/opensource/change-passwords-open-distro-for-elasticsearch/). In this post we cover changing your SSL certificates.
To change your SSL certificates, you’ll copy the certificate files into the distribution and modify your `elasticsearch.yml` to use them. I’ll cover changing certificates for Elasticsearch’s node-to-node communication, REST APIs, and Kibana’s back-end communication to Elasticsearch. I’ll cover both the RPM and Docker distributions of Open Distro for Elasticsearch.

## Collect Files

Before you can change the certificates, you’ll need to generate (or have) the following `.pem` files for the certificate and key:

* Elasticsearch admin
* Elasticsearch node
* Kibana node
* Certificate authority

If you want to support SSL connections to Kibana, you need to add a certificate to Kibana as well. You can use the Elasticsearch node certificate and key files for Kibana, or use separate certificates.

There are many ways that you can create the CA and certificates. You might have a certificate authority (CA) that can issue certificates in your organization. If so, use that. If you don’t have access to your own CA, you can use the demo files that ship with Open Distro for Elasticsearch. Or you can use OpenSSL, create a CA, and then create and sign certificates with your CA. In this post, I describe copying the demo files and also creating a CA and certificates with OpenSSL.

First, make a directory to hold the various assets you’re building:

`$ `mkdir` setup`-`ssl`

### Using the demo** **`.pem`** **Files

Download and install the Open Distro for Elasticsearch RPM, or run Open Distro for Elasticsearch in Docker (see [Get Up and Running with Open Distro for Elasticsearch](https://aws.amazon.com/blogs/opensource/running-open-distro-for-elasticsearch/) for instructions on how to run Docker locally). The demo `.pem` files are located in different directories, depending on the distribution you’re running:

* Docker: `/usr/share/elasticsearch/config`
* RPM: `/etc/elasticsearch`

Copy `kirk.pem`, `kirk-key.pem`, `esnode.pem`, `esnode-key.pem`, and `root-ca.pem` to the `setup-ssl` directory.
If you’re running Docker, use:

` $ docker `exec` `<`container `id``>` `cat` `/`usr`/`share`/`elasticsearch`/`config`/`filename`.`pem `>` filename2`.`pem`

to cat the files to your machine. Replace ``<container ID>`` with the ID from one of your Elasticsearch containers. Replace ``filename.pem`` and ``filename2.pem`` with the above files.

If you’re running the RPM, you can simply `cp` the files to the `setup-ssl` directory.

### Creating a New Certificate Authority (CA), Node, and Admin Certificates

If you want to create a CA and new certificates instead, you use OpenSSL to create a local, self-signed Certificate Authority (CA). You also create server and admin certificates. Then, use your CA to sign the certificates.
To install OpenSSL, run the below commands. You can find the latest version on the [OpenSSL website](https://www.openssl.org/source/):

` $ `sudo` yum `-`y `install` openssl `

First, create a private key for the CA:

```bash
`$ openssl genrsa -out MyRootCA.key 2048
Generating RSA private key, 2048 bit long modulus................+++...............................+++
e is 65537 (0x10001)`
```

Create the CA and enter the Organization details:

```bash
`$ openssl req -x509 -new -key MyRootCA.key -sha256 -out MyRootCA.pem
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.----
Country Name (2 letter code) [AU]:GB
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:London
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Example Corp
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:Example Corp CA Root
Email Address []:`
```

For the server and admin certificates, create keys, a certificate signing request (CSR) and
a certificate signed by the CA. In the below example, I walk through the commands
for one server — “odfe-node1”. You need to repeat this process for odfe-node2,
the admin certificate, and the kibana certificate:

` $ openssl genrsa `-`out odfe`-`node1`-`pkcs12`.`key `2048` `

IMPORTANT: Convert these to PKCS#5 v1.5 to work correctly with the JDK. Output from
this command will be used in all the config files.

` $ openssl pkcs8 `-`v1 `"PBE-SHA1-3DES"` `-``in` `"odfe-node1-pkcs12.key"` `-`topk8 `-`out `"odfe-node1.key"` `-`nocrypt`

Create the CSR and enter the organization and server details:

```bash
`$ openssl req -new -key odfe-node1.key -out odfe-node1.csr
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value, If you enter '.', the field will
be left blank.----
Country Name (2 letter code) [AU]:GB
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:London
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Example Corp
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:odfe-node1.example.com
Email Address []:
Please enter the following 'extra' attributes to be sent with your certificate request
A challenge password []:
An optional company name []:`
```

Use the CSR to generate the signed Certificate:

```bash
`$ openssl x509 -req -in odfe-node1.csr -CA MyRootCA.pem -CAkey MyRootCA.key -CAcreateserial -out odfe-node1.pem -sha256
Signature ok
subject=/C=GB/ST=Some-State/L=London/O=Example Corp/CN=odfe-node1.example.com
Getting CA Private Key`
```

## Edit elasticsearch.yml to Add Your Certificates

Now you need to use the certificates you created or copied to `setup-ssl`. Whether you are running the .rpm distribution of Open Distro for Elasticsearch or the Docker distribution, you’ll edit `elasticsearch.yml` to add the certificate information. This will enable Open Distro for Elasticsearch’s security plugin to accept SSL requests, as well as enable node-to-node SSL communication. Create a copy of `elasticsearch.yml` in your `setup-ssl` directory. You can find `elasticsearch.yml` in the same directory as the `.pems`.

Open your local copy of `elasticsearch.yml` with your favorite editor. You’ll see a block of settings that begins with:

```java
`######## Start OpenDistro for Elasticsearch Security Demo Configuration ######### WARNING: revise all the lines below before you go into productionopendistro_security.ssl.transport.pemcert_filepath: esnode.pemopendistro_security.ssl.transport.pemkey_filepath: esnode-key.pemopendistro_security.ssl.transport.pemtrustedcas_filepath: root-ca.pem...`
```

The opendistro_security.ssl.transport.* settings enable SSL transport between nodes. The opendistro_security.ssl.http.* enable SSL for REST requests to the cluster. You need to replace the values for these variables with your own certificate files.
Make sure to remove the entry:
`opendistro_security.allow_unsafe_democertificates`:` `true``
to use your certificates instead of the demo certificates.
The Security plugin needs to identify inter-cluster requests (i.e. requests between the nodes). The simplest way of configuring node certificates is to list the Distinguished Names (DNs) of these certificates in elasticsearch.yml. All DNs must be included in elasticsearch.yml on all nodes. The Security plugin supports wildcards and regular expressions:

```java
`opendistro_security.nodes_dn:- 'CN=node2.example.com,OU=SSL,O=Example Corp,L=London,C=GB'- 'CN=*.example.com,OU=SSL,O=Example Corp,L=London,C=GB'- 'CN=odfe-cluster*'- '/CN=.*regex/'`
```

If you are running the .rpm distribution, copy your certificates and elasticsearch.yml to the `/etc/elasticsearch/config` directory. Change the file names to match the names of your certificate files.

For container deployments, override the files in the container with the your local files by modifying docker-compose.yml. Open this file in your editor and locate the volumes section for both the odfe-node1 and odfe-node2 services. Add additional lines to these sections that map your local files onto the container’s file system. When you’re done, it should look like this:

```java
`version: '3'services:odfe-node1:image: amazon/opendistro-for-elasticsearch:0.7.0
    container_name: odfe-node1
    environment:- cluster.name=odfe-cluster
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping- "ES_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAMulimits:memlock:soft: -1hard: -1volumes:- odfe-data1:/usr/share/elasticsearch/data
      - ./MyRootCA.pem:/usr/share/elasticsearch/config/MyRootCA.pem
      - ./odfe-node1.pem:/usr/share/elasticsearch/config/odfe-node1.pem
      - ./odfe-node1.key:/usr/share/elasticsearch/config/odfe-node1.key
      - ./node1-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
    ports:- 9200:9200- 9600:9600 # required for Performance Analyzernetworks:- odfe-net
  odfe-node2:image: amazon/opendistro-for-elasticsearch:0.7.0
    container_name: odfe-node2
    environment:- cluster.name=odfe-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"- discovery.zen.ping.unicast.hosts=odfe-node1
    ulimits:memlock:soft: -1hard: -1volumes:- odfe-data2:/usr/share/elasticsearch/data
      - ./MyRootCA.pem:/usr/share/elasticsearch/config/MyRootCA.pem
      - ./odfe-node2.pem:/usr/share/elasticsearch/config/odfe-node2.pem
      - ./odfe-node2.key:/usr/share/elasticsearch/config/odfe-node2.key
      - ./node2-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
    networks:- odfe-net.....`
```

## Encrypting Access to Kibana

You enable TLS/SSL encryption between the browser and Kibana server by setting the below `server.ssl` options in `kibana.yml`. The location depends on the distribution you’re running:

* Docker: `/usr/share/kibana/config`
* RPM: `/etc/kibana`

```
`server.ssl.enabled: trueserver.ssl.key: <full path to your key file>server.ssl.certificate: <full path to your certificate>`
```

If you are running the .rpm distribution, copy your certificates to the `/etc/kibana/` directory and update ssl settings in `kibana.yml`.
For container deployments, update the Kibana section in docker-compose.yml file by adding file mappings in `volumes` section and SERVER_SSL options in the `environment` section and save the file.

```java
`.....
  kibana:image: amazon/opendistro-for-elasticsearch-kibana:0.7.0
    container_name: odfe-kibana
    ports:- 5601:5601expose:- "5601"environment:ELASTICSEARCH_URL: https://odfe-node1:9200SERVER_SSL_ENABLED: "true"SERVER_SSL_KEY: /usr/share/kibana/config/odfe-node2.key
      SERVER_SSL_CERTIFICATE: /usr/share/kibana/config/odfe-node2.pem
    volumes:- ./MyRootCA.pem:/usr/share/kibana/config/MyRootCA.pem
      - ./odfe-node2.pem:/usr/share/kibana/config/odfe-node2.pem
      - ./odfe-node2.key:/usr/share/kibana/config/odfe-node2.key
    networks:- odfe-net
 .....`
```

## Restart Your World

Now you need to restart Elasticsearch. In order to remove the demo certificates from the security plugin’s Elasticsearch index, you need to remove the existing volumes. From the directory that contains your docker-compose.yml, issue the following commands:
NOTE! the following commands will erase all data that you have in Elasticsearch!

```bash
`
docker-compose down -v
docker-compose up`
```

You should be able to browse to `https://<localhost or FQDN of kibana>:5601/`. You might need to sign out of Kibana’s UI to remove any browser-cached certificates before you can log in.

To suppress security warnings in the browser, you can use its settings panel to add the self-signed MyRootCA certificate to your Trusted Certificate Authorities.

## Conclusion

You have now made your Open Distro for Elasticsearch cluster even more secure by adding your own SSL certificates. Your certificates cover (optionally) communication from your browser to Kibana, communication to your Elasticsearch endpoint, and intra-cluster communication between nodes.
Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

