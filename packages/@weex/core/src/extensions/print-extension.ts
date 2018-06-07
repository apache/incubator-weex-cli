import { IToolbox } from '../core/toolbox'
import { print } from '../toolbox/print-tools'

/**
 * Extensions to print to the console.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  // attach the feature set
  toolbox.print = print
}
