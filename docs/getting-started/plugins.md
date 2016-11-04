# Configure your plugins
Screwdriver already defaults most configuration, but you can override defaults by setting environment variables or modifying your `local.yaml`.

## Datastore
To use DynamoDB, use [dynamodb](https://github.com/screwdriver-cd/datastore-dynamodb) plugin. To use Postgres, MySQL, and Sqlite, use [sequelize](https://github.com/screwdriver-cd/datastore-sequelize) plugin.

#### DynamoDB
Set these environment variables:

| Environment name | Required | Default Value | Description |
| :--- | :---- | :--- | :--- | :--- |
| DATASTORE_PLUGIN | Yes | | Set to `dynamodb`
| DATASTORE_DYNAMODB_PREFIX | No | '' (empty string) | Prefix to add before all table names
| DATASTORE_DYNAMODB_ID | Yes | | AWS Access Key Id
| DATASTORE_DYNAMODB_SECRET | Yes | |  AWS Secret Access Key

Or modify your `local.yaml`:
```yaml
datastore:
    plugin: dynamodb
    dynamodb:
        # Prefix to the table names
        prefix: TABLE-PREFIX
        accessKeyId: AWS-ACCESS-KEY-ID
        secretAccessKey: AWS-SECRET-ACCESS-KEY
```

#### Sequelize
Set these environment variables:

| Environment name | Required | Default Value | Description |
| :--- | :---- | :--- | :--- | :--- |
| DATASTORE_PLUGIN | Yes| | Set to `sequelize`
| DATASTORE_SEQUELIZE_DIALECT | No | mysql | Can be `sqlite`, `postgres`, `mysql`, or `mssql`
| DATASTORE_SEQUELIZE_DATABASE | No | screwdriver | Database name
| DATASTORE_SEQUELIZE_USERNAME | No for sqlite | | Login username
| DATASTORE_SEQUELIZE_PASSWORD | No for sqlite | | Login password
| DATASTORE_SEQUELIZE_STORAGE | Yes for sqlite | | Storage location for sqlite
| DATASTORE_SEQUELIZE_HOST | No | | Network host
| DATASTORE_SEQUELIZE_PORT | No | | Network port

Or modify your `local.yaml`:
```yaml
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

## Executor
We currently support [kubernetes](https://github.com/screwdriver-cd/executor-k8s) and [docker](git@github.com:screwdriver-cd/executor-docker.git) executor

#### Kubernetes
Set these environment variables:

| Environment name | Required | Default Value | Description |
| :--- | :---- | :--- | :--- | :--- |
| EXECUTOR_PLUGIN | Yes | | Set to `k8s` |
| LAUNCH_VERSION | Yes | | Launcher version to use |
| K8S_HOST | Yes | | Kubernetes host |
| K8S_TOKEN | Yes | | JWT for authenticating Kubernetes requests  |
| K8S_JOBS_NAMESPACE | No | 'default' | Jobs namespace for Kubernetes jobs URL  |

Or modify your `local.yaml`:
```yaml
executor:
    plugin: k8s
    k8s:
        kubernetes:
            # The host or IP of the kubernetes cluster
            host: YOUR-KUBERNETES-HOST
            token: JWT-FOR-AUTHENTICATING-KUBERNETES-REQUEST
            jobsNamespace: JOBS-NAMESPACE
        launchVersion: LAUNCHER-VERSION
```

#### Docker
Or set these environment variables:

| Environment name | Description |
| :--- | :---- |
| EXECUTOR_PLUGIN | Set to `docker` |
| LAUNCH_VERSION | Launcher version to use |
| EXECUTOR_DOCKER_DOCKER | Configuration of docker |

Modify your `local.yaml`:
```yaml
executor:
    plugin: docker
    docker:
        docker:
            __name: EXECUTOR_DOCKER_DOCKER
            __format: json
        launchVersion: LAUNCHER-VERSION
```

## Source Control
We currently support [Github](https://github.com/screwdriver-cd/scm-github) and [Bitbucket.org](https://github.com/screwdriver-cd/scm-bitbucket)

### Step 1: Set up your OAuth Application
You will need to set up an OAuth Application and retrieve your OAuth Client ID and Secret.

#### Github:
1. Navigate to the [Github OAuth applications](https://github.com/settings/developers) page.
2. Click on the application you created to get your OAuth Client ID and Secret.
3. Fill out the `Homepage URL` and `Authorization callback URL` to be the IP address of where your API is running.

#### Bitbucket.org:
1. Navigate to the Bitbucket OAuth applications: [https://bitbucket.org/account/user/{your-username}/api](https://bitbucket.org/account/user/{your-username}/api)
2. Click on `Add Consumer`.
3. Fill out the `URL` and `Callback URL` to be the IP address of where your API is running.

### Step 2: Configure your SCM plugin
Set these environment variables:

| Environment name | Required | Default Value | Description |
| :--- | :---- | :--- | :--- | :--- |
| SCM_PLUGIN | No | github | `github` or `bitbucket` |
| SECRET_OAUTH_CLIENT_ID | Yes | | Your OAuth Client Id (Application key) |
| SECRET_OAUTH_CLIENT_SECRET | Yes | | You OAuth Client secret (Application secret) |
| WEBHOOK_GITHUB_SECRET | Yes for Github | | Secret to sign for webhooks |
| SCM_GITHUB_GHE_HOST |  Yes for Github Enterprise | | GHE host for Github Enterprise|

Or modify your `local.yaml`:

#### Github:
```yaml
scm:
    plugin: github
    github:
        oauthClientId: YOUR-OAUTH-CLIENT-ID
        oauthClientSecret: YOUR-OAUTH-CLIENT-SECRET
        # Secret to add to GitHub webhooks so that we can validate them
        secret: SUPER-SECRET-SIGNING-THING
        # You can also configure for use with GitHub enterprise
        # gheHost: github.screwdriver.cd
```

#### Bitbucket.org
```yaml
scm:
    plugin: bitbucket
    bitbucket:
        oauthClientId: YOUR-APP-KEY
        oauthClientSecret: YOUR-APP-SECRET
```
