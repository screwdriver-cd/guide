---
layout: main
title: Configuring the Artifacts Unzip Service
category: Cluster Management
menu: menu
toc:
    - title: Managing the Artifacts Unzip Service
      url: "#managing-the-artifacts-unzip-service"
      active: true
    - title: Package
      url: "#package"
    - title: Configuration
      url: "#configuration"
    - title: Queue
      url: "#queue"
      subitem: true
    - title: MultiWorker
      url: "#multiworker"
      subitem: true
    - title: Health Check
      url: "#health-check"
      subitem: true
---

# Managing the Artifacts Unzip Service

## Package

Artifacts Unzip Service is a service that unzips the build artifacts uploaded as a zip.  
It's required to use the [Zip Artifacts feature](zip-artifacts).  
Like the other services, Artifacts Unzip Service is shipped as a [Docker image](https://hub.docker.com/r/screwdrivercd/artifacts-unzip-service).  

```bash
docker run -d screwdrivercd/artifacts-unzip-service:latest
```

This images are tagged for their version (eg. `v1.2.3`) as well as a floating `latest`. Most installations should be using the fixed version tags.

## Configuration

### Queue

Configure some settings for setting up the Queue.

Key | Default | Description
--- | --- | ---
REDIS_HOST | - | Redis host
REDIS_PORT | - | Redis port
REDIS_PASSWORD | - | Redis password
REDIS_TLS_ENABLED | false | Redis tls enabled. Specify `false` if tls is not used. If you use tls, need to set the [tls option of ioredis](https://github.com/luin/ioredis#tls-options).
REDIS_DB_NUMBER | 0 | Redis db number
REDIS_QUEUE_PREFIX | '' | Redis queue prefix

```yaml
# config/local.yaml
queue:
  redisConnection:
    host: 127.0.0.1
    port: 6379
    options:
      password: REDIS PASSWORD
      tls: false
    database: 0
  prefix: ''
```

### MultiWorker

Configure some settings for setting up the MultiWorker.

Key | Default | Description
--- | --- | ---
WORKER_MIN_TASK_PROCESSORS | 1 | The minimum number of workers to spawn under this multiWorker.
WORKER_MAX_TASK_PROCESSORS | 10 | The maximum number of workers to spawn under this multiWorker.
WORKER_CHECK_TIMEOUT | 1000 | How often to check if the event loop is blocked (in ms)
WORKER_MAX_EVENT_LOOP_DELAY | 10 | How long the event loop has to be delayed before considering it blocked (in ms)
WORKER_PARALLEL_UPLOAD_LIMIT| 0 | Number of parallel executions of uploading to the Store (unlimited when less than 0)

```yaml
# config/local.yaml
unzip-service:
  minTaskProcessors: 1
  maxTaskProcessors: 10
  checkTimeout: 1000
  maxEventLoopDelay: 10
  parallelUploadLimit: 0
```

You need to see the [MultiWorker page](https://github.com/actionhero/node-resque#multiworker-options) for more information.

### Health Check

Configure some settings for setting up health check endpoint.

You can get the last check time of event loop blocked or not by calling `GET /last-emitted` endpoint. You can change the check interval by setting `WORKER_CHECK_TIMEOUT`.

Key | Default | Description
--- | --- | ---
PORT | 80 | Port to listen on
HOST | 0.0.0.0 | Host to listen on (set to localhost to only accept connections from this machine)
URI | http://localhost:80 | Externally routable URI (usually your load balancer or CNAME)

```yaml
# config/local.yaml
httpd:
    port: 80
    host: 0.0.0.0
    uri: https://localhost
```
