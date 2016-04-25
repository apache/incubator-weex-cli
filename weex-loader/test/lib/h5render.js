(this.nativeLog || function(s) {console.log(s)})('START WEEX HTML5: 0.2.6');
/******/ (function(modules) { // webpackBootstrap
/******/  // The module cache
/******/  var installedModules = {};
/******/
/******/  // The require function
/******/  function __webpack_require__(moduleId) {
/******/
/******/    // Check if module is in cache
/******/    if(installedModules[moduleId])
/******/      return installedModules[moduleId].exports;
/******/
/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      exports: {},
/******/      id: moduleId,
/******/      loaded: false
/******/    };
/******/
/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/    // Flag the module as loaded
/******/    module.loaded = true;
/******/
/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }
/******/
/******/
/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;
/******/
/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;
/******/
/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "";
/******/
/******/  // Load entry module and return exports
/******/  return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict'
  
  __webpack_require__(1)
  
  var config = __webpack_require__(5)
  var Loader = __webpack_require__(6)
  var utils = __webpack_require__(7)
  var protocol = __webpack_require__(8)
  var ComponentManager = __webpack_require__(9)
  var Component = __webpack_require__(16)
  var Sender = __webpack_require__(19)
  var receiver = __webpack_require__(20)
  
  // Components and apis.
  var components = __webpack_require__(21)
  var api = __webpack_require__(66)
  __webpack_require__(96)
  
  var WEAPP_STYLE_ID = 'weapp-style'
  
  var DEFAULT_DESIGN_WIDTH = 750
  var DEFAULT_ROOT_ID = 'weex'
  var DEFAULT_JSON_CALLBACK_NAME = 'weexJsonpCallback'
  
  // config.scale = window.innerWidth / DEFAULT_DESIGN_WIDTH
  
  window.WXEnvironment = {
    weexVersion: config.weexVersion,
    appName: lib.env.aliapp ? lib.env.aliapp.appname : null,
    appVersion: lib.env.aliapp ? lib.env.aliapp.version.val : null,
    platform: lib.env.os ? lib.env.os.name : null,
    osVersion: lib.env.os ? lib.env.os.version.val : null,
    deviceHeight: window.innerHeight / config.scale
  }
  
  var _instanceMap = {}
  
  function Weex(options) {
  
    if (!(this instanceof Weex)) {
      return new Weex(options)
    }
  
    // Width of the root container. Default is window.innerWidth.
    this.width = options.width || window.innerWidth
    this.bundleUrl = options.bundleUrl || location.href
    this.instanceId = options.appId
    this.rootId = options.rootId || (DEFAULT_ROOT_ID + utils.getRandom(10))
    this.designWidth = options.designWidth || DEFAULT_DESIGN_WIDTH
    this.jsonpCallback = options.jsonpCallback || DEFAULT_JSON_CALLBACK_NAME
    this.source = options.source
    this.loader = options.loader
  
    this.data = options.data
  
    this.initScale()
    this.initComponentManager()
    this.initBridge()
    Weex.addInstance(this)
  
    protocol.injectWeexInstance(this)
  
    this.loadBundle(function (err, appCode) {
      if (!err) {
        this.createApp(config, appCode)
      } else {
        console.error('load bundle err:', err)
      }
    }.bind(this))
  
  }
  
  Weex.init = function (options) {
    if (utils.isArray(options)) {
      options.forEach(function (config) {
        new Weex(config)
      })
    } else if (
        Object.prototype.toString.call(options).slice(8, -1) === 'Object'
      ) {
      new Weex(options)
    }
  }
  
  Weex.addInstance = function (instance) {
    _instanceMap[instance.instanceId] = instance
  }
  
  Weex.getInstance = function (instanceId) {
    return _instanceMap[instanceId]
  }
  
  Weex.prototype = {
  
    initBridge: function () {
      receiver.init(this)
      this.sender = new Sender(this)
    },
  
    loadBundle: function (cb) {
      Loader.load({
        jsonpCallback: this.jsonpCallback,
        source: this.source,
        loader: this.loader
      }, cb)
    },
  
    createApp: function (config, appCode) {
      var root = document.querySelector('#' + this.rootId)
      if (!root) {
        root = document.createElement('div')
        root.id = this.rootId
        document.body.appendChild(root)
      }
  
      var promise = window.createInstance(
        this.instanceId
        , appCode
        , {
          bundleUrl: this.bundleUrl,
          debug: config.debug
        }
        , this.data
      )
  
      if (Promise && promise instanceof Promise) {
        promise.then(function () {
          // Weex._instances[this.instanceId] = this.root
        }.bind(this)).catch(function (err) {
          if (err && config.debug) {
            console.error(err)
          }
        })
      }
  
      // Do not destroy instance here, because in most browser
      // press back button to back to this page will not refresh
      // the window and the instance will not be recreated then.
      // window.addEventListener('beforeunload', function (e) {
      // })
  
    },
  
    initScale: function () {
      this.scale = this.width / this.designWidth
    },
  
    initComponentManager: function () {
      this._componentManager = new ComponentManager(this)
    },
  
    getComponentManager: function () {
      return this._componentManager
    }
  }
  
  Weex.appendStyle = function (css) {
    utils.appendStyle(css, WEAPP_STYLE_ID)
  },
  
  // Register a new component with the specified name.
  Weex.registerComponent = function (name, comp) {
    ComponentManager.registerComponent(name, comp)
  },
  
  // Register a new api module.
  // If the module already exists, just add methods from the
  // new module to the old one.
  Weex.registerApiModule = function (name, module, meta) {
    if (!protocol.apiModule[name]) {
      protocol.apiModule[name] = module
    } else {
      for (var key in module) {
        if (module.hasOwnProperty(key)) {
          protocol.apiModule[name][key] = module[key]
        }
      }
    }
    // register API module's meta info to jsframework
    if (meta) {
      protocol.setApiModuleMeta(meta)
      window.registerModules(protocol.getApiModuleMeta(name), true)
    }
  },
  
  // Register a new api method for the specified module.
  // opts:
  //  - args: type of arguments the API method takes such
  //    as ['string', 'function']
  Weex.registerApi = function (moduleName, name, method, args) {
    if (typeof method !== 'function') {
      return
    }
    if (!protocol.apiModule[moduleName]) {
      protocol.apiModule[moduleName] = {}
      protocol._meta[moduleName] = []
    }
    protocol.apiModule[moduleName][name] = method
    if (!args) {
      return
    }
    // register API meta info to jsframework
    protocol.setApiMeta(moduleName, {
      name: name,
      args: args
    })
    window.registerModules(protocol.getApiModuleMeta(moduleName, meta), true)
  },
  
  // Register a new weex-bundle-loader.
  Weex.registerLoader = function (name, loaderFunc) {
    Loader.registerLoader(name, loaderFunc)
  }
  
  // To install components and plugins.
  Weex.install = function (mod) {
    mod.init(Weex)
  }
  
  Weex.stopTheWorld = function () {
    for (var instanceId in _instanceMap) {
      if (_instanceMap.hasOwnProperty(instanceId)) {
        window.destroyInstance(instanceId)
      }
    }
  }
  
  (function startRefreshController() {
    if (location.search.indexOf('hot-reload_controller') === -1)  {
      return
    }
    if (!window.WebSocket) {
      console.info('auto refresh need WebSocket support')
      return
    }
    var host = location.hostname
    var port = 8082
    var client = new WebSocket('ws://' + host + ':' + port + '/',
      'echo-protocol'
    )
    client.onerror = function () {
      console.log('refresh controller websocket connection error')
    }
    client.onmessage = function (e) {
      console.log('Received: \'' + e.data + '\'')
      if (e.data  === 'refresh') {
        location.reload()
      }
    }
  }())
  
  // Weex.install(require('weex-components'))
  Weex.install(components)
  Weex.install(api)
  
  Weex.Component = Component
  Weex.ComponentManager = ComponentManager
  Weex.utils = utils
  Weex.config = config
  
  global.weex = Weex
  module.exports = Weex
  
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(2);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./base.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./base.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n  text-size-adjust: none; }\n\nul, ol {\n  list-style: none; }\n", "", {"version":3,"sources":["/./src/src/styles/base.scss"],"names":[],"mappings":"AAAA;EACE,UAAS;EACT,WAAU;EACV,uBACD,EAAC;;AACF;EACE,iBACD,EAAC","file":"base.scss","sourcesContent":["* {\n  margin:0;\n  padding:0;\n  text-size-adjust:none\n}\nul,ol {\n  list-style:none\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 3 */
/***/ function(module, exports) {

  /*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
  */
  // css base code, injected by the css-loader
  module.exports = function() {
    var list = [];
  
    // return the list of modules as css string
    list.toString = function toString() {
      var result = [];
      for(var i = 0; i < this.length; i++) {
        var item = this[i];
        if(item[2]) {
          result.push("@media " + item[2] + "{" + item[1] + "}");
        } else {
          result.push(item[1]);
        }
      }
      return result.join("");
    };
  
    // import a list of modules into the list
    list.i = function(modules, mediaQuery) {
      if(typeof modules === "string")
        modules = [[null, modules, ""]];
      var alreadyImportedModules = {};
      for(var i = 0; i < this.length; i++) {
        var id = this[i][0];
        if(typeof id === "number")
          alreadyImportedModules[id] = true;
      }
      for(i = 0; i < modules.length; i++) {
        var item = modules[i];
        // skip already imported module
        // this implementation is not 100% perfect for weird media query combinations
        //  when a module is imported multiple times with different media queries.
        //  I hope this will never occur (Hey this way we have smaller bundles)
        if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
          if(mediaQuery && !item[2]) {
            item[2] = mediaQuery;
          } else if(mediaQuery) {
            item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
          }
          list.push(item);
        }
      }
    };
    return list;
  };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

  /*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
  */
  var stylesInDom = {},
    memoize = function(fn) {
      var memo;
      return function () {
        if (typeof memo === "undefined") memo = fn.apply(this, arguments);
        return memo;
      };
    },
    isOldIE = memoize(function() {
      return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
    }),
    getHeadElement = memoize(function () {
      return document.head || document.getElementsByTagName("head")[0];
    }),
    singletonElement = null,
    singletonCounter = 0,
    styleElementsInsertedAtTop = [];
  
  module.exports = function(list, options) {
    if(false) {
      if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
    }
  
    options = options || {};
    // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
    // tags it will allow on a page
    if (typeof options.singleton === "undefined") options.singleton = isOldIE();
  
    // By default, add <style> tags to the bottom of <head>.
    if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
  
    var styles = listToStyles(list);
    addStylesToDom(styles, options);
  
    return function update(newList) {
      var mayRemove = [];
      for(var i = 0; i < styles.length; i++) {
        var item = styles[i];
        var domStyle = stylesInDom[item.id];
        domStyle.refs--;
        mayRemove.push(domStyle);
      }
      if(newList) {
        var newStyles = listToStyles(newList);
        addStylesToDom(newStyles, options);
      }
      for(var i = 0; i < mayRemove.length; i++) {
        var domStyle = mayRemove[i];
        if(domStyle.refs === 0) {
          for(var j = 0; j < domStyle.parts.length; j++)
            domStyle.parts[j]();
          delete stylesInDom[domStyle.id];
        }
      }
    };
  }
  
  function addStylesToDom(styles, options) {
    for(var i = 0; i < styles.length; i++) {
      var item = styles[i];
      var domStyle = stylesInDom[item.id];
      if(domStyle) {
        domStyle.refs++;
        for(var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j](item.parts[j]);
        }
        for(; j < item.parts.length; j++) {
          domStyle.parts.push(addStyle(item.parts[j], options));
        }
      } else {
        var parts = [];
        for(var j = 0; j < item.parts.length; j++) {
          parts.push(addStyle(item.parts[j], options));
        }
        stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
      }
    }
  }
  
  function listToStyles(list) {
    var styles = [];
    var newStyles = {};
    for(var i = 0; i < list.length; i++) {
      var item = list[i];
      var id = item[0];
      var css = item[1];
      var media = item[2];
      var sourceMap = item[3];
      var part = {css: css, media: media, sourceMap: sourceMap};
      if(!newStyles[id])
        styles.push(newStyles[id] = {id: id, parts: [part]});
      else
        newStyles[id].parts.push(part);
    }
    return styles;
  }
  
  function insertStyleElement(options, styleElement) {
    var head = getHeadElement();
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
    if (options.insertAt === "top") {
      if(!lastStyleElementInsertedAtTop) {
        head.insertBefore(styleElement, head.firstChild);
      } else if(lastStyleElementInsertedAtTop.nextSibling) {
        head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
      } else {
        head.appendChild(styleElement);
      }
      styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === "bottom") {
      head.appendChild(styleElement);
    } else {
      throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
    }
  }
  
  function removeStyleElement(styleElement) {
    styleElement.parentNode.removeChild(styleElement);
    var idx = styleElementsInsertedAtTop.indexOf(styleElement);
    if(idx >= 0) {
      styleElementsInsertedAtTop.splice(idx, 1);
    }
  }
  
  function createStyleElement(options) {
    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    insertStyleElement(options, styleElement);
    return styleElement;
  }
  
  function createLinkElement(options) {
    var linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    insertStyleElement(options, linkElement);
    return linkElement;
  }
  
  function addStyle(obj, options) {
    var styleElement, update, remove;
  
    if (options.singleton) {
      var styleIndex = singletonCounter++;
      styleElement = singletonElement || (singletonElement = createStyleElement(options));
      update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
      remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
    } else if(obj.sourceMap &&
      typeof URL === "function" &&
      typeof URL.createObjectURL === "function" &&
      typeof URL.revokeObjectURL === "function" &&
      typeof Blob === "function" &&
      typeof btoa === "function") {
      styleElement = createLinkElement(options);
      update = updateLink.bind(null, styleElement);
      remove = function() {
        removeStyleElement(styleElement);
        if(styleElement.href)
          URL.revokeObjectURL(styleElement.href);
      };
    } else {
      styleElement = createStyleElement(options);
      update = applyToTag.bind(null, styleElement);
      remove = function() {
        removeStyleElement(styleElement);
      };
    }
  
    update(obj);
  
    return function updateStyle(newObj) {
      if(newObj) {
        if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
          return;
        update(obj = newObj);
      } else {
        remove();
      }
    };
  }
  
  var replaceText = (function () {
    var textStore = [];
  
    return function (index, replacement) {
      textStore[index] = replacement;
      return textStore.filter(Boolean).join('\n');
    };
  })();
  
  function applyToSingletonTag(styleElement, index, remove, obj) {
    var css = remove ? "" : obj.css;
  
    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText = replaceText(index, css);
    } else {
      var cssNode = document.createTextNode(css);
      var childNodes = styleElement.childNodes;
      if (childNodes[index]) styleElement.removeChild(childNodes[index]);
      if (childNodes.length) {
        styleElement.insertBefore(cssNode, childNodes[index]);
      } else {
        styleElement.appendChild(cssNode);
      }
    }
  }
  
  function applyToTag(styleElement, obj) {
    var css = obj.css;
    var media = obj.media;
  
    if(media) {
      styleElement.setAttribute("media", media)
    }
  
    if(styleElement.styleSheet) {
      styleElement.styleSheet.cssText = css;
    } else {
      while(styleElement.firstChild) {
        styleElement.removeChild(styleElement.firstChild);
      }
      styleElement.appendChild(document.createTextNode(css));
    }
  }
  
  function updateLink(linkElement, obj) {
    var css = obj.css;
    var sourceMap = obj.sourceMap;
  
    if(sourceMap) {
      // http://stackoverflow.com/a/26603875
      css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
    }
  
    var blob = new Blob([css], { type: "text/css" });
  
    var oldSrc = linkElement.href;
  
    linkElement.href = URL.createObjectURL(blob);
  
    if(oldSrc)
      URL.revokeObjectURL(oldSrc);
  }


/***/ },
/* 5 */
/***/ function(module, exports) {

  'use strict'
  
  var config = {
  
    weexVersion: '1.4.0',
  
    debug: true
  
  }
  
  module.exports = config

/***/ },
/* 6 */
/***/ function(module, exports) {

  'use strict'
  
  function loadByXHR(config, callback) {
    if (!config.source) {
      callback(new Error('xhr loader: missing config.source.'))
    }
    var xhr = new XMLHttpRequest()
    xhr.open('GET', config.source)
    xhr.onload = function () {
      callback(null, this.responseText)
    }
    xhr.onerror = function (error) {
      callback(error)
    }
    xhr.send()
  }
  
  function loadByJsonp(config, callback) {
    if (!config.source) {
      callback(new Error('jsonp loader: missing config.source.'))
    }
    var callbackName = config.jsonpCallback || 'weexJsonpCallback'
    window[callbackName] = function (code) {
      if (code) {
        callback(null, code)
      } else {
        callback(new Error('load by jsonp error'))
      }
    }
    var script = document.createElement('script')
    script.src = decodeURIComponent(config.source)
    script.type = 'text/javascript'
    document.body.appendChild(script)
  }
  
  function loadBySourceCode(config, callback) {
    // src is the jsbundle.
    // no need to fetch from anywhere.
    if (config.source) {
      callback(null, config.source)
    } else {
      callback(new Error('source code laoder: missing config.source.'))
    }
  }
  
  var callbackMap = {
    xhr: loadByXHR,
    jsonp: loadByJsonp,
    source: loadBySourceCode
  }
  
  function load(options, callback) {
    var loadFn = callbackMap[options.loader]
    loadFn(options, callback)
  }
  
  function registerLoader(name, loaderFunc) {
    if (typeof loaderFunc === 'function') {
      callbackMap[name] = loaderFunc
    }
  }
  
  module.exports = {
    load: load,
    registerLoader: registerLoader
  }


/***/ },
/* 7 */
/***/ function(module, exports) {

  'use strict'
  
  var WEAPP_STYLE_ID = 'weapp-style'
  
  var _isWebpSupported = false
  
  ; (function isSupportWebp() {
    try {
      var webP = new Image()
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdA'
                + 'SoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
      webP.onload = function () {
        if (webP.height === 2) {
          _isWebpSupported = true
        }
      }
    } catch (e) {
      // do nothing.
    }
  })()
  
  function extend(to, from) {
    for (var key in from) {
      to[key] = from[key]
    }
    return to
  }
  
  function isArray(arr) {
    return Array.isArray
      ? Array.isArray(arr)
      : (Object.prototype.toString.call(arr) === '[object Array]')
  }
  
  function appendStyle(css, styleId, replace) {
    var style = document.getElementById(styleId)
    if (style && replace) {
      style.parentNode.removeChild(style)
      style = null
    }
    if (!style) {
      style = document.createElement('style')
      style.type = 'text/css'
      styleId && (style.id = styleId)
      document.getElementsByTagName('head')[0].appendChild(style)
    }
    style.appendChild(document.createTextNode(css))
  }
  
  function getUniqueFromArray(arr) {
    if (!isArray(arr)) {
      return []
    }
    var res = []
    var unique = {}
    var val
    for (var i = 0, l = arr.length; i < l; i++) {
      val = arr[i]
      if (unique[val]) {
        continue
      }
      unique[val] = true
      res.push(val)
    }
    return res
  }
  
  function transitionize(element, props) {
    var transitions = []
    for (var key in props) {
      transitions.push(key + ' ' + props[key])
    }
    element.style.transition = transitions.join(', ')
    element.style.webkitTransition = transitions.join(', ')
  }
  
  function detectWebp() {
    return _isWebpSupported
  }
  
  function getRandom(num) {
    var _defaultNum = 10
    if (typeof num !== 'number' || num <= 0) {
      num = _defaultNum
    }
    var _max = Math.pow(10, num)
    return Math.floor(Date.now() + Math.random() * _max) % _max
  }
  
  module.exports = {
    extend: extend,
    isArray: isArray,
    appendStyle: appendStyle,
    getUniqueFromArray: getUniqueFromArray,
    transitionize: transitionize,
    detectWebp: detectWebp,
    getRandom: getRandom
  }

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var extend = __webpack_require__(7).extend
  var isArray = __webpack_require__(7).isArray
  var ComponentManager = __webpack_require__(9)
  
  // for jsframework to register modules.
  var _registerModules = function (config) {
    if (isArray(config)) {
      for (var i = 0, l = config.length; i < l; i++) {
        window.registerModules(config[i])
      }
    } else {
      window.registerModules(config)
    }
  }
  
  var protocol = {
  
    // weex instances
    _instances: [],
  
    // api meta info
    _meta: [],
  
    apiModule: {},
  
    injectWeexInstance: function (instance) {
      this._instances[instance.instanceId] = instance
    },
  
    getWeexInstance: function (instanceId) {
      return this._instances[instanceId]
    },
  
    // get the api method meta info array for the module.
    getApiModuleMeta: function (moduleName) {
      var metaObj = {}
      metaObj[moduleName] = this._meta[moduleName]
      return metaObj
    },
  
    // Set meta info for a api module.
    // If there is a same named api, just replace it.
    // opts:
    // - metaObj: meta object like
    // {
    //    dom: [{
    //      name: 'addElement',
    //      args: ['string', 'object']
    //    }]
    // }
    setApiModuleMeta: function (metaObj) {
      var moduleName
      for (var k in metaObj) {
        if (metaObj.hasOwnProperty(k)) {
          moduleName = k
        }
      }
      var metaArray = this._meta[moduleName]
      if (!metaArray) {
        this._meta[moduleName] = metaObj[moduleName]
      } else {
        var nameObj = {}
        metaObj[moduleName].forEach(function (api) {
          nameObj[api.name] = api
        })
        metaArray.forEach(function (api, i) {
          if (nameObj[api.name]) {
            metaArray[i] = nameObj[api.name]
            delete nameObj[api.name]
          }
        })
        for (var k in metaObj) {
          if (metaObj.hasOwnProperty(k)) {
            metaArray.push(metaObj[k])
          }
        }
      }
      this._meta[moduleName] = metaObj[moduleName]
    },
  
    // Set meta info for a single api.
    // opts:
    //  - moduleName: api module name.
    //  - meta: a meta object like:
    //  {
    //    name: 'addElement',
    //    args: ['string', 'object']
    //  }
    setApiMeta: function (moduleName, meta) {
      var metaArray = this._meta[moduleName]
      if (!metaArray) {
        this._meta[moduleName] = [meta]
      } else {
        var metaIdx = -1
        metaArray.forEach(function (api, i) {
          if (meta.name === name) {
            metaIdx = i
          }
        })
        if (metaIdx !== -1) {
          metaArray[metaIdx] = meta
        } else {
          metaArray.push(meta)
        }
      }
    }
  }
  
  _registerModules([{
    modal: [{
      name: 'toast',
      args: ['object', 'function']
    }, {
      name: 'alert',
      args: ['object', 'function']
    }, {
      name: 'confirm',
      args: ['object', 'function']
    }, {
      name: 'prompt',
      args: ['object', 'function']
    }]
  }, {
    animation: [{
      name: 'transition',
      args: ['string', 'object', 'function']
    }]
  }])
  
  module.exports = protocol


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var config = __webpack_require__(5)
  var FrameUpdater = __webpack_require__(10)
  var AppearWatcher = __webpack_require__(11)
  var utils = __webpack_require__(7)
  var LazyLoad = __webpack_require__(12)
  var animation = __webpack_require__(15)
  
  var RENDERING_INDENT = 800
  
  var _instanceMap = {}
  var typeMap = {}
  var scrollableTypes = ['scroller', 'list']
  
  function ComponentManager(instance) {
    this.instanceId = instance.instanceId
    this.weexInstance = instance
    this.componentMap = {}
    _instanceMap[this.instanceId] = this
  }
  
  ComponentManager.getInstance = function (instanceId) {
    return _instanceMap[instanceId]
  }
  
  ComponentManager.getWeexInstance = function (instanceId) {
    return _instanceMap[instanceId].weexInstance
  }
  
  ComponentManager.registerComponent = function (type, definition) {
    typeMap[type] = definition
  }
  
  ComponentManager.getScrollableTypes = function () {
    return scrollableTypes
  }
  
  ComponentManager.prototype = {
  
    // Fire a event 'renderbegin'/'renderend' on body element.
    rendering: function () {
      function _renderingEnd() {
        // get weex instance root
        window.dispatchEvent(new Event('renderend'))
        this._renderingTimer = null
      }
      if (this._renderingTimer) {
        clearTimeout(this._renderingTimer)
        this._renderingTimer = setTimeout(
          _renderingEnd.bind(this),
          RENDERING_INDENT
        )
      } else {
        window.dispatchEvent(new Event('renderbegin'))
        this._renderingTimer = setTimeout(
          _renderingEnd.bind(this),
          RENDERING_INDENT
        )
      }
    },
  
    getElementByRef: function (ref) {
      return this.componentMap[ref]
    },
  
    removeElementByRef: function (ref) {
      var cmp
      var self = this
      if (!ref || !(cmp = this.componentMap[ref])) {
        return
      }
      // remove from this.componentMap cursively
      (function _removeCursively(_ref) {
        var child = self.componentMap[_ref]
        var listeners = child._listeners
        var children = child.data.children
        if (children && children.length) {
          for (var i = 0, l = children.length; i < l; i++) {
            _removeCursively(children[i].ref)
          }
        }
        // remove events from _ref component
        if (listeners) {
          for (var type in listeners) {
            child.node.removeEventListener(type, listeners[type])
          }
        }
        delete child._listeners
        delete child.node._listeners
        // remove _ref component
        delete self.componentMap[_ref]
      })(ref)
  
    },
  
    createElement: function (data, nodeType) {
      var ComponentType = typeMap[data.type]
      if (!ComponentType) {
        ComponentType = typeMap['container']
      }
  
      var ref = data.ref
      var component = new ComponentType(data, nodeType)
  
      this.componentMap[ref] = component
      component.node.setAttribute('data-ref', ref)
  
      return component
    },
  
    /**
     * createBody: generate root component
     * @param  {object} element
     */
    createBody: function (element) {
  
      // TODO: creatbody on document.body
      // no need to create a extra div
      var root, body, nodeType
      if (this.componentMap['_root']) {
        return
      }
  
      nodeType = element.type
      element.type = 'root'
      element.rootId = this.weexInstance.rootId
      element.ref = '_root'
  
      var root = this.createElement(element, nodeType)
      body = document.querySelector('#' + this.weexInstance.rootId)
            || document.body
      body.appendChild(root.node)
      root._appended = true
    },
  
    appendChild: function (parentRef, data) {
      var parent = this.componentMap[parentRef]
  
      if (this.componentMap[data.ref] || !parent) {
        return
      }
  
      if (parentRef === '_root' && !parent) {
        parent = this.createElement({
          type: 'root',
          rootId: this.weexInstance.rootId,
          ref: '_root'
        })
        parent._appended = true
      }
  
      var child = parent.appendChild(data)
  
      // In some parent component the implementation of method
      // appendChild didn't return the component at all, therefor
      // child maybe a undefined object.
      if (child) {
        child.parentRef = parentRef
      }
  
      if (child && parent._appended) {
        this.handleAppend(child)
      }
    },
  
    appendChildren: function (ref, elements) {
      for (var i = 0; i < elements.length; i++) {
        this.appendChild(ref, elements[i])
      }
    },
  
    removeElement: function (ref) {
      var component = this.componentMap[ref]
  
      // fire event for rendering dom on body elment.
      this.rendering()
  
      if (component && component.parentRef) {
        var parent = this.componentMap[component.parentRef]
        component.onRemove && component.onRemove()
        parent.removeChild(component)
      } else {
        console.warn('ref: ', ref)
      }
    },
  
    moveElement: function (ref, parentRef, index) {
      var component = this.componentMap[ref]
      var newParent = this.componentMap[parentRef]
      var oldParentRef = component.parentRef
      var children, before, i, l
      if (!component || !newParent) {
        console.warn('ref: ', ref)
        return
      }
  
      // fire event for rendering dom on body elment.
      this.rendering()
  
      // remove from oldParent.data.children
      if (oldParentRef && this.componentMap[oldParentRef]) {
        children = this.componentMap[oldParentRef].data.children
        if (children && children.length) {
          for (i = 0, l = children.length; i < l; i++) {
            if (children[i].ref === ref) {
              break
            }
          }
          if (l > i) {
            children.splice(i, 1)
          }
        }
      }
  
      if (index < -1) {
        index = -1
        console.warn('index cannot be less than -1.')
      }
  
      children = newParent.data.children
      if (children
          && children.length
          && index !== -1
          && index < children.length) {
        before = this.componentMap[newParent.data.children[index].ref]
        newParent.insertBefore(component, before)
      } else {  // append
        newParent.insertBefore(component)
      }
  
      component.onMove && component.onMove(parentRef, index)
  
    },
  
    insertBefore: function (ref, data) {
      var child, before, parent
      before = this.componentMap[ref]
      child = this.componentMap[data.ref]
      before && (parent = this.componentMap[before.parentRef])
      if (child || !parent || !before) {
        return
      }
  
      child = this.createElement(data)
      if (child) {
        child.parentRef = before.parentRef
        parent.insertBefore(child, before)
      } else {
        return
      }
  
      if (this.componentMap[before.parentRef]._appended) {
        this.handleAppend(child)
      }
    },
  
    /**
     * addElement
     * If index is larget than any child's index, the
     * element will be appended behind.
     * @param {string} parentRef
     * @param {obj} element (data of the component)
     * @param {number} index
     */
    addElement: function (parentRef, element, index) {
      var parent, children, before
  
      // fire event for rendering dom on body elment.
      this.rendering()
  
      parent = this.componentMap[parentRef]
      if (!parent) {
        return
      }
      children = parent.data.children
      // -1 means append as the last.
      if (index < -1) {
        index = -1
        console.warn('index cannot be less than -1.')
      }
      if (children && children.length
          && children.length > index
          && index !== -1) {
        this.insertBefore(children[index].ref, element)
      } else {
        this.appendChild(parentRef, element)
      }
    },
  
    clearChildren: function (ref) {
      var component = this.componentMap[ref]
      if (component) {
        component.node.innerHTML = ''
        if (component.data) {
          component.data.children = null
        }
      }
    },
  
    addEvent: function (ref, type) {
      var component
      if (typeof ref === 'string' || typeof ref === 'number') {
        component = this.componentMap[ref]
      } else if (Object.prototype.toString.call(ref).slice(8, -1) === 'Object') {
        component = ref
        ref = component.data.ref
      }
      if (component && component.node) {
        var sender = this.weexInstance.sender
        var listener = sender.fireEvent.bind(sender, ref, type)
        var listeners = component._listeners
        component.node.addEventListener(type, listener, false, false)
        if (!listeners) {
          listeners = component._listeners = {}
          component.node._listeners = {}
        }
        listeners[type] = listener
        component.node._listeners[type] = listener
      }
    },
  
    removeEvent: function (ref, type) {
      var component = this.componentMap[ref]
      var listener = component._listeners[type]
      if (component && listener) {
        component.node.removeEventListener(type, listener)
        component._listeners[type] = null
        component.node._listeners[type] = null
      }
    },
  
    updateAttrs: function (ref, attr) {
      var component = this.componentMap[ref]
      if (component) {
        component.updateAttrs(attr)
        if (component.data.type === 'image' && attr.src) {
          LazyLoad.startIfNeeded(component)
        }
      }
    },
  
    updateStyle: function (ref, style) {
      var component = this.componentMap[ref]
      if (component) {
        component.updateStyle(style)
      }
    },
  
    updateFullAttrs: function (ref, attr) {
      var component = this.componentMap[ref]
      if (component) {
        component.clearAttr()
        component.updateAttrs(attr)
        if (component.data.type === 'image' && attr.src) {
          LazyLoad.startIfNeeded(component)
        }
      }
    },
  
    updateFullStyle: function (ref, style) {
      var component = this.componentMap[ref]
      if (component) {
        component.clearStyle()
        component.updateStyle(style)
      }
    },
  
    handleAppend: function (component) {
      component._appended = true
      component.onAppend && component.onAppend()
  
      // invoke onAppend on children recursively
      var children = component.data.children
      if (children) {
        for (var i = 0; i < children.length; i++) {
          var child = this.componentMap[children[i].ref]
          if (child) {
            this.handleAppend(child)
          }
        }
      }
  
      // watch appear/disappear of the component if needed
      AppearWatcher.watchIfNeeded(component)
  
      // do lazyload if needed
      LazyLoad.startIfNeeded(component)
    },
  
    transition: function (ref, config, callback) {
      var component = this.componentMap[ref]
      animation.transitionOnce(component, config, callback)
    },
  
    renderFinish: function () {
      FrameUpdater.pause()
    }
  }
  
  module.exports = ComponentManager


/***/ },
/* 10 */
/***/ function(module, exports) {

  'use strict'
  
  var raf = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (calllback) {
              setTimeout(calllback, 16)
            }
  
  var rafId
  var observers = []
  var paused = false
  
  var FrameUpdater = {
    start: function () {
      if (rafId) {
        return
      }
  
      rafId = raf(function runLoop() {
        if (!paused) {
          for (var i = 0; i < observers.length; i++) {
            observers[i]()
          }
          raf(runLoop)
        }
      })
    },
  
    isActive: function () {
      return !paused
    },
  
    pause: function () {
      paused = true
      rafId = undefined
    },
  
    resume: function () {
      paused = false
      this.start()
    },
  
    addUpdateObserver: function (observeMethod) {
      observers.push(observeMethod)
    }
  }
  
  module.exports = FrameUpdater


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var utils = __webpack_require__(7)
  
  var componentsInScroller = []
  var componentsOutOfScroller = []
  var listened = false
  var direction = 'up'
  var scrollY = 0
  
  var AppearWatcher = {
    watchIfNeeded: function (component) {
      if (needWatch(component)) {
        if (component.isInScrollable()) {
          componentsInScroller.push(component)
        } else {
          componentsOutOfScroller.push(component)
        }
        if (!listened) {
          listened = true
          // var handler = throttle(onScroll, 25)
          var handler = throttle(onScroll, 100)
          window.addEventListener('scroll', handler, false)
        }
      }
    }
  }
  
  function needWatch(component) {
    var events = component.data.event
    if (events
        && (events.indexOf('appear') != -1
          || events.indexOf('disappear') != -1)) {
      return true
    }
    return false
  }
  
  function onScroll(e) {
    // If the scroll event is dispatched from a scrollable component
    // implemented through scrollerjs, then the appear/disappear events
    // should be treated specially by handleScrollerScroll.
    if (e.originalType === 'scrolling') {
      handleScrollerScroll()
    } else {
      handleWindowScroll()
    }
  }
  
  function handleScrollerScroll() {
    var cmps = componentsInScroller
    var len = cmps.length
    for (var i = 0; i < len; i++) {
      var component = cmps[i]
      var appear = isComponentInScrollerAppear(component)
      if (appear && !component._appear) {
        component._appear = true
        fireEvent(component, 'appear')
      } else if (!appear && component._appear) {
        component._appear = false
        fireEvent(component, 'disappear')
      }
    }
  }
  
  function handleWindowScroll() {
    var y = window.scrollY
    direction = y >= scrollY ? 'up' : 'down'
    scrollY = y
  
    var len = componentsOutOfScroller.length
    if (len === 0) {
      return
    }
    for (var i = 0; i < len; i++) {
      var component = componentsOutOfScroller[i]
      var appear = isComponentInWindow(component)
      if (appear && !component._appear) {
        component._appear = true
        fireEvent(component, 'appear')
      } else if (!appear && component._appear) {
        component._appear = false
        fireEvent(component, 'disappear')
      }
    }
  }
  
  function isComponentInScrollerAppear(component) {
    var parentScroller = component._parentScroller
    var cmpRect = component.node.getBoundingClientRect()
    if (!isComponentInWindow(component)) {
      return false
    }
    while (parentScroller) {
      var parentRect = parentScroller.node.getBoundingClientRect()
      if (!(cmpRect.right > parentRect.left
          && cmpRect.left < parentRect.right
          && cmpRect.bottom > parentRect.top
          && cmpRect.top < parentRect.bottom)) {
        return false
      }
      parentScroller = parentScroller._parentScroller
    }
    return true
  }
  
  function isComponentInWindow(component) {
    var rect = component.node.getBoundingClientRect()
    return rect.right > 0 && rect.left < window.innerWidth &&
           rect.bottom > 0 && rect.top < window.innerHeight
  }
  
  function fireEvent(component, type) {
    var evt = document.createEvent('HTMLEvents')
    var data = { direction: direction }
    evt.initEvent(type, false, false)
    evt.data = data
    utils.extend(evt, data)
    component.node.dispatchEvent(evt)
  }
  
  function throttle(func, wait) {
    var context, args, result
    var timeout = null
    var previous = 0
    var later = function () {
      previous = Date.now()
      timeout = null
      result = func.apply(context, args)
    }
    return function () {
      var now = Date.now()
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0) {
        clearTimeout(timeout)
        timeout = null
        previous = now
        result = func.apply(context, args)
      } else if (!timeout) {
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  }
  
  module.exports = AppearWatcher

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  __webpack_require__(13)
  
  var lazyloadTimer
  
  var LazyLoad = {
    makeImageLazy: function (image, src) {
      image.removeAttribute('img-src')
      image.removeAttribute('i-lazy-src')
      image.removeAttribute('src')
      image.setAttribute('img-src', src)
      // should replace 'src' with 'img-src'. but for now lib.img.fire is
      // not working for the situation that the appear event has been
      // already triggered.
      // image.setAttribute('src', src)
      // image.setAttribute('img-src', src)
      this.fire()
    },
  
    // we don't know when all image are appended
    // just use setTimeout to do delay lazyload
    //
    // -- actually everytime we add a element or update styles,
    // the component manager will call startIfNeed to fire
    // lazyload once again in the handleAppend function. so there
    // is no way that any image element can miss it. See source
    // code in componentMangager.js.
    startIfNeeded: function (component) {
      var that = this
      if (component.data.type === 'image') {
        if (!lazyloadTimer) {
          lazyloadTimer = setTimeout(function () {
            that.fire()
            clearTimeout(lazyloadTimer)
            lazyloadTimer = null
          }, 16)
        }
      }
    },
  
    loadIfNeeded: function (elementScope) {
      var notPreProcessed = elementScope.querySelectorAll('[img-src]')
      var that = this
      // image elements which have attribute 'i-lazy-src' were elements
      // that had been preprocessed by lib-img-core, but not loaded yet, and
      // must be loaded when 'appear' events were fired. It turns out the
      // 'appear' event was not fired correctly in the css-translate-transition
      // situation, so 'i-lazy-src' must be checked and lazyload must be
      // fired manually.
      var preProcessed = elementScope.querySelectorAll('[i-lazy-src]')
      if (notPreProcessed.length > 0 || preProcessed.length > 0) {
        that.fire()
      }
    },
  
    // fire lazyload.
    fire: function () {
      lib.img.fire()
    }
  
  }
  
  module.exports = LazyLoad


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

  "undefined"==typeof window&&(window={ctrl:{},lib:{}}),!window.ctrl&&(window.ctrl={}),!window.lib&&(window.lib={}),function(t,i){function e(t,i){i&&("IMG"==t.nodeName.toUpperCase()?t.setAttribute("src",i):t.style.backgroundImage='url("'+i+'")')}function a(){r=i.appear.init({cls:"imgtmp",once:!0,x:o.lazyWidth,y:o.lazyHeight,onAppear:function(t){var i=this;e(i,i.getAttribute("i-lazy-src")),i.removeAttribute("i-lazy-src")}})}__webpack_require__(14);var r,A={},o={dataSrc:"img-src",lazyHeight:0,lazyWidth:0};A.logConfig=function(){console.log("lib-img Config\n",o)},A.fire=function(){r||a();var t="i_"+Date.now()%1e5,i=document.querySelectorAll("["+o.dataSrc+"]");[].forEach.call(i,function(i){"false"==i.dataset.lazy&&"true"!=i.dataset.lazy?e(i,processSrc(i,i.getAttribute(o.dataSrc))):(i.classList.add(t),i.setAttribute("i-lazy-src",i.getAttribute(o.dataSrc))),i.removeAttribute(o.dataSrc)}),r.bind("."+t),r.fire()},A.defaultSrc="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==",i.img=A,module.exports=A}(window,window.lib||(window.lib={}));

/***/ },
/* 14 */
/***/ function(module, exports) {

  "undefined"==typeof window&&(window={ctrl:{},lib:{}}),!window.ctrl&&(window.ctrl={}),!window.lib&&(window.lib={}),function(n,e){function i(){d=w.createEvent("HTMLEvents"),v=w.createEvent("HTMLEvents"),d.initEvent("_appear",!1,!0),v.initEvent("_disappear",!1,!0)}function a(t,n){var e,i,a,s=(Date.now(),0),o=null,r=function(){s=Date.now(),o=null,t.apply(e,i)};return function(){var l=Date.now();e=this,i=arguments;var c=n-(l-s);return 0>=c||c>=n?(clearTimeout(o),o=null,a=t.apply(e,i)):null==o&&(o=setTimeout(r,c)),a}}function s(n,e){var n,i,a,s;if(n)return e||(e={x:0,y:0}),n!=window?(n=n.getBoundingClientRect(),i=n.left,t=n.top,a=n.right,s=n.bottom):(i=0,t=0,a=i+n.innerWidth,s=t+n.innerHeight),{left:i,top:t,right:a+e.x,bottom:s+e.y}}function o(t,n){var e=n.right>t.left&&n.left<t.right,i=n.bottom>t.top&&n.top<t.bottom;return e&&i}function r(t,n){var e="none",i=t.left-n.left,a=t.top-n.top;return 0==a&&(e=0!=i?i>0?"left":"right":"none"),0==i&&(e=0!=a?a>0?"up":"down":"none"),e}function l(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);return t}function c(){var t=this,n=a(function(){f.apply(t,arguments)},this.options.wait);this.__handle&&(this.container.removeEventListener("scroll",this.__handle),this.__handle=null),this.__handle=n,this.container.addEventListener("scroll",n,!1),this.container.addEventListener("resize",function(n){f.apply(t,arguments)},!1),this.container.addEventListener("animationEnd",function(){f.apply(t,arguments)},!1),this.container.addEventListener("webkitAnimationEnd",function(){f.apply(t,arguments)},!1),this.container.addEventListener("transitionend",function(){f.apply(t,arguments)},!1)}function p(t){var n=this,e=this.options.container;if("string"==typeof e?this.container=w.querySelector(e):this.container=e,this.container==window)var i=w.querySelectorAll(t);else var i=this.container.querySelectorAll(t);var i=[].slice.call(i,null);return i=i.filter(function(t){return"1"==t.dataset.bind?(delete t._hasAppear,delete t._hasDisAppear,delete t._appear,t.classList.remove(n.options.cls),!1):!0})}function h(t){var n=this;t&&t.length>0&&[].forEach.call(t,function(t){t._eleOffset=s(t),t.classList.remove(n.options.cls),t.dataset.bind=1})}function f(){var t=this.container,n=this.appearWatchElements,e=this.options.onAppear,i=this.options.onDisappear,a=s(t,{x:this.options.x,y:this.options.y}),l=this.options.once,c=arguments[0]||{};n&&n.length>0&&[].forEach.call(n,function(t,n){var p=s(t),h=r(t._eleOffset,p);t._eleOffset=p;var f=o(a,p),u=t._appear,w=t._hasAppear,E=t._hasDisAppear;d.data={direction:h},v.data={direction:h},f&&!u?(l&&!w||!l)&&(e&&e.call(t,c),t.dispatchEvent(d),t._hasAppear=!0,t._appear=!0):!f&&u&&(l&&!E||!l)&&(i&&i.call(t,c),t.dispatchEvent(v),t._hasDisAppear=!0,t._appear=!1)})}function u(t){l(this.options,t||(t={})),this.appearWatchElements=this.appearWatchElements||p.call(this,"."+this.options.cls),h.call(this,this.appearWatchElements),c.call(this)}var d,v,w=document,E=function(){u.apply(this,arguments)},_={instances:[],init:function(t){var n={options:{container:window,wait:100,x:0,y:0,cls:"lib-appear",once:!1,onReset:function(){},onAppear:function(){},onDisappear:function(){}},container:null,appearWatchElements:null,bind:function(t){var n=this.options.cls;if("string"==typeof t){var e=p.call(this,t);[].forEach.call(e,function(t,e){t.classList.contains(n)||t.classList.add(n)})}else{if(1!=t.nodeType||!this.container.contains(t))return this;t.classList.contains(n)||t.classList.add(n)}var i=p.call(this,"."+this.options.cls);return this.appearWatchElements=this.appearWatchElements.concat(i),h.call(this,i),this},reset:function(t){return u.call(this,t),this.appearWatchElements.forEach(function(t){delete t._hasAppear,delete t._hasDisAppear,delete t._appear}),this},fire:function(){this.appearWatchElements||(this.appearWatchElements=[]);var t=p.call(this,"."+this.options.cls);return this.appearWatchElements=this.appearWatchElements.concat(t),h.call(this,t),f.call(this),this}};E.prototype=n;var e=new E(t);return this.instances.push(e),e},fireAll:function(){var t=this.instances;t.forEach(function(t){t.fire()})}};i(),e.appear=_}(window,window.lib||(window.lib={}));

/***/ },
/* 15 */
/***/ function(module, exports) {

  'use strict'
  
  module.exports = {
  
    /**
     * config:
     *   - styles
     *   - duration [Number] milliseconds(ms)
     *   - timingFunction [string]
     *   - dealy [Number] milliseconds(ms)
     */
    transitionOnce: function (comp, config, callback) {
      var styles = config.styles || {}
      var duration = config.duration || 1000 // ms
      var timingFunction = config.timingFunction || 'ease'
      var delay = config.delay || 0  // ms
      var transitionValue = 'all ' + duration + 'ms '
          + timingFunction + ' ' + delay + 'ms'
      var dom = comp.node
      var transitionEndHandler = function (e) {
        e.stopPropagation()
        dom.removeEventListener('webkitTransitionEnd', transitionEndHandler)
        dom.removeEventListener('transitionend', transitionEndHandler)
        dom.style.transition = ''
        dom.style.webkitTransition = ''
        callback()
      }
      dom.style.transition = transitionValue
      dom.style.webkitTransition = transitionValue
      dom.addEventListener('webkitTransitionEnd', transitionEndHandler)
      dom.addEventListener('transitionend', transitionEndHandler)
      comp.updateStyle(styles)
    }
  
  }

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var config = __webpack_require__(5)
  var utils = __webpack_require__(7)
  var ComponentManager = __webpack_require__(9)
  var flexbox = __webpack_require__(17)
  __webpack_require__(18)
  
  function Component(data, nodeType) {
    this.data = data
    this.node = this.create(nodeType)
  
    this.createChildren()
    this.updateAttrs(this.data.attr)
    // issue: when add element to a list in lifetime hook 'ready', the
    // styles is set to the classStyle, not style. This is a issue
    // that jsframework should do something about.
    var classStyle = this.data.classStyle
    classStyle && this.updateStyle(this.data.classStyle)
    this.updateStyle(this.data.style)
    this.bindEvents(this.data.event)
  }
  
  Component.prototype = {
  
    create: function (nodeType) {
      var node = document.createElement(nodeType || 'div')
      return node
    },
  
    getComponentManager: function () {
      return ComponentManager.getInstance(this.data.instanceId)
    },
  
    getParent: function () {
      return this.getComponentManager().componentMap[this.parentRef]
    },
  
    isScrollable: function () {
      var t = this.data.type
      return ComponentManager.getScrollableTypes().indexOf(t) !== -1
    },
  
    isInScrollable: function () {
      if (typeof this._isInScrollable === 'boolean') {
        return this._isInScrollable
      }
      var parent = this.getParent()
      if (parent
          && (typeof parent._isInScrollable !== 'boolean')
          && !parent.isScrollable()) {
        if (parent.data.type === 'root') {
          this._isInScrollable = false
          return false
        }
        this._isInScrollable = parent.isInScrollable()
        this._parentScroller = parent._parentScroller
        return this._isInScrollable
      }
      if (typeof parent._isInScrollable === 'boolean') {
        this._isInScrollable = parent._isInScrollable
        this._parentScroller = parent._parentScroller
        return this._isInScrollable
      }
      if (parent.isScrollable()) {
        this._isInScrollable = true
        this._parentScroller = parent
        return true
      }
      if (!parent) {
        console && console.error('isInScrollable - parent not exist.')
      }
    },
  
    createChildren: function () {
      var children = this.data.children
      var parentRef = this.data.ref
      var componentManager = this.getComponentManager()
      if (children && children.length) {
        var fragment = document.createDocumentFragment()
        var isFlex = false
        for (var i = 0; i < children.length; i++) {
          children[i].instanceId = this.data.instanceId
          children[i].scale = this.data.scale
          var child = componentManager.createElement(children[i])
          fragment.appendChild(child.node)
          child.parentRef = parentRef
          if (!isFlex
              && child.data.style
              && child.data.style.hasOwnProperty('flex')
            ) {
            isFlex = true
          }
        }
        this.node.appendChild(fragment)
      }
    },
  
    // @todo: changed param data to child
    appendChild: function (data) {
      var children = this.data.children
      var componentManager = this.getComponentManager()
      var child = componentManager.createElement(data)
      this.node.appendChild(child.node)
      // update this.data.children
      if (!children || !children.length) {
        this.data.children = [data]
      } else {
        children.push(data)
      }
  
      return child
    },
  
    insertBefore: function (child, before) {
      var children = this.data.children
      var i = 0
      var l
      var isAppend = false
  
      // update this.data.children
      if (!children || !children.length || !before) {
        isAppend = true
      } else {
        for (l = children.length; i < l; i++) {
          if (children[i].ref === before.data.ref) {
            break
          }
        }
        if (i === l) {
          isAppend = true
        }
      }
  
  
      if (isAppend) {
        this.node.appendChild(child.node)
        children.push(child.data)
      } else {
        this.node.insertBefore(child.node, before.node)
        children.splice(i, 0, child.data)
      }
  
    },
  
    removeChild: function (child) {
      var children = this.data.children
      // remove from this.data.children
      var i = 0
      var componentManager = this.getComponentManager()
      if (children && children.length) {
        for (var l = children.length; i < l; i++) {
          if (children[i].ref === child.data.ref) {
            break
          }
        }
        if (i < l) {
          children.splice(i, 1)
        }
      }
      // remove from componentMap recursively
      componentManager.removeElementByRef(child.data.ref)
      this.node.removeChild(child.node)
    },
  
    updateAttrs: function (attrs) {
      // Note：attr must be injected into the dom element because
      // it will be accessed from the outside developer by event.target.attr.
      if (!this.node.attr) {
        this.node.attr = {}
      }
      for (var key in attrs) {
        var value = attrs[key]
        var attrSetter = this.attr[key]
        if (typeof attrSetter === 'function') {
          attrSetter.call(this, value)
        } else {
          if (typeof value === 'boolean') {
            this.node[key] = value
          } else {
            this.node.setAttribute(key, value)
          }
          this.node.attr[key] = value
        }
      }
    },
  
    updateStyle: function (style) {
      for (var key in style) {
        var value = style[key]
        var styleSetter = this.style[key]
  
        if (typeof styleSetter === 'function') {
          styleSetter.call(this, value)
        } else {
          if (typeof value === 'number'
              && (key !== 'flex' && key !== 'opacity' && key !== 'zIndex')
            ) {
            value = value * this.data.scale + 'px'
          }
          this.node.style[key] = value
        }
      }
    },
  
    bindEvents: function (evts) {
      var componentManager = this.getComponentManager()
      if (evts
          && Object.prototype.toString.call(evts).slice(8, -1) === 'Array'
        ) {
        for (var i = 0, l = evts.length; i < l; i++) {
          componentManager.addEvent(this, evts[i])
        }
      }
    },
  
    // dispatch a specified event on this.node
    //  - type: event type
    //  - data: event data
    //  - config: event config object
    //     - bubbles
    //     - cancelable
    dispatchEvent: function (type, data, config) {
      var event = document.createEvent('HTMLEvents')
      config = config || {}
      event.initEvent(type, config.bubbles || false, config.cancelable || false)
      !data && (data = {})
      event.data = utils.extend({}, data)
      utils.extend(event, data)
      if (type === 'appear') {
        console.log('appear', data)
      }
      this.node.dispatchEvent(event)
    },
  
    updateRecursiveAttr: function (data) {
      this.updateAttrs(data.attr)
      var componentManager = this.getComponentManager()
      var children = this.data.children
      if (children) {
        for (var i = 0; i < children.length; i++) {
          var child = componentManager.getElementByRef(children[i].ref)
          if (child) {
            child.updateRecursiveAttr(data.children[i])
          }
        }
      }
    },
  
    updateRecursiveStyle: function (data) {
      this.updateStyle(data.style)
      var componentManager = this.getComponentManager()
      var children = this.data.children
      if (children) {
        for (var i = 0; i < children.length; i++) {
          var child = componentManager.getElementByRef(children[i].ref)
          if (child) {
            child.updateRecursiveStyle(data.children[i])
          }
        }
      }
    },
  
    updateRecursiveAll: function (data) {
      this.updateAttrs(data.attr)
      this.updateStyle(data.style)
      var componentManager = this.getComponentManager()
  
      // var oldRef = this.data.ref
      // if (componentMap[oldRef]) {
      //   delete componentMap[oldRef]
      // }
      // this.data.ref = data.ref
      // componentMap[data.ref] = this
  
      var children = this.data.children
      if (children) {
        for (var i = 0; i < children.length; i++) {
          var child = componentManager.getElementByRef(children[i].ref)
          if (child) {
            child.updateRecursiveAll(data.children[i])
          }
        }
      }
    },
  
    attr: {}, // attr setters
  
    style: Object.create(flexbox), // style setters
  
    clearAttr: function () {
    },
  
    clearStyle: function () {
      this.node.cssText = ''
    }
  }
  
  Component.prototype.style.position = function (value) {
    // TODO: make it in a decent implementation
    if (value === 'sticky') {
      this.node.style.zIndex = 100
      setTimeout(function () {
        this.sticky = new lib.sticky(this.node, {
          top: 0
        })
      }.bind(this), 0)
    } else {
      this.node.style.position = value
    }
  }
  
  module.exports = Component


/***/ },
/* 17 */
/***/ function(module, exports) {

  'use strict'
  
  // Flexbox polyfill
  var flexboxSetters = (function () {
    var BOX_ALIGN = {
      stretch: 'stretch',
      'flex-start': 'start',
      'flex-end': 'end',
      center: 'center'
    }
    var BOX_ORIENT = {
      row: 'horizontal',
      column: 'vertical'
    }
    var BOX_PACK = {
      'flex-start': 'start',
      'flex-end': 'end',
      center: 'center',
      'space-between': 'justify',
      'space-around': 'justify' // Just same as `space-between`
    }
    return {
      flex: function (value) {
        this.node.style.webkitBoxFlex = value
        this.node.style.webkitFlex = value
        this.node.style.flex = value
      },
      alignItems: function (value) {
        this.node.style.webkitBoxAlign = BOX_ALIGN[value]
        this.node.style.webkitAlignItems = value
        this.node.style.alignItems = value
      },
      alignSelf: function (value) {
        this.node.style.webkitAlignSelf = value
        this.node.style.alignSelf = value
      },
      flexDirection: function (value) {
        this.node.style.webkitBoxOrient = BOX_ORIENT[value]
        this.node.style.webkitFlexDirection = value
        this.node.style.flexDirection = value
      },
      justifyContent: function (value) {
        this.node.style.webkitBoxPack = BOX_PACK[value]
        this.node.style.webkitJustifyContent = value
        this.node.style.justifyContent = value
      }
    }
  })()
  
  module.exports = flexboxSetters


/***/ },
/* 18 */
/***/ function(module, exports) {

  (typeof window === 'undefined') && (window = {ctrl: {}, lib: {}});!window.ctrl && (window.ctrl = {});!window.lib && (window.lib = {});!function(a,b,c){function d(a){return null!=a&&"object"==typeof a&&Object.getPrototypeOf(a)==Object.prototype}function e(a,b){var c,d,e,f=null,g=0,h=function(){g=Date.now(),f=null,e=a.apply(c,d)};return function(){var i=Date.now(),j=b-(i-g);return c=this,d=arguments,0>=j?(clearTimeout(f),f=null,g=i,e=a.apply(c,d)):f||(f=setTimeout(h,j)),e}}function f(a){var b="";return Object.keys(a).forEach(function(c){b+=c+":"+a[c]+";"}),b}function g(a,c){!c&&d(a)&&(c=a,a=c.element),c=c||{},a.nodeType!=b.ELEMENT_NODE&&"string"==typeof a&&(a=b.querySelector(a));var e=this;e.element=a,e.top=c.top||0,e.withinParent=void 0==c.withinParent?!1:c.withinParent,e.init()}var h=a.parseInt,i=navigator.userAgent,j=!!i.match(/Firefox/i),k=!!i.match(/IEMobile/i),l=j?"-moz-":k?"-ms-":"-webkit-",m=j?"Moz":k?"ms":"webkit",n=function(){var a=b.createElement("div"),c=a.style;return c.cssText="position:"+l+"sticky;position:sticky;",-1!=c.position.indexOf("sticky")}();g.prototype={constructor:g,init:function(){var a=this,b=a.element,c=b.style;c[m+"Transform"]="translateZ(0)",c.transform="translateZ(0)",a._originCssText=c.cssText,n?(c.position=l+"sticky",c.position="sticky",c.top=a.top+"px"):(a._simulateSticky(),a._bindResize())},_bindResize:function(){var b=this,c=/android/gi.test(navigator.appVersion),d=b._resizeEvent="onorientationchange"in a?"orientationchange":"resize",e=b._resizeHandler=function(){setTimeout(function(){b.refresh()},c?200:0)};a.addEventListener(d,e,!1)},refresh:function(){var a=this;n||(a._detach(),a._simulateSticky())},_addPlaceholder:function(a){var c,d=this,e=d.element,g=a.position;if(-1!=["static","relative"].indexOf(g)){c=d._placeholderElement=b.createElement("div");var i=h(a.width)+h(a.marginLeft)+h(a.marginRight),j=h(a.height);"border-box"!=a.boxSizing&&(i+=h(a.borderLeftWidth)+h(a.borderRightWidth)+h(a.paddingLeft)+h(a.paddingRight),j+=h(a.borderTopWidth)+h(a.borderBottomWidth)+h(a.paddingTop)+h(a.paddingBottom)),c.style.cssText=f({display:"none",visibility:"hidden",width:i+"px",height:j+"px",margin:0,"margin-top":a.marginTop,"margin-bottom":a.marginBottom,border:0,padding:0,"float":a["float"]||a.cssFloat}),e.parentNode.insertBefore(c,e)}return c},_simulateSticky:function(){var c=this,d=c.element,g=c.top,i=d.style,j=d.getBoundingClientRect(),k=getComputedStyle(d,""),l=d.parentNode,m=getComputedStyle(l,""),n=c._addPlaceholder(k),o=c.withinParent,p=c._originCssText,q=j.top-g+a.pageYOffset,r=l.getBoundingClientRect().bottom-h(m.paddingBottom)-h(m.borderBottomWidth)-h(k.marginBottom)-j.height-g+a.pageYOffset,s=p+f({position:"fixed",top:g+"px",width:k.width,"margin-top":0}),t=p+f({position:"absolute",top:r+"px",width:k.width}),u=1,v=c._scrollHandler=e(function(){var b=a.pageYOffset;q>b?1!=u&&(i.cssText=p,n&&(n.style.display="none"),u=1):!o&&b>=q||o&&b>=q&&r>b?2!=u&&(i.cssText=s,n&&3!=u&&(n.style.display="block"),u=2):o&&3!=u&&(i.cssText=t,n&&2!=u&&(n.style.display="block"),u=3)},100);if(a.addEventListener("scroll",v,!1),a.pageYOffset>=q){var w=b.createEvent("HTMLEvents");w.initEvent("scroll",!0,!0),a.dispatchEvent(w)}},_detach:function(){var b=this,c=b.element;if(c.style.cssText=b._originCssText,!n){var d=b._placeholderElement;d&&c.parentNode.removeChild(d),a.removeEventListener("scroll",b._scrollHandler,!1)}},destroy:function(){var b=this;b._detach();var c=b.element.style;c.removeProperty(l+"transform"),c.removeProperty("transform"),n||a.removeEventListener(b._resizeEvent,b._resizeHandler,!1)}},c.sticky=g}(window,document,window.lib||(window.lib={}));;module.exports = window.lib['sticky'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var utils = __webpack_require__(7)
  
  var _senderMap = {}
  
  function Sender(instance) {
    if (!(this instanceof Sender)) {
      return new Sender(instance)
    }
    this.instanceId = instance.instanceId
    this.weexInstance = instance
    _senderMap[this.instanceId] = this
  }
  
  function _send(instanceId, msg) {
    callJS(instanceId, [msg])
  }
  
  Sender.getSender = function (instanceId) {
    return _senderMap[instanceId]
  }
  
  Sender.prototype = {
  
    // perform a callback to jsframework.
    performCallback: function (callbackId, data) {
      var args = [callbackId]
      data && args.push(data)
      _send(this.instanceId, {
        method: 'callback',
        args: args
      })
    },
  
    fireEvent: function (ref, type, event) {
      // Note that the event.target must be the standard event's
      // currentTarget. Therefor a process for replacing target must
      // be done when a event is fired.
      var evt = utils.extend({}, event)
      evt.target = evt.currentTarget
      evt.value = event.target.value
      evt.timestamp = Date.now()
      _send(this.instanceId, {
        method: 'fireEvent',
        args: [ref, type, evt]
      })
    }
  
  }
  
  module.exports = Sender

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict'
  
  var config = __webpack_require__(5)
  var protocol = __webpack_require__(8)
  var utils = __webpack_require__(7)
  var FrameUpdater = __webpack_require__(10)
  var Sender = __webpack_require__(19)
  
  var callQueue = []
  // Need a task counter?
  // When FrameUpdater is not activated, tasks will not be push
  // into callQueue and there will be no trace for situation of
  // execution of tasks.
  
  // give 10ms for call handling, and rest 6ms for others
  var MAX_TIME_FOR_EACH_FRAME = 10
  
  // callNative: jsFramework will call this method to talk to
  // this renderer.
  // params:
  //  - instanceId: string.
  //  - tasks: array of object.
  //  - callbackId: number.
  function callNative(instanceId, tasks, callbackId) {
    var calls = []
    if (typeof tasks === 'string') {
      try {
        calls = JSON.parse(tasks)
      } catch (e) {
        console.error('invalid tasks:', tasks)
      }
    } else if (Object.prototype.toString.call(tasks).slice(8, -1) === 'Array') {
      calls = tasks
    }
    var len = calls.length
    calls[len - 1].callbackId = (!callbackId && callbackId !== 0)
                                ? -1
                                : callbackId
    // To solve the problem of callapp, the two-way time loop rule must
    // be replaced by calling directly except the situation of page loading.
    // 2015-11-03
    for (var i = 0; i < len; i++) {
      if (FrameUpdater.isActive()) {
        callQueue.push({
          instanceId: instanceId,
          call: calls[i]
        })
      }
      else {
        processCall(instanceId, calls[i])
      }
    }
  
  }
  
  function processCallQueue() {
    var len = callQueue.length
    if (len === 0) {
      return
    }
    var start = Date.now()
    var elapsed = 0
  
    while (--len >= 0 && elapsed < MAX_TIME_FOR_EACH_FRAME) {
      var callObj = callQueue.shift()
      processCall(callObj.instanceId, callObj.call)
      elapsed = Date.now() - start
    }
  }
  
  function processCall(instanceId, call) {
    var moduleName = call.module
    var methodName = call.method
    var module, method
    var args = call.args || call.arguments || []
  
    if (!(module = protocol.apiModule[moduleName])) {
      return
    }
    if (!(method = module[methodName])) {
      return
    }
  
    method.apply(protocol.getWeexInstance(instanceId), args)
  
    var callbackId = call.callbackId
    if ((callbackId
      || callbackId === 0
      || callbackId === '0')
      && callbackId !== '-1'
      && callbackId !== -1) {
      performNextTick(instanceId, callbackId)
    }
  }
  
  function performNextTick(instanceId, callbackId) {
    Sender.getSender(instanceId).performCallback(callbackId)
  }
  
  function nativeLog() {
    if (config.debug) {
      if (arguments[0].match(/^perf/)) {
        console.info.apply(console, arguments)
        return
      }
      console.debug.apply(console, arguments)
    }
  }
  
  function exportsBridgeMethodsToGlobal() {
    global.callNative = callNative
    global.nativeLog = nativeLog
  }
  
  module.exports = {
  
    init: function () {
  
      // process callQueue every 16 milliseconds.
      FrameUpdater.addUpdateObserver(processCallQueue)
      FrameUpdater.start()
  
      // exports methods to global(window).
      exportsBridgeMethodsToGlobal()
    }
  
  }
  
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

  var RootComponent = __webpack_require__(22)
  var Container = __webpack_require__(23)
  var Image = __webpack_require__(26)
  var Text = __webpack_require__(28)
  var List = __webpack_require__(29)
  var Countdown = __webpack_require__(37)
  var Marquee = __webpack_require__(39)
  var Slider = __webpack_require__(40)
  var Indicator = __webpack_require__(44)
  var Tabheader = __webpack_require__(47)
  var Scroller = __webpack_require__(51)
  var Input = __webpack_require__(54)
  var Select = __webpack_require__(55)
  var Datepicker = __webpack_require__(56)
  var Timepicker = __webpack_require__(57)
  var Video = __webpack_require__(58)
  var Switch = __webpack_require__(61)
  var A = __webpack_require__(64)
  var Embed = __webpack_require__(65)
  
  var components = {
    init: function (Weex) {
      Weex.registerComponent('root', RootComponent)
      Weex.registerComponent('root', RootComponent)
      Weex.registerComponent('container', Container)
      Weex.registerComponent('image', Image)
      Weex.registerComponent('text', Text)
      Weex.registerComponent('list', List)
      Weex.registerComponent('countdown', Countdown)
      Weex.registerComponent('marquee', Marquee)
      Weex.registerComponent('slider', Slider)
      Weex.registerComponent('indicator', Indicator)
      Weex.registerComponent('tabheader', Tabheader)
      Weex.registerComponent('scroller', Scroller)
      Weex.registerComponent('input', Input)
      Weex.registerComponent('select', Select)
      Weex.registerComponent('datepicker', Datepicker)
      Weex.registerComponent('timepicker', Timepicker)
      Weex.registerComponent('video', Video)
      Weex.registerComponent('switch', Switch)
      Weex.registerComponent('a', A)
      Weex.registerComponent('embed', Embed)
    }
  }
  
  module.exports = components

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var ComponentManager = __webpack_require__(9)
  var Component = __webpack_require__(16)
  
  // If nodeType is in this WHITE_LIST, just ignore it and
  // replace it with a div element.
  var WHITE_LIST = []
  
  function RootComponent(data, nodeType) {
    var id = data.rootId + '-root'
    var componentManager = ComponentManager.getInstance(data.instanceId)
  
    // Return a NodeType instance.
    if (nodeType && nodeType !== 'div' && WHITE_LIST.indexOf(nodeType) === -1) {
      data.type = nodeType
      var cmp = componentManager.createElement(data)
      cmp.node.id = id
      return cmp
    }
  
    // Otherwise return a common weex-container component,
    // whose node is a div element.
    var node = document.createElement('div')
    this.data = data
    this.node = node
  
    this.createChildren()
    this.updateAttrs(this.data.attr)
    // issue: when add element to a list in lifetime hook 'ready', the
    // styles is set to the classStyle, not style. This is a issue
    // that jsframework should do something about.
    var classStyle = this.data.classStyle
    classStyle && this.updateStyle(this.data.classStyle)
    this.updateStyle(this.data.style)
    this.bindEvents(this.data.event)
  }
  
  RootComponent.prototype = Object.create(Component.prototype)
  
  module.exports = RootComponent


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  __webpack_require__(24)
  
  var Component = __webpack_require__(16)
  
  function Container (data, nodeType) {
    Component.call(this, data, nodeType)
    this.node.classList.add('weex-container')
  }
  
  Container.prototype = Object.create(Component.prototype)
  
  module.exports = Container


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(25);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./container.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./container.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".weex-container {\n  box-sizing: border-box;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n  position: relative;\n  border: 0 solid black;\n  margin: 0;\n  padding: 0; }\n\n.weex-element {\n  box-sizing: border-box;\n  position: relative; }\n", "", {"version":3,"sources":["/./src/src/styles/container.scss"],"names":[],"mappings":"AAAA;EACE,uBAAsB;EACtB,qBAAoB;EACpB,sBAAqB;EACrB,cAAa;EACb,6BAA4B;EAC5B,+BAA8B;EAC9B,uBAAsB;EACtB,mBAAkB;EAClB,sBAAqB;EACrB,UAAS;EACT,WACD,EAAC;;AAEF;EACE,uBAAuB;EACvB,mBAAmB,EACpB","file":"container.scss","sourcesContent":[".weex-container {\n  box-sizing:border-box;\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:flex;\n  -webkit-box-orient:vertical;\n  -webkit-flex-direction:column;\n  flex-direction:column;\n  position:relative;\n  border:0 solid black;\n  margin:0;\n  padding:0\n}\n\n.weex-element {\n  box-sizing: border-box;\n  position: relative;\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(27)
  var LazyLoad = __webpack_require__(12)
  var config = __webpack_require__(5)
  
  var DEFAULT_SIZE = 200
  var RESIZE_MODES = ['cover', 'contain'] // not temporarily supported
  
  /**
   * resize=cover|contain|stretch v1.4 temporarily not supported
   * src=url
   */
  
  function Image (data) {
    this.width = data.style && data.style.width
                 ? (data.style.width + '').replace(/[^\d]/g, '')
                 : DEFAULT_SIZE
    this.height = data.style && data.style.height
                 ? (data.style.height + '').replace(/[^\d]/g, '')
                 : DEFAULT_SIZE
    this.width *= data.scale
    this.height *= data.scale
    var mode
    var attr = data.attr
    attr && (mode = attr.resize || attr.resizeMode)
    if (RESIZE_MODES.indexOf(mode) !== -1) {
      this.mode = mode
      // TODO: resize-mode is not temporarily supported.
    }
    Atomic.call(this, data)
  }
  
  Image.prototype = Object.create(Atomic.prototype)
  
  Image.prototype.create = function () {
    var node = document.createElement('img')
    node.classList.add('weex-element')
    node.style.display = 'block'
    node.style.outline = 'none'
    return node
  }
  
  Image.prototype.attr = {
    src: function (value) {
      if (!this.node.src) {
        this.node.src = lib.img.defaultSrc
      }
      LazyLoad.makeImageLazy(this.node, value)
    }
  }
  
  Image.prototype.clearAttr = function () {
    this.node.src = ''
  }
  
  module.exports = Image


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Component = __webpack_require__(16)
  
  // Component which can have no subcomponents.
  // This component should not be instantiated directly, since
  // it is designed to be used as a base class to extend from.
  function Atomic (data) {
    Component.call(this, data)
  }
  
  Atomic.prototype = Object.create(Component.prototype)
  
  Atomic.prototype.appendChild = function (data) {
    // do nothing
    return
  }
  
  Atomic.prototype.insertBefore = function (child, before) {
    // do nothing
    return
  }
  
  Atomic.prototype.removeChild = function (child) {
    // do nothing
    return
  }
  
  module.exports = Atomic


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(16)
  var utils = __webpack_require__(7)
  
  var DEFAULT_FONT_SIZE = 32
  
  // attr
  //  - value: text content.
  //  - lines: maximum lines of the text.
  function Text (data) {
    Atomic.call(this, data)
  }
  
  Text.prototype = Object.create(Atomic.prototype)
  
  Text.prototype.create = function () {
    var node = document.createElement('div')
    node.classList.add('weex-container')
    node.style.fontSize = DEFAULT_FONT_SIZE * this.data.scale + 'px'
    this.textNode = document.createElement('span')
    // Give the developers the ability to control space
    // and line-breakers.
    this.textNode.style.whiteSpace = 'pre-wrap'
    this.textNode.style.display = '-webkit-box'
    this.textNode.style.webkitBoxOrient = 'vertical'
    this.style.lines.call(this, this.data.style.lines)
    node.appendChild(this.textNode)
    return node
  }
  
  Text.prototype.attr = {
    value: function (value) {
      var span = this.node.firstChild
      span.innerHTML = ''
      if (!value) {
        return
      }
      span.textContent = value
      /**
       * Developers are supposed to have the ability to break text
       * lines manually. Using ``&nbsp;`` to replace text space is
       * not compatible with the ``-webkit-line-clamp``. Therefor
       * we use ``white-space: no-wrap`` instead (instead of the
       * code bellow).
  
        var frag = document.createDocumentFragment()
          text.split(' ').forEach(function(str) {
            var textNode = document.createTextNode(str)
            var space = document.createElement('i')
            space.innerHTML = '&nbsp;'
            frag.appendChild(space)
            frag.appendChild(textNode)
          })
          frag.removeChild(frag.firstChild)
          span.appendChild(document.createElement('br'))
          span.appendChild(frag)
        })
        span.removeChild(span.firstChild)
       */
    }
  }
  
  Text.prototype.clearAttr = function () {
    this.node.firstChild.textContent = ''
  }
  
  Text.prototype.style = utils.extend(Object.create(Atomic.prototype.style), {
  
    lines: function (val) {
      val = parseInt(val)
      if (val !== val) { // NaN
        return
      }
      if (val <= 0) {
        this.textNode.style.textOverflow = ''
        this.textNode.style.overflow = 'visible'
        this.textNode.style.webkitLineClamp = ''
      } else {
        this.textNode.style.overflow = 'hidden'
        this.textNode.style.textOverflow = 'ellipsis'
        this.textNode.style.webkitLineClamp = lines
      }
    }
  
  })
  
  module.exports = Text


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  __webpack_require__(30)
  __webpack_require__(32)
  
  var Component = __webpack_require__(16)
  var LazyLoad = __webpack_require__(12)
  
  var DEFAULT_LOAD_MORE_OFFSET = 500
  
  function List(data, nodeType) {
    // this.loadmoreOffset = Number(data.attr.loadmoreoffset)
    // this.isAvailableToFireloadmore = true
    Component.call(this, data, nodeType)
  }
  
  List.prototype = Object.create(Component.prototype)
  
  List.prototype.create = function (nodeType) {
    var Scroll = lib.scroll
    var node = Component.prototype.create.call(this, nodeType)
    node.classList.add('weex-container', 'list-wrap')
    this.listElement = document.createElement('div')
    this.listElement.classList.add(
      'weex-container'
      , 'list-element'
    )
    node.appendChild(this.listElement)
    this.scroller = new Scroll({
      scrollElement: this.listElement
      , direction: 'y'
    })
    this.scroller.init()
    return node
  }
  
  List.prototype.bindEvents = function (evts) {
    Component.prototype.bindEvents.call(this, evts)
    // to enable lazyload for Images.
    this.scroller.addEventListener('scrolling', function (e) {
      var so = e.scrollObj
      this.dispatchEvent('scroll', {
        originalType: 'scrolling',
        scrollTop: so.getScrollTop(),
        scrollLeft: so.getScrollLeft()
      }, {
        bubbles: true
      })
    }.bind(this))
  
    this.scroller.addEventListener('pullupend', function (e) {
      this.dispatchEvent('loadmore')
    }.bind(this))
  }
  
  List.prototype.appendChild = function (data) {
    var children = this.data.children
    var componentManager = this.getComponentManager()
    var child = componentManager.createElement(data)
    this.listElement.appendChild(child.node)
  
    // update this.data.children
    if (!children || !children.length) {
      this.data.children = [data]
    } else {
      children.push(data)
    }
  
    return child
  }
  
  List.prototype.insertBefore = function (child, before) {
    var children = this.data.children
    var i = 0
    var isAppend = false
  
    // update this.data.children
    if (!children || !children.length || !before) {
      isAppend = true
    } else {
      for (var l = children.length; i < l; i++) {
        if (children[i].ref === child.data.ref) {
          break
        }
      }
      if (i === l) {
        isAppend = true
      }
    }
  
    if (isAppend) {
      this.listElement.appendChild(child.node)
      children.push(child.data)
    } else {
      this.listElement.insertBefore(child.node, before.node)
      children.splice(i, 0, child.data)
    }
  }
  
  List.prototype.removeChild = function (child) {
    var children = this.data.children
    // remove from this.data.children
    var i = 0
    var componentManager = this.getComponentManager()
    if (children && children.length) {
      for (var l = children.length; i < l; i++) {
        if (children[i].ref === child.data.ref) {
          break
        }
      }
      if (i < l) {
        children.splice(i, 1)
      }
    }
    // remove from componentMap recursively
    componentManager.removeElementByRef(child.data.ref)
    this.listElement.removeChild(child.node)
  }
  
  module.exports = List


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(31);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./list.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./list.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".list-wrap {\n  display: block;\n  overflow: hidden; }\n\n.list-element {\n  -webkit-box-orient: vertical;\n  -webkit-flex-direction: column;\n  flex-direction: column; }\n", "", {"version":3,"sources":["/./src/src/styles/list.scss"],"names":[],"mappings":"AAAA;EACC,eAAe;EACf,iBAAiB,EACjB;;AAED;EACE,6BAA6B;EAC7B,+BAA+B;EAC/B,uBAAuB,EACxB","file":"list.scss","sourcesContent":[".list-wrap {\n\tdisplay: block;\n\toverflow: hidden;\n}\n\n.list-element {\n  -webkit-box-orient: vertical;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

  (typeof window === 'undefined') && (window = {ctrl: {}, lib: {}});!window.ctrl && (window.ctrl = {});!window.lib && (window.lib = {});__webpack_require__(33);__webpack_require__(34);__webpack_require__(35);__webpack_require__(36);!function(a,b,c){function d(){b.scroll.outputDebugLog&&console.debug.apply(console,arguments)}function e(a){var b=a.getBoundingClientRect();if(!b){b={},b.width=a.offsetWidth,b.height=a.offsetHeight,b.left=a.offsetLeft,b.top=a.offsetTop;for(var c=a.offsetParent;c;)b.left+=c.offsetLeft,b.top+=c.offsetTop,c=c.offsetParent;b.right=b.left+b.width,b.bottom=b.top+b.height}return b}function f(a){return 0-a.options[a.axis+"PaddingTop"]}function g(a){var b=e(a.element),c=e(a.viewport),d=f(a);if("y"===a.axis)var g=0-b.height+c.height;else var g=0-b.width+c.width;return Math.min(g+a.options[a.axis+"PaddingBottom"],d)}function h(a,b){return b>a.minScrollOffset?b-a.minScrollOffset:b<a.maxScrollOffset?b-a.maxScrollOffset:void 0}function i(a,b){return b>a.minScrollOffset?b=a.minScrollOffset:b<a.maxScrollOffset&&(b=a.maxScrollOffset),b}function j(a,b,c){d(a.element.scrollId,b,c);var e=p.createEvent("HTMLEvents");if(e.initEvent(b,!1,!0),e.scrollObj=a,c)for(var f in c)e[f]=c[f];a.element.dispatchEvent(e),a.viewport.dispatchEvent(e)}function k(a){var b,c={x:0,y:0},d=getComputedStyle(a.element)[y+"Transform"];return"none"!==d&&(b=d.match(/^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/)||d.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/))&&(c.x=parseFloat(b[1])||0,c.y=parseFloat(b[2])||0),c}function l(a,b){return a=parseFloat(a),b=parseFloat(b),0!=a&&(a+="px"),0!=b&&(b+="px"),A?"translate3d("+a+", "+b+", 0)":"translate("+a+", "+b+")"}function m(a,b,c){""===b&&""===c?a.element.style[y+"Transition"]="":a.element.style[y+"Transition"]=x+"transform "+b+" "+c+" 0s"}function n(a,b){var c=0,d=0;"object"==typeof b?(c=b.x,d=b.y):"y"===a.axis?d=b:c=b,a.element.style[y+"Transform"]=l(c,d)}function o(a,c){function l(a){return F||L?(a.preventDefault(),a.stopPropagation(),!1):!0}function o(a){F||L||setTimeout(function(){var b=document.createEvent("HTMLEvents");b.initEvent("niceclick",!0,!0),a.target.dispatchEvent(b)},300)}function p(a,c){I=null,clearTimeout(J),J=setTimeout(function(){I&&(I=null,b.animation.requestFrame(a))},c||400),I=a}function q(a){if(!E.enabled)return!1;if("undefined"!=typeof a.isVertical){if(!("y"===E.axis&&a.isVertical||"x"===E.axis&&!a.isVertical))return!1;a.stopPropagation()}return!0}function t(a){if(q(a))if(L&&D(),c.useFrameAnimation)H&&H.stop(),H=null;else{var b=k(E);n(E,b),m(E,"",""),I=null,clearTimeout(J)}}function w(a){if(q(a)){var d=k(E)[E.axis],e=h(E,d);if(e){var f=i(E,d);if(c.useFrameAnimation){var g=f-d;H=new b.animation(400,b.cubicbezier.ease,0,function(a,b){var c=(d+g*b).toFixed(2);n(E,c),j(E,"scrolling")}),H.onend(D),H.play()}else{var l=f.toFixed(0);m(E,"0.4s","ease"),n(E,l),p(D,400),b.animation.requestFrame(function(){L&&E.enabled&&(j(E,"scrolling"),b.animation.requestFrame(arguments.callee))})}e>0?j(E,"y"===E.axis?"pulldownend":"pullrightend"):0>e&&j(E,"y"===E.axis?"pullupend":"pullleftend")}else L&&D()}}function x(a){q(a)&&(E.transformOffset=k(E),E.minScrollOffset=f(E),E.maxScrollOffset=g(E),K=2.5,N=!0,L=!0,M=!1,j(E,"scrollstart"),O=a["displacement"+E.axis.toUpperCase()])}function z(a){if(q(a)){var b=a["displacement"+E.axis.toUpperCase()];if(Math.abs(b-O)<5)return void a.stopPropagation();O=b;var c=E.transformOffset[E.axis]+b;c>E.minScrollOffset?(c=E.minScrollOffset+(c-E.minScrollOffset)/K,K*=1.003):c<E.maxScrollOffset&&(c=E.maxScrollOffset-(E.maxScrollOffset-c)/K,K*=1.003),K>4&&(K=4);var d=h(E,c);d&&(j(E,d>0?"y"===E.axis?"pulldown":"pullright":"y"===E.axis?"pullup":"pullleft",{boundaryOffset:Math.abs(d)}),E.options.noBounce&&(c=i(E,c))),n(E,c.toFixed(2)),j(E,"scrolling")}}function A(a){q(a)&&a.isflick&&C(a)}function C(a){N=!0;var e,f,g,i,l,o,q,r,s,t,v,w,x,y,z,A,B;i=k(E)[E.axis];var C=h(E,i);if(!C){e=a["velocity"+E.axis.toUpperCase()];var F=2,G=.0015;c.inertia&&u[c.inertia]&&(F=u[c.inertia][0],G=u[c.inertia][1]),e>F&&(e=F),-F>e&&(e=-F),f=G*(e/Math.abs(e)),o=new b.motion({v:e,a:-f}),g=o.t,l=i+o.s;var I=h(E,l);if(I){d("惯性计算超出了边缘",I),q=e,r=f,I>0?(t=E.minScrollOffset,w=1):(t=E.maxScrollOffset,w=-1),v=new b.motion({v:w*q,a:-w*r,s:Math.abs(t-i)}),s=v.t;var J=v.generateCubicBezier();x=q-r*s,y=.03*(x/Math.abs(x)),B=new b.motion({v:x,a:-y}),z=B.t,A=t+B.s;B.generateCubicBezier();if(c.noBounce)if(d("没有回弹效果"),i!==t)if(c.useFrameAnimation){var K=t-i,O=b.cubicbezier(J[0][0],J[0][1],J[1][0],J[1][1]);H=new b.animation(s.toFixed(0),O,0,function(a,b){var c=i+K*b;k(E,c.toFixed(2)),j(E,"scrolling",{afterFlick:!0})}),H.onend(D),H.play()}else{var P=t.toFixed(0);m(E,(s/1e3).toFixed(2)+"s","cubic-bezier("+J+")"),n(E,P),p(D,1e3*(s/1e3).toFixed(2))}else D();else if(i!==A)if(d("惯性滚动","s="+A.toFixed(0),"t="+((s+z)/1e3).toFixed(2)),c.useFrameAnimation){var K=A-i,O=b.cubicbezier.easeOut;H=new b.animation((s+z).toFixed(0),O,0,function(a,b){var c=i+K*b;n(E,c.toFixed(2)),j(E,"scrolling",{afterFlick:!0})}),H.onend(function(){if(E.enabled){var a=t-A,c=b.cubicbezier.ease;H=new b.animation(400,c,0,function(b,c){var d=A+a*c;n(E,d.toFixed(2)),j(E,"scrolling",{afterFlick:!0})}),H.onend(D),H.play()}}),H.play()}else{var P=A.toFixed(0);m(E,((s+z)/1e3).toFixed(2)+"s","ease-out"),n(E,P),p(function(a){if(E.enabled)if(d("惯性回弹","s="+t.toFixed(0),"t=400"),A!==t){var b=t.toFixed(0);m(E,"0.4s","ease"),n(E,b),p(D,400)}else D()},1e3*((s+z)/1e3).toFixed(2))}else D()}else{d("惯性计算没有超出边缘");var Q=o.generateCubicBezier();if(c.useFrameAnimation){var K=l-i,O=b.cubicbezier(Q[0][0],Q[0][1],Q[1][0],Q[1][1]);H=new b.animation(g.toFixed(0),O,0,function(a,b){var c=(i+K*b).toFixed(2);n(E,c),j(E,"scrolling",{afterFlick:!0})}),H.onend(D),H.play()}else{var P=l.toFixed(0);m(E,(g/1e3).toFixed(2)+"s","cubic-bezier("+Q+")"),n(E,P),p(D,1e3*(g/1e3).toFixed(2))}}M=!0,c.useFrameAnimation||b.animation.requestFrame(function(){L&&M&&E.enabled&&(j(E,"scrolling",{afterFlick:!0}),b.animation.requestFrame(arguments.callee))})}}function D(){E.enabled&&(N=!1,setTimeout(function(){!N&&L&&(L=!1,M=!1,c.useFrameAnimation?(H&&H.stop(),H=null):m(E,"",""),j(E,"scrollend"))},50))}var E=this;if(c=c||{},c.noBounce=!!c.noBounce,c.padding=c.padding||{},null==c.isPrevent?c.isPrevent=!0:c.isPrevent=!!c.isPrevent,null==c.isFixScrollendClick?c.isFixScrollendClick=!0:c.isFixScrollendClick=!!c.isFixScrollendClick,c.padding?(c.yPaddingTop=-c.padding.top||0,c.yPaddingBottom=-c.padding.bottom||0,c.xPaddingTop=-c.padding.left||0,c.xPaddingBottom=-c.padding.right||0):(c.yPaddingTop=0,c.yPaddingBottom=0,c.xPaddingTop=0,c.xPaddingBottom=0),c.direction=c.direction||"y",c.inertia=c.inertia||"normal",this.options=c,E.axis=c.direction,this.element=a,this.viewport=a.parentNode,this.plugins={},this.element.scrollId=setTimeout(function(){r[E.element.scrollId+""]=E},1),this.viewport.addEventListener("touchstart",t,!1),this.viewport.addEventListener("touchend",w,!1),this.viewport.addEventListener("touchcancel",w,!1),this.viewport.addEventListener("panstart",x,!1),this.viewport.addEventListener("panmove",z,!1),this.viewport.addEventListener("panend",A,!1),c.isPrevent&&(this.viewport.addEventListener("touchstart",function(a){B=!0},!1),E.viewport.addEventListener("touchend",function(a){B=!1},!1)),c.isFixScrollendClick){var F,G;this.viewport.addEventListener("scrolling",function(){F=!0,G&&clearTimeout(G),G=setTimeout(function(a){F=!1},400)},!1),this.viewport.addEventListener("click",l,!1),this.viewport.addEventListener("tap",o,!1)}if(c.useFrameAnimation){var H;Object.defineProperty(this,"animation",{get:function(){return H}})}else{var I,J=0;a.addEventListener(v?"transitionend":y+"TransitionEnd",function(a){if(I){var c=I;I=null,clearTimeout(J),b.animation.requestFrame(function(){c(a)})}},!1)}var K,L,M,N;Object.defineProperty(this,"isScrolling",{get:function(){return!!L}});var O,P={init:function(){return this.enable(),this.refresh(),this.scrollTo(0),this},enable:function(){return this.enabled=!0,this},disable:function(){var a=this.element;return this.enabled=!1,this.options.useFrameAnimation?H&&H.stop():b.animation.requestFrame(function(){a.style[y+"Transform"]=getComputedStyle(a)[y+"Transform"]}),this},getScrollWidth:function(){return e(this.element).width},getScrollHeight:function(){return e(this.element).height},getScrollLeft:function(){return-k(this).x-this.options.xPaddingTop},getScrollTop:function(){return-k(this).y-this.options.yPaddingTop},getMaxScrollLeft:function(){return-E.maxScrollOffset-this.options.xPaddingTop},getMaxScrollTop:function(){return-E.maxScrollOffset-this.options.yPaddingTop},getBoundaryOffset:function(){return Math.abs(h(this,k(this)[this.axis])||0)},refresh:function(){var a=this.element,b="y"===this.axis,c=b?"height":"width";if(null!=this.options[c])a.style[c]=this.options[c]+"px";else if(this.options.useElementRect)a.style[c]="auto",a.style[c]=e(a)[c]+"px";else if(a.childElementCount>0){var d,h,i=a.firstElementChild,l=a.lastElementChild;if(document.createRange&&!this.options.ignoreOverflow&&(d=document.createRange(),d.selectNodeContents(a),h=e(d)),h)a.style[c]=h[c]+"px";else{for(;i&&0===e(i)[c]&&i.nextElementSibling;)i=i.nextElementSibling;for(;l&&l!==i&&0===e(l)[c]&&l.previousElementSibling;)l=l.previousElementSibling;a.style[c]=e(l)[b?"bottom":"right"]-e(i)[b?"top":"left"]+"px"}}return this.transformOffset=k(this),this.minScrollOffset=f(this),this.maxScrollOffset=g(this),this.scrollTo(-this.transformOffset[this.axis]-this.options[this.axis+"PaddingTop"]),j(this,"contentrefresh"),this},offset:function(a){var b=e(this.element),c=e(a);if("y"===this.axis){var d={top:c.top-b.top-this.options.yPaddingTop,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};d.bottom=d.top+d.height}else{var d={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left-this.options.xPaddingTop,width:c.width,height:c.height};d.right=d.left+d.width}return d},getRect:function(a){var b=e(this.viewport),c=e(a);if("y"===this.axis){var d={top:c.top-b.top,left:c.left-b.left,right:b.right-c.right,width:c.width,height:c.height};d.bottom=d.top+d.height}else{var d={top:c.top-b.top,bottom:b.bottom-c.bottom,left:c.left-b.left,width:c.width,height:c.height};d.right=d.left+d.width}return d},isInView:function(a){var b=this.getRect(this.viewport),c=this.getRect(a);return"y"===this.axis?b.top<c.bottom&&b.bottom>c.top:b.left<c.right&&b.right>c.left},scrollTo:function(a,c){var d=this;this.element;if(a=-a-this.options[this.axis+"PaddingTop"],a=i(this,a),L=!0,c===!0)if(this.options.useFrameAnimation){var e=k(d)[this.axis],f=a-e;H=new b.animation(400,b.cubicbezier.ease,0,function(a,b){var c=(e+f*b).toFixed(2);n(d,c),j(d,"scrolling")}),H.onend(D),H.play()}else m(d,"0.4s","ease"),n(d,a),p(D,400),b.animation.requestFrame(function(){L&&d.enabled&&(j(d,"scrolling"),b.animation.requestFrame(arguments.callee))});else this.options.useFrameAnimation||m(d,"",""),n(d,a),D();return this},scrollToElement:function(a,b){var c=this.offset(a);return c=c["y"===this.axis?"top":"left"],this.scrollTo(c,b)},getViewWidth:function(){return e(this.viewport).width},getViewHeight:function(){return e(this.viewport).height},addPulldownHandler:function(a){var b=this;return this.element.addEventListener("pulldownend",function(c){b.disable(),a.call(b,c,function(){b.scrollTo(0,!0),b.refresh(),b.enable()})},!1),this},addPullupHandler:function(a){var b=this;return this.element.addEventListener("pullupend",function(c){b.disable(),a.call(b,c,function(){b.scrollTo(b.getScrollHeight(),!0),b.refresh(),b.enable()})},!1),this},addScrollstartHandler:function(a){var b=this;return this.element.addEventListener("scrollstart",function(c){a.call(b,c)},!1),this},addScrollingHandler:function(a){var b=this;return this.element.addEventListener("scrolling",function(c){a.call(b,c)},!1),this},addScrollendHandler:function(a){var b=this;return this.element.addEventListener("scrollend",function(c){a.call(b,c)},!1),this},addContentrenfreshHandler:function(a){var b=this;this.element.addEventListener("contentrefresh",function(c){a.call(b,c)},!1)},addEventListener:function(a,b,c){var d=this;this.element.addEventListener(a,function(a){b.call(d,a)},!!c)},removeEventListener:function(a,b){var c=this;this.element.removeEventListener(a,function(a){b.call(c,a)})},enablePlugin:function(a,b){var c=s[a];return c&&!this.plugins[a]&&(this.plugins[a]=!0,b=b||{},c.call(this,a,b)),this}};for(var Q in P)this[Q]=P[Q];delete P}var p=a.document,q=a.navigator.userAgent,r={},s={},t=a.dpr||(a.navigator.userAgent.match(/iPhone|iPad|iPod/)?document.documentElement.clientWidth/a.screen.availWidth:1),u={normal:[2*t,.0015*t],slow:[1.5*t,.003*t],veryslow:[1.5*t,.005*t]},v=!!q.match(/Firefox/i),w=!!q.match(/IEMobile/i),x=v?"-moz-":w?"-ms-":"-webkit-",y=v?"Moz":w?"ms":"webkit",z=w?"MSCSSMatrix":"WebKitCSSMatrix",A=!!v||z in a&&"m11"in new a[z],B=!1;p.addEventListener("touchmove",function(a){return B?(a.preventDefault(),!1):!0},!1),b.scroll=function(a,c){if(1===arguments.length&&!(arguments[0]instanceof HTMLElement))if(c=arguments[0],c.scrollElement)a=c.scrollElement;else{if(!c.scrollWrap)throw new Error("no scroll element");a=c.scrollWrap.firstElementChild}if(!a.parentNode)throw new Error("wrong dom tree");if(c&&c.direction&&["x","y"].indexOf(c.direction)<0)throw new Error("wrong direction");var d;return d=c.downgrade===!0&&b.scroll.downgrade?b.scroll.downgrade(a,c):a.scrollId?r[a.scrollId]:new o(a,c)},b.scroll.plugin=function(a,b){return b?(a=a.split(","),void a.forEach(function(a){s[a]=b})):s[a]}}(window,window.lib||(window.lib={}));;module.exports = window.lib['scroll'];

/***/ },
/* 33 */
/***/ function(module, exports) {

  (typeof window === 'undefined') && (window = {ctrl: {}, lib: {}});!window.ctrl && (window.ctrl = {});!window.lib && (window.lib = {});!function(a,b){function c(a){return setTimeout(a,l)}function d(a){clearTimeout(a)}function e(){var a={},b=new m(function(b,c){a.resolve=b,a.reject=c});return a.promise=b,a}function f(a,b){return["then","catch"].forEach(function(c){b[c]=function(){return a[c].apply(a,arguments)}}),b}function g(b){var c,d,h=!1;this.request=function(){h=!1;var g=arguments;return c=e(),f(c.promise,this),d=n(function(){h||c&&c.resolve(b.apply(a,g))}),this},this.cancel=function(){return d&&(h=!0,o(d),c&&c.reject("CANCEL")),this},this.clone=function(){return new g(b)}}function h(a,b){"function"==typeof b&&(b={0:b});for(var c=a/l,d=1/c,e=[],f=Object.keys(b).map(function(a){return parseInt(a)}),h=0;c>h;h++){var i=f[0],j=d*h;if(null!=i&&100*j>=i){var k=b[""+i];k instanceof g||(k=new g(k)),e.push(k),f.shift()}else e.length&&e.push(e[e.length-1].clone())}return e}function i(a){var c;return"string"==typeof a||a instanceof Array?b.cubicbezier?"string"==typeof a?b.cubicbezier[a]&&(c=b.cubicbezier[a]):a instanceof Array&&4===a.length&&(c=b.cubicbezier.apply(b.cubicbezier,a)):console.error("require lib.cubicbezier"):"function"==typeof a&&(c=a),c}function j(a,b,c){var d,g=h(a,c),j=1/(a/l),k=0,m=i(b);if(!m)throw new Error("unexcept timing function");var n=!1;this.play=function(){function a(){var c=j*(k+1).toFixed(10),e=g[k];e.request(c.toFixed(10),b(c).toFixed(10)).then(function(){n&&(k===g.length-1?(n=!1,d&&d.resolve("FINISH"),d=null):(k++,a()))},function(){})}if(!n)return n=!0,d||(d=e(),f(d.promise,this)),a(),this},this.stop=function(){return n?(n=!1,g[k]&&g[k].cancel(),this):void 0}}var k=60,l=1e3/k,m=a.Promise||b.promise&&b.promise.ES6Promise,n=window.requestAnimationFrame||window.msRequestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||c,o=window.cancelAnimationFrame||window.msCancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||d;(n===c||o===d)&&(n=c,o=d),b.animation=function(a,b,c){return new j(a,b,c)},b.animation.frame=function(a){return new g(a)},b.animation.requestFrame=function(a){var b=new g(a);return b.request()}}(window,window.lib||(window.lib={}));;module.exports = window.lib['animation'];

/***/ },
/* 34 */
/***/ function(module, exports) {

  (typeof window === 'undefined') && (window = {ctrl: {}, lib: {}});!window.ctrl && (window.ctrl = {});!window.lib && (window.lib = {});!function(a,b){function c(a,b,c,d){function e(a){return(3*k*a+2*l)*a+m}function f(a){return((k*a+l)*a+m)*a}function g(a){return((n*a+o)*a+p)*a}function h(a){for(var b,c,d=a,g=0;8>g;g++){if(c=f(d)-a,Math.abs(c)<j)return d;if(b=e(d),Math.abs(b)<j)break;d-=c/b}var h=1,i=0;for(d=a;h>i;){if(c=f(d)-a,Math.abs(c)<j)return d;c>0?h=d:i=d,d=(h+i)/2}return d}function i(a){return g(h(a))}var j=1e-6,k=3*a-3*c+1,l=3*c-6*a,m=3*a,n=3*b-3*d+1,o=3*d-6*b,p=3*b;return i}b.cubicbezier=c,b.cubicbezier.linear=c(0,0,1,1),b.cubicbezier.ease=c(.25,.1,.25,1),b.cubicbezier.easeIn=c(.42,0,1,1),b.cubicbezier.easeOut=c(0,0,.58,1),b.cubicbezier.easeInOut=c(.42,0,.58,1)}(window,window.lib||(window.lib={}));;module.exports = window.lib['cubicbezier'];

/***/ },
/* 35 */
/***/ function(module, exports) {

  (typeof window === 'undefined') && (window = {ctrl: {}, lib: {}});!window.ctrl && (window.ctrl = {});!window.lib && (window.lib = {});!function(a){"use strict";function b(a,b){for(var c=a;c;){if(c.contains(b)||c==b)return c;c=c.parentNode}return null}function c(a,b,c){var d=i.createEvent("HTMLEvents");if(d.initEvent(b,!0,!0),"object"==typeof c)for(var e in c)d[e]=c[e];a.dispatchEvent(d)}function d(a,b,c,d,e,f,g,h){var i=Math.atan2(h-f,g-e)-Math.atan2(d-b,c-a),j=Math.sqrt((Math.pow(h-f,2)+Math.pow(g-e,2))/(Math.pow(d-b,2)+Math.pow(c-a,2))),k=[e-j*a*Math.cos(i)+j*b*Math.sin(i),f-j*b*Math.cos(i)-j*a*Math.sin(i)];return{rotate:i,scale:j,translate:k,matrix:[[j*Math.cos(i),-j*Math.sin(i),k[0]],[j*Math.sin(i),j*Math.cos(i),k[1]],[0,0,1]]}}function e(a){0===Object.keys(l).length&&(j.addEventListener("touchmove",f,!1),j.addEventListener("touchend",g,!1),j.addEventListener("touchcancel",h,!1));for(var d=0;d<a.changedTouches.length;d++){var e=a.changedTouches[d],i={};for(var m in e)i[m]=e[m];var n={startTouch:i,startTime:Date.now(),status:"tapping",element:a.srcElement||a.target,pressingHandler:setTimeout(function(b,d){return function(){"tapping"===n.status&&(n.status="pressing",c(b,"longpress",{touch:d,touches:a.touches,changedTouches:a.changedTouches,touchEvent:a})),clearTimeout(n.pressingHandler),n.pressingHandler=null}}(a.srcElement||a.target,a.changedTouches[d]),500)};l[e.identifier]=n}if(2==Object.keys(l).length){var o=[];for(var m in l)o.push(l[m].element);c(b(o[0],o[1]),"dualtouchstart",{touches:k.call(a.touches),touchEvent:a})}}function f(a){for(var e=0;e<a.changedTouches.length;e++){var f=a.changedTouches[e],g=l[f.identifier];if(!g)return;g.lastTouch||(g.lastTouch=g.startTouch),g.lastTime||(g.lastTime=g.startTime),g.velocityX||(g.velocityX=0),g.velocityY||(g.velocityY=0),g.duration||(g.duration=0);var h=Date.now()-g.lastTime,i=(f.clientX-g.lastTouch.clientX)/h,j=(f.clientY-g.lastTouch.clientY)/h,k=70;h>k&&(h=k),g.duration+h>k&&(g.duration=k-h),g.velocityX=(g.velocityX*g.duration+i*h)/(g.duration+h),g.velocityY=(g.velocityY*g.duration+j*h)/(g.duration+h),g.duration+=h,g.lastTouch={};for(var m in f)g.lastTouch[m]=f[m];g.lastTime=Date.now();var n=f.clientX-g.startTouch.clientX,o=f.clientY-g.startTouch.clientY,p=Math.sqrt(Math.pow(n,2)+Math.pow(o,2));("tapping"===g.status||"pressing"===g.status)&&p>10&&(g.status="panning",g.isVertical=!(Math.abs(n)>Math.abs(o)),c(g.element,"panstart",{touch:f,touches:a.touches,changedTouches:a.changedTouches,touchEvent:a,isVertical:g.isVertical}),c(g.element,(g.isVertical?"vertical":"horizontal")+"panstart",{touch:f,touchEvent:a})),"panning"===g.status&&(g.panTime=Date.now(),c(g.element,"panmove",{displacementX:n,displacementY:o,touch:f,touches:a.touches,changedTouches:a.changedTouches,touchEvent:a,isVertical:g.isVertical}),g.isVertical?c(g.element,"verticalpanmove",{displacementY:o,touch:f,touchEvent:a}):c(g.element,"horizontalpanmove",{displacementX:n,touch:f,touchEvent:a}))}if(2==Object.keys(l).length){for(var q,r=[],s=[],t=[],e=0;e<a.touches.length;e++){var f=a.touches[e],g=l[f.identifier];r.push([g.startTouch.clientX,g.startTouch.clientY]),s.push([f.clientX,f.clientY])}for(var m in l)t.push(l[m].element);q=d(r[0][0],r[0][1],r[1][0],r[1][1],s[0][0],s[0][1],s[1][0],s[1][1]),c(b(t[0],t[1]),"dualtouch",{transform:q,touches:a.touches,touchEvent:a})}}function g(a){if(2==Object.keys(l).length){var d=[];for(var e in l)d.push(l[e].element);c(b(d[0],d[1]),"dualtouchend",{touches:k.call(a.touches),touchEvent:a})}for(var i=0;i<a.changedTouches.length;i++){var n=a.changedTouches[i],o=n.identifier,p=l[o];if(p){if(p.pressingHandler&&(clearTimeout(p.pressingHandler),p.pressingHandler=null),"tapping"===p.status&&(p.timestamp=Date.now(),c(p.element,"tap",{touch:n,touchEvent:a}),m&&p.timestamp-m.timestamp<300&&c(p.element,"doubletap",{touch:n,touchEvent:a}),m=p),"panning"===p.status){var q=Date.now(),r=q-p.startTime,s=((n.clientX-p.startTouch.clientX)/r,(n.clientY-p.startTouch.clientY)/r,n.clientX-p.startTouch.clientX),t=n.clientY-p.startTouch.clientY,u=Math.sqrt(p.velocityY*p.velocityY+p.velocityX*p.velocityX),v=u>.5&&q-p.lastTime<100,w={duration:r,isflick:v,velocityX:p.velocityX,velocityY:p.velocityY,displacementX:s,displacementY:t,touch:n,touches:a.touches,changedTouches:a.changedTouches,touchEvent:a,isVertical:p.isVertical};c(p.element,"panend",w),v&&(c(p.element,"swipe",w),p.isVertical?c(p.element,"verticalswipe",w):c(p.element,"horizontalswipe",w))}"pressing"===p.status&&c(p.element,"pressend",{touch:n,touchEvent:a}),delete l[o]}}0===Object.keys(l).length&&(j.removeEventListener("touchmove",f,!1),j.removeEventListener("touchend",g,!1),j.removeEventListener("touchcancel",h,!1))}function h(a){if(2==Object.keys(l).length){var d=[];for(var e in l)d.push(l[e].element);c(b(d[0],d[1]),"dualtouchend",{touches:k.call(a.touches),touchEvent:a})}for(var i=0;i<a.changedTouches.length;i++){var m=a.changedTouches[i],n=m.identifier,o=l[n];o&&(o.pressingHandler&&(clearTimeout(o.pressingHandler),o.pressingHandler=null),"panning"===o.status&&c(o.element,"panend",{touch:m,touches:a.touches,changedTouches:a.changedTouches,touchEvent:a}),"pressing"===o.status&&c(o.element,"pressend",{touch:m,touchEvent:a}),delete l[n])}0===Object.keys(l).length&&(j.removeEventListener("touchmove",f,!1),j.removeEventListener("touchend",g,!1),j.removeEventListener("touchcancel",h,!1))}var i=a.document,j=i.documentElement,k=Array.prototype.slice,l={},m=null;j.addEventListener("touchstart",e,!1)}(window);;module.exports = window.lib['gesturejs'];

/***/ },
/* 36 */
/***/ function(module, exports) {

  (typeof window === 'undefined') && (window = {ctrl: {}, lib: {}});!window.ctrl && (window.ctrl = {});!window.lib && (window.lib = {});!function(a,b){function c(a,b){return[[(a/3+(a+b)/3-a)/(b-a),(a*a/3+a*b*2/3-a*a)/(b*b-a*a)],[(b/3+(a+b)/3-a)/(b-a),(b*b/3+a*b*2/3-a*a)/(b*b-a*a)]]}function d(a){if(this.v=a.v||0,this.a=a.a||0,"undefined"!=typeof a.t&&(this.t=a.t),"undefined"!=typeof a.s&&(this.s=a.s),"undefined"==typeof this.t)if("undefined"==typeof this.s)this.t=-this.v/this.a;else{var b=(Math.sqrt(this.v*this.v+2*this.a*this.s)-this.v)/this.a,c=(-Math.sqrt(this.v*this.v+2*this.a*this.s)-this.v)/this.a;this.t=Math.min(b,c)}"undefined"==typeof this.s&&(this.s=this.a*this.t*this.t/2+this.v*this.t)}d.prototype.generateCubicBezier=function(){return c(this.v/this.a,this.t+this.v/this.a)},b.motion=d}(window,window.lib||(window.lib={}));;module.exports = window.lib['motion'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(27)
  __webpack_require__(38)
  
  var FORMATTER_REGEXP = /(\\)?(dd*|hh?|mm?|ss?)/gi
  
  function formatDateTime(data, formatter, timeColor) {
    return formatter.replace(FORMATTER_REGEXP, function (m) {
      var len = m.length
      var firstChar = m.charAt(0)
      // escape character
      if (firstChar === '\\') {
        return m.replace('\\', '')
      }
      var value = (firstChar === 'd' ? data.days :
                  firstChar === 'h' ? data.hours :
                  firstChar === 'm' ? data.minutes :
                  firstChar === 's' ? data.seconds : 0) + ''
  
      // 5 zero should be enough
      return '<span style="margin:4px;color:'
        + timeColor + '" >'
        + ('00000' + value).substr(-Math.max(value.length, len))
        + '</span>'
    })
  }
  
  function Countdown (data) {
    Atomic.call(this, data)
  }
  
  Countdown.prototype = Object.create(Atomic.prototype)
  
  Countdown.prototype.create = function () {
    var node = document.createElement('div')
    node.classList.add('weex-element')
    var data = this.data
    var time = Number(data.attr.countdownTime) || 0
    var endTime = Date.now() / 1000 + time
    var cd = lib.countdown({
      endDate: endTime,
      onUpdate: function (time) {
        var timeColor = data.style.timeColor || '#000'
        var result = formatDateTime(time, data.attr.formatterValue, timeColor)
        node.innerHTML = result
      },
      onEnd: function () {
      }
    }).start()
  
    return node
  }
  
  Countdown.prototype.style = {
    textColor: function (value) {
      this.node.style.color = value
    }
  }
  
  module.exports = Countdown


/***/ },
/* 38 */
/***/ function(module, exports) {

  !function(a,b){function c(a){var b;if("number"==typeof a)b=new Date(1e3*a);else if("string"==typeof a){var c=a.charAt(0),d="+"===c,h="-"===c;if(d||h){for(var i,j=a.substr(1),k=j.split(":"),l=[0,0,0,0],m=4;k.length&&--m>=0;)l[m]=parseInt(k.pop())||0;i=e*l[0]+f*l[1]+g*l[2]+l[3],b=new Date,b.setSeconds(b.getSeconds()+i*(h?-1:1)),b.setMilliseconds(0)}}return b||(b=new Date(a)),b}function d(a,b){return b.replace(FORMATTER_REGEXP,function(b){var c=b.length,d=b.charAt(0);if("\\"===d)return b.replace("\\","");var e=("d"===d?a.days:"h"===d?a.hours:"m"===d?a.minutes:"s"===d?a.seconds:0)+"";return("00000"+e).substr(-Math.max(e.length,c))})}var e=86400,f=3600,g=60,h="d天hh时mm分ss秒";FORMATTER_REGEXP=/(\\)?(dd*|hh?|mm?|ss?)/gi;var i=function(a){a=a||{};var b=this,d=c(a.endDate);if(!d||!d.getTime())throw new Error("Invalid endDate");b.endDate=d,b.onUpdate=a.onUpdate,b.onEnd=a.onEnd,b.interval=a.interval||1e3,b.stringFormatter=a.stringFormatter||h,b.correctDateOffset=a.correctDateOffset||0,b.updateElement=a.updateElement,b._data={days:0,hours:0,minutes:0,seconds:0}};i.prototype={start:function(){var a=this;return a.stop(),a._update()&&(a._intervalId=setInterval(function(){a._update()},a.interval)),a},_update:function(){var a,b=this,c=b._data,h=b.updateElement,i=+new Date+1e3*b.correctDateOffset,j=Math.max(0,Math.round((b.endDate.getTime()-i)/1e3)),k=0>=j;return c.totalSeconds=j,j-=(c.days=Math.floor(j/e))*e,j-=(c.hours=Math.floor(j/f))*f,j-=(c.minutes=Math.floor(j/g))*g,c.seconds=j,c.stringValue=d(c,b.stringFormatter),h&&(h.innerHTML=c.stringValue),(a=b.onUpdate)&&a.call(b,c),k?(b.stop(),(a=b.onEnd)&&a.call(b),!1):!0},stop:function(){var a=this;return a._intervalId&&(clearInterval(a._intervalId),a._intervalId=null),a},setEndDate:function(a){var b=this;return b.endDate=c(a),b}},b.countdown=function(a){return new i(a)}}(window,window.lib||(window.lib={}));

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var config = __webpack_require__(5)
  var Component = __webpack_require__(16)
  var ComponentManager = __webpack_require__(9)
  var LazyLoad = __webpack_require__(12)
  
  function Marquee (data) {
    this.interval = Number(data.attr.interval) || 5 * 1000
    this.transitionDuration = Number(data.attr.transitionDuration) || 500
    this.delay = Number(data.attr.delay) || 0
    Component.call(this, data)
  }
  
  Marquee.prototype = Object.create(Component.prototype)
  
  Marquee.prototype.create = function () {
    var node = document.createElement('div')
    node.classList.add('weex-container')
    node.style.overflow = 'hidden'
    // fix page shaking during slider's playing
    node.style.webkitTransform = 'translate3D(0,0,0)'
    node.addEventListener('webkitTransitionEnd', this.end.bind(this), false)
    return node
  }
  
  Marquee.prototype.createChildren = function () {
    // first run:
    // - create each child
    // - append to parentNode
    // - find current and next
    // - set current and next shown and others hidden
    var children = this.data.children
    var parentRef = this.data.ref
    var instanceId = this.data.instanceId
    var items = []
    var componentManager = this.getComponentManager()
  
    var fragment, isFlex, child, node, i
  
    if (children && children.length) {
      fragment = document.createDocumentFragment()
      isFlex = false
      for (i = 0; i < children.length; i++) {
        children[i].scale = this.data.scale
        children[i].instanceId = instanceId
        child = componentManager.createElement(children[i])
        child.parentRef = parentRef
        this.initChild(child)
        // append and push
        items.push(child)
        fragment.appendChild(child.node)
        if (!isFlex && child.data.style.hasOwnProperty('flex')) {
          isFlex = true
        }
      }
      this.node.appendChild(fragment)
    }
  
    // set items
    this.items = items
  
    // reset the clock for first transition
    this.reset()
  }
  
  Marquee.prototype.initChild = function (child) {
    var node = child.node
    node.style.position = 'absolute'
    node.style.top = '0'
    node.style.left = '0'
  }
  
  Marquee.prototype.appendChild = function (data) {
    // dom + items
    var componentManager = ComponentManager.getInstance(this.data.instanceId)
    var child = componentManager.createElement(data)
    this.initChild(child)
    this.node.appendChild(child.node)
    this.items.push(child)
    this.reset()
    return child // @todo redesign Component#appendChild(component)
  }
  
  Marquee.prototype.insertBefore = function (child, before) {
    // dom + items
    var index = this.items.indexOf(before)
    this.items.splice(index, 0, child)
    this.initChild(child)
    this.node.insertBefore(child.node, before.node)
    this.reset()
  }
  
  Marquee.prototype.removeChild = function (child) {
    // dom + items
    var index = this.items.indexOf(child)
    this.items.splice(index, 1)
    this.node.removeChild(child.node)
    this.reset()
  }
  
  /**
   * status: {
   *   current: {translateY: 0, shown: true},
   *   next: {translateY: height, shown: true},
   *   others[]: {shown: false}
   *   index: index
   * }
   */
  Marquee.prototype.reset = function () {
    var interval = this.interval - 0
    var delay = this.delay - 0
    var items = this.items
    var self = this
  
    var loop = function () {
      self.next()
      self.timerId = setTimeout(loop, self.interval)
    }
  
    // reset display and transform
    items.forEach(function (item, index) {
      var node = item.node
      // set non-current(0)|next(1) item hidden
      node.style.display = index > 1 ? 'none' : ''
      // set next(1) item translateY
      // TODO: it supposed to use item.data.style
      // but somehow the style object is empty.
      // This problem relies on jsframework's bugfix.
  
      // node.style.transform = index === 1
      //     ? 'translate3D(0,' + config.scale * item.data.style.height + 'px,0)'
      //     : ''
      // node.style.webkitTransform = index === 1
      //     ? 'translate3D(0,' + config.scale * item.data.style.height + 'px,0)'
      //     : ''
      node.style.transform = index === 1
          ? 'translate3D(0,' + self.data.scale * self.data.style.height + 'px,0)'
          : ''
      node.style.webkitTransform = index === 1
          ? 'translate3D(0,' + self.data.scale * self.data.style.height + 'px,0)'
          : ''
    })
  
    setTimeout(function () {
      // reset current, next, index
      self.currentItem = items[0]
      self.nextItem = items[1]
      self.currentIndex = 0
  
      items.forEach(function (item, index) {
        var node = item.node
        // set transition
        node.style.transition = 'transform '
            + self.transitionDuration
            + 'ms ease'
        node.style.webkitTransition = '-webkit-transform '
            + self.transitionDuration
            + 'ms ease'
      })
  
      clearTimeout(self.timerId)
  
      if (items.length > 1) {
        self.timerId = setTimeout(loop, delay + interval)
      }
    }, 13)
  
  }
  
  /**
   * next:
   * - current: {translateY: -height}
   * - next: {translateY: 0}
   */
  Marquee.prototype.next = function () {
    // - update state
    //   - set current and next transition
    //   - hide current when transition end
    //   - set next to current
    //   - find new next
    var next = this.nextItem.node
    var current = this.currentItem.node
    this.transitionIndex = this.currentIndex
  
    // Use setTimeout to fix the problem that when the
    // page recover from backstage, the slider will
    // not work any longer.
    setTimeout(function () {
      next.style.transform = 'translate3D(0,0,0)'
      next.style.webkitTransform = 'translate3D(0,0,0)'
      current.style.transform = 'translate3D(0,-'
          + this.data.scale * this.data.style.height
          + 'px,0)'
      current.style.webkitTransform = 'translate3D(0,-'
          + this.data.scale * this.data.style.height
          + 'px,0)'
      this.fireEvent('change')
    }.bind(this), 300)
  }
  
  Marquee.prototype.fireEvent = function (type) {
    var length = this.items.length
    var nextIndex = (this.currentIndex + 1) % length
    var evt = document.createEvent('HTMLEvents')
    evt.initEvent(type, false, false)
    evt.data = {
      prevIndex: this.currentIndex,
      index: nextIndex
    }
    this.node.dispatchEvent(evt)
  }
  
  /**
   * end:
   * - old current: {shown: false}
   * - old current: {translateY: 0}
   * - index++ % length
   * - new current = old next
   * - new next = items[index+1 % length]
   * - new next: {translateY: height}
   * - new next: {shown: true}
   */
  Marquee.prototype.end = function (e) {
    var target = e.target
    var items = this.items
    var length = items.length
    var current, next
    var currentIndex, nextIndex
  
    currentIndex = this.transitionIndex
  
    if (isNaN(currentIndex)) {
      return
    }
    delete this.transitionIndex
  
    current = this.currentItem.node
    current.style.display = 'none'
    current.style.webkitTransform = ''
  
    currentIndex = (currentIndex + 1) % length
    nextIndex = (currentIndex + 1) % length
  
    this.currentIndex = currentIndex
    this.currentItem = this.nextItem
    this.nextItem = items[nextIndex]
  
    setTimeout(function () {
      next = this.nextItem.node
      // TODO: it supposed to use this.nextItem.data.style
      // but somehow the style object is empty.
      // This problem relies on jsframework's bugfix.
  
      next.style.webkitTransform = 'translate3D(0,'
          + this.data.scale * this.data.style.height
          + 'px,0)'
      next.style.display = ''
      LazyLoad.loadIfNeeded(next)
    }.bind(this))
  }
  
  Marquee.prototype.attr = {
    interval: function (value) {
      this.interval = value
    },
    transitionDuration: function (value) {
      this.transitionDuration = value
    },
    delay: function (value) {
      this.delay = value
    }
  }
  
  Marquee.prototype.clearAttr = function () {
    this.interval = 5 * 1000
    this.transitionDuration = 500
    this.delay = 0
  }
  
  module.exports = Marquee


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var extend = __webpack_require__(7).extend
  var config = __webpack_require__(5)
  var Component = __webpack_require__(16)
  var ComponentManager = __webpack_require__(9)
  var LazyLoad = __webpack_require__(12)
  __webpack_require__(41)
  __webpack_require__(42)
  
  function Slider (data) {
    this.autoPlay = true  // always true for autoplay
    this.direction = 'row' // 'column' is not temporarily supported.
    this.children = []
    this.isPageShow = true
    this.isDomRendering = true
  
    // bind event 'pageshow' and 'pagehide' on window.
    this._idleWhenPageDisappear()
    // bind event 'renderBegin' and 'renderEnd' on window.
    this._idleWhenDomRendering()
  
    Component.call(this, data)
  }
  
  Slider.prototype = Object.create(Component.prototype)
  
  Slider.prototype._idleWhenPageDisappear = function () {
    var _this = this
    window.addEventListener('pageshow', function () {
      _this.isPageShow = true
      _this.autoPlay && !_this.isDomRendering && _this.play()
    })
    window.addEventListener('pagehide', function () {
      _this.isPageShow = false
      _this.stop()
    })
  }
  
  Slider.prototype._idleWhenDomRendering = function () {
    var _this = this
    window.addEventListener('renderend', function () {
      _this.isDomRendering = false
      _this.autoPlay && _this.isPageShow && _this.play()
    })
    window.addEventListener('renderbegin', function () {
      _this.isDomRendering = true
      _this.stop()
    })
  }
  
  Slider.prototype.attr = {
    interval: function (val) {
      this.interval = parseInt(val) || 3000
      if (this.carrousel) {
        this.carrousel.playInterval = this.interval
      }
    },
  
    playstatus: function (val) {
      this.playstatus = val && val !== 'false' ? true : false
      this.autoPlay = this.playstatus
      if (this.carrousel) {
        if (this.playstatus) {
          this.play()
        } else {
          this.stop()
        }
      }
    },
  
    // support playstatus' alias auto-play for compatibility
    autoPlay: function (val) {
      this.attr.playstatus.call(this, val)
    }
  }
  
  Slider.prototype.create = function () {
    var node = document.createElement('div')
    node.classList.add('slider')
    node.style.position = 'relative'
    node.style.overflow = 'hidden'
    return node
  }
  
  Slider.prototype._doRender = function () {
    var _this = this
    _this.createChildren()
    _this.onAppend()
  }
  
  Slider.prototype.removeChild = function (child) {
    var children = this.data.children
    if (children) {
      for (var i = 0; i < children.length; i++) {
        if (child.data.ref === children[i].ref) {
          children.splice(i, 1)
          break
        }
      }
    }
  
    this._doRender()
  }
  
  Slider.prototype.insertBefore = function (child, before) {
    var children = this.data.children
    // var childIndex = this.children.indexOf(before.data)
    var childIndex = -1
    for (var i = 0, l = children.length; i < l; i++) {
      if (children[i].ref === before.data.ref) {
        childIndex = i
        break
      }
    }
    children.splice(childIndex, 0, child.data)
  
    this._doRender()
    if (this.children.length > 0) {
      return this.children[this.children.length - 1]
    }
  }
  
  Slider.prototype.appendChild = function (data) {
    var children = this.data.children || (this.data.children = [])
    children.push(data)
    this._doRender()
    if (this.children.length > 0) {
      return this.children[this.children.length - 1]
    }
  }
  
  Slider.prototype.createChildren = function () {
  
    var componentManager = this.getComponentManager()
  
    // recreate slider container.
    if (this.sliderContainer) {
      this.node.removeChild(this.sliderContainer)
    }
    if (this.indicator) {
      this.indicator.node.parentNode.removeChild(this.indicator.node)
    }
    this.children = []
  
    var sliderContainer = document.createElement('ul')
    sliderContainer.style.listStyle = 'none'
    this.node.appendChild(sliderContainer)
    this.sliderContainer = sliderContainer
  
    var children = this.data.children
    var scale = this.data.scale
    var fragment = document.createDocumentFragment()
    var indicatorData, width, height
    var childWidth = 0
    var childHeight = 0
  
    if (children && children.length) {
      for (var i = 0; i < children.length; i++) {
        var child
        children[i].scale = this.data.scale
        children[i].instanceId = this.data.instanceId
        if (children[i].type === 'indicator') {
          indicatorData = extend(children[i], {
            extra: {
              amount: children.length - 1,
              index: 0
            }
          })
        } else {
          child = componentManager.createElement(children[i], 'li')
          this.children.push(child)
          fragment.appendChild(child.node)
          width = child.data.style.width || 0
          height = child.data.style.height || 0
          width > childWidth && (childWidth = width)
          height > childHeight && (childHeight = height)
          child.parentRef = this.data.ref
        }
      }
      // append indicator
      if (indicatorData) {
        indicatorData.extra.width = this.data.style.width || childWidth
        indicatorData.extra.height = this.data.style.height || childHeight
        this.indicator = componentManager.createElement(indicatorData)
        this.indicator.parentRef = this.data.ref
        this.indicator.slider = this
        this.node.appendChild(this.indicator.node)
      }
  
      sliderContainer.style.height = scale * this.data.style.height + 'px'
      sliderContainer.appendChild(fragment)
    }
  }
  
  Slider.prototype.onAppend = function () {
    if (this.carrousel) {
      this.carrousel.removeEventListener('change', this._getSliderChangeHandler())
      this.carrousel.stop()
      this.carrousel = null
    }
    this.carrousel = new lib.carrousel(this.sliderContainer, {
      autoplay: this.autoPlay,
      useGesture: true
    })
  
    this.carrousel.playInterval = this.interval
    this.carrousel.addEventListener('change', this._getSliderChangeHandler())
    this.currentIndex = 0
  
    // preload all images for slider
    // because:
    // 1. lib-img doesn't listen to event transitionend
    // 2. even if we fire lazy load in slider's change event handler,
    //    the next image still won't be preloaded utill the moment it
    //    slides into the view, which is too late.
    if (this.preloadImgsTimer) {
      clearTimeout(this.preloadImgsTimer)
    }
    // The time just before the second slide appear and enough
    // for all child elements to append is ok.
    var preloadTime = 0.8
    this.preloadImgsTimer = setTimeout(function () {
      var imgs = this.carrousel.element.querySelectorAll('img')
      for (var i = 0, l = imgs.length; i < l; i++) {
        var img = imgs[i]
        var iLazySrc = img.getAttribute('i-lazy-src')
        var imgSrc = img.getAttribute('img-src')
        if (iLazySrc) {
          img.setAttribute('src', iLazySrc)
        } else if (imgSrc) {
          img.setAttribute('src', imgSrc)
        }
        img.removeAttribute('i-lazy-src')
        img.removeAttribute('img-src')
      }
    }.bind(this), preloadTime * 1000)
  
    // avoid page scroll when panning
    var panning = false
    this.carrousel.element.addEventListener('panstart', function (e) {
      if (!e.isVertical) {
        panning = true
      }
    })
    this.carrousel.element.addEventListener('panend', function (e) {
      if (!e.isVertical) {
        panning = false
      }
    })
  
    document.addEventListener('touchmove', function (e) {
      if (panning) {
        e.preventDefault()
        return false
      }
      return true
    }.bind(this))
  
  }
  
  Slider.prototype._updateIndicators = function () {
    this.indicator && this.indicator.setIndex(this.currentIndex)
  }
  
  Slider.prototype._getSliderChangeHandler = function (e) {
    if (!this.sliderChangeHandler) {
      this.sliderChangeHandler = (function (e) {
        var index = this.carrousel.items.index
        this.currentIndex = index
  
        // updateIndicators
        this._updateIndicators()
  
        this.dispatchEvent('change', { index: index })
      }).bind(this)
    }
    return this.sliderChangeHandler
  }
  
  Slider.prototype.play = function () {
    this.carrousel.play()
  }
  
  Slider.prototype.stop = function () {
    this.carrousel.stop()
  }
  
  Slider.prototype.slideTo = function (index) {
    var offset = index - this.currentIndex
    this.carrousel.items.slide(offset)
  }
  
  module.exports = Slider


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

  (typeof window === 'undefined') && (window = {ctrl: {}, lib: {}});!window.ctrl && (window.ctrl = {});!window.lib && (window.lib = {});__webpack_require__(33);__webpack_require__(34);__webpack_require__(35);!function(){var a="[data-ctrl-name=carrousel]{position:relative;-webkit-transform:translateZ(1px);-ms-transform:translateZ(1px);transform:translateZ(1px)}",b=document.createElement("style");if(document.getElementsByTagName("head")[0].appendChild(b),b.styleSheet)b.styleSheet.disabled||(b.styleSheet.cssText=a);else try{b.innerHTML=a}catch(c){b.innerText=a}}();!function(a,b,c){function d(a){var b,c={x:0,y:0},d=getComputedStyle(a)[l+"Transform"];return"none"!==d&&(b=d.match(/^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/)||d.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/))&&(c.x=parseFloat(b[1])||0,c.y=parseFloat(b[2])||0),c}function e(a,b){return a=parseFloat(a),b=parseFloat(b),0!=a&&(a+="px"),0!=b&&(b+="px"),n?"translate3d("+a+", "+b+", 0)":"translate("+a+", "+b+")"}function f(a){return o.call(a)}function g(a,c){function g(a,b){var c=h.createEvent("HTMLEvents");if(c.initEvent(a,!1,!1),b)for(var d in b)c[d]=b[d];n.dispatchEvent(c)}function i(a){for(;0>a;)a+=r;for(;a>=r;)a-=r;return a}function j(a){if(0!==r){var b,c,d=q.get(a);r>1&&(b=q.get(a-1),c=2===r?q.getCloned(a+1):q.get(a+1),d.style.left=-o+"px",b.style.left=-o-s+"px",c.style.left=-o+s+"px"),t=d.index,g("change",{prevItem:b,curItem:d,nextItem:c})}}var k=this,m=Date.now()+"-"+ ++p,n=document.createDocumentFragment();1!==arguments.length||arguments[0]instanceof HTMLElement||(c=arguments[0],a=null),a||(a=document.createElement("ul"),n.appendChild(a)),c=c||{},a.setAttribute("data-ctrl-name","carrousel"),a.setAttribute("data-ctrl-id",m),a.style.position="relative",a.style[l+"Transform"]=e(0,0);var o=0,q={},r=0,s=c.step||a.getBoundingClientRect().width,t=0;q.add=function(b){var c=document.createElement("li");return c.style.display="none",c.style["float"]="left",c.index=r,"string"==typeof b?c.innerHTML=b:b instanceof HTMLElement&&c.appendChild(b),a.appendChild(c),Object.defineProperty(q,r+"",{get:function(){return c}}),r++,c},q.get=function(a){return q[i(a)]},q.getCloned=function(b){function c(a,b,d){var e=a._listeners;if(e){b._listeners=e;for(var f in e)b.addEventListener(f,e[f])}if(d&&a.children&&a.children.length)for(var g=0,h=a.children.length;h>g;g++)c(a.children[g],b.children[g],d)}var b=i(b),d=a.querySelector('[cloned="cloned-'+b+'"]'),e=q[b];return d||(d=e.cloneNode(!0),c(e,d,!0),a.appendChild(d),d.setAttribute("cloned","cloned-"+b),d.index=b),d},q.slide=function(c){if(0!==r){1===r&&(c=0);var f=d(a).x,g=o+s*-c,h=g-f;if(0!==h){new b.animation(400,b.cubicbezier.ease,function(b,c){a.style[l+"Transform"]=e(f+h*c,0)}).play().then(function(){o=g,a.style[l+"Transform"]=e(g,0),c&&j(t+c)})}}},q.next=function(){q.slide(1)},q.prev=function(){q.slide(-1)},f(a.querySelectorAll("li")).forEach(function(a){a.style.position="absolute",a.style.top="0",a.style.left=r*s+"px",a.style["float"]="left",a.index=r,Object.defineProperty(q,r+"",{get:function(){return a}}),r++}),Object.defineProperty(this,"items",{get:function(){return q}}),Object.defineProperty(q,"length",{get:function(){return r}}),Object.defineProperty(q,"index",{get:function(){return t}}),Object.defineProperty(q,"step",{get:function(){return s},set:function(a){s=a}});var u=!1,v=!1,w=!1;this.play=function(){return u?void(v||(v=setTimeout(function(){w=!0,q.next(),setTimeout(function(){w=!1},500),v=setTimeout(arguments.callee,400+z)},400+z))):(u=!0,j(0))},this.stop=function(){v&&(clearTimeout(v),setTimeout(function(){v=!1},500))};var x=!1,y=!1;Object.defineProperty(this,"autoplay",{get:function(){return x},set:function(a){x=!!a,y&&(clearTimeout(y),y=!1),x?y=setTimeout(function(){k.play()},2e3):k.stop()}}),this.autoplay=!!c.autoplay;var z=1500;if(Object.defineProperty(this,"playInterval",{get:function(){return z},set:function(a){z=a}}),this.playInterval=!!c.playInterval||1500,c.useGesture){var A,B=!1;a.addEventListener("panstart",function(a){a.isVertical||B&&w||(a.preventDefault(),a.stopPropagation(),x&&k.stop(),A=0,B=!0)}),a.addEventListener("panmove",function(b){!b.isVertical&&B&&(b.preventDefault(),b.stopPropagation(),A=b.displacementX,a.style[l+"Transform"]=e(o+A,0))}),a.addEventListener("panend",function(a){!a.isVertical&&B&&(a.preventDefault(),a.stopPropagation(),B=!1,a.isflick?0>A?q.next():q.prev():Math.abs(A)<s/2?q.slide(0):q.slide(0>A?1:-1),x&&setTimeout(function(){k.play()},2e3))},!1),a.addEventListener("swipe",function(a){a.isVertical||(a.preventDefault(),a.stopPropagation())})}this.addEventListener=function(a,b){this.root.addEventListener(a,b,!1)},this.removeEventListener=function(a,b){this.root.removeEventListener(a,b,!1)},this.root=n,this.element=a}var h=a.document,i=a.navigator.userAgent,j=!!i.match(/Firefox/i),k=!!i.match(/IEMobile/i),l=j?"Moz":k?"ms":"webkit",m=k?"MSCSSMatrix":"WebKitCSSMatrix",n=!!j||m in a&&"m11"in new a[m],o=Array.prototype.slice,p=0;b.carrousel=g}(window,window.lib,window.ctrl||(window.ctrl={}));;module.exports = window.lib['carrousel'];

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(43);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./slider.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./slider.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".slider {\n  position: relative; }\n\n.slider .indicator-container {\n  position: absolute;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-align: center;\n  box-align: center;\n  -webkit-align-items: center;\n  align-items: center;\n  -webkit-box-pack: center;\n  box-pack: center;\n  -webkit-justify-content: center;\n  justify-content: center;\n  font-size: 0; }\n  .slider .indicator-container .indicator {\n    border-radius: 50%; }\n  .slider .indicator-container.row {\n    -webkit-box-orient: horizontal;\n    box-orient: horizontal;\n    -webkit-flex-direction: row;\n    flex-direction: row; }\n  .slider .indicator-container.column {\n    -webkit-box-orient: vertical;\n    box-orient: vertical;\n    -webkit-flex-direction: column;\n    flex-direction: column; }\n", "", {"version":3,"sources":["/./src/src/styles/slider.scss"],"names":[],"mappings":"AAAA;EACE,mBAAmB,EACpB;;AACD;EACE,mBAAmB;EACnB,qBAAqB;EACrB,sBAAsB;EACtB,cAAc;EACd,0BAA0B;EAC1B,kBAAkB;EAClB,4BAA4B;EAC5B,oBAAoB;EACpB,yBAAyB;EACzB,iBAAiB;EACjB,gCAAgC;EAChC,wBAAwB;EACxB,aAAa,EAoBd;EAjCD;IAgBI,mBAAmB,EACpB;EAjBH;IAoBI,+BAA+B;IAC/B,uBAAuB;IACvB,4BAA4B;IAC5B,oBAAoB,EACrB;EAxBH;IA2BI,6BAA6B;IAC7B,qBAAqB;IACrB,+BAA+B;IAC/B,uBAAuB,EACxB","file":"slider.scss","sourcesContent":[".slider {\n  position: relative;\n}\n.slider .indicator-container {\n  position: absolute;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-align: center;\n  box-align: center;\n  -webkit-align-items: center;\n  align-items: center;\n  -webkit-box-pack: center;\n  box-pack: center;\n  -webkit-justify-content: center;\n  justify-content: center;\n  font-size: 0;\n\n  .indicator {\n    border-radius: 50%;\n  }\n\n  &.row {\n    -webkit-box-orient: horizontal;\n    box-orient: horizontal;\n    -webkit-flex-direction: row;\n    flex-direction: row;\n  }\n\n  &.column {\n    -webkit-box-orient: vertical;\n    box-orient: vertical;\n    -webkit-flex-direction: column;\n    flex-direction: column;\n  }\n\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var extend = __webpack_require__(7).extend
  var config = __webpack_require__(5)
  var Atomic = __webpack_require__(27)
  var Component = __webpack_require__(16)
  
  __webpack_require__(45)
  
  var DEFAULT_ITEM_COLOR = '#999'
  var DEFAULT_ITEM_SELECTED_COLOR = '#0000ff'
  var DEFAULT_ITEM_SIZE = 20
  var DEFAULT_MARGIN_SIZE = 10
  
  // Style supported:
  //   position: (default - absolute)
  //   itemColor: color of indicator dots
  //   itemSelectedColor: color of the selected indicator dot
  //   itemSize: size of indicators
  //   other layout styles
  function Indicator (data) {
    this.direction = 'row' // 'column' is not temporarily supported.
    this.amount = data.extra.amount
    this.index = data.extra.index
    this.sliderWidth = data.extra.width
    this.sliderHeight = data.extra.height
    var styles = data.style || {}
    this.data = data
    this.style.width.call(this, styles.width)
    this.style.height.call(this, styles.height)
    this.items = []
    Atomic.call(this, data)
  }
  
  Indicator.prototype = Object.create(Atomic.prototype)
  
  Indicator.prototype.create = function () {
    var node = document.createElement('div')
    node.classList.add('weex-indicators')
    node.classList.add('weex-element')
    node.style.position = 'absolute'
    this.node = node
    this.style.itemSize.call(this, 0)
    this.itemColor = DEFAULT_ITEM_COLOR
    this.itemSelectedColor = DEFAULT_ITEM_SELECTED_COLOR
    this.updateStyle({
      left: 0,
      top: 0,
      itemSize: 0
    })
    return node
  }
  
  Indicator.prototype.createChildren = function () {
    var root = document.createDocumentFragment()
    for (var i = 0; i < this.amount; i++) {
      var indicator = document.createElement('div')
      indicator.classList.add('weex-indicator')
      indicator.style.boxSizing = 'border-box'
      indicator.style.margin = '0 '
                              + (DEFAULT_MARGIN_SIZE * this.data.scale)
                              + 'px'
      indicator.style.width = this.itemSize + 'px'
      indicator.style.height = this.itemSize + 'px'
      indicator.setAttribute('index', i)
      if (this.index === i) {
        indicator.style.backgroundColor = this.itemSelectedColor
      } else {
        indicator.style.backgroundColor = this.itemColor
      }
      indicator.addEventListener('click', this._clickHandler.bind(this, i))
      this.items[i] = indicator
      root.appendChild(indicator)
    }
    this.node.appendChild(root)
  }
  
  Indicator.prototype.style
      = extend(Object.create(Atomic.prototype.style), {
    itemColor: function (val) {
      this.itemColor = val || DEFAULT_ITEM_COLOR
      for (var i = 0, l = this.items.length; i < l; i++) {
        this.items[i].style.backgroundColor = this.itemColor
      }
    },
  
    itemSelectedColor: function (val) {
      this.itemSelectedColor = val || DEFAULT_ITEM_SELECTED_COLOR
      if (typeof this.index !== 'undefined'
          && this.items.length > this.index) {
        this.items[this.index].style.backgroundColor
            = this.itemSelectedColor
      }
    },
  
    itemSize: function (val) {
      val = parseInt(val) * this.data.scale
            || DEFAULT_ITEM_SIZE * this.data.scale
      this.itemSize = val
      this.node.style.height = val + 'px'
      for (var i = 0, l = this.items.length; i < l; i++) {
        this.items[i].style.width = val + 'px'
        this.items[i].style.height = val + 'px'
      }
    },
  
    width: function (val) {
      val = parseInt(val) * this.data.scale || parseInt(this.sliderWidth)
      this.virtualWrapperWidth = val
    },
  
    height: function (val) {
      val = parseInt(val) * this.data.scale || parseInt(this.sliderHeight)
      this.virtualWrapperHeight = val
    },
  
    top: function (val) {
      val = this.virtualWrapperHeight / 2 - this.itemSize / 2
          + val * this.data.scale
      this.node.style.bottom = ''
      this.node.style.top = val + 'px'
    },
  
    bottom: function (val) {
      val = this.virtualWrapperHeight / 2 - this.itemSize / 2
          + val * this.data.scale
      this.node.style.top = ''
      this.node.style.bottom = val + 'px'
    },
  
    left: function (val) {
      val = this.virtualWrapperWidth / 2
            - (this.itemSize + 2 * DEFAULT_MARGIN_SIZE * this.data.scale)
                * this.amount / 2
            + val * this.data.scale
      this.node.style.right = ''
      this.node.style.left = val + 'px'
    },
  
    right: function (val) {
      val = this.virtualWrapperWidth / 2
            - (this.itemSize + 2 * DEFAULT_MARGIN_SIZE * this.data.scale)
                * this.amount / 2
            + val * this.data.scale
      this.node.style.left = ''
      this.node.style.right = val + 'px'
    }
  })
  
  Indicator.prototype.setIndex = function (idx) {
    if (idx >= this.amount) {
      return
    }
    var prev = this.items[this.index]
    var cur = this.items[idx]
    prev.classList.remove('active')
    prev.style.backgroundColor = this.itemColor
    cur.classList.add('active')
    cur.style.backgroundColor = this.itemSelectedColor
    this.index = idx
  }
  
  Indicator.prototype._clickHandler = function (idx) {
    this.slider.slideTo(idx)
  }
  
  module.exports = Indicator


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(46);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./indicator.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./indicator.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".weex-indicators {\n  position: absolute;\n  white-space: nowrap; }\n  .weex-indicators .weex-indicator {\n    float: left;\n    border-radius: 50%; }\n", "", {"version":3,"sources":["/./src/src/styles/indicator.scss"],"names":[],"mappings":"AAAA;EACE,mBAAmB;EACnB,oBAAoB,EAOrB;EATD;IAKI,YAAY;IACZ,mBAAmB,EACpB","file":"indicator.scss","sourcesContent":[".weex-indicators {\n  position: absolute;\n  white-space: nowrap;\n\n  .weex-indicator {\n    float: left;\n    border-radius: 50%;\n  }\n\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(27)
  var msgQueue = __webpack_require__(48)
  var config = __webpack_require__(5)
  var utils = __webpack_require__(7)
  
  // TODO: refactor this scss code since this is strongly
  // dependent on lib.flexible other than the value of
  // scale.
  __webpack_require__(49)
  
  function TabHeader(data) {
    Atomic.call(this, data)
  }
  
  var proto = TabHeader.prototype = Object.create(Atomic.prototype)
  
  proto.create = function () {
    // outside container.
    var node = document.createElement('div')
    node.className = 'tab-header'
    // tip on the top.
    var bar = document.createElement('div')
    bar.className = 'header-bar'
    bar.textContent = 'CHANGE FLOOR'
    // middle layer.
    var body = document.createElement('div')
    body.className = 'header-body'
    var box = document.createElement('ul')
    box.className = 'tabheader'
  
    body.appendChild(box)
    node.appendChild(bar)
    node.appendChild(body)
    this._bar = bar
    this._body = body
    this.box = box
    this.node = node
    // init events.
    this._initFoldBtn()
    this._initEvent()
    return node
  }
  
  proto._initFoldBtn = function () {
    var _this = this
    var node = this.node
    var btn = document.createElement('span')
    btn.className = 'fold-toggle iconfont'
    btn.innerHTML = '&#xe661;'
    node.appendChild(btn)
  
    btn.addEventListener('click', function () {
      if (_this.unfolding) {
        _this._folding()
      } else {
        _this._unfolding()
      }
    })
  }
  
  proto._initMask = function () {
    var mask = document.createElement('div')
    mask.className = 'tabheader-mask'
    this.mask = mask
    // stop default behavior: page moving.
    mask.addEventListener('touchmove', function (evt) {
      evt.preventDefault()
    })
    // click to unfold.
    var _this = this
    mask.addEventListener('click', function () {
      _this._folding()
    })
  
    document.body.appendChild(mask)
  }
  
  proto._unfolding = function () {
    // mark the initial posiiton of tabheader
    if (!this.flag) {
      var flag = document.createComment('tabheader')
      this.flag = flag
      this.node.parentNode.insertBefore(flag, this.node)
    }
    if (!this.mask) {
      this._initMask()
    }
  
    // record the scroll position.
    this._scrollVal = this._body.scrollLeft
    // record the position in document.
    this._topVal = this.node.getBoundingClientRect().top
    this._styleTop = this.node.style.top
  
    document.body.appendChild(this.node)
    this.node.classList.add('unfold-header')
    this.node.style.height = 'auto'
    // recalc the position when it is unfolded.
    var thHeight = this.node.getBoundingClientRect().height
    if (thHeight + this._topVal > window.innerHeight) {
      this._topVal = this._topVal
          + (window.innerHeight - thHeight - this._topVal)
    }
  
    this.node.style.top = this._topVal + 'px'
    // process mask style
    this.mask.classList.add('unfold-header')
    this.mask.style.height = window.innerHeight + 'px'
    this.unfolding = true
  }
  
  proto._folding = function () {
    if (this.unfolding !== true) {
      return
    }
  
    this.mask.classList.remove('unfold-header')
    this.node.classList.remove('unfold-header')
  
    this.node.style.height = ''
    this.node.style.top = this._styleTop
  
    // recover the position of tabheader.
    this.flag.parentNode.insertBefore(this.node, this.flag)
    // recover the position of scoller.
    this._body.scrollLeft = this._scrollVal
  
    this._scrollToView()
    this.unfolding = false
  }
  
  proto._initEvent = function () {
    this._initClickEvent()
    this._initSelectEvent()
  }
  
  // init events.
  proto._initClickEvent = function () {
    var box = this.box
    var _this = this
  
    box.addEventListener('click', function (evt) {
      var target = evt.target
      if (target.nodeName === 'UL') {
        return
      }
  
      if (target.parentNode.nodeName === 'LI') {
        target = target.parentNode
      }
  
      var floor = target.getAttribute('data-floor')
  
      if (_this.data.attr.selectedIndex == floor) {
        // Duplicated clicking, not to trigger select event.
        return
      }
  
      fireEvent(target, 'select', {index:  floor})
    })
  }
  
  proto._initSelectEvent = function () {
    var node = this.node
    var _this = this
    node.addEventListener('select', function (evt) {
      var index
      if (evt.index !== undefined) {
        index = evt.index
      } else if (evt.data && evt.data.index !== undefined) {
        index = evt.data.index
      }
  
      if (index === undefined) {
        return
      }
  
      _this.attr.selectedIndex.call(_this, index)
    })
  }
  
  proto.attr = {
    highlightIcon: function () {
      return createHighlightIcon()
    },
    data: function () {
      var attr = this.data.attr
      // Ensure there is a default selected value.
      if (attr.selectedIndex === undefined) {
        attr.selectedIndex = 0
      }
  
      var list = attr.data || []
      var curItem = attr.selectedIndex
  
      var ret = []
      var itemTmpl = '<li class="th-item" data-floor="{{floor}}">'
          + '{{hlIcon}}{{floorName}}</li>'
  
      list.forEach(function (item, idx) {
        var html = itemTmpl.replace('{{floor}}', idx)
        if (curItem == idx) {
          html = html.replace('{{hlIcon}}', createHighlightIcon())
        } else {
          html = html.replace('{{hlIcon}}', '')
        }
  
        html = html.replace('{{floorName}}', item)
  
        ret.push(html)
      }, this)
  
      this.box.innerHTML = ret.join('')
    },
    selectedIndex: function (val) {
      var attr = this.data.attr
  
      if (val === undefined) {
        val = 0
      }
  
      // if (val == attr.selectedIndex) {
      //   return
      // }
  
      attr.selectedIndex = val
  
      this.attr.data.call(this)
  
      this._folding()
      this.style.textHighlightColor.call(this, this.textHighlightColor)
    }
  }
  
  proto.style = Object.create(Atomic.prototype.style)
  
  proto.style.opacity = function (val) {
    if (val === undefined || val < 0 || val > 1) {
      val = 1
    }
  
    this.node.style.opacity = val
  }
  
  proto.style.textColor = function (val) {
    if (!isValidColor(val)) {
      return
    }
  
    this.node.style.color = val
  }
  
  proto.style.textHighlightColor = function (val) {
    if (!isValidColor(val)) {
      return
    }
    this.textHighlightColor = val
    var attr = this.data.attr
  
    var node = this.node.querySelector('[data-floor="'
        + attr.selectedIndex + '"]')
    if (node) {
      node.style.color = val
      this._scrollToView(node)
    }
  }
  
  proto._scrollToView = function (node) {
    if (!node) {
      var attr = this.data.attr
      node = this.node.querySelector('[data-floor="' + attr.selectedIndex + '"]')
    }
    if (!node) {
      return
    }
  
    var defaultVal = this._body.scrollLeft
    var leftVal = defaultVal  - node.offsetLeft + 300
  
    var scrollVal = getScrollVal(this._body.getBoundingClientRect(), node)
    doScroll(this._body, scrollVal)
  }
  
  // scroll the tabheader.
  // positive val means to scroll right.
  // negative val means to scroll left.
  function doScroll(node, val, finish) {
    if (!val) {
      return
    }
    if (finish === undefined) {
      finish = Math.abs(val)
    }
  
    if (finish <= 0) {
      return
    }
  
    setTimeout(function () {
      if (val > 0) {
        node.scrollLeft += 2
      } else {
        node.scrollLeft -= 2
      }
      finish -= 2
  
      doScroll(node, val, finish)
    })
  }
  
  // get scroll distance.
  function getScrollVal(rect, node) {
    var left = node.previousSibling
    var right = node.nextSibling
    var scrollVal
  
    // process left-side element first.
    if (left) {
      var leftRect = left.getBoundingClientRect()
      // only need to compare the value of left.
      if (leftRect.left < rect.left) {
        scrollVal = leftRect.left
        return scrollVal
      }
    }
  
    if (right) {
      var rightRect = right.getBoundingClientRect()
      // compare the value of right.
      if (rightRect.right > rect.right) {
        scrollVal = rightRect.right - rect.right
        return scrollVal
      }
    }
  
    // process current node, from left to right.
    var nodeRect = node.getBoundingClientRect()
    if (nodeRect.left < rect.left) {
      scrollVal = nodeRect.left
    } else if (nodeRect.right > rect.right) {
      scrollVal = nodeRect.right - rect.right
    }
  
    return scrollVal
  }
  
  // trigger and broadcast events.
  function fireEvent(element, type, data) {
    var evt = document.createEvent('Event')
    evt.data = data
    utils.extend(evt, data)
    // need bubble.
    evt.initEvent(type, true, true)
  
    element.dispatchEvent(evt)
  }
  
  function createHighlightIcon(code) {
    var html = '<i class="hl-icon iconfont">' + '&#xe650' + '</i>'
    return html
  }
  
  function isValidColor(color) {
    if (!color) {
      return false
    }
  
    if (color.charAt(0) !== '#') {
      return false
    }
  
    if (color.length !== 7) {
      return false
    }
  
    return true
  }
  
  module.exports = TabHeader


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var config = __webpack_require__(5)
  var messageQueue = []
  
  function flushMessage() {
    if (typeof callJS === 'function' && messageQueue.length > 0) {
      callJS(config.instanceId, JSON.stringify(messageQueue))
      messageQueue.length = 0
    }
  }
  
  function push(msg) {
    messageQueue.push(msg)
  }
  
  /**
   * To fix the problem of callapp, the two-way time loop mechanism must
   * be replaced by directly procedure call except the situation of
   * page loading.
   * 2015-11-03
   */
  function pushDirectly(msg) {
    callJS(config.instanceId, [msg])
  }
  
  module.exports = {
    push: pushDirectly
  }


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(50);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./tabheader.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./tabheader.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".tab-header {\n  position: relative;\n  width: 10rem;\n  font-size: 14px;\n  color: #333; }\n  .tab-header .header-bar {\n    height: 1.17rem;\n    line-height: 1.17rem;\n    display: none;\n    color: #999;\n    padding-left: 0.4rem; }\n  .tab-header .header-body {\n    margin-right: 1.07rem;\n    overflow-x: auto;\n    overflow-y: hidden; }\n    .tab-header .header-body::-webkit-scrollbar {\n      width: 0;\n      height: 0;\n      overflow: hidden; }\n  .tab-header .fold-toggle {\n    position: absolute;\n    top: 0.59rem;\n    -webkit-transform: translateY(-50%);\n    right: 0.29rem;\n    width: 0.48rem;\n    height: 0.48rem;\n    line-height: 0.48rem;\n    text-align: center;\n    z-index: 99;\n    font-size: 14px; }\n  .tab-header.unfold-header {\n    position: fixed !important;\n    top: 0;\n    left: 0;\n    overflow: hidden; }\n\n.tabheader {\n  list-style: none;\n  white-space: nowrap;\n  height: 1.17rem;\n  line-height: 1.17rem; }\n  .tabheader .th-item {\n    padding-left: 0.72rem;\n    position: relative;\n    display: inline-block; }\n  .tabheader .hl-icon {\n    width: 0.4rem;\n    height: 0.4rem;\n    line-height: 0.4rem;\n    text-align: center;\n    position: absolute;\n    top: 50%;\n    -webkit-transform: translateY(-50%);\n    left: 0.24rem;\n    font-size: 14px; }\n\n.unfold-header .header-bar {\n  display: block; }\n\n.unfold-header .fold-toggle {\n  -webkit-transform: translateY(-50%) rotate(180deg); }\n\n.unfold-header .header-body {\n  margin-right: 0;\n  padding: 0.24rem; }\n\n.unfold-header .tabheader {\n  display: block;\n  height: auto; }\n\n.unfold-header .th-item {\n  box-sizing: border-box;\n  float: left;\n  width: 33.3333%;\n  height: 1.01rem;\n  line-height: 1.01rem; }\n\n.unfold-header .hl-icon {\n  margin-right: 0;\n  position: absolute; }\n\n.unfold-header.tabheader-mask {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.6); }\n\n.tabheader-mask {\n  display: none;\n  position: fixed;\n  left: 0;\n  top: 0; }\n\n@font-face {\n  font-family: \"iconfont\";\n  src: url(\"data:application/x-font-ttf;charset=utf-8;base64,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R7AEQ7CAYmAgsAArIIqKYSCwAkNgZCOwA0NhZFBYsAJDYRuwA0NgWbADJbCAYmGwAiVGYTgjIDwjOBshICBGI0ewACsjYTghWbEkARQrLbA7LLAuKy6xJAEUKy2wPCywLyshIyAgPLAEI0IjOLEkARQrsARDLrAkKy2wPSywABUgR7AAI0KyAAEBFRQTLrAqKi2wPiywABUgR7AAI0KyAAEBFRQTLrAqKi2wPyyxAAEUE7ArKi2wQCywLSotsEEssAAWRSMgLiBGiiNhOLEkARQrLbBCLLAJI0KwQSstsEMssgAAOistsEQssgABOistsEUssgEAOistsEYssgEBOistsEcssgAAOystsEgssgABOystsEkssgEAOystsEossgEBOystsEsssgAANystsEwssgABNystsE0ssgEANystsE4ssgEBNystsE8ssgAAOSstsFAssgABOSstsFEssgEAOSstsFIssgEBOSstsFMssgAAPCstsFQssgABPCstsFUssgEAPCstsFYssgEBPCstsFcssgAAOCstsFgssgABOCstsFkssgEAOCstsFossgEBOCstsFsssDArLrEkARQrLbBcLLAwK7A0Ky2wXSywMCuwNSstsF4ssAAWsDArsDYrLbBfLLAxKy6xJAEUKy2wYCywMSuwNCstsGEssDErsDUrLbBiLLAxK7A2Ky2wYyywMisusSQBFCstsGQssDIrsDQrLbBlLLAyK7A1Ky2wZiywMiuwNistsGcssDMrLrEkARQrLbBoLLAzK7A0Ky2waSywMyuwNSstsGossDMrsDYrLbBrLCuwCGWwAyRQeLABFTAtAABLuADIUlixAQGOWbkIAAgAYyCwASNEILADI3CwDkUgIEu4AA5RS7AGU1pYsDQbsChZYGYgilVYsAIlYbABRWMjYrACI0SzCgkFBCuzCgsFBCuzDg8FBCtZsgQoCUVSRLMKDQYEK7EGAUSxJAGIUViwQIhYsQYDRLEmAYhRWLgEAIhYsQYBRFlZWVm4Af+FsASNsQUARAAAAA==\") format(\"truetype\"); }\n\n.iconfont {\n  font-family: iconfont !important;\n  font-size: 16px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -webkit-text-stroke-width: 0.2px;\n  -moz-osx-font-smoothing: grayscale; }\n\n[data-dpr=\"2\"] .tab-header {\n  font-size: 28px; }\n\n[data-dpr=\"3\"] .tab-header {\n  font-size: 42px; }\n\n[data-dpr=\"2\"] .tabheader .hl-icon {\n  font-size: 28px; }\n\n[data-dpr=\"3\"] .tabheader .hl-icon {\n  font-size: 42px; }\n\n[data-dpr=\"2\"] .tab-header .fold-toggle {\n  font-size: 28px; }\n\n[data-dpr=\"3\"] .tab-header .fold-toggle {\n  font-size: 42px; }\n", "", {"version":3,"sources":["/./src/src/styles/tabheader.scss","/./src/styles/tabheader.scss"],"names":[],"mappings":"AAGA;EACE,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,YAAY,EA0Cb;EA9CD;IAOI,gBAAgB;IAChB,qBAAqB;IACrB,cAAc;IACd,YAAY;IACZ,qBAAqB,EACtB;EAZH;IAeI,sBAAsB;IACtB,iBAAiB;IACjB,mBAAmB,EAOpB;IAxBH;MAoBM,SAAS;MACT,UAAU;MACV,iBAAiB,EAClB;EAvBL;IA2BI,mBAAmB;IACnB,aAAa;IACb,oCAA6B;IAC7B,eAAe;IACf,eAAe;IACf,gBAAgB;IAChB,qBAAqB;IACrB,mBAAmB;IACnB,YAAY;IACZ,gBAAgB,EACjB;EArCH;IAwCI,2BAA2B;IAC3B,OAAO;IACP,QAAQ;IACR,iBAAiB,EAClB;;AAIH;EACE,iBAAiB;EACjB,oBAAoB;EACpB,gBAAgB;EAChB,qBAAqB,EAoBtB;EAxBD;IAOI,sBAAsB;IACtB,mBAAmB;IACnB,sBAAsB,EACvB;EAVH;IAaI,cAAc;IACd,eAAe;IACf,oBAAoB;IACpB,mBAAmB;IACnB,mBAAmB;IACnB,SAAS;IACT,oCAA6B;IAC7B,cAAc;IACd,gBAAgB,EACjB;;AAIH;EAGI,eAAe,EAChB;;AAJH;EAOI,mDAA0C,EAC3C;;AARH;EAWI,gBAAgB;EAChB,iBAAiB,EAClB;;AAbH;EAgBI,eAAe;EACf,aAAa,EACd;;AAlBH;EAqBI,uBAAuB;EACvB,YAAY;EACZ,gBAAgB;EAChB,gBAAgB;EAChB,qBAAqB,EACtB;;AA1BH;EA6BI,gBAAgB;EAChB,mBAAmB,EACpB;;AA/BH;EAkCI,eAAe;EACf,YAAY;EACZ,aAAa;EACb,qCAAsB,EACvB;;AAGH;EACE,cAAc;EACd,gBAAgB;EAChB,QAAQ;EACR,OAAO,EACR;;AAED;EACE,wBAAwB;EACxB,y9NAA48N,EAAA;;AAG98N;EACE,iCAAiC;EACjC,gBAAgB;EAChB,mBAAmB;EACnB,oCAAoC;EACpC,iCAAiC;EACjC,mCAAmC,EACpC;;AChCD;EDmCE,gBAAgB,EACjB;;ACjCD;EDoCE,gBAAgB,EACjB;;AClCD;EDqCE,gBAAgB,EACjB;;ACnCD;EDsCE,gBAAgB,EACjB;;ACpCD;EDuCE,gBAAgB,EACjB;;ACrCD;EDwCE,gBAAgB,EACjB","file":"tabheader.scss","sourcesContent":["// Heads up! Rem is not a good way for\n// weex HTML5 renderer.\n\n.tab-header {\n  position: relative;\n  width: 10rem;\n  font-size: 14px;\n  color: #333;\n\n  .header-bar {\n    height: 1.17rem;\n    line-height: 1.17rem;\n    display: none;\n    color: #999;\n    padding-left: 0.4rem;\n  }\n  \n  .header-body {\n    margin-right: 1.07rem;\n    overflow-x: auto;\n    overflow-y: hidden;\n\n    &::-webkit-scrollbar {\n      width: 0;\n      height: 0;\n      overflow: hidden;\n    }\n  }\n\n  .fold-toggle {\n    position: absolute;\n    top: 0.59rem;\n    -webkit-transform: translateY(-50%);\n    right: 0.29rem;\n    width: 0.48rem;\n    height: 0.48rem;\n    line-height: 0.48rem;\n    text-align: center;\n    z-index: 99;\n    font-size: 14px;\n  }\n\n  &.unfold-header {\n    position: fixed !important;\n    top: 0;\n    left: 0;\n    overflow: hidden;\n  }\n\n}\n\n.tabheader {\n  list-style: none;\n  white-space: nowrap;\n  height: 1.17rem;\n  line-height: 1.17rem;\n\n  .th-item {\n    padding-left: 0.72rem;\n    position: relative;\n    display: inline-block;\n  }\n\n  .hl-icon {\n    width: 0.4rem;\n    height: 0.4rem;\n    line-height: 0.4rem;\n    text-align: center;\n    position: absolute;\n    top: 50%;\n    -webkit-transform: translateY(-50%);\n    left: 0.24rem;\n    font-size: 14px;\n  }\n\n}\n\n.unfold-header {\n\n  .header-bar {\n    display: block;\n  }\n\n  .fold-toggle {\n    -webkit-transform: translateY(-50%) rotate(180deg);\n  }\n\n  .header-body {\n    margin-right: 0;\n    padding: 0.24rem;\n  }\n\n  .tabheader {\n    display: block;\n    height: auto;\n  }\n\n  .th-item {\n    box-sizing: border-box;\n    float: left;\n    width: 33.3333%;\n    height: 1.01rem;\n    line-height: 1.01rem;\n  }\n\n  .hl-icon {\n    margin-right: 0;\n    position: absolute;\n  }\n\n  &.tabheader-mask {\n    display: block;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, 0.6);\n  }\n}\n\n.tabheader-mask {\n  display: none;\n  position: fixed;\n  left: 0;\n  top: 0;\n}\n\n@font-face {\n  font-family: \"iconfont\";\n  src: url(\"data:application/x-font-ttf;charset=utf-8;base64,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R7AEQ7CAYmAgsAArIIqKYSCwAkNgZCOwA0NhZFBYsAJDYRuwA0NgWbADJbCAYmGwAiVGYTgjIDwjOBshICBGI0ewACsjYTghWbEkARQrLbA7LLAuKy6xJAEUKy2wPCywLyshIyAgPLAEI0IjOLEkARQrsARDLrAkKy2wPSywABUgR7AAI0KyAAEBFRQTLrAqKi2wPiywABUgR7AAI0KyAAEBFRQTLrAqKi2wPyyxAAEUE7ArKi2wQCywLSotsEEssAAWRSMgLiBGiiNhOLEkARQrLbBCLLAJI0KwQSstsEMssgAAOistsEQssgABOistsEUssgEAOistsEYssgEBOistsEcssgAAOystsEgssgABOystsEkssgEAOystsEossgEBOystsEsssgAANystsEwssgABNystsE0ssgEANystsE4ssgEBNystsE8ssgAAOSstsFAssgABOSstsFEssgEAOSstsFIssgEBOSstsFMssgAAPCstsFQssgABPCstsFUssgEAPCstsFYssgEBPCstsFcssgAAOCstsFgssgABOCstsFkssgEAOCstsFossgEBOCstsFsssDArLrEkARQrLbBcLLAwK7A0Ky2wXSywMCuwNSstsF4ssAAWsDArsDYrLbBfLLAxKy6xJAEUKy2wYCywMSuwNCstsGEssDErsDUrLbBiLLAxK7A2Ky2wYyywMisusSQBFCstsGQssDIrsDQrLbBlLLAyK7A1Ky2wZiywMiuwNistsGcssDMrLrEkARQrLbBoLLAzK7A0Ky2waSywMyuwNSstsGossDMrsDYrLbBrLCuwCGWwAyRQeLABFTAtAABLuADIUlixAQGOWbkIAAgAYyCwASNEILADI3CwDkUgIEu4AA5RS7AGU1pYsDQbsChZYGYgilVYsAIlYbABRWMjYrACI0SzCgkFBCuzCgsFBCuzDg8FBCtZsgQoCUVSRLMKDQYEK7EGAUSxJAGIUViwQIhYsQYDRLEmAYhRWLgEAIhYsQYBRFlZWVm4Af+FsASNsQUARAAAAA==\") format(\"truetype\");\n}\n\n.iconfont {\n  font-family: iconfont !important;\n  font-size: 16px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -webkit-text-stroke-width: 0.2px;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n[data-dpr=\"2\"] .tab-header {\n  font-size: 28px;\n}\n\n[data-dpr=\"3\"] .tab-header {\n  font-size: 42px;\n}\n\n[data-dpr=\"2\"] .tabheader .hl-icon {\n  font-size: 28px;\n}\n\n[data-dpr=\"3\"] .tabheader .hl-icon {\n  font-size: 42px;\n}\n\n[data-dpr=\"2\"] .tab-header .fold-toggle {\n  font-size: 28px;\n}\n\n[data-dpr=\"3\"] .tab-header .fold-toggle {\n  font-size: 42px;\n}",".tab-header {\n  position: relative;\n  width: 10rem;\n  font-size: 14px;\n  color: #333; }\n  .tab-header .header-bar {\n    height: 1.17rem;\n    line-height: 1.17rem;\n    display: none;\n    color: #999;\n    padding-left: 0.4rem; }\n  .tab-header .header-body {\n    margin-right: 1.07rem;\n    overflow-x: auto;\n    overflow-y: hidden; }\n    .tab-header .header-body::-webkit-scrollbar {\n      width: 0;\n      height: 0;\n      overflow: hidden; }\n  .tab-header .fold-toggle {\n    position: absolute;\n    top: 0.59rem;\n    -webkit-transform: translateY(-50%);\n    right: 0.29rem;\n    width: 0.48rem;\n    height: 0.48rem;\n    line-height: 0.48rem;\n    text-align: center;\n    z-index: 99;\n    font-size: 14px; }\n  .tab-header.unfold-header {\n    position: fixed !important;\n    top: 0;\n    left: 0;\n    overflow: hidden; }\n\n.tabheader {\n  list-style: none;\n  white-space: nowrap;\n  height: 1.17rem;\n  line-height: 1.17rem; }\n  .tabheader .th-item {\n    padding-left: 0.72rem;\n    position: relative;\n    display: inline-block; }\n  .tabheader .hl-icon {\n    width: 0.4rem;\n    height: 0.4rem;\n    line-height: 0.4rem;\n    text-align: center;\n    position: absolute;\n    top: 50%;\n    -webkit-transform: translateY(-50%);\n    left: 0.24rem;\n    font-size: 14px; }\n\n.unfold-header .header-bar {\n  display: block; }\n\n.unfold-header .fold-toggle {\n  -webkit-transform: translateY(-50%) rotate(180deg); }\n\n.unfold-header .header-body {\n  margin-right: 0;\n  padding: 0.24rem; }\n\n.unfold-header .tabheader {\n  display: block;\n  height: auto; }\n\n.unfold-header .th-item {\n  box-sizing: border-box;\n  float: left;\n  width: 33.3333%;\n  height: 1.01rem;\n  line-height: 1.01rem; }\n\n.unfold-header .hl-icon {\n  margin-right: 0;\n  position: absolute; }\n\n.unfold-header.tabheader-mask {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.6); }\n\n.tabheader-mask {\n  display: none;\n  position: fixed;\n  left: 0;\n  top: 0; }\n\n@font-face {\n  font-family: \"iconfont\";\n  src: url(\"data:application/x-font-ttf;charset=utf-8;base64,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R7AEQ7CAYmAgsAArIIqKYSCwAkNgZCOwA0NhZFBYsAJDYRuwA0NgWbADJbCAYmGwAiVGYTgjIDwjOBshICBGI0ewACsjYTghWbEkARQrLbA7LLAuKy6xJAEUKy2wPCywLyshIyAgPLAEI0IjOLEkARQrsARDLrAkKy2wPSywABUgR7AAI0KyAAEBFRQTLrAqKi2wPiywABUgR7AAI0KyAAEBFRQTLrAqKi2wPyyxAAEUE7ArKi2wQCywLSotsEEssAAWRSMgLiBGiiNhOLEkARQrLbBCLLAJI0KwQSstsEMssgAAOistsEQssgABOistsEUssgEAOistsEYssgEBOistsEcssgAAOystsEgssgABOystsEkssgEAOystsEossgEBOystsEsssgAANystsEwssgABNystsE0ssgEANystsE4ssgEBNystsE8ssgAAOSstsFAssgABOSstsFEssgEAOSstsFIssgEBOSstsFMssgAAPCstsFQssgABPCstsFUssgEAPCstsFYssgEBPCstsFcssgAAOCstsFgssgABOCstsFkssgEAOCstsFossgEBOCstsFsssDArLrEkARQrLbBcLLAwK7A0Ky2wXSywMCuwNSstsF4ssAAWsDArsDYrLbBfLLAxKy6xJAEUKy2wYCywMSuwNCstsGEssDErsDUrLbBiLLAxK7A2Ky2wYyywMisusSQBFCstsGQssDIrsDQrLbBlLLAyK7A1Ky2wZiywMiuwNistsGcssDMrLrEkARQrLbBoLLAzK7A0Ky2waSywMyuwNSstsGossDMrsDYrLbBrLCuwCGWwAyRQeLABFTAtAABLuADIUlixAQGOWbkIAAgAYyCwASNEILADI3CwDkUgIEu4AA5RS7AGU1pYsDQbsChZYGYgilVYsAIlYbABRWMjYrACI0SzCgkFBCuzCgsFBCuzDg8FBCtZsgQoCUVSRLMKDQYEK7EGAUSxJAGIUViwQIhYsQYDRLEmAYhRWLgEAIhYsQYBRFlZWVm4Af+FsASNsQUARAAAAA==\") format(\"truetype\"); }\n\n.iconfont {\n  font-family: iconfont !important;\n  font-size: 16px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -webkit-text-stroke-width: 0.2px;\n  -moz-osx-font-smoothing: grayscale; }\n\n[data-dpr=\"2\"] .tab-header {\n  font-size: 28px; }\n\n[data-dpr=\"3\"] .tab-header {\n  font-size: 42px; }\n\n[data-dpr=\"2\"] .tabheader .hl-icon {\n  font-size: 28px; }\n\n[data-dpr=\"3\"] .tabheader .hl-icon {\n  font-size: 42px; }\n\n[data-dpr=\"2\"] .tab-header .fold-toggle {\n  font-size: 28px; }\n\n[data-dpr=\"3\"] .tab-header .fold-toggle {\n  font-size: 42px; }\n"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  __webpack_require__(52)
  __webpack_require__(32)
  
  // lib.scroll events:
  //  - scrollstart
  //  - scrolling
  //  - pulldownend
  //  - pullupend
  //  - pullleftend
  //  - pullrightend
  //  - pulldown
  //  - pullup
  //  - pullleft
  //  - pullright
  //  - contentrefresh
  
  var Component = __webpack_require__(16)
  var utils = __webpack_require__(7)
  
  // attrs:
  //  - scroll-direciton: none|vertical|horizontal (default is vertical)
  //  - show-scrollbar: true|false (default is true)
  function Scroller (data, nodeType) {
    var attrs = data.attr || {}
    this.items = []
    this.totalWidth = 0
    this.scrollDirection = attrs.scrollDirection === 'horizontal'
                            ? 'horizontal'
                            : 'vertical'
    this.showScrollbar = attrs.showScrollbar || true
    Component.call(this, data, nodeType)
  }
  
  Scroller.prototype = Object.create(Component.prototype)
  
  Scroller.prototype.create = function (nodeType) {
    var Scroll = lib.scroll
    var node = Component.prototype.create.call(this, nodeType)
    node.classList.add('weex-container', 'scroll-wrap')
    this.scrollElement = document.createElement('div')
    this.scrollElement.classList.add(
      'weex-container',
      'scroll-element',
      this.scrollDirection
    )
    node.appendChild(this.scrollElement)
    this.scroller = new Scroll({
      scrollElement: this.scrollElement,
      direction: this.scrollDirection === 'vertical' ? 'y' : 'x'
    })
    this.scroller.init()
    return node
  }
  
  Scroller.prototype.bindEvents = function (evts) {
    Component.prototype.bindEvents.call(this, evts)
    // to enable lazyload for Images
    this.scroller.addEventListener('scrolling', function (e) {
      var so = e.scrollObj
      this.dispatchEvent('scroll', {
        originalType: 'scrolling',
        scrollTop: so.getScrollTop(),
        scrollLeft: so.getScrollLeft()
      }, {
        bubbles: true
      })
    }.bind(this))
  }
  
  Scroller.prototype.appendChild = function (data) {
    var children = this.data.children
    var componentManager = this.getComponentManager()
    var child = componentManager.createElement(data)
    this.scrollElement.appendChild(child.node)
  
    var childWidth = child.node.getBoundingClientRect().width
    this.totalWidth += childWidth
    // if direction is horizontal then the width of scrollElement
    // should be set manually due to flexbox's rule (child elements
    // will not exceed box's width but to shrink to adapt).
    if (this.scrollDirection === 'horizontal') {
      this.scrollElement.style.width = this.totalWidth + 'px'
    }
  
    // update this.data.children
    if (!children || !children.length) {
      this.data.children = [data]
    } else {
      children.push(data)
    }
  
    this.items.push(child)
    return child
  }
  
  Scroller.prototype.insertBefore = function (child, before) {
    var children = this.data.children
    var i = 0
    var isAppend = false
  
    // update this.data.children
    if (!children || !children.length || !before) {
      isAppend = true
    } else {
      for (var l = children.length; i < l; i++) {
        if (children[i].ref === child.data.ref) {
          break
        }
      }
      if (i === l) {
        isAppend = true
      }
    }
  
    if (isAppend) {
      this.scrollElement.appendChild(child.node)
      children.push(child.data)
      this.items.push(child)
    } else {
      this.scrollElement.insertBefore(child.node, before.node)
      children.splice(i, 0, child.data)
      this.items.splice(i, 0, child)
    }
  }
  
  Scroller.prototype.removeChild = function () {
    var children = this.data.children
    // remove from this.data.children
    var i = 0
    var componentManager = this.getComponentManager()
    if (children && children.length) {
      for (var l = children.length; i < l; i++) {
        if (children[i].ref === child.data.ref) {
          break
        }
      }
      if (i < l) {
        children.splice(i, 1)
        this.items.splice(i, 1)
      }
    }
    // remove from componentMap recursively
    componentManager.removeElementByRef(child.data.ref)
    this.scrollElement.removeChild(child.node)
  }
  
  module.exports = Scroller


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(53);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./scroller.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./scroller.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".scroll-wrap {\n  display: block;\n  overflow: hidden; }\n\n.scroll-element.horizontal {\n  -webkit-box-orient: horizontal;\n  -webkit-flex-direction: row;\n  flex-direction: row; }\n\n.scroll-element.vertical {\n  -webkit-box-orient: vertical;\n  -webkit-flex-direction: column;\n  flex-direction: column; }\n", "", {"version":3,"sources":["/./src/src/styles/scroller.scss"],"names":[],"mappings":"AAAA;EACC,eAAe;EACf,iBAAiB,EACjB;;AAED;EAEI,+BAA+B;EAC/B,4BAA4B;EAC5B,oBAAoB,EACrB;;AALH;EAOI,6BAA6B;EAC7B,+BAA+B;EAC/B,uBAAuB,EACxB","file":"scroller.scss","sourcesContent":[".scroll-wrap {\n\tdisplay: block;\n\toverflow: hidden;\n}\n\n.scroll-element {\n  &.horizontal {\n    -webkit-box-orient: horizontal;\n    -webkit-flex-direction: row;\n    flex-direction: row;\n  }\n  &.vertical {\n    -webkit-box-orient: vertical;\n    -webkit-flex-direction: column;\n    flex-direction: column;\n  }\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(27)
  var utils = __webpack_require__(7)
  
  // attrs:
  //   - type: text|password|tel|email|url
  //   - value
  //   - placeholder
  //   - disabled
  //   - autofocus
  function Input (data) {
    var attrs = data.attr || {}
    this.type = attrs.type || 'text'
    this.value = attrs.value
    this.placeholder = attrs.placeholder
    this.autofocus = attrs.autofocus && (attrs.autofocus !== 'false')
                      ? true
                      : false
    Atomic.call(this, data)
  }
  
  Input.prototype = Object.create(Atomic.prototype)
  
  Input.prototype.create = function () {
    var node = document.createElement('input')
    var uuid = Math.floor(10000000000000 * Math.random()) + Date.now()
    this.className = 'weex-ipt-' + uuid
    this.styleId = 'weex-style-' + uuid
    node.classList.add(this.className)
    node.setAttribute('type', this.type)
    node.type = this.type
    // For the consistency of input component's width.
    // The date and time type of input will have a bigger width
    // when the 'box-sizing' is not set to 'border-box'
    node.classList.add('weex-element')
    this.value && (node.value = this.value)
    this.placeholder && (node.placeholder = this.placeholder)
    return node
  }
  
  Input.prototype.updateStyle = function (style) {
    Atomic.prototype.updateStyle.call(this, style)
    if (style && style.placeholderColor) {
      this.placeholderColor = style.placeholderColor
      this.setPlaceholderColor()
    }
  }
  
  Input.prototype.attr = {
    disabled: function (val) {
      this.node.disabled = val && val !== 'false'
                      ? true
                      : false
    }
  }
  
  Input.prototype.setPlaceholderColor = function () {
    if (!this.placeholderColor) {
      return
    }
    var vendors = [
      '::-webkit-input-placeholder',
      ':-moz-placeholder',
      '::-moz-placeholder',
      ':-ms-input-placeholder',
      ':placeholder-shown'
    ]
    var css = ''
    var cssRule = 'color: ' + this.placeholderColor + ';'
    for (var i = 0, l = vendors.length; i < l; i++) {
      css += '.' + this.className + vendors[i] + '{'
             + cssRule + '}'
    }
    utils.appendStyle(css, this.styleId, true)
  }
  
  module.exports = Input


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(16)
  var sender = __webpack_require__(19)
  
  // attrs:
  //   - options: the options to be listed, as a array of strings.
  //   - selectedIndex: the selected options' index number.
  //   - disabled
  function Select (data) {
    var attrs = data.attr || {}
    this.options = []
    this.selectedIndex = 0
    Atomic.call(this, data)
  }
  
  Select.prototype = Object.create(Atomic.prototype)
  
  Select.prototype.create = function () {
    var node = document.createElement('select')
    var uuid = Math.floor(10000000000000 * Math.random()) + Date.now()
    this.className = 'weex-slct-' + uuid
    this.styleId = 'weex-style-' + uuid
    node.classList.add(this.className)
    // For the consistency of input component's width.
    // The date and time type of input will have a bigger width
    // when the 'box-sizing' is not set to 'border-box'
    node.style['box-sizing'] = 'border-box'
    return node
  }
  
  Select.prototype.attr = {
    disabled: function (val) {
      this.node.disabled = val && val !== 'false'
                      ? true
                      : false
    },
    options: function (val) {
      if (Object.prototype.toString.call(val) !== '[object Array]') {
        return
      }
      this.options = val
      this.node.innerHTML = ''
      this.createOptions(val)
    },
    selectedIndex: function (val) {
      val = parseInt(val)
      if (typeof val !== 'number' || val !== val || val >= this.options.length) {
        return
      }
      this.node.value = this.options[val]
    }
  }
  
  Select.prototype.bindEvents = function (evts) {
    var isListenToChange = false
    Atomic.prototype.bindEvents.call(
        this,
        evts.filter(function (val) {
          var pass = val !== 'change'
          !pass && (isListenToChange = true)
          return pass
        }))
    if (isListenToChange) {
      this.node.addEventListener('change', function (e) {
        e.index = this.options.indexOf(this.node.value)
        sender.fireEvent(this.data.ref, 'change', e)
      }.bind(this))
    }
  }
  
  Select.prototype.createOptions = function (opts) {
    var optDoc = document.createDocumentFragment()
    var opt
    for (var i = 0, l = opts.length; i < l; i++) {
      opt = document.createElement('option')
      opt.appendChild(document.createTextNode(opts[i]))
      optDoc.appendChild(opt)
    }
    this.node.appendChild(optDoc)
  }
  
  module.exports = Select


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(27)
  
  // attrs:
  //   - value
  //   - disabled
  function Datepicker (data) {
    Atomic.call(this, data)
  }
  
  Datepicker.prototype = Object.create(Atomic.prototype)
  
  Datepicker.prototype.create = function () {
    var node = document.createElement('input')
    var uuid = Math.floor(10000000000000 * Math.random()) + Date.now()
    this.className = 'weex-ipt-' + uuid
    this.styleId = 'weex-style-' + uuid
    node.classList.add(this.className)
    node.setAttribute('type', 'date')
    node.type = 'date'
    // For the consistency of input component's width.
    // The date and time type of input will have a bigger width
    // when the 'box-sizing' is not set to 'border-box'
    node.classList.add('weex-element')
    return node
  }
  
  Datepicker.prototype.attr = {
    disabled: function (val) {
      this.node.disabled = val && val !== 'false'
                      ? true
                      : false
    }
  }
  
  module.exports = Datepicker


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(27)
  
  // attrs:
  //   - value
  //   - disabled
  function Timepicker (data) {
    Atomic.call(this, data)
  }
  
  Timepicker.prototype = Object.create(Atomic.prototype)
  
  Timepicker.prototype.create = function () {
    var node = document.createElement('input')
    var uuid = Math.floor(10000000000000 * Math.random()) + Date.now()
    this.className = 'weex-ipt-' + uuid
    this.styleId = 'weex-style-' + uuid
    node.classList.add(this.className)
    node.setAttribute('type', 'time')
    node.type = 'time'
    // For the consistency of input component's width.
    // The date and time type of input will have a bigger width
    // when the 'box-sizing' is not set to 'border-box'
    node.classList.add('weex-element')
    return node
  }
  
  Timepicker.prototype.attr = {
    disabled: function (val) {
      this.node.disabled = val && val !== 'false'
                      ? true
                      : false
    }
  }
  
  module.exports = Timepicker


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(27)
  var utils = __webpack_require__(7)
  __webpack_require__(59)
  
  // attrs:
  //   - autoPlay: true | false (default: false)
  //   - playStatus: play | pause | stop
  //   - src: {string}
  //   - poster: {string}
  //   - loop: true | false (default: false)
  //   - muted: true | false (default: false)
  // events:
  //   - start
  //   - pause
  //   - finish
  //   - fail
  function Video (data) {
    var autoPlay = data.attr.autoPlay
    var playStatus = data.attr.playStatus
    this.autoPlay = autoPlay === true || autoPlay === 'true'
    if (playStatus !== 'play'
        && playStatus !== 'stop'
        && playStatus !== 'pause') {
      this.playStatus = 'pause'
    } else {
      this.playStatus = playStatus
    }
    Atomic.call(this, data)
  }
  
  Video.prototype = Object.create(Atomic.prototype)
  
  Video.prototype.attr = {
    playStatus: function (val) {
      if (val !== 'play' && val !== 'stop' && val !== 'pause') {
        val = 'pause'
      }
      if (this.playStatus === val) {
        return
      }
      this.playStatus = val
      this.node.setAttribute('play-status', val)
      this[this.playStatus]()
    },
    autoPlay: function (val) {
      // DO NOTHING
    }
  }
  
  Video.prototype.create = function () {
    var node = document.createElement('video')
    node.classList.add('weex-video', 'weex-element')
    node.controls = true
    node.autoplay = this.autoPlay
    node.setAttribute('play-status', this.playStatus)
    this.node = node
    if (this.autoPlay && this.playStatus === 'play') {
      this.play()
    }
    return node
  }
  
  Video.prototype.bindEvents = function (evts) {
    Atomic.prototype.bindEvents.call(this, evts)
  
    // convert w3c-video events to weex-video events.
    var evtsMap = {
      start: 'play',
      finish: 'ended',
      fail: 'error'
    }
    for (var evtName in evtsMap) {
      this.node.addEventListener(evtsMap[evtName], function (type, e) {
        this.dispatchEvent(type, e.data)
      }.bind(this, evtName))
    }
  }
  
  Video.prototype.play = function () {
    var src = this.node.getAttribute('src')
    if (!src) {
      src = this.node.getAttribute('data-src')
      src && this.node.setAttribute('src', src)
    }
    this.node.play()
  }
  
  Video.prototype.pause = function () {
    this.node.pause()
  }
  
  Video.prototype.stop = function () {
    this.node.pause()
    this.node.autoplay = false
    this.node.setAttribute('data-src', this.node.src)
    this.node.src = ''
  }
  
  module.exports = Video


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(60);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./video.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./video.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".weex-video {\n  background-color: #000; }\n", "", {"version":3,"sources":["/./src/src/styles/video.scss"],"names":[],"mappings":"AAAA;EACC,uBAAuB,EACvB","file":"video.scss","sourcesContent":[".weex-video {\n\tbackground-color: #000;\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Atomic = __webpack_require__(27)
  var utils = __webpack_require__(7)
  __webpack_require__(62)
  
  var defaults = {
    color: '#64bd63'
    , secondaryColor: '#dfdfdf'
    , jackColor: '#fff'
    , jackSecondaryColor: null
    , className: 'weex-switch'
    , disabledOpacity: 0.5
    , speed: '0.4s'
    , width: 100
    , height: 60
    // is width and height scalable ?
    , scalable: false
  }
  
  // attrs:
  //   - checked: if is checked.
  //   - disabled: if true, this component is not available for interaction.
  function Switch (data) {
    this.options = utils.extend({}, defaults)
    this.checked = data.attr.checked
        && data.attr.checked !== 'false' ? true : false
    this.data = data
    this.width = this.options.width * data.scale
    this.height = this.options.height * data.scale
    Atomic.call(this, data)
  }
  
  Switch.prototype = Object.create(Atomic.prototype)
  
  Switch.prototype.create = function () {
    var node = document.createElement('span')
    this.jack = document.createElement('small')
    node.appendChild(this.jack)
    node.className = this.options.className
    this.node = node
    this.attr.disabled.call(this, this.data.attr.disabled)
    return node
  }
  
  Switch.prototype.onAppend = function () {
    this.setSize()
    this.setPosition()
  }
  
  Switch.prototype.attr = {
    disabled: function (val) {
      this.disabled = val && val !== 'false'
                      ? true
                      : false
      this.disabled ? this.disable() : this.enable()
    }
  }
  
  Switch.prototype.setSize = function () {
    var min = Math.min(this.width, this.height)
    var max = Math.max(this.width, this.height)
    this.node.style.width = max + 'px'
    this.node.style.height = min + 'px'
    this.node.style.borderRadius = min / 2 + 'px'
    this.jack.style.width
        = this.jack.style.height
        = min + 'px'
  }
  
  Switch.prototype.setPosition = function (clicked) {
    var checked = this.checked
    var node = this.node
    var jack = this.jack
  
    if (clicked && checked) {
      checked = false
    } else if (clicked && !checked) {
      checked = true
    }
  
    if (checked === true) {
      this.checked = true
  
      if (window.getComputedStyle) {
        jack.style.left = parseInt(window.getComputedStyle(node).width)
                          - parseInt(window.getComputedStyle(jack).width) + 'px'
      } else {
        jack.style.left = parseInt(node.currentStyle['width'])
                          - parseInt(jack.currentStyle['width']) + 'px'
      }
  
      this.options.color && this.colorize()
      this.setSpeed()
    } else {
      this.checked = false
      jack.style.left = 0
      node.style.boxShadow = 'inset 0 0 0 0 ' + this.options.secondaryColor
      node.style.borderColor = this.options.secondaryColor
      node.style.backgroundColor
          = (this.options.secondaryColor !== defaults.secondaryColor)
            ? this.options.secondaryColor
            : '#fff'
      jack.style.backgroundColor
          = (this.options.jackSecondaryColor !== this.options.jackColor)
            ? this.options.jackSecondaryColor
            : this.options.jackColor
      this.setSpeed()
    }
  }
  
  Switch.prototype.colorize = function () {
    var nodeHeight = this.node.offsetHeight / 2
  
    this.node.style.backgroundColor = this.options.color
    this.node.style.borderColor = this.options.color
    this.node.style.boxShadow = 'inset 0 0 0 '
                                + nodeHeight
                                + 'px '
                                + this.options.color
    this.jack.style.backgroundColor = this.options.jackColor
  }
  
  Switch.prototype.setSpeed = function () {
    var switcherProp = {}
    var jackProp = {
        'background-color': this.options.speed
        , left: this.options.speed.replace(/[a-z]/, '') / 2 + 's'
      }
  
    if (this.checked) {
      switcherProp = {
        border: this.options.speed
        , 'box-shadow': this.options.speed
        , 'background-color': this.options.speed.replace(/[a-z]/, '') * 3 + 's'
      }
    } else {
      switcherProp = {
        border: this.options.speed
        , 'box-shadow': this.options.speed
      }
    }
  
    utils.transitionize(this.node, switcherProp)
    utils.transitionize(this.jack, jackProp)
  }
  
  Switch.prototype.disable = function () {
    !this.disabled && (this.disabled = true)
    this.node.style.opacity = defaults.disabledOpacity
    this.node.removeEventListener('click', this.getClickHandler())
  }
  
  Switch.prototype.enable = function () {
    this.disabled && (this.disabled = false)
    this.node.style.opacity = 1
    this.node.addEventListener('click', this.getClickHandler())
  }
  
  Switch.prototype.getClickHandler = function () {
    if (!this._clickHandler) {
      this._clickHandler = function () {
        // var parent = this.node.parentNode.tagName.toLowerCase()
        // var labelParent = (parent === 'label') ? false : true
        this.setPosition(true)
        this.dispatchEvent('change', {
          checked: this.checked
        })
      }.bind(this)
    }
    return this._clickHandler
  }
  
  Switch.prototype.style
      = utils.extend(Object.create(Atomic.prototype.style), {
  
        width: function (val) {
          if (!this.options.scalable) {
            return
          }
          val = parseFloat(val)
          if (val !== val || val < 0) { // NaN
            val = this.options.width
          }
          this.width = val * this.data.scale
          this.setSize()
        },
  
        height: function (val) {
          if (!this.options.scalable) {
            return
          }
          val = parseFloat(val)
          if (val !== val || val < 0) { // NaN
            val = this.options.height
          }
          this.height = val * this.data.scale
          this.setSize()
        }
  
      })
  
  module.exports = Switch


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(63);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./switch.scss", function() {
        var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/sass-loader/index.js?sourceMap!./switch.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, "/* switch defaults. */\n.weex-switch {\n  background-color: #fff;\n  border: 1px solid #dfdfdf;\n  cursor: pointer;\n  display: inline-block;\n  position: relative;\n  vertical-align: middle;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  box-sizing: content-box;\n  background-clip: content-box; }\n\n.weex-switch > small {\n  background: #fff;\n  border-radius: 100%;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\n  position: absolute;\n  top: 0; }\n", "", {"version":3,"sources":["/./src/src/styles/switch.scss"],"names":[],"mappings":"AAAA,sBAAsB;AAEtB;EACE,uBAAuB;EACvB,0BAA0B;EAC1B,gBAAgB;EAChB,sBAAsB;EACtB,mBAAmB;EACnB,uBAAuB;EAEvB,uBAAuB;EACvB,yBAAyB;EACzB,0BAA0B;EAC1B,sBAAsB;EACtB,kBAAkB;EAClB,wBAAwB;EACxB,6BAA6B,EAC9B;;AAED;EACE,iBAAiB;EACjB,oBAAoB;EACpB,yCAA0B;EAC1B,mBAAmB;EACnB,OAAO,EACR","file":"switch.scss","sourcesContent":["/* switch defaults. */\n\n.weex-switch {\n  background-color: #fff;\n  border: 1px solid #dfdfdf;\n  cursor: pointer;\n  display: inline-block;\n  position: relative;\n  vertical-align: middle;\n\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  box-sizing: content-box;\n  background-clip: content-box;\n}\n\n.weex-switch > small {\n  background: #fff;\n  border-radius: 100%;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\n  position: absolute;\n  top: 0;\n}\n"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Component = __webpack_require__(16)
  
  // attrs:
  //   - href
  function A (data) {
    Component.call(this, data)
  }
  
  A.prototype = Object.create(Component.prototype)
  
  A.prototype.create = function () {
    var node = document.createElement('a')
    node.classList.add('weex-container')
    this.node = node
    this.style.alignItems.call(this, 'center')
    this.style.justifyContent.call(this, 'center')
    this.node.style.textDecoration = 'none'
    return node
  }
  
  module.exports = A


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Component = __webpack_require__(16)
  var utils = __webpack_require__(7)
  
  var ID_PREFIX = 'weex_embed_'
  
  function _generateId() {
    return ID_PREFIX + utils.getRandom(10)
  }
  
  function Embed (data, nodeType) {
    var attr = data.attr
    if (attr) {
      this.source = attr.src
      this.loader = attr.loade || 'xhr'
    }
    Component.call(this, data, nodeType)
    this.initWeex()
  }
  
  Embed.prototype = Object.create(Component.prototype)
  
  Embed.prototype.create = function () {
  
    var node = document.createElement('div')
    node.id = this.id
    node.style.overflow = 'scroll'
    // node.classList.add('weex-container')
    return node
  }
  
  Embed.prototype.initWeex = function () {
    this.id = _generateId()
    this.node.id = this.id
    var config = {
      appId: this.id,
      source: this.source,
      loader: this.loader,
      width: this.node.getBoundingClientRect().width,
      rootId: this.id
    }
    window.weex.init(config)
  }
  
  Embed.prototype.destroyWeex = function () {
    this.id && window.destroyInstance(this.id)
    // TODO: unbind events and clear doms.
    this.node.innerHTML = ''
  }
  
  Embed.prototype.reloadWeex = function () {
    this.destroyWeex()
    this.initWeex()
  }
  
  // src is not updatable temporarily
  // Embed.prototype.attr = {
  //   src: function (value) {
  //     this.src = value
  //     this.reloadWeex()
  //   }
  // }
  
  module.exports = Embed


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

  var dom = __webpack_require__(67)
  var event = __webpack_require__(75)
  var pageInfo = __webpack_require__(76)
  var stream = __webpack_require__(77)
  var modal = __webpack_require__(78)
  var animation = __webpack_require__(95)
  
  var api = {
    init: function (Weex) {
      Weex.registerApiModule('dom', dom, dom._meta)
      Weex.registerApiModule('event', event, event._meta)
      Weex.registerApiModule('pageInfo', pageInfo, pageInfo._meta)
      Weex.registerApiModule('stream', stream, stream._meta)
      Weex.registerApiModule('modal', modal, modal._meta)
      Weex.registerApiModule('animation', animation, animation._meta)
    }
  }
  
  module.exports = api

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var messageQueue = __webpack_require__(48)
  var FrameUpdater = __webpack_require__(10)
  var Component = __webpack_require__(16)
  var scroll = __webpack_require__(68)
  var config = __webpack_require__(5)
  // var Weex = require('../weex')
  
  var dom = {
  
    /**
     * createBody: create root component
     * @param  {object} element
     *    container|listview|scrollview
     * @return {[type]}      [description]
     */
    createBody: function (element) {
      var componentManager = this.getComponentManager()
      element.scale = this.scale
      element.instanceId = componentManager.instanceId
      return componentManager.createBody(element)
    },
  
    addElement: function (parentRef, element, index) {
      var componentManager = this.getComponentManager()
      element.scale = this.scale
      element.instanceId = componentManager.instanceId
      return componentManager.addElement(parentRef, element, index)
    },
  
    removeElement: function (ref) {
      var componentManager = this.getComponentManager()
      return componentManager.removeElement(ref)
    },
  
    moveElement: function (ref, parentRef, index) {
      var componentManager = this.getComponentManager()
      return componentManager.moveElement(ref, parentRef, index)
    },
  
    addEvent: function (ref, type) {
      var componentManager = this.getComponentManager()
      return componentManager.addEvent(ref, type)
    },
  
    removeEvent: function (ref, type) {
      var componentManager = this.getComponentManager()
      return componentManager.removeEvent(ref, type)
    },
  
    /**
     * updateAttrs: update attributes of component
     * @param  {string} ref
     * @param  {obj} attr
     */
    updateAttrs: function (ref, attr) {
      var componentManager = this.getComponentManager()
      return componentManager.updateAttrs(ref, attr)
    },
  
    /**
     * updateStyle: udpate style of component
     * @param {string} ref
     * @param {obj} style
     */
    updateStyle: function (ref, style) {
      var componentManager = this.getComponentManager()
      return componentManager.updateStyle(ref, style)
    },
  
    createFinish: function () {
      // TODO
      // FrameUpdater.pause()
    },
  
    refreshFinish: function () {
      // TODO
    },
  
    /**
     * scrollToElement
     * @param  {string} ref
     * @param  {obj} options {offset:Number}
     *   ps: scroll-to has 'ease' and 'duration'(ms) as options.
     */
    scrollToElement: function (ref, options) {
      !options && (options = {})
      var componentManager = this.getComponentManager()
      var elem = componentManager.getElementByRef(ref)
      if (elem) {
        var offsetTop = elem.node.getBoundingClientRect().top
            + document.body.scrollTop
        var offset = (Number(options.offset) || 0) * this.scale
        var tween = scroll(0, offsetTop + offset, options)
        // tween.on('end', function () {
        // })
      }
    }
  
  }
  
  dom._meta = {
    dom: [{
      name: 'createBody',
      args: ['object']
    }, {
      name: 'addElement',
      args: ['string', 'object', 'number']
    }, {
      name: 'removeElement',
      args: ['string']
    }, {
      name: 'moveElement',
      args: ['string', 'string', 'number']
    }, {
      name: 'addEvent',
      args: ['string', 'string']
    }, {
      name: 'removeEvent',
      args: ['string', 'string']
    }, {
      name: 'updateAttrs',
      args: ['string', 'object']
    }, {
      name: 'updateStyle',
      args: ['string', 'object']
    }, {
      name: 'createFinish',
      args: []
    }, {
      name: 'refreshFinish',
      args: []
    }, {
      name: 'scrollToElement',
      args: ['string', 'object']
    }]
  }
  
  module.exports = dom


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Module dependencies.
   */
  
  var Tween = __webpack_require__(69);
  var raf = __webpack_require__(74);
  
  /**
   * Expose `scrollTo`.
   */
  
  module.exports = scrollTo;
  
  /**
   * Scroll to `(x, y)`.
   *
   * @param {Number} x
   * @param {Number} y
   * @api public
   */
  
  function scrollTo(x, y, options) {
    options = options || {};
  
    // start position
    var start = scroll();
  
    // setup tween
    var tween = Tween(start)
      .ease(options.ease || 'out-circ')
      .to({ top: y, left: x })
      .duration(options.duration || 1000);
  
    // scroll
    tween.update(function(o){
      window.scrollTo(o.left | 0, o.top | 0);
    });
  
    // handle end
    tween.on('end', function(){
      animate = function(){};
    });
  
    // animate
    function animate() {
      raf(animate);
      tween.update();
    }
  
    animate();
    
    return tween;
  }
  
  /**
   * Return scroll position.
   *
   * @return {Object}
   * @api private
   */
  
  function scroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var x = window.pageXOffset || document.documentElement.scrollLeft;
    return { top: y, left: x };
  }


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

  
  /**
   * Module dependencies.
   */
  
  var Emitter = __webpack_require__(70);
  var clone = __webpack_require__(71);
  var type = __webpack_require__(72);
  var ease = __webpack_require__(73);
  
  /**
   * Expose `Tween`.
   */
  
  module.exports = Tween;
  
  /**
   * Initialize a new `Tween` with `obj`.
   *
   * @param {Object|Array} obj
   * @api public
   */
  
  function Tween(obj) {
    if (!(this instanceof Tween)) return new Tween(obj);
    this._from = obj;
    this.ease('linear');
    this.duration(500);
  }
  
  /**
   * Mixin emitter.
   */
  
  Emitter(Tween.prototype);
  
  /**
   * Reset the tween.
   *
   * @api public
   */
  
  Tween.prototype.reset = function(){
    this.isArray = 'array' === type(this._from);
    this._curr = clone(this._from);
    this._done = false;
    this._start = Date.now();
    return this;
  };
  
  /**
   * Tween to `obj` and reset internal state.
   *
   *    tween.to({ x: 50, y: 100 })
   *
   * @param {Object|Array} obj
   * @return {Tween} self
   * @api public
   */
  
  Tween.prototype.to = function(obj){
    this.reset();
    this._to = obj;
    return this;
  };
  
  /**
   * Set duration to `ms` [500].
   *
   * @param {Number} ms
   * @return {Tween} self
   * @api public
   */
  
  Tween.prototype.duration = function(ms){
    this._duration = ms;
    return this;
  };
  
  /**
   * Set easing function to `fn`.
   *
   *    tween.ease('in-out-sine')
   *
   * @param {String|Function} fn
   * @return {Tween}
   * @api public
   */
  
  Tween.prototype.ease = function(fn){
    fn = 'function' == typeof fn ? fn : ease[fn];
    if (!fn) throw new TypeError('invalid easing function');
    this._ease = fn;
    return this;
  };
  
  /**
   * Stop the tween and immediately emit "stop" and "end".
   *
   * @return {Tween}
   * @api public
   */
  
  Tween.prototype.stop = function(){
    this.stopped = true;
    this._done = true;
    this.emit('stop');
    this.emit('end');
    return this;
  };
  
  /**
   * Perform a step.
   *
   * @return {Tween} self
   * @api private
   */
  
  Tween.prototype.step = function(){
    if (this._done) return;
  
    // duration
    var duration = this._duration;
    var now = Date.now();
    var delta = now - this._start;
    var done = delta >= duration;
  
    // complete
    if (done) {
      this._from = this._to;
      this._update(this._to);
      this._done = true;
      this.emit('end');
      return this;
    }
  
    // tween
    var from = this._from;
    var to = this._to;
    var curr = this._curr;
    var fn = this._ease;
    var p = (now - this._start) / duration;
    var n = fn(p);
  
    // array
    if (this.isArray) {
      for (var i = 0; i < from.length; ++i) {
        curr[i] = from[i] + (to[i] - from[i]) * n;
      }
  
      this._update(curr);
      return this;
    }
  
    // objech
    for (var k in from) {
      curr[k] = from[k] + (to[k] - from[k]) * n;
    }
  
    this._update(curr);
    return this;
  };
  
  /**
   * Set update function to `fn` or
   * when no argument is given this performs
   * a "step".
   *
   * @param {Function} fn
   * @return {Tween} self
   * @api public
   */
  
  Tween.prototype.update = function(fn){
    if (0 == arguments.length) return this.step();
    this._update = fn;
    return this;
  };

/***/ },
/* 70 */
/***/ function(module, exports) {

  
  /**
   * Expose `Emitter`.
   */
  
  module.exports = Emitter;
  
  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */
  
  function Emitter(obj) {
    if (obj) return mixin(obj);
  };
  
  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */
  
  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }
  
  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */
  
  Emitter.prototype.on =
  Emitter.prototype.addEventListener = function(event, fn){
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
      .push(fn);
    return this;
  };
  
  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */
  
  Emitter.prototype.once = function(event, fn){
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }
  
    on.fn = fn;
    this.on(event, on);
    return this;
  };
  
  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */
  
  Emitter.prototype.off =
  Emitter.prototype.removeListener =
  Emitter.prototype.removeAllListeners =
  Emitter.prototype.removeEventListener = function(event, fn){
    this._callbacks = this._callbacks || {};
  
    // all
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }
  
    // specific event
    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this;
  
    // remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    }
  
    // remove specific handler
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  };
  
  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */
  
  Emitter.prototype.emit = function(event){
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1)
      , callbacks = this._callbacks['$' + event];
  
    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }
  
    return this;
  };
  
  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */
  
  Emitter.prototype.listeners = function(event){
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };
  
  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */
  
  Emitter.prototype.hasListeners = function(event){
    return !! this.listeners(event).length;
  };


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Module dependencies.
   */
  
  var type;
  try {
    type = __webpack_require__(72);
  } catch (_) {
    type = __webpack_require__(72);
  }
  
  /**
   * Module exports.
   */
  
  module.exports = clone;
  
  /**
   * Clones objects.
   *
   * @param {Mixed} any object
   * @api public
   */
  
  function clone(obj){
    switch (type(obj)) {
      case 'object':
        var copy = {};
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            copy[key] = clone(obj[key]);
          }
        }
        return copy;
  
      case 'array':
        var copy = new Array(obj.length);
        for (var i = 0, l = obj.length; i < l; i++) {
          copy[i] = clone(obj[i]);
        }
        return copy;
  
      case 'regexp':
        // from millermedeiros/amd-utils - MIT
        var flags = '';
        flags += obj.multiline ? 'm' : '';
        flags += obj.global ? 'g' : '';
        flags += obj.ignoreCase ? 'i' : '';
        return new RegExp(obj.source, flags);
  
      case 'date':
        return new Date(obj.getTime());
  
      default: // string, number, boolean, …
        return obj;
    }
  }


/***/ },
/* 72 */
/***/ function(module, exports) {

  /**
   * toString ref.
   */
  
  var toString = Object.prototype.toString;
  
  /**
   * Return the type of `val`.
   *
   * @param {Mixed} val
   * @return {String}
   * @api public
   */
  
  module.exports = function(val){
    switch (toString.call(val)) {
      case '[object Date]': return 'date';
      case '[object RegExp]': return 'regexp';
      case '[object Arguments]': return 'arguments';
      case '[object Array]': return 'array';
      case '[object Error]': return 'error';
    }
  
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (val !== val) return 'nan';
    if (val && val.nodeType === 1) return 'element';
  
    val = val.valueOf
      ? val.valueOf()
      : Object.prototype.valueOf.apply(val)
  
    return typeof val;
  };


/***/ },
/* 73 */
/***/ function(module, exports) {

  
  // easing functions from "Tween.js"
  
  exports.linear = function(n){
    return n;
  };
  
  exports.inQuad = function(n){
    return n * n;
  };
  
  exports.outQuad = function(n){
    return n * (2 - n);
  };
  
  exports.inOutQuad = function(n){
    n *= 2;
    if (n < 1) return 0.5 * n * n;
    return - 0.5 * (--n * (n - 2) - 1);
  };
  
  exports.inCube = function(n){
    return n * n * n;
  };
  
  exports.outCube = function(n){
    return --n * n * n + 1;
  };
  
  exports.inOutCube = function(n){
    n *= 2;
    if (n < 1) return 0.5 * n * n * n;
    return 0.5 * ((n -= 2 ) * n * n + 2);
  };
  
  exports.inQuart = function(n){
    return n * n * n * n;
  };
  
  exports.outQuart = function(n){
    return 1 - (--n * n * n * n);
  };
  
  exports.inOutQuart = function(n){
    n *= 2;
    if (n < 1) return 0.5 * n * n * n * n;
    return -0.5 * ((n -= 2) * n * n * n - 2);
  };
  
  exports.inQuint = function(n){
    return n * n * n * n * n;
  }
  
  exports.outQuint = function(n){
    return --n * n * n * n * n + 1;
  }
  
  exports.inOutQuint = function(n){
    n *= 2;
    if (n < 1) return 0.5 * n * n * n * n * n;
    return 0.5 * ((n -= 2) * n * n * n * n + 2);
  };
  
  exports.inSine = function(n){
    return 1 - Math.cos(n * Math.PI / 2 );
  };
  
  exports.outSine = function(n){
    return Math.sin(n * Math.PI / 2);
  };
  
  exports.inOutSine = function(n){
    return .5 * (1 - Math.cos(Math.PI * n));
  };
  
  exports.inExpo = function(n){
    return 0 == n ? 0 : Math.pow(1024, n - 1);
  };
  
  exports.outExpo = function(n){
    return 1 == n ? n : 1 - Math.pow(2, -10 * n);
  };
  
  exports.inOutExpo = function(n){
    if (0 == n) return 0;
    if (1 == n) return 1;
    if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
    return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
  };
  
  exports.inCirc = function(n){
    return 1 - Math.sqrt(1 - n * n);
  };
  
  exports.outCirc = function(n){
    return Math.sqrt(1 - (--n * n));
  };
  
  exports.inOutCirc = function(n){
    n *= 2
    if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
    return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
  };
  
  exports.inBack = function(n){
    var s = 1.70158;
    return n * n * (( s + 1 ) * n - s);
  };
  
  exports.outBack = function(n){
    var s = 1.70158;
    return --n * n * ((s + 1) * n + s) + 1;
  };
  
  exports.inOutBack = function(n){
    var s = 1.70158 * 1.525;
    if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) );
    return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 );
  };
  
  exports.inBounce = function(n){
    return 1 - exports.outBounce(1 - n);
  };
  
  exports.outBounce = function(n){
    if ( n < ( 1 / 2.75 ) ) {
      return 7.5625 * n * n;
    } else if ( n < ( 2 / 2.75 ) ) {
      return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;
    } else if ( n < ( 2.5 / 2.75 ) ) {
      return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;
    } else {
      return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;
    }
  };
  
  exports.inOutBounce = function(n){
    if (n < .5) return exports.inBounce(n * 2) * .5;
    return exports.outBounce(n * 2 - 1) * .5 + .5;
  };
  
  // aliases
  
  exports['in-quad'] = exports.inQuad;
  exports['out-quad'] = exports.outQuad;
  exports['in-out-quad'] = exports.inOutQuad;
  exports['in-cube'] = exports.inCube;
  exports['out-cube'] = exports.outCube;
  exports['in-out-cube'] = exports.inOutCube;
  exports['in-quart'] = exports.inQuart;
  exports['out-quart'] = exports.outQuart;
  exports['in-out-quart'] = exports.inOutQuart;
  exports['in-quint'] = exports.inQuint;
  exports['out-quint'] = exports.outQuint;
  exports['in-out-quint'] = exports.inOutQuint;
  exports['in-sine'] = exports.inSine;
  exports['out-sine'] = exports.outSine;
  exports['in-out-sine'] = exports.inOutSine;
  exports['in-expo'] = exports.inExpo;
  exports['out-expo'] = exports.outExpo;
  exports['in-out-expo'] = exports.inOutExpo;
  exports['in-circ'] = exports.inCirc;
  exports['out-circ'] = exports.outCirc;
  exports['in-out-circ'] = exports.inOutCirc;
  exports['in-back'] = exports.inBack;
  exports['out-back'] = exports.outBack;
  exports['in-out-back'] = exports.inOutBack;
  exports['in-bounce'] = exports.inBounce;
  exports['out-bounce'] = exports.outBounce;
  exports['in-out-bounce'] = exports.inOutBounce;


/***/ },
/* 74 */
/***/ function(module, exports) {

  /**
   * Expose `requestAnimationFrame()`.
   */
  
  exports = module.exports = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || fallback;
  
  /**
   * Fallback implementation.
   */
  
  var prev = new Date().getTime();
  function fallback(fn) {
    var curr = new Date().getTime();
    var ms = Math.max(0, 16 - (curr - prev));
    var req = setTimeout(fn, ms);
    prev = curr;
    return req;
  }
  
  /**
   * Cancel.
   */
  
  var cancel = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.clearTimeout;
  
  exports.cancel = function(id){
    cancel.call(window, id);
  };


/***/ },
/* 75 */
/***/ function(module, exports) {

  'use strict'
  
  var event = {
    /**
     * openUrl
     * @param  {string} url
     */
    openURL: function (url) {
      location.href = url
    }
  
  }
  
  event._meta = {
    event: [{
      name: 'openURL',
      args: ['string']
    }]
  }
  
  module.exports = event

/***/ },
/* 76 */
/***/ function(module, exports) {

  'use strict'
  
  var pageInfo = {
  
    setTitle: function (title) {
      title = title || 'Weex HTML5'
      try {
        title = decodeURIComponent(title)
      } catch (e) {}
      document.title = title
    }
  }
  
  pageInfo._meta = {
    pageInfo: [{
      name: 'setTitle',
      args: ['string']
    }]
  }
  
  module.exports = pageInfo

/***/ },
/* 77 */
/***/ function(module, exports) {

  'use strict'
  
  // require('httpurl')
  
  // var jsonpCnt = 0
  
  // function _sendJsonp(config, callbackId) {
  //   var cbName = '_callback_' + (++jsonpCnt)
  //   var script, url, head
  //   global[cbName] = (function (cb) {
  //     return function (response) {
  //       this.sender.performCallback(callbackId, response)
  //       delete global[cb]
  //     }
  //   })(cbName)
  //   script = document.createElement('script')
  //   url = lib.httpurl(config.url)
  //   url.params.callback = cbName
  //   script.type = 'text/javascript'
  //   script.src = url.toString()
  //   // script.onerror is not working on IE or safari.
  //   // but they are not considered here.
  //   script.onerror = (function (cb) {
  //     return function (err) {
  //       this.sender.performCallback(callbackId, err)
  //       delete global[cb]
  //     }
  //   })(cbName)
  //   head = document.getElementsByTagName('head')[0]
  //   head.insertBefore(script, null)
  // }
  
  var stream = {
  
    /**
     * sendHttp
     * @param  {obj} params
     *  - method: 'GET' | 'POST',
     *  - url: url requested
     * @param  {string} callbackId
     */
    sendHttp: function (param, callbackId) {
      if (typeof param === 'string') {
        try {
          param = JSON.parse(param)
        } catch (e) {
          return
        }
      }
      if (typeof param !== 'object' || !param.url) {
        return
      }
  
      // Not to use jsonp to send http request since it requires the server
      // to support jsonp callback at the first place.
      // _sendJsonp.call(this, param, callbackId)
  
      var self = this
      var method = param.method || 'GET'
      var xhr = new XMLHttpRequest()
      xhr.open(method, param.url, true)
      xhr.onload = function () {
        self.sender.performCallback(callbackId, this.responseText)
      }
      xhr.onerror = function (error) {
        self.sender.performCallback(callbackId, error)
      }
      xhr.send()
    }
  
  }
  
  stream._meta = {
    stream: [{
      name: 'sendHttp',
      args: ['object', 'string']
    }]
  }
  
  module.exports = stream

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var sender = __webpack_require__(19)
  var modal = __webpack_require__(79)
  
  var msg = {
  
    // duration: default is 0.8 seconds.
    toast: function (config) {
      modal.toast(config.message, config.duration)
    },
  
    // config:
    //  - message: string
    //  - okTitle: title of ok button
    //  - callback
    alert: function (config, callbackId) {
      var sender =  this.sender
      config.callback = function () {
        sender.performCallback(callbackId)
      }
      modal.alert(config)
    },
  
    // config:
    //  - message: string
    //  - okTitle: title of ok button
    //  - cancelTitle: title of cancel button
    //  - callback
    confirm: function (config, callbackId) {
      var sender =  this.sender
      config.callback = function (val) {
        sender.performCallback(callbackId, val)
      }
      modal.confirm(config)
    },
  
    // config:
    //  - message: string
    //  - okTitle: title of ok button
    //  - cancelTitle: title of cancel button
    //  - callback
    prompt: function (config, callbackId) {
      var sender =  this.sender
      config.callback = function (val) {
        sender.performCallback(callbackId, val)
      }
      modal.prompt(config)
    }
  
  }
  
  msg._meta = {
    modal: [{
      name: 'toast',
      args: ['object']
    }, {
      name: 'alert',
      args: ['object', 'string']
    }, {
      name: 'confirm',
      args: ['object', 'string']
    }, {
      name: 'prompt',
      args: ['object', 'string']
    }]
  }
  
  module.exports = msg


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Alert = __webpack_require__(80)
  var Confirm = __webpack_require__(86)
  var Prompt = __webpack_require__(89)
  var toast = __webpack_require__(92)
  
  var modal = {
  
    toast: function (msg, duration) {
      toast.push(msg, duration)
    },
  
    alert: function (config) {
      new Alert(config).show()
    },
  
    prompt: function (config) {
      new Prompt(config).show()
    },
  
    confirm: function (config) {
      new Confirm(config).show()
    }
  
  }
  
  !window.lib && (window.lib = {})
  window.lib.modal = modal
  
  module.exports = modal

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Modal = __webpack_require__(81)
  __webpack_require__(84)
  
  var CONTENT_CLASS = 'content'
  var MSG_CLASS = 'content-msg'
  var BUTTON_GROUP_CLASS = 'btn-group'
  var BUTTON_CLASS = 'btn'
  
  function Alert(config) {
    this.msg = config.message || ''
    this.callback = config.callback
    this.okTitle = config.okTitle || 'OK'
    Modal.call(this)
    this.node.classList.add('amfe-alert')
  }
  
  Alert.prototype = Object.create(Modal.prototype)
  
  Alert.prototype.createNodeContent = function () {
    var content = document.createElement('div')
    content.classList.add(CONTENT_CLASS)
    this.node.appendChild(content)
  
    var msg = document.createElement('div')
    msg.classList.add(MSG_CLASS)
    msg.appendChild(document.createTextNode(this.msg))
    content.appendChild(msg)
  
    var buttonGroup = document.createElement('div')
    buttonGroup.classList.add(BUTTON_GROUP_CLASS)
    this.node.appendChild(buttonGroup)
    var button = document.createElement('div')
    button.classList.add(BUTTON_CLASS, 'alert-ok')
    button.appendChild(document.createTextNode(this.okTitle))
    buttonGroup.appendChild(button)
  }
  
  Alert.prototype.bindEvents = function () {
    Modal.prototype.bindEvents.call(this)
    var button = this.node.querySelector('.' + BUTTON_CLASS)
    button.addEventListener('click', function () {
      this.destroy()
      this.callback && this.callback()
    }.bind(this))
  }
  
  module.exports = Alert


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  __webpack_require__(82)
  
  // there will be only one instance of modal.
  var MODAL_WRAP_CLASS = 'amfe-modal-wrap'
  var MODAL_NODE_CLASS = 'amfe-modal-node'
  
  function Modal() {
    this.wrap = document.querySelector(MODAL_WRAP_CLASS)
    this.node = document.querySelector(MODAL_NODE_CLASS)
    if (!this.wrap) {
      this.createWrap()
    }
    if (!this.node) {
      this.createNode()
    }
    this.clearNode()
    this.createNodeContent()
    this.bindEvents()
  }
  
  Modal.prototype = {
  
    show: function () {
      this.wrap.style.display = 'block'
      this.node.classList.remove('hide')
    },
  
    destroy: function () {
      document.body.removeChild(this.wrap)
      document.body.removeChild(this.node)
      this.wrap = null
      this.node = null
    },
  
    createWrap: function () {
      this.wrap = document.createElement('div')
      this.wrap.className = MODAL_WRAP_CLASS
      document.body.appendChild(this.wrap)
    },
  
    createNode: function () {
      this.node = document.createElement('div')
      this.node.classList.add(MODAL_NODE_CLASS, 'hide')
      document.body.appendChild(this.node)
    },
  
    clearNode: function () {
      this.node.innerHTML = ''
    },
  
    createNodeContent: function () {
  
      // do nothing.
      // child classes can override this method.
    },
  
    bindEvents: function () {
      this.wrap.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
      })
    }
  }
  
  module.exports = Modal


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(83);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./modal.scss", function() {
        var newContent = require("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./modal.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".amfe-modal-wrap {\n  display: none;\n  position: fixed;\n  z-index: 999999999;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #000;\n  opacity: 0.5; }\n\n.amfe-modal-node {\n  position: fixed;\n  z-index: 9999999999;\n  top: 50%;\n  left: 50%;\n  width: 6.666667rem;\n  min-height: 2.666667rem;\n  border-radius: 0.066667rem;\n  -webkit-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%);\n  background-color: #fff; }\n  .amfe-modal-node.hide {\n    display: none; }\n  .amfe-modal-node .content {\n    width: 100%;\n    min-height: 1.866667rem;\n    box-sizing: border-box;\n    font-size: 0.32rem;\n    line-height: 0.426667rem;\n    padding: 0.213333rem;\n    border-bottom: 1px solid #ddd; }\n  .amfe-modal-node .btn-group {\n    width: 100%;\n    height: 0.8rem;\n    font-size: 0.373333rem;\n    text-align: center; }\n    .amfe-modal-node .btn-group .btn {\n      box-sizing: border-box;\n      height: 0.8rem;\n      line-height: 0.8rem; }\n", "", {"version":3,"sources":["/./node_modules/modals/node_modules/modals/styles/modal.scss"],"names":[],"mappings":"AAAA;EACE,cAAc;EACd,gBAAgB;EAChB,mBAAmB;EACnB,OAAO;EACP,QAAQ;EACR,YAAY;EACZ,aAAa;EACb,uBAAuB;EACvB,aAAa,EAEd;;AAED;EACE,gBAAgB;EAChB,oBAAoB;EACpB,SAAS;EACT,UAAU;EACV,mBAAmB;EACnB,wBAAwB;EACxB,2BAA2B;EAC3B,yCAA4B;EAC5B,iCAAoB;EACpB,uBAAuB,EA4BxB;EAtCD;IAaI,cACD,EAAC;EAdJ;IAiBI,YAAY;IACZ,wBAAwB;IACxB,uBAAuB;IACvB,mBAAmB;IACnB,yBAAyB;IACzB,qBAAqB;IACrB,8BAA8B,EAC/B;EAxBH;IA2BI,YAAY;IACZ,eAAe;IACf,uBAAuB;IACvB,mBAAmB,EAOpB;IArCH;MAiCM,uBAAuB;MACvB,eAAe;MACf,oBAAoB,EACrB","file":"modal.scss","sourcesContent":[".amfe-modal-wrap {\n  display: none;\n  position: fixed;\n  z-index: 999999999;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #000;\n  opacity: 0.5;\n\n}\n\n.amfe-modal-node {\n  position: fixed;\n  z-index: 9999999999;\n  top: 50%;\n  left: 50%;\n  width: 6.666667rem; // 500px\n  min-height: 2.666667rem; // 200px\n  border-radius: 0.066667rem; // 5px\n  -webkit-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n\n  &.hide {\n    display: none\n  }\n\n  .content {\n    width: 100%;\n    min-height: 1.866667rem; // 140px\n    box-sizing: border-box;\n    font-size: 0.32rem; // 24px\n    line-height: 0.426667rem; // 32px\n    padding: 0.213333rem; // 16px\n    border-bottom: 1px solid #ddd;\n  }\n\n  .btn-group {\n    width: 100%;\n    height: 0.8rem; // 60px\n    font-size: 0.373333rem; // 28px\n    text-align: center;\n\n    .btn {\n      box-sizing: border-box;\n      height: 0.8rem; // 60px\n      line-height: 0.8rem; // 60px\n    }\n  }\n}\n"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(85);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./alert.scss", function() {
        var newContent = require("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./alert.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".amfe-alert .amfe-alert-ok {\n  width: 100%; }\n", "", {"version":3,"sources":["/./node_modules/modals/node_modules/modals/styles/alert.scss"],"names":[],"mappings":"AAAA;EAGI,YAAY,EACb","file":"alert.scss","sourcesContent":[".amfe-alert {\n\n  .amfe-alert-ok {\n    width: 100%;\n  }\n}\n"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Modal = __webpack_require__(81)
  __webpack_require__(87)
  
  var CONTENT_CLASS = 'content'
  var MSG_CLASS = 'content-msg'
  var BUTTON_GROUP_CLASS = 'btn-group'
  var BUTTON_CLASS = 'btn'
  
  function Confirm(config) {
    this.msg = config.message || ''
    this.callback = config.callback
    this.okTitle = config.okTitle || 'OK'
    this.cancelTitle = config.cancelTitle || 'Cancel'
    Modal.call(this)
    this.node.classList.add('amfe-confirm')
  }
  
  Confirm.prototype = Object.create(Modal.prototype)
  
  Confirm.prototype.createNodeContent = function () {
    var content = document.createElement('div')
    content.classList.add(CONTENT_CLASS)
    this.node.appendChild(content)
  
    var msg = document.createElement('div')
    msg.classList.add(MSG_CLASS)
    msg.appendChild(document.createTextNode(this.msg))
    content.appendChild(msg)
  
    var buttonGroup = document.createElement('div')
    buttonGroup.classList.add(BUTTON_GROUP_CLASS)
    this.node.appendChild(buttonGroup)
    var btnOk = document.createElement('div')
    btnOk.appendChild(document.createTextNode(this.okTitle))
    btnOk.classList.add('btn-ok', BUTTON_CLASS)
    var btnCancel = document.createElement('div')
    btnCancel.appendChild(document.createTextNode(this.cancelTitle))
    btnCancel.classList.add('btn-cancel', BUTTON_CLASS)
    buttonGroup.appendChild(btnOk)
    buttonGroup.appendChild(btnCancel)
    this.node.appendChild(buttonGroup)
  }
  
  Confirm.prototype.bindEvents = function () {
    Modal.prototype.bindEvents.call(this)
    var btnOk = this.node.querySelector('.' + BUTTON_CLASS + '.btn-ok')
    var btnCancel = this.node.querySelector('.' + BUTTON_CLASS + '.btn-cancel')
    btnOk.addEventListener('click', function () {
      this.destroy()
      this.callback && this.callback(this.okTitle)
    }.bind(this))
    btnCancel.addEventListener('click', function () {
      this.destroy()
      this.callback && this.callback(this.cancelTitle)
    }.bind(this))
  }
  
  module.exports = Confirm


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(88);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./confirm.scss", function() {
        var newContent = require("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./confirm.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".amfe-confirm .btn-group .btn {\n  float: left;\n  width: 50%; }\n  .amfe-confirm .btn-group .btn.btn-ok {\n    border-right: 1px solid #ddd; }\n", "", {"version":3,"sources":["/./node_modules/modals/node_modules/modals/styles/confirm.scss"],"names":[],"mappings":"AAAA;EAKM,YAAY;EACZ,WAAW,EAKZ;EAXL;IASO,6BAA6B,EAC7B","file":"confirm.scss","sourcesContent":[".amfe-confirm {\n\n  .btn-group {\n\n    .btn {\n      float: left;\n      width: 50%;\n\n      &.btn-ok {\n      \tborder-right: 1px solid #ddd;\n      }\n    }\n  }\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Modal = __webpack_require__(81)
  __webpack_require__(90)
  
  var CONTENT_CLASS = 'content'
  var MSG_CLASS = 'content-msg'
  var BUTTON_GROUP_CLASS = 'btn-group'
  var BUTTON_CLASS = 'btn'
  var INPUT_WRAP_CLASS = 'input-wrap'
  var INPUT_CLASS = 'input'
  
  function Prompt(config) {
    this.msg = config.message || ''
    this.defaultMsg = config.default || ''
    this.callback = config.callback
    this.okTitle = config.okTitle || 'OK'
    this.cancelTitle = config.cancelTitle || 'Cancel'
    Modal.call(this)
    this.node.classList.add('amfe-prompt')
  }
  
  Prompt.prototype = Object.create(Modal.prototype)
  
  Prompt.prototype.createNodeContent = function () {
  
    var content = document.createElement('div')
    content.classList.add(CONTENT_CLASS)
    this.node.appendChild(content)
  
    var msg = document.createElement('div')
    msg.classList.add(MSG_CLASS)
    msg.appendChild(document.createTextNode(this.msg))
    content.appendChild(msg)
  
    var inputWrap = document.createElement('div')
    inputWrap.classList.add(INPUT_WRAP_CLASS)
    content.appendChild(inputWrap)
    var input = document.createElement('input')
    input.classList.add(INPUT_CLASS)
    input.type = 'text'
    input.autofocus = true
    input.placeholder = this.defaultMsg
    inputWrap.appendChild(input)
  
    var buttonGroup = document.createElement('div')
    buttonGroup.classList.add(BUTTON_GROUP_CLASS)
    var btnOk = document.createElement('div')
    btnOk.appendChild(document.createTextNode(this.okTitle))
    btnOk.classList.add('btn-ok', BUTTON_CLASS)
    var btnCancel = document.createElement('div')
    btnCancel.appendChild(document.createTextNode(this.cancelTitle))
    btnCancel.classList.add('btn-cancel', BUTTON_CLASS)
    buttonGroup.appendChild(btnOk)
    buttonGroup.appendChild(btnCancel)
    this.node.appendChild(buttonGroup)
  }
  
  Prompt.prototype.bindEvents = function () {
    Modal.prototype.bindEvents.call(this)
    var btnOk = this.node.querySelector('.' + BUTTON_CLASS + '.btn-ok')
    var btnCancel = this.node.querySelector('.' + BUTTON_CLASS + '.btn-cancel')
    var that = this
    btnOk.addEventListener('click', function () {
      var val = document.querySelector('input').value
      this.destroy()
      this.callback && this.callback({
        result: that.okTitle,
        data: val
      })
    }.bind(this))
    btnCancel.addEventListener('click', function () {
      var val = document.querySelector('input').value
      this.destroy()
      this.callback && this.callback({
        result: that.cancelTitle
      })
    }.bind(this))
  }
  
  module.exports = Prompt


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(91);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./prompt.scss", function() {
        var newContent = require("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./prompt.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".amfe-prompt .input-wrap {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 0.24rem 0.213333rem 0.213333rem;\n  height: 0.96rem; }\n  .amfe-prompt .input-wrap .input {\n    box-sizing: border-box;\n    width: 100%;\n    height: 0.56rem;\n    line-height: 0.56rem;\n    font-size: 0.32rem; }\n\n.amfe-prompt .btn-group .btn {\n  float: left;\n  width: 50%; }\n  .amfe-prompt .btn-group .btn.btn-ok {\n    border-right: 1px solid #ddd; }\n", "", {"version":3,"sources":["/./node_modules/modals/node_modules/modals/styles/prompt.scss"],"names":[],"mappings":"AAAA;EAGI,uBAAuB;EACvB,YAAY;EACZ,yCAAyC;EACzC,gBAAgB,EASjB;EAfH;IASM,uBAAuB;IACvB,YAAY;IACZ,gBAAgB;IAChB,qBAAqB;IACrB,mBAAmB,EACpB;;AAdL;EAoBM,YAAY;EACZ,WAAW,EAKZ;EA1BL;IAwBQ,6BAA6B,EAC9B","file":"prompt.scss","sourcesContent":[".amfe-prompt {\n\n  .input-wrap {\n    box-sizing: border-box;\n    width: 100%;\n    padding: 0.24rem 0.213333rem 0.213333rem; // 18px 16px 16px\n    height: 0.96rem; // 74px\n\n    .input {\n      box-sizing: border-box;\n      width: 100%;\n      height: 0.56rem; // 42px\n      line-height: 0.56rem; // 42px\n      font-size: 0.32rem; // 24px\n    }\n  }\n\n  .btn-group {\n\n    .btn {\n      float: left;\n      width: 50%;\n\n      &.btn-ok {\n        border-right: 1px solid #ddd;\n      }\n    }\n  }\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  __webpack_require__(93)
  
  var queue = []
  var timer
  var isProcessing = false
  var toastWin
  var TOAST_WIN_CLASS_NAME = 'amfe-toast'
  
  var DEFAULT_DURATION = 0.8
  
  function showToastWindow(msg, callback) {
    var handleTransitionEnd = function () {
      toastWin.removeEventListener('transitionend', handleTransitionEnd)
      callback && callback()
    }
    if (!toastWin) {
      toastWin = document.createElement('div')
      toastWin.classList.add(TOAST_WIN_CLASS_NAME, 'hide')
      document.body.appendChild(toastWin)
    }
    toastWin.innerHTML = msg
    toastWin.addEventListener('transitionend', handleTransitionEnd)
    setTimeout(function () {
      toastWin.classList.remove('hide')
    }, 0)
  }
  
  function hideToastWindow(callback) {
    var handleTransitionEnd = function () {
      toastWin.removeEventListener('transitionend', handleTransitionEnd)
      callback && callback()
    }
    if (!toastWin) {
      return
    }
    toastWin.addEventListener('transitionend', handleTransitionEnd)
    toastWin.classList.add('hide')
  }
  
  var toast = {
  
    push: function (msg, duration) {
      queue.push({
        msg: msg,
        duration: duration || DEFAULT_DURATION
      })
      this.show()
    },
  
    show: function () {
      var that = this
  
      // All messages had been toasted already, so remove the toast window,
      if (!queue.length) {
        toastWin && toastWin.parentNode.removeChild(toastWin)
        toastWin = null
        return
      }
  
      // the previous toast is not ended yet.
      if (isProcessing) {
        return
      }
      isProcessing = true
  
      var toastInfo = queue.shift()
      showToastWindow(toastInfo.msg, function () {
        timer = setTimeout(function () {
          timer = null
          hideToastWindow(function () {
            isProcessing = false
            that.show()
          })
        }, toastInfo.duration * 1000)
      })
    }
  
  }
  
  module.exports = {
    push: toast.push.bind(toast)
  }


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

  // style-loader: Adds some css to the DOM by adding a <style> tag
  
  // load the styles
  var content = __webpack_require__(94);
  if(typeof content === 'string') content = [[module.id, content, '']];
  // add the styles to the DOM
  var update = __webpack_require__(4)(content, {});
  if(content.locals) module.exports = content.locals;
  // Hot Module Replacement
  if(false) {
    // When the styles change, update the <style> tags
    if(!content.locals) {
      module.hot.accept("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./toast.scss", function() {
        var newContent = require("!!./../../css-loader/index.js?sourceMap!./../../sass-loader/index.js?sourceMap!./toast.scss");
        if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
        update(newContent);
      });
    }
    // When the module is disposed, remove the <style> tags
    module.hot.dispose(function() { update(); });
  }

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(3)();
  // imports
  
  
  // module
  exports.push([module.id, ".amfe-toast {\n  font-size: 0.32rem;\n  line-height: 0.426667rem;\n  position: fixed;\n  box-sizing: border-box;\n  max-width: 80%;\n  bottom: 2.666667rem;\n  left: 50%;\n  padding: 0.213333rem;\n  background-color: #000;\n  color: #fff;\n  text-align: center;\n  opacity: 0.6;\n  transition: all 0.4s ease-in-out;\n  border-radius: 0.066667rem;\n  -webkit-transform: translateX(-50%);\n  transform: translateX(-50%); }\n\n.amfe-toast.hide {\n  opacity: 0; }\n", "", {"version":3,"sources":["/./node_modules/modals/node_modules/modals/styles/toast.scss"],"names":[],"mappings":"AAAA;EACC,mBAAmB;EACnB,yBAAyB;EACzB,gBAAgB;EAChB,uBAAuB;EACvB,eAAe;EACf,oBAAoB;EACpB,UAAU;EACV,qBAAqB;EACrB,uBAAuB;EACvB,YAAY;EACZ,mBAAmB;EACnB,aAAa;EACb,iCAAiC;EACjC,2BAA2B;EAC3B,oCAA6B;EAC5B,4BAAqB,EACtB;;AAED;EACC,WAAW,EACX","file":"toast.scss","sourcesContent":[".amfe-toast {\n\tfont-size: 0.32rem; // 24px\n\tline-height: 0.426667rem; // 32px\n\tposition: fixed;\n\tbox-sizing: border-box;\n\tmax-width: 80%;\n\tbottom: 2.666667rem; // 200px\n\tleft: 50%;\n\tpadding: 0.213333rem; // 16px\n\tbackground-color: #000;\n\tcolor: #fff;\n\ttext-align: center;\n\topacity: 0.6;\n\ttransition: all 0.4s ease-in-out;\n\tborder-radius: 0.066667rem; // 5px\n\t-webkit-transform: translateX(-50%);\n  transform: translateX(-50%);\n}\n\n.amfe-toast.hide {\n\topacity: 0;\n}"],"sourceRoot":"webpack://"}]);
  
  // exports


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

  'use strict'
  
  var Sender = __webpack_require__(19)
  
  var _data = {}
  
  var animation = {
  
    /**
     * transition
     * @param  {string} ref        [description]
     * @param  {obj} config     [description]
     * @param  {string} callbackId [description]
     */
    transition: function (ref, config, callbackId) {
      var refData = _data[ref]
      var stylesKey = JSON.stringify(config.styles)
      var weexInstance = this
      // If the same component perform a animation with exactly the same
      // styles in a sequence with so short interval that the prev animation
      // is still in playing, then the next animation should be ignored.
      if (refData && refData[stylesKey]) {
        return
      }
      if (!refData) {
        refData = _data[ref] = {}
      }
      refData[stylesKey] = true
      return this.getComponentManager().transition(ref, config, function () {
        // Remove the stylesKey in refData so that the same animation
        // can be played again after current animation is already finished.
        delete refData[stylesKey]
        weexInstance.sender.performCallback(callbackId)
      })
    }
  
  }
  
  animation._meta = {
    animation: [{
      name: 'transition',
      args: ['string', 'object', 'string']
    }]
  }
  
  module.exports = animation


/***/ },
/* 96 */
/***/ function(module, exports) {

  (typeof window === 'undefined') && (window = {ctrl: {}, lib: {}});!window.ctrl && (window.ctrl = {});!window.lib && (window.lib = {});!function(a,b){function c(a){Object.defineProperty(this,"val",{value:a.toString(),enumerable:!0}),this.gt=function(a){return c.compare(this,a)>0},this.gte=function(a){return c.compare(this,a)>=0},this.lt=function(a){return c.compare(this,a)<0},this.lte=function(a){return c.compare(this,a)<=0},this.eq=function(a){return 0===c.compare(this,a)}}b.env=b.env||{},c.prototype.toString=function(){return this.val},c.prototype.valueOf=function(){for(var a=this.val.split("."),b=[],c=0;c<a.length;c++){var d=parseInt(a[c],10);isNaN(d)&&(d=0);var e=d.toString();e.length<5&&(e=Array(6-e.length).join("0")+e),b.push(e),1===b.length&&b.push(".")}return parseFloat(b.join(""))},c.compare=function(a,b){a=a.toString().split("."),b=b.toString().split(".");for(var c=0;c<a.length||c<b.length;c++){var d=parseInt(a[c],10),e=parseInt(b[c],10);if(window.isNaN(d)&&(d=0),window.isNaN(e)&&(e=0),e>d)return-1;if(d>e)return 1}return 0},b.version=function(a){return new c(a)}}(window,window.lib||(window.lib={})),function(a,b){b.env=b.env||{};var c=a.location.search.replace(/^\?/,"");if(b.env.params={},c)for(var d=c.split("&"),e=0;e<d.length;e++){d[e]=d[e].split("=");try{b.env.params[d[e][0]]=decodeURIComponent(d[e][1])}catch(f){b.env.params[d[e][0]]=d[e][1]}}}(window,window.lib||(window.lib={})),function(a,b){b.env=b.env||{};var c,d=a.navigator.userAgent;if(c=d.match(/Windows\sPhone\s(?:OS\s)?([\d\.]+)/))b.env.os={name:"Windows Phone",isWindowsPhone:!0,version:c[1]};else if(d.match(/Safari/)&&(c=d.match(/Android[\s\/]([\d\.]+)/)))b.env.os={version:c[1]},d.match(/Mobile\s+Safari/)?(b.env.os.name="Android",b.env.os.isAndroid=!0):(b.env.os.name="AndroidPad",b.env.os.isAndroidPad=!0);else if(c=d.match(/(iPhone|iPad|iPod)/)){var e=c[1];c=d.match(/OS ([\d_\.]+) like Mac OS X/),b.env.os={name:e,isIPhone:"iPhone"===e||"iPod"===e,isIPad:"iPad"===e,isIOS:!0,version:c[1].split("_").join(".")}}else b.env.os={name:"unknown",version:"0.0.0"};b.version&&(b.env.os.version=b.version(b.env.os.version))}(window,window.lib||(window.lib={})),function(a,b){b.env=b.env||{};var c,d=a.navigator.userAgent;(c=d.match(/(?:UCWEB|UCBrowser\/)([\d\.]+)/))?b.env.browser={name:"UC",isUC:!0,version:c[1]}:(c=d.match(/MQQBrowser\/([\d\.]+)/))?b.env.browser={name:"QQ",isQQ:!0,version:c[1]}:(c=d.match(/Firefox\/([\d\.]+)/))?b.env.browser={name:"Firefox",isFirefox:!0,version:c[1]}:(c=d.match(/MSIE\s([\d\.]+)/))||(c=d.match(/IEMobile\/([\d\.]+)/))?(b.env.browser={version:c[1]},d.match(/IEMobile/)?(b.env.browser.name="IEMobile",b.env.browser.isIEMobile=!0):(b.env.browser.name="IE",b.env.browser.isIE=!0),d.match(/Android|iPhone/)&&(b.env.browser.isIELikeWebkit=!0)):(c=d.match(/(?:Chrome|CriOS)\/([\d\.]+)/))?(b.env.browser={name:"Chrome",isChrome:!0,version:c[1]},d.match(/Version\/[\d+\.]+\s*Chrome/)&&(b.env.browser.name="Chrome Webview",b.env.browser.isWebview=!0)):d.match(/Safari/)&&(c=d.match(/Android[\s\/]([\d\.]+)/))?b.env.browser={name:"Android",isAndroid:!0,version:c[1]}:d.match(/iPhone|iPad|iPod/)?d.match(/Safari/)?(c=d.match(/Version\/([\d\.]+)/),b.env.browser={name:"Safari",isSafari:!0,version:c[1]}):(c=d.match(/OS ([\d_\.]+) like Mac OS X/),b.env.browser={name:"iOS Webview",isWebview:!0,version:c[1].replace(/\_/g,".")}):b.env.browser={name:"unknown",version:"0.0.0"},b.version&&(b.env.browser.version=b.version(b.env.browser.version))}(window,window.lib||(window.lib={})),function(a,b){b.env=b.env||{};var c=a.navigator.userAgent;c.match(/Weibo/i)?b.env.thirdapp={appname:"Weibo",isWeibo:!0}:c.match(/MicroMessenger/i)?b.env.thirdapp={appname:"Weixin",isWeixin:!0}:b.env.thirdapp=!1}(window,window.lib||(window.lib={})),function(a,b){b.env=b.env||{};var c,d,e=a.navigator.userAgent;(d=e.match(/WindVane[\/\s]([\d\.\_]+)/))&&(c=d[1]);var f=!1,g="",h="",i="";(d=e.match(/AliApp\(([A-Z\-]+)\/([\d\.]+)\)/i))&&(f=!0,g=d[1],i=d[2],h=g.indexOf("-PD")>0?b.env.os.isIOS?"iPad":b.env.os.isAndroid?"AndroidPad":b.env.os.name:b.env.os.name),!g&&e.indexOf("TBIOS")>0&&(g="TB"),f?b.env.aliapp={windvane:b.version(c||"0.0.0"),appname:g||"unkown",version:b.version(i||"0.0.0"),platform:h||b.env.os.name}:b.env.aliapp=!1,b.env.taobaoApp=b.env.aliapp}(window,window.lib||(window.lib={}));;module.exports = window.lib['env'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTZlMGFmY2M2NTc2OTAzNzZlNTQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dlZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy9iYXNlLnNjc3M/YzJlZSIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2Jhc2Uuc2NzcyIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZmlnLmpzIiwid2VicGFjazovLy8uL3NyYy9sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9wcm90b2NvbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZnJhbWVVcGRhdGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHBlYXJXYXRjaGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9sYXp5TG9hZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2xhenlpbWcvYnVpbGQvaW1nLmNvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2FwcGVhcmpzL2J1aWxkL2FwcGVhci5jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FuaW1hdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZsZXhib3guanMiLCJ3ZWJwYWNrOi8vLy4vfi9maXhlZHN0aWNreS9idWlsZC9zdGlja3kuY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9icmlkZ2Uvc2VuZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9icmlkZ2UvcmVjZWl2ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcm9vdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy9jb250YWluZXIuc2Nzcz9kNmI0Iiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvY29udGFpbmVyLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW1hZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXRvbWljLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3RleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2xpc3Quc2Nzcz9iZDk2Iiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvbGlzdC5zY3NzIiwid2VicGFjazovLy8uL34vc2Nyb2xsanMvYnVpbGQvc2Nyb2xsLmNvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2FuaW1hdGlvbmpzL2J1aWxkL2FuaW1hdGlvbi5jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9jdWJpY2Jlemllci9idWlsZC9jdWJpY2Jlemllci5jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9nZXN0dXJlanMvYnVpbGQvZ2VzdHVyZWpzLmNvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9+L21vdGlvbmpzL2J1aWxkL21vdGlvbi5jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY291bnRkb3duLmpzIiwid2VicGFjazovLy8uL34va291bnRkb3duL2J1aWxkL2NvdW50ZG93bi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9tYXJxdWVlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NsaWRlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NhcnJvdXNlbC9idWlsZC9jYXJyb3VzZWwuY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvc2xpZGVyLnNjc3M/NDM0YSIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3NsaWRlci5zY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2luZGljYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2luZGljYXRvci5zY3NzPzQ0NmYiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy9pbmRpY2F0b3Iuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy90YWJoZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lc3NhZ2VRdWV1ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3RhYmhlYWRlci5zY3NzP2Y1YTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy90YWJoZWFkZXIuc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zY3JvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3Njcm9sbGVyLnNjc3M/NjYzZCIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3Njcm9sbGVyLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvc2VsZWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2RhdGVwaWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdGltZXBpY2tlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy92aWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3ZpZGVvLnNjc3M/YjFmYSIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3ZpZGVvLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvc3dpdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvc3dpdGNoLnNjc3M/ZjY5OCIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3N3aXRjaC5zY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2EuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvZW1iZWQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwaS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBpL2RvbS5qcyIsIndlYnBhY2s6Ly8vLi9+L3Njcm9sbC10by9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvbXBvbmVudC10d2Vlbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vY29tcG9uZW50LWNsb25lL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vY29tcG9uZW50LXR5cGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9lYXNlLWNvbXBvbmVudC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvbXBvbmVudC1yYWYvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwaS9ldmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBpL3BhZ2VJbmZvLmpzIiwid2VicGFjazovLy8uL3NyYy9hcGkvc3RyZWFtLmpzIiwid2VicGFjazovLy8uL3NyYy9hcGkvbW9kYWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9tb2RhbHMvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vbW9kYWxzL3NyYy9hbGVydC5qcyIsIndlYnBhY2s6Ly8vLi9+L21vZGFscy9zcmMvbW9kYWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9tb2RhbHMvc3R5bGVzL21vZGFsLnNjc3M/ZGE0OCIsIndlYnBhY2s6Ly8vLi9+L21vZGFscy9zdHlsZXMvbW9kYWwuc2NzcyIsIndlYnBhY2s6Ly8vLi9+L21vZGFscy9zdHlsZXMvYWxlcnQuc2Nzcz81NzgyIiwid2VicGFjazovLy8uL34vbW9kYWxzL3N0eWxlcy9hbGVydC5zY3NzIiwid2VicGFjazovLy8uL34vbW9kYWxzL3NyYy9jb25maXJtLmpzIiwid2VicGFjazovLy8uL34vbW9kYWxzL3N0eWxlcy9jb25maXJtLnNjc3M/ZDY0YSIsIndlYnBhY2s6Ly8vLi9+L21vZGFscy9zdHlsZXMvY29uZmlybS5zY3NzIiwid2VicGFjazovLy8uL34vbW9kYWxzL3NyYy9wcm9tcHQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9tb2RhbHMvc3R5bGVzL3Byb21wdC5zY3NzPzdlMWMiLCJ3ZWJwYWNrOi8vLy4vfi9tb2RhbHMvc3R5bGVzL3Byb21wdC5zY3NzIiwid2VicGFjazovLy8uL34vbW9kYWxzL3NyYy90b2FzdC5qcyIsIndlYnBhY2s6Ly8vLi9+L21vZGFscy9zdHlsZXMvdG9hc3Quc2Nzcz9hNjBmIiwid2VicGFjazovLy8uL34vbW9kYWxzL3N0eWxlcy90b2FzdC5zY3NzIiwid2VicGFjazovLy8uL3NyYy9hcGkvYW5pbWF0aW9uLmpzIiwid2VicGFjazovLy8uL34vZW52ZC9idWlsZC9lbnZkLmNvbW1vbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUTs7QUFFUixJQUFHOztBQUVIO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7O0FDakdBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBc0MsT0FBTztBQUM3QztBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWU7O0FBRWY7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0gsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSCxFQUFDOztBQUVE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Q0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDaFpBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMvQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1B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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxnQ0FBK0IsT0FBTztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW1DLE9BQU87QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsVUFBUztBQUNU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d0I7Ozs7OztBQ25EQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCOzs7Ozs7QUM3Q0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUN4Q0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7QUNiQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFtRjtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLGlDQUFnQyxVQUFVLEVBQUU7QUFDNUMsRTs7Ozs7O0FDcEJBO0FBQ0E7OztBQUdBO0FBQ0EsNENBQTJDLDJCQUEyQix5QkFBeUIsMEJBQTBCLGtCQUFrQixpQ0FBaUMsbUNBQW1DLDJCQUEyQix1QkFBdUIsMEJBQTBCLGNBQWMsZUFBZSxFQUFFLG1CQUFtQiwyQkFBMkIsdUJBQXVCLEVBQUUsVUFBVSx1RkFBdUYsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsV0FBVyxnQkFBZ0IsS0FBSyxZQUFZLGdGQUFnRiwwQkFBMEIsd0JBQXdCLHlCQUF5QixpQkFBaUIsZ0NBQWdDLGtDQUFrQywwQkFBMEIsc0JBQXNCLHlCQUF5QixhQUFhLGdCQUFnQixtQkFBbUIsMkJBQTJCLHVCQUF1QixHQUFHLDZCQUE2Qjs7QUFFeGpDOzs7Ozs7O0FDUEE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDeERBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzVCQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXFDO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFtQztBQUNuQztBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHVCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOztBQUVEOzs7Ozs7O0FDdkZBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0wsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUCxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUs7O0FBRUw7Ozs7Ozs7QUMxTUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBbUY7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxpQ0FBZ0MsVUFB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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDektBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDakNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWMsT0FBTztBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtB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LGlCQUFpQixnQkFBZ0IsZ0NBQWdDLG1EQUFtRCx3QkFBd0IsZ09BQWdPLDJHQUEyRyw4Q0FBOEMsa0NBQWtDLElBQUksbUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDk2ZTBhZmNjNjU3NjkwMzc2ZTU0XG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnJlcXVpcmUoJy4vc3R5bGVzL2Jhc2Uuc2NzcycpXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG52YXIgTG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXInKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXG52YXIgcHJvdG9jb2wgPSByZXF1aXJlKCcuL3Byb3RvY29sJylcbnZhciBDb21wb25lbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9jb21wb25lbnRNYW5hZ2VyJylcbnZhciBDb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY29tcG9uZW50JylcbnZhciBTZW5kZXIgPSByZXF1aXJlKCcuL2JyaWRnZS9zZW5kZXInKVxudmFyIHJlY2VpdmVyID0gcmVxdWlyZSgnLi9icmlkZ2UvcmVjZWl2ZXInKVxuXG4vLyBDb21wb25lbnRzIGFuZCBhcGlzLlxudmFyIGNvbXBvbmVudHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMnKVxudmFyIGFwaSA9IHJlcXVpcmUoJy4vYXBpJylcbnJlcXVpcmUoJ2VudmQnKVxuXG52YXIgV0VBUFBfU1RZTEVfSUQgPSAnd2VhcHAtc3R5bGUnXG5cbnZhciBERUZBVUxUX0RFU0lHTl9XSURUSCA9IDc1MFxudmFyIERFRkFVTFRfUk9PVF9JRCA9ICd3ZWV4J1xudmFyIERFRkFVTFRfSlNPTl9DQUxMQkFDS19OQU1FID0gJ3dlZXhKc29ucENhbGxiYWNrJ1xuXG4vLyBjb25maWcuc2NhbGUgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIERFRkFVTFRfREVTSUdOX1dJRFRIXG5cbndpbmRvdy5XWEVudmlyb25tZW50ID0ge1xuICB3ZWV4VmVyc2lvbjogY29uZmlnLndlZXhWZXJzaW9uLFxuICBhcHBOYW1lOiBsaWIuZW52LmFsaWFwcCA/IGxpYi5lbnYuYWxpYXBwLmFwcG5hbWUgOiBudWxsLFxuICBhcHBWZXJzaW9uOiBsaWIuZW52LmFsaWFwcCA/IGxpYi5lbnYuYWxpYXBwLnZlcnNpb24udmFsIDogbnVsbCxcbiAgcGxhdGZvcm06IGxpYi5lbnYub3MgPyBsaWIuZW52Lm9zLm5hbWUgOiBudWxsLFxuICBvc1ZlcnNpb246IGxpYi5lbnYub3MgPyBsaWIuZW52Lm9zLnZlcnNpb24udmFsIDogbnVsbCxcbiAgZGV2aWNlSGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgLyBjb25maWcuc2NhbGVcbn1cblxudmFyIF9pbnN0YW5jZU1hcCA9IHt9XG5cbmZ1bmN0aW9uIFdlZXgob3B0aW9ucykge1xuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBXZWV4KSkge1xuICAgIHJldHVybiBuZXcgV2VleChvcHRpb25zKVxuICB9XG5cbiAgLy8gV2lkdGggb2YgdGhlIHJvb3QgY29udGFpbmVyLiBEZWZhdWx0IGlzIHdpbmRvdy5pbm5lcldpZHRoLlxuICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aFxuICB0aGlzLmJ1bmRsZVVybCA9IG9wdGlvbnMuYnVuZGxlVXJsIHx8IGxvY2F0aW9uLmhyZWZcbiAgdGhpcy5pbnN0YW5jZUlkID0gb3B0aW9ucy5hcHBJZFxuICB0aGlzLnJvb3RJZCA9IG9wdGlvbnMucm9vdElkIHx8IChERUZBVUxUX1JPT1RfSUQgKyB1dGlscy5nZXRSYW5kb20oMTApKVxuICB0aGlzLmRlc2lnbldpZHRoID0gb3B0aW9ucy5kZXNpZ25XaWR0aCB8fCBERUZBVUxUX0RFU0lHTl9XSURUSFxuICB0aGlzLmpzb25wQ2FsbGJhY2sgPSBvcHRpb25zLmpzb25wQ2FsbGJhY2sgfHwgREVGQVVMVF9KU09OX0NBTExCQUNLX05BTUVcbiAgdGhpcy5zb3VyY2UgPSBvcHRpb25zLnNvdXJjZVxuICB0aGlzLmxvYWRlciA9IG9wdGlvbnMubG9hZGVyXG5cbiAgdGhpcy5kYXRhID0gb3B0aW9ucy5kYXRhXG5cbiAgdGhpcy5pbml0U2NhbGUoKVxuICB0aGlzLmluaXRDb21wb25lbnRNYW5hZ2VyKClcbiAgdGhpcy5pbml0QnJpZGdlKClcbiAgV2VleC5hZGRJbnN0YW5jZSh0aGlzKVxuXG4gIHByb3RvY29sLmluamVjdFdlZXhJbnN0YW5jZSh0aGlzKVxuXG4gIHRoaXMubG9hZEJ1bmRsZShmdW5jdGlvbiAoZXJyLCBhcHBDb2RlKSB7XG4gICAgaWYgKCFlcnIpIHtcbiAgICAgIHRoaXMuY3JlYXRlQXBwKGNvbmZpZywgYXBwQ29kZSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignbG9hZCBidW5kbGUgZXJyOicsIGVycilcbiAgICB9XG4gIH0uYmluZCh0aGlzKSlcblxufVxuXG5XZWV4LmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAodXRpbHMuaXNBcnJheShvcHRpb25zKSkge1xuICAgIG9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICBuZXcgV2VleChjb25maWcpXG4gICAgfSlcbiAgfSBlbHNlIGlmIChcbiAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvcHRpb25zKS5zbGljZSg4LCAtMSkgPT09ICdPYmplY3QnXG4gICAgKSB7XG4gICAgbmV3IFdlZXgob3B0aW9ucylcbiAgfVxufVxuXG5XZWV4LmFkZEluc3RhbmNlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIF9pbnN0YW5jZU1hcFtpbnN0YW5jZS5pbnN0YW5jZUlkXSA9IGluc3RhbmNlXG59XG5cbldlZXguZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoaW5zdGFuY2VJZCkge1xuICByZXR1cm4gX2luc3RhbmNlTWFwW2luc3RhbmNlSWRdXG59XG5cbldlZXgucHJvdG90eXBlID0ge1xuXG4gIGluaXRCcmlkZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICByZWNlaXZlci5pbml0KHRoaXMpXG4gICAgdGhpcy5zZW5kZXIgPSBuZXcgU2VuZGVyKHRoaXMpXG4gIH0sXG5cbiAgbG9hZEJ1bmRsZTogZnVuY3Rpb24gKGNiKSB7XG4gICAgTG9hZGVyLmxvYWQoe1xuICAgICAganNvbnBDYWxsYmFjazogdGhpcy5qc29ucENhbGxiYWNrLFxuICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgIGxvYWRlcjogdGhpcy5sb2FkZXJcbiAgICB9LCBjYilcbiAgfSxcblxuICBjcmVhdGVBcHA6IGZ1bmN0aW9uIChjb25maWcsIGFwcENvZGUpIHtcbiAgICB2YXIgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdGhpcy5yb290SWQpXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIHJvb3QuaWQgPSB0aGlzLnJvb3RJZFxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyb290KVxuICAgIH1cblxuICAgIHZhciBwcm9taXNlID0gd2luZG93LmNyZWF0ZUluc3RhbmNlKFxuICAgICAgdGhpcy5pbnN0YW5jZUlkXG4gICAgICAsIGFwcENvZGVcbiAgICAgICwge1xuICAgICAgICBidW5kbGVVcmw6IHRoaXMuYnVuZGxlVXJsLFxuICAgICAgICBkZWJ1ZzogY29uZmlnLmRlYnVnXG4gICAgICB9XG4gICAgICAsIHRoaXMuZGF0YVxuICAgIClcblxuICAgIGlmIChQcm9taXNlICYmIHByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBXZWV4Ll9pbnN0YW5jZXNbdGhpcy5pbnN0YW5jZUlkXSA9IHRoaXMucm9vdFxuICAgICAgfS5iaW5kKHRoaXMpKS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgJiYgY29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gRG8gbm90IGRlc3Ryb3kgaW5zdGFuY2UgaGVyZSwgYmVjYXVzZSBpbiBtb3N0IGJyb3dzZXJcbiAgICAvLyBwcmVzcyBiYWNrIGJ1dHRvbiB0byBiYWNrIHRvIHRoaXMgcGFnZSB3aWxsIG5vdCByZWZyZXNoXG4gICAgLy8gdGhlIHdpbmRvdyBhbmQgdGhlIGluc3RhbmNlIHdpbGwgbm90IGJlIHJlY3JlYXRlZCB0aGVuLlxuICAgIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBmdW5jdGlvbiAoZSkge1xuICAgIC8vIH0pXG5cbiAgfSxcblxuICBpbml0U2NhbGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNjYWxlID0gdGhpcy53aWR0aCAvIHRoaXMuZGVzaWduV2lkdGhcbiAgfSxcblxuICBpbml0Q29tcG9uZW50TWFuYWdlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2NvbXBvbmVudE1hbmFnZXIgPSBuZXcgQ29tcG9uZW50TWFuYWdlcih0aGlzKVxuICB9LFxuXG4gIGdldENvbXBvbmVudE1hbmFnZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50TWFuYWdlclxuICB9XG59XG5cbldlZXguYXBwZW5kU3R5bGUgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIHV0aWxzLmFwcGVuZFN0eWxlKGNzcywgV0VBUFBfU1RZTEVfSUQpXG59LFxuXG4vLyBSZWdpc3RlciBhIG5ldyBjb21wb25lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUuXG5XZWV4LnJlZ2lzdGVyQ29tcG9uZW50ID0gZnVuY3Rpb24gKG5hbWUsIGNvbXApIHtcbiAgQ29tcG9uZW50TWFuYWdlci5yZWdpc3RlckNvbXBvbmVudChuYW1lLCBjb21wKVxufSxcblxuLy8gUmVnaXN0ZXIgYSBuZXcgYXBpIG1vZHVsZS5cbi8vIElmIHRoZSBtb2R1bGUgYWxyZWFkeSBleGlzdHMsIGp1c3QgYWRkIG1ldGhvZHMgZnJvbSB0aGVcbi8vIG5ldyBtb2R1bGUgdG8gdGhlIG9sZCBvbmUuXG5XZWV4LnJlZ2lzdGVyQXBpTW9kdWxlID0gZnVuY3Rpb24gKG5hbWUsIG1vZHVsZSwgbWV0YSkge1xuICBpZiAoIXByb3RvY29sLmFwaU1vZHVsZVtuYW1lXSkge1xuICAgIHByb3RvY29sLmFwaU1vZHVsZVtuYW1lXSA9IG1vZHVsZVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGtleSBpbiBtb2R1bGUpIHtcbiAgICAgIGlmIChtb2R1bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBwcm90b2NvbC5hcGlNb2R1bGVbbmFtZV1ba2V5XSA9IG1vZHVsZVtrZXldXG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIHJlZ2lzdGVyIEFQSSBtb2R1bGUncyBtZXRhIGluZm8gdG8ganNmcmFtZXdvcmtcbiAgaWYgKG1ldGEpIHtcbiAgICBwcm90b2NvbC5zZXRBcGlNb2R1bGVNZXRhKG1ldGEpXG4gICAgd2luZG93LnJlZ2lzdGVyTW9kdWxlcyhwcm90b2NvbC5nZXRBcGlNb2R1bGVNZXRhKG5hbWUpLCB0cnVlKVxuICB9XG59LFxuXG4vLyBSZWdpc3RlciBhIG5ldyBhcGkgbWV0aG9kIGZvciB0aGUgc3BlY2lmaWVkIG1vZHVsZS5cbi8vIG9wdHM6XG4vLyAgLSBhcmdzOiB0eXBlIG9mIGFyZ3VtZW50cyB0aGUgQVBJIG1ldGhvZCB0YWtlcyBzdWNoXG4vLyAgICBhcyBbJ3N0cmluZycsICdmdW5jdGlvbiddXG5XZWV4LnJlZ2lzdGVyQXBpID0gZnVuY3Rpb24gKG1vZHVsZU5hbWUsIG5hbWUsIG1ldGhvZCwgYXJncykge1xuICBpZiAodHlwZW9mIG1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVyblxuICB9XG4gIGlmICghcHJvdG9jb2wuYXBpTW9kdWxlW21vZHVsZU5hbWVdKSB7XG4gICAgcHJvdG9jb2wuYXBpTW9kdWxlW21vZHVsZU5hbWVdID0ge31cbiAgICBwcm90b2NvbC5fbWV0YVttb2R1bGVOYW1lXSA9IFtdXG4gIH1cbiAgcHJvdG9jb2wuYXBpTW9kdWxlW21vZHVsZU5hbWVdW25hbWVdID0gbWV0aG9kXG4gIGlmICghYXJncykge1xuICAgIHJldHVyblxuICB9XG4gIC8vIHJlZ2lzdGVyIEFQSSBtZXRhIGluZm8gdG8ganNmcmFtZXdvcmtcbiAgcHJvdG9jb2wuc2V0QXBpTWV0YShtb2R1bGVOYW1lLCB7XG4gICAgbmFtZTogbmFtZSxcbiAgICBhcmdzOiBhcmdzXG4gIH0pXG4gIHdpbmRvdy5yZWdpc3Rlck1vZHVsZXMocHJvdG9jb2wuZ2V0QXBpTW9kdWxlTWV0YShtb2R1bGVOYW1lLCBtZXRhKSwgdHJ1ZSlcbn0sXG5cbi8vIFJlZ2lzdGVyIGEgbmV3IHdlZXgtYnVuZGxlLWxvYWRlci5cbldlZXgucmVnaXN0ZXJMb2FkZXIgPSBmdW5jdGlvbiAobmFtZSwgbG9hZGVyRnVuYykge1xuICBMb2FkZXIucmVnaXN0ZXJMb2FkZXIobmFtZSwgbG9hZGVyRnVuYylcbn1cblxuLy8gVG8gaW5zdGFsbCBjb21wb25lbnRzIGFuZCBwbHVnaW5zLlxuV2VleC5pbnN0YWxsID0gZnVuY3Rpb24gKG1vZCkge1xuICBtb2QuaW5pdChXZWV4KVxufVxuXG5XZWV4LnN0b3BUaGVXb3JsZCA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgaW5zdGFuY2VJZCBpbiBfaW5zdGFuY2VNYXApIHtcbiAgICBpZiAoX2luc3RhbmNlTWFwLmhhc093blByb3BlcnR5KGluc3RhbmNlSWQpKSB7XG4gICAgICB3aW5kb3cuZGVzdHJveUluc3RhbmNlKGluc3RhbmNlSWQpXG4gICAgfVxuICB9XG59XG5cbihmdW5jdGlvbiBzdGFydFJlZnJlc2hDb250cm9sbGVyKCkge1xuICBpZiAobG9jYXRpb24uc2VhcmNoLmluZGV4T2YoJ2hvdC1yZWxvYWRfY29udHJvbGxlcicpID09PSAtMSkgIHtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAoIXdpbmRvdy5XZWJTb2NrZXQpIHtcbiAgICBjb25zb2xlLmluZm8oJ2F1dG8gcmVmcmVzaCBuZWVkIFdlYlNvY2tldCBzdXBwb3J0JylcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgaG9zdCA9IGxvY2F0aW9uLmhvc3RuYW1lXG4gIHZhciBwb3J0ID0gODA4MlxuICB2YXIgY2xpZW50ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly8nICsgaG9zdCArICc6JyArIHBvcnQgKyAnLycsXG4gICAgJ2VjaG8tcHJvdG9jb2wnXG4gIClcbiAgY2xpZW50Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ3JlZnJlc2ggY29udHJvbGxlciB3ZWJzb2NrZXQgY29ubmVjdGlvbiBlcnJvcicpXG4gIH1cbiAgY2xpZW50Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2coJ1JlY2VpdmVkOiBcXCcnICsgZS5kYXRhICsgJ1xcJycpXG4gICAgaWYgKGUuZGF0YSAgPT09ICdyZWZyZXNoJykge1xuICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICB9XG4gIH1cbn0oKSlcblxuLy8gV2VleC5pbnN0YWxsKHJlcXVpcmUoJ3dlZXgtY29tcG9uZW50cycpKVxuV2VleC5pbnN0YWxsKGNvbXBvbmVudHMpXG5XZWV4Lmluc3RhbGwoYXBpKVxuXG5XZWV4LkNvbXBvbmVudCA9IENvbXBvbmVudFxuV2VleC5Db21wb25lbnRNYW5hZ2VyID0gQ29tcG9uZW50TWFuYWdlclxuV2VleC51dGlscyA9IHV0aWxzXG5XZWV4LmNvbmZpZyA9IGNvbmZpZ1xuXG5nbG9iYWwud2VleCA9IFdlZXhcbm1vZHVsZS5leHBvcnRzID0gV2VleFxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy93ZWV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL2Jhc2Uuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL2Jhc2Uuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vYmFzZS5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3N0eWxlcy9iYXNlLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIioge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIHRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7IH1cXG5cXG51bCwgb2wge1xcbiAgbGlzdC1zdHlsZTogbm9uZTsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvc3JjL3N0eWxlcy9iYXNlLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxVQUFTO0VBQ1QsV0FBVTtFQUNWLHVCQUNELEVBQUM7O0FBQ0Y7RUFDRSxpQkFDRCxFQUFDXCIsXCJmaWxlXCI6XCJiYXNlLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxuICBtYXJnaW46MDtcXG4gIHBhZGRpbmc6MDtcXG4gIHRleHQtc2l6ZS1hZGp1c3Q6bm9uZVxcbn1cXG51bCxvbCB7XFxuICBsaXN0LXN0eWxlOm5vbmVcXG59XCJdLFwic291cmNlUm9vdFwiOlwid2VicGFjazovL1wifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vc2Fzcy1sb2FkZXI/c291cmNlTWFwIS4vc3JjL3N0eWxlcy9iYXNlLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcclxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcclxuXHRcdHZhciBtZW1vO1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdFx0cmV0dXJuIG1lbW87XHJcblx0XHR9O1xyXG5cdH0sXHJcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gL21zaWUgWzYtOV1cXGIvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XHJcblx0fSksXHJcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuXHR9KSxcclxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcclxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcclxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XHJcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XHJcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcclxuXHR9XHJcblxyXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxyXG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcclxuXHJcblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIDxoZWFkPi5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xyXG5cclxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xyXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xyXG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcclxuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xyXG5cdFx0fVxyXG5cdFx0aWYobmV3TGlzdCkge1xyXG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xyXG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XHJcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcclxuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXHJcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xyXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcclxuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xyXG5cdFx0aWYoZG9tU3R5bGUpIHtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XHJcblx0dmFyIHN0eWxlcyA9IFtdO1xyXG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xyXG5cdFx0dmFyIGlkID0gaXRlbVswXTtcclxuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xyXG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcclxuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xyXG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xyXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXHJcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcclxuXHR9XHJcblx0cmV0dXJuIHN0eWxlcztcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xyXG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcclxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcclxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xyXG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcclxuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xyXG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcclxuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xyXG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XHJcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcclxuXHRpZihpZHggPj0gMCkge1xyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcblx0c3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XHJcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xyXG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xyXG5cdGxpbmtFbGVtZW50LnJlbCA9IFwic3R5bGVzaGVldFwiO1xyXG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XHJcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcclxuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcclxuXHJcblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XHJcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcclxuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xyXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xyXG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XHJcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcclxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxyXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXHJcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XHJcblx0XHR9O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcclxuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHR1cGRhdGUob2JqKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xyXG5cdFx0aWYobmV3T2JqKSB7XHJcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmVtb3ZlKCk7XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgdGV4dFN0b3JlID0gW107XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XHJcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XHJcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xyXG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcclxuXHJcblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcclxuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XHJcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IG9iai5jc3M7XHJcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xyXG5cclxuXHRpZihtZWRpYSkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxyXG5cdH1cclxuXHJcblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XHJcblx0fSBlbHNlIHtcclxuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcblx0XHR9XHJcblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcclxuXHJcblx0aWYoc291cmNlTWFwKSB7XHJcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxyXG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xyXG5cdH1cclxuXHJcblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XHJcblxyXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xyXG5cclxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuXHJcblx0aWYob2xkU3JjKVxyXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xyXG59XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHtcblxuICB3ZWV4VmVyc2lvbjogJzEuNC4wJyxcblxuICBkZWJ1ZzogdHJ1ZVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb25maWcuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gbG9hZEJ5WEhSKGNvbmZpZywgY2FsbGJhY2spIHtcbiAgaWYgKCFjb25maWcuc291cmNlKSB7XG4gICAgY2FsbGJhY2sobmV3IEVycm9yKCd4aHIgbG9hZGVyOiBtaXNzaW5nIGNvbmZpZy5zb3VyY2UuJykpXG4gIH1cbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gIHhoci5vcGVuKCdHRVQnLCBjb25maWcuc291cmNlKVxuICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGNhbGxiYWNrKG51bGwsIHRoaXMucmVzcG9uc2VUZXh0KVxuICB9XG4gIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgY2FsbGJhY2soZXJyb3IpXG4gIH1cbiAgeGhyLnNlbmQoKVxufVxuXG5mdW5jdGlvbiBsb2FkQnlKc29ucChjb25maWcsIGNhbGxiYWNrKSB7XG4gIGlmICghY29uZmlnLnNvdXJjZSkge1xuICAgIGNhbGxiYWNrKG5ldyBFcnJvcignanNvbnAgbG9hZGVyOiBtaXNzaW5nIGNvbmZpZy5zb3VyY2UuJykpXG4gIH1cbiAgdmFyIGNhbGxiYWNrTmFtZSA9IGNvbmZpZy5qc29ucENhbGxiYWNrIHx8ICd3ZWV4SnNvbnBDYWxsYmFjaydcbiAgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbiAoY29kZSkge1xuICAgIGlmIChjb2RlKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBjb2RlKVxuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ2xvYWQgYnkganNvbnAgZXJyb3InKSlcbiAgICB9XG4gIH1cbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gIHNjcmlwdC5zcmMgPSBkZWNvZGVVUklDb21wb25lbnQoY29uZmlnLnNvdXJjZSlcbiAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcbn1cblxuZnVuY3Rpb24gbG9hZEJ5U291cmNlQ29kZShjb25maWcsIGNhbGxiYWNrKSB7XG4gIC8vIHNyYyBpcyB0aGUganNidW5kbGUuXG4gIC8vIG5vIG5lZWQgdG8gZmV0Y2ggZnJvbSBhbnl3aGVyZS5cbiAgaWYgKGNvbmZpZy5zb3VyY2UpIHtcbiAgICBjYWxsYmFjayhudWxsLCBjb25maWcuc291cmNlKVxuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKG5ldyBFcnJvcignc291cmNlIGNvZGUgbGFvZGVyOiBtaXNzaW5nIGNvbmZpZy5zb3VyY2UuJykpXG4gIH1cbn1cblxudmFyIGNhbGxiYWNrTWFwID0ge1xuICB4aHI6IGxvYWRCeVhIUixcbiAganNvbnA6IGxvYWRCeUpzb25wLFxuICBzb3VyY2U6IGxvYWRCeVNvdXJjZUNvZGVcbn1cblxuZnVuY3Rpb24gbG9hZChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgbG9hZEZuID0gY2FsbGJhY2tNYXBbb3B0aW9ucy5sb2FkZXJdXG4gIGxvYWRGbihvcHRpb25zLCBjYWxsYmFjaylcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJMb2FkZXIobmFtZSwgbG9hZGVyRnVuYykge1xuICBpZiAodHlwZW9mIGxvYWRlckZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFja01hcFtuYW1lXSA9IGxvYWRlckZ1bmNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbG9hZDogbG9hZCxcbiAgcmVnaXN0ZXJMb2FkZXI6IHJlZ2lzdGVyTG9hZGVyXG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2xvYWRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgV0VBUFBfU1RZTEVfSUQgPSAnd2VhcHAtc3R5bGUnXG5cbnZhciBfaXNXZWJwU3VwcG9ydGVkID0gZmFsc2VcblxuOyAoZnVuY3Rpb24gaXNTdXBwb3J0V2VicCgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgd2ViUCA9IG5ldyBJbWFnZSgpXG4gICAgd2ViUC5zcmMgPSAnZGF0YTppbWFnZS93ZWJwO2Jhc2U2NCxVa2xHUmpvQUFBQlhSVUpRVmxBNElDNEFBQUN5QWdDZEEnXG4gICAgICAgICAgICAgICsgJ1NvQ0FBSUFMbWswbWswaUlpSWlJZ0JvU3lnQUJjNldXZ0FBL3ZlZmYvMFBQOGJBLy9Md1lBQUEnXG4gICAgd2ViUC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAod2ViUC5oZWlnaHQgPT09IDIpIHtcbiAgICAgICAgX2lzV2VicFN1cHBvcnRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBkbyBub3RoaW5nLlxuICB9XG59KSgpXG5cbmZ1bmN0aW9uIGV4dGVuZCh0bywgZnJvbSkge1xuICBmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuICAgIHRvW2tleV0gPSBmcm9tW2tleV1cbiAgfVxuICByZXR1cm4gdG9cbn1cblxuZnVuY3Rpb24gaXNBcnJheShhcnIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXlcbiAgICA/IEFycmF5LmlzQXJyYXkoYXJyKVxuICAgIDogKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nKVxufVxuXG5mdW5jdGlvbiBhcHBlbmRTdHlsZShjc3MsIHN0eWxlSWQsIHJlcGxhY2UpIHtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3R5bGVJZClcbiAgaWYgKHN0eWxlICYmIHJlcGxhY2UpIHtcbiAgICBzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKVxuICAgIHN0eWxlID0gbnVsbFxuICB9XG4gIGlmICghc3R5bGUpIHtcbiAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJ1xuICAgIHN0eWxlSWQgJiYgKHN0eWxlLmlkID0gc3R5bGVJZClcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKVxuICB9XG4gIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpXG59XG5cbmZ1bmN0aW9uIGdldFVuaXF1ZUZyb21BcnJheShhcnIpIHtcbiAgaWYgKCFpc0FycmF5KGFycikpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuICB2YXIgcmVzID0gW11cbiAgdmFyIHVuaXF1ZSA9IHt9XG4gIHZhciB2YWxcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFsID0gYXJyW2ldXG4gICAgaWYgKHVuaXF1ZVt2YWxdKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICB1bmlxdWVbdmFsXSA9IHRydWVcbiAgICByZXMucHVzaCh2YWwpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9uaXplKGVsZW1lbnQsIHByb3BzKSB7XG4gIHZhciB0cmFuc2l0aW9ucyA9IFtdXG4gIGZvciAodmFyIGtleSBpbiBwcm9wcykge1xuICAgIHRyYW5zaXRpb25zLnB1c2goa2V5ICsgJyAnICsgcHJvcHNba2V5XSlcbiAgfVxuICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9ucy5qb2luKCcsICcpXG4gIGVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNpdGlvbiA9IHRyYW5zaXRpb25zLmpvaW4oJywgJylcbn1cblxuZnVuY3Rpb24gZGV0ZWN0V2VicCgpIHtcbiAgcmV0dXJuIF9pc1dlYnBTdXBwb3J0ZWRcbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tKG51bSkge1xuICB2YXIgX2RlZmF1bHROdW0gPSAxMFxuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgfHwgbnVtIDw9IDApIHtcbiAgICBudW0gPSBfZGVmYXVsdE51bVxuICB9XG4gIHZhciBfbWF4ID0gTWF0aC5wb3coMTAsIG51bSlcbiAgcmV0dXJuIE1hdGguZmxvb3IoRGF0ZS5ub3coKSArIE1hdGgucmFuZG9tKCkgKiBfbWF4KSAlIF9tYXhcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGV4dGVuZDogZXh0ZW5kLFxuICBpc0FycmF5OiBpc0FycmF5LFxuICBhcHBlbmRTdHlsZTogYXBwZW5kU3R5bGUsXG4gIGdldFVuaXF1ZUZyb21BcnJheTogZ2V0VW5pcXVlRnJvbUFycmF5LFxuICB0cmFuc2l0aW9uaXplOiB0cmFuc2l0aW9uaXplLFxuICBkZXRlY3RXZWJwOiBkZXRlY3RXZWJwLFxuICBnZXRSYW5kb206IGdldFJhbmRvbVxufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vdXRpbHMnKS5leHRlbmRcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi91dGlscycpLmlzQXJyYXlcbnZhciBDb21wb25lbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9jb21wb25lbnRNYW5hZ2VyJylcblxuLy8gZm9yIGpzZnJhbWV3b3JrIHRvIHJlZ2lzdGVyIG1vZHVsZXMuXG52YXIgX3JlZ2lzdGVyTW9kdWxlcyA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgaWYgKGlzQXJyYXkoY29uZmlnKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY29uZmlnLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgd2luZG93LnJlZ2lzdGVyTW9kdWxlcyhjb25maWdbaV0pXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5yZWdpc3Rlck1vZHVsZXMoY29uZmlnKVxuICB9XG59XG5cbnZhciBwcm90b2NvbCA9IHtcblxuICAvLyB3ZWV4IGluc3RhbmNlc1xuICBfaW5zdGFuY2VzOiBbXSxcblxuICAvLyBhcGkgbWV0YSBpbmZvXG4gIF9tZXRhOiBbXSxcblxuICBhcGlNb2R1bGU6IHt9LFxuXG4gIGluamVjdFdlZXhJbnN0YW5jZTogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgdGhpcy5faW5zdGFuY2VzW2luc3RhbmNlLmluc3RhbmNlSWRdID0gaW5zdGFuY2VcbiAgfSxcblxuICBnZXRXZWV4SW5zdGFuY2U6IGZ1bmN0aW9uIChpbnN0YW5jZUlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlc1tpbnN0YW5jZUlkXVxuICB9LFxuXG4gIC8vIGdldCB0aGUgYXBpIG1ldGhvZCBtZXRhIGluZm8gYXJyYXkgZm9yIHRoZSBtb2R1bGUuXG4gIGdldEFwaU1vZHVsZU1ldGE6IGZ1bmN0aW9uIChtb2R1bGVOYW1lKSB7XG4gICAgdmFyIG1ldGFPYmogPSB7fVxuICAgIG1ldGFPYmpbbW9kdWxlTmFtZV0gPSB0aGlzLl9tZXRhW21vZHVsZU5hbWVdXG4gICAgcmV0dXJuIG1ldGFPYmpcbiAgfSxcblxuICAvLyBTZXQgbWV0YSBpbmZvIGZvciBhIGFwaSBtb2R1bGUuXG4gIC8vIElmIHRoZXJlIGlzIGEgc2FtZSBuYW1lZCBhcGksIGp1c3QgcmVwbGFjZSBpdC5cbiAgLy8gb3B0czpcbiAgLy8gLSBtZXRhT2JqOiBtZXRhIG9iamVjdCBsaWtlXG4gIC8vIHtcbiAgLy8gICAgZG9tOiBbe1xuICAvLyAgICAgIG5hbWU6ICdhZGRFbGVtZW50JyxcbiAgLy8gICAgICBhcmdzOiBbJ3N0cmluZycsICdvYmplY3QnXVxuICAvLyAgICB9XVxuICAvLyB9XG4gIHNldEFwaU1vZHVsZU1ldGE6IGZ1bmN0aW9uIChtZXRhT2JqKSB7XG4gICAgdmFyIG1vZHVsZU5hbWVcbiAgICBmb3IgKHZhciBrIGluIG1ldGFPYmopIHtcbiAgICAgIGlmIChtZXRhT2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgIG1vZHVsZU5hbWUgPSBrXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBtZXRhQXJyYXkgPSB0aGlzLl9tZXRhW21vZHVsZU5hbWVdXG4gICAgaWYgKCFtZXRhQXJyYXkpIHtcbiAgICAgIHRoaXMuX21ldGFbbW9kdWxlTmFtZV0gPSBtZXRhT2JqW21vZHVsZU5hbWVdXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBuYW1lT2JqID0ge31cbiAgICAgIG1ldGFPYmpbbW9kdWxlTmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoYXBpKSB7XG4gICAgICAgIG5hbWVPYmpbYXBpLm5hbWVdID0gYXBpXG4gICAgICB9KVxuICAgICAgbWV0YUFycmF5LmZvckVhY2goZnVuY3Rpb24gKGFwaSwgaSkge1xuICAgICAgICBpZiAobmFtZU9ialthcGkubmFtZV0pIHtcbiAgICAgICAgICBtZXRhQXJyYXlbaV0gPSBuYW1lT2JqW2FwaS5uYW1lXVxuICAgICAgICAgIGRlbGV0ZSBuYW1lT2JqW2FwaS5uYW1lXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgZm9yICh2YXIgayBpbiBtZXRhT2JqKSB7XG4gICAgICAgIGlmIChtZXRhT2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgbWV0YUFycmF5LnB1c2gobWV0YU9ialtrXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9tZXRhW21vZHVsZU5hbWVdID0gbWV0YU9ialttb2R1bGVOYW1lXVxuICB9LFxuXG4gIC8vIFNldCBtZXRhIGluZm8gZm9yIGEgc2luZ2xlIGFwaS5cbiAgLy8gb3B0czpcbiAgLy8gIC0gbW9kdWxlTmFtZTogYXBpIG1vZHVsZSBuYW1lLlxuICAvLyAgLSBtZXRhOiBhIG1ldGEgb2JqZWN0IGxpa2U6XG4gIC8vICB7XG4gIC8vICAgIG5hbWU6ICdhZGRFbGVtZW50JyxcbiAgLy8gICAgYXJnczogWydzdHJpbmcnLCAnb2JqZWN0J11cbiAgLy8gIH1cbiAgc2V0QXBpTWV0YTogZnVuY3Rpb24gKG1vZHVsZU5hbWUsIG1ldGEpIHtcbiAgICB2YXIgbWV0YUFycmF5ID0gdGhpcy5fbWV0YVttb2R1bGVOYW1lXVxuICAgIGlmICghbWV0YUFycmF5KSB7XG4gICAgICB0aGlzLl9tZXRhW21vZHVsZU5hbWVdID0gW21ldGFdXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtZXRhSWR4ID0gLTFcbiAgICAgIG1ldGFBcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChhcGksIGkpIHtcbiAgICAgICAgaWYgKG1ldGEubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIG1ldGFJZHggPSBpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBpZiAobWV0YUlkeCAhPT0gLTEpIHtcbiAgICAgICAgbWV0YUFycmF5W21ldGFJZHhdID0gbWV0YVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWV0YUFycmF5LnB1c2gobWV0YSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuX3JlZ2lzdGVyTW9kdWxlcyhbe1xuICBtb2RhbDogW3tcbiAgICBuYW1lOiAndG9hc3QnLFxuICAgIGFyZ3M6IFsnb2JqZWN0JywgJ2Z1bmN0aW9uJ11cbiAgfSwge1xuICAgIG5hbWU6ICdhbGVydCcsXG4gICAgYXJnczogWydvYmplY3QnLCAnZnVuY3Rpb24nXVxuICB9LCB7XG4gICAgbmFtZTogJ2NvbmZpcm0nLFxuICAgIGFyZ3M6IFsnb2JqZWN0JywgJ2Z1bmN0aW9uJ11cbiAgfSwge1xuICAgIG5hbWU6ICdwcm9tcHQnLFxuICAgIGFyZ3M6IFsnb2JqZWN0JywgJ2Z1bmN0aW9uJ11cbiAgfV1cbn0sIHtcbiAgYW5pbWF0aW9uOiBbe1xuICAgIG5hbWU6ICd0cmFuc2l0aW9uJyxcbiAgICBhcmdzOiBbJ3N0cmluZycsICdvYmplY3QnLCAnZnVuY3Rpb24nXVxuICB9XVxufV0pXG5cbm1vZHVsZS5leHBvcnRzID0gcHJvdG9jb2xcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvcHJvdG9jb2wuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBGcmFtZVVwZGF0ZXIgPSByZXF1aXJlKCcuL2ZyYW1lVXBkYXRlcicpXG52YXIgQXBwZWFyV2F0Y2hlciA9IHJlcXVpcmUoJy4vYXBwZWFyV2F0Y2hlcicpXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJylcbnZhciBMYXp5TG9hZCA9IHJlcXVpcmUoJy4vbGF6eUxvYWQnKVxudmFyIGFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uJylcblxudmFyIFJFTkRFUklOR19JTkRFTlQgPSA4MDBcblxudmFyIF9pbnN0YW5jZU1hcCA9IHt9XG52YXIgdHlwZU1hcCA9IHt9XG52YXIgc2Nyb2xsYWJsZVR5cGVzID0gWydzY3JvbGxlcicsICdsaXN0J11cblxuZnVuY3Rpb24gQ29tcG9uZW50TWFuYWdlcihpbnN0YW5jZSkge1xuICB0aGlzLmluc3RhbmNlSWQgPSBpbnN0YW5jZS5pbnN0YW5jZUlkXG4gIHRoaXMud2VleEluc3RhbmNlID0gaW5zdGFuY2VcbiAgdGhpcy5jb21wb25lbnRNYXAgPSB7fVxuICBfaW5zdGFuY2VNYXBbdGhpcy5pbnN0YW5jZUlkXSA9IHRoaXNcbn1cblxuQ29tcG9uZW50TWFuYWdlci5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIChpbnN0YW5jZUlkKSB7XG4gIHJldHVybiBfaW5zdGFuY2VNYXBbaW5zdGFuY2VJZF1cbn1cblxuQ29tcG9uZW50TWFuYWdlci5nZXRXZWV4SW5zdGFuY2UgPSBmdW5jdGlvbiAoaW5zdGFuY2VJZCkge1xuICByZXR1cm4gX2luc3RhbmNlTWFwW2luc3RhbmNlSWRdLndlZXhJbnN0YW5jZVxufVxuXG5Db21wb25lbnRNYW5hZ2VyLnJlZ2lzdGVyQ29tcG9uZW50ID0gZnVuY3Rpb24gKHR5cGUsIGRlZmluaXRpb24pIHtcbiAgdHlwZU1hcFt0eXBlXSA9IGRlZmluaXRpb25cbn1cblxuQ29tcG9uZW50TWFuYWdlci5nZXRTY3JvbGxhYmxlVHlwZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBzY3JvbGxhYmxlVHlwZXNcbn1cblxuQ29tcG9uZW50TWFuYWdlci5wcm90b3R5cGUgPSB7XG5cbiAgLy8gRmlyZSBhIGV2ZW50ICdyZW5kZXJiZWdpbicvJ3JlbmRlcmVuZCcgb24gYm9keSBlbGVtZW50LlxuICByZW5kZXJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBfcmVuZGVyaW5nRW5kKCkge1xuICAgICAgLy8gZ2V0IHdlZXggaW5zdGFuY2Ugcm9vdFxuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZW5kZXJlbmQnKSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ1RpbWVyID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy5fcmVuZGVyaW5nVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZW5kZXJpbmdUaW1lcilcbiAgICAgIHRoaXMuX3JlbmRlcmluZ1RpbWVyID0gc2V0VGltZW91dChcbiAgICAgICAgX3JlbmRlcmluZ0VuZC5iaW5kKHRoaXMpLFxuICAgICAgICBSRU5ERVJJTkdfSU5ERU5UXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVuZGVyYmVnaW4nKSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ1RpbWVyID0gc2V0VGltZW91dChcbiAgICAgICAgX3JlbmRlcmluZ0VuZC5iaW5kKHRoaXMpLFxuICAgICAgICBSRU5ERVJJTkdfSU5ERU5UXG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIGdldEVsZW1lbnRCeVJlZjogZnVuY3Rpb24gKHJlZikge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudE1hcFtyZWZdXG4gIH0sXG5cbiAgcmVtb3ZlRWxlbWVudEJ5UmVmOiBmdW5jdGlvbiAocmVmKSB7XG4gICAgdmFyIGNtcFxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmICghcmVmIHx8ICEoY21wID0gdGhpcy5jb21wb25lbnRNYXBbcmVmXSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyByZW1vdmUgZnJvbSB0aGlzLmNvbXBvbmVudE1hcCBjdXJzaXZlbHlcbiAgICAoZnVuY3Rpb24gX3JlbW92ZUN1cnNpdmVseShfcmVmKSB7XG4gICAgICB2YXIgY2hpbGQgPSBzZWxmLmNvbXBvbmVudE1hcFtfcmVmXVxuICAgICAgdmFyIGxpc3RlbmVycyA9IGNoaWxkLl9saXN0ZW5lcnNcbiAgICAgIHZhciBjaGlsZHJlbiA9IGNoaWxkLmRhdGEuY2hpbGRyZW5cbiAgICAgIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBfcmVtb3ZlQ3Vyc2l2ZWx5KGNoaWxkcmVuW2ldLnJlZilcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gcmVtb3ZlIGV2ZW50cyBmcm9tIF9yZWYgY29tcG9uZW50XG4gICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgY2hpbGQubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1t0eXBlXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGVsZXRlIGNoaWxkLl9saXN0ZW5lcnNcbiAgICAgIGRlbGV0ZSBjaGlsZC5ub2RlLl9saXN0ZW5lcnNcbiAgICAgIC8vIHJlbW92ZSBfcmVmIGNvbXBvbmVudFxuICAgICAgZGVsZXRlIHNlbGYuY29tcG9uZW50TWFwW19yZWZdXG4gICAgfSkocmVmKVxuXG4gIH0sXG5cbiAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24gKGRhdGEsIG5vZGVUeXBlKSB7XG4gICAgdmFyIENvbXBvbmVudFR5cGUgPSB0eXBlTWFwW2RhdGEudHlwZV1cbiAgICBpZiAoIUNvbXBvbmVudFR5cGUpIHtcbiAgICAgIENvbXBvbmVudFR5cGUgPSB0eXBlTWFwWydjb250YWluZXInXVxuICAgIH1cblxuICAgIHZhciByZWYgPSBkYXRhLnJlZlxuICAgIHZhciBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50VHlwZShkYXRhLCBub2RlVHlwZSlcblxuICAgIHRoaXMuY29tcG9uZW50TWFwW3JlZl0gPSBjb21wb25lbnRcbiAgICBjb21wb25lbnQubm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcmVmJywgcmVmKVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudFxuICB9LFxuXG4gIC8qKlxuICAgKiBjcmVhdGVCb2R5OiBnZW5lcmF0ZSByb290IGNvbXBvbmVudFxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGVsZW1lbnRcbiAgICovXG4gIGNyZWF0ZUJvZHk6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cbiAgICAvLyBUT0RPOiBjcmVhdGJvZHkgb24gZG9jdW1lbnQuYm9keVxuICAgIC8vIG5vIG5lZWQgdG8gY3JlYXRlIGEgZXh0cmEgZGl2XG4gICAgdmFyIHJvb3QsIGJvZHksIG5vZGVUeXBlXG4gICAgaWYgKHRoaXMuY29tcG9uZW50TWFwWydfcm9vdCddKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBub2RlVHlwZSA9IGVsZW1lbnQudHlwZVxuICAgIGVsZW1lbnQudHlwZSA9ICdyb290J1xuICAgIGVsZW1lbnQucm9vdElkID0gdGhpcy53ZWV4SW5zdGFuY2Uucm9vdElkXG4gICAgZWxlbWVudC5yZWYgPSAnX3Jvb3QnXG5cbiAgICB2YXIgcm9vdCA9IHRoaXMuY3JlYXRlRWxlbWVudChlbGVtZW50LCBub2RlVHlwZSlcbiAgICBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0aGlzLndlZXhJbnN0YW5jZS5yb290SWQpXG4gICAgICAgICAgfHwgZG9jdW1lbnQuYm9keVxuICAgIGJvZHkuYXBwZW5kQ2hpbGQocm9vdC5ub2RlKVxuICAgIHJvb3QuX2FwcGVuZGVkID0gdHJ1ZVxuICB9LFxuXG4gIGFwcGVuZENoaWxkOiBmdW5jdGlvbiAocGFyZW50UmVmLCBkYXRhKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXMuY29tcG9uZW50TWFwW3BhcmVudFJlZl1cblxuICAgIGlmICh0aGlzLmNvbXBvbmVudE1hcFtkYXRhLnJlZl0gfHwgIXBhcmVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHBhcmVudFJlZiA9PT0gJ19yb290JyAmJiAhcGFyZW50KSB7XG4gICAgICBwYXJlbnQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoe1xuICAgICAgICB0eXBlOiAncm9vdCcsXG4gICAgICAgIHJvb3RJZDogdGhpcy53ZWV4SW5zdGFuY2Uucm9vdElkLFxuICAgICAgICByZWY6ICdfcm9vdCdcbiAgICAgIH0pXG4gICAgICBwYXJlbnQuX2FwcGVuZGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIHZhciBjaGlsZCA9IHBhcmVudC5hcHBlbmRDaGlsZChkYXRhKVxuXG4gICAgLy8gSW4gc29tZSBwYXJlbnQgY29tcG9uZW50IHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBtZXRob2RcbiAgICAvLyBhcHBlbmRDaGlsZCBkaWRuJ3QgcmV0dXJuIHRoZSBjb21wb25lbnQgYXQgYWxsLCB0aGVyZWZvclxuICAgIC8vIGNoaWxkIG1heWJlIGEgdW5kZWZpbmVkIG9iamVjdC5cbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGNoaWxkLnBhcmVudFJlZiA9IHBhcmVudFJlZlxuICAgIH1cblxuICAgIGlmIChjaGlsZCAmJiBwYXJlbnQuX2FwcGVuZGVkKSB7XG4gICAgICB0aGlzLmhhbmRsZUFwcGVuZChjaGlsZClcbiAgICB9XG4gIH0sXG5cbiAgYXBwZW5kQ2hpbGRyZW46IGZ1bmN0aW9uIChyZWYsIGVsZW1lbnRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZChyZWYsIGVsZW1lbnRzW2ldKVxuICAgIH1cbiAgfSxcblxuICByZW1vdmVFbGVtZW50OiBmdW5jdGlvbiAocmVmKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50TWFwW3JlZl1cblxuICAgIC8vIGZpcmUgZXZlbnQgZm9yIHJlbmRlcmluZyBkb20gb24gYm9keSBlbG1lbnQuXG4gICAgdGhpcy5yZW5kZXJpbmcoKVxuXG4gICAgaWYgKGNvbXBvbmVudCAmJiBjb21wb25lbnQucGFyZW50UmVmKSB7XG4gICAgICB2YXIgcGFyZW50ID0gdGhpcy5jb21wb25lbnRNYXBbY29tcG9uZW50LnBhcmVudFJlZl1cbiAgICAgIGNvbXBvbmVudC5vblJlbW92ZSAmJiBjb21wb25lbnQub25SZW1vdmUoKVxuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGNvbXBvbmVudClcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdyZWY6ICcsIHJlZilcbiAgICB9XG4gIH0sXG5cbiAgbW92ZUVsZW1lbnQ6IGZ1bmN0aW9uIChyZWYsIHBhcmVudFJlZiwgaW5kZXgpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRNYXBbcmVmXVxuICAgIHZhciBuZXdQYXJlbnQgPSB0aGlzLmNvbXBvbmVudE1hcFtwYXJlbnRSZWZdXG4gICAgdmFyIG9sZFBhcmVudFJlZiA9IGNvbXBvbmVudC5wYXJlbnRSZWZcbiAgICB2YXIgY2hpbGRyZW4sIGJlZm9yZSwgaSwgbFxuICAgIGlmICghY29tcG9uZW50IHx8ICFuZXdQYXJlbnQpIHtcbiAgICAgIGNvbnNvbGUud2FybigncmVmOiAnLCByZWYpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBmaXJlIGV2ZW50IGZvciByZW5kZXJpbmcgZG9tIG9uIGJvZHkgZWxtZW50LlxuICAgIHRoaXMucmVuZGVyaW5nKClcblxuICAgIC8vIHJlbW92ZSBmcm9tIG9sZFBhcmVudC5kYXRhLmNoaWxkcmVuXG4gICAgaWYgKG9sZFBhcmVudFJlZiAmJiB0aGlzLmNvbXBvbmVudE1hcFtvbGRQYXJlbnRSZWZdKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY29tcG9uZW50TWFwW29sZFBhcmVudFJlZl0uZGF0YS5jaGlsZHJlblxuICAgICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNoaWxkcmVuW2ldLnJlZiA9PT0gcmVmKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobCA+IGkpIHtcbiAgICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbmRleCA8IC0xKSB7XG4gICAgICBpbmRleCA9IC0xXG4gICAgICBjb25zb2xlLndhcm4oJ2luZGV4IGNhbm5vdCBiZSBsZXNzIHRoYW4gLTEuJylcbiAgICB9XG5cbiAgICBjaGlsZHJlbiA9IG5ld1BhcmVudC5kYXRhLmNoaWxkcmVuXG4gICAgaWYgKGNoaWxkcmVuXG4gICAgICAgICYmIGNoaWxkcmVuLmxlbmd0aFxuICAgICAgICAmJiBpbmRleCAhPT0gLTFcbiAgICAgICAgJiYgaW5kZXggPCBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGJlZm9yZSA9IHRoaXMuY29tcG9uZW50TWFwW25ld1BhcmVudC5kYXRhLmNoaWxkcmVuW2luZGV4XS5yZWZdXG4gICAgICBuZXdQYXJlbnQuaW5zZXJ0QmVmb3JlKGNvbXBvbmVudCwgYmVmb3JlKVxuICAgIH0gZWxzZSB7ICAvLyBhcHBlbmRcbiAgICAgIG5ld1BhcmVudC5pbnNlcnRCZWZvcmUoY29tcG9uZW50KVxuICAgIH1cblxuICAgIGNvbXBvbmVudC5vbk1vdmUgJiYgY29tcG9uZW50Lm9uTW92ZShwYXJlbnRSZWYsIGluZGV4KVxuXG4gIH0sXG5cbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAocmVmLCBkYXRhKSB7XG4gICAgdmFyIGNoaWxkLCBiZWZvcmUsIHBhcmVudFxuICAgIGJlZm9yZSA9IHRoaXMuY29tcG9uZW50TWFwW3JlZl1cbiAgICBjaGlsZCA9IHRoaXMuY29tcG9uZW50TWFwW2RhdGEucmVmXVxuICAgIGJlZm9yZSAmJiAocGFyZW50ID0gdGhpcy5jb21wb25lbnRNYXBbYmVmb3JlLnBhcmVudFJlZl0pXG4gICAgaWYgKGNoaWxkIHx8ICFwYXJlbnQgfHwgIWJlZm9yZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2hpbGQgPSB0aGlzLmNyZWF0ZUVsZW1lbnQoZGF0YSlcbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGNoaWxkLnBhcmVudFJlZiA9IGJlZm9yZS5wYXJlbnRSZWZcbiAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIGJlZm9yZSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29tcG9uZW50TWFwW2JlZm9yZS5wYXJlbnRSZWZdLl9hcHBlbmRlZCkge1xuICAgICAgdGhpcy5oYW5kbGVBcHBlbmQoY2hpbGQpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBhZGRFbGVtZW50XG4gICAqIElmIGluZGV4IGlzIGxhcmdldCB0aGFuIGFueSBjaGlsZCdzIGluZGV4LCB0aGVcbiAgICogZWxlbWVudCB3aWxsIGJlIGFwcGVuZGVkIGJlaGluZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudFJlZlxuICAgKiBAcGFyYW0ge29ian0gZWxlbWVudCAoZGF0YSBvZiB0aGUgY29tcG9uZW50KVxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAgICovXG4gIGFkZEVsZW1lbnQ6IGZ1bmN0aW9uIChwYXJlbnRSZWYsIGVsZW1lbnQsIGluZGV4KSB7XG4gICAgdmFyIHBhcmVudCwgY2hpbGRyZW4sIGJlZm9yZVxuXG4gICAgLy8gZmlyZSBldmVudCBmb3IgcmVuZGVyaW5nIGRvbSBvbiBib2R5IGVsbWVudC5cbiAgICB0aGlzLnJlbmRlcmluZygpXG5cbiAgICBwYXJlbnQgPSB0aGlzLmNvbXBvbmVudE1hcFtwYXJlbnRSZWZdXG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjaGlsZHJlbiA9IHBhcmVudC5kYXRhLmNoaWxkcmVuXG4gICAgLy8gLTEgbWVhbnMgYXBwZW5kIGFzIHRoZSBsYXN0LlxuICAgIGlmIChpbmRleCA8IC0xKSB7XG4gICAgICBpbmRleCA9IC0xXG4gICAgICBjb25zb2xlLndhcm4oJ2luZGV4IGNhbm5vdCBiZSBsZXNzIHRoYW4gLTEuJylcbiAgICB9XG4gICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aFxuICAgICAgICAmJiBjaGlsZHJlbi5sZW5ndGggPiBpbmRleFxuICAgICAgICAmJiBpbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuaW5zZXJ0QmVmb3JlKGNoaWxkcmVuW2luZGV4XS5yZWYsIGVsZW1lbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocGFyZW50UmVmLCBlbGVtZW50KVxuICAgIH1cbiAgfSxcblxuICBjbGVhckNoaWxkcmVuOiBmdW5jdGlvbiAocmVmKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50TWFwW3JlZl1cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBjb21wb25lbnQubm9kZS5pbm5lckhUTUwgPSAnJ1xuICAgICAgaWYgKGNvbXBvbmVudC5kYXRhKSB7XG4gICAgICAgIGNvbXBvbmVudC5kYXRhLmNoaWxkcmVuID0gbnVsbFxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBhZGRFdmVudDogZnVuY3Rpb24gKHJlZiwgdHlwZSkge1xuICAgIHZhciBjb21wb25lbnRcbiAgICBpZiAodHlwZW9mIHJlZiA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJlZiA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50TWFwW3JlZl1cbiAgICB9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChyZWYpLnNsaWNlKDgsIC0xKSA9PT0gJ09iamVjdCcpIHtcbiAgICAgIGNvbXBvbmVudCA9IHJlZlxuICAgICAgcmVmID0gY29tcG9uZW50LmRhdGEucmVmXG4gICAgfVxuICAgIGlmIChjb21wb25lbnQgJiYgY29tcG9uZW50Lm5vZGUpIHtcbiAgICAgIHZhciBzZW5kZXIgPSB0aGlzLndlZXhJbnN0YW5jZS5zZW5kZXJcbiAgICAgIHZhciBsaXN0ZW5lciA9IHNlbmRlci5maXJlRXZlbnQuYmluZChzZW5kZXIsIHJlZiwgdHlwZSlcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBjb21wb25lbnQuX2xpc3RlbmVyc1xuICAgICAgY29tcG9uZW50Lm5vZGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgZmFsc2UsIGZhbHNlKVxuICAgICAgaWYgKCFsaXN0ZW5lcnMpIHtcbiAgICAgICAgbGlzdGVuZXJzID0gY29tcG9uZW50Ll9saXN0ZW5lcnMgPSB7fVxuICAgICAgICBjb21wb25lbnQubm9kZS5fbGlzdGVuZXJzID0ge31cbiAgICAgIH1cbiAgICAgIGxpc3RlbmVyc1t0eXBlXSA9IGxpc3RlbmVyXG4gICAgICBjb21wb25lbnQubm9kZS5fbGlzdGVuZXJzW3R5cGVdID0gbGlzdGVuZXJcbiAgICB9XG4gIH0sXG5cbiAgcmVtb3ZlRXZlbnQ6IGZ1bmN0aW9uIChyZWYsIHR5cGUpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRNYXBbcmVmXVxuICAgIHZhciBsaXN0ZW5lciA9IGNvbXBvbmVudC5fbGlzdGVuZXJzW3R5cGVdXG4gICAgaWYgKGNvbXBvbmVudCAmJiBsaXN0ZW5lcikge1xuICAgICAgY29tcG9uZW50Lm5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcilcbiAgICAgIGNvbXBvbmVudC5fbGlzdGVuZXJzW3R5cGVdID0gbnVsbFxuICAgICAgY29tcG9uZW50Lm5vZGUuX2xpc3RlbmVyc1t0eXBlXSA9IG51bGxcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlQXR0cnM6IGZ1bmN0aW9uIChyZWYsIGF0dHIpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRNYXBbcmVmXVxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC51cGRhdGVBdHRycyhhdHRyKVxuICAgICAgaWYgKGNvbXBvbmVudC5kYXRhLnR5cGUgPT09ICdpbWFnZScgJiYgYXR0ci5zcmMpIHtcbiAgICAgICAgTGF6eUxvYWQuc3RhcnRJZk5lZWRlZChjb21wb25lbnQpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZVN0eWxlOiBmdW5jdGlvbiAocmVmLCBzdHlsZSkge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudE1hcFtyZWZdXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LnVwZGF0ZVN0eWxlKHN0eWxlKVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGVGdWxsQXR0cnM6IGZ1bmN0aW9uIChyZWYsIGF0dHIpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRNYXBbcmVmXVxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC5jbGVhckF0dHIoKVxuICAgICAgY29tcG9uZW50LnVwZGF0ZUF0dHJzKGF0dHIpXG4gICAgICBpZiAoY29tcG9uZW50LmRhdGEudHlwZSA9PT0gJ2ltYWdlJyAmJiBhdHRyLnNyYykge1xuICAgICAgICBMYXp5TG9hZC5zdGFydElmTmVlZGVkKGNvbXBvbmVudClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlRnVsbFN0eWxlOiBmdW5jdGlvbiAocmVmLCBzdHlsZSkge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudE1hcFtyZWZdXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LmNsZWFyU3R5bGUoKVxuICAgICAgY29tcG9uZW50LnVwZGF0ZVN0eWxlKHN0eWxlKVxuICAgIH1cbiAgfSxcblxuICBoYW5kbGVBcHBlbmQ6IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICBjb21wb25lbnQuX2FwcGVuZGVkID0gdHJ1ZVxuICAgIGNvbXBvbmVudC5vbkFwcGVuZCAmJiBjb21wb25lbnQub25BcHBlbmQoKVxuXG4gICAgLy8gaW52b2tlIG9uQXBwZW5kIG9uIGNoaWxkcmVuIHJlY3Vyc2l2ZWx5XG4gICAgdmFyIGNoaWxkcmVuID0gY29tcG9uZW50LmRhdGEuY2hpbGRyZW5cbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jb21wb25lbnRNYXBbY2hpbGRyZW5baV0ucmVmXVxuICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZUFwcGVuZChjaGlsZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHdhdGNoIGFwcGVhci9kaXNhcHBlYXIgb2YgdGhlIGNvbXBvbmVudCBpZiBuZWVkZWRcbiAgICBBcHBlYXJXYXRjaGVyLndhdGNoSWZOZWVkZWQoY29tcG9uZW50KVxuXG4gICAgLy8gZG8gbGF6eWxvYWQgaWYgbmVlZGVkXG4gICAgTGF6eUxvYWQuc3RhcnRJZk5lZWRlZChjb21wb25lbnQpXG4gIH0sXG5cbiAgdHJhbnNpdGlvbjogZnVuY3Rpb24gKHJlZiwgY29uZmlnLCBjYWxsYmFjaykge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudE1hcFtyZWZdXG4gICAgYW5pbWF0aW9uLnRyYW5zaXRpb25PbmNlKGNvbXBvbmVudCwgY29uZmlnLCBjYWxsYmFjaylcbiAgfSxcblxuICByZW5kZXJGaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICBGcmFtZVVwZGF0ZXIucGF1c2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50TWFuYWdlclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRNYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciByYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgIGZ1bmN0aW9uIChjYWxsbGJhY2spIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGxiYWNrLCAxNilcbiAgICAgICAgICB9XG5cbnZhciByYWZJZFxudmFyIG9ic2VydmVycyA9IFtdXG52YXIgcGF1c2VkID0gZmFsc2VcblxudmFyIEZyYW1lVXBkYXRlciA9IHtcbiAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocmFmSWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHJhZklkID0gcmFmKGZ1bmN0aW9uIHJ1bkxvb3AoKSB7XG4gICAgICBpZiAoIXBhdXNlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ic2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG9ic2VydmVyc1tpXSgpXG4gICAgICAgIH1cbiAgICAgICAgcmFmKHJ1bkxvb3ApXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBpc0FjdGl2ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhcGF1c2VkXG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICBwYXVzZWQgPSB0cnVlXG4gICAgcmFmSWQgPSB1bmRlZmluZWRcbiAgfSxcblxuICByZXN1bWU6IGZ1bmN0aW9uICgpIHtcbiAgICBwYXVzZWQgPSBmYWxzZVxuICAgIHRoaXMuc3RhcnQoKVxuICB9LFxuXG4gIGFkZFVwZGF0ZU9ic2VydmVyOiBmdW5jdGlvbiAob2JzZXJ2ZU1ldGhvZCkge1xuICAgIG9ic2VydmVycy5wdXNoKG9ic2VydmVNZXRob2QpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGcmFtZVVwZGF0ZXJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZnJhbWVVcGRhdGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJylcblxudmFyIGNvbXBvbmVudHNJblNjcm9sbGVyID0gW11cbnZhciBjb21wb25lbnRzT3V0T2ZTY3JvbGxlciA9IFtdXG52YXIgbGlzdGVuZWQgPSBmYWxzZVxudmFyIGRpcmVjdGlvbiA9ICd1cCdcbnZhciBzY3JvbGxZID0gMFxuXG52YXIgQXBwZWFyV2F0Y2hlciA9IHtcbiAgd2F0Y2hJZk5lZWRlZDogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIGlmIChuZWVkV2F0Y2goY29tcG9uZW50KSkge1xuICAgICAgaWYgKGNvbXBvbmVudC5pc0luU2Nyb2xsYWJsZSgpKSB7XG4gICAgICAgIGNvbXBvbmVudHNJblNjcm9sbGVyLnB1c2goY29tcG9uZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcG9uZW50c091dE9mU2Nyb2xsZXIucHVzaChjb21wb25lbnQpXG4gICAgICB9XG4gICAgICBpZiAoIWxpc3RlbmVkKSB7XG4gICAgICAgIGxpc3RlbmVkID0gdHJ1ZVxuICAgICAgICAvLyB2YXIgaGFuZGxlciA9IHRocm90dGxlKG9uU2Nyb2xsLCAyNSlcbiAgICAgICAgdmFyIGhhbmRsZXIgPSB0aHJvdHRsZShvblNjcm9sbCwgMTAwKVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaGFuZGxlciwgZmFsc2UpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG5lZWRXYXRjaChjb21wb25lbnQpIHtcbiAgdmFyIGV2ZW50cyA9IGNvbXBvbmVudC5kYXRhLmV2ZW50XG4gIGlmIChldmVudHNcbiAgICAgICYmIChldmVudHMuaW5kZXhPZignYXBwZWFyJykgIT0gLTFcbiAgICAgICAgfHwgZXZlbnRzLmluZGV4T2YoJ2Rpc2FwcGVhcicpICE9IC0xKSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIG9uU2Nyb2xsKGUpIHtcbiAgLy8gSWYgdGhlIHNjcm9sbCBldmVudCBpcyBkaXNwYXRjaGVkIGZyb20gYSBzY3JvbGxhYmxlIGNvbXBvbmVudFxuICAvLyBpbXBsZW1lbnRlZCB0aHJvdWdoIHNjcm9sbGVyanMsIHRoZW4gdGhlIGFwcGVhci9kaXNhcHBlYXIgZXZlbnRzXG4gIC8vIHNob3VsZCBiZSB0cmVhdGVkIHNwZWNpYWxseSBieSBoYW5kbGVTY3JvbGxlclNjcm9sbC5cbiAgaWYgKGUub3JpZ2luYWxUeXBlID09PSAnc2Nyb2xsaW5nJykge1xuICAgIGhhbmRsZVNjcm9sbGVyU2Nyb2xsKClcbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVXaW5kb3dTY3JvbGwoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNjcm9sbGVyU2Nyb2xsKCkge1xuICB2YXIgY21wcyA9IGNvbXBvbmVudHNJblNjcm9sbGVyXG4gIHZhciBsZW4gPSBjbXBzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IGNtcHNbaV1cbiAgICB2YXIgYXBwZWFyID0gaXNDb21wb25lbnRJblNjcm9sbGVyQXBwZWFyKGNvbXBvbmVudClcbiAgICBpZiAoYXBwZWFyICYmICFjb21wb25lbnQuX2FwcGVhcikge1xuICAgICAgY29tcG9uZW50Ll9hcHBlYXIgPSB0cnVlXG4gICAgICBmaXJlRXZlbnQoY29tcG9uZW50LCAnYXBwZWFyJylcbiAgICB9IGVsc2UgaWYgKCFhcHBlYXIgJiYgY29tcG9uZW50Ll9hcHBlYXIpIHtcbiAgICAgIGNvbXBvbmVudC5fYXBwZWFyID0gZmFsc2VcbiAgICAgIGZpcmVFdmVudChjb21wb25lbnQsICdkaXNhcHBlYXInKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVXaW5kb3dTY3JvbGwoKSB7XG4gIHZhciB5ID0gd2luZG93LnNjcm9sbFlcbiAgZGlyZWN0aW9uID0geSA+PSBzY3JvbGxZID8gJ3VwJyA6ICdkb3duJ1xuICBzY3JvbGxZID0geVxuXG4gIHZhciBsZW4gPSBjb21wb25lbnRzT3V0T2ZTY3JvbGxlci5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkge1xuICAgIHJldHVyblxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50c091dE9mU2Nyb2xsZXJbaV1cbiAgICB2YXIgYXBwZWFyID0gaXNDb21wb25lbnRJbldpbmRvdyhjb21wb25lbnQpXG4gICAgaWYgKGFwcGVhciAmJiAhY29tcG9uZW50Ll9hcHBlYXIpIHtcbiAgICAgIGNvbXBvbmVudC5fYXBwZWFyID0gdHJ1ZVxuICAgICAgZmlyZUV2ZW50KGNvbXBvbmVudCwgJ2FwcGVhcicpXG4gICAgfSBlbHNlIGlmICghYXBwZWFyICYmIGNvbXBvbmVudC5fYXBwZWFyKSB7XG4gICAgICBjb21wb25lbnQuX2FwcGVhciA9IGZhbHNlXG4gICAgICBmaXJlRXZlbnQoY29tcG9uZW50LCAnZGlzYXBwZWFyJylcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNDb21wb25lbnRJblNjcm9sbGVyQXBwZWFyKGNvbXBvbmVudCkge1xuICB2YXIgcGFyZW50U2Nyb2xsZXIgPSBjb21wb25lbnQuX3BhcmVudFNjcm9sbGVyXG4gIHZhciBjbXBSZWN0ID0gY29tcG9uZW50Lm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgaWYgKCFpc0NvbXBvbmVudEluV2luZG93KGNvbXBvbmVudCkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICB3aGlsZSAocGFyZW50U2Nyb2xsZXIpIHtcbiAgICB2YXIgcGFyZW50UmVjdCA9IHBhcmVudFNjcm9sbGVyLm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoIShjbXBSZWN0LnJpZ2h0ID4gcGFyZW50UmVjdC5sZWZ0XG4gICAgICAgICYmIGNtcFJlY3QubGVmdCA8IHBhcmVudFJlY3QucmlnaHRcbiAgICAgICAgJiYgY21wUmVjdC5ib3R0b20gPiBwYXJlbnRSZWN0LnRvcFxuICAgICAgICAmJiBjbXBSZWN0LnRvcCA8IHBhcmVudFJlY3QuYm90dG9tKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHBhcmVudFNjcm9sbGVyID0gcGFyZW50U2Nyb2xsZXIuX3BhcmVudFNjcm9sbGVyXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaXNDb21wb25lbnRJbldpbmRvdyhjb21wb25lbnQpIHtcbiAgdmFyIHJlY3QgPSBjb21wb25lbnQubm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICByZXR1cm4gcmVjdC5yaWdodCA+IDAgJiYgcmVjdC5sZWZ0IDwgd2luZG93LmlubmVyV2lkdGggJiZcbiAgICAgICAgIHJlY3QuYm90dG9tID4gMCAmJiByZWN0LnRvcCA8IHdpbmRvdy5pbm5lckhlaWdodFxufVxuXG5mdW5jdGlvbiBmaXJlRXZlbnQoY29tcG9uZW50LCB0eXBlKSB7XG4gIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpXG4gIHZhciBkYXRhID0geyBkaXJlY3Rpb246IGRpcmVjdGlvbiB9XG4gIGV2dC5pbml0RXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlKVxuICBldnQuZGF0YSA9IGRhdGFcbiAgdXRpbHMuZXh0ZW5kKGV2dCwgZGF0YSlcbiAgY29tcG9uZW50Lm5vZGUuZGlzcGF0Y2hFdmVudChldnQpXG59XG5cbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQpIHtcbiAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdFxuICB2YXIgdGltZW91dCA9IG51bGxcbiAgdmFyIHByZXZpb3VzID0gMFxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcHJldmlvdXMgPSBEYXRlLm5vdygpXG4gICAgdGltZW91dCA9IG51bGxcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKVxuICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKVxuICAgIGNvbnRleHQgPSB0aGlzXG4gICAgYXJncyA9IGFyZ3VtZW50c1xuICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgcHJldmlvdXMgPSBub3dcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgICB9IGVsc2UgaWYgKCF0aW1lb3V0KSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBlYXJXYXRjaGVyXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9hcHBlYXJXYXRjaGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG5yZXF1aXJlKCdsYXp5aW1nJylcblxudmFyIGxhenlsb2FkVGltZXJcblxudmFyIExhenlMb2FkID0ge1xuICBtYWtlSW1hZ2VMYXp5OiBmdW5jdGlvbiAoaW1hZ2UsIHNyYykge1xuICAgIGltYWdlLnJlbW92ZUF0dHJpYnV0ZSgnaW1nLXNyYycpXG4gICAgaW1hZ2UucmVtb3ZlQXR0cmlidXRlKCdpLWxhenktc3JjJylcbiAgICBpbWFnZS5yZW1vdmVBdHRyaWJ1dGUoJ3NyYycpXG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdpbWctc3JjJywgc3JjKVxuICAgIC8vIHNob3VsZCByZXBsYWNlICdzcmMnIHdpdGggJ2ltZy1zcmMnLiBidXQgZm9yIG5vdyBsaWIuaW1nLmZpcmUgaXNcbiAgICAvLyBub3Qgd29ya2luZyBmb3IgdGhlIHNpdHVhdGlvbiB0aGF0IHRoZSBhcHBlYXIgZXZlbnQgaGFzIGJlZW5cbiAgICAvLyBhbHJlYWR5IHRyaWdnZXJlZC5cbiAgICAvLyBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYylcbiAgICAvLyBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2ltZy1zcmMnLCBzcmMpXG4gICAgdGhpcy5maXJlKClcbiAgfSxcblxuICAvLyB3ZSBkb24ndCBrbm93IHdoZW4gYWxsIGltYWdlIGFyZSBhcHBlbmRlZFxuICAvLyBqdXN0IHVzZSBzZXRUaW1lb3V0IHRvIGRvIGRlbGF5IGxhenlsb2FkXG4gIC8vXG4gIC8vIC0tIGFjdHVhbGx5IGV2ZXJ5dGltZSB3ZSBhZGQgYSBlbGVtZW50IG9yIHVwZGF0ZSBzdHlsZXMsXG4gIC8vIHRoZSBjb21wb25lbnQgbWFuYWdlciB3aWxsIGNhbGwgc3RhcnRJZk5lZWQgdG8gZmlyZVxuICAvLyBsYXp5bG9hZCBvbmNlIGFnYWluIGluIHRoZSBoYW5kbGVBcHBlbmQgZnVuY3Rpb24uIHNvIHRoZXJlXG4gIC8vIGlzIG5vIHdheSB0aGF0IGFueSBpbWFnZSBlbGVtZW50IGNhbiBtaXNzIGl0LiBTZWUgc291cmNlXG4gIC8vIGNvZGUgaW4gY29tcG9uZW50TWFuZ2FnZXIuanMuXG4gIHN0YXJ0SWZOZWVkZWQ6IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBpZiAoY29tcG9uZW50LmRhdGEudHlwZSA9PT0gJ2ltYWdlJykge1xuICAgICAgaWYgKCFsYXp5bG9hZFRpbWVyKSB7XG4gICAgICAgIGxhenlsb2FkVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGF0LmZpcmUoKVxuICAgICAgICAgIGNsZWFyVGltZW91dChsYXp5bG9hZFRpbWVyKVxuICAgICAgICAgIGxhenlsb2FkVGltZXIgPSBudWxsXG4gICAgICAgIH0sIDE2KVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBsb2FkSWZOZWVkZWQ6IGZ1bmN0aW9uIChlbGVtZW50U2NvcGUpIHtcbiAgICB2YXIgbm90UHJlUHJvY2Vzc2VkID0gZWxlbWVudFNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpbWctc3JjXScpXG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgLy8gaW1hZ2UgZWxlbWVudHMgd2hpY2ggaGF2ZSBhdHRyaWJ1dGUgJ2ktbGF6eS1zcmMnIHdlcmUgZWxlbWVudHNcbiAgICAvLyB0aGF0IGhhZCBiZWVuIHByZXByb2Nlc3NlZCBieSBsaWItaW1nLWNvcmUsIGJ1dCBub3QgbG9hZGVkIHlldCwgYW5kXG4gICAgLy8gbXVzdCBiZSBsb2FkZWQgd2hlbiAnYXBwZWFyJyBldmVudHMgd2VyZSBmaXJlZC4gSXQgdHVybnMgb3V0IHRoZVxuICAgIC8vICdhcHBlYXInIGV2ZW50IHdhcyBub3QgZmlyZWQgY29ycmVjdGx5IGluIHRoZSBjc3MtdHJhbnNsYXRlLXRyYW5zaXRpb25cbiAgICAvLyBzaXR1YXRpb24sIHNvICdpLWxhenktc3JjJyBtdXN0IGJlIGNoZWNrZWQgYW5kIGxhenlsb2FkIG11c3QgYmVcbiAgICAvLyBmaXJlZCBtYW51YWxseS5cbiAgICB2YXIgcHJlUHJvY2Vzc2VkID0gZWxlbWVudFNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpLWxhenktc3JjXScpXG4gICAgaWYgKG5vdFByZVByb2Nlc3NlZC5sZW5ndGggPiAwIHx8IHByZVByb2Nlc3NlZC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGF0LmZpcmUoKVxuICAgIH1cbiAgfSxcblxuICAvLyBmaXJlIGxhenlsb2FkLlxuICBmaXJlOiBmdW5jdGlvbiAoKSB7XG4gICAgbGliLmltZy5maXJlKClcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF6eUxvYWRcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbGF6eUxvYWQuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyYmKHdpbmRvdz17Y3RybDp7fSxsaWI6e319KSwhd2luZG93LmN0cmwmJih3aW5kb3cuY3RybD17fSksIXdpbmRvdy5saWImJih3aW5kb3cubGliPXt9KSxmdW5jdGlvbih0LGkpe2Z1bmN0aW9uIGUodCxpKXtpJiYoXCJJTUdcIj09dC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpP3Quc2V0QXR0cmlidXRlKFwic3JjXCIsaSk6dC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2U9J3VybChcIicraSsnXCIpJyl9ZnVuY3Rpb24gYSgpe3I9aS5hcHBlYXIuaW5pdCh7Y2xzOlwiaW1ndG1wXCIsb25jZTohMCx4Om8ubGF6eVdpZHRoLHk6by5sYXp5SGVpZ2h0LG9uQXBwZWFyOmZ1bmN0aW9uKHQpe3ZhciBpPXRoaXM7ZShpLGkuZ2V0QXR0cmlidXRlKFwiaS1sYXp5LXNyY1wiKSksaS5yZW1vdmVBdHRyaWJ1dGUoXCJpLWxhenktc3JjXCIpfX0pfXJlcXVpcmUoXCJhcHBlYXJqc1wiKTt2YXIgcixBPXt9LG89e2RhdGFTcmM6XCJpbWctc3JjXCIsbGF6eUhlaWdodDowLGxhenlXaWR0aDowfTtBLmxvZ0NvbmZpZz1mdW5jdGlvbigpe2NvbnNvbGUubG9nKFwibGliLWltZyBDb25maWdcXG5cIixvKX0sQS5maXJlPWZ1bmN0aW9uKCl7cnx8YSgpO3ZhciB0PVwiaV9cIitEYXRlLm5vdygpJTFlNSxpPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbXCIrby5kYXRhU3JjK1wiXVwiKTtbXS5mb3JFYWNoLmNhbGwoaSxmdW5jdGlvbihpKXtcImZhbHNlXCI9PWkuZGF0YXNldC5sYXp5JiZcInRydWVcIiE9aS5kYXRhc2V0Lmxhenk/ZShpLHByb2Nlc3NTcmMoaSxpLmdldEF0dHJpYnV0ZShvLmRhdGFTcmMpKSk6KGkuY2xhc3NMaXN0LmFkZCh0KSxpLnNldEF0dHJpYnV0ZShcImktbGF6eS1zcmNcIixpLmdldEF0dHJpYnV0ZShvLmRhdGFTcmMpKSksaS5yZW1vdmVBdHRyaWJ1dGUoby5kYXRhU3JjKX0pLHIuYmluZChcIi5cIit0KSxyLmZpcmUoKX0sQS5kZWZhdWx0U3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQURVbEVRVlFJbVdOZ1lHQmdBQUFBQlFBQmg2Rk8xQUFBQUFCSlJVNUVya0pnZ2c9PVwiLGkuaW1nPUEsbW9kdWxlLmV4cG9ydHM9QX0od2luZG93LHdpbmRvdy5saWJ8fCh3aW5kb3cubGliPXt9KSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbGF6eWltZy9idWlsZC9pbWcuY29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cmJih3aW5kb3c9e2N0cmw6e30sbGliOnt9fSksIXdpbmRvdy5jdHJsJiYod2luZG93LmN0cmw9e30pLCF3aW5kb3cubGliJiYod2luZG93LmxpYj17fSksZnVuY3Rpb24obixlKXtmdW5jdGlvbiBpKCl7ZD13LmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKSx2PXcuY3JlYXRlRXZlbnQoXCJIVE1MRXZlbnRzXCIpLGQuaW5pdEV2ZW50KFwiX2FwcGVhclwiLCExLCEwKSx2LmluaXRFdmVudChcIl9kaXNhcHBlYXJcIiwhMSwhMCl9ZnVuY3Rpb24gYSh0LG4pe3ZhciBlLGksYSxzPShEYXRlLm5vdygpLDApLG89bnVsbCxyPWZ1bmN0aW9uKCl7cz1EYXRlLm5vdygpLG89bnVsbCx0LmFwcGx5KGUsaSl9O3JldHVybiBmdW5jdGlvbigpe3ZhciBsPURhdGUubm93KCk7ZT10aGlzLGk9YXJndW1lbnRzO3ZhciBjPW4tKGwtcyk7cmV0dXJuIDA+PWN8fGM+PW4/KGNsZWFyVGltZW91dChvKSxvPW51bGwsYT10LmFwcGx5KGUsaSkpOm51bGw9PW8mJihvPXNldFRpbWVvdXQocixjKSksYX19ZnVuY3Rpb24gcyhuLGUpe3ZhciBuLGksYSxzO2lmKG4pcmV0dXJuIGV8fChlPXt4OjAseTowfSksbiE9d2luZG93PyhuPW4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksaT1uLmxlZnQsdD1uLnRvcCxhPW4ucmlnaHQscz1uLmJvdHRvbSk6KGk9MCx0PTAsYT1pK24uaW5uZXJXaWR0aCxzPXQrbi5pbm5lckhlaWdodCkse2xlZnQ6aSx0b3A6dCxyaWdodDphK2UueCxib3R0b206cytlLnl9fWZ1bmN0aW9uIG8odCxuKXt2YXIgZT1uLnJpZ2h0PnQubGVmdCYmbi5sZWZ0PHQucmlnaHQsaT1uLmJvdHRvbT50LnRvcCYmbi50b3A8dC5ib3R0b207cmV0dXJuIGUmJml9ZnVuY3Rpb24gcih0LG4pe3ZhciBlPVwibm9uZVwiLGk9dC5sZWZ0LW4ubGVmdCxhPXQudG9wLW4udG9wO3JldHVybiAwPT1hJiYoZT0wIT1pP2k+MD9cImxlZnRcIjpcInJpZ2h0XCI6XCJub25lXCIpLDA9PWkmJihlPTAhPWE/YT4wP1widXBcIjpcImRvd25cIjpcIm5vbmVcIiksZX1mdW5jdGlvbiBsKHQsbil7Zm9yKHZhciBlIGluIG4pbi5oYXNPd25Qcm9wZXJ0eShlKSYmKHRbZV09bltlXSk7cmV0dXJuIHR9ZnVuY3Rpb24gYygpe3ZhciB0PXRoaXMsbj1hKGZ1bmN0aW9uKCl7Zi5hcHBseSh0LGFyZ3VtZW50cyl9LHRoaXMub3B0aW9ucy53YWl0KTt0aGlzLl9faGFuZGxlJiYodGhpcy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLHRoaXMuX19oYW5kbGUpLHRoaXMuX19oYW5kbGU9bnVsbCksdGhpcy5fX2hhbmRsZT1uLHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixuLCExKSx0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsZnVuY3Rpb24obil7Zi5hcHBseSh0LGFyZ3VtZW50cyl9LCExKSx0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uRW5kXCIsZnVuY3Rpb24oKXtmLmFwcGx5KHQsYXJndW1lbnRzKX0sITEpLHRoaXMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3ZWJraXRBbmltYXRpb25FbmRcIixmdW5jdGlvbigpe2YuYXBwbHkodCxhcmd1bWVudHMpfSwhMSksdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIixmdW5jdGlvbigpe2YuYXBwbHkodCxhcmd1bWVudHMpfSwhMSl9ZnVuY3Rpb24gcCh0KXt2YXIgbj10aGlzLGU9dGhpcy5vcHRpb25zLmNvbnRhaW5lcjtpZihcInN0cmluZ1wiPT10eXBlb2YgZT90aGlzLmNvbnRhaW5lcj13LnF1ZXJ5U2VsZWN0b3IoZSk6dGhpcy5jb250YWluZXI9ZSx0aGlzLmNvbnRhaW5lcj09d2luZG93KXZhciBpPXcucXVlcnlTZWxlY3RvckFsbCh0KTtlbHNlIHZhciBpPXRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwodCk7dmFyIGk9W10uc2xpY2UuY2FsbChpLG51bGwpO3JldHVybiBpPWkuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVyblwiMVwiPT10LmRhdGFzZXQuYmluZD8oZGVsZXRlIHQuX2hhc0FwcGVhcixkZWxldGUgdC5faGFzRGlzQXBwZWFyLGRlbGV0ZSB0Ll9hcHBlYXIsdC5jbGFzc0xpc3QucmVtb3ZlKG4ub3B0aW9ucy5jbHMpLCExKTohMH0pfWZ1bmN0aW9uIGgodCl7dmFyIG49dGhpczt0JiZ0Lmxlbmd0aD4wJiZbXS5mb3JFYWNoLmNhbGwodCxmdW5jdGlvbih0KXt0Ll9lbGVPZmZzZXQ9cyh0KSx0LmNsYXNzTGlzdC5yZW1vdmUobi5vcHRpb25zLmNscyksdC5kYXRhc2V0LmJpbmQ9MX0pfWZ1bmN0aW9uIGYoKXt2YXIgdD10aGlzLmNvbnRhaW5lcixuPXRoaXMuYXBwZWFyV2F0Y2hFbGVtZW50cyxlPXRoaXMub3B0aW9ucy5vbkFwcGVhcixpPXRoaXMub3B0aW9ucy5vbkRpc2FwcGVhcixhPXModCx7eDp0aGlzLm9wdGlvbnMueCx5OnRoaXMub3B0aW9ucy55fSksbD10aGlzLm9wdGlvbnMub25jZSxjPWFyZ3VtZW50c1swXXx8e307biYmbi5sZW5ndGg+MCYmW10uZm9yRWFjaC5jYWxsKG4sZnVuY3Rpb24odCxuKXt2YXIgcD1zKHQpLGg9cih0Ll9lbGVPZmZzZXQscCk7dC5fZWxlT2Zmc2V0PXA7dmFyIGY9byhhLHApLHU9dC5fYXBwZWFyLHc9dC5faGFzQXBwZWFyLEU9dC5faGFzRGlzQXBwZWFyO2QuZGF0YT17ZGlyZWN0aW9uOmh9LHYuZGF0YT17ZGlyZWN0aW9uOmh9LGYmJiF1PyhsJiYhd3x8IWwpJiYoZSYmZS5jYWxsKHQsYyksdC5kaXNwYXRjaEV2ZW50KGQpLHQuX2hhc0FwcGVhcj0hMCx0Ll9hcHBlYXI9ITApOiFmJiZ1JiYobCYmIUV8fCFsKSYmKGkmJmkuY2FsbCh0LGMpLHQuZGlzcGF0Y2hFdmVudCh2KSx0Ll9oYXNEaXNBcHBlYXI9ITAsdC5fYXBwZWFyPSExKX0pfWZ1bmN0aW9uIHUodCl7bCh0aGlzLm9wdGlvbnMsdHx8KHQ9e30pKSx0aGlzLmFwcGVhcldhdGNoRWxlbWVudHM9dGhpcy5hcHBlYXJXYXRjaEVsZW1lbnRzfHxwLmNhbGwodGhpcyxcIi5cIit0aGlzLm9wdGlvbnMuY2xzKSxoLmNhbGwodGhpcyx0aGlzLmFwcGVhcldhdGNoRWxlbWVudHMpLGMuY2FsbCh0aGlzKX12YXIgZCx2LHc9ZG9jdW1lbnQsRT1mdW5jdGlvbigpe3UuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxfPXtpbnN0YW5jZXM6W10saW5pdDpmdW5jdGlvbih0KXt2YXIgbj17b3B0aW9uczp7Y29udGFpbmVyOndpbmRvdyx3YWl0OjEwMCx4OjAseTowLGNsczpcImxpYi1hcHBlYXJcIixvbmNlOiExLG9uUmVzZXQ6ZnVuY3Rpb24oKXt9LG9uQXBwZWFyOmZ1bmN0aW9uKCl7fSxvbkRpc2FwcGVhcjpmdW5jdGlvbigpe319LGNvbnRhaW5lcjpudWxsLGFwcGVhcldhdGNoRWxlbWVudHM6bnVsbCxiaW5kOmZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMub3B0aW9ucy5jbHM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQpe3ZhciBlPXAuY2FsbCh0aGlzLHQpO1tdLmZvckVhY2guY2FsbChlLGZ1bmN0aW9uKHQsZSl7dC5jbGFzc0xpc3QuY29udGFpbnMobil8fHQuY2xhc3NMaXN0LmFkZChuKX0pfWVsc2V7aWYoMSE9dC5ub2RlVHlwZXx8IXRoaXMuY29udGFpbmVyLmNvbnRhaW5zKHQpKXJldHVybiB0aGlzO3QuY2xhc3NMaXN0LmNvbnRhaW5zKG4pfHx0LmNsYXNzTGlzdC5hZGQobil9dmFyIGk9cC5jYWxsKHRoaXMsXCIuXCIrdGhpcy5vcHRpb25zLmNscyk7cmV0dXJuIHRoaXMuYXBwZWFyV2F0Y2hFbGVtZW50cz10aGlzLmFwcGVhcldhdGNoRWxlbWVudHMuY29uY2F0KGkpLGguY2FsbCh0aGlzLGkpLHRoaXN9LHJlc2V0OmZ1bmN0aW9uKHQpe3JldHVybiB1LmNhbGwodGhpcyx0KSx0aGlzLmFwcGVhcldhdGNoRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbih0KXtkZWxldGUgdC5faGFzQXBwZWFyLGRlbGV0ZSB0Ll9oYXNEaXNBcHBlYXIsZGVsZXRlIHQuX2FwcGVhcn0pLHRoaXN9LGZpcmU6ZnVuY3Rpb24oKXt0aGlzLmFwcGVhcldhdGNoRWxlbWVudHN8fCh0aGlzLmFwcGVhcldhdGNoRWxlbWVudHM9W10pO3ZhciB0PXAuY2FsbCh0aGlzLFwiLlwiK3RoaXMub3B0aW9ucy5jbHMpO3JldHVybiB0aGlzLmFwcGVhcldhdGNoRWxlbWVudHM9dGhpcy5hcHBlYXJXYXRjaEVsZW1lbnRzLmNvbmNhdCh0KSxoLmNhbGwodGhpcyx0KSxmLmNhbGwodGhpcyksdGhpc319O0UucHJvdG90eXBlPW47dmFyIGU9bmV3IEUodCk7cmV0dXJuIHRoaXMuaW5zdGFuY2VzLnB1c2goZSksZX0sZmlyZUFsbDpmdW5jdGlvbigpe3ZhciB0PXRoaXMuaW5zdGFuY2VzO3QuZm9yRWFjaChmdW5jdGlvbih0KXt0LmZpcmUoKX0pfX07aSgpLGUuYXBwZWFyPV99KHdpbmRvdyx3aW5kb3cubGlifHwod2luZG93LmxpYj17fSkpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2FwcGVhcmpzL2J1aWxkL2FwcGVhci5jb21tb24uanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBjb25maWc6XG4gICAqICAgLSBzdHlsZXNcbiAgICogICAtIGR1cmF0aW9uIFtOdW1iZXJdIG1pbGxpc2Vjb25kcyhtcylcbiAgICogICAtIHRpbWluZ0Z1bmN0aW9uIFtzdHJpbmddXG4gICAqICAgLSBkZWFseSBbTnVtYmVyXSBtaWxsaXNlY29uZHMobXMpXG4gICAqL1xuICB0cmFuc2l0aW9uT25jZTogZnVuY3Rpb24gKGNvbXAsIGNvbmZpZywgY2FsbGJhY2spIHtcbiAgICB2YXIgc3R5bGVzID0gY29uZmlnLnN0eWxlcyB8fCB7fVxuICAgIHZhciBkdXJhdGlvbiA9IGNvbmZpZy5kdXJhdGlvbiB8fCAxMDAwIC8vIG1zXG4gICAgdmFyIHRpbWluZ0Z1bmN0aW9uID0gY29uZmlnLnRpbWluZ0Z1bmN0aW9uIHx8ICdlYXNlJ1xuICAgIHZhciBkZWxheSA9IGNvbmZpZy5kZWxheSB8fCAwICAvLyBtc1xuICAgIHZhciB0cmFuc2l0aW9uVmFsdWUgPSAnYWxsICcgKyBkdXJhdGlvbiArICdtcyAnXG4gICAgICAgICsgdGltaW5nRnVuY3Rpb24gKyAnICcgKyBkZWxheSArICdtcydcbiAgICB2YXIgZG9tID0gY29tcC5ub2RlXG4gICAgdmFyIHRyYW5zaXRpb25FbmRIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIGRvbS5yZW1vdmVFdmVudExpc3RlbmVyKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgdHJhbnNpdGlvbkVuZEhhbmRsZXIpXG4gICAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRyYW5zaXRpb25FbmRIYW5kbGVyKVxuICAgICAgZG9tLnN0eWxlLnRyYW5zaXRpb24gPSAnJ1xuICAgICAgZG9tLnN0eWxlLndlYmtpdFRyYW5zaXRpb24gPSAnJ1xuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgICBkb20uc3R5bGUudHJhbnNpdGlvbiA9IHRyYW5zaXRpb25WYWx1ZVxuICAgIGRvbS5zdHlsZS53ZWJraXRUcmFuc2l0aW9uID0gdHJhbnNpdGlvblZhbHVlXG4gICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCB0cmFuc2l0aW9uRW5kSGFuZGxlcilcbiAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRyYW5zaXRpb25FbmRIYW5kbGVyKVxuICAgIGNvbXAudXBkYXRlU3R5bGUoc3R5bGVzKVxuICB9XG5cbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2FuaW1hdGlvbi5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpXG52YXIgQ29tcG9uZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudE1hbmFnZXInKVxudmFyIGZsZXhib3ggPSByZXF1aXJlKCcuLi9mbGV4Ym94JylcbnJlcXVpcmUoJ2ZpeGVkc3RpY2t5JylcblxuZnVuY3Rpb24gQ29tcG9uZW50KGRhdGEsIG5vZGVUeXBlKSB7XG4gIHRoaXMuZGF0YSA9IGRhdGFcbiAgdGhpcy5ub2RlID0gdGhpcy5jcmVhdGUobm9kZVR5cGUpXG5cbiAgdGhpcy5jcmVhdGVDaGlsZHJlbigpXG4gIHRoaXMudXBkYXRlQXR0cnModGhpcy5kYXRhLmF0dHIpXG4gIC8vIGlzc3VlOiB3aGVuIGFkZCBlbGVtZW50IHRvIGEgbGlzdCBpbiBsaWZldGltZSBob29rICdyZWFkeScsIHRoZVxuICAvLyBzdHlsZXMgaXMgc2V0IHRvIHRoZSBjbGFzc1N0eWxlLCBub3Qgc3R5bGUuIFRoaXMgaXMgYSBpc3N1ZVxuICAvLyB0aGF0IGpzZnJhbWV3b3JrIHNob3VsZCBkbyBzb21ldGhpbmcgYWJvdXQuXG4gIHZhciBjbGFzc1N0eWxlID0gdGhpcy5kYXRhLmNsYXNzU3R5bGVcbiAgY2xhc3NTdHlsZSAmJiB0aGlzLnVwZGF0ZVN0eWxlKHRoaXMuZGF0YS5jbGFzc1N0eWxlKVxuICB0aGlzLnVwZGF0ZVN0eWxlKHRoaXMuZGF0YS5zdHlsZSlcbiAgdGhpcy5iaW5kRXZlbnRzKHRoaXMuZGF0YS5ldmVudClcbn1cblxuQ29tcG9uZW50LnByb3RvdHlwZSA9IHtcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChub2RlVHlwZSkge1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlVHlwZSB8fCAnZGl2JylcbiAgICByZXR1cm4gbm9kZVxuICB9LFxuXG4gIGdldENvbXBvbmVudE1hbmFnZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQ29tcG9uZW50TWFuYWdlci5nZXRJbnN0YW5jZSh0aGlzLmRhdGEuaW5zdGFuY2VJZClcbiAgfSxcblxuICBnZXRQYXJlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKCkuY29tcG9uZW50TWFwW3RoaXMucGFyZW50UmVmXVxuICB9LFxuXG4gIGlzU2Nyb2xsYWJsZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ID0gdGhpcy5kYXRhLnR5cGVcbiAgICByZXR1cm4gQ29tcG9uZW50TWFuYWdlci5nZXRTY3JvbGxhYmxlVHlwZXMoKS5pbmRleE9mKHQpICE9PSAtMVxuICB9LFxuXG4gIGlzSW5TY3JvbGxhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9pc0luU2Nyb2xsYWJsZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNJblNjcm9sbGFibGVcbiAgICB9XG4gICAgdmFyIHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KClcbiAgICBpZiAocGFyZW50XG4gICAgICAgICYmICh0eXBlb2YgcGFyZW50Ll9pc0luU2Nyb2xsYWJsZSAhPT0gJ2Jvb2xlYW4nKVxuICAgICAgICAmJiAhcGFyZW50LmlzU2Nyb2xsYWJsZSgpKSB7XG4gICAgICBpZiAocGFyZW50LmRhdGEudHlwZSA9PT0gJ3Jvb3QnKSB7XG4gICAgICAgIHRoaXMuX2lzSW5TY3JvbGxhYmxlID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICB0aGlzLl9pc0luU2Nyb2xsYWJsZSA9IHBhcmVudC5pc0luU2Nyb2xsYWJsZSgpXG4gICAgICB0aGlzLl9wYXJlbnRTY3JvbGxlciA9IHBhcmVudC5fcGFyZW50U2Nyb2xsZXJcbiAgICAgIHJldHVybiB0aGlzLl9pc0luU2Nyb2xsYWJsZVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcmVudC5faXNJblNjcm9sbGFibGUgPT09ICdib29sZWFuJykge1xuICAgICAgdGhpcy5faXNJblNjcm9sbGFibGUgPSBwYXJlbnQuX2lzSW5TY3JvbGxhYmxlXG4gICAgICB0aGlzLl9wYXJlbnRTY3JvbGxlciA9IHBhcmVudC5fcGFyZW50U2Nyb2xsZXJcbiAgICAgIHJldHVybiB0aGlzLl9pc0luU2Nyb2xsYWJsZVxuICAgIH1cbiAgICBpZiAocGFyZW50LmlzU2Nyb2xsYWJsZSgpKSB7XG4gICAgICB0aGlzLl9pc0luU2Nyb2xsYWJsZSA9IHRydWVcbiAgICAgIHRoaXMuX3BhcmVudFNjcm9sbGVyID0gcGFyZW50XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBpZiAoIXBhcmVudCkge1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmVycm9yKCdpc0luU2Nyb2xsYWJsZSAtIHBhcmVudCBub3QgZXhpc3QuJylcbiAgICB9XG4gIH0sXG5cbiAgY3JlYXRlQ2hpbGRyZW46IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmRhdGEuY2hpbGRyZW5cbiAgICB2YXIgcGFyZW50UmVmID0gdGhpcy5kYXRhLnJlZlxuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICAgIHZhciBpc0ZsZXggPSBmYWxzZVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjaGlsZHJlbltpXS5pbnN0YW5jZUlkID0gdGhpcy5kYXRhLmluc3RhbmNlSWRcbiAgICAgICAgY2hpbGRyZW5baV0uc2NhbGUgPSB0aGlzLmRhdGEuc2NhbGVcbiAgICAgICAgdmFyIGNoaWxkID0gY29tcG9uZW50TWFuYWdlci5jcmVhdGVFbGVtZW50KGNoaWxkcmVuW2ldKVxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZC5ub2RlKVxuICAgICAgICBjaGlsZC5wYXJlbnRSZWYgPSBwYXJlbnRSZWZcbiAgICAgICAgaWYgKCFpc0ZsZXhcbiAgICAgICAgICAgICYmIGNoaWxkLmRhdGEuc3R5bGVcbiAgICAgICAgICAgICYmIGNoaWxkLmRhdGEuc3R5bGUuaGFzT3duUHJvcGVydHkoJ2ZsZXgnKVxuICAgICAgICAgICkge1xuICAgICAgICAgIGlzRmxleCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKGZyYWdtZW50KVxuICAgIH1cbiAgfSxcblxuICAvLyBAdG9kbzogY2hhbmdlZCBwYXJhbSBkYXRhIHRvIGNoaWxkXG4gIGFwcGVuZENoaWxkOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuZGF0YS5jaGlsZHJlblxuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICB2YXIgY2hpbGQgPSBjb21wb25lbnRNYW5hZ2VyLmNyZWF0ZUVsZW1lbnQoZGF0YSlcbiAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQoY2hpbGQubm9kZSlcbiAgICAvLyB1cGRhdGUgdGhpcy5kYXRhLmNoaWxkcmVuXG4gICAgaWYgKCFjaGlsZHJlbiB8fCAhY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICB0aGlzLmRhdGEuY2hpbGRyZW4gPSBbZGF0YV1cbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGRyZW4ucHVzaChkYXRhKVxuICAgIH1cblxuICAgIHJldHVybiBjaGlsZFxuICB9LFxuXG4gIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKGNoaWxkLCBiZWZvcmUpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmRhdGEuY2hpbGRyZW5cbiAgICB2YXIgaSA9IDBcbiAgICB2YXIgbFxuICAgIHZhciBpc0FwcGVuZCA9IGZhbHNlXG5cbiAgICAvLyB1cGRhdGUgdGhpcy5kYXRhLmNoaWxkcmVuXG4gICAgaWYgKCFjaGlsZHJlbiB8fCAhY2hpbGRyZW4ubGVuZ3RoIHx8ICFiZWZvcmUpIHtcbiAgICAgIGlzQXBwZW5kID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGNoaWxkcmVuW2ldLnJlZiA9PT0gYmVmb3JlLmRhdGEucmVmKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IGwpIHtcbiAgICAgICAgaXNBcHBlbmQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG5cbiAgICBpZiAoaXNBcHBlbmQpIHtcbiAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChjaGlsZC5ub2RlKVxuICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZC5kYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vZGUuaW5zZXJ0QmVmb3JlKGNoaWxkLm5vZGUsIGJlZm9yZS5ub2RlKVxuICAgICAgY2hpbGRyZW4uc3BsaWNlKGksIDAsIGNoaWxkLmRhdGEpXG4gICAgfVxuXG4gIH0sXG5cbiAgcmVtb3ZlQ2hpbGQ6IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuZGF0YS5jaGlsZHJlblxuICAgIC8vIHJlbW92ZSBmcm9tIHRoaXMuZGF0YS5jaGlsZHJlblxuICAgIHZhciBpID0gMFxuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGlsZHJlbltpXS5yZWYgPT09IGNoaWxkLmRhdGEucmVmKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPCBsKSB7XG4gICAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyByZW1vdmUgZnJvbSBjb21wb25lbnRNYXAgcmVjdXJzaXZlbHlcbiAgICBjb21wb25lbnRNYW5hZ2VyLnJlbW92ZUVsZW1lbnRCeVJlZihjaGlsZC5kYXRhLnJlZilcbiAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQubm9kZSlcbiAgfSxcblxuICB1cGRhdGVBdHRyczogZnVuY3Rpb24gKGF0dHJzKSB7XG4gICAgLy8gTm90Ze+8mmF0dHIgbXVzdCBiZSBpbmplY3RlZCBpbnRvIHRoZSBkb20gZWxlbWVudCBiZWNhdXNlXG4gICAgLy8gaXQgd2lsbCBiZSBhY2Nlc3NlZCBmcm9tIHRoZSBvdXRzaWRlIGRldmVsb3BlciBieSBldmVudC50YXJnZXQuYXR0ci5cbiAgICBpZiAoIXRoaXMubm9kZS5hdHRyKSB7XG4gICAgICB0aGlzLm5vZGUuYXR0ciA9IHt9XG4gICAgfVxuICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgdmFyIHZhbHVlID0gYXR0cnNba2V5XVxuICAgICAgdmFyIGF0dHJTZXR0ZXIgPSB0aGlzLmF0dHJba2V5XVxuICAgICAgaWYgKHR5cGVvZiBhdHRyU2V0dGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGF0dHJTZXR0ZXIuY2FsbCh0aGlzLCB2YWx1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIHRoaXMubm9kZVtrZXldID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5vZGUuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub2RlLmF0dHJba2V5XSA9IHZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZVN0eWxlOiBmdW5jdGlvbiAoc3R5bGUpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc3R5bGUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHN0eWxlW2tleV1cbiAgICAgIHZhciBzdHlsZVNldHRlciA9IHRoaXMuc3R5bGVba2V5XVxuXG4gICAgICBpZiAodHlwZW9mIHN0eWxlU2V0dGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHN0eWxlU2V0dGVyLmNhbGwodGhpcywgdmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgJiYgKGtleSAhPT0gJ2ZsZXgnICYmIGtleSAhPT0gJ29wYWNpdHknICYmIGtleSAhPT0gJ3pJbmRleCcpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSAqIHRoaXMuZGF0YS5zY2FsZSArICdweCdcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vZGUuc3R5bGVba2V5XSA9IHZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGJpbmRFdmVudHM6IGZ1bmN0aW9uIChldnRzKSB7XG4gICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLmdldENvbXBvbmVudE1hbmFnZXIoKVxuICAgIGlmIChldnRzXG4gICAgICAgICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChldnRzKS5zbGljZSg4LCAtMSkgPT09ICdBcnJheSdcbiAgICAgICkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBldnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb21wb25lbnRNYW5hZ2VyLmFkZEV2ZW50KHRoaXMsIGV2dHNbaV0pXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vIGRpc3BhdGNoIGEgc3BlY2lmaWVkIGV2ZW50IG9uIHRoaXMubm9kZVxuICAvLyAgLSB0eXBlOiBldmVudCB0eXBlXG4gIC8vICAtIGRhdGE6IGV2ZW50IGRhdGFcbiAgLy8gIC0gY29uZmlnOiBldmVudCBjb25maWcgb2JqZWN0XG4gIC8vICAgICAtIGJ1YmJsZXNcbiAgLy8gICAgIC0gY2FuY2VsYWJsZVxuICBkaXNwYXRjaEV2ZW50OiBmdW5jdGlvbiAodHlwZSwgZGF0YSwgY29uZmlnKSB7XG4gICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKVxuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fVxuICAgIGV2ZW50LmluaXRFdmVudCh0eXBlLCBjb25maWcuYnViYmxlcyB8fCBmYWxzZSwgY29uZmlnLmNhbmNlbGFibGUgfHwgZmFsc2UpXG4gICAgIWRhdGEgJiYgKGRhdGEgPSB7fSlcbiAgICBldmVudC5kYXRhID0gdXRpbHMuZXh0ZW5kKHt9LCBkYXRhKVxuICAgIHV0aWxzLmV4dGVuZChldmVudCwgZGF0YSlcbiAgICBpZiAodHlwZSA9PT0gJ2FwcGVhcicpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdhcHBlYXInLCBkYXRhKVxuICAgIH1cbiAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChldmVudClcbiAgfSxcblxuICB1cGRhdGVSZWN1cnNpdmVBdHRyOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMudXBkYXRlQXR0cnMoZGF0YS5hdHRyKVxuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmRhdGEuY2hpbGRyZW5cbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY29tcG9uZW50TWFuYWdlci5nZXRFbGVtZW50QnlSZWYoY2hpbGRyZW5baV0ucmVmKVxuICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICBjaGlsZC51cGRhdGVSZWN1cnNpdmVBdHRyKGRhdGEuY2hpbGRyZW5baV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlUmVjdXJzaXZlU3R5bGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy51cGRhdGVTdHlsZShkYXRhLnN0eWxlKVxuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmRhdGEuY2hpbGRyZW5cbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY29tcG9uZW50TWFuYWdlci5nZXRFbGVtZW50QnlSZWYoY2hpbGRyZW5baV0ucmVmKVxuICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICBjaGlsZC51cGRhdGVSZWN1cnNpdmVTdHlsZShkYXRhLmNoaWxkcmVuW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZVJlY3Vyc2l2ZUFsbDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnVwZGF0ZUF0dHJzKGRhdGEuYXR0cilcbiAgICB0aGlzLnVwZGF0ZVN0eWxlKGRhdGEuc3R5bGUpXG4gICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLmdldENvbXBvbmVudE1hbmFnZXIoKVxuXG4gICAgLy8gdmFyIG9sZFJlZiA9IHRoaXMuZGF0YS5yZWZcbiAgICAvLyBpZiAoY29tcG9uZW50TWFwW29sZFJlZl0pIHtcbiAgICAvLyAgIGRlbGV0ZSBjb21wb25lbnRNYXBbb2xkUmVmXVxuICAgIC8vIH1cbiAgICAvLyB0aGlzLmRhdGEucmVmID0gZGF0YS5yZWZcbiAgICAvLyBjb21wb25lbnRNYXBbZGF0YS5yZWZdID0gdGhpc1xuXG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5kYXRhLmNoaWxkcmVuXG4gICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGNvbXBvbmVudE1hbmFnZXIuZ2V0RWxlbWVudEJ5UmVmKGNoaWxkcmVuW2ldLnJlZilcbiAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgY2hpbGQudXBkYXRlUmVjdXJzaXZlQWxsKGRhdGEuY2hpbGRyZW5baV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYXR0cjoge30sIC8vIGF0dHIgc2V0dGVyc1xuXG4gIHN0eWxlOiBPYmplY3QuY3JlYXRlKGZsZXhib3gpLCAvLyBzdHlsZSBzZXR0ZXJzXG5cbiAgY2xlYXJBdHRyOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG5cbiAgY2xlYXJTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubm9kZS5jc3NUZXh0ID0gJydcbiAgfVxufVxuXG5Db21wb25lbnQucHJvdG90eXBlLnN0eWxlLnBvc2l0aW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIC8vIFRPRE86IG1ha2UgaXQgaW4gYSBkZWNlbnQgaW1wbGVtZW50YXRpb25cbiAgaWYgKHZhbHVlID09PSAnc3RpY2t5Jykge1xuICAgIHRoaXMubm9kZS5zdHlsZS56SW5kZXggPSAxMDBcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc3RpY2t5ID0gbmV3IGxpYi5zdGlja3kodGhpcy5ub2RlLCB7XG4gICAgICAgIHRvcDogMFxuICAgICAgfSlcbiAgICB9LmJpbmQodGhpcyksIDApXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ub2RlLnN0eWxlLnBvc2l0aW9uID0gdmFsdWVcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudFxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL2NvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxuLy8gRmxleGJveCBwb2x5ZmlsbFxudmFyIGZsZXhib3hTZXR0ZXJzID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEJPWF9BTElHTiA9IHtcbiAgICBzdHJldGNoOiAnc3RyZXRjaCcsXG4gICAgJ2ZsZXgtc3RhcnQnOiAnc3RhcnQnLFxuICAgICdmbGV4LWVuZCc6ICdlbmQnLFxuICAgIGNlbnRlcjogJ2NlbnRlcidcbiAgfVxuICB2YXIgQk9YX09SSUVOVCA9IHtcbiAgICByb3c6ICdob3Jpem9udGFsJyxcbiAgICBjb2x1bW46ICd2ZXJ0aWNhbCdcbiAgfVxuICB2YXIgQk9YX1BBQ0sgPSB7XG4gICAgJ2ZsZXgtc3RhcnQnOiAnc3RhcnQnLFxuICAgICdmbGV4LWVuZCc6ICdlbmQnLFxuICAgIGNlbnRlcjogJ2NlbnRlcicsXG4gICAgJ3NwYWNlLWJldHdlZW4nOiAnanVzdGlmeScsXG4gICAgJ3NwYWNlLWFyb3VuZCc6ICdqdXN0aWZ5JyAvLyBKdXN0IHNhbWUgYXMgYHNwYWNlLWJldHdlZW5gXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBmbGV4OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHRoaXMubm9kZS5zdHlsZS53ZWJraXRCb3hGbGV4ID0gdmFsdWVcbiAgICAgIHRoaXMubm9kZS5zdHlsZS53ZWJraXRGbGV4ID0gdmFsdWVcbiAgICAgIHRoaXMubm9kZS5zdHlsZS5mbGV4ID0gdmFsdWVcbiAgICB9LFxuICAgIGFsaWduSXRlbXM6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdGhpcy5ub2RlLnN0eWxlLndlYmtpdEJveEFsaWduID0gQk9YX0FMSUdOW3ZhbHVlXVxuICAgICAgdGhpcy5ub2RlLnN0eWxlLndlYmtpdEFsaWduSXRlbXMgPSB2YWx1ZVxuICAgICAgdGhpcy5ub2RlLnN0eWxlLmFsaWduSXRlbXMgPSB2YWx1ZVxuICAgIH0sXG4gICAgYWxpZ25TZWxmOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHRoaXMubm9kZS5zdHlsZS53ZWJraXRBbGlnblNlbGYgPSB2YWx1ZVxuICAgICAgdGhpcy5ub2RlLnN0eWxlLmFsaWduU2VsZiA9IHZhbHVlXG4gICAgfSxcbiAgICBmbGV4RGlyZWN0aW9uOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHRoaXMubm9kZS5zdHlsZS53ZWJraXRCb3hPcmllbnQgPSBCT1hfT1JJRU5UW3ZhbHVlXVxuICAgICAgdGhpcy5ub2RlLnN0eWxlLndlYmtpdEZsZXhEaXJlY3Rpb24gPSB2YWx1ZVxuICAgICAgdGhpcy5ub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSB2YWx1ZVxuICAgIH0sXG4gICAganVzdGlmeUNvbnRlbnQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdGhpcy5ub2RlLnN0eWxlLndlYmtpdEJveFBhY2sgPSBCT1hfUEFDS1t2YWx1ZV1cbiAgICAgIHRoaXMubm9kZS5zdHlsZS53ZWJraXRKdXN0aWZ5Q29udGVudCA9IHZhbHVlXG4gICAgICB0aGlzLm5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSB2YWx1ZVxuICAgIH1cbiAgfVxufSkoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsZXhib3hTZXR0ZXJzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2ZsZXhib3guanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSAmJiAod2luZG93ID0ge2N0cmw6IHt9LCBsaWI6IHt9fSk7IXdpbmRvdy5jdHJsICYmICh3aW5kb3cuY3RybCA9IHt9KTshd2luZG93LmxpYiAmJiAod2luZG93LmxpYiA9IHt9KTshZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7cmV0dXJuIG51bGwhPWEmJlwib2JqZWN0XCI9PXR5cGVvZiBhJiZPYmplY3QuZ2V0UHJvdG90eXBlT2YoYSk9PU9iamVjdC5wcm90b3R5cGV9ZnVuY3Rpb24gZShhLGIpe3ZhciBjLGQsZSxmPW51bGwsZz0wLGg9ZnVuY3Rpb24oKXtnPURhdGUubm93KCksZj1udWxsLGU9YS5hcHBseShjLGQpfTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgaT1EYXRlLm5vdygpLGo9Yi0oaS1nKTtyZXR1cm4gYz10aGlzLGQ9YXJndW1lbnRzLDA+PWo/KGNsZWFyVGltZW91dChmKSxmPW51bGwsZz1pLGU9YS5hcHBseShjLGQpKTpmfHwoZj1zZXRUaW1lb3V0KGgsaikpLGV9fWZ1bmN0aW9uIGYoYSl7dmFyIGI9XCJcIjtyZXR1cm4gT2JqZWN0LmtleXMoYSkuZm9yRWFjaChmdW5jdGlvbihjKXtiKz1jK1wiOlwiK2FbY10rXCI7XCJ9KSxifWZ1bmN0aW9uIGcoYSxjKXshYyYmZChhKSYmKGM9YSxhPWMuZWxlbWVudCksYz1jfHx7fSxhLm5vZGVUeXBlIT1iLkVMRU1FTlRfTk9ERSYmXCJzdHJpbmdcIj09dHlwZW9mIGEmJihhPWIucXVlcnlTZWxlY3RvcihhKSk7dmFyIGU9dGhpcztlLmVsZW1lbnQ9YSxlLnRvcD1jLnRvcHx8MCxlLndpdGhpblBhcmVudD12b2lkIDA9PWMud2l0aGluUGFyZW50PyExOmMud2l0aGluUGFyZW50LGUuaW5pdCgpfXZhciBoPWEucGFyc2VJbnQsaT1uYXZpZ2F0b3IudXNlckFnZW50LGo9ISFpLm1hdGNoKC9GaXJlZm94L2kpLGs9ISFpLm1hdGNoKC9JRU1vYmlsZS9pKSxsPWo/XCItbW96LVwiOms/XCItbXMtXCI6XCItd2Via2l0LVwiLG09aj9cIk1velwiOms/XCJtc1wiOlwid2Via2l0XCIsbj1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKSxjPWEuc3R5bGU7cmV0dXJuIGMuY3NzVGV4dD1cInBvc2l0aW9uOlwiK2wrXCJzdGlja3k7cG9zaXRpb246c3RpY2t5O1wiLC0xIT1jLnBvc2l0aW9uLmluZGV4T2YoXCJzdGlja3lcIil9KCk7Zy5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOmcsaW5pdDpmdW5jdGlvbigpe3ZhciBhPXRoaXMsYj1hLmVsZW1lbnQsYz1iLnN0eWxlO2NbbStcIlRyYW5zZm9ybVwiXT1cInRyYW5zbGF0ZVooMClcIixjLnRyYW5zZm9ybT1cInRyYW5zbGF0ZVooMClcIixhLl9vcmlnaW5Dc3NUZXh0PWMuY3NzVGV4dCxuPyhjLnBvc2l0aW9uPWwrXCJzdGlja3lcIixjLnBvc2l0aW9uPVwic3RpY2t5XCIsYy50b3A9YS50b3ArXCJweFwiKTooYS5fc2ltdWxhdGVTdGlja3koKSxhLl9iaW5kUmVzaXplKCkpfSxfYmluZFJlc2l6ZTpmdW5jdGlvbigpe3ZhciBiPXRoaXMsYz0vYW5kcm9pZC9naS50ZXN0KG5hdmlnYXRvci5hcHBWZXJzaW9uKSxkPWIuX3Jlc2l6ZUV2ZW50PVwib25vcmllbnRhdGlvbmNoYW5nZVwiaW4gYT9cIm9yaWVudGF0aW9uY2hhbmdlXCI6XCJyZXNpemVcIixlPWIuX3Jlc2l6ZUhhbmRsZXI9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi5yZWZyZXNoKCl9LGM/MjAwOjApfTthLmFkZEV2ZW50TGlzdGVuZXIoZCxlLCExKX0scmVmcmVzaDpmdW5jdGlvbigpe3ZhciBhPXRoaXM7bnx8KGEuX2RldGFjaCgpLGEuX3NpbXVsYXRlU3RpY2t5KCkpfSxfYWRkUGxhY2Vob2xkZXI6ZnVuY3Rpb24oYSl7dmFyIGMsZD10aGlzLGU9ZC5lbGVtZW50LGc9YS5wb3NpdGlvbjtpZigtMSE9W1wic3RhdGljXCIsXCJyZWxhdGl2ZVwiXS5pbmRleE9mKGcpKXtjPWQuX3BsYWNlaG9sZGVyRWxlbWVudD1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dmFyIGk9aChhLndpZHRoKStoKGEubWFyZ2luTGVmdCkraChhLm1hcmdpblJpZ2h0KSxqPWgoYS5oZWlnaHQpO1wiYm9yZGVyLWJveFwiIT1hLmJveFNpemluZyYmKGkrPWgoYS5ib3JkZXJMZWZ0V2lkdGgpK2goYS5ib3JkZXJSaWdodFdpZHRoKStoKGEucGFkZGluZ0xlZnQpK2goYS5wYWRkaW5nUmlnaHQpLGorPWgoYS5ib3JkZXJUb3BXaWR0aCkraChhLmJvcmRlckJvdHRvbVdpZHRoKStoKGEucGFkZGluZ1RvcCkraChhLnBhZGRpbmdCb3R0b20pKSxjLnN0eWxlLmNzc1RleHQ9Zih7ZGlzcGxheTpcIm5vbmVcIix2aXNpYmlsaXR5OlwiaGlkZGVuXCIsd2lkdGg6aStcInB4XCIsaGVpZ2h0OmorXCJweFwiLG1hcmdpbjowLFwibWFyZ2luLXRvcFwiOmEubWFyZ2luVG9wLFwibWFyZ2luLWJvdHRvbVwiOmEubWFyZ2luQm90dG9tLGJvcmRlcjowLHBhZGRpbmc6MCxcImZsb2F0XCI6YVtcImZsb2F0XCJdfHxhLmNzc0Zsb2F0fSksZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjLGUpfXJldHVybiBjfSxfc2ltdWxhdGVTdGlja3k6ZnVuY3Rpb24oKXt2YXIgYz10aGlzLGQ9Yy5lbGVtZW50LGc9Yy50b3AsaT1kLnN0eWxlLGo9ZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxrPWdldENvbXB1dGVkU3R5bGUoZCxcIlwiKSxsPWQucGFyZW50Tm9kZSxtPWdldENvbXB1dGVkU3R5bGUobCxcIlwiKSxuPWMuX2FkZFBsYWNlaG9sZGVyKGspLG89Yy53aXRoaW5QYXJlbnQscD1jLl9vcmlnaW5Dc3NUZXh0LHE9ai50b3AtZythLnBhZ2VZT2Zmc2V0LHI9bC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20taChtLnBhZGRpbmdCb3R0b20pLWgobS5ib3JkZXJCb3R0b21XaWR0aCktaChrLm1hcmdpbkJvdHRvbSktai5oZWlnaHQtZythLnBhZ2VZT2Zmc2V0LHM9cCtmKHtwb3NpdGlvbjpcImZpeGVkXCIsdG9wOmcrXCJweFwiLHdpZHRoOmsud2lkdGgsXCJtYXJnaW4tdG9wXCI6MH0pLHQ9cCtmKHtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOnIrXCJweFwiLHdpZHRoOmsud2lkdGh9KSx1PTEsdj1jLl9zY3JvbGxIYW5kbGVyPWUoZnVuY3Rpb24oKXt2YXIgYj1hLnBhZ2VZT2Zmc2V0O3E+Yj8xIT11JiYoaS5jc3NUZXh0PXAsbiYmKG4uc3R5bGUuZGlzcGxheT1cIm5vbmVcIiksdT0xKTohbyYmYj49cXx8byYmYj49cSYmcj5iPzIhPXUmJihpLmNzc1RleHQ9cyxuJiYzIT11JiYobi5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIiksdT0yKTpvJiYzIT11JiYoaS5jc3NUZXh0PXQsbiYmMiE9dSYmKG4uc3R5bGUuZGlzcGxheT1cImJsb2NrXCIpLHU9Myl9LDEwMCk7aWYoYS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsdiwhMSksYS5wYWdlWU9mZnNldD49cSl7dmFyIHc9Yi5jcmVhdGVFdmVudChcIkhUTUxFdmVudHNcIik7dy5pbml0RXZlbnQoXCJzY3JvbGxcIiwhMCwhMCksYS5kaXNwYXRjaEV2ZW50KHcpfX0sX2RldGFjaDpmdW5jdGlvbigpe3ZhciBiPXRoaXMsYz1iLmVsZW1lbnQ7aWYoYy5zdHlsZS5jc3NUZXh0PWIuX29yaWdpbkNzc1RleHQsIW4pe3ZhciBkPWIuX3BsYWNlaG9sZGVyRWxlbWVudDtkJiZjLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYS5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYi5fc2Nyb2xsSGFuZGxlciwhMSl9fSxkZXN0cm95OmZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLl9kZXRhY2goKTt2YXIgYz1iLmVsZW1lbnQuc3R5bGU7Yy5yZW1vdmVQcm9wZXJ0eShsK1widHJhbnNmb3JtXCIpLGMucmVtb3ZlUHJvcGVydHkoXCJ0cmFuc2Zvcm1cIiksbnx8YS5yZW1vdmVFdmVudExpc3RlbmVyKGIuX3Jlc2l6ZUV2ZW50LGIuX3Jlc2l6ZUhhbmRsZXIsITEpfX0sYy5zdGlja3k9Z30od2luZG93LGRvY3VtZW50LHdpbmRvdy5saWJ8fCh3aW5kb3cubGliPXt9KSk7O21vZHVsZS5leHBvcnRzID0gd2luZG93LmxpYlsnc3RpY2t5J107XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZml4ZWRzdGlja3kvYnVpbGQvc3RpY2t5LmNvbW1vbi5qc1xuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG52YXIgX3NlbmRlck1hcCA9IHt9XG5cbmZ1bmN0aW9uIFNlbmRlcihpbnN0YW5jZSkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU2VuZGVyKSkge1xuICAgIHJldHVybiBuZXcgU2VuZGVyKGluc3RhbmNlKVxuICB9XG4gIHRoaXMuaW5zdGFuY2VJZCA9IGluc3RhbmNlLmluc3RhbmNlSWRcbiAgdGhpcy53ZWV4SW5zdGFuY2UgPSBpbnN0YW5jZVxuICBfc2VuZGVyTWFwW3RoaXMuaW5zdGFuY2VJZF0gPSB0aGlzXG59XG5cbmZ1bmN0aW9uIF9zZW5kKGluc3RhbmNlSWQsIG1zZykge1xuICBjYWxsSlMoaW5zdGFuY2VJZCwgW21zZ10pXG59XG5cblNlbmRlci5nZXRTZW5kZXIgPSBmdW5jdGlvbiAoaW5zdGFuY2VJZCkge1xuICByZXR1cm4gX3NlbmRlck1hcFtpbnN0YW5jZUlkXVxufVxuXG5TZW5kZXIucHJvdG90eXBlID0ge1xuXG4gIC8vIHBlcmZvcm0gYSBjYWxsYmFjayB0byBqc2ZyYW1ld29yay5cbiAgcGVyZm9ybUNhbGxiYWNrOiBmdW5jdGlvbiAoY2FsbGJhY2tJZCwgZGF0YSkge1xuICAgIHZhciBhcmdzID0gW2NhbGxiYWNrSWRdXG4gICAgZGF0YSAmJiBhcmdzLnB1c2goZGF0YSlcbiAgICBfc2VuZCh0aGlzLmluc3RhbmNlSWQsIHtcbiAgICAgIG1ldGhvZDogJ2NhbGxiYWNrJyxcbiAgICAgIGFyZ3M6IGFyZ3NcbiAgICB9KVxuICB9LFxuXG4gIGZpcmVFdmVudDogZnVuY3Rpb24gKHJlZiwgdHlwZSwgZXZlbnQpIHtcbiAgICAvLyBOb3RlIHRoYXQgdGhlIGV2ZW50LnRhcmdldCBtdXN0IGJlIHRoZSBzdGFuZGFyZCBldmVudCdzXG4gICAgLy8gY3VycmVudFRhcmdldC4gVGhlcmVmb3IgYSBwcm9jZXNzIGZvciByZXBsYWNpbmcgdGFyZ2V0IG11c3RcbiAgICAvLyBiZSBkb25lIHdoZW4gYSBldmVudCBpcyBmaXJlZC5cbiAgICB2YXIgZXZ0ID0gdXRpbHMuZXh0ZW5kKHt9LCBldmVudClcbiAgICBldnQudGFyZ2V0ID0gZXZ0LmN1cnJlbnRUYXJnZXRcbiAgICBldnQudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWVcbiAgICBldnQudGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgIF9zZW5kKHRoaXMuaW5zdGFuY2VJZCwge1xuICAgICAgbWV0aG9kOiAnZmlyZUV2ZW50JyxcbiAgICAgIGFyZ3M6IFtyZWYsIHR5cGUsIGV2dF1cbiAgICB9KVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZW5kZXJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2JyaWRnZS9zZW5kZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIHByb3RvY29sID0gcmVxdWlyZSgnLi4vcHJvdG9jb2wnKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxudmFyIEZyYW1lVXBkYXRlciA9IHJlcXVpcmUoJy4uL2ZyYW1lVXBkYXRlcicpXG52YXIgU2VuZGVyID0gcmVxdWlyZSgnLi9zZW5kZXInKVxuXG52YXIgY2FsbFF1ZXVlID0gW11cbi8vIE5lZWQgYSB0YXNrIGNvdW50ZXI/XG4vLyBXaGVuIEZyYW1lVXBkYXRlciBpcyBub3QgYWN0aXZhdGVkLCB0YXNrcyB3aWxsIG5vdCBiZSBwdXNoXG4vLyBpbnRvIGNhbGxRdWV1ZSBhbmQgdGhlcmUgd2lsbCBiZSBubyB0cmFjZSBmb3Igc2l0dWF0aW9uIG9mXG4vLyBleGVjdXRpb24gb2YgdGFza3MuXG5cbi8vIGdpdmUgMTBtcyBmb3IgY2FsbCBoYW5kbGluZywgYW5kIHJlc3QgNm1zIGZvciBvdGhlcnNcbnZhciBNQVhfVElNRV9GT1JfRUFDSF9GUkFNRSA9IDEwXG5cbi8vIGNhbGxOYXRpdmU6IGpzRnJhbWV3b3JrIHdpbGwgY2FsbCB0aGlzIG1ldGhvZCB0byB0YWxrIHRvXG4vLyB0aGlzIHJlbmRlcmVyLlxuLy8gcGFyYW1zOlxuLy8gIC0gaW5zdGFuY2VJZDogc3RyaW5nLlxuLy8gIC0gdGFza3M6IGFycmF5IG9mIG9iamVjdC5cbi8vICAtIGNhbGxiYWNrSWQ6IG51bWJlci5cbmZ1bmN0aW9uIGNhbGxOYXRpdmUoaW5zdGFuY2VJZCwgdGFza3MsIGNhbGxiYWNrSWQpIHtcbiAgdmFyIGNhbGxzID0gW11cbiAgaWYgKHR5cGVvZiB0YXNrcyA9PT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgY2FsbHMgPSBKU09OLnBhcnNlKHRhc2tzKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ludmFsaWQgdGFza3M6JywgdGFza3MpXG4gICAgfVxuICB9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXNrcykuc2xpY2UoOCwgLTEpID09PSAnQXJyYXknKSB7XG4gICAgY2FsbHMgPSB0YXNrc1xuICB9XG4gIHZhciBsZW4gPSBjYWxscy5sZW5ndGhcbiAgY2FsbHNbbGVuIC0gMV0uY2FsbGJhY2tJZCA9ICghY2FsbGJhY2tJZCAmJiBjYWxsYmFja0lkICE9PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjYWxsYmFja0lkXG4gIC8vIFRvIHNvbHZlIHRoZSBwcm9ibGVtIG9mIGNhbGxhcHAsIHRoZSB0d28td2F5IHRpbWUgbG9vcCBydWxlIG11c3RcbiAgLy8gYmUgcmVwbGFjZWQgYnkgY2FsbGluZyBkaXJlY3RseSBleGNlcHQgdGhlIHNpdHVhdGlvbiBvZiBwYWdlIGxvYWRpbmcuXG4gIC8vIDIwMTUtMTEtMDNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChGcmFtZVVwZGF0ZXIuaXNBY3RpdmUoKSkge1xuICAgICAgY2FsbFF1ZXVlLnB1c2goe1xuICAgICAgICBpbnN0YW5jZUlkOiBpbnN0YW5jZUlkLFxuICAgICAgICBjYWxsOiBjYWxsc1tpXVxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBwcm9jZXNzQ2FsbChpbnN0YW5jZUlkLCBjYWxsc1tpXSlcbiAgICB9XG4gIH1cblxufVxuXG5mdW5jdGlvbiBwcm9jZXNzQ2FsbFF1ZXVlKCkge1xuICB2YXIgbGVuID0gY2FsbFF1ZXVlLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHN0YXJ0ID0gRGF0ZS5ub3coKVxuICB2YXIgZWxhcHNlZCA9IDBcblxuICB3aGlsZSAoLS1sZW4gPj0gMCAmJiBlbGFwc2VkIDwgTUFYX1RJTUVfRk9SX0VBQ0hfRlJBTUUpIHtcbiAgICB2YXIgY2FsbE9iaiA9IGNhbGxRdWV1ZS5zaGlmdCgpXG4gICAgcHJvY2Vzc0NhbGwoY2FsbE9iai5pbnN0YW5jZUlkLCBjYWxsT2JqLmNhbGwpXG4gICAgZWxhcHNlZCA9IERhdGUubm93KCkgLSBzdGFydFxuICB9XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NDYWxsKGluc3RhbmNlSWQsIGNhbGwpIHtcbiAgdmFyIG1vZHVsZU5hbWUgPSBjYWxsLm1vZHVsZVxuICB2YXIgbWV0aG9kTmFtZSA9IGNhbGwubWV0aG9kXG4gIHZhciBtb2R1bGUsIG1ldGhvZFxuICB2YXIgYXJncyA9IGNhbGwuYXJncyB8fCBjYWxsLmFyZ3VtZW50cyB8fCBbXVxuXG4gIGlmICghKG1vZHVsZSA9IHByb3RvY29sLmFwaU1vZHVsZVttb2R1bGVOYW1lXSkpIHtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAoIShtZXRob2QgPSBtb2R1bGVbbWV0aG9kTmFtZV0pKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBtZXRob2QuYXBwbHkocHJvdG9jb2wuZ2V0V2VleEluc3RhbmNlKGluc3RhbmNlSWQpLCBhcmdzKVxuXG4gIHZhciBjYWxsYmFja0lkID0gY2FsbC5jYWxsYmFja0lkXG4gIGlmICgoY2FsbGJhY2tJZFxuICAgIHx8IGNhbGxiYWNrSWQgPT09IDBcbiAgICB8fCBjYWxsYmFja0lkID09PSAnMCcpXG4gICAgJiYgY2FsbGJhY2tJZCAhPT0gJy0xJ1xuICAgICYmIGNhbGxiYWNrSWQgIT09IC0xKSB7XG4gICAgcGVyZm9ybU5leHRUaWNrKGluc3RhbmNlSWQsIGNhbGxiYWNrSWQpXG4gIH1cbn1cblxuZnVuY3Rpb24gcGVyZm9ybU5leHRUaWNrKGluc3RhbmNlSWQsIGNhbGxiYWNrSWQpIHtcbiAgU2VuZGVyLmdldFNlbmRlcihpbnN0YW5jZUlkKS5wZXJmb3JtQ2FsbGJhY2soY2FsbGJhY2tJZClcbn1cblxuZnVuY3Rpb24gbmF0aXZlTG9nKCkge1xuICBpZiAoY29uZmlnLmRlYnVnKSB7XG4gICAgaWYgKGFyZ3VtZW50c1swXS5tYXRjaCgvXnBlcmYvKSkge1xuICAgICAgY29uc29sZS5pbmZvLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zb2xlLmRlYnVnLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbiAgfVxufVxuXG5mdW5jdGlvbiBleHBvcnRzQnJpZGdlTWV0aG9kc1RvR2xvYmFsKCkge1xuICBnbG9iYWwuY2FsbE5hdGl2ZSA9IGNhbGxOYXRpdmVcbiAgZ2xvYmFsLm5hdGl2ZUxvZyA9IG5hdGl2ZUxvZ1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBwcm9jZXNzIGNhbGxRdWV1ZSBldmVyeSAxNiBtaWxsaXNlY29uZHMuXG4gICAgRnJhbWVVcGRhdGVyLmFkZFVwZGF0ZU9ic2VydmVyKHByb2Nlc3NDYWxsUXVldWUpXG4gICAgRnJhbWVVcGRhdGVyLnN0YXJ0KClcblxuICAgIC8vIGV4cG9ydHMgbWV0aG9kcyB0byBnbG9iYWwod2luZG93KS5cbiAgICBleHBvcnRzQnJpZGdlTWV0aG9kc1RvR2xvYmFsKClcbiAgfVxuXG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2JyaWRnZS9yZWNlaXZlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgUm9vdENvbXBvbmVudCA9IHJlcXVpcmUoJy4vcm9vdCcpXG52YXIgQ29udGFpbmVyID0gcmVxdWlyZSgnLi9jb250YWluZXInKVxudmFyIEltYWdlID0gcmVxdWlyZSgnLi9pbWFnZScpXG52YXIgVGV4dCA9IHJlcXVpcmUoJy4vdGV4dCcpXG52YXIgTGlzdCA9IHJlcXVpcmUoJy4vbGlzdCcpXG52YXIgQ291bnRkb3duID0gcmVxdWlyZSgnLi9jb3VudGRvd24nKVxudmFyIE1hcnF1ZWUgPSByZXF1aXJlKCcuL21hcnF1ZWUnKVxudmFyIFNsaWRlciA9IHJlcXVpcmUoJy4vc2xpZGVyJylcbnZhciBJbmRpY2F0b3IgPSByZXF1aXJlKCcuL2luZGljYXRvcicpXG52YXIgVGFiaGVhZGVyID0gcmVxdWlyZSgnLi90YWJoZWFkZXInKVxudmFyIFNjcm9sbGVyID0gcmVxdWlyZSgnLi9zY3JvbGxlcicpXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0JylcbnZhciBTZWxlY3QgPSByZXF1aXJlKCcuL3NlbGVjdCcpXG52YXIgRGF0ZXBpY2tlciA9IHJlcXVpcmUoJy4vZGF0ZXBpY2tlcicpXG52YXIgVGltZXBpY2tlciA9IHJlcXVpcmUoJy4vdGltZXBpY2tlcicpXG52YXIgVmlkZW8gPSByZXF1aXJlKCcuL3ZpZGVvJylcbnZhciBTd2l0Y2ggPSByZXF1aXJlKCcuL3N3aXRjaCcpXG52YXIgQSA9IHJlcXVpcmUoJy4vYScpXG52YXIgRW1iZWQgPSByZXF1aXJlKCcuL2VtYmVkJylcblxudmFyIGNvbXBvbmVudHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChXZWV4KSB7XG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgncm9vdCcsIFJvb3RDb21wb25lbnQpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgncm9vdCcsIFJvb3RDb21wb25lbnQpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgnY29udGFpbmVyJywgQ29udGFpbmVyKVxuICAgIFdlZXgucmVnaXN0ZXJDb21wb25lbnQoJ2ltYWdlJywgSW1hZ2UpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgndGV4dCcsIFRleHQpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgnbGlzdCcsIExpc3QpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgnY291bnRkb3duJywgQ291bnRkb3duKVxuICAgIFdlZXgucmVnaXN0ZXJDb21wb25lbnQoJ21hcnF1ZWUnLCBNYXJxdWVlKVxuICAgIFdlZXgucmVnaXN0ZXJDb21wb25lbnQoJ3NsaWRlcicsIFNsaWRlcilcbiAgICBXZWV4LnJlZ2lzdGVyQ29tcG9uZW50KCdpbmRpY2F0b3InLCBJbmRpY2F0b3IpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgndGFiaGVhZGVyJywgVGFiaGVhZGVyKVxuICAgIFdlZXgucmVnaXN0ZXJDb21wb25lbnQoJ3Njcm9sbGVyJywgU2Nyb2xsZXIpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgnaW5wdXQnLCBJbnB1dClcbiAgICBXZWV4LnJlZ2lzdGVyQ29tcG9uZW50KCdzZWxlY3QnLCBTZWxlY3QpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgnZGF0ZXBpY2tlcicsIERhdGVwaWNrZXIpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgndGltZXBpY2tlcicsIFRpbWVwaWNrZXIpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgndmlkZW8nLCBWaWRlbylcbiAgICBXZWV4LnJlZ2lzdGVyQ29tcG9uZW50KCdzd2l0Y2gnLCBTd2l0Y2gpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgnYScsIEEpXG4gICAgV2VleC5yZWdpc3RlckNvbXBvbmVudCgnZW1iZWQnLCBFbWJlZClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvbmVudHNcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBDb21wb25lbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50TWFuYWdlcicpXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxuXG4vLyBJZiBub2RlVHlwZSBpcyBpbiB0aGlzIFdISVRFX0xJU1QsIGp1c3QgaWdub3JlIGl0IGFuZFxuLy8gcmVwbGFjZSBpdCB3aXRoIGEgZGl2IGVsZW1lbnQuXG52YXIgV0hJVEVfTElTVCA9IFtdXG5cbmZ1bmN0aW9uIFJvb3RDb21wb25lbnQoZGF0YSwgbm9kZVR5cGUpIHtcbiAgdmFyIGlkID0gZGF0YS5yb290SWQgKyAnLXJvb3QnXG4gIHZhciBjb21wb25lbnRNYW5hZ2VyID0gQ29tcG9uZW50TWFuYWdlci5nZXRJbnN0YW5jZShkYXRhLmluc3RhbmNlSWQpXG5cbiAgLy8gUmV0dXJuIGEgTm9kZVR5cGUgaW5zdGFuY2UuXG4gIGlmIChub2RlVHlwZSAmJiBub2RlVHlwZSAhPT0gJ2RpdicgJiYgV0hJVEVfTElTVC5pbmRleE9mKG5vZGVUeXBlKSA9PT0gLTEpIHtcbiAgICBkYXRhLnR5cGUgPSBub2RlVHlwZVxuICAgIHZhciBjbXAgPSBjb21wb25lbnRNYW5hZ2VyLmNyZWF0ZUVsZW1lbnQoZGF0YSlcbiAgICBjbXAubm9kZS5pZCA9IGlkXG4gICAgcmV0dXJuIGNtcFxuICB9XG5cbiAgLy8gT3RoZXJ3aXNlIHJldHVybiBhIGNvbW1vbiB3ZWV4LWNvbnRhaW5lciBjb21wb25lbnQsXG4gIC8vIHdob3NlIG5vZGUgaXMgYSBkaXYgZWxlbWVudC5cbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB0aGlzLmRhdGEgPSBkYXRhXG4gIHRoaXMubm9kZSA9IG5vZGVcblxuICB0aGlzLmNyZWF0ZUNoaWxkcmVuKClcbiAgdGhpcy51cGRhdGVBdHRycyh0aGlzLmRhdGEuYXR0cilcbiAgLy8gaXNzdWU6IHdoZW4gYWRkIGVsZW1lbnQgdG8gYSBsaXN0IGluIGxpZmV0aW1lIGhvb2sgJ3JlYWR5JywgdGhlXG4gIC8vIHN0eWxlcyBpcyBzZXQgdG8gdGhlIGNsYXNzU3R5bGUsIG5vdCBzdHlsZS4gVGhpcyBpcyBhIGlzc3VlXG4gIC8vIHRoYXQganNmcmFtZXdvcmsgc2hvdWxkIGRvIHNvbWV0aGluZyBhYm91dC5cbiAgdmFyIGNsYXNzU3R5bGUgPSB0aGlzLmRhdGEuY2xhc3NTdHlsZVxuICBjbGFzc1N0eWxlICYmIHRoaXMudXBkYXRlU3R5bGUodGhpcy5kYXRhLmNsYXNzU3R5bGUpXG4gIHRoaXMudXBkYXRlU3R5bGUodGhpcy5kYXRhLnN0eWxlKVxuICB0aGlzLmJpbmRFdmVudHModGhpcy5kYXRhLmV2ZW50KVxufVxuXG5Sb290Q29tcG9uZW50LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50LnByb3RvdHlwZSlcblxubW9kdWxlLmV4cG9ydHMgPSBSb290Q29tcG9uZW50XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvcm9vdC5qc1xuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxucmVxdWlyZSgnLi4vc3R5bGVzL2NvbnRhaW5lci5zY3NzJylcblxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcblxuZnVuY3Rpb24gQ29udGFpbmVyIChkYXRhLCBub2RlVHlwZSkge1xuICBDb21wb25lbnQuY2FsbCh0aGlzLCBkYXRhLCBub2RlVHlwZSlcbiAgdGhpcy5ub2RlLmNsYXNzTGlzdC5hZGQoJ3dlZXgtY29udGFpbmVyJylcbn1cblxuQ29udGFpbmVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50LnByb3RvdHlwZSlcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWluZXJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9jb250YWluZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL2NvbnRhaW5lci5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vY29udGFpbmVyLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL2NvbnRhaW5lci5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3N0eWxlcy9jb250YWluZXIuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi53ZWV4LWNvbnRhaW5lciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgZGlzcGxheTogLXdlYmtpdC1ib3g7XFxuICBkaXNwbGF5OiAtd2Via2l0LWZsZXg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcXG4gIC13ZWJraXQtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBib3JkZXI6IDAgc29saWQgYmxhY2s7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwOyB9XFxuXFxuLndlZXgtZWxlbWVudCB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlOyB9XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi8uL3NyYy9zcmMvc3R5bGVzL2NvbnRhaW5lci5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsdUJBQXNCO0VBQ3RCLHFCQUFvQjtFQUNwQixzQkFBcUI7RUFDckIsY0FBYTtFQUNiLDZCQUE0QjtFQUM1QiwrQkFBOEI7RUFDOUIsdUJBQXNCO0VBQ3RCLG1CQUFrQjtFQUNsQixzQkFBcUI7RUFDckIsVUFBUztFQUNULFdBQ0QsRUFBQzs7QUFFRjtFQUNFLHVCQUF1QjtFQUN2QixtQkFBbUIsRUFDcEJcIixcImZpbGVcIjpcImNvbnRhaW5lci5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi53ZWV4LWNvbnRhaW5lciB7XFxuICBib3gtc2l6aW5nOmJvcmRlci1ib3g7XFxuICBkaXNwbGF5Oi13ZWJraXQtYm94O1xcbiAgZGlzcGxheTotd2Via2l0LWZsZXg7XFxuICBkaXNwbGF5OmZsZXg7XFxuICAtd2Via2l0LWJveC1vcmllbnQ6dmVydGljYWw7XFxuICAtd2Via2l0LWZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcXG4gIGZsZXgtZGlyZWN0aW9uOmNvbHVtbjtcXG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xcbiAgYm9yZGVyOjAgc29saWQgYmxhY2s7XFxuICBtYXJnaW46MDtcXG4gIHBhZGRpbmc6MFxcbn1cXG5cXG4ud2VleC1lbGVtZW50IHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIndlYnBhY2s6Ly9cIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L3Nhc3MtbG9hZGVyP3NvdXJjZU1hcCEuL3NyYy9zdHlsZXMvY29udGFpbmVyLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSAyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBBdG9taWMgPSByZXF1aXJlKCcuL2F0b21pYycpXG52YXIgTGF6eUxvYWQgPSByZXF1aXJlKCcuLi9sYXp5TG9hZCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxudmFyIERFRkFVTFRfU0laRSA9IDIwMFxudmFyIFJFU0laRV9NT0RFUyA9IFsnY292ZXInLCAnY29udGFpbiddIC8vIG5vdCB0ZW1wb3JhcmlseSBzdXBwb3J0ZWRcblxuLyoqXG4gKiByZXNpemU9Y292ZXJ8Y29udGFpbnxzdHJldGNoIHYxLjQgdGVtcG9yYXJpbHkgbm90IHN1cHBvcnRlZFxuICogc3JjPXVybFxuICovXG5cbmZ1bmN0aW9uIEltYWdlIChkYXRhKSB7XG4gIHRoaXMud2lkdGggPSBkYXRhLnN0eWxlICYmIGRhdGEuc3R5bGUud2lkdGhcbiAgICAgICAgICAgICAgID8gKGRhdGEuc3R5bGUud2lkdGggKyAnJykucmVwbGFjZSgvW15cXGRdL2csICcnKVxuICAgICAgICAgICAgICAgOiBERUZBVUxUX1NJWkVcbiAgdGhpcy5oZWlnaHQgPSBkYXRhLnN0eWxlICYmIGRhdGEuc3R5bGUuaGVpZ2h0XG4gICAgICAgICAgICAgICA/IChkYXRhLnN0eWxlLmhlaWdodCArICcnKS5yZXBsYWNlKC9bXlxcZF0vZywgJycpXG4gICAgICAgICAgICAgICA6IERFRkFVTFRfU0laRVxuICB0aGlzLndpZHRoICo9IGRhdGEuc2NhbGVcbiAgdGhpcy5oZWlnaHQgKj0gZGF0YS5zY2FsZVxuICB2YXIgbW9kZVxuICB2YXIgYXR0ciA9IGRhdGEuYXR0clxuICBhdHRyICYmIChtb2RlID0gYXR0ci5yZXNpemUgfHwgYXR0ci5yZXNpemVNb2RlKVxuICBpZiAoUkVTSVpFX01PREVTLmluZGV4T2YobW9kZSkgIT09IC0xKSB7XG4gICAgdGhpcy5tb2RlID0gbW9kZVxuICAgIC8vIFRPRE86IHJlc2l6ZS1tb2RlIGlzIG5vdCB0ZW1wb3JhcmlseSBzdXBwb3J0ZWQuXG4gIH1cbiAgQXRvbWljLmNhbGwodGhpcywgZGF0YSlcbn1cblxuSW1hZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBdG9taWMucHJvdG90eXBlKVxuXG5JbWFnZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gIG5vZGUuY2xhc3NMaXN0LmFkZCgnd2VleC1lbGVtZW50JylcbiAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICBub2RlLnN0eWxlLm91dGxpbmUgPSAnbm9uZSdcbiAgcmV0dXJuIG5vZGVcbn1cblxuSW1hZ2UucHJvdG90eXBlLmF0dHIgPSB7XG4gIHNyYzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLm5vZGUuc3JjKSB7XG4gICAgICB0aGlzLm5vZGUuc3JjID0gbGliLmltZy5kZWZhdWx0U3JjXG4gICAgfVxuICAgIExhenlMb2FkLm1ha2VJbWFnZUxhenkodGhpcy5ub2RlLCB2YWx1ZSlcbiAgfVxufVxuXG5JbWFnZS5wcm90b3R5cGUuY2xlYXJBdHRyID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLm5vZGUuc3JjID0gJydcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL2ltYWdlLmpzXG4gKiogbW9kdWxlIGlkID0gMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxuXG4vLyBDb21wb25lbnQgd2hpY2ggY2FuIGhhdmUgbm8gc3ViY29tcG9uZW50cy5cbi8vIFRoaXMgY29tcG9uZW50IHNob3VsZCBub3QgYmUgaW5zdGFudGlhdGVkIGRpcmVjdGx5LCBzaW5jZVxuLy8gaXQgaXMgZGVzaWduZWQgdG8gYmUgdXNlZCBhcyBhIGJhc2UgY2xhc3MgdG8gZXh0ZW5kIGZyb20uXG5mdW5jdGlvbiBBdG9taWMgKGRhdGEpIHtcbiAgQ29tcG9uZW50LmNhbGwodGhpcywgZGF0YSlcbn1cblxuQXRvbWljLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50LnByb3RvdHlwZSlcblxuQXRvbWljLnByb3RvdHlwZS5hcHBlbmRDaGlsZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIC8vIGRvIG5vdGhpbmdcbiAgcmV0dXJuXG59XG5cbkF0b21pYy5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKGNoaWxkLCBiZWZvcmUpIHtcbiAgLy8gZG8gbm90aGluZ1xuICByZXR1cm5cbn1cblxuQXRvbWljLnByb3RvdHlwZS5yZW1vdmVDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICAvLyBkbyBub3RoaW5nXG4gIHJldHVyblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF0b21pY1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL2F0b21pYy5qc1xuICoqIG1vZHVsZSBpZCA9IDI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIEF0b21pYyA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxudmFyIERFRkFVTFRfRk9OVF9TSVpFID0gMzJcblxuLy8gYXR0clxuLy8gIC0gdmFsdWU6IHRleHQgY29udGVudC5cbi8vICAtIGxpbmVzOiBtYXhpbXVtIGxpbmVzIG9mIHRoZSB0ZXh0LlxuZnVuY3Rpb24gVGV4dCAoZGF0YSkge1xuICBBdG9taWMuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG5UZXh0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXRvbWljLnByb3RvdHlwZSlcblxuVGV4dC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIG5vZGUuY2xhc3NMaXN0LmFkZCgnd2VleC1jb250YWluZXInKVxuICBub2RlLnN0eWxlLmZvbnRTaXplID0gREVGQVVMVF9GT05UX1NJWkUgKiB0aGlzLmRhdGEuc2NhbGUgKyAncHgnXG4gIHRoaXMudGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgLy8gR2l2ZSB0aGUgZGV2ZWxvcGVycyB0aGUgYWJpbGl0eSB0byBjb250cm9sIHNwYWNlXG4gIC8vIGFuZCBsaW5lLWJyZWFrZXJzLlxuICB0aGlzLnRleHROb2RlLnN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnXG4gIHRoaXMudGV4dE5vZGUuc3R5bGUuZGlzcGxheSA9ICctd2Via2l0LWJveCdcbiAgdGhpcy50ZXh0Tm9kZS5zdHlsZS53ZWJraXRCb3hPcmllbnQgPSAndmVydGljYWwnXG4gIHRoaXMuc3R5bGUubGluZXMuY2FsbCh0aGlzLCB0aGlzLmRhdGEuc3R5bGUubGluZXMpXG4gIG5vZGUuYXBwZW5kQ2hpbGQodGhpcy50ZXh0Tm9kZSlcbiAgcmV0dXJuIG5vZGVcbn1cblxuVGV4dC5wcm90b3R5cGUuYXR0ciA9IHtcbiAgdmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBzcGFuID0gdGhpcy5ub2RlLmZpcnN0Q2hpbGRcbiAgICBzcGFuLmlubmVySFRNTCA9ICcnXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHNwYW4udGV4dENvbnRlbnQgPSB2YWx1ZVxuICAgIC8qKlxuICAgICAqIERldmVsb3BlcnMgYXJlIHN1cHBvc2VkIHRvIGhhdmUgdGhlIGFiaWxpdHkgdG8gYnJlYWsgdGV4dFxuICAgICAqIGxpbmVzIG1hbnVhbGx5LiBVc2luZyBgYCZuYnNwO2BgIHRvIHJlcGxhY2UgdGV4dCBzcGFjZSBpc1xuICAgICAqIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIGBgLXdlYmtpdC1saW5lLWNsYW1wYGAuIFRoZXJlZm9yXG4gICAgICogd2UgdXNlIGBgd2hpdGUtc3BhY2U6IG5vLXdyYXBgYCBpbnN0ZWFkIChpbnN0ZWFkIG9mIHRoZVxuICAgICAqIGNvZGUgYmVsbG93KS5cblxuICAgICAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICAgICAgdGV4dC5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgdmFyIHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RyKVxuICAgICAgICAgIHZhciBzcGFjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKVxuICAgICAgICAgIHNwYWNlLmlubmVySFRNTCA9ICcmbmJzcDsnXG4gICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChzcGFjZSlcbiAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKHRleHROb2RlKVxuICAgICAgICB9KVxuICAgICAgICBmcmFnLnJlbW92ZUNoaWxkKGZyYWcuZmlyc3RDaGlsZClcbiAgICAgICAgc3Bhbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgICAgICBzcGFuLmFwcGVuZENoaWxkKGZyYWcpXG4gICAgICB9KVxuICAgICAgc3Bhbi5yZW1vdmVDaGlsZChzcGFuLmZpcnN0Q2hpbGQpXG4gICAgICovXG4gIH1cbn1cblxuVGV4dC5wcm90b3R5cGUuY2xlYXJBdHRyID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLm5vZGUuZmlyc3RDaGlsZC50ZXh0Q29udGVudCA9ICcnXG59XG5cblRleHQucHJvdG90eXBlLnN0eWxlID0gdXRpbHMuZXh0ZW5kKE9iamVjdC5jcmVhdGUoQXRvbWljLnByb3RvdHlwZS5zdHlsZSksIHtcblxuICBsaW5lczogZnVuY3Rpb24gKHZhbCkge1xuICAgIHZhbCA9IHBhcnNlSW50KHZhbClcbiAgICBpZiAodmFsICE9PSB2YWwpIHsgLy8gTmFOXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHZhbCA8PSAwKSB7XG4gICAgICB0aGlzLnRleHROb2RlLnN0eWxlLnRleHRPdmVyZmxvdyA9ICcnXG4gICAgICB0aGlzLnRleHROb2RlLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnXG4gICAgICB0aGlzLnRleHROb2RlLnN0eWxlLndlYmtpdExpbmVDbGFtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGV4dE5vZGUuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgdGhpcy50ZXh0Tm9kZS5zdHlsZS50ZXh0T3ZlcmZsb3cgPSAnZWxsaXBzaXMnXG4gICAgICB0aGlzLnRleHROb2RlLnN0eWxlLndlYmtpdExpbmVDbGFtcCA9IGxpbmVzXG4gICAgfVxuICB9XG5cbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dFxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL3RleHQuanNcbiAqKiBtb2R1bGUgaWQgPSAyOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnJlcXVpcmUoJy4uL3N0eWxlcy9saXN0LnNjc3MnKVxucmVxdWlyZSgnc2Nyb2xsanMnKVxuXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxudmFyIExhenlMb2FkID0gcmVxdWlyZSgnLi4vbGF6eUxvYWQnKVxuXG52YXIgREVGQVVMVF9MT0FEX01PUkVfT0ZGU0VUID0gNTAwXG5cbmZ1bmN0aW9uIExpc3QoZGF0YSwgbm9kZVR5cGUpIHtcbiAgLy8gdGhpcy5sb2FkbW9yZU9mZnNldCA9IE51bWJlcihkYXRhLmF0dHIubG9hZG1vcmVvZmZzZXQpXG4gIC8vIHRoaXMuaXNBdmFpbGFibGVUb0ZpcmVsb2FkbW9yZSA9IHRydWVcbiAgQ29tcG9uZW50LmNhbGwodGhpcywgZGF0YSwgbm9kZVR5cGUpXG59XG5cbkxpc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnQucHJvdG90eXBlKVxuXG5MaXN0LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAobm9kZVR5cGUpIHtcbiAgdmFyIFNjcm9sbCA9IGxpYi5zY3JvbGxcbiAgdmFyIG5vZGUgPSBDb21wb25lbnQucHJvdG90eXBlLmNyZWF0ZS5jYWxsKHRoaXMsIG5vZGVUeXBlKVxuICBub2RlLmNsYXNzTGlzdC5hZGQoJ3dlZXgtY29udGFpbmVyJywgJ2xpc3Qtd3JhcCcpXG4gIHRoaXMubGlzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB0aGlzLmxpc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXG4gICAgJ3dlZXgtY29udGFpbmVyJ1xuICAgICwgJ2xpc3QtZWxlbWVudCdcbiAgKVxuICBub2RlLmFwcGVuZENoaWxkKHRoaXMubGlzdEVsZW1lbnQpXG4gIHRoaXMuc2Nyb2xsZXIgPSBuZXcgU2Nyb2xsKHtcbiAgICBzY3JvbGxFbGVtZW50OiB0aGlzLmxpc3RFbGVtZW50XG4gICAgLCBkaXJlY3Rpb246ICd5J1xuICB9KVxuICB0aGlzLnNjcm9sbGVyLmluaXQoKVxuICByZXR1cm4gbm9kZVxufVxuXG5MaXN0LnByb3RvdHlwZS5iaW5kRXZlbnRzID0gZnVuY3Rpb24gKGV2dHMpIHtcbiAgQ29tcG9uZW50LnByb3RvdHlwZS5iaW5kRXZlbnRzLmNhbGwodGhpcywgZXZ0cylcbiAgLy8gdG8gZW5hYmxlIGxhenlsb2FkIGZvciBJbWFnZXMuXG4gIHRoaXMuc2Nyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsaW5nJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc28gPSBlLnNjcm9sbE9ialxuICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnc2Nyb2xsJywge1xuICAgICAgb3JpZ2luYWxUeXBlOiAnc2Nyb2xsaW5nJyxcbiAgICAgIHNjcm9sbFRvcDogc28uZ2V0U2Nyb2xsVG9wKCksXG4gICAgICBzY3JvbGxMZWZ0OiBzby5nZXRTY3JvbGxMZWZ0KClcbiAgICB9LCB7XG4gICAgICBidWJibGVzOiB0cnVlXG4gICAgfSlcbiAgfS5iaW5kKHRoaXMpKVxuXG4gIHRoaXMuc2Nyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcigncHVsbHVwZW5kJywgZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ2xvYWRtb3JlJylcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5MaXN0LnByb3RvdHlwZS5hcHBlbmRDaGlsZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIHZhciBjaGlsZHJlbiA9IHRoaXMuZGF0YS5jaGlsZHJlblxuICB2YXIgY29tcG9uZW50TWFuYWdlciA9IHRoaXMuZ2V0Q29tcG9uZW50TWFuYWdlcigpXG4gIHZhciBjaGlsZCA9IGNvbXBvbmVudE1hbmFnZXIuY3JlYXRlRWxlbWVudChkYXRhKVxuICB0aGlzLmxpc3RFbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkLm5vZGUpXG5cbiAgLy8gdXBkYXRlIHRoaXMuZGF0YS5jaGlsZHJlblxuICBpZiAoIWNoaWxkcmVuIHx8ICFjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICB0aGlzLmRhdGEuY2hpbGRyZW4gPSBbZGF0YV1cbiAgfSBlbHNlIHtcbiAgICBjaGlsZHJlbi5wdXNoKGRhdGEpXG4gIH1cblxuICByZXR1cm4gY2hpbGRcbn1cblxuTGlzdC5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKGNoaWxkLCBiZWZvcmUpIHtcbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5kYXRhLmNoaWxkcmVuXG4gIHZhciBpID0gMFxuICB2YXIgaXNBcHBlbmQgPSBmYWxzZVxuXG4gIC8vIHVwZGF0ZSB0aGlzLmRhdGEuY2hpbGRyZW5cbiAgaWYgKCFjaGlsZHJlbiB8fCAhY2hpbGRyZW4ubGVuZ3RoIHx8ICFiZWZvcmUpIHtcbiAgICBpc0FwcGVuZCA9IHRydWVcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGRyZW5baV0ucmVmID09PSBjaGlsZC5kYXRhLnJlZikge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaSA9PT0gbCkge1xuICAgICAgaXNBcHBlbmQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgaWYgKGlzQXBwZW5kKSB7XG4gICAgdGhpcy5saXN0RWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5ub2RlKVxuICAgIGNoaWxkcmVuLnB1c2goY2hpbGQuZGF0YSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmxpc3RFbGVtZW50Lmluc2VydEJlZm9yZShjaGlsZC5ub2RlLCBiZWZvcmUubm9kZSlcbiAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMCwgY2hpbGQuZGF0YSlcbiAgfVxufVxuXG5MaXN0LnByb3RvdHlwZS5yZW1vdmVDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICB2YXIgY2hpbGRyZW4gPSB0aGlzLmRhdGEuY2hpbGRyZW5cbiAgLy8gcmVtb3ZlIGZyb20gdGhpcy5kYXRhLmNoaWxkcmVuXG4gIHZhciBpID0gMFxuICB2YXIgY29tcG9uZW50TWFuYWdlciA9IHRoaXMuZ2V0Q29tcG9uZW50TWFuYWdlcigpXG4gIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGRyZW5baV0ucmVmID09PSBjaGlsZC5kYXRhLnJlZikge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaSA8IGwpIHtcbiAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKVxuICAgIH1cbiAgfVxuICAvLyByZW1vdmUgZnJvbSBjb21wb25lbnRNYXAgcmVjdXJzaXZlbHlcbiAgY29tcG9uZW50TWFuYWdlci5yZW1vdmVFbGVtZW50QnlSZWYoY2hpbGQuZGF0YS5yZWYpXG4gIHRoaXMubGlzdEVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGQubm9kZSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvbGlzdC5qc1xuICoqIG1vZHVsZSBpZCA9IDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vbGlzdC5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vbGlzdC5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi9saXN0LnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvc3R5bGVzL2xpc3Quc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDMwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5saXN0LXdyYXAge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBvdmVyZmxvdzogaGlkZGVuOyB9XFxuXFxuLmxpc3QtZWxlbWVudCB7XFxuICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xcbiAgLXdlYmtpdC1mbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvc3JjL3N0eWxlcy9saXN0LnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDQyxlQUFlO0VBQ2YsaUJBQWlCLEVBQ2pCOztBQUVEO0VBQ0UsNkJBQTZCO0VBQzdCLCtCQUErQjtFQUMvQix1QkFBdUIsRUFDeEJcIixcImZpbGVcIjpcImxpc3Quc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIubGlzdC13cmFwIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG5cXHRvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4ubGlzdC1lbGVtZW50IHtcXG4gIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XFxuICAtd2Via2l0LWZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJ3ZWJwYWNrOi8vXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vfi9zYXNzLWxvYWRlcj9zb3VyY2VNYXAhLi9zcmMvc3R5bGVzL2xpc3Quc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDMxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpICYmICh3aW5kb3cgPSB7Y3RybDoge30sIGxpYjoge319KTshd2luZG93LmN0cmwgJiYgKHdpbmRvdy5jdHJsID0ge30pOyF3aW5kb3cubGliICYmICh3aW5kb3cubGliID0ge30pO3JlcXVpcmUoJ2FuaW1hdGlvbmpzJyk7cmVxdWlyZSgnY3ViaWNiZXppZXInKTtyZXF1aXJlKCdnZXN0dXJlanMnKTtyZXF1aXJlKCdtb3Rpb25qcycpOyFmdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2Iuc2Nyb2xsLm91dHB1dERlYnVnTG9nJiZjb25zb2xlLmRlYnVnLmFwcGx5KGNvbnNvbGUsYXJndW1lbnRzKX1mdW5jdGlvbiBlKGEpe3ZhciBiPWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7aWYoIWIpe2I9e30sYi53aWR0aD1hLm9mZnNldFdpZHRoLGIuaGVpZ2h0PWEub2Zmc2V0SGVpZ2h0LGIubGVmdD1hLm9mZnNldExlZnQsYi50b3A9YS5vZmZzZXRUb3A7Zm9yKHZhciBjPWEub2Zmc2V0UGFyZW50O2M7KWIubGVmdCs9Yy5vZmZzZXRMZWZ0LGIudG9wKz1jLm9mZnNldFRvcCxjPWMub2Zmc2V0UGFyZW50O2IucmlnaHQ9Yi5sZWZ0K2Iud2lkdGgsYi5ib3R0b209Yi50b3ArYi5oZWlnaHR9cmV0dXJuIGJ9ZnVuY3Rpb24gZihhKXtyZXR1cm4gMC1hLm9wdGlvbnNbYS5heGlzK1wiUGFkZGluZ1RvcFwiXX1mdW5jdGlvbiBnKGEpe3ZhciBiPWUoYS5lbGVtZW50KSxjPWUoYS52aWV3cG9ydCksZD1mKGEpO2lmKFwieVwiPT09YS5heGlzKXZhciBnPTAtYi5oZWlnaHQrYy5oZWlnaHQ7ZWxzZSB2YXIgZz0wLWIud2lkdGgrYy53aWR0aDtyZXR1cm4gTWF0aC5taW4oZythLm9wdGlvbnNbYS5heGlzK1wiUGFkZGluZ0JvdHRvbVwiXSxkKX1mdW5jdGlvbiBoKGEsYil7cmV0dXJuIGI+YS5taW5TY3JvbGxPZmZzZXQ/Yi1hLm1pblNjcm9sbE9mZnNldDpiPGEubWF4U2Nyb2xsT2Zmc2V0P2ItYS5tYXhTY3JvbGxPZmZzZXQ6dm9pZCAwfWZ1bmN0aW9uIGkoYSxiKXtyZXR1cm4gYj5hLm1pblNjcm9sbE9mZnNldD9iPWEubWluU2Nyb2xsT2Zmc2V0OmI8YS5tYXhTY3JvbGxPZmZzZXQmJihiPWEubWF4U2Nyb2xsT2Zmc2V0KSxifWZ1bmN0aW9uIGooYSxiLGMpe2QoYS5lbGVtZW50LnNjcm9sbElkLGIsYyk7dmFyIGU9cC5jcmVhdGVFdmVudChcIkhUTUxFdmVudHNcIik7aWYoZS5pbml0RXZlbnQoYiwhMSwhMCksZS5zY3JvbGxPYmo9YSxjKWZvcih2YXIgZiBpbiBjKWVbZl09Y1tmXTthLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChlKSxhLnZpZXdwb3J0LmRpc3BhdGNoRXZlbnQoZSl9ZnVuY3Rpb24gayhhKXt2YXIgYixjPXt4OjAseTowfSxkPWdldENvbXB1dGVkU3R5bGUoYS5lbGVtZW50KVt5K1wiVHJhbnNmb3JtXCJdO3JldHVyblwibm9uZVwiIT09ZCYmKGI9ZC5tYXRjaCgvXm1hdHJpeDNkXFwoKD86Wy1cXGQuXSssXFxzKil7MTJ9KFstXFxkLl0rKSxcXHMqKFstXFxkLl0rKSg/OixcXHMqWy1cXGQuXSspezJ9XFwpLyl8fGQubWF0Y2goL15tYXRyaXhcXCgoPzpbLVxcZC5dKyxcXHMqKXs0fShbLVxcZC5dKyksXFxzKihbLVxcZC5dKylcXCkkLykpJiYoYy54PXBhcnNlRmxvYXQoYlsxXSl8fDAsYy55PXBhcnNlRmxvYXQoYlsyXSl8fDApLGN9ZnVuY3Rpb24gbChhLGIpe3JldHVybiBhPXBhcnNlRmxvYXQoYSksYj1wYXJzZUZsb2F0KGIpLDAhPWEmJihhKz1cInB4XCIpLDAhPWImJihiKz1cInB4XCIpLEE/XCJ0cmFuc2xhdGUzZChcIithK1wiLCBcIitiK1wiLCAwKVwiOlwidHJhbnNsYXRlKFwiK2ErXCIsIFwiK2IrXCIpXCJ9ZnVuY3Rpb24gbShhLGIsYyl7XCJcIj09PWImJlwiXCI9PT1jP2EuZWxlbWVudC5zdHlsZVt5K1wiVHJhbnNpdGlvblwiXT1cIlwiOmEuZWxlbWVudC5zdHlsZVt5K1wiVHJhbnNpdGlvblwiXT14K1widHJhbnNmb3JtIFwiK2IrXCIgXCIrYytcIiAwc1wifWZ1bmN0aW9uIG4oYSxiKXt2YXIgYz0wLGQ9MDtcIm9iamVjdFwiPT10eXBlb2YgYj8oYz1iLngsZD1iLnkpOlwieVwiPT09YS5heGlzP2Q9YjpjPWIsYS5lbGVtZW50LnN0eWxlW3krXCJUcmFuc2Zvcm1cIl09bChjLGQpfWZ1bmN0aW9uIG8oYSxjKXtmdW5jdGlvbiBsKGEpe3JldHVybiBGfHxMPyhhLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSwhMSk6ITB9ZnVuY3Rpb24gbyhhKXtGfHxMfHxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dmFyIGI9ZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJIVE1MRXZlbnRzXCIpO2IuaW5pdEV2ZW50KFwibmljZWNsaWNrXCIsITAsITApLGEudGFyZ2V0LmRpc3BhdGNoRXZlbnQoYil9LDMwMCl9ZnVuY3Rpb24gcChhLGMpe0k9bnVsbCxjbGVhclRpbWVvdXQoSiksSj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7SSYmKEk9bnVsbCxiLmFuaW1hdGlvbi5yZXF1ZXN0RnJhbWUoYSkpfSxjfHw0MDApLEk9YX1mdW5jdGlvbiBxKGEpe2lmKCFFLmVuYWJsZWQpcmV0dXJuITE7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuaXNWZXJ0aWNhbCl7aWYoIShcInlcIj09PUUuYXhpcyYmYS5pc1ZlcnRpY2FsfHxcInhcIj09PUUuYXhpcyYmIWEuaXNWZXJ0aWNhbCkpcmV0dXJuITE7YS5zdG9wUHJvcGFnYXRpb24oKX1yZXR1cm4hMH1mdW5jdGlvbiB0KGEpe2lmKHEoYSkpaWYoTCYmRCgpLGMudXNlRnJhbWVBbmltYXRpb24pSCYmSC5zdG9wKCksSD1udWxsO2Vsc2V7dmFyIGI9ayhFKTtuKEUsYiksbShFLFwiXCIsXCJcIiksST1udWxsLGNsZWFyVGltZW91dChKKX19ZnVuY3Rpb24gdyhhKXtpZihxKGEpKXt2YXIgZD1rKEUpW0UuYXhpc10sZT1oKEUsZCk7aWYoZSl7dmFyIGY9aShFLGQpO2lmKGMudXNlRnJhbWVBbmltYXRpb24pe3ZhciBnPWYtZDtIPW5ldyBiLmFuaW1hdGlvbig0MDAsYi5jdWJpY2Jlemllci5lYXNlLDAsZnVuY3Rpb24oYSxiKXt2YXIgYz0oZCtnKmIpLnRvRml4ZWQoMik7bihFLGMpLGooRSxcInNjcm9sbGluZ1wiKX0pLEgub25lbmQoRCksSC5wbGF5KCl9ZWxzZXt2YXIgbD1mLnRvRml4ZWQoMCk7bShFLFwiMC40c1wiLFwiZWFzZVwiKSxuKEUsbCkscChELDQwMCksYi5hbmltYXRpb24ucmVxdWVzdEZyYW1lKGZ1bmN0aW9uKCl7TCYmRS5lbmFibGVkJiYoaihFLFwic2Nyb2xsaW5nXCIpLGIuYW5pbWF0aW9uLnJlcXVlc3RGcmFtZShhcmd1bWVudHMuY2FsbGVlKSl9KX1lPjA/aihFLFwieVwiPT09RS5heGlzP1wicHVsbGRvd25lbmRcIjpcInB1bGxyaWdodGVuZFwiKTowPmUmJmooRSxcInlcIj09PUUuYXhpcz9cInB1bGx1cGVuZFwiOlwicHVsbGxlZnRlbmRcIil9ZWxzZSBMJiZEKCl9fWZ1bmN0aW9uIHgoYSl7cShhKSYmKEUudHJhbnNmb3JtT2Zmc2V0PWsoRSksRS5taW5TY3JvbGxPZmZzZXQ9ZihFKSxFLm1heFNjcm9sbE9mZnNldD1nKEUpLEs9Mi41LE49ITAsTD0hMCxNPSExLGooRSxcInNjcm9sbHN0YXJ0XCIpLE89YVtcImRpc3BsYWNlbWVudFwiK0UuYXhpcy50b1VwcGVyQ2FzZSgpXSl9ZnVuY3Rpb24geihhKXtpZihxKGEpKXt2YXIgYj1hW1wiZGlzcGxhY2VtZW50XCIrRS5heGlzLnRvVXBwZXJDYXNlKCldO2lmKE1hdGguYWJzKGItTyk8NSlyZXR1cm4gdm9pZCBhLnN0b3BQcm9wYWdhdGlvbigpO089Yjt2YXIgYz1FLnRyYW5zZm9ybU9mZnNldFtFLmF4aXNdK2I7Yz5FLm1pblNjcm9sbE9mZnNldD8oYz1FLm1pblNjcm9sbE9mZnNldCsoYy1FLm1pblNjcm9sbE9mZnNldCkvSyxLKj0xLjAwMyk6YzxFLm1heFNjcm9sbE9mZnNldCYmKGM9RS5tYXhTY3JvbGxPZmZzZXQtKEUubWF4U2Nyb2xsT2Zmc2V0LWMpL0ssSyo9MS4wMDMpLEs+NCYmKEs9NCk7dmFyIGQ9aChFLGMpO2QmJihqKEUsZD4wP1wieVwiPT09RS5heGlzP1wicHVsbGRvd25cIjpcInB1bGxyaWdodFwiOlwieVwiPT09RS5heGlzP1wicHVsbHVwXCI6XCJwdWxsbGVmdFwiLHtib3VuZGFyeU9mZnNldDpNYXRoLmFicyhkKX0pLEUub3B0aW9ucy5ub0JvdW5jZSYmKGM9aShFLGMpKSksbihFLGMudG9GaXhlZCgyKSksaihFLFwic2Nyb2xsaW5nXCIpfX1mdW5jdGlvbiBBKGEpe3EoYSkmJmEuaXNmbGljayYmQyhhKX1mdW5jdGlvbiBDKGEpe049ITA7dmFyIGUsZixnLGksbCxvLHEscixzLHQsdix3LHgseSx6LEEsQjtpPWsoRSlbRS5heGlzXTt2YXIgQz1oKEUsaSk7aWYoIUMpe2U9YVtcInZlbG9jaXR5XCIrRS5heGlzLnRvVXBwZXJDYXNlKCldO3ZhciBGPTIsRz0uMDAxNTtjLmluZXJ0aWEmJnVbYy5pbmVydGlhXSYmKEY9dVtjLmluZXJ0aWFdWzBdLEc9dVtjLmluZXJ0aWFdWzFdKSxlPkYmJihlPUYpLC1GPmUmJihlPS1GKSxmPUcqKGUvTWF0aC5hYnMoZSkpLG89bmV3IGIubW90aW9uKHt2OmUsYTotZn0pLGc9by50LGw9aStvLnM7dmFyIEk9aChFLGwpO2lmKEkpe2QoXCLmg6/mgKforqHnrpfotoXlh7rkuobovrnnvJhcIixJKSxxPWUscj1mLEk+MD8odD1FLm1pblNjcm9sbE9mZnNldCx3PTEpOih0PUUubWF4U2Nyb2xsT2Zmc2V0LHc9LTEpLHY9bmV3IGIubW90aW9uKHt2OncqcSxhOi13KnIsczpNYXRoLmFicyh0LWkpfSkscz12LnQ7dmFyIEo9di5nZW5lcmF0ZUN1YmljQmV6aWVyKCk7eD1xLXIqcyx5PS4wMyooeC9NYXRoLmFicyh4KSksQj1uZXcgYi5tb3Rpb24oe3Y6eCxhOi15fSksej1CLnQsQT10K0IucztCLmdlbmVyYXRlQ3ViaWNCZXppZXIoKTtpZihjLm5vQm91bmNlKWlmKGQoXCLmsqHmnInlm57lvLnmlYjmnpxcIiksaSE9PXQpaWYoYy51c2VGcmFtZUFuaW1hdGlvbil7dmFyIEs9dC1pLE89Yi5jdWJpY2JlemllcihKWzBdWzBdLEpbMF1bMV0sSlsxXVswXSxKWzFdWzFdKTtIPW5ldyBiLmFuaW1hdGlvbihzLnRvRml4ZWQoMCksTywwLGZ1bmN0aW9uKGEsYil7dmFyIGM9aStLKmI7ayhFLGMudG9GaXhlZCgyKSksaihFLFwic2Nyb2xsaW5nXCIse2FmdGVyRmxpY2s6ITB9KX0pLEgub25lbmQoRCksSC5wbGF5KCl9ZWxzZXt2YXIgUD10LnRvRml4ZWQoMCk7bShFLChzLzFlMykudG9GaXhlZCgyKStcInNcIixcImN1YmljLWJlemllcihcIitKK1wiKVwiKSxuKEUsUCkscChELDFlMyoocy8xZTMpLnRvRml4ZWQoMikpfWVsc2UgRCgpO2Vsc2UgaWYoaSE9PUEpaWYoZChcIuaDr+aAp+a7muWKqFwiLFwicz1cIitBLnRvRml4ZWQoMCksXCJ0PVwiKygocyt6KS8xZTMpLnRvRml4ZWQoMikpLGMudXNlRnJhbWVBbmltYXRpb24pe3ZhciBLPUEtaSxPPWIuY3ViaWNiZXppZXIuZWFzZU91dDtIPW5ldyBiLmFuaW1hdGlvbigocyt6KS50b0ZpeGVkKDApLE8sMCxmdW5jdGlvbihhLGIpe3ZhciBjPWkrSypiO24oRSxjLnRvRml4ZWQoMikpLGooRSxcInNjcm9sbGluZ1wiLHthZnRlckZsaWNrOiEwfSl9KSxILm9uZW5kKGZ1bmN0aW9uKCl7aWYoRS5lbmFibGVkKXt2YXIgYT10LUEsYz1iLmN1YmljYmV6aWVyLmVhc2U7SD1uZXcgYi5hbmltYXRpb24oNDAwLGMsMCxmdW5jdGlvbihiLGMpe3ZhciBkPUErYSpjO24oRSxkLnRvRml4ZWQoMikpLGooRSxcInNjcm9sbGluZ1wiLHthZnRlckZsaWNrOiEwfSl9KSxILm9uZW5kKEQpLEgucGxheSgpfX0pLEgucGxheSgpfWVsc2V7dmFyIFA9QS50b0ZpeGVkKDApO20oRSwoKHMreikvMWUzKS50b0ZpeGVkKDIpK1wic1wiLFwiZWFzZS1vdXRcIiksbihFLFApLHAoZnVuY3Rpb24oYSl7aWYoRS5lbmFibGVkKWlmKGQoXCLmg6/mgKflm57lvLlcIixcInM9XCIrdC50b0ZpeGVkKDApLFwidD00MDBcIiksQSE9PXQpe3ZhciBiPXQudG9GaXhlZCgwKTttKEUsXCIwLjRzXCIsXCJlYXNlXCIpLG4oRSxiKSxwKEQsNDAwKX1lbHNlIEQoKX0sMWUzKigocyt6KS8xZTMpLnRvRml4ZWQoMikpfWVsc2UgRCgpfWVsc2V7ZChcIuaDr+aAp+iuoeeul+ayoeaciei2heWHuui+uee8mFwiKTt2YXIgUT1vLmdlbmVyYXRlQ3ViaWNCZXppZXIoKTtpZihjLnVzZUZyYW1lQW5pbWF0aW9uKXt2YXIgSz1sLWksTz1iLmN1YmljYmV6aWVyKFFbMF1bMF0sUVswXVsxXSxRWzFdWzBdLFFbMV1bMV0pO0g9bmV3IGIuYW5pbWF0aW9uKGcudG9GaXhlZCgwKSxPLDAsZnVuY3Rpb24oYSxiKXt2YXIgYz0oaStLKmIpLnRvRml4ZWQoMik7bihFLGMpLGooRSxcInNjcm9sbGluZ1wiLHthZnRlckZsaWNrOiEwfSl9KSxILm9uZW5kKEQpLEgucGxheSgpfWVsc2V7dmFyIFA9bC50b0ZpeGVkKDApO20oRSwoZy8xZTMpLnRvRml4ZWQoMikrXCJzXCIsXCJjdWJpYy1iZXppZXIoXCIrUStcIilcIiksbihFLFApLHAoRCwxZTMqKGcvMWUzKS50b0ZpeGVkKDIpKX19TT0hMCxjLnVzZUZyYW1lQW5pbWF0aW9ufHxiLmFuaW1hdGlvbi5yZXF1ZXN0RnJhbWUoZnVuY3Rpb24oKXtMJiZNJiZFLmVuYWJsZWQmJihqKEUsXCJzY3JvbGxpbmdcIix7YWZ0ZXJGbGljazohMH0pLGIuYW5pbWF0aW9uLnJlcXVlc3RGcmFtZShhcmd1bWVudHMuY2FsbGVlKSl9KX19ZnVuY3Rpb24gRCgpe0UuZW5hYmxlZCYmKE49ITEsc2V0VGltZW91dChmdW5jdGlvbigpeyFOJiZMJiYoTD0hMSxNPSExLGMudXNlRnJhbWVBbmltYXRpb24/KEgmJkguc3RvcCgpLEg9bnVsbCk6bShFLFwiXCIsXCJcIiksaihFLFwic2Nyb2xsZW5kXCIpKX0sNTApKX12YXIgRT10aGlzO2lmKGM9Y3x8e30sYy5ub0JvdW5jZT0hIWMubm9Cb3VuY2UsYy5wYWRkaW5nPWMucGFkZGluZ3x8e30sbnVsbD09Yy5pc1ByZXZlbnQ/Yy5pc1ByZXZlbnQ9ITA6Yy5pc1ByZXZlbnQ9ISFjLmlzUHJldmVudCxudWxsPT1jLmlzRml4U2Nyb2xsZW5kQ2xpY2s/Yy5pc0ZpeFNjcm9sbGVuZENsaWNrPSEwOmMuaXNGaXhTY3JvbGxlbmRDbGljaz0hIWMuaXNGaXhTY3JvbGxlbmRDbGljayxjLnBhZGRpbmc/KGMueVBhZGRpbmdUb3A9LWMucGFkZGluZy50b3B8fDAsYy55UGFkZGluZ0JvdHRvbT0tYy5wYWRkaW5nLmJvdHRvbXx8MCxjLnhQYWRkaW5nVG9wPS1jLnBhZGRpbmcubGVmdHx8MCxjLnhQYWRkaW5nQm90dG9tPS1jLnBhZGRpbmcucmlnaHR8fDApOihjLnlQYWRkaW5nVG9wPTAsYy55UGFkZGluZ0JvdHRvbT0wLGMueFBhZGRpbmdUb3A9MCxjLnhQYWRkaW5nQm90dG9tPTApLGMuZGlyZWN0aW9uPWMuZGlyZWN0aW9ufHxcInlcIixjLmluZXJ0aWE9Yy5pbmVydGlhfHxcIm5vcm1hbFwiLHRoaXMub3B0aW9ucz1jLEUuYXhpcz1jLmRpcmVjdGlvbix0aGlzLmVsZW1lbnQ9YSx0aGlzLnZpZXdwb3J0PWEucGFyZW50Tm9kZSx0aGlzLnBsdWdpbnM9e30sdGhpcy5lbGVtZW50LnNjcm9sbElkPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtyW0UuZWxlbWVudC5zY3JvbGxJZCtcIlwiXT1FfSwxKSx0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsdCwhMSksdGhpcy52aWV3cG9ydC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIix3LCExKSx0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLHcsITEpLHRoaXMudmlld3BvcnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhbnN0YXJ0XCIseCwhMSksdGhpcy52aWV3cG9ydC5hZGRFdmVudExpc3RlbmVyKFwicGFubW92ZVwiLHosITEpLHRoaXMudmlld3BvcnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhbmVuZFwiLEEsITEpLGMuaXNQcmV2ZW50JiYodGhpcy52aWV3cG9ydC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLGZ1bmN0aW9uKGEpe0I9ITB9LCExKSxFLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLGZ1bmN0aW9uKGEpe0I9ITF9LCExKSksYy5pc0ZpeFNjcm9sbGVuZENsaWNrKXt2YXIgRixHO3RoaXMudmlld3BvcnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbGluZ1wiLGZ1bmN0aW9uKCl7Rj0hMCxHJiZjbGVhclRpbWVvdXQoRyksRz1zZXRUaW1lb3V0KGZ1bmN0aW9uKGEpe0Y9ITF9LDQwMCl9LCExKSx0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGwsITEpLHRoaXMudmlld3BvcnQuYWRkRXZlbnRMaXN0ZW5lcihcInRhcFwiLG8sITEpfWlmKGMudXNlRnJhbWVBbmltYXRpb24pe3ZhciBIO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiYW5pbWF0aW9uXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBIfX0pfWVsc2V7dmFyIEksSj0wO2EuYWRkRXZlbnRMaXN0ZW5lcih2P1widHJhbnNpdGlvbmVuZFwiOnkrXCJUcmFuc2l0aW9uRW5kXCIsZnVuY3Rpb24oYSl7aWYoSSl7dmFyIGM9STtJPW51bGwsY2xlYXJUaW1lb3V0KEopLGIuYW5pbWF0aW9uLnJlcXVlc3RGcmFtZShmdW5jdGlvbigpe2MoYSl9KX19LCExKX12YXIgSyxMLE0sTjtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImlzU2Nyb2xsaW5nXCIse2dldDpmdW5jdGlvbigpe3JldHVybiEhTH19KTt2YXIgTyxQPXtpbml0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZW5hYmxlKCksdGhpcy5yZWZyZXNoKCksdGhpcy5zY3JvbGxUbygwKSx0aGlzfSxlbmFibGU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbmFibGVkPSEwLHRoaXN9LGRpc2FibGU6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmVsZW1lbnQ7cmV0dXJuIHRoaXMuZW5hYmxlZD0hMSx0aGlzLm9wdGlvbnMudXNlRnJhbWVBbmltYXRpb24/SCYmSC5zdG9wKCk6Yi5hbmltYXRpb24ucmVxdWVzdEZyYW1lKGZ1bmN0aW9uKCl7YS5zdHlsZVt5K1wiVHJhbnNmb3JtXCJdPWdldENvbXB1dGVkU3R5bGUoYSlbeStcIlRyYW5zZm9ybVwiXX0pLHRoaXN9LGdldFNjcm9sbFdpZHRoOmZ1bmN0aW9uKCl7cmV0dXJuIGUodGhpcy5lbGVtZW50KS53aWR0aH0sZ2V0U2Nyb2xsSGVpZ2h0OmZ1bmN0aW9uKCl7cmV0dXJuIGUodGhpcy5lbGVtZW50KS5oZWlnaHR9LGdldFNjcm9sbExlZnQ6ZnVuY3Rpb24oKXtyZXR1cm4tayh0aGlzKS54LXRoaXMub3B0aW9ucy54UGFkZGluZ1RvcH0sZ2V0U2Nyb2xsVG9wOmZ1bmN0aW9uKCl7cmV0dXJuLWsodGhpcykueS10aGlzLm9wdGlvbnMueVBhZGRpbmdUb3B9LGdldE1heFNjcm9sbExlZnQ6ZnVuY3Rpb24oKXtyZXR1cm4tRS5tYXhTY3JvbGxPZmZzZXQtdGhpcy5vcHRpb25zLnhQYWRkaW5nVG9wfSxnZXRNYXhTY3JvbGxUb3A6ZnVuY3Rpb24oKXtyZXR1cm4tRS5tYXhTY3JvbGxPZmZzZXQtdGhpcy5vcHRpb25zLnlQYWRkaW5nVG9wfSxnZXRCb3VuZGFyeU9mZnNldDpmdW5jdGlvbigpe3JldHVybiBNYXRoLmFicyhoKHRoaXMsayh0aGlzKVt0aGlzLmF4aXNdKXx8MCl9LHJlZnJlc2g6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmVsZW1lbnQsYj1cInlcIj09PXRoaXMuYXhpcyxjPWI/XCJoZWlnaHRcIjpcIndpZHRoXCI7aWYobnVsbCE9dGhpcy5vcHRpb25zW2NdKWEuc3R5bGVbY109dGhpcy5vcHRpb25zW2NdK1wicHhcIjtlbHNlIGlmKHRoaXMub3B0aW9ucy51c2VFbGVtZW50UmVjdClhLnN0eWxlW2NdPVwiYXV0b1wiLGEuc3R5bGVbY109ZShhKVtjXStcInB4XCI7ZWxzZSBpZihhLmNoaWxkRWxlbWVudENvdW50PjApe3ZhciBkLGgsaT1hLmZpcnN0RWxlbWVudENoaWxkLGw9YS5sYXN0RWxlbWVudENoaWxkO2lmKGRvY3VtZW50LmNyZWF0ZVJhbmdlJiYhdGhpcy5vcHRpb25zLmlnbm9yZU92ZXJmbG93JiYoZD1kb2N1bWVudC5jcmVhdGVSYW5nZSgpLGQuc2VsZWN0Tm9kZUNvbnRlbnRzKGEpLGg9ZShkKSksaClhLnN0eWxlW2NdPWhbY10rXCJweFwiO2Vsc2V7Zm9yKDtpJiYwPT09ZShpKVtjXSYmaS5uZXh0RWxlbWVudFNpYmxpbmc7KWk9aS5uZXh0RWxlbWVudFNpYmxpbmc7Zm9yKDtsJiZsIT09aSYmMD09PWUobClbY10mJmwucHJldmlvdXNFbGVtZW50U2libGluZzspbD1sLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7YS5zdHlsZVtjXT1lKGwpW2I/XCJib3R0b21cIjpcInJpZ2h0XCJdLWUoaSlbYj9cInRvcFwiOlwibGVmdFwiXStcInB4XCJ9fXJldHVybiB0aGlzLnRyYW5zZm9ybU9mZnNldD1rKHRoaXMpLHRoaXMubWluU2Nyb2xsT2Zmc2V0PWYodGhpcyksdGhpcy5tYXhTY3JvbGxPZmZzZXQ9Zyh0aGlzKSx0aGlzLnNjcm9sbFRvKC10aGlzLnRyYW5zZm9ybU9mZnNldFt0aGlzLmF4aXNdLXRoaXMub3B0aW9uc1t0aGlzLmF4aXMrXCJQYWRkaW5nVG9wXCJdKSxqKHRoaXMsXCJjb250ZW50cmVmcmVzaFwiKSx0aGlzfSxvZmZzZXQ6ZnVuY3Rpb24oYSl7dmFyIGI9ZSh0aGlzLmVsZW1lbnQpLGM9ZShhKTtpZihcInlcIj09PXRoaXMuYXhpcyl7dmFyIGQ9e3RvcDpjLnRvcC1iLnRvcC10aGlzLm9wdGlvbnMueVBhZGRpbmdUb3AsbGVmdDpjLmxlZnQtYi5sZWZ0LHJpZ2h0OmIucmlnaHQtYy5yaWdodCx3aWR0aDpjLndpZHRoLGhlaWdodDpjLmhlaWdodH07ZC5ib3R0b209ZC50b3ArZC5oZWlnaHR9ZWxzZXt2YXIgZD17dG9wOmMudG9wLWIudG9wLGJvdHRvbTpiLmJvdHRvbS1jLmJvdHRvbSxsZWZ0OmMubGVmdC1iLmxlZnQtdGhpcy5vcHRpb25zLnhQYWRkaW5nVG9wLHdpZHRoOmMud2lkdGgsaGVpZ2h0OmMuaGVpZ2h0fTtkLnJpZ2h0PWQubGVmdCtkLndpZHRofXJldHVybiBkfSxnZXRSZWN0OmZ1bmN0aW9uKGEpe3ZhciBiPWUodGhpcy52aWV3cG9ydCksYz1lKGEpO2lmKFwieVwiPT09dGhpcy5heGlzKXt2YXIgZD17dG9wOmMudG9wLWIudG9wLGxlZnQ6Yy5sZWZ0LWIubGVmdCxyaWdodDpiLnJpZ2h0LWMucmlnaHQsd2lkdGg6Yy53aWR0aCxoZWlnaHQ6Yy5oZWlnaHR9O2QuYm90dG9tPWQudG9wK2QuaGVpZ2h0fWVsc2V7dmFyIGQ9e3RvcDpjLnRvcC1iLnRvcCxib3R0b206Yi5ib3R0b20tYy5ib3R0b20sbGVmdDpjLmxlZnQtYi5sZWZ0LHdpZHRoOmMud2lkdGgsaGVpZ2h0OmMuaGVpZ2h0fTtkLnJpZ2h0PWQubGVmdCtkLndpZHRofXJldHVybiBkfSxpc0luVmlldzpmdW5jdGlvbihhKXt2YXIgYj10aGlzLmdldFJlY3QodGhpcy52aWV3cG9ydCksYz10aGlzLmdldFJlY3QoYSk7cmV0dXJuXCJ5XCI9PT10aGlzLmF4aXM/Yi50b3A8Yy5ib3R0b20mJmIuYm90dG9tPmMudG9wOmIubGVmdDxjLnJpZ2h0JiZiLnJpZ2h0PmMubGVmdH0sc2Nyb2xsVG86ZnVuY3Rpb24oYSxjKXt2YXIgZD10aGlzO3RoaXMuZWxlbWVudDtpZihhPS1hLXRoaXMub3B0aW9uc1t0aGlzLmF4aXMrXCJQYWRkaW5nVG9wXCJdLGE9aSh0aGlzLGEpLEw9ITAsYz09PSEwKWlmKHRoaXMub3B0aW9ucy51c2VGcmFtZUFuaW1hdGlvbil7dmFyIGU9ayhkKVt0aGlzLmF4aXNdLGY9YS1lO0g9bmV3IGIuYW5pbWF0aW9uKDQwMCxiLmN1YmljYmV6aWVyLmVhc2UsMCxmdW5jdGlvbihhLGIpe3ZhciBjPShlK2YqYikudG9GaXhlZCgyKTtuKGQsYyksaihkLFwic2Nyb2xsaW5nXCIpfSksSC5vbmVuZChEKSxILnBsYXkoKX1lbHNlIG0oZCxcIjAuNHNcIixcImVhc2VcIiksbihkLGEpLHAoRCw0MDApLGIuYW5pbWF0aW9uLnJlcXVlc3RGcmFtZShmdW5jdGlvbigpe0wmJmQuZW5hYmxlZCYmKGooZCxcInNjcm9sbGluZ1wiKSxiLmFuaW1hdGlvbi5yZXF1ZXN0RnJhbWUoYXJndW1lbnRzLmNhbGxlZSkpfSk7ZWxzZSB0aGlzLm9wdGlvbnMudXNlRnJhbWVBbmltYXRpb258fG0oZCxcIlwiLFwiXCIpLG4oZCxhKSxEKCk7cmV0dXJuIHRoaXN9LHNjcm9sbFRvRWxlbWVudDpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMub2Zmc2V0KGEpO3JldHVybiBjPWNbXCJ5XCI9PT10aGlzLmF4aXM/XCJ0b3BcIjpcImxlZnRcIl0sdGhpcy5zY3JvbGxUbyhjLGIpfSxnZXRWaWV3V2lkdGg6ZnVuY3Rpb24oKXtyZXR1cm4gZSh0aGlzLnZpZXdwb3J0KS53aWR0aH0sZ2V0Vmlld0hlaWdodDpmdW5jdGlvbigpe3JldHVybiBlKHRoaXMudmlld3BvcnQpLmhlaWdodH0sYWRkUHVsbGRvd25IYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7cmV0dXJuIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicHVsbGRvd25lbmRcIixmdW5jdGlvbihjKXtiLmRpc2FibGUoKSxhLmNhbGwoYixjLGZ1bmN0aW9uKCl7Yi5zY3JvbGxUbygwLCEwKSxiLnJlZnJlc2goKSxiLmVuYWJsZSgpfSl9LCExKSx0aGlzfSxhZGRQdWxsdXBIYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7cmV0dXJuIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicHVsbHVwZW5kXCIsZnVuY3Rpb24oYyl7Yi5kaXNhYmxlKCksYS5jYWxsKGIsYyxmdW5jdGlvbigpe2Iuc2Nyb2xsVG8oYi5nZXRTY3JvbGxIZWlnaHQoKSwhMCksYi5yZWZyZXNoKCksYi5lbmFibGUoKX0pfSwhMSksdGhpc30sYWRkU2Nyb2xsc3RhcnRIYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7cmV0dXJuIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsc3RhcnRcIixmdW5jdGlvbihjKXthLmNhbGwoYixjKX0sITEpLHRoaXN9LGFkZFNjcm9sbGluZ0hhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztyZXR1cm4gdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxpbmdcIixmdW5jdGlvbihjKXthLmNhbGwoYixjKX0sITEpLHRoaXN9LGFkZFNjcm9sbGVuZEhhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztyZXR1cm4gdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxlbmRcIixmdW5jdGlvbihjKXthLmNhbGwoYixjKX0sITEpLHRoaXN9LGFkZENvbnRlbnRyZW5mcmVzaEhhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpczt0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRlbnRyZWZyZXNoXCIsZnVuY3Rpb24oYyl7YS5jYWxsKGIsYyl9LCExKX0sYWRkRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9dGhpczt0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihhLGZ1bmN0aW9uKGEpe2IuY2FsbChkLGEpfSwhIWMpfSxyZW1vdmVFdmVudExpc3RlbmVyOmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpczt0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihhLGZ1bmN0aW9uKGEpe2IuY2FsbChjLGEpfSl9LGVuYWJsZVBsdWdpbjpmdW5jdGlvbihhLGIpe3ZhciBjPXNbYV07cmV0dXJuIGMmJiF0aGlzLnBsdWdpbnNbYV0mJih0aGlzLnBsdWdpbnNbYV09ITAsYj1ifHx7fSxjLmNhbGwodGhpcyxhLGIpKSx0aGlzfX07Zm9yKHZhciBRIGluIFApdGhpc1tRXT1QW1FdO2RlbGV0ZSBQfXZhciBwPWEuZG9jdW1lbnQscT1hLm5hdmlnYXRvci51c2VyQWdlbnQscj17fSxzPXt9LHQ9YS5kcHJ8fChhLm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvKT9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgvYS5zY3JlZW4uYXZhaWxXaWR0aDoxKSx1PXtub3JtYWw6WzIqdCwuMDAxNSp0XSxzbG93OlsxLjUqdCwuMDAzKnRdLHZlcnlzbG93OlsxLjUqdCwuMDA1KnRdfSx2PSEhcS5tYXRjaCgvRmlyZWZveC9pKSx3PSEhcS5tYXRjaCgvSUVNb2JpbGUvaSkseD12P1wiLW1vei1cIjp3P1wiLW1zLVwiOlwiLXdlYmtpdC1cIix5PXY/XCJNb3pcIjp3P1wibXNcIjpcIndlYmtpdFwiLHo9dz9cIk1TQ1NTTWF0cml4XCI6XCJXZWJLaXRDU1NNYXRyaXhcIixBPSEhdnx8eiBpbiBhJiZcIm0xMVwiaW4gbmV3IGFbel0sQj0hMTtwLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIixmdW5jdGlvbihhKXtyZXR1cm4gQj8oYS5wcmV2ZW50RGVmYXVsdCgpLCExKTohMH0sITEpLGIuc2Nyb2xsPWZ1bmN0aW9uKGEsYyl7aWYoMT09PWFyZ3VtZW50cy5sZW5ndGgmJiEoYXJndW1lbnRzWzBdaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpaWYoYz1hcmd1bWVudHNbMF0sYy5zY3JvbGxFbGVtZW50KWE9Yy5zY3JvbGxFbGVtZW50O2Vsc2V7aWYoIWMuc2Nyb2xsV3JhcCl0aHJvdyBuZXcgRXJyb3IoXCJubyBzY3JvbGwgZWxlbWVudFwiKTthPWMuc2Nyb2xsV3JhcC5maXJzdEVsZW1lbnRDaGlsZH1pZighYS5wYXJlbnROb2RlKXRocm93IG5ldyBFcnJvcihcIndyb25nIGRvbSB0cmVlXCIpO2lmKGMmJmMuZGlyZWN0aW9uJiZbXCJ4XCIsXCJ5XCJdLmluZGV4T2YoYy5kaXJlY3Rpb24pPDApdGhyb3cgbmV3IEVycm9yKFwid3JvbmcgZGlyZWN0aW9uXCIpO3ZhciBkO3JldHVybiBkPWMuZG93bmdyYWRlPT09ITAmJmIuc2Nyb2xsLmRvd25ncmFkZT9iLnNjcm9sbC5kb3duZ3JhZGUoYSxjKTphLnNjcm9sbElkP3JbYS5zY3JvbGxJZF06bmV3IG8oYSxjKX0sYi5zY3JvbGwucGx1Z2luPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGI/KGE9YS5zcGxpdChcIixcIiksdm9pZCBhLmZvckVhY2goZnVuY3Rpb24oYSl7c1thXT1ifSkpOnNbYV19fSh3aW5kb3csd2luZG93LmxpYnx8KHdpbmRvdy5saWI9e30pKTs7bW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cubGliWydzY3JvbGwnXTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zY3JvbGxqcy9idWlsZC9zY3JvbGwuY29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gMzJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgJiYgKHdpbmRvdyA9IHtjdHJsOiB7fSwgbGliOiB7fX0pOyF3aW5kb3cuY3RybCAmJiAod2luZG93LmN0cmwgPSB7fSk7IXdpbmRvdy5saWIgJiYgKHdpbmRvdy5saWIgPSB7fSk7IWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhhKXtyZXR1cm4gc2V0VGltZW91dChhLGwpfWZ1bmN0aW9uIGQoYSl7Y2xlYXJUaW1lb3V0KGEpfWZ1bmN0aW9uIGUoKXt2YXIgYT17fSxiPW5ldyBtKGZ1bmN0aW9uKGIsYyl7YS5yZXNvbHZlPWIsYS5yZWplY3Q9Y30pO3JldHVybiBhLnByb21pc2U9YixhfWZ1bmN0aW9uIGYoYSxiKXtyZXR1cm5bXCJ0aGVuXCIsXCJjYXRjaFwiXS5mb3JFYWNoKGZ1bmN0aW9uKGMpe2JbY109ZnVuY3Rpb24oKXtyZXR1cm4gYVtjXS5hcHBseShhLGFyZ3VtZW50cyl9fSksYn1mdW5jdGlvbiBnKGIpe3ZhciBjLGQsaD0hMTt0aGlzLnJlcXVlc3Q9ZnVuY3Rpb24oKXtoPSExO3ZhciBnPWFyZ3VtZW50cztyZXR1cm4gYz1lKCksZihjLnByb21pc2UsdGhpcyksZD1uKGZ1bmN0aW9uKCl7aHx8YyYmYy5yZXNvbHZlKGIuYXBwbHkoYSxnKSl9KSx0aGlzfSx0aGlzLmNhbmNlbD1mdW5jdGlvbigpe3JldHVybiBkJiYoaD0hMCxvKGQpLGMmJmMucmVqZWN0KFwiQ0FOQ0VMXCIpKSx0aGlzfSx0aGlzLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBnKGIpfX1mdW5jdGlvbiBoKGEsYil7XCJmdW5jdGlvblwiPT10eXBlb2YgYiYmKGI9ezA6Yn0pO2Zvcih2YXIgYz1hL2wsZD0xL2MsZT1bXSxmPU9iamVjdC5rZXlzKGIpLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gcGFyc2VJbnQoYSl9KSxoPTA7Yz5oO2grKyl7dmFyIGk9ZlswXSxqPWQqaDtpZihudWxsIT1pJiYxMDAqaj49aSl7dmFyIGs9YltcIlwiK2ldO2sgaW5zdGFuY2VvZiBnfHwoaz1uZXcgZyhrKSksZS5wdXNoKGspLGYuc2hpZnQoKX1lbHNlIGUubGVuZ3RoJiZlLnB1c2goZVtlLmxlbmd0aC0xXS5jbG9uZSgpKX1yZXR1cm4gZX1mdW5jdGlvbiBpKGEpe3ZhciBjO3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhfHxhIGluc3RhbmNlb2YgQXJyYXk/Yi5jdWJpY2Jlemllcj9cInN0cmluZ1wiPT10eXBlb2YgYT9iLmN1YmljYmV6aWVyW2FdJiYoYz1iLmN1YmljYmV6aWVyW2FdKTphIGluc3RhbmNlb2YgQXJyYXkmJjQ9PT1hLmxlbmd0aCYmKGM9Yi5jdWJpY2Jlemllci5hcHBseShiLmN1YmljYmV6aWVyLGEpKTpjb25zb2xlLmVycm9yKFwicmVxdWlyZSBsaWIuY3ViaWNiZXppZXJcIik6XCJmdW5jdGlvblwiPT10eXBlb2YgYSYmKGM9YSksY31mdW5jdGlvbiBqKGEsYixjKXt2YXIgZCxnPWgoYSxjKSxqPTEvKGEvbCksaz0wLG09aShiKTtpZighbSl0aHJvdyBuZXcgRXJyb3IoXCJ1bmV4Y2VwdCB0aW1pbmcgZnVuY3Rpb25cIik7dmFyIG49ITE7dGhpcy5wbGF5PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYSgpe3ZhciBjPWoqKGsrMSkudG9GaXhlZCgxMCksZT1nW2tdO2UucmVxdWVzdChjLnRvRml4ZWQoMTApLGIoYykudG9GaXhlZCgxMCkpLnRoZW4oZnVuY3Rpb24oKXtuJiYoaz09PWcubGVuZ3RoLTE/KG49ITEsZCYmZC5yZXNvbHZlKFwiRklOSVNIXCIpLGQ9bnVsbCk6KGsrKyxhKCkpKX0sZnVuY3Rpb24oKXt9KX1pZighbilyZXR1cm4gbj0hMCxkfHwoZD1lKCksZihkLnByb21pc2UsdGhpcykpLGEoKSx0aGlzfSx0aGlzLnN0b3A9ZnVuY3Rpb24oKXtyZXR1cm4gbj8obj0hMSxnW2tdJiZnW2tdLmNhbmNlbCgpLHRoaXMpOnZvaWQgMH19dmFyIGs9NjAsbD0xZTMvayxtPWEuUHJvbWlzZXx8Yi5wcm9taXNlJiZiLnByb21pc2UuRVM2UHJvbWlzZSxuPXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8YyxvPXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZXx8d2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWV8fHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZXx8d2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lfHxkOyhuPT09Y3x8bz09PWQpJiYobj1jLG89ZCksYi5hbmltYXRpb249ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBuZXcgaihhLGIsYyl9LGIuYW5pbWF0aW9uLmZyYW1lPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgZyhhKX0sYi5hbmltYXRpb24ucmVxdWVzdEZyYW1lPWZ1bmN0aW9uKGEpe3ZhciBiPW5ldyBnKGEpO3JldHVybiBiLnJlcXVlc3QoKX19KHdpbmRvdyx3aW5kb3cubGlifHwod2luZG93LmxpYj17fSkpOzttb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5saWJbJ2FuaW1hdGlvbiddO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2FuaW1hdGlvbmpzL2J1aWxkL2FuaW1hdGlvbi5jb21tb24uanNcbiAqKiBtb2R1bGUgaWQgPSAzM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSAmJiAod2luZG93ID0ge2N0cmw6IHt9LCBsaWI6IHt9fSk7IXdpbmRvdy5jdHJsICYmICh3aW5kb3cuY3RybCA9IHt9KTshd2luZG93LmxpYiAmJiAod2luZG93LmxpYiA9IHt9KTshZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBjKGEsYixjLGQpe2Z1bmN0aW9uIGUoYSl7cmV0dXJuKDMqayphKzIqbCkqYSttfWZ1bmN0aW9uIGYoYSl7cmV0dXJuKChrKmErbCkqYSttKSphfWZ1bmN0aW9uIGcoYSl7cmV0dXJuKChuKmErbykqYStwKSphfWZ1bmN0aW9uIGgoYSl7Zm9yKHZhciBiLGMsZD1hLGc9MDs4Pmc7ZysrKXtpZihjPWYoZCktYSxNYXRoLmFicyhjKTxqKXJldHVybiBkO2lmKGI9ZShkKSxNYXRoLmFicyhiKTxqKWJyZWFrO2QtPWMvYn12YXIgaD0xLGk9MDtmb3IoZD1hO2g+aTspe2lmKGM9ZihkKS1hLE1hdGguYWJzKGMpPGopcmV0dXJuIGQ7Yz4wP2g9ZDppPWQsZD0oaCtpKS8yfXJldHVybiBkfWZ1bmN0aW9uIGkoYSl7cmV0dXJuIGcoaChhKSl9dmFyIGo9MWUtNixrPTMqYS0zKmMrMSxsPTMqYy02KmEsbT0zKmEsbj0zKmItMypkKzEsbz0zKmQtNipiLHA9MypiO3JldHVybiBpfWIuY3ViaWNiZXppZXI9YyxiLmN1YmljYmV6aWVyLmxpbmVhcj1jKDAsMCwxLDEpLGIuY3ViaWNiZXppZXIuZWFzZT1jKC4yNSwuMSwuMjUsMSksYi5jdWJpY2Jlemllci5lYXNlSW49YyguNDIsMCwxLDEpLGIuY3ViaWNiZXppZXIuZWFzZU91dD1jKDAsMCwuNTgsMSksYi5jdWJpY2Jlemllci5lYXNlSW5PdXQ9YyguNDIsMCwuNTgsMSl9KHdpbmRvdyx3aW5kb3cubGlifHwod2luZG93LmxpYj17fSkpOzttb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5saWJbJ2N1YmljYmV6aWVyJ107XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3ViaWNiZXppZXIvYnVpbGQvY3ViaWNiZXppZXIuY29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gMzRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgJiYgKHdpbmRvdyA9IHtjdHJsOiB7fSwgbGliOiB7fX0pOyF3aW5kb3cuY3RybCAmJiAod2luZG93LmN0cmwgPSB7fSk7IXdpbmRvdy5saWIgJiYgKHdpbmRvdy5saWIgPSB7fSk7IWZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYSxiKXtmb3IodmFyIGM9YTtjOyl7aWYoYy5jb250YWlucyhiKXx8Yz09YilyZXR1cm4gYztjPWMucGFyZW50Tm9kZX1yZXR1cm4gbnVsbH1mdW5jdGlvbiBjKGEsYixjKXt2YXIgZD1pLmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKTtpZihkLmluaXRFdmVudChiLCEwLCEwKSxcIm9iamVjdFwiPT10eXBlb2YgYylmb3IodmFyIGUgaW4gYylkW2VdPWNbZV07YS5kaXNwYXRjaEV2ZW50KGQpfWZ1bmN0aW9uIGQoYSxiLGMsZCxlLGYsZyxoKXt2YXIgaT1NYXRoLmF0YW4yKGgtZixnLWUpLU1hdGguYXRhbjIoZC1iLGMtYSksaj1NYXRoLnNxcnQoKE1hdGgucG93KGgtZiwyKStNYXRoLnBvdyhnLWUsMikpLyhNYXRoLnBvdyhkLWIsMikrTWF0aC5wb3coYy1hLDIpKSksaz1bZS1qKmEqTWF0aC5jb3MoaSkraipiKk1hdGguc2luKGkpLGYtaipiKk1hdGguY29zKGkpLWoqYSpNYXRoLnNpbihpKV07cmV0dXJue3JvdGF0ZTppLHNjYWxlOmosdHJhbnNsYXRlOmssbWF0cml4OltbaipNYXRoLmNvcyhpKSwtaipNYXRoLnNpbihpKSxrWzBdXSxbaipNYXRoLnNpbihpKSxqKk1hdGguY29zKGkpLGtbMV1dLFswLDAsMV1dfX1mdW5jdGlvbiBlKGEpezA9PT1PYmplY3Qua2V5cyhsKS5sZW5ndGgmJihqLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIixmLCExKSxqLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLGcsITEpLGouYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsaCwhMSkpO2Zvcih2YXIgZD0wO2Q8YS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7ZCsrKXt2YXIgZT1hLmNoYW5nZWRUb3VjaGVzW2RdLGk9e307Zm9yKHZhciBtIGluIGUpaVttXT1lW21dO3ZhciBuPXtzdGFydFRvdWNoOmksc3RhcnRUaW1lOkRhdGUubm93KCksc3RhdHVzOlwidGFwcGluZ1wiLGVsZW1lbnQ6YS5zcmNFbGVtZW50fHxhLnRhcmdldCxwcmVzc2luZ0hhbmRsZXI6c2V0VGltZW91dChmdW5jdGlvbihiLGQpe3JldHVybiBmdW5jdGlvbigpe1widGFwcGluZ1wiPT09bi5zdGF0dXMmJihuLnN0YXR1cz1cInByZXNzaW5nXCIsYyhiLFwibG9uZ3ByZXNzXCIse3RvdWNoOmQsdG91Y2hlczphLnRvdWNoZXMsY2hhbmdlZFRvdWNoZXM6YS5jaGFuZ2VkVG91Y2hlcyx0b3VjaEV2ZW50OmF9KSksY2xlYXJUaW1lb3V0KG4ucHJlc3NpbmdIYW5kbGVyKSxuLnByZXNzaW5nSGFuZGxlcj1udWxsfX0oYS5zcmNFbGVtZW50fHxhLnRhcmdldCxhLmNoYW5nZWRUb3VjaGVzW2RdKSw1MDApfTtsW2UuaWRlbnRpZmllcl09bn1pZigyPT1PYmplY3Qua2V5cyhsKS5sZW5ndGgpe3ZhciBvPVtdO2Zvcih2YXIgbSBpbiBsKW8ucHVzaChsW21dLmVsZW1lbnQpO2MoYihvWzBdLG9bMV0pLFwiZHVhbHRvdWNoc3RhcnRcIix7dG91Y2hlczprLmNhbGwoYS50b3VjaGVzKSx0b3VjaEV2ZW50OmF9KX19ZnVuY3Rpb24gZihhKXtmb3IodmFyIGU9MDtlPGEuY2hhbmdlZFRvdWNoZXMubGVuZ3RoO2UrKyl7dmFyIGY9YS5jaGFuZ2VkVG91Y2hlc1tlXSxnPWxbZi5pZGVudGlmaWVyXTtpZighZylyZXR1cm47Zy5sYXN0VG91Y2h8fChnLmxhc3RUb3VjaD1nLnN0YXJ0VG91Y2gpLGcubGFzdFRpbWV8fChnLmxhc3RUaW1lPWcuc3RhcnRUaW1lKSxnLnZlbG9jaXR5WHx8KGcudmVsb2NpdHlYPTApLGcudmVsb2NpdHlZfHwoZy52ZWxvY2l0eVk9MCksZy5kdXJhdGlvbnx8KGcuZHVyYXRpb249MCk7dmFyIGg9RGF0ZS5ub3coKS1nLmxhc3RUaW1lLGk9KGYuY2xpZW50WC1nLmxhc3RUb3VjaC5jbGllbnRYKS9oLGo9KGYuY2xpZW50WS1nLmxhc3RUb3VjaC5jbGllbnRZKS9oLGs9NzA7aD5rJiYoaD1rKSxnLmR1cmF0aW9uK2g+ayYmKGcuZHVyYXRpb249ay1oKSxnLnZlbG9jaXR5WD0oZy52ZWxvY2l0eVgqZy5kdXJhdGlvbitpKmgpLyhnLmR1cmF0aW9uK2gpLGcudmVsb2NpdHlZPShnLnZlbG9jaXR5WSpnLmR1cmF0aW9uK2oqaCkvKGcuZHVyYXRpb24raCksZy5kdXJhdGlvbis9aCxnLmxhc3RUb3VjaD17fTtmb3IodmFyIG0gaW4gZilnLmxhc3RUb3VjaFttXT1mW21dO2cubGFzdFRpbWU9RGF0ZS5ub3coKTt2YXIgbj1mLmNsaWVudFgtZy5zdGFydFRvdWNoLmNsaWVudFgsbz1mLmNsaWVudFktZy5zdGFydFRvdWNoLmNsaWVudFkscD1NYXRoLnNxcnQoTWF0aC5wb3cobiwyKStNYXRoLnBvdyhvLDIpKTsoXCJ0YXBwaW5nXCI9PT1nLnN0YXR1c3x8XCJwcmVzc2luZ1wiPT09Zy5zdGF0dXMpJiZwPjEwJiYoZy5zdGF0dXM9XCJwYW5uaW5nXCIsZy5pc1ZlcnRpY2FsPSEoTWF0aC5hYnMobik+TWF0aC5hYnMobykpLGMoZy5lbGVtZW50LFwicGFuc3RhcnRcIix7dG91Y2g6Zix0b3VjaGVzOmEudG91Y2hlcyxjaGFuZ2VkVG91Y2hlczphLmNoYW5nZWRUb3VjaGVzLHRvdWNoRXZlbnQ6YSxpc1ZlcnRpY2FsOmcuaXNWZXJ0aWNhbH0pLGMoZy5lbGVtZW50LChnLmlzVmVydGljYWw/XCJ2ZXJ0aWNhbFwiOlwiaG9yaXpvbnRhbFwiKStcInBhbnN0YXJ0XCIse3RvdWNoOmYsdG91Y2hFdmVudDphfSkpLFwicGFubmluZ1wiPT09Zy5zdGF0dXMmJihnLnBhblRpbWU9RGF0ZS5ub3coKSxjKGcuZWxlbWVudCxcInBhbm1vdmVcIix7ZGlzcGxhY2VtZW50WDpuLGRpc3BsYWNlbWVudFk6byx0b3VjaDpmLHRvdWNoZXM6YS50b3VjaGVzLGNoYW5nZWRUb3VjaGVzOmEuY2hhbmdlZFRvdWNoZXMsdG91Y2hFdmVudDphLGlzVmVydGljYWw6Zy5pc1ZlcnRpY2FsfSksZy5pc1ZlcnRpY2FsP2MoZy5lbGVtZW50LFwidmVydGljYWxwYW5tb3ZlXCIse2Rpc3BsYWNlbWVudFk6byx0b3VjaDpmLHRvdWNoRXZlbnQ6YX0pOmMoZy5lbGVtZW50LFwiaG9yaXpvbnRhbHBhbm1vdmVcIix7ZGlzcGxhY2VtZW50WDpuLHRvdWNoOmYsdG91Y2hFdmVudDphfSkpfWlmKDI9PU9iamVjdC5rZXlzKGwpLmxlbmd0aCl7Zm9yKHZhciBxLHI9W10scz1bXSx0PVtdLGU9MDtlPGEudG91Y2hlcy5sZW5ndGg7ZSsrKXt2YXIgZj1hLnRvdWNoZXNbZV0sZz1sW2YuaWRlbnRpZmllcl07ci5wdXNoKFtnLnN0YXJ0VG91Y2guY2xpZW50WCxnLnN0YXJ0VG91Y2guY2xpZW50WV0pLHMucHVzaChbZi5jbGllbnRYLGYuY2xpZW50WV0pfWZvcih2YXIgbSBpbiBsKXQucHVzaChsW21dLmVsZW1lbnQpO3E9ZChyWzBdWzBdLHJbMF1bMV0sclsxXVswXSxyWzFdWzFdLHNbMF1bMF0sc1swXVsxXSxzWzFdWzBdLHNbMV1bMV0pLGMoYih0WzBdLHRbMV0pLFwiZHVhbHRvdWNoXCIse3RyYW5zZm9ybTpxLHRvdWNoZXM6YS50b3VjaGVzLHRvdWNoRXZlbnQ6YX0pfX1mdW5jdGlvbiBnKGEpe2lmKDI9PU9iamVjdC5rZXlzKGwpLmxlbmd0aCl7dmFyIGQ9W107Zm9yKHZhciBlIGluIGwpZC5wdXNoKGxbZV0uZWxlbWVudCk7YyhiKGRbMF0sZFsxXSksXCJkdWFsdG91Y2hlbmRcIix7dG91Y2hlczprLmNhbGwoYS50b3VjaGVzKSx0b3VjaEV2ZW50OmF9KX1mb3IodmFyIGk9MDtpPGEuY2hhbmdlZFRvdWNoZXMubGVuZ3RoO2krKyl7dmFyIG49YS5jaGFuZ2VkVG91Y2hlc1tpXSxvPW4uaWRlbnRpZmllcixwPWxbb107aWYocCl7aWYocC5wcmVzc2luZ0hhbmRsZXImJihjbGVhclRpbWVvdXQocC5wcmVzc2luZ0hhbmRsZXIpLHAucHJlc3NpbmdIYW5kbGVyPW51bGwpLFwidGFwcGluZ1wiPT09cC5zdGF0dXMmJihwLnRpbWVzdGFtcD1EYXRlLm5vdygpLGMocC5lbGVtZW50LFwidGFwXCIse3RvdWNoOm4sdG91Y2hFdmVudDphfSksbSYmcC50aW1lc3RhbXAtbS50aW1lc3RhbXA8MzAwJiZjKHAuZWxlbWVudCxcImRvdWJsZXRhcFwiLHt0b3VjaDpuLHRvdWNoRXZlbnQ6YX0pLG09cCksXCJwYW5uaW5nXCI9PT1wLnN0YXR1cyl7dmFyIHE9RGF0ZS5ub3coKSxyPXEtcC5zdGFydFRpbWUscz0oKG4uY2xpZW50WC1wLnN0YXJ0VG91Y2guY2xpZW50WCkvciwobi5jbGllbnRZLXAuc3RhcnRUb3VjaC5jbGllbnRZKS9yLG4uY2xpZW50WC1wLnN0YXJ0VG91Y2guY2xpZW50WCksdD1uLmNsaWVudFktcC5zdGFydFRvdWNoLmNsaWVudFksdT1NYXRoLnNxcnQocC52ZWxvY2l0eVkqcC52ZWxvY2l0eVkrcC52ZWxvY2l0eVgqcC52ZWxvY2l0eVgpLHY9dT4uNSYmcS1wLmxhc3RUaW1lPDEwMCx3PXtkdXJhdGlvbjpyLGlzZmxpY2s6dix2ZWxvY2l0eVg6cC52ZWxvY2l0eVgsdmVsb2NpdHlZOnAudmVsb2NpdHlZLGRpc3BsYWNlbWVudFg6cyxkaXNwbGFjZW1lbnRZOnQsdG91Y2g6bix0b3VjaGVzOmEudG91Y2hlcyxjaGFuZ2VkVG91Y2hlczphLmNoYW5nZWRUb3VjaGVzLHRvdWNoRXZlbnQ6YSxpc1ZlcnRpY2FsOnAuaXNWZXJ0aWNhbH07YyhwLmVsZW1lbnQsXCJwYW5lbmRcIix3KSx2JiYoYyhwLmVsZW1lbnQsXCJzd2lwZVwiLHcpLHAuaXNWZXJ0aWNhbD9jKHAuZWxlbWVudCxcInZlcnRpY2Fsc3dpcGVcIix3KTpjKHAuZWxlbWVudCxcImhvcml6b250YWxzd2lwZVwiLHcpKX1cInByZXNzaW5nXCI9PT1wLnN0YXR1cyYmYyhwLmVsZW1lbnQsXCJwcmVzc2VuZFwiLHt0b3VjaDpuLHRvdWNoRXZlbnQ6YX0pLGRlbGV0ZSBsW29dfX0wPT09T2JqZWN0LmtleXMobCkubGVuZ3RoJiYoai5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsZiwhMSksai5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIixnLCExKSxqLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLGgsITEpKX1mdW5jdGlvbiBoKGEpe2lmKDI9PU9iamVjdC5rZXlzKGwpLmxlbmd0aCl7dmFyIGQ9W107Zm9yKHZhciBlIGluIGwpZC5wdXNoKGxbZV0uZWxlbWVudCk7YyhiKGRbMF0sZFsxXSksXCJkdWFsdG91Y2hlbmRcIix7dG91Y2hlczprLmNhbGwoYS50b3VjaGVzKSx0b3VjaEV2ZW50OmF9KX1mb3IodmFyIGk9MDtpPGEuY2hhbmdlZFRvdWNoZXMubGVuZ3RoO2krKyl7dmFyIG09YS5jaGFuZ2VkVG91Y2hlc1tpXSxuPW0uaWRlbnRpZmllcixvPWxbbl07byYmKG8ucHJlc3NpbmdIYW5kbGVyJiYoY2xlYXJUaW1lb3V0KG8ucHJlc3NpbmdIYW5kbGVyKSxvLnByZXNzaW5nSGFuZGxlcj1udWxsKSxcInBhbm5pbmdcIj09PW8uc3RhdHVzJiZjKG8uZWxlbWVudCxcInBhbmVuZFwiLHt0b3VjaDptLHRvdWNoZXM6YS50b3VjaGVzLGNoYW5nZWRUb3VjaGVzOmEuY2hhbmdlZFRvdWNoZXMsdG91Y2hFdmVudDphfSksXCJwcmVzc2luZ1wiPT09by5zdGF0dXMmJmMoby5lbGVtZW50LFwicHJlc3NlbmRcIix7dG91Y2g6bSx0b3VjaEV2ZW50OmF9KSxkZWxldGUgbFtuXSl9MD09PU9iamVjdC5rZXlzKGwpLmxlbmd0aCYmKGoucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLGYsITEpLGoucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsZywhMSksai5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIixoLCExKSl9dmFyIGk9YS5kb2N1bWVudCxqPWkuZG9jdW1lbnRFbGVtZW50LGs9QXJyYXkucHJvdG90eXBlLnNsaWNlLGw9e30sbT1udWxsO2ouYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIixlLCExKX0od2luZG93KTs7bW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cubGliWydnZXN0dXJlanMnXTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9nZXN0dXJlanMvYnVpbGQvZ2VzdHVyZWpzLmNvbW1vbi5qc1xuICoqIG1vZHVsZSBpZCA9IDM1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpICYmICh3aW5kb3cgPSB7Y3RybDoge30sIGxpYjoge319KTshd2luZG93LmN0cmwgJiYgKHdpbmRvdy5jdHJsID0ge30pOyF3aW5kb3cubGliICYmICh3aW5kb3cubGliID0ge30pOyFmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGMoYSxiKXtyZXR1cm5bWyhhLzMrKGErYikvMy1hKS8oYi1hKSwoYSphLzMrYSpiKjIvMy1hKmEpLyhiKmItYSphKV0sWyhiLzMrKGErYikvMy1hKS8oYi1hKSwoYipiLzMrYSpiKjIvMy1hKmEpLyhiKmItYSphKV1dfWZ1bmN0aW9uIGQoYSl7aWYodGhpcy52PWEudnx8MCx0aGlzLmE9YS5hfHwwLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnQmJih0aGlzLnQ9YS50KSxcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5zJiYodGhpcy5zPWEucyksXCJ1bmRlZmluZWRcIj09dHlwZW9mIHRoaXMudClpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgdGhpcy5zKXRoaXMudD0tdGhpcy52L3RoaXMuYTtlbHNle3ZhciBiPShNYXRoLnNxcnQodGhpcy52KnRoaXMudisyKnRoaXMuYSp0aGlzLnMpLXRoaXMudikvdGhpcy5hLGM9KC1NYXRoLnNxcnQodGhpcy52KnRoaXMudisyKnRoaXMuYSp0aGlzLnMpLXRoaXMudikvdGhpcy5hO3RoaXMudD1NYXRoLm1pbihiLGMpfVwidW5kZWZpbmVkXCI9PXR5cGVvZiB0aGlzLnMmJih0aGlzLnM9dGhpcy5hKnRoaXMudCp0aGlzLnQvMit0aGlzLnYqdGhpcy50KX1kLnByb3RvdHlwZS5nZW5lcmF0ZUN1YmljQmV6aWVyPWZ1bmN0aW9uKCl7cmV0dXJuIGModGhpcy52L3RoaXMuYSx0aGlzLnQrdGhpcy52L3RoaXMuYSl9LGIubW90aW9uPWR9KHdpbmRvdyx3aW5kb3cubGlifHwod2luZG93LmxpYj17fSkpOzttb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5saWJbJ21vdGlvbiddO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L21vdGlvbmpzL2J1aWxkL21vdGlvbi5jb21tb24uanNcbiAqKiBtb2R1bGUgaWQgPSAzNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBBdG9taWMgPSByZXF1aXJlKCcuL2F0b21pYycpXG5yZXF1aXJlKCdrb3VudGRvd24vYnVpbGQvY291bnRkb3duJylcblxudmFyIEZPUk1BVFRFUl9SRUdFWFAgPSAvKFxcXFwpPyhkZCp8aGg/fG1tP3xzcz8pL2dpXG5cbmZ1bmN0aW9uIGZvcm1hdERhdGVUaW1lKGRhdGEsIGZvcm1hdHRlciwgdGltZUNvbG9yKSB7XG4gIHJldHVybiBmb3JtYXR0ZXIucmVwbGFjZShGT1JNQVRURVJfUkVHRVhQLCBmdW5jdGlvbiAobSkge1xuICAgIHZhciBsZW4gPSBtLmxlbmd0aFxuICAgIHZhciBmaXJzdENoYXIgPSBtLmNoYXJBdCgwKVxuICAgIC8vIGVzY2FwZSBjaGFyYWN0ZXJcbiAgICBpZiAoZmlyc3RDaGFyID09PSAnXFxcXCcpIHtcbiAgICAgIHJldHVybiBtLnJlcGxhY2UoJ1xcXFwnLCAnJylcbiAgICB9XG4gICAgdmFyIHZhbHVlID0gKGZpcnN0Q2hhciA9PT0gJ2QnID8gZGF0YS5kYXlzIDpcbiAgICAgICAgICAgICAgICBmaXJzdENoYXIgPT09ICdoJyA/IGRhdGEuaG91cnMgOlxuICAgICAgICAgICAgICAgIGZpcnN0Q2hhciA9PT0gJ20nID8gZGF0YS5taW51dGVzIDpcbiAgICAgICAgICAgICAgICBmaXJzdENoYXIgPT09ICdzJyA/IGRhdGEuc2Vjb25kcyA6IDApICsgJydcblxuICAgIC8vIDUgemVybyBzaG91bGQgYmUgZW5vdWdoXG4gICAgcmV0dXJuICc8c3BhbiBzdHlsZT1cIm1hcmdpbjo0cHg7Y29sb3I6J1xuICAgICAgKyB0aW1lQ29sb3IgKyAnXCIgPidcbiAgICAgICsgKCcwMDAwMCcgKyB2YWx1ZSkuc3Vic3RyKC1NYXRoLm1heCh2YWx1ZS5sZW5ndGgsIGxlbikpXG4gICAgICArICc8L3NwYW4+J1xuICB9KVxufVxuXG5mdW5jdGlvbiBDb3VudGRvd24gKGRhdGEpIHtcbiAgQXRvbWljLmNhbGwodGhpcywgZGF0YSlcbn1cblxuQ291bnRkb3duLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQXRvbWljLnByb3RvdHlwZSlcblxuQ291bnRkb3duLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgbm9kZS5jbGFzc0xpc3QuYWRkKCd3ZWV4LWVsZW1lbnQnKVxuICB2YXIgZGF0YSA9IHRoaXMuZGF0YVxuICB2YXIgdGltZSA9IE51bWJlcihkYXRhLmF0dHIuY291bnRkb3duVGltZSkgfHwgMFxuICB2YXIgZW5kVGltZSA9IERhdGUubm93KCkgLyAxMDAwICsgdGltZVxuICB2YXIgY2QgPSBsaWIuY291bnRkb3duKHtcbiAgICBlbmREYXRlOiBlbmRUaW1lLFxuICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAodGltZSkge1xuICAgICAgdmFyIHRpbWVDb2xvciA9IGRhdGEuc3R5bGUudGltZUNvbG9yIHx8ICcjMDAwJ1xuICAgICAgdmFyIHJlc3VsdCA9IGZvcm1hdERhdGVUaW1lKHRpbWUsIGRhdGEuYXR0ci5mb3JtYXR0ZXJWYWx1ZSwgdGltZUNvbG9yKVxuICAgICAgbm9kZS5pbm5lckhUTUwgPSByZXN1bHRcbiAgICB9LFxuICAgIG9uRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgfVxuICB9KS5zdGFydCgpXG5cbiAgcmV0dXJuIG5vZGVcbn1cblxuQ291bnRkb3duLnByb3RvdHlwZS5zdHlsZSA9IHtcbiAgdGV4dENvbG9yOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLm5vZGUuc3R5bGUuY29sb3IgPSB2YWx1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ291bnRkb3duXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvY291bnRkb3duLmpzXG4gKiogbW9kdWxlIGlkID0gMzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIiFmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGMoYSl7dmFyIGI7aWYoXCJudW1iZXJcIj09dHlwZW9mIGEpYj1uZXcgRGF0ZSgxZTMqYSk7ZWxzZSBpZihcInN0cmluZ1wiPT10eXBlb2YgYSl7dmFyIGM9YS5jaGFyQXQoMCksZD1cIitcIj09PWMsaD1cIi1cIj09PWM7aWYoZHx8aCl7Zm9yKHZhciBpLGo9YS5zdWJzdHIoMSksaz1qLnNwbGl0KFwiOlwiKSxsPVswLDAsMCwwXSxtPTQ7ay5sZW5ndGgmJi0tbT49MDspbFttXT1wYXJzZUludChrLnBvcCgpKXx8MDtpPWUqbFswXStmKmxbMV0rZypsWzJdK2xbM10sYj1uZXcgRGF0ZSxiLnNldFNlY29uZHMoYi5nZXRTZWNvbmRzKCkraSooaD8tMToxKSksYi5zZXRNaWxsaXNlY29uZHMoMCl9fXJldHVybiBifHwoYj1uZXcgRGF0ZShhKSksYn1mdW5jdGlvbiBkKGEsYil7cmV0dXJuIGIucmVwbGFjZShGT1JNQVRURVJfUkVHRVhQLGZ1bmN0aW9uKGIpe3ZhciBjPWIubGVuZ3RoLGQ9Yi5jaGFyQXQoMCk7aWYoXCJcXFxcXCI9PT1kKXJldHVybiBiLnJlcGxhY2UoXCJcXFxcXCIsXCJcIik7dmFyIGU9KFwiZFwiPT09ZD9hLmRheXM6XCJoXCI9PT1kP2EuaG91cnM6XCJtXCI9PT1kP2EubWludXRlczpcInNcIj09PWQ/YS5zZWNvbmRzOjApK1wiXCI7cmV0dXJuKFwiMDAwMDBcIitlKS5zdWJzdHIoLU1hdGgubWF4KGUubGVuZ3RoLGMpKX0pfXZhciBlPTg2NDAwLGY9MzYwMCxnPTYwLGg9XCJk5aSpaGjml7ZtbeWIhnNz56eSXCI7Rk9STUFUVEVSX1JFR0VYUD0vKFxcXFwpPyhkZCp8aGg/fG1tP3xzcz8pL2dpO3ZhciBpPWZ1bmN0aW9uKGEpe2E9YXx8e307dmFyIGI9dGhpcyxkPWMoYS5lbmREYXRlKTtpZighZHx8IWQuZ2V0VGltZSgpKXRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZW5kRGF0ZVwiKTtiLmVuZERhdGU9ZCxiLm9uVXBkYXRlPWEub25VcGRhdGUsYi5vbkVuZD1hLm9uRW5kLGIuaW50ZXJ2YWw9YS5pbnRlcnZhbHx8MWUzLGIuc3RyaW5nRm9ybWF0dGVyPWEuc3RyaW5nRm9ybWF0dGVyfHxoLGIuY29ycmVjdERhdGVPZmZzZXQ9YS5jb3JyZWN0RGF0ZU9mZnNldHx8MCxiLnVwZGF0ZUVsZW1lbnQ9YS51cGRhdGVFbGVtZW50LGIuX2RhdGE9e2RheXM6MCxob3VyczowLG1pbnV0ZXM6MCxzZWNvbmRzOjB9fTtpLnByb3RvdHlwZT17c3RhcnQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzO3JldHVybiBhLnN0b3AoKSxhLl91cGRhdGUoKSYmKGEuX2ludGVydmFsSWQ9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXthLl91cGRhdGUoKX0sYS5pbnRlcnZhbCkpLGF9LF91cGRhdGU6ZnVuY3Rpb24oKXt2YXIgYSxiPXRoaXMsYz1iLl9kYXRhLGg9Yi51cGRhdGVFbGVtZW50LGk9K25ldyBEYXRlKzFlMypiLmNvcnJlY3REYXRlT2Zmc2V0LGo9TWF0aC5tYXgoMCxNYXRoLnJvdW5kKChiLmVuZERhdGUuZ2V0VGltZSgpLWkpLzFlMykpLGs9MD49ajtyZXR1cm4gYy50b3RhbFNlY29uZHM9aixqLT0oYy5kYXlzPU1hdGguZmxvb3Ioai9lKSkqZSxqLT0oYy5ob3Vycz1NYXRoLmZsb29yKGovZikpKmYsai09KGMubWludXRlcz1NYXRoLmZsb29yKGovZykpKmcsYy5zZWNvbmRzPWosYy5zdHJpbmdWYWx1ZT1kKGMsYi5zdHJpbmdGb3JtYXR0ZXIpLGgmJihoLmlubmVySFRNTD1jLnN0cmluZ1ZhbHVlKSwoYT1iLm9uVXBkYXRlKSYmYS5jYWxsKGIsYyksaz8oYi5zdG9wKCksKGE9Yi5vbkVuZCkmJmEuY2FsbChiKSwhMSk6ITB9LHN0b3A6ZnVuY3Rpb24oKXt2YXIgYT10aGlzO3JldHVybiBhLl9pbnRlcnZhbElkJiYoY2xlYXJJbnRlcnZhbChhLl9pbnRlcnZhbElkKSxhLl9pbnRlcnZhbElkPW51bGwpLGF9LHNldEVuZERhdGU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztyZXR1cm4gYi5lbmREYXRlPWMoYSksYn19LGIuY291bnRkb3duPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgaShhKX19KHdpbmRvdyx3aW5kb3cubGlifHwod2luZG93LmxpYj17fSkpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2tvdW50ZG93bi9idWlsZC9jb3VudGRvd24uanNcbiAqKiBtb2R1bGUgaWQgPSAzOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcbnZhciBDb21wb25lbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vY29tcG9uZW50TWFuYWdlcicpXG52YXIgTGF6eUxvYWQgPSByZXF1aXJlKCcuLi9sYXp5TG9hZCcpXG5cbmZ1bmN0aW9uIE1hcnF1ZWUgKGRhdGEpIHtcbiAgdGhpcy5pbnRlcnZhbCA9IE51bWJlcihkYXRhLmF0dHIuaW50ZXJ2YWwpIHx8IDUgKiAxMDAwXG4gIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uID0gTnVtYmVyKGRhdGEuYXR0ci50cmFuc2l0aW9uRHVyYXRpb24pIHx8IDUwMFxuICB0aGlzLmRlbGF5ID0gTnVtYmVyKGRhdGEuYXR0ci5kZWxheSkgfHwgMFxuICBDb21wb25lbnQuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG5NYXJxdWVlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50LnByb3RvdHlwZSlcblxuTWFycXVlZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIG5vZGUuY2xhc3NMaXN0LmFkZCgnd2VleC1jb250YWluZXInKVxuICBub2RlLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgLy8gZml4IHBhZ2Ugc2hha2luZyBkdXJpbmcgc2xpZGVyJ3MgcGxheWluZ1xuICBub2RlLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzRCgwLDAsMCknXG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0VHJhbnNpdGlvbkVuZCcsIHRoaXMuZW5kLmJpbmQodGhpcyksIGZhbHNlKVxuICByZXR1cm4gbm9kZVxufVxuXG5NYXJxdWVlLnByb3RvdHlwZS5jcmVhdGVDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gZmlyc3QgcnVuOlxuICAvLyAtIGNyZWF0ZSBlYWNoIGNoaWxkXG4gIC8vIC0gYXBwZW5kIHRvIHBhcmVudE5vZGVcbiAgLy8gLSBmaW5kIGN1cnJlbnQgYW5kIG5leHRcbiAgLy8gLSBzZXQgY3VycmVudCBhbmQgbmV4dCBzaG93biBhbmQgb3RoZXJzIGhpZGRlblxuICB2YXIgY2hpbGRyZW4gPSB0aGlzLmRhdGEuY2hpbGRyZW5cbiAgdmFyIHBhcmVudFJlZiA9IHRoaXMuZGF0YS5yZWZcbiAgdmFyIGluc3RhbmNlSWQgPSB0aGlzLmRhdGEuaW5zdGFuY2VJZFxuICB2YXIgaXRlbXMgPSBbXVxuICB2YXIgY29tcG9uZW50TWFuYWdlciA9IHRoaXMuZ2V0Q29tcG9uZW50TWFuYWdlcigpXG5cbiAgdmFyIGZyYWdtZW50LCBpc0ZsZXgsIGNoaWxkLCBub2RlLCBpXG5cbiAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgaXNGbGV4ID0gZmFsc2VcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkcmVuW2ldLnNjYWxlID0gdGhpcy5kYXRhLnNjYWxlXG4gICAgICBjaGlsZHJlbltpXS5pbnN0YW5jZUlkID0gaW5zdGFuY2VJZFxuICAgICAgY2hpbGQgPSBjb21wb25lbnRNYW5hZ2VyLmNyZWF0ZUVsZW1lbnQoY2hpbGRyZW5baV0pXG4gICAgICBjaGlsZC5wYXJlbnRSZWYgPSBwYXJlbnRSZWZcbiAgICAgIHRoaXMuaW5pdENoaWxkKGNoaWxkKVxuICAgICAgLy8gYXBwZW5kIGFuZCBwdXNoXG4gICAgICBpdGVtcy5wdXNoKGNoaWxkKVxuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQubm9kZSlcbiAgICAgIGlmICghaXNGbGV4ICYmIGNoaWxkLmRhdGEuc3R5bGUuaGFzT3duUHJvcGVydHkoJ2ZsZXgnKSkge1xuICAgICAgICBpc0ZsZXggPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChmcmFnbWVudClcbiAgfVxuXG4gIC8vIHNldCBpdGVtc1xuICB0aGlzLml0ZW1zID0gaXRlbXNcblxuICAvLyByZXNldCB0aGUgY2xvY2sgZm9yIGZpcnN0IHRyYW5zaXRpb25cbiAgdGhpcy5yZXNldCgpXG59XG5cbk1hcnF1ZWUucHJvdG90eXBlLmluaXRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICB2YXIgbm9kZSA9IGNoaWxkLm5vZGVcbiAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgbm9kZS5zdHlsZS50b3AgPSAnMCdcbiAgbm9kZS5zdHlsZS5sZWZ0ID0gJzAnXG59XG5cbk1hcnF1ZWUucHJvdG90eXBlLmFwcGVuZENoaWxkID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgLy8gZG9tICsgaXRlbXNcbiAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSBDb21wb25lbnRNYW5hZ2VyLmdldEluc3RhbmNlKHRoaXMuZGF0YS5pbnN0YW5jZUlkKVxuICB2YXIgY2hpbGQgPSBjb21wb25lbnRNYW5hZ2VyLmNyZWF0ZUVsZW1lbnQoZGF0YSlcbiAgdGhpcy5pbml0Q2hpbGQoY2hpbGQpXG4gIHRoaXMubm9kZS5hcHBlbmRDaGlsZChjaGlsZC5ub2RlKVxuICB0aGlzLml0ZW1zLnB1c2goY2hpbGQpXG4gIHRoaXMucmVzZXQoKVxuICByZXR1cm4gY2hpbGQgLy8gQHRvZG8gcmVkZXNpZ24gQ29tcG9uZW50I2FwcGVuZENoaWxkKGNvbXBvbmVudClcbn1cblxuTWFycXVlZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKGNoaWxkLCBiZWZvcmUpIHtcbiAgLy8gZG9tICsgaXRlbXNcbiAgdmFyIGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGJlZm9yZSlcbiAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkKVxuICB0aGlzLmluaXRDaGlsZChjaGlsZClcbiAgdGhpcy5ub2RlLmluc2VydEJlZm9yZShjaGlsZC5ub2RlLCBiZWZvcmUubm9kZSlcbiAgdGhpcy5yZXNldCgpXG59XG5cbk1hcnF1ZWUucHJvdG90eXBlLnJlbW92ZUNoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIC8vIGRvbSArIGl0ZW1zXG4gIHZhciBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihjaGlsZClcbiAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpXG4gIHRoaXMubm9kZS5yZW1vdmVDaGlsZChjaGlsZC5ub2RlKVxuICB0aGlzLnJlc2V0KClcbn1cblxuLyoqXG4gKiBzdGF0dXM6IHtcbiAqICAgY3VycmVudDoge3RyYW5zbGF0ZVk6IDAsIHNob3duOiB0cnVlfSxcbiAqICAgbmV4dDoge3RyYW5zbGF0ZVk6IGhlaWdodCwgc2hvd246IHRydWV9LFxuICogICBvdGhlcnNbXToge3Nob3duOiBmYWxzZX1cbiAqICAgaW5kZXg6IGluZGV4XG4gKiB9XG4gKi9cbk1hcnF1ZWUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaW50ZXJ2YWwgPSB0aGlzLmludGVydmFsIC0gMFxuICB2YXIgZGVsYXkgPSB0aGlzLmRlbGF5IC0gMFxuICB2YXIgaXRlbXMgPSB0aGlzLml0ZW1zXG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIHZhciBsb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYubmV4dCgpXG4gICAgc2VsZi50aW1lcklkID0gc2V0VGltZW91dChsb29wLCBzZWxmLmludGVydmFsKVxuICB9XG5cbiAgLy8gcmVzZXQgZGlzcGxheSBhbmQgdHJhbnNmb3JtXG4gIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgdmFyIG5vZGUgPSBpdGVtLm5vZGVcbiAgICAvLyBzZXQgbm9uLWN1cnJlbnQoMCl8bmV4dCgxKSBpdGVtIGhpZGRlblxuICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9IGluZGV4ID4gMSA/ICdub25lJyA6ICcnXG4gICAgLy8gc2V0IG5leHQoMSkgaXRlbSB0cmFuc2xhdGVZXG4gICAgLy8gVE9ETzogaXQgc3VwcG9zZWQgdG8gdXNlIGl0ZW0uZGF0YS5zdHlsZVxuICAgIC8vIGJ1dCBzb21laG93IHRoZSBzdHlsZSBvYmplY3QgaXMgZW1wdHkuXG4gICAgLy8gVGhpcyBwcm9ibGVtIHJlbGllcyBvbiBqc2ZyYW1ld29yaydzIGJ1Z2ZpeC5cblxuICAgIC8vIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gaW5kZXggPT09IDFcbiAgICAvLyAgICAgPyAndHJhbnNsYXRlM0QoMCwnICsgY29uZmlnLnNjYWxlICogaXRlbS5kYXRhLnN0eWxlLmhlaWdodCArICdweCwwKSdcbiAgICAvLyAgICAgOiAnJ1xuICAgIC8vIG5vZGUuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gaW5kZXggPT09IDFcbiAgICAvLyAgICAgPyAndHJhbnNsYXRlM0QoMCwnICsgY29uZmlnLnNjYWxlICogaXRlbS5kYXRhLnN0eWxlLmhlaWdodCArICdweCwwKSdcbiAgICAvLyAgICAgOiAnJ1xuICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gaW5kZXggPT09IDFcbiAgICAgICAgPyAndHJhbnNsYXRlM0QoMCwnICsgc2VsZi5kYXRhLnNjYWxlICogc2VsZi5kYXRhLnN0eWxlLmhlaWdodCArICdweCwwKSdcbiAgICAgICAgOiAnJ1xuICAgIG5vZGUuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gaW5kZXggPT09IDFcbiAgICAgICAgPyAndHJhbnNsYXRlM0QoMCwnICsgc2VsZi5kYXRhLnNjYWxlICogc2VsZi5kYXRhLnN0eWxlLmhlaWdodCArICdweCwwKSdcbiAgICAgICAgOiAnJ1xuICB9KVxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIC8vIHJlc2V0IGN1cnJlbnQsIG5leHQsIGluZGV4XG4gICAgc2VsZi5jdXJyZW50SXRlbSA9IGl0ZW1zWzBdXG4gICAgc2VsZi5uZXh0SXRlbSA9IGl0ZW1zWzFdXG4gICAgc2VsZi5jdXJyZW50SW5kZXggPSAwXG5cbiAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgdmFyIG5vZGUgPSBpdGVtLm5vZGVcbiAgICAgIC8vIHNldCB0cmFuc2l0aW9uXG4gICAgICBub2RlLnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtICdcbiAgICAgICAgICArIHNlbGYudHJhbnNpdGlvbkR1cmF0aW9uXG4gICAgICAgICAgKyAnbXMgZWFzZSdcbiAgICAgIG5vZGUuc3R5bGUud2Via2l0VHJhbnNpdGlvbiA9ICctd2Via2l0LXRyYW5zZm9ybSAnXG4gICAgICAgICAgKyBzZWxmLnRyYW5zaXRpb25EdXJhdGlvblxuICAgICAgICAgICsgJ21zIGVhc2UnXG4gICAgfSlcblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVySWQpXG5cbiAgICBpZiAoaXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgc2VsZi50aW1lcklkID0gc2V0VGltZW91dChsb29wLCBkZWxheSArIGludGVydmFsKVxuICAgIH1cbiAgfSwgMTMpXG5cbn1cblxuLyoqXG4gKiBuZXh0OlxuICogLSBjdXJyZW50OiB7dHJhbnNsYXRlWTogLWhlaWdodH1cbiAqIC0gbmV4dDoge3RyYW5zbGF0ZVk6IDB9XG4gKi9cbk1hcnF1ZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIC0gdXBkYXRlIHN0YXRlXG4gIC8vICAgLSBzZXQgY3VycmVudCBhbmQgbmV4dCB0cmFuc2l0aW9uXG4gIC8vICAgLSBoaWRlIGN1cnJlbnQgd2hlbiB0cmFuc2l0aW9uIGVuZFxuICAvLyAgIC0gc2V0IG5leHQgdG8gY3VycmVudFxuICAvLyAgIC0gZmluZCBuZXcgbmV4dFxuICB2YXIgbmV4dCA9IHRoaXMubmV4dEl0ZW0ubm9kZVxuICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudEl0ZW0ubm9kZVxuICB0aGlzLnRyYW5zaXRpb25JbmRleCA9IHRoaXMuY3VycmVudEluZGV4XG5cbiAgLy8gVXNlIHNldFRpbWVvdXQgdG8gZml4IHRoZSBwcm9ibGVtIHRoYXQgd2hlbiB0aGVcbiAgLy8gcGFnZSByZWNvdmVyIGZyb20gYmFja3N0YWdlLCB0aGUgc2xpZGVyIHdpbGxcbiAgLy8gbm90IHdvcmsgYW55IGxvbmdlci5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgbmV4dC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM0QoMCwwLDApJ1xuICAgIG5leHQuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNEKDAsMCwwKSdcbiAgICBjdXJyZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzRCgwLC0nXG4gICAgICAgICsgdGhpcy5kYXRhLnNjYWxlICogdGhpcy5kYXRhLnN0eWxlLmhlaWdodFxuICAgICAgICArICdweCwwKSdcbiAgICBjdXJyZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzRCgwLC0nXG4gICAgICAgICsgdGhpcy5kYXRhLnNjYWxlICogdGhpcy5kYXRhLnN0eWxlLmhlaWdodFxuICAgICAgICArICdweCwwKSdcbiAgICB0aGlzLmZpcmVFdmVudCgnY2hhbmdlJylcbiAgfS5iaW5kKHRoaXMpLCAzMDApXG59XG5cbk1hcnF1ZWUucHJvdG90eXBlLmZpcmVFdmVudCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLml0ZW1zLmxlbmd0aFxuICB2YXIgbmV4dEluZGV4ID0gKHRoaXMuY3VycmVudEluZGV4ICsgMSkgJSBsZW5ndGhcbiAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJylcbiAgZXZ0LmluaXRFdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UpXG4gIGV2dC5kYXRhID0ge1xuICAgIHByZXZJbmRleDogdGhpcy5jdXJyZW50SW5kZXgsXG4gICAgaW5kZXg6IG5leHRJbmRleFxuICB9XG4gIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KGV2dClcbn1cblxuLyoqXG4gKiBlbmQ6XG4gKiAtIG9sZCBjdXJyZW50OiB7c2hvd246IGZhbHNlfVxuICogLSBvbGQgY3VycmVudDoge3RyYW5zbGF0ZVk6IDB9XG4gKiAtIGluZGV4KysgJSBsZW5ndGhcbiAqIC0gbmV3IGN1cnJlbnQgPSBvbGQgbmV4dFxuICogLSBuZXcgbmV4dCA9IGl0ZW1zW2luZGV4KzEgJSBsZW5ndGhdXG4gKiAtIG5ldyBuZXh0OiB7dHJhbnNsYXRlWTogaGVpZ2h0fVxuICogLSBuZXcgbmV4dDoge3Nob3duOiB0cnVlfVxuICovXG5NYXJxdWVlLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoZSkge1xuICB2YXIgdGFyZ2V0ID0gZS50YXJnZXRcbiAgdmFyIGl0ZW1zID0gdGhpcy5pdGVtc1xuICB2YXIgbGVuZ3RoID0gaXRlbXMubGVuZ3RoXG4gIHZhciBjdXJyZW50LCBuZXh0XG4gIHZhciBjdXJyZW50SW5kZXgsIG5leHRJbmRleFxuXG4gIGN1cnJlbnRJbmRleCA9IHRoaXMudHJhbnNpdGlvbkluZGV4XG5cbiAgaWYgKGlzTmFOKGN1cnJlbnRJbmRleCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICBkZWxldGUgdGhpcy50cmFuc2l0aW9uSW5kZXhcblxuICBjdXJyZW50ID0gdGhpcy5jdXJyZW50SXRlbS5ub2RlXG4gIGN1cnJlbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICBjdXJyZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICcnXG5cbiAgY3VycmVudEluZGV4ID0gKGN1cnJlbnRJbmRleCArIDEpICUgbGVuZ3RoXG4gIG5leHRJbmRleCA9IChjdXJyZW50SW5kZXggKyAxKSAlIGxlbmd0aFxuXG4gIHRoaXMuY3VycmVudEluZGV4ID0gY3VycmVudEluZGV4XG4gIHRoaXMuY3VycmVudEl0ZW0gPSB0aGlzLm5leHRJdGVtXG4gIHRoaXMubmV4dEl0ZW0gPSBpdGVtc1tuZXh0SW5kZXhdXG5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgbmV4dCA9IHRoaXMubmV4dEl0ZW0ubm9kZVxuICAgIC8vIFRPRE86IGl0IHN1cHBvc2VkIHRvIHVzZSB0aGlzLm5leHRJdGVtLmRhdGEuc3R5bGVcbiAgICAvLyBidXQgc29tZWhvdyB0aGUgc3R5bGUgb2JqZWN0IGlzIGVtcHR5LlxuICAgIC8vIFRoaXMgcHJvYmxlbSByZWxpZXMgb24ganNmcmFtZXdvcmsncyBidWdmaXguXG5cbiAgICBuZXh0LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzRCgwLCdcbiAgICAgICAgKyB0aGlzLmRhdGEuc2NhbGUgKiB0aGlzLmRhdGEuc3R5bGUuaGVpZ2h0XG4gICAgICAgICsgJ3B4LDApJ1xuICAgIG5leHQuc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgTGF6eUxvYWQubG9hZElmTmVlZGVkKG5leHQpXG4gIH0uYmluZCh0aGlzKSlcbn1cblxuTWFycXVlZS5wcm90b3R5cGUuYXR0ciA9IHtcbiAgaW50ZXJ2YWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuaW50ZXJ2YWwgPSB2YWx1ZVxuICB9LFxuICB0cmFuc2l0aW9uRHVyYXRpb246IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uID0gdmFsdWVcbiAgfSxcbiAgZGVsYXk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuZGVsYXkgPSB2YWx1ZVxuICB9XG59XG5cbk1hcnF1ZWUucHJvdG90eXBlLmNsZWFyQXR0ciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pbnRlcnZhbCA9IDUgKiAxMDAwXG4gIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uID0gNTAwXG4gIHRoaXMuZGVsYXkgPSAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFycXVlZVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL21hcnF1ZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAzOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuLi91dGlscycpLmV4dGVuZFxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxudmFyIENvbXBvbmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9jb21wb25lbnRNYW5hZ2VyJylcbnZhciBMYXp5TG9hZCA9IHJlcXVpcmUoJy4uL2xhenlMb2FkJylcbnJlcXVpcmUoJ2NhcnJvdXNlbCcpXG5yZXF1aXJlKCcuLi9zdHlsZXMvc2xpZGVyLnNjc3MnKVxuXG5mdW5jdGlvbiBTbGlkZXIgKGRhdGEpIHtcbiAgdGhpcy5hdXRvUGxheSA9IHRydWUgIC8vIGFsd2F5cyB0cnVlIGZvciBhdXRvcGxheVxuICB0aGlzLmRpcmVjdGlvbiA9ICdyb3cnIC8vICdjb2x1bW4nIGlzIG5vdCB0ZW1wb3JhcmlseSBzdXBwb3J0ZWQuXG4gIHRoaXMuY2hpbGRyZW4gPSBbXVxuICB0aGlzLmlzUGFnZVNob3cgPSB0cnVlXG4gIHRoaXMuaXNEb21SZW5kZXJpbmcgPSB0cnVlXG5cbiAgLy8gYmluZCBldmVudCAncGFnZXNob3cnIGFuZCAncGFnZWhpZGUnIG9uIHdpbmRvdy5cbiAgdGhpcy5faWRsZVdoZW5QYWdlRGlzYXBwZWFyKClcbiAgLy8gYmluZCBldmVudCAncmVuZGVyQmVnaW4nIGFuZCAncmVuZGVyRW5kJyBvbiB3aW5kb3cuXG4gIHRoaXMuX2lkbGVXaGVuRG9tUmVuZGVyaW5nKClcblxuICBDb21wb25lbnQuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG5TbGlkZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnQucHJvdG90eXBlKVxuXG5TbGlkZXIucHJvdG90eXBlLl9pZGxlV2hlblBhZ2VEaXNhcHBlYXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdGhpcyA9IHRoaXNcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2VzaG93JywgZnVuY3Rpb24gKCkge1xuICAgIF90aGlzLmlzUGFnZVNob3cgPSB0cnVlXG4gICAgX3RoaXMuYXV0b1BsYXkgJiYgIV90aGlzLmlzRG9tUmVuZGVyaW5nICYmIF90aGlzLnBsYXkoKVxuICB9KVxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZWhpZGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMuaXNQYWdlU2hvdyA9IGZhbHNlXG4gICAgX3RoaXMuc3RvcCgpXG4gIH0pXG59XG5cblNsaWRlci5wcm90b3R5cGUuX2lkbGVXaGVuRG9tUmVuZGVyaW5nID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX3RoaXMgPSB0aGlzXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZW5kZXJlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMuaXNEb21SZW5kZXJpbmcgPSBmYWxzZVxuICAgIF90aGlzLmF1dG9QbGF5ICYmIF90aGlzLmlzUGFnZVNob3cgJiYgX3RoaXMucGxheSgpXG4gIH0pXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZW5kZXJiZWdpbicsIGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy5pc0RvbVJlbmRlcmluZyA9IHRydWVcbiAgICBfdGhpcy5zdG9wKClcbiAgfSlcbn1cblxuU2xpZGVyLnByb3RvdHlwZS5hdHRyID0ge1xuICBpbnRlcnZhbDogZnVuY3Rpb24gKHZhbCkge1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBwYXJzZUludCh2YWwpIHx8IDMwMDBcbiAgICBpZiAodGhpcy5jYXJyb3VzZWwpIHtcbiAgICAgIHRoaXMuY2Fycm91c2VsLnBsYXlJbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWxcbiAgICB9XG4gIH0sXG5cbiAgcGxheXN0YXR1czogZnVuY3Rpb24gKHZhbCkge1xuICAgIHRoaXMucGxheXN0YXR1cyA9IHZhbCAmJiB2YWwgIT09ICdmYWxzZScgPyB0cnVlIDogZmFsc2VcbiAgICB0aGlzLmF1dG9QbGF5ID0gdGhpcy5wbGF5c3RhdHVzXG4gICAgaWYgKHRoaXMuY2Fycm91c2VsKSB7XG4gICAgICBpZiAodGhpcy5wbGF5c3RhdHVzKSB7XG4gICAgICAgIHRoaXMucGxheSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvLyBzdXBwb3J0IHBsYXlzdGF0dXMnIGFsaWFzIGF1dG8tcGxheSBmb3IgY29tcGF0aWJpbGl0eVxuICBhdXRvUGxheTogZnVuY3Rpb24gKHZhbCkge1xuICAgIHRoaXMuYXR0ci5wbGF5c3RhdHVzLmNhbGwodGhpcywgdmFsKVxuICB9XG59XG5cblNsaWRlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIG5vZGUuY2xhc3NMaXN0LmFkZCgnc2xpZGVyJylcbiAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgbm9kZS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gIHJldHVybiBub2RlXG59XG5cblNsaWRlci5wcm90b3R5cGUuX2RvUmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX3RoaXMgPSB0aGlzXG4gIF90aGlzLmNyZWF0ZUNoaWxkcmVuKClcbiAgX3RoaXMub25BcHBlbmQoKVxufVxuXG5TbGlkZXIucHJvdG90eXBlLnJlbW92ZUNoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gIHZhciBjaGlsZHJlbiA9IHRoaXMuZGF0YS5jaGlsZHJlblxuICBpZiAoY2hpbGRyZW4pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGQuZGF0YS5yZWYgPT09IGNoaWxkcmVuW2ldLnJlZikge1xuICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSlcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLl9kb1JlbmRlcigpXG59XG5cblNsaWRlci5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKGNoaWxkLCBiZWZvcmUpIHtcbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5kYXRhLmNoaWxkcmVuXG4gIC8vIHZhciBjaGlsZEluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGJlZm9yZS5kYXRhKVxuICB2YXIgY2hpbGRJbmRleCA9IC0xXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGNoaWxkcmVuW2ldLnJlZiA9PT0gYmVmb3JlLmRhdGEucmVmKSB7XG4gICAgICBjaGlsZEluZGV4ID0gaVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgY2hpbGRyZW4uc3BsaWNlKGNoaWxkSW5kZXgsIDAsIGNoaWxkLmRhdGEpXG5cbiAgdGhpcy5fZG9SZW5kZXIoKVxuICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXVxuICB9XG59XG5cblNsaWRlci5wcm90b3R5cGUuYXBwZW5kQ2hpbGQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICB2YXIgY2hpbGRyZW4gPSB0aGlzLmRhdGEuY2hpbGRyZW4gfHwgKHRoaXMuZGF0YS5jaGlsZHJlbiA9IFtdKVxuICBjaGlsZHJlbi5wdXNoKGRhdGEpXG4gIHRoaXMuX2RvUmVuZGVyKClcbiAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV1cbiAgfVxufVxuXG5TbGlkZXIucHJvdG90eXBlLmNyZWF0ZUNoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcblxuICAvLyByZWNyZWF0ZSBzbGlkZXIgY29udGFpbmVyLlxuICBpZiAodGhpcy5zbGlkZXJDb250YWluZXIpIHtcbiAgICB0aGlzLm5vZGUucmVtb3ZlQ2hpbGQodGhpcy5zbGlkZXJDb250YWluZXIpXG4gIH1cbiAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XG4gICAgdGhpcy5pbmRpY2F0b3Iubm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuaW5kaWNhdG9yLm5vZGUpXG4gIH1cbiAgdGhpcy5jaGlsZHJlbiA9IFtdXG5cbiAgdmFyIHNsaWRlckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJylcbiAgc2xpZGVyQ29udGFpbmVyLnN0eWxlLmxpc3RTdHlsZSA9ICdub25lJ1xuICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQoc2xpZGVyQ29udGFpbmVyKVxuICB0aGlzLnNsaWRlckNvbnRhaW5lciA9IHNsaWRlckNvbnRhaW5lclxuXG4gIHZhciBjaGlsZHJlbiA9IHRoaXMuZGF0YS5jaGlsZHJlblxuICB2YXIgc2NhbGUgPSB0aGlzLmRhdGEuc2NhbGVcbiAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gIHZhciBpbmRpY2F0b3JEYXRhLCB3aWR0aCwgaGVpZ2h0XG4gIHZhciBjaGlsZFdpZHRoID0gMFxuICB2YXIgY2hpbGRIZWlnaHQgPSAwXG5cbiAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZFxuICAgICAgY2hpbGRyZW5baV0uc2NhbGUgPSB0aGlzLmRhdGEuc2NhbGVcbiAgICAgIGNoaWxkcmVuW2ldLmluc3RhbmNlSWQgPSB0aGlzLmRhdGEuaW5zdGFuY2VJZFxuICAgICAgaWYgKGNoaWxkcmVuW2ldLnR5cGUgPT09ICdpbmRpY2F0b3InKSB7XG4gICAgICAgIGluZGljYXRvckRhdGEgPSBleHRlbmQoY2hpbGRyZW5baV0sIHtcbiAgICAgICAgICBleHRyYToge1xuICAgICAgICAgICAgYW1vdW50OiBjaGlsZHJlbi5sZW5ndGggLSAxLFxuICAgICAgICAgICAgaW5kZXg6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZCA9IGNvbXBvbmVudE1hbmFnZXIuY3JlYXRlRWxlbWVudChjaGlsZHJlbltpXSwgJ2xpJylcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKVxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjaGlsZC5ub2RlKVxuICAgICAgICB3aWR0aCA9IGNoaWxkLmRhdGEuc3R5bGUud2lkdGggfHwgMFxuICAgICAgICBoZWlnaHQgPSBjaGlsZC5kYXRhLnN0eWxlLmhlaWdodCB8fCAwXG4gICAgICAgIHdpZHRoID4gY2hpbGRXaWR0aCAmJiAoY2hpbGRXaWR0aCA9IHdpZHRoKVxuICAgICAgICBoZWlnaHQgPiBjaGlsZEhlaWdodCAmJiAoY2hpbGRIZWlnaHQgPSBoZWlnaHQpXG4gICAgICAgIGNoaWxkLnBhcmVudFJlZiA9IHRoaXMuZGF0YS5yZWZcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gYXBwZW5kIGluZGljYXRvclxuICAgIGlmIChpbmRpY2F0b3JEYXRhKSB7XG4gICAgICBpbmRpY2F0b3JEYXRhLmV4dHJhLndpZHRoID0gdGhpcy5kYXRhLnN0eWxlLndpZHRoIHx8IGNoaWxkV2lkdGhcbiAgICAgIGluZGljYXRvckRhdGEuZXh0cmEuaGVpZ2h0ID0gdGhpcy5kYXRhLnN0eWxlLmhlaWdodCB8fCBjaGlsZEhlaWdodFxuICAgICAgdGhpcy5pbmRpY2F0b3IgPSBjb21wb25lbnRNYW5hZ2VyLmNyZWF0ZUVsZW1lbnQoaW5kaWNhdG9yRGF0YSlcbiAgICAgIHRoaXMuaW5kaWNhdG9yLnBhcmVudFJlZiA9IHRoaXMuZGF0YS5yZWZcbiAgICAgIHRoaXMuaW5kaWNhdG9yLnNsaWRlciA9IHRoaXNcbiAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZCh0aGlzLmluZGljYXRvci5ub2RlKVxuICAgIH1cblxuICAgIHNsaWRlckNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBzY2FsZSAqIHRoaXMuZGF0YS5zdHlsZS5oZWlnaHQgKyAncHgnXG4gICAgc2xpZGVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWdtZW50KVxuICB9XG59XG5cblNsaWRlci5wcm90b3R5cGUub25BcHBlbmQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmNhcnJvdXNlbCkge1xuICAgIHRoaXMuY2Fycm91c2VsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuX2dldFNsaWRlckNoYW5nZUhhbmRsZXIoKSlcbiAgICB0aGlzLmNhcnJvdXNlbC5zdG9wKClcbiAgICB0aGlzLmNhcnJvdXNlbCA9IG51bGxcbiAgfVxuICB0aGlzLmNhcnJvdXNlbCA9IG5ldyBsaWIuY2Fycm91c2VsKHRoaXMuc2xpZGVyQ29udGFpbmVyLCB7XG4gICAgYXV0b3BsYXk6IHRoaXMuYXV0b1BsYXksXG4gICAgdXNlR2VzdHVyZTogdHJ1ZVxuICB9KVxuXG4gIHRoaXMuY2Fycm91c2VsLnBsYXlJbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWxcbiAgdGhpcy5jYXJyb3VzZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5fZ2V0U2xpZGVyQ2hhbmdlSGFuZGxlcigpKVxuICB0aGlzLmN1cnJlbnRJbmRleCA9IDBcblxuICAvLyBwcmVsb2FkIGFsbCBpbWFnZXMgZm9yIHNsaWRlclxuICAvLyBiZWNhdXNlOlxuICAvLyAxLiBsaWItaW1nIGRvZXNuJ3QgbGlzdGVuIHRvIGV2ZW50IHRyYW5zaXRpb25lbmRcbiAgLy8gMi4gZXZlbiBpZiB3ZSBmaXJlIGxhenkgbG9hZCBpbiBzbGlkZXIncyBjaGFuZ2UgZXZlbnQgaGFuZGxlcixcbiAgLy8gICAgdGhlIG5leHQgaW1hZ2Ugc3RpbGwgd29uJ3QgYmUgcHJlbG9hZGVkIHV0aWxsIHRoZSBtb21lbnQgaXRcbiAgLy8gICAgc2xpZGVzIGludG8gdGhlIHZpZXcsIHdoaWNoIGlzIHRvbyBsYXRlLlxuICBpZiAodGhpcy5wcmVsb2FkSW1nc1RpbWVyKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucHJlbG9hZEltZ3NUaW1lcilcbiAgfVxuICAvLyBUaGUgdGltZSBqdXN0IGJlZm9yZSB0aGUgc2Vjb25kIHNsaWRlIGFwcGVhciBhbmQgZW5vdWdoXG4gIC8vIGZvciBhbGwgY2hpbGQgZWxlbWVudHMgdG8gYXBwZW5kIGlzIG9rLlxuICB2YXIgcHJlbG9hZFRpbWUgPSAwLjhcbiAgdGhpcy5wcmVsb2FkSW1nc1RpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGltZ3MgPSB0aGlzLmNhcnJvdXNlbC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBpbWdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGltZyA9IGltZ3NbaV1cbiAgICAgIHZhciBpTGF6eVNyYyA9IGltZy5nZXRBdHRyaWJ1dGUoJ2ktbGF6eS1zcmMnKVxuICAgICAgdmFyIGltZ1NyYyA9IGltZy5nZXRBdHRyaWJ1dGUoJ2ltZy1zcmMnKVxuICAgICAgaWYgKGlMYXp5U3JjKSB7XG4gICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIGlMYXp5U3JjKVxuICAgICAgfSBlbHNlIGlmIChpbWdTcmMpIHtcbiAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgaW1nU3JjKVxuICAgICAgfVxuICAgICAgaW1nLnJlbW92ZUF0dHJpYnV0ZSgnaS1sYXp5LXNyYycpXG4gICAgICBpbWcucmVtb3ZlQXR0cmlidXRlKCdpbWctc3JjJylcbiAgICB9XG4gIH0uYmluZCh0aGlzKSwgcHJlbG9hZFRpbWUgKiAxMDAwKVxuXG4gIC8vIGF2b2lkIHBhZ2Ugc2Nyb2xsIHdoZW4gcGFubmluZ1xuICB2YXIgcGFubmluZyA9IGZhbHNlXG4gIHRoaXMuY2Fycm91c2VsLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFuc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmICghZS5pc1ZlcnRpY2FsKSB7XG4gICAgICBwYW5uaW5nID0gdHJ1ZVxuICAgIH1cbiAgfSlcbiAgdGhpcy5jYXJyb3VzZWwuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwYW5lbmQnLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmICghZS5pc1ZlcnRpY2FsKSB7XG4gICAgICBwYW5uaW5nID0gZmFsc2VcbiAgICB9XG4gIH0pXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAocGFubmluZykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfS5iaW5kKHRoaXMpKVxuXG59XG5cblNsaWRlci5wcm90b3R5cGUuX3VwZGF0ZUluZGljYXRvcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuaW5kaWNhdG9yICYmIHRoaXMuaW5kaWNhdG9yLnNldEluZGV4KHRoaXMuY3VycmVudEluZGV4KVxufVxuXG5TbGlkZXIucHJvdG90eXBlLl9nZXRTbGlkZXJDaGFuZ2VIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgaWYgKCF0aGlzLnNsaWRlckNoYW5nZUhhbmRsZXIpIHtcbiAgICB0aGlzLnNsaWRlckNoYW5nZUhhbmRsZXIgPSAoZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBpbmRleCA9IHRoaXMuY2Fycm91c2VsLml0ZW1zLmluZGV4XG4gICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IGluZGV4XG5cbiAgICAgIC8vIHVwZGF0ZUluZGljYXRvcnNcbiAgICAgIHRoaXMuX3VwZGF0ZUluZGljYXRvcnMoKVxuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ2NoYW5nZScsIHsgaW5kZXg6IGluZGV4IH0pXG4gICAgfSkuYmluZCh0aGlzKVxuICB9XG4gIHJldHVybiB0aGlzLnNsaWRlckNoYW5nZUhhbmRsZXJcbn1cblxuU2xpZGVyLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNhcnJvdXNlbC5wbGF5KClcbn1cblxuU2xpZGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNhcnJvdXNlbC5zdG9wKClcbn1cblxuU2xpZGVyLnByb3RvdHlwZS5zbGlkZVRvID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gIHZhciBvZmZzZXQgPSBpbmRleCAtIHRoaXMuY3VycmVudEluZGV4XG4gIHRoaXMuY2Fycm91c2VsLml0ZW1zLnNsaWRlKG9mZnNldClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTbGlkZXJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9zbGlkZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA0MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSAmJiAod2luZG93ID0ge2N0cmw6IHt9LCBsaWI6IHt9fSk7IXdpbmRvdy5jdHJsICYmICh3aW5kb3cuY3RybCA9IHt9KTshd2luZG93LmxpYiAmJiAod2luZG93LmxpYiA9IHt9KTtyZXF1aXJlKCdhbmltYXRpb25qcycpO3JlcXVpcmUoJ2N1YmljYmV6aWVyJyk7cmVxdWlyZSgnZ2VzdHVyZWpzJyk7IWZ1bmN0aW9uKCl7dmFyIGE9XCJbZGF0YS1jdHJsLW5hbWU9Y2Fycm91c2VsXXtwb3NpdGlvbjpyZWxhdGl2ZTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVaKDFweCk7LW1zLXRyYW5zZm9ybTp0cmFuc2xhdGVaKDFweCk7dHJhbnNmb3JtOnRyYW5zbGF0ZVooMXB4KX1cIixiPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtpZihkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoYiksYi5zdHlsZVNoZWV0KWIuc3R5bGVTaGVldC5kaXNhYmxlZHx8KGIuc3R5bGVTaGVldC5jc3NUZXh0PWEpO2Vsc2UgdHJ5e2IuaW5uZXJIVE1MPWF9Y2F0Y2goYyl7Yi5pbm5lclRleHQ9YX19KCk7IWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGEpe3ZhciBiLGM9e3g6MCx5OjB9LGQ9Z2V0Q29tcHV0ZWRTdHlsZShhKVtsK1wiVHJhbnNmb3JtXCJdO3JldHVyblwibm9uZVwiIT09ZCYmKGI9ZC5tYXRjaCgvXm1hdHJpeDNkXFwoKD86Wy1cXGQuXSssXFxzKil7MTJ9KFstXFxkLl0rKSxcXHMqKFstXFxkLl0rKSg/OixcXHMqWy1cXGQuXSspezJ9XFwpLyl8fGQubWF0Y2goL15tYXRyaXhcXCgoPzpbLVxcZC5dKyxcXHMqKXs0fShbLVxcZC5dKyksXFxzKihbLVxcZC5dKylcXCkkLykpJiYoYy54PXBhcnNlRmxvYXQoYlsxXSl8fDAsYy55PXBhcnNlRmxvYXQoYlsyXSl8fDApLGN9ZnVuY3Rpb24gZShhLGIpe3JldHVybiBhPXBhcnNlRmxvYXQoYSksYj1wYXJzZUZsb2F0KGIpLDAhPWEmJihhKz1cInB4XCIpLDAhPWImJihiKz1cInB4XCIpLG4/XCJ0cmFuc2xhdGUzZChcIithK1wiLCBcIitiK1wiLCAwKVwiOlwidHJhbnNsYXRlKFwiK2ErXCIsIFwiK2IrXCIpXCJ9ZnVuY3Rpb24gZihhKXtyZXR1cm4gby5jYWxsKGEpfWZ1bmN0aW9uIGcoYSxjKXtmdW5jdGlvbiBnKGEsYil7dmFyIGM9aC5jcmVhdGVFdmVudChcIkhUTUxFdmVudHNcIik7aWYoYy5pbml0RXZlbnQoYSwhMSwhMSksYilmb3IodmFyIGQgaW4gYiljW2RdPWJbZF07bi5kaXNwYXRjaEV2ZW50KGMpfWZ1bmN0aW9uIGkoYSl7Zm9yKDswPmE7KWErPXI7Zm9yKDthPj1yOylhLT1yO3JldHVybiBhfWZ1bmN0aW9uIGooYSl7aWYoMCE9PXIpe3ZhciBiLGMsZD1xLmdldChhKTtyPjEmJihiPXEuZ2V0KGEtMSksYz0yPT09cj9xLmdldENsb25lZChhKzEpOnEuZ2V0KGErMSksZC5zdHlsZS5sZWZ0PS1vK1wicHhcIixiLnN0eWxlLmxlZnQ9LW8tcytcInB4XCIsYy5zdHlsZS5sZWZ0PS1vK3MrXCJweFwiKSx0PWQuaW5kZXgsZyhcImNoYW5nZVwiLHtwcmV2SXRlbTpiLGN1ckl0ZW06ZCxuZXh0SXRlbTpjfSl9fXZhciBrPXRoaXMsbT1EYXRlLm5vdygpK1wiLVwiKyArK3Asbj1kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7MSE9PWFyZ3VtZW50cy5sZW5ndGh8fGFyZ3VtZW50c1swXWluc3RhbmNlb2YgSFRNTEVsZW1lbnR8fChjPWFyZ3VtZW50c1swXSxhPW51bGwpLGF8fChhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKSxuLmFwcGVuZENoaWxkKGEpKSxjPWN8fHt9LGEuc2V0QXR0cmlidXRlKFwiZGF0YS1jdHJsLW5hbWVcIixcImNhcnJvdXNlbFwiKSxhLnNldEF0dHJpYnV0ZShcImRhdGEtY3RybC1pZFwiLG0pLGEuc3R5bGUucG9zaXRpb249XCJyZWxhdGl2ZVwiLGEuc3R5bGVbbCtcIlRyYW5zZm9ybVwiXT1lKDAsMCk7dmFyIG89MCxxPXt9LHI9MCxzPWMuc3RlcHx8YS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCx0PTA7cS5hZGQ9ZnVuY3Rpb24oYil7dmFyIGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO3JldHVybiBjLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsYy5zdHlsZVtcImZsb2F0XCJdPVwibGVmdFwiLGMuaW5kZXg9cixcInN0cmluZ1wiPT10eXBlb2YgYj9jLmlubmVySFRNTD1iOmIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCYmYy5hcHBlbmRDaGlsZChiKSxhLmFwcGVuZENoaWxkKGMpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShxLHIrXCJcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGN9fSkscisrLGN9LHEuZ2V0PWZ1bmN0aW9uKGEpe3JldHVybiBxW2koYSldfSxxLmdldENsb25lZD1mdW5jdGlvbihiKXtmdW5jdGlvbiBjKGEsYixkKXt2YXIgZT1hLl9saXN0ZW5lcnM7aWYoZSl7Yi5fbGlzdGVuZXJzPWU7Zm9yKHZhciBmIGluIGUpYi5hZGRFdmVudExpc3RlbmVyKGYsZVtmXSl9aWYoZCYmYS5jaGlsZHJlbiYmYS5jaGlsZHJlbi5sZW5ndGgpZm9yKHZhciBnPTAsaD1hLmNoaWxkcmVuLmxlbmd0aDtoPmc7ZysrKWMoYS5jaGlsZHJlbltnXSxiLmNoaWxkcmVuW2ddLGQpfXZhciBiPWkoYiksZD1hLnF1ZXJ5U2VsZWN0b3IoJ1tjbG9uZWQ9XCJjbG9uZWQtJytiKydcIl0nKSxlPXFbYl07cmV0dXJuIGR8fChkPWUuY2xvbmVOb2RlKCEwKSxjKGUsZCwhMCksYS5hcHBlbmRDaGlsZChkKSxkLnNldEF0dHJpYnV0ZShcImNsb25lZFwiLFwiY2xvbmVkLVwiK2IpLGQuaW5kZXg9YiksZH0scS5zbGlkZT1mdW5jdGlvbihjKXtpZigwIT09cil7MT09PXImJihjPTApO3ZhciBmPWQoYSkueCxnPW8rcyotYyxoPWctZjtpZigwIT09aCl7bmV3IGIuYW5pbWF0aW9uKDQwMCxiLmN1YmljYmV6aWVyLmVhc2UsZnVuY3Rpb24oYixjKXthLnN0eWxlW2wrXCJUcmFuc2Zvcm1cIl09ZShmK2gqYywwKX0pLnBsYXkoKS50aGVuKGZ1bmN0aW9uKCl7bz1nLGEuc3R5bGVbbCtcIlRyYW5zZm9ybVwiXT1lKGcsMCksYyYmaih0K2MpfSl9fX0scS5uZXh0PWZ1bmN0aW9uKCl7cS5zbGlkZSgxKX0scS5wcmV2PWZ1bmN0aW9uKCl7cS5zbGlkZSgtMSl9LGYoYS5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIikpLmZvckVhY2goZnVuY3Rpb24oYSl7YS5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCIsYS5zdHlsZS50b3A9XCIwXCIsYS5zdHlsZS5sZWZ0PXIqcytcInB4XCIsYS5zdHlsZVtcImZsb2F0XCJdPVwibGVmdFwiLGEuaW5kZXg9cixPYmplY3QuZGVmaW5lUHJvcGVydHkocSxyK1wiXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBhfX0pLHIrK30pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiaXRlbXNcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHF9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHEsXCJsZW5ndGhcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHJ9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHEsXCJpbmRleFwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkocSxcInN0ZXBcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHN9LHNldDpmdW5jdGlvbihhKXtzPWF9fSk7dmFyIHU9ITEsdj0hMSx3PSExO3RoaXMucGxheT1mdW5jdGlvbigpe3JldHVybiB1P3ZvaWQodnx8KHY9c2V0VGltZW91dChmdW5jdGlvbigpe3c9ITAscS5uZXh0KCksc2V0VGltZW91dChmdW5jdGlvbigpe3c9ITF9LDUwMCksdj1zZXRUaW1lb3V0KGFyZ3VtZW50cy5jYWxsZWUsNDAwK3opfSw0MDAreikpKToodT0hMCxqKDApKX0sdGhpcy5zdG9wPWZ1bmN0aW9uKCl7diYmKGNsZWFyVGltZW91dCh2KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dj0hMX0sNTAwKSl9O3ZhciB4PSExLHk9ITE7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJhdXRvcGxheVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4geH0sc2V0OmZ1bmN0aW9uKGEpe3g9ISFhLHkmJihjbGVhclRpbWVvdXQoeSkseT0hMSkseD95PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtrLnBsYXkoKX0sMmUzKTprLnN0b3AoKX19KSx0aGlzLmF1dG9wbGF5PSEhYy5hdXRvcGxheTt2YXIgej0xNTAwO2lmKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwicGxheUludGVydmFsXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB6fSxzZXQ6ZnVuY3Rpb24oYSl7ej1hfX0pLHRoaXMucGxheUludGVydmFsPSEhYy5wbGF5SW50ZXJ2YWx8fDE1MDAsYy51c2VHZXN0dXJlKXt2YXIgQSxCPSExO2EuYWRkRXZlbnRMaXN0ZW5lcihcInBhbnN0YXJ0XCIsZnVuY3Rpb24oYSl7YS5pc1ZlcnRpY2FsfHxCJiZ3fHwoYS5wcmV2ZW50RGVmYXVsdCgpLGEuc3RvcFByb3BhZ2F0aW9uKCkseCYmay5zdG9wKCksQT0wLEI9ITApfSksYS5hZGRFdmVudExpc3RlbmVyKFwicGFubW92ZVwiLGZ1bmN0aW9uKGIpeyFiLmlzVmVydGljYWwmJkImJihiLnByZXZlbnREZWZhdWx0KCksYi5zdG9wUHJvcGFnYXRpb24oKSxBPWIuZGlzcGxhY2VtZW50WCxhLnN0eWxlW2wrXCJUcmFuc2Zvcm1cIl09ZShvK0EsMCkpfSksYS5hZGRFdmVudExpc3RlbmVyKFwicGFuZW5kXCIsZnVuY3Rpb24oYSl7IWEuaXNWZXJ0aWNhbCYmQiYmKGEucHJldmVudERlZmF1bHQoKSxhLnN0b3BQcm9wYWdhdGlvbigpLEI9ITEsYS5pc2ZsaWNrPzA+QT9xLm5leHQoKTpxLnByZXYoKTpNYXRoLmFicyhBKTxzLzI/cS5zbGlkZSgwKTpxLnNsaWRlKDA+QT8xOi0xKSx4JiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ay5wbGF5KCl9LDJlMykpfSwhMSksYS5hZGRFdmVudExpc3RlbmVyKFwic3dpcGVcIixmdW5jdGlvbihhKXthLmlzVmVydGljYWx8fChhLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSl9KX10aGlzLmFkZEV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24oYSxiKXt0aGlzLnJvb3QuYWRkRXZlbnRMaXN0ZW5lcihhLGIsITEpfSx0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24oYSxiKXt0aGlzLnJvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihhLGIsITEpfSx0aGlzLnJvb3Q9bix0aGlzLmVsZW1lbnQ9YX12YXIgaD1hLmRvY3VtZW50LGk9YS5uYXZpZ2F0b3IudXNlckFnZW50LGo9ISFpLm1hdGNoKC9GaXJlZm94L2kpLGs9ISFpLm1hdGNoKC9JRU1vYmlsZS9pKSxsPWo/XCJNb3pcIjprP1wibXNcIjpcIndlYmtpdFwiLG09az9cIk1TQ1NTTWF0cml4XCI6XCJXZWJLaXRDU1NNYXRyaXhcIixuPSEhanx8bSBpbiBhJiZcIm0xMVwiaW4gbmV3IGFbbV0sbz1BcnJheS5wcm90b3R5cGUuc2xpY2UscD0wO2IuY2Fycm91c2VsPWd9KHdpbmRvdyx3aW5kb3cubGliLHdpbmRvdy5jdHJsfHwod2luZG93LmN0cmw9e30pKTs7bW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cubGliWydjYXJyb3VzZWwnXTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jYXJyb3VzZWwvYnVpbGQvY2Fycm91c2VsLmNvbW1vbi5qc1xuICoqIG1vZHVsZSBpZCA9IDQxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vc2xpZGVyLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi9zbGlkZXIuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vc2xpZGVyLnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvc3R5bGVzL3NsaWRlci5zY3NzXG4gKiogbW9kdWxlIGlkID0gNDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnNsaWRlciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7IH1cXG5cXG4uc2xpZGVyIC5pbmRpY2F0b3ItY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLXdlYmtpdC1mbGV4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XFxuICBib3gtYWxpZ246IGNlbnRlcjtcXG4gIC13ZWJraXQtYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7XFxuICBib3gtcGFjazogY2VudGVyO1xcbiAgLXdlYmtpdC1qdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZm9udC1zaXplOiAwOyB9XFxuICAuc2xpZGVyIC5pbmRpY2F0b3ItY29udGFpbmVyIC5pbmRpY2F0b3Ige1xcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7IH1cXG4gIC5zbGlkZXIgLmluZGljYXRvci1jb250YWluZXIucm93IHtcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiBob3Jpem9udGFsO1xcbiAgICBib3gtb3JpZW50OiBob3Jpem9udGFsO1xcbiAgICAtd2Via2l0LWZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7IH1cXG4gIC5zbGlkZXIgLmluZGljYXRvci1jb250YWluZXIuY29sdW1uIHtcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcXG4gICAgYm94LW9yaWVudDogdmVydGljYWw7XFxuICAgIC13ZWJraXQtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvc3JjL3N0eWxlcy9zbGlkZXIuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLG1CQUFtQixFQUNwQjs7QUFDRDtFQUNFLG1CQUFtQjtFQUNuQixxQkFBcUI7RUFDckIsc0JBQXNCO0VBQ3RCLGNBQWM7RUFDZCwwQkFBMEI7RUFDMUIsa0JBQWtCO0VBQ2xCLDRCQUE0QjtFQUM1QixvQkFBb0I7RUFDcEIseUJBQXlCO0VBQ3pCLGlCQUFpQjtFQUNqQixnQ0FBZ0M7RUFDaEMsd0JBQXdCO0VBQ3hCLGFBQWEsRUFvQmQ7RUFqQ0Q7SUFnQkksbUJBQW1CLEVBQ3BCO0VBakJIO0lBb0JJLCtCQUErQjtJQUMvQix1QkFBdUI7SUFDdkIsNEJBQTRCO0lBQzVCLG9CQUFvQixFQUNyQjtFQXhCSDtJQTJCSSw2QkFBNkI7SUFDN0IscUJBQXFCO0lBQ3JCLCtCQUErQjtJQUMvQix1QkFBdUIsRUFDeEJcIixcImZpbGVcIjpcInNsaWRlci5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5zbGlkZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG4uc2xpZGVyIC5pbmRpY2F0b3ItY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLXdlYmtpdC1mbGV4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XFxuICBib3gtYWxpZ246IGNlbnRlcjtcXG4gIC13ZWJraXQtYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7XFxuICBib3gtcGFjazogY2VudGVyO1xcbiAgLXdlYmtpdC1qdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZm9udC1zaXplOiAwO1xcblxcbiAgLmluZGljYXRvciB7XFxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIH1cXG5cXG4gICYucm93IHtcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiBob3Jpem9udGFsO1xcbiAgICBib3gtb3JpZW50OiBob3Jpem9udGFsO1xcbiAgICAtd2Via2l0LWZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICB9XFxuXFxuICAmLmNvbHVtbiB7XFxuICAgIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XFxuICAgIGJveC1vcmllbnQ6IHZlcnRpY2FsO1xcbiAgICAtd2Via2l0LWZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICB9XFxuXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIndlYnBhY2s6Ly9cIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L3Nhc3MtbG9hZGVyP3NvdXJjZU1hcCEuL3NyYy9zdHlsZXMvc2xpZGVyLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA0M1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuLi91dGlscycpLmV4dGVuZFxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgQXRvbWljID0gcmVxdWlyZSgnLi9hdG9taWMnKVxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcblxucmVxdWlyZSgnLi4vc3R5bGVzL2luZGljYXRvci5zY3NzJylcblxudmFyIERFRkFVTFRfSVRFTV9DT0xPUiA9ICcjOTk5J1xudmFyIERFRkFVTFRfSVRFTV9TRUxFQ1RFRF9DT0xPUiA9ICcjMDAwMGZmJ1xudmFyIERFRkFVTFRfSVRFTV9TSVpFID0gMjBcbnZhciBERUZBVUxUX01BUkdJTl9TSVpFID0gMTBcblxuLy8gU3R5bGUgc3VwcG9ydGVkOlxuLy8gICBwb3NpdGlvbjogKGRlZmF1bHQgLSBhYnNvbHV0ZSlcbi8vICAgaXRlbUNvbG9yOiBjb2xvciBvZiBpbmRpY2F0b3IgZG90c1xuLy8gICBpdGVtU2VsZWN0ZWRDb2xvcjogY29sb3Igb2YgdGhlIHNlbGVjdGVkIGluZGljYXRvciBkb3Rcbi8vICAgaXRlbVNpemU6IHNpemUgb2YgaW5kaWNhdG9yc1xuLy8gICBvdGhlciBsYXlvdXQgc3R5bGVzXG5mdW5jdGlvbiBJbmRpY2F0b3IgKGRhdGEpIHtcbiAgdGhpcy5kaXJlY3Rpb24gPSAncm93JyAvLyAnY29sdW1uJyBpcyBub3QgdGVtcG9yYXJpbHkgc3VwcG9ydGVkLlxuICB0aGlzLmFtb3VudCA9IGRhdGEuZXh0cmEuYW1vdW50XG4gIHRoaXMuaW5kZXggPSBkYXRhLmV4dHJhLmluZGV4XG4gIHRoaXMuc2xpZGVyV2lkdGggPSBkYXRhLmV4dHJhLndpZHRoXG4gIHRoaXMuc2xpZGVySGVpZ2h0ID0gZGF0YS5leHRyYS5oZWlnaHRcbiAgdmFyIHN0eWxlcyA9IGRhdGEuc3R5bGUgfHwge31cbiAgdGhpcy5kYXRhID0gZGF0YVxuICB0aGlzLnN0eWxlLndpZHRoLmNhbGwodGhpcywgc3R5bGVzLndpZHRoKVxuICB0aGlzLnN0eWxlLmhlaWdodC5jYWxsKHRoaXMsIHN0eWxlcy5oZWlnaHQpXG4gIHRoaXMuaXRlbXMgPSBbXVxuICBBdG9taWMuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG5JbmRpY2F0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBdG9taWMucHJvdG90eXBlKVxuXG5JbmRpY2F0b3IucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBub2RlLmNsYXNzTGlzdC5hZGQoJ3dlZXgtaW5kaWNhdG9ycycpXG4gIG5vZGUuY2xhc3NMaXN0LmFkZCgnd2VleC1lbGVtZW50JylcbiAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcbiAgdGhpcy5ub2RlID0gbm9kZVxuICB0aGlzLnN0eWxlLml0ZW1TaXplLmNhbGwodGhpcywgMClcbiAgdGhpcy5pdGVtQ29sb3IgPSBERUZBVUxUX0lURU1fQ09MT1JcbiAgdGhpcy5pdGVtU2VsZWN0ZWRDb2xvciA9IERFRkFVTFRfSVRFTV9TRUxFQ1RFRF9DT0xPUlxuICB0aGlzLnVwZGF0ZVN0eWxlKHtcbiAgICBsZWZ0OiAwLFxuICAgIHRvcDogMCxcbiAgICBpdGVtU2l6ZTogMFxuICB9KVxuICByZXR1cm4gbm9kZVxufVxuXG5JbmRpY2F0b3IucHJvdG90eXBlLmNyZWF0ZUNoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYW1vdW50OyBpKyspIHtcbiAgICB2YXIgaW5kaWNhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBpbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgnd2VleC1pbmRpY2F0b3InKVxuICAgIGluZGljYXRvci5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCdcbiAgICBpbmRpY2F0b3Iuc3R5bGUubWFyZ2luID0gJzAgJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKERFRkFVTFRfTUFSR0lOX1NJWkUgKiB0aGlzLmRhdGEuc2NhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAncHgnXG4gICAgaW5kaWNhdG9yLnN0eWxlLndpZHRoID0gdGhpcy5pdGVtU2l6ZSArICdweCdcbiAgICBpbmRpY2F0b3Iuc3R5bGUuaGVpZ2h0ID0gdGhpcy5pdGVtU2l6ZSArICdweCdcbiAgICBpbmRpY2F0b3Iuc2V0QXR0cmlidXRlKCdpbmRleCcsIGkpXG4gICAgaWYgKHRoaXMuaW5kZXggPT09IGkpIHtcbiAgICAgIGluZGljYXRvci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLml0ZW1TZWxlY3RlZENvbG9yXG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGljYXRvci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLml0ZW1Db2xvclxuICAgIH1cbiAgICBpbmRpY2F0b3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9jbGlja0hhbmRsZXIuYmluZCh0aGlzLCBpKSlcbiAgICB0aGlzLml0ZW1zW2ldID0gaW5kaWNhdG9yXG4gICAgcm9vdC5hcHBlbmRDaGlsZChpbmRpY2F0b3IpXG4gIH1cbiAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKHJvb3QpXG59XG5cbkluZGljYXRvci5wcm90b3R5cGUuc3R5bGVcbiAgICA9IGV4dGVuZChPYmplY3QuY3JlYXRlKEF0b21pYy5wcm90b3R5cGUuc3R5bGUpLCB7XG4gIGl0ZW1Db2xvcjogZnVuY3Rpb24gKHZhbCkge1xuICAgIHRoaXMuaXRlbUNvbG9yID0gdmFsIHx8IERFRkFVTFRfSVRFTV9DT0xPUlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5pdGVtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuaXRlbXNbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5pdGVtQ29sb3JcbiAgICB9XG4gIH0sXG5cbiAgaXRlbVNlbGVjdGVkQ29sb3I6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB0aGlzLml0ZW1TZWxlY3RlZENvbG9yID0gdmFsIHx8IERFRkFVTFRfSVRFTV9TRUxFQ1RFRF9DT0xPUlxuICAgIGlmICh0eXBlb2YgdGhpcy5pbmRleCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgJiYgdGhpcy5pdGVtcy5sZW5ndGggPiB0aGlzLmluZGV4KSB7XG4gICAgICB0aGlzLml0ZW1zW3RoaXMuaW5kZXhdLnN0eWxlLmJhY2tncm91bmRDb2xvclxuICAgICAgICAgID0gdGhpcy5pdGVtU2VsZWN0ZWRDb2xvclxuICAgIH1cbiAgfSxcblxuICBpdGVtU2l6ZTogZnVuY3Rpb24gKHZhbCkge1xuICAgIHZhbCA9IHBhcnNlSW50KHZhbCkgKiB0aGlzLmRhdGEuc2NhbGVcbiAgICAgICAgICB8fCBERUZBVUxUX0lURU1fU0laRSAqIHRoaXMuZGF0YS5zY2FsZVxuICAgIHRoaXMuaXRlbVNpemUgPSB2YWxcbiAgICB0aGlzLm5vZGUuc3R5bGUuaGVpZ2h0ID0gdmFsICsgJ3B4J1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5pdGVtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuaXRlbXNbaV0uc3R5bGUud2lkdGggPSB2YWwgKyAncHgnXG4gICAgICB0aGlzLml0ZW1zW2ldLnN0eWxlLmhlaWdodCA9IHZhbCArICdweCdcbiAgICB9XG4gIH0sXG5cbiAgd2lkdGg6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB2YWwgPSBwYXJzZUludCh2YWwpICogdGhpcy5kYXRhLnNjYWxlIHx8IHBhcnNlSW50KHRoaXMuc2xpZGVyV2lkdGgpXG4gICAgdGhpcy52aXJ0dWFsV3JhcHBlcldpZHRoID0gdmFsXG4gIH0sXG5cbiAgaGVpZ2h0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFsID0gcGFyc2VJbnQodmFsKSAqIHRoaXMuZGF0YS5zY2FsZSB8fCBwYXJzZUludCh0aGlzLnNsaWRlckhlaWdodClcbiAgICB0aGlzLnZpcnR1YWxXcmFwcGVySGVpZ2h0ID0gdmFsXG4gIH0sXG5cbiAgdG9wOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFsID0gdGhpcy52aXJ0dWFsV3JhcHBlckhlaWdodCAvIDIgLSB0aGlzLml0ZW1TaXplIC8gMlxuICAgICAgICArIHZhbCAqIHRoaXMuZGF0YS5zY2FsZVxuICAgIHRoaXMubm9kZS5zdHlsZS5ib3R0b20gPSAnJ1xuICAgIHRoaXMubm9kZS5zdHlsZS50b3AgPSB2YWwgKyAncHgnXG4gIH0sXG5cbiAgYm90dG9tOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFsID0gdGhpcy52aXJ0dWFsV3JhcHBlckhlaWdodCAvIDIgLSB0aGlzLml0ZW1TaXplIC8gMlxuICAgICAgICArIHZhbCAqIHRoaXMuZGF0YS5zY2FsZVxuICAgIHRoaXMubm9kZS5zdHlsZS50b3AgPSAnJ1xuICAgIHRoaXMubm9kZS5zdHlsZS5ib3R0b20gPSB2YWwgKyAncHgnXG4gIH0sXG5cbiAgbGVmdDogZnVuY3Rpb24gKHZhbCkge1xuICAgIHZhbCA9IHRoaXMudmlydHVhbFdyYXBwZXJXaWR0aCAvIDJcbiAgICAgICAgICAtICh0aGlzLml0ZW1TaXplICsgMiAqIERFRkFVTFRfTUFSR0lOX1NJWkUgKiB0aGlzLmRhdGEuc2NhbGUpXG4gICAgICAgICAgICAgICogdGhpcy5hbW91bnQgLyAyXG4gICAgICAgICAgKyB2YWwgKiB0aGlzLmRhdGEuc2NhbGVcbiAgICB0aGlzLm5vZGUuc3R5bGUucmlnaHQgPSAnJ1xuICAgIHRoaXMubm9kZS5zdHlsZS5sZWZ0ID0gdmFsICsgJ3B4J1xuICB9LFxuXG4gIHJpZ2h0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdmFsID0gdGhpcy52aXJ0dWFsV3JhcHBlcldpZHRoIC8gMlxuICAgICAgICAgIC0gKHRoaXMuaXRlbVNpemUgKyAyICogREVGQVVMVF9NQVJHSU5fU0laRSAqIHRoaXMuZGF0YS5zY2FsZSlcbiAgICAgICAgICAgICAgKiB0aGlzLmFtb3VudCAvIDJcbiAgICAgICAgICArIHZhbCAqIHRoaXMuZGF0YS5zY2FsZVxuICAgIHRoaXMubm9kZS5zdHlsZS5sZWZ0ID0gJydcbiAgICB0aGlzLm5vZGUuc3R5bGUucmlnaHQgPSB2YWwgKyAncHgnXG4gIH1cbn0pXG5cbkluZGljYXRvci5wcm90b3R5cGUuc2V0SW5kZXggPSBmdW5jdGlvbiAoaWR4KSB7XG4gIGlmIChpZHggPj0gdGhpcy5hbW91bnQpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcHJldiA9IHRoaXMuaXRlbXNbdGhpcy5pbmRleF1cbiAgdmFyIGN1ciA9IHRoaXMuaXRlbXNbaWR4XVxuICBwcmV2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gIHByZXYuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5pdGVtQ29sb3JcbiAgY3VyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gIGN1ci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLml0ZW1TZWxlY3RlZENvbG9yXG4gIHRoaXMuaW5kZXggPSBpZHhcbn1cblxuSW5kaWNhdG9yLnByb3RvdHlwZS5fY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGlkeCkge1xuICB0aGlzLnNsaWRlci5zbGlkZVRvKGlkeClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbmRpY2F0b3JcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9pbmRpY2F0b3IuanNcbiAqKiBtb2R1bGUgaWQgPSA0NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL2luZGljYXRvci5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vaW5kaWNhdG9yLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL2luZGljYXRvci5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3N0eWxlcy9pbmRpY2F0b3Iuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDQ1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi53ZWV4LWluZGljYXRvcnMge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxcbiAgLndlZXgtaW5kaWNhdG9ycyAud2VleC1pbmRpY2F0b3Ige1xcbiAgICBmbG9hdDogbGVmdDtcXG4gICAgYm9yZGVyLXJhZGl1czogNTAlOyB9XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi8uL3NyYy9zcmMvc3R5bGVzL2luZGljYXRvci5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsbUJBQW1CO0VBQ25CLG9CQUFvQixFQU9yQjtFQVREO0lBS0ksWUFBWTtJQUNaLG1CQUFtQixFQUNwQlwiLFwiZmlsZVwiOlwiaW5kaWNhdG9yLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLndlZXgtaW5kaWNhdG9ycyB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcblxcbiAgLndlZXgtaW5kaWNhdG9yIHtcXG4gICAgZmxvYXQ6IGxlZnQ7XFxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIH1cXG5cXG59XCJdLFwic291cmNlUm9vdFwiOlwid2VicGFjazovL1wifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vc2Fzcy1sb2FkZXI/c291cmNlTWFwIS4vc3JjL3N0eWxlcy9pbmRpY2F0b3Iuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDQ2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIEF0b21pYyA9IHJlcXVpcmUoJy4vYXRvbWljJylcbnZhciBtc2dRdWV1ZSA9IHJlcXVpcmUoJy4uL21lc3NhZ2VRdWV1ZScpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuLy8gVE9ETzogcmVmYWN0b3IgdGhpcyBzY3NzIGNvZGUgc2luY2UgdGhpcyBpcyBzdHJvbmdseVxuLy8gZGVwZW5kZW50IG9uIGxpYi5mbGV4aWJsZSBvdGhlciB0aGFuIHRoZSB2YWx1ZSBvZlxuLy8gc2NhbGUuXG5yZXF1aXJlKCcuLi9zdHlsZXMvdGFiaGVhZGVyLnNjc3MnKVxuXG5mdW5jdGlvbiBUYWJIZWFkZXIoZGF0YSkge1xuICBBdG9taWMuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG52YXIgcHJvdG8gPSBUYWJIZWFkZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBdG9taWMucHJvdG90eXBlKVxuXG5wcm90by5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIG91dHNpZGUgY29udGFpbmVyLlxuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIG5vZGUuY2xhc3NOYW1lID0gJ3RhYi1oZWFkZXInXG4gIC8vIHRpcCBvbiB0aGUgdG9wLlxuICB2YXIgYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYmFyLmNsYXNzTmFtZSA9ICdoZWFkZXItYmFyJ1xuICBiYXIudGV4dENvbnRlbnQgPSAnQ0hBTkdFIEZMT09SJ1xuICAvLyBtaWRkbGUgbGF5ZXIuXG4gIHZhciBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYm9keS5jbGFzc05hbWUgPSAnaGVhZGVyLWJvZHknXG4gIHZhciBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpXG4gIGJveC5jbGFzc05hbWUgPSAndGFiaGVhZGVyJ1xuXG4gIGJvZHkuYXBwZW5kQ2hpbGQoYm94KVxuICBub2RlLmFwcGVuZENoaWxkKGJhcilcbiAgbm9kZS5hcHBlbmRDaGlsZChib2R5KVxuICB0aGlzLl9iYXIgPSBiYXJcbiAgdGhpcy5fYm9keSA9IGJvZHlcbiAgdGhpcy5ib3ggPSBib3hcbiAgdGhpcy5ub2RlID0gbm9kZVxuICAvLyBpbml0IGV2ZW50cy5cbiAgdGhpcy5faW5pdEZvbGRCdG4oKVxuICB0aGlzLl9pbml0RXZlbnQoKVxuICByZXR1cm4gbm9kZVxufVxuXG5wcm90by5faW5pdEZvbGRCdG4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBfdGhpcyA9IHRoaXNcbiAgdmFyIG5vZGUgPSB0aGlzLm5vZGVcbiAgdmFyIGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBidG4uY2xhc3NOYW1lID0gJ2ZvbGQtdG9nZ2xlIGljb25mb250J1xuICBidG4uaW5uZXJIVE1MID0gJyYjeGU2NjE7J1xuICBub2RlLmFwcGVuZENoaWxkKGJ0bilcblxuICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKF90aGlzLnVuZm9sZGluZykge1xuICAgICAgX3RoaXMuX2ZvbGRpbmcoKVxuICAgIH0gZWxzZSB7XG4gICAgICBfdGhpcy5fdW5mb2xkaW5nKClcbiAgICB9XG4gIH0pXG59XG5cbnByb3RvLl9pbml0TWFzayA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1hc2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBtYXNrLmNsYXNzTmFtZSA9ICd0YWJoZWFkZXItbWFzaydcbiAgdGhpcy5tYXNrID0gbWFza1xuICAvLyBzdG9wIGRlZmF1bHQgYmVoYXZpb3I6IHBhZ2UgbW92aW5nLlxuICBtYXNrLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICB9KVxuICAvLyBjbGljayB0byB1bmZvbGQuXG4gIHZhciBfdGhpcyA9IHRoaXNcbiAgbWFzay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy5fZm9sZGluZygpXG4gIH0pXG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtYXNrKVxufVxuXG5wcm90by5fdW5mb2xkaW5nID0gZnVuY3Rpb24gKCkge1xuICAvLyBtYXJrIHRoZSBpbml0aWFsIHBvc2lpdG9uIG9mIHRhYmhlYWRlclxuICBpZiAoIXRoaXMuZmxhZykge1xuICAgIHZhciBmbGFnID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndGFiaGVhZGVyJylcbiAgICB0aGlzLmZsYWcgPSBmbGFnXG4gICAgdGhpcy5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZsYWcsIHRoaXMubm9kZSlcbiAgfVxuICBpZiAoIXRoaXMubWFzaykge1xuICAgIHRoaXMuX2luaXRNYXNrKClcbiAgfVxuXG4gIC8vIHJlY29yZCB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICB0aGlzLl9zY3JvbGxWYWwgPSB0aGlzLl9ib2R5LnNjcm9sbExlZnRcbiAgLy8gcmVjb3JkIHRoZSBwb3NpdGlvbiBpbiBkb2N1bWVudC5cbiAgdGhpcy5fdG9wVmFsID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICB0aGlzLl9zdHlsZVRvcCA9IHRoaXMubm9kZS5zdHlsZS50b3BcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubm9kZSlcbiAgdGhpcy5ub2RlLmNsYXNzTGlzdC5hZGQoJ3VuZm9sZC1oZWFkZXInKVxuICB0aGlzLm5vZGUuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nXG4gIC8vIHJlY2FsYyB0aGUgcG9zaXRpb24gd2hlbiBpdCBpcyB1bmZvbGRlZC5cbiAgdmFyIHRoSGVpZ2h0ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuICBpZiAodGhIZWlnaHQgKyB0aGlzLl90b3BWYWwgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICB0aGlzLl90b3BWYWwgPSB0aGlzLl90b3BWYWxcbiAgICAgICAgKyAod2luZG93LmlubmVySGVpZ2h0IC0gdGhIZWlnaHQgLSB0aGlzLl90b3BWYWwpXG4gIH1cblxuICB0aGlzLm5vZGUuc3R5bGUudG9wID0gdGhpcy5fdG9wVmFsICsgJ3B4J1xuICAvLyBwcm9jZXNzIG1hc2sgc3R5bGVcbiAgdGhpcy5tYXNrLmNsYXNzTGlzdC5hZGQoJ3VuZm9sZC1oZWFkZXInKVxuICB0aGlzLm1hc2suc3R5bGUuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4J1xuICB0aGlzLnVuZm9sZGluZyA9IHRydWVcbn1cblxucHJvdG8uX2ZvbGRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnVuZm9sZGluZyAhPT0gdHJ1ZSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgdGhpcy5tYXNrLmNsYXNzTGlzdC5yZW1vdmUoJ3VuZm9sZC1oZWFkZXInKVxuICB0aGlzLm5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndW5mb2xkLWhlYWRlcicpXG5cbiAgdGhpcy5ub2RlLnN0eWxlLmhlaWdodCA9ICcnXG4gIHRoaXMubm9kZS5zdHlsZS50b3AgPSB0aGlzLl9zdHlsZVRvcFxuXG4gIC8vIHJlY292ZXIgdGhlIHBvc2l0aW9uIG9mIHRhYmhlYWRlci5cbiAgdGhpcy5mbGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMubm9kZSwgdGhpcy5mbGFnKVxuICAvLyByZWNvdmVyIHRoZSBwb3NpdGlvbiBvZiBzY29sbGVyLlxuICB0aGlzLl9ib2R5LnNjcm9sbExlZnQgPSB0aGlzLl9zY3JvbGxWYWxcblxuICB0aGlzLl9zY3JvbGxUb1ZpZXcoKVxuICB0aGlzLnVuZm9sZGluZyA9IGZhbHNlXG59XG5cbnByb3RvLl9pbml0RXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2luaXRDbGlja0V2ZW50KClcbiAgdGhpcy5faW5pdFNlbGVjdEV2ZW50KClcbn1cblxuLy8gaW5pdCBldmVudHMuXG5wcm90by5faW5pdENsaWNrRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBib3ggPSB0aGlzLmJveFxuICB2YXIgX3RoaXMgPSB0aGlzXG5cbiAgYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciB0YXJnZXQgPSBldnQudGFyZ2V0XG4gICAgaWYgKHRhcmdldC5ub2RlTmFtZSA9PT0gJ1VMJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRhcmdldC5wYXJlbnROb2RlLm5vZGVOYW1lID09PSAnTEknKSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICAgIH1cblxuICAgIHZhciBmbG9vciA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmxvb3InKVxuXG4gICAgaWYgKF90aGlzLmRhdGEuYXR0ci5zZWxlY3RlZEluZGV4ID09IGZsb29yKSB7XG4gICAgICAvLyBEdXBsaWNhdGVkIGNsaWNraW5nLCBub3QgdG8gdHJpZ2dlciBzZWxlY3QgZXZlbnQuXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBmaXJlRXZlbnQodGFyZ2V0LCAnc2VsZWN0Jywge2luZGV4OiAgZmxvb3J9KVxuICB9KVxufVxuXG5wcm90by5faW5pdFNlbGVjdEV2ZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZSA9IHRoaXMubm9kZVxuICB2YXIgX3RoaXMgPSB0aGlzXG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignc2VsZWN0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciBpbmRleFxuICAgIGlmIChldnQuaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgaW5kZXggPSBldnQuaW5kZXhcbiAgICB9IGVsc2UgaWYgKGV2dC5kYXRhICYmIGV2dC5kYXRhLmluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGluZGV4ID0gZXZ0LmRhdGEuaW5kZXhcbiAgICB9XG5cbiAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgX3RoaXMuYXR0ci5zZWxlY3RlZEluZGV4LmNhbGwoX3RoaXMsIGluZGV4KVxuICB9KVxufVxuXG5wcm90by5hdHRyID0ge1xuICBoaWdobGlnaHRJY29uOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhpZ2hsaWdodEljb24oKVxuICB9LFxuICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGF0dHIgPSB0aGlzLmRhdGEuYXR0clxuICAgIC8vIEVuc3VyZSB0aGVyZSBpcyBhIGRlZmF1bHQgc2VsZWN0ZWQgdmFsdWUuXG4gICAgaWYgKGF0dHIuc2VsZWN0ZWRJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhdHRyLnNlbGVjdGVkSW5kZXggPSAwXG4gICAgfVxuXG4gICAgdmFyIGxpc3QgPSBhdHRyLmRhdGEgfHwgW11cbiAgICB2YXIgY3VySXRlbSA9IGF0dHIuc2VsZWN0ZWRJbmRleFxuXG4gICAgdmFyIHJldCA9IFtdXG4gICAgdmFyIGl0ZW1UbXBsID0gJzxsaSBjbGFzcz1cInRoLWl0ZW1cIiBkYXRhLWZsb29yPVwie3tmbG9vcn19XCI+J1xuICAgICAgICArICd7e2hsSWNvbn19e3tmbG9vck5hbWV9fTwvbGk+J1xuXG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpZHgpIHtcbiAgICAgIHZhciBodG1sID0gaXRlbVRtcGwucmVwbGFjZSgne3tmbG9vcn19JywgaWR4KVxuICAgICAgaWYgKGN1ckl0ZW0gPT0gaWR4KSB7XG4gICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoJ3t7aGxJY29ufX0nLCBjcmVhdGVIaWdobGlnaHRJY29uKCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKCd7e2hsSWNvbn19JywgJycpXG4gICAgICB9XG5cbiAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoJ3t7Zmxvb3JOYW1lfX0nLCBpdGVtKVxuXG4gICAgICByZXQucHVzaChodG1sKVxuICAgIH0sIHRoaXMpXG5cbiAgICB0aGlzLmJveC5pbm5lckhUTUwgPSByZXQuam9pbignJylcbiAgfSxcbiAgc2VsZWN0ZWRJbmRleDogZnVuY3Rpb24gKHZhbCkge1xuICAgIHZhciBhdHRyID0gdGhpcy5kYXRhLmF0dHJcblxuICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gMFxuICAgIH1cblxuICAgIC8vIGlmICh2YWwgPT0gYXR0ci5zZWxlY3RlZEluZGV4KSB7XG4gICAgLy8gICByZXR1cm5cbiAgICAvLyB9XG5cbiAgICBhdHRyLnNlbGVjdGVkSW5kZXggPSB2YWxcblxuICAgIHRoaXMuYXR0ci5kYXRhLmNhbGwodGhpcylcblxuICAgIHRoaXMuX2ZvbGRpbmcoKVxuICAgIHRoaXMuc3R5bGUudGV4dEhpZ2hsaWdodENvbG9yLmNhbGwodGhpcywgdGhpcy50ZXh0SGlnaGxpZ2h0Q29sb3IpXG4gIH1cbn1cblxucHJvdG8uc3R5bGUgPSBPYmplY3QuY3JlYXRlKEF0b21pYy5wcm90b3R5cGUuc3R5bGUpXG5cbnByb3RvLnN0eWxlLm9wYWNpdHkgPSBmdW5jdGlvbiAodmFsKSB7XG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgPCAwIHx8IHZhbCA+IDEpIHtcbiAgICB2YWwgPSAxXG4gIH1cblxuICB0aGlzLm5vZGUuc3R5bGUub3BhY2l0eSA9IHZhbFxufVxuXG5wcm90by5zdHlsZS50ZXh0Q29sb3IgPSBmdW5jdGlvbiAodmFsKSB7XG4gIGlmICghaXNWYWxpZENvbG9yKHZhbCkpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHRoaXMubm9kZS5zdHlsZS5jb2xvciA9IHZhbFxufVxuXG5wcm90by5zdHlsZS50ZXh0SGlnaGxpZ2h0Q29sb3IgPSBmdW5jdGlvbiAodmFsKSB7XG4gIGlmICghaXNWYWxpZENvbG9yKHZhbCkpIHtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLnRleHRIaWdobGlnaHRDb2xvciA9IHZhbFxuICB2YXIgYXR0ciA9IHRoaXMuZGF0YS5hdHRyXG5cbiAgdmFyIG5vZGUgPSB0aGlzLm5vZGUucXVlcnlTZWxlY3RvcignW2RhdGEtZmxvb3I9XCInXG4gICAgICArIGF0dHIuc2VsZWN0ZWRJbmRleCArICdcIl0nKVxuICBpZiAobm9kZSkge1xuICAgIG5vZGUuc3R5bGUuY29sb3IgPSB2YWxcbiAgICB0aGlzLl9zY3JvbGxUb1ZpZXcobm9kZSlcbiAgfVxufVxuXG5wcm90by5fc2Nyb2xsVG9WaWV3ID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgdmFyIGF0dHIgPSB0aGlzLmRhdGEuYXR0clxuICAgIG5vZGUgPSB0aGlzLm5vZGUucXVlcnlTZWxlY3RvcignW2RhdGEtZmxvb3I9XCInICsgYXR0ci5zZWxlY3RlZEluZGV4ICsgJ1wiXScpXG4gIH1cbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgZGVmYXVsdFZhbCA9IHRoaXMuX2JvZHkuc2Nyb2xsTGVmdFxuICB2YXIgbGVmdFZhbCA9IGRlZmF1bHRWYWwgIC0gbm9kZS5vZmZzZXRMZWZ0ICsgMzAwXG5cbiAgdmFyIHNjcm9sbFZhbCA9IGdldFNjcm9sbFZhbCh0aGlzLl9ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBub2RlKVxuICBkb1Njcm9sbCh0aGlzLl9ib2R5LCBzY3JvbGxWYWwpXG59XG5cbi8vIHNjcm9sbCB0aGUgdGFiaGVhZGVyLlxuLy8gcG9zaXRpdmUgdmFsIG1lYW5zIHRvIHNjcm9sbCByaWdodC5cbi8vIG5lZ2F0aXZlIHZhbCBtZWFucyB0byBzY3JvbGwgbGVmdC5cbmZ1bmN0aW9uIGRvU2Nyb2xsKG5vZGUsIHZhbCwgZmluaXNoKSB7XG4gIGlmICghdmFsKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKGZpbmlzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZmluaXNoID0gTWF0aC5hYnModmFsKVxuICB9XG5cbiAgaWYgKGZpbmlzaCA8PSAwKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodmFsID4gMCkge1xuICAgICAgbm9kZS5zY3JvbGxMZWZ0ICs9IDJcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5zY3JvbGxMZWZ0IC09IDJcbiAgICB9XG4gICAgZmluaXNoIC09IDJcblxuICAgIGRvU2Nyb2xsKG5vZGUsIHZhbCwgZmluaXNoKVxuICB9KVxufVxuXG4vLyBnZXQgc2Nyb2xsIGRpc3RhbmNlLlxuZnVuY3Rpb24gZ2V0U2Nyb2xsVmFsKHJlY3QsIG5vZGUpIHtcbiAgdmFyIGxlZnQgPSBub2RlLnByZXZpb3VzU2libGluZ1xuICB2YXIgcmlnaHQgPSBub2RlLm5leHRTaWJsaW5nXG4gIHZhciBzY3JvbGxWYWxcblxuICAvLyBwcm9jZXNzIGxlZnQtc2lkZSBlbGVtZW50IGZpcnN0LlxuICBpZiAobGVmdCkge1xuICAgIHZhciBsZWZ0UmVjdCA9IGxlZnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAvLyBvbmx5IG5lZWQgdG8gY29tcGFyZSB0aGUgdmFsdWUgb2YgbGVmdC5cbiAgICBpZiAobGVmdFJlY3QubGVmdCA8IHJlY3QubGVmdCkge1xuICAgICAgc2Nyb2xsVmFsID0gbGVmdFJlY3QubGVmdFxuICAgICAgcmV0dXJuIHNjcm9sbFZhbFxuICAgIH1cbiAgfVxuXG4gIGlmIChyaWdodCkge1xuICAgIHZhciByaWdodFJlY3QgPSByaWdodC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIC8vIGNvbXBhcmUgdGhlIHZhbHVlIG9mIHJpZ2h0LlxuICAgIGlmIChyaWdodFJlY3QucmlnaHQgPiByZWN0LnJpZ2h0KSB7XG4gICAgICBzY3JvbGxWYWwgPSByaWdodFJlY3QucmlnaHQgLSByZWN0LnJpZ2h0XG4gICAgICByZXR1cm4gc2Nyb2xsVmFsXG4gICAgfVxuICB9XG5cbiAgLy8gcHJvY2VzcyBjdXJyZW50IG5vZGUsIGZyb20gbGVmdCB0byByaWdodC5cbiAgdmFyIG5vZGVSZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBpZiAobm9kZVJlY3QubGVmdCA8IHJlY3QubGVmdCkge1xuICAgIHNjcm9sbFZhbCA9IG5vZGVSZWN0LmxlZnRcbiAgfSBlbHNlIGlmIChub2RlUmVjdC5yaWdodCA+IHJlY3QucmlnaHQpIHtcbiAgICBzY3JvbGxWYWwgPSBub2RlUmVjdC5yaWdodCAtIHJlY3QucmlnaHRcbiAgfVxuXG4gIHJldHVybiBzY3JvbGxWYWxcbn1cblxuLy8gdHJpZ2dlciBhbmQgYnJvYWRjYXN0IGV2ZW50cy5cbmZ1bmN0aW9uIGZpcmVFdmVudChlbGVtZW50LCB0eXBlLCBkYXRhKSB7XG4gIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKVxuICBldnQuZGF0YSA9IGRhdGFcbiAgdXRpbHMuZXh0ZW5kKGV2dCwgZGF0YSlcbiAgLy8gbmVlZCBidWJibGUuXG4gIGV2dC5pbml0RXZlbnQodHlwZSwgdHJ1ZSwgdHJ1ZSlcblxuICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVIaWdobGlnaHRJY29uKGNvZGUpIHtcbiAgdmFyIGh0bWwgPSAnPGkgY2xhc3M9XCJobC1pY29uIGljb25mb250XCI+JyArICcmI3hlNjUwJyArICc8L2k+J1xuICByZXR1cm4gaHRtbFxufVxuXG5mdW5jdGlvbiBpc1ZhbGlkQ29sb3IoY29sb3IpIHtcbiAgaWYgKCFjb2xvcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaWYgKGNvbG9yLmNoYXJBdCgwKSAhPT0gJyMnKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBpZiAoY29sb3IubGVuZ3RoICE9PSA3KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYkhlYWRlclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL3RhYmhlYWRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDQ3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBtZXNzYWdlUXVldWUgPSBbXVxuXG5mdW5jdGlvbiBmbHVzaE1lc3NhZ2UoKSB7XG4gIGlmICh0eXBlb2YgY2FsbEpTID09PSAnZnVuY3Rpb24nICYmIG1lc3NhZ2VRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgY2FsbEpTKGNvbmZpZy5pbnN0YW5jZUlkLCBKU09OLnN0cmluZ2lmeShtZXNzYWdlUXVldWUpKVxuICAgIG1lc3NhZ2VRdWV1ZS5sZW5ndGggPSAwXG4gIH1cbn1cblxuZnVuY3Rpb24gcHVzaChtc2cpIHtcbiAgbWVzc2FnZVF1ZXVlLnB1c2gobXNnKVxufVxuXG4vKipcbiAqIFRvIGZpeCB0aGUgcHJvYmxlbSBvZiBjYWxsYXBwLCB0aGUgdHdvLXdheSB0aW1lIGxvb3AgbWVjaGFuaXNtIG11c3RcbiAqIGJlIHJlcGxhY2VkIGJ5IGRpcmVjdGx5IHByb2NlZHVyZSBjYWxsIGV4Y2VwdCB0aGUgc2l0dWF0aW9uIG9mXG4gKiBwYWdlIGxvYWRpbmcuXG4gKiAyMDE1LTExLTAzXG4gKi9cbmZ1bmN0aW9uIHB1c2hEaXJlY3RseShtc2cpIHtcbiAgY2FsbEpTKGNvbmZpZy5pbnN0YW5jZUlkLCBbbXNnXSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHB1c2g6IHB1c2hEaXJlY3RseVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9tZXNzYWdlUXVldWUuanNcbiAqKiBtb2R1bGUgaWQgPSA0OFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3RhYmhlYWRlci5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vdGFiaGVhZGVyLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3RhYmhlYWRlci5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3N0eWxlcy90YWJoZWFkZXIuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDQ5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi50YWItaGVhZGVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMHJlbTtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGNvbG9yOiAjMzMzOyB9XFxuICAudGFiLWhlYWRlciAuaGVhZGVyLWJhciB7XFxuICAgIGhlaWdodDogMS4xN3JlbTtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTdyZW07XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIGNvbG9yOiAjOTk5O1xcbiAgICBwYWRkaW5nLWxlZnQ6IDAuNHJlbTsgfVxcbiAgLnRhYi1oZWFkZXIgLmhlYWRlci1ib2R5IHtcXG4gICAgbWFyZ2luLXJpZ2h0OiAxLjA3cmVtO1xcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47IH1cXG4gICAgLnRhYi1oZWFkZXIgLmhlYWRlci1ib2R5Ojotd2Via2l0LXNjcm9sbGJhciB7XFxuICAgICAgd2lkdGg6IDA7XFxuICAgICAgaGVpZ2h0OiAwO1xcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47IH1cXG4gIC50YWItaGVhZGVyIC5mb2xkLXRvZ2dsZSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAwLjU5cmVtO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXG4gICAgcmlnaHQ6IDAuMjlyZW07XFxuICAgIHdpZHRoOiAwLjQ4cmVtO1xcbiAgICBoZWlnaHQ6IDAuNDhyZW07XFxuICAgIGxpbmUtaGVpZ2h0OiAwLjQ4cmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHotaW5kZXg6IDk5O1xcbiAgICBmb250LXNpemU6IDE0cHg7IH1cXG4gIC50YWItaGVhZGVyLnVuZm9sZC1oZWFkZXIge1xcbiAgICBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDtcXG4gICAgdG9wOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICBvdmVyZmxvdzogaGlkZGVuOyB9XFxuXFxuLnRhYmhlYWRlciB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIGhlaWdodDogMS4xN3JlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjE3cmVtOyB9XFxuICAudGFiaGVhZGVyIC50aC1pdGVtIHtcXG4gICAgcGFkZGluZy1sZWZ0OiAwLjcycmVtO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jazsgfVxcbiAgLnRhYmhlYWRlciAuaGwtaWNvbiB7XFxuICAgIHdpZHRoOiAwLjRyZW07XFxuICAgIGhlaWdodDogMC40cmVtO1xcbiAgICBsaW5lLWhlaWdodDogMC40cmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiA1MCU7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xcbiAgICBsZWZ0OiAwLjI0cmVtO1xcbiAgICBmb250LXNpemU6IDE0cHg7IH1cXG5cXG4udW5mb2xkLWhlYWRlciAuaGVhZGVyLWJhciB7XFxuICBkaXNwbGF5OiBibG9jazsgfVxcblxcbi51bmZvbGQtaGVhZGVyIC5mb2xkLXRvZ2dsZSB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKSByb3RhdGUoMTgwZGVnKTsgfVxcblxcbi51bmZvbGQtaGVhZGVyIC5oZWFkZXItYm9keSB7XFxuICBtYXJnaW4tcmlnaHQ6IDA7XFxuICBwYWRkaW5nOiAwLjI0cmVtOyB9XFxuXFxuLnVuZm9sZC1oZWFkZXIgLnRhYmhlYWRlciB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGhlaWdodDogYXV0bzsgfVxcblxcbi51bmZvbGQtaGVhZGVyIC50aC1pdGVtIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBmbG9hdDogbGVmdDtcXG4gIHdpZHRoOiAzMy4zMzMzJTtcXG4gIGhlaWdodDogMS4wMXJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjAxcmVtOyB9XFxuXFxuLnVuZm9sZC1oZWFkZXIgLmhsLWljb24ge1xcbiAgbWFyZ2luLXJpZ2h0OiAwO1xcbiAgcG9zaXRpb246IGFic29sdXRlOyB9XFxuXFxuLnVuZm9sZC1oZWFkZXIudGFiaGVhZGVyLW1hc2sge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42KTsgfVxcblxcbi50YWJoZWFkZXItbWFzayB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgbGVmdDogMDtcXG4gIHRvcDogMDsgfVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJpY29uZm9udFxcXCI7XFxuICBzcmM6IHVybChcXFwiZGF0YTphcHBsaWNhdGlvbi94LWZvbnQtdHRmO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LEFBRUFBQUFQQUlBQUF3QndSa1pVVFhCRDk4VUFBQUQ4QUFBQUhFOVRMekpYTDF6SUFBQUJHQUFBQUdCamJXRndzNklIYmdBQUFYZ0FBQUZhWTNaMElBeVYvc3dBQUFwUUFBQUFKR1p3WjIwdzk1NlZBQUFLZEFBQUNaWm5ZWE53QUFBQUVBQUFDa2dBQUFBSVoyeDVadXhvUEZJQUFBTFVBQUFFV0dobFlXUUhBNWgzQUFBSExBQUFBRFpvYUdWaEJ6SURjZ0FBQjJRQUFBQWthRzEwZUFzMkFXMEFBQWVJQUFBQUdHeHZZMkVEY0FRZUFBQUhvQUFBQUJCdFlYaHdBU2tLS3dBQUI3QUFBQUFnYm1GdFpRbC8zaGdBQUFmUUFBQUNMbkJ2YzNUbTdmMGJBQUFLQUFBQUFFaHdjbVZ3cGJtK1pnQUFGQXdBQUFDVkFBQUFBUUFBQUFETVBhTFBBQUFBQU5JREtub0FBQUFBMGdNcWV3QUVBL29COUFBRkFBQUNtUUxNQUFBQWp3S1pBc3dBQUFIckFETUJDUUFBQWdBR0F3QUFBQUFBQUFBQUFBRVFBQUFBQUFBQUFBQUFBQUJRWmtWa0FNQUFlT2JlQXl6L0xBQmNBeGdBbEFBQUFBRUFBQUFBQXhnQUFBQUFBQ0FBQVFBQUFBTUFBQUFEQUFBQUhBQUJBQUFBQUFCVUFBTUFBUUFBQUJ3QUJBQTRBQUFBQ2dBSUFBSUFBZ0I0NWxEbVllYmUvLzhBQUFCNDVsRG1ZZWJlLy8vL2l4bTBHYVFaS0FBQkFBQUFBQUFBQUFBQUFBQUFBUVlBQUFFQUFBQUFBQUFBQVFJQUFBQUNBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBTUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFDQUNJQUFBRXlBcW9BQXdBSEFDbEFKZ0FBQUFNQ0FBTlhBQUlCQVFKTEFBSUNBVThFQVFFQ0FVTUFBQWNHQlFRQUF3QURFUVVQS3pNUklSRW5NeEVqSWdFUTdzek1BcXI5VmlJQ1pnQUFBQVVBTFAvaEE3d0RHQUFXQURBQU9nQlNBRjRCZDB1d0UxQllRRW9DQVFBTkRnMEFEbVlBQXc0QkRnTmVBQUVJQ0FGY0VBRUpDQW9HQ1Y0UkFRd0dCQVlNWGdBTEJBdHBEd0VJQUFZTUNBWllBQW9IQlFJRUN3b0VXUklCRGc0TlVRQU5EUW9PUWh0THNCZFFXRUJMQWdFQURRNE5BQTVtQUFNT0FRNERYZ0FCQ0FnQlhCQUJDUWdLQ0FrS1poRUJEQVlFQmd4ZUFBc0VDMmtQQVFnQUJnd0lCbGdBQ2djRkFnUUxDZ1JaRWdFT0RnMVJBQTBOQ2c1Q0cwdXdHRkJZUUV3Q0FRQU5EZzBBRG1ZQUF3NEJEZ05lQUFFSUNBRmNFQUVKQ0FvSUNRcG1FUUVNQmdRR0RBUm1BQXNFQzJrUEFRZ0FCZ3dJQmxnQUNnY0ZBZ1FMQ2dSWkVnRU9EZzFSQUEwTkNnNUNHMEJPQWdFQURRNE5BQTVtQUFNT0FRNERBV1lBQVFnT0FRaGtFQUVKQ0FvSUNRcG1FUUVNQmdRR0RBUm1BQXNFQzJrUEFRZ0FCZ3dJQmxnQUNnY0ZBZ1FMQ2dSWkVnRU9EZzFSQUEwTkNnNUNXVmxaUUNoVFV6czdNakVYRjFOZVUxNWJXRHRTTzFKTFF6YzFNVG95T2hjd0Z6QlJFVEVZRVNnVlFCTVdLd0VHS3dFaURnSWRBU0UxTkNZMU5DNENLd0VWSVFVVkZCWVVEZ0lqQmlZckFTY2hCeXNCSWljaUxnSTlBUmNpQmhRV016STJOQ1lYQmdjT0F4NEJPd1l5TmljdUFTY21Kd0UxTkQ0Q093RXlGaDBCQVJrYkdsTVNKUndTQTVBQkNoZ25Ib1grU2dLaUFSVWZJdzRPSHc0Z0xmNUpMQjBpRkJrWklCTUlkd3dTRWd3TkVoS01DQVlGQ3dRQ0JBOE9KVU5SVUVBa0Z4WUpCUWtGQlFiK3BBVVBHaFc4SHlrQ0h3RU1HU2NhVENrUUhBUU5JQnNTWVlnMEZ6bzZKUmNKQVFHQWdBRVRHeUFPcHo4UkdoRVJHaEY4R2hZVEpBNFFEUWdZR2cwakVSTVVBWGZrQ3hnVERCMG00d0FBQWdDZy8yd0RZQUxzQUJJQUdnQWhRQjRBQUFBREFnQURXUUFDQVFFQ1RRQUNBZ0ZSQUFFQ0FVVVRGamtRQkJJckFDQUdGUlFlQXhjV093RXlQd0VTTlRRQUlpWTBOaklXRkFLUy90ek9SRlZ2TVJBSkRnRU9DVzNiL3VLRVhsNkVYZ0xzenBJMWxYeUpOaEVLQzMwQkRJeVMvczVlaEY1ZWhBQUFBQUVBZ2dCSkE0UUI2QUFkQUJ0QUdCSVJBZ0VBQVVBRkFRQStBQUFCQUdnQUFRRmZFeDhDRUNzQkpnY0dCd2tCTGdFR0J3WVVGd0V3TXhjVkZqSTNBVDRETGdJRGVoRVdBd1ArdVA2MEJoRVFCZ29LQVdFQkFRb2FDUUZlQXdRQ0FRRUNCQUhoRWcwREF2NjFBVWtIQkFVR0NSc0ovcUlCQVFrSkFXSUNCd1lIQ0FZR0FBRUFmd0NMQTRFQ0p3QWhBQjFBR2hZUEFnRUFBVUFGQVFBK0FBQUJBR2dDQVFFQlh5UXVFd01SS3lVQk1DY2pOU1lIQmdjQkRnRVVGaGNlQWpNeU53a0JGak15TmpjK0FpNEJBM2YrbndFQkVoVUVBdjZpQlFVRkJRTUhDQVFPQ1FGSUFVd0tEUVlNQlFNRkFRRUZ3d0ZlQVFFUkRRSUQvcDhGREF3TUJBTUVBZ2tCUy82MkNRVUZBd29KQ2drQUFBRUFBQUFCQUFBTEl5bm9Ydzg4OVFBTEJBQUFBQUFBMGdNcWV3QUFBQURTQXlwN0FDTC9iQU84QXhnQUFBQUlBQUlBQUFBQUFBQUFBUUFBQXhqL2JBQmNCQUFBQUFBQUE3d0FBUUFBQUFBQUFBQUFBQUFBQUFBQUFBVUJkZ0FpQUFBQUFBRlZBQUFENlFBc0JBQUFvQUNDQUg4QUFBQW9BQ2dBS0FGa0FhSUI1QUlzQUFFQUFBQUhBRjhBQlFBQUFBQUFBZ0FtQURRQWJBQUFBSW9KbGdBQUFBQUFBQUFNQUpZQUFRQUFBQUFBQVFBSUFBQUFBUUFBQUFBQUFnQUdBQWdBQVFBQUFBQUFBd0FrQUE0QUFRQUFBQUFBQkFBSUFESUFBUUFBQUFBQUJRQkdBRG9BQVFBQUFBQUFCZ0FJQUlBQUF3QUJCQWtBQVFBUUFJZ0FBd0FCQkFrQUFnQU1BSmdBQXdBQkJBa0FBd0JJQUtRQUF3QUJCQWtBQkFBUUFPd0FBd0FCQkFrQUJRQ01BUHdBQXdBQkJBa0FCZ0FRQVlocFkyOXVabTl1ZEUxbFpHbDFiVVp2Ym5SR2IzSm5aU0F5TGpBZ09pQnBZMjl1Wm05dWRDQTZJREkyTFRndE1qQXhOV2xqYjI1bWIyNTBWbVZ5YzJsdmJpQXhMakFnT3lCMGRHWmhkWFJ2YUdsdWRDQW9kakF1T1RRcElDMXNJRGdnTFhJZ05UQWdMVWNnTWpBd0lDMTRJREUwSUMxM0lDSkhJaUF0WmlBdGMybGpiMjVtYjI1MEFHa0FZd0J2QUc0QVpnQnZBRzRBZEFCTkFHVUFaQUJwQUhVQWJRQkdBRzhBYmdCMEFFWUFid0J5QUdjQVpRQWdBRElBTGdBd0FDQUFPZ0FnQUdrQVl3QnZBRzRBWmdCdkFHNEFkQUFnQURvQUlBQXlBRFlBTFFBNEFDMEFNZ0F3QURFQU5RQnBBR01BYndCdUFHWUFid0J1QUhRQVZnQmxBSElBY3dCcEFHOEFiZ0FnQURFQUxnQXdBQ0FBT3dBZ0FIUUFkQUJtQUdFQWRRQjBBRzhBYUFCcEFHNEFkQUFnQUNnQWRnQXdBQzRBT1FBMEFDa0FJQUF0QUd3QUlBQTRBQ0FBTFFCeUFDQUFOUUF3QUNBQUxRQkhBQ0FBTWdBd0FEQUFJQUF0QUhnQUlBQXhBRFFBSUFBdEFIY0FJQUFpQUVjQUlnQWdBQzBBWmdBZ0FDMEFjd0JwQUdNQWJ3QnVBR1lBYndCdUFIUUFBQUFDQUFBQUFBQUEvNE1BTWdBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBY0FBQUFCQUFJQVd3RUNBUU1CQkFkMWJtbEZOalV3QjNWdWFVVTJOakVIZFc1cFJUWkVSUUFCQUFILy93QVBBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQXlBRElER1AvaEF4ai9iQU1ZLytFREdQOXNzQUFzc0NCZ1ppMndBU3dnWkNDd3dGQ3dCQ1phc0FSRlcxZ2hJeUViaWxnZ3NGQlFXQ0d3UUZrYklMQTRVRmdoc0RoWldTQ3dDa1ZoWkxBb1VGZ2hzQXBGSUxBd1VGZ2hzREJaR3lDd3dGQllJR1lnaW9waElMQUtVRmhnR3lDd0lGQllJYkFLWUJzZ3NEWlFXQ0d3Tm1BYllGbFpXUnV3QUN0WldTT3dBRkJZWlZsWkxiQUNMQ0JGSUxBRUpXRmtJTEFGUTFCWXNBVWpRckFHSTBJYklTRlpzQUZnTGJBRExDTWhJeUVnWkxFRllrSWdzQVlqUXJJS0FBSXFJU0N3QmtNZ2lpQ0tzQUFyc1RBRkpZcFJXR0JRRzJGU1dWZ2pXU0Vnc0VCVFdMQUFLeHNoc0VCWkk3QUFVRmhsV1Myd0JDeXdDQ05Dc0FjalFyQUFJMEt3QUVPd0IwTlJXTEFJUXl1eUFBRUFRMkJDc0JabEhGa3RzQVVzc0FCRElFVWdzQUpGWTdBQlJXSmdSQzJ3Qml5d0FFTWdSU0N3QUNzanNRUUVKV0FnUllvallTQmtJTEFnVUZnaHNBQWJzREJRV0xBZ0c3QkFXVmtqc0FCUVdHVlpzQU1sSTJGRVJDMndCeXl4QlFWRnNBRmhSQzJ3Q0N5d0FXQWdJTEFLUTBxd0FGQllJTEFLSTBKWnNBdERTckFBVWxnZ3NBc2pRbGt0c0Frc0lMZ0VBR0lndUFRQVk0b2pZYkFNUTJBZ2ltQWdzQXdqUWlNdHNBb3NTMVJZc1FjQlJGa2tzQTFsSTNndHNBc3NTMUZZUzFOWXNRY0JSRmtiSVZra3NCTmxJM2d0c0F3c3NRQU5RMVZZc1EwTlE3QUJZVUt3Q1N0WnNBQkRzQUlsUXJJQUFRQkRZRUt4Q2dJbFFyRUxBaVZDc0FFV0l5Q3dBeVZRV0xBQVE3QUVKVUtLaWlDS0kyR3dDQ29oSTdBQllTQ0tJMkd3Q0NvaEc3QUFRN0FDSlVLd0FpVmhzQWdxSVZtd0NrTkhzQXREUjJDd2dHSWdzQUpGWTdBQlJXSmdzUUFBRXlORXNBRkRzQUErc2dFQkFVTmdRaTJ3RFN5eEFBVkZWRmdBc0EwalFpQmdzQUZodFE0T0FRQU1BRUpDaW1DeERBUXJzR3NyR3lKWkxiQU9MTEVBRFNzdHNBOHNzUUVOS3kyd0VDeXhBZzByTGJBUkxMRUREU3N0c0JJc3NRUU5LeTJ3RXl5eEJRMHJMYkFVTExFR0RTc3RzQlVzc1FjTkt5MndGaXl4Q0EwckxiQVhMTEVKRFNzdHNCZ3NzQWNyc1FBRlJWUllBTEFOSTBJZ1lMQUJZYlVPRGdFQURBQkNRb3Bnc1F3RUs3QnJLeHNpV1Myd0dTeXhBQmdyTGJBYUxMRUJHQ3N0c0Jzc3NRSVlLeTJ3SEN5eEF4Z3JMYkFkTExFRUdDc3RzQjRzc1FVWUt5MndIeXl4QmhnckxiQWdMTEVIR0NzdHNDRXNzUWdZS3kyd0lpeXhDUmdyTGJBakxDQmdzQTVnSUVNanNBRmdRN0FDSmJBQ0pWRllJeUE4c0FGZ0k3QVNaUndiSVNGWkxiQWtMTEFqSzdBaktpMndKU3dnSUVjZ0lMQUNSV093QVVWaVlDTmhPQ01naWxWWUlFY2dJTEFDUldPd0FVVmlZQ05oT0JzaFdTMndKaXl4QUFWRlZGZ0FzQUVXc0NVcXNBRVZNQnNpV1Myd0p5eXdCeXV4QUFWRlZGZ0FzQUVXc0NVcXNBRVZNQnNpV1Myd0tDd2dOYkFCWUMyd0tTd0FzQU5GWTdBQlJXS3dBQ3V3QWtWanNBRkZZckFBSzdBQUZyUUFBQUFBQUVRK0l6aXhLQUVWS2kyd0tpd2dQQ0JISUxBQ1JXT3dBVVZpWUxBQVEyRTRMYkFyTEM0WFBDMndMQ3dnUENCSElMQUNSV093QVVWaVlMQUFRMkd3QVVOak9DMndMU3l4QWdBV0pTQXVJRWV3QUNOQ3NBSWxTWXFLUnlOSEkyRWdXR0liSVZtd0FTTkNzaXdCQVJVVUtpMndMaXl3QUJhd0JDV3dCQ1ZISTBjalliQUdSU3RsaWk0aklDQThpamd0c0M4c3NBQVdzQVFsc0FRbElDNUhJMGNqWVNDd0JDTkNzQVpGS3lDd1lGQllJTEJBVVZpekFpQURJQnV6QWlZREdsbENRaU1nc0FsRElJb2pSeU5ISTJFalJtQ3dCRU93Z0dKZ0lMQUFLeUNLaW1FZ3NBSkRZR1Fqc0FORFlXUlFXTEFDUTJFYnNBTkRZRm13QXlXd2dHSmhJeUFnc0FRbUkwWmhPQnNqc0FsRFJyQUNKYkFKUTBjalJ5TmhZQ0N3QkVPd2dHSmdJeUN3QUNzanNBUkRZTEFBSzdBRkpXR3dCU1d3Z0dLd0JDWmhJTEFFSldCa0k3QURKV0JrVUZnaEd5TWhXU01nSUxBRUppTkdZVGhaTGJBd0xMQUFGaUFnSUxBRkppQXVSeU5ISTJFalBEZ3RzREVzc0FBV0lMQUpJMElnSUNCR0kwZXdBQ3NqWVRndHNESXNzQUFXc0FNbHNBSWxSeU5ISTJHd0FGUllMaUE4SXlFYnNBSWxzQUlsUnlOSEkyRWdzQVVsc0FRbFJ5TkhJMkd3QmlXd0JTVkpzQUlsWWJBQlJXTWpJRmhpR3lGWlk3QUJSV0pnSXk0aklDQThpamdqSVZrdHNETXNzQUFXSUxBSlF5QXVSeU5ISTJFZ1lMQWdZR2F3Z0dJaklDQThpamd0c0RRc0l5QXVSckFDSlVaU1dDQThXUzZ4SkFFVUt5MndOU3dqSUM1R3NBSWxSbEJZSUR4WkxyRWtBUlFyTGJBMkxDTWdMa2F3QWlWR1VsZ2dQRmtqSUM1R3NBSWxSbEJZSUR4WkxyRWtBUlFyTGJBM0xMQXVLeU1nTGthd0FpVkdVbGdnUEZrdXNTUUJGQ3N0c0Rnc3NDOHJpaUFnUExBRUkwS0tPQ01nTGthd0FpVkdVbGdnUEZrdXNTUUJGQ3V3QkVNdXNDUXJMYkE1TExBQUZyQUVKYkFFSmlBdVJ5TkhJMkd3QmtVckl5QThJQzRqT0xFa0FSUXJMYkE2TExFSkJDVkNzQUFXc0FRbHNBUWxJQzVISTBjallTQ3dCQ05Dc0FaRkt5Q3dZRkJZSUxCQVVWaXpBaUFESUJ1ekFpWURHbGxDUWlNZ1I3QUVRN0NBWW1BZ3NBQXJJSXFLWVNDd0FrTmdaQ093QTBOaFpGQllzQUpEWVJ1d0EwTmdXYkFESmJDQVltR3dBaVZHWVRnaklEd2pPQnNoSUNCR0kwZXdBQ3NqWVRnaFdiRWtBUlFyTGJBN0xMQXVLeTZ4SkFFVUt5MndQQ3l3THlzaEl5QWdQTEFFSTBJak9MRWtBUlFyc0FSRExyQWtLeTJ3UFN5d0FCVWdSN0FBSTBLeUFBRUJGUlFUTHJBcUtpMndQaXl3QUJVZ1I3QUFJMEt5QUFFQkZSUVRMckFxS2kyd1B5eXhBQUVVRTdBcktpMndRQ3l3TFNvdHNFRXNzQUFXUlNNZ0xpQkdpaU5oT0xFa0FSUXJMYkJDTExBSkkwS3dRU3N0c0VNc3NnQUFPaXN0c0VRc3NnQUJPaXN0c0VVc3NnRUFPaXN0c0VZc3NnRUJPaXN0c0Vjc3NnQUFPeXN0c0Vnc3NnQUJPeXN0c0Vrc3NnRUFPeXN0c0Vvc3NnRUJPeXN0c0Vzc3NnQUFOeXN0c0V3c3NnQUJOeXN0c0Uwc3NnRUFOeXN0c0U0c3NnRUJOeXN0c0U4c3NnQUFPU3N0c0ZBc3NnQUJPU3N0c0ZFc3NnRUFPU3N0c0ZJc3NnRUJPU3N0c0ZNc3NnQUFQQ3N0c0ZRc3NnQUJQQ3N0c0ZVc3NnRUFQQ3N0c0ZZc3NnRUJQQ3N0c0Zjc3NnQUFPQ3N0c0Znc3NnQUJPQ3N0c0Zrc3NnRUFPQ3N0c0Zvc3NnRUJPQ3N0c0Zzc3NEQXJMckVrQVJRckxiQmNMTEF3SzdBMEt5MndYU3l3TUN1d05Tc3RzRjRzc0FBV3NEQXJzRFlyTGJCZkxMQXhLeTZ4SkFFVUt5MndZQ3l3TVN1d05Dc3RzR0Vzc0RFcnNEVXJMYkJpTExBeEs3QTJLeTJ3WXl5d01pc3VzU1FCRkNzdHNHUXNzRElyc0RRckxiQmxMTEF5SzdBMUt5MndaaXl3TWl1d05pc3RzR2Nzc0RNckxyRWtBUlFyTGJCb0xMQXpLN0EwS3kyd2FTeXdNeXV3TlNzdHNHb3NzRE1yc0RZckxiQnJMQ3V3Q0dXd0F5UlFlTEFCRlRBdEFBQkx1QURJVWxpeEFRR09XYmtJQUFnQVl5Q3dBU05FSUxBREkzQ3dEa1VnSUV1NEFBNVJTN0FHVTFwWXNEUWJzQ2haWUdZZ2lsVllzQUlsWWJBQlJXTWpZckFDSTBTekNna0ZCQ3V6Q2dzRkJDdXpEZzhGQkN0WnNnUW9DVVZTUkxNS0RRWUVLN0VHQVVTeEpBR0lVVml3UUloWXNRWURSTEVtQVloUldMZ0VBSWhZc1FZQlJGbFpXVm00QWYrRnNBU05zUVVBUkFBQUFBPT1cXFwiKSBmb3JtYXQoXFxcInRydWV0eXBlXFxcIik7IH1cXG5cXG4uaWNvbmZvbnQge1xcbiAgZm9udC1mYW1pbHk6IGljb25mb250ICFpbXBvcnRhbnQ7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG4gIC13ZWJraXQtdGV4dC1zdHJva2Utd2lkdGg6IDAuMnB4O1xcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTsgfVxcblxcbltkYXRhLWRwcj1cXFwiMlxcXCJdIC50YWItaGVhZGVyIHtcXG4gIGZvbnQtc2l6ZTogMjhweDsgfVxcblxcbltkYXRhLWRwcj1cXFwiM1xcXCJdIC50YWItaGVhZGVyIHtcXG4gIGZvbnQtc2l6ZTogNDJweDsgfVxcblxcbltkYXRhLWRwcj1cXFwiMlxcXCJdIC50YWJoZWFkZXIgLmhsLWljb24ge1xcbiAgZm9udC1zaXplOiAyOHB4OyB9XFxuXFxuW2RhdGEtZHByPVxcXCIzXFxcIl0gLnRhYmhlYWRlciAuaGwtaWNvbiB7XFxuICBmb250LXNpemU6IDQycHg7IH1cXG5cXG5bZGF0YS1kcHI9XFxcIjJcXFwiXSAudGFiLWhlYWRlciAuZm9sZC10b2dnbGUge1xcbiAgZm9udC1zaXplOiAyOHB4OyB9XFxuXFxuW2RhdGEtZHByPVxcXCIzXFxcIl0gLnRhYi1oZWFkZXIgLmZvbGQtdG9nZ2xlIHtcXG4gIGZvbnQtc2l6ZTogNDJweDsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvc3JjL3N0eWxlcy90YWJoZWFkZXIuc2Nzc1wiLFwiLy4vc3JjL3N0eWxlcy90YWJoZWFkZXIuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFHQTtFQUNFLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2IsZ0JBQWdCO0VBQ2hCLFlBQVksRUEwQ2I7RUE5Q0Q7SUFPSSxnQkFBZ0I7SUFDaEIscUJBQXFCO0lBQ3JCLGNBQWM7SUFDZCxZQUFZO0lBQ1oscUJBQXFCLEVBQ3RCO0VBWkg7SUFlSSxzQkFBc0I7SUFDdEIsaUJBQWlCO0lBQ2pCLG1CQUFtQixFQU9wQjtJQXhCSDtNQW9CTSxTQUFTO01BQ1QsVUFBVTtNQUNWLGlCQUFpQixFQUNsQjtFQXZCTDtJQTJCSSxtQkFBbUI7SUFDbkIsYUFBYTtJQUNiLG9DQUE2QjtJQUM3QixlQUFlO0lBQ2YsZUFBZTtJQUNmLGdCQUFnQjtJQUNoQixxQkFBcUI7SUFDckIsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWixnQkFBZ0IsRUFDakI7RUFyQ0g7SUF3Q0ksMkJBQTJCO0lBQzNCLE9BQU87SUFDUCxRQUFRO0lBQ1IsaUJBQWlCLEVBQ2xCOztBQUlIO0VBQ0UsaUJBQWlCO0VBQ2pCLG9CQUFvQjtFQUNwQixnQkFBZ0I7RUFDaEIscUJBQXFCLEVBb0J0QjtFQXhCRDtJQU9JLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsc0JBQXNCLEVBQ3ZCO0VBVkg7SUFhSSxjQUFjO0lBQ2QsZUFBZTtJQUNmLG9CQUFvQjtJQUNwQixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLFNBQVM7SUFDVCxvQ0FBNkI7SUFDN0IsY0FBYztJQUNkLGdCQUFnQixFQUNqQjs7QUFJSDtFQUdJLGVBQWUsRUFDaEI7O0FBSkg7RUFPSSxtREFBMEMsRUFDM0M7O0FBUkg7RUFXSSxnQkFBZ0I7RUFDaEIsaUJBQWlCLEVBQ2xCOztBQWJIO0VBZ0JJLGVBQWU7RUFDZixhQUFhLEVBQ2Q7O0FBbEJIO0VBcUJJLHVCQUF1QjtFQUN2QixZQUFZO0VBQ1osZ0JBQWdCO0VBQ2hCLGdCQUFnQjtFQUNoQixxQkFBcUIsRUFDdEI7O0FBMUJIO0VBNkJJLGdCQUFnQjtFQUNoQixtQkFBbUIsRUFDcEI7O0FBL0JIO0VBa0NJLGVBQWU7RUFDZixZQUFZO0VBQ1osYUFBYTtFQUNiLHFDQUFzQixFQUN2Qjs7QUFHSDtFQUNFLGNBQWM7RUFDZCxnQkFBZ0I7RUFDaEIsUUFBUTtFQUNSLE9BQU8sRUFDUjs7QUFFRDtFQUNFLHdCQUF3QjtFQUN4Qix5OU5BQTQ4TixFQUFBOztBQUc5OE47RUFDRSxpQ0FBaUM7RUFDakMsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixvQ0FBb0M7RUFDcEMsaUNBQWlDO0VBQ2pDLG1DQUFtQyxFQUNwQzs7QUNoQ0Q7RURtQ0UsZ0JBQWdCLEVBQ2pCOztBQ2pDRDtFRG9DRSxnQkFBZ0IsRUFDakI7O0FDbENEO0VEcUNFLGdCQUFnQixFQUNqQjs7QUNuQ0Q7RURzQ0UsZ0JBQWdCLEVBQ2pCOztBQ3BDRDtFRHVDRSxnQkFBZ0IsRUFDakI7O0FDckNEO0VEd0NFLGdCQUFnQixFQUNqQlwiLFwiZmlsZVwiOlwidGFiaGVhZGVyLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLy8gSGVhZHMgdXAhIFJlbSBpcyBub3QgYSBnb29kIHdheSBmb3JcXG4vLyB3ZWV4IEhUTUw1IHJlbmRlcmVyLlxcblxcbi50YWItaGVhZGVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMHJlbTtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGNvbG9yOiAjMzMzO1xcblxcbiAgLmhlYWRlci1iYXIge1xcbiAgICBoZWlnaHQ6IDEuMTdyZW07XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjE3cmVtO1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgICBjb2xvcjogIzk5OTtcXG4gICAgcGFkZGluZy1sZWZ0OiAwLjRyZW07XFxuICB9XFxuICBcXG4gIC5oZWFkZXItYm9keSB7XFxuICAgIG1hcmdpbi1yaWdodDogMS4wN3JlbTtcXG4gICAgb3ZlcmZsb3cteDogYXV0bztcXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xcblxcbiAgICAmOjotd2Via2l0LXNjcm9sbGJhciB7XFxuICAgICAgd2lkdGg6IDA7XFxuICAgICAgaGVpZ2h0OiAwO1xcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XFxuICAgIH1cXG4gIH1cXG5cXG4gIC5mb2xkLXRvZ2dsZSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAwLjU5cmVtO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXG4gICAgcmlnaHQ6IDAuMjlyZW07XFxuICAgIHdpZHRoOiAwLjQ4cmVtO1xcbiAgICBoZWlnaHQ6IDAuNDhyZW07XFxuICAgIGxpbmUtaGVpZ2h0OiAwLjQ4cmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHotaW5kZXg6IDk5O1xcbiAgICBmb250LXNpemU6IDE0cHg7XFxuICB9XFxuXFxuICAmLnVuZm9sZC1oZWFkZXIge1xcbiAgICBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDtcXG4gICAgdG9wOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgfVxcblxcbn1cXG5cXG4udGFiaGVhZGVyIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgaGVpZ2h0OiAxLjE3cmVtO1xcbiAgbGluZS1oZWlnaHQ6IDEuMTdyZW07XFxuXFxuICAudGgtaXRlbSB7XFxuICAgIHBhZGRpbmctbGVmdDogMC43MnJlbTtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB9XFxuXFxuICAuaGwtaWNvbiB7XFxuICAgIHdpZHRoOiAwLjRyZW07XFxuICAgIGhlaWdodDogMC40cmVtO1xcbiAgICBsaW5lLWhlaWdodDogMC40cmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiA1MCU7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xcbiAgICBsZWZ0OiAwLjI0cmVtO1xcbiAgICBmb250LXNpemU6IDE0cHg7XFxuICB9XFxuXFxufVxcblxcbi51bmZvbGQtaGVhZGVyIHtcXG5cXG4gIC5oZWFkZXItYmFyIHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxuICB9XFxuXFxuICAuZm9sZC10b2dnbGUge1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKSByb3RhdGUoMTgwZGVnKTtcXG4gIH1cXG5cXG4gIC5oZWFkZXItYm9keSB7XFxuICAgIG1hcmdpbi1yaWdodDogMDtcXG4gICAgcGFkZGluZzogMC4yNHJlbTtcXG4gIH1cXG5cXG4gIC50YWJoZWFkZXIge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgaGVpZ2h0OiBhdXRvO1xcbiAgfVxcblxcbiAgLnRoLWl0ZW0ge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBmbG9hdDogbGVmdDtcXG4gICAgd2lkdGg6IDMzLjMzMzMlO1xcbiAgICBoZWlnaHQ6IDEuMDFyZW07XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjAxcmVtO1xcbiAgfVxcblxcbiAgLmhsLWljb24ge1xcbiAgICBtYXJnaW4tcmlnaHQ6IDA7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIH1cXG5cXG4gICYudGFiaGVhZGVyLW1hc2sge1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGhlaWdodDogMTAwJTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjYpO1xcbiAgfVxcbn1cXG5cXG4udGFiaGVhZGVyLW1hc2sge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGxlZnQ6IDA7XFxuICB0b3A6IDA7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJpY29uZm9udFxcXCI7XFxuICBzcmM6IHVybChcXFwiZGF0YTphcHBsaWNhdGlvbi94LWZvbnQtdHRmO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LEFBRUFBQUFQQUlBQUF3QndSa1pVVFhCRDk4VUFBQUQ4QUFBQUhFOVRMekpYTDF6SUFBQUJHQUFBQUdCamJXRndzNklIYmdBQUFYZ0FBQUZhWTNaMElBeVYvc3dBQUFwUUFBQUFKR1p3WjIwdzk1NlZBQUFLZEFBQUNaWm5ZWE53QUFBQUVBQUFDa2dBQUFBSVoyeDVadXhvUEZJQUFBTFVBQUFFV0dobFlXUUhBNWgzQUFBSExBQUFBRFpvYUdWaEJ6SURjZ0FBQjJRQUFBQWthRzEwZUFzMkFXMEFBQWVJQUFBQUdHeHZZMkVEY0FRZUFBQUhvQUFBQUJCdFlYaHdBU2tLS3dBQUI3QUFBQUFnYm1GdFpRbC8zaGdBQUFmUUFBQUNMbkJ2YzNUbTdmMGJBQUFLQUFBQUFFaHdjbVZ3cGJtK1pnQUFGQXdBQUFDVkFBQUFBUUFBQUFETVBhTFBBQUFBQU5JREtub0FBQUFBMGdNcWV3QUVBL29COUFBRkFBQUNtUUxNQUFBQWp3S1pBc3dBQUFIckFETUJDUUFBQWdBR0F3QUFBQUFBQUFBQUFBRVFBQUFBQUFBQUFBQUFBQUJRWmtWa0FNQUFlT2JlQXl6L0xBQmNBeGdBbEFBQUFBRUFBQUFBQXhnQUFBQUFBQ0FBQVFBQUFBTUFBQUFEQUFBQUhBQUJBQUFBQUFCVUFBTUFBUUFBQUJ3QUJBQTRBQUFBQ2dBSUFBSUFBZ0I0NWxEbVllYmUvLzhBQUFCNDVsRG1ZZWJlLy8vL2l4bTBHYVFaS0FBQkFBQUFBQUFBQUFBQUFBQUFBUVlBQUFFQUFBQUFBQUFBQVFJQUFBQUNBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBTUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFDQUNJQUFBRXlBcW9BQXdBSEFDbEFKZ0FBQUFNQ0FBTlhBQUlCQVFKTEFBSUNBVThFQVFFQ0FVTUFBQWNHQlFRQUF3QURFUVVQS3pNUklSRW5NeEVqSWdFUTdzek1BcXI5VmlJQ1pnQUFBQVVBTFAvaEE3d0RHQUFXQURBQU9nQlNBRjRCZDB1d0UxQllRRW9DQVFBTkRnMEFEbVlBQXc0QkRnTmVBQUVJQ0FGY0VBRUpDQW9HQ1Y0UkFRd0dCQVlNWGdBTEJBdHBEd0VJQUFZTUNBWllBQW9IQlFJRUN3b0VXUklCRGc0TlVRQU5EUW9PUWh0THNCZFFXRUJMQWdFQURRNE5BQTVtQUFNT0FRNERYZ0FCQ0FnQlhCQUJDUWdLQ0FrS1poRUJEQVlFQmd4ZUFBc0VDMmtQQVFnQUJnd0lCbGdBQ2djRkFnUUxDZ1JaRWdFT0RnMVJBQTBOQ2c1Q0cwdXdHRkJZUUV3Q0FRQU5EZzBBRG1ZQUF3NEJEZ05lQUFFSUNBRmNFQUVKQ0FvSUNRcG1FUUVNQmdRR0RBUm1BQXNFQzJrUEFRZ0FCZ3dJQmxnQUNnY0ZBZ1FMQ2dSWkVnRU9EZzFSQUEwTkNnNUNHMEJPQWdFQURRNE5BQTVtQUFNT0FRNERBV1lBQVFnT0FRaGtFQUVKQ0FvSUNRcG1FUUVNQmdRR0RBUm1BQXNFQzJrUEFRZ0FCZ3dJQmxnQUNnY0ZBZ1FMQ2dSWkVnRU9EZzFSQUEwTkNnNUNXVmxaUUNoVFV6czdNakVYRjFOZVUxNWJXRHRTTzFKTFF6YzFNVG95T2hjd0Z6QlJFVEVZRVNnVlFCTVdLd0VHS3dFaURnSWRBU0UxTkNZMU5DNENLd0VWSVFVVkZCWVVEZ0lqQmlZckFTY2hCeXNCSWljaUxnSTlBUmNpQmhRV016STJOQ1lYQmdjT0F4NEJPd1l5TmljdUFTY21Kd0UxTkQ0Q093RXlGaDBCQVJrYkdsTVNKUndTQTVBQkNoZ25Ib1grU2dLaUFSVWZJdzRPSHc0Z0xmNUpMQjBpRkJrWklCTUlkd3dTRWd3TkVoS01DQVlGQ3dRQ0JBOE9KVU5SVUVBa0Z4WUpCUWtGQlFiK3BBVVBHaFc4SHlrQ0h3RU1HU2NhVENrUUhBUU5JQnNTWVlnMEZ6bzZKUmNKQVFHQWdBRVRHeUFPcHo4UkdoRVJHaEY4R2hZVEpBNFFEUWdZR2cwakVSTVVBWGZrQ3hnVERCMG00d0FBQWdDZy8yd0RZQUxzQUJJQUdnQWhRQjRBQUFBREFnQURXUUFDQVFFQ1RRQUNBZ0ZSQUFFQ0FVVVRGamtRQkJJckFDQUdGUlFlQXhjV093RXlQd0VTTlRRQUlpWTBOaklXRkFLUy90ek9SRlZ2TVJBSkRnRU9DVzNiL3VLRVhsNkVYZ0xzenBJMWxYeUpOaEVLQzMwQkRJeVMvczVlaEY1ZWhBQUFBQUVBZ2dCSkE0UUI2QUFkQUJ0QUdCSVJBZ0VBQVVBRkFRQStBQUFCQUdnQUFRRmZFeDhDRUNzQkpnY0dCd2tCTGdFR0J3WVVGd0V3TXhjVkZqSTNBVDRETGdJRGVoRVdBd1ArdVA2MEJoRVFCZ29LQVdFQkFRb2FDUUZlQXdRQ0FRRUNCQUhoRWcwREF2NjFBVWtIQkFVR0NSc0ovcUlCQVFrSkFXSUNCd1lIQ0FZR0FBRUFmd0NMQTRFQ0p3QWhBQjFBR2hZUEFnRUFBVUFGQVFBK0FBQUJBR2dDQVFFQlh5UXVFd01SS3lVQk1DY2pOU1lIQmdjQkRnRVVGaGNlQWpNeU53a0JGak15TmpjK0FpNEJBM2YrbndFQkVoVUVBdjZpQlFVRkJRTUhDQVFPQ1FGSUFVd0tEUVlNQlFNRkFRRUZ3d0ZlQVFFUkRRSUQvcDhGREF3TUJBTUVBZ2tCUy82MkNRVUZBd29KQ2drQUFBRUFBQUFCQUFBTEl5bm9Ydzg4OVFBTEJBQUFBQUFBMGdNcWV3QUFBQURTQXlwN0FDTC9iQU84QXhnQUFBQUlBQUlBQUFBQUFBQUFBUUFBQXhqL2JBQmNCQUFBQUFBQUE3d0FBUUFBQUFBQUFBQUFBQUFBQUFBQUFBVUJkZ0FpQUFBQUFBRlZBQUFENlFBc0JBQUFvQUNDQUg4QUFBQW9BQ2dBS0FGa0FhSUI1QUlzQUFFQUFBQUhBRjhBQlFBQUFBQUFBZ0FtQURRQWJBQUFBSW9KbGdBQUFBQUFBQUFNQUpZQUFRQUFBQUFBQVFBSUFBQUFBUUFBQUFBQUFnQUdBQWdBQVFBQUFBQUFBd0FrQUE0QUFRQUFBQUFBQkFBSUFESUFBUUFBQUFBQUJRQkdBRG9BQVFBQUFBQUFCZ0FJQUlBQUF3QUJCQWtBQVFBUUFJZ0FBd0FCQkFrQUFnQU1BSmdBQXdBQkJBa0FBd0JJQUtRQUF3QUJCQWtBQkFBUUFPd0FBd0FCQkFrQUJRQ01BUHdBQXdBQkJBa0FCZ0FRQVlocFkyOXVabTl1ZEUxbFpHbDFiVVp2Ym5SR2IzSm5aU0F5TGpBZ09pQnBZMjl1Wm05dWRDQTZJREkyTFRndE1qQXhOV2xqYjI1bWIyNTBWbVZ5YzJsdmJpQXhMakFnT3lCMGRHWmhkWFJ2YUdsdWRDQW9kakF1T1RRcElDMXNJRGdnTFhJZ05UQWdMVWNnTWpBd0lDMTRJREUwSUMxM0lDSkhJaUF0WmlBdGMybGpiMjVtYjI1MEFHa0FZd0J2QUc0QVpnQnZBRzRBZEFCTkFHVUFaQUJwQUhVQWJRQkdBRzhBYmdCMEFFWUFid0J5QUdjQVpRQWdBRElBTGdBd0FDQUFPZ0FnQUdrQVl3QnZBRzRBWmdCdkFHNEFkQUFnQURvQUlBQXlBRFlBTFFBNEFDMEFNZ0F3QURFQU5RQnBBR01BYndCdUFHWUFid0J1QUhRQVZnQmxBSElBY3dCcEFHOEFiZ0FnQURFQUxnQXdBQ0FBT3dBZ0FIUUFkQUJtQUdFQWRRQjBBRzhBYUFCcEFHNEFkQUFnQUNnQWRnQXdBQzRBT1FBMEFDa0FJQUF0QUd3QUlBQTRBQ0FBTFFCeUFDQUFOUUF3QUNBQUxRQkhBQ0FBTWdBd0FEQUFJQUF0QUhnQUlBQXhBRFFBSUFBdEFIY0FJQUFpQUVjQUlnQWdBQzBBWmdBZ0FDMEFjd0JwQUdNQWJ3QnVBR1lBYndCdUFIUUFBQUFDQUFBQUFBQUEvNE1BTWdBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBY0FBQUFCQUFJQVd3RUNBUU1CQkFkMWJtbEZOalV3QjNWdWFVVTJOakVIZFc1cFJUWkVSUUFCQUFILy93QVBBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQXlBRElER1AvaEF4ai9iQU1ZLytFREdQOXNzQUFzc0NCZ1ppMndBU3dnWkNDd3dGQ3dCQ1phc0FSRlcxZ2hJeUViaWxnZ3NGQlFXQ0d3UUZrYklMQTRVRmdoc0RoWldTQ3dDa1ZoWkxBb1VGZ2hzQXBGSUxBd1VGZ2hzREJaR3lDd3dGQllJR1lnaW9waElMQUtVRmhnR3lDd0lGQllJYkFLWUJzZ3NEWlFXQ0d3Tm1BYllGbFpXUnV3QUN0WldTT3dBRkJZWlZsWkxiQUNMQ0JGSUxBRUpXRmtJTEFGUTFCWXNBVWpRckFHSTBJYklTRlpzQUZnTGJBRExDTWhJeUVnWkxFRllrSWdzQVlqUXJJS0FBSXFJU0N3QmtNZ2lpQ0tzQUFyc1RBRkpZcFJXR0JRRzJGU1dWZ2pXU0Vnc0VCVFdMQUFLeHNoc0VCWkk3QUFVRmhsV1Myd0JDeXdDQ05Dc0FjalFyQUFJMEt3QUVPd0IwTlJXTEFJUXl1eUFBRUFRMkJDc0JabEhGa3RzQVVzc0FCRElFVWdzQUpGWTdBQlJXSmdSQzJ3Qml5d0FFTWdSU0N3QUNzanNRUUVKV0FnUllvallTQmtJTEFnVUZnaHNBQWJzREJRV0xBZ0c3QkFXVmtqc0FCUVdHVlpzQU1sSTJGRVJDMndCeXl4QlFWRnNBRmhSQzJ3Q0N5d0FXQWdJTEFLUTBxd0FGQllJTEFLSTBKWnNBdERTckFBVWxnZ3NBc2pRbGt0c0Frc0lMZ0VBR0lndUFRQVk0b2pZYkFNUTJBZ2ltQWdzQXdqUWlNdHNBb3NTMVJZc1FjQlJGa2tzQTFsSTNndHNBc3NTMUZZUzFOWXNRY0JSRmtiSVZra3NCTmxJM2d0c0F3c3NRQU5RMVZZc1EwTlE3QUJZVUt3Q1N0WnNBQkRzQUlsUXJJQUFRQkRZRUt4Q2dJbFFyRUxBaVZDc0FFV0l5Q3dBeVZRV0xBQVE3QUVKVUtLaWlDS0kyR3dDQ29oSTdBQllTQ0tJMkd3Q0NvaEc3QUFRN0FDSlVLd0FpVmhzQWdxSVZtd0NrTkhzQXREUjJDd2dHSWdzQUpGWTdBQlJXSmdzUUFBRXlORXNBRkRzQUErc2dFQkFVTmdRaTJ3RFN5eEFBVkZWRmdBc0EwalFpQmdzQUZodFE0T0FRQU1BRUpDaW1DeERBUXJzR3NyR3lKWkxiQU9MTEVBRFNzdHNBOHNzUUVOS3kyd0VDeXhBZzByTGJBUkxMRUREU3N0c0JJc3NRUU5LeTJ3RXl5eEJRMHJMYkFVTExFR0RTc3RzQlVzc1FjTkt5MndGaXl4Q0EwckxiQVhMTEVKRFNzdHNCZ3NzQWNyc1FBRlJWUllBTEFOSTBJZ1lMQUJZYlVPRGdFQURBQkNRb3Bnc1F3RUs3QnJLeHNpV1Myd0dTeXhBQmdyTGJBYUxMRUJHQ3N0c0Jzc3NRSVlLeTJ3SEN5eEF4Z3JMYkFkTExFRUdDc3RzQjRzc1FVWUt5MndIeXl4QmhnckxiQWdMTEVIR0NzdHNDRXNzUWdZS3kyd0lpeXhDUmdyTGJBakxDQmdzQTVnSUVNanNBRmdRN0FDSmJBQ0pWRllJeUE4c0FGZ0k3QVNaUndiSVNGWkxiQWtMTEFqSzdBaktpMndKU3dnSUVjZ0lMQUNSV093QVVWaVlDTmhPQ01naWxWWUlFY2dJTEFDUldPd0FVVmlZQ05oT0JzaFdTMndKaXl4QUFWRlZGZ0FzQUVXc0NVcXNBRVZNQnNpV1Myd0p5eXdCeXV4QUFWRlZGZ0FzQUVXc0NVcXNBRVZNQnNpV1Myd0tDd2dOYkFCWUMyd0tTd0FzQU5GWTdBQlJXS3dBQ3V3QWtWanNBRkZZckFBSzdBQUZyUUFBQUFBQUVRK0l6aXhLQUVWS2kyd0tpd2dQQ0JISUxBQ1JXT3dBVVZpWUxBQVEyRTRMYkFyTEM0WFBDMndMQ3dnUENCSElMQUNSV093QVVWaVlMQUFRMkd3QVVOak9DMndMU3l4QWdBV0pTQXVJRWV3QUNOQ3NBSWxTWXFLUnlOSEkyRWdXR0liSVZtd0FTTkNzaXdCQVJVVUtpMndMaXl3QUJhd0JDV3dCQ1ZISTBjalliQUdSU3RsaWk0aklDQThpamd0c0M4c3NBQVdzQVFsc0FRbElDNUhJMGNqWVNDd0JDTkNzQVpGS3lDd1lGQllJTEJBVVZpekFpQURJQnV6QWlZREdsbENRaU1nc0FsRElJb2pSeU5ISTJFalJtQ3dCRU93Z0dKZ0lMQUFLeUNLaW1FZ3NBSkRZR1Fqc0FORFlXUlFXTEFDUTJFYnNBTkRZRm13QXlXd2dHSmhJeUFnc0FRbUkwWmhPQnNqc0FsRFJyQUNKYkFKUTBjalJ5TmhZQ0N3QkVPd2dHSmdJeUN3QUNzanNBUkRZTEFBSzdBRkpXR3dCU1d3Z0dLd0JDWmhJTEFFSldCa0k3QURKV0JrVUZnaEd5TWhXU01nSUxBRUppTkdZVGhaTGJBd0xMQUFGaUFnSUxBRkppQXVSeU5ISTJFalBEZ3RzREVzc0FBV0lMQUpJMElnSUNCR0kwZXdBQ3NqWVRndHNESXNzQUFXc0FNbHNBSWxSeU5ISTJHd0FGUllMaUE4SXlFYnNBSWxzQUlsUnlOSEkyRWdzQVVsc0FRbFJ5TkhJMkd3QmlXd0JTVkpzQUlsWWJBQlJXTWpJRmhpR3lGWlk3QUJSV0pnSXk0aklDQThpamdqSVZrdHNETXNzQUFXSUxBSlF5QXVSeU5ISTJFZ1lMQWdZR2F3Z0dJaklDQThpamd0c0RRc0l5QXVSckFDSlVaU1dDQThXUzZ4SkFFVUt5MndOU3dqSUM1R3NBSWxSbEJZSUR4WkxyRWtBUlFyTGJBMkxDTWdMa2F3QWlWR1VsZ2dQRmtqSUM1R3NBSWxSbEJZSUR4WkxyRWtBUlFyTGJBM0xMQXVLeU1nTGthd0FpVkdVbGdnUEZrdXNTUUJGQ3N0c0Rnc3NDOHJpaUFnUExBRUkwS0tPQ01nTGthd0FpVkdVbGdnUEZrdXNTUUJGQ3V3QkVNdXNDUXJMYkE1TExBQUZyQUVKYkFFSmlBdVJ5TkhJMkd3QmtVckl5QThJQzRqT0xFa0FSUXJMYkE2TExFSkJDVkNzQUFXc0FRbHNBUWxJQzVISTBjallTQ3dCQ05Dc0FaRkt5Q3dZRkJZSUxCQVVWaXpBaUFESUJ1ekFpWURHbGxDUWlNZ1I3QUVRN0NBWW1BZ3NBQXJJSXFLWVNDd0FrTmdaQ093QTBOaFpGQllzQUpEWVJ1d0EwTmdXYkFESmJDQVltR3dBaVZHWVRnaklEd2pPQnNoSUNCR0kwZXdBQ3NqWVRnaFdiRWtBUlFyTGJBN0xMQXVLeTZ4SkFFVUt5MndQQ3l3THlzaEl5QWdQTEFFSTBJak9MRWtBUlFyc0FSRExyQWtLeTJ3UFN5d0FCVWdSN0FBSTBLeUFBRUJGUlFUTHJBcUtpMndQaXl3QUJVZ1I3QUFJMEt5QUFFQkZSUVRMckFxS2kyd1B5eXhBQUVVRTdBcktpMndRQ3l3TFNvdHNFRXNzQUFXUlNNZ0xpQkdpaU5oT0xFa0FSUXJMYkJDTExBSkkwS3dRU3N0c0VNc3NnQUFPaXN0c0VRc3NnQUJPaXN0c0VVc3NnRUFPaXN0c0VZc3NnRUJPaXN0c0Vjc3NnQUFPeXN0c0Vnc3NnQUJPeXN0c0Vrc3NnRUFPeXN0c0Vvc3NnRUJPeXN0c0Vzc3NnQUFOeXN0c0V3c3NnQUJOeXN0c0Uwc3NnRUFOeXN0c0U0c3NnRUJOeXN0c0U4c3NnQUFPU3N0c0ZBc3NnQUJPU3N0c0ZFc3NnRUFPU3N0c0ZJc3NnRUJPU3N0c0ZNc3NnQUFQQ3N0c0ZRc3NnQUJQQ3N0c0ZVc3NnRUFQQ3N0c0ZZc3NnRUJQQ3N0c0Zjc3NnQUFPQ3N0c0Znc3NnQUJPQ3N0c0Zrc3NnRUFPQ3N0c0Zvc3NnRUJPQ3N0c0Zzc3NEQXJMckVrQVJRckxiQmNMTEF3SzdBMEt5MndYU3l3TUN1d05Tc3RzRjRzc0FBV3NEQXJzRFlyTGJCZkxMQXhLeTZ4SkFFVUt5MndZQ3l3TVN1d05Dc3RzR0Vzc0RFcnNEVXJMYkJpTExBeEs3QTJLeTJ3WXl5d01pc3VzU1FCRkNzdHNHUXNzRElyc0RRckxiQmxMTEF5SzdBMUt5MndaaXl3TWl1d05pc3RzR2Nzc0RNckxyRWtBUlFyTGJCb0xMQXpLN0EwS3kyd2FTeXdNeXV3TlNzdHNHb3NzRE1yc0RZckxiQnJMQ3V3Q0dXd0F5UlFlTEFCRlRBdEFBQkx1QURJVWxpeEFRR09XYmtJQUFnQVl5Q3dBU05FSUxBREkzQ3dEa1VnSUV1NEFBNVJTN0FHVTFwWXNEUWJzQ2haWUdZZ2lsVllzQUlsWWJBQlJXTWpZckFDSTBTekNna0ZCQ3V6Q2dzRkJDdXpEZzhGQkN0WnNnUW9DVVZTUkxNS0RRWUVLN0VHQVVTeEpBR0lVVml3UUloWXNRWURSTEVtQVloUldMZ0VBSWhZc1FZQlJGbFpXVm00QWYrRnNBU05zUVVBUkFBQUFBPT1cXFwiKSBmb3JtYXQoXFxcInRydWV0eXBlXFxcIik7XFxufVxcblxcbi5pY29uZm9udCB7XFxuICBmb250LWZhbWlseTogaWNvbmZvbnQgIWltcG9ydGFudDtcXG4gIGZvbnQtc2l6ZTogMTZweDtcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcbiAgLXdlYmtpdC10ZXh0LXN0cm9rZS13aWR0aDogMC4ycHg7XFxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xcbn1cXG5cXG5bZGF0YS1kcHI9XFxcIjJcXFwiXSAudGFiLWhlYWRlciB7XFxuICBmb250LXNpemU6IDI4cHg7XFxufVxcblxcbltkYXRhLWRwcj1cXFwiM1xcXCJdIC50YWItaGVhZGVyIHtcXG4gIGZvbnQtc2l6ZTogNDJweDtcXG59XFxuXFxuW2RhdGEtZHByPVxcXCIyXFxcIl0gLnRhYmhlYWRlciAuaGwtaWNvbiB7XFxuICBmb250LXNpemU6IDI4cHg7XFxufVxcblxcbltkYXRhLWRwcj1cXFwiM1xcXCJdIC50YWJoZWFkZXIgLmhsLWljb24ge1xcbiAgZm9udC1zaXplOiA0MnB4O1xcbn1cXG5cXG5bZGF0YS1kcHI9XFxcIjJcXFwiXSAudGFiLWhlYWRlciAuZm9sZC10b2dnbGUge1xcbiAgZm9udC1zaXplOiAyOHB4O1xcbn1cXG5cXG5bZGF0YS1kcHI9XFxcIjNcXFwiXSAudGFiLWhlYWRlciAuZm9sZC10b2dnbGUge1xcbiAgZm9udC1zaXplOiA0MnB4O1xcbn1cIixcIi50YWItaGVhZGVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMHJlbTtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGNvbG9yOiAjMzMzOyB9XFxuICAudGFiLWhlYWRlciAuaGVhZGVyLWJhciB7XFxuICAgIGhlaWdodDogMS4xN3JlbTtcXG4gICAgbGluZS1oZWlnaHQ6IDEuMTdyZW07XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIGNvbG9yOiAjOTk5O1xcbiAgICBwYWRkaW5nLWxlZnQ6IDAuNHJlbTsgfVxcbiAgLnRhYi1oZWFkZXIgLmhlYWRlci1ib2R5IHtcXG4gICAgbWFyZ2luLXJpZ2h0OiAxLjA3cmVtO1xcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47IH1cXG4gICAgLnRhYi1oZWFkZXIgLmhlYWRlci1ib2R5Ojotd2Via2l0LXNjcm9sbGJhciB7XFxuICAgICAgd2lkdGg6IDA7XFxuICAgICAgaGVpZ2h0OiAwO1xcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47IH1cXG4gIC50YWItaGVhZGVyIC5mb2xkLXRvZ2dsZSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAwLjU5cmVtO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXG4gICAgcmlnaHQ6IDAuMjlyZW07XFxuICAgIHdpZHRoOiAwLjQ4cmVtO1xcbiAgICBoZWlnaHQ6IDAuNDhyZW07XFxuICAgIGxpbmUtaGVpZ2h0OiAwLjQ4cmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHotaW5kZXg6IDk5O1xcbiAgICBmb250LXNpemU6IDE0cHg7IH1cXG4gIC50YWItaGVhZGVyLnVuZm9sZC1oZWFkZXIge1xcbiAgICBwb3NpdGlvbjogZml4ZWQgIWltcG9ydGFudDtcXG4gICAgdG9wOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICBvdmVyZmxvdzogaGlkZGVuOyB9XFxuXFxuLnRhYmhlYWRlciB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIGhlaWdodDogMS4xN3JlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjE3cmVtOyB9XFxuICAudGFiaGVhZGVyIC50aC1pdGVtIHtcXG4gICAgcGFkZGluZy1sZWZ0OiAwLjcycmVtO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jazsgfVxcbiAgLnRhYmhlYWRlciAuaGwtaWNvbiB7XFxuICAgIHdpZHRoOiAwLjRyZW07XFxuICAgIGhlaWdodDogMC40cmVtO1xcbiAgICBsaW5lLWhlaWdodDogMC40cmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiA1MCU7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xcbiAgICBsZWZ0OiAwLjI0cmVtO1xcbiAgICBmb250LXNpemU6IDE0cHg7IH1cXG5cXG4udW5mb2xkLWhlYWRlciAuaGVhZGVyLWJhciB7XFxuICBkaXNwbGF5OiBibG9jazsgfVxcblxcbi51bmZvbGQtaGVhZGVyIC5mb2xkLXRvZ2dsZSB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKSByb3RhdGUoMTgwZGVnKTsgfVxcblxcbi51bmZvbGQtaGVhZGVyIC5oZWFkZXItYm9keSB7XFxuICBtYXJnaW4tcmlnaHQ6IDA7XFxuICBwYWRkaW5nOiAwLjI0cmVtOyB9XFxuXFxuLnVuZm9sZC1oZWFkZXIgLnRhYmhlYWRlciB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGhlaWdodDogYXV0bzsgfVxcblxcbi51bmZvbGQtaGVhZGVyIC50aC1pdGVtIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBmbG9hdDogbGVmdDtcXG4gIHdpZHRoOiAzMy4zMzMzJTtcXG4gIGhlaWdodDogMS4wMXJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjAxcmVtOyB9XFxuXFxuLnVuZm9sZC1oZWFkZXIgLmhsLWljb24ge1xcbiAgbWFyZ2luLXJpZ2h0OiAwO1xcbiAgcG9zaXRpb246IGFic29sdXRlOyB9XFxuXFxuLnVuZm9sZC1oZWFkZXIudGFiaGVhZGVyLW1hc2sge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC42KTsgfVxcblxcbi50YWJoZWFkZXItbWFzayB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgbGVmdDogMDtcXG4gIHRvcDogMDsgfVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJpY29uZm9udFxcXCI7XFxuICBzcmM6IHVybChcXFwiZGF0YTphcHBsaWNhdGlvbi94LWZvbnQtdHRmO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LEFBRUFBQUFQQUlBQUF3QndSa1pVVFhCRDk4VUFBQUQ4QUFBQUhFOVRMekpYTDF6SUFBQUJHQUFBQUdCamJXRndzNklIYmdBQUFYZ0FBQUZhWTNaMElBeVYvc3dBQUFwUUFBQUFKR1p3WjIwdzk1NlZBQUFLZEFBQUNaWm5ZWE53QUFBQUVBQUFDa2dBQUFBSVoyeDVadXhvUEZJQUFBTFVBQUFFV0dobFlXUUhBNWgzQUFBSExBQUFBRFpvYUdWaEJ6SURjZ0FBQjJRQUFBQWthRzEwZUFzMkFXMEFBQWVJQUFBQUdHeHZZMkVEY0FRZUFBQUhvQUFBQUJCdFlYaHdBU2tLS3dBQUI3QUFBQUFnYm1GdFpRbC8zaGdBQUFmUUFBQUNMbkJ2YzNUbTdmMGJBQUFLQUFBQUFFaHdjbVZ3cGJtK1pnQUFGQXdBQUFDVkFBQUFBUUFBQUFETVBhTFBBQUFBQU5JREtub0FBQUFBMGdNcWV3QUVBL29COUFBRkFBQUNtUUxNQUFBQWp3S1pBc3dBQUFIckFETUJDUUFBQWdBR0F3QUFBQUFBQUFBQUFBRVFBQUFBQUFBQUFBQUFBQUJRWmtWa0FNQUFlT2JlQXl6L0xBQmNBeGdBbEFBQUFBRUFBQUFBQXhnQUFBQUFBQ0FBQVFBQUFBTUFBQUFEQUFBQUhBQUJBQUFBQUFCVUFBTUFBUUFBQUJ3QUJBQTRBQUFBQ2dBSUFBSUFBZ0I0NWxEbVllYmUvLzhBQUFCNDVsRG1ZZWJlLy8vL2l4bTBHYVFaS0FBQkFBQUFBQUFBQUFBQUFBQUFBUVlBQUFFQUFBQUFBQUFBQVFJQUFBQUNBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBTUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFDQUNJQUFBRXlBcW9BQXdBSEFDbEFKZ0FBQUFNQ0FBTlhBQUlCQVFKTEFBSUNBVThFQVFFQ0FVTUFBQWNHQlFRQUF3QURFUVVQS3pNUklSRW5NeEVqSWdFUTdzek1BcXI5VmlJQ1pnQUFBQVVBTFAvaEE3d0RHQUFXQURBQU9nQlNBRjRCZDB1d0UxQllRRW9DQVFBTkRnMEFEbVlBQXc0QkRnTmVBQUVJQ0FGY0VBRUpDQW9HQ1Y0UkFRd0dCQVlNWGdBTEJBdHBEd0VJQUFZTUNBWllBQW9IQlFJRUN3b0VXUklCRGc0TlVRQU5EUW9PUWh0THNCZFFXRUJMQWdFQURRNE5BQTVtQUFNT0FRNERYZ0FCQ0FnQlhCQUJDUWdLQ0FrS1poRUJEQVlFQmd4ZUFBc0VDMmtQQVFnQUJnd0lCbGdBQ2djRkFnUUxDZ1JaRWdFT0RnMVJBQTBOQ2c1Q0cwdXdHRkJZUUV3Q0FRQU5EZzBBRG1ZQUF3NEJEZ05lQUFFSUNBRmNFQUVKQ0FvSUNRcG1FUUVNQmdRR0RBUm1BQXNFQzJrUEFRZ0FCZ3dJQmxnQUNnY0ZBZ1FMQ2dSWkVnRU9EZzFSQUEwTkNnNUNHMEJPQWdFQURRNE5BQTVtQUFNT0FRNERBV1lBQVFnT0FRaGtFQUVKQ0FvSUNRcG1FUUVNQmdRR0RBUm1BQXNFQzJrUEFRZ0FCZ3dJQmxnQUNnY0ZBZ1FMQ2dSWkVnRU9EZzFSQUEwTkNnNUNXVmxaUUNoVFV6czdNakVYRjFOZVUxNWJXRHRTTzFKTFF6YzFNVG95T2hjd0Z6QlJFVEVZRVNnVlFCTVdLd0VHS3dFaURnSWRBU0UxTkNZMU5DNENLd0VWSVFVVkZCWVVEZ0lqQmlZckFTY2hCeXNCSWljaUxnSTlBUmNpQmhRV016STJOQ1lYQmdjT0F4NEJPd1l5TmljdUFTY21Kd0UxTkQ0Q093RXlGaDBCQVJrYkdsTVNKUndTQTVBQkNoZ25Ib1grU2dLaUFSVWZJdzRPSHc0Z0xmNUpMQjBpRkJrWklCTUlkd3dTRWd3TkVoS01DQVlGQ3dRQ0JBOE9KVU5SVUVBa0Z4WUpCUWtGQlFiK3BBVVBHaFc4SHlrQ0h3RU1HU2NhVENrUUhBUU5JQnNTWVlnMEZ6bzZKUmNKQVFHQWdBRVRHeUFPcHo4UkdoRVJHaEY4R2hZVEpBNFFEUWdZR2cwakVSTVVBWGZrQ3hnVERCMG00d0FBQWdDZy8yd0RZQUxzQUJJQUdnQWhRQjRBQUFBREFnQURXUUFDQVFFQ1RRQUNBZ0ZSQUFFQ0FVVVRGamtRQkJJckFDQUdGUlFlQXhjV093RXlQd0VTTlRRQUlpWTBOaklXRkFLUy90ek9SRlZ2TVJBSkRnRU9DVzNiL3VLRVhsNkVYZ0xzenBJMWxYeUpOaEVLQzMwQkRJeVMvczVlaEY1ZWhBQUFBQUVBZ2dCSkE0UUI2QUFkQUJ0QUdCSVJBZ0VBQVVBRkFRQStBQUFCQUdnQUFRRmZFeDhDRUNzQkpnY0dCd2tCTGdFR0J3WVVGd0V3TXhjVkZqSTNBVDRETGdJRGVoRVdBd1ArdVA2MEJoRVFCZ29LQVdFQkFRb2FDUUZlQXdRQ0FRRUNCQUhoRWcwREF2NjFBVWtIQkFVR0NSc0ovcUlCQVFrSkFXSUNCd1lIQ0FZR0FBRUFmd0NMQTRFQ0p3QWhBQjFBR2hZUEFnRUFBVUFGQVFBK0FBQUJBR2dDQVFFQlh5UXVFd01SS3lVQk1DY2pOU1lIQmdjQkRnRVVGaGNlQWpNeU53a0JGak15TmpjK0FpNEJBM2YrbndFQkVoVUVBdjZpQlFVRkJRTUhDQVFPQ1FGSUFVd0tEUVlNQlFNRkFRRUZ3d0ZlQVFFUkRRSUQvcDhGREF3TUJBTUVBZ2tCUy82MkNRVUZBd29KQ2drQUFBRUFBQUFCQUFBTEl5bm9Ydzg4OVFBTEJBQUFBQUFBMGdNcWV3QUFBQURTQXlwN0FDTC9iQU84QXhnQUFBQUlBQUlBQUFBQUFBQUFBUUFBQXhqL2JBQmNCQUFBQUFBQUE3d0FBUUFBQUFBQUFBQUFBQUFBQUFBQUFBVUJkZ0FpQUFBQUFBRlZBQUFENlFBc0JBQUFvQUNDQUg4QUFBQW9BQ2dBS0FGa0FhSUI1QUlzQUFFQUFBQUhBRjhBQlFBQUFBQUFBZ0FtQURRQWJBQUFBSW9KbGdBQUFBQUFBQUFNQUpZQUFRQUFBQUFBQVFBSUFBQUFBUUFBQUFBQUFnQUdBQWdBQVFBQUFBQUFBd0FrQUE0QUFRQUFBQUFBQkFBSUFESUFBUUFBQUFBQUJRQkdBRG9BQVFBQUFBQUFCZ0FJQUlBQUF3QUJCQWtBQVFBUUFJZ0FBd0FCQkFrQUFnQU1BSmdBQXdBQkJBa0FBd0JJQUtRQUF3QUJCQWtBQkFBUUFPd0FBd0FCQkFrQUJRQ01BUHdBQXdBQkJBa0FCZ0FRQVlocFkyOXVabTl1ZEUxbFpHbDFiVVp2Ym5SR2IzSm5aU0F5TGpBZ09pQnBZMjl1Wm05dWRDQTZJREkyTFRndE1qQXhOV2xqYjI1bWIyNTBWbVZ5YzJsdmJpQXhMakFnT3lCMGRHWmhkWFJ2YUdsdWRDQW9kakF1T1RRcElDMXNJRGdnTFhJZ05UQWdMVWNnTWpBd0lDMTRJREUwSUMxM0lDSkhJaUF0WmlBdGMybGpiMjVtYjI1MEFHa0FZd0J2QUc0QVpnQnZBRzRBZEFCTkFHVUFaQUJwQUhVQWJRQkdBRzhBYmdCMEFFWUFid0J5QUdjQVpRQWdBRElBTGdBd0FDQUFPZ0FnQUdrQVl3QnZBRzRBWmdCdkFHNEFkQUFnQURvQUlBQXlBRFlBTFFBNEFDMEFNZ0F3QURFQU5RQnBBR01BYndCdUFHWUFid0J1QUhRQVZnQmxBSElBY3dCcEFHOEFiZ0FnQURFQUxnQXdBQ0FBT3dBZ0FIUUFkQUJtQUdFQWRRQjBBRzhBYUFCcEFHNEFkQUFnQUNnQWRnQXdBQzRBT1FBMEFDa0FJQUF0QUd3QUlBQTRBQ0FBTFFCeUFDQUFOUUF3QUNBQUxRQkhBQ0FBTWdBd0FEQUFJQUF0QUhnQUlBQXhBRFFBSUFBdEFIY0FJQUFpQUVjQUlnQWdBQzBBWmdBZ0FDMEFjd0JwQUdNQWJ3QnVBR1lBYndCdUFIUUFBQUFDQUFBQUFBQUEvNE1BTWdBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBY0FBQUFCQUFJQVd3RUNBUU1CQkFkMWJtbEZOalV3QjNWdWFVVTJOakVIZFc1cFJUWkVSUUFCQUFILy93QVBBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQXlBRElER1AvaEF4ai9iQU1ZLytFREdQOXNzQUFzc0NCZ1ppMndBU3dnWkNDd3dGQ3dCQ1phc0FSRlcxZ2hJeUViaWxnZ3NGQlFXQ0d3UUZrYklMQTRVRmdoc0RoWldTQ3dDa1ZoWkxBb1VGZ2hzQXBGSUxBd1VGZ2hzREJaR3lDd3dGQllJR1lnaW9waElMQUtVRmhnR3lDd0lGQllJYkFLWUJzZ3NEWlFXQ0d3Tm1BYllGbFpXUnV3QUN0WldTT3dBRkJZWlZsWkxiQUNMQ0JGSUxBRUpXRmtJTEFGUTFCWXNBVWpRckFHSTBJYklTRlpzQUZnTGJBRExDTWhJeUVnWkxFRllrSWdzQVlqUXJJS0FBSXFJU0N3QmtNZ2lpQ0tzQUFyc1RBRkpZcFJXR0JRRzJGU1dWZ2pXU0Vnc0VCVFdMQUFLeHNoc0VCWkk3QUFVRmhsV1Myd0JDeXdDQ05Dc0FjalFyQUFJMEt3QUVPd0IwTlJXTEFJUXl1eUFBRUFRMkJDc0JabEhGa3RzQVVzc0FCRElFVWdzQUpGWTdBQlJXSmdSQzJ3Qml5d0FFTWdSU0N3QUNzanNRUUVKV0FnUllvallTQmtJTEFnVUZnaHNBQWJzREJRV0xBZ0c3QkFXVmtqc0FCUVdHVlpzQU1sSTJGRVJDMndCeXl4QlFWRnNBRmhSQzJ3Q0N5d0FXQWdJTEFLUTBxd0FGQllJTEFLSTBKWnNBdERTckFBVWxnZ3NBc2pRbGt0c0Frc0lMZ0VBR0lndUFRQVk0b2pZYkFNUTJBZ2ltQWdzQXdqUWlNdHNBb3NTMVJZc1FjQlJGa2tzQTFsSTNndHNBc3NTMUZZUzFOWXNRY0JSRmtiSVZra3NCTmxJM2d0c0F3c3NRQU5RMVZZc1EwTlE3QUJZVUt3Q1N0WnNBQkRzQUlsUXJJQUFRQkRZRUt4Q2dJbFFyRUxBaVZDc0FFV0l5Q3dBeVZRV0xBQVE3QUVKVUtLaWlDS0kyR3dDQ29oSTdBQllTQ0tJMkd3Q0NvaEc3QUFRN0FDSlVLd0FpVmhzQWdxSVZtd0NrTkhzQXREUjJDd2dHSWdzQUpGWTdBQlJXSmdzUUFBRXlORXNBRkRzQUErc2dFQkFVTmdRaTJ3RFN5eEFBVkZWRmdBc0EwalFpQmdzQUZodFE0T0FRQU1BRUpDaW1DeERBUXJzR3NyR3lKWkxiQU9MTEVBRFNzdHNBOHNzUUVOS3kyd0VDeXhBZzByTGJBUkxMRUREU3N0c0JJc3NRUU5LeTJ3RXl5eEJRMHJMYkFVTExFR0RTc3RzQlVzc1FjTkt5MndGaXl4Q0EwckxiQVhMTEVKRFNzdHNCZ3NzQWNyc1FBRlJWUllBTEFOSTBJZ1lMQUJZYlVPRGdFQURBQkNRb3Bnc1F3RUs3QnJLeHNpV1Myd0dTeXhBQmdyTGJBYUxMRUJHQ3N0c0Jzc3NRSVlLeTJ3SEN5eEF4Z3JMYkFkTExFRUdDc3RzQjRzc1FVWUt5MndIeXl4QmhnckxiQWdMTEVIR0NzdHNDRXNzUWdZS3kyd0lpeXhDUmdyTGJBakxDQmdzQTVnSUVNanNBRmdRN0FDSmJBQ0pWRllJeUE4c0FGZ0k3QVNaUndiSVNGWkxiQWtMTEFqSzdBaktpMndKU3dnSUVjZ0lMQUNSV093QVVWaVlDTmhPQ01naWxWWUlFY2dJTEFDUldPd0FVVmlZQ05oT0JzaFdTMndKaXl4QUFWRlZGZ0FzQUVXc0NVcXNBRVZNQnNpV1Myd0p5eXdCeXV4QUFWRlZGZ0FzQUVXc0NVcXNBRVZNQnNpV1Myd0tDd2dOYkFCWUMyd0tTd0FzQU5GWTdBQlJXS3dBQ3V3QWtWanNBRkZZckFBSzdBQUZyUUFBQUFBQUVRK0l6aXhLQUVWS2kyd0tpd2dQQ0JISUxBQ1JXT3dBVVZpWUxBQVEyRTRMYkFyTEM0WFBDMndMQ3dnUENCSElMQUNSV093QVVWaVlMQUFRMkd3QVVOak9DMndMU3l4QWdBV0pTQXVJRWV3QUNOQ3NBSWxTWXFLUnlOSEkyRWdXR0liSVZtd0FTTkNzaXdCQVJVVUtpMndMaXl3QUJhd0JDV3dCQ1ZISTBjalliQUdSU3RsaWk0aklDQThpamd0c0M4c3NBQVdzQVFsc0FRbElDNUhJMGNqWVNDd0JDTkNzQVpGS3lDd1lGQllJTEJBVVZpekFpQURJQnV6QWlZREdsbENRaU1nc0FsRElJb2pSeU5ISTJFalJtQ3dCRU93Z0dKZ0lMQUFLeUNLaW1FZ3NBSkRZR1Fqc0FORFlXUlFXTEFDUTJFYnNBTkRZRm13QXlXd2dHSmhJeUFnc0FRbUkwWmhPQnNqc0FsRFJyQUNKYkFKUTBjalJ5TmhZQ0N3QkVPd2dHSmdJeUN3QUNzanNBUkRZTEFBSzdBRkpXR3dCU1d3Z0dLd0JDWmhJTEFFSldCa0k3QURKV0JrVUZnaEd5TWhXU01nSUxBRUppTkdZVGhaTGJBd0xMQUFGaUFnSUxBRkppQXVSeU5ISTJFalBEZ3RzREVzc0FBV0lMQUpJMElnSUNCR0kwZXdBQ3NqWVRndHNESXNzQUFXc0FNbHNBSWxSeU5ISTJHd0FGUllMaUE4SXlFYnNBSWxzQUlsUnlOSEkyRWdzQVVsc0FRbFJ5TkhJMkd3QmlXd0JTVkpzQUlsWWJBQlJXTWpJRmhpR3lGWlk3QUJSV0pnSXk0aklDQThpamdqSVZrdHNETXNzQUFXSUxBSlF5QXVSeU5ISTJFZ1lMQWdZR2F3Z0dJaklDQThpamd0c0RRc0l5QXVSckFDSlVaU1dDQThXUzZ4SkFFVUt5MndOU3dqSUM1R3NBSWxSbEJZSUR4WkxyRWtBUlFyTGJBMkxDTWdMa2F3QWlWR1VsZ2dQRmtqSUM1R3NBSWxSbEJZSUR4WkxyRWtBUlFyTGJBM0xMQXVLeU1nTGthd0FpVkdVbGdnUEZrdXNTUUJGQ3N0c0Rnc3NDOHJpaUFnUExBRUkwS0tPQ01nTGthd0FpVkdVbGdnUEZrdXNTUUJGQ3V3QkVNdXNDUXJMYkE1TExBQUZyQUVKYkFFSmlBdVJ5TkhJMkd3QmtVckl5QThJQzRqT0xFa0FSUXJMYkE2TExFSkJDVkNzQUFXc0FRbHNBUWxJQzVISTBjallTQ3dCQ05Dc0FaRkt5Q3dZRkJZSUxCQVVWaXpBaUFESUJ1ekFpWURHbGxDUWlNZ1I3QUVRN0NBWW1BZ3NBQXJJSXFLWVNDd0FrTmdaQ093QTBOaFpGQllzQUpEWVJ1d0EwTmdXYkFESmJDQVltR3dBaVZHWVRnaklEd2pPQnNoSUNCR0kwZXdBQ3NqWVRnaFdiRWtBUlFyTGJBN0xMQXVLeTZ4SkFFVUt5MndQQ3l3THlzaEl5QWdQTEFFSTBJak9MRWtBUlFyc0FSRExyQWtLeTJ3UFN5d0FCVWdSN0FBSTBLeUFBRUJGUlFUTHJBcUtpMndQaXl3QUJVZ1I3QUFJMEt5QUFFQkZSUVRMckFxS2kyd1B5eXhBQUVVRTdBcktpMndRQ3l3TFNvdHNFRXNzQUFXUlNNZ0xpQkdpaU5oT0xFa0FSUXJMYkJDTExBSkkwS3dRU3N0c0VNc3NnQUFPaXN0c0VRc3NnQUJPaXN0c0VVc3NnRUFPaXN0c0VZc3NnRUJPaXN0c0Vjc3NnQUFPeXN0c0Vnc3NnQUJPeXN0c0Vrc3NnRUFPeXN0c0Vvc3NnRUJPeXN0c0Vzc3NnQUFOeXN0c0V3c3NnQUJOeXN0c0Uwc3NnRUFOeXN0c0U0c3NnRUJOeXN0c0U4c3NnQUFPU3N0c0ZBc3NnQUJPU3N0c0ZFc3NnRUFPU3N0c0ZJc3NnRUJPU3N0c0ZNc3NnQUFQQ3N0c0ZRc3NnQUJQQ3N0c0ZVc3NnRUFQQ3N0c0ZZc3NnRUJQQ3N0c0Zjc3NnQUFPQ3N0c0Znc3NnQUJPQ3N0c0Zrc3NnRUFPQ3N0c0Zvc3NnRUJPQ3N0c0Zzc3NEQXJMckVrQVJRckxiQmNMTEF3SzdBMEt5MndYU3l3TUN1d05Tc3RzRjRzc0FBV3NEQXJzRFlyTGJCZkxMQXhLeTZ4SkFFVUt5MndZQ3l3TVN1d05Dc3RzR0Vzc0RFcnNEVXJMYkJpTExBeEs3QTJLeTJ3WXl5d01pc3VzU1FCRkNzdHNHUXNzRElyc0RRckxiQmxMTEF5SzdBMUt5MndaaXl3TWl1d05pc3RzR2Nzc0RNckxyRWtBUlFyTGJCb0xMQXpLN0EwS3kyd2FTeXdNeXV3TlNzdHNHb3NzRE1yc0RZckxiQnJMQ3V3Q0dXd0F5UlFlTEFCRlRBdEFBQkx1QURJVWxpeEFRR09XYmtJQUFnQVl5Q3dBU05FSUxBREkzQ3dEa1VnSUV1NEFBNVJTN0FHVTFwWXNEUWJzQ2haWUdZZ2lsVllzQUlsWWJBQlJXTWpZckFDSTBTekNna0ZCQ3V6Q2dzRkJDdXpEZzhGQkN0WnNnUW9DVVZTUkxNS0RRWUVLN0VHQVVTeEpBR0lVVml3UUloWXNRWURSTEVtQVloUldMZ0VBSWhZc1FZQlJGbFpXVm00QWYrRnNBU05zUVVBUkFBQUFBPT1cXFwiKSBmb3JtYXQoXFxcInRydWV0eXBlXFxcIik7IH1cXG5cXG4uaWNvbmZvbnQge1xcbiAgZm9udC1mYW1pbHk6IGljb25mb250ICFpbXBvcnRhbnQ7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG4gIC13ZWJraXQtdGV4dC1zdHJva2Utd2lkdGg6IDAuMnB4O1xcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTsgfVxcblxcbltkYXRhLWRwcj1cXFwiMlxcXCJdIC50YWItaGVhZGVyIHtcXG4gIGZvbnQtc2l6ZTogMjhweDsgfVxcblxcbltkYXRhLWRwcj1cXFwiM1xcXCJdIC50YWItaGVhZGVyIHtcXG4gIGZvbnQtc2l6ZTogNDJweDsgfVxcblxcbltkYXRhLWRwcj1cXFwiMlxcXCJdIC50YWJoZWFkZXIgLmhsLWljb24ge1xcbiAgZm9udC1zaXplOiAyOHB4OyB9XFxuXFxuW2RhdGEtZHByPVxcXCIzXFxcIl0gLnRhYmhlYWRlciAuaGwtaWNvbiB7XFxuICBmb250LXNpemU6IDQycHg7IH1cXG5cXG5bZGF0YS1kcHI9XFxcIjJcXFwiXSAudGFiLWhlYWRlciAuZm9sZC10b2dnbGUge1xcbiAgZm9udC1zaXplOiAyOHB4OyB9XFxuXFxuW2RhdGEtZHByPVxcXCIzXFxcIl0gLnRhYi1oZWFkZXIgLmZvbGQtdG9nZ2xlIHtcXG4gIGZvbnQtc2l6ZTogNDJweDsgfVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIndlYnBhY2s6Ly9cIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L3Nhc3MtbG9hZGVyP3NvdXJjZU1hcCEuL3NyYy9zdHlsZXMvdGFiaGVhZGVyLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA1MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnJlcXVpcmUoJy4uL3N0eWxlcy9zY3JvbGxlci5zY3NzJylcbnJlcXVpcmUoJ3Njcm9sbGpzJylcblxuLy8gbGliLnNjcm9sbCBldmVudHM6XG4vLyAgLSBzY3JvbGxzdGFydFxuLy8gIC0gc2Nyb2xsaW5nXG4vLyAgLSBwdWxsZG93bmVuZFxuLy8gIC0gcHVsbHVwZW5kXG4vLyAgLSBwdWxsbGVmdGVuZFxuLy8gIC0gcHVsbHJpZ2h0ZW5kXG4vLyAgLSBwdWxsZG93blxuLy8gIC0gcHVsbHVwXG4vLyAgLSBwdWxsbGVmdFxuLy8gIC0gcHVsbHJpZ2h0XG4vLyAgLSBjb250ZW50cmVmcmVzaFxuXG52YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG4vLyBhdHRyczpcbi8vICAtIHNjcm9sbC1kaXJlY2l0b246IG5vbmV8dmVydGljYWx8aG9yaXpvbnRhbCAoZGVmYXVsdCBpcyB2ZXJ0aWNhbClcbi8vICAtIHNob3ctc2Nyb2xsYmFyOiB0cnVlfGZhbHNlIChkZWZhdWx0IGlzIHRydWUpXG5mdW5jdGlvbiBTY3JvbGxlciAoZGF0YSwgbm9kZVR5cGUpIHtcbiAgdmFyIGF0dHJzID0gZGF0YS5hdHRyIHx8IHt9XG4gIHRoaXMuaXRlbXMgPSBbXVxuICB0aGlzLnRvdGFsV2lkdGggPSAwXG4gIHRoaXMuc2Nyb2xsRGlyZWN0aW9uID0gYXR0cnMuc2Nyb2xsRGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnaG9yaXpvbnRhbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiAndmVydGljYWwnXG4gIHRoaXMuc2hvd1Njcm9sbGJhciA9IGF0dHJzLnNob3dTY3JvbGxiYXIgfHwgdHJ1ZVxuICBDb21wb25lbnQuY2FsbCh0aGlzLCBkYXRhLCBub2RlVHlwZSlcbn1cblxuU2Nyb2xsZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21wb25lbnQucHJvdG90eXBlKVxuXG5TY3JvbGxlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKG5vZGVUeXBlKSB7XG4gIHZhciBTY3JvbGwgPSBsaWIuc2Nyb2xsXG4gIHZhciBub2RlID0gQ29tcG9uZW50LnByb3RvdHlwZS5jcmVhdGUuY2FsbCh0aGlzLCBub2RlVHlwZSlcbiAgbm9kZS5jbGFzc0xpc3QuYWRkKCd3ZWV4LWNvbnRhaW5lcicsICdzY3JvbGwtd3JhcCcpXG4gIHRoaXMuc2Nyb2xsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIHRoaXMuc2Nyb2xsRWxlbWVudC5jbGFzc0xpc3QuYWRkKFxuICAgICd3ZWV4LWNvbnRhaW5lcicsXG4gICAgJ3Njcm9sbC1lbGVtZW50JyxcbiAgICB0aGlzLnNjcm9sbERpcmVjdGlvblxuICApXG4gIG5vZGUuYXBwZW5kQ2hpbGQodGhpcy5zY3JvbGxFbGVtZW50KVxuICB0aGlzLnNjcm9sbGVyID0gbmV3IFNjcm9sbCh7XG4gICAgc2Nyb2xsRWxlbWVudDogdGhpcy5zY3JvbGxFbGVtZW50LFxuICAgIGRpcmVjdGlvbjogdGhpcy5zY3JvbGxEaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcgPyAneScgOiAneCdcbiAgfSlcbiAgdGhpcy5zY3JvbGxlci5pbml0KClcbiAgcmV0dXJuIG5vZGVcbn1cblxuU2Nyb2xsZXIucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoZXZ0cykge1xuICBDb21wb25lbnQucHJvdG90eXBlLmJpbmRFdmVudHMuY2FsbCh0aGlzLCBldnRzKVxuICAvLyB0byBlbmFibGUgbGF6eWxvYWQgZm9yIEltYWdlc1xuICB0aGlzLnNjcm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbGluZycsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNvID0gZS5zY3JvbGxPYmpcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ3Njcm9sbCcsIHtcbiAgICAgIG9yaWdpbmFsVHlwZTogJ3Njcm9sbGluZycsXG4gICAgICBzY3JvbGxUb3A6IHNvLmdldFNjcm9sbFRvcCgpLFxuICAgICAgc2Nyb2xsTGVmdDogc28uZ2V0U2Nyb2xsTGVmdCgpXG4gICAgfSwge1xuICAgICAgYnViYmxlczogdHJ1ZVxuICAgIH0pXG4gIH0uYmluZCh0aGlzKSlcbn1cblxuU2Nyb2xsZXIucHJvdG90eXBlLmFwcGVuZENoaWxkID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5kYXRhLmNoaWxkcmVuXG4gIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgdmFyIGNoaWxkID0gY29tcG9uZW50TWFuYWdlci5jcmVhdGVFbGVtZW50KGRhdGEpXG4gIHRoaXMuc2Nyb2xsRWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZC5ub2RlKVxuXG4gIHZhciBjaGlsZFdpZHRoID0gY2hpbGQubm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICB0aGlzLnRvdGFsV2lkdGggKz0gY2hpbGRXaWR0aFxuICAvLyBpZiBkaXJlY3Rpb24gaXMgaG9yaXpvbnRhbCB0aGVuIHRoZSB3aWR0aCBvZiBzY3JvbGxFbGVtZW50XG4gIC8vIHNob3VsZCBiZSBzZXQgbWFudWFsbHkgZHVlIHRvIGZsZXhib3gncyBydWxlIChjaGlsZCBlbGVtZW50c1xuICAvLyB3aWxsIG5vdCBleGNlZWQgYm94J3Mgd2lkdGggYnV0IHRvIHNocmluayB0byBhZGFwdCkuXG4gIGlmICh0aGlzLnNjcm9sbERpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgdGhpcy5zY3JvbGxFbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy50b3RhbFdpZHRoICsgJ3B4J1xuICB9XG5cbiAgLy8gdXBkYXRlIHRoaXMuZGF0YS5jaGlsZHJlblxuICBpZiAoIWNoaWxkcmVuIHx8ICFjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICB0aGlzLmRhdGEuY2hpbGRyZW4gPSBbZGF0YV1cbiAgfSBlbHNlIHtcbiAgICBjaGlsZHJlbi5wdXNoKGRhdGEpXG4gIH1cblxuICB0aGlzLml0ZW1zLnB1c2goY2hpbGQpXG4gIHJldHVybiBjaGlsZFxufVxuXG5TY3JvbGxlci5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKGNoaWxkLCBiZWZvcmUpIHtcbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5kYXRhLmNoaWxkcmVuXG4gIHZhciBpID0gMFxuICB2YXIgaXNBcHBlbmQgPSBmYWxzZVxuXG4gIC8vIHVwZGF0ZSB0aGlzLmRhdGEuY2hpbGRyZW5cbiAgaWYgKCFjaGlsZHJlbiB8fCAhY2hpbGRyZW4ubGVuZ3RoIHx8ICFiZWZvcmUpIHtcbiAgICBpc0FwcGVuZCA9IHRydWVcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoY2hpbGRyZW5baV0ucmVmID09PSBjaGlsZC5kYXRhLnJlZikge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaSA9PT0gbCkge1xuICAgICAgaXNBcHBlbmQgPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgaWYgKGlzQXBwZW5kKSB7XG4gICAgdGhpcy5zY3JvbGxFbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkLm5vZGUpXG4gICAgY2hpbGRyZW4ucHVzaChjaGlsZC5kYXRhKVxuICAgIHRoaXMuaXRlbXMucHVzaChjaGlsZClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNjcm9sbEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLm5vZGUsIGJlZm9yZS5ub2RlKVxuICAgIGNoaWxkcmVuLnNwbGljZShpLCAwLCBjaGlsZC5kYXRhKVxuICAgIHRoaXMuaXRlbXMuc3BsaWNlKGksIDAsIGNoaWxkKVxuICB9XG59XG5cblNjcm9sbGVyLnByb3RvdHlwZS5yZW1vdmVDaGlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5kYXRhLmNoaWxkcmVuXG4gIC8vIHJlbW92ZSBmcm9tIHRoaXMuZGF0YS5jaGlsZHJlblxuICB2YXIgaSA9IDBcbiAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLmdldENvbXBvbmVudE1hbmFnZXIoKVxuICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGNoaWxkcmVuW2ldLnJlZiA9PT0gY2hpbGQuZGF0YS5yZWYpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGkgPCBsKSB7XG4gICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSlcbiAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKGksIDEpXG4gICAgfVxuICB9XG4gIC8vIHJlbW92ZSBmcm9tIGNvbXBvbmVudE1hcCByZWN1cnNpdmVseVxuICBjb21wb25lbnRNYW5hZ2VyLnJlbW92ZUVsZW1lbnRCeVJlZihjaGlsZC5kYXRhLnJlZilcbiAgdGhpcy5zY3JvbGxFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkLm5vZGUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsZXJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9zY3JvbGxlci5qc1xuICoqIG1vZHVsZSBpZCA9IDUxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vc2Nyb2xsZXIuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3Njcm9sbGVyLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3Njcm9sbGVyLnNjc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvc3R5bGVzL3Njcm9sbGVyLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA1MlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuc2Nyb2xsLXdyYXAge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBvdmVyZmxvdzogaGlkZGVuOyB9XFxuXFxuLnNjcm9sbC1lbGVtZW50Lmhvcml6b250YWwge1xcbiAgLXdlYmtpdC1ib3gtb3JpZW50OiBob3Jpem9udGFsO1xcbiAgLXdlYmtpdC1mbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdzsgfVxcblxcbi5zY3JvbGwtZWxlbWVudC52ZXJ0aWNhbCB7XFxuICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xcbiAgLXdlYmtpdC1mbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvc3JjL3N0eWxlcy9zY3JvbGxlci5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0MsZUFBZTtFQUNmLGlCQUFpQixFQUNqQjs7QUFFRDtFQUVJLCtCQUErQjtFQUMvQiw0QkFBNEI7RUFDNUIsb0JBQW9CLEVBQ3JCOztBQUxIO0VBT0ksNkJBQTZCO0VBQzdCLCtCQUErQjtFQUMvQix1QkFBdUIsRUFDeEJcIixcImZpbGVcIjpcInNjcm9sbGVyLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLnNjcm9sbC13cmFwIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG5cXHRvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4uc2Nyb2xsLWVsZW1lbnQge1xcbiAgJi5ob3Jpem9udGFsIHtcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiBob3Jpem9udGFsO1xcbiAgICAtd2Via2l0LWZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICB9XFxuICAmLnZlcnRpY2FsIHtcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcXG4gICAgLXdlYmtpdC1mbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgfVxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJ3ZWJwYWNrOi8vXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vfi9zYXNzLWxvYWRlcj9zb3VyY2VNYXAhLi9zcmMvc3R5bGVzL3Njcm9sbGVyLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA1M1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBBdG9taWMgPSByZXF1aXJlKCcuL2F0b21pYycpXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpXG5cbi8vIGF0dHJzOlxuLy8gICAtIHR5cGU6IHRleHR8cGFzc3dvcmR8dGVsfGVtYWlsfHVybFxuLy8gICAtIHZhbHVlXG4vLyAgIC0gcGxhY2Vob2xkZXJcbi8vICAgLSBkaXNhYmxlZFxuLy8gICAtIGF1dG9mb2N1c1xuZnVuY3Rpb24gSW5wdXQgKGRhdGEpIHtcbiAgdmFyIGF0dHJzID0gZGF0YS5hdHRyIHx8IHt9XG4gIHRoaXMudHlwZSA9IGF0dHJzLnR5cGUgfHwgJ3RleHQnXG4gIHRoaXMudmFsdWUgPSBhdHRycy52YWx1ZVxuICB0aGlzLnBsYWNlaG9sZGVyID0gYXR0cnMucGxhY2Vob2xkZXJcbiAgdGhpcy5hdXRvZm9jdXMgPSBhdHRycy5hdXRvZm9jdXMgJiYgKGF0dHJzLmF1dG9mb2N1cyAhPT0gJ2ZhbHNlJylcbiAgICAgICAgICAgICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgICAgICAgICAgIDogZmFsc2VcbiAgQXRvbWljLmNhbGwodGhpcywgZGF0YSlcbn1cblxuSW5wdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBdG9taWMucHJvdG90eXBlKVxuXG5JbnB1dC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgdmFyIHV1aWQgPSBNYXRoLmZsb29yKDEwMDAwMDAwMDAwMDAwICogTWF0aC5yYW5kb20oKSkgKyBEYXRlLm5vdygpXG4gIHRoaXMuY2xhc3NOYW1lID0gJ3dlZXgtaXB0LScgKyB1dWlkXG4gIHRoaXMuc3R5bGVJZCA9ICd3ZWV4LXN0eWxlLScgKyB1dWlkXG4gIG5vZGUuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzTmFtZSlcbiAgbm9kZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCB0aGlzLnR5cGUpXG4gIG5vZGUudHlwZSA9IHRoaXMudHlwZVxuICAvLyBGb3IgdGhlIGNvbnNpc3RlbmN5IG9mIGlucHV0IGNvbXBvbmVudCdzIHdpZHRoLlxuICAvLyBUaGUgZGF0ZSBhbmQgdGltZSB0eXBlIG9mIGlucHV0IHdpbGwgaGF2ZSBhIGJpZ2dlciB3aWR0aFxuICAvLyB3aGVuIHRoZSAnYm94LXNpemluZycgaXMgbm90IHNldCB0byAnYm9yZGVyLWJveCdcbiAgbm9kZS5jbGFzc0xpc3QuYWRkKCd3ZWV4LWVsZW1lbnQnKVxuICB0aGlzLnZhbHVlICYmIChub2RlLnZhbHVlID0gdGhpcy52YWx1ZSlcbiAgdGhpcy5wbGFjZWhvbGRlciAmJiAobm9kZS5wbGFjZWhvbGRlciA9IHRoaXMucGxhY2Vob2xkZXIpXG4gIHJldHVybiBub2RlXG59XG5cbklucHV0LnByb3RvdHlwZS51cGRhdGVTdHlsZSA9IGZ1bmN0aW9uIChzdHlsZSkge1xuICBBdG9taWMucHJvdG90eXBlLnVwZGF0ZVN0eWxlLmNhbGwodGhpcywgc3R5bGUpXG4gIGlmIChzdHlsZSAmJiBzdHlsZS5wbGFjZWhvbGRlckNvbG9yKSB7XG4gICAgdGhpcy5wbGFjZWhvbGRlckNvbG9yID0gc3R5bGUucGxhY2Vob2xkZXJDb2xvclxuICAgIHRoaXMuc2V0UGxhY2Vob2xkZXJDb2xvcigpXG4gIH1cbn1cblxuSW5wdXQucHJvdG90eXBlLmF0dHIgPSB7XG4gIGRpc2FibGVkOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdGhpcy5ub2RlLmRpc2FibGVkID0gdmFsICYmIHZhbCAhPT0gJ2ZhbHNlJ1xuICAgICAgICAgICAgICAgICAgICA/IHRydWVcbiAgICAgICAgICAgICAgICAgICAgOiBmYWxzZVxuICB9XG59XG5cbklucHV0LnByb3RvdHlwZS5zZXRQbGFjZWhvbGRlckNvbG9yID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMucGxhY2Vob2xkZXJDb2xvcikge1xuICAgIHJldHVyblxuICB9XG4gIHZhciB2ZW5kb3JzID0gW1xuICAgICc6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXInLFxuICAgICc6LW1vei1wbGFjZWhvbGRlcicsXG4gICAgJzo6LW1vei1wbGFjZWhvbGRlcicsXG4gICAgJzotbXMtaW5wdXQtcGxhY2Vob2xkZXInLFxuICAgICc6cGxhY2Vob2xkZXItc2hvd24nXG4gIF1cbiAgdmFyIGNzcyA9ICcnXG4gIHZhciBjc3NSdWxlID0gJ2NvbG9yOiAnICsgdGhpcy5wbGFjZWhvbGRlckNvbG9yICsgJzsnXG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmVuZG9ycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjc3MgKz0gJy4nICsgdGhpcy5jbGFzc05hbWUgKyB2ZW5kb3JzW2ldICsgJ3snXG4gICAgICAgICAgICsgY3NzUnVsZSArICd9J1xuICB9XG4gIHV0aWxzLmFwcGVuZFN0eWxlKGNzcywgdGhpcy5zdHlsZUlkLCB0cnVlKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvaW5wdXQuanNcbiAqKiBtb2R1bGUgaWQgPSA1NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBBdG9taWMgPSByZXF1aXJlKCcuL2NvbXBvbmVudCcpXG52YXIgc2VuZGVyID0gcmVxdWlyZSgnLi4vYnJpZGdlL3NlbmRlcicpXG5cbi8vIGF0dHJzOlxuLy8gICAtIG9wdGlvbnM6IHRoZSBvcHRpb25zIHRvIGJlIGxpc3RlZCwgYXMgYSBhcnJheSBvZiBzdHJpbmdzLlxuLy8gICAtIHNlbGVjdGVkSW5kZXg6IHRoZSBzZWxlY3RlZCBvcHRpb25zJyBpbmRleCBudW1iZXIuXG4vLyAgIC0gZGlzYWJsZWRcbmZ1bmN0aW9uIFNlbGVjdCAoZGF0YSkge1xuICB2YXIgYXR0cnMgPSBkYXRhLmF0dHIgfHwge31cbiAgdGhpcy5vcHRpb25zID0gW11cbiAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMFxuICBBdG9taWMuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG5TZWxlY3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBdG9taWMucHJvdG90eXBlKVxuXG5TZWxlY3QucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKVxuICB2YXIgdXVpZCA9IE1hdGguZmxvb3IoMTAwMDAwMDAwMDAwMDAgKiBNYXRoLnJhbmRvbSgpKSArIERhdGUubm93KClcbiAgdGhpcy5jbGFzc05hbWUgPSAnd2VleC1zbGN0LScgKyB1dWlkXG4gIHRoaXMuc3R5bGVJZCA9ICd3ZWV4LXN0eWxlLScgKyB1dWlkXG4gIG5vZGUuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzTmFtZSlcbiAgLy8gRm9yIHRoZSBjb25zaXN0ZW5jeSBvZiBpbnB1dCBjb21wb25lbnQncyB3aWR0aC5cbiAgLy8gVGhlIGRhdGUgYW5kIHRpbWUgdHlwZSBvZiBpbnB1dCB3aWxsIGhhdmUgYSBiaWdnZXIgd2lkdGhcbiAgLy8gd2hlbiB0aGUgJ2JveC1zaXppbmcnIGlzIG5vdCBzZXQgdG8gJ2JvcmRlci1ib3gnXG4gIG5vZGUuc3R5bGVbJ2JveC1zaXppbmcnXSA9ICdib3JkZXItYm94J1xuICByZXR1cm4gbm9kZVxufVxuXG5TZWxlY3QucHJvdG90eXBlLmF0dHIgPSB7XG4gIGRpc2FibGVkOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdGhpcy5ub2RlLmRpc2FibGVkID0gdmFsICYmIHZhbCAhPT0gJ2ZhbHNlJ1xuICAgICAgICAgICAgICAgICAgICA/IHRydWVcbiAgICAgICAgICAgICAgICAgICAgOiBmYWxzZVxuICB9LFxuICBvcHRpb25zOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5vcHRpb25zID0gdmFsXG4gICAgdGhpcy5ub2RlLmlubmVySFRNTCA9ICcnXG4gICAgdGhpcy5jcmVhdGVPcHRpb25zKHZhbClcbiAgfSxcbiAgc2VsZWN0ZWRJbmRleDogZnVuY3Rpb24gKHZhbCkge1xuICAgIHZhbCA9IHBhcnNlSW50KHZhbClcbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ251bWJlcicgfHwgdmFsICE9PSB2YWwgfHwgdmFsID49IHRoaXMub3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLm5vZGUudmFsdWUgPSB0aGlzLm9wdGlvbnNbdmFsXVxuICB9XG59XG5cblNlbGVjdC5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uIChldnRzKSB7XG4gIHZhciBpc0xpc3RlblRvQ2hhbmdlID0gZmFsc2VcbiAgQXRvbWljLnByb3RvdHlwZS5iaW5kRXZlbnRzLmNhbGwoXG4gICAgICB0aGlzLFxuICAgICAgZXZ0cy5maWx0ZXIoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICB2YXIgcGFzcyA9IHZhbCAhPT0gJ2NoYW5nZSdcbiAgICAgICAgIXBhc3MgJiYgKGlzTGlzdGVuVG9DaGFuZ2UgPSB0cnVlKVxuICAgICAgICByZXR1cm4gcGFzc1xuICAgICAgfSkpXG4gIGlmIChpc0xpc3RlblRvQ2hhbmdlKSB7XG4gICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLmluZGV4ID0gdGhpcy5vcHRpb25zLmluZGV4T2YodGhpcy5ub2RlLnZhbHVlKVxuICAgICAgc2VuZGVyLmZpcmVFdmVudCh0aGlzLmRhdGEucmVmLCAnY2hhbmdlJywgZSlcbiAgICB9LmJpbmQodGhpcykpXG4gIH1cbn1cblxuU2VsZWN0LnByb3RvdHlwZS5jcmVhdGVPcHRpb25zID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgdmFyIG9wdERvYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgb3B0XG4gIGZvciAodmFyIGkgPSAwLCBsID0gb3B0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKVxuICAgIG9wdC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShvcHRzW2ldKSlcbiAgICBvcHREb2MuYXBwZW5kQ2hpbGQob3B0KVxuICB9XG4gIHRoaXMubm9kZS5hcHBlbmRDaGlsZChvcHREb2MpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvc2VsZWN0LmpzXG4gKiogbW9kdWxlIGlkID0gNTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgQXRvbWljID0gcmVxdWlyZSgnLi9hdG9taWMnKVxuXG4vLyBhdHRyczpcbi8vICAgLSB2YWx1ZVxuLy8gICAtIGRpc2FibGVkXG5mdW5jdGlvbiBEYXRlcGlja2VyIChkYXRhKSB7XG4gIEF0b21pYy5jYWxsKHRoaXMsIGRhdGEpXG59XG5cbkRhdGVwaWNrZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBdG9taWMucHJvdG90eXBlKVxuXG5EYXRlcGlja2VyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKVxuICB2YXIgdXVpZCA9IE1hdGguZmxvb3IoMTAwMDAwMDAwMDAwMDAgKiBNYXRoLnJhbmRvbSgpKSArIERhdGUubm93KClcbiAgdGhpcy5jbGFzc05hbWUgPSAnd2VleC1pcHQtJyArIHV1aWRcbiAgdGhpcy5zdHlsZUlkID0gJ3dlZXgtc3R5bGUtJyArIHV1aWRcbiAgbm9kZS5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3NOYW1lKVxuICBub2RlLnNldEF0dHJpYnV0ZSgndHlwZScsICdkYXRlJylcbiAgbm9kZS50eXBlID0gJ2RhdGUnXG4gIC8vIEZvciB0aGUgY29uc2lzdGVuY3kgb2YgaW5wdXQgY29tcG9uZW50J3Mgd2lkdGguXG4gIC8vIFRoZSBkYXRlIGFuZCB0aW1lIHR5cGUgb2YgaW5wdXQgd2lsbCBoYXZlIGEgYmlnZ2VyIHdpZHRoXG4gIC8vIHdoZW4gdGhlICdib3gtc2l6aW5nJyBpcyBub3Qgc2V0IHRvICdib3JkZXItYm94J1xuICBub2RlLmNsYXNzTGlzdC5hZGQoJ3dlZXgtZWxlbWVudCcpXG4gIHJldHVybiBub2RlXG59XG5cbkRhdGVwaWNrZXIucHJvdG90eXBlLmF0dHIgPSB7XG4gIGRpc2FibGVkOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdGhpcy5ub2RlLmRpc2FibGVkID0gdmFsICYmIHZhbCAhPT0gJ2ZhbHNlJ1xuICAgICAgICAgICAgICAgICAgICA/IHRydWVcbiAgICAgICAgICAgICAgICAgICAgOiBmYWxzZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0ZXBpY2tlclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL2RhdGVwaWNrZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA1NlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBBdG9taWMgPSByZXF1aXJlKCcuL2F0b21pYycpXG5cbi8vIGF0dHJzOlxuLy8gICAtIHZhbHVlXG4vLyAgIC0gZGlzYWJsZWRcbmZ1bmN0aW9uIFRpbWVwaWNrZXIgKGRhdGEpIHtcbiAgQXRvbWljLmNhbGwodGhpcywgZGF0YSlcbn1cblxuVGltZXBpY2tlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEF0b21pYy5wcm90b3R5cGUpXG5cblRpbWVwaWNrZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpXG4gIHZhciB1dWlkID0gTWF0aC5mbG9vcigxMDAwMDAwMDAwMDAwMCAqIE1hdGgucmFuZG9tKCkpICsgRGF0ZS5ub3coKVxuICB0aGlzLmNsYXNzTmFtZSA9ICd3ZWV4LWlwdC0nICsgdXVpZFxuICB0aGlzLnN0eWxlSWQgPSAnd2VleC1zdHlsZS0nICsgdXVpZFxuICBub2RlLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc05hbWUpXG4gIG5vZGUuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RpbWUnKVxuICBub2RlLnR5cGUgPSAndGltZSdcbiAgLy8gRm9yIHRoZSBjb25zaXN0ZW5jeSBvZiBpbnB1dCBjb21wb25lbnQncyB3aWR0aC5cbiAgLy8gVGhlIGRhdGUgYW5kIHRpbWUgdHlwZSBvZiBpbnB1dCB3aWxsIGhhdmUgYSBiaWdnZXIgd2lkdGhcbiAgLy8gd2hlbiB0aGUgJ2JveC1zaXppbmcnIGlzIG5vdCBzZXQgdG8gJ2JvcmRlci1ib3gnXG4gIG5vZGUuY2xhc3NMaXN0LmFkZCgnd2VleC1lbGVtZW50JylcbiAgcmV0dXJuIG5vZGVcbn1cblxuVGltZXBpY2tlci5wcm90b3R5cGUuYXR0ciA9IHtcbiAgZGlzYWJsZWQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB0aGlzLm5vZGUuZGlzYWJsZWQgPSB2YWwgJiYgdmFsICE9PSAnZmFsc2UnXG4gICAgICAgICAgICAgICAgICAgID8gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICA6IGZhbHNlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcGlja2VyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvdGltZXBpY2tlci5qc1xuICoqIG1vZHVsZSBpZCA9IDU3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIEF0b21pYyA9IHJlcXVpcmUoJy4vYXRvbWljJylcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcbnJlcXVpcmUoJy4uL3N0eWxlcy92aWRlby5zY3NzJylcblxuLy8gYXR0cnM6XG4vLyAgIC0gYXV0b1BsYXk6IHRydWUgfCBmYWxzZSAoZGVmYXVsdDogZmFsc2UpXG4vLyAgIC0gcGxheVN0YXR1czogcGxheSB8IHBhdXNlIHwgc3RvcFxuLy8gICAtIHNyYzoge3N0cmluZ31cbi8vICAgLSBwb3N0ZXI6IHtzdHJpbmd9XG4vLyAgIC0gbG9vcDogdHJ1ZSB8IGZhbHNlIChkZWZhdWx0OiBmYWxzZSlcbi8vICAgLSBtdXRlZDogdHJ1ZSB8IGZhbHNlIChkZWZhdWx0OiBmYWxzZSlcbi8vIGV2ZW50czpcbi8vICAgLSBzdGFydFxuLy8gICAtIHBhdXNlXG4vLyAgIC0gZmluaXNoXG4vLyAgIC0gZmFpbFxuZnVuY3Rpb24gVmlkZW8gKGRhdGEpIHtcbiAgdmFyIGF1dG9QbGF5ID0gZGF0YS5hdHRyLmF1dG9QbGF5XG4gIHZhciBwbGF5U3RhdHVzID0gZGF0YS5hdHRyLnBsYXlTdGF0dXNcbiAgdGhpcy5hdXRvUGxheSA9IGF1dG9QbGF5ID09PSB0cnVlIHx8IGF1dG9QbGF5ID09PSAndHJ1ZSdcbiAgaWYgKHBsYXlTdGF0dXMgIT09ICdwbGF5J1xuICAgICAgJiYgcGxheVN0YXR1cyAhPT0gJ3N0b3AnXG4gICAgICAmJiBwbGF5U3RhdHVzICE9PSAncGF1c2UnKSB7XG4gICAgdGhpcy5wbGF5U3RhdHVzID0gJ3BhdXNlJ1xuICB9IGVsc2Uge1xuICAgIHRoaXMucGxheVN0YXR1cyA9IHBsYXlTdGF0dXNcbiAgfVxuICBBdG9taWMuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG5WaWRlby5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEF0b21pYy5wcm90b3R5cGUpXG5cblZpZGVvLnByb3RvdHlwZS5hdHRyID0ge1xuICBwbGF5U3RhdHVzOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgaWYgKHZhbCAhPT0gJ3BsYXknICYmIHZhbCAhPT0gJ3N0b3AnICYmIHZhbCAhPT0gJ3BhdXNlJykge1xuICAgICAgdmFsID0gJ3BhdXNlJ1xuICAgIH1cbiAgICBpZiAodGhpcy5wbGF5U3RhdHVzID09PSB2YWwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnBsYXlTdGF0dXMgPSB2YWxcbiAgICB0aGlzLm5vZGUuc2V0QXR0cmlidXRlKCdwbGF5LXN0YXR1cycsIHZhbClcbiAgICB0aGlzW3RoaXMucGxheVN0YXR1c10oKVxuICB9LFxuICBhdXRvUGxheTogZnVuY3Rpb24gKHZhbCkge1xuICAgIC8vIERPIE5PVEhJTkdcbiAgfVxufVxuXG5WaWRlby5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJylcbiAgbm9kZS5jbGFzc0xpc3QuYWRkKCd3ZWV4LXZpZGVvJywgJ3dlZXgtZWxlbWVudCcpXG4gIG5vZGUuY29udHJvbHMgPSB0cnVlXG4gIG5vZGUuYXV0b3BsYXkgPSB0aGlzLmF1dG9QbGF5XG4gIG5vZGUuc2V0QXR0cmlidXRlKCdwbGF5LXN0YXR1cycsIHRoaXMucGxheVN0YXR1cylcbiAgdGhpcy5ub2RlID0gbm9kZVxuICBpZiAodGhpcy5hdXRvUGxheSAmJiB0aGlzLnBsYXlTdGF0dXMgPT09ICdwbGF5Jykge1xuICAgIHRoaXMucGxheSgpXG4gIH1cbiAgcmV0dXJuIG5vZGVcbn1cblxuVmlkZW8ucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoZXZ0cykge1xuICBBdG9taWMucHJvdG90eXBlLmJpbmRFdmVudHMuY2FsbCh0aGlzLCBldnRzKVxuXG4gIC8vIGNvbnZlcnQgdzNjLXZpZGVvIGV2ZW50cyB0byB3ZWV4LXZpZGVvIGV2ZW50cy5cbiAgdmFyIGV2dHNNYXAgPSB7XG4gICAgc3RhcnQ6ICdwbGF5JyxcbiAgICBmaW5pc2g6ICdlbmRlZCcsXG4gICAgZmFpbDogJ2Vycm9yJ1xuICB9XG4gIGZvciAodmFyIGV2dE5hbWUgaW4gZXZ0c01hcCkge1xuICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKGV2dHNNYXBbZXZ0TmFtZV0sIGZ1bmN0aW9uICh0eXBlLCBlKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodHlwZSwgZS5kYXRhKVxuICAgIH0uYmluZCh0aGlzLCBldnROYW1lKSlcbiAgfVxufVxuXG5WaWRlby5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNyYyA9IHRoaXMubm9kZS5nZXRBdHRyaWJ1dGUoJ3NyYycpXG4gIGlmICghc3JjKSB7XG4gICAgc3JjID0gdGhpcy5ub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKVxuICAgIHNyYyAmJiB0aGlzLm5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMpXG4gIH1cbiAgdGhpcy5ub2RlLnBsYXkoKVxufVxuXG5WaWRlby5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMubm9kZS5wYXVzZSgpXG59XG5cblZpZGVvLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLm5vZGUucGF1c2UoKVxuICB0aGlzLm5vZGUuYXV0b3BsYXkgPSBmYWxzZVxuICB0aGlzLm5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIHRoaXMubm9kZS5zcmMpXG4gIHRoaXMubm9kZS5zcmMgPSAnJ1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvdmlkZW8uanNcbiAqKiBtb2R1bGUgaWQgPSA1OFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3ZpZGVvLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi92aWRlby5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi92aWRlby5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3N0eWxlcy92aWRlby5zY3NzXG4gKiogbW9kdWxlIGlkID0gNTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLndlZXgtdmlkZW8ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvc3JjL3N0eWxlcy92aWRlby5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0MsdUJBQXVCLEVBQ3ZCXCIsXCJmaWxlXCI6XCJ2aWRlby5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi53ZWV4LXZpZGVvIHtcXG5cXHRiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJ3ZWJwYWNrOi8vXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vfi9zYXNzLWxvYWRlcj9zb3VyY2VNYXAhLi9zcmMvc3R5bGVzL3ZpZGVvLnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA2MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBBdG9taWMgPSByZXF1aXJlKCcuL2F0b21pYycpXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpXG5yZXF1aXJlKCcuLi9zdHlsZXMvc3dpdGNoLnNjc3MnKVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGNvbG9yOiAnIzY0YmQ2MydcbiAgLCBzZWNvbmRhcnlDb2xvcjogJyNkZmRmZGYnXG4gICwgamFja0NvbG9yOiAnI2ZmZidcbiAgLCBqYWNrU2Vjb25kYXJ5Q29sb3I6IG51bGxcbiAgLCBjbGFzc05hbWU6ICd3ZWV4LXN3aXRjaCdcbiAgLCBkaXNhYmxlZE9wYWNpdHk6IDAuNVxuICAsIHNwZWVkOiAnMC40cydcbiAgLCB3aWR0aDogMTAwXG4gICwgaGVpZ2h0OiA2MFxuICAvLyBpcyB3aWR0aCBhbmQgaGVpZ2h0IHNjYWxhYmxlID9cbiAgLCBzY2FsYWJsZTogZmFsc2Vcbn1cblxuLy8gYXR0cnM6XG4vLyAgIC0gY2hlY2tlZDogaWYgaXMgY2hlY2tlZC5cbi8vICAgLSBkaXNhYmxlZDogaWYgdHJ1ZSwgdGhpcyBjb21wb25lbnQgaXMgbm90IGF2YWlsYWJsZSBmb3IgaW50ZXJhY3Rpb24uXG5mdW5jdGlvbiBTd2l0Y2ggKGRhdGEpIHtcbiAgdGhpcy5vcHRpb25zID0gdXRpbHMuZXh0ZW5kKHt9LCBkZWZhdWx0cylcbiAgdGhpcy5jaGVja2VkID0gZGF0YS5hdHRyLmNoZWNrZWRcbiAgICAgICYmIGRhdGEuYXR0ci5jaGVja2VkICE9PSAnZmFsc2UnID8gdHJ1ZSA6IGZhbHNlXG4gIHRoaXMuZGF0YSA9IGRhdGFcbiAgdGhpcy53aWR0aCA9IHRoaXMub3B0aW9ucy53aWR0aCAqIGRhdGEuc2NhbGVcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLm9wdGlvbnMuaGVpZ2h0ICogZGF0YS5zY2FsZVxuICBBdG9taWMuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG5Td2l0Y2gucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBdG9taWMucHJvdG90eXBlKVxuXG5Td2l0Y2gucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgdGhpcy5qYWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc21hbGwnKVxuICBub2RlLmFwcGVuZENoaWxkKHRoaXMuamFjaylcbiAgbm9kZS5jbGFzc05hbWUgPSB0aGlzLm9wdGlvbnMuY2xhc3NOYW1lXG4gIHRoaXMubm9kZSA9IG5vZGVcbiAgdGhpcy5hdHRyLmRpc2FibGVkLmNhbGwodGhpcywgdGhpcy5kYXRhLmF0dHIuZGlzYWJsZWQpXG4gIHJldHVybiBub2RlXG59XG5cblN3aXRjaC5wcm90b3R5cGUub25BcHBlbmQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2V0U2l6ZSgpXG4gIHRoaXMuc2V0UG9zaXRpb24oKVxufVxuXG5Td2l0Y2gucHJvdG90eXBlLmF0dHIgPSB7XG4gIGRpc2FibGVkOiBmdW5jdGlvbiAodmFsKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IHZhbCAmJiB2YWwgIT09ICdmYWxzZSdcbiAgICAgICAgICAgICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgICAgICAgICAgIDogZmFsc2VcbiAgICB0aGlzLmRpc2FibGVkID8gdGhpcy5kaXNhYmxlKCkgOiB0aGlzLmVuYWJsZSgpXG4gIH1cbn1cblxuU3dpdGNoLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbWluID0gTWF0aC5taW4odGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIHZhciBtYXggPSBNYXRoLm1heCh0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgdGhpcy5ub2RlLnN0eWxlLndpZHRoID0gbWF4ICsgJ3B4J1xuICB0aGlzLm5vZGUuc3R5bGUuaGVpZ2h0ID0gbWluICsgJ3B4J1xuICB0aGlzLm5vZGUuc3R5bGUuYm9yZGVyUmFkaXVzID0gbWluIC8gMiArICdweCdcbiAgdGhpcy5qYWNrLnN0eWxlLndpZHRoXG4gICAgICA9IHRoaXMuamFjay5zdHlsZS5oZWlnaHRcbiAgICAgID0gbWluICsgJ3B4J1xufVxuXG5Td2l0Y2gucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKGNsaWNrZWQpIHtcbiAgdmFyIGNoZWNrZWQgPSB0aGlzLmNoZWNrZWRcbiAgdmFyIG5vZGUgPSB0aGlzLm5vZGVcbiAgdmFyIGphY2sgPSB0aGlzLmphY2tcblxuICBpZiAoY2xpY2tlZCAmJiBjaGVja2VkKSB7XG4gICAgY2hlY2tlZCA9IGZhbHNlXG4gIH0gZWxzZSBpZiAoY2xpY2tlZCAmJiAhY2hlY2tlZCkge1xuICAgIGNoZWNrZWQgPSB0cnVlXG4gIH1cblxuICBpZiAoY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgIHRoaXMuY2hlY2tlZCA9IHRydWVcblxuICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgamFjay5zdHlsZS5sZWZ0ID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSkud2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAtIHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGphY2spLndpZHRoKSArICdweCdcbiAgICB9IGVsc2Uge1xuICAgICAgamFjay5zdHlsZS5sZWZ0ID0gcGFyc2VJbnQobm9kZS5jdXJyZW50U3R5bGVbJ3dpZHRoJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAtIHBhcnNlSW50KGphY2suY3VycmVudFN0eWxlWyd3aWR0aCddKSArICdweCdcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMuY29sb3IgJiYgdGhpcy5jb2xvcml6ZSgpXG4gICAgdGhpcy5zZXRTcGVlZCgpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5jaGVja2VkID0gZmFsc2VcbiAgICBqYWNrLnN0eWxlLmxlZnQgPSAwXG4gICAgbm9kZS5zdHlsZS5ib3hTaGFkb3cgPSAnaW5zZXQgMCAwIDAgMCAnICsgdGhpcy5vcHRpb25zLnNlY29uZGFyeUNvbG9yXG4gICAgbm9kZS5zdHlsZS5ib3JkZXJDb2xvciA9IHRoaXMub3B0aW9ucy5zZWNvbmRhcnlDb2xvclxuICAgIG5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yXG4gICAgICAgID0gKHRoaXMub3B0aW9ucy5zZWNvbmRhcnlDb2xvciAhPT0gZGVmYXVsdHMuc2Vjb25kYXJ5Q29sb3IpXG4gICAgICAgICAgPyB0aGlzLm9wdGlvbnMuc2Vjb25kYXJ5Q29sb3JcbiAgICAgICAgICA6ICcjZmZmJ1xuICAgIGphY2suc3R5bGUuYmFja2dyb3VuZENvbG9yXG4gICAgICAgID0gKHRoaXMub3B0aW9ucy5qYWNrU2Vjb25kYXJ5Q29sb3IgIT09IHRoaXMub3B0aW9ucy5qYWNrQ29sb3IpXG4gICAgICAgICAgPyB0aGlzLm9wdGlvbnMuamFja1NlY29uZGFyeUNvbG9yXG4gICAgICAgICAgOiB0aGlzLm9wdGlvbnMuamFja0NvbG9yXG4gICAgdGhpcy5zZXRTcGVlZCgpXG4gIH1cbn1cblxuU3dpdGNoLnByb3RvdHlwZS5jb2xvcml6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vZGVIZWlnaHQgPSB0aGlzLm5vZGUub2Zmc2V0SGVpZ2h0IC8gMlxuXG4gIHRoaXMubm9kZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLm9wdGlvbnMuY29sb3JcbiAgdGhpcy5ub2RlLnN0eWxlLmJvcmRlckNvbG9yID0gdGhpcy5vcHRpb25zLmNvbG9yXG4gIHRoaXMubm9kZS5zdHlsZS5ib3hTaGFkb3cgPSAnaW5zZXQgMCAwIDAgJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBub2RlSGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICdweCAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHRoaXMub3B0aW9ucy5jb2xvclxuICB0aGlzLmphY2suc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5vcHRpb25zLmphY2tDb2xvclxufVxuXG5Td2l0Y2gucHJvdG90eXBlLnNldFNwZWVkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc3dpdGNoZXJQcm9wID0ge31cbiAgdmFyIGphY2tQcm9wID0ge1xuICAgICAgJ2JhY2tncm91bmQtY29sb3InOiB0aGlzLm9wdGlvbnMuc3BlZWRcbiAgICAgICwgbGVmdDogdGhpcy5vcHRpb25zLnNwZWVkLnJlcGxhY2UoL1thLXpdLywgJycpIC8gMiArICdzJ1xuICAgIH1cblxuICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgc3dpdGNoZXJQcm9wID0ge1xuICAgICAgYm9yZGVyOiB0aGlzLm9wdGlvbnMuc3BlZWRcbiAgICAgICwgJ2JveC1zaGFkb3cnOiB0aGlzLm9wdGlvbnMuc3BlZWRcbiAgICAgICwgJ2JhY2tncm91bmQtY29sb3InOiB0aGlzLm9wdGlvbnMuc3BlZWQucmVwbGFjZSgvW2Etel0vLCAnJykgKiAzICsgJ3MnXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHN3aXRjaGVyUHJvcCA9IHtcbiAgICAgIGJvcmRlcjogdGhpcy5vcHRpb25zLnNwZWVkXG4gICAgICAsICdib3gtc2hhZG93JzogdGhpcy5vcHRpb25zLnNwZWVkXG4gICAgfVxuICB9XG5cbiAgdXRpbHMudHJhbnNpdGlvbml6ZSh0aGlzLm5vZGUsIHN3aXRjaGVyUHJvcClcbiAgdXRpbHMudHJhbnNpdGlvbml6ZSh0aGlzLmphY2ssIGphY2tQcm9wKVxufVxuXG5Td2l0Y2gucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICF0aGlzLmRpc2FibGVkICYmICh0aGlzLmRpc2FibGVkID0gdHJ1ZSlcbiAgdGhpcy5ub2RlLnN0eWxlLm9wYWNpdHkgPSBkZWZhdWx0cy5kaXNhYmxlZE9wYWNpdHlcbiAgdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5nZXRDbGlja0hhbmRsZXIoKSlcbn1cblxuU3dpdGNoLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZGlzYWJsZWQgJiYgKHRoaXMuZGlzYWJsZWQgPSBmYWxzZSlcbiAgdGhpcy5ub2RlLnN0eWxlLm9wYWNpdHkgPSAxXG4gIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZ2V0Q2xpY2tIYW5kbGVyKCkpXG59XG5cblN3aXRjaC5wcm90b3R5cGUuZ2V0Q2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuX2NsaWNrSGFuZGxlcikge1xuICAgIHRoaXMuX2NsaWNrSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhciBwYXJlbnQgPSB0aGlzLm5vZGUucGFyZW50Tm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIC8vIHZhciBsYWJlbFBhcmVudCA9IChwYXJlbnQgPT09ICdsYWJlbCcpID8gZmFsc2UgOiB0cnVlXG4gICAgICB0aGlzLnNldFBvc2l0aW9uKHRydWUpXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ2NoYW5nZScsIHtcbiAgICAgICAgY2hlY2tlZDogdGhpcy5jaGVja2VkXG4gICAgICB9KVxuICAgIH0uYmluZCh0aGlzKVxuICB9XG4gIHJldHVybiB0aGlzLl9jbGlja0hhbmRsZXJcbn1cblxuU3dpdGNoLnByb3RvdHlwZS5zdHlsZVxuICAgID0gdXRpbHMuZXh0ZW5kKE9iamVjdC5jcmVhdGUoQXRvbWljLnByb3RvdHlwZS5zdHlsZSksIHtcblxuICAgICAgd2lkdGg6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2NhbGFibGUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbClcbiAgICAgICAgaWYgKHZhbCAhPT0gdmFsIHx8IHZhbCA8IDApIHsgLy8gTmFOXG4gICAgICAgICAgdmFsID0gdGhpcy5vcHRpb25zLndpZHRoXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53aWR0aCA9IHZhbCAqIHRoaXMuZGF0YS5zY2FsZVxuICAgICAgICB0aGlzLnNldFNpemUoKVxuICAgICAgfSxcblxuICAgICAgaGVpZ2h0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNjYWxhYmxlKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdmFsID0gcGFyc2VGbG9hdCh2YWwpXG4gICAgICAgIGlmICh2YWwgIT09IHZhbCB8fCB2YWwgPCAwKSB7IC8vIE5hTlxuICAgICAgICAgIHZhbCA9IHRoaXMub3B0aW9ucy5oZWlnaHRcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlaWdodCA9IHZhbCAqIHRoaXMuZGF0YS5zY2FsZVxuICAgICAgICB0aGlzLnNldFNpemUoKVxuICAgICAgfVxuXG4gICAgfSlcblxubW9kdWxlLmV4cG9ydHMgPSBTd2l0Y2hcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9zd2l0Y2guanNcbiAqKiBtb2R1bGUgaWQgPSA2MVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3N3aXRjaC5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vc3dpdGNoLnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3N3aXRjaC5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3N0eWxlcy9zd2l0Y2guc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDYyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi8qIHN3aXRjaCBkZWZhdWx0cy4gKi9cXG4ud2VleC1zd2l0Y2gge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZmRmZGY7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcbiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xcbiAgYmFja2dyb3VuZC1jbGlwOiBjb250ZW50LWJveDsgfVxcblxcbi53ZWV4LXN3aXRjaCA+IHNtYWxsIHtcXG4gIGJhY2tncm91bmQ6ICNmZmY7XFxuICBib3JkZXItcmFkaXVzOiAxMDAlO1xcbiAgYm94LXNoYWRvdzogMCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgMC40KTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9zcmMvc3JjL3N0eWxlcy9zd2l0Y2guc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxzQkFBc0I7QUFFdEI7RUFDRSx1QkFBdUI7RUFDdkIsMEJBQTBCO0VBQzFCLGdCQUFnQjtFQUNoQixzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLHVCQUF1QjtFQUV2Qix1QkFBdUI7RUFDdkIseUJBQXlCO0VBQ3pCLDBCQUEwQjtFQUMxQixzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLHdCQUF3QjtFQUN4Qiw2QkFBNkIsRUFDOUI7O0FBRUQ7RUFDRSxpQkFBaUI7RUFDakIsb0JBQW9CO0VBQ3BCLHlDQUEwQjtFQUMxQixtQkFBbUI7RUFDbkIsT0FBTyxFQUNSXCIsXCJmaWxlXCI6XCJzd2l0Y2guc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBzd2l0Y2ggZGVmYXVsdHMuICovXFxuXFxuLndlZXgtc3dpdGNoIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZGZkZmRmO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXG5cXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcXG4gIGJhY2tncm91bmQtY2xpcDogY29udGVudC1ib3g7XFxufVxcblxcbi53ZWV4LXN3aXRjaCA+IHNtYWxsIHtcXG4gIGJhY2tncm91bmQ6ICNmZmY7XFxuICBib3JkZXItcmFkaXVzOiAxMDAlO1xcbiAgYm94LXNoYWRvdzogMCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgMC40KTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwid2VicGFjazovL1wifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vc2Fzcy1sb2FkZXI/c291cmNlTWFwIS4vc3JjL3N0eWxlcy9zd2l0Y2guc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDYzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcblxuLy8gYXR0cnM6XG4vLyAgIC0gaHJlZlxuZnVuY3Rpb24gQSAoZGF0YSkge1xuICBDb21wb25lbnQuY2FsbCh0aGlzLCBkYXRhKVxufVxuXG5BLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50LnByb3RvdHlwZSlcblxuQS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICBub2RlLmNsYXNzTGlzdC5hZGQoJ3dlZXgtY29udGFpbmVyJylcbiAgdGhpcy5ub2RlID0gbm9kZVxuICB0aGlzLnN0eWxlLmFsaWduSXRlbXMuY2FsbCh0aGlzLCAnY2VudGVyJylcbiAgdGhpcy5zdHlsZS5qdXN0aWZ5Q29udGVudC5jYWxsKHRoaXMsICdjZW50ZXInKVxuICB0aGlzLm5vZGUuc3R5bGUudGV4dERlY29yYXRpb24gPSAnbm9uZSdcbiAgcmV0dXJuIG5vZGVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvYS5qc1xuICoqIG1vZHVsZSBpZCA9IDY0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxudmFyIElEX1BSRUZJWCA9ICd3ZWV4X2VtYmVkXydcblxuZnVuY3Rpb24gX2dlbmVyYXRlSWQoKSB7XG4gIHJldHVybiBJRF9QUkVGSVggKyB1dGlscy5nZXRSYW5kb20oMTApXG59XG5cbmZ1bmN0aW9uIEVtYmVkIChkYXRhLCBub2RlVHlwZSkge1xuICB2YXIgYXR0ciA9IGRhdGEuYXR0clxuICBpZiAoYXR0cikge1xuICAgIHRoaXMuc291cmNlID0gYXR0ci5zcmNcbiAgICB0aGlzLmxvYWRlciA9IGF0dHIubG9hZGUgfHwgJ3hocidcbiAgfVxuICBDb21wb25lbnQuY2FsbCh0aGlzLCBkYXRhLCBub2RlVHlwZSlcbiAgdGhpcy5pbml0V2VleCgpXG59XG5cbkVtYmVkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50LnByb3RvdHlwZSlcblxuRW1iZWQucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIG5vZGUuaWQgPSB0aGlzLmlkXG4gIG5vZGUuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJ1xuICAvLyBub2RlLmNsYXNzTGlzdC5hZGQoJ3dlZXgtY29udGFpbmVyJylcbiAgcmV0dXJuIG5vZGVcbn1cblxuRW1iZWQucHJvdG90eXBlLmluaXRXZWV4ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmlkID0gX2dlbmVyYXRlSWQoKVxuICB0aGlzLm5vZGUuaWQgPSB0aGlzLmlkXG4gIHZhciBjb25maWcgPSB7XG4gICAgYXBwSWQ6IHRoaXMuaWQsXG4gICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICBsb2FkZXI6IHRoaXMubG9hZGVyLFxuICAgIHdpZHRoOiB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXG4gICAgcm9vdElkOiB0aGlzLmlkXG4gIH1cbiAgd2luZG93LndlZXguaW5pdChjb25maWcpXG59XG5cbkVtYmVkLnByb3RvdHlwZS5kZXN0cm95V2VleCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pZCAmJiB3aW5kb3cuZGVzdHJveUluc3RhbmNlKHRoaXMuaWQpXG4gIC8vIFRPRE86IHVuYmluZCBldmVudHMgYW5kIGNsZWFyIGRvbXMuXG4gIHRoaXMubm9kZS5pbm5lckhUTUwgPSAnJ1xufVxuXG5FbWJlZC5wcm90b3R5cGUucmVsb2FkV2VleCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5kZXN0cm95V2VleCgpXG4gIHRoaXMuaW5pdFdlZXgoKVxufVxuXG4vLyBzcmMgaXMgbm90IHVwZGF0YWJsZSB0ZW1wb3JhcmlseVxuLy8gRW1iZWQucHJvdG90eXBlLmF0dHIgPSB7XG4vLyAgIHNyYzogZnVuY3Rpb24gKHZhbHVlKSB7XG4vLyAgICAgdGhpcy5zcmMgPSB2YWx1ZVxuLy8gICAgIHRoaXMucmVsb2FkV2VleCgpXG4vLyAgIH1cbi8vIH1cblxubW9kdWxlLmV4cG9ydHMgPSBFbWJlZFxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL2VtYmVkLmpzXG4gKiogbW9kdWxlIGlkID0gNjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBkb20gPSByZXF1aXJlKCcuL2RvbScpXG52YXIgZXZlbnQgPSByZXF1aXJlKCcuL2V2ZW50JylcbnZhciBwYWdlSW5mbyA9IHJlcXVpcmUoJy4vcGFnZUluZm8nKVxudmFyIHN0cmVhbSA9IHJlcXVpcmUoJy4vc3RyZWFtJylcbnZhciBtb2RhbCA9IHJlcXVpcmUoJy4vbW9kYWwnKVxudmFyIGFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uJylcblxudmFyIGFwaSA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKFdlZXgpIHtcbiAgICBXZWV4LnJlZ2lzdGVyQXBpTW9kdWxlKCdkb20nLCBkb20sIGRvbS5fbWV0YSlcbiAgICBXZWV4LnJlZ2lzdGVyQXBpTW9kdWxlKCdldmVudCcsIGV2ZW50LCBldmVudC5fbWV0YSlcbiAgICBXZWV4LnJlZ2lzdGVyQXBpTW9kdWxlKCdwYWdlSW5mbycsIHBhZ2VJbmZvLCBwYWdlSW5mby5fbWV0YSlcbiAgICBXZWV4LnJlZ2lzdGVyQXBpTW9kdWxlKCdzdHJlYW0nLCBzdHJlYW0sIHN0cmVhbS5fbWV0YSlcbiAgICBXZWV4LnJlZ2lzdGVyQXBpTW9kdWxlKCdtb2RhbCcsIG1vZGFsLCBtb2RhbC5fbWV0YSlcbiAgICBXZWV4LnJlZ2lzdGVyQXBpTW9kdWxlKCdhbmltYXRpb24nLCBhbmltYXRpb24sIGFuaW1hdGlvbi5fbWV0YSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwaVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBpL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gNjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbWVzc2FnZVF1ZXVlID0gcmVxdWlyZSgnLi4vbWVzc2FnZVF1ZXVlJylcbnZhciBGcmFtZVVwZGF0ZXIgPSByZXF1aXJlKCcuLi9mcmFtZVVwZGF0ZXInKVxudmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvY29tcG9uZW50JylcbnZhciBzY3JvbGwgPSByZXF1aXJlKCdzY3JvbGwtdG8nKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG4vLyB2YXIgV2VleCA9IHJlcXVpcmUoJy4uL3dlZXgnKVxuXG52YXIgZG9tID0ge1xuXG4gIC8qKlxuICAgKiBjcmVhdGVCb2R5OiBjcmVhdGUgcm9vdCBjb21wb25lbnRcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlbGVtZW50XG4gICAqICAgIGNvbnRhaW5lcnxsaXN0dmlld3xzY3JvbGx2aWV3XG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBjcmVhdGVCb2R5OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICBlbGVtZW50LnNjYWxlID0gdGhpcy5zY2FsZVxuICAgIGVsZW1lbnQuaW5zdGFuY2VJZCA9IGNvbXBvbmVudE1hbmFnZXIuaW5zdGFuY2VJZFxuICAgIHJldHVybiBjb21wb25lbnRNYW5hZ2VyLmNyZWF0ZUJvZHkoZWxlbWVudClcbiAgfSxcblxuICBhZGRFbGVtZW50OiBmdW5jdGlvbiAocGFyZW50UmVmLCBlbGVtZW50LCBpbmRleCkge1xuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICBlbGVtZW50LnNjYWxlID0gdGhpcy5zY2FsZVxuICAgIGVsZW1lbnQuaW5zdGFuY2VJZCA9IGNvbXBvbmVudE1hbmFnZXIuaW5zdGFuY2VJZFxuICAgIHJldHVybiBjb21wb25lbnRNYW5hZ2VyLmFkZEVsZW1lbnQocGFyZW50UmVmLCBlbGVtZW50LCBpbmRleClcbiAgfSxcblxuICByZW1vdmVFbGVtZW50OiBmdW5jdGlvbiAocmVmKSB7XG4gICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLmdldENvbXBvbmVudE1hbmFnZXIoKVxuICAgIHJldHVybiBjb21wb25lbnRNYW5hZ2VyLnJlbW92ZUVsZW1lbnQocmVmKVxuICB9LFxuXG4gIG1vdmVFbGVtZW50OiBmdW5jdGlvbiAocmVmLCBwYXJlbnRSZWYsIGluZGV4KSB7XG4gICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLmdldENvbXBvbmVudE1hbmFnZXIoKVxuICAgIHJldHVybiBjb21wb25lbnRNYW5hZ2VyLm1vdmVFbGVtZW50KHJlZiwgcGFyZW50UmVmLCBpbmRleClcbiAgfSxcblxuICBhZGRFdmVudDogZnVuY3Rpb24gKHJlZiwgdHlwZSkge1xuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICByZXR1cm4gY29tcG9uZW50TWFuYWdlci5hZGRFdmVudChyZWYsIHR5cGUpXG4gIH0sXG5cbiAgcmVtb3ZlRXZlbnQ6IGZ1bmN0aW9uIChyZWYsIHR5cGUpIHtcbiAgICB2YXIgY29tcG9uZW50TWFuYWdlciA9IHRoaXMuZ2V0Q29tcG9uZW50TWFuYWdlcigpXG4gICAgcmV0dXJuIGNvbXBvbmVudE1hbmFnZXIucmVtb3ZlRXZlbnQocmVmLCB0eXBlKVxuICB9LFxuXG4gIC8qKlxuICAgKiB1cGRhdGVBdHRyczogdXBkYXRlIGF0dHJpYnV0ZXMgb2YgY29tcG9uZW50XG4gICAqIEBwYXJhbSAge3N0cmluZ30gcmVmXG4gICAqIEBwYXJhbSAge29ian0gYXR0clxuICAgKi9cbiAgdXBkYXRlQXR0cnM6IGZ1bmN0aW9uIChyZWYsIGF0dHIpIHtcbiAgICB2YXIgY29tcG9uZW50TWFuYWdlciA9IHRoaXMuZ2V0Q29tcG9uZW50TWFuYWdlcigpXG4gICAgcmV0dXJuIGNvbXBvbmVudE1hbmFnZXIudXBkYXRlQXR0cnMocmVmLCBhdHRyKVxuICB9LFxuXG4gIC8qKlxuICAgKiB1cGRhdGVTdHlsZTogdWRwYXRlIHN0eWxlIG9mIGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVmXG4gICAqIEBwYXJhbSB7b2JqfSBzdHlsZVxuICAgKi9cbiAgdXBkYXRlU3R5bGU6IGZ1bmN0aW9uIChyZWYsIHN0eWxlKSB7XG4gICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLmdldENvbXBvbmVudE1hbmFnZXIoKVxuICAgIHJldHVybiBjb21wb25lbnRNYW5hZ2VyLnVwZGF0ZVN0eWxlKHJlZiwgc3R5bGUpXG4gIH0sXG5cbiAgY3JlYXRlRmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVE9ET1xuICAgIC8vIEZyYW1lVXBkYXRlci5wYXVzZSgpXG4gIH0sXG5cbiAgcmVmcmVzaEZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgIC8vIFRPRE9cbiAgfSxcblxuICAvKipcbiAgICogc2Nyb2xsVG9FbGVtZW50XG4gICAqIEBwYXJhbSAge3N0cmluZ30gcmVmXG4gICAqIEBwYXJhbSAge29ian0gb3B0aW9ucyB7b2Zmc2V0Ok51bWJlcn1cbiAgICogICBwczogc2Nyb2xsLXRvIGhhcyAnZWFzZScgYW5kICdkdXJhdGlvbicobXMpIGFzIG9wdGlvbnMuXG4gICAqL1xuICBzY3JvbGxUb0VsZW1lbnQ6IGZ1bmN0aW9uIChyZWYsIG9wdGlvbnMpIHtcbiAgICAhb3B0aW9ucyAmJiAob3B0aW9ucyA9IHt9KVxuICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKClcbiAgICB2YXIgZWxlbSA9IGNvbXBvbmVudE1hbmFnZXIuZ2V0RWxlbWVudEJ5UmVmKHJlZilcbiAgICBpZiAoZWxlbSkge1xuICAgICAgdmFyIG9mZnNldFRvcCA9IGVsZW0ubm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgICAgICArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXG4gICAgICB2YXIgb2Zmc2V0ID0gKE51bWJlcihvcHRpb25zLm9mZnNldCkgfHwgMCkgKiB0aGlzLnNjYWxlXG4gICAgICB2YXIgdHdlZW4gPSBzY3JvbGwoMCwgb2Zmc2V0VG9wICsgb2Zmc2V0LCBvcHRpb25zKVxuICAgICAgLy8gdHdlZW4ub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIH0pXG4gICAgfVxuICB9XG5cbn1cblxuZG9tLl9tZXRhID0ge1xuICBkb206IFt7XG4gICAgbmFtZTogJ2NyZWF0ZUJvZHknLFxuICAgIGFyZ3M6IFsnb2JqZWN0J11cbiAgfSwge1xuICAgIG5hbWU6ICdhZGRFbGVtZW50JyxcbiAgICBhcmdzOiBbJ3N0cmluZycsICdvYmplY3QnLCAnbnVtYmVyJ11cbiAgfSwge1xuICAgIG5hbWU6ICdyZW1vdmVFbGVtZW50JyxcbiAgICBhcmdzOiBbJ3N0cmluZyddXG4gIH0sIHtcbiAgICBuYW1lOiAnbW92ZUVsZW1lbnQnLFxuICAgIGFyZ3M6IFsnc3RyaW5nJywgJ3N0cmluZycsICdudW1iZXInXVxuICB9LCB7XG4gICAgbmFtZTogJ2FkZEV2ZW50JyxcbiAgICBhcmdzOiBbJ3N0cmluZycsICdzdHJpbmcnXVxuICB9LCB7XG4gICAgbmFtZTogJ3JlbW92ZUV2ZW50JyxcbiAgICBhcmdzOiBbJ3N0cmluZycsICdzdHJpbmcnXVxuICB9LCB7XG4gICAgbmFtZTogJ3VwZGF0ZUF0dHJzJyxcbiAgICBhcmdzOiBbJ3N0cmluZycsICdvYmplY3QnXVxuICB9LCB7XG4gICAgbmFtZTogJ3VwZGF0ZVN0eWxlJyxcbiAgICBhcmdzOiBbJ3N0cmluZycsICdvYmplY3QnXVxuICB9LCB7XG4gICAgbmFtZTogJ2NyZWF0ZUZpbmlzaCcsXG4gICAgYXJnczogW11cbiAgfSwge1xuICAgIG5hbWU6ICdyZWZyZXNoRmluaXNoJyxcbiAgICBhcmdzOiBbXVxuICB9LCB7XG4gICAgbmFtZTogJ3Njcm9sbFRvRWxlbWVudCcsXG4gICAgYXJnczogWydzdHJpbmcnLCAnb2JqZWN0J11cbiAgfV1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBpL2RvbS5qc1xuICoqIG1vZHVsZSBpZCA9IDY3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIFR3ZWVuID0gcmVxdWlyZSgndHdlZW4nKTtcbnZhciByYWYgPSByZXF1aXJlKCdyYWYnKTtcblxuLyoqXG4gKiBFeHBvc2UgYHNjcm9sbFRvYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNjcm9sbFRvO1xuXG4vKipcbiAqIFNjcm9sbCB0byBgKHgsIHkpYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gc2Nyb2xsVG8oeCwgeSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBzdGFydCBwb3NpdGlvblxuICB2YXIgc3RhcnQgPSBzY3JvbGwoKTtcblxuICAvLyBzZXR1cCB0d2VlblxuICB2YXIgdHdlZW4gPSBUd2VlbihzdGFydClcbiAgICAuZWFzZShvcHRpb25zLmVhc2UgfHwgJ291dC1jaXJjJylcbiAgICAudG8oeyB0b3A6IHksIGxlZnQ6IHggfSlcbiAgICAuZHVyYXRpb24ob3B0aW9ucy5kdXJhdGlvbiB8fCAxMDAwKTtcblxuICAvLyBzY3JvbGxcbiAgdHdlZW4udXBkYXRlKGZ1bmN0aW9uKG8pe1xuICAgIHdpbmRvdy5zY3JvbGxUbyhvLmxlZnQgfCAwLCBvLnRvcCB8IDApO1xuICB9KTtcblxuICAvLyBoYW5kbGUgZW5kXG4gIHR3ZWVuLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIGFuaW1hdGUgPSBmdW5jdGlvbigpe307XG4gIH0pO1xuXG4gIC8vIGFuaW1hdGVcbiAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICByYWYoYW5pbWF0ZSk7XG4gICAgdHdlZW4udXBkYXRlKCk7XG4gIH1cblxuICBhbmltYXRlKCk7XG4gIFxuICByZXR1cm4gdHdlZW47XG59XG5cbi8qKlxuICogUmV0dXJuIHNjcm9sbCBwb3NpdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzY3JvbGwoKSB7XG4gIHZhciB5ID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gIHZhciB4ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICByZXR1cm4geyB0b3A6IHksIGxlZnQ6IHggfTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3Njcm9sbC10by9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDY4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJ2VtaXR0ZXInKTtcbnZhciBjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG52YXIgdHlwZSA9IHJlcXVpcmUoJ3R5cGUnKTtcbnZhciBlYXNlID0gcmVxdWlyZSgnZWFzZScpO1xuXG4vKipcbiAqIEV4cG9zZSBgVHdlZW5gLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gVHdlZW47XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgVHdlZW5gIHdpdGggYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9ialxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBUd2VlbihvYmopIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFR3ZWVuKSkgcmV0dXJuIG5ldyBUd2VlbihvYmopO1xuICB0aGlzLl9mcm9tID0gb2JqO1xuICB0aGlzLmVhc2UoJ2xpbmVhcicpO1xuICB0aGlzLmR1cmF0aW9uKDUwMCk7XG59XG5cbi8qKlxuICogTWl4aW4gZW1pdHRlci5cbiAqL1xuXG5FbWl0dGVyKFR3ZWVuLnByb3RvdHlwZSk7XG5cbi8qKlxuICogUmVzZXQgdGhlIHR3ZWVuLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuVHdlZW4ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5pc0FycmF5ID0gJ2FycmF5JyA9PT0gdHlwZSh0aGlzLl9mcm9tKTtcbiAgdGhpcy5fY3VyciA9IGNsb25lKHRoaXMuX2Zyb20pO1xuICB0aGlzLl9kb25lID0gZmFsc2U7XG4gIHRoaXMuX3N0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFR3ZWVuIHRvIGBvYmpgIGFuZCByZXNldCBpbnRlcm5hbCBzdGF0ZS5cbiAqXG4gKiAgICB0d2Vlbi50byh7IHg6IDUwLCB5OiAxMDAgfSlcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqXG4gKiBAcmV0dXJuIHtUd2Vlbn0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Ud2Vlbi5wcm90b3R5cGUudG8gPSBmdW5jdGlvbihvYmope1xuICB0aGlzLnJlc2V0KCk7XG4gIHRoaXMuX3RvID0gb2JqO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IGR1cmF0aW9uIHRvIGBtc2AgWzUwMF0uXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtUd2Vlbn0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Ud2Vlbi5wcm90b3R5cGUuZHVyYXRpb24gPSBmdW5jdGlvbihtcyl7XG4gIHRoaXMuX2R1cmF0aW9uID0gbXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgZWFzaW5nIGZ1bmN0aW9uIHRvIGBmbmAuXG4gKlxuICogICAgdHdlZW4uZWFzZSgnaW4tb3V0LXNpbmUnKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBmblxuICogQHJldHVybiB7VHdlZW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblR3ZWVuLnByb3RvdHlwZS5lYXNlID0gZnVuY3Rpb24oZm4pe1xuICBmbiA9ICdmdW5jdGlvbicgPT0gdHlwZW9mIGZuID8gZm4gOiBlYXNlW2ZuXTtcbiAgaWYgKCFmbikgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBlYXNpbmcgZnVuY3Rpb24nKTtcbiAgdGhpcy5fZWFzZSA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU3RvcCB0aGUgdHdlZW4gYW5kIGltbWVkaWF0ZWx5IGVtaXQgXCJzdG9wXCIgYW5kIFwiZW5kXCIuXG4gKlxuICogQHJldHVybiB7VHdlZW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblR3ZWVuLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcbiAgdGhpcy5fZG9uZSA9IHRydWU7XG4gIHRoaXMuZW1pdCgnc3RvcCcpO1xuICB0aGlzLmVtaXQoJ2VuZCcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUGVyZm9ybSBhIHN0ZXAuXG4gKlxuICogQHJldHVybiB7VHdlZW59IHNlbGZcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblR3ZWVuLnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuX2RvbmUpIHJldHVybjtcblxuICAvLyBkdXJhdGlvblxuICB2YXIgZHVyYXRpb24gPSB0aGlzLl9kdXJhdGlvbjtcbiAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gIHZhciBkZWx0YSA9IG5vdyAtIHRoaXMuX3N0YXJ0O1xuICB2YXIgZG9uZSA9IGRlbHRhID49IGR1cmF0aW9uO1xuXG4gIC8vIGNvbXBsZXRlXG4gIGlmIChkb25lKSB7XG4gICAgdGhpcy5fZnJvbSA9IHRoaXMuX3RvO1xuICAgIHRoaXMuX3VwZGF0ZSh0aGlzLl90byk7XG4gICAgdGhpcy5fZG9uZSA9IHRydWU7XG4gICAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHR3ZWVuXG4gIHZhciBmcm9tID0gdGhpcy5fZnJvbTtcbiAgdmFyIHRvID0gdGhpcy5fdG87XG4gIHZhciBjdXJyID0gdGhpcy5fY3VycjtcbiAgdmFyIGZuID0gdGhpcy5fZWFzZTtcbiAgdmFyIHAgPSAobm93IC0gdGhpcy5fc3RhcnQpIC8gZHVyYXRpb247XG4gIHZhciBuID0gZm4ocCk7XG5cbiAgLy8gYXJyYXlcbiAgaWYgKHRoaXMuaXNBcnJheSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnJvbS5sZW5ndGg7ICsraSkge1xuICAgICAgY3VycltpXSA9IGZyb21baV0gKyAodG9baV0gLSBmcm9tW2ldKSAqIG47XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlKGN1cnIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gb2JqZWNoXG4gIGZvciAodmFyIGsgaW4gZnJvbSkge1xuICAgIGN1cnJba10gPSBmcm9tW2tdICsgKHRvW2tdIC0gZnJvbVtrXSkgKiBuO1xuICB9XG5cbiAgdGhpcy5fdXBkYXRlKGN1cnIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHVwZGF0ZSBmdW5jdGlvbiB0byBgZm5gIG9yXG4gKiB3aGVuIG5vIGFyZ3VtZW50IGlzIGdpdmVuIHRoaXMgcGVyZm9ybXNcbiAqIGEgXCJzdGVwXCIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1R3ZWVufSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblR3ZWVuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihmbil7XG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLnN0ZXAoKTtcbiAgdGhpcy5fdXBkYXRlID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb21wb25lbnQtdHdlZW4vaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA2OVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgdGhpcy5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA3MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciB0eXBlO1xudHJ5IHtcbiAgdHlwZSA9IHJlcXVpcmUoJ2NvbXBvbmVudC10eXBlJyk7XG59IGNhdGNoIChfKSB7XG4gIHR5cGUgPSByZXF1aXJlKCd0eXBlJyk7XG59XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZTtcblxuLyoqXG4gKiBDbG9uZXMgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBhbnkgb2JqZWN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGNsb25lKG9iail7XG4gIHN3aXRjaCAodHlwZShvYmopKSB7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIHZhciBjb3B5ID0ge307XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGNvcHlba2V5XSA9IGNsb25lKG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvcHk7XG5cbiAgICBjYXNlICdhcnJheSc6XG4gICAgICB2YXIgY29weSA9IG5ldyBBcnJheShvYmoubGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb3B5W2ldID0gY2xvbmUob2JqW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb3B5O1xuXG4gICAgY2FzZSAncmVnZXhwJzpcbiAgICAgIC8vIGZyb20gbWlsbGVybWVkZWlyb3MvYW1kLXV0aWxzIC0gTUlUXG4gICAgICB2YXIgZmxhZ3MgPSAnJztcbiAgICAgIGZsYWdzICs9IG9iai5tdWx0aWxpbmUgPyAnbScgOiAnJztcbiAgICAgIGZsYWdzICs9IG9iai5nbG9iYWwgPyAnZycgOiAnJztcbiAgICAgIGZsYWdzICs9IG9iai5pZ25vcmVDYXNlID8gJ2knIDogJyc7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChvYmouc291cmNlLCBmbGFncyk7XG5cbiAgICBjYXNlICdkYXRlJzpcbiAgICAgIHJldHVybiBuZXcgRGF0ZShvYmouZ2V0VGltZSgpKTtcblxuICAgIGRlZmF1bHQ6IC8vIHN0cmluZywgbnVtYmVyLCBib29sZWFuLCDigKZcbiAgICAgIHJldHVybiBvYmo7XG4gIH1cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvbXBvbmVudC1jbG9uZS9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDcxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOiByZXR1cm4gJ2RhdGUnO1xuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6IHJldHVybiAncmVnZXhwJztcbiAgICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOiByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gICAgY2FzZSAnW29iamVjdCBBcnJheV0nOiByZXR1cm4gJ2FycmF5JztcbiAgICBjYXNlICdbb2JqZWN0IEVycm9yXSc6IHJldHVybiAnZXJyb3InO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICh2YWwgIT09IHZhbCkgcmV0dXJuICduYW4nO1xuICBpZiAodmFsICYmIHZhbC5ub2RlVHlwZSA9PT0gMSkgcmV0dXJuICdlbGVtZW50JztcblxuICB2YWwgPSB2YWwudmFsdWVPZlxuICAgID8gdmFsLnZhbHVlT2YoKVxuICAgIDogT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mLmFwcGx5KHZhbClcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb21wb25lbnQtdHlwZS9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDcyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcbi8vIGVhc2luZyBmdW5jdGlvbnMgZnJvbSBcIlR3ZWVuLmpzXCJcblxuZXhwb3J0cy5saW5lYXIgPSBmdW5jdGlvbihuKXtcbiAgcmV0dXJuIG47XG59O1xuXG5leHBvcnRzLmluUXVhZCA9IGZ1bmN0aW9uKG4pe1xuICByZXR1cm4gbiAqIG47XG59O1xuXG5leHBvcnRzLm91dFF1YWQgPSBmdW5jdGlvbihuKXtcbiAgcmV0dXJuIG4gKiAoMiAtIG4pO1xufTtcblxuZXhwb3J0cy5pbk91dFF1YWQgPSBmdW5jdGlvbihuKXtcbiAgbiAqPSAyO1xuICBpZiAobiA8IDEpIHJldHVybiAwLjUgKiBuICogbjtcbiAgcmV0dXJuIC0gMC41ICogKC0tbiAqIChuIC0gMikgLSAxKTtcbn07XG5cbmV4cG9ydHMuaW5DdWJlID0gZnVuY3Rpb24obil7XG4gIHJldHVybiBuICogbiAqIG47XG59O1xuXG5leHBvcnRzLm91dEN1YmUgPSBmdW5jdGlvbihuKXtcbiAgcmV0dXJuIC0tbiAqIG4gKiBuICsgMTtcbn07XG5cbmV4cG9ydHMuaW5PdXRDdWJlID0gZnVuY3Rpb24obil7XG4gIG4gKj0gMjtcbiAgaWYgKG4gPCAxKSByZXR1cm4gMC41ICogbiAqIG4gKiBuO1xuICByZXR1cm4gMC41ICogKChuIC09IDIgKSAqIG4gKiBuICsgMik7XG59O1xuXG5leHBvcnRzLmluUXVhcnQgPSBmdW5jdGlvbihuKXtcbiAgcmV0dXJuIG4gKiBuICogbiAqIG47XG59O1xuXG5leHBvcnRzLm91dFF1YXJ0ID0gZnVuY3Rpb24obil7XG4gIHJldHVybiAxIC0gKC0tbiAqIG4gKiBuICogbik7XG59O1xuXG5leHBvcnRzLmluT3V0UXVhcnQgPSBmdW5jdGlvbihuKXtcbiAgbiAqPSAyO1xuICBpZiAobiA8IDEpIHJldHVybiAwLjUgKiBuICogbiAqIG4gKiBuO1xuICByZXR1cm4gLTAuNSAqICgobiAtPSAyKSAqIG4gKiBuICogbiAtIDIpO1xufTtcblxuZXhwb3J0cy5pblF1aW50ID0gZnVuY3Rpb24obil7XG4gIHJldHVybiBuICogbiAqIG4gKiBuICogbjtcbn1cblxuZXhwb3J0cy5vdXRRdWludCA9IGZ1bmN0aW9uKG4pe1xuICByZXR1cm4gLS1uICogbiAqIG4gKiBuICogbiArIDE7XG59XG5cbmV4cG9ydHMuaW5PdXRRdWludCA9IGZ1bmN0aW9uKG4pe1xuICBuICo9IDI7XG4gIGlmIChuIDwgMSkgcmV0dXJuIDAuNSAqIG4gKiBuICogbiAqIG4gKiBuO1xuICByZXR1cm4gMC41ICogKChuIC09IDIpICogbiAqIG4gKiBuICogbiArIDIpO1xufTtcblxuZXhwb3J0cy5pblNpbmUgPSBmdW5jdGlvbihuKXtcbiAgcmV0dXJuIDEgLSBNYXRoLmNvcyhuICogTWF0aC5QSSAvIDIgKTtcbn07XG5cbmV4cG9ydHMub3V0U2luZSA9IGZ1bmN0aW9uKG4pe1xuICByZXR1cm4gTWF0aC5zaW4obiAqIE1hdGguUEkgLyAyKTtcbn07XG5cbmV4cG9ydHMuaW5PdXRTaW5lID0gZnVuY3Rpb24obil7XG4gIHJldHVybiAuNSAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIG4pKTtcbn07XG5cbmV4cG9ydHMuaW5FeHBvID0gZnVuY3Rpb24obil7XG4gIHJldHVybiAwID09IG4gPyAwIDogTWF0aC5wb3coMTAyNCwgbiAtIDEpO1xufTtcblxuZXhwb3J0cy5vdXRFeHBvID0gZnVuY3Rpb24obil7XG4gIHJldHVybiAxID09IG4gPyBuIDogMSAtIE1hdGgucG93KDIsIC0xMCAqIG4pO1xufTtcblxuZXhwb3J0cy5pbk91dEV4cG8gPSBmdW5jdGlvbihuKXtcbiAgaWYgKDAgPT0gbikgcmV0dXJuIDA7XG4gIGlmICgxID09IG4pIHJldHVybiAxO1xuICBpZiAoKG4gKj0gMikgPCAxKSByZXR1cm4gLjUgKiBNYXRoLnBvdygxMDI0LCBuIC0gMSk7XG4gIHJldHVybiAuNSAqICgtTWF0aC5wb3coMiwgLTEwICogKG4gLSAxKSkgKyAyKTtcbn07XG5cbmV4cG9ydHMuaW5DaXJjID0gZnVuY3Rpb24obil7XG4gIHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSBuICogbik7XG59O1xuXG5leHBvcnRzLm91dENpcmMgPSBmdW5jdGlvbihuKXtcbiAgcmV0dXJuIE1hdGguc3FydCgxIC0gKC0tbiAqIG4pKTtcbn07XG5cbmV4cG9ydHMuaW5PdXRDaXJjID0gZnVuY3Rpb24obil7XG4gIG4gKj0gMlxuICBpZiAobiA8IDEpIHJldHVybiAtMC41ICogKE1hdGguc3FydCgxIC0gbiAqIG4pIC0gMSk7XG4gIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAobiAtPSAyKSAqIG4pICsgMSk7XG59O1xuXG5leHBvcnRzLmluQmFjayA9IGZ1bmN0aW9uKG4pe1xuICB2YXIgcyA9IDEuNzAxNTg7XG4gIHJldHVybiBuICogbiAqICgoIHMgKyAxICkgKiBuIC0gcyk7XG59O1xuXG5leHBvcnRzLm91dEJhY2sgPSBmdW5jdGlvbihuKXtcbiAgdmFyIHMgPSAxLjcwMTU4O1xuICByZXR1cm4gLS1uICogbiAqICgocyArIDEpICogbiArIHMpICsgMTtcbn07XG5cbmV4cG9ydHMuaW5PdXRCYWNrID0gZnVuY3Rpb24obil7XG4gIHZhciBzID0gMS43MDE1OCAqIDEuNTI1O1xuICBpZiAoICggbiAqPSAyICkgPCAxICkgcmV0dXJuIDAuNSAqICggbiAqIG4gKiAoICggcyArIDEgKSAqIG4gLSBzICkgKTtcbiAgcmV0dXJuIDAuNSAqICggKCBuIC09IDIgKSAqIG4gKiAoICggcyArIDEgKSAqIG4gKyBzICkgKyAyICk7XG59O1xuXG5leHBvcnRzLmluQm91bmNlID0gZnVuY3Rpb24obil7XG4gIHJldHVybiAxIC0gZXhwb3J0cy5vdXRCb3VuY2UoMSAtIG4pO1xufTtcblxuZXhwb3J0cy5vdXRCb3VuY2UgPSBmdW5jdGlvbihuKXtcbiAgaWYgKCBuIDwgKCAxIC8gMi43NSApICkge1xuICAgIHJldHVybiA3LjU2MjUgKiBuICogbjtcbiAgfSBlbHNlIGlmICggbiA8ICggMiAvIDIuNzUgKSApIHtcbiAgICByZXR1cm4gNy41NjI1ICogKCBuIC09ICggMS41IC8gMi43NSApICkgKiBuICsgMC43NTtcbiAgfSBlbHNlIGlmICggbiA8ICggMi41IC8gMi43NSApICkge1xuICAgIHJldHVybiA3LjU2MjUgKiAoIG4gLT0gKCAyLjI1IC8gMi43NSApICkgKiBuICsgMC45Mzc1O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiA3LjU2MjUgKiAoIG4gLT0gKCAyLjYyNSAvIDIuNzUgKSApICogbiArIDAuOTg0Mzc1O1xuICB9XG59O1xuXG5leHBvcnRzLmluT3V0Qm91bmNlID0gZnVuY3Rpb24obil7XG4gIGlmIChuIDwgLjUpIHJldHVybiBleHBvcnRzLmluQm91bmNlKG4gKiAyKSAqIC41O1xuICByZXR1cm4gZXhwb3J0cy5vdXRCb3VuY2UobiAqIDIgLSAxKSAqIC41ICsgLjU7XG59O1xuXG4vLyBhbGlhc2VzXG5cbmV4cG9ydHNbJ2luLXF1YWQnXSA9IGV4cG9ydHMuaW5RdWFkO1xuZXhwb3J0c1snb3V0LXF1YWQnXSA9IGV4cG9ydHMub3V0UXVhZDtcbmV4cG9ydHNbJ2luLW91dC1xdWFkJ10gPSBleHBvcnRzLmluT3V0UXVhZDtcbmV4cG9ydHNbJ2luLWN1YmUnXSA9IGV4cG9ydHMuaW5DdWJlO1xuZXhwb3J0c1snb3V0LWN1YmUnXSA9IGV4cG9ydHMub3V0Q3ViZTtcbmV4cG9ydHNbJ2luLW91dC1jdWJlJ10gPSBleHBvcnRzLmluT3V0Q3ViZTtcbmV4cG9ydHNbJ2luLXF1YXJ0J10gPSBleHBvcnRzLmluUXVhcnQ7XG5leHBvcnRzWydvdXQtcXVhcnQnXSA9IGV4cG9ydHMub3V0UXVhcnQ7XG5leHBvcnRzWydpbi1vdXQtcXVhcnQnXSA9IGV4cG9ydHMuaW5PdXRRdWFydDtcbmV4cG9ydHNbJ2luLXF1aW50J10gPSBleHBvcnRzLmluUXVpbnQ7XG5leHBvcnRzWydvdXQtcXVpbnQnXSA9IGV4cG9ydHMub3V0UXVpbnQ7XG5leHBvcnRzWydpbi1vdXQtcXVpbnQnXSA9IGV4cG9ydHMuaW5PdXRRdWludDtcbmV4cG9ydHNbJ2luLXNpbmUnXSA9IGV4cG9ydHMuaW5TaW5lO1xuZXhwb3J0c1snb3V0LXNpbmUnXSA9IGV4cG9ydHMub3V0U2luZTtcbmV4cG9ydHNbJ2luLW91dC1zaW5lJ10gPSBleHBvcnRzLmluT3V0U2luZTtcbmV4cG9ydHNbJ2luLWV4cG8nXSA9IGV4cG9ydHMuaW5FeHBvO1xuZXhwb3J0c1snb3V0LWV4cG8nXSA9IGV4cG9ydHMub3V0RXhwbztcbmV4cG9ydHNbJ2luLW91dC1leHBvJ10gPSBleHBvcnRzLmluT3V0RXhwbztcbmV4cG9ydHNbJ2luLWNpcmMnXSA9IGV4cG9ydHMuaW5DaXJjO1xuZXhwb3J0c1snb3V0LWNpcmMnXSA9IGV4cG9ydHMub3V0Q2lyYztcbmV4cG9ydHNbJ2luLW91dC1jaXJjJ10gPSBleHBvcnRzLmluT3V0Q2lyYztcbmV4cG9ydHNbJ2luLWJhY2snXSA9IGV4cG9ydHMuaW5CYWNrO1xuZXhwb3J0c1snb3V0LWJhY2snXSA9IGV4cG9ydHMub3V0QmFjaztcbmV4cG9ydHNbJ2luLW91dC1iYWNrJ10gPSBleHBvcnRzLmluT3V0QmFjaztcbmV4cG9ydHNbJ2luLWJvdW5jZSddID0gZXhwb3J0cy5pbkJvdW5jZTtcbmV4cG9ydHNbJ291dC1ib3VuY2UnXSA9IGV4cG9ydHMub3V0Qm91bmNlO1xuZXhwb3J0c1snaW4tb3V0LWJvdW5jZSddID0gZXhwb3J0cy5pbk91dEJvdW5jZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Vhc2UtY29tcG9uZW50L2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gNzNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogRXhwb3NlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKWAuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgZmFsbGJhY2s7XG5cbi8qKlxuICogRmFsbGJhY2sgaW1wbGVtZW50YXRpb24uXG4gKi9cblxudmFyIHByZXYgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbmZ1bmN0aW9uIGZhbGxiYWNrKGZuKSB7XG4gIHZhciBjdXJyID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHZhciBtcyA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnIgLSBwcmV2KSk7XG4gIHZhciByZXEgPSBzZXRUaW1lb3V0KGZuLCBtcyk7XG4gIHByZXYgPSBjdXJyO1xuICByZXR1cm4gcmVxO1xufVxuXG4vKipcbiAqIENhbmNlbC5cbiAqL1xuXG52YXIgY2FuY2VsID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZVxuICB8fCB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luZG93LmNsZWFyVGltZW91dDtcblxuZXhwb3J0cy5jYW5jZWwgPSBmdW5jdGlvbihpZCl7XG4gIGNhbmNlbC5jYWxsKHdpbmRvdywgaWQpO1xufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvbXBvbmVudC1yYWYvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA3NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBldmVudCA9IHtcbiAgLyoqXG4gICAqIG9wZW5VcmxcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmxcbiAgICovXG4gIG9wZW5VUkw6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICBsb2NhdGlvbi5ocmVmID0gdXJsXG4gIH1cblxufVxuXG5ldmVudC5fbWV0YSA9IHtcbiAgZXZlbnQ6IFt7XG4gICAgbmFtZTogJ29wZW5VUkwnLFxuICAgIGFyZ3M6IFsnc3RyaW5nJ11cbiAgfV1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudFxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBpL2V2ZW50LmpzXG4gKiogbW9kdWxlIGlkID0gNzVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgcGFnZUluZm8gPSB7XG5cbiAgc2V0VGl0bGU6IGZ1bmN0aW9uICh0aXRsZSkge1xuICAgIHRpdGxlID0gdGl0bGUgfHwgJ1dlZXggSFRNTDUnXG4gICAgdHJ5IHtcbiAgICAgIHRpdGxlID0gZGVjb2RlVVJJQ29tcG9uZW50KHRpdGxlKVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZVxuICB9XG59XG5cbnBhZ2VJbmZvLl9tZXRhID0ge1xuICBwYWdlSW5mbzogW3tcbiAgICBuYW1lOiAnc2V0VGl0bGUnLFxuICAgIGFyZ3M6IFsnc3RyaW5nJ11cbiAgfV1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlSW5mb1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBpL3BhZ2VJbmZvLmpzXG4gKiogbW9kdWxlIGlkID0gNzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG4vLyByZXF1aXJlKCdodHRwdXJsJylcblxuLy8gdmFyIGpzb25wQ250ID0gMFxuXG4vLyBmdW5jdGlvbiBfc2VuZEpzb25wKGNvbmZpZywgY2FsbGJhY2tJZCkge1xuLy8gICB2YXIgY2JOYW1lID0gJ19jYWxsYmFja18nICsgKCsranNvbnBDbnQpXG4vLyAgIHZhciBzY3JpcHQsIHVybCwgaGVhZFxuLy8gICBnbG9iYWxbY2JOYW1lXSA9IChmdW5jdGlvbiAoY2IpIHtcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4vLyAgICAgICB0aGlzLnNlbmRlci5wZXJmb3JtQ2FsbGJhY2soY2FsbGJhY2tJZCwgcmVzcG9uc2UpXG4vLyAgICAgICBkZWxldGUgZ2xvYmFsW2NiXVxuLy8gICAgIH1cbi8vICAgfSkoY2JOYW1lKVxuLy8gICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuLy8gICB1cmwgPSBsaWIuaHR0cHVybChjb25maWcudXJsKVxuLy8gICB1cmwucGFyYW1zLmNhbGxiYWNrID0gY2JOYW1lXG4vLyAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbi8vICAgc2NyaXB0LnNyYyA9IHVybC50b1N0cmluZygpXG4vLyAgIC8vIHNjcmlwdC5vbmVycm9yIGlzIG5vdCB3b3JraW5nIG9uIElFIG9yIHNhZmFyaS5cbi8vICAgLy8gYnV0IHRoZXkgYXJlIG5vdCBjb25zaWRlcmVkIGhlcmUuXG4vLyAgIHNjcmlwdC5vbmVycm9yID0gKGZ1bmN0aW9uIChjYikge1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiAoZXJyKSB7XG4vLyAgICAgICB0aGlzLnNlbmRlci5wZXJmb3JtQ2FsbGJhY2soY2FsbGJhY2tJZCwgZXJyKVxuLy8gICAgICAgZGVsZXRlIGdsb2JhbFtjYl1cbi8vICAgICB9XG4vLyAgIH0pKGNiTmFtZSlcbi8vICAgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF1cbi8vICAgaGVhZC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBudWxsKVxuLy8gfVxuXG52YXIgc3RyZWFtID0ge1xuXG4gIC8qKlxuICAgKiBzZW5kSHR0cFxuICAgKiBAcGFyYW0gIHtvYmp9IHBhcmFtc1xuICAgKiAgLSBtZXRob2Q6ICdHRVQnIHwgJ1BPU1QnLFxuICAgKiAgLSB1cmw6IHVybCByZXF1ZXN0ZWRcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjYWxsYmFja0lkXG4gICAqL1xuICBzZW5kSHR0cDogZnVuY3Rpb24gKHBhcmFtLCBjYWxsYmFja0lkKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBhcmFtID0gSlNPTi5wYXJzZShwYXJhbSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyYW0gIT09ICdvYmplY3QnIHx8ICFwYXJhbS51cmwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIE5vdCB0byB1c2UganNvbnAgdG8gc2VuZCBodHRwIHJlcXVlc3Qgc2luY2UgaXQgcmVxdWlyZXMgdGhlIHNlcnZlclxuICAgIC8vIHRvIHN1cHBvcnQganNvbnAgY2FsbGJhY2sgYXQgdGhlIGZpcnN0IHBsYWNlLlxuICAgIC8vIF9zZW5kSnNvbnAuY2FsbCh0aGlzLCBwYXJhbSwgY2FsbGJhY2tJZClcblxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBtZXRob2QgPSBwYXJhbS5tZXRob2QgfHwgJ0dFVCdcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICB4aHIub3BlbihtZXRob2QsIHBhcmFtLnVybCwgdHJ1ZSlcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5zZW5kZXIucGVyZm9ybUNhbGxiYWNrKGNhbGxiYWNrSWQsIHRoaXMucmVzcG9uc2VUZXh0KVxuICAgIH1cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgc2VsZi5zZW5kZXIucGVyZm9ybUNhbGxiYWNrKGNhbGxiYWNrSWQsIGVycm9yKVxuICAgIH1cbiAgICB4aHIuc2VuZCgpXG4gIH1cblxufVxuXG5zdHJlYW0uX21ldGEgPSB7XG4gIHN0cmVhbTogW3tcbiAgICBuYW1lOiAnc2VuZEh0dHAnLFxuICAgIGFyZ3M6IFsnb2JqZWN0JywgJ3N0cmluZyddXG4gIH1dXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyZWFtXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9hcGkvc3RyZWFtLmpzXG4gKiogbW9kdWxlIGlkID0gNzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgc2VuZGVyID0gcmVxdWlyZSgnLi4vYnJpZGdlL3NlbmRlcicpXG52YXIgbW9kYWwgPSByZXF1aXJlKCdtb2RhbHMnKVxuXG52YXIgbXNnID0ge1xuXG4gIC8vIGR1cmF0aW9uOiBkZWZhdWx0IGlzIDAuOCBzZWNvbmRzLlxuICB0b2FzdDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIG1vZGFsLnRvYXN0KGNvbmZpZy5tZXNzYWdlLCBjb25maWcuZHVyYXRpb24pXG4gIH0sXG5cbiAgLy8gY29uZmlnOlxuICAvLyAgLSBtZXNzYWdlOiBzdHJpbmdcbiAgLy8gIC0gb2tUaXRsZTogdGl0bGUgb2Ygb2sgYnV0dG9uXG4gIC8vICAtIGNhbGxiYWNrXG4gIGFsZXJ0OiBmdW5jdGlvbiAoY29uZmlnLCBjYWxsYmFja0lkKSB7XG4gICAgdmFyIHNlbmRlciA9ICB0aGlzLnNlbmRlclxuICAgIGNvbmZpZy5jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbmRlci5wZXJmb3JtQ2FsbGJhY2soY2FsbGJhY2tJZClcbiAgICB9XG4gICAgbW9kYWwuYWxlcnQoY29uZmlnKVxuICB9LFxuXG4gIC8vIGNvbmZpZzpcbiAgLy8gIC0gbWVzc2FnZTogc3RyaW5nXG4gIC8vICAtIG9rVGl0bGU6IHRpdGxlIG9mIG9rIGJ1dHRvblxuICAvLyAgLSBjYW5jZWxUaXRsZTogdGl0bGUgb2YgY2FuY2VsIGJ1dHRvblxuICAvLyAgLSBjYWxsYmFja1xuICBjb25maXJtOiBmdW5jdGlvbiAoY29uZmlnLCBjYWxsYmFja0lkKSB7XG4gICAgdmFyIHNlbmRlciA9ICB0aGlzLnNlbmRlclxuICAgIGNvbmZpZy5jYWxsYmFjayA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHNlbmRlci5wZXJmb3JtQ2FsbGJhY2soY2FsbGJhY2tJZCwgdmFsKVxuICAgIH1cbiAgICBtb2RhbC5jb25maXJtKGNvbmZpZylcbiAgfSxcblxuICAvLyBjb25maWc6XG4gIC8vICAtIG1lc3NhZ2U6IHN0cmluZ1xuICAvLyAgLSBva1RpdGxlOiB0aXRsZSBvZiBvayBidXR0b25cbiAgLy8gIC0gY2FuY2VsVGl0bGU6IHRpdGxlIG9mIGNhbmNlbCBidXR0b25cbiAgLy8gIC0gY2FsbGJhY2tcbiAgcHJvbXB0OiBmdW5jdGlvbiAoY29uZmlnLCBjYWxsYmFja0lkKSB7XG4gICAgdmFyIHNlbmRlciA9ICB0aGlzLnNlbmRlclxuICAgIGNvbmZpZy5jYWxsYmFjayA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHNlbmRlci5wZXJmb3JtQ2FsbGJhY2soY2FsbGJhY2tJZCwgdmFsKVxuICAgIH1cbiAgICBtb2RhbC5wcm9tcHQoY29uZmlnKVxuICB9XG5cbn1cblxubXNnLl9tZXRhID0ge1xuICBtb2RhbDogW3tcbiAgICBuYW1lOiAndG9hc3QnLFxuICAgIGFyZ3M6IFsnb2JqZWN0J11cbiAgfSwge1xuICAgIG5hbWU6ICdhbGVydCcsXG4gICAgYXJnczogWydvYmplY3QnLCAnc3RyaW5nJ11cbiAgfSwge1xuICAgIG5hbWU6ICdjb25maXJtJyxcbiAgICBhcmdzOiBbJ29iamVjdCcsICdzdHJpbmcnXVxuICB9LCB7XG4gICAgbmFtZTogJ3Byb21wdCcsXG4gICAgYXJnczogWydvYmplY3QnLCAnc3RyaW5nJ11cbiAgfV1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtc2dcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBpL21vZGFsLmpzXG4gKiogbW9kdWxlIGlkID0gNzhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG52YXIgQWxlcnQgPSByZXF1aXJlKCcuL2FsZXJ0JylcbnZhciBDb25maXJtID0gcmVxdWlyZSgnLi9jb25maXJtJylcbnZhciBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpXG52YXIgdG9hc3QgPSByZXF1aXJlKCcuL3RvYXN0JylcblxudmFyIG1vZGFsID0ge1xuXG4gIHRvYXN0OiBmdW5jdGlvbiAobXNnLCBkdXJhdGlvbikge1xuICAgIHRvYXN0LnB1c2gobXNnLCBkdXJhdGlvbilcbiAgfSxcblxuICBhbGVydDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIG5ldyBBbGVydChjb25maWcpLnNob3coKVxuICB9LFxuXG4gIHByb21wdDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIG5ldyBQcm9tcHQoY29uZmlnKS5zaG93KClcbiAgfSxcblxuICBjb25maXJtOiBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgbmV3IENvbmZpcm0oY29uZmlnKS5zaG93KClcbiAgfVxuXG59XG5cbiF3aW5kb3cubGliICYmICh3aW5kb3cubGliID0ge30pXG53aW5kb3cubGliLm1vZGFsID0gbW9kYWxcblxubW9kdWxlLmV4cG9ydHMgPSBtb2RhbFxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L21vZGFscy9zcmMvaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSA3OVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBNb2RhbCA9IHJlcXVpcmUoJy4vbW9kYWwnKVxucmVxdWlyZSgnLi4vc3R5bGVzL2FsZXJ0LnNjc3MnKVxuXG52YXIgQ09OVEVOVF9DTEFTUyA9ICdjb250ZW50J1xudmFyIE1TR19DTEFTUyA9ICdjb250ZW50LW1zZydcbnZhciBCVVRUT05fR1JPVVBfQ0xBU1MgPSAnYnRuLWdyb3VwJ1xudmFyIEJVVFRPTl9DTEFTUyA9ICdidG4nXG5cbmZ1bmN0aW9uIEFsZXJ0KGNvbmZpZykge1xuICB0aGlzLm1zZyA9IGNvbmZpZy5tZXNzYWdlIHx8ICcnXG4gIHRoaXMuY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2tcbiAgdGhpcy5va1RpdGxlID0gY29uZmlnLm9rVGl0bGUgfHwgJ09LJ1xuICBNb2RhbC5jYWxsKHRoaXMpXG4gIHRoaXMubm9kZS5jbGFzc0xpc3QuYWRkKCdhbWZlLWFsZXJ0Jylcbn1cblxuQWxlcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShNb2RhbC5wcm90b3R5cGUpXG5cbkFsZXJ0LnByb3RvdHlwZS5jcmVhdGVOb2RlQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBjb250ZW50LmNsYXNzTGlzdC5hZGQoQ09OVEVOVF9DTEFTUylcbiAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKGNvbnRlbnQpXG5cbiAgdmFyIG1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIG1zZy5jbGFzc0xpc3QuYWRkKE1TR19DTEFTUylcbiAgbXNnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubXNnKSlcbiAgY29udGVudC5hcHBlbmRDaGlsZChtc2cpXG5cbiAgdmFyIGJ1dHRvbkdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYnV0dG9uR3JvdXAuY2xhc3NMaXN0LmFkZChCVVRUT05fR1JPVVBfQ0xBU1MpXG4gIHRoaXMubm9kZS5hcHBlbmRDaGlsZChidXR0b25Hcm91cClcbiAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKEJVVFRPTl9DTEFTUywgJ2FsZXJ0LW9rJylcbiAgYnV0dG9uLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMub2tUaXRsZSkpXG4gIGJ1dHRvbkdyb3VwLmFwcGVuZENoaWxkKGJ1dHRvbilcbn1cblxuQWxlcnQucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIE1vZGFsLnByb3RvdHlwZS5iaW5kRXZlbnRzLmNhbGwodGhpcylcbiAgdmFyIGJ1dHRvbiA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKCcuJyArIEJVVFRPTl9DTEFTUylcbiAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGVzdHJveSgpXG4gICAgdGhpcy5jYWxsYmFjayAmJiB0aGlzLmNhbGxiYWNrKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFsZXJ0XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9tb2RhbHMvc3JjL2FsZXJ0LmpzXG4gKiogbW9kdWxlIGlkID0gODBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0J1xuXG5yZXF1aXJlKCcuLi9zdHlsZXMvbW9kYWwuc2NzcycpXG5cbi8vIHRoZXJlIHdpbGwgYmUgb25seSBvbmUgaW5zdGFuY2Ugb2YgbW9kYWwuXG52YXIgTU9EQUxfV1JBUF9DTEFTUyA9ICdhbWZlLW1vZGFsLXdyYXAnXG52YXIgTU9EQUxfTk9ERV9DTEFTUyA9ICdhbWZlLW1vZGFsLW5vZGUnXG5cbmZ1bmN0aW9uIE1vZGFsKCkge1xuICB0aGlzLndyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKE1PREFMX1dSQVBfQ0xBU1MpXG4gIHRoaXMubm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoTU9EQUxfTk9ERV9DTEFTUylcbiAgaWYgKCF0aGlzLndyYXApIHtcbiAgICB0aGlzLmNyZWF0ZVdyYXAoKVxuICB9XG4gIGlmICghdGhpcy5ub2RlKSB7XG4gICAgdGhpcy5jcmVhdGVOb2RlKClcbiAgfVxuICB0aGlzLmNsZWFyTm9kZSgpXG4gIHRoaXMuY3JlYXRlTm9kZUNvbnRlbnQoKVxuICB0aGlzLmJpbmRFdmVudHMoKVxufVxuXG5Nb2RhbC5wcm90b3R5cGUgPSB7XG5cbiAgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMud3JhcC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIHRoaXMubm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcbiAgfSxcblxuICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLndyYXApXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm5vZGUpXG4gICAgdGhpcy53cmFwID0gbnVsbFxuICAgIHRoaXMubm9kZSA9IG51bGxcbiAgfSxcblxuICBjcmVhdGVXcmFwOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy53cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLndyYXAuY2xhc3NOYW1lID0gTU9EQUxfV1JBUF9DTEFTU1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy53cmFwKVxuICB9LFxuXG4gIGNyZWF0ZU5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMubm9kZS5jbGFzc0xpc3QuYWRkKE1PREFMX05PREVfQ0xBU1MsICdoaWRlJylcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubm9kZSlcbiAgfSxcblxuICBjbGVhck5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm5vZGUuaW5uZXJIVE1MID0gJydcbiAgfSxcblxuICBjcmVhdGVOb2RlQ29udGVudDogZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gZG8gbm90aGluZy5cbiAgICAvLyBjaGlsZCBjbGFzc2VzIGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZC5cbiAgfSxcblxuICBiaW5kRXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy53cmFwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbFxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbW9kYWxzL3NyYy9tb2RhbC5qc1xuICoqIG1vZHVsZSBpZCA9IDgxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL21vZGFsLnNjc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4vLi4vLi4vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9zYXNzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi9tb2RhbC5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vbW9kYWwuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbW9kYWxzL3N0eWxlcy9tb2RhbC5zY3NzXG4gKiogbW9kdWxlIGlkID0gODJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuYW1mZS1tb2RhbC13cmFwIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB6LWluZGV4OiA5OTk5OTk5OTk7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO1xcbiAgb3BhY2l0eTogMC41OyB9XFxuXFxuLmFtZmUtbW9kYWwtbm9kZSB7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB6LWluZGV4OiA5OTk5OTk5OTk5O1xcbiAgdG9wOiA1MCU7XFxuICBsZWZ0OiA1MCU7XFxuICB3aWR0aDogNi42NjY2NjdyZW07XFxuICBtaW4taGVpZ2h0OiAyLjY2NjY2N3JlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuMDY2NjY3cmVtO1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjsgfVxcbiAgLmFtZmUtbW9kYWwtbm9kZS5oaWRlIHtcXG4gICAgZGlzcGxheTogbm9uZTsgfVxcbiAgLmFtZmUtbW9kYWwtbm9kZSAuY29udGVudCB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBtaW4taGVpZ2h0OiAxLjg2NjY2N3JlbTtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgZm9udC1zaXplOiAwLjMycmVtO1xcbiAgICBsaW5lLWhlaWdodDogMC40MjY2NjdyZW07XFxuICAgIHBhZGRpbmc6IDAuMjEzMzMzcmVtO1xcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RkZDsgfVxcbiAgLmFtZmUtbW9kYWwtbm9kZSAuYnRuLWdyb3VwIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGhlaWdodDogMC44cmVtO1xcbiAgICBmb250LXNpemU6IDAuMzczMzMzcmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cXG4gICAgLmFtZmUtbW9kYWwtbm9kZSAuYnRuLWdyb3VwIC5idG4ge1xcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgICAgaGVpZ2h0OiAwLjhyZW07XFxuICAgICAgbGluZS1oZWlnaHQ6IDAuOHJlbTsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9ub2RlX21vZHVsZXMvbW9kYWxzL25vZGVfbW9kdWxlcy9tb2RhbHMvc3R5bGVzL21vZGFsLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixPQUFPO0VBQ1AsUUFBUTtFQUNSLFlBQVk7RUFDWixhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLGFBQWEsRUFFZDs7QUFFRDtFQUNFLGdCQUFnQjtFQUNoQixvQkFBb0I7RUFDcEIsU0FBUztFQUNULFVBQVU7RUFDVixtQkFBbUI7RUFDbkIsd0JBQXdCO0VBQ3hCLDJCQUEyQjtFQUMzQix5Q0FBNEI7RUFDNUIsaUNBQW9CO0VBQ3BCLHVCQUF1QixFQTRCeEI7RUF0Q0Q7SUFhSSxjQUNELEVBQUM7RUFkSjtJQWlCSSxZQUFZO0lBQ1osd0JBQXdCO0lBQ3hCLHVCQUF1QjtJQUN2QixtQkFBbUI7SUFDbkIseUJBQXlCO0lBQ3pCLHFCQUFxQjtJQUNyQiw4QkFBOEIsRUFDL0I7RUF4Qkg7SUEyQkksWUFBWTtJQUNaLGVBQWU7SUFDZix1QkFBdUI7SUFDdkIsbUJBQW1CLEVBT3BCO0lBckNIO01BaUNNLHVCQUF1QjtNQUN2QixlQUFlO01BQ2Ysb0JBQW9CLEVBQ3JCXCIsXCJmaWxlXCI6XCJtb2RhbC5zY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5hbWZlLW1vZGFsLXdyYXAge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIHotaW5kZXg6IDk5OTk5OTk5OTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XFxuICBvcGFjaXR5OiAwLjU7XFxuXFxufVxcblxcbi5hbWZlLW1vZGFsLW5vZGUge1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgei1pbmRleDogOTk5OTk5OTk5OTtcXG4gIHRvcDogNTAlO1xcbiAgbGVmdDogNTAlO1xcbiAgd2lkdGg6IDYuNjY2NjY3cmVtOyAvLyA1MDBweFxcbiAgbWluLWhlaWdodDogMi42NjY2NjdyZW07IC8vIDIwMHB4XFxuICBib3JkZXItcmFkaXVzOiAwLjA2NjY2N3JlbTsgLy8gNXB4XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcblxcbiAgJi5oaWRlIHtcXG4gICAgZGlzcGxheTogbm9uZVxcbiAgfVxcblxcbiAgLmNvbnRlbnQge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgbWluLWhlaWdodDogMS44NjY2NjdyZW07IC8vIDE0MHB4XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgIGZvbnQtc2l6ZTogMC4zMnJlbTsgLy8gMjRweFxcbiAgICBsaW5lLWhlaWdodDogMC40MjY2NjdyZW07IC8vIDMycHhcXG4gICAgcGFkZGluZzogMC4yMTMzMzNyZW07IC8vIDE2cHhcXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XFxuICB9XFxuXFxuICAuYnRuLWdyb3VwIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGhlaWdodDogMC44cmVtOyAvLyA2MHB4XFxuICAgIGZvbnQtc2l6ZTogMC4zNzMzMzNyZW07IC8vIDI4cHhcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcblxcbiAgICAuYnRuIHtcXG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICAgIGhlaWdodDogMC44cmVtOyAvLyA2MHB4XFxuICAgICAgbGluZS1oZWlnaHQ6IDAuOHJlbTsgLy8gNjBweFxcbiAgICB9XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIndlYnBhY2s6Ly9cIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L3Nhc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vbW9kYWxzL3N0eWxlcy9tb2RhbC5zY3NzXG4gKiogbW9kdWxlIGlkID0gODNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vYWxlcnQuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL2FsZXJ0LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9zYXNzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi9hbGVydC5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9tb2RhbHMvc3R5bGVzL2FsZXJ0LnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA4NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5hbWZlLWFsZXJ0IC5hbWZlLWFsZXJ0LW9rIHtcXG4gIHdpZHRoOiAxMDAlOyB9XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi8uL25vZGVfbW9kdWxlcy9tb2RhbHMvbm9kZV9tb2R1bGVzL21vZGFscy9zdHlsZXMvYWxlcnQuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUdJLFlBQVksRUFDYlwiLFwiZmlsZVwiOlwiYWxlcnQuc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuYW1mZS1hbGVydCB7XFxuXFxuICAuYW1mZS1hbGVydC1vayB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJ3ZWJwYWNrOi8vXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vfi9zYXNzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L21vZGFscy9zdHlsZXMvYWxlcnQuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDg1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIE1vZGFsID0gcmVxdWlyZSgnLi9tb2RhbCcpXG5yZXF1aXJlKCcuLi9zdHlsZXMvY29uZmlybS5zY3NzJylcblxudmFyIENPTlRFTlRfQ0xBU1MgPSAnY29udGVudCdcbnZhciBNU0dfQ0xBU1MgPSAnY29udGVudC1tc2cnXG52YXIgQlVUVE9OX0dST1VQX0NMQVNTID0gJ2J0bi1ncm91cCdcbnZhciBCVVRUT05fQ0xBU1MgPSAnYnRuJ1xuXG5mdW5jdGlvbiBDb25maXJtKGNvbmZpZykge1xuICB0aGlzLm1zZyA9IGNvbmZpZy5tZXNzYWdlIHx8ICcnXG4gIHRoaXMuY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2tcbiAgdGhpcy5va1RpdGxlID0gY29uZmlnLm9rVGl0bGUgfHwgJ09LJ1xuICB0aGlzLmNhbmNlbFRpdGxlID0gY29uZmlnLmNhbmNlbFRpdGxlIHx8ICdDYW5jZWwnXG4gIE1vZGFsLmNhbGwodGhpcylcbiAgdGhpcy5ub2RlLmNsYXNzTGlzdC5hZGQoJ2FtZmUtY29uZmlybScpXG59XG5cbkNvbmZpcm0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShNb2RhbC5wcm90b3R5cGUpXG5cbkNvbmZpcm0ucHJvdG90eXBlLmNyZWF0ZU5vZGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRlbnQuY2xhc3NMaXN0LmFkZChDT05URU5UX0NMQVNTKVxuICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQoY29udGVudClcblxuICB2YXIgbXNnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgbXNnLmNsYXNzTGlzdC5hZGQoTVNHX0NMQVNTKVxuICBtc2cuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5tc2cpKVxuICBjb250ZW50LmFwcGVuZENoaWxkKG1zZylcblxuICB2YXIgYnV0dG9uR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBidXR0b25Hcm91cC5jbGFzc0xpc3QuYWRkKEJVVFRPTl9HUk9VUF9DTEFTUylcbiAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKGJ1dHRvbkdyb3VwKVxuICB2YXIgYnRuT2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBidG5Pay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLm9rVGl0bGUpKVxuICBidG5Pay5jbGFzc0xpc3QuYWRkKCdidG4tb2snLCBCVVRUT05fQ0xBU1MpXG4gIHZhciBidG5DYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBidG5DYW5jZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5jYW5jZWxUaXRsZSkpXG4gIGJ0bkNhbmNlbC5jbGFzc0xpc3QuYWRkKCdidG4tY2FuY2VsJywgQlVUVE9OX0NMQVNTKVxuICBidXR0b25Hcm91cC5hcHBlbmRDaGlsZChidG5PaylcbiAgYnV0dG9uR3JvdXAuYXBwZW5kQ2hpbGQoYnRuQ2FuY2VsKVxuICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQoYnV0dG9uR3JvdXApXG59XG5cbkNvbmZpcm0ucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIE1vZGFsLnByb3RvdHlwZS5iaW5kRXZlbnRzLmNhbGwodGhpcylcbiAgdmFyIGJ0bk9rID0gdGhpcy5ub2RlLnF1ZXJ5U2VsZWN0b3IoJy4nICsgQlVUVE9OX0NMQVNTICsgJy5idG4tb2snKVxuICB2YXIgYnRuQ2FuY2VsID0gdGhpcy5ub2RlLnF1ZXJ5U2VsZWN0b3IoJy4nICsgQlVUVE9OX0NMQVNTICsgJy5idG4tY2FuY2VsJylcbiAgYnRuT2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kZXN0cm95KClcbiAgICB0aGlzLmNhbGxiYWNrICYmIHRoaXMuY2FsbGJhY2sodGhpcy5va1RpdGxlKVxuICB9LmJpbmQodGhpcykpXG4gIGJ0bkNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKVxuICAgIHRoaXMuY2FsbGJhY2sgJiYgdGhpcy5jYWxsYmFjayh0aGlzLmNhbmNlbFRpdGxlKVxuICB9LmJpbmQodGhpcykpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlybVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbW9kYWxzL3NyYy9jb25maXJtLmpzXG4gKiogbW9kdWxlIGlkID0gODZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vY29uZmlybS5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vY29uZmlybS5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vY29uZmlybS5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9tb2RhbHMvc3R5bGVzL2NvbmZpcm0uc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDg3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmFtZmUtY29uZmlybSAuYnRuLWdyb3VwIC5idG4ge1xcbiAgZmxvYXQ6IGxlZnQ7XFxuICB3aWR0aDogNTAlOyB9XFxuICAuYW1mZS1jb25maXJtIC5idG4tZ3JvdXAgLmJ0bi5idG4tb2sge1xcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZGRkOyB9XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi8uL25vZGVfbW9kdWxlcy9tb2RhbHMvbm9kZV9tb2R1bGVzL21vZGFscy9zdHlsZXMvY29uZmlybS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBS00sWUFBWTtFQUNaLFdBQVcsRUFLWjtFQVhMO0lBU08sNkJBQTZCLEVBQzdCXCIsXCJmaWxlXCI6XCJjb25maXJtLnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmFtZmUtY29uZmlybSB7XFxuXFxuICAuYnRuLWdyb3VwIHtcXG5cXG4gICAgLmJ0biB7XFxuICAgICAgZmxvYXQ6IGxlZnQ7XFxuICAgICAgd2lkdGg6IDUwJTtcXG5cXG4gICAgICAmLmJ0bi1vayB7XFxuICAgICAgXFx0Ym9yZGVyLXJpZ2h0OiAxcHggc29saWQgI2RkZDtcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XCJdLFwic291cmNlUm9vdFwiOlwid2VicGFjazovL1wifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vc2Fzcy1sb2FkZXI/c291cmNlTWFwIS4vfi9tb2RhbHMvc3R5bGVzL2NvbmZpcm0uc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDg4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCdcblxudmFyIE1vZGFsID0gcmVxdWlyZSgnLi9tb2RhbCcpXG5yZXF1aXJlKCcuLi9zdHlsZXMvcHJvbXB0LnNjc3MnKVxuXG52YXIgQ09OVEVOVF9DTEFTUyA9ICdjb250ZW50J1xudmFyIE1TR19DTEFTUyA9ICdjb250ZW50LW1zZydcbnZhciBCVVRUT05fR1JPVVBfQ0xBU1MgPSAnYnRuLWdyb3VwJ1xudmFyIEJVVFRPTl9DTEFTUyA9ICdidG4nXG52YXIgSU5QVVRfV1JBUF9DTEFTUyA9ICdpbnB1dC13cmFwJ1xudmFyIElOUFVUX0NMQVNTID0gJ2lucHV0J1xuXG5mdW5jdGlvbiBQcm9tcHQoY29uZmlnKSB7XG4gIHRoaXMubXNnID0gY29uZmlnLm1lc3NhZ2UgfHwgJydcbiAgdGhpcy5kZWZhdWx0TXNnID0gY29uZmlnLmRlZmF1bHQgfHwgJydcbiAgdGhpcy5jYWxsYmFjayA9IGNvbmZpZy5jYWxsYmFja1xuICB0aGlzLm9rVGl0bGUgPSBjb25maWcub2tUaXRsZSB8fCAnT0snXG4gIHRoaXMuY2FuY2VsVGl0bGUgPSBjb25maWcuY2FuY2VsVGl0bGUgfHwgJ0NhbmNlbCdcbiAgTW9kYWwuY2FsbCh0aGlzKVxuICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZCgnYW1mZS1wcm9tcHQnKVxufVxuXG5Qcm9tcHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShNb2RhbC5wcm90b3R5cGUpXG5cblByb21wdC5wcm90b3R5cGUuY3JlYXRlTm9kZUNvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBjb250ZW50LmNsYXNzTGlzdC5hZGQoQ09OVEVOVF9DTEFTUylcbiAgdGhpcy5ub2RlLmFwcGVuZENoaWxkKGNvbnRlbnQpXG5cbiAgdmFyIG1zZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIG1zZy5jbGFzc0xpc3QuYWRkKE1TR19DTEFTUylcbiAgbXNnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubXNnKSlcbiAgY29udGVudC5hcHBlbmRDaGlsZChtc2cpXG5cbiAgdmFyIGlucHV0V3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGlucHV0V3JhcC5jbGFzc0xpc3QuYWRkKElOUFVUX1dSQVBfQ0xBU1MpXG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5wdXRXcmFwKVxuICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpXG4gIGlucHV0LmNsYXNzTGlzdC5hZGQoSU5QVVRfQ0xBU1MpXG4gIGlucHV0LnR5cGUgPSAndGV4dCdcbiAgaW5wdXQuYXV0b2ZvY3VzID0gdHJ1ZVxuICBpbnB1dC5wbGFjZWhvbGRlciA9IHRoaXMuZGVmYXVsdE1zZ1xuICBpbnB1dFdyYXAuYXBwZW5kQ2hpbGQoaW5wdXQpXG5cbiAgdmFyIGJ1dHRvbkdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYnV0dG9uR3JvdXAuY2xhc3NMaXN0LmFkZChCVVRUT05fR1JPVVBfQ0xBU1MpXG4gIHZhciBidG5PayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGJ0bk9rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMub2tUaXRsZSkpXG4gIGJ0bk9rLmNsYXNzTGlzdC5hZGQoJ2J0bi1vaycsIEJVVFRPTl9DTEFTUylcbiAgdmFyIGJ0bkNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGJ0bkNhbmNlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmNhbmNlbFRpdGxlKSlcbiAgYnRuQ2FuY2VsLmNsYXNzTGlzdC5hZGQoJ2J0bi1jYW5jZWwnLCBCVVRUT05fQ0xBU1MpXG4gIGJ1dHRvbkdyb3VwLmFwcGVuZENoaWxkKGJ0bk9rKVxuICBidXR0b25Hcm91cC5hcHBlbmRDaGlsZChidG5DYW5jZWwpXG4gIHRoaXMubm9kZS5hcHBlbmRDaGlsZChidXR0b25Hcm91cClcbn1cblxuUHJvbXB0LnByb3RvdHlwZS5iaW5kRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICBNb2RhbC5wcm90b3R5cGUuYmluZEV2ZW50cy5jYWxsKHRoaXMpXG4gIHZhciBidG5PayA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKCcuJyArIEJVVFRPTl9DTEFTUyArICcuYnRuLW9rJylcbiAgdmFyIGJ0bkNhbmNlbCA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKCcuJyArIEJVVFRPTl9DTEFTUyArICcuYnRuLWNhbmNlbCcpXG4gIHZhciB0aGF0ID0gdGhpc1xuICBidG5Pay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZVxuICAgIHRoaXMuZGVzdHJveSgpXG4gICAgdGhpcy5jYWxsYmFjayAmJiB0aGlzLmNhbGxiYWNrKHtcbiAgICAgIHJlc3VsdDogdGhhdC5va1RpdGxlLFxuICAgICAgZGF0YTogdmFsXG4gICAgfSlcbiAgfS5iaW5kKHRoaXMpKVxuICBidG5DYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWVcbiAgICB0aGlzLmRlc3Ryb3koKVxuICAgIHRoaXMuY2FsbGJhY2sgJiYgdGhpcy5jYWxsYmFjayh7XG4gICAgICByZXN1bHQ6IHRoYXQuY2FuY2VsVGl0bGVcbiAgICB9KVxuICB9LmJpbmQodGhpcykpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbXB0XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9tb2RhbHMvc3JjL3Byb21wdC5qc1xuICoqIG1vZHVsZSBpZCA9IDg5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3Byb21wdC5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLy4uLy4uL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vcHJvbXB0LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9zYXNzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi9wcm9tcHQuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vbW9kYWxzL3N0eWxlcy9wcm9tcHQuc2Nzc1xuICoqIG1vZHVsZSBpZCA9IDkwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmFtZmUtcHJvbXB0IC5pbnB1dC13cmFwIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB3aWR0aDogMTAwJTtcXG4gIHBhZGRpbmc6IDAuMjRyZW0gMC4yMTMzMzNyZW0gMC4yMTMzMzNyZW07XFxuICBoZWlnaHQ6IDAuOTZyZW07IH1cXG4gIC5hbWZlLXByb21wdCAuaW5wdXQtd3JhcCAuaW5wdXQge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAwLjU2cmVtO1xcbiAgICBsaW5lLWhlaWdodDogMC41NnJlbTtcXG4gICAgZm9udC1zaXplOiAwLjMycmVtOyB9XFxuXFxuLmFtZmUtcHJvbXB0IC5idG4tZ3JvdXAgLmJ0biB7XFxuICBmbG9hdDogbGVmdDtcXG4gIHdpZHRoOiA1MCU7IH1cXG4gIC5hbWZlLXByb21wdCAuYnRuLWdyb3VwIC5idG4uYnRuLW9rIHtcXG4gICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI2RkZDsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9ub2RlX21vZHVsZXMvbW9kYWxzL25vZGVfbW9kdWxlcy9tb2RhbHMvc3R5bGVzL3Byb21wdC5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBR0ksdUJBQXVCO0VBQ3ZCLFlBQVk7RUFDWix5Q0FBeUM7RUFDekMsZ0JBQWdCLEVBU2pCO0VBZkg7SUFTTSx1QkFBdUI7SUFDdkIsWUFBWTtJQUNaLGdCQUFnQjtJQUNoQixxQkFBcUI7SUFDckIsbUJBQW1CLEVBQ3BCOztBQWRMO0VBb0JNLFlBQVk7RUFDWixXQUFXLEVBS1o7RUExQkw7SUF3QlEsNkJBQTZCLEVBQzlCXCIsXCJmaWxlXCI6XCJwcm9tcHQuc2Nzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuYW1mZS1wcm9tcHQge1xcblxcbiAgLmlucHV0LXdyYXAge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgcGFkZGluZzogMC4yNHJlbSAwLjIxMzMzM3JlbSAwLjIxMzMzM3JlbTsgLy8gMThweCAxNnB4IDE2cHhcXG4gICAgaGVpZ2h0OiAwLjk2cmVtOyAvLyA3NHB4XFxuXFxuICAgIC5pbnB1dCB7XFxuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBoZWlnaHQ6IDAuNTZyZW07IC8vIDQycHhcXG4gICAgICBsaW5lLWhlaWdodDogMC41NnJlbTsgLy8gNDJweFxcbiAgICAgIGZvbnQtc2l6ZTogMC4zMnJlbTsgLy8gMjRweFxcbiAgICB9XFxuICB9XFxuXFxuICAuYnRuLWdyb3VwIHtcXG5cXG4gICAgLmJ0biB7XFxuICAgICAgZmxvYXQ6IGxlZnQ7XFxuICAgICAgd2lkdGg6IDUwJTtcXG5cXG4gICAgICAmLmJ0bi1vayB7XFxuICAgICAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZGRkO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJ3ZWJwYWNrOi8vXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vfi9zYXNzLWxvYWRlcj9zb3VyY2VNYXAhLi9+L21vZGFscy9zdHlsZXMvcHJvbXB0LnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA5MVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnJlcXVpcmUoJy4uL3N0eWxlcy90b2FzdC5zY3NzJylcblxudmFyIHF1ZXVlID0gW11cbnZhciB0aW1lclxudmFyIGlzUHJvY2Vzc2luZyA9IGZhbHNlXG52YXIgdG9hc3RXaW5cbnZhciBUT0FTVF9XSU5fQ0xBU1NfTkFNRSA9ICdhbWZlLXRvYXN0J1xuXG52YXIgREVGQVVMVF9EVVJBVElPTiA9IDAuOFxuXG5mdW5jdGlvbiBzaG93VG9hc3RXaW5kb3cobXNnLCBjYWxsYmFjaykge1xuICB2YXIgaGFuZGxlVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0b2FzdFdpbi5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgaGFuZGxlVHJhbnNpdGlvbkVuZClcbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gIH1cbiAgaWYgKCF0b2FzdFdpbikge1xuICAgIHRvYXN0V2luID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0b2FzdFdpbi5jbGFzc0xpc3QuYWRkKFRPQVNUX1dJTl9DTEFTU19OQU1FLCAnaGlkZScpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b2FzdFdpbilcbiAgfVxuICB0b2FzdFdpbi5pbm5lckhUTUwgPSBtc2dcbiAgdG9hc3RXaW4uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGhhbmRsZVRyYW5zaXRpb25FbmQpXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHRvYXN0V2luLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuICB9LCAwKVxufVxuXG5mdW5jdGlvbiBoaWRlVG9hc3RXaW5kb3coY2FsbGJhY2spIHtcbiAgdmFyIGhhbmRsZVRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdG9hc3RXaW4ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGhhbmRsZVRyYW5zaXRpb25FbmQpXG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICB9XG4gIGlmICghdG9hc3RXaW4pIHtcbiAgICByZXR1cm5cbiAgfVxuICB0b2FzdFdpbi5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgaGFuZGxlVHJhbnNpdGlvbkVuZClcbiAgdG9hc3RXaW4uY2xhc3NMaXN0LmFkZCgnaGlkZScpXG59XG5cbnZhciB0b2FzdCA9IHtcblxuICBwdXNoOiBmdW5jdGlvbiAobXNnLCBkdXJhdGlvbikge1xuICAgIHF1ZXVlLnB1c2goe1xuICAgICAgbXNnOiBtc2csXG4gICAgICBkdXJhdGlvbjogZHVyYXRpb24gfHwgREVGQVVMVF9EVVJBVElPTlxuICAgIH0pXG4gICAgdGhpcy5zaG93KClcbiAgfSxcblxuICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICAvLyBBbGwgbWVzc2FnZXMgaGFkIGJlZW4gdG9hc3RlZCBhbHJlYWR5LCBzbyByZW1vdmUgdGhlIHRvYXN0IHdpbmRvdyxcbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuICAgICAgdG9hc3RXaW4gJiYgdG9hc3RXaW4ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0b2FzdFdpbilcbiAgICAgIHRvYXN0V2luID0gbnVsbFxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gdGhlIHByZXZpb3VzIHRvYXN0IGlzIG5vdCBlbmRlZCB5ZXQuXG4gICAgaWYgKGlzUHJvY2Vzc2luZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlzUHJvY2Vzc2luZyA9IHRydWVcblxuICAgIHZhciB0b2FzdEluZm8gPSBxdWV1ZS5zaGlmdCgpXG4gICAgc2hvd1RvYXN0V2luZG93KHRvYXN0SW5mby5tc2csIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRpbWVyID0gbnVsbFxuICAgICAgICBoaWRlVG9hc3RXaW5kb3coZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlzUHJvY2Vzc2luZyA9IGZhbHNlXG4gICAgICAgICAgdGhhdC5zaG93KClcbiAgICAgICAgfSlcbiAgICAgIH0sIHRvYXN0SW5mby5kdXJhdGlvbiAqIDEwMDApXG4gICAgfSlcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwdXNoOiB0b2FzdC5wdXNoLmJpbmQodG9hc3QpXG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9tb2RhbHMvc3JjL3RvYXN0LmpzXG4gKiogbW9kdWxlIGlkID0gOTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLy4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vLi4vLi4vc2Fzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4vdG9hc3Quc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi8uLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLy4uLy4uL3Nhc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuL3RvYXN0LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi8uLi8uLi9zYXNzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi90b2FzdC5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9tb2RhbHMvc3R5bGVzL3RvYXN0LnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA5M1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5hbWZlLXRvYXN0IHtcXG4gIGZvbnQtc2l6ZTogMC4zMnJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAwLjQyNjY2N3JlbTtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBtYXgtd2lkdGg6IDgwJTtcXG4gIGJvdHRvbTogMi42NjY2NjdyZW07XFxuICBsZWZ0OiA1MCU7XFxuICBwYWRkaW5nOiAwLjIxMzMzM3JlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XFxuICBjb2xvcjogI2ZmZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG9wYWNpdHk6IDAuNjtcXG4gIHRyYW5zaXRpb246IGFsbCAwLjRzIGVhc2UtaW4tb3V0O1xcbiAgYm9yZGVyLXJhZGl1czogMC4wNjY2NjdyZW07XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTsgfVxcblxcbi5hbWZlLXRvYXN0LmhpZGUge1xcbiAgb3BhY2l0eTogMDsgfVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvLi9ub2RlX21vZHVsZXMvbW9kYWxzL25vZGVfbW9kdWxlcy9tb2RhbHMvc3R5bGVzL3RvYXN0LnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDQyxtQkFBbUI7RUFDbkIseUJBQXlCO0VBQ3pCLGdCQUFnQjtFQUNoQix1QkFBdUI7RUFDdkIsZUFBZTtFQUNmLG9CQUFvQjtFQUNwQixVQUFVO0VBQ1YscUJBQXFCO0VBQ3JCLHVCQUF1QjtFQUN2QixZQUFZO0VBQ1osbUJBQW1CO0VBQ25CLGFBQWE7RUFDYixpQ0FBaUM7RUFDakMsMkJBQTJCO0VBQzNCLG9DQUE2QjtFQUM1Qiw0QkFBcUIsRUFDdEI7O0FBRUQ7RUFDQyxXQUFXLEVBQ1hcIixcImZpbGVcIjpcInRvYXN0LnNjc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmFtZmUtdG9hc3Qge1xcblxcdGZvbnQtc2l6ZTogMC4zMnJlbTsgLy8gMjRweFxcblxcdGxpbmUtaGVpZ2h0OiAwLjQyNjY2N3JlbTsgLy8gMzJweFxcblxcdHBvc2l0aW9uOiBmaXhlZDtcXG5cXHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xcblxcdG1heC13aWR0aDogODAlO1xcblxcdGJvdHRvbTogMi42NjY2NjdyZW07IC8vIDIwMHB4XFxuXFx0bGVmdDogNTAlO1xcblxcdHBhZGRpbmc6IDAuMjEzMzMzcmVtOyAvLyAxNnB4XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogIzAwMDtcXG5cXHRjb2xvcjogI2ZmZjtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0b3BhY2l0eTogMC42O1xcblxcdHRyYW5zaXRpb246IGFsbCAwLjRzIGVhc2UtaW4tb3V0O1xcblxcdGJvcmRlci1yYWRpdXM6IDAuMDY2NjY3cmVtOyAvLyA1cHhcXG5cXHQtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcXG59XFxuXFxuLmFtZmUtdG9hc3QuaGlkZSB7XFxuXFx0b3BhY2l0eTogMDtcXG59XCJdLFwic291cmNlUm9vdFwiOlwid2VicGFjazovL1wifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL34vc2Fzcy1sb2FkZXI/c291cmNlTWFwIS4vfi9tb2RhbHMvc3R5bGVzL3RvYXN0LnNjc3NcbiAqKiBtb2R1bGUgaWQgPSA5NFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBTZW5kZXIgPSByZXF1aXJlKCcuLi9icmlkZ2Uvc2VuZGVyJylcblxudmFyIF9kYXRhID0ge31cblxudmFyIGFuaW1hdGlvbiA9IHtcblxuICAvKipcbiAgICogdHJhbnNpdGlvblxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHJlZiAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtvYmp9IGNvbmZpZyAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGNhbGxiYWNrSWQgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgdHJhbnNpdGlvbjogZnVuY3Rpb24gKHJlZiwgY29uZmlnLCBjYWxsYmFja0lkKSB7XG4gICAgdmFyIHJlZkRhdGEgPSBfZGF0YVtyZWZdXG4gICAgdmFyIHN0eWxlc0tleSA9IEpTT04uc3RyaW5naWZ5KGNvbmZpZy5zdHlsZXMpXG4gICAgdmFyIHdlZXhJbnN0YW5jZSA9IHRoaXNcbiAgICAvLyBJZiB0aGUgc2FtZSBjb21wb25lbnQgcGVyZm9ybSBhIGFuaW1hdGlvbiB3aXRoIGV4YWN0bHkgdGhlIHNhbWVcbiAgICAvLyBzdHlsZXMgaW4gYSBzZXF1ZW5jZSB3aXRoIHNvIHNob3J0IGludGVydmFsIHRoYXQgdGhlIHByZXYgYW5pbWF0aW9uXG4gICAgLy8gaXMgc3RpbGwgaW4gcGxheWluZywgdGhlbiB0aGUgbmV4dCBhbmltYXRpb24gc2hvdWxkIGJlIGlnbm9yZWQuXG4gICAgaWYgKHJlZkRhdGEgJiYgcmVmRGF0YVtzdHlsZXNLZXldKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCFyZWZEYXRhKSB7XG4gICAgICByZWZEYXRhID0gX2RhdGFbcmVmXSA9IHt9XG4gICAgfVxuICAgIHJlZkRhdGFbc3R5bGVzS2V5XSA9IHRydWVcbiAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnRNYW5hZ2VyKCkudHJhbnNpdGlvbihyZWYsIGNvbmZpZywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBzdHlsZXNLZXkgaW4gcmVmRGF0YSBzbyB0aGF0IHRoZSBzYW1lIGFuaW1hdGlvblxuICAgICAgLy8gY2FuIGJlIHBsYXllZCBhZ2FpbiBhZnRlciBjdXJyZW50IGFuaW1hdGlvbiBpcyBhbHJlYWR5IGZpbmlzaGVkLlxuICAgICAgZGVsZXRlIHJlZkRhdGFbc3R5bGVzS2V5XVxuICAgICAgd2VleEluc3RhbmNlLnNlbmRlci5wZXJmb3JtQ2FsbGJhY2soY2FsbGJhY2tJZClcbiAgICB9KVxuICB9XG5cbn1cblxuYW5pbWF0aW9uLl9tZXRhID0ge1xuICBhbmltYXRpb246IFt7XG4gICAgbmFtZTogJ3RyYW5zaXRpb24nLFxuICAgIGFyZ3M6IFsnc3RyaW5nJywgJ29iamVjdCcsICdzdHJpbmcnXVxuICB9XVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGlvblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9hcGkvYW5pbWF0aW9uLmpzXG4gKiogbW9kdWxlIGlkID0gOTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIih0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgJiYgKHdpbmRvdyA9IHtjdHJsOiB7fSwgbGliOiB7fX0pOyF3aW5kb3cuY3RybCAmJiAod2luZG93LmN0cmwgPSB7fSk7IXdpbmRvdy5saWIgJiYgKHdpbmRvdy5saWIgPSB7fSk7IWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhhKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcInZhbFwiLHt2YWx1ZTphLnRvU3RyaW5nKCksZW51bWVyYWJsZTohMH0pLHRoaXMuZ3Q9ZnVuY3Rpb24oYSl7cmV0dXJuIGMuY29tcGFyZSh0aGlzLGEpPjB9LHRoaXMuZ3RlPWZ1bmN0aW9uKGEpe3JldHVybiBjLmNvbXBhcmUodGhpcyxhKT49MH0sdGhpcy5sdD1mdW5jdGlvbihhKXtyZXR1cm4gYy5jb21wYXJlKHRoaXMsYSk8MH0sdGhpcy5sdGU9ZnVuY3Rpb24oYSl7cmV0dXJuIGMuY29tcGFyZSh0aGlzLGEpPD0wfSx0aGlzLmVxPWZ1bmN0aW9uKGEpe3JldHVybiAwPT09Yy5jb21wYXJlKHRoaXMsYSl9fWIuZW52PWIuZW52fHx7fSxjLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZhbH0sYy5wcm90b3R5cGUudmFsdWVPZj1mdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzLnZhbC5zcGxpdChcIi5cIiksYj1bXSxjPTA7YzxhLmxlbmd0aDtjKyspe3ZhciBkPXBhcnNlSW50KGFbY10sMTApO2lzTmFOKGQpJiYoZD0wKTt2YXIgZT1kLnRvU3RyaW5nKCk7ZS5sZW5ndGg8NSYmKGU9QXJyYXkoNi1lLmxlbmd0aCkuam9pbihcIjBcIikrZSksYi5wdXNoKGUpLDE9PT1iLmxlbmd0aCYmYi5wdXNoKFwiLlwiKX1yZXR1cm4gcGFyc2VGbG9hdChiLmpvaW4oXCJcIikpfSxjLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXthPWEudG9TdHJpbmcoKS5zcGxpdChcIi5cIiksYj1iLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpO2Zvcih2YXIgYz0wO2M8YS5sZW5ndGh8fGM8Yi5sZW5ndGg7YysrKXt2YXIgZD1wYXJzZUludChhW2NdLDEwKSxlPXBhcnNlSW50KGJbY10sMTApO2lmKHdpbmRvdy5pc05hTihkKSYmKGQ9MCksd2luZG93LmlzTmFOKGUpJiYoZT0wKSxlPmQpcmV0dXJuLTE7aWYoZD5lKXJldHVybiAxfXJldHVybiAwfSxiLnZlcnNpb249ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBjKGEpfX0od2luZG93LHdpbmRvdy5saWJ8fCh3aW5kb3cubGliPXt9KSksZnVuY3Rpb24oYSxiKXtiLmVudj1iLmVudnx8e307dmFyIGM9YS5sb2NhdGlvbi5zZWFyY2gucmVwbGFjZSgvXlxcPy8sXCJcIik7aWYoYi5lbnYucGFyYW1zPXt9LGMpZm9yKHZhciBkPWMuc3BsaXQoXCImXCIpLGU9MDtlPGQubGVuZ3RoO2UrKyl7ZFtlXT1kW2VdLnNwbGl0KFwiPVwiKTt0cnl7Yi5lbnYucGFyYW1zW2RbZV1bMF1dPWRlY29kZVVSSUNvbXBvbmVudChkW2VdWzFdKX1jYXRjaChmKXtiLmVudi5wYXJhbXNbZFtlXVswXV09ZFtlXVsxXX19fSh3aW5kb3csd2luZG93LmxpYnx8KHdpbmRvdy5saWI9e30pKSxmdW5jdGlvbihhLGIpe2IuZW52PWIuZW52fHx7fTt2YXIgYyxkPWEubmF2aWdhdG9yLnVzZXJBZ2VudDtpZihjPWQubWF0Y2goL1dpbmRvd3NcXHNQaG9uZVxccyg/Ok9TXFxzKT8oW1xcZFxcLl0rKS8pKWIuZW52Lm9zPXtuYW1lOlwiV2luZG93cyBQaG9uZVwiLGlzV2luZG93c1Bob25lOiEwLHZlcnNpb246Y1sxXX07ZWxzZSBpZihkLm1hdGNoKC9TYWZhcmkvKSYmKGM9ZC5tYXRjaCgvQW5kcm9pZFtcXHNcXC9dKFtcXGRcXC5dKykvKSkpYi5lbnYub3M9e3ZlcnNpb246Y1sxXX0sZC5tYXRjaCgvTW9iaWxlXFxzK1NhZmFyaS8pPyhiLmVudi5vcy5uYW1lPVwiQW5kcm9pZFwiLGIuZW52Lm9zLmlzQW5kcm9pZD0hMCk6KGIuZW52Lm9zLm5hbWU9XCJBbmRyb2lkUGFkXCIsYi5lbnYub3MuaXNBbmRyb2lkUGFkPSEwKTtlbHNlIGlmKGM9ZC5tYXRjaCgvKGlQaG9uZXxpUGFkfGlQb2QpLykpe3ZhciBlPWNbMV07Yz1kLm1hdGNoKC9PUyAoW1xcZF9cXC5dKykgbGlrZSBNYWMgT1MgWC8pLGIuZW52Lm9zPXtuYW1lOmUsaXNJUGhvbmU6XCJpUGhvbmVcIj09PWV8fFwiaVBvZFwiPT09ZSxpc0lQYWQ6XCJpUGFkXCI9PT1lLGlzSU9TOiEwLHZlcnNpb246Y1sxXS5zcGxpdChcIl9cIikuam9pbihcIi5cIil9fWVsc2UgYi5lbnYub3M9e25hbWU6XCJ1bmtub3duXCIsdmVyc2lvbjpcIjAuMC4wXCJ9O2IudmVyc2lvbiYmKGIuZW52Lm9zLnZlcnNpb249Yi52ZXJzaW9uKGIuZW52Lm9zLnZlcnNpb24pKX0od2luZG93LHdpbmRvdy5saWJ8fCh3aW5kb3cubGliPXt9KSksZnVuY3Rpb24oYSxiKXtiLmVudj1iLmVudnx8e307dmFyIGMsZD1hLm5hdmlnYXRvci51c2VyQWdlbnQ7KGM9ZC5tYXRjaCgvKD86VUNXRUJ8VUNCcm93c2VyXFwvKShbXFxkXFwuXSspLykpP2IuZW52LmJyb3dzZXI9e25hbWU6XCJVQ1wiLGlzVUM6ITAsdmVyc2lvbjpjWzFdfTooYz1kLm1hdGNoKC9NUVFCcm93c2VyXFwvKFtcXGRcXC5dKykvKSk/Yi5lbnYuYnJvd3Nlcj17bmFtZTpcIlFRXCIsaXNRUTohMCx2ZXJzaW9uOmNbMV19OihjPWQubWF0Y2goL0ZpcmVmb3hcXC8oW1xcZFxcLl0rKS8pKT9iLmVudi5icm93c2VyPXtuYW1lOlwiRmlyZWZveFwiLGlzRmlyZWZveDohMCx2ZXJzaW9uOmNbMV19OihjPWQubWF0Y2goL01TSUVcXHMoW1xcZFxcLl0rKS8pKXx8KGM9ZC5tYXRjaCgvSUVNb2JpbGVcXC8oW1xcZFxcLl0rKS8pKT8oYi5lbnYuYnJvd3Nlcj17dmVyc2lvbjpjWzFdfSxkLm1hdGNoKC9JRU1vYmlsZS8pPyhiLmVudi5icm93c2VyLm5hbWU9XCJJRU1vYmlsZVwiLGIuZW52LmJyb3dzZXIuaXNJRU1vYmlsZT0hMCk6KGIuZW52LmJyb3dzZXIubmFtZT1cIklFXCIsYi5lbnYuYnJvd3Nlci5pc0lFPSEwKSxkLm1hdGNoKC9BbmRyb2lkfGlQaG9uZS8pJiYoYi5lbnYuYnJvd3Nlci5pc0lFTGlrZVdlYmtpdD0hMCkpOihjPWQubWF0Y2goLyg/OkNocm9tZXxDcmlPUylcXC8oW1xcZFxcLl0rKS8pKT8oYi5lbnYuYnJvd3Nlcj17bmFtZTpcIkNocm9tZVwiLGlzQ2hyb21lOiEwLHZlcnNpb246Y1sxXX0sZC5tYXRjaCgvVmVyc2lvblxcL1tcXGQrXFwuXStcXHMqQ2hyb21lLykmJihiLmVudi5icm93c2VyLm5hbWU9XCJDaHJvbWUgV2Vidmlld1wiLGIuZW52LmJyb3dzZXIuaXNXZWJ2aWV3PSEwKSk6ZC5tYXRjaCgvU2FmYXJpLykmJihjPWQubWF0Y2goL0FuZHJvaWRbXFxzXFwvXShbXFxkXFwuXSspLykpP2IuZW52LmJyb3dzZXI9e25hbWU6XCJBbmRyb2lkXCIsaXNBbmRyb2lkOiEwLHZlcnNpb246Y1sxXX06ZC5tYXRjaCgvaVBob25lfGlQYWR8aVBvZC8pP2QubWF0Y2goL1NhZmFyaS8pPyhjPWQubWF0Y2goL1ZlcnNpb25cXC8oW1xcZFxcLl0rKS8pLGIuZW52LmJyb3dzZXI9e25hbWU6XCJTYWZhcmlcIixpc1NhZmFyaTohMCx2ZXJzaW9uOmNbMV19KTooYz1kLm1hdGNoKC9PUyAoW1xcZF9cXC5dKykgbGlrZSBNYWMgT1MgWC8pLGIuZW52LmJyb3dzZXI9e25hbWU6XCJpT1MgV2Vidmlld1wiLGlzV2VidmlldzohMCx2ZXJzaW9uOmNbMV0ucmVwbGFjZSgvXFxfL2csXCIuXCIpfSk6Yi5lbnYuYnJvd3Nlcj17bmFtZTpcInVua25vd25cIix2ZXJzaW9uOlwiMC4wLjBcIn0sYi52ZXJzaW9uJiYoYi5lbnYuYnJvd3Nlci52ZXJzaW9uPWIudmVyc2lvbihiLmVudi5icm93c2VyLnZlcnNpb24pKX0od2luZG93LHdpbmRvdy5saWJ8fCh3aW5kb3cubGliPXt9KSksZnVuY3Rpb24oYSxiKXtiLmVudj1iLmVudnx8e307dmFyIGM9YS5uYXZpZ2F0b3IudXNlckFnZW50O2MubWF0Y2goL1dlaWJvL2kpP2IuZW52LnRoaXJkYXBwPXthcHBuYW1lOlwiV2VpYm9cIixpc1dlaWJvOiEwfTpjLm1hdGNoKC9NaWNyb01lc3Nlbmdlci9pKT9iLmVudi50aGlyZGFwcD17YXBwbmFtZTpcIldlaXhpblwiLGlzV2VpeGluOiEwfTpiLmVudi50aGlyZGFwcD0hMX0od2luZG93LHdpbmRvdy5saWJ8fCh3aW5kb3cubGliPXt9KSksZnVuY3Rpb24oYSxiKXtiLmVudj1iLmVudnx8e307dmFyIGMsZCxlPWEubmF2aWdhdG9yLnVzZXJBZ2VudDsoZD1lLm1hdGNoKC9XaW5kVmFuZVtcXC9cXHNdKFtcXGRcXC5cXF9dKykvKSkmJihjPWRbMV0pO3ZhciBmPSExLGc9XCJcIixoPVwiXCIsaT1cIlwiOyhkPWUubWF0Y2goL0FsaUFwcFxcKChbQS1aXFwtXSspXFwvKFtcXGRcXC5dKylcXCkvaSkpJiYoZj0hMCxnPWRbMV0saT1kWzJdLGg9Zy5pbmRleE9mKFwiLVBEXCIpPjA/Yi5lbnYub3MuaXNJT1M/XCJpUGFkXCI6Yi5lbnYub3MuaXNBbmRyb2lkP1wiQW5kcm9pZFBhZFwiOmIuZW52Lm9zLm5hbWU6Yi5lbnYub3MubmFtZSksIWcmJmUuaW5kZXhPZihcIlRCSU9TXCIpPjAmJihnPVwiVEJcIiksZj9iLmVudi5hbGlhcHA9e3dpbmR2YW5lOmIudmVyc2lvbihjfHxcIjAuMC4wXCIpLGFwcG5hbWU6Z3x8XCJ1bmtvd25cIix2ZXJzaW9uOmIudmVyc2lvbihpfHxcIjAuMC4wXCIpLHBsYXRmb3JtOmh8fGIuZW52Lm9zLm5hbWV9OmIuZW52LmFsaWFwcD0hMSxiLmVudi50YW9iYW9BcHA9Yi5lbnYuYWxpYXBwfSh3aW5kb3csd2luZG93LmxpYnx8KHdpbmRvdy5saWI9e30pKTs7bW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cubGliWydlbnYnXTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9lbnZkL2J1aWxkL2VudmQuY29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gOTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=