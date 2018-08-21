import { IToolbox } from '../core/toolbox'
import { install } from '../toolbox/installer-tools'

/**
 * Extensions to fs.  Brought to you by fs-jetpack.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox) {
  toolbox.install = install
}
