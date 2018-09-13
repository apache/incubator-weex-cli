import { createError } from './error'

export enum ERROR_LIST {
  ANDROID_SDK_NOT_FIND = 'ANDROID_SDK_NOT_FIND',
  ANDROID_ADB_NOT_FIND = 'ANDROID_ADB_NOT_FIND',
  ANDROID_EMULATOR_NOT_FIND = 'ANDROID_EMULATOR_NOT_FIND',

  ANDROID_NDK_NOT_FIND = 'ANDROID_NDK_NOT_FIND',
  IOS_XCODE_NOT_INSTALLED = 'IOS_XCODE_NOT_INSTALLED',
}

export const ANDROID_SDK_NOT_FIND = createError({
  type: ERROR_LIST.ANDROID_ADB_NOT_FIND,
  message: `Not find android sdk!`,
})

export const ANDROID_ADB_NOT_FIND = createError({
  type: ERROR_LIST.ANDROID_ADB_NOT_FIND,
  message: `Not find android adb!`,
})

export const ANDROID_EMULATOR_NOT_FIND = createError({
  type: ERROR_LIST.ANDROID_EMULATOR_NOT_FIND,
  message: `Not find android emulator!`,
})

export const ANDROID_NDK_NOT_FIND = createError({
  type: ERROR_LIST.ANDROID_NDK_NOT_FIND,
  message: `Not find android ndk!`,
})

export const IOS_XCODE_NOT_INSTALLED = createError({
  type: ERROR_LIST.IOS_XCODE_NOT_INSTALLED,
  message: `Xcode not installed!`,
})
