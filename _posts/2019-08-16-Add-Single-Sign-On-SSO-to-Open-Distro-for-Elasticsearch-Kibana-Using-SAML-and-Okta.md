---
layout: posts
author: Jagadeesh Pusapadi
comments: true
title: Add Single Sign-On (SSO) to Open Distro for Elasticsearch Kibana Using SAML and Okta
categories:
- Open Distro for Elasticsearch updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-07-new.png"
---

[Open Distro for Elasticsearch](https://github.com/opendistro-for-elasticsearch/) Security implements the web browser single sign-on (SSO) profile of the SAML 2.0 protocol. This enables you to configure federated access with any SAML 2.0 compliant identity provider (IdP). In a prior post, I discussed [setting up SAML-based SSO using Microsoft Active Directory Federation Services (ADFS)](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-single-sign-on-saml-adfs/). In this post, I’ll cover the Okta-specific configuration.

## Prerequisites

* [Install and configure Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch-docs/docs/install/)
* [Install and configure Kibana](https://opendistro.github.io/for-elasticsearch-docs/docs/kibana/). Make a note of your Kibana server’s Fully Qualified Domain Name (FQDN) as kibana_base_url and kibana_port ( default is 5601).
* [Enable SSL on Elasticsearch and Kibana](https://aws.amazon.com/blogs/opensource/add-ssl-certificates-open-distro-for-elasticsearch/) – as this is a requirement for most identity providers.
* Create or capture the details of your [Okta](https://www.okta.com/) account.
* Create users and assign to groups in Okta. For this post, I’ve created three users – esuser1, esuser2, and esuser3 – and two groups – ESAdmins and ESUsers. Group memberships are shown here:

### 

|User	| Okta Group	| Open Distro Security role	|
|---	|---	|---	|
|esuser1	|ESAdmins	|all_access	|
|esuser2	|ESUsers	|readall	|
|esuser3	|N/A	|N/A	|



## Okta configuration

In your Okta account, click on Application -> Add Application -> Create New App.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-01.png" style="width: 100%;">
</div>

In the next screen, choose Web app as type, SAML 2.0 as the authentication method, and click Create. In the next screen, type in an application name and click Next.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-02.png" style="width: 100%;">
</div>

In SAML settings, set Single sign on URL and the Audience URI (SP Entity ID). Enter the below `kibana url` as the Single sign on URL.
`https://<kibana_base_url>:<kibana_port>/_opendistro/_security/saml/acs`
Make sure to replace the `kibana_base_url` and `kibana_port` with your actual Kibana configuration as noted in the prerequisites. In my setup this is `https://new-kibana.ad.example.com:5601/...`.
Add a string for the Audience URI. You can choose any name here. I used `kibana-saml`. You will use this name in the Elasticsearch Security plugin SAML config as the `SP-entity-id`.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-03.png" style="width: 100%;">
</div>

You will pass the user’s group memberships from Okta to Elasticsearch using Okta’s group attribute statements. Set the Name to “Roles”. The name you choose must match the `roles_key` defined in Open Distro Security’s configuration. Click Next and Finish.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-04.png" style="width: 100%;">
</div>

On the Application Settings screen, click Identity Provider metadata link to download the metadata XML file and copy it to the Elasticsearch config directory. Set the `idp.metadata_file` property in Open Distro Security’s `config.yml` file to the path of the XML file. The path has to be specified relative to the `config` directory (you can also specify `metadata_url` instead of `file`).

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-05-new.png" style="width: 100%;">
</div>


This metadata file contains the `idp.entity_id`.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-06.png" style="width: 100%;">
</div>

To complete the configuration of Open Distro for Elasticsearch Security, refer to my prior post on [adding single sign-on with ADFS](https://aws.amazon.com/blogs/opensource/open-distro-for-elasticsearch-single-sign-on-saml-adfs/). Follow the steps in that post to map Open Distro Security roles to Okta groups, update Open Distro Security configuration and Kibana configuration, and restart Kibana. My copy of the Security config file with Okta integration is as below:

```
`...http_enabled: truetransport_enabled: trueorder: 1http_authenticator:type: saml
          challenge: trueconfig:idp: metadata_file: okta-metadata.xml entity_id: http://www.okta.com/exksz5jfvfaUjGSuU356 sp: entity_id: kibana-saml kibana_url: https://new-kibana.ad.example.com:5601/
            exchange_key: 'MIIDAzCCAeugAwIB...'authentication_backend:type: noop...`
```

Once you restart Kibana, you are ready to test the integration. You should observe the same behavior as covered in the ADFS post.

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-07-new.png" style="width: 100%;">
</div>

<div style="text-align: center; margin: 15px 0;">
    <img src="https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/08/16/okta-08-new.png" style="width: 100%;">
</div>

## Conclusion

In this post, I covered SAML authentication for Kibana single sign-on with Okta. You can use a similar process to configure integration with any SAML 2.0 compliant Identity provider. Please refer to the Open Distro for Elasticsearch documentation for additional configuration options for [Open Distro for Elasticsearch Security configuration with SAML](https://opendistro.github.io/for-elasticsearch-docs/docs/security-configuration/saml/).
Have an issue or a question? Want to contribute? You can get help and discuss Open Distro for Elasticsearch on [our forums](https://discuss.opendistrocommunity.dev/). You can [file issues here.](https://github.com/opendistro-for-elasticsearch/community/issues)

