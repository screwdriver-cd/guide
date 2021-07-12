---
layout: main
title: ビルドの設定
category: クラスター管理
menu: menu_ja
toc:
    - title: ビルドの設定
      url: "#ビルドの設定"
      active: true
---
## ビルドの設定

ScrewdriverとStore apiのタイムアウトと最大リトライ数の設定です。これらの環境変数はexecutorsに設定されるとビルド内で利用可能となります。

| 名称 | 説明 |
|------|-------|
| SDAPI_TIMEOUT_SECS | Log service and Launcher to Screwdriver api - 接続タイムアウト（秒）。デフォルトは20秒。|
| SDAPI_MAXRETRIES | Log service and Launcher to Screwdriver api - 最大リトライ数。デフォルトは5回。|
| STOREAPI_TIMEOUT_SECS | Log service to Screwdriver Store api - 接続タイムアウト（秒）。デフォルトは20秒。|
| STOREAPI_MAXRETRIES | Log service to Screwdriver Store api - 最大リトライ数。デフォルトは5回。|
