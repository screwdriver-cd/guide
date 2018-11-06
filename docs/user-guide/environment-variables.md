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
| USER_SHELL_BIN | sh | The user shell bin to run the build in. Can also be the full path such as `/bin/bash`.
| GIT_SHALLOW_CLONE | true | **Options:** (`true`/`false`) <br><br>Shallow clones source repository with a depth of 50 commits.

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
| SD_ARTIFACTS_DIR | Location of built/generated files |
| SD_META_PATH | Location of the [metadata](./metadata) file |
| SD_ROOT_DIR | Location of workspace (e.g.: `/sd/workspace`) |
| SD_SOURCE_DIR | Location of checked-out code (e.g.: `sd/workspace/src/github.com/d2lam/myPipeline`) |
| SD_SOURCE_PATH | Location of source path which triggered current build. See [Source Paths](./configuration/sourcePaths). |
| SD_CONFIG_DIR | Location of parent pipeline's repository (only set for [child pipelines](./configuration/external-config)) (e.g.: `sd/workspace/config`) |

## Environment Variables

| Name | Description |
|------|-------|
| &lt;environment_variable&gt; | Environment variable specified under the "environment" section in your [screwdriver.yaml](configuration/) |

## Source Code

| Name | Description |
|------|-------|
| SCM_URL | SCM URL that was checked out (e.g.: `https://github.com/d2lam/myPipeline`) |
| GIT_URL | SCM URL that was checked out with .git appended (e.g.: `https://github.com/d2lam/myPipeline.git`) |
| CONFIG_URL | SCM URL of the parent pipeline repository (only set for [child pipelines](./configuration/external-config)) |
| GIT_BRANCH | Reference for PR or the branch (e.g.: `origin/refs/${PRREF}` or `origin/${BRANCH}`) |
| SD_BUILD_SHA | The Git commit SHA (e.g.: `b5a94cdabf23b21303a0e6d5be5e96bd6300847a`) |

## URLs

| Name | Description |
|------|-------|
| SD_API_URL | Link to the Screwdriver API URL |
| SD_BUILD_URL | Link to the Screwdriver build URL |
| SD_STORE_URL | Link to the Screwdriver Store URL |


## Continuous Integration

| Name | Description |
|------|-------|
| CI | `true` |
| CONTINUOUS_INTEGRATION | `true` |
| SCREWDRIVER | `true` |
