---
layout: main
title: Quickstart
category: User Guide
menu: menu
toc:
    - title: Getting Started with Screwdriver
      url: "#getting-started-with-screwdriver"
      active: true
    - title: Requirements
      url: "#requirements"
    - title: Set Up
      url: "#set-up"
    - title: Developing the App
      url: "#developing-the-app"
    - title: Building with Screwdriver
      url: "#building-with-screwdriver"
    - title: Congratulations! You just built and ran your first app using Screwdriver!
      url: "#congratulations-you-just-built-and-ran-your-first-app-using-screwdriver"
---
# Getting Started with Screwdriver

This page will cover how to build and deploy a sample app with Screwdriver in minutes. In this example, we are using the SCM provider Github.

## Requirements
- Github account

## Set Up
First, fork and clone a sample repository into your local development environment and cd into the project directory. We will cover the generic quickstart in this example.

- [generic](https://github.com/screwdriver-cd-test/quickstart-generic)*
- [Golang](https://github.com/screwdriver-cd-test/quickstart-golang)
- [Nodejs](https://github.com/screwdriver-cd-test/quickstart-nodejs)
- [Ruby](https://github.com/screwdriver-cd-test/quickstart-ruby)

```bash
$ git clone git@github.com:<YOUR_USERNAME_HERE>/quickstart-generic.git
$ cd quickstart-generic/
```

*For applications that are better suited to Makefiles and small scripts, we recommend referencing the generic `screwdriver.yaml`.*

## Developing the App

Now that we’ve setup our app, we can start developing. This app demonstrates how to run a `Makefile` and bash script (`my_script.sh`) in your Screwdriver build.

### screwdriver.yaml

The `screwdriver.yaml` is the only config file you need for using Screwdriver. In it, you will define all your steps needed to successfully develop, build and deploy your application. See the User Guide -> Configuration section for more details.

#### Shared
The `shared` section is where you would define any attributes that all your jobs will inherit.

In our example, we state that all our jobs will run in the same Docker container image "buildpack-deps". The `image` is usually defined in the form of "repo_name". Alternatively, you can define the image as "repo_name:tag_label", where "tag_label" is a version. See the [Docker documentation](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-from-docker-hub) for more information.

```yaml
# Shared definition block
shared:
  # Source: https://hub.docker.com/r/library/buildpack-deps/
  image: buildpack-deps
```

### Jobs
The `jobs` section is where all the tasks (or `steps`) that each job will execute is defined.

### Workflow
The `requires` keyword denotes the order that jobs will run. Requires is a single job name or array of job names. Special keywords like `~pr` or `~commit` indicate that the job will run after certain Git events occur:
- `requires: ~pr` job runs when a pull request is opened; reruns when a commit/push event is made to that same pull request
- `requires: ~commit` job runs when a PR is merged or a commit/push is made directly to the defined SD branch; also runs when the Start button is clicked in the UI

### Steps
The `steps` section contains a list of commands to execute.
Each step takes the form "step_name: command_to_run". The "step_name" is a convenient label to reference it by. The
"command_to_run" is the single command that is executed during this step. Step names cannot start with `sd-`, as those steps are reserved for Screwdriver steps. Environment variables will be passed between steps, within the same job. In essence, Screwdriver runs `/bin/sh` in your terminal then executes all the steps; in rare cases, different terminal/shell setups may have unexpected behavior.

In our example, our "main" job executes a simple piece of inline bash code. The first step (`export`) exports an environment variable, `GREETING="Hello, world!"`. The second step (`hello`) echoes the environment variable from the first step. The third step uses [metadata](./metadata), a structured key/value storage of relevant information about a build, to set an arbitrary key in the "main" job and get it in the "second_job".

We also define another job called "second_job". In this job, we intend on running a different set of commands. The "make_target" step calls a Makefile target to perform some set of actions. This is incredibly useful when you need to perform a multi-line command.
The "run_arbitrary_script" executes a script. This is an alternative to a Makefile target where you want to run a series of commands related to this step.

```yaml
# Job definition block
jobs:
  main:
    requires: [~pr, ~commit]
    # Steps definition block.
    steps:
      - export: export GREETING="Hello, world!"
      - hello: echo $GREETING
      - set-metadata: meta set example.coverage 99.95
  second_job:
    requires: [main] # second_job will run after main job is done
    steps:
      - make_target: make greetings
      - get-metadata: meta get example
      - run_arbitrary_script: ./my_script.sh
```

Now that we have a working repository, let's head over to the Screwdriver UI to build and deploy an app. (For more information on Screwdriver YAMLs, see the [configuration](./configuration) page.)

## Building with Screwdriver

In order to use Screwdriver, you will need to login to Screwdriver using Github, set up your pipeline, and start a build.


### Create a New Pipeline

1. Click on the Create icon. (You will be redirected to login if you have not already.)

1. _Click Login with SCM Provider._

1. _You will be asked to give Screwdriver access to your repositories. Choose appropriately and click Authorize._

1. Enter your repository link into the field. SSH or HTTPS link is fine, with `#<YOUR_BRANCH_NAME>` immediately after (ex: `git@github.com:screwdriver-cd/guide.git#test`). If no `BRANCH_NAME` is provided, it will default to the `master` branch.
Click Use this repository to confirm and then click Create Pipeline.

### Start Your First Build
Now that you've created a pipeline, you should be directed to your new pipeline page. Click the Start button to start your build.


## Congratulations! You just built and ran your first app using Screwdriver!
