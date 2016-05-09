"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = qrcode;
function qrcode(url) {
    var options = {
        render: "canvas",
        width: 320,
        height: 320,
        typeNumber: -1,
        correctLevel: lib.QRErrorCorrectLevel.H,
        background: "#ffffff",
        foreground: "#000000"
    };
    var qrcode = new lib.QRCode(options.typeNumber, options.correctLevel);
    qrcode.addData(url);
    qrcode.make();

    // create canvas element
    var canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    var ctx = canvas.getContext('2d');

    // compute tileW/tileH based on options.width/options.height
    var tileW = options.width / qrcode.getModuleCount();
    var tileH = options.height / qrcode.getModuleCount();

    // draw in the canvas
    for (var row = 0; row < qrcode.getModuleCount(); row++) {
        for (var col = 0; col < qrcode.getModuleCount(); col++) {
            ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
            var w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
            var h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW);
            ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
        }
    }

    return canvas;
}