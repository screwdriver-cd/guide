---
layout: main
title: Contributing
category: About
menu: menu
toc:
    - title: Contributing
      url: "#contributing"
      active: true
    - title: What to Work On
      url: "#what-to-work-on"
    - title: General Guidelines for Contributing
      url: "#general-guidelines-for-contributing"
    - title: Submitting Pull Requests
      url: "#submitting-pull-requests"
    - title: Commit Message Format
      url: "#commit-message-format"
      subitem: true
---
# Contributing

Thank you for considering contributing! There are many ways you can help.

## What to Work On

All issues with Screwdriver can be found in the [screwdriver repo][api-issues-url]. To see what we're currently working on, you can check out our [digital scrum board](https://github.com/screwdriver-cd/screwdriver/projects/4) in the Projects section of the [Screwdriver API repo][api-repo]. If you're not sure what repositories you need to change, consult our [Where to Contribute doc](./where-to-contribute). For pointers on developing, checkout the [Getting Started Developing docs](./getting-started-developing).

## General Guidelines for Contributing

Please try to:
* update [issues](./issues) you're working on with a daily summary
* open a Slack channel with the issue number and feature in the channel title (e.g. `#911-subdirectory-support`) and discuss work in there
* submit a [design doc](https://github.com/screwdriver-cd/screwdriver/tree/master/design) if applicable

## Submitting Pull Requests

Patches for fixes, features, and improvements are accepted through pull requests. Here are some tips for contributing:

* Write good commit messages in the present tense ("Add X", not "Added X") with a short title, blank line, and bullet points if needed. Capitalize the first letter of the title and any bullet items. No punctuation in the title.
* Code must pass lint and style checks.
* All external methods must be documented. Add README docs and/or user documentation in our [guide][guide-repo] when appropriate.
* Include tests to improve coverage and prevent regressions.
* Squash changes into a single commit per feature/fix. Ask if you're unsure how to discretize your work.
* Whenever possible, tag your pull request with appropriate Github labels.

_Please ask before embarking on a large improvement so you're not disappointed if it does not align with the goals of the project or owner(s)._

### Commit Message Format

We use [semantic-release](https://www.npmjs.com/package/semantic-release), which requires commit messages to be in this specific format: `<type>(<scope>): <subject>`

| Keyword | Description |
| ------- | ----------- |
| Type | feat (feature), fix (bug fix), docs (documentation), style (formatting, missing semi colons, …), refactor, test (when adding missing tests), chore (maintain)  |
| Scope | anything that specifies the scope of the commit; can be blank, the issue number that your commit pertains to, or `*` |
| Subject | description of the commit |

**Important:** For any **breaking changes** that require a major version bump, add `BREAKING CHANGE: <message>` preceded by a space or two newlines in the footer of the commit message. The rest of the commit message is then used for this.

**Example commit messages:**
* For a bug fix: `fix: Remove extra space`
* For a breaking change:
```
feat(1234): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed.

The default graphite width of 10mm is always used for performance reasons.
```

[api-issues-url]: https://github.com/screwdriver-cd/screwdriver/issues
[api-repo]: https://github.com/screwdriver-cd/screwdriver
[guide-repo]: https://github.com/screwdriver-cd/guide
