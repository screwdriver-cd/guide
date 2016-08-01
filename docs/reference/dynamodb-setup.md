## Setting Up DynamoDB

Screwdriver can be configured to store data in [DynamoDB](https://aws.amazon.com/dynamodb/).


### Setting up AWS Credentials

To setup Screwdriver to use DynamoDB as the datastore, you'll need setup your [AWS credentials](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Configuring_the_SDK_in_Node_js) from [AWS](http://aws.amazon.com/). If you already have, skip to the next step.

#### Creating the credentials file

Create a credentials file at `~/.aws/credentials` on Mac/Linux.

```bash
[default]
aws_access_key_id = {YOUR_ACCESS_KEY_ID}
aws_secret_access_key = {YOUR_SECRET_ACCESS_KEY}
```

Substitute your own AWS credentials values for `{YOUR_ACCESS_KEY_ID}` and `{YOUR_SECRET_ACCESS_KEY}`.


### Create Screwdriver tables in DynamoDB

#### Install dynamic-dynamodb CLI
```bash
$ npm install -g screwdriver-dynamic-dynamodb
```

#### Create Screwdriver tables
Dynamic-dynamodb CLI will create tables `builds`, `jobs`, `pipelines`, `users` in DynamoDB for you.
Pick a region that is near your location for the best performance (Screwdriver default region is `us-west-2`). Depending on what region you are in, run the appropriate command below:

- In region `us-west-2`

```bash
$ screwdriver-db-setup create
```

- In a specific region (ex: Ireland)

```bash
$ screwdriver-db-setup --region eu-west-1 create
```


### Viewing your Screwdriver tables
To see your newly created Screwdriver tables, navigate to the DynamoDB service. If you click on tables, you should see something similar to this:

![DynamoDB tables](assets/dynamodb-tables.png)

_Note in the upper right corner you can select the region where the table will be created. Select the region you specified when creating Screwdriver tables above._
