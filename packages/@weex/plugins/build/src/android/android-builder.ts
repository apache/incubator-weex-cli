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
const fs = require('fs')
const path = require('path')

import { exec } from '@weex-cli/utils/lib/process/process.js'
import { isWindows } from '@weex-cli/utils/lib/platform/platform.js'
import AndroidEnv from '@weex-cli/utils/lib/android/android-env.js'
import Builder from '../base/builder'
import { AndroidBuilderConfig, RunOptions } from '../common/builder'
import { ANDROID_NOT_FIND_APK_PATH } from '../common/error-list'
import { PLATFORM_TYPES } from '../common/const'

export default class AndroidBuilder extends Builder {
  protected config: AndroidBuilderConfig

  constructor(options: AndroidBuilderConfig) {
    super(options, PLATFORM_TYPES.android)
  }

  private createLocalProperties() {
    const projectPath = this.config.projectPath
    const filePath = path.join(projectPath, 'local.properties')

    if (fs.existsSync(filePath)) {
      return
    }
    const androidEnv = new AndroidEnv()
    const sdkPath = androidEnv.getSdkPath()
    fs.writeFileSync(filePath, `sdk.dir=${sdkPath.replace(/\\/g, '\\\\')}`)
  }

  private getFolderFirstApk(folderPath) {
    let apkPath = null
    let temp

    try {
      temp = fs.readdirSync(folderPath)
    } catch (e) {
      temp = []
    }
    (temp || []).some(thePath => {
      const match = thePath.match(/\S+.apk/)
      if (match && match[0]) {
        apkPath = path.join(folderPath, match[0])
        return true
      }
    })

    return apkPath
  }

  private getApkPath(): string {
    const projectPath = this.config.projectPath
    let apkPath = this.config.apkPath || null

    if (apkPath) {
      return apkPath
    }
    apkPath = this.getFolderFirstApk(path.join(projectPath, 'app/build/outputs/apk/'))
    if (apkPath) {
      return apkPath
    }
    apkPath = this.getFolderFirstApk(path.join(projectPath, 'app/build/outputs/apk/debug/'))
    if (apkPath) {
      return apkPath
    } else {
      throw ANDROID_NOT_FIND_APK_PATH
    }
  }

  async run(options?: RunOptions): Promise<{ appPath: string }> {
    this.createLocalProperties()
    await this.doPreCmds()
    await exec(
      isWindows ? `call gradlew.bat clean assembleDebug` : `./gradlew clean assembleDebug`,
      Object.assign(options, {
        event: this,
      }),
      {
        cwd: this.config.projectPath,
      },
    )
    const apkPath = this.getApkPath()

    return { appPath: apkPath }
  }
}
