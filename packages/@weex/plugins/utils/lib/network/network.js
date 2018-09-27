"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getIp() {
    return new Promise(resolve => {
        require('dns').lookup(require('os').hostname(), (err, add) => {
            // Get first ipv4
            if (!err) {
                resolve(add);
            }
            else {
                resolve(null);
            }
        });
    });
}
exports.getIp = getIp;
function detectPort(insertPort) {
    return new Promise(resolve => {
        let checkPort = function (port) {
            let net = require('net');
            let tester = net
                .createServer()
                .once('error', function (err) {
                if (err.code === 'EADDRINUSE') {
                    return checkPort(port + 1);
                }
                resolve(port);
            })
                .once('listening', function () {
                tester
                    .once('close', function () {
                    resolve(port);
                })
                    .close();
            })
                .listen(port);
        };
        checkPort(insertPort);
    });
}
exports.detectPort = detectPort;
//# sourceMappingURL=network.js.map