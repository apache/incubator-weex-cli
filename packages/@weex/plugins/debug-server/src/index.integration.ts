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
    let testMehod = 'WMLDebug.test'
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
      if (message.method === 'WMLDebug.importAppJS') {
        expect(message.params.appId).toEqual(appID)
        expect(runtimeMessages.length === 4).toBeTruthy()
      }
    })
    nativeWS.on('open', () => {
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.registerDevice',
          params: {
            appId: appID,
            device: {},
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.initRuntimeWorker',
          params: {
            appId: appID,
            source: `
          self.__get_app_context__ = () => {};
          console.log('Im WMLDebug.initRuntimeWorker');`,
            bundleUrl: 'windmill.dsl.js',
            env: {},
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.initFrameworkApi',
          params: {
            appId: appID,
            source: `console.log('Im WMLDebug.initFrameworkApi')`,
            bundleUrl: 'windmill.module.api.js',
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.initAppFrameworkWorker',
          params: {
            appId: appID,
            source: `console.log('Im WMLDebug.initAppFrameworkWorker')`,
            bundleUrl: 'windmill.worker.js',
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.importAppJS',
          params: {
            appId: appID,
            source: `__postData__({method: '${testMehod}', params: {}})`,
            bundleUrl: 'app.js',
          },
        }),
      )
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

  test('sync call should be worked', async done => {
    let testData = 'syncCall'
    let testMehod = 'WMLDebug.test'
    let testCallbackData = 'syncreturn'
    let appID = 'VM'
    let runtimeMessages = []
    nativeWS = new WebSocket(devtoolServer.socket.native)
    runtimeWS = new WebSocket(devtoolServer.socket.runtime)
    devtoolServer.on('runtime.worker', message => {
      expect(typeof message.type).toEqual('number')
      if (message.type === Router.Event.MESSAGE_RECEIVED) {
        expect(message.data.channelId).toEqual(channelId)
        expect(message.data.payload.method).toEqual(testMehod)
        expect(message.data.payload.params).toEqual(testCallbackData)
        done()
      }
    })
    runtimeWS.on('message', message => {
      message = JSON.parse(message)
      runtimeMessages.push(message)
      if (message.method === 'WMLDebug.importAppJS') {
        expect(message.params.appId).toEqual(appID)
        expect(runtimeMessages.length === 4).toBeTruthy()
      }
    })
    nativeWS.on('open', () => {
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.registerDevice',
          params: {
            appId: appID,
            device: {},
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.initRuntimeWorker',
          params: {
            appId: appID,
            source: `
          self.__get_app_context__ = () => {};
          console.log('Im WMLDebug.initRuntimeWorker');`,
            bundleUrl: 'windmill.dsl.js',
            env: {},
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.initFrameworkApi',
          params: {
            appId: appID,
            source: `console.log('Im WMLDebug.initFrameworkApi')`,
            bundleUrl: 'windmill.module.api.js',
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.initAppFrameworkWorker',
          params: {
            appId: appID,
            source: `console.log('Im WMLDebug.initAppFrameworkWorker')`,
            bundleUrl: 'windmill.worker.js',
          },
        }),
      )
      nativeWS.send(
        JSON.stringify({
          method: 'WMLDebug.importAppJS',
          params: {
            appId: appID,
            source: `
          let result = self.__dispatch_message_sync__('${appID}', '${testData}')
          __postData__({method: '${testMehod}', params: result})
          `,
            bundleUrl: 'app.js',
          },
        }),
      )
    })
    nativeWS.on('message', message => {
      message = JSON.parse(message)
      if (message.method === 'WMLDebug.dispatchMessageSync') {
        expect(message.params.data).toEqual(testData)
        nativeWS.send(
          JSON.stringify({
            method: 'WMLDebug.receiveMessageSync',
            id: message.id,
            params: {
              data: testCallbackData,
            },
          }),
        )
      }
    })
  })
})
