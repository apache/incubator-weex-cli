export interface MetaOptions {
  appstart: string
  append: string
  commandend: string
  optionend: string
  commands: [{
    heading?: string[]
    key: string
    alias: string[] | string
    type: string
    default: string
    required: boolean
    description: string
  }] | {
    [key: string]: [{
      heading?: string[]
      key: string
      alias: string[] | string
      type: string
      default: string
      required: boolean
      overrideRequired: boolean
      description: string
    }]
  }
  options: [{
    heading?: string[]
    key: string
    alias: string[] | string
    type: string
    default: string
    required: boolean
    overrideRequired: boolean
    description: string
  }] | {
    [key: string]: [{
      heading?: string[]
      key: string
      alias: string[] | string
      type: string
      default: string
      required: boolean
      overrideRequired: boolean
      description: string
    }]
  }
}