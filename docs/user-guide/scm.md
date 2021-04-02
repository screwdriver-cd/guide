---
layout: main
title: SCM
category: User Guide
menu: menu
toc:
    - title: SCM
      url: "#scm"
      active: true
    - title: Feature Support
      url: "#feature-support"
---
# SCM

Screwdriver is compatible with three different Source Code Management options: Github, Gitlab, and Bitbucket, with varying levels of feature support.

## Feature Support
| Feature                                            | scm-github | scm-gitlab | scm-bitbucket |
|----------------------------------------------------|------------|------------|---------------|
| [source paths][source-paths]                       |     ✅     |            |              |
| [code coverage][code-coverage]                     |     ✅     |            |               |
| [tag/release filtering][tag-release-filtering]     |     ✅     |            |               |
| [external config][external-config]                 |     ✅     |            |      ✅       |
| [branch filtering][branch-filtering]               |     ✅     |     ✅     |      ✅      |
| [source directory][source-directory]               |     ✅     |     ✅     |      ✅      |
| [subscribe notifications][subscribe-notifications] |     ✅     |     ✅     |      ✅      |


[branch-filtering]: ./configuration/workflow#branch-filtering
[code-coverage]: ./configuration/code-coverage#github-pull-request-decoration
[external-config]: ./configuration/externalConfig
[source-directory]: ./configuration/sourceDirectory
[source-paths]: ./configuration/sourcePaths
[subscribe-notifications]: ./configuration/workflow#subscribed-scm-notifications
[tag-release-filtering]: ./configuration/workflow#tagrelease-filtering
