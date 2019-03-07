import { IToolbox } from '../index'
import * as CLITable from 'cli-table2'

export interface ILOGGER {
  /* Colors as seen from colors.js. */
  colors: any
  /* A green checkmark. */
  checkmark: string
  /* A red X marks the spot. */
  xmark: string
  /* Prints a message to stdout. */
  info: (message: any) => void
  /* Prints a warning-colored message. */
  warn: (message: any) => void
  /* Prints a success-colored message. */
  success: (message: any) => void
  /* Prints an error-colored message. */
  error: (message: any) => void
  /* DEPRECATED: prints a normal line of text. */
  log: (value: string) => void
  /* prints a normal line of text with timestamp. */
  timestamp: (value: string) => void
  /* Finds the column widths for a table */
  findWidths: (cliTable: CLITable) => number[]
  /* Returns column header dividers for a table */
  columnHeaderDivider: (cliTable: CLITable) => string[]
  /* Prints a newline. */
  newline: () => void
  /* Prints a table of data (usually a 2-dimensional array). */
  table: (data: any, options?: any) => void
  /* An `gauge`-powered progressbar. */
  progress(steam?: any, options?: any): any
  /* An `ora`-powered spinner. */
  spin(options?: any): any
  /* Print help info for known CLI commands. */
  printCommands(toolbox: IToolbox): void
  /* Prints help info, including version and commands. */
  printHelp(toolbox: IToolbox): void
  /* Prints progress unit promise has resolved. */
  logPromise(promise: Promise<any>, text: string, completedLabel: string): void
}
