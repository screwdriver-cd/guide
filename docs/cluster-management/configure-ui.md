# Managing the User Interface

## Packages

Like the other services, the User Interface is shipped as a [Docker image](https://hub.docker.com/r/screwdrivercd/ui/) with port 80 exposed.

```bash
$ docker run -d -p 8000:80 screwdrivercd/ui:stable
$ open http://localhost:8000
```

Our images are tagged for their version (eg. `1.2.3`) as well as a floating `latest` and `stable`.  Most installations should be using `stable` or the fixed version tags.

## Configuration

The User Interface only has one configuration option, the location of the API.  It is set via an environment variable `ECOSYSTEM_API`.

Example:
```bash
$ docker run -d -p 8000:80 -e ECOSYSTEM_API=http://localhost:9000 screwdrivercd/ui:stable
```
