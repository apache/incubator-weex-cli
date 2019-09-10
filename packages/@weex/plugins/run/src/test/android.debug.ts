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
// ts-node *.ts
const path = require('path')
const debug = require('debug')('run')

import 'jest'
import { AndroidRunner } from '../index'
import TestHelp from '@weex-cli/utils/lib/test/test-help.js'

async function android() {
  debug('Test run android')
  const testHelp = new TestHelp(path.join(__dirname, '../../'))

  const androidRunner = new AndroidRunner({
    jsBundleEntry: testHelp.getTestConfigByKey('jsBundleEntry'),
    projectPath: testHelp.getTestConfigByKey('android.projectPath'),
    deviceId: testHelp.getTestConfigByKey('android.deviceId'),
    applicationId: testHelp.getTestConfigByKey('android.applicationId'),
    jsBundleFolderPath: testHelp.getTestConfigByKey('jsBundleFolderPath'),
  })

  await androidRunner.run()

  // setTimeout(() => {
  //   debug('Will dispose')
  //   androidRunner.dispose()
  // }, 10000)
}

android().catch(e => {
  console.error('Test run android ERROR: ', e)
})
