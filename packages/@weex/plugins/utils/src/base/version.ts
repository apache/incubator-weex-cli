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
