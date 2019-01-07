---
layout: main
title: 環境変数
category: User Guide
menu: menu_ja
toc:
- title: 環境変数
  url: "#環境変数"
---

# 環境変数

ビルドで利用する環境変数のキーと値の組み合わせです。sharedとジョブの両方で同じキーの環境変数を設定した場合、ジョブで設定されている値が利用されます。

## 制限事項
- `environment`セクションの中ではネストされた環境変数は展開されません。

#### 例

```
shared:
    template: example/mytemplate@stable
    environment:
        FOO: bar
        MYVAR: hello        # 全てのビルドで MYVAR=hello が設定されます
jobs:
    main:
        requires: [~pr, ~commit]
        environment:
            FOO: baz        # ビルド内で FOO=baz が設定されます
    main2:                  # ビルド内で FOO=bar が設定されます
        requires: [main]
```
