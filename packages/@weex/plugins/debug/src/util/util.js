const URL = require("url");
const queryParser = require("querystring");

const normalize = remoteurl => {
  const urlObj = URL.parse(remoteurl);
  if (urlObj.query) {
    urlObj.query = queryParser.stringify(queryParser.parse(urlObj.query));
    urlObj.search = "?" + urlObj.query;
  }
  return urlObj.format();
};

module.exports = {
  normalize
};
