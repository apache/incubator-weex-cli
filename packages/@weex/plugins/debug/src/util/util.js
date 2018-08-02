const URL = require("url");
const queryParser = require("querystring");

let connectUrl;

const normalize = remoteurl => {
  const urlObj = URL.parse(remoteurl);
  if (urlObj.query) {
    urlObj.query = queryParser.stringify(queryParser.parse(urlObj.query));
    urlObj.search = "?" + urlObj.query;
  }
  return urlObj.format();
};

const getConnectUrl = channelId => {
  return connectUrl.replace("{channelId}", channelId);
};

const setConnectUrl = url => {
  connectUrl = url;
};

module.exports = {
  normalize,
  getConnectUrl,
  setConnectUrl
};
