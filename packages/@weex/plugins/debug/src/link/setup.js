const mlink = require("./index");
const Router = mlink.Router;
const Hub = mlink.Hub;
const debuggerRouter = new Router("debugger");
const nativeProxyHub = new Hub("proxy.native");
const debuggerHub = new Hub("page.debugger");
const inspectorHub = new Hub("proxy.inspector");
const runtimeWorkerHub = new Hub("runtime.worker");
const entryHub = new Hub("page.entry");
const runtimeProxyHub = new Hub("runtime.proxy");
const syncHub = new Hub("sync");

const setup = () => {
  debuggerRouter.link(nativeProxyHub);
  debuggerRouter.link(debuggerHub);
  debuggerRouter.link(inspectorHub);
  debuggerRouter.link(entryHub);
  debuggerRouter.link(syncHub);
  debuggerRouter.link(runtimeWorkerHub);
  debuggerRouter.link(runtimeProxyHub);
  mlink.load(__dirname);
};
module.exports = {
  setup
};
