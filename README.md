Weex-Toolkit
============

Weex CLI tool set

## Pre Install
some dependencies need recent version of npm to install

if your
```
$ npm --version
```
output less then `2.15.1`, please run below cmd to upgrade your npm at first
```
$ npm install -g npm
```

### Install node-gyp
if your
```
$ node-gyp --version
```
output less then `3.4.0` or no node-gpy installed in your system , please run below cmd to install or upgrade node-gyp
```
$ npm install -g node-gyp
```

## Install
```
$ npm install -g weex-toolkit
```

## Usage

```
weex foo/bar/we_file_or_dir_path  [options]
weex init
weex debug
Options:
  --qr       display QR code for PlaygroundApp
  --smallqr  display small-scale version of QR code for PlaygroundApp,try it if you use default font in CLI         
  -o,--output  transform weex we file to JS Bundle, output path (single JS bundle file or dir)
           [for create sub cmd] it specified we file output path                    
  --watch  using with -o , watch input path , auto run transform if change
           happen
  -s,--server  start a http file server, weex .we file will be transforme to JS bundle on the server , specify local root path using the option
  -h, --host  specify server listening  IP 
  --port   http listening port number ,default is 8081            
  --wsport websocket listening port number ,default is 8082
  -f, --force   [for create sub cmd] force to replace exsisting file(s)
  --np     do not open preview browser automatic        
  --version show version of weex toolkit 
  --help   Show help                                                   
```

## Examples

#### preview a `we file` using Weex HTML5 renderer 
```
$weex your_best_weex.we
```

#### transform a `we file` to JS Bundle
```
$weex your_best_weex.we -o .
```
`your_best_weex.we` will be transform to JS Bundle file `your_best_weex.js` , saved in your current directory

#### transform a `we file` to JS Bundle , watch this file ，auto run transformer if change happen.
```
$weex your_best_weex.we -o . --watch
```

#### transform every we file in a directory 
```
$weex we/file/storage/path -o outputpath
```
every `we file` in `we/file/storage/path` we be transform to JS Bundle, saved in `outputpath` path

#### preview your we file using Weex Playground App
download & install [weex playground App](http://alibaba.github.io/weex/download.html)
```
$weex your_best_weex.we --qr
```
a QR code will display in your terminal , using Playground App scan that.


#### start http server
```
$weex -s .
```
a http server will start running , your current directory(.) will be the document root for the server , every weex .we file will be transforme to JS Bundle when access through the server

## Troubleshoot Installation Problems

### invalid name '@f/defaults'

Action: upgrade node version

[issue](https://github.com/weexteam/weex-toolkit/issues/17) 

## weex debug command
#### usage
```
weex debug [options] [we_file|bundles_dir]
            
  Options:

    -h, --help           output usage information
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


## Issue & Feedback

[Github Issue List](https://github.com/weexteam/weex-toolkit/issues)

## Changelog
* 161028(0.5.10): update project template which generate by weex init
* 161024(0.5.9):  upgrade upstream dependencies
* 160927(0.5.8):  fix Unknown plugin "transform-runtime" problem 
* 160927(0.5.7):  display Weex we file syntax error&Warning found in transformer
* 160908(0.5.0) : support ES2015 in script tag!
* 160901(0.4.10) : add --smallqr argument for render small scale version of QR code ; make devtool support listen IP assigning
* 160831(0.4.8) : more CLI feedback when compile time error happen
* 160830(0.4.7) : improve CLI feedback when module not found error happen
* 160809(0.4.6) : upgrade upstream weex-html5 ,weex-loader ,devtool
* 160809(0.4.5) : upgrade upstream devtool , improve cli help information.
* 160719(0.4.4) : improve document ; improve -s implementation ; upgrade upstream devtool
* 160714(0.4.3) : improve -s implementation, remove dependence of weex transformer ; improve Weex Playground App support ; upgrade upstream devtool
* 160707(0.4.2) : upgrade upstream devtool
* 160707(0.4.1) : add weex debugger
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
