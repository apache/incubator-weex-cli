const path = require('path')
export default {
  name: 'generate',
  alias: ['g'],
  description: 'Generate a new plugin',
  hidden: false,
  run: async toolbox => {
    const {
      parameters,
      template: { generate },
      fs,
      logger,
      inquirer,
      strings,
    } = toolbox
    const { kebabCase } = strings
    const name = parameters.first

    if (!name || name.length === 0) {
      logger.error('You must provide a valid Plugin name.')
      logger.error('Example: weex g foo.')
      return undefined
    } else if (!/^[a-z0-9-]+$/.test(name)) {
      const validName = kebabCase(name)
      logger.error(`${name} is not a valid name. Use lower-case and dashes only.`)
      logger.error(`Suggested: weex g ${validName}.`)
      return undefined
    }

    if (fs.exists(path.join(process.cwd(), name))) {
      const replace = await inquirer.ask({
        type: 'confirm',
        name: 'yesno',
        message: `Project ${name} is exist, replace it?`,
      })
      if (replace.yesno) {
        const spinner = logger.spin(`Removing ${path.join(process.cwd(), name)} ...`)
        spinner.start()
        fs.remove(path.join(process.cwd(), name))
        spinner.stop()
      } else {
        return undefined
      }
    }

    await generate(path.join(process.cwd(), name), path.join(process.cwd(), './templates/weex-toolkit-plugin'), {})
  },
}
