---
layout: main
title: Metadata
category: User Guide
menu: menu
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

Metadata is a structured key/value storage of relevant information about a [build](../../about/appendix/domain#build). It can be updated or retrieved throughout the build by using the built-in [meta CLI](https://github.com/screwdriver-cd/meta-cli) in the [steps](../../about/appendix/domain#step).

## Manipulating Metadata

Screwdriver provides the shell command `meta get` to extract information from the meta store and `meta set` to save information to the meta store.

### Same pipeline

Screwdriver build can retrieve metadata set by itself or by previous builds within the same pipeline.

Example: `build1` -> `build2` -> `build3`

`build2`'s metadata will consist of metadata set by itself and `build1`

`build3`'s metadata will consist of metadata from `build2` (which also includes metadata from `build1`)

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

Notes:
- If `foo` is not set and you try to `meta get foo`, it will return `null` by default.

### External pipeline

Screwdriver build can also access metadata from an external triggering job by adding the `--external` flag followed by the triggering job.

Example: `sd@123:publish` -> `build1`. Then inside `build1`:
```
$ meta get example --external sd@123:publish
{"coverage":99.95}
```

Notes:
- `meta set` is not allowed for external builds.
- If the `--external` flag did not trigger the build, then meta will not be set.

### Pull Request Comments

> Note: This feature is only available in Github plugin at the moment.

You can write comments to pull requests in Git from a Screwdriver build through using metadata. The contents of the comments should be written to the meta summary object from your pipeline's PR build.

To write out metadata to a pull request, you just need to set `meta.summary` with desired information. This data will show up as a comment in Git by a headless Git user.

For example, to add a coverage description, your screwdriver.yaml should look something like below:

```
jobs:
  main:
    steps:
      - comment: meta set meta.summary.coverage "Coverage increased by 15%"
```

You can also write things in markdown syntax as shown in the following example:
```
jobs:
  main:
    steps:
      - comment: meta set meta.summary.markdown "this markdown comment is **bold** and *italic*"
```
These settings will result in a Git comment that looks like:

![PR comment](./assets/pr-comment.png)

### Additional Pull Request Checks

> Note: This feature is only available in Github plugin at the moment.

You can also add additional status checks to pull requests to provide more granular information about the pull request build.

To additional checks to a pull request, you just need to set `meta.status.<check>` with desired information in JSON string format. This data will show up as a Git check on the pull request.

The fields you can set:

| Key | Description |
| --- | ----------- |
| status (String) | Status of the check, can be one of: (`SUCCESS`, `FAILURE`) |
| message (String) | Description for the check |
| url (String) | Url for the check to link to (default: build link)

For example, to add two additional checks for `findbugs` and `coverage`, your screwdriver.yaml should look something like below:

```
jobs:
  main:
    steps:
      - status: |
          meta set meta.status.findbugs '{"status":"FAILURE","message":"923 issues found. Previous count: 914 issues.","url":"http://findbugs.com"}'
          meta set meta.status.coverage '{"status":"SUCCESS","message":"Coverage is above 80%."}'
```

These settings will result in Git checks that look like:

![PR checks](./assets/pr-checks.png)
