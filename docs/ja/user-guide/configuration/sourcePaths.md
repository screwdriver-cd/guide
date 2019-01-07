---
layout: main
title: ソースパス
category: User Guide
menu: menu_ja
toc:
- title: ソースパス
  url: "#ソースパス"
---

# ソースパス

ソースパス機能を使うことで、特定のソースコードが更新された場合にのみジョブをトリガーすることができます。ジョブ定義の中で `sourcePaths` を文字列、または文字列の配列で設定することで利用できます。この機能は [monorepo](https://developer.atlassian.com/blog/2015/10/monorepos-in-git) のサブディレクトリに基づいたワークフローを実現するのに役立ちます。

## ソースパスの種類

特定のサブディレクトリと特定のファイルの両方をソースパスとして設定できます。サブディレクトリであることを示すには、 最後にスラッシュ (`/`) を付けます。設定するパスはリポジトリルートからの相対パスです。

#### 例

以下のような構造のリポジトリを例とします:

```
┌── README.md
├── screwdriver.yaml
├── test/
│   └── ...
├── src/
│   ├── app/
│   │   ├── main.js
│   │   ├── ...
│   │   └── package.json
│   └── other/
│       └── ...
│
...
```

また、このような `screwdriver.yaml` があるとします:

```yaml
jobs:
    main:
        image: node:6
        requires: [~pr, ~commit]
        sourcePaths: ["src/app/", "screwdriver.yaml"]
        steps:
            - echo: echo hi
```

この例では、`main` ジョブは `src/app/` 以下にあるファイル (`src/app/main.js`, `src/app/package.json` など) の更新、または `screwdriver.yaml` の更新でトリガーされます。
しかし `main` ジョブは、`README.md`, `test/` または `src/other/` の更新では**トリガーされません**。

### マッチしたソースパス

Screwdriverはビルドをトリガーしたソースパスを環境変数`SD_SOURCE_PATH`にセットします。この値は変更されたファイルのいずれかとマッチする`sourcePaths`の最初のパスになり、そのビルドをトリガしたソースパスに依存するスクリプトを書く場合に使用できます。

### 警告

- この機能は現在 [Github SCM](https://github.com/screwdriver-cd/scm-github) のみでご利用いただけます。
- `sourcePaths` の設定は手動でパイプラインを実行したり、ジョブをリスタートした際は無視されます。
- `screwdriver.yaml` はリポジトリルートに配置されている必要があります。
