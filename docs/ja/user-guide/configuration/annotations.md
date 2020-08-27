---
layout: main
title: アノテーション
category: User Guide
menu: menu_ja
toc:
- title: アノテーション
  url: "#アノテーション"
- title: ジョブレベルのアノテーション
  url: "#ジョブレベルのアノテーション"
- title: パイプラインレベルのアノテーション
  url: "#パイプラインレベルのアノテーション"
---

# アノテーション

アノテーションは自由形式なキーと値のデータセットで、ビルドの実行設定などを定義するのに用います。[YAMLのアンカーやエイリアス](http://blog.daemonl.com/2016/02/yaml.html)のサンドボックスとしても利用することができます。

#### 例

```yaml
shared:
    template: example/mytemplate@stable
    annotations:
        foo: &bar               # アンカーを作成
            requires: [~pr, ~commit]
            image: node:8

jobs:
    main:
        <<: *bar                  # アンカーを参照してアノテーションで定義した設定を使用する
        annotations:
            screwdriver.cd/cpu: HIGH                           # CPUのHIGHリソースを指定
            screwdriver.cd/buildPeriodically: H H(4-7) * * *   # 毎日午前4:00から午前7:59(UTC)の間にジョブを実行します
```

## ジョブレベルのアノテーション

ジョブレベルのアノテーションはビルド環境の設定を変更するために利用します。ジョブレベルのアノテーションは特定のジョブや`shared`で指定することができます。

以下のアノテーションはScrewdriver.cdでメンテナンスしているプラグインでサポートしています。ご利用のScrewdriverクラスタで利用可能なアノテーションはクラスタ管理者にお問い合わせください

> `beta.screwdriver.cd`は deprecated となり、`screwdriver.cd`となることに注意してください。ただし、今の所は`beta.screwdriver.cd`のアノテーションでも利用できます。

| アノテーション | 値 | 説明 |
|------------|--------|-------------|
| screwdriver.cd/buildCluster | ビルドを実行するビルドクラスタ名 | 利用可能なビルドクラスタのリストは `<API URL>/v4/buildclusters` で確認できます。デフォルトでは `managedByScrewdriver: true` が設定されているクラスタにビルドがアサインされます。 あなたのリポジトリでの利用が許可されている任意のデフォルトクラスタや外部クラスタを選択することが可能です。（利用が許可されているリポジトリは`scmOrganizations`で設定されます）|
| screwdriver.cd/buildPeriodically | CRON表記<br>例: `H 0 * * *` <br><br>**注意:** 共有リソースへ急激に負荷がかかることを避けるため、「分」のフィールドは常に'H'(ハッシュを表す)を指定します。(実行頻度は最高でも1時間に1回です)<br>CRON表記については以下で確認ができます。https://crontab.guru/ | cron表記にしたがって定期的にジョブを実行します。CRON表記のいずれの項目でも、`H` (あるいは`H/5`や`H(3-7)`のような値)を指定すると、ジョブidのハッシュに基づいて、システムが該当箇所の値を指定した範囲内のものに置き換えます。例えば、`H(3-5)`は3, 4, 5のいずれかに置き換えられます。 |
| screwdriver.cd/collapseBuilds | `true` / `false` | `true` に設定したジョブでは `BLOCKED` 状態のビルドが最新のものに集約されます。<br>パイプライン全体に適用したい場合は `shared` に設定してください。<br>デフォルトの挙動はクラスタ設定によるので、クラスタ管理者に確認してください。 |
| screwdriver.cd/cpu | `MICRO` / `LOW` / `HIGH` / `TURBO` | k8s executorを利用する場合、ユーザーは 0.5 (`MICRO`)、2 (`LOW`)、6 (`HIGH`) 、12 (`TURBO`) CPUの中から選択可能です。<br>k8s-vm executorを利用する場合は、1 (`MICRO`)、2 (`LOW`)、6 (`HIGH`)、12 (`TURBO`) CPU の中から選択可能です。<br>いずれの場合もデフォルト値は`LOW`となります。 |
| screwdriver.cd/disk | クラスタ管理者にご確認ください | `k8s-vm` executorを利用する場合、ユーザーは20 GB (`LOW`) と50 GB (`HIGH`) と 100 GB (`TURBO`) からディスクスペースを選択可能です。デフォルトは `LOW` です。 |
| screwdriver.cd/diskSpeed | クラスタ管理者にご確認ください | `k8s-vm` executorを利用する場合、ユーザーはディスクスピードの異なるマシンの中から選択可能です。ディスクスピードはデフォルトでは指定がありません。 |
| screwdriver.cd/executor | クラスタ管理者にご確認ください | ビルドの実行環境を指定します。VMやkubernetesポッド、dockerコンテナ、Jenkinsエージェントなどでビルドを実行するように設定できます。 |
| screwdriver.cd/ram | `MICRO` / `LOW` / `HIGH` / `TURBO` | k8s executorを利用する場合、ユーザーは 1 GB (MICRO)、 2 GB (LOW)、12 GB (HIGH)、16 GB (TURBO) RAMの中から選択可能です。<br>k8s-vm executorを利用する場合は、1 GB (MICRO)、2 GB (LOW)、12 GB (HIGH)、 16 GB (TURBO) RAMの中から選択可能です。<br>いずれの場合もデフォルト値はLOWとなります。 |
| screwdriver.cd/repoManifest | Git リポジトリのチェックアウト URL です。例: `https://github.com/org/repo.git/manifestFilePath.xml#branch` <br><br>1. チェックアウト URL: `https://github.com/org/repo.git` (必須）<br>2. マニフェストファイルのパス: `manifestFilePath.xml` (オプション, デフォルトは `default.xml`)<br>3. ブランチ名: `#branch` (オプション, デフォルトは `#master`) | [Repo](https://gerrit.googlesource.com/git-repo) は Git 上に構築されたリポジトリ管理ツールです。この値は repo マニフェスト `xml` ファイルを含む Git リポジトリのチェックアウト URL です。この値が指定されていると、Screwdriver は `xml` ファイルの設定に従ってソースコードをチェックアウトします。 |
| screwdriver.cd/timeout | 時間(分) | ビルドがタイムアウトとなる時間(分)を指定できます。デフォルト値は90 分です。 |
| screwdriver.cd/dockerEnabled | `true` / `false` | k8s executor利用時に`true`に設定するとビルドコンテナと一緒にDocker-in-Dockerコンテナが起動し、DockerビルドやDockerイメージの起動が可能になります。このフラグをユーザーのyamlで設定するのに加え、クラスタ管理者がdocker in docker機能を有効にしている必要があります。 (cluster-managementのページをご覧ください) |
| screwdriver.cd/dockerCpu | `MICRO` / `LOW` / `HIGH` / `TURBO` | k8s executorを利用していてDockerが有効な場合、Dockerコンテナで使用するCPU数を設定することができます。設定される値については`screwdriver.cd/cpu`の説明をご覧ください。 |
| screwdriver.cd/dockerRam | `MICRO` / `LOW` / `HIGH` / `TURBO` | k8s executorを利用していてDockerが有効な場合、Dockerコンテナで使用するメモリ容量を設定することができます。設定される値については`screwdriver.cd/ram`の説明をご覧ください。 |
| screwdriver.cd/coverageScope | `pipeline` / `job` | カバレッジプラグインを利用している場合に、プロジェクトを作成するスコープを設定できます。デフォルト値はクラスタの設定(e.g. `COVERAGE_SONAR_ENTERPRISE`)によるので、クラスタ管理者にご確認ください。 |

## パイプラインレベルのアノテーション

パイプラインレベルのアノテーションはパイプライン全体の設定を変更するために利用します。パイプラインレベルのアノテーションの指定箇所はジョブや`shared`と同じです。これらのアノテーションはパイプラインのSCMブランチで設定される必要があるため、プルリクエストでは変更できません。

 | アノテーション | 値 | 説明 |
 |------------|--------|-------------|
 | screwdriver.cd/restrictPR | `none` / `all` / `fork` / `branch` | PRジョブが実行されないように制限します。`none` の場合は制限なしを意味します。`all` の場合はすべてのPRジョブ実行を制限します。`fork` はフォークされたリポジトリからのPRを制限します。`branch` はブランチからのPRを制限します。 |
| screwdriver.cd/chainPR    | `false` / `true` | デフォルトは`false`です。`false`の場合、PRは`requires`に`~pr`を設定しているジョブのみトリガーします。`true`を指定した場合、PRは`requires`に`~pr`を設定しているジョブだけでなく、その後続のジョブも順番にトリガーします。サンプルリポジトリ: https://github.com/screwdriver-cd-test/chain-pr-example |
