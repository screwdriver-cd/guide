---
layout: main
title: SCM
category: User Guide
menu: menu_ja
toc:
    - title: SCM
      url: "#scm"
      active: true
    - title: サポートしている機能
      url: "#サポートしている機能"
---
# SCM

ScrewdriverはGitHub、GitLab、Bitbucketの3つのSCMに対応していますが、Screwdriverの機能の中には一部のSCMにしか対応していないものもあります。

## サポートしている機能

| 機能                                                  | scm-github | scm-gitlab | scm-bitbucket |
|------------------------------------------------------|------------|------------|---------------|
| [ソースパス][source-paths]                             |     ✅     |            |               |
| [コードカバレッジ][code-coverage]                       |     ✅     |            |               |
| [Deploy Keys][deploy-keys]                           |     ✅     |            |               |
| [プライベートレポジトリ][private-repo]                   |     ✅     |            |               |
| [タグフィルターとリリースフィルター][tag-release-filtering]|     ✅     |            |               |
| [パイプラインの親子設定][external-config]                |     ✅     |     ✅    |      ✅       |
| [read-only SCM][read-only]                         |     ✅     |     ✅     |      ✅       |
| [ソースディレクトリ][source-directory]                  |     ✅     |     ✅     |      ✅       |
| [prトリガー][pull-requests]                            |     ✅     |            |      ✅       |
| [ブランチフィルター][branch-filtering]                  |     ✅     |     ✅     |      ✅       |
| [外部リポジトリからの通知][subscribe-notifications]      |     ✅     |     ✅     |      ✅       |
| [ignoreCommitsBy][ignore-commits-by]                 |     ✅     |     ✅     |      ✅       |
| [commitトリガー][webhooks]                            |     ✅     |     ✅     |      ✅       |


[branch-filtering]: ./configuration/workflow#ブランチフィルター
[code-coverage]: ./configuration/code-coverage#コードカバレッジ
[deploy-keys]: ../cluster-management/configure-api#ソース管理プラグイン
[external-config]: ./configuration/externalConfig
[ignore-commits-by]: ../cluster-management/configure-api#webhooks
[private-repo]: ../cluster-management/configure-api#ソース管理プラグイン
[pull-requests]: ./configuration/workflow#ワークフロー
[read-only]: ../cluster-management/configure-api#ソース管理プラグイン
[source-directory]: ./configuration/sourceDirectory
[source-paths]: ./configuration/sourcePaths
[subscribe-notifications]: ./configuration/workflow#購読しているscmからの通知
[tag-release-filtering]: ./configuration/workflow#タグフィルターとリリースフィルター
[webhooks]: ./configuration/workflow#ワークフロー
