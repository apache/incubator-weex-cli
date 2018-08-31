import * as expect from 'expect'
import * as sinon from 'sinon'
import { Toolbox } from '../../core/toolbox'
import { strings } from '../../toolbox/string-tools'
import command from './config'

// sinon.stub(console, 'log')

function createFakeToolbox(): Toolbox {
  const fakeContext = new Toolbox()
  fakeContext.strings = strings
  fakeContext.fs = {
    read: sinon.stub(),
    write: sinon.stub()
  }
  fakeContext.system = {
    userhome: sinon.stub(),
  }
  fakeContext.logger = {
    table: sinon.stub(),
    info: sinon.stub(),
    success: sinon.stub(),
    colors: {
      green: sinon.stub()
    },
  }
  fakeContext.parameters = { first: null, options: {} }
  fakeContext.fs.read.onFirstCall().returns({})
  return fakeContext
}

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
  toolbox.parameters.options['help'] = true;
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
  expect(read.callCount).toBe(1)
  expect(write.callCount).toBe(1)
})

test('config get <key> ', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'get'
  toolbox.parameters.second = 'key'
  await command.run(toolbox)
  const { read } = toolbox.fs
  const { info } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(read.callCount).toBe(1)
})

test('config list', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'list'
  await command.run(toolbox)
  const { read } = toolbox.fs
  const { info, success } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(success.callCount).toBe(1)
  expect(read.callCount).toBe(1)
})

test('config delete <key>', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'delete'
  toolbox.parameters.second = 'key'
  await command.run(toolbox)
  const { read, write } = toolbox.fs
  const { info, success } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(read.callCount).toBe(1)
  expect(write.callCount).toBe(1)
  expect(success.callCount).toBe(1)
})