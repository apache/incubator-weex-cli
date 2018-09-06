import Builder from '../base/builder'
import { BuilderConfig } from '../common/builder'

export default class IosRunner extends Builder {

  protected config: BuilderConfig

  constructor(options: BuilderConfig) {
    super(options)
  }

  buildNative() {
  }
}