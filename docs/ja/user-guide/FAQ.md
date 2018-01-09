---
layout: main
title: FAQ
category: User Guide
menu: menu_ja
toc:
- title: よくある質問と回答
  url: "#よくある質問と回答"
  active: 'true'
- title: ビルドをスキップする方法は？
  url: "#ビルドをスキップする方法は？"
- title: パイプラインの作り方は？
  url: "#パイプラインの作り方は？"
- title: ビルドを手動で開始するには？
  url: "#ビルドを手動で開始するには？"
- title: パイプラインのリポジトリやブランチを変更したい場合は？
  url: "#パイプラインのリポジトリやブランチを変更したい場合は？"
- title: ジョブのdisable/enableを一時的に切り替えるには？
  url: "#ジョブのdisable/enableを一時的に切り替えるには？"
- title: パイプラインがソースコードと正しく同期しているか確かめるには？
  url: "#パイプラインがソースコードと正しく同期しているか確かめるには？"
- title: パイプラインを削除するには？
  url: "#パイプラインを削除するには？"
---

# よくある質問と回答

## ビルドをスキップする方法は？

README等ちょっとしたドキュメント修正のみの時など、screwdriverのビルドをスキップさせたい場合があると思います。

masterにpushする際にビルドをスキップさせたい場合は、commitメッセージの中に`[ci skip]` または `[skip ci]`の文字列を追加してください。
また、プルリクエストのマージ時にビルドをスキップさせたい場合は、プルリクエストのタイトル欄に `[ci skip]` または `[skip ci]`の文字列を追加してください。

注意: プルリクエストビルドはスキップ出来ません。
commitメッセージに `[skip ci]` や `[ci skip]` を含めても、プルリクエスト時のビルドはスキップされません。（プルリクエストビルドは常に実行されます）

## パイプラインの作り方は？

新しいパイプラインを作成するには、画面右上の作成アイコンをクリックし、gitリポジトリのURLをフォームに入力してください。master以外のブランチを指定する場合は、`#`の後にブランチ名を指定してください。

![Create a pipeline](../../user-guide/assets/create-pipeline.png)

## ビルドを手動で開始するには？

ビルドを手動で開始させたい場合は、パイプラインページにある「Start」ボタンをクリックしてください。

![Start a pipeline](../../user-guide/assets/start-pipeline.png)

## パイプラインのリポジトリやブランチを変更したい場合は？

パイプラインのリポジトリやブランチを変更したい場合は、「Options」タブをクリックして、Checkout URLの入力欄を更新し、「Update」ボタンをクリックしてください。

![Update a pipeline](../../user-guide/assets/update-pipeline.png)

## ジョブの disable/enable を一時的に切り替えるには？

一時的にジョブの disable/enable を切り替えるには、「Options」タブの画面で、切り替えたいジョブの横にあるトグルボタンをクリックして切り替えを行ってください。

![Disable a pipeline](../../user-guide/assets/disable-pipeline.png)

## パイプラインがソースコードと正しく同期しているか確かめるには？

もしソースコードで何か変更を加えてもパイプラインが同期されない場合は、「Options」タブの「Sync」欄にあるアイコンをクリックして同期してください。
同期は「SCM webhook」、「Pull Request」、「Pipeline」とそれぞれ別々に同期できます。

![Sync a pipeline](../../user-guide/assets/sync-pipeline.png)

## パイプラインを削除するには？

パイプラインを削除するには、「Options」タブ内にある削除アイコンをクリックします。一度削除したパイプラインは戻すことは出来ませんのでご注意ください。

![Delete a pipeline](../../user-guide/assets/delete-pipeline.png)
