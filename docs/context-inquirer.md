Inquirer strives to be an easily embeddable and beautiful command line interface for Node.js

You can access these tools on the `@weex-cli/core`, via `const { inquirer } = require('@weex-cli/core')`.

This is powered by [Inquirer.js](https://github.com/SBoudrias/Inquirer.js).

It should ease the process of:

- providing error feedback
- asking questions
- parsing input
- validating answers
- managing hierarchical prompts


> This is an **async** function.

## prompt

### context.inquirer.prompt(questions) -> promise

Launch the prompt interface (inquiry session)

- questions (Array) containing [Question Object](https://www.npmjs.com/package/inquirer#question) (using the [reactive interface](https://www.npmjs.com/package/inquirer#reactive-interface), you can also pass a Rx.Observable instance)
- returns a Promise

## registerPrompt
### context.inquirer.registerPrompt(name, prompt)

Register prompt plugins under name.

- name (string) name of the this new prompt. (used for question type)
- prompt (object) the prompt object itself (the plugin)

## createPromptModule
### context.inquirer.createPromptModule() -> prompt function

Create a self contained inquirer module. If you don't want to affect other libraries that also rely on inquirer when you overwrite or add new prompt types.

```javascript
let prompt = context.inquirer.createPromptModule();
 
prompt(questions).then(/* ... */);
```

More detail you can see [Inquirer.js](https://github.com/SBoudrias/Inquirer.js#readme).