// const debug = require('debug')('device')
const path = require('path')
const debug = require('debug')('device')
import 'jest'
import { messageType } from '@weex-cli/utils/lib/process/process.js'

jest.setTimeout(30000)

import AndroidDevice from './android-devices'

describe('Test android', () => {
  const androidDevice = new AndroidDevice()
  const deviceList = androidDevice.getList()

  console.log('deviceList', deviceList)
  // TODO mock
  test('Run android simulator', async () => {
    let firstDevice
    deviceList.some(info => {
      if (info.isSimulator) {
        firstDevice = info
        return true
      }
      return false
    })

    androidDevice.on(messageType.outputError, (event) => {
      debug('OUTPUT_ERROR:', event)
    })

    androidDevice.on(messageType.outputLog, (event) => {
      debug('OUTPUT_LOG:', event)
    })

    await androidDevice.run({
      id: firstDevice.id,
      applicationId: `com.weex.app`,
      appPath: path.join(__dirname, '../../test/android-mock/weex-app.apk'),
      androidShellCmdString: '',
    })
  })
})
