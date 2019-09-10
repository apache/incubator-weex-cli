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
import { Toolbox } from '../core/toolbox'
import { loadCommandFromFile, loadCommandFromPreload } from './command-loader'

test('loading from a missing file', async () => {
  await expect(() => loadCommandFromFile('foo.js')).toThrowError(
    "Error: couldn't load command (this isn't a file): foo.js",
  )
})

test('deals with weird input', async () => {
  await expect(() => loadCommandFromFile('')).toThrowError("Error: couldn't load command (file is blank): ")
})

test('open a weird js file', async () => {
  const file = `${__dirname}/../fixtures/bad-modules/text.js`
  await expect(() => loadCommandFromFile(file)).toThrowError(`hello is not defined`)
})

test('default but no run property exported', async () => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-object.js`
  await expect(() => loadCommandFromFile(file)).toThrowError(
    `Error: Couldn't load command module-exports-object -- needs a "run" property with a function.`,
  )
})

test('fat arrows', async () => {
  const file = `${__dirname}/../fixtures/good-modules/module-exports-fat-arrow-fn.js`
  await expect(() => loadCommandFromFile(file)).not.toThrow()
})

test('load command from preload', async () => {
  const command = loadCommandFromPreload({
    name: 'hello',
    description: 'yiss dream',
    alias: ['z'],
    dashed: true,
    run: toolbox => 'ran!',
  })

  expect(command.name).toBe('hello')
  expect(command.description).toBe('yiss dream')
  expect(command.hidden).toBe(false)
  expect(command.alias).toEqual(['z'])
  expect(command.run(new Toolbox())).toBe('ran!')
  expect(command.file).toBe(null)
  expect(command.dashed).toBe(true)
  expect(command.commandPath).toEqual(['hello'])
})
