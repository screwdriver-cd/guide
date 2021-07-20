---
layout: main
title: どこに貢献するか
category: About
menu: menu_ja
toc:
    - title: どこに貢献するか
      url: "#どこに貢献するか"
    - title: Screwdriver API
      url: "#screwdriver-api"
    - title: "Models"
      url: "#models"
      subitem: true
    - title: Datastores
      url: "#datastores"
      subitem: true
    - title: Source Code Management (SCM)
      url: "#source-code-management"
      subitem: true
    - title: Notifications
      url: "#notifications"
      subitem: true
    - title: Parsers
      url: "#parsers"
      subitem: true
    - title: "Templates and Commands"
      url: "#templates-and-commands"
      subitem: true
    - title: Launcher
      url: "#launcher"
    - title: Queue
      url: "#queue"
    - title: Executors
      url: "#executors"
      subitem: true
    - title: Artifacts
      url: "#artifacts"
    - title: UI
      url: "#ui"
    - title: Guide and Homepage
      url: "#guide-and-homepage"
    - title: Miscellaneous Tools
      url: "#miscellaneous-tools"
    - title: Bootstrap SD
      url: "#bootstrap-sd"
      subitem: true
    - title: Other
      url: "#other"
      subitem: true
    - title: 新規に Screwdriver のリポジトリを作成する
      url: "#新規に-screwdriver-のリポジトリを作成する"
    - title: テストと例
      url: "#テストと例"
---
# どこに貢献するか

Screwdriver はモジュールアーキテクチャを採用しているので、様々な機能がリポジトリに分割されています。

Screwdriver を使用した継続的デリバリーのワークフロー全体を理解するために、 [architecture diagram][arch-diagram] を確認してください。次節以降の説明が、どこにどんなコードがあるのかを特定するのに役立つでしょう。

## Screwdriver API
**[screwdriver][api-repo]** リポジトリは screwdriver の核となる API エンドポイントを提供しているリポジトリです。API は *[hapijs framework](http://hapijs.com/)* をベースにしており、数々のプラグインとして実装されています。

* **[Build bookends][build-bookend-repo]** で、ユーザはビルドの setup や teardown のステップを作成できます。

* API はユーザに通知も送れます。[notifications-base][notifications-base-repo] は Screwdriver と [email notifications][notifications-email-repo] や [slack notifications][notifications-slack-repo] といった通知プラグインの間のやりとりを定義するためのベースとなるクラスです。

* API はコードカバレッジのレポートやテスト結果をアップロードすることもできます。[coverage-bookend][coverage-bookend-repo] で Screwdriver と coverage bookends の間の関係が定義されています。[coverage-base][coverage-base-repo] は、Screwdriver と [coverage-sonar][coverage-sonar-repo] といった coverage bookend プラグインの間のやりとりを定義するためのベースとなるクラスです。

#### Models

オブジェクトモデルにより、データストア(データベース)へ保存されるデータの定義がされています。これは2つの部分からなります。

* **[data-schema][data-schema-repo]**: *[Joi](https://www.npmjs.com/package/joi)* で定義されたスキーマ
* **[models][models-repo]**: データスキーマ周りのビジネスロジックを定義

#### Datastores

API と データストレージの間のインターフェースとして実装されています。nodejs で書かれたいくつかの実装があります。

* **[datastore-base][datastore-base-repo]**: datastore の実装のためのインターフェースを定義するベースクラス
* **[datastore-sequelize][datastore-sequelize-repo]**: MySQL, PostgreSQL, SQLite3, MS SQL の実装

#### Source Code Management

SCM の実装は API と SCM の間のインターフェースとして使用されます。nodejs で書かれたいくつかの実装があります。

* **[scm-base][scm-base-repo]**: 共通のインターフェース
* **[scm-bitbucket][scm-bitbucket-repo]**: Bitbucket.org の実装
* **[scm-github][scm-github-repo]**: GitHub の実装
* **[scm-gitlab][scm-gitlab-repo]**: Git+ab の実装
* **[sd-repo][sd-repo-repo]**: [scm-github][scm-github-repo]の`getCheckoutCommand`のRepo workflowを実行するGoベースのツール

**[scm-router][scm-router-repo]** は、指定されたscmにビルドをルーティングする汎用のscmプラグインです。

#### Notifications
APIは、ユーザーに通知を送ることもできます。

* **[notifications-base][notifications-base-repo]**: Screwdriverと通知プラグイン間の動作を定義するベースクラス
* **[notifications-email][notifications-email-repo]**: Email通知の実装
* **[notifications-slack][notifications-slack-repo]**: Slack通知の実装

#### Parsers
Parsersは、Screwdriverの様々なフローを検証し、解析するのに役立ちます。

* **[config-parser][config-parser-repo]**: ユーザーの`screwdriver.yaml`を検証、解析するnode module
* **[workflow-parser][workflow-parser-repo]**: パイプラインの設定を解析してワークフローグラフに変換するnode module

### Templates and Commands

テンプレートは、事前に定義することで `screwdriver.yaml` 内でジョブの定義を置き換えることの出来るコードスニペットです。テンプレートは、一連の定義されたステップとそれが実行される Docker イメージを含んでいます。

* **[templates][templates-repo]**: 全てのビルドテンプレートのリポジトリ
* **[template-main][template-main-repo]**: ジョブテンプレートの validate や publish のための CLI
* **[template-validator][template-validator-repo]**: API によってジョブテンプレートを validate するのに使われるツール
* **[tmpl-semantic-release][tmpl-semantic-release-repo]**: NPMベースのモジュールのセマンティックリリースを実行するテンプレート

コマンドとは、あらかじめ定義されたコードの断片で、`screwdriver.yaml`のステップ定義を置き換えるために使用できます。コマンドは一連の定義済みのコマンドを含みます。

* **[command-validator][command-validator-repo]**: APIがコマンドをバリデートするために使用するツール
* **[cmd-install-node][cmd-install-node-repo]**: nvmを使ってnode.jsをインストールする共有コマンド
* **[cmd-docker-trigger][cmd-docker-trigger-repo]**: masterと指定されたタグのDockerビルドをトリガーするための共有コマンド
* **[junit-reports][junit-reports-repo]**: Junitレポートを解析するための共有コマンド

## Launcher

**[launcher][launcher-repo]** はステップの実行や、ビルドコンテナ内部の管理を行います。Go で書かれており、ビルドコンテナにバイナリとしてマウントされます。

* **[sd-cmd][sd-cmd-repo]**: Screwdriver のビルド中に、バージョン管理されたコマンド (バイナリ、docker イメージ、habitat パッケージ）を実行するための単一のインターフェースを提供する Go ベースの CLI。
* **[sd-packages][sd-packages-repo]**: skopeo, zstd, その他カスタムバイナリを、Launcher用にビルド, パッケージ化, publishする
* **[sd-step][sd-step-repo]**: ビルド環境によらず、同じパッケージで同じコマンドを使えるようにする Shared Step。
* **[meta-cli][meta-cli-repo]**: metadata から情報を読み書きするための Go ベースの CLI。

## Queue

**[queue-service][queue-service-repo]** は、Screwdriverがビルドをエンキューして処理するための、可用性の高いRESTベースのキューサービスです。
これは、[Resque][node-resque-URL]を利用して、キューイングメカニズムを提供します。

* **[buildcluster-queue-worker][buildcluster-queue-worker-repo]**: Rabbitmqのキューからジョブを消費するamqpコネクションマネージャの実装

#### Executors

Executor は、全ての与えられたジョブについてビルドコンテナを管理するのに使用されます。いくつかの executor が実装されていて、共通のインターフェースに従うように設計されています。Executor の実装は node で書かれています。

* **[executor-base][executor-base-repo]**: 共通のインターフェース
* **[executor-docker][executor-docker-repo]**: Docker の実装
* **[executor-j5s](https://github.com/screwdriver-cd/executor-j5s)**: Jenkins の実装
* **[executor-k8s][executor-k8s-repo]**: Kubernetes の実装
* **[executor-nomad][executor-nomad-repo]**: Nomad の実装

**[executor-queue][executor-queue-repo]** は、Redisのキューを介してビルドをルーティングするための汎用 executor です。
**[executor router][executor-router-repo]** は、ビルドを特定の executor へルートするための汎用 executor です。

### Artifacts

**[Artifact Store][store-repo]** (上記のデータストアと混同しないよう注意) はログの出力や、shared step、テンプレート、テストカバレッジやその他ビルド中に生成された artifacts を保存するために使用されます。

* **[artifact-bookend][artifact-bookend-repo]**: artifacts を store へアップロードするブックエンド
* **[cache-bookend][cache-bookend-repo]**: ビルドキャッシュのアップロードとダウンロードのためのブックエンド
* **[log service][log-service-repo]**: Launcher からログを読み取り、 store へアップロードする Go のツール
* **[store-cli][store-cli-repo]**: Screwdriverのストアと通信するためのGoベースのCLI

## UI
Ember ベースの Screwdriver のユーザインターフェースです。

## Guide and Homepage

**[Guide][guide-repo]** はドキュメントです！Screwdriver について知りたいことが全てあります。
**[Homepage][homepage-repo]** は [Screwdriver.cd][homepage] を動かすためのものです。
**[Community][community-repo]** は オープンソースコミュニティの議事録やドキュメントが保管される場所です。

## Miscellaneous Tools

#### Bootstrap SD
Screwdriverを使い始める際に役立つリポジトリです。

* **[aws-build-cluster][aws-build-cluster-repo]**: AWS上でScrewdriverがクラスタを構築する際に必要なEKSクラスタとリソースをプロビジョニングするためにクイックスタートツール
* **[hyperctl-image][hyperctl-image-repo]**: hyperctlとk8s-vmのスクリプトを含む最小限のDockerイメージを作成する(screwdriver-chartで使用)
* **[in-a-box][in-a-box-repo]**: Screwdriverインスタンス全体(UI, API, ログストア)をローカルに立ち上げるPythonベースの実行ファイル
* **[screwdriver-chart][screwdriver-chart-repo]**: Screwdriverエコシステム全体と、nginx ingressコントローラをブートストラップする
* **[sd-local][sd-local-repo]**: 多くの機能を備えた、手元でScrewdriverを動かすことのできるGoベースのツール
* **[sonar-pipeline][sonar-pipeline-repo]**: SonarQubeサーバをKubernetesにデプロイするパイプライン

#### Other
* **[circuit-fuses][circuit-fuses-repo]**: callback インターフェースを使用した node-circuitbreaker を提供するインターフェース
* **[gitversion][gitversion-repo]**: 新しいバージョンでリポジトリの git tags を更新する Go ベースのツール
* **[keymbinatorial][keymbinatorial-repo]**: キーの配列から単一の値を取得してキーの値の一意な組み合わせを生成します
* **[logger][logger-repo]**: Screwdriverコンポーネント共通のロギングプロバイダー
* **[noop-container][noop-container-repo]**: ビルドを実行するのに最小構成のDockerコンテナ
* **[raptor][raptor-repo]**: Screwdriver APIのテストスクリプトの読み込み
* **[sd-housekeeping][sd-housekeeping-repo]**: buld pipeline validatorなどのハウスキープに関わるスクリプト
* **[toolbox][toolbox-repo]**: Screwdrive に関連したスクリプトやその他のツールのリポジトリ

## 新規に Screwdriver のリポジトリを作成する

Screwdriver のリポジトリを新しく作成する際の手助けとなるツールもいくつかあります。

* **[generator-screwdriver](https://github.com/screwdriver-cd/generator-screwdriver)**: screwdriver の新しいリポジトリを作成する際の Yeoman generator
* **[eslint-config-screwdriver](https://github.com/screwdriver-cd/eslint-config-screwdriver)**: node ベースのコードのための ESLint のルール。bootstrap のプロセスの一部として、どの新しいリポジトリにも含まれてます。

新しいリポジトリを作成したら、他の人が追加したリポジトリがどこに該当するか分かるように[このページ][contributing-docs]を編集してください。

## テストと例

**[screwdriver-cd-test][screwdriver-cd-test-org]** には多くのサンプルリポジトリ/screwdriver.yaml と [Screwdriver.cd](https://cd.screwdriver.cd) の acceptance test　があります。

[api-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg
[api-issues-url]: https://github.com/screwdriver-cd/screwdriver/issues
[api-repo]: https://github.com/screwdriver-cd/screwdriver
[arch-diagram]: ../../cluster-management/#全体の構成
[artifact-bookend-repo]: https://github.com/screwdriver-cd/artifact-bookend
[aws-build-cluster-repo]: https://github.com/screwdriver-cd/aws-build-cluster
[build-bookend-repo]: https://github.com/screwdriver-cd/build-bookend
[buildcluster-queue-worker-repo]: https://github.com/screwdriver-cd/buildcluster-queue-worker
[cache-bookend-repo]: https://github.com/screwdriver-cd/cache-bookend
[circuit-fuses-repo]: https://github.com/screwdriver-cd/circuit-fuses
[command-validator-repo]: https://github.com/screwdriver-cd/command-validator
[community-repo]: https://github.com/screwdriver-cd/community
[cmd-install-node-repo]: https://github.com/screwdriver-cd/cmd-install-node
[cmd-docker-trigger-repo]: https://github.com/screwdriver-cd/cmd-docker-trigger
[config-parser-repo]: https://github.com/screwdriver-cd/config-parser
[contributing-docs]: https://github.com/screwdriver-cd/guide/blob/master/docs/about/contributing/where-to-contribute.md
[coverage-base-repo]: https://github.com/screwdriver-cd/coverage-base
[coverage-bookend-repo]: https://github.com/screwdriver-cd/coverage-bookend
[coverage-sonar-repo]: https://github.com/screwdriver-cd/coverage-sonar
[data-schema-repo]: https://github.com/screwdriver-cd/data-schema
[datastore-base-repo]: https://github.com/screwdriver-cd/datastore-base
[datastore-sequelize-repo]: https://github.com/screwdriver-cd/datastore-sequelize
[executor-base-repo]: https://github.com/screwdriver-cd/executor-base
[executor-docker-repo]: https://github.com/screwdriver-cd/executor-docker
[executor-j5s-repo]: https://github.com/screwdriver-cd/executor-j5s
[executor-k8s-repo]: https://github.com/screwdriver-cd/executor-k8s
[executor-nomad-repo]: https://github.com/lgfausak/executor-nomad
[executor-queue-repo]: https://github.com/screwdriver-cd/executor-queue
[executor-router-repo]: https://github.com/screwdriver-cd/executor-router
[gitversion-repo]: https://github.com/screwdriver-cd/gitversion
[guide-repo]: https://github.com/screwdriver-cd/guide
[homepage-repo]: https://github.com/screwdriver-cd/homepage
[homepage]: https://screwdriver.cd
[hyperctl-image-repo]: https://github.com/screwdriver-cd/hyperctl-image
[in-a-box-repo]: https://github.com/screwdriver-cd/in-a-box
[junit-reports-repo]: https://github.com/screwdriver-cd/junit-reports
[keymbinatorial-repo]: https://github.com/screwdriver-cd/keymbinatorial
[launcher-repo]: https://github.com/screwdriver-cd/launcher
[log-service-repo]: https://github.com/screwdriver-cd/log-service
[logger-repo]: https://github.com/screwdriver-cd/logger
[meta-cli-repo]: https://github.com/screwdriver-cd/meta-cli
[models-repo]: https://github.com/screwdriver-cd/models
[node-resque-URL]: https://github.com/actionhero/node-resque
[noop-container-repo]: https://github.com/screwdriver-cd/noop-container
[notifications-base-repo]: https://github.com/screwdriver-cd/notifications-base
[notifications-email-repo]: https://github.com/screwdriver-cd/notifications-email
[notifications-slack-repo]: https://github.com/screwdriver-cd/notifications-slack
[queue-service-repo]: https://github.com/screwdriver-cd/queue-service
[raptor-repo]: https://github.com/screwdriver-cd/raptor
[scm-base-repo]: https://github.com/screwdriver-cd/scm-base
[scm-bitbucket-repo]: https://github.com/screwdriver-cd/scm-bitbucket
[scm-github-repo]: https://github.com/screwdriver-cd/scm-github
[scm-gitlab-repo]: https://github.com/screwdriver-cd/scm-gitlab
[scm-router-repo]: https://github.com/screwdriver-cd/scm-router
[screwdriver-cd-test-org]: https://github.com/screwdriver-cd-test
[screwdriver-chart-repo]: https://github.com/screwdriver-cd/screwdriver-chart
[sd-cmd-repo]: https://github.com/screwdriver-cd/sd-cmd
[sd-housekeeping-repo]: https://github.com/screwdriver-cd/sd-housekeeping
[sd-local-repo]: https://github.com/screwdriver-cd/sd-local
[sd-packages-repo]: https://github.com/screwdriver-cd/sd-packages
[sd-repo-repo]: https://github.com/screwdriver-cd/sd-repo
[sd-step-repo]: https://github.com/screwdriver-cd/sd-step
[sonar-pipeline-repo]: https://github.com/screwdriver-cd/sonar-pipeline
[store-repo]: https://github.com/screwdriver-cd/store
[store-cli-repo]: https://github.com/screwdriver-cd/store-cli
[tmpl-semantic-release-repo]: https://github.com/screwdriver-cd/tmpl-semantic-release
[template-main-repo]: https://github.com/screwdriver-cd/template-main
[template-validator-repo]: https://github.com/screwdriver-cd/template-validator
[templates-repo]: https://github.com/screwdriver-cd/templates
[toolbox-repo]: https://github.com/screwdriver-cd/toolbox
[ui-repo]: https://github.com/screwdriver-cd/ui
[workflow-parser-repo]: https://github.com/screwdriver-cd/workflow-parser
