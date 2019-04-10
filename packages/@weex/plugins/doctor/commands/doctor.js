const { Doctor, VueDoctor, VueDoctorMessageType } = require('../lib')
const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const platform = os.platform();
const debug = require('debug')
const DEBUG = debug('plugin:doctor')

/**
 * For check platform and provide some platform value
 */
const isMacOS = /^darwin/.test(platform);

module.exports = {
  name: 'doctor',
  description: 'Checks your system for configuration problems which might prevent the Weex CLI from working properly',
  run: async (
    context
  ) => {
    const {
      logger,
      parameters,
      meta,
      install
    } = context
    const options = parameters.options
    const globalConfiguration = parameters.options.__config

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

    const installPackage = async (
      package,
      options
    ) => {
      const [name, version] = package.split('@')
      const res = await install(name, version || 'latest', options)
      return res
    }
    
    const doctor = async () => {
      try {
        const androidAndiOSDoctor = new Doctor();
        let spinner = logger.spin(`Verify iOS and Android environment ...`)
        const androidAndiOSReport = androidAndiOSDoctor.diagnose()
        let message = ''
        const coreConfig = parameters.options.__config.configs

        spinner.stopAndPersist({
          symbol: `${logger.checkmark}`,
          text: `Android${isMacOS?' and iOS': ''} Environment:`
        })
        logger.log(androidAndiOSReport)

        logger.log(`${logger.checkmark} Weex Cli Environment (v${coreConfig.version}, on ${os.platform} ${os.release()}):\n`)
        spinner = logger.spin(`Check if you need to update weex-cli core...`)
        
        if (!coreConfig.is_next && coreConfig.next_version) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
            text: `${logger.colors.red('@weex-cli/core is not the latest version')}`
          })
          logger.warn(`    •  You can run \`weex repair @weex-cli/core\` to update it.`)
        } 
        else {
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('@weex-cli/core')} ${logger.colors.grey(' - core module for the weex-toolkit')}`
          })
        }
        
        const moduleConfig = parameters.options.__config.modules
        const mods = moduleConfig.mods
        for (let item in mods) {
          spinner = logger.spin(`Check if you need to update ${item}...`)
          if (!mods[item].is_next && mods[item].next_version) {
            spinner.stopAndPersist({
              symbol: `${logger.colors.yellow(`[${logger.colors.yellow('!')}]`)}`,
              text: `${logger.colors.yellow(`Update available for ${item}`)}`
            })
            logger.log(`\n    •  Your current version is ${mods[item].version} and the latest available version is ${mods[item].next_version}.`)
            logger.warn(`    •  You can run \`weex update ${item}@latest\` to update it.\n`)
          } 
          else {
            spinner.stopAndPersist({
              symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
              text: `${logger.colors.green(`${item}`)}${logger.colors.grey(mods[item].description ? logger.colors.grey(` - ${mods[item].description}`) : ' - no description')}`
            })
          }
        }

        logger.log(`\n[vue environment] check if there has Vue packages version mismatch issue\n`)
      } catch (error) {
        parameters.options.__analyzer && parameters.options.__analyzer('doctor', error.stack)
      }
      try {
        // check if there has Vue packages version mismatch issue
        spinner = logger.spin(`Check if there has vue packages version mismatch issue`)
        let doctorStep = 0
        let vueDoctor = new VueDoctor(parameters.options.__config.moduleRoot, parameters.options.__config.coreRoot)
        vueDoctor.on(VueDoctorMessageType.log, (message) => {
          spinner.text = message
        })
        vueDoctor.on(VueDoctorMessageType.install, async (message) => {
          const { package, cwd } = JSON.parse(message) 
          await new Promise((resolve, reject) => {
            glob('+(_vue-template-compiler*|vue-template-compiler)', {cwd: path.join(cwd, 'node_modules')}, async (err, files) => {
              let len = files.length
              if (len > 0) {
                for(let i = 0; i < len; i++) {
                  try {
                    await fse.remove(path.join(cwd, 'node_modules', files[i]))
                  } catch (err) {
                    DEBUG('Remove _vue-template-compiler failed: ', err)
                  }
                }
              }
              resolve()
            })
          })
          await installPackage(package, {
            root: cwd,
            registry: globalConfiguration.registry,
            ENVS: globalConfiguration.ENVS
          })
          spinner.color = 'green'
          spinner.text = logger.colors.green(`Fix ${message.package} successed`)
        })
        vueDoctor.on(VueDoctorMessageType.error, (message) => {
          spinner.color = 'red'
          spinner.text = logger.colors.red(message)
        })
        vueDoctor.on(VueDoctorMessageType.warn, (message) => {
          spinner.color = 'yellow'
          spinner.text = logger.colors.yellow(message)
        })
        vueDoctor.on(VueDoctorMessageType.info, (message) => {
          spinner.color = 'white'
          spinner.text = message
        })
        vueDoctor.on(VueDoctorMessageType.end, (message) => {
          spinner.text = logger.colors.green(message)
          doctorStep ++
          if (doctorStep === 3) {
            spinner.stopAndPersist({
              symbol: `  -`,
              text: `AutoFix vue mismatch issue\n`
            })
          }
        })
        await vueDoctor.check()
      } catch (error) {
        parameters.options.__analyzer && parameters.options.__analyzer('doctor', error.stack)
      }
    }
    
    if (options.version || options.v) { 
      // version from package.json
      logger.log(`${require("../package.json").version}`);
    }
    else if (options.help || options.h) {
      await showHelp()
    }
    else {
      await doctor()
    }
  }
}