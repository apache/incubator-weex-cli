const path = require('path')
const debug = require('debug')('run')
import { PLATFORM_TYPES } from '../common/const'

import 'jest'
import { AndroidRunner } from '../index'
import TestHelp from '@weex-cli/utils/src/test/test-help'

async function android() {
  debug('Test run android')
  const testHelp = new TestHelp(path.join(__dirname, '../../'))

  const androidRunner = new AndroidRunner({
    type: PLATFORM_TYPES.android,
    jsBundleEntryPath: testHelp.getTestConfigByKey('jsBundleEntryPath'),
    projectPath: testHelp.getTestConfigByKey('android.projectPath'),
    deviceId: testHelp.getTestConfigByKey('android.deviceId'),
    applicationId: testHelp.getTestConfigByKey('android.applicationId'),
    jsBundleFolderPath: testHelp.getTestConfigByKey('jsBundleFolderPath')
  })

  await androidRunner.run()

  // setTimeout(() => {
  //   debug('Will dispose')
  //   androidRunner.dispose()
  // }, 10000)
}

android().catch(e => {
  debug('Test run android ERROR: ', e)
})