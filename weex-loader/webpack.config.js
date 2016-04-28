var path = require('path');
var webpack = require('webpack');
var loader = require('./index.js');
var scripter = require('weex-scripter');
var styler = require('weex-styler');
var templater = require('weex-templater');

loader.useScripter(scripter);
loader.useStyler(styler);
loader.useTemplater(templater);

module.exports = {
  entry: {
    a: './test/a.js?entry=true',
    z: './test/expect/z.we?entry=true'
  },
  output: {
    path: './test/actual',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.we(\?[^?]+)?$/,
        loaders: ['index.js']
      },
      {
        test: /\.js(\?[^?]+)?$/,
        exclude: [
          path.resolve(__dirname, 'test/lib')
        ],
        loaders: ['index.js?type=script', 'babel?presets[]=es2015']
      },
      {
        test: /\.less(\?[^?]+)?$/, 
        loaders: ['index.js?type=style', 'less']
      },
      {
        test: /\.tpl(\?[^?]+)?$/, 
        loaders: ['index.js?type=tpl']
      }
    ]
  },
  resolveLoader: {
    modulesDirectories: ['./', './node_modules']
  }
}
