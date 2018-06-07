import { IToolbox } from '../core/toolbox'
import { filesystem } from '../toolbox/filesystem-tools'

/**
 * Extensions to filesystem.  Brought to you by fs-jetpack.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox) {
  toolbox.filesystem = filesystem
}
