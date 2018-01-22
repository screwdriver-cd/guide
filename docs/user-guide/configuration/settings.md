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

## Email
To enable emails to be sent as a result of build events, use the email setting.
You can configure a list of one or more email addresses to contact. You can also configure when to send an email, e.g. when the build status is `SUCCESS` and/or `FAILURE`.

### Example
```
shared:
    template: example/mytemplate@stable

jobs:
    main:
        settings:
            email:
                addresses: [test@email.com, test2@email.com]
                statuses: [SUCCESS, FAILURE]
```

The settings email configuration can be set in `shared`, to apply to all jobs, or in an individual job. A job `email` configuration will completely override the `shared` setting.

## Slack
To enable Slack notifications to be sent as a result of build events, invite the Slack user `screwdriver-bot` to your channel(s) and use the Slack setting in your Screwdriver yaml.
You can configure a list of one or more Slack channels to notify. You can also configure when to send a slack notification, e.g. when the build status is `SUCCESS` and/or `FAILURE`. If you don't configure the build status, it'll default to sending notifications on `FAILURE` only.

### Examples

This simple Slack setting will only send Slack notifications to `mychannel` on build failures:

```
shared:
    template: example/mytemplate@stable

jobs:
    main:
        settings:
            slack: 'mychannel'
```

This Slack setting will send Slack notifications to `mychannel` and `my-other-channel` on build failures:

```
shared:
    template: example/mytemplate@stable

jobs:
    main:
        settings:
            slack:
                channels: ['mychannel', 'my-other-channel']
```

This Slack setting will send Slack notifications to `mychannel` and `my-other-channel` on all build statuses:

```
shared:
    template: example/mytemplate@stable

jobs:
    main:
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
### Example success notification

![Slack notification](../assets/slack-notification.png)

The settings slack configuration can be set in `shared`, to apply to all jobs, or in an individual job. A job `slack` configuration will completely override the `shared` setting.
