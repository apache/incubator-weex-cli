// try loading this module
export const loadModule = path => {
  if (!path) {
    throw new Error('path is required')
  }
  require.resolve(path)
  return require(path)
}

export default {
  loadModule,
}
