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
