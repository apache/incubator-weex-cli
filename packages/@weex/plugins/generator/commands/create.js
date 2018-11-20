const { generator, clone, getOptions } = require('../index')
const { localpath } = require('../lib/utils/localpath')
const { evaluate } = require('../lib/utils/eval')
const exists = require('fs').existsSync;
const debug = require('debug')('create')
const path = require('path')
const async = require('async')

module.exports = {
  name: 'create',
  description: 'Create a weex project',
  run: async (
    {
      logger,
      parameters,
      inquirer,
      meta
    }
  ) => {
    const DEFAULT_TEMPLATE = 'webpack'
    const first = parameters.first
    const second = parameters.second
    const options = parameters.options
    // Support types from prompt-for which was used before
    const promptMapping = {
      string: 'input',
      boolean: 'confirm'
    };

    const showHelp = async () => {
      let params = {
        commandend: 'Create a weex project',
        commands: [
          {
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
          'Base': [
            {
              key: '--no-cache',
              description: 'Fetching latest template with no cache.'
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
    
    if (options.version || options.v) { // version from package.json

      logger.info(`v${require("../package.json").version}`);

    } else if (options.help || options.h) {
      await showHelp()
    } else {
      let templateName = DEFAULT_TEMPLATE
      let projectName
      if(!first) {
        logger.warn('You need to provide all the required parameters.')
        logger.error('Project name cannot be empty.')
        await showHelp()
        return
      }
      if (first && second) {
        templateName = first
        projectName = second
      }
      else if (first) {
        projectName = first
      }
      let target = path.resolve(projectName);

      if (localpath.isLocalPath(templateName)) {
        const templatePath = localpath.getTemplatePath(templateName);
        if (exists(templatePath)) {
          logger.log(`Render from local path ${templatePath}`)
          const meta = getOptions(projectName, templatePath)
          let propmts = []
          let keys = Object.keys(meta.prompts)
          keys.forEach(key => {
            let prompt = meta.prompts[key]
            promptDefault = prompt.default || ''
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
          let metadata = Object.assign(meta, answer, {
            destDirName: projectName,
            inPlace: target === process.cwd(),
            noEscape: true
          })
          await generator(templatePath, target, metadata)
        }
        else {
          logger.error(`Local template "${templatePath}" not found.`);
        }
      }
      else {

      }

    }
  }
}