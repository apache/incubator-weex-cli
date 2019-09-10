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

import { head, is, isNil, last, reject, split, takeLast } from 'ramda'
import { Command, ICommandLine } from '../core/command'
import { fs } from '../toolbox/fs-tools'
import { strings } from '../toolbox/string-tools'
import { loadModule } from './module-loader'
import { Options } from '../core/options'

/**
 * Loads the command from the given file.
 *
 * @param file      The full path to the file to load.
 * @return The loaded command.
 */
export function loadCommandFromFile(file: string, options: Options = {}): Command {
  const command = new Command()

  // sanity check the input
  if (strings.isBlank(file)) {
    throw new Error(`Error: couldn't load command (file is blank): ${file}`)
  }

  // not a file?
  if (fs.isNotFile(file)) {
    throw new Error(`Error: couldn't load command (this isn't a file): ${file}`)
  }

  // remember the file
  command.file = file
  // default name is the name without the file extension
  command.name = head(split('.', (fs.inspect(file) as any).name))
  // strip the extension from the end of the commandPath
  command.commandPath = (options.commandPath || last(file.split('/commands/')).split('/')).map(f =>
    [`${command.name}.js`, `${command.name}.ts`].includes(f) ? command.name : f,
  )

  // if the last two elements of the commandPath are the same, remove the last one
  const lastElems = takeLast(2, command.commandPath)
  if (lastElems.length === 2 && lastElems[0] === lastElems[1]) {
    command.commandPath = command.commandPath.slice(0, -1)
  }

  // require in the module -- best chance to bomb is here
  let commandModule = loadModule(file)

  // if they use `export default` rather than `module.exports =`, we extract that
  commandModule = commandModule.default || commandModule

  // is it a valid commandModule?
  const valid = commandModule && typeof commandModule === 'object' && typeof commandModule.run === 'function'

  if (valid) {
    command.name = commandModule.name || last(command.commandPath)
    command.description = commandModule.description
    command.hidden = Boolean(commandModule.hidden)
    command.alias = reject(isNil, is(Array, commandModule.alias) ? commandModule.alias : [commandModule.alias])
    command.run = commandModule.run
  } else {
    throw new Error(`Error: Couldn't load command ${command.name} -- needs a "run" property with a function.`)
  }

  return command
}

export function loadCommandFromPreload(preload: ICommandLine): Command {
  const command = new Command()
  command.name = preload.name
  command.description = preload.description
  command.hidden = Boolean(preload.hidden)
  command.alias = preload.alias
  command.run = preload.run
  command.file = null
  command.dashed = Boolean(preload.dashed)
  command.commandPath = preload.commandPath || [preload.name]
  return command
}
