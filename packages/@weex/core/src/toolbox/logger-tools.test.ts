import * as expect from 'expect'
import * as stripANSI from 'strip-ansi'
import { logger } from './logger-tools'

// hack the console
const log = console.log
let spyLogger = []
console.log = (x, y) => spyLogger.push([stripANSI(x), stripANSI(y)])

test('default', () => {
  spyLogger = []
  console.log = log
})

test('info', () => {
  logger.info('info')
  logger.warn('warn')
  logger.success('success')
  logger.error('error')
  const title = 'there'
  logger.log('any message')
  logger.newline()
  logger.table([['liam', '5'], ['matthew', '2']])
  logger.table([['liam', '5'], ['matthew', '2']], { format: 'markdown' })

  expect(spyLogger).toMatchSnapshot()
})

test('setLevel', () => {
  logger.info('info')
  logger.warn('warn')
  logger.success('success')
  logger.error('error')

  expect(spyLogger).toMatchSnapshot()
})

test('spin', () => {
  expect(typeof logger.spin).toBe('function')
  const spinner = logger.spin()
  expect(typeof spinner.stop).toBe('function')
})

test('progress', () => {
  expect(typeof logger.progress).toBe('function')
  const progress = logger.progress()
  expect(typeof progress.show).toBe('function')
  expect(typeof progress.hide).toBe('function')
  expect(typeof progress.pulse).toBe('function')
  expect(typeof progress.disable).toBe('function')
  expect(typeof progress.enable).toBe('function')
  expect(typeof progress.isEnabled).toBe('function')
  expect(typeof progress.setThemeset).toBe('function')
  expect(typeof progress.setTheme).toBe('function')
  expect(typeof progress.setTemplate).toBe('function')
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
