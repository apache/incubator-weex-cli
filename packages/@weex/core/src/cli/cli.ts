import { build, IToolbox } from '../index'

/**
 * Create the cli and kick it off
 */
export async function run(argv?: string[] | string): Promise<IToolbox> {
  // create a CLI runtime
  const cli = build('weex')
    .src(__dirname)
    .help()
    .version()
    .exclude(['semver', 'prompt', 'http', 'patching'])
    .create()

  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}
