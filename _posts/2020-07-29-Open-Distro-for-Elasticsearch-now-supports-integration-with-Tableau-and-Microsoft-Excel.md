---
layout: posts
author: Viraj Phanse, Anirudha Jadhav
comments: true
title: "Open-Distro-for-Elasticsearch-now-supports-integration-with-Tableau-and-Microsoft-Excel.md" 
categories:
- odfe-updates
feature_image: "https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/03/26/open_disto-elasticsearch-logo-800x400.jpg"
---
We now facilitate connecting Elasticsearch with two of the most powerful business intelligence and data visualization applications, Tableau and Microsoft Excel. To achieve this, we introduce the Open Distro for Elastic Search - Tableau integration and the Open Distro for Elastic Search - Excel integration in Open Distro for Elasticsearch SQL Engine . 

Open Distro for Elasticsearch SQL Engine allows the use of Structured Query Language (SQL) to manifest search results in a tabular format with documents represented as rows, fields as columns, and indexes as table names, respectively, in the WHERE clause. It is powered by Open Distro for Elasticsearch, an Apache 2.0 licensed distribution of Elasticsearch. One of the key features of this engine is the Open Database Connectivity (ODBC) driver to help connect Elasticsearch to various business intelligence (BI) and analytics applications. We have expanded the capabilities of the ODBC driver via new integrations  with business intelligence (BI) and data visualization applications such as Tableau and Microsoft Excel. 

Users can now connect Elasticsearch with Tableau to create sophisticated visualizations on top of the search results obtained from Elasticsearch by leveraging the Open Distro for Elasticsearch - Tableau Integration. Similarly, they can connect Elasticsearch with Microsoft Excel to conduct a deeper analysis on data obtained from Elasticsearch using the Open Distro for Elasticsearch - Excel integration. Such an integration with Excel allows users to use advanced functionality like Power Query, a self-service business intelligence (BI) for Excel and export data in the format of choice such as CSV on the search results.

Open Distro for Elasticsearch - Tableau integration and Open Distro for Elastic Search - Microsoft Excel integration are supported on any cluster running Open Distro for Elasticsearch 1.8 and above. To learn more about the integrations with Tableau and Excel, visit [Open Distro for Elasticsearch - Tableau Integration Documentation](https://github.com/opendistro-for-elasticsearch/sql/blob/develop/sql-odbc/docs/user/tableau_support.md) and [Open Distro for Elasticsearch - Excel Integration Documentation](https://github.com/opendistro-for-elasticsearch/sql/blob/develop/sql-odbc/docs/user/microsoft_excel_support.md). To learn more about Open Distro for Elasticsearch, visit the [website](https://opendistro.github.io/for-elasticsearch/). 

## Author(s)
Viraj Phanse is a Senior Product Manager for Open Distro for Elasticsearch and Amazon Elasticsearch Service at Amazon Web Services
Anirudha Jadhav is an Engineering Manager for Open Distro for Elasticsearch and Amazon Elasticsearch Service at Amazon Web Services
