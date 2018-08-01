function WebsocketClient(url) {
    this.connect(url);
}
WebsocketClient.prototype = {
    constructor: WebsocketClient,
    connect: function (url) {
        var self = this;
        self.isSocketReady = false;
        self._sended = [];
        self._received = [];
        if (self.ws) {
            self.ws.onopen = null;
            self.ws.onmessage = null;
            self.ws.onclose = null;
            if (self.ws.readyState == WebSocket.OPEN) {
                self.ws.close();
            }
        }
        var ws = new WebSocket(url);
        self.ws = ws;
        ws.onopen = function () {
            self.isSocketReady = true;
            self.emit('socketOpened');
        };
        ws.onmessage = function (e) {
            var message = JSON.parse(e.data);
            if (message.method) {
                self.emit(message.method, message);
            }
        };
        ws.onclose = function () {
            self.isSocketReady = false;
            self.emit('socketClose');
        };

    },
    send: function (data) {
        var self = this;
        if (self.isSocketReady) {
            self.ws.send(JSON.stringify(data));
        }
        else {
            self.once('socketOpened', function () {
                self.ws.send(JSON.stringify(data))
            });
        }
    },
    close: function () {
        this.ws && this.ws.close();
    }
};
WebsocketClient.prototype.__proto__ = new EventEmitter();
