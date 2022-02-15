---
layout: main
title: AWS Native CI/CD Builds
category: Cluster Management
menu: menu
toc:
    - title: AWS Native Builds
      url: "#aws-native-builds"
      active: true
---
## AWS Native Builds

Screwdriver can be used to orchestrate AWS native builds which runs in either Code Build or EKS.

* [AWS](https://aws.amazon.com/)
* [Code Build](https://aws.amazon.com/codebuild/)
* [EKS](https://aws.amazon.com/eks/)

Architecture [diagram](https://github.com/screwdriver-cd/screwdriver/issues/2550#issuecomment-930380829).

This integration uses [AWS MSK](https://aws.amazon.com/msk/) to schedule user builds in user's own AWS account. This enables Screwdriver Cluster admins to a setup multi tenant build environment where different user builds are send to their individual AWS accounts without impacting each other. And users can integrate with Screwdriver without having to provide any account or network access to Screwdriver and perform secure AWS deployments backed by [IAM role identities](https://aws.amazon.com/iam/).

## Setup

In order to use this feature, Screwdriver Cluster admin must setup AWS MSK infrastructure and enable it in [queue-service](https://github.com/screwdriver-cd/queue-service/blob/master/config/custom-environment-variables.yaml#L275-L295)

A user who wants to integrate should work with Screwdriver Cluster admin to [register their AWS account](https://github.com/screwdriver-cd/aws-consumer-scripts/#prerequisite) for scheduling builds. 

Once registration is complete, then user should provision buld infrastructure by running [this script](https://github.com/screwdriver-cd/aws-consumer-scripts/#instructions). 
