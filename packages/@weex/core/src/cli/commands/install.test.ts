import * as expect from 'expect'
import * as sinon from 'sinon'
import * as path from 'path'
import * as uniqueTempDir from 'unique-temp-dir'
import * as jetpack from 'fs-jetpack'
import { Toolbox } from '../../core/toolbox'
import { strings } from '../../toolbox/string-tools'
import command from './install'

const globalConfig = {
  moduleRoot: uniqueTempDir({ create: true }),
  moduleConfigFileName: 'config.json',
  registry: 'https://registry.npmjs.org/',
  modules: {
    mods: {},
  },
}
const config = { test: 'Hello~' }

function createFakeToolbox(): Toolbox {
  const fakeContext = new Toolbox()
  fakeContext.strings = strings
  fakeContext.fs = {
    read: sinon.stub(),
    write: sinon.stub(),
    list: sinon.stub(),
    exists: sinon.stub(),
  }
  fakeContext.system = {
    userhome: sinon.stub(),
  }
  fakeContext.logger = {
    table: sinon.stub(),
    info: sinon.stub(),
    log: sinon.stub(),
    success: sinon.stub(),
    colors: {
      green: sinon.stub(),
      yellow: sinon.stub(),
    },
  }
  fakeContext.inquirer = {
    prompt: sinon.stub(),
  }
  fakeContext.parameters = {
    first: null,
    options: {
      __config: globalConfig,
    },
  }
  fakeContext.inquirer.prompt.onFirstCall().returns(config)
  fakeContext.fs.read.onFirstCall().returns({})
  return fakeContext
}

afterAll(() => {
  jetpack.remove(globalConfig.moduleRoot)
})

test('has the right interface', () => {
  expect(command.name).toBe('install')
  expect(command.description).toBe('Install weex plugin for Weex Cli')
  expect(command.hidden).toBe(false)
  expect(command.alias).toEqual(['update', 'i'])
  expect(typeof command.run).toBe('function')
})

test('show helps while config with not args', async () => {
  const toolbox: Toolbox = createFakeToolbox()
  toolbox.parameters.first = null
  await command.run(toolbox)
  const { success, info, table } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(table.callCount).toBe(1)
})

// test('install package with version', async () => {
//   const toolbox = createFakeToolbox()
//   toolbox.parameters.first = '@weex-cli/linker@1.0.0'
//   await command.run(toolbox)
//   const { write, list } = toolbox.fs
//   const { success } = toolbox.logger
//   expect(success.callCount).toBe(1)
//   expect(write.callCount).toBe(1)
//   expect(list.callCount).toBe(1)
// })
