const debug = require('debug')('device')
const path = require('path')

import 'jest'
import IosDevice from './ios-devices'
import * as platform from '@weex-cli/utils/lib/platform/platform.js'
import { messageType } from '@weex-cli/utils/lib/process/process.js'

jest.setTimeout(60000)

describe('Test IOS', () => {
  if (!platform.isMacOS) {
    return
  }
  const iosDevices = new IosDevice()
  const iosDeviceList = iosDevices.getList()

  test('Run ios simulator', async () => {
    let firstSimulator = null

    iosDeviceList.some(info => {
      if (info.isSimulator) {
        firstSimulator = info
        return true
      }
      return false
    })

    if (!firstSimulator) {
      return
    }

    iosDevices.on(messageType.outputError, (event) => {
      debug('OUTPUT_ERROR:', event)
    })

    iosDevices.on(messageType.outputLog, (event) => {
      debug('OUTPUT_LOG:', event)
    })

    try {
      await iosDevices.run({
        id: firstSimulator.id,
        appPath: path.join(__dirname, '../../test/ios-mock/Debug-iphonesimulator/WeexDemo99.app'),
        applicationId: 'com.alibaba.weex',
      })
    } catch (e) {
      expect(e.toString()).toMatch(/Instll app fail/)
    }

    try {
      await iosDevices.run({
        id: firstSimulator.id,
        appPath: path.join(__dirname, '../../test/ios-mock/Debug-iphonesimulator/WeexDemo.app'),
        applicationId: 'com.alibaba.weex',
      })
    } catch (e) {
      debug('Run ios simulator fail', e.toString().slice(0, 50))
    }
  })

  test('Run ios device', async () => {
    let firstDevice = null

    iosDeviceList.some(info => {
      if (!info.isSimulator) {
        firstDevice = info
        return true
      }
      return false
    })

    if (!firstDevice) {
      return
    }

    try {
      await iosDevices.run({
        id: firstDevice.id,
        appPath: path.join(__dirname, './ios-mock/Debug-iphonesimulator/WeexDemo.app'),
        applicationId: 'com.alibaba.weex',
      })
    } catch (e) {
      debug('Run ios device fail', e.toString().slice(0, 50))
    }
  })
})
