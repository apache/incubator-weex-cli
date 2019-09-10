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
import { start } from './index'
import * as ip from 'ip'
import * as uuid from 'uuid'
import * as puppeteer from 'puppeteer'
import * as WebSocket from 'ws'
import { Router } from '@weex-cli/linker'

let devtoolServer
const channelId = uuid()
const port = '8077'
const remoteDebugPort = '9248'
let browser = null
let nativeWS = null
let runtimeWS = null
describe('JSDebug can be worked', () => {
  // set jest timeout to very long, because these take a while
  beforeAll(() => jest.setTimeout(5 * 1000))
  // reset back
  afterAll(() => {
    jest.setTimeout(5 * 1000)
    devtoolServer.close()
    nativeWS.close()
    runtimeWS.close()
    browser.close()
  })

  test('create devtool server', async done => {
    devtoolServer = await start({
      ip: ip.address(),
      port: port,
      remoteDebugPort: remoteDebugPort,
      channelId: channelId,
    })
    expect(typeof devtoolServer.on).toEqual('function')
    expect(typeof devtoolServer.close).toEqual('function')
    expect(Object.keys(devtoolServer.socket).length === 5).toBeTruthy()
    expect(typeof devtoolServer.runtime).toEqual('string')
    done()
  })

  test('prepare for debug', async done => {
    let page
    browser = await puppeteer.launch({
      args: [`--remote-debugging-port=${remoteDebugPort}`, `--disable-gpu`, `--no-sandbox`],
    })
    page = await browser.newPage()
    await page.setUserAgent(
      '5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    )
    await page.goto(`http://${ip.address()}:${port}/runtime.html?channelId=${channelId}`)
    done()
  })

  test('debug process should be worked', async done => {
    let testMehod = 'WxDebug.test'
    let appID = 'VM'
    let runtimeMessages = []
    nativeWS = new WebSocket(devtoolServer.socket.native)
    runtimeWS = new WebSocket(devtoolServer.socket.runtime)
    devtoolServer.on('runtime.worker', message => {
      expect(typeof message.type).toEqual('number')
      if (message.type === Router.Event.MESSAGE_RECEIVED) {
        expect(message.data.channelId).toEqual(channelId)
        expect(message.data.payload.method).toEqual(testMehod)
        done()
      }
    })
    runtimeWS.on('message', message => {
      message = JSON.parse(message)
      runtimeMessages.push(message)
      if (message.method === 'WxDebug.callJS' && message.params.method === 'importScript') {
        expect(message.params.args[0]).toEqual(appID)
        expect(runtimeMessages.length).toEqual(3)
      }
    })
    nativeWS.on('open', () => {
      nativeWS.send(
        JSON.stringify({
          method: 'WxDebug.registerDevice',
          params: {
            appId: appID,
            device: {},
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WxDebug.initJSRuntime',
          params: {
            env: {
              WXEnvironment: {},
            },
            source: `
          self.createInstanceContext = () => {};
          console.log('Im WxDebug.initJSRuntime');`,
            bundleUrl: 'js-framework.js',
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WxDebug.callJS',
          params: {
            method: 'createInstanceContext',
            args: [appID, {}, '', null],
          },
        }),
      )
      setTimeout(() => {
        nativeWS.send(
          JSON.stringify({
            method: 'WxDebug.callJS',
            params: {
              method: 'importScript',
              args: [
                appID,
                `__postmessage__({method: '${testMehod}', params: {}})`,
                {
                  bundleUrl: 'app.js',
                },
              ],
            },
          }),
        )
      }, 1000)
    })
  })
})

describe('SyncCall can be worked', () => {
  // set jest timeout to very long, because these take a while
  beforeAll(() => jest.setTimeout(5 * 1000))
  // reset back
  afterAll(done => {
    nativeWS.close()
    runtimeWS.close()
    browser.close()
    devtoolServer.close()
  })

  test('create devtool server', async done => {
    devtoolServer = await start({
      ip: ip.address(),
      port: port,
      remoteDebugPort: remoteDebugPort,
      channelId: channelId,
    })
    expect(typeof devtoolServer.on).toEqual('function')
    expect(typeof devtoolServer.close).toEqual('function')
    expect(Object.keys(devtoolServer.socket).length === 5).toBeTruthy()
    expect(typeof devtoolServer.runtime).toEqual('string')
    done()
  })

  test('prepare for sync call', async done => {
    let page
    browser = await puppeteer.launch({
      args: [`--remote-debugging-port=${remoteDebugPort}`, `--disable-gpu`, `--no-sandbox`, `--no-sandbox`],
    })
    page = await browser.newPage()
    await page.setUserAgent(
      '5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    )
    await page.goto(`http://${ip.address()}:${port}/runtime.html?channelId=${channelId}`)
    done()
  })

  // test('sync call should be worked', async done => {
  //   let testMehod = 'WxDebug.test'
  //   let testCallbackData = 'syncreturn'
  //   let appID = 'VM'
  //   let runtimeMessages = []
  //   nativeWS = new WebSocket(devtoolServer.socket.native)
  //   runtimeWS = new WebSocket(devtoolServer.socket.runtime)
  //   devtoolServer.on('runtime.worker', message => {
  //     expect(typeof message.type).toEqual('number')
  //     if (message.type === Router.Event.MESSAGE_RECEIVED) {
  //       expect(message.data.channelId).toEqual(channelId)
  //       expect(message.data.payload.method).toEqual(testMehod)
  //       expect(message.data.payload.params).toEqual(testCallbackData)
  //       done()
  //     }
  //   })
  //   runtimeWS.on('message', message => {
  //     message = JSON.parse(message)
  //     runtimeMessages.push(message)
  //     if (message.params.method === 'WxDebug.importAppJS') {
  //       expect(message.params.args[0]).toEqual(appID)
  //       expect(runtimeMessages.length === 4).toBeTruthy()
  //     }
  //   })
  //   nativeWS.on('open', () => {
  //     nativeWS.send(
  //       JSON.stringify({
  //         method: 'WxDebug.registerDevice',
  //         params: {
  //           appId: appID,
  //           device: {},
  //         },
  //       }),
  //     )
  //     nativeWS.send(
  //       JSON.stringify({
  //         method: 'WxDebug.initJSRuntime',
  //         params: {
  //           env: {
  //             WXEnvironment: {},
  //           },
  //           source: `
  //           self.createInstanceContext = () => {};
  //         console.log('Im WxDebug.initJSRuntime');`,
  //           bundleUrl: 'js-framework.js',
  //         },
  //       }),
  //     )
  //     nativeWS.send(
  //       JSON.stringify({
  //         method: 'WxDebug.callJS',
  //         params: {
  //           method: 'createInstanceContext',
  //           args: [appID, {}, '', null],
  //         },
  //       }),
  //     )
  //     setTimeout(() => {
  //       nativeWS.send(
  //         JSON.stringify({
  //           method: 'WxDebug.callJS',
  //           params: {
  //             method: 'importScript',
  //             args: [
  //               appID,
  //               `let result = self.callNativeModule('${appID}');
  //             __postData__({method: '${testMehod}', params: result});
  //             `,
  //               {
  //                 bundleUrl: 'app.js',
  //               },
  //             ],
  //           },
  //         }),
  //       )
  //     }, 1000)
  //   })
  //   nativeWS.on('message', message => {
  //     message = JSON.parse(message)
  //     if (message.method === 'WxDebug.syncCall') {
  //       expect(message.params.method).toEqual('callNativeModule')
  //       nativeWS.send(
  //         JSON.stringify({
  //           method: 'WxDebug.syncReturn',
  //           id: message.id,
  //           params: {
  //             ret: testCallbackData,
  //           },
  //         }),
  //       )
  //     }
  //   })
  // })
})
