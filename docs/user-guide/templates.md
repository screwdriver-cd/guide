---
layout: main
title: Templates
category: User Guide
menu: menu
toc:
    - title: Templates
      url: "#templates"
    - title: Finding templates
      url: "#finding-templates"
    - title: Using a template
      url: "#using-a-template"
    - title: Creating a template
      url: "#creating-a-template"
    - title: Testing a template
      url: "#testing-a-template"
    - title: Using the build cache
      url: "#using-the-build-cache"
    - title: Removing a template
      url: "#removing-a-template"
---
# Templates

Templates are snippets of predefined code that people can use to replace a job definition in a [screwdriver.yaml](./configuration). A template contains a series of predefined steps along with a selected Docker image.

## Finding templates

To figure out which templates already exist, you can make a `GET` call to the `/templates` [API](./api) endpoint. You can also see templates in the UI at `<YOUR_UI_URL>/templates`.

Example templates page:
![Templates](assets/templates.png)

## Using a template

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

If no template version is specified, the most recently published will be used. This is usually synonymous with specifying the `latest` tag. It is generally better to explicitly state a template version than to implictly use `latest`.

The most reliable way to avoid unexpected template changes is to refer to a specific version of the template. For instance, `nodejs/test@1.0.4` is an immutable reference to a particular list of steps. Using a reference such as `nodejs/test@1.0` means that a job will automatically use `nodejs/test@1.0.5` when it becomes available, but that comes with risk of an unexpected change in behavior.

## Version/Tag Semantics

Template versions can be referenced in a variety of ways that express users' trade-off between an unchanging set of steps and automatically using improvements that a template's maintainers have added. As above, these examples reference [nodejs/test template](https://cd.screwdriver.cd/templates/nodejs/test).

* `nodejs/test@latest` - this will use the most recently published version of the template, which may include backwards-incompatible changes, major version changes, etc. The `latest` tag should primarily be used by a template's maintainers and may be unsuitable for production or similarly important builds.
* `nodejs/test@stable` - this will use a version of the template that its maintainers have designated as sufficiently stable for general usage. It may represent a significant change in capability from older uses of the `stable` tag. Template maintainers should communicate to users when changes to the `stable` tag are not backwards compatible.
* `nodejs/test@1` - this will use the most recent version of `nodejs/test` that is less than 2.0.0. This is essentially the `latest` tag without crossing a major version boundary.
* `nodejs/test@1.0` - this will use the most recent version of `nodejs/test` than is less than 1.1.0. This is essentially the `latest` tag without crossing a minor version boundary.
* `nodejs/test@1.0.4` - this is the most predictable way to specify a pipeline's behavior and is not affected by future changes to the template.

## Example

For this configuration:
```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        template: nodejs/test@stable
```


Screwdriver takes the template configuration and plugs it in, so that the `screwdriver.yaml` becomes:

```yaml
jobs:
    main:
        image: node:8
        requires: [~pr, ~commit]
        steps:
          - install: npm install
          - test: npm test
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
        template: nodejs/test@1.0.3
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
        template: nodejs/test@1.0.3
        steps:
            - install: echo skip installing
```

This will run the command `echo skip installing` for the `install` step.

You can also replace the image defined in the template. Some template steps might rely on commands or environment invariants that your image may not have, so be careful when replacement.

Example:
```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        image: alpine
        template: nodejs/test@1.0.3
```

## Creating a template

Publishing and running templates must be done from a Screwdriver pipeline.

### Writing a template yaml

To create a template, create a new repo with a `sd-template.yaml` file. The file should contain a namespace, name, version, description, maintainer email, and a config with an image and steps. If no namespace is specified, a 'default' namespace will be applied. An optional `images` keyword can be defined to list supported images with a descriptive label. Basic example can be found in our [screwdriver-cd-test/template-example repo](https://github.com/screwdriver-cd-test/template-example).

Example `sd-template.yaml`:

```yaml
namespace: myNamespace
name: template_name
version: '1.3'
description: template for testing
maintainer: foo@bar.com
images:
    stable-image: node:6
    latest-image: node:8
config:
    image: node:6
    steps:
        - install: npm install
        - test: npm test
    environment:
        FOO: bar
    secrets:
        - NPM_TOKEN
```

#### Template images
We recommend using the `images` feature, which can be configured to list supported images with a descriptive label or alias.

For example:
```yaml
namespace: myNamespace
name: template_name
version: '1.3'
description: template for testing
maintainer: foo@bar.com
images:
    stable-image: node:6
    latest-image: node:8
```

Users can pick an alias from the list and use it like so:
```yaml
jobs:
    main:
        template: myNamespace/template_name@1.3.0
        image: stable-image
```

Example repo: https://github.com/screwdriver-cd-test/template-images-example

#### Template Steps
Avoid using any [wrapping](#using-a-template) prefixes (`pre` or `post`) in your step names, as it can lead to problems when users try to modify or enhance your steps. For example, if a template has these steps:

```yaml
config:
    image: node:6
    steps:
        - preinstall: echo Installing
        - install: npm install
        - test: npm test
```

And a user consumes that template with some additional steps:
```yaml
jobs:
    main:
        template: myNamespace/template_name@1.3.0
        steps:
          - preinstall: echo foo
```
It becomes unclear whether the user was trying to override `preinstall` or wrap `install`.

### Writing a screwdriver.yaml for your template repo

To validate your template, run the `template-validate` script from the `screwdriver-template-main` npm module in your `main` job to validate your template. This means the build image must have NodeJS and NPM properly installed to use it. To publish your template, run the `template-publish` script from the same module in a separate job.

By default, the file at `./sd-template.yaml` will be read. However, a user can specify a custom path using the env variable: `SD_TEMPLATE_PATH`.

#### Tagging templates
You can optionally tag a specific template version by running the `template-tag` script from the `screwdriver-template-main` npm package. This must be done by the same pipeline that your template is created by. You will need to provide arguments to the script: template name and tag. You can optionally specify a version; the version needs to be an exact version (see `tag` step). If the version is omitted, the most recent version will be tagged (see `autotag` step).

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
            - autotag: ./node_modules/.bin/template-tag --name myNamespace/template_name --tag latest
            - tag: ./node_modules/.bin/template-tag --name myNamespace/template_name --version 1.3.0 --tag stable
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    remove:
        steps:
            - install: npm install screwdriver-template-main
            - remove: ./node_modules/.bin/template-remove --name myNamespace/template_name
    remove_tag:
        steps:
            - install: npm install screwdriver-template-main
            - remove_tag: ./node_modules/.bin/template-remove-tag --name myNamespace/template_name --tag stable
```

Create a Screwdriver pipeline with your template repo and start the build to validate and publish it.

To update a Screwdriver template, make changes in your SCM repository and rerun the pipeline build.

## Testing a template

In order to test your template, set up a remote test for your template by creating another pipeline which uses your template, as seen in the [template-test-example](https://github.com/screwdriver-cd-test/template-test-example/blob/master/screwdriver.yaml). This example pipeline runs after the `publish_nodejs_template` is done by using the remote triggers feature.
_Note: You cannot test your template in the same pipeline, as template step expansion is done at event creation time. Therefore, the pipeline would use an older version of your template if you try to use it in the pipeline where you create it._

## Using the build cache

To use the [build cache feature](./configuration/build-cache.md), the [store-cli command](https://github.com/screwdriver-cd/store-cli) can be invoked in a step. For instance, if you are caching your `node_modules/` folder, you can specify a step before the `npm install` command that downloads the cache and another step afterwards that uploads the cache. You can also move the uploading cache step to a teardown with the `teardown-` prefix.

```yaml
config:
    image: node:8
    steps:
        - getcache: store-cli get node_modules/ --type=cache --scope=event || echo "Failed to fetch Cache"
        - install: npm install
        - teardown-putcache: store-cli set node_modules/ --type=cache --scope=event || echo "Failed to publish Cache"
```

## Removing a template

### Using screwdriver-template-main npm package
To remove your template, you can run the `template-remove` script. You will need to provide the template name as an argument.

### Using the UI
Or, you can remove your template and all its associated tags and versions by clicking on the trash icon in the UI on the template page.

_Note: Do not delete your template pipeline beforehand, because it is required to determine who has permission to delete the template._

![Removing](assets/delete-template.png)
