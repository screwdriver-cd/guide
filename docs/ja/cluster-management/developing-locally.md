---
layout: main
title: ローカルで開発
category: Cluster Management
menu: menu_ja
toc:
    - title: ローカルで開発
      url: "#ローカルで開発"
      active: true
    - title: executor-queueとqueue-serviceを使用してローカルで開発
      url: "#executor-queueとqueue-serviceを使用してローカルで開発"

---
## ローカルで開発

### ステップ 1: sd.screwdriver.cd のドメインを hosts ファイル内の自分のIPにマップする
* 以下の行を /etc/hosts に加えます:

  ```
  127.0.0.1 sd.screwdriver.cd
  ```

### ステップ 2: 新しく Github OAuth アプリケーションを作成する
Settings > Developer settings > OAuth Apps へ行き、 `New OAuth App` ボタンをクリックして以下のように設定します:

* Application Name: (好きに記述してください)
* Homepage URL: `http://sd.screwdriver.cd:4200`
* Application description: (好きに記述してください)
* Authorization callback URL: `http://sd.screwdriver.cd:9001/v4/auth/login`

以下のスクリーンショットのようになります

![developing-locally-ouath](./../../cluster-management/assets/developing-locally-ouath.png)

> client ID と client Secret をメモしておいてください。後のステップで必要となります。

## ステップ 3: GitHub の screwdriver-cd の organization から必要なリポジトリをクローンする:
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

## ステップ 4: クローンしてきたリポジトリに local 設定ファイルを追加する
`local.js` というファイルを `ui/config` に、 `local.yaml` を `screwdriver/config`,`store/config`,`queue-service/config`フォルダに追加します。

### ui/config/local.js

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

### screwdriver/config/local.yaml
* ステップ2で作成した Github の OAuth アプリケーションのOAuth **client id** (oauthClientId) と OAuth **client secret**, (oauthClientSecret) を設定します。

* 以下のコマンドで、 **jwtPrivateKey** (jwtPrivateKey) と **jwtPublicKey** (jwtPublicKey) を生成します
    ```bash
    openssl genrsa -out jwt.pem 2048
    openssl rsa -in jwt.pem -pubout -out jwt.pub
    ```
* screwdriver リポジトリで、 `mkdir mw-data` を実行して "mw-data" フォルダを作成します

* `ifconfig` で最初に出てくる ip で YOUR_IP を設定します
> ロケーションが変わるので、この IP は更新する必要があります

```
auth:
    jwtPrivateKey: |
        -----BEGIN RSA PRIVATE KEY-----
        ********ここにキーを設定*******
        -----END RSA PRIVATE KEY-----

    jwtPublicKey: |
        -----BEGIN PUBLIC KEY-----
        *****ここにキーを設定*****
        -----END PUBLIC KEY-----

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

  # Externally routable URL for the Artifact Store
  store: http://YOUR_IP:9002

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

### store/config/local.yaml
* screwdriver リポジトリの `mw-data` と同じように、 `mkdir store-data` コマンドを実行して "store-data" フォルダを store リポジトリに作成します

```
auth:
    # A public key for verifying JWTs signed by api.screwdriver.cd
    jwtPublicKey: |
        -----BEGIN PUBLIC KEY-----
        *****ここにキーを設定*****
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

### ステップ 5: 依存関係をインストールすれば完了です！
各リポジトリで以下のコマンドを実行するだけです

```
npm install && npm run start
```

UI、 API、 Store が実行されている時に、 `http://sd.screwdriver.cd:4200` へブラウザでアスセスすることでローカルで稼働している Screwdriver へアクセスできます。

## executor-queueとqueue serviceを使用してローカルで開発

docker executor を使用する代わりに、 redis queue を使用することで、 `build_periodically` や `freezeWindow` などのより複雑な[ワークフロー](https://docs.screwdriver.cd/ja/user-guide/configuration/workflow)が screwdriver で実行できるようになります。

### ステップ 1: redis server と client をインストールする

> Mac のパッケージマネージャの [brew](https://brew.sh/) を使用するので、あらかじめ `brew` がローカルにインストールされている必要があります。

```bash
brew install redis
```

launchd を使用するために、 Redis を起動させて、ログイン時に再起動します:

```bash
brew services start redis
```

バックグラウンドサービスとして実行したくない/する必要がない場合には、単に起動させます:

```bash
redis-server /usr/local/etc/redis.conf
```

Redis server が起動しているか確認します。

```bash
redis-cli ping
```

“PONG” と返ってきたら準備完了です！

Redis の設定ファイルの場所です。パスワードを設定したいなら、 "requirepass" に変更を加えます。

```bash
/usr/local/etc/redis.conf
```

Redis とそのファイルをアンインストールします。

```bash
brew uninstall redis
rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

### ステップ 2: [queue-service](https://github.com/screwdriver-cd/queue-service) のリポジトリをクローンして、 default.yaml を変更します

```bash
git clone git@github.com:screwdriver-cd/queue-service.git
```

### queue-service/config/default.yaml

```yaml
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
        host: 127.0.0.1
        port: 6379
        options:
            password: 'a-secure-password'
            tls: false
        database: 0
        prefix: ""

```

### ステップ 3: screwdriver/config/local.yaml に変更を加え、 executor の設定を変更とキューURIを追加します。

```yaml
 ecosystem:
    # Externally routable URL for the User Interface
    ui: http://sd.screwdriver.cd:4200
    # Externally routable URL for the API
    api: http://$YOUR_IP:9001
    # Externally routable URL for the Artifact Store
    store: http://$YOUR_IP:9002
    # Routable URI of the queue service
    queue: http://$YOUR_IP:9003
 executor:
    plugin: queue # <- this step is essential in order to use queue
    queue: ''
```

これで screwdriver のバックエンドサーバとredis queueを使用する queue serviceを起動できます。


```bash
npm install && npm run start
```
