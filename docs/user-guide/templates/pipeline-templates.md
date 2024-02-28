---
layout: main
title: Pipeline Templates
category: User Guide
menu: menu
toc:
    - title: Pipeline Templates
      url: "#pipeline-templates"
    - title: Finding templates
      url: "#finding-pipeline-templates"
    - title: Using a template
      url: "#using-a-pipeline-template"
    - title: "Version/Tag Semantics"
      url: "#versiontag-semantics"
      subitem: true
    - title: Creating a template
      url: "#creating-a-template"
    - title: Writing a template yaml
      url: "#writing-a-template-yaml"
      subitem: true
    - title: Writing a screwdriver yaml
      url: "#writing-a-screwdriver-yaml-for-your-template-repo"
      subitem: true
    - title: Validating templates
      url: "#validating-templates"
      subitem: level-2
    - title: Tagging templates
      url: "#tagging-templates"
      subitem: level-2
    - title: Testing a template
      url: "#testing-a-template"
    - title: Removing a template
      url: "#removing-a-template"
---
# Pipeline Templates

Pipeline Templates are snippets of predefined configuration that people can use to define a [screwdriver.yaml](../configuration). A pipeline template contains a series of predefined jobs with steps along with a selected container image.

## Finding pipeline templates

To figure out which templates already exist, you can make a `GET` call to the `/pipeline/templates` [API](../api) endpoint.


## Using a pipeline template

To use a template, define a `screwdriver.yaml` with a `template` key. In this example, we are using the [nodejs/test template](https://cd.screwdriver.cd/templates/nodejs/test).

Example `screwdriver.yaml`:

```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        template: nodejs/test@1.0.4
```

Version is [semver](https://semver.org/) compatible. For example you can refer above template with `nodejs/test@1` or `nodejs/test@1.0`

You can also refer to a template version with a tag name if the template has one. All the versions and tags of a template are displayed at the bottom of a template's description, such as for [the example template](https://cd.screwdriver.cd/templates/nodejs/test), which has the tags `latest` and `stable`.

Most templates will tag the most recent version as `latest`, and many templates use either automated testing or manual curation to identify some version as `stable`. These are floating tags, so using them in a job means its template-provided steps may suddenly change.

If no template version is specified, the most recently published will be used. This is usually synonymous with specifying the `latest` tag. It is generally better to explicitly state a template version than to implicitly use `latest`.

The most reliable way to avoid unexpected template changes is to refer to a specific version of the template. For instance, `nodejs/test@1.0.4` is an immutable reference to a particular list of steps. Using a reference such as `nodejs/test@1.0` means that a job will automatically use `nodejs/test@1.0.5` when it becomes available, but that comes with risk of an unexpected change in behavior.

## Version/Tag Semantics

Template versions can be referenced in a variety of ways that express users' trade-off between an unchanging set of steps and automatically using improvements that a template's maintainers have added. As above, these examples reference [nodejs/test template](https://cd.screwdriver.cd/templates/nodejs/test).

* `nodejs/test@latest` - this will use the most recently published version of the template, which may include backwards-incompatible changes, major version changes, etc. The `latest` tag should primarily be used by a template's maintainers and may be unsuitable for production or similarly important builds.
* `nodejs/test@stable` - this will use a version of the template that its maintainers have designated as sufficiently stable for general usage. It may represent a significant change in capability from older uses of the `stable` tag. Template maintainers should communicate to users when changes to the `stable` tag are not backwards compatible.
* `nodejs/test@1` - this will use the most recent version of `nodejs/test` that is less than 2.0.0. This is essentially the `latest` tag without crossing a major version boundary.
* `nodejs/test@1.0` - this will use the most recent version of `nodejs/test` than is less than 1.1.0. This is essentially the `latest` tag without crossing a minor version boundary.
* `nodejs/test@1.0.4` - this is the most predictable way to specify a pipeline's behavior and is not affected by future changes to the template.

#### Example

For this configuration:
```yaml
template: nodejs/test@stable
shared: 
  environment:
    FOO: bar
```


Screwdriver takes the template configuration and plugs it in, so that the `screwdriver.yaml` becomes:

```yaml
shared:
  environment:
    FOO: bar
jobs:
    main:
      image: node:18
      requires: [~pr, ~commit]
      steps:
        - install: npm install
        - test: npm test
      secrets:
            - NPM_TOKEN
```

## Creating a template

Publishing and running pipeline templates must be done from a Screwdriver pipeline.

### Writing a template yaml

To create a template, create a new repo with a `sd-template.yaml` file. The file should contain a namespace, name, version, description, maintainer email, and a config with jobs. Basic example can be found in our [screwdriver-cd-test/pipe;line-template-example repo](https://github.com/screwdriver-cd-test/pipeline-template-example).

Example `sd-template.yaml`:

```yaml
namespace: myNamespace
name: template_name
version: '1.3'
description: pipeline template for testing
maintainer: foo@bar.com
config:
    jobs:
      main:
        requires: [~pr, ~commit]
        steps:
          - install: npm install
          - test: npm test
        environment:
            FOO: bar
        secrets:
            - NPM_TOKEN
```

### Writing a screwdriver yaml for your template repo

#### Validating templates

To validate your template, run the `pipeline-template-validate` script from the `screwdriver-template-main` npm module in your `main` job to validate your template. This means the build image must have NodeJS and NPM properly installed to use it. To publish your template, run the `pipeline-template-publish` script from the same module in a separate job.

By default, the file at `./sd-template.yaml` will be read. However, a user can specify a custom path using the env variable: `SD_TEMPLATE_PATH`.

You can also validate your `sd-template.yaml` and `screwdriver.yaml` through the UI by copy pasting it at `<YOUR_UI_URL>/validator`.

#### Tagging templates
You can optionally tag a specific template version by running the `pipeline-template-tag` script from the `screwdriver-template-main` npm package. This must be done by the same pipeline that your template is created by. You will need to provide arguments to the script: template namespace, name and tag. You can optionally specify a version; the version needs to be an exact version (see `tag` step). If the version is omitted, the most recent version will be tagged (see `autotag` step).

To remove a template tag, run the `pipeline-template-remove-tag` script. You will need to provide the template name and tag as arguments.

Example `screwdriver.yaml`:

```yaml
shared:
    image: node:18
jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - install: npm install screwdriver-template-main
            - validate: ./node_modules/.bin/pipeline-template-validate
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    publish:
        requires: [main]
        steps:
            - install: npm install screwdriver-template-main
            - publish: ./node_modules/.bin/pipeline-template-publish
            - autotag: ./node_modules/.bin/pipeline-template-tag --namespace myNamespace --name template_name --tag latest
            - tag: ./node_modules/.bin/pipeline-template-tag --namespace myNamespace --name template_name --version 1.3.0 --tag stable
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    remove:
        steps:
            - install: npm install screwdriver-template-main
            - remove: ./node_modules/.bin/pipeline-template-remove --namespace myNamespace --name template_name
    remove_tag:
        steps:
            - install: npm install screwdriver-template-main
            - remove_tag: ./node_modules/.bin/pipeline-template-remove-tag --namespace myNamespace --name template_name --tag stable
```

Create a Screwdriver pipeline with your template repo and start the build to validate and publish it.

To update a Screwdriver template, make changes in your SCM repository and rerun the pipeline build.

## Testing a template

In order to test your template, set up a remote test for your template by creating another pipeline which uses your template, as seen in the [pipeline-template-test-example](https://github.com/screwdriver-cd-test/pipeline-template-test-example/blob/master/screwdriver.yaml). This example pipeline runs after the `publish_nodejs_template` is done by using the remote triggers feature.
_Note: You cannot test your template in the same pipeline, as template step expansion is done at event creation time. Therefore, the pipeline would use an older version of your template if you try to use it in the pipeline where you create it._

## Removing a template

### Using screwdriver-template-main npm package
To remove your template, you can run the `pipeline-template-remove` script. You will need to provide the template namespace and name as an argument.

