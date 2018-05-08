---
layout: main
title: ジョブの設定
category: User Guide
menu: menu_ja
toc:
- title: ジョブの設定
  url: "#ジョブの設定"
- title: Image
  url: "#image"
- title: Steps
  url: "#steps"
- title: Shared
  url: "#shared"
---

# ジョブの設定

ジョブには、各ビルドでどのようなことを行うのか設定できます。ジョブの設定は一つの`image`とリストの`steps`、または`template`を含んでいる必要があります。また、`requires`を使用することで、ジョブのトリガーを指定することもできます。パイプラインワークフローを作成するための`requires`の詳しい使用方法は[workflow](/user-guide/configuration/workflow)を参照してください。

#### 例

```
jobs:
    main:
        image: node:6
        steps:
            - init: npm install
            - test: npm test
    main2: 
        template: example/mytemplate@stable
```

## Image

`image`の設定はDockerのイメージ、例えば
 [hub.docker.com](https://hub.docker.com) からコンテナを指定します。完全なURLを指定することで、カスタムレジストリからイメージを指定することもできます。

#### 例

```
jobs:
    main:
        image: my-custom-registry.example.com/myorg/myimage:label
        steps:
            - step1: echo hello
```

## Steps

ステップはビルド中で実行したいコマンドのリストです。`step_name: step_command`のように設定できます。ステップは設定した順番に実行されます。


#### 例

```
jobs:
    main:
        image: node:8
        steps:
            - step_name: step_command --arg1 --arg2 foo
            - greet: echo Hello
```

# Shared

`shared`の設定は全てのジョブに適用される特殊なジョブの設定です。各ジョブの設定で項目を設定すると、`shared`で設定されている項目を上書きすることができます。

#### 例

下の例では、`image`と`steps`を共通設定で設定して、mainとmain2のジョブで、それぞれ使用されています。

```
shared:
    image: node:8
    steps:
        - init: npm install
        - test: npm test

jobs:
    main:
        image: node:6
    main2:
        steps:
            - greet: echo hello
```

上の例は次の例と同じものになります:

```
jobs:
    main:
        image: node:6
        steps:
            - init: npm install
            - test: npm test
    main2:
        image: node:8
        steps:
            - greet: echo hello

```

### 参考:

- [Annotations](/user-guide/configuration/annotations) - 主にビルドの実行の設定をする際に使用されるフリーフォームのキー/バリューストア
- [Environment](/user-guide/configuration/environment) - ジョブのための環境変数を設定する
- [Secrets](/user-guide/configuration/secrets) - ビルド中にsecretsを環境変数として安全に渡す
- [Settings](/user-guide/configuration/settings) - ビルドのプラグインを設定する
- [Templates](/user-guide/templates) - 共通で使用できるジョブの設定
- [Workflow](/user-guide/configuration/workflow) - パイプラインの構造を定義する
