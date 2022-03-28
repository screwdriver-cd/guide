---
layout: main
title: キューサービスの設定
category: Cluster Management
menu: menu_ja
toc:
    - title: キューサービスの管理
      url: "#キューサービスの管理"
      active: true
    - title: パッケージ
      url: "#パッケージ"
    - title: 構成
      url: "#構成"
    - title: 認証
      url: "#認証"
      subitem: true
    - title: サービス
      url: "#サービス"
      subitem: true
    - title: Redis
      url: "#redisキューの設定"
      subitem: true
    - title: Blocked By
      url: "#blocked-byの設定"
      subitem: true
    - title: Push Gateway
      url: "#pushgatewayの設定"
      subitem: true
    - title: Scheduler
      url: "#scheduler"
      subitem: true
    - title: Executors
      url: "#executors"
      subitem: true
---

# キューサービスの管理

## パッケージ
他のサービスと同様にAPIは、[Docker image](https://hub.docker.com/r/screwdrivercd/queue-service/)としてポート80番で公開されています。

```bash
$ docker run -d -p 9003:80 screwdrivercd/queue-service:latest
$ open http://localhost:9003
```

私たちのDockerImageには、バージョン(例: `v1.2.3`)とフローティングタグ`latest`, `stable`タグがついています。
特に理由がなければ`stable`または固定のバージョンタグを利用してください。

## 構成
Screwdriver.cdは既に[ほとんどの設定をデフォルト](https://github.com/screwdriver-cd/queue-service/blob/master/config/default.yaml)にしています。
環境変数を変更または `config/local.yaml`を作成することでデフォルトを上書きすることができます。
環境変数はすべて[ここ](https://github.com/screwdriver-cd/queue-service/blob/master/config/custom-environment-variables.yaml)に定義してあります。

### 認証

APIから受信するJWTのバリデーションを設定します。

| 環境変数 | 必須 | 説明                                                                                           |
|:----------------------|:--------|:------------------------------------------------------------------------------------------------------|
| JWT_ENVIRONMENT | いいえ      | JWT を生成する環境です。例えば prod や beta などを指定します。JWT に環境変数を含めたくないのであれば、この環境変数は設定しないでください。(`''`のような設定もしないでください)|
| SECRET_JWT_PRIVATE_KEY | はい      | JWTに署名するための秘密鍵です。次のコマンドにより生成できます。<br /> `$ openssl genrsa -out jwt.pem 2048`|
| SECRET_JWT_PUBLIC_KEY  | はい     | 署名を検証するための公開鍵です。次のコマンドにより生成できます。<br />`$ openssl rsa -in jwtqs.pem -pubout -out jwtqs.pub`|
| SECRET_JWT_SD_API_PUBLIC_KEY | *none*  | JWTの署名の検証に使用する公開鍵です。APIで設定したものと同じものを使用してください。 |

```yaml
# config/local.yaml
auth:
    jwtPrivateKey: |
        PRIVATE KEY HERE
    jwtPublicKey: |
        PUBLIC KEY HERE
    jwtSDApiPublicKey: |
        PUBLIC KEY HERE
```

### サービス
サービスがどのようにトラフィックをlistenしているかを設定します。

|  環境変数       | デフォルト          | 説明 |
|:----------|:--------------------|:--------------------------------------------------------------------------------------|
| PORT      | 80                  | サービスが受けているポート |
| HOST      | 0.0.0.0             | サービスが立ち上がるホスト  (このマシンからの接続のみを受け入れるように localhost に設定)|
| URI       | http://localhost:80 | 外部ルーティング可能な URI (通常は、ロードバランサまたはCNAME) |
| HTTPD_TLS | false               | SSLサポートの有無です。有効にする場合は`false`を[`tls.createServer`](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)に渡すJSONオブジェクトに置き換えてください。|


```yaml
# config/local.yaml
httpd:
    port: 443
    host: 0.0.0.0
    uri: https://localhost
    tls:
        key: |
            PRIVATE KEY HERE
        cert: |
            YOUR CERT HERE
```

### Redisキューの設定

キューを構成するための設定を行います。


| 環境変数                 | 必須 |  デフォルト | 説明|
|:--------------------|:---------------------|:----------------------|:------------------------------|
| REDIS_HOST          | はい                  | 127.0.0.1            | Redis ホスト                  |
| REDIS_PORT          | はい                 | 6379                 | Redis ポート                 |
| REDIS_PASSWORD      | はい                 | a-secure-password    | Redis パスワード              |
| REDIS_TLS_ENABLED   | いいえ                   | false                | Redis tls 有効化           |
| REDIS_DB_NUMBER     | いいえ                   | 0                    | Redis db 番号             |
| REDIS_QUEUE_PREFIX  | いいえ                   | ''                   | Redis queue プレフィックス |

```yaml
# config/local.yaml
queue:
  redisConnection:
    host: "127.0.0.1"
    port: 6379
    options:
      password: a-secure-password
      tls: false
    database: 0
  prefix: ''
```

### Blocked Byの設定

[blockedBy](../user-guide/configuration/workflow#blocked-by)のための設定を行います。

| 環境変数                | 必須            |  デフォルト              | 説明       |
|:-------------------|:---------------------|:----------------------------------------------------|
| PLUGIN_BLOCKEDBY_REENQUEUE_WAIT_TIME | いいえ           | 1            | ブロックされている場合に再エンキューする前に待機する時間（分）   |
| PLUGIN_BLOCKEDBY_BLOCK_TIMEOUT       | いいえ           | 120          | ジョブのブロックによりタイムアウトとなるまでの最大時間（分)        |
| PLUGIN_BLOCKEDBY_BLOCKED_BY_SELF     | いいえ           | true         | 同じジョブをブロックされるかどうか    |
| PLUGIN_BLOCKEDBY_COLLAPSE            | いいえ           | true         | 同タイミングに同じジョブで複数のビルドが走った場合に1つのビルドに集約するかどうか   |

```yaml
# config/local.yaml
plugins:
  blockedBy:
    reenqueueWaitTime: 5
    blockTimeout: 180
    blockedBySelf: false
    collapse: false
```
### Pushgatewayの設定
[ビルドメトリクス](./collect-metrics#ビルドメトリクス)を取得する場合はPushgatewayの設定を追加する必要があります。

|環境変数                        | 必須 | デフォルト | 説明     |
|:--------------------------|:---------|:--------|:----------------|
|ECOSYSTEM_PUSHGATEWAY_URL  | いいえ   |         | Pushgateway URL |

### Scheduler

Schedulerが有効な場合、Queue ServiceはビルドをRabbitMQ Build Clusterキューに渡し、[Build Cluster Queue Worker](./configure-buildcluster-queue-worker)で処理されます。

| キー                   | 環境変数 | 説明                                                                                           |
|:----------------------|:---------------------|:------------------------------------------------------------------------------------------------------|
| enabled | SCHEDULER_ENABLED | `true` の場合、ビルドはRabbitMQのビルドクラスターキューに送られ、処理が行われます。 |
| protocol | RABBITMQ_PROTOCOL | RabbitMQに接続するためのプロトコル。非sslの場合はamqp、sslの場合はamqpsを使用します。デフォルト: amqp  |
| username | RABBITMQ_USERNAME | RabbitMQのキューを利用することを許可された、接続するユーザー  |
| password | RABBITMQ_PASSWORD | パスワード |
| host | RABBITMQ_HOST | RabbitMQクラスタのホスト名 デフォルト: 127.0.0.1 |
| port | RABBITMQ_PORT | RabbitMQのポート デフォルト: 5672 |
| vhost | RABBITMQ_VIRTUAL_HOST | キュー用の仮装ホスト デフォルト: /screwdriver |
| connectOptions | RABBITMQ_CONNECT_OPTIONS | オプションを使用して、heartbeatチェックを設定し、接続が切れた場合に時間内に再接続することができます。デフォルト: '{ "json": true, "heartbeatIntervalInSeconds": 20, "reconnectTimeInSeconds": 30 }' |

### Executors

RabbitMQ Schedulerが使用されていない場合、Queue Serviceは直接executorを呼び出すことができます。設定内容は、APIの[設定構成](./configure-api#executorプラグイン)と同じです。
