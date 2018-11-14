export default {
  name: 'version',
  alias: 'v',
  description: 'Output the version number',
  dashed: true,
  run: ({ meta, logger }) => {
    const info = meta.getModulesInfo()
    logger.warn(meta.version())
    if (info && info.mods) {
      for (let mod in info.mods) {
        logger.info(`- ${mod} : v${info.mods[mod].version}`)
      }
    }
  },
}
