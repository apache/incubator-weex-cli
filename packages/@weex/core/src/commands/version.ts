export default {
  name: 'version',
  alias: 'v',
  description: 'Output the version number',
  dashed: true,
  run: toolbox => {
    toolbox.logger.info(toolbox.meta.version())
  },
}
