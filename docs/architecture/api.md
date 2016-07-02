# API Design

Our API was designed with three principles in mind:

1. All interactions of user's data should be done through the API, so that
there is a consistent interface across the tools (CLI, Web UI, etc.).
1. Resources should be ReST-ful and operations should be atomic so that intent
is clear and human readable.
1. API should be versioned and self-documented, so that client code generation
is possible.

> **Version 3** is the current API, all links should be prefixed with `/v3`

## AuthN and AuthZ

For Authentication we're using [JSON Web Tokens]. They need to be passed via
an `Authorization` header. Generating a JWT can be done by visiting our
`/login` endpoint.

Authorization on the other hand is handled by [GitHub OAuth]. This occurs when
you visit the `/login` endpoint. Screwdriver uses the GitHub user tokens
and identity to:

 - identify what repositories you have read, write, and admin access to
     - read allows you to view the pipeline
     - write allows you to start or stop jobs
     - admin allows you to create, edit, or delete pipelines
 - read the repository's `screwdriver.yaml`
 - enumerate the list of pull-requests open on your repository
 - update the pull-request with the success/failure of the build
 - add/remove repository web-hooks so Screwdriver can be notified on changes

## Swagger

All of our APIs and the data models around them are documented via [Swagger].
This prevents out-of-date documentation, enables clients to be
auto-generated, and most importantly exposes a human-readable interface.

Our documentation is at: `/documentation`

Our swagger is at: `/swagger.json`

[JSON Web Tokens]: http://jwt.io
[GitHub OAuth]: https://developer.github.com/v3/oauth/
[Swagger]: http://swagger.io/
