import { CliConfiguration } from '../cli/cli'

export default {
  name: 'version',
  alias: 'v',
  description: 'Output the version number',
  dashed: true,
  run: ({ meta, logger, parameters }) => {
    const globalConfiguration: CliConfiguration = parameters.options.__config
    const info = meta.getModulesInfo()
    logger.warn(`${globalConfiguration.cliVersion || `[Beta]${meta.version()}`} (Core ${meta.version()})`)
    if (info && info.mods) {
      for (let mod in info.mods) {
        logger.info(`- ${mod} : v${info.mods[mod].version}`)
      }
    }
  },
}
