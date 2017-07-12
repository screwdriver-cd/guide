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

## What is Metadata?

Metadata is a structured key/value storage of relevant information about a [build](../../about/appendix/domain#build). Metadata will be shared with subsequent builds in the same [workflow](../../about/appendix/domain#workflow). It can be updated or retrieved throughout the build by using the built-in [meta CLI](https://github.com/screwdriver-cd/meta-cli) in the [steps](../../about/appendix/domain#step).

## Manipulating Metadata

Screwdriver provides the shell command `meta get` to extract information from the meta store and `meta set` to save information to the meta store.

Example:
```bash
$ meta set example.coverage 99.95
$ meta get example.coverage
99.95
$ meta get example
{"coverage":99.95}
```

Example:
```bash
$ meta set foo[2].bar[1] baz
$ meta get foo
[null,null,{"bar":[null,"baz"]}]
```
