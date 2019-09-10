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

import { test, is } from 'ramda'
import { fs } from './fs-tools'
import { IPatchingPatchOptions, IPatching } from './patching-types'

/**
 * Identifies if something exists in a file. Async.
 *
 * @param filename The path to the file we'll be scanning.
 * @param findPattern The case sensitive string or RegExp that identifies existence.
 * @return Boolean of success that findPattern was in file.
 */
export async function exists(filename: string, findPattern: string | RegExp): Promise<boolean> {
  // sanity check the filename
  if (!is(String, filename) || fs.isNotFile(filename)) {
    return false
  }

  // sanity check the findPattern
  const patternIsString = typeof findPattern === 'string'
  if (!(findPattern instanceof RegExp) && !patternIsString) {
    return false
  }

  // read from jetpack -- they guard against a lot of the edge
  // cases and return nil if problematic
  const contents = fs.read(filename)

  // only let the strings pass
  if (!is(String, contents)) {
    return false
  }

  // do the appropriate check
  return patternIsString ? contents.includes(findPattern) : test(findPattern as RegExp, contents)
}

/**
 * Updates a text file or json config file. Async.
 *
 * @param filename File to be modified.
 * @param callback Callback function for modifying the contents of the file.
 */
export async function update(
  filename: string,
  callback: (contents: string | object) => string | object | false,
): Promise<string | object | false> {
  const contents = await readFile(filename)

  // let the caller mutate the contents in memory
  const mutatedContents = callback(contents)

  // only write if they actually sent back something to write
  if (mutatedContents !== false) {
    await fs.writeAsync(filename, mutatedContents, { atomic: true })
  }

  return mutatedContents
}

/**
 * Convenience function for prepending a string to a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param prependedData  String to prepend
 */
export async function prepend(filename: string, prependedData: string): Promise<string | false> {
  return update(filename, data => prependedData + data) as Promise<string | false>
}

/**
 * Convenience function for appending a string to a given file. Async.
 *
 * @param filename       File to be appended to
 * @param appendedData  String to append
 */
export async function append(filename: string, appendedData: string): Promise<string | false> {
  return update(filename, data => data + appendedData) as Promise<string | false>
}

/**
 * Convenience function for replacing a string in a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param oldContent     String to replace
 * @param newContent     String to write
 */
export async function replace(filename: string, oldContent: string, newContent: string): Promise<string | false> {
  return update(filename, data => (data as string).replace(oldContent, newContent)) as Promise<string | false>
}

/**
 * Conditionally places a string into a file before or after another string,
 * or replacing another string, or deletes a string. Async.
 *
 * @param filename        File to be patched
 * @param opts            Options
 * @param opts.insert     String to be inserted
 * @param opts.before     Insert before this string
 * @param opts.after      Insert after this string
 * @param opts.replace    Replace this string
 * @param opts.delete     Delete this string
 * @param opts.force      Write even if it already exists
 *
 * @example
 *   await toolbox.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
 *
 */
export async function patch(filename: string, opts: IPatchingPatchOptions = {}): Promise<string | false> {
  return update(filename, data => patchString(data as string, opts)) as Promise<string | false>
}

export async function readFile(filename: string): Promise<string> {
  // bomb if the file doesn't exist
  if (!fs.isFile(filename)) {
    throw new Error(`file not found ${filename}`)
  }

  // check type of file (JSON or not)
  const fileType = filename.endsWith('.json') ? 'json' : 'utf8'

  // read the file
  return fs.readAsync(filename, fileType)
}

export function patchString(data: string, opts: IPatchingPatchOptions = {}): string | false {
  // Already includes string, and not forcing it
  if (data.includes(opts.insert) && !opts.force) {
    return false
  }

  // delete <string> is the same as replace <string> + insert ''
  const replaceString = opts.delete || opts.replace

  if (replaceString) {
    if (!data.includes(replaceString)) {
      return false
    }
    // Replace matching string with new string or nothing if nothing provided
    return data.replace(replaceString, `${opts.insert || ''}`)
  } else {
    return insertNextToString(data, opts)
  }
}

function insertNextToString(data: string, opts: IPatchingPatchOptions) {
  // Insert before/after a particular string
  const findString = opts.before || opts.after
  if (!data.includes(findString)) {
    return false
  }

  const newContents = opts.after ? `${findString}${opts.insert || ''}` : `${opts.insert || ''}${findString}`
  return data.replace(findString, newContents)
}

const patching: IPatching = { update, append, prepend, replace, patch, exists }

export { patching, IPatching, IPatchingPatchOptions }
