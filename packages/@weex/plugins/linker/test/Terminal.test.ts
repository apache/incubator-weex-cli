import 'jest'
import * as uuid from 'uuid'
import * as sinon from 'sinon'
import Message from '../src/Message'
import Hub from '../src/Hub'
import Terminal from '../src/Terminal'
import Router from '../src/Router'

describe('Terminal should be worked', () => {
  let onCallbackA = sinon.spy()
  let sendCallbackA = sinon.spy()
  let onCallbackB = sinon.spy()
  let sendCallbackB = sinon.spy()
  let socketA = {
    send: sendCallbackA,
    on: onCallbackA,
    // mock websocket status
    readyState: 1,
  }
  let socketB = {
    send: sendCallbackB,
    on: onCallbackB,
    // mock websocket status
    readyState: 1,
  }
  let websocketTerminal
  let syncTerminal
  let routerName = 'Test'

  beforeAll(() => {
    websocketTerminal = new Terminal.WebsocketTerminal(socketA)
  })

  beforeEach(() => {
    syncTerminal = new Terminal.SyncTerminal()
  })

  test('websocketTerminal should be correct', () => {
    expect(onCallbackA.callCount).toEqual(5)
    expect(typeof websocketTerminal.read).toEqual('function')
  })

  test('syncTerminal should be correct', () => {
    expect(typeof syncTerminal.read).toEqual('function')
    expect(typeof syncTerminal.send).toEqual('function')
  })

  test('syncTerminal send can be worked', async () => {
    const sendMessage = {
      params: {
        syncId: 1,
      },
    }

    let response = syncTerminal.send(sendMessage)
    expect(response instanceof Promise).toBeTruthy()
  })

  test('syncTerminal read can be worked', () => {
    const sendMessage = {
      params: {
        syncId: 2,
      },
    }

    const readMessage = {
      id: 2,
    }

    syncTerminal.send(sendMessage).then(data => {
      expect(data).toEqual(readMessage)
    })
    syncTerminal.read(readMessage)
  })
})
