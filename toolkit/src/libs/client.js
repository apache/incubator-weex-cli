import EventEmitter from 'events';

export default function WebsocketClient(endpoint, id) {
    var serverUrl = WebsocketClient.getServerUrl(endpoint, id);
    var websocket = new WebSocket(serverUrl);

    var emitter = new EventEmitter();

    this.send = function(name, value) {
        var message = {
            name: name,
            value: value
        }
        
        websocket.send(JSON.stringify(message));
    }

    this.on = function(name, handler) {
        emitter.on(name, handler);
    }

    websocket.addEventListener('open', function() {
        console.log('debugger open');
    });

    websocket.addEventListener('message', function(event) {
        var message = JSON.parse(event.data);
        emitter.emit(message.name, message.value);
    });
}

WebsocketClient.getServerUrl = function(endpoint, id) {
    var hostname = location.hostname;
    var port = location.port;
    var host = hostname + (port ? ':' + port : '');

    return `ws://${host}/debugger/${id}/${endpoint}`;
}