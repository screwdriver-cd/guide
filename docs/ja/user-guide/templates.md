---
layout: main
title: テンプレート
category: User Guide
menu: menu_ja
toc:
- title: テンプレート
  url: "#テンプレート"
- title: テンプレートを利用する
  url: "#テンプレートを利用する"
- title: テンプレートを作成する
  url: "#テンプレートを作成する"
- title: テンプレートを検索する
  url: "#テンプレートを検索する"
---

# テンプレート

テンプレートは、ユーザーが[screwdriver.yaml](./configuration)でジョブを設定する代わりに使用できる定義済みのコードのスニペットです。
テンプレートには、一連の定義済みのステップとDockerイメージが含まれます。

## テンプレートを利用する

テンプレートを利用するためには、以下のように `screwdriver.yaml`を定義します。

```yaml
jobs:
    main:
        template: template_name@1.3.0
```

Screwdriverはテンプレートの設定を読み込み、`screwdriver.yaml`は以下のようになります。

```yaml
jobs:
    main:
        image: node:6
        steps:
          - install: npm install
          - test: npm test
          - echo: echo $FOO
        environment:
           FOO: bar
        secrets:
          - NPM_TOKEN
```

### ラップする

ラップとは定義済みのステップの前、もしくは後に実行するコマンドを追加することを指します。
テンプレートで定義済みのステップをラップするには、`pre` もしくは `post` をステップ名の前に追加します。

例:

```yaml
jobs:
    main:
        template: template_name@1.3.0
        steps:
            - preinstall: echo pre-install
            - postinstall: echo post-install
```

この例では、`echo pre-install` が テンプレートの
 `install` ステップの前に、`echo post-install` が  `install`  ステップの後に実行されます。

### 置換

テンプレートで定義済みのステップを置換するには、定義されているステップと同じ名前のステップを追加します。

例:

```yaml
jobs:
    main:
        template: template_name@1.3.0
        steps:
            - install: echo skip installing
```

この例では、`echo skip installing` が `install` ステップで実行されます。

## テンプレートを作成する

### テンプレート yaml を書く

テンプレートを作成するために、`sd-template.yaml` を含んだ新しいリポジトリを作成します。yamlには、テンプレートの名前、バージョン、説明、管理者のメールアドレス、使用するイメージと実行するステップの設定が必要です。

`sd-template.yaml`の例:

```yaml
name: template_name
version: '1.3'
description: template for testing
maintainer: foo@bar.com
config:
    image: node:6
    steps:
        - install: npm install
        - test: npm test
        - echo: echo $FOO
    environment:
        FOO: bar
    secrets:
        - NPM_TOKEN
```

### テンプレートリポジトリ用の screwdriver.yaml を書く

テンプレートをバリデートするために、`template-validate` という npm モジュールを  `main` ジョブで実行します。これは、ビルドに利用するイメージは Node.js と NPM が正しくインストールされている必要があるということです。テンプレートをパブリッシュするために、同様のモジュールに含まれている
 `template-publish` を別のジョブで実行します。

デフォルトでは、`./sd-template.yaml` が読み込まれます。しかし、`SD_TEMPLATE_PATH` という環境変数を利用することで、任意のパスを指定することができます。

#### テンプレートのタグ付け

オプションとして、特定のバージョンのテンプレートにタグを付けることができます。タグ付けはテンプレートが作成されたパイプラインと同じパイプラインから行われる必要があります。タグ付けを行うスクリプトには、引数にname, version および tag が必要です。指定するバージョンは正確なバージョンでなければなりません。

`screwdriver.yaml`の例:

```yaml
shared:
    image: node:6
jobs:
    # the main job is run in pull requests as well
    main:
        steps:
            - install: npm install screwdriver-template-main
            - validate: ./node_modules/.bin/template-validate
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    publish:
        steps:
            - install: npm install screwdriver-template-main
            - publish: ./node_modules/.bin/template-publish
            - tag: ./node_modules/.bin/template-tag --name template_name --version 1.3.0 --tag stable
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
```

Screwdriverのパイプラインをテンプレートリポジトリで作成し、テンプレートのバリデートとパブリッシュを行うためにビルドを開始します。

Screwdriverのテンプレートを更新するには、ご利用のSCMリポジトリに変更を加え、パイプラインのビルドを再度実行します。

## テンプレートを検索する

作成済みのテンプレートを確認するには、 `GET` リクエストを `/templates` のエンドポイントに対して行ってください。詳しくは [API documentation](./api) をご覧ください。
