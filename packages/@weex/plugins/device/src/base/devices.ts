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
const debug = require('debug')('device')

import * as EventEmitter from 'events'
import { MOBILE_TYPES } from '../common/const'
import { DeviceInfo, RunDeviceOptions, messageType } from '../common/device'

export class Devices extends EventEmitter {
  static TYPES = MOBILE_TYPES
  public type: string
  public list: Array<DeviceInfo> = []

  constructor(options: { type: MOBILE_TYPES }) {
    super()
    this.type = options.type
    this.on('error', e => {
      // To prevent the collapse
      this.emit(messageType.outputError, e)
    })
    this.checkEnv()
  }

  protected checkEnv() {
    // Do nothing
  }

  public updateList() {
    console.error('Not define `updateList`')
  }

  getList() {
    return this.list
  }

  add(info: DeviceInfo) {
    this.list.push(info)
  }

  concat(list: Array<DeviceInfo>) {
    this.list = this.list.concat(list)
  }

  getDeviceById(id: DeviceInfo['id']): DeviceInfo | null {
    let result = null
    debug(this.list)
    this.list.some(device => {
      if (device.id === id) {
        result = device
        return true
      }
      return false
    })

    return result
  }

  launchById(id: DeviceInfo['id']) {
    console.error('Not define `launchById`')
  }

  run(options: RunDeviceOptions) {
    console.error('Not define `runAppById`')
  }
}
