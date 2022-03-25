---
layout: main
title: AWS Native CI/CD Builds
category: Cluster Management
menu: menu
toc:
    - title: AWS Native Builds
      url: "#aws-native-builds"
      active: true
    - title: Job Provider Configuration
      url: "#job-provider-configuration"
      active: true
    - title: Shared Provider Configuration
      url: "#shared-provider-configuration"
      active: true
    - title: Provider Configuration Definition
      url: "#provider-configuration-definition"
      active: true
---
## AWS Native Builds

Screwdriver can be used to orchestrate AWS native builds which runs in either Code Build or EKS.

* [AWS](https://aws.amazon.com/)
* [Code Build](https://aws.amazon.com/codebuild/)
* [EKS](https://aws.amazon.com/eks/)

Architecture [diagram](https://github.com/screwdriver-cd/screwdriver/issues/2550#issuecomment-930380829).

This integration uses [AWS MSK](https://aws.amazon.com/msk/) to schedule user builds in the user's own AWS account. This enables Screwdriver Cluster admins to a setup multi-tenant build environments where different user builds are sent to their individual AWS accounts without impacting each other. Users can also integrate with Screwdriver without having to provide any account or network access to Screwdriver and perform secure AWS deployments backed by [IAM role identities](https://aws.amazon.com/iam/).

## Setup

In order to use this feature, Screwdriver Cluster admin must setup AWS MSK infrastructure using [aws-producer-scripts](https://github.com/screwdriver-cd/aws-producer-scripts#readme) and enable it in [queue-service](https://github.com/screwdriver-cd/queue-service/blob/master/config/custom-environment-variables.yaml#L275-L295)

A user who wants to integrate should work with Screwdriver Cluster admin to [register their AWS account](https://github.com/screwdriver-cd/aws-consumer-scripts/#prerequisite) for scheduling builds. 

Once registration is complete, then user should provision build infrastructure by running [this script](https://github.com/screwdriver-cd/aws-consumer-scripts/#instructions). 

# Job Provider Configuration
Provider configuration in jobs is required for identifying the cloud provider related configuration. For AWS Native builds it includes the identifier of the Virtual Private Cloud(VPC), the subnets and security groups which define the inbound and outbound communication, the IAM role for accessing various AWS services based on permissions. The example defines the mandatory parameters in provider config.

#### Example
You can store the full provider configuration in your `screwdriver.yaml`.

```
jobs:
  main:
    requires: [~pr, ~commit]
    image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
    provider:
      name: aws
      region: us-west-2
      accountId: 123456789012
      vpc:
        vpcId: vpc-0123abc
        securityGroupIds:
          - sg-0123abc
        subnetIds:
          - subnet-0123abc
          - subnet-0123def
          - subnet-0123ghi
      role: arn:aws:iam::123456789012:role/screwdriver-integration-role
      executor: sls
      launcherImage: screwdrivercd/launcher:v6.0.149
      launcherVersion: v6.0.149
    steps:
      - init: npm install
      - test: npm test
```
#### Example
Alternatively, provider configuration can be stored remotely in another repo. You can reference this config by putting a checkout URL with the format `CHECKOUT_URL#BRANCH:PATH`.
```
jobs:
  main:
    requires: [~pr, ~commit]
    image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
    provider: git@github.com:configs/aws.git#main:cd/aws/provider.yaml
    steps:
      - init: npm install
      - test: npm test
```

#### Example
Alternatively, provider configuration can be stored remotely in another repo. You can reference this external provider config by putting a checkout URL with the format `CHECKOUT_URL#BRANCH:PATH`.

```
jobs:
  main:
    requires: [~pr, ~commit]
    image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
    provider: git@github.com:configs/aws.git#main:cd/aws/provider.yaml
    steps:
      - init: npm install
      - test: npm test
```

## Image
The `image` configuration refers to a docker image, e.g. an container from [hub.docker.com](https://hub.docker.com) or a container from [public aws ecr images](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html) 

List of images support in your AWS account region can be checked using :
```
aws codebuild list-curated-environment-images
```
You can specify an image from a custom registry/your own AWS ECR by specifying the full url to that image.
If you wish to create an ECR with required permission during infrastructure provisioning, you can do so by setting the `create_ecr` flag in [aws-consumer-scripts](https://github.com/screwdriver-cd/aws-consumer-scripts#config-definitions)

#### Example
```
jobs:
    main:
        requires: [~pr, ~commit]
        image: 123456789012.dkr.ecr.us-west-2.amazonaws.com/screwdriver-hub:example_image
        provider:
          ...mandatory_params
        steps:
            - step1: echo hello
```

# Shared Provider Configuration
The `provider` configuration can be added to the `shared` configuration. Provider Configuration that is specified in a job configuration will override the same configuration in `shared.provider`.

#### Example
The following example defines a shared configuration for `provider` which is used by the main and main2 jobs.
```
shared:
  image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
  provider:
    name: aws
    region: us-west-2
    accountId: 123456789012
    vpc:
      vpcId: vpc-0123abc
      securityGroupIds:
        - sg-0123abc
      subnetIds:
        - subnet-0123abc
        - subnet-0123def
        - subnet-0123ghi
    role: arn:aws:iam::123456789012:role/screwdriver-integration-role
    executor: sls
    launcherImage: screwdrivercd/launcher:v6.0.149
    launcherVersion: v6.0.149

jobs:
    main:
      requires: [~pr, ~commit]
      steps:
        - init: npm install
        - pretest: npm lint
        - test: npm test
    main2:
      requires: [main]
      steps:
          - test: echo Skipping test
```

The above example would be equivalent to:
```
jobs:
    main:
        requires: [~pr, ~commit]
        image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
        provider:
          ...same as shared
        steps:
            - init: npm install
            - pretest: npm lint
            - test: npm test
    main2:
        requires: [main]
        image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
        provider:
          ...same as shared
        steps:
            - test: echo Skipping test

```

# Provider Configuration Definition

| Property | Values | Description |
| ------------ | -------- | ------------- |
| name | `aws` | Name of the supported cloud provider |
| region | `us-east-1` / `us-west-2` / [all AWS regions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html) | Default value is `us-west-2`. It defines the region where the required infrastructure is setup and where builds will run |
| accountId | Valid AWS account ID | This defines the AWS account ID where builds will be provisioned |
| vpcId | Valid AWS VPC ID | This defines the AWS VPC ID |
| securityGroupIds | List of valid security group IDs | This defines the AWS Security Group Id |
| subnetIds | List of valid subnet IDs | This defines the AWS Subnet ID |
| role | ARN of a valid AWS IAM role  | This defines the AWS IAM Role ARN with permissions and policies |
| executor | `sls` / `eks` | Defines the two executor modes for native builds: `sls` (AWS CodeBuild) and `eks` (AWS EKS). |
| launcherImage | Valid Screwdriver launcher Docker image | This defines the Screwdriver launcher image required for starting builds `e.g: screwdrivercd/launcher:v6.0.149` |
| launcherVersion | e.g: `v6.0.149` | Version of the Screwdriver launcher image |
| buildRegion | `us-east-1` / `us-west-2` | Region where builds will run if different from service region. Default value is same as `region`. |
| executorLogs | `true` / `false` | Flag to view logs in AWS CloudWatch for the AWS CodeBuild project. Default value is `false`. |
| privilegedMode | `true` / `false` | Flag to enable privileged mode for Docker build in the AWS CodeBuild project. Default value is `false`. |
| computeType | All supported [AWS CodeBuild Compute Types](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html) | This defines the different compute types with available memory, vCPUs, and disk space. Default value is `BUILD_GENERAL1_SMALL`.   |
| environmentType | All supported [AWS CodeBuild Environment](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html) | This defines the different environment types corresponding with `computeType`. Default value is `LINUX_CONTAINER`. |

