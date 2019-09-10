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

import 'jest'
import IosBuilder from './ios-builder'
import { PLATFORM_TYPES } from '../common/const'
import TestHelp from '@weex-cli/utils/lib/test/test-help.js'

jest.setTimeout(30000)

describe('Test IOS', () => {
  const testHelp = new TestHelp(path.join(__dirname, '../../'))

  test('Ios build for simulator ', async () => {
    const iosBuilder = new IosBuilder({
      projectPath: testHelp.getTestConfigByKey('ios.projectPath'),
      type: PLATFORM_TYPES.ios,
    })
    let result

    try {
      result = await iosBuilder.run()
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(result && typeof result.appPath === 'string' && result.appPath)).toBe(true)
  })

  test('Ios build for build for real device ', async () => {
    const iosBuilder = new IosBuilder({
      projectPath: testHelp.getTestConfigByKey('ios.projectPath'),
      type: PLATFORM_TYPES.ios,
      isRealDevice: true,
    })
    let result

    try {
      result = await iosBuilder.run()
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(result && typeof result.appPath === 'string' && result.appPath)).toBe(true)
  })
})
