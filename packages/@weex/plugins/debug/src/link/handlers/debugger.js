const mlink = require("../index");
const Router = mlink.Router;
const debuggerRouter = Router.get("debugger");
const DeviceManager = require("../managers/device_manager");
const { hook } = require("../../util");

debuggerRouter
  .registerHandler(function(message, next) {
    const payload = message.payload;
    const device = DeviceManager.getDevice(message.channelId);
    if (!device) {
      message.discard = true;
      return;
    }
    if (payload.method === "WxDebug.setLogLevel") {
      hook.record("/weex_tool.weex_debugger.scenes", {
        feature: "setLogLevel",
        status: payload.params.data
      });
      device.logLevel = payload.params.data;
      message.payload = {
        method: "WxDebug.setLogLevel",
        params: {
          logLevel: payload.params.data
        }
      };
      debuggerRouter.pushMessage("page.debugger", message.terminalId, {
        method: "WxDebug.reloadInspector"
      });
      debuggerRouter.pushMessage("page.debugger", message.terminalId, {
        method: "WxDebug.reloadRuntime"
      });
    } else if (payload.method === "WxDebug.setElementMode") {
      hook.record("/weex_tool.weex_debugger.scenes", {
        feature: "setElementMode",
        status: payload.params.data
      });

      device.elementMode = payload.params.data;
      message.payload = {
        method: "WxDebug.setElementMode",
        params: {
          mode: payload.params.data
        }
      };
      // setTimeout(function(){})
      debuggerRouter.pushMessage("page.debugger", message.terminalId, {
        method: "WxDebug.reloadInspector"
      });
      debuggerRouter.pushMessage("page.debugger", message.terminalId, {
        method: "WxDebug.reloadRuntime"
      });
    } else if (payload.method === "WxDebug.network") {
      hook.record("/weex_tool.weex_debugger.scenes", {
        feature: "network",
        status: payload.params.enable
      });
      device && (device.network = payload.params.enable);
      message.payload = {
        method: "WxDebug.network",
        params: {
          enable: payload.params.enable
        }
      };
      debuggerRouter.pushMessage("page.debugger", message.terminalId, {
        method: "WxDebug.reloadInspector"
      });
      debuggerRouter.pushMessage("page.debugger", message.terminalId, {
        method: "WxDebug.reloadRuntime"
      });
    } else if (payload.method === "WxDebug.enable") {
      hook.record("/weex_tool.weex_debugger.scenes", {
        feature: "remoteDebug",
        status: true
      });
      device && (device.remoteDebug = true);
      // debuggerRouter.pushMessage('page.debugger', message.terminalId, {
      //   method: 'WxDebug.reloadInspector'
      // });
      // debuggerRouter.pushMessage('page.debugger', message.terminalId, {
      //   method: 'WxDebug.reloadRuntime'
      // });
    } else if (payload.method === "WxDebug.disable") {
      hook.record("/weex_tool.weex_debugger.scenes", {
        feature: "remoteDebug",
        status: false
      });
      device && (device.remoteDebug = false);
      debuggerRouter.pushMessage("page.debugger", message.terminalId, {
        method: "WxDebug.reloadInspector"
      });
    } else if (payload.method === "WxDebug.enableTracing") {
      hook.record("/weex_tool.weex_debugger.scenes", {
        feature: "Tracing",
        status: payload.params.status
      });
    }
    message.to("proxy.native");
  })
  .at("page.debugger");
