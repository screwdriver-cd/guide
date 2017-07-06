---
layout: main
title: Storeの設定
category: Cluster Management
menu: menu_ja
toc:
- title: Storeの管理
  url: "#storeの管理"
  active: 'true'
- title: パッケージ
  url: "#パッケージ"
- title: 設定
  url: "#設定"
- title: 認証
  url: "#認証"
- title: 配信
  url: "#配信"
- title: ビルドアーティファクト
  url: "#ビルドアーティファクト"
- title: ストレージ
  url: "#ストレージ"
---

## Storeの管理

## パッケージ

他のサービスと同様に、このAPIは80番ポートをexposeされた[Dockerイメージ](https://hub.docker.com/r/screwdrivercd/store/)を提供しています。

```bash
$ docker run -d -p 7000:80 screwdrivercd/store:stable
$ open http://localhost:7000
```

このDockerイメージはそのバージョン(例: `1.2.3`) や動的な`latest`・`stable`でタグ付けされています。特に理由がなければ`stable`または固定のバージョンタグを利用してください。

## 設定

Screwdriverは[ほとんどの設定がデフォルトとして設定](https://github.com/screwdriver-cd/store/blob/master/config/default.yaml)されていますが、これらは`config/local.yaml`や環境変数を利用して上書きすることができます。利用可能な環境変数は[こちら](https://github.com/screwdriver-cd/store/blob/master/config/custom-environment-variables.yaml)で定義されています。

### 認証

APIから渡されるJWTのバリデーションについて設定します。

キー | デフォルト | 説明
--- | --- | ---
SECRET_JWT_PUBLIC_KEY | *なし* | JWTの署名を検証するために使用される公開鍵。APIと同じものを設定します。

```yaml
# config/local.yaml
auth:
    jwtPublicKey: |
        PUBLIC KEY HERE
```

### 配信

サービスがどのようにトラフィックを受け付けるかを設定します。

キー | デフォルト | 説明
--- | --- | ---
PORT | 80 | listenするポート
HOST | 0.0.0.0 | listenするホスト(そのマシン上からの接続だけを受け付けるときだけlocalhostに設定)
URI | http://localhost:80 | 外部から接続可能なURI (通常はロードバランサーやCNAME)
HTTPD_TLS | false | SSLサポートの有無です。有効にする場合は`false`を[`tls.createServer`](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)に渡すJSONオブジェクトに置き換えてください。

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

### ビルドアーティファクト

ビルドアーティファクトの保存についての設定です。

キー | デフォルト | 説明
--- | --- | ---
BUILDS_EXPIRE_TIME | 1814400000 (3週間) | ビルドログが保存される期間
BUILDS_MAX_BYTES | 1073741824 (1GB) | ビルドアーティファクトへのアップロード上限サイズ

```yaml
# config/local.yaml
builds:
    expiresInSec: 1814400000 # 3 weeks
    maxByteSize: 1073741824 # 1GB
```

### ストレージ

現在、アーティファクトの保存には次の2つの方法があります。`memory` - インメモリストア（非効率・非永続）、 `s3` - Amazon S3

キー | デフォルト | 説明
--- | --- | ---
STRATEGY | memory | アーティファクトを保存する方法(memoryまたはs3)
S3_ACCESS_KEY_ID | *なし* | Amazonアクセスキー
S3_ACCESS_KEY_SECRET | *なし* | Amazonシークレットアクセスキー
S3_REGION | *なし* | Amazon S3 のリージョン
S3_BUCKET | *なし* | 書き込みアクセスを行うAmazon S3 のバケット
S3_ENDPOINT | *なし* | Amazon S3と互換性のある独自のエンドポイント

```yaml
# config/local.yaml
strategy:
    plugin: memory
    s3:
        accessKeyId: YOUR-KEY-ID
        secretAccessKey: YOUR-KEY-SECRET
        region: YOUR-REGION
        bucket: YOUR-BUCKET-ID
        endpoint: YOUR-S3-API-URL
```
