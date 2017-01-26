# Contributing

Thank you for considering contributing! There are many ways you can help.

## Issues

File an issue if you think you've found a bug. Be sure to describe

1. How can it be reproduced?
2. What did you expect?
3. What actually occurred?
4. Version, platform, etc. if possibly relevant.

You can file all issues with Screwdriver in the [screwdriver repo][api-issues-url]. We will update any issues we're working on with a daily summary. To see what we're currently working on, you can check out our [digital scrum board](https://github.com/screwdriver-cd/screwdriver/projects/4) in the Projects section in the [Screwdriver API repo][api-repo].

## Docs

Documentation, READMEs, and examples are extremely important. Please help improve them and if you find a typo or notice a problem, feel free to send a fix or say something.

## Submitting Patches

Patches for fixes, features, and improvements are accepted through pull requests.

* Write good commit messages, in the present tense! (Add X, not Added X). Short title, blank line, bullet points if needed. Capitalize the first letter of the title or bullet item. No punctuation in the title.
* Code must pass lint and style checks.
* All external methods must be documented. Add README docs and/or user documentation in our [guide][guide-repo] when appropriate.
* Include tests to improve coverage and prevent regressions.
* Squash changes into a single commit per feature/fix. Ask if you're unsure how to discretize your work.

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
* Scope: anything that specifies the scope of the commit. Can be blank or `*`
* Subject: description of the commit. For **breaking changes** that require major version bump, add `BREAKING CHANGE` to the commit message.

**Examples commit messages:**
* Bug fix: `fix: Remove extra space`
* Breaking change: `feat(scm): Support new scm plugin. BREAKING CHANGE: github no longer works`

## Feature Requests

Make the case for a feature via an issue with a good title. The feature should be discussed and given a target inclusion milestone or closed.

## Where to Contribute

Screwdriver has a modular architecture, and the various responsibilities are split up in separate repos.

### [Screwdriver API][api-repo] [![Version][api-npm-image]][api-npm-url] [![Open Issues][api-issues-image]][api-issues-url]
The **[screwdriver][api-repo]** repo is the core of screwdriver, providing the API endpoints for everything that screwdriver does. The API is based on the *[hapijs framework](http://hapijs.com/)* and is implemented in node as a series of plugins.

### [Launcher][launcher-repo]

The **[launcher][launcher-repo]** performs step execution and housekeeping internal to build containers. This is written in Go, and mounted into build containers as a binary.

### Executors

An executor is used to manage build containers for any given job. Several implementations of executors have been created. All are designed to follow a common interface. Executor implementations are written in node:

* **[executor-base][executor-base-repo]**: Common interface [![Version][executor-base-npm-image]][executor-base-npm-url]
* **[executor-docker][executor-docker-repo]**: Docker implementation [![Version][executor-docker-npm-image]][executor-docker-npm-url]
* **[executor-j5s](https://github.com/screwdriver-cd/executor-j5s)**: Jenkins implementation [![Version][executor-j5s-npm-image]][executor-j5s-npm-url]
* **[executor-k8s][executor-k8s-repo]**: Kubernetes implementation [![Version][executor-k8s-npm-image]][executor-k8s-npm-url]

### Models

The object models provide the definition of the data that is stored in data stores. This is done in two parts:

* **[data-schema][dataschema-repo]**: Schema definition with *[Joi](https://www.npmjs.com/package/joi)* [![Version][dataschema-npm-image]][dataschema-npm-url]
* **[models][models-repo]**: Specific business logic around the data schema [![Version][models-npm-image]][models-npm-url]

### Datastores

A datastore implementation is used as the interface between the API and a data storage mechanism. There are several implementations written in node around a common interface.

* **[datastore-base][datastore-base-repo]**: Common interface [![Version][datastore-base-npm-image]][datastore-base-npm-url]
* **[datastore-sequelize][datastore-sequelize-repo]**: Mysql, postgres, sqlite3 and mssql implementation [![Version][datastore-sequelize-npm-image]][datastore-sequelize-npm-url]

### Scms

An scm implementation is used as the interface between the API and an scm. There are several implementations written in node around a common interface.

* **[scm-base][scm-base-repo]**: Common interface [![Version][scm-base-npm-image]][scm-base-npm-url]
* **[scm-bitbucket][scm-bitbucket-repo]**: Bitbucket implementation [![Version][scm-bitbucket-npm-image]][scm-bitbucket-npm-url]
* **[scm-github][scm-github-repo]**: Github implementation [![Version][scm-github-npm-image]][scm-github-npm-url]

### [Config Parser][config-parser-repo] [![Version][config-parser-npm-image]][config-parser-npm-url]

Node module for validating and parsing user's `screwdriver.yaml` configurations.

### [Guide][guide-repo]

This documentation! Everything you ever hoped to know about the Screwdriver project.

### Miscellaneous Tools

* **[client][client-repo]**: Simple Go-based CLI for accessing the Screwdriver API
* **[gitversion][gitversion-repo]**: Go-based tool for updating git tags on a repo for a new version number
* **[circuit-fuses][circuit-fuses-repo]**: Wrapper to provide a node-circuitbreaker w/ callback interface [![Version][circuit-fuses-npm-image]][circuit-fuses-npm-url]
* **[keymbinatorial][keymbinatorial-repo]**: Generates the unique combinations of key values by taking a single value from each keys array [![Version][keymbinatorial-npm-image]][keymbinatorial-npm-url]

### Adding a New Screwdriver Repo

We have some tools to help start out new repos for screwdriver:

* **[generator-screwdriver](https://github.com/screwdriver-cd/generator-screwdriver)**: Yeoman generator that bootstraps new repos for screwdriver
* **[eslint-config-screwdriver](https://github.com/screwdriver-cd/eslint-config-screwdriver)**: Our eslint rules for node-based code. Included in each new repo as part of the bootstrap process

[api-repo]: https://github.com/screwdriver-cd/screwdriver
[api-npm-image]: https://img.shields.io/npm/v/screwdriver-api.svg
[api-npm-url]: https://npmjs.org/package/screwdriver-api
[api-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg
[api-issues-url]: https://github.com/screwdriver-cd/screwdriver/issues

[launcher-repo]: https://github.com/screwdriver-cd/launcher

[executor-base-repo]: https://github.com/screwdriver-cd/executor-base
[executor-base-npm-image]: https://img.shields.io/npm/v/screwdriver-executor-base.svg
[executor-base-npm-url]: https://npmjs.org/package/screwdriver-executor-base

[executor-docker-repo]: https://github.com/screwdriver-cd/executor-docker
[executor-docker-npm-image]: https://img.shields.io/npm/v/screwdriver-executor-docker.svg
[executor-docker-npm-url]: https://npmjs.org/package/screwdriver-executor-docker

[executor-j5s-repo]: https://github.com/screwdriver-cd/executor-j5s
[executor-j5s-npm-image]: https://img.shields.io/npm/v/screwdriver-executor-j5s.svg
[executor-j5s-npm-url]: https://npmjs.org/package/screwdriver-executor-j5s

[executor-k8s-repo]: https://github.com/screwdriver-cd/executor-k8s
[executor-k8s-npm-image]: https://img.shields.io/npm/v/screwdriver-executor-k8s.svg
[executor-k8s-npm-url]: https://npmjs.org/package/screwdriver-executor-k8s
[dataschema-repo]: https://github.com/screwdriver-cd/data-schema
[dataschema-npm-image]: https://img.shields.io/npm/v/screwdriver-data-schema.svg
[dataschema-npm-url]: https://npmjs.org/package/screwdriver-data-schema

[models-repo]: https://github.com/screwdriver-cd/models
[models-npm-image]: https://img.shields.io/npm/v/screwdriver-models.svg
[models-npm-url]: https://npmjs.org/package/screwdriver-models

[datastore-base-repo]: https://github.com/screwdriver-cd/datastore-base
[datastore-base-npm-image]: https://img.shields.io/npm/v/screwdriver-datastore-base.svg
[datastore-base-npm-url]: https://npmjs.org/package/screwdriver-datastore-base

[datastore-sequelize-repo]: https://github.com/screwdriver-cd/datastore-sequelize
[datastore-sequelize-npm-image]: https://img.shields.io/npm/v/screwdriver-datastore-sequelize.svg
[datastore-sequelize-npm-url]: https://npmjs.org/package/screwdriver-datastore-sequelize

[scm-base-repo]: https://github.com/screwdriver-cd/scm-base
[scm-base-npm-image]: https://img.shields.io/npm/v/screwdriver-scm-base.svg
[scm-base-npm-url]: https://npmjs.org/package/screwdriver-scm-base

[scm-bitbucket-repo]: https://github.com/screwdriver-cd/scm-bitbucket
[scm-bitbucket-npm-image]: https://img.shields.io/npm/v/screwdriver-scm-bitbucket.svg
[scm-bitbucket-npm-url]: https://npmjs.org/package/screwdriver-scm-bitbucket

[scm-github-repo]: https://github.com/screwdriver-cd/scm-github
[scm-github-npm-image]: https://img.shields.io/npm/v/screwdriver-scm-github.svg
[scm-github-npm-url]: https://npmjs.org/package/screwdriver-scm-github

[config-parser-repo]: https://github.com/screwdriver-cd/config-parser
[config-parser-npm-image]: https://img.shields.io/npm/v/screwdriver-config-parser.svg
[config-parser-npm-url]: https://npmjs.org/package/screwdriver-config-parser

[guide-repo]: https://github.com/screwdriver-cd/guide

[client-repo]: https://github.com/screwdriver-cd/client

[job-tools-repo]: https://github.com/screwdriver-cd/job-tools

[gitversion-repo]: https://github.com/screwdriver-cd/gitversion

[circuit-fuses-repo]: https://github.com/screwdriver-cd/circuit-fuses
[circuit-fuses-npm-image]: https://img.shields.io/npm/v/circuit-fuses.svg
[circuit-fuses-npm-url]: https://npmjs.org/package/circuit-fuses

[keymbinatorial-repo]: https://github.com/screwdriver-cd/keymbinatorial
[keymbinatorial-npm-image]: https://img.shields.io/npm/v/keymbinatorial.svg
[keymbinatorial-npm-url]: https://npmjs.org/package/keymbinatorial
