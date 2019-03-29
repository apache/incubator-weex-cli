import { IToolbox } from '../core/toolbox'
import { open } from '../toolbox/open-tools'

/**
 * Extensions to open files.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  // attach the feature set
  toolbox.open = open
}
