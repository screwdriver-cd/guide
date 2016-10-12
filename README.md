# Screwdriver Guide
[![Build Status][status-image]][status-url] [![Open Issues][issues-image]][issues-url]

## Installation of MkDocs
In order to install MkDocs you'll need Python installed on your system, as well as the Python package manager, pip. You can check if you have these already installed like so:

```bash
$ python --version
Python 2.7.2
$ pip --version
pip 1.5.2
```

MkDocs supports Python 2.6, 2.7, 3.3, 3.4 and 3.5.

Install the `mkdocs` package and our theme using pip:

```bash
pip install -r requirements.txt
```

You should now have the `mkdocs` command installed on your system. Run `mkdocs --version` to check that everything worked okay.

```bash
$ mkdocs --version
mkdocs, version 0.15.3
```

## Viewing docs locally
There's a single configuration file named `mkdocs.yml`, and a folder named `docs` that will contain our documentation source files.

MkDocs comes with a built-in webserver that lets you preview your documentation as you work on it. We start the webserver by making sure we're in the same directory as the `mkdocs.yml` config file, and then running the `mkdocs serve` command:

```bash
$ mkdocs serve
Running at: http://127.0.0.1:8000/
```

Open up [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser, and you'll see the index page being displayed.

## Adding docs
Simply add a new markdown document to the folder hierarchy in `docs`, and add an entry to the tree in `mkdocs.yml`

## Documentation Structure

* Architecture
	* Overall
	* API
	* Execution Engines
	* Domain Model
	* Plugin Design
	* Datastores
	* Schemas
	* Authorization Model
* Getting Started
	* Setting Up a Datastore
	* Setting Up a Cluster
	* Creating a Pipeline
* Reference
	* Demo
	* Yaml Configuration
	* Metadata
	* Environment Variables
* Community
	* FAQ
	* Contributing
	* Contact/Support

[issues-image]: https://img.shields.io/github/issues/screwdriver-cd/guide.svg
[issues-url]: https://github.com/screwdriver-cd/guide/issues
[status-image]: https://cd.screwdriver.cd/pipelines/9c2af925377a0c67a0500519df9d72dcfc78d404/badge
[status-url]: https://cd.screwdriver.cd/pipelines/9c2af925377a0c67a0500519df9d72dcfc78d404
