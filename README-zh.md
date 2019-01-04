

Weex-Toolkit
============

![image | left](https://img.shields.io/badge/PRs-welcome-brightgreen.svg "")
![image | left](https://img.shields.io/badge/license-Apache--2.0-brightgreen.svg "")
[![GitHub issues](https://img.shields.io/github/issues/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/issues)
[![Npm package](https://img.shields.io/npm/dm/weex-toolkit.svg)](https://www.npmjs.com/package/weex-toolkit)

一个 Weex 官方命令行工具，它能够帮助进行项目开发时候的预览，调试等工作。

[English Doc](./README.md) | [常见问题](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)

## 环境准备

### 安装Node环境

进入[NodeJS官方网站](https://nodejs.org)下载最新稳定版Node.

Mac 可通过 `brew` 安装
```
brew install node
```
安装前建议你的node版本是 >= 6.0, 推荐使用[n](https://github.com/tj/n) 来进行版本管理，由于在`npm5`版本中还存在诸多未解决的问题，见 [npm5 已知问题](https://github.com/npm/npm/issues/16991)，在官方还未修复前，建议你使用`npm4`来进行工具使用，可运行 `npm i npm@4 -g` 进行安装。

查看自己的node版本:
```
$ node -v
v8.9.4
$ npm -v
v5.6.0
```
### Android 环境准备

安装 [Android Studio](https://developer.android.com/studio/index.html) 勾选安装android sdk,配置环境变量 [如何配置android环境变量](https://spring.io/guides/gs/android/)

安装成功测试：
`android -h` 和 `adb -h` 能查看到帮助信息

### iOS环境准备(仅Mac可用)

安装 [Xcode](https://developer.apple.com/xcode/) 同时安装最新版本 [cocoapod](https://cocoapods.org/) , cocoapod版本要求0.39+

安装成功测试：
`xcrun -h` 和 `pod -h` 能查看到 帮助信息

## 安装
```
$ npm install -g weex-toolkit@latest
```

## 选项

```
Usage: weex <command>

where <command> is one of:

  debug         Start weex debugger
  config        Configure the global configuration file
  compile       Compile we/vue file
  create        Create a weexpack project
  preview       Preview a weex page
  platform      Add/remove ios/android platform
  plugin        Add/remove weexplugin
  run           Build your ios/android app and run
  update        Update weex package version
  xbind         Binding a thrid-part tool

  weex <command> --help      help on <command>                                              
```

### 创建项目
```bash
# 从官方模板中创建项目
$ weex create my-project

# 从github上下载模板到本地
$ weex create username/repo my-project
```
从官方模板或者远程源创建项目模板，你也可以创建你自己的`weex`项目模板，更多细节你可以查看[如何创建你自己的模板](https://github.com/weex-templates/How-to-create-your-own-template).

### 预览项目

weex-toolkit工具支持对你的Weex文件（`.we`或`.vue`)在监听模式下进行预览，你只需要指定一下你的项目路径。

自`weex-toolkit v1.1.0+`版本后修改
``` bash
$ weex preview src/foo.vue
```

浏览器会自动得打开预览页面并且你可以看到你的weex页面的布局和效果。如果你在你的设备上安装了[Playground](/cn/tools/playground.html)，你还可以通过扫描页面上的二维码来查看页面。

使用下面的命令，你将可以预览整个文件夹中的`.vue`文件

``` bash
$ weex src --entry src/foo.vue
```

你需要指定要预览的文件夹路径以及入口文件（通过`--entry`传入）。

### 编译项目

使用 `weex compile` 命令可以编译单个weex文件或者整个文件夹中的weex文件。

``` bash
$ weex compile [source] [dist]  [options]
```

#### 选项

| Option        | Description    |
| --------   | :-----   |
|`-w, --watch` | 开启watch模式，同步文件改动并进行编译|
|`-d,--devtool [devtool]`|设置devtool选项|
|`-e,--ext [ext]`| 设置文件拓展名，默认为vue|
|`-m, --min`| 压缩jsbundle选项|

你可以这样子使用：

``` bash
$ weex compile src dest --devtool source-map -m
```

### 添加iOS/Android工程

使用`weex platform [add|remove] [ios|android]`命令可以添加或移除ios/android项目模板。

``` bash
$ weex platform add ios
$ weex platform remove ios
```

使用 `weex platform list`来查看你的项目中支持的平台。

### 运行iOS/Android工程

你可以使用`weex-toolkit`来运行android/ios/web项目.

``` bash
$ weex run ios
$ weex run android
$ weex run web
```

### 调试项目

** [Weex devtools](https://github.com/weexteam/weex-devtool) ** 是实现[Chrome调试协议](https://developer.chrome.com/devtools/docs/debugger-protocol)的Weex自定义开发工具,
主要用于帮助你快速检查您的应用程序，并在Chrome网页中调试您的JS bundle源代码，支持Android和iOS平台。所以你可以通过`weex-toolkit`使用的`weex-devtool`功能。

#### 用法

``` bash
weex debug [we_file|bundles_dir] [options]
```

#### 选项

| Option        | Description    |
| --------   | :-----   |
|`-v, --version`|  显示weex-debugger版本信息|
|`-h, --help`| 展示帮助信息 |
|` -H --host [host]`| 设置浏览器打开的host地址（适用于代理环境下，如docker环境等）|
|`-p, --port [port]`| 设置调试服务器的端口，默认值 8088|
|`-m, --manual`|开启该选项后将不会自动打开浏览器|
|`-e,--ext [ext]`|设置文件拓展名用于编译器编译，默认值为`vue`|
|`--min`|开启该选项后将会压缩jsbunlde|
|`--telemetry`|上传用户数据帮助提升weex-toolkit体验|
|`--verbose`|显示详细的日志数据|
|`--loglevel [loglevel]`|设置日志等级，可选silent/error/warn/info/log/debug,默认值为error|
|`--remotedebugport [remotedebugport]`|设置调试服务器端口号，默认值为9222|

自`weex-toolkit v1.1.0+`版本起默认的debug工具已从[weex-devtool](https://github.com/weexteam/weex-devtool)切换至[weex-debugger](https://github.com/weexteam/weex-debugger)，如想使用旧版本devtool，可通过以下命令使用：

```
$ weex xbind debugx weex-devtool
$ weex debugx
```

## 常见问题

#### #Weex-toolkit 安装缓慢
> npm镜像在国内访问速度较慢，无法翻墙的用户请使用taobao源进行安装，操作如下：
```
$ npm config set registry https://registry.npm.taobao.org/
$ npm i weex-toolkit -g
// or
$ npm i weex-toolkit -g --registry https://registry.npm.taobao.org/
```

#### #Weex 工具链相关依赖下载缓慢
> 如`weex-debugger`或是 `weexpack`依赖安装缓慢，请切换至淘宝源进行安装，操作如下:
```
$ weex config registry https://registry.npm.taobao.org/
// 同时配置chromium下载源，否则安装`weex-debugger`时依旧会存在网络问题
$ npm config set PUPPETEER_DOWNLOAD_HOST https://storage.googleapis.com.cnpmjs.org
```

#### #Windows环境下node-gyp rebuild 错误 [#236](https://github.com/weexteam/weex-toolkit/issues/236)

> node-gyp库需要针对用户环境进行定向编译，编译过程中需要c++编译环境，故需要配置安装python2.7以及VC++ build Tools依赖

解决方法：
方法 1
下载windows命令行编译工具，改工具主要是通过从远端下载windows编译工具的方式，如果下载速度过慢，请采用方法2
```
npm install --global --production windows-build-tools
```
方法 2
从微软官方网站下载vc++构建工具 [Visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools) , 进入 Python官网下载 [Python 2.7](https://www.python.org/) 并安装，注意添加进环境变量中，命令行运行 `python --version` 显示版本号信息即表示安装完成.

方法 3
下载完整版 [Visual Studio 2017](https://www.visualstudio.com/zh-hans/downloads/)

#### #Failed to install Chromium r515411 [#224](https://github.com/weexteam/weex-toolkit/issues/224)
> 该报错主要是因为pupeteer的chromium在国内访问速度较慢或根本无法访问，且国内镜像没有内置，对于无法翻墙的用户需要额外配置下载地址

解决方法：
运行 `npm config set PUPPETEER_DOWNLOAD_HOST https://storage.googleapis.com.cnpmjs.org`
然后再次运行 `weex debug` ** 注：windows用户可能需要再另开个命令行工具运行，有部分机器环境变量设置无法立即生效 **

#### #权限问题 Permisiion denied

如果你看到了下面的报错
```
Error:permission denied.Please apply the write premission to the directory
```
解决方法：
请不要使用sudo进行安装，我们建议你运行 `sudo chmod -R 777 <dirname>` 来解决

#### #Windows用户安装可能有fsevents模块报错

首先你应该删除安装路径中`weex-toolkit`中的`node_modules`（路径可以在报错命令行中看到）,删除后运行下面的命令:

```
npm install --no-optional weex-toolkit -g
``` 

#### #旧版本升级报错
首先检查你的npm版本是否大于等于5.0，如果没有，请通过`npm update npm -g`升级。
运行如下命令重新安装
```
rm -rf ~/.xtoolkit
npm un weex-toolkit -g
npm i weex-toolkit -g
```
#### #vue dismatch错误
尝试一下下面的命令:
```
weex xbind repair toolkit-repair
weex repair
```

#### Android SDK 环境
如果你想在你的电脑上运行安卓示例， 你可以使用[Android Studio上的虚拟机](https://developer.android.com/studio/run/emulator.html) 或者 [真机调试](https://developer.android.com/studio/run/device.html)

如果你使用Android studio管理你的Android SDK，你需要确定下载了[Android 6.0 API](https://developer.android.com/about/versions/marshmallow/android-6.0.html)

#### spawn E2BIG 错误

这个问题可能发生在你运行`weex create/init/run/platform`命令的时候，你需要更新你的weexpack到最新版本来修复这个问题
```
$ weex update weexpack
```
如果当你升级时发生了带`..../.xtoolkit/...`的错误，你需要现删除`.xtoolkit`文件夹内的文件残留再进行升级
```
$ rm -rf ~/.xtoolkit
$ weex update weexpack
```

#### 使用官方模板中web端调用weex模块报undefined
造成该问题的主要原因是在后面的`weex-vue-render`引入方式从源码引入更改为包引入的方式，weex的注册发生在引入后， 故一旦在项目中使用import语法引入`.vue`文件时需要谨慎判断加载时序是否是在`weex.init`之后，在较早的模板中出现了语法提升[Hosting MDN](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)的问题，修改方案如下：
1. 如果你想在已有项目中修复:
在 `configs/webpack.common.config.js` 文件中更改
```
contents += `\nimport App from '${relativeVuePath}';\n`;
```
为
```
contents += `\nconst App = require('${relativeVuePath}');\n`;
```
2. 如果你想重新创建一个项目
升级你的`weexpack`到最新版本，可通过`weex update weexpack@latest`命令升级，然后通过`weex create`命令重新创建项目，最新的版本应该为`v1.0.13`以上。
[相关issues](https://github.com/weexteam/weex-toolkit/issues/268)

#### #Tips
如果你在使用过程中遇到了任何无法解决的问题，你应该尝试检查一下你的环境，通过运行`weex -v`查看你的包版本，通过`weex update weex-devtool@latest`更新最新的包来尝试解决问题。


## Issue & 反馈

 [Github Issue List](https://github.com/weexteam/weex-toolkit/issues)
