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
- title: パイプラインを手動で開始するには？
  url: "#パイプラインを手動で開始するには？"
- title: パイプラインのリポジトリやブランチを変更したい場合は？
  url: "#パイプラインのリポジトリやブランチを変更したい場合は？"
- title: ジョブのdisable/enableを一時的に切り替えるには？
  url: "#ジョブのdisable/enableを一時的に切り替えるには？"
- title: パイプラインがソースコードと正しく同期しているか確かめるには？
  url: "#パイプラインがソースコードと正しく同期しているか確かめるには？"
- title: パイプラインを削除するには？
  url: "#パイプラインを削除するには？"
- title: "「Build failed to start」のエラーを修正するには？"
  url: "#「Build-failed-to-start」のエラーを修正するには？"
- title: ビルドのロールバックを行うには？
  url: "#ビルドのロールバックを行うには？"
- title: 過去の成功時のビルドを再実行するには？
  url: "#過去の成功時のビルドを再実行するには？"
- title: ロールバック用のジョブ（通常のパイプラインからは独立したジョブ）を実行させるには？
  url: "#ロールバック用のジョブ（通常のパイプラインからは独立したジョブ）を実行させるには？"
- title: ビルドをUNSTABLEの状態にするには？
  url: "#ビルドをUNSTABLEの状態にするには？"
- title: Screwdriverが使用しているシェルは？
  url: "#Screwdriverが使用しているシェルは？"
- title: Artifactsをアップロードする時間を短縮するには？
  url: "#Artifactsをアップロードする時間を短縮するには？"
- title: shallow cloningを無効にするには？
  url: "#shallow-cloningを無効にするには？"
- title: ビルドイメージの最小ソフトウェア要件は？
  url: "#ビルドイメージの最小ソフトウェア要件は？"
- title: Saucelabsとの連携は？
  url: "Saucelabsとの連携は？"
- title: ビルド内からGitリポジトリにpushされたときにパイプラインを実行するには？
  url: "#ビルド内からGitリポジトリにpushされたときにパイプラインを実行するには？"

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

## パイプラインを手動で開始するには？

ビルドを手動で開始させたい場合は、パイプラインページにある「Start」ボタンをクリックしてください。パイプラインを開始すると`~commit`をトリガーにもつ全てのジョブのビルドが開始します。

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

## 「Build failed to start」のエラーを修正するには？

このエラーは（VMのexecutorを使用している場合は）hyperdのプロセスがダウンしているなどクラスタセットアップ時の問題や、ビルドを行うDocker imageの問題など、様々な理由で起こります。
従ってどのレイヤーでエラーが起きているかによって修正する方法も変わってきます。

1. `/opt/sd/launch: not found`
このエラーが出る場合はAlpineベースのimageを利用していることが原因となります。glibcの代わりにmuslが使われているためです。回避策としてはDocker imageの作成時に下記のシンボリックリンクを作成します。
`mkdir /lib64 && ln -s /lib/ld-musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2`
1. [hyperdのバグ](https://github.com/screwdriver-cd/screwdriver/issues/1081)が時々発生し、`VOLUME`の定義されたイメージが継続的に起動に失敗します。そういったイメージの一つに`gradle:jdk8`が上げられます。現時点でのワークアラウンドは他のdocker imageを利用するか、[ このDockerfile](https://github.com/keeganwitt/docker-gradle/blob/64a348e79cbe0bc8acb9da9062f75aca02bf3023/jdk8/Dockerfile)から`VOLUME`の行を除いてリビルドすることです。

## ビルドのロールバックを行うには？

ビルドのロールバックを行うには下記の２パターンの方法があります。
- パイプラインの過去の成功時のビルドを再実行する
- ロールバック用のジョブ（通常のパイプラインからは独立したジョブ）を作成して実行

### 過去の成功時のビルドを再実行するには？

過去のイベントから再ビルドを行う手順は下記の通りとなります。

1. ログインする。
2. 過去のイベント一覧から再ビルドを行いたいイベントをクリックして、画面上部にワークフローの詳細を表示させます。
3. 再ビルドを行いたいジョブをクリックして、ポップアップから「Start pipeline from here」のリンクをクリックしてジョブを実行させます。![Load event graph](../../assets/re-run-select.png)![Start new build for job](../../assets/re-run-start.png)

### ロールバック用のジョブ（通常のパイプラインからは独立したジョブ）を実行させるには？

通常のパイプラインから独立したジョブ（detachedジョブ）を作成してロールバックを行う手順は下記の通りとなります。通常のパイプラインの最後のジョブ（下記の例ではジョブD）で`meta set`コマンドでイメージ名やバージョン情報のメタを設定し、ロールバック用のジョブ（下記の例ではdetached）で`meta get` コマンドを使用して設定されたメタ情報を取得します。detachedジョブはジョブDで設定されたメタ情報にアクセスできます。

1. ログインする。
2. 過去のイベント一覧から再ビルドを行いたいイベントをクリックして、画面上部にワークフローの詳細を表示させます。![Select Event](http://78.media.tumblr.com/fb595b0e3f2493c9b4623a05d2dd60dc/tumblr_inline_p5aw66dJ1n1uvhog4_1280.png)
3. スタートさせたいdetachedジョブをクリックして、ポップアップから「Start pipeline from here」のリンクをクリックしてジョブを実行させます。![Load event graph](http://78.media.tumblr.com/fb595b0e3f2493c9b4623a05d2dd60dc/tumblr_inline_p5aw66dJ1n1uvhog4_1280.png)
4. 「Yes」をクリックしてジョブを開始します。 ![Start new build for job](http://78.media.tumblr.com/f99978ba2dcea4a67e352b053e50ae76/tumblr_inline_p5aw6lyDLW1uvhog4_1280.png)

### ビルドをUNSTABLEの状態にするには？

ビルド中に[API](./api)を呼び出すことで、ビルドのステータスを`UNSTABLE`にすることができます。[UNSTABLEビルドのサンプルリポジトリ](https://github.com/screwdriver-cd-test/unstable-build-example)を参照してください。

### Screwdriverが使用しているシェルは？

ステップに記述した処理はデフォルトでBourne shell (`/bin/sh`)で実行されます。他のシェル（bashなど）で実行したい場合は`USER_SHELL_BIN`[環境変数](./environment-variables#ユーザ設定)で指定することができます。

### Artifactsをアップロードする時間を短縮するには？

管理者が予め使用できるように設定していれば、[`SD_ZIP_ARTIFACTS`](./environment-variables#ユーザ設定)の環境変数を`true`にすることで、Artifactsをアップロードする前にzip化します。

### shallow cloningを無効にするには？

shallow cloningを無効にするには、[`GIT_SHALLOW_CLONE`](./environment-variables#ユーザ設定)の環境変数を`false`にセットします。

デフォルトではScrewdriverはdepth 50でソースリポジトリをshallow cloneします。また、`--no-single-branch`のフラグもデフォルトで有効にしています。

shallow cloningを有効のままにしてgitリポジトリへpushを行うのであれば、使用するイメージに含まれるgitのバージョンが1.9かそれ以上である必要があります。あるいは、`sd-step exec core / git" GIT COMMAND "`を呼び出して、Screwdriverにバンドルされているバージョンのgitを使用することもできます。

### ビルドイメージの最小ソフトウェア要件は？

Screwdriverはビルドコンテナイメージに制限がありません。しかし、最低でも`curl`と`openssh`がインストールされている必要があります。さらに、コンテナのデフォルトユーザは`root`もしくはsudo NOPASSWDが有効になっている必要があります。

また、`image`がAlpineベースの場合は、追加で次のシンボリックリンクのような回避策が必要です。 `mkdir -p /lib64 && ln -s /lib/ld-musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2`

### Saucelabsとの連携は？

ブログ記事を参考にしてください。 https://blog.screwdriver.cd/post/161515128762/sauce-labs-testing-with-screwdriver

サンプルリポジトリはこちらです。 https://github.com/screwdriver-cd-test/saucelabs-example

## ビルド内からGitリポジトリにpushされたときにパイプラインを実行するには？

Screwdriverはデフォルトで[gitユーザー](https://github.com/screwdriver-cd/screwdriver/blob/ec959e1590909259479fe34f2f26d91f227025aa/config/custom-environment-variables.yaml#L284)に`sd-buildbot`を使用します。したがって、ビルド内で`git`コミットを行うと、コミットユーザーは`sd-buildbot`になります。

これは、webhook処理に影響を及ぼします。 ヘッドレスユーザーがパイプラインを無期限に実行することを防ぐために、ヘッドレスユーザーによるコミットを無視するようにScrewdriverクラスター管理者はwebhookプロセッサの設定を行えます。これを行うには、[IGNORE_COMMITS_BY]（https://github.com/screwdriver-cd/screwdriver/blob/ec959e1590909259479fe34f2f26d91f227025aa/config/custom-environment-variables.yaml#L323-L325）環境変数を設定します。通常、デフォルトgitユーザーの`sd-buildbot`がこのリストに追加されます。

ユーザーは、別のgitユーザーを使用することでこの動作を上書きできます。例えば、`git config --global user.name my-buildbot`とすることで、Screwdriverのビルドからの`git`コミットは`my-buildbot`ユーザーによって行われ、webhookプロセッサに無視されることなく、Screwdriverパイプラインが実行されます。
