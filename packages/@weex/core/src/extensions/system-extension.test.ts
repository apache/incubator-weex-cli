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

import * as expect from 'expect'
import { Toolbox } from '../core/toolbox'
import create from './system-extension'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const toolbox = new Toolbox()
create(toolbox)
const system = toolbox.system

test('survives the factory function', () => {
  expect(system).toBeTruthy()
  expect(typeof system.run).toBe('function')
})

test('captures stdout', async () => {
  const stdout = await system.run(`ls ${__filename}`)
  expect(stdout).toBe(`${__filename}\n`)
})

test('captures stderr', async () => {
  expect.assertions(1)
  try {
    await system.run(`omgdontrunlol ${__filename}`)
  } catch (e) {
    expect(/not found/.test(e.stderr)).toBe(true)
  }
})

test('knows about which', () => {
  const npm = system.which('npm')
  expect(npm).toBeTruthy()
})

test('can spawn and capture results', async () => {
  const good = await system.spawn('echo hello')
  expect(good.status).toBe(0)
  expect(good.stdout.toString()).toBe('hello\n')
})

test('spawn deals with missing programs', async () => {
  const crap = await system.spawn('dfsjkajfkldasjklfajsd')
  expect(crap.error).toBeTruthy()
  expect(crap.output).toBeFalsy()
  expect(crap.status).toBe(null)
})

test('spawn deals exit codes', async () => {
  const crap = await system.spawn('npm')
  expect(crap.error).toBeFalsy()
  expect(crap.status).toBe(1)
})

test('start timer returns the number of milliseconds', async () => {
  const WAIT = 10

  const elapsed = system.startTimer() // start a timer
  await delay(WAIT) // simulate a delay
  const duration = elapsed() // how long was that?

  // due to rounding this can be before the timeout.
  expect(duration >= WAIT - 1).toBe(true)
})

test('get userpath', async () => {
  const userpath = system.userhome() // get path
  expect(typeof userpath).toBe('string')
})
