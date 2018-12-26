const { IosDevices, AndroidDevices} = require('../lib')

module.exports = {
  name: 'device',
  description: 'Module for manage Android/iOS device',
  run: async (
    {
      logger,
      parameters,
      inquirer,
      meta
    }
  ) => {
    const iOSDevice = new IosDevices()
    const androidDevice = new AndroidDevices()
    const first = parameters.first
    const options = parameters.options

    const showHelp = async () => {
      let params = {
        commandend: 'Run the device script to run/list the devices',
        commands: [
          {
            heading: ['Usage', 'Description']
          },
          {
            key: 'device run',
            description: 'Run the simulator'
          },
          {
            key: 'device list',
            description: 'List the device (including real device and simulator)'
          }
        ],
        options: {
          'Miscellaneous:': [
            {
              key:'-v, --version',
              description: 'Output the version number'
            },
            {
              key:'-h, --help',
              description: 'Show help'
            }
          ]
        }
      }
      meta.generateHelp(params)
    }
    
    const list = async () => {
      let spinner = logger.spin('Detact iOS Device ...')
      const iOSDeviceList = await iOSDevice.getList()
      spinner.stopAndPersist({
        symbol: ``,
        text: `${logger.colors.green('--- iOS Device ---')}`
      })
      let iosTable = [['ID', 'Name']];
      for (let item in iOSDeviceList) {
        let device = iOSDeviceList[item]
        iosTable.push([
          device.id,
          `${device.name}${device.isSimulator? ' (Simulator)': ''}`
        ])
      }
      logger.table(iosTable, {format: 'lean'})
      spinner = logger.spin('Detact Android Device ...')
      const androidDeviceList = await androidDevice.getList()
      spinner.stopAndPersist({
        symbol: ``,
        text: `${logger.colors.green('--- Android Device ---')}`
      })
      let androidTable = [['ID', 'Name']];
      for (let item in androidDeviceList) {
        let device = androidDeviceList[item]
        androidTable.push([
          device.id,
          `${device.name} ${device.isSimulator? '(Simulator)': ''}`
        ])
      }
      logger.table(androidTable, {format: 'lean'})
    }

    const run = async (appid, package) => {
      const iOSDeviceList = await iOSDevice.getList()
      const androidDeviceList = await androidDevice.getList()
      let listNames = []
      if (iOSDeviceList.length <= 0 && androidDeviceList.length <= 0) {
        logger.error(`No device detact, please run \`weex doctor\` to check your environment.`)
        return ;
      }
      if (iOSDeviceList && iOSDeviceList.length > 0) {
        listNames.push(new inquirer.Separator(' = iOS devices = '));
        for (let device of iOSDeviceList) {
          if (device.isSimulator) {
            listNames.push(
              {
                name: `${device.name} ${device.isSimulator ? '(Simulator)' : ''}`,
                value: {
                  type: 'iOS',
                  id: device.id
                }
              }
            );
          }
        }
      }
      if (androidDeviceList && androidDeviceList.length > 0) {
        listNames.push(new inquirer.Separator(' = android devices = '));
        for (let device of androidDeviceList) {
          if (device.isSimulator) {
            listNames.push(
              {
                name: `${device.name} ${device.isSimulator ? '(Simulator)' : ''}`,
                value: {
                  type: 'android',
                  id: device.id
                }
              }
            );
          }
        }
      }
      const answers = await inquirer.prompt([
        {
          type: 'list',
          message: 'Choose one of the following devices',
          name: 'chooseDevice',
          choices: listNames
        }
      ])
      
      const device = answers.chooseDevice;
      if (device.type === 'iOS') {
        await iOSDevice.launchById(device.id)
      }
      else {
        await androidDevice.launchById(device.id)
      }
    }

    if (options.version || options.v) { 
      // version from package.json
      logger.log(`${require("../package.json").version}`);
    } else if (options.help || options.h) {
      await showHelp()
    } else {
      switch (first) {
        case 'list': 
          await list();
          break;
        case 'run':
          await run()
          break;
        default:
          await showHelp();
          break;
      }
    }
  }
}