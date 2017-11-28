---
layout: main
title: Overall
category: User Guide
menu: menu
toc:
    - title: Yaml Configuration
      url: "#yaml-configuration"
      active: true
---

# Yaml Configuration

This is an interactive guide for exploring various important properties of the screwdriver.yaml configuration for projects.

You can access information about properties by hovering over the property name.

<div class="yaml-docs">

<pre class="example">
<a href="#shared"><span class="key">shared</span>:</a>
    <a href="#environment"><span class="key">environment</span>:
    <span class="key">NODE_ENV</span>: <span class="value">test</span></a>
    <a href="#settings"><span class="key">settings</span>:</a>
        <a href="#email"><span class="key">email</span>:
    <span class="key">addresses</span>: <span class="value">[test@email.com, test2@email.com]</span>
    <span class="key">statuses</span>: <span class="value">[SUCCESS, FAILURE]</span></a>
    <a href="#annotations"><span class="key">annotations</span>:
    <span class="key">beta.screwdriver.cd/my-cluster-annotation</span>: <span class="value">my-data</span></a>
        <a href="#executor"><span class="key">beta.screwdriver.cd/executor</span>: <span class="value">k8s-vm</span></a>
        <a href="#cpu"><span class="key">beta.screwdriver.cd/cpu</span>: <span class="value">HIGH</span></a>
        <a href="#ram"><span class="key">beta.screwdriver.cd/ram</span>: <span class="value">LOW</span></a>
<a href="#jobs"><span class="key">jobs</span>:</a>
      <span class="key">main</span>:
        <a href="#requires"><span class="key">requires</span>: <span class="value">[~pr, ~commit, ~sd@123:main]</span></a>
        <a href="#image"><span class="key">image</span>: <span class="value">node:6</span></a>
        <a href="#steps"><span class="key">steps</span>:
    - <span class="key">init</span>: <span class="value">npm install</span>
    - <span class="key">test</span>: <span class="value">npm test</span></a>
    <a href="#jobs"><span class="key">publish</span>:
    <span class="key">requires</span>: <span class="value">main</span>
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">steps</span>:
        - <span class="key">publish</span>: <span class="value">npm publish</span></a>
    <a href="#jobs"><span class="key">deploy-west</span>:
    <span class="key">requires</span>: <span class="value">publish</span>
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">environment</span>:
        <span class="key">DEPLOY_ENV</span>: <span class="value">west</span>
    <span class="key">steps</span>:
        - <span class="key">init</span>: <span class="value">npm install</span>
        - <span class="key">deploy</span>: <span class="value">npm deploy</span></a>
    <a href="#jobs"><span class="key">deploy-east</span>:
    <span class="key">requires</span>: <span class="value">publish</span>
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">environment</span>:
        <span class="key">DEPLOY_ENV</span>: <span class="value">east</span>
    <span class="key">steps</span>:
        - <span class="key">init</span>: <span class="value">npm install</span>
        - <span class="key">deploy</span>: <span class="value">npm deploy</span></a>
    <a href="#jobs"><span class="key">finished</span>:
    <span class="key">requires</span>: <span class="value">[deploy-west, deploy-east]</span>
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">steps</span>:
        - <span class="key">echo</span>: <span class="value">echo done</span></a>
    <a href="#jobs">...</a>
</pre>
    <div class="yaml-side">
        <div id="requires" class="hidden">
            <h4>Requires</h4>
            <p>A single job name or array of jobs that will trigger the job to run. Jobs defined with "requires: ~pr" are started by pull-request events. Jobs defined with "requires: ~commit" are started by push events. Jobs defined with "requires: ~sd@123:main" are started by job "main" from pipeline "123". Jobs defined with "requires: [deploy-west, deploy-east] are started after "deploy-west" and "deploy-east" are both done running successfully. "Note: ~ jobs denote an OR functionality, jobs without a ~ denote join functionality.</p>
        </div>
        <div id="shared" class="hidden">
            <h4>Shared</h4>
            <p>Defines a global configuration that applies to all jobs. Shared configurations are merged with each job, but may be overridden by more specific configuration in a specific job.</p>
        </div>
        <div id="environment" class="hidden">
            <h4>Environment</h4>
            <p>A set of key/value pairs for environment variables that need to be set. Any configuration that is valid for a job configuration is valid in shared, but will be overridden by specific job configurations.</p>
        </div>
        <div id="settings" class="hidden">
            <h4>Settings</h4>
            <p>Configurable settings for any additional build plugins added to Screwdriver.cd.</p>
        </div>
        <div id="annotations" class="hidden">
            <h4>Annotations</h4>
            <p>Annotations is an optional object containing key-value pairs. These can be either pipeline or job-level specifications. Annotation key-value pairs can be completely arbitrary, as in the example, or can modify the execution of the build. Check with your screwdriver cluster admin to find what annotations are supported to modify your build execution.</p>
        </div>
        <div id="executor" class="hidden">
            <h4>Executor annotation</h4>
            <p>Used to designate a non-default executor to run the build. Some available executors are `jenkins`, `k8s-vm`</p>
        </div>
        <div id="cpu" class="hidden">
            <h4>CPU annotation</h4>
            <p>CPU allocated for the VM if using `k8s-vm` executor. `LOW` is configured by default, and indicates 2CPU memory. `HIGH` means 6CPU.</p>
        </div>
        <div id="ram" class="hidden">
            <h4>RAM annotation</h4>
            <p>RAM allocated for the VM if using `k8s-vm` executor. `LOW` is configured by default, and indicates 2GB memory. `HIGH` means 12GB memory.</p>
        </div>
        <div id="email" class="hidden">
            <h4>Email</h4>
            <p>Emails addresses to send notifications to and statuses to send notifications for.</p>
        </div>
        <div id="jobs" class="hidden">
            <h4>Jobs</h4>
            <p>A series of jobs that define the behavior of your builds.</p>
        </div>
        <div id="image" class="hidden">
            <h4>Image</h4>
            <p>This defines the Docker image used for the builds. This value should be the same as you would use for a "docker pull" command.</p>
        </div>
        <div id="steps" class="hidden">
            <h4>Steps</h4>
            <p>Defines the explicit list of commands that are executed in the build, just as if they were entered on the command line. Environment variables will be passed between steps, within the same job. Step definitions are required for all jobs. Step names cannot start with `sd-`, as those steps are reserved for Screwdriver steps. In essence, Screwdriver runs `/bin/sh` in your terminal then executes all the steps; in rare cases, different terminal/shell setups may have unexpected behavior.</p>
        </div>
    </div>
</div>
