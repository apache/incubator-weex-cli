import { CliConfiguration, ModType, installPackage } from '../cli'
import * as path from 'path'

const debug = require('debug')('weex:core:install')

export default {
  name: 'install',
  alias: ['update', 'i'],
  description: 'Install weex plugin for Weex Cli',
  hidden: false,
  run: async ({ parameters, fs, logger }) => {
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
    let version
    let name
    if (packagename) {
      const first = packagename.slice(0, 1)
      // check for origin npm package
      if (first === '@') {
        const arg = packagename.split('@')
        if (arg.length > 2) {
          version = arg.pop()
          name = arg.join('@')
        } else {
          name = arg.join('@')
          version = 'latest'
        }
      } else {
        const arg = packagename.split('@')
        if (arg.length > 1) {
          version = arg.pop()
          name = arg.join('@')
        } else {
          name = arg[0]
          version = 'latest'
        }
      }
      const packages: any = await installPackage(globalConfiguration, name, version, {
        root: globalConfiguration.moduleRoot,
        registry: globalConfiguration.registry,
        ENVS: globalConfiguration.ENVS,
      })
      let commands = []
      let type = ModType.EXTENSION
      for (let i = 0; i < packages.length; i++) {
        const commandBasePath = path.join(packages[i].root, 'commands')
        const extensionBasePath = path.join(packages[i].root, 'extensions')
        const commandFiles: string[] = fs.list(commandBasePath) || []
        // continue next package while the package has not commands and extensions folder
        if (!fs.exists(commandBasePath) && !fs.exists(extensionBasePath)) {
          logger.log(`The module ${logger.colors.yellow(packages[i].package.name)} was not suitable for the weex core`)
          logger.log('Please check the spelling')
          return
        }
        commandFiles.forEach(file => {
          let content
          try {
            content = require(path.join(commandBasePath, file))
          } catch (e) {
            debug(`Check module error with: ${e.stack}`)
            // try prev version
          }
          commands.push({
            name: (content && content.name) || '',
            alias: (content && content.alias) || '',
            showed: content && typeof content.dashed === 'boolean' ? !content.dashed : true,
            description: (content && content.description) || '',
          })
          type = ModType.PLUGIN
        })
        if (commands.length > 0) {
          globalConfiguration.modules.mods[packages[i].package.name] = {
            type: type,
            description: packages[i].package.description,
            version: packages[i].package.version,
            dependencies: packages[i].package.pluginDependencies,
            next_version: '',
            is_next: true,
            changelog: packages[i].package.changelog || '',
            local: packages[i].root,
            commands: commands,
          }
          commands = []
        } else {
          globalConfiguration.modules.mods[packages[i].package.name] = {
            type: type,
            description: packages[i].package.description,
            version: packages[i].package.version,
            dependencies: packages[i].package.pluginDependencies,
            next_version: '',
            is_next: true,
            changelog: packages[i].package.changelog || '',
            local: packages[i].root,
          }
        }
      }
      debug(`write to module.json with json: ${JSON.stringify(globalConfiguration.modules.mods)}`)
      // update module file
      fs.write(moduleConfigFilePath, {
        mods: globalConfiguration.modules.mods,
        last_update_time: new Date().getTime(),
      })
      logger.success(`\nInstall ${type === ModType.EXTENSION ? 'Extension' : 'Plugin'} ${packagename} success!`)
    } else {
      await showHelp()
    }
  },
}
