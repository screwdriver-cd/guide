---
layout: main
title: Dependencies
category: Cluster Management
menu: menu
toc:
    - title: External Dependencies
      url: "#external-dependencies"
      active: true
---
## External Dependencies

 | Technology             | Description | License |
 | ----                   | ----        | ----    |
 | Bitbucket/GitHub/GitHub Enterprise/GitLab | Source Control Management System. Users must have access to one of the [supported SCMs](../user-guide/scm) |         |
 | Docker                 | Used with [executor-k8s](https://github.com/screwdriver-cd/executor-k8s) & [executor-docker](https://github.com/screwdriver-cd/executor-docker). Also required for running Screwdriver with [SD in a box](https://github.com/screwdriver-cd/in-a-box)  | [Apache 2.0](https://www.docker.com/legal/components-licenses) |
 | Ember.js               | Screwdriver UI            | [MIT](https://github.com/emberjs/ember.js/blob/master/LICENSE)         |
 | Golang                 | [Launcher](https://github.com/screwdriver-cd/launcher) & [log-service](https://github.com/screwdriver-cd/log-service) are written in Golang  | [License](https://golang.org/LICENSE) |
 | Habitat                | For packaging dependencies like curl in the [Launcher](https://github.com/screwdriver-cd/launcher) container so that build containers have minimal required tooling | [Apache 2.0](https://www.habitat.sh/legal/licensing) |
 | Hapi.js                | API & Store web servers are based on Hapi | [License](https://github.com/hapijs/hapijs.com/blob/master/LICENSE)        |
 | Helm (Optional)           | For [deploying Screwdriver into k8s](https://github.com/screwdriver-cd/screwdriver-chart) | [Apache 2.0](https://github.com/helm/helm/blob/master/LICENSE) |
 | HyperContainer (Optional) | Hypervisor-agnostic Docker runtime. Used with [executor-k8s-vm](https://github.com/screwdriver-cd/executor-k8s-vm) | [Apache 2.0](https://github.com/hyperhq/hyperd/blob/master/LICENSE) |
 | Jenkins (Optional)     | Used in [executor-jenkins](https://github.com/screwdriver-cd/executor-jenkins)  | [MIT](https://jenkins.io/license) |
 | JWT                    | For authentication & authorization | [MIT](https://github.com/jsonwebtoken/jsonwebtoken.github.io/blob/master/LICENSE.txt) |
 | Kubernetes             | For running Screwdriver at scale using [executor-k8s](https://github.com/screwdriver-cd/executor-k8s) | [Apache 2.0](https://github.com/kubernetes/kubernetes/blob/master/LICENSE) |
 | MariaDB (Optional) | One of the options for [Database](https://github.com/screwdriver-cd/datastore-sequelize/) | [GPL Licence](https://mariadb.com/kb/en/library/licensing-faq/) |
 | MySQL (Optional) | One of the options for [Database](https://github.com/screwdriver-cd/datastore-sequelize/) | [GPL or Commercial](https://www.mysql.com/about/legal/) |
 | Node.js                | [Most application components](../about/contributing/where-to-contribute) are running in node.js             | [MIT](https://github.com/nodejs/node/blob/master/LICENSE) |
 | Postgres (Optional) | One of the options for [Database](https://github.com/screwdriver-cd/datastore-sequelize/) | [PostgreSQL Licence](https://opensource.org/licenses/postgresql) |
 | RabbitMQ               | For queueing builds to build clusters | [Mozilla Public License](https://www.rabbitmq.com/mpl.html) |
 | Redis                  | For handling [workflow use-cases](../user-guide/configuration/workflow)(e.g.: periodic builds) | [Three clause BSD license](https://redis.io/topics/license) |
 | S3 (Optional)           | One of the options for artifact [storage](https://github.com/screwdriver-cd/store) | Commercial |
 | Sequelize              | Multi SQL dialect ORM for Node.js | [MIT](https://github.com/sequelize/sequelize/blob/master/LICENSE) |
 | SonarQube (Optional)   | For providing code analysis via [coverage-sonar bookend](https://github.com/screwdriver-cd/coverage-sonar) | [GNU V3](https://www.sonarqube.org/downloads/license) |
 | Swagger                | For API documentation | [Apache 2.0](https://swagger.io/license) |
 | Prometheus (Optional)   | For metrics based monitoring | [Apache 2.0](https://github.com/prometheus/prometheus/blob/master/LICENSE) |
 | Prometheus Pushgateway (Optional) | For build metrics  | [Apache 2.0](https://github.com/prometheus/pushgateway/blob/master/LICENSE) |
