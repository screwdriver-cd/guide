# Overall Architecture

Screwdriver is a collection of services that facilitate the workflow for
Continuous Delivery pipelines.

![Workflow](assets/workflow.png)

## Workflow

1. **Commit new code**

    User starts a new build by one of the following operations:

    - User pushes code to SCM
    - User opens a new pull request on SCM
    - User pushes code to SCM on an open pull request
    - User tells Screwdriver (via API or UI) to rebuild a given commit

2. **Notify Screwdriver**

    Signed [webhooks](https://developer.github.com/webhooks/) notify
    Screwdriver's API about the change.

3. **Trigger execution engine**

    Screwdriver starts a job on the specified execution engine passing the
    user's configuration and git information.

4. **Build software**

    Screwdriver's Launcher executes the commands specified in the user's
    configuration after checking out the source code from git inside the
    desired container.

5. **Publish artifacts** _(optional)_

    User can optionally push produced artifacts to respective artifact
    repositories (RPMs, Docker images, Node Modules, etc.).

6. **Continue pipeline**

    On completion of the job, Screwdriver's Launcher notifies the API and
    if there's more in the pipeline, the API triggers the next job on the
    execution engine (`GOTO:3`).

## Components

Screwdriver consists of five main components, the first three of which are
built/maintained by Screwdriver:

 - **REST API**

    RESTful interface for creating, monitoring, and interacting with pipelines.

 - **Web UI**

    Human consumable interface for the **REST API**.

 - **Launcher**

    Self-contained tool to clone, setup the environment, and execute the
    shell commands defined in your job.

 - **Execution Engine**

    Pluggable build executor that supports executing commands inside of a
    container (e.g. Jenkins, Kubernetes, and Docker).

 - **Datastore**

    Pluggable storage for keeping information about pipelines
    (e.g. Postgres, MySQL, and Sqlite).
