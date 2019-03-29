Provides functions for open files.

You can access these tools on the `@weex-cli/core`, via `const { open, chromeOpn } = require('@weex-cli/core')`, .


## open

### context.open(target, appName, callback)

- target (string) - the file/uri to open
- appName (string) - (optional) the application to be used to open the file (for example, "chrome", "firefox")
- callback (function) - called with null on success, or an error object that contains a property 'code' with the exit code of the process.

```js
const open = context.open
open('https://weex.io', 'chrome', (error) => {
  if (error) {
    console.log(error)
  }
})
```

## chromeOpn

Powered by [chrome-opn](https://www.npmjs.com/package/chrome-opn).

```js
const chromeOpn = context.chromeOpn
chromeOpn('https://weex.io', null, false)
```
