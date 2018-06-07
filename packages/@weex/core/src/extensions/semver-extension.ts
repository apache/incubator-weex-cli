import { IToolbox } from '../core/toolbox'
import { semver } from '../toolbox/semver-tools'

/**
 * Extensions to access semver and helpers
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  toolbox.semver = semver
}
