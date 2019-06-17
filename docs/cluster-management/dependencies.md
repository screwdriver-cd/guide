---
layout: main
title: Dependencies
category: Cluster Management
menu: menu
toc:
    - title: External Dependencies
      url: "#screwdriver-dependencies"
      active: true
---
## Dependencies

 | Technology             | Description | License |
 | ----                   | ----        | ----    |
 | Kubernetes             | For Running Screwriver at scale. And with executor [k8s](https://github.com/screwdriver-cd/executor-k8s/) | [Apache 2.0](https://github.com/kubernetes/kubernetes/blob/master/LICENSE) |
 | Docker                 | Used with executors [k8s](https://github.com/screwdriver-cd/executor-k8s/) & [docker](https://github.com/screwdriver-cd/executor-docker/). Also required for running Screwdriver with [SD in a box](https://github.com/screwdriver-cd/in-a-box)  | [Apache 2.0](https://www.docker.com/legal/components-licenses) |
 | HyperContainer (Optional) | Hypervisor-agnostic Docker runtime. Used with [executor k8s vm](https://github.com/screwdriver-cd/executor-k8s-vm/) | [Apache 2.0](https://github.com/hyperhq/hyperd/blob/master/LICENSE) |
 | Helm (Optional)           | For deploying Screwdiver into [k8s](https://github.com/screwdriver-cd/screwdriver-chart) | [Apache 2.0](https://github.com/helm/helm/blob/master/LICENSE) |
 | JWT                    | Authentication & Authorization | [MIT](https://github.com/jsonwebtoken/jsonwebtoken.github.io/blob/master/LICENSE.txt) |
 | Node.js                | Most application components are running in node.js             | [MIT](https://github.com/nodejs/node/blob/master/LICENSE) |
 | ember.js               | Screwdriver UI            | [MIT](https://github.com/emberjs/ember.js/blob/master/LICENSE)         |
 | hapi.js                | API & Store web servers are based on hapi | [License](https://github.com/hapijs/hapijs.com/blob/master/LICENSE)        |
 | golang                 | Launcher & log-service components are written in go  | [License](https://golang.org/LICENSE) |
 | Jenkins (Optional)     | Executor [Jenkins](https://github.com/screwdriver-cd/executor-jenkins)  | [MIT](https://jenkins.io/license/) |
 | Github/Github Enterprise/Gitlab/Bitbucket| Source Control Management System. Users must have access to one of the supported SCMs |         |
 | Swagger                | API documentation | [Apache 2.0](https://swagger.io/license/) |
 | Chef Habitat           | For packaging dependencies like curl into launcher container so that build container has minimal required tooling. | [Apache 2.0](https://www.habitat.sh/legal/licensing/) |
 | Redis                  | For handling workflow use cases like periodic builds. | [Three clause BSD license](https://redis.io/topics/license) |
 | RabbitMQ               | For queueing builds to build clusters | [Mozilla Public License](https://www.rabbitmq.com/mpl.html) |
 | SonarQube (Optional)   | For providing code analysis via [coverage sonar bookend](https://github.com/screwdriver-cd/coverage-sonar/) | [GNU V3](https://www.sonarqube.org/downloads/license/) |
