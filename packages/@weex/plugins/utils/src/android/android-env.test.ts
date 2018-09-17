import AndroidEnv from './android-env'

describe('Android env', () => {
  const androidEnv = new AndroidEnv()
  test('getSdkPath', () => {
    const sdkPath = androidEnv.getSdkPath()
    expect(sdkPath && sdkPath.length > 0).toEqual(true)
  })
})
