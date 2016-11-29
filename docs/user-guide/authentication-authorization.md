# Access Control

To simplify access, Screwdriver uses the same security model as the Pipeline's Git repository.

## Authorization

_For this example, we will be using the GitHub SCM provider._

Depending on your permission level to a Git repository, you will have corresponding access to the linked Screwdriver Pipeline.

* **Read (Guest)**
    * View the overall status of the pipeline
    * View the log of a build
* **Write (Collaborator)**
    * _All permissions as a Guest_
    * Start a new build
    * Stop an existing build
* **Admin (Owner)**
    * _All permissions as a Collaborator_
    * Create a new pipeline for this repository
    * Delete the existing pipeline
    * Create, update, delete secrets
    * Disable and enable jobs

## Authentication

For Screwdriver to determine your permission level, you need to complete a one-time procedure to link your Git accounts to Screwdriver.  This will only give Screwdriver limited access to your repositories:

* **READ-ONLY access to public repositories** - To read the contents of `screwdriver.yaml` files.
* **Full control of repository hooks** - To add/remove Screwdriver webhook on pipeline creation/deletion.
* **Read org and team membership** - To determine your permission-level (see above).
* **Access commit status** - To update Pull Requests with the success or failure of your builds.
