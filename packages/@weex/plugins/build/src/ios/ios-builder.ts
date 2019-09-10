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

import { createCmdString, exec, runAndGetOutput } from '@weex-cli/utils/lib/process/process.js'
import Builder from '../base/builder'
import { IosBuilderConfig, RunOptions } from '../common/builder'
import { IOS_DERIVE_DATA_PATH, PLATFORM_TYPES } from '../common/const'
import { IOS_CODE_SIGNING_ERROR } from '../common/error-list'
import * as userhome from 'userhome'

export default class IosBuilder extends Builder {
  protected config: IosBuilderConfig

  constructor(options: IosBuilderConfig) {
    super(options, PLATFORM_TYPES.ios)
  }

  private async buildForSimulator(options?: RunOptions): Promise<string> {
    const { projectPath } = this.config
    const projectInfo = this.getIOSProjectInfo(projectPath)
    const cmdParams = {
      '-scheme': projectInfo.scheme,
      '-configuration': 'Debug',
      '-sdk': 'iphonesimulator',
      '-derivedDataPath': IOS_DERIVE_DATA_PATH,
    }

    // Default `workspace`
    // If not projectName try use scheme
    if (!projectInfo.isWorkspace) {
      Object.assign(cmdParams, {
        '-project': projectInfo.name || projectInfo.scheme,
      })
    } else {
      Object.assign(cmdParams, {
        '-workspace': projectInfo.name || projectInfo.scheme,
      })
    }
    await exec(
      createCmdString('xcodebuild', cmdParams),
      Object.assign(options, {
        event: this,
      }),
      { cwd: projectPath },
    )

    let productPath = path.join(
      projectPath,
      `${IOS_DERIVE_DATA_PATH}/Build/Products/Debug-iphonesimulator/${projectInfo.scheme}.app`,
    )
    if (options.iOSProductPath) {
      productPath = options.iOSProductPath
    } else if (!fs.existsSync(productPath)) {
      productPath = userhome(
        `Library/Developer/Xcode/DerivedData/Build/Products/Debug-iphonesimulator/${projectInfo.scheme}.app`,
      )
    }
    return productPath
  }

  private async buildForRealDevice(options?: RunOptions): Promise<string> {
    const { projectPath } = this.config
    const projectInfo = this.getIOSProjectInfo(projectPath)
    const cmdParams = {
      '-scheme': projectInfo.scheme,
      '-configuration': 'Debug',
      '-derivedDataPath': IOS_DERIVE_DATA_PATH,
    }

    // Default `workspace`
    // If not projectName try use scheme
    if (!projectInfo.isWorkspace) {
      Object.assign(cmdParams, {
        '-project': projectInfo.name || projectInfo.scheme,
      })
    } else {
      Object.assign(cmdParams, {
        '-workspace': projectInfo.name || projectInfo.scheme,
      })
    }
    let isCodeSigningError = false

    try {
      await exec(
        createCmdString('xcodebuild', cmdParams),
        Object.assign(options || {}, {
          onOutCallback(bufStr) {
            if (bufStr.indexOf(`Code Signing Error`) !== -1) {
              isCodeSigningError = true
            }
          },
          onErrorCallback(bufStr) {
            if (bufStr.indexOf(`Code Signing Error`) !== -1) {
              isCodeSigningError = true
            }
          },
          event: this,
        }),
        { cwd: projectPath },
      )
    } catch (e) {
      if (isCodeSigningError) {
        throw IOS_CODE_SIGNING_ERROR
      }
      throw e
    }

    let productPath = path.join(
      projectPath,
      `${IOS_DERIVE_DATA_PATH}/Build/Products/Debug-iphonesimulator/${projectInfo.scheme}.app`,
    )
    if (options.iOSProductPath) {
      productPath = options.iOSProductPath
    } else if (!fs.existsSync(productPath)) {
      productPath = userhome(
        `Library/Developer/Xcode/DerivedData/Build/Products/Debug-iphonesimulator/${projectInfo.scheme}.app`,
      )
    }
    return productPath
  }

  private getIOSProjectInfo(
    dir: string,
  ): {
    scheme: string
    targets: Array<string>
    schemes: Array<string>
    isWorkspace: boolean
    name: string
  } {
    const projectInfoText = runAndGetOutput('xcodebuild -list', { cwd: dir })
    const splits = projectInfoText.toString().split(/Targets:|Build Configurations:|Schemes:/)
    const projectInfo: any = {}
    projectInfo.scheme = splits[0].match(/Information about project "([^"]+?)"/)[1]
    projectInfo.targets = splits[1]
      ? splits[1]
          .split('\n')
          .filter(e => !!e.trim())
          .map(e => e.trim())
      : []
    projectInfo.configurations = splits[2]
      ? splits[2]
          .split('\n')
          .filter((e, i) => !!e.trim() && i < 3)
          .map(e => e.trim())
      : []
    projectInfo.schemes = splits[3]
      ? splits[3]
          .split('\n')
          .filter(e => !!e.trim())
          .map(e => e.trim())
      : []

    return Object.assign(projectInfo, this.findXcodeProject(dir))
  }

  private findXcodeProject(dir: string) {
    if (!fs.existsSync(dir)) {
      return {}
    }
    const files = fs.readdirSync(dir)
    const sortedFiles = files.sort()
    for (let i = sortedFiles.length - 1; i >= 0; i--) {
      const fileName = files[i]
      const ext = path.extname(fileName)

      if (ext === '.xcworkspace') {
        return {
          name: fileName,
          isWorkspace: true,
        }
      }
      if (ext === '.xcodeproj') {
        return {
          name: fileName,
          isWorkspace: false,
        }
      }
    }

    return {}
  }

  async run(options?: RunOptions): Promise<{ appPath: string }> {
    let apkPath

    await this.doPreCmds()
    if (this.config.isRealDevice) {
      apkPath = await this.buildForRealDevice(options)
    } else {
      apkPath = await this.buildForSimulator(options)
    }

    return { appPath: apkPath }
  }
}
