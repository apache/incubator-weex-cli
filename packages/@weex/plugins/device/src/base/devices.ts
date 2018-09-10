import { MOBILE_TYPES } from '../common/const'
import { DeviceInfo, RunDeviceOptions } from '../common/device'

export class Devices {
  static TYPES = MOBILE_TYPES
  public type: string
  public list: Array<DeviceInfo> = []

  constructor(options: { type: MOBILE_TYPES }) {
    this.type = options.type
  }

  public updateList() {
    console.error('Not define `updateList`')
  }

  getList() {
    return this.list
  }

  add(info: DeviceInfo) {
    this.list.push(info)
  }

  concat(list: Array<DeviceInfo>) {
    this.list = this.list.concat(list)
  }

  getDeviceById(id: DeviceInfo['id']): DeviceInfo | null {
    let result = null

    this.list.some(device => {
      if (device.id === id) {
        result = device
        return true
      }
      return false
    })

    return result
  }

  launchById(id: DeviceInfo['id']) {
    console.error('Not define `launchById`')
  }

  run(options: RunDeviceOptions) {
    console.error('Not define `runAppById`')
  }
}
