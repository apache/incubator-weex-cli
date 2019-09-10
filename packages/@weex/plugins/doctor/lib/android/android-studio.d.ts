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
import { IOSWorkflow } from '../ios/ios-workflow';
import { VersionOption } from '@weex-cli/utils/lib/base/version';
interface ValidOption {
    configured?: string;
    version?: VersionOption;
}
export declare class AndroidStudioValid {
    directory: string;
    option?: ValidOption;
    isValid: boolean;
    validationMessages: string[];
    configured: string;
    javaPath: string;
    version: VersionOption;
    constructor(directory: string, option?: ValidOption);
    init(): void;
}
export declare class AndroidStudio {
    javaPath: string;
    iosWorkflow: IOSWorkflow;
    constructor();
    latestValid(): void;
    allInstalled(): AndroidStudioValid[];
    allMacOS(): AndroidStudioValid[];
    checkForStudio(path: string): string[];
    fromMacOSBundle(bundlePath: string): AndroidStudioValid;
    fromHomeDot(homeDotDir: any): AndroidStudioValid;
    allLinuxOrWindows(): AndroidStudioValid[];
}
export {};
