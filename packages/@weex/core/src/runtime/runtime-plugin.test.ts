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
import { Runtime } from './runtime'

const BAD_PLUGIN_PATH = `${__dirname}/../fixtures/does-not-exist`

test('load a directory', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/simplest`)
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)
  expect(r.plugins.length).toBe(2)
})

test('hides commands', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`, { hidden: true })
  expect(r.plugins.length).toBe(1)
  expect(r.plugins[0].commands[2].hidden).toBe(true)
})

test('silently ignore plugins with broken dirs', async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  const error = r.addPlugin(BAD_PLUGIN_PATH)
  expect(undefined).toBe(error)
})

test("throws error if plugin doesn't exist and required: true", async () => {
  const r = new Runtime()
  r.addCoreExtensions()
  await expect(() => r.addPlugin(BAD_PLUGIN_PATH, { required: true })).toThrowError(
    `Error: couldn't load plugin (not a directory): ${BAD_PLUGIN_PATH}`,
  )
})
