# Creating a Pipeline
Using the Screwdriver CLI, you can build pipelines locally on your machine.

## Set up Screwdriver CLI

**The Screwdriver CLI does not exist yet, but here is what the instructions would look like.**

### Installing Go
[Go](https://golang.org/) v1.6 or higher is required. To find out how to setup your Go environment, follow instructions in their [Getting Started](https://golang.org/doc/install) page.

### Installing the CLI

```bash
$ go get github.com/screwdriver-cd/client
$ $GOPATH/bin/client
export PATH=$PATH:$GOPATH/bin
```

### Configure your Git token
Get the URL to login to Screwdriver

```bash
$ sd login  # prompts you to visit http://the-api-url.us-west-2.elb.amazonaws.com/v3/login
```

Copy your token and paste it
```bash
$ sd config token {YOUR_TOKEN_HERE}
```


## Using the Screwdriver CLI
Now that the Screwdriver CLI is set up, you can use it to create a pipeline. Creating a pipeline will automatically create a `main` job and start a build.

### Start the CLI
To enter the read-eval-print loop, run:

```bash
$ sd repl
```

### Create a Pipeline
To create a pipeline, you will need your `scmUrl`.
```bash
sd$ pipelines create {YOUR_SCMURL}  # (ex: git@github.com:screwdriver-cd/hashr.git#master)
```
Congratulations! You just created your first pipeline!

### Viewing your Pipeline
To see your pipeline, run:
```bash
sd$ pipelines list
sd$ jobs list
sd$ builds list
```

See the logs at:
```bash
sd$ builds log {BUILD_ID}
```

For more information on how to use the Screwdriver CLI, type:
```bash
sd$ help
```
