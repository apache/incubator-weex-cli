import { ERROR_LIST } from './error-list'
import { noCocoaPodsConsequence, cocoaPodsInstallInstructions } from '../ios/cocoapods'

export interface ErrorTip {
  title: string,
  tip: string
}

export function getErrorTip(errorKey: ERROR_LIST): ErrorTip {
  switch(errorKey) {
    case ERROR_LIST.ANDROID_ADB_NOT_FIND:
      return {
        title: `Not find android sdk!`,
        tip: `Unable to locate Android SDK.
        Install Android Studio from: https://developer.android.com/studio/index.html
        On first launch it will assist you in installing the Android SDK components.
        If Android SDK has been installed to a custom location, set ANDROID_HOME to that location.`
      }
    case ERROR_LIST.IOS_XCODE_NOT_INSTALLED:
      return {
        title: `Xcode not installed!`,
        tip: `Xcode not installed; this is necessary for iOS development.\n
        Download at https://developer.apple.com/xcode/download/.`
      }
    case ERROR_LIST.IOS_COCOAPODS_NOT_INITIALIZED:
      return {
        title: `CocoaPods installed but not initialized!`,
        tip: `CocoaPods installed but not initialized.\n
        ${noCocoaPodsConsequence}\n
        To initialize CocoaPods, run:\n
          pod setup\n
        once to finalize CocoaPods\' installation.`
      }
    case ERROR_LIST.IOS_COCOAPODS_NOT_INSTALLED:
      return {
        title: `CocoaPods not installed!`,
        tip: `CocoaPods not installed.\n
        ${noCocoaPodsConsequence}\n
        To install:
        ${cocoaPodsInstallInstructions}`
      }
  }
}