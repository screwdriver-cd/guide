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
    - title: Detached Jobs and Pipelines
      url: "#detached-jobs-and-pipelines"
---
# Workflow
Workflow is the way that individual jobs are wired together to form a pipeline. This is done by using a `requires` keyword in your job definition with the list of jobs or events that should cause that job to run. Screwdriver defines two events for every pipeline that occur due to SCM events: `~pr`, and `~commit`. These occur when a pull-request is opened, reopened, or modified, and when a commit occurs against the pipeline's branch (respectively).

## Defining Workflow Order
To denote workflow order, use the `requires` keyword under a job with the job names as an array. Job names may be prefixed with a tilde to indicate [advanced logic](#advanced-logic).

#### Example
In the following example, the job, `main`, will start after any SCM pull-request, _or_ commit event. The job, `second`, will run after `main` is successful.

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

To specify a job to run when a pull request is opened, use `requires: [~pr]`. For jobs that should start after code is pushed, use `requires: [~commit]`.

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
        requires: [~sd@123:A, B, ~sd@123:C, D, ~sd@123E, F]
```

is equivalent to the Boolean expression `A OR C OR E OR (B AND D AND F)`. Such a complicated `requires` line in an actual workflow should be regarded as a code smell.

## Branch filtering
To trigger jobs in your pipeline after a specific branch is committed, you can use branch filtering jobs. The format is `~commit:branchName` or `~pr:baranchName`. Also you can use regex filter after `~commit:` or `~pr:` (e.g. `~commit:/^feature-.*$/`).  

### Example
In the following example, when staging branch is committed, `staging-commit` and `all-commit` are triggered. Also, when this pipeline's branch is committed, `main` and `all-commit` are triggered. When a pull request is opened in staging branch, `staging-pr` is triggered.

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
        requires: [~commit:/^.*$/]
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

#### Example
In the following example, `job2` is blocked by `job1` or `sd@456:publish`. If `job1` or `sd@456:publish` is running and `job2` is triggered, `job2` will be put back into the queue.

```
shared:
    image: node:6
jobs:
    job1:
        requires: [~commit, ~pr]
        steps:
            - echo: echo hello
    job2:
        requires: [~commit, ~pr]
        blockedBy: [~job1, ~sd@456:publish]
        steps:
            - echo: echo bye
```

## Detached Jobs and Pipelines
It is possible to define workflows that do not have any external trigger. These workflows are "detached" from the normal flow of the pipeline. Some example use cases of this would be to define a rollback flow for your pipeline that could be manually triggered. Invoking a detached pipeline involves the same steps as doing a [rollback](../FAQ#how-do-i-rollback).

### Example
In the following example `detached-main` job is detached.

```
shared:
    image: node:8

jobs:
    detached-main:
        steps:
            - echo: echo detached hi
    main:
        requires: [~pr, ~commit]
        steps:
            - echo: echo hi
```

If you have only a single job, then to make it detached you must provide an empty `requires`.

```
shared:
    image: node:8

jobs:
    detached-main:
        requires: []
        steps:
            - echo: echo detached hi
```
