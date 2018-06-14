import { IToolbox } from '../core/toolbox'
import { fs } from '../toolbox/fs-tools'

/**
 * Extensions to fs.  Brought to you by fs-jetpack.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox) {
  toolbox.fs = fs
}
