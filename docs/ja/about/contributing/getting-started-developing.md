---
layout: main
title: 開発を開始する
category: About
menu: menu_ja
toc:
    - title: 開発を開始する
      url: "#開発を開始する"
      active: true
    - title: ローカル開発
      url: "#ローカル開発"
    - title: executor-queueによるローカル開発
      url: "#executor-queueとqueue-serviceを使ったローカル開発"
    - title: カスタムlauncherによるローカル開発
      url: "#カスタムlauncherイメージでローカル開発"
---
# 開発を開始する

Screwdriver をローカルで実行してテストするために、ローカルの開発環境を構築するための方法が2つあります。

1. **Screwdriver の API と UI をローカルで起動させる** - npmパッケージの依存関係をテストしたり、ローカルでビルドを実行するのに最適です。
[ローカル開発](#ローカル開発)をご覧ください。
2. **SD-in-a-box を起動させる** - 手動設定なしでビルドを実行するのに最適です。[SD-in-a-boxのドキュメント](../../cluster-management/running-locally)をご覧ください。

## ローカル開発

### 事前準備

- [Node](https://nodejs.org/) v12.0.0またはそれ以上
- [Docker](https://www.docker.com/products/docker-desktop)

### ステップ1: hostsファイルでドメイン名sd.screwdriver.cdとあなたのipを関連付けます
* この行を/etc/hostsファイルに追加します。

```
 127.0.0.1 sd.screwdriver.cd
```

### ステップ2: GitHub OAuth アプリケーションの新規作成
設定 > 開発者設定 > OAuth Apps を開き　`New OAuth App` ボタンをクリックして以下のように設定します。  

* Application Name: (自分で選んでください)
* Homepage URL: `http://sd.screwdriver.cd:4200`
* Application description: (任意の値)
*  Authorization callback URL: `http://sd.screwdriver.cd:9001/v4/auth/login`

以下のスクリーンショットをご覧ください。  
![developing-locally-ouath](../../../cluster-management/assets/developing-locally-ouath.png)  

> 次のステップで必要になるため、client IDとclient Secretをメモしておいてください。

### ステップ3: screwdriver-cd組織のGitHubから必要なリポジトリをクローンします
* [ui](https://github.com/screwdriver-cd/ui)
* [screwdriver](https://github.com/screwdriver-cd/screwdriver)
* [store](https://github.com/screwdriver-cd/store)
* [queue-service](https://github.com/screwdriver-cd/queue-service)

```bash
git clone https://github.com/screwdriver-cd/ui.git
git clone https://github.com/screwdriver-cd/screwdriver.git
git clone https://github.com/screwdriver-cd/store.git
git clone https://github.com/screwdriver-cd/queue-service.git
```

### ステップ4: 以下3つのリポジトリにローカル設定ファイルを追加
`ui/config`に`local.js`, `screwdriver/config`に`local.yaml`, `queue-service/config`と`store/config`のフォルダに`local.yaml`ファイルを作成します。  

#### ui/config/local.js
```javascript
let SDAPI_HOSTNAME;
let SDSTORE_HOSTNAME;

SDAPI_HOSTNAME = 'http://sd.screwdriver.cd:9001';
SDSTORE_HOSTNAME = 'http://sd.screwdriver.cd:9002';
module.exports = {
  SDAPI_HOSTNAME,
  SDSTORE_HOSTNAME
};
```

#### screwdriver/config/local.yaml
* GitHubのOAuth **client Id** (oauthClientId)とOAuth **client Secret** (oauthClientSecret)を記入してください。
　(Step2で作成したOAuthアプリケーションに記載されています)
* 独自の**jwtPrivateKey** (jwtPrivateKey) と **jwtPublicKey** (jwtPublicKey)を以下の方法で生成します。
    ```bash
    openssl genrsa -out jwt.pem 2048
    openssl rsa -in jwt.pem -pubout -out jwt.pub
    ```
* `mkdir mw-data`と入力して、`mw-data`というフォルダをscrewdriverリポジトリ内に作成してください。
* あなたのIP(YOUR_IP)を記入してください。まずは、`ifconfig`であなたのIPを調べてください。
> IPが変更された場合、このIPを更新する必要があります。 

```
---
auth:
    jwtPrivateKey: |
        -----BEGIN RSA PRIVATE KEY-----
        *********SOME KEYS HERE********
        -----END RSA PRIVATE KEY-----
    jwtPublicKey: |
        -----BEGIN PUBLIC KEY-----
        ******SOME KEYS HERE******
        -----END PUBLIC KEY-----
```

```
httpd:
  # Port to listen on
  port: 9001
  # Host to listen on (set to localhost to only accept connections from this machine)
  host: 0.0.0.0

  # Externally routable URI (usually your load balancer or CNAME)
  # This requires to be a routable IP inside docker for executor, see
  # https://github.com/screwdriver-cd/screwdriver/blob/095eaf03e053991443abcbde91c62cfe06a28cba/lib/server.js#L141
  uri: http://YOUR_IP:9001

  ecosystem:
    # Externally routable URL for the User Interface
    ui: http://sd.screwdriver.cd:4200
    allowCors: ['http://sd.screwdriver.cd', 'http://YOUR_IP:9001']
    executor:
        plugin: docker
        docker:
            enabled: true
            options:
                 docker:
                    socketPath: "/var/run/docker.sock"
scms:
    github:
        plugin: github
        config:
            # github
            oauthClientId: your-oauth-client-id
            oauthClientSecret: your-oauth-client-secret
            secret: a-really-real-secret
            username: sd-buildbot
            email: dev-null@screwdriver.cd
            privateRepo: false
datastore:
  plugin: sequelize
  sequelize:
    # Type of server to talk to
    dialect: sqlite
    # Storage location for sqlite
    storage: ./mw-data/storage.db
```


#### store/config/local.yaml
* screwdriver リポジトリの `mw-data` ファイルと同様に、`mkdir store-data` を使用して store リポジトリ内に`store-data`というフォルダを作成する必要があります。

```
auth:
    # A public key for verifying JWTs signed by api.screwdriver.cd
    jwtPublicKey: |
        -----BEGIN PUBLIC KEY-----
        ******SOME KEYS HERE******
        -----END PUBLIC KEY-----

strategy:
    plugin: disk
    disk:
        cachePath: './store-data'
        cleanEvery: 3600000
        partition : 'cache'

httpd:
    port: 9002

ecosystem:
    # Externally routable URL for the User Interface
    ui: http://sd.screwdriver.cd:4200
    # Externally routable URL for the Artifact Store
    api: http://sd.screwdriver.cd:9001
    allowCors: ['http://sd.screwdriver.cd']
```

### ステップ5: 依存関係をインストールして、準備は完了です
各リポジトリ内で以下のコマンドを実行する必要があります。  

```
npm install && npm run start
```
UI、Screwdriver API、およびStoreアプリが動作している間に、ブラウザで`http://sd.screwdriver.cd:4200`にアクセスすることで、ローカルのScrewdriverとやり取りすることができます。  

## executor-queueとqueue-serviceを使ったローカル開発

単一のDockerエグゼキュータを使用する代わりに、Redisキューを使用することで、Screwdriverがより洗練された[ワークフロー](https://docs.screwdriver.cd/ja/user-guide/configuration/workflow)を実行できるようになります。例えば、`build_periodically`や`freezeWindow`などです。  

### ステップ1: Redis サーバーとクライアントのインストール

>  Macのパッケージマネージャーとして[brew](https://brew.sh/)を使用していますので、事前にローカルに`brew`をインストールしておく必要があります。

```bash
brew install redis
```

起動するには、今すぐRedisを起動し、ログイン時に再起動します。  

```bash
brew services start redis
```

また、バックグラウンドのサービスを必要としない場合、そのまま実行することもできます。  

```bash
redis-server /usr/local/etc/redis.conf
```

Redisサーバーが稼働しているかどうかをテストします。  

```bash
redis-cli ping
```

`PONG`と返ってくればOKです。  

Redisの設定ファイルの場所です。パスワードを設定したい場合は"requirepass"を修正してください。

```bash
/usr/local/etc/redis.conf
```

Redisとそのファイルをアンインストールします。

```bash
brew uninstall redis
rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

### ステップ2: リポジトリ[queue-service](https://github.com/screwdriver-cd/queue-service)をクローンし、local.yamlを追加します

```bash
git clone git@github.com:screwdriver-cd/queue-service.git
```
#### queue-service/config/local.yamlを作成します

ローカルの設定を保存するためにこのファイルを作成します。  

* 独自の **jwtPrivateKey** (jwtPrivateKey) と **jwtPublicKey** (jwtPublicKey) を以下の方法で生成します。
    ```bash
    openssl genrsa -out jwt-qs.pem 2048
    openssl rsa -in jwt-qs.pem -pubout -out jwt-qs.pub
    ```

```yaml
auth:
  jwtPrivateKey: |
    # paste jwt-qs.pem from previous step
  jwtPublicKey: |
    # paste  jwt-qs.pub from previous step
  # The public key used for verifying the signature of token from SD api
  jwtSDApiPublicKey: |
    # API Public Key generated in earlier step
 httpd:
  port: 9003
  host: 0.0.0.0
  uri: http://YOUR_IP:9003
 executor:
    plugin: docker
    docker:
      enabled: true
      options:
        docker:
            socketPath: "/var/run/docker.sock"
 ecosystem:
    # Externally routable URL for the User Interface
    ui: http://sd.screwdriver.cd:4200
    # Externally routable URL for the API
    api: http://$YOUR_IP:9001
    # Externally routable URL for the Artifact Store
    store: http://$YOUR_IP:9002
 queue:
    # Configuration of the redis instance containing resque
    redisConnection:
        host: "127.0.0.1"
        port: 6379
        options:
            password: ''
            tls: false
        database: 0
        prefix: ""
```

### ステップ3: screwdriver/config/local.yamlを修正、executorの構成を変更し、キューのURIを追加します。

```yaml
 auth:
    jwtQueueServicePublicKey: |
      # paste jwt-qs.pub from previous step
 ecosystem:
    # Externally routable URL for the User Interface
    ui: http://sd.screwdriver.cd:4200
    # Externally routable URL for the Artifact Store
    store: http://$YOUR_IP:9002
    # Routable URI of the queue service
    queue: http://$YOUR_IP:9003
 executor:
    plugin: queue # <- this step is essential in order to use queue
    queue:
        options:
            # Configuration of the redis instance containing resque
            redisConnection:
                host: "127.0.0.1"
                port: 6379
                options:
                    password: ''
                    tls: false
                database: 0
                prefix: ""
```

ここで、Redisキューを使用するために、Screwdriverバックエンド・サーバーとキュー・サービスを起動します。  

```bash
npm install && npm run start
```

## カスタムlauncherイメージでローカル開発

### 独自のlauncherバイナリとイメージの作成

```bash
git clone git@github.com:screwdriver-cd/launcher.git
cd launcher
env GOOS=linux GOARCH=arm go build .
docker build . -f Dockerfile.local
# let x be the IMAGE ID. You need to be signed in to your Docker account in Docker app
docker tag X jithine/launcher:dev
docker push jithine/launcher:dev
```

### API locol.yamlを変更して、ローカルのlauncherを使用する
```yaml
 executor:
    plugin: docker
    docker:
      enabled: true
      options:
        launchImage: jithine/launcher
        launchVersion: dev
        docker:
            socketPath: "/var/run/docker.sock"
```
