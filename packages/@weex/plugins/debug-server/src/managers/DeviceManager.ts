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
import { EventEmitter } from 'events'

export default class DeviceManager extends EventEmitter {
  private deviceMap: any = {}

  constructor() {
    super()
  }

  registerDevice(device, channelId) {
    const existed = this.deviceMap[channelId]
    if (existed) {
      for (let i = existed.length - 1; i >= 0; i--) {
        if (existed[i].deviceId === device.deviceId) {
          clearTimeout(existed.timer)
          // this.deviceMap[channelId].splice(i,1,device)
          return device
        }
      }
      this.deviceMap[channelId].unshift(device)
      return device
    } else {
      device.channelId = channelId
      this.deviceMap[channelId] = [device]
      return device
    }
  }

  removeDevice(channelId, callback) {
    const device = this.deviceMap[channelId]
    if (device && device.length > 0) {
      clearTimeout(device.timer)
      device.timer = setTimeout(() => {
        this.deviceMap[channelId].pop()
        if (this.deviceMap[channelId] && this.deviceMap[channelId].length === 0) {
          callback()
        }
      }, 5000)
    }
    return device
  }

  getDevice(channelId) {
    const device = this.deviceMap[channelId]
    return device && device[device.length - 1]
  }

  getDeviceList() {
    return Object.keys(this.deviceMap).map(key => this.deviceMap[key])
  }
}

export const Device = new DeviceManager()
