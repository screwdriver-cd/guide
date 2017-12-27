---
layout: main
title: Metadata
category: User Guide
menu: menu_ja
toc:
- title: Metadata
  url: "#metadata"
- title: Metadataとは?
  url: "#Metadataとは"
- title: Metadataの操作
  url: "#Metadataの操作"
---

# Metadata

## Metadataとは？

Metadata は[ビルド](../../about/appendix/domain#build)に関する情報を保持する key/value ストアです。Metadata は [steps](../../about/appendix/domain#step) 内で組み込まれている [meta CLI](https://github.com/screwdriver-cd/meta-cli) を利用することで、全てのビルドで更新と取得が可能です。

## Metadataの操作

Screwdriver は meta store から情報を取得するためのシェルコマンド `meta get` と、meta store に情報を保存するための シェルコマンド `meta set` を提供しています。

### 同一パイプライン

Screwdriverのビルドでは、同ビルドでセットされた Metadata、 もしくは同パイプラインの以前のビルドでセットされた Metadataを取得することができます。

例: `build1` -> `build2` -> `build3`

`build2`の Metadataは、自身でセットした Metadataと`build1` でセットした Metadataを保持しています。

`build3`の Metadataは、`build2` が持っていたMetadataを保持しています。 (`build1`のMetadataも含む)

```bash
$ meta set example.coverage 99.95
$ meta get example.coverage
99.95
$ meta get example
{"coverage":99.95}
```

例:

```bash
$ meta set foo[2].bar[1] baz
$ meta get foo
[null,null,{"bar":[null,"baz"]}]
```

### 外部パイプライン

Screwdriverのビルドは外部トリガージョブの Metadataにも `--external`フラグにトリガージョブを指定することでアクセスすることができます。

例: `sd@123:publish` -> `build1` の時 `build1`:

```
$ meta get example --external sd@123:publish
{"coverage":99.95}
```

注意:

- `meta set` は外部ビルドに対してはできません。
- もしフラグの値がトリガージョブではなかった場合、`meta get`は`null`を返します。
