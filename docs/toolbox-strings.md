Provides some helper functions to work with strings. This list is also added to the available filters
inside your EJS templates.

You can access these tools on the `@weex-cli/core`, via `const { strings } = require('@weex-cli/core')`.

---

## identity

Returns the **input** as **output**. Great for functional programming like sorting or fallbacks.

** arguments **

- `value` can be `any` type which becomes the return value of this function.

** returns **

- the `value` that was passed in

```js
const { identity } = context.strings
identity('hello') // hello
identity(4) // 4
identity([1, 'a']) // [1, 'a']
```

## isBlank

Determines if a string is empty by trimming it first.

```js
const { isBlank } = context.strings
isBlank('') // true
isBlank('   ') // true
```

## isNotString

Tests a value to see if it is not a string.

```js
const { isNotString } = context.strings
isNotString(true) // true
isNotString(null) // true
isNotString(undefined) // true
isNotString(123) // true
isNotString('hi') // false
```

---

## **Growing**

## pad

Centers a string to a given length.

```js
const { pad } = context.strings
pad('hola', 20) // '        hola        '
```

## padStart

Fills a string to a certain length by adding characters to the front.

```js
const { padStart } = context.strings
padStart('hello', 10, '.') // '.....hello'
```

## padEnd

Fills a string to a certain length by adding characters to the end.

```js
const { padEnd } = context.strings
padEnd('hello', 10, '!') // 'hello!!!!!'
```

## repeat

Repeats a string a number of times to make a pattern.

```js
const { repeat } = context.strings
repeat('x', 3) // 'xxx'
repeat('xo', 3) // 'xoxoxo'
```

---

## **Shrinking**

## trim

Strips white space from both the start and end of a string, but not the middle.

```js
const { trim } = context.strings
trim('    kevin   spacey    ') // 'kevin   spacey'
```

## trimStart

Strips white space from the start of a string.

```js
const { trimStart } = context.strings
trimStart('          hi ') // 'hi '
```

## trimEnd

Strips white space from the end of a string.

```js
const { trimEnd } = context.strings
trimEnd('windows!\r\n') // 'windows!'
```

---

## **Case Conversion**

## camelCase

Capitalizes the first letter of each word it smashes together on word boundaries. The first letter becomes lowercase. Puncuation gets dropped.

Great for assembling javascript variable names.

```js
const { camelCase } = context.strings
camelCase('hello there') // 'helloThere'
camelCase('Hello there') // 'helloThere'
camelCase('abc123') // 'abc123'
camelCase('Y M C A') // 'yMCA'
camelCase('Welcome to ZOMBO.com') // 'welcomeToZomboCom'
camelCase('XMLHttpRequest is strange.') // 'xmlHttpRequestIsStrange'
camelCase('OSnap') // 'oSnap'
camelCase('this.is.sparta!') // 'thisIsSparta'
```

## kebabCase

Skewers words by placing - characters between them and downcasing.

```js
const { kebabCase } = context.strings
kebabCase('hello there') // 'hello-there'
kebabCase('Hello there') // 'hello-there'
kebabCase('abc123') // 'abc-123'
kebabCase('Y M C A') // 'y-m-c-a'
kebabCase('Welcome to ZOMBO.com') // 'welcome-to-zombo-com'
kebabCase('XMLHttpRequest is strange.') // 'xml-http-request-is-strange'
kebabCase('OSnap') // 'o-snap'
kebabCase('this.is.sparta!') // 'this-is-sparta'
```

## snakeCase

Joins words together with underscores after splitting up into word boundaries.

Great for ruby and some apis.

```js
const { snakeCase } = context.strings
snakeCase('hello there') // 'hello_there'
snakeCase('Hello there') // 'hello_there'
snakeCase('abc123') // 'abc_123'
snakeCase('Y M C A') // 'y_m_c_a'
snakeCase('Welcome to ZOMBO.com') // 'welcome_to_zombo_com'
snakeCase('XMLHttpRequest is strange.') // 'xml_http_request_is_strange'
snakeCase('OSnap') // 'o_snap'
snakeCase('this.is.sparta!') // 'this_is_sparta'
```

## upperCase

A staple in every troll's toolbelt, this makes everything uppercase.

```js
const { upperCase } = context.strings
upperCase('hello there') // 'HELLO THERE'
upperCase('Hello there') // 'HELLO THERE'
upperCase('abc123') // 'ABC 123'
upperCase('Y M C A') // 'Y M C A'
upperCase('Welcome to ZOMBO.com') // 'WELCOME TO ZOMBO COM'
upperCase('XMLHttpRequest is strange.') // 'XML HTTP REQUEST IS STRANGE'
upperCase('OSnap') // 'O SNAP'
upperCase('this.is.sparta!') // 'THIS IS SPARTA'
```

## lowerCase

This makes everything lower case.

```js
const { lowerCase } = context.strings
lowerCase('hello there') // 'hello there'
lowerCase('Hello there') // 'hello there'
lowerCase('abc123') // 'abc 123'
lowerCase('Y M C A') // 'y m c a'
lowerCase('Welcome to ZOMBO.com') // 'welcome to zombo com'
lowerCase('XMLHttpRequest is strange.') // 'xml http request is strange'
lowerCase('OSnap') // 'o snap'
lowerCase('this.is.sparta!') // 'this is sparta'
```

## startCase

Uppercases the first letter of each word after dicing up on word boundaries.

```js
const { startCase } = context.strings
startCase('hello there') // 'Hello There'
startCase('Hello there') // 'Hello There'
startCase('abc123') // 'Abc 123'
startCase('Y M C A') // 'Y M C A'
startCase('Welcome to ZOMBO.com') // 'Welcome To ZOMBO Com'
startCase('XMLHttpRequest is strange.') // 'XML Http Request Is Strange'
startCase('OSnap') // 'O Snap'
startCase('this.is.sparta!') // 'This Is Sparta'
```

## upperFirst

Uppercases the first letter of the string.

```js
const { upperFirst } = context.strings
upperFirst('hello there') // 'Hello there'
upperFirst('Hello there') // 'Hello there'
upperFirst('abc123') // 'Abc123'
upperFirst('Y M C A') // 'Y M C A'
upperFirst('Welcome to ZOMBO.com') // 'Welcome to ZOMBO.com'
upperFirst('XMLHttpRequest is strange.') // 'XMLHttpRequest is strange.'
upperFirst('OSnap') // 'OSnap'
upperFirst('this.is.sparta!') // 'This.is.sparta!'
```

## lowerFirst

Lowercases the first letter of the string.

```js
const { lowerFirst } = context.strings
lowerFirst('hello there') // 'hello there'
lowerFirst('Hello there') // 'hello there'
lowerFirst('abc123') // 'abc123'
lowerFirst('Y M C A') // 'y M C A'
lowerFirst('Welcome to ZOMBO.com') // 'welcome to ZOMBO.com'
lowerFirst('XMLHttpRequest is strange.') // 'xMLHttpRequest is strange.'
lowerFirst('OSnap') // 'oSnap'
lowerFirst('this.is.sparta!') // 'this.is.sparta!'
```

## pascalCase

This is `camelCase` + `upperFirst`.

```js
const { pascalCase } = context.strings
pascalCase('hello there') // 'HelloThere'
pascalCase('Hello there') // 'HelloThere'
pascalCase('abc123') // 'Abc123'
pascalCase('Y M C A') // 'YMCA'
pascalCase('Welcome to ZOMBO.com') // 'WelcomeToZomboCom'
pascalCase('XMLHttpRequest is strange.') // 'XmlHttpRequestIsStrange'
pascalCase('OSnap') // 'OSnap'
pascalCase('this.is.sparta!') // 'ThisIsSparta'
```

## pluralize

Pluralize or singularize a word based on the passed in count.

```js
const { pluralize } = context.strings
pluralize('test', 1) // 'test'
pluralize('test', 5) // 'tests'
pluralize('test', 1, true) // '1 test'
pluralize('test', 5, true) // '5 tests'
```

## plural

Converts a given singular word to plural.

```js
const { plural } = context.strings
plural('bug') // 'bugs'
plural('word') // 'words'
```

## singular

Converts a given plural word to singular.

```js
const { singular } = context.strings
singular('bugs') // 'bug'
singular('words') // 'word'
```

## isPlural

Checks if the give word is plural.

```js
const { isPlural } = context.strings
isPlural('bugs') // true
isPlural('bug') // false
```

## isSingular

Checks if the give word is singular.

```js
const { isSingular } = context.strings
isSingular('bugs') // false
isSingular('bug') // true
```

## addPluralRule

Adds a pluralization rule for the given singular word when calling plural.

```js
const { addPluralRule } = context.strings
addPluralRule('regex', 'regexii')
addPluralRule(/regex$/, 'regexii')
```

## addSingularRule

Adds a pluralization rule for the given plural word when calling singular.

```js
const { addSingularRule } = context.strings
addSingularRule('regexii', 'regex')
addSingularRule(/regexii$/, 'regex')
```

## addIrregularRule

Adds a pluralization rule for the given irregular word when calling plural.

```js
const { addIrregularRule } = context.strings
addIrregularRule('octopus', 'octopodes')
```

## addUncountableRule

Exempts the given uncountable word from pluralization so that calling plural or singular with that word will return the same word unchanged.

```js
const { addUncountableRule } = context.strings
addUncountableRule('paper')
```
