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

import * as jetpack from 'fs-jetpack'
import { equals, map, pipe, propEq, reject, replace } from 'ramda'
import { IToolbox } from '../core/toolbox'
import * as path from 'path'
import { logger } from './logger-tools'
import { MetaOptions } from './meta-types'
/**
 * Finds the version for the currently running CLI.
 *
 * @param toolbox Currently running toolbox.
 * @returns Version as a string.
 */
export function getVersion(toolbox: IToolbox): string {
  let directory = toolbox.runtime.defaultPlugin && toolbox.runtime.defaultPlugin.directory
  if (!directory) {
    throw new Error('getVersion: Unknown CLI version (no src folder found)')
  }

  // go at most 5 directories up to find the package.json
  for (let i = 0; i < 5; i += 1) {
    const pkg = jetpack.path(directory, 'package.json')

    // if we find a package.json, we're done -- read the version and return it
    if (jetpack.exists(pkg) === 'file') {
      return jetpack.read(pkg, 'json').version
    }

    // if we reach the git repo or root, we can't determine the version -- this is where we bail
    const git = jetpack.path(directory, '.git')
    const root = jetpack.path('/')
    if (directory === root || jetpack.exists(git) === 'dir') {
      break
    }

    // go up another directory
    directory = jetpack.path(directory, '..')
  }
  throw new Error(`getVersion: Unknown CLI version (no package.json found in ${directory}`)
}

/**
 * Is this a hidden command?
 */
const isHidden = propEq('hidden', true)

/**
 * Gets the list of plugins.
 *
 * @param toolbox The toolbox
 * @param plugins The plugins holding the commands
 * @param commandRoot Optional, only show commands with this root
 * @return List of plugins.
 */
export function commandInfo(toolbox: IToolbox, commandRoot?: string[]): string[][] {
  return pipe(
    reject(isHidden),
    reject(command => {
      if (!commandRoot) {
        return false
      }
      return !equals(command.commandPath.slice(0, commandRoot.length), commandRoot)
    }),
    map(command => {
      const alias = command.hasAlias() ? `(${command.aliases.join(', ')})` : ''
      return [
        `${command.commandPath.join(' ')} ${alias}`,
        replace('$BRAND', toolbox.runtime.brand, command.description || '-'),
      ]
    }),
  )(toolbox.runtime.commands)
}

export function getModulesInfo(toolbox: IToolbox): any {
  const config = toolbox.parameters.options.__config
  let info = {}
  if (config) {
    const moduleConfigFilePath = path.join(config.moduleRoot, config.moduleConfigFileName)
    info = jetpack.read(moduleConfigFilePath, 'json')
  }
  return info
}

/**
 * Generate help info
 *
 * @export
 * @param {MetaOptions} params
 * @param {string} [brand]
 * @returns {*}
 */
export function generateHelp(params: MetaOptions, brand: string = 'weex'): any {
  if (params.appstart) {
    logger.log(params.appstart)
  }
  logger.success('\n# Commands\n')
  if (Array.isArray(params.commands)) {
    let tables = []
    params.commands.forEach(command => {
      if (command.heading) {
        if (Array.isArray(command.heading)) {
          tables.push(command.heading.map(item => logger.colors.green(item)))
        }
      } else {
        tables.push([
          `$ ${brand} ${command.key}${command.alias ? `(${command.alias})` : ''} ${logger.colors.yellow(
            command.type || '',
          )}`,
          `${command.description}${command.default ? ` - ${command.default}` : ``}`,
        ])
      }
    })
    logger.table(tables, {
      format: 'markdown',
    })
  } else {
    let keys = Object.keys(params.commands) || []
    let len = keys.length
    for (let i = 0; i < len; i++) {
      let tables = []
      logger.log(`\n${keys[i]}\n`)
      params.commands[keys[i]].forEach(command => {
        if (command.heading) {
          if (Array.isArray(command.heading)) {
            tables.push(command.heading.map(item => logger.colors.green(item)))
          }
        } else {
          tables.push([
            `$ ${brand} ${command.key}${command.alias ? `(${command.alias})` : ''} ${logger.colors.yellow(
              command.type || '',
            )}`,
            `${command.description}${command.default ? ` - ${command.default}` : ``}`,
          ])
        }
      })
      logger.table(tables, {
        format: 'markdown',
      })
    }
  }
  if (params.commandend) {
    logger.log(`\n${params.commandend}`)
  }
  logger.success('\n# Options')
  if (Array.isArray(params.options)) {
    let tables = []
    params.options.forEach(option => {
      if (option.heading) {
        if (Array.isArray(option.heading)) {
          tables.push(option.heading.map(item => logger.colors.green(item)))
        }
      } else {
        tables.push([
          `${option.key}${option.alias ? `(${option.alias})` : ''} ${logger.colors.yellow(option.type || '')}`,
          `${option.description}${option.default ? ` - ${option.default}` : ``}`,
        ])
      }
    })
    logger.table(tables)
  } else {
    let keys = Object.keys(params.options) || []
    let len = keys.length
    for (let i = 0; i < len; i++) {
      let tables = []
      logger.log(`\n${keys[i]}\n`)
      params.options[keys[i]].forEach(option => {
        if (option.heading) {
          if (Array.isArray(option.heading)) {
            tables.push(option.heading.map(item => logger.colors.green(item)))
          }
        } else {
          tables.push([
            `${option.key}${option.alias ? `(${option.alias})` : ''} ${logger.colors.yellow(option.type || '')}`,
            `${option.description}${option.default ? ` - ${option.default}` : ``}`,
          ])
        }
      })
      logger.table(tables)
    }
  }
  if (params.optionend) {
    logger.log(`\n${params.optionend}`)
  }
  if (params.append) {
    logger.log(`\n${params.append}`)
  }
}
