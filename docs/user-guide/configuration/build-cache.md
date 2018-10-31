---
layout: main
title: Build Cache
category: User Guide
menu: menu
toc:
    - title: Build Cache
      url: "#build-cache"
    - title: Example
      url: "#example"
    - title: Notes
      url: "#notes"
---
# Build Cache
Top-level setting that contains file paths from your build that you would like to cache. The cache is stored in a build's teardown bookend and restored in a build's setup bookend. You can limit access to the cache using the pipeline, event or job scope.

| Scope  | Access |
|---|---|
| pipeline  | All builds in the same pipeline  |
| event  | All builds in the same event  |
| job  | All builds for the same job  |

## Example

```yaml
cache:
   event:
       - $SD_SOURCE_DIR/node_modules
   pipeline:
       - ~/.gradle
   job:
       test-job: [/tmp/test]

jobs:
    usenpmcache:
        image: node:6
        steps:
            - install: npm install
        requires: [~commit, ~pr]
    usegradlecache:
        image: java:7
        steps:
            - ls: ls ~/
            - install: git clone https://github.com/gradle-guides/gradle-site-plugin.git && cd gradle-site-plugin && ./gradlew build
        requires: [~commit, ~pr]
```

In the above example, we cache the `node_modules` folder under the event scope so that subsequent builds within the same event can save time on `npm install`. Similarly, the pipeline-scoped `.gradle` cache can be access under all other builds in the pipeline to save time on `gradle install`.


## Notes

- To run the backend store service, please ensure it has enough available memory.
- For cache cleanup, we use AWS S3 [Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html). If your store service is not configured to use S3, you might need to add a cleanup mechanism.
