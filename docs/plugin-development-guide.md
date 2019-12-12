# Plugin Development Guide

## Getting started

A CLI plugin is an npm package that can add additional features or context api to the Weex Toolkit, that can make the Weex Toolkit to be more powerful.

In addition, `weex-toolkit` supports expanding your CLI's ecosystem with a robust set of easy-to-write plugins and extensions.

## Code

As a third-part plugin, we recommend that you use `weex-cli-plugin-` as your package prefix, e.g `weex-cli-plugin-logger`.

Let's start with write a Weex Toolkit plugin.

```base
$ weex create weex-templates/weex-toolkit-plugin weex-cli-plugin-logger && cd weex-cli-plugin-logger
```

You can open the folder and see this demo, it's very simple that we can easily know how to write our own plugins.

## Extensions

Extensions are some attach function that provide you ability to expand the `Context API`.

```javascript
// attach context api
module.exports = context => {
  context.log = message => {
    console.log("Welcome to Weex Toolkit");
    console.log(message);
  };
};
```

The extensions will be loaded before the commands being called, so you can extend the contextapi capability and use it safely in the command.

In addition, if your plugin wants to rely on the extensions provided by other plugins, you can ensure that your commands work correctly by specifying `pluginDependencies` in `package.json`. e.g:

```
{
  ...
  "pluginDependencies": {
    "@weex-cli/compile": "latest"
  }
  ...
}
```

## Commands

Commands are simple objects that provide a name, optional aliases, and a function to run.

```javascript
// build log command
module.exports = {
  name: "log",
  description: "My first Weex Toolkit Plugin",
  alias: "l",
  run: context => {
    context.log("My first Weex Toolkit Plugin");
  }
};
```

You can use the API from the context, also you can include modules to build your command.

See the [Context API](./context-api) docs for more details on what you can do.

## What's under the context?

We've assembled an all star cast of libraries to help you build your CLI.  
⭐️ [chrome-opn](https://github.com/JeromeTan1997/chrome-opn) for open file<br />
⭐️ [inquirer](https://github.com/SBoudrias/Inquirer.js) for prompts<br />
⭐️ [semver](https://github.com/npm/node-semver) for version investigations<br />
⭐️ [fs-jetpack](https://github.com/szwacz/fs-jetpack) for the filesystem<br />
⭐️ [yargs-parser](https://github.com/yargs/yargs-parser), [enquirer](https://github.com/enquirer/enquirer), [colors](https://github.com/Marak/colors.js), [ora](https://github.com/sindresorhus/ora) and [cli-table3](https://github.com/cli-table/cli-table3) for the command line<br />
⭐️ [axios](https://github.com/mzabriskie/axios) & [apisauce](https://github.com/skellock/apisauce) for web & apis<br />
⭐️ [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for flexible configuration </br>
⭐️ [cross-spawn](https://github.com/IndigoUnited/node-cross-spawn) for running sub-commands</br>
⭐️ [execa](https://github.com/sindresorhus/execa) for running more sub-commands</br>
⭐️ [node-which](https://github.com/npm/node-which) for finding executables</br>
⭐️ [pluralize](https://github.com/blakeembrey/pluralize) for manipulating strings</br>

## How to test the plugin

1. publish to `npm`

After that, you can install the plugin by `weex install [packagename]`, such as `weex install weex-cli-plugin-logger`.

2. edit the `~/.wx/modules/stores.json` file

Add your local path of the project into the configuration file, and modify the config by yourself. e.g:

```
{
  ...
  "weex-cli-plugin-logger": {
    "type": 0,
    "description": "A Weex Toolkit plugin project",
    "version": "1.0.0",
    "next_version": "",
    "is_next": true,
    "changelog": "",
    "local": "/Users/kw/.wx/modules/node_modules/weex-cli-plugin-logger",
    "commands": [
      {
        "name": "log",
        "alias": "l",
        "showed": true,
        "description": "My first Weex Toolkit Plugin"
      }
    ]
  }
  ...
}
```

3. use `weex link`

TODO
