import * as expect from 'expect'
import { Runtime } from '../runtime/runtime'
import { fs } from '../'

const createRuntime = () => {
  const r = new Runtime()
  r.addCoreExtensions()
  r.addPlugin(`${__dirname}/../fixtures/good-plugins/generate`)
  return r
}

test('generates a simple file', async () => {
  const toolbox = await createRuntime().run('simple')

  expect(fs.exists(toolbox.result)).toBe('dir')
  expect(fs.exists(`${toolbox.result}/README.md`)).toBe('file')
  expect(fs.read(`${toolbox.result}/README.md`)).toBe('Simple File test')

  await fs.removeAsync(toolbox.result)
})

