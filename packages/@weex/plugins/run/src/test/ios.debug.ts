const path = require('path')
const debug = require('debug')('run')

import { PLATFORM_TYPES } from '../common/const'
import 'jest'
import { IosRunner } from '../index'
import TestHelp from '@weex-cli/utils/src/test/test-help'

async function testIos() {
  const testHelp = new TestHelp(path.join(__dirname, '../../'))

  const iosRunner = new IosRunner({
    type: PLATFORM_TYPES.ios,
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
  }, 10000)
}

testIos().catch(e => {
  debug('Test run ios ERROR: ', e)
})
