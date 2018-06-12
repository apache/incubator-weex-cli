const _sizeUnits = ["B", "KB", "MB", "GB", "TB", "PB"];
const path = require("path");
const fs = require("fs");

const resolveSizeUnit = (size, i = 0) => {
  if (isNaN(size)) {
    return "";
  }
  if (size < 1000) {
    return size.toFixed(2).replace(/\.?0+$/, "") + _sizeUnits[i];
  } else {
    return resolveSizeUnit(size / 1024, i + 1);
  }
};

const loadModulePath = (moduleName, extra) => {
  try {
    const localPath = require.resolve(
      path.join(__dirname, "../node_modules", moduleName, extra || "")
    );
    return localPath.slice(
      0,
      localPath.lastIndexOf(moduleName) + moduleName.length
    );
  } catch (e) {
    return moduleName;
  }
};

const cssLoaders = options => {
  options = options || {};

  const cssLoader = {
    loader: loadModulePath("css-loader"),
    options: {
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: loadModulePath("postcss-loader"),
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  const generateLoaders = (loader, loaderOptions) => {
    const loaders = options.useVue ? [cssLoader] : [];
    if (options.usePostCSS) {
      loaders.push(postcssLoader);
    }
    if (loader) {
      loaders.push({
        loader: loadModulePath(loader + "-loader"),
        options: Object.assign({}, loaderOptions, {
          sourceMap: !!options.sourceMap
        })
      });
    }
    if (options.useVue) {
      return [loadModulePath("vue-style-loader")].concat(loaders);
    } else {
      return loaders;
    }
  };

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    less: generateLoaders("less"),
    sass: generateLoaders("sass", { indentedSyntax: true }),
    scss: generateLoaders("sass"),
    stylus: generateLoaders("stylus"),
    styl: generateLoaders("stylus")
  };
};

const exist = path => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
};

module.exports = {
  resolveSizeUnit,
  loadModulePath,
  cssLoaders,
  exist
};
