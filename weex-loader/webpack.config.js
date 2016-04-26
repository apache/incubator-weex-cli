var path = require('path');
var webpack = require('webpack');
var loader = require('./index.js');
var scripter = require('weex-scripter');
var styler = require('weex-styler');
var templater = require('weex-templater');

loader.useScripter(scripter);
loader.useStyler(styler);
loader.useTemplater(templater);

var banner = 'var __weex_define__ = define, __weex_bootstrap__ = bootstrap;';

var bannerPlugin = new webpack.BannerPlugin(banner, {
  raw: true
});

module.exports = {
  entry: './test/a.js?entry=true',
  output: {
    path: './test/actual',
    filename: 'a.js'
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
  },
  plugins: [bannerPlugin]
}
