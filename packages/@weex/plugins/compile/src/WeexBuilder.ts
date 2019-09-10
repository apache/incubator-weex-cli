/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import * as webpack from 'webpack'
import * as path from 'path'
import * as autoprefixer from 'autoprefixer'
import * as postcssPluginPx2rem from 'postcss-plugin-px2rem'
import * as weexVuePrecompiler from 'weex-vue-precompiler'
import * as webpackMerge from 'webpack-merge'
import * as postcssPluginWeex from 'postcss-plugin-weex'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import * as os from 'os'
import * as fse from 'fs-extra'
import * as DEBUG from 'debug'

import { exist } from './utils'
import { vueLoader } from './vueLoader'
import WebpackBuilder from './WebpackBuilder'

const debug = DEBUG('weex:compile')

export class WeexBuilder extends WebpackBuilder {
  private vueTemplateFloder: string = '.temp'
  private defaultWeexConfigName: string = 'weex.config.js'
  private entryFileName: string = 'entry.js'
  private routerFileName: string = 'router.js'
  private pluginFileName: string = 'plugins/plugins.js'
  private pluginConfigFileName: string = 'plugins/plugins.json'
  private isWin: boolean = /^win/.test(process.platform)
  private isSigleWebRender: boolean = false
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

  async resolveConfig() {
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
        banner: '// { "framework": "Vue"}\n',
        raw: true,
        exclude: 'Vue',
      }),
      /**
       * Plugin: webpack.DefinePlugin
       * Description: The DefinePlugin allows you to create global constants which can be configured at compile time.
       *
       * See: https://webpack.js.org/plugins/define-plugin/
       */
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(this.options.prod ? 'production' : 'development'),
        },
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
    const hasVueRouter = (content: string) => {
      return /(\.\/)?router/.test(content)
    }

    const getEntryFileContent = (source, routerpath) => {
      const hasPluginInstalled = fse.existsSync(path.resolve(this.pluginFileName))
      let dependence = `import Vue from 'vue'\n`
      dependence += `import weex from 'weex-vue-render'\n`
      let relativePluginPath = path.resolve(this.pluginConfigFileName)
      let entryContents = fse.readFileSync(source).toString()
      let contents = ''
      entryContents = dependence + entryContents
      entryContents = entryContents.replace(/\/\* weex initialized/, match => `weex.init(Vue)\n${match}`)
      if (this.isWin) {
        relativePluginPath = relativePluginPath.replace(/\\/g, '\\\\')
      }
      if (hasPluginInstalled) {
        contents += `\n// If detact plugins/plugin.js is exist, import and the plugin.js\n`
        contents += `import plugins from '${relativePluginPath}';\n`
        contents += `plugins.forEach(function (plugin) {\n\tweex.install(plugin)\n});\n\n`
        entryContents = entryContents.replace(/\.\/router/, routerpath)
        entryContents = entryContents.replace(/weex\.init/, match => `${contents}${match}`)
      }
      return entryContents
    }

    const getRouterFileContent = source => {
      const dependence = `import Vue from 'vue'\n`
      let routerContents = fse.readFileSync(source).toString()
      routerContents = dependence + routerContents
      return routerContents
    }

    const getWebRouterEntryFile = (entry: string, router: string) => {
      const entryFile = path.resolve(this.vueTemplateFloder, this.entryFileName)
      const routerFile = path.resolve(this.vueTemplateFloder, this.routerFileName)
      fse.outputFileSync(entryFile, getEntryFileContent(entry, routerFile))
      fse.outputFileSync(routerFile, getRouterFileContent(router))
      return {
        index: entryFile,
      }
    }

    // Wraping the entry file for web.
    const getWebEntryFileContent = (entryPath: string, vueFilePath: string, base: string) => {
      const hasPluginInstalled = fse.existsSync(path.resolve(this.pluginFileName))
      let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath)
      let relativeEntryPath = path.resolve(base, this.entryFileName)
      let relativePluginPath = path.resolve(this.pluginConfigFileName)

      let contents = ''
      let entryContents = ''
      if (fse.existsSync(relativeEntryPath)) {
        entryContents = fse.readFileSync(relativeEntryPath, 'utf8')
      }
      if (this.isWin) {
        relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\')
        relativePluginPath = relativePluginPath.replace(/\\/g, '\\\\')
      }
      if (hasPluginInstalled) {
        contents += `\n// If detact plugins/plugin.js is exist, import and the plugin.js\n`
        contents += `import plugins from '${relativePluginPath}';\n`
        contents += `plugins.forEach(function (plugin) {\n\tweex.install(plugin)\n});\n\n`
        entryContents = entryContents.replace(/weex\.init/, match => `${contents}${match}`)
        contents = ''
      }
      contents += `
    const App = require('${relativeVuePath}');
    new Vue(Vue.util.extend({el: '#root'}, App));
    `
      return entryContents + contents
    }

    // Wraping the entry file for native.
    const getWeexEntryFileContent = (entryPath: string, vueFilePath: string) => {
      let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath)
      let contents = ''
      if (this.isWin) {
        relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\')
      }
      contents += `import App from '${relativeVuePath}'
App.el = '#root'
new Vue(App)
    `
      return contents
    }

    const getNormalEntryFile = (entries: string[], base: string, isweb: boolean): any => {
      let result = {}
      entries.forEach(entry => {
        const extname = path.extname(entry)
        const basename = entry.replace(`${base}${this.isWin ? '\\' : '/'}`, '').replace(extname, '')
        const templatePathForWeb = path.resolve(this.vueTemplateFloder, basename + '.web.js')
        const templatePathForNative = path.resolve(this.vueTemplateFloder, basename + '.js')
        if (isweb) {
          fse.outputFileSync(templatePathForWeb, getWebEntryFileContent(templatePathForWeb, entry, base))
          result[basename] = templatePathForWeb
        } else {
          fse.outputFileSync(templatePathForNative, getWeexEntryFileContent(templatePathForNative, entry))
          result[basename] = templatePathForNative
        }
      })
      return result
    }

    const resolveSourceEntry = async (source: string[], base: string, options: any) => {
      const entryFile = path.join(base, this.entryFileName)
      const routerFile = path.join(base, this.routerFileName)
      const existEntry = await fse.pathExists(entryFile)
      let entrys: any = {}
      if (existEntry) {
        const content = await fse.readFile(entryFile, 'utf8')
        if (hasVueRouter(content)) {
          if (options.web) {
            entrys = getWebRouterEntryFile(entryFile, routerFile)
          } else {
            entrys = {
              index: entryFile,
            }
          }
        } else {
          entrys = getNormalEntryFile(source, base, options.web)
        }
      } else {
        this.isSigleWebRender = true
        entrys = getNormalEntryFile(source, base, options.web)
      }
      return entrys
    }

    const webpackConfig = async () => {
      const entrys = await resolveSourceEntry(this.source, this.base, this.options)
      let configs: any = {
        entry: entrys,
        output: {
          path: outputPath,
          filename: outputFilename,
        },
        watch: this.options.watch || false,
        watchOptions: {
          aggregateTimeout: 300,
          ignored: /\.temp/,
        },
        devtool: this.options.devtool || 'eval-source-map',
        resolve: {
          extensions: ['.js', '.vue', '.json'],
          alias: {
            '@': this.base || path.resolve('src'),
          },
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
                    presets: [
                      path.join(__dirname, '../node_modules/babel-preset-es2015'),
                      path.join(__dirname, '../node_modules/babel-preset-stage-0'),
                    ],
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
              }),
            },
          ],
        })
      } else {
        configs.module.rules.push({
          test: /\.(we|vue)(\?[^?]+)?$/,
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

    let config = await webpackConfig()
    return config
  }

  async build(callback) {
    let configs = await this.resolveConfig()
    debug(this.options.web ? 'web -->' : 'weex -->', JSON.stringify(configs, null, 2))
    let mergeConfigs

    if (this.source.length === 0) {
      return callback('no ' + (this.options.ext || '') + ' files found in source "' + this.rawSource + '"')
    }

    if (this.options.config) {
      if (exist(this.options.config)) {
        try {
          mergeConfigs = require(path.resolve(this.options.config))
          if (mergeConfigs.web && this.options.web) {
            configs = webpackMerge(configs, mergeConfigs.web)
          } else if (mergeConfigs.weex && !this.options.web) {
            configs = webpackMerge(configs, mergeConfigs.weex)
          } else if (!mergeConfigs.web && !mergeConfigs.weex) {
            configs = webpackMerge(configs, mergeConfigs)
          }
        } catch (e) {
          debug('read config error --> ', e)
        }
      }
    } else {
      let defatultConfig = path.resolve(this.defaultWeexConfigName)
      if (exist(defatultConfig)) {
        try {
          mergeConfigs = require(path.resolve(defatultConfig))
          if (mergeConfigs.web && this.options.web) {
            configs = webpackMerge(configs, mergeConfigs.web)
          } else if (mergeConfigs.weex && !this.options.web) {
            configs = webpackMerge(configs, mergeConfigs.weex)
          } else if (!mergeConfigs.web && !mergeConfigs.weex) {
            configs = webpackMerge(configs, mergeConfigs)
          }
        } catch (e) {
          debug('read config error --> ', e)
        }
      }
    }
    if (this.options.outputConfig) {
      console.log(JSON.stringify(configs, null, 2))
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
      // use for preview module
      info['isSigleWebRender'] = this.isSigleWebRender
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
