# Context API

Let's explore the inside of the Weex Toolkit "Context API".

```js
module.exports = {
  name: 'dostuff',
  alias: 'd',
  run: async (context) => {
    // great! now what?
  },
}
```

Here's what's available inside the `context` object you see all over Gluegun.

| name           | provides the...                                    | 3rd party                      |
| -------------- | -------------------------------------------------- | ------------------------------ |
| **meta**       | information about the currently running CLI        |                                |
| **config**     | configuration options from the app or plugin       |                                |
| **fs** | ability to copy, move & delete files & directories | fs-jetpack                     |
| **http**       | ability to talk to the web                         | apisauce                       |
| **parameters** | command line arguments and options                 | yargs-parser                   |
| **patching**   | manipulating file contents easily                  | fs-jetpack                     |
| **print**      | tools to print output to the command line          | colors, ora                    |
| **inquirer**     | tools to acquire extra command line user input     | inquirer                       |
| **semver**     | utilities for working with semantic versioning     | semver                         |
| **strings**    | some string helpers like case conversion, etc.     | lodash & ramda                 |
| **system**     | ability to execute                                 | node-which, execa, cross-spawn |
| **open**     | ability to open files                                 | open, chrome-opn |

The `context` has "drawers" full of useful tools for building CLIs. For example, the `context.meta.version` function can be invoked like this:

```js
module.exports = {
  name: 'dostuff',
  alias: 'd',
  run: async (context) => {
    // use them like this...
    context.logger.info(context.meta.version())

    // or destructure!
    const {
      logger: { info },
      meta: { version },
    } = toolbox
    info(version())
  },
}
```

To learn more about each tool, explore the rest of the `context-*.md` files in this folder.

