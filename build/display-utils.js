"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require("underscore"),
    npmlog = require('npmlog');

function showLoaderErr(errJSONArray) {
    console.log("Found Error in your weex file:\n");
    _.each(errJSONArray, function (eStr) {
        if (eStr.indexOf("?entry=true") != -1) {
            var _eStr$split = eStr.split("?entry=true"),
                _eStr$split2 = (0, _slicedToArray3.default)(_eStr$split, 2),
                source = _eStr$split2[0],
                info = _eStr$split2[1];

            npmlog.error(source.trim() + " : " + info.trim());
        } else {
            npmlog.error(eStr);
        }
    });
    console.log("\n");
}

function showLoaderWarn(warnJSONObjArray) {

    var showWarningTitle = false;
    _.each(warnJSONObjArray, function (wStr) {
        try {
            var _wStr$split = wStr.split("\n"),
                _wStr$split2 = (0, _slicedToArray3.default)(_wStr$split, 2),
                source = _wStr$split2[0],
                info = _wStr$split2[1];

            source = source.split("!");
            source = source[source.length - 1];
            if (info.indexOf("NOTE:") == -1 && showWarningTitle == false) {
                console.log("Found Warning in your weex file:\n");
                showWarningTitle = true;
            }
            if (info.indexOf("NOTE:") == -1) {
                npmlog.warn(source.trim() + " : " + info.trim());
            }
        } catch (e) {
            npmlog.warn(wStr);
        }
    });
    console.log("\n");
}

function displayWebpackStats(webPackStatsObj) {
    if (displayWebpackStats.runAgain == true) {
        console.log("current we file hot reloaded");
    } else {
        displayWebpackStats.runAgain = true;
    }

    if (!webPackStatsObj || !webPackStatsObj.toJson) {
        return;
    }

    var jsonStats = webPackStatsObj.toJson();

    if (webPackStatsObj.hasErrors && webPackStatsObj.hasErrors() && jsonStats.errors.length > 0) {
        showLoaderErr(jsonStats.errors);
    }

    if (webPackStatsObj.hasWarnings && webPackStatsObj.hasWarnings() && jsonStats.warnings.length > 0) {
        showLoaderWarn(jsonStats.warnings);
    }
}

module.exports = {
    displayWebpackStats: displayWebpackStats
};