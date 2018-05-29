---
layout: main
title: Templates
category: User Guide
menu: menu
toc:
    - title: Templates
      url: "#templates"
    - title: Using a template
      url: "#using-a-template"
    - title: Creating a template
      url: "#creating-a-template"
    - title: Finding templates
      url: "#finding-templates"
---
# Templates

Templates are snippets of predefined code that people can use to replace a job definition in a [screwdriver.yaml](./configuration). A template contains a series of predefined steps along with a selected Docker image.

## Using a template

To use a template, define a `screwdriver.yaml`:

```yaml
jobs:
    main:
        template: template_name@1.3.0
```

Screwdriver takes the template configuration and plugs it in, so that the `screwdriver.yaml` becomes:

```yaml
jobs:
    main:
        image: node:6
        requires: [~pr, ~commit]
        steps:
          - install: npm install
          - test: npm test
          - echo: echo $FOO
        environment:
           FOO: bar
        secrets:
          - NPM_TOKEN
```

### Wrap
Wrapping is when you add commands to run before and/or after an existing step. To wrap a step from a template, add a `pre` or `post` in front of the step name.

Example:
```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        template: template_name@1.3.0
        steps:
            - preinstall: echo pre-install
            - postinstall: echo post-install
```

This will run the command `echo pre-install` before the template's `install` step, and `echo post-install` after the template's `install` step.

### Replace
To replace a step from a template, add your command with the same template's step name.

Example:
```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        template: template_name@1.3.0
        steps:
            - install: echo skip installing
```

This will run the command `echo skip installing` for the `install` step.

You can also replace the image defined in the template. Some of the steps in the template could assume commands or environment invariants that your image may not have, so use this replacement judiciously.

Example:
```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        image: my_org/my_image:latest
        template: template_name@1.3.0
```

## Creating a template

### Writing a template yaml

To create a template, create a new repo with a `sd-template.yaml` file. The file should contain a name, version, description, maintainer email, and a config with an image and steps. An optional images directive can be defined to list supported images with a descriptive label.

Example `sd-template.yaml`:

```yaml
name: template_name
version: '1.3'
description: template for testing
maintainer: foo@bar.com
config:
    image: node:6
    images:
        stable-image: node:6
        latest-image: node:7
    steps:
        - install: npm install
        - test: npm test
        - echo: echo $FOO
    environment:
        FOO: bar
    secrets:
        - NPM_TOKEN
```

### Writing a screwdriver.yaml for your template repo

To validate your template, run the `template-validate` script from the `screwdriver-template-main` npm module in your `main` job to validate your template. This means the build image must have NodeJS and NPM properly installed to use it. To publish your template, run the `template-publish` script from the same module in a separate job.

To remove your template, run the `template-remove` script. You will need to provide the template name as an argument.

By default, the file at `./sd-template.yaml` will be read. However, a user can specify a custom path using the env variable: `SD_TEMPLATE_PATH`.

#### Tagging templates
You can optionally tag a specific template version by running the `template-tag` script from the `screwdriver-template-main` npm package. This must be done by the same pipeline that your template is created by. You will need to provide arguments to the script: template name and tag. You can optionally specify a version; the version needs to be an exact version. If the version is omitted, the most recent version will be tagged.

To remove a template tag, run the `template-remove-tag` script. You will need to provide the template name and tag as arguments.

Example `screwdriver.yaml`:

```yaml
shared:
    image: node:6
jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - install: npm install screwdriver-template-main
            - validate: ./node_modules/.bin/template-validate
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    publish:
        requires: [main]
        steps:
            - install: npm install screwdriver-template-main
            - publish: ./node_modules/.bin/template-publish
            - autotag: ./node_modules/.bin/template-tag --name template_name --tag latest
            - tag: ./node_modules/.bin/template-tag --name template_name --version 1.3.0 --tag stable
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    remove:
        steps:
            - install: npm install screwdriver-template-main
            - remove: ./node_modules/.bin/template-remove --name template_name
    remove_tag:
        steps:
            - install: npm install screwdriver-template-main
            - remove_tag: ./node_modules/.bin/template-remove-tag --name template_name --tag stable
```

Create a Screwdriver pipeline with your template repo and start the build to validate and publish it.

To update a Screwdriver template, make changes in your SCM repository and rerun the pipeline build.

## Finding templates

To figure out which templates already exist, you can make a `GET` call to the `/templates` endpoint. See the [API documentation](./api) for more information. There should also be a `/templates` endpoint in the UI.
