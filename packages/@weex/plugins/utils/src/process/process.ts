/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/**
 * Help manage process
 */

const debug = require('debug')('utils')
import * as EventEmitter from 'events'
const childProcess = require('child_process')

export enum messageType {
  outputLog = 'outputLog',
  outputError = 'outputError',
}

export function runAndGetOutput(cmdString: string, options = {}) {
  try {
    return childProcess.execSync(cmdString, Object.assign({ encoding: 'utf8' }, options)).toString()
  } catch (e) {
    return ''
  }
}

/**
 * Convert a object to cmd string for `exec` use
 * @param cmdName
 * @param params
 */
export function createCmdString(cmdName: string, params: object) {
  let cmdString = `${cmdName} `

  const keys = Object.keys(params)

  keys.forEach(key => {
    cmdString = `${cmdString} ${key} ${params[key]}`
  })

  return cmdString
}

export interface ExecOptions {
  onOutCallback?: Function
  onErrorCallback?: Function
  onCloseCallback?: Function
  handleChildProcess?: Function
  event?: EventEmitter
}

export function exec(cmdString: string, options?: ExecOptions, nativeExecOptions?): Promise<any> {
  const { onOutCallback, onErrorCallback, onCloseCallback, handleChildProcess, event } = options || ({} as ExecOptions)
  return new Promise((resolve, reject) => {
    try {
      const child = childProcess.exec(
        cmdString,
        Object.assign(
          {
            encoding: 'utf8',
            maxBuffer: 102400 * 1024,
            wraning: false,
          },
          nativeExecOptions,
        ),
        error => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        },
      )
      if (handleChildProcess) {
        handleChildProcess(child)
      }
      if (onOutCallback || event) {
        child.stdout.on('data', data => {
          const bufStr = Buffer.from(data)
            .toString()
            .trim()
          onOutCallback && onOutCallback(bufStr)
          debug(`STDOUT: ${bufStr}`)
          event && event.emit(messageType.outputLog, bufStr)
        })
      }
      if (onErrorCallback || event) {
        child.stderr.on('data', data => {
          const bufStr = Buffer.from(data)
            .toString()
            .trim()
          onErrorCallback && onErrorCallback(bufStr)
          debug(`STDERR: ${bufStr}`)
          event && event.emit(messageType.outputError, bufStr)
        })
      }
      if (onCloseCallback) {
        child.on('close', (code, signal) => {
          onCloseCallback(code, signal)
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function runAsync(command: string, args: string[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    let result
    try {
      result = childProcess.spawnSync(command, args)
      resolve(result)
    } catch (e) {
      reject(`Exit code ${result.status} from: ${command}:\n${result}`)
    }
  })
}

export function runSync(command: string, args: string[] = []) {
  try {
    return childProcess.spawnSync(command, args)
  } catch (e) {
    return null
  }
}

export function which(execName, args = []): string[] {
  const spawnArgs = [execName, ...args]
  const result = childProcess.spawnSync('which', spawnArgs)
  if (result.status !== 0) {
    return []
  }
  const lines = result.stdout
    .toString()
    .trim()
    .split('\n')
  return lines
}

export function canRunSync(commandName, args: string[] = []): boolean {
  let result
  try {
    result = childProcess.spawnSync(commandName, args)
    if (result.status === 0) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}
