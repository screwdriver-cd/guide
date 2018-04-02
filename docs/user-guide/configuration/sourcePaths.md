---
layout: main
title: Source Paths
category: User Guide
menu: menu
toc:
    - title: Source Paths
      url: "#source-paths"

---
# Source Paths
Source paths can be used to specify source code paths that will trigger a job upon modification. This is done by using a `sourcePaths` keyword in your job definition as a string or array of strings. This can be useful for running workflows based on subdirectories in a [monorepo](https://developer.atlassian.com/blog/2015/10/monorepos-in-git).


_Note: Due to limitations in Git APIs, this feature is only available for [Github SCM](https://github.com/screwdriver-cd/scm-github)._

## Types of source paths
You can either specify subdirectories and/or specific files as source paths. To denote a subdirectory, leave a trailing slash (`/`) at the end.

#### Example
In the following example, the job `main` will start after any SCM pull-request, _or_ commit event on files under `src/app/` or the `screwdriver.yaml` file.

```yaml
jobs:
      main:
            image: node:6
            requires: [~pr, ~commit]
            sourcePaths: ["src/app/", "screwdriver.yaml"]
            steps:
                - echo: echo hi
```
