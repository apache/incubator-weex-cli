import { chmodSync } from 'fs'
import { resolve } from 'path'

export default toolbox => {
  toolbox.fs.resolve = resolve
  toolbox.fs.chmodSync = chmodSync
}
