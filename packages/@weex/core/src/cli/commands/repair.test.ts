import * as expect from 'expect'
import * as sinon from 'sinon'
import * as path from 'path'
import * as jetpack from 'fs-jetpack'
import * as uniqueTempDir from 'unique-temp-dir'
import { Toolbox } from '../../core/toolbox'
import { strings } from '../../toolbox/string-tools'
import { fs } from '../../toolbox/fs-tools'
import command from './repair'

const globalConfig = {
  moduleRoot: '' + uniqueTempDir({ create: true }),
  moduleConfigFileName: 'config.json',
  registry: 'https://registry.npmjs.org/',
  modules: {
    mods: {},
  },
}
const packagename = '@weex-cli/linker'
const config = {}
const local = path.join(globalConfig.moduleRoot, 'node_modules_lock')

function createFakeToolbox(): Toolbox {
  const fakeContext = new Toolbox()
  fakeContext.strings = strings
  fakeContext.fs = fs
  fakeContext.logger = {
    table: sinon.stub(),
    info: sinon.stub(),
    success: sinon.stub(),
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
  return fakeContext
}

afterEach(() => {
  jetpack.remove(globalConfig.moduleRoot)
})

test('has the right interface', () => {
  expect(command.name).toBe('repair')
  expect(command.description).toBe('Repair weex package or command')
  expect(command.hidden).toBe(false)
  expect(command.alias).toEqual(['r'])
  expect(typeof command.run).toBe('function')
})

test('show helps while config with not args', async () => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = null
  await command.run(toolbox)
  const { info, table, success } = toolbox.logger
  expect(info.callCount).toBe(2)
  expect(table.callCount).toBe(1)
  expect(success.callCount).toBe(1)
})

// test('repair package with version', async () => {
//   const toolbox = createFakeToolbox()
//   toolbox.parameters.first = `${packagename}@1.0.0`
//   await command.run(toolbox)
//   console.log(path.join(globalConfig.moduleRoot, globalConfig.moduleConfigFileName))
//   expect(fs.exists(path.join(globalConfig.moduleRoot, globalConfig.moduleConfigFileName))).toBe('file')
// })
