import * as expect from 'expect'
import * as sinon from 'sinon'
import { Toolbox } from '../../core/toolbox'
import { strings } from '../../toolbox/string-tools'
import command from './generate'

sinon.stub(console, 'log')

function createFakeToolbox(): Toolbox {
  const fakeContext = new Toolbox()
  fakeContext.strings = strings
  fakeContext.fs = {
    resolve: sinon.stub(),
    dir: sinon.stub(),
    chmodSync: sinon.stub(),
    rename: sinon.stub(),
  }
  fakeContext.system = {
    spawn: sinon.stub(),
  }
  fakeContext.template = { generate: sinon.stub() }
  fakeContext.logger = {
    info: sinon.stub(),
    error: sinon.stub(),
  }
  fakeContext.parameters = { first: null, options: {} }
  return fakeContext
}

test('has the right interface', () => {
  expect(command.name).toBe('generate')
  expect(command.description).toBe('Generate a new plugin')
  expect(command.hidden).toBe(false)
  expect(command.alias).toEqual(['g'])
  expect(typeof command.run).toBe('function')
})

test('name is required', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = null
  await command.run(toolbox)
  const { error } = toolbox.logger
  expect(error.getCall(0).args[0]).toBe('You must provide a valid Plugin name.')
})

test('name cannot be blank', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = ''
  await command.run(toolbox)
  const { error } = toolbox.logger
  expect(error.getCall(0).args).toEqual(['You must provide a valid Plugin name.'])
  expect(error.getCall(1).args).toEqual(['Example: weex g foo.'])
})

test('name must pass regex', async () => {
  const toolbox = createFakeToolbox()
  const name = 'O M G'
  toolbox.parameters.first = name
  await command.run(toolbox)
  const { error } = toolbox.logger
  expect(error.getCall(0).args).toEqual([`${name} is not a valid name. Use lower-case and dashes only.`])
  expect(error.getCall(1).args).toEqual([`Suggested: weex g ${strings.kebabCase(name)}.`])
})
