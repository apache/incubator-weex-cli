Information about how the command was invoked. You can access this on the `@weex-cli/core`. Check out this example of creating a new Weex Toolkit plugin.

```sh
weex log welcome to weex --color red --cache
```

| name        | type   | purpose                           | from the example above               |
| ----------- | ------ | --------------------------------- | ------------------------------------ |
| **command** | string | the command used                  | `'log'`                           |
| **string**  | string | the command arguments as a string | `'welcome to weex`                         |
| **array**   | array  | the command arguments as an array | `['welcome', 'to', 'weex']`        |
| **first**   | string | the 1st argument                  | `'welcome'`                  |
| **second**  | string | the 2nd argument                  | `'to'`                             |
| **third**   | string | the 3rd argument                  | `'weex'`                          |
| **options** | object | command line options              | `{cache: true, color: 'red'}` |
| **argv**    | object | raw argv                          |                                      |

## options

Options are the command line flags. Always exists however it may be empty.

```sh
weex log --color red --small --no-cache
```

```js
module.exports = async function(context) {
  context.parameters.options // { color: red, small: true, cache: false, ...}
}
```

Also there has some useful function or data on the options by default. such as `context.parameters.options.__config`, `context.parameters.options.__analyzer`.

## string

Everything else after the command as a string.

```sh
weex log hello there
```

```js
module.exports = async function(context) {
  context.parameters.string // 'hello there'
}
```

## array

Everything else after the command, but as an array.

```sh
weex log say yeah
```

```js
module.exports = async function(context) {
  context.parameters.array // ['say', 'yeah']
}
```

## first / .second / .third

The first, second, and third element in `array`. It is provided as a shortcut, and there isn't one,
this will be `undefined`.

```sh
weex log welcome to weex
```

```js
module.exports = async function(context) {
  context.parameters.first // 'welcome'
  context.parameters.second // 'to'
  context.parameters.third // 'weex'
}
```