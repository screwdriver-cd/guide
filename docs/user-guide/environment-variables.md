# Environment Variables

Screwdriver exports a set of environment variables that you can rely on during the course of a build.

## Build Specific
| Name | Value |
|------|-------|
| SD_PIPELINE_ID | The ID of your pipeline |
| SD_JOB_NAME | Job name (e.g.: main) |
| SD_BUILD_ID | Build number (e.g.: 1, 2, etc) |
| SD_PULL_REQUEST | Pull Request number (blank if non-PR) |
| SD_TOKEN | JWT token for the build |

## Directories
| Name | Value |
|------|-------|
| SD_SOURCE_DIR | Location of checked-out code |
| SD_ARTIFACTS_DIR | Location of built/generated files |

## Environment Variables
| Name | Value |
|------|-------|
| &lt;environment_variable&gt; | Environment variable specified under the "environment" section in your [screwdriver.yaml](./configuration/index.md) |

## Source Code
| Name | Value |
|------|-------|
| SCM_URL | SCM URL that was checked out |

## URLs
| Name | Value |
|------|-------|
| SD_API_URL | Link to the Screwdriver API URL |

## Continuous Integration
| Name | Value |
|------|-------|
| SCREWDRIVER | `true` |
| CI | `true` |
| CONTINUOUS_INTEGRATION | `true` |
