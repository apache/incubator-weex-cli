import { createError } from './error'

export enum ERROR_LIST {
  ANDROID_SDK_NOT_FIND = 'ANDROID_SDK_NOT_FIND',
  ANDROID_ADB_NOT_FIND = 'ANDROID_ADB_NOT_FIND',
  ANDROID_EMULATOR_NOT_FIND = 'ANDROID_EMULATOR_NOT_FIND',
  ANDROID_NDK_NOT_FIND = 'ANDROID_NDK_NOT_FIND',

  IOS_XCODE_NOT_INSTALLED = 'IOS_XCODE_NOT_INSTALLED',
  IOS_XCODE_NOT_SIGNED = 'IOS_EULA_NOT_SIGNED',
  IOS_COCOAPODS_NOT_INITIALIZED = 'IOS_COCOAPODS_NOT_INITIALIZED',
  IOS_COCOAPODS_NOT_INSTALLED = 'IOS_COCOAPODS_NOT_INSTALLED',
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

export const IOS_COCOAPODS_NOT_INITIALIZED = createError({
  type: ERROR_LIST.IOS_COCOAPODS_NOT_INITIALIZED,
  message: `CocoaPods installed but not initialized!`,
})

export const IOS_COCOAPODS_NOT_INSTALLED = createError({
  type: ERROR_LIST.IOS_COCOAPODS_NOT_INSTALLED,
  message: `CocoaPods not installed!`,
})

export const IOS_EULA_NOT_SIGNED = createError({
  type: ERROR_LIST.IOS_XCODE_NOT_SIGNED,
  message: `Xcode not signed!`,
})
