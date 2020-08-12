---
layout: main
title: FAQ
category: User Guide
menu: menu
toc:
    - title: Frequently Asked Questions
      url: "#frequently-asked-questions"
      active: true
    - title: How do I skip a step?
      url: "#how-do-i-skip-a-step"
    - title: How do I skip a build?
      url: "#how-do-i-skip-a-build"
    - title: How do I create a pipeline?
      url: "#how-do-i-create-a-pipeline"
    - title: How do I start a pipeline manually?
      url: "#how-do-i-start-a-pipeline-manually"
    - title: How do I update a pipeline repo and branch?
      url: "#how-do-i-update-a-pipeline-repo-and-branch"
    - title: How do I disable/enable a job temporarily?
      url: "#how-do-i-disableenable-a-job-temporarily"
    - title: How do I make sure my code is in sync with my pipeline?
      url: "#how-do-i-make-sure-my-code-is-in-sync-with-my-pipeline"
    - title: How do I delete a pipeline permanently?
      url: "#how-do-i-delete-a-pipeline-permanently"
    - title: How do I see pipeline metrics?
      url: "#how-do-i-see-pipeline-metrics"
    - title: How do I toggle time formats in the build logs?
      url: "#how-do-i-toggle-time-formats-in-the-build-logs"
    - title: How do I fix "Build failed to start" error message?
      url: "#how-do-i-fix-build-failed-to-start-error-message"
    - title: How do I rollback?
      url: "#how-do-i-rollback"
    - title: How do I rerun a build or start a detached build?
      url: "#how-do-i-rerun-a-build-or-start-a-detached-build"
    - title: How do I mark a build as UNSTABLE?
      url: "#how-do-i-mark-a-build-as-unstable"
    - title: What shell does Screwdriver use?
      url: "#what-shell-does-screwdriver-use"
    - title: How do I speed up time to upload artifacts?
      url: "#how-do-i-speed-up-time-to-upload-artifacts"
    - title: How do I disable shallow cloning?
      url: "#how-do-i-disable-shallow-cloning"
    - title: What are the minimum software requirements for a build image?
      url: "#what-are-the-minimum-software-requirements-for-a-build-image"
    - title: How do I integrate with Saucelabs?
      url: "#how-do-i-integrate-with-saucelabs"
    - title: How do I run my pipeline when commits made from inside a build are pushed to my git repository?
      url: "#how-do-i-run-my-pipeline-when-commits-made-from-inside-a-build-are-pushed-to-my-git-repository"
    - title: 'Why do my pull request builds fail with the error: "fatal: refusing to merge unrelated histories" in the sd-setup-scm step?'
      url: "#why-do-my-pull-request-builds-fail-with-the-error-fatal-refusing-to-merge-unrelated-histories-in-the-sd-setup-scm-step"
    - title: 'Why do I get "Not Found" when I try to Start my pipeline?'
      url: "#why-do-i-get-not-found-when-i-try-to-start-my-pipeline%3F"


---

# Frequently Asked Questions

## How do I skip a step?

You might want to use a template but without one of its steps.

To do this, replace the unwanted step with any shell command that returns a successful status, such as `echo`, `true`, or even just `:`. Commands must be strings, so commands such as `true` or `:` should be quoted. Commands with backticks must be quoted too. Commands that return an unsuccessful status will abort the build.

Partial example:

```yaml
steps:
  - first: echo I am skipping step first
  - second: 'true'
  - third: ":"
  - WRONG: "`exit 22`"
```

## How do I skip a build?

You might want to skip a build if you're only changing documentation.

 If you don't want Screwdriver to trigger a build when you're pushing to master, add `[ci skip]` or `[skip ci]` somewhere in the commit message. If you don't want Screwdriver to trigger a build when you merge a pull request, add `[ci skip]` or `[skip ci]` to the pull request title.

_Note: Doesn't apply to pull request builds: a commit message containing `[skip ci]` or `[ci skip]` will still trigger a pre-commit job (a PR job will always run)._

## How do I create a pipeline?

To create a pipeline, click the Create icon and paste a Git URL into the form. Followed by `#` and the branch name, if the branch is not `master`.

![Create a pipeline](./assets/create-pipeline.png)

## How do I start a pipeline manually?

To start a build manually, you can either click the "Start" button on your pipeline page or click on a build bubble and choose "Start pipeline from here" from the dropdown. Then click "Yes" to confirm. Starting a pipeline using the first option starts all jobs with `~commit` event trigger.

Clicking the start button:
![Start a pipeline](./assets/start-pipeline.png)

See *How do I rerun a build?* section for the second option.

## How do I update a pipeline repo and branch?

If you want to update your pipeline repo and branch, modify the checkout URL in the Options tab on your pipeline page and click Update.

![Update a pipeline](./assets/update-pipeline.png)

## How do I disable/enable a job temporarily?

To temporarily disable/enable a job to quickly stop the line, toggle the switch to disable/enable for a particular job under the Options tab on your pipeline page. You can also optionally provide a reason for disabling/enabling the job.

![Disable a pipeline](./assets/disable-pipeline.png)

## How do I make sure my code is in sync with my pipeline?

If your pipeline looks out of sync after changes were made to it, to make sure it's in sync with your source code. On the Options tab in your pipeline page, click the Sync icon to update the out of sync elements. There are separate Sync icons for SCM webhooks, pull request builds, and pipeline jobs.

![Sync a pipeline](./assets/sync-pipeline.png)

## How do I delete a pipeline permanently?

Individual pipelines may be removed by clicking the Delete icon on the Options tab in your pipeline page. This action is not undoable.

![Delete a pipeline](./assets/delete-pipeline.png)

## How do I see pipeline metrics?

You can get to [the metrics page](https://blog.screwdriver.cd/post/184117350247/build-metrics) by either: clicking on a build bubble and selecting "Go to build metrics" or clicking on the "Metrics" tab in the pipeline page.

![See metrics](./assets/see-metrics.png)

## How do I toggle time formats in the build logs?

You can toggle through different time formats for your build logs such as _Since build started_, _Since step started_, _Local Timestamp_, and _UTC Timestamp_ by clicking on the text in the top left corner of the logs.

![Toggle time formats](./assets/toggle-time-format.png)

## How do I fix "Build failed to start" error message?

This is caused by a variety of reasons including cluster setup issue like hyperd down (if using executor vm) or a problem with your build image etc. Fixing this issue
requires different approaches based on what layer it's failing.

1. `/opt/sd/launch: not found` This issue affects Alpine based images because it uses musl instead of glibc. Workaround is to create the following symlink `mkdir /lib64 && ln -s /lib/ld-musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2` when creating your Docker image.
1. [A bug in hyperd](https://github.com/screwdriver-cd/screwdriver/issues/1081) sometimes causes images with `VOLUME` defined to fail to launch consistently in some certain nodes. One of these images is `gradle:jdk8`. The current workaround is to use other docker images, or to rebuild the gradle image using [this Dockerfile](https://github.com/keeganwitt/docker-gradle/blob/64a348e79cbe0bc8acb9da9062f75aca02bf3023/jdk8/Dockerfile) but excluding the `VOLUME` line.

## How do I rollback?

You can use one of two patterns to rollback: either rerunning a build in your pipeline or running a detached pipeline.

### How do I rerun a build or start a detached build?

To rerun a job's build from a past event, do the following steps.

1. Click on the desired event from the event list, which loads the detailed event graph.
1. Then, click the job bubble you'd like to rerun.
1. In the pop up, click “Start pipeline from here” to rerun that job using that event context.
1. Lastly, click "Yes" to confirm.
![Load event graph](./assets/re-run-select.png)
![Start new build for job](./assets/re-run-start.png)

To rollback, do the following steps on a [detached build](./configuration/workflow#detached-jobs-and-pipelines). You'll most likely want to use [metadata](./metadata) to `meta set` an image name or version in your last job (in this example, job D) and `meta get` that name or version in your rollback job (in this example, detached). The detached job will have access to the metadata set in job D.

## How do I mark a build as UNSTABLE?

You can update a build with an `UNSTABLE` status by calling the [API](./api) in a build. Screwdriver will consider builds marked with this status as not successful and will not proceed with the next job. You can [clone our example unstable build repository here](https://github.com/screwdriver-cd-test/unstable-build-example).

## What shell does Screwdriver use?

By default, step commands are evaluated with the Bourne shell (`/bin/sh`). You can specify a different shell (such as Bash) with the `USER_SHELL_BIN` [environment variable](./environment-variables#user-configurable).

## How do I speed up time to upload artifacts?
You can set the environment variable [`SD_ZIP_ARTIFACTS`](./environment-variables#user-configurable) to `true` which will zip artifacts before uploading, provided your cluster admin has set it up properly.

## How do I disable shallow cloning?
You can set the environment variable [`GIT_SHALLOW_CLONE`](./environment-variables#user-configurable) to `false` in order to disable shallow cloning.

By default Screwdriver will shallow clone source repositories to a depth of 50. Screwdriver will also enable the `--no-single-branch` flag by default.

If shallow cloning is left enabled and you wish to push back to your git repository, your image must contain a git version of 1.9 or later. Alternatively, you may use the version of git bundled with Screwdriver by invoking `sd-step exec core/git "GIT COMMAND"`.

## What are the minimum software requirements for a build image?

Screwdriver has no restriction on build container image. However the container should have at the minimum `curl` && `openssh` installed. And default user of the container should be either `root` or have sudo NOPASSWD enabled.

Also, if the `image` is Alpine-based, an extra workaround is required in the form of the following symlink. `mkdir -p /lib64 && ln -s /lib/ld-musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2`

## How do I integrate with Saucelabs?

Read about it on our blog post: https://blog.screwdriver.cd/post/161515128762/sauce-labs-testing-with-screwdriver
See the example repo: https://github.com/screwdriver-cd-test/saucelabs-example

## How do I run my pipeline when commits made from inside a build are pushed to my git repository?

Screwdriver uses `sd_buildbot` as default [git user](https://github.com/screwdriver-cd/screwdriver/blob/ec959e1590909259479fe34f2f26d91f227025aa/config/custom-environment-variables.yaml#L284). So when you do `git` commits from inside a build, the commit user will be `sd-buildbot`.

This has implications for webhook processing. In order to prevent headless users from running your pipeline indefinitely, Screwdriver cluster admins can configure Screwdriver webhook processor to ignore commits made by headless users. This is done by setting [IGNORE_COMMITS_BY](https://github.com/screwdriver-cd/screwdriver/blob/ec959e1590909259479fe34f2f26d91f227025aa/config/custom-environment-variables.yaml#L323-L325) environment variable. Default git user `sd-buildbot` is usually added to this list.

Users can override this behavior by using a different git user. For example `git config --global user.name my-buildbot`. With this, your `git` commits from a Screwdriver build will be associated with user `my-buildbot` and will run Screwdriver pipeline without getting ignored by webhook processor.

## Why do my pull request builds fail with the error: `fatal: refusing to merge unrelated histories` in the sd-setup-scm step?

If your pull request branch has more than `$GIT_SHALLOW_CLONE_DEPTH` commits (default: 50), you may see pull request builds fail with this error. This message indicates that git cannot find a common shared ancestor between your feature branch and the main branch.

To resolve this issue, you could disable or tune the shallow clone settings ([see them listed here](./environment-variables#user-configurable)) for your job, or reduce the number of commits on your feature branch (e.g. rebase and squash).

## Why do I get `Not Found` when I try to Start my pipeline?

Screwdriver Pipeline has a 1:1 relation to underlying SCM Repo and this is validated by not only using the SCM Repo Name but also it's unique id. `Not Found` error occurs when the SCM Repo is deleted and re-created under same Repo name (delete & re-fork has same effect). This results in the new SCM Repo getting a new id and hence failing Screwdriver validations. If your pipeline is in this state, your only option is to re-create the pipeline and reach out Screwdriver cluster admin to remove  the old Pipeline.
