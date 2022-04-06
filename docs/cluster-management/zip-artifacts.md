---
layout: main
title: Setting Up a Zip Artifacts
category: Cluster Management
menu: menu
toc:
- title: Setting Up Zip Artifacts
  url: "#setting-up-zip-artifacts"
  active: 'true'
- title: Architecture
  url: "#architecture"
- title: Setup
  url: "#setup"
- title: Setup Artifacts Unzip Service
  url: "#setup-artifacts-unzip-service"
- title: Enable feature flags in API
  url: "#enable-feature-flags-in-api"
- title: When unzip failed
  url: "#when-unzip-failed"
---

# Setting Up Zip Artifacts

Screwdriver can upload build artifacts as a zip file using `screwdriver-artifact-bookend`.  
This feature reduces the execution time of `screwdriver-artifact-bookend`.  
It takes time for the uploaded files to appear on UI, because the ZIP file is uploaded and then unzipped.

## Architecture

![zip artifacts architecture](../../cluster-management/assets/zip-artifacts-architecture.png)  

1. Build container(`screwdriver-artifact-bookend` step) uploads a zipped build artifact.
1. Build container sends request to API to unzip the zipped file.
1. API sends the unzip message to Redis.
1. Artifacts Unzip Service pulls the message from Redis and publishes the unzipped files to Store after getting the zip file from Store.
1. Artifacts Unzip Service deletes the zipped file from Store.

## Setup

### Setup Artifacts Unzip Service

Please refer to [Configure the Artifacts Unzip Service](configure-artifacts-unzip-service) page to setup Artifacts Unzip Service.

### Enable feature flags in API

To use Zip Artifacts feature, you need to enable the API settings of below.  

Key | Default | Description
--- | --- | ---
UNZIP_ARTIFACTS_ENABLED | false | use Artifacts Unzip Service or not.

```yaml
# config/local.yaml
unzipArtifacts:
  enabled: true
```

## When unzip failed

If the Artifacts Unzip Service fails to unzip, the files will not be listed in the Artifacts tab of the UI.  
To unzip the files, administrator have to again send request to API.

1. Get an authorization token, by referring [Configure API](../user-guide/api#with-a-rest-client) page.
1. Send request to `/builds/{id}/artifacts/unzip` like below

    ```bash
    # example
    curl -I -X POST -H "Authorization: Bearer {Token}" https://api.screwdriver.cd/v4/builds/{ID}/artifacts/unzip
    ```

1. Go to the page with the unzipped build ID and verify that the file is listed in the Artifacts tab.
