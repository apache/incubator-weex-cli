import { IToolbox } from '../core/toolbox'
import { patching } from '../toolbox/patching-tools'

/**
 * Builds the patching feature.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  toolbox.patching = patching
}
