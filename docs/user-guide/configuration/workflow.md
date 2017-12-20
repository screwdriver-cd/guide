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
    - title: Parallel and Join
      url: "#parallel-and-join"
    - title: Remote Triggers
      url: "#remote-triggers"
    - title: Detached Jobs and Pipelines
      url: "#detached-jobs-and-pipelines"
---
# Workflow
Workflow is the way that individual jobs are wired together to form a pipeline. This is done by using a `requires` keyword in your job definition with the list of jobs or events that should cause that job to run. Screwdriver defines two events for every pipeline that occur due to SCM events: `~pr`, and `~commit`. These occur when a pull-request is opened, reopened, or modified, and when a commit occurs against the pipeline's branch (respectively).

## Defining Workflow Order
To denote workflow order, use the `requires` keyword under a job with the job names as an array.

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
You can specify a job to to start when all of its `requires` jobs are successful [_AND_]. This is also often called a join or fan-in.

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
You can specify a job to to start when any of its `requires` jobs are successful [_OR_] by adding a tilde (~) prefix to the jobs it requires.

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
        requires: [~first, ~second]
```

The _AND_ and _OR_ logic can be combined in a complex pipeline to allow cases where you want to start a job when `first` _AND_ `second` jobs are successful, _OR_ a `third` job is successful.

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
To trigger a job in your pipeline after a job in another pipeline is finished, you can use remote requires. The format is `~sd@pipelineID:jobName`.

#### Example
In the following example, this pipeline will start the `main` job after any pull-request, commit, _or_ successful completion of the `publish` job in pipeline 123.

```
jobs:
    main:
        image: node:6
        requires: [~pr, ~commit, ~sd@123:publish]
        steps:
            - echo: echo hi
```

## Detached Jobs and Pipelines
It is possible to define workflows that do not have any external trigger. These workflows are "detached" from the normal flow of the pipeline. Some example use cases of this would be to define a rollback flow for your pipeline that could be manually triggered. While it is currently possible to define these flows, there is currently no way to trigger these detached workflows outside of direct interactions with the Screwdriver API.
