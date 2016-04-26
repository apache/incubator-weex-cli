var __weex_define__ = define, __weex_bootstrap__ = bootstrap;
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	;__weex_define__("@weex-component/48c34d39ea9ced4ad5f95df361368f61", [], function(__weex_require__, __weex_exports__, __weex_module__){
	'use strict';

	__webpack_require__(1);
	__webpack_require__(3);

	var c = __webpack_require__(6);

	__weex_module__.exports = {
	    data: function () {return {
	        text: 'Hello ' + c.name
	    }}
	};

	__weex_module__.exports.style = __webpack_require__(7);
	__weex_module__.exports.template = __webpack_require__(8);
	})
	;__weex_bootstrap__("@weex-component/48c34d39ea9ced4ad5f95df361368f61", {"transformerVersion":"0.3.0"}, undefined)

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	;__weex_define__("@weex-component/goto", [], function(__weex_require__, __weex_exports__, __weex_module__){
	'use strict';

	var _b = __webpack_require__(2);

	var _b2 = _interopRequireDefault(_b);

	var _event = __weex_require__('@weex-module/event');

	var event = _interopRequireWildcard(_event);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__weex_module__.exports = {
	    data: function () {return {
	        text: '',
	        paddingLeft: 20
	    }},
	    template: _b2.default,
	    created: function created() {
	        this.text = 'Yes It is! Go Weex >>>';
	    },

	    methods: {
	        clicked: function clicked() {
	            event.openURL('https://github.com/alibaba/weex_toolchain');
	        }
	    }
	};
	})

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports={
	  "type": "container",
	  "children": [
	    {
	      "type": "text",
	      "events": {
	        "click": "clicked"
	      },
	      "style": {
	        "textDecoration": "underline",
	        "paddingLeft": function () {return this.paddingLeft}
	      },
	      "attr": {
	        "value": function () {return this.text}
	      }
	    }
	  ]
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	;__weex_define__("@weex-component/copyright", [], function(__weex_require__, __weex_exports__, __weex_module__){
	__webpack_require__(4);

	;
	    __weex_module__.exports = {
	        data: function () {return {
	            className: ''
	        }},
	        created: function (argument) {
	            this.className = 'copyright';
	        }
	    }

	;__weex_module__.exports.template={
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
	;__weex_module__.exports.style={
	  "copyright": {
	    "textAlign": "center",
	    "paddingTop": 20,
	    "paddingBottom": 20,
	    "color": "#666666",
	    "fontSize": 26
	  }
	}
	})

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	;__weex_define__("@weex-component/company", [], function(__weex_require__, __weex_exports__, __weex_module__){

	;
	var d = __webpack_require__(5);
	__weex_module__.exports = {
	    data: function () {return {
	        name: d.name
	    }}
	}

	;__weex_module__.exports.template={
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
	})

/***/ },
/* 5 */
/***/ function(module, exports) {

	exports.name = 'Alibaba Group';

/***/ },
/* 6 */
/***/ function(module, exports) {

	exports.name = 'Weex-Loader';

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports={
	  "h1": {
	    "fontSize": 60,
	    "color": "#FF0000",
	    "paddingTop": 20,
	    "paddingBottom": 20,
	    "paddingLeft": 20,
	    "paddingRight": 20
	  }
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports={
	  "type": "container",
	  "children": [
	    {
	      "type": "text",
	      "classList": [
	        "h1"
	      ],
	      "attr": {
	        "value": function () {return this.text}
	      }
	    },
	    {
	      "type": "goto"
	    },
	    {
	      "type": "copyright"
	    }
	  ]
	}

/***/ }
/******/ ]);