Plugin for manage device.

# Environment depends on

## Window

* Android studio ， Downloaded and installed correctly Android SDK

## Mac os

- Android studio ， Downloaded and installed correctly Android SDK
- Xcode

# API

## Some option define

```tsx
export interface DeviceInfo {
  name: string,
  id: string,
  isSimulator: Boolean,
  version?: string,
}

export interface RunDeviceOptions {
  /**
   * DeviceInfo.id
   */
  id: string,

  /**
   * For ios is `xxx.app` path, if install in real machine the `xxx.app` should auth first
   * For android is `xxx.apk` path
   */
  appPath: string,

  /**
   * For ios is `BundleIdentifier` ex: com.alibaba.weex
   * For android is `com.package.name/com.package.name.ActivityName`
   * ex: com.weex.app/com.weex.app.SplashActivity
   */
  applicationId: string

  /**
   * After star the app some command string of `shell`
   * ex: -d Ws:http://102.323.33:8080
   */
  androidShellCmdString?: string
}
```

## Method

### getAndroidDeviceList

Returns a list of connected Android real machines and installed Android simulator on the current computer, where the virtual will appear even if it is not started.

@param `null`

@return `Array<DeviceInfo>`

### installAndLaunchAndroidApp

To start and install an application on an Android device, you only need to provide `RunDeviceOptions`, which works on both the simulator and the real machine. This action is error-prone and catch errors are recommended and handled accordingly.

@param `RunDeviceOptions`

@return `Promise`

### getIosDeviceList

Same as above Android

### installAndLaunchIosApp

Same as above Android，Note the difference in `RunDeviceOptions`



