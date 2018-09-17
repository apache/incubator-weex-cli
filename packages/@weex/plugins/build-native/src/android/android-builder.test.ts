const path = require('path')

import 'jest'
import AndroidBuilder from './android-builder'
import { PLATFORM_TYPES } from '../common/const'
import TestHelp from '@weex-cli/utils/src/test/test-help'

jest.setTimeout(50000)

describe('Test android', () => {
  const testHelp = new TestHelp(path.join(__dirname, '../../'))

  test('Android build', async () => {
    const androidBuilder = new AndroidBuilder({
      projectPath: testHelp.getTestConfigByKey('android.projectPath'),
      type: PLATFORM_TYPES.android,
    })
    let result
    try {
      result = await androidBuilder.run()
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(result && typeof result.appPath === 'string' && result.appPath)).toBe(true)
  })
})
