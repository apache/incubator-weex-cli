import { createError } from '@weex-cli/utils/src/error/error'

export enum ERROR_LIST  {
  IOS_CODE_SIGNING_ERROR = 'IOS_CODE_SIGNING_ERROR',
  ANDROID_NOT_FIND_APK_PATH = 'ANDROID_NOT_FIND_APK_PATH'
}

/**
 * When build app for real device, not have correct signing will throw
 */
export const IOS_CODE_SIGNING_ERROR = createError({
  type: ERROR_LIST.IOS_CODE_SIGNING_ERROR,
  message: `Code Signing Error, Please use xcode open project handle singing error.`
})

export const ANDROID_NOT_FIND_APK_PATH = createError({
  type: ERROR_LIST.ANDROID_NOT_FIND_APK_PATH,
  message: `Not find android apk path, please try set apk path`
})
