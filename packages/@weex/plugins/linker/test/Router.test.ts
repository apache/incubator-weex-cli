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
