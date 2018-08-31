import IosDevices from './ios/ios-devices'
import { DeviceInfo, RunDeviceOptions } from './common/device'
import AndroidDevices from './android/android-devices'

const DEVICES = {
  getAndroidDeviceList(): Array<DeviceInfo> {
    return new AndroidDevices().getList()
  },

  runAndroid(options: RunDeviceOptions) {
    return new AndroidDevices().run(options)
  },

  getIosDeviceList(): Array<DeviceInfo> {
    return new IosDevices().getList()
  },

  runIos(options: RunDeviceOptions) {
    return new IosDevices().run(options)
  },
}

export default DEVICES
