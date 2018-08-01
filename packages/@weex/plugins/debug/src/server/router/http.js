const Router = require("koa-router");
const MemoryFile = require("../../MemoryFile");
const mlink = require("../../link");
const DeviceManager = require("../../link/managers/device_manager");
const URL = require("url");
const config = require("../../config");
const protocols = {
  "http:": require("http"),
  "https:": require("https")
};
const { logger, bundleWrapper } = require("../../util");

const httpRouter = new Router();

let syncApiIndex = 0;
const SyncTerminal = mlink.Terminal.SyncTerminal;
const syncHub = mlink.Hub.get("sync");

const rSourceMapDetector = /\.map$/;

const getRemote = (url) => {
  return new Promise(function(resolve, reject) {
    const urlObj = URL.parse(url);
    (protocols[urlObj.protocol] || protocols["http:"])
      .get(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.path,
          method: "GET",
          headers: {
            "User-Agent": "Weex/1.0.0"
          }
        },
        function(res) {
          let chunks = [];
          res.on("data", function(chunk) {
            chunks.push(chunk);
          });
          res.on("end", function() {
            resolve(Buffer.concat(chunks).toString());
            chunks = null;
          });
        }
      )
      .on("error", function(e) {
        reject(e);
      });
  });
}

httpRouter.get("/source/*", async (ctx, next) => {
  const path = ctx.params[0];
  if (rSourceMapDetector.test(path)) {
    logger.verbose(`Fetch sourcemap ${path}`);
    const content = await getRemote("http://" + path);
    if (!content) {
      ctx.response.status = 404;
    } else {
      ctx.response.status = 200;
      ctx.response["content-type"] = "text/javascript";
      ctx.set("Access-Control-Allow-Origin", "*");
      ctx.response.body = content;
    }
  } else {
    let query = ctx.request.url.split("?");
    query = query[1] ? "?" + query.slice(1).join("?") : "";
    const file = MemoryFile.get(path + query);
    if (file) {
      ctx.response.status = 200;
      ctx.response["content-type"] = "text/javascript";
      if (file.url && config.proxy) {
        logger.verbose(`Fetch jsbundle ${file.url}`);
        const content = await getRemote(file.url).catch(function(e) {
          // If file not found or got other http error.
          logger.verbose(e);
        });
        if (!content) {
          ctx.response.body = file.getContent();
        } else {
          ctx.response.body = bundleWrapper(content, file.getUrl());
        }
      } else {
        ctx.response.body = file.getContent();
      }
    } else {
      ctx.response.status = 404;
    }
  }
  await next();
});

httpRouter.post("/syncApi", async (ctx, next) => {
  const idx = syncApiIndex++;
  const payload = ctx.request.body;
  const device = DeviceManager.getDevice(payload.channelId);
  if (device) {
    const terminal = new SyncTerminal();
    terminal.channelId = payload.channelId;
    syncHub.join(terminal, true);
    payload.params.syncId = 100000 + idx;
    payload.id = 100000 + idx;
    const data = await terminal.send(payload);
    ctx.response.status = 200;
    ctx.type = "application/json";
    ctx.response.body = JSON.stringify(data);
  } else {
    ctx.response.status = 500;
    // this.response.body = JSON.stringify({ error: 'device not found!' });
  }
  await next();
});

module.exports = httpRouter;
