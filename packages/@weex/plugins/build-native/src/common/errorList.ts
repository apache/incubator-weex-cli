import { createError } from '../utils/error'

export const IOS_CODE_SIGNING_ERROR = createError({
  type: 'IOS_CODE_SIGNING_ERROR',
  message: `Code Signing Error, Please use xcode open project handle singing error.`
})