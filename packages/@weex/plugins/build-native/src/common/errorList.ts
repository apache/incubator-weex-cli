import { createError } from '../utils/error'

/**
 * When build app for real device, not have correct signing will throw
 */
export const IOS_CODE_SIGNING_ERROR = createError({
  type: 'IOS_CODE_SIGNING_ERROR',
  message: `Code Signing Error, Please use xcode open project handle singing error.`
})