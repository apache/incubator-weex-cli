(this.nativeLog || function(s) {console.log(s)})('START JS FRAMEWORK: 0.13.7');
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

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  __webpack_require__(1);
  
  var _framework = __webpack_require__(76);
  
  var framework = _interopRequireWildcard(_framework);
  
  var _package = __webpack_require__(105);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  var _loop = function _loop(methodName) {
      global[methodName] = function () {
          var ret = framework[methodName].apply(framework, arguments);
          if (ret instanceof Error) {
              console.error(ret.toString());
          } else if (ret instanceof Array) {
              ret.forEach(function (r) {
                  if (r instanceof Error) {
                      console.error(r.toString());
                  }
              });
          }
          return ret;
      };
  };
  
  for (var methodName in framework) {
      _loop(methodName);
  }
  
  Object.assign(global, {
      frameworkVersion: _package.version,
      needTransformerVersion: _package.optionalDependencies['weex-transformer']
  });
  
  /**
   * register methods
   */
  var methods = __webpack_require__(106);
  var _global = global;
  var registerMethods = _global.registerMethods;
  
  registerMethods(methods);
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  __webpack_require__(2);
  
  __webpack_require__(40);
  
  __webpack_require__(74);
  
  __webpack_require__(75);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  __webpack_require__(3);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  __webpack_require__(4);
  module.exports = __webpack_require__(7).Object.assign;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 19.1.3.1 Object.assign(target, source)
  var $export = __webpack_require__(5);
  
  $export($export.S + $export.F, 'Object', { assign: __webpack_require__(23) });

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var global = __webpack_require__(6),
      core = __webpack_require__(7),
      hide = __webpack_require__(8),
      redefine = __webpack_require__(18),
      ctx = __webpack_require__(21),
      PROTOTYPE = 'prototype';
  
  var $export = function $export(type, name, source) {
    var IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_STATIC = type & $export.S,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE],
        exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
        expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {}),
        key,
        own,
        out,
        exp;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      // export native or passed
      out = (own ? target : source)[key];
      // bind timers to global for call from export context
      exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      // extend global
      if (target) redefine(target, key, out, type & $export.U);
      // export
      if (exports[key] != out) hide(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };
  global.core = core;
  // type bitmap
  $export.F = 1; // forced
  $export.G = 2; // global
  $export.S = 4; // static
  $export.P = 8; // proto
  $export.B = 16; // bind
  $export.W = 32; // wrap
  $export.U = 64; // safe
  $export.R = 128; // real proto method for `library`
  module.exports = $export;

/***/ },
/* 6 */
/***/ function(module, exports) {

  'use strict';
  
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports) {

  'use strict';
  
  var core = module.exports = { version: '2.1.5' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var dP = __webpack_require__(9),
      createDesc = __webpack_require__(17);
  module.exports = __webpack_require__(13) ? function (object, key, value) {
    return dP.f(object, key, createDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var anObject = __webpack_require__(10),
      IE8_DOM_DEFINE = __webpack_require__(12),
      toPrimitive = __webpack_require__(16),
      dP = Object.defineProperty;
  
  exports.f = __webpack_require__(13) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return dP(O, P, Attributes);
    } catch (e) {/* empty */}
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var isObject = __webpack_require__(11);
  module.exports = function (it) {
    if (!isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

/***/ },
/* 11 */
/***/ function(module, exports) {

  'use strict';
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
  
  module.exports = function (it) {
    return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
  };

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  module.exports = !__webpack_require__(13) && !__webpack_require__(14)(function () {
    return Object.defineProperty(__webpack_require__(15)('div'), 'a', { get: function get() {
        return 7;
      } }).a != 7;
  });

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // Thank's IE8 for his funny defineProperty
  module.exports = !__webpack_require__(14)(function () {
    return Object.defineProperty({}, 'a', { get: function get() {
        return 7;
      } }).a != 7;
  });

/***/ },
/* 14 */
/***/ function(module, exports) {

  "use strict";
  
  module.exports = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var isObject = __webpack_require__(11),
      document = __webpack_require__(6).document
  // in old IE typeof document.createElement is 'object'
  ,
      is = isObject(document) && isObject(document.createElement);
  module.exports = function (it) {
    return is ? document.createElement(it) : {};
  };

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 7.1.1 ToPrimitive(input [, PreferredType])
  var isObject = __webpack_require__(11);
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  module.exports = function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

/***/ },
/* 17 */
/***/ function(module, exports) {

  "use strict";
  
  module.exports = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var global = __webpack_require__(6),
      hide = __webpack_require__(8),
      has = __webpack_require__(19),
      SRC = __webpack_require__(20)('src'),
      TO_STRING = 'toString',
      $toString = Function[TO_STRING],
      TPL = ('' + $toString).split(TO_STRING);
  
  __webpack_require__(7).inspectSource = function (it) {
    return $toString.call(it);
  };
  
  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) has(val, 'name') || hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === global) {
      O[key] = val;
    } else {
      if (!safe) {
        delete O[key];
        hide(O, key, val);
      } else {
        if (O[key]) O[key] = val;else hide(O, key, val);
      }
    }
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });

/***/ },
/* 19 */
/***/ function(module, exports) {

  "use strict";
  
  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

/***/ },
/* 20 */
/***/ function(module, exports) {

  'use strict';
  
  var id = 0,
      px = Math.random();
  module.exports = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // optional / simple context binding
  var aFunction = __webpack_require__(22);
  module.exports = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function () /* ...args */{
      return fn.apply(that, arguments);
    };
  };

/***/ },
/* 22 */
/***/ function(module, exports) {

  'use strict';
  
  module.exports = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  // 19.1.2.1 Object.assign(target, source, ...)
  
  var getKeys = __webpack_require__(24),
      gOPS = __webpack_require__(37),
      pIE = __webpack_require__(38),
      toObject = __webpack_require__(39),
      IObject = __webpack_require__(27),
      $assign = Object.assign;
  
  // should work with symbols and should have deterministic property order (V8 bug)
  module.exports = !$assign || __webpack_require__(14)(function () {
    var A = {},
        B = {},
        S = Symbol(),
        K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function (k) {
      B[k] = k;
    });
    return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars
    var T = toObject(target),
        aLen = arguments.length,
        index = 1,
        getSymbols = gOPS.f,
        isEnum = pIE.f;
    while (aLen > index) {
      var S = IObject(arguments[index++]),
          keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
          length = keys.length,
          j = 0,
          key;
      while (length > j) {
        if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
      }
    }return T;
  } : $assign;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  var $keys = __webpack_require__(25),
      enumBugKeys = __webpack_require__(36);
  
  module.exports = Object.keys || function keys(O) {
    return $keys(O, enumBugKeys);
  };

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var has = __webpack_require__(19),
      toIObject = __webpack_require__(26),
      arrayIndexOf = __webpack_require__(30)(false),
      IE_PROTO = __webpack_require__(34)('IE_PROTO');
  
  module.exports = function (object, names) {
    var O = toIObject(object),
        i = 0,
        result = [],
        key;
    for (key in O) {
      if (key != IE_PROTO) has(O, key) && result.push(key);
    } // Don't enum bug & hidden keys
    while (names.length > i) {
      if (has(O, key = names[i++])) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
    }return result;
  };

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // to indexed object, toObject with fallback for non-array-like ES3 strings
  var IObject = __webpack_require__(27),
      defined = __webpack_require__(29);
  module.exports = function (it) {
    return IObject(defined(it));
  };

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var cof = __webpack_require__(28);
  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };

/***/ },
/* 28 */
/***/ function(module, exports) {

  "use strict";
  
  var toString = {}.toString;
  
  module.exports = function (it) {
    return toString.call(it).slice(8, -1);
  };

/***/ },
/* 29 */
/***/ function(module, exports) {

  "use strict";
  
  // 7.2.1 RequireObjectCoercible(argument)
  module.exports = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // false -> Array#indexOf
  // true  -> Array#includes
  var toIObject = __webpack_require__(26),
      toLength = __webpack_require__(31),
      toIndex = __webpack_require__(33);
  module.exports = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIObject($this),
          length = toLength(O.length),
          index = toIndex(fromIndex, length),
          value;
      // Array#includes uses SameValueZero equality algorithm
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        if (value != value) return true;
        // Array#toIndex ignores holes, Array#includes - not
      } else for (; length > index; index++) {
          if (IS_INCLUDES || index in O) {
            if (O[index] === el) return IS_INCLUDES || index;
          }
        }return !IS_INCLUDES && -1;
    };
  };

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 7.1.15 ToLength
  var toInteger = __webpack_require__(32),
      min = Math.min;
  module.exports = function (it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

/***/ },
/* 32 */
/***/ function(module, exports) {

  "use strict";
  
  // 7.1.4 ToInteger
  var ceil = Math.ceil,
      floor = Math.floor;
  module.exports = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var toInteger = __webpack_require__(32),
      max = Math.max,
      min = Math.min;
  module.exports = function (index, length) {
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  };

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var shared = __webpack_require__(35)('keys'),
      uid = __webpack_require__(20);
  module.exports = function (key) {
    return shared[key] || (shared[key] = uid(key));
  };

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var global = __webpack_require__(6),
      SHARED = '__core-js_shared__',
      store = global[SHARED] || (global[SHARED] = {});
  module.exports = function (key) {
    return store[key] || (store[key] = {});
  };

/***/ },
/* 36 */
/***/ function(module, exports) {

  'use strict';
  
  // IE 8- don't enum bug keys
  module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

/***/ },
/* 37 */
/***/ function(module, exports) {

  "use strict";
  
  exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 38 */
/***/ function(module, exports) {

  "use strict";
  
  exports.f = {}.propertyIsEnumerable;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 7.1.13 ToObject(argument)
  var defined = __webpack_require__(29);
  module.exports = function (it) {
    return Object(defined(it));
  };

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  // fix Promise Problem on JSContext of iOS7~8
  // @see https://bugs.webkit.org/show_bug.cgi?id=135866
  global.Promise = null;
  __webpack_require__(41);
  __webpack_require__(44);
  __webpack_require__(55);
  __webpack_require__(59);
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  // 19.1.3.6 Object.prototype.toString()
  
  var classof = __webpack_require__(42),
      test = {};
  test[__webpack_require__(43)('toStringTag')] = 'z';
  if (test + '' != '[object z]') {
    __webpack_require__(18)(Object.prototype, 'toString', function toString() {
      return '[object ' + classof(this) + ']';
    }, true);
  }

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // getting tag from 19.1.3.6 Object.prototype.toString()
  var cof = __webpack_require__(28),
      TAG = __webpack_require__(43)('toStringTag')
  // ES3 wrong here
  ,
      ARG = cof(function () {
    return arguments;
  }()) == 'Arguments';
  
  // fallback for IE11 Script Access Denied error
  var tryGet = function tryGet(it, key) {
    try {
      return it[key];
    } catch (e) {/* empty */}
  };
  
  module.exports = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var store = __webpack_require__(35)('wks'),
      uid = __webpack_require__(20),
      _Symbol = __webpack_require__(6).Symbol,
      USE_SYMBOL = typeof _Symbol == 'function';
  module.exports = function (name) {
    return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
  };

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var $at = __webpack_require__(45)(true);
  
  // 21.1.3.27 String.prototype[@@iterator]()
  __webpack_require__(46)(String, 'String', function (iterated) {
    this._t = String(iterated); // target
    this._i = 0; // next index
    // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function () {
    var O = this._t,
        index = this._i,
        point;
    if (index >= O.length) return { value: undefined, done: true };
    point = $at(O, index);
    this._i += point.length;
    return { value: point, done: false };
  });

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var toInteger = __webpack_require__(32),
      defined = __webpack_require__(29);
  // true  -> String#at
  // false -> String#codePointAt
  module.exports = function (TO_STRING) {
    return function (that, pos) {
      var s = String(defined(that)),
          i = toInteger(pos),
          l = s.length,
          a,
          b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var LIBRARY = __webpack_require__(47),
      $export = __webpack_require__(5),
      redefine = __webpack_require__(18),
      hide = __webpack_require__(8),
      has = __webpack_require__(19),
      Iterators = __webpack_require__(48),
      $iterCreate = __webpack_require__(49),
      setToStringTag = __webpack_require__(53),
      getPrototypeOf = __webpack_require__(54),
      ITERATOR = __webpack_require__(43)('iterator'),
      BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  ,
      FF_ITERATOR = '@@iterator',
      KEYS = 'keys',
      VALUES = 'values';
  
  var returnThis = function returnThis() {
    return this;
  };
  
  module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);
    var getMethod = function getMethod(kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };
        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }return function entries() {
        return new Constructor(this, kind);
      };
    };
    var TAG = NAME + ' Iterator',
        DEF_VALUES = DEFAULT == VALUES,
        VALUES_BUG = false,
        proto = Base.prototype,
        $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
        $default = $native || getMethod(DEFAULT),
        $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
        $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
        methods,
        key,
        IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype) {
        // Set @@toStringTag to native iterators
        setToStringTag(IteratorPrototype, TAG, true);
        // fix for some old engines
        if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() {
        return $native.call(this);
      };
    }
    // Define iterator
    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      hide(proto, ITERATOR, $default);
    }
    // Plug for library
    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) redefine(proto, key, methods[key]);
      } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };

/***/ },
/* 47 */
/***/ function(module, exports) {

  "use strict";
  
  module.exports = false;

/***/ },
/* 48 */
/***/ function(module, exports) {

  "use strict";
  
  module.exports = {};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var create = __webpack_require__(50),
      descriptor = __webpack_require__(17),
      setToStringTag = __webpack_require__(53),
      IteratorPrototype = {};
  
  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  __webpack_require__(8)(IteratorPrototype, __webpack_require__(43)('iterator'), function () {
    return this;
  });
  
  module.exports = function (Constructor, NAME, next) {
    Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
    setToStringTag(Constructor, NAME + ' Iterator');
  };

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  var anObject = __webpack_require__(10),
      dPs = __webpack_require__(51),
      enumBugKeys = __webpack_require__(36),
      IE_PROTO = __webpack_require__(34)('IE_PROTO'),
      Empty = function Empty() {/* empty */},
      PROTOTYPE = 'prototype';
  
  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var _createDict = function createDict() {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = __webpack_require__(15)('iframe'),
        i = enumBugKeys.length,
        gt = '>',
        iframeDocument;
    iframe.style.display = 'none';
    __webpack_require__(52).appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write('<script>document.F=Object</script' + gt);
    iframeDocument.close();
    _createDict = iframeDocument.F;
    while (i--) {
      delete _createDict[PROTOTYPE][enumBugKeys[i]];
    }return _createDict();
  };
  
  module.exports = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE] = anObject(O);
      result = new Empty();
      Empty[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = _createDict();
    return Properties === undefined ? result : dPs(result, Properties);
  };

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var dP = __webpack_require__(9),
      anObject = __webpack_require__(10),
      getKeys = __webpack_require__(24);
  
  module.exports = __webpack_require__(13) ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = getKeys(Properties),
        length = keys.length,
        i = 0,
        P;
    while (length > i) {
      dP.f(O, P = keys[i++], Properties[P]);
    }return O;
  };

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  module.exports = __webpack_require__(6).document && document.documentElement;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var def = __webpack_require__(9).f,
      has = __webpack_require__(19),
      TAG = __webpack_require__(43)('toStringTag');
  
  module.exports = function (it, tag, stat) {
    if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
  };

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  var has = __webpack_require__(19),
      toObject = __webpack_require__(39),
      IE_PROTO = __webpack_require__(34)('IE_PROTO'),
      ObjectProto = Object.prototype;
  
  module.exports = Object.getPrototypeOf || function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO)) return O[IE_PROTO];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    }return O instanceof Object ? ObjectProto : null;
  };

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var $iterators = __webpack_require__(56),
      redefine = __webpack_require__(18),
      global = __webpack_require__(6),
      hide = __webpack_require__(8),
      Iterators = __webpack_require__(48),
      wks = __webpack_require__(43),
      ITERATOR = wks('iterator'),
      TO_STRING_TAG = wks('toStringTag'),
      ArrayValues = Iterators.Array;
  
  for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
    var NAME = collections[i],
        Collection = global[NAME],
        proto = Collection && Collection.prototype,
        key;
    if (proto) {
      if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
      if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
      Iterators[NAME] = ArrayValues;
      for (key in $iterators) {
        if (!proto[key]) redefine(proto, key, $iterators[key], true);
      }
    }
  }

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var addToUnscopables = __webpack_require__(57),
      step = __webpack_require__(58),
      Iterators = __webpack_require__(48),
      toIObject = __webpack_require__(26);
  
  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  module.exports = __webpack_require__(46)(Array, 'Array', function (iterated, kind) {
    this._t = toIObject(iterated); // target
    this._i = 0; // next index
    this._k = kind; // kind
    // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t,
        kind = this._k,
        index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return step(1);
    }
    if (kind == 'keys') return step(0, index);
    if (kind == 'values') return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'values');
  
  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  Iterators.Arguments = Iterators.Array;
  
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = __webpack_require__(43)('unscopables'),
      ArrayProto = Array.prototype;
  if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(8)(ArrayProto, UNSCOPABLES, {});
  module.exports = function (key) {
    ArrayProto[UNSCOPABLES][key] = true;
  };

/***/ },
/* 58 */
/***/ function(module, exports) {

  "use strict";
  
  module.exports = function (done, value) {
    return { value: value, done: !!done };
  };

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var LIBRARY = __webpack_require__(47),
      global = __webpack_require__(6),
      ctx = __webpack_require__(21),
      classof = __webpack_require__(42),
      $export = __webpack_require__(5),
      isObject = __webpack_require__(11),
      anObject = __webpack_require__(10),
      aFunction = __webpack_require__(22),
      anInstance = __webpack_require__(60),
      forOf = __webpack_require__(61),
      setProto = __webpack_require__(65).set,
      speciesConstructor = __webpack_require__(67),
      task = __webpack_require__(68).set,
      microtask = __webpack_require__(70),
      PROMISE = 'Promise',
      TypeError = global.TypeError,
      process = global.process,
      $Promise = global[PROMISE],
      process = global.process,
      isNode = classof(process) == 'process',
      empty = function empty() {/* empty */},
      Internal,
      GenericPromiseCapability,
      Wrapper;
  
  var USE_NATIVE = !!function () {
    try {
      // correct subclassing with @@species support
      var promise = $Promise.resolve(1),
          FakePromise = (promise.constructor = {})[__webpack_require__(43)('species')] = function (exec) {
        exec(empty, empty);
      };
      // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
    } catch (e) {/* empty */}
  }();
  
  // helpers
  var sameConstructor = function sameConstructor(a, b) {
    // with library wrapper special case
    return a === b || a === $Promise && b === Wrapper;
  };
  var isThenable = function isThenable(it) {
    var then;
    return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };
  var newPromiseCapability = function newPromiseCapability(C) {
    return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
  };
  var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction(resolve);
    this.reject = aFunction(reject);
  };
  var perform = function perform(exec) {
    try {
      exec();
    } catch (e) {
      return { error: e };
    }
  };
  var notify = function notify(promise, isReject) {
    if (promise._n) return;
    promise._n = true;
    var chain = promise._c;
    microtask(function () {
      var value = promise._v,
          ok = promise._s == 1,
          i = 0;
      var run = function run(reaction) {
        var handler = ok ? reaction.ok : reaction.fail,
            resolve = reaction.resolve,
            reject = reaction.reject,
            domain = reaction.domain,
            result,
            then;
        try {
          if (handler) {
            if (!ok) {
              if (promise._h == 2) onHandleUnhandled(promise);
              promise._h = 1;
            }
            if (handler === true) result = value;else {
              if (domain) domain.enter();
              result = handler(value);
              if (domain) domain.exit();
            }
            if (result === reaction.promise) {
              reject(TypeError('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (e) {
          reject(e);
        }
      };
      while (chain.length > i) {
        run(chain[i++]);
      } // variable length - can't use forEach
      promise._c = [];
      promise._n = false;
      if (isReject && !promise._h) onUnhandled(promise);
    });
  };
  var onUnhandled = function onUnhandled(promise) {
    task.call(global, function () {
      var value = promise._v,
          abrupt,
          handler,
          console;
      if (isUnhandled(promise)) {
        abrupt = perform(function () {
          if (isNode) {
            process.emit('unhandledRejection', value, promise);
          } else if (handler = global.onunhandledrejection) {
            handler({ promise: promise, reason: value });
          } else if ((console = global.console) && console.error) {
            console.error('Unhandled promise rejection', value);
          }
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        promise._h = isNode || isUnhandled(promise) ? 2 : 1;
      }promise._a = undefined;
      if (abrupt) throw abrupt.error;
    });
  };
  var isUnhandled = function isUnhandled(promise) {
    if (promise._h == 1) return false;
    var chain = promise._a || promise._c,
        i = 0,
        reaction;
    while (chain.length > i) {
      reaction = chain[i++];
      if (reaction.fail || !isUnhandled(reaction.promise)) return false;
    }return true;
  };
  var onHandleUnhandled = function onHandleUnhandled(promise) {
    task.call(global, function () {
      var handler;
      if (isNode) {
        process.emit('rejectionHandled', promise);
      } else if (handler = global.onrejectionhandled) {
        handler({ promise: promise, reason: promise._v });
      }
    });
  };
  var $reject = function $reject(value) {
    var promise = this;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap
    promise._v = value;
    promise._s = 2;
    if (!promise._a) promise._a = promise._c.slice();
    notify(promise, true);
  };
  var $resolve = function $resolve(value) {
    var promise = this,
        then;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap
    try {
      if (promise === value) throw TypeError("Promise can't be resolved itself");
      if (then = isThenable(value)) {
        microtask(function () {
          var wrapper = { _w: promise, _d: false }; // wrap
          try {
            then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
          } catch (e) {
            $reject.call(wrapper, e);
          }
        });
      } else {
        promise._v = value;
        promise._s = 1;
        notify(promise, false);
      }
    } catch (e) {
      $reject.call({ _w: promise, _d: false }, e); // wrap
    }
  };
  
  // constructor polyfill
  if (!USE_NATIVE) {
    // 25.4.3.1 Promise(executor)
    $Promise = function Promise(executor) {
      anInstance(this, $Promise, PROMISE, '_h');
      aFunction(executor);
      Internal.call(this);
      try {
        executor(ctx($resolve, this, 1), ctx($reject, this, 1));
      } catch (err) {
        $reject.call(this, err);
      }
    };
    Internal = function Promise(executor) {
      this._c = []; // <- awaiting reactions
      this._a = undefined; // <- checked in isUnhandled reactions
      this._s = 0; // <- state
      this._d = false; // <- done
      this._v = undefined; // <- value
      this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
      this._n = false; // <- notify
    };
    Internal.prototype = __webpack_require__(71)($Promise.prototype, {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function then(onFulfilled, onRejected) {
        var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = isNode ? process.domain : undefined;
        this._c.push(reaction);
        if (this._a) this._a.push(reaction);
        if (this._s) notify(this, false);
        return reaction.promise;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function _catch(onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    PromiseCapability = function PromiseCapability() {
      var promise = new Internal();
      this.promise = promise;
      this.resolve = ctx($resolve, promise, 1);
      this.reject = ctx($reject, promise, 1);
    };
  }
  
  $export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
  __webpack_require__(53)($Promise, PROMISE);
  __webpack_require__(72)(PROMISE);
  Wrapper = __webpack_require__(7)[PROMISE];
  
  // statics
  $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
    // 25.4.4.5 Promise.reject(r)
    reject: function reject(r) {
      var capability = newPromiseCapability(this),
          $$reject = capability.reject;
      $$reject(r);
      return capability.promise;
    }
  });
  $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
    // 25.4.4.6 Promise.resolve(x)
    resolve: function resolve(x) {
      // instanceof instead of internal slot check because we should fix it without replacement native Promise core
      if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
      var capability = newPromiseCapability(this),
          $$resolve = capability.resolve;
      $$resolve(x);
      return capability.promise;
    }
  });
  $export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(73)(function (iter) {
    $Promise.all(iter)['catch'](empty);
  })), PROMISE, {
    // 25.4.4.1 Promise.all(iterable)
    all: function all(iterable) {
      var C = this,
          capability = newPromiseCapability(C),
          resolve = capability.resolve,
          reject = capability.reject;
      var abrupt = perform(function () {
        var values = [],
            index = 0,
            remaining = 1;
        forOf(iterable, false, function (promise) {
          var $index = index++,
              alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[$index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (abrupt) reject(abrupt.error);
      return capability.promise;
    },
    // 25.4.4.4 Promise.race(iterable)
    race: function race(iterable) {
      var C = this,
          capability = newPromiseCapability(C),
          reject = capability.reject;
      var abrupt = perform(function () {
        forOf(iterable, false, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (abrupt) reject(abrupt.error);
      return capability.promise;
    }
  });

/***/ },
/* 60 */
/***/ function(module, exports) {

  'use strict';
  
  module.exports = function (it, Constructor, name, forbiddenField) {
    if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
      throw TypeError(name + ': incorrect invocation!');
    }return it;
  };

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var ctx = __webpack_require__(21),
      call = __webpack_require__(62),
      isArrayIter = __webpack_require__(63),
      anObject = __webpack_require__(10),
      toLength = __webpack_require__(31),
      getIterFn = __webpack_require__(64);
  module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () {
      return iterable;
    } : getIterFn(iterable),
        f = ctx(fn, that, entries ? 2 : 1),
        index = 0,
        length,
        step,
        iterator;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
    // fast case for arrays with default iterator
    if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
      entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      call(iterator, f, step.value, entries);
    }
  };

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // call something on iterator step with safe closing on error
  var anObject = __webpack_require__(10);
  module.exports = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(anObject(value)[0], value[1]) : fn(value);
      // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) anObject(ret.call(iterator));
      throw e;
    }
  };

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // check on default Array iterator
  var Iterators = __webpack_require__(48),
      ITERATOR = __webpack_require__(43)('iterator'),
      ArrayProto = Array.prototype;
  
  module.exports = function (it) {
    return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
  };

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var classof = __webpack_require__(42),
      ITERATOR = __webpack_require__(43)('iterator'),
      Iterators = __webpack_require__(48);
  module.exports = __webpack_require__(7).getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
  };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */
  var isObject = __webpack_require__(11),
      anObject = __webpack_require__(10);
  var check = function check(O, proto) {
    anObject(O);
    if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
  };
  module.exports = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(21)(Function.call, __webpack_require__(66).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) {
        buggy = true;
      }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
    check: check
  };

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var pIE = __webpack_require__(38),
      createDesc = __webpack_require__(17),
      toIObject = __webpack_require__(26),
      toPrimitive = __webpack_require__(16),
      has = __webpack_require__(19),
      IE8_DOM_DEFINE = __webpack_require__(12),
      gOPD = Object.getOwnPropertyDescriptor;
  
  exports.f = __webpack_require__(13) ? gOPD : function getOwnPropertyDescriptor(O, P) {
    O = toIObject(O);
    P = toPrimitive(P, true);
    if (IE8_DOM_DEFINE) try {
      return gOPD(O, P);
    } catch (e) {/* empty */}
    if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
  };

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // 7.3.20 SpeciesConstructor(O, defaultConstructor)
  var anObject = __webpack_require__(10),
      aFunction = __webpack_require__(22),
      SPECIES = __webpack_require__(43)('species');
  module.exports = function (O, D) {
    var C = anObject(O).constructor,
        S;
    return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
  };

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var ctx = __webpack_require__(21),
      invoke = __webpack_require__(69),
      html = __webpack_require__(52),
      cel = __webpack_require__(15),
      global = __webpack_require__(6),
      process = global.process,
      setTask = global.setImmediate,
      clearTask = global.clearImmediate,
      MessageChannel = global.MessageChannel,
      counter = 0,
      queue = {},
      ONREADYSTATECHANGE = 'onreadystatechange',
      defer,
      channel,
      port;
  var run = function run() {
    var id = +this;
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };
  var listener = function listener(event) {
    run.call(event.data);
  };
  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!setTask || !clearTask) {
    setTask = function setImmediate(fn) {
      var args = [],
          i = 1;
      while (arguments.length > i) {
        args.push(arguments[i++]);
      }queue[++counter] = function () {
        invoke(typeof fn == 'function' ? fn : Function(fn), args);
      };
      defer(counter);
      return counter;
    };
    clearTask = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (__webpack_require__(28)(process) == 'process') {
      defer = function defer(id) {
        process.nextTick(ctx(run, id, 1));
      };
      // Browsers with MessageChannel, includes WebWorkers
    } else if (MessageChannel) {
        channel = new MessageChannel();
        port = channel.port2;
        channel.port1.onmessage = listener;
        defer = ctx(port.postMessage, port, 1);
        // Browsers with postMessage, skip WebWorkers
        // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
      } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
          defer = function defer(id) {
            global.postMessage(id + '', '*');
          };
          global.addEventListener('message', listener, false);
          // IE8-
        } else if (ONREADYSTATECHANGE in cel('script')) {
            defer = function defer(id) {
              html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
                html.removeChild(this);
                run.call(id);
              };
            };
            // Rest old browsers
          } else {
              defer = function defer(id) {
                setTimeout(ctx(run, id, 1), 0);
              };
            }
  }
  module.exports = {
    set: setTask,
    clear: clearTask
  };

/***/ },
/* 69 */
/***/ function(module, exports) {

  "use strict";
  
  // fast apply, http://jsperf.lnkit.com/fast-apply/5
  module.exports = function (fn, args, that) {
                    var un = that === undefined;
                    switch (args.length) {
                                      case 0:
                                                        return un ? fn() : fn.call(that);
                                      case 1:
                                                        return un ? fn(args[0]) : fn.call(that, args[0]);
                                      case 2:
                                                        return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                      case 3:
                                                        return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                      case 4:
                                                        return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                    }return fn.apply(that, args);
  };

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var global = __webpack_require__(6),
      macrotask = __webpack_require__(68).set,
      Observer = global.MutationObserver || global.WebKitMutationObserver,
      process = global.process,
      Promise = global.Promise,
      isNode = __webpack_require__(28)(process) == 'process',
      head,
      last,
      notify;
  
  var flush = function flush() {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      fn(); // <- currently we use it only for Promise - try / catch not required
      head = head.next;
    }last = undefined;
    if (parent) parent.enter();
  };
  
  // Node.js
  if (isNode) {
    notify = function notify() {
      process.nextTick(flush);
    };
    // browsers with MutationObserver
  } else if (Observer) {
      var toggle = true,
          node = document.createTextNode('');
      new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
      notify = function notify() {
        node.data = toggle = !toggle;
      };
      // environments with maybe non-completely correct, but existent Promise
    } else if (Promise && Promise.resolve) {
        notify = function notify() {
          Promise.resolve().then(flush);
        };
        // for other environments - macrotask based on:
        // - setImmediate
        // - MessageChannel
        // - window.postMessag
        // - onreadystatechange
        // - setTimeout
      } else {
          notify = function notify() {
            // strange IE + webpack dev server bug - use .call(global)
            macrotask.call(global, flush);
          };
        }
  
  module.exports = function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }last = task;
  };

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var redefine = __webpack_require__(18);
  module.exports = function (target, src, safe) {
    for (var key in src) {
      redefine(target, key, src[key], safe);
    }return target;
  };

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var global = __webpack_require__(6),
      dP = __webpack_require__(9),
      DESCRIPTORS = __webpack_require__(13),
      SPECIES = __webpack_require__(43)('species');
  
  module.exports = function (KEY) {
    var C = global[KEY];
    if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
      configurable: true,
      get: function get() {
        return this;
      }
    });
  };

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var ITERATOR = __webpack_require__(43)('iterator'),
      SAFE_CLOSING = false;
  
  try {
    var riter = [7][ITERATOR]();
    riter['return'] = function () {
      SAFE_CLOSING = true;
    };
    Array.from(riter, function () {
      throw 2;
    });
  } catch (e) {/* empty */}
  
  module.exports = function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;
    try {
      var arr = [7],
          iter = arr[ITERATOR]();
      iter.next = function () {
        safe = true;
      };
      arr[ITERATOR] = function () {
        return iter;
      };
      exec(arr);
    } catch (e) {/* empty */}
    return safe;
  };

/***/ },
/* 74 */
/***/ function(module, exports) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  var _global = global;
  var setTimeout = _global.setTimeout;
  var setTimeoutNative = _global.setTimeoutNative;
  
  // fix no setTimeout on Android V8
  
  if (typeof setTimeout === 'undefined' && typeof setTimeoutNative === 'function') {
    (function () {
      var timeoutMap = {};
      var timeoutId = 0;
      global.setTimeout = function (cb, time) {
        timeoutMap[++timeoutId] = cb;
        setTimeoutNative(timeoutId.toString(), time);
      };
      global.setTimeoutCallback = function (id) {
        if (typeof timeoutMap[id] === 'function') {
          timeoutMap[id]();
          delete timeoutMap[id];
        }
      };
    })();
  }
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 75 */
/***/ function(module, exports) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  var _global = global;
  var console = _global.console;
  
  
  if (typeof console === 'undefined') {
    global.console = {
      log: function log() {
        if (typeof nativeLog === 'function') {
          nativeLog.apply(undefined, arguments);
        }
      },
      error: function error() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
  
        throw new Error(args);
      }
    };
  }
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                     * @fileOverview Main entry, instance manager
                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                     * - createInstance(instanceId, code, options, data)
                                                                                                                                                                                                                                                     * - refreshInstance(instanceId, data)
                                                                                                                                                                                                                                                     * - destroyInstance(instanceId)
                                                                                                                                                                                                                                                     * - registerComponents(components)
                                                                                                                                                                                                                                                     * - registerModules(modules)
                                                                                                                                                                                                                                                     * - getRoot(instanceId)
                                                                                                                                                                                                                                                     * - instanceMap
                                                                                                                                                                                                                                                     * - callJS(instanceId, tasks)
                                                                                                                                                                                                                                                     *   - fireEvent(ref, type, data)
                                                                                                                                                                                                                                                     *   - callback(funcId, data)
                                                                                                                                                                                                                                                     */
  
  exports.createInstance = createInstance;
  exports.refreshInstance = refreshInstance;
  exports.destroyInstance = destroyInstance;
  exports.registerComponents = registerComponents;
  exports.registerModules = registerModules;
  exports.registerMethods = registerMethods;
  exports.getRoot = getRoot;
  exports.callJS = callJS;
  
  var _perf = __webpack_require__(77);
  
  var perf = _interopRequireWildcard(_perf);
  
  var _config = __webpack_require__(79);
  
  var config = _interopRequireWildcard(_config);
  
  var _app = __webpack_require__(80);
  
  var _app2 = _interopRequireDefault(_app);
  
  var _vm = __webpack_require__(85);
  
  var _vm2 = _interopRequireDefault(_vm);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
  
  var nativeComponentMap = config.nativeComponentMap;
  
  var instanceMap = {};
  
  /**
   * create a Weex instance
   *
   * @param  {string} instanceId
   * @param  {string} code
   * @param  {object} [options] option `HAS_LOG` enable print log
   * @param  {object} [data]
   */
  function createInstance(instanceId, code, options, data) {
    var instance = instanceMap[instanceId];
    options = options || {};
  
    config.debug = options.debug;
  
    var result;
    if (!instance) {
      perf.start('createInstance', instanceId);
      instance = new _app2.default(instanceId, options);
      instanceMap[instanceId] = instance;
      result = instance.init(code, data);
      perf.end('createInstance', instanceId);
    } else {
      result = new Error('invalid instance id "' + instanceId + '"');
    }
  
    return result;
  }
  
  /**
   * refresh a Weex instance
   *
   * @param  {string} instanceId
   * @param  {object} data
   */
  function refreshInstance(instanceId, data) {
    var instance = instanceMap[instanceId];
    var result;
    if (instance) {
      perf.start('refreshData', instanceId);
      result = instance.refreshData(data);
      perf.end('refreshData', instanceId);
    } else {
      result = new Error('invalid instance id "' + instanceId + '"');
    }
    return result;
  }
  
  /**
   * destroy a Weex instance
   * @param  {string} instanceId
   */
  function destroyInstance(instanceId) {
    var instance = instanceMap[instanceId];
    if (!instance) {
      return new Error('invalid instance id "' + instanceId + '"');
    }
  
    perf.start('destroyInstance', instanceId);
    instance.destroy();
    delete instanceMap[instanceId];
    perf.end('destroyInstance', instanceId);
  
    return instanceMap;
  }
  
  /**
   * register the name of each native component
   * @param  {array} components array of name
   */
  function registerComponents(components) {
    if (Array.isArray(components)) {
      components.forEach(function register(name) {
        /* istanbul ignore if */
        if (!name) {
          return;
        }
        if (typeof name === 'string') {
          nativeComponentMap[name] = true;
        } else if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' && typeof name.type === 'string') {
          nativeComponentMap[name.type] = name;
        }
      });
    }
  }
  
  /**
   * register the name and methods of each module
   * @param  {object} modules a object of modules
   */
  function registerModules(modules) {
    if ((typeof modules === 'undefined' ? 'undefined' : _typeof(modules)) === 'object') {
      _vm2.default.registerModules(modules);
    }
  }
  
  /**
   * register the name and methods of each api
   * @param  {object} apis a object of apis
   */
  function registerMethods(apis) {
    if ((typeof apis === 'undefined' ? 'undefined' : _typeof(apis)) === 'object') {
      _vm2.default.registerMethods(apis);
    }
  }
  
  /**
   * get a whole element tree of an instance
   * for debugging
   * @param  {string} instanceId
   * @return {object} a virtual dom tree
   */
  function getRoot(instanceId) {
    var instance = instanceMap[instanceId];
    var result;
    if (instance) {
      result = instance.getRootElement();
    } else {
      result = new Error('invalid instance id "' + instanceId + '"');
    }
    return result;
  }
  
  var jsHandlers = {
    fireEvent: function fireEvent(instanceId, ref, type, data) {
      var instance = instanceMap[instanceId];
      var result;
      perf.start('fireEvent', instanceId + '-' + ref + '-' + type);
      result = instance.fireEvent(ref, type, data);
      perf.end('fireEvent', instanceId + '-' + ref + '-' + type);
      return result;
    },
  
    callback: function callback(instanceId, funcId, data, ifLast) {
      var instance = instanceMap[instanceId];
      var result;
      perf.start('callback', instanceId + '-' + funcId + '-' + data + '-' + ifLast);
      result = instance.callback(funcId, data, ifLast);
      perf.end('callback', instanceId + '-' + funcId + '-' + data + '-' + ifLast);
      return result;
    }
  };
  
  /**
   * accept calls from native (event or callback)
   *
   * @param  {string} instanceId
   * @param  {array} tasks list with `method` and `args`
   */
  function callJS(instanceId, tasks) {
    var instance = instanceMap[instanceId];
    var results = [];
    if (instance && Array.isArray(tasks)) {
      tasks.forEach(function (task) {
        var handler = jsHandlers[task.method];
        var args = [].concat(_toConsumableArray(task.args));
        if (typeof handler === 'function') {
          log('javascript:', task.method, task.args);
          args.unshift(instanceId);
          results.push(handler.apply(undefined, _toConsumableArray(args)));
        }
      });
    } else {
      results.push(new Error('invalid instance id "' + instanceId + '" or tasks'));
    }
  
    return results;
  }

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.start = start;
  exports.end = end;
  exports.reset = reset;
  exports.toJSON = toJSON;
  
  var _log = __webpack_require__(78);
  
  var _log2 = _interopRequireDefault(_log);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var data = { type: 'root', children: [] };
  var current = data;
  var stack = [current];
  
  function spaces(num) {
    return Array(num).join(' ');
  }
  
  function start(type, id) {
    var task = { type: type, id: id, children: [], start: Date.now() };
    current.children.push(task);
    stack.push(task);
    current = task;
    (0, _log2.default)('perf:' + spaces(stack.length - 1), 'start', task.type, task.id);
  }
  
  function end(type, id) {
    var task = stack.pop();
    task.end = Date.now();
    current = stack[stack.length - 1];
    (0, _log2.default)('perf:' + spaces(stack.length), 'end', task.end - task.start + 'ms', task.type, task.id);
  }
  
  function reset() {
    data.children = [];
    current = data;
    stack.length = 0;
    stack.push(current);
  }
  
  function toJSON() {
    return JSON.parse(JSON.stringify(data));
  }

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = log;
  
  var _config = __webpack_require__(79);
  
  var config = _interopRequireWildcard(_config);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function log() {
    if (config.debug) {
      var _global$console;
  
      (_global$console = global.console).log.apply(_global$console, arguments);
    }
  }
  
  global.log = log;
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 79 */
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var nativeComponentMap = exports.nativeComponentMap = {
    text: true,
    image: true,
    container: true,
    slider: {
      type: 'slider',
      append: 'tree'
    },
    cell: {
      type: 'cell',
      append: 'tree'
    }
  };
  
  var customComponentMap = exports.customComponentMap = {};
  
  var debug = exports.debug = false;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = AppInstance;
  
  var _util = __webpack_require__(81);
  
  var _perf = __webpack_require__(77);
  
  var perf = _interopRequireWildcard(_perf);
  
  var _bundle = __webpack_require__(82);
  
  var bundle = _interopRequireWildcard(_bundle);
  
  var _ctrl = __webpack_require__(100);
  
  var ctrl = _interopRequireWildcard(_ctrl);
  
  var _differ = __webpack_require__(102);
  
  var _differ2 = _interopRequireDefault(_differ);
  
  var _event = __webpack_require__(103);
  
  var _event2 = _interopRequireDefault(_event);
  
  var _domListener = __webpack_require__(101);
  
  var _domListener2 = _interopRequireDefault(_domListener);
  
  var _dom = __webpack_require__(104);
  
  var _register = __webpack_require__(98);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function AppInstance(instanceId, options) {
    var _this = this;
  
    perf.start('initInstance', instanceId);
    this.id = instanceId;
    this.options = options || {};
    this.vm = null;
    this.doc = new _dom.Document(instanceId);
    this.customComponentMap = {};
    this.callbacks = {};
    this.differ = new _differ2.default(instanceId);
    this.uid = 0;
    this.rendered = false;
    this.eventManager = new _event2.default();
    this.listener = new _domListener2.default(this.id, function (tasks) {
      _this.callTasks(tasks);
    });
    this.doc.setEventManager(this.eventManager);
    this.doc.setListener(this.listener);
  
    perf.end('initInstance', instanceId);
  } /**
     * @fileOverview
     * Weex instance constructor & definition
     */
  
  function normalize(app, v) {
    var type = (0, _util.typof)(v);
  
    switch (type) {
      case 'undefined':
      case 'null':
        return '';
      case 'regexp':
        return v.toString();
      case 'date':
        return v.toISOString();
      case 'number':
      case 'string':
      case 'boolean':
      case 'array':
      case 'object':
        if (v instanceof _dom.Node) {
          return v.ref;
        }
        return v;
      case 'function':
        app.callbacks[++app.uid] = v;
        return app.uid.toString();
      default:
        return JSON.stringify(v);
    }
  }
  
  AppInstance.prototype.callTasks = function (tasks) {
    var _this2 = this;
  
    if ((0, _util.typof)(tasks) !== 'array') {
      tasks = [tasks];
    }
  
    tasks.forEach(function (task) {
      task.args = task.args.map(function (arg) {
        return normalize(_this2, arg);
      });
    });
  
    callNative(this.id, tasks, '-1');
  };
  
  (0, _util.extend)(AppInstance.prototype, bundle, ctrl, {
    registerComponent: _register.registerComponent,
    requireComponent: _register.requireComponent,
    requireModule: _register.requireModule
  });

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.warn = exports.log = exports.indexOf = exports.define = exports.normalize = exports.typof = exports.stringify = exports.isArray = exports.isPlainObject = exports.isObject = exports.extend = exports.toArray = exports.bind = exports.camelize = exports.isReserved = undefined;
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /// lang.js
  
  
  var _config2 = __webpack_require__(79);
  
  var _config3 = _interopRequireDefault(_config2);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  /**
   * Check is a string starts with $ or _
   *
   * @param {String} str
   * @return {Boolean}
   */
  
  var isReserved = exports.isReserved = function isReserved(str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F;
  };
  
  /**
   * Camelize a hyphen-delmited string.
   *
   * @param {String} str
   * @return {String}
   */
  
  var camelRE = /-(\w)/g;
  function toUpper(_, c) {
    return c ? c.toUpperCase() : '';
  }
  var camelize = exports.camelize = function camelize(str) {
    return str.replace(camelRE, toUpper);
  };
  
  /**
   * Simple bind, faster than native
   *
   * @param {Function} fn
   * @param {Object} ctx
   * @return {Function}
   */
  
  var bind = exports.bind = function bind(fn, ctx) {
    return function (a) {
      var l = arguments.length;
      return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    };
  };
  
  /**
   * Convert an Array-like object to a real Array.
   *
   * @param {Array-like} list
   * @param {Number} [start] - start index
   * @return {Array}
   */
  
  var toArray = exports.toArray = function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret;
  };
  
  /**
   * Mix properties into target object.
   *
   * @param {Object} to
   * @param {Object} from
   */
  
  var extend = exports.extend = function extend(target) {
    for (var _len = arguments.length, src = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      src[_key - 1] = arguments[_key];
    }
  
    if (typeof Object.assign === 'function') {
      Object.assign.apply(Object, [target].concat(src));
    } else {
      var first = src.shift();
      for (var key in first) {
        target[key] = first[key];
      }
      if (src.length) {
        extend.apply(undefined, [target].concat(src));
      }
    }
    return target;
  };
  
  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   *
   * @param {*} obj
   * @return {Boolean}
   */
  
  var isObject = exports.isObject = function isObject(obj) {
    return !!(obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object');
  };
  
  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   *
   * @param {*} obj
   * @return {Boolean}
   */
  
  var toString = Object.prototype.toString;
  var isPlainObject = exports.isPlainObject = function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
  };
  
  /**
   * Array type check.
   *
   * @param {*} obj
   * @return {Boolean}
   */
  
  var isArray = exports.isArray = function isArray(obj) {
    return Array.isArray(obj);
  };
  
  var stringify = exports.stringify = function stringify(x) {
    return typeof x === 'undefined' || x === null || typeof x === 'function' ? '' : (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' ? x instanceof RegExp ? x.toString() : x instanceof Date ? JSON.parse(JSON.stringify(x)) : JSON.stringify(x) : x.toString();
  };
  
  var typof = exports.typof = function typof(v) {
    var s = Object.prototype.toString.call(v);
    return s.substring(8, s.length - 1).toLowerCase();
  };
  
  var normalize = exports.normalize = function normalize(v) {
    var type = typof(v);
  
    switch (type) {
      case 'undefined':
      case 'null':
        return '';
      case 'regexp':
        return v.toString();
      case 'date':
        return v.toISOString();
      case 'number':
      case 'string':
      case 'boolean':
      case 'array':
      case 'object':
      case 'function':
        return v;
      default:
        return JSON.stringify(v);
    }
  };
  
  /**
   * Define a non-enumerable property
   *
   * @param {Object} obj
   * @param {String} key
   * @param {*} val
   * @param {Boolean} [enumerable]
   */
  
  var define = exports.define = function define(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  };
  
  /**
   * Manual indexOf because it's slightly faster than
   * native.
   *
   * @param {Array} arr
   * @param {*} obj
   */
  
  var indexOf = exports.indexOf = function indexOf(arr, obj) {
    for (var i = 0, l = arr.length; i < l; i++) {
      if (arr[i] === obj) return i;
    }
    return -1;
  };
  
  /// debug.js
  
  var hasConsole = typeof console !== 'undefined';
  
  /**
   * Log a message.
   *
   * @param {String} msg
   */
  
  var log = exports.log = function log(msg) {
    var _config = _config3.default || {};
    if (hasConsole && _config.debug) {
      console.log.call(undefined, '[info]: ', msg);
    }
  };
  
  /**
   * We've got a problem here.
   *
   * @param {String} msg
   */
  
  var warn = exports.warn = function warn(msg) {
    // if (hasConsole && (!config.silent || config.debug)) {
    if (hasConsole) {
      console.warn.call(undefined, '[warn]: ', msg);
      /* istanbul ignore if */
      // if (config.debug) {
      //   /* jshint debug: true */
      //   debugger
      // }
    }
  };

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.require = exports.define = undefined;
  exports.clearCommonModules = clearCommonModules;
  exports.bootstrap = bootstrap;
  exports.register = register;
  exports.render = render;
  
  var _semver = __webpack_require__(83);
  
  var _semver2 = _interopRequireDefault(_semver);
  
  var _util = __webpack_require__(81);
  
  var _ = _interopRequireWildcard(_util);
  
  var _config = __webpack_require__(79);
  
  var config = _interopRequireWildcard(_config);
  
  var _perf = __webpack_require__(77);
  
  var perf = _interopRequireWildcard(_perf);
  
  var _vm = __webpack_require__(85);
  
  var _vm2 = _interopRequireDefault(_vm);
  
  var _downgrade = __webpack_require__(99);
  
  var downgrade = _interopRequireWildcard(_downgrade);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                     * @fileOverview
                                                                                                                                                                                                                     * api that invoked by js bundle code
                                                                                                                                                                                                                     *
                                                                                                                                                                                                                     * - define(name, factory): define a new composed component type
                                                                                                                                                                                                                     * - bootstrap(type, config, data): require a certain type &
                                                                                                                                                                                                                     *         render with (optional) data
                                                                                                                                                                                                                     *
                                                                                                                                                                                                                     * deprecated:
                                                                                                                                                                                                                     * - register(type, options): register a new composed component type
                                                                                                                                                                                                                     * - render(type, data): render by a certain type with (optional) data
                                                                                                                                                                                                                     * - require(type)(data): require a type then render with data
                                                                                                                                                                                                                     */
  
  var WEEX_COMPONENT_REG = /^\@weex-component\//;
  var WEEX_MODULE_REG = /^\@weex-module\//;
  var NORMAL_MODULE_REG = /^\.{1,2}\//;
  var JS_SURFIX_REG = /\.js$/;
  
  var isWeexComponent = function isWeexComponent(name) {
    return !!name.match(WEEX_COMPONENT_REG);
  };
  var isWeexModule = function isWeexModule(name) {
    return !!name.match(WEEX_MODULE_REG);
  };
  var isNormalModule = function isNormalModule(name) {
    return !!name.match(NORMAL_MODULE_REG);
  };
  var isNpmModule = function isNpmModule(name) {
    return !isWeexComponent(name) && !isWeexModule(name) && !isNormalModule(name);
  };
  
  function removeWeexPrefix(str) {
    return str.replace(WEEX_COMPONENT_REG, '').replace(WEEX_MODULE_REG, '');
  }
  
  function removeJSSurfix(str) {
    return str.replace(JS_SURFIX_REG, '');
  }
  
  var commonModules = {};
  
  function clearCommonModules() {
    commonModules = {};
  }
  
  // define(name, factory) for primary usage
  // or
  // define(name, deps, factory) for compatibility
  // Notice: DO NOT use function define() {},
  // it will cause error after builded by webpack
  var define = exports.define = function define(name, deps, factory) {
    var _this = this;
  
    perf.start('define', name);
  
    if (_.typof(deps) === 'function') {
      factory = deps;
      deps = [];
    }
  
    var _require = function _require(name) {
      var cleanName = void 0;
  
      if (isWeexComponent(name)) {
        cleanName = removeWeexPrefix(name);
        return _this.requireComponent(cleanName);
      }
      if (isWeexModule(name)) {
        cleanName = removeWeexPrefix(name);
        return _this.requireModule(cleanName);
      }
      if (isNormalModule(name)) {
        cleanName = removeJSSurfix(name);
        return commonModules[name];
      }
      if (isNpmModule(name)) {
        cleanName = removeJSSurfix(name);
        return commonModules[name];
      }
    };
    var _module = { exports: {} };
  
    var cleanName = void 0;
    if (isWeexComponent(name)) {
      cleanName = removeWeexPrefix(name);
  
      factory(_require, _module.exports, _module);
  
      this.registerComponent(cleanName, _module.exports);
    } else if (isWeexModule(name)) {
      cleanName = removeWeexPrefix(name);
  
      factory(_require, _module.exports, _module);
  
      _vm2.default.registerModules(_defineProperty({}, cleanName, _module.exports));
    } else if (isNormalModule(name)) {
      cleanName = removeJSSurfix(name);
  
      factory(_require, _module.exports, _module);
  
      commonModules[cleanName] = _module.exports;
    } else if (isNpmModule(name)) {
      cleanName = removeJSSurfix(name);
  
      factory(_require, _module.exports, _module);
  
      var exports = _module.exports;
      if (exports.template || exports.style || exports.methods) {
        // downgrade to old define method (define('componentName', factory))
        // the exports contain one key of template, style or methods
        // but it has risk!!!
        this.registerComponent(cleanName, exports);
      } else {
        commonModules[cleanName] = _module.exports;
      }
    }
  
    perf.end('define', name);
  };
  
  function bootstrap(name, config, data) {
    var cleanName = void 0;
  
    if (isWeexComponent(name)) {
      cleanName = removeWeexPrefix(name);
    } else if (isNpmModule(name)) {
      cleanName = removeJSSurfix(name);
      // check if define by old 'define' method
      if (!this.customComponentMap[cleanName]) {
        return new Error('It\'s not a component: ' + name);
      }
    } else {
      return new Error('Wrong component name: ' + name);
    }
  
    config = _.isPlainObject(config) ? config : {};
  
    if (typeof config.transformerVersion === 'string' && typeof global.needTransformerVersion === 'string' && !_semver2.default.satisfies(config.transformerVersion, global.needTransformerVersion)) {
      return new Error('JS Bundle version: ' + config.transformerVersion + ' ' + ('not compatible with ' + global.needTransformerVersion));
    }
  
    var _checkDowngrade = downgrade.check(config.downgrade);
    if (_checkDowngrade.isDowngrade) {
      this.callTasks([{
        module: 'instanceWrap',
        method: 'error',
        args: [_checkDowngrade.errorType, _checkDowngrade.code, _checkDowngrade.errorMessage]
      }]);
      return new Error('Downgrade: ' + config.downgrade);
    }
  
    perf.start('create vm', cleanName);
  
    this.vm = new _vm2.default(cleanName, { _app: this }, null, data, {
      'hook:ready': function hookReady() {
        perf.end('create vm', cleanName);
      }
    });
  }
  
  /**
   * @deprecated
   */
  function register(type, options) {
    perf.start('register', type);
    this.registerComponent(type, options);
    perf.end('register', type);
  }
  
  /**
   * @deprecated
   */
  function render(type, data) {
    return this.bootstrap(type, {}, data);
  }
  
  /**
   * @deprecated
   */
  function _require2(type) {
    var _this2 = this;
  
    return function (data) {
      return _this2.bootstrap(type, {}, data);
    };
  }
  exports.require = _require2;
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {'use strict';
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
  
  exports = module.exports = SemVer;
  
  // The debug function is excluded entirely from the minified version.
  /* nomin */var debug;
  /* nomin */if ((typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' &&
  /* nomin */process.env &&
  /* nomin */process.env.NODE_DEBUG &&
  /* nomin *//\bsemver\b/i.test(process.env.NODE_DEBUG))
    /* nomin */debug = function debug() {
      /* nomin */var args = Array.prototype.slice.call(arguments, 0);
      /* nomin */args.unshift('SEMVER');
      /* nomin */console.log.apply(console, args);
      /* nomin */
    };
    /* nomin */else
    /* nomin */debug = function debug() {};
  
  // Note: this is the semver.org version of the spec that it implements
  // Not necessarily the package version of this code.
  exports.SEMVER_SPEC_VERSION = '2.0.0';
  
  var MAX_LENGTH = 256;
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
  
  // The actual regexps go on exports.re
  var re = exports.re = [];
  var src = exports.src = [];
  var R = 0;
  
  // The following Regular Expressions can be used for tokenizing,
  // validating, and parsing SemVer version strings.
  
  // ## Numeric Identifier
  // A single `0`, or a non-zero digit followed by zero or more digits.
  
  var NUMERICIDENTIFIER = R++;
  src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
  var NUMERICIDENTIFIERLOOSE = R++;
  src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';
  
  // ## Non-numeric Identifier
  // Zero or more digits, followed by a letter or hyphen, and then zero or
  // more letters, digits, or hyphens.
  
  var NONNUMERICIDENTIFIER = R++;
  src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';
  
  // ## Main Version
  // Three dot-separated numeric identifiers.
  
  var MAINVERSION = R++;
  src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' + '(' + src[NUMERICIDENTIFIER] + ')\\.' + '(' + src[NUMERICIDENTIFIER] + ')';
  
  var MAINVERSIONLOOSE = R++;
  src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[NUMERICIDENTIFIERLOOSE] + ')';
  
  // ## Pre-release Version Identifier
  // A numeric identifier, or a non-numeric identifier.
  
  var PRERELEASEIDENTIFIER = R++;
  src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] + '|' + src[NONNUMERICIDENTIFIER] + ')';
  
  var PRERELEASEIDENTIFIERLOOSE = R++;
  src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] + '|' + src[NONNUMERICIDENTIFIER] + ')';
  
  // ## Pre-release Version
  // Hyphen, followed by one or more dot-separated pre-release version
  // identifiers.
  
  var PRERELEASE = R++;
  src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] + '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';
  
  var PRERELEASELOOSE = R++;
  src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] + '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';
  
  // ## Build Metadata Identifier
  // Any combination of digits, letters, or hyphens.
  
  var BUILDIDENTIFIER = R++;
  src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';
  
  // ## Build Metadata
  // Plus sign, followed by one or more period-separated build metadata
  // identifiers.
  
  var BUILD = R++;
  src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] + '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';
  
  // ## Full Version String
  // A main version, followed optionally by a pre-release version and
  // build metadata.
  
  // Note that the only major, minor, patch, and pre-release sections of
  // the version string are capturing groups.  The build metadata is not a
  // capturing group, because it should not ever be used in version
  // comparison.
  
  var FULL = R++;
  var FULLPLAIN = 'v?' + src[MAINVERSION] + src[PRERELEASE] + '?' + src[BUILD] + '?';
  
  src[FULL] = '^' + FULLPLAIN + '$';
  
  // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.
  var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] + src[PRERELEASELOOSE] + '?' + src[BUILD] + '?';
  
  var LOOSE = R++;
  src[LOOSE] = '^' + LOOSEPLAIN + '$';
  
  var GTLT = R++;
  src[GTLT] = '((?:<|>)?=?)';
  
  // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.
  var XRANGEIDENTIFIERLOOSE = R++;
  src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
  var XRANGEIDENTIFIER = R++;
  src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';
  
  var XRANGEPLAIN = R++;
  src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' + '(?:' + src[PRERELEASE] + ')?' + src[BUILD] + '?' + ')?)?';
  
  var XRANGEPLAINLOOSE = R++;
  src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' + '(?:' + src[PRERELEASELOOSE] + ')?' + src[BUILD] + '?' + ')?)?';
  
  var XRANGE = R++;
  src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
  var XRANGELOOSE = R++;
  src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';
  
  // Tilde ranges.
  // Meaning is "reasonably at or greater than"
  var LONETILDE = R++;
  src[LONETILDE] = '(?:~>?)';
  
  var TILDETRIM = R++;
  src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
  re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
  var tildeTrimReplace = '$1~';
  
  var TILDE = R++;
  src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
  var TILDELOOSE = R++;
  src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';
  
  // Caret ranges.
  // Meaning is "at least and backwards compatible with"
  var LONECARET = R++;
  src[LONECARET] = '(?:\\^)';
  
  var CARETTRIM = R++;
  src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
  re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
  var caretTrimReplace = '$1^';
  
  var CARET = R++;
  src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
  var CARETLOOSE = R++;
  src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';
  
  // A simple gt/lt/eq thing, or just "" to indicate "any version"
  var COMPARATORLOOSE = R++;
  src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
  var COMPARATOR = R++;
  src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';
  
  // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`
  var COMPARATORTRIM = R++;
  src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] + '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';
  
  // this one has to use the /g flag
  re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
  var comparatorTrimReplace = '$1$2$3';
  
  // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.
  var HYPHENRANGE = R++;
  src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' + '\\s+-\\s+' + '(' + src[XRANGEPLAIN] + ')' + '\\s*$';
  
  var HYPHENRANGELOOSE = R++;
  src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' + '\\s+-\\s+' + '(' + src[XRANGEPLAINLOOSE] + ')' + '\\s*$';
  
  // Star ranges basically just allow anything at all.
  var STAR = R++;
  src[STAR] = '(<|>)?=?\\s*\\*';
  
  // Compile to actual regexp objects.
  // All are flag-free, unless they were created above with a flag.
  for (var i = 0; i < R; i++) {
    debug(i, src[i]);
    if (!re[i]) re[i] = new RegExp(src[i]);
  }
  
  exports.parse = parse;
  function parse(version, loose) {
    if (version instanceof SemVer) return version;
  
    if (typeof version !== 'string') return null;
  
    if (version.length > MAX_LENGTH) return null;
  
    var r = loose ? re[LOOSE] : re[FULL];
    if (!r.test(version)) return null;
  
    try {
      return new SemVer(version, loose);
    } catch (er) {
      return null;
    }
  }
  
  exports.valid = valid;
  function valid(version, loose) {
    var v = parse(version, loose);
    return v ? v.version : null;
  }
  
  exports.clean = clean;
  function clean(version, loose) {
    var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
    return s ? s.version : null;
  }
  
  exports.SemVer = SemVer;
  
  function SemVer(version, loose) {
    if (version instanceof SemVer) {
      if (version.loose === loose) return version;else version = version.version;
    } else if (typeof version !== 'string') {
      throw new TypeError('Invalid Version: ' + version);
    }
  
    if (version.length > MAX_LENGTH) throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters');
  
    if (!(this instanceof SemVer)) return new SemVer(version, loose);
  
    debug('SemVer', version, loose);
    this.loose = loose;
    var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);
  
    if (!m) throw new TypeError('Invalid Version: ' + version);
  
    this.raw = version;
  
    // these are actually numbers
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
  
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError('Invalid major version');
  
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError('Invalid minor version');
  
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError('Invalid patch version');
  
    // numberify any prerelease numeric ids
    if (!m[4]) this.prerelease = [];else this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;
        if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
      }
      return id;
    });
  
    this.build = m[5] ? m[5].split('.') : [];
    this.format();
  }
  
  SemVer.prototype.format = function () {
    this.version = this.major + '.' + this.minor + '.' + this.patch;
    if (this.prerelease.length) this.version += '-' + this.prerelease.join('.');
    return this.version;
  };
  
  SemVer.prototype.toString = function () {
    return this.version;
  };
  
  SemVer.prototype.compare = function (other) {
    debug('SemVer.compare', this.version, this.loose, other);
    if (!(other instanceof SemVer)) other = new SemVer(other, this.loose);
  
    return this.compareMain(other) || this.comparePre(other);
  };
  
  SemVer.prototype.compareMain = function (other) {
    if (!(other instanceof SemVer)) other = new SemVer(other, this.loose);
  
    return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
  };
  
  SemVer.prototype.comparePre = function (other) {
    if (!(other instanceof SemVer)) other = new SemVer(other, this.loose);
  
    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) return -1;else if (!this.prerelease.length && other.prerelease.length) return 1;else if (!this.prerelease.length && !other.prerelease.length) return 0;
  
    var i = 0;
    do {
      var a = this.prerelease[i];
      var b = other.prerelease[i];
      debug('prerelease compare', i, a, b);
      if (a === undefined && b === undefined) return 0;else if (b === undefined) return 1;else if (a === undefined) return -1;else if (a === b) continue;else return compareIdentifiers(a, b);
    } while (++i);
  };
  
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  SemVer.prototype.inc = function (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc('pre', identifier);
        break;
      case 'preminor':
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc('pre', identifier);
        break;
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0;
        this.inc('patch', identifier);
        this.inc('pre', identifier);
        break;
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) this.inc('patch', identifier);
        this.inc('pre', identifier);
        break;
  
      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break;
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
        this.patch = 0;
        this.prerelease = [];
        break;
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) this.patch++;
        this.prerelease = [];
        break;
      // This probably shouldn't be used publicly.
      // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) this.prerelease = [0];else {
          var i = this.prerelease.length;
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++;
              i = -2;
            }
          }
          if (i === -1) // didn't increment anything
            this.prerelease.push(0);
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) this.prerelease = [identifier, 0];
          } else this.prerelease = [identifier, 0];
        }
        break;
  
      default:
        throw new Error('invalid increment argument: ' + release);
    }
    this.format();
    this.raw = this.version;
    return this;
  };
  
  exports.inc = inc;
  function inc(version, release, loose, identifier) {
    if (typeof loose === 'string') {
      identifier = loose;
      loose = undefined;
    }
  
    try {
      return new SemVer(version, loose).inc(release, identifier).version;
    } catch (er) {
      return null;
    }
  }
  
  exports.diff = diff;
  function diff(version1, version2) {
    if (eq(version1, version2)) {
      return null;
    } else {
      var v1 = parse(version1);
      var v2 = parse(version2);
      if (v1.prerelease.length || v2.prerelease.length) {
        for (var key in v1) {
          if (key === 'major' || key === 'minor' || key === 'patch') {
            if (v1[key] !== v2[key]) {
              return 'pre' + key;
            }
          }
        }
        return 'prerelease';
      }
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return key;
          }
        }
      }
    }
  }
  
  exports.compareIdentifiers = compareIdentifiers;
  
  var numeric = /^[0-9]+$/;
  function compareIdentifiers(a, b) {
    var anum = numeric.test(a);
    var bnum = numeric.test(b);
  
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
  
    return anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : a > b ? 1 : 0;
  }
  
  exports.rcompareIdentifiers = rcompareIdentifiers;
  function rcompareIdentifiers(a, b) {
    return compareIdentifiers(b, a);
  }
  
  exports.major = major;
  function major(a, loose) {
    return new SemVer(a, loose).major;
  }
  
  exports.minor = minor;
  function minor(a, loose) {
    return new SemVer(a, loose).minor;
  }
  
  exports.patch = patch;
  function patch(a, loose) {
    return new SemVer(a, loose).patch;
  }
  
  exports.compare = compare;
  function compare(a, b, loose) {
    return new SemVer(a, loose).compare(b);
  }
  
  exports.compareLoose = compareLoose;
  function compareLoose(a, b) {
    return compare(a, b, true);
  }
  
  exports.rcompare = rcompare;
  function rcompare(a, b, loose) {
    return compare(b, a, loose);
  }
  
  exports.sort = sort;
  function sort(list, loose) {
    return list.sort(function (a, b) {
      return exports.compare(a, b, loose);
    });
  }
  
  exports.rsort = rsort;
  function rsort(list, loose) {
    return list.sort(function (a, b) {
      return exports.rcompare(a, b, loose);
    });
  }
  
  exports.gt = gt;
  function gt(a, b, loose) {
    return compare(a, b, loose) > 0;
  }
  
  exports.lt = lt;
  function lt(a, b, loose) {
    return compare(a, b, loose) < 0;
  }
  
  exports.eq = eq;
  function eq(a, b, loose) {
    return compare(a, b, loose) === 0;
  }
  
  exports.neq = neq;
  function neq(a, b, loose) {
    return compare(a, b, loose) !== 0;
  }
  
  exports.gte = gte;
  function gte(a, b, loose) {
    return compare(a, b, loose) >= 0;
  }
  
  exports.lte = lte;
  function lte(a, b, loose) {
    return compare(a, b, loose) <= 0;
  }
  
  exports.cmp = cmp;
  function cmp(a, op, b, loose) {
    var ret;
    switch (op) {
      case '===':
        if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') a = a.version;
        if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') b = b.version;
        ret = a === b;
        break;
      case '!==':
        if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') a = a.version;
        if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') b = b.version;
        ret = a !== b;
        break;
      case '':case '=':case '==':
        ret = eq(a, b, loose);break;
      case '!=':
        ret = neq(a, b, loose);break;
      case '>':
        ret = gt(a, b, loose);break;
      case '>=':
        ret = gte(a, b, loose);break;
      case '<':
        ret = lt(a, b, loose);break;
      case '<=':
        ret = lte(a, b, loose);break;
      default:
        throw new TypeError('Invalid operator: ' + op);
    }
    return ret;
  }
  
  exports.Comparator = Comparator;
  function Comparator(comp, loose) {
    if (comp instanceof Comparator) {
      if (comp.loose === loose) return comp;else comp = comp.value;
    }
  
    if (!(this instanceof Comparator)) return new Comparator(comp, loose);
  
    debug('comparator', comp, loose);
    this.loose = loose;
    this.parse(comp);
  
    if (this.semver === ANY) this.value = '';else this.value = this.operator + this.semver.version;
  
    debug('comp', this);
  }
  
  var ANY = {};
  Comparator.prototype.parse = function (comp) {
    var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
    var m = comp.match(r);
  
    if (!m) throw new TypeError('Invalid comparator: ' + comp);
  
    this.operator = m[1];
    if (this.operator === '=') this.operator = '';
  
    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) this.semver = ANY;else this.semver = new SemVer(m[2], this.loose);
  };
  
  Comparator.prototype.toString = function () {
    return this.value;
  };
  
  Comparator.prototype.test = function (version) {
    debug('Comparator.test', version, this.loose);
  
    if (this.semver === ANY) return true;
  
    if (typeof version === 'string') version = new SemVer(version, this.loose);
  
    return cmp(version, this.operator, this.semver, this.loose);
  };
  
  exports.Range = Range;
  function Range(range, loose) {
    if (range instanceof Range && range.loose === loose) return range;
  
    if (!(this instanceof Range)) return new Range(range, loose);
  
    this.loose = loose;
  
    // First, split based on boolean or ||
    this.raw = range;
    this.set = range.split(/\s*\|\|\s*/).map(function (range) {
      return this.parseRange(range.trim());
    }, this).filter(function (c) {
      // throw out any that are not relevant for whatever reason
      return c.length;
    });
  
    if (!this.set.length) {
      throw new TypeError('Invalid SemVer Range: ' + range);
    }
  
    this.format();
  }
  
  Range.prototype.format = function () {
    this.range = this.set.map(function (comps) {
      return comps.join(' ').trim();
    }).join('||').trim();
    return this.range;
  };
  
  Range.prototype.toString = function () {
    return this.range;
  };
  
  Range.prototype.parseRange = function (range) {
    var loose = this.loose;
    range = range.trim();
    debug('range', range, loose);
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
    range = range.replace(hr, hyphenReplace);
    debug('hyphen replace', range);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
    debug('comparator trim', range, re[COMPARATORTRIM]);
  
    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[TILDETRIM], tildeTrimReplace);
  
    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[CARETTRIM], caretTrimReplace);
  
    // normalize spaces
    range = range.split(/\s+/).join(' ');
  
    // At this point, the range is completely trimmed and
    // ready to be split into comparators.
  
    var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
    var set = range.split(' ').map(function (comp) {
      return parseComparator(comp, loose);
    }).join(' ').split(/\s+/);
    if (this.loose) {
      // in loose mode, throw out any that are not valid comparators
      set = set.filter(function (comp) {
        return !!comp.match(compRe);
      });
    }
    set = set.map(function (comp) {
      return new Comparator(comp, loose);
    });
  
    return set;
  };
  
  // Mostly just for testing and legacy API reasons
  exports.toComparators = toComparators;
  function toComparators(range, loose) {
    return new Range(range, loose).set.map(function (comp) {
      return comp.map(function (c) {
        return c.value;
      }).join(' ').trim().split(' ');
    });
  }
  
  // comprised of xranges, tildes, stars, and gtlt's at this point.
  // already replaced the hyphen ranges
  // turn into a set of JUST comparators.
  function parseComparator(comp, loose) {
    debug('comp', comp);
    comp = replaceCarets(comp, loose);
    debug('caret', comp);
    comp = replaceTildes(comp, loose);
    debug('tildes', comp);
    comp = replaceXRanges(comp, loose);
    debug('xrange', comp);
    comp = replaceStars(comp, loose);
    debug('stars', comp);
    return comp;
  }
  
  function isX(id) {
    return !id || id.toLowerCase() === 'x' || id === '*';
  }
  
  // ~, ~> --> * (any, kinda silly)
  // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
  // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
  // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
  // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
  // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
  function replaceTildes(comp, loose) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceTilde(comp, loose);
    }).join(' ');
  }
  
  function replaceTilde(comp, loose) {
    var r = loose ? re[TILDELOOSE] : re[TILDE];
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('tilde', comp, _, M, m, p, pr);
      var ret;
  
      if (isX(M)) ret = '';else if (isX(m)) ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';else if (isX(p))
        // ~1.2 == >=1.2.0- <1.3.0-
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';else if (pr) {
        debug('replaceTilde pr', pr);
        if (pr.charAt(0) !== '-') pr = '-' + pr;
        ret = '>=' + M + '.' + m + '.' + p + pr + ' <' + M + '.' + (+m + 1) + '.0';
      } else
        // ~1.2.3 == >=1.2.3 <1.3.0
        ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
  
      debug('tilde return', ret);
      return ret;
    });
  }
  
  // ^ --> * (any, kinda silly)
  // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
  // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
  // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
  // ^1.2.3 --> >=1.2.3 <2.0.0
  // ^1.2.0 --> >=1.2.0 <2.0.0
  function replaceCarets(comp, loose) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceCaret(comp, loose);
    }).join(' ');
  }
  
  function replaceCaret(comp, loose) {
    debug('caret', comp, loose);
    var r = loose ? re[CARETLOOSE] : re[CARET];
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('caret', comp, _, M, m, p, pr);
      var ret;
  
      if (isX(M)) ret = '';else if (isX(m)) ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';else if (isX(p)) {
        if (M === '0') ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';else ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
      } else if (pr) {
        debug('replaceCaret pr', pr);
        if (pr.charAt(0) !== '-') pr = '-' + pr;
        if (M === '0') {
          if (m === '0') ret = '>=' + M + '.' + m + '.' + p + pr + ' <' + M + '.' + m + '.' + (+p + 1);else ret = '>=' + M + '.' + m + '.' + p + pr + ' <' + M + '.' + (+m + 1) + '.0';
        } else ret = '>=' + M + '.' + m + '.' + p + pr + ' <' + (+M + 1) + '.0.0';
      } else {
        debug('no pr');
        if (M === '0') {
          if (m === '0') ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + m + '.' + (+p + 1);else ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
        } else ret = '>=' + M + '.' + m + '.' + p + ' <' + (+M + 1) + '.0.0';
      }
  
      debug('caret return', ret);
      return ret;
    });
  }
  
  function replaceXRanges(comp, loose) {
    debug('replaceXRanges', comp, loose);
    return comp.split(/\s+/).map(function (comp) {
      return replaceXRange(comp, loose);
    }).join(' ');
  }
  
  function replaceXRange(comp, loose) {
    comp = comp.trim();
    var r = loose ? re[XRANGELOOSE] : re[XRANGE];
    return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
      debug('xRange', comp, ret, gtlt, M, m, p, pr);
      var xM = isX(M);
      var xm = xM || isX(m);
      var xp = xm || isX(p);
      var anyX = xp;
  
      if (gtlt === '=' && anyX) gtlt = '';
  
      if (xM) {
        if (gtlt === '>' || gtlt === '<') {
          // nothing is allowed
          ret = '<0.0.0';
        } else {
          // nothing is forbidden
          ret = '*';
        }
      } else if (gtlt && anyX) {
        // replace X with 0
        if (xm) m = 0;
        if (xp) p = 0;
  
        if (gtlt === '>') {
          // >1 => >=2.0.0
          // >1.2 => >=1.3.0
          // >1.2.3 => >= 1.2.4
          gtlt = '>=';
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else if (xp) {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === '<=') {
          // <=0.7.x is actually <0.8.0, since any 0.7.x should
          // pass.  Similarly, <=7.x is actually <8.0.0, etc.
          gtlt = '<';
          if (xm) M = +M + 1;else m = +m + 1;
        }
  
        ret = gtlt + M + '.' + m + '.' + p;
      } else if (xm) {
        ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
      } else if (xp) {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      }
  
      debug('xRange return', ret);
  
      return ret;
    });
  }
  
  // Because * is AND-ed with everything else in the comparator,
  // and '' means "any version", just remove the *s entirely.
  function replaceStars(comp, loose) {
    debug('replaceStars', comp, loose);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[STAR], '');
  }
  
  // This function is passed to string.replace(re[HYPHENRANGE])
  // M, m, patch, prerelease, build
  // 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
  // 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
  // 1.2 - 3.4 => >=1.2.0 <3.5.0
  function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
  
    if (isX(fM)) from = '';else if (isX(fm)) from = '>=' + fM + '.0.0';else if (isX(fp)) from = '>=' + fM + '.' + fm + '.0';else from = '>=' + from;
  
    if (isX(tM)) to = '';else if (isX(tm)) to = '<' + (+tM + 1) + '.0.0';else if (isX(tp)) to = '<' + tM + '.' + (+tm + 1) + '.0';else if (tpr) to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;else to = '<=' + to;
  
    return (from + ' ' + to).trim();
  }
  
  // if ANY of the sets match ALL of its comparators, then pass
  Range.prototype.test = function (version) {
    if (!version) return false;
  
    if (typeof version === 'string') version = new SemVer(version, this.loose);
  
    for (var i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version)) return true;
    }
    return false;
  };
  
  function testSet(set, version) {
    for (var i = 0; i < set.length; i++) {
      if (!set[i].test(version)) return false;
    }
  
    if (version.prerelease.length) {
      // Find the set of versions that are allowed to have prereleases
      // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
      // That should allow `1.2.3-pr.2` to pass.
      // However, `1.2.4-alpha.notready` should NOT be allowed,
      // even though it's within the range set by the comparators.
      for (var i = 0; i < set.length; i++) {
        debug(set[i].semver);
        if (set[i].semver === ANY) continue;
  
        if (set[i].semver.prerelease.length > 0) {
          var allowed = set[i].semver;
          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
        }
      }
  
      // Version has a -pre, but it's not one of the ones we like.
      return false;
    }
  
    return true;
  }
  
  exports.satisfies = satisfies;
  function satisfies(version, range, loose) {
    try {
      range = new Range(range, loose);
    } catch (er) {
      return false;
    }
    return range.test(version);
  }
  
  exports.maxSatisfying = maxSatisfying;
  function maxSatisfying(versions, range, loose) {
    return versions.filter(function (version) {
      return satisfies(version, range, loose);
    }).sort(function (a, b) {
      return rcompare(a, b, loose);
    })[0] || null;
  }
  
  exports.validRange = validRange;
  function validRange(range, loose) {
    try {
      // Return '*' instead of '' so that truthiness works.
      // This will throw if it's invalid anyway
      return new Range(range, loose).range || '*';
    } catch (er) {
      return null;
    }
  }
  
  // Determine if version is less than all the versions possible in the range
  exports.ltr = ltr;
  function ltr(version, range, loose) {
    return outside(version, range, '<', loose);
  }
  
  // Determine if version is greater than all the versions possible in the range.
  exports.gtr = gtr;
  function gtr(version, range, loose) {
    return outside(version, range, '>', loose);
  }
  
  exports.outside = outside;
  function outside(version, range, hilo, loose) {
    version = new SemVer(version, loose);
    range = new Range(range, loose);
  
    var gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case '>':
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = '>';
        ecomp = '>=';
        break;
      case '<':
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = '<';
        ecomp = '<=';
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
  
    // If it satisifes the range it is not outside
    if (satisfies(version, range, loose)) {
      return false;
    }
  
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
  
    for (var i = 0; i < range.set.length; ++i) {
      var comparators = range.set[i];
  
      var high = null;
      var low = null;
  
      comparators.forEach(function (comparator) {
        if (comparator.semver === ANY) {
          comparator = new Comparator('>=0.0.0');
        }
        high = high || comparator;
        low = low || comparator;
        if (gtfn(comparator.semver, high.semver, loose)) {
          high = comparator;
        } else if (ltfn(comparator.semver, low.semver, loose)) {
          low = comparator;
        }
      });
  
      // If the edge version comparator has a operator then our version
      // isn't outside it
      if (high.operator === comp || high.operator === ecomp) {
        return false;
      }
  
      // If the lowest version comparator has an operator and our version
      // is less than it then it isn't higher than the range
      if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
        return false;
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false;
      }
    }
    return true;
  }
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(84)))

/***/ },
/* 84 */
/***/ function(module, exports) {

  'use strict';
  
  // shim for using process in browser
  
  var process = module.exports = {};
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  
  function cleanUpNextTick() {
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }
  
  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = setTimeout(cleanUpNextTick);
      draining = true;
  
      var len = queue.length;
      while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      clearTimeout(timeout);
  }
  
  process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          setTimeout(drainQueue, 0);
      }
  };
  
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};
  
  function noop() {}
  
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  
  process.binding = function (name) {
      throw new Error('process.binding is not supported');
  };
  
  process.cwd = function () {
      return '/';
  };
  process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
  };
  process.umask = function () {
      return 0;
  };

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Vm;
  
  var _util = __webpack_require__(81);
  
  var _scope = __webpack_require__(86);
  
  var scope = _interopRequireWildcard(_scope);
  
  var _compiler = __webpack_require__(93);
  
  var compiler = _interopRequireWildcard(_compiler);
  
  var _directive = __webpack_require__(94);
  
  var directive = _interopRequireWildcard(_directive);
  
  var _domHelper = __webpack_require__(96);
  
  var domHelper = _interopRequireWildcard(_domHelper);
  
  var _events = __webpack_require__(97);
  
  var events = _interopRequireWildcard(_events);
  
  var _register = __webpack_require__(98);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function callOldReadyEntry(vm, component) {
    if (component.methods && component.methods.ready) {
      component.methods.ready.call(vm);
    }
  }
  
  /**
   * ViewModel constructor
   *
   * @param {string} type
   * @param {object} parentVm   which contains _app
   * @param {object} parentEl   root element or frag block
   * @param {object} mergedData external data
   * @param {object} externalEvents external events
   */
  
  // import * as modules from './../api/modules'
  // import * as api from './../api/api'
  
  /**
   * @fileOverview
   * ViewModel Constructor & definition
   */
  
  function Vm(type, parentVm, parentEl, mergedData, externalEvents) {
    this._parent = parentVm._realParent ? parentVm._realParent : parentVm;
    this._app = parentVm._app;
    parentVm._childrenVms && parentVm._childrenVms.push(this);
  
    var component = this._app.customComponentMap[type] || {};
    var data = component.data || {};
  
    this._options = component;
    this._methods = component.methods || {};
    this._computed = component.computed || {};
    this._css = component.style || {};
    this._ids = {};
    this._watchers = [];
    this._vmEvents = {};
    this._childrenVms = [];
    this._type = type;
  
    // bind events and lifecycles
    this._initEvents(externalEvents);
  
    this.$emit('hook:init');
    this._inited = true;
    // proxy data and methods
    // observe data and add this to vms
    this._data = typeof data === 'function' ? data() : data;
    if (mergedData) {
      (0, _util.extend)(this._data, mergedData);
    }
    this._initScope();
  
    this.$emit('hook:created');
    this._created = true;
    // backward old ready entry
    callOldReadyEntry(this, component);
  
    // if no parentElement then specify the documentElement
    this._parentEl = parentEl || this._app.doc.documentElement;
    this._build();
  }
  
  (0, _util.extend)(Vm.prototype, scope, compiler, directive, domHelper, events);
  (0, _util.extend)(Vm, {
    registerModules: _register.registerModules,
    registerMethods: _register.registerMethods
  });
  // Vm.registerModules(modules)

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var _ = __webpack_require__(87);
  var Observer = __webpack_require__(88);
  var Dep = __webpack_require__(90);
  
  /**
   * Setup the scope of an instance, which contains:
   * - observed data
   * - computed properties
   * - user methods
   * - meta properties
   */
  
  exports._initScope = function () {
    this._initData();
    this._initComputed();
    this._initMethods();
    // this._initMeta()
  };
  
  /**
   * Initialize the data. 
   */
  
  exports._initData = function () {
    // proxy data on instance
    var data = this._data;
    var i, key;
    // // make sure all props properties are observed
    // var props = this.$options.props
    // if (props) {
    //   i = props.length
    //   while (i--) {
    //     key = _.camelize(props[i])
    //     if (!(key in data)) {
    //       data[key] = null
    //     }
    //   }
    // }
    var keys = Object.keys(data);
    i = keys.length;
    while (i--) {
      key = keys[i];
      if (!_.isReserved(key)) {
        this._proxy(key);
      }
    }
    // observe data
    Observer.create(data).addVm(this);
  };
  
  // /**
  //  * Swap the isntance's $data. Called in $data's setter.
  //  *
  //  * @param {Object} newData
  //  */
  
  // exports._setData = function (newData) {
  //   newData = newData || {}
  //   var oldData = this._data
  //   this._data = newData
  //   var keys, key, i
  //   // unproxy keys not present in new data
  //   keys = Object.keys(oldData)
  //   i = keys.length
  //   while (i--) {
  //     key = keys[i]
  //     if (!_.isReserved(key) && !(key in newData)) {
  //       this._unproxy(key)
  //     }
  //   }
  //   // proxy keys not already proxied,
  //   // and trigger change for changed values
  //   keys = Object.keys(newData)
  //   i = keys.length
  //   while (i--) {
  //     key = keys[i]
  //     if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
  //       // new property
  //       this._proxy(key)
  //     }
  //   }
  //   oldData.__ob__.removeVm(this)
  //   Observer.create(newData).addVm(this)
  //   this._digest()
  // }
  
  /**
   * Proxy a property, so that
   * vm.prop === vm._data.prop
   *
   * @param {String} key
   */
  
  exports._proxy = function (key) {
    // need to store ref to self here
    // because these getter/setters might
    // be called by child instances!
    var self = this;
    Object.defineProperty(self, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        return self._data[key];
      },
      set: function proxySetter(val) {
        self._data[key] = val;
      }
    });
  };
  
  /**
   * Unproxy a property.
   *
   * @param {String} key
   */
  
  exports._unproxy = function (key) {
    delete this[key];
  };
  
  // /**
  //  * Force update on every watcher in scope.
  //  */
  
  // exports._digest = function () {
  //   var i = this._watchers.length
  //   while (i--) {
  //     this._watchers[i].update()
  //   }
  //   var children = this._children
  //   i = children.length
  //   while (i--) {
  //     var child = children[i]
  //     if (child.$options.inherit) {
  //       child._digest()
  //     }
  //   }
  // }
  
  /**
   * Setup computed properties. They are essentially
   * special getter/setters
   */
  
  function noop() {}
  exports._initComputed = function () {
    // var computed = this.$options.computed
    var computed = this._computed;
    if (computed) {
      for (var key in computed) {
        var userDef = computed[key];
        var def = {
          enumerable: true,
          configurable: true
        };
        if (typeof userDef === 'function') {
          def.get = _.bind(userDef, this);
          def.set = noop;
        } else {
          def.get = userDef.get ? _.bind(userDef.get, this) : noop;
          def.set = userDef.set ? _.bind(userDef.set, this) : noop;
        }
        Object.defineProperty(this, key, def);
      }
    }
  };
  
  /**
   * Setup instance methods. Methods must be bound to the
   * instance since they might be called by children
   * inheriting them.
   */
  
  exports._initMethods = function () {
    // var methods = this.$options.methods
    var methods = this._methods;
    if (methods) {
      for (var key in methods) {
        this[key] = _.bind(methods[key], this);
      }
    }
  };
  
  // /**
  //  * Initialize meta information like $index, $key & $value.
  //  */

  // exports._initMeta = function () {
  //   var metas = this.$options._meta
  //   if (metas) {
  //     for (var key in metas) {
  //       this._defineMeta(key, metas[key])
  //     }
  //   }
  // }

  // /**
  //  * Define a meta property, e.g $index, $key, $value
  //  * which only exists on the vm instance but not in $data.
  //  *
  //  * @param {String} key
  //  * @param {*} value
  //  */

  // exports._defineMeta = function (key, value) {
  //   var dep = new Dep()
  //   Object.defineProperty(this, key, {
  //     enumerable: true,
  //     configurable: true,
  //     get: function metaGetter () {
  //       if (Observer.target) {
  //         Observer.target.addDep(dep)
  //       }
  //       return value
  //     },
  //     set: function metaSetter (val) {
  //       if (val !== value) {
  //         value = val
  //         dep.notify()
  //       }
  //     }
  //   })
  // }

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  // required for code in instance/observer
  module.exports = __webpack_require__(81);

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var _ = __webpack_require__(87);
  var config = __webpack_require__(89);
  var Dep = __webpack_require__(90);
  var arrayMethods = __webpack_require__(91);
  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
  __webpack_require__(92);
  
  var uid = 0;
  
  /**
   * Type enums
   */
  
  var ARRAY = 0;
  var OBJECT = 1;
  
  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   *
   * @param {Object|Array} target
   * @param {Object} proto
   */
  
  function protoAugment(target, src) {
    target.__proto__ = src;
  }
  
  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   *
   * @param {Object|Array} target
   * @param {Object} proto
   */
  
  function copyAugment(target, src, keys) {
    var i = keys.length;
    var key;
    while (i--) {
      key = keys[i];
      _.define(target, key, src[key]);
    }
  }
  
  /**
   * Observer class that are attached to each observed
   * object. Once attached, the observer converts target
   * object's property keys into getter/setters that
   * collect dependencies and dispatches updates.
   *
   * @param {Array|Object} value
   * @param {Number} type
   * @constructor
   */
  
  function Observer(value, type) {
    this.id = ++uid;
    this.value = value;
    this.active = true;
    this.deps = [];
    _.define(value, '__ob__', this);
    if (type === ARRAY) {
      var augment = config.proto && _.hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else if (type === OBJECT) {
      this.walk(value);
    }
  }
  
  Observer.target = null;
  
  var p = Observer.prototype;
  
  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   *
   * @param {*} value
   * @return {Observer|undefined}
   * @static
   */
  
  Observer.create = function (value) {
    if (value && value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
      return value.__ob__;
    } else if (_.isArray(value)) {
      return new Observer(value, ARRAY);
    } else if (_.isPlainObject(value) && !value._isVue // avoid Vue instance
    ) {
        return new Observer(value, OBJECT);
      }
  };
  
  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object. Properties prefixed with `$` or `_`
   * and accessor properties are ignored.
   *
   * @param {Object} obj
   */
  
  p.walk = function (obj) {
    var keys = Object.keys(obj);
    var i = keys.length;
    var key, prefix;
    while (i--) {
      key = keys[i];
      prefix = key.charCodeAt(0);
      if (prefix !== 0x24 && prefix !== 0x5F) {
        // skip $ or _
        this.convert(key, obj[key]);
      }
    }
  };
  
  /**
   * Try to carete an observer for a child value,
   * and if value is array, link dep to the array.
   *
   * @param {*} val
   * @return {Dep|undefined}
   */
  
  p.observe = function (val) {
    return Observer.create(val);
  };
  
  /**
   * Observe a list of Array items.
   *
   * @param {Array} items
   */
  
  p.observeArray = function (items) {
    var i = items.length;
    while (i--) {
      this.observe(items[i]);
    }
  };
  
  /**
   * Convert a property into getter/setter so we can emit
   * the events when the property is accessed/changed.
   *
   * @param {String} key
   * @param {*} val
   */
  
  p.convert = function (key, val) {
    var ob = this;
    var childOb = ob.observe(val);
    var dep = new Dep();
    if (childOb) {
      childOb.deps.push(dep);
    }
    Object.defineProperty(ob.value, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        // Observer.target is a watcher whose getter is
        // currently being evaluated.
        if (ob.active && Observer.target) {
          Observer.target.addDep(dep);
        }
        return val;
      },
      set: function set(newVal) {
        if (newVal === val) return;
        // remove dep from old value
        var oldChildOb = val && val.__ob__;
        if (oldChildOb) {
          oldChildOb.deps.$remove(dep);
        }
        val = newVal;
        // add dep to new value
        var newChildOb = ob.observe(newVal);
        if (newChildOb) {
          newChildOb.deps.push(dep);
        }
        dep.notify();
      }
    });
  };
  
  /**
   * Notify change on all self deps on an observer.
   * This is called when a mutable value mutates. e.g.
   * when an Array's mutating methods are called, or an
   * Object's $add/$delete are called.
   */
  
  p.notify = function () {
    var deps = this.deps;
    for (var i = 0, l = deps.length; i < l; i++) {
      deps[i].notify();
    }
  };
  
  /**
   * Add an owner vm, so that when $add/$delete mutations
   * happen we can notify owner vms to proxy the keys and
   * digest the watchers. This is only called when the object
   * is observed as an instance's root $data.
   *
   * @param {Vue} vm
   */
  
  p.addVm = function (vm) {
    (this.vms = this.vms || []).push(vm);
  };
  
  /**
   * Remove an owner vm. This is called when the object is
   * swapped out as an instance's $data object.
   *
   * @param {Vue} vm
   */
  
  p.removeVm = function (vm) {
    this.vms.$remove(vm);
  };
  
  module.exports = Observer;

/***/ },
/* 89 */
/***/ function(module, exports) {

  "use strict";
  
  module.exports = { proto: true };

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var _ = __webpack_require__(87);
  
  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   *
   * @constructor
   */
  
  function Dep() {
    this.subs = [];
  }
  
  var p = Dep.prototype;
  
  /**
   * Add a directive subscriber.
   *
   * @param {Directive} sub
   */
  
  p.addSub = function (sub) {
    this.subs.push(sub);
  };
  
  /**
   * Remove a directive subscriber.
   *
   * @param {Directive} sub
   */
  
  p.removeSub = function (sub) {
    this.subs.$remove(sub);
  };
  
  /**
   * Notify all subscribers of a new value.
   */
  
  p.notify = function () {
    // stablize the subscriber list first
    var subs = _.toArray(this.subs);
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };
  
  module.exports = Dep;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var _ = __webpack_require__(87);
  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto)
  
  /**
   * Intercept mutating methods and emit events
   */
  
  ;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    _.define(arrayMethods, method, function mutator() {
      // avoid leaking arguments:
      // http://jsperf.com/closure-with-arguments
      var i = arguments.length;
      var args = new Array(i);
      while (i--) {
        args[i] = arguments[i];
      }
      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
          inserted = args;
          break;
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      if (inserted) ob.observeArray(inserted);
      // notify change
      ob.notify();
      return result;
    });
  });
  
  /**
   * Swap the element at the given index with a new value
   * and emits corresponding event.
   *
   * @param {Number} index
   * @param {*} val
   * @return {*} - replaced element
   */
  
  _.define(arrayProto, '$set', function $set(index, val) {
    if (index >= this.length) {
      this.length = index + 1;
    }
    return this.splice(index, 1, val)[0];
  });
  
  /**
   * Convenience method to remove the element at given index.
   *
   * @param {Number} index
   * @param {*} val
   */
  
  _.define(arrayProto, '$remove', function $remove(index) {
    /* istanbul ignore if */
    if (!this.length) return;
    if (typeof index !== 'number') {
      index = _.indexOf(this, index);
    }
    if (index > -1) {
      this.splice(index, 1);
    }
  });
  
  module.exports = arrayMethods;

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  var _ = __webpack_require__(87);
  var objProto = Object.prototype;
  
  /**
   * Add a new property to an observed object
   * and emits corresponding event
   *
   * @param {String} key
   * @param {*} val
   * @public
   */
  
  _.define(objProto, '$add', function $add(key, val) {
    if (this.hasOwnProperty(key)) return;
    var ob = this.__ob__;
    if (!ob || _.isReserved(key)) {
      this[key] = val;
      return;
    }
    ob.convert(key, val);
    ob.notify();
    if (ob.vms) {
      var i = ob.vms.length;
      while (i--) {
        var vm = ob.vms[i];
        vm._proxy(key);
        // vm._digest() // todo
      }
    }
  });
  
  /**
   * Set a property on an observed object, calling add to
   * ensure the property is observed.
   *
   * @param {String} key
   * @param {*} val
   * @public
   */
  
  _.define(objProto, '$set', function $set(key, val) {
    this.$add(key, val);
    this[key] = val;
  });
  
  /**
   * Deletes a property from an observed object
   * and emits corresponding event
   *
   * @param {String} key
   * @public
   */
  
  _.define(objProto, '$delete', function $delete(key) {
    if (!this.hasOwnProperty(key)) return;
    delete this[key];
    var ob = this.__ob__;
    if (!ob || _.isReserved(key)) {
      return;
    }
    ob.notify();
    if (ob.vms) {
      var i = ob.vms.length;
      while (i--) {
        var vm = ob.vms[i];
        vm._unproxy(key);
        // vm._digest() // todo
      }
    }
  });

/***/ },
/* 93 */
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
  
  exports._build = _build;
  exports._generate = _generate;
  exports._generateElement = _generateElement;
  exports._setChildren = _setChildren;
  exports._checkRepeat = _checkRepeat;
  exports._checkDisplay = _checkDisplay;
  exports._watchBlock = _watchBlock;
  exports._mergeContext = _mergeContext;
  /**
  * @fileOverview
  * ViewModel template parser & data-binding process
  *
  * required:
  * index.js: Vm
  * dom-helper.js: _createElement, _createBlock
  * dom-helper.js: _attachTarget, _moveTarget, _removeTarget
  * directive.js: _bindElement, _bindSubVm, _watch
  * events.js: $on
  */
  
  /**
   * build(externalDirs)
   *   createVm()
   *   merge(externalDirs, dirs)
   *   generate(template, parentNode)
   *     if (type is content) create contentNode
   *     else if (dirs have v-for) foreach -> create context
   *       -> generate(templateWithoutFor, parentNode): diff(list) onchange
   *     else if (dirs have v-if) assert
   *       -> generate(templateWithoutIf, parentNode): toggle(shown) onchange
   *     else if (type is native)
   *       set(dirs): update(id/attr/style/class) onchange
   *       append(template, parentNode)
   *       foreach childNodes -> generate(childNode, template)
   *     else if (type is custom)
   *       addChildVm(vm, parentVm)
   *       build(externalDirs)
   *       foreach childNodes -> generate(childNode, template)
   */
  function _build() {
    var opt = this._options || {};
    var template = opt.template || {};
  
    if (opt.replace) {
      if (template.children && template.children.length === 1) {
        this._generate(template.children[0], this._parentEl);
      } else {
        this._generate(template.children, this._parentEl);
      }
    } else {
      this._generate(template, this._parentEl);
    }
  
    this.$emit('hook:ready');
    this._ready = true;
  }
  
  /**
   * Generate elements by child or children and append to parent elements.
   * Root element info would be merged if has. The first argument may be an array
   * if the root element with options.replace has not only one child.
   *
   * @param  {object|array} target
   * @param  {object} parentEl
   * @param  {object} context
   */
  function _generate(target, parentEl, context) {
    var _this = this;
  
    if (Array.isArray(target)) {
      var _ret = function () {
        var fragBlock = _this._createBlock(parentEl);
        target.forEach(function (child) {
          _this._generate(child, fragBlock, context);
        });
        return {
          v: void 0
        };
      }();
  
      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  
    context = context || {};
  
    if (target.type === 'content' || target.type === 'slot') {
      this._content = this._createBlock(parentEl);
      return;
    }
  
    if (!context.hasOwnProperty('repeat') && target.repeat) {
      var _ret2 = function () {
        var expression = target.repeat.expression || target.repeat;
        var list = expression.call(_this);
        var repeatId = latestRepeatId++;
        var latestItemId = markList(list, repeatId);
  
        var fragBlock = _this._createBlock(parentEl);
        fragBlock.children = [];
        fragBlock.data = list.slice(0);
  
        _this._checkRepeat(target, fragBlock, repeatId, latestItemId);
  
        list.forEach(function (item, index) {
          if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
            item.INDEX = index;
          }
          _this._generate(target, fragBlock, { repeat: item });
        });
  
        return {
          v: void 0
        };
      }();
  
      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }
  
    var subContext = this;
    if (context.repeat && !context.shown) {
      subContext = this._mergeContext(context.repeat);
    }
  
    if (!context.hasOwnProperty('shown') && target.shown) {
      var display = target.shown.call(subContext);
      var newContext = { shown: true };
      var _fragBlock = subContext._createBlock(parentEl);
  
      if (parentEl.element && parentEl.children) {
        parentEl.children.push(_fragBlock);
      }
  
      if (context.repeat) {
        newContext.repeat = context.repeat;
      }
  
      _fragBlock.display = !!display;
      subContext._checkDisplay(target, _fragBlock, newContext);
  
      if (display) {
        subContext._generate(target, _fragBlock, newContext);
      }
  
      return;
    }
  
    var typeGetter = target.type;
    var type = typeGetter;
  
    if (typeof typeGetter === 'function') {
      type = typeGetter.call(subContext);
  
      if (!context.hasOwnProperty('type')) {
        var _ret3 = function () {
          var newContext = { type: type };
          var fragBlock = subContext._createBlock(parentEl);
  
          if (parentEl.element && parentEl.children) {
            parentEl.children.push(fragBlock);
          }
  
          subContext._watch(typeGetter, function (value) {
            subContext._removeBlock(fragBlock, true);
            subContext._generate(target, fragBlock, { type: value });
          });
  
          subContext._generate(target, fragBlock, newContext);
  
          return {
            v: void 0
          };
        }();
  
        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
      }
    }
  
    var isComponent = void 0;
    if (this._app && this._app.customComponentMap && type) {
      isComponent = this._app.customComponentMap[type];
    } else {
      isComponent = target.component;
    }
  
    if (isComponent) {
      var Vm = this.constructor;
      var subVm = new Vm(type, subContext, parentEl, undefined, {
        'hook:init': function hookInit() {
          subContext._setId(target.id, null, this);
        },
        'hook:created': function hookCreated() {
          subContext._bindSubVm(this, target, context.repeat);
        },
        'hook:ready': function hookReady() {
          if (this._content) {
            subContext._setChildren(target, this._content);
          }
        }
      });
      subContext._bindSubVmAfterInitialized(subVm, target);
      return;
    }
  
    var element = subContext._generateElement(type, target, parentEl);
    var treeMode = target.append === 'tree';
    if (!treeMode) {
      subContext._attachTarget(element, parentEl);
    }
    subContext._setChildren(target, element);
    if (treeMode) {
      subContext._attachTarget(element, parentEl);
    }
  }
  
  /**
   * Generate element from template and attach to the dest if needed.
   * The time to attach depends on whether the mode status is node or tree.
   *
   * @param  {object} template
   * @param  {object} dest
   */
  function _generateElement(type, template, dest) {
  
    this._applyNaitveComponentOptions(template);
  
    var element = void 0;
    if (dest.ref === '_documentElement') {
      // if its parent is documentElement then it's a body
      element = this._createBody(type);
    } else {
      element = this._createElement(type);
    }
    // TODO it was a root element when not in a fragment
    if (!this._rootEl) {
      this._rootEl = element;
    }
  
    this._bindElement(element, template);
  
    if (template.attr && template.attr.append) {
      // backward, append prop in attr
      element.append = template.attr.append;
    }
  
    return element;
  }
  
  /**
   * Set all children to a certain parent element.
   *
   * @param {object} template
   * @param {object} parentEl
   */
  function _setChildren(template, parentEl) {
    var _this2 = this;
  
    var children = template.children;
    if (children && children.length) {
      children.forEach(function (child) {
        _this2._generate(child, parentEl);
      });
    }
  }
  
  /**
   * Watch the list update and refresh the changes.
   *
   * @param  {object} target
   * @param  {object} fragBlock
   */
  function _checkRepeat(target, fragBlock, repeatId, latestItemId) {
    var _this3 = this;
  
    var expression = target.repeat.expression || target.repeat;
    var children = fragBlock.children;
  
    this._watchBlock(fragBlock, expression, 'repeat', function (value) {
      if (!fragBlock) {
        return;
      }
  
      var oldChildren = children.slice();
      var oldValue = fragBlock.data.slice();
      // 1. collect all new refs track by
      var trackMap = {};
      var reusedMap = {};
      value.forEach(function (item, index) {
        var key = item['__wx_repeat_' + repeatId + '__'];
        if (!key) {
          key = latestItemId++;
          setRepeatItemId(item, repeatId, key);
        }
        trackMap[key] = item;
      });
  
      // 2. remove unused element foreach old item
      var reusedList = [];
      oldValue.forEach(function (item, index) {
        var key = item['__wx_repeat_' + repeatId + '__'];
        if (trackMap.hasOwnProperty(key)) {
          reusedMap[key] = { item: item, index: index, target: oldChildren[index] };
          reusedList.push(item);
        } else {
          _this3._removeTarget(oldChildren[index]);
        }
      });
  
      // 3. create new element foreach new item
      children.length = 0;
      fragBlock.data = value.slice();
      fragBlock.updateMark = fragBlock.start;
  
      value.forEach(function (item, index) {
        var key = item['__wx_repeat_' + repeatId + '__'];
        var reused = reusedMap[key];
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
          item.INDEX = index;
        }
        if (reused) {
          if (reused.item === reusedList[0]) {
            reusedList.shift();
          } else {
            reusedList.$remove(reused.item);
            _this3._moveTarget(reused.target, fragBlock.updateMark, true);
          }
          children.push(reused.target);
          fragBlock.updateMark = reused.target;
        } else {
          _this3._generate(target, fragBlock, { repeat: item });
        }
      });
  
      delete fragBlock.updateMark;
    });
  }
  
  var latestRepeatId = 1;
  
  function markList(list, repeatId) {
    var latestItemId = 1;
    list.forEach(function (item) {
      setRepeatItemId(item, repeatId, latestItemId++);
    });
    return latestItemId;
  }
  
  function setRepeatItemId(item, repeatId, itemId) {
    var key = '__wx_repeat_' + repeatId + '__';
    if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
      Object.defineProperty(item, key, {
        value: itemId
      });
    }
  }
  
  /**
   * Watch the display update and add/remove the element.
   *
   * @param  {object} target
   * @param  {object} fragBlock
   * @param  {object} context
   */
  function _checkDisplay(target, fragBlock, context) {
    var _this4 = this;
  
    this._watchBlock(fragBlock, target.shown, 'shown', function (value) {
      if (!fragBlock || !!fragBlock.display === !!value) {
        return;
      }
      fragBlock.display = value;
      if (value) {
        _this4._generate(target, fragBlock, context);
      } else {
        _this4._removeBlock(fragBlock, true);
      }
    });
  }
  
  function _watchBlock(fragBlock, calc, type, handler) {
    var differ = this && this._app && this._app.differ;
    var config = {};
    var depth = (fragBlock.element.depth || 0) + 1;
  
    this._watch(calc, function (value) {
      config.latestValue = value;
      if (differ && !config.recorded) {
        differ.append(type, depth, fragBlock.blockId, function () {
          var latestValue = config.latestValue;
          handler(latestValue);
          config.recorded = false;
          config.latestValue = undefined;
        });
      }
      config.recorded = true;
    });
  }
  
  /**
   * Clone a context and merge certain data.
   *
   * @param  {object} mergedData
   * @return {object}
   */
  function _mergeContext(mergedData) {
    var context = Object.create(this);
    context._data = mergedData;
    context._initData();
    context._realParent = this;
    return context;
  }

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                     * @fileOverview
                                                                                                                                                                                                                                                     * Directive Parser
                                                                                                                                                                                                                                                     */
  
  exports._applyNaitveComponentOptions = _applyNaitveComponentOptions;
  exports._bindElement = _bindElement;
  exports._bindSubVm = _bindSubVm;
  exports._bindSubVmAfterInitialized = _bindSubVmAfterInitialized;
  exports._setId = _setId;
  exports._setAttr = _setAttr;
  exports._setClass = _setClass;
  exports._setStyle = _setStyle;
  exports._setEvent = _setEvent;
  exports._bindEvents = _bindEvents;
  exports._bindDir = _bindDir;
  exports._bindKey = _bindKey;
  exports._watch = _watch;
  
  var _util = __webpack_require__(81);
  
  var _watcher = __webpack_require__(95);
  
  var _watcher2 = _interopRequireDefault(_watcher);
  
  var _config = __webpack_require__(79);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  var SETTERS = {
    attr: 'setAttr',
    style: 'setStyle',
    event: 'addEvent'
  };
  
  /**
   * apply the native component's options(specified by template.type)
   * to the template
   */
  function _applyNaitveComponentOptions(template) {
    var type = template.type;
  
    var options = _config.nativeComponentMap[type];
  
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      (0, _util.extend)(template, options);
    }
  }
  
  /**
   * bind all id, attr, classnames, style, events to an element
   */
  function _bindElement(el, template) {
    this._setId(template.id, el, this);
    this._setAttr(el, template.attr);
    this._setClass(el, template.classList);
    this._setStyle(el, template.style);
    this._bindEvents(el, template.events);
  }
  
  /**
   * bind all props to sub vm and bind all style, events to the root element
   * of the sub vm if it doesn't have a replaced multi-node fragment
   */
  function _bindSubVm(subVm, template, repeatItem) {
    subVm = subVm || {};
    template = template || {};
  
    var options = subVm._options || {};
  
    // bind props
    var props = options.props;
  
    if (Array.isArray(props)) {
      props = props.reduce(function (result, value) {
        result[value] = true;
        return result;
      }, {});
    }
  
    mergeProps(repeatItem, props, this, subVm);
    mergeProps(template.attr, props, this, subVm);
  }
  
  function _bindSubVmAfterInitialized(subVm, template) {
    mergeClassStyle(template.classList, this, subVm);
    mergeStyle(template.style, this, subVm);
    mergeEvent(template.events, this, subVm);
  }
  
  function mergeProps(target, props, vm, subVm) {
    if (!target) {
      return;
    }
  
    var _loop = function _loop(key) {
      if (!props || props[key]) {
        var value = target[key];
        if (typeof value === 'function') {
          var returnValue = vm._watch(value, function (v) {
            subVm[key] = v;
          });
          subVm[key] = returnValue;
        } else {
          subVm[key] = value;
        }
      }
    };
  
    for (var key in target) {
      _loop(key);
    }
  }
  
  function mergeStyle(target, vm, subVm) {
    var _loop2 = function _loop2(key) {
      var value = target[key];
      if (typeof value === 'function') {
        var returnValue = vm._watch(value, function (v) {
          if (subVm._rootEl) {
            subVm._rootEl.setStyle(key, v);
          }
        });
        subVm._rootEl.setStyle(key, returnValue);
      } else {
        if (subVm._rootEl) {
          subVm._rootEl.setStyle(key, value);
        }
      }
    };
  
    for (var key in target) {
      _loop2(key);
    }
  }
  
  function mergeClassStyle(target, vm, subVm) {
    var css = vm._options && vm._options.style || {};
  
    if (!subVm._rootEl) {
      return;
    }
  
    if (typeof target === 'function') {
      var _value = vm._watch(target, function (v) {
        setClassStyle(subVm._rootEl, css, v);
      });
      setClassStyle(subVm._rootEl, css, _value);
    } else if (target) {
      setClassStyle(subVm._rootEl, css, target);
    }
  }
  
  function mergeEvent(target, vm, subVm) {
    if (target && subVm._rootEl) {
      for (var type in target) {
        var handler = vm[target[type]];
        if (handler) {
          subVm._rootEl.addEvent(type, (0, _util.bind)(handler, vm));
        }
      }
    }
  }
  
  /**
   * bind id to an element
   * each id is unique in a whole vm
   */
  function _setId(id, el, vm) {
    var _this = this;
  
    var map = Object.create(null);
  
    Object.defineProperties(map, {
      vm: {
        value: vm,
        writable: false,
        configurable: false
      },
      el: {
        get: function get() {
          return el || vm._rootEl;
        },
        configurable: false
      }
    });
  
    if (typeof id === 'function') {
      var handler = id;
      id = handler.call(this);
      if (id) {
        this._ids[id] = map;
      }
      this._watch(handler, function (newId) {
        if (newId) {
          _this._ids[newId] = map;
        }
      });
    } else if (id && typeof id === 'string') {
      this._ids[id] = map;
    }
  }
  
  /**
   * bind attr to an element
   */
  function _setAttr(el, attr) {
    this._bindDir(el, 'attr', attr);
  }
  
  function setClassStyle(el, css, classList) {
    var classStyle = {};
    var length = classList.length;
  
    for (var i = 0; i < length; i++) {
      var style = css[classList[i]];
      if (style) {
        for (var key in style) {
          classStyle[key] = style[key];
        }
      }
    }
    el.setClassStyle(classStyle);
  }
  
  /**
   * bind classnames to an element
   */
  function _setClass(el, classList) {
  
    if (typeof classList !== 'function' && !Array.isArray(classList)) {
      return;
    }
    if (Array.isArray(classList) && !classList.length) {
      el.setClassStyle({});
      return;
    }
  
    var style = this._options && this._options.style || {};
    if (typeof classList === 'function') {
      var _value2 = this._watch(classList, function (v) {
        setClassStyle(el, style, v);
      });
      setClassStyle(el, style, _value2);
    } else {
      setClassStyle(el, style, classList);
    }
  }
  
  /**
   * bind style to an element
   */
  function _setStyle(el, style) {
    this._bindDir(el, 'style', style);
  }
  
  /**
   * add an event type and handler to an element and generate a dom update
   */
  function _setEvent(el, type, handler) {
    el.addEvent(type, (0, _util.bind)(handler, this));
  }
  
  /**
   * add all events of an element
   */
  function _bindEvents(el, events) {
    if (!events) {
      return;
    }
    var keys = Object.keys(events);
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      var handler = events[key];
      if (typeof handler === 'string') {
        handler = this[handler];
      }
      this._setEvent(el, key, handler);
    }
  }
  
  /**
   * set a series of members as a kind of an element
   * for example: style, attr, ...
   * if the value is a function then bind the data changes
   */
  function _bindDir(el, name, data) {
    if (!data) {
      return;
    }
    var keys = Object.keys(data);
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      var _value3 = data[key];
      if (typeof _value3 === 'function') {
        var update = _value3;
        this._bindKey(el, name, key, update);
      } else {
        el[SETTERS[name]](key, _value3);
      }
    }
  }
  
  /**
   * bind data changes to a certain key to a name series in an element
   */
  function _bindKey(el, name, key, calc) {
    var _this2 = this;
  
    var methodName = SETTERS[name];
    var obj = el[name];
    // watch the calc, and returns a value by calc.call()
    var value = this._watch(calc, function (value) {
      function handler() {
        el[methodName](key, value);
      }
      var differ = _this2 && _this2._app && _this2._app.differ;
      if (differ) {
        differ.append('element', el.depth, el.ref, handler);
      } else {
        handler();
      }
    });
  
    el[methodName](key, value);
  }
  
  /**
   * watch a calc function and callback if the calc value changes
   */
  function _watch(calc, callback) {
    var watcher = new _watcher2.default(this, calc, function (value, oldValue) {
      /* istanbul ignore if */
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' && value === oldValue) {
        return;
      }
      callback(value);
    });
  
    return watcher.value;
  }

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  /**
   * The MIT License (MIT)
   *
   * Copyright (c) 2013-2015 Yuxi Evan You
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   */
  
  var _ = __webpack_require__(87);
  // var config = require('./config')
  var Observer = __webpack_require__(88);
  // var expParser = require('./parsers/expression')
  // var batcher = require('./batcher')
  var uid = 0;
  
  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   *
   * @param {Vue} vm
   * @param {String} expression
   * @param {Function} cb
   * @param {Object} options
   *                 - {Array} filters
   *                 - {Boolean} twoWay
   *                 - {Boolean} deep
   *                 - {Boolean} user
   *                 - {Function} [preProcess]
   * @constructor
   */
  
  // function Watcher (vm, expression, cb, options) {
  function Watcher(vm, update, cb) {
    this.vm = vm;
    vm._watchers.push(this);
    // this.expression = expression
    this.cb = cb;
    this.id = ++uid; // uid for batching
    this.active = true;
    // options = options || {}
    // this.deep = !!options.deep
    // this.user = !!options.user
    // this.twoWay = !!options.twoWay
    // this.filters = options.filters
    // this.preProcess = options.preProcess
    this.deps = [];
    this.newDeps = [];
    // parse expression for getter/setter
    // var res = expParser.parse(expression, options.twoWay)
    // this.getter = res.get
    // this.setter = res.set
    this.getter = update;
    this.value = this.get();
  }
  
  var p = Watcher.prototype;
  
  /**
   * Add a dependency to this directive.
   *
   * @param {Dep} dep
   */
  
  p.addDep = function (dep) {
    var newDeps = this.newDeps;
    var old = this.deps;
    if (_.indexOf(newDeps, dep) < 0) {
      newDeps.push(dep);
      var i = _.indexOf(old, dep);
      if (i < 0) {
        dep.addSub(this);
      } else {
        old[i] = null;
      }
    }
  };
  
  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  
  p.get = function () {
    this.beforeGet();
    var vm = this.vm;
    var value;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      // if (config.warnExpressionErrors) {
      //   _.warn(
      //     'Error when evaluating expression "' +
      //     this.expression + '":\n   ' + e
      //   )
      // }
      _.warn('Error when update"');
    }
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    if (this.preProcess) {
      value = this.preProcess(value);
    }
    if (this.filters) {
      value = vm._applyFilters(value, null, this.filters, false);
    }
    this.afterGet();
    return value;
  };
  
  // /**
  //  * Set the corresponding value with the setter.
  //  *
  //  * @param {*} value
  //  */
  
  // p.set = function (value) {
  //   var vm = this.vm
  //   if (this.filters) {
  //     value = vm._applyFilters(
  //       value, this.value, this.filters, true)
  //   }
  //   try {
  //     this.setter.call(vm, vm, value)
  //   } catch (e) {
  //     // if (config.warnExpressionErrors) {
  //       _.warn(
  //         'Error when evaluating setter "' +
  //         this.expression + '":\n   ' + e
  //       )
  //     // }
  //   }
  // }
  
  /**
   * Prepare for dependency collection.
   */
  
  p.beforeGet = function () {
    Observer.target = this;
  };
  
  /**
   * Clean up for dependency collection.
   */
  
  p.afterGet = function () {
    Observer.target = null;
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (dep) {
        dep.removeSub(this);
      }
    }
    this.deps = this.newDeps;
    this.newDeps = [];
  };
  
  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  
  // p.update = function () {
  //   if (!config.async || config.debug) {
  //     this.run()
  //   } else {
  //     batcher.push(this)
  //   }
  // }
  
  // /**
  //  * Batcher job interface.
  //  * Will be called by the batcher.
  //  */
  
  // p.run = function () {
  p.update = function () {
    if (this.active) {
      var value = this.get();
      if (value !== this.value || Array.isArray(value) || this.deep) {
        var oldValue = this.value;
        this.value = value;
        this.cb(value, oldValue);
      }
    }
  };
  
  /**
   * Remove self from all dependencies' subcriber list.
   */
  
  p.teardown = function () {
    if (this.active) {
      // remove self from vm's watcher list
      // we can skip this if the vm if being destroyed
      // which can improve teardown performance.
      if (!this.vm._isBeingDestroyed) {
        this.vm._watchers.$remove(this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
      this.vm = this.cb = this.value = null;
    }
  };
  
  /**
   * Recrusively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   *
   * @param {Object} obj
   */
  
  function traverse(obj) {
    var key, val, i;
    for (key in obj) {
      val = obj[key];
      if (_.isArray(val)) {
        i = val.length;
        while (i--) {
          traverse(val[i]);
        }
      } else if (_.isObject(val)) {
        traverse(val);
      }
    }
  }
  
  module.exports = Watcher;

/***/ },
/* 96 */
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createBody = _createBody;
  exports._createElement = _createElement;
  exports._createBlock = _createBlock;
  exports._createBlockStart = _createBlockStart;
  exports._createBlockEnd = _createBlockEnd;
  exports._attachTarget = _attachTarget;
  exports._moveTarget = _moveTarget;
  exports._moveElement = _moveElement;
  exports._moveBlock = _moveBlock;
  exports._removeTarget = _removeTarget;
  exports._removeElement = _removeElement;
  exports._removeBlock = _removeBlock;
  /**
   * @fileOverview Document & Element Helpers.
   *
   * required:
   * Document#: createElement, createComment, getRef
   * Element#: appendChild, insertBefore, removeChild, nextSibling
   */
  
  /**
   * Create a body by type
   * Using this._app.doc
   *
   * @param  {string} type
   */
  function _createBody(type) {
    var doc = this._app.doc;
    return doc.createBody(type);
  }
  
  /**
   * Create an element by type
   * Using this._app.doc
   *
   * @param  {string} type
   */
  function _createElement(type) {
    var doc = this._app.doc;
    return doc.createElement(type);
  }
  
  /**
   * Create and return a frag block for an element.
   * The frag block has a starter, ender and the element itself.
   *
   * @param  {object} element
   */
  function _createBlock(element) {
    var start = this._createBlockStart();
    var end = this._createBlockEnd();
    var blockId = lastestBlockId++;
    if (element.element) {
      element.element.insertBefore(start, element.end);
      element.element.insertBefore(end, element.end);
      element = element.element;
    } else {
      element.appendChild(start);
      element.appendChild(end);
    }
    return { start: start, end: end, element: element, blockId: blockId };
  }
  
  var lastestBlockId = 1;
  
  /**
   * Create and return a block starter.
   * Using this._app.doc
   */
  function _createBlockStart() {
    var doc = this._app.doc;
    var anchor = doc.createComment('start');
    return anchor;
  }
  
  /**
   * Create and return a block ender.
   * Using this._app.doc
   */
  function _createBlockEnd() {
    var doc = this._app.doc;
    var anchor = doc.createComment('end');
    return anchor;
  }
  
  /**
   * Attach target to a certain dest using appendChild by default.
   * If the dest is a frag block then insert before the ender.
   * If the target is a frag block then attach the starter and ender in order.
   *
   * @param  {object} target
   * @param  {object} dest
   */
  function _attachTarget(target, dest) {
  
    if (dest.element) {
      var before = dest.end;
      var after = dest.updateMark;
      // push new target for watch list update later
      if (dest.children) {
        dest.children.push(target);
      }
      // for check repeat case
      if (after) {
        this._moveTarget(target, after);
        dest.updateMark = target.element ? target.end : target;
      } else if (target.element) {
        dest.element.insertBefore(target.start, before);
        dest.element.insertBefore(target.end, before);
      } else {
        dest.element.insertBefore(target, before);
      }
    } else {
      if (target.element) {
        dest.appendChild(target.start);
        dest.appendChild(target.end);
      } else {
        dest.appendChild(target);
      }
    }
  }
  
  /**
   * Move target before a certain element. The target maybe block or element.
   *
   * @param  {object} target
   * @param  {object} before
   */
  function _moveTarget(target, after) {
    if (target.element) {
      this._moveBlock(target, after);
    } else {
      this._moveElement(target, after);
    }
  }
  
  /**
   * Move element before a certain element.
   *
   * @param  {object} element
   * @param  {object} before
   */
  function _moveElement(element, after) {
    var doc = this._app.doc;
    var parent = doc.getRef(after.parentRef);
  
    if (parent) {
      parent.insertAfter(element, after);
    }
  }
  
  /**
   * Move all elements of the block before a certain element.
   *
   * @param  {object} fragBlock
   * @param  {object} before
   */
  function _moveBlock(fragBlock, after) {
    var doc = this._app.doc;
    var parent = doc.getRef(after.parentRef);
  
    if (parent) {
      (function () {
        var el = fragBlock.start;
        var group = [el];
  
        while (el && el !== fragBlock.end) {
          el = el.next();
          group.push(el);
        }
  
        var temp = after;
        group.forEach(function (el) {
          parent.insertAfter(el, temp);
          temp = el;
        });
      })();
    }
  }
  
  /**
   * Remove target from DOM tree.
   * If the target is a frag block then call _removeBlock
   *
   * @param  {object} target
   */
  function _removeTarget(target) {
  
    if (target.element) {
      this._removeBlock(target);
    } else {
      this._removeElement(target);
    }
  }
  
  /**
   * Remove a certain element.
   * Using this._app.doc
   *
   * @param  {object} target
   */
  function _removeElement(target) {
    var doc = this._app.doc;
    var parent = doc.getRef(target.parentRef);
  
    if (parent) {
      parent.removeChild(target);
    }
  }
  
  /**
   * Remove a frag block.
   * The second param decides whether the block self should be removed too.
   *
   * @param  {object}  fragBlock
   * @param  {Boolean} preserveBlock=false
   */
  function _removeBlock(fragBlock) {
    var _this = this;
  
    var preserveBlock = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  
    var result = [];
    var el = fragBlock.start.next();
  
    while (el && el !== fragBlock.end) {
      result.push(el);
      el = el.next();
    }
  
    if (!preserveBlock) {
      this._removeElement(fragBlock.start);
    }
    result.forEach(function (el) {
      _this._removeElement(el);
    });
    if (!preserveBlock) {
      this._removeElement(fragBlock.end);
    }
  }

/***/ },
/* 97 */
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.$emit = $emit;
  exports.$dispatch = $dispatch;
  exports.$broadcast = $broadcast;
  exports.$on = $on;
  exports.$off = $off;
  exports._initEvents = _initEvents;
  function Evt(type, detail) {
    if (detail instanceof Evt) {
      return detail;
    }
  
    this.timestamp = Date.now();
    this.detail = detail;
    this.type = type;
  
    var shouldStop = false;
    this.stop = function () {
      shouldStop = true;
    };
    this.hasStopped = function () {
      return shouldStop;
    };
  }
  
  function $emit(type, detail) {
    var _this = this;
  
    var events = this._vmEvents;
    var handlerList = events[type];
    if (handlerList) {
      (function () {
        var evt = new Evt(type, detail);
        handlerList.forEach(function (handler) {
          handler.call(_this, evt);
        });
      })();
    }
  }
  
  function $dispatch(type, detail) {
    var evt = new Evt(type, detail);
    this.$emit(type, evt);
  
    if (!evt.hasStopped() && this._parent && this._parent.$dispatch) {
      this._parent.$dispatch(type, evt);
    }
  }
  
  function $broadcast(type, detail) {
    var evt = new Evt(type, detail);
    this.$emit(type, evt);
  
    if (!evt.hasStopped() && this._childrenVms) {
      this._childrenVms.forEach(function (subVm) {
        subVm.$broadcast(type, evt);
      });
    }
  }
  
  function $on(type, handler) {
    if (!type || typeof handler !== 'function') {
      return;
    }
    var events = this._vmEvents;
    var handlerList = events[type] || [];
    handlerList.push(handler);
    events[type] = handlerList;
  
    // fixed old version lifecycle design
    if (type === 'hook:ready' && this._ready) {
      this.$emit('hook:ready');
    }
  }
  
  function $off(type, handler) {
    if (!type) {
      return;
    }
    var events = this._vmEvents;
    if (!handler) {
      delete events[type];
      return;
    }
    var handlerList = events[type];
    if (!handlerList) {
      return;
    }
    handlerList.$remove(handler);
  }
  
  var LIFE_CYCLE_TYPES = ['init', 'created', 'ready'];
  
  function _initEvents(externalEvents) {
    var _this2 = this;
  
    var options = this._options || {};
    var events = options.events || {};
    for (var type1 in events) {
      this.$on(type1, events[type1]);
    }
    for (var type2 in externalEvents) {
      this.$on(type2, externalEvents[type2]);
    }
    LIFE_CYCLE_TYPES.forEach(function (type) {
      _this2.$on('hook:' + type, options[type]);
    });
  }

/***/ },
/* 98 */
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.clearModules = clearModules;
  exports.getModule = getModule;
  exports.requireModule = requireModule;
  exports.registerModules = registerModules;
  exports.registerMethods = registerMethods;
  exports.requireComponent = requireComponent;
  exports.registerComponent = registerComponent;
  var nativeModules = {};
  
  function assignModules(modules, ifReplace) {
    var _loop = function _loop(moduleName) {
  
      // init `modules[moduleName][]`
      var methods = nativeModules[moduleName];
      if (!methods) {
        methods = {};
        nativeModules[moduleName] = methods;
      }
  
      // push each non-existed new method
      modules[moduleName].forEach(function (method) {
        if (typeof method === 'string') {
          method = {
            name: method
          };
        }
  
        if (!methods[method.name] || ifReplace) {
          methods[method.name] = method;
        }
      });
    };
  
    for (var moduleName in modules) {
      _loop(moduleName);
    }
  }
  
  function assignApis(Ctor, apis) {
    var p = Ctor.prototype;
  
    for (var apiName in apis) {
      if (!p.hasOwnProperty(apiName)) {
        p[apiName] = apis[apiName];
      }
    }
  }
  
  function clearModules() {
    nativeModules = {};
  }
  
  function getModule(moduleName) {
    return nativeModules[moduleName];
  }
  
  /**
   * @context a instance of AppInstance
   */
  function requireModule(moduleName) {
    var _this = this;
  
    var methods = nativeModules[moduleName];
    var target = {};
  
    var _loop2 = function _loop2(methodName) {
      target[methodName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
  
        return _this.callTasks({
          module: moduleName,
          method: methodName,
          args: args
        });
      };
    };
  
    for (var methodName in methods) {
      _loop2(methodName);
    }
  
    return target;
  }
  
  /**
   * @context Vm
   */
  function registerModules(modules, ifReplace) {
    assignModules(modules, ifReplace);
  }
  
  /**
   * @context Vm
   */
  function registerMethods(apis) {
    assignApis(this, apis);
  }
  
  /**
   * @context a instance of AppInstance
   */
  function requireComponent(name) {
    var customComponentMap = this.customComponentMap;
  
    return customComponentMap[name];
  }
  
  /**
   * @context a instance of AppInstance
   */
  function registerComponent(name, exports) {
    var customComponentMap = this.customComponentMap;
  
  
    if (customComponentMap[name]) {
      throw new Error('define a component(' + name + ') that already exists');
    }
  
    customComponentMap[name] = exports;
  }

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.normalizeVersion = normalizeVersion;
  exports.getError = getError;
  exports.check = check;
  
  var _semver = __webpack_require__(83);
  
  var _semver2 = _interopRequireDefault(_semver);
  
  var _util = __webpack_require__(81);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  /**
   * [normalizeVersion description]
   * @param  {String} Version. ie: 1, 1.0, 1.0.0
   * @return {String} Version
   */
  function normalizeVersion(v) {
    var isValid = _semver2.default.valid(v) ? true : false;
    if (isValid) {
      return v;
    }
  
    v = typeof v === 'string' ? v : '';
    var split = v.split('.');
    var i = 0;
    var result = [];
  
    while (i < 3) {
      var s = typeof split[i] === 'string' && split[i] ? split[i] : '0';
      result.push(s);
      i++;
    }
  
    return result.join('.');
  }
  
  function getError(key, val, criteria) {
    var result = {
      isDowngrade: true,
      errorType: 1,
      code: 1000
    };
    var getMsg = function getMsg(key, val, criteria) {
      return 'Downgrade[' + key + '] :: deviceInfo ' + val + ' matched criteria ' + criteria;
    };
    var _key = key.toLowerCase();
  
    result.errorMessage = getMsg(key, val, criteria);
  
    if (_key.indexOf('osversion') >= 0) {
      result.code = 1001;
    } else if (_key.indexOf('appversion') >= 0) {
      result.code = 1002;
    } else if (_key.indexOf('weexversion') >= 0) {
      result.code = 1003;
    } else if (_key.indexOf('devicemodel') >= 0) {
      result.code = 1004;
    }
  
    return result;
  }
  
  /**
   * WEEX framework input(deviceInfo)
   * {
   *   platform: 'iOS' or 'android'
   *   osVersion: '1.0.0' or '1.0' or '1'
   *   appVersion: '1.0.0' or '1.0' or '1'
   *   weexVersion: '1.0.0' or '1.0' or '1'
   *   dDeviceModel: 'MODEL_NAME'
   * }
   *
   * downgrade config(config)
   * {
   *   ios: {
   *     osVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
   *     appVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
   *     weexVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
   *     deviceModel: ['modelA', 'modelB', ...]
   *   },
   *   android: {
   *     osVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
   *     appVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
   *     weexVersion: '>1.0.0' or '>=1.0.0' or '<1.0.0' or '<=1.0.0' or '1.0.0'
   *     deviceModel: ['modelA', 'modelB', ...]
   *   }
   * }
   *
   *
   * @param  {object} deviceInfo Weex SDK framework input
   * @param  {object} config     user input
   * @return {Object}            { isDowngrade: true/false, errorMessage... }
   */
  function check(config, deviceInfo) {
    deviceInfo = deviceInfo || global.WXEnvironment;
    deviceInfo = (0, _util.isPlainObject)(deviceInfo) ? deviceInfo : {};
    config = (0, _util.isPlainObject)(config) ? config : {};
    var platform = deviceInfo.platform || 'unknow';
    var dPlatform = platform.toLowerCase();
    var cObj = config[dPlatform] || {};
  
    var result = {
      isDowngrade: false // defautl is pass
    };
  
    for (var i in deviceInfo) {
      var key = i;
      var keyLower = key.toLowerCase();
      var val = deviceInfo[i];
      var isVersion = keyLower.indexOf('version') >= 0 ? true : false;
      var isDeviceModel = keyLower.indexOf('devicemodel') >= 0 ? true : false;
      var criteria = cObj[i];
  
      if (criteria && isVersion) {
        var c = this.normalizeVersion(criteria);
        var d = this.normalizeVersion(deviceInfo[i]);
  
        if (_semver2.default.satisfies(d, c)) {
          result = (0, _util.extend)(this.getError(key, val, criteria));
          break;
        }
      } else if (isDeviceModel) {
        var _criteria = (0, _util.typof)(criteria) === 'array' ? criteria : [criteria];
        if (_criteria.indexOf(val) >= 0) {
          result = (0, _util.extend)(this.getError(key, val, criteria));
          break;
        }
      }
    }
  
    return result;
  }
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.init = init;
  exports.destroy = destroy;
  exports.getRootElement = getRootElement;
  exports.updateActions = updateActions;
  exports.fireEvent = fireEvent;
  exports.callback = callback;
  exports.refreshData = refreshData;
  
  var _util = __webpack_require__(81);
  
  var _perf = __webpack_require__(77);
  
  var perf = _interopRequireWildcard(_perf);
  
  var _domListener = __webpack_require__(101);
  
  var _domListener2 = _interopRequireDefault(_domListener);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                       * @fileOverview
                                                                                                                                                                                                       * instance controls from native
                                                                                                                                                                                                       *
                                                                                                                                                                                                       * - init bundle
                                                                                                                                                                                                       * - fire event
                                                                                                                                                                                                       * - callback
                                                                                                                                                                                                       * - destroy
                                                                                                                                                                                                       *
                                                                                                                                                                                                       * corresponded with the API of instance manager (framework.js)
                                                                                                                                                                                                       */
  
  function init(code, data) {
    var _this = this;
  
    var result;
    // @see: lib/app/bundle.js
    var define = (0, _util.bind)(this.define, this);
    var bootstrap = function bootstrap(name, config, _data) {
      result = _this.bootstrap(name, config, _data || data);
      _this.doc.listener.createFinish();
      _this.doc.close();
    };
  
    // backward(register/render)
    var register = (0, _util.bind)(this.register, this);
    var render = function render(name, _data) {
      result = _this.bootstrap(name, {}, _data);
    };
  
    var require = function require(name) {
      return function (_data) {
        result = _this.bootstrap(name, {}, _data);
      };
    };
  
    var document = this.doc;
  
    perf.start('run bundle', this.id);
  
    var functionBody = void 0;
    /* istanbul ignore if */
    if (typeof code === 'function') {
      // `function () {...}` -> `{...}`
      // not very strict
      functionBody = code.toString().substr(12);
    } else if (code) {
      functionBody = code.toString();
    }
  
    var fn = new Function('define', 'require', 'document', 'bootstrap', 'register', 'render', '__weex_define__', // alias for define
    '__weex_bootstrap__', // alias for bootstrap
    functionBody);
  
    fn(define, require, document, bootstrap, register, render, define, bootstrap);
  
    perf.end('run bundle', this.id);
    return result;
  }
  
  function destroy() {
    this.id = '';
    this.eventManager = null;
    this.options = null;
    this.blocks = null;
    this.vm = null;
    this.doc = null;
    this.customComponentMap = null;
    this.callbacks = null;
  }
  
  function getRootElement() {
    var doc = this.doc || {};
    var body = doc.body || {};
    return body.toJSON ? body.toJSON() : {};
  }
  
  function updateActions(addonTasks) {
    this.differ.flush();
    var tasks = [];
    if (this.listener && this.listener.updates.length) {
      tasks.push.apply(tasks, _toConsumableArray(this.listener.updates));
      this.listener.updates = [];
    }
    if (addonTasks && addonTasks.length) {
      tasks.push.apply(tasks, _toConsumableArray(addonTasks));
    }
    if (tasks.length) {
      this.callTasks(tasks);
    }
  }
  
  function fireEvent(ref, type, e, domChanges) {
    var _this2 = this;
  
    if (Array.isArray(ref)) {
      ref.some(function (ref) {
        return _this2.fireEvent(ref, type, e) !== false;
      });
      return;
    }
  
    var el = this.doc.getRef(ref);
  
    if (el) {
      perf.start('manage event', ref + '-' + type);
      e = e || {};
      e.type = type;
      e.target = el;
      e.timestamp = Date.now();
      if (domChanges) {
        updateElement(el, domChanges);
      }
      var result = this.eventManager.fire(el, type, e);
      perf.end('manage event', ref + '-' + type);
      this.updateActions();
      return result;
    }
  
    return new Error('invalid element reference "' + ref + '"');
  }
  
  function callback(callbackId, data, ifKeepAlive) {
    var callback = this.callbacks[callbackId];
  
    if (typeof callback === 'function') {
      callback(data); // data is already a object, @see: lib/framework.js
  
      if (typeof ifKeepAlive === 'undefined' || ifKeepAlive === false) {
        this.callbacks[callbackId] = undefined;
      }
  
      this.updateActions();
      return;
    }
  
    return new Error('invalid callback id "' + callbackId + '"');
  }
  
  function refreshData(data) {
    var vm = this.vm;
  
    if (vm && data) {
      if (typeof vm.refreshData === 'function') {
        vm.refreshData(data);
      } else {
        (0, _util.extend)(vm, data);
      }
      this.updateActions([(0, _domListener.createAction)('refreshFinish', [])]);
      return;
    }
  
    return new Error('invalid data "' + data + '"');
  }
  
  function updateElement(el, changes) {
    var attrs = changes.attrs || {};
    for (var name in attrs) {
      el.setAttr(name, attrs);
    }
    var style = changes.style || {};
    for (var _name in style) {
      el.setStyle(_name, style[_name]);
    }
  }

/***/ },
/* 101 */
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Listener;
  exports.createAction = createAction;
  function Listener(id, handler) {
    this.id = id;
    this.batched = false;
    this.updates = [];
    if (typeof handler === 'function') {
      this.handler = handler;
    }
  }
  
  Listener.prototype.createFinish = function (callback) {
    var handler = this.handler;
    handler([createAction('createFinish', [])], callback);
  };
  
  Listener.prototype.createBody = function (element, ref) {
    var actions = [createAction('createBody', [element.toJSON()])];
    this.addActions(actions);
  };
  
  Listener.prototype.addElement = function (element, ref, index) {
    if (!(index >= 0)) {
      index = -1;
    }
    this.addActions(createAction('addElement', [ref, element.toJSON(), index]));
  };
  
  Listener.prototype.removeElement = function (ref) {
    if (Array.isArray(ref)) {
      var actions = ref.map(function (r) {
        return createAction('removeElement', [r]);
      });
      this.addActions(actions);
    } else {
      this.addActions(createAction('removeElement', [ref]));
    }
  };
  
  Listener.prototype.moveElement = function (targetRef, parentRef, index) {
    this.addActions(createAction('moveElement', [targetRef, parentRef, index]));
  };
  
  Listener.prototype.setAttr = function (ref, key, value) {
    var result = {};
    result[key] = value;
    this.addActions(createAction('updateAttrs', [ref, result]));
  };
  
  Listener.prototype.setStyle = function (ref, key, value) {
    var result = {};
    result[key] = value;
    this.addActions(createAction('updateStyle', [ref, result]));
  };
  
  Listener.prototype.setStyles = function (ref, style) {
    this.addActions(createAction('updateStyle', [ref, style]));
  };
  
  Listener.prototype.addEvent = function (ref, type) {
    this.addActions(createAction('addEvent', [ref, type]));
  };
  
  Listener.prototype.removeEvent = function (ref, type) {
    this.addActions(createAction('removeEvent', [ref, type]));
  };
  
  Listener.prototype.handler = function (actions, cb) {
    cb && cb();
  };
  
  Listener.prototype.addActions = function (actions) {
    var updates = this.updates;
    var handler = this.handler;
  
    if (!Array.isArray(actions)) {
      actions = [actions];
    }
  
    if (this.batched) {
      updates.push.apply(updates, actions);
    } else {
      handler(actions);
    }
  };
  
  function createAction(name, args) {
    return { module: 'dom', method: name, args: args };
  }

/***/ },
/* 102 */
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var Differ = function () {
    function Differ(id) {
      _classCallCheck(this, Differ);
  
      this.id = id;
      this.map = [];
      this.hooks = [];
    }
  
    _createClass(Differ, [{
      key: 'isEmpty',
      value: function isEmpty() {
        return this.map.length === 0;
      }
    }, {
      key: 'append',
      value: function append(type, depth, ref, handler) {
        var map = this.map;
        if (!map[depth]) {
          map[depth] = {};
        }
        var group = map[depth];
        if (!group[type]) {
          group[type] = {};
        }
        if (type === 'element') {
          if (!group[type][ref]) {
            group[type][ref] = [];
          }
          group[type][ref].push(handler);
        } else {
          group[type][ref] = handler;
        }
      }
    }, {
      key: 'flush',
      value: function flush() {
        var map = this.map.slice();
        this.map.length = 0;
        map.forEach(function (group) {
          callTypeMap(group, 'repeat');
          callTypeMap(group, 'shown');
          callTypeList(group, 'element');
        });
  
        var hooks = this.hooks.slice();
        this.hooks.length = 0;
        hooks.forEach(function (fn) {
          fn();
        });
  
        if (!this.isEmpty()) {
          this.flush();
        }
      }
    }, {
      key: 'then',
      value: function then(fn) {
        this.hooks.push(fn);
      }
    }]);
  
    return Differ;
  }();
  
  exports.default = Differ;
  
  
  function callTypeMap(group, type) {
    var map = group[type];
    for (var ref in map) {
      map[ref]();
    }
  }
  
  function callTypeList(group, type) {
    var map = group[type];
    for (var ref in map) {
      var list = map[ref];
      list.forEach(function (handler) {
        handler();
      });
    }
  }

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                     * @fileOverview event manager
                                                                                                                                                                                                                                                     */
  
  exports.default = EventManager;
  
  var _util = __webpack_require__(81);
  
  var _ = _interopRequireWildcard(_util);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function EventManager() {
    this.els = [];
    this.targets = [];
  }
  
  EventManager.prototype._get = function (el, force) {
    var index = _.indexOf(this.els, el);
    var target;
    if (index >= 0) {
      target = this.targets[index];
    } else if (force) {
      target = { el: el, events: {} };
      this.els.push(el);
      this.targets.push(target);
    }
    return target;
  };
  
  EventManager.prototype.add = function (el, type, handler) {
    if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) !== 'object' || !el || typeof type !== 'string' || !type || typeof handler !== 'function') {
      return;
    }
    var target = this._get(el, true);
    target.events[type] = handler;
  };
  
  EventManager.prototype.remove = function (el, type) {
    if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) !== 'object' || !el || typeof type !== 'string' || !type) {
      return;
    }
    var target = this._get(el);
    if (target) {
      delete target.events[type];
    }
  };
  
  EventManager.prototype.fire = function (el, type, e) {
    var target = this._get(el);
    var handler, el;
    if (target) {
      el = target.el;
      handler = target.events[type];
      if (typeof handler === 'function') {
        return handler.call(el, e);
      }
    }
  };

/***/ },
/* 104 */
/***/ function(module, exports) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Document = Document;
  exports.destroyDocument = destroyDocument;
  exports.Node = Node;
  exports.Element = Element;
  exports.Comment = Comment;
  /**
   * @fileOverview
   * A simple virtual dom implementation
   */
  
  var DEFAULT_TAG_NAME = 'div';
  
  var instanceMap = exports.instanceMap = {};
  
  function Document(id) {
    id = id ? id.toString() : '';
    this.id = id;
    this.nextRef = 1;
    this.nodeMap = {};
    this.listener = null;
    this.eventManager = null;
    this.closed = false;
    instanceMap[id] = this;
  
    this.createDocumentElement();
  }
  
  function destroyDocument(id) {
    delete instanceMap[id];
  }
  
  Document.prototype.open = function () {
    this.closed = false;
    if (this.listener) {
      this.listener.batched = false;
    }
  };
  Document.prototype.close = function () {
    this.closed = true;
    if (this.listener) {
      this.listener.batched = true;
    }
  };
  
  Document.prototype.setEventManager = function (eventManager) {
    this.eventManager = eventManager;
  };
  
  Document.prototype.setListener = function (listener) {
    this.listener = listener;
    listener.batched = !!this.closed;
  };
  
  Document.prototype.addRef = function (el) {
    el.ref = this.nextRef.toString();
    this.nodeMap[el.ref] = el;
    this.nextRef++;
  };
  
  Document.prototype.getRef = function (ref) {
    return this.nodeMap[ref];
  };
  
  Document.prototype.removeRef = function (ref) {
    delete this.nodeMap[ref];
  };
  
  Document.prototype.createDocumentElement = function (type, props) {
    if (!this.documentElement) {
      this.documentElement = new Element(type, props, this);
      this.nodeMap._documentElement = this.documentElement;
      this.documentElement.ref = '_documentElement';
      this.documentElement.attached = true;
    }
  
    return this.documentElement;
  };
  
  Document.prototype.createBody = function (type, props) {
    if (!this.body) {
      this.body = new Element(type, props, this);
      this.nodeMap._root = this.body;
      this.body.ref = '_root';
      this.body.depth = 1;
    }
  
    return this.body;
  };
  
  Document.prototype.createElement = function (tagName, props) {
    return new Element(tagName, props, this);
  };
  
  Document.prototype.createComment = function (text) {
    return new Comment(text, this);
  };
  
  function Node() {}
  
  Node.prototype.create = function (instanceId) {
    this.parentRef = null;
    this.attached = false;
    if (instanceId) {
      this.instanceId = instanceId;
      var doc = instanceMap[instanceId];
      doc.addRef(this);
    }
  };
  
  Node.prototype.destroy = function () {
    var ref = this.ref;
    var instanceId = this.instanceId;
    if (instanceId) {
      var doc = instanceMap[instanceId];
      doc.removeRef(ref);
    }
  
    var children = this.children || [];
    var length = children.length;
    for (var i = 0; i < length; i++) {
      children[i].destroy();
    }
  };
  
  Node.prototype.getRenderer = function () {
    var doc = instanceMap[this.instanceId];
    return doc.listener;
  };
  
  Node.prototype.next = function () {
    var instanceId = this.instanceId;
    var doc = instanceMap[instanceId];
    var parent = doc.getRef(this.parentRef);
    if (parent) {
      return parent.children[parent.children.indexOf(this) + 1];
    }
  };
  
  Node.prototype.prev = function () {
    var instanceId = this.instanceId;
    var doc = instanceMap[instanceId];
    var parent = doc.getRef(this.parentRef);
    if (parent) {
      return parent.children[parent.children.indexOf(this) - 1];
    }
  };
  
  function Element() {
    var type = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_TAG_NAME : arguments[0];
    var props = arguments[1];
    var ownerDocument = arguments[2];
  
    props = props || {};
    this.create(ownerDocument.id);
    this.ownerDocument = ownerDocument;
    this.type = type;
    this.attr = props.attr || {};
    this.classStyle = props.classStyle || {};
    this.style = props.style || {};
    this.event = [];
    this.children = [];
    this.pureChildren = [];
  }
  
  Element.prototype = new Node();
  
  Element.prototype.appendChild = function (node) {
  
    removeIfExisted(node);
    node.parentRef = this.ref;
    this.children.push(node);
  
    if (this.attached) {
      setAttached(node, this.depth);
    } else {
      setDetached(node);
    }
  
    if (node instanceof Element) {
      this.pureChildren.push(node);
  
      if (this.attached) {
        var renderer = this.getRenderer();
        if (renderer) {
          if (this.ref === '_documentElement') {
            // if its parent is documentElement then it's a body
            renderer.createBody(node, this.ref);
          } else {
            renderer.addElement(node, this.ref);
          }
        }
      }
    }
  };
  
  Element.prototype.insertBefore = function (node, before) {
  
    if (node.parentRef === this.ref) {
      moveBefore(node, before, this.children);
      if (node instanceof Element) {
        var pureBeforeIndex = movePureBefore(node, before, this.pureChildren);
        if (pureBeforeIndex >= 0 && this.attached) {
          var renderer = this.getRenderer();
          if (renderer) {
            renderer.moveElement(node.ref, this.ref, pureBeforeIndex);
          }
        }
      }
      return;
    }
  
    removeIfExisted(node);
  
    var children = this.children;
    var index = children.indexOf(before);
  
    node.parentRef = this.ref;
    if (this.attached) {
      setAttached(node, this.depth);
    } else {
      setDetached(node);
    }
    children.splice(index, 0, node);
  
    if (node instanceof Element) {
      var pureChildren = this.pureChildren;
      var pureIndex = getPureAfter(before, pureChildren);
  
      pureChildren.splice(pureIndex, 0, node);
  
      if (this.attached) {
        var _renderer = this.getRenderer();
        if (_renderer) {
          _renderer.addElement(node, this.ref, pureIndex);
        }
      }
    }
  };
  
  Element.prototype.insertAfter = function (node, after) {
  
    if (node.parentRef === this.ref) {
      moveAfter(node, after, this.children);
      if (node instanceof Element) {
        var pureAfterIndex = movePureAfter(node, after, this.pureChildren);
        if (pureAfterIndex >= 0 && this.attached) {
          var renderer = this.getRenderer();
          if (renderer) {
            renderer.moveElement(node.ref, this.ref, pureAfterIndex);
          }
        }
      }
      return;
    }
  
    removeIfExisted(node);
  
    var children = this.children;
    var index = children.indexOf(after);
  
    node.parentRef = this.ref;
    if (this.attached) {
      setAttached(node, this.depth);
    } else {
      setDetached(node);
    }
    children.splice(index + 1, 0, node);
  
    if (node instanceof Element) {
      var pureChildren = this.pureChildren;
      var pureIndex = getPureBefore(after, pureChildren);
  
      pureChildren.splice(pureIndex + 1, 0, node);
  
      if (this.attached) {
        var _renderer2 = this.getRenderer();
        if (_renderer2) {
          _renderer2.addElement(node, this.ref, pureIndex + 1);
        }
      }
    }
  };
  
  Element.prototype.removeChild = function (node, preserved) {
    var children = this.children;
    var index = children.indexOf(node);
  
    setDetached(node);
  
    if (index >= 0) {
      node.parentRef = null;
      children.splice(index, 1);
      if (!preserved) {
        node.destroy();
      }
    }
  
    if (node instanceof Element) {
      this.pureChildren.$remove(node);
      if (this.attached) {
        var renderer = this.getRenderer();
        if (renderer) {
          renderer.removeElement(node.ref);
        }
      }
    }
  };
  
  Element.prototype.clear = function () {
    var children = this.children;
    var length = children.length;
    for (var i = 0; i < length; i++) {
      var child = children[i];
      child.parentRef = null;
      setDetached(child);
      child.destroy();
    }
    children.length = 0;
  
    if (this.attached) {
      var refs = this.pureChildren.map(function (child) {
        return child.ref;
      });
      this.pureChildren.length = 0;
      var renderer = this.getRenderer();
      if (renderer) {
        renderer.removeElement(refs);
      }
    }
  };
  
  function moveBefore(node, before, children) {
    var targetIndex = children.indexOf(node);
    var beforeIndex = children.indexOf(before);
  
    /* istanbul ignore next */
    if (targetIndex === beforeIndex || targetIndex + 1 === beforeIndex) {
      return -1;
    }
  
    var newIndex = targetIndex < beforeIndex ? beforeIndex - 1 : beforeIndex;
    children.splice(targetIndex, 1);
    children.splice(newIndex, 0, node);
  
    return beforeIndex;
  }
  
  function movePureBefore(node, before, pureChildren) {
    var pureTargetIndex = pureChildren.indexOf(node);
    var pureBeforeIndex = getPureAfter(before, pureChildren);
  
    /* istanbul ignore next */
    if (pureTargetIndex === pureBeforeIndex || pureTargetIndex + 1 === pureBeforeIndex) {
      return -1;
    }
  
    var pureNewIndex = pureTargetIndex < pureBeforeIndex ? pureBeforeIndex - 1 : pureBeforeIndex;
  
    pureChildren.splice(pureTargetIndex, 1);
    pureChildren.splice(pureNewIndex, 0, node);
  
    return pureBeforeIndex;
  }
  
  function getPureAfter(node, pureChildren) {
    var pureIndex = pureChildren.indexOf(node);
    while (node && pureIndex < 0) {
      node = node.next();
      pureIndex = pureChildren.indexOf(node);
    }
    if (pureIndex < 0) {
      pureIndex = pureChildren.length;
    }
    return pureIndex;
  }
  
  function moveAfter(node, after, children) {
    var targetIndex = children.indexOf(node);
    var afterIndex = children.indexOf(after);
  
    /* istanbul ignore next */
    if (targetIndex === afterIndex || targetIndex === afterIndex + 1) {
      return -1;
    }
  
    var newIndex = targetIndex < afterIndex ? afterIndex : afterIndex + 1;
    children.splice(targetIndex, 1);
    children.splice(newIndex, 0, node);
  
    return afterIndex;
  }
  
  function movePureAfter(node, after, pureChildren) {
    var pureTargetIndex = pureChildren.indexOf(node);
    var pureAfterIndex = getPureBefore(after, pureChildren);
  
    /* istanbul ignore next */
    if (pureTargetIndex === pureAfterIndex || pureTargetIndex === pureAfterIndex + 1) {
      return -1;
    }
  
    var pureNewIndex = pureTargetIndex < pureAfterIndex ? pureAfterIndex : pureAfterIndex + 1;
  
    pureChildren.splice(pureTargetIndex, 1);
    pureChildren.splice(pureNewIndex, 0, node);
  
    return pureAfterIndex + 1;
  }
  
  function getPureBefore(node, pureChildren) {
    var pureIndex = pureChildren.indexOf(node);
    while (node && pureIndex < 0) {
      node = node.prev();
      pureIndex = pureChildren.indexOf(node);
    }
    /* istanbul ignore next */
    if (pureIndex < 0) {
      pureIndex = -1;
    }
    return pureIndex;
  }
  
  function setAttached(node, depth) {
    if (node.ref === '_root') {
      depth = 1;
    } else {
      depth = depth > 0 ? depth + 1 : 0;
    }
    node.attached = true;
    node.depth = depth;
    if (node.children) {
      node.children.forEach(function (sub) {
        setAttached(sub, depth);
      });
    }
  }
  
  function setDetached(node) {
    node.attached = false;
    node.depth = 0;
    if (node.children) {
      node.children.forEach(function (sub) {
        setDetached(sub);
      });
    }
  }
  
  function removeIfExisted(node) {
    var doc = instanceMap[node.instanceId];
    if (doc) {
      var existedNode = doc.getRef(node.ref);
      if (existedNode) {
        var existedParent = doc.getRef(existedNode.parentRef);
        if (existedParent && existedParent.removeChild) {
          existedParent.removeChild(existedNode, true);
        }
      }
    }
  }
  
  Element.prototype.setAttr = function (key, value) {
    if (this.attr[key] === value) {
      return;
    }
    this.attr[key] = value;
    if (this.attached) {
      var renderer = this.getRenderer();
      if (renderer) {
        renderer.setAttr(this.ref, key, value);
      }
    }
  };
  
  Element.prototype.setStyle = function (key, value) {
    if (this.style[key] === value) {
      return;
    }
    this.style[key] = value;
    if (this.attached) {
      var renderer = this.getRenderer();
      if (renderer) {
        renderer.setStyle(this.ref, key, value);
      }
    }
  };
  
  Element.prototype.setClassStyle = function (classStyle) {
    this.classStyle = classStyle;
    if (this.attached) {
      var renderer = this.getRenderer();
      if (renderer) {
        renderer.setStyles(this.ref, this.toStyle());
      }
    }
  };
  
  Element.prototype.addEvent = function (type, handler) {
    var index = this.event.indexOf(type);
  
    if (index < 0) {
      this.event.push(type);
      var eventManager = this.ownerDocument.eventManager;
      eventManager.add(this, type, handler);
  
      if (this.attached) {
        var renderer = this.getRenderer();
        if (renderer) {
          renderer.addEvent(this.ref, type);
        }
      }
    }
  };
  
  Element.prototype.removeEvent = function (type) {
    var index = this.event.indexOf(type);
  
    if (index >= 0) {
      this.event.splice(index, 1);
      var eventManager = this.ownerDocument.eventManager;
      eventManager.remove(this, type);
  
      if (this.attached) {
        var renderer = this.getRenderer();
        if (renderer) {
          renderer.removeEvent(this.ref, type);
        }
      }
    }
  };
  
  Element.prototype.toStyle = function () {
    var result = {};
    var classStyle = this.classStyle;
    var style = this.style;
    for (var name in classStyle) {
      result[name] = classStyle[name];
    }
    for (var _name in style) {
      result[_name] = style[_name];
    }
    return result;
  };
  
  Element.prototype.toJSON = function () {
    var result = {
      ref: this.ref.toString(),
      type: this.type,
      attr: this.attr,
      style: this.toStyle()
    };
  
    if (this.event && this.event.length) {
      result.event = this.event;
    }
    if (this.pureChildren && this.pureChildren.length) {
      result.children = this.pureChildren.map(function (child) {
        return child.toJSON();
      });
    }
  
    return result;
  };
  
  Element.prototype.toString = function () {
    return '<' + this.type + ' attr=' + JSON.stringify(this.attr) + ' style=' + JSON.stringify(this.toStyle()) + '>' + this.pureChildren.map(function (child) {
      return child.toString();
    }).join('') + '</' + this.type + '>';
  };
  
  function Comment(value, ownerDocument) {
    this.create(ownerDocument.id);
    this.type = 'comment';
    this.value = value;
  }
  
  Comment.prototype = new Node();
  
  Comment.prototype.toString = function () {
    return '<!-- ' + this.value + ' -->';
  };

/***/ },
/* 105 */
/***/ function(module, exports) {

  module.exports = {
    "name": "weex-jsframework",
    "version": "0.13.7",
    "description": "JS Framework for Weex solution which is a extendable cross-platform solution for dynamic programming and publishing projects",
    "main": "index.js",
    "scripts": {
      "dev": "webpack --watch --config ./webpack.config.js",
      "build": "webpack --config ./webpack.config.js",
      "compress": "uglifyjs dist/index.js -o dist/index.min.js",
      "lint": "jscs --config .jscsrc polyfill/*.js polyfill/__test__/*.js lib/*.js lib/__test__/*.js lib/app/*.js lib/app/__test__/*.js lib/vm/*.js lib/vm/__test__/*.js",
      "test": "mocha --compilers js:babel-core/register polyfill/__test__/*.js lib/__test__/*.js lib/**/__test__/*.js",
      "cover": "babel-node node_modules/isparta/bin/isparta cover --report text node_modules/mocha/bin/_mocha -- --reporter dot lib/__test__/*.js lib/**/__test__/*.js",
      "ci": "npm run lint && npm run cover"
    },
    "repository": {
      "type": "git",
      "url": "git@github.com:alibaba/weex.git"
    },
    "author": [
      {
        "name": "jinjiang",
        "email": "zhaojinjiang@me.com"
      },
      {
        "name": "Terry King",
        "email": "terrykingcha@gmail.com"
      }
    ],
    "contributors": [
      {
        "name": "pushiming",
        "email": "pushiming@gmail.com"
      },
      {
        "name": "iskenhuang",
        "email": "iskenhuang@gmail.com"
      },
      {
        "name": "yuanyan",
        "email": "yuanyan.cao@gmail.com"
      }
    ],
    "keywords": [
      "weex",
      "mvvm",
      "browser",
      "hybrid",
      "framework"
    ],
    "license": "Apache-2.0",
    "dependencies": {
      "semver": "~5.1.0",
      "core-js": "~2.1.1"
    },
    "devDependencies": {
      "babel-cli": "~6.4.5",
      "babel-core": "~6.4.5",
      "babel-loader": "~6.2.1",
      "babel-preset-es2015": "~6.3.13",
      "chai": "~3.2.0",
      "isparta": "~4.0.0",
      "istanbul": "~0.4.2",
      "jscs": "~2.9.0",
      "json-loader": "^0.5.4",
      "mocha": "~2.3.4",
      "sinon": "~1.17.2",
      "sinon-chai": "~2.8.0",
      "uglify-js": "^2.6.2",
      "watch-cli": "~0.2.1",
      "webpack": "~1.12.12"
    },
    "optionalDependencies": {
      "weex-transformer": "~0.3"
    }
  };

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.$ = $;
  exports.$el = $el;
  exports.$vm = $vm;
  exports.$renderThen = $renderThen;
  exports.$scrollTo = $scrollTo;
  exports.$transition = $transition;
  exports.$getConfig = $getConfig;
  exports.$sendHttp = $sendHttp;
  exports.$openURL = $openURL;
  exports.$setTitle = $setTitle;
  exports.$call = $call;
  
  var _util = __webpack_require__(81);
  
  /**
   * ==========================================================
   * common
   * ==========================================================
   */
  
  /**
   * @deprecated use $vm instead
   * find the vm by id
   * Note: there is only one id in whole component
   * @param  {string} id
   * @return {Vm}
   */
  function $(id) {
    nativeLog('[WARNING] the Vm#$ api is deprecated, please use Vm#$vm instead');
    var info = this._ids[id];
    if (info) {
      return info.vm;
    }
  }
  
  /**
   * find the element by id
   * Note: there is only one id in whole component
   * @param  {string} id
   * @return {Element}
   */
  /**
   * @fileOverview The api for invoking with "$" prefix
   */
  function $el(id) {
    var info = this._ids[id];
    if (info) {
      return info.el;
    }
  }
  
  /**
   * find the vm of the custom component by id
   * Note: there is only one id in whole component
   * @param  {string} id
   * @return {Vm}
   */
  function $vm(id) {
    var info = this._ids[id];
    if (info) {
      return info.vm;
    }
  }
  
  /**
   * Fire when differ rendering finished
   *
   * @param  {Function} fn
   */
  function $renderThen(fn) {
    var app = this._app;
    var differ = app.differ;
    return differ.then(function () {
      fn();
    });
  }
  
  /**
   * scroll an element specified by id into view, 
   * moreover specify a number of offset optionally
   * @param  {string} id
   * @param  {number} offset
   */
  function $scrollTo(id, offset) {
    var el = this.$el(id);
    if (el) {
      var dom = this._app.requireModule('dom');
      dom.scrollToElement(el.ref, { offset: offset });
    }
  }
  
  /**
   * perform transition animation on an element specified by id
   * @param  {string}   id
   * @param  {object}   options
   * @param  {object}   options.styles
   * @param  {object}   options.duration(ms)
   * @param  {object}   [options.timingFunction]
   * @param  {object}   [options.delay=0(ms)]
   * @param  {Function} callback
   */
  function $transition(id, options, callback) {
    var _this = this;
  
    var el = this.$el(id);
    if (el && options && options.styles) {
      var animation = this._app.requireModule('animation');
      animation.transition(el.ref, options, function () {
        _this._setStyle(el, options.styles);
        callback && callback.apply(undefined, arguments);
      });
    }
  }
  
  /**
   * get some config
   * @return {object} some config for app instance
   * @property {string} bundleUrl
   * @property {boolean} debug
   * @property {object} env
   * @property {string} env.weexVersion(ex. 1.0.0)
   * @property {string} env.appName(ex. TB/TM)
   * @property {string} env.appVersion(ex. 5.0.0)
   * @property {string} env.platform(ex. iOS/Android)
   * @property {string} env.osVersion(ex. 7.0.0)
   * @property {string} env.deviceModel **native only**
   * @property {number} env.[deviceWidth=750]
   * @property {number} env.deviceHeight
   */
  function $getConfig(callback) {
    var config = (0, _util.extend)({
      env: global.WXEnvironment || {}
    }, this._app.options);
    if ((0, _util.typof)(callback) === 'function') {
      nativeLog('[WARNING] the callback of Vm#$getConfig(callback) is deprecated, ' + 'this api now can directly RETURN config info.');
      callback(config);
    }
    return config;
  }
  
  /**
   * request network via http protocol
   * @param  {object}   params
   * @param  {Function} callback
   */
  function $sendHttp(params, callback) {
    var stream = this._app.requireModule('stream');
    stream.sendHttp(params, callback);
  }
  
  /**
   * open a url
   * @param  {string} url
   */
  function $openURL(url) {
    var event = this._app.requireModule('event');
    event.openURL(url);
  }
  
  /**
   * set a title for page
   * @param  {string} title
   */
  function $setTitle(title) {
    var pageInfo = this._app.requireModule('pageInfo');
    pageInfo.setTitle(title);
  }
  
  /**
   * invoke a native method by specifing the name of module and method
   * @param  {string} moduleName
   * @param  {string} methodName
   * @param  {...*} the rest arguments
   */
  function $call(moduleName, methodName) {
    var module = this._app.requireModule(moduleName);
    if (module && module[methodName]) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
  
      module[methodName].apply(module, args);
    }
  }
  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjNiODNkODQ3Zjc5MDZiZGY0YWIiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vcG9seWZpbGwvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vcG9seWZpbGwvb2JqZWN0QXNzaWduLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9mbi9vYmplY3QvYXNzaWduLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19leHBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19mYWlscy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL191aWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19jb2YuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL190by1sZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX3RvLWluZGV4LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL190by1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vcG9seWZpbGwvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2xpYnJhcnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2Zvci1vZi5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fc2V0LXByb3RvLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fdGFzay5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9faW52b2tlLmpzIiwid2VicGFjazovLy8uL34vY29yZS1qcy9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NvcmUtanMvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwid2VicGFjazovLy8uL3BvbHlmaWxsL3NldFRpbWVvdXQuanMiLCJ3ZWJwYWNrOi8vLy4vcG9seWZpbGwvY29uc29sZWxvZy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvZnJhbWV3b3JrLmpzIiwid2VicGFjazovLy8uL2xpYi9wZXJmLmpzIiwid2VicGFjazovLy8uL2xpYi9sb2cuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYXBwL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9hcHAvYnVuZGxlLmpzIiwid2VicGFjazovLy8uL34vc2VtdmVyL3NlbXZlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvdm0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3ZtL2luc3RhbmNlL3Njb3BlLmpzIiwid2VicGFjazovLy8uL2xpYi92bS91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi92bS9vYnNlcnZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvdm0vY29uZmlnLmpzIiwid2VicGFjazovLy8uL2xpYi92bS9vYnNlcnZlci9kZXAuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3ZtL29ic2VydmVyL2FycmF5LmpzIiwid2VicGFjazovLy8uL2xpYi92bS9vYnNlcnZlci9vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3ZtL2NvbXBpbGVyLmpzIiwid2VicGFjazovLy8uL2xpYi92bS9kaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3ZtL3dhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3ZtL2RvbS1oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3ZtL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYXBwL3JlZ2lzdGVyLmpzIiwid2VicGFjazovLy8uL2xpYi9hcHAvZG93bmdyYWRlLmpzIiwid2VicGFjazovLy8uL2xpYi9hcHAvY3RybC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYXBwL2RvbS1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYXBwL2RpZmZlci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYXBwL2V2ZW50LmpzIiwid2VicGFjazovLy8uL2xpYi9hcHAvZG9tLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2UuanNvbiIsIndlYnBhY2s6Ly8vLi9saWIvYXBpL21ldGhvZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7O0FBQ0E7O0tBQVksUzs7QUFDWjs7Ozs0QkFFUyxVO0FBQ0wsWUFBTyxVQUFQLElBQXFCLFlBQW1CO0FBQ3BDLGFBQU0sTUFBTSxVQUFVLFVBQVYsNkJBQVo7QUFDQSxhQUFJLGVBQWUsS0FBbkIsRUFBMEI7QUFDdEIscUJBQVEsS0FBUixDQUFjLElBQUksUUFBSixFQUFkO0FBQ0gsVUFGRCxNQUVPLElBQUksZUFBZSxLQUFuQixFQUEwQjtBQUM3QixpQkFBSSxPQUFKLENBQVksYUFBSztBQUNiLHFCQUFJLGFBQWEsS0FBakIsRUFBd0I7QUFDcEIsNkJBQVEsS0FBUixDQUFjLEVBQUUsUUFBRixFQUFkO0FBQ0g7QUFDSixjQUpEO0FBS0g7QUFDRCxnQkFBTyxHQUFQO0FBQ0gsTUFaRDs7O0FBREosTUFBSyxJQUFJLFVBQVQsSUFBdUIsU0FBdkIsRUFBa0M7QUFBQSxXQUF6QixVQUF5QjtBQWNqQzs7QUFFRCxRQUFPLE1BQVAsQ0FBYyxNQUFkLEVBQXNCO0FBQ2xCLHVDQURrQjtBQUVsQiw2QkFBd0IsOEJBQXFCLGtCQUFyQjtBQUZOLEVBQXRCOzs7OztBQVFBLEtBQU0sVUFBVSxvQkFBUSxHQUFSLENBQWhCO2VB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RVosS0FBSyxJQUFMLENBQVUsT0FGRSxDQUFmO0FBR0EsT0FBSSxpQkFBTSxRQUFOLE1BQW9CLFVBQXhCLEVBQW9DO0FBQ2xDLGVBQVUsc0VBQ1IsK0NBREY7QUFFQSxjQUFTLE1BQVQ7QUFDRDtBQUNELFVBQU8sTUFBUDtBQUNEOzs7Ozs7O0FBT00sVUFBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCLFFBQTNCLEVBQXFDO0FBQzFDLE9BQU0sU0FBUyxLQUFLLElBQUwsQ0FBVSxhQUFWLENBQXdCLFFBQXhCLENBQWY7QUFDQSxVQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsRUFBd0IsUUFBeEI7QUFDRDs7Ozs7O0FBTU0sVUFBUyxRQUFULENBQWtCLEdBQWxCLEVBQXVCO0FBQzVCLE9BQU0sUUFBUSxLQUFLLElBQUwsQ0FBVSxhQUFWLENBQXdCLE9BQXhCLENBQWQ7QUFDQSxTQUFNLE9BQU4sQ0FBYyxHQUFkO0FBQ0Q7Ozs7OztBQU1NLFVBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQjtBQUMvQixPQUFNLFdBQVcsS0FBSyxJQUFMLENBQVUsYUFBVixDQUF3QixVQUF4QixDQUFqQjtBQUNBLFlBQVMsUUFBVCxDQUFrQixLQUFsQjtBQUNEOzs7Ozs7OztBQVFNLFVBQVMsS0FBVCxDQUFlLFVBQWYsRUFBMkIsVUFBM0IsRUFBZ0Q7QUFDckQsT0FBTSxTQUFTLEtBQUssSUFBTCxDQUFVLGFBQVYsQ0FBd0IsVUFBeEIsQ0FBZjtBQUNBLE9BQUksVUFBVSxPQUFPLFVBQVAsQ0FBZCxFQUFrQztBQUFBLHVDQUZhLElBRWI7QUFGYSxXQUViO0FBQUE7O0FBQ2hDLFlBQU8sVUFBUCxnQkFBc0IsSUFBdEI7QUFDRDtBQUNGLEUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDYzYjgzZDg0N2Y3OTA2YmRmNGFiXG4gKiovIiwiaW1wb3J0ICcuL3BvbHlmaWxsJ1xuaW1wb3J0ICogYXMgZnJhbWV3b3JrIGZyb20gJy4vbGliL2ZyYW1ld29yaydcbmltcG9ydCB7dmVyc2lvbiwgb3B0aW9uYWxEZXBlbmRlbmNpZXN9IGZyb20gJy4vcGFja2FnZS5qc29uJ1xuXG5mb3IgKGxldCBtZXRob2ROYW1lIGluIGZyYW1ld29yaykge1xuICAgIGdsb2JhbFttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGZyYW1ld29ya1ttZXRob2ROYW1lXSguLi5hcmdzKVxuICAgICAgICBpZiAocmV0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmV0LnRvU3RyaW5nKCkpXG4gICAgICAgIH0gZWxzZSBpZiAocmV0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJldC5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0XG4gICAgfVxufVxuXG5PYmplY3QuYXNzaWduKGdsb2JhbCwge1xuICAgIGZyYW1ld29ya1ZlcnNpb246IHZlcnNpb24sXG4gICAgbmVlZFRyYW5zZm9ybWVyVmVyc2lvbjogb3B0aW9uYWxEZXBlbmRlbmNpZXNbJ3dlZXgtdHJhbnNmb3JtZXInXVxufSlcblxuLyoqXG4gKiByZWdpc3RlciBtZXRob2RzXG4gKi9cbmNvbnN0IG1ldGhvZHMgPSByZXF1aXJlKCcuL2xpYi9hcGkvbWV0aG9kcycpXG5jb25zdCB7cmVnaXN0ZXJNZXRob2RzfSA9IGdsb2JhbFxucmVnaXN0ZXJNZXRob2RzKG1ldGhvZHMpXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2luZGV4LmpzXG4gKiovIiwiaW1wb3J0ICcuL29iamVjdEFzc2lnbidcbmltcG9ydCAnLi9wcm9taXNlJ1xuaW1wb3J0ICcuL3NldFRpbWVvdXQnXG5pbXBvcnQgJy4vY29uc29sZWxvZydcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcG9seWZpbGwvaW5kZXguanNcbiAqKi8iLCJpbXBvcnQgJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbidcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcG9seWZpbGwvb2JqZWN0QXNzaWduLmpzXG4gKiovIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9mbi9vYmplY3QvYXNzaWduLmpzXG4gKiovIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qc1xuICoqLyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIHJlZGVmaW5lICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KVxuICAgICwga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmKHRhcmdldClyZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZihleHBvcnRzW2tleV0gIT0gb3V0KWhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KWV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qc1xuICoqLyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanNcbiAqKi8iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcyLjEuNSd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fY29yZS5qc1xuICoqLyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzXG4gKiovIiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanNcbiAqKi8iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xyXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanNcbiAqKi8iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzXG4gKiovIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanNcbiAqKi8iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL190by1wcmltaXRpdmUuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qc1xuICoqLyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgU1JDICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpXG4gICwgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJ1xuICAsICR0b1N0cmluZyA9IEZ1bmN0aW9uW1RPX1NUUklOR11cbiAgLCBUUEwgICAgICAgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywga2V5LCB2YWwsIHNhZmUpe1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYoaXNGdW5jdGlvbiloYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmKE9ba2V5XSA9PT0gdmFsKXJldHVybjtcbiAgaWYoaXNGdW5jdGlvbiloYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYoTyA9PT0gZ2xvYmFsKXtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaWYoIXNhZmUpe1xuICAgICAgZGVsZXRlIE9ba2V5XTtcbiAgICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihPW2tleV0pT1trZXldID0gdmFsO1xuICAgICAgZWxzZSBoaWRlKE8sIGtleSwgdmFsKTtcbiAgICB9XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLmpzXG4gKiovIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9faGFzLmpzXG4gKiovIiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzXG4gKiovIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19jdHguanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIHBJRSAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpXG4gICwgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgJGFzc2lnbiAgPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICB2YXIgQSA9IHt9XG4gICAgLCBCID0ge31cbiAgICAsIFMgPSBTeW1ib2woKVxuICAgICwgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKGspeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUICAgICA9IHRvT2JqZWN0KHRhcmdldClcbiAgICAsIGFMZW4gID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgaW5kZXggPSAxXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mXG4gICAgLCBpc0VudW0gICAgID0gcElFLmY7XG4gIHdoaWxlKGFMZW4gPiBpbmRleCl7XG4gICAgdmFyIFMgICAgICA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKVxuICAgICAgLCBrZXlzICAgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAsIGogICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKGxlbmd0aCA+IGopaWYoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSlUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtYXNzaWduLmpzXG4gKiovIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXHJcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcclxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xyXG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMuanNcbiAqKi8iLCJ2YXIgaGFzICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcclxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxyXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcclxuICAsIElFX1BST1RPICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XHJcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXHJcbiAgICAsIGkgICAgICA9IDBcclxuICAgICwgcmVzdWx0ID0gW11cclxuICAgICwga2V5O1xyXG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcclxuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXHJcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xyXG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qc1xuICoqLyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fdG8taW9iamVjdC5qc1xuICoqLyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2lvYmplY3QuanNcbiAqKi8iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2NvZi5qc1xuICoqLyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzXG4gKiovIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXg7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qc1xuICoqLyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX3RvLWxlbmd0aC5qc1xuICoqLyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL190by1pbnRlZ2VyLmpzXG4gKiovIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL190by1pbmRleC5qc1xuICoqLyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXHJcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xyXG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLWtleS5qc1xuICoqLyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLmpzXG4gKiovIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xyXG5tb2R1bGUuZXhwb3J0cyA9IChcclxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xyXG4pLnNwbGl0KCcsJyk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qc1xuICoqLyIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanNcbiAqKi8iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtcGllLmpzXG4gKiovIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX3RvLW9iamVjdC5qc1xuICoqLyIsIi8vIGZpeCBQcm9taXNlIFByb2JsZW0gb24gSlNDb250ZXh0IG9mIGlPUzd+OFxuLy8gQHNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM1ODY2XG5nbG9iYWwuUHJvbWlzZSA9IG51bGxcbnJlcXVpcmUoJ2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpXG5yZXF1aXJlKCdjb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpXG5yZXF1aXJlKCdjb3JlLWpzL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpXG5yZXF1aXJlKCdjb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UnKVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vcG9seWZpbGwvcHJvbWlzZS5qc1xuICoqLyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCB0ZXN0ICAgID0ge307XG50ZXN0W3JlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXSA9ICd6JztcbmlmKHRlc3QgKyAnJyAhPSAnW29iamVjdCB6XScpe1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKE9iamVjdC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuICdbb2JqZWN0ICcgKyBjbGFzc29mKHRoaXMpICsgJ10nO1xuICB9LCB0cnVlKTtcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzXG4gKiovIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzXG4gKiovIiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX3drcy5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzXG4gKiovIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKVxuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCAkZW50cmllcyAgID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZFxuICAgICwgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmVcbiAgICAsIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJGFueU5hdGl2ZSl7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UpKTtcbiAgICBpZihJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSl7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYoIUxJQlJBUlkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qc1xuICoqLyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxyXG52YXIgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxyXG4gICwgZFBzICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJylcclxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXHJcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxyXG4gICwgRW1wdHkgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XHJcbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xyXG5cclxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxyXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcclxuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKVxyXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcclxuICAgICwgZ3QgICAgID0gJz4nXHJcbiAgICAsIGlmcmFtZURvY3VtZW50O1xyXG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xyXG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcclxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xyXG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcclxuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xyXG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcclxuICBpZnJhbWVEb2N1bWVudC53cml0ZSgnPHNjcmlwdD5kb2N1bWVudC5GPU9iamVjdDwvc2NyaXB0JyArIGd0KTtcclxuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xyXG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xyXG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcclxuICByZXR1cm4gY3JlYXRlRGljdCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKXtcclxuICB2YXIgcmVzdWx0O1xyXG4gIGlmKE8gIT09IG51bGwpe1xyXG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xyXG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xyXG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XHJcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXHJcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcclxuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xyXG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzXG4gKiovIiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcclxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcclxuICAsIGdldEtleXMgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKXtcclxuICBhbk9iamVjdChPKTtcclxuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxyXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgLCBpID0gMFxyXG4gICAgLCBQO1xyXG4gIHdoaWxlKGxlbmd0aCA+IGkpZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcclxuICByZXR1cm4gTztcclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9faHRtbC5qc1xuICoqLyIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mXG4gICwgaGFzID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qc1xuICoqLyIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXHJcbnZhciBoYXMgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXHJcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXHJcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxyXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XHJcbiAgTyA9IHRvT2JqZWN0KE8pO1xyXG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xyXG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xyXG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xyXG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdwby5qc1xuICoqLyIsInZhciAkaXRlcmF0b3JzICAgID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKVxuICAsIHJlZGVmaW5lICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHdrcyAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAsIElURVJBVE9SICAgICAgPSB3a3MoJ2l0ZXJhdG9yJylcbiAgLCBUT19TVFJJTkdfVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpXG4gICwgQXJyYXlWYWx1ZXMgICA9IEl0ZXJhdG9ycy5BcnJheTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlXG4gICAgLCBrZXk7XG4gIGlmKHByb3RvKXtcbiAgICBpZighcHJvdG9bSVRFUkFUT1JdKWhpZGUocHJvdG8sIElURVJBVE9SLCBBcnJheVZhbHVlcyk7XG4gICAgaWYoIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICAgIEl0ZXJhdG9yc1tOQU1FXSA9IEFycmF5VmFsdWVzO1xuICAgIGZvcihrZXkgaW4gJGl0ZXJhdG9ycylpZighcHJvdG9ba2V5XSlyZWRlZmluZShwcm90bywga2V5LCAkaXRlcmF0b3JzW2tleV0sIHRydWUpO1xuICB9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qc1xuICoqLyIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbnZhciBVTlNDT1BBQkxFUyA9IHJlcXVpcmUoJy4vX3drcycpKCd1bnNjb3BhYmxlcycpXG4gICwgQXJyYXlQcm90byAgPSBBcnJheS5wcm90b3R5cGU7XG5pZihBcnJheVByb3RvW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpcmVxdWlyZSgnLi9faGlkZScpKEFycmF5UHJvdG8sIFVOU0NPUEFCTEVTLCB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2l0ZXItc3RlcC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICAgICAgPSByZXF1aXJlKCcuL19saWJyYXJ5JylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgY2xhc3NvZiAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgJGV4cG9ydCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBpc09iamVjdCAgICAgICAgICAgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICAgICAgICAgID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgYW5JbnN0YW5jZSAgICAgICAgID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKVxuICAsIGZvck9mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2Zvci1vZicpXG4gICwgc2V0UHJvdG8gICAgICAgICAgID0gcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0XG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpXG4gICwgdGFzayAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldFxuICAsIG1pY3JvdGFzayAgICAgICAgICA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpXG4gICwgUFJPTUlTRSAgICAgICAgICAgID0gJ1Byb21pc2UnXG4gICwgVHlwZUVycm9yICAgICAgICAgID0gZ2xvYmFsLlR5cGVFcnJvclxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgJFByb21pc2UgICAgICAgICAgID0gZ2xvYmFsW1BST01JU0VdXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBpc05vZGUgICAgICAgICAgICAgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIGVtcHR5ICAgICAgICAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBJbnRlcm5hbCwgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xuXG52YXIgVVNFX05BVElWRSA9ICEhZnVuY3Rpb24oKXtcbiAgdHJ5IHtcbiAgICAvLyBjb3JyZWN0IHN1YmNsYXNzaW5nIHdpdGggQEBzcGVjaWVzIHN1cHBvcnRcbiAgICB2YXIgcHJvbWlzZSAgICAgPSAkUHJvbWlzZS5yZXNvbHZlKDEpXG4gICAgICAsIEZha2VQcm9taXNlID0gKHByb21pc2UuY29uc3RydWN0b3IgPSB7fSlbcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKV0gPSBmdW5jdGlvbihleGVjKXsgZXhlYyhlbXB0eSwgZW1wdHkpOyB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufSgpO1xuXG4vLyBoZWxwZXJzXG52YXIgc2FtZUNvbnN0cnVjdG9yID0gZnVuY3Rpb24oYSwgYil7XG4gIC8vIHdpdGggbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICByZXR1cm4gYSA9PT0gYiB8fCBhID09PSAkUHJvbWlzZSAmJiBiID09PSBXcmFwcGVyO1xufTtcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICByZXR1cm4gc2FtZUNvbnN0cnVjdG9yKCRQcm9taXNlLCBDKVxuICAgID8gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgOiBuZXcgR2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcbnZhciBQcm9taXNlQ2FwYWJpbGl0eSA9IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbigkJHJlc29sdmUsICQkcmVqZWN0KXtcbiAgICBpZihyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ICA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCAgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn07XG52YXIgcGVyZm9ybSA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIGV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4ge2Vycm9yOiBlfTtcbiAgfVxufTtcbnZhciBub3RpZnkgPSBmdW5jdGlvbihwcm9taXNlLCBpc1JlamVjdCl7XG4gIGlmKHByb21pc2UuX24pcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdlxuICAgICAgLCBvayAgICA9IHByb21pc2UuX3MgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0aW9uKXtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWxcbiAgICAgICAgLCByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZVxuICAgICAgICAsIHJlamVjdCAgPSByZWFjdGlvbi5yZWplY3RcbiAgICAgICAgLCBkb21haW4gID0gcmVhY3Rpb24uZG9tYWluXG4gICAgICAgICwgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaGFuZGxlcil7XG4gICAgICAgICAgaWYoIW9rKXtcbiAgICAgICAgICAgIGlmKHByb21pc2UuX2ggPT0gMilvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihoYW5kbGVyID09PSB0cnVlKXJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYoZG9tYWluKWRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgICBpZihkb21haW4pZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKXtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpe1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgYWJydXB0LCBoYW5kbGVyLCBjb25zb2xlO1xuICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UpKXtcbiAgICAgIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoaXNOb2RlKXtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pe1xuICAgICAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3Ipe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZihhYnJ1cHQpdGhyb3cgYWJydXB0LmVycm9yO1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgaWYocHJvbWlzZS5faCA9PSAxKXJldHVybiBmYWxzZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYSB8fCBwcm9taXNlLl9jXG4gICAgLCBpICAgICA9IDBcbiAgICAsIHJlYWN0aW9uO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdGlvbiA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3Rpb24uZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3Rpb24ucHJvbWlzZSkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciBoYW5kbGVyO1xuICAgIGlmKGlzTm9kZSl7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnJlamVjdGlvbmhhbmRsZWQpe1xuICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92fSk7XG4gICAgfVxuICB9KTtcbn07XG52YXIgJHJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZighcHJvbWlzZS5fYSlwcm9taXNlLl9hID0gcHJvbWlzZS5fYy5zbGljZSgpO1xuICBub3RpZnkocHJvbWlzZSwgdHJ1ZSk7XG59O1xudmFyICRyZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcHJvbWlzZSA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHByb21pc2UuX2QpcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYocHJvbWlzZSA9PT0gdmFsdWUpdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtfdzogcHJvbWlzZSwgX2Q6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlLl92ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zID0gMTtcbiAgICAgIG5vdGlmeShwcm9taXNlLCBmYWxzZSk7XG4gICAgfVxuICB9IGNhdGNoKGUpe1xuICAgICRyZWplY3QuY2FsbCh7X3c6IHByb21pc2UsIF9kOiBmYWxzZX0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZighVVNFX05BVElWRSl7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gICRQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbCh0aGlzLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIHJlYWN0aW9uICAgID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRQcm9taXNlKSk7XG4gICAgICByZWFjdGlvbi5vayAgICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgICA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHJlYWN0aW9uLmRvbWFpbiA9IGlzTm9kZSA/IHByb2Nlc3MuZG9tYWluIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHRoaXMuX2EpdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHRoaXMuX3Mpbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xuICBQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHByb21pc2UgID0gbmV3IEludGVybmFsO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gY3R4KCRyZXNvbHZlLCBwcm9taXNlLCAxKTtcbiAgICB0aGlzLnJlamVjdCAgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtQcm9taXNlOiAkUHJvbWlzZX0pO1xucmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKSgkUHJvbWlzZSwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuL19zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NvcmUnKVtQUk9NSVNFXTtcblxuLy8gc3RhdGljc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKXtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVqZWN0ICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKExJQlJBUlkgfHwgIVVTRV9OQVRJVkUpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIC8vIGluc3RhbmNlb2YgaW5zdGVhZCBvZiBpbnRlcm5hbCBzbG90IGNoZWNrIGJlY2F1c2Ugd2Ugc2hvdWxkIGZpeCBpdCB3aXRob3V0IHJlcGxhY2VtZW50IG5hdGl2ZSBQcm9taXNlIGNvcmVcbiAgICBpZih4IGluc3RhbmNlb2YgJFByb21pc2UgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpKXJldHVybiB4O1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZXNvbHZlICA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICAkJHJlc29sdmUoeCk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpe1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZXNvbHZlICAgID0gY2FwYWJpbGl0eS5yZXNvbHZlXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgdmFyIHZhbHVlcyAgICA9IFtdXG4gICAgICAgICwgaW5kZXggICAgID0gMFxuICAgICAgICAsIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICB2YXIgJGluZGV4ICAgICAgICA9IGluZGV4KytcbiAgICAgICAgICAsIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBpZihhbHJlYWR5Q2FsbGVkKXJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkICA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IHRoaXNcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSl7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2FuLWluc3RhbmNlLmpzXG4gKiovIiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUil7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvcjtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICB9XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2Zvci1vZi5qc1xuICoqLyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY2FsbC5qc1xuICoqLyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qc1xuICoqLyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuL19jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKVxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzXG4gKiovIiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24oTywgcHJvdG8pe1xuICBhbk9iamVjdChPKTtcbiAgaWYoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCl0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbih0ZXN0LCBidWdneSwgc2V0KXtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vX2N0eCcpKEZ1bmN0aW9uLmNhbGwsIHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZihPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX3NldC1wcm90by5qc1xuICoqLyIsInZhciBwSUUgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxyXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcclxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXHJcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXHJcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXHJcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcclxuICAsIGdPUEQgICAgICAgICAgID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcclxuXHJcbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xyXG4gIE8gPSB0b0lPYmplY3QoTyk7XHJcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xyXG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XHJcbiAgICByZXR1cm4gZ09QRChPLCBQKTtcclxuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wZC5qc1xuICoqLyIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpXG4gICwgU1BFQ0lFUyAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywgRCl7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3IsIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qc1xuICoqLyIsInZhciBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGludm9rZSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2ludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCl7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spe1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKXtcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKXtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL190YXNrLmpzXG4gKiovIiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX2ludm9rZS5qc1xuICoqLyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbnZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBwYXJlbnQsIGZuO1xuICBpZihpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSlwYXJlbnQuZXhpdCgpO1xuICB3aGlsZShoZWFkKXtcbiAgICBmbiA9IGhlYWQuZm47XG4gICAgZm4oKTsgLy8gPC0gY3VycmVudGx5IHdlIHVzZSBpdCBvbmx5IGZvciBQcm9taXNlIC0gdHJ5IC8gY2F0Y2ggbm90IHJlcXVpcmVkXG4gICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG59O1xuXG4vLyBOb2RlLmpzXG5pZihpc05vZGUpe1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xuLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG59IGVsc2UgaWYoT2JzZXJ2ZXIpe1xuICB2YXIgdG9nZ2xlID0gdHJ1ZVxuICAgICwgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICB9O1xuLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2Vcbn0gZWxzZSBpZihQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmbHVzaCk7XG4gIH07XG4vLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuLy8gLSBzZXRJbW1lZGlhdGVcbi8vIC0gTWVzc2FnZUNoYW5uZWxcbi8vIC0gd2luZG93LnBvc3RNZXNzYWdcbi8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4vLyAtIHNldFRpbWVvdXRcbn0gZWxzZSB7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuKXtcbiAgdmFyIHRhc2sgPSB7Zm46IGZuLCBuZXh0OiB1bmRlZmluZWR9O1xuICBpZihsYXN0KWxhc3QubmV4dCA9IHRhc2s7XG4gIGlmKCFoZWFkKXtcbiAgICBoZWFkID0gdGFzaztcbiAgICBub3RpZnkoKTtcbiAgfSBsYXN0ID0gdGFzaztcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fbWljcm90YXNrLmpzXG4gKiovIiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMsIHNhZmUpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBzYWZlKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBkUCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSl7XG4gIHZhciBDID0gZ2xvYmFsW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9jb3JlLWpzL21vZHVsZXMvX3NldC1zcGVjaWVzLmpzXG4gKiovIiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyBzYWZlID0gdHJ1ZTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vY29yZS1qcy9tb2R1bGVzL19pdGVyLWRldGVjdC5qc1xuICoqLyIsImNvbnN0IHtcbiAgc2V0VGltZW91dCwgc2V0VGltZW91dE5hdGl2ZVxufSA9IGdsb2JhbFxuXG4vLyBmaXggbm8gc2V0VGltZW91dCBvbiBBbmRyb2lkIFY4XG5pZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICd1bmRlZmluZWQnICYmXG4gIHR5cGVvZiBzZXRUaW1lb3V0TmF0aXZlID09PSAnZnVuY3Rpb24nKSB7XG4gIGNvbnN0IHRpbWVvdXRNYXAgPSB7fVxuICBsZXQgdGltZW91dElkID0gMFxuICBnbG9iYWwuc2V0VGltZW91dCA9IChjYiwgdGltZSkgPT4ge1xuICAgIHRpbWVvdXRNYXBbKyt0aW1lb3V0SWRdID0gY2JcbiAgICBzZXRUaW1lb3V0TmF0aXZlKHRpbWVvdXRJZC50b1N0cmluZygpLCB0aW1lKVxuICB9XG4gIGdsb2JhbC5zZXRUaW1lb3V0Q2FsbGJhY2sgPSAoaWQpID0+IHtcbiAgICBpZiAodHlwZW9mIHRpbWVvdXRNYXBbaWRdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aW1lb3V0TWFwW2lkXSgpXG4gICAgICBkZWxldGUgdGltZW91dE1hcFtpZF1cbiAgICB9XG4gIH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3BvbHlmaWxsL3NldFRpbWVvdXQuanNcbiAqKi8iLCJjb25zdCB7Y29uc29sZX0gPSBnbG9iYWxcblxuaWYgKHR5cGVvZiBjb25zb2xlID09PSAndW5kZWZpbmVkJykge1xuICBnbG9iYWwuY29uc29sZSA9IHtcbiAgICBsb2c6ICguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIG5hdGl2ZUxvZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBuYXRpdmVMb2coLi4uYXJncylcbiAgICAgIH1cbiAgICB9LFxuICAgIGVycm9yOiAoLi4uYXJncykgPT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGFyZ3MpXG4gICAgfVxuICB9XG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9wb2x5ZmlsbC9jb25zb2xlbG9nLmpzXG4gKiovIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IE1haW4gZW50cnksIGluc3RhbmNlIG1hbmFnZXJcbiAqXG4gKiAtIGNyZWF0ZUluc3RhbmNlKGluc3RhbmNlSWQsIGNvZGUsIG9wdGlvbnMsIGRhdGEpXG4gKiAtIHJlZnJlc2hJbnN0YW5jZShpbnN0YW5jZUlkLCBkYXRhKVxuICogLSBkZXN0cm95SW5zdGFuY2UoaW5zdGFuY2VJZClcbiAqIC0gcmVnaXN0ZXJDb21wb25lbnRzKGNvbXBvbmVudHMpXG4gKiAtIHJlZ2lzdGVyTW9kdWxlcyhtb2R1bGVzKVxuICogLSBnZXRSb290KGluc3RhbmNlSWQpXG4gKiAtIGluc3RhbmNlTWFwXG4gKiAtIGNhbGxKUyhpbnN0YW5jZUlkLCB0YXNrcylcbiAqICAgLSBmaXJlRXZlbnQocmVmLCB0eXBlLCBkYXRhKVxuICogICAtIGNhbGxiYWNrKGZ1bmNJZCwgZGF0YSlcbiAqL1xuXG5pbXBvcnQgKiBhcyBwZXJmIGZyb20gJy4vcGVyZidcbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tICcuL2NvbmZpZydcbmltcG9ydCBBcHBJbnN0YW5jZSBmcm9tICcuL2FwcCdcbmltcG9ydCBWbSBmcm9tICcuL3ZtJ1xuXG52YXIge1xuICBuYXRpdmVDb21wb25lbnRNYXBcbn0gPSBjb25maWdcbnZhciBpbnN0YW5jZU1hcCA9IHt9XG5cbi8qKlxuICogY3JlYXRlIGEgV2VleCBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gaW5zdGFuY2VJZFxuICogQHBhcmFtICB7c3RyaW5nfSBjb2RlXG4gKiBAcGFyYW0gIHtvYmplY3R9IFtvcHRpb25zXSBvcHRpb24gYEhBU19MT0dgIGVuYWJsZSBwcmludCBsb2dcbiAqIEBwYXJhbSAge29iamVjdH0gW2RhdGFdXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShpbnN0YW5jZUlkLCBjb2RlLCBvcHRpb25zLCBkYXRhKSB7XG4gIHZhciBpbnN0YW5jZSA9IGluc3RhbmNlTWFwW2luc3RhbmNlSWRdXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cbiAgY29uZmlnLmRlYnVnID0gb3B0aW9ucy5kZWJ1Z1xuXG4gIHZhciByZXN1bHRcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIHBlcmYuc3RhcnQoJ2NyZWF0ZUluc3RhbmNlJywgaW5zdGFuY2VJZClcbiAgICBpbnN0YW5jZSA9IG5ldyBBcHBJbnN0YW5jZShpbnN0YW5jZUlkLCBvcHRpb25zKVxuICAgIGluc3RhbmNlTWFwW2luc3RhbmNlSWRdID0gaW5zdGFuY2VcbiAgICByZXN1bHQgPSBpbnN0YW5jZS5pbml0KGNvZGUsIGRhdGEpXG4gICAgcGVyZi5lbmQoJ2NyZWF0ZUluc3RhbmNlJywgaW5zdGFuY2VJZClcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBuZXcgRXJyb3IoYGludmFsaWQgaW5zdGFuY2UgaWQgXCIke2luc3RhbmNlSWR9XCJgKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vKipcbiAqIHJlZnJlc2ggYSBXZWV4IGluc3RhbmNlXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBpbnN0YW5jZUlkXG4gKiBAcGFyYW0gIHtvYmplY3R9IGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZnJlc2hJbnN0YW5jZShpbnN0YW5jZUlkLCBkYXRhKSB7XG4gIHZhciBpbnN0YW5jZSA9IGluc3RhbmNlTWFwW2luc3RhbmNlSWRdXG4gIHZhciByZXN1bHRcbiAgaWYgKGluc3RhbmNlKSB7XG4gICAgcGVyZi5zdGFydCgncmVmcmVzaERhdGEnLCBpbnN0YW5jZUlkKVxuICAgIHJlc3VsdCA9IGluc3RhbmNlLnJlZnJlc2hEYXRhKGRhdGEpXG4gICAgcGVyZi5lbmQoJ3JlZnJlc2hEYXRhJywgaW5zdGFuY2VJZClcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBuZXcgRXJyb3IoYGludmFsaWQgaW5zdGFuY2UgaWQgXCIke2luc3RhbmNlSWR9XCJgKVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxuLyoqXG4gKiBkZXN0cm95IGEgV2VleCBpbnN0YW5jZVxuICogQHBhcmFtICB7c3RyaW5nfSBpbnN0YW5jZUlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95SW5zdGFuY2UoaW5zdGFuY2VJZCkge1xuICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZU1hcFtpbnN0YW5jZUlkXVxuICBpZiAoIWluc3RhbmNlKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcihgaW52YWxpZCBpbnN0YW5jZSBpZCBcIiR7aW5zdGFuY2VJZH1cImApXG4gIH1cblxuICBwZXJmLnN0YXJ0KCdkZXN0cm95SW5zdGFuY2UnLCBpbnN0YW5jZUlkKVxuICBpbnN0YW5jZS5kZXN0cm95KClcbiAgZGVsZXRlIGluc3RhbmNlTWFwW2luc3RhbmNlSWRdXG4gIHBlcmYuZW5kKCdkZXN0cm95SW5zdGFuY2UnLCBpbnN0YW5jZUlkKVxuXG4gIHJldHVybiBpbnN0YW5jZU1hcFxufVxuXG4vKipcbiAqIHJlZ2lzdGVyIHRoZSBuYW1lIG9mIGVhY2ggbmF0aXZlIGNvbXBvbmVudFxuICogQHBhcmFtICB7YXJyYXl9IGNvbXBvbmVudHMgYXJyYXkgb2YgbmFtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnRzKGNvbXBvbmVudHMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoY29tcG9uZW50cykpIHtcbiAgICBjb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gcmVnaXN0ZXIobmFtZSkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG5hdGl2ZUNvbXBvbmVudE1hcFtuYW1lXSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBuYW1lLnR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG5hdGl2ZUNvbXBvbmVudE1hcFtuYW1lLnR5cGVdID0gbmFtZVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiByZWdpc3RlciB0aGUgbmFtZSBhbmQgbWV0aG9kcyBvZiBlYWNoIG1vZHVsZVxuICogQHBhcmFtICB7b2JqZWN0fSBtb2R1bGVzIGEgb2JqZWN0IG9mIG1vZHVsZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyTW9kdWxlcyhtb2R1bGVzKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gJ29iamVjdCcpIHtcbiAgICBWbS5yZWdpc3Rlck1vZHVsZXMobW9kdWxlcylcbiAgfVxufVxuXG4vKipcbiAqIHJlZ2lzdGVyIHRoZSBuYW1lIGFuZCBtZXRob2RzIG9mIGVhY2ggYXBpXG4gKiBAcGFyYW0gIHtvYmplY3R9IGFwaXMgYSBvYmplY3Qgb2YgYXBpc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJNZXRob2RzKGFwaXMpIHtcbiAgaWYgKHR5cGVvZiBhcGlzID09PSAnb2JqZWN0Jykge1xuICAgIFZtLnJlZ2lzdGVyTWV0aG9kcyhhcGlzKVxuICB9XG59XG5cbi8qKlxuICogZ2V0IGEgd2hvbGUgZWxlbWVudCB0cmVlIG9mIGFuIGluc3RhbmNlXG4gKiBmb3IgZGVidWdnaW5nXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGluc3RhbmNlSWRcbiAqIEByZXR1cm4ge29iamVjdH0gYSB2aXJ0dWFsIGRvbSB0cmVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb290KGluc3RhbmNlSWQpIHtcbiAgdmFyIGluc3RhbmNlID0gaW5zdGFuY2VNYXBbaW5zdGFuY2VJZF1cbiAgdmFyIHJlc3VsdFxuICBpZiAoaW5zdGFuY2UpIHtcbiAgICByZXN1bHQgPSBpbnN0YW5jZS5nZXRSb290RWxlbWVudCgpXG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gbmV3IEVycm9yKGBpbnZhbGlkIGluc3RhbmNlIGlkIFwiJHtpbnN0YW5jZUlkfVwiYClcbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cbnZhciBqc0hhbmRsZXJzID0ge1xuICBmaXJlRXZlbnQ6IGZ1bmN0aW9uIGZpcmVFdmVudChpbnN0YW5jZUlkLCByZWYsIHR5cGUsIGRhdGEpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZU1hcFtpbnN0YW5jZUlkXVxuICAgIHZhciByZXN1bHRcbiAgICBwZXJmLnN0YXJ0KCdmaXJlRXZlbnQnLCBpbnN0YW5jZUlkICsgJy0nICsgcmVmICsgJy0nICsgdHlwZSlcbiAgICByZXN1bHQgPSBpbnN0YW5jZS5maXJlRXZlbnQocmVmLCB0eXBlLCBkYXRhKVxuICAgIHBlcmYuZW5kKCdmaXJlRXZlbnQnLCBpbnN0YW5jZUlkICsgJy0nICsgcmVmICsgJy0nICsgdHlwZSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH0sXG5cbiAgY2FsbGJhY2s6IGZ1bmN0aW9uIGNhbGxiYWNrKGluc3RhbmNlSWQsIGZ1bmNJZCwgZGF0YSwgaWZMYXN0KSB7XG4gICAgdmFyIGluc3RhbmNlID0gaW5zdGFuY2VNYXBbaW5zdGFuY2VJZF1cbiAgICB2YXIgcmVzdWx0XG4gICAgcGVyZi5zdGFydCgnY2FsbGJhY2snLFxuICAgICAgaW5zdGFuY2VJZCArICctJyArIGZ1bmNJZCArICctJyArIGRhdGEgKyAnLScgKyBpZkxhc3QpXG4gICAgcmVzdWx0ID0gaW5zdGFuY2UuY2FsbGJhY2soZnVuY0lkLCBkYXRhLCBpZkxhc3QpXG4gICAgcGVyZi5lbmQoJ2NhbGxiYWNrJyxcbiAgICAgIGluc3RhbmNlSWQgKyAnLScgKyBmdW5jSWQgKyAnLScgKyBkYXRhICsgJy0nICsgaWZMYXN0KVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG4vKipcbiAqIGFjY2VwdCBjYWxscyBmcm9tIG5hdGl2ZSAoZXZlbnQgb3IgY2FsbGJhY2spXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBpbnN0YW5jZUlkXG4gKiBAcGFyYW0gIHthcnJheX0gdGFza3MgbGlzdCB3aXRoIGBtZXRob2RgIGFuZCBgYXJnc2BcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGxKUyhpbnN0YW5jZUlkLCB0YXNrcykge1xuICBjb25zdCBpbnN0YW5jZSA9IGluc3RhbmNlTWFwW2luc3RhbmNlSWRdXG4gIGxldCByZXN1bHRzID0gW11cbiAgaWYgKGluc3RhbmNlICYmIEFycmF5LmlzQXJyYXkodGFza3MpKSB7XG4gICAgdGFza3MuZm9yRWFjaCgodGFzaykgPT4ge1xuICAgICAgY29uc3QgaGFuZGxlciA9IGpzSGFuZGxlcnNbdGFzay5tZXRob2RdXG4gICAgICBjb25zdCBhcmdzID0gWy4uLnRhc2suYXJnc11cbiAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsb2coJ2phdmFzY3JpcHQ6JywgdGFzay5tZXRob2QsIHRhc2suYXJncylcbiAgICAgICAgYXJncy51bnNoaWZ0KGluc3RhbmNlSWQpXG4gICAgICAgIHJlc3VsdHMucHVzaChoYW5kbGVyKC4uLmFyZ3MpKVxuICAgICAgfVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0cy5wdXNoKG5ldyBFcnJvcihgaW52YWxpZCBpbnN0YW5jZSBpZCBcIiR7aW5zdGFuY2VJZH1cIiBvciB0YXNrc2ApKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHNcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2ZyYW1ld29yay5qc1xuICoqLyIsImltcG9ydCBsb2cgZnJvbSAnLi9sb2cnXG5cbnZhciBkYXRhID0ge3R5cGU6ICdyb290JywgY2hpbGRyZW46IFtdfVxudmFyIGN1cnJlbnQgPSBkYXRhXG52YXIgc3RhY2sgPSBbY3VycmVudF1cblxuZnVuY3Rpb24gc3BhY2VzKG51bSkge1xuICByZXR1cm4gQXJyYXkobnVtKS5qb2luKCcgJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KHR5cGUsIGlkKSB7XG4gIHZhciB0YXNrID0ge3R5cGU6IHR5cGUsIGlkOiBpZCwgY2hpbGRyZW46IFtdLCBzdGFydDogRGF0ZS5ub3coKX1cbiAgY3VycmVudC5jaGlsZHJlbi5wdXNoKHRhc2spXG4gIHN0YWNrLnB1c2godGFzaylcbiAgY3VycmVudCA9IHRhc2tcbiAgbG9nKCdwZXJmOicgKyBzcGFjZXMoc3RhY2subGVuZ3RoIC0gMSksICdzdGFydCcsIHRhc2sudHlwZSwgdGFzay5pZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuZCh0eXBlLCBpZCkge1xuICB2YXIgdGFzayA9IHN0YWNrLnBvcCgpXG4gIHRhc2suZW5kID0gRGF0ZS5ub3coKVxuICBjdXJyZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV1cbiAgbG9nKCdwZXJmOicgKyBzcGFjZXMoc3RhY2subGVuZ3RoKSwgJ2VuZCcsXG4gICAgKHRhc2suZW5kIC0gdGFzay5zdGFydCkgKyAnbXMnLCB0YXNrLnR5cGUsIHRhc2suaWQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNldCgpIHtcbiAgZGF0YS5jaGlsZHJlbiA9IFtdXG4gIGN1cnJlbnQgPSBkYXRhXG4gIHN0YWNrLmxlbmd0aCA9IDBcbiAgc3RhY2sucHVzaChjdXJyZW50KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9KU09OKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL3BlcmYuanNcbiAqKi8iLCJpbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnLi9jb25maWcnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZyguLi5hcmdzKSB7XG4gIGlmIChjb25maWcuZGVidWcpIHtcbiAgICBnbG9iYWwuY29uc29sZS5sb2coLi4uYXJncylcbiAgfVxufVxuXG5nbG9iYWwubG9nID0gbG9nXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvbG9nLmpzXG4gKiovIiwiZXhwb3J0IGNvbnN0IG5hdGl2ZUNvbXBvbmVudE1hcCA9IHtcbiAgdGV4dDogdHJ1ZSxcbiAgaW1hZ2U6IHRydWUsXG4gIGNvbnRhaW5lcjogdHJ1ZSxcbiAgc2xpZGVyOiB7XG4gICAgdHlwZTogJ3NsaWRlcicsXG4gICAgYXBwZW5kOiAndHJlZSdcbiAgfSxcbiAgY2VsbDoge1xuICAgIHR5cGU6ICdjZWxsJyxcbiAgICBhcHBlbmQ6ICd0cmVlJ1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBjdXN0b21Db21wb25lbnRNYXAgPSB7fVxuXG5leHBvcnQgdmFyIGRlYnVnID0gZmFsc2VcblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvY29uZmlnLmpzXG4gKiovIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBXZWV4IGluc3RhbmNlIGNvbnN0cnVjdG9yICYgZGVmaW5pdGlvblxuICovXG5cbmltcG9ydCB7dHlwb2YsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCdcbmltcG9ydCAqIGFzIHBlcmYgZnJvbSAnLi4vcGVyZidcbmltcG9ydCAqIGFzIGJ1bmRsZSBmcm9tICcuL2J1bmRsZSdcbmltcG9ydCAqIGFzIGN0cmwgZnJvbSAnLi9jdHJsJ1xuaW1wb3J0IERpZmZlciBmcm9tICcuL2RpZmZlcidcblxuaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50J1xuaW1wb3J0IExpc3RlbmVyIGZyb20gJy4vZG9tLWxpc3RlbmVyJ1xuaW1wb3J0IHtEb2N1bWVudCwgTm9kZX0gZnJvbSAnLi9kb20nXG5pbXBvcnQge3JlZ2lzdGVyQ29tcG9uZW50LCByZXF1aXJlQ29tcG9uZW50LCByZXF1aXJlTW9kdWxlfSBmcm9tICcuL3JlZ2lzdGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBJbnN0YW5jZShpbnN0YW5jZUlkLCBvcHRpb25zKSB7XG4gIHBlcmYuc3RhcnQoJ2luaXRJbnN0YW5jZScsIGluc3RhbmNlSWQpXG4gIHRoaXMuaWQgPSBpbnN0YW5jZUlkXG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdGhpcy52bSA9IG51bGxcbiAgdGhpcy5kb2MgPSBuZXcgRG9jdW1lbnQoaW5zdGFuY2VJZClcbiAgdGhpcy5jdXN0b21Db21wb25lbnRNYXAgPSB7fVxuICB0aGlzLmNhbGxiYWNrcyA9IHt9XG4gIHRoaXMuZGlmZmVyID0gbmV3IERpZmZlcihpbnN0YW5jZUlkKVxuICB0aGlzLnVpZCA9IDBcbiAgdGhpcy5yZW5kZXJlZCA9IGZhbHNlXG4gIHRoaXMuZXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcigpXG4gIHRoaXMubGlzdGVuZXIgPSBuZXcgTGlzdGVuZXIodGhpcy5pZCwgKHRhc2tzKSA9PiB7XG4gICAgdGhpcy5jYWxsVGFza3ModGFza3MpXG4gIH0pXG4gIHRoaXMuZG9jLnNldEV2ZW50TWFuYWdlcih0aGlzLmV2ZW50TWFuYWdlcilcbiAgdGhpcy5kb2Muc2V0TGlzdGVuZXIodGhpcy5saXN0ZW5lcilcblxuICBwZXJmLmVuZCgnaW5pdEluc3RhbmNlJywgaW5zdGFuY2VJZClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplKGFwcCwgdikge1xuICB2YXIgdHlwZSA9IHR5cG9mKHYpXG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICBjYXNlICdudWxsJzpcbiAgICAgIHJldHVybiAnJ1xuICAgIGNhc2UgJ3JlZ2V4cCc6XG4gICAgICByZXR1cm4gdi50b1N0cmluZygpXG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gdi50b0lTT1N0cmluZygpXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGNhc2UgJ2FycmF5JzpcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgaWYgKHYgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgIHJldHVybiB2LnJlZlxuICAgICAgfVxuICAgICAgcmV0dXJuIHZcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICBhcHAuY2FsbGJhY2tzWysrYXBwLnVpZF0gPSB2XG4gICAgICByZXR1cm4gYXBwLnVpZC50b1N0cmluZygpXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2KVxuICB9XG59XG5cbkFwcEluc3RhbmNlLnByb3RvdHlwZS5jYWxsVGFza3MgPSBmdW5jdGlvbiAodGFza3MpIHtcbiAgaWYgKHR5cG9mKHRhc2tzKSAhPT0gJ2FycmF5Jykge1xuICAgIHRhc2tzID0gW3Rhc2tzXVxuICB9XG5cbiAgdGFza3MuZm9yRWFjaCgodGFzaykgPT4ge1xuICAgIHRhc2suYXJncyA9IHRhc2suYXJncy5tYXAoYXJnID0+IG5vcm1hbGl6ZSh0aGlzLCBhcmcpKVxuICB9KVxuXG4gIGNhbGxOYXRpdmUodGhpcy5pZCwgdGFza3MsICctMScpXG59XG5cbmV4dGVuZChBcHBJbnN0YW5jZS5wcm90b3R5cGUsIGJ1bmRsZSwgY3RybCwge1xuICByZWdpc3RlckNvbXBvbmVudCxcbiAgcmVxdWlyZUNvbXBvbmVudCxcbiAgcmVxdWlyZU1vZHVsZVxufSlcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2FwcC9pbmRleC5qc1xuICoqLyIsIi8vLyBsYW5nLmpzXG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZydcblxuLyoqXG4gKiBDaGVjayBpcyBhIHN0cmluZyBzdGFydHMgd2l0aCAkIG9yIF9cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydCB2YXIgaXNSZXNlcnZlZCA9IChzdHIpID0+IHtcbiAgbGV0IGMgPSAoc3RyICsgJycpLmNoYXJDb2RlQXQoMClcbiAgcmV0dXJuIGMgPT09IDB4MjQgfHwgYyA9PT0gMHg1RlxufVxuXG4vKipcbiAqIENhbWVsaXplIGEgaHlwaGVuLWRlbG1pdGVkIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxubGV0IGNhbWVsUkUgPSAvLShcXHcpL2dcbmZ1bmN0aW9uIHRvVXBwZXIgKF8sIGMpIHtcbiAgcmV0dXJuIGMgPyBjLnRvVXBwZXJDYXNlICgpIDogJydcbn1cbmV4cG9ydCB2YXIgY2FtZWxpemUgPSAoc3RyKSA9PiB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbFJFLCB0b1VwcGVyKVxufVxuXG4vKipcbiAqIFNpbXBsZSBiaW5kLCBmYXN0ZXIgdGhhbiBuYXRpdmVcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0IHZhciBiaW5kID0gZnVuY3Rpb24gKGZuLCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgbGV0IGwgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgcmV0dXJuIGxcbiAgICAgID8gbCA+IDFcbiAgICAgICAgPyBmbi5hcHBseShjdHgsIGFyZ3VtZW50cylcbiAgICAgICAgOiBmbi5jYWxsKGN0eCwgYSlcbiAgICAgIDogZm4uY2FsbChjdHgpXG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIEFycmF5LWxpa2Ugb2JqZWN0IHRvIGEgcmVhbCBBcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LWxpa2V9IGxpc3RcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3RhcnRdIC0gc3RhcnQgaW5kZXhcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmV4cG9ydCB2YXIgdG9BcnJheSA9IChsaXN0LCBzdGFydCkgPT4ge1xuICBzdGFydCA9IHN0YXJ0IHx8IDBcbiAgbGV0IGkgPSBsaXN0Lmxlbmd0aCAtIHN0YXJ0XG4gIGxldCByZXQgPSBuZXcgQXJyYXkoaSlcbiAgd2hpbGUgKGktLSkge1xuICAgIHJldFtpXSA9IGxpc3RbaSArIHN0YXJ0XVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBNaXggcHJvcGVydGllcyBpbnRvIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRvXG4gKiBAcGFyYW0ge09iamVjdH0gZnJvbVxuICovXG5cbmV4cG9ydCB2YXIgZXh0ZW5kID0gKHRhcmdldCwgLi4uc3JjKSA9PiB7XG4gIGlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIE9iamVjdC5hc3NpZ24odGFyZ2V0LCAuLi5zcmMpXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZmlyc3QgPSBzcmMuc2hpZnQoKVxuICAgIGZvciAoY29uc3Qga2V5IGluIGZpcnN0KSB7XG4gICAgICB0YXJnZXRba2V5XSA9IGZpcnN0W2tleV1cbiAgICB9XG4gICAgaWYgKHNyYy5sZW5ndGgpIHtcbiAgICAgIGV4dGVuZCh0YXJnZXQsIC4uLnNyYylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldFxufVxuXG4vKipcbiAqIFF1aWNrIG9iamVjdCBjaGVjayAtIHRoaXMgaXMgcHJpbWFyaWx5IHVzZWQgdG8gdGVsbFxuICogT2JqZWN0cyBmcm9tIHByaW1pdGl2ZSB2YWx1ZXMgd2hlbiB3ZSBrbm93IHRoZSB2YWx1ZVxuICogaXMgYSBKU09OLWNvbXBsaWFudCB0eXBlLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydCB2YXIgaXNPYmplY3QgPSAob2JqKSA9PiB7XG4gIHJldHVybiAhIShvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpXG59XG5cbi8qKlxuICogU3RyaWN0IG9iamVjdCB0eXBlIGNoZWNrLiBPbmx5IHJldHVybnMgdHJ1ZVxuICogZm9yIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5sZXQgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5leHBvcnQgdmFyIGlzUGxhaW5PYmplY3QgPSAob2JqKSA9PiB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nXG59XG5cbi8qKlxuICogQXJyYXkgdHlwZSBjaGVjay5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnQgdmFyIGlzQXJyYXkgPSAob2JqKSA9PiB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KG9iailcbn1cblxuZXhwb3J0IHZhciBzdHJpbmdpZnkgPSAoeCkgPT4ge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICd1bmRlZmluZWQnIHx8IHggPT09IG51bGwgfHwgdHlwZW9mKHgpID09PSAnZnVuY3Rpb24nXG4gICAgPyAnJ1xuICAgIDogdHlwZW9mIHggPT09ICdvYmplY3QnXG4gICAgICA/IHggaW5zdGFuY2VvZiBSZWdFeHBcbiAgICAgICAgPyB4LnRvU3RyaW5nKClcbiAgICAgICAgOiB4IGluc3RhbmNlb2YgRGF0ZVxuICAgICAgICAgID8gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh4KSlcbiAgICAgICAgICA6IEpTT04uc3RyaW5naWZ5KHgpXG4gICAgICA6IHgudG9TdHJpbmcoKVxufVxuXG5leHBvcnQgdmFyIHR5cG9mID0gKHYpID0+IHtcbiAgbGV0IHMgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodilcbiAgcmV0dXJuIHMuc3Vic3RyaW5nKDgsIHMubGVuZ3RoIC0gMSkudG9Mb3dlckNhc2UoKVxufVxuXG5leHBvcnQgdmFyIG5vcm1hbGl6ZSA9ICh2KSA9PiB7XG4gIGxldCB0eXBlID0gdHlwb2YodilcblxuICBzd2l0Y2godHlwZSkge1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gJydcbiAgICBjYXNlICdyZWdleHAnOlxuICAgICAgcmV0dXJuIHYudG9TdHJpbmcoKVxuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHYudG9JU09TdHJpbmcoKVxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICBjYXNlICdhcnJheSc6XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gdlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodilcbiAgfVxufVxuXG4vKipcbiAqIERlZmluZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2VudW1lcmFibGVdXG4gKi9cblxuZXhwb3J0IHZhciBkZWZpbmUgPSAob2JqLCBrZXksIHZhbCwgZW51bWVyYWJsZSkgPT4ge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICB2YWx1ZTogdmFsLFxuICAgIGVudW1lcmFibGU6ICEhZW51bWVyYWJsZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn1cblxuLyoqXG4gKiBNYW51YWwgaW5kZXhPZiBiZWNhdXNlIGl0J3Mgc2xpZ2h0bHkgZmFzdGVyIHRoYW5cbiAqIG5hdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKi9cblxuZXhwb3J0IHZhciBpbmRleE9mID0gKGFyciwgb2JqKSA9PiB7XG4gIGZvciAobGV0IGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChhcnJbaV0gPT09IG9iaikgcmV0dXJuIGlcbiAgfVxuICByZXR1cm4gLTFcbn1cblxuXG4vLy8gZGVidWcuanNcblxuXG5jb25zdCBoYXNDb25zb2xlID0gdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnXG5cbi8qKlxuICogTG9nIGEgbWVzc2FnZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbXNnXG4gKi9cblxuZXhwb3J0IHZhciBsb2cgPSAobXNnKSA9PiB7XG4gIGNvbnN0IF9jb25maWcgPSBDb25maWcgfHwge31cbiAgaWYgKGhhc0NvbnNvbGUgJiYgX2NvbmZpZy5kZWJ1Zykge1xuICAgIGNvbnNvbGUubG9nLmNhbGwodGhpcywgJ1tpbmZvXTogJywgbXNnKVxuICB9XG59XG5cbi8qKlxuICogV2UndmUgZ290IGEgcHJvYmxlbSBoZXJlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtc2dcbiAqL1xuXG5leHBvcnQgdmFyIHdhcm4gPSAobXNnKSA9PiB7XG4gIC8vIGlmIChoYXNDb25zb2xlICYmICghY29uZmlnLnNpbGVudCB8fCBjb25maWcuZGVidWcpKSB7XG4gIGlmIChoYXNDb25zb2xlKSB7XG4gICAgY29uc29sZS53YXJuLmNhbGwodGhpcywgJ1t3YXJuXTogJywgbXNnKVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIC8vIGlmIChjb25maWcuZGVidWcpIHtcbiAgICAvLyAgIC8qIGpzaGludCBkZWJ1ZzogdHJ1ZSAqL1xuICAgIC8vICAgZGVidWdnZXJcbiAgICAvLyB9XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL3V0aWwvaW5kZXguanNcbiAqKi8iLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIGFwaSB0aGF0IGludm9rZWQgYnkganMgYnVuZGxlIGNvZGVcbiAqXG4gKiAtIGRlZmluZShuYW1lLCBmYWN0b3J5KTogZGVmaW5lIGEgbmV3IGNvbXBvc2VkIGNvbXBvbmVudCB0eXBlXG4gKiAtIGJvb3RzdHJhcCh0eXBlLCBjb25maWcsIGRhdGEpOiByZXF1aXJlIGEgY2VydGFpbiB0eXBlICZcbiAqICAgICAgICAgcmVuZGVyIHdpdGggKG9wdGlvbmFsKSBkYXRhXG4gKlxuICogZGVwcmVjYXRlZDpcbiAqIC0gcmVnaXN0ZXIodHlwZSwgb3B0aW9ucyk6IHJlZ2lzdGVyIGEgbmV3IGNvbXBvc2VkIGNvbXBvbmVudCB0eXBlXG4gKiAtIHJlbmRlcih0eXBlLCBkYXRhKTogcmVuZGVyIGJ5IGEgY2VydGFpbiB0eXBlIHdpdGggKG9wdGlvbmFsKSBkYXRhXG4gKiAtIHJlcXVpcmUodHlwZSkoZGF0YSk6IHJlcXVpcmUgYSB0eXBlIHRoZW4gcmVuZGVyIHdpdGggZGF0YVxuICovXG5cbmltcG9ydCBzZW12ZXIgZnJvbSAnc2VtdmVyJ1xuaW1wb3J0ICogYXMgXyBmcm9tICcuLi91dGlsJ1xuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJy4uL2NvbmZpZydcbmltcG9ydCAqIGFzIHBlcmYgZnJvbSAnLi4vcGVyZidcbmltcG9ydCBWbSBmcm9tICcuLi92bSdcbmltcG9ydCAqIGFzIGRvd25ncmFkZSBmcm9tICcuL2Rvd25ncmFkZSdcblxuY29uc3QgV0VFWF9DT01QT05FTlRfUkVHID0gL15cXEB3ZWV4LWNvbXBvbmVudFxcLy9cbmNvbnN0IFdFRVhfTU9EVUxFX1JFRyA9IC9eXFxAd2VleC1tb2R1bGVcXC8vXG5jb25zdCBOT1JNQUxfTU9EVUxFX1JFRyA9IC9eXFwuezEsMn1cXC8vXG5jb25zdCBKU19TVVJGSVhfUkVHID0gL1xcLmpzJC9cblxuY29uc3QgaXNXZWV4Q29tcG9uZW50ID0gbmFtZSA9PiAhIW5hbWUubWF0Y2goV0VFWF9DT01QT05FTlRfUkVHKVxuY29uc3QgaXNXZWV4TW9kdWxlID0gbmFtZSA9PiAhIW5hbWUubWF0Y2goV0VFWF9NT0RVTEVfUkVHKVxuY29uc3QgaXNOb3JtYWxNb2R1bGUgPSBuYW1lID0+ICEhbmFtZS5tYXRjaChOT1JNQUxfTU9EVUxFX1JFRylcbmNvbnN0IGlzTnBtTW9kdWxlID0gbmFtZSA9PiAhaXNXZWV4Q29tcG9uZW50KG5hbWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaXNXZWV4TW9kdWxlKG5hbWUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhaXNOb3JtYWxNb2R1bGUobmFtZSlcblxuZnVuY3Rpb24gcmVtb3ZlV2VleFByZWZpeChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKFdFRVhfQ09NUE9ORU5UX1JFRywgJycpXG4gICAgICAgICAgLnJlcGxhY2UoV0VFWF9NT0RVTEVfUkVHLCAnJylcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSlNTdXJmaXgoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShKU19TVVJGSVhfUkVHLCAnJylcbn1cblxubGV0IGNvbW1vbk1vZHVsZXMgPSB7fVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDb21tb25Nb2R1bGVzKCkge1xuICBjb21tb25Nb2R1bGVzID0ge31cbn1cblxuLy8gZGVmaW5lKG5hbWUsIGZhY3RvcnkpIGZvciBwcmltYXJ5IHVzYWdlXG4vLyBvclxuLy8gZGVmaW5lKG5hbWUsIGRlcHMsIGZhY3RvcnkpIGZvciBjb21wYXRpYmlsaXR5XG4vLyBOb3RpY2U6IERPIE5PVCB1c2UgZnVuY3Rpb24gZGVmaW5lKCkge30sXG4vLyBpdCB3aWxsIGNhdXNlIGVycm9yIGFmdGVyIGJ1aWxkZWQgYnkgd2VicGFja1xuZXhwb3J0IHZhciBkZWZpbmUgPSBmdW5jdGlvbiAobmFtZSwgZGVwcywgZmFjdG9yeSkge1xuICBwZXJmLnN0YXJ0KCdkZWZpbmUnLCBuYW1lKVxuXG4gIGlmIChfLnR5cG9mKGRlcHMpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZmFjdG9yeSA9IGRlcHNcbiAgICBkZXBzID0gW11cbiAgfVxuXG4gIGxldCBfcmVxdWlyZSA9IChuYW1lKSA9PiB7XG4gICAgbGV0IGNsZWFuTmFtZVxuXG4gICAgaWYgKGlzV2VleENvbXBvbmVudChuYW1lKSkge1xuICAgICAgY2xlYW5OYW1lID0gcmVtb3ZlV2VleFByZWZpeChuYW1lKVxuICAgICAgcmV0dXJuIHRoaXMucmVxdWlyZUNvbXBvbmVudChjbGVhbk5hbWUpXG4gICAgfVxuICAgIGlmIChpc1dlZXhNb2R1bGUobmFtZSkpIHtcbiAgICAgIGNsZWFuTmFtZSA9IHJlbW92ZVdlZXhQcmVmaXgobmFtZSlcbiAgICAgIHJldHVybiB0aGlzLnJlcXVpcmVNb2R1bGUoY2xlYW5OYW1lKVxuICAgIH1cbiAgICBpZiAoaXNOb3JtYWxNb2R1bGUobmFtZSkpIHtcbiAgICAgIGNsZWFuTmFtZSA9IHJlbW92ZUpTU3VyZml4KG5hbWUpXG4gICAgICByZXR1cm4gY29tbW9uTW9kdWxlc1tuYW1lXVxuICAgIH1cbiAgICBpZiAoaXNOcG1Nb2R1bGUobmFtZSkpIHtcbiAgICAgIGNsZWFuTmFtZSA9IHJlbW92ZUpTU3VyZml4KG5hbWUpXG4gICAgICByZXR1cm4gY29tbW9uTW9kdWxlc1tuYW1lXVxuICAgIH1cbiAgfVxuICBsZXQgX21vZHVsZSA9IHtleHBvcnRzOiB7fX1cblxuICBsZXQgY2xlYW5OYW1lXG4gIGlmIChpc1dlZXhDb21wb25lbnQobmFtZSkpIHtcbiAgICBjbGVhbk5hbWUgPSByZW1vdmVXZWV4UHJlZml4KG5hbWUpXG5cbiAgICBmYWN0b3J5KF9yZXF1aXJlLCBfbW9kdWxlLmV4cG9ydHMsIF9tb2R1bGUpXG5cbiAgICB0aGlzLnJlZ2lzdGVyQ29tcG9uZW50KGNsZWFuTmFtZSwgX21vZHVsZS5leHBvcnRzKVxuICB9IGVsc2UgaWYgKGlzV2VleE1vZHVsZShuYW1lKSkge1xuICAgIGNsZWFuTmFtZSA9IHJlbW92ZVdlZXhQcmVmaXgobmFtZSlcblxuICAgIGZhY3RvcnkoX3JlcXVpcmUsIF9tb2R1bGUuZXhwb3J0cywgX21vZHVsZSlcblxuICAgIFZtLnJlZ2lzdGVyTW9kdWxlcyh7XG4gICAgICBbY2xlYW5OYW1lXTogX21vZHVsZS5leHBvcnRzXG4gICAgfSlcbiAgfSBlbHNlIGlmIChpc05vcm1hbE1vZHVsZShuYW1lKSkge1xuICAgIGNsZWFuTmFtZSA9IHJlbW92ZUpTU3VyZml4KG5hbWUpXG5cbiAgICBmYWN0b3J5KF9yZXF1aXJlLCBfbW9kdWxlLmV4cG9ydHMsIF9tb2R1bGUpXG5cbiAgICBjb21tb25Nb2R1bGVzW2NsZWFuTmFtZV0gPSBfbW9kdWxlLmV4cG9ydHNcbiAgfSBlbHNlIGlmIChpc05wbU1vZHVsZShuYW1lKSkge1xuICAgIGNsZWFuTmFtZSA9IHJlbW92ZUpTU3VyZml4KG5hbWUpXG5cbiAgICBmYWN0b3J5KF9yZXF1aXJlLCBfbW9kdWxlLmV4cG9ydHMsIF9tb2R1bGUpXG5cbiAgICBsZXQgZXhwb3J0cyA9IF9tb2R1bGUuZXhwb3J0c1xuICAgIGlmIChleHBvcnRzLnRlbXBsYXRlIHx8XG4gICAgICAgIGV4cG9ydHMuc3R5bGUgfHxcbiAgICAgICAgZXhwb3J0cy5tZXRob2RzKSB7XG4gICAgICAvLyBkb3duZ3JhZGUgdG8gb2xkIGRlZmluZSBtZXRob2QgKGRlZmluZSgnY29tcG9uZW50TmFtZScsIGZhY3RvcnkpKVxuICAgICAgLy8gdGhlIGV4cG9ydHMgY29udGFpbiBvbmUga2V5IG9mIHRlbXBsYXRlLCBzdHlsZSBvciBtZXRob2RzXG4gICAgICAvLyBidXQgaXQgaGFzIHJpc2shISFcbiAgICAgIHRoaXMucmVnaXN0ZXJDb21wb25lbnQoY2xlYW5OYW1lLCBleHBvcnRzKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21tb25Nb2R1bGVzW2NsZWFuTmFtZV0gPSBfbW9kdWxlLmV4cG9ydHNcbiAgICB9XG4gIH1cblxuICBwZXJmLmVuZCgnZGVmaW5lJywgbmFtZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJvb3RzdHJhcChuYW1lLCBjb25maWcsIGRhdGEpIHtcbiAgbGV0IGNsZWFuTmFtZVxuXG4gIGlmIChpc1dlZXhDb21wb25lbnQobmFtZSkpIHtcbiAgICBjbGVhbk5hbWUgPSByZW1vdmVXZWV4UHJlZml4KG5hbWUpXG4gIH0gZWxzZSBpZiAoaXNOcG1Nb2R1bGUobmFtZSkpIHtcbiAgICBjbGVhbk5hbWUgPSByZW1vdmVKU1N1cmZpeChuYW1lKVxuICAgIC8vIGNoZWNrIGlmIGRlZmluZSBieSBvbGQgJ2RlZmluZScgbWV0aG9kXG4gICAgaWYgKCF0aGlzLmN1c3RvbUNvbXBvbmVudE1hcFtjbGVhbk5hbWVdKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKGBJdCdzIG5vdCBhIGNvbXBvbmVudDogJHtuYW1lfWApXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgRXJyb3IoYFdyb25nIGNvbXBvbmVudCBuYW1lOiAke25hbWV9YClcbiAgfVxuXG4gIGNvbmZpZyA9IF8uaXNQbGFpbk9iamVjdChjb25maWcpID8gY29uZmlnIDoge31cblxuICBpZiAodHlwZW9mIGNvbmZpZy50cmFuc2Zvcm1lclZlcnNpb24gPT09ICdzdHJpbmcnICYmXG4gICAgdHlwZW9mIGdsb2JhbC5uZWVkVHJhbnNmb3JtZXJWZXJzaW9uID09PSAnc3RyaW5nJyAmJlxuICAgICFzZW12ZXIuc2F0aXNmaWVzKGNvbmZpZy50cmFuc2Zvcm1lclZlcnNpb24sXG4gICAgICBnbG9iYWwubmVlZFRyYW5zZm9ybWVyVmVyc2lvbikpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKGBKUyBCdW5kbGUgdmVyc2lvbjogJHtjb25maWcudHJhbnNmb3JtZXJWZXJzaW9ufSBgICtcbiAgICAgIGBub3QgY29tcGF0aWJsZSB3aXRoICR7Z2xvYmFsLm5lZWRUcmFuc2Zvcm1lclZlcnNpb259YClcbiAgfVxuXG4gIGxldCBfY2hlY2tEb3duZ3JhZGUgPSBkb3duZ3JhZGUuY2hlY2soY29uZmlnLmRvd25ncmFkZSlcbiAgaWYgKF9jaGVja0Rvd25ncmFkZS5pc0Rvd25ncmFkZSkge1xuICAgIHRoaXMuY2FsbFRhc2tzKFt7XG4gICAgICBtb2R1bGU6ICdpbnN0YW5jZVdyYXAnLFxuICAgICAgbWV0aG9kOiAnZXJyb3InLFxuICAgICAgYXJnczogW1xuICAgICAgICBfY2hlY2tEb3duZ3JhZGUuZXJyb3JUeXBlLFxuICAgICAgICBfY2hlY2tEb3duZ3JhZGUuY29kZSxcbiAgICAgICAgX2NoZWNrRG93bmdyYWRlLmVycm9yTWVzc2FnZVxuICAgICAgXVxuICAgIH1dKVxuICAgIHJldHVybiBuZXcgRXJyb3IoYERvd25ncmFkZTogJHtjb25maWcuZG93bmdyYWRlfWApXG4gIH1cblxuICBwZXJmLnN0YXJ0KCdjcmVhdGUgdm0nLCBjbGVhbk5hbWUpXG5cbiAgdGhpcy52bSA9IG5ldyBWbShjbGVhbk5hbWUsIHtfYXBwOiB0aGlzfSwgbnVsbCwgZGF0YSwge1xuICAgICdob29rOnJlYWR5JzogKCkgPT4ge1xuICAgICAgcGVyZi5lbmQoJ2NyZWF0ZSB2bScsIGNsZWFuTmFtZSlcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKHR5cGUsIG9wdGlvbnMpIHtcbiAgcGVyZi5zdGFydCgncmVnaXN0ZXInLCB0eXBlKVxuICB0aGlzLnJlZ2lzdGVyQ29tcG9uZW50KHR5cGUsIG9wdGlvbnMpXG4gIHBlcmYuZW5kKCdyZWdpc3RlcicsIHR5cGUpXG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcih0eXBlLCBkYXRhKSB7XG4gIHJldHVybiB0aGlzLmJvb3RzdHJhcCh0eXBlLCB7fSwgZGF0YSlcbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZSh0eXBlKSB7XG4gIHJldHVybiAoZGF0YSkgPT4ge1xuICAgIHJldHVybiB0aGlzLmJvb3RzdHJhcCh0eXBlLCB7fSwgZGF0YSlcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvYXBwL2J1bmRsZS5qc1xuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFNlbVZlcjtcblxuLy8gVGhlIGRlYnVnIGZ1bmN0aW9uIGlzIGV4Y2x1ZGVkIGVudGlyZWx5IGZyb20gdGhlIG1pbmlmaWVkIHZlcnNpb24uXG4vKiBub21pbiAqLyB2YXIgZGVidWc7XG4vKiBub21pbiAqLyBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmXG4gICAgLyogbm9taW4gKi8gcHJvY2Vzcy5lbnYgJiZcbiAgICAvKiBub21pbiAqLyBwcm9jZXNzLmVudi5OT0RFX0RFQlVHICYmXG4gICAgLyogbm9taW4gKi8gL1xcYnNlbXZlclxcYi9pLnRlc3QocHJvY2Vzcy5lbnYuTk9ERV9ERUJVRykpXG4gIC8qIG5vbWluICovIGRlYnVnID0gZnVuY3Rpb24oKSB7XG4gICAgLyogbm9taW4gKi8gdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgIC8qIG5vbWluICovIGFyZ3MudW5zaGlmdCgnU0VNVkVSJyk7XG4gICAgLyogbm9taW4gKi8gY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XG4gICAgLyogbm9taW4gKi8gfTtcbi8qIG5vbWluICovIGVsc2VcbiAgLyogbm9taW4gKi8gZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuXG4vLyBOb3RlOiB0aGlzIGlzIHRoZSBzZW12ZXIub3JnIHZlcnNpb24gb2YgdGhlIHNwZWMgdGhhdCBpdCBpbXBsZW1lbnRzXG4vLyBOb3QgbmVjZXNzYXJpbHkgdGhlIHBhY2thZ2UgdmVyc2lvbiBvZiB0aGlzIGNvZGUuXG5leHBvcnRzLlNFTVZFUl9TUEVDX1ZFUlNJT04gPSAnMi4wLjAnO1xuXG52YXIgTUFYX0xFTkdUSCA9IDI1NjtcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgfHwgOTAwNzE5OTI1NDc0MDk5MTtcblxuLy8gVGhlIGFjdHVhbCByZWdleHBzIGdvIG9uIGV4cG9ydHMucmVcbnZhciByZSA9IGV4cG9ydHMucmUgPSBbXTtcbnZhciBzcmMgPSBleHBvcnRzLnNyYyA9IFtdO1xudmFyIFIgPSAwO1xuXG4vLyBUaGUgZm9sbG93aW5nIFJlZ3VsYXIgRXhwcmVzc2lvbnMgY2FuIGJlIHVzZWQgZm9yIHRva2VuaXppbmcsXG4vLyB2YWxpZGF0aW5nLCBhbmQgcGFyc2luZyBTZW1WZXIgdmVyc2lvbiBzdHJpbmdzLlxuXG4vLyAjIyBOdW1lcmljIElkZW50aWZpZXJcbi8vIEEgc2luZ2xlIGAwYCwgb3IgYSBub24temVybyBkaWdpdCBmb2xsb3dlZCBieSB6ZXJvIG9yIG1vcmUgZGlnaXRzLlxuXG52YXIgTlVNRVJJQ0lERU5USUZJRVIgPSBSKys7XG5zcmNbTlVNRVJJQ0lERU5USUZJRVJdID0gJzB8WzEtOV1cXFxcZConO1xudmFyIE5VTUVSSUNJREVOVElGSUVSTE9PU0UgPSBSKys7XG5zcmNbTlVNRVJJQ0lERU5USUZJRVJMT09TRV0gPSAnWzAtOV0rJztcblxuXG4vLyAjIyBOb24tbnVtZXJpYyBJZGVudGlmaWVyXG4vLyBaZXJvIG9yIG1vcmUgZGlnaXRzLCBmb2xsb3dlZCBieSBhIGxldHRlciBvciBoeXBoZW4sIGFuZCB0aGVuIHplcm8gb3Jcbi8vIG1vcmUgbGV0dGVycywgZGlnaXRzLCBvciBoeXBoZW5zLlxuXG52YXIgTk9OTlVNRVJJQ0lERU5USUZJRVIgPSBSKys7XG5zcmNbTk9OTlVNRVJJQ0lERU5USUZJRVJdID0gJ1xcXFxkKlthLXpBLVotXVthLXpBLVowLTktXSonO1xuXG5cbi8vICMjIE1haW4gVmVyc2lvblxuLy8gVGhyZWUgZG90LXNlcGFyYXRlZCBudW1lcmljIGlkZW50aWZpZXJzLlxuXG52YXIgTUFJTlZFUlNJT04gPSBSKys7XG5zcmNbTUFJTlZFUlNJT05dID0gJygnICsgc3JjW05VTUVSSUNJREVOVElGSUVSXSArICcpXFxcXC4nICtcbiAgICAgICAgICAgICAgICAgICAnKCcgKyBzcmNbTlVNRVJJQ0lERU5USUZJRVJdICsgJylcXFxcLicgK1xuICAgICAgICAgICAgICAgICAgICcoJyArIHNyY1tOVU1FUklDSURFTlRJRklFUl0gKyAnKSc7XG5cbnZhciBNQUlOVkVSU0lPTkxPT1NFID0gUisrO1xuc3JjW01BSU5WRVJTSU9OTE9PU0VdID0gJygnICsgc3JjW05VTUVSSUNJREVOVElGSUVSTE9PU0VdICsgJylcXFxcLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJygnICsgc3JjW05VTUVSSUNJREVOVElGSUVSTE9PU0VdICsgJylcXFxcLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJygnICsgc3JjW05VTUVSSUNJREVOVElGSUVSTE9PU0VdICsgJyknO1xuXG4vLyAjIyBQcmUtcmVsZWFzZSBWZXJzaW9uIElkZW50aWZpZXJcbi8vIEEgbnVtZXJpYyBpZGVudGlmaWVyLCBvciBhIG5vbi1udW1lcmljIGlkZW50aWZpZXIuXG5cbnZhciBQUkVSRUxFQVNFSURFTlRJRklFUiA9IFIrKztcbnNyY1tQUkVSRUxFQVNFSURFTlRJRklFUl0gPSAnKD86JyArIHNyY1tOVU1FUklDSURFTlRJRklFUl0gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd8JyArIHNyY1tOT05OVU1FUklDSURFTlRJRklFUl0gKyAnKSc7XG5cbnZhciBQUkVSRUxFQVNFSURFTlRJRklFUkxPT1NFID0gUisrO1xuc3JjW1BSRVJFTEVBU0VJREVOVElGSUVSTE9PU0VdID0gJyg/OicgKyBzcmNbTlVNRVJJQ0lERU5USUZJRVJMT09TRV0gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3wnICsgc3JjW05PTk5VTUVSSUNJREVOVElGSUVSXSArICcpJztcblxuXG4vLyAjIyBQcmUtcmVsZWFzZSBWZXJzaW9uXG4vLyBIeXBoZW4sIGZvbGxvd2VkIGJ5IG9uZSBvciBtb3JlIGRvdC1zZXBhcmF0ZWQgcHJlLXJlbGVhc2UgdmVyc2lvblxuLy8gaWRlbnRpZmllcnMuXG5cbnZhciBQUkVSRUxFQVNFID0gUisrO1xuc3JjW1BSRVJFTEVBU0VdID0gJyg/Oi0oJyArIHNyY1tQUkVSRUxFQVNFSURFTlRJRklFUl0gK1xuICAgICAgICAgICAgICAgICAgJyg/OlxcXFwuJyArIHNyY1tQUkVSRUxFQVNFSURFTlRJRklFUl0gKyAnKSopKSc7XG5cbnZhciBQUkVSRUxFQVNFTE9PU0UgPSBSKys7XG5zcmNbUFJFUkVMRUFTRUxPT1NFXSA9ICcoPzotPygnICsgc3JjW1BSRVJFTEVBU0VJREVOVElGSUVSTE9PU0VdICtcbiAgICAgICAgICAgICAgICAgICAgICAgJyg/OlxcXFwuJyArIHNyY1tQUkVSRUxFQVNFSURFTlRJRklFUkxPT1NFXSArICcpKikpJztcblxuLy8gIyMgQnVpbGQgTWV0YWRhdGEgSWRlbnRpZmllclxuLy8gQW55IGNvbWJpbmF0aW9uIG9mIGRpZ2l0cywgbGV0dGVycywgb3IgaHlwaGVucy5cblxudmFyIEJVSUxESURFTlRJRklFUiA9IFIrKztcbnNyY1tCVUlMRElERU5USUZJRVJdID0gJ1swLTlBLVphLXotXSsnO1xuXG4vLyAjIyBCdWlsZCBNZXRhZGF0YVxuLy8gUGx1cyBzaWduLCBmb2xsb3dlZCBieSBvbmUgb3IgbW9yZSBwZXJpb2Qtc2VwYXJhdGVkIGJ1aWxkIG1ldGFkYXRhXG4vLyBpZGVudGlmaWVycy5cblxudmFyIEJVSUxEID0gUisrO1xuc3JjW0JVSUxEXSA9ICcoPzpcXFxcKygnICsgc3JjW0JVSUxESURFTlRJRklFUl0gK1xuICAgICAgICAgICAgICcoPzpcXFxcLicgKyBzcmNbQlVJTERJREVOVElGSUVSXSArICcpKikpJztcblxuXG4vLyAjIyBGdWxsIFZlcnNpb24gU3RyaW5nXG4vLyBBIG1haW4gdmVyc2lvbiwgZm9sbG93ZWQgb3B0aW9uYWxseSBieSBhIHByZS1yZWxlYXNlIHZlcnNpb24gYW5kXG4vLyBidWlsZCBtZXRhZGF0YS5cblxuLy8gTm90ZSB0aGF0IHRoZSBvbmx5IG1ham9yLCBtaW5vciwgcGF0Y2gsIGFuZCBwcmUtcmVsZWFzZSBzZWN0aW9ucyBvZlxuLy8gdGhlIHZlcnNpb24gc3RyaW5nIGFyZSBjYXB0dXJpbmcgZ3JvdXBzLiAgVGhlIGJ1aWxkIG1ldGFkYXRhIGlzIG5vdCBhXG4vLyBjYXB0dXJpbmcgZ3JvdXAsIGJlY2F1c2UgaXQgc2hvdWxkIG5vdCBldmVyIGJlIHVzZWQgaW4gdmVyc2lvblxuLy8gY29tcGFyaXNvbi5cblxudmFyIEZVTEwgPSBSKys7XG52YXIgRlVMTFBMQUlOID0gJ3Y/JyArIHNyY1tNQUlOVkVSU0lPTl0gK1xuICAgICAgICAgICAgICAgIHNyY1tQUkVSRUxFQVNFXSArICc/JyArXG4gICAgICAgICAgICAgICAgc3JjW0JVSUxEXSArICc/Jztcblxuc3JjW0ZVTExdID0gJ14nICsgRlVMTFBMQUlOICsgJyQnO1xuXG4vLyBsaWtlIGZ1bGwsIGJ1dCBhbGxvd3MgdjEuMi4zIGFuZCA9MS4yLjMsIHdoaWNoIHBlb3BsZSBkbyBzb21ldGltZXMuXG4vLyBhbHNvLCAxLjAuMGFscGhhMSAocHJlcmVsZWFzZSB3aXRob3V0IHRoZSBoeXBoZW4pIHdoaWNoIGlzIHByZXR0eVxuLy8gY29tbW9uIGluIHRoZSBucG0gcmVnaXN0cnkuXG52YXIgTE9PU0VQTEFJTiA9ICdbdj1cXFxcc10qJyArIHNyY1tNQUlOVkVSU0lPTkxPT1NFXSArXG4gICAgICAgICAgICAgICAgIHNyY1tQUkVSRUxFQVNFTE9PU0VdICsgJz8nICtcbiAgICAgICAgICAgICAgICAgc3JjW0JVSUxEXSArICc/JztcblxudmFyIExPT1NFID0gUisrO1xuc3JjW0xPT1NFXSA9ICdeJyArIExPT1NFUExBSU4gKyAnJCc7XG5cbnZhciBHVExUID0gUisrO1xuc3JjW0dUTFRdID0gJygoPzo8fD4pPz0/KSc7XG5cbi8vIFNvbWV0aGluZyBsaWtlIFwiMi4qXCIgb3IgXCIxLjIueFwiLlxuLy8gTm90ZSB0aGF0IFwieC54XCIgaXMgYSB2YWxpZCB4UmFuZ2UgaWRlbnRpZmVyLCBtZWFuaW5nIFwiYW55IHZlcnNpb25cIlxuLy8gT25seSB0aGUgZmlyc3QgaXRlbSBpcyBzdHJpY3RseSByZXF1aXJlZC5cbnZhciBYUkFOR0VJREVOVElGSUVSTE9PU0UgPSBSKys7XG5zcmNbWFJBTkdFSURFTlRJRklFUkxPT1NFXSA9IHNyY1tOVU1FUklDSURFTlRJRklFUkxPT1NFXSArICd8eHxYfFxcXFwqJztcbnZhciBYUkFOR0VJREVOVElGSUVSID0gUisrO1xuc3JjW1hSQU5HRUlERU5USUZJRVJdID0gc3JjW05VTUVSSUNJREVOVElGSUVSXSArICd8eHxYfFxcXFwqJztcblxudmFyIFhSQU5HRVBMQUlOID0gUisrO1xuc3JjW1hSQU5HRVBMQUlOXSA9ICdbdj1cXFxcc10qKCcgKyBzcmNbWFJBTkdFSURFTlRJRklFUl0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICcoPzpcXFxcLignICsgc3JjW1hSQU5HRUlERU5USUZJRVJdICsgJyknICtcbiAgICAgICAgICAgICAgICAgICAnKD86XFxcXC4oJyArIHNyY1tYUkFOR0VJREVOVElGSUVSXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgJyg/OicgKyBzcmNbUFJFUkVMRUFTRV0gKyAnKT8nICtcbiAgICAgICAgICAgICAgICAgICBzcmNbQlVJTERdICsgJz8nICtcbiAgICAgICAgICAgICAgICAgICAnKT8pPyc7XG5cbnZhciBYUkFOR0VQTEFJTkxPT1NFID0gUisrO1xuc3JjW1hSQU5HRVBMQUlOTE9PU0VdID0gJ1t2PVxcXFxzXSooJyArIHNyY1tYUkFOR0VJREVOVElGSUVSTE9PU0VdICsgJyknICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcoPzpcXFxcLignICsgc3JjW1hSQU5HRUlERU5USUZJRVJMT09TRV0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyg/OlxcXFwuKCcgKyBzcmNbWFJBTkdFSURFTlRJRklFUkxPT1NFXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKD86JyArIHNyY1tQUkVSRUxFQVNFTE9PU0VdICsgJyk/JyArXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNbQlVJTERdICsgJz8nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcpPyk/JztcblxudmFyIFhSQU5HRSA9IFIrKztcbnNyY1tYUkFOR0VdID0gJ14nICsgc3JjW0dUTFRdICsgJ1xcXFxzKicgKyBzcmNbWFJBTkdFUExBSU5dICsgJyQnO1xudmFyIFhSQU5HRUxPT1NFID0gUisrO1xuc3JjW1hSQU5HRUxPT1NFXSA9ICdeJyArIHNyY1tHVExUXSArICdcXFxccyonICsgc3JjW1hSQU5HRVBMQUlOTE9PU0VdICsgJyQnO1xuXG4vLyBUaWxkZSByYW5nZXMuXG4vLyBNZWFuaW5nIGlzIFwicmVhc29uYWJseSBhdCBvciBncmVhdGVyIHRoYW5cIlxudmFyIExPTkVUSUxERSA9IFIrKztcbnNyY1tMT05FVElMREVdID0gJyg/On4+PyknO1xuXG52YXIgVElMREVUUklNID0gUisrO1xuc3JjW1RJTERFVFJJTV0gPSAnKFxcXFxzKiknICsgc3JjW0xPTkVUSUxERV0gKyAnXFxcXHMrJztcbnJlW1RJTERFVFJJTV0gPSBuZXcgUmVnRXhwKHNyY1tUSUxERVRSSU1dLCAnZycpO1xudmFyIHRpbGRlVHJpbVJlcGxhY2UgPSAnJDF+JztcblxudmFyIFRJTERFID0gUisrO1xuc3JjW1RJTERFXSA9ICdeJyArIHNyY1tMT05FVElMREVdICsgc3JjW1hSQU5HRVBMQUlOXSArICckJztcbnZhciBUSUxERUxPT1NFID0gUisrO1xuc3JjW1RJTERFTE9PU0VdID0gJ14nICsgc3JjW0xPTkVUSUxERV0gKyBzcmNbWFJBTkdFUExBSU5MT09TRV0gKyAnJCc7XG5cbi8vIENhcmV0IHJhbmdlcy5cbi8vIE1lYW5pbmcgaXMgXCJhdCBsZWFzdCBhbmQgYmFja3dhcmRzIGNvbXBhdGlibGUgd2l0aFwiXG52YXIgTE9ORUNBUkVUID0gUisrO1xuc3JjW0xPTkVDQVJFVF0gPSAnKD86XFxcXF4pJztcblxudmFyIENBUkVUVFJJTSA9IFIrKztcbnNyY1tDQVJFVFRSSU1dID0gJyhcXFxccyopJyArIHNyY1tMT05FQ0FSRVRdICsgJ1xcXFxzKyc7XG5yZVtDQVJFVFRSSU1dID0gbmV3IFJlZ0V4cChzcmNbQ0FSRVRUUklNXSwgJ2cnKTtcbnZhciBjYXJldFRyaW1SZXBsYWNlID0gJyQxXic7XG5cbnZhciBDQVJFVCA9IFIrKztcbnNyY1tDQVJFVF0gPSAnXicgKyBzcmNbTE9ORUNBUkVUXSArIHNyY1tYUkFOR0VQTEFJTl0gKyAnJCc7XG52YXIgQ0FSRVRMT09TRSA9IFIrKztcbnNyY1tDQVJFVExPT1NFXSA9ICdeJyArIHNyY1tMT05FQ0FSRVRdICsgc3JjW1hSQU5HRVBMQUlOTE9PU0VdICsgJyQnO1xuXG4vLyBBIHNpbXBsZSBndC9sdC9lcSB0aGluZywgb3IganVzdCBcIlwiIHRvIGluZGljYXRlIFwiYW55IHZlcnNpb25cIlxudmFyIENPTVBBUkFUT1JMT09TRSA9IFIrKztcbnNyY1tDT01QQVJBVE9STE9PU0VdID0gJ14nICsgc3JjW0dUTFRdICsgJ1xcXFxzKignICsgTE9PU0VQTEFJTiArICcpJHxeJCc7XG52YXIgQ09NUEFSQVRPUiA9IFIrKztcbnNyY1tDT01QQVJBVE9SXSA9ICdeJyArIHNyY1tHVExUXSArICdcXFxccyooJyArIEZVTExQTEFJTiArICcpJHxeJCc7XG5cblxuLy8gQW4gZXhwcmVzc2lvbiB0byBzdHJpcCBhbnkgd2hpdGVzcGFjZSBiZXR3ZWVuIHRoZSBndGx0IGFuZCB0aGUgdGhpbmdcbi8vIGl0IG1vZGlmaWVzLCBzbyB0aGF0IGA+IDEuMi4zYCA9PT4gYD4xLjIuM2BcbnZhciBDT01QQVJBVE9SVFJJTSA9IFIrKztcbnNyY1tDT01QQVJBVE9SVFJJTV0gPSAnKFxcXFxzKiknICsgc3JjW0dUTFRdICtcbiAgICAgICAgICAgICAgICAgICAgICAnXFxcXHMqKCcgKyBMT09TRVBMQUlOICsgJ3wnICsgc3JjW1hSQU5HRVBMQUlOXSArICcpJztcblxuLy8gdGhpcyBvbmUgaGFzIHRvIHVzZSB0aGUgL2cgZmxhZ1xucmVbQ09NUEFSQVRPUlRSSU1dID0gbmV3IFJlZ0V4cChzcmNbQ09NUEFSQVRPUlRSSU1dLCAnZycpO1xudmFyIGNvbXBhcmF0b3JUcmltUmVwbGFjZSA9ICckMSQyJDMnO1xuXG5cbi8vIFNvbWV0aGluZyBsaWtlIGAxLjIuMyAtIDEuMi40YFxuLy8gTm90ZSB0aGF0IHRoZXNlIGFsbCB1c2UgdGhlIGxvb3NlIGZvcm0sIGJlY2F1c2UgdGhleSdsbCBiZVxuLy8gY2hlY2tlZCBhZ2FpbnN0IGVpdGhlciB0aGUgc3RyaWN0IG9yIGxvb3NlIGNvbXBhcmF0b3IgZm9ybVxuLy8gbGF0ZXIuXG52YXIgSFlQSEVOUkFOR0UgPSBSKys7XG5zcmNbSFlQSEVOUkFOR0VdID0gJ15cXFxccyooJyArIHNyY1tYUkFOR0VQTEFJTl0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICdcXFxccystXFxcXHMrJyArXG4gICAgICAgICAgICAgICAgICAgJygnICsgc3JjW1hSQU5HRVBMQUlOXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgJ1xcXFxzKiQnO1xuXG52YXIgSFlQSEVOUkFOR0VMT09TRSA9IFIrKztcbnNyY1tIWVBIRU5SQU5HRUxPT1NFXSA9ICdeXFxcXHMqKCcgKyBzcmNbWFJBTkdFUExBSU5MT09TRV0gKyAnKScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1xcXFxzKy1cXFxccysnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcoJyArIHNyY1tYUkFOR0VQTEFJTkxPT1NFXSArICcpJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXFxcXHMqJCc7XG5cbi8vIFN0YXIgcmFuZ2VzIGJhc2ljYWxseSBqdXN0IGFsbG93IGFueXRoaW5nIGF0IGFsbC5cbnZhciBTVEFSID0gUisrO1xuc3JjW1NUQVJdID0gJyg8fD4pPz0/XFxcXHMqXFxcXConO1xuXG4vLyBDb21waWxlIHRvIGFjdHVhbCByZWdleHAgb2JqZWN0cy5cbi8vIEFsbCBhcmUgZmxhZy1mcmVlLCB1bmxlc3MgdGhleSB3ZXJlIGNyZWF0ZWQgYWJvdmUgd2l0aCBhIGZsYWcuXG5mb3IgKHZhciBpID0gMDsgaSA8IFI7IGkrKykge1xuICBkZWJ1ZyhpLCBzcmNbaV0pO1xuICBpZiAoIXJlW2ldKVxuICAgIHJlW2ldID0gbmV3IFJlZ0V4cChzcmNbaV0pO1xufVxuXG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5mdW5jdGlvbiBwYXJzZSh2ZXJzaW9uLCBsb29zZSkge1xuICBpZiAodmVyc2lvbiBpbnN0YW5jZW9mIFNlbVZlcilcbiAgICByZXR1cm4gdmVyc2lvbjtcblxuICBpZiAodHlwZW9mIHZlcnNpb24gIT09ICdzdHJpbmcnKVxuICAgIHJldHVybiBudWxsO1xuXG4gIGlmICh2ZXJzaW9uLmxlbmd0aCA+IE1BWF9MRU5HVEgpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgdmFyIHIgPSBsb29zZSA/IHJlW0xPT1NFXSA6IHJlW0ZVTExdO1xuICBpZiAoIXIudGVzdCh2ZXJzaW9uKSlcbiAgICByZXR1cm4gbnVsbDtcblxuICB0cnkge1xuICAgIHJldHVybiBuZXcgU2VtVmVyKHZlcnNpb24sIGxvb3NlKTtcbiAgfSBjYXRjaCAoZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnRzLnZhbGlkID0gdmFsaWQ7XG5mdW5jdGlvbiB2YWxpZCh2ZXJzaW9uLCBsb29zZSkge1xuICB2YXIgdiA9IHBhcnNlKHZlcnNpb24sIGxvb3NlKTtcbiAgcmV0dXJuIHYgPyB2LnZlcnNpb24gOiBudWxsO1xufVxuXG5cbmV4cG9ydHMuY2xlYW4gPSBjbGVhbjtcbmZ1bmN0aW9uIGNsZWFuKHZlcnNpb24sIGxvb3NlKSB7XG4gIHZhciBzID0gcGFyc2UodmVyc2lvbi50cmltKCkucmVwbGFjZSgvXls9dl0rLywgJycpLCBsb29zZSk7XG4gIHJldHVybiBzID8gcy52ZXJzaW9uIDogbnVsbDtcbn1cblxuZXhwb3J0cy5TZW1WZXIgPSBTZW1WZXI7XG5cbmZ1bmN0aW9uIFNlbVZlcih2ZXJzaW9uLCBsb29zZSkge1xuICBpZiAodmVyc2lvbiBpbnN0YW5jZW9mIFNlbVZlcikge1xuICAgIGlmICh2ZXJzaW9uLmxvb3NlID09PSBsb29zZSlcbiAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgIGVsc2VcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnZlcnNpb247XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZlcnNpb24gIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBWZXJzaW9uOiAnICsgdmVyc2lvbik7XG4gIH1cblxuICBpZiAodmVyc2lvbi5sZW5ndGggPiBNQVhfTEVOR1RIKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZlcnNpb24gaXMgbG9uZ2VyIHRoYW4gJyArIE1BWF9MRU5HVEggKyAnIGNoYXJhY3RlcnMnKVxuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTZW1WZXIpKVxuICAgIHJldHVybiBuZXcgU2VtVmVyKHZlcnNpb24sIGxvb3NlKTtcblxuICBkZWJ1ZygnU2VtVmVyJywgdmVyc2lvbiwgbG9vc2UpO1xuICB0aGlzLmxvb3NlID0gbG9vc2U7XG4gIHZhciBtID0gdmVyc2lvbi50cmltKCkubWF0Y2gobG9vc2UgPyByZVtMT09TRV0gOiByZVtGVUxMXSk7XG5cbiAgaWYgKCFtKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgVmVyc2lvbjogJyArIHZlcnNpb24pO1xuXG4gIHRoaXMucmF3ID0gdmVyc2lvbjtcblxuICAvLyB0aGVzZSBhcmUgYWN0dWFsbHkgbnVtYmVyc1xuICB0aGlzLm1ham9yID0gK21bMV07XG4gIHRoaXMubWlub3IgPSArbVsyXTtcbiAgdGhpcy5wYXRjaCA9ICttWzNdO1xuXG4gIGlmICh0aGlzLm1ham9yID4gTUFYX1NBRkVfSU5URUdFUiB8fCB0aGlzLm1ham9yIDwgMClcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG1ham9yIHZlcnNpb24nKVxuXG4gIGlmICh0aGlzLm1pbm9yID4gTUFYX1NBRkVfSU5URUdFUiB8fCB0aGlzLm1pbm9yIDwgMClcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG1pbm9yIHZlcnNpb24nKVxuXG4gIGlmICh0aGlzLnBhdGNoID4gTUFYX1NBRkVfSU5URUdFUiB8fCB0aGlzLnBhdGNoIDwgMClcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHBhdGNoIHZlcnNpb24nKVxuXG4gIC8vIG51bWJlcmlmeSBhbnkgcHJlcmVsZWFzZSBudW1lcmljIGlkc1xuICBpZiAoIW1bNF0pXG4gICAgdGhpcy5wcmVyZWxlYXNlID0gW107XG4gIGVsc2VcbiAgICB0aGlzLnByZXJlbGVhc2UgPSBtWzRdLnNwbGl0KCcuJykubWFwKGZ1bmN0aW9uKGlkKSB7XG4gICAgICBpZiAoL15bMC05XSskLy50ZXN0KGlkKSkge1xuICAgICAgICB2YXIgbnVtID0gK2lkXG4gICAgICAgIGlmIChudW0gPj0gMCAmJiBudW0gPCBNQVhfU0FGRV9JTlRFR0VSKVxuICAgICAgICAgIHJldHVybiBudW1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpZDtcbiAgICB9KTtcblxuICB0aGlzLmJ1aWxkID0gbVs1XSA/IG1bNV0uc3BsaXQoJy4nKSA6IFtdO1xuICB0aGlzLmZvcm1hdCgpO1xufVxuXG5TZW1WZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZlcnNpb24gPSB0aGlzLm1ham9yICsgJy4nICsgdGhpcy5taW5vciArICcuJyArIHRoaXMucGF0Y2g7XG4gIGlmICh0aGlzLnByZXJlbGVhc2UubGVuZ3RoKVxuICAgIHRoaXMudmVyc2lvbiArPSAnLScgKyB0aGlzLnByZXJlbGVhc2Uuam9pbignLicpO1xuICByZXR1cm4gdGhpcy52ZXJzaW9uO1xufTtcblxuU2VtVmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy52ZXJzaW9uO1xufTtcblxuU2VtVmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24ob3RoZXIpIHtcbiAgZGVidWcoJ1NlbVZlci5jb21wYXJlJywgdGhpcy52ZXJzaW9uLCB0aGlzLmxvb3NlLCBvdGhlcik7XG4gIGlmICghKG90aGVyIGluc3RhbmNlb2YgU2VtVmVyKSlcbiAgICBvdGhlciA9IG5ldyBTZW1WZXIob3RoZXIsIHRoaXMubG9vc2UpO1xuXG4gIHJldHVybiB0aGlzLmNvbXBhcmVNYWluKG90aGVyKSB8fCB0aGlzLmNvbXBhcmVQcmUob3RoZXIpO1xufTtcblxuU2VtVmVyLnByb3RvdHlwZS5jb21wYXJlTWFpbiA9IGZ1bmN0aW9uKG90aGVyKSB7XG4gIGlmICghKG90aGVyIGluc3RhbmNlb2YgU2VtVmVyKSlcbiAgICBvdGhlciA9IG5ldyBTZW1WZXIob3RoZXIsIHRoaXMubG9vc2UpO1xuXG4gIHJldHVybiBjb21wYXJlSWRlbnRpZmllcnModGhpcy5tYWpvciwgb3RoZXIubWFqb3IpIHx8XG4gICAgICAgICBjb21wYXJlSWRlbnRpZmllcnModGhpcy5taW5vciwgb3RoZXIubWlub3IpIHx8XG4gICAgICAgICBjb21wYXJlSWRlbnRpZmllcnModGhpcy5wYXRjaCwgb3RoZXIucGF0Y2gpO1xufTtcblxuU2VtVmVyLnByb3RvdHlwZS5jb21wYXJlUHJlID0gZnVuY3Rpb24ob3RoZXIpIHtcbiAgaWYgKCEob3RoZXIgaW5zdGFuY2VvZiBTZW1WZXIpKVxuICAgIG90aGVyID0gbmV3IFNlbVZlcihvdGhlciwgdGhpcy5sb29zZSk7XG5cbiAgLy8gTk9UIGhhdmluZyBhIHByZXJlbGVhc2UgaXMgPiBoYXZpbmcgb25lXG4gIGlmICh0aGlzLnByZXJlbGVhc2UubGVuZ3RoICYmICFvdGhlci5wcmVyZWxlYXNlLmxlbmd0aClcbiAgICByZXR1cm4gLTE7XG4gIGVsc2UgaWYgKCF0aGlzLnByZXJlbGVhc2UubGVuZ3RoICYmIG90aGVyLnByZXJlbGVhc2UubGVuZ3RoKVxuICAgIHJldHVybiAxO1xuICBlbHNlIGlmICghdGhpcy5wcmVyZWxlYXNlLmxlbmd0aCAmJiAhb3RoZXIucHJlcmVsZWFzZS5sZW5ndGgpXG4gICAgcmV0dXJuIDA7XG5cbiAgdmFyIGkgPSAwO1xuICBkbyB7XG4gICAgdmFyIGEgPSB0aGlzLnByZXJlbGVhc2VbaV07XG4gICAgdmFyIGIgPSBvdGhlci5wcmVyZWxlYXNlW2ldO1xuICAgIGRlYnVnKCdwcmVyZWxlYXNlIGNvbXBhcmUnLCBpLCBhLCBiKTtcbiAgICBpZiAoYSA9PT0gdW5kZWZpbmVkICYmIGIgPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiAwO1xuICAgIGVsc2UgaWYgKGIgPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGEgPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiAtMTtcbiAgICBlbHNlIGlmIChhID09PSBiKVxuICAgICAgY29udGludWU7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGNvbXBhcmVJZGVudGlmaWVycyhhLCBiKTtcbiAgfSB3aGlsZSAoKytpKTtcbn07XG5cbi8vIHByZW1pbm9yIHdpbGwgYnVtcCB0aGUgdmVyc2lvbiB1cCB0byB0aGUgbmV4dCBtaW5vciByZWxlYXNlLCBhbmQgaW1tZWRpYXRlbHlcbi8vIGRvd24gdG8gcHJlLXJlbGVhc2UuIHByZW1ham9yIGFuZCBwcmVwYXRjaCB3b3JrIHRoZSBzYW1lIHdheS5cblNlbVZlci5wcm90b3R5cGUuaW5jID0gZnVuY3Rpb24ocmVsZWFzZSwgaWRlbnRpZmllcikge1xuICBzd2l0Y2ggKHJlbGVhc2UpIHtcbiAgICBjYXNlICdwcmVtYWpvcic6XG4gICAgICB0aGlzLnByZXJlbGVhc2UubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMucGF0Y2ggPSAwO1xuICAgICAgdGhpcy5taW5vciA9IDA7XG4gICAgICB0aGlzLm1ham9yKys7XG4gICAgICB0aGlzLmluYygncHJlJywgaWRlbnRpZmllcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdwcmVtaW5vcic6XG4gICAgICB0aGlzLnByZXJlbGVhc2UubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMucGF0Y2ggPSAwO1xuICAgICAgdGhpcy5taW5vcisrO1xuICAgICAgdGhpcy5pbmMoJ3ByZScsIGlkZW50aWZpZXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncHJlcGF0Y2gnOlxuICAgICAgLy8gSWYgdGhpcyBpcyBhbHJlYWR5IGEgcHJlcmVsZWFzZSwgaXQgd2lsbCBidW1wIHRvIHRoZSBuZXh0IHZlcnNpb25cbiAgICAgIC8vIGRyb3AgYW55IHByZXJlbGVhc2VzIHRoYXQgbWlnaHQgYWxyZWFkeSBleGlzdCwgc2luY2UgdGhleSBhcmUgbm90XG4gICAgICAvLyByZWxldmFudCBhdCB0aGlzIHBvaW50LlxuICAgICAgdGhpcy5wcmVyZWxlYXNlLmxlbmd0aCA9IDA7XG4gICAgICB0aGlzLmluYygncGF0Y2gnLCBpZGVudGlmaWVyKTtcbiAgICAgIHRoaXMuaW5jKCdwcmUnLCBpZGVudGlmaWVyKTtcbiAgICAgIGJyZWFrO1xuICAgIC8vIElmIHRoZSBpbnB1dCBpcyBhIG5vbi1wcmVyZWxlYXNlIHZlcnNpb24sIHRoaXMgYWN0cyB0aGUgc2FtZSBhc1xuICAgIC8vIHByZXBhdGNoLlxuICAgIGNhc2UgJ3ByZXJlbGVhc2UnOlxuICAgICAgaWYgKHRoaXMucHJlcmVsZWFzZS5sZW5ndGggPT09IDApXG4gICAgICAgIHRoaXMuaW5jKCdwYXRjaCcsIGlkZW50aWZpZXIpO1xuICAgICAgdGhpcy5pbmMoJ3ByZScsIGlkZW50aWZpZXIpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdtYWpvcic6XG4gICAgICAvLyBJZiB0aGlzIGlzIGEgcHJlLW1ham9yIHZlcnNpb24sIGJ1bXAgdXAgdG8gdGhlIHNhbWUgbWFqb3IgdmVyc2lvbi5cbiAgICAgIC8vIE90aGVyd2lzZSBpbmNyZW1lbnQgbWFqb3IuXG4gICAgICAvLyAxLjAuMC01IGJ1bXBzIHRvIDEuMC4wXG4gICAgICAvLyAxLjEuMCBidW1wcyB0byAyLjAuMFxuICAgICAgaWYgKHRoaXMubWlub3IgIT09IDAgfHwgdGhpcy5wYXRjaCAhPT0gMCB8fCB0aGlzLnByZXJlbGVhc2UubGVuZ3RoID09PSAwKVxuICAgICAgICB0aGlzLm1ham9yKys7XG4gICAgICB0aGlzLm1pbm9yID0gMDtcbiAgICAgIHRoaXMucGF0Y2ggPSAwO1xuICAgICAgdGhpcy5wcmVyZWxlYXNlID0gW107XG4gICAgICBicmVhaztcbiAgICBjYXNlICdtaW5vcic6XG4gICAgICAvLyBJZiB0aGlzIGlzIGEgcHJlLW1pbm9yIHZlcnNpb24sIGJ1bXAgdXAgdG8gdGhlIHNhbWUgbWlub3IgdmVyc2lvbi5cbiAgICAgIC8vIE90aGVyd2lzZSBpbmNyZW1lbnQgbWlub3IuXG4gICAgICAvLyAxLjIuMC01IGJ1bXBzIHRvIDEuMi4wXG4gICAgICAvLyAxLjIuMSBidW1wcyB0byAxLjMuMFxuICAgICAgaWYgKHRoaXMucGF0Y2ggIT09IDAgfHwgdGhpcy5wcmVyZWxlYXNlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgdGhpcy5taW5vcisrO1xuICAgICAgdGhpcy5wYXRjaCA9IDA7XG4gICAgICB0aGlzLnByZXJlbGVhc2UgPSBbXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3BhdGNoJzpcbiAgICAgIC8vIElmIHRoaXMgaXMgbm90IGEgcHJlLXJlbGVhc2UgdmVyc2lvbiwgaXQgd2lsbCBpbmNyZW1lbnQgdGhlIHBhdGNoLlxuICAgICAgLy8gSWYgaXQgaXMgYSBwcmUtcmVsZWFzZSBpdCB3aWxsIGJ1bXAgdXAgdG8gdGhlIHNhbWUgcGF0Y2ggdmVyc2lvbi5cbiAgICAgIC8vIDEuMi4wLTUgcGF0Y2hlcyB0byAxLjIuMFxuICAgICAgLy8gMS4yLjAgcGF0Y2hlcyB0byAxLjIuMVxuICAgICAgaWYgKHRoaXMucHJlcmVsZWFzZS5sZW5ndGggPT09IDApXG4gICAgICAgIHRoaXMucGF0Y2grKztcbiAgICAgIHRoaXMucHJlcmVsZWFzZSA9IFtdO1xuICAgICAgYnJlYWs7XG4gICAgLy8gVGhpcyBwcm9iYWJseSBzaG91bGRuJ3QgYmUgdXNlZCBwdWJsaWNseS5cbiAgICAvLyAxLjAuMCBcInByZVwiIHdvdWxkIGJlY29tZSAxLjAuMC0wIHdoaWNoIGlzIHRoZSB3cm9uZyBkaXJlY3Rpb24uXG4gICAgY2FzZSAncHJlJzpcbiAgICAgIGlmICh0aGlzLnByZXJlbGVhc2UubGVuZ3RoID09PSAwKVxuICAgICAgICB0aGlzLnByZXJlbGVhc2UgPSBbMF07XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLnByZXJlbGVhc2UubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJlcmVsZWFzZVtpXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMucHJlcmVsZWFzZVtpXSsrO1xuICAgICAgICAgICAgaSA9IC0yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gLTEpIC8vIGRpZG4ndCBpbmNyZW1lbnQgYW55dGhpbmdcbiAgICAgICAgICB0aGlzLnByZXJlbGVhc2UucHVzaCgwKTtcbiAgICAgIH1cbiAgICAgIGlmIChpZGVudGlmaWVyKSB7XG4gICAgICAgIC8vIDEuMi4wLWJldGEuMSBidW1wcyB0byAxLjIuMC1iZXRhLjIsXG4gICAgICAgIC8vIDEuMi4wLWJldGEuZm9vYmx6IG9yIDEuMi4wLWJldGEgYnVtcHMgdG8gMS4yLjAtYmV0YS4wXG4gICAgICAgIGlmICh0aGlzLnByZXJlbGVhc2VbMF0gPT09IGlkZW50aWZpZXIpIHtcbiAgICAgICAgICBpZiAoaXNOYU4odGhpcy5wcmVyZWxlYXNlWzFdKSlcbiAgICAgICAgICAgIHRoaXMucHJlcmVsZWFzZSA9IFtpZGVudGlmaWVyLCAwXTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgdGhpcy5wcmVyZWxlYXNlID0gW2lkZW50aWZpZXIsIDBdO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGluY3JlbWVudCBhcmd1bWVudDogJyArIHJlbGVhc2UpO1xuICB9XG4gIHRoaXMuZm9ybWF0KCk7XG4gIHRoaXMucmF3ID0gdGhpcy52ZXJzaW9uO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmV4cG9ydHMuaW5jID0gaW5jO1xuZnVuY3Rpb24gaW5jKHZlcnNpb24sIHJlbGVhc2UsIGxvb3NlLCBpZGVudGlmaWVyKSB7XG4gIGlmICh0eXBlb2YobG9vc2UpID09PSAnc3RyaW5nJykge1xuICAgIGlkZW50aWZpZXIgPSBsb29zZTtcbiAgICBsb29zZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBTZW1WZXIodmVyc2lvbiwgbG9vc2UpLmluYyhyZWxlYXNlLCBpZGVudGlmaWVyKS52ZXJzaW9uO1xuICB9IGNhdGNoIChlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydHMuZGlmZiA9IGRpZmY7XG5mdW5jdGlvbiBkaWZmKHZlcnNpb24xLCB2ZXJzaW9uMikge1xuICBpZiAoZXEodmVyc2lvbjEsIHZlcnNpb24yKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2Uge1xuICAgIHZhciB2MSA9IHBhcnNlKHZlcnNpb24xKTtcbiAgICB2YXIgdjIgPSBwYXJzZSh2ZXJzaW9uMik7XG4gICAgaWYgKHYxLnByZXJlbGVhc2UubGVuZ3RoIHx8IHYyLnByZXJlbGVhc2UubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdjEpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ21ham9yJyB8fCBrZXkgPT09ICdtaW5vcicgfHwga2V5ID09PSAncGF0Y2gnKSB7XG4gICAgICAgICAgaWYgKHYxW2tleV0gIT09IHYyW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiAncHJlJytrZXk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gJ3ByZXJlbGVhc2UnO1xuICAgIH1cbiAgICBmb3IgKHZhciBrZXkgaW4gdjEpIHtcbiAgICAgIGlmIChrZXkgPT09ICdtYWpvcicgfHwga2V5ID09PSAnbWlub3InIHx8IGtleSA9PT0gJ3BhdGNoJykge1xuICAgICAgICBpZiAodjFba2V5XSAhPT0gdjJba2V5XSkge1xuICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jb21wYXJlSWRlbnRpZmllcnMgPSBjb21wYXJlSWRlbnRpZmllcnM7XG5cbnZhciBudW1lcmljID0gL15bMC05XSskLztcbmZ1bmN0aW9uIGNvbXBhcmVJZGVudGlmaWVycyhhLCBiKSB7XG4gIHZhciBhbnVtID0gbnVtZXJpYy50ZXN0KGEpO1xuICB2YXIgYm51bSA9IG51bWVyaWMudGVzdChiKTtcblxuICBpZiAoYW51bSAmJiBibnVtKSB7XG4gICAgYSA9ICthO1xuICAgIGIgPSArYjtcbiAgfVxuXG4gIHJldHVybiAoYW51bSAmJiAhYm51bSkgPyAtMSA6XG4gICAgICAgICAoYm51bSAmJiAhYW51bSkgPyAxIDpcbiAgICAgICAgIGEgPCBiID8gLTEgOlxuICAgICAgICAgYSA+IGIgPyAxIDpcbiAgICAgICAgIDA7XG59XG5cbmV4cG9ydHMucmNvbXBhcmVJZGVudGlmaWVycyA9IHJjb21wYXJlSWRlbnRpZmllcnM7XG5mdW5jdGlvbiByY29tcGFyZUlkZW50aWZpZXJzKGEsIGIpIHtcbiAgcmV0dXJuIGNvbXBhcmVJZGVudGlmaWVycyhiLCBhKTtcbn1cblxuZXhwb3J0cy5tYWpvciA9IG1ham9yO1xuZnVuY3Rpb24gbWFqb3IoYSwgbG9vc2UpIHtcbiAgcmV0dXJuIG5ldyBTZW1WZXIoYSwgbG9vc2UpLm1ham9yO1xufVxuXG5leHBvcnRzLm1pbm9yID0gbWlub3I7XG5mdW5jdGlvbiBtaW5vcihhLCBsb29zZSkge1xuICByZXR1cm4gbmV3IFNlbVZlcihhLCBsb29zZSkubWlub3I7XG59XG5cbmV4cG9ydHMucGF0Y2ggPSBwYXRjaDtcbmZ1bmN0aW9uIHBhdGNoKGEsIGxvb3NlKSB7XG4gIHJldHVybiBuZXcgU2VtVmVyKGEsIGxvb3NlKS5wYXRjaDtcbn1cblxuZXhwb3J0cy5jb21wYXJlID0gY29tcGFyZTtcbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYiwgbG9vc2UpIHtcbiAgcmV0dXJuIG5ldyBTZW1WZXIoYSwgbG9vc2UpLmNvbXBhcmUoYik7XG59XG5cbmV4cG9ydHMuY29tcGFyZUxvb3NlID0gY29tcGFyZUxvb3NlO1xuZnVuY3Rpb24gY29tcGFyZUxvb3NlKGEsIGIpIHtcbiAgcmV0dXJuIGNvbXBhcmUoYSwgYiwgdHJ1ZSk7XG59XG5cbmV4cG9ydHMucmNvbXBhcmUgPSByY29tcGFyZTtcbmZ1bmN0aW9uIHJjb21wYXJlKGEsIGIsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wYXJlKGIsIGEsIGxvb3NlKTtcbn1cblxuZXhwb3J0cy5zb3J0ID0gc29ydDtcbmZ1bmN0aW9uIHNvcnQobGlzdCwgbG9vc2UpIHtcbiAgcmV0dXJuIGxpc3Quc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY29tcGFyZShhLCBiLCBsb29zZSk7XG4gIH0pO1xufVxuXG5leHBvcnRzLnJzb3J0ID0gcnNvcnQ7XG5mdW5jdGlvbiByc29ydChsaXN0LCBsb29zZSkge1xuICByZXR1cm4gbGlzdC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5yY29tcGFyZShhLCBiLCBsb29zZSk7XG4gIH0pO1xufVxuXG5leHBvcnRzLmd0ID0gZ3Q7XG5mdW5jdGlvbiBndChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCBsb29zZSkgPiAwO1xufVxuXG5leHBvcnRzLmx0ID0gbHQ7XG5mdW5jdGlvbiBsdChhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCBsb29zZSkgPCAwO1xufVxuXG5leHBvcnRzLmVxID0gZXE7XG5mdW5jdGlvbiBlcShhLCBiLCBsb29zZSkge1xuICByZXR1cm4gY29tcGFyZShhLCBiLCBsb29zZSkgPT09IDA7XG59XG5cbmV4cG9ydHMubmVxID0gbmVxO1xuZnVuY3Rpb24gbmVxKGEsIGIsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wYXJlKGEsIGIsIGxvb3NlKSAhPT0gMDtcbn1cblxuZXhwb3J0cy5ndGUgPSBndGU7XG5mdW5jdGlvbiBndGUoYSwgYiwgbG9vc2UpIHtcbiAgcmV0dXJuIGNvbXBhcmUoYSwgYiwgbG9vc2UpID49IDA7XG59XG5cbmV4cG9ydHMubHRlID0gbHRlO1xuZnVuY3Rpb24gbHRlKGEsIGIsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wYXJlKGEsIGIsIGxvb3NlKSA8PSAwO1xufVxuXG5leHBvcnRzLmNtcCA9IGNtcDtcbmZ1bmN0aW9uIGNtcChhLCBvcCwgYiwgbG9vc2UpIHtcbiAgdmFyIHJldDtcbiAgc3dpdGNoIChvcCkge1xuICAgIGNhc2UgJz09PSc6XG4gICAgICBpZiAodHlwZW9mIGEgPT09ICdvYmplY3QnKSBhID0gYS52ZXJzaW9uO1xuICAgICAgaWYgKHR5cGVvZiBiID09PSAnb2JqZWN0JykgYiA9IGIudmVyc2lvbjtcbiAgICAgIHJldCA9IGEgPT09IGI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICchPT0nOlxuICAgICAgaWYgKHR5cGVvZiBhID09PSAnb2JqZWN0JykgYSA9IGEudmVyc2lvbjtcbiAgICAgIGlmICh0eXBlb2YgYiA9PT0gJ29iamVjdCcpIGIgPSBiLnZlcnNpb247XG4gICAgICByZXQgPSBhICE9PSBiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnJzogY2FzZSAnPSc6IGNhc2UgJz09JzogcmV0ID0gZXEoYSwgYiwgbG9vc2UpOyBicmVhaztcbiAgICBjYXNlICchPSc6IHJldCA9IG5lcShhLCBiLCBsb29zZSk7IGJyZWFrO1xuICAgIGNhc2UgJz4nOiByZXQgPSBndChhLCBiLCBsb29zZSk7IGJyZWFrO1xuICAgIGNhc2UgJz49JzogcmV0ID0gZ3RlKGEsIGIsIGxvb3NlKTsgYnJlYWs7XG4gICAgY2FzZSAnPCc6IHJldCA9IGx0KGEsIGIsIGxvb3NlKTsgYnJlYWs7XG4gICAgY2FzZSAnPD0nOiByZXQgPSBsdGUoYSwgYiwgbG9vc2UpOyBicmVhaztcbiAgICBkZWZhdWx0OiB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG9wZXJhdG9yOiAnICsgb3ApO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydHMuQ29tcGFyYXRvciA9IENvbXBhcmF0b3I7XG5mdW5jdGlvbiBDb21wYXJhdG9yKGNvbXAsIGxvb3NlKSB7XG4gIGlmIChjb21wIGluc3RhbmNlb2YgQ29tcGFyYXRvcikge1xuICAgIGlmIChjb21wLmxvb3NlID09PSBsb29zZSlcbiAgICAgIHJldHVybiBjb21wO1xuICAgIGVsc2VcbiAgICAgIGNvbXAgPSBjb21wLnZhbHVlO1xuICB9XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIENvbXBhcmF0b3IpKVxuICAgIHJldHVybiBuZXcgQ29tcGFyYXRvcihjb21wLCBsb29zZSk7XG5cbiAgZGVidWcoJ2NvbXBhcmF0b3InLCBjb21wLCBsb29zZSk7XG4gIHRoaXMubG9vc2UgPSBsb29zZTtcbiAgdGhpcy5wYXJzZShjb21wKTtcblxuICBpZiAodGhpcy5zZW12ZXIgPT09IEFOWSlcbiAgICB0aGlzLnZhbHVlID0gJyc7XG4gIGVsc2VcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5vcGVyYXRvciArIHRoaXMuc2VtdmVyLnZlcnNpb247XG5cbiAgZGVidWcoJ2NvbXAnLCB0aGlzKTtcbn1cblxudmFyIEFOWSA9IHt9O1xuQ29tcGFyYXRvci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihjb21wKSB7XG4gIHZhciByID0gdGhpcy5sb29zZSA/IHJlW0NPTVBBUkFUT1JMT09TRV0gOiByZVtDT01QQVJBVE9SXTtcbiAgdmFyIG0gPSBjb21wLm1hdGNoKHIpO1xuXG4gIGlmICghbSlcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNvbXBhcmF0b3I6ICcgKyBjb21wKTtcblxuICB0aGlzLm9wZXJhdG9yID0gbVsxXTtcbiAgaWYgKHRoaXMub3BlcmF0b3IgPT09ICc9JylcbiAgICB0aGlzLm9wZXJhdG9yID0gJyc7XG5cbiAgLy8gaWYgaXQgbGl0ZXJhbGx5IGlzIGp1c3QgJz4nIG9yICcnIHRoZW4gYWxsb3cgYW55dGhpbmcuXG4gIGlmICghbVsyXSlcbiAgICB0aGlzLnNlbXZlciA9IEFOWTtcbiAgZWxzZVxuICAgIHRoaXMuc2VtdmVyID0gbmV3IFNlbVZlcihtWzJdLCB0aGlzLmxvb3NlKTtcbn07XG5cbkNvbXBhcmF0b3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnZhbHVlO1xufTtcblxuQ29tcGFyYXRvci5wcm90b3R5cGUudGVzdCA9IGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgZGVidWcoJ0NvbXBhcmF0b3IudGVzdCcsIHZlcnNpb24sIHRoaXMubG9vc2UpO1xuXG4gIGlmICh0aGlzLnNlbXZlciA9PT0gQU5ZKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGlmICh0eXBlb2YgdmVyc2lvbiA9PT0gJ3N0cmluZycpXG4gICAgdmVyc2lvbiA9IG5ldyBTZW1WZXIodmVyc2lvbiwgdGhpcy5sb29zZSk7XG5cbiAgcmV0dXJuIGNtcCh2ZXJzaW9uLCB0aGlzLm9wZXJhdG9yLCB0aGlzLnNlbXZlciwgdGhpcy5sb29zZSk7XG59O1xuXG5cbmV4cG9ydHMuUmFuZ2UgPSBSYW5nZTtcbmZ1bmN0aW9uIFJhbmdlKHJhbmdlLCBsb29zZSkge1xuICBpZiAoKHJhbmdlIGluc3RhbmNlb2YgUmFuZ2UpICYmIHJhbmdlLmxvb3NlID09PSBsb29zZSlcbiAgICByZXR1cm4gcmFuZ2U7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJhbmdlKSlcbiAgICByZXR1cm4gbmV3IFJhbmdlKHJhbmdlLCBsb29zZSk7XG5cbiAgdGhpcy5sb29zZSA9IGxvb3NlO1xuXG4gIC8vIEZpcnN0LCBzcGxpdCBiYXNlZCBvbiBib29sZWFuIG9yIHx8XG4gIHRoaXMucmF3ID0gcmFuZ2U7XG4gIHRoaXMuc2V0ID0gcmFuZ2Uuc3BsaXQoL1xccypcXHxcXHxcXHMqLykubWFwKGZ1bmN0aW9uKHJhbmdlKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VSYW5nZShyYW5nZS50cmltKCkpO1xuICB9LCB0aGlzKS5maWx0ZXIoZnVuY3Rpb24oYykge1xuICAgIC8vIHRocm93IG91dCBhbnkgdGhhdCBhcmUgbm90IHJlbGV2YW50IGZvciB3aGF0ZXZlciByZWFzb25cbiAgICByZXR1cm4gYy5sZW5ndGg7XG4gIH0pO1xuXG4gIGlmICghdGhpcy5zZXQubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBTZW1WZXIgUmFuZ2U6ICcgKyByYW5nZSk7XG4gIH1cblxuICB0aGlzLmZvcm1hdCgpO1xufVxuXG5SYW5nZS5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucmFuZ2UgPSB0aGlzLnNldC5tYXAoZnVuY3Rpb24oY29tcHMpIHtcbiAgICByZXR1cm4gY29tcHMuam9pbignICcpLnRyaW0oKTtcbiAgfSkuam9pbignfHwnKS50cmltKCk7XG4gIHJldHVybiB0aGlzLnJhbmdlO1xufTtcblxuUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnJhbmdlO1xufTtcblxuUmFuZ2UucHJvdG90eXBlLnBhcnNlUmFuZ2UgPSBmdW5jdGlvbihyYW5nZSkge1xuICB2YXIgbG9vc2UgPSB0aGlzLmxvb3NlO1xuICByYW5nZSA9IHJhbmdlLnRyaW0oKTtcbiAgZGVidWcoJ3JhbmdlJywgcmFuZ2UsIGxvb3NlKTtcbiAgLy8gYDEuMi4zIC0gMS4yLjRgID0+IGA+PTEuMi4zIDw9MS4yLjRgXG4gIHZhciBociA9IGxvb3NlID8gcmVbSFlQSEVOUkFOR0VMT09TRV0gOiByZVtIWVBIRU5SQU5HRV07XG4gIHJhbmdlID0gcmFuZ2UucmVwbGFjZShociwgaHlwaGVuUmVwbGFjZSk7XG4gIGRlYnVnKCdoeXBoZW4gcmVwbGFjZScsIHJhbmdlKTtcbiAgLy8gYD4gMS4yLjMgPCAxLjIuNWAgPT4gYD4xLjIuMyA8MS4yLjVgXG4gIHJhbmdlID0gcmFuZ2UucmVwbGFjZShyZVtDT01QQVJBVE9SVFJJTV0sIGNvbXBhcmF0b3JUcmltUmVwbGFjZSk7XG4gIGRlYnVnKCdjb21wYXJhdG9yIHRyaW0nLCByYW5nZSwgcmVbQ09NUEFSQVRPUlRSSU1dKTtcblxuICAvLyBgfiAxLjIuM2AgPT4gYH4xLjIuM2BcbiAgcmFuZ2UgPSByYW5nZS5yZXBsYWNlKHJlW1RJTERFVFJJTV0sIHRpbGRlVHJpbVJlcGxhY2UpO1xuXG4gIC8vIGBeIDEuMi4zYCA9PiBgXjEuMi4zYFxuICByYW5nZSA9IHJhbmdlLnJlcGxhY2UocmVbQ0FSRVRUUklNXSwgY2FyZXRUcmltUmVwbGFjZSk7XG5cbiAgLy8gbm9ybWFsaXplIHNwYWNlc1xuICByYW5nZSA9IHJhbmdlLnNwbGl0KC9cXHMrLykuam9pbignICcpO1xuXG4gIC8vIEF0IHRoaXMgcG9pbnQsIHRoZSByYW5nZSBpcyBjb21wbGV0ZWx5IHRyaW1tZWQgYW5kXG4gIC8vIHJlYWR5IHRvIGJlIHNwbGl0IGludG8gY29tcGFyYXRvcnMuXG5cbiAgdmFyIGNvbXBSZSA9IGxvb3NlID8gcmVbQ09NUEFSQVRPUkxPT1NFXSA6IHJlW0NPTVBBUkFUT1JdO1xuICB2YXIgc2V0ID0gcmFuZ2Uuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24oY29tcCkge1xuICAgIHJldHVybiBwYXJzZUNvbXBhcmF0b3IoY29tcCwgbG9vc2UpO1xuICB9KS5qb2luKCcgJykuc3BsaXQoL1xccysvKTtcbiAgaWYgKHRoaXMubG9vc2UpIHtcbiAgICAvLyBpbiBsb29zZSBtb2RlLCB0aHJvdyBvdXQgYW55IHRoYXQgYXJlIG5vdCB2YWxpZCBjb21wYXJhdG9yc1xuICAgIHNldCA9IHNldC5maWx0ZXIoZnVuY3Rpb24oY29tcCkge1xuICAgICAgcmV0dXJuICEhY29tcC5tYXRjaChjb21wUmUpO1xuICAgIH0pO1xuICB9XG4gIHNldCA9IHNldC5tYXAoZnVuY3Rpb24oY29tcCkge1xuICAgIHJldHVybiBuZXcgQ29tcGFyYXRvcihjb21wLCBsb29zZSk7XG4gIH0pO1xuXG4gIHJldHVybiBzZXQ7XG59O1xuXG4vLyBNb3N0bHkganVzdCBmb3IgdGVzdGluZyBhbmQgbGVnYWN5IEFQSSByZWFzb25zXG5leHBvcnRzLnRvQ29tcGFyYXRvcnMgPSB0b0NvbXBhcmF0b3JzO1xuZnVuY3Rpb24gdG9Db21wYXJhdG9ycyhyYW5nZSwgbG9vc2UpIHtcbiAgcmV0dXJuIG5ldyBSYW5nZShyYW5nZSwgbG9vc2UpLnNldC5tYXAoZnVuY3Rpb24oY29tcCkge1xuICAgIHJldHVybiBjb21wLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICByZXR1cm4gYy52YWx1ZTtcbiAgICB9KS5qb2luKCcgJykudHJpbSgpLnNwbGl0KCcgJyk7XG4gIH0pO1xufVxuXG4vLyBjb21wcmlzZWQgb2YgeHJhbmdlcywgdGlsZGVzLCBzdGFycywgYW5kIGd0bHQncyBhdCB0aGlzIHBvaW50LlxuLy8gYWxyZWFkeSByZXBsYWNlZCB0aGUgaHlwaGVuIHJhbmdlc1xuLy8gdHVybiBpbnRvIGEgc2V0IG9mIEpVU1QgY29tcGFyYXRvcnMuXG5mdW5jdGlvbiBwYXJzZUNvbXBhcmF0b3IoY29tcCwgbG9vc2UpIHtcbiAgZGVidWcoJ2NvbXAnLCBjb21wKTtcbiAgY29tcCA9IHJlcGxhY2VDYXJldHMoY29tcCwgbG9vc2UpO1xuICBkZWJ1ZygnY2FyZXQnLCBjb21wKTtcbiAgY29tcCA9IHJlcGxhY2VUaWxkZXMoY29tcCwgbG9vc2UpO1xuICBkZWJ1ZygndGlsZGVzJywgY29tcCk7XG4gIGNvbXAgPSByZXBsYWNlWFJhbmdlcyhjb21wLCBsb29zZSk7XG4gIGRlYnVnKCd4cmFuZ2UnLCBjb21wKTtcbiAgY29tcCA9IHJlcGxhY2VTdGFycyhjb21wLCBsb29zZSk7XG4gIGRlYnVnKCdzdGFycycsIGNvbXApO1xuICByZXR1cm4gY29tcDtcbn1cblxuZnVuY3Rpb24gaXNYKGlkKSB7XG4gIHJldHVybiAhaWQgfHwgaWQudG9Mb3dlckNhc2UoKSA9PT0gJ3gnIHx8IGlkID09PSAnKic7XG59XG5cbi8vIH4sIH4+IC0tPiAqIChhbnksIGtpbmRhIHNpbGx5KVxuLy8gfjIsIH4yLngsIH4yLngueCwgfj4yLCB+PjIueCB+PjIueC54IC0tPiA+PTIuMC4wIDwzLjAuMFxuLy8gfjIuMCwgfjIuMC54LCB+PjIuMCwgfj4yLjAueCAtLT4gPj0yLjAuMCA8Mi4xLjBcbi8vIH4xLjIsIH4xLjIueCwgfj4xLjIsIH4+MS4yLnggLS0+ID49MS4yLjAgPDEuMy4wXG4vLyB+MS4yLjMsIH4+MS4yLjMgLS0+ID49MS4yLjMgPDEuMy4wXG4vLyB+MS4yLjAsIH4+MS4yLjAgLS0+ID49MS4yLjAgPDEuMy4wXG5mdW5jdGlvbiByZXBsYWNlVGlsZGVzKGNvbXAsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wLnRyaW0oKS5zcGxpdCgvXFxzKy8pLm1hcChmdW5jdGlvbihjb21wKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VUaWxkZShjb21wLCBsb29zZSk7XG4gIH0pLmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZVRpbGRlKGNvbXAsIGxvb3NlKSB7XG4gIHZhciByID0gbG9vc2UgPyByZVtUSUxERUxPT1NFXSA6IHJlW1RJTERFXTtcbiAgcmV0dXJuIGNvbXAucmVwbGFjZShyLCBmdW5jdGlvbihfLCBNLCBtLCBwLCBwcikge1xuICAgIGRlYnVnKCd0aWxkZScsIGNvbXAsIF8sIE0sIG0sIHAsIHByKTtcbiAgICB2YXIgcmV0O1xuXG4gICAgaWYgKGlzWChNKSlcbiAgICAgIHJldCA9ICcnO1xuICAgIGVsc2UgaWYgKGlzWChtKSlcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4wLjAgPCcgKyAoK00gKyAxKSArICcuMC4wJztcbiAgICBlbHNlIGlmIChpc1gocCkpXG4gICAgICAvLyB+MS4yID09ID49MS4yLjAtIDwxLjMuMC1cbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuMCA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCc7XG4gICAgZWxzZSBpZiAocHIpIHtcbiAgICAgIGRlYnVnKCdyZXBsYWNlVGlsZGUgcHInLCBwcik7XG4gICAgICBpZiAocHIuY2hhckF0KDApICE9PSAnLScpXG4gICAgICAgIHByID0gJy0nICsgcHI7XG4gICAgICByZXQgPSAnPj0nICsgTSArICcuJyArIG0gKyAnLicgKyBwICsgcHIgK1xuICAgICAgICAgICAgJyA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCc7XG4gICAgfSBlbHNlXG4gICAgICAvLyB+MS4yLjMgPT0gPj0xLjIuMyA8MS4zLjBcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuJyArIHAgK1xuICAgICAgICAgICAgJyA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCc7XG5cbiAgICBkZWJ1ZygndGlsZGUgcmV0dXJuJywgcmV0KTtcbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cblxuLy8gXiAtLT4gKiAoYW55LCBraW5kYSBzaWxseSlcbi8vIF4yLCBeMi54LCBeMi54LnggLS0+ID49Mi4wLjAgPDMuMC4wXG4vLyBeMi4wLCBeMi4wLnggLS0+ID49Mi4wLjAgPDMuMC4wXG4vLyBeMS4yLCBeMS4yLnggLS0+ID49MS4yLjAgPDIuMC4wXG4vLyBeMS4yLjMgLS0+ID49MS4yLjMgPDIuMC4wXG4vLyBeMS4yLjAgLS0+ID49MS4yLjAgPDIuMC4wXG5mdW5jdGlvbiByZXBsYWNlQ2FyZXRzKGNvbXAsIGxvb3NlKSB7XG4gIHJldHVybiBjb21wLnRyaW0oKS5zcGxpdCgvXFxzKy8pLm1hcChmdW5jdGlvbihjb21wKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VDYXJldChjb21wLCBsb29zZSk7XG4gIH0pLmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUNhcmV0KGNvbXAsIGxvb3NlKSB7XG4gIGRlYnVnKCdjYXJldCcsIGNvbXAsIGxvb3NlKTtcbiAgdmFyIHIgPSBsb29zZSA/IHJlW0NBUkVUTE9PU0VdIDogcmVbQ0FSRVRdO1xuICByZXR1cm4gY29tcC5yZXBsYWNlKHIsIGZ1bmN0aW9uKF8sIE0sIG0sIHAsIHByKSB7XG4gICAgZGVidWcoJ2NhcmV0JywgY29tcCwgXywgTSwgbSwgcCwgcHIpO1xuICAgIHZhciByZXQ7XG5cbiAgICBpZiAoaXNYKE0pKVxuICAgICAgcmV0ID0gJyc7XG4gICAgZWxzZSBpZiAoaXNYKG0pKVxuICAgICAgcmV0ID0gJz49JyArIE0gKyAnLjAuMCA8JyArICgrTSArIDEpICsgJy4wLjAnO1xuICAgIGVsc2UgaWYgKGlzWChwKSkge1xuICAgICAgaWYgKE0gPT09ICcwJylcbiAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4wIDwnICsgTSArICcuJyArICgrbSArIDEpICsgJy4wJztcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4wIDwnICsgKCtNICsgMSkgKyAnLjAuMCc7XG4gICAgfSBlbHNlIGlmIChwcikge1xuICAgICAgZGVidWcoJ3JlcGxhY2VDYXJldCBwcicsIHByKTtcbiAgICAgIGlmIChwci5jaGFyQXQoMCkgIT09ICctJylcbiAgICAgICAgcHIgPSAnLScgKyBwcjtcbiAgICAgIGlmIChNID09PSAnMCcpIHtcbiAgICAgICAgaWYgKG0gPT09ICcwJylcbiAgICAgICAgICByZXQgPSAnPj0nICsgTSArICcuJyArIG0gKyAnLicgKyBwICsgcHIgK1xuICAgICAgICAgICAgICAgICcgPCcgKyBNICsgJy4nICsgbSArICcuJyArICgrcCArIDEpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArIHByICtcbiAgICAgICAgICAgICAgICAnIDwnICsgTSArICcuJyArICgrbSArIDEpICsgJy4wJztcbiAgICAgIH0gZWxzZVxuICAgICAgICByZXQgPSAnPj0nICsgTSArICcuJyArIG0gKyAnLicgKyBwICsgcHIgK1xuICAgICAgICAgICAgICAnIDwnICsgKCtNICsgMSkgKyAnLjAuMCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnKCdubyBwcicpO1xuICAgICAgaWYgKE0gPT09ICcwJykge1xuICAgICAgICBpZiAobSA9PT0gJzAnKVxuICAgICAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuJyArIHAgK1xuICAgICAgICAgICAgICAgICcgPCcgKyBNICsgJy4nICsgbSArICcuJyArICgrcCArIDEpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArXG4gICAgICAgICAgICAgICAgJyA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCc7XG4gICAgICB9IGVsc2VcbiAgICAgICAgcmV0ID0gJz49JyArIE0gKyAnLicgKyBtICsgJy4nICsgcCArXG4gICAgICAgICAgICAgICcgPCcgKyAoK00gKyAxKSArICcuMC4wJztcbiAgICB9XG5cbiAgICBkZWJ1ZygnY2FyZXQgcmV0dXJuJywgcmV0KTtcbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZVhSYW5nZXMoY29tcCwgbG9vc2UpIHtcbiAgZGVidWcoJ3JlcGxhY2VYUmFuZ2VzJywgY29tcCwgbG9vc2UpO1xuICByZXR1cm4gY29tcC5zcGxpdCgvXFxzKy8pLm1hcChmdW5jdGlvbihjb21wKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VYUmFuZ2UoY29tcCwgbG9vc2UpO1xuICB9KS5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VYUmFuZ2UoY29tcCwgbG9vc2UpIHtcbiAgY29tcCA9IGNvbXAudHJpbSgpO1xuICB2YXIgciA9IGxvb3NlID8gcmVbWFJBTkdFTE9PU0VdIDogcmVbWFJBTkdFXTtcbiAgcmV0dXJuIGNvbXAucmVwbGFjZShyLCBmdW5jdGlvbihyZXQsIGd0bHQsIE0sIG0sIHAsIHByKSB7XG4gICAgZGVidWcoJ3hSYW5nZScsIGNvbXAsIHJldCwgZ3RsdCwgTSwgbSwgcCwgcHIpO1xuICAgIHZhciB4TSA9IGlzWChNKTtcbiAgICB2YXIgeG0gPSB4TSB8fCBpc1gobSk7XG4gICAgdmFyIHhwID0geG0gfHwgaXNYKHApO1xuICAgIHZhciBhbnlYID0geHA7XG5cbiAgICBpZiAoZ3RsdCA9PT0gJz0nICYmIGFueVgpXG4gICAgICBndGx0ID0gJyc7XG5cbiAgICBpZiAoeE0pIHtcbiAgICAgIGlmIChndGx0ID09PSAnPicgfHwgZ3RsdCA9PT0gJzwnKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaXMgYWxsb3dlZFxuICAgICAgICByZXQgPSAnPDAuMC4wJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaXMgZm9yYmlkZGVuXG4gICAgICAgIHJldCA9ICcqJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGd0bHQgJiYgYW55WCkge1xuICAgICAgLy8gcmVwbGFjZSBYIHdpdGggMFxuICAgICAgaWYgKHhtKVxuICAgICAgICBtID0gMDtcbiAgICAgIGlmICh4cClcbiAgICAgICAgcCA9IDA7XG5cbiAgICAgIGlmIChndGx0ID09PSAnPicpIHtcbiAgICAgICAgLy8gPjEgPT4gPj0yLjAuMFxuICAgICAgICAvLyA+MS4yID0+ID49MS4zLjBcbiAgICAgICAgLy8gPjEuMi4zID0+ID49IDEuMi40XG4gICAgICAgIGd0bHQgPSAnPj0nO1xuICAgICAgICBpZiAoeG0pIHtcbiAgICAgICAgICBNID0gK00gKyAxO1xuICAgICAgICAgIG0gPSAwO1xuICAgICAgICAgIHAgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHhwKSB7XG4gICAgICAgICAgbSA9ICttICsgMTtcbiAgICAgICAgICBwID0gMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChndGx0ID09PSAnPD0nKSB7XG4gICAgICAgIC8vIDw9MC43LnggaXMgYWN0dWFsbHkgPDAuOC4wLCBzaW5jZSBhbnkgMC43Lnggc2hvdWxkXG4gICAgICAgIC8vIHBhc3MuICBTaW1pbGFybHksIDw9Ny54IGlzIGFjdHVhbGx5IDw4LjAuMCwgZXRjLlxuICAgICAgICBndGx0ID0gJzwnXG4gICAgICAgIGlmICh4bSlcbiAgICAgICAgICBNID0gK00gKyAxXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBtID0gK20gKyAxXG4gICAgICB9XG5cbiAgICAgIHJldCA9IGd0bHQgKyBNICsgJy4nICsgbSArICcuJyArIHA7XG4gICAgfSBlbHNlIGlmICh4bSkge1xuICAgICAgcmV0ID0gJz49JyArIE0gKyAnLjAuMCA8JyArICgrTSArIDEpICsgJy4wLjAnO1xuICAgIH0gZWxzZSBpZiAoeHApIHtcbiAgICAgIHJldCA9ICc+PScgKyBNICsgJy4nICsgbSArICcuMCA8JyArIE0gKyAnLicgKyAoK20gKyAxKSArICcuMCc7XG4gICAgfVxuXG4gICAgZGVidWcoJ3hSYW5nZSByZXR1cm4nLCByZXQpO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG59XG5cbi8vIEJlY2F1c2UgKiBpcyBBTkQtZWQgd2l0aCBldmVyeXRoaW5nIGVsc2UgaW4gdGhlIGNvbXBhcmF0b3IsXG4vLyBhbmQgJycgbWVhbnMgXCJhbnkgdmVyc2lvblwiLCBqdXN0IHJlbW92ZSB0aGUgKnMgZW50aXJlbHkuXG5mdW5jdGlvbiByZXBsYWNlU3RhcnMoY29tcCwgbG9vc2UpIHtcbiAgZGVidWcoJ3JlcGxhY2VTdGFycycsIGNvbXAsIGxvb3NlKTtcbiAgLy8gTG9vc2VuZXNzIGlzIGlnbm9yZWQgaGVyZS4gIHN0YXIgaXMgYWx3YXlzIGFzIGxvb3NlIGFzIGl0IGdldHMhXG4gIHJldHVybiBjb21wLnRyaW0oKS5yZXBsYWNlKHJlW1NUQVJdLCAnJyk7XG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgcGFzc2VkIHRvIHN0cmluZy5yZXBsYWNlKHJlW0hZUEhFTlJBTkdFXSlcbi8vIE0sIG0sIHBhdGNoLCBwcmVyZWxlYXNlLCBidWlsZFxuLy8gMS4yIC0gMy40LjUgPT4gPj0xLjIuMCA8PTMuNC41XG4vLyAxLjIuMyAtIDMuNCA9PiA+PTEuMi4wIDwzLjUuMCBBbnkgMy40Lnggd2lsbCBkb1xuLy8gMS4yIC0gMy40ID0+ID49MS4yLjAgPDMuNS4wXG5mdW5jdGlvbiBoeXBoZW5SZXBsYWNlKCQwLFxuICAgICAgICAgICAgICAgICAgICAgICBmcm9tLCBmTSwgZm0sIGZwLCBmcHIsIGZiLFxuICAgICAgICAgICAgICAgICAgICAgICB0bywgdE0sIHRtLCB0cCwgdHByLCB0Yikge1xuXG4gIGlmIChpc1goZk0pKVxuICAgIGZyb20gPSAnJztcbiAgZWxzZSBpZiAoaXNYKGZtKSlcbiAgICBmcm9tID0gJz49JyArIGZNICsgJy4wLjAnO1xuICBlbHNlIGlmIChpc1goZnApKVxuICAgIGZyb20gPSAnPj0nICsgZk0gKyAnLicgKyBmbSArICcuMCc7XG4gIGVsc2VcbiAgICBmcm9tID0gJz49JyArIGZyb207XG5cbiAgaWYgKGlzWCh0TSkpXG4gICAgdG8gPSAnJztcbiAgZWxzZSBpZiAoaXNYKHRtKSlcbiAgICB0byA9ICc8JyArICgrdE0gKyAxKSArICcuMC4wJztcbiAgZWxzZSBpZiAoaXNYKHRwKSlcbiAgICB0byA9ICc8JyArIHRNICsgJy4nICsgKCt0bSArIDEpICsgJy4wJztcbiAgZWxzZSBpZiAodHByKVxuICAgIHRvID0gJzw9JyArIHRNICsgJy4nICsgdG0gKyAnLicgKyB0cCArICctJyArIHRwcjtcbiAgZWxzZVxuICAgIHRvID0gJzw9JyArIHRvO1xuXG4gIHJldHVybiAoZnJvbSArICcgJyArIHRvKS50cmltKCk7XG59XG5cblxuLy8gaWYgQU5ZIG9mIHRoZSBzZXRzIG1hdGNoIEFMTCBvZiBpdHMgY29tcGFyYXRvcnMsIHRoZW4gcGFzc1xuUmFuZ2UucHJvdG90eXBlLnRlc3QgPSBmdW5jdGlvbih2ZXJzaW9uKSB7XG4gIGlmICghdmVyc2lvbilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiB2ZXJzaW9uID09PSAnc3RyaW5nJylcbiAgICB2ZXJzaW9uID0gbmV3IFNlbVZlcih2ZXJzaW9uLCB0aGlzLmxvb3NlKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRlc3RTZXQodGhpcy5zZXRbaV0sIHZlcnNpb24pKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZnVuY3Rpb24gdGVzdFNldChzZXQsIHZlcnNpb24pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIXNldFtpXS50ZXN0KHZlcnNpb24pKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHZlcnNpb24ucHJlcmVsZWFzZS5sZW5ndGgpIHtcbiAgICAvLyBGaW5kIHRoZSBzZXQgb2YgdmVyc2lvbnMgdGhhdCBhcmUgYWxsb3dlZCB0byBoYXZlIHByZXJlbGVhc2VzXG4gICAgLy8gRm9yIGV4YW1wbGUsIF4xLjIuMy1wci4xIGRlc3VnYXJzIHRvID49MS4yLjMtcHIuMSA8Mi4wLjBcbiAgICAvLyBUaGF0IHNob3VsZCBhbGxvdyBgMS4yLjMtcHIuMmAgdG8gcGFzcy5cbiAgICAvLyBIb3dldmVyLCBgMS4yLjQtYWxwaGEubm90cmVhZHlgIHNob3VsZCBOT1QgYmUgYWxsb3dlZCxcbiAgICAvLyBldmVuIHRob3VnaCBpdCdzIHdpdGhpbiB0aGUgcmFuZ2Ugc2V0IGJ5IHRoZSBjb21wYXJhdG9ycy5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNldC5sZW5ndGg7IGkrKykge1xuICAgICAgZGVidWcoc2V0W2ldLnNlbXZlcik7XG4gICAgICBpZiAoc2V0W2ldLnNlbXZlciA9PT0gQU5ZKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgaWYgKHNldFtpXS5zZW12ZXIucHJlcmVsZWFzZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBhbGxvd2VkID0gc2V0W2ldLnNlbXZlcjtcbiAgICAgICAgaWYgKGFsbG93ZWQubWFqb3IgPT09IHZlcnNpb24ubWFqb3IgJiZcbiAgICAgICAgICAgIGFsbG93ZWQubWlub3IgPT09IHZlcnNpb24ubWlub3IgJiZcbiAgICAgICAgICAgIGFsbG93ZWQucGF0Y2ggPT09IHZlcnNpb24ucGF0Y2gpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmVyc2lvbiBoYXMgYSAtcHJlLCBidXQgaXQncyBub3Qgb25lIG9mIHRoZSBvbmVzIHdlIGxpa2UuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydHMuc2F0aXNmaWVzID0gc2F0aXNmaWVzO1xuZnVuY3Rpb24gc2F0aXNmaWVzKHZlcnNpb24sIHJhbmdlLCBsb29zZSkge1xuICB0cnkge1xuICAgIHJhbmdlID0gbmV3IFJhbmdlKHJhbmdlLCBsb29zZSk7XG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiByYW5nZS50ZXN0KHZlcnNpb24pO1xufVxuXG5leHBvcnRzLm1heFNhdGlzZnlpbmcgPSBtYXhTYXRpc2Z5aW5nO1xuZnVuY3Rpb24gbWF4U2F0aXNmeWluZyh2ZXJzaW9ucywgcmFuZ2UsIGxvb3NlKSB7XG4gIHJldHVybiB2ZXJzaW9ucy5maWx0ZXIoZnVuY3Rpb24odmVyc2lvbikge1xuICAgIHJldHVybiBzYXRpc2ZpZXModmVyc2lvbiwgcmFuZ2UsIGxvb3NlKTtcbiAgfSkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIHJjb21wYXJlKGEsIGIsIGxvb3NlKTtcbiAgfSlbMF0gfHwgbnVsbDtcbn1cblxuZXhwb3J0cy52YWxpZFJhbmdlID0gdmFsaWRSYW5nZTtcbmZ1bmN0aW9uIHZhbGlkUmFuZ2UocmFuZ2UsIGxvb3NlKSB7XG4gIHRyeSB7XG4gICAgLy8gUmV0dXJuICcqJyBpbnN0ZWFkIG9mICcnIHNvIHRoYXQgdHJ1dGhpbmVzcyB3b3Jrcy5cbiAgICAvLyBUaGlzIHdpbGwgdGhyb3cgaWYgaXQncyBpbnZhbGlkIGFueXdheVxuICAgIHJldHVybiBuZXcgUmFuZ2UocmFuZ2UsIGxvb3NlKS5yYW5nZSB8fCAnKic7XG4gIH0gY2F0Y2ggKGVyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLy8gRGV0ZXJtaW5lIGlmIHZlcnNpb24gaXMgbGVzcyB0aGFuIGFsbCB0aGUgdmVyc2lvbnMgcG9zc2libGUgaW4gdGhlIHJhbmdlXG5leHBvcnRzLmx0ciA9IGx0cjtcbmZ1bmN0aW9uIGx0cih2ZXJzaW9uLCByYW5nZSwgbG9vc2UpIHtcbiAgcmV0dXJuIG91dHNpZGUodmVyc2lvbiwgcmFuZ2UsICc8JywgbG9vc2UpO1xufVxuXG4vLyBEZXRlcm1pbmUgaWYgdmVyc2lvbiBpcyBncmVhdGVyIHRoYW4gYWxsIHRoZSB2ZXJzaW9ucyBwb3NzaWJsZSBpbiB0aGUgcmFuZ2UuXG5leHBvcnRzLmd0ciA9IGd0cjtcbmZ1bmN0aW9uIGd0cih2ZXJzaW9uLCByYW5nZSwgbG9vc2UpIHtcbiAgcmV0dXJuIG91dHNpZGUodmVyc2lvbiwgcmFuZ2UsICc+JywgbG9vc2UpO1xufVxuXG5leHBvcnRzLm91dHNpZGUgPSBvdXRzaWRlO1xuZnVuY3Rpb24gb3V0c2lkZSh2ZXJzaW9uLCByYW5nZSwgaGlsbywgbG9vc2UpIHtcbiAgdmVyc2lvbiA9IG5ldyBTZW1WZXIodmVyc2lvbiwgbG9vc2UpO1xuICByYW5nZSA9IG5ldyBSYW5nZShyYW5nZSwgbG9vc2UpO1xuXG4gIHZhciBndGZuLCBsdGVmbiwgbHRmbiwgY29tcCwgZWNvbXA7XG4gIHN3aXRjaCAoaGlsbykge1xuICAgIGNhc2UgJz4nOlxuICAgICAgZ3RmbiA9IGd0O1xuICAgICAgbHRlZm4gPSBsdGU7XG4gICAgICBsdGZuID0gbHQ7XG4gICAgICBjb21wID0gJz4nO1xuICAgICAgZWNvbXAgPSAnPj0nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnPCc6XG4gICAgICBndGZuID0gbHQ7XG4gICAgICBsdGVmbiA9IGd0ZTtcbiAgICAgIGx0Zm4gPSBndDtcbiAgICAgIGNvbXAgPSAnPCc7XG4gICAgICBlY29tcCA9ICc8PSc7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTXVzdCBwcm92aWRlIGEgaGlsbyB2YWwgb2YgXCI8XCIgb3IgXCI+XCInKTtcbiAgfVxuXG4gIC8vIElmIGl0IHNhdGlzaWZlcyB0aGUgcmFuZ2UgaXQgaXMgbm90IG91dHNpZGVcbiAgaWYgKHNhdGlzZmllcyh2ZXJzaW9uLCByYW5nZSwgbG9vc2UpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRnJvbSBub3cgb24sIHZhcmlhYmxlIHRlcm1zIGFyZSBhcyBpZiB3ZSdyZSBpbiBcImd0clwiIG1vZGUuXG4gIC8vIGJ1dCBub3RlIHRoYXQgZXZlcnl0aGluZyBpcyBmbGlwcGVkIGZvciB0aGUgXCJsdHJcIiBmdW5jdGlvbi5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlLnNldC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBjb21wYXJhdG9ycyA9IHJhbmdlLnNldFtpXTtcblxuICAgIHZhciBoaWdoID0gbnVsbDtcbiAgICB2YXIgbG93ID0gbnVsbDtcblxuICAgIGNvbXBhcmF0b3JzLmZvckVhY2goZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICAgICAgaWYgKGNvbXBhcmF0b3Iuc2VtdmVyID09PSBBTlkpIHtcbiAgICAgICAgY29tcGFyYXRvciA9IG5ldyBDb21wYXJhdG9yKCc+PTAuMC4wJylcbiAgICAgIH1cbiAgICAgIGhpZ2ggPSBoaWdoIHx8IGNvbXBhcmF0b3I7XG4gICAgICBsb3cgPSBsb3cgfHwgY29tcGFyYXRvcjtcbiAgICAgIGlmIChndGZuKGNvbXBhcmF0b3Iuc2VtdmVyLCBoaWdoLnNlbXZlciwgbG9vc2UpKSB7XG4gICAgICAgIGhpZ2ggPSBjb21wYXJhdG9yO1xuICAgICAgfSBlbHNlIGlmIChsdGZuKGNvbXBhcmF0b3Iuc2VtdmVyLCBsb3cuc2VtdmVyLCBsb29zZSkpIHtcbiAgICAgICAgbG93ID0gY29tcGFyYXRvcjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIElmIHRoZSBlZGdlIHZlcnNpb24gY29tcGFyYXRvciBoYXMgYSBvcGVyYXRvciB0aGVuIG91ciB2ZXJzaW9uXG4gICAgLy8gaXNuJ3Qgb3V0c2lkZSBpdFxuICAgIGlmIChoaWdoLm9wZXJhdG9yID09PSBjb21wIHx8IGhpZ2gub3BlcmF0b3IgPT09IGVjb21wKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGxvd2VzdCB2ZXJzaW9uIGNvbXBhcmF0b3IgaGFzIGFuIG9wZXJhdG9yIGFuZCBvdXIgdmVyc2lvblxuICAgIC8vIGlzIGxlc3MgdGhhbiBpdCB0aGVuIGl0IGlzbid0IGhpZ2hlciB0aGFuIHRoZSByYW5nZVxuICAgIGlmICgoIWxvdy5vcGVyYXRvciB8fCBsb3cub3BlcmF0b3IgPT09IGNvbXApICYmXG4gICAgICAgIGx0ZWZuKHZlcnNpb24sIGxvdy5zZW12ZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChsb3cub3BlcmF0b3IgPT09IGVjb21wICYmIGx0Zm4odmVyc2lvbiwgbG93LnNlbXZlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vc2VtdmVyL3NlbXZlci5qc1xuICoqLyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3Byb2Nlc3MvYnJvd3Nlci5qc1xuICoqLyIsIi8qKlxuICogQGZpbGVPdmVydmlld1xuICogVmlld01vZGVsIENvbnN0cnVjdG9yICYgZGVmaW5pdGlvblxuICovXG5cbmltcG9ydCB7ZXh0ZW5kLCB0b0FycmF5fSBmcm9tICcuLi91dGlsJ1xuXG5pbXBvcnQgKiBhcyBzY29wZSBmcm9tICcuL2luc3RhbmNlL3Njb3BlJ1xuaW1wb3J0ICogYXMgY29tcGlsZXIgZnJvbSAnLi9jb21waWxlcidcbmltcG9ydCAqIGFzIGRpcmVjdGl2ZSBmcm9tICcuL2RpcmVjdGl2ZSdcbmltcG9ydCAqIGFzIGRvbUhlbHBlciBmcm9tICcuL2RvbS1oZWxwZXInXG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnLi9ldmVudHMnXG4vLyBpbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vLi4vYXBpL21vZHVsZXMnXG4vLyBpbXBvcnQgKiBhcyBhcGkgZnJvbSAnLi8uLi9hcGkvYXBpJ1xuXG5pbXBvcnQge3JlZ2lzdGVyTW9kdWxlcywgcmVnaXN0ZXJNZXRob2RzfSBmcm9tICcuLi9hcHAvcmVnaXN0ZXInXG5cbmZ1bmN0aW9uIGNhbGxPbGRSZWFkeUVudHJ5KHZtLCBjb21wb25lbnQpIHtcbiAgaWYgKGNvbXBvbmVudC5tZXRob2RzICYmXG4gICAgICBjb21wb25lbnQubWV0aG9kcy5yZWFkeSkge1xuICAgIGNvbXBvbmVudC5tZXRob2RzLnJlYWR5LmNhbGwodm0pXG4gIH1cbn1cblxuLyoqXG4gKiBWaWV3TW9kZWwgY29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHBhcmVudFZtICAgd2hpY2ggY29udGFpbnMgX2FwcFxuICogQHBhcmFtIHtvYmplY3R9IHBhcmVudEVsICAgcm9vdCBlbGVtZW50IG9yIGZyYWcgYmxvY2tcbiAqIEBwYXJhbSB7b2JqZWN0fSBtZXJnZWREYXRhIGV4dGVybmFsIGRhdGFcbiAqIEBwYXJhbSB7b2JqZWN0fSBleHRlcm5hbEV2ZW50cyBleHRlcm5hbCBldmVudHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVm0oXG4gIHR5cGUsXG4gIHBhcmVudFZtLFxuICBwYXJlbnRFbCxcbiAgbWVyZ2VkRGF0YSxcbiAgZXh0ZXJuYWxFdmVudHNcbikge1xuICB0aGlzLl9wYXJlbnQgPSBwYXJlbnRWbS5fcmVhbFBhcmVudCA/IHBhcmVudFZtLl9yZWFsUGFyZW50IDogcGFyZW50Vm1cbiAgdGhpcy5fYXBwID0gcGFyZW50Vm0uX2FwcFxuICBwYXJlbnRWbS5fY2hpbGRyZW5WbXMgJiYgcGFyZW50Vm0uX2NoaWxkcmVuVm1zLnB1c2godGhpcylcblxuICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9hcHAuY3VzdG9tQ29tcG9uZW50TWFwW3R5cGVdIHx8IHt9XG4gIGNvbnN0IGRhdGEgPSBjb21wb25lbnQuZGF0YSB8fCB7fVxuXG4gIHRoaXMuX29wdGlvbnMgPSBjb21wb25lbnRcbiAgdGhpcy5fbWV0aG9kcyA9IGNvbXBvbmVudC5tZXRob2RzIHx8IHt9XG4gIHRoaXMuX2NvbXB1dGVkID0gY29tcG9uZW50LmNvbXB1dGVkIHx8IHt9XG4gIHRoaXMuX2NzcyA9IGNvbXBvbmVudC5zdHlsZSB8fCB7fVxuICB0aGlzLl9pZHMgPSB7fVxuICB0aGlzLl93YXRjaGVycyA9IFtdXG4gIHRoaXMuX3ZtRXZlbnRzID0ge31cbiAgdGhpcy5fY2hpbGRyZW5WbXMgPSBbXVxuICB0aGlzLl90eXBlID0gdHlwZVxuXG4gIC8vIGJpbmQgZXZlbnRzIGFuZCBsaWZlY3ljbGVzXG4gIHRoaXMuX2luaXRFdmVudHMoZXh0ZXJuYWxFdmVudHMpXG5cbiAgdGhpcy4kZW1pdCgnaG9vazppbml0JylcbiAgdGhpcy5faW5pdGVkID0gdHJ1ZVxuICAvLyBwcm94eSBkYXRhIGFuZCBtZXRob2RzXG4gIC8vIG9ic2VydmUgZGF0YSBhbmQgYWRkIHRoaXMgdG8gdm1zXG4gIHRoaXMuX2RhdGEgPSB0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJyA/IGRhdGEoKSA6IGRhdGFcbiAgaWYgKG1lcmdlZERhdGEpIHtcbiAgICBleHRlbmQodGhpcy5fZGF0YSwgbWVyZ2VkRGF0YSlcbiAgfVxuICB0aGlzLl9pbml0U2NvcGUoKVxuXG4gIHRoaXMuJGVtaXQoJ2hvb2s6Y3JlYXRlZCcpXG4gIHRoaXMuX2NyZWF0ZWQgPSB0cnVlXG4gIC8vIGJhY2t3YXJkIG9sZCByZWFkeSBlbnRyeVxuICBjYWxsT2xkUmVhZHlFbnRyeSh0aGlzLCBjb21wb25lbnQpXG5cbiAgLy8gaWYgbm8gcGFyZW50RWxlbWVudCB0aGVuIHNwZWNpZnkgdGhlIGRvY3VtZW50RWxlbWVudFxuICB0aGlzLl9wYXJlbnRFbCA9IHBhcmVudEVsIHx8IHRoaXMuX2FwcC5kb2MuZG9jdW1lbnRFbGVtZW50XG4gIHRoaXMuX2J1aWxkKClcbn1cblxuZXh0ZW5kKFZtLnByb3RvdHlwZSwgc2NvcGUsIGNvbXBpbGVyLCBkaXJlY3RpdmUsIGRvbUhlbHBlciwgZXZlbnRzKVxuZXh0ZW5kKFZtLCB7XG4gIHJlZ2lzdGVyTW9kdWxlcyxcbiAgcmVnaXN0ZXJNZXRob2RzXG59KVxuLy8gVm0ucmVnaXN0ZXJNb2R1bGVzKG1vZHVsZXMpXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi92bS9pbmRleC5qc1xuICoqLyIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgT2JzZXJ2ZXIgPSByZXF1aXJlKCcuLi9vYnNlcnZlcicpXG52YXIgRGVwID0gcmVxdWlyZSgnLi4vb2JzZXJ2ZXIvZGVwJylcblxuLyoqXG4gKiBTZXR1cCB0aGUgc2NvcGUgb2YgYW4gaW5zdGFuY2UsIHdoaWNoIGNvbnRhaW5zOlxuICogLSBvYnNlcnZlZCBkYXRhXG4gKiAtIGNvbXB1dGVkIHByb3BlcnRpZXNcbiAqIC0gdXNlciBtZXRob2RzXG4gKiAtIG1ldGEgcHJvcGVydGllc1xuICovXG5cbmV4cG9ydHMuX2luaXRTY29wZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5faW5pdERhdGEoKVxuICB0aGlzLl9pbml0Q29tcHV0ZWQoKVxuICB0aGlzLl9pbml0TWV0aG9kcygpXG4gIC8vIHRoaXMuX2luaXRNZXRhKClcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBkYXRhLiBcbiAqL1xuXG5leHBvcnRzLl9pbml0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gcHJveHkgZGF0YSBvbiBpbnN0YW5jZVxuICB2YXIgZGF0YSA9IHRoaXMuX2RhdGFcbiAgdmFyIGksIGtleVxuICAvLyAvLyBtYWtlIHN1cmUgYWxsIHByb3BzIHByb3BlcnRpZXMgYXJlIG9ic2VydmVkXG4gIC8vIHZhciBwcm9wcyA9IHRoaXMuJG9wdGlvbnMucHJvcHNcbiAgLy8gaWYgKHByb3BzKSB7XG4gIC8vICAgaSA9IHByb3BzLmxlbmd0aFxuICAvLyAgIHdoaWxlIChpLS0pIHtcbiAgLy8gICAgIGtleSA9IF8uY2FtZWxpemUocHJvcHNbaV0pXG4gIC8vICAgICBpZiAoIShrZXkgaW4gZGF0YSkpIHtcbiAgLy8gICAgICAgZGF0YVtrZXldID0gbnVsbFxuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpXG4gIGkgPSBrZXlzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIGlmICghXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIHRoaXMuX3Byb3h5KGtleSlcbiAgICB9XG4gIH1cbiAgLy8gb2JzZXJ2ZSBkYXRhXG4gIE9ic2VydmVyLmNyZWF0ZShkYXRhKS5hZGRWbSh0aGlzKVxufVxuXG4vLyAvKipcbi8vICAqIFN3YXAgdGhlIGlzbnRhbmNlJ3MgJGRhdGEuIENhbGxlZCBpbiAkZGF0YSdzIHNldHRlci5cbi8vICAqXG4vLyAgKiBAcGFyYW0ge09iamVjdH0gbmV3RGF0YVxuLy8gICovXG5cbi8vIGV4cG9ydHMuX3NldERhdGEgPSBmdW5jdGlvbiAobmV3RGF0YSkge1xuLy8gICBuZXdEYXRhID0gbmV3RGF0YSB8fCB7fVxuLy8gICB2YXIgb2xkRGF0YSA9IHRoaXMuX2RhdGFcbi8vICAgdGhpcy5fZGF0YSA9IG5ld0RhdGFcbi8vICAgdmFyIGtleXMsIGtleSwgaVxuLy8gICAvLyB1bnByb3h5IGtleXMgbm90IHByZXNlbnQgaW4gbmV3IGRhdGFcbi8vICAga2V5cyA9IE9iamVjdC5rZXlzKG9sZERhdGEpXG4vLyAgIGkgPSBrZXlzLmxlbmd0aFxuLy8gICB3aGlsZSAoaS0tKSB7XG4vLyAgICAga2V5ID0ga2V5c1tpXVxuLy8gICAgIGlmICghXy5pc1Jlc2VydmVkKGtleSkgJiYgIShrZXkgaW4gbmV3RGF0YSkpIHtcbi8vICAgICAgIHRoaXMuX3VucHJveHkoa2V5KVxuLy8gICAgIH1cbi8vICAgfVxuLy8gICAvLyBwcm94eSBrZXlzIG5vdCBhbHJlYWR5IHByb3hpZWQsXG4vLyAgIC8vIGFuZCB0cmlnZ2VyIGNoYW5nZSBmb3IgY2hhbmdlZCB2YWx1ZXNcbi8vICAga2V5cyA9IE9iamVjdC5rZXlzKG5ld0RhdGEpXG4vLyAgIGkgPSBrZXlzLmxlbmd0aFxuLy8gICB3aGlsZSAoaS0tKSB7XG4vLyAgICAga2V5ID0ga2V5c1tpXVxuLy8gICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFfLmlzUmVzZXJ2ZWQoa2V5KSkge1xuLy8gICAgICAgLy8gbmV3IHByb3BlcnR5XG4vLyAgICAgICB0aGlzLl9wcm94eShrZXkpXG4vLyAgICAgfVxuLy8gICB9XG4vLyAgIG9sZERhdGEuX19vYl9fLnJlbW92ZVZtKHRoaXMpXG4vLyAgIE9ic2VydmVyLmNyZWF0ZShuZXdEYXRhKS5hZGRWbSh0aGlzKVxuLy8gICB0aGlzLl9kaWdlc3QoKVxuLy8gfVxuXG4vKipcbiAqIFByb3h5IGEgcHJvcGVydHksIHNvIHRoYXRcbiAqIHZtLnByb3AgPT09IHZtLl9kYXRhLnByb3BcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKi9cblxuZXhwb3J0cy5fcHJveHkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIC8vIG5lZWQgdG8gc3RvcmUgcmVmIHRvIHNlbGYgaGVyZVxuICAvLyBiZWNhdXNlIHRoZXNlIGdldHRlci9zZXR0ZXJzIG1pZ2h0XG4gIC8vIGJlIGNhbGxlZCBieSBjaGlsZCBpbnN0YW5jZXMhXG4gIHZhciBzZWxmID0gdGhpc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwga2V5LCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBwcm94eUdldHRlciAoKSB7XG4gICAgICByZXR1cm4gc2VsZi5fZGF0YVtrZXldXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHByb3h5U2V0dGVyICh2YWwpIHtcbiAgICAgIHNlbGYuX2RhdGFba2V5XSA9IHZhbFxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBVbnByb3h5IGEgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbmV4cG9ydHMuX3VucHJveHkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIGRlbGV0ZSB0aGlzW2tleV1cbn1cblxuLy8gLyoqXG4vLyAgKiBGb3JjZSB1cGRhdGUgb24gZXZlcnkgd2F0Y2hlciBpbiBzY29wZS5cbi8vICAqL1xuXG4vLyBleHBvcnRzLl9kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4vLyAgIHZhciBpID0gdGhpcy5fd2F0Y2hlcnMubGVuZ3RoXG4vLyAgIHdoaWxlIChpLS0pIHtcbi8vICAgICB0aGlzLl93YXRjaGVyc1tpXS51cGRhdGUoKVxuLy8gICB9XG4vLyAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuXG4vLyAgIGkgPSBjaGlsZHJlbi5sZW5ndGhcbi8vICAgd2hpbGUgKGktLSkge1xuLy8gICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG4vLyAgICAgaWYgKGNoaWxkLiRvcHRpb25zLmluaGVyaXQpIHtcbi8vICAgICAgIGNoaWxkLl9kaWdlc3QoKVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfVxuXG4vKipcbiAqIFNldHVwIGNvbXB1dGVkIHByb3BlcnRpZXMuIFRoZXkgYXJlIGVzc2VudGlhbGx5XG4gKiBzcGVjaWFsIGdldHRlci9zZXR0ZXJzXG4gKi9cblxuZnVuY3Rpb24gbm9vcCAoKSB7fVxuZXhwb3J0cy5faW5pdENvbXB1dGVkID0gZnVuY3Rpb24gKCkge1xuICAvLyB2YXIgY29tcHV0ZWQgPSB0aGlzLiRvcHRpb25zLmNvbXB1dGVkXG4gIHZhciBjb21wdXRlZCA9IHRoaXMuX2NvbXB1dGVkXG4gIGlmIChjb21wdXRlZCkge1xuICAgIGZvciAodmFyIGtleSBpbiBjb21wdXRlZCkge1xuICAgICAgdmFyIHVzZXJEZWYgPSBjb21wdXRlZFtrZXldXG4gICAgICB2YXIgZGVmID0ge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdXNlckRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkZWYuZ2V0ID0gXy5iaW5kKHVzZXJEZWYsIHRoaXMpXG4gICAgICAgIGRlZi5zZXQgPSBub29wXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWYuZ2V0ID0gdXNlckRlZi5nZXRcbiAgICAgICAgICA/IF8uYmluZCh1c2VyRGVmLmdldCwgdGhpcylcbiAgICAgICAgICA6IG5vb3BcbiAgICAgICAgZGVmLnNldCA9IHVzZXJEZWYuc2V0XG4gICAgICAgICAgPyBfLmJpbmQodXNlckRlZi5zZXQsIHRoaXMpXG4gICAgICAgICAgOiBub29wXG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBkZWYpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2V0dXAgaW5zdGFuY2UgbWV0aG9kcy4gTWV0aG9kcyBtdXN0IGJlIGJvdW5kIHRvIHRoZVxuICogaW5zdGFuY2Ugc2luY2UgdGhleSBtaWdodCBiZSBjYWxsZWQgYnkgY2hpbGRyZW5cbiAqIGluaGVyaXRpbmcgdGhlbS5cbiAqL1xuXG5leHBvcnRzLl9pbml0TWV0aG9kcyA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gdmFyIG1ldGhvZHMgPSB0aGlzLiRvcHRpb25zLm1ldGhvZHNcbiAgdmFyIG1ldGhvZHMgPSB0aGlzLl9tZXRob2RzXG4gIGlmIChtZXRob2RzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIHRoaXNba2V5XSA9IF8uYmluZChtZXRob2RzW2tleV0sIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbi8vIC8qKlxuLy8gICogSW5pdGlhbGl6ZSBtZXRhIGluZm9ybWF0aW9uIGxpa2UgJGluZGV4LCAka2V5ICYgJHZhbHVlLlxuLy8gICovXG5cbi8vIGV4cG9ydHMuX2luaXRNZXRhID0gZnVuY3Rpb24gKCkge1xuLy8gICB2YXIgbWV0YXMgPSB0aGlzLiRvcHRpb25zLl9tZXRhXG4vLyAgIGlmIChtZXRhcykge1xuLy8gICAgIGZvciAodmFyIGtleSBpbiBtZXRhcykge1xuLy8gICAgICAgdGhpcy5fZGVmaW5lTWV0YShrZXksIG1ldGFzW2tleV0pXG4vLyAgICAgfVxuLy8gICB9XG4vLyB9XG5cbi8vIC8qKlxuLy8gICogRGVmaW5lIGEgbWV0YSBwcm9wZXJ0eSwgZS5nICRpbmRleCwgJGtleSwgJHZhbHVlXG4vLyAgKiB3aGljaCBvbmx5IGV4aXN0cyBvbiB0aGUgdm0gaW5zdGFuY2UgYnV0IG5vdCBpbiAkZGF0YS5cbi8vICAqXG4vLyAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4vLyAgKiBAcGFyYW0geyp9IHZhbHVlXG4vLyAgKi9cblxuLy8gZXhwb3J0cy5fZGVmaW5lTWV0YSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgIHZhciBkZXAgPSBuZXcgRGVwKClcbi8vICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwge1xuLy8gICAgIGVudW1lcmFibGU6IHRydWUsXG4vLyAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuLy8gICAgIGdldDogZnVuY3Rpb24gbWV0YUdldHRlciAoKSB7XG4vLyAgICAgICBpZiAoT2JzZXJ2ZXIudGFyZ2V0KSB7XG4vLyAgICAgICAgIE9ic2VydmVyLnRhcmdldC5hZGREZXAoZGVwKVxuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIHZhbHVlXG4vLyAgICAgfSxcbi8vICAgICBzZXQ6IGZ1bmN0aW9uIG1ldGFTZXR0ZXIgKHZhbCkge1xuLy8gICAgICAgaWYgKHZhbCAhPT0gdmFsdWUpIHtcbi8vICAgICAgICAgdmFsdWUgPSB2YWxcbi8vICAgICAgICAgZGVwLm5vdGlmeSgpXG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9KVxuLy8gfVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvdm0vaW5zdGFuY2Uvc2NvcGUuanNcbiAqKi8iLCIvLyByZXF1aXJlZCBmb3IgY29kZSBpbiBpbnN0YW5jZS9vYnNlcnZlclxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi91dGlsJylcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi92bS91dGlsLmpzXG4gKiovIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIERlcCA9IHJlcXVpcmUoJy4vZGVwJylcbnZhciBhcnJheU1ldGhvZHMgPSByZXF1aXJlKCcuL2FycmF5JylcbnZhciBhcnJheUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhcnJheU1ldGhvZHMpXG5yZXF1aXJlKCcuL29iamVjdCcpXG5cbnZhciB1aWQgPSAwXG5cbi8qKlxuICogVHlwZSBlbnVtc1xuICovXG5cbnZhciBBUlJBWSAgPSAwXG52YXIgT0JKRUNUID0gMVxuXG4vKipcbiAqIEF1Z21lbnQgYW4gdGFyZ2V0IE9iamVjdCBvciBBcnJheSBieSBpbnRlcmNlcHRpbmdcbiAqIHRoZSBwcm90b3R5cGUgY2hhaW4gdXNpbmcgX19wcm90b19fXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvXG4gKi9cblxuZnVuY3Rpb24gcHJvdG9BdWdtZW50ICh0YXJnZXQsIHNyYykge1xuICB0YXJnZXQuX19wcm90b19fID0gc3JjXG59XG5cbi8qKlxuICogQXVnbWVudCBhbiB0YXJnZXQgT2JqZWN0IG9yIEFycmF5IGJ5IGRlZmluaW5nXG4gKiBoaWRkZW4gcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gdGFyZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG9cbiAqL1xuXG5mdW5jdGlvbiBjb3B5QXVnbWVudCAodGFyZ2V0LCBzcmMsIGtleXMpIHtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICB2YXIga2V5XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgXy5kZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldKVxuICB9XG59XG5cbi8qKlxuICogT2JzZXJ2ZXIgY2xhc3MgdGhhdCBhcmUgYXR0YWNoZWQgdG8gZWFjaCBvYnNlcnZlZFxuICogb2JqZWN0LiBPbmNlIGF0dGFjaGVkLCB0aGUgb2JzZXJ2ZXIgY29udmVydHMgdGFyZ2V0XG4gKiBvYmplY3QncyBwcm9wZXJ0eSBrZXlzIGludG8gZ2V0dGVyL3NldHRlcnMgdGhhdFxuICogY29sbGVjdCBkZXBlbmRlbmNpZXMgYW5kIGRpc3BhdGNoZXMgdXBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gdmFsdWVcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBPYnNlcnZlciAodmFsdWUsIHR5cGUpIHtcbiAgdGhpcy5pZCA9ICsrdWlkXG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxuICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgdGhpcy5kZXBzID0gW11cbiAgXy5kZWZpbmUodmFsdWUsICdfX29iX18nLCB0aGlzKVxuICBpZiAodHlwZSA9PT0gQVJSQVkpIHtcbiAgICB2YXIgYXVnbWVudCA9IGNvbmZpZy5wcm90byAmJiBfLmhhc1Byb3RvXG4gICAgICA/IHByb3RvQXVnbWVudFxuICAgICAgOiBjb3B5QXVnbWVudFxuICAgIGF1Z21lbnQodmFsdWUsIGFycmF5TWV0aG9kcywgYXJyYXlLZXlzKVxuICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbHVlKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09IE9CSkVDVCkge1xuICAgIHRoaXMud2Fsayh2YWx1ZSlcbiAgfVxufVxuXG5PYnNlcnZlci50YXJnZXQgPSBudWxsXG5cbnZhciBwID0gT2JzZXJ2ZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXR0ZW1wdCB0byBjcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2UgZm9yIGEgdmFsdWUsXG4gKiByZXR1cm5zIHRoZSBuZXcgb2JzZXJ2ZXIgaWYgc3VjY2Vzc2Z1bGx5IG9ic2VydmVkLFxuICogb3IgdGhlIGV4aXN0aW5nIG9ic2VydmVyIGlmIHRoZSB2YWx1ZSBhbHJlYWR5IGhhcyBvbmUuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7T2JzZXJ2ZXJ8dW5kZWZpbmVkfVxuICogQHN0YXRpY1xuICovXG5cbk9ic2VydmVyLmNyZWF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAoXG4gICAgdmFsdWUgJiZcbiAgICB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnX19vYl9fJykgJiZcbiAgICB2YWx1ZS5fX29iX18gaW5zdGFuY2VvZiBPYnNlcnZlclxuICApIHtcbiAgICByZXR1cm4gdmFsdWUuX19vYl9fXG4gIH0gZWxzZSBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2ZXIodmFsdWUsIEFSUkFZKVxuICB9IGVsc2UgaWYgKFxuICAgIF8uaXNQbGFpbk9iamVjdCh2YWx1ZSkgJiZcbiAgICAhdmFsdWUuX2lzVnVlIC8vIGF2b2lkIFZ1ZSBpbnN0YW5jZVxuICApIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmVyKHZhbHVlLCBPQkpFQ1QpXG4gIH1cbn1cblxuLyoqXG4gKiBXYWxrIHRocm91Z2ggZWFjaCBwcm9wZXJ0eSBhbmQgY29udmVydCB0aGVtIGludG9cbiAqIGdldHRlci9zZXR0ZXJzLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSBjYWxsZWQgd2hlblxuICogdmFsdWUgdHlwZSBpcyBPYmplY3QuIFByb3BlcnRpZXMgcHJlZml4ZWQgd2l0aCBgJGAgb3IgYF9gXG4gKiBhbmQgYWNjZXNzb3IgcHJvcGVydGllcyBhcmUgaWdub3JlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKi9cblxucC53YWxrID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iailcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICB2YXIga2V5LCBwcmVmaXhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBwcmVmaXggPSBrZXkuY2hhckNvZGVBdCgwKVxuICAgIGlmIChwcmVmaXggIT09IDB4MjQgJiYgcHJlZml4ICE9PSAweDVGKSB7IC8vIHNraXAgJCBvciBfXG4gICAgICB0aGlzLmNvbnZlcnQoa2V5LCBvYmpba2V5XSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUcnkgdG8gY2FyZXRlIGFuIG9ic2VydmVyIGZvciBhIGNoaWxkIHZhbHVlLFxuICogYW5kIGlmIHZhbHVlIGlzIGFycmF5LCBsaW5rIGRlcCB0byB0aGUgYXJyYXkuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0RlcHx1bmRlZmluZWR9XG4gKi9cblxucC5vYnNlcnZlID0gZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gT2JzZXJ2ZXIuY3JlYXRlKHZhbClcbn1cblxuLyoqXG4gKiBPYnNlcnZlIGEgbGlzdCBvZiBBcnJheSBpdGVtcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xuICovXG5cbnAub2JzZXJ2ZUFycmF5ID0gZnVuY3Rpb24gKGl0ZW1zKSB7XG4gIHZhciBpID0gaXRlbXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzLm9ic2VydmUoaXRlbXNbaV0pXG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcHJvcGVydHkgaW50byBnZXR0ZXIvc2V0dGVyIHNvIHdlIGNhbiBlbWl0XG4gKiB0aGUgZXZlbnRzIHdoZW4gdGhlIHByb3BlcnR5IGlzIGFjY2Vzc2VkL2NoYW5nZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5wLmNvbnZlcnQgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgdmFyIG9iID0gdGhpc1xuICB2YXIgY2hpbGRPYiA9IG9iLm9ic2VydmUodmFsKVxuICB2YXIgZGVwID0gbmV3IERlcCgpXG4gIGlmIChjaGlsZE9iKSB7XG4gICAgY2hpbGRPYi5kZXBzLnB1c2goZGVwKVxuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYi52YWx1ZSwga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBPYnNlcnZlci50YXJnZXQgaXMgYSB3YXRjaGVyIHdob3NlIGdldHRlciBpc1xuICAgICAgLy8gY3VycmVudGx5IGJlaW5nIGV2YWx1YXRlZC5cbiAgICAgIGlmIChvYi5hY3RpdmUgJiYgT2JzZXJ2ZXIudGFyZ2V0KSB7XG4gICAgICAgIE9ic2VydmVyLnRhcmdldC5hZGREZXAoZGVwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbFxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsID09PSB2YWwpIHJldHVyblxuICAgICAgLy8gcmVtb3ZlIGRlcCBmcm9tIG9sZCB2YWx1ZVxuICAgICAgdmFyIG9sZENoaWxkT2IgPSB2YWwgJiYgdmFsLl9fb2JfX1xuICAgICAgaWYgKG9sZENoaWxkT2IpIHtcbiAgICAgICAgb2xkQ2hpbGRPYi5kZXBzLiRyZW1vdmUoZGVwKVxuICAgICAgfVxuICAgICAgdmFsID0gbmV3VmFsXG4gICAgICAvLyBhZGQgZGVwIHRvIG5ldyB2YWx1ZVxuICAgICAgdmFyIG5ld0NoaWxkT2IgPSBvYi5vYnNlcnZlKG5ld1ZhbClcbiAgICAgIGlmIChuZXdDaGlsZE9iKSB7XG4gICAgICAgIG5ld0NoaWxkT2IuZGVwcy5wdXNoKGRlcClcbiAgICAgIH1cbiAgICAgIGRlcC5ub3RpZnkoKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBOb3RpZnkgY2hhbmdlIG9uIGFsbCBzZWxmIGRlcHMgb24gYW4gb2JzZXJ2ZXIuXG4gKiBUaGlzIGlzIGNhbGxlZCB3aGVuIGEgbXV0YWJsZSB2YWx1ZSBtdXRhdGVzLiBlLmcuXG4gKiB3aGVuIGFuIEFycmF5J3MgbXV0YXRpbmcgbWV0aG9kcyBhcmUgY2FsbGVkLCBvciBhblxuICogT2JqZWN0J3MgJGFkZC8kZGVsZXRlIGFyZSBjYWxsZWQuXG4gKi9cblxucC5ub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkZXBzID0gdGhpcy5kZXBzXG4gIGZvciAodmFyIGkgPSAwLCBsID0gZGVwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBkZXBzW2ldLm5vdGlmeSgpXG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgYW4gb3duZXIgdm0sIHNvIHRoYXQgd2hlbiAkYWRkLyRkZWxldGUgbXV0YXRpb25zXG4gKiBoYXBwZW4gd2UgY2FuIG5vdGlmeSBvd25lciB2bXMgdG8gcHJveHkgdGhlIGtleXMgYW5kXG4gKiBkaWdlc3QgdGhlIHdhdGNoZXJzLiBUaGlzIGlzIG9ubHkgY2FsbGVkIHdoZW4gdGhlIG9iamVjdFxuICogaXMgb2JzZXJ2ZWQgYXMgYW4gaW5zdGFuY2UncyByb290ICRkYXRhLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbnAuYWRkVm0gPSBmdW5jdGlvbiAodm0pIHtcbiAgKHRoaXMudm1zID0gdGhpcy52bXMgfHwgW10pLnB1c2godm0pXG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIG93bmVyIHZtLiBUaGlzIGlzIGNhbGxlZCB3aGVuIHRoZSBvYmplY3QgaXNcbiAqIHN3YXBwZWQgb3V0IGFzIGFuIGluc3RhbmNlJ3MgJGRhdGEgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbnAucmVtb3ZlVm0gPSBmdW5jdGlvbiAodm0pIHtcbiAgdGhpcy52bXMuJHJlbW92ZSh2bSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlcnZlclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvdm0vb2JzZXJ2ZXIvaW5kZXguanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtwcm90bzogdHJ1ZX1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL3ZtL2NvbmZpZy5qc1xuICoqLyIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbi8qKlxuICogQSBkZXAgaXMgYW4gb2JzZXJ2YWJsZSB0aGF0IGNhbiBoYXZlIG11bHRpcGxlXG4gKiBkaXJlY3RpdmVzIHN1YnNjcmliaW5nIHRvIGl0LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIERlcCAoKSB7XG4gIHRoaXMuc3VicyA9IFtdXG59XG5cbnZhciBwID0gRGVwLnByb3RvdHlwZVxuXG4vKipcbiAqIEFkZCBhIGRpcmVjdGl2ZSBzdWJzY3JpYmVyLlxuICpcbiAqIEBwYXJhbSB7RGlyZWN0aXZlfSBzdWJcbiAqL1xuXG5wLmFkZFN1YiA9IGZ1bmN0aW9uIChzdWIpIHtcbiAgdGhpcy5zdWJzLnB1c2goc3ViKVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGRpcmVjdGl2ZSBzdWJzY3JpYmVyLlxuICpcbiAqIEBwYXJhbSB7RGlyZWN0aXZlfSBzdWJcbiAqL1xuXG5wLnJlbW92ZVN1YiA9IGZ1bmN0aW9uIChzdWIpIHtcbiAgdGhpcy5zdWJzLiRyZW1vdmUoc3ViKVxufVxuXG4vKipcbiAqIE5vdGlmeSBhbGwgc3Vic2NyaWJlcnMgb2YgYSBuZXcgdmFsdWUuXG4gKi9cblxucC5ub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIHN0YWJsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcbiAgdmFyIHN1YnMgPSBfLnRvQXJyYXkodGhpcy5zdWJzKVxuICBmb3IgKHZhciBpID0gMCwgbCA9IHN1YnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgc3Vic1tpXS51cGRhdGUoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVwXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvdm0vb2JzZXJ2ZXIvZGVwLmpzXG4gKiovIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlXG52YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmNyZWF0ZShhcnJheVByb3RvKVxuXG4vKipcbiAqIEludGVyY2VwdCBtdXRhdGluZyBtZXRob2RzIGFuZCBlbWl0IGV2ZW50c1xuICovXG5cbjtbXG4gICdwdXNoJyxcbiAgJ3BvcCcsXG4gICdzaGlmdCcsXG4gICd1bnNoaWZ0JyxcbiAgJ3NwbGljZScsXG4gICdzb3J0JyxcbiAgJ3JldmVyc2UnXG5dXG4uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIGNhY2hlIG9yaWdpbmFsIG1ldGhvZFxuICB2YXIgb3JpZ2luYWwgPSBhcnJheVByb3RvW21ldGhvZF1cbiAgXy5kZWZpbmUoYXJyYXlNZXRob2RzLCBtZXRob2QsIGZ1bmN0aW9uIG11dGF0b3IgKCkge1xuICAgIC8vIGF2b2lkIGxlYWtpbmcgYXJndW1lbnRzOlxuICAgIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2Nsb3N1cmUtd2l0aC1hcmd1bWVudHNcbiAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShpKVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV1cbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICB2YXIgaW5zZXJ0ZWRcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAncHVzaCc6XG4gICAgICAgIGluc2VydGVkID0gYXJnc1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAndW5zaGlmdCc6XG4gICAgICAgIGluc2VydGVkID0gYXJnc1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnc3BsaWNlJzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzLnNsaWNlKDIpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIGlmIChpbnNlcnRlZCkgb2Iub2JzZXJ2ZUFycmF5KGluc2VydGVkKVxuICAgIC8vIG5vdGlmeSBjaGFuZ2VcbiAgICBvYi5ub3RpZnkoKVxuICAgIHJldHVybiByZXN1bHRcbiAgfSlcbn0pXG5cbi8qKlxuICogU3dhcCB0aGUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gaW5kZXggd2l0aCBhIG5ldyB2YWx1ZVxuICogYW5kIGVtaXRzIGNvcnJlc3BvbmRpbmcgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Kn0gLSByZXBsYWNlZCBlbGVtZW50XG4gKi9cblxuXy5kZWZpbmUoXG4gIGFycmF5UHJvdG8sXG4gICckc2V0JyxcbiAgZnVuY3Rpb24gJHNldCAoaW5kZXgsIHZhbCkge1xuICAgIGlmIChpbmRleCA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5sZW5ndGggPSBpbmRleCArIDFcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxLCB2YWwpWzBdXG4gIH1cbilcblxuLyoqXG4gKiBDb252ZW5pZW5jZSBtZXRob2QgdG8gcmVtb3ZlIHRoZSBlbGVtZW50IGF0IGdpdmVuIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5fLmRlZmluZShcbiAgYXJyYXlQcm90byxcbiAgJyRyZW1vdmUnLFxuICBmdW5jdGlvbiAkcmVtb3ZlIChpbmRleCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhpcy5sZW5ndGgpIHJldHVyblxuICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZih0aGlzLCBpbmRleClcbiAgICB9XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cbiAgfVxuKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TWV0aG9kc1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL3ZtL29ic2VydmVyL2FycmF5LmpzXG4gKiovIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBvYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBuZXcgcHJvcGVydHkgdG8gYW4gb2JzZXJ2ZWQgb2JqZWN0XG4gKiBhbmQgZW1pdHMgY29ycmVzcG9uZGluZyBldmVudFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcHVibGljXG4gKi9cblxuXy5kZWZpbmUoXG4gIG9ialByb3RvLFxuICAnJGFkZCcsXG4gIGZ1bmN0aW9uICRhZGQgKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICBpZiAoIW9iIHx8IF8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBvYi5jb252ZXJ0KGtleSwgdmFsKVxuICAgIG9iLm5vdGlmeSgpXG4gICAgaWYgKG9iLnZtcykge1xuICAgICAgdmFyIGkgPSBvYi52bXMubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciB2bSA9IG9iLnZtc1tpXVxuICAgICAgICB2bS5fcHJveHkoa2V5KVxuICAgICAgICAvLyB2bS5fZGlnZXN0KCkgLy8gdG9kb1xuICAgICAgfVxuICAgIH1cbiAgfVxuKVxuXG4vKipcbiAqIFNldCBhIHByb3BlcnR5IG9uIGFuIG9ic2VydmVkIG9iamVjdCwgY2FsbGluZyBhZGQgdG9cbiAqIGVuc3VyZSB0aGUgcHJvcGVydHkgaXMgb2JzZXJ2ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwdWJsaWNcbiAqL1xuXG5fLmRlZmluZShcbiAgb2JqUHJvdG8sXG4gICckc2V0JyxcbiAgZnVuY3Rpb24gJHNldCAoa2V5LCB2YWwpIHtcbiAgICB0aGlzLiRhZGQoa2V5LCB2YWwpXG4gICAgdGhpc1trZXldID0gdmFsXG4gIH1cbilcblxuLyoqXG4gKiBEZWxldGVzIGEgcHJvcGVydHkgZnJvbSBhbiBvYnNlcnZlZCBvYmplY3RcbiAqIGFuZCBlbWl0cyBjb3JyZXNwb25kaW5nIGV2ZW50XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHB1YmxpY1xuICovXG5cbl8uZGVmaW5lKFxuICBvYmpQcm90byxcbiAgJyRkZWxldGUnLFxuICBmdW5jdGlvbiAkZGVsZXRlIChrZXkpIHtcbiAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuXG4gICAgZGVsZXRlIHRoaXNba2V5XVxuICAgIHZhciBvYiA9IHRoaXMuX19vYl9fXG4gICAgaWYgKCFvYiB8fCBfLmlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIG9iLm5vdGlmeSgpXG4gICAgaWYgKG9iLnZtcykge1xuICAgICAgdmFyIGkgPSBvYi52bXMubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciB2bSA9IG9iLnZtc1tpXVxuICAgICAgICB2bS5fdW5wcm94eShrZXkpXG4gICAgICAgIC8vIHZtLl9kaWdlc3QoKSAvLyB0b2RvXG4gICAgICB9XG4gICAgfVxuICB9XG4pXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi92bS9vYnNlcnZlci9vYmplY3QuanNcbiAqKi8iLCIgLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBWaWV3TW9kZWwgdGVtcGxhdGUgcGFyc2VyICYgZGF0YS1iaW5kaW5nIHByb2Nlc3NcbiAqXG4gKiByZXF1aXJlZDpcbiAqIGluZGV4LmpzOiBWbVxuICogZG9tLWhlbHBlci5qczogX2NyZWF0ZUVsZW1lbnQsIF9jcmVhdGVCbG9ja1xuICogZG9tLWhlbHBlci5qczogX2F0dGFjaFRhcmdldCwgX21vdmVUYXJnZXQsIF9yZW1vdmVUYXJnZXRcbiAqIGRpcmVjdGl2ZS5qczogX2JpbmRFbGVtZW50LCBfYmluZFN1YlZtLCBfd2F0Y2hcbiAqIGV2ZW50cy5qczogJG9uXG4gKi9cblxuLyoqXG4gKiBidWlsZChleHRlcm5hbERpcnMpXG4gKiAgIGNyZWF0ZVZtKClcbiAqICAgbWVyZ2UoZXh0ZXJuYWxEaXJzLCBkaXJzKVxuICogICBnZW5lcmF0ZSh0ZW1wbGF0ZSwgcGFyZW50Tm9kZSlcbiAqICAgICBpZiAodHlwZSBpcyBjb250ZW50KSBjcmVhdGUgY29udGVudE5vZGVcbiAqICAgICBlbHNlIGlmIChkaXJzIGhhdmUgdi1mb3IpIGZvcmVhY2ggLT4gY3JlYXRlIGNvbnRleHRcbiAqICAgICAgIC0+IGdlbmVyYXRlKHRlbXBsYXRlV2l0aG91dEZvciwgcGFyZW50Tm9kZSk6IGRpZmYobGlzdCkgb25jaGFuZ2VcbiAqICAgICBlbHNlIGlmIChkaXJzIGhhdmUgdi1pZikgYXNzZXJ0XG4gKiAgICAgICAtPiBnZW5lcmF0ZSh0ZW1wbGF0ZVdpdGhvdXRJZiwgcGFyZW50Tm9kZSk6IHRvZ2dsZShzaG93bikgb25jaGFuZ2VcbiAqICAgICBlbHNlIGlmICh0eXBlIGlzIG5hdGl2ZSlcbiAqICAgICAgIHNldChkaXJzKTogdXBkYXRlKGlkL2F0dHIvc3R5bGUvY2xhc3MpIG9uY2hhbmdlXG4gKiAgICAgICBhcHBlbmQodGVtcGxhdGUsIHBhcmVudE5vZGUpXG4gKiAgICAgICBmb3JlYWNoIGNoaWxkTm9kZXMgLT4gZ2VuZXJhdGUoY2hpbGROb2RlLCB0ZW1wbGF0ZSlcbiAqICAgICBlbHNlIGlmICh0eXBlIGlzIGN1c3RvbSlcbiAqICAgICAgIGFkZENoaWxkVm0odm0sIHBhcmVudFZtKVxuICogICAgICAgYnVpbGQoZXh0ZXJuYWxEaXJzKVxuICogICAgICAgZm9yZWFjaCBjaGlsZE5vZGVzIC0+IGdlbmVyYXRlKGNoaWxkTm9kZSwgdGVtcGxhdGUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfYnVpbGQoKSB7XG4gIGNvbnN0IG9wdCA9IHRoaXMuX29wdGlvbnMgfHwge31cbiAgY29uc3QgdGVtcGxhdGUgPSBvcHQudGVtcGxhdGUgfHwge31cblxuICBpZiAob3B0LnJlcGxhY2UpIHtcbiAgICBpZiAodGVtcGxhdGUuY2hpbGRyZW4gJiYgdGVtcGxhdGUuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLl9nZW5lcmF0ZSh0ZW1wbGF0ZS5jaGlsZHJlblswXSwgdGhpcy5fcGFyZW50RWwpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5fZ2VuZXJhdGUodGVtcGxhdGUuY2hpbGRyZW4sIHRoaXMuX3BhcmVudEVsKVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLl9nZW5lcmF0ZSh0ZW1wbGF0ZSwgdGhpcy5fcGFyZW50RWwpXG4gIH1cblxuICB0aGlzLiRlbWl0KCdob29rOnJlYWR5JylcbiAgdGhpcy5fcmVhZHkgPSB0cnVlXG59XG5cbi8qKlxuICogR2VuZXJhdGUgZWxlbWVudHMgYnkgY2hpbGQgb3IgY2hpbGRyZW4gYW5kIGFwcGVuZCB0byBwYXJlbnQgZWxlbWVudHMuXG4gKiBSb290IGVsZW1lbnQgaW5mbyB3b3VsZCBiZSBtZXJnZWQgaWYgaGFzLiBUaGUgZmlyc3QgYXJndW1lbnQgbWF5IGJlIGFuIGFycmF5XG4gKiBpZiB0aGUgcm9vdCBlbGVtZW50IHdpdGggb3B0aW9ucy5yZXBsYWNlIGhhcyBub3Qgb25seSBvbmUgY2hpbGQuXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fGFycmF5fSB0YXJnZXRcbiAqIEBwYXJhbSAge29iamVjdH0gcGFyZW50RWxcbiAqIEBwYXJhbSAge29iamVjdH0gY29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gX2dlbmVyYXRlKHRhcmdldCwgcGFyZW50RWwsIGNvbnRleHQpIHtcblxuICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgY29uc3QgZnJhZ0Jsb2NrID0gdGhpcy5fY3JlYXRlQmxvY2socGFyZW50RWwpXG4gICAgdGFyZ2V0LmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICB0aGlzLl9nZW5lcmF0ZShjaGlsZCwgZnJhZ0Jsb2NrLCBjb250ZXh0KVxuICAgIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb250ZXh0ID0gY29udGV4dCB8fCB7fVxuXG4gIGlmICh0YXJnZXQudHlwZSA9PT0gJ2NvbnRlbnQnIHx8IHRhcmdldC50eXBlID09PSAnc2xvdCcpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gdGhpcy5fY3JlYXRlQmxvY2socGFyZW50RWwpXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoIWNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3JlcGVhdCcpICYmIHRhcmdldC5yZXBlYXQpIHtcbiAgICBjb25zdCBleHByZXNzaW9uID0gdGFyZ2V0LnJlcGVhdC5leHByZXNzaW9uIHx8IHRhcmdldC5yZXBlYXRcbiAgICBjb25zdCBsaXN0ID0gZXhwcmVzc2lvbi5jYWxsKHRoaXMpXG4gICAgY29uc3QgcmVwZWF0SWQgPSBsYXRlc3RSZXBlYXRJZCsrXG4gICAgY29uc3QgbGF0ZXN0SXRlbUlkID0gbWFya0xpc3QobGlzdCwgcmVwZWF0SWQpXG5cbiAgICBjb25zdCBmcmFnQmxvY2sgPSB0aGlzLl9jcmVhdGVCbG9jayhwYXJlbnRFbClcbiAgICBmcmFnQmxvY2suY2hpbGRyZW4gPSBbXVxuICAgIGZyYWdCbG9jay5kYXRhID0gbGlzdC5zbGljZSgwKVxuXG4gICAgdGhpcy5fY2hlY2tSZXBlYXQodGFyZ2V0LCBmcmFnQmxvY2ssIHJlcGVhdElkLCBsYXRlc3RJdGVtSWQpXG5cbiAgICBsaXN0LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGl0ZW0uSU5ERVggPSBpbmRleFxuICAgICAgfVxuICAgICAgdGhpcy5fZ2VuZXJhdGUodGFyZ2V0LCBmcmFnQmxvY2ssIHtyZXBlYXQ6IGl0ZW19KVxuICAgIH0pXG5cbiAgICByZXR1cm5cbiAgfVxuXG4gIGxldCBzdWJDb250ZXh0ID0gdGhpc1xuICBpZiAoY29udGV4dC5yZXBlYXQgJiYgIWNvbnRleHQuc2hvd24pIHtcbiAgICBzdWJDb250ZXh0ID0gdGhpcy5fbWVyZ2VDb250ZXh0KGNvbnRleHQucmVwZWF0KVxuICB9XG5cbiAgaWYgKCFjb250ZXh0Lmhhc093blByb3BlcnR5KCdzaG93bicpICYmIHRhcmdldC5zaG93bikge1xuICAgIGNvbnN0IGRpc3BsYXkgPSB0YXJnZXQuc2hvd24uY2FsbChzdWJDb250ZXh0KVxuICAgIGNvbnN0IG5ld0NvbnRleHQgPSB7c2hvd246IHRydWV9XG4gICAgY29uc3QgZnJhZ0Jsb2NrID0gc3ViQ29udGV4dC5fY3JlYXRlQmxvY2socGFyZW50RWwpXG5cbiAgICBpZiAocGFyZW50RWwuZWxlbWVudCAmJiBwYXJlbnRFbC5jaGlsZHJlbikge1xuICAgICAgcGFyZW50RWwuY2hpbGRyZW4ucHVzaChmcmFnQmxvY2spXG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQucmVwZWF0KSB7XG4gICAgICBuZXdDb250ZXh0LnJlcGVhdCA9IGNvbnRleHQucmVwZWF0XG4gICAgfVxuXG4gICAgZnJhZ0Jsb2NrLmRpc3BsYXkgPSAhIWRpc3BsYXlcbiAgICBzdWJDb250ZXh0Ll9jaGVja0Rpc3BsYXkodGFyZ2V0LCBmcmFnQmxvY2ssIG5ld0NvbnRleHQpXG5cbiAgICBpZiAoZGlzcGxheSkge1xuICAgICAgc3ViQ29udGV4dC5fZ2VuZXJhdGUodGFyZ2V0LCBmcmFnQmxvY2ssIG5ld0NvbnRleHQpXG4gICAgfVxuXG4gICAgcmV0dXJuXG4gIH1cblxuICBsZXQgdHlwZUdldHRlciA9IHRhcmdldC50eXBlXG4gIGxldCB0eXBlID0gdHlwZUdldHRlclxuXG4gIGlmICh0eXBlb2YgdHlwZUdldHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHR5cGUgPSB0eXBlR2V0dGVyLmNhbGwoc3ViQ29udGV4dClcblxuICAgIGlmICghY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndHlwZScpKSB7XG4gICAgICBjb25zdCBuZXdDb250ZXh0ID0ge3R5cGU6IHR5cGV9XG4gICAgICBjb25zdCBmcmFnQmxvY2sgPSBzdWJDb250ZXh0Ll9jcmVhdGVCbG9jayhwYXJlbnRFbClcblxuICAgICAgaWYgKHBhcmVudEVsLmVsZW1lbnQgJiYgcGFyZW50RWwuY2hpbGRyZW4pIHtcbiAgICAgICAgcGFyZW50RWwuY2hpbGRyZW4ucHVzaChmcmFnQmxvY2spXG4gICAgICB9XG5cbiAgICAgIHN1YkNvbnRleHQuX3dhdGNoKHR5cGVHZXR0ZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICBzdWJDb250ZXh0Ll9yZW1vdmVCbG9jayhmcmFnQmxvY2ssIHRydWUpXG4gICAgICAgIHN1YkNvbnRleHQuX2dlbmVyYXRlKHRhcmdldCwgZnJhZ0Jsb2NrLCB7dHlwZTogdmFsdWV9KVxuICAgICAgfSlcblxuICAgICAgc3ViQ29udGV4dC5fZ2VuZXJhdGUodGFyZ2V0LCBmcmFnQmxvY2ssIG5ld0NvbnRleHQpXG5cbiAgICAgIHJldHVyblxuICAgIH1cbiAgfVxuXG4gIGxldCBpc0NvbXBvbmVudFxuICBpZiAodGhpcy5fYXBwICYmIHRoaXMuX2FwcC5jdXN0b21Db21wb25lbnRNYXAgJiYgdHlwZSkge1xuICAgIGlzQ29tcG9uZW50ID0gdGhpcy5fYXBwLmN1c3RvbUNvbXBvbmVudE1hcFt0eXBlXVxuICB9XG4gIGVsc2Uge1xuICAgIGlzQ29tcG9uZW50ID0gdGFyZ2V0LmNvbXBvbmVudFxuICB9XG5cbiAgaWYgKGlzQ29tcG9uZW50KSB7XG4gICAgY29uc3QgVm0gPSB0aGlzLmNvbnN0cnVjdG9yXG4gICAgY29uc3Qgc3ViVm0gPSBuZXcgVm0odHlwZSwgc3ViQ29udGV4dCwgcGFyZW50RWwsIHVuZGVmaW5lZCwge1xuICAgICAgJ2hvb2s6aW5pdCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3ViQ29udGV4dC5fc2V0SWQodGFyZ2V0LmlkLCBudWxsLCB0aGlzKVxuICAgICAgfSxcbiAgICAgICdob29rOmNyZWF0ZWQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN1YkNvbnRleHQuX2JpbmRTdWJWbSh0aGlzLCB0YXJnZXQsIGNvbnRleHQucmVwZWF0KVxuICAgICAgfSxcbiAgICAgICdob29rOnJlYWR5JzogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fY29udGVudCkge1xuICAgICAgICAgIHN1YkNvbnRleHQuX3NldENoaWxkcmVuKHRhcmdldCwgdGhpcy5fY29udGVudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgc3ViQ29udGV4dC5fYmluZFN1YlZtQWZ0ZXJJbml0aWFsaXplZChzdWJWbSwgdGFyZ2V0KVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgZWxlbWVudCA9IHN1YkNvbnRleHQuX2dlbmVyYXRlRWxlbWVudCh0eXBlLCB0YXJnZXQsIHBhcmVudEVsKVxuICBjb25zdCB0cmVlTW9kZSA9IHRhcmdldC5hcHBlbmQgPT09ICd0cmVlJ1xuICBpZiAoIXRyZWVNb2RlKSB7XG4gICAgc3ViQ29udGV4dC5fYXR0YWNoVGFyZ2V0KGVsZW1lbnQsIHBhcmVudEVsKVxuICB9XG4gIHN1YkNvbnRleHQuX3NldENoaWxkcmVuKHRhcmdldCwgZWxlbWVudClcbiAgaWYgKHRyZWVNb2RlKSB7XG4gICAgc3ViQ29udGV4dC5fYXR0YWNoVGFyZ2V0KGVsZW1lbnQsIHBhcmVudEVsKVxuICB9XG59XG5cbi8qKlxuICogR2VuZXJhdGUgZWxlbWVudCBmcm9tIHRlbXBsYXRlIGFuZCBhdHRhY2ggdG8gdGhlIGRlc3QgaWYgbmVlZGVkLlxuICogVGhlIHRpbWUgdG8gYXR0YWNoIGRlcGVuZHMgb24gd2hldGhlciB0aGUgbW9kZSBzdGF0dXMgaXMgbm9kZSBvciB0cmVlLlxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gdGVtcGxhdGVcbiAqIEBwYXJhbSAge29iamVjdH0gZGVzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gX2dlbmVyYXRlRWxlbWVudCh0eXBlLCB0ZW1wbGF0ZSwgZGVzdCkge1xuXG4gIHRoaXMuX2FwcGx5TmFpdHZlQ29tcG9uZW50T3B0aW9ucyh0ZW1wbGF0ZSlcblxuICBsZXQgZWxlbWVudFxuICBpZiAoZGVzdC5yZWYgPT09ICdfZG9jdW1lbnRFbGVtZW50Jykge1xuICAgIC8vIGlmIGl0cyBwYXJlbnQgaXMgZG9jdW1lbnRFbGVtZW50IHRoZW4gaXQncyBhIGJvZHlcbiAgICBlbGVtZW50ID0gdGhpcy5fY3JlYXRlQm9keSh0eXBlKVxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQgPSB0aGlzLl9jcmVhdGVFbGVtZW50KHR5cGUpXG4gIH1cbiAgLy8gVE9ETyBpdCB3YXMgYSByb290IGVsZW1lbnQgd2hlbiBub3QgaW4gYSBmcmFnbWVudFxuICBpZiAoIXRoaXMuX3Jvb3RFbCkge1xuICAgIHRoaXMuX3Jvb3RFbCA9IGVsZW1lbnRcbiAgfVxuXG4gIHRoaXMuX2JpbmRFbGVtZW50KGVsZW1lbnQsIHRlbXBsYXRlKVxuXG4gIGlmICh0ZW1wbGF0ZS5hdHRyICYmIHRlbXBsYXRlLmF0dHIuYXBwZW5kKSB7IC8vIGJhY2t3YXJkLCBhcHBlbmQgcHJvcCBpbiBhdHRyXG4gICAgZWxlbWVudC5hcHBlbmQgPSB0ZW1wbGF0ZS5hdHRyLmFwcGVuZFxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRcbn1cblxuLyoqXG4gKiBTZXQgYWxsIGNoaWxkcmVuIHRvIGEgY2VydGFpbiBwYXJlbnQgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdGVtcGxhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnRFbFxuICovXG5leHBvcnQgZnVuY3Rpb24gX3NldENoaWxkcmVuKHRlbXBsYXRlLCBwYXJlbnRFbCkge1xuICBjb25zdCBjaGlsZHJlbiA9IHRlbXBsYXRlLmNoaWxkcmVuXG4gIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgdGhpcy5fZ2VuZXJhdGUoY2hpbGQsIHBhcmVudEVsKVxuICAgIH0pXG4gIH1cbn1cblxuLyoqXG4gKiBXYXRjaCB0aGUgbGlzdCB1cGRhdGUgYW5kIHJlZnJlc2ggdGhlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSAge29iamVjdH0gZnJhZ0Jsb2NrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfY2hlY2tSZXBlYXQodGFyZ2V0LCBmcmFnQmxvY2ssIHJlcGVhdElkLCBsYXRlc3RJdGVtSWQpIHtcbiAgY29uc3QgZXhwcmVzc2lvbiA9IHRhcmdldC5yZXBlYXQuZXhwcmVzc2lvbiB8fCB0YXJnZXQucmVwZWF0XG4gIGNvbnN0IGNoaWxkcmVuID0gZnJhZ0Jsb2NrLmNoaWxkcmVuXG5cbiAgdGhpcy5fd2F0Y2hCbG9jayhmcmFnQmxvY2ssIGV4cHJlc3Npb24sICdyZXBlYXQnLCAodmFsdWUpID0+IHtcbiAgICBpZiAoIWZyYWdCbG9jaykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgb2xkQ2hpbGRyZW4gPSBjaGlsZHJlbi5zbGljZSgpXG4gICAgY29uc3Qgb2xkVmFsdWUgPSBmcmFnQmxvY2suZGF0YS5zbGljZSgpXG4gICAgLy8gMS4gY29sbGVjdCBhbGwgbmV3IHJlZnMgdHJhY2sgYnlcbiAgICBjb25zdCB0cmFja01hcCA9IHt9XG4gICAgY29uc3QgcmV1c2VkTWFwID0ge31cbiAgICB2YWx1ZS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGtleSA9IGl0ZW1bYF9fd3hfcmVwZWF0XyR7cmVwZWF0SWR9X19gXVxuICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAga2V5ID0gbGF0ZXN0SXRlbUlkKytcbiAgICAgICAgc2V0UmVwZWF0SXRlbUlkKGl0ZW0sIHJlcGVhdElkLCBrZXkpXG4gICAgICB9XG4gICAgICB0cmFja01hcFtrZXldID0gaXRlbVxuICAgIH0pXG5cbiAgICAvLyAyLiByZW1vdmUgdW51c2VkIGVsZW1lbnQgZm9yZWFjaCBvbGQgaXRlbVxuICAgIGNvbnN0IHJldXNlZExpc3QgPSBbXVxuICAgIG9sZFZhbHVlLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSBpdGVtW2BfX3d4X3JlcGVhdF8ke3JlcGVhdElkfV9fYF1cbiAgICAgIGlmICh0cmFja01hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHJldXNlZE1hcFtrZXldID0ge2l0ZW0sIGluZGV4LCB0YXJnZXQ6IG9sZENoaWxkcmVuW2luZGV4XX1cbiAgICAgICAgcmV1c2VkTGlzdC5wdXNoKGl0ZW0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlVGFyZ2V0KG9sZENoaWxkcmVuW2luZGV4XSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gMy4gY3JlYXRlIG5ldyBlbGVtZW50IGZvcmVhY2ggbmV3IGl0ZW1cbiAgICBjaGlsZHJlbi5sZW5ndGggPSAwXG4gICAgZnJhZ0Jsb2NrLmRhdGEgPSB2YWx1ZS5zbGljZSgpXG4gICAgZnJhZ0Jsb2NrLnVwZGF0ZU1hcmsgPSBmcmFnQmxvY2suc3RhcnRcblxuICAgIHZhbHVlLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSBpdGVtW2BfX3d4X3JlcGVhdF8ke3JlcGVhdElkfV9fYF1cbiAgICAgIGNvbnN0IHJldXNlZCA9IHJldXNlZE1hcFtrZXldXG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGl0ZW0uSU5ERVggPSBpbmRleFxuICAgICAgfVxuICAgICAgaWYgKHJldXNlZCkge1xuICAgICAgICBpZiAocmV1c2VkLml0ZW0gPT09IHJldXNlZExpc3RbMF0pIHtcbiAgICAgICAgICByZXVzZWRMaXN0LnNoaWZ0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXVzZWRMaXN0LiRyZW1vdmUocmV1c2VkLml0ZW0pXG4gICAgICAgICAgdGhpcy5fbW92ZVRhcmdldChyZXVzZWQudGFyZ2V0LCBmcmFnQmxvY2sudXBkYXRlTWFyaywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgICBjaGlsZHJlbi5wdXNoKHJldXNlZC50YXJnZXQpXG4gICAgICAgIGZyYWdCbG9jay51cGRhdGVNYXJrID0gcmV1c2VkLnRhcmdldFxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2dlbmVyYXRlKHRhcmdldCwgZnJhZ0Jsb2NrLCB7cmVwZWF0OiBpdGVtfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZGVsZXRlIGZyYWdCbG9jay51cGRhdGVNYXJrXG4gIH0pXG59XG5cbmxldCBsYXRlc3RSZXBlYXRJZCA9IDFcblxuZnVuY3Rpb24gbWFya0xpc3QobGlzdCwgcmVwZWF0SWQpIHtcbiAgbGV0IGxhdGVzdEl0ZW1JZCA9IDFcbiAgbGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgc2V0UmVwZWF0SXRlbUlkKGl0ZW0sIHJlcGVhdElkLCBsYXRlc3RJdGVtSWQrKylcbiAgfSlcbiAgcmV0dXJuIGxhdGVzdEl0ZW1JZFxufVxuXG5mdW5jdGlvbiBzZXRSZXBlYXRJdGVtSWQoaXRlbSwgcmVwZWF0SWQsIGl0ZW1JZCkge1xuICBjb25zdCBrZXkgPSBgX193eF9yZXBlYXRfJHtyZXBlYXRJZH1fX2BcbiAgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpdGVtLCBrZXksIHtcbiAgICAgIHZhbHVlOiBpdGVtSWRcbiAgICB9KVxuICB9XG59XG5cbi8qKlxuICogV2F0Y2ggdGhlIGRpc3BsYXkgdXBkYXRlIGFuZCBhZGQvcmVtb3ZlIHRoZSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0gIHtvYmplY3R9IGZyYWdCbG9ja1xuICogQHBhcmFtICB7b2JqZWN0fSBjb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfY2hlY2tEaXNwbGF5KHRhcmdldCwgZnJhZ0Jsb2NrLCBjb250ZXh0KSB7XG5cbiAgdGhpcy5fd2F0Y2hCbG9jayhmcmFnQmxvY2ssIHRhcmdldC5zaG93biwgJ3Nob3duJywgKHZhbHVlKSA9PiB7XG4gICAgaWYgKCFmcmFnQmxvY2sgfHwgISFmcmFnQmxvY2suZGlzcGxheSA9PT0gISF2YWx1ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGZyYWdCbG9jay5kaXNwbGF5ID0gdmFsdWVcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuX2dlbmVyYXRlKHRhcmdldCwgZnJhZ0Jsb2NrLCBjb250ZXh0KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbW92ZUJsb2NrKGZyYWdCbG9jaywgdHJ1ZSlcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfd2F0Y2hCbG9jayhmcmFnQmxvY2ssIGNhbGMsIHR5cGUsIGhhbmRsZXIpIHtcbiAgY29uc3QgZGlmZmVyID0gdGhpcyAmJiB0aGlzLl9hcHAgJiYgdGhpcy5fYXBwLmRpZmZlclxuICBjb25zdCBjb25maWcgPSB7fVxuICBjb25zdCBkZXB0aCA9IChmcmFnQmxvY2suZWxlbWVudC5kZXB0aCB8fCAwKSArIDFcblxuICB0aGlzLl93YXRjaChjYWxjLCAodmFsdWUpID0+IHtcbiAgICBjb25maWcubGF0ZXN0VmFsdWUgPSB2YWx1ZVxuICAgIGlmIChkaWZmZXIgJiYgIWNvbmZpZy5yZWNvcmRlZCkge1xuICAgICAgZGlmZmVyLmFwcGVuZCh0eXBlLCBkZXB0aCwgZnJhZ0Jsb2NrLmJsb2NrSWQsICgpID0+IHtcbiAgICAgICAgY29uc3QgbGF0ZXN0VmFsdWUgPSBjb25maWcubGF0ZXN0VmFsdWVcbiAgICAgICAgaGFuZGxlcihsYXRlc3RWYWx1ZSlcbiAgICAgICAgY29uZmlnLnJlY29yZGVkID0gZmFsc2VcbiAgICAgICAgY29uZmlnLmxhdGVzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICB9KVxuICAgIH1cbiAgICBjb25maWcucmVjb3JkZWQgPSB0cnVlXG4gIH0pXG59XG5cbi8qKlxuICogQ2xvbmUgYSBjb250ZXh0IGFuZCBtZXJnZSBjZXJ0YWluIGRhdGEuXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSBtZXJnZWREYXRhXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfbWVyZ2VDb250ZXh0KG1lcmdlZERhdGEpIHtcbiAgY29uc3QgY29udGV4dCA9IE9iamVjdC5jcmVhdGUodGhpcylcbiAgY29udGV4dC5fZGF0YSA9IG1lcmdlZERhdGFcbiAgY29udGV4dC5faW5pdERhdGEoKVxuICBjb250ZXh0Ll9yZWFsUGFyZW50ID0gdGhpc1xuICByZXR1cm4gY29udGV4dFxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvdm0vY29tcGlsZXIuanNcbiAqKi8iLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXdcbiAqIERpcmVjdGl2ZSBQYXJzZXJcbiAqL1xuXG5pbXBvcnQge2JpbmQsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCdcblxuaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi93YXRjaGVyJ1xuaW1wb3J0IHtuYXRpdmVDb21wb25lbnRNYXB9IGZyb20gJy4uL2NvbmZpZydcblxuY29uc3QgU0VUVEVSUyA9IHtcbiAgYXR0cjogJ3NldEF0dHInLFxuICBzdHlsZTogJ3NldFN0eWxlJyxcbiAgZXZlbnQ6ICdhZGRFdmVudCdcbn1cblxuLyoqXG4gKiBhcHBseSB0aGUgbmF0aXZlIGNvbXBvbmVudCdzIG9wdGlvbnMoc3BlY2lmaWVkIGJ5IHRlbXBsYXRlLnR5cGUpXG4gKiB0byB0aGUgdGVtcGxhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9hcHBseU5haXR2ZUNvbXBvbmVudE9wdGlvbnModGVtcGxhdGUpIHtcbiAgY29uc3Qge3R5cGV9ID0gdGVtcGxhdGVcbiAgY29uc3Qgb3B0aW9ucyA9IG5hdGl2ZUNvbXBvbmVudE1hcFt0eXBlXVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICBleHRlbmQodGVtcGxhdGUsIG9wdGlvbnMpXG4gIH1cbn1cblxuLyoqXG4gKiBiaW5kIGFsbCBpZCwgYXR0ciwgY2xhc3NuYW1lcywgc3R5bGUsIGV2ZW50cyB0byBhbiBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfYmluZEVsZW1lbnQoZWwsIHRlbXBsYXRlKSB7XG4gIHRoaXMuX3NldElkKHRlbXBsYXRlLmlkLCBlbCwgdGhpcylcbiAgdGhpcy5fc2V0QXR0cihlbCwgdGVtcGxhdGUuYXR0cilcbiAgdGhpcy5fc2V0Q2xhc3MoZWwsIHRlbXBsYXRlLmNsYXNzTGlzdClcbiAgdGhpcy5fc2V0U3R5bGUoZWwsIHRlbXBsYXRlLnN0eWxlKVxuICB0aGlzLl9iaW5kRXZlbnRzKGVsLCB0ZW1wbGF0ZS5ldmVudHMpXG59XG5cbi8qKlxuICogYmluZCBhbGwgcHJvcHMgdG8gc3ViIHZtIGFuZCBiaW5kIGFsbCBzdHlsZSwgZXZlbnRzIHRvIHRoZSByb290IGVsZW1lbnRcbiAqIG9mIHRoZSBzdWIgdm0gaWYgaXQgZG9lc24ndCBoYXZlIGEgcmVwbGFjZWQgbXVsdGktbm9kZSBmcmFnbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gX2JpbmRTdWJWbShzdWJWbSwgdGVtcGxhdGUsIHJlcGVhdEl0ZW0pIHtcbiAgc3ViVm0gPSBzdWJWbSB8fCB7fVxuICB0ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8IHt9XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHN1YlZtLl9vcHRpb25zIHx8IHt9XG5cbiAgLy8gYmluZCBwcm9wc1xuICBsZXQgcHJvcHMgPSBvcHRpb25zLnByb3BzXG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMpKSB7XG4gICAgcHJvcHMgPSBwcm9wcy5yZWR1Y2UoKHJlc3VsdCwgdmFsdWUpID0+IHtcbiAgICAgIHJlc3VsdFt2YWx1ZV0gPSB0cnVlXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSwge30pXG4gIH1cblxuICBtZXJnZVByb3BzKHJlcGVhdEl0ZW0sIHByb3BzLCB0aGlzLCBzdWJWbSlcbiAgbWVyZ2VQcm9wcyh0ZW1wbGF0ZS5hdHRyLCBwcm9wcywgdGhpcywgc3ViVm0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfYmluZFN1YlZtQWZ0ZXJJbml0aWFsaXplZChzdWJWbSwgdGVtcGxhdGUpIHtcbiAgbWVyZ2VDbGFzc1N0eWxlKHRlbXBsYXRlLmNsYXNzTGlzdCwgdGhpcywgc3ViVm0pXG4gIG1lcmdlU3R5bGUodGVtcGxhdGUuc3R5bGUsIHRoaXMsIHN1YlZtKVxuICBtZXJnZUV2ZW50KHRlbXBsYXRlLmV2ZW50cywgdGhpcywgc3ViVm0pXG59XG5cbmZ1bmN0aW9uIG1lcmdlUHJvcHModGFyZ2V0LCBwcm9wcywgdm0sIHN1YlZtKSB7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gdGFyZ2V0KSB7XG4gICAgaWYgKCFwcm9wcyB8fCBwcm9wc1trZXldKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRhcmdldFtrZXldXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gdm0uX3dhdGNoKHZhbHVlLCBmdW5jdGlvbiAodikge1xuICAgICAgICAgIHN1YlZtW2tleV0gPSB2XG4gICAgICAgIH0pXG4gICAgICAgIHN1YlZtW2tleV0gPSByZXR1cm5WYWx1ZVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHN1YlZtW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZVN0eWxlKHRhcmdldCwgdm0sIHN1YlZtKSB7XG4gIGZvciAoY29uc3Qga2V5IGluIHRhcmdldCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0W2tleV1cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHZtLl93YXRjaCh2YWx1ZSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHN1YlZtLl9yb290RWwpIHtcbiAgICAgICAgICBzdWJWbS5fcm9vdEVsLnNldFN0eWxlKGtleSwgdilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHN1YlZtLl9yb290RWwuc2V0U3R5bGUoa2V5LCByZXR1cm5WYWx1ZSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoc3ViVm0uX3Jvb3RFbCkge1xuICAgICAgICBzdWJWbS5fcm9vdEVsLnNldFN0eWxlKGtleSwgdmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlQ2xhc3NTdHlsZSh0YXJnZXQsIHZtLCBzdWJWbSkge1xuICB2YXIgY3NzID0gdm0uX29wdGlvbnMgJiYgdm0uX29wdGlvbnMuc3R5bGUgfHwge31cblxuICBpZiAoIXN1YlZtLl9yb290RWwpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3QgdmFsdWUgPSB2bS5fd2F0Y2godGFyZ2V0LCAgdiA9PiB7XG4gICAgICBzZXRDbGFzc1N0eWxlKHN1YlZtLl9yb290RWwsIGNzcywgdilcbiAgICB9KVxuICAgIHNldENsYXNzU3R5bGUoc3ViVm0uX3Jvb3RFbCwgY3NzLCB2YWx1ZSlcbiAgfSBlbHNlIGlmICh0YXJnZXQpIHtcbiAgICBzZXRDbGFzc1N0eWxlKHN1YlZtLl9yb290RWwsIGNzcywgdGFyZ2V0KVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlRXZlbnQodGFyZ2V0LCB2bSwgc3ViVm0pIHtcbiAgaWYgKHRhcmdldCAmJiBzdWJWbS5fcm9vdEVsKSB7XG4gICAgZm9yIChjb25zdCB0eXBlIGluIHRhcmdldCkge1xuICAgICAgY29uc3QgaGFuZGxlciA9IHZtW3RhcmdldFt0eXBlXV1cbiAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgIHN1YlZtLl9yb290RWwuYWRkRXZlbnQodHlwZSwgYmluZChoYW5kbGVyLCB2bSkpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogYmluZCBpZCB0byBhbiBlbGVtZW50XG4gKiBlYWNoIGlkIGlzIHVuaXF1ZSBpbiBhIHdob2xlIHZtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfc2V0SWQoaWQsIGVsLCB2bSkge1xuICBjb25zdCBtYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobWFwLCB7XG4gICAgdm06IHtcbiAgICAgIHZhbHVlOiB2bSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuICAgIGVsOiB7XG4gICAgICBnZXQ6ICgpID0+IGVsIHx8IHZtLl9yb290RWwsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIGlmICh0eXBlb2YgaWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gaWRcbiAgICBpZCA9IGhhbmRsZXIuY2FsbCh0aGlzKVxuICAgIGlmIChpZCkge1xuICAgICAgdGhpcy5faWRzW2lkXSA9IG1hcFxuICAgIH1cbiAgICB0aGlzLl93YXRjaChoYW5kbGVyLCAobmV3SWQpID0+IHtcbiAgICAgIGlmIChuZXdJZCkge1xuICAgICAgICB0aGlzLl9pZHNbbmV3SWRdID0gbWFwXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBlbHNlIGlmIChpZCAmJiB0eXBlb2YgaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhpcy5faWRzW2lkXSA9IG1hcFxuICB9XG59XG5cbi8qKlxuICogYmluZCBhdHRyIHRvIGFuIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9zZXRBdHRyKGVsLCBhdHRyKSB7XG4gIHRoaXMuX2JpbmREaXIoZWwsICdhdHRyJywgYXR0cilcbn1cblxuZnVuY3Rpb24gc2V0Q2xhc3NTdHlsZShlbCwgY3NzLCBjbGFzc0xpc3QpIHtcbiAgY29uc3QgY2xhc3NTdHlsZSA9IHt9XG4gIGNvbnN0IGxlbmd0aCA9IGNsYXNzTGlzdC5sZW5ndGhcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBjc3NbY2xhc3NMaXN0W2ldXVxuICAgIGlmIChzdHlsZSkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gc3R5bGUpIHtcbiAgICAgICAgY2xhc3NTdHlsZVtrZXldID0gc3R5bGVba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbC5zZXRDbGFzc1N0eWxlKGNsYXNzU3R5bGUpXG59XG5cbi8qKlxuICogYmluZCBjbGFzc25hbWVzIHRvIGFuIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9zZXRDbGFzcyhlbCwgY2xhc3NMaXN0KSB7XG5cbiAgaWYgKHR5cGVvZiBjbGFzc0xpc3QgIT09ICdmdW5jdGlvbicgJiYgIUFycmF5LmlzQXJyYXkoY2xhc3NMaXN0KSkge1xuICAgIHJldHVyblxuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGNsYXNzTGlzdCkgJiYgIWNsYXNzTGlzdC5sZW5ndGgpIHtcbiAgICBlbC5zZXRDbGFzc1N0eWxlKHt9KVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3Qgc3R5bGUgPSB0aGlzLl9vcHRpb25zICYmIHRoaXMuX29wdGlvbnMuc3R5bGUgfHwge31cbiAgaWYgKHR5cGVvZiBjbGFzc0xpc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX3dhdGNoKGNsYXNzTGlzdCwgIHYgPT4ge1xuICAgICAgc2V0Q2xhc3NTdHlsZShlbCwgc3R5bGUsIHYpXG4gICAgfSlcbiAgICBzZXRDbGFzc1N0eWxlKGVsLCBzdHlsZSwgdmFsdWUpXG4gIH1cbiAgZWxzZSB7XG4gICAgc2V0Q2xhc3NTdHlsZShlbCwgc3R5bGUsIGNsYXNzTGlzdClcbiAgfVxufVxuXG4vKipcbiAqIGJpbmQgc3R5bGUgdG8gYW4gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gX3NldFN0eWxlKGVsLCBzdHlsZSkge1xuICB0aGlzLl9iaW5kRGlyKGVsLCAnc3R5bGUnLCBzdHlsZSlcbn1cblxuLyoqXG4gKiBhZGQgYW4gZXZlbnQgdHlwZSBhbmQgaGFuZGxlciB0byBhbiBlbGVtZW50IGFuZCBnZW5lcmF0ZSBhIGRvbSB1cGRhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9zZXRFdmVudChlbCwgdHlwZSwgaGFuZGxlcikge1xuICBlbC5hZGRFdmVudCh0eXBlLCBiaW5kKGhhbmRsZXIsIHRoaXMpKVxufVxuXG4vKipcbiAqIGFkZCBhbGwgZXZlbnRzIG9mIGFuIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9iaW5kRXZlbnRzKGVsLCBldmVudHMpIHtcbiAgaWYgKCFldmVudHMpIHtcbiAgICByZXR1cm5cbiAgfVxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICBsZXQgaSA9IGtleXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBjb25zdCBrZXkgPSBrZXlzW2ldXG4gICAgbGV0IGhhbmRsZXIgPSBldmVudHNba2V5XVxuICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGhhbmRsZXIgPSB0aGlzW2hhbmRsZXJdXG4gICAgfVxuICAgIHRoaXMuX3NldEV2ZW50KGVsLCBrZXksIGhhbmRsZXIpXG4gIH1cbn1cblxuLyoqXG4gKiBzZXQgYSBzZXJpZXMgb2YgbWVtYmVycyBhcyBhIGtpbmQgb2YgYW4gZWxlbWVudFxuICogZm9yIGV4YW1wbGU6IHN0eWxlLCBhdHRyLCAuLi5cbiAqIGlmIHRoZSB2YWx1ZSBpcyBhIGZ1bmN0aW9uIHRoZW4gYmluZCB0aGUgZGF0YSBjaGFuZ2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfYmluZERpcihlbCwgbmFtZSwgZGF0YSkge1xuICBpZiAoIWRhdGEpIHtcbiAgICByZXR1cm5cbiAgfVxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuICAgIGNvbnN0IHZhbHVlID0gZGF0YVtrZXldXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgdXBkYXRlID0gdmFsdWVcbiAgICAgIHRoaXMuX2JpbmRLZXkoZWwsIG5hbWUsIGtleSwgdXBkYXRlKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsW1NFVFRFUlNbbmFtZV1dKGtleSwgdmFsdWUpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogYmluZCBkYXRhIGNoYW5nZXMgdG8gYSBjZXJ0YWluIGtleSB0byBhIG5hbWUgc2VyaWVzIGluIGFuIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9iaW5kS2V5KGVsLCBuYW1lLCBrZXksIGNhbGMpIHtcbiAgY29uc3QgbWV0aG9kTmFtZSA9IFNFVFRFUlNbbmFtZV1cbiAgY29uc3Qgb2JqID0gZWxbbmFtZV1cbiAgLy8gd2F0Y2ggdGhlIGNhbGMsIGFuZCByZXR1cm5zIGEgdmFsdWUgYnkgY2FsYy5jYWxsKClcbiAgY29uc3QgdmFsdWUgPSB0aGlzLl93YXRjaChjYWxjLCAodmFsdWUpID0+IHtcbiAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgZWxbbWV0aG9kTmFtZV0oa2V5LCB2YWx1ZSlcbiAgICB9XG4gICAgY29uc3QgZGlmZmVyID0gdGhpcyAmJiB0aGlzLl9hcHAgJiYgdGhpcy5fYXBwLmRpZmZlclxuICAgIGlmIChkaWZmZXIpIHtcbiAgICAgIGRpZmZlci5hcHBlbmQoJ2VsZW1lbnQnLCBlbC5kZXB0aCwgZWwucmVmLCBoYW5kbGVyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGhhbmRsZXIoKVxuICAgIH1cbiAgfSlcblxuICBlbFttZXRob2ROYW1lXShrZXksIHZhbHVlKVxufVxuXG4vKipcbiAqIHdhdGNoIGEgY2FsYyBmdW5jdGlvbiBhbmQgY2FsbGJhY2sgaWYgdGhlIGNhbGMgdmFsdWUgY2hhbmdlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gX3dhdGNoKGNhbGMsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih0aGlzLCBjYWxjLCBmdW5jdGlvbiAodmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiYgdmFsdWUgPT09IG9sZFZhbHVlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY2FsbGJhY2sodmFsdWUpXG4gIH0pXG5cbiAgcmV0dXJuIHdhdGNoZXIudmFsdWVcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL3ZtL2RpcmVjdGl2ZS5qc1xuICoqLyIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLTIwMTUgWXV4aSBFdmFuIFlvdVxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxuLy8gdmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBPYnNlcnZlciA9IHJlcXVpcmUoJy4vb2JzZXJ2ZXInKVxuLy8gdmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2Vycy9leHByZXNzaW9uJylcbi8vIHZhciBiYXRjaGVyID0gcmVxdWlyZSgnLi9iYXRjaGVyJylcbnZhciB1aWQgPSAwXG5cbi8qKlxuICogQSB3YXRjaGVyIHBhcnNlcyBhbiBleHByZXNzaW9uLCBjb2xsZWN0cyBkZXBlbmRlbmNpZXMsXG4gKiBhbmQgZmlyZXMgY2FsbGJhY2sgd2hlbiB0aGUgZXhwcmVzc2lvbiB2YWx1ZSBjaGFuZ2VzLlxuICogVGhpcyBpcyB1c2VkIGZvciBib3RoIHRoZSAkd2F0Y2goKSBhcGkgYW5kIGRpcmVjdGl2ZXMuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgICAgICAgICAgICAgICAgLSB7QXJyYXl9IGZpbHRlcnNcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSB0d29XYXlcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBkZWVwXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gdXNlclxuICogICAgICAgICAgICAgICAgIC0ge0Z1bmN0aW9ufSBbcHJlUHJvY2Vzc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbi8vIGZ1bmN0aW9uIFdhdGNoZXIgKHZtLCBleHByZXNzaW9uLCBjYiwgb3B0aW9ucykge1xuZnVuY3Rpb24gV2F0Y2hlciAodm0sIHVwZGF0ZSwgY2IpIHtcbiAgdGhpcy52bSA9IHZtXG4gIHZtLl93YXRjaGVycy5wdXNoKHRoaXMpXG4gIC8vIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25cbiAgdGhpcy5jYiA9IGNiXG4gIHRoaXMuaWQgPSArK3VpZCAvLyB1aWQgZm9yIGJhdGNoaW5nXG4gIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICAvLyBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAvLyB0aGlzLmRlZXAgPSAhIW9wdGlvbnMuZGVlcFxuICAvLyB0aGlzLnVzZXIgPSAhIW9wdGlvbnMudXNlclxuICAvLyB0aGlzLnR3b1dheSA9ICEhb3B0aW9ucy50d29XYXlcbiAgLy8gdGhpcy5maWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzXG4gIC8vIHRoaXMucHJlUHJvY2VzcyA9IG9wdGlvbnMucHJlUHJvY2Vzc1xuICB0aGlzLmRlcHMgPSBbXVxuICB0aGlzLm5ld0RlcHMgPSBbXVxuICAvLyBwYXJzZSBleHByZXNzaW9uIGZvciBnZXR0ZXIvc2V0dGVyXG4gIC8vIHZhciByZXMgPSBleHBQYXJzZXIucGFyc2UoZXhwcmVzc2lvbiwgb3B0aW9ucy50d29XYXkpXG4gIC8vIHRoaXMuZ2V0dGVyID0gcmVzLmdldFxuICAvLyB0aGlzLnNldHRlciA9IHJlcy5zZXRcbiAgdGhpcy5nZXR0ZXIgPSB1cGRhdGVcbiAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0KClcbn1cblxudmFyIHAgPSBXYXRjaGVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEFkZCBhIGRlcGVuZGVuY3kgdG8gdGhpcyBkaXJlY3RpdmUuXG4gKlxuICogQHBhcmFtIHtEZXB9IGRlcFxuICovXG5cbnAuYWRkRGVwID0gZnVuY3Rpb24gKGRlcCkge1xuICB2YXIgbmV3RGVwcyA9IHRoaXMubmV3RGVwc1xuICB2YXIgb2xkID0gdGhpcy5kZXBzXG4gIGlmIChfLmluZGV4T2YobmV3RGVwcywgZGVwKSA8IDApIHtcbiAgICBuZXdEZXBzLnB1c2goZGVwKVxuICAgIHZhciBpID0gXy5pbmRleE9mKG9sZCwgZGVwKVxuICAgIGlmIChpIDwgMCkge1xuICAgICAgZGVwLmFkZFN1Yih0aGlzKVxuICAgIH0gZWxzZSB7XG4gICAgICBvbGRbaV0gPSBudWxsXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRXZhbHVhdGUgdGhlIGdldHRlciwgYW5kIHJlLWNvbGxlY3QgZGVwZW5kZW5jaWVzLlxuICovXG5cbnAuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmJlZm9yZUdldCgpXG4gIHZhciB2bSA9IHRoaXMudm1cbiAgdmFyIHZhbHVlXG4gIHRyeSB7XG4gICAgdmFsdWUgPSB0aGlzLmdldHRlci5jYWxsKHZtLCB2bSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGlmIChjb25maWcud2FybkV4cHJlc3Npb25FcnJvcnMpIHtcbiAgICAvLyAgIF8ud2FybihcbiAgICAvLyAgICAgJ0Vycm9yIHdoZW4gZXZhbHVhdGluZyBleHByZXNzaW9uIFwiJyArXG4gICAgLy8gICAgIHRoaXMuZXhwcmVzc2lvbiArICdcIjpcXG4gICAnICsgZVxuICAgIC8vICAgKVxuICAgIC8vIH1cbiAgICBfLndhcm4oJ0Vycm9yIHdoZW4gdXBkYXRlXCInKVxuICB9XG4gIC8vIFwidG91Y2hcIiBldmVyeSBwcm9wZXJ0eSBzbyB0aGV5IGFyZSBhbGwgdHJhY2tlZCBhc1xuICAvLyBkZXBlbmRlbmNpZXMgZm9yIGRlZXAgd2F0Y2hpbmdcbiAgaWYgKHRoaXMuZGVlcCkge1xuICAgIHRyYXZlcnNlKHZhbHVlKVxuICB9XG4gIGlmICh0aGlzLnByZVByb2Nlc3MpIHtcbiAgICB2YWx1ZSA9IHRoaXMucHJlUHJvY2Vzcyh2YWx1ZSlcbiAgfVxuICBpZiAodGhpcy5maWx0ZXJzKSB7XG4gICAgdmFsdWUgPSB2bS5fYXBwbHlGaWx0ZXJzKHZhbHVlLCBudWxsLCB0aGlzLmZpbHRlcnMsIGZhbHNlKVxuICB9XG4gIHRoaXMuYWZ0ZXJHZXQoKVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gLyoqXG4vLyAgKiBTZXQgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgd2l0aCB0aGUgc2V0dGVyLlxuLy8gICpcbi8vICAqIEBwYXJhbSB7Kn0gdmFsdWVcbi8vICAqL1xuXG4vLyBwLnNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuLy8gICB2YXIgdm0gPSB0aGlzLnZtXG4vLyAgIGlmICh0aGlzLmZpbHRlcnMpIHtcbi8vICAgICB2YWx1ZSA9IHZtLl9hcHBseUZpbHRlcnMoXG4vLyAgICAgICB2YWx1ZSwgdGhpcy52YWx1ZSwgdGhpcy5maWx0ZXJzLCB0cnVlKVxuLy8gICB9XG4vLyAgIHRyeSB7XG4vLyAgICAgdGhpcy5zZXR0ZXIuY2FsbCh2bSwgdm0sIHZhbHVlKVxuLy8gICB9IGNhdGNoIChlKSB7XG4vLyAgICAgLy8gaWYgKGNvbmZpZy53YXJuRXhwcmVzc2lvbkVycm9ycykge1xuLy8gICAgICAgXy53YXJuKFxuLy8gICAgICAgICAnRXJyb3Igd2hlbiBldmFsdWF0aW5nIHNldHRlciBcIicgK1xuLy8gICAgICAgICB0aGlzLmV4cHJlc3Npb24gKyAnXCI6XFxuICAgJyArIGVcbi8vICAgICAgIClcbi8vICAgICAvLyB9XG4vLyAgIH1cbi8vIH1cblxuLyoqXG4gKiBQcmVwYXJlIGZvciBkZXBlbmRlbmN5IGNvbGxlY3Rpb24uXG4gKi9cblxucC5iZWZvcmVHZXQgPSBmdW5jdGlvbiAoKSB7XG4gIE9ic2VydmVyLnRhcmdldCA9IHRoaXNcbn1cblxuLyoqXG4gKiBDbGVhbiB1cCBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxuICovXG5cbnAuYWZ0ZXJHZXQgPSBmdW5jdGlvbiAoKSB7XG4gIE9ic2VydmVyLnRhcmdldCA9IG51bGxcbiAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgZGVwID0gdGhpcy5kZXBzW2ldXG4gICAgaWYgKGRlcCkge1xuICAgICAgZGVwLnJlbW92ZVN1Yih0aGlzKVxuICAgIH1cbiAgfVxuICB0aGlzLmRlcHMgPSB0aGlzLm5ld0RlcHNcbiAgdGhpcy5uZXdEZXBzID0gW11cbn1cblxuLyoqXG4gKiBTdWJzY3JpYmVyIGludGVyZmFjZS5cbiAqIFdpbGwgYmUgY2FsbGVkIHdoZW4gYSBkZXBlbmRlbmN5IGNoYW5nZXMuXG4gKi9cblxuLy8gcC51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4vLyAgIGlmICghY29uZmlnLmFzeW5jIHx8IGNvbmZpZy5kZWJ1Zykge1xuLy8gICAgIHRoaXMucnVuKClcbi8vICAgfSBlbHNlIHtcbi8vICAgICBiYXRjaGVyLnB1c2godGhpcylcbi8vICAgfVxuLy8gfVxuXG4vLyAvKipcbi8vICAqIEJhdGNoZXIgam9iIGludGVyZmFjZS5cbi8vICAqIFdpbGwgYmUgY2FsbGVkIGJ5IHRoZSBiYXRjaGVyLlxuLy8gICovXG5cbi8vIHAucnVuID0gZnVuY3Rpb24gKCkge1xucC51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KClcbiAgICBpZiAoXG4gICAgICB2YWx1ZSAhPT0gdGhpcy52YWx1ZSB8fFxuICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHxcbiAgICAgIHRoaXMuZGVlcFxuICAgICkge1xuICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgICB0aGlzLmNiKHZhbHVlLCBvbGRWYWx1ZSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgc2VsZiBmcm9tIGFsbCBkZXBlbmRlbmNpZXMnIHN1YmNyaWJlciBsaXN0LlxuICovXG5cbnAudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gdm0ncyB3YXRjaGVyIGxpc3RcbiAgICAvLyB3ZSBjYW4gc2tpcCB0aGlzIGlmIHRoZSB2bSBpZiBiZWluZyBkZXN0cm95ZWRcbiAgICAvLyB3aGljaCBjYW4gaW1wcm92ZSB0ZWFyZG93biBwZXJmb3JtYW5jZS5cbiAgICBpZiAoIXRoaXMudm0uX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMudm0uX3dhdGNoZXJzLiRyZW1vdmUodGhpcylcbiAgICB9XG4gICAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdGhpcy5kZXBzW2ldLnJlbW92ZVN1Yih0aGlzKVxuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy52bSA9IHRoaXMuY2IgPSB0aGlzLnZhbHVlID0gbnVsbFxuICB9XG59XG5cblxuLyoqXG4gKiBSZWNydXNpdmVseSB0cmF2ZXJzZSBhbiBvYmplY3QgdG8gZXZva2UgYWxsIGNvbnZlcnRlZFxuICogZ2V0dGVycywgc28gdGhhdCBldmVyeSBuZXN0ZWQgcHJvcGVydHkgaW5zaWRlIHRoZSBvYmplY3RcbiAqIGlzIGNvbGxlY3RlZCBhcyBhIFwiZGVlcFwiIGRlcGVuZGVuY3kuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbmZ1bmN0aW9uIHRyYXZlcnNlIChvYmopIHtcbiAgdmFyIGtleSwgdmFsLCBpXG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIHZhbCA9IG9ialtrZXldXG4gICAgaWYgKF8uaXNBcnJheSh2YWwpKSB7XG4gICAgICBpID0gdmFsLmxlbmd0aFxuICAgICAgd2hpbGUgKGktLSkge3RyYXZlcnNlKHZhbFtpXSl9XG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHZhbCkpIHtcbiAgICAgIHRyYXZlcnNlKHZhbClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXYXRjaGVyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi92bS93YXRjaGVyLmpzXG4gKiovIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IERvY3VtZW50ICYgRWxlbWVudCBIZWxwZXJzLlxuICpcbiAqIHJlcXVpcmVkOlxuICogRG9jdW1lbnQjOiBjcmVhdGVFbGVtZW50LCBjcmVhdGVDb21tZW50LCBnZXRSZWZcbiAqIEVsZW1lbnQjOiBhcHBlbmRDaGlsZCwgaW5zZXJ0QmVmb3JlLCByZW1vdmVDaGlsZCwgbmV4dFNpYmxpbmdcbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhIGJvZHkgYnkgdHlwZVxuICogVXNpbmcgdGhpcy5fYXBwLmRvY1xuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gdHlwZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZUJvZHkodHlwZSkge1xuICBjb25zdCBkb2MgPSB0aGlzLl9hcHAuZG9jXG4gIHJldHVybiBkb2MuY3JlYXRlQm9keSh0eXBlKVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBlbGVtZW50IGJ5IHR5cGVcbiAqIFVzaW5nIHRoaXMuX2FwcC5kb2NcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHR5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jcmVhdGVFbGVtZW50KHR5cGUpIHtcbiAgY29uc3QgZG9jID0gdGhpcy5fYXBwLmRvY1xuICByZXR1cm4gZG9jLmNyZWF0ZUVsZW1lbnQodHlwZSlcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIGZyYWcgYmxvY2sgZm9yIGFuIGVsZW1lbnQuXG4gKiBUaGUgZnJhZyBibG9jayBoYXMgYSBzdGFydGVyLCBlbmRlciBhbmQgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZUJsb2NrKGVsZW1lbnQpIHtcbiAgY29uc3Qgc3RhcnQgPSB0aGlzLl9jcmVhdGVCbG9ja1N0YXJ0KClcbiAgY29uc3QgZW5kID0gdGhpcy5fY3JlYXRlQmxvY2tFbmQoKVxuICBjb25zdCBibG9ja0lkID0gbGFzdGVzdEJsb2NrSWQrK1xuICBpZiAoZWxlbWVudC5lbGVtZW50KSB7XG4gICAgZWxlbWVudC5lbGVtZW50Lmluc2VydEJlZm9yZShzdGFydCwgZWxlbWVudC5lbmQpXG4gICAgZWxlbWVudC5lbGVtZW50Lmluc2VydEJlZm9yZShlbmQsIGVsZW1lbnQuZW5kKVxuICAgIGVsZW1lbnQgPSBlbGVtZW50LmVsZW1lbnRcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHN0YXJ0KVxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZW5kKVxuICB9XG4gIHJldHVybiB7c3RhcnQsIGVuZCwgZWxlbWVudCwgYmxvY2tJZH1cbn1cblxubGV0IGxhc3Rlc3RCbG9ja0lkID0gMVxuXG4vKipcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgYmxvY2sgc3RhcnRlci5cbiAqIFVzaW5nIHRoaXMuX2FwcC5kb2NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jcmVhdGVCbG9ja1N0YXJ0KCkge1xuICBjb25zdCBkb2MgPSB0aGlzLl9hcHAuZG9jXG4gIGNvbnN0IGFuY2hvciA9IGRvYy5jcmVhdGVDb21tZW50KCdzdGFydCcpXG4gIHJldHVybiBhbmNob3Jcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIGJsb2NrIGVuZGVyLlxuICogVXNpbmcgdGhpcy5fYXBwLmRvY1xuICovXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZUJsb2NrRW5kKCkge1xuICBjb25zdCBkb2MgPSB0aGlzLl9hcHAuZG9jXG4gIGNvbnN0IGFuY2hvciA9IGRvYy5jcmVhdGVDb21tZW50KCdlbmQnKVxuICByZXR1cm4gYW5jaG9yXG59XG5cbi8qKlxuICogQXR0YWNoIHRhcmdldCB0byBhIGNlcnRhaW4gZGVzdCB1c2luZyBhcHBlbmRDaGlsZCBieSBkZWZhdWx0LlxuICogSWYgdGhlIGRlc3QgaXMgYSBmcmFnIGJsb2NrIHRoZW4gaW5zZXJ0IGJlZm9yZSB0aGUgZW5kZXIuXG4gKiBJZiB0aGUgdGFyZ2V0IGlzIGEgZnJhZyBibG9jayB0aGVuIGF0dGFjaCB0aGUgc3RhcnRlciBhbmQgZW5kZXIgaW4gb3JkZXIuXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSAge29iamVjdH0gZGVzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gX2F0dGFjaFRhcmdldCh0YXJnZXQsIGRlc3QpIHtcblxuICBpZiAoZGVzdC5lbGVtZW50KSB7XG4gICAgY29uc3QgYmVmb3JlID0gZGVzdC5lbmRcbiAgICBjb25zdCBhZnRlciA9IGRlc3QudXBkYXRlTWFya1xuICAgIC8vIHB1c2ggbmV3IHRhcmdldCBmb3Igd2F0Y2ggbGlzdCB1cGRhdGUgbGF0ZXJcbiAgICBpZiAoZGVzdC5jaGlsZHJlbikge1xuICAgICAgZGVzdC5jaGlsZHJlbi5wdXNoKHRhcmdldClcbiAgICB9XG4gICAgLy8gZm9yIGNoZWNrIHJlcGVhdCBjYXNlXG4gICAgaWYgKGFmdGVyKSB7XG4gICAgICB0aGlzLl9tb3ZlVGFyZ2V0KHRhcmdldCwgYWZ0ZXIpXG4gICAgICBkZXN0LnVwZGF0ZU1hcmsgPSB0YXJnZXQuZWxlbWVudCA/IHRhcmdldC5lbmQgOiB0YXJnZXRcbiAgICB9XG4gICAgZWxzZSBpZiAodGFyZ2V0LmVsZW1lbnQpIHtcbiAgICAgIGRlc3QuZWxlbWVudC5pbnNlcnRCZWZvcmUodGFyZ2V0LnN0YXJ0LCBiZWZvcmUpXG4gICAgICBkZXN0LmVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhcmdldC5lbmQsIGJlZm9yZSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkZXN0LmVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhcmdldCwgYmVmb3JlKVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodGFyZ2V0LmVsZW1lbnQpIHtcbiAgICAgIGRlc3QuYXBwZW5kQ2hpbGQodGFyZ2V0LnN0YXJ0KVxuICAgICAgZGVzdC5hcHBlbmRDaGlsZCh0YXJnZXQuZW5kKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGRlc3QuYXBwZW5kQ2hpbGQodGFyZ2V0KVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1vdmUgdGFyZ2V0IGJlZm9yZSBhIGNlcnRhaW4gZWxlbWVudC4gVGhlIHRhcmdldCBtYXliZSBibG9jayBvciBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0gIHtvYmplY3R9IGJlZm9yZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX21vdmVUYXJnZXQodGFyZ2V0LCBhZnRlcikge1xuICBpZiAodGFyZ2V0LmVsZW1lbnQpIHtcbiAgICB0aGlzLl9tb3ZlQmxvY2sodGFyZ2V0LCBhZnRlcilcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLl9tb3ZlRWxlbWVudCh0YXJnZXQsIGFmdGVyKVxuICB9XG59XG5cbi8qKlxuICogTW92ZSBlbGVtZW50IGJlZm9yZSBhIGNlcnRhaW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9IGVsZW1lbnRcbiAqIEBwYXJhbSAge29iamVjdH0gYmVmb3JlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfbW92ZUVsZW1lbnQoZWxlbWVudCwgYWZ0ZXIpIHtcbiAgY29uc3QgZG9jID0gdGhpcy5fYXBwLmRvY1xuICBjb25zdCBwYXJlbnQgPSBkb2MuZ2V0UmVmKGFmdGVyLnBhcmVudFJlZilcblxuICBpZiAocGFyZW50KSB7XG4gICAgcGFyZW50Lmluc2VydEFmdGVyKGVsZW1lbnQsIGFmdGVyKVxuICB9XG59XG5cbi8qKlxuICogTW92ZSBhbGwgZWxlbWVudHMgb2YgdGhlIGJsb2NrIGJlZm9yZSBhIGNlcnRhaW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9IGZyYWdCbG9ja1xuICogQHBhcmFtICB7b2JqZWN0fSBiZWZvcmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9tb3ZlQmxvY2soZnJhZ0Jsb2NrLCBhZnRlcikge1xuICBjb25zdCBkb2MgPSB0aGlzLl9hcHAuZG9jXG4gIGNvbnN0IHBhcmVudCA9IGRvYy5nZXRSZWYoYWZ0ZXIucGFyZW50UmVmKVxuXG4gIGlmIChwYXJlbnQpIHtcbiAgICBsZXQgZWwgPSBmcmFnQmxvY2suc3RhcnRcbiAgICBjb25zdCBncm91cCA9IFtlbF1cblxuICAgIHdoaWxlIChlbCAmJiBlbCAhPT0gZnJhZ0Jsb2NrLmVuZCkge1xuICAgICAgZWwgPSBlbC5uZXh0KClcbiAgICAgIGdyb3VwLnB1c2goZWwpXG4gICAgfVxuXG4gICAgbGV0IHRlbXAgPSBhZnRlclxuICAgIGdyb3VwLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICBwYXJlbnQuaW5zZXJ0QWZ0ZXIoZWwsIHRlbXApXG4gICAgICB0ZW1wID0gZWxcbiAgICB9KVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIHRhcmdldCBmcm9tIERPTSB0cmVlLlxuICogSWYgdGhlIHRhcmdldCBpcyBhIGZyYWcgYmxvY2sgdGhlbiBjYWxsIF9yZW1vdmVCbG9ja1xuICpcbiAqIEBwYXJhbSAge29iamVjdH0gdGFyZ2V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfcmVtb3ZlVGFyZ2V0KHRhcmdldCkge1xuXG4gIGlmICh0YXJnZXQuZWxlbWVudCkge1xuICAgIHRoaXMuX3JlbW92ZUJsb2NrKHRhcmdldClcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLl9yZW1vdmVFbGVtZW50KHRhcmdldClcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNlcnRhaW4gZWxlbWVudC5cbiAqIFVzaW5nIHRoaXMuX2FwcC5kb2NcbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9IHRhcmdldFxuICovXG5leHBvcnQgZnVuY3Rpb24gX3JlbW92ZUVsZW1lbnQodGFyZ2V0KSB7XG4gIGNvbnN0IGRvYyA9IHRoaXMuX2FwcC5kb2NcbiAgY29uc3QgcGFyZW50ID0gZG9jLmdldFJlZih0YXJnZXQucGFyZW50UmVmKVxuXG4gIGlmIChwYXJlbnQpIHtcbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGFyZ2V0KVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgZnJhZyBibG9jay5cbiAqIFRoZSBzZWNvbmQgcGFyYW0gZGVjaWRlcyB3aGV0aGVyIHRoZSBibG9jayBzZWxmIHNob3VsZCBiZSByZW1vdmVkIHRvby5cbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9ICBmcmFnQmxvY2tcbiAqIEBwYXJhbSAge0Jvb2xlYW59IHByZXNlcnZlQmxvY2s9ZmFsc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9yZW1vdmVCbG9jayhmcmFnQmxvY2ssIHByZXNlcnZlQmxvY2sgPSBmYWxzZSkge1xuICBjb25zdCByZXN1bHQgPSBbXVxuICBsZXQgZWwgPSBmcmFnQmxvY2suc3RhcnQubmV4dCgpXG5cbiAgd2hpbGUgKGVsICYmIGVsICE9PSBmcmFnQmxvY2suZW5kKSB7XG4gICAgcmVzdWx0LnB1c2goZWwpXG4gICAgZWwgPSBlbC5uZXh0KClcbiAgfVxuXG4gIGlmICghcHJlc2VydmVCbG9jaykge1xuICAgIHRoaXMuX3JlbW92ZUVsZW1lbnQoZnJhZ0Jsb2NrLnN0YXJ0KVxuICB9XG4gIHJlc3VsdC5mb3JFYWNoKChlbCkgPT4ge1xuICAgIHRoaXMuX3JlbW92ZUVsZW1lbnQoZWwpXG4gIH0pXG4gIGlmICghcHJlc2VydmVCbG9jaykge1xuICAgIHRoaXMuX3JlbW92ZUVsZW1lbnQoZnJhZ0Jsb2NrLmVuZClcbiAgfVxufVxuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi92bS9kb20taGVscGVyLmpzXG4gKiovIiwiZnVuY3Rpb24gRXZ0KHR5cGUsIGRldGFpbCkge1xuICBpZiAoZGV0YWlsIGluc3RhbmNlb2YgRXZ0KSB7XG4gICAgcmV0dXJuIGRldGFpbFxuICB9XG5cbiAgdGhpcy50aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gIHRoaXMuZGV0YWlsID0gZGV0YWlsXG4gIHRoaXMudHlwZSA9IHR5cGVcblxuICBsZXQgc2hvdWxkU3RvcCA9IGZhbHNlXG4gIHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzaG91bGRTdG9wID0gdHJ1ZVxuICB9XG4gIHRoaXMuaGFzU3RvcHBlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gc2hvdWxkU3RvcFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiAkZW1pdCh0eXBlLCBkZXRhaWwpIHtcbiAgY29uc3QgZXZlbnRzID0gdGhpcy5fdm1FdmVudHNcbiAgY29uc3QgaGFuZGxlckxpc3QgPSBldmVudHNbdHlwZV1cbiAgaWYgKGhhbmRsZXJMaXN0KSB7XG4gICAgbGV0IGV2dCA9IG5ldyBFdnQodHlwZSwgZGV0YWlsKVxuICAgIGhhbmRsZXJMaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBldnQpXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gJGRpc3BhdGNoKHR5cGUsIGRldGFpbCkge1xuICBjb25zdCBldnQgPSBuZXcgRXZ0KHR5cGUsIGRldGFpbClcbiAgdGhpcy4kZW1pdCh0eXBlLCBldnQpXG5cbiAgaWYgKCFldnQuaGFzU3RvcHBlZCgpICYmIHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuJGRpc3BhdGNoKSB7XG4gICAgdGhpcy5fcGFyZW50LiRkaXNwYXRjaCh0eXBlLCBldnQpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uICRicm9hZGNhc3QodHlwZSwgZGV0YWlsKSB7XG4gIGNvbnN0IGV2dCA9IG5ldyBFdnQodHlwZSwgZGV0YWlsKVxuICB0aGlzLiRlbWl0KHR5cGUsIGV2dClcblxuICBpZiAoIWV2dC5oYXNTdG9wcGVkKCkgJiYgdGhpcy5fY2hpbGRyZW5WbXMpIHtcbiAgICB0aGlzLl9jaGlsZHJlblZtcy5mb3JFYWNoKChzdWJWbSkgPT4ge1xuICAgICAgc3ViVm0uJGJyb2FkY2FzdCh0eXBlLCBldnQpXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gJG9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgaWYgKCF0eXBlIHx8IHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3QgZXZlbnRzID0gdGhpcy5fdm1FdmVudHNcbiAgY29uc3QgaGFuZGxlckxpc3QgPSBldmVudHNbdHlwZV0gfHwgW11cbiAgaGFuZGxlckxpc3QucHVzaChoYW5kbGVyKVxuICBldmVudHNbdHlwZV0gPSBoYW5kbGVyTGlzdFxuXG4gIC8vIGZpeGVkIG9sZCB2ZXJzaW9uIGxpZmVjeWNsZSBkZXNpZ25cbiAgaWYgKHR5cGUgPT09ICdob29rOnJlYWR5JyAmJiB0aGlzLl9yZWFkeSkge1xuICAgIHRoaXMuJGVtaXQoJ2hvb2s6cmVhZHknKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiAkb2ZmKHR5cGUsIGhhbmRsZXIpIHtcbiAgaWYgKCF0eXBlKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3QgZXZlbnRzID0gdGhpcy5fdm1FdmVudHNcbiAgaWYgKCFoYW5kbGVyKSB7XG4gICAgZGVsZXRlIGV2ZW50c1t0eXBlXVxuICAgIHJldHVyblxuICB9XG4gIGNvbnN0IGhhbmRsZXJMaXN0ID0gZXZlbnRzW3R5cGVdXG4gIGlmICghaGFuZGxlckxpc3QpIHtcbiAgICByZXR1cm5cbiAgfVxuICBoYW5kbGVyTGlzdC4kcmVtb3ZlKGhhbmRsZXIpXG59XG5cbmNvbnN0IExJRkVfQ1lDTEVfVFlQRVMgPSBbJ2luaXQnLCAnY3JlYXRlZCcsICdyZWFkeSddXG5cbmV4cG9ydCBmdW5jdGlvbiBfaW5pdEV2ZW50cyhleHRlcm5hbEV2ZW50cykge1xuICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB7fVxuICBjb25zdCBldmVudHMgPSBvcHRpb25zLmV2ZW50cyB8fCB7fVxuICBmb3IgKGNvbnN0IHR5cGUxIGluIGV2ZW50cykge1xuICAgIHRoaXMuJG9uKHR5cGUxLCBldmVudHNbdHlwZTFdKVxuICB9XG4gIGZvciAoY29uc3QgdHlwZTIgaW4gZXh0ZXJuYWxFdmVudHMpIHtcbiAgICB0aGlzLiRvbih0eXBlMiwgZXh0ZXJuYWxFdmVudHNbdHlwZTJdKVxuICB9XG4gIExJRkVfQ1lDTEVfVFlQRVMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgIHRoaXMuJG9uKGBob29rOiR7dHlwZX1gLCBvcHRpb25zW3R5cGVdKVxuICB9KVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvdm0vZXZlbnRzLmpzXG4gKiovIiwibGV0IG5hdGl2ZU1vZHVsZXMgPSB7fVxuXG5mdW5jdGlvbiBhc3NpZ25Nb2R1bGVzKG1vZHVsZXMsIGlmUmVwbGFjZSkge1xuXG4gIGZvciAoY29uc3QgbW9kdWxlTmFtZSBpbiBtb2R1bGVzKSB7XG5cbiAgICAvLyBpbml0IGBtb2R1bGVzW21vZHVsZU5hbWVdW11gXG4gICAgbGV0IG1ldGhvZHMgPSBuYXRpdmVNb2R1bGVzW21vZHVsZU5hbWVdXG4gICAgaWYgKCFtZXRob2RzKSB7XG4gICAgICBtZXRob2RzID0ge31cbiAgICAgIG5hdGl2ZU1vZHVsZXNbbW9kdWxlTmFtZV0gPSBtZXRob2RzXG4gICAgfVxuXG4gICAgLy8gcHVzaCBlYWNoIG5vbi1leGlzdGVkIG5ldyBtZXRob2RcbiAgICBtb2R1bGVzW21vZHVsZU5hbWVdLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG1ldGhvZCA9IHtcbiAgICAgICAgICBuYW1lOiBtZXRob2RcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIW1ldGhvZHNbbWV0aG9kLm5hbWVdIHx8IGlmUmVwbGFjZSkge1xuICAgICAgICBtZXRob2RzW21ldGhvZC5uYW1lXSA9IG1ldGhvZFxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzaWduQXBpcyhDdG9yLCBhcGlzKSB7XG4gIGNvbnN0IHAgPSBDdG9yLnByb3RvdHlwZVxuXG4gIGZvciAoY29uc3QgYXBpTmFtZSBpbiBhcGlzKSB7XG4gICAgaWYgKCFwLmhhc093blByb3BlcnR5KGFwaU5hbWUpKSB7XG4gICAgICBwW2FwaU5hbWVdID0gYXBpc1thcGlOYW1lXVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNb2R1bGVzKCkge1xuICBuYXRpdmVNb2R1bGVzID0ge31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vZHVsZShtb2R1bGVOYW1lKSB7XG4gIHJldHVybiBuYXRpdmVNb2R1bGVzW21vZHVsZU5hbWVdXG59XG5cbi8qKlxuICogQGNvbnRleHQgYSBpbnN0YW5jZSBvZiBBcHBJbnN0YW5jZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZU1vZHVsZShtb2R1bGVOYW1lKSB7XG4gIGNvbnN0IG1ldGhvZHMgPSBuYXRpdmVNb2R1bGVzW21vZHVsZU5hbWVdXG4gIGNvbnN0IHRhcmdldCA9IHt9XG5cbiAgZm9yIChjb25zdCBtZXRob2ROYW1lIGluIG1ldGhvZHMpIHtcbiAgICB0YXJnZXRbbWV0aG9kTmFtZV0gPSAoLi4uYXJncykgPT4gdGhpcy5jYWxsVGFza3Moe1xuICAgICAgbW9kdWxlOiBtb2R1bGVOYW1lLFxuICAgICAgbWV0aG9kOiBtZXRob2ROYW1lLFxuICAgICAgYXJnczogYXJnc1xuICAgIH0pXG4gIH1cblxuICByZXR1cm4gdGFyZ2V0XG59XG5cbi8qKlxuICogQGNvbnRleHQgVm1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyTW9kdWxlcyhtb2R1bGVzLCBpZlJlcGxhY2UpIHtcbiAgYXNzaWduTW9kdWxlcyhtb2R1bGVzLCBpZlJlcGxhY2UpXG59XG5cbi8qKlxuICogQGNvbnRleHQgVm1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyTWV0aG9kcyhhcGlzKSB7XG4gIGFzc2lnbkFwaXModGhpcywgYXBpcylcbn1cblxuLyoqXG4gKiBAY29udGV4dCBhIGluc3RhbmNlIG9mIEFwcEluc3RhbmNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlQ29tcG9uZW50KG5hbWUpIHtcbiAgY29uc3Qge2N1c3RvbUNvbXBvbmVudE1hcH0gPSB0aGlzXG4gIHJldHVybiBjdXN0b21Db21wb25lbnRNYXBbbmFtZV1cbn1cblxuLyoqXG4gKiBAY29udGV4dCBhIGluc3RhbmNlIG9mIEFwcEluc3RhbmNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudChuYW1lLCBleHBvcnRzKSB7XG4gIGNvbnN0IHtjdXN0b21Db21wb25lbnRNYXB9ID0gdGhpc1xuXG4gIGlmIChjdXN0b21Db21wb25lbnRNYXBbbmFtZV0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGRlZmluZSBhIGNvbXBvbmVudCgke25hbWV9KSB0aGF0IGFscmVhZHkgZXhpc3RzYClcbiAgfVxuXG4gIGN1c3RvbUNvbXBvbmVudE1hcFtuYW1lXSA9IGV4cG9ydHNcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9hcHAvcmVnaXN0ZXIuanNcbiAqKi8iLCJpbXBvcnQgc2VtdmVyIGZyb20gJ3NlbXZlcidcbmltcG9ydCB7ZXh0ZW5kLCBpc1BsYWluT2JqZWN0LCB0eXBvZn0gIGZyb20gJy4uL3V0aWwnXG5cbi8qKlxuICogW25vcm1hbGl6ZVZlcnNpb24gZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtTdHJpbmd9IFZlcnNpb24uIGllOiAxLCAxLjAsIDEuMC4wXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFZlcnNpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVZlcnNpb24gKHYpIHtcbiAgY29uc3QgaXNWYWxpZCA9IHNlbXZlci52YWxpZCh2KSA/IHRydWUgOiBmYWxzZVxuICBpZiAoaXNWYWxpZCkge1xuICAgIHJldHVybiB2XG4gIH1cblxuICB2ID0gdHlwZW9mICh2KSA9PT0gJ3N0cmluZycgPyB2IDogJydcbiAgY29uc3Qgc3BsaXQgPSB2LnNwbGl0KCcuJylcbiAgbGV0IGkgPSAwXG4gIGxldCByZXN1bHQgPSBbXVxuXG4gIHdoaWxlIChpIDwgMykge1xuICAgIGNvbnN0IHMgPSB0eXBlb2YgKHNwbGl0W2ldKSA9PT0gJ3N0cmluZycgJiYgc3BsaXRbaV0gPyBzcGxpdFtpXSA6ICcwJ1xuICAgIHJlc3VsdC5wdXNoKHMpXG4gICAgaSsrXG4gIH1cblxuICByZXR1cm4gcmVzdWx0LmpvaW4oJy4nKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXJyb3IgKGtleSwgdmFsLCBjcml0ZXJpYSkge1xuICBsZXQgcmVzdWx0ID0ge1xuICAgIGlzRG93bmdyYWRlOiB0cnVlLFxuICAgIGVycm9yVHlwZTogMSxcbiAgICBjb2RlOiAxMDAwXG4gIH1cbiAgbGV0IGdldE1zZyA9IGZ1bmN0aW9uIChrZXksIHZhbCwgY3JpdGVyaWEpIHtcbiAgICByZXR1cm4gJ0Rvd25ncmFkZVsnICsga2V5ICsgJ10gOjogZGV2aWNlSW5mbyAnXG4gICAgICArIHZhbCArICcgbWF0Y2hlZCBjcml0ZXJpYSAnICsgY3JpdGVyaWFcbiAgfVxuICBjb25zdCBfa2V5ID0ga2V5LnRvTG93ZXJDYXNlKClcblxuICByZXN1bHQuZXJyb3JNZXNzYWdlID0gZ2V0TXNnKGtleSwgdmFsLCBjcml0ZXJpYSlcblxuICBpZiAoX2tleS5pbmRleE9mKCdvc3ZlcnNpb24nKSA+PSAwKSB7XG4gICAgcmVzdWx0LmNvZGUgPSAxMDAxXG4gIH1lbHNlIGlmIChfa2V5LmluZGV4T2YoJ2FwcHZlcnNpb24nKSA+PSAwKSB7XG4gICAgcmVzdWx0LmNvZGUgPSAxMDAyXG4gIH1lbHNlIGlmIChfa2V5LmluZGV4T2YoJ3dlZXh2ZXJzaW9uJykgPj0gMCkge1xuICAgIHJlc3VsdC5jb2RlID0gMTAwM1xuICB9ZWxzZSBpZiAoX2tleS5pbmRleE9mKCdkZXZpY2Vtb2RlbCcpID49IDApIHtcbiAgICByZXN1bHQuY29kZSA9IDEwMDRcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuLyoqXG4gKiBXRUVYIGZyYW1ld29yayBpbnB1dChkZXZpY2VJbmZvKVxuICoge1xuICogICBwbGF0Zm9ybTogJ2lPUycgb3IgJ2FuZHJvaWQnXG4gKiAgIG9zVmVyc2lvbjogJzEuMC4wJyBvciAnMS4wJyBvciAnMSdcbiAqICAgYXBwVmVyc2lvbjogJzEuMC4wJyBvciAnMS4wJyBvciAnMSdcbiAqICAgd2VleFZlcnNpb246ICcxLjAuMCcgb3IgJzEuMCcgb3IgJzEnXG4gKiAgIGREZXZpY2VNb2RlbDogJ01PREVMX05BTUUnXG4gKiB9XG4gKlxuICogZG93bmdyYWRlIGNvbmZpZyhjb25maWcpXG4gKiB7XG4gKiAgIGlvczoge1xuICogICAgIG9zVmVyc2lvbjogJz4xLjAuMCcgb3IgJz49MS4wLjAnIG9yICc8MS4wLjAnIG9yICc8PTEuMC4wJyBvciAnMS4wLjAnXG4gKiAgICAgYXBwVmVyc2lvbjogJz4xLjAuMCcgb3IgJz49MS4wLjAnIG9yICc8MS4wLjAnIG9yICc8PTEuMC4wJyBvciAnMS4wLjAnXG4gKiAgICAgd2VleFZlcnNpb246ICc+MS4wLjAnIG9yICc+PTEuMC4wJyBvciAnPDEuMC4wJyBvciAnPD0xLjAuMCcgb3IgJzEuMC4wJ1xuICogICAgIGRldmljZU1vZGVsOiBbJ21vZGVsQScsICdtb2RlbEInLCAuLi5dXG4gKiAgIH0sXG4gKiAgIGFuZHJvaWQ6IHtcbiAqICAgICBvc1ZlcnNpb246ICc+MS4wLjAnIG9yICc+PTEuMC4wJyBvciAnPDEuMC4wJyBvciAnPD0xLjAuMCcgb3IgJzEuMC4wJ1xuICogICAgIGFwcFZlcnNpb246ICc+MS4wLjAnIG9yICc+PTEuMC4wJyBvciAnPDEuMC4wJyBvciAnPD0xLjAuMCcgb3IgJzEuMC4wJ1xuICogICAgIHdlZXhWZXJzaW9uOiAnPjEuMC4wJyBvciAnPj0xLjAuMCcgb3IgJzwxLjAuMCcgb3IgJzw9MS4wLjAnIG9yICcxLjAuMCdcbiAqICAgICBkZXZpY2VNb2RlbDogWydtb2RlbEEnLCAnbW9kZWxCJywgLi4uXVxuICogICB9XG4gKiB9XG4gKlxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gZGV2aWNlSW5mbyBXZWV4IFNESyBmcmFtZXdvcmsgaW5wdXRcbiAqIEBwYXJhbSAge29iamVjdH0gY29uZmlnICAgICB1c2VyIGlucHV0XG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgeyBpc0Rvd25ncmFkZTogdHJ1ZS9mYWxzZSwgZXJyb3JNZXNzYWdlLi4uIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrIChjb25maWcsIGRldmljZUluZm8pIHtcbiAgZGV2aWNlSW5mbyA9IGRldmljZUluZm8gfHwgZ2xvYmFsLldYRW52aXJvbm1lbnRcbiAgZGV2aWNlSW5mbyA9IGlzUGxhaW5PYmplY3QoZGV2aWNlSW5mbykgPyBkZXZpY2VJbmZvIDoge31cbiAgY29uZmlnID0gaXNQbGFpbk9iamVjdChjb25maWcpID8gY29uZmlnIDoge31cbiAgY29uc3QgcGxhdGZvcm0gPSBkZXZpY2VJbmZvLnBsYXRmb3JtIHx8ICd1bmtub3cnXG4gIGNvbnN0IGRQbGF0Zm9ybSA9IHBsYXRmb3JtLnRvTG93ZXJDYXNlKClcbiAgY29uc3QgY09iaiA9IGNvbmZpZ1tkUGxhdGZvcm1dIHx8IHt9XG5cbiAgbGV0IHJlc3VsdCA9IHtcbiAgICBpc0Rvd25ncmFkZTogZmFsc2UgLy8gZGVmYXV0bCBpcyBwYXNzXG4gIH1cblxuICBmb3IgKGxldCBpIGluIGRldmljZUluZm8pIHtcbiAgICBjb25zdCBrZXkgPSBpXG4gICAgY29uc3Qga2V5TG93ZXIgPSBrZXkudG9Mb3dlckNhc2UoKVxuICAgIGNvbnN0IHZhbCA9IGRldmljZUluZm9baV1cbiAgICBjb25zdCBpc1ZlcnNpb24gPSBrZXlMb3dlci5pbmRleE9mKCd2ZXJzaW9uJykgPj0gMCA/IHRydWUgOiBmYWxzZVxuICAgIGNvbnN0IGlzRGV2aWNlTW9kZWwgPSBrZXlMb3dlci5pbmRleE9mKCdkZXZpY2Vtb2RlbCcpID49IDAgPyB0cnVlIDogZmFsc2VcbiAgICBjb25zdCBjcml0ZXJpYSA9IGNPYmpbaV1cblxuICAgIGlmIChjcml0ZXJpYSAmJiBpc1ZlcnNpb24pIHtcbiAgICAgIGNvbnN0IGMgPSB0aGlzLm5vcm1hbGl6ZVZlcnNpb24oY3JpdGVyaWEpXG4gICAgICBjb25zdCBkID0gdGhpcy5ub3JtYWxpemVWZXJzaW9uKGRldmljZUluZm9baV0pXG5cbiAgICAgIGlmIChzZW12ZXIuc2F0aXNmaWVzKGQsIGMpKSB7XG4gICAgICAgIHJlc3VsdCA9IGV4dGVuZCh0aGlzLmdldEVycm9yKGtleSwgdmFsLCBjcml0ZXJpYSkpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfWVsc2UgaWYgKGlzRGV2aWNlTW9kZWwpIHtcbiAgICAgIGNvbnN0IF9jcml0ZXJpYSA9IHR5cG9mKGNyaXRlcmlhKSA9PT0gJ2FycmF5JyA/IGNyaXRlcmlhIDogW2NyaXRlcmlhXVxuICAgICAgaWYgKF9jcml0ZXJpYS5pbmRleE9mKHZhbCkgPj0gMCkge1xuICAgICAgICByZXN1bHQgPSBleHRlbmQodGhpcy5nZXRFcnJvcihrZXksIHZhbCwgY3JpdGVyaWEpKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9hcHAvZG93bmdyYWRlLmpzXG4gKiovIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBpbnN0YW5jZSBjb250cm9scyBmcm9tIG5hdGl2ZVxuICpcbiAqIC0gaW5pdCBidW5kbGVcbiAqIC0gZmlyZSBldmVudFxuICogLSBjYWxsYmFja1xuICogLSBkZXN0cm95XG4gKlxuICogY29ycmVzcG9uZGVkIHdpdGggdGhlIEFQSSBvZiBpbnN0YW5jZSBtYW5hZ2VyIChmcmFtZXdvcmsuanMpXG4gKi9cblxuaW1wb3J0IHtcbiAgYmluZCwgZXh0ZW5kXG59XG5mcm9tICcuLi91dGlsJ1xuaW1wb3J0ICogYXMgcGVyZiBmcm9tICcuLi9wZXJmJ1xuaW1wb3J0IExpc3RlbmVyLCB7Y3JlYXRlQWN0aW9ufSBmcm9tICcuL2RvbS1saXN0ZW5lcidcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoY29kZSwgZGF0YSkge1xuICB2YXIgcmVzdWx0XG4gIC8vIEBzZWU6IGxpYi9hcHAvYnVuZGxlLmpzXG4gIGNvbnN0IGRlZmluZSA9IGJpbmQodGhpcy5kZWZpbmUsIHRoaXMpXG4gIGNvbnN0IGJvb3RzdHJhcCA9IChuYW1lLCBjb25maWcsIF9kYXRhKSA9PiB7XG4gICAgcmVzdWx0ID0gdGhpcy5ib290c3RyYXAobmFtZSwgY29uZmlnLCBfZGF0YSB8fCBkYXRhKVxuICAgIHRoaXMuZG9jLmxpc3RlbmVyLmNyZWF0ZUZpbmlzaCgpXG4gICAgdGhpcy5kb2MuY2xvc2UoKVxuICB9XG5cbiAgLy8gYmFja3dhcmQocmVnaXN0ZXIvcmVuZGVyKVxuICBjb25zdCByZWdpc3RlciA9IGJpbmQodGhpcy5yZWdpc3RlciwgdGhpcylcbiAgY29uc3QgcmVuZGVyID0gKG5hbWUsIF9kYXRhKSA9PiB7XG4gICAgcmVzdWx0ID0gdGhpcy5ib290c3RyYXAobmFtZSwge30sIF9kYXRhKVxuICB9XG5cbiAgY29uc3QgcmVxdWlyZSA9IG5hbWUgPT4gX2RhdGEgPT4ge1xuICAgIHJlc3VsdCA9IHRoaXMuYm9vdHN0cmFwKG5hbWUsIHt9LCBfZGF0YSlcbiAgfVxuXG4gIGNvbnN0IGRvY3VtZW50ID0gdGhpcy5kb2NcblxuICBwZXJmLnN0YXJ0KCdydW4gYnVuZGxlJywgdGhpcy5pZClcblxuICBsZXQgZnVuY3Rpb25Cb2R5XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIGNvZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBgZnVuY3Rpb24gKCkgey4uLn1gIC0+IGB7Li4ufWBcbiAgICAvLyBub3QgdmVyeSBzdHJpY3RcbiAgICBmdW5jdGlvbkJvZHkgPSBjb2RlLnRvU3RyaW5nKCkuc3Vic3RyKDEyKVxuICB9IGVsc2UgaWYgKGNvZGUpIHtcbiAgICBmdW5jdGlvbkJvZHkgPSBjb2RlLnRvU3RyaW5nKClcbiAgfVxuXG4gIGxldCBmbiA9IG5ldyBGdW5jdGlvbihcbiAgICAnZGVmaW5lJyxcbiAgICAncmVxdWlyZScsXG4gICAgJ2RvY3VtZW50JyxcbiAgICAnYm9vdHN0cmFwJyxcbiAgICAncmVnaXN0ZXInLFxuICAgICdyZW5kZXInLFxuICAgICdfX3dlZXhfZGVmaW5lX18nLCAvLyBhbGlhcyBmb3IgZGVmaW5lXG4gICAgJ19fd2VleF9ib290c3RyYXBfXycsIC8vIGFsaWFzIGZvciBib290c3RyYXBcbiAgICBmdW5jdGlvbkJvZHlcbiAgKVxuXG4gIGZuKFxuICAgIGRlZmluZSxcbiAgICByZXF1aXJlLFxuICAgIGRvY3VtZW50LFxuICAgIGJvb3RzdHJhcCxcbiAgICByZWdpc3RlcixcbiAgICByZW5kZXIsXG4gICAgZGVmaW5lLFxuICAgIGJvb3RzdHJhcClcblxuICBwZXJmLmVuZCgncnVuIGJ1bmRsZScsIHRoaXMuaWQpXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gIHRoaXMuaWQgPSAnJ1xuICB0aGlzLmV2ZW50TWFuYWdlciA9IG51bGxcbiAgdGhpcy5vcHRpb25zID0gbnVsbFxuICB0aGlzLmJsb2NrcyA9IG51bGxcbiAgdGhpcy52bSA9IG51bGxcbiAgdGhpcy5kb2MgPSBudWxsXG4gIHRoaXMuY3VzdG9tQ29tcG9uZW50TWFwID0gbnVsbFxuICB0aGlzLmNhbGxiYWNrcyA9IG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJvb3RFbGVtZW50KCkge1xuICBjb25zdCBkb2MgPSB0aGlzLmRvYyB8fCB7fVxuICBjb25zdCBib2R5ID0gZG9jLmJvZHkgfHwge31cbiAgcmV0dXJuIGJvZHkudG9KU09OID8gYm9keS50b0pTT04oKSA6IHt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBY3Rpb25zKGFkZG9uVGFza3MpIHtcbiAgdGhpcy5kaWZmZXIuZmx1c2goKVxuICBjb25zdCB0YXNrcyA9IFtdXG4gIGlmICh0aGlzLmxpc3RlbmVyICYmIHRoaXMubGlzdGVuZXIudXBkYXRlcy5sZW5ndGgpIHtcbiAgICB0YXNrcy5wdXNoKC4uLnRoaXMubGlzdGVuZXIudXBkYXRlcylcbiAgICB0aGlzLmxpc3RlbmVyLnVwZGF0ZXMgPSBbXVxuICB9XG4gIGlmIChhZGRvblRhc2tzICYmIGFkZG9uVGFza3MubGVuZ3RoKSB7XG4gICAgdGFza3MucHVzaCguLi5hZGRvblRhc2tzKVxuICB9XG4gIGlmICh0YXNrcy5sZW5ndGgpIHtcbiAgICB0aGlzLmNhbGxUYXNrcyh0YXNrcylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlyZUV2ZW50KHJlZiwgdHlwZSwgZSwgZG9tQ2hhbmdlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheShyZWYpKSB7XG4gICAgcmVmLnNvbWUoKHJlZikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZmlyZUV2ZW50KHJlZiwgdHlwZSwgZSkgIT09IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IGVsID0gdGhpcy5kb2MuZ2V0UmVmKHJlZilcblxuICBpZiAoZWwpIHtcbiAgICBwZXJmLnN0YXJ0KCdtYW5hZ2UgZXZlbnQnLCByZWYgKyAnLScgKyB0eXBlKVxuICAgIGUgPSBlIHx8IHt9XG4gICAgZS50eXBlID0gdHlwZVxuICAgIGUudGFyZ2V0ID0gZWxcbiAgICBlLnRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICBpZiAoZG9tQ2hhbmdlcykge1xuICAgICAgdXBkYXRlRWxlbWVudChlbCwgZG9tQ2hhbmdlcylcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5ldmVudE1hbmFnZXIuZmlyZShlbCwgdHlwZSwgZSlcbiAgICBwZXJmLmVuZCgnbWFuYWdlIGV2ZW50JywgcmVmICsgJy0nICsgdHlwZSlcbiAgICB0aGlzLnVwZGF0ZUFjdGlvbnMoKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIHJldHVybiBuZXcgRXJyb3IoYGludmFsaWQgZWxlbWVudCByZWZlcmVuY2UgXCIke3JlZn1cImApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxsYmFjayhjYWxsYmFja0lkLCBkYXRhLCBpZktlZXBBbGl2ZSkge1xuICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2NhbGxiYWNrSWRdXG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrKGRhdGEpIC8vIGRhdGEgaXMgYWxyZWFkeSBhIG9iamVjdCwgQHNlZTogbGliL2ZyYW1ld29yay5qc1xuXG4gICAgaWYgKHR5cGVvZiBpZktlZXBBbGl2ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgaWZLZWVwQWxpdmUgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrc1tjYWxsYmFja0lkXSA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQWN0aW9ucygpXG4gICAgcmV0dXJuXG4gIH1cblxuICByZXR1cm4gbmV3IEVycm9yKGBpbnZhbGlkIGNhbGxiYWNrIGlkIFwiJHtjYWxsYmFja0lkfVwiYClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZnJlc2hEYXRhKGRhdGEpIHtcbiAgY29uc3Qgdm0gPSB0aGlzLnZtXG5cbiAgaWYgKHZtICYmIGRhdGEpIHtcbiAgICBpZiAodHlwZW9mIHZtLnJlZnJlc2hEYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2bS5yZWZyZXNoRGF0YShkYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICBleHRlbmQodm0sIGRhdGEpXG4gICAgfVxuICAgIHRoaXMudXBkYXRlQWN0aW9ucyhbY3JlYXRlQWN0aW9uKCdyZWZyZXNoRmluaXNoJywgW10pXSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIHJldHVybiBuZXcgRXJyb3IoYGludmFsaWQgZGF0YSBcIiR7ZGF0YX1cImApXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUVsZW1lbnQoZWwsIGNoYW5nZXMpIHtcbiAgY29uc3QgYXR0cnMgPSBjaGFuZ2VzLmF0dHJzIHx8IHt9XG4gIGZvciAoY29uc3QgbmFtZSBpbiBhdHRycykge1xuICAgIGVsLnNldEF0dHIobmFtZSwgYXR0cnMpXG4gIH1cbiAgY29uc3Qgc3R5bGUgPSBjaGFuZ2VzLnN0eWxlIHx8IHt9XG4gIGZvciAoY29uc3QgbmFtZSBpbiBzdHlsZSkge1xuICAgIGVsLnNldFN0eWxlKG5hbWUsIHN0eWxlW25hbWVdKVxuICB9XG59XG5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2FwcC9jdHJsLmpzXG4gKiovIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGlzdGVuZXIoaWQsIGhhbmRsZXIpIHtcbiAgdGhpcy5pZCA9IGlkXG4gIHRoaXMuYmF0Y2hlZCA9IGZhbHNlXG4gIHRoaXMudXBkYXRlcyA9IFtdXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXJcbiAgfVxufVxuXG5MaXN0ZW5lci5wcm90b3R5cGUuY3JlYXRlRmluaXNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJcbiAgaGFuZGxlcihbY3JlYXRlQWN0aW9uKCdjcmVhdGVGaW5pc2gnLCBbXSldLCBjYWxsYmFjaylcbn1cblxuTGlzdGVuZXIucHJvdG90eXBlLmNyZWF0ZUJvZHkgPSBmdW5jdGlvbiAoZWxlbWVudCwgcmVmKSB7XG4gIGNvbnN0IGFjdGlvbnMgPSBbY3JlYXRlQWN0aW9uKCdjcmVhdGVCb2R5JywgW2VsZW1lbnQudG9KU09OKCldKV1cbiAgdGhpcy5hZGRBY3Rpb25zKGFjdGlvbnMpXG59XG5cbkxpc3RlbmVyLnByb3RvdHlwZS5hZGRFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJlZiwgaW5kZXgpIHtcbiAgaWYgKCEoaW5kZXggPj0gMCkpIHtcbiAgICBpbmRleCA9IC0xXG4gIH1cbiAgdGhpcy5hZGRBY3Rpb25zKGNyZWF0ZUFjdGlvbignYWRkRWxlbWVudCcsIFtyZWYsIGVsZW1lbnQudG9KU09OKCksIGluZGV4XSkpXG59XG5cbkxpc3RlbmVyLnByb3RvdHlwZS5yZW1vdmVFbGVtZW50ID0gZnVuY3Rpb24gKHJlZikge1xuICBpZiAoQXJyYXkuaXNBcnJheShyZWYpKSB7XG4gICAgY29uc3QgYWN0aW9ucyA9IHJlZi5tYXAoKHIpID0+IGNyZWF0ZUFjdGlvbigncmVtb3ZlRWxlbWVudCcsIFtyXSkpXG4gICAgdGhpcy5hZGRBY3Rpb25zKGFjdGlvbnMpXG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5hZGRBY3Rpb25zKGNyZWF0ZUFjdGlvbigncmVtb3ZlRWxlbWVudCcsIFtyZWZdKSlcbiAgfVxufVxuXG5MaXN0ZW5lci5wcm90b3R5cGUubW92ZUVsZW1lbnQgPSBmdW5jdGlvbiAodGFyZ2V0UmVmLCBwYXJlbnRSZWYsIGluZGV4KSB7XG4gIHRoaXMuYWRkQWN0aW9ucyhjcmVhdGVBY3Rpb24oJ21vdmVFbGVtZW50JywgW3RhcmdldFJlZiwgcGFyZW50UmVmLCBpbmRleF0pKVxufVxuXG5MaXN0ZW5lci5wcm90b3R5cGUuc2V0QXR0ciA9IGZ1bmN0aW9uIChyZWYsIGtleSwgdmFsdWUpIHtcbiAgY29uc3QgcmVzdWx0ID0ge31cbiAgcmVzdWx0W2tleV0gPSB2YWx1ZVxuICB0aGlzLmFkZEFjdGlvbnMoY3JlYXRlQWN0aW9uKCd1cGRhdGVBdHRycycsIFtyZWYsIHJlc3VsdF0pKVxufVxuXG5MaXN0ZW5lci5wcm90b3R5cGUuc2V0U3R5bGUgPSBmdW5jdGlvbiAocmVmLCBrZXksIHZhbHVlKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9XG4gIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgdGhpcy5hZGRBY3Rpb25zKGNyZWF0ZUFjdGlvbigndXBkYXRlU3R5bGUnLCBbcmVmLCByZXN1bHRdKSlcbn1cblxuTGlzdGVuZXIucHJvdG90eXBlLnNldFN0eWxlcyA9IGZ1bmN0aW9uIChyZWYsIHN0eWxlKSB7XG4gIHRoaXMuYWRkQWN0aW9ucyhjcmVhdGVBY3Rpb24oJ3VwZGF0ZVN0eWxlJywgW3JlZiwgc3R5bGVdKSlcbn1cblxuTGlzdGVuZXIucHJvdG90eXBlLmFkZEV2ZW50ID0gZnVuY3Rpb24gKHJlZiwgdHlwZSkge1xuICB0aGlzLmFkZEFjdGlvbnMoY3JlYXRlQWN0aW9uKCdhZGRFdmVudCcsIFtyZWYsIHR5cGVdKSlcbn1cblxuTGlzdGVuZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50ID0gZnVuY3Rpb24gKHJlZiwgdHlwZSkge1xuICB0aGlzLmFkZEFjdGlvbnMoY3JlYXRlQWN0aW9uKCdyZW1vdmVFdmVudCcsIFtyZWYsIHR5cGVdKSlcbn1cblxuTGlzdGVuZXIucHJvdG90eXBlLmhhbmRsZXIgPSBmdW5jdGlvbiAoYWN0aW9ucywgY2IpIHtcbiAgY2IgJiYgY2IoKVxufVxuXG5MaXN0ZW5lci5wcm90b3R5cGUuYWRkQWN0aW9ucyA9IGZ1bmN0aW9uIChhY3Rpb25zKSB7XG4gIGNvbnN0IHVwZGF0ZXMgPSB0aGlzLnVwZGF0ZXNcbiAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlclxuXG4gIGlmICghQXJyYXkuaXNBcnJheShhY3Rpb25zKSkge1xuICAgIGFjdGlvbnMgPSBbYWN0aW9uc11cbiAgfVxuXG4gIGlmICh0aGlzLmJhdGNoZWQpIHtcbiAgICB1cGRhdGVzLnB1c2guYXBwbHkodXBkYXRlcywgYWN0aW9ucylcbiAgfVxuICBlbHNlIHtcbiAgICBoYW5kbGVyKGFjdGlvbnMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFjdGlvbihuYW1lLCBhcmdzKSB7XG4gIHJldHVybiB7bW9kdWxlOiAnZG9tJywgbWV0aG9kOiBuYW1lLCBhcmdzOiBhcmdzfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvYXBwL2RvbS1saXN0ZW5lci5qc1xuICoqLyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIERpZmZlciB7XG4gIGNvbnN0cnVjdG9yIChpZCkge1xuICAgIHRoaXMuaWQgPSBpZFxuICAgIHRoaXMubWFwID0gW11cbiAgICB0aGlzLmhvb2tzID0gW11cbiAgfVxuICBpc0VtcHR5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAubGVuZ3RoID09PSAwXG4gIH1cbiAgYXBwZW5kICh0eXBlLCBkZXB0aCwgcmVmLCBoYW5kbGVyKSB7XG4gICAgY29uc3QgbWFwID0gdGhpcy5tYXBcbiAgICBpZiAoIW1hcFtkZXB0aF0pIHtcbiAgICAgIG1hcFtkZXB0aF0gPSB7fVxuICAgIH1cbiAgICBjb25zdCBncm91cCA9IG1hcFtkZXB0aF1cbiAgICBpZiAoIWdyb3VwW3R5cGVdKSB7XG4gICAgICBncm91cFt0eXBlXSA9IHt9XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnZWxlbWVudCcpIHtcbiAgICAgIGlmICghZ3JvdXBbdHlwZV1bcmVmXSkge1xuICAgICAgICBncm91cFt0eXBlXVtyZWZdID0gW11cbiAgICAgIH1cbiAgICAgIGdyb3VwW3R5cGVdW3JlZl0ucHVzaChoYW5kbGVyKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGdyb3VwW3R5cGVdW3JlZl0gPSBoYW5kbGVyXG4gICAgfVxuICB9XG4gIGZsdXNoICgpIHtcbiAgICBjb25zdCBtYXAgPSB0aGlzLm1hcC5zbGljZSgpXG4gICAgdGhpcy5tYXAubGVuZ3RoID0gMFxuICAgIG1hcC5mb3JFYWNoKChncm91cCkgPT4ge1xuICAgICAgY2FsbFR5cGVNYXAoZ3JvdXAsICdyZXBlYXQnKVxuICAgICAgY2FsbFR5cGVNYXAoZ3JvdXAsICdzaG93bicpXG4gICAgICBjYWxsVHlwZUxpc3QoZ3JvdXAsICdlbGVtZW50JylcbiAgICB9KVxuXG4gICAgY29uc3QgaG9va3MgPSB0aGlzLmhvb2tzLnNsaWNlKClcbiAgICB0aGlzLmhvb2tzLmxlbmd0aCA9IDBcbiAgICBob29rcy5mb3JFYWNoKChmbikgPT4ge1xuICAgICAgZm4oKVxuICAgIH0pXG5cbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLmZsdXNoKClcbiAgICB9XG4gIH1cbiAgdGhlbiAoZm4pIHtcbiAgICB0aGlzLmhvb2tzLnB1c2goZm4pXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbFR5cGVNYXAoZ3JvdXAsIHR5cGUpIHtcbiAgY29uc3QgbWFwID0gZ3JvdXBbdHlwZV1cbiAgZm9yIChjb25zdCByZWYgaW4gbWFwKSB7XG4gICAgbWFwW3JlZl0oKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNhbGxUeXBlTGlzdChncm91cCwgdHlwZSkge1xuICBjb25zdCBtYXAgPSBncm91cFt0eXBlXVxuICBmb3IgKGNvbnN0IHJlZiBpbiBtYXApIHtcbiAgICBjb25zdCBsaXN0ID0gbWFwW3JlZl1cbiAgICBsaXN0LmZvckVhY2goKGhhbmRsZXIpID0+IHtoYW5kbGVyKCl9KVxuICB9XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9hcHAvZGlmZmVyLmpzXG4gKiovIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IGV2ZW50IG1hbmFnZXJcbiAqL1xuXG5pbXBvcnQgKiBhcyBfIGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEV2ZW50TWFuYWdlcigpIHtcbiAgdGhpcy5lbHMgPSBbXVxuICB0aGlzLnRhcmdldHMgPSBbXVxufVxuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlLl9nZXQgPSBmdW5jdGlvbiAoZWwsIGZvcmNlKSB7XG4gIHZhciBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmVscywgZWwpXG4gIHZhciB0YXJnZXRcbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICB0YXJnZXQgPSB0aGlzLnRhcmdldHNbaW5kZXhdXG4gIH1cbiAgZWxzZSBpZiAoZm9yY2UpIHtcbiAgICB0YXJnZXQgPSB7ZWw6IGVsLCBldmVudHM6IHt9fVxuICAgIHRoaXMuZWxzLnB1c2goZWwpXG4gICAgdGhpcy50YXJnZXRzLnB1c2godGFyZ2V0KVxuICB9XG4gIHJldHVybiB0YXJnZXRcbn1cblxuRXZlbnRNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWwsIHR5cGUsIGhhbmRsZXIpIHtcbiAgaWYgKHR5cGVvZiBlbCAhPT0gJ29iamVjdCcgfHwgIWVsIHx8XG4gICAgdHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnIHx8ICF0eXBlIHx8XG4gICAgdHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdGFyZ2V0ID0gdGhpcy5fZ2V0KGVsLCB0cnVlKVxuICB0YXJnZXQuZXZlbnRzW3R5cGVdID0gaGFuZGxlclxufVxuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChlbCwgdHlwZSkge1xuICBpZiAodHlwZW9mIGVsICE9PSAnb2JqZWN0JyB8fCAhZWwgfHxcbiAgICB0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycgfHwgIXR5cGUpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdGFyZ2V0ID0gdGhpcy5fZ2V0KGVsKVxuICBpZiAodGFyZ2V0KSB7XG4gICAgZGVsZXRlIHRhcmdldC5ldmVudHNbdHlwZV1cbiAgfVxufVxuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbiAoZWwsIHR5cGUsIGUpIHtcbiAgdmFyIHRhcmdldCA9IHRoaXMuX2dldChlbClcbiAgdmFyIGhhbmRsZXIsIGVsXG4gIGlmICh0YXJnZXQpIHtcbiAgICBlbCA9IHRhcmdldC5lbFxuICAgIGhhbmRsZXIgPSB0YXJnZXQuZXZlbnRzW3R5cGVdXG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5jYWxsKGVsLCBlKVxuICAgIH1cbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvYXBwL2V2ZW50LmpzXG4gKiovIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3XG4gKiBBIHNpbXBsZSB2aXJ0dWFsIGRvbSBpbXBsZW1lbnRhdGlvblxuICovXG5cbmNvbnN0IERFRkFVTFRfVEFHX05BTUUgPSAnZGl2J1xuXG5leHBvcnQgY29uc3QgaW5zdGFuY2VNYXAgPSB7fVxuXG5leHBvcnQgZnVuY3Rpb24gRG9jdW1lbnQoaWQpIHtcbiAgaWQgPSBpZCA/IGlkLnRvU3RyaW5nKCkgOiAnJ1xuICB0aGlzLmlkID0gaWRcbiAgdGhpcy5uZXh0UmVmID0gMVxuICB0aGlzLm5vZGVNYXAgPSB7fVxuICB0aGlzLmxpc3RlbmVyID0gbnVsbFxuICB0aGlzLmV2ZW50TWFuYWdlciA9IG51bGxcbiAgdGhpcy5jbG9zZWQgPSBmYWxzZVxuICBpbnN0YW5jZU1hcFtpZF0gPSB0aGlzXG5cbiAgdGhpcy5jcmVhdGVEb2N1bWVudEVsZW1lbnQoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveURvY3VtZW50KGlkKSB7XG4gIGRlbGV0ZSBpbnN0YW5jZU1hcFtpZF1cbn1cblxuRG9jdW1lbnQucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY2xvc2VkID0gZmFsc2VcbiAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVyLmJhdGNoZWQgPSBmYWxzZVxuICB9XG59XG5Eb2N1bWVudC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY2xvc2VkID0gdHJ1ZVxuICBpZiAodGhpcy5saXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXIuYmF0Y2hlZCA9IHRydWVcbiAgfVxufVxuXG5Eb2N1bWVudC5wcm90b3R5cGUuc2V0RXZlbnRNYW5hZ2VyID0gZnVuY3Rpb24gKGV2ZW50TWFuYWdlcikge1xuICB0aGlzLmV2ZW50TWFuYWdlciA9IGV2ZW50TWFuYWdlclxufVxuXG5Eb2N1bWVudC5wcm90b3R5cGUuc2V0TGlzdGVuZXIgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgdGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyXG4gIGxpc3RlbmVyLmJhdGNoZWQgPSAhIXRoaXMuY2xvc2VkXG59XG5cbkRvY3VtZW50LnByb3RvdHlwZS5hZGRSZWYgPSBmdW5jdGlvbiAoZWwpIHtcbiAgZWwucmVmID0gdGhpcy5uZXh0UmVmLnRvU3RyaW5nKClcbiAgdGhpcy5ub2RlTWFwW2VsLnJlZl0gPSBlbFxuICB0aGlzLm5leHRSZWYrK1xufVxuXG5Eb2N1bWVudC5wcm90b3R5cGUuZ2V0UmVmID0gZnVuY3Rpb24gKHJlZikge1xuICByZXR1cm4gdGhpcy5ub2RlTWFwW3JlZl1cbn1cblxuRG9jdW1lbnQucHJvdG90eXBlLnJlbW92ZVJlZiA9IGZ1bmN0aW9uIChyZWYpIHtcbiAgZGVsZXRlIHRoaXMubm9kZU1hcFtyZWZdXG59XG5cbkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVEb2N1bWVudEVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwgcHJvcHMpIHtcbiAgaWYgKCF0aGlzLmRvY3VtZW50RWxlbWVudCkge1xuICAgIHRoaXMuZG9jdW1lbnRFbGVtZW50ID0gbmV3IEVsZW1lbnQodHlwZSwgcHJvcHMsIHRoaXMpXG4gICAgdGhpcy5ub2RlTWFwLl9kb2N1bWVudEVsZW1lbnQgPSB0aGlzLmRvY3VtZW50RWxlbWVudFxuICAgIHRoaXMuZG9jdW1lbnRFbGVtZW50LnJlZiA9ICdfZG9jdW1lbnRFbGVtZW50J1xuICAgIHRoaXMuZG9jdW1lbnRFbGVtZW50LmF0dGFjaGVkID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuZG9jdW1lbnRFbGVtZW50XG59XG5cbkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVCb2R5ID0gZnVuY3Rpb24gKHR5cGUsIHByb3BzKSB7XG4gIGlmICghdGhpcy5ib2R5KSB7XG4gICAgdGhpcy5ib2R5ID0gbmV3IEVsZW1lbnQodHlwZSwgcHJvcHMsIHRoaXMpXG4gICAgdGhpcy5ub2RlTWFwLl9yb290ID0gdGhpcy5ib2R5XG4gICAgdGhpcy5ib2R5LnJlZiA9ICdfcm9vdCdcbiAgICB0aGlzLmJvZHkuZGVwdGggPSAxXG4gIH1cblxuICByZXR1cm4gdGhpcy5ib2R5XG59XG5cbkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKHRhZ05hbWUsIHByb3BzKSB7XG4gIHJldHVybiBuZXcgRWxlbWVudCh0YWdOYW1lLCBwcm9wcywgdGhpcylcbn1cblxuRG9jdW1lbnQucHJvdG90eXBlLmNyZWF0ZUNvbW1lbnQgPSBmdW5jdGlvbiAodGV4dCkge1xuICByZXR1cm4gbmV3IENvbW1lbnQodGV4dCwgdGhpcylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5vZGUoKSB7XG59XG5cbk5vZGUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChpbnN0YW5jZUlkKSB7XG4gIHRoaXMucGFyZW50UmVmID0gbnVsbFxuICB0aGlzLmF0dGFjaGVkID0gZmFsc2VcbiAgaWYgKGluc3RhbmNlSWQpIHtcbiAgICB0aGlzLmluc3RhbmNlSWQgPSBpbnN0YW5jZUlkXG4gICAgY29uc3QgZG9jID0gaW5zdGFuY2VNYXBbaW5zdGFuY2VJZF1cbiAgICBkb2MuYWRkUmVmKHRoaXMpXG4gIH1cbn1cblxuTm9kZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgcmVmID0gdGhpcy5yZWZcbiAgY29uc3QgaW5zdGFuY2VJZCA9IHRoaXMuaW5zdGFuY2VJZFxuICBpZiAoaW5zdGFuY2VJZCkge1xuICAgIGNvbnN0IGRvYyA9IGluc3RhbmNlTWFwW2luc3RhbmNlSWRdXG4gICAgZG9jLnJlbW92ZVJlZihyZWYpXG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4gfHwgW11cbiAgY29uc3QgbGVuZ3RoID0gY2hpbGRyZW4ubGVuZ3RoXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZHJlbltpXS5kZXN0cm95KClcbiAgfVxufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRSZW5kZXJlciA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZG9jID0gaW5zdGFuY2VNYXBbdGhpcy5pbnN0YW5jZUlkXVxuICByZXR1cm4gZG9jLmxpc3RlbmVyXG59XG5cbk5vZGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGluc3RhbmNlSWQgPSB0aGlzLmluc3RhbmNlSWRcbiAgY29uc3QgZG9jID0gaW5zdGFuY2VNYXBbaW5zdGFuY2VJZF1cbiAgY29uc3QgcGFyZW50ID0gZG9jLmdldFJlZih0aGlzLnBhcmVudFJlZilcbiAgaWYgKHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQuY2hpbGRyZW5bcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcykgKyAxXVxuICB9XG59XG5cbk5vZGUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGluc3RhbmNlSWQgPSB0aGlzLmluc3RhbmNlSWRcbiAgY29uc3QgZG9jID0gaW5zdGFuY2VNYXBbaW5zdGFuY2VJZF1cbiAgY29uc3QgcGFyZW50ID0gZG9jLmdldFJlZih0aGlzLnBhcmVudFJlZilcbiAgaWYgKHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQuY2hpbGRyZW5bcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcykgLSAxXVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFbGVtZW50KHR5cGU9REVGQVVMVF9UQUdfTkFNRSwgcHJvcHMsIG93bmVyRG9jdW1lbnQpIHtcbiAgcHJvcHMgPSBwcm9wcyB8fCB7fVxuICB0aGlzLmNyZWF0ZShvd25lckRvY3VtZW50LmlkKVxuICB0aGlzLm93bmVyRG9jdW1lbnQgPSBvd25lckRvY3VtZW50XG4gIHRoaXMudHlwZSA9IHR5cGVcbiAgdGhpcy5hdHRyID0gcHJvcHMuYXR0ciB8fCB7fVxuICB0aGlzLmNsYXNzU3R5bGUgPSBwcm9wcy5jbGFzc1N0eWxlIHx8IHt9XG4gIHRoaXMuc3R5bGUgPSBwcm9wcy5zdHlsZSB8fCB7fVxuICB0aGlzLmV2ZW50ID0gW11cbiAgdGhpcy5jaGlsZHJlbiA9IFtdXG4gIHRoaXMucHVyZUNoaWxkcmVuID0gW11cbn1cblxuRWxlbWVudC5wcm90b3R5cGUgPSBuZXcgTm9kZSgpXG5cbkVsZW1lbnQucHJvdG90eXBlLmFwcGVuZENoaWxkID0gZnVuY3Rpb24gKG5vZGUpIHtcblxuICByZW1vdmVJZkV4aXN0ZWQobm9kZSlcbiAgbm9kZS5wYXJlbnRSZWYgPSB0aGlzLnJlZlxuICB0aGlzLmNoaWxkcmVuLnB1c2gobm9kZSlcblxuICBpZiAodGhpcy5hdHRhY2hlZCkge1xuICAgIHNldEF0dGFjaGVkKG5vZGUsIHRoaXMuZGVwdGgpXG4gIH1cbiAgZWxzZSB7XG4gICAgc2V0RGV0YWNoZWQobm9kZSlcbiAgfVxuXG4gIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIHRoaXMucHVyZUNoaWxkcmVuLnB1c2gobm9kZSlcblxuICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuZ2V0UmVuZGVyZXIoKVxuICAgICAgaWYgKHJlbmRlcmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnJlZiA9PT0gJ19kb2N1bWVudEVsZW1lbnQnKSB7XG4gICAgICAgICAgLy8gaWYgaXRzIHBhcmVudCBpcyBkb2N1bWVudEVsZW1lbnQgdGhlbiBpdCdzIGEgYm9keVxuICAgICAgICAgIHJlbmRlcmVyLmNyZWF0ZUJvZHkobm9kZSwgdGhpcy5yZWYpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmVuZGVyZXIuYWRkRWxlbWVudChub2RlLCB0aGlzLnJlZilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5FbGVtZW50LnByb3RvdHlwZS5pbnNlcnRCZWZvcmUgPSBmdW5jdGlvbiAobm9kZSwgYmVmb3JlKSB7XG5cbiAgaWYgKG5vZGUucGFyZW50UmVmID09PSB0aGlzLnJlZikge1xuICAgIG1vdmVCZWZvcmUobm9kZSwgYmVmb3JlLCB0aGlzLmNoaWxkcmVuKVxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgY29uc3QgcHVyZUJlZm9yZUluZGV4ID0gbW92ZVB1cmVCZWZvcmUobm9kZSwgYmVmb3JlLCB0aGlzLnB1cmVDaGlsZHJlbilcbiAgICAgIGlmIChwdXJlQmVmb3JlSW5kZXggPj0gMCAmJiB0aGlzLmF0dGFjaGVkKSB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5nZXRSZW5kZXJlcigpXG4gICAgICAgIGlmIChyZW5kZXJlcikge1xuICAgICAgICAgIHJlbmRlcmVyLm1vdmVFbGVtZW50KG5vZGUucmVmLCB0aGlzLnJlZiwgcHVyZUJlZm9yZUluZGV4KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVyblxuICB9XG5cbiAgcmVtb3ZlSWZFeGlzdGVkKG5vZGUpXG5cbiAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuXG4gIGNvbnN0IGluZGV4ID0gY2hpbGRyZW4uaW5kZXhPZihiZWZvcmUpXG5cbiAgbm9kZS5wYXJlbnRSZWYgPSB0aGlzLnJlZlxuICBpZiAodGhpcy5hdHRhY2hlZCkge1xuICAgIHNldEF0dGFjaGVkKG5vZGUsIHRoaXMuZGVwdGgpXG4gIH1cbiAgZWxzZSB7XG4gICAgc2V0RGV0YWNoZWQobm9kZSlcbiAgfVxuICBjaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIG5vZGUpXG5cbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgY29uc3QgcHVyZUNoaWxkcmVuID0gdGhpcy5wdXJlQ2hpbGRyZW5cbiAgICBjb25zdCBwdXJlSW5kZXggPSBnZXRQdXJlQWZ0ZXIoYmVmb3JlLCBwdXJlQ2hpbGRyZW4pXG5cbiAgICBwdXJlQ2hpbGRyZW4uc3BsaWNlKHB1cmVJbmRleCwgMCwgbm9kZSlcblxuICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuZ2V0UmVuZGVyZXIoKVxuICAgICAgaWYgKHJlbmRlcmVyKSB7XG4gICAgICAgIHJlbmRlcmVyLmFkZEVsZW1lbnQobm9kZSwgdGhpcy5yZWYsIHB1cmVJbmRleClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuRWxlbWVudC5wcm90b3R5cGUuaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbiAobm9kZSwgYWZ0ZXIpIHtcblxuICBpZiAobm9kZS5wYXJlbnRSZWYgPT09IHRoaXMucmVmKSB7XG4gICAgbW92ZUFmdGVyKG5vZGUsIGFmdGVyLCB0aGlzLmNoaWxkcmVuKVxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgY29uc3QgcHVyZUFmdGVySW5kZXggPSBtb3ZlUHVyZUFmdGVyKG5vZGUsIGFmdGVyLCB0aGlzLnB1cmVDaGlsZHJlbilcbiAgICAgIGlmIChwdXJlQWZ0ZXJJbmRleCA+PSAwICYmIHRoaXMuYXR0YWNoZWQpIHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLmdldFJlbmRlcmVyKClcbiAgICAgICAgaWYgKHJlbmRlcmVyKSB7XG4gICAgICAgICAgcmVuZGVyZXIubW92ZUVsZW1lbnQobm9kZS5yZWYsIHRoaXMucmVmLCBwdXJlQWZ0ZXJJbmRleClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm5cbiAgfVxuXG4gIHJlbW92ZUlmRXhpc3RlZChub2RlKVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlblxuICBjb25zdCBpbmRleCA9IGNoaWxkcmVuLmluZGV4T2YoYWZ0ZXIpXG5cbiAgbm9kZS5wYXJlbnRSZWYgPSB0aGlzLnJlZlxuICBpZiAodGhpcy5hdHRhY2hlZCkge1xuICAgIHNldEF0dGFjaGVkKG5vZGUsIHRoaXMuZGVwdGgpXG4gIH1cbiAgZWxzZSB7XG4gICAgc2V0RGV0YWNoZWQobm9kZSlcbiAgfVxuICBjaGlsZHJlbi5zcGxpY2UoaW5kZXggKyAxLCAwLCBub2RlKVxuXG4gIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIGNvbnN0IHB1cmVDaGlsZHJlbiA9IHRoaXMucHVyZUNoaWxkcmVuXG4gICAgY29uc3QgcHVyZUluZGV4ID0gZ2V0UHVyZUJlZm9yZShhZnRlciwgcHVyZUNoaWxkcmVuKVxuXG4gICAgcHVyZUNoaWxkcmVuLnNwbGljZShwdXJlSW5kZXggKyAxLCAwLCBub2RlKVxuXG4gICAgaWYgKHRoaXMuYXR0YWNoZWQpIHtcbiAgICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5nZXRSZW5kZXJlcigpXG4gICAgICBpZiAocmVuZGVyZXIpIHtcbiAgICAgICAgcmVuZGVyZXIuYWRkRWxlbWVudChub2RlLCB0aGlzLnJlZiwgcHVyZUluZGV4ICsgMSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbiAobm9kZSwgcHJlc2VydmVkKSB7XG4gIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlblxuICBjb25zdCBpbmRleCA9IGNoaWxkcmVuLmluZGV4T2Yobm9kZSlcblxuICBzZXREZXRhY2hlZChub2RlKVxuXG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgbm9kZS5wYXJlbnRSZWYgPSBudWxsXG4gICAgY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKVxuICAgIGlmICghcHJlc2VydmVkKSB7XG4gICAgICBub2RlLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxuXG4gIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIHRoaXMucHVyZUNoaWxkcmVuLiRyZW1vdmUobm9kZSlcbiAgICBpZiAodGhpcy5hdHRhY2hlZCkge1xuICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLmdldFJlbmRlcmVyKClcbiAgICAgIGlmIChyZW5kZXJlcikge1xuICAgICAgICByZW5kZXJlci5yZW1vdmVFbGVtZW50KG5vZGUucmVmKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5FbGVtZW50LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuXG4gIGNvbnN0IGxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aFxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGNoaWxkLnBhcmVudFJlZiA9IG51bGxcbiAgICBzZXREZXRhY2hlZChjaGlsZClcbiAgICBjaGlsZC5kZXN0cm95KClcbiAgfVxuICBjaGlsZHJlbi5sZW5ndGggPSAwXG5cbiAgaWYgKHRoaXMuYXR0YWNoZWQpIHtcbiAgICBjb25zdCByZWZzID0gdGhpcy5wdXJlQ2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gY2hpbGQucmVmKVxuICAgIHRoaXMucHVyZUNoaWxkcmVuLmxlbmd0aCA9IDBcbiAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuZ2V0UmVuZGVyZXIoKVxuICAgIGlmIChyZW5kZXJlcikge1xuICAgICAgcmVuZGVyZXIucmVtb3ZlRWxlbWVudChyZWZzKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlQmVmb3JlKG5vZGUsIGJlZm9yZSwgY2hpbGRyZW4pIHtcbiAgY29uc3QgdGFyZ2V0SW5kZXggPSBjaGlsZHJlbi5pbmRleE9mKG5vZGUpXG4gIGNvbnN0IGJlZm9yZUluZGV4ID0gY2hpbGRyZW4uaW5kZXhPZihiZWZvcmUpXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKHRhcmdldEluZGV4ID09PSBiZWZvcmVJbmRleCB8fCB0YXJnZXRJbmRleCArIDEgPT09IGJlZm9yZUluZGV4KSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cblxuICBjb25zdCBuZXdJbmRleCA9IHRhcmdldEluZGV4IDwgYmVmb3JlSW5kZXggPyBiZWZvcmVJbmRleCAtIDEgOiBiZWZvcmVJbmRleFxuICBjaGlsZHJlbi5zcGxpY2UodGFyZ2V0SW5kZXgsIDEpXG4gIGNoaWxkcmVuLnNwbGljZShuZXdJbmRleCwgMCwgbm9kZSlcblxuICByZXR1cm4gYmVmb3JlSW5kZXhcbn1cblxuZnVuY3Rpb24gbW92ZVB1cmVCZWZvcmUobm9kZSwgYmVmb3JlLCBwdXJlQ2hpbGRyZW4pIHtcbiAgY29uc3QgcHVyZVRhcmdldEluZGV4ID0gcHVyZUNoaWxkcmVuLmluZGV4T2Yobm9kZSlcbiAgY29uc3QgcHVyZUJlZm9yZUluZGV4ID0gZ2V0UHVyZUFmdGVyKGJlZm9yZSwgcHVyZUNoaWxkcmVuKVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmIChwdXJlVGFyZ2V0SW5kZXggPT09IHB1cmVCZWZvcmVJbmRleCB8fFxuICAgIHB1cmVUYXJnZXRJbmRleCArIDEgPT09IHB1cmVCZWZvcmVJbmRleCkge1xuICAgIHJldHVybiAtMVxuICB9XG5cbiAgY29uc3QgcHVyZU5ld0luZGV4ID0gcHVyZVRhcmdldEluZGV4IDwgcHVyZUJlZm9yZUluZGV4XG4gICAgPyBwdXJlQmVmb3JlSW5kZXggLSAxXG4gICAgOiBwdXJlQmVmb3JlSW5kZXhcblxuICBwdXJlQ2hpbGRyZW4uc3BsaWNlKHB1cmVUYXJnZXRJbmRleCwgMSlcbiAgcHVyZUNoaWxkcmVuLnNwbGljZShwdXJlTmV3SW5kZXgsIDAsIG5vZGUpXG5cbiAgcmV0dXJuIHB1cmVCZWZvcmVJbmRleFxufVxuXG5mdW5jdGlvbiBnZXRQdXJlQWZ0ZXIobm9kZSwgcHVyZUNoaWxkcmVuKSB7XG4gIGxldCBwdXJlSW5kZXggPSBwdXJlQ2hpbGRyZW4uaW5kZXhPZihub2RlKVxuICB3aGlsZSAobm9kZSAmJiBwdXJlSW5kZXggPCAwKSB7XG4gICAgbm9kZSA9IG5vZGUubmV4dCgpXG4gICAgcHVyZUluZGV4ID0gcHVyZUNoaWxkcmVuLmluZGV4T2Yobm9kZSlcbiAgfVxuICBpZiAocHVyZUluZGV4IDwgMCkge1xuICAgIHB1cmVJbmRleCA9IHB1cmVDaGlsZHJlbi5sZW5ndGhcbiAgfVxuICByZXR1cm4gcHVyZUluZGV4XG59XG5cbmZ1bmN0aW9uIG1vdmVBZnRlcihub2RlLCBhZnRlciwgY2hpbGRyZW4pIHtcbiAgY29uc3QgdGFyZ2V0SW5kZXggPSBjaGlsZHJlbi5pbmRleE9mKG5vZGUpXG4gIGNvbnN0IGFmdGVySW5kZXggPSBjaGlsZHJlbi5pbmRleE9mKGFmdGVyKVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmICh0YXJnZXRJbmRleCA9PT0gYWZ0ZXJJbmRleCB8fCB0YXJnZXRJbmRleCA9PT0gYWZ0ZXJJbmRleCArIDEpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuXG4gIGNvbnN0IG5ld0luZGV4ID0gdGFyZ2V0SW5kZXggPCBhZnRlckluZGV4ID8gYWZ0ZXJJbmRleCA6IGFmdGVySW5kZXggKyAxXG4gIGNoaWxkcmVuLnNwbGljZSh0YXJnZXRJbmRleCwgMSlcbiAgY2hpbGRyZW4uc3BsaWNlKG5ld0luZGV4LCAwLCBub2RlKVxuXG4gIHJldHVybiBhZnRlckluZGV4XG59XG5cbmZ1bmN0aW9uIG1vdmVQdXJlQWZ0ZXIobm9kZSwgYWZ0ZXIsIHB1cmVDaGlsZHJlbikge1xuICBjb25zdCBwdXJlVGFyZ2V0SW5kZXggPSBwdXJlQ2hpbGRyZW4uaW5kZXhPZihub2RlKVxuICBjb25zdCBwdXJlQWZ0ZXJJbmRleCA9IGdldFB1cmVCZWZvcmUoYWZ0ZXIsIHB1cmVDaGlsZHJlbilcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAocHVyZVRhcmdldEluZGV4ID09PSBwdXJlQWZ0ZXJJbmRleCB8fFxuICAgIHB1cmVUYXJnZXRJbmRleCA9PT0gcHVyZUFmdGVySW5kZXggKyAxKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cblxuICBjb25zdCBwdXJlTmV3SW5kZXggPSBwdXJlVGFyZ2V0SW5kZXggPCBwdXJlQWZ0ZXJJbmRleFxuICAgID8gcHVyZUFmdGVySW5kZXhcbiAgICA6IHB1cmVBZnRlckluZGV4ICsgMVxuXG4gIHB1cmVDaGlsZHJlbi5zcGxpY2UocHVyZVRhcmdldEluZGV4LCAxKVxuICBwdXJlQ2hpbGRyZW4uc3BsaWNlKHB1cmVOZXdJbmRleCwgMCwgbm9kZSlcblxuICByZXR1cm4gcHVyZUFmdGVySW5kZXggKyAxXG59XG5cbmZ1bmN0aW9uIGdldFB1cmVCZWZvcmUobm9kZSwgcHVyZUNoaWxkcmVuKSB7XG4gIGxldCBwdXJlSW5kZXggPSBwdXJlQ2hpbGRyZW4uaW5kZXhPZihub2RlKVxuICB3aGlsZSAobm9kZSAmJiBwdXJlSW5kZXggPCAwKSB7XG4gICAgbm9kZSA9IG5vZGUucHJldigpXG4gICAgcHVyZUluZGV4ID0gcHVyZUNoaWxkcmVuLmluZGV4T2Yobm9kZSlcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBpZiAocHVyZUluZGV4IDwgMCkge1xuICAgIHB1cmVJbmRleCA9IC0xXG4gIH1cbiAgcmV0dXJuIHB1cmVJbmRleFxufVxuXG5mdW5jdGlvbiBzZXRBdHRhY2hlZChub2RlLCBkZXB0aCkge1xuICBpZiAobm9kZS5yZWYgPT09ICdfcm9vdCcpIHtcbiAgICBkZXB0aCA9IDFcbiAgfVxuICBlbHNlIHtcbiAgICBkZXB0aCA9IGRlcHRoID4gMCA/IGRlcHRoICsgMSA6IDBcbiAgfVxuICBub2RlLmF0dGFjaGVkID0gdHJ1ZVxuICBub2RlLmRlcHRoID0gZGVwdGhcbiAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgc2V0QXR0YWNoZWQoc3ViLCBkZXB0aClcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERldGFjaGVkKG5vZGUpIHtcbiAgbm9kZS5hdHRhY2hlZCA9IGZhbHNlXG4gIG5vZGUuZGVwdGggPSAwXG4gIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChzdWIpID0+IHtcbiAgICAgIHNldERldGFjaGVkKHN1YilcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUlmRXhpc3RlZChub2RlKSB7XG4gIGNvbnN0IGRvYyA9IGluc3RhbmNlTWFwW25vZGUuaW5zdGFuY2VJZF1cbiAgaWYgKGRvYykge1xuICAgIGNvbnN0IGV4aXN0ZWROb2RlID0gZG9jLmdldFJlZihub2RlLnJlZilcbiAgICBpZiAoZXhpc3RlZE5vZGUpIHtcbiAgICAgIGNvbnN0IGV4aXN0ZWRQYXJlbnQgPSBkb2MuZ2V0UmVmKGV4aXN0ZWROb2RlLnBhcmVudFJlZilcbiAgICAgIGlmIChleGlzdGVkUGFyZW50ICYmIGV4aXN0ZWRQYXJlbnQucmVtb3ZlQ2hpbGQpIHtcbiAgICAgICAgZXhpc3RlZFBhcmVudC5yZW1vdmVDaGlsZChleGlzdGVkTm9kZSwgdHJ1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0ciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIGlmICh0aGlzLmF0dHJba2V5XSA9PT0gdmFsdWUpIHtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLmF0dHJba2V5XSA9IHZhbHVlXG4gIGlmICh0aGlzLmF0dGFjaGVkKSB7XG4gICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLmdldFJlbmRlcmVyKClcbiAgICBpZiAocmVuZGVyZXIpIHtcbiAgICAgIHJlbmRlcmVyLnNldEF0dHIodGhpcy5yZWYsIGtleSwgdmFsdWUpXG4gICAgfVxuICB9XG59XG5cbkVsZW1lbnQucHJvdG90eXBlLnNldFN0eWxlID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgaWYgKHRoaXMuc3R5bGVba2V5XSA9PT0gdmFsdWUpIHtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLnN0eWxlW2tleV0gPSB2YWx1ZVxuICBpZiAodGhpcy5hdHRhY2hlZCkge1xuICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5nZXRSZW5kZXJlcigpXG4gICAgaWYgKHJlbmRlcmVyKSB7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZSh0aGlzLnJlZiwga2V5LCB2YWx1ZSlcbiAgICB9XG4gIH1cbn1cblxuRWxlbWVudC5wcm90b3R5cGUuc2V0Q2xhc3NTdHlsZSA9IGZ1bmN0aW9uIChjbGFzc1N0eWxlKSB7XG4gIHRoaXMuY2xhc3NTdHlsZSA9IGNsYXNzU3R5bGVcbiAgaWYgKHRoaXMuYXR0YWNoZWQpIHtcbiAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuZ2V0UmVuZGVyZXIoKVxuICAgIGlmIChyZW5kZXJlcikge1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGVzKHRoaXMucmVmLCB0aGlzLnRvU3R5bGUoKSlcbiAgICB9XG4gIH1cbn1cblxuRWxlbWVudC5wcm90b3R5cGUuYWRkRXZlbnQgPSBmdW5jdGlvbiAodHlwZSwgaGFuZGxlcikge1xuICBjb25zdCBpbmRleCA9IHRoaXMuZXZlbnQuaW5kZXhPZih0eXBlKVxuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICB0aGlzLmV2ZW50LnB1c2godHlwZSlcbiAgICBsZXQgZXZlbnRNYW5hZ2VyID0gdGhpcy5vd25lckRvY3VtZW50LmV2ZW50TWFuYWdlclxuICAgIGV2ZW50TWFuYWdlci5hZGQodGhpcywgdHlwZSwgaGFuZGxlcilcblxuICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuZ2V0UmVuZGVyZXIoKVxuICAgICAgaWYgKHJlbmRlcmVyKSB7XG4gICAgICAgIHJlbmRlcmVyLmFkZEV2ZW50KHRoaXMucmVmLCB0eXBlKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5FbGVtZW50LnByb3RvdHlwZS5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIGNvbnN0IGluZGV4ID0gdGhpcy5ldmVudC5pbmRleE9mKHR5cGUpXG5cbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICB0aGlzLmV2ZW50LnNwbGljZShpbmRleCwgMSlcbiAgICBsZXQgZXZlbnRNYW5hZ2VyID0gdGhpcy5vd25lckRvY3VtZW50LmV2ZW50TWFuYWdlclxuICAgIGV2ZW50TWFuYWdlci5yZW1vdmUodGhpcywgdHlwZSlcblxuICAgIGlmICh0aGlzLmF0dGFjaGVkKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuZ2V0UmVuZGVyZXIoKVxuICAgICAgaWYgKHJlbmRlcmVyKSB7XG4gICAgICAgIHJlbmRlcmVyLnJlbW92ZUV2ZW50KHRoaXMucmVmLCB0eXBlKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5FbGVtZW50LnByb3RvdHlwZS50b1N0eWxlID0gZnVuY3Rpb24gKCkge1xuICBjb25zdCByZXN1bHQgPSB7fVxuICBjb25zdCBjbGFzc1N0eWxlID0gdGhpcy5jbGFzc1N0eWxlXG4gIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZVxuICBmb3IgKGNvbnN0IG5hbWUgaW4gY2xhc3NTdHlsZSkge1xuICAgIHJlc3VsdFtuYW1lXSA9IGNsYXNzU3R5bGVbbmFtZV1cbiAgfVxuICBmb3IgKGNvbnN0IG5hbWUgaW4gc3R5bGUpIHtcbiAgICByZXN1bHRbbmFtZV0gPSBzdHlsZVtuYW1lXVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxuRWxlbWVudC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICBjb25zdCByZXN1bHQgPSB7XG4gICAgcmVmOiB0aGlzLnJlZi50b1N0cmluZygpLFxuICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICBhdHRyOiB0aGlzLmF0dHIsXG4gICAgc3R5bGU6IHRoaXMudG9TdHlsZSgpXG4gIH1cblxuICBpZiAodGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50Lmxlbmd0aCkge1xuICAgIHJlc3VsdC5ldmVudCA9IHRoaXMuZXZlbnRcbiAgfVxuICBpZiAodGhpcy5wdXJlQ2hpbGRyZW4gJiYgdGhpcy5wdXJlQ2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgcmVzdWx0LmNoaWxkcmVuID0gdGhpcy5wdXJlQ2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gY2hpbGQudG9KU09OKCkpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbkVsZW1lbnQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gJzwnICsgdGhpcy50eXBlICtcbiAgICAnIGF0dHI9JyArIEpTT04uc3RyaW5naWZ5KHRoaXMuYXR0cikgK1xuICAgICcgc3R5bGU9JyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG9TdHlsZSgpKSArICc+JyArXG4gICAgdGhpcy5wdXJlQ2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gY2hpbGQudG9TdHJpbmcoKSkuam9pbignJykgK1xuICAgICc8LycgKyB0aGlzLnR5cGUgKyAnPidcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvbW1lbnQodmFsdWUsIG93bmVyRG9jdW1lbnQpIHtcbiAgdGhpcy5jcmVhdGUob3duZXJEb2N1bWVudC5pZClcbiAgdGhpcy50eXBlID0gJ2NvbW1lbnQnXG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxufVxuXG5Db21tZW50LnByb3RvdHlwZSA9IG5ldyBOb2RlKClcblxuQ29tbWVudC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAnPCEtLSAnICsgdGhpcy52YWx1ZSArICcgLS0+J1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvYXBwL2RvbS5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIm5hbWVcIjogXCJ3ZWV4LWpzZnJhbWV3b3JrXCIsXG5cdFwidmVyc2lvblwiOiBcIjAuMTMuN1wiLFxuXHRcImRlc2NyaXB0aW9uXCI6IFwiSlMgRnJhbWV3b3JrIGZvciBXZWV4IHNvbHV0aW9uIHdoaWNoIGlzIGEgZXh0ZW5kYWJsZSBjcm9zcy1wbGF0Zm9ybSBzb2x1dGlvbiBmb3IgZHluYW1pYyBwcm9ncmFtbWluZyBhbmQgcHVibGlzaGluZyBwcm9qZWN0c1wiLFxuXHRcIm1haW5cIjogXCJpbmRleC5qc1wiLFxuXHRcInNjcmlwdHNcIjoge1xuXHRcdFwiZGV2XCI6IFwid2VicGFjayAtLXdhdGNoIC0tY29uZmlnIC4vd2VicGFjay5jb25maWcuanNcIixcblx0XHRcImJ1aWxkXCI6IFwid2VicGFjayAtLWNvbmZpZyAuL3dlYnBhY2suY29uZmlnLmpzXCIsXG5cdFx0XCJjb21wcmVzc1wiOiBcInVnbGlmeWpzIGRpc3QvaW5kZXguanMgLW8gZGlzdC9pbmRleC5taW4uanNcIixcblx0XHRcImxpbnRcIjogXCJqc2NzIC0tY29uZmlnIC5qc2NzcmMgcG9seWZpbGwvKi5qcyBwb2x5ZmlsbC9fX3Rlc3RfXy8qLmpzIGxpYi8qLmpzIGxpYi9fX3Rlc3RfXy8qLmpzIGxpYi9hcHAvKi5qcyBsaWIvYXBwL19fdGVzdF9fLyouanMgbGliL3ZtLyouanMgbGliL3ZtL19fdGVzdF9fLyouanNcIixcblx0XHRcInRlc3RcIjogXCJtb2NoYSAtLWNvbXBpbGVycyBqczpiYWJlbC1jb3JlL3JlZ2lzdGVyIHBvbHlmaWxsL19fdGVzdF9fLyouanMgbGliL19fdGVzdF9fLyouanMgbGliLyoqL19fdGVzdF9fLyouanNcIixcblx0XHRcImNvdmVyXCI6IFwiYmFiZWwtbm9kZSBub2RlX21vZHVsZXMvaXNwYXJ0YS9iaW4vaXNwYXJ0YSBjb3ZlciAtLXJlcG9ydCB0ZXh0IG5vZGVfbW9kdWxlcy9tb2NoYS9iaW4vX21vY2hhIC0tIC0tcmVwb3J0ZXIgZG90IGxpYi9fX3Rlc3RfXy8qLmpzIGxpYi8qKi9fX3Rlc3RfXy8qLmpzXCIsXG5cdFx0XCJjaVwiOiBcIm5wbSBydW4gbGludCAmJiBucG0gcnVuIGNvdmVyXCJcblx0fSxcblx0XCJyZXBvc2l0b3J5XCI6IHtcblx0XHRcInR5cGVcIjogXCJnaXRcIixcblx0XHRcInVybFwiOiBcImdpdEBnaXRodWIuY29tOmFsaWJhYmEvd2VleC5naXRcIlxuXHR9LFxuXHRcImF1dGhvclwiOiBbXG5cdFx0e1xuXHRcdFx0XCJuYW1lXCI6IFwiamluamlhbmdcIixcblx0XHRcdFwiZW1haWxcIjogXCJ6aGFvamluamlhbmdAbWUuY29tXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwibmFtZVwiOiBcIlRlcnJ5IEtpbmdcIixcblx0XHRcdFwiZW1haWxcIjogXCJ0ZXJyeWtpbmdjaGFAZ21haWwuY29tXCJcblx0XHR9XG5cdF0sXG5cdFwiY29udHJpYnV0b3JzXCI6IFtcblx0XHR7XG5cdFx0XHRcIm5hbWVcIjogXCJwdXNoaW1pbmdcIixcblx0XHRcdFwiZW1haWxcIjogXCJwdXNoaW1pbmdAZ21haWwuY29tXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdFwibmFtZVwiOiBcImlza2VuaHVhbmdcIixcblx0XHRcdFwiZW1haWxcIjogXCJpc2tlbmh1YW5nQGdtYWlsLmNvbVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRcIm5hbWVcIjogXCJ5dWFueWFuXCIsXG5cdFx0XHRcImVtYWlsXCI6IFwieXVhbnlhbi5jYW9AZ21haWwuY29tXCJcblx0XHR9XG5cdF0sXG5cdFwia2V5d29yZHNcIjogW1xuXHRcdFwid2VleFwiLFxuXHRcdFwibXZ2bVwiLFxuXHRcdFwiYnJvd3NlclwiLFxuXHRcdFwiaHlicmlkXCIsXG5cdFx0XCJmcmFtZXdvcmtcIlxuXHRdLFxuXHRcImxpY2Vuc2VcIjogXCJBcGFjaGUtMi4wXCIsXG5cdFwiZGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcInNlbXZlclwiOiBcIn41LjEuMFwiLFxuXHRcdFwiY29yZS1qc1wiOiBcIn4yLjEuMVwiXG5cdH0sXG5cdFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcImJhYmVsLWNsaVwiOiBcIn42LjQuNVwiLFxuXHRcdFwiYmFiZWwtY29yZVwiOiBcIn42LjQuNVwiLFxuXHRcdFwiYmFiZWwtbG9hZGVyXCI6IFwifjYuMi4xXCIsXG5cdFx0XCJiYWJlbC1wcmVzZXQtZXMyMDE1XCI6IFwifjYuMy4xM1wiLFxuXHRcdFwiY2hhaVwiOiBcIn4zLjIuMFwiLFxuXHRcdFwiaXNwYXJ0YVwiOiBcIn40LjAuMFwiLFxuXHRcdFwiaXN0YW5idWxcIjogXCJ+MC40LjJcIixcblx0XHRcImpzY3NcIjogXCJ+Mi45LjBcIixcblx0XHRcImpzb24tbG9hZGVyXCI6IFwiXjAuNS40XCIsXG5cdFx0XCJtb2NoYVwiOiBcIn4yLjMuNFwiLFxuXHRcdFwic2lub25cIjogXCJ+MS4xNy4yXCIsXG5cdFx0XCJzaW5vbi1jaGFpXCI6IFwifjIuOC4wXCIsXG5cdFx0XCJ1Z2xpZnktanNcIjogXCJeMi42LjJcIixcblx0XHRcIndhdGNoLWNsaVwiOiBcIn4wLjIuMVwiLFxuXHRcdFwid2VicGFja1wiOiBcIn4xLjEyLjEyXCJcblx0fSxcblx0XCJvcHRpb25hbERlcGVuZGVuY2llc1wiOiB7XG5cdFx0XCJ3ZWV4LXRyYW5zZm9ybWVyXCI6IFwifjAuM1wiXG5cdH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3BhY2thZ2UuanNvblxuICoqIG1vZHVsZSBpZCA9IDEwNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFRoZSBhcGkgZm9yIGludm9raW5nIHdpdGggXCIkXCIgcHJlZml4XG4gKi9cbmltcG9ydCB7dHlwb2YsIGV4dGVuZH0gZnJvbSAnLi4vdXRpbCdcblxuLyoqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBjb21tb25cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSAkdm0gaW5zdGVhZFxuICogZmluZCB0aGUgdm0gYnkgaWRcbiAqIE5vdGU6IHRoZXJlIGlzIG9ubHkgb25lIGlkIGluIHdob2xlIGNvbXBvbmVudFxuICogQHBhcmFtICB7c3RyaW5nfSBpZFxuICogQHJldHVybiB7Vm19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiAkKGlkKSB7XG4gIG5hdGl2ZUxvZygnW1dBUk5JTkddIHRoZSBWbSMkIGFwaSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIFZtIyR2bSBpbnN0ZWFkJylcbiAgY29uc3QgaW5mbyA9IHRoaXMuX2lkc1tpZF1cbiAgaWYgKGluZm8pIHtcbiAgICByZXR1cm4gaW5mby52bVxuICB9XG59XG5cbi8qKlxuICogZmluZCB0aGUgZWxlbWVudCBieSBpZFxuICogTm90ZTogdGhlcmUgaXMgb25seSBvbmUgaWQgaW4gd2hvbGUgY29tcG9uZW50XG4gKiBAcGFyYW0gIHtzdHJpbmd9IGlkXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gJGVsKGlkKSB7XG4gIGNvbnN0IGluZm8gPSB0aGlzLl9pZHNbaWRdXG4gIGlmIChpbmZvKSB7XG4gICAgcmV0dXJuIGluZm8uZWxcbiAgfVxufVxuXG4vKipcbiAqIGZpbmQgdGhlIHZtIG9mIHRoZSBjdXN0b20gY29tcG9uZW50IGJ5IGlkXG4gKiBOb3RlOiB0aGVyZSBpcyBvbmx5IG9uZSBpZCBpbiB3aG9sZSBjb21wb25lbnRcbiAqIEBwYXJhbSAge3N0cmluZ30gaWRcbiAqIEByZXR1cm4ge1ZtfVxuICovXG5leHBvcnQgZnVuY3Rpb24gJHZtKGlkKSB7XG4gIGNvbnN0IGluZm8gPSB0aGlzLl9pZHNbaWRdXG4gIGlmIChpbmZvKSB7XG4gICAgcmV0dXJuIGluZm8udm1cbiAgfVxufVxuXG4vKipcbiAqIEZpcmUgd2hlbiBkaWZmZXIgcmVuZGVyaW5nIGZpbmlzaGVkXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiAkcmVuZGVyVGhlbihmbikge1xuICBjb25zdCBhcHAgPSB0aGlzLl9hcHBcbiAgY29uc3QgZGlmZmVyID0gYXBwLmRpZmZlclxuICByZXR1cm4gZGlmZmVyLnRoZW4oKCkgPT4ge1xuICAgIGZuKClcbiAgfSlcbn1cblxuLyoqXG4gKiBzY3JvbGwgYW4gZWxlbWVudCBzcGVjaWZpZWQgYnkgaWQgaW50byB2aWV3LCBcbiAqIG1vcmVvdmVyIHNwZWNpZnkgYSBudW1iZXIgb2Ygb2Zmc2V0IG9wdGlvbmFsbHlcbiAqIEBwYXJhbSAge3N0cmluZ30gaWRcbiAqIEBwYXJhbSAge251bWJlcn0gb2Zmc2V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiAkc2Nyb2xsVG8oaWQsIG9mZnNldCkge1xuICBjb25zdCBlbCA9IHRoaXMuJGVsKGlkKVxuICBpZiAoZWwpIHtcbiAgICBjb25zdCBkb20gPSB0aGlzLl9hcHAucmVxdWlyZU1vZHVsZSgnZG9tJylcbiAgICBkb20uc2Nyb2xsVG9FbGVtZW50KGVsLnJlZiwge29mZnNldDogb2Zmc2V0fSlcbiAgfVxufVxuXG4vKipcbiAqIHBlcmZvcm0gdHJhbnNpdGlvbiBhbmltYXRpb24gb24gYW4gZWxlbWVudCBzcGVjaWZpZWQgYnkgaWRcbiAqIEBwYXJhbSAge3N0cmluZ30gICBpZFxuICogQHBhcmFtICB7b2JqZWN0fSAgIG9wdGlvbnNcbiAqIEBwYXJhbSAge29iamVjdH0gICBvcHRpb25zLnN0eWxlc1xuICogQHBhcmFtICB7b2JqZWN0fSAgIG9wdGlvbnMuZHVyYXRpb24obXMpXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgW29wdGlvbnMudGltaW5nRnVuY3Rpb25dXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgW29wdGlvbnMuZGVsYXk9MChtcyldXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uICR0cmFuc2l0aW9uKGlkLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBjb25zdCBlbCA9IHRoaXMuJGVsKGlkKVxuICBpZiAoZWwgJiYgb3B0aW9ucyAmJiBvcHRpb25zLnN0eWxlcykge1xuICAgIGNvbnN0IGFuaW1hdGlvbiA9IHRoaXMuX2FwcC5yZXF1aXJlTW9kdWxlKCdhbmltYXRpb24nKVxuICAgIGFuaW1hdGlvbi50cmFuc2l0aW9uKGVsLnJlZiwgb3B0aW9ucywgKC4uLmFyZ3MpID0+IHtcbiAgICAgIHRoaXMuX3NldFN0eWxlKGVsLCBvcHRpb25zLnN0eWxlcylcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKC4uLmFyZ3MpXG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIGdldCBzb21lIGNvbmZpZ1xuICogQHJldHVybiB7b2JqZWN0fSBzb21lIGNvbmZpZyBmb3IgYXBwIGluc3RhbmNlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYnVuZGxlVXJsXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGRlYnVnXG4gKiBAcHJvcGVydHkge29iamVjdH0gZW52XG4gKiBAcHJvcGVydHkge3N0cmluZ30gZW52LndlZXhWZXJzaW9uKGV4LiAxLjAuMClcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbnYuYXBwTmFtZShleC4gVEIvVE0pXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZW52LmFwcFZlcnNpb24oZXguIDUuMC4wKVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGVudi5wbGF0Zm9ybShleC4gaU9TL0FuZHJvaWQpXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZW52Lm9zVmVyc2lvbihleC4gNy4wLjApXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZW52LmRldmljZU1vZGVsICoqbmF0aXZlIG9ubHkqKlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVudi5bZGV2aWNlV2lkdGg9NzUwXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVudi5kZXZpY2VIZWlnaHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uICRnZXRDb25maWcoY2FsbGJhY2spIHtcbiAgY29uc3QgY29uZmlnID0gZXh0ZW5kKHtcbiAgICBlbnY6IGdsb2JhbC5XWEVudmlyb25tZW50IHx8IHt9XG4gIH0sIHRoaXMuX2FwcC5vcHRpb25zKVxuICBpZiAodHlwb2YoY2FsbGJhY2spID09PSAnZnVuY3Rpb24nKSB7XG4gICAgbmF0aXZlTG9nKCdbV0FSTklOR10gdGhlIGNhbGxiYWNrIG9mIFZtIyRnZXRDb25maWcoY2FsbGJhY2spIGlzIGRlcHJlY2F0ZWQsICcgK1xuICAgICAgJ3RoaXMgYXBpIG5vdyBjYW4gZGlyZWN0bHkgUkVUVVJOIGNvbmZpZyBpbmZvLicpXG4gICAgY2FsbGJhY2soY29uZmlnKVxuICB9XG4gIHJldHVybiBjb25maWdcbn1cblxuLyoqXG4gKiByZXF1ZXN0IG5ldHdvcmsgdmlhIGh0dHAgcHJvdG9jb2xcbiAqIEBwYXJhbSAge29iamVjdH0gICBwYXJhbXNcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gJHNlbmRIdHRwKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgY29uc3Qgc3RyZWFtID0gdGhpcy5fYXBwLnJlcXVpcmVNb2R1bGUoJ3N0cmVhbScpXG4gIHN0cmVhbS5zZW5kSHR0cChwYXJhbXMsIGNhbGxiYWNrKVxufVxuXG4vKipcbiAqIG9wZW4gYSB1cmxcbiAqIEBwYXJhbSAge3N0cmluZ30gdXJsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiAkb3BlblVSTCh1cmwpIHtcbiAgY29uc3QgZXZlbnQgPSB0aGlzLl9hcHAucmVxdWlyZU1vZHVsZSgnZXZlbnQnKVxuICBldmVudC5vcGVuVVJMKHVybClcbn1cblxuLyoqXG4gKiBzZXQgYSB0aXRsZSBmb3IgcGFnZVxuICogQHBhcmFtICB7c3RyaW5nfSB0aXRsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gJHNldFRpdGxlKHRpdGxlKSB7XG4gIGNvbnN0IHBhZ2VJbmZvID0gdGhpcy5fYXBwLnJlcXVpcmVNb2R1bGUoJ3BhZ2VJbmZvJylcbiAgcGFnZUluZm8uc2V0VGl0bGUodGl0bGUpXG59XG5cbi8qKlxuICogaW52b2tlIGEgbmF0aXZlIG1ldGhvZCBieSBzcGVjaWZpbmcgdGhlIG5hbWUgb2YgbW9kdWxlIGFuZCBtZXRob2RcbiAqIEBwYXJhbSAge3N0cmluZ30gbW9kdWxlTmFtZVxuICogQHBhcmFtICB7c3RyaW5nfSBtZXRob2ROYW1lXG4gKiBAcGFyYW0gIHsuLi4qfSB0aGUgcmVzdCBhcmd1bWVudHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uICRjYWxsKG1vZHVsZU5hbWUsIG1ldGhvZE5hbWUsIC4uLmFyZ3MpIHtcbiAgY29uc3QgbW9kdWxlID0gdGhpcy5fYXBwLnJlcXVpcmVNb2R1bGUobW9kdWxlTmFtZSlcbiAgaWYgKG1vZHVsZSAmJiBtb2R1bGVbbWV0aG9kTmFtZV0pIHtcbiAgICBtb2R1bGVbbWV0aG9kTmFtZV0oLi4uYXJncylcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvYXBpL21ldGhvZHMuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9