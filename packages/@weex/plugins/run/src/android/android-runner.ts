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
import Runner from '../base/runner'
import { RunnerConfig } from '../common/runner'
import { AndroidBuilder } from '@weex-cli/build'
import { AndroidDevices } from '@weex-cli/device'
import CONFIG from '../common/config'
import { PLATFORM_TYPES } from '../common/const'
import * as DEBUG from 'debug'

const debug = DEBUG('run')
export default class AndroidRunner extends Runner {
  protected config: RunnerConfig

  constructor(options: RunnerConfig) {
    super(options, PLATFORM_TYPES.android)
  }

  async setNativeConfig() {
    const config = this.config

    CONFIG[this.type].resolve(
      Object.assign(
        {
          platform: PLATFORM_TYPES.android,
          // Some special config
        },
        config.nativeConfig,
      ),
      config.projectPath,
    )
  }

  async buildNative(options: any = {}) {
    const config = this.config
    const androidBuilder = new AndroidBuilder({
      projectPath: config.projectPath,
    })
    this.transmitEvent(androidBuilder)
    const { appPath } = await androidBuilder.run(
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
    const wsServer = this.wsServer
    const serverInfo = wsServer.getServerInfo()
    const androidDevice = new AndroidDevices()
    this.transmitEvent(androidDevice)
    await androidDevice.run({
      id: config.deviceId,
      applicationId: config.applicationId,
      appPath,
      androidShellCmdString: `-d ${this.stringifyConfigs({ Ws: `ws://${serverInfo.hostname}:${serverInfo.port}` })}`,
    })
  }

  private stringifyConfigs(configs) {
    let str = "'{"
    for (const key in configs) {
      if (configs.hasOwnProperty(key)) {
        str += '\\"'
        str += key
        str += '\\":'
        str += '\\"'
        str += configs[key]
        str += '\\",'
      }
    }
    str = str.slice(0, -1)
    str += "}'"
    return str
  }
}
