---
layout: main
title: Configuring the API
category: Cluster Management
menu: menu
toc: 
    - title: Managing the API
      url: "#managing-the-api"
      active: true
    - title: Packages
      url: "#packages"
    - title: Configuration
      url: "#configuration"
    - title: Extending the Docker container
      url: "#extending-the-docker-container"
---
# Managing the API

## Packages

Like the other services, the API is shipped as a [Docker image](https://hub.docker.com/r/screwdrivercd/screwdriver/) with port 8080 exposed.

```bash
$ docker run -d -p 9000:8080 screwdrivercd/screwdriver:stable
$ open http://localhost:9000
```

Our images are tagged for their version (eg. `1.2.3`) as well as a floating `latest` and `stable`.  Most installations should be using `stable` or the fixed version tags.

## Configuration
Screwdriver already [defaults most configuration](https://github.com/screwdriver-cd/screwdriver/blob/master/config/default.yaml), but you can override defaults using a `config/local.yaml` or environment variables. All the possible environment variables are [defined here](https://github.com/screwdriver-cd/screwdriver/blob/master/config/custom-environment-variables.yaml).

### Authentication / Authorization

Configure how users can and who can access the API.

| Key                    | Required | Description                                                                                                               |
|:-----------------------|:---------|:--------------------------------------------------------------------------------------------------------------------------|
| SECRET_JWT_PRIVATE_KEY | Yes      | A private key uses for signing jwt tokens. Generate one by running `$ openssl genrsa -out jwt.pem 2048`                   |
| SECRET_JWT_PUBLIC_KEY  | Yes      | The public key used for verifying the signature. Generate one by running `$ openssl rsa -in jwt.pem -pubout -out jwt.pub` |
| SECRET_COOKIE_PASSWORD | Yes      | A password used for encrypting session data. **Needs to be minimum 32 characters**                                        |
| SECRET_PASSWORD        | Yes      | A password used for encrypting stored secrets. **Needs to be minimum 32 characters**                                      |
| IS_HTTPS               | No       | A flag to set if the server is running over https. Used as a flag for the OAuth flow (default to `false`)                 |
| SECRET_WHITELIST       | No       | Whitelist of users able to authenticate against the system. If empty, it allows everyone. (JSON Array format)             |
| SECRET_ADMINS          | No       | Whitelist of users able to authenticate against the system. If empty, it allows everyone. (JSON Array format)             |

```yaml
# config/local.yaml
auth:
    jwtPrivateKey: |
        PRIVATE KEY HERE
    jwtPublicKey: |
        PUBLIC KEY HERE
    cookiePassword: 975452d6554228b581bf34197bcb4e0a08622e24
    encryptionPassword: 5c6d9edc3a951cda763f650235cfc41a3fc23fe8
    https: false
    whitelist:
        - batman
        - robin
    admins:
        - batman
```

### Bookend Plugins

You can globally configure which built-in bookend plugins will be used during a build. By default, `scm` is enabled to begin builds with a SCM checkout command.

If you're looking to include a custom bookend in the API, please refer [here](#extending-the-docker-container).

| Key | Default| Description |
|:----|:-------|:------------|
| BOOKENDS_SETUP | None | The ordered list of plugins to execute at the beginning of every build. Take the forms of `'["first", "second", ...]'` |
| BOOKENDS_TEARDOWN | None | The ordered list of plugins to execute at the end of every build. Take the forms of `'["first", "second", ...]'` |


```yaml
# config/local.yaml
bookends:
    setup:
        - scm
        - my-custom-bookend
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

### Ecosystem

Specify externally routable URLs for your UI, Artifact Store, and Badge service.

| Key              | Default                                                     | Description                                  |
|:-----------------|:------------------------------------------------------------|:---------------------------------------------|
| ECOSYSTEM_UI     | https://cd.screwdriver.cd                                   | URL for the User Interface                   |
| ECOSYSTEM_STORE  | https://store.screwdriver.cd                                | URL for the Artifact Store                   |
| ECOSYSTEM_BADGES | https://img.shields.io/badge/build-{{status}}-{{color}}.svg | URL with templates for status text and color |

```yaml
# config/local.yaml
ecosystem:
    # Externally routable URL for the User Interface
    ui: https://cd.screwdriver.cd
    # Externally routable URL for the Artifact Store
    store: https://store.screwdriver.cd
    # Badge service (needs to add a status and color)
    badges: https://img.shields.io/badge/build-{{status}}-{{color}}.svg
```

### Datastore Plugin

To use Postgres, MySQL, and Sqlite, use [sequelize](https://github.com/screwdriver-cd/datastore-sequelize) plugin.

#### Sequelize
Set these environment variables:

| Environment name             | Required       | Default Value | Description                                      |
|:-----------------------------|:---------------|:--------------|:-------------------------------------------------|
| DATASTORE_PLUGIN             | Yes            |               | Set to `sequelize`                               |
| DATASTORE_SEQUELIZE_DIALECT  | No             | mysql         | Can be `sqlite`, `postgres`, `mysql`, or `mssql` |
| DATASTORE_SEQUELIZE_DATABASE | No             | screwdriver   | Database name                                    |
| DATASTORE_SEQUELIZE_USERNAME | No for sqlite  |               | Login username                                   |
| DATASTORE_SEQUELIZE_PASSWORD | No for sqlite  |               | Login password                                   |
| DATASTORE_SEQUELIZE_STORAGE  | Yes for sqlite |               | Storage location for sqlite                      |
| DATASTORE_SEQUELIZE_HOST     | No             |               | Network host                                     |
| DATASTORE_SEQUELIZE_PORT     | No             |               | Network port                                     |

```yaml
# config/local.yaml
datastore:
    plugin: sequelize
    sequelize:
        dialect: TYPE-OF-SERVER
        storage: STORAGE-LOCATION
        database: DATABASE-NAME
        username: DATABASE-USERNAME
        password: DATABASE-PASSWORD
        host: NETWORK-HOST
        port: NETWORK-PORT
```

### Executor Plugin

We currently support [kubernetes](https://github.com/screwdriver-cd/executor-k8s) and [docker](http://github.com/screwdriver-cd/executor-docker) executor

#### Kubernetes
Set these environment variables:

| Environment name   | Default Value | Description                                |
|:-------------------|:--------------|:-------------------------------------------|
| EXECUTOR_PLUGIN    |               | Set to `k8s`                               |
| LAUNCH_VERSION     |               | Launcher version to use                    |
| K8S_HOST           |               | Kubernetes host                            |
| K8S_TOKEN          |               | JWT for authenticating Kubernetes requests |
| K8S_JOBS_NAMESPACE | default       | Jobs namespace for Kubernetes jobs URL     |

```yaml
# config/local.yaml
executor:
    plugin: k8s
    k8s:
        kubernetes:
            # The host or IP of the kubernetes cluster
            host: YOUR-KUBERNETES-HOST
            token: JWT-FOR-AUTHENTICATING-KUBERNETES-REQUEST
            jobsNamespace: default
        launchVersion: stable
```

#### Docker
Or set these environment variables:

| Environment name       | Default Value | Description                                                                                      |
|:-----------------------|:--------------|:-------------------------------------------------------------------------------------------------|
| EXECUTOR_PLUGIN        | docker        | Set to `docker`                                                                                  |
| LAUNCH_VERSION         | stable        | Launcher version to use                                                                          |
| EXECUTOR_DOCKER_DOCKER | `{}`          | [Dockerode configuration](https://www.npmjs.com/package/dockerode#getting-started) (JSON object) |

```yaml
# config/local.yaml
executor:
    plugin: docker
    docker:
        docker:
            socketPath: /var/lib/docker.sock
        launchVersion: stable
```

### Email Notifications

Configure the SMTP server and sender address that email notifications will be sent from.

```yaml
# config/local.yaml
notifications:
    email:
        host: smtp.yourhost.com
        port: 25
        from: example@email.com
```

Configurable authentication settings have not yet been built, but can easily be added. We’re using the <a href="https://nodemailer.com/about/">nodemailer</a> package to power emails, so authentication features will be similar to any typical nodemailer setup. Contribute at: <a href="https://github.com/screwdriver-cd/notifications-email">https://github.com/screwdriver-cd/notifications-email</a>

### Source Control Plugin

We currently support [Github](https://github.com/screwdriver-cd/scm-github) and [Bitbucket.org](https://github.com/screwdriver-cd/scm-bitbucket)

#### Step 1: Set up your OAuth Application
You will need to set up an OAuth Application and retrieve your OAuth Client ID and Secret.

##### Github:
1. Navigate to the [Github OAuth applications](https://github.com/settings/developers) page.
2. Click on the application you created to get your OAuth Client ID and Secret.
3. Fill out the `Homepage URL` and `Authorization callback URL` to be the IP address of where your API is running.

##### Bitbucket.org:
1. Navigate to the Bitbucket OAuth applications: [https://bitbucket.org/account/user/{your-username}/api](https://bitbucket.org/account/user/{your-username}/api)
2. Click on `Add Consumer`.
3. Fill out the `URL` and `Callback URL` to be the IP address of where your API is running.

#### Step 2: Configure your SCM plugin
Set these environment variables:

| Environment name           | Required                  | Default Value | Description                                  |
|:---------------------------|:--------------------------|:--------------|:---------------------------------------------|
| SCM_PLUGIN                 | No                        | github        | `github` or `bitbucket`                      |
| SECRET_OAUTH_CLIENT_ID     | Yes                       |               | Your OAuth Client Id (Application key)       |
| SECRET_OAUTH_CLIENT_SECRET | Yes                       |               | You OAuth Client secret (Application secret) |
| WEBHOOK_GITHUB_SECRET      | Yes for Github            |               | Secret to sign for webhooks                  |
| SCM_GITHUB_GHE_HOST        | Yes for Github Enterprise |               | GHE host for Github Enterprise               |
| SCM_PRIVATE_REPO_SUPPORT   | No                        | false         | Ask Github users for 'repo' scope to allow read/write access to public and private repo |
| SCM_USERNAME               | No                        | sd-buildbot   | Username for checkout                        |
| SCM_EMAIL                  | No                        | dev-null@screwdriver.cd | Email of user for checkout         |


##### Github:
```yaml
# config/local.yaml
scm:
    plugin: github
    github:
        oauthClientId: YOUR-OAUTH-CLIENT-ID
        oauthClientSecret: YOUR-OAUTH-CLIENT-SECRET
        # Secret to add to GitHub webhooks so that we can validate them
        secret: SUPER-SECRET-SIGNING-THING
        # You can also configure for use with GitHub enterprise
        # gheHost: github.screwdriver.cd
        # Whether to support private repo
        # privateRepo: true
```

If users want to use private repo, they also need to set up `SCM_USERNAME` and `SCM_ACCESS_TOKEN` as [secrets](../../user-guide/configuration/secrets) in their `screwdriver.yaml`.

##### Bitbucket.org
```yaml
# config/local.yaml
scm:
    plugin: bitbucket
    bitbucket:
        oauthClientId: YOUR-APP-KEY
        oauthClientSecret: YOUR-APP-SECRET
```

## Extending the Docker container

There are some scenarios where you would prefer to extend the Screwdriver.cd Docker image, such as using custom Bookend plugins. This section is not meant to be exhaustive or complete, but will provide insight into some of the fundamental cases.

### Using a custom bookend

Using a custom bookend is a common case where you would extend the Screwdriver.cd Docker image.

In this chosen example, we want to have our bookend execute before the `scm` (which checks out the code from the configured SCM). Although the bookend plugins can be configured by environment variables, we will show how to accomplish the same task with a `local.yaml` file.

This is shown in the following `local.yaml` snippet:

```yaml
# local.yaml
---
  ...
bookends:
  setup:
    - my-custom-bookend
    - scm
```

For building our extended Docker image, we will need to create a `Dockerfile` that will have our extra dependencies installed. If you would prefer to save the `local.yaml` configuration file in the Docker image instead of mounting it in later, you may do so in the Dockerfile as well.

```dockerfile
# Dockerfile
FROM screwdrivercd/screwdriver:stable

# Install additional NPM bookend plugin
RUN cd /usr/src/app && /usr/local/bin/npm install my-custom-bookend

# Optionally save the configuration file in the image
ADD local.yaml /config/local.yaml
```

Once you build the Docker image, you will need to deploy it to your Screwdriver.cd cluster. For instance, if you're using Kubernetes, you would replace the `screwdrivercd/api:stable` image to your custom Docker image.

The following is an example snippet of an updated Kubernetes deployment configuration:

```yaml
# partial Kubernetes configuration
  ...
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: screwdriver-api
        # The image name is the one you specified when built
        # The tag name is the tag you specified when built
        image: my_extended_docker_image_name:tag_name
```
