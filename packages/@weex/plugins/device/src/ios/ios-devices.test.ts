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
const path = require('path')

import 'jest'
import IosDevice from './ios-devices'
import * as platform from '@weex-cli/utils/lib/platform/platform.js'
import { messageType } from '@weex-cli/utils/lib/process/process.js'

jest.setTimeout(60000)

describe('Test IOS', () => {
  if (!platform.isMacOS) {
    return
  }
  const iosDevices = new IosDevice()
  const iosDeviceList = iosDevices.getList()

  debug(iosDeviceList)
  test('Run ios simulator', async () => {
    let firstSimulator = null

    iosDeviceList.some(info => {
      if (info.isSimulator) {
        firstSimulator = info
        return true
      }
      return false
    })

    if (!firstSimulator) {
      return
    }

    iosDevices.on(messageType.outputError, event => {
      debug('OUTPUT_ERROR:', event)
    })

    iosDevices.on(messageType.outputLog, event => {
      debug('OUTPUT_LOG:', event)
    })

    try {
      await iosDevices.run({
        id: firstSimulator.id,
        appPath: path.join(__dirname, '../../test/ios-mock/Debug-iphonesimulator/WeexDemo99.app'),
        applicationId: 'com.alibaba.weex',
      })
    } catch (e) {
      expect(e.toString()).toMatch(/Instll app fail/)
    }

    try {
      await iosDevices.run({
        id: firstSimulator.id,
        appPath: path.join(__dirname, '../../test/ios-mock/Debug-iphonesimulator/WeexDemo.app'),
        applicationId: 'com.alibaba.weex',
      })
    } catch (e) {
      debug('Run ios simulator fail', e.toString().slice(0, 50))
    }
  })

  test('Run ios device', async () => {
    let firstDevice = null

    iosDeviceList.some(info => {
      if (!info.isSimulator) {
        firstDevice = info
        return true
      }
      return false
    })

    if (!firstDevice) {
      return
    }

    try {
      await iosDevices.run({
        id: firstDevice.id,
        appPath: path.join(__dirname, './ios-mock/Debug-iphonesimulator/WeexDemo.app'),
        applicationId: 'com.alibaba.weex',
      })
    } catch (e) {
      debug('Run ios device fail', e.toString().slice(0, 50))
    }
  })
})
