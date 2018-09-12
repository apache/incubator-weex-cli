const fs =  require('fs')
const path = require('path')

/**
 * Help get test config and show warning
 * `test.config.json` is in project root path
 */

export default class TestHelp {
  private projectPath: string
  private config: any = null

  constructor(projectPath) {
    this.projectPath = projectPath
    this.getTestConfig()
  }

  public getTestConfig() {
    const configPath = path.join(this.projectPath, 'test.config.json')

    if (!fs.existsSync(configPath)) {
      console.warn('Please create `test.config.json` in project root path')
      console.warn('Please try copy `./test/test.config.template.json` to `./test.config.json`, and edit it')
      return null
    }

    try {
      this.config = JSON.parse(fs.readFileSync(configPath).toString() || '{}')
      return this.config
    } catch (e) {
      console.error('Get test config fail: ', e)
      return null
    }
  }

  public getTestConfigByKey(key: string, keyExplain?: string) {
    const config = this.config

    if (config === null) {
      return null
    }

    const value = config[key]

    if (value === undefined) {
      console.warn(`Please set the key : ${key} in 'test.config.json'`)
      console.warn(`The key: ${key} , ${keyExplain}`)
      return null
    }

    return config[key]
  }

}