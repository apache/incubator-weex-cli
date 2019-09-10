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
