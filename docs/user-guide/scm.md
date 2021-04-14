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

Screwdriver is compatible with three different Source Code Management options: GitHub, GitLab, and Bitbucket, with varying levels of feature support.

## Feature Support
| Feature                                            | scm-github | scm-gitlab | scm-bitbucket |
|----------------------------------------------------|------------|------------|---------------|
| [source paths][source-paths]                       |     ✅     |            |               |
| [code coverage][code-coverage]                     |     ✅     |            |               |
| [deploy keys][deploy-keys]                         |     ✅     |            |               |
| [private repo][private-repo]                       |     ✅     |            |               |
| [tag/release filtering][tag-release-filtering]     |     ✅     |            |               |
| [external config][external-config]                 |     ✅     |            |      ✅       |
| [source directory][source-directory]               |     ✅     |            |      ✅       |
| [pull requests (~pr)][pull-requests]               |     ✅     |            |      ✅       |
| [branch filtering][branch-filtering]               |     ✅     |     ✅     |      ✅       |
| [subscribe notifications][subscribe-notifications] |     ✅     |     ✅     |      ✅       |
| [ignoreCommitsBy][ignore-commits-by]               |     ✅     |     ✅     |      ✅       |
| [webhooks (~commit)][webhooks]                     |     ✅     |     ✅     |      ✅       |


[branch-filtering]: ./configuration/workflow#branch-filtering
[code-coverage]: ./configuration/code-coverage#github-pull-request-decoration
[deploy-keys]: ../cluster-management/configure-api#source-control-plugin
[external-config]: ./configuration/externalConfig
[ignore-commits-by]: ../cluster-management/configure-api#webhooks
[private-repo]: ../cluster-management/configure-api#source-control-plugin
[pull-requests]: ./configuration/workflow#workflow
[source-directory]: ./configuration/sourceDirectory
[source-paths]: ./configuration/sourcePaths
[subscribe-notifications]: ./configuration/workflow#subscribed-scm-notifications
[tag-release-filtering]: ./configuration/workflow#tagrelease-filtering
[webhooks]: ./configuration/workflow#workflow