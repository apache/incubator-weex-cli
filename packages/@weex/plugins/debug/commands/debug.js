const devtool = require('../src/index');
const ip = require('ip').address();
const exit = require('exit');
const path = require('path');

module.exports = {
  name: "debug",
  description: "Debug weex bundle",
  alias: "d",
  run: async context => {
    // tools
    const logger = context.logger;
    const ws = context.ws;
    const staic = context.staic;
    // params
    const options = context.parameters.options;
    const source = context.parameters.first;
    const target = context.parameters.second;
   
    const remoteDebugPort = 9225;
    const port = 8098;

    const wss = new ws.Server({
      port: 8080,
      perMessageDeflate: {
        zlibDeflateOptions: { // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        clientMaxWindowBits: 10,       // Defaults to negotiated value.
        serverMaxWindowBits: 10,       // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10,          // Limits zlib concurrency for perf.
        threshold: 1024,               // Size (in bytes) below which messages
                                       // should not be compressed.
      }
    });

    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });
      ws.send('something');
    });

    const devtoolOptions = {
      ip: ip,
      port: port,
      remoteDebugPort: remoteDebugPort,
      staticSource: staic.getSourceLocation()
    };

    devtool.start(devtoolOptions, async () => {
      await context.headless.launchHeadless(`${ip}:${port}`, remoteDebugPort);
    })
  }
};
