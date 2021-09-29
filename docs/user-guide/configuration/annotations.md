---
layout: main
title: Annotations
category: User Guide
menu: menu
toc:
    - title: Annotations
      url: "#annotations"
    - title: Job-Level Annotations
      url: "#job-level-annotations"
    - title: Pipeline-Level Annotations
      url: "#pipeline-level-annotations"
---
# Annotations
Annotations is a freeform key/value store, often used to configure pipeline or build execution settings. Annotations may be used as a sandbox for [YAML anchors and aliases](http://blog.daemonl.com/2016/02/yaml.html).

#### Example
```yaml
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
            screwdriver.cd/cpu: HIGH                      # Use HIGH for CPU
            screwdriver.cd/buildPeriodically: H H(4-7) * * *   # Run the job every day sometime between 4:00 am and 7:59 am UTC.
```

## Job-Level Annotations
Job-level annotations are used to modify the properties of the build environment. Job-level annotations can be specified under a specific job, or under `shared`.

The following annotations are supported by plugins maintained by Screwdriver.cd. Ask your cluster admin which annotations are supported in your Screwdriver cluster.

> Please note that `beta.screwdriver.cd` is deprecated in favor of `screwdriver.cd`. However, annotations that are prefixed with `beta.screwdriver.cd` will continue to work for now.

| Annotation | Values | Description |
|------------|--------|-------------|
| screwdriver.cd/buildCluster | Build cluster name to run your build in | You can refer to `<API URL>/v4/buildclusters` for a list of available build clusters. By default, builds will be assigned to the default cluster with field `managedByScrewdriver: true`. You can choose from any default cluster and external cluster that your repo is allowed to use (indicated by the field `scmOrganizations`).|
| screwdriver.cd/buildPeriodically | A CRON expression with an 'H' in the minutes field, e.g. `H 0 * * *` <br><br>**Note:** The first interval is always set to "H" (maximum frequency as once per hour) to avoid large spikes for shared resources. You can test out your cron expression at <https://crontab.guru/> | This will trigger your job periodically according to the cron expression. For any field in the expression, if you specify `H` (or something like `H/5` or `H(3-7)`), the system will replace it with a value over the specified range based on a hash of the job id. For example, `H(3-5)` will resolve to either 3, 4, or 5. Timezone is in UTC. |
| screwdriver.cd/collapseBuilds | `true` / `false` | Set it to `true` to collapse all `BLOCKED` builds of the job to the latest build.<br>If you want to apply it to the whole pipeline, set it under `shared`. Default behavior depends on cluster configuration, please check with your cluster admin for that.  |
| screwdriver.cd/cpu | `MICRO` / `LOW` / `HIGH` / `TURBO` | When using a `k8s` executor, this will allow the user to choose between 0.5 (`MICRO`), 2 (`LOW`), 6 (`HIGH`) and 12 (`TURBO`) CPU resources. Default is `LOW`.<br>   When using a `k8s-vm` executor, this will allow the user to choose between 1 (`MICRO`), 2 (`LOW`), 6 (`HIGH`), and 12 (`TURBO`) CPU resources. Default is `LOW`. |
| screwdriver.cd/disk | Ask your cluster admin  | When using a `k8s-vm` executor, this will allow the user to choose between 20 GB (`LOW`), 50 GB (`HIGH`)  and 100GB (`TURBO`) disk space. Default is `LOW`. |
| screwdriver.cd/diskSpeed | Ask your cluster admin | When using a `k8s-vm` executor, this will allow the user to choose between machines with different disk speed. The default is no preference for the disk speed. |
| screwdriver.cd/executor | Ask your cluster admin | This will determine what compute system is used to run the build. For example, set the build to run in a VM, a kubernetes pod, a docker container, or a Jenkins agent. |
| screwdriver.cd/ram | `MICRO` / `LOW` / `HIGH` / `TURBO` | When using a `k8s` executor, this will allow the user to choose between 1 GB (`MICRO`), 2 GB (`LOW`), 12 GB (`HIGH`) and 16 GB (`TURBO`) RAM. Default is `LOW`.<br> When using a `k8s-vm` executor, this will allow the user to choose between 1 GB (`MICRO`), 2 GB (`LOW`), 12 GB (`HIGH`) and 16 GB (`TURBO`) RAM. Default is `LOW`. |
| screwdriver.cd/repoManifest | Git repository checkout URL, e.g. `https://github.com/org/repo.git/manifestFilePath.xml#branch` <br><br>1. Checkout URL: `https://github.com/org/repo.git` (required) <br>2. Path to manifest file: `manifestFilePath.xml` (optional, defaults to `default.xml`) <br> 3. Branch name: `#branch` (optional, defaults to `#master`) | [Repo](https://gerrit.googlesource.com/git-repo) is a tool built on top of Git for managing repositories. This value is the checkout URL of a Git repository that contains a repo manifest `xml` file. If this value is specified, Screwdriver will checkout your source code in accordance with the configuration of the `xml` file. |
| screwdriver.cd/timeout | Number of minutes | This will allow the user to choose the number of minutes a build should timeout after. Default is `90` minutes. |
| screwdriver.cd/dockerEnabled | `true` / `false` | When using a `k8s` executor, set it to `true`, and a Docker-in-Docker container will come up alongside your build container, enabling Docker builds and running Docker images. In addition to this flag in your yaml, your cluster manager must enable the docker in docker feature. (See cluster-management doc). |
| screwdriver.cd/dockerCpu | `MICRO` / `LOW` / `HIGH` / `TURBO` | When using a `k8s` executor and Docker is enabled, this will set the compute resources for the Docker container, see the `screwdriver.cd/cpu` annotation above for defaults. |
| screwdriver.cd/dockerRam | `MICRO` / `LOW` / `HIGH` / `TURBO` | When using a `k8s` executor and Docker is enabled, this will set the memory resources for the Docker container, see the `screwdriver.cd/ram` annotation above for defaults. |
| screwdriver.cd/coverageScope | `pipeline` / `job` | When using the coverage plugin, this will set the scope for project creation. Default behavior depends on cluster configuration (e.g. `COVERAGE_SONAR_ENTERPRISE`), please check with your cluster admin for that. |
| screwdriver.cd/displayName | Job name to display in the pipeline graph | You can use any name you like for a job to appear in the pipeline graph, without being limited by the unique constraints of Yaml. |
| screwdriver.cd/mergeSharedSteps | `true` / `false` | When using a template, set it to `true`, and allow the user to merge steps defined in shared and job. Default is `false`. |
| screwdriver.cd/manualStartEnabled | `true` / `false` | You will not be able to start from a job in the UI when this is set to `false`. Default is `true`. |
| screwdriver.cd/terminationGracePeriodSeconds | Number of seconds | This will allow the user to choose the number of seconds a build should wait before aborting to execute the teardown steps. Default is `'60'` seconds and Max is `'120'` seconds. In most cases more than default will not be required. |

## Pipeline-Level Annotations

Pipeline-level annotations are used to modify the properties of the entire pipeline. Pipeline-level annotations are under the same level as `shared` and `jobs`. Pull requests cannot change these annotations, they need to be in the SCM branch of the pipeline.

 | Annotation | Values | Description |
 |------------|--------|-------------|
 | screwdriver.cd/restrictPR | `none` / `all` / `fork` / `branch` | Prevent PR jobs from running. `none` means no restriction. `all` means all PR jobs will not run. `fork` means PRs from forked repos will not run. `branch` means PRs from branch will not run.|
 | screwdriver.cd/chainPR    | `false` / `true` | Default value is `false`. When value is `false` a Pull Request will run only those jobs which has `~pr` in `requires`. When `true`, a Pull Request will run jobs which have `~pr` in requires and also trigger their downstream jobs. Example repo: <https://github.com/screwdriver-cd-test/chain-pr-example> |
 | screwdriver.cd/pipelineDescription | A pipeline description string | This will display a pipeline description on the pipeline page |
