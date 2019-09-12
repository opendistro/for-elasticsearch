---
layout: posts
author: Jon Handler
comments: true
title: "Build and Run the Open Distro For Elasticsearch SQL Plugin with Elasticsearch OSS"
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/22/open_disto-elasticsearch-logo-800x400.jpg"
---
[Open Distro for Elasticsearch](https://github.com/opendistro-for-elasticsearch/) comprises four plugins:

* [Security](https://github.com/opendistro-for-elasticsearch/security) — supports node-to-node encryption, five types of authentication, role-based access controls, audit logging, and cross-cluster search.
* [Alerting](https://github.com/opendistro-for-elasticsearch/alerting) — notifies you when data from one or more Elasticsearch indices meets certain conditions.
* [Performance](https://github.com/opendistro-for-elasticsearch/performance-analyzer) — This is a REST API that allows you to query a long list of performance metrics for your cluster.
* [SQL Support](https://github.com/opendistro-for-elasticsearch/sql) — This feature allows you to query your cluster using SQL statements.

The RPM and Docker container releases are binary. If you want to develop against our code base or install our plugins against your own Elasticsearch binary, you need to download the source and build from there. We will explain how to do that over several posts. In this one, we start with the SQL plugin. Other plugins have different codebases and compilation methods. Stay tuned!

## Download and Install Elasticsearch

To test out installing and running [Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/)’s SQL plugin with Elasticsearch OSS, I first spun up an EC2 instance, running the Amazon Linux 2 AMI (ID: ami-095cd038eef3e5074). To install Elasticsearch and build the plugin, you need to install the development version of JDK 11. I chose [_Amazon Corretto_](https://aws.amazon.com/corretto/). You can find the latest versions on the [Downloads for Amazon Corretto 11 page](https://docs.aws.amazon.com/corretto/latest/corretto-11-ug/downloads-list.html). I also made sure to point JAVA_HOME at the installation:


```bash
sudo yum update
wget https://d2jnoze5tfhthg.cloudfront.net/java-11-amazon-corretto-devel-11.0.2.9-2.x86_64.rpm
sudo yum -y install java-11-amazon-corretto-devel-11.0.2.9-2.x86_64.rpm
echo "export JAVA_HOME=/usr/lib/jvm/java-11-amazon-corretto/" | sudo tee --append /etc/profile.d/javahome.sh
source /etc/profile.d/javahome.sh`
```

## Build and Install the Plugin

To download the SQL plugin, you need Git:

```bash
`sudo yum install git`
```

Once you have Git, download and build the source code from GitHub:


```bash
git clone https://github.com/opendistro-for-elasticsearch/sql.git
cd sql./gradlew build`
```

Now you can install the plugin in Elasticsearch and start Elasticsearch. (Note: If you have already started Elasticsearch, use ‘sudo systemctl restart elasticsearch.service’ after you run elasticsearch-plugin.)


```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install _file:///home/ec2-user/sql/build/distributions/opendistro_sql-0.7.0.0.zip_
sudo systemctl start elasticsearch.service`
```

To test that all is well:


```bash
curl 'localhost:9200/_cat/plugins?v&s=component&h=name,component,version,description'`
```

You should see something like:


```bash
name    component      version description
2_EXXx_ opendistro_sql 0.7.0.0 Open Distro for Elasticsearch SQL`
```

## Test the Plugin

In order to test the plugin, we need to load some data. I’ve picked a few movies. You can copy the below and paste into your command line:


```bash
curl -XPOST localhost:9200/movies/movie/_bulk -H "Content-type: application/json" -d '{"index" : { } }
{"title": "Star Trek Into Darkness", "directors": ["J.J. Abrams"], "genres": ["Action", "Adventure", "Sci-Fi"], "actors": ["Chris Pine", "Zachary Quinto", "Zoe Saldana"], "id": "tt1408101"}
{"index" : { } }
{"title": "Star Wars", "directors": ["George Lucas"], "genres": ["Action", "Adventure", "Fantasy", "Sci-Fi"], "actors": ["Mark Hamill", "Harrison Ford", "Carrie Fisher"], "id": "tt0076759"}
{"index" : { } }
{"title": "Rush", "directors": ["Ron Howard"], "genres": ["Action", "Biography", "Drama", "Sport"], "actors": ["Daniel Br\u00fchl", "Chris Hemsworth", "Olivia Wilde"], "id": "tt1979320"}
{"index" : { } }
{"title": "Gravity", "directors": ["Alfonso Cuar\u00f3n"], "genres": ["Drama", "Sci-Fi", "Thriller"], "actors": ["Sandra Bullock", "George Clooney", "Ed Harris"], "id": "tt1454468"}
{"index" : { } }
{"title": "The Avengers", "directors": ["Joss Whedon"], "genres": ["Action", "Fantasy"], "actors": ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"], "id": "tt0848228"}
{"index" : { } }
{"title": "The Dark Knight Rises", "directors": ["Christopher Nolan"], "genres": ["Action", "Crime", "Thriller"], "actors": ["Christian Bale", "Tom Hardy", "Anne Hathaway"], "id": "tt1345836"}
{"index" : { } }
{"directors": ["Quentin Tarantino"], "genres": ["Adventure", "Drama", "Western"], "title": "Django Unchained", "actors": ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"], "id": "tt1853728"}
'
```

You can send SQL commands to Elasticsearch using the simple (URL-based) query API to the _opendistro/_sql endpoint:


```bash
`$ curl -H "Content-type: application/json" -XGET localhost:9200/_opendistro/_sql?sql=SELECT%20title%20FROM%20movies
{"took":9,"timed_out":false,"_shards":{"total":5,"successful":5,"skipped":0,"failed":0},"hits":{"total":7,"max_score":1.0,"hits":[{"_index":"movies","_type":"movie","_id":"wDgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Django Unchained"}},{"_index":"movies","_type":"movie","_id":"ujgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Star Trek Into Darkness"}},{"_index":"movies","_type":"movie","_id":"vDgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Rush"}},{"_index":"movies","_type":"movie","_id":"vjgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"The Avengers"}},{"_index":"movies","_type":"movie","_id":"vTgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Gravity"}},{"_index":"movies","_type":"movie","_id":"vzgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"The Dark Knight Rises"}},{"_index":"movies","_type":"movie","_id":"uzgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Star Wars"}}]}}`
```

Note that, since I’m using curl, I had to URL-encode the sql statement. Depending on your method for connecting, you might also have to URL-encode. The more reliable method is to POST the SQL request in the body:


```bash
`$ curl -H "Content-type: application/json" -XPOST localhost:9200/_opendistro/_sql -d'{
    "query" : "SELECT title FROM movies" 
}'
{"took":3,"timed_out":false,"_shards":{"total":5,"successful":5,"skipped":0,"failed":0},"hits":{"total":7,"max_score":1.0,"hits":[{"_index":"movies","_type":"movie","_id":"wDgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Django Unchained"}},{"_index":"movies","_type":"movie","_id":"ujgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Star Trek Into Darkness"}},{"_index":"movies","_type":"movie","_id":"vDgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Rush"}},{"_index":"movies","_type":"movie","_id":"vjgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"The Avengers"}},{"_index":"movies","_type":"movie","_id":"vTgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Gravity"}},{"_index":"movies","_type":"movie","_id":"vzgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"The Dark Knight Rises"}},{"_index":"movies","_type":"movie","_id":"uzgvb2kBQ4VucTC3NDK9","_score":1.0,"_source":{"title":"Star Wars"}}]}}`
```

Be sure to take down your instance when you’re done testing, to avoid additional charges.

## Conclusion

Congratulations! You have installed Elasticsearch OSS 6.5.4, downloaded and built the Open Distro for Elasticsearch SQL plugin, loaded some data, and run queries in SQL. In future posts, we’ll explore building the other plugins and modifying them. If you’ve got additions, bug fixes, or other great ideas, we welcome all [pull requests and commentary](https://github.com/opendistro-for-elasticsearch/sql).
Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

