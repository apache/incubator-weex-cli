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

import { Toolbox } from './toolbox'
import { Plugin } from './plugin'

export interface ICommandLine<TContext extends Toolbox = Toolbox> {
  /** The name of your command */
  name?: string
  /** A tweet-sized summary of your command */
  description?: string
  /** The function for running your command, can be async */
  run: (toolbox: TContext) => void
  /** Should your command be shown in the listings  */
  hidden?: boolean
  /** The command path, an array that describes how to get to this command */
  commandPath?: string[]
  /** Potential other names for this command */
  alias?: string | string[]
  /** Lets you run the command as a dashed command, like `--version` or `-v`. */
  dashed?: boolean
  /** The path to the file name for this command. */
  file?: string
  /** A reference to the plugin that contains this command. */
  plugin?: Plugin
}

/**
 * A command is user-callable function that runs stuff.
 */
export class Command implements ICommandLine<Toolbox> {
  public name
  public description
  public file
  public run
  public hidden
  public commandPath
  public alias
  public dashed
  public plugin
  public defaultCommand

  constructor() {
    this.name = null
    this.description = null
    this.file = null
    this.run = null
    this.hidden = false
    this.commandPath = null
    this.alias = []
    this.dashed = false
    this.plugin = null
  }

  /**
   * Returns normalized list of aliases.
   *
   * @returns list of aliases.
   */
  get aliases(): string[] {
    if (!this.alias) {
      return []
    }
    return Array.isArray(this.alias) ? this.alias : [this.alias]
  }

  /**
   * Checks if the command has any aliases at all.
   *
   * @returns whether the command has any aliases
   */
  public hasAlias(): boolean {
    return this.aliases.length > 0
  }

  /**
   * Checks if a given alias matches with this command's aliases, including name.
   * Can take a list of aliases too and check them all.
   *
   * @param alias
   * @returns whether the alias[es] matches
   */
  public matchesAlias(alias: string | string[]): boolean {
    const aliases = Array.isArray(alias) ? alias : [alias]
    return Boolean(aliases.find(a => this.name === a || this.aliases.includes(a)))
  }
}
