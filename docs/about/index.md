# What is Screwdriver?

<div class="row">
    <div class="col-xs-12 col-md-8">
        <h2>Secure Continuous Delivery</h2>
        <p>Screwdriver treats Continuous Delivery as a first-class citizen in your build pipeline.
        Easily define the path that your code takes from Pull Request to Production.</p>
    </div>
    <div class="col-xs-12 col-md-4">
        <img src="/assets/continuous_delivery.png" class="cd">
    </div>
</div>

<div class="row">
    <div class="col-xs-12 col-md-4">
        <img src="/assets/daily_habits.png" class="dh">
    </div>
    <div class="col-xs-12 col-md-8">
        <h2>Integrates with Daily Habits</h2>
        <p>Screwdriver ties directly into your DevOps daily habits.
        It tests your pull requests, builds your merged commits, and deploys to your environments.
        Define load tests, canary deployments, and multi-environment deployment pipelines with ease.</p>
    </div>
</div>

<div class="row">
    <div class="col-xs-12 col-md-8">
        <h2>Pipeline as Code</h2>
        <p>Define your pipeline in a simple YAML file that lives beside your code.
        There is no external configuration of your pipeline to deal with,
        so your pipeline changes can be reviewed and rolled out with the rest of your codebase.</p>
    </div>
    <div class="col-xs-12 col-md-4">
        <img src="/assets/pipeline_code.png" class="pc">
    </div>
</div>

<div class="row">
    <div class="col-xs-12 col-md-4">
        <img src="/assets/3rd_party_services.png" class="party">
    </div>
    <div class="col-xs-12 col-md-8">
        <h2>Runs Anywhere</h2>
        <p>Screwdriver's architecture uses pluggable components under the hood
        to allow you to swap out the pieces that make sense for your infrastructure.
        Swap in Postgres for the Datastore or Jenkins for the Executor.
        You can even dynamically select an execution engine based on the needs of each pipeline.
        For example, send golang builds to the kubernetes executor while your iOS builds got to a
        Jenkins execution farm.</p>
    </div>
</div>
