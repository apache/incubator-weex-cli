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
import * as os from 'os'
import * as path from 'path'
import { split } from 'ramda'
import { Toolbox } from '../core/toolbox'
import createExtension from './fs-extension'

test('has the proper interface', () => {
  const toolbox = new Toolbox()
  createExtension(toolbox)
  const ext = toolbox.fs

  expect(ext).toBeTruthy()

  // a few dumb checks to ensure we're talking to jetpack
  expect(typeof ext.copy).toBe('function')
  expect(typeof ext.path).toBe('function')
  expect(typeof ext.subdirectories).toBe('function')
  expect(split('\n', ext.read(__filename))[0]).toBe(`import * as expect from 'expect'`)
  // the extra values we've added
  expect(ext.eol).toBe(os.EOL)
  expect(ext.separator).toBe(path.sep)
})
