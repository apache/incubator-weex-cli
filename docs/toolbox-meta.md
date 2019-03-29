Provides functions for accessing information about the currently running CLI. You can access this on the `@weex-cli/core`.

## version

Retrieves the currently running CLI's version.

```js
context.meta.version() // '2.0.0'
```

## commandInfo

Retrieves information about all of this CLI's commands. You can use this to display a custom help screen, for example.

```js
const commandInfo = context.meta.commandInfo()
context.logger.table(commandInfo)
```

## getModulesInfo

Retrieves all the modules install on the user's platform. You can use this to know which modules does user installed.

```js
const moduleInfo = context.meta.getModulesInfo()
context.logger.log(moduleInfo)
```

## generateHelp

Used for generate help info like the official plugin.

```js
let params = {
  appstart: 'Before all',
  append: 'After all',
  commandend: 'After command',
  optionend: 'After option',
  commands: [
    {
      heading: ['Usage', 'Description']
    },
    {
      key: 'log',
      type: '[message]', // will be highlight
      description: 'log message.',
      default: 'Welcome',
      required: false,
      alias: 'l'
    }
  ],
  options: {
    'Miscellaneous:': [
      {
        key:'-v, --version',
        description: 'Output the version number'
      },
      {
        key:'-h, --help',
        description: 'Show help'
      }
    ]
  }
}
context.meta.generateHelp(params)
```