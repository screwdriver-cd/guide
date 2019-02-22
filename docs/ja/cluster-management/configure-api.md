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
JWT_ENVIRONMENT | いいえ | JWT を生成する環境です。例えば `prod` や `beta` などを指定します。JWT に環境変数を含めたくないのであれば、この環境変数は設定しないでください。(`''`のような設定もしないでください)
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
        - github:batman
        - github:robin
    admins:
        - github:batman
```

### Bookend Plugins

ビルド中に使用されるブックエンドプラグインを設定できます。デフォルトでは`scm`が有効になっており、SCMのcheckoutコマンドでビルドを開始します。

もしご自身で開発したブックエンドを使用したい場合は[こちら](#extending-the-docker-container)をご覧ください。

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

#### カバレッジ bookend

現在のところ、[SonarQube](https://github.com/screwdriver-cd/coverage-sonar) をカバレッジ bookend としてサポートしています。

##### Sonar

クラスタ内で Sonar を使用するには、Sonar サーバをセットアップする必要があります([sonar パイプライン](https://github.com/screwdriver-cd/sonar-pipeline)に例があります)。その後、次の環境変数を設定します。

| キー | 必須 | 説明 |
|:----------------|:---------|:----------------------|
| COVERAGE_PLUGIN | はい | `sonar` としてください |
| URI | はい | Screwdriver の API の URI |
| COVERAGE_SONAR_HOST | はい | Sonar の host の URL |
| COVERAGE_SONAR_ADMIN_TOKEN | はい | Sonar の admin token |

更に `screwdriver-artifact-bookend` に加えて、`screwdriver-coverage-bookend` も `BOOKENDS_TEARDOWN` の環境変数に JSON フォーマットで teardown bookend として設定する必要があります。詳しくは、上の Bookend Plugins の節を見てください。

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

現在は[kubernetes](https://github.com/screwdriver-cd/executor-k8s) と [docker](http://github.com/screwdriver-cd/executor-docker) と [VMs in Kubernetes](https://github.com/screwdriver-cd/executor-k8s-vm) と [nomad](http://github.com/lgfausak/executor-nomad) と [Jenkins](https://github.com/screwdriver-cd/executor-jenkins) と [queue](https://github.com/screwdriver-cd/executor-queue) executor をサポートしています。
詳しくは [custom-environment-variables](https://github.com/screwdriver-cd/screwdriver/blob/master/config/custom-environment-variables.yaml) をご覧ください。

#### Kubernetes (k8s)

下記の環境変数を設定します。

環境変数名 | デフォルト値 | 説明
--- | --- | ---
EXECUTOR_PLUGIN | k8s | デフォルトの Executor (例: `k8s`, `docker`, `k8s-vm`, `nomad`, `jenkins` or `queue`)
LAUNCH_VERSION | stable | 使用する Launcher のバージョン
EXECUTOR_PREFIX | なし | Pod 名につけられる prefix
EXECUTOR_K8S_ENABLED | true | Kubernetes executor を利用可能にするフラグ
K8S_HOST | kubernetes.default | Kubernetes のホスト
K8S_TOKEN | デフォルトでは `/var/run/secrets/kubernetes.io/serviceaccount/token` から読まれます | Kubernetes のリクエストを認証するためのJWT
K8S_JOBS_NAMESPACE | default | Kubernetes ジョブ用ネームスペース
K8S_CPU_MICRO | 0.5 | micro 時の CPU のコア数
K8S_CPU_LOW | 2 | low 時の CPU のコア数
K8S_CPU_HIGH | 6 | high 時の CPU のコア数
K8S_CPU_TURBO | 12 | turbo 時の CPU のコア数
K8S_MEMORY_MICRO | 1 | micro 時のメモリ数(GB)
K8S_MEMORY_LOW | 2 | low 時のメモリ数(GB)
K8S_MEMORY_HIGH | 12 | high 時のメモリ数(GB)
K8S_MEMORY_TURBO | 16 | turbo 時のメモリ数(GB)
K8S_BUILD_TIMEOUT | 90 | クラスタ内の全てのビルドのデフォルトのタイムアウト時間(分)
K8S_MAX_BUILD_TIMEOUT | 120 | クラスタ内の全てのビルドでユーザが設定可能な最大のタイムアウト時間(分)
K8S_NODE_SELECTORS | `{}` | pod のスケジューリング用の k8s の node selector (フォーマット `{ label: 'value' }`) https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#step-one-attach-label-to-the-node
K8S_PREFERRED_NODE_SELECTORS | `{}`|  pod のスケジューリング用の k8s の node selector (フォーマット `{ label: 'value' }`) https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature |


```yaml
# config/local.yaml
executor:
    plugin: k8s
    k8s:
        options:
            kubernetes:
                # kubernetes クラスタのホストかIP
                host: YOUR-KUBERNETES-HOST
                token: JWT-FOR-AUTHENTICATING-KUBERNETES-REQUEST
                jobsNamespace: default
            launchVersion: stable
```

#### VMs in Kubernetes (k8s-vm)

`k8s-vm` executor を使用している場合には、ビルドは Kubernetes 上の Pod 内の VM で実行されます。

| 環境変数名 | デフォルト値 | 説明 |
|:-------------------|:--------------|:-------------------------------------------|
| EXECUTOR_PLUGIN | k8s | デフォルトの executor (`k8s-vm` を設定してください) |
| LAUNCH_VERSION | stable | 使用する Launcher のバージョン |
| EXECUTOR_PREFIX | なし | Pod 名につけられる prefix |
| EXECUTOR_K8SVM_ENABLED | true | Kubernetes VM executor を利用可能にするフラグ |
| K8S_HOST | kubernetes.default | Kubernetes のホスト |
| K8S_TOKEN | デフォルトでは `/var/run/secrets/kubernetes.io/serviceaccount/token` から読まれます | Kubernetes のリクエストを認証するためのJWT |
| K8S_JOBS_NAMESPACE | default | Kubernetes ジョブ用ネームスペース |
| K8S_BASE_IMAGE | なし | Kubernetes VM のベースイメージ |
| K8S_CPU_MICRO | 1 | micro 時の CPU のコア数 |
| K8S_CPU_LOW | 2 | low 時の CPU のコア数 |
| K8S_CPU_HIGH | 6 | high 時の CPU のコア数 |
| K8S_CPU_TURBO | 12 | turbo 時の CPU のコア数 |
| K8S_MEMORY_MICRO | 1 | micro 時のメモリ数(GB) |
| K8S_MEMORY_LOW | 2 | low 時のメモリ数(GB) |
| K8S_MEMORY_HIGH | 12 | high 時のメモリ数(GB) |
| K8S_MEMORY_TURBO | 16 | turbo 時のメモリ数(GB) |
| K8S_VM_BUILD_TIMEOUT | 90 | クラスタ内の全てのビルドのデフォルトのタイムアウト時間(分) |
| K8S_VM_MAX_BUILD_TIMEOUT | 120 | クラスタ内の全てのビルドでユーザが設定可能な最大のタイムアウト時間(分) |
| K8S_VM_NODE_SELECTORS | `{}` | pod のスケジューリング用の k8s の node selector (フォーマット `{ label: 'value' }`) https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#step-one-attach-label-to-the-node |
| K8S_VM_PREFERRED_NODE_SELECTORS | `{}` | pod のスケジューリング用の k8s の node selector (フォーマット `{ label: 'value' }`) https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature |

```yaml
# config/local.yaml
executor:
    plugin: k8s-vm
    k8s-vm:
        options:
            kubernetes:
                host: YOUR-KUBERNETES-HOST
                token: JWT-FOR-AUTHENTICATING-KUBERNETES-REQUEST
            launchVersion: stable
```

#### Jenkins (jenkins)
`jenkins` executor を使用している場合、ビルドは Jenkins を使用して実行されます。

| 環境変数名       | デフォルト値 | 説明          |
|:-----------------------|:--------------|:---------------------|
| EXECUTOR_PLUGIN        | k8s           | デフォルトの executor (`jenkins` を設定してください) |
| LAUNCH_VERSION         | stable        | 使用する Launcher のバージョン            |
| EXECUTOR_JENKINS_ENABLED | true        | Jenkins executor を利用可能にするフラグ    |
| EXECUTOR_JENKINS_HOST  |               | Jenkins のホスト |
| EXECUTOR_JENKINS_PORT  | 8080          | Jenkins のポート   |
| EXECUTOR_JENKINS_USERNAME | screwdriver | Jenkins の username |
| EXECUTOR_JENKINS_PASSWORD |            | Jenkins へのリクエストを認証するのに使用する password/token |
| EXECUTOR_JENKINS_NODE_LABEL | screwdriver | Jenkisn slave の Node label |
| EXECUTOR_JENKINS_DOCKER_COMPOSE_COMMAND | docker-compose | docker-compose コマンドのパス |
| EXECUTOR_JENKINS_DOCKER_PREFIX | `''`  | コンテナにつけられる prefix |
| EXECUTOR_JENKINS_LAUNCH_VERSION | stable | 使用する Launcher container のタグ |
| EXECUTOR_JENKINS_DOCKER_MEMORY | 4g    | メモリの制限 (docker run の `--memory` オプション) |
| EXECUTOR_JENKINS_DOCKER_MEMORY_LIMIT | 6g | swap を含めたメモリの制限 (docker run の `--memory-swap` オプション) |
| EXECUTOR_JENKINS_BUILD_SCRIPT | `''`   | ビルドを開始するコマンド |
| EXECUTOR_JENKINS_CLEANUP_SCRIPT | `''` | ビルドシステムをクリーンアップするコマンド |
| EXECUTOR_JENKINS_CLEANUP_TIME_LIMIT | 20 | ジョブを削除する時間(秒) |
| EXECUTOR_JENKINS_CLEANUP_WATCH_INTERVAL | 2 | ジョブが停止しているかチェックするインターバル（秒）

```yaml
# config/local.yaml
executor:
    plugin: jenkins
    jenkins:
        options:
            jenkins:
                host: jenkins.default
                port: 8080
                username: screwdriver
                password: YOUR-PASSWORD
            launchVersion: stable
```

#### Docker (docker)

Docker で実行するには `docker` executor を使用します。[sd-in-a-box](./running-locally) も Docker を使用して実行します。

環境変数名 | デフォルト値 | 説明
--- | --- | ---
EXECUTOR_PLUGIN | k8s | `docker` を指定します
LAUNCH_VERSION | stable | 使用する Launcher のバージョン
EXECUTOR_DOCKER_ENABLED | true | Docker executor を利用可能にするフラグ
EXECUTOR_DOCKER_DOCKER | `{}` | [Dockerode の設定](https://www.npmjs.com/package/dockerode#getting-started) (JSONオブジェクト)
EXECUTOR_PREFIX | なし | Pod 名につけられる prefix 

```yaml
# config/local.yaml
executor:
    plugin: docker
    docker:
        options:
            docker:
                socketPath: /var/lib/docker.sock
            launchVersion: stable
```

#### Queue (queue)
`queue` executor を使用すると、Resque のある Redis インスタンスを使用してビルドをキューすることができます。

| 環境変数名       | デフォルト値 | 説明          |
|:-----------------------|:--------------|:---------------------|
| EXECUTOR_PLUGIN        | k8s           | デフォルトの executor (`queue` を設定します) |
| QUEUE_REDIS_HOST       | 127.0.0.1     | Redis のホスト                       |
| QUEUE_REDIS_PORT       | 9999          | Redis のポート                       |
| QUEUE_REDIS_PASSWORD   | "THIS-IS-A-PASSWORD" | Redis のパスワード            |
| QUEUE_REDIS_TLS_ENABLED | false        | TLS を有効にするフラグ                 |
| QUEUE_REDIS_DATABASE   | 0             | Redis のデータベース                   |

```yaml
# config/local.yaml
executor:
    plugin: queue
    queue:
        options:
            redisConnection:
              host: "127.0.0.1"
              port: 9999
              options:
                  password: "THIS-IS-A-PASSWORD"
                  tls: false
              database: 0
```

#### Nomad (nomad)
以下の環境変数を設定します。

| 環境変数名       | デフォルト値 | 説明                                 |
|:-----------------------|:--------------|:--------------------------------------------|
| EXECUTOR_PLUGIN        | k8s         | デフォルトの executor (`nomad` を設定してください)  |
| LAUNCH_VERSION         | latest        | 使用する Launcher のバージョン                     |
| EXECUTOR_NOMAD_ENABLED | true          | Nomad executor を利用可能にするフラグ              |
| NOMAD_HOST             | nomad.default | Nomad のホスト (例: http://192.168.30.30:4646) |
| NOMAD_CPU              | 600           | Nomad の cpu リソース(Mhz)                   |
| NOMAD_MEMORY           | 4096          | Nomad のメモリリソース(MB)                 |
| EXECUTOR_PREFIX        | sd-build-     | Nomad のジョブ名につけられる prefix                       |

```yaml
# config/local.yaml
executor:
    plugin: nomad
    nomad:
        options:
            nomad:
                host: http://192.168.30.30:4646
            resources:
                cpu:
                    high: 600
                memory:
                    high: 4096
            launchVersion:  latest
            prefix:  'sd-build-'
```

### 通知プラグイン

現在、[Email 通知](https://github.com/screwdriver-cd/notifications-email)と [Slack 通知](https://github.com/screwdriver-cd/notifications-slack)をサポートしています。

#### Email 通知

SMTPサーバとEmail通知を行う送信者のアドレスを設定します。

```yaml
# config/local.yaml
notifications:
    email:
        username: your-username # オプション SMTP username
        password: your-password # オプション SMTP password
        host: smtp.yourhost.com
        port: 25
        from: example@email.com
```

認証の設定はまだ実装されていませんが、追加することは難しくないでしょう。私たちは [nodemailer](https://nodemailer.com/about/) パッケージを使用しているため、認証機能はよくある nodemailer のセットアップと同様です。コントリビューションお待ちしています: [screwdriver-cd/notifications-email](https://github.com/screwdriver-cd/notifications-email)

#### Slack 通知

Slack インスタンスに `screwdriver-bot` の [Slack bot user](https://api.slack.com/bot-users) を作成してください。 bot のための Slack トークンを生成して、それを Slack 通知の設定欄の `token` に設定してください。

```yaml
# config/local.yaml
notifications:
    slack:
        token: 'YOUR-SLACK-USER-TOKEN-HERE'
```

#### カスタム通知

[notifications-base](https://github.com/screwdriver-cd/notifications-base) を利用することで、カスタム通知パッケージを作成することができます。パッケージ名は `screwdriver-notifications-<your-notification>` の形である必要があります。

下記はEmail通知とカスタム通知を同時に使う場合の `local.yaml` の設定例です:

```yaml
# config/local.yaml
notifications:
    email:
        host: smtp.yourhost.com
        port: 25
        from: example@email.com
    your-notification:
        foo: bar
        abc: 123
```

もし [scoped package](https://docs.npmjs.com/misc/scope) を使用したい場合は、設定は以下のようになります:

```yaml
# config/local.yaml
notifications:
    your-notification:
        config:
            foo: bar
            abc: 123
        scopedPackage: '@scope/screwdriver-notifications-your-notification'
```

### ソース管理プラグイン

現在は[GithubとGitHub Enterprise](https://github.com/screwdriver-cd/scm-github)、 [Bitbucket.org](https://github.com/screwdriver-cd/scm-bitbucket)と[Gitlab](https://github.com/bdangit/scm-gitlab)をサポートしています。

#### ステップ1: OAuthアプリケーションをセットアップ

OAuthアプリケーションのセットアップと、OAuth Client ID及びSecretの取得が必要です。

##### Github:

1. [Github OAuth applications](https://github.com/settings/developers) ページを開きます。
2. 作成したアプリケーションをクリックし、OAuth Client IDとSecretを取得します。
3. APIが動作しているホストのIPアドレスを`Homepage URL` と`Authorization callback URL`に入力します。

##### Bitbucket.org:

1. Bitbucket OAuth applications ページを開きます: [https://bitbucket.org/account/user/{your-username}/api](https://bitbucket.org/account/user/%7Byour-username%7D/api)
2. `Add Consumer`をクリックします。
3. APIが動作しているホストのIPアドレスを`URL` と `Callback URL` に入力します。

#### ステップ2:SCMプラグインの設定

下記の環境変数を設定します。

環境変数名 | 必須 | デフォルト値 | 説明
--- | --- | --- | ---
SCM_SETTINGS | はい | {} | JSON object with SCM settings

##### Github:

```yaml
# config/local.yaml
scms:
    github:
        plugin: github
        config:
            oauthClientId: YOU-PROBABLY-WANT-SOMETHING-HERE # OAuth Client ID (アプリケーションキー)
            oauthClientSecret: AGAIN-SOMETHING-HERE-IS-USEFUL # OAuth Client Secret (アプリケーションsecret)
            secret: SUPER-SECRET-SIGNING-THING # webhooks署名用のパスワード(secret)
            gheHost: github.screwdriver.cd # [Optional] Github Enterpriseの場合のGHEホスト
            username: sd-buildbot # [Optional] checkoutするユーザネーム
            email: dev-null@screwdriver.cd # [Optional] checkoutするユーザのEmailアドレス
            commentUserToken: A_BOT_GITHUB_PERSONAL_ACCESS_TOKEN # [Optional] GithubでPRにコメントを書き込むためのトークン、"public_repo"のスコープが必要
            privateRepo: false # [Optional] プライベートレポジトリの read/write権限
```

プライベートレポジトリを使用する場合は、`SCM_USERNAME` と `SCM_ACCESS_TOKEN` を [secrets](../../user-guide/configuration/secrets) として `screwdriver.yaml`に記述する必要があります。

[メタPRコメント](../user-guide/metadata.md)を有効にするためには、Git上でbotユーザを作成し、そのユーザで`public_repo`のスコープを持ったトークンを作成する必要があります。Githubでは、新規にユーザを作成します。[create a personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line)の説明に従ってスコープを`public_repo`に設定します。このトークンをコピーして[API config yaml](https://github.com/screwdriver-cd/screwdriver/blob/master/config/custom-environment-variables.yaml#L268-L269)内の`scms`の設定内の`commentUserToken`として設定します。

##### Bitbucket.org

```yaml
# config/local.yaml
scms:
    bitbucket:
        plugin: bitbucket
        config:
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
