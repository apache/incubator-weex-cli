import IosDevices from './ios/ios-devices'
import { DeviceInfo, RunDeviceOptions } from './common/device'
import AndroidDevices from './android/android-devices'

export function getAndroidDeviceList(): Array<DeviceInfo> {
  return new AndroidDevices().getList()
}

export function installAndLaunchAndroidApp(options: RunDeviceOptions) {
  return new AndroidDevices().run(options)
}

export function getIosDeviceList(): Array<DeviceInfo> {
  return new IosDevices().getList()
}

export function installAndLaunchIosApp(options: RunDeviceOptions) {
  return new IosDevices().run(options)
}