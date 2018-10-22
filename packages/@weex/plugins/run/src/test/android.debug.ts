// ts-node *.ts
const path = require('path')
const debug = require('debug')('run')

import 'jest'
import { AndroidRunner } from '../index'
import TestHelp from '@weex-cli/utils/lib/test/test-help.js'

async function android() {
  debug('Test run android')
  const testHelp = new TestHelp(path.join(__dirname, '../../'))

  const androidRunner = new AndroidRunner({
    jsBundleEntry: testHelp.getTestConfigByKey('jsBundleEntry'),
    projectPath: testHelp.getTestConfigByKey('android.projectPath'),
    deviceId: testHelp.getTestConfigByKey('android.deviceId'),
    applicationId: testHelp.getTestConfigByKey('android.applicationId'),
    jsBundleFolderPath: testHelp.getTestConfigByKey('jsBundleFolderPath'),
  })

  await androidRunner.run()

  // setTimeout(() => {
  //   debug('Will dispose')
  //   androidRunner.dispose()
  // }, 10000)
}

android().catch(e => {
  console.error('Test run android ERROR: ', e)
})
