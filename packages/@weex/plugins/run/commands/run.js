const { IosRunner, AndroidRunner } = require('../lib') 
const fse = require('fs-extra')
const path = require('path')
const debug = require('debug')('run')

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
      device,
      system
    }
  ) => {
    const options = parameters.options
    const analyzer = options.__analyzer
    let platform = parameters.first
    let spinner
    let closeSpinner = false
    const runnerOptions = {
      jsBundleFolderPath: options.target || options.__config.defaultWeexBundleTarget,
      jsBundleEntry: options.entry || options.__config.defaultWeexBundleEntry,
      projectPath: options.local || '',
      applicationId: options.appid || '',
      preCommand: options.precmd || options.__config.defaultWeexBundleCommand,
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
          'Bash': [
            {
              key: 'target',
              description: 'Specify the product folder',
              default: 'dist'
            },
            {
              key: 'entry',
              description: 'Specify the hotRelod home page, base on `src` folder',
              default: 'index.js'
            },
            {
              key: 'precmd',
              description: 'Specify precommand',
              default: 'npm run dev'
            }
          ],
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
      event.on(MESSAGETYPE.OUTPUTERR, (err) => {
        debug('Error from ADB or Xcrun: ', err)
      })
      event.on(MESSAGETYPE.OUTPUT, (log) => {
        if (!closeSpinner) {
          spinner.text = log
        } else {
          spinner.clear()
        }
      })
      event.on(MESSAGETYPE.STATE, (state) => {
        if (state === RUNNERSTATE.START) {
          spinner = logger.spin('Start hotreload server')
        }
        else if (state === RUNNERSTATE.START_SERVER_DONE) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Start hotreload server done')}`
          })
          spinner = logger.spin(`Start setting native config ${logger.colors.gray('- this may take a few seconds')}`)
        }
        else if (state === RUNNERSTATE.SET_NATIVE_CONFIG_DONE) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Set native config done')}`
          })
          spinner = logger.spin(`Copy JS source ${logger.colors.gray('- this may take a few seconds')}`)
        }
        else if (state === RUNNERSTATE.COPY_JS_BUNDLE_DOEN) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Copy JS source done')}`
          })
          spinner = logger.spin('Watching files')
        }
        else if (state === RUNNERSTATE.WATCH_FILE_CHANGE_DONE) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Watch JS source done')}`
          })
          spinner = logger.spin(`Building APP ${logger.colors.gray('- this may take a few seconds')}\n`)
        }
        else if (state === RUNNERSTATE.BUILD_NATIVE_DONE) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Build APP done')}`
          })
          spinner = logger.spin(`Lanuching APP ${logger.colors.gray('- this may take a few seconds')}`)
          closeSpinner = true
        }
        else if (state === RUNNERSTATE.INSTALL_AND_LANUNCH_APP_DONE) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Launch APP done')}`
          })
        }
        if (state === RUNNERSTATE.END) {
          logger.success('Hotreload server is actived, enjoy your develop')
          logger.log(`${logger.colors.grey('Type Ctrl+C to exist')}`)
        }
      })
    }

    const prepareJSBundle = async () => {
      system.exec(options.__config.defaultWeexBundleCommand || 'npm run dev')
      return
    }

    if (options.version || options.v) {
      // version from package.json
      logger.info(`${require("../package.json").version}`);
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
        let projectPath = runnerOptions.projectPath ? path.resolve(runnerOptions.projectPath) : path.resolve(options.__config.weexAndroidProjectPath)
        let spinner = logger.spin('Compiling JSBundle...')
        try {
          await prepareJSBundle()
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Compile JSBundle done')}`
          })
        } catch(err) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
            text: `${logger.colors.red('Compile JSBundle failed')}`
          })
          analyzer('run', err.stack || err)
          // exist
          return 
        }
        if (!fse.existsSync(projectPath)) {
          spinner = logger.spin('Adding android project ...')
          try {
            await system.exec('weex platform add android')
            spinner.stopAndPersist({
              symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
              text: `${logger.colors.green('Add android project done')}`
            })
          }
          catch(err) {
            analyzer('run', err.stack || err)
            spinner.stopAndPersist({
              symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
              text: `${logger.colors.red('Add android project failed')}`
            })
            return
          }
          
        }
        if (!runnerOptions.deviceId) {
          const androidDevice = new device.AndroidDevices()
          let androidDeviceList = await androidDevice.getList()
          if (androidDeviceList && androidDeviceList.length > 1) {
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
          } else if (androidDeviceList && androidDeviceList.length === 1) {
            runnerOptions.deviceId = androidDeviceList[0].id
            logger.log(`${logger.colors.green(`[${logger.checkmark}]`)} Use ${logger.colors.green(`${androidDeviceList[0].name}${androidDeviceList[0].isSimulator ? ' (Simulator)' : ''}`)}`)
          }
        }
        if (fse.existsSync(androidConfigurationFilePath)) {
          nativeConfig = await fse.readJson(androidConfigurationFilePath, {throws: false})
        }
        if (!nativeConfig) {
          nativeConfig = {}
        }
        runner = new AndroidRunner({
          jsBundleFolderPath: path.resolve(runnerOptions.jsBundleFolderPath),
          jsBundleEntry: runnerOptions.jsBundleEntry,
          projectPath: projectPath ,
          deviceId: runnerOptions.deviceId,
          applicationId: runnerOptions.applicationId || nativeConfig.AppId,
          nativeConfig
        })
        receiveEvent(runner)
        await runner.run({
          // onOutCallback: output => {
          //   // console.OUTPUT('BUILD OUTPUT:', output)
          //   if(!closeSpinner && spinner) {
          //     spinner.text = output
          //   } else {
          //     logger.write('Output', output)
          //   }
          // },
          // onErrorCallback: error => {
            
          // }
        })
      } else if (platform === 'ios') {
        let iosConfigurationFilePath = path.resolve(options.__config.weexIOSConfigFilename)
        let projectPath = runnerOptions.projectPath ? path.resolve(runnerOptions.projectPath) : path.resolve(options.__config.weexIOSProjectPath)
        let spinner = logger.spin('Compiling JSBundle...')        
        try {
          await prepareJSBundle()
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Compile JSBundle done')}`
          })
        } catch(err) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
            text: `${logger.colors.red('Compile JSBundle failed')}`
          })
          analyzer('run', err.stack || err)
          // exist
          return 
        }
        if (!fse.existsSync(projectPath)) {
          let spinner = logger.spin('Adding iOS project ...')
          try {
            await system.exec('weex platform add ios')
          }
          catch(err) {
            analyzer('run', err.stack || err)
            return
          }
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green('Add iOS project done')}`
          })
        }
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
          nativeConfig = await fse.readJson(iosConfigurationFilePath, {throws: false})
        }
        runner = new IosRunner({
          jsBundleFolderPath: path.resolve(runnerOptions.jsBundleFolderPath),
          jsBundleEntry: runnerOptions.jsBundleEntry,
          projectPath: projectPath,
          deviceId: runnerOptions.deviceId,
          applicationId: runnerOptions.applicationId || nativeConfig.AppId,
          nativeConfig
        })
        receiveEvent(runner)
        await runner.run()
      } else if (platform === 'web') {
        let spinner = logger.spin(`Running \`${options.__config.defaultPreviewWebCommand}\` command...`)
        try {
          system.exec(options.__config.defaultPreviewWebCommand)
          spinner.stopAndPersist({
            symbol: `${logger.colors.green(`[${logger.checkmark}]`)}`,
            text: `${logger.colors.green(`Run \`${options.__config.defaultPreviewWebCommand}\` command done`)}`
          })
        }
        catch(err) {
          spinner.stopAndPersist({
            symbol: `${logger.colors.red(`[${logger.xmark}]`)}`,
            text: `${logger.colors.red('Run web command failed')}`
          })
          analyzer('run', err.stack||err)
          return
        }
        
      }
    }
  }
}