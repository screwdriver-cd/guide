---
layout: main
title: クイックスタート
category: User Guide
menu: menu_ja
toc:
- title: Getting Started with Screwdriver
  url: "#getting-started-with-screwdriver"
  active: 'true'
- title: 必要なもの
  url: "#必要なもの"
- title: セットアップ
  url: "#セットアップ"
- title: アプリケーションの開発
  url: "#アプリケーションの開発"
- title: Screwdriverによるビルド
  url: "#screwdriverによるビルド"
- title: "おめでとう！Screwdriverを利用して最初のアプリケーションをビルド・実行できました\U0001F389"
  url: "#おめでとうScrewdriverを利用して最初のアプリケーションをビルド・実行できました"
---

# Getting Started with Screwdriver

このページでは、Screwdriverを利用して簡単なアプリケーションが短時間でどのようにビルド・デプロイされるか説明します。このページの例ではSCMプロバイダとしてGithubを利用します。

## 必要なもの

- Githubアカウント

## セットアップ

まず最初に、サンプルリポジトリを開発環境にcloneし、そのプロジェクトディレクトリにcdします。この先の例ではgenericについて説明します。

- [generic](https://github.com/screwdriver-cd-test/quickstart-generic)*
- [Golang](https://github.com/screwdriver-cd-test/quickstart-golang)
- [Nodejs](https://github.com/screwdriver-cd-test/quickstart-nodejs)
- [Ruby](https://github.com/screwdriver-cd-test/quickstart-ruby)

```bash
$ git clone git@github.com:<YOUR_USERNAME_HERE>/quickstart-generic.git
$ cd quickstart-generic/
```

*Makefileや小さなスクリプトの場合はgenericの`screwdriver.yaml`を参照することをお勧めします。

## アプリケーションの開発

アプリケーションがセットアップできたので開発を始めることができます。このアプリケーションにより、Screwdriverのビルド内でどのように`Makefile`とbashスクリプト(`my_script.sh`)が実行されるかを確認できます。

### screwdriver.yaml

`screwdriver.yaml`はScrewdriverを利用する際に必要となる唯一の設定ファイルです。このファイルにはアプリケーションの開発、ビルド、デプロイに必要なすべてのステップを定義します。

#### Workflow

`workflow`はジョブ実行の順番を表します。デフォルトで作成される "main" ジョブは常に最初に実行され、その後このworkflowブロックにリストアップされたジョブが実行されます。

ここでは "main" ジョブの後に実行される "second_job" という名前のジョブを定義しています。

```yaml
---
# Workflow list definition
workflow:
  - second_job
```

#### Shared

`shared`セクションは、すべてのジョブに継承される属性を定義する場所です。

今回の例では、全てのジョブは同じ"buildpack-deps"というDockerコンテナで実行されます。`image`は"repo*name"の形で通常定義されます。または、"repo*name:tag*_name:tag*label"_label"の形で定義することができ、"tag_label"にはimageのバージョンが入ります。詳しくは[Dockerのドキュメント](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-from-docker-hub)をご覧ください。

```yaml
# Shared definition block
shared:
  # Source: https://hub.docker.com/r/library/buildpack-deps/
  image: buildpack-deps
```

#### Jobs

`jobs` セクションは、各ジョブで実行されるすべてのタスク（または`steps`）が定義される場所です。すべてのパイプラインにおいて、暗黙的に定義された"main"が実行されます。screwdriver.yamlファイルの定義は、暗黙のデフォルトを上書きします。

### Steps

`steps`セクションは、実行されるコマンドのリストが定義される場所です
。それぞれのステップは"step*name: command*to*run"の形で定義します。"step*name"は自身を参照するわかりやすいラベルです。
"command*to*run"はこのステップで実行される1つのコマンドです。ステップの名前は頭に`sd-`がつくものは設定できません。これは、Screwdriverのステップとして予約語になっているからです。同じジョブであれば、環境変数はステップ間で受け渡しすることができます。基本的に、Screwdriverはターミナルで`/bin/sh`を実行します。稀に、異なるターミナルやシェルを使用する場合、予期せぬ振る舞いをする可能性があります。

例えば、 "main" ジョブは簡単な1行のシェルコマンドを実行する例を示します。最初のステップ(`export`)は環境変数 `GREETING="Hello, world!"`をセットしています。2番目のステップ(`hello`)では、1ステップ目でセットした環境変数を出力しています。

また、 "second*job" という別のジョブを定義します。このジョブでは別のコマンドセットを実行するつもりです。 "make*target"_target" ステップではMakefileターゲットを呼び、いくつかの処理を実行させます。これは複数行のコマンドを実行する必要がある場合に非常に便利です。 
"run*arbitrary*script"  ステップではスクリプトを実行します。これは続きのステップであり、Makefileターゲットを呼ぶ以外の方法で複数のコマンドを実行できる代替案です。

```yaml
# Job definition block
# "main" is a default job that all pipelines have
jobs:
  main:
    # Steps definition block.
    steps:
      - export: export GREETING="Hello, world!"
      - hello: echo $GREETING
  second_job:
    steps:
      - make_target: make greetings
      - run_arbitrary_script: ./my_script.sh
```

作業用リポジトリができたのでScrewdriverのUIよりアプリケーションをビルド・デプロイしてみましょう。（ScrewdriverのYAMLについて詳しくは[設定](./configuration)ページをご覧ください。）

## Screwdriverによるビルド

Screwdriverを利用するには、Githubを利用してScrewdriverにログインし、パイプラインをセットアップし、ビルドを開始する必要があります。

### 新しいパイプラインを作成

1. Createアイコンをクリックします。（未ログインの場合はログインページにリダイレクトします）
2. *"Login with SCM Provider" ボタンを押します。*
3. *あなたのリポジトリへのアクセス権をScrewdriverに与えてよいか確認されます。適切に選択し、Authorizeボタンをクリックします。*
4. ビルド対象リポジトリのリンクを入力します。SSHかHTTPSリンクの後に`#<YOUR_BRANCH_NAME>`を付加します(例: `git@github.com:screwdriver-cd/guide.git#test`)。`BRANCH_NAME`が指定されない場合、デフォルトとして`master`ブランチが指定されます。 "Use this repository" をクリックし、 ”Create Pipeline" をクリックします。

### はじめてのビルドを開始

パイプラインが作成されたら、新しいパイプラインのページに移動します。スタートボタンをクリックしてビルドを開始しましょう。

## おめでとう！Screwdriverを利用して最初のアプリケーションをビルド・実行できました🎉
