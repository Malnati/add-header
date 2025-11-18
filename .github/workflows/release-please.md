<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# [Release Please](https://github.com/googleapis/release-please)

[![npm version](https://img.shields.io/npm/v/release-please.svg)](https://www.npmjs.org/package/release-please)
[![codecov](https://img.shields.io/codecov/c/github/googleapis/release-please/main.svg?style=flat)](https://codecov.io/gh/googleapis/release-please)

Release Please automates CHANGELOG generation, the creation of GitHub releases,
and version bumps for your projects.

It does so by parsing your
git history, looking for [Conventional Commit messages](https://www.conventionalcommits.org/),
and creating release PRs.

It does not handle publication to package managers or handle complex branch
management.

## What's a Release PR?

Rather than continuously releasing what's landed to your default branch,
release-please maintains Release PRs:

<img width="400" src="/screen.png">

These Release PRs are kept up-to-date as additional work is merged. When you're
ready to tag a release, simply merge the release PR. Both squash-merge and
merge commits work with Release PRs.

When the Release PR is merged, release-please takes the following steps:

1. Updates your changelog file (for example `CHANGELOG.md`), along with other language specific files (for example `package.json`).
2. Tags the commit with the version number
3. Creates a GitHub Release based on the tag

You can tell where the Release PR is in its lifecycle by the status label on the
PR itself:

- `autorelease: pending` is the initial state of the Release PR before it is merged
- `autorelease: tagged` means that the Release PR has been merged and the release has been tagged in GitHub
- `autorelease: snapshot` is a special state for snapshot version bumps
- `autorelease: published` means that a GitHub release has been published based on the Release PR (_release-please does not automatically add this tag, but we recommend it as a convention for publication tooling_).

## How should I write my commits?

Release Please assumes you are using [Conventional Commit messages](https://www.conventionalcommits.org/).

The most important prefixes you should have in mind are:

- `fix:` which represents bug fixes, and correlates to a [SemVer](https://semver.org/)
  patch.
- `feat:` which represents a new feature, and correlates to a SemVer minor.
- `feat!:`, or `fix!:`, `refactor!:`, etc., which represent a breaking change
  (indicated by the `!`) and will result in a SemVer major.

### Linear git commit history (use squash-merge)

We **highly** recommend that you use squash-merges when merging pull requests.
A linear git history makes it much easier to:

- Follow history - commits are sorted by merge date and are not mixed between
  pull requests
- Find and revert bugs - `git bisect` is helpful for tracking down which
  change introduced a bug
- Control the release-please changelog - when you merge a PR, you may have
  commit messages that make sense within the scope of the PR, but don't
  make sense when merged in the main branch. For example, you may have
  `feat: introduce feature A` and then `fix: some bugfix introduced in
the first commit`. The `fix` commit is actually irrelevant to the release
  notes as there was never a bug experienced in the main branch.
- Keep a clean main branch - if you use something like red/green development
  (create a failing test in commit A, then fix in commit B) and merge (or
  rebase-merge), then there will be points in time in your main branch where
  tests do not pass.

### What if my PR contains multiple fixes or features?

Release Please allows you to represent multiple changes in a single commit,
using footers:

```txt
feat: adds v4 UUID to crypto

This adds support for v4 UUIDs to the library.

fix(utils): unicode no longer throws exception
  PiperOrigin-RevId: 345559154
  BREAKING-CHANGE: encode method no longer throws.
  Source-Link: googleapis/googleapis@5e0dcb2

feat(utils): update encode to support unicode
  PiperOrigin-RevId: 345559182
  Source-Link: googleapis/googleapis@e5eef86
```

The above commit message will contain:

1. an entry for the **"adds v4 UUID to crypto"** feature.
2. an entry for the fix **"unicode no longer throws exception"**, along with a note
   that it's a breaking change.
3. an entry for the feature **"update encode to support unicode"**.

:warning: **Important:** The additional messages must be added to the bottom of the commit.

## How do I change the version number?

When a commit to the main branch has `Release-As: x.x.x` (case insensitive) in the **commit body**, Release Please will open a new pull request for the specified version.

**Empty commit example:**

`git commit --allow-empty -m "chore: release 2.0.0" -m "Release-As: 2.0.0"` results in the following commit message:

```txt
chore: release 2.0.0

Release-As: 2.0.0
```

## How can I fix release notes?

If you have merged a pull request and would like to amend the commit message
used to generate the release notes for that commit, you can edit the body of
the merged pull requests and add a section like:

```
BEGIN_COMMIT_OVERRIDE
feat: add ability to override merged commit message

fix: another message
chore: a third message
END_COMMIT_OVERRIDE
```

The next time Release Please runs, it will use that override section as the
commit message instead of the merged commit message.

:warning: **Important:** This feature will not work with plain merges because
release-please does not know which commit(s) to apply the override to. [We
recommend using squash-merge instead](#linear-git-commit-history-use-squash-merge).

## Release Please bot does not create a release PR. Why?

### Step 1: Ensure releasable units are merged

Release Please creates a release pull request after it notices the default branch
contains "releasable units" since the last release.
A releasable unit is a commit to the branch with one of the following
prefixes: "feat", "fix", and "deps".
(A "chore" or "build" commit is not a releasable unit.)

Some languages have their specific releasable unit configuration. For example,
"docs" is a prefix for releasable units in Java and Python.

### Step 2: Ensure no `autorelease: pending` or `autorelease: triggered` label in an old PR

Check existing pull requests labelled with `autorelease: pending` or
`autorelease: triggered` label.
Due to GitHub API failures, it's possible that the tag was not removed
correctly upon a previous release and Release Please thinks that the previous release is
still pending.
If you're certain that there's no pending release, remove the
`autorelease: pending` or `autorelease: triggered` label.

For the GitHub application users, Release Please will not create a new pull request
if there's an existing pull request labeled as `autorelease: pending`.
To confirm this case, search for a pull request with the label.
(It's very likely it's the latest release pull request.)
If you find a release pull request with the label and it is not going to be released
(or already released), then remove the `autorelease: pending` label and re-run Release
Please.

### Step 3: Rerun Release Please

If you think Release Please missed creating a release PR after a pull request
with a releasable unit has been merged, please re-run `release-please`. If you are using
the GitHub application, add `release-please:force-run` label to the merged pull request. If
you are using the action, look for the failed invocation and retry the workflow run.
Release Please will process the pull request immediately to find releasable units.

## Strategy (Language) types supported

Release Please automates releases for the following flavors of repositories:

| release type       | description                                                                                                                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bazel`            | [A Bazel module, with a MODULE.bazel and a CHANGELOG.md](https://bazel.build/external/module)                                                                                                                                                                                  |
| `dart`             | A repository with a pubspec.yaml and a CHANGELOG.md                                                                                                                                                                                                                            |
| `elixir`           | A repository with a mix.exs and a CHANGELOG.md                                                                                                                                                                                                                                 |
| `go`               | A repository with a CHANGELOG.md                                                                                                                                                                                                                                               |
| `helm`             | A repository with a Chart.yaml and a CHANGELOG.md                                                                                                                                                                                                                              |
| `java`             | [A strategy that generates SNAPSHOT version after each release](docs/java.md)                                                                                                                                                                                                  |
| `krm-blueprint`    | [A kpt package, with 1 or more KRM files and a CHANGELOG.md](https://github.com/GoogleCloudPlatform/blueprints/tree/main/catalog/project)                                                                                                                                      |
| `maven`            | [Strategy for Maven projects, generates SNAPSHOT version after each release and updates `pom.xml` automatically](docs/java.md)                                                                                                                                                 |
| `node`             | [A Node.js repository, with a package.json and CHANGELOG.md](https://github.com/yargs/yargs)                                                                                                                                                                                   |
| `expo`             | [An Expo based React Native repository, with a package.json, app.json and CHANGELOG.md](https://github.com/dmi3y/expo-release-please-example)                                                                                                                                  |
| `ocaml`            | [An OCaml repository, containing 1 or more opam or esy files and a CHANGELOG.md](https://github.com/grain-lang/binaryen.ml)                                                                                                                                                    |
| `php`              | A repository with a composer.json and a CHANGELOG.md                                                                                                                                                                                                                           |
| `python`           | [A Python repository with a pyproject.toml, &lt;project&gt;/\_\_init\_\_.py, CHANGELOG.md or optionally a setup.py, setup.cfg](https://github.com/googleapis/python-storage)                                                                                                   |
| `R`                | A repository with a DESCRIPTION and a NEWS.md                                                                                                                                                                                                                                  |
| `ruby`             | A repository with a version.rb and a CHANGELOG.md                                                                                                                                                                                                                              |
| `rust`             | A Rust repository, with a Cargo.toml (either as a crate or workspace, although note that workspaces require a [manifest driven release](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md) and the "cargo-workspace" plugin) and a CHANGELOG.md |
| `sfdx`             | A repository with a [sfdx-project.json](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) and a CHANGELOG.md                                                                                                                    |
| `simple`           | [A repository with a version.txt and a CHANGELOG.md](https://github.com/googleapis/gapic-generator)                                                                                                                                                                            |
| `terraform-module` | [A terraform module, with a version in the README.md, and a CHANGELOG.md](https://github.com/terraform-google-modules/terraform-google-project-factory)                                                                                                                        |

## Setting up Release Please

There are a variety of ways you can deploy release-please:

### GitHub Action (recommended)

The easiest way to run Release Please is as a GitHub action. Please see [googleapis/release-please-action](https://github.com/googleapis/release-please-action) for installation and configuration instructions.

### Running as CLI

Please see [Running release-please CLI](docs/cli.md) for all the configuration options.

## Bootstrapping your Repository

Release Please looks at commits since your last release tag. It may or may not be able to find
your previous releases. The easiest way to onboard your repository is to
[bootstrap a manifest config](/docs/cli.md#bootstrapping).

## Customizing Release Please

Release Please provides several configuration options to allow customizing
your release process. Please see [customizing.md](docs/customizing.md) for more details.

## Supporting Monorepos via Manifest Configuration

Release Please also supports releasing multiple artifacts from the same repository.
See more at [manifest-releaser.md](docs/manifest-releaser.md).

## Supported Node.js Versions

Our client libraries follow the [Node.js release schedule](https://nodejs.org/en/about/releases/).
Libraries are compatible with all current _active_ and _maintenance_ versions of
Node.js.

Client libraries targeting some end-of-life versions of Node.js are available, and
can be installed via npm [dist-tags](https://docs.npmjs.com/cli/dist-tag).
The dist-tags follow the naming convention `legacy-(version)`.

_Legacy Node.js versions are supported as a best effort:_

- Legacy versions will not be tested in continuous integration.
- Some security patches may not be able to be backported.
- Dependencies will not be kept up-to-date, and features will not be backported.

#### Legacy tags available

- `legacy-8`: install client libraries from this dist-tag for versions
  compatible with Node.js 8.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).

## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/googleapis/release-please/blob/main/CONTRIBUTING.md).

For more information on the design of the library, see [design](https://github.com/googleapis/release-please/blob/main/docs/design.md).

## Troubleshooting

For common issues and help troubleshooting your configuration, see [Troubleshooting](https://github.com/googleapis/release-please/blob/main/docs/troubleshooting.md).

## License

Apache Version 2.0

See [LICENSE](https://github.com/googleapis/release-please/blob/main/LICENSE)

## Disclaimer

This is not an official Google product.

# Release Please Implementation Design

This document aims to describe the current design of `release-please` and serve as a
primer for contributing to this library.

## General concepts

### Release branch

The release branch is the branch that you will create releases from. Most commonly this
is your repository's default branch (like `main`), but could also be a long
term support (LTS) or backport branch as well.

In the code, this is referred to as the `targetBranch`.

### Release pull request

`release-please` is designed to propose releases via a pull request. `release-please`
will maintain a pull request ("release pull request") which proposes version bumps in
your code and appends release notes to your `CHANGELOG.md`. Releases are not created
until after this "release pull request" is merged to your release branch.

Maintainers can merge additional commits and `release-please` will update the existing
release pull request.

### GitHub releases

GitHub has a feature called a [release](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) which is the combination of a git reference (tag or
SHA) and release notes. `release-please` creates a GitHub release after a release pull
request is merged to your release branch.

### Components

In `release-please` terms, `component` is the name of a releasable unit. This could be a
library to publish to a package manager or an application that is deployed to a server.

Most commonly, a single GitHub repository contains code for a single `component`. In
other cases, a single GitHub repository could be a monorepo that contains code for
multiple components. `release-please` can handle both of these scenarios.

### Semantic versioning

Semantic versioning is a specification that dictates how version numbers are formatted
and incremented. This library assumes your version numbers are semantic versions.

For more information, see https://semver.org

### Conventional commits

Conventional commits is a specification for making commit messages machine-readable and
informing automation tools (like `release-please`) about the context of the commit.

For more information, see https://conventionalcommits.org

## Lifecycle of a release

1. A commit is merged/pushed to the release branch.
2. `release-please` opens a release pull request.
3. A maintainer reviews/merges the release pull request.
4. `release-please` creates a new GitHub release with the release notes (extracted from
   the release pull request).

**Note**: `release-please` is not responsible for publishing your package or application.
You can easily set up further automation to trigger from the creation of the release.

### Opening a release pull request

The general flow for opening a release pull request:

1. Find the SHA of the latest released version for the component to be released
2. Find all commits relevant to that component since the previous release
3. Delegate to a language handler ([`Strategy`][strategies]) to build the pull request,
   given the list of commits.
4. Create a pull request with the relevant code changes. Add the pending label
   (defaults to `autorelease: pending`) to the pull request.

More in-depth (including monorepo support):

1. Build the manifest config

- Fetch and parse the manifest config/versions files OR
- Build the manifest in code

2. Find the SHA of each of the latest released versions for each component

- Iterate through the latest GitHub releases (via GitHub GraphQL API)
- Fallback: iterate through GitHub tags on the repository

3. Iterate backwards through commits until we've seen all the release SHAs or we hit
   a (configurable) max number of commits. Include fetching files for each of those
   commits
4. Split commits for each component. Only commits that touch the directory of the
   component apply to that component.
5. Run any plugin pre-configurators (for `Strategy` configs).
6. For each component, build a candidate release pull request (if necessary)
7. Run any plugin post-processors
8. Optionally, combine multiple candidate release pull requests into a single pull
   request that will release all components together.

### Creating GitHub releases

The general flow for creating a GitHub release:

1. Find any merged release pull requests. We look for the pull request by label.
2. For each merged release pull request, parse the pull request to determine the component
   version, and release notes.
3. Create a new GitHub release that tags the SHA of the pull request's merge commit SHA.
   Use the parsed release notes as the GitHub release's body.
4. Mark the pull request as tagged by adding the tagged label (defaults to
   `autorelease: tagged`).

## Making API calls

This library was originally built as a nodejs library and CLI tool. It does not use the
`git` CLI and instead opts to do its processing work in-memory and using the GitHub API.

All code paths that interact with GitHub are encapsulated in the
[`GitHub` class][github-class]. This design also helps us test the API calls and mock
out our API calls at a higher level than mocking the API JSON responses.

### Talking to the GitHub API

We use the [`@octokit/rest`][octokit-rest] library to make calls to the GitHub API.
To authenticate, you can provide an access token or provide an existing authenticated
`Octokit` instance (for example, you can provide an `Octokit` instance from a
[`probot`][probot] bot handler).

To actually open the pull request and update the code, we leverage the
[`code-suggester`][code-suggester] library.

### Reducing API calls

Where possible, we would like to cache API calls so we limit our quota usage. An example of
this is the [`RepositoryFileCache`][repository-file-cache] which is a read-through cache
for fetching file contents/data from the GitHub API.

## Versioning

### Version

We have a concrete, core class [`Version`][version] which encapsulates a semantic
version.

A [`Version`][version] instance contains:

- semver major (number)
- semver minor (number)
- semver patch (number)
- pre-release version (string)
- build (string)

### Versioning strategy

We define a [`VersioningStrategy`][versioning-strategy] interface that abstracts the
notion of how to increment a `Version` given a list of commits.

In the default case ([`DefaultVersioningStrategy`][default-versioning-strategy]):

- a breaking change will increment the semver major version
- a `feat` change will increment the semver minor version
- a `fix` change will increment the semver patch version

Note: `VersioningStrategy`s are configurable independently of the language `Strategy` so
you can mix and match versioning strategies with language support.

## Language support

`release-please` is highly extendable to support new languages and package managers. We
currently support 20+ different `Strategy` types many of which are community created and
supported.

### Strategy

We define a [`Strategy`][strategy] interface which abstracts the notion of what files to
update when proposing the next release version. In the most basic case
([`Simple`][simple-strategy]), we do not update any source files except the `CHANGELOG.md`.

**Contributor note**: Implementation-wise, most strategies inherit from the
[`BaseStrategy`][base-strategy]. This is not necessary, but it handles most of the common
behavior. If you choose to extend `BaseStrategy`, you only need to implement a single
`buildUpdates()` method (which files need to be updated).

**Contributor note**: If you implement a new `Strategy`, be sure to add a new corresponding
test to ensure we don't break it in the future.

### Updating file contents

The most common customization a `Strategy` makes is determining which standard files need to be
updated. For example, in a `nodejs` library, you will want to update the `version` entry in
your library's `package.json` (and `package-lock.json` if it exists).

We represent a file update via the [`Update`][update] interface. An `Update` contains the
path to the file needing an update, whether or not to create the file if it does not exist,
and how to update the file. The [`Updater`][update] interface is an abstraction that is
actually responsible for updating the contents of a file. An `Updater` implementation
generates updated content given the original file contents and a new version (or versions)
to update within that file.

**Contributor note**: If you implement a new `Updater`, be sure to add a new corresponding
test to ensure we don't break it in the future.

## Changelog/release notes

We define a [`ChangelogNotes`][changelog-notes] interface which abstracts the notion of how
to build a `CHANGELOG.md` entry given a list of commits. The default implementation
([`DefaultChangelogNotes`][default-changelog-notes]), uses the
`conventional-changelog-writer` library to generate standardized release notes based on
the conventionalcommits.org specification.

We also have a second implementation that uses the GitHub changelog generator API.

## Release pull request

`release-please` operates without a database of information and so it relies on GitHub as
the source of its information. Due to this, the release pull request is heavily formatted
and its structure is load-bearing.

### Branch name

The name of the HEAD branch that `release-please` creates its pull request from contains
important information that `release-please` needs.

As such, we implement a helper [`BranchName` class][branch-name] that encapsulates that
data.

The HEAD branch name is not customizable at this time.

### Pull request title

The pull request title can also contain important information that `release-please` needs.

As such, we implement a helper [`PullRequestTitle` class][pull-request-title] that
encapsulates the data. This class contains the customization logic which allows users to
customize the pull request title.

### Pull request body

The pull request body format is critical for `release-please` to operate as it includes
the changelog notes that will be included in the GitHub release.

For monorepos, it can also contain information for multiple releases so it must be
parseable.

As such, we implement a helper [`PullRequestBody` class][pull-request-body] that
encapsulates the data.

## Monorepo support

In `release-please` version 13, we integrated "manifest" releasers as a core part of the
library. Manifests were built to support monorepos, which can have many releasable
libraries in a single repository. The manifest is a JSON file that maps component path
<=> current release version. The manifest config file is a JSON file that maps component
path <=> component configuration. These files allow `release-please` to more easily track
multiple releasable libraries.

We highly recommend using manifest configurations (even for single library repositories) as
the configuration format is well defined (see schema) and it reduces the number of necessary
API calls. In fact, the original config options for `release-please` are actually converted
into a manifest configured release that only contains a single component.

### Manifest plugins

Within a single `Strategy`, we treat the library as an independent entity -- the library
does not know or care that is part of a bigger monorepo.

Plugins provide an opportunity to break that encapsulation. They operate as pre-processors
and post-processors for the `Strategy` implementations.

We provide a [`ManifestPlugin` interface][plugin] that has 2 lifecycle hooks.

The first is the `preconfigure` hook, which allows making changes to a `Strategy`'s
configuration. The second is the `run` (post-processor) hook, which allows making changes
to candidate release pull requests before they are created.

### Configuration schemas

We provide JSON-schema representations of both the manifest config and manifest versions
files. These can be found in [`schemas/`][schemas].

**Contributor note**: If you implement a new configuration option, make sure to update the
JSON-schema to allow it.

## Factories

We use a factory pattern to build all of our customizable components. This allows us to
encapsulate the logic for building these components from configuration JSON and also makes
it easier to mock for testing.

See `src/factory` and `src/factories/`.

**Contributor note**: If you implement a new configuration option, make sure to test that
we correctly build the manifest configuration from the config JSON.

## Testing

We heavily rely on unit testing to ensure `release-please` is behaving as expected. This is
a very complex codebase and we try to avoid breaking changes.

**Contributor note**: If you implement a new bugfix, please also add a new corresponding
test to ensure we don't regress in the future.

## Public interface

We only consider the binary `release-please` CLI and the exported members from the `index.ts`
as part of the public interface. Other classes' interfaces are not considered part of the
public API and are subject to modification without requiring a new major release of
`release-please`.

Typescript/Javascript has limitations in its visibility scopes. If you choose to organize
source across many files, you cannot mark things as private if you use them in other files.
For example, you could have a file `src/internal/private-class.ts` which exports `PrivateClass`
for use as an implementation detail or for testability. An external developer could use
`import {PrivateClass} from 'release-please/src/internal/private-class';` to access.

**Contributor note**: Do not make breaking changes to any exported entities from `index.ts`.
Doing so can break integrations. If the change is necessary, we will need to mark the
change as breaking and release a new major version.

[github-class]: /src/github.ts
[octokit-rest]: https://github.com/octokit/rest.js/
[probot]: https://github.com/probot/probot
[code-suggester]: https://github.com/googleapis/code-suggester
[repository-file-cache]: /src/util/file-cache.ts
[version]: /src/version.ts
[versioning-strategy]: /src/versioning-strategy.ts
[default-versioning-strategy]: /src/versioning-strategies/default.ts
[strategy]: /src/strategy.ts
[strategies]: /src/strategies/
[simple-strategy]: /src/strategies/simple.ts
[base-strategy]: /src/strategies/base.ts
[update]: /src/update.ts
[changelog-notes]: /src/changelog-notes.ts
[default-changelog-notes]: /src/changelog-notes/default.ts
[branch-name]: /src/util/branch-name.ts
[pull-request-title]: /src/util/pull-request-title.ts
[pull-request-body]: /src/util/pull-request-body.ts
[plugin]: /src/plugin.ts
[schemas]: /schemas/
