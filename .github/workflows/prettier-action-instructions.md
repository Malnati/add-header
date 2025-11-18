Preferencias:

dry: false
no*commit: false
prettier_version: latest
working_directory: ${{ github.action_path }}
prettier_options: "--write \**/\_.{js,ts,tsx,md,json,css,scss,html}"
commit_message: "chore: format code with Prettier"
commit_description: "Automated code formatting using Prettier action."
same_commit: false
clean_node_folder: true
git_identity: "actions"
allow_other_plugins: false
only_changed: false
only_changed_pr: false
commit_options: ""
push_options: ""
file_pattern: "\*"
prettier_plugins: ""  
clean_node_folder: true
only_changed: false
github_token: ${{ github.token }}

Documentaçao:

# GitHub Prettier Action

[![CodeFactor](https://www.codefactor.io/repository/github/creyd/prettier_action/badge/master)](https://www.codefactor.io/repository/github/creyd/prettier_action/overview/master)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/ba5fa97677ee47e48efdc2e6f7493c49)](https://app.codacy.com/gh/creyD/prettier_action/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![License MIT](https://img.shields.io/github/license/creyD/prettier_action)](https://github.com/creyD/prettier_action/blob/master/LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/creyD/prettier_action)](https://github.com/creyD/prettier_action/releases)
[![Contributors](https://img.shields.io/github/contributors-anon/creyD/prettier_action)](https://github.com/creyD/prettier_action/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/creyD/prettier_action)](https://github.com/creyD/prettier_action/issues)

A GitHub action for styling files with [prettier](https://prettier.io).

## Usage

### Parameters

| Parameter           | Required |           Default           | Description                                                                                                                                                                                                                                                                                        |
| ------------------- | :------: | :-------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dry                 |   :x:    |           `false`           | Runs the action in dry mode. Files wont get changed and the action fails if there are unprettified files. Recommended to use with prettier_options --check                                                                                                                                         |
| no_commit           |   :x:    |           `false`           | Can be used to avoid committing the changes (useful when another workflow step commits after this one anyways; can be combined with dry mode)                                                                                                                                                      |
| prettier_version    |   :x:    |          `latest`           | Specific prettier version (by default use latest)                                                                                                                                                                                                                                                  |
| working_directory   |   :x:    | `${{ github.action_path }}` | Specify a directory to cd into before installing prettier and running it, use relative file path to the repository root for example `app/`                                                                                                                                                         |
| prettier_options    |   :x:    |     `"--write **/*.js"`     | Prettier options (by default it applies to the whole repository)                                                                                                                                                                                                                                   |
| commit_options      |   :x:    |              -              | Custom git commit options                                                                                                                                                                                                                                                                          |
| push_options        |   :x:    |              -              | Custom git push options                                                                                                                                                                                                                                                                            |
| same_commit         |   :x:    |           `false`           | Update the current commit instead of creating a new one, created by [Joren Broekema](https://github.com/jorenbroekema), this command works only with the checkout action set to fetch depth '0' (see example 2)                                                                                    |
| commit_message      |   :x:    |    `"Prettified Code!"`     | Custom git commit message, will be ignored if used with `same_commit`                                                                                                                                                                                                                              |
| commit_description  |   :x:    |              -              | Custom git extended commit message, will be ignored if used with `same_commit`                                                                                                                                                                                                                     |
| file_pattern        |   :x:    |             `*`             | Custom git add file pattern, can't be used with only_changed!                                                                                                                                                                                                                                      |
| prettier_plugins    |   :x:    |              -              | Install Prettier plugins, i.e. `"@prettier/plugin-php" "@prettier/plugin-other"`. Must be wrapped in quotes since @ is a reserved character in YAML.                                                                                                                                               |
| clean_node_folder   |   :x:    |           `true`            | Delete the node_modules folder before committing                                                                                                                                                                                                                                                   |
| only_changed        |   :x:    |           `false`           | Only prettify changed files, can't be used with file_pattern! This command works only with the checkout action set to fetch depth '0' (see example 2)                                                                                                                                              |
| github_token        |   :x:    |    `${{ github.token }}`    | The default [GITHUB_TOKEN](https://docs.github.com/en/actions/reference/authentication-in-a-workflow#about-the-github_token-secret) or a [Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) |
| git_identity        |   :x:    |          `actions`          | Set to `author` to use author's user as committer. This allows triggering [further workflow runs](https://github.com/peter-evans/create-pull-request/blob/main/docs/concepts-guidelines.md#triggering-further-workflow-runs)                                                                       |
| allow_other_plugins |   :x:    |           `false`           | Allow other plugins to be installed (prevents the @prettier-XYZ regex check)                                                                                                                                                                                                                       |

> Note: using the same_commit option may lead to problems if other actions are relying on the commit being the same before and after the prettier action has ran. Keep this in mind.

### Example Config

> Hint: if you still use the old naming convention or generally a different branch name, please replace the `main` in the following configurations.

#### Example 1 (run on push in branch main)

```yaml
name: Continuous Integration

# This action works with pull requests and pushes
on:
  pull_request:
  push:
    branches:
      - main

jobs:
  prettier:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Prettify code
        uses: creyD/prettier_action@v4.6
        with:
          # This part is also where you can pass other options, for example:
          prettier_options: --write **/*.{js,md}
```

#### Example 2 (using the only_changed or same_commit option on PR)

```yaml
name: Continuous Integration

on:
  pull_request:
    branches: [main]

jobs:
  prettier:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          # Make sure the actual branch is checked out when running on pull requests
          ref: ${{ github.head_ref }}
          # This is important to fetch the changes to the previous commit
          fetch-depth: 0

      - name: Prettify code
        uses: creyD/prettier_action@v4.6
        with:
          # This part is also where you can pass other options, for example:
          prettier_options: --write **/*.{js,md}
          only_changed: True
```

#### Example 3 (using a custom access token on PR)

```yaml
name: Continuous Integration

on:
  pull_request:
    branches: [main]

jobs:
  prettier:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: ${{ github.head_ref }}
          # Make sure the value of GITHUB_TOKEN will not be persisted in repo's config
          persist-credentials: false

      - name: Prettify code
        uses: creyD/prettier_action@v4.6
        with:
          prettier_options: --write **/*.{js,md}
          only_changed: True
          # Set your custom token
          github_token: ${{ secrets.PERSONAL_GITHUB_TOKEN }}
```

#### Example 4 (dry run)

```yaml
name: Continuous Integration

on:
  pull_request:
    branches: [main]

jobs:
  prettier:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: ${{ github.head_ref }}
          # Make sure the value of GITHUB_TOKEN will not be persisted in repo's config
          persist-credentials: false

      - name: Prettify code
        uses: creyD/prettier_action@v4.6
        with:
          dry: True
          github_token: ${{ secrets.PERSONAL_GITHUB_TOKEN }}
```

More documentation for writing a workflow can be found [here](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions).

## Issues

Please report all bugs and feature request using the [GitHub issues function](https://github.com/creyD/prettier_action/issues/new). Thanks!

### Problem with NPM v9 (19.02.2023)

This issue was discussed in https://github.com/creyD/prettier_action/issues/113. The action until release 4 uses the npm bin command, which apparently doesn't work on npm v9. A fix is introduced with v4.3 of this action. If you need an older version of the action working it works until v3.3 and between v3.3 and v4.2 you could use the workaround described in https://github.com/creyD/prettier_action/issues/113 by adding the below to your workflow file:

```
- name: Install npm v8
  run: npm i -g npm@8
```

## Star History

<a href="https://www.star-history.com/#creyD/prettier_action&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=creyD/prettier_action&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=creyD/prettier_action&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=creyD/prettier_action&type=Date" />
 </picture>
</a>
# action.yml
name: Prettier Action
description: Automatically runs prettier on all your changes.

author: Conrad Großer <grosserconrad@gmail.com>

inputs:
commit*message:
description: Commit message, will be ignored if used with same_commit
required: false
default: "Prettified Code!"
commit_description:
description: Extended commit message, will be ignored if used with same_commit
required: false
default: ""
same_commit:
description: Update the current commit instead of creating a new one
required: false
default: false
commit_options:
description: Commit options
required: false
push_options:
description: Git push options
required: false
file_pattern:
description: File pattern used for `git add`, can't be used with only_changed or only_changed_pr!
required: false
default: "*"
prettier*options:
description: Options for the `prettier` command
required: false
default: "--write \*\*/*.js"
dry:
description: Running the script in dry mode just shows whether there are files that should be prettified or not
required: false
default: false
no_commit:
description: Can be used to avoid committing the changes (can be combined with dry mode, useful when another workflow steps commits after this commit anyways)
required: false
default: false
prettier_version:
description: Specific version of prettier (by default just use the latest version)
required: false
default: "latest"
working_directory:
description: Specify a directory to cd into before installing prettier and running it
required: false
default: ${{ github.action_path }}
only_changed:
description: Only prettify files changed in the last commit, can't be used with file_pattern!
required: false
default: false
only_changed_pr:
description: Only prettify files changed in the current PR. If specified with only_changed, only_changed will take precedent. Can't be used with file_pattern!
required: false
default: false
prettier_plugins:
description: Install Prettier plugins, i.e. `@prettier/plugin-php @prettier/plugin-other`
required: false
default: ""
github_token:
description: GitHub Token or PAT token used to authenticate against a repository
required: false
default: ${{ github.token }}
clean_node_folder:
description: Remove the node_modules folder before committing changes
required: false
default: true
git_identity:
description: Which identity is used for git name/email when committing changes. Needs to be one of "actions" or "author".
required: false
default: "actions"
allow_other_plugins:
description: Allow other plugins to be installed. By default, we are checking if the plugins are actually prettier plugins.
required: false
default: false

runs:
using: "composite"
steps: - name: Prettify code!
shell: bash
run: >-
PATH=$GITHUB_ACTION_PATH/node_modules/.bin:$PATH
${{ github.action_path }}/entrypoint.sh
env:
INPUT_COMMIT_MESSAGE: ${{ inputs.commit_message }}
INPUT_COMMIT_DESCRIPTION: ${{ inputs.commit_description }}
INPUT_SAME_COMMIT: ${{ inputs.same_commit }}
INPUT_COMMIT_OPTIONS: ${{ inputs.commit_options }}
INPUT_PUSH_OPTIONS: ${{ inputs.push_options }}
INPUT_FILE_PATTERN: ${{ inputs.file_pattern }}
INPUT_PRETTIER_OPTIONS: ${{ inputs.prettier_options }}
INPUT_DRY: ${{ inputs.dry }}
INPUT_NO_COMMIT: ${{ inputs.no_commit }}
INPUT_PRETTIER_VERSION: ${{ inputs.prettier_version }}
INPUT_ONLY_CHANGED: ${{ inputs.only_changed }}
INPUT_ONLY_CHANGED_PR: ${{ inputs.only_changed_pr }}
INPUT_PRETTIER_PLUGINS: ${{ inputs.prettier_plugins }}
INPUT_WORKING_DIRECTORY: ${{ inputs.working_directory }}
INPUT_GITHUB_TOKEN: ${{ inputs.github_token }}
INPUT_CLEAN_NODE_FOLDER: ${{ inputs.clean_node_folder }}
INPUT_GIT_IDENTITY: ${{ inputs.git_identity }}
INPUT_ALLOW_OTHER_PLUGINS: ${{ inputs.allow_other_plugins }}

branding:
icon: "award"
color: "green"
