export interface IInquirer {
  prompts: any
  Separator: any
  ui: any
  restoreDefaultPrompts(): void
  /**
   * Expose helper functions on the top level for easiest usage by common users
   * @param name
   * @param prompt
   */
  registerPrompt(name: string, prompt: any): void
  /**
   * Create a new self-contained prompt module.
   * @param opt Object specifying input and output streams for the prompt
   */
  createPromptModule(opt?: any): any
  /**
   * Public CLI helper interface
   * @param questions Questions settings array
   * @param cb Callback being passed the user answers
   * @return
   */
  prompt(questions: any): any
}
