import { CliConfiguration, pickPlugins, searchPlugin, checkNpmPackageExist, repairPackage, analyzer } from '../cli'

const debug = require('debug')('weex:core:repair')

export default {
  name: 'repair',
  alias: ['r'],
  description: 'Repair weex package or command',
  hidden: false,
  run: async toolbox => {
    const { parameters, logger } = toolbox
    const repairMod = parameters.first
    const globalConfiguration: CliConfiguration = parameters.options.__config
    let repairName
    let repairVersion
    let plugins
    let plugin
    const showHelp = async () => {
      logger.success('\nRepair for Weex Cli Core success!\n')
      logger.info(`If you want to repair a specified module, you can use the command like:`)
      let commandData = [
        [logger.colors.green('Command'), logger.colors.green('Description')],
        [`repair ${logger.colors.yellow('<Package>')}`, 'Repair a specified module.'],
      ]
      logger.table(commandData, { format: 'markdown' })
      logger.info(`\nTo see the exist module, you can run \`weex version\``)
    }
    if (repairMod) {
      if (globalConfiguration.modules) {
        plugins = pickPlugins(globalConfiguration.modules)
      }
      // check if it is a command or alias
      plugin = searchPlugin(repairMod, plugins)
      if (plugin && plugin.name) {
        repairName = plugin.name
        repairVersion = 'latest'
      } else {
        const first = repairMod.slice(0, 1)
        // check for origin npm package
        if (first === '@') {
          const arg = repairMod.split('@')
          if (arg.length > 2) {
            repairVersion = arg.pop()
            repairName = arg.join('@')
          } else {
            repairName = arg.join('@')
            repairVersion = 'latest'
          }
        } else {
          const arg = repairMod.split('@')
          if (arg.length > 1) {
            repairVersion = arg.pop()
            repairName = arg.join('@')
          } else {
            repairName = arg[0]
            repairVersion = 'latest'
          }
        }
      }
      const res: { error?: string; [key: string]: any } = await checkNpmPackageExist(
        repairName,
        repairVersion,
        globalConfiguration.registry,
      )
      if (!res.error) {
        try {
          await repairPackage(globalConfiguration, repairName, repairVersion)
          debug(`repair ${repairName} successed!`)
          logger.success(`\nRepair ${repairName} successed!`)
        } catch (e) {
          await analyzer('repair', e.stack, { name: repairName, version: repairVersion })
        }
      } else {
        if (res.versions) {
          await analyzer('repair', res.error, {
            name: repairName,
            version: repairVersion,
            versions: res.versions,
          })
        } else {
          await analyzer('repair', res.error, { name: repairName, version: repairVersion })
        }
      }
    } else {
      await showHelp()
    }
  },
}
