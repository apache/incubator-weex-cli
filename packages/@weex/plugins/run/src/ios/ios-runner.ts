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
import { IosBuilder } from '@weex-cli/build'
import { IosDevices } from '@weex-cli/device'
import Runner from '../base/runner'
import { RunnerConfig } from '../common/runner'
import ConfigResolver from '../common/config'
import { PLATFORM_TYPES } from '../common/const'
import * as DEBUG from 'debug'

const debug = DEBUG('run')
export default class IosRunner extends Runner {
  protected config: RunnerConfig

  constructor(options: RunnerConfig) {
    super(options, PLATFORM_TYPES.ios)
  }

  async setNativeConfig() {
    const config = this.config
    const wsServer = this.wsServer
    const serverInfo = wsServer.getServerInfo()
    ConfigResolver[this.type].resolve(
      Object.assign(
        {
          Ws: `ws://${serverInfo.hostname}:${serverInfo.port}`,
          port: serverInfo.port,
          ip: serverInfo.hostname,
          platform: PLATFORM_TYPES.ios,
        },
        config.nativeConfig,
      ),
      config.projectPath,
    )
  }

  async buildNative(options: any = {}) {
    const config = this.config

    const iosBuilder = new IosBuilder({
      projectPath: config.projectPath,
      preCmds: ['pod update'],
    })
    this.transmitEvent(iosBuilder)
    const { appPath } = await iosBuilder.run(
      Object.assign(
        {
          onOutCallback: outString => {
            debug('BUILD OUTPUT:', outString)
          },
          onErrorCallback: outString => {
            debug('BUILD ERROR:', outString)
          },
        },
        options,
      ),
    )
    return appPath
  }

  async installAndLaunchApp(appPath) {
    const config = this.config
    const iosDevice = new IosDevices()
    this.transmitEvent(iosDevice)
    await iosDevice.run({
      id: config.deviceId,
      applicationId: config.applicationId,
      appPath,
    })
  }
}
