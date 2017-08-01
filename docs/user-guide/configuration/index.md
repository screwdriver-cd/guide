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

_Note: `Parallel`, `series`, and `matrix` have not been implemented yet. Everything will run in series by default._

<div class="yaml-docs">

<pre class="example">
<a href="#workflow"><span class="key">workflow</span>:
    - <span class="value">publish</span>
    - <span class="key">parallel</span>:
        - <span class="key">series</span>:
            - <span class="value">deploy-east</span>
            - <span class="value">validate-east</span>
        - <span class="key">series</span>:
            - <span class="value">deploy-west</span>
            - <span class="value">validate-west</span></a>
<a href="#shared"><span class="key">shared</span>:</a>
    <a href="#environment"><span class="key">environment</span>:
    <span class="key">NODE_ENV</span>: <span class="value">test</span></a>
    <a href="#settings"><span class="key">settings</span>:</a>
        <a href="#email"><span class="key">email</span>:
    <span class="key">addresses</span>: <span class="value">[test@email.com, test2@email.com]</span>
    <span class="key">statuses</span>: <span class="value">[SUCCESS, FAILURE]</span></a>
<a href="#jobs"><span class="key">jobs</span>:</a>
    <a href="#main-job"><span class="key">main</span>:</a>
        <a href="#image"><span class="key">image</span>: <span class="value">node:&#123;&#123;NODE_VERSION&#125;&#125;</span></a>
        <a href="#matrix"><span class="key">matrix</span>:
    <span class="key">NODE_VERSION</span>: <span class="value">[4,5,6]</span></a>
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
            <p>Jobs can execute in parallel, in series, or in any combination of the two, per this example. Special keywords <strong><em>parallel</em></strong> and <strong><em>series</em></strong> define the flow of the jobs. By default, the jobs in the workflow list are run in series after <em>main</em> job has completed successfully.</p>
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
            <p>This defines the docker image(s) used for the builds. This example shows a template replacement, where a variable is enclosed in curly braces, e.g. {{NODE_VERSION}}. This variable will be changed to the value(s) of the equivalent variable in the matrix setting, resulting in multiple builds running in parallel, each using one of those various images.</p>
        </div>
        <div id="matrix" class="hidden">
            <h4>Matrix</h4>
            <p>This causes the builds for the job to execute on multiple images in parallel, when used a templated image configuration.</p>
        </div>
        <div id="steps" class="hidden">
            <h4>Steps</h4>
            <p>Defines the explicit list of commands that are executed in the build, just as if they were entered on the command line. Environment variables will be passed between steps, within the same job. Step definitions are required for all jobs. Step names cannot start with `sd-`, as those steps are reserved for Screwdriver steps. In essence, Screwdriver runs `/bin/sh` in your terminal then executes all the steps; in rare cases, different terminal/shell setups may have unexpected behavior.</p>
        </div>
    </div>
</div>
