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

ジョブには、各ビルドでどのようなことを行うのか設定できます。ジョブの設定は一つの`image`とリストの`steps`、または`template`を含んでいる必要があります。また、`requires`を使用することで、ジョブのトリガーを指定することもできます。パイプラインワークフローを作成するための`requires`の詳しい使用方法は[workflow](/ja/user-guide/configuration/workflow)を参照してください。

#### 例

```
jobs:
    main:
        requires: [~pr, ~commit]
        image: node:6
        steps:
            - init: npm install
            - test: npm test
    main2:
        requires: main
        template: example/mytemplate@stable
```

## Image

`image`の設定はDockerのイメージ、例えば
 [hub.docker.com](https://hub.docker.com) からコンテナを指定します。完全なURLを指定することで、カスタムレジストリからイメージを指定することもできます。

#### 例

```
jobs:
    main:
        requires: [~pr, ~commit]
        image: my-custom-registry.example.com/myorg/myimage:label
        steps:
            - step1: echo hello
```

## Steps

ステップはビルド中で実行したいコマンドのリストです。`step_name: step_command`のように設定できます。ステップは設定した順番に実行されます。作業ディレクトリと環境変数はステップ間で共有されます。

また、ビルドが成功しても失敗しても実行されるteardownステップも設定することができます。teardownステップは他のステップよりも後に定義し、ステップ名を"teardown-"で始める必要があります。

サンプルリポジトリ: <https://github.com/screwdriver-cd-test/user-teardown-example>

ステップに記述した処理はデフォルトでBourne shell (`/bin/sh`)で実行されます。他のシェルで実行したい場合は`USER_SHELL_BIN`で指定することができます。例として、Bashを使いたい場合はジョブのenvironmentに`USER_SHELL_BIN: bash`を設定します。

#### 例

```
jobs:
    main:
        requires: [~pr, ~commit]
        image: node:8
        environment:
            USER_SHELL_BIN: bash
        steps:
            - step_name: step_command --arg1 --arg2 foo
            - set_env: export FOO=bar
            - get_env: echo $FOO           # barが表示されます
            - cd: |
                pwd                        # '/sd/workspace/src/github.com/tkyi/mytest'が表示されます
                cd ..
            - pwd: pwd                     # '/sd/workspace/src/github.com/tkyi'が表示されます
            - bash-only: echo ${FOO%r}     # baが表示されます
            - fail: commanddoesnotexist
            - teardown-mystep1: echo goodbye
            - teardown-mystep2: echo world
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
        requires: [~pr, ~commit]
        image: node:6
    main2:
        requires: [main]
        steps:
            - greet: echo hello
```

上の例は次の例と同じものになります:

```
jobs:
    main:
        requires: [~pr, ~commit]
        image: node:6
        steps:
            - init: npm install
            - test: npm test
    main2:
        requires: [main]
        image: node:8
        steps:
            - greet: echo hello

```

### 参考:

- [Annotations](/ja/user-guide/configuration/annotations) - 主にビルドの実行の設定をする際に使用されるフリーフォームのキー/バリューストア
- [Environment](/ja/user-guide/configuration/environment) - ジョブのための環境変数を設定する
- [Secrets](/ja/user-guide/configuration/secrets) - ビルド中にsecretsを環境変数として安全に渡す
- [Settings](/ja/user-guide/configuration/settings) - ビルドのプラグインを設定する
- [Templates](/ja/user-guide/templates) - 共通で使用できるジョブの設定
- [Workflow](/ja/user-guide/configuration/workflow) - パイプラインの構造を定義する
