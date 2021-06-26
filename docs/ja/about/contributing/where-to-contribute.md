---
layout: main
title: どこに貢献するか
category: About
menu: menu_ja
toc:
    - title: どこに貢献するか
      url: "#どこに貢献するか"
---
# どこに貢献するか

Screwdriver はモジュールアーキテクチャを採用しているので、様々な機能がリポジトリに分割されています。

Screwdriver を使用した継続的デリバリーのワークフロー全体を理解するために、 [architecture diagram][arch-diagram] を確認してください。次節以降の説明が、どこにどんなコードがあるのかを特定するのに役立つでしょう。

### [Screwdriver API][api-repo]
**[screwdriver][api-repo]** リポジトリは screwdriver の核となる API エンドポイントを提供しているリポジトリです。API は *[hapijs framework](http://hapijs.com/)* をベースにしており、数々のプラグインとして実装されています。

* **[Build bookends][build-bookend-repo]** で、ユーザはビルドの setup や teardown のステップを作成できます。

* API はユーザに通知も送れます。[notifications-base][notifications-base-repo] は Screwdriver と [email notifications][notifications-email-repo] や [slack notifications][notifications-slack-repo] といった通知プラグインの間のやりとりを定義するためのベースとなるクラスです。

* API はコードカバレッジのレポートやテスト結果をアップロードすることもできます。[coverage-bookend][coverage-bookend-repo] で Screwdriver と coverage bookends の間の関係が定義されています。[coverage-base][coverage-base-repo] は、Screwdriver と [coverage-sonar][coverage-sonar-repo] といった coverage bookend プラグインの間のやりとりを定義するためのベースとなるクラスです。

### [Launcher][launcher-repo]

**[launcher][launcher-repo]** はステップの実行や、ビルドコンテナ内部の管理を行います。Go で書かれており、ビルドコンテナにバイナリとしてマウントされます。

* **[sd-cmd][sd-cmd-repo]**: Screwdriver のビルド中に、バージョン管理されたコマンド (バイナリ、docker イメージ、habitat パッケージ）を実行するための単一のインターフェースを提供する Go ベースの CLI。
* **[sd-step][sd-step-repo]**: ビルド環境によらず、同じパッケージで同じコマンドを使えるようにする Shared Step。
* **[meta-cli][meta-cli-repo]**: metadata から情報を読み書きするための Go ベースの CLI。

### Executors

Executor は、全ての与えられたジョブについてビルドコンテナを管理するのに使用されます。いくつかの executor が実装されていて、共通のインターフェースに従うように設計されています。Executor の実装は node で書かれています。

* **[executor-base][executor-base-repo]**: 共通のインターフェース
* **[executor-docker][executor-docker-repo]**: Docker の実装
* **[executor-j5s](https://github.com/screwdriver-cd/executor-j5s)**: Jenkins の実装
* **[executor-k8s][executor-k8s-repo]**: Kubernetes の実装
* **[executor-k8s-vm][executor-k8s-vm-repo]**: Kubernetes VM の実装
* **[executor-nomad][executor-nomad-repo]**: Nomad の実装

[executor router][executor-router-repo] は、ビルドを特定の executor へルートするための一般的な executor です。

### Models

オブジェクトモデルにより、データストア(データベース)へ保存されるデータの定義がされています。これは2つの部分からなります。

* **[data-schema][dataschema-repo]**: *[Joi](https://www.npmjs.com/package/joi)* で定義されたスキーマ
* **[models][models-repo]**: データスキーマ周りのビジネスロジックを定義

### Datastores

API と データストレージの間のインターフェースとして実装されています。nodejs で書かれたいくつかの実装があります。

* **[datastore-base][datastore-base-repo]**: datastore の実装のためのインターフェースを定義するベースクラス
* **[datastore-sequelize][datastore-sequelize-repo]**: MySQL, PostgreSQL, SQLite3, MS SQL の実装
* **[datastore-dynamodb][datastore-dynamodb-repo]**: データストアテーブルを作成するための [dynamic-dynamodb][dynamic-dynamodb-repo] が使用されている DynamoDB の実装

### Artifacts

[Artifact Store][store-repo] (上記のデータストアと混同しないよう注意) はログの出力や、shared step、テンプレート、テストカバレッジやその他ビルド中に生成された artifacts を保存するために使用されます。[log service][log-service-repo] は Launcher からログを読み取り、 store へアップロードする Go のツールです。[artifact-bookend][artifact-bookend-repo] は artifacts を store へアップロードするのに使用されます。

### Source Code Management

SCM の実装は API と SCM の間のインターフェースとして使用されます。nodejs で書かれたいくつかの実装があります。

* **[scm-base][scm-base-repo]**: 共通のインターフェース
* **[scm-bitbucket][scm-bitbucket-repo]**: Bitbucket の実装
* **[scm-github][scm-github-repo]**: Github の実装
* **[scm-gitlab][scm-gitlab-repo]**: Gitlab の実装

### Templates

テンプレートは、事前に定義することで `screwdriver.yaml` 内でジョブの定義を置き換えることの出来るコードスニペットです。テンプレートは、一連の定義されたステップとそれが実行される Docker イメージを含んでいます。

* **[templates][templates-repo]**: 全てのビルドテンプレートのリポジトリ
* **[template-main][template-main-repo]**: ジョブテンプレートの validate や publish のための CLI
* **[template-validator][template-validator-repo]**: API によってジョブテンプレートを validate するのに使われるツール

### [Config Parser][config-parser-repo]

`screwdriver.yaml` の設定を validate したり parse する node モジュール

### [Guide][guide-repo] & [Homepage][homepage-repo]

[Guide][guide-repo] はドキュメントです！Screwdriver について知りたいことが全てあります。
[Homepage][homepage-repo] は [Screwdriver.cd][homepage] を動かすためのものです。

### [UI][ui-repo]

Ember ベースの Screwdriver のユーザインターフェースです。

### Miscellaneous Tools

* **[circuit-fuses][circuit-fuses-repo]**: callback インターフェースを使用した node-circuitbreaker を提供するインターフェース
* **[client][client-repo]**: Screwdriver の API へアクセスするためのシンプルな Go ベースの CLI
* **[gitversion][gitversion-repo]**: 新しいバージョンでリポジトリの git tags を更新する Go ベースのツール
* **[keymbinatorial][keymbinatorial-repo]**: キーの配列から単一の値を取得してキーの値の一意な組み合わせを生成します
* **[toolbox][toolbox-repo]**: Screwdrive に関連したスクリプトやその他のツールのリポジトリ
* **[hashr][hashr-repo]**: hash から id を静止するためのラッパーモジュール

### 新規に Screwdriver のリポジトリを作成する

Screwdriver のリポジトリを新しく作成する際の手助けとなるツールもいくつかあります。

* **[generator-screwdriver](https://github.com/screwdriver-cd/generator-screwdriver)**: screwdriver の新しいリポジトリを作成する際の Yeoman generator
* **[eslint-config-screwdriver](https://github.com/screwdriver-cd/eslint-config-screwdriver)**: node ベースのコードのための ESLint のルール。bootstrap のプロセスの一部として、どの新しいリポジトリにも含まれてます。

新しいリポジトリを作成したら、他の人が追加したリポジトリがどこに該当するか分かるように[このページ][contributing-docs]を編集してください。

### Screwdriver.cd のテストと例

**[screwdriver-cd-test][screwdriver-cd-test-org]** には多くのサンプルリポジトリ/screwdriver.yaml と Screwdriver.cd の acceptance test　があります。

[api-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg
[api-issues-url]: https://github.com/screwdriver-cd/screwdriver/issues
[api-repo]: https://github.com/screwdriver-cd/screwdriver
[arch-diagram]: ../../cluster-management/#overall-architecture
[artifact-bookend-repo]: https://github.com/screwdriver-cd/artifact-bookend
[build-bookend-repo]: https://github.com/screwdriver-cd/build-bookend
[circuit-fuses-repo]: https://github.com/screwdriver-cd/circuit-fuses
[client-repo]: https://github.com/screwdriver-cd/client
[config-parser-repo]: https://github.com/screwdriver-cd/config-parser
[contributing-docs]: https://github.com/screwdriver-cd/guide/blob/master/docs/about/contributing/where-to-contribute.md
[coverage-base-repo]: https://github.com/screwdriver-cd/coverage-base
[coverage-bookend-repo]: https://github.com/screwdriver-cd/coverage-bookend
[coverage-sonar-repo]: https://github.com/screwdriver-cd/coverage-sonar
[dataschema-repo]: https://github.com/screwdriver-cd/data-schema
[datastore-base-repo]: https://github.com/screwdriver-cd/datastore-base
[datastore-dynamodb-repo]: https://github.com/screwdriver-cd/datastore-dynamodb
[datastore-sequelize-repo]: https://github.com/screwdriver-cd/datastore-sequelize
[dynamic-dynamodb-repo]: https://github.com/screwdriver-cd/dynamic-dynamodb
[executor-base-repo]: https://github.com/screwdriver-cd/executor-base
[executor-docker-repo]: https://github.com/screwdriver-cd/executor-docker
[executor-j5s-repo]: https://github.com/screwdriver-cd/executor-j5s
[executor-k8s-repo]: https://github.com/screwdriver-cd/executor-k8s
[executor-k8s-vm-repo]: https://github.com/screwdriver-cd/executor-k8s-vm
[executor-nomad-repo]: https://github.com/lgfausak/executor-nomad
[executor-router-repo]: https://github.com/screwdriver-cd/executor-router
[gitversion-repo]: https://github.com/screwdriver-cd/gitversion
[guide-repo]: https://github.com/screwdriver-cd/guide
[hashr-repo]: https://github.com/screwdriver-cd/hashr
[homepage-repo]: https://github.com/screwdriver-cd/homepage
[homepage]: https://screwdriver.cd/
[job-tools-repo]: https://github.com/screwdriver-cd/job-tools
[keymbinatorial-repo]: https://github.com/screwdriver-cd/keymbinatorial
[launcher-repo]: https://github.com/screwdriver-cd/launcher
[log-service-repo]: https://github.com/screwdriver-cd/log-service
[meta-cli-repo]: https://github.com/screwdriver-cd/meta-cli
[models-repo]: https://github.com/screwdriver-cd/models
[notifications-base-repo]: https://github.com/screwdriver-cd/notifications-base
[notifications-email-repo]: https://github.com/screwdriver-cd/notifications-email
[notifications-slack-repo]: https://github.com/screwdriver-cd/notifications-slack
[scm-base-repo]: https://github.com/screwdriver-cd/scm-base
[scm-bitbucket-repo]: https://github.com/screwdriver-cd/scm-bitbucket
[scm-github-repo]: https://github.com/screwdriver-cd/scm-github
[scm-gitlab-repo]: https://github.com/screwdriver-cd/scm-gitlab
[screwdriver-cd-test-org]: https://github.com/screwdriver-cd-test
[sd-cmd-repo]: https://github.com/screwdriver-cd/sd-cmd
[sd-step-repo]: https://github.com/screwdriver-cd/sd-step
[store-repo]: https://github.com/screwdriver-cd/store
[template-main-repo]: https://github.com/screwdriver-cd/template-main
[template-validator-repo]: https://github.com/screwdriver-cd/template-validator
[templates-repo]: https://github.com/screwdriver-cd/templates
[toolbox-repo]: https://github.com/screwdriver-cd/toolbox
[ui-repo]: https://github.com/screwdriver-cd/ui
