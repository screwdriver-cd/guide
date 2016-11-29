#!/bin/bash -e

source ./ci/git-ssh.sh
mkdocs gh-deploy --clean
