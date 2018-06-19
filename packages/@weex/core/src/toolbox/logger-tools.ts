import * as CLITable from 'cli-table2'
import * as importedColors from 'colors/safe'
import * as Gauge from 'gauge'
import { commandInfo } from './meta-tools'
import { Toolbox } from '../core/toolbox'
import * as ora from 'ora'
import { times, flip, prop } from 'ramda'

// hack typescript
const colors: any = importedColors

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
  debug: 1000,
  log: 2000,
  warn: 3000,
  info: 3000,
  error: 5000,
  success: 10000
}

const LOGLEVEL = {
  DEBUG: 'debug',
  LOG: 'log',
  WARN: 'warn',
  INFO: 'info',
  ERROR: 'error',
  SUCCESS: 'success'
};


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
 * Prints a divider line
 */
function divider() {
  console.log(colors.line('---------------------------------------------------------------'))
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
 * Set log level for logger.
 *
 * Use this when you want to set the loglevel.
 *
 * @param message The message to write.
 */
function setLevel(logLevel: string): void{
  DEFAULT_LOGLEVEL = logLevel;
};

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
 * Writes a debug message.
 *
 * This is for devs only.
 *
 * @param message The message to show.
 */
function debug(message: string, title: string = 'DEBUG'): void {
  const topLine = `vvv -----[ ${title} ]----- vvv`
  const botLine = `^^^ -----[ ${title} ]----- ^^^`
  if (SEVERITY[LOGLEVEL.DEBUG] >= SEVERITY[DEFAULT_LOGLEVEL]) {
    console.log(colors.rainbow(topLine))
    console.log(message)
    console.log(colors.rainbow(botLine))
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
  return new Gauge(stream, options);
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

const checkmark = colors.success('✔︎')
const xmark = colors.error('ⅹ')

const logger: ILOGGER = {
  colors,
  newline,
  divider,
  findWidths,
  columnHeaderDivider,
  table,
  setLevel,
  log,
  info,
  error,
  warn,
  debug,
  success,
  spin,
  progress,
  printCommands,
  printHelp,
  checkmark,
  xmark,
}

export { logger, ILOGGER, LOGLEVEL}
