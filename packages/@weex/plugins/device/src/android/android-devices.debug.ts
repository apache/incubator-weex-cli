// export TS_NODE_IGNORE="/node_modules/?@weexcli/"
// ts-node android.debug.ts
const path = require('path')

import AndroidDevice from './android-devices'

const androidDevice = new AndroidDevice()
const deviceList = androidDevice.getList()

console.log('deviceList', deviceList)

async function android() {
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
    applicationId: `com.weex.app`,
    appPath: path.join(__dirname, '../../test/android-mock/weex-app.apk'),
    androidShellCmdString: '',
  })
}

android().catch(e => {
  console.error('Have ERROR:', e)
})
