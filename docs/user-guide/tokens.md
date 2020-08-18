---
layout: main
title: Tokens
category: User Guide
menu: menu
toc:
    - title: Tokens
      url: "#tokens"
    - title: User Access Tokens
      url: "#user-access-tokens"
    - title: Pipeline Access Tokens
      url: "#pipeline-access-tokens"
    - title: Using Access Tokens
      url: "#using-access-tokens"
---
# Tokens
Users can pass access tokens (user or pipeline scope) to the Screwdriver API in exchange for a JSON Web Token (JWT). The JWT can then be used in the Authorization header to make further requests to the Screwdriver API.

Builds also generate JWTs as the [environment variable](./environment-variables) `$SD_TOKEN`.

## User Access Tokens
User access tokens are tied to a specific user.
To generate a user access token:

1. In the upper-right corner of any page, click your username; then click User Settings.
![User settings](./assets/user-settings.png)

2. Give your token a name and description.

3. Click Add to generate a token.
![User token](./assets/user-token.png)

4. Copy the token to your clipboard. For security reasons, after you navigate off the page, you will not be able to see the token again.
![Copy user token](./assets/copy-user-token.png)

### Options
After a token is created, you will have the option to generate fresh token with the Refresh button or Delete it.

## Pipeline Access Tokens
Pipeline access tokens are tied to a Screwdriver pipeline.
To generate a pipeline access token:

1. In a Screwdriver pipeline page, click the Secrets tab under the pipeline name.
![Pipeline secrets](./assets/pipeline-secrets.png)

2. Under Access Tokens, give your token a name and description.

3. Click Add to generate a token.
![User token](./assets/user-token.png)

4. Copy the token to your clipboard. For security reasons, after you navigate off the page, you will not be able to see the token again.
![Copy user token](./assets/copy-user-token.png)

## Using Access Tokens

To authenticate with your newly created token, make a GET request to `https://${API_URL}/v4/auth/token?api_token=${YOUR_TOKEN_VALUE}`. This returns a JSON object with a token field. The value of this field will be a JSON Web Token, which you can use in an Authorization header to make further requests to the Screwdriver API. This JWT will be valid for 12 hours, after which you must re-authenticate.

See the [API documentation](./api) for more details.