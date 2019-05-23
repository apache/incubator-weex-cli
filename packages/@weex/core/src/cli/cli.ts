import { build, fs, IParameters, http, install, logger, strings, semver, inquirer } from '../index'
import { parseParams } from '../toolbox/parameter-tools'
import { machineIdSync } from 'node-machine-id'
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

export interface Command {
  name?: string
  alias?: string
  dashed?: boolean
  description?: string
}

export interface ModItem {
  type: ModType
  version: string
  description: string
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
  cliVersion: string
  corePath: string
  coreName: string
  coreRoot: string
  moduleRoot: string
  moduleConfigFileName: string
  home: string
  registry: string
  argv: string
  trash: string
  modules: ModData
  globalConfigFileName: string
  force?: boolean
  configs?: {
    [key: string]: any
  }
  ENVS?: any
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
// use for analyzer function
let cliConfiguration: CliConfiguration

export default class Cli {
  private cli: any
  private updateTime: number
  private rawArgv: string[] | string
  private argv: IParameters
  private plugins: PluginItem[] = []
  private cliConfiguration: CliConfiguration
  constructor(data: CliConfiguration, options: CoreOptions = {}) {
    debug('Init Cli instance on <%s>', __filename)
    this.rawArgv = data.argv

    this.updateTime = data.configs.update_time || 7

    this.argv = parseParams(data.argv)

    this.cliConfiguration = cliConfiguration = {
      ...data,
      force: this.argv.options.f || this.argv.options.force,
    }
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
    const pkg = require('../../package.json')

    const traceData = {
      cmd: command || '',
      argv: this.argv.array.join('+'),
      mid: machineIdSync(),
      node: process.version,
      core: pkg.version,
    }
    usertrack('usage', traceData, this.cliConfiguration.configs.telemetry)

    if (this.cliConfiguration.modules) {
      this.plugins = pickPlugins(this.cliConfiguration.modules)
    } else {
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
        let packageSubName = command
        if (command === 'create' || command === 'platform') {
          packageSubName = 'generator'
        }
        const res: { error?: string; [key: string]: any } = await suggestPackage(
          packageSubName,
          this.cliConfiguration.configs.registry,
        )
        if (res && !res.error) {
          const packages: any = await installPackage(this.cliConfiguration, `@weex-cli/${packageSubName}`, 'latest', {
            root: this.cliConfiguration.moduleRoot,
            registry: this.cliConfiguration.configs.registry,
            force: this.cliConfiguration.force,
            ENVS: this.cliConfiguration.configs.ENVS,
          })
          for (let i = 0; i < packages.length; i++) {
            const commandBasePath = path.join(packages[i].root, 'commands')
            const extensionBasePath = path.join(packages[i].root, 'extensions')
            const commandFiles: string[] = fs.list(commandBasePath) || []
            commands = []
            // continue next package while the package has not commands and extensions folder
            if (!fs.existsAsync(commandBasePath) && !fs.existsAsync(extensionBasePath)) {
              continue
            }
            commandFiles.forEach(file => {
              let content: Command = {}
              try {
                content = require(path.join(commandBasePath, file))
              } catch (e) {
                debug(`Check module error with: ${e.stack}`)
                // try prev version
              }
              if (content.name) {
                commands.push({
                  name: content.name || '',
                  alias: content.alias || '',
                  showed: typeof content.dashed === 'boolean' ? !content.dashed : true,
                  description: content.description || '',
                })
                type = ModType.PLUGIN
              } else {
                type = ModType.EXTENSION
              }
            })

            this.cliConfiguration.modules.mods[packages[i].package.name] = {
              type: type,
              version: packages[i].package.version,
              description: packages[i].package.description || '',
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
        const info: any = await updateNpmPackageInfo(
          this.cliConfiguration.modules,
          this.cliConfiguration.configs.registry,
          this.updateTime,
        )
        if (info) {
          let upgradeList = {}
          for (let mod in info.mods) {
            if (!info.mods[mod].is_next) {
              upgradeList[mod] = info.mods[mod]
            }
          }
          const generateChangelog = (changelog: any[] | string): string => {
            if (!changelog) {
              return ''
            }
            if (typeof changelog === 'string') {
              changelog = [changelog]
            }
            changelog = changelog.map(log => `\n    • ${log}`)
            return `\n  changelog:${changelog.join('')}`
          }

          let lists = Object.keys(upgradeList).map(key => {
            return {
              name: `${key} ${logger.colors.grey(
                `${upgradeList[key].version} -> ${upgradeList[key].next_version}${generateChangelog(
                  upgradeList[key].changelog,
                )}`,
              )}`,
              value: key,
            }
          })
          let yes = 'Yes, update all'
          let no = 'No, next time'
          let choices = [yes, no, new inquirer.Separator('Or choose update package')].concat(lists)
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
                  upgradeList[res.choose].next_version
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
    const toolbox = await this.cli.create().run(this.rawArgv, { __config: this.cliConfiguration, __analyzer: analyzer })
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
    registry: config && config.configs && config.configs.registry,
    force: config.force,
    ENVS: config.ENVS,
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
        name: (content && content.name) || '',
        alias: (content && content.alias) || '',
        showed: content && typeof content.dashed === 'boolean' ? !content.dashed : true,
        description: (content && content.description) || '',
      })
      type = ModType.PLUGIN
    })
    if (commands.length > 0) {
      config.modules.mods[packages[i].package.name] = {
        type: type,
        version: packages[i].package.version,
        description: packages[i].package.description || '',
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
        description: packages[i].package.description || '',
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
export async function installPackage(
  config: CliConfiguration,
  name: string,
  version: string,
  options: any,
  result: any = [],
) {
  const info: any = await install(name, version || 'latest', options)
  let res = result.concat(info)
  if (info.package.pluginDependencies) {
    for (let name in info.package.pluginDependencies) {
      res = await installPackage(config, name, info.package.pluginDependencies[name], options, res)
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
export async function suggestPackage(command: string, registry: string = 'https://registry.npm.taobao.org/') {
  const npmApi = http.create({
    baseURL: `${registry}${registry.slice(-1) === '/' ? '' : '/'}-/package/@weex-cli/`,
    timeout: 30000,
    headers: {
      Accept: '*/*',
    },
  })
  const res: any = await npmApi.get(`${command}/dist-tags`)
  if (res.problem) {
    debug('suggest package error:', res.problem)
    await analyzer('request', res.problem, { registry })
  }
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
  if (res && res.data.error) {
    if (/not_found/.test(res.data.error)) {
      res.data.error = ErrorType.PACKAGE_NOT_FOUND
    }
  } else if (version && version !== 'latest') {
    if (res && !res.data.versions[version]) {
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
  for (let mod in modData.mods) {
    let spinner = logger.spin(`Checking ${mod} ... ${logger.colors.grey('this may take a few seconds')}`)
    spinner.text = ``
    let res = await getLatestNpmPackageInfo(mod, registry)
    if (res && !res.error) {
      spinner.stopAndPersist({
        symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
        text: `sync module [${mod}]`,
      })
      if (semver.gt(res.latest, modData.mods[mod].version)) {
        modData.mods[mod].is_next = false
        modData.mods[mod].next_version = res.latest
        modData.mods[mod].changelog = res.package.changelog || ''
      } else {
        modData.mods[mod].is_next = true
        modData.mods[mod].next_version = res.latest
        modData.mods[mod].changelog = res.package.changelog || ''
      }
    } else {
      if (res.error === ErrorType.PACKAGE_NOT_FOUND) {
        spinner.stopAndPersist({
          symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
          text: `Package [${mod}] not found on registry ${registry}`,
        })
      } else {
        spinner.stopAndPersist({
          symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
          text: `Unkonw error with checking [${mod}], ${res.error}`,
        })
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
export async function getLatestNpmPackageInfo(name: string, registry: string = 'https://registry.npm.taobao.org/') {
  const npmApi = http.create({
    baseURL: `${registry}`,
    timeout: 30000,
    headers: {
      Accept: '*/*',
    },
  })
  const res: any = await npmApi.get(`${registry}${registry.slice(-1) === '/' ? '' : '/'}${name}/latest`)
  let error
  if (res && res.data) {
    debug('Get latest npm package info: ', JSON.stringify(res.data))
    if (res.data.error) {
      if (/not_found/.test(res.data.error)) {
        error = ErrorType.PACKAGE_NOT_FOUND
      }
    } else if (res.data['version']) {
      const latest = res.data['version']
      return {
        latest: latest,
        package: res.data,
      }
    }
  } else {
    error = `can't found ${name} latest version`
  }
  return {
    error: error,
  }
}

/**
 * Pick suitable search from stack
 * @param stack error stack
 */
export function pickSearchKey(stack: string) {
  let res = /error:/gi.exec(stack)
  let errorIndex
  if (res) {
    errorIndex = res.index
  } else {
    errorIndex = -6
  }
  if (errorIndex) {
    return stack
      .slice(errorIndex + 6)
      .split('\n')[0]
      .split(' ')
      .join('+')
  } else {
    return stack
      .split('\n')[0]
      .split(' ')
      .join('+')
  }
}

/**
 * Show help message while catch an unknow issue
 * @param stack
 */
export function showUnknowErrorsHelp(stack: string) {
  logger.error(stack)
  logger.log(logger.colors.grey(`Search for existing GitHub issues similar to yours:`))
  let searchKey = pickSearchKey(stack)
  logger.log(`https://github.com/weexteam/weex-toolkit/issues?q=${searchKey}&type=issue`)

  logger.log(logger.colors.grey(`\nIf none exists, create a ticket, with the template displayed above, on:`))
  logger.log(`https://github.com/weexteam/weex-toolkit/issues/new`)

  logger.log(
    logger.colors.grey(
      `\nBe sure to first read the contributing guide for details on how to properly submit a ticket:`,
    ),
  )
  logger.log(`https://github.com/weexteam/weex-toolkit/master/CONTRIBUTING.md`)

  logger.log(logger.colors.grey(`\nDon't forget to anonymize any private data!`))

  logger.log(logger.colors.grey(`\nLooking for related issues on:`))
  logger.log('https://github.com/weexteam/weex-toolkit/issues?q=is%3Aclosed')
}

/**
 * Analyzer error stack and give some solution.
 *
 * @param type command type
 * @param stack error stack
 * @param options data from error stack
 */
export async function analyzer(type: string, stack: any, options?: any) {
  if (type === 'repair') {
    if (ErrorType.PACKAGE_NOT_FOUND === stack) {
      const innerMods = [
        '@weex-cli/debug',
        '@weex-cli/generator',
        '@weex-cli/build',
        '@weex-cli/preview',
        '@weex-cli/run',
        '@weex-cli/doctor',
        '@weex-cli/lint',
        '@weex-cli/device',
      ]
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
    } else if (typeof stack === 'string') {
      if (/module is locked/.test(stack)) {
        logger.log(`The module is locked now, please be patient and wait for other installation processes to complete.`)
        logger.warn(`You can also enforce it by adding \`-f\` or \`--force\` flag.`)
      }
      showUnknowErrorsHelp(stack)
    }
  } else if (type === 'request') {
    if (stack === 'CONNECTION_ERROR') {
      logger.log(`Please check if your network can access ${logger.colors.yellow(options.registry)} normally`)
      logger.log(`Or you can use \`weex config set registry [registry-url]\` command to use other npm registry`)
    } else if (stack === 'TIMEOUT_ERROR') {
      logger.log(`Please check if your network can access ${logger.colors.yellow(options.registry)} normally`)
      logger.info(`Or you can use the \`install\` command to install the plugin.`)
    }
  } else if (type === 'compile') {
    let vueMismatchReg = /Vue packages version mismatch/gi
    if (vueMismatchReg.test(stack)) {
      logger.error(stack)
      logger.warn('\n Try `weex doctor` command to fix this problem.')
    } else {
      showUnknowErrorsHelp(stack)
    }
  } else if (typeof stack === 'string') {
    showUnknowErrorsHelp(stack)
    usertrack('error_track', { type, stack }, cliConfiguration.configs.telemetry)
  }
}

/**
 * usertrack
 * @param stage usertrack usage
 * @param track data
 * @param telemetry can report data or not
 */
export function usertrack(stage: string, track: any, telemetry: boolean) {
  if (!telemetry) {
    return
  }
  // usertrack
  const usertrackapi = http.create({
    baseURL: `http://gm.mmstat.com/`,
  })
  let trackQuery = `weex-cli-2.0.tool_usage.${stage}?`
  for (let key in track) {
    trackQuery += `${key}=${track[key]}&`
  }
  trackQuery += `t=${new Date().getTime()}`
  try {
    /* tslint-disabled */
    usertrackapi.get(trackQuery)
  } catch (error) {
    debug('Http request error', error)
  }
}

/**
 * Formate time to hh:mm:ss
 * @param date
 */
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
