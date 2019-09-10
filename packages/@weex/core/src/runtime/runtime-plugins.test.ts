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

test('loads all sub-directories', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugins(`${__dirname}/../fixtures/good-plugins`)

  expect(13).toBe(r.plugins.length)
})

test('matches sub-directories', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugins(`${__dirname}/../fixtures/good-plugins`, { matching: 'blank-*' })
  expect(1).toBe(r.plugins.length)
})

test('hides commands', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugins(`${__dirname}/../fixtures/good-plugins`, {
    matching: 'threepack',
    hidden: true,
  })
  expect(r.plugins.length).toBe(1)
  expect(r.plugins[0].commands[2].hidden).toBe(true)
})

test('addPlugins ignores bad directories', () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugins(__filename)
  r.addPlugins(null)
  r.addPlugins(undefined)
  r.addPlugins('')
  expect(0).toBe(r.plugins.length)
})

test('commands and defaultCommand work properly even when multiple plugins are loaded', async () => {
  const r = new Runtime('default-command')
  r.addCoreExtensions()
  r.addDefaultPlugin(`${__dirname}/../fixtures/good-plugins/nested`)
  r.addCommand({
    name: 'default-command',
    run: () => null,
  })
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/threepack`)

  expect(2).toBe(r.plugins.length)

  let toolbox = await r.run('')

  expect(toolbox.command.name).toBe('default-command')

  toolbox = await r.run('one')

  expect(toolbox.command.name).toBe('one')
})
