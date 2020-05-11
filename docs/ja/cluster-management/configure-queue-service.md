---
layout: main
title: Configuring the Queue Service
category: Cluster Management
menu: menu
toc: 
    - title: キューサービスの管理
      url: "#キューサービスの管理"
      active: true
    - title: パッケージ
      url: "#パッケージ"
    - title: 構成
      url: "#構成"
---

# キューサービスの管理

## パッケージ
他のサービスと同様にAPIは、[Docker image](https://hub.docker.com/r/screwdrivercd/queue-service/)としてポート80番で公開されています。

```bash
$ docker run -d -p 9003:80 screwdrivercd/queue-service:latest
$ open http://localhost:9003
```

私たちの画像には、バージョン(例: `v1.2.3`)とフローティングタグ`latest`, `stable`タグがついています。  
最も良いインストール方法は、`stable`、または修正されたバージョンタグを使用することです。

## 構成
Screwdriver.cdは既に[ほとんどの設定をデフォルト](https://github.com/screwdriver-cd/queue-service/blob/master/config/default.yaml)にしています。  
しかし、環境変数や `config/local.yaml`を上書きすることでデフォルトを上書きすることができます。  
環境変数はすべて[ここ](https://github.com/screwdriver-cd/queue-service/blob/master/config/custom-environment-variables.yaml)に定義してあります。

### 認証

APIから受診するJWTのバリデーションを設定します。

| キー | 必須 | 説明                                                                                           |
|:----------------------|:--------|:------------------------------------------------------------------------------------------------------|
| JWT_ENVIRONMENT | いいえ      | JWTを生成するための変数 例: `prod`, `beta` JWTに環境変数を含ませたくない場合は、この環境変数を設定しないでください。`''`|
| SECRET_JWT_PRIVATE_KEY | はい      | jwtトークンの署名に使用する秘密鍵。秘密鍵を生成するには、`$ openssl genrsa -out jwtqs.pem 2048`を実行します。|
| SECRET_JWT_PUBLIC_KEY  | はい     | 署名の検証に使用する公開鍵です。署名を検証するための公開鍵を生成するには、`$ openssl rsa -in jwtqs.pem -pubout -out jwtqs.pub` を実行してください。 |
| SECRET_JWT_SD_API_PUBLIC_KEY | *none*  | JWTの署名の検証に使用する公開鍵。APIで設定したものと同じものを使用してください。 |

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

| キー       | デフォルト          | 説明 |
|:----------|:--------------------|:--------------------------------------------------------------------------------------|
| PORT      | 80                  | サービスが受けているポート |
| HOST      | 0.0.0.0             | サービスが立ち上がるホスト  (このマシンからの接続のみを受け入れるように localhost に設定)|
| URI       | http://localhost:80 | 外部ルーティング可能な URI (通常は、ロードバランサまたはCNAME) |
| HTTPD_TLS | false               | SSL サポート、SSLの場合は`false`。[`tls.createServer`](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)で必要なオプションをJSONオブジェクトに置き換えます。|


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

ビルド成果物の保存に関するいくつかの設定を行います。  



| キー                 | 必須 |  デフォルト | 説明|
|:--------------------|:---------------------|:----------------------|------------------------------|
| REDIS_HOST          | はい                  | 127.0.0.1            | Redis host                  |
| REDIS_PORT          | はい                 | 6379                 | Redis port                  |
| REDIS_PASSWORD      | はい                 | a-secure-password    | Redis password              |
| REDIS_TLS_ENABLED   | いいえ                   | false                | Redis tls enabled           |
| REDIS_DB_NUMBER     | いいえ                   | 0                    | Redis db number             |
| REDIS_QUEUE_PREFIX  | いいえ                   | ''                   | Redis queue prefix          |

# config/local.yaml
plugins:
  blockedBy:
    reenqueueWaitTime: 5
    blockTimeout: 180
    blockedBySelf: false
    collapse: false
