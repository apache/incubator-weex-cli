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
import * as http from 'http'
import { Toolbox } from '../core/toolbox'
import createExtension from './http-extension'

const toolbox = new Toolbox()
createExtension(toolbox)
const ext = toolbox.http

/**
 * Sends a HTTP response.
 *
 * @param res - The http response object.
 * @param statusCode - The http response status code.
 * @param body - The reponse data.
 */
const sendResponse = (res: any, statusCode: number, body: string) => {
  res.writeHead(statusCode)
  res.write(body)
  res.end()
}

/**
 * Sends a 200 OK with some data.
 *
 * @param res - The http response object.
 * @param body - The http response data.
 */
const send200 = (res: any, body?: string) => {
  sendResponse(res, 200, body || '<h1>OK</h1>')
}

test('has the proper interface', () => {
  expect(ext).toBeTruthy()
  expect(typeof ext.create).toBe('function')
})

test('connects to a server', async () => {
  const server = http.createServer((req, res) => {
    send200(res, 'hi')
  })
  server.listen()
  const port = server.address()['port']
  const api = ext.create({
    baseURL: `http://127.0.0.1:${port}`,
  })
  const response = await api.get('/')
  expect(response.data).toBe('hi')
})
