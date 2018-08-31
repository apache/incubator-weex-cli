const path = require('path')
const fs = require('fs')

import platform from '../utils/platform'
import processManage from '../utils/process'

interface AndroidSdkOptions {
  sdkPath?: string
  adbPath?: string
}

const kAndroidHome = 'ANDROID_HOME'

class AndroidSdk {
  public ANDROID_SDK_PATH: string | void

  public ANDROID_ADB_PATH: string | void

  constructor(options: AndroidSdkOptions = {}) {
    this.ANDROID_SDK_PATH = options.sdkPath || this.getSdkPath()
    this.ANDROID_ADB_PATH = options.adbPath || this.getAdbPath()
  }

  private getSdkPath() {
    // Doctor TODO `sdk`
    if (process.env[kAndroidHome]) {
      return process.env[kAndroidHome]
    }
    if (platform.isLinux) {
      return path.join(platform.homedir, 'Android', 'Sdk')
    }
    if (platform.isMacOS) {
      return path.join(platform.homedir, 'Library', 'Android', 'sdk')
    }
    if (platform.isWindows) {
      return path.join(platform.homedir, 'AppData', 'Local', 'Android', 'sdk')
    }

    return null
  }

  private getAdbPath() {
    // Doctor TODO `adb`
    const defaultAdbPath = path.join(this.ANDROID_SDK_PATH, 'platform-tools', 'adb')
    if (this.ANDROID_ADB_PATH && fs.existsSync(defaultAdbPath)) {
      return defaultAdbPath
    }

    if (platform.isWindows) {
      const output = processManage.runAndGetOutput(`where adb`)

      if (output.indexOf('adb.exe') !== -1) {
        return output.replace('adb.exe', 'adb').replace(/\n/g, '')
      }
    }

    if (platform.isLinux || platform.isMacOS) {
      const output = processManage.runAndGetOutput(`which adb`)

      if (output.indexOf('not found') === -1) {
        return output.replace(/\n/g, '')
      }
    }

    return defaultAdbPath
  }

  public getEmulatorPath(sdkPath?: string) {
    return path.join(this.ANDROID_SDK_PATH || sdkPath, 'emulator/emulator')
  }
}

export default AndroidSdk
