#!/bin/bash -e

source ./ci/git-ssh.sh
mkdir _deploy
cd _deploy
sd-step exec core/git 'git clone -b gh-pages git@github.com:screwdriver-cd/guide.git'
cd guide
rm -rf *
cp -R ../../_site/* .
sd-step exec core/git 'git add -A'
sd-step exec core/git 'git commit -m "Deployed by Screwdriver"'
sd-step exec core/git 'git push origin gh-pages'
cd ../..
rm -rf _deploy
