# Templates

Templates are snippets of predefined code that people can use to replace a job definition in a [screwdriver.yaml](./configuration/index.md). A template contains a series of predefined steps along with a selected Docker image.

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
      template: template_name@1.3.0
      steps:
          - preinstall: echo pre-install
          - postinstall: echo post-install
```

This will run the command `echo pre-install` before the template's `install` step, and `echo post-install` after the template's `install` step.

## Creating a template

### Writing a template yaml

To create a template, create a new repo with a `screwdriver-template.yaml` file. The file should contain a name, version, description, maintainer email, and a config with an image and steps.

Example `screwdriver-template.yaml`:

```yaml
name: template_name
version: '1.3'
description: template for testing
maintainer: foo@bar.com
config:
  image: node:6
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

To validate your template, run the `template-validate` script from the `screwdriver-template-main` npm module in your `main` job to validate your template. To publish your template, run the `template-publish` script from the same module in a separate job.

By default, the file at `./sd-template.yaml` will be read. However, a user can specify a custom path using the env variable: `SD_TEMPLATE_PATH`.

Example `screwdriver.yaml`:

```yaml
shared:
    image: node:6
jobs:
    # the main job is run in pull requests as well
    main:
        steps:
            - install: npm install screwdriver-template-main
            - validate: ./node_modules/.bin/template-validate
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
    publish:
        steps:
            - install: npm install screwdriver-template-main
            - publish: ./node_modules/.bin/template-publish
        environment:
            SD_TEMPLATE_PATH: ./path/to/template.yaml
```

Create a Screwdriver pipeline with your template repo and start the build to validate and publish it.

To update a Screwdriver template, make changes in your SCM repository and rerun the pipeline build.

## Finding templates

To figure out which templates already exist, you can make a `GET` call to the `/templates` endpoint. See the [API documentation](./api.md) for more information.
