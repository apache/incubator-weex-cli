const childprocess = require('child_process')
const find = require('find-process')

const { exec, execSync } = childprocess

import processManage from '../utils/process'
import { Devices } from '../base/devices'
import AndroidSdk from './android-sdk'
import { DeviceInfo, RunDeviceOptions } from '../common/device'

const androidSdk = new AndroidSdk()

class AndroidDevice extends Devices {
  constructor() {
    super({ type: Devices.TYPES.android })
  }

  updateList() {
    this.list = []
    this.concat(this.getAndroidDeviceSimulatorList())
    this.concat(this.getAndroidDevicesList())
  }

  private getAndroidDevicesList(onlyEmulator: boolean = false): Array<DeviceInfo> {
    const text = processManage.runAndGetOutput(`${androidSdk.ANDROID_ADB_PATH} devices -l`)
    const devices: Array<DeviceInfo> = []
    const lines = text.split('\n')

    lines.forEach(line => {
      const result = line.match(/(\S+)\s+device[\s+\S+]+device:(\S+)/)
      if (!result) {
        return
      }
      if (onlyEmulator) {
        if (result[0].indexOf('emulator-') === -1) {
          return
        }
      } else {
        if (result[0].indexOf('emulator-') !== -1) {
          return
        }
      }
      devices.push({
        name: result[2],
        id: result[1],
        isSimulator: onlyEmulator,
      })
    })

    return devices
  }

  private getAndroidDeviceSimulatorList(): Array<DeviceInfo> {
    const text = processManage.runAndGetOutput(`${androidSdk.getEmulatorPath()} -list-avds`)
    const lines = text.split('\n')
    const devices = []

    lines.forEach(line => {
      if (!line || !line.replace(/\s+/, '')) {
        return
      }
      devices.push({
        name: line,
        id: line,
        isSimulator: true,
      })
    })
    return devices
  }

  /**
   * the child process of Android simulator will kill run long time
   * so will resole after 3000ms but the process still run
   * return the process pid can use kill it
   *
   * @param id
   *
   */
  launchById(id: DeviceInfo['id']): Promise<string | null> {
    return new Promise(async (resolve, reject) => {
      const deviceInfo = this.getDeviceById(id)

      if (!deviceInfo) {
        reject(Error(`Not find device ${id}`))
      }
      if (!deviceInfo.isSimulator) {
        return resolve(null)
      }
      const deviceCmdList = await find('name', deviceInfo.id)
      if (deviceCmdList.length) {
        // Launched
        return resolve(null)
      }
      const cmd = exec(`${androidSdk.getEmulatorPath()} -avd ${deviceInfo.name}`, error => {
        if (error) {
          reject(error)
        }
      })
      setTimeout(() => {
        resolve(cmd.pid)
      }, 3000)
    })
  }

  async run(options: RunDeviceOptions) {
    const deviceInfo = this.getDeviceById(options.id)
    const { androidShellCmdString } = options
    let adbId = null

    if (!deviceInfo) {
      throw Error(`Not find device ${options.id}`)
    }
    if (deviceInfo.isSimulator) {
      await this.launchById(options.id)
      const deviceCmdList = await find('name', deviceInfo.id)
      const adbSimulatorDeviceList = this.getAndroidDevicesList(true)

      if (!deviceCmdList.length) {
        throw new Error(`The device not launch ${deviceInfo.id}`)
      }

      for (let i = 0; i < adbSimulatorDeviceList.length; i++) {
        const simulator = adbSimulatorDeviceList[i]
        if (adbId) {
          break
        }
        const portMatch = simulator.id.match(/-(\w+)/)
        if (!portMatch || !portMatch[1]) {
          break
        }
        const portCmdList = await find('port', portMatch[1])
        if (!portCmdList.length) {
          break
        }
        if (portCmdList[0].pid === deviceCmdList[0].pid) {
          adbId = simulator.id
        }
      }
    } else {
      adbId = options.id
    }

    if (!adbId) {
      throw Error(`Not find device ${options.id}`)
    }

    try {
      execSync(`${androidSdk.ANDROID_ADB_PATH} -s ${adbId} install -r ${options.appPath}`)
      execSync(
        `${androidSdk.ANDROID_ADB_PATH} -s ${adbId} shell am start -n ${
          options.applicationId
        } ${androidShellCmdString || ''}`,
      )
    } catch (e) {
      throw e
    }
  }
}

export default AndroidDevice
