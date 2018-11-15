import { CliConfiguration, ModType } from '../cli'
import * as path from 'path'

const debug = require('debug')('weex:core:install')

export default {
  name: 'uninstall',
  alias: ['un'],
  description: 'Uninstall weex plugin from Weex Cli',
  hidden: false,
  run: async toolbox => {
    const { parameters, fs, logger } = toolbox
    const globalConfiguration: CliConfiguration = parameters.options.__config
    const packagename = parameters.first
    const moduleConfigFilePath = path.join(globalConfiguration.moduleRoot, globalConfiguration.moduleConfigFileName)
    const showHelp = async () => {
      let commandData = [
        [logger.colors.green('Command'), logger.colors.green('Description')],
        [`install ${logger.colors.yellow('<Package>')}`, 'Install a extension or plugin for Weex Cli.'],
      ]
      logger.table(commandData, { format: 'markdown' })
      logger.info(`\nTo see the exist module, you can run \`weex version\``)
    }
    let name
    let mod
    if (packagename) {
      const first = packagename.slice(0, 1)
      // check for origin npm package
      if (first === '@') {
        const arg = packagename.split('@')
        if (arg.length > 2) {
          name = arg.join('@')
        } else {
          name = arg.join('@')
        }
      } else {
        const arg = packagename.split('@')
        if (arg.length > 1) {
          name = arg.join('@')
        } else {
          name = arg[0]
        }
      }
      mod = globalConfiguration.modules.mods[name]
      if (mod) {
        const spinner = logger.spin(`Uninstall ${name} ... please wait`)
        debug(`delete data from ${moduleConfigFilePath} ...`)
        spinner.text = `delete data from ${moduleConfigFilePath} ...`
        delete globalConfiguration.modules.mods[name]
        let local = mod.local || path.join(globalConfiguration.moduleRoot, 'node_modules', name)
        spinner.color = 'yellow'
        debug(`delete files on ${local} ...`)
        spinner.text = `delete files on ${local} ...`
        fs.remove(local)
        console.log(moduleConfigFilePath)
        spinner.text = `remove files success`
        debug(`update ${moduleConfigFilePath}`)
        spinner.text = `update ${moduleConfigFilePath}`
        debug(`write to module.json with json: ${JSON.stringify(globalConfiguration.modules.mods)}`)
        fs.write(moduleConfigFilePath, {
          mods: globalConfiguration.modules.mods,
          last_update_time: new Date().getTime(),
        })
        spinner.succeed(`Uninstall ${mod.type === ModType.EXTENSION ? 'Extension' : 'Plugin'} ${name} success!`)
      } else {
        logger.warn(`Extension or Plugin ${name} isn't installed, please check the package name.`)
        logger.info(`\nTo see the exist module, you can run \`weex version\``)
      }
    } else {
      await showHelp()
    }
  },
}
