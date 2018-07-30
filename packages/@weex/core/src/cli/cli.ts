import { build, IToolbox } from '../index'

/**
 * Create the cli and kick it off
 */
export async function run(
  argv?: string[] | string,
  options?: { help?: any; defaultCommand?: any; command?: any; plugin?: string; plugins?: string; exclude?: string[] },
): Promise<IToolbox> {
  // create a CLI runtime
  const cli = build('weex')
    .src(__dirname)
    .help(options.help)
    .version(options.command)
    .exclude(options.exclude)
    .plugins(options.plugins)
    .defaultCommand(options.defaultCommand)
    .create()
  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}
