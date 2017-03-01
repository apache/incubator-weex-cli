Weex-Toolkit
============

Weex CLI toolkit

## Pre Install
some dependencies need recent version of npm to install

if your
```
$ node -v
```
output less then `6.0.0`, please upgrade your node at first
you can use `n` to install newer node or download in https://nodejs.org/
recommend the LTS version of node


## Install
```
$ npm install -g weex-toolkit
```

## Usage

```
Usage: weex <foo/bar/we_file_or_dir_path>  [options]
Usage: weex init [projectName]

选项：
  --port    http listening port number ,default is 8081           [默认值: 8081]
  --wsport  websocket listening port number ,default is 8082      [默认值: 8082]

Usage:weex <command>

where <command> is one of:

       init                                   create a vue project
       debug                                  start weex debugger
       compile                                compile we/vue file
       create                                 create a weexpack project 
       platform <add|remove> <ios|android>    add/remove ios/android platform
       plugin <add|remove> <pluginName>       add/remove weexplugin 
       run <ios|android>                      build your ios/android app and run

weex <command> --help      help on <command>                                               
```

## Examples

#### create a new vue project

```
$weex init your_project_name
```
Your new project directory list below:

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
Switch to the project directory and run:

```
npm install
```
Some npm commands you can use:

```bash
# build both two js bundles for Weex and Web
npm run build

# start a Web server at 8080 port
npm run serve

# start weex-devtool for debugging with native
npm run debug
```


#### preview a `vue file` using Weex HTML5 renderer 
```
$weex your_best_weex.vue
```

#### preview a `we file` using Weex HTML5 renderer 
```
$weex your_best_weex.we
```

And you can use playgroud app to scan the qrcode one the page to preview it on your mobile device

#### compile a `.we .vue file` to JS Bundle
```
$weex compile your_best_weex.we  .
```
`your_best_weex.we` will be transform to JS Bundle file `your_best_weex.js` , saved in your current directory

#### compile many `.we .vue files` to JS Bundle
```
$weex compile path/to/\*.vue,\*.js .
```
all .vue .we files of directory `path/to` will be compiled into directory `.` 

## weex debug command
#### usage
```
weex debug [options] [we_file|bundles_dir]
            
  Options:

    --help               output usage information
    -V, --verbose        display logs of debugger server
    -v, --version        display version
    -p, --port [port]    set debugger server port
    -e, --entry [entry]  set the entry bundlejs path when you specific the bundle server root path
    -m, --mode [mode]    set build mode [transformer|loader]
```

#### start debugger
```
$weex debug
```
this command will start debug server and launch a chrome opening `DeviceList` page.
this page will display a qrcode ,you can use `Playground App` scan it for starting debug.

#### start debugger with a we file
```
$weex debug your_weex.we
```
this command will compile `your_weex.we` to `your_weex.js`  and start the debug server as upon command.
`your_weex.js` will deploy on the server and displayed in `DeviceList` page as  another qrcode contain the url of your_weex.js


#### start debugger with a directory of we files
```
$weex debug your/we/path  -e index.we
``` 
this command will build every file in your/we/path and deploy them on the bundle server. your directory will mapping to  http://localhost:port/weex/ 
use -e to set the entry of these bundles. and the url of "index.we" will display on device list page as another qrcode 

## pack command
details for [weexpack](https://github.com/weexteam/weex-pack)


## trouble shooting
#### #0
please make sure your node version is above 6.0
#### #1
first of all ,please do not install with "sudo" 
if `permisiion denied` error occurs,please try `sudo chmod 777 /usr/local/lib/node_modules`
#### #2
```
Error:permission denied.Please apply the write premission to the directory: "/Users/yourUserName"
```
if such a error occurs,  we suggest you run `sudo chmod 777 ~` or `mkdir ~/.xtoolkit&chmod 777 .xtoolkit`

## Issue & Feedback

 [Github Issue List](https://github.com/weexteam/weex-toolkit/issues)

## Changelog
 
###### 1.0.3
 
- a brand new toolkit release
- base on xtoolkit which can manager child command
- auto setup child command if need
- auto check the version of child command package and upgrade
- contains weexpack now
- a new weex compiler
- support vue2.0 
- new preview page
