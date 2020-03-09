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
- title: configコマンド
  url: "#configコマンド"
- title: buildコマンド
  url: "#buildコマンド"
---

# sd-localとは？
sd-localではSCMにコードをアップロードせずに、手元でScrewdriverと同じビルドを再現することができます。sd-localは、Command, Template, Metadataといった機能をScrewdriverと同様に利用することができます。

# sd-localのインストール
## 実行環境について
sd-localの実行環境には以下のコマンドが利用できる必要があります
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

# config コマンド
configコマンドでは、sd-local自体の設定をkey/valueの形式で行います。
設定内容は `~/.sdlocal/config` に保存されます。

## 使い方

### setサブコマンド
key/value形式で設定を行います。利用できる設定内容については、[設定できるキーの一覧](#設定できるキーの一覧)を参照ください。

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
|launcher-image|launcherイメージを指定してください（デフォルトは `screwdrivercd/launcher`）|
|launcher-version|launcherバージョンを指定してください（デフォルトは `stable`）|

# buildコマンド
手元の環境でビルドを実行します。

## 使い方
buildコマンドの基本的な使い方は以下の通りです。
```bash
$ sd-local build <job name>
```

上記のコマンドではカレントディレクトリの `screwdriver.yaml` をもとに、指定したジョブのビルドを実行します。また、ビルド成果物は`./sd-artifacts` ディレクトリ以下に保存されます。

## オプション
buildコマンドには以下のオプションを設定することができます。

|オプション|説明|
|---|---|
|--artifacts-dir|ビルド成果物の保存先を指定します（デフォルトは`./sd-artifacts`）|
|-e, --env|ビルド環境に設定する環境変数を`<key>=<value>` 形式で設定します（複数指定可）|
|--env-file|ビルド環境に設定する環境変数をファイル形式で設定します（指定するファイルは `.env` 形式に従います）|
|--memory|ビルド環境のメモリリソースのリミット値を指定します（b,k,m,gのメモリ単位で指定できます）|
|--meta|ビルド環境に渡す[メタデータ](../metadata)を指定します（JSON形式）|
|--meta-file|ビルド環境に渡す[メタデータ](../metadata)をファイルで指定します（JSON形式）|
|--src-url|ソースコードをリモートのSCMから取得します（`https` または `ssh` 形式のURLを渡せます）|

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
