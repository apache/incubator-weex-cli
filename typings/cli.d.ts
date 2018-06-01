declare module ICommandLine {

  interface ICommandCore {

  }
  
  interface CommandCoreData {
    coreName?: string,
    coreRoot?: string,
    coreTrash?: string,
    corePath?: string
  }
  
  interface CommandCoreConfig {
    home?: string,
    registry: string,
    nodeVersion?: string,
    nodeUsed?: string,
    env?: string,
    telemetry?: boolean
  }

  interface Context {
    env: {
      home: string,
      version: string,
      registry: string,
      os: string
    },
    util: {
      logger: {
        setLevel(level: string):void,
        getLevel():string,
        info():void,
        warn():void,
        debug():void,
        error():void,
        fatal():void,
        out():void,
        warnWithLabel():void,
        log():void,
        write():void,
        printInfoMessageOnSameLine():void,
        printMsgWithTimeout():void,
      },
      open(link: string, options?:any):Promise<any>,
      compile(options: {
        from: string,
        to: string,
        options?: {
          [key:string]: any
        }
      }):Promise<any>,
      git: {
        [key:string]: any
      },
      download(url: string, options?:any): Promise<any>
    },
    config: {
      get(key?: string): Promise<string[]> | Promise<string>,
      set(key: string, value: any): Promise<any>,
      save(): Promise<any>
    },
    ui: {
      confirm(msg: string): Promise<boolean>,
      list(list: any[]): Promise<any>,
      input(): Promise<string>,
      prompt(msg: any): Promise<any>,
      table(data: any): Promise<any>,
      spinner: {
        start(msg: string): void,
        stop(): void
      },
      colors: {
        [key: string]: any
      },
      process?: {
        start(label?: string): void,
        setValue(number: number): void,
        complete(): void
      }
    },
    generator: any,
    cli: {
      command: any,
      argument: any,
      option: any,
      version: any,
      action: any,
      usage: any
    },
    promise(resolve: any, reject: any): any,
    io: {
      get: any,
      post: any,
      got: any
    }
  }
}
