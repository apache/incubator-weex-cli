const opn = require("opn");

function getChromeAppName() {
  switch (process.platform) {
    case "darwin":
      return "google chrome";
    case "win32":
      return "chrome";
    default:
      return "google-chrome";
  }
}
const pendingList = [];
let pending = false;
const launchChrome = function(url, remoteDebugPort, wait, callback) {
  if (!pending) {
    pending = true;
    url = url.replace(/[&*]/g, "\\&");
    const args = [getChromeAppName()];
    if (remoteDebugPort > 0) {
      args.push("-remote-debugging-port=" + remoteDebugPort);
    }
    opn(url, {
      app: args,
      wait: !!wait
    }).then(cp => {
      cp.once("close", e => {
        callback && callback(null);
        if (pendingList.length > 0) {
          pending = false;
          pendingList.shift()();
        }
      });
      cp.once("error", err => {
        pending = false;
        callback && callback(err);
      });
    });
  } else {
    pendingList.push(function() {
      launchChrome(url, remoteDebugPort, wait, callback);
    });
  }
};
const launchNewChrome = function(url, args) {};

module.exports = {
  launchNewChrome,
  launchChrome
};
