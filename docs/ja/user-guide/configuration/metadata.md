---
layout: main
title: Metadata
category: User Guide
menu: menu_ja
toc:
- title: Metadata
  url: "#metadata"
- title: What is Metadata?
  url: "#what-is-metadata"
- title: Manipulating Metadata
  url: "#manipulating-metadata"
---

# Metadata

## Metadata とは？

Metadata は[ビルド](../../about/appendix/domain#build)に関する情報を保持する key/value ストアです。Metadata は同じ [workflow](../../about/appendix/domain#workflow) 内の後続のビルドで共有されます。Metadata は [steps](https://github.com/screwdriver-cd/meta-cli) 内で組み込まれている [meta CLI](../../about/appendix/domain#step) を利用することで、全てのビルドで更新と取得が可能です。

## Metadata の操作

Screwdriver は meta store から情報を取得するためのシェルコマンド `meta get` と、meta store に情報を保存するための シェルコマンド `meta set` を提供しています。

例:

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
