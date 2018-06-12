import { IToolbox } from '../core/toolbox'
import { logger } from '../toolbox/logger-tools'

/**
 * Extensions to print to the console.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  // attach the feature set
  toolbox.logger = logger
}
