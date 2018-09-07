const fs = require('fs')
const path = require('path')

import { exec } from '@weex-cli/utils/src/process/process'
import { isWindows } from '@weex-cli/utils/src/platform/platform'
import AndroidEnv from '@weex-cli/utils/src/android/android-env'
import Builder from '../base/builder'
import { AndroidBuilderConfig, RunOptions } from '../common/builder'
import { ANDROID_NOT_FIND_APK_PATH } from '../common/errorList'


export default class AndroidBuilder extends Builder {

  protected config: AndroidBuilderConfig

  constructor(options: AndroidBuilderConfig) {
    super(options)
  }

  private createLocalProperties() {
    const projectPath = this.config.projectPath
    const filePath = path.join(projectPath, 'local.properties')

    if (fs.existsSync(filePath)) {
      return
    }

    const androidEnv = new AndroidEnv()
    const sdkPath = androidEnv.getAdbPath()

    fs.writeFileSync(filePath, `sdk.dir=${sdkPath}`)
  }

  private getApkPath():string {
    const projectPath = this.config.projectPath
    let apkPath = this.config.apkPath || null
    let temp = null

    if(apkPath) {
      return apkPath
    }
    try  {
      temp = fs.readdirSync(path.join(projectPath, 'app/build/outputs/apk/'))
    } catch (e){
      temp = []
    }
    try  {
      temp = temp.concat(fs.readdirSync(path.join(projectPath, 'app/build/outputs/apk/debug/')))
    } catch (e){
      // Do nothing
    }
    (temp || []).some((thePath) => {
      const match = thePath.match(/\S+.apk/)
      if (match && match[0]) {
        apkPath = match[0]
        return true
      }
    })
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
      isWindows ? `call gradlew.bat clean assembleDebug`: `./gradlew clean assembleDebug`,
      options,
      {
        cwd: this.config.projectPath
      })
    const apkPath = this.getApkPath()
    return { appPath: apkPath }
  }
}