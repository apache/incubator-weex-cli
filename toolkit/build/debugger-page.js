'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initVue = initVue;
var vueInstance = exports.vueInstance = undefined;

function initVue() {
    window._vueInstance = exports.vueInstance = vueInstance = new Vue({
        el: '#logs',
        data: {
            logs: [
                // {content:'log content',flag: 'log flag'} //
            ]
        },
        methods: {
            clearLog: function clearLog() {
                this.logs = [];
            }
        }
    });
}