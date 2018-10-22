import { isWindows } from '@weex-cli/utils/lib/platform/platform'
import { spawnSync, execSync } from 'child_process'
import * as fs from 'fs'

export function runAsync(command: string, args: string[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    let result
    try {
      result = spawnSync(command, args)
      resolve(result)
    } catch (e) {
      reject(`Exit code ${result.status} from: ${command}:\n${result}`)
    }
  })
}

function cleanInput(s) {
  if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
    s = "'" + s.replace(/'/g, "'\\''") + "'"
    s = s
      .replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
      .replace(/\\'''/g, "\\'") // remove non-escaped single-quote if there are enclosed between 2 escaped
  }
  return s
}

function commandExistsWindowsSync(commandName, cleanedCommandName, callback?) {
  try {
    const stdout = execSync('where ' + cleanedCommandName, { stdio: [] })
    return !!stdout
  } catch (error) {
    return false
  }
}

function fileNotExistsSync(commandName) {
  try {
    fs.accessSync(commandName, fs.constants.F_OK)
    return false
  } catch (e) {
    return true
  }
}

function localExecutableSync(commandName) {
  try {
    fs.accessSync(commandName, fs.constants.F_OK | fs.constants.X_OK)
    return false
  } catch (e) {
    return true
  }
}

function commandExistsUnixSync(commandName, cleanedCommandName, callback?): boolean {
  if (fileNotExistsSync(commandName)) {
    try {
      const stdout = execSync(
        'command -v ' + cleanedCommandName + ' 2>/dev/null' + ' && { echo >&1 ' + cleanedCommandName + '; exit 0; }',
      )
      return !!stdout
    } catch (error) {
      return false
    }
  }
  return localExecutableSync(commandName)
}

export function commandExistsSync(commandName): boolean {
  const cleanedCommandName = cleanInput(commandName)
  if (isWindows) {
    return commandExistsWindowsSync(commandName, cleanedCommandName)
  } else {
    return commandExistsUnixSync(commandName, cleanedCommandName)
  }
}

export function which(execName, args = []): string[] {
  const spawnArgs = [execName, ...args]
  const result = spawnSync('which', spawnArgs)
  if (result.status !== 0) {
    return []
  }
  const lines = result.stdout
    .toString()
    .trim()
    .split('\n')
  return lines
}

export function runSync(commandName, args: string[] = []) {
  let result
  try {
    result = spawnSync(commandName, args)
    return result
  } catch (e) {
    return null
  }
}

export function canRunSync(commandName, args: string[] = []): boolean {
  let result
  try {
    result = spawnSync(commandName, args)
    if (result.status === 0) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}
