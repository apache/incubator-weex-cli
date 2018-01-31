# Weex Toolkit

[![GitHub release](https://img.shields.io/github/release/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/releases)  [![GitHub issues](https://img.shields.io/github/issues/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/issues)
![Node Version](https://img.shields.io/node/v/weex-toolkit.svg "Node Version")

[weex-toolkit](https://github.com/weexteam/weex-toolkit) is an official command line tool to help developers to create, debug and build their Weex project.

[中文文档](./README-zh.md) | [FAQ](#faq)

## Install

``` bash
$ npm install -g weex-toolkit
```
You can use the `weex -v` command to confirm that the installation is successful.

If you have never installed node.js, you should go [node.js.org]( https://nodejs.org/en/) to download and install it.
> **NOTE:** The node version needs to be upper 6.0. You can try [n](https://github.com/tj/n) to manage your node versions. If you meet some errors when installing, please go [weex-toolkit issues](https://github.com/weexteam/weex-toolkit/issues) or [weex-toolkit faq](https://github.com/weexteam/weex-toolkit#faq) to find some solution or have a discuss with us.


## Commands

### create
```bash
$ weex create awesome-project
```
Creates a new weex project. After command running, you can find `awesome-project` directory and there are some Weex templates in it.
There are some useful npm scripts you will use in the future:

- `build`: build the source code and generate the JS bundle
- `dev`: run webpack watch configuration
- `serve`: start a hot-reload web server

You need to run `npm i` before running `npm start` to install project dependencies，after that, the development page will open in the browser automatically

### preview

weex-toolkit supports previewing your Weex file(`.vue`) in a watch mode. You only need specify your file path.

``` bash
$ weex preview src/foo.vue
```

The browser automatically opens the preview page and you can see the layout and effects of your weex page. If you have a [Playground](https://weex.apache.org/cn/playground.html) app in your mobile devices, you can scan the QR code at the opened page.

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

Use `weex platform [add|remove] [ios|android]` to add or remove ios / android project templates.

``` bash
$ weex platform add ios
$ weex platform remove ios
```
Use `weex platform list` to show what platforms your application supported.

### run

You can use `weex-toolkit` to run project to `android/ios/web` target.

``` bash
$ weex run ios
$ weex run android
$ weex run web
```

### build

You can use `weex-toolkit` to build project to `android/ios/web` target.

``` bash
$ weex build ios
$ weex build android
$ weex build web
```
### plugin

processing...

### debug

** [Weex devtools](https://github.com/weexteam/weex-debugger) ** is a custom devtools for Weex that implements [Chrome Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol), it is designed to help you quickly inspect your app and debug your JS bundle source in a Chrome web page, both android and iOS platform are supported. So you can use weex-devtools feature by weex-toolkit.

## FAQ

#### #Environment
Please make sure your node version is above 6.0 and npm version is above 5.0.
If you want to change your npm registry origin, do not use `cnpm`, we recommend you to use `nrm` or command like `npm config set registry https://registry.npm.taobao.org`.

#### #Current working directory is not a weexpack project
Since the 1.0.9 version, the `weex init` command has been removed. If you want to create the weex project, create it with the` weex create` command.

#### #Permisiion denied
First of all ,please do not install with "sudo" 
If a `permisiion denied` error occurs,please try `sudo chmod 777 /usr/local/lib/node_modules`

If you see the following error

```
Error: permission denied. Please apply the write premission to the directory: "/Users/yourUserName"
```
We suggest you run `sudo chmod 777 ~` or `mkdir ~/.xtoolkit && chmod 777 ~/.xtoolkit`

#### #Fsevents wanted error
windows users may have fsevents installation problems, like:
```
fsevents@1.1.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"ia32"})
```
You should remove your `node_module` of weex-toolkit, run command like this:

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
If you encounter an error during the upgrade process, please check your version of npm, the npm version should above 5.0.

Then reload it with the following command:
```
rm -rf ~/.xtoolkit
npm un weex-toolkit -g
npm i weex-toolkit -g
```

#### Android SDK Environment

If you want to run android project, you can use the [emulator of Android Studio](https://developer.android.com/studio/run/emulator.html) or a [real device](https://developer.android.com/studio/run/device.html)

If you install Android SDk by Android studio, you should make sure the [Android 6.0 API](https://developer.android.com/about/versions/marshmallow/android-6.0.html) is installed.

#### spawn E2BIG

This problem may occur when you use the commands `weex create/init/run/platform`.
You need to update your weexpack to latest version.
```
$ weex update weexpack
```
If there have some error while update package, please remove `~/.xtoolkit` before update.
```
$ rm -rf ~/.xtoolkit
$ weex update weexpack
```


#### #Tips

If you are in use during the process, first check your package version is up to date, you can run `weex -v` and use `weex update weex-devtool@latest` to upgrade your package.



## Issue & Feedback

 [Github Issue List](https://github.com/weexteam/weex-toolkit/issues)
