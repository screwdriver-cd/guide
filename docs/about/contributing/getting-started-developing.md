---
layout: main
title: Getting Started Developing
category: About
menu: menu
toc:
    - title: Getting Started Developing
      url: "#getting-started-developing"
    - title: Developing locally
      url: "#developing-locally"
      active: true
    - title: Developing locally with executor-queue
      url: "#developing-locally-with-executor-queue-and-queue-service"
    - title: Developing locally with custom launcher
      url: "#developing-locally-with-a-custom-launcher-image"
---
# Getting Started Developing

There's two different ways to set up your dev environment locally in order to run and test Screwdriver locally:

1. **Run the Screwdriver API and UI locally** - ideal for testing out npm package dependencies and run build locally.
See [Developing locally docs](#developing-locally).
2. **Run SD-in-a-box** - ideal for running builds without manual configuration. See [Running SD-in-a-Box docs](../../cluster-management/running-locally).

## Developing Locally

### Prerequisites

- [Node](https://nodejs.org/) v12.0.0 or higher
- [Docker](https://www.docker.com/products/docker-desktop)

### Step 1: Map domain name sd.screwdriver.cd to your ip in hosts file
* Append this line to your /etc/hosts file:

  ```
  127.0.0.1 sd.screwdriver.cd
  ```

### Step 2: Create a new Github OAuth Application
Go to Settings > Developer settings > OAuth Apps, click `New OAuth App` button and configure as described below:

* Application Name: (choose for yourself)
* Homepage URL: `http://sd.screwdriver.cd:4200`
* Application description: (choose for yourself)
* Authorization callback URL: `http://sd.screwdriver.cd:9001/v4/auth/login`

See screenshot below

![developing-locally-ouath](../../cluster-management/assets/developing-locally-ouath.png)

> Take note of the client ID and the client Secret, you'll need them in the following step

## Step 3: Clone necessary repos from github of screwdriver-cd organization:
* [ui](https://github.com/screwdriver-cd/ui)
* [screwdriver](https://github.com/screwdriver-cd/screwdriver)
* [store](https://github.com/screwdriver-cd/store)
* [queue-service](https://github.com/screwdriver-cd/queue-service)

```bash
git clone https://github.com/screwdriver-cd/ui.git
git clone https://github.com/screwdriver-cd/screwdriver.git
git clone https://github.com/screwdriver-cd/store.git
git clone https://github.com/screwdriver-cd/queue-service.git
```

## Step 4: Add local config files for these three repos
Create a file called `local.js` in `ui/config` and `local.yaml` in `screwdriver/config` and `local.yaml` in `queue-service/config` and `store/config` folders.

### ui/config/local.js

```javascript
let SDAPI_HOSTNAME;
let SDSTORE_HOSTNAME;

SDAPI_HOSTNAME = 'http://sd.screwdriver.cd:9001';
SDSTORE_HOSTNAME = 'http://sd.screwdriver.cd:9002';

module.exports = {
  SDAPI_HOSTNAME,
  SDSTORE_HOSTNAME
};
```

### screwdriver/config/local.yaml
* Fill in your Github OAuth **client id** (oauthClientId) and OAuth **client secret**, (oauthClientSecret) you can find them in the OAuth application you created in Step2

* Generate your own **jwtPrivateKey** (jwtPrivateKey) and **jwtPublicKey** (jwtPublicKey) using
    ```bash
    openssl genrsa -out jwt.pem 2048
    openssl rsa -in jwt.pem -pubout -out jwt.pub
    ```
* Create a folder called "mw-data" using `mkdir mw-data` in your screwdriver repo

* Fill in your ip (YOUR_IP), look up your ip first using `ifconfig`
> You may need to update this IP because of location changes.

```
auth:
    jwtPrivateKey: |
        -----BEGIN RSA PRIVATE KEY-----
        *********SOME KEYS HERE********
        -----END RSA PRIVATE KEY-----

    jwtPublicKey: |
        -----BEGIN PUBLIC KEY-----
        ******SOME KEYS HERE******
        -----END PUBLIC KEY-----

httpd:
  # Port to listen on
  port: 9001

  # Host to listen on (set to localhost to only accept connections from this machine)
  host: 0.0.0.0

  # Externally routable URI (usually your load balancer or CNAME)
  # This requires to be a routable IP inside docker for executor, see
  # https://github.com/screwdriver-cd/screwdriver/blob/095eaf03e053991443abcbde91c62cfe06a28cba/lib/server.js#L141
  uri: http://YOUR_IP:9001

ecosystem:
  # Externally routable URL for the User Interface
  ui: http://sd.screwdriver.cd:4200

  # Externally routable URL for the Artifact Store
  store: http://YOUR_IP:9002

  allowCors: ['http://sd.screwdriver.cd', 'http://YOUR_IP:9001']

executor:
    plugin: docker
    docker:
        enabled: true
        options:
            docker:
                socketPath: "/var/run/docker.sock"

scms:
    github:
        plugin: github
        config:
            # github
            oauthClientId: your-oauth-client-id
            oauthClientSecret: your-oauth-client-secret
            secret: a-really-real-secret
            username: sd-buildbot
            email: dev-null@screwdriver.cd
            privateRepo: false

datastore:
  plugin: sequelize
  sequelize:
    # Type of server to talk to
    dialect: sqlite
    # Storage location for sqlite
    storage: ./mw-data/storage.db
```

### store/config/local.yaml
* Similar to the `mw-data` file for the screwdriver repo, you will need to create a folder called "store-data" in your store repo using `mkdir store-data`

```
auth:
    # A public key for verifying JWTs signed by api.screwdriver.cd
    jwtPublicKey: |
        -----BEGIN PUBLIC KEY-----
        ******SOME KEYS HERE******
        -----END PUBLIC KEY-----

strategy:
    plugin: disk
    disk:
        cachePath: './store-data'
        cleanEvery: 3600000
        partition : 'cache'

httpd:
    port: 9002

ecosystem:
    # Externally routable URL for the User Interface
    ui: http://sd.screwdriver.cd:4200

    # Externally routable URL for the Artifact Store
    api: http://sd.screwdriver.cd:9001

    allowCors: ['http://sd.screwdriver.cd']
```

### Step 5: Install dependencies and you are ready to go!
Just need to run below commands inside each repo

```
npm install && npm run start
```

While the UI, Screwdriver API, and Store apps are running, you can visit `http://sd.screwdriver.cd:4200` in your browser to interact with your local Screwdriver.

## Developing locally with executor queue and queue service

Instead of using single Docker executor, we can use the Redis queue to enable Screwdriver to run more sophisticated [workflows](https://docs.screwdriver.cd/user-guide/configuration/workflow) such as: `build_periodically ` and `freezeWindow`.

### Step 1: Install Redis server and client

> We use [brew](https://brew.sh/) as a Package Manager for Mac, you need to have `brew` installed locally prior to proceeding.

```bash
brew install redis
```

To have launchd, start Redis now and restart at login:

```bash
brew services start redis
```

Or, if you don't want/need a background service you can just run:

```bash
redis-server /usr/local/etc/redis.conf
```

Test to see if the Redis server is running.

```bash
redis-cli ping
```

If it replies “PONG”, then it’s good to go!

Location of the Redis configuration file. Modify "requirepass" if you want to set the password.

```bash
/usr/local/etc/redis.conf
```

Uninstall Redis and its files.

```bash
brew uninstall redis
rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

### Step 2: Clone repository [queue-service](https://github.com/screwdriver-cd/queue-service) and add local.yaml

```bash
git clone git@github.com:screwdriver-cd/queue-service.git
```

#### Create queue-service/config/local.yaml

Create this file for storing local configuration.

* Generate your own **jwtPrivateKey** (jwtPrivateKey) and **jwtPublicKey** (jwtPublicKey) using
    ```bash
    openssl genrsa -out jwt-qs.pem 2048
    openssl rsa -in jwt-qs.pem -pubout -out jwt-qs.pub
    ```

```yaml

auth:
  jwtPrivateKey: |
    # paste jwt-qs.pem from previous step
  jwtPublicKey: |
    # paste  jwt-qs.pub from previous step
  # The public key used for verifying the signature of token from SD api
  jwtSDApiPublicKey: |
    # API Public Key generated in earlier step

 httpd:
  port: 9003
  host: 0.0.0.0
  uri: http://YOUR_IP:9003

 executor:
    plugin: docker
    docker:
      enabled: true
      options:
        docker:
            socketPath: "/var/run/docker.sock"

 ecosystem:
    # Externally routable URL for the User Interface
    ui: http://sd.screwdriver.cd:4200
    # Externally routable URL for the API
    api: http://$YOUR_IP:9001
    # Externally routable URL for the Artifact Store
    store: http://$YOUR_IP:9002

 queue:
    # Configuration of the redis instance containing resque
    redisConnection:
        host: "127.0.0.1"
        port: 6379
        options:
            password: ''
            tls: false
        database: 0
        prefix: ""
```

### Step 3: Modify screwdriver/config/local.yaml, change executor configuration and add queue uri

```yaml

 auth:
    jwtQueueServicePublicKey: |
      # paste jwt-qs.pub from previous step

 ecosystem:
    # Externally routable URL for the User Interface
    ui: http://sd.screwdriver.cd:4200
    # Externally routable URL for the Artifact Store
    store: http://$YOUR_IP:9002
    # Routable URI of the queue service
    queue: http://$YOUR_IP:9003

 executor:
    plugin: queue # <- this step is essential in order to use queue
    queue:
        options:
            # Configuration of the redis instance containing resque
            redisConnection:
                host: "127.0.0.1"
                port: 6379
                options:
                    password: ''
                    tls: false
                database: 0
                prefix: ""
```

Now, start the Screwdriver backend server and queue service to use Redis queue.


```bash
npm install && npm run start
```

## Developing locally with a custom launcher image

### Build your own launcher binary and image
```bash
git clone git@github.com:screwdriver-cd/launcher.git
cd launcher
env GOOS=linux GOARCH=arm go build .
docker build . -f Dockerfile.local
# let x be the IMAGE ID. You need to be signed in to your Docker account in Docker app
docker tag X jithine/launcher:dev
docker push jithine/launcher:dev

```

### Modify API locl.yaml to use your local launcher
```yaml
 executor:
    plugin: docker
    docker:
      enabled: true
      options:
        launchImage: jithine/launcher
        launchVersion: dev
        docker:
            socketPath: "/var/run/docker.sock"
```
