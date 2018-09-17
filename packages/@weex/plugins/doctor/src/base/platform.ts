export const isMacOS = process.platform === 'darwin';
export const isWindows = process.platform === 'win32';
export const isLinux = process.platform === 'linux';

export const homeDirPath = process.env.HOME || process.env.USERPROFILE;
