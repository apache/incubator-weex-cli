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
    await exec(isWindows ? `call gradlew.bat clean assembleDebug` : `./gradlew clean assembleDebug`, options, {
      cwd: this.config.projectPath,
    })
    const apkPath = this.getApkPath()

    return { appPath: apkPath }
  }
}
