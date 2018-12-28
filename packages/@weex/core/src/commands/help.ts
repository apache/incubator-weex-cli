export default {
  name: 'help',
  alias: 'h',
  dashed: true,
  run: async ({ parameters, logger, meta }) => {
    const showHelp = async (subcommand?: string) => {
      let highLightKeys = {
        platform: logger.colors.yellow('<Platform>'),
        plugin: logger.colors.yellow('<Plugin>'),
        package: logger.colors.yellow('<Package>'),
        command: logger.colors.yellow('<Command>'),
      }
      let helps = {
        help: [`help ${highLightKeys.command}`, 'Shows additional information about the commands in the terminal.'],
        debug: [`debug <file|folder>`, 'Start weex debugger.'],
        create: ['create <template-name> [project-name]', 'Create a weex project.'],
        compile: ['compile [source] [target]', 'Compile .we/.vue file.'],
        preview: ['preview [file|folder]', 'Preview a weex page.'],
        platform: ['platform', 'Manage ios/android platforms.'],
        'platform-add': [`platform add ${highLightKeys.platform}`, 'Add ios/android platform.'],
        'platform-remove': [`platform remove ${highLightKeys.platform}`, 'Remove ios/android platform.'],
        'platform-list': [`platform list`, 'List ios/android platform.'],
        'platform-update': [`platform update ${highLightKeys.platform}`, 'Update ios/android platform.'],
        plugin: ['plugin', 'Manage weex plugins.'],
        'plugin-add': [`plugin add ${highLightKeys.plugin}`, 'Add weex ios/android/web plugin.'],
        'plugin-remove': [`plugin remove ${highLightKeys.plugin}`, 'Remove weex ios/android/web plugin.'],
        'plugin-install': [`plugin install ${highLightKeys.platform}`, 'Install plugin for specified platform.'],
        // 'plugin-list': [`plugin list`, 'List weex ios/android plugin.'],
        // 'plugin-search': [`plugin search ${highLightKeys.plugin}`, 'Search weex ios/android plugin.'],
        'plugin-create': [`plugin create [plugin]`, 'Create a weex plugin template.'],
        run: [`run ${highLightKeys.platform}`, 'Build android/ios application and run.'],
        build: [`build ${highLightKeys.platform}`, 'Build android/ios application for production.'],
        doctor: [
          'doctor',
          'Checks your system for configuration problems which might prevent the Weex CLI from working properly.',
        ],
        // autocomplete: ['autocomplete', 'Configures your current command-line completion settings.'],
        'device-list': [`device list`, 'Lists all recognized connected physical or virtual devices.'],
        // 'device-log': [`device log`, 'Opens the log stream for the selected device.'],
        'device-run': [`device run`, 'Choose one simulator to run.'],
        install: [`install ${highLightKeys.package}`, 'Install plugin for the Weex Cli.'],
        uninstall: [`uninstall ${highLightKeys.package}`, 'Uninstall plugin for the Weex Cli.'],
        repair: [`repair ${highLightKeys.command}`, 'Repair cli dependencies or the core.'],
        lint: [`lint <file|folder>`, 'Lint codes and generate code report.'],
        config: [`config`, 'Configure Weex Toolkit settings.'],
        'config-set': [`config set <key> <value>`, 'Set key-value.'],
        'config-get': [`config get <key>`, 'Get value by key.'],
        'config-list': [`config list [--json]`, 'List key-value as string or json.'],
        'config-delete': [`config delete <key>`, 'Delete key-value by key.'],
      }
      let usageTableData = [
        [logger.colors.success('Synopsis'), logger.colors.success('Usage')],
        ['General', `${logger.colors.yellow('$ weex <Command> [Command Parameters] [--command <Options>]')}`],
      ]
      let generalCommandData = [
        [logger.colors.success('Command'), logger.colors.success('Description')],
        helps.help,
        // helps.autocomplete,
        helps.doctor,
        helps.repair,
        helps.install,
        helps.uninstall,
      ]
      let projectDevelopmentData = [
        [logger.colors.success('Command'), logger.colors.success('Description')],
        helps.create,
        helps.debug,
        helps.compile,
        helps.preview,
        helps.platform,
        helps['platform-add'],
        helps['platform-remove'],
        helps['platform-list'],
        helps['platform-update'],
        helps.plugin,
        helps['plugin-add'],
        helps['plugin-remove'],
        helps['plugin-install'],
        // helps['plugin-update'],
        // helps['plugin-search'],
        helps['plugin-create'],
        helps.run,
        helps.build,
        helps.lint,
      ]
      let deviceData = [
        [logger.colors.success('Command'), logger.colors.success('Description')],
        // helps['device-log'],
        helps['device-run'],
        helps['device-list'],
      ]
      let configurationData = [
        [logger.colors.success('Command'), logger.colors.success('Description')],
        helps.config,
        helps['config-set'],
        helps['config-get'],
        helps['config-list'],
        helps['config-delete'],
      ]
      let thirdPartData = [[logger.colors.success('Command'), logger.colors.success('Description')]]
      let globalOptionData = [
        [logger.colors.success('Option'), logger.colors.success('Description')],
        [`--help, -h`, 'Prints help about the selected command in the console.'],
        [`--version`, 'Prints the client version.'],
        // [`--verbose`, 'Prints a detailed diagnostic log for the execution of the current command.'],
      ]
      const info = meta.getModulesInfo()
      if (info && info.mods) {
        for (let mod in info.mods) {
          if (!/@weex-cli/.test(mod) && Array.isArray(info.mods[mod].commands)) {
            info.mods[mod].commands.forEach(cmd => {
              if (cmd.alias) {
                thirdPartData.push([`${cmd.name} (${cmd.alias})`, cmd.description])
              } else {
                thirdPartData.push([`${cmd.name}`, cmd.description])
              }
            })
          }
        }
      }
      if (subcommand && helps[subcommand]) {
        logger.info('\nUsage:\n')
        let relatedCommandData = [
          [logger.colors.success('Command'), logger.colors.success('Description')],
          helps[subcommand],
        ]
        logger.table(relatedCommandData, { format: 'markdown' })
      } else {
        logger.warn('\nWeex Cli\n')
        logger.table(usageTableData, { format: 'markdown' })
        logger.success('\n# General Commands\n')
        logger.table(generalCommandData, { format: 'markdown' })
        logger.success('\n# Project Development Commands\n')
        logger.table(projectDevelopmentData, { format: 'markdown' })
        logger.success('\n# Device Commands\n')
        logger.table(deviceData, { format: 'markdown' })
        logger.success('\n# Configuration Commands\n')
        logger.table(configurationData, { format: 'markdown' })
        logger.success('\n# Third Part Commands\n')
        logger.table(thirdPartData, { format: 'markdown' })
        logger.success('\n# Global Options\n')
        logger.table(globalOptionData, { format: 'markdown' })
      }
    }
    const subcommand = parameters.string
    if (subcommand) {
      await showHelp(subcommand.replace(' ', '-'))
    } else {
      await showHelp()
    }
  },
}
