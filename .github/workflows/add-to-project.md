# actions/add-to-project

Use this action to automatically add the current issue or pull request to a [GitHub project](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/about-projects).
Note that this action does not support [GitHub projects (classic)](https://docs.github.com/en/issues/organizing-your-work-with-project-boards).

## Current Status

[![build-test](https://github.com/actions/add-to-project/actions/workflows/test.yml/badge.svg)](https://github.com/actions/add-to-project/actions/workflows/test.yml)

## Usage

_See [action.yml](action.yml) for [metadata](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions) that defines the inputs, outputs, and runs configuration for this action._

_For more information about workflows, see [Using workflows](https://docs.github.com/en/actions/using-workflows)._

Create a workflow that runs when Issues or Pull Requests are opened or labeled in your repository; this workflow also supports adding Issues to your project which are transferred into your repository. Optionally configure any filters you may want to add, such as only adding issues with certain labels. You may match labels with an `AND` or an `OR` operator, or exclude labels with a `NOT` operator.

Once you've configured your workflow, save it as a `.yml` file in your target Repository's `.github/workflows` directory.

### Examples

#### Example Usage: Issue opened with labels `bug` OR `needs-triage`

```yaml
name: Add bugs to bugs project

on:
  issues:
    types:
      - opened

jobs:
  add-to-project:
    name: Add issue to project
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@RELEASE_VERSION
        with:
          # You can target a project in a different organization
          # to the issue
          project-url: https://github.com/orgs/<orgName>/projects/<projectNumber>
          github-token: ${{ secrets.ADD_TO_PROJECT_PAT }}
          labeled: bug, needs-triage
          label-operator: OR
```

#### Example Usage: Adds all issues opened that do not include the label `bug` OR `needs-triage`

```yaml
name: Adds all issues that don't include the 'bug' or 'needs-triage' labels to project board

on:
  issues:
    types:
      - opened

jobs:
  add-to-project:
    name: Add issue to project
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@RELEASE_VERSION
        with:
          project-url: https://github.com/orgs/<orgName>/projects/<projectNumber>
          github-token: ${{ secrets.ADD_TO_PROJECT_PAT }}
          labeled: bug, needs-triage
          label-operator: NOT
```

#### Example Usage: Pull Requests labeled with `needs-review` and `size/XL`

```yaml
name: Add needs-review and size/XL pull requests to projects

on:
  pull_request:
    types:
      - labeled

jobs:
  add-to-project:
    name: Add pull request to project
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@RELEASE_VERSION
        with:
          project-url: https://github.com/orgs/<orgName>/projects/<projectNumber>
          github-token: ${{ secrets.ADD_TO_PROJECT_PAT }}
          labeled: needs-review, size/XL
          label-operator: AND
```

### Further reading and additional resources

- [actions/add-to-project](#actionsadd-to-project)
  - [Current Status](#current-status)
  - [Usage](#usage)
    - [Examples](#examples)
      - [Example Usage: Issue opened with labels `bug` OR `needs-triage`](#example-usage-issue-opened-with-labels-bug-or-needs-triage)
      - [Example Usage: Adds all issues opened that do not include the label `bug` OR `needs-triage`](#example-usage-adds-all-issues-opened-that-do-not-include-the-label-bug-or-needs-triage)
      - [Example Usage: Pull Requests labeled with `needs-review` and `size/XL`](#example-usage-pull-requests-labeled-with-needs-review-and-sizexl)
    - [Further reading and additional resources](#further-reading-and-additional-resources)
  - [Inputs](#inputs)
  - [Supported Events](#supported-events)
  - [Creating a PAT and adding it to your repository](#creating-a-pat-and-adding-it-to-your-repository)
  - [Development](#development)
  - [Publish to a distribution branch](#publish-to-a-distribution-branch)
- [License](#license)

## Inputs

- <a name="project-url">`project-url`</a> **(required)** is the URL of the GitHub project to add issues to.
  _eg: `https://github.com/orgs|users/<ownerName>/projects/<projectNumber>`_
- <a name="github-token">`github-token`</a> **(required)** is a [personal access
  token](https://github.com/settings/tokens/new) with `repo` and `project` scopes.
  _See [Creating a PAT and adding it to your repository](#creating-a-pat-and-adding-it-to-your-repository) for more details_
- <a name="labeled">`labeled`</a> **(optional)** is a comma-separated list of labels used to filter applicable issues. When this key is provided, an issue must have _one_ of the labels in the list to be added to the project. Omitting this key means that any issue will be added.
- <a name="labeled">`label-operator`</a> **(optional)** is the behavior of the labels filter, either `AND`, `OR` or `NOT` that controls if the issue should be matched with `all` `labeled` input or any of them, default is `OR`.

## Supported Events

Currently this action supports the following [`issues` events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issues):

- `opened`
- `reopened`
- `transferred`
- `labeled`

and the following [`pull_request` events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request):

- `opened`
- `reopened`
- `labeled`

Using these events ensure that a given issue or pull request, in the workflow's repo, is added to the [specified project](#project-url). If [labeled input(s)](#labeled) are defined, then issues will only be added if they contain at least _one_ of the labels in the list.

## Creating a PAT and adding it to your repository

- Create a new [personal access token](https://github.com/settings/tokens/new). _See [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for more information_
  - For **Tokens (classic)** include the `project` scope; for private repos you will also need `repo` scope.
  - For **Fine-grained tokens**, you must first select the appropriate _owner_ and associated _repositories_. Then select _Organization permissions -> `projects` `read & write`_, and _Repository permissions -> `issues` `read-only`_ and _`pull requests` `read-only`_.

- add the newly created PAT as a repository secret, this secret will be referenced by the [github-token input](#github-token)
  _See [Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) for more information_

## Setting a specific status or column name to the project item

If you want to add an issue to a custom default column in a project (i.e. other than 'Todo'), you can do this directly via the project UI. You don't need to add anything else to your YAML workflow file to get this to work.

Use the [Add To GitHub Projects](https://github.com/marketplace/actions/add-to-github-projects) action to assign newly opened issues to the project. And then in the project UI simply [specify which column to use as the default](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/quickstart-for-projects#configure-built-in-automation)!

## Development

To get started contributing to this project, clone it and install dependencies.
Note that this action runs in Node.js 20.x, so we recommend using that version
of Node (see "engines" in this action's package.json for details).

```shell
> git clone https://github.com/actions/add-to-project
> cd add-to-project
> npm install
```

Or, use [GitHub Codespaces](https://github.com/features/codespaces).

See the [toolkit
documentation](https://github.com/actions/toolkit/blob/master/README.md#packages)
for the various packages used in building this action.

## Publish to a distribution branch

Actions are run from GitHub repositories, so we check in the packaged action in
the "dist/" directory.

```shell
> npm run build
> git add lib dist
> git commit -a -m "Build and package"
> git push origin releases/v1
```

Now, a release can be created from the branch containing the built action.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# action.yml

name: Add To GitHub projects
description: Automatically add issues and PRs to GitHub projects
author: GitHub
branding:
icon: table
color: white
inputs:
project-url:
required: true
description: URL of the project to add issues to
github-token:
required: true
description: A GitHub personal access token with write access to the project
labeled:
required: false
description: A comma-separated list of labels to use as a filter for issue to be added
label-operator:
required: false
description: The behavior of the labels filter, AND to match all labels, OR to match any label, NOT to exclude any listed label (default is OR)
outputs:
itemId:
description: The ID of the item that was added to the project
runs:
using: 'node20'
main: 'dist/index.js'

# Metadata syntax reference

You can create actions to perform tasks in your repository. If you’re making a custom action, it will require a metadata file that uses YAML syntax.
In this article
Note

You can build Docker container, JavaScript, and composite actions. Actions require a metadata file to define the inputs, outputs, and runs configuration for your action. Action metadata files use YAML syntax, and the metadata filename must be either action.yml or action.yaml. The preferred format is action.yml.
name

Required The name of your action. GitHub displays the name in the Actions tab to help visually identify actions in each job.

author

Optional The name of the action's author.

description

Required A short description of the action.

inputs

Optional Input parameters allow you to specify data that the action expects to use during runtime. GitHub stores input parameters as environment variables. We recommend using lowercase input ids.

Example: Specifying inputs

This example configures two inputs: num-octocats and octocat-eye-color. The num-octocats input is not required and will default to a value of 1. octocat-eye-color is required and has no default value.

Note

Actions using required: true will not automatically return an error if the input is not specified.
Workflow files that use this action can use the with keyword to set an input value for octocat-eye-color. For more information about the with syntax, see Workflow syntax for GitHub Actions.

inputs:
num-octocats:
description: 'Number of Octocats'
required: false
default: '1'
octocat-eye-color:
description: 'Eye color of the Octocats'
required: true
When you specify an input, GitHub creates an environment variable for the input with the name INPUT*<VARIABLE_NAME>. The environment variable created converts input names to uppercase letters and replaces spaces with * characters.

If the action is written using a composite, then it will not automatically get INPUT\_<VARIABLE_NAME>. With composite actions you can use inputs Contexts reference to access action inputs.

To access the environment variable in a Docker container action, you must pass the input using the args keyword in the action metadata file. For more information about the action metadata file for Docker container actions, see Creating a Docker container action.

For example, if a workflow defined the num-octocats and octocat-eye-color inputs, the action code could read the values of the inputs using the INPUT_NUM-OCTOCATS and INPUT_OCTOCAT-EYE-COLOR environment variables.

inputs.<input_id>

Required A string identifier to associate with the input. The value of <input*id> is a map of the input's metadata. The <input_id> must be a unique identifier within the inputs object. The <input_id> must start with a letter or * and contain only alphanumeric characters, -, or \_.

inputs.<input_id>.description

Required A string description of the input parameter.

inputs.<input_id>.required

Optional A boolean to indicate whether the action requires the input parameter. Set to true when the parameter is required.

inputs.<input_id>.default

Optional A string representing the default value. The default value is used when an input parameter isn't specified in a workflow file.

inputs.<input_id>.deprecationMessage

Optional If the input parameter is used, this string is logged as a warning message. You can use this warning to notify users that the input is closing down and mention any alternatives.

outputs for Docker container and JavaScript actions

Optional Output parameters allow you to declare data that an action sets. Actions that run later in a workflow can use the output data set in previously run actions. For example, if you had an action that performed the addition of two inputs (x + y = z), the action could output the sum (z) for other actions to use as an input.

Outputs can be a maximum of 1 MB per job. The total of all outputs in a workflow run can be a maximum of 50 MB. Size is approximated based on UTF-16 encoding.

If you don't declare an output in your action metadata file, you can still set outputs and use them in a workflow. For more information on setting outputs in an action, see Workflow commands for GitHub Actions.

Example: Declaring outputs for Docker container and JavaScript actions

outputs:
sum: # id of the output
description: 'The sum of the inputs'
outputs.<output_id>

Required A string identifier to associate with the output. The value of <output*id> is a map of the output's metadata. The <output_id> must be a unique identifier within the outputs object. The <output_id> must start with a letter or * and contain only alphanumeric characters, -, or \_.

outputs.<output_id>.description

Required A string description of the output parameter.

outputs for composite actions

Optional outputs use the same parameters as outputs.<output_id> and outputs.<output_id>.description (see outputs for Docker container and JavaScript actions), but also includes the value token.

Outputs can be a maximum of 1 MB per job. The total of all outputs in a workflow run can be a maximum of 50 MB. Size is approximated based on UTF-16 encoding.

Example: Declaring outputs for composite actions

outputs:
random-number:
description: "Random number"
value: ${{ steps.random-number-generator.outputs.random-id }}
runs:
  using: "composite"
  steps:
    - id: random-number-generator
      run: echo "random-id=$(echo $RANDOM)" >> $GITHUB_OUTPUT
shell: bash
outputs.<output_id>.value

Required The value that the output parameter will be mapped to. You can set this to a string or an expression with context. For example, you can use the steps context to set the value of an output to the output value of a step.

For more information on how to use context syntax, see Contexts reference.

runs

Required Specifies whether this is a JavaScript action, a composite action, or a Docker container action and how the action is executed.

runs for JavaScript actions

Required Configures the path to the action's code and the runtime used to execute the code.

Example: Using Node.js v24

runs:
using: 'node24'
main: 'main.js'
runs.using for JavaScript actions

Required The runtime used to execute the code specified in main.

Use node20 for Node.js v20.
Use node24 for Node.js v24.
runs.main

Required The file that contains your action code. The runtime specified in using executes this file.

runs.pre

Optional Allows you to run a script at the start of a job, before the main: action begins. For example, you can use pre: to run a prerequisite setup script. The runtime specified with the using syntax will execute this file. The pre: action always runs by default but you can override this using runs.pre-if.

Note

runs.pre is not supported for local actions.
In this example, the pre: action runs a script called setup.js:

runs:
using: 'node24'
pre: 'setup.js'
main: 'index.js'
post: 'cleanup.js'
runs.pre-if

Optional Allows you to define conditions for the pre: action execution. The pre: action will only run if the conditions in pre-if are met. If not set, then pre-if defaults to always(). In pre-if, status check functions evaluate against the job's status, not the action's own status.

Note that the step context is unavailable, as no steps have run yet.

In this example, cleanup.js only runs on Linux-based runners:

pre: 'cleanup.js'
pre-if: runner.os == 'linux'
runs.post

Optional Allows you to run a script at the end of a job, once the main: action has completed. For example, you can use post: to terminate certain processes or remove unneeded files. The runtime specified with the using syntax will execute this file.

In this example, the post: action runs a script called cleanup.js:

runs:
using: 'node24'
main: 'index.js'
post: 'cleanup.js'
The post: action always runs by default but you can override this using post-if.

runs.post-if

Optional Allows you to define conditions for the post: action execution. The post: action will only run if the conditions in post-if are met. If not set, then post-if defaults to always(). In post-if, status check functions evaluate against the job's status, not the action's own status.

For example, this cleanup.js will only run on Linux-based runners:

post: 'cleanup.js'
post-if: runner.os == 'linux'
runs for composite actions

Required Configures the path to the composite action.

runs.using for composite actions

Required You must set this value to 'composite'.

runs.steps

Required The steps that you plan to run in this action. These can be either run steps or uses steps.

runs.steps[*].run

Optional The command you want to run. This can be inline or a script in your action repository:

runs:
using: "composite"
steps: - run: ${{ github.action_path }}/test/script.sh
shell: bash
Alternatively, you can use $GITHUB_ACTION_PATH:

runs:
using: "composite"
steps: - run: $GITHUB_ACTION_PATH/script.sh
shell: bash
For more information, see Contexts reference.

runs.steps[*].shell

Optional The shell where you want to run the command. You can use any of the shells listed in Workflow syntax for GitHub Actions. Required if run is set.

runs.steps[*].if

Optional You can use the if conditional to prevent a step from running unless a condition is met. You can use any supported context and expression to create a conditional.

When you use expressions in an if conditional, you can, optionally, omit the ${{ }} expression syntax because GitHub Actions automatically evaluates the if conditional as an expression. However, this exception does not apply everywhere.

You must always use the ${{ }} expression syntax or escape with '', "", or () when the expression starts with !, since ! is reserved notation in YAML format. For example:

if: ${{ ! startsWith(github.ref, 'refs/tags/') }}
For more information, see Evaluate expressions in workflows and actions.

Example: Using contexts

This step only runs when the event type is a pull_request and the event action is unassigned.

steps:

- run: echo This event is a pull request that had an assignee removed.
  if: ${{ github.event_name == 'pull_request' && github.event.action == 'unassigned' }}
  Example: Using status check functions

The my backup step only runs when the previous step of a composite action fails. For more information, see Evaluate expressions in workflows and actions.

steps:

- name: My first step
  uses: octo-org/action-name@main
- name: My backup step
  if: ${{ failure() }}
  uses: actions/heroku@1.0.0
  runs.steps[*].name

Optional The name of the composite step.

runs.steps[*].id

Optional A unique identifier for the step. You can use the id to reference the step in contexts. For more information, see Contexts reference.

runs.steps[*].env

Optional Sets a map of environment variables for only that step. If you want to modify the environment variable stored in the workflow, use echo "{name}={value}" >> $GITHUB_ENV in a composite step.

runs.steps[*].working-directory

Optional Specifies the working directory where the command is run.

runs.steps[*].uses

Optional Selects an action to run as part of a step in your job. An action is a reusable unit of code. You can use an action defined in the same repository as the workflow, a public repository, or in a published Docker container image.

We strongly recommend that you include the version of the action you are using by specifying a Git ref, SHA, or Docker tag number. If you don't specify a version, it could break your workflows or cause unexpected behavior when the action owner publishes an update.

Using the commit SHA of a released action version is the safest for stability and security.
Using the specific major action version allows you to receive critical fixes and security patches while still maintaining compatibility. It also assures that your workflow should still work.
Using the default branch of an action may be convenient, but if someone releases a new major version with a breaking change, your workflow could break.
Some actions require inputs that you must set using the with keyword. Review the action's README file to determine the inputs required.

runs:
using: "composite"
steps: # Reference a specific commit - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3 # Reference the major version of a release - uses: actions/checkout@v5 # Reference a specific version - uses: actions/checkout@v5.2.0 # Reference a branch - uses: actions/checkout@main # References a subdirectory in a public GitHub repository at a specific branch, ref, or SHA - uses: actions/aws/ec2@main # References a local action - uses: ./.github/actions/my-action # References a docker public registry action - uses: docker://gcr.io/cloud-builders/gradle # Reference a docker image published on docker hub - uses: docker://alpine:3.8
runs.steps[*].with

Optional A map of the input parameters defined by the action. Each input parameter is a key/value pair. For more information, see Example: Specifying inputs.

runs:
using: "composite"
steps: - name: My first step
uses: actions/hello_world@main
with:
first_name: Mona
middle_name: The
last_name: Octocat
runs.steps[*].continue-on-error

Optional Prevents the action from failing when a step fails. Set to true to allow the action to pass when this step fails.

runs for Docker container actions

Required Configures the image used for the Docker container action.

Example: Using a Dockerfile in your repository

runs:
using: 'docker'
image: 'Dockerfile'
Example: Using public Docker registry container

runs:
using: 'docker'
image: 'docker://debian:stretch-slim'
runs.using for Docker container actions

Required You must set this value to 'docker'.

runs.pre-entrypoint

Optional Allows you to run a script before the entrypoint action begins. For example, you can use pre-entrypoint: to run a prerequisite setup script. GitHub Actions uses docker run to launch this action, and runs the script inside a new container that uses the same base image. This means that the runtime state is different from the main entrypoint container, and any states you require must be accessed in either the workspace, HOME, or as a STATE\_ variable. The pre-entrypoint: action always runs by default but you can override this using runs.pre-if.

The runtime specified with the using syntax will execute this file.

In this example, the pre-entrypoint: action runs a script called setup.sh:

runs:
using: 'docker'
image: 'Dockerfile'
args: - 'bzz'
pre-entrypoint: 'setup.sh'
entrypoint: 'main.sh'
runs.image

Required The Docker image to use as the container to run the action. The value can be the Docker base image name, a local Dockerfile in your repository, or a public image in Docker Hub or another registry. To reference a Dockerfile local to your repository, the file must be named Dockerfile and you must use a path relative to your action metadata file. The docker application will execute this file.

runs.env

Optional Specifies a key/value map of environment variables to set in the container environment.

runs.entrypoint

Optional Overrides the Docker ENTRYPOINT in the Dockerfile, or sets it if one wasn't already specified. Use entrypoint when the Dockerfile does not specify an ENTRYPOINT or you want to override the ENTRYPOINT instruction. If you omit entrypoint, the commands you specify in the Docker ENTRYPOINT instruction will execute. The Docker ENTRYPOINT instruction has a shell form and exec form. The Docker ENTRYPOINT documentation recommends using the exec form of the ENTRYPOINT instruction.

For more information about how the entrypoint executes, see Dockerfile support for GitHub Actions.

runs.post-entrypoint

Optional Allows you to run a cleanup script once the runs.entrypoint action has completed. GitHub Actions uses docker run to launch this action. Because GitHub Actions runs the script inside a new container using the same base image, the runtime state is different from the main entrypoint container. You can access any state you need in either the workspace, HOME, or as a STATE\_ variable. The post-entrypoint: action always runs by default but you can override this using runs.post-if.

runs:
using: 'docker'
image: 'Dockerfile'
args: - 'bzz'
entrypoint: 'main.sh'
post-entrypoint: 'cleanup.sh'
runs.args

Optional An array of strings that define the inputs for a Docker container. Inputs can include hardcoded strings. GitHub passes the args to the container's ENTRYPOINT when the container starts up.

The args are used in place of the CMD instruction in a Dockerfile. If you use CMD in your Dockerfile, use the guidelines ordered by preference:

Document required arguments in the action's README and omit them from the CMD instruction.
Use defaults that allow using the action without specifying any args.
If the action exposes a --help flag, or something similar, use that to make your action self-documenting.
If you need to pass environment variables into an action, make sure your action runs a command shell to perform variable substitution. For example, if your entrypoint attribute is set to "sh -c", args will be run in a command shell. Alternatively, if your Dockerfile uses an ENTRYPOINT to run the same command ("sh -c"), args will execute in a command shell.

For more information about using the CMD instruction with GitHub Actions, see Dockerfile support for GitHub Actions.

Example: Defining arguments for the Docker container

runs:
using: 'docker'
image: 'Dockerfile'
args: - ${{ inputs.greeting }} - 'foo' - 'bar'
branding

Optional You can use a color and Feather icon to create a badge to personalize and distinguish your action. Badges are shown next to your action name in GitHub Marketplace.

Example: Configuring branding for an action

branding:
icon: 'award'
color: 'green'
branding.color

The background color of the badge. Can be one of: white, black, yellow, blue, green, orange, red, purple, or gray-dark.

branding.icon

The name of the v4.28.0 Feather icon to use.

Omitted icons

Brand icons, and all the following icons, are omitted.

coffee
columns
divide-circle
divide-square
divide
frown
hexagon
key
meh
mouse-pointer
smile
tool
x-octagon
Exhaustive list of all currently supported icons

activity
airplay
alert-circle
alert-octagon
alert-triangle
align-center
align-justify
align-left
align-right
anchor
aperture
archive
arrow-down-circle
arrow-down-left
arrow-down-right
arrow-down
arrow-left-circle
arrow-left
arrow-right-circle
arrow-right
arrow-up-circle
arrow-up-left
arrow-up-right
arrow-up
at-sign
award
bar-chart-2
bar-chart
battery-charging
battery
bell-off
bell
bluetooth
bold
book-open
book
bookmark
box
briefcase
calendar
camera-off
camera
cast
check-circle
check-square
check
chevron-down
chevron-left
chevron-right
chevron-up
chevrons-down
chevrons-left
chevrons-right
chevrons-up
circle
clipboard
clock
cloud-drizzle
cloud-lightning
cloud-off
cloud-rain
cloud-snow
cloud
code
command
compass
copy
corner-down-left
corner-down-right
corner-left-down
corner-left-up
corner-right-down
corner-right-up
corner-up-left
corner-up-right
cpu
credit-card
crop
crosshair
database
delete
disc
dollar-sign
download-cloud
download
droplet
edit-2
edit-3
edit
external-link
eye-off
eye
fast-forward
feather
file-minus
file-plus
file-text
file
film
filter
flag
folder-minus
folder-plus
folder
gift
git-branch
git-commit
git-merge
git-pull-request
globe
grid
hard-drive
hash
headphones
heart
help-circle
home
image
inbox
info
italic
layers
layout
life-buoy
link-2
link
list
loader
lock
log-in
log-out
mail
map-pin
map
maximize-2
maximize
menu
message-circle
message-square
mic-off
mic
minimize-2
minimize
minus-circle
minus-square
minus
monitor
moon
more-horizontal
more-vertical
move
music
navigation-2
navigation
octagon
package
paperclip
pause-circle
pause
percent
phone-call
phone-forwarded
phone-incoming
phone-missed
phone-off
phone-outgoing
phone
pie-chart
play-circle
play
plus-circle
plus-square
plus
pocket
power
printer
radio
refresh-ccw
refresh-cw
repeat
rewind
rotate-ccw
rotate-cw
rss
save
scissors
search
send
server
settings
share-2
share
shield-off
shield
shopping-bag
shopping-cart
shuffle
sidebar
skip-back
skip-forward
slash
sliders
smartphone
speaker
square
star
stop-circle
sun
sunrise
sunset
table
tablet
tag
target
terminal
thermometer
thumbs-down
thumbs-up
toggle-left
toggle-right
trash-2
trash
trending-down
trending-up
triangle
truck
tv
type
umbrella
underline
unlock
upload-cloud
upload
user-check
user-minus
user-plus
user-x
user
users
video-off
video
voicemail
volume-1
volume-2
volume-x
volume
watch
wifi-off
wifi
wind
x-circle
x-square
x
zap-off
zap
zoom-in
zoom-out
Changing the metadata file name

While the actions metadata file supports both YAML formats, changing the metadata file name (from action.yml to action.yaml or vice versa) between releases will affect previous release versions that have been published to GitHub Marketplace. Changing the file name will hide all release versions associated with the previous file name from GitHub Marketplace. Previous release versions will still be accessible to users through the source repository.

When releasing new versions of actions, only versions released after the metadata file name change will have the GitHub Marketplace tag and will show up on GitHub Marketplace
