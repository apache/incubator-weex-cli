import * as path from 'path'

export default class Config {
  public root: string = process.cwd()
  public rootPath: string = path.join(process.cwd(), './plugins')
  public filename: string = 'plugins.json'
  public androidPath: string = path.join(process.cwd(), './platforms/android')
  public iosPath: string = path.join(process.cwd(), './platforms/ios')
  public androidConfigFilename: string = '.weex_plugin.json'
  public defaultConfig: any = {
    ios: [],
    web: [],
    android: [],
  }

  constructor(options: any = {}) {
    this.root = options.root || this.root
    this.rootPath = options.rootPath || this.rootPath
    this.filename = options.filename || this.filename
    this.androidPath = options.androidPath || this.androidPath
    this.iosPath = options.iosPath || this.iosPath
    this.androidConfigFilename = options.androidConfigFilename || this.androidConfigFilename
    this.defaultConfig = options.defaultConfig || this.defaultConfig
  }
}
