---
layout: main
title: Environment
category: User Guide
menu: menu
toc:
    - title: Environment
      url: "#environment"
    - title: Limitations
      url: "#limitations"
---
# Environment
A set of key/value pairs for environment variables that need to available in a build. If an environment variable is set in both shared and a specific job, the value from the job configuration will be used.

## Limitations
- Nested environment variables do not work under the `environment` section.
- Environment variables are evaluated in the order in which they are defined under the same `environment` section.
- Environment variables are evaluated in the order in which they were declared: `template` > `shared` > `jobs`.

#### Example

```yaml
shared:
    template: example/mytemplate@stable
    environment:
        FOO: bar
        MYVAR: ${FOO}        # This will set MYVAR=bar in all builds
jobs:
    main:
        requires: [~pr, ~commit]
        environment:
            FOO: baz        # This will set FOO=baz, MYVAR=baz in the build
    main2:
        requires: [main]
        environment:        # Due to the above shared section, FOO=bar in the build
            MYVAR: hello    # This will set MYVAR=hello in the build
```

Environment variables containing dot notations are not allowed, like:

```yaml
shared:
    environment:
        X.Y: "Z"
```
