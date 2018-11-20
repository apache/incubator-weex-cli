import * as match from 'minimatch'
import evaluate from './eval'

/**
 * Filter files
 * 
 * @param files 
 * @param filters 
 * @param data 
 * @param done 
 */
export function filter (files, filters, data, done){
  if (!filters) {
    return done()
  }
  const fileNames = Object.keys(files)
  Object.keys(filters).forEach(glob => {
    fileNames.forEach(file => {
      if (match(file, glob, { dot: true })) {
        const condition = filters[glob]
        if (!evaluate(condition, data)) {
          delete files[file]
        }
      }
    })
  })
  done()
}

export default filter
