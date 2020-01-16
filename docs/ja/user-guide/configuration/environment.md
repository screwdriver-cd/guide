---
layout: main
title: 環境変数
category: User Guide
menu: menu_ja
toc:
- title: 環境変数
  url: "#環境変数"
- title: 制限事項
  url: "#制限事項"
---

# 環境変数

ビルドで利用する環境変数のキーと値の組み合わせです。sharedとジョブの両方で同じキーの環境変数を設定した場合、ジョブで設定されている値が利用されます。

## 制限事項
- `environment`セクションの中ではネストされた環境変数は展開されません。
- 環境変数は宣言箇所で以下の順で評価されます:
  `template` > `shared` > `jobs`

#### 例

```yaml
shared:
    template: example/mytemplate@stable
    environment:
        FOO: bar
        MYVAR: ${FOO}        # 全てのビルドで MYVAR=bar が設定されます
        X.Y: "Z"
jobs:
    main:
        requires: [~pr, ~commit]
        environment:
            FOO: baz        # ビルド内で FOO=baz, MYVAR=baz が設定されます
    main2:                  # ビルド内で FOO=bar が設定されます
        requires: [main]
        environment:        # 上記のsharedセクションでの設定のため、MYVAR=bar が設定されます
            MYVAR: hello    # MYVAR=helloがビルド内で設定されます
```

以下のように、ドットを含む環境変数を使用する場合には注意してください。

```yaml
shared:
    environments:
       X.Y: "Z"
```

この時、`process.env.X.Y` では環境変数を取得できません。Node.js では、 `process.env['X.Y']` を使用してください。他の言語でも同様です。
