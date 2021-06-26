# Screwdriver Guide
[![Build Status][status-image]][status-url] [![Open Issues][issues-image]][issues-url]

> Documentation for the Screwdriver CD service

Screwdriver is a self-contained, pluggable service to help you build, test, and continuously deliver software using the latest containerization technologies.

## To start using Screwdriver

For more information about Screwdriver, check out our [homepage](https://screwdriver.cd).

## To start contributing to Screwdriver

Have a look at our guidelines, as well as pointers on where to start making changes, in our [contributing guide](http://docs.screwdriver.cd/about/contributing).


The guide is powered by Jekyll. There are two ways to run Jekyll: via Docker and via installation.

### Running Jekyll using Docker

1. Install [docker-desktop](https://www.docker.com/products/docker-desktop) if you haven't already.
1. Ensure Docker is running with `docker info`; if not, then on Mac, you can launch easily using `open -a /Applications/Docker.app/`. Launching on CLI (rather than double-clicking) has advantage of exporting your `$SSH_AUTH_SOCK` and `ssh-agent` will work properly, should you need it at some point.
1. Run the Jekyll Docker image with mount of `$PWD` to its serving location and with `-ti` so `^C` will kill it.
   ```bash
   docker run -v $PWD:/srv/jekyll:rw -p 4080:4000 -it jekyll/jekyll jekyll serve --source docs --destination _site
   ```

### Running Jekyll by installing

In order to install Jekyll you'll need Ruby, the Ruby package manager (RubyGems), and bundle to install and run Jekyll. You can check if you have these already installed like so:

```bash
$ ruby --version
ruby 2.4.1
$ gem --version
2.6.12
$ bundle --version
Bundler version 1.15.1
```

Jekyll supports Ruby version 2.1 or above.

You can also build and serve the documentation using Docker (see below). If you choose this approach, there is no need to install Ruby/bundle/jekyll.

### Standard

To install the `jekyll` using bundle, making sure we're in the same directory as the `Gemfile`.

Install the `jekyll` package using bundler:

```bash
bundle install
```

You should now have the `jekyll` command installed on your system. Run `bundle exec jekyll --version` to check that everything worked okay.

```bash
$ bundle exec jekyll --version
jekyll 3.8.4
```

## Viewing docs locally
There's a single configuration file named `_config.yml`, and a folder named `docs` that will contain our documentation source files.

Jekyll comes with a built-in webserver that lets you preview your documentation as you work on it. You can start the webserver locally with Jekyll directly.

### Standard

Jekyll comes with a built-in webserver that lets you preview your documentation as you work on it. We start the webserver by making sure we're in the same directory as the `docs` folder, and then running the `bundle exec jekyll serve --source docs --destination _site` command:

```bash
$ bundle exec jekyll serve --source docs --destination _site
Configuration file: docs/_config.yml
            Source: docs
       Destination: _site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 2.251 seconds.
 Auto-regeneration: enabled for 'docs'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

### Docker

If you don't have Ruby installed, you can easily build and view the Screwdriver Guide using Docker. From the root directory
of the repository, execute:

```bash
docker run --rm \
  --volume="$PWD:/srv/jekyll" -p 4000:4000 \
  -it jekyll/builder:3.8 \
  jekyll serve --source docs --destination _site
```

This may take some time as it must download all gems specified in the Gemfile on every run. If you need to rebuild the
guide frequently, you could simply commit your changes and work from your commited image containing all dependencies.

For example:

```bash
docker run --volume ... --destination _site # be sure to leave off --rm
docker commit $(docker ps -q -a |head -n 1 | awk '{print $1}') cached-jekyll

# will already contain all installed gems: should be much faster!
docker run --rm \
  --volume="$PWD:/srv/jekyll" -p 4000:4000 \
  -it cached-jekyll \
  jekyll serve --source docs --destination _site
```

### Browse your local guide

Once you successfully start the webserver, open up [http://127.0.0.1:4000/](http://127.0.0.1:4000/) in your browser. You'll be able to see the index page being displayed.
And you'll also be able to see the other language index page open up http://127.0.0.1:4000/:lang/ in your browser.
For example, open up [http://127.0.0.1:4000/ja/](http://127.0.0.1:4000/ja/) in your browser, you'll be able to see the Japanese index page being displayed.

## Adding docs
Simply add a new markdown document to the folder hierarchy in `docs`, and add an entry to the tree in `docs/_data/menu.yaml`

## Documentation Structure

- Homepage
  - [x] What are the sections for
- Cluster Management (for SD owners)
  - [x] Overall architecture
  - [x] Configuring API
     - [x] Scm plugins
     - [x] Datastore plugins
  - [x] Configuring UI
  - [x] Configuring Store
     - [x] Logging plugins
  - [X] Configuring Queue Service
  - [x] Running locally
  - [x] Configure Build
  - Examples
    - [x] Setting up Kubernetes
  - [ ] Debugging
- User Guide
  - [x] Quickstart
  - [x] API
  - [x] Authentication and Authorization
  - [x] Configuration
    - [x] Overall YAML
    - [x] Metadata
    - [x] Secrets
  - [x] Templates
  - [x] FAQ
- About
  - [x] What is SD?
  - [x] Appendix
    - [x] Domain model
    - [x] Execution engines
  - [x] Contributing
  - [x] Support


[issues-image]: https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg
[issues-url]: https://github.com/screwdriver-cd/screwdriver/issues
[status-image]: https://cd.screwdriver.cd/pipelines/27/badge
[status-url]: https://cd.screwdriver.cd/pipelines/27
