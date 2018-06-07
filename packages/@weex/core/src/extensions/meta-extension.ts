import { commandInfo, getVersion } from '../toolbox/meta-tools'
import { IToolbox } from '../core/toolbox'

export interface IMeta {
  version: () => string
  commandInfo: () => string[][]
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
  }
  toolbox.meta = meta
}
