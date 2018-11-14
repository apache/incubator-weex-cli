const { Doctor } = require('../lib')

module.exports = {
  name: 'doctor',
  description: 'Checks your system for configuration problems which might prevent the Weex CLI from working properly',
  run: async (
    {
      logger,
      parameters
    }
  ) => {
    const androidAndiOSDoctor = new Doctor();
    let spinner = logger.spin(`Verify iOS and Android environment ...`)
    const androidAndiOSReport = androidAndiOSDoctor.diagnose()
    let message = ''

    spinner.stopAndPersist({
      symbol: `${logger.checkmark}`,
      text: 'Android and iOS Environment:'
    })
    logger.log(androidAndiOSReport)

    logger.log(`${logger.checkmark} Weex Cli Environment:\n`)
    spinner = logger.spin(`Check if you need to update weex-cli core...`)
    
    const coreConfig = parameters.options.__config.configs
    if (!coreConfig.is_next && coreConfig.next_version) {
      spinner.stopAndPersist({
        symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
        text: `${logger.colors.red('@weex-cli/core is not the latest version')}`
      })
      logger.warn(`    •  You can run \`weex repair @weex-cli/core@latest\` to update it.`)
    } 
    else {
      spinner.stopAndPersist({
        symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
        text: `${logger.colors.green('@weex-cli/core is the latest version')}`
      })
    }
    
    const moduleConfig = parameters.options.__config.modules
    const mods = moduleConfig.mods
    for (let item in mods) {
      spinner = logger.spin(`Check if you need to update ${item}...`)
      if (!mods[item].is_next && mods[item].next_version) {
        spinner.stopAndPersist({
          symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
          text: `${logger.colors.red(`${item} is not the latest version`)}`
        })
        logger.warn(`\n    •  You can run \`weex repair ${item}@latest\` to update it.\n`)
      } 
      else {
        spinner.stopAndPersist({
          symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
          text: `${logger.colors.green(`${item} is the latest version`)}`
        })
      }
    }
    
  }
}