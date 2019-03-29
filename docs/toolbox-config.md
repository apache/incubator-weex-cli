You can have your plugin authors configure the behavior of your CLI by providing a configuration file in the root of any plugin. 

This is an object. Each plugin will have its own root level key.

For example, in `weex-cli-plugin-logger` project, you can put an `weex-cli-plugin-logger.config.js` in the root.

In `weex-cli-plugin-logger.config.js`:

```javascript
module.exports = {
  name: 'log',
  defaults: {
    data: 'Test Data'
  },
}
```

In the commands, you can use this data by:

```javascript
module.exports = {
  name: 'log',
  description: 'My first Weex Toolkit Plugin',
  alias: 'l',
  run: (context) => {
    console.log(context.config.log)
  }
}
```

The output should be an object:

```
{
  data: 'Test Data'
}
```

If you'd like to load your own config files, use the `loadConfig` function included in the config object which is powered by [cosmiconfig](https://github.com/davidtheclark/cosmiconfig):

```js
module.exports = {
  run: async context => {
    const {
      config: { loadConfig },
      print: { info },
      runtime: { brand },
    } = context

    const myConfig = loadConfig('~/.myconfig/', 'filename')

    // if you want to load multiple configs and have them override:
    const currentFolder = process.cwd()
    const myConfig = {
      ...loadConfig('~/.myconfig/', 'filename'),
      ...loadConfig('~/configurations/myconfig/', 'filename'),
      ...loadConfig(currentFolder, 'filename'),
    }
  }
}
```

By default, Cosmiconfig will start where you tell it to start and search up the directory tree for the following:

- a package.json property
- a JSON or YAML, extensionless "rc file"
- an "rc file" with the extensions .json, .yaml, .yml, or .js.
- a .config.js CommonJS module

For example, if your module's name is "soursocks", cosmiconfig will search up the directory tree for configuration in the following places:

- a soursocks property in package.json
- a .soursocksrc file in JSON or YAML format
- a .soursocksrc.json file
- a .soursocksrc.yaml, .soursocksrc.yml, or .soursocksrc.js file
- a soursocks.config.js file exporting a JS object

Cosmiconfig continues to search up the directory tree, checking each of these places in each directory, until it finds some acceptable configuration (or hits the home directory).
