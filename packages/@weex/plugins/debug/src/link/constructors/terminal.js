const EventEmitter = require("events").EventEmitter;
const uuid = require("uuid");
class SyncTerminal extends EventEmitter {
  constructor() {
    super();
    this.id = uuid();
  }

  send(data) {
    this.promise = new Promise();
    this.emit("message", data);
    return this.promise;
  }

  read(message) {
    this.emit("destroy");
    this.promise.resolve(message);
  }
}
class WebsocketTerminal extends EventEmitter {
  constructor(websocket, channelId) {
    super();
    this.channelId = channelId;
    this.id = uuid();
    this.websocket = websocket;
    websocket.on("connect", function() {});
    websocket.on("message", message => {
      this.emit("message", JSON.parse(message));
    });
    websocket.on("close", () => {
      this.emit("destroy");
    });
    websocket.on("error", err => {
      console.error(err);
    });
  }

  read(message) {
    if (this.websocket.readyState === 1) {
      this.emit("read", message);
      this.websocket.send(JSON.stringify(message));
    }
  }
}
module.exports = { WebsocketTerminal, SyncTerminal };
