import AndroidBuilder from './android-builder'
import { PLATFORM_TYPES } from '../common/const'

describe('Test android', () => {
  const projectPath = process.env.ANDROID_PROJECT_PATH

  if (!projectPath) {
    console.log(
      'Please set projectPath first ex: `export ANDROID_PROJECT_PATH=/Users/jiaoweimin/Downloads/weex-project-weex-tool/platforms/android`',
    )
    return
  }

  test(
    'Android build',
    async () => {
      const androidBuilder = new AndroidBuilder({
        projectPath,
        type: PLATFORM_TYPES.ios,
      })
      let result
      try {
        result = await androidBuilder.run()
      } catch (e) {
        console.log('Error', e.message)
      }

      expect(!!(result && typeof result.appPath === 'string' && result.appPath)).toBe(true)
    },
    40000,
  )
})
