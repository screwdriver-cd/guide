---
layout: main
title: メトリクスの収集
category: Cluster Management
menu: menu_ja
toc:
    - title: メトリクスの収集
      url: "#メトリクスの収集"
      active: true
    - title: APIメトリクス
      url: "#APIメトリクス"
    - title: ビルドメトリクス
      url: "#ビルドメトリクス"
---

# Collect metrics
Screwdriver.cdでは、[Prometheus](https://prometheus.io)で利用できるメトリクスを提供しています。  
設定を追加することでこれらのメトリクスを収集することができます。

## APIメトリクス
`prometheus.yml'のファイル内の`scrape_configs`に以下のジョブ設定を追加してください。
```
scrape_configs:
  - job_name: 'screwdriver-api'
    metrics_path: /v4/metrics
    static_configs:
      - targets:
        - <your-api-hostname>:<your-api-port>
```

## ビルドメトリクス
このメトリクスを利用したい場合は、[Pushgateway](https://github.com/prometheus/pushgateway)も必要になります。また、[キューサービスの設定](./configure-queue-service#configuration)を参照し、pushgatewayのURLを設定してください。

`prometheus.yml`のファイル内の`scrape_configs`に以下のジョブ設定を追加してください。
```
scrape_configs:
  - job_name: 'pushgateway'
    static_configs:
      - targets:
        - <your-pushgateway-hostanme>:<your-pushgateway-port>
    metrics_path: /metrics
    honor_labels: true
```
