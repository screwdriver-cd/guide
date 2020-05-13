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

| キー | 必須 | 説明                                                                                           |
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

| キー       | デフォルト          | 説明 |
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

ビルド成果物の保存に関するいくつかの設定を行います。  


| キー                 | 必須 |  デフォルト | 説明|
|:--------------------|:---------------------|:----------------------|------------------------------|
| REDIS_HOST          | はい                  | 127.0.0.1            | Redis ホスト                  |
| REDIS_PORT          | はい                 | 6379                 | Redis ポート                 |
| REDIS_PASSWORD      | はい                 | a-secure-password    | Redis パスワード              |
| REDIS_TLS_ENABLED   | いいえ                   | false                | Redis tls 有効化           |
| REDIS_DB_NUMBER     | いいえ                   | 0                    | Redis db 番号             |
| REDIS_QUEUE_PREFIX  | いいえ                   | ''                   | Redis queue プレフィックス |

# config/local.yaml
```yaml
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
