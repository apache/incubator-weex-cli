const { IosDevices, AndroidDevices} = require('../lib')

module.exports = context => {
  context.device = {
    IOSDevices: IosDevices,
    AndroidDevices: AndroidDevices
  }
}