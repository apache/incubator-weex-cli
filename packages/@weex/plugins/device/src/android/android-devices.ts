const find = require('find-process')

import { exec, runAndGetOutput } from '@weex-cli/utils/lib/process/process.js'
import AndroidSdk from '@weex-cli/utils/lib/android/android-env.js'
import { isWindows } from '@weex-cli/utils/lib/PLATFORM/PLATFORM'

import { Devices } from '../base/devices'
import { DeviceInfo, RunDeviceOptions } from '../common/device'

class AndroidDevice extends Devices {
  private androidSdk: AndroidSdk = new AndroidSdk()

  constructor() {
    super({ type: Devices.TYPES.android })
    this.androidSdk.init()
    this.updateList()
  }

  public updateList() {
    this.list = []
    this.concat(this.getAndroidDeviceSimulatorList())
    this.concat(this.getAndroidDevicesList())
  }

  private getAndroidDevicesList(onlyEmulator: boolean = false): Array<DeviceInfo> {
    const text = runAndGetOutput(`${this.androidSdk.ANDROID_ADB_PATH} devices -l`)
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
        name: result[2].trim(),
        id: result[1].trim(),
        isSimulator: onlyEmulator,
      })
    })

    return devices
  }

  private getAndroidDeviceSimulatorList(): Array<DeviceInfo> {
    const text = runAndGetOutput(`${this.androidSdk.getEmulatorPath()} -list-avds`)
    const lines = text.split('\n')
    const devices = []

    lines.forEach(line => {
      if (!line || !line.replace(/\s+/, '')) {
        return
      }
      line = line.trim()
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
   * so will resole after 5000ms but the process still run
   * return the process pid can use kill it
   *
   * @param id
   *
   */
  launchById(id: DeviceInfo['id']): Promise<string | null> {
    return new Promise(async (resolve, reject) => {
      let cmd
      let tryTimes = 0
      let maxTryTimes = 15
      let timeInterval = isWindows ? 20000 : 6000
      let timer
      const deviceInfo = this.getDeviceById(id)
      const startSimulatorDeviceList = this.getAndroidDevicesList(true)

      const checkIsLaunchFinished = () => {
        timer = setTimeout(() => {
          if (tryTimes >= maxTryTimes) {
            clearTimeout(timer)
            return reject(Error(`Try launch device fail ${id}`))
          }
          clearTimeout(timer)
          const adbSimulatorDeviceList = this.getAndroidDevicesList(true)

          if (adbSimulatorDeviceList.length > startSimulatorDeviceList.length) {
            // This time think simulator launch success
            clearTimeout(timer)
            resolve(cmd.pid)
          } else {
            checkIsLaunchFinished()
          }
          tryTimes++
        }, timeInterval)
      }

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
      checkIsLaunchFinished()
      // Don't know whether succeed or fail
      try {
        await exec(`${this.androidSdk.getEmulatorPath()} -avd ${deviceInfo.name}`, {
          handleChildProcess(childProcess) {
            cmd = childProcess
          },
          event: this,
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  async findAdbId(options: RunDeviceOptions): Promise<string> {
    let adbId = null
    await this.launchById(options.id)
    const deviceCmdList = await find('name', options.id)
    const adbSimulatorDeviceList = this.getAndroidDevicesList(true)

    if (!deviceCmdList || !deviceCmdList.length) {
      throw new Error(`The device not launch ${options.id}`)
    }

    for (let i = 0; i < adbSimulatorDeviceList.length; i++) {
      const simulator = adbSimulatorDeviceList[i]
      if (adbId) {
        break
      }
      const portMatch = simulator.id.match(/-(\w+)/)
      if (!portMatch || !portMatch[1]) {
        continue
      }
      const portCmdList = await find('port', portMatch[1])
      if (!portCmdList || !portCmdList.length) {
        continue
      }

      deviceCmdList.forEach(cmd => {
        if (portCmdList[0].pid === cmd.pid) {
          adbId = simulator.id
        }
      })
    }
    return adbId
  }

  async run(options: RunDeviceOptions) {
    const deviceInfo = this.getDeviceById(options.id)
    const { androidShellCmdString } = options
    let adbId = null

    if (!deviceInfo) {
      throw Error(`Not find device ${options.id}`)
    }
    if (deviceInfo.isSimulator) {
      adbId = await this.findAdbId(options)
      if (!adbId) {
        // try twice
        const timeInterval = isWindows ? 30000 : 10000
        await new Promise(resolve => {
          setTimeout(async () => {
            adbId = await this.findAdbId(options)
            resolve()
          }, timeInterval)
        })
      }
    } else {
      adbId = options.id
    }

    if (!adbId) {
      throw Error(`Not find adbId ${options.id}`)
    }

    try {
      await exec(`${this.androidSdk.ANDROID_ADB_PATH} -s ${adbId} install -r ${options.appPath}`, {
        event: this,
      })
      await exec(
        `${this.androidSdk.ANDROID_ADB_PATH} -s ${adbId} shell am start -n ${
          options.applicationId
        }/.SplashActivity ${androidShellCmdString || ''}`,
        {
          event: this,
        },
      )
    } catch (e) {
      throw e
    }
  }
}

export default AndroidDevice
