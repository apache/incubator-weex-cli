const utils = require("./utils");

module.exports = options => {
  return {
    loaders: utils.cssLoaders({
      // sourceMap: use sourcemao or not.
      sourceMap: options && options.sourceMapEnabled,
      // useVue: use vue-style-loader or not
      useVue: options && options.useVue,
      // usePostCSS: use postcss to compile styles.
      usePostCSS: options && options.usePostCSS
    })
  };
};
