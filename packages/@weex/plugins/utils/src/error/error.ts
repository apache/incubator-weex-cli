/**
 * the design is to standardize the Error information,and the user of the interface can obtain
 * the Error type through the Error information to do the corresponding processing
 * 1. A lot of errors may occur in a method, through ` createError ` generates standardized error throw out directly tell the caller,
 *    without having to pass it
 * 2. The interface user can through ` paraError ` to parse out standardized error
 */

const label = 'ErrorMemory'

export function createError(options: { message: string; type: string }) {
  return new Error(
    JSON.stringify(
      Object.assign(
        {
          [label]: 'ErrorMemory',
        },
        options,
      ),
    ),
  )
}

export function formatError(error: Error) {
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
