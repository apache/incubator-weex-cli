const {
  generator,
  clone,
  getOptions
} = require('../index')
const {
  localpath
} = require('../lib/utils/localpath')
const {
  evaluate
} = require('../lib/utils/eval')
const fse = require('fs-extra');
const debug = require('debug')('create')
const path = require('path')
const async = require('async')

const exists = fse.existsSync

module.exports = {
  name: 'create',
  description: 'Create a weex project',
  run: async ({
    logger,
    parameters,
    inquirer,
    meta
  }) => {
    const first = parameters.first
    const second = parameters.second
    const options = parameters.options
    const globalConfig = options.__config

    // Support types from prompt-for which was used before
    const promptMapping = {
      string: 'input',
      boolean: 'confirm'
    };

    const showHelp = async () => {
      let params = {
        commandend: 'Create a weex project',
        commands: [{
            heading: ['Usage', 'Description']
          },
          {
            key: 'create [project-name]',
            description: 'Create a official weex project'
          },
          {
            key: 'create <template-name | git-repo> [project-name]',
            description: 'Create a project from specify template name or git repository'
          }
        ],
        options: {
          'Base': [{
            key: '--no-cache',
            description: 'Fetching latest template with no cache.'
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

    const askQuestion = async (name, templatePath) => {
      debug(`Render from local path ${templatePath}`)
      const meta = getOptions(name, templatePath)
      let propmts = []
      let keys = Object.keys(meta.prompts)
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

    if (options.version || options.v) { // version from package.json

      logger.info(`${require("../package.json").version}`);

    } else if (options.help || options.h) {
      await showHelp()
    } else {
      let templateName = globalConfig.defaultWeexTemplate || 'webpack'
      let projectName
      if (!first) {
        logger.warn('You need to provide all the required parameters.')
        logger.error('Project name cannot be empty.')
        await showHelp()
        return
      }
      if (first && second) {
        templateName = first
        projectName = second
      } else if (first) {
        projectName = first
      }
      let target = path.resolve(projectName);
      if (exists(target)) {
        let res = await inquirer.prompt([{
          type: 'confirm',
          message: 'Target directory exists. Continue?',
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
      if (localpath.isLocalPath(templateName)) {
        const templatePath = localpath.getTemplatePath(templateName);
        if (exists(templatePath)) {
          let answer = await askQuestion(projectName, templatePath)
          let metadata = Object.assign(answer, {
            destDirName: projectName,
            inPlace: target === process.cwd(),
            noEscape: true
          })
          await generator(templatePath, target, metadata)
        } else {
          logger.error(`Local template "${templatePath}" not found.`);
        }
      } else {
        const hasHash = /\//.test(templateName)
        if (!hasHash) {
          // fetch from official repo
          templateName = `${globalConfig.defaultWeexTemplateRepo || 'weex-templates'}/${templateName}`
        }
        const templatesTarget = path.join(globalConfig.templatePath, templateName)
        let spinner = logger.spin(`Download from ${templateName} repo ...`);
        const templatePath = await clone(templateName, templatesTarget, {
          cache: exists(templatesTarget) && (typeof options.cache === 'boolean' ? options.cache : true),
          clone: options.clone || false
        })
        spinner.stop();
        let answer = await askQuestion(projectName, templatePath)
        let metadata = Object.assign(answer, {
          destDirName: projectName,
          inPlace: target === process.cwd(),
          noEscape: true
        })
        await generator(templatePath, target, metadata)

      }

    }
  }
}