import * as path from 'path'

export default class Config {
  private root:string =  process.cwd()
  private rootPath: string =  path.join(process.cwd(), './plugins')
  private filename: string =  'plugins.json'
  private androidPath: string =  path.join(process.cwd(), './platforms/android')
  private iosPath: string = path.join(process.cwd(), './platforms/ios')
  private androidConfigFilename:string ='.weex_plugin.json'
  private defaultConfig: any = {
    ios: [],
    web: [],
    android: []
  }

  constructor (options: any) {
    this.root = options.root || this.root
    this.rootPath = options.rootPath || this.rootPath
    this.filename = options.filename || this.filename
    this.androidPath = options.androidPath || this.androidPath
    this.iosPath = options.iosPath || this.iosPath
    this.androidConfigFilename = options.androidConfigFilename || this.androidConfigFilename
    this.defaultConfig = options.defaultConfig || this.defaultConfig
  }

  get () {
    
  }
}