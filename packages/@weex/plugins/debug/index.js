const devtool = require('./src/index');
const config = require('./src/config');
const IP = require('ip');

/**
 * Start server and lanunch chrome.
 * @param {string} entry filename/floder
 * @param {Object} config
 * - ip ip of node server.
 * - port port of node server
 * - remoteDebugPort remote-debug-port of headless.
 * - enableHeadless enable to start headless chromium or not.
 * @param {Function} cb
 */
const startDevtoolServer = async (entrys, options) => {
  new Promise((resolve, reject) => {
    if (options) {
      config.ip = options.ip || IP.address();
      config.port = options.port || 8089;
      config.manual = options.manual || false;
      config.CHANNELID = options.CHANNELID || options.channelId;
      config.REMOTE_DEBUG_PORT = options.REMOTE_DEBUG_PORT || options.remoteDebugPort || 9222;
      config.ENABLE_HEADLESS = typeof options.ENABLE_HEADLESS === 'boolean' ? options.ENABLE_HEADLESS : typeof options.enableHeadless === 'boolean' ? options.enableHeadless : true;
    }
    devtool.start(entrys, config, (data) => {
      resolve(data)
    });
  })
};

const api = {
  startDevtoolServer: startDevtoolServer,
  reload: devtool.reload
};

module.exports = {
  api
};
