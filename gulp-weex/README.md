# gulp-weex

[![NPM version][npm-image]][npm-url]
[![Build status][circle-image]][circle-url]
[![Downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/gulp-weex.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gulp-weex
[circle-image]: https://circleci.com/gh/alibaba/weex_toolchain.svg?style=svg
[circle-url]: https://circleci.com/gh/alibaba/weex_toolchain/tree/master
[downloads-image]: https://img.shields.io/npm/dm/gulp-weex.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/gulp-weex

gulp plugin for weex transformer

## Install

```bash
npm install gulp-weex
```

## Usage

```javascript
var gulp = require('gulp')
var weex = require('gulp-weex')

gulp.task('default', function () {
  return gulp.src('src/*.html')
    .pipe(weex({}))
    .pipe(gulp.dest('./dest'))
})
```

## Options

### logLevel

specify log output level - `NOTE` (default, equivalent to `ALL`), `WARNING`, `ERROR`, `OFF`, aranging from low to high.

### isEntry

whether is an entry module which has `bootstrap(...)`.

default: `true`.

### oldFormat

whether transform to old format.

default: `false`.
