// Android SDK layout:

// $ANDROID_HOME/platform-tools/adb

// $ANDROID_HOME/build-tools/19.1.0/aapt, dx, zipalign
// $ANDROID_HOME/build-tools/22.0.1/aapt
// $ANDROID_HOME/build-tools/23.0.2/aapt
// $ANDROID_HOME/build-tools/24.0.0-preview/aapt
// $ANDROID_HOME/build-tools/25.0.2/apksigner

// $ANDROID_HOME/platforms/android-22/android.jar
// $ANDROID_HOME/platforms/android-23/android.jar
// $ANDROID_HOME/platforms/android-N/android.jar

import * as path from 'path';
import * as fs from 'fs';
import { isLinux, isMacOS, isWindows, homeDirPath } from '../base/platform';

const kAndroidHome: String = 'ANDROID_HOME';
const numberedAndroidPlatformRe: RegExp = new RegExp('^android-([0-9]+)$');
const sdkVersionRe: RegExp = new RegExp('^ro.build.version.sdk=([0-9]+)$');

// The minimum Android SDK version we support.
const minimumAndroidSdkVersion:number = 25;

export class AndroidSdk {
  public directory: string;

  constructor () {
    this.init();
  }

  // public locateAndroidSdk() {

  // }

  public findAndroidHomeDir() {
    let androidHomeDir: string;
    if (process.env[`${kAndroidHome}`]) {
      androidHomeDir = process.env[`${kAndroidHome}`;
    } else if (homeDirPath) {
      if (isLinux) {
        androidHomeDir = path.join(homeDirPath, 'Android', 'Sdk');
      } else if (isMacOS) {
        androidHomeDir = path.join(homeDirPath, 'Library', 'Android', 'sdk');
      } else if (isWindows) {
        androidHomeDir = path.join(homeDirPath, 'AppData', 'Local', 'Android', 'sdk');
      }
    }

    if (androidHomeDir) {
      if (this.validSdkDirectory(androidHomeDir)) {
        return androidHomeDir;
      }
      if (this.validSdkDirectory(path.join(androidHomeDir, 'sdk'))) {
        return path.join(androidHomeDir, 'sdk');
      }
    }
  }

  public validSdkDirectory(dir) {
    const dirPath = path.join(dir,'platform-tools');
    if (dirPath) {
      return fs.statSync(dirPath).isDirectory();
    }
    return false;
  }

  public init() {
    if (!this.directory) {
      return;
    }
    let platforms: string[] = []; // android-23 android-25 android-26 android-27...
    const platformsDir: string = path.join(this.directory, 'platforms');

    let buildTools: string[] = []; // 23.0.1 25.0.3 26.0.0 26.0.2 27.0.3...
    const buildToolsDir: string = path.join(this.directory, 'build-tools');

    if (fs.existsSync(platformsDir)) {
      platforms = fs.readdirSync(platformsDir);
    }

    if (fs.existsSync(buildToolsDir)) {
      buildTools = fs.readdirSync(buildToolsDir);
    }
  }

}