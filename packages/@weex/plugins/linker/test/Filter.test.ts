import 'jest'
import * as sinon from 'sinon'
import * as uuid from 'uuid'
import Filter from '../src/Filter'
import Message from '../src/Message'

describe('Filter should be worked', () => {
  let HubA = 'hub.a'
  let signalA = {
    hubId: HubA,
    terminalId: uuid(),
    channelId: uuid(),
  }
  let filter: Filter
  let handler = sinon.spy()
  let codition = sinon.fake.returns(true)
  beforeEach(() => {
    filter = new Filter(handler, codition)
  })

  test('property should be correct', () => {
    expect(typeof filter.when).toEqual('function')
    expect(typeof filter.run).toEqual('function')
  })

  test('testing when method', async () => {
    let message = new Message({}, signalA.hubId, signalA.terminalId)
    filter.when(codition)

    await filter.run(message)
    expect(codition.called).toBeTruthy()
    expect(handler.called).toBeTruthy()
  })
})
