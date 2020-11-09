---
layout: main
title: Getting Started Developing
category: About
menu: menu
toc:
    - title: Getting Started Developing
      url: "#getting-started-developing"
      active: true
    - title: Running the Screwdriver API and UI
      url: "#running-the-screwdriver-api-and-ui"
    - title: Running SD-in-a-Box
      url: "#running-sd-in-a-box"
---
# Getting Started Developing

There's three different ways to set up your dev environment locally in order to run and test Screwdriver locally:

1. **Run the Screwdriver API and UI locally** - ideal for testing out npm package dependencies that don't require a build to be run
2. **Run SD-in-a-box** - ideal for running builds
3. **Develop the Screwdriver API and UI locally** - ideal for developing npm package dependencies and testing simple builds locally.

# Running the Screwdriver API and UI
## Running the API

### Prerequisites
- Node v8.0.0 or higher
- [Kubernetes][kubectl] or [Docker][docker]

### Installing

```bash
$ git clone git@github.com:screwdriver-cd/screwdriver.git ./
$ cd screwdriver/ # change directory into the newly cloned repository
$ npm install
# The API stores default configuration data in ./config/default.yaml.
# You'll need to overwrite using your own config data in a local.yaml.
$ vim ./config/local.yaml
```

### Configuring your local.yaml
There are several fields you will need to overwrite:

1. `auth`
1. `httpd`
1. `scms`
1. `ecosystem`

#### auth
##### jwtPrivateKey
This is a private key used for signing jwt tokens. Easily generate one by running `$ openssl genrsa -out jwt.pem 2048`
##### jwtPublicKey
This is a public key used for for verifying the signature. Generate one by running `$ openssl rsa -in jwt.pem -pubout -out jwt.pub`

At this point, your `./config/local.yaml` should look like:
```yaml
---
auth:
    jwtPrivateKey: |
        -----BEGIN RSA PRIVATE KEY-----
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        -----END RSA PRIVATE KEY-----
    jwtPublicKey: |
        -----BEGIN PUBLIC KEY-----
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEY
        -----END PUBLIC KEY-----
```

#### httpd
##### port
This is the port to listen on. It should match wherever your API server is going to run. In this case, it'll run at http://localhost:8080, so set the port to `8080`.

##### uri
This is the externally routable URI, so set it to `http://localhost:8080`.

Add this portion to your `local.yaml`:

```yaml
httpd:
    port: 8080
    uri: http://localhost:8080
```

#### scms
##### github
In this example, we'll set the github SCM. For further options, see the [default.yaml](https://github.com/screwdriver-cd/screwdriver/blob/master/config/default.yaml#L182-L222).

You'll need to set the `oauthClientId` and `oauthClientSecret`. Navigate to your [Developer Settings page](https://github.com/settings/developers), click New OAuth App. Set the fields as pictured here:

![Definition](../assets/scm-oauth-app.png)

Click Register Application and put the Client ID and Client Secret in the fields below.

```yaml
scms:
    github:
        plugin: github
        config:
            oauthClientId: SOMEOAUTHCLIENTID
            oauthClientSecret: SOMEOATHCLIENTSECRET
            secret: RANDOMSECRETTHING
```

#### ecosystem
##### ui
The uri for the UI needs to be updated to your local UI, so set it to `http://localhost:4200`.

```yaml
ecosystem:
    ui: http://localhost:4200
```

### Using your own node modules (optional)
If you want to test out some local node modules, `npm install` them now.

```bash
$ npm install <relative_path_to_your_node_module>
```

### Starting
Now that you've configured your `local.yaml`, save it and run:

```bash
$ npm start
info: Server running at http://localhost:8080
```
or
```bash
$ docker run --rm -it --volume=`pwd`/local.yaml:/config/local.yaml -p 8080 screwdrivercd/screwdriver:stable
info: Server running at http://localhost:8080
```

### Running the UI

Follow instructions in the UI [README.md](https://github.com/screwdriver-cd/ui/#screwdriver-ui).

Once you've got the UI running at http://localhost:4200, login.

# Running SD-in-a-Box

See [Running SD-in-a-Box docs](../../cluster-management/running-locally).

[docker]: https://www.docker.com/products/docker
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl-overview/
