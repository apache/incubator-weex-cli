import { strings } from '../toolbox/string-tools'
import { IToolbox } from '../core/toolbox'

/**
 * Attaches some string helpers for convenience.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  toolbox.strings = strings
}
