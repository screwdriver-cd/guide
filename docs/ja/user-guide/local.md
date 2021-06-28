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
- title: クイックスタート
  url: "#クイックスタート"
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
  - `--src-url`オプションを利用する場合に必要になります

## インストール方法
最新の[sd-local](https://github.com/screwdriver-cd/sd-local/releases) をダウンロードし、以下のようにインストールします。

```bash
$ mv sd-local_*_amd64 /usr/local/bin/sd-local
$ chmod +x /usr/local/bin/sd-local
$ xattr -d com.apple.quarantine /usr/local/bin/sd-local #MacでのAppleの未検証の開発者に関する警告を削除
```

## アップデート方法
sd-localのupdateコマンドを利用できます。
```bash
$ sd-local update
Do you want to update to 1.0.x? [y/N]: y
Successfully updated to version 1.0.x
```
アップデートコマンドの実行中に下記のエラーが出た場合、
```
Error occurred while detecting version: GET https://api.github.com/repos/screwdriver-cd/sd-local/releases: 403 API rate limit exceeded.
```
[GitHub personal access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)を設定してください。
```bash
export GITHUB_TOKEN=<token>
```

# クイックスタート
sd-localでビルドを実行するまでの流れを説明します。

ここでは、ScrewdriverのAPIを `https://api.screwdriver.cd`、 Storeを `https://store.screwdriver.cd` とします。

## ユーザAPIトークンの作成
sd-localでは、Screwdriver API, Storeとやり取りするためにユーザAPIトークンを利用します。
[認証と認可](tokens#ユーザーアクセストークン)を参考に、ユーザAPIトークンを作成してください。

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
configコマンドでは、sd-local自体の設定を行います。設定内容は、環境ごとに複数保持することができます。
設定内容は `~/.sdlocal/config` 以下の形式で保存されます。

```
configs:
  default:
    api-url: ""
    store-url: ""
    token: ""
    launcher:
      version: stable
      image: screwdrivercd/launcher
  yourConfigName:
    api-url: ""
    store-url: ""
    token: ""
    launcher:
      version: stable
      image: screwdrivercd/launcher
current: default
```

- `default` はsd-localの初回利用時に自動的に作成されます
- `current` は現在使用中の設定を表します

## 使い方

### createサブコマンド
新規設定を作成します。

```bash
$ sd-local config create <name>
```

### deleteサブコマンド
設定を削除します。

```bash
$ sd-local config delete <name>
```

- 現在使用中の設定は削除できません

### useサブコマンド
現在使用中の設定を変更します。

```bash
$ sd-local config use <name>
```

### setサブコマンド
現在使用中の設定に対してkey/value形式で設定を行います。ビルドを実行するには`api-url`, `store-url`, `token`を設定する必要があります。
利用できる設定内容については、[設定できるキーの一覧](#設定できるキーの一覧)を参照してください。

```bash
$ sd-local config set <key> <value>
```

### viewサブコマンド
設定内容を確認できます。先頭に`*`がついているものが現在使用中の設定です。

```bash
$ sd-local config view
  cluster1:
    api-url: https://cluster1-api-screwdriver.com
    store-url: https://cluster1-store-screwdriver.com
    token: yourcluster1token
    launcher:
      version: stable
      image: screwdrivercd/launcher
* cluster2:
    api-url: https://cluster2-api-screwdriver.com
    store-url: https://cluster2-store-screwdriver.com
    token: yourcluster2token
    launcher:
      version: stable
      image: screwdrivercd/launcher
```

### 設定できるキーの一覧

|キー|説明|
|---|---|
|api-url|利用しているScrewdriver APIのURLを指定してください|
|store-url|利用しているScrewdriver StoreのURLを指定してください|
|token|[APIトークン](tokens#ユーザーアクセストークン)を指定してください|
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
|-i, --interactive|対話モードでビルドコンテナを起動します|
|-m, --memory|ビルド環境のメモリリソースのリミット値を指定します（b,k,m,gのメモリ単位で指定できます）|
|--meta|ビルド環境に渡す[メタデータ](metadata)を指定します（JSON形式）例: `"{\"HOGE\": \"FOO\"}"`|
|--meta-file|ビルド環境に渡す[メタデータ](metadata)をファイルで指定します（JSON形式）|
|--src-url|ソースコードをリモートのSCMから取得します（`https` または `ssh` 形式のURLを渡せます）|
|--sudo|Dockerランタイム実行時に`sudo`コマンドを付与します|

注意：
- `--env`, `--env-file` オプションで同じ環境変数が指定された場合、 `--env` で指定した環境変数が優先されます
- `--meta`, `--meta-file` オプションを同時に指定することはできません
- Dockerランタイムの実行権限がない場合、`--sudo`オプションを使ってください

### env-fileの形式
`--env-file` オプションで指定するファイルは docker の [.env](https://docs.docker.com/compose/env-file/) と同様の形式です。

- ファイルの各行は `VAR=VAL` の形式で構成されます
- `#` で始まる行はコメントとして無視されます
- 空行は無視されます
- 引用符に特殊な処理はされません。値の一部とみなされます

### Secretsの利用方法
sd-localでは[Secrets](configuration/secrets)を利用する場合、`screwdriver.yaml`の`secrets`の項目で設定していた値を環境変数として`--env`もしくは`--env-file`オプションによって直接指定する必要があります。

```
$ sd-local build <job name> --env <secret name>=<secret value>
```


## 環境変数の一覧
sd-localのビルド内では、以下の環境変数が利用できます。デフォルト値に`-`が設定されているものは、Screwdriver上でのビルドと同様のため、[環境変数](environment-variables)を参照してください。

|環境変数名|デフォルト値|
|---|---|
|SCREWDRIVER|false|
|CI|false|
|CONTINUOUS_INTEGRATION|false|
|SD_API_URL|configで設定したapi-urlが設定されます|
|SD_STORE_URL|configで設定したstore-urlが設定されます|
|SD_TOKEN|configで設定したtokenに基づいたJWTが設定されます|
|SD_SOURCE_DIR|`/sd/workspace/src/screwdriver.cd/sd-local/local-build`|
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
