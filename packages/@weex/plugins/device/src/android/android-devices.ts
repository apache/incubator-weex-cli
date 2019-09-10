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
const find = require('find-process')
const debug = require('debug')('device')

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
   * @returns null | number --the node process pid of launch simulator (if have)
   */
  launchById(id: DeviceInfo['id']): Promise<string | null> {
    return new Promise(async (resolve, reject) => {
      let cmd
      let tryTimes = 0
      let maxTryTimes = 15
      let timeInterval = isWindows ? 20000 : 7000
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
      const deviceCmdList = (await find('name', deviceInfo.id)).filter(cmdObj => {
        if (cmdObj.cmd.indexOf(`-avd`) === -1) {
          return false
        }
        return true
      })
      if (deviceCmdList.length) {
        // If find device cmd in process think launched
        return resolve(null)
      }
      // If not find device cmd wait
      checkIsLaunchFinished()
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

  private runCmdWithTry(options: {
    cmdString: string
    maxTryTimes?: number
    timeInterval?: number
    isTryFun?: Function
  }) {
    const { cmdString, maxTryTimes, isTryFun, timeInterval } = Object.assign(
      {
        cmdString: '',
        maxTryTimes: 6,
        isTryFun: (str?: string) => {
          return false
        },
        timeInterval: isWindows ? 10000 : 5000,
      },
      options,
    )
    let tryTimes = 0
    let isRunning = false
    let timer

    const clearTimer = () => {
      clearInterval(timer)
      timer = null
      isRunning = false
    }

    return new Promise((resolve, reject) => {
      timer = setInterval(async () => {
        let isContinue = false

        debug('runCmdWithTry setInterval', isRunning, tryTimes)
        if (isRunning) {
          return
        } else {
          isRunning = true
        }
        tryTimes = tryTimes + 1
        try {
          await exec(cmdString, {
            event: this,
            onOutCallback(str) {
              if (isTryFun(str)) {
                isContinue = true
              }
            },
          })
        } catch (e) {
          if (isTryFun(e.toString())) {
            return (isContinue = true)
          }
          clearTimer()
          reject(e)
        }
        if (!isContinue) {
          clearTimer()
          resolve()
        }
        if (tryTimes >= maxTryTimes) {
          clearTimer()
          reject(new Error('Run command timeout, please retry!'))
        }
      }, timeInterval)
    })
  }

  async run(options: RunDeviceOptions) {
    const deviceInfo = this.getDeviceById(options.id)
    let adbId = null
    const { androidShellCmdString } = options

    if (!deviceInfo) {
      throw Error(`Not find device ${options.id}`)
    }
    if (deviceInfo.isSimulator) {
      adbId = await this.findAdbId(options)
      if (!adbId) {
        // try twice
        const timeInterval = isWindows ? 15000 : 7000
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
    // Install apk and if system not ready retry
    await this.runCmdWithTry({
      cmdString: `${this.androidSdk.ANDROID_ADB_PATH} -s ${adbId} install -r ${options.appPath}`,
      isTryFun(str) {
        return str.indexOf(`Can't find service`) >= 0 || str.indexOf(`Is the system running`) >= 0
      },
    })
    await exec(
      `${this.androidSdk.ANDROID_ADB_PATH} -s ${adbId} shell am start -n ${
        options.applicationId
      }/.SplashActivity ${androidShellCmdString || ''}`,
      {
        event: this,
      },
    )
  }
}

export default AndroidDevice
