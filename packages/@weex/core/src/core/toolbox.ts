// The MIT License (MIT)

//   Copyright (c) 2016-3016 Infinite Red, Inc.

//   Permission is hereby granted, free of charge, to any person obtaining a copy
//   of this software and associated documentation files (the "Software"), to deal
//   in the Software without restriction, including without limitation the rights
//   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//   copies of the Software, and to permit persons to whom the Software is
//   furnished to do so, subject to the following conditions:

//   The above copyright notice and this permission notice shall be included in all
//   copies or substantial portions of the Software.

//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//   SOFTWARE.

import { Runtime } from '../runtime/runtime'
import { Command } from './command'
import { Options } from './options'
import { Plugin } from './plugin'
import { IFilesystem, IStrings, ILOGGER, ISystem, ISemver, IHttp, IPatching, IInquirer, IMeta, IParameters } from '..'
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
  fs?: IFilesystem
  http?: IHttp
  meta?: IMeta
  patching?: IPatching
  logger?: ILOGGER
  inquirer?: IInquirer
  semver?: ISemver
  strings?: IStrings
  system?: ISystem
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
