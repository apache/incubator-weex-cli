import AndroidBuilder from './androidBuilder'
import { PLATFORM_TYPES } from '../common/const'

describe('Test android', () => {
  const projectPath = process.env.ANDROID_PROJECT_PATH

  if (!projectPath) {
    console.log('Please set projectPath first ex: `export ANDROID_PROJECT_PATH=/Users/jiaoweimin/Downloads/weex-project-weex-tool/platforms/android`')
    return
  }

  test('Ios build for simulator ', async() => {
    const androidRunner = new AndroidBuilder({
      projectPath,
      type: PLATFORM_TYPES.ios
    })
    let reuslt

    // try {
    //   reuslt = await androidRunner.run()
    // } catch (e) {
    //   console.log('Error', e.message)
    // }

    expect(!!(reuslt && typeof reuslt.appPath === 'string' && reuslt.appPath)).toBe(true)
  })
})

