---
layout: main
title: Annotations
category: User Guide
menu: menu
toc:
    - title: Annotations
      url: "#annotations"
---
# Annotations
Annotations is a freeform key/value store, often used to configure build execution settings. Annotations may be used as a sandbox for [YAML anchors and aliases](http://blog.daemonl.com/2016/02/yaml.html).

#### Example
```
shared:
    template: example/mytemplate@stable
    annotations:
        foo: &bar               # Making an anchor for this configuration
            image: node:8

jobs:
    requires: [~pr, ~commit]
    main: *bar                  # Referencing the annotation anchor to use that config for main job
                                # This will cause the main job to use a node:8 image
```

## Supported Annotations
Some Annotations are used to modify the properties of the build environment. The following annotations are supported by plugins maintained by Screwdriver.cd. Ask your cluster admin which annotations are supported in your Screwdriver cluster.

| Annotation | Values | Description |
|------------|--------|-------------|
| beta.screwdriver.cd/executor | Ask your cluster admin | This will determine what compute system is used to run the build. For example, set the build to run in a VM, a kubernetes pod, a docker container, or a Jenkins agent. |
| beta.screwdriver.cd/cpu | `LOW` / `HIGH` | When using a `k8s-vm` executor, this will allow the user to choose between 2 CPU resources (`LOW`) and 6 CPU resources (`HIGH`). Default is `LOW`. |
| beta.screwdriver.cd/ram | `LOW` / `HIGH` | When using a `k8s-vm` executor, this will allow the user to choose between 2 GB RAM (`LOW`) and 12 GB RAM (`HIGH`). Default is `LOW`. |
