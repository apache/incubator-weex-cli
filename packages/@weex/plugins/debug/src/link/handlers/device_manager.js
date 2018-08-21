const mlink = require("../index");
const Router = mlink.Router;
const DeviceManager = require("../managers/device_manager");
const config = require("../../config");
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
      device,
      bundles: config.BUNDLE_URLS || []
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
      // debuggerRouter.pushMessage("page.entry", {
      //   method: "WxDebug.startDebugger",
      //   params: message.channelId
      // });
      message.to("page.debugger");
      // iOS platform need reload signal to reload runtime context.
      // if (device.platform === 'iOS') {
      //   setTimeout(() => {
      //     debuggerRouter.pushMessageByChannelId('page.debugger', message.channelId, {
      //       method: 'WxDebug.reloadInspector',
      //       params: device
      //     });
      //   }, 3000);
      // }
    }
    return false;
  })
  .at("proxy.native")
  .when('payload.method=="WxDebug.registerDevice"');
