const { Doctor } = require('../lib')
const os = require('os');
const platform = os.platform();

/**
 * For check platform and provide some platform value
 */
const isMacOS = /^darwin/.test(platform);

module.exports = {
  name: 'doctor',
  description: 'Checks your system for configuration problems which might prevent the Weex CLI from working properly',
  run: async (
    {
      logger,
      parameters,
      meta
    }
  ) => {
    const options = parameters.options

    const showHelp = async () => {
      let params = {
        commandend: 'Run the doctor script check your environment',
        commands: [
          {
            heading: ['Usage', 'Description']
          },
          {
            key: 'doctor',
            description: 'Run the simulator'
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
      meta.generateHelp(params)
    }

    const doctor = async () => {
      const androidAndiOSDoctor = new Doctor();
      let spinner = logger.spin(`Verify iOS and Android environment ...`)
      const androidAndiOSReport = androidAndiOSDoctor.diagnose()
      let message = ''

      spinner.stopAndPersist({
        symbol: `${logger.checkmark}`,
        text: `Android${isMacOS?' and iOS': ''} Environment:`
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
    
    if (options.version || options.v) { // version from package.json

      logger.info(`v${require("../package.json").version}`);

    }
    else if (options.help || options.h) {
      await showHelp()
    }
    else {
      await doctor()
    }
  }
}