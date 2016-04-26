# Weex Loader

A webpack loader for Weex.

## Install

```
npm install weex-loader --save
```

## Dependencies

The loader needs `weex-scripter/weex-styler/weex-templater` in peer dependencies. You should install them in your projects.

```
npm install weex-scripter weex-styler weex-templater --save
```

## Feature

0. Can load `.we` file.
1. Can load parted files(`.js/.css/.tpl`) instead of one `.we` file.
2. Can chain any loader you want when write parted files.
3. Can require a CommonJS module.
4. Can specify the name of a component.

## Not yet for Spec

0. `<we-element>/<wa-element>/<wx-element>/<element>` tag

## Usage

### How to load a `.we` file.

**make a webpack config**
```javascript
var path = require('path');
var webpack = require('webpack');

var loader = require('weex-loader');
var scripter = require('weex-scripter');
var styler = require('weex-styler');
var templater = require('weex-templater');

/* use the default parsers or your custom parsers */
loader.useScripter(scripter);
loader.useStyler(styler);
loader.useTemplater(templater);

module.exports = {
  entry: './test/main.we?entry=true',
  output: {
    path: './test/actual',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.we(\?[^?]+)?$/,
        loader: 'weex'
      }
    ]
  }
}
```

### How to write parted files

#### write .js/.css/.tpl anywhere

**main.js as script**
```javascript
module.exports = {
    data: {
        text: 'Hello World'
    }
}

module.exports.style = require('./main.css');
module.exports.template = require('./main.tpl');
```

**main.css as style**
```css
.h1 {
    font-size: 60px;
    color: red;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
}
```

**main.tpl as template**
```html
<container>
    <text class="h1">{{text}}</text>
</container>
```

Then change the entry to `main.js` in `webpack.config.js`

#### add some loader in webpack config

**loader for script**
```json
  {
    test: /\.js(\?[^?]+)?$/,
    loader: 'weex?type=script'
  }
```

**loader for style**
```json
  {
    test: /\.css(\?[^?]+)?$/, 
    loader: 'weex?type=style'
  }
```

**loader for template**
```json
  {
    test: /\.tpl(\?[^?]+)?$/, 
    loader: 'weex?type=tpl'
  }
```

### How to require a CommonJS module

0. first, require a `path/to/module.js` in `script` like `var _ = require('lodash')`. 
1. then use it in `script`.

### How to embed a composed component

0. first, require a `path/to/component.js` in `script` like `require('./sub.js')`.
1. second, use it in `template` like `<sub></sub>`.

### How to specify the name of a component

0. By default, the name is the basename without extname of component path.
1. Give a name query in require request, like `require('./sub.js?name="goto"')`
2. use the name in `template` like `<goto></goto>`.

## Chain your favorite loader

For examples:

### write ES2015

Only your need is chain babel-loader before weex-loader.

```json
  {
    test: /\.js(\?[^?]+)?$/,
    loader: 'weex?type=script!babel?presets[]=es2015'
  }
```

### write SCSS

Only your need is chain scss loader before weex-loader.

```json
  {
    test: /\.scss(\?[^?]+)?$/, 
    loader: 'weex?type=style!scss'
  }
```

## Test

```bash
npm run test
```
will run mocha testing

```bash
npm run serve
```
then open `localhost:12581` on chrome, will run web testing
