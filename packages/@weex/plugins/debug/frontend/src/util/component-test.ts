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
import Vue, { Component } from 'vue'
import { SinonSpy } from 'sinon'
import merge from 'lodash.merge'
import { ILogger } from './log'

export interface IComponents {
  [key: string]: Component
}

export class ComponentTest {

  public vm: Vue

  constructor (private template: string, private components: IComponents) {
  }

  public createComponent (createOptions?: any): void {
    let options = {
      template: this.template,
      components: this.components
    }
    if (createOptions) merge(options, createOptions)
    this.vm = new Vue(options).$mount()
  }

  public async execute (callback: (vm: Vue) => Promise<void> | void): Promise<void> {
    await Vue.nextTick()
    await callback(this.vm)
  }

}

export class MockLogger implements ILogger {

  constructor (private loggerSpy: SinonSpy) {
  }

  info (msg: any) {
    this.loggerSpy(msg)
  }

  warn (msg: any) {
    this.loggerSpy(msg)
  }

  error (msg: any) {
    this.loggerSpy(msg)
  }
}
