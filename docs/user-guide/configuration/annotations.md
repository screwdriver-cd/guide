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
            requires: [~pr, ~commit]
            image: node:8

jobs:
    main:
        <<: *bar            # Referencing the annotation anchor to use that config for main job
        annotations:
            beta.screwdriver.cd/cpu: HIGH                      # Use HIGH for CPU
            screwdriver.cd/buildPeriodically: H H(4-7) * * *   # Run the job every day sometime between 4am and 7am UTC.
```

## Supported Annotations
Some Annotations are used to modify the properties of the build environment. The following annotations are supported by plugins maintained by Screwdriver.cd. Ask your cluster admin which annotations are supported in your Screwdriver cluster.

| Annotation | Values | Description |
|------------|--------|-------------|
| beta.screwdriver.cd/executor | Ask your cluster admin | This will determine what compute system is used to run the build. For example, set the build to run in a VM, a kubernetes pod, a docker container, or a Jenkins agent. |
| beta.screwdriver.cd/cpu | `MICRO` / `LOW` / `HIGH` | When using a `k8s` executor, this will allow the user to choose between 0.5 (`MICRO`), 2 (`LOW`) and 6 (`HIGH`) CPU resources. Default is `LOW`.<br>   When using a `k8s-vm` executor, this will allow the user to choose between 1 (`MICRO`), 2 (`LOW`) and 6 (`HIGH`) CPU resources. Default is `LOW`. |
| beta.screwdriver.cd/ram | `MICRO` / `LOW` / `HIGH` | When using a `k8s` executor, this will allow the user to choose between 1 GB (`MICRO`), 2 GB (`LOW`) and 12 GB (`HIGH`) RAM. Default is `LOW`.<br> When using a `k8s-vm` executor, this will allow the user to choose between 1 GB (`MICRO`), 2 GB (`LOW`) and 12 GB (`HIGH`) RAM. Default is `LOW`. |
| beta.screwdriver.cd/timeout | Number of minutes | This will allow the user to choose the number of minutes a build should timeout after. Default is `90` minutes. |
| screwdriver.cd/buildPeriodically | A CRON expression with an 'H' in the minutes field, e.g. `H 0 * * *` <br><br>**Note:** The first interval is always set to "H" (maximum frequency as once per hour) to avoid large spikes for shared resources. You can test out your cron expression at https://crontab.guru/ | This will trigger your job periodically according to the cron expression. |
| screwdriver.cd/repoManifest | Git repository checkout URL, e.g. `https://github.com/org/repo.git/manifestFilePath.xml#branch` <br><br>1. Checkout URL: `https://github.com/org/repo.git` (required) <br>2. Path to manifest file: `manifestFilePath.xml` (optional, defaults to `default.xml`) <br> 3. Branch name: `#branch` (optional, defaults to `#master`) | [Repo](https://gerrit.googlesource.com/git-repo) is a tool built on top of Git for managing repositories. This value is the checkout URL of a Git repository that contains a repo manifest `xml` file. If this value is specified, Screwdriver will checkout your source code in accordance with the configuration of the `xml` file. |
