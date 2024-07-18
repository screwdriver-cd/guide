---
layout: main
title: Configuring the Store
category: Cluster Management
menu: menu
toc:
    - title: Managing the Store
      url: "#managing-the-store"
      active: true
    - title: Packages
      url: "#packages"
    - title: Configuration
      url: "#configuration"
    - title: Authentication
      url: "#authentication"
      subitem: true
    - title: Serving
      url: "#serving"
      subitem: true
    - title: Build Artifacts
      url: "#build-artifacts"
      subitem: true
    - title:  Storage
      url: "#storage"
      subitem: true
---
# Managing the Store

## Packages

Like the other services, the Store is shipped as a [Docker image](https://hub.docker.com/r/screwdrivercd/store/) with port 80 exposed.

```bash
$ docker run -d -p 7000:80 screwdrivercd/store:stable
$ open http://localhost:7000
```

Our images are tagged for their version (eg. `1.2.3`) as well as a floating `latest` and `stable`. Most installations should be using `stable` or the fixed version tags.

## Configuration

Screwdriver already [defaults most configuration](https://github.com/screwdriver-cd/store/blob/master/config/default.yaml), but you can override defaults using a `config/local.yaml` or environment variables. All the possible environment variables are [defined here](https://github.com/screwdriver-cd/store/blob/master/config/custom-environment-variables.yaml).

### Authentication

Configure the validation of incoming JWTs from the API.

| Key                   | Default | Description                                                                                           |
|:----------------------|:--------|:------------------------------------------------------------------------------------------------------|
| SECRET_JWT_PUBLIC_KEY | *none*  | The public key used for verifying the signature of the JWT. Use the same one as configured in the API |
| JWT_MAX_AGE           | 13h     | Expiration of JWT                                                                                     |

```yaml
# config/local.yaml
auth:
    jwtPublicKey: |
        PUBLIC KEY HERE
    jwtMaxAge: 13h
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

### Build Artifacts

Configure some settings about storing Build Artifacts.

| Key                | Default              | Description                                         |
|:-------------------|:---------------------|:----------------------------------------------------|
| BUILDS_EXPIRE_TIME | 1814400000 (3 weeks) | How long should build logs stay around for          |
| BUILDS_MAX_BYTES   | 1073741824 (1GB)     | Upper limit on incoming uploads to builds artifacts |

```yaml
# config/local.yaml
builds:
    expiresInSec: 1814400000 # 3 weeks
    maxByteSize: 1073741824 # 1GB
```

### Storage

We have two methods of storing artifacts right now: - `memory` - In-memory store (inefficient and non-permanent) - `s3` - Amazon S3

| Key                  | Default | Description                                    |
|:---------------------|:--------|:-----------------------------------------------|
| STRATEGY             | memory  | Method of storing artifacts (memory or s3)     |
| S3_ACCESS_KEY_ID     | *none*  | Amazon access key                              |
| S3_ACCESS_KEY_SECRET | *none*  | Amazon secret access key                       |
| S3_REGION            | *none*  | Amazon S3 region                               |
| S3_BUCKET            | *none*  | Amazon S3 bucket that you have write access to |
| S3_ENDPOINT          | *none*  | Custom endpoint for Amazon S3 compatible API   |
| S3_DEFAULT_ACL       | public-read | default ACL for putting objects in your s3 bucket |

```yaml
# config/local.yaml
strategy:
    plugin: memory
    s3:
        accessKeyId: YOUR-KEY-ID
        secretAccessKey: YOUR-KEY-SECRET
        region: YOUR-REGION
        bucket: YOUR-BUCKET-ID
        endpoint: YOUR-S3-API-URL
```
