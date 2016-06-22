# Weex Project

## How to start

### Install

```bash
npm install
```

### Development

* `npm run build`: build `src/main.we` into `dist/main.js`
* `npm run dev`: watch file changes of `src/main.we` and automatically build into `dist/main.js`
* `npm run serve`: preview in html5 renderer through `http://localhost:8080/`

*note: the entry file can be configured in `webpack.config.js`, learn more from [weex-loader](https://www.npmjs.com/package/weex-loader)*

Finally the generated code will be found in `dist` folder.
