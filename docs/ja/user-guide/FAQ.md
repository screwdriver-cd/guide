---
layout: main
title: FAQ
category: User Guide
menu: menu_ja
toc:
    - title: Frequently Asked Questions
      url: "#frequently-asked-questions"
      active: true
    - title: How do I create a pipeline?
      url: "#how-do-i-create-a-pipeline"
    - title: How do I start a pipeline manually?
      url: "#how-do-i-start-a-pipeline-manually"
    - title: How do I update a pipeline repo and branch?
      url: "#how-do-i-update-a-pipeline-repo-and-branch"
    - title: How do I disable/enable a job temporarily?
      url: "#how-do-i-disable/enable-a-job-temporarily"
    - title: How do I make sure my code is in sync with my pipeline?
      url: "#how-do-i-make-sure-my-code-is-in-sync-with-my-pipeline"
    - title: How do I delete a pipeline permanently?
      url: "#how-do-i-delete-a-pipeline-permanently"
---

# Frequently Asked Questions

## How do I create a pipeline?

To create a pipeline, click the Create icon and paste a Git URL into the form. Followed by `#` and the branch name, if the branch is not `master`.

![Create a pipeline](../../user-guide/assets/create-pipeline.png)

## How do I start a pipeline manually?

To start a build manually, click the Start button on your pipeline page.

![Start a pipeline](../../user-guide/assets/start-pipeline.png)

## How do I update a pipeline repo and branch?

If you want to update your pipeline repo and branch, modify the checkout URL in the Options tab on your pipeline page and click Update.

![Update a pipeline](../../user-guide/assets/update-pipeline.png)

## How do I disable/enable a job temporarily?

To temporarily disable/enable a job to quickly stop the line, toggle the switch to disable/enable for a particular job under the Options tab on your pipeline page.

![Disable a pipeline](../../user-guide/assets/disable-pipeline.png)

## How do I make sure my code is in sync with my pipeline?

If your pipeline looks out of sync after changes were made to it, to make sure it's in sync with your source code. On the Options tab in your pipeline page, click the Sync icon to update the out of sync elements. There are separate Sync icons for SCM webhooks, pull request builds, and pipeline jobs.

![Sync a pipeline](../../user-guide/assets/sync-pipeline.png)

## How do I delete a pipeline permanently?

Individual pipelines may be removed by clicking the Delete icon on the Options tab in your pipeline page. This action is not undoable.

![Delete a pipeline](../../user-guide/assets/delete-pipeline.png)
