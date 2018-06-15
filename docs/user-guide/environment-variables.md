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
    - title: Plugins
      url: "#plugins"
    - title: Directories
      url: "#directories"
    - title: Environment Variables
      url: "#environment-variables_1"
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

| Name | Value |
|------|-------|
| SD_BUILD_ID | Build number (e.g.: 1, 2, etc) |
| SD_EVENT_ID | The ID of the event |
| SD_JOB_ID | The ID of the job |
| SD_JOB_NAME | Job name (e.g.: main) |
| SD_PIPELINE_ID | The ID of the pipeline |
| SD_PIPELINE_NAME | The name of the pipeline (e.g.: d2lam/myPipeline) |
| SD_PULL_REQUEST | Pull Request number (e.g.: 1; blank if non-PR) |
| SD_TEMPLATE_FULLNAME | Full template name the job is using (e.g.: d2lam/myTemplate; blank if not using template) |
| SD_TEMPLATE_NAME | Name of the template the job is using (e.g.: myTemplate; blank if not using template) |
| SD_TEMPLATE_NAMESPACE | Namespace of the template the job is using (e.g.: d2lam; blank if not using template) |
| SD_TEMPLATE_VERSION | Version of the template the job is using (blank if not using template)|
| SD_TOKEN | JWT token for the build |

## Plugins
These environment variables may or may not be available depending on what plugins are installed.

#### Coverage (Sonar)

| Name | Value |
|------|-------|
| SD_SONAR_AUTH_URL | Screwdriver API authentication URL that will return a Sonar access token |
| SD_SONAR_HOST | Sonar host URL |

## Directories

| Name | Value |
|------|-------|
| SD_ARTIFACTS_DIR | Location of built/generated files |
| SD_META_PATH | Location of the [metadata](./metadata) file |
| SD_ROOT_DIR | Location of workspace (e.g.: `/sd/workspace`) |
| SD_SOURCE_DIR | Location of checked-out code (e.g.: `sd/workspace/src/github.com/d2lam/myPipeline`) |
| SD_SOURCE_PATH | Location of source path which triggered current build. See [Source Paths](./configuration/sourcePaths). |

## Environment Variables

| Name | Value |
|------|-------|
| &lt;environment_variable&gt; | Environment variable specified under the "environment" section in your [screwdriver.yaml](configuration/) |

## Source Code

| Name | Value |
|------|-------|
| SCM_URL | SCM URL that was checked out (e.g.: https://github.com/d2lam/myPipeline) |
| GIT_URL | SCM URL that was checked out with .git appended (e.g.: https://github.com/d2lam/myPipeline.git) |
| GIT_BRANCH | Reference for PR or the branch (e.g.: `origin/refs/${PRREF}` or `origin/${BRANCH}`) |
| SD_BUILD_SHA | The Git commit SHA (e.g.: b5a94cdabf23b21303a0e6d5be5e96bd6300847a) |

## URLs

| Name | Value |
|------|-------|
| SD_API_URL | Link to the Screwdriver API URL |
| SD_BUILD_URL | Link to the Screwdriver build URL |
| SD_STORE_URL | Link to the Screwdriver Store URL |


## Continuous Integration

| Name | Value |
|------|-------|
| CI | `true` |
| CONTINUOUS_INTEGRATION | `true` |
| SCREWDRIVER | `true` |
