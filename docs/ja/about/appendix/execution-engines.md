---
layout: main
title: Execution Engines
category: About
menu: menu_ja
toc:
- title: Execution Engines
  url: "#execution-engines"
  active: 'true'
- title: サポートされる環境
  url: "#サポートされる環境"
- title: 選択基準
  url: "#選択基準"
- title: 候補
  url: "#候補"
- title: 当初の分析
  url: "#当初の分析"
---

## Execution Engines

> ジョブのスケジューリングと実行のためのワークロード管理システム

一般的な企業では、複数のオペレーティングシステムをサポートする必要があります。 このプロジェクトのコアは、オープンソースプロジェクトと商用クラウド製品とその能力を活用することです。 
TODO：ターゲットとなるユースケースと典型的なエンタープライズに結びつける

### サポートされる環境

第一段階

- Linuxやウェブサービスとそのバックエンドサービスの典型的なユースケース。オープンソースでのリリースにあたり、以下で説明するようにいくつかの選択肢について評価しています。

第二段階

- iOSやデスクトップクライアントのためのMac OSX。将来的にWindowsもサポートするかもしれません。Mac OSXスレーブへのジョブスケジューリングのためにJenkinsがサポートされる予定です。Jenkinsは多くのOSサポートがあるためここでは便利です。

なぜJenkinsはどこにも使われないのですか？ Jenkinsは他の分野でも優れたサービスを提供していますが、アーキテクチャのスケーラビリティと全体的なパフォーマンスが制限されています。 さらに、Jenkinsクラスタの管理には、高い運用上のオーバーヘッドがあります。 Jenkinsを使用しないときのマイナス面は、既存のプラグインエコシステムにアクセスできないことです。

### 選択基準

- Yahooの外部で利用可能であること
- セットアップのしやすさ
- コミュニティの勢い（業界のイノベーション活用と我々のソリューションの将来性の裏付け
- 機能（半永続ストレージ、スケジューラオプションなど）
- オンプレミスでもクラウド（AWSやGCP）でも動作
- 操作性

### 候補

- Kubernetes (GCPのコンテナエンジン含む)
- Amazon ECS
- Mesos
- Docker Swarm

### 当初の分析

- Amazon ECSとKubernetesはセットアップが一番簡単でした。利用者がプラットフォームを簡単に試せるということです。どちらもクラウド上のプラットフォーム（KubernetesはGCPコンテナエンジンの場合）であるため、運用のオーバーヘッドもありません。
- KubernetesはオンプレミスでもGCPでサポートされているインターフェースと同じものを利用可能にします。
- ECSはAmazon限定でオンプレミスという選択肢がありません。
- MesosはYahoo内部で利用されています。利用し始めるのは難しく、フレームワークの調査により多くの時間が必要です。
- Docker Swarmも候補ですが、他の選択肢よりも成熟していません。今後の成長に注目です。

Capabilities analysis requires learning the underlying systems to a certain degree.  The evaluation process includes an end to end integration to understand integration points as well as the strength and weaknesses of the system.  Kubernetes was chosen for the first end to end integration.

TODO: add results of evaluations
