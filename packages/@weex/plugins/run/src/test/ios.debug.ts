// ts-node *.ts
const path = require('path')

import 'jest'
import { IosRunner } from '../index'
import TestHelp from '@weex-cli/utils/lib/test/test-help.js'

async function testIos() {
  const testHelp = new TestHelp(path.join(__dirname, '../../'))

  const iosRunner = new IosRunner({
    jsBundleEntry: testHelp.getTestConfigByKey('jsBundleEntry'),
    projectPath: testHelp.getTestConfigByKey('ios.projectPath'),
    deviceId: testHelp.getTestConfigByKey('ios.deviceId'),
    applicationId: testHelp.getTestConfigByKey('ios.applicationId'),
    jsBundleFolderPath: testHelp.getTestConfigByKey('jsBundleFolderPath'),
  })

  await iosRunner.run()

  setTimeout(() => {
    console.log('Will dispose')
    iosRunner.dispose()
  }, 30 * 1000)
}

testIos().catch(e => {
  console.error('Test run ios ERROR: ', e)
})
