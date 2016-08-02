# Creating a Pipeline
Using the Screwdriver CLI, you can build pipelines locally on your machine.

## Set up Screwdriver CLI

**The Screwdriver CLI does not exist yet, but here is what the instructions would look like.**

### Installing Go
####Install Go

```bash
brew install go
```

#### Setup your path
The GOPATH environment variable specifies the location of your workspace. Create a workspace directory and set GOPATH accordingly. We will use `$HOME/work` in this document.

```bash
$ mkdir $HOME/work
$ mkdir -p $HOME/work/src/github.com/$user

$ export GOPATH=$HOME/work
$ export GOROOT=/usr/local/opt/go/libexec
$ export PATH=$PATH:$GOPATH/bin # add the workspace's bin subdirectory to your PATH
$ export PATH=$PATH:$GOROOT/bin
```

#### Installing Go
There are many ways to install Go, here we will use Brew.
```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew update
$ brew install go
```

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
