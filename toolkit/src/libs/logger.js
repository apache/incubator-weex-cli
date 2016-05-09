import EventEmitter from 'events';

export default function WebsocketLogger(endpoint, id) {
    var serverUrl = WebsocketLogger.getServerUrl(endpoint, id);
    var websocket = new WebSocket(serverUrl);

    var emitter = new EventEmitter();

    this.log = function() {
        websocket.send(JSON.stringify(arguments));
    }

    this.on = function(handler) {
        emitter.on('log', handler);
    }

    websocket.addEventListener('open', function() {
        console.log('logger open');
    });

    websocket.addEventListener('message', function(event) {
        var message = JSON.parse(event.data);
        emitter.emit('log', message);
    });
}

WebsocketLogger.getServerUrl = function(endpoint, id) {
    var hostname = location.hostname;
    var port = location.port;
    var host = hostname + (port ? ':' + port : '');
    return `ws://${host}/logger/${id}/${endpoint}`;
}