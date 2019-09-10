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
