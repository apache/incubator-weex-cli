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
import * as fs from 'fs'
import * as path from 'path'

export const loadModulePath = (moduleName: string, extra?: any) => {
  try {
    const localPath = require.resolve(path.join(__dirname, '../node_modules', moduleName, extra || ''))
    return localPath.slice(0, localPath.lastIndexOf(moduleName) + moduleName.length)
  } catch (e) {
    return moduleName
  }
}

export const cssLoaders = (options: any) => {
  options = options || {}

  const cssLoader = {
    loader: loadModulePath('css-loader'),
    options: {
      sourceMap: options.sourceMap,
    },
  }

  const postcssLoader = {
    loader: loadModulePath('postcss-loader'),
    options: {
      sourceMap: options.sourceMap,
    },
  }

  // generate loader string to be used with extract text plugin
  const generateLoaders = (loader: string, loaderOptions?: any) => {
    const loaders: any[] = options.useVue ? [cssLoader] : []
    if (options.usePostCSS) {
      loaders.push(postcssLoader)
    }
    if (loader) {
      loaders.push({
        loader: loadModulePath(loader + '-loader'),
        options: Object.assign({}, loaderOptions, {
          sourceMap: !!options.sourceMap,
        }),
      })
    }
    if (options.useVue) {
      return [loadModulePath('vue-style-loader')].concat(loaders)
    } else {
      return loaders
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  }
}

export const exist = (path: string) => {
  try {
    fs.existsSync(path)
  } catch (e) {
    return false
  }
  return true
}
