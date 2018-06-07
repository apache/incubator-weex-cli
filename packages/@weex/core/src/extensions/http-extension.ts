import { IToolbox } from '../core/toolbox'
import { http } from '../toolbox/http-tools'

/**
 * An extension to talk to ye olde internet.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  toolbox.http = http
}
