const debug = require('debug')('plugin')
const fse = require('fs-extra')
const path = require('path')
const {
  Plugin,
  LOGLEVEL
} = require('../index')

const {
  localpath
} = require('../lib/utils/localpath')


const exists = fse.existsSync


module.exports = {
  name: 'plugin',
  description: 'Module for manage weex plugin and create plugin project',
  run: async ({
    logger,
    parameters,
    inquirer,
    meta,
    generator
  }) => {
    const first = parameters.first
    const second = parameters.second
    const third = parameters.third
    const options = parameters.options
    const array = parameters.array
    const globalConfig = options.__config
    const {
      render,
      clone,
      getOptions
    } = generator
    // Support types from prompt-for which was used before
    const promptMapping = {
      string: 'input',
      boolean: 'confirm'
    }

    const askQuestion = async (name, templatePath) => {
      debug(`Render from local path ${templatePath}`)
      const meta = getOptions(name, templatePath)
      let propmts = []
      let keys = Object.keys(meta.prompts)
      if (keys.length <= 2) {
        return meta
      }
      keys.forEach(key => {
        let prompt = meta.prompts[key]
        promptDefault = typeof prompt.default !== 'undefined' ? prompt.default : ''
        propmts.push({
          type: promptMapping[prompt.type] || prompt.type,
          name: key,
          message: prompt.message || prompt.label || key,
          default: promptDefault,
          choices: prompt.choices || [],
          validate: prompt.validate || (() => true)
        })
      })
      let answer = await inquirer.prompt(propmts)
      // assign metadata to answer
      return Object.assign(meta, answer)
    }

    const create = async (name, template) => {
      let target = path.resolve(name);
      let templatePath = template
      if (exists(target)) {
        let res = await inquirer.prompt([{
          type: 'confirm',
          message: `The ${name} project exists. Continue?`,
          name: 'yes'
        }])
        if (res.yes) {
          let spinner = logger.spin(`Remove ${target} ...`);
          await fse.remove(target);
          spinner.stop();
        } else {
          return
        }
      }
      if (!template) {
        template = globalConfig.defaultWeexPluginTemplateRepo
      }
      if (localpath.isLocalPath(template)) {
        templatePath = localpath.getTemplatePath(template);
        if (exists(templatePath)) {
          let answer = await askQuestion(name, templatePath)
          let metadata = Object.assign(answer, {
            destDirName: name,
            inPlace: target === process.cwd(),
            noEscape: true
          })
          await render(templatePath, target, metadata)
        } else {
          logger.error(`Local template "${templatePath}" not found`);
        }
      } else {
        const hasHash = /\//.test(template)
        if (!hasHash) {
          // fetch from official repo
          template = `${globalConfig.defaultWeexTemplateRepo || 'weex-templates'}/${template}`
        }
        const templatesTarget = path.join(globalConfig.templatePath, template)
        let spinner = logger.spin(`Download from ${template} repo ...`);
        templatePath = await clone(template, templatesTarget, {
          cache: exists(templatesTarget) && (typeof options.cache === 'boolean' ? options.cache : true)
        })
        spinner.stop();
        let answer = await askQuestion(name, templatePath)
        let metadata = Object.assign(answer, {
          destDirName: name,
          inPlace: target === process.cwd(),
          noEscape: true
        })
        await render(templatePath, target, metadata)
      }
    }

    const showHelp = async () => {
      let params = {
        commandend: 'Manage weex plugin or create weex plugin project',
        commands: [{
            heading: ['Usage', 'Description']
          },
          {
            key: 'plugin add',
            type: '[plugin-name]',
            description: 'Add specified plugin'
          },
          {
            key: 'plugin remove',
            type: '[plugin-name]',
            description: 'Remove specified plugin'
          },
          {
            key: 'plugin install',
            type: '<ios|android|web>',
            default: 'All',
            description: 'Install plugin for specified platform'
          },
          {
            key: 'plugin create',
            type: '<template | git-repo> [project-name]',
            description: 'Create plugin template for develop weex plugin'
          }
        ],
        options: {
          'Base': [{
            key: '--no-cache',
            description: 'Fetching latest template with no cache'
          }],
          'Miscellaneous:': [{
              key: '-v, --version',
              description: 'Output the version number'
            },
            {
              key: '-h, --help',
              description: 'Show help'
            }
          ]
        }
      }
      meta.generateHelp(params)
    }

    const isWeexWorkSpace = async (local) => {
      const isWeex = await fse.exists(path.join(local, 'platforms'))
      return isWeex
    }

    if (options.version || options.v) { // version from package.json

      logger.info(`${require("../package.json").version}`);

    } else if (options.help || options.h) {
      await showHelp()
    } else {
      let command = first
      let templateName = second
      let template

      if (array.length >= 3) {
        template = second
        command = first
        templateName = third
      }

      if (command === 'create') {
        await create(templateName, template);
      } else if (!isWeexWorkSpace(process.cwd())) {
        logger.error('The current directory is not the project directory of weex, please check')
        return
      } else if (command) {
        let pluginName = second
        let plugin = new Plugin()
        let spinner = logger.spin(`Fetching plugin ...`)

        plugin.on(LOGLEVEL.INFO, (value) => {
          logger.info(value)
        })
        plugin.on(LOGLEVEL.WARN, (value) => {
          logger.warn(value)
        })
        plugin.on(LOGLEVEL.LOG, (value) => {
          spinner.stop()
          logger.log(logger.colors.grey(value))
        })
        plugin.on(LOGLEVEL.SUCCESS, (value) => {
          logger.success(value)
        })
        if (command === 'add') {
          if (!pluginName) {
            await showHelp();
          }
          plugin.install(pluginName)
        } else if (command === 'remove') {
          if (!pluginName) {
            await showHelp();
          }
          plugin.uninstall(pluginName)
        } else if (command === 'install') {
          let platformName = second
          if (platformName) {
            return plugin.installForNewPlatform(platformName)
          }
          return plugin.installForNewPlatform(['web', 'ios', 'android']);
        } else {
          await showHelp();
        }
      } else {
        await showHelp();
      }
    }
  }
}