---
layout: main
title: Where to Contribute
category: About
menu: menu
toc:
    - title: Where to Contribute
      url: "#where-to-contribute"
    - title: Screwdriver API
      url: "#screwdriver-api"
    - title: "Models"
      url: "#models"
      subitem: true
    - title: Datastores
      url: "#datastores"
      subitem: true
    - title: Source Code Management (SCM)
      url: "#source-code-management"
      subitem: true
    - title: Notifications
      url: "#notifications"
      subitem: true
    - title: Parsers
      url: "#parsers"
      subitem: true
    - title: "Templates and Commands"
      url: "#templates-and-commands"
      subitem: true
    - title: Launcher
      url: "#launcher"
    - title: Queue
      url: "#queue"
    - title: Executors
      url: "#executors"
      subitem: true
    - title: Artifacts
      url: "#artifacts"    
    - title: UI
      url: "#ui"
    - title: Guide and Homepage
      url: "#guide-and-homepage"
    - title: Miscellaneous Tools
      url: "#miscellaneous-tools"
    - title: Bootstrap SD
      url: "#bootstrap-sd"
      subitem: true
    - title: Other
      url: "#other"
      subitem: true
    - title: Adding a New Screwdriver Repo
      url: "#adding-a-new-screwdriver-repo"
    - title: Screwdriver.cd Tests and Examples
      url: "#screwdriver.cd-tests-and-examples"
---
# Where to Contribute

Screwdriver has a modular architecture, and the various responsibilities are split up into separate repos.

Check out the [architecture diagram][arch-diagram] to see the overall workflow of Continuous Delivery using Screwdriver. The next few sections will help lay out where different code repositories fit.

## Screwdriver API

The **[screwdriver][api-repo]** repo is the core of screwdriver, providing the API endpoints for everything that screwdriver does. The API is based on the *[hapijs framework](http://hapijs.com/)* and is implemented in node as a series of plugins.

* **[Build bookends][build-bookend-repo]** allows a user to create setup and teardown steps for builds.

* The API can also uploading code coverage reports and/or test results. [coverage-bookend][coverage-bookend-repo] defines the relationship between Screwdriver and coverage bookends. [coverage-base][coverage-base-repo] is the base class for defining the behavior between Screwdriver coverage bookend plugins, like [coverage-sonar][coverage-sonar-repo].

#### Models

The object models provide the definition of the data that is saved in datastores (analogous to databases). This is done in two parts:

* **[data-schema][data-schema-repo]**: Schema definition with *[Joi](https://www.npmjs.com/package/joi)*
* **[models][models-repo]**: Specific business logic around the data schema

#### Datastores

A datastore implementation is used as the interface between the API and a data storage mechanism. There are several implementations written in node around a common interface.

* **[datastore-base][datastore-base-repo]**: Base class defining the interface for datastore implementations
* **[datastore-sequelize][datastore-sequelize-repo]**: MySQL, PostgreSQL, SQLite3, and MS SQL implementations

#### Source Code Management

An SCM implementation is used as the interface between the API and an SCM. There are several implementations written in nodejs around a common interface.

* **[scm-base][scm-base-repo]**: Common interface
* **[scm-bitbucket][scm-bitbucket-repo]**: Bitbucket.org implementation
* **[scm-github][scm-github-repo]**: GitHub implementation
* **[scm-gitlab][scm-gitlab-repo]**: GitLab implementation
* **[sd-repo][sd-repo-repo]**: A Go-based tool for executing the Repo workflow for `getCheckoutCommand` in [scm-github][scm-github-repo]

The [scm-router][scm-router-repo] is a generic scm plugin that routes builds to a specified scm.

#### Notifications
The API can also send notifications to users.

* **[notifications-base][notifications-base-repo]**: The base class for defining the behavior between Screwdriver and notifications plugins
* **[notifications-email][notifications-email-repo]**: Email implementation
* **[notifications-slack][notifications-slack-repo]**: Slack implementation

#### Parsers
Parsers help validate and parse various flows in Screwdriver.

* **[config-parser][config-parser-repo]**: A node module for validating and parsing user's `screwdriver.yaml` configurations
* **[workflow-parser][workflow-parser-repo]**: A node module for parsing and converting pipeline configuration into a workflow graph

#### Templates and Commands

Templates are snippets of predefined code that people can use to replace a job definition in their `screwdriver.yaml`. A template contains a series of predefined steps along with a selected Docker image.

* **[templates][templates-repo]**: A repo for all build templates
* **[template-main][template-main-repo]**: The CLI for validating and publishing job templates
* **[template-validator][template-validator-repo]**: A tool used by the API to validate a job template
* **[tmpl-semantic-release][tmpl-semantic-release-repo]**: A template that performs a semantic-release for NPM-based modules

Commands are snippets of predefined code that people can use to replace a step definition in their `screwdriver.yaml`. A command contains a series of predefined commands.

* **[command-validator][command-validator-repo]**: A tool used by the API to validate a command
* **[cmd-install-node][cmd-install-node-repo]**: Shared command to install node.js using nvm
* **[cmd-docker-trigger][cmd-docker-trigger-repo]**: Shared command to trigger Docker build for master and a specified tag
* **[junit-reports][junit-reports-repo]**: Shared command to parse Junit reports

## Launcher

The **[launcher][launcher-repo]** performs step execution and housekeeping internal to build containers. This is written in Go and mounted into build containers as a binary.

* **[sd-cmd][sd-cmd-repo]**: A Go-based CLI for sharing binaries which provides a single interface for executing a versioned command (via remote binary, docker image, or habitat package) during a Screwdriver build
* **[sd-packages][sd-packages-repo]**: Builds, packages, and publishes skopeo and zstd and other custom binaries for Launcher
* **[sd-step][sd-step-repo]**: A Shared Step allows people to use the same packages and commands in all build containers, regardless of build environment
* **[meta-cli][meta-cli-repo]**: A Go-based CLI for reading/writing information from the metadata

## Queue

The **[queue-service][queue-service-repo]** is a highly available REST based queue service for Screwdriver to enqueue builds and process them.
It makes use of [Resque][node-resque-URL] to add a queueing mechanism.

* **[buildcluster-queue-worker][buildcluster-queue-worker-repo]**: An amqp connection manager implementation that consumes jobs from Rabbitmq queue

#### Executors

An executor is used to manage build containers for any given job. Several implementations of executors have been created. All are designed to follow a common interface. Executor implementations are written in node:

* **[executor-base][executor-base-repo]**: Common interface
* **[executor-docker][executor-docker-repo]**: Docker implementation
* **[executor-j5s](https://github.com/screwdriver-cd/executor-j5s)**: Jenkins implementation
* **[executor-k8s][executor-k8s-repo]**: Kubernetes implementation
* **[executor-nomad][executor-nomad-repo]**: Nomad implementation

The **[executor-queue][executor-queue-repo]** is a generic executor plugin that routes builds through a Redis queue.
The **[executor-router][executor-router-repo]** is a generic executor plugin that routes builds to a specified executor.

## Artifacts

The **[Artifact Store][store-repo]** (not to be confused with the datastores mentioned above) is used for saving log outputs, shared steps, templates, test coverage, and any artifacts that are generated during a build. 

* **[artifact-bookend][artifact-bookend-repo]**: Bookend for uploading artifacts to the store
* **[cache-bookend][cache-bookend-repo]**: Bookend for uploading and downloading build cache
* **[log service][log-service-repo]**: A Go tool for reading logs from the Launcher and uploading them to the store
* **[store-cli][store-cli-repo]**: A Go-based CLI for communicating with the Screwdriver store

## UI

The **[UI][ui-repo]** is an Ember-based user interface of Screwdriver.

## Guide and Homepage

The **[Guide][guide-repo]** is documentation! Everything you ever hoped to know about the Screwdriver project.
The **[Homepage][homepage-repo]** is the basic one-pager that powers [Screwdriver.cd][homepage].
The **[Community][community-repo]** is where open source community meeting notes and docs are kept.


## Miscellaneous Tools

#### Bootstrap SD
These repos help you get started running Screwdriver.

* **[aws-build-cluster][aws-build-cluster-repo]**: Quickstart tool to provision necessary EKS cluster and cloud infrastructure resources required by Screwdriver build cluster on AWS
* **[hyperctl-image][hyperctl-image-repo]**: Creates a minimal Docker image containing hyperctl and k8s-vm scripts (used in screwdriver-chart)
* **[in-a-box][in-a-box-repo]**: Python-based executable for bringing up an entire Screwdriver instance (UI, API, and log store) locally
* **[screwdriver-chart][screwdriver-chart-repo]**: Bootstraps the whole Screwdriver ecosystem and also nginx ingress controller
* **[sd-local][sd-local-repo]**: A Go-based tool for running a more feature-complete local Screwdriver
* **[sonar-pipeline][sonar-pipeline-repo]**: Pipeline to deploy SonarQube server to Kubernetes

#### Other
* **[circuit-fuses][circuit-fuses-repo]**: Wrapper to provide a node-circuitbreaker with callback interface
* **[gitversion][gitversion-repo]**: Go-based tool for updating git tags on a repo for a new version number
* **[keymbinatorial][keymbinatorial-repo]**: Generates the unique combinations of key values by taking a single value from each keys array
* **[logger][logger-repo]**: Common logging provider for Screwdriver components
* **[noop-container][noop-container-repo]**: Bare minimum Docker container for running builds
* **[raptor][raptor-repo]**: Load test scripts for Screwdriver API
* **[sd-housekeeping][sd-housekeeping-repo]**: Repo containing House Keeping scripts like a bulk pipeline validator
* **[toolbox][toolbox-repo]**: Repository for handy Screwdriver-related scripts and other tools

## Adding a New Screwdriver Repo

We have some tools to help start out new repos for Screwdriver:

* **[generator-screwdriver](https://github.com/screwdriver-cd/generator-screwdriver)**: Yeoman generator that bootstraps new repos for screwdriver
* **[eslint-config-screwdriver](https://github.com/screwdriver-cd/eslint-config-screwdriver)**: Our ESLint rules for node-based code. Included in each new repo as part of the bootstrap process

If you create a new repo, please come back and edit [this page][contributing-docs] so that others can know where your repo fits in.

## Screwdriver.cd Tests and Examples

The organization **[screwdriver-cd-test][screwdriver-cd-test-org]** contains various example repos/screwdriver.yamls and acceptance tests for Screwdriver.cd.

[api-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg
[api-issues-url]: https://github.com/screwdriver-cd/screwdriver/issues
[api-repo]: https://github.com/screwdriver-cd/screwdriver
[arch-diagram]: ../../cluster-management/#overall-architecture
[artifact-bookend-repo]: https://github.com/screwdriver-cd/artifact-bookend
[aws-build-cluster-repo]: https://github.com/screwdriver-cd/aws-build-cluster
[build-bookend-repo]: https://github.com/screwdriver-cd/build-bookend
[buildcluster-queue-worker-repo]: https://github.com/screwdriver-cd/buildcluster-queue-worker
[cache-bookend-repo]: https://github.com/screwdriver-cd/cache-bookend
[circuit-fuses-repo]: https://github.com/screwdriver-cd/circuit-fuses
[command-validator-repo]: https://github.com/screwdriver-cd/command-validator
[community-repo]: https://github.com/screwdriver-cd/community
[cmd-install-node-repo]: https://github.com/screwdriver-cd/cmd-install-node
[cmd-docker-trigger-repo]: https://github.com/screwdriver-cd/cmd-docker-trigger
[config-parser-repo]: https://github.com/screwdriver-cd/config-parser
[contributing-docs]: https://github.com/screwdriver-cd/guide/blob/master/docs/about/contributing/where-to-contribute.md
[coverage-base-repo]: https://github.com/screwdriver-cd/coverage-base
[coverage-bookend-repo]: https://github.com/screwdriver-cd/coverage-bookend
[coverage-sonar-repo]: https://github.com/screwdriver-cd/coverage-sonar
[data-schema-repo]: https://github.com/screwdriver-cd/data-schema
[datastore-base-repo]: https://github.com/screwdriver-cd/datastore-base
[datastore-sequelize-repo]: https://github.com/screwdriver-cd/datastore-sequelize
[executor-base-repo]: https://github.com/screwdriver-cd/executor-base
[executor-docker-repo]: https://github.com/screwdriver-cd/executor-docker
[executor-j5s-repo]: https://github.com/screwdriver-cd/executor-j5s
[executor-k8s-repo]: https://github.com/screwdriver-cd/executor-k8s
[executor-nomad-repo]: https://github.com/lgfausak/executor-nomad
[executor-queue-repo]: https://github.com/screwdriver-cd/executor-queue
[executor-router-repo]: https://github.com/screwdriver-cd/executor-router
[gitversion-repo]: https://github.com/screwdriver-cd/gitversion
[guide-repo]: https://github.com/screwdriver-cd/guide
[homepage-repo]: https://github.com/screwdriver-cd/homepage
[homepage]: https://screwdriver.cd
[hyperctl-image-repo]: https://github.com/screwdriver-cd/hyperctl-image
[in-a-box-repo]: https://github.com/screwdriver-cd/in-a-box
[junit-reports-repo]: https://github.com/screwdriver-cd/junit-reports
[keymbinatorial-repo]: https://github.com/screwdriver-cd/keymbinatorial
[launcher-repo]: https://github.com/screwdriver-cd/launcher
[log-service-repo]: https://github.com/screwdriver-cd/log-service
[logger-repo]: https://github.com/screwdriver-cd/logger
[meta-cli-repo]: https://github.com/screwdriver-cd/meta-cli
[models-repo]: https://github.com/screwdriver-cd/models
[node-resque-URL]: https://github.com/actionhero/node-resque
[noop-container-repo]: https://github.com/screwdriver-cd/noop-container
[notifications-base-repo]: https://github.com/screwdriver-cd/notifications-base
[notifications-email-repo]: https://github.com/screwdriver-cd/notifications-email
[notifications-slack-repo]: https://github.com/screwdriver-cd/notifications-slack
[queue-service-repo]: https://github.com/screwdriver-cd/queue-service
[raptor-repo]: https://github.com/screwdriver-cd/raptor
[scm-base-repo]: https://github.com/screwdriver-cd/scm-base
[scm-bitbucket-repo]: https://github.com/screwdriver-cd/scm-bitbucket
[scm-github-repo]: https://github.com/screwdriver-cd/scm-github
[scm-gitlab-repo]: https://github.com/screwdriver-cd/scm-gitlab
[screwdriver-cd-test-org]: https://github.com/screwdriver-cd-test
[screwdriver-chart-repo]: https://github.com/screwdriver-cd/screwdriver-chart
[sd-cmd-repo]: https://github.com/screwdriver-cd/sd-cmd
[sd-housekeeping-repo]: https://github.com/screwdriver-cd/sd-housekeeping
[sd-local-repo]: https://github.com/screwdriver-cd/sd-local
[sd-packages-repo]: https://github.com/screwdriver-cd/sd-packages
[sd-repo-repo]: https://github.com/screwdriver-cd/sd-repo
[sd-step-repo]: https://github.com/screwdriver-cd/sd-step
[sonar-pipeline-repo]: https://github.com/screwdriver-cd/sonar-pipeline
[store-repo]: https://github.com/screwdriver-cd/store
[store-cli-repo]: https://github.com/screwdriver-cd/store-cli
[tmpl-semantic-release-repo]: https://github.com/screwdriver-cd/tmpl-semantic-release
[template-main-repo]: https://github.com/screwdriver-cd/template-main
[template-validator-repo]: https://github.com/screwdriver-cd/template-validator
[templates-repo]: https://github.com/screwdriver-cd/templates
[toolbox-repo]: https://github.com/screwdriver-cd/toolbox
[ui-repo]: https://github.com/screwdriver-cd/ui
[workflow-parser-repo]: https://github.com/screwdriver-cd/workflow-parser
