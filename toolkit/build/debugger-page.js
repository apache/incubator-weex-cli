"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.vueInstance = undefined;
exports.setLoggerHeight = setLoggerHeight;
exports.initVue = initVue;

var _debugger = require("./libs/debugger");

var _ = require("underscore");

var LOG_LEVEL_LIST = ["all", "verbose", "debug", "info", "warn", "error"];

var LogAutoScrollMark;
function activeLogAutoScroll() {
    LogAutoScrollMark = setInterval(function () {
        return $("#logger").scrollTop($("#logger").prop('scrollHeight'));
    }, 100);
}

function disableLogAutoScroll() {
    clearInterval(LogAutoScrollMark);
}

function logFullscreenActive() {
    var hiddenEles = [$("#page-title"), $(".level-controller"), $(".ahead-log")];
    _.each(hiddenEles, function (e) {
        e.hide(500);
    });
    setTimeout(function () {
        $("#logs").data("origin-width", $("#logs").width());
        $("#logs").css("width", "100%");
        setLoggerHeight();
    }, 500);
}

function logFullscreenDisable() {
    $("#logs").css("width", $("#logs").data("origin-width") + "px");
    setTimeout(function () {
        var hiddenEles = [$("#page-title"), $(".level-controller"), $(".ahead-log")];
        _.each(hiddenEles, function (e) {
            e.show(500);
        });
        setTimeout(function () {
            setLoggerHeight();
        }, 600);
    }, 400);
}

function setLoggerHeight() {
    var loggerTop = $("#logger").position()['top'];
    var bottomHeight = $(".bottom-action").height();
    var viewportHeight = $(window).height();

    var target = viewportHeight - (loggerTop + bottomHeight + 60);
    $("#logger .panel-body").css("min-height", target + "px");
    $("#logger").css("height", target + "px");
}

var vueInstance = exports.vueInstance = undefined;
function initVue() {
    window._vueInstance = exports.vueInstance = vueInstance = new Vue({
        el: '#logs',
        data: {
            logs: [
                // {content:'log content',flag: 'log flag'} //
            ],
            feLogLevel: "info",
            feLogLevelForClass: [],
            feLogLevelClassObj: { error: false, warn: false, info: false, debug: false, verbose: false, all: false },
            deviceLevel: "",
            deviceLevelClassObj: { error: false, warn: false, info: false, debug: false, verbose: false, all: false },
            isAutoScroll: false,
            isFullscreen: false
        },
        methods: {
            clearLog: function clearLog() {
                this.logs = [];
            },
            changeDisplayLevel: function changeDisplayLevel(e) {
                var displayLevel = $(e.target).data("level");
                if (!displayLevel) {
                    return;
                }
                this.feLogLevel = displayLevel;
                this.updateFeLogLevel();
            },
            updateFeLogLevel: function updateFeLogLevel() {
                var currentLevel = this.feLogLevel;
                var i = LOG_LEVEL_LIST.indexOf(currentLevel);
                var targetLevels = LOG_LEVEL_LIST.slice(i);
                targetLevels = _.map(targetLevels, function (l) {
                    return "level-" + l;
                });
                this.feLogLevelForClass = targetLevels;
                for (var l in this.feLogLevelClassObj) {
                    this.feLogLevelClassObj["" + l] = false;
                }
                this.feLogLevelClassObj["" + currentLevel] = true;
            },
            changeDeviceLevel: function changeDeviceLevel(e) {
                var level = $(e.target).data("level");
                if (!level) {
                    return;
                }
                this.deviceLevel = level;
                this.updateDeviceLevel();
                (0, _debugger.setLogLevel)(level);
            },
            updateDeviceLevel: function updateDeviceLevel() {
                if (!this.deviceLevel || this.deviceLevel.length < 1) {
                    return;
                }
                for (var l in this.deviceLevelClassObj) {
                    this.deviceLevelClassObj["" + l] = false;
                }
                this.deviceLevelClassObj["" + this.deviceLevel] = true;
            },
            autoScrollClick: function autoScrollClick() {
                var self = this;
                setTimeout(function () {
                    if (self.isAutoScroll) {
                        activeLogAutoScroll();
                    } else {
                        disableLogAutoScroll();
                    }
                }, 30);
            },
            wheellogger: function wheellogger(e) {
                disableLogAutoScroll();
                this.isAutoScroll = false;
            },
            setFullscreen: function setFullscreen() {
                if (this.isFullscreen) {
                    logFullscreenDisable();
                    this.isFullscreen = false;
                } else {
                    logFullscreenActive();
                    this.isFullscreen = true;
                }
            }
        }
    });
    vueInstance.updateFeLogLevel();
}