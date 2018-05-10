---
layout: main
title: アノテーション
category: User Guide
menu: menu_ja
toc:
- title: アノテーション
  url: "#アノテーション"
---

# アノテーション

アノテーションは自由形式なキーと値のデータセットで、ビルドの実行設定などを定義するのに用います。[YAMLのアンカーやエイリアス](http://blog.daemonl.com/2016/02/yaml.html)のサンドボックスとしても利用することができます。

#### 例

```
shared:
    template: example/mytemplate@stable
    annotations:
        foo: &bar               # Making an anchor for this configuration
            image: node:8

jobs:
    requires: [~pr, ~commit]
    main: *bar                  # Referencing the annotation anchor to use that config for main job
                                # This will cause the main job to use a node:8 image
    annotations:
        beta.screwdriver.cd/cpu: HIGH                      # Use HIGH for CPU
        screwdriver.cd/buildPeriodically: H H(4-7) * * *   # Run the job every day sometime between 4am and 7am UTC.
```

## サポートされているアノテーション

ビルド環境を変更するためにサポートされているアノテーションがあります。以下のアノテーションはScrewdriver.cdで管理されているプラグインでサポートされています。利用しているScrewdriverでどのアノテーションが利用可能かはクラスタ管理者にご確認ください。

アノテーション | 値 | 説明
--- | --- | ---
beta.screwdriver.cd/executor | クラスタ管理者にご確認ください | ビルドの実行に利用するシステムを指定します。VMやkubernetesポッド、dockerコンテナ、Jenkinsエージェントなどでビルドを実行するように設定できます。
beta.screwdriver.cd/cpu | `MICRO` / `LOW` / `HIGH` | `k8s` executorを利用する場合、ユーザーは 0.5 (`MICRO`)、2 (`LOW`)、6 (`HIGH`) CPUの中から選択可能です。<br>`k8s-vm` executorを利用する場合は、1 (`MICRO`)、2 (`LOW`)、6 (`HIGH`) CPU の中から選択可能です。<br>いずれの場合もデフォルト値は`LOW`となります。
beta.screwdriver.cd/ram | `MICRO` / `LOW` / `HIGH` | `k8s` executorを利用する場合、ユーザーは 1 GB (`MICRO`)、 2 GB (`LOW`)、12 GB (`HIGH`) RAMの中から選択可能です。<br>`k8s-vm` executorを利用する場合は、1 GB (`MICRO`)、2 GB (`LOW`)、12 GB (`HIGH`) RAMの中から選択可能です。<br>いずれの場合もデフォルト値は`LOW`となります。
beta.screwdriver.cd/timeout | 時間(分) | ビルドがタイムアウトとなる時間(分)を指定できます。デフォルト値は`90` 分です。
screwdriver.cd/buildPeriodically | 「分」のフィールドに'H'を指定したCRON表記。例: `H 0 * * *` <br><br>**注意:** 共有リソースへ急激に負荷がかかることを避けるため、「分」のフィールドは常に'H'を指定します。(実行頻度は最高でも1時間に1回です)
CRON表記については以下で確認ができます。 https://crontab.guru/ | cron表記にしたがって定期的にジョブを実行します。
