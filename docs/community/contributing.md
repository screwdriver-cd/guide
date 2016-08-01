# Contributing

Thank you for considering contributing! There are many ways you can help.

## Issues

File an issue if you think you've found a bug. Be sure to describe

1. How can it be reproduced?
2. What did you expect?
3. What actually occurred?
4. Version, platform, etc. if possibly relevant.

## Docs

Documentation, READMEs, and examples are extremely important. Please help improve them and if you find a typo or notice a problem, please send a fix or say something.

## Submitting Patches

Patches for fixes, features, and improvements are accepted through pull requests.

* Write good commit messages, in the present tense! (Add X, not Added X). Short title, blank line, bullet points if needed. Capitalize the first letter of the title or bullet item. No punctuation in the title.
* Code must pass lint and style checks.
* All external methods must be documented.
* Include tests to improve coverage and prevent regressions.
* Squash changes into a single commit per feature/fix. Ask if you're unsure how to discretize your work.

Please ask before embarking on a large improvement so you're not disappointed if it does not align with the goals of the project or owner(s).

## Feature Requests

Make the case for a feature via an issue with a good title. The feature should be discussed and given a target inclusion milestone or closed.

## Where to contribute

Screwdriver has a modular architecture, and the various responsibilities are split up in separate repos.

### [Screwdriver API][api-repo] [![Version][api-npm-image]][api-npm-url] [![Open Issues][api-issues-image]][api-issues-url]

The **[screwdriver][api-repo]** repo is the core of screwdriver, providing the API endpoints for everything that screwdriver does. The API is based on the *[hapijs framework](http://hapijs.com/)* and is implemented in node as a series of plugins.

### [Launcher][launcher-repo] [![Open Issues][launcher-issues-image]][launcher-issues-url]

The **[launcher][launcher-repo]** performs step execution and housekeeping internal to build containers. This is written in Go, and mounted into build containers as a binary.

### Executors

An executor is used to manage build containers for any given job. Several implementations of executors have been created. All are designed to follow a common interface. Executor implementations are written in node:

* **[executor-base][executor-base-repo]**: Common Interface [![Version][executor-base-npm-image]][executor-base-npm-url] [![Open Issues][executor-base-issues-image]][executor-base-issues-url]
* **[executor-k8s][executor-k8s-repo]**: Kubernetes Implementation [![Version][executor-k8s-npm-image]][executor-k8s-npm-url] [![Open Issues][executor-k8s-issues-image]][executor-k8s-issues-url]
* **[executor-j5s](https://github.com/screwdriver-cd/executor-j5s)**: Jenkins Implementation [![Version][executor-j5s-npm-image]][executor-j5s-npm-url] [![Open Issues][executor-j5s-issues-image]][executor-j5s-issues-url]

### Models

The object models provide the definition of the data that is stored in data stores. This is done in two parts:

* **[data-schema][dataschema-repo]**: Schema definition with *[Joi](https://www.npmjs.com/package/joi)* [![Version][dataschema-npm-image]][dataschema-npm-url] [![Open Issues][dataschema-issues-image]][dataschema-issues-url]
* **[models][models-repo]**: Specific business logic around the data schema [![Version][models-npm-image]][models-npm-url] [![Open Issues][models-issues-image]][models-issues-url]

### Datastores

A datastore implementation is used as the interface between the API and a data storage mechanism. There are several implementations written in node around a common interface.

* **[datastore-base][datastore-base-repo]**: Common Interface [![Version][datastore-base-npm-image]][datastore-base-npm-url] [![Open Issues][datastore-base-issues-image]][datastore-base-issues-url]
* **[datastore-dynamodb][datastore-dynamodb-repo]**: DynamoDB Implementation [![Version][datastore-dynamodb-npm-image]][datastore-dynamodb-npm-url] [![Open Issues][datastore-dynamodb-issues-image]][datastore-dynamodb-issues-url]
* **[datastore-imdb][datastore-imdb-repo]**: In-memory Implementation [![Version][datastore-imdb-npm-image]][datastore-imdb-npm-url] [![Open Issues][datastore-imdb-issues-image]][datastore-imdb-issues-url]


### [Config Parser][config-parser-repo] [![Version][config-parser-npm-image]][config-parser-npm-url] [![Open Issues][config-parser-issues-image]][config-parser-issues-url]

Node module for validating and parsing user's `screwdriver.yaml` configurations.

### [Guide][guide-repo] [![Open Issues][guide-issues-image]][guide-issues-url]

This documentation! Everything you ever hoped to know about the Screwdriver project.

### Miscellaneous Tools

* **[client][client-repo]**: Simple Go-based CLI for accessing the Screwdriver API [![Open Issues][client-issues-image]][client-issues-url]
* **[job-tools][job-tools-repo]**: Generic docker container implementation to bootstrap and execute a build [![Open Issues][job-tools-issues-image]][job-tools-issues-url]
* **[gitversion][gitversion-repo]**: Go-based tool for updating git tags on a repo for a new version number [![Open Issues][gitversion-issues-image]][gitversion-issues-url]
* **[circuit-fuses][circuit-fuses-repo]**: Wrapper to provide a node-circuitbreaker w/ callback interface [![Version][circuit-fuses-npm-image]][circuit-fuses-npm-url] [![Open Issues][circuit-fuses-issues-image]][circuit-fuses-issues-url]
* **[keymbinatorial][keymbinatorial-repo]**: Generates the unique combinations of key values by taking a single value from each keys array [![Version][keymbinatorial-npm-image]][keymbinatorial-npm-url] [![Open Issues][keymbinatorial-issues-image]][keymbinatorial-issues-url]

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
[launcher-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/launcher.svg
[launcher-issues-url]: https://github.com/screwdriver-cd/launcher/issues

[executor-base-repo]: https://github.com/screwdriver-cd/executor-base
[executor-base-npm-image]: https://img.shields.io/npm/v/screwdriver-executor-base.svg
[executor-base-npm-url]: https://npmjs.org/package/screwdriver-executor-base
[executor-base-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/executor-base.svg
[executor-base-issues-url]: https://github.com/screwdriver-cd/executor-base/issues

[executor-k8s-repo]: https://github.com/screwdriver-cd/executor-k8s
[executor-k8s-npm-image]: https://img.shields.io/npm/v/screwdriver-executor-k8s.svg
[executor-k8s-npm-url]: https://npmjs.org/package/screwdriver-executor-k8s
[executor-k8s-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/executor-k8s.svg
[executor-k8s-issues-url]: https://github.com/screwdriver-cd/executor-k8s/issues

[executor-j5s-repo]: https://github.com/screwdriver-cd/executor-j5s
[executor-j5s-npm-image]: https://img.shields.io/npm/v/screwdriver-executor-j5s.svg
[executor-j5s-npm-url]: https://npmjs.org/package/screwdriver-executor-j5s
[executor-j5s-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/executor-j5s.svg
[executor-j5s-issues-url]: https://github.com/screwdriver-cd/executor-j5s/issues

[dataschema-repo]: https://github.com/screwdriver-cd/data-schema
[dataschema-npm-image]: https://img.shields.io/npm/v/screwdriver-data-schema.svg
[dataschema-npm-url]: https://npmjs.org/package/screwdriver-data-schema
[dataschema-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/data-schema.svg
[dataschema-issues-url]: https://github.com/screwdriver-cd/data-schema/issues

[models-repo]: https://github.com/screwdriver-cd/models
[models-npm-image]: https://img.shields.io/npm/v/screwdriver-models.svg
[models-npm-url]: https://npmjs.org/package/screwdriver-models
[models-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/models.svg
[models-issues-url]: https://github.com/screwdriver-cd/models/issues

[datastore-base-repo]: https://github.com/screwdriver-cd/datastore-base
[datastore-base-npm-image]: https://img.shields.io/npm/v/screwdriver-datastore-base.svg
[datastore-base-npm-url]: https://npmjs.org/package/screwdriver-datastore-base
[datastore-base-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/datastore-base.svg
[datastore-base-issues-url]: https://github.com/screwdriver-cd/datastore-base/issues

[datastore-dynamodb-repo]: https://github.com/screwdriver-cd/datastore-dynamodb
[datastore-dynamodb-npm-image]: https://img.shields.io/npm/v/screwdriver-datastore-dynamodb.svg
[datastore-dynamodb-npm-url]: https://npmjs.org/package/screwdriver-datastore-dynamodb
[datastore-dynamodb-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/datastore-dynamodb.svg
[datastore-dynamodb-issues-url]: https://github.com/screwdriver-cd/datastore-dynamodb/issues

[datastore-imdb-repo]: https://github.com/screwdriver-cd/datastore-imdb
[datastore-imdb-npm-image]: https://img.shields.io/npm/v/screwdriver-datastore-imdb.svg
[datastore-imdb-npm-url]: https://npmjs.org/package/screwdriver-datastore-imdb
[datastore-imdb-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/datastore-imdb.svg
[datastore-imdb-issues-url]: https://github.com/screwdriver-cd/datastore-imdb/issues

[config-parser-repo]: https://github.com/screwdriver-cd/config-parser
[config-parser-npm-image]: https://img.shields.io/npm/v/screwdriver-config-parser.svg
[config-parser-npm-url]: https://npmjs.org/package/screwdriver-config-parser
[config-parser-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/config-parser.svg
[config-parser-issues-url]: https://github.com/screwdriver-cd/config-parser/issues

[guide-repo]: https://github.com/screwdriver-cd/guide
[guide-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/guide.svg
[guide-issues-url]: https://github.com/screwdriver-cd/guide/issues

[client-repo]: https://github.com/screwdriver-cd/client
[client-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/client.svg
[client-issues-url]: https://github.com/screwdriver-cd/client/issues
[job-tools-repo]: https://github.com/screwdriver-cd/job-tools
[job-tools-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/job-tools.svg
[job-tools-issues-url]: https://github.com/screwdriver-cd/job-tools/issues
[gitversion-repo]: https://github.com/screwdriver-cd/gitversion
[gitversion-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/gitversion.svg
[gitversion-issues-url]: https://github.com/screwdriver-cd/gitversion/issues
[circuit-fuses-repo]: https://github.com/screwdriver-cd/circuit-fuses
[circuit-fuses-npm-image]: https://img.shields.io/npm/v/circuit-fuses.svg
[circuit-fuses-npm-url]: https://npmjs.org/package/circuit-fuses
[circuit-fuses-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/circuit-fuses.svg
[circuit-fuses-issues-url]: https://github.com/screwdriver-cd/circuit-fuses/issues
[keymbinatorial-repo]: https://github.com/screwdriver-cd/keymbinatorial
[keymbinatorial-npm-image]: https://img.shields.io/npm/v/keymbinatorial.svg
[keymbinatorial-npm-url]: https://npmjs.org/package/keymbinatorial
[keymbinatorial-issues-image]: https://img.shields.io/github/issues/screwdriver-cd/keymbinatorial.svg
[keymbinatorial-issues-url]: https://github.com/screwdriver-cd/keymbinatorial/issues
