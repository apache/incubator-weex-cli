[![GitHub release](https://img.shields.io/github/release/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/releases)  [![GitHub issues](https://img.shields.io/github/issues/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/issues)
![Node Version](https://img.shields.io/node/v/weex-toolkit.svg "Node Version")

Weex-Toolkit
============

一个 Weex 官方命令行工具，它能够帮助进行项目开发时候的预览，调试等工作。

[English Doc](./README.md) | [常见问题](#faq)

## 环境准备

### 安装Node环境

进入[NodeJS官方网站](https://nodejs.org)下载最新稳定版Node.

Mac 可通过 `brew` 安装
```
brew install node
```
安装前建议你的node版本是 >= 6.0, 推荐使用[n](https://github.com/tj/n) 来进行版本管理，同时建议 npm 版本 >= 5

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

## 使用选项

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

#### 创建项目

```
$ weex create your_project_name
```

运行成功后的目录结构如下：

```
| —— configs
  | —— config.js                  global config of webpack
  | —— helper.js                  helper functions
  | —— logo.png                   
  | —— plugin.js                  script for compile plugins
  | —— utils.js                   tool functions
  | —— vue-loader.conf.js         loader config of weex
  | —— webpack.common.conf.js     webpack configuration for common environment
  | —— webpack.dev.conf.js        webpack configuration for develop environment
  | —— webpack.prod.conf.js       webpack configuration for production environment
  | —— webpack.test.conf.js       webpack configuration for test environment
| —— platforms
  | —— platforms.json             platform meta data
| —— plugins
  | —— plugins.json               plugin data
| —— src
  | —— entry.js                   the entry file of whole bundle
  | —— index.vue                  vue file source
| —— test
  | —— unit
    | —— specs                    test scripts
    | —— index.js                 source code and config test environment
    | —— karma.conf.js            configuration for karma
| —— web                          static source
| —— .babelrc                     configuration for babel-loader
| —— android.config.json          configuration for packing android project
| —— ios.config.json              configuration for packing ios project
| —— npm-shrinkwrap.json          npm dependence lock file
| —— package.json                 
| —— README.md                    
| —— webpack.config.js            entry file of the webpack command

```

#### 预览项目
进入目录，运行
```
$ npm start
```
如果在创建时选择了非自动安装的选项，在运行`npm start` 前需先运行 `npm install`, 运行成功后可以打开项目预览页面，如下
![preview page](https://img.alicdn.com/tfs/TB1OGrdocLJ8KJjy0FnXXcFDpXa-1290-823.png)

你可以通过访问`/index.html`, 如`localhost:8081/index.html`访问`web`端页面

> 注:如果端口号被占用，服务器的端口号可能会发生改变，具体请参考控制台输出

同时你也可以通过 [Weex Playground](http://weex.apache.org/cn/tools/playground.html) 扫描右边二维码预览真机效果

#### 调试项目
```
$ weex debug
```
详细使用请参考 [weex-debugger文档](https://github.com/weexteam/weex-debugger)


## 常见问题

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

#### #Tips
如果你在使用过程中遇到了任何无法解决的问题，你应该尝试检查一下你的环境，通过运行`weex -v`查看你的包版本，通过`weex update weex-devtool@latest`更新最新的包来尝试解决问题。


## Issue & 反馈

 [Github Issue List](https://github.com/weexteam/weex-toolkit/issues)
