import 'jest'
import * as expect from 'expect'
import * as sinon from 'sinon'
import * as path from 'path'
import * as jetpack from 'fs-jetpack'
import { Toolbox } from '../../core/toolbox'
import { strings } from '../../toolbox/string-tools'
import * as uniqueTempDir from 'unique-temp-dir'
import command from './config'

const home = '' + uniqueTempDir({ create: true })
const globalConfigFileName = 'config.json'
const config = { test: 'Hello~' }

function createFakeToolbox(): Toolbox {
  const fakeContext = new Toolbox()
  fakeContext.strings = strings
  fakeContext.fs = {
    read: sinon.stub(),
    write: sinon.stub(),
    exists: sinon.stub(),
  }
  fakeContext.system = {
    userhome: sinon.stub(),
  }
  fakeContext.logger = {
    table: sinon.stub(),
    info: sinon.stub(),
    success: sinon.stub(),
    colors: {
      green: sinon.stub(),
    },
  }
  fakeContext.inquirer = {
    prompt: sinon.stub(),
  }
  fakeContext.parameters = {
    first: null,
    options: {
      __config: {
        home: home,
        globalConfigFileName: globalConfigFileName,
        coreRoot: home,
      },
    },
  }
  fakeContext.inquirer.prompt.onFirstCall().returns(config)
  fakeContext.fs.read.onFirstCall().returns({})
  return fakeContext
}

beforeAll(() => {
  jetpack.write(path.join(home, globalConfigFileName), config)
})

afterAll(() => {
  jetpack.remove(home)
})

test('has the right interface', () => {
  expect(command.name).toBe('config')
  expect(command.description).toBe('Configure Weex Toolkit settings')
  expect(command.hidden).toBe(false)
  expect(command.alias).toEqual(['c'])
  expect(typeof command.run).toBe('function')
})

test('show helps while config with not args', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = null
  await command.run(toolbox)
  const { success, info, table } = toolbox.logger
  expect(success.callCount).toBe(2)
  expect(info.callCount).toBe(2)
  expect(table.callCount).toBe(2)
})

test('show helps while config with --help', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = null
  toolbox.parameters.options['help'] = true
  await command.run(toolbox)
  const { success, info, table } = toolbox.logger
  expect(success.callCount).toBe(2)
  expect(info.callCount).toBe(2)
  expect(table.callCount).toBe(2)
})

test('show help while config with command', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'set'
  await command.run(toolbox)
  const { table, info } = toolbox.logger
  expect(table.callCount).toBe(1)
  expect(info.callCount).toBe(1)
})

test('config set <key> <value>', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'set'
  toolbox.parameters.second = 'key'
  toolbox.parameters.third = 'value'
  await command.run(toolbox)
  const { read, write } = toolbox.fs
  const { info } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(read.callCount).toBe(0)
  expect(write.callCount).toBe(2)
})

test('config get <key> ', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'get'
  toolbox.parameters.second = 'key'
  await command.run(toolbox)
  const { read } = toolbox.fs
  const { info } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(read.callCount).toBe(0)
})

test('config list', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'list'
  await command.run(toolbox)
  const { read } = toolbox.fs
  const { info, success } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(success.callCount).toBe(1)
  expect(read.callCount).toBe(0)
})

test('config delete <key>', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'delete'
  toolbox.parameters.second = 'key'
  await command.run(toolbox)
  const { read, write } = toolbox.fs
  const { info, success } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(read.callCount).toBe(0)
  expect(write.callCount).toBe(2)
  expect(success.callCount).toBe(1)
})
