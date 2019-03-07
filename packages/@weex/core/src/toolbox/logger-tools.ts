import * as CLITable from 'cli-table2'
import * as importedColors from 'colors/safe'
import * as Gauge from 'gauge'
import { commandInfo } from './meta-tools'
import { Toolbox } from '../core/toolbox'
import * as ora from 'ora'
import { times, flip, prop } from 'ramda'
import * as logUpdate from 'log-update'
import * as cliSpinners from 'cli-spinners'
import * as logUtils from 'log-utils'

// hack typescript
const colors: any = importedColors
const { dots } = cliSpinners

import { ILOGGER } from './logger-types'

// Generate array of arrays of the data rows for length checking
// @ts-ignore
const getRows = t => times(flip(prop)(t), t.length)

const CLI_TABLE_COMPACT = {
  top: '',
  'top-mid': '',
  'top-left': '',
  'top-right': '',
  bottom: '',
  'bottom-mid': '',
  'bottom-left': '',
  'bottom-right': '',
  left: ' ',
  'left-mid': '',
  mid: '',
  'mid-mid': '',
  right: '',
  'right-mid': '',
  middle: ' ',
}

const CLI_TABLE_MARKDOWN = {
  ...CLI_TABLE_COMPACT,
  left: '|',
  right: '|',
  middle: '|',
}

const SEVERITY = {
  log: 2000,
  warn: 3000,
  info: 3000,
  error: 5000,
  success: 10000,
}

const LOGLEVEL = {
  LOG: 'log',
  WARN: 'warn',
  INFO: 'info',
  ERROR: 'error',
  SUCCESS: 'success',
}

let DEFAULT_LOGLEVEL = LOGLEVEL.LOG

/**
 * Sets the color scheme.
 */
colors.setTheme({
  highlight: 'cyan',
  info: 'reset',
  warning: 'yellow',
  success: 'green',
  error: 'red',
  line: 'grey',
  muted: 'grey',
})

/**
 * Print a blank line.
 */
function newline() {
  console.log('')
}

/**
 * Returns an array of the column widths.
 *
 * @param cliTable Data table.
 * @returns Array of column widths
 */
function findWidths(cliTable: CLITable): number[] {
  return [(cliTable as any).options.head]
    .concat(getRows(cliTable))
    .reduce((colWidths, row) => row.map((str, i) => Math.max(`${str}`.length + 1, colWidths[i] || 1)), [])
}

/**
 * Returns an array of column dividers based on column widths.
 *
 * @param cliTable Data table.
 * @returns Array of properly sized column dividers.
 */
function columnHeaderDivider(cliTable: CLITable): string[] {
  return findWidths(cliTable).map(w => Array(w).join('-'))
}

/**
 * Prints an object to table format.  The values will already be
 * stringified.
 *
 * @param object The object to turn into a table.
 */
function table(data: string[][], options: any = {}): void {
  let t
  switch (options.format) {
    case 'markdown':
      const header = data.shift()
      t = new CLITable({
        head: header,
        chars: CLI_TABLE_MARKDOWN,
      })
      t.push(...data)
      t.unshift(columnHeaderDivider(t))
      break
    case 'lean':
      t = new CLITable()
      t.push(...data)
      break
    default:
      t = new CLITable({
        chars: CLI_TABLE_COMPACT,
      })
      t.push(...data)
  }
  console.log(t.toString())
}

/**
 * Prints text without theming.
 *
 * Use this when you're writing stuff outside the toolbox of our
 * printing scheme.  hint: rarely.
 *
 * @param message The message to write.
 */
function log(message: string): void {
  if (SEVERITY[LOGLEVEL.LOG] >= SEVERITY[DEFAULT_LOGLEVEL]) {
    console.log(message)
  }
}

/**
 * Writes a normal information message.
 *
 * This is the default type you should use.
 *
 * @param message The message to show.
 */
function info(message: string): void {
  if (SEVERITY[LOGLEVEL.INFO] >= SEVERITY[DEFAULT_LOGLEVEL]) {
    console.log(colors.info(message))
  }
}

/**
 * Writes an error message.
 *
 * This is when something horribly goes wrong.
 *
 * @param message The message to show.
 */
function error(message: string): void {
  if (SEVERITY[LOGLEVEL.ERROR] >= SEVERITY[DEFAULT_LOGLEVEL]) {
    console.log(colors.error(message))
  }
}

/**
 * Writes a warning message.
 *
 * This is when the user might not be getting what they're expecting.
 *
 * @param message The message to show.
 */
function warn(message: string): void {
  if (SEVERITY[LOGLEVEL.WARN] >= SEVERITY[DEFAULT_LOGLEVEL]) {
    console.log(colors.warning(message))
  }
}

/**
 * Writes a success message.
 *
 * When something is successful.  Use sparingly.
 *
 * @param message The message to show.
 */
function success(message: string): void {
  console.log(colors.success(message))
}

/**
 * Creates a spinner and starts it up.
 *
 * @param config The text for the spinner or an ora configuration object.
 * @returns The spinner.
 */
function spin(config?: string | object): any {
  return ora(config || '').start()
}

function progress(stream?: any, options?: any) {
  return new Gauge(stream, options)
}
/**
 * Prints the list of commands.
 *
 * @param toolbox The toolbox that was used
 * @param commandRoot Optional, only show commands with this root
 */
function printCommands(toolbox: Toolbox, commandRoot?: string[]): void {
  const data = commandInfo(toolbox, commandRoot)

  newline() // a spacer
  table(data) // the data
}

function printHelp(toolbox: Toolbox): void {
  const {
    runtime: { brand },
  } = toolbox
  info(`${brand} version ${toolbox.meta.version()}`)
  printCommands(toolbox)
}

function timestamp(message: string): void {
  info(`${logUtils.timestamp} ${message}`)
}

async function logPromise(promise, text, completedLabel = '') {
  const { frames, interval } = dots

  let index = 0

  const id = setInterval(() => {
    index = ++index % frames.length
    logUpdate(`${colors.yellow(frames[index])} ${text} ${colors.gray('- this may take a few seconds')}`)
  }, interval)

  const returnValue = await promise

  clearInterval(id)

  logUpdate(`${colors.green(logUtils.success)} ${text} ${colors.gray(completedLabel)}`)
  logUpdate.done()

  return returnValue
}

const checkmark = colors.success(logUtils.success)
const xmark = colors.error(logUtils.error)

const logger: ILOGGER = {
  colors,
  newline,
  findWidths,
  columnHeaderDivider,
  table,
  log,
  info,
  error,
  warn,
  success,
  spin,
  progress,
  timestamp,
  printCommands,
  printHelp,
  checkmark,
  xmark,
  logPromise,
}

export { logger, ILOGGER, LOGLEVEL }
