import { IToolbox } from '../core/toolbox'
import { install } from '../toolbox/installer-tools'

/**
 * Extensions to installer.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox) {
  toolbox.install = install
}
