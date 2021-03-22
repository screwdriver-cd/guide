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
- title: 認証 / 認可
  url: "#認証--認可"
  subitem: true
- title: ビルド変数
  url: "#ビルド変数"
  subitem: true
- title: ブックエンドプラグイン
  url: "#ブックエンドプラグイン"
  subitem: true
- title: 配信
  url: "#配信"
  subitem: true
- title: エコシステム
  url: "#エコシステム"
  subitem: true
- title: データストア
  url: "#データストアプラグイン"
  subitem: true
- title: Executors
  url: "#executorプラグイン"
  subitem: true
- title: 通知
  url: "#通知プラグイン"
  subitem: true
- title: ソース管理
  url: "#ソース管理プラグイン"
  subitem: true
- title: Webhooks
  url: "#webhooks"
  subitem: true
- title: レートリミット
  url: "#レートリミット"
  subitem: true
- title: Canaryルーティング
  url: "#canaryルーティング"
  subitem: true
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
SECRET_JWT_QUEUE_SVC_PUBLIC_KEY | はい | プラグインがキューの場合に署名を検証するための公開鍵です。次のコマンドにより生成できます。 `$ openssl rsa -in jwtqs.pem -pubout -out jwtqs.pub`
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
    jwtQueueServicePublicKey: |
        QUEUE SVC PUBLIC KEY HERE
    cookiePassword: 975452d6554228b581bf34197bcb4e0a08622e24
    encryptionPassword: 5c6d9edc3a951cda763f650235cfc41a3fc23fe8
    https: false
    whitelist:
        - github:batman
        - github:robin
    admins:
        - github:batman
```
### マルチビルドクラスター
デフォルトでは、[build cluster機能](../configure-buildcluster-queue-worker)はオフになっています。

| キー | デフォルト | 説明 |
|:----|:-------|:------------|
| MULTI_BUILD_CLUSTER_ENABLED | `false` | ビルドクラスターがオンかオフか。 オプション: `true` または `false` |

```yaml
# config/local.yaml
multiBuildCluster:
    enabled: true
```

### ビルド変数

#### 環境変数
クラスタ内の全てのビルドに対して環境変数を事前設定できます。デフォルトでは`{ SD_VERSION: 4 }`が設定されています。

| キー | デフォルト | 説明 |
|:----|:-------|:------------|
| CLUSTER_ENVIRONMENT_VARIABLES | `{ SD_VERSION: 4 }` | ビルドのデフォルト環境変数です。例: `{ SD_VERSION: 4, SCM_CLONE_TYPE: "ssh" }` |

#### リモートジョイン
デフォルトでは、[リモートジョイン機能](../user-guide/configuration/workflow#リモートジョイン)は無効になっています。

| キー | デフォルト | 説明 |
|:----|:-------|:------------|
| EXTERNAL_JOIN | `false` | リモートジョイン機能が有効か無効か。 設定値: `true` または `false` |

 ```yaml
# config/local.yaml
build:
    environment: CLUSTER-ENV-IN-JSON-FORMAT
    externalJoin: true
```

### ブックエンドプラグイン

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
| COVERAGE_PLUGIN_DEFAULT_ENABLED | いいえ | coverage-bookend がカバレッジスキャンをデフォルトで実行するかどうか。 デフォルト `true` |
| URI | はい | Screwdriver の API の URI |
| ECOSYSTEM_UI | はい | Screwdriver の UI の URL |
| COVERAGE_SONAR_HOST | はい | Sonar の host の URL |
| COVERAGE_SONAR_ADMIN_TOKEN | はい | Sonar の admin token |
| COVERAGE_SONAR_ENTERPRISE | いいえ | SonarQube を Enterprise 版で利用している(true)か、OpenSourceEdition で利用している(false）か。デフォルト値は `false` |
| COVERAGE_SONAR_GIT_APP_NAME | いいえ | SonarのPull Request DecorationのためのGithub app名。デフォルト値は `Screwdriver Sonar PR Checks` です。この機能にはSonar Enterprise Editionが必要です。詳細は[Sonarのドキュメント](https://docs.sonarqube.org/latest/analysis/pr-decoration)をご覧ください。

更に `screwdriver-artifact-bookend` に加えて、`screwdriver-coverage-bookend` も `BOOKENDS_TEARDOWN` の環境変数に JSON フォーマットで teardown bookend として設定する必要があります。詳しくは、上の Bookend Plugins の節を見てください。SonarQube の Enterprise 版を利用している場合には、 SonarQube のプロジェクトキーや名前はデフォルトでは _パイプライン_ スコープになります。これにより、 PR 解析が使えるようになったり、 Screwdriver のジョブ毎に個別のプロジェクトが作成されることを防げます。Enterprise 版の SonarQube を使用していない場合、SonarQube のプロジェクトキーや名前はデフォルトでは _ジョブ_ スコープになります。

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
ECOSYSTEM_UI | <https://cd.screwdriver.cd> | ユーザーインターフェースのURL
ECOSYSTEM_STORE | <https://store.screwdriver.cd> | アーティファクトストアURL
ECOSYSTEM_BADGES | <https://img.shields.io/badge/build-{{status}}-{{color}}.svg> | ステータステキストと色をテンプレートにしたURL
ECOSYSTEM_QUEUE | <http://sdqueuesvc.screwdriver.svc.cluster.local> | キュープラグインで使用されるキューサービスの内部URL

```yaml
# config/local.yaml
ecosystem:
    # Externally routable URL for the User Interface
    ui: https://cd.screwdriver.cd
    # Externally routable URL for the Artifact Store
    store: https://store.screwdriver.cd
    # Badge service (needs to add a status and color)
    badges: https://img.shields.io/badge/build-{{status}}-{{color}}.svg
    # Internally routable FQDNS of the queue svc
    queue: http://sdqueuesvc.screwdriver.svc.cluster.local
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
DATASTORE_SEQUELIZE_RO | いいえ |  | host, port, database, username, passwordなどを含むJSON形式の値<br>Metricsエンドポイントのみで使うRead Onlyデータストアインスタンス情報です

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
        readOnly: DATASTORE-READONLY-INSTANCE
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
K8S_NODE_SELECTORS | `{}` | pod のスケジューリング用の k8s の node selector (フォーマット `{ label: 'value' }`) <https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#step-one-attach-label-to-the-node>
K8S_PREFERRED_NODE_SELECTORS | `{}`|  pod のスケジューリング用の k8s の node selector (フォーマット `{ label: 'value' }`) <https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature>
K8S_POD_DNS_POLICY | ClusterFirst  | ビルドポッドのDNSポリシー <https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy>
K8S_POD_IMAGE_PULL_POLICY | Always | ビルドポッドイメージのPullポリシー <https://kubernetes.io/docs/concepts/containers/images/#updating-images>
K8S_POD_LABELS | `{ app: 'screwdriver', tier: 'builds', sdbuild: buildContainerName }` | クラスタ設定のための k8s ポッドラベル (例: { network-egress: 'restricted' } とすると、デフォルトでパブリックなインターネットへのアクセスをブロックしてビルドを実行します。)
K8S_IMAGE_PULL_SECRET_NAME | ''    | K8sのimagePullSecrets名 (オプション) <https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-pod-that-uses-your-secret>
DOCKER_FEATURE_ENABLED | false | ビルドポッド内でDocker In Dockerを有効にするフラグ
K8S_RUNTIME_CLASS | ''             | ランタイムクラス
TERMINATION_GRACE_PERIOD_SECONDS | 60             | ビルドポッドが削除されるまでの猶予時間


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
| K8S_VM_NODE_SELECTORS | `{}` | pod のスケジューリング用の k8s の node selector (フォーマット `{ label: 'value' }`) <https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#step-one-attach-label-to-the-node> |
| K8S_VM_PREFERRED_NODE_SELECTORS | `{}` | pod のスケジューリング用の k8s の node selector (フォーマット `{ label: 'value' }`) <https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature> |

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
`queue` executorを使用すると、Resqueを含むRedisインスタンスを実行している[リモートキューサービス](./configure-queue-service)にビルドをキューすることができます。

| 環境変数名       | デフォルト値 | 説明          |
|:-----------------------|:--------------|:---------------------|
| EXECUTOR_PLUGIN        | k8s           | デフォルトの executor (`queue` を設定します) |

```yaml
# config/local.yaml
executor:
    plugin: queue
    queue: ''
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

これらの環境変数を設定します。  

| 環境変数名 | 必須 | デフォルト値 | 説明                   |
|:-------------------|:---------|:--------------|:------------------------------|
| NOTIFICATIONS      | いいえ      | {}             | 通知の設定を含むJSONオブジェクト |


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

#### 通知オプション
包括的な通知オプションがあれば、このセクションに入ります。

```yaml
#config/local.yaml
notifications:
    options:
        throwValidationErr: false # default true; boolean to throw error when validation fails or not
    slack:
        token: 'YOUR-SLACK-USER-TOKEN-HERE'
    email:
        host: smtp.yourhost.com
        port: 25
        from: example@email.com
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
            commentUserToken: A_BOT_GITHUB_PERSONAL_ACCESS_TOKEN # [Optional] GithubのPRにコメントを書き込むためのトークン、"public_repo"のスコープが必要
            privateRepo: false # [Optional] プライベートレポジトリの read/write権限
            autoDeployKeyGeneration: false # [Optional] trueにすると、deploy keyの公開鍵と秘密鍵を自動で生成し、それぞれをビルドパイプラインとチェックアウト用の Github のリポジトリに追加します。
```

プライベートレポジトリを使用する場合は、`SCM_USERNAME` と `SCM_ACCESS_TOKEN` を [secrets](../../user-guide/configuration/secrets) として `screwdriver.yaml`に記述する必要があります。

[メタPRコメント](../user-guide/metadata)を有効にするためには、Git上でbotユーザを作成し、そのユーザで`public_repo`のスコープを持ったトークンを作成する必要があります。Githubで、新規にユーザを作成し、[create a personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line)の説明に従ってスコープを`public_repo`に設定します。このトークンをコピーして[API config yaml](https://github.com/screwdriver-cd/screwdriver/blob/master/config/custom-environment-variables.yaml#L268-L269)内の`scms`の設定内の`commentUserToken`として設定します。

###### Deploy Keys

Deploy Keyは、単一のGitHubリポジトリへのアクセスが許可されているSSH鍵です。この鍵はGitHubのpersonal access tokenと反対に、個人のユーザアカウントではなくリポジトリに直接紐付けられてます。GitHubのpersonal access tokenは全てのリポジトリに対してユーザ単位でのアクセス権を与える一方、Deploy Keyは単一のリポジトリへのアクセスを許可します。アクセスの制限が可能となるため、privateリポジトリではDeploy Keyの利用をおすすめします。

パイプラインでDeploy Keyを利用したい場合、2つの方法があります:
* `config/local.yaml`で、`autoDeployKeyGeneration`のフラグを`true`にすることで、パイプラインの一部としてDeploy Keyの自動生成と処理を有効にします。フラグを`true`にすることで、ユーザはUIで自動生成のオプションを追加できるようになります。
* `openssl genrsa -out jwt.pem 2048`と`openssl rsa -in jwt.pem -pubout -out jwt.pub`を使用して公開鍵と秘密鍵のペアを手動で生成します。そして、公開鍵をDeploy Keyとしてリポジトリに登録します。秘密鍵は**base64でエンコード**される必要があり、それを`SD_SCM_DEPLOY_KEY`のsecretsとしてパイプラインに追加します。secretsの追加方法は、[secrets](../../user-guide/configuration/secrets)を参照してください。

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

## Webhooks

以下の環境変数を設定します。

| 環境変数名             | 必須       | デフォルト値 | 説明                                      |
|:-----------------------------|:---------------|:--------------|:-------------------------------------------------|
| SCM_USERNAME                 | いいえ             | sd-buildbot   | 設定されたユーザでSCMトークンを取得します。ユーザがScrewdriverに有効なトークンを登録していなければ、このトークンを使用します。 |
| IGNORE_COMMITS_BY            | いいえ             | []            | このユーザ達からのコミットを無視します。               |
| RESTRICT_PR                  | いいえ             | none          | PRを制限します：all, none, branch, fork |

```yaml
# config/local.yaml
webhooks:
  username: SCM_USERNAME
  ignoreCommitsBy:
    __name: IGNORE_COMMITS_BY
    __format: json
  restrictPR: RESTRICT_PR
```

### レートリミット

以下の環境変数を設定することで、認証トークンによるレートリミットを設定します。

| 環境変数名           | デフォルト値  | 説明                 |
|:---------------------|:--------------|:---------------------|
| RATE_LIMIT_VARIABLES | `'{ "enabled": false, "limit": 300, "duration": 300000 }'` | レートリミットを設定するJSON文字列 |

または以下のような `config/local.yaml` でデフォルト値を上書きできます。

```yaml
# config/local.yaml
rateLimit:
    enabled: true
    # リクエスト回数を1分間で最大60回に制限する
    limit: 60
    duration: 60000
```

### Canaryルーティング

ScrewdriverのKubernetesクラスタが[nginx Canary ingress](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary)を利用している場合、この環境変数を設定することでAPIサーバに一定期間だけCookieをセットさせ、後続のAPIリクエストが同じCanaryのAPIポッドに割り振られるようにします。

| Environment name     | Example Value | Description          |
|:---------------------|:--------------|:---------------------|
| RELEASE_ENVIRONMENT_VARIABLES | `'{ "cookieName": "release", "cookieValue": "canary"}'` | リリース情報をJSON文字列で設定 |

あるいは、以下の `config/local.yaml` でデフォルト値を上書きします。

```yaml
# config/local.yaml
# environment release information
release:
    mode: stable
    cookieName: release
    cookieValue: stable
    cookieTimeout: 2 # in minutes
    headerName: release
    headerValue: stable
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
