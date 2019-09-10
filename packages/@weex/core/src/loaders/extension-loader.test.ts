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

import * as expect from 'expect'
import { loadExtensionFromFile } from './extension-loader'

test('loading from a missing file', async () => {
  await expect(() => loadExtensionFromFile('foo.js', 'extension')).toThrowError(
    `Error: couldn't load command (not a file): foo.js`,
  )
})

test('deals with wierd input', async () => {
  await expect(() => loadExtensionFromFile('')).toThrowError(`Error: couldn't load extension (file is blank): `)
})

test('open a wierd js file', async () => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  await expect(() => loadExtensionFromFile(file, 'extension')).toThrowError(`hello is not defined`)
})

test('default but none exported', async () => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  await expect(() => loadExtensionFromFile(file, 'extension')).toThrowError(
    `Error: couldn't load module-exports-object. Expected a function, got [object Object].`,
  )
})

test('has front matter', async () => {
  const file = `${__dirname}/../fixtures/good-plugins/front-matter/extensions/hello.js`
  const extension = loadExtensionFromFile(file, 'extension')
  expect(typeof extension.setup).toBe('function')
  expect(extension.name).toBe('hello')
})
