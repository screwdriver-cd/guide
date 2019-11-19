---
layout: main
title: 依存関係
category: Cluster Management
menu: menu_ja
toc:
    - title: 外部依存
      url: "#外部依存"
      active: true
---
## 外部依存

  | Technology             | Description | License |
 | ----                   | ----        | ----    |
 | Bitbucket/Github/Github Enterprise/Gitlab | Source Control Management System。ユーザーはサポートしているSCMのどれか一つにアクセスできなければなりません。|         |
 | Docker                 | [executor-k8s](https://github.com/screwdriver-cd/executor-k8s) もしくは [executor-docker](https://github.com/screwdriver-cd/executor-docker)で利用します。 [SD in a box](https://github.com/screwdriver-cd/in-a-box)を動作させるためにも必要です。| [Apache 2.0](https://www.docker.com/legal/components-licenses) |
 | Ember.js               | Screwdriver UI            | [MIT](https://github.com/emberjs/ember.js/blob/master/LICENSE)         |
 | Golang                 | [Launcher](https://github.com/screwdriver-cd/launcher) や [log-service](https://github.com/screwdriver-cd/log-service)はGo言語で書かれています。  | [License](https://golang.org/LICENSE) |
 | Habitat                | ビルドコンテナが持つツールを最小の要求とするために、[Launcher](https://github.com/screwdriver-cd/launcher)コンテナ内のcurlなどの依存関係のパッケージングに利用しています。| [Apache 2.0](https://www.habitat.sh/legal/licensing) |
 | Hapi.js                | APIやStoreといったWebサーバはHapiをベースにしています。| [License](https://github.com/hapijs/hapijs.com/blob/master/LICENSE)        |
 | Helm (Optional)           | [Screwdriverをk8sにデプロイ](https://github.com/screwdriver-cd/screwdriver-chart)するために利用しています。|
 | HyperContainer (Optional) | Hypervisor-agnostic Docker runtime. [executor-k8s-vm](https://github.com/screwdriver-cd/executor-k8s-vm)で利用しています。 | [Apache 2.0](https://github.com/hyperhq/hyperd/blob/master/LICENSE) |
 | Jenkins (Optional)     | [executor-jenkins](https://github.com/screwdriver-cd/executor-jenkins)で利用しています。  | [MIT](https://jenkins.io/license) |
 | JWT                    | 認証認可で利用しています。| [MIT](https://github.com/jsonwebtoken/jsonwebtoken.github.io/blob/master/LICENSE.txt) |
 | Kubernetes             | Screwdriverを[executor-k8s](https://github.com/screwdriver-cd/executor-k8s)を使って大規模に動作させるために利用しています。| [Apache 2.0](https://github.com/kubernetes/kubernetes/blob/master/LICENSE) |
 | MariaDB(Optional) | [Database](https://github.com/screwdriver-cd/datastore-sequelize/)の選択肢の一つです。| [GPL Licence](https://mariadb.com/kb/en/library/licensing-faq/) |
 | MySQL(Optional) | [Database](https://github.com/screwdriver-cd/datastore-sequelize/)の選択肢の一つです。| [GPL or Commercial](https://www.mysql.com/about/legal/) |
 | Node.js                | [ほぼ全てのアプリケーションコンポーネントは](https://docs.screwdriver.cd/about/contributing/where-to-contribute)はnode.jsで動作しています。             | [MIT](https://github.com/nodejs/node/blob/master/LICENSE) |
 | Postgres(Optional) | [Database](https://github.com/screwdriver-cd/datastore-sequelize/)の選択肢の一つです。| [PostgreSQL Licence](https://opensource.org/licenses/postgresql) |
 | RabbitMQ               | ビルドをビルドクラスタにキューイングするために利用しています。| [Mozilla Public License](https://www.rabbitmq.com/mpl.html) |
 | Redis                  | [ワークフローのユースケース](https://docs.screwdriver.cd/user-guide/configuration/workflow)(例えばperiodic builds)のハンドリングで利用しています。 | [Three clause BSD license](https://redis.io/topics/license) |
 | S3(Optional)           | アーティファクト[ストレージ](https://github.com/screwdriver-cd/store)の選択肢の一つです。| Commercial |
 | Sequelize              | Node.jsで利用できるMulti SQL dialect ORMです。 | [MIT](https://github.com/sequelize/sequelize/blob/master/LICENSE) |
 | SonarQube (Optional)   | [coverage-sonar bookend](https://github.com/screwdriver-cd/coverage-sonar)でコード分析をするために利用しています。| [GNU V3](https://www.sonarqube.org/downloads/license) |
 | Swagger                | APIのdocumentationに利用しています。 | [Apache 2.0](https://swagger.io/license) |
