import 'jest'
import IosBuilder from './iosBuilder'
import { PLATFORM_TYPES } from '../common/const'

describe('Test IOS', () => {
  const projectPath = process.env.IOS_PROJECT_PATH

  if (!projectPath) {
    console.log('Please set projectPath first ex: `export IOS_PROJECT_PATH=/Users/jiaoweimin/Downloads/weex-project-weex-tool/platforms/ios`')
    return
  }

  test('Ios build for simulator ', async() => {
    const iosRunner = new IosBuilder({
      projectPath,
      type: PLATFORM_TYPES.ios
    })
    let reuslt

    try {
      reuslt = await iosRunner.run()
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(reuslt && typeof reuslt.appPath === 'string' && reuslt.appPath)).toBe(true)
  })

  test('Ios build for build for real device ', async() => {
    const iosRunner = new IosBuilder({
      projectPath,
      type: PLATFORM_TYPES.ios,
      isRealDevice: true
    })
    let reuslt

    try {
      reuslt = await iosRunner.run()
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(reuslt && typeof reuslt.appPath === 'string' && reuslt.appPath)).toBe(true)
  })
})
