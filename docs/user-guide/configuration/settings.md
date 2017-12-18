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