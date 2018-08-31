import * as expect from 'expect'
import { Toolbox } from '../core/toolbox'
import loggerExtension from './logger-extension'

const toolbox = new Toolbox()
loggerExtension(toolbox)

const { logger } = toolbox

test('info', () => {
  expect(typeof logger.info).toBe('function')
})

test('warn', () => {
  expect(typeof logger.warn).toBe('function')
})

test('success', () => {
  expect(typeof logger.success).toBe('function')
})

test('error', () => {
  expect(typeof logger.error).toBe('function')
})

test('newline', () => {
  expect(typeof logger.newline).toBe('function')
})

test('table', () => {
  expect(typeof logger.table).toBe('function')
})

test('spin', () => {
  expect(typeof logger.spin).toBe('function')
})

test('colors', () => {
  expect(typeof logger.colors.highlight).toBe('function')
  expect(typeof logger.colors.info).toBe('function')
  expect(typeof logger.colors.warning).toBe('function')
  expect(typeof logger.colors.success).toBe('function')
  expect(typeof logger.colors.error).toBe('function')
  expect(typeof logger.colors.line).toBe('function')
  expect(typeof logger.colors.muted).toBe('function')
})
