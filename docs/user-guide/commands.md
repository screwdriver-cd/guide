---
layout: main
title: Commands
category: User Guide
menu: menu
toc:
    - title: Commands
      url: "#commands"
    - title: Using a command
      url: "#using-a-command"
    - title: Creating a command
      url: "#creating-a-command"
    - title: Finding commands
      url: "#finding-commands"
    - title: More links
      url: "#more-links"
---
# Commands

Screwdriver commands are executables which can either be a group of [commands](https://en.wikipedia.org/wiki/Command_(computing)) in a script or a binary that people can use to replace a step definition in a [screwdriver.yaml](./configuration).

## Using a command

To use a command, define a `screwdriver.yaml` that uses the `sd-cmd` cli with the format:

```
$ sd-cmd exec <namespace>/<name>@<version> <arguments>
```

__Input:__

- `namespace/name` - the fully-qualified command name
- `version` - a semver-compatible format or tag
- `arguments` - passed directly to the underlying format

__Output:__

All debug logs about the command lookup and execution are stored in `$SD_ARTIFACTS_DIR/.sd/commands/namespace/name/version/timestamp.log`

Example:
```yaml
jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - exec: sd-cmd exec foo/bar@1 -baz sample
```

Screwdriver will download that binary or script from the Store, make it executable, and run it with the `-baz sample` arguments directly:
```
$ /opt/sd/commands/foo/bar/1.0.1/foobar.sh -baz sample
```

## Creating a command

Publishing and running commands must be done from a Screwdriver pipeline.

### Writing a command yaml

To create a command, create a repo with a `sd-command.yaml` file. The file should contain a namespace, name, version, description, maintainer email, format, and a config that depends on a format.

Example `sd-command.yaml`:

Binary example:
```yaml
namespace: foo # Namespace for the command
name: bar # Command name
version: '1.0' # Major and Minor version number (patch is automatic), must be a string
description: |
  Lorem ipsum dolor sit amet.
maintainer: foo@bar.com # Maintainer of the command
format: binary # Format the command is in (binary, habitat)
binary:
    file: ./foobar.sh # Path to script or binary file from repository root
```

Remote Habitat example:
```yaml
namespace: foo # Namespace for the command
name: bar # Command name
version: '1.0' # Major and Minor version number (patch is automatic), must be a string
description: |
  Lorem ipsum dolor sit amet.
maintainer: foo@bar.com # Maintainer of the command
format: habitat
habitat:
    package: core/node8 # Package of the Habitat command
    mode: remote # Mode the Habitat command (remote, local)
    command: node # Executable of the Habitat command
```

Local Habitat example:
```yaml
namespace: foo # Namespace for the command
name: bar # Command name
version: '1.0' # Major and Minor version number (patch is automatic), must be a string
description: |
  Lorem ipsum dolor sit amet.
maintainer: foo@bar.com # Maintainer of the command
format: habitat # Format the command is in (binary, habitat)
habitat:
    package: core/node8 # Package of the Habitat command
    mode: local # Mode of the Habitat command (remote, local)
    file: ./foobar.hart # Path to the .hart file from repository root
    command: node # Executable of the Habitat command
```

### Writing a screwdriver.yaml for your command repo

To validate your command, run the `sd-cmd validate` command. `-f` stands for file (default `sd-command.yaml`).

To publish your command, run the `sd-cmd publish` command in a separate job. `-f` stands for file (default `sd-command.yaml`). `-t` stands for tag (default `latest`).

To tag your command, run the `sd-cmd promote` command with the format: `sd-cmd promote <namespace>/<name> <version> <tag>`

Example `screwdriver.yaml`:
```yaml
shared:
    image: node:8
jobs:
    main:
        requires: [~pr, ~commit]
        steps:
            - validate: sd-cmd validate -f sd-command.yaml
    publish:
        requires: [main]
        steps:
            - publish: sd-cmd publish -f sd-command.yaml -t latest
    promote:
        requires: [publish]
        steps:
            - publish: sd-cmd promote foo/bar 1.0.1 -t stable
```

## Finding commands

To figure out which commands already exist, you can make a `GET` call to the `/commands` endpoint. See the [API documentation](./api) for more information.

## More links
- [Design specifications](https://github.com/screwdriver-cd/screwdriver/blob/master/design/commands.md)*

_*May be out of date._
