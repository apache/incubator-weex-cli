const helpers = require('./helpers')
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

let config = {
  entry: {
    'main': helpers.root('/src/main.ts')
  },
  output: {
    path: helpers.root('/preview'),
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
      exclude: ['./src/index.html', './src/assets/weex/index.html']
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
      from: 'node_modules/vue/dist/vue.runtime.js',
      to: './assets/weex/vue.runtime.js'
    },{
      from: 'node_modules/weex-vue-render/dist/index.js',
      to: './assets/weex/weex-vue-render.js'
    }, {
      from: 'node_modules/phantom-limb/index.js',
      to: './assets/weex/phantom-limb.js'
    }, {
      from: 'src/assets/weex/index.html',
      to: './assets/weex/index.html'
    }])
  ]
}

module.exports = config
