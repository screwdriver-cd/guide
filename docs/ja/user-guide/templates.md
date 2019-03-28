---
layout: main
title: テンプレート
category: User Guide
menu: menu_ja
toc:
- title: テンプレート
  url: "#テンプレート"
- title: テンプレートを検索する
  url: "#テンプレートを検索する"
- title: テンプレートを利用する
  url: "#テンプレートを利用する"
- title: テンプレートを作成する
  url: "#テンプレートを作成する"
- title: テンプレートを削除する
  url: "#テンプレートを削除する"
---

# テンプレート

テンプレートは、ユーザーが[screwdriver.yaml](./configuration)でジョブを設定する代わりに使用できる定義済みのコードのスニペットです。
テンプレートには、一連の定義済みのステップとDockerイメージが含まれます。

## テンプレートを検索する

既に作成済みのテンプレートを見つけるには、`GET` メソッドで `/templates` [API](./api)エンドポイントにアクセスしてください。またこちらのパス`<YOUR_UI_URL>/templates`にアクセスすることでテンプレートを確認できます。

テンプレートページの例:
![Templates](../../user-guide/assets/templates.png)

## テンプレートを利用する

テンプレートを利用するためには、`screwdriver.yaml`に`template`を定義します。以下の例では、[nodejs/test template](https://cd.screwdriver.cd/templates/nodejs/test)を使用しています。

`screwdriver.yaml`の例:

```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        template: nodejs/test@1.0.3
```

テンプレートにタグがある場合は、タグバージョンを使用してテンプレートのバージョンを参照することもできます。 バージョンが指定されていない場合は、最新の公開バージョンが使用されます。

例:
```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        template: nodejs/test@stable
```

Screwdriverはテンプレートの設定を読み込み、`screwdriver.yaml`は以下のようになります。

```yaml
jobs:
    main:
        image: node:8
        requires: [~pr, ~commit]
        steps:
          - install: npm install
          - test: npm test
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
        requires: [~pr, ~commit]
        template: nodejs/test@1.0.3
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
        requires: [~pr, ~commit]
        template: nodejs/test@1.0.3
        steps:
            - install: echo skip installing
```

この例では、`echo skip installing` が `install` ステップで実行されます。

テンプレートで定義済みのイメージを置換することも出来ます。テンプレートのステップは、置換された後のイメージが持っていないコマンドや環境変数に依存しているかもしれないので、イメージの置換を行う際は注意してください。

例:

```yaml
jobs:
    main:
        equires: [~pr, ~commit]
        image: alpine
        template: nodejs/test@1.0.3
```

## テンプレートを作成する

テンプレートの作成と利用は、Screwdriverのパイプラインから実行する必要があります。

### テンプレート yaml を書く

テンプレートを作成するために、`sd-template.yaml` を含んだ新しいリポジトリを作成します。yamlには、テンプレートのネームスペース、名前、バージョン、説明、管理者のメールアドレス、使用するイメージと実行するステップの設定が必要です。ネームスペースが指定されていない場合、`default` のネームスペースが適用されます。オプションとして、`images`キーワードでサポートされてるイメージをラベル付きのリストで定義することもできます。ユーザーは実際のイメージの代わりにエイリアスを使用できます(例: `image: latest-image`は`image: node:8`に変換されます)。全ての例は[screwdriver-cd-test/template-example repo](https://github.com/screwdriver-cd-test/template-example)にあります。

`sd-template.yaml`の例:

```yaml
namespace: myNamespace
name: template_name
version: '1.3'
description: template for testing
maintainer: foo@bar.com
images:
    stable-image: node:6
    latest-image: node:8
config:
    image: node:6
    steps:
        - install: npm install
        - test: npm test
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

`screwdriver-template-main` という npm パッケージに含まれる `template-tag` スクリプトを実行することで、テンプレートの特定のバージョンに対してタグを指定することが可能です。この処理はタグ付けをしたいテンプレートを作成したパイプラインからのみ実行可能です。スクリプトの引数にはテンプレート名とタグを渡す必要があります。引数で特定のバージョンを指定してタグを付けることも可能です。その場合バージョンは正確なものである必要があります(`tag`のステップを参照)。バージョンを引数から省略した場合は最新のバージョンに対してタグ付けされます(`autotag`のステップを参照)。

タグを削除するには `template-remove-tag` を実行します。引数としてテンプレート名とタグを渡す必要があります。

`screwdriver.yaml`の例:

```yaml
shared:
    image: node:6
jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - install: npm install screwdriver-template-main
            - validate: ./node_modules/.bin/template-validate
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    publish:
        requires: [main]
        steps:
            - install: npm install screwdriver-template-main
            - publish: ./node_modules/.bin/template-publish
            - autotag: ./node_modules/.bin/template-tag --name myNamespace/template_name --tag latest
            - tag: ./node_modules/.bin/template-tag --name myNamespace/template_name --version 1.3.0 --tag stable
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    remove:
        steps:
            - install: npm install screwdriver-template-main
            - remove: ./node_modules/.bin/template-remove --name myNamespace/template_name
    remove_tag:
        steps:
            - install: npm install screwdriver-template-main
            - remove_tag: ./node_modules/.bin/template-remove-tag --name myNamespace/template_name --tag stable
```

Screwdriverのパイプラインをテンプレートリポジトリで作成し、テンプレートのバリデートとパブリッシュを行うためにビルドを開始します。

Screwdriverのテンプレートを更新するには、ご利用のSCMリポジトリに変更を加え、パイプラインのビルドを再度実行します。

## テンプレートを削除する

### screwdriver-template-main npm package を使う
テンプレートを削除するために`template-remove`スクリプトを実行することができます。テンプレート名を引数に与える必要があります。

### UIを使う
または、テンプレートページのUIにあるゴミ箱アイコンをクリックすることで、テンプレートとそれに関連するすべてのタグおよびバージョンを削除できます。

_注意: 誰がテンプレートを削除する権限を持っているか判断するのに必要なため、事前にテンプレートのパイプラインを削除しないでください。_

![Removing](../../user-guide/assets/delete-template.png)

