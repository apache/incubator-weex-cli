const {generator, clone, getOptions} = require('../index')
const debug = require('debug')('create')
const fse = require('fs-extra')
const path = require('path')
const async = require('async')
const {
  localpath
} = require('../lib/utils/localpath')
const {
  evaluate
} = require('../lib/utils/eval')

const exists = fse.existsSync


module.exports = {
  name: 'platform',
  description: 'Manage iOS/Android project',
  run: async (
    {
      logger,
      parameters,
      inquirer,
      meta
    }
  ) => {
    const first = parameters.first
    const second = parameters.second
    const third = parameters.third
    const options = parameters.options
    const array = parameters.array
    const globalConfig = options.__config
    const platformConfigFile = path.join(process.cwd(), globalConfig.defaultWeexPlatformFloder || 'platforms', globalConfig.platformConfigName || 'platforms.json')
    const platformFloder = path.join(process.cwd(), globalConfig.defaultWeexPlatformFloder || 'platforms')
    // Support types from prompt-for which was used before
    const promptMapping = {
      string: 'input',
      boolean: 'confirm'
    };

    const DEFAULT_TEMPLATES = globalConfig.defaultWeexPlatformTemplate || {
      ios: 'weex-playground-ios',
      android: 'weex-playground-android'
    }

    const PLATFORMS = globalConfig.defaultWeexPlatforms || ['ios', 'android']
    
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

    const add = async (platform, template) => {
      let target = path.resolve(globalConfig.defaultWeexPlatformFloder || 'platforms', platform);
      let templatePath = template
      if (exists(target)) {
        let res = await inquirer.prompt([{
          type: 'confirm',
          message: `The ${platform} project exists. Continue?`,
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
        template = DEFAULT_TEMPLATES[platform]
      }
      if (localpath.isLocalPath(template)) {
        templatePath = localpath.getTemplatePath(template);
        if (exists(templatePath)) {
          let answer = await askQuestion(platform, templatePath)
          let metadata = Object.assign(answer, {
            destDirName: platform,
            inPlace: target === process.cwd(),
            noEscape: true
          })
          await generator(templatePath, target, metadata)
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
          cache: exists(templatesTarget) && (typeof options.cache === 'boolean' ? options.cache : true),
          clone: options.clone || false          
        })
        spinner.stop();
        let answer = await askQuestion(platform, templatePath)
        let metadata = Object.assign(answer, {
          destDirName: platform,
          inPlace: target === process.cwd(),
          noEscape: true
        })
        await generator(templatePath, target, metadata)
      }
      await updatePlatformConfig(platform, templatePath)
      logger.success(`${logger.checkmark} Add ${platform} project success`)
    }

    const remove = async (platform) => {
      const project = `${platformFloder}/${platform}`
      const exist = await fse.exists(project)
      if (exist) {
        let spinner = logger.spin(`Platform ${platform} detated, try to remove ...`);
        await fse.remove(project)
        await updatePlatformConfig(platform, '', true)
        spinner.stop();
        logger.success(`${logger.checkmark} Remove ${platform} project success`)
      } else {
        logger.warn(`Current workspace has not ${platform} project, please check`)
      }
    }

    const list = async () => {
      const platformMetaData = await fse.readJson(platformConfigFile)
      logger.success(`Installed:`)
      Object.keys(platformMetaData).forEach(key => {
        if (PLATFORMS.indexOf(key) >= 0) {
          logger.log(`- ${key}@${platformMetaData[key]}`)
        }
      })
      logger.success('Supported:')
      PLATFORMS.forEach(platform => {
        logger.log(`- ${platform}`)
      })
    }

    const update = async (platform, template) => {
      let target = path.resolve(globalConfig.defaultWeexPlatformFloder || 'platforms', platform);
      let templatePath = template
      if (!template) {
        template = DEFAULT_TEMPLATES[platform]
      }
      if (localpath.isLocalPath(template)) {
        templatePath = localpath.getTemplatePath(template);
        if (exists(templatePath)) {
          let answer = await askQuestion(platform, templatePath)
          let metadata = Object.assign(answer, {
            destDirName: platform,
            inPlace: target === process.cwd(),
            noEscape: true
          })
          await generator(templatePath, target, metadata)
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
          cache: false,
          clone: options.clone || false
        })
        spinner.stop();
        let answer = await askQuestion(platform, templatePath)
        let metadata = Object.assign(answer, {
          destDirName: platform,
          inPlace: target === process.cwd(),
          noEscape: true
        })
        await generator(templatePath, target, metadata)
      }
      await updatePlatformConfig(platform, templatePath)
      logger.success(`${logger.checkmark} Update ${platform} project success`)
    }

    const updatePlatformConfig = async (platform, template, del) => {
      let package
      const exist = await fse.exists(platformConfigFile)
      let json
      if (exist) {
        json = await fse.readJson(platformConfigFile, { throws: false })
      } else {
        json = {}
      }
      if (del) {
        delete json[platform]
      }
      else {
        try {
          package = require(`${template}/package.json`)
        } catch(e) {
          package = {
            version: 'unkown'
          }
        }
        json[platform] = package.version
      }
      await fse.outputJson(platformConfigFile, json, {spaces: '\t'})
    }

    const showHelp = async () => {
      let params = {
        commandend: 'Manage iOS/Android project',
        commands: [{
            heading: ['Usage', 'Description']
          },
          {
            key: 'platform add',
            type:'[ios|android]',
            description: 'Create a official ios or weex project'
          },
          {
            key: 'platform add',
            type:'<template | git-repo> [ios|android]',
            description: 'Create a ios or weex project with a specify template name or git repo'
          },
          {
            key: 'platform remove',
            type:'[ios|android]',
            description: 'Remove ios or weex project'
          },
          {
            key: 'platform update',
            type:'[ios|android]',
            description: 'Update ios or weex project'
          },
          {
            key: 'platform list',
            description: 'List all platform supported and installed'
          },
        ],
        options: {
          'Base': [{
            key: '--no-cache',
            description: 'Fetching latest template with no cache'
          }, {
            key: '--clone',
            description: 'If true use git clone instead of an http download. While this can be a bit slower, it does allow private repositories to be used if the appropriate SSH keys are setup'
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
      let platform = second
      let template

      if (array.length >= 3) {
        template = second
        command = first
        platform = third
      }

      if (!isWeexWorkSpace(process.cwd())) {
        logger.error('The current directory is not the project directory of weex, please check')
        return
      }

      switch(command) {
        case 'add':
          await add(platform, template);
          break;
        case 'remove':
          await remove(platform);
          break;
        case 'update':
          await update(platform, template);
          break;
        case 'list':
          await list();
          break;
        default:
          await showHelp();
          break;
      }

    }
  }
}