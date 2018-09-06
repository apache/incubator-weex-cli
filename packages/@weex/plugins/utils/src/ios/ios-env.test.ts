import 'jest'
import IosEnv from './ios-env'

// If xcode not installed will not pass
test('Ios env isInstalledXcode', () => {
  const xcodePath = new IosEnv().isInstalledXcode(false)
})

test('Ios env getXcodeVersion', () => {
  const version = new IosEnv().getXcodeVersion()
})