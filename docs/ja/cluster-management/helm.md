---
layout: main
title: Helm
category: Cluster Management
menu: menu_ja
toc:
    - title: Kubernetes Helm Chartを利用してScrewdriverをセットアップする
      url: "#Kubernetes Helm Chartを利用してScrewdriverをセットアップする"
      active: true

---
# Kubernetes Helm Chartを利用してScrewdriverをセットアップする
Screwdriverのエコシステムには多くのコンポーネントが含まれており、それらを個別に設定、デプロイすることはScrewdriverに慣れていない利用者にとって困難でしょう。

ScrewdriverのクラスタをKubernetes上で簡単にセットアップできるように、Kubernetesのdeploymentsファイルを1つの[helm chart](https://github.com/screwdriver-cd/screwdriver-chart)にまとめました。chartをインストールすることで、全てのシステムを一度にデプロイすることができます。

インストールの説明についてはchartの[リポジトリ](https://github.com/screwdriver-cd/screwdriver-chart)を参照してください。
