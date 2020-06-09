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

Configure screwdriver and store api timeouts and max retry attempts

| Name | Description |
|------|-------|
| LOGSERVICE_SDAPI_TIMEOUT_SECS | Log service to Screwdriver api - connection timeout in seconds |
| LOGSERVICE_SDAPI_MAXRETRIES | Log service to Screwdriver api - max retry attempts for before giving up |
| LOGSERVICE_STOREAPI_TIMEOUT_SECS | Log service to Screwdriver Store api - Connection timeout in seconds |
| LOGSERVICE_STOREAPI_MAXRETRIES | Log service to Screwdriver Store api - max retry attempts before giving up |
