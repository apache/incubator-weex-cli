import { CliConfiguration } from '../cli'
import * as path from 'path'

export default {
  name: 'config',
  alias: ['c'],
  description: 'Configure Weex Toolkit settings',
  hidden: false,
  run: async toolbox => {
    const { parameters, fs, inquirer, logger } = toolbox
    const globalConfiguration: CliConfiguration = parameters.options.__config
    const first = parameters.first
    const second = parameters.second
    const options = parameters.options
    let cache
    let third = parameters.third
    const showHelp = async (subcommand?: string) => {
      let usageTableData = [
        [logger.colors.green('Synopsis'), logger.colors.green('Usage')],
        ['$ weex config', 'Configure Weex Toolkit settings'],
      ]
      let des = {
        set: ['config set <key> <value>', 'Set key-value.'],
        get: ['config get <key>', 'Get value by key.'],
        list: ['config list [--json]', 'List key-value as string or json.'],
        delete: ['config delete <key>', 'Delete key-value by key.'],
      }
      let relatedCommandData = [
        [logger.colors.green('Command'), logger.colors.green('Description')],
        des.set,
        des.get,
        des.list,
        des.delete,
      ]
      if (subcommand && des[subcommand]) {
        logger.info('\nYou need to using like this:\n')
        let relatedCommandData = [[logger.colors.green('Command'), logger.colors.green('Description')], des[subcommand]]
        logger.table(relatedCommandData, { format: 'markdown' })
      } else {
        logger.success('\n# weex config\n')
        logger.table(usageTableData, { format: 'markdown' })
        logger.info('\nRun the config script to try to configure global weex settings')
        logger.success('\n# Related Commands\n')
        logger.table(relatedCommandData, { format: 'markdown' })
        logger.info(`\nThis script has alias(c), you can run it like \`weex c [sub-command]\``)
      }
    }
    const initGlobalConfig = async () => {
      const taobao = `http://registry.npm.taobao.org`
      const npm = `http://registry.npmjs.org`

      const questions: any = [
        {
          name: 'telemetry',
          type: 'confirm',
          message: 'May weex-toolkit anonymously report usage statistics to improve the tool over time?',
        },
        {
          name: 'registry',
          type: 'list',
          choices: [
            { name: 'use npm', value: npm, short: 'npm' },
            { name: 'use taobao (for Chinese)', value: taobao, short: 'taobao' },
          ],
          message: 'Which npm registry you perfer to use?',
        },
      ]
      const answer = await inquirer.prompt(questions)
      return {
        telemetry: answer.telemetry,
        registry: answer.registry,
      }
    }
    if (first !== 'set' && first !== 'get' && first !== 'delete' && first !== 'list') {
      await showHelp()
      return
    } else if (options.help) {
      await showHelp()
      return
    }
    const configurationPath = path.join(globalConfiguration.coreRoot, globalConfiguration.globalConfigFileName)
    const get = async (key?: string) => {
      let keys = []
      if (!cache) {
        if (fs.exists(configurationPath)) {
          cache = fs.read(configurationPath, 'json')
        } else {
          cache = await initGlobalConfig()
          fs.write(configurationPath, cache)
        }
      }
      if (key && key.indexOf('.') > -1) {
        keys = key.split('.')
      }
      if (keys.length > 0) {
        return keys.reduce((pre, cur) => {
          if (pre[cur]) {
            return pre[cur]
          }
          return ''
        }, cache)
      }
      if (key) {
        return cache[key]
      }
      return cache
    }

    const set = async (key: string, value: string | boolean) => {
      let keys = []
      if (key.indexOf('.') > -1) {
        keys = key.split('.')
      }
      if (!cache) {
        cache = await get()
      }
      if (keys.length > 0) {
        let temp = cache
        for (let i = 0; i < keys.length - 1; i++) {
          if (!temp[keys[i]]) {
            temp[keys[i]] = {}
          }
          temp = temp[keys[i]]
        }
        temp[keys[keys.length - 1]] = value
        return cache
      }
      cache[key] = value
      return cache
    }
    const remove = async (key: string) => {
      if (!cache) {
        cache = await get()
      }
      const temp = cache[key]
      if (cache[key]) {
        delete cache[key]
      }
      return temp
    }
    const list = async (format?: string) => {
      const data = await get()
      let text = []
      if (format === 'json') {
        return JSON.stringify(data)
      } else {
        for (let key in data) {
          if (typeof data[key] === 'boolean') {
            text.push(`${key} = ${data[key]}`)
          } else if (typeof data[key] === 'string') {
            text.push(`${key} = "${data[key]}"`)
          } else {
            text.push(`${key} = ${JSON.stringify(data[key])}`)
          }
        }
        return text.join('\n')
      }
    }
    const save = async (data?: any) => {
      fs.write(configurationPath, data || cache)
    }
    switch (first) {
      case 'get':
        if (second) {
          let value = await get(second)
          if (typeof value === 'boolean') {
            logger.info(`- ${second} = ${value}`)
          } else {
            logger.info(`- ${second} = "${value}"`)
          }
        } else {
          await showHelp(first)
        }
        break
      case 'set':
        if (second && third) {
          if (third === 'true') {
            third = true
          } else if (third === 'false') {
            third = false
          }
          let data = await set(second, third)
          logger.success(`\nset ${second}=${third} success\n`)
          if (data[second] === third) {
            if (typeof third === 'boolean') {
              logger.info(`- ${second} = ${third}`)
            } else {
              logger.info(`- ${second} = "${third}"`)
            }
          }
          await save()
        } else {
          await showHelp(first)
        }
        break
      case 'list':
        let listdata
        if (options.json) {
          listdata = await list('json')
        } else {
          listdata = await list()
        }
        logger.success(`\nconfigurations:\n`)
        logger.info(listdata)
        break
      case 'delete':
        if (second) {
          let value = await remove(second)
          logger.success(`\ndelete success\n`)
          if (typeof value === 'boolean') {
            logger.info(`- ${second} = ${value}`)
          } else {
            logger.info(`- ${second} = "${value}"`)
          }
          await save()
        } else {
          await showHelp(first)
        }
        break
      default:
        await showHelp()
        break
    }
  },
}
