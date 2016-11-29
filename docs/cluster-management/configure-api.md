# Setting Up the API
To set up a Screwdriver cluster, configure and deploy the Screwdriver API.


## Configuration
Screwdriver already [defaults most configuration](https://github.com/screwdriver-cd/screwdriver/blob/master/config/default.yaml), but defaults can be overridden using a `local.yaml` or environment variables. All the possible environment variables are [defined here](config/custom-environment-variables.yaml). Create your own `local.yaml` by copy-pasting the contents of the `custom-environment-variables.yaml`.

### Auth
Set these environment variables:

| Key        | Required | Description |
| :------------- |:-------------| :-------------|
| SECRET_JWT_PRIVATE_KEY | Yes | A private key uses for signing jwt tokens. Generate one by running `$ openssl genrsa -out jwt.pem 2048` |
| SECRET_JWT_PUBLIC_KEY | Yes | The public key used for verifying the signature. Generate one by running `$ openssl rsa -in jwt.pem -pubout -out jwt.pub` |
| SECRET_ACCESS_KEY | No | The access token to use on behalf of a user to access the API. Used as an alternative to the OAuth flow |
| SECRET_ACCESS_USER | No | The user name associated with the temporary access token. Used as a means of functionally testing the API |
| SECRET_COOKIE_PASSWORD | Yes | A password used for encrypting session data. **Needs to be minimum 32 characters** |
| SECRET_PASSWORD | Yes | A password used for encrypting stored secrets. **Needs to be minimum 32 characters** |
| IS_HTTPS | No | A flag to set if the server is running over https. Used as a flag for the OAuth flow (default to `false`) |
| SECRET_WHITELIST | No | Whitelist of users able to authenticate against the system. One username per line, beginning with an indent and `-`. If empty, it allows everyone. |
| SECRET_ADMINS | No | Whitelist of users able to authenticate against the system. One username per line, beginning with an indent and `-`. If empty, it allows everyone. |


Or modify your `local.yaml`:
```yaml
auth:
    jwtPrivateKey: SECRET_JWT_PRIVATE_KEY
    jwtPublicKey: SECRET_JWT_PUBLIC_KEY
    temporaryAccessKey: SECRET_ACCESS_KEY
    temporaryAccessUser: SECRET_ACCESS_USER
    cookiePassword: SECRET_COOKIE_PASSWORD
    encryptionPassword: SECRET_PASSWORD
    https: IS_HTTPS
    whitelist:
        __name: SECRET_WHITELIST
        __format: json
    admins:
        __name: SECRET_ADMINS
        __format: json
```


### httpd
Set these environment variables:

| Key        | Default | Description |
| :------------- |:-------------| :-------------|
| PORT | 80 | Port to listen on (default port `80`) |
| HOST | 0.0.0.0 | Host to listen on (set to localhost to only accept connections from this machine) (default `0.0.0.0`) |
| URI | http://localhost:80 | Externally routable URI (usually your load balancer or CNAME)|
| tls | false | SSL support; for SSL, replace `tls: false` with an object that provides the options required by `tls.createServer` https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener |

Or modify your `local.yaml`:
```yaml
httpd:
    port: PORT
    host: HOST
    uri: URI
    tls: false
        # For SSL, replace `tls: false` with an object that
        # provides the options required by `tls.createServer`
        # https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
        # key: |
        #     PRIVATE KEY HERE
        # cert: |
        #     YOUR CERT HERE
```

### datastore, executor, and scm plugins
See the [plugins](./plugins.md) section.

### ecosystem
Specify externally routable URLs for your UI and artifact store here by modifying your local.yaml.

```yaml
ecosystem:
    # Externally routable URL for the User Interface
    ui: https://cd.screwdriver.cd
    # Externally routable URL for the Artifact Store
    store: https://store.screwdriver.cd
    # Badge service (needs to add a status and color)
    badges: https://img.shields.io/badge/build-{{status}}-{{color}}.svg
```

### Environment Variables

To override using environment variables, do something like:

```bash
$ export K8S_HOST=127.0.0.1
$ export K8S_TOKEN=this-is-a-real-token
$ export SECRET_OAUTH_CLIENT_ID=totally-real-client-id
$ export SECRET_OAUTH_CLIENT_SECRET=another-real-client-secret
```

## Deployment
To set up Screwdriver, deploy the [Screwdriver API docker image](https://hub.docker.com/r/screwdrivercd/screwdriver/tags)  (we recommend using the `stable` version). To use Kubernetes to deploy the API, follow instructions [here](kubernetes.md).
