import { build, fs, IParameters, http, install, logger, strings, semver, inquirer } from '../index'
import { parseParams } from '../toolbox/parameter-tools'
import * as path from 'path'

const debug = require('debug')('weex:core')

export enum ModType {
  PLUGIN,
  EXTENSION,
}

export enum ErrorType {
  PACKAGE_VERSION_NOT_FOUND = 101,
  PACKAGE_NOT_FOUND,
}
export interface ModData {
  mods: {
    [key: string]: ModItem
  }
  last_update_time: number
}

export interface ModItem {
  type: ModType
  version: string
  dependencies?: {
    [key: string]: string
  }
  next_version?: string
  is_next?: boolean
  changelog?: string
  local: string
  commands?: string[]
}
export interface PluginItem {
  value?: string
  options?: any
  commands?: {
    name: string
    alias: string
    description: string
    showed: boolean
  }[]
  name?: string
}

export interface CliConfiguration {
  corePath: string
  coreName: string
  moduleRoot: string
  moduleConfigFileName: string
  home: string
  registry: string
  argv: string
  trash: string
  modules: ModData,
  globalConfigFileName: string
  configs?: {
    [key: string]: any
  }
}

export interface CoreOptions {
  brand?: string
  help?: any
  defaultCommand?: any
  version?: any
  plugin?: {
    value?: string
    options?: any
  }
  plugins?: {
    value?: string
    options?: any
  }
  exclude?: string[]
}

export default class Cli {
  private cli: any
  private rawArgv: string[] | string
  private argv: IParameters
  private plugins: PluginItem[] = []
  private cliConfiguration: CliConfiguration
  constructor(data: CliConfiguration, options: CoreOptions = {}) {
    debug('Init Cli instance on <%s>', __filename)

    this.rawArgv = data.argv

    this.argv = parseParams(data.argv)

    this.cliConfiguration = data
    // create a CLI runtime
    this.cli = build(options.brand || 'weex')
      .src(__dirname)
      .help(options.help)
      .version(options.version)
      .exclude(options.exclude)
      .defaultCommand(options.defaultCommand)

    if (options.plugins && options.plugins.value) {
      this.cli = this.cli.plugins(options.plugins.value, options.plugins.options)
    }

    if (!this.cliConfiguration.modules.mods) {
      this.cliConfiguration.modules['mods'] = {}
      this.cliConfiguration.modules['last_update_time'] = new Date().getTime()
    }

    if (options.plugin) {
      if (Array.isArray(options.plugin)) {
        options.plugin.forEach(p => {
          this.cli = this.cli.plugin(p.value, p.options)
        })
      } else {
        this.cli = this.cli.plugin(options.plugin.value, options.plugin.options)
      }
    }

  }

  async start() {
    const command = this.argv.array[0]
    const moduleConfigFilePath = path.join(this.cliConfiguration.moduleRoot, this.cliConfiguration.moduleConfigFileName)
    if (this.cliConfiguration.modules) {
      this.plugins = pickPlugins(this.cliConfiguration.modules)
    }
    else {
      fs.write(moduleConfigFilePath, {
        mods: {},
        last_update_time: new Date().getTime(),
      })
    }
    if (command === 'repair') {
      debug(`Do repair`)
    } else if (command === 'config') {
      debug('Do config')
    } else if (command === 'install') {
      debug('Do install')
    } else if (command === 'uninstall') {
      debug('Do uninstall')
    } else if (command) {
      const plugin = searchPlugin(command, this.plugins)
      let commands = []
      let type = ModType.EXTENSION
      // If the module has been instll, skip
      if (!plugin || !plugin.name) {
        const res: { error?: string;[key: string]: any } = await suggestPackage(command, this.cliConfiguration.registry)
        if (!res.error) {
          const packages: any = await installPackage(this.cliConfiguration, `@weex-cli/${command}`, 'latest', {
            root: this.cliConfiguration.moduleRoot,
            registry: this.cliConfiguration.registry,
          })
          for (let i = 0; i < packages.length; i++) {
            const commandBasePath = path.join(packages[i].root, 'commands')
            const commandFiles: string[] = fs.list(commandBasePath) || []
            commandFiles.forEach(file => {
              let content
              try {
                content = require(path.join(commandBasePath, file))
              } catch (e) {
                debug(`Check module error with: ${e.stack}`)
                // try prev version
              }
              commands.push({
                name: content.name || '',
                alias: content.alias || '',
                showed: typeof content.dashed === 'boolean' ? !content.dashed : true,
                description: content.description || '',
              })
              type = ModType.PLUGIN
            })
            if (commands.length > 0) {
              this.cliConfiguration.modules.mods[packages[i].package.name] = {
                type: type,
                version: packages[i].package.version,
                dependencies: packages[i].package.pluginDependencies,
                next_version: '',
                is_next: true,
                changelog: packages[i].package.changelog || '',
                local: packages[i].root,
                commands: commands,
              }
              this.plugins.push({
                value: packages[i].root,
                options: {},
                commands: commands,
                name: packages[i].package.name,
              })
            } else {
              this.cliConfiguration.modules.mods[packages[i].package.name] = {
                type: type,
                version: packages[i].package.version,
                dependencies: packages[i].package.pluginDependencies,
                next_version: '',
                is_next: true,
                changelog: packages[i].package.changelog || '',
                local: packages[i].root,
              }
            }
          }
          // update module file
          fs.write(moduleConfigFilePath, {
            mods: this.cliConfiguration.modules.mods,
            last_update_time: new Date().getTime(),
          })
        }
      } else {
        // check if there has some module need to be upgraded
        // check last_update_time
        const info: any = await updateNpmPackageInfo(this.cliConfiguration.modules, this.cliConfiguration.registry)
        if (info) {
          let upgradeList = {}
          for (let mod in info.mods) {
            if (!info.mods[mod].is_next) {
              upgradeList[mod] = info.mods[mod]
            }
          }
          let lists = Object.keys(upgradeList)
          let yes = 'Yes, update all'
          let no = 'No, next time'
          let choices = [yes, no, new inquirer.Separator('Or choose update package')].concat(Object.keys(upgradeList))
          if (lists.length > 0) {
            let res = await inquirer.prompt({
              name: 'choose',
              type: 'list',
              choices: choices,
              default: yes,
              message: 'New update detected, update now?',
            })
            if (yes === res.choose) {
              for (let item in upgradeList) {
                await repairPackage(this.cliConfiguration, item, upgradeList[item].next_version)
                logger.success(
                  `[${logger.checkmark}] Upgrade ${item} ${upgradeList[item].version} -> ${
                  upgradeList[item].next_version
                  } success`,
                )
              }
              logger.success(`All task completed.`)
            } else if (no !== res.choose) {
              await repairPackage(this.cliConfiguration, res.choose, upgradeList[res.choose].next_version)
              logger.success(
                `[${logger.checkmark}] Upgrade ${res.choose} ${upgradeList[res.choose].version} -> ${
                upgradeList[res.updatelist].next_version
                } success`,
              )
            }
          }
          fs.write(moduleConfigFilePath, info)
        }
      }
      if (this.plugins.length > 0) {
        this.plugins.forEach(p => {
          this.cli = this.cli.plugin(p.value, p.options)
        })
      }
    }
    // run the cli
    const toolbox = await this.cli.create().run(this.rawArgv, { __config: this.cliConfiguration })
    // send it back (for testing, mostly)
    return toolbox
  }
}

/**
 * Repair npm package
 *
 * @param name npm package name
 * @param version npm package version
 */
export async function repairPackage(config: CliConfiguration, name: string, version: string) {
  let commands = []
  let type = ModType.EXTENSION
  const moduleConfigFilePath = path.join(config.moduleRoot, config.moduleConfigFileName)
  const packages: any = await installPackage(config, name, version, {
    root: config.moduleRoot,
    registry: config.registry,
  })
  for (let i = 0; i < packages.length; i++) {
    let commandBasePath = path.join(packages[i].root, 'commands')
    let commandFiles: string[] = fs.list(commandBasePath) || []
    commandFiles.forEach(file => {
      let content
      try {
        content = require(path.join(commandBasePath, file))
      } catch (e) {
        debug(`Check module error with: ${e.stack}`)
        // try prev version
      }
      commands.push({
        name: content.name || '',
        alias: content.alias || '',
        showed: typeof content.dashed === 'boolean' ? !content.dashed : true,
        description: content.description || '',
      })
      type = ModType.PLUGIN
    })
    if (commands.length > 0) {
      config.modules.mods[packages[i].package.name] = {
        type: type,
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
      config.modules.mods[packages[i].package.name] = {
        type: type,
        version: packages[i].package.version,
        dependencies: packages[i].package.pluginDependencies,
        next_version: '',
        is_next: true,
        changelog: packages[i].package.changelog || '',
        local: packages[i].root,
      }
    }
  }
  debug(`save modjson: ${JSON.stringify(config.modules.mods)}`)
  // update module file
  fs.write(moduleConfigFilePath, {
    mods: config.modules.mods,
    last_update_time: new Date().getTime(),
  })
}

/**
 * Install packages
 *
 * @param name package name
 * @param version package version
 * @param options install options
 * @param result data from reduce
 */
export async function installPackage(config: CliConfiguration, name: string, version: string, options: any, result: any = []) {
  const info: any = await install(name, version || 'latest', options)
  let res = result.concat(info)
  if (info.package.pluginDependencies) {
    for (let name in info.package.pluginDependencies) {
      let sub = await installPackage(config, name, info.package.pluginDependencies[name], options, res)
      res = res.concat(sub)
    }
  }
  return res
}

/**
 * Suggest if there has a official module for the command.
 *
 * @param command command name
 * @param registry npm registry
 */
export async function suggestPackage(command: string, registry: string) {
  const npmApi = http.create({
    baseURL: `${registry}/@weex-cli/`,
  })
  const res = await npmApi.get(`${command}`)
  return res.data
}

/**
 * Checking if there has the package on the specified registry with specified version
 *
 * @param name package name
 * @param version package version
 * @param registry npm registry
 */
export async function checkNpmPackageExist(name: string, version: string, registry: string) {
  const npmApi = http.create({
    baseURL: `${registry}`,
  })
  const res: any = await npmApi.get(`${name}`)
  if (res.data.error) {
    if (/not_found/.test(res.data.error)) {
      res.data.error = ErrorType.PACKAGE_NOT_FOUND
    }
  } else if (version && version !== 'latest') {
    if (!res.data.versions[version]) {
      res.data.error = ErrorType.PACKAGE_VERSION_NOT_FOUND
      res.data.versions = Object.keys(res.data.versions)
    }
  }
  return res.data
}

/**
 * Check if there has some modules need to be upgraded.
 *
 * @param modules module item
 * @param registry npm registry
 * @param time update checking times, day
 */
export async function updateNpmPackageInfo(modules: ModData, registry: string, time: number = 1) {
  const modData = Object.assign({}, modules)
  const date = new Date()
  if (date.getTime() - modData.last_update_time <= 24 * 3600 * 1000 * time) {
    return false
  }
  logger.info(`Time: ${formateTime(date)}, verify if there is an update`)
  const spinner = logger.spin('Checking ... please wait')
  for (let mod in modData.mods) {
    spinner.text = `Checking ${mod} ...`
    let res = await getNpmPackageLatestVersion(mod, registry)
    if (!res.error) {
      spinner.succeed(`Finished checking [${mod}]`)
      if (semver.gt(res.latest, modData.mods[mod].version)) {
        modData.mods[mod].is_next = false
        modData.mods[mod].next_version = res.latest
      } else {
        modData.mods[mod].is_next = true
        modData.mods[mod].next_version = res.latest
      }
    } else {
      if (res.error === ErrorType.PACKAGE_NOT_FOUND) {
        spinner.fail(`Package [${mod}] not found on registry ${registry}`)
      } else {
        spinner.fail(`Unkonw error with checking [${mod}], ${res.error}`)
      }
    }
  }
  modData.last_update_time = date.getTime()
  return modData
}

/**
 * Get the latest version of a package.
 *
 * @param name package name
 * @param registry npm registry
 * @returns {error?:string, latest?:string}
 */
export async function getNpmPackageLatestVersion(name: string, registry: string) {
  const npmApi = http.create({
    baseURL: `${registry}`,
  })
  const res: any = await npmApi.get(`${name}`)
  let error
  if (res.data.error) {
    if (/not_found/.test(res.data.error)) {
      error = ErrorType.PACKAGE_NOT_FOUND
    }
  } else if (res.data['dist-tags']['latest']) {
    const latest = res.data['dist-tags']['latest']
    return {
      latest: latest,
    }
  } else {
    error = `can't found ${name} latest version`
  }
  return {
    error: error,
  }
}

/**
 * Analyzer error stack and give some solution.
 *
 * @param type command type
 * @param stack error stack
 * @param options data from error stack
 */
export async function analyzer(type: string, stack: string | number, options?: any) {
  if (type === 'repair') {
    if (ErrorType.PACKAGE_NOT_FOUND === stack) {
      const innerMods = ['@weex-cli/debug', '@weex-cli/generator', '@weex-cli/build', '@weex-cli/preview']
      let score
      let tempScore
      let suggestName
      innerMods.forEach(mod => {
        tempScore = strings.strSimilarity2Number(mod, options.name)
        if (!score) {
          score = tempScore
          suggestName = mod
        } else if (tempScore < score) {
          score = tempScore
          suggestName = mod
        }
      })
      logger.warn(`Module "${options.name}" not found, do you mean "${suggestName}"?`)
    } else if (ErrorType.PACKAGE_VERSION_NOT_FOUND === stack) {
      logger.warn(`Module "${options.name}@${options.version}" not found`)
      if (Array.isArray(options.versions) && options.versions.length > 0) {
        logger.info('Chose one of the versions:')
        options.versions.forEach(version => {
          logger.info(`- ${version}`)
        })
      }
    } else {
      const logPath = path.join(process.cwd(), '.weex-error.log')
      fs.write(logPath, stack)
      logger.warn(`Unkown issue, see error stack on logPath.`)
      logger.warn(`To fix this, you can create a issue on https://github.com/weexteam/weex-toolkit/issues.`)
    }
  } else {
    const logPath = path.join(process.cwd(), '.weex-error.log')
    fs.write(logPath, stack)
    logger.warn(`Unkown issue, see error stack on logPath.`)
    logger.warn(`To fix this, you can create a issue on https://github.com/weexteam/weex-toolkit/issues.`)
  }
}

export function formateTime(date: Date) {
  let hourse = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  let min = date.getHours() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  let seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  return `${hourse}:${min}:${seconds}`
}

/**
 * Pick plugin items for cli toolbox.
 *
 * @param modules data from module.json
 */
export function pickPlugins(modules: ModData): PluginItem[] {
  if (!modules) return []
  let plugins = []
  for (let item in modules.mods) {
    let mod: ModItem = modules.mods[item]
    plugins.push({
      value: mod.local,
      options: {},
      commands: mod.commands,
      name: item,
    })
  }
  return plugins
}

/**
 * Map command to a package module.
 *
 * @param command
 * @param mods
 */
export function searchPlugin(command: string, mods: PluginItem[]): PluginItem {
  if (mods.length > 0) {
    let result
    mods.forEach((mod: PluginItem) => {
      if (mod.commands && Array.isArray(mod.commands)) {
        mod.commands.forEach(cmd => {
          if (cmd.name === command || cmd.alias === command) {
            result = mod
          }
        })
      }
    })
    return result
  } else {
    return {}
  }
}
