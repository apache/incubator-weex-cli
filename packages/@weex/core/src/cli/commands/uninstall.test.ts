import * as expect from 'expect'
import * as sinon from 'sinon'
import * as path from 'path'
import * as jetpack from 'fs-jetpack'
import * as uniqueTempDir from 'unique-temp-dir'
import { Toolbox } from '../../core/toolbox'
import { strings } from '../../toolbox/string-tools'
import { fs } from '../../toolbox/fs-tools'
import command from './uninstall'
import { ModType } from '../cli'

const globalConfig = {
  moduleRoot: '' + uniqueTempDir({ create: true }),
  moduleConfigFileName: 'config.json',
  registry: 'https://registry.npmjs.org/',
  modules: {
    mods: {},
  },
}
const packagename = 'testpackage'
const config = {}
const callback = sinon.spy()
const local = path.join(globalConfig.moduleRoot, 'node_modules_lock')

function createFakeToolbox(): Toolbox {
  const fakeContext = new Toolbox()
  fakeContext.strings = strings
  fakeContext.fs = fs
  fakeContext.logger = {
    table: sinon.stub(),
    info: sinon.stub(),
    success: sinon.stub(),
    spin: sinon.stub(),
    warn: sinon.stub(),
    colors: {
      green: sinon.stub(),
      yellow: sinon.stub(),
    },
  }
  fakeContext.parameters = {
    first: null,
    options: {
      __config: globalConfig,
    },
  }
  fakeContext.logger.spin.onFirstCall().returns({ test: '', succeed: callback })
  return fakeContext
}

beforeAll(() => {
  globalConfig.modules.mods[packagename] = {
    local,
    type: ModType.PLUGIN,
  }
  jetpack.file(local, config)
})

afterAll(() => {
  jetpack.remove(globalConfig.moduleRoot)
})

test('has the right interface', () => {
  expect(command.name).toBe('uninstall')
  expect(command.description).toBe('Uninstall weex plugin from Weex Cli')
  expect(command.hidden).toBe(false)
  expect(command.alias).toEqual(['un'])
  expect(typeof command.run).toBe('function')
})

test('show helps while config with not args', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = null
  await command.run(toolbox)
  const { info, table } = toolbox.logger
  expect(info.callCount).toBe(1)
  expect(table.callCount).toBe(1)
})

// test('install package with version', async () => {
//   const toolbox = createFakeToolbox()
//   toolbox.parameters.first = `${packagename}@1.0.0`
//   expect(fs.exists(local)).toBe('file')
//   await command.run(toolbox)
//   expect(callback.called).toBe(false)
//   expect(fs.exists(local)).toBe('file')
//   expect(fs.exists(path.join(globalConfig.moduleRoot, globalConfig.moduleConfigFileName))).toBe('file')
// })

test('install package with not exist package', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'notExistPackage'
  await command.run(toolbox)
  const { warn, info } = toolbox.logger
  expect(warn.callCount).toBe(1)
  expect(info.callCount).toBe(1)
})
