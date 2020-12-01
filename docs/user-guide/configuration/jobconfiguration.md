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
# Job Configuration
Jobs are how you define what happens in every build. Every job configuration must consist of an `image` and a list of `steps`, or a `template`. It also defines trigger requirement for the job using `requires`. See [workflow](/user-guide/configuration/workflow) for detailed usage of `requires` to create pipeline workflow.

#### Example
```
jobs:
    main:
        requires: [~pr, ~commit]
        image: node:6
        steps:
            - init: npm install
            - test: npm test
    main2:
        requires: main
        template: example/mytemplate@stable
```

## Image
The `image` configuration refers to a docker image, e.g. an container from [hub.docker.com](https://hub.docker.com). You can specify an image from a custom registry by specifying the full url to that image.

#### Example
```
jobs:
    main:
        requires: [~pr, ~commit]
        image: my-custom-registry.example.com/myorg/myimage:label
        steps:
            - step1: echo hello
```

## Steps
Steps are the list of instructions you want to execute in your build. These should be defined as:
`step_name: step_command`. Steps will be executed in the order they are defined. Current working directory and environment variables are passed between steps.

You can also specify user teardown steps, which will be run regardless of whether the build succeeds or fails. These steps need to be at the end of the job and start with "teardown-".

Example repo: <https://github.com/screwdriver-cd-test/user-teardown-example>

By default, instructions in steps are executed using the Bourne shell (`/bin/sh`). If you prefer your build to use a different shell, you can configure `USER_SHELL_BIN`. For instance, to use capabilities that Bash provides but the Bourne shell does not, specify `USER_SHELL_BIN: bash` in a job's environment.

#### Example
```
jobs:
    main:
        requires: [~pr, ~commit]
        image: node:8
        environment:
            USER_SHELL_BIN: bash
        steps:
            - step_name: step_command --arg1 --arg2 foo
            - set_env: export FOO=bar
            - get_env: echo $FOO           # this will echo bar
            - cd: |
                pwd                        # prints '/sd/workspace/src/github.com/tkyi/mytest'
                cd ..
            - pwd: pwd                     # prints '/sd/workspace/src/github.com/tkyi'
            - bash-only: echo ${FOO%r}     # this will echo ba
            - fail: commanddoesnotexist
            - teardown-mystep1: echo goodbye
            - teardown-mystep2: echo world
```

## Teardown
The teardown steps run a set of screwdriver bookend steps after the build steps are completed or aborted or failed. These steps are implicity added at the end of job and start with "sd-teardown-". The pod/container is removed after these steps are completed. In case of aborted builds, we can also configure the grace period of the pod before termination during which the teardown steps will be executed. See [annotations](/user-guide/configuration/annotations) for detailed usage

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
        requires: [~pr, ~commit]
        image: node:6
    main2:
        requires: [main]
        steps:
            - greet: echo hello
```

The above example would be equivalent to:
```
jobs:
    main:
        requires: [~pr, ~commit]
        image: node:6
        steps:
            - init: npm install
            - test: npm test
    main2:
        requires: [main]
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
