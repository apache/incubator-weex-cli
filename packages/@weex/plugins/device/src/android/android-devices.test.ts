// const debug = require('debug')('device')
const path = require('path')
import 'jest'

jest.setTimeout(30000)

import AndroidDevice from './android-devices'

describe('Test android', () => {
  const androidDevice = new AndroidDevice()
  const deviceList = androidDevice.getList()

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

    await androidDevice.run({
      id: firstDevice.id,
      applicationId: `com.weex.app/com.weex.app.SplashActivity`,
      appPath: path.join(__dirname, '../../test/android-mock/weex-app.apk'),
      androidShellCmdString: '',
    })
  })
})
