export default {
  name: 'help',
  alias: 'h',
  dashed: true,
  run: context => {
    context.logger.printHelp(context)
  },
}
