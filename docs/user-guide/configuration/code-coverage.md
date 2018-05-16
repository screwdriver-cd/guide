---
layout: main
title: Code Coverage
category: User Guide
menu: menu
toc:
    - title: Code Coverage
      url: "#code-coverage"
    - title: SonarQube
      url: "#sonarqube"
---
# Code Coverage

After they're done running, builds can display code coverage percentage in the build UI and upload code coverage data.

![Coverage in build detail page](../assets/coverage.png)

We currently support [SonarQube](https://github.com/screwdriver-cd/coverage-sonar) for coverage bookends. Check with your Screwdriver cluster admin to find what coverage plugins are supported to modify your build execution with.

## SonarQube

You can configure Sonar properties in your `sonar-project.properties` file or in your screwdriver.yaml as an environment variable. The property `sonar.sources` is always required, and should be set to your source path.

### sonar-project.properties

To use SonarQube, add a `sonar-project.properties` file in the root of your source code and add configurations there.

Example `sonar-project.properties` file from our [Javascript example](https://github.com/screwdriver-cd-test/sonar-coverage-example-javascript):
```
sonar.sources=lib
sonar.javascript.lcov.reportPath=artifacts/coverage/lcov.info
```

The `reportPath` property depends on the language used. Check the [SonarQube documentation](https://docs.sonarqube.org/display/PLUG) to figure out the right syntax.

### $SD_SONAR_OPTS

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

### Notes

- If you define the same property in both the `sonar-project.properties` file and `$SD_SONAR_OPTS`, `$SD_SONAR_OPTS` will override the properties file.
- Screwdriver sets the following properties for you: `sonar.host.url`, `sonar.login`, `sonar.projectKey`, `sonar.projectName`, `sonar.projectVersion`; you must set `sonar.sources` yourself.
- `sonar.projectVersion` will be set to your `$SD_BUILD_SHA`.

### Related links
- [SonarQube properties](https://docs.sonarqube.org/display/SONAR/Analysis+Parameters)
- [Java example](https://github.com/screwdriver-cd-test/sonar-coverage-example-java)
- [Javascript example](https://github.com/screwdriver-cd-test/sonar-coverage-example-javascript)
- [Examples from the SonarQube website](https://github.com/SonarSource/sonar-scanning-examples)
- [SonarQube docs](https://docs.sonarqube.org/display/SCAN)
