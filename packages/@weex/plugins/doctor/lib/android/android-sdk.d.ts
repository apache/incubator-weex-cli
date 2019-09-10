/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { VersionOption } from '@weex-cli/utils/lib/base/version';
import { AndroidStudio } from './android-studio';
export declare const kAndroidHome: String;
export declare const mustAndroidSdkVersion: number;
export declare class AndroidSdkVersion {
    sdk: AndroidSdk;
    sdkLevel: number;
    platformName: string;
    buildToolsVersion: VersionOption;
    constructor(sdk: AndroidSdk, sdkLevel: number, platformName: string, buildToolsVersion: VersionOption);
    readonly buildToolsVersionName: string;
    readonly androidJarPath: string;
    readonly aaptPath: string;
    getPlatformsPath(itemName: string): string;
    getBuildToolsPath(binaryName: string): string;
    validateSdkWellFormed(): string[];
    exists(path: string): string;
    canRun(path: string, args?: string[]): string;
}
export declare class AndroidSdk {
    directory: string;
    sdkVersions: AndroidSdkVersion[];
    latestVersion: AndroidSdkVersion;
    androidStudio: AndroidStudio;
    isMustAndroidSdkVersion: boolean;
    constructor();
    readonly adbPath: string;
    readonly sdkManagerPath: string;
    findJavaBinary(): string;
    getPlatformToolsPath(binaryName: string): string;
    validateSdkWellFormed(): string[];
    locateAndroidSdk(): void;
    findAndroidHomeDir(): string;
    validSdkDirectory(dir: any): boolean;
    init(): void;
}
