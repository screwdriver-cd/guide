---
layout: main
title: Settings
category: User Guide
menu: menu
toc:
    - title: Settings
      url: "#settings"
    - title: Email
      url: "#email"
    - title: Slack
      url: "#slack"
---
# Settings
Configurable settings for any additional build plugins added to Screwdriver.cd.

The settings can be set in `shared`, to apply to all jobs, or in an individual job. A job-level setting will completely override the `shared` setting.

If you don't configure the build status, the notification will default to sending notifications on `FAILURE` only.

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
To enable emails to be sent as a result of build events, use the email setting.
You can configure a list of one or more email addresses to contact. You can also configure when to send an email, e.g. when the build status is `SUCCESS` and/or `FAILURE`.

#### Example
```
        settings:
            email:
                addresses: [test@email.com, test2@email.com]
                statuses: [SUCCESS, FAILURE]
```

## Slack
To enable Slack notifications to be sent as a result of build events, invite the `screwdriver-bot` Slack bot to your channel(s) and use the Slack setting in your Screwdriver yaml. Both public and private channels are supported. You can configure a list of one or more Slack channels to notify. 

You can also configure when to send a Slack notification, e.g. when the build status is `SUCCESS` and/or `FAILURE`. If no `statuses` field is set, the build will only send notifications for build failures. For a full list of statuses, see the [data-schema](https://github.com/screwdriver-cd/data-schema/blob/c2ea9b0372c6e62cb81e1f50602b751d0b10d547/models/build.js#L83-L96).

To send data in steps as notification, [notification meta](https://docs.screwdriver.cd/user-guide/metadata.html#notification) is available.

#### Example: Multiple Rooms

The value of the `slack` setting can be an array of multiple channels.

```
        settings:
            slack: [mychannel, my-other-channel]
```

#### Example: Notify on build statuses

This Slack setting will send Slack notifications to `mychannel` and `my-other-channel` on all build statuses:

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

Success notification:

![Slack notification](../assets/slack-notification.png)
