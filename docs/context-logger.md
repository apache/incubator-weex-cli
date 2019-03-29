Features for allowing you to print to the console.

You can access these tools on the `@weex-cli/core`, via `const { logger } = require('@weex-cli/core')`.

## info

Prints an informational message. Use this as your goto.

```js
context.logger.info('This is a info message')
```

## success

Print a "something good just happened" message.

```js
context.logger.success('This is a success message')
```

## warn

Prints a warning message. Use this when you feel a disturbance in the force.

```js
context.logger.warn("This is a warning message")
```

## error

Prints an error message. Use this when something goes Pants-On-Head wrong. What does that mean?
Well, if your next line of code isn't `process.exit(0)`, then it was probably a warning.

```js
context.logger.error('This is an error message')
```

## timestamp

Prints message with timestamp.

```
context.logger.timestamp('This is a timestamp message')
```

## colors

An object for working with printing colors on the command line. It is from the `colors` NPM package,
however we define a theme to make things a bit consistent. Powered by [colors](https://www.npmjs.com/package/colors).

Some available functions include:

| function           | use when you want...                     |
| ------------------ | ---------------------------------------- |
| `colors.success()` | the user to smile                        |
| `colors.error()`   | to say something has failed              |
| `colors.warning()` | to point out that something might be off |
| `colors.info()`    | to say something informational           |
| `colors.muted()`   | you need to say something secondary      |

Each take a `string` parameter and return a `string`.

One gotcha here is that the length of the string is longer than you think because of the embedded
color codes that disappear when you print them. 🔥

## spin

Creates a spinner for long running tasks on the command line. It's
[ora](https://github.com/sindresorhus/ora)!

Here's an example of how to work with it:

```js
// a spinner starts with the text you provide
const spinner = context.logger.spin('Time for fun!')
await toolbox.system.run('sleep 5')
```

!> Make sure you don't print anything else while a spinner is going. You need to stop it first.

There's a few ways to stop it.

```js
// stop it & clear the text
spinner.stop()

// stop it, leave a checkmark, and optional new text
spinner.succeed('woot!')

// stop it, leave an X, and optional new text
spinner.fail('womp womp.')

// stop it, leave a custom label, and optional new text
spinner.stopAndPersist({ symbol: '🚨', text: 'osnap!' })
```

Once stopped, you can start it again later.

```js
spinner.start()
```

You can change the color of the spinner by setting:

```js
spinner.color = 'cyan'
```

The text can also be set with the normal printing colors.

```js
spinner.text = context.logger.colors.green('i like trees')
```

## printHelp

Prints a default help screen, consisting of the brand name, version, and `printCommands` output (next).

```js
const { printHelp } = context.logger
printHelp(context)
```

## printCommands

Prints out a table of available commands in a given toolbox.

```js
const { printCommands } = context.logger
printCommands(context)
```

You can pass in a "command path" to refine what commands you'd like to see:

```js
const { printCommands } = context.logger
printCommands(context, ['compile'])
```

## table

Prints out a table of data, including a header. You can choose from three different formats:
`default`, `markdown`, and `lean`.

```js
const { table } = context.logger
table(
  [
    ['First Name', 'Last Name', 'Age'],
    ['Jamon', 'Holmgren', 35],
    ['Gant', 'Laborde', 36],
    ['Steve', 'Kellock', 43],
    ['Gary', 'Busey', 73],
  ],
  { format: 'markdown' },
)
```

Output:

```
| First Name | Last Name | Age |
| ---------- | --------- | --- |
| Jamon      | Holmgren  | 35  |
| Gant       | Laborde   | 36  |
| Steve      | Kellock   | 43  |
| Gary       | Busey     | 73  |
```

## newline

Print a newline.

```js
const { newline } = context.logger
newline()
```

## progress

An `gauge`-powered progressbar. see [gauge](https://www.npmjs.com/package/gauge).

```js
const { progress } = context.logger
let progressbar = progress()
```

## checkmark

A green checkmark.
```js
const { checkmark } = context.logger
context.logger.log(checkmark)
```

## xmark

A red X marks the spot.
```js
const { xmark } = context.logger
context.logger.log(xmark)
```
