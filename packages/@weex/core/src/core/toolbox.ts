import { Runtime } from '../runtime/runtime'
import { Command } from './command'
import { Options } from './options'
import { Plugin } from './plugin'
import {
  IFilesystem,
  IStrings,
  IPrint,
  ISystem,
  ISemver,
  IHttp,
  IPatching,
  IPrompt,
  ITemplate,
  IMeta,
  IParameters,
} from '..'

export interface IParameters {
  /* The command arguments as an array. */
  array?: string[]
  /**
   * Any optional parameters. Typically coming from command-line
   * arguments like this: `--force -p tsconfig.json`.
   */
  options?: Options
  /* Just the first argument. */
  first?: string
  /* Just the 2nd argument. */
  second?: string
  /* Just the 3rd argument. */
  third?: string
  /* Everything else after the command as a string. */
  string?: string
  /* The raw command with any named parameters. */
  raw?: any
  /* The original argv value. */
  argv?: any
  /* The currently running plugin name. */
  plugin?: string
  /* The currently running command name. */
  command?: string
}

export interface IToolbox {
  // known properties
  result?: any
  config?: Options
  parameters: IParameters
  plugin?: Plugin
  command?: Command
  pluginName?: string
  commandName?: string
  runtime?: Runtime

  // known extensions
  filesystem?: IFilesystem
  http?: IHttp
  meta?: IMeta
  patching?: IPatching
  print?: IPrint
  prompt?: IPrompt
  semver?: ISemver
  strings?: IStrings
  system?: ISystem
  template?: ITemplate
  generate?: any

  // our catch-all! since we can add whatever to this object
  [key: string]: any
}

export class Toolbox implements IToolbox {
  [key: string]: any

  public result = null
  public config: Options = {}
  public parameters: IParameters = {}
  public plugin = null
  public command = null
  public pluginName = null
  public commandName = null
  public runtime = null
}

// Toolbox used to be known as RunContext. This is for backwards compatibility.
export type IRunContext = IToolbox
export type RunContext = Toolbox
