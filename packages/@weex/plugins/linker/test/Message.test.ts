import 'jest'
import * as uuid from 'uuid'
import Message from '../src/Message'

describe('Message should be worked', () => {
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

  test('content should be correct', () => {
    expect(message.payload).toEqual(payload)
    expect(message._from.hubId).toEqual(signalA.hubId)
    expect(message._from.terminalId).toEqual(signalA.terminalId)
  })

  test('match', () => {
    expect(message.match(signalA.hubId)).toBeTruthy()
  })

  test('reply', () => {
    message.reply()
    expect(message._to.length === 1).toBeTruthy()
    expect(message._to[0].hubId).toEqual(signalA.hubId)
    expect(message._to[0].terminalId).toEqual(signalA.terminalId)
  })

  test('to', () => {
    message.to(signalB.hubId, signalB.terminalId)
    expect(message._to.length === 2).toBeTruthy()
    expect(message._to[1].hubId).toEqual(signalB.hubId)
    expect(message._to[1].terminalId).toEqual(signalB.terminalId)
  })

  test('discard', () => {
    message.discard()
    expect(message.isAlive()).toBeFalsy()
  })

  test('route', () => {
    message.route()
    expect(message.destination.length === 2).toBeTruthy()
  })

  test('selectOne', () => {
    let selected = message.selectOne(signalB)
    expect(selected.payload).toEqual(payload)
    expect(selected._to[0].hubId).toEqual(signalB.hubId)
    expect(selected._to[0].terminalId).toEqual(signalB.terminalId)
  })
})
