---
layout: main
title: 環境変数
category: User Guide
menu: menu_ja
toc:
- title: 環境変数
  url: "#環境変数"
  active: 'true'
- title: ビルド固有
  url: "#ビルド固有"
- title: 全般
  subitem: true
  url: "#全般"
- title: ユーザ設定
  url: "#ユーザ設定"
  subitem: true
- title: プラグイン
  url: "#プラグイン"
- title: カバレッジ(Sonar)
  url: "#カバレッジ"
  subitem: true
- title: ディレクトリ
  url: "#ディレクトリ"
- title: 環境変数
  url: "#環境変数_1"
- title: ソースコード
  url: "#ソースコード"
- title: URLs
  url: "#urls"
- title: 継続的インテグレーション
  url: "#継続的インテグレーション"
---

# 環境変数

Screwdriver はビルドの過程で利用できる環境変数をエクスポートしています。

*注意: 1つのジョブに対して設定した環境変数は他のジョブでは参照できません。ジョブ間で値を渡すには、[metadata](./metadata) を利用してください。*

## ビルド固有

### 全般

| 環境変数名 | 説明 |
|---|---|
| SD_BUILD_ID | [ビルド](../about/appendix/domain#ビルド)番号 (例: 1, 2, など) |
| SD_EVENT_ID | [イベント](../about/appendix/domain#イベント)の ID |
| SD_JOB_ID | [ジョブ](../about/appendix/domain#ジョブ)の ID |
| SD_JOB_NAME | ジョブの名前 (例: main) |
| SD_PARENT_BUILD_ID | このビルドをトリガーするビルドのリスト(例: `[12345 23456]`) |
| SD_PARENT_EVENT_ID | リスタートの場合、親のイベントの ID |
| SD_PR_PARENT_JOB_ID | PRジョブの 本来のID。例えば、`PR-1:main`ビルドにおいては、本環境変数が指す値は`main`ジョブのIDとなる |
| SD_PIPELINE_ID | パイプラインの ID |
| SD_PIPELINE_NAME | パイプラインの名前(例: `d2lam/myPipeline`) |
| SD_PULL_REQUEST | プルリクエスト番号 (プルリクエストでない場合は空) |
| SD_STEP_EXIT_CODE | 以前実行されたステップの終了コード。teardown stepsのみで利用可能。（例: 以前のすべてのステップがパスしていれば`0`、そうでなければ最後の`0`でない終了コード。)|
| SD_TEMPLATE_FULLNAME | 使用しているテンプレートの完全な名前 (テンプレートを使用していない場合は空) |
| SD_TEMPLATE_NAME | 使用しているテンプレートの名前 (テンプレートを使用していない場合は空) |
| SD_TEMPLATE_NAMESPACE | 使用しているテンプレートのネームスペース (テンプレートを使用していない場合は空) |
| SD_TEMPLATE_VERSION | 使用しているテンプレートのバージョン (テンプレートを使用していない場合は空) |
| SD_TOKEN | ビルド用の JWT トークン |
| SD_SCHEDULED_BUILD | スケジューラーによってビルドを開始する(true)か、否(false)か |
| SD_DIND_SHARE_PATH | Docker-in-Docker機能が有効な場合に使われる。ビルドコンテナとDinDコンテナの共有ディレクトリへのパス |
| CONTAINER_IMAGE | ビルドコンテナイメージ ビルド[エグゼキューター](../cluster-management/configure-api#executorプラグイン)としてKubernetesを使用している場合に利用可能|

### ユーザ設定

| 環境変数名 | デフォルト値 | 説明 |
|------|---------------|-------------|
| SD_ZIP_ARTIFACTS | false | **オプション:** (`true`/`false`) <br><br>artifacts を単一の zip ファイルにしてアップロードします。<br><br>**ユースケース:** Amazon S3 を store に使用していて、AWS Lambda を使用して zip ファイルを store 上で unzip 出来る場合で、ビルドで大量の artifacts が生成される場合にアップロード時間を短縮できます。ただし、Lambda の計算資源はビルドごとに限られているため zip ファイルの内部に含めるファイルの数やサイズには上限があります。アップロードに失敗する場合、Lambda が扱える量を超えているのが原因かもしれません。<br><br>**注意:** このオプションが利用可能かどうかは、クラスタ管理者に問い合わせてください。 |
| USER_SHELL_BIN | sh | ビルド内で実行されるシェルを指定します。`/bin/bash`のように、絶対パスでの指定もできます。サンプルリポジトリ: <https://github.com/screwdriver-cd-test/user-shell-example> |
| GIT_SHALLOW_CLONE | true | **オプション:** (`true`/`false`) <br><br>shallow clone します。|
| GIT_SHALLOW_CLONE_DEPTH | 50 | shallow clone する際の履歴を指定されたコミット数までで切り捨てます。 |
| GIT_SHALLOW_CLONE_SINCE |  | 指定した日時から始まる履歴の一部でShallow cloneします。設定されている場合、`GIT_SHALLOW_CLONE_DEPTH`よりも優先されます。<br><br>`--shallow-since`を利用しており、絶対年代(例: `2019-04-01`)と相対年代(例: `4 weeks ago`)が設定できます。 |
| GIT_SHALLOW_CLONE_SINGLE_BRANCH |  | `true`の場合、shallow cloneの際に` --single-branch`オプションを使います。それ以外の場合、`--no-single-branch`オプションが使われます。 |
| SD_COVERAGE_PLUGIN_ENABLED | `true` | `false`の場合、`sd-teardown-screwdriver-coverage-bookend`ステップがスキップされます。 |

## プラグイン

これらの環境変数は、インストールされているプラグインによって利用できたりできなかったりします。

### カバレッジ(Sonar)

| 環境変数名 | 説明 |
|------|-------|
| SD_SONAR_AUTH_URL | Sonar のアクセストークンを返す Screwdriver API の認証 URL |
| SD_SONAR_HOST | Sonar のホストの URL |
| SD_SONAR_ENTERPRISE | SonarQube の Enterprise 版を利用している(true)か、オープンソース版を使っている(false)か |
| SD_SONAR_PROJECT_KEY | Sonar の project key (例: `pipeline:123` or `job:456`) |
| SD_SONAR_PROJECT_NAME | Sonar の project 名 (例: `d2lam/myPipeline` or `d2lam/myPipeline:main`) |

## ディレクトリ

環境変数名 | 説明
--- | ---
SD_ARTIFACTS_DIR | ビルド･生成されたファイルのディレクトリ <br><br>**注意**: ビルドが`ABORTED`で無い場合に、`sd-teardown-screwdriver-artifact-bookend`ステップでこのディレクトリからストアへアップロードされます。
SD_META_DIR | [メタデータ](./metadata)ディレクトリのパス
SD_META_PATH | [メタデータ](./metadata)ファイルのパス
SD_ROOT_DIR | ワークスペースのディレクトリ (例: `/sd/workspace`)
SD_SOURCE_DIR | チェックアウトされたコードのディレクトリ (例: `/sd/workspace/src/github.com/d2lam/myPipeline`)
SD_SOURCE_PATH | ビルドをトリガーしたソースのパス。参考: [Source Paths](./configuration/sourcePaths).
SD_CONFIG_DIR | 親パイプラインのリポジトリのディレクトリ([子パイプライン](./configuration/externalConfig)でのみ設定されます) (例: `/sd/workspace/config`) |


## 環境変数

環境変数名 | 説明
--- | ---
<environment_variable> | [screwdriver.yaml](configuration/) の "environment" の項目で設定された環境変数

以下のように、ドットを含む環境変数を使用する場合には注意してください。

```yaml
environments:
   REGION.INSTANCE: 'xyz'
```

この時、`process.env.REGION.INSTANCE` では環境変数を取得できません。`process.env['REGION.INSTANCE']` を使用してください。

## ソースコード

環境変数名 | 説明
--- | ---
SCM_URL | チェックアウトされた SCM の URL
GIT_URL | チェックアウトされた SCM の URL に .git を追加した URL
CONFIG_URL | 親パイプラインのリポジトリの SCM の URL ([子パイプライン](./configuration/externalConfig)でのみ設定されます)
GIT_BRANCH | プルリクエストまたはブランチのリファレンス (例: `origin/refs/${PRREF}` または `origin/${BRANCH}`)
PR_BASE_BRANCH_NAME | プルリクエストのベースとなっているブランチ名 (例: `${BRANCH}`)
PR_BRANCH_NAME | プルリクエストのブランチ名 (例: `origin/${BRANCH}` または `upstream/${BRANCH}`) |
SD_BUILD_SHA | Git の commit SHA (例: `b5a94cdabf23b21303a0e6d5be5e96bd6300847a`) |

## URLs

環境変数名 | 説明
--- | ---
SD_API_URL | Screwdriver API の URL へのリンク (例: `https://api.screwdriver.cd/v4/`)
SD_BUILD_URL | Screwdriver のビルド API へのリンク (例: `https://api.screwdriver.cd/v4/builds/1`)
SD_STORE_URL | Screwdriver Store の URL へのリンク (例: `https://store.screwdriver.cd/v1/`)
SD_UI_URL | Screwdriver UI の URL へのリンク (例: `https://cd.screwdriver.cd/`)
SD_UI_BUILD_URL | Screwdriver UI のビルド URL へのリンク (例: `https://cd.screwdriver.cd/pipelines/259/builds/173`)

## 継続的インテグレーション

環境変数名 | 説明
--- | ---
SCREWDRIVER | `true`
CI | `true`
CONTINUOUS_INTEGRATION | `true`
