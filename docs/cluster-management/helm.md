---
layout: main
title: Helm
category: Cluster Management
menu: menu
toc:
    - title: Setting Up a Screwdriver Cluster using Kubernetes Helm Chart
      url: "#setting-up-a-screwdriver-cluster-using-kubernetes-helm-chart"
      active: true

---
# Setting Up a Screwdriver Cluster using Kubernetes Helm Chart
The whole Screwdriver ecosystem has a lot of different components which makes it difficult to configure and deploy each one of them individually for anyone who is new to Screwdriver.

To help you set up the cluster quickly on Kubernetes, we package all the Kubernetes deployments files into a single [helm chart](https://github.com/screwdriver-cd/screwdriver-chart). Installation of the chart will deploy the whole system all at once.

Please refer to the chart [repo](https://github.com/screwdriver-cd/screwdriver-chart) for instructions on installation.
