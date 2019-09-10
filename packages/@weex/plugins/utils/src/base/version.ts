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
export const versionPattern = /^(\d+)(\.(\d+)(\.(\d+))?)?/

export interface VersionOption {
  major: number
  minor: number
  patch: number
}

export function versionParse(text: string): VersionOption {
  const match = text.match(versionPattern)
  if (!match) {
    return null
  }
  const result: VersionOption = {
    major: Number(match[1]),
    minor: Number(match[3]),
    patch: Number(match[5]),
  }

  return result
}

/**
 * check non-negative version
 * @param version
 */
export function versionNonNegative(version: VersionOption): boolean {
  if (!version) {
    return false
  }
  if (version.major < 0 || version.minor < 0 || version.patch < 0) {
    return false
  }
  return true
}

export function compareVersion(version: VersionOption, otherVersion: VersionOption): boolean {
  if (!version || !otherVersion) {
    return false
  }
  if (version.major < otherVersion.major) {
    return false
  } else if (version.major >= otherVersion.major) {
    return true
  } else if (version.minor < otherVersion.minor) {
    return false
  } else if (version.minor >= otherVersion.minor) {
    return true
  } else if (version.patch < otherVersion.patch) {
    return false
  } else if (version.patch >= otherVersion.patch) {
    return true
  }
}
