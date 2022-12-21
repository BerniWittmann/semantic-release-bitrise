# semantic-release-bitrise

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to start builds on bitrise

[![npm](https://img.shields.io/npm/v/semantic-release-bitrise.svg?style=flat-square)](https://www.npmjs.com/package/semantic-release-bitrise)

| Step      | Description                     |
| --------- | ------------------------------- |
| `success` | Start a new build on bitrise    |

## Install

Add the plugin to your npm-project:

```bash
$ npm install --save-dev semantic-release-bitrise
```

## Usage

The plugin can be configured in the [semantic-release configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
            "semantic-release-bitrise",
            {
                "appSlug": "1234abcd"
            }
        ]
    ]
}
```

## Configuration

### Environment variables

The `BITRISE_ACCESS_TOKEN` variable needs to be defined in the environment where you will run semantic release. Copy and past the token to authenticate with bitrise value to this variable.

### Options

| Option            | Description                                                                                                                                                                                 | Required | Default                                      |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- | :------------------------------------------- |
| `appSlug`     | The AppSlug from bitrise                                                                                                                                  | yes       | - |
| `workflowId` | Sets the id of the workflow to run on bitrise. If none given the default trigger map will be used | no       | -                                         |
| `workflowIdMap` | Sets the id of the workflow to run on bitrise based on a branch. If none given the default trigger map will be used | no       | -                                         |

## Examples

### Setting a specific workflow

```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
            "semantic-release-bitrise",
            {
                "appSlug": "1234abcd",
                "workflowId": "ios-production"
            }
        ]
    ]
}
```

### Setting a specific workflow for a specific branch name

```json
{
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
            "semantic-release-bitrise",
            {
                "appSlug": "1234abcd",
                "workflowIdMap": {
                    "main": "ios-production",
                    "develop": "ios-stage"
                }
            }
        ]
    ]
}
```
