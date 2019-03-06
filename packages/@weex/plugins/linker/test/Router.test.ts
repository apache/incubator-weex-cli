import 'jest'
import * as uuid from 'uuid'
import Message from '../src/Message'
import Router from '../src/Router'

describe('Router should be worked', () => {
  let signalA = {
    hubId: 'AHubID',
    terminalId: uuid(),
    channelId: uuid(),
  }
  let signalB = {
    hubId: 'BHubID',
    terminalId: uuid(),
    channelId: uuid(),
  }
  let payload = {}

  let message = new Message(payload, signalA.hubId, signalA.terminalId, signalA.channelId)

  test('event should be correct', () => {
    expect(Router.Event.MESSAGE_RECEIVED).toEqual(2)
    expect(Router.Event.TERMINAL_LEAVED).toEqual(1)
    expect(Router.Event.TERMINAL_JOINED).toEqual(0)
  })
})
