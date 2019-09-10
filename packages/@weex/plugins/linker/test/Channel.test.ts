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
import Channel from '../src/Channel'
import Message from '../src/Message'

describe('Channel should be worked', () => {
  let signalA = {
    hubId: 'AHubID',
    terminalId: uuid(),
    channelId: uuid()
  }
  let signalB = {
    hubId: 'BHubID',
    terminalId: uuid(),
    channelId: uuid()
  }

  test('hub join and leave', () => {
    let channel = new Channel()
    channel.join(signalA.hubId, signalA.terminalId)
    expect(channel.has(signalA.hubId, signalA.terminalId)).toBeTruthy()  
    expect(channel.getTerminal(signalA.hubId)).toEqual([signalA.terminalId])
    channel.leave(signalA.hubId, signalA.terminalId)
    expect(channel.has(signalA.hubId, signalA.terminalId)).toBeFalsy()   
    expect(channel.findAll()[0].hubId).toEqual(signalA.hubId)
  })

  test('message cache push and get', () => {
    let channel = new Channel()
    let message = new Message({}, signalA.hubId, signalA.terminalId, signalA.channelId)
    channel.join(signalA.hubId, signalA.terminalId)
    channel.join(signalB.hubId, signalB.terminalId)
    message.to(signalB.hubId, signalB.terminalId)
    message.to(signalA.hubId, signalA.terminalId)
    channel.pushCache(message)
    let cache = channel.getCache(signalB.hubId)
    expect(cache.length === 1).toBeTruthy()
    expect(cache[0]._from.hubId).toEqual(signalA.hubId)
    expect(cache[0]._from.terminalId).toEqual(signalA.terminalId)
    expect(cache[0]._to.length === 2).toBeTruthy()
    expect(cache[0].payload).toEqual({})
    expect(channel.findOthers(signalA.hubId, signalA.terminalId, signalB.hubId)[0].hubId).toEqual(signalB.hubId)
  }

})
