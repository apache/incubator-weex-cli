const request = require("request");
const dns = require("dns");
const { logger } = require("./logger");
let shouldBeTelemetry = false;

const record = (logkey, gokey) => {
  if (!shouldBeTelemetry) {
    return;
  }
  let url = `http://gm.mmstat.com${logkey}?`;
  for (const i in gokey) {
    if (gokey.hasOwnProperty(i)) {
      url += `${i}=${gokey[i]}&`;
    }
  }
  url += `t=${new Date().getTime()}`;
  try {
    dns.resolve("gm.mmstat.com", function(err) {
      if (!err) {
        request.get(url);
      }
    });
  } catch (e) {
    logger.error(e);
  }
};

const allowTarck = () => {
  shouldBeTelemetry = true;
};

module.exports = {
  record,
  allowTarck
};
