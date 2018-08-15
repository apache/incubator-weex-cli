const config = require("../config");
const { simrun } = require("../util");

const connect = function(channelId) {
  let params = "";
  if (config.bundleUrls && config.bundleUrls.length === 1) {
    params += `_wx_tpl=${config.bundleUrls[0]}&`;
  }
  params += `_wx_devtool=ws://${config.ip}:${
    config.port
  }/debugProxy/native/${channelId}`;
  return simrun.ios(
    "weex-devtool",
    "iPhone 6",
    "https://registry.npm.taobao.org/weex-ios-playground/-/weex-ios-playground-1.2.0.tgz|package/WeexDemo.app",
    "wxpage",
    params
  );
};

module.exports = {
  connect
};
