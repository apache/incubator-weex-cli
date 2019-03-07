import Cli, { CliConfiguration } from './cli'
import * as sinon from 'sinon'

sinon.stub(console, 'log')

// set jest timeout to very long, because these take a while
beforeAll(() => jest.setTimeout(90 * 1000))
// reset back
afterAll(() => jest.setTimeout(5 * 1000))

test('can start the cli', async () => {
  const cliConfiguration: CliConfiguration = {
    cliVersion: '',
    corePath: '',
    coreName: '',
    coreRoot: '',
    moduleRoot: '',
    moduleConfigFileName: '',
    home: '',
    registry: '',
    argv: '',
    trash: '',
    modules: {
      mods: {},
      last_update_time: new Date().getTime(),
    },
    globalConfigFileName: '',
  }
  const options = {}
  const cli = new Cli(cliConfiguration, options)
  expect(typeof cli.start).toBe('function')
  const toolbox = await cli.start()
  expect(toolbox.commandName).toBe('weex')
  expect(Array.isArray(toolbox.plugin.commands)).toBeTruthy()
  expect(Array.isArray(toolbox.plugin.extensions)).toBeTruthy()
  expect(Array.isArray(toolbox.runtime.extensions)).toBeTruthy()
  expect(Array.isArray(toolbox.runtime.commands)).toBeTruthy()
  expect(Array.isArray(toolbox.runtime.plugins)).toBeTruthy()
  expect(toolbox.pluginName).toBe('weex')
  expect(typeof toolbox.fs === 'object' || typeof toolbox.fs === 'function').toBeTruthy()
  expect(typeof toolbox.meta === 'object' || typeof toolbox.meta === 'function').toBeTruthy()
  expect(typeof toolbox.strings === 'object' || typeof toolbox.strings === 'function').toBeTruthy()
  expect(typeof toolbox.logger === 'object' || typeof toolbox.logger === 'function').toBeTruthy()
  expect(typeof toolbox.semver === 'object' || typeof toolbox.semver === 'function').toBeTruthy()
  expect(typeof toolbox.system === 'object' || typeof toolbox.system === 'function').toBeTruthy()
  expect(typeof toolbox.inquirer === 'object' || typeof toolbox.inquirer === 'function').toBeTruthy()
  expect(typeof toolbox.http === 'object' || typeof toolbox.http === 'function').toBeTruthy()
  expect(typeof toolbox.patching === 'object' || typeof toolbox.http === 'function').toBeTruthy()
})
