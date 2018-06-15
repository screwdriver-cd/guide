---
layout: main
title: External Config
category: User Guide
menu: menu
toc:
    - title: External Config
      url: "#external-config"

---
# External Config
External config allows a single parent pipeline to create and manage a list of child pipelines with job configuration from parent's `screwdriver.yaml` and source code from itself.

This feature will benefit users who owning multiple pipelines with same building patterns to manage all pipelines easily.

## Configure external config in parent pipeline
In your parent repository's `screwdriver.yaml`, you can define child pipelines with syntax `childPipelines`. We will create child pipelines with the specified scmUrls for you. Please make sure you have **admin** access towards child repositories otherwise we won't create the child pipeline.

```yaml
childPipelines:
   scmUrls:
      - git@github.com:minz1027/test.template.git
      - git@github.com:minz1027/quickstart-generic.git#master

jobs:
    main:
        image: node:8
        steps:
            - install: npm install
            - publish: npm publish
```

## Parent and Child Relationship
| Pipeline        | Permissions           |
| ------------- |:-------------:|
| Parent     | Everything on itself and add/remove/update/start child pipelines |
| Child      | Everything on itself except delete itself and update checkout url; override/reset secrets inherited from parent | 

## User Interface
Parent pipeline UI:
![External config parent](../assets/external-config.png)

Child pipeline UI:
![External config child pipeline ](../assets/external-config-child.png)
