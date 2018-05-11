---
layout: main
title: Coverage
category: User Guide
menu: menu
toc:
    - title: Coverage
      url: "#coverage"
---
# Coverage

Builds can upload coverage data after they are run.
We currently support [SonarQube](https://github.com/screwdriver-cd/coverage-sonar) for coverage bookends.

## SonarQube

To use SonarQube, add a `sonar-project.properties` file in the root of your source code and add configurations there.

Example `sonar-project.properties` file:
```
sonar.sources=lib
sonar.javascript.lcov.reportPath=artifacts/coverage/lcov.info
```

Alternatively, you can add configurations to the environment variable `$SD_SONAR_OPTS`.

Example `screwdriver.yaml`:

```yaml
shared:
    environment:
        SD_SONAR_OPTS: '-Dsonar.sources=lib -Dsonar.sourceEncoding=UTF-8'
jobs:
    main:
        requires: [~pr, ~commit]
        image: node:8
        steps:
            - echo: echo hi
```

_Note: Sonar `projectVersion` will be set to your `$SD_BUILD_SHA`._

### Related links
- [Java example](https://github.com/screwdriver-cd-test/sonar-coverage-example-java)
- [Javascript example](https://github.com/screwdriver-cd-test/sonar-coverage-example-javascript)
- [Examples from the SonarQube website](https://github.com/SonarSource/sonar-scanning-examples)
- [SonarQube docs](https://docs.sonarqube.org/display/SCAN)
