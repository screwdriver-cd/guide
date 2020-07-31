---
layout: main
title: Collect Metrics
category: Cluster Management
menu: menu
toc:
    - title: Collect metrics
      url: "#collect-metrics"
      active: true
    - title: API metrics
      url: "#api-metrics"
    - title: Build metrics
      url: "#build-metrics"
---

# Collect metrics
Screwdriver.cd exposes some metrics for Prometheus[Prometheus](https://prometheus.io).  
You can collect these metrics if you add some settings to your Prometheus.

## API metrics
Add a following job config into `scrape_configs` in your `prometheus.yml`.
```
scrape_configs:
  - job_name: 'screwdriver-api'
    metrics_path: /v4/metrics
    static_configs:
      - targets:
        - <your-api-hostname>:<your-api-port>
```

## Build metrics
To collect this metrics, it also requires a [Pushgateway](https://github.com/prometheus/pushgateway) server in your environment.
And also you have to configure the url of pushgateway in queue-service. Please see the [Configuring the Queue Service](./configure-queue-service#configuration).

Add a following job config into `scrape_configs` in your `prometheus.yml`.
```
scrape_configs:
  - job_name: 'pushgateway'
    static_configs:
      - targets:
        - <your-pushgateway-hostanme>:<your-pushgateway-port>
    metrics_path: /metrics
    honor_labels: true
```
