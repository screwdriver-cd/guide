---
layout: main
title: Workflow
category: User Guide
menu: menu
toc:
    - title: Workflow
      url: "#workflow"
    - title: Defining Workflow Order
      url: "#defining-workflow-order"
    - title: Advanced Workflow Logic
      url: "#advanced-logic"
    - title: Branch filtering
      url: "#branch-filtering"
    - title: Parallel and Join
      url: "#parallel-and-join"
    - title: Remote Triggers
      url: "#remote-triggers"
    - title: Blocked By
      url: "#blocked-by"
    - title: Freeze Windows
      url: "#freeze-windows"
    - title: Detached Jobs and Pipelines
      url: "#detached-jobs-and-pipelines"
---
# Workflow
Workflow is the way that individual jobs are wired together to form a pipeline. This is done by using a `requires` keyword in your job definition with the list of jobs or events that should cause that job to run. Screwdriver defines four events for every pipeline that occur due to SCM events: `~pr`, `~commit`, `~tag` and `~release`.

|keyword|description|
|:--|:--|
| ~pr | Event occurs when a pull-request is opened, reopened, or modified. |
| ~commit | Event occurs when a commit is made against the pipeline's branch. When you start a pipeline manually, it runs all the jobs that have the `~commit` event trigger. |
| ~tag | Event occurs when a tag is created. Now, this trigger is only available for user using GitHub as scm. |
| ~release | Event occurs when released. Now, this trigger is only available for user using GitHub as scm. |

## Defining Workflow Order
To denote workflow order, use the `requires` keyword under a job with the job names as an array. Job names may be prefixed with a tilde to indicate [advanced logic](#advanced-logic).

#### Example
In the following example, the job, `main`, will start after any SCM pull-request, _or_ commit event. The job, `second`, will run after `main` is successful.

>Please note that a job started by a pull-request will not trigger its downstream jobs. For example, if `main` starts and succeeds as a result of a pull-request being opened, `second` will not start afterwards.

```
jobs:
    main:
        image: node:6
        requires: [~pr, ~commit]
        steps:
            - echo: echo hi

    second:
        image: node:6
        requires: [main]
        steps:
            - echo: echo bye
```

To specify a job to run when a pull request is opened or updated, use `requires: [~pr]`. For jobs that should start after code is merged or pushed to the main branch, use `requires: [~commit]`.

## Advanced Logic
### Advanced Logic [_AND_]
You can specify a job to start when all of its `requires` jobs are successful [_AND_]. This is also often called a join or fan-in.

### Example
In the following example, the `last` job will only trigger when `first` _AND_ `second` complete successfully in the same triggering event.

```
shared:
    image: node:6
    steps:
        - greet: echo hello

jobs:
    main:
        requires: [~pr, ~commit]

    first:
        requires: [main]

    second:
        requires: [main]

    last:
        requires: [first, second]
```

### Advanced Logic [_OR_]
You can specify a job to to start when any of its `requires` jobs are successful [_OR_] by adding a tilde (~) prefix to the jobs it requires. It will need to follow the format `~sd@pipelineID:jobName`.

### Example
In the following example, the `last` job will trigger anytime either `first` _OR_ `second` complete successfully.

```
shared:
    image: node:6
    steps:
        - greet: echo hello

jobs:
    main:
        requires: [~pr, ~commit]

    first:
        requires: [main]

    second:
        requires: [main]

    last:
        requires: [~sd@123:first, ~sd@123:second]
```

### Advanced Logic [Combined]
The _AND_ and _OR_ logic can be combined in a complex pipeline to allow cases where you want to start a job when `first` _AND_ `second` jobs are successful, _OR_ a `third` job is successful as in the following example.

```
    last:
        requires: [first, second, ~sd@123:third]
```

If job names are prefixed with tildes in a `requires` line, then the job will start when any of the prefixed jobs is successful _OR_ when all of the unprefixed jobs are successful. For instance, in this contrived example:

```
    main:
        requires: [~sd@123:A, B, ~sd@123:C, D, ~sd@123:E, F]
```

is equivalent to the Boolean expression `A OR C OR E OR (B AND D AND F)`. Such a complicated `requires` line in an actual workflow should be regarded as a code smell.

## Branch filtering
To trigger jobs in your pipeline after a specific branch is committed, you can use branch filtering. The format is `~commit:branchName` or `~pr:branchName`. Branches may also be specified by using a ([JavaScript flavor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)) regular expression (e.g. `~commit:/^feature-/`), although note that regex flags are not supported.

### Example
In the following example, when branch `staging` is committed, `staging-commit` and `all-commit` are triggered. Also, when branch `master` is committed, `main` and `all-commit` are triggered. When a pull request is opened in branch `staging`, `staging-pr` is triggered.

```
shared:
    image: node:8

jobs:
    main:
        requires: [~commit]
        steps:
            - echo: echo commit
    staging-commit:
        requires: [~commit:staging]
        steps:
            - echo: echo staging
    all-commit:
        requires: [~commit:/./]
        # /./ matches any branch name and is used here for illustration only
        # Don't use that regexp in any actual workflow.
        steps:
            - echo: echo all
    staging-pr:
        requires: [~pr:staging]
        steps:
            - echo: echo staging pr
```

## Parallel and Join
You can run jobs in parallel by requiring the same job in two or more jobs. To join multiple parallel jobs at a single job you can use the `requires` syntax to require multiple jobs.

#### Example
In the following example, where `A` and `B` requires `main`. This will cause `A` and `B` to execute in parallel after `main` is successful. Also in this example, job `C` runs only after both `A` _and_ `B` are successful in the same triggering event.

```
shared:
    image: node:6

jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - echo: echo hi
    A:
        requires: [main]
        steps:
            - echo: echo in parallel
    B:
        requires: [main]
        steps:
            - echo: echo in parallel
    C:
        requires: [A, B]
        steps:
            - echo: echo join after A and B
```

## Remote Triggers
To trigger a job in your pipeline after a job in another pipeline is finished, you can use remote requires. The format is `~sd@pipelineID:jobName`. `~pr`, `~commit`, and jobs with `~sd@pipelineID:jobName` format follow _OR_ logic.

#### Example
In the following example, this pipeline will start the `main` job after any pull-request, commit, _or_ successful completion of the `publish` job in pipeline 456.

```
jobs:
    main:
        image: node:6
        requires: [~pr, ~commit, ~sd@456:publish]
        steps:
            - echo: echo hi
```

## Blocked By
To have your job blocked by another job, you can use `blockedBy`. It has the same format as `requires`, except it does not accept values like `~commit` or `~pr`.

Note:
- Since everything is using OR syntax, you need a tilde (`~`) before each of your job names. We do not support AND logic for blockedBy.
- To prevent race conditions, a job is always blocked by itself. That means the same job cannot have 2 instances of builds running at the same time.
- This feature is only available if your cluster admin configured to use `executor-queue`. Please double check with your cluster admin whether it is supported.
- This feature does not apply to PR jobs.

#### Example
In the following example, `job2` is blocked by `job1` or `sd@456:publish`. If `job1` or `sd@456:publish` is running and `job2` is triggered, `job2` will be put back into the queue. Screwdriver will check the queue periodically to see if `job2` is no longer blocked and will run it as soon as that is true. _Note: `blockedBy` only blocks the job that the configuration is under; the following configuration won't block `job1` if `job2` is running._

```
shared:
    image: node:6
jobs:
    job1:
        requires: [~commit, ~pr]
        steps:
            - echo: echo hello
    job2:
        blockedBy: [~job1, ~sd@456:publish]
        steps:
            - echo: echo bye
```

## Freeze Windows
You can freeze your jobs and prevent them from running during specific time windows using `freezeWindows`. The setting takes a cron expression or a list of them as the value.

Before the job is started, it will check if the start time falls under any of the provided cron windows, and freezes the job if so. The job will be unfrozen and run as soon as the current cron window ends.

Note:
- Different from `build_periodically`, `freezeWindows` should not use hashed time therefore *the symbol `H` for hash is disabled.*
- The combinations of day of week and day of month are usually invalid. Therefore only *one out of day of week and day of month can be specified*. The other field should be set to "?".
- If multiple builds are triggered during the freeze window, they will be collapsed into one build which will run at the end of the freeze window with the latest commit inside the freeze window.

#### Example
In the following example, `job1` will be frozen during the month of March, `job2` will be frozen on weekends, and `job3` will be frozen from 10:00 PM to 10:59 AM.

```
shared:
    image: node:6

jobs:
  job1:
    freezeWindows: ['* * ? 3 *']
    requires: [~commit]
    steps:
      - build: echo "build"
  job2:
    freezeWindows: ['* * ? * 0,6,7']
    requires: [job1]
    steps:
      - build: echo "build"
  job3:
    freezeWindows: ['* 0-10,22-23 ? * *']
    requires: [job2]
    steps:
      - build: echo "build"
```

## Detached Jobs and Pipelines
It is possible to define workflows that do not have any external trigger. These workflows are "detached" from the normal flow of the pipeline. Some example use cases of this would be to define a rollback flow for your pipeline that could be manually triggered. Invoking a detached pipeline involves the same steps as doing a [rollback](../FAQ#how-do-i-rollback).

### Example
In the following example `detached` job is detached.

```
shared:
    image: node:8

jobs:
    detached:
        steps:
            - echo: echo im-a-detached-job
```
