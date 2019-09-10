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
