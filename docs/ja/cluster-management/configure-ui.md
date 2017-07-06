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

## パッケージ

他のサービスと同様に、80番ポートがexposeされた[Dockerイメージ](https://hub.docker.com/r/screwdrivercd/ui/)としてユーザーインターフェースを提供しています。

```bash
$ docker run -d -p 8000:80 screwdrivercd/ui:stable
$ open http://localhost:8000
```

このDockerイメージはそのバージョン(例: `1.2.3`)や動的な`latest`・`stable`でタグ付けされています。特に理由がなければ`stable`または固定のバージョンタグを利用してください。

## 設定

ユーザーインターフェースにはAPIのURLという1つの設定項目しかありません。設定には環境変数`ECOSYSTEM_API`を利用します。

例:

```bash
$ docker run -d -p 8000:80 -e ECOSYSTEM_API=http://localhost:9000 screwdrivercd/ui:stable
```
