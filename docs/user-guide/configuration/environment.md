---
layout: main
title: Environment
category: User Guide
menu: menu
toc:
    - title: Environment
      url: "#environment"
---
# Environment
A set of key/value pairs for environment variables that need to available in a build. If an environment variable is set in both shared and a specific job, the value from the job configuration will be used.

### Example
```
shared:
    template: example/mytemplate@stable
    environment:
        FOO: bar
        MYVAR: hello        # This will set MYVAR=hello in all builds
jobs:
    main:
        environment:
            FOO: baz        # This will set FOO=baz in the build
    main2: {}               # This will set FOO=bar in the build
```
