# Frequently Asked Questions

## How do I create a pipeline?

To create a pipeline, click the Create icon and paste a Git URL into the form. Followed by `#` and the branch name, if the branch is not `master`.

![Create a pipeline](./assets/create-pipeline.png)

## How do I start a pipeline manually?

To start a build manually, click the Start button on your pipeline page.

![Start a pipeline](./assets/start-pipeline.png)

## How do I update a pipeline repo and branch?

If you want to update your pipeline repo and branch, modify the checkout URL in the Options tab on your pipeline page and click Update.

![Update a pipeline](./assets/update-pipeline.png)

## How do I disable/enable a job temporarily?

To temporarily disable/enable a job to quickly stop the line, toggle the switch to disable/enable for a particular job under the Options tab on your pipeline page.

![Disable a pipeline](./assets/disable-pipeline.png)

## How do I make sure my code is in sync with my pipeline?

If your pipeline looks out of sync after changes were made to it, to make sure it's in sync with your source code. On the Options tab in your pipeline page, click the Sync icon to update the out of sync elements. There are separate Sync icons for SCM webhooks, pull request builds, and pipeline jobs.

![Sync a pipeline](./assets/sync-pipeline.png)

## How do I delete a pipeline permanently?

Individual pipelines may be removed by clicking the Delete icon on the Options tab in your pipeline page. This action is not undoable.

![Delete a pipeline](./assets/delete-pipeline.png)
