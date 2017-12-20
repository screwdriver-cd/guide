---
layout: main
title: Job Configuration
category: User Guide
menu: menu
toc:
    - title: Job Configuration
      url: "#job-configuration"
    - title: Image
      url: "#image"
    - title: Steps
      url: "#steps"
    - title: Shared Configuration
      url: "#shared"
---
# Job configuration
Jobs are how you define what happens in every build. Every job configuration must consist of an `image` and a list of `steps`, or a `template`.

#### Example
```
jobs:
    main:
        image: node:6
        steps:
            - init: npm install
            - test: npm test
    main2: 
        template: example/mytemplate@stable
```

## Image
The `image` configuration refers to a docker image, e.g. an container from (hub.docker.com)[https://hub.docker.com]. You can specify an image from a custom registry by specifying the full url to that image.

#### Example
```
jobs:
    main:
        image: my-custom-registry.example.com/myorg/myimage:label
        steps:
            - step1: echo hello
```

## Steps
Steps are the list of instructions you want to execute in your build. These should be defined as:
`step_name: step_command`. Steps will be executed in the order they are defined.

#### Example
```
jobs:
    main:
        image: node:8
        steps:
            - step_name: step_command --arg1 --arg2 foo
            - greet: echo Hello
```


# Shared
The `shared` configuration is a special job configuration section that is applied to all jobs. Configuration that is specified in a job configuration will override the same configuration in `shared`.

#### Example
The following example defines a shared configuration for `image` and `steps`, which is used by the main and main2 jobs.
```
shared:
    image: node:8
    steps:
        - init: npm install
        - test: npm test

jobs:
    main:
        image: node:6
    main2:
        steps:
            - greet: echo hello
```

The above example would be equivalent to:
```
jobs:
    main:
        image: node:6
        steps:
            - init: npm install
            - test: npm test
    main2:
        image: node:8
        steps:
            - greet: echo hello

```

### See also:
* [Annotations](/user-guide/configuration/annotations) - Freeform key/value store, often used to configure build execution settings
* [Environment](/user-guide/configuration/environment) - Define environment variables for jobs
* [Secrets](/user-guide/configuration/secrets) - Securely pass secrets as environment variables into the build
* [Settings](/user-guide/configuration/settings) - Define configuration of build plugins
* [Templates](/user-guide/templates) - Common, community supported job configurations
* [Workflow](/user-guide/configuration/workflow) - Define the path of the pipeline
