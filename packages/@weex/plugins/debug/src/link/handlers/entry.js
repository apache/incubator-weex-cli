const mlink = require("../index");
const Router = mlink.Router;
const { hook, simulator, util } = require("../../util");
const debuggerRouter = Router.get("debugger");

debuggerRouter
  .registerHandler(message => {
    if (message.payload.method === "WxDebug.applyChannelId") {
      const channelId = debuggerRouter.newChannel();
      message.payload = {
        method: "WxDebug.pushChannelId",
        params: {
          channelId,
          connectUrl: util.getConnectUrl(channelId)
        }
      };
      message.reply();
    } else if (message.payload.method === "WxDebug.simrun") {
      simulator.connect(message.payload.params).catch(e => {
        hook.record("/weex_tool.weex_debugger.scenes", {
          feature: "simrun",
          status: "fail"
        });
        debuggerRouter.pushMessage("page.entry", {
          method: "WxDebug.prompt",
          params: {
            messageText: "PLEASE_INSTALL_XCODE",
            channelId: message.payload.params
          }
        });
      });
    }
  })
  .at("page.entry");
