export interface ConfigType {
  [key: string]: any
}

export default class ConfigResolver {
  static config: ConfigType = {
    remoteDebugPort: '9222',
  }

  constructor(options?: ConfigType) {
    if (options) {
      ConfigResolver.config = {
        ...ConfigResolver.config,
        ...options,
      }
    }
  }

  get(key: string) {
    return ConfigResolver.config[key]
  }

  set(key: string, value: any) {
    ConfigResolver.config[key] = value
  }
}

export const Config = new ConfigResolver()
