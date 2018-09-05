const label = 'ErrorMemory'

export function createError(options: { message: string, type: string }) {
  return new Error(JSON.stringify(Object.assign({
    [label]: 'ErrorMemory'
  }, options)))
}

export function paraError(error: Error) {
  let result = null
  try {
    result = JSON.parse(error.message)
  } catch (e) {
    return result
  }

  if (!result[label]) {
    result = null
  }

  delete result[label]

  return result
}