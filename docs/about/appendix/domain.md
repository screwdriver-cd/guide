---
layout: main
title: Domain Model
category: About
menu: menu
toc:
    - title: Domain Model
      url: "#domain-model"
      active: true
    - title: Source Code
      url: "#source-code"
    - title: Step
      url: "#step"
    - title: Container
      url: "#container"
    - title: Job
      url: "#job"
    - title: Build
      url: "#build"
    - title: Event
      url: "#event"
    - title: Metadata
      url: "#metadata"
    - title: Workflow
      url: "#workflow"
    - title: Pipeline
      url: "#pipeline"
---
## Domain Model

_Note: `Matrix` has not been implemented yet._

![Definition](../assets/definition-model.png)
![Runtime](../assets/runtime-model.png)

### Source Code

Source Code is a specified SCM repository and branch that contains a `screwdriver.yaml` and the code required to build, test, and publish your application.

### Step

A step is a named action that needs to be performed, usually a single shell command. In essence, Screwdriver runs `/bin/sh` in your terminal then executes all the steps; in rare cases, different terminal/shell setups may have unexpected behavior. If the command finishes with a non-zero exit code, the step is considered a failure. Environment variables will be passed between steps, within the same job.

### Container

A container runs [steps] in an isolated environment. This is done in order to test the compatibility of code running in different environments with different versions, without affecting other [builds] that may be running at the same time. This is implemented using Docker containers.

### Job

A job consists of executing multiple sequential [steps] inside a specified [container]. If any step in the series fails, then the entire job is considered failed and subsequent steps will be skipped (unless configured otherwise).

Jobs work by checking out the [source code] to a specified commit, setting the desired environment variables, and executing the specified [steps].

During the job, the executing [steps] share three pieces of context:

 - Filesystem
 - [Container]
 - [Metadata]

Jobs can be started automatically by changes made in the [source code] or triggered through the [workflow]. Jobs can also be started manually through the UI.

#### Pull Requests

Pull requests are run separately from existing pipeline jobs. They will only execute steps from the `main` job in the Screwdriver configuration.

### Build

A build is an instance of a running [job]. All builds are assigned a unique build number. Each build is associated with an [event]. With a basic job configuration, only one build of a job will be running at any given time. If a [job matrix] is configured, then there can be multiple builds running in parallel.

A build can be in one of five different states:

 - `QUEUED` - Build is waiting for available resources
 - `RUNNING` - Build is actively running on an executor
 - `SUCCESS` - All steps completed successfully
 - `FAILURE` - One of the steps failed
 - `ABORTED` - User canceled the running build

### Event

An event represents a commit or a manual restart of a [pipeline]. There are 2 types of events:

- `pipeline`: - Events created when a user manually restarts a pipeline or merges a pull request. This type of event triggers the same sequence of jobs as the pipeline's workflow. For example: `['main', 'publish', 'deploy']`
- `pr`:  - Events created by opening or updating a pull request. This type of event only triggers the first job(s).

### Metadata

Metadata is a structured key/value storage of relevant information about a [build]. Metadata will be shared with subsequent builds in the same [workflow]. It can be updated or retrieved throughout the build by using the built-in [meta CLI](https://github.com/screwdriver-cd/meta-cli) in the [steps].

Example:
```bash
$ meta set example.coverage 99.95
$ meta get example.coverage
99.95
$ meta get example
{"coverage":99.95}
```

See the [metadata page](../../user-guide/metadata) for more information.

### Workflow

[Workflow](../../user-guide/configuration/workflow) is the order that [jobs] will execute in after a successful [build] of the first job. Jobs can be executed in parallel, series, or a combination of the two to allow for all possibilities. Order is determined by the `requires` keyword.

All jobs executed in a given workflow share:

 - Source code checked out from the same git commit
 - Access to [metadata] from the first build that triggered or was selected for this job's build

In the following example of an abbreviated workflow section, this is the flow:
```yaml
jobs:
  main:
    requires: [~pr]
  publish:
    requires: [main]
  deploy-west:
    requires: [publish]
  deploy-east:
    requires: [publish]
  validate-west:
    requires: [deploy-west]
  validate-east:
    requires: [deploy-east]
```

After the merge of a pull-request to base branch:

 - `main` will run and trigger `publish`
 - `publish` will trigger `deploy-west` and `deploy-east` in parallel
 - `deploy-west` will trigger `validate-west`
 - `deploy-east` will trigger `validate-east`

### Pipeline

A pipeline represents a collection of [jobs] that share the same [source code]. These jobs are executed in the order defined by the [workflow].


[steps]: #step
[job]: #job
[jobs]: #job
[metadata]: #metadata
[builds]: #builds
[build]: #build
[event]: #event
[pipeline]: #pipeline
[container]: #container
[containers]: #container
[workflow]: #workflow
[source code]: #source-code
[job matrix]: #parallelization
