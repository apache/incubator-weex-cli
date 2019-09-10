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

export interface ISystem {
  /**
   * Executes a command via execa.
   */
  exec(command: string, options?: any): Promise<any>
  /**
   * Runs a commmand and returns stdout as a trimmed string.
   */
  run(command: string, options?: any): Promise<string>
  /**
   * Spawns a command via crosspawn.
   */
  spawn(command: string, options?: any): Promise<any>
  /**
   * Uses node-which to find out where the command lines.
   */
  which(command: string): string | void
  /**
   * Uses userhome tu return userpath
   */
  userhome(...args: string[]): string
  /**
   * Returns a timer function that starts from this moment. Calling
   * this function will return the number of milliseconds from when
   * it was started.
   */
  startTimer(): ITimer
}

/**
 * Returns the number of milliseconds from when the timer started.
 */
export type ITimer = () => number
