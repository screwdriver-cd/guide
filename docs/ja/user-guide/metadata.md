---
layout: main
title: Metadata
category: User Guide
menu: menu_ja
toc:
- title: Metadata
  url: "#metadata"
- title: Metadataとは?
  url: "#Metadataとは"
- title: Metadataの操作
  url: "#Metadataの操作"
- title: <span class="menu-indent">外部パイプライン</span>
  url: "#外部パイプライン"
- title: <span class="menu-indent">プルリクエストコメント</span>
  url: "#プルリクエストコメント"
- title: <span class="menu-indent">プルリクエストチェック</span>
  url: "#追加のプルリクエストチェック"
---

# Metadata

## Metadataとは？

Metadataは [ビルド](../../about/appendix/domain#build) に関する情報を保持する key/value ストアです。Metadataは [steps](../../about/appendix/domain#step) 内で組み込まれている [meta CLI](https://github.com/screwdriver-cd/meta-cli) を利用することで、全てのビルドで更新と取得が可能です。

## Metadataの操作

Screwdriver は meta store から情報を取得するためのシェルコマンド `meta get` と、meta store に情報を保存するためのシェルコマンド `meta set` を提供しています。

### 同一パイプライン

Screwdriverのビルドでは、同ビルドでセットされたMetadata、もしくは同パイプラインの以前のビルドでセットされたMetadataを取得することができます。

例: `build1` -> `build2` -> `build3`

`build2` のMetadataは、自身でセットしたMetadataと `build1` でセットしたMetadataを保持しています。

`build3` のMetadataは、 `build2` が持っていたMetadataを保持しています。 ( `build1` のMetadataも含む)

```bash
$ meta set example.coverage 99.95
$ meta get example.coverage
99.95
$ meta get example
{"coverage":99.95}
```

例:

```bash
$ meta set foo[2].bar[1] baz
$ meta get foo
[null,null,{"bar":[null,"baz"]}]
```

注意:

- `foo`がセットされていない場合に`meta get foo`を実行した場合、デフォルトで`null`を返します。

### 外部パイプライン

Screwdriverのビルドは外部トリガー元のジョブのMetadataにも `--external` フラグにトリガー元のジョブを指定することでアクセスすることができます。

例: `sd@123:publish` -> `build1` の時 `build1` のビルド内で:

```
$ meta get example --external sd@123:publish
{"coverage":99.95}
```

注意:

- `meta set` は外部パイプラインのジョブに対してはできません。
- もし `--external` フラグの値がトリガー元のジョブではなかった場合、meta はセットされません。

## デフォルトMetadata

Screwdriver.cdはデフォルトで以下のMetadataを設定しています。

| キー | 説明 |
| --- | ----------- |
| meta.build.buildId | ビルドのID |
| meta.build.jobId | ビルドと紐付いているジョブのID |
| meta.build.eventId | ビルドと紐付いているイベントのID |
| meta.build.pipelineId | ビルドと紐付いているパイプラインのID |
| meta.build.sha | ビルドが実行しているコミットのsha |
| meta.build.jobName | ジョブ名 |

### プルリクエストコメント

> 注意：この機能は現在のところGithubプラグインでのみ使用可能です

Metadataを使用することで、ScrewdriverのビルドからGitのプルリクエストにコメントを書き込むことができます。コメントの内容はパイプラインのPRビルドから、metaのsummaryオブジェクトに書き込まれます。

プルリクエストにMetadataを書き出すには、`meta.summary`に必要な情報をセットするだけです。このデータはheadlessなGitのユーザからのコメントとして出てきます。

例として、カバレッジの説明を加えたい場合には、screwdriver.yamlは以下のようになります。

```
jobs:
  main:
    steps:
      - comment: meta set meta.summary.coverage "Coverage increased by 15%"
```

以下の例のようにMarkdown記法で書くこともできます。

```
jobs:
  main:
    steps:
      - comment: meta set meta.summary.markdown "this markdown comment is **bold** and *italic*"
```
これらの設定をすると、以下のようにGitにコメントがされます。

![PR comment](./../../user-guide/assets/pr-comment.png)

### 追加のプルリクエストチェック

> 注意：この機能は現在のところGithubプラグインでのみ使用可能です

プルリクエストビルドのより詳細な状態を知るために追加のステータスチェックをプルリクエストに加えることができます。

プルリクエストに追加のチェックをするには、`meta.status.<check>`にJSON形式で必要な情報を設定するだけでできます。このデータはGitのプルリクエストのチェックとして出てきます。

設定できるフィールドは以下の通りです。

| Key | Description |
| --- | ----------- |
| status (String) | チェックのステータス。次から一つ選びます (`SUCCESS`, `FAILURE`) |
| message (String) | チェックの説明 |
| url (String) | チェックのリンクのURL（デフォルトはビルドのリンク） |

例として、`findbugs`と`coverage`の2つの追加のチェックを加える場合、screwdriver.yamlは次のようになります。

```
jobs:
  main:
    steps:
      - status: |
          meta set meta.status.findbugs '{"status":"FAILURE","message":"923 issues found. Previous count: 914 issues.","url":"http://findbugs.com"}'
          meta set meta.status.coverage '{"status":"SUCCESS","message":"Coverage is above 80%."}'
```

これらの設定は以下のようにGitのチェックになります。

![PR checks](./../../user-guide/assets/pr-checks.png)
