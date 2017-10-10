[![GitHub release](https://img.shields.io/github/release/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/releases)  [![GitHub issues](https://img.shields.io/github/issues/weexteam/weex-toolkit.svg)](https://github.com/weexteam/weex-toolkit/issues)
![Node Version](https://img.shields.io/node/v/weex-toolkit.svg "Node Version")

Weex-Toolkit
============

一个 Weex 官方命令行工具，它能够帮助进行项目开发时候的预览，调试等工作。

[English Doc](./README.md)

## 安装前需要注意
安装前确保你的node版本是>=6.0,如果不是请升级你的node版本，我们推荐你使用[n](https://github.com/tj/n) 来进行版本管理。

查看自己的node版本:
```
$ node -v
```



## 安装
```
$ npm install -g weex-toolkit
```

## 使用选项

```
Usage: weex <foo/bar/we_file_or_dir_path>  [options]
Usage: weex init [projectName]

选项：
  --port    http listening port number ,default is 8081           [默认值: 8081]
  --wsport  websocket listening port number ,default is 8082      [默认值: 8082]

Usage:weex <command>

where <command> is one of:

       init                                   创建一个weex项目
       debug                                  调试
       compile                                打包weex文件
       create                                 创建一个weexpack工程
       platform <add|remove> <ios|android>    添加iOS/android应用模板
       plugin <add|remove> <pluginName>       添加/移除 插件
       run <ios|android>                      打包你的weex项目，并且在你的设备上运行

weex <command> --help      help on <command>                                               
```

## Examples

#### 创建项目

```
$ weex init your_project_name
```
你的目录结构如下：

```
 |—— .gitignore
    |—— README.md
    |—— .eslintrc
    |—— .babelrc
    |-- app.js
    |—— assets
    |—— /src
    |     |—— foo.vue
    |—— /build
    |—— weex.html
    |—— index.html
```
进入你的目录，你可以运行下面的npm命令:

```
npm install
```
Some npm commands you can use:

```bash
# 同时打包weex和web文件
npm run build

# 启动一个web服务器
npm run serve

```


#### 预览weex页面 
```
$ weex your_best_weex.vue
```

#### 预览.we的文件
```
$ weex your_best_weex.we
```

你可以使用[playgroud](https://weex.apache.org/cn/playground.html)扫描二维码实现手机端的预览。

#### 编译一个weex文件
```
$weex compile your_best_weex.we  .
```
`your_best_weex.we` 会被编译成 `your_best_weex.js` , 保存在你当前目录

#### 编译多文件
```
$weex compile path/to/\*.vue,\*.js .
```

## 调试
#### 使用说明
```
weex debug [options] [we_file|bundles_dir]
            
  Options:

    --help               输出帮助信息
    -V, --verbose        展示debug 服务器的log信息
    -v, --version        展示当前版本
    -p, --port [port]    设置 debugger 的端口
    -e, --entry [entry]  指定入口文件，当你要调试一个项目目录的时候
    -m, --mode [mode]    设计构建模式 [transformer|loader]
```

#### 启动 debugger
```
$weex debug
```
运行这个命令，系统会启动一个debug服务器，然后再chrome打开`DeviceList`页面。这个页面会有一个二维码，你可以使用`Playground App` 进行扫描，然后开始调试。

#### 调试某一个文件
```
$weex debug your_weex.we
```
执行这个命令会将 文件 `your_weex.we` 编译成 `your_weex.js` 然后启动一个调试服务器。
`your_weex.js`将会存放到服务器的目录里， `DeviceList` 页面将会展示这个js的二维码，使用`[Playground App](https://weex.apache.org/cn/playground.html)`扫描它，就能够看到手机上的效果。


#### start debugger with a directory of we files
```
$ weex debug your/we/path  -e index.we
``` 

这个命令会编译 `your/we/path` 下面的每一个文件，然后发布到服务器的目录。
使用 `-e` 来 设置这些bundles 的入口文件，然后这个入口文件 `index.we`就会在你的手机上显示出来。




## weex-toolkit 对 weexpack的集成

[weexpack](https://github.com/weexteam/weex-pack) 是基于 weex 快速搭建应用原型的利器。它能够帮助开发者通过命令行创建 Weex 工程，添加相应平台的 Weex app 模版，并基于模版从本地、GitHub 或者 Weex 应用市场安装插件，快速打包 Weex 应用并安装到手机运行，对于具有分享精神的开发者而言还能够创建 Weex 插件模版并发布插件到 Weex 应用市场。

现在使用weex-toolkit同样支持对weexpack的命令调用,如果你当前的项目与weexpack生成的项目目录一致，那么你可以直接实现对于platform的操作，从而构建具体的android/ios app.

### weex platform 以及 run 命令

如果我们希望在模拟器或者真机上查看weex运行的效果，我们可以使用 platform 添加或者删除 Weex应用模板。

``` bash
$ weex platform add ios 
```
在第一次使用platform/plugin命令的时候，可能会遇到下面的界面，你只需要输入Y或者直接enter键即可。
![install weexpack](https://gw.alicdn.com/tfs/TB19n4AQXXXXXawXVXXXXXXXXXX-577-70.png)

添加ios平台，然后这个时候只要输入:

``` bash
$ weex run ios
```

就能看到启动的模拟器运行的效果了。


### weex plugin 命令

如果你想使用[插件市场](https://market.weex-project.io/)的插件，你可以使用

```bash
$ weex plugin add plugin_name
```


## 常见问题
#### #Node 环境
确保你本地的node版本是>=6以及npm版本是>=5的.

#### #Current working directory is not a weexpack project
自1.0.9版本后`weex init`命令已移除，如果要创建weex工程请通过`weex create`命令创建。

#### #权限问题 Permisiion denied
请不要使用sudo进行安装，关于npm 取消sudo进行全局模块的安装你可以使用下面的命令：
``` bash
sudo chmod 777 /usr/local/lib/node_modules
```
[消除mac下npm全局安装使用sudo命令](http://www.jackpu.com/xiao-chu-macxia-npmquan-ju-an-zhuang-shi-yong-sudoming-ling/)

如果你看到了下面的报错
```
Error:permission denied.Please apply the write premission to the directory: "/Users/yourUserName"
```
我们建议你运行 `sudo chmod 777 ~` or `mkdir ~/.xtoolkit&chmod 777 .xtoolkit` 来解决

#### #Windows用户安装可能有fsevents模块报错

```
Error:permission denied.Please apply the write premission to the directory: "/Users/yourUserName"
```
首先你应该删除安装路径中`weex-toolkit`中的`node_modules`（路径可以在报错命令行中看到）,删除后运行下面的命令:

```
npm install --no-optional weex-toolkit -g
``` 

#### 旧版本升级报错
首先检查你的npm版本是否大于等于5.0，如果没有，请通过`npm update npm -g`升级。
运行如下命令重新安装
```
rm -rf ~/.xtoolkit
npm un weex-toolkit -g
npm i weex-toolkit -g
```

#### #Tips
如果你在使用过程中遇到了任何无法解决的问题，你应该尝试检查一下你的环境，通过运行`weex -v`查看你的包版本，通过`weex update weex-devtool@latest`更新最新的包来尝试解决问题。


## Issue & 反馈

 [Github Issue List](https://github.com/weexteam/weex-toolkit/issues)
