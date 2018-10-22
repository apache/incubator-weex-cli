const path = require('path')

import 'jest'
import IosBuilder from './ios-builder'
import { PLATFORM_TYPES } from '../common/const'
import TestHelp from '@weex-cli/utils/lib/test/test-help.js'

jest.setTimeout(30000)

describe('Test IOS', () => {
  const testHelp = new TestHelp(path.join(__dirname, '../../'))

  test('Ios build for simulator ', async () => {
    const iosBuilder = new IosBuilder({
      projectPath: testHelp.getTestConfigByKey('ios.projectPath'),
      type: PLATFORM_TYPES.ios,
    })
    let result

    try {
      result = await iosBuilder.run()
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(result && typeof result.appPath === 'string' && result.appPath)).toBe(true)
  })

  test('Ios build for build for real device ', async () => {
    const iosBuilder = new IosBuilder({
      projectPath: testHelp.getTestConfigByKey('ios.projectPath'),
      type: PLATFORM_TYPES.ios,
      isRealDevice: true,
    })
    let result

    try {
      result = await iosBuilder.run()
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(result && typeof result.appPath === 'string' && result.appPath)).toBe(true)
  })
})
