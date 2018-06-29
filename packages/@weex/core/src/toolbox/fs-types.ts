export interface IFilesystem {
  /**
   * Convenience property for `os.EOL`.
   */
  eol: string

  /**
   * Convenience property for `path.sep`.
   */
  separator: string

  /**
   * Convenience property for `os.homedir` function
   */
  homedir: () => string

  /**
   * Appends given data to the end of file. If file or any parent directory doesn't exist it will be created.
   *
   * @param path The path to the file.
   * @param data The data to append.
   * @param options Additional options.
   */
  append: (path: string, data: string | Buffer, options?: IFilesystemAppendOptions) => void

  /**
   * Appends given data to the end of file. If file or any parent directory doesn't exist it will be created.
   *
   * @param path The path to the file.
   * @param data The data to append.
   * @param options Additional options.
   */
  appendAsync: (path: string, data: string | Buffer, options?: IFilesystemAppendOptions) => Promise<void>

  /** Copies given file or directory (with everything inside). */
  copy: (from: string, to: string, options?: IFilesystemCopyOptions) => void

  /** Copies given file or directory (with everything inside). */
  copyAsync: (from: string, to: string, options?: IFilesystemCopyOptions) => Promise<void>

  /** See Node's fs.createReadStream. */
  createReadStream: (path: string | Buffer | URL, options: any) => any

  /** See Node's fs.createWriteStream. */
  createWriteStream: (path: string | Buffer | URL, options: any) => any

  /** Returns Current Working Directory (CWD) for this instance of jetpack, or creates new jetpack object with given path as its internal CWD. */
  cwd: (...strings) => any

  /**
   * Ensures that directory on given path exists and meets given criteria.
   *
   * If any criterium is not met it will be after this call. If any parent directory in path doesn't exist it will be created (like mkdir -p).
   */
  dir: (path: string, options?: IFilesystemDirOptions) => any

  /**
   * Ensures that directory on given path exists and meets given criteria.
   *
   * If any criterium is not met it will be after this call. If any parent directory in path doesn't exist it will be created (like mkdir -p).
   */
  dirAsync: (path: string, options?: IFilesystemDirOptions) => Promise<any>

  /**
   * Checks whether something exists on given path.
   */
  exists: (path: string) => false | 'dir' | 'file' | 'other'

  /**
   * Checks whether something exists on given path.
   */
  existsAsync: (path: string) => Promise<false | 'dir' | 'file' | 'other'>

  /**
   * Ensures that file exists and meets given criteria.
   *
   * If any criterium is not met it will be after this call. If any parent directory in path doesn't exist it will be created (like mkdir -p).
   */
  file: (path: string, options: IFilesystemFileOptions) => any

  /**
   * Ensures that file exists and meets given criteria.
   *
   * If any criterium is not met it will be after this call. If any parent directory in path doesn't exist it will be created (like mkdir -p).
   */
  fileAsync: (path: string, options: IFilesystemFileOptions) => any

  /**
   * Finds in directory specified by path all files fulfilling searchOptions.
   */
  find(path: string, options?: IFilesystemFindOptions): string[]
  find(options: IFilesystemFindOptions): string[]

  /**
   * Finds in directory specified by path all files fulfilling searchOptions.
   */
  findAsync(path: string, options?: IFilesystemFindOptions): Promise<string[]>
  findAsync(options: IFilesystemFindOptions): Promise<string[]>

  /**
   * Returns details about a fs object found at a path.
   */
  inspect(path: string, options?: IFileSystemInspectOptions): IFileSystemInspectResult[] | void

  /**
   * Returns details about a fs object found at a path.
   */
  inspectAsync(path: string, options?: IFileSystemInspectOptions): Promise<IFileSystemInspectResult[] | void>

  /**
   * Returns details about a fs tree found at the path.
   */
  inspectTree(path: string, options?: IFileSystemInspectTreeOptions): IFileSystemInspectTreeResult | void

  /**
   * Returns details about a fs tree found at the path.
   */
  inspectTreeAsync(path: string, options?: IFileSystemInspectTreeOptions): Promise<IFileSystemInspectTreeResult | void>

  /**
   * Lists the contents of directory.
   */
  list(path?: string): string[] | void

  /**
   * Lists the contents of directory.
   */
  listAsync(path?: string): Promise<string[] | void>

  /**
   * Moves given path to a new location.
   */
  move(from: string, to: string): void

  /**
   * Moves given path to a new location.
   */
  moveAsync(from: string, to: string): void

  /**
   * Resolves an absolute path.
   */
  path(...strings): any

  /**
   * Reads the contents of a file.
   *
   * @param path The path to read from.
   * @param options Additional options.
   */
  read(path: string, options?: IFilesystemReadType): string | Buffer | any

  /**
   * Reads the contents of a file.
   *
   * @param path The path to read from.
   * @param options Additional options.
   */
  readAsync(path: string, options?: IFilesystemReadType): Promise<string | Buffer | any>

  /**
   * Deletes the path or file. It may or may not exist.
   */
  remove(path?: string): void

  /**
   * Deletes the path or file. It may or may not exist.
   */
  removeAsync(path?: string): Promise<void>

  /**
   * Renames a file or directory. The `to` is just the file name as this only renames in the same directory.
   */
  rename(from: string, to: string): void

  /**
   * Renames a file or directory. The `to` is just the file name as this only renames in the same directory.
   */
  renameAsync(from: string, to: string): Promise<void>

  /**
   * Creates a symlink.
   */
  symlink(from: string, to: string): void

  /**
   * Creates a symlink.
   */
  symlinkAsync(from: string, to: string): Promise<void>

  /**
   * Writes the contents of a file.
   */
  write(path: string, data: any, options?: IFilesystemWriteOptions): void

  /**
   * Writes the contents of a file.
   */
  writeAsync(path: string, data: any, options?: IFilesystemWriteOptions): Promise<void>

  /**
   * Retrieves a list of subdirectories for a given path.
   */
  subdirectories(path: string, isRelative?: boolean, matching?: string, symlinks?: boolean): string[]

  /**
   * Is this a file?
   */
  isFile(path: string): boolean

  /**
   * Is this not a file?
   */
  isNotFile(path: string): boolean

  /**
   * Is this a directory?
   */
  isDirectory(path: string): boolean

  /**
   * Is this not a directory?
   */
  isNotDirectory(path: string): boolean

  /**
   * Is this not a local path?
   */
  isLocalPath(path: string): boolean

  /**
   * Get the absolute path
   */
  getAbsolutePath(path: string): string
}

export interface IFilesystemAppendOptions {
  /** If the file doesn't exist yet, will be created with given mode. Value could be number (eg. 0o700) or string (eg. '700'). */
  mode?: string | number
}

/**
 * Used for resolving conflicts when performing copy oeperations.
 *
 * @param srcData The source inspect data.
 * @param destData The destination inspect data.
 * @returns Should we overwrite?
 */
export type IFilesystemCopyResolveHandler = (srcData: any, destData: any) => boolean

export interface IFilesystemCopyOptions {
  /** Should we overwrite? */
  overwrite?: boolean | IFilesystemCopyResolveHandler
  /** A glob to filter down which files to copy. */
  matching?: string
}

export interface IFilesystemDirOptions {
  /**
   * Whether directory should be empty (no other files or directories inside). If set to true and directory contains any files or subdirectories all of them will be deleted.
   */
  empty?: boolean
  /**
   * Ensures directory has specified mode. If not set and directory already exists, current mode will be preserved. Value could be number (eg. 0o700) or string (eg. '700').
   */
  mode?: string | number
}

export interface IFilesystemFileOptions {
  /**
   * Sets file content. If Object or Array given to this parameter data will be written as JSON.
   */
  content?: any
  /**
   * If writing JSON data this tells how many spaces should one indentation have. default: 2
   */
  jsonIndent: number
  /**
   * Ensures file has specified mode. If not set and file already exists, current mode will be preserved. Value could be number (eg. 0o700) or string (eg. '700').
   */
  mode: string | number
}

export interface IFilesystemFindOptions {
  /** An additional glob pattern to filter files. */
  matching?: string
  /** Should we find files? default: true */
  files?: boolean
  /** Should we find directories?: default: false */
  directories?: boolean
  /** Should we be recursive?: default: true */
  recursive?: boolean
  /** Should we report symlinks?: default false */
  symlinks?: boolean
}

export interface IFilesystemExtensionExtra {
  /**
   * The end-of-line character which changes per-platform.
   */
  eol: string

  /**
   * The fs separator character.
   */
  separator: string

  /**
   * Find immediate subdirectories under a directory.
   */
  subdirectories: (path: string) => string[]
}

export interface IFileSystemInspectOptions {
  /** Performs a checksum on the file. Ignore directories. */
  checksum?: 'md5' | 'sha1' | 'sha256' | 'sha512'
  /** Adds unix file permissionss. default: false */
  mode?: boolean
  /** Adds access, modified, and change times. default: false */
  times?: boolean
  /** Adds an absolute path. default: false */
  absolutePath?: boolean
  /** Report or follow symlinks. default: false */
  symlinks?: 'report' | 'follow'
}

export interface IFileSystemInspectResult {
  /** The filename */
  name: string
  /** The type of resource. */
  type: 'file' | 'dir' | 'symlink'
  /** The size in bytes. */
  size: number
  /** The md5 if the checksum was set to `md5` */
  md5?: string
  /** The sha1 if the checksum was set to `sha1` */
  sha1?: string
  /** The sha256 if the checksum was set to `sha256` */
  sha256?: string
  /** The sha512 if the checksum was set to `sha512` */
  sha512?: string
  /** The unix permission mode */
  mode?: number
  /** Last accessed */
  accessTime?: Date
  /** Last modified */
  modifyTime?: Date
  /** Change time */
  changeTime?: Date
}

export interface IFileSystemInspectTreeOptions {
  /** Performs a checksum on the file. Ignore directories. */
  checksum?: 'md5' | 'sha1' | 'sha256' | 'sha512'
  /** Adds an absolute path. default: false */
  relativePath?: boolean
  /** Report or follow symlinks. default: false */
  symlinks?: 'report' | 'follow'
}

export interface IFileSystemInspectTreeResult {
  /** The filename */
  name: string
  /** The type of resource. */
  type: 'file' | 'dir' | 'symlink'
  /** The size in bytes. */
  size: number
  /** The relative path from the inspected directory. */
  relativePath?: string
  /** The md5 if the checksum was set to `md5` */
  md5?: string
  /** The sha1 if the checksum was set to `sha1` */
  sha1?: string
  /** The sha256 if the checksum was set to `sha256` */
  sha256?: string
  /** The sha512 if the checksum was set to `sha512` */
  sha512?: string
  /** Children results */
  children?: IFileSystemInspectTreeOptions[]
}

export type IFilesystemReadType =
  /** The utf-8 string (default) */
  | 'utf8'
  /** A Node Buffer */
  | 'buffer'
  /** An object converted from JSON. */
  | 'json'
  /** An object converted from JSON but with ISO dates converted. */
  | 'jsonWithDates'

export interface IFilesystemWriteOptions {
  /**
   * A safer and slower way to write the file to disk. Default: false.
   */
  atomic?: boolean
  /**
   * If this is JSON, this will control the amount of indentation. Default: 2
   */
  jsonIndent?: number
}

// from https://github.com/Microsoft/TypeScript/blob/master/src/lib/dom.generated.d.ts#L12209-L12223
// added manually so we don't have to import typescript's dom typings
export interface URL {
  hash: string
  host: string
  hostname: string
  href: string
  readonly origin: string
  password: string
  pathname: string
  port: string
  protocol: string
  search: string
  username: string
  readonly searchParams: any
  toString(): string
}
