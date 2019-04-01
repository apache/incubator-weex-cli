'use strict';

const debug = require('debug')('weex:cli');

const pkg = require('../package.json');
const colors = require('colors/safe');
const semver = require('semver');
const spawn = require('cross-spawn');
const path = require('path');
const userhome = require('userhome');
const yargsParser = require('yargs-parser');
const fse = require('fs-extra');
const got = require('got');
const inquirer = require('inquirer');

const {
  getNodeArgs,
  readJson,
  install,
  confirm
} = require('../lib/utils');

const {
  installUncaughtExceptionListener
} = require('../lib/errors');

const tabtab = require('./completion')
const coreName = '@weex-cli/core';
const homePrefix = '.wx';
let argv

// environment for running prepare
let env = {}

// data for cli instance
let coreData

// data in config.json
let coreConfigurations = {
  version: '',
  name: '',
  is_next: false,
  next_version: '',
  local: '',
  last_update_time: '',
  update_time: 7
}

installUncaughtExceptionListener();

// check if user has use `sudo` or not
if (process.env.WEEX_ALLOW_SUDO) {
  console.log('root privileges downgrade skipped');
} else {
  require('root-check')(`
  ${colors.red('Please don\'t use `sudo` to run the command.')}

  If you can't run without sudo, you may have problems during installation.
  Try to run ${colors.underline('sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}')} command to empower your folders.
  `);
}

// check if there has userhome floder
if (!userhome()) {
  console.error(colors.red('ERROR: can not find HOME directory.'));
  this.process.exit(1);
}

// saving configuration into config.json
const save = async (path, config) => {
  try {
    await fse.ensureFile(path)
    await fse.writeJson(path, config, {
      spaces: '\t'
    })
  } catch (err) {
    console.error(err)
  }
}

const cli = async (processArgv) => {
  let wantsCompiled;
  let command;
  argv = yargsParser(processArgv.slice(2))
  wantsCompiled = argv.compiled
  command = argv._[0]
  env = {
    cliVersion: pkg.version,
    coreName: coreName,
    coreRoot: userhome(homePrefix, 'core'),
    corePath: userhome(homePrefix, 'core/node_modules', coreName),
    moduleRoot: process.env.WEEX_MODULE_PATH ? process.env.WEEX_MODULE_PATH : userhome(homePrefix, 'modules'),
    templatePath: userhome(homePrefix, 'templates'),
    defaultWeexTemplateRepo: 'weex-templates',
    defaultWeexPlatformFloder: 'platforms',
    defaultWeexTemplate: 'webpack',
    defaultWeexPlatformTemplate: {
      ios: 'weex-playground-ios',
      android: 'weex-playground-android'
    },
    weexAndroidConfigFilename: 'android.config.json',
    weexIOSConfigFilename: 'ios.config.json',
    weexAndroidProjectPath: 'platforms/android',
    weexIOSProjectPath: 'platforms/ios',
    defaultWeexBundleTarget: 'dist',
    defaultWeexBundleEntry: 'index.js',
    defaultWeexBundleCommand: 'npm run dev',
    defaultPreviewWebCommand: 'npm start',
    defaultWeexPlatforms: ['ios', 'android'],
    platformConfigName: 'platforms.json',
    defaultWeexPluginTemplateRepo: 'weex-plugin-template',
    defaultWeexPluginProjectPath: 'plugins',
    defaultWeexPluginConfigName: 'plugins.json',
    registry: argv.registry || process.env.NPM_REGISTRY || 'https://registry.npm.taobao.org',
    moduleConfigFileName: 'stores.json',
    globalConfigFileName: 'config.json',
    home: userhome(homePrefix),
    trash: userhome(homePrefix, 'trash')
  };
  coreData = Object.assign({
    modules: {},
    configs: {},
    argv: processArgv,
  }, env);
  // prepare for running cli
  try {
    await prepare(command, env)
  } catch (error) {
    // TODO: pipe error to solutions.
    console.error(colors.red(`ERROR: ${error.stack || error}`))
  }

  // check if we're running in dev mode
  const devMode = await fse.exists(`${coreData.corePath}/src`);
  if (command === 'completion') {
    // Register complete command
    tabtab.start()
  } else if (!process.env.WEEX_CLI_TEST) {
    if (devMode && !wantsCompiled) {
      // hook into ts-node so we can run typescript on the fly
      require('ts-node').register({
        project: `${coreData.corePath}/tsconfig.json`
      })
      const TSCli = require(`${coreData.corePath}/src/cli/cli`).default;
      (new TSCli(coreData)).start()
    } else {
      try {
        const Cli = require(`${coreData.corePath}/lib/cli/cli`).default;
        (new Cli(coreData)).start()
      } catch (error) {
        debug(`Run cli error, ${error && error.stack}`)
        await prepare('repair', env)
      }
    }
  }
}

const initGlobalConfig = async () => {
  const taobao = `http://registry.npm.taobao.org`
  const npm = `http://registry.npmjs.org`

  if (process.env.WEEX_CLI_TEST) {
    return {
      telemetry: false,
      registry: 'https://registry.npmjs.org/'
    }
  }

  const questions = [{
    name: 'telemetry',
    type: 'confirm',
    message: 'May weex-toolkit anonymously report usage statistics to improve the tool over time?',
  },
  {
    name: 'registry',
    type: 'list',
    choices: [{
      name: 'use taobao (for Chinese)',
      value: taobao,
      short: 'taobao'
    },
    {
      name: 'use npm',
      value: npm,
      short: 'npm'
    }
    ],
    message: 'Which npm registry you perfer to use?',
  },
  ]
  const answer = await inquirer.prompt(questions)
  return {
    telemetry: answer.telemetry,
    registry: answer.registry
  }
}

const prepare = async (command, config) => {
  // TODO: check there has a new version of `weex-toolkit` or not
  let corePackageJson = {}
  let coreVersion
  let coreName = config.coreName;
  let needInstall = false
  const coreConfigurationsPath = path.join(config.coreRoot, config.globalConfigFileName)
  const hasConfig = await fse.exists(coreConfigurationsPath)
  let corePath = process.env.WEEX_CORE_PATH ? process.env.WEEX_CORE_PATH : config.corePath
  if (hasConfig) {
    debug('Has configuration file and try to readJson')
    coreConfigurations = await fse.readJson(coreConfigurationsPath)
    if (typeof coreConfigurations.telemetry === 'undefined') {
      const userConfigs = await initGlobalConfig()
      coreConfigurations = Object.assign({}, coreConfigurations, userConfigs)
      try {
        await save(coreConfigurationsPath, coreConfigurations)
      } catch (err) {
        console.log(err)
      }
    }
    coreData['configs'] = coreConfigurations
    corePath = process.env.WEEX_CORE_PATH ? process.env.WEEX_CORE_PATH : coreConfigurations.local ? coreConfigurations.local : config.corePath
  }
  if (fse.existsSync(path.join(corePath, 'package.json'))) {
    corePackageJson = await readJson(path.join(corePath, 'package.json'))
  }
  coreData['corePath'] = corePath
  if (fse.existsSync(path.join(config.moduleRoot, config.moduleConfigFileName))) {
    coreData['modules'] = await readJson(path.join(config.moduleRoot, config.moduleConfigFileName))
  }
  if (command === 'repair') {
    const repairModule = argv._[1];
    if (repairModule) {
      const arg = repairModule.split('@');
      if (arg.length > 1) {
        coreVersion = arg.pop();
        coreName = arg.join('@');
      } else {
        coreName = arg;
        coreVersion = 'latest';
      }
    } else {
      coreName = config.coreName
      coreVersion = 'latest'
    }
    // If repair module isn't the core module, pipe argv to the @weex-cli/core
    if (coreName !== config.coreName) {
      needInstall = false;
    } else {
      needInstall = true;
      debug(`start repair ${config.coreName}`)
      console.log(colors.yellow(`Start repair ${config.coreName}, please wait ...`));
    }
  } else {
    // checking if there has weex-cli/core
    if (!corePackageJson.name || !corePackageJson.version) {
      coreVersion = process.env.WEEX_CORE_VERSION || 'latest'
      debug('start install a new core')
      console.log(colors.yellow('Start installing Core, please wait ...'));
      needInstall = true;
    } else {
      if (hasConfig) {
        // while the has core configuration
        // fetching if there has new version
        if (new Date().getTime() - coreConfigurations.last_update_time <= 24 * 3600 * 1000 * (coreConfigurations.updateTimes || 7)) {
          return;
        }
        const latest = await got.get(
          config.registry + '/' + config.coreName + '/latest', {
            'json': true,
            'timeout': 60 * 1000,
            'retries': 0
          }
        );
        if (latest && latest.body) {
          debug('coreData from %s: %o', config.registry, latest.body);
          if (latest.body.version) {
            coreVersion = latest.body.version;
          }
          if (semver.gt(coreVersion, corePackageJson.version)) {
            const result = await confirm(
              'New version detected ' + colors.green(coreVersion) +
              ', the local version is ' + colors.dim(corePackageJson.version) +
              ', upgrade now？[Y/n]'
            );
            if (result) {
              console.log(colors.yellow(`upgrading ${corePackageJson.name} from ${corePackageJson.version} -> ${coreVersion} ...`));
              debug('start upgrade to latest core')
              console.log(colors.yellow(`Upgrading ${corePackageJson.name}, please wait ...`));
              needInstall = true;
            } else {
              let userConfigs = {}
              if (typeof config.telemetry === 'undefined') {
                userConfigs = await initGlobalConfig()
              }
              coreConfigurations = Object.assign({
                version: corePackageJson.version,
                name: corePackageJson.name,
                is_next: false,
                next_version: coreVersion,
                local: path.join(config.coreRoot, 'node_modules', corePackageJson.name),
                last_update_time: (new Date()).getTime()
              }, userConfigs)
            }
          }
        }
      }
    }
  }

  if (needInstall) {
    try {
      await install(coreName, coreVersion, {
        root: config.coreRoot,
        trash: config.trash,
        force: argv.force || argv.f,
        registry: config.registry,
        ENVS: config.ENVS,
      });
    } catch (error) {
      if (error.stack.indexOf('module is locked') >= 0) {
        console.error(colors.red('\nThe module is locked, please check if there has another installing process.'))
        console.log(`Or you can run the command with ${colors.yellow('`-f`')} or ${colors.yellow('`--force`')} option to skip it.`)
        process.exit(0)
      }
    }
    const packageJson = await fse.readJson(path.join(config.coreRoot, 'node_modules', coreName, 'package.json'))
    let userConfigs = {}
    if (typeof config.telemetry === 'undefined') {
      userConfigs = await initGlobalConfig()
    }
    coreConfigurations = Object.assign({
      version: packageJson.version,
      name: packageJson.name,
      is_next: true,
      next_version: '',
      local: path.join(config.coreRoot, 'node_modules', coreName),
      last_update_time: (new Date()).getTime(),
      update_time: 7
    }, userConfigs)
  }
  try {
    await save(coreConfigurationsPath, coreConfigurations)
  } catch (err) {
    console.log(err)
  }
  return;
}

module.exports = cli;
