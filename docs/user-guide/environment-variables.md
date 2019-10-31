---
layout: main
title: Environment Variables
category: User Guide
menu: menu
toc:
    - title: Environment Variables
      url: "#environment-variables"
      active: true
    - title: Build Specific
      url: "#build-specific"
    - title: <span class="menu-indent">General</span>
      url: "#general"
    - title: <span class="menu-indent">User configurable</span>
      url: "#user-configurable"
    - title: Plugins
      url: "#plugins"
    - title: Directories
      url: "#directories"
    - title: Environment Variables
      url: "#environment-variables-1"
    - title: Source Code
      url: "#source-code"
    - title: URLs
      url: "#urls"
    - title: Continuous Integration
      url: "#continuous-integration"
---
# Environment Variables

Screwdriver exports a set of environment variables that you can rely on during build runtime.

_Note: Environment variables set in one job cannot be accessed in another job. To pass variables between jobs, use [metadata](./metadata)._

## Build Specific

### General

| Name | Description |
|------|-------|
| SD_BUILD_ID | The ID of the [build](../about/appendix/domain#build) |
| SD_EVENT_ID | The ID of the [event](../about/appendix/domain#event) |
| SD_JOB_ID | The ID of the [job](../about/appendix/domain#job) |
| SD_JOB_NAME | Job name (e.g.: `main`) |
| SD_PARENT_BUILD_ID | Bracketed list of build(s) that trigger(s) this build. (e.g.: `[12345 23456]`) |
| SD_PARENT_EVENT_ID | ID of the parent event if this was a restart |
| SD_PR_PARENT_JOB_ID | ID of the real job of PR. For example, in `PR-1:main` build, this ENV references the ID of `main` job |
| SD_PIPELINE_ID | The ID of the [pipeline](../about/appendix/domain#pipeline) |
| SD_PIPELINE_NAME | The name of the pipeline (e.g.: `d2lam/myPipeline`) |
| SD_PULL_REQUEST | Pull Request number (e.g.: `1`; blank if non-PR) |
| SD_TEMPLATE_FULLNAME | Full template name the job is using (e.g.: `d2lam/myTemplate`; blank if not using template) |
| SD_TEMPLATE_NAME | Name of the template the job is using (e.g.: `myTemplate`; blank if not using template) |
| SD_TEMPLATE_NAMESPACE | Namespace of the template the job is using (e.g.: `d2lam`; blank if not using template) |
| SD_TEMPLATE_VERSION | Version of the template the job is using (blank if not using template) |
| SD_TOKEN | JWT token for the build |

### User configurable

| Name | Default Value | Description |
|------|---------------|-------------|
| SD_ZIP_ARTIFACTS | false | **Options:** (`true`/`false`) <br><br>Compresses and uploads artifacts in a single ZIP file.<br><br>**Use case:** If you're using Amazon S3 for your store, the zip file can be unzipped on the store end using AWS Lambda. Reduces upload time when your build has a lot of artifacts but there's an upper limit to the size and number of files in the zip file you upload, since the compute resources on Lambda are limited per build. If the upload fails, it's likely that you have more artifacts or that the zip is larger than Lambda can handle.<br><br>**Note:** Consult with your cluster admin to see if this option is available. |
| USER_SHELL_BIN | sh | The user shell bin to run the build in. Can also be the full path such as `/bin/bash`. Example repo: https://github.com/screwdriver-cd-test/user-shell-example |
| GIT_SHALLOW_CLONE | true | **Options:** (`true`/`false`) <br><br>Shallow clones source repository. |
| GIT_SHALLOW_CLONE_DEPTH | 50 | Shallow clone with a history truncated to the specified number of commits |
| GIT_SHALLOW_CLONE_SINCE |  | Shallow clone with a history truncated starting from the specified datetime (inclusive). If set, this has priority over `GIT_SHALLOW_CLONE_DEPTH`.<br><br>This uses `--shallow-since` which accepts both absolute dates (e.g.: `2019-04-01`) and relative dates (e.g.: `4 weeks ago`). |
| GIT_SHALLOW_CLONE_SINGLE_BRANCH |  | If set to `true`, it will use `--single-branch` option for shallow clone. Otherwise, `--no-single-branch` option is used. |
| SD_COVERAGE_PLUGIN_ENABLED  | `true` |If set to string `false`, step `sd-teardown-screwdriver-coverage-bookend` will be skipped. |

## Plugins
These environment variables may or may not be available depending on what plugins are installed.

#### Coverage (Sonar)

| Name | Description |
|------|-------|
| SD_SONAR_AUTH_URL | Screwdriver API authentication URL that will return a Sonar access token |
| SD_SONAR_HOST | Sonar host URL |

## Directories

| Name | Description |
|------|-------|
| SD_ARTIFACTS_DIR | Location of built/generated files. <br><br>**Note**: The `sd-teardown-screwdriver-artifact-bookend` step uploads artifacts from this directory into the Store unless the build is `ABORTED`. |
| SD_META_PATH | Location of the [metadata](./metadata) file |
| SD_ROOT_DIR | Location of workspace (e.g.: `/sd/workspace`) |
| SD_SOURCE_DIR | Location of checked-out code (e.g.: `sd/workspace/src/github.com/d2lam/myPipeline`) |
| SD_SOURCE_PATH | Location of source path which triggered current build. See [Source Paths](./configuration/sourcePaths). |
| SD_CONFIG_DIR | Location of parent pipeline's repository (only set for [child pipelines](./configuration/externalConfig)) (e.g.: `sd/workspace/config`) |

## Environment Variables

| Name | Description |
|------|-------|
| &lt;environment_variable&gt; | Environment variable specified under the "environment" section in your [screwdriver.yaml](configuration/) |

Please be aware if you are using dot notations in the environment variables, like:
```
environments:
   REGION.INSTANCE: 'xyz'
```
Then `process.env.REGION.INSTANCE` won't work, and you must use `process.env['REGION.INSTANCE']` dot notation to access as well.

## Source Code

| Name | Description |
|------|-------|
| SCM_URL | SCM URL that was checked out (e.g.: `https://github.com/d2lam/myPipeline`) |
| GIT_URL | SCM URL that was checked out with .git appended (e.g.: `https://github.com/d2lam/myPipeline.git`) |
| CONFIG_URL | SCM URL of the parent pipeline repository (only set for [child pipelines](./configuration/externalConfig)) |
| GIT_BRANCH | Reference for PR or the branch (e.g.: `origin/refs/${PRREF}` or `origin/${BRANCH}`) |
| SD_BUILD_SHA | The Git commit SHA (e.g.: `b5a94cdabf23b21303a0e6d5be5e96bd6300847a`) |

## URLs

| Name | Description |
|------|-------|
| SD_API_URL | Link to the Screwdriver API URL (e.g.: `https://api.screwdriver.cd/v4/`) |
| SD_BUILD_URL | Link to the Screwdriver build API URL (e.g.: `https://api.screwdriver.cd/v4/builds/1`) |
| SD_STORE_URL | Link to the Screwdriver Store URL (e.g.: `https://store.screwdriver.cd/v1/`) |
| SD_UI_URL | Link to the Screwdriver UI URL (e.g.: `https://cd.screwdriver.cd/`) |


## Continuous Integration

| Name | Description |
|------|-------|
| CI | `true` |
| CONTINUOUS_INTEGRATION | `true` |
| SCREWDRIVER | `true` |
