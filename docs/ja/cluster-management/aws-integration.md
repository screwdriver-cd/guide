---
layout: main
title: AWSネイティブなCI/CDビルド
category: Cluster Management
menu: menu_ja
toc:
    - title: AWSネイティブビルド
      url: "#awsネイティブビルド"
      active: true
    - title: セットアップ
      url: "#セットアップ"
    - title: イメージ
      url: "#イメージ"
    - title: プロバイダーの設定
      url: "#プロバイダーの設定"
    - title: ジョブレベルプロバイダーの設定
      url: "#ジョブレベルプロバイダーの設定"
      subitem: true
    - title: 外部プロバイダーの設定
      url: "#外部プロバイダーの設定"
      subitem: true
    - title: Sharedプロバイダーの設定
      url: "#sharedプロバイダーの設定"
      subitem: true
---
# AWSネイティブビルド

Screwdriverは、Code BuildまたはEKSで実行されるAWSネイティブビルドのオーケストレーションに使用することができます。

* [AWS](https://aws.amazon.com/)
* [Code Build](https://aws.amazon.com/codebuild/)
* [EKS](https://aws.amazon.com/eks/)

アーキテクチャ図 [diagram](https://github.com/screwdriver-cd/screwdriver/issues/2550#issuecomment-930380829).

この統合では、[AWS MSK](https://aws.amazon.com/msk/)を使用して、ユーザー自身のAWSアカウントでユーザーのビルドをスケジュールするものです。これにより、Screwdriverクラスターの管理者は、異なるユーザーのビルドをそれぞれのAWSアカウントに送信し、互いに影響を及ぼさないマルチテナントのビルド環境を構築することができます。 また、ユーザーはScrewdriverにアカウントやネットワークアクセスを提供することなくScrewdriverと統合し、[IAMロールID](https://aws.amazon.com/iam/)に支えられたセキュアなAWSデプロイメントを実行することが可能です。

## 設定

この機能を利用するには、Screwdriverクラスターの管理者は、[aws-producer-scripts](https://github.com/screwdriver-cd/aws-producer-scripts#readme)を使用してAWS MSKインフラを構築し、[queue-service](https://github.com/screwdriver-cd/queue-service/blob/master/config/custom-environment-variables.yaml#L287-L307)で有効化する必要があります。

統合を希望するユーザーは、Screwdriverクラスターの管理者と協力して、ビルドをスケジューリングするために[AWSアカウントを登録する](https://github.com/screwdriver-cd/aws-consumer-scripts/#prerequisite)必要があります。 

登録が完了したら、ユーザーは[スクリプト](https://github.com/screwdriver-cd/aws-consumer-scripts/#instructions)を実行して、ビルドインフラを構築する必要があります。 

## イメージ
`image`の設定は、[hub.docker.com](https://hub.docker.com)のコンテナや、[公開されているAWS ECRのイメージ](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html)のコンテナなどのDockerイメージを参照します。 

自身のAWSアカウントのリージョンでサポートされているイメージの一覧を確認する方法:
```
aws codebuild list-curated-environment-images
```
イメージのURL全体を指定することで、カスタムレジストリや自身のAWS ECR上のイメージを指定できます。
インフラ構築時に、必要な権限を持ったECRを作成したい場合は、[aws-consumer-scripts](https://github.com/screwdriver-cd/aws-consumer-scripts#config-definitions)で`create_ecr`フラグを設定すれば可能です。

#### 例
```
jobs:
    main:
        requires: [~pr, ~commit]
        image: 123456789012.dkr.ecr.us-west-2.amazonaws.com/screwdriver-hub:example_image
        provider:
          ...mandatory_params
        steps:
            - step1: echo hello
```

## プロバイダーの設定
クラウドプロバイダーに関する設定を識別するために、プロバイダー設定が必要です。AWSネイティブビルドの場合、Virtual Private Cloud（VPC）、インバウンド・アウトバウンドの通信を定義するサブネットとセキュリティグループ、権限に基づいて様々なAWSサービスにアクセスするためのIAMロールのそれぞれの識別子が含まれます。

 | プロパティ | 値 | 説明 |
 |------------|--------|-------------|
 | name | `aws` | 対応クラウドプロバイダー名 |
 | region | `us-east-1` / `us-west-2` / [all AWS regions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html) | デフォルトは `us-west-2`。 必要なインフラを構築し、ビルドを実行するリージョンを定義します。 |
 | accountId | 有効なAWSアカウントID | ビルドを構築するAWSアカウントIDを定義します。 |
 | vpcId | 有効なAWS VPC ID | AWS VPC IDを定義します。 |
 | securityGroupIds | 有効なセキュリティグループのIDのリスト | AWS Security Group IDを定義します。 |
 | subnetIds | 有効なサブネットIDのリスト | AWS Subnet IDを定義します。 |
 | role | 有効なAWS IAM RoleのARN  | 権限とポリシーが紐づいたAWS IAM RoleのARNを定義します。 |
 | executor | `sls` / `eks` | ネイティブビルドの2つのエグゼキューターモードを定義します。: `sls` (AWS CodeBuild), `eks` (AWS EKS) |
 | launcherImage | 有効なScrewdriver launcherのDockerイメージ | ビルドを開始するために必要なScrewdriver launcherイメージを定義します。`例: screwdrivercd/launcher:v6.0.149` |
 | launcherVersion | 例: `v6.0.149` | Screwdriver launcherイメージのバージョン |
 | buildRegion | `us-east-1` / `us-west-2` | ビルドを実行するリージョンがサービスリージョンと異なる場合に設定します。デフォルトは`region`と同じ値です。 |
 | executorLogs | `true` / `false` | AWS CodeBuildプロジェクトのログをAWS CloudWatchで表示するためのフラグです。デフォルトは`false`です。 |
 | privilegedMode | `true` / `false` | AWS CodeBuildプロジェクトのDockerビルドで特権モードを有効にするためのフラグです。デフォルトは`false`です。 |
 | computeType | 全ての有効な [AWS CodeBuild Compute Types](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html) | 利用可能なメモリ、vCPU、およびディスク領域を持つ様々なコンピュートタイプを定義します。デフォルトは`BUILD_GENERAL1_SMALL`です。 |
 | environmentType | 全ての有効な [AWS CodeBuild Environment](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html) | `computeType` に対応する様々な環境のタイプを定義します。デフォルトは`LINUX_CONTAINER`です。 |


### ジョブレベルプロバイダーの設定
プロバイダーの設定は`screwdriver.yaml`のジョブ内に設定できます。次の例はプロバイダーの設定に必須のパラメータを定義した例です。

#### 例
```
jobs:
  main:
    requires: [~pr, ~commit]
    image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
    provider:
      name: aws
      region: us-west-2
      accountId: 123456789012
      vpc:
        vpcId: vpc-0123abc
        securityGroupIds:
          - sg-0123abc
        subnetIds:
          - subnet-0123abc
          - subnet-0123def
          - subnet-0123ghi
      role: arn:aws:iam::123456789012:role/screwdriver-integration-role
      executor: sls
      launcherImage: screwdrivercd/launcher:v6.0.149
      launcherVersion: v6.0.149
    steps:
      - init: npm install
      - test: npm test
```

### 外部プロバイダーの設定
また、プロバイダーの設定は、別のリポジトリにリモートで保存することもできます。チェックアウトURLを`CHECKOUT_URL#BRANCH:PATH`というフォーマットで記述することで、この設定を参照することができます。

#### 例
```
jobs:
  main:
    requires: [~pr, ~commit]
    image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
    provider: git@github.com:configs/aws.git#main:cd/aws/provider.yaml
    steps:
      - init: npm install
      - test: npm test
```

### Sharedプロバイダーの設定
`provider`の設定は、`shared`に追加できます。ジョブに指定されたプロバイダー設定は、`shared.provider`上の同じ項目を上書きします。

#### 例
以下の例では、main と main2 のジョブが使用する`provider`の共有設定を定義しています。
```
shared:
  image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
  provider:
    name: aws
    region: us-west-2
    accountId: 123456789012
    vpc:
      vpcId: vpc-0123abc
      securityGroupIds:
        - sg-0123abc
      subnetIds:
        - subnet-0123abc
        - subnet-0123def
        - subnet-0123ghi
    role: arn:aws:iam::123456789012:role/screwdriver-integration-role
    executor: sls
    launcherImage: screwdrivercd/launcher:v6.0.149
    launcherVersion: v6.0.149

jobs:
    main:
      requires: [~pr, ~commit]
      steps:
        - init: npm install
        - pretest: npm lint
        - test: npm test
    main2:
      requires: [main]
      steps:
          - test: echo Skipping test
```

上の例は次の例と同じものになります:
```
jobs:
    main:
        requires: [~pr, ~commit]
        image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
        provider:
          ...same as shared
        steps:
            - init: npm install
            - pretest: npm lint
            - test: npm test
    main2:
        requires: [main]
        image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
        provider:
          ...same as shared
        steps:
            - test: echo Skipping test

```
