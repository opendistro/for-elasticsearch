---
layout: posts
author: Jon Handler
comments: true
title: "Change your Admin Passwords in Open Distro for Elasticsearch"
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/21/image4.png"
---
[Open Distro for Elasticsearch](https://github.com/opendistro-for-elasticsearch/) ships with an advanced security plugin. The plugin comes pre-configured with a number of different users and default passwords for them – of course, you will want to change those defaults!
Passwords for some of the preconfigured users—kibanaro, logstash, readall, and snapshotrestore—are available to change in the Security UI in Kibana. The admin and kibanaserver users are set to read-only, and must be changed in the configuration files.

If you are using the RPM distribution for Open Distro for Elasticsearch, you can [change the files directly](https://github.com/opendistro/for-elasticsearch-docs/issues/5). If you’re using Docker, it will take a bit more work, which I’ll explain in detail. Briefly, to choose and deploy a new admin password, you will create a hash of that password, place it in a local file, and then map that local file onto your container’s file system. To change the kibanaserver password, you’ll additionally need to override environment variables in your docker-compose.yml file.

## Create Hashes for Your** ***admin*** **and** ***kibanaserver*** **Users

When you configure the passwords for the security plugin, you don’t use plain text. Instead, the plugin supplies a script that will hash the plain text. You then use the hashed version of the password in the various configuration files.

To access the tool, deploy and run Open Distro for Elasticsearch. Follow the steps in our post on [getting up and running with Docker Desktop](https://aws.amazon.com/blogs/opensource/running-open-distro-for-elasticsearch/). Once your containers are running, locate one of the Elasticsearch containers with `docker ps`. On my system, the output from docker ps was (edited to fit):

`CONTAINER ID IMAGE STATUS NAMES`
`fb1a78290e33 amazon/opendistro-for-elasticsearch-kibana:0.7.0 Up… odfe-kibana`
`a53942e76501 amazon/opendistro-for-elasticsearch:0.7.0 Up… odfe-node1`
`f33f91837f47 amazon/opendistro-for-elasticsearch:0.7.0 Up… odfe-node2`

In my setup, containers a53942e76501 and f33f91837f47 are running Elasticsearch. Use `docker exec` to generate your admin password. Run the following command, using one of the Elasticsearch containers:

`$ docker exec -it a53942e76501 /bin/bash -c /usr/share/elasticsearch/plugins/opendistro_security/tools/hash.sh
[Password:]` ``<type your new password here>`
$2y$12$7CVWE8PXPmM7N13ANPbl5eCR7qZeKDVWe3ROesgjfLQYHTWYAy3A6`
Make sure to replace <type your new password here> with the actual password you want to use. Save the response; this is your hashed password. Repeat this for your new kibanaserver password. (We recommend using two different passwords.) It’s important to set a strong password – at least eight characters, with capital and lower-case letters, numbers, and special symbols. (Elasticsearch can validate your password’s strength for you – we’ll tackle that in a future post.)

## Create a Local, Modified Copy of** **internal_users.yml

Authentication information for the security plugin’s users is stored in the file internal_users.yml. You’ll be replacing that file with a local copy that contains your new passwords. Use `docker exec` again, to cat the contents of the file to your local disk:

`docker exec -it` ``<container id>`` `/bin/bash -c cat /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml > internal_users.yml`

Make sure to replace ``<`container ID`>`` in the above command with one of the Elasticsearch container ids you got from `docker `ps``command above.

Now open your local copy of internal_users.yml in your favorite editor, and change the password string for the admin and kibanaserver users with the hashes you created in the previous step.

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/21/Image1.jpg" style="width: 100%; max-width: 600px;">
</div>

Save the file.

## Modify Your Docker-compose.yml File

Now you need to wire the new internal_users.yml into your Docker environment, by modifying docker-compose.yml. Open this file in your editor and locate the volumes section for both the odfe-node1 and odfe-node2 services. Add a line to these sections that maps your local file onto the container’s file system. When you’re done, it should look like this:

`volumes:
`- odfe-data1:/usr/share/elasticsearch/data`
`- <path to your>/internal_users.yml: /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml``

Make sure to change both the odfe-data1 and the odfe-data2 descriptions and replace “$lt;path to your/internal_users.yml$gt;” with the actual path.

You also need to override the kibanaserver password for your kibana container. Find the environment section of the kibana container’s description at the bottom of docker-compose.yml. Change it to add an ELASTICSEARCH_USERNAME and ELASTICSEARCH_PASSWORD. Note that it’s important to use ALL CAPS and an underscore instead of a period. When you’re done, the environment section should look like this:

`environment:
`ELASTICSEARCH_URL: https://odfe-node1:9200`
`ELASTICSEARCH_USERNAME: kibanaserver`
`ELASTICSEARCH_PASSWORD: goodkibanapassword``
Be sure to use the plain text version of your password in your docker-compose.yml. Save the file.

## Restart Your World

For your password changes to take effect, you need to restart your containers. However, since you’ve already run Elasticsearch, the initial passwords will be stored in the security plugin’s index, so you’ll need to completely reset Elasticsearch. The simplest way to do that is to delete the saved volumes with `docker-compose down -v`. (IMPORTANT: if you have loaded any data into Elasticsearch, this command will erase it.) From the directory that contains your docker-compose.yml, issue the following commands:

`docker-compose down -v
docker-compose up`

Your browser might also contain a cached copy of your former password. When I first ran these commands, Kibana did not load completely for me, displaying a blank page and missing several of the tabs. To fix this, use the Admin link at the bottom of Kibana’s tabs rail to log out from Kibana and log back in with your new credentials.

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/21/image2-300x130.png" style="width: 100%; max-width: 600px;">
</div>

To ensure that your password change is successful, you can run the following commands:
`curl -XGET https://localhost:9200 -u admin:`goodadminpassword`` `--insecure
curl -XGET https://localhost:9200 -u kibanaserver:`goodkibanapassword`` `--insecure`

Be sure to replace goodadminpassword and goodkibanapassword with the plain text for your new passwords. You should receive a normal response from Elasticsearch:

`{
`"name" : "QaU19eV",`
`"cluster_name" : "odfe-cluster",`
`"cluster_uuid" : "ywafp5iBR96V-H-5KDPlbg",`
`"version" : {`
`"number" : "6.5.4",`
`"build_flavor" : "oss",`
`"build_type" : "tar",`
`"build_hash" : "d2ef93d",`
`"build_date" : "2018-12-17T21:17:40.758843Z",`
`"build_snapshot" : false,`
`"lucene_version" : "7.5.0",`
`"minimum_wire_compatibility_version" : "5.6.0",`
`"minimum_index_compatibility_version" : "5.0.0"`
`},`
`"tagline" : "You Know, for Search"`
}`

## Change Passwords for All Other Accounts

You have now changed the passwords for the admin and kibanaserver users. There are four more users preconfigured in Open Distro for Elasticsearch’s security plugin: kibanaro, logstash, readall, and snapshotrestore. You can use the Security plugin’s UI to change these passwords.

Log in to your cluster by navigating to [https://localhost:5601](https://localhost:5601/). If you have logged out, you will be prompted again to log in. Use the admin user and the new password you set in the prior steps.

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/21/image3-150x150.png" style="width: 100%; max-width: 400px;">
</div>

Click the Security tab, then the Internal User Database icon.

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/21/image4-300x198.png" style="width: 100%; max-width: 400px;">
</div>

Then click to edit the kibanaro user.

<div style="text-align: center;">
<img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/21/image5-300x116.png" style="width: 100%; max-width: 400px;">
</div>

Enter a new Password and re-enter it in the Repeat password text box. You can also review and make edits to the Backend roles and Attributes for this user. When you’re done, click Submit.

Repeat this process for the logstash, readall, and snapshotrestore users.

## Conclusion

You have made your Open Distro for Elasticsearch cluster even more secure by creating your own passwords for the pre-provided users. In future blog posts, we will dig deeper into the security plugin to share with you how to replace the demo certificates, how to set up users, and how to connect with federated identity providers.

Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

