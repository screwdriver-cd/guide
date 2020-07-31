---
layout: main
title: Configuring the Queue Service
category: Cluster Management
menu: menu
toc: 
    - title: Managing the Queue Service
      url: "#managing-the-queue-service"
      active: true
    - title: Packages
      url: "#packages"
    - title: Configuration
      url: "#configuration"
---
# Managing the Queue Service

## Packages

Like the other services, the API is shipped as a [Docker image](https://hub.docker.com/r/screwdrivercd/queue-service/) with port 80 exposed.

```bash
$ docker run -d -p 9003:80 screwdrivercd/queue-service:latest
$ open http://localhost:9003
```

Our images are tagged with the version (eg. `v1.2.3`) as well as a floating tag `latest` and `stable`. Most installations should be using `stable` or the fixed version tags.

## Configuration

Screwdriver already [defaults most configuration](https://github.com/screwdriver-cd/queue-service/blob/master/config/default.yaml), but you can override defaults using a `config/local.yaml` or environment variables. All the possible environment variables are [defined here](https://github.com/screwdriver-cd/queue-service/blob/master/config/custom-environment-variables.yaml).

### Authentication

Configure the validation of incoming JWTs from the API.

| Key                   | Required | Description                                                                                           |
|:----------------------|:--------|:------------------------------------------------------------------------------------------------------|
| JWT_ENVIRONMENT | No      | Environment to generate the JWT for. Ex: `prod`, `beta`. If you want the JWT to not contain `environment`, don't set this environment variable (do not set it to `''`). |
| SECRET_JWT_PRIVATE_KEY | Yes      | A private key uses for signing jwt tokens. Generate one by running `$ openssl genrsa -out jwtqs.pem 2048`                   |
| SECRET_JWT_PUBLIC_KEY  | Yes      | The public key used for verifying the signature. Generate one by running `$ openssl rsa -in jwtqs.pem -pubout -out jwtqs.pub` |
| SECRET_JWT_SD_API_PUBLIC_KEY | *none*  | The public key used for verifying the signature of the JWT. Use the same one as configured in the API |

```yaml
# config/local.yaml
auth:
    jwtPrivateKey: |
        PRIVATE KEY HERE
    jwtPublicKey: |
        PUBLIC KEY HERE
    jwtSDApiPublicKey: |
        PUBLIC KEY HERE
```

### Serving

Configure the how the service is listening for traffic.

| Key       | Default             | Description                                                                                                                                                                                                |
|:----------|:--------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PORT      | 80                  | Port to listen on                                                                                                                                                                                          |
| HOST      | 0.0.0.0             | Host to listen on (set to localhost to only accept connections from this machine)                                                                                                                          |
| URI       | http://localhost:80 | Externally routable URI (usually your load balancer or CNAME)                                                                                                                                              |
| HTTPD_TLS | false               | SSL support; for SSL, replace `false` with a JSON object that provides the options required by [`tls.createServer`](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) |

```yaml
# config/local.yaml
httpd:
    port: 443
    host: 0.0.0.0
    uri: https://localhost
    tls:
        key: |
            PRIVATE KEY HERE
        cert: |
            YOUR CERT HERE
```

### Configure Redis Queue

Configure some settings for setting up the Queue.

| Key                | Required            |  Default              | Description       |
|:-------------------|:---------------------|:---------------------|:-----------------------------|
| REDIS_HOST          | Yes                  | 127.0.0.1            | Redis host                  |
| REDIS_PORT          | Yes                  | 6379                 | Redis port                  |
| REDIS_PASSWORD      | Yes                  | a-secure-password    | Redis password              |
| REDIS_TLS_ENABLED   | No                   | false                | Redis tls enabled           |
| REDIS_DB_NUMBER     | No                   | 0                    | Redis db number             |
| REDIS_QUEUE_PREFIX  | No                   | ''                   | Redis queue prefix          |

```yaml
# config/local.yaml
queue:
  redisConnection:
    host: "127.0.0.1"
    port: 6379
    options:
      password: a-secure-password
      tls: false
    database: 0
  prefix: ''
```

### Configure Blocked By Settings

Configure some settings for [blockedBy](../user-guide/configuration/workflow#blocked-by).

| Key                | Required            |  Default              | Description       |
|:-------------------|:---------------------|:----------------------------------------------------|
| PLUGIN_BLOCKEDBY_REENQUEUE_WAIT_TIME      | No                  | 1            | Minutes to wait before re-enqueuing if blocked                 |
| PLUGIN_BLOCKEDBY_BLOCK_TIMEOUT   | No                   | 120                | Maximum minutes for a job to be blocked before timing out           |
| PLUGIN_BLOCKEDBY_BLOCKED_BY_SELF     | No                   | true                    | Whether a job will be blocked by itself or not            |
| PLUGIN_BLOCKEDBY_COLLAPSE  | No                   | true                   | Whether multiple builds run for the same job at the same time will collapse or not         |

```yaml
# config/local.yaml
plugins:
  blockedBy:
    reenqueueWaitTime: 5
    blockTimeout: 180
    blockedBySelf: false
    collapse: false
```

### Configure pushgateway

Configure pushgateway to collect [build metrics](./collect-metrics#build-metrics).

|Key                        | Required | Default | Description     |
|:--------------------------|:---------|:--------|:----------------|
|ECOSYSTEM_PUSHGATEWAY_URL  | No       |         | Pushgateway URL |
