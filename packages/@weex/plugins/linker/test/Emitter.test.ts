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
import Filter from '../src/Filter'
import Emitter from '../src/Emitter'

describe('Emitter should be worked', () => {
  let emitter

  beforeEach(() => {
    emitter = new Emitter()
  })

  test('property should be correct', () => {
    expect(typeof emitter.on).toEqual('function')
    expect(typeof emitter.off).toEqual('function')
    expect(typeof emitter.emit).toEqual('function')
    expect(typeof emitter.broadcast).toEqual('function')
  })

  test('testing on and emit method without namespace', () => {
    let events = 'test'
    let handler = sinon.spy()
    let data = { test: 'test' }
    emitter.on(events, handler)
    emitter.emit(events, data)
    expect(handler.called).toBeTruthy()
    expect(handler.args[0][0]).toEqual(data)
  })

  test('testing on and emit method with namespace', () => {
    let events = 'test'
    let handler = sinon.spy()
    let data = { test: 'test' }
    let namespace = 'testspace'
    emitter.on(events, namespace, handler)
    emitter.emit(events, namespace, data)
    expect(handler.called).toBeTruthy()
    expect(handler.args[0][0]).toEqual(data)
  })

  test('testing off method without namespace', () => {
    let events = 'test'
    let handler = sinon.spy()
    let data = { test: 'test' }
    emitter.on(events, handler)
    emitter.off(events)
    emitter.emit(events, data)
    expect(handler.called).toBeFalsy()
  })

  test('testing off method with namespace', () => {
    let events = 'test'
    let namespace = 'testspace'
    let handlerA = sinon.spy()
    let handlerB = sinon.spy()
    let data = { test: 'test' }
    emitter.on(events, handlerA)
    emitter.off(events, namespace)
    emitter.emit(events, data)
    expect(handlerA.called).toBeTruthy()
    expect(handlerA.args[0][0]).toEqual(data)
    emitter.on(events, namespace, handlerB)
    emitter.off(events, namespace)
    emitter.emit(events, namespace, data)
    expect(handlerB.called).toBeFalsy()
  })

  test('testing broadcast method with namespace', () => {
    let events = 'test'
    let namespaceA = 'Aspace'
    let namespaceB = 'Bspace'
    let handlerA = sinon.spy()
    let handlerB = sinon.spy()
    let handlerC = sinon.spy()
    let data = { test: 'test' }
    emitter.on(events, namespaceA, handlerA)
    emitter.on(events, namespaceA, handlerB)
    emitter.on(events, namespaceB, handlerC)
    emitter.broadcast(events, namespaceA, data)
    expect(handlerA.called).toBeTruthy()
    expect(handlerB.called).toBeTruthy()
    expect(handlerC.called).toBeFalsy()
    expect(handlerA.args[0][0]).toEqual(data)
    expect(handlerB.args[0][0]).toEqual(data)
  })

  test('testing broadcast method with the same main namespace', () => {
    let events = 'test'
    let namespaceA = 'space'
    let namespaceB = 'space'
    let namespaceC = 'space'
    let handlerA = sinon.spy()
    let handlerB = sinon.spy()
    let handlerC = sinon.spy()
    let data = { test: 'test' }
    emitter.on(events, namespaceA, handlerA)
    emitter.on(events, namespaceB, handlerB)
    emitter.on(events, namespaceC, handlerC)
    emitter.broadcast(events, namespaceA, data)
    expect(handlerA.called).toBeTruthy()
    expect(handlerB.called).toBeTruthy()
    expect(handlerC.called).toBeTruthy()
    expect(handlerA.args[0][0]).toEqual(data)
    expect(handlerB.args[0][0]).toEqual(data)
    expect(handlerC.args[0][0]).toEqual(data)
  })

  test('testing broadcast method without namespace', () => {
    let events = 'test'
    let namespaceA = 'Aspace'
    let handlerA = sinon.spy()
    let handlerB = sinon.spy()
    let handlerC = sinon.spy()
    let data = { test: 'test' }
    emitter.on(events, namespaceA, handlerA)
    emitter.on(events, handlerB)
    emitter.on(events, handlerC)
    emitter.broadcast(events, data)
    expect(handlerA.called).toBeTruthy()
    expect(handlerB.called).toBeTruthy()
    expect(handlerC.called).toBeTruthy()
  })
})
