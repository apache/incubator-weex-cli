import { build, fs, IParameters, http, install, logger, strings } from '../index'
import { parseParams } from '../toolbox/parameter-tools'
import * as path from 'path'

const debug = require('debug')('weex:core')

enum ModType {
  PLUGIN,
  EXTENSION,
}

export interface ModData {
  mods: {
    [key: string]: ModItem
  }
  last_update_time: number | string
}

export interface ModItem {
  type: ModType
  version: string
  next_version?: string
  is_next?: boolean
  changelog?: string
  local: string
  commands: string[]
}
export interface PluginItem {
  value: string
  options: any
  commands: {
    name: string
    alias: string
    description: string
    showed: boolean
  }[]
  name: string
}

export interface CliOptions {
  corePath: string
  coreName: string
  moduleRoot: string
  moduleName: string
  home: string
  registry: string
  argv: string
  trash: string
  modules: ModData
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

export class Cli {
  private cli: any
  private rawArgv: string[] | string
  private argv: IParameters
  private plugins: PluginItem[] = []
  private cliOptions: CliOptions
  constructor(data: CliOptions, options: CoreOptions = {}) {
    this.rawArgv = data.argv

    this.argv = parseParams(data.argv)

    this.cliOptions = data
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
    if (this.cliOptions.modules) {
      this.plugins = this.pickPlugins(this.cliOptions.modules)
    } else {
      fs.write(path.join(this.cliOptions.moduleRoot, this.cliOptions.moduleName), { mods: {}, last_update_time: new Date().getTime() })
    }
    if (command === 'repair') {
      debug(`Do repair`);
      const repairModule = this.argv.array[1];
      let repairName;
      let repairVersion;
      if (repairModule) {
        const args = repairModule.split('@')
        if (repairModule.slice(0,1) === '@') {
          
        }
        else {

        }
        try {
          await this.repairPackage(repairModule);
          debug(`repair ${repairModule} successed!`);
          logger.success(`\nRepair ${repairModule} successed!`)
        }
        catch(e) {
          this.analyzer('repair', e.stack, {module: repairModule})
        }
      }
      else {
        logger.error('Need to specify the repaired module')
      }
      return ;
    }
    else if (command) {
      const plugin = this.searchPlugin(command, this.plugins)
      let commands = []
      let type = ModType.EXTENSION
      if (!plugin) {
        const res: { error?: string; [key: string]: any } = await this.suggestPackage(command, this.cliOptions.registry)
        if (!res.error) {
          const packages: any = await this.installPackage(`@weex-cli/${command}`, 'latest', {
            root: this.cliOptions.moduleRoot,
            registry: this.cliOptions.registry,
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
              this.cliOptions.modules.mods[packages[i].package.name] = {
                type: type,
                version: packages[i].package.version,
                next_version: '',
                is_next: true,
                changelog: packages[i].changelog || '',
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
          }
          // update module file
          fs.write(path.join(this.cliOptions.moduleRoot, this.cliOptions.moduleName), { mods: this.cliOptions.modules.mods, last_update_time: new Date().getTime() })
        }
      }
      if (this.plugins.length > 0) {
        this.plugins.forEach(p => {
          this.cli = this.cli.plugin(p.value, p.options)
        })
      }
    }

    // run the cli
    const toolbox = await this.cli.create().run(this.rawArgv)
    // send it back (for testing, mostly)
    return toolbox
  }

  async repairPackage(mod: string) {
    let modVersion;
    let modName;
    let commands = [];
    let type = ModType.EXTENSION;
    const first = mod.slice(0,1);
    // check for origin npm package
    if (first === '@') {
      const arg = mod.split('@');
      if (arg.length > 2) {
        modVersion = arg.pop();
        modName = arg.join('@');
      }
      else {
        modName = arg.join('@');
        modVersion = 'latest';
      }
    }
    else {
      const arg = mod.split('@');
      if (arg.length > 1) {
        modVersion = arg.pop();
        modName = arg.join('@');
      }
      else {
        modName = arg[0];
        modVersion = 'latest';
      }
    }
    const packages: any = await this.installPackage(modName, modVersion, {
      root: this.cliOptions.moduleRoot,
      registry: this.cliOptions.registry,
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
        this.cliOptions.modules.mods[packages[i].package.name] = {
          type: type,
          version: packages[i].package.version,
          next_version: '',
          is_next: true,
          changelog: packages[i].changelog || '',
          local: packages[i].root,
          commands: commands,
        }
      }
    }
    debug(`save modjson: ${JSON.stringify(this.cliOptions.modules.mods)}`)
    // update module file
    fs.write(path.join(this.cliOptions.moduleRoot, this.cliOptions.moduleName), { mods: this.cliOptions.modules.mods, last_update_time: new Date().getTime() })
  }

  async installPackage(name: string, version: string, options: any, result:any = []) {
    const info: any = await install(name, version || 'latest', options)
    if (Array.isArray(info.package.extensionDependencies)) {
      let len = info.package.extensionDependencies.length
      for (let i = 0; i < len; i++) {
        let sub = await this.installPackage(info.package.extensionDependencies[i], '', options, [info])
        return [info].concat(sub)
      }
    }
    return [info]
  }

  async suggestPackage(command: string, registry: string) {
    const npmApi = http.create({
      baseURL: `${registry}/@weex-cli/`,
    })
    const res = await npmApi.get(`${command}`)
    return res.data
  }

  async analyzer(type: string, stack: string, options?: any) {
    if (type === 'repair') {
      if (/404 status/.test(stack)) {
        const innerMods = [
          '@weex-cli/debug',
          '@weex-cli/generator',
          '@weex-cli/build',
          '@weex-cli/preview'
        ]
        let score;
        let tempScore;
        let suggestName;
        innerMods.forEach(mod => {
          tempScore = strings.strSimilarity2Number(mod, options.module);
          if (!score) {
            score = tempScore;
            suggestName = mod;
          }
          else if (tempScore < score) {
            score = tempScore;
            suggestName = mod;
          }
        })
        logger.warn(`Module "${options.module}" not found, do you mean "${suggestName}"?`)
      }
    }
    else {
      const logPath = path.join(process.cwd(), '.weex-error.log')
      fs.write(logPath, stack);
      logger.warn(`Unkown issue, see error stack on logPath.`)
      logger.warn(`To fix this, you can create a issue on https://github.com/weexteam/weex-toolkit/issues.`)
    }
  }

  pickPlugins(modules: ModData): PluginItem[] {
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

  searchPlugin(command: string, mods: PluginItem[]): PluginItem | boolean {
    if (mods.length > 0) {
      let result
      mods.forEach((mod: PluginItem) => {
        mod.commands.forEach(cmd => {
          if (cmd.name === command || cmd.alias === command) {
            result = mod
          }
        })
      })
      return result;
    } else {
      return false
    }
    
  }
}

module.exports = Cli
