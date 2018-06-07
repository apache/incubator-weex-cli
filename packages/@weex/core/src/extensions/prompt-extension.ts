import { IToolbox } from '../core/toolbox'
import { prompt } from '../toolbox/prompt-tools'

/**
 * Provides user input prompts via enquirer.js.
 *
 * @param toolbox The running toolbox.
 */
export default function attach(toolbox: IToolbox): void {
  toolbox.prompt = prompt
}
