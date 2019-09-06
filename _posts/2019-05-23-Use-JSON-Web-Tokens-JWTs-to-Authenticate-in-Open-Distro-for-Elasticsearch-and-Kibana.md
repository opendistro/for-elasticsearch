---
layout: posts
author: Neeraj Prashar and Jon Handler
comments: true
title: Use JSON Web Tokens (JWTs) to Authenticate in Open Distro for Elasticsearch and Kibana
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/22/open_disto-elasticsearch-logo-800x400.jpg"
---

Token-based authentication systems are popular in the world of web services. They provide many benefits, including (but not limited to) security, scalability, statelessness, and extensibility. With Amazon’s [Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/), users now have an opportunity to take advantage of the numerous security features included in the Security plugin. One such feature is the ability to authenticate users with JSON Web Tokens (JWT) for a single sign-on experience. In this post, I walk through how to generate valid JWTs, configure the Security plugin to support JWTs, and finally authenticate requests to both Elasticsearch and Kibana using claims presented in the tokens.

## Prerequisites

To work through this example, clone or download our [Community repository.](https://github.com/opendistro-for-elasticsearch/community) The `jwt-tokens` directory contains the sample code and configuration for you to follow along with this post. There are two config files – `kibana.yml`, and `config.yml` – a `docker-compose.yml`, and a `token-gen` directory with java code and a `.pom` to build it.

## Generating JWTs

A JWT is composed of three Base64-encoded parts: a header, a payload, and a signature, concatenated with a period (`.`). Ideally, JWTs are provided by an authentication server after validating credentials provided by the user. The user sends this token as a part of every request, and the web service allows or denies the request based on the claims presented in the token. For the purposes of this post, you will generate one such token using a shared secret (provided by the HS256 algorithm).
Let’s start by analyzing some sample Java code that generates JWTs valid for 16 minutes. This code uses the [jjwt library](https://github.com/jwtk/jjwt) to generate the tokens and signing keys:

```java

1 import io.jsonwebtoken.Jwts;
2 import io.jsonwebtoken.SignatureAlgorithm;
3 import io.jsonwebtoken.security.Keys;
4 import java.security.Key;
5 import java.util.Date;
6 import java.util.HashMap;
7 import io.jsonwebtoken.io.Encoders;
8
9 public class JWTTest {
10     public static void main(String[] args) {
11         Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
12         Date exp = new Date(System.currentTimeMillis() + 1000000);
13         HashMap<String,Object> hm = new HashMap<>();
14         hm.put("roles","admin");
15         String jws = Jwts.builder()
16                 .setClaims(hm)
17                 .setIssuer("https://localhost")
18                 .setSubject("admin")
19                 .setExpiration(exp)
20                 .signWith(key).compact();
21         System.out.println("Token:");
22         System.out.println(jws);
23         if(Jwts.parser().setSigningKey(key).parseClaimsJws(jws).getBody().getSubject().equals("test")) {
24             System.out.println("test");
25         }
26         String encoded = Encoders.BASE.encode(key.getEncoded());
64
27         System.out.println("Shared secret:");
28         System.out.println(encoded);
29     }
30 }
```

* Line 11 gives us a random signing key based on the HMAC_SHA256 algorithm. This is the signing_key that the Security plugin uses when verifying the JWT Tokens. Since we are using a symmetric key algorithm, this signing key is the Base64-encoded shared secret (Line 28). If we were using an asymmetric algorithm such as RSA or ECDSA, the signing key will be the public key. Line 19 sets the claims. The Security plugin automatically identifies the algorithm.
* Line 13-14 creates a claim that maps the key `roles` to the value `admin`.
* Line 12 generates a `Date` 16 minutes from the current time. Line 19 uses this date in the `Jwts.Builder.`
* Line 20 signs the JWT token using the `signing_key` created on Line 11.

You need [Apache Maven](https://maven.apache.org/install.html) to compile and run the sample code. I used [Homebrew](https://docs.brew.sh/Installation) to install Maven 3.6.1 with the command
`$ brew install maven`.
From the token-gen directory, build and run the code:
`$ cd token-gen`
`$ mvn clean install`
`$ java -jar target/jwt-test-tokens-1.0-SNAPSHOT-jar-with-dependencies.jar`
`Token:`
`eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6ImFkbWluIiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTU1NDUyMjQzMH0.fnkQdBKqgOD-Tdf5Pv09NCiz0WlL-KFPU39CEXAMPLE`
`Shared Secret:`
`usuxqaUmbbe0VqN+Q90KCk5sXHCfEVookMRyEXAMPLE=`
Make sure to copy the token and shared secret, you’ll need them in a minute. You can also find these commands in the `README` in the `token-gen` directory.

## Configuring the security plugin to use JWTs

Open Distro for Elasticsearch’s Security Plugin contains a configuration file that specifies authentication type, challenge, and various other configuration keys that must be present in the payload of the JWT for the request to be authenticated. You can also specify an authentication backend if you want further authentication of the request. When you start up the container, you will override the default configuration with the file named `config.yml` in the `jwt-tokens` directory.
Open `jwt-tokens/config.yml` in your favorite editor and change it to read as below:

```c
...   
1   jwt_auth_domain:
2     enabled: true
3     http_enabled: true 
4     transport_enabled: true
5     order: 0
6     http_authenticator:
7       type: jwt
8       challenge: false
9       config:
10        signing_key: "usuxqaUmbbe0VqN+Q90KCk5sXHCfEVookMRyEXAMPLE="
11        jwt_header: "Authorization"
12        jwt_url_parameters: null
13        roles_key: "roles"
14        subject_key: "sub"
15    authentication_backend:
16      type: noop
...
```

* Line 2 enables this domain to use JWT for authentication.
* Line 7 chooses JWT as the authentication type.
* Line 8 sets the key challenge to “false.” A challenge is not required here, since the JWT token contains everything we need to validate. Line 15 is set to `noop` for the same reason.
* Line 10 sets the signing_key to the Base64-encoded shared secret that we generated in the Java code above. Note: be sure to replace the secret key with the secret key that you generated in the prior section.
* Line 11 is the HTTP header in which the token is transmitted. You will be using the authorization header with the bearer scheme. The “Authorization” header is used by default, but you could also pass the JWT using a URL parameter.
* Line 13 specifies the key that stores user roles as a comma-separated list. In our case, we are only specifying admin.
* Line 14 specifies the key that stores the username. If this key is missing, we just get the registered subject claim. In our code above, we are just setting the subject claim.

If you are new to the world of Docker and Open Distro for Elasticsearch, I highly recommend getting started with the [Open Distro for Elasticsearch documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/install/docker/#sample-docker-compose-file). Throughout this tutorial, I use a cluster with one Elasticsearch node and one Kibana node.

## Kibana Changes

To simulate how Kibana would work if we used a standard token provider, you just need to add one additional line in kibana.yml. Edit `jwt-tokens/kibana.yml` and add:

```c
`opendistro_security.auth.type: "jwt"`
```

## Run Elasticsearch, and Kibana

You will need a running Docker environment to follow along. I use Docker Desktop for Mac. You can find instructions on setting it up and running it in the post on how to [download and configure Docker Desktop](https://aws.amazon.com/blogs/opensource/running-open-distro-for-elasticsearch/) (use the `docker-compose.yml` from the `jwt-tokens` directory instead of the one in that post). From the `jwt-tokens` directory, run the following command:
`$ docker-compose up`
After the images download and the cluster starts, run `docker ps` in a new terminal. You should see something similar to the output below: two containers, with one running the Elasticsearch image and the other running the Kibana image.

```c
`$ docker ps` `CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES` `63c3e9df19ac amazon/opendistro-for-elasticsearch-kibana:0.9.0 "/usr/local/bin/kiba…" 8 seconds ago Up 7 seconds 0.0.0.0:5601→5601/tcp odfe-kibana` `0aa5316ffbc7 amazon/opendistro-for-elasticsearch:0.9.0 "/usr/local/bin/dock…" 8 seconds ago Up 7 seconds 0.0.0.0:9200→9200/tcp, 0.0.0.0:9600→9600/tcp, 9300/tcp odfe-node1`
```

## Reinitializing the security index [Optional]

If you ran `docker-compose` only after you edited `config.yml`, you can skip this section. If you ran `docker-compose` at any time before you edited `config.yml`, you will need to reinitialize the security index and ensure that requests are being authenticated.
First, find your Elasticsearch container with `docker ps:`

```c
`$ docker ps``CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES``533f03ee0fdc amazon/opendistro-for-elasticsearch:0.9.0 "/usr/local/bin/dock…" 2 days ago Up 20 seconds 0.0.0.0:9200→9200/tcp, 0.0.0.0:9600→9600/tcp, 9300/tcp odfe-node1``3a2c4a582165 amazon/opendistro-for-elasticsearch-kibana:0.9.0 "/usr/local/bin/kiba…" 2 days ago Up 20 seconds 0.0.0.0:5601→5601/tcp odfe-kiban`
```

Copy the `CONTAINER ID` for the `amazon/opendistro-for-elasticsearch` container. In my case, the container ID is `533f03ee0fdc`You can get Bash access to that container by running:

```
`$ docker exec -it 533f03ee0fdc /bin/bash`
```

Make sure to use your container ID in the above command. Reinitialize the security index and exit:

```c
$ plugins/opendistro_security/tools/securityadmin.sh -f plugins/opendistro_security/securityconfig/config.yml -icl -nhnv -cert config/kirk.pem -cacert config/root-ca.pem -key config/kirk-key.pem -t config
Open Distro Security Admin v6
Will connect to localhost:9300 ... done
Elasticsearch Version: 6.5.4
Open Distro Security Version: 0.9.0.0
Connected as CN=kirk,OU=client,O=client,L=test,C=de
Contacting elasticsearch cluster 'elasticsearch' and wait for YELLOW clusterstate ...
Clustername: odfe-cluster
Clusterstate: YELLOW
Number of nodes: 1
Number of data nodes: 1
.opendistro_security index already exists, so we do not need to create one.
Populate config from /usr/share/elasticsearch
Will update 'security/config' with plugins/opendistro_security/securityconfig/config.yml
SUCC: Configuration for 'config' created or updated
Done with success
$ exit
```

## Test your changes

Now you can test out some basic commands by adding the authorization header. Be sure to replace the token in the below commands with the token you generated above:

```c
$ curl -XGET https://localhost:9200/_cat/nodes -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6ImFkbWluIiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTU1NDc1Nzk3M30.KY5gC4yrBXXYYcaEJOl-xyiEr98h9Sw9dIWwEXAMPLE" --insecure
172.21.0.3 37 38 3 0.03 0.11 0.09 mdi * WTNYA_5
$ curl -XGET https://localhost:9200/_cluster/health\?pretty -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6ImFkbWluIiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTU1NDc1Nzk3M30.KY5gC4yrBXXYYcaEJOl-xyiEr98h9Sw9dIWwlzJYpBg" --insecure
{
  "cluster_name" : "odfe-cluster",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "active_primary_shards" : 7,
  "active_shards" : 7,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 5,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 58.333333333333336
}
$ curl -XGET https://localhost:9200/_opendistro/_security/authinfo\?pretty -H "Authorization: Bearer `eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6ImFkbWluIiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTU1NDc1Nzk3M30.KY5gC4yrBXXYYcaEJOl-xyiEr98h9Sw9dIWwlzJYpBg`" --insecure { "user" : "User [name=admin, roles=[admin], requestedTenant=null]", "user_name" : "admin", "user_requested_tenant" : null, "remote_address" : "172.23.0.1:53104", "backend_roles" : [ "admin" ], "custom_attribute_names" : [ "attr.jwt.iss", "attr.jwt.sub", "attr.jwt.exp", "attr.jwt.roles" ], "roles" : [ "all_access", "own_index" ], "tenants" : { "admin_tenant" : true, "admin" : true }, "principal" : null, "peer_certificates" : "0", "sso_logout_url" : null }
```

Then you can issue a request to Kibana from the terminal and note the successful response:

`$ curl -XGET http://localhost:5601 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6ImFkbWluIiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTU1MzY0Mjc1NX0.2RVy0VEObwduF9nNZas498LTJMRLC9luTuebEXAMPLE" -i`
`HTTP/1.1 302 Found location: /app/kibana kbn-name: kibana set-cookie: security_storage=Fe26.2**a86a495463a9ed2aef99e9499025b000888bc70232d006765c9990f8c9d7412*viOmkphhLLIDeBTxX9_OkQ*lIBpboN6gQ07QvwY7mMp-48IsrvI0qtfaRR8_VmPesYmlqlNizId2smn-kXtIJdsmZBpz7y4WLJzmqP0hKKCBAAJ9Bccj-fVh5QJdHW6mWEhuS870VlB9PUMZAnQ8ju6D8Gs-70A16rodBDSI4b601EhJET4vtMObTFmvYkiavqKvc9CPbwMpHRQdIKwX9AzSjbekMC8CSn1PgzMbtNijYNFd3sLZHrDxrqTSQijm8M**ba624f98f91081024b49264a08c692287b30bca4f185aa8925c1bb238cdf27ef*fc9z6yinUj2Xp920Iy-GoKdVzO5G4aZRsxQWi_bVH-Y; Path=/ set-cookie: security_preferences=Fe26.2**a2791807692cd418aa644804fd0e6e5cd33421a899e0797d8a97ec4e7f2cbf0*guZ5n6zMcCwylCPOazyyew*1n43XcDV1NcGvgl-VwD07njHLkxn-VdgQNVMk5ZQSsw**f25a10407839cc2869b06826eb5459f166baf6fcea11df6b1f4a316152fec3e4*K5wr95D7cVoetpvEFjdzjSN-mgvBEU9tWpx6QiLgEuE; Max-Age=2217100485; Expires=Mon, 27 Jun 2089 17:56:50 GMT; Path=/ set-cookie: security_authentication=Fe26.2**5ca6f12884a00a406f89887bb91f33ee7a68f22c815996a9adbda934698364d*OuII1jATnWfYzaHIv4_HvQ*qoTlwVqRvpDzkWmq-JYZbXpSbEJ6DyG5qhmNenM0GB6vbGEcnkXmpUFvOICkAyRuzmKwl9Uut1GYM98TLwhTZbzFb6Z1d5Sb4MOpk6DJNFjuokIm0u9tqsCwCGMEO_avmosVy4gceAluSX-7vN-vC461jt2B3_DIbyeREjPLtjr91a2I95nGQRir_-4cypkjUaS3Blub1ZC7fNnkBcK5POvo-nKTXJmx5KQx4O_6zVc3vFfoQLJ7_AUrLAID_htMHMv5o7_qn1oMHP-LTr5zvO4iDLlY1UgBJCmikpMatxPg8ophKxWkMRuIdo4UaZEjrzXwQPJtYBmpJxwQtolJQB5jwOnNNVqtUeiI7sWitHM**1c4cf336b71a513045bf0bfe50ff96447c213f70dfd3745d713e57235a7edff9*fLp9DLSMhgKHjOIJ8VDHMbVI9Z7W56Velx4Pi5STK4s; Max-Age=3600; Expires=Tue, 26 Mar 2019 21:42:05 GMT; HttpOnly; Path=/ cache-control: no-cache content-length: 0 connection: close Date: Tue, 26 Mar 2019 20:42:05 GMT`

## Conclusion

Congratulations! You have created JWT tokens for authenticating and controlling access to your Open Distro for Elasticsearch cluster. You modified the Security Plugin’s configuration to accept JWTs. You ran your modified Elasticsearch and Kibana in your containers, and successfully sent queries.
Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

