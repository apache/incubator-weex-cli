import { build, IToolbox, fs, IParameters, http, IHttp, install, InstallerOption } from '../index'
import { parseParams } from '../toolbox/parameter-tools'
import * as path from 'path'
import { Toolbox } from '../core/toolbox';

const debug = require('debug')('weex:core');

// export class Cli {
//   private cli: any;
//   constructor(options: {
//     brand?: string
//     help?: any
//     defaultCommand?: any
//     version?: any
//     plugin?: {
//       value?: string
//       options?: any
//     }
//     plugins?: {
//       value?: string
//       options?: any
//     }
//     exclude?: string[]
//   } = {}) {
//     // create a CLI runtime
//     this.cli = build(options.brand || 'weex')
//               .src(__dirname)
//               .help(options.help)
//               .version(options.version)
//               .exclude(options.exclude)
//               .defaultCommand(options.defaultCommand);

//     if (options.plugins && options.plugins.value) {
//       this.cli = this.cli.plugins(options.plugins.value, options.plugins.options)
//     }

//     if (options.plugin) {
//       if (Array.isArray(options.plugin)) {
//         options.plugin.forEach(p => {
//           this.cli = this.cli.plugin(p.value, p.options)
//         })
//       }
//       else {
//         this.cli = this.cli.plugin(options.plugin.value, options.plugin.options)
//       }
//     }
//   }

//   async start(argv?: string[] | string) {
//     const params = parseParams(argv);
//     // run the cli
//     const toolbox = await this.cli.run(argv)
//     // send it back (for testing, mostly)
//     return toolbox
//   }
// }
enum ModType {
  PLUGIN,
  EXTENSION
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
  } []
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
  private cli: any;
  private rawArgv: string[] | string
  private argv: IParameters;
  private command: string;
  private plugins: PluginItem[] = []
  private cliOptions: CliOptions
  constructor(data: CliOptions, options: CoreOptions = {}) {
    
    this.rawArgv = data.argv;
    
    this.argv = parseParams(data.argv);

    this.cliOptions = data
    // create a CLI runtime
    this.cli = build(options.brand || 'weex')
              .src(__dirname)
              .help(options.help)
              .version(options.version)
              .exclude(options.exclude)
              .defaultCommand(options.defaultCommand);

    if (options.plugins && options.plugins.value) {
      this.cli = this.cli.plugins(options.plugins.value, options.plugins.options)
    }

    if (options.plugin) {
      if (Array.isArray(options.plugin)) {
        options.plugin.forEach(p => {
          this.cli = this.cli.plugin(p.value, p.options)
        })
      }
      else {
        this.cli = this.cli.plugin(options.plugin.value, options.plugin.options)
      }
    }

  }
  
  async start(){
    // run the cli
    // const toolbox = await this.cli.run(this.rawArgv)
    // // send it back (for testing, mostly)
    // return toolbox
    const command = this.argv.array[0];
    let mod: ModItem

    if (this.cliOptions.modules) {
      this.plugins = this.pickPlugins(this.cliOptions.modules)
    } 
    else {
      fs.file(path.join(this.cliOptions.moduleRoot, this.cliOptions.moduleName), {
        mode: '777',
        jsonIndent: 2,
        content: JSON.stringify({mods: {}, last_update_time: (new Date()).getTime()})
      });
    }
    
    if (command) {
      const plugin = this.searchPlugin(command, this.plugins);
      let commands = [];
      let type = ModType.EXTENSION;
      if (!plugin) {
        const res: {error?:string, [key: string]: any} = await this.suggestPackage(command, this.cliOptions.registry)
        if (!res.error) {
          const packages:any = await this.installPackage(`@weex-cli/${command}`, 'latest', {
            root: this.cliOptions.moduleRoot,
            trash: this.cliOptions.trash,
            registry: this.cliOptions.registry
          })
          for (let i = 0; i < packages.length; i++) {
            const commandBasePath = path.join(packages[i].root, 'commands');
            const commandFiles: string[] = await fs.list(commandBasePath) || [];
            commandFiles.forEach(file => {
            let content
              try {
                content = require(path.join(commandBasePath, file))
              }
              catch(e) {
                debug(`Check module error with: ${e.stack}`)
                // try prev version
              }
              commands.push({
                name: content.name || '',
                alias: content.alias || '',
                showed: typeof content.dashed === 'boolean'? !content.dashed : true,
                description: content.description || ''
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
                commands: commands
              }
              this.plugins.push({
                value: packages[i].root,
                options: {},
                commands: commands,
                name: packages[i].package.name
              })
            }
          }
          // update module file
          fs.file(path.join(this.cliOptions.moduleRoot, this.cliOptions.moduleName), {
            mode: '777',
            jsonIndent: 2,
            content: JSON.stringify({mods: this.cliOptions.modules.mods, last_update_time: (new Date()).getTime()})
          });
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

  async installPackage(name, version, options, result = []) {
    const info:any = await install(name, version || 'latest', options)
    if (Array.isArray(info.package.extensionDependencies)) {
      let len = info.package.extensionDependencies.length
      for (let i = 0; i < len; i++) {
        let sub = await this.installPackage(info.package.extensionDependencies[i], '', options, [info]);
        return [info].concat(sub);
      }
    }
    return [info];
  }

  async suggestPackage(command, registry) {
    const npmApi = http.create({
      baseURL: `${registry}/@weex-cli/`
    })
    const res = await npmApi.get(`${command}`);
    return res.data;
  } 
  
  pickPlugins (modules: ModData): PluginItem[]{
    if (!modules) return ;
    let plugins = []
    for (let item in modules.mods) {
      let mod:ModItem = modules.mods[item]
      plugins.push({
        value: mod.local,
        options: {},
        commands: mod.commands,
        name: item
      })
    }
    return plugins;
  }

  searchPlugin (command: string, mods: PluginItem[]): PluginItem | boolean {
    mods.forEach((mod: PluginItem) => {
      mod.commands.forEach(cmd => {
        if (cmd.name === command || cmd.alias === command) {
          return mod;
        }
      });
    })
    return false;
  }
}

module.exports = Cli;