const mlink = require("../index");
const Router = mlink.Router;
const debuggerRouter = Router.get("debugger");

debuggerRouter
  .registerHandler(message => {
    if (message.payload.method === "WxDebug.applyChannelId") {
      const channelId = debuggerRouter.newChannel();
      message.payload = {
        method: "WxDebug.pushChannelId",
        params: {
          channelId
        }
      };
      message.reply();
    }
  })
  .at("page.entry");
