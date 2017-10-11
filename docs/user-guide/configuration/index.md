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
<a href="#workflow"><span class="key">workflow</span>:
    - <span class="value">publish</span>
    - <span class="value">deploy-west</span>
</a>
<a href="#shared"><span class="key">shared</span>:</a>
    <a href="#environment"><span class="key">environment</span>:
    <span class="key">NODE_ENV</span>: <span class="value">test</span></a>
    <a href="#settings"><span class="key">settings</span>:</a>
        <a href="#email"><span class="key">email</span>:
    <span class="key">addresses</span>: <span class="value">[test@email.com, test2@email.com]</span>
    <span class="key">statuses</span>: <span class="value">[SUCCESS, FAILURE]</span></a>
    <a href="#annotations"><span class="key">annotations</span>:
    <span class="key">beta.screwdriver.cd/my-annotation</span>: <span class="value">my-data</span></a>
<a href="#jobs"><span class="key">jobs</span>:</a>
    <a href="#main-job"><span class="key">main</span>:</a>
        <a href="#image"><span class="key">image</span>: <span class="value">node:6</span></a>
        <a href="#steps"><span class="key">steps</span>:
    - <span class="key">init</span>: <span class="value">npm install</span>
    - <span class="key">test</span>: <span class="value">npm test</span></a>
    <a href="#jobs"><span class="key">publish</span>:
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">steps</span>:
        - <span class="key">publish</span>: <span class="value">npm publish</span></a>
    <a href="#jobs"><span class="key">deploy-west</span>:
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">environment</span>:
        <span class="key">DEPLOY_ENV</span>: <span class="value">west</span>
    <span class="key">steps</span>:
        - <span class="key">init</span>: <span class="value">npm install</span>
        - <span class="key">publish</span>: <span class="value">npm deploy</span></a>
    <a href="#jobs">...</a>
</pre>
    <div class="yaml-side">
        <div id="workflow" class="hidden">
            <h4>Workflow</h4>
            <p>Defines the order of jobs that are executed for the project. All jobs referenced by the workflow must be defined in the jobs section.</p>
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
            <p>Annotations is an optional object containing key-value pairs. These can be either pipeline or job-level specifications. Annotation key-value pairs can be completely arbitrary, as in the example, or can modify the execution of the build. For example, the annotation `beta.screwdriver.cd/executor` is used to designate a non-default executor to run the pipeline. Check with your screwdriver cluster admin to find what annotations are supported to modify your build execution.</p>
        </div>
        <div id="email" class="hidden">
            <h4>Email</h4>
            <p>Emails addresses to send notifications to and statuses to send notifications for.</p>
        </div>
        <div id="jobs" class="hidden">
            <h4>Jobs</h4>
            <p>A series of jobs that define the behavior of your builds.</p>
        </div>
        <div id="main-job" class="hidden">
            <h4>Main</h4>
            <p>The only required job. This job is executed automatically whenever there is a code change.</p>
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
