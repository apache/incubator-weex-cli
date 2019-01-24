const helpers = require('./helpers')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

let config = {
  entry: {
    'main': helpers.root('/src/main.ts')
  },
  output: {
    path: helpers.root('/public'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
    publicPath: '/'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.html', '.css'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.ts$/,
      exclude: /node_modules/,
      enforce: 'pre',
      loader: 'tslint-loader'
    },
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'awesome-typescript-loader'
    },
    {
      test: /\.html$/,
      loader: 'raw-loader',
      exclude: ['./src/index.html']
    },
    {
      test: /\.css$/,
      loader: 'css-loader'
    }
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new NamedModulesPlugin(),
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: './assets'
    },{
      from: 'runtime',
      to: './runtime',
    },{
      from: 'node_modules/monaco-editor/min/vs',
      to: './vs',
    }])
  ]
}

module.exports = config
