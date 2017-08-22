# {{ name }}

> {{ description }}

## getting start

```bash
npm install
```

## file structure

* `src/*`: all source code
* `build/*`: some build scripts
* `dist/*`: where places generated code
* `dist/assets/*`: some assets for Web preview
* `dist/index.html`: a page with Web preview and qrcode of Weex js bundle
* `dist/preview.html`: Web render
* `.babelrc`: babel config (preset-env by default)
* `.eslintrc`: eslint config (standard by default)

## npm scripts

```bash
# watch & build js bundles and preview the pages with hot-reloading
npm run start

# build both two js bundles for Weex and Web
npm run build

# build and serve root path in 8088 port.
npm run serve

# start weex-devtool for debugging with native
npm run debug
```

## notes

You can config more babel, ESLint and PostCSS plugins in `webpack.config.js`.
