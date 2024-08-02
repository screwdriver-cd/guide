---
layout: main
title: パイプラインテンプレート
category: User Guide
menu: menu_ja
toc:
- title: パイプラインテンプレート
  url: "#パイプラインテンプレート"
- title: テンプレートを検索する
  url: "#テンプレートを検索する"
- title: パイプラインテンプレートを利用する
  url: "#パイプラインテンプレートを利用する"
- title: カスタマイズ
  url: "#カスタマイズ"
  subitem: true
- title: テンプレートの例
  url: "#テンプレートの例"
- title: "バージョンタグの意味"
  url: "#バージョンタグの意味"
  subitem: true
- title: テンプレートを作成する
  url: "#テンプレートを作成する"
- title: テンプレートyamlを書く
  url: "#テンプレートyamlを書く"
  subitem: true
- title: テンプレートリポジトリ用のscrewdriveryamlを書く
  url: "#テンプレートリポジトリ用のscrewdriveryamlを書く"
  subitem: true
- title: テンプレートの検証
  url: "#テンプレートの検証"
  subitem: level-2
- title: テンプレートのタグ付け
  url: "#テンプレートのタグ付け"
  subitem: level-2
- title: テンプレートをテストする
  url: "#テンプレートをテストする"
- title: テンプレートを削除する
  url: "#テンプレートを削除する"
---

# パイプラインテンプレート

パイプラインテンプレートは、ユーザーが[screwdriver.yaml](../configuration)を定義するために使用できる定義済みの設定のスニペットです。
パイプラインテンプレートには、ステップを持つ一連の定義済みジョブとDockerイメージが含まれています。

## テンプレートを検索する

既に作成済みのテンプレートを見つけるには、`GET` メソッドで `/pipeline/templates` [API](../api)エンドポイントにアクセスしてください。

## テンプレートの例

```yaml
namespace: nodejs
name: test
version: '1.0.4'
description: An example pipeline template for nodejs
maintainer: foo@bar.com
config:
  shared:
    image: node:lts
  jobs:
    main:
      steps:
        - install: npm install
        - test: npm test
      secrets:
        - NPM_TOKEN
```

## パイプラインテンプレートを利用する

テンプレートを利用するためには、`screwdriver.yaml`のトップに`template`を記述します。以下の例では、nodejs/test templateを使用しています。

Example `screwdriver.yaml`:

```yaml
template: nodejs/test@1.0.4
shared:
  environment: 
    FOO: bar        
```

バージョンは[semver](https://semver.org/)互換です。例えば上記のテンプレートでは`nodejs/test@1`や`nodejs/test@1.0`と指定できます。

テンプレートにタグがある場合は、タグバージョンを使用してテンプレートのバージョンを参照することもできます。全てのバージョンとタグはテンプレート詳細ページの下部に表示されており、テンプレートの例では`latest`と`stable`のタグが登録されていることがわかります。

ほとんどのテンプレートは、最後に公開されたバージョンを`latest`としてタグ付けし、多くのテンプレートは自動テストや人手によるチェックによって`stable`タグに更新しています。これはフローティングタグであるため、ジョブで使用した場合にテンプレートが提供する振る舞いが突然変更される可能性があります。

テンプレートのバージョンが指定されていない場合は、最後に公開されたバージョンが使用されます。これは通常、`latest`タグを指定することと同義です。一般的には`latest`を暗黙的に使用するよりも、テンプレートのバージョンを明示する方が適切です。

テンプレートの予期しない変更を回避する最も信頼できる方法は、テンプレートの特定のバージョンを明示的に指定することです。例えば、`nodejs/test@1.0.4`は不変な特定のバージョンのテンプレートへの参照を表しています。`nodejs/test@1.0`などと記述すると、`nodejs/test@1.0.5`が利用可能となったときにそれを使用しますが、振る舞いが予期せず変更される可能性があります。

### カスタマイズ
パイプラインテンプレートを使用時に、`jobs`設定内でいくつかのカスタマイズが可能です。

パイプラインテンプレートに*既に存在する*名前のユーザー定義ジョブについては、`image`、`settings`、`environment`、`requires`のフィールドのみカスタマイズが可能です。

パイプラインテンプレート内に*存在しない*名前のユーザー定義ジョブについては、すべてのフィールドでカスタマイズが可能です。

#### 例
次のようなパイプラインテンプレートがある場合:

```
shared:
  image: node:lts
  environment:
    VAR1: "one"
    VAR2: "two"
  steps:
    - init: npm install
    - test: npm test
  settings:
    email: [test@email.com, test2@email.com]
    slack: 'mychannel'
jobs:
  main:
    requires: [~pr, ~commit]
  second:
    requires: [main]
```

そしてユーザー定義のyamlが次のような場合:

```
template: sd-test/example-template@latest
jobs:
  main:
    requires: [~commit]
    image: node:20
    settings:
      email: [test@email.com, test3@email.com]
    environment:
      VAR3: "three"
      VAR1: "empty"
  third:
    requires: []
    image: node:lts
    steps:
      - echo: echo third job
```

結果として得られる設定は次のようになります:
```
jobs:
  main:
    requires: [~commit]
    image: node:20
    steps:
      - init: npm install
      - test: npm test
    environment:
      VAR1: "empty"
      VAR2: "two"
      VAR3: "three"
    settings:
      email: [test@email.com, test3@email.com]
      slack: 'mychannel'
  second:
    requires: [main]
    image: node:lts
    steps:
      - init: npm install
      - test: npm test
    environment:
      VAR1: "one"
      VAR2: "two"
    settings:
      email: [test@email.com, test2@email.com]
      slack: 'mychannel'
  third:
    requires: []
    image: node:lts
    steps:
      - echo: echo third job
```

## バージョンタグの意味

テンプレートのバージョンは様々な方法で参照でき、振る舞いを固定するか、テンプレート管理者による機能改善を自動的に取り込むかがユーザーのトレードオフとして現れます。上記の例はnodejs/testテンプレートの例を参照してください。

* `nodejs/test@latest` - これは後方互換性のない変更や、メジャーバージョンの変更などにも関わらず、最後に公開されたテンプレートのバージョンを使用します。`latest`タグは主にテンプレートの管理者のみが使用すべきであり、本番や重要なビルドには適していない可能性があります。
* `nodejs/test@stable` - これは管理者が一般的な使用に十分安定していると判断したバージョンのテンプレートを使用します。`stable`タグを利用しているユーザーに対して振る舞いの大幅な変更が現れる場合があります。`stable`タグの変更に後方互換性がない場合、テンプレート管理者はユーザーとコミュニケーションをとる必要があります。
* `nodejs/test@1` - これは2.0.0未満の最新バージョンの`nodejs/test`を使用します。本質的には指定されたメジャーバージョンを超えない`latest`タグということです。
* `nodejs/test@1.0` - これは1.1.0未満の最新バージョンの`nodejs/test`を使用します。本質的には指定されたマイナーバージョンを超えない`latest`タグということです。
* `nodejs/test@1.0.4` - これはパイプラインの振る舞いを固定する最も確実な方法であり、将来的なテンプレートの変更に対して影響を受けません。

#### 例

このような設定があったとします。
```yaml
template: nodejs/test@stable
shared: 
  environment:
    FOO: bar
```


Screwdriverはテンプレートの設定を読み込み、`screwdriver.yaml`は以下のようになります。

```yaml
shared:
  environment:
    FOO: bar
jobs:
  main:
    image: node:lts
    requires: [~pr, ~commit]
    steps:
      - install: npm install
      - test: npm test
    secrets:
      - NPM_TOKEN
```

## テンプレートを作成する

テンプレートの作成と利用は、Screwdriverのパイプラインから実行する必要があります。

### テンプレートyamlを書く
テンプレートを作成するために、`sd-template.yaml` を含んだ新しいリポジトリを作成します。yamlには、テンプレートのネームスペース、名前、バージョン、説明、管理者のメールアドレス、ジョブの設定が必要です。基本的な例は [screwdriver-cd-test/pipe;line-template-example repo](https://github.com/screwdriver-cd-test/pipeline-template-example)にあります。

Example `sd-template.yaml`:

```yaml
namespace: myNamespace
name: template_name
version: '1.3'
description: pipeline template for testing
maintainer: foo@bar.com
config:
  jobs:
    main:
      requires: [~pr, ~commit]
      steps:
        - install: npm install
        - test: npm test
      environment:
          FOO: bar
          TEST: data
      secrets:
          - NPM_TOKEN
```

### テンプレートリポジトリ用のscrewdriveryamlを書く

#### テンプレートの検証

テンプレートを検証するために、[screwdriver-template-main](https://www.npmjs.com/package/screwdriver-template-main) という npm モジュールにある `pipeline-template-validate` スクリプトを `main` ジョブで実行します。つまり、ビルドに利用するイメージは Node.js と NPM が正しくインストールされている必要があります。テンプレートをパブリッシュするために、同様のモジュールに含まれている `pipeline-template-publish` を別のジョブで実行します。

デフォルトでは、`./sd-template.yaml` が読み込まれます。しかし、`SD_TEMPLATE_PATH` という環境変数を利用することで、任意のパスを指定することができます。

また、`<YOUR_UI_URL>/validator`にコピーペーストすることで、UIを通して `sd-template.yaml` と `screwdriver.yaml` を検証することができます。

#### テンプレートのタグ付け

`screwdriver-template-main` という npm パッケージに含まれる `pipeline-template-tag` スクリプトを実行することで、テンプレートの特定のバージョンに対してタグを指定することが可能です。この処理はタグ付けをしたいテンプレートを作成したパイプラインからのみ実行可能です。スクリプトの引数にはテンプレート名、ネームスペース、タグを渡す必要があります。引数で特定のバージョンを指定してタグを付けることも可能です。その場合バージョンは正確なものである必要があります(`tag`のステップを参照)。バージョンを引数から省略した場合は最新のバージョンに対してタグ付けされます。

タグを削除するには `pipeline-template-remove-tag` を実行します。引数としてテンプレート名とタグを渡す必要があります。

Example `screwdriver.yaml`:

```yaml
shared:
  image: node:lts
jobs:
  main:
    requires: [~pr, ~commit]
    steps:
      - validate: npx -y -p screwdriver-template-main pipeline-template-validate
    environment:
      SD_TEMPLATE_PATH: ./path/to/template.yaml
  publish:
    requires: [main]
    steps:
      - publish: npx -y -p screwdriver-template-main pipeline-template-publish
      - tag: npx -y -p screwdriver-template-main pipeline-template-tag --namespace myNamespace --name template_name --version 1.3.0 --tag stable
    environment:
      SD_TEMPLATE_PATH: ./path/to/template.yaml
  remove:
    steps:
      - remove: npx -y -p screwdriver-template-main pipeline-template-remove --namespace myNamespace --name template_name
  remove_tag:
    steps:
      - remove_tag: npx -y -p screwdriver-template-main pipeline-template-remove-tag --namespace myNamespace --name template_name --tag stable
```

Screwdriverのパイプラインをテンプレートリポジトリで作成し、テンプレートのバリデートとパブリッシュを行うためにビルドを開始します。

Screwdriverのテンプレートを更新するには、ご利用のSCMリポジトリに変更を加え、パイプラインのビルドを再度実行します。

## テンプレートをテストする

テンプレートをテストするために、[テンプレートテストのサンプル](https://github.com/screwdriver-cd-test/pipeline-template-test/blob/master/screwdriver.yaml)のようにテンプレートを利用する別のパイプラインを作成することで、リモートテストを設定します。この例では、リモートトリガーを利用することで`publish_nodejs_template`が実行された後にパイプラインが実行されます。
_注意: イベント作成時にテンプレートが展開されるので、同じパイプラインでテンプレートをテストすることはできません。テンプレートの作成されたパイプライン内で使用しようとすると、古いバージョンのテンプレートが使用されます。_

## テンプレートを削除する

### screwdriver-template-main npm package を使う
テンプレートを削除するために`pipeline-template-remove`スクリプトを実行することができます。テンプレート名とネームスペースを引数に与える必要があります。
