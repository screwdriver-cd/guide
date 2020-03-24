---
layout: main
title: Local Build
category: User Guide
menu: menu
toc:
- title: What is sd-local ?
  url: "#what-is-sd-local-?"
- title: Installing sd-local
  url: "#installing-sd-local"
- title: Simple usage
  url: "#simple-usage"
- title: config command
  url: "#config-command"
- title: build command
  url: "#build-command"
---

# What is sd-local ?
sd-local enables running a more feature-complete local Screwdriver without needing uploading source code to SCM. With sd-local, you can use features such as Command, Template, Metadata, and more.


# Installing sd-local
## Requirements
- [docker](https://www.docker.com/)
  - Use Docker container as build environment.
- [git](https://git-scm.com/)
  - Required when using `--src-url` option.


## How to Install

Download a latest binary of [sd-local](https://github.com/screwdriver-cd/sd-local/releases) and install it in your environment like following.

```bash
$ mv sd-local_*_amd64 /usr/local/bin/sd-local
$ chmod +x /usr/local/bin/sd-local
```

# Quick start
This section describes the steps needed to execute a build with sd-local.  
Let Screwdriver API be `https://api.screwdriver.cd`, and let Screwdriver Store be `https://store.screwdriver.cd` in this section.


## Create user API token
sd-local uses an user API token to communicate with Screwdriver API and Store.  
Please create an user API token with reference to [Authentication and Authorization](api#authentication-and-authorization).


## Get repository for build
You have to get source code and `screwdriver.yaml` for build. You can use [quickstart-generic](https://github.com/screwdriver-cd-test/quickstart-generic.git).
```bash
$ git clone https://github.com/screwdriver-cd-test/quickstart-generic.git
$ cd quickstart-generic
```


## Build configuration
sd-local needs some settings for builds, so you have to configure using the `config` command:
```bash
$ sd-local config set api-url https://api.screwdriver.cd
$ sd-local config set store-url https://store.screwdriver.cd
$ sd-local config set token <API Token>
$ sd-local config set launcher-version latest
```


## Execute build
You can execute the main job using sd-local `build` command:


```bash
$ sd-local build main
INFO[0000] Prepare to start build...
sd-setup-launcher: Screwdriver Launcher information
sd-setup-launcher: Version:        v6.0.48
sd-setup-launcher: Pipeline:       #0
sd-setup-launcher: Job:            main
sd-setup-launcher: Build:          #0
sd-setup-launcher: Workspace Dir:  /sd/workspace
sd-setup-launcher: Checkout Dir:     /sd/workspace/src/screwdriver.cd/sd-local/local-build
sd-setup-launcher: Source Dir:     /sd/workspace/src/screwdriver.cd/sd-local/local-build
sd-setup-launcher: Artifacts Dir:  /sd/workspace/artifacts
export: $ export GREETING="Hello, world!"
export: set -e && export PATH=$PATH:/opt/sd && finish() { EXITCODE=$?; tmpfile=/tmp/env_tmp; exportfile=/tmp/env_export; export -p | grep -vi "PS1=" > $tmpfile && mv $tmpfile $exportfile; echo $SD_STEP_ID $EXITCODE; } && trap finish EXIT;
export:
hello: $ echo $GREETING
hello: Hello, world!
hello:
set-metadata: $ meta set example.coverage 99.95
set-metadata:
```


The build artifacts are created under the "./sd-artifacts" directory after the build is finished.
 
```bash
$ ls ./sd-artifacts
builds.log       environment.json steps.json
```


# config command
You can configure sd-local settings in key/value format by config command.  
Your settings are stored in `~/.sdlocal/config`.


## Usage


### set subcommand
You can configure sd-local in key/value format. You must set `api-url`, `store-url`, and `token` in order to execute builds.  
Please refer to the [List of keys](#list-of-keys) about available settings.
```bash
$ sd-local config set <key> <value>
```


### view subcommand
You can confirm the current settings.


```bash
$ sd-local config view
```

## Options
The following options can be used with the config command:


|option|description|
|---|---|
|--local|Read/Modify .sdlocal/config file in current directory|

### List of keys
You must set `api-url`, `store-url`, and `token` in order to execute builds.

|key|description|
|---|---|
|api-url|The Screwdriver API URL of the cluster you are using|
|store-url|The Screwdriver Store URL of the cluster you are using|
|token|An [API token](api#authentication-and-authorization) for the Screwdriver API of the cluster you are using|
|launcher-image|The launcher image (default: `screwdrivercd/launcher`)|
|launcher-version|The launcher version (default: `stable`)|


# build command
This command runs builds in your local environment.


## Usage
Run a build for a specific job. Even if the build succeeds, other builds are not triggered.
```bash
$ sd-local build <job name>
```


It starts the build based on the `screwdriver.yaml` config in the current directory. Build artifacts will be created under the "./sd-artifacts" directory.


## Options
The following options can be used with the build command:


|option|description|
|---|---|
|--artifacts-dir|The build artifacts destination (default: `./sd-artifacts`)|
|-e, --env|The environment variables in a build environment using `<key>=<value>` format (multiple variables allowed)|
|--env-file|The environment variables in a build environment using file format (refer to [env-file format](#env-file-format))|
|--local|Run command with .sdlocal/config file in current directory.|
|-m, --memory|The memory limit of the build environment (can be specified in b, k, m, or g memory unit)|
|--meta|The [metadata](metadata) used in a build environment using string JSON format: e.g. `"{\"HOGE\": \"FOO\"}"`|
|--meta-file|The [metadata](metadata) used in build environment using file format|
|--src-url|The remote SCM URL to build (`https` or `ssh` format)|
|--sudo|Use sudo command to execute docker runtime|


Note:
- sd-local uses the value specified by `--env` option, if a same environment variable is specified in both `--env` and `--env-file` options.
- You can't use both `--meta` and `--meta-file` options.
- If you don't have a permission for docker runtime, use `--sudo` option.


### env-file format
`--env-file` option expects a file with a file format like the [.env](https://docs.docker.com/compose/env-file/) format of docker.


- Each line in an `env` file should follow `VAR=VAL` format.
- Lines beginning with `#` are processed as comments and ignored.
- Blank lines are ignored.
- There is no special handling of quotation marks. This means that they are part of the VAL.

### How to use Secrets
You can use [Secrets](configuration/secrets) by passing `secrets` in `screwdriver.yaml` as environment variables with `--env` or `--env-file` option.

```
$ sd-local build <job name> --env <secret name>=<secret value>
```

## List of environment variables
You can use the following environment variables in sd-local build. The default values shown as  `-` are the same defaults as in production Screwdriver. Please refer to [environment variables](environment-variables) for more details.




|environment variable name|default value|
|---|---|
|SCREWDRIVER|false|
|CI|false|
|CONTINUOUS_INTEGRATION|false|
|SD_API_URL|api-url in your config|
|SD_STORE_URL|store-url in your config|
|SD_TOKEN|generated JWT based on the token in your config|
|SD_SOURCE_DIR|`/sd/workspace/src/screwdriver.cd/sd-local/local-build`|
|SD_JOB_NAME|-|
|SD_TEMPLATE_FULLNAME|-|
|SD_TEMPLATE_NAME|-|
|SD_TEMPLATE_NAMESPACE|-|
|SD_TEMPLATE_VERSION|-|
|SD_META_DIR|-|
|SD_META_PATH|-|
|SD_ROOT_DIR|-|
|SD_SOURCE_PATH|-|
|SD_ARTIFACTS_DIR|-|
