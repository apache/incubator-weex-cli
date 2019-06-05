import 'jest'
import * as uuid from 'uuid'
import * as sinon from 'sinon'
import Message from '../src/Message'
import Hub from '../src/Hub'
import Terminal from '../src/Terminal'
import Router from '../src/Router'

describe('Hub should be worked', () => {
  let HubA = 'hub.a'
  let HubB = 'hub.b'
  let signalA = {
    hubId: HubA,
    terminalId: uuid(),
    channelId: uuid(),
  }
  let onCallback = sinon.spy()
  let sendCallback = sinon.spy()
  let huba: Hub = new Hub(HubA)
  let socketA = {
    send: sendCallback,
    on: onCallback,
    // mock websocket status
    readyState: 1,
  }
  let terminalId = uuid()
  let router
  let terminal
  let routerName = 'Test'
  beforeAll(() => {
    router = new Router(routerName)
    router.link(huba)
    terminal = new Terminal.WebsocketTerminal(socketA)
    terminal.channelId = terminalId
  })

  test('property should be correct', () => {
    expect(huba.id).toEqual(HubA)
  })

  test('websocket terminal join should be work', () => {
    huba.join(terminal)
    expect(huba.router.id).toEqual(routerName)
    expect(onCallback.called).toBeTruthy()
    expect(onCallback.callCount).toEqual(5)
  })

  test('broadcast message', () => {
    let message = new Message({}, signalA.hubId, signalA.terminalId)
    huba.broadcast(message)
    expect(sendCallback.called).toBeTruthy()
    expect(sendCallback.callCount).toEqual(1)
  })

  test('pushToTerminal', () => {
    let message = new Message({}, signalA.hubId, signalA.terminalId)
    huba.pushToTerminal(terminal.id, message)
    expect(sendCallback.callCount).toEqual(2)
  })

  test('async send', async () => {
    let message = new Message({}, signalA.hubId, signalA.terminalId)
    let emitStub = sinon.stub(router, 'emit')
    try {
      await huba.send(message)
    } catch (e) {
      // expect return void()
      expect(typeof e).toMatch('undefined')
    }
    expect(emitStub.called).toBeTruthy()
  })

  test('filter', () => {
    expect(typeof huba.filter).toEqual('function')
  })
})
