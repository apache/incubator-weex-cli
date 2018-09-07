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
    const iosBuilder = new IosBuilder({
      projectPath,
      type: PLATFORM_TYPES.ios
    })
    let result

    try {
      result = await iosBuilder.run()
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(result && typeof result.appPath === 'string' && result.appPath)).toBe(true)
  }, 20000)

  test('Ios build for build for real device ', async() => {
    const iosBuilder = new IosBuilder({
      projectPath,
      type: PLATFORM_TYPES.ios,
      isRealDevice: true
    })
    let result

    try {
      result = await iosBuilder.run()
      console.log('result', result)
    } catch (e) {
      console.log('Error', e.message)
    }

    expect(!!(result && typeof result.appPath === 'string' && result.appPath)).toBe(true)
  }, 20000)
})
