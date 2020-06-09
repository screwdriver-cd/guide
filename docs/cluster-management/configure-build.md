---
layout: main
title: Configure build
category: Cluster Management
menu: menu
toc: 
    - title: Configure build
      url: "#configure-build"
      active: true
---
## Configure Build 

Configure Screwdriver and Store api timeouts and max retry attempts from a build. These environment variables should be set by executors and should be available inside build.  

| Name | Description |
|------|-------|
| LOGSERVICE_SDAPI_TIMEOUT_SECS | Log service to Screwdriver api - connection timeout in seconds. Default is 20 seconds. |
| LOGSERVICE_SDAPI_MAXRETRIES | Log service to Screwdriver api - max retry attempts for before giving up. Default is 5 retry attempts. |
| LOGSERVICE_STOREAPI_TIMEOUT_SECS | Log service to Screwdriver Store api - Connection timeout in seconds. Default is 20 seconds. |
| LOGSERVICE_STOREAPI_MAXRETRIES | Log service to Screwdriver Store api - max retry attempts before giving up. Default is 5 retry attempts. |
