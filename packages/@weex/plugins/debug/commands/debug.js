const devtool = require("../index");
const ip = require("ip").address();
const exit = require("exit");

module.exports = {
  name: "debug",
  description: "Debug weex bundle",
  alias: "d",
  run: async context => {
    // tools
    const logger = context.logger;
    const WebSocket = context.ws;
    const staticService = context.staticService;
    const opn = context.opn;
    const headless = context.headless;
    // params
    // TODO: detact port
    const remoteDebugPort = 9228;
    const port = 8099;
    const mockServerPort = 8888;

    const devtoolOptions = {
      ip: ip,
      port: port,
      remoteDebugPort: remoteDebugPort,
      // need to put the runtime.html into the same http server
      staticSource: staticService.getSourceLocation()
    };

    const entry = await devtool.start(devtoolOptions);

    // socket to control debugger status.
    // should be use after device has been connected.
    const debuggerProxyUrl = entry.debuggerProxyUrl;
    // socket to control native
    const nativeProxyUrl = entry.nativeProxyUrl;
    // socket to control inspector
    // remove ws:// cause of the inspector require.
    const inspectorProxyUrl = entry.inspectorProxyUrl.replace("ws://", "");
    // socket id
    const channelId = entry.channelId;

    await headless.launchHeadless(`${ip}:${port}`, remoteDebugPort, {
      channelId: channelId
    });

    // mock socket for control native connections.
    const wss = new WebSocket.Server({
      port: mockServerPort
    });

    wss.on("connection", function connection(mockWs) {
      const agreeToLink = true;
      const nativeWs = new WebSocket(nativeProxyUrl);

      nativeWs.on("message", message => {
        // console.log('Native Received: %s', message);
        // Here you can judge to link real native socket or not
        if (agreeToLink) {
          mockWs.send(message);
        }
      });

      mockWs.on("message", message => {
        // console.log('Mock Received: %s', message);
        // Here you can judge to link real native socket or not
        if (agreeToLink) {
          nativeWs.send(message);
          const msg = JSON.parse(message);
          if (msg.method === "WxDebug.registerDevice") {
            const debuggerWs = new WebSocket(debuggerProxyUrl);
            debuggerWs.on("open", () => {
              // debuggerWs.send(JSON.stringify({
              //   method: 'Page.stopScreencast'
              // }))
              debuggerWs.send(
                JSON.stringify({
                  method: "WxDebug.enable"
                })
              );
              debuggerWs.send(
                JSON.stringify({
                  method: "WxDebug.network",
                  params: {
                    enable: true
                  }
                })
              );
              console.log(
                "Inspector Connection Url: %s",
                `http://${ip}:${port}/${staticService.getInspectorReleactivePath()}?ws=${inspectorProxyUrl}`
              );
              opn(
                `http://${ip}:${port}/${staticService.getInspectorReleactivePath()}?ws=${inspectorProxyUrl}`
              );
            });
          }
        }
      });

      process.on("SIGINT", () => {
        headless.closeHeadless();
        exit(0);
      });
    });

    logger.log(
      `Connecting Url: http://${ip}:${port}/fake.html?_wx_devtool=ws://${ip}:${mockServerPort}`
    );
  }
};
