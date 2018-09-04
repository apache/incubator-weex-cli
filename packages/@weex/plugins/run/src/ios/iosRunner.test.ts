import IosRunner from './iosRunner'
import { PLATFORM_TYPES } from '../common/const'


describe('Test IOS', () => {
  const projectPath = process.env.PROJECT_PATH

  if (!projectPath) {
    console.log('Please set projectPath first ex: `export PROJECT_PATH=/Users/jiaoweimin/Downloads/weex-project-weex-tool`')
    return
  }

  const iosRunner = new IosRunner({
    projectPath,
    type: PLATFORM_TYPES.ios
  })

  test('Ios runner', async() => {
    let reuslt

    try {
      reuslt = await iosRunner.run()
    } catch (e) {
      console.log('Error', e)
    }

    expect(!!(reuslt && typeof reuslt.appPath === 'string' && reuslt.appPath)).toBe(true)
  })
}
