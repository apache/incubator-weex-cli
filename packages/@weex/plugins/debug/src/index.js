const path = require("path");
const chalk = require("chalk");
const boxen = require("boxen");

const config = require("./config");
const debugServer = require("./server");
const mlink = require("./link");
const Router = mlink.Router;

const { logger, hosts, util } = require("./util");

function resolveBundleUrl(bundlePath, ip, port) {
  return `http://${ip}:${port}/${config.BUNDLE_DIRECTORY}/${bundlePath.replace(
    /\.(we|vue)$/,
    ".js"
  )}`;
}


function resolveRealUrl(url) {
  return url.replace(/^(https?:\/\/)([^/:]+)(?=:\d+|\/)/, function(m, a, b) {
    if (!/\d+\.\d+\.\d+\.\d+/.test(a)) {
      return a + hosts.findRealHost(b);
    } else {
      return m;
    }
  });
}

function resolveConnectUrl(config) {
  const host = config.ip + ":" + config.port;
  util.setConnectUrl(
    `http://${host}/devtool_fake.html?_wx_devtool=ws://${host}/debugProxy/native/{channelId}`
  );
}

exports.startServer = function(ip, port) {
  return new Promise((resolve, reject) => {
    const inUse = config.inUse;
    let message = chalk.green("Start debugger server!");
    if (inUse) {
      message +=
        " " +
        chalk.red(
          "(on port " +
            inUse.open +
            "," +
            (" because " + inUse.old + " is already in use)")
        );
    }
    message += "\n\n";
    message +=
      "- " +
      chalk.bold("Websocket Address For Native: ") +
      " ws://" +
      ip +
      ":" +
      port +
      "/debugProxy/native\n";
    message +=
      "- " +
      chalk.bold("Debug Server:                 ") +
      " http://" +
      ip +
      ":" +
      port +
      "\n";
    debugServer.start(port, function() {
      logger.log(
        boxen(message, {
          padding: 1,
          borderColor: "green",
          margin: 1
        })
      );
      resolve();
    });
  });
};


exports.start = function(options, cb) {
  resolveConnectUrl(options)
  config.IP = options.ip;
  config.SERVER_PORT = options.port;
  config.STATIC_SOURCE = options.staticSource;
  config.REMOTE_DEBUG_PORT = options.remoteDebugPort;
  this.startServer(options.ip, options.port).then(() => {
    cb && cb();
  });
};
