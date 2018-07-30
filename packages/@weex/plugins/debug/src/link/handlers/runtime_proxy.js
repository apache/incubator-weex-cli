const mlink = require("../index");
const Router = mlink.Router;
const debuggerRouter = Router.get("debugger");
debuggerRouter
  .registerHandler(function(message) {
    if (
      message.payload.method === "Debugger.scriptParsed" ||
      (message.payload.result && message.payload.result.frameTree)
    ) {
      message.discard();
    }
    message.to("proxy.inspector");
  })
  .at("runtime.proxy");
