import { generateHelp, commandInfo, getVersion, getModulesInfo } from '../toolbox/meta-tools'
import { IToolbox } from '../core/toolbox'
import { MetaOptions } from '../toolbox/meta-types'
export interface IMeta {
  version: () => string
  commandInfo: () => string[][]
  getModulesInfo: () => any[]
  generateHelp: (param: MetaOptions, brand?: string) => any[]
}

/**
 * Extension that lets you learn more about the currently running CLI.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  const meta: IMeta = {
    version: () => getVersion(toolbox),
    commandInfo: () => commandInfo(toolbox),
    getModulesInfo: () => getModulesInfo(toolbox),
    generateHelp,
  }
  toolbox.meta = meta
}
