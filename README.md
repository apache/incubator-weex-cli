# Weex Toolkit

![image | left](https://img.shields.io/badge/PRs-welcome-brightgreen.svg "")
![image | left](https://img.shields.io/badge/license-Apache--2.0-brightgreen.svg "")
[![GitHub issues](https://img.shields.io/github/issues/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/issues)
[![Npm package](https://img.shields.io/npm/dm/weex-toolkit.svg)](https://www.npmjs.com/package/weex-toolkit)

[中文文档](./README-zh.md) | [FAQ](#faq)

## Introduction

[weex-toolkit](https://github.com/weexteam/weex-toolkit) is the official command line tool for helping developers create, debug and build their Weex project.

## Install

``` bash
$ npm install -g weex-toolkit
```
You can use the `weex -v` command to confirm that the installation was successful.

If you have never installed node.js, you should go to [nodejs.org]( https://nodejs.org/en/) to download and install it.
> **NOTE:** The node version must be 6.0 or higher, you can try [n](https://github.com/tj/n) to manage your node versions, and we recommend that you use `npm4` before fixing the [konw issues](https://github.com/npm/npm/issues/16991) on `npm5`. If an error occurs while installing, please go [weex-toolkit issues](https://github.com/weexteam/weex-toolkit/issues) or [weex-toolkit faq](https://github.com/weexteam/weex-toolkit#faq) to find solutions or have a discussion with us.


## Commands

### create
```bash
$ weex create awesome-project
```
Creates a new weex project. Executing this command will create an `awesome-project` directory with a pre-populated Weex template.

Useful npm scripts are provided with your project to help you in the future:

- `build`: Builds the source code and generate the JS bundle
- `dev`: Runs webpack watch configuration
- `serve`: Starts a hot-reload web server

Before you can start your project, first run the `npm i` command in your project's directory to install the project's dependencies. After the dependencies are installed, you can now run the `npm start` command. The development page will automatically open within your browser after the application has fully started.

### preview

weex-toolkit supports previewing your Weex file(`.vue`) in a watch mode. You only need to specify your file path.

``` bash
$ weex preview src/foo.vue
```

The browser will automatically open the preview page where you can see the layout and effects of your weex page. If you have a [Playground](https://weex.apache.org/cn/playground.html) app on your mobile device(s), you can scan the QR code from the opened page.

To preview the whole directory files, you can use the following command:

``` bash
$ weex preview src --entry src/foo.vue
```

You will need to specify the folder path and the entry file (passed in via `--entry`).

### compile

Use `weex compile` to compile a single weex file or a collection of weex files from a source folder.

``` bash
$ weex compile [source] [dist]  [options]
```

#### options

| Option        | Description    | 
| --------   | :-----   |
|`-w, --watch`        | Watch for file changes. Automatticly builds and refreshes the debugger page! [default `true`]|
|`-d,--devtool [devtool]`        |Set webpack devtool mode.|
|`-e,--ext [ext]`        | Set enabled extname for compiler. [default `vue`] |
|`-m, --min`| Set jsbundle uglify or not. [default `false`]|

Usage Example:

``` bash
$ weex compile src dest --devtool source-map -m
```

### platform

Use `weex platform [add|remove] [ios|android]` to add or remove ios and android project templates.

``` bash
$ weex platform add ios
$ weex platform remove ios
```
Use `weex platform list` to show the available supported platforms for your application.

### run

You can use `weex-toolkit` to run the project on the `android`, `ios` and `web` platforms.

``` bash
$ weex run ios
$ weex run android
$ weex run web
```

### build

You can use `weex-toolkit` to build the project for the `android`, `ios` and `web` platforms.

``` bash
$ weex build ios
$ weex build android
$ weex build web
```
### plugin

Plugin documentation is still in progress.

### debug

** [Weex devtools](https://github.com/weexteam/weex-debugger) ** is a custom developer toolkit designed to help you quickly inspect your app and debug the JS bundle source file right from a Chrome web page. This is made possible with the implementation of the [Chrome Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol). Both Android and iOS platforms are supported. You can start using the weex-devtools feature right from the weex-toolkit.

## FAQ

#### #Environment
Please make sure that the node version is above 6.0 and npm version is above 5.0.

If you want to change the origin of the npm registry, do not use `cnpm`. We recommend using the `nrm` or `npm config set registry https://registry.npm.taobao.org` command.

#### #Current working directory is not a weexpack project
As of version 1.0.9, the `weex init` command has been removed. To create a weex project, use the` weex create` command.

#### #Permission denied
First of all, please do not install with "sudo" 
If a `permission denied` error occurs, please try `sudo chmod 777 /usr/local/lib/node_modules`

If the following error occurs:
```
Error: permission denied. Please apply the write permission to the directory: "/Users/yourUserName"
```
We suggest you run the command `sudo chmod 777 ~` or `mkdir ~/.xtoolkit && chmod 777 ~/.xtoolkit`.

#### #Fsevents wanted error
Windows users may have fsevents installation problems, for example:
```
fsevents@1.1.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"ia32"})
```
To avoid this error, install weex-toolkit without the optional dependencies with the following command:

```
npm install --no-optional weex-toolkit -g
``` 

#### #Vue dismatch error

Try:

```
weex xbind repair toolkit-repair
weex repair
```

#### #Upgrade Error
If you encounter an error during the upgrade process, please check that the version of your npm is above 5.0.

Then reload it with the following commands:
```
rm -rf ~/.xtoolkit
npm un weex-toolkit -g
npm i weex-toolkit -g
```

#### Android SDK Environment

If you want to run an Android project, you can use the [Android Emulator from Android Studio](https://developer.android.com/studio/run/emulator.html) or a [real device](https://developer.android.com/studio/run/device.html).

If you install Android SDK from Android Studio, please ensure to install the [Android 6.0 API](https://developer.android.com/about/versions/marshmallow/android-6.0.html).

#### spawn E2BIG

This problem may occur when using the following commands `weex create|init|run|platform`.
Please update your weexpack to the latest version to resolve this issue.
```
$ weex update weexpack
```
If there are errors while updating the weexpack, please remove `~/.xtoolkit` and try to update again.
```
$ rm -rf ~/.xtoolkit
$ weex update weexpack
```
#### Encountered "Cannot read property 'xxx'" error while using weex modules

Description:
This is a typical `Hoisting` issue. Please take a look at the [MDN Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) documentation for the steps to resolve this issue:

1. If you want to fix an existing project:

In the file `webpack.common.config.js`, located in the `configs` directory, change:
```
contents += `\nimport App from '${relativeVuePath}';\n`;
```
to 
```
contents += `\nconst App = require('${relativeVuePath}');\n`;
```
2. If you want to create a normal weex project:

Upgrade your `weexpack` to the latest version by using the command `weex update weexpack@latest`, then re-create the project again. The latest version should above `v1.0.13`.

see: [weex-toolkit/issues/268](https://github.com/weexteam/weex-toolkit/issues/268)

#### #Tips

If you have any unsolvable problems, try and check your system environment, your installed package version (`weex -v`), and upgrading to the latest package (`weex update weex-devtool@latest`) to see if the problems are resolved.



## Issue & Feedback

 [Github Issue List](https://github.com/weexteam/weex-toolkit/issues)
