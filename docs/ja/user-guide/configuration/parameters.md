---
layout: main
title: パラメーター
category: User Guide
menu: menu_ja
toc:
    - title: パラメーター
      url: "#パラメーター定義"
      active: true
---
## パラメーター定義
パラメータを定義するには、以下の例のように2つの方法があります。

```yaml
parameters:
    nameA: "value1"
    nameB:
        value: "value2"
        description: "description of nameB"
```

**パラメーター**とは`key:value`のペアで定義できるものです。

```yaml
parameters:
    nameA: "value1"
```

`key: string` (上記の例を参照) は`key:value` (下記の例を参照)を簡潔に記述したものです。

```yaml
parameters:
    nameA:
        value: "value1"
        description: ""
```

上記の2つの例は同等のものです。

## 例
screwdriver.yamlの全容は以下の通り:
```yaml
shared:
    image: node:8

parameters:
    region: "us-west-1"
    az:
        value: "1"
        description: "default availability zone"

jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - step1: 'echo "Region: $(meta get parameters.region.value)"'
            - step2: 'echo "AZ: $(meta get parameters.az.value)"'
```

ビルドで利用されるパラメーターは`Setup` -> `sd-setup-init`ステップで確認することができます。

パイプラインの動作イメージ:

![image](../../../user-guide/assets/parameters1-event-start.png)

![image](../../../user-guide/assets/parameters2-sd-init-step.png)

![image](../../../user-guide/assets/parameters3-event-view.png)

サンプルは[parameters-build-sample](https://github.com/screwdriver-cd-test/parameters-build-sample)をご覧ください。
