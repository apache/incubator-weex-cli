import 'jest'
import * as uuid from 'uuid'
import * as sinon from 'sinon'
import Message from '../src/Message'
import Hub from '../src/Hub'
import Router from '../src/Router'
import Handler from '../src/Handler'

describe('Handler should be worked', () => {
  let HubA = 'hub.a'
  let handler
  let router
  let huba: Hub = new Hub(HubA)
  let mockHandler = sinon.spy()
  let routerName = 'Test'
  let signalA = {
    hubId: HubA,
    terminalId: uuid(),
    channelId: uuid(),
  }
  beforeAll(() => {
    router = new Router(routerName)
    router.link(huba)
    handler = new Handler(mockHandler, router)
  })

  test('static function should be exist', () => {
    expect(typeof Handler.run).toEqual('function')
  })

  test('public function should be exist', () => {
    expect(typeof handler.at).toEqual('function')
    expect(typeof handler.when).toEqual('function')
    expect(typeof handler.test).toEqual('function')
    expect(typeof handler.run).toEqual('function')
  })

  test('testing at function', () => {
    expect(handler.at(HubA) instanceof Handler).toBeTruthy()
  })

  test('testing when function', () => {
    expect(handler.when(HubA) instanceof Handler).toBeTruthy()
  })

  test('testing test function', () => {
    handler.when('message.payload.test === "test"')
    let message = new Message({ test: 'test' }, signalA.hubId, signalA.terminalId)
    expect(handler.test(message)).toBeTruthy()
  })

  test('testing run function', () => {
    handler.when('message.payload.test === "test"')
    let message = new Message({ test: 'test' }, signalA.hubId, signalA.terminalId)
    handler.run(message)
    expect(mockHandler.called).toBeTruthy()
  })
})
