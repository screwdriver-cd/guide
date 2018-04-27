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

設定可能な settings として、ビルドプラグインが Screwdriver.cd に追加されています。

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
送信先となる1つ以上の Email アドレスを設定できます。
また、Email 通知を送信するタイミングも設定できます。例えば、ビルドステータスが `SUCCESS` または `FAILURE` になった時に送信したければ、以下の例のように設定します。

#### 例

```
        settings:
            email:
                addresses: [test@email.com, test2@email.com]
                statuses: [SUCCESS, FAILURE]
```

## Slack

Slack 通知を有効にしてビルドの結果を送信するには、`screwdriver-bot` をチャンネルに招待し、Slack の settings を利用します。 送信先となる1つ以上の Slack チャンネルを設定できます。 また、Slack 通知を送信するタイミングも設定できます。例えば、ビルドステータスが `SUCCESS` または `FAILURE` になった場合、などです。

#### 例

このSlack設定では、全てのビルドステータスに応じて `mychannel` と `my-other-channel` にSlack通知を送信します:

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

ビルド成功通知の例:

![Slack notification](../../../user-guide/assets/slack-notification.png)
