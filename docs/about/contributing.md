# Contributing

Thank you for considering contributing! There are many ways you can help.

## Issues

File an issue if you think you've found a bug. Be sure to describe:

1. How it can be reproduced
2. What did you expect to happen?
3. What actually happened?
4. Version, platform, etc. if relevant

You can file all issues with Screwdriver in the [screwdriver repo][api-issues-url]; please tag with appropriate Github labels whenever possible. We will update any issues we're working on with a daily summary. To see what we're currently working on, you can check out our [digital scrum board](https://github.com/screwdriver-cd/screwdriver/projects/4) in the Projects section of the [Screwdriver API repo][api-repo].

## Docs

Documentation, READMEs, and examples are extremely important. Please help us improve them; if you find a typo or notice a problem, feel free to send a fix or create an issue.

## Submitting Patches

Patches for fixes, features, and improvements are accepted through pull requests.

* Write good commit messages in the present tense ("Add X", not "Added X") with a short title, blank line, and bullet points if needed. Capitalize the first letter of the title and any bullet items. No punctuation in the title.
* Code must pass lint and style checks.
* All external methods must be documented. Add README docs and/or user documentation in our [guide][guide-repo] when appropriate.
* Include tests to improve coverage and prevent regressions.
* Squash changes into a single commit per feature/fix. Ask if you're unsure how to discretize your work.
* Whenever possible, tag your pull request with appropriate Github labels.

Please ask before embarking on a large improvement so you're not disappointed if it does not align with the goals of the project or owner(s).

### Commit Message Format

We use [semantic-release](https://www.npmjs.com/package/semantic-release), which requires commit messages to be in this specific format: `<type>(<scope>): <subject>`

* Types:
  * feat (feature)
  * fix (bug fix)
  * docs (documentation)
  * style (formatting, missing semi colons, …)
  * refactor
  * test (when adding missing tests)
  * chore (maintain)
* Scope: anything that specifies the scope of the commit; can be blank, the issue number that your commit pertains to, or `*`
* Subject: description of the commit

**Important:** For any **breaking changes** that require a major version bump, add `BREAKING CHANGE` somewhere in the commit title or message.

**Examples commit titles:**
* For a bug fix: `fix: Remove extra space`
* For a breaking change: `feat(scm): Support new scm plugin. BREAKING CHANGE: github no longer works`

## Feature Requests

Make the case for a feature via an issue with a good title. The feature will then be discussed and either given a target inclusion milestone or closed.

## Where to Contribute

Screwdriver has a modular architecture, and the various responsibilities are split up into separate repos.

Check out the [architecture diagram](arch-diagram) to see the overall workflow of Continuous Delivery using Screwdriver. The next few sections will help lay out where different code repositories fit.

### [Screwdriver API][api-repo]
The **[screwdriver][api-repo]** repo is the core of screwdriver, providing the API endpoints for everything that screwdriver does. The API is based on the *[hapijs framework](http://hapijs.com/)* and is implemented in node as a series of plugins.


* **[Build bookends][build-bookend-repo]** allow a user to create setup and teardown steps for builds.
* The API can also send notifications to users. [notifications-base][notifications-base-repo] is the base class for defining the behavior between screwdriver and notifications plugins, like [email notifications][notifications-email-repo].

### [Launcher][launcher-repo]

The **[launcher][launcher-repo]** performs step execution and housekeeping internal to build containers. This is written in Go and mounted into build containers as a binary.

* **[sd-step][sd-step-repo]**: A Shared Step allows people to use the same packages and commands in all build containers, regardless of build environment
* **[meta-cli][meta-cli-repo]**: A Go-based CLI for reading/writing information from the metadata

### Executors

An executor is used to manage build containers for any given job. Several implementations of executors have been created. All are designed to follow a common interface. Executor implementations are written in node:

* **[executor-base][executor-base-repo]**: Common interface
* **[executor-docker][executor-docker-repo]**: Docker implementation
* **[executor-j5s](https://github.com/screwdriver-cd/executor-j5s)**: Jenkins implementation
* **[executor-k8s][executor-k8s-repo]**: Kubernetes implementation
* **[executor-k8s-vm][executor-k8s-vm-repo]**: Kubernetes VM implementation

The [executor router][executor-router-repo] is a generic executor plugin that routes builds to a specified executor.

### Models

The object models provide the definition of the data that is saved in datastores (analogous to databases). This is done in two parts:

* **[data-schema][dataschema-repo]**: Schema definition with *[Joi](https://www.npmjs.com/package/joi)*
* **[models][models-repo]**: Specific business logic around the data schema

### Datastores

A datastore implementation is used as the interface between the API and a data storage mechanism. There are several implementations written in node around a common interface.

* **[datastore-base][datastore-base-repo]**: Base class defining the interface for datastore implementations
* **[datastore-sequelize][datastore-sequelize-repo]**: MySQL, PostgreSQL, SQLite3, and MS SQL implementations
* **[datastore-dynamodb][datastore-dynamodb-repo]**: DynamoDB implementation, with [dynamic-dynamodb][dynamic-dynamodb-repo] being used to create the datastore tables for it

### Artifacts

The [Artifact Store][store-repo] (not to be confused with the datastores mentioned above) is used for saving log outputs, shared steps, templates, test coverage, and any artifacts that are generated during a build. The [log service][log-service-repo] is a Go tool for reading logs from the Launcher and uploading them to the store. The [artifact-bookend][artifact-bookend-repo] is used for uploading artifacts to the store.

### Source Code Management

An SCM implementation is used as the interface between the API and an SCM. There are several implementations written in nodejs around a common interface.

* **[scm-base][scm-base-repo]**: Common interface
* **[scm-bitbucket][scm-bitbucket-repo]**: Bitbucket implementation
* **[scm-github][scm-github-repo]**: Github implementation

### Templates

Templates are snippets of predefined code that people can use to replace a job definition in their `screwdriver.yaml`. A template contains a series of predefined steps along with a selected Docker image.

* **[templates][templates-repo]**: A repo for all build templates
* **[template-main][template-main-repo]**: The CLI for validating and publishing job templates
* **[template-validator][template-validator-repo]**: A tool used by the API to validate a job template

### [Config Parser][config-parser-repo]

Node module for validating and parsing user's `screwdriver.yaml` configurations.

### [Guide][guide-repo] & [Homepage][homepage-repo]

The [Guide][guide-repo] is documentation! Everything you ever hoped to know about the Screwdriver project.
The [Homepage][homepage-repo] is the basic one-pager that powers [Screwdriver.cd][homepage].

### [UI][ui-repo]

The Ember-based user interface of Screwdriver.

### Miscellaneous Tools

* **[circuit-fuses][circuit-fuses-repo]**: Wrapper to provide a node-circuitbreaker with callback interface
* **[client][client-repo]**: Simple Go-based CLI for accessing the Screwdriver API
* **[gitversion][gitversion-repo]**: Go-based tool for updating git tags on a repo for a new version number
* **[keymbinatorial][keymbinatorial-repo]**: Generates the unique combinations of key values by taking a single value from each keys array
* **[toolbox][toolbox-repo]**: Repository for handy Screwdriver-related scripts and other tools
* **[hashr][hashr-repo]**: Wrapper module for generating ids based on a hash

### Adding a New Screwdriver Repo

We have some tools to help start out new repos for screwdriver:

* **[generator-screwdriver](https://github.com/screwdriver-cd/generator-screwdriver)**: Yeoman generator that bootstraps new repos for screwdriver
* **[eslint-config-screwdriver](https://github.com/screwdriver-cd/eslint-config-screwdriver)**: Our ESLint rules for node-based code. Included in each new repo as part of the bootstrap process

If you create a new repo, please come back and edit this [page](contributing-docs) so that others can know where your repo fits in.

### Screwdriver.cd Tests and Examples

The organization [screwdriver-cd-test][screwdriver-cd-test-org] contains various example repos/screwdriver.yamls and acceptance tests for Screwdriver.cd.

[api-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg
[api-issues-url]: https://github.com/screwdriver-cd/screwdriver/issues
[api-repo]: https://github.com/screwdriver-cd/screwdriver
[arch-diagram]: http://docs.screwdriver.cd/cluster-management/#overall-architecture
[artifact-bookend-repo]: https://github.com/screwdriver-cd/artifact-bookend
[build-bookend-repo]: https://github.com/screwdriver-cd/build-bookend
[circuit-fuses-repo]: https://github.com/screwdriver-cd/circuit-fuses
[client-repo]: https://github.com/screwdriver-cd/client
[config-parser-repo]: https://github.com/screwdriver-cd/config-parser
[contributing-docs]: https://github.com/screwdriver-cd/guide/blob/master/docs/about/contributing.md
[dataschema-repo]: https://github.com/screwdriver-cd/data-schema
[datastore-base-repo]: https://github.com/screwdriver-cd/datastore-base
[datastore-dynamodb-repo]: https://github.com/screwdriver-cd/datastore-dynamodb
[datastore-sequelize-repo]: https://github.com/screwdriver-cd/datastore-sequelize
[dynamic-dynamodb-repo]: https://github.com/screwdriver-cd/dynamic-dynamodb
[executor-base-repo]: https://github.com/screwdriver-cd/executor-base
[executor-docker-repo]: https://github.com/screwdriver-cd/executor-docker
[executor-j5s-repo]: https://github.com/screwdriver-cd/executor-j5s
[executor-k8s-repo]: https://github.com/screwdriver-cd/executor-k8s
[executor-k8s-vm-repo]: https://github.com/screwdriver-cd/executor-k8s-vm
[executor-router-repo]: https://github.com/screwdriver-cd/executor-router
[gitversion-repo]: https://github.com/screwdriver-cd/gitversion
[guide-repo]: https://github.com/screwdriver-cd/guide
[hashr-repo]: https://github.com/screwdriver-cd/hashr
[homepage-repo]: https://github.com/screwdriver-cd/homepage
[homepage]: http://screwdriver.cd/
[job-tools-repo]: https://github.com/screwdriver-cd/job-tools
[keymbinatorial-repo]: https://github.com/screwdriver-cd/keymbinatorial
[launcher-repo]: https://github.com/screwdriver-cd/launcher
[log-service-repo]: https://github.com/screwdriver-cd/log-service
[meta-cli-repo]: https://github.com/screwdriver-cd/meta-cli
[models-repo]: https://github.com/screwdriver-cd/models
[notifications-base-repo]: https://github.com/screwdriver-cd/notifications-base
[notifications-email-repo]: https://github.com/screwdriver-cd/notifications-email
[scm-base-repo]: https://github.com/screwdriver-cd/scm-base
[scm-bitbucket-repo]: https://github.com/screwdriver-cd/scm-bitbucket
[scm-github-repo]: https://github.com/screwdriver-cd/scm-github
[screwdriver-cd-test-org]: https://github.com/screwdriver-cd-test
[sd-step-repo]: https://github.com/screwdriver-cd/sd-step
[store-repo]: https://github.com/screwdriver-cd/store
[template-main-repo]: https://github.com/screwdriver-cd/template-main
[template-validator-repo]: https://github.com/screwdriver-cd/template-validator
[templates-repo]: https://github.com/screwdriver-cd/templates
[toolbox-repo]: https://github.com/screwdriver-cd/toolbox
[ui-repo]: https://github.com/screwdriver-cd/ui
