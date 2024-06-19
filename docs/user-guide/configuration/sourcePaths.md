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
Source paths can be used to specify source code paths that will trigger a job upon modification. This is done by using a `sourcePaths` keyword in your job definition as a string or array of strings. This can be useful for running workflows based on subdirectories in a [monorepo](https://www.atlassian.com/git/tutorials/monorepos).

### Types of source paths
You can either specify subdirectories and/or specific files as source paths. To denote a subdirectory, leave a trailing slash (`/`) at the end. The path is relative to the root of the repository.

#### Example

Given a repository with the file structure depicted below:

```
┌── README.md
├── screwdriver.yaml
├── test/
│   └── ...
├── src/
│   ├── app/
│   │   ├── main.js
│   │   ├── ...
│   │   └── package.json
│   └── other/
│       └── ...
│
...
```

And the `screwdriver.yaml`:

```yaml
jobs:
    main:
        image: node:lts
        requires: [~pr, ~commit]
        sourcePaths: ["src/app/", "screwdriver.yaml"]
        steps:
            - echo: echo hi
```

In this example, the job `main` will be triggered if there are any changes to files under `src/app/` or the `screwdriver.yaml` file (like on `src/app/main.js`, `src/app/package.json`, etc.). The `main` job will **not**, however, be triggered on changes to `README.md`, `test/`, or `src/other/`.

### Matched source path

Screwdriver will expose the source path that triggered this build in an environment variable `SD_SOURCE_PATH`. This value will be the first path in `sourcePaths` which matches any of the modified files and can be used to write scripts which depends on the source path that triggered current build.

### Exclude source path

If you don't want to trigger jobs when specific subdirectories and/or specific files change that are in certain source paths, you can exclude source paths. To ignore changes in specific subdirectories and/or specific files, prefix the source path with an exclamation (`!`).

#### Example
Given a same repository like above, and the `screwdriver.yaml`:
```yaml
jobs:
    main:
        image: node:lts
        requires: [~pr, ~commit]
        sourcePaths: ["src/app/", "screwdriver.yaml", "!src/app/package.json"]
        steps:
            - echo: echo hi
```
In this example, the job `main` will be triggered if there are any changes to files under `src/app/` or the `screwdriver.yaml` file except for changes in the `src/app/package.json` file, like on `src/app/main.js`. The `main` job will **not**, however, be triggered on changes to `README.md`, `test/`, `src/app/package.json`, or `src/other/`.

### Caveats
- This feature is only available for the [Github SCM](https://github.com/screwdriver-cd/scm-github) right now.
- `sourcePaths` will be ignored if you manually start a pipeline or restart a job.
- `screwdriver.yaml` must still be located at root.
- `sourcePaths` does not support wildcards or globs.
