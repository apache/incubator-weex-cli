import { IToolbox } from '../core/toolbox'
import { inquirer } from '../toolbox/inquirer-tools'

/**
 * Provides user input prompts via enquirer.js.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  toolbox.inquirer = inquirer
}
