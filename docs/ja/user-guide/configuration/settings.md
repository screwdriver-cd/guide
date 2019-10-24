---
layout: main
title: Settings
category: User Guide
menu: menu_ja
toc:
- title: Settings
  url: "#settings"
- title: Email
  url: "#email"
- title: Slack
  url: "#slack"
---

# Settings

Screwdriver.cd に追加されているビルドプラグインで利用可能な settings です。

この settings は `shared` で設定することで全てのジョブに適用されます。また、個別のジョブで設定することも可能です。個別のジョブでの設定は `shared` での設定を上書きします。

ビルドステータスを指定しなかった場合は、`FAILURE` に対してのみ通知が行われます。

```
shared:
    settings:
        email: [test@email.com, test2@email.com]
        slack: 'mychannel'

jobs:
    main:
        requires: [~pr, ~commit]
        template: example/mytemplate@stable
```

```
jobs:
    main:
        requires: [~pr, ~commit]
        template: example/mytemplate@stable
        settings:
            email: [test@email.com, test2@email.com]
            slack: 'mychannel'
```

## Email

Email 通知を有効にしてビルドの結果を送信するには、Email の settings を利用します。
送信先には1つ以上の Email アドレスを設定できます。
また、Email 通知を送信するタイミングも設定できます。例えば、ビルドステータスが `SUCCESS` または `FAILURE` になった時に送信したければ、以下の例のように設定します。

#### 例

```
        settings:
            email:
                addresses: [test@email.com, test2@email.com]
                statuses: [SUCCESS, FAILURE]
```

## Slack

Slack 通知を有効にしてビルドの結果を送信するには、`screwdriver-bot` をチャンネルに招待し、Slack の settings を利用します。パブリックチャンネルとプライベートチャンネルの両方をサポートしています。送信先には1つ以上の Slack チャンネルを設定できます。

また、Slack通知を送信するタイミングも設定できます。例えば、ビルドステータスが `SUCCESS` または `FAILURE` になった場合などです。`statuses`を設定しない場合はビルドが失敗した場合のみ通知します。ステータスの全リストは[data-schema](https://github.com/screwdriver-cd/data-schema/blob/c2ea9b0372c6e62cb81e1f50602b751d0b10d547/models/build.js#L83-L96)を参照してください。 `minimized` の設定を利用することで、よりコンパクトな形式の通知を利用することもできます。

ステップ内のデータを通知として送りたい場合には、[notification meta](https://docs.screwdriver.cd/ja/user-guide/metadata.html#通知)をご利用ください。

#### 例: 複数Roomの設定

`slack`の設定値には配列形式で複数のチャンネルを指定することができます。

```
        settings:
            slack: [mychannel, my-other-channel]
```

#### 例: ビルドステータスの通知

この Slack 設定では、全てのビルドステータスに応じて `mychannel` と `my-other-channel` に Slack 通知を送信します:

```
        settings:
            slack:
                channels:
                     - 'mychannel'
                     - 'my-other-channel'
                statuses:
                     - SUCCESS
                     - FAILURE
                     - ABORTED
                     - QUEUED
                     - RUNNING
```

サンプルリポジトリ: https://github.com/screwdriver-cd-test/slack-example

#### 例: 短縮した通知

デフォルトの通知形式はジョブのステータス、それに応じた絵文字、パイプラインへのリンクが含まれます。通知のアタッチメントにはビルドへのリンク、150字までのコミットメッセージ、コミットへのリンク、イベントのトリガーの説明が含まれます。

以下の Slack の設定だと、デフォルトの通知形式が使用されます。

```
        settings:
            slack:
                channels:
                    - 'mychannel'
                statuses:
                    - SUCCESS
```

![Default Slack notification](../../../user-guide/assets/slack-full-notification.png)

しかし、 `minimized` が `true` の場合には、ジョブへのリンク、ジョブのステータス、ビルドへのリンクのアタッチメントからなる通知形式が使用されます。

 ```
        settings:
            slack:
                channels:
                    - 'mychannel'
                statuses:
                    - SUCCESS
                minimized: true
```

 ![Minimized Slack notification](../../../user-guide/assets/slack-minimized-notification.png)
