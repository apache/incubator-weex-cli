// The MIT License (MIT)

//   Copyright (c) 2016-3016 Infinite Red, Inc.

//   Permission is hereby granted, free of charge, to any person obtaining a copy
//   of this software and associated documentation files (the "Software"), to deal
//   in the Software without restriction, including without limitation the rights
//   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//   copies of the Software, and to permit persons to whom the Software is
//   furnished to do so, subject to the following conditions:

//   The above copyright notice and this permission notice shall be included in all
//   copies or substantial portions of the Software.

//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//   SOFTWARE.

import { exec as nodeExec } from 'child_process'
import * as crossSpawn from 'cross-spawn'
import * as execa from 'execa'
import { dissoc, head, identity, isNil, split, tail, trim } from 'ramda'
import * as nodeWhich from 'which'
import { Options } from '../core/options'
import { ISystem } from './system-types'
import * as userHome from 'userhome'

/**
 * Executes a commandline program asynchronously.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
 */
async function run(commandLine: string, options: Options = {}): Promise<any> {
  const trimmer = options && options.trim ? trim : identity
  const nodeOptions = dissoc('trim', options)

  return new Promise((resolve, reject) => {
    nodeExec(commandLine, nodeOptions, (error: any, stdout: string, stderr: string) => {
      if (error) {
        error.stderr = stderr
        reject(error)
      }
      resolve(trimmer(stdout || ''))
    })
  })
}

/**
 * Executes a commandline via execa.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
 */
async function exec(commandLine: string, options: Options = {maxBuffer: Infinity}): Promise<any> {
  return new Promise((resolve, reject) => {
    const args = split(' ', commandLine)
    execa(head(args), tail(args), options)
      .then(result => resolve(result.stdout))
      .catch(error => reject(error))
  })
}

/**
 * Uses cross-spawn to run a process.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns The response code.
 */
async function spawn(commandLine: string, options: Options = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const args = split(' ', commandLine)
    const spawned = crossSpawn(head(args), tail(args), options)
    const result = {
      stdout: null,
      status: null,
      error: null,
    }
    if (spawned.stdout) {
      spawned.stdout.on('data', data => {
        if (isNil(result.stdout)) {
          result.stdout = data
        } else {
          result.stdout += data
        }
      })
    }
    spawned.on('close', code => {
      result.status = code
      resolve(result)
    })
    spawned.on('error', err => {
      result.error = err
      resolve(result)
    })
  })
}

/**
 * Finds the location of the path.
 *
 * @param command The name of program you're looking for.
 * @return The full path or null.
 */
function which(command: string): string | null {
  return nodeWhich.sync(command)
}

/**
 * Starts a timer used for measuring durations.
 *
 * @return A function that when called will return the elapsed duration in milliseconds.
 */
function startTimer(): () => number {
  const started = process.uptime()
  return () => Math.floor((process.uptime() - started) * 1000) // uptime gives us seconds
}

function userhome(...args: string[]): string {
  return userHome.apply(null, args)
}
const system: ISystem = { exec, run, spawn, which, startTimer, userhome }

export { system, ISystem }
