---
layout: main
title: APIの管理
category: Cluster Management
menu: menu_ja
toc:
- title: APIの管理
  url: "#apiの管理"
  active: 'true'
- title: パッケージ
  url: "#パッケージ"
- title: 設定
  url: "#設定"
- title: Dockerコンテナの拡張
  url: "#dockerコンテナの拡張"
---

# APIの管理

## パッケージ

他のサービスのように、APIは8080番ポートをexposeした[Dockerイメージ](https://hub.docker.com/r/screwdrivercd/screwdriver/)を提供しています。

```bash
$ docker run -d -p 9000:8080 screwdrivercd/screwdriver:stable
$ open http://localhost:9000
```

このDockerイメージはそのバージョン(例: `1.2.3`)や動的な`latest`・ `stable`でタグ付けされています。特に理由がなければ`stable`または固定のバージョンタグを利用してください。

## 設定

Screwdriverは最初から[多くのデフォルト設定](https://github.com/screwdriver-cd/screwdriver/blob/master/config/default.yaml)がされていますが、`config/local.yaml` や環境変数を使うことでデフォルト設定を上書きできます。設定できる全ての環境変数は[こちらに定義](https://github.com/screwdriver-cd/screwdriver/blob/master/config/custom-environment-variables.yaml)されています。

### 認証 / 認可

誰がAPIにアクセスでき、何ができるかを設定します。

キー | 必須 | 説明
--- | --- | ---
SECRET_JWT_PRIVATE_KEY | はい | JWTに署名するための秘密鍵です。次のコマンドにより生成できます。`$ openssl genrsa -out jwt.pem 2048`
SECRET_JWT_PUBLIC_KEY | はい | 署名を検証するための公開鍵です。次のコマンドにより生成できます。`$ openssl rsa -in jwt.pem -pubout -out jwt.pub`
SECRET_COOKIE_PASSWORD | はい | セッションデータを暗号化するためのパスワードです。**32文字以上である必要があります。**
SECRET_PASSWORD | はい | SECRETを暗号化するためのパスワードです。**32文字以上である必要があります。**
IS_HTTPS | いいえ | サーバーがhttpsで動作しているかどうかを設定するフラグです。OAuthフローのフラグとして利用されます。(デフォルトは`false`です)
SECRET_WHITELIST | いいえ | システムに対して認証できるユーザのホワイトリストです。空の場合は全ユーザを許可します。(JSONの配列形式)
SECRET_ADMINS | いいえ | システムに対して認証できるユーザのホワイトリストです。空の場合は全ユーザを許可します。(JSONの配列形式)

```yaml
# config/local.yaml
auth:
    jwtPrivateKey: |
        PRIVATE KEY HERE
    jwtPublicKey: |
        PUBLIC KEY HERE
    cookiePassword: 975452d6554228b581bf34197bcb4e0a08622e24
    encryptionPassword: 5c6d9edc3a951cda763f650235cfc41a3fc23fe8
    https: false
    whitelist:
        - batman
        - robin
    admins:
        - batman
```

### Bookend Plugins

ビルド中に使用されるブックエンドプラグインを設定できます。デフォルトでは`scm`が有効になっており、SCMのcheckoutコマンドでビルドを開始します。

で開発したブックエンドを使用したい場合は[こちら](#docker%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E3%81%AE%E6%8B%A1%E5%BC%B5)をご覧ください。

キー | デフォルト | 説明
--- | --- | ---
BOOKENDS_SETUP | None | ビルドの最初に実行されるプラグインの順番付きリストです。以下の書式で記述します。 `'["first", "second", ...]'`
BOOKENDS_TEARDOWN | None | ビルドの終わりに実行されるプラグインの順番付きリストです。以下の書式で記述します。`'["first", "second", ...]'`

```yaml
# config/local.yaml
bookends:
    setup:
        - scm
        - my-custom-bookend
```

### 配信

サービスがどのようにトラフィックを受け付けるかを設定します。

キー | デフォルト | 説明
--- | --- | ---
PORT | 80 | listenするポート
HOST | 0.0.0.0 | listenするホスト（そのマシン上からの接続だけを受け付けるときだけlocalhostに設定）
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

### エコシステム

外部からアクセス可能なUI、アーティファクトストア、バッジサービスのURLを指定します。

キー | デフォルト | 説明
--- | --- | ---
ECOSYSTEM_UI | https://cd.screwdriver.cd | ユーザーインターフェースのURL
ECOSYSTEM_STORE | https://store.screwdriver.cd | アーティファクトストアURL
ECOSYSTEM_BADGES | https://img.shields.io/badge/build-{{status}}-{{color}}.svg | ステータステキストと色をテンプレートにしたURL

```yaml
# config/local.yaml
ecosystem:
    # Externally routable URL for the User Interface
    ui: https://cd.screwdriver.cd
    # Externally routable URL for the Artifact Store
    store: https://store.screwdriver.cd
    # Badge service (needs to add a status and color)
    badges: https://img.shields.io/badge/build-{{status}}-{{color}}.svg
```

### データストアプラグイン

Postgres, MySQL, や Sqlite を使用するには[sequelize](https://github.com/screwdriver-cd/datastore-sequelize)プラグインを使用します。

#### Sequelize

下記の環境変数を設定します。

環境変数名 | 必須 | デフォルト値 | 説明
--- | --- | --- | ---
DATASTORE_PLUGIN | はい |  | `sequelize`を指定
DATASTORE_SEQUELIZE_DIALECT | いいえ | mysql | `sqlite`, `postgres`, `mysql`, または `mssql` が指定可能
DATASTORE_SEQUELIZE_DATABASE | いいえ | screwdriver | データベース名
DATASTORE_SEQUELIZE_USERNAME | sqliteでは不要 |  | ログインユーザー名
DATASTORE_SEQUELIZE_PASSWORD | sqliteでは不要 |  | ログインパスワード
DATASTORE_SEQUELIZE_STORAGE | sqliteのみ必要 |  | sqliteのストレージの場所
DATASTORE_SEQUELIZE_HOST | いいえ |  | ネットワークホスト
DATASTORE_SEQUELIZE_PORT | いいえ |  | ネットワークホスト

```yaml
# config/local.yaml
datastore:
    plugin: sequelize
    sequelize:
        dialect: TYPE-OF-SERVER
        storage: STORAGE-LOCATION
        database: DATABASE-NAME
        username: DATABASE-USERNAME
        password: DATABASE-PASSWORD
        host: NETWORK-HOST
        port: NETWORK-PORT
```

### Executorプラグイン

現在は[kubernetes](https://github.com/screwdriver-cd/executor-k8s) と [docker](http://github.com/screwdriver-cd/executor-docker) executor をサポートしています。

#### Kubernetes

下記の環境変数を設定します。

環境変数名 | デフォルト値 | 説明
--- | --- | ---
EXECUTOR_PLUGIN |  | `k8s`を設定します
LAUNCH_VERSION |  | 使用するLauncherのバージョン
K8S_HOST |  | Kubernetesのホスト
K8S_TOKEN |  | Kubernetesのリクエストを認証するためのJWT
K8S_JOBS_NAMESPACE | default | Kubernetesジョブ用ネームスペース

```yaml
# config/local.yaml
executor:
    plugin: k8s
    k8s:
        kubernetes:
            # The host or IP of the kubernetes cluster
            host: YOUR-KUBERNETES-HOST
            token: JWT-FOR-AUTHENTICATING-KUBERNETES-REQUEST
            jobsNamespace: default
        launchVersion: stable
```

#### Docker

下記の環境変数を設定します。

環境変数名 | デフォルト値 | 説明
--- | --- | ---
EXECUTOR_PLUGIN | docker | `docker`を指定します
LAUNCH_VERSION | stable | 使用するLauncherのバージョン
EXECUTOR_DOCKER_DOCKER | `{}` | [Dockerode の設定](https://www.npmjs.com/package/dockerode#getting-started) (JSONオブジェクト)

```yaml
# config/local.yaml
executor:
    plugin: docker
    docker:
        docker:
            socketPath: /var/lib/docker.sock
        launchVersion: stable
```

### Email通知

SMTPサーバとEmail通知を行う送信者のアドレスを設定します。

```yaml
# config/local.yaml
notifications:
    email:
        host: smtp.yourhost.com
        port: 25
        from: example@email.com
```

認証の設定はまだ実装されていませんが、追加することは難しくないでしょう。我々は<a href="https://nodemailer.com/about/">nodemailer</a>パッケージを使用しているため、認証機能はよくあるnodemailerのセットアップと同様です。コントリビューションお待ちしています:<a href="https://github.com/screwdriver-cd/notifications-email">https://github.com/screwdriver-cd/notifications-email</a>

### ソース管理プラグイン

現在は[Github](https://github.com/screwdriver-cd/scm-github) と [Bitbucket.org](https://github.com/screwdriver-cd/scm-bitbucket)をサポートしています。

#### ステップ1: OAuthアプリケーションをセットアップ

OAuthアプリケーションのセットアップと、OAuth Client ID及びSecretの取得が必要です。

##### Github:

1. [Github OAuth applications](https://github.com/settings/developers) ページを開きます。
2. 作成したアプリケーションをクリックし、OAuth Client IDとSecretを取得します。
3. APIが動作しているホストのIPアドレスを`Homepage URL` と`Authorization callback URL`に入力します。

##### Bitbucket.org:

1. Navigate to the Bitbucket OAuth applications: [https://bitbucket.org/account/user/{your-username}/api](https://bitbucket.org/account/user/%7Byour-username%7D/api)
2. `Add Consumer`をクリックします。
3. APIが動作しているホストのIPアドレスを`URL` と `Callback URL` に入力します。

#### ステップ2:SCMプラグインの設定

下記の環境変数を設定します。

環境変数名 | 必須 | デフォルト値 | 説明
--- | --- | --- | ---
SCM_PLUGIN | いいえ | github | `github` または `bitbucket`
SECRET_OAUTH_CLIENT_ID | はい |  | OAuth Client ID (アプリケーションキー)
SECRET_OAUTH_CLIENT_SECRET | はい |  | OAuth Client Secret (アプリケーションsecret)
WEBHOOK_GITHUB_SECRET | Githubでは必須 |  | webhooks署名用のパスワード(secret)
SCM_GITHUB_GHE_HOST | Github Enterpriseでは必須 |  | Github Enterpriseの場合のGHEホスト
SCM_PRIVATE_REPO_SUPPORT | いいえ | false | プライベートレポジトリの read/write権限
SCM_USERNAME | いいえ | sd-buildbot | checkoutするユーザネーム
SCM_EMAIL | いいえ | dev-null@screwdriver.cd | checkoutするユーザのEmailアドレス

##### Github:

```yaml
# config/local.yaml
scm:
    plugin: github
    github:
        oauthClientId: YOUR-OAUTH-CLIENT-ID
        oauthClientSecret: YOUR-OAUTH-CLIENT-SECRET
        # Secret to add to GitHub webhooks so that we can validate them
        secret: SUPER-SECRET-SIGNING-THING
        # You can also configure for use with GitHub enterprise
        # gheHost: github.screwdriver.cd
        # Whether to support private repo
        # privateRepo: true
```

プライベートレポジトリを使用する場合は、`SCM_USERNAME` と `SCM_ACCESS_TOKEN` を [secrets](../../user-guide/configuration/secrets) として `screwdriver.yaml`に記述する必要があります。

##### Bitbucket.org

```yaml
# config/local.yaml
scm:
    plugin: bitbucket
    bitbucket:
        oauthClientId: YOUR-APP-KEY
        oauthClientSecret: YOUR-APP-SECRET
```

## Dockerコンテナの拡張

Screwdriver.cdのDockerイメージを拡張したい場合は、カスタムBookendプラグインを使用してください。この章で全てをお伝えすることはできないですが、基本的な利用方法はお伝えできるでしょう。

### カスタムbookendを使用する

Screwdriver.cdのDokcerイメージを拡張したい場合、カスタムbookendが使用できます。

今回の例では、カスタムbookendを`scm`の前に実行します (設定されたSCMからコードをチェックアウトします)。bookendプラグインも環境変数で設定できるのですが、`local.yaml`を使って設定していきます。

以下に`local.yaml`の例を示します。

```yaml
# local.yaml
---
  ...
bookends:
  setup:
    - my-custom-bookend
    - scm
```

拡張したDockerイメージをビルドするために、追加の依存をインストールする`Dockerfile`の作成が必要です。もし`local.yaml`を後でマウントするのではなくDockerイメージに保存したければ、以下のようにDockerfileを作成してください。

```dockerfile
# Dockerfile
FROM screwdrivercd/screwdriver:stable
# Install additional NPM bookend plugin
RUN cd /usr/src/app && /usr/local/bin/npm install my-custom-bookend
# Optionally save the configuration file in the image
ADD local.yaml /config/local.yaml
```

Dockerイメージをビルドしたら、Screwdriver.cdのクラスタにデプロイする必要があります。例えば、Kubernetesを使用している場合は、`screwdrivercd/api:stable`を作成したDockerイメージで置き換えます。

以下は、Kubernetesのデプロイ設定を更新する例です。

```yaml
# partial Kubernetes configuration
  ...
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: screwdriver-api
        # The image name is the one you specified when built
        # The tag name is the tag you specified when built
        image: my_extended_docker_image_name:tag_name
```
