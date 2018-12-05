const { IosRunner, AndroidRunner } = require('../lib') 
const fse = require('fs-extra')
const path = require('path')

const MESSAGETYPE = {
  STATE: 'state',
  OUTPUT: 'outputLog',
  OUTPUTERR: 'outputError'
}

const RUNNERSTATE = {
  START: 0,
  START_SERVER_DONE: 1,
  SET_NATIVE_CONFIG_DONE: 2,
  COPY_JS_BUNDLE_DOEN: 3,
  WATCH_FILE_CHANGE_DONE: 4,
  BUILD_NATIVE_DONE: 5,
  INSTALL_AND_LANUNCH_APP_DONE: 6,
  END: 7
}

module.exports = {
  name: 'run',
  description: 'Running weex page on Web/Android/iOS platform',
  run: async (
    {
      logger,
      parameters,
      inquirer,
      meta,
      device
    }
  ) => {
    const iOSDevice = new device.IOSDevices()
    const options = parameters.options
    let platform = parameters.first

    const runnerOptions = {
      jsBundleFolderPath: options.target || 'dist',
      jsBundleEntry: options.entry || 'index.js',
      projectPath: options.local || '',
      applicationId: options.appid || 'com.weex.app',
      preCommand: options.precmd || 'npm run dev',
      deviceId: options.deviceid || '',
      nativeConfig: {}
    }

    const platformChoices = [
      {
        name: 'android',
        value: 'android'
      },
      {
        name: 'ios',
        value: 'ios'
      },
      {
        name: 'web',
        value: 'web'
      }
    ]
    
    const showHelp = async () => {
      let params = {
        commandend: 'Run the device script to run/list the devices',
        commands: [
          {
            heading: ['Usage', 'Description']
          },
          {
            key: 'run',
            type: '[ ios | android | web]',
            description: 'Run the project on specify platform'
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
    
    const receiveEvent = (event) => {
      // event.on(MESSAGETYPE.OUTPUTERR, (err) => {
      // 	this.sendEvent(outputErrorEvent(err))
      // })
      // event.on(MESSAGETYPE.OUTPUT, (log) => {
      // 	this.sendEvent(outputLogEvent(log))
      // })
      event.on(MESSAGETYPE.STATE, (state) => {
        if (state === RUNNERSTATE.WATCH_FILE_CHANGE_DONE) {
          logger.log('Start to build APP...')
        }
        if (state === RUNNERSTATE.BUILD_NATIVE_DONE) {
          logger.success('Build APP done！')
          logger.log('Start Launch APP...')
        }
        if (state === RUNNERSTATE.INSTALL_AND_LANUNCH_APP_DONE) {
          logger.success('Launch APP done！')
        }
        if (state === RUNNERSTATE.END) {
          logger.log('All done!')
        }
      })
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

    if (options.version || options.v) { // version from package.json

      logger.info(`v${require("../package.json").version}`);

    } else if (options.help || options.h) {
      await showHelp()
    } else {
      let nativeConfig
      let runner
      if (!platform) {
        // ask for choose platform
        let answers = await inquirer.prompt([
          {
            type: 'list',
            message: 'Choose one of the platform you want to run',
            name: 'choosePlatform',
            choices: platformChoices
          }
        ])
        platform = answers.choosePlatform
      }
      if (platform === 'android') {
        let androidConfigurationFilePath = path.resolve(options.__config.weexAndroidConfigFilename)
        if (!runnerOptions.deviceId) {
          const androidDevice = new device.AndroidDevices()
          let androidDeviceList = await androidDevice.getList()
          androidDeviceList = androidDeviceList.map(device => {
            if (device.isSimulator) {
              return {
                name :`${device.name} ${device.isSimulator ? '(Simulator)' : ''}`,
                value: device.id
              }
            } else {
              return {
                name: device.name,
                value: device.id
              }
            }
          })
          let answers = await inquirer.prompt([
            {
              type: 'list',
              message: 'Select one of the device',
              name: 'chooseDevice',
              choices: androidDeviceList
            }
          ])
          runnerOptions.deviceId = answers.chooseDevice
        }
        if (fse.existsSync(androidConfigurationFilePath)) {
          nativeConfig = fse.readJson(androidConfigurationFilePath, {throws: false})
        }
        runner = new AndroidRunner({
          jsBundleFolderPath: path.resolve(runnerOptions.jsBundleFolderPath),
          jsBundleEntry: runnerOptions.jsBundleEntry,
          projectPath: runnerOptions.projectPath ? path.resolve(runnerOptions.projectPath) : path.resolve(options.__config.weexAndroidProjectPath) ,
          deviceId: runnerOptions.deviceId,
          applicationId: runnerOptions.applicationId,
          nativeConfig
        })
        receiveEvent(runner)
        await runner.run()
      } else if (platform === 'ios') {
        let iosConfigurationFilePath = path.resolve(options.__config.weexIOSConfigFilename)
        if (!runnerOptions.deviceId) {
          const iosDevice = new device.IOSDevices()
          let iosDeviceList = await iosDevice.getList()
          iosDeviceList = iosDeviceList.map(device => {
            if (device.isSimulator) {
              return {
                name :`${device.name} ${device.isSimulator ? '(Simulator)' : ''}`,
                value: device.id
              }
            } else {
              return {
                name: device.name,
                value: device.id
              }
            }
          })

          let answers = await inquirer.prompt([
            {
              type: 'list',
              message: 'Select one of the device',
              name: 'chooseDevice',
              choices: iosDeviceList
            }
          ])
          runnerOptions.deviceId = answers.chooseDevice
        }
        if (fse.existsSync(iosConfigurationFilePath)) {
          nativeConfig = fse.readJson(iosConfigurationFilePath, {throws: false})
        }
        runner = new IosRunner({
          jsBundleFolderPath: path.resolve(runnerOptions.jsBundleFolderPath),
          jsBundleEntry: runnerOptions.jsBundleEntry,
          projectPath: runnerOptions.projectPath ? path.resolve(runnerOptions.projectPath) : path.resolve(options.__config.weexIOSProjectPath) ,
          deviceId: runnerOptions.deviceId,
          applicationId: runnerOptions.applicationId,
          nativeConfig
        })
        receiveEvent(runner)
        await runner.run()
      } else if (platform === 'web') {

      }
    }
  }
}