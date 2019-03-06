import * as fse from 'fs-extra'
import * as path from 'path'
import utils from '../utils'
import { Router, Hub } from '@weex-cli/linker'
import { Config } from '../ConfigResolver'

export const setup = (handlerPath: string) => {
  const debuggerRouter = new Router(`debugger-${Config.get('channelId')}`)
  const nativeProxyHub = new Hub('proxy.native')
  const debuggerHub = new Hub('page.debugger')
  const inspectorHub = new Hub('proxy.inspector')
  const runtimeWorkerHub = new Hub('runtime.worker')
  const entryHub = new Hub('page.entry')
  const runtimeProxyHub = new Hub('runtime.proxy')
  const syncNativeHub = new Hub('sync.native')
  const syncV8Hub = new Hub('sync.v8')
  debuggerRouter.newChannel(Config.get('channelId'))
  debuggerRouter.link(nativeProxyHub)
  debuggerRouter.link(debuggerHub)
  debuggerRouter.link(inspectorHub)
  debuggerRouter.link(entryHub)
  debuggerRouter.link(syncNativeHub)
  debuggerRouter.link(syncV8Hub)
  debuggerRouter.link(runtimeWorkerHub)
  debuggerRouter.link(runtimeProxyHub)
  Config.set(`debugger-${Config.get('channelId')}`, {})
  let files = fse.readdirSync(handlerPath)
  files.forEach((file: string) => {
    if (path.extname(file) === '.js') {
      utils.loader.loadModule(path.join(handlerPath, file))
    }
  })
  return debuggerRouter
}

export default {
  setup,
}
