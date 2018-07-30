const path = require("path");
const chalk = require("chalk");
const boxen = require("boxen");

const detect = require("detect-port");
const launcher = require("./util/launcher");
const headless = require("./server/headless");
const config = require("./config");
const debugServer = require("./server");
const mlink = require("./link");
const Router = mlink.Router;

const { logger, hosts, util } = require("./util");

const builder = require("weex-builder");

function resolveBundleUrl(bundlePath, ip, port) {
  return `http://${ip}:${port}/${config.BUNDLE_DIRECTORY}/${bundlePath.replace(
    /\.(we|vue)$/,
    ".js"
  )}`;
}

function isUrl(str) {
  return /^https?:\/\//.test(str);
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
    config.connectUrl ||
      `http://${host}/devtool_fake.html?_wx_devtool=ws://${host}/debugProxy/native/{channelId}`
  );
}

exports.startServerAndLaunch = function(ip, port, manual, cb) {
  this.startServer(ip, port).then(() => {
    cb && cb();
    if (!manual) this.launch(ip, port);
  });
};

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

exports.launch = function(ip, port) {
  const debuggerURL = "http://" + (ip || "localhost") + ":" + port + "/";
  logger.info("Launching Dev Tools...");
  if (config.ENABLE_HEADLESS) {
    // Check whether the port is occupied
    detect(config.REMOTE_DEBUG_PORT).then(function(open) {
      if (+config.REMOTE_DEBUG_PORT !== open) {
        headless.closeHeadless();
        logger.info(
          `Starting inspector on port ${open}, because ${
            config.REMOTE_DEBUG_PORT
          } is already in use`
        );
      } else {
        logger.info(`Starting inspector on port ${open}`);
      }
      config.REMOTE_DEBUG_PORT = open;
      headless.launchHeadless(`${config.ip}:${config.port}`, open);
    });
  }
  launcher.launchChrome(debuggerURL, config.REMOTE_DEBUG_PORT || 9222);
};

exports.resolveBundlesAndEntry = function(entry, bundles, ip, port) {
  let entryUrl;
  const bundleUrls = bundles
    .filter(bundle => !/\.js\.map/.test(bundle))
    .map(b => resolveBundleUrl(b, ip, port));
  if (isUrl(entry)) {
    entryUrl = resolveRealUrl(entry);
    entryUrl = entryUrl.replace(/127\.0\.0\.1/g, ip);
    bundleUrls.push(entryUrl);
  }
  return bundleUrls;
};

exports.reload = function() {
  Router.get("debugger").pushMessage("proxy.native", {
    method: "WxDebug.reload"
  });
};

exports.start = function(target, config, cb) {
  resolveConnectUrl(config);
  if (isUrl(target)) {
    const bundleUrls = this.resolveBundlesAndEntry(
      target,
      [],
      config.ip,
      config.port
    );
    config.bundleUrls = bundleUrls;
    this.startServerAndLaunch(config.ip, config.port, config.manual, cb);
  } else if (target) {
    const filePath = path.resolve(target);
    let shouldReloadDebugger = false;
    builder.build(
      filePath,
      path.join(__dirname, "../frontend", config.BUNDLE_DIRECTORY),
      {
        watch: true,
        ext: config.ext,
        min: config.min,
        devtool: "source-map"
      },
      (err, output, json) => {
        if (err) {
          logger.error(err);
        } else {
          logger.log("Build completed!\n");
          logger.log(output.toString());
          if (!shouldReloadDebugger) {
            shouldReloadDebugger = true;
            const bundles = json.assets.map(o => o.name.replace("\\", "/"));
            const bundleUrls = this.resolveBundlesAndEntry(
              config.entry,
              bundles,
              config.ip,
              config.port
            );
            config.BUNDLE_URLS = bundleUrls;
            this.startServerAndLaunch(
              config.ip,
              config.port,
              config.manual,
              cb
            );
          } else {
            exports.reload();
          }
        }
      }
    );
  } else {
    this.startServerAndLaunch(config.ip, config.port, config.manual, cb);
  }
};
