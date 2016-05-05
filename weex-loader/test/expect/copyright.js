browserifyRequire=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof browserifyRequire=="function"&&browserifyRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof browserifyRequire=="function"&&browserifyRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({"2f45f2510f12e10f1ea5a8ee68e880cd":[function(require,module,exports){
exports.name = 'Alibaba Group';
},{}]},{},[]);


define('@weex-component/company', function (require, exports, module) {

;
var d = browserifyRequire("2f45f2510f12e10f1ea5a8ee68e880cd");
module.exports = {
    data: function () {return {
        name: d.name
    }}
}


;module.exports.style = {}

;module.exports.template = {
  "type": "container",
  "children": [
    {
      "type": "text",
      "style": {
        "textAlign": "center",
        "fontSize": 18,
        "color": "#CCCCCC"
      },
      "attr": {
        "value": function () {return this.name}
      }
    }
  ]
}

;})

// module

define('@weex-component/copyright', function (require, exports, module) {

;
    module.exports = {
        data: function () {return {
            className: ''
        }},
        created: function (argument) {
            this.className = 'copyright';
        }
    }


;module.exports.style = {
  "copyright": {
    "textAlign": "center",
    "paddingTop": 20,
    "paddingBottom": 20,
    "color": "#666666",
    "fontSize": 26
  }
}

;module.exports.template = {
  "type": "container",
  "children": [
    {
      "type": "text",
      "classList": function () {return [this.className]},
      "attr": {
        "value": "Copy right @ 2016 Weex"
      }
    },
    {
      "type": "company"
    }
  ]
}

;})

// require module
bootstrap('@weex-component/copyright', {"transformerVersion":"0.3.1"})