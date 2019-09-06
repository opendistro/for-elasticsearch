---
layout: posts
author: agadeesh Pusapadi
comments: true
title: LDAP Integration for Open Distro for Elasticsearch
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/05/22/open_disto-elasticsearch-logo-800x400.jpg"
---
[_Open Distro for Elasticsearch_](https://github.com/opendistro-for-elasticsearch/)’s security plugin comes with authentication and access control out of the box. In prior posts we showed how you can [change your admin password in Open Distro for Elasticsearch](https://aws.amazon.com/blogs/opensource/change-passwords-open-distro-for-elasticsearch/) and how you can [add your own SSL certificates to Open Distro for Elasticsearch](https://aws.amazon.com/blogs/opensource/add-ssl-certificates-open-distro-for-elasticsearch/).

One of the key steps to using the Security plugin is to decide on an authentication backend. The plugin has an internal user database, but many people prefer to use an existing authentication backend, such as an LDAP server, or some combination of the two. In this post we will talk about integrating the Security plugin with your LDAP or Active Directory and configuring the mapping between your backend user roles and Elasticsearch Security roles to provide granular access control.

The main configuration file for authentication and authorization modules is``plugins`/`opendistro_security`/`securityconfig`/`config`.`yml``. It defines how the Security plugin retrieves the user credentials, how it verifies these credentials, and how additional user roles are fetched from backend systems. Details on the structure of this configuration file are documented in the [Open Distro for Elasticsearch docs](https://opendistro.github.io/for-elasticsearch-docs/docs/security/configuration/).

## Create Users and Assign to Groups in LDAP/AD

I’m using Active Directory for my LDAP server. Using the “Active Directory Users and Computers” administrative tool, I’ve created three users – `esuser1, esuser2 & esuser3` and two groups – `ESAdmins and ES-Read-Grp`. I’ve made `esuser1` a member of `ESAdmins` group, `esuser2` a member of `ES-Read-Grp` and `esuser3` is not part of any group.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/19/MSAD-dialog.png" style="width: 100%;">
</div>


## Applying Changes to Security Plugin Configuration

The Security plugin stores its configuration — including users, roles, and permissions — in an index on the Elasticsearch cluster (`.opendistro_security`). Storing these settings in an index lets you change settings without restarting the cluster and eliminates the need to place configuration files on any node.

After changing any of the configuration files in `plugins/opendistro_security/securityconfig`, however, you must run `plugins/opendistro_security/tools/securityadmin.sh` to load these new settings into the index. This script identifies itself against a cluster through an admin TLS certificate, in `.pem`, `.jks`, `.p12`, or `.pfx` format.

If the `.opendistro_security` index is already initialized, you can also use Kibana to change users, roles, and permissions. However, you need to run `securityadmin.sh` at least once to initialize the index and configure your authentication and authorization methods.
For additional details on how to use `securityadmin.sh`, please refer to the [Open Distro for Elasticsearch documentation](https://opendistro.github.io/for-elasticsearch-docs/docs/security/security-admin/).

## Configure LDAP Details in Security Plugin

LDAP can be used for authentication and authorization and thus can be used both in the `authc` and `authz` sections of the configuration. The `authc` section is used for configuring authentication, which means to check whether the user has entered the correct credentials. `authz` is used for authorization, which defines how the role(s) for an authenticated user are retrieved and mapped.

For a new setup, you can use `plugins/opendistro_security/securityconfig/config.yml` to update the LDAP configuration details. In an established setup, make sure you retrieve the current Security plugin configuration from a running cluster (`securityadmin.sh -r ...`) and use those files to avoid losing any changes.

### Authentication

Add the following lines to `authc` section of the `config.yml`file to enable LDAP authentication:

```
`  ...  
    authc:
      ldap:
        http_enabled: true
        transport_enabled: false
        order: 1
        http_authenticator:
          type: "basic"
          challenge: false
        authentication_backend:
          type: "ldap"
          config:
   ...`
```

In the config section, we’ll configure LDAP connection settings: hostname & port (`hosts:`), BindDN (`bind_dn:`), and password (`password`). Here is my copy of the section – replace `"<< password >>"` with your actual password for the bind user in plain text.

```
`          config:
            enable_ssl: false
            enable_start_tls: false
            enable_ssl_client_auth: false
            verify_hostnames: true
            hosts:
                - "ad.example.com:389"
            bind_dn: "cn=esuser1,OU=Users,OU=AD,dc=ad,dc=example,dc=com"
            password: "<< password >>"
            userbase: "OU=Users,OU=AD,dc=ad,dc=example,dc=com"
            usersearch: "(sAMAccountName={0})"
            username_attribute: "cn"`
```

Authentication works by issuing an LDAP query containing the username against the user subtree of the LDAP tree.
The Security plugin first takes the configured LDAP query and replaces the placeholder `{0}` with the username from the user’s credentials.

```
`usersearch: "(sAMAccountName={0})"`
```

Then it issues this query against the user subtree. Currently, the whole subtree below the configured `userbase` is searched:

```
`userbase: "OU=Users,OU=AD,dc=ad,dc=example,dc=com"`
```

If the query was successful, the Security plugin retrieves the username from the LDAP entry. You can specify which attribute from the LDAP entry the Security plugin should use as the username:

```
`username_attribute: "cn"`
```

If this key is not set or null, then the Distinguished Name (DN) of the LDAP entry is used. I’ve set my to “CN”.

### Authorization

Add the following lines to `authz` section of the `config.yml`file to enable LDAP authorization:

```
`...
    authz:
      roles_from_myldap:
        http_enabled: true
        transport_enabled: false
        authorization_backend:
          type: "ldap"
          config:
...`
```

Authorization is the process of retrieving backend roles for an authenticated user from an LDAP server. This is typically the same server(s) you use for authentication, but you can also use a different server. The only requirement is that the desired user actually exists on the LDAP server. Since the Security plugin always checks if a user exists in the LDAP server, you need to configure `userbase`, `usersearch,` and `username_attribute` in the `authz` section. Authorization works similarly to authentication. The Security plugin issues an LDAP query containing the username against the role subtree of the LDAP tree. Here is my copy of the section:

```
`        config:
            enable_ssl: false
            enable_start_tls: false
            enable_ssl_client_auth: false
            verify_hostnames: true
            hosts:
            - "ad.example.com:389"
            bind_dn: "cn=esuser1,OU=Users,OU=AD,dc=ad,dc=example,dc=com"
            password: "Test1234"
            userbase: "OU=Users,OU=AD,dc=ad,dc=example,dc=com"
            usersearch: "(uid={0})"
            rolebase: "OU=Groups,OU=AD,dc=ad,dc=example,dc=com"
            rolesearch: "(member={0})"
            userrolename: "memberOf"
            rolename: "cn"`
```

The Security plugin first takes the LDAP query for fetching roles (“rolesearch”) and substitutes any variables found in the query. For example, for a standard Active Directory installation, you would use the following role search. Here `{0}` is substituted with the DN of the user:

```
`rolesearch: '(member={0})'`
```

The Security plugin then issues the substituted query against the configured role subtree. The whole subtree below `rolebase` is searched.

```
`rolebase: 'ou=groups,dc=example,dc=com'`
```

After all roles have been fetched, the Security plugin extracts the final role names from a configurable attribute of the role entries:

```
`rolename: 'cn'`
```

If this is not set, the DN of the role entry is used.

## Update the Security plugin Config

Now run `securityadmin.sh`to update the Security Plugin config as shown below:

```
`$ /usr/share/elasticsearch/plugins/opendistro_security/tools/securityadmin.sh \
    -cacert /etc/elasticsearch/root-ca.pem \
-cert /etc/elasticsearch/kirk.pem \ 
-key /etc/elasticsearch/kirk-key.pem \
-h <Cluster-IP-or-FQDN> \
-f <Path-to-config>/config.yml -t config`
```

Here I’m specifying the paths for the Root CA certificate(`-cacert)`, Admin Certificate(`-cert),` and Admin Private Key (`-key)` files. The DN of the Admin certificate needs to be configured in the`elasticsearch.yml` file under `opendistro_security.authcz.admin_dn` . I’m restricting this update to the config file by explicitly specifying the config file location.

## Create Elasticsearch Security Roles

Open Distro for Elasticsearch’s Security Plugin provides built-in [Default Actions groups](https://opendistro.github.io/for-elasticsearch-docs/docs/security/default-action-groups/). We’ll create new roles and assign cluster- and index-level permissions using these default action groups. Please refer to the documentation for further details on creating new custom action groups combining the default action groups and [single permissions,](https://opendistro.github.io/for-elasticsearch-docs/docs/security/permissions/) and also how to add [Document and Field Level security](https://opendistro.github.io/for-elasticsearch-docs/docs/security/document-level-security/) as part of your role definitions.

### Kibana

Using Kibana as the “admin” user, I created two custom roles, one with Full Read/Write permissions and another with just read-only permissions.
Select Security and click on Roles:


<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/19/Roles.png" style="width: 100%;">
</div>

Click on the + button to add a new role:

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/19/AddRole1.png" style="width: 100%;">
</div>

Enter a new Role Name:

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/19/AddRole2.png" style="width: 100%;">
</div>

Select Cluster Permissions and add an Action Group and/or Single Permissions:

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/19/AddRole3.png" style="width: 100%;">
</div>

Select Index Permissions and add an Index Pattern (supports wildcards) or select an index.

For each Index Pattern, add an Action Group and/or Single Permissions.

When you’re finished, click Save Role Definition.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/19/AddRole4.png" style="width: 100%;">
</div>

## Map LDAP Backend Roles to Elasticsearch Security Roles

You can map Elasticsearch Roles to usernames, backend roles and/or hosts. Backend roles are determined as part of the authentication and authorization process and can come from an internal user configuration, LDAP, or JSON Web Token. We will map our roles to LDAP Group names.
In Kibana, select Security and click on Role Mappings:

Click on the + button to add a new role mapping:

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/19/RoleMapping1.png" style="width: 100%;">
</div>

Select the new Role from the dropdown (only unmapped roles are available for selection).
Add the appropriate Backend Role. (I’m using the CN of the LDAP Group name as I had configured the `rolename: 'cn'` in the security config. Without this configuration, the full DN needs be specified here.)

Click Submit to save the mapping:

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/04/19/RoleMapping2.png" style="width: 100%;">
</div>

## Role Creation and Mapping Using the CLI

We’ll create the read-only role and mapping using the command-line interface (CLI).
In a new setup, you can also use the default security configuration files in `plugins/opendistro_security/securityconfig/` to create roles and role mappings from the command line. In established setups, retrieve the current Security plugin configuration from a running cluster (`securityadmin.sh -r ...`) and use those output files to ensure you are updating the current configuration.

```
`$ /usr/share/elasticsearch/plugins/opendistro_security/tools/securityadmin.sh \
    -cacert /etc/elasticsearch/root-ca.pem \
-cert /etc/elasticsearch/kirk.pem \ 
-key /etc/elasticsearch/kirk-key.pem \
-h <Cluster-IP-or-FQDN> \
-r`
```

This creates five files with datestamps in the local folder – `config, roles, roles_mapping, internal_users, action_groups`
Copy the `roles` file to `roles.yml` and `roles_mapping` file to `roles_mapping.yml`
Append the configuration shown below to the `roles.yml` file. This creates a new role called `CustomReadOnly` with Read permissions

```
`CustomReadOnly:
  cluster:
  - "CLUSTER_COMPOSITE_OPS_RO"
  indices:
    '*':
      '*':
      - "READ"`
```

Append the configuration shown below to `roles_mapping.yml`. This maps the role `CustomReadOnly` to the LDAP group `ES-Read-Grp.`

```
`CustomReadOnly:
  backendroles:
  - "`ES-Read-Grp`" hosts: [] users: []`
```

Now run `securityadmin.sh`to update the Security Plugin config as shown below, to push one update at a time:
This first command-line pushes the roles.

```
`$ /usr/share/elasticsearch/plugins/opendistro_security/tools/securityadmin.sh \
    -cacert /etc/elasticsearch/root-ca.pem \
-cert /etc/elasticsearch/kirk.pem \ 
-key /etc/elasticsearch/kirk-key.pem \
-h <Cluster-IP-or-FQDN> \
-f ./roles.yml -t roles`
```

This command-line pushes the role mappings.

```
`$ /usr/share/elasticsearch/plugins/opendistro_security/tools/securityadmin.sh \
    -cacert /etc/elasticsearch/root-ca.pem \
-cert /etc/elasticsearch/kirk.pem \ 
-key /etc/elasticsearch/kirk-key.pem \
-h <Cluster-IP-or-FQDN> \
-f ./roles_mapping.yml -t rolesmapping`
```

## Test Logging in as Different Users

### As a Read-Write User** **`esuser1`

User `esuser1` is part of `ESAdmins` LDAP group and is mapped to security role `ESAdminRole`. As part of this role, this user is allowed to perform read and write operations.
Create an index (succeeds as expected):

```
`$ curl -XPUT -k "https://odfe-node1:9200/my-index" -u esuser1
Enter host password for user 'esuser1':
{
    "acknowledged":true,
    "shards_acknowledged":true,
    "index":"my-index"
 }`
```

Add a document (succeeds as expected):

```
`$ curl -XPOST -k "https://odfe-node1:9200/my-index/doc1/?pretty=true" -H 'Content-Type: application/json' -d'
        { 
         "text":"Hello World!"
        }' -u esuser1
Enter host password for user 'esuser1':
{
  "_index" : "my-index",
  "_type" : "doc1",
  "_id" : "GPxOLGoB9R98haWaBOPk",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}`
```

Run a search query (succeeds as expected):

```
`$ curl -XPOST -k "https://odfe-node1:9200/_search?pretty=true"  -H 'Content-Type: application/json' -d' 
{ 
 "query":{
    "query_string":{
        "query":"hello"
        }
    }
}' -u esuser1
Enter host password for user 'esuser1':
{
  "took" : 99,
  "timed_out" : false,
  "_shards" : {
    "total" : 90,
    "successful" : 90,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 1,
    "max_score" : 0.2876821,
    "hits" : [
      {
        "_index" : "my-index",
        "_type" : "doc1",
        "_id" : "GPxOLGoB9R98haWaBOPk",
        "_score" : 0.2876821,
        "_source" : {
          "text" : "Hello World!"
        }
      }
    ]
  }
}`
```

### As Read-only User** **`esuser2`

User `esuser2` is part of `ES-Read-Grp` LDAP group and is mapped to security role `CustomReadOnly`. As part of this role, this user is allowed to perform only read operations.
Create an index (fails as expected. `esuser2`is not a member of a group that allows writing):

```
`$ curl -XPUT -k "https://odfe-node1:9200/my-index" -u esuser2
Enter host password for user 'esuser2':
{
  "error" : {
    "root_cause" : [
      {
        "type" : "security_exception",
        "reason" : "no permissions for [indices:data/write/index] and User [name=esuser2, roles=[Domain Users, Users, AWS Delegated Add Workstations To Domain Users], requestedTenant=null]"
      }
    ],
    "type" : "security_exception",
    "reason" : "no permissions for [indices:data/write/index] and User [name=esuser2, roles=[Domain Users, Users, AWS Delegated Add Workstations To Domain Users], requestedTenant=null]"
  },
  "status" : 403
}`
```

Run a search query (succeeds as expected):

```
`$ curl -XPOST -k "https://odfe-node1:9200/_search?pretty=true"  -H 'Content-Type: application/json' -d' 
{ 
 "query":{
    "query_string":{
        "query":"hello"
        }
    }
}' -u esuser2
Enter host password for user 'esuser2':
{
  "took" : 101,
  "timed_out" : false,
  "_shards" : {
    "total" : 90,
    "successful" : 90,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 1,
    "max_score" : 0.2876821,
    "hits" : [
      {
        "_index" : "my-index",
        "_type" : "doc1",
        "_id" : "GPxOLGoB9R98haWaBOPk",
        "_score" : 0.2876821,
        "_source" : {
          "text" : "Hello World!"
        }
      }
    ]
  }
}`
```

### As User** **`esuser3`** **– Not in Any Groups

User `esuser3` is not part of any LDAP groups and is not mapped to any security roles. So, this user is not allowed to perform any operations.
Add a document (fails as expected. `esuser3` is not a member of any group):

```
`$ curl -XPOST -k "https://odfe-node1:9200/my-index/doc1/?pretty=true" -H 'Content-Type: application/json' -d'
        { 
         "text":"Hello World!"
        }' -u esuser3
Enter host password for user 'esuser3':
  "error" : {
    "root_cause" : [
      {
        "type" : "security_exception",
        "reason" : "no permissions for [indices:data/write/index] and User [name=esuser3, roles=[], requestedTenant=null]"
      }
    ],
    "type" : "security_exception",
    "reason" : "no permissions for [indices:data/write/index] and User [name=esuser3, roles=[], requestedTenant=null]"
  },
  "status" : 403
}`
```

Run a search query (fails as expected. `esuser3` is not a member of any group):

```
`$ curl -XPOST -k "https://odfe-node1:9200/_search?pretty=true"  -H 'Content-Type: application/json' -d' 
{ 
 "query":{
    "query_string":{
        "query":"hello"
        }
    }
}' -u esuser3
Enter host password for user 'esuser3':
{
  "error" : {
    "root_cause" : [
      {
        "type" : "security_exception",
        "reason" : "no permissions for [indices:data/read/search] and User [name=esuser3, roles=[], requestedTenant=null]"
      }
    ],
    "type" : "security_exception",
    "reason" : "no permissions for [indices:data/read/search] and User [name=esuser3, roles=[], requestedTenant=null]"
  },
  "status" : 403
}`
```

## Conclusion

In this post I covered integrating the Security plugin with your LDAP or Active Directory server for user authentication. I showed how to configure authorization and mapping between your backend user groups and Elasticsearch Security roles to provide granular role based access control.

Please refer to the Open Distro for Elasticsearch documentation for additional configuration options for [Security Plugin’s Active Directory and LDAP integration](https://opendistro.github.io/for-elasticsearch-docs/docs/security/ldap/).

Have an issue or question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here](https://github.com/opendistro-for-elasticsearch/community/issues).

