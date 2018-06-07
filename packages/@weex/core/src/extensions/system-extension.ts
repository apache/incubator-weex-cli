import { IToolbox } from '../core/toolbox'
import { system } from '../toolbox/system-tools'

/**
 * Extensions to launch processes and open files.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox) {
  toolbox.system = system
}
