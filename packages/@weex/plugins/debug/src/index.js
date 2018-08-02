const path = require("path");
const chalk = require("chalk");

const config = require("./config");
const debugServer = require("./server");
const mlink = require("./link");
const Router = mlink.Router;
const debuggerRouter = Router.get("debugger");

const { util } = require("./util");


const startServer = (ip, port) => {
  return new Promise((resolve, reject) => {
    debugServer.start(port, function() {
      resolve();
    });
  });
};

const getEntrySocket = async (options) => {
  const channelId = debuggerRouter.newChannel(options.CHANNEL_ID);
  return {
    channelId: channelId,
    nativeProxyUrl: `ws://${options.ip}:${options.port}/debugProxy/native/${channelId}`,
    debuggerProxyUrl: `ws://${options.ip}:${options.port}/debugProxy/debugger/${channelId}`,
    inspectorProxyUrl: `ws://${options.ip}:${options.port}/debugProxy/inspector/${channelId}`
  };
}

exports.start = async (options) => {
  const entry = await getEntrySocket(options);
  config.IP = options.ip;
  config.SERVER_PORT = options.port;
  config.STATIC_SOURCE = options.staticSource;
  config.REMOTE_DEBUG_PORT = options.remoteDebugPort;
  config.CHANNEL_ID = options.channelId;
  await startServer(options.ip, options.port);
  return entry;
};
