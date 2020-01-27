---
layout: main
title: Configuring the UI
category: Cluster Management
menu: menu
toc:
    - title: Developing locally
      url: "#developing-locally"
      active: true
    - title: Developing locally with executor-queue
      url: "#developing-locally-with-executor-queue"

---
## Developing Locally

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

See screenshot as below

![developing-locally-ouath](./assets/developing-locally-ouath.png)

> Take note of the client ID and the client Secret, you'll need them in following steps

## Step 3: Clone necessary repos from github of screwdriver-cd organization:
* [ui](https://github.com/screwdriver-cd/ui)
* [screwdriver](https://github.com/screwdriver-cd/screwdriver)
* [store](https://github.com/screwdriver-cd/store)

```bash
git clone git@github.com:screwdriver-cd/ui.git
git clone git@github.com:screwdriver-cd/screwdriver.git
git clone git@github.com:screwdriver-cd/store.git
```

## Step 4: Add local config files for these three repos
Create a file called `local.js` in `ui/config` and `local.yaml` in `screwdriver/config` and `store/config` folders.

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
* Remember to fill in your Github OAuth **client id** and OAuth **client secret**, you can find them in the OAuth application you created in Step2
* Remember to generate your own **jwtPrivateKey** and **jwtPublicKey** using
    ```bash
    openssl genrsa -out jwt.pem 2048
    openssl rsa -in jwt.pem -pubout -out jwt.pub
    ```
* Remember to create a folder called "mw-data": `mkdir mw-data`

* Look up your ip first: `ifconfig`, YOUR_IP
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

datastore:
  plugin: sequelize
  sequelize:
    # Type of server to talk to
    dialect: sqlite
    # Storage location for sqlite
    storage: ./mw-data/storage.db
```

### store/config/local.yaml
* Similarly like the `mw-data`, remember to create a folder called "store-data": `mkdir store-data`

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

While all ui, screwdriver and store are runing, now you can go to `http://sd.screwdriver.cd:4200` to check out.

## Developing locally with executor-queue

> TODO



