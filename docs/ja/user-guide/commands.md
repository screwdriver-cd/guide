---
layout: main
title: コマンド
category: User Guide
menu: menu_ja
toc:
- title: コマンド
  url: "#コマンド"
- title: コマンドを利用する
  url: "#コマンドを利用する"
- title: コマンドを作成する
  url: "#コマンドを作成する"
- title: コマンドを検索する
  url: "#コマンドを検索する"
- title: 更に詳しく
  url: "#更に詳しく"
---

# コマンド

Screwdriver のコマンドは、ユーザが [screwdriver.yaml](./configuration) でステップを定義する代わりに利用できる実行可能なスクリプトやバイナリの[コマンド](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89_(%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF))です。

## コマンドを利用する

コマンドを利用するには、`sd-cmd` という CLI を実行するよう、以下のフォーマットで `screwdriver.yaml` に定義します。

```
$ sd-cmd exec <namespace>/<name>@<version> <arguments>
```

**入力:**

- `namespace/name` - 完全修飾なコマンド名
- `version` - セマンティックバージョニングのフォーマットまたはタグ
- `arguments` - コマンドに直接渡す引数

**出力**

コマンドの取得と実行に関する全てのデバッグログは、`$SD_ARTIFACTS_DIR/.sd/commands/namespace/name/version/timestamp.log` に保存されます。

例:

```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - exec: sd-cmd exec foo/bar@1 -baz sample
```

Screwdriver は Store からバイナリやスクリプトをダウンロードし、実行可能にした後、`-baz sample` を引数として実行します:

```
$ /opt/sd/commands/foo/bar/1.0.1/foobar.sh -baz sample
```

## コマンドを作成する

コマンドのパブリッシュと実行は Screwdriver のパイプラインから行う必要があります。

### コマンド yaml を書く

コマンドを作成するために、`sd-command.yaml` を含んだリポジトリを作成します。yaml には、コマンドのネームスペース、名前、バージョン、説明、管理者のメールアドレス、使用するフォーマット、バイナリファイルのパスの設定が必要です。

`sd-command.yaml`の例:

```yaml
namespace: foo # コマンドのネームスペース
name: bar # コマンドの名前
version: 1.0 # メジャーバージョンとマイナーバージョン (パッチバージョンは自動付与)
description: |
  Lorem ipsum dolor sit amet.
maintainer: foo@bar.com # コマンドの管理者
format: binary # コマンドのフォーマット (現在は binary のみ)
binary:
    file: ./foobar.sh # スクリプトやバイナリファイルのリポジトリルートからのパス
```

### コマンドリポジトリ用の screwdriver.yaml を書く

コマンドをバリデートするために、npm モジュールである [screwdriver-command-validator](https://github.com/screwdriver-cd/command-validator) の `command-validate` というスクリプトを実行します。つまり、ビルドに利用するイメージには、NodeJS と NPM がインストールされている必要があります。

コマンドをパブリッシュするために、`sd-cmd publish` コマンドを別のジョブで実行します。`-f` でファイルを指定します。

`screwdriver.yaml`の例:

```yaml
shared:
    image: node:6
jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - install: npm install screwdriver-command-validator
            - validate: ./node_modules/.bin/command-validate -f sd-command.yaml
    publish:
        requires: [main]
        steps:
            - publish: sd-cmd publish -f sd-command.yaml
```

## コマンドを検索する

既に存在しているコマンドを見つけるには、`GET` メソッドで 
 `/commands` エンドポイントにアクセスしてください。詳しくは [API documentation](./api) をご覧ください。

## 更に詳しく

- [設計仕様書](https://github.com/screwdriver-cd/screwdriver/blob/master/design/commands.md)*

**古くなっている可能性があります。*
