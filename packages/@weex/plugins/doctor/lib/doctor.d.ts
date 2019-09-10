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
import { AndroidWorkflow } from './android/android-workflow';
import { IOSWorkflow } from './ios/ios-workflow';
export declare const enum ValidationType {
    missing = 0,
    partial = 1,
    installed = 2
}
export declare class ValidationResult {
    type: ValidationType;
    messages: ValidationMessage[];
    statusInfo?: string;
    constructor(type: ValidationType, messages: ValidationMessage[], statusInfo?: string);
    readonly leadingBox: String;
}
export declare class Doctor {
    validators: DoctorValidator[];
    iosWorkflow: IOSWorkflow;
    androidWorkflow: AndroidWorkflow;
    constructor();
    getValidators(): void;
    startValidatorTasks(): any[];
    /**
     * diagnose
     */
    diagnose(): string;
    mergeValidationResults(results: ValidationResult[]): ValidationResult;
}
export declare abstract class Workflow {
    abstract readonly appliesToHostPlatform: boolean;
}
export declare abstract class DoctorValidator {
    title: string;
    abstract validate(): any;
}
export declare class ValidationMessage {
    message: string;
    isError: boolean;
    isWaring: boolean;
    constructor(message: string, isError?: boolean, isWaring?: boolean);
}
