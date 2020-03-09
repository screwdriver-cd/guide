---
layout: main
title: ローカルビルド
category: User Guide
menu: menu_ja
toc:
- title: sd-localとは？
  url: "#sd-localとは？"
- title: sd-localのインストール
  url: "#sd-localのインストール"
- title: 簡単な使い方
  url: "#簡単な使い方"
- title: configコマンド
  url: "#configコマンド"
- title: buildコマンド
  url: "#buildコマンド"
---

# sd-localとは？
sd-localではSCMにコードをアップロードせずに、手元でScrewdriverと同じビルドを再現することができます。sd-localは、Command, Template, Metadataといった機能をScrewdriverと同様に利用することができます。

# sd-localのインストール
## 実行環境について
sd-local実行には以下のコマンドが必要になります
- [docker](https://www.docker.com/)
  - ビルドの実行環境としてdockerコンテナを利用します
- [git](https://git-scm.com/)
  - [src-url]オプションを利用する場合に必要になります

## インストール方法

以下のコマンドを実行してsd-localをインストールできます。
```bash
$ go get github.com/screwdriver-cd/sd-local
```

注意：  
sd-localをインストールするには、goコマンドが必要です。  
goコマンドをまだインストールしていない場合は、先にそちらのインストールを行ってください。  
https://golang.org/

# 簡単な使い方
sd-localでビルドを実行するまでの流れを説明します。

ここでは、ScrewdriverのAPIを `https://api.screwdriver.cd`、 Storeを `https://store.screwdriver.cd` とします。

## APIトークンの作成
sd-localでは、Screwdriver API, Storeとやり取りするためのAPIトークンを利用します。
[認証と認可](api#認証と認可)を参考に、APIトークンを作成してください。

## ビルド対象のリポジトリを取得
ビルド対象のソースコードと `screwdriver.yaml` を取得します。ここでは[quickstart-generic](https://github.com/screwdriver-cd-test/quickstart-generic.git)を使います。

```
$ git clone https://github.com/screwdriver-cd-test/quickstart-generic.git
$ cd quickstart-generic
```

## ビルド設定
ビルドを実行するための設定を行います。
```
$ sd-local config set api-url https://api.screwdriver.cd
$ sd-local config set store-url https://store.screwdriver.cd
$ sd-local config set token <APIトークン>
$ sd-local config set launcher-version latest
```

## ビルドの実行
sd-localを使ってmainジョブを実行します。

```
$ sd-local build main
INFO[0000] Prepare to start build...
sd-setup-launcher: Screwdriver Launcher information
sd-setup-launcher: Version:        v6.0.48
sd-setup-launcher: Pipeline:       #0
sd-setup-launcher: Job:            main
sd-setup-launcher: Build:          #0
sd-setup-launcher: Workspace Dir:  /sd/workspace
sd-setup-launcher: Checkout Dir:     /sd/workspace/src/screwdriver.cd/sd-local/local-build
sd-setup-launcher: Source Dir:     /sd/workspace/src/screwdriver.cd/sd-local/local-build
sd-setup-launcher: Artifacts Dir:  /sd/workspace/artifacts
export: $ export GREETING="Hello, world!"
export: set -e && export PATH=$PATH:/opt/sd && finish() { EXITCODE=$?; tmpfile=/tmp/env_tmp; exportfile=/tmp/env_export; export -p | grep -vi "PS1=" > $tmpfile && mv $tmpfile $exportfile; echo $SD_STEP_ID $EXITCODE; } && trap finish EXIT;
export:
hello: $ echo $GREETING
hello: Hello, world!
hello:
set-metadata: $ meta set example.coverage 99.95
set-metadata:
```

ビルドが完了すると `./sd-artifacts` 以下にビルド成果物が生成されます。
```
$ ls ./sd-artifacts
builds.log       environment.json steps.json
```

# config コマンド
configコマンドでは、sd-local自体の設定をkey/valueの形式で行います。
設定内容は `~/.sdlocal/config` に保存されます。

## 使い方

### setサブコマンド
key/value形式で設定を行います。ビルドを実行するには`api-url`, `store-url`, `token`を設定する必要があります。
利用できる設定内容については、[設定できるキーの一覧](#設定できるキーの一覧)を参照ください。

```bash
$ sd-local config set <key> <value>
```

### viewサブコマンド
現在の設定内容を確認できます。

```bash
$ sd-local config view
```

### 設定できるキーの一覧
|キー|説明|
|---|---|
|api-url|ご利用しているクラスタのScrewdriver APIのURLを指定してください|
|store-url|ご利用しているクラスタのScrewdriver StoreのURLを指定してください|
|token|[APIトークン](../api#認証と認可)を指定してください|
|launcher-image|launcherイメージを指定してください（デフォルトは `screwdrivercd/launcher`）|
|launcher-version|launcherバージョンを指定してください（デフォルトは `stable`）|

# buildコマンド
手元の環境でビルドを実行します。

## 使い方
ジョブを指定し、ビルドを実行します。実行したジョブが成功した場合も後続のジョブは実行されません。
```bash
$ sd-local build <job name>
```

上記のコマンドではカレントディレクトリの `screwdriver.yaml` をもとにジョブを実行します。
また、ビルド成果物は`./sd-artifacts` ディレクトリ以下に保存されます。

## オプション
buildコマンドには以下のオプションを設定することができます。

|オプション|説明|
|---|---|
|--artifacts-dir|ビルド成果物の保存先を指定します（デフォルトは`./sd-artifacts`）|
|-e, --env|ビルド環境に設定する環境変数を`<key>=<value>` 形式で設定します（複数指定可）|
|--env-file|ビルド環境に設定する環境変数をファイル形式で設定します（ファイルの形式は[env-fileのフォーマット](#env-fileの形式)を参照）|
|-m, --memory|ビルド環境のメモリリソースのリミット値を指定します（b,k,m,gのメモリ単位で指定できます）|
|--meta|ビルド環境に渡す[メタデータ](../metadata)を指定します（JSON形式）|
|--meta-file|ビルド環境に渡す[メタデータ](../metadata)をファイルで指定します（JSON形式）|
|--src-url|ソースコードをリモートのSCMから取得します（`https` または `ssh` 形式のURLを渡せます）|

注意：  
- `--env`, `--env-file` オプションで同じ環境変数が指定された場合、 `--env` で指定した環境変数が優先されます
- `-meta`, `--meta-file` オプションを同時に指定することはできません

### env-fileの形式
`--env-file` オプションで指定するファイルは docker の [.env](https://docs.docker.com/compose/env-file/) と同様の形式です。

- ファイルの各行は `VAR=VAL` の形式で構成されます
- `#` で始まる行はコメントとして無視されます
- 空行は無視されます
- 引用符に特殊な処理はされません。値の一部とみなされます

## 環境変数の一覧
sd-localのビルド内では、以下の環境変数が利用できます。デフォルト値に`-`が設定されているものは、Screwdriver上でのビルドと同様のため、[環境変数](#environment-variables)を参照ください。

|環境変数名|デフォルト値|
|---|---|
|SCREWDRIVER|false|
|CI|false|
|CONTINUOUS_INTEGRATION|false|
|SD_API_URL|configで設定したapi-urlが設定されます|
|SD_STORE_URL|configで設定したstore-urlが設定されます|
|SD_TOKEN|configで設定したtokenに基づいたJWTが設定されます|
|SD_SOURCE_DIR|/sd/workspace/src/screwdriver.cd/sd-local/local-build|
|SD_JOB_NAME|-|
|SD_TEMPLATE_FULLNAME|-|
|SD_TEMPLATE_NAME|-|
|SD_TEMPLATE_NAMESPACE|-|
|SD_TEMPLATE_VERSION|-|
|SD_META_DIR|-|
|SD_META_PATH|-|
|SD_ROOT_DIR|-|
|SD_SOURCE_PATH|-|
|SD_ARTIFACTS_DIR|-|
