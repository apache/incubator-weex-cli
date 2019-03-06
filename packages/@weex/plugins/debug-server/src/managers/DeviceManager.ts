import { EventEmitter } from 'events'

export default class DeviceManager extends EventEmitter {
  private deviceMap: any = {}

  constructor() {
    super()
  }

  registerDevice(device, channelId) {
    const existed = this.deviceMap[channelId]
    if (existed) {
      for (let i = existed.length - 1; i >= 0; i--) {
        if (existed[i].deviceId === device.deviceId) {
          clearTimeout(existed.timer)
          // this.deviceMap[channelId].splice(i,1,device)
          return device
        }
      }
      this.deviceMap[channelId].unshift(device)
      return device
    } else {
      device.channelId = channelId
      this.deviceMap[channelId] = [device]
      return device
    }
  }

  removeDevice(channelId, callback) {
    const device = this.deviceMap[channelId]
    if (device && device.length > 0) {
      clearTimeout(device.timer)
      device.timer = setTimeout(() => {
        this.deviceMap[channelId].pop()
        if (this.deviceMap[channelId] && this.deviceMap[channelId].length === 0) {
          callback()
        }
      }, 5000)
    }
    return device
  }

  getDevice(channelId) {
    const device = this.deviceMap[channelId]
    return device && device[device.length - 1]
  }

  getDeviceList() {
    return Object.keys(this.deviceMap).map(key => this.deviceMap[key])
  }
}

export const Device = new DeviceManager()
