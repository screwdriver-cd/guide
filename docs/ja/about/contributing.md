---
layout: main
title: 貢献する
category: About
menu: menu_ja
toc:
- title: 貢献する
  url: "#貢献する"
  active: 'true'
- title: Issues
  url: "#issues"
- title: ドキュメント
  url: "#ドキュメント"
- title: パッチの送信
  url: "#パッチの送信"
- title: 機能のリクエスト
  url: "#機能のリクエスト"
- title: Where to Contribute
  url: "#where-to-contribute"
---

# 貢献する

Contributingを考えてくれてありがとうございます！支援にはたくさんの方法があります。

## Issues

バグと思われるものを発見した場合は、以下を記述してIsuueを投稿してください。

1. どのようにすると再現しますか？
2. 予期した動きはどのようなものでしたか？
3. 実際には何が起こりましたか？
4. VersionやPlatformなど、その他関連のありそうなもの。

You can file all issues with Screwdriver in the [screwdriver repo](https://github.com/screwdriver-cd/screwdriver/issues). We will update any issues we're working on with a daily summary. To see what we're currently working on, you can check out our [digital scrum board](https://github.com/screwdriver-cd/screwdriver/projects/4) in the Projects section in the [Screwdriver API repo](https://github.com/screwdriver-cd/screwdriver).

## ドキュメント

ドキュメント、README、サンプルは非常に重要です。是非それらの改善にご協力お待ちしておりますので、タイポを見つけたり問題に気づきましたら、気軽に修正点を送っていただくかお声掛け下さい。

## パッチの送信

バグ修正、機能追加、改善のパッチはプルリクエストとして受け付けています。

- 良いコミットメッセージを現在形で(Added XではなくAdd Xのように)書いて下さい！タイトルは短くし、本文には必要なら空行や箇条書きを使って下さい。タイトルと箇条書きの先頭文字は大文字にしてください。タイトルに句読点は不要です。
- コードはリンターとスタイルチェックにパスする必要があります。
- すべての公開関数は文書化される必要があります。READMEやこの[ガイド](https://github.com/screwdriver-cd/guide)に説明を追加してください。
- テストカバレッジを上げデグレードを防ぐためにテストコードを書いて下さい。
- 機能追加/バグ修正ごとに変更をひとつのコミットにまとめてください。どのようにまとめればよいかわからないときはお問い合わせ下さい。

大掛かりな改善に取り組むときは、それがプロジェクトの目標に沿うものか確認するために事前にお声掛け下さい。

### Commit Message Format

We use [semantic-release](https://www.npmjs.com/package/semantic-release), which requires commit messages to be in this specific format: `<type>(<scope>): <subject>`

- Types:
    - feat (feature)
    - fix (bug fix)
    - docs (documentation)
    - style (formatting, missing semi colons, …)
    - refactor
    - test (when adding missing tests)
    - chore (maintain)
- Scope: anything that specifies the scope of the commit. Can be blank or `*`
- Subject: description of the commit. For **breaking changes** that require major version bump, add `BREAKING CHANGE` to the commit message.

**Examples commit messages:**

- Bug fix: `fix: Remove extra space`
- Breaking change: `feat(scm): Support new scm plugin. BREAKING CHANGE: github no longer works`

## 機能のリクエスト

Make the case for a feature via an issue with a good title. The feature should be discussed and given a target inclusion milestone or closed.

## Where to Contribute

Screwdriver has a modular architecture, and the various responsibilities are split up in separate repos.

### [Screwdriver API](https://github.com/screwdriver-cd/screwdriver) [![Version](https://img.shields.io/npm/v/screwdriver-api.svg)](https://npmjs.org/package/screwdriver-api) [![Open Issues](https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg)](https://github.com/screwdriver-cd/screwdriver/issues)

The **[screwdriver](https://github.com/screwdriver-cd/screwdriver)** repo is the core of screwdriver, providing the API endpoints for everything that screwdriver does. The API is based on the *[hapijs framework](http://hapijs.com/)* and is implemented in node as a series of plugins.

### [Launcher](https://github.com/screwdriver-cd/launcher)

The **[launcher](https://github.com/screwdriver-cd/launcher)** performs step execution and housekeeping internal to build containers. This is written in Go, and mounted into build containers as a binary.

### Executors

An executor is used to manage build containers for any given job. Several implementations of executors have been created. All are designed to follow a common interface. Executor implementations are written in node:

- **[executor-base](https://github.com/screwdriver-cd/executor-base)**: Common interface [![Version](https://img.shields.io/npm/v/screwdriver-executor-base.svg)](https://npmjs.org/package/screwdriver-executor-base)
- **[executor-docker](https://github.com/screwdriver-cd/executor-docker)**: Docker implementation [![Version](https://img.shields.io/npm/v/screwdriver-executor-docker.svg)](https://npmjs.org/package/screwdriver-executor-docker)
- **[executor-j5s](https://github.com/screwdriver-cd/executor-j5s)**: Jenkins implementation [![Version](https://img.shields.io/npm/v/screwdriver-executor-j5s.svg)](https://npmjs.org/package/screwdriver-executor-j5s)
- **[executor-k8s](https://github.com/screwdriver-cd/executor-k8s)**: Kubernetes implementation [![Version](https://img.shields.io/npm/v/screwdriver-executor-k8s.svg)](https://npmjs.org/package/screwdriver-executor-k8s)

### Models

The object models provide the definition of the data that is stored in data stores. This is done in two parts:

- **[data-schema](https://github.com/screwdriver-cd/data-schema)**: Schema definition with *[Joi](https://www.npmjs.com/package/joi)* [![Version](https://img.shields.io/npm/v/screwdriver-data-schema.svg)](https://npmjs.org/package/screwdriver-data-schema)
- **[models](https://github.com/screwdriver-cd/models)**: Specific business logic around the data schema [![Version](https://img.shields.io/npm/v/screwdriver-models.svg)](https://npmjs.org/package/screwdriver-models)

### Datastores

A datastore implementation is used as the interface between the API and a data storage mechanism. There are several implementations written in node around a common interface.

- **[datastore-base](https://github.com/screwdriver-cd/datastore-base)**: Common interface [![Version](https://img.shields.io/npm/v/screwdriver-datastore-base.svg)](https://npmjs.org/package/screwdriver-datastore-base)
- **[datastore-sequelize](https://github.com/screwdriver-cd/datastore-sequelize)**: Mysql, postgres, sqlite3 and mssql implementation [![Version](https://img.shields.io/npm/v/screwdriver-datastore-sequelize.svg)](https://npmjs.org/package/screwdriver-datastore-sequelize)

### Scms

An scm implementation is used as the interface between the API and an scm. There are several implementations written in node around a common interface.

- **[scm-base](https://github.com/screwdriver-cd/scm-base)**: Common interface [![Version](https://img.shields.io/npm/v/screwdriver-scm-base.svg)](https://npmjs.org/package/screwdriver-scm-base)
- **[scm-bitbucket](https://github.com/screwdriver-cd/scm-bitbucket)**: Bitbucket implementation [![Version](https://img.shields.io/npm/v/screwdriver-scm-bitbucket.svg)](https://npmjs.org/package/screwdriver-scm-bitbucket)
- **[scm-github](https://github.com/screwdriver-cd/scm-github)**: Github implementation [![Version](https://img.shields.io/npm/v/screwdriver-scm-github.svg)](https://npmjs.org/package/screwdriver-scm-github)

### [Config Parser](https://github.com/screwdriver-cd/config-parser) [![Version](https://img.shields.io/npm/v/screwdriver-config-parser.svg)](https://npmjs.org/package/screwdriver-config-parser)

Node module for validating and parsing user's `screwdriver.yaml` configurations.

### [Guide](https://github.com/screwdriver-cd/guide)

This documentation! Everything you ever hoped to know about the Screwdriver project.

### Miscellaneous Tools

- **[client](https://github.com/screwdriver-cd/client)**: Simple Go-based CLI for accessing the Screwdriver API
- **[gitversion](https://github.com/screwdriver-cd/gitversion)**: Go-based tool for updating git tags on a repo for a new version number
- **[circuit-fuses](https://github.com/screwdriver-cd/circuit-fuses)**: Wrapper to provide a node-circuitbreaker w/ callback interface [![Version](https://img.shields.io/npm/v/circuit-fuses.svg)](https://npmjs.org/package/circuit-fuses)
- **[keymbinatorial](https://github.com/screwdriver-cd/keymbinatorial)**: Generates the unique combinations of key values by taking a single value from each keys array [![Version](https://img.shields.io/npm/v/keymbinatorial.svg)](https://npmjs.org/package/keymbinatorial)

### Adding a New Screwdriver Repo

We have some tools to help start out new repos for screwdriver:

- **[generator-screwdriver](https://github.com/screwdriver-cd/generator-screwdriver)**: Yeoman generator that bootstraps new repos for screwdriver
- **[eslint-config-screwdriver](https://github.com/screwdriver-cd/eslint-config-screwdriver)**: Our eslint rules for node-based code. Included in each new repo as part of the bootstrap process
