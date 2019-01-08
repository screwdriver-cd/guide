---
layout: main
title: UIの設定
category: Cluster Management
menu: menu_ja
toc:
- title: ユーザーインターフェースの管理
  url: "#ユーザーインターフェースの管理"
  active: 'true'
- title: パッケージ
  url: "#パッケージ"
- title: 設定
  url: "#設定"
---

## ユーザーインターフェースの管理

ユーザーインターフェースには、API、データストア、アバター、カスタムドキュメントの設定オプションがあります。

## パッケージ

他のサービスと同様に、80番ポートがexposeされた[Dockerイメージ](https://hub.docker.com/r/screwdrivercd/ui/)としてユーザーインターフェースを提供しています。

```bash
$ docker run -d -p 8000:80 screwdrivercd/ui:stable
$ open http://localhost:8000
```

このDockerイメージはそのバージョン(例: `1.2.3`)や動的な`latest`・`stable`でタグ付けされています。特に理由がなければ`stable`または固定のバージョンタグを利用してください。

## 設定

ユーザーインターフェースは API や store 、アバターイメージのパスの場所などのいくつかの設定オプションがあります。

### API 設定
API のホスト名は環境変数 `ECOSYSTEM_API` を通して設定されます。

例:
```bash
$ docker run -d -p 8000:80 -e ECOSYSTEM_API=http://localhost:9000 screwdrivercd/ui:stable
```

### Store 設定
ログやファイルストアのホスト名は環境変数 `ECOSYSTEM_STORE` を通して設定されます。

例:
```bash
$ docker run -d -p 8000:80 -e ECOSYSTEM_STORE=http://localhost:9001 screwdrivercd/ui:stable
```

### アバター設定
UI の Docker イメージにコンテンツセキュリティ保護ヘッダが追加されたので、アバターなどの外部ソースから読み込まれる画像はこれらのヘッダーで設定する必要があります。これは環境変数 `AVATAR_HOSTNAME` を通して設定されます。

Example:
```bash
$ docker run -d -p 8000:80 -e AVATAR_HOSTNAME="avatars*.githubusercontent.com" screwdrivercd/ui:stable
```

アバターのホスト名の一般的な例は以下です。
* Github: `avatars*.githubusercontent.com`
* Bitbucket: `bitbucket.org/account/*/avatar/*`
* GHE: `exampleghe.com/avatars/u/*`

スペースで区切ることで複数のホスト名を追加することができます。

例:
```bash
$ docker run -d -p 8000:80 -e AVATAR_HOSTNAME="avatars*.githubusercontent.com bitbucket.org/account/*/avatar/*" screwdrivercd/ui:stable
```

### カスタムドキュメントリンク
環境変数 `SDDOC_URL` を通して、ドキュメントのリンクを設定することができます。

デフォルト: https://docs.screwdriver.cd

例:
```bash
$ docker run -d -p 8000:80 -e SDDOC_URL=https://mydocs.mysite.me screwdrivercd/ui:stable
```
