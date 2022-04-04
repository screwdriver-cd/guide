---
layout: main
title: artifacts-unzip-serviceの設定
category: Cluster Management
menu: menu_ja
toc:
    - title: artifacts-unzip-serviceの設定
      url: "#artifacts-unzip-serviceの設定"
      active: true
    - title: パッケージ
      url: "#パッケージ"
    - title: 設定
      url: "#設定"
    - title: Queue
      url: "#queue"
      subitem: true
    - title: MultiWorker
      url: "#multiworker"
      subitem: true
    - title: ヘルスチェック
      url: "#ヘルスチェック"
      subitem: true
---

# artifacts-unzip-serviceの設定

## パッケージ

アップロードされたZipファイルを解凍するコンポーネントです。  
[Zip Artifacts機能](zip-artifacts)を利用する場合に必要となるコンポーネントです。  
他のサービスと同様[Dockerイメージ](https://hub.docker.com/r/screwdrivercd/artifacts-unzip-service)を提供しています。  

```bash
docker run -d screwdrivercd/artifacts-unzip-service:latest
```

このDockerイメージはそのバージョン(例: 1.2.3) や動的なlatestタグ付けされています。プロダクションで利用する場合は固定のバージョンタグを利用してください。

## 設定

### Queue

接続するQueueについての設定です。

キー | デフォルト | 説明
--- | --- | ---
REDIS_HOST | - | Redis ホスト
REDIS_PORT | - | Redis ポート
REDIS_PASSWORD | - | Redis パスワード
REDIS_TLS_ENABLED | false | Redis tlsのサポートの有無。利用しない場合は`false`。利用する場合は[ioredisに引き渡すtls](https://github.com/luin/ioredis#tls-options)の設定を追加
REDIS_DB_NUMBER | 0 | Redis db 番号
REDIS_QUEUE_PREFIX | '' | Redis queue プレフィックス

```yaml
# config/local.yaml
queue:
  redisConnection:
    host: 127.0.0.1
    port: 6379
    options:
      password: REDIS PASSWORD
      tls: false
    database: 0
  prefix: ''
```

### MultiWorker

MultiWorkerについての設定です。

キー | デフォルト | 説明
--- | --- | ---
WORKER_MIN_TASK_PROCESSORS | 1 | MultiWorkerが生成するworkerの最小数
WORKER_MAX_TASK_PROCESSORS | 10 | MultiWorkerが生成するworkerの最大数
WORKER_CHECK_TIMEOUT | 1000 | イベントループがブロックされているかを確認する頻度(ミリ秒)
WORKER_MAX_EVENT_LOOP_DELAY | 10 | イベントループがブロックされたと判断する遅延時間(ミリ秒)

```yaml
# config/local.yaml
unzip-service:
  minTaskProcessors: 1
  maxTaskProcessors: 10
  checkTimeout: 1000
  maxEventLoopDelay: 10
```

詳細は[MultiWorker](https://github.com/actionhero/node-resque#multiworker-options)の設定を参照してください。

### ヘルスチェック

サービスが動作しているか確認するためのAPIを公開する設定をします。

`GET /last-emitted`エンドポイントを叩くことで、最後にイベントループがブロックされているかを確認した時刻が返ります。イベントループがブロックされているかの確認は`WORKER_CHECK_TIMEOUT`で設定された時間ごとに実施されます。  

キー | デフォルト | 説明
--- | --- | ---
PORT | 80 | listenするポート
HOST | 0.0.0.0 | listenするホスト(そのマシン上からの接続だけを受け付けるときだけlocalhostに設定)
URI | http://localhost:80 | 外部から接続可能なURI (通常はロードバランサーやCNAME)

```yaml
# config/local.yaml
httpd:
    port: 80
    host: 0.0.0.0
    uri: https://localhost
```
