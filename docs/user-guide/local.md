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
  - Required when using [--src-url] option.


## How to Install


You can install sd-local by the following command.
```bash
$ go get github.com/screwdriver-cd/sd-local
```


Note:
go command is required to install sd-local.
https://golang.org/


# Simple usage
This section describes the steps to execute build with sd-local.
Let Screwdriver API be `https://api.screwdriver.cd`, and let Screwdriver Store be `https://store.screwdriver.cd` in this section.


## Create API token
sd-local uses an API token to communicate with Screwdriver API and Store.
Please create an API token with reference to [Authentication and Authorization](api#authentication-and-authorization).


## Get repository for build
You have to get source code and `screwdriver.yaml` for build. You can use [quickstart-generic](https://github.com/screwdriver-cd-test/quickstart-generic.git).
```bash
$ git clone https://github.com/screwdriver-cd-test/quickstart-generic.git
$ cd quickstart-generic
```


## Build configuration
sd-local needs some settings for builds, so you have to configure with config command.
```bash
$ sd-local config set api-url https://api.screwdriver.cd
$ sd-local config set store-url https://store.screwdriver.cd
$ sd-local config set token <API Token>
$ sd-local config set launcher-version latest
```


## Execute build
You can execute the main job using sd-local.


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
You can configure sd-local in key/value format. You have to set `api-url`, `store-url` and `token` to execute builds.
Please refer to [List of the keys](#list-of-the-key) about available settings.
```bash
$ sd-local config set <key> <value>
```


### view subcommand
You can confirm the current settings.


```bash
$ sd-local config view
```


### List of the key.

|key|description|
|---|---|
|api-url|Please specify the URL of Screwdriver API of the cluster you are using.|
|store-url|Please specify the URL of Screwdriver Store of the cluster you are using.|
|token|Please specify the [API token](api#authentication-and-authorization)|
|launcher-image|Please specify the launcher image. (default: `screwdrivercd/launcher`)|
|launcher-version|Please specify the launcher version. (default: `stable`)|


# build command
This command run the build in your local environment.


## Usage
Run build with specific the job. Even if a job is succeeded, any other jobs are not triggered.
```bash
$ sd-local build <job name>
```


It starts the job based on `screwdriver.yaml` in the current directory, and the build artifacts are created under the "./sd-artifacts" directory.


## Options
The following options can be used in build command.


|option|describe|
|---|---|
|--artifacts-dir|Specify the destination of build artifacts. (default: `./sd-artifacts`)|
|-e, --env|Set the environment variables in the build environment in `<key>=<value>` formats. (Multiple specifications allowed)|
|--env-file|Set the environment variables in the build environment in file format. (Refer to [env-file format](#env-file-format))|
|-m, --memory|Specify the limit value of the memory resource of the build environment. (Can be specified in b, k, m, g memory unit)|
|--meta|Specify [metadata](metadata) used in build environment. (JSON format)|
|--meta-file|Specify [metadata](metadata) used in build environment in the file. (JSON format)|
|--src-url|Specify the remote SCM URL to build. (`https` or `ssh` format)|


Note:
- sd-local uses the value specified by `--env` option, if a same environment variable is specified in both `--env` and `--env-file` options.
- You can't use both `--meta` and `--meta-file` options.


### env-file format
`--env-file` option is using the file format as same as the [.env](https://docs.docker.com/compose/env-file/) format of docker.


- Each line in an `env` file to be in `VAR=VAL` format.
- Lines beginning with `#` are processed as comments and ignored.
- Blank lines are ignored.
- There is no special handling of quotation marks. This means that they are part of the VAL.


## List of environment variables
You can use the following environment variables in sd-local build. The default values whose value is showed as  '-' are same as Screwdriver. Please refer to [environment variables](environment-variables) in the details.




|environment variable name|default value|
|---|---|
|SCREWDRIVER|false|
|CI|false|
|CONTINUOUS_INTEGRATION|false|
|SD_API_URL|api-url in your config|
|SD_STORE_URL|store-url in your config|
|SD_TOKEN|generated JWT based on the token in your config|
|SD_SOURCE_DIR|/sd/workspace/src/screwdriver.cd/sd-local/local-build|
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
