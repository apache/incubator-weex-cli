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

import { equals } from 'ramda'

import { Command } from '../core/command'
import { Runtime } from './runtime'
import { IParameters } from '../core/toolbox'

/**
 * This function performs some somewhat complex logic to find a command for a given
 * set of parameters and plugins.
 *
 * @param runtime The current runtime.
 * @param parameters The parameters passed in
 * @returns object with plugin, command, and array
 */
export function findCommand(runtime: Runtime, parameters: IParameters) {
  // the commandPath, which could be something like:
  // > movie list actors 2015
  // [ 'list', 'actors', '2015' ]
  // here, the '2015' might not actually be a command, but it's part of it
  const commandPath = parameters.array

  // the part of the commandPath that doesn't match a command
  // in the above example, it will end up being [ '2015' ]
  let tempPathRest = commandPath
  let commandPathRest = tempPathRest

  // the resolved command will live here
  // start by setting it to the default command, in case we don't find one
  let targetCommand: Command = runtime.defaultCommand

  // if the commandPath is empty, it could be a dashed command, like --help
  if (commandPath.length === 0) {
    targetCommand = findDashedCommand(runtime.commands, parameters.options) || targetCommand
  }
  // store the resolved path as we go
  let resolvedPath: string[] = []

  // we loop through each segment of the commandPath, looking for aliases among
  // parent commands, and expand those.
  commandPath.forEach((currName: string) => {
    // cut another piece off the front of the commandPath
    tempPathRest = tempPathRest.slice(1)

    // find a command that fits the previous path + currentName, which can be an alias
    let segmentCommand = runtime.commands
      .slice() // dup so we keep the original order
      .sort(sortCommands)
      .find(command => equals(command.commandPath.slice(0, -1), resolvedPath) && command.matchesAlias(currName))

    if (segmentCommand) {
      // found another candidate as the "endpoint" command
      targetCommand = segmentCommand

      // since we found a command, the "commandPathRest" gets updated to the tempPathRest
      commandPathRest = tempPathRest

      // add the current command to the resolvedPath
      resolvedPath = resolvedPath.concat([segmentCommand.name])
    } else {
      // no command found, let's add the segment as-is to the command path
      resolvedPath = resolvedPath.concat([currName])
    }
  }, [])

  return { command: targetCommand, array: commandPathRest }
}

// sorts shortest to longest commandPaths, so we always check the shortest ones first
function sortCommands(a, b) {
  return a.commandPath.length < b.commandPath.length ? -1 : 1
}

// finds dashed commands
function findDashedCommand(commands, options) {
  const dashedOptions = Object.keys(options).filter(k => options[k] === true)
  return commands.filter(c => c.dashed).find(c => c.matchesAlias(dashedOptions))
}
