Weex-Toolkit
============

Weex CLI tool set

## Pre Install
some dependencies need recent version of npm to install

if your
```
$ node -v
```
output less then `6.0.0`, please upgrade your node at first
you can use `n` to install newer node or download in https://nodejs.org/
recommend  install the LTS version;


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
## Issue & Feedback

[Github Issue List](https://github.com/weexteam/weex-toolkit/issues)

## Changelog
* 1.0.1 release 
* 170110(1.0.0-beta.1) support vue2.0 and add vue-loader
* 161102(0.6.2):  Upgrade weex-toolkit into a module architecture. Reduce the file size downloaded for the first time installation. 
* 161028(0.5.10): Update project template which generate by weex init
* 161024(0.5.9):  Upgrade upstream dependencies
* 160927(0.5.8):  Fix Unknown plugin "transform-runtime" problem 
* 160927(0.5.7):  Display Weex we file syntax error&Warning found in transformer
* 160908(0.5.0) : Support ES2015 in script tag!
* 160901(0.4.10) : Add --smallqr argument for render small scale version of QR code ; make devtool support listen IP assigning
* 160831(0.4.8) : More CLI feedback when compile time error happen
* 160830(0.4.7) : Improve CLI feedback when module not found error happen
* 160809(0.4.6) : Upgrade upstream weex-html5 ,weex-loader ,devtool
* 160809(0.4.5) : Upgrade upstream devtool , improve cli help information.
* 160719(0.4.4) : Improve document ; improve -s implementation ; upgrade upstream devtool
* 160714(0.4.3) : Improve -s implementation, remove dependence of weex transformer ; improve Weex Playground App support ; upgrade upstream devtool
* 160707(0.4.2) : Upgrade upstream devtool
* 160707(0.4.1) : Add weex debugger
* 160628(0.3.4) : fix hot-reload continuous refresh  bug
* 160624(0.3.2) : supported `weex init` to generate a weex project
* 160623(0.2.2) : make "-h" specify host IP work for QR code 
* 160622(0.2.1) : support require other module & cli feedback improve
* 160609(0.1.1) : upgrade upstream weex-html5.
* 160608(0.1.0) : HTML5 preview (with hot-reload) come back.
* 160608(0.0.42) : upgrade upstream lib(http-server , weex-transformer) 
* 160603(0.0.41) : fix occasional terminal QR display bug
* 160602(0.0.39) : improve weex debugger ui 
* 160525(0.0.38) : add examples , improve create sub command
* 160525(0.0.37) : add `create` sub command for create we file using standard weex template
* 160509(0.0.30) : add --port & --wsport options , show encoding url when QR displayed
* 160506(0.0.29) : improve --watch & -s feature ; fixing hot-reload with playground App.
* 160505(0.0.25) : support batch transform & option --watch added
* 160427(0.0.22) : improve -s feedback information & update upstream transformer lib
* 160418 : temporary turnoff H5 preview
* 160401 : format for opensource
* 160331 : update upstream lib , ready for opensource
* 160321 : update HTML5 runtime
* 160301 : add -s option & update upstream lib
* 160224 : update upstream weex-html5 lib , improve stability
* 160223 : add -o option for transform weex JS bundle directly
* 160201 : adopt new weex JS bundle style(define / require) & output transformer Error/Warning logs
* 160129 : add native runtime support with --qr option
* 160122 : add -n , -h options & improve CLI feedback output
* 160119 : update upstream weex-html5 lib
* 160118 : hot reload function & English document
* 160114 : first version 
