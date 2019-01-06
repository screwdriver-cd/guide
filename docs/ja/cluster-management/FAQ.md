---
layout: main
title: FAQ
category: Cluster Management
menu: menu_ja
toc:
- title: よくある質問
  url: "#よくある質問"
  active: true
- title: UI にアナウンスを表示させるにはどうすればよいですか？
  url: "#ui-にアナウンスを表示させるにはどうすればよいですか"

---

# よくある質問

## UI にアナウンスを表示させるにはどうすればよいですか？

Screwdriver のユーザに今後のメンテナンスやダウンタイムについて知らせたり、クラスタに問題がある場合はクラスタ管理者が調査中であることを知らせることが出来ます。

そのようなアナウンスを行う際に API を通してバナーが使用できます。バナーを作成したり更新したり削除したりするには、Screwdriver の管理者である必要があります([API の設定](./configure-api)の `SECRET_ADMINS` の環境変数を参照してください)。

![Banner](../../cluster-management/assets/banners.png)
