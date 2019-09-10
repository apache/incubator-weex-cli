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
const path = require('path')

import { exec, runAndGetOutput } from '@weex-cli/utils/lib/process/process.js'
import { Devices } from '../base/devices'
import { DeviceInfo, RunDeviceOptions } from '../common/device'

export default class IosDevices extends Devices {
  constructor() {
    super({ type: Devices.TYPES.ios })
    this.updateList()
  }

  public updateList() {
    this.list = []
    this.concat(this.getIosDevicesList())
  }

  private getIosDevicesList(): Array<DeviceInfo> {
    // Doctor TODO `xcrun`
    const text = runAndGetOutput('xcrun instruments -s devices')
    const devices = []
    const REG_DEVICE = /(.*?) \((.*?)\) \[(.*?)]/

    const lines = text.split('\n')
    for (const line of lines) {
      const lineToLower = line.toLowerCase()
      if (
        lineToLower.indexOf('macbook') >= 0 ||
        lineToLower.indexOf('watch') >= 0 ||
        lineToLower.indexOf('tv') >= 0 ||
        lineToLower.indexOf('ipad') >= 0
      ) {
        continue
      }
      const device = line.match(REG_DEVICE)
      if (device !== null) {
        const name = device[1]
        const version = device[2]
        const id = device[3]
        const isSimulator = line.indexOf('Simulator') >= 0 || id.indexOf('-') >= 0
        devices.push({ name, version, id, isSimulator })
      }
    }

    return devices
  }

  async launchById(id: DeviceInfo['id']): Promise<String> {
    try {
      await exec(`xcrun instruments -w ${id}`, {
        event: this,
      })
    } catch (error) {
      if (error) {
        if (
          error.toString().indexOf('Waiting for device') !== -1 ||
          error.toString().indexOf('No template (-t) specified') !== -1 ||
          error.toString().indexOf('Could not create output document') !== -1
        ) {
          // instruments always fail with 255 because it expects more arguments,
          // but we want it to only launch the simulator
          return
        }
        throw error
      }
    }
  }

  async run(options: RunDeviceOptions) {
    const deviceInfo = this.getDeviceById(options.id)

    if (!deviceInfo) {
      throw new Error(`Not find device ${options.id}`)
    }
    try {
      await this.launchById(options.id)
    } catch (e) {
      throw new Error(`Launch fail ${options.id} : ${e.toString()}`)
    }

    if (deviceInfo.isSimulator) {
      try {
        await exec(`xcrun simctl install ${options.id} ${options.appPath}`, {
          event: this,
        })
      } catch (e) {
        throw new Error(`Instll app fail : ${e.toString()}`)
      }
      if (options.applicationId) {
        try {
          await exec(`xcrun simctl launch ${options.id} ${options.applicationId}`, {
            event: this,
          })
        } catch (e) {
          throw new Error(`launch app fail : ${e.toString()}`)
        }
      }
    } else {
      // Build to iphone the xxx.app must signed
      const iosDeployPath = path.join(__dirname, '../../node_modules/ios-deploy/build/Release/ios-deploy')
      await exec(`${iosDeployPath} --justlaunch --debug --id ${options.id} --bundle ${options.appPath}`, {
        event: this,
      })
    }
  }
}
