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
# create a new project with an official template
$ weex create my-project

# create a new project straight from a github template
$ weex create username/repo my-project
```
Create a new project with an official template or from other remote, also you can create your own weex template, more detail you can see [How-to-create-your-own-template](https://github.com/weex-templates/How-to-create-your-own-template).

### preview

weex-toolkit supports previewing your Weex file(`.vue`) in a watch mode. You only need specify your file path.

``` bash
$ weex preview src/foo.vue
```

The browser automatically opens the preview page and you can see the layout and effects of your weex page. If you have a [Playground App](/tools/playground.html) in your mobile devices, you can scan the QR code at the opened page.

Try the command below, you’ll preview the whole directory files.

``` bash
$ weex preview src --entry src/foo.vue
```

You need to specify the folder path to preview and the entry file (passed in via `--entry`).

### compile

Use `weex compile` o compile a single weex file or a weex file in an entire folder.

``` bash
$ weex compile [source] [dist]  [options]
```

#### options

| Option        | Description    |
| --------   | :-----   |
|`-w, --watch`        | watch we file changes auto build them and refresh debugger page! [default `true`]|
|`-d,--devtool [devtool]`        |set webpack devtool mode|
|`-e,--ext [ext]`        | set enabled extname for compiler default is vue |
|`-m, --min`| set jsbundle uglify or not. [default `false`]|

You can use like this:

``` bash
$ weex compile src dest --devtool source-map -m
```

### platform

Use `weex platform [add|remove|update] [ios|android]` to add, remove or update your ios / android project templates.

``` bash
# add weex platform
$ weex platform add [ios|android]

# remove weex platform
$ weex platform remove [ios|android]

# update weex platform
$ weex platform update [ios|android]

# list weex platform
$ weex platform list
```
Use `weex platform list` to show what platforms your application supported.

### run

You can use `weex-toolkit` to run project on android/ios/web.

``` bash
# run weex Android project
$ weex run android

# run weex iOS project
$ weex run ios

# run weex web
$ weex run web
```

### debug

** [Weex devtools](https://github.com/weexteam/weex-devtool) ** is a custom devtools for Weex that implements [Chrome Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol), it is designed to help you quickly inspect your app and debug your JS bundle source in a Chrome web page, both android and iOS platform are supported. So you can use weex-devtools feature by weex-toolkit.

#### usage

``` bash
weex debug [we_file|bundles_dir] [options]
```

| Option        | Description    |
| --------   | :-----   |
|`-V, --verbose`       | display logs of debugger server|
|`-v, --version`       | display version|
|`-p, --port [port]`   | set debugger server port|
|`-e, --entry [entry]` | set the entry bundlejs path when you specific the bundle server root path|
|`-m, --mode [mode]`   | set build mode [transformer or loader]|
|`-w, --watch`        | watch we file changes auto build them and refresh debugger page [default `true`]|
|`--ip [ip]`|set the host ip of debugger server|
|`--loglevel [loglevel]`| set log level|
|`--min`| set jsbundle uglify or not. [default `false`]|
|`--remotedebugport [remotedebugport]`|set the remote debug port,default 9222|

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

#### #Vue mismatch error

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
