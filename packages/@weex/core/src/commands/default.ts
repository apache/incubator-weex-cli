export default {
  run: ({ parameters, runtime, logger, strings, meta }) => {
    const infoMessage = strings.isBlank(parameters.first)
      ? `Welcome to ${logger.colors.cyan(runtime.brand)} CLI version ${meta.version()}!`
      : `Sorry, didn't recognize that command!`
    logger.info(`
  ${infoMessage}
  Type ${logger.colors.magenta(`${runtime.brand} --help`)} to view common commands.`)
  },
}
