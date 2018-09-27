import { Workflow, ValidationType, ValidationMessage, ValidationResult, DoctorValidator } from '../doctor';
import { kAndroidHome, AndroidSdk } from './android-sdk';

const licenseAccepted = new RegExp('All SDK package licenses accepted.');

enum LicensesAccepted {
  none,
  some,
  all,
  unknown,
}

export class AndroidWorkflow implements Workflow {
  get appliesToHostPlatform():boolean {
    return true;
  }
}

export class AndroidValidator implements DoctorValidator {
  public title: string;
  public messages: ValidationMessage[] = [];
  public androidSdk: AndroidSdk = new AndroidSdk();
  constructor() {
    this.title = 'Android toolchain - develop for Android devices';
  }

  public validate () {
    // android-sdk
    if (!this.androidSdk.directory) {
      // No Android SDK found.
      if (process.env[`${kAndroidHome}`]) {
        const androidHomeDir:string = process.env[`${kAndroidHome}`];
        this.messages.push(
          new ValidationMessage(
            `${kAndroidHome} = ${androidHomeDir}
            but Android SDK not found at this location.`,
            true /* isError */,
          ),
        )
      } else {
        this.messages.push(
          new ValidationMessage(
            `Unable to locate Android SDK.
            Install Android Studio from: https://developer.android.com/studio/index.html
            On first launch it will assist you in installing the Android SDK components.
            If Android SDK has been installed to a custom location, set ${kAndroidHome} to that location.`,
            true /* isError */,
          ),
        )
      }
      return new ValidationResult(ValidationType.missing, this.messages);
    }

    this.messages.push(
      new ValidationMessage(
        `Android SDK at ${this.androidSdk.directory}`,
      ),
    );

    let sdkVersionText: string;
    if (this.androidSdk.latestVersion) {
      sdkVersionText = `Android SDK ${this.androidSdk.latestVersion.buildToolsVersionName}`;
      this.messages.push(
        new ValidationMessage(
          `Platform ${this.androidSdk.latestVersion.platformName}, build-tools ${this.androidSdk.latestVersion.buildToolsVersionName}`
        ),
      )
    }

    if (process.env[`${kAndroidHome}`]) {
      const androidHomeDir:string = process.env[`${kAndroidHome}`];
      this.messages.push(
        new ValidationMessage(
          `${kAndroidHome} = ${androidHomeDir}\n`
        ),
      )
    }

    const validationResult = this.androidSdk.validateSdkWellFormed();

    if (validationResult.length) {
      // Android SDK is not functional.
      validationResult.forEach(message => {
        this.messages.push(
          new ValidationMessage(
            message,
            true /* isError */,
          ),
        );
      });
      this.messages.push(
        new ValidationMessage(
          `Try re-installing or updating your Android SDK,
          visit https://flutter.io/setup/#android-setup for detailed instructions.`
        ),
      );
      return new ValidationResult(ValidationType.partial, this.messages, sdkVersionText)
    }

    // Now check for the JDK.
    // const javaBinary = AndroidSdk.findJavaBinary();

    // Check JDK version.

    // Check for licenses.

    // Success.
    return new ValidationResult(ValidationType.installed, this.messages, sdkVersionText);
  }

  public licensesAccepted() {
    let status: LicensesAccepted;
  }

}
