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
import * as path from 'path'
import * as jetpack from 'fs-jetpack'
import { Command } from '../core/command'
import { Plugin } from '../core/plugin'
import { Toolbox } from '../core/toolbox'
import { Runtime } from '../runtime/runtime'
import * as uniqueTempDir from 'unique-temp-dir'
import { commandInfo, getModulesInfo } from './meta-tools'

const root = '' + uniqueTempDir({ create: true })
const filename = 'config.json'
const config = { test: 'Hello~' }

beforeAll(() => {
  jetpack.write(path.join(root, filename), config)
})

afterAll(() => {
  jetpack.remove(root)
})

test('commandInfo', () => {
  const fakeContext = new Toolbox()
  const fakeCommand = new Command()
  const fakePlugin = new Plugin()

  fakeContext.runtime = new Runtime()
  fakeContext.runtime.addCoreExtensions()

  fakeCommand.name = 'foo'
  fakeCommand.description = 'foo is a command'
  fakeCommand.commandPath = ['foo']
  fakeCommand.alias = ['f']
  fakeCommand.plugin = fakePlugin

  fakePlugin.commands = [fakeCommand]

  fakeContext.runtime.plugins = [fakePlugin]
  fakeContext.runtime.commands = [fakeCommand]

  const info = commandInfo(fakeContext)
  expect(info).toEqual([['foo (f)', 'foo is a command']])
})

test('getModulesInfo', () => {
  const fakeContext = new Toolbox()
  fakeContext.runtime = new Runtime()
  fakeContext.runtime.addCoreExtensions()
  fakeContext.parameters['options'] = {}
  fakeContext.parameters.options['__config'] = {
    moduleRoot: root,
    moduleConfigFileName: filename,
  }
  const info = getModulesInfo(fakeContext)
  expect(info).toEqual(config)
})
