import { build, IToolbox } from '../index'

/**
 * Create the cli and kick it off
 */
export async function run(
  argv?: string[] | string,
  options: {
    help?: any
    defaultCommand?: any
    version?: any
    plugin?: {
      value?: string
      options?: any
    }
    plugins?: {
      value?: string
      options?: any
    }
    exclude?: string[]
  } = {},
): Promise<IToolbox> {
  // create a CLI runtime
  const cli = build('weex')
    .src(__dirname)
    .help(options.help)
    .version(options.version)
    .exclude(options.exclude)
    .plugin(options.plugin && options.plugin.value || '', options.plugin && options.plugin.options || '')
    .plugins(options.plugins && options.plugins.value || '', options.plugins && options.plugins.options || '')
    .defaultCommand(options.defaultCommand)
    .create()
  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}
