const mlink = require("../index");
const Router = mlink.Router;
const DeviceManager = require("../managers/device_manager");
const config = require("../../config");
const { util } = require("../../util");
const debuggerRouter = Router.get("debugger");

debuggerRouter.on(Router.Event.TERMINAL_LEAVED, "proxy.native", function(
  signal
) {
  const device = DeviceManager.getDevice(signal.channelId);
  if (!device) {
    return;
  }
  DeviceManager.removeDevice(signal.channelId, function() {
    debuggerRouter.pushMessageByChannelId("page.debugger", signal.channelId, {
      method: "WxDebug.deviceDisconnect",
      params: device
    });
  });
});

debuggerRouter.on(Router.Event.TERMINAL_JOINED, "page.debugger", function(
  signal
) {
  const device = DeviceManager.getDevice(signal.channelId);
  debuggerRouter.pushMessageByChannelId("page.debugger", signal.channelId, {
    method: "WxDebug.pushDebuggerInfo",
    params: {
      device
    }
  });
});

debuggerRouter
  .registerHandler(function(message) {
    const device = DeviceManager.registerDevice(
      message.payload.params,
      message.channelId
    );
    if (device) {
      message.payload = {
        method: "WxDebug.pushDebuggerInfo",
        params: {
          device        
        }
      };
      message.to("page.debugger");
    }
    return false;
  })
  .at("proxy.native")
  .when('payload.method=="WxDebug.registerDevice"');
