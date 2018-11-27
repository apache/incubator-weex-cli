import * as webpack from 'webpack'
import * as path from 'path'
import * as autoprefixer from 'autoprefixer'
import * as postcssPluginPx2rem from 'postcss-plugin-px2rem'
import * as weexVuePrecompiler from 'weex-vue-precompiler'
import * as webpackMerge from 'webpack-merge'
import * as postcssPluginWeex from 'postcss-plugin-weex'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import * as os from 'os'

import { exist } from './utils'
import { vueLoader } from './vueLoader'
import WebpackBuilder from './WebpackBuilder'

export class WeexBuilder extends WebpackBuilder {
  constructor(source: string, dest: string, options: any) {
    super(source, dest, options)
  }

  private nodeConfiguration: any = {
    global: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false,
    clearImmediate: false,
    // see: https://github.com/webpack/node-libs-browser
    assert: false,
    buffer: false,
    child_process: false,
    cluster: false,
    console: false,
    constants: false,
    crypto: false,
    dgram: false,
    dns: false,
    domain: false,
    events: false,
    fs: false,
    http: false,
    https: false,
    module: false,
    net: false,
    os: false,
    path: false,
    process: false,
    punycode: false,
    querystring: false,
    readline: false,
    repl: false,
    stream: false,
    string_decoder: false,
    sys: false,
    timers: false,
    tls: false,
    tty: false,
    url: false,
    util: false,
    vm: false,
    zlib: false,
  }

  async initConfig() {
    const destExt = path.extname(this.dest)
    const sourceExt = path.extname(this.rawSource)
    let outputPath
    let outputFilename
    const plugins = [
      /*
       * Plugin: BannerPlugin
       * Description: Adds a banner to the top of each generated chunk.
       * See: https://webpack.js.org/plugins/banner-plugin/
       */
      new webpack.BannerPlugin({
        banner: '// { "framework": "Vue"}',
        raw: true,
        exclude: 'Vue',
      }),
    ]

    // ./bin/weex-builder.js test dest --filename=[name].web.js
    if (this.options.filename) {
      outputFilename = this.options.filename
    } else {
      outputFilename = '[name].js'
    }
    // Call like: ./bin/weex-builder.js test/index.vue dest/test.js
    // Need to rename the filename of
    if (destExt && this.dest[this.dest.length - 1] !== '/' && sourceExt) {
      outputPath = path.dirname(this.dest)
      outputFilename = path.basename(this.dest)
    } else {
      outputPath = this.dest
    }

    if (this.options.onProgress) {
      plugins.push(new webpack.ProgressPlugin(this.options.onProgress))
    }

    const webpackConfig = () => {
      const entrys = {}

      this.source.forEach(s => {
        let file = path.relative(path.resolve(this.base), s)
        file = file.replace(/\.\w+$/, '')
        if (!this.options.web) {
          s += '?entry=true'
        }
        entrys[file] = s
      })

      let configs: any = {
        entry: entrys,
        output: {
          path: outputPath,
          filename: outputFilename,
        },
        watch: this.options.watch || false,
        devtool: this.options.devtool || false,
        // make uglify plugin can be work
        optimization: {
          minimize: false,
        },
        /*
        * Options affecting the resolving of modules.
        *
        * See: http://webpack.github.io/docs/configuration.html#module
        */
        module: {
          rules: [
            {
              test: /\.js$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['es2015', 'stage-0'],
                  },
                },
              ],
            },
            {
              test: /\.we$/,
              use: [
                {
                  loader: 'weex-loader',
                },
              ],
            },
          ],
        },
        /**
         * See: https://webpack.js.org/configuration/resolve/#resolveloader
         */
        resolveLoader: {
          modules: [path.join(__dirname, '../node_modules'), path.resolve('node_modules')],
          extensions: ['.js', '.json'],
          mainFields: ['loader', 'main'],
          moduleExtensions: ['-loader'],
        },
        /*
        * Add additional plugins to the compiler.
        *
        * See: http://webpack.github.io/docs/configuration.html#plugins
        */
        plugins: plugins,
      }

      if (this.options.web) {
        configs.module.rules.push({
          test: /\.vue(\?[^?]+)?$/,
          use: [
            {
              loader: 'vue-loader',
              options: Object.assign(vueLoader({ useVue: true, usePostCSS: false }), {
                /**
                 * important! should use postTransformNode to add $processStyle for
                 * inline style prefixing.
                 */
                optimizeSSR: false,
                postcss: [
                  // to convert weex exclusive styles.
                  postcssPluginWeex(),
                  autoprefixer({
                    browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12'],
                  }),
                  postcssPluginPx2rem({
                    // base on 750px standard.
                    rootValue: 75,
                    // to leave 1px alone.
                    minPixelValue: 1.01,
                  }),
                ],
                compilerModules: [
                  {
                    postTransformNode: el => {
                      // to convert vnode for weex components.
                      weexVuePrecompiler()(el)
                    },
                  },
                ],
              })
            },
          ],
        })
      } else {
        configs.module.rules.push({
          test: /\.[vue|we](\?[^?]+)?$/,
          use: [
            {
              loader: 'weex-loader',
              options: vueLoader({ useVue: false }),
            },
          ],
        })
        configs.node = this.nodeConfiguration
      }
      if (this.options.min) {
        /*
        * Plugin: UglifyJsPlugin
        * Description: Minimize all JavaScript output of chunks.
        * Loaders are switched into minimizing mode.
        *
        * See: https://webpack.js.org/configuration/optimization/#optimization-minimizer
        */
        configs.plugins.unshift(
          new UglifyJsPlugin({
            sourceMap: true,
            parallel: os.cpus().length - 1,
          }),
        )
      }
      return configs
    }

    return webpackConfig()
  }

  async build(callback) {
    let configs = await this.initConfig()
    let mergeConfigs

    if (this.source.length === 0) {
      return callback('no ' + (this.options.ext || '') + ' files found in source "' + this.rawSource + '"')
    }

    if (this.options.config) {
      if (exist(this.options.config)) {
        try {
          mergeConfigs = require(path.resolve(this.options.config))
          configs = webpackMerge(configs, mergeConfigs)
        } catch (e) {
          console.error(e)
        }
      }
    }

    const compiler = webpack(configs)
    const formatResult = (err, stats) => {
      const result = {
        toString: () =>
          stats.toString({
            // Add warnings
            warnings: false,
            // Add webpack version information
            version: false,
            // Add the hash of the compilation
            hash: false,
            // Add asset Information
            assets: true,
            modules: false,
            // Add built modules information to chunk information
            chunkModules: false,
            // Add the origins of chunks and chunk merging info
            chunkOrigins: false,
            children: false,
            // Makes the build much quieter
            chunks: false,
            // Shows colors in the console
            colors: true,
          }),
      }

      if (err) {
        console.error(err.stack || err)
        if (err.details) {
          console.error(err.details)
        }
        return callback && callback(err)
      }

      const info = stats.toJson()
      if (stats.hasErrors()) {
        return callback && callback(info.errors)
      }
      callback && callback(err, result, info)
    }

    if (configs.watch) {
      compiler.watch(
        {
          ignored: /node_modules/,
          poll: 1000,
        },
        formatResult,
      )
    } else {
      compiler.run(formatResult)
    }
  }
}

export default WeexBuilder
