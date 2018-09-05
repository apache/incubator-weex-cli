import { createError, paraError } from './error'

describe('Test uitls error', () => {
  let errorObj = {
    type: 'IOS_CODE_SIGNING_ERROR',
    message: `Code Signing Error, Please use xcode open project handle singing error.`
  }

  test('Create and paraError error', async() => {
    const newError = createError(errorObj)
    const errorResult = paraError(newError)

    expect(errorResult).toEqual(errorObj)
  })
})