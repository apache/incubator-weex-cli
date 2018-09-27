import * as expect from 'expect'
import { Toolbox } from '../core/toolbox'
import createExtension from './inquirer-extension'

test('has the proper interface', () => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const ext = toolbox.inquirer
  expect(ext).toBeTruthy()
  expect(typeof ext.prompt).toBe('function')
  expect(typeof ext.Separator).toBe('function')
  expect(typeof ext.createPromptModule).toBe('function')
  expect(typeof ext.registerPrompt).toBe('function')
  expect(typeof ext.restoreDefaultPrompts).toBe('function')
  expect(typeof ext.ui).toBe('object')
})
