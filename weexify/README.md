Weexify
=======
compile weex .we for browserify

## Install
```
$npm install weexify browserify
```

##  Usage

### browserify command line

transform a `we file` to JS Bundle

```bash
$ browserify foo.we -t weexify  > foo.js 
```

### browserify API

```javascript
var browserify = require('browserify')
  , weexify = require('weexify')
  , fs = require('fs')

var b = browserify('template.we')
  , output = fs.createWriteStream('template1.js')

b.transform(weexify)
b.bundle().pipe(output)
```

## Issue & Feedback

[Github Issue List](https://github.com/alibaba/weex_toolchain/issues)

## Changelog
* 160620(0.0.1) : first version 