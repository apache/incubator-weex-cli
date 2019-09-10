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
// const debug = require('debug')('device')
const path = require('path')
const debug = require('debug')('device')
import 'jest'
import { messageType } from '@weex-cli/utils/lib/process/process.js'

jest.setTimeout(90000)

import AndroidDevice from './android-devices'

describe('Test android', () => {
  const androidDevice = new AndroidDevice()
  const deviceList = androidDevice.getList()

  debug('deviceList', deviceList)
  // TODO mock
  test('Run android simulator', async () => {
    let firstDevice
    deviceList.some(info => {
      if (info.isSimulator) {
        firstDevice = info
        return true
      }
      return false
    })

    // androidDevice.on(messageType.outputError, event => {
    //   debug('OUTPUT_ERROR:', event)
    // })

    // androidDevice.on(messageType.outputLog, event => {
    //   debug('OUTPUT_LOG:', event)
    // })

    await androidDevice.run({
      id: firstDevice.id,
      applicationId: `com.weex.app`,
      appPath: path.join(__dirname, '../../test/android-mock/weex-app.apk'),
      androidShellCmdString: '',
    })
  })
})
