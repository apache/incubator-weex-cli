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

import { head, split } from 'ramda'
import { Extension } from '../core/extension'
import { fs } from '../toolbox/fs-tools'
import { strings } from '../toolbox/string-tools'
import { loadModule } from './module-loader'

/**
 * Loads the extension from a file.
 *
 * @param file The full path to the file to load.
 * @param options Options, such as
 */
export function loadExtensionFromFile(file: string, options = {}): Extension {
  const extension = new Extension()
  // sanity check the input
  if (strings.isBlank(file)) {
    throw new Error(`Error: couldn't load extension (file is blank): ${file}`)
  }

  extension.file = file

  // not a file?
  if (fs.isNotFile(file)) {
    throw new Error(`Error: couldn't load command (not a file): ${file}`)
  }

  // default is the name of the file without the extension
  extension.name = head(split('.', (fs.inspect(file) as any).name))

  // require in the module -- best chance to bomb is here
  let extensionModule = loadModule(file)

  // if they use `export default` rather than `module.exports =`, we extract that
  extensionModule = extensionModule.default || extensionModule

  // should we try the default export?
  const valid = extensionModule && typeof extensionModule === 'function'

  if (valid) {
    extension.setup = extensionModule
  } else {
    throw new Error(`Error: couldn't load ${extension.name}. Expected a function, got ${extensionModule}.`)
  }

  return extension
}
