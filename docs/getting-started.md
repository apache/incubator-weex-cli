# Getting started

!> If you don't have node.js installed locally, you can go to [Nodejs official website](https://nodejs.org/en/) to download and install, and make sure your node version is `>=7.6.0`, you can use [n]( Https://github.com/tj/n) to perform version management of node.


## Installation

If you have problems during the installation process, you can do a question search and feedback at [here](https://github.com/weexteam/weex-toolkit/issues).

``` bash
$ npm install weex-toolkit -g
```

## Commands

### Create a project

```bash
# Create a project from the official template
$ weex create my-project
```

The `@weex-cli/generator` module uses [`download-git-repo`](https://github.com/flipxfx/download-git-repo) to download the template file. The `download-git-repo` tool allows You specify a specific branch and remote repository address for project download, and the specified branch is separated by the (`#`) symbol.

The template format under the download specific branch is as follows:
```bash
$ weex create '<template-name>#<branch-name>' <project-name>
```

E.g:

```bash
$ weex create weex-templates/webpack#v1.0 my-project
```

This command will initialize the project via the `v1.0` branch of the [weex-templates/webpack](https://github.com/weex-templates/webpack/tree/v1.0) project.

You can create project templates from official templates or remote sources, or you can create your own `weex` project templates. For more details you can see [How to create your own templates](https://github.com/weex-templates /How-to-create-your-own-template).

### Compile page

The `@weex-cli/compile` module provides the ability to compile `.vue` files in Weex projects. You can use them in official projects, or you can directly compile sandboxes with zero configuration for a single `.vue` file, use as follows:

```bash
$ weex compile [resource file] [product address] <options>
```

E.g:

```bash
$ weex compile src build
```

or

```bash
$ weex compile src/index.vue build
```

#### Options

| Options | Description |
| -------- | :----- |
|`-w, --watch` | Listen for file changes and compile in real time [Default: `true`]|
|`-d,--devtool [devtool]` |Set the devtool option for webpack compilation|
|`-e,--ext [ext]` | Set the default build file [Default: `.vue`] |
|`-m, --min`| Code obfuscation and compression of the product [Default: `false`]|
|`-c, --config`| Incoming webpack configuration file [Default: `false`]|
|`-b, --base`| Set the base path [Default: `process.cwd()`]|

### Preview page

The `@weex-cli/preview` module provides the ability to compile and preview `.vue` files in Weex projects. You can use them in official projects, or you can directly perform a sandbox preview of zero configuration for a single `.vue` file, use as follows:

``` bash
$ weex preview [file | folder] <options>
```

The browser will automatically open the preview page and you can see the layout and effects of your weex page. If you have [Weex Playground App](/tools/) installed on your device, you can also view the page by scanning the QR code on the page.

Using the command below, you will be able to preview the `.vue` file in the entire folder.

``` bash
$ weex src --entry src/foo.vue
```

You need to specify the folder path to be previewed and the entry file (passed in `--entry`).

#### Options

| Options | Description |
| -------- | :----- |
|`-d,--devtool [devtool]` |Set the devtool option for webpack compilation|
|`-m, --min`| Code obfuscation and compression of the product [Default: `false`]|
|`-c, --config`| Incoming webpack configuration file [Default: `false`]|
|`-b, --base`| Set the base path [Default: `process.cwd()`]|

### Add iOS/Android project

The `@weex-cli/generator` module provides the ability to add Weex official iOS/Android engineering features.

Use the `weex platform [add|remove] [ios|android]` command to add or remove the `iOS/Android` project template.

``` bash
$ weex platform add ios
$ weex platform remove ios
```

This command is only valid in the official `weex` project. Please note the project structure. You can use `weex platform list` to view the supported platforms in your project.

### Running iOS/Android Project

The `@weex-cli/run` module provides the ability to add and run Weex official iOS/Android project functions, which you can use with the following commands:

``` bash
# Run iOS Simulator Preview
$ weex run ios
# Run Android Simulator / Real Machine Preview
$ weex run android
# Run web preview
$ weex run web
```

### Debugging page

The `@weex-cli/debug` module provides debugging capabilities for Weex pages, which can be started with the following command:

``` bash
$ weex debug [we_file|bundles_dir] [options]
```

#### Options

| Options | Description |
| -------- | :----- |
|`-p, --port [port]`| Set the port of the debug server, [default: `8088`]|
|`--manual`| When this option is enabled, the browser will not open automatically, [Default: `false`]|
|`--channelid`|Specify debug channel ID|
|`--remote-debug-port [port]`|Set the debug server port number, [default: `9222`]|



#### How to integrate debugging tools into your own app

Reference documentation:
- [1] [Integrated Weex Debugging Tool (Android)](https://weex.apache.org/guide/debug/integrate-devtool-to-android.html)
- [2] [Integrated Weex Debugging Tool (iOS)](https://weex.apache.org/guide/debug/integrate-devtool-to-ios.html)


### Code Quality Check

The `@weex-cli/lint` module provides a Weex code quality check function that can be started with the following command:

```base
$ weex lint [file | folder] <options>
```

#### Options

`@weex-cli/lint` The built-in `eslint` module is used for code quality verification. For options, please refer to [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface).

If you want to add the `weex` code quality check to your project, you can also add the eslint plugin [eslint-plugin-weex](https://www.npmjs.com/package/eslint-plugin-weex) Way to use.


### Development Environment Check

The `@weex-cli/doctor` module provides a check for the local development environment and can be started with the following command:

```base
$ weex doctor
```

This command will check your local development environment, you can adjust your development environment according to the prompts, in order to develop the weex page.
