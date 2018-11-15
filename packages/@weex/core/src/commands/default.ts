export default {
  run: ({ parameters, runtime, logger, strings, meta }) => {
    const infoMessage = strings.isBlank(parameters.first)
      ? `Welcome to ${runtime.brand} CLI version ${meta.version()}!`
      : `Sorry, didn't recognize that command!`
    logger.info(`
  ${infoMessage}
  Type ${logger.colors.yellow(`${runtime.brand} help`)} to view common commands.`)
  },
}
