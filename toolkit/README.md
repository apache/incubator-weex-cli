Weex-Toolkit
============

Weex CLI tool set

## Pre Install
some dependencies need recent version of npm to install

if your
```
$ npm --version
```
output less then `2.15.1`, please run below cmd upgrade your npm at first
```
sudo npm install -g npm
```

## Install
```
$npm install -g weex-toolkit
```

##  Usage

### weex
Weex file preview tool with hot reload 
```
Usage:
$ bin/weex.js foo/bar/we_file_or_dir_path  [options]

Options:
  --qr     display QR code for native runtime, default action          
  -o       transform weex we file to JS Bundle, output path must specified
           (single JS bundle file or dir)        
  --watch  using with -o , watch input path , auto run transform if change
           happen
  -s       start a http file server, weex .we file will be transforme to JS
           bundle on the server , specify local root path using the option
  --help   Show help                                                   
```


## Issue & Feedback

[Github Issue List](https://github.com/alibaba/weex_toolchain/issues)

## Changelog
* 160506(0.0.27) : improve --watch feature
* 160505(0.0.25) : support batch transform  & option --watch added
* 160427(0.0.22) : improve -s feedback information & update upstream transformer lib
* 160418 : temporary turnoff H5 preview
* 160401 : format for opensource
* 160331 : update upstream lib , ready for opensource
* 160321 : update HTML5 runtime
* 160301 : add -s option  &  update upstream lib
* 160224 : update upstream weex-html5 lib , improve stability
* 160223 : add -o option for transform weex JS bundle directly
* 160201 : adopt new weex JS bundle style(define / require) & output transformer Error/Warning logs
* 160129 : add  native runtime  support  with --qr option
* 160122 : add -n , -h options &  improve CLI feedback output
* 160119 : update upstream weex-html5 lib
* 160118 : hot reload function & English document
* 160114 : first version 