import * as expect from 'expect'
import * as path from 'path'
import * as jetpack from 'fs-jetpack'
import { Command } from '../core/command'
import { Plugin } from '../core/plugin'
import { Toolbox } from '../core/toolbox'
import { Runtime } from '../runtime/runtime'
import * as uniqueTempDir from 'unique-temp-dir'
import { commandInfo, getModulesInfo } from './meta-tools'

const root = '' + uniqueTempDir({create: true});
const filename = 'config.json';
const config = {test: 'Hello~'}

beforeAll(() => {
  jetpack.write(path.join(root, filename), config)
});

afterAll(() => {
  jetpack.remove(root)
});

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
    moduleConfigFileName: filename
  }
  const info = getModulesInfo(fakeContext)
  expect(info).toEqual(config);
})