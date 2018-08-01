(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Resizable = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
	'use strict'
	
	/**
	 * Expose `arrayFlatten`.
	 */
	module.exports = flatten
	module.exports.from = flattenFrom
	module.exports.depth = flattenDepth
	module.exports.fromDepth = flattenFromDepth
	
	/**
	 * Flatten an array.
	 *
	 * @param  {Array} array
	 * @return {Array}
	 */
	function flatten (array) {
		if (!Array.isArray(array)) {
			throw new TypeError('Expected value to be an array')
		}
	
		return flattenFrom(array)
	}
	
	/**
	 * Flatten an array-like structure.
	 *
	 * @param  {Array} array
	 * @return {Array}
	 */
	function flattenFrom (array) {
		return flattenDown(array, [])
	}
	
	/**
	 * Flatten an array-like structure with depth.
	 *
	 * @param  {Array}  array
	 * @param  {number} depth
	 * @return {Array}
	 */
	function flattenDepth (array, depth) {
		if (!Array.isArray(array)) {
			throw new TypeError('Expected value to be an array')
		}
	
		return flattenFromDepth(array, depth)
	}
	
	/**
	 * Flatten an array-like structure with depth.
	 *
	 * @param  {Array}  array
	 * @param  {number} depth
	 * @return {Array}
	 */
	function flattenFromDepth (array, depth) {
		if (typeof depth !== 'number') {
			throw new TypeError('Expected the depth to be a number')
		}
	
		return flattenDownDepth(array, [], depth)
	}
	
	/**
	 * Flatten an array indefinitely.
	 *
	 * @param  {Array} array
	 * @param  {Array} result
	 * @return {Array}
	 */
	function flattenDown (array, result) {
		for (var i = 0; i < array.length; i++) {
			var value = array[i]
	
			if (Array.isArray(value)) {
				flattenDown(value, result)
			} else {
				result.push(value)
			}
		}
	
		return result
	}
	
	/**
	 * Flatten an array with depth.
	 *
	 * @param  {Array}  array
	 * @param  {Array}  result
	 * @param  {number} depth
	 * @return {Array}
	 */
	function flattenDownDepth (array, result, depth) {
		depth--
	
		for (var i = 0; i < array.length; i++) {
			var value = array[i]
	
			if (depth > -1 && Array.isArray(value)) {
				flattenDownDepth(value, result, depth)
			} else {
				result.push(value)
			}
		}
	
		return result
	}
	
	},{}],2:[function(require,module,exports){
	/*!
	 * array-unique <https://github.com/jonschlinkert/array-unique>
	 *
	 * Copyright (c) 2014 Jon Schlinkert, contributors.
	 * Licensed under the MIT license.
	 */
	
	'use strict';
	
	module.exports = function unique(arr) {
		if (!Array.isArray(arr)) {
			throw new TypeError('array-unique expects an array.');
		}
	
		var len = arr.length;
		var i = -1;
	
		while (i++ < len) {
			var j = i + 1;
	
			for (; j < arr.length; ++j) {
				if (arr[i] === arr[j]) {
					arr.splice(j--, 1);
				}
			}
		}
		return arr;
	};
	
	},{}],3:[function(require,module,exports){
	/*!
	 * arrayify-compact <https://github.com/jonschlinkert/arrayify-compact>
	 *
	 * Copyright (c) 2014 Jon Schlinkert, contributors.
	 * Licensed under the MIT License
	 */
	
	'use strict';
	
	var flatten = require('array-flatten');
	
	module.exports = function(arr) {
		return flatten(!Array.isArray(arr) ? [arr] : arr)
			.filter(Boolean);
	};
	
	},{"array-flatten":1}],4:[function(require,module,exports){
	/**
	 * Define stateful property on an object
	 */
	module.exports = defineState;
	
	var State = require('st8');
	
	
	/**
	 * Define stateful property on a target
	 *
	 * @param {object} target Any object
	 * @param {string} property Property name
	 * @param {object} descriptor State descriptor
	 *
	 * @return {object} target
	 */
	function defineState (target, property, descriptor, isFn) {
		//define accessor on a target
		if (isFn) {
			target[property] = function () {
				if (arguments.length) {
					return state.set(arguments[0]);
				}
				else {
					return state.get();
				}
			};
		}
	
		//define setter/getter on a target
		else {
			Object.defineProperty(target, property, {
				set: function (value) {
					return state.set(value);
				},
				get: function () {
					return state.get();
				}
			});
		}
	
		//define state controller
		var state = new State(descriptor, target);
	
		return target;
	}
	},{"st8":66}],5:[function(require,module,exports){
	/**
	 * @module emmy/emit
	 */
	var icicle = require('icicle');
	var slice = require('sliced');
	var listeners = require('./listeners');
	var isBrowser = require('is-browser');
	
	
	/**
	 * A simple wrapper to handle stringy/plain events
	 */
	module.exports = function(target, evt){
		if (!target) return;
	
		var args = arguments;
		if (typeof evt === 'string') {
			args = slice(arguments, 2);
			evt.split(/\s+/).forEach(function(evt){
				evt = evt.split('.')[0];
	
				emit.apply(this, [target, evt].concat(args));
			});
		} else {
			return emit.apply(this, args);
		}
	};
	
	
	/** detect env */
	var $ = typeof jQuery === 'undefined' ? undefined : jQuery;
	var doc = typeof document === 'undefined' ? undefined : document;
	var win = typeof window === 'undefined' ? undefined : window;
	
	
	/**
	 * Emit an event, optionally with data or bubbling
	 * Accept only single elements/events
	 *
	 * @param {string} eventName An event name, e. g. 'click'
	 * @param {*} data Any data to pass to event.details (DOM) or event.data (elsewhere)
	 * @param {bool} bubbles Whether to trigger bubbling event (DOM)
	 *
	 *
	 * @return {target} a target
	 */
	function emit(target, eventName, data, bubbles){
		var emitMethod, evt = eventName;
	
		//Create proper event for DOM objects
		if (isBrowser && (target instanceof Node || target === win)) {
			//NOTE: this doesnot bubble on off-DOM elements
	
			if (isBrowser && eventName instanceof Event) {
				evt = eventName;
			} else {
				//IE9-compliant constructor
				evt = doc.createEvent('CustomEvent');
				evt.initCustomEvent(eventName, bubbles, true, data);
	
				//a modern constructor would be:
				// var evt = new CustomEvent(eventName, { detail: data, bubbles: bubbles })
			}
	
			emitMethod = target.dispatchEvent;
		}
	
		//create event for jQuery object
		else if ($ && target instanceof $) {
			//TODO: decide how to pass data
			evt = $.Event( eventName, data );
			evt.detail = data;
	
			//FIXME: reference case where triggerHandler needed (something with multiple calls)
			emitMethod = bubbles ? targte.trigger : target.triggerHandler;
		}
	
		//detect target events
		else {
			//emit - default
			//trigger - jquery
			//dispatchEvent - DOM
			//raise - node-state
			//fire - ???
			emitMethod = target['dispatchEvent'] || target['emit'] || target['trigger'] || target['fire'] || target['raise'];
		}
	
	
		var args = slice(arguments, 2);
	
	
		//use locks to avoid self-recursion on objects wrapping this method
		if (emitMethod) {
			if (icicle.freeze(target, 'emit' + eventName)) {
				//use target event system, if possible
				emitMethod.apply(target, [evt].concat(args));
				icicle.unfreeze(target, 'emit' + eventName);
	
				return target;
			}
	
			//if event was frozen - probably it is emitter instance
			//so perform normal callback
		}
	
	
		//fall back to default event system
		var evtCallbacks = listeners(target, evt);
	
		//copy callbacks to fire because list can be changed by some callback (like `off`)
		var fireList = slice(evtCallbacks);
		for (var i = 0; i < fireList.length; i++ ) {
			fireList[i] && fireList[i].apply(target, args);
		}
	
		return target;
	}
	
	},{"./listeners":6,"icicle":13,"is-browser":16,"sliced":64}],6:[function(require,module,exports){
	/**
	 * A storage of per-target callbacks.
	 * WeakMap is the most safe solution.
	 *
	 * @module emmy/listeners
	 */
	
	
	/**
	 * Property name to provide on targets.
	 *
	 * Can’t use global WeakMap -
	 * it is impossible to provide singleton global cache of callbacks for targets
	 * not polluting global scope. So it is better to pollute target scope than the global.
	 *
	 * Otherwise, each emmy instance will create it’s own cache, which leads to mess.
	 *
	 * Also can’t use `._events` property on targets, as it is done in `events` module,
	 * because it is incompatible. Emmy targets universal events wrapper, not the native implementation.
	 *
	 */
	//FIXME: new npm forces flat modules structure, so weakmaps are better providing that there’s the one emmy across the project.
	var cbPropName = '_callbacks';
	
	
	/**
	 * Get listeners for the target/evt (optionally).
	 *
	 * @param {object} target a target object
	 * @param {string}? evt an evt name, if undefined - return object with events
	 *
	 * @return {(object|array)} List/set of listeners
	 */
	function listeners(target, evt, tags){
		var cbs = target[cbPropName];
		var result;
	
		if (!evt) {
			result = cbs || {};
	
			//filter cbs by tags
			if (tags) {
				var filteredResult = {};
				for (var evt in result) {
					filteredResult[evt] = result[evt].filter(function (cb) {
						return hasTags(cb, tags);
					});
				}
				result = filteredResult;
			}
	
			return result;
		}
	
		if (!cbs || !cbs[evt]) {
			return [];
		}
	
		result = cbs[evt];
	
		//if there are evt namespaces specified - filter callbacks
		if (tags && tags.length) {
			result = result.filter(function (cb) {
				return hasTags(cb, tags);
			});
		}
	
		return result;
	}
	
	
	/**
	 * Remove listener, if any
	 */
	listeners.remove = function(target, evt, cb, tags){
		//get callbacks for the evt
		var evtCallbacks = target[cbPropName];
		if (!evtCallbacks || !evtCallbacks[evt]) return false;
	
		var callbacks = evtCallbacks[evt];
	
		//if tags are passed - make sure callback has some tags before removing
		if (tags && tags.length && !hasTags(cb, tags)) return false;
	
		//remove specific handler
		for (var i = 0; i < callbacks.length; i++) {
			//once method has original callback in .cb
			if (callbacks[i] === cb || callbacks[i].fn === cb) {
				callbacks.splice(i, 1);
				break;
			}
		}
	};
	
	
	/**
	 * Add a new listener
	 */
	listeners.add = function(target, evt, cb, tags){
		if (!cb) return;
	
		var targetCallbacks = target[cbPropName];
	
		//ensure set of callbacks for the target exists
		if (!targetCallbacks) {
			targetCallbacks = {};
			Object.defineProperty(target, cbPropName, {
				value: targetCallbacks
			});
		}
	
		//save a new callback
		(targetCallbacks[evt] = targetCallbacks[evt] || []).push(cb);
	
		//save ns for a callback, if any
		if (tags && tags.length) {
			cb._ns = tags;
		}
	};
	
	
	/** Detect whether an cb has at least one tag from the list */
	function hasTags(cb, tags){
		if (cb._ns) {
			//if cb is tagged with a ns and includes one of the ns passed - keep it
			for (var i = tags.length; i--;){
				if (cb._ns.indexOf(tags[i]) >= 0) return true;
			}
		}
	}
	
	
	module.exports = listeners;
	},{}],7:[function(require,module,exports){
	/**
	 * @module emmy/off
	 */
	module.exports = off;
	
	var icicle = require('icicle');
	var slice = require('sliced');
	var listeners = require('./listeners');
	
	
	/**
	 * Remove listener[s] from the target
	 *
	 * @param {[type]} evt [description]
	 * @param {Function} fn [description]
	 *
	 * @return {[type]} [description]
	 */
	function off(target, evt, fn) {
		if (!target) return target;
	
		var callbacks, i;
	
		//unbind all listeners if no fn specified
		if (fn === undefined) {
			var args = slice(arguments, 1);
	
			//try to use target removeAll method, if any
			var allOff = target['removeAll'] || target['removeAllListeners'];
	
			//call target removeAll
			if (allOff) {
				allOff.apply(target, args);
			}
	
	
			//then forget own callbacks, if any
	
			//unbind all evts
			if (!evt) {
				callbacks = listeners(target);
				for (evt in callbacks) {
					off(target, evt);
				}
			}
			//unbind all callbacks for an evt
			else {
				evt = '' + evt;
	
				//invoke method for each space-separated event from a list
				evt.split(/\s+/).forEach(function (evt) {
					var evtParts = evt.split('.');
					evt = evtParts.shift();
					callbacks = listeners(target, evt, evtParts);
	
					//returned array of callbacks (as event is defined)
					if (evt) {
						var obj = {};
						obj[evt] = callbacks;
						callbacks = obj;
					}
	
					//for each group of callbacks - unbind all
					for (var evtName in callbacks) {
						slice(callbacks[evtName]).forEach(function (cb) {
							off(target, evtName, cb);
						});
					}
				});
			}
	
			return target;
		}
	
	
		//target events (string notation to advanced_optimizations)
		var offMethod = target['removeEventListener'] || target['removeListener'] || target['detachEvent'] || target['off'];
	
		//invoke method for each space-separated event from a list
		evt.split(/\s+/).forEach(function (evt) {
			var evtParts = evt.split('.');
			evt = evtParts.shift();
	
			//use target `off`, if possible
			if (offMethod) {
				//avoid self-recursion from the outside
				if (icicle.freeze(target, 'off' + evt)) {
					offMethod.call(target, evt, fn);
					icicle.unfreeze(target, 'off' + evt);
				}
	
				//if it’s frozen - ignore call
				else {
					return target;
				}
			}
	
			if (fn.closedCall) fn.closedCall = false;
	
			//forget callback
			listeners.remove(target, evt, fn, evtParts);
		});
	
	
		return target;
	}
	
	},{"./listeners":6,"icicle":13,"sliced":64}],8:[function(require,module,exports){
	/**
	 * @module emmy/on
	 */
	
	
	var icicle = require('icicle');
	var listeners = require('./listeners');
	var isObject = require('is-plain-obj');
	
	module.exports = on;
	
	
	/**
	 * Bind fn to a target.
	 *
	 * @param {*} targte A single target to bind evt
	 * @param {string} evt An event name
	 * @param {Function} fn A callback
	 * @param {Function}? condition An optional filtering fn for a callback
	 *                              which accepts an event and returns callback
	 *
	 * @return {object} A target
	 */
	function on(target, evt, fn){
		if (!target) return target;
	
		//consider object of events
		if (isObject(evt)) {
			for(var evtName in evt) {
				on(target, evtName, evt[evtName]);
			}
			return target;
		}
	
		//get target `on` method, if any
		//prefer native-like method name
		//user may occasionally expose `on` to the global, in case of browserify
		//but it is unlikely one would replace native `addEventListener`
		var onMethod =  target['addEventListener'] || target['addListener'] || target['attachEvent'] || target['on'];
	
		var cb = fn;
	
		evt = '' + evt;
	
		//invoke method for each space-separated event from a list
		evt.split(/\s+/).forEach(function(evt){
			var evtParts = evt.split('.');
			evt = evtParts.shift();
	
			//use target event system, if possible
			if (onMethod) {
				//avoid self-recursions
				//if it’s frozen - ignore call
				if (icicle.freeze(target, 'on' + evt)){
					onMethod.call(target, evt, cb);
					icicle.unfreeze(target, 'on' + evt);
				}
				else {
					return target;
				}
			}
	
			//save the callback anyway
			listeners.add(target, evt, cb, evtParts);
		});
	
		return target;
	}
	
	
	/**
	 * Wrap an fn with condition passing
	 */
	on.wrap = function(target, evt, fn, condition){
		var cb = function() {
			if (condition.apply(target, arguments)) {
				return fn.apply(target, arguments);
			}
		};
	
		cb.fn = fn;
	
		return cb;
	};
	
	},{"./listeners":6,"icicle":13,"is-plain-obj":17}],9:[function(require,module,exports){
	/**
	 * Get clientY/clientY from an event.
	 * If index is passed, treat it as index of global touches, not the targetTouches.
	 * Global touches include target touches.
	 *
	 * @module get-client-xy
	 *
	 * @param {Event} e Event raised, like mousemove
	 *
	 * @return {number} Coordinate relative to the screen
	 */
	function getClientY (e, idx) {
		// touch event
		if (e.touches) {
			if (arguments.length > 1) {
				return findTouch(e.touches, idx).clientY
			}
			else {
				return e.targetTouches[0].clientY;
			}
		}
	
		// mouse event
		return e.clientY;
	}
	function getClientX (e, idx) {
		// touch event
		if (e.touches) {
			if (arguments.length > idx) {
				return findTouch(e.touches, idx).clientX;
			}
			else {
				return e.targetTouches[0].clientX;
			}
		}
	
		// mouse event
		return e.clientX;
	}
	
	function getClientXY (e, idx) {
		return [getClientX.apply(this, arguments), getClientY.apply(this, arguments)];
	}
	
	function findTouch (touchList, idx) {
		for (var i = 0; i < touchList.length; i++) {
			if (touchList[i].identifier === idx) {
				return touchList[i];
			}
		}
	}
	
	
	getClientXY.x = getClientX;
	getClientXY.y = getClientY;
	getClientXY.findTouch = findTouch;
	
	module.exports = getClientXY;
	},{}],10:[function(require,module,exports){
	/**
	 * @module  get-doc
	 */
	
	var hasDom = require('has-dom');
	
	module.exports = hasDom() ? document : null;
	},{"has-dom":12}],11:[function(require,module,exports){
	/** generate unique id for selector */
	var counter = Date.now() % 1e9;
	
	module.exports = function getUid(){
		return (Math.random() * 1e9 >>> 0) + (counter++);
	};
	},{}],12:[function(require,module,exports){
	'use strict';
	module.exports = function () {
		return typeof window !== 'undefined'
			&& typeof document !== 'undefined'
			&& typeof document.createElement === 'function';
	};
	
	},{}],13:[function(require,module,exports){
	/**
	 * @module Icicle
	 */
	module.exports = {
		freeze: lock,
		unfreeze: unlock,
		isFrozen: isLocked
	};
	
	
	/** Set of targets  */
	var lockCache = new WeakMap;
	
	
	/**
	 * Set flag on target with the name passed
	 *
	 * @return {bool} Whether lock succeeded
	 */
	function lock(target, name){
		var locks = lockCache.get(target);
		if (locks && locks[name]) return false;
	
		//create lock set for a target, if none
		if (!locks) {
			locks = {};
			lockCache.set(target, locks);
		}
	
		//set a new lock
		locks[name] = true;
	
		//return success
		return true;
	}
	
	
	/**
	 * Unset flag on the target with the name passed.
	 *
	 * Note that if to return new value from the lock/unlock,
	 * then unlock will always return false and lock will always return true,
	 * which is useless for the user, though maybe intuitive.
	 *
	 * @param {*} target Any object
	 * @param {string} name A flag name
	 *
	 * @return {bool} Whether unlock failed.
	 */
	function unlock(target, name){
		var locks = lockCache.get(target);
		if (!locks || !locks[name]) return false;
	
		locks[name] = null;
	
		return true;
	}
	
	
	/**
	 * Return whether flag is set
	 *
	 * @param {*} target Any object to associate lock with
	 * @param {string} name A flag name
	 *
	 * @return {Boolean} Whether locked or not
	 */
	function isLocked(target, name){
		var locks = lockCache.get(target);
		return (locks && locks[name]);
	}
	},{}],14:[function(require,module,exports){
	if (typeof Object.create === 'function') {
		// implementation from standard node.js 'util' module
		module.exports = function inherits(ctor, superCtor) {
			ctor.super_ = superCtor
			ctor.prototype = Object.create(superCtor.prototype, {
				constructor: {
					value: ctor,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});
		};
	} else {
		// old school shim for old browsers
		module.exports = function inherits(ctor, superCtor) {
			ctor.super_ = superCtor
			var TempCtor = function () {}
			TempCtor.prototype = superCtor.prototype
			ctor.prototype = new TempCtor()
			ctor.prototype.constructor = ctor
		}
	}
	
	},{}],15:[function(require,module,exports){
	/** @module  intersects */
	module.exports = intersects;
	
	
	var min = Math.min, max = Math.max;
	
	
	/**
	 * Main intersection detector.
	 *
	 * @param {Rectangle} a Target
	 * @param {Rectangle} b Container
	 *
	 * @return {bool} Whether target is within the container
	 */
	function intersects (a, b, tolerance){
		//ignore definite disintersection
		if (a.right < b.left || a.left > b.right) return false;
		if (a.bottom < b.top || a.top > b.bottom) return false;
	
		//intersection values
		var iX = min(a.right - max(b.left, a.left), b.right - max(a.left, b.left));
		var iY = min(a.bottom - max(b.top, a.top), b.bottom - max(a.top, b.top));
		var iSquare = iX * iY;
	
		var bSquare = (b.bottom - b.top) * (b.right - b.left);
		var aSquare = (a.bottom - a.top) * (a.right - a.left);
	
		//measure square overlap relative to the min square
		var targetSquare = min(aSquare, bSquare);
	
	
		//minimal overlap ratio
		tolerance = tolerance !== undefined ? tolerance : 0.5;
	
		if (iSquare / targetSquare > tolerance) {
			return true;
		}
	
		return false;
	}
	},{}],16:[function(require,module,exports){
	module.exports = true;
	},{}],17:[function(require,module,exports){
	'use strict';
	var toString = Object.prototype.toString;
	
	module.exports = function (x) {
		var prototype;
		return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
	};
	
	},{}],18:[function(require,module,exports){
	/*!
	 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */
	
	'use strict';
	
	var isObject = require('isobject');
	
	function isObjectObject(o) {
		return isObject(o) === true
			&& Object.prototype.toString.call(o) === '[object Object]';
	}
	
	module.exports = function isPlainObject(o) {
		var ctor,prot;
	
		if (isObjectObject(o) === false) return false;
	
		// If has modified constructor
		ctor = o.constructor;
		if (typeof ctor !== 'function') return false;
	
		// If has modified prototype
		prot = ctor.prototype;
		if (isObjectObject(prot) === false) return false;
	
		// If constructor does not have an Object-specific method
		if (prot.hasOwnProperty('isPrototypeOf') === false) {
			return false;
		}
	
		// Most likely a plain Object
		return true;
	};
	
	},{"isobject":19}],19:[function(require,module,exports){
	/*!
	 * isobject <https://github.com/jonschlinkert/isobject>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */
	
	'use strict';
	
	module.exports = function isObject(val) {
		return val != null && typeof val === 'object' && Array.isArray(val) === false;
	};
	
	},{}],20:[function(require,module,exports){
	/**
	 * Parse element’s borders
	 *
	 * @module mucss/borders
	 */
	
	var Rect = require('./rect');
	var parse = require('./parse-value');
	
	/**
	 * Return border widths of an element
	 */
	module.exports = function(el){
		if (el === window) return Rect();
	
		if (!(el instanceof Element)) throw Error('Argument is not an element');
	
		var style = window.getComputedStyle(el);
	
		return Rect(
			parse(style.borderLeftWidth),
			parse(style.borderTopWidth),
			parse(style.borderRightWidth),
			parse(style.borderBottomWidth)
		);
	};
	},{"./parse-value":28,"./rect":30}],21:[function(require,module,exports){
	/**
	 * Get or set element’s style, prefix-agnostic.
	 *
	 * @module  mucss/css
	 */
	var fakeStyle = require('./fake-element').style;
	var prefix = require('./prefix').lowercase;
	
	
	/**
	 * Apply styles to an element.
	 *
	 * @param    {Element}   el   An element to apply styles.
	 * @param    {Object|string}   obj   Set of style rules or string to get style rule.
	 */
	module.exports = function(el, obj){
		if (!el || !obj) return;
	
		var name, value;
	
		//return value, if string passed
		if (typeof obj === 'string') {
			name = obj;
	
			//return value, if no value passed
			if (arguments.length < 3) {
				return el.style[prefixize(name)];
			}
	
			//set style, if value passed
			value = arguments[2] || '';
			obj = {};
			obj[name] = value;
		}
	
		for (name in obj){
			//convert numbers to px
			if (typeof obj[name] === 'number' && /left|right|bottom|top|width|height/i.test(name)) obj[name] += 'px';
	
			value = obj[name] || '';
	
			el.style[prefixize(name)] = value;
		}
	};
	
	
	/**
	 * Return prefixized prop name, if needed.
	 *
	 * @param    {string}   name   A property name.
	 * @return   {string}   Prefixed property name.
	 */
	function prefixize(name){
		var uName = name[0].toUpperCase() + name.slice(1);
		if (fakeStyle[name] !== undefined) return name;
		if (fakeStyle[prefix + uName] !== undefined) return prefix + uName;
		return '';
	}
	
	},{"./fake-element":22,"./prefix":29}],22:[function(require,module,exports){
	/** Just a fake element to test styles
	 * @module mucss/fake-element
	 */
	
	module.exports = document.createElement('div');
	},{}],23:[function(require,module,exports){
	/**
	 * Window scrollbar detector.
	 *
	 * @module mucss/has-scroll
	 */
	
	//TODO: detect any element scroll, not only the window
	exports.x = function () {
		return window.innerHeight > document.documentElement.clientHeight;
	};
	exports.y = function () {
		return window.innerWidth > document.documentElement.clientWidth;
	};
	},{}],24:[function(require,module,exports){
	/**
	 * Detect whether element is placed to fixed container or is fixed itself.
	 *
	 * @module mucss/is-fixed
	 *
	 * @param {(Element|Object)} el Element to detect fixedness.
	 *
	 * @return {boolean} Whether element is nested.
	 */
	module.exports = function (el) {
		var parentEl = el;
	
		//window is fixed, btw
		if (el === window) return true;
	
		//unlike the doc
		if (el === document) return false;
	
		while (parentEl) {
			if (getComputedStyle(parentEl).position === 'fixed') return true;
			parentEl = parentEl.offsetParent;
		}
		return false;
	};
	},{}],25:[function(require,module,exports){
	/**
	 * Get margins of an element.
	 * @module mucss/margins
	 */
	
	var parse = require('./parse-value');
	var Rect = require('./rect');
	
	/**
	 * Return margins of an element.
	 *
	 * @param    {Element}   el   An element which to calc margins.
	 * @return   {Object}   Paddings object `{top:n, bottom:n, left:n, right:n}`.
	 */
	module.exports = function(el){
		if (el === window) return Rect();
	
		if (!(el instanceof Element)) throw Error('Argument is not an element');
	
		var style = window.getComputedStyle(el);
	
		return Rect(
			parse(style.marginLeft),
			parse(style.marginTop),
			parse(style.marginRight),
			parse(style.marginBottom)
		);
	};
	
	},{"./parse-value":28,"./rect":30}],26:[function(require,module,exports){
	/**
	 * Calculate absolute offsets of an element, relative to the document.
	 *
	 * @module mucss/offsets
	 *
	 */
	var win = window;
	var doc = document;
	var Rect = require('./rect');
	var hasScroll = require('./has-scroll');
	var scrollbar = require('./scrollbar');
	var isFixedEl = require('./is-fixed');
	var getTranslate = require('./translate');
	
	
	/**
	 * Return absolute offsets of any target passed
	 *
	 * @param    {Element|window}   el   A target. Pass window to calculate viewport offsets
	 * @return   {Object}   Offsets object with trbl.
	 */
	module.exports = offsets;
	
	function offsets (el) {
		if (!el) throw Error('Bad argument');
	
		//calc client rect
		var cRect, result;
	
		//return vp offsets
		if (el === win) {
			result = Rect(
				win.pageXOffset,
				win.pageYOffset
			);
	
			result.width = win.innerWidth - (hasScroll.y() ? scrollbar : 0),
			result.height = win.innerHeight - (hasScroll.x() ? scrollbar : 0)
			result.right = result.left + result.width;
			result.bottom = result.top + result.height;
	
			return result;
		}
	
		//return absolute offsets if document requested
		else if (el === doc) {
			var res = offsets(doc.documentElement);
			res.bottom = Math.max(window.innerHeight, res.bottom);
			res.right = Math.max(window.innerWidth, res.right);
			res.height = Math.max(window.innerHeight, res.height);
			res.width = Math.max(window.innerHeight, res.width);
			if (hasScroll.y(doc.documentElement)) res.right -= scrollbar;
			if (hasScroll.x(doc.documentElement)) res.bottom -= scrollbar;
			return res;
		}
	
		//FIXME: why not every element has getBoundingClientRect method?
		try {
			cRect = el.getBoundingClientRect();
		} catch (e) {
			cRect = Rect(
				el.clientLeft,
				el.clientTop
			);
		}
	
		//whether element is or is in fixed
		var isFixed = isFixedEl(el);
		var xOffset = isFixed ? 0 : win.pageXOffset;
		var yOffset = isFixed ? 0 : win.pageYOffset;
	
		result = Rect(
			cRect.left + xOffset,
			cRect.top + yOffset,
			cRect.left + xOffset + el.offsetWidth,
			cRect.top + yOffset + el.offsetHeight
		);
	
		return result;
	};
	},{"./has-scroll":23,"./is-fixed":24,"./rect":30,"./scrollbar":31,"./translate":33}],27:[function(require,module,exports){
	/**
	 * Caclulate paddings of an element.
	 * @module  mucss/paddings
	 */
	
	
	var Rect = require('./rect');
	var parse = require('./parse-value');
	
	
	/**
	 * Return paddings of an element.
	 *
	 * @param    {Element}   el   An element to calc paddings.
	 * @return   {Object}   Paddings object `{top:n, bottom:n, left:n, right:n}`.
	 */
	module.exports = function(el){
		if (el === window) return Rect();
	
		if (!(el instanceof Element)) throw Error('Argument is not an element');
	
		var style = window.getComputedStyle(el);
	
		return Rect(
			parse(style.paddingLeft),
			parse(style.paddingTop),
			parse(style.paddingRight),
			parse(style.paddingBottom)
		);
	};
	},{"./parse-value":28,"./rect":30}],28:[function(require,module,exports){
	/**
	 * Returns parsed css value.
	 *
	 * @module mucss/parse-value
	 *
	 * @param {string} str A string containing css units value
	 *
	 * @return {number} Parsed number value
	 */
	module.exports = function (str){
		str += '';
		return parseFloat(str.slice(0,-2)) || 0;
	};
	
	//FIXME: add parsing units
	},{}],29:[function(require,module,exports){
	/**
	 * Vendor prefixes
	 * Method of http://davidwalsh.name/vendor-prefix
	 * @module mucss/prefix
	 */
	
	var styles = getComputedStyle(document.documentElement, '');
	
	if (!styles) {
		module.exports = {
			dom: '', lowercase: '', css: '', js: ''
		};
	}
	
	else {
		var pre = (Array.prototype.slice.call(styles)
			.join('')
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
		)[1];
	
		var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
	
		module.exports = {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	}
	
	},{}],30:[function(require,module,exports){
	/**
	 * Simple rect constructor.
	 * It is just faster and smaller than constructing an object.
	 *
	 * @module mucss/rect
	 *
	 * @param {number} l left
	 * @param {number} t top
	 * @param {number} r right
	 * @param {number} b bottom
	 *
	 * @return {Rect} A rectangle object
	 */
	module.exports = function Rect (l,t,r,b) {
		if (!(this instanceof Rect)) return new Rect(l,t,r,b);
	
		this.left=l||0;
		this.top=t||0;
		this.right=r||0;
		this.bottom=b||0;
		this.width=Math.abs(this.right - this.left);
		this.height=Math.abs(this.bottom - this.top);
	};
	},{}],31:[function(require,module,exports){
	/**
	 * Calculate scrollbar width.
	 *
	 * @module mucss/scrollbar
	 */
	
	// Create the measurement node
	var scrollDiv = document.createElement("div");
	
	var style = scrollDiv.style;
	
	style.width = '100px';
	style.height = '100px';
	style.overflow = 'scroll';
	style.position = 'absolute';
	style.top = '-9999px';
	
	document.documentElement.appendChild(scrollDiv);
	
	// the scrollbar width
	module.exports = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	
	// Delete fake DIV
	document.documentElement.removeChild(scrollDiv);
	},{}],32:[function(require,module,exports){
	/**
	 * Enable/disable selectability of an element
	 * @module mucss/selection
	 */
	var css = require('./css');
	
	
	/**
	 * Disable or Enable any selection possibilities for an element.
	 *
	 * @param    {Element}   el   Target to make unselectable.
	 */
	exports.disable = function(el){
		css(el, {
			'user-select': 'none',
			'user-drag': 'none',
			'touch-callout': 'none'
		});
		el.setAttribute('unselectable', 'on');
		el.addEventListener('selectstart', pd);
	};
	exports.enable = function(el){
		css(el, {
			'user-select': null,
			'user-drag': null,
			'touch-callout': null
		});
		el.removeAttribute('unselectable');
		el.removeEventListener('selectstart', pd);
	};
	
	
	/** Prevent you know what. */
	function pd(e){
		e.preventDefault();
	}
	},{"./css":21}],33:[function(require,module,exports){
	/**
	 * Parse translate3d
	 *
	 * @module mucss/translate
	 */
	
	var css = require('./css');
	var parseValue = require('./parse-value');
	
	module.exports = function (el) {
		var translateStr = css(el, 'transform');
	
		//find translate token, retrieve comma-enclosed values
		//translate3d(1px, 2px, 2) → 1px, 2px, 2
		//FIXME: handle nested calcs
		var match = /translate(?:3d)?\s*\(([^\)]*)\)/.exec(translateStr);
	
		if (!match) return [0, 0];
		var values = match[1].split(/\s*,\s*/);
	
		//parse values
		//FIXME: nested values are not necessarily pixels
		return values.map(function (value) {
			return parseValue(value);
		});
	};
	},{"./css":21,"./parse-value":28}],34:[function(require,module,exports){
	/**
	 * Clamp value.
	 * Detects proper clamp min/max.
	 *
	 * @param {number} a Current value to cut off
	 * @param {number} min One side limit
	 * @param {number} max Other side limit
	 *
	 * @return {number} Clamped value
	 */
	
	module.exports = require('./wrap')(function(a, min, max){
		return max > min ? Math.max(Math.min(a,max),min) : Math.max(Math.min(a,min),max);
	});
	},{"./wrap":38}],35:[function(require,module,exports){
	/**
	 * Looping function for any framesize.
	 * Like fmod.
	 *
	 * @module  mumath/loop
	 *
	 */
	
	module.exports = require('./wrap')(function (value, left, right) {
		//detect single-arg case, like mod-loop or fmod
		if (right === undefined) {
			right = left;
			left = 0;
		}
	
		//swap frame order
		if (left > right) {
			var tmp = right;
			right = left;
			left = tmp;
		}
	
		var frame = right - left;
	
		value = ((value + left) % frame) - left;
		if (value < left) value += frame;
		if (value > right) value -= frame;
	
		return value;
	});
	},{"./wrap":38}],36:[function(require,module,exports){
	/**
	 * @module  mumath/precision
	 *
	 * Get precision from float:
	 *
	 * @example
	 * 1.1 → 1, 1234 → 0, .1234 → 4
	 *
	 * @param {number} n
	 *
	 * @return {number} decimap places
	 */
	
	module.exports = require('./wrap')(function(n){
		var s = n + '',
			d = s.indexOf('.') + 1;
	
		return !d ? 0 : s.length - d;
	});
	},{"./wrap":38}],37:[function(require,module,exports){
	/**
	 * Precision round
	 *
	 * @param {number} value
	 * @param {number} step Minimal discrete to round
	 *
	 * @return {number}
	 *
	 * @example
	 * toPrecision(213.34, 1) == 213
	 * toPrecision(213.34, .1) == 213.3
	 * toPrecision(213.34, 10) == 210
	 */
	var precision = require('./precision');
	
	module.exports = require('./wrap')(function(value, step) {
		if (step === 0) return value;
		if (!step) return Math.round(value);
		step = parseFloat(step);
		value = Math.round(value / step) * step;
		return parseFloat(value.toFixed(precision(step)));
	});
	},{"./precision":36,"./wrap":38}],38:[function(require,module,exports){
	/**
	 * Get fn wrapped with array/object attrs recognition
	 *
	 * @return {Function} Target function
	 */
	module.exports = function(fn){
		return function (a) {
			var args = arguments;
			if (a instanceof Array) {
				var result = new Array(a.length), slice;
				for (var i = 0; i < a.length; i++){
					slice = [];
					for (var j = 0, l = args.length, val; j < l; j++){
						val = args[j] instanceof Array ? args[j][i] : args[j];
						val = val;
						slice.push(val);
					}
					result[i] = fn.apply(this, slice);
				}
				return result;
			}
			else if (typeof a === 'object') {
				var result = {}, slice;
				for (var i in a){
					slice = [];
					for (var j = 0, l = args.length, val; j < l; j++){
						val = typeof args[j] === 'object' ? args[j][i] : args[j];
						val = val;
						slice.push(val);
					}
					result[i] = fn.apply(this, slice);
				}
				return result;
			}
			else {
				return fn.apply(this, args);
			}
		};
	};
	},{}],39:[function(require,module,exports){
	//speedy implementation of `in`
	//NOTE: `!target[propName]` 2-3 orders faster than `!(propName in target)`
	module.exports = function(a, b){
		if (!a) return false;
	
		//NOTE: this causes getter fire
		if (a[b]) return true;
	
		//FIXME: why in is better than hasOwnProperty? Something with prototypes. Show a case.
		return b in a;
		// return a.hasOwnProperty(b);
	}
	
	},{}],40:[function(require,module,exports){
	/**
	* Trivial types checkers.
	* Because there’re no common lib for that ( lodash_ is a fatguy)
	*/
	//TODO: make main use as `is.array(target)`
	//TODO: separate by libs, included per-file
	
	module.exports = {
		has: require('./has'),
		isObject: require('./is-object'),
		isFn: require('./is-fn'),
		isString: require('./is-string'),
		isNumber: require('./is-number'),
		isBoolean: require('./is-bool'),
		isPlain: require('./is-plain'),
		isArray: require('./is-array'),
		isArrayLike: require('./is-array-like'),
		isElement: require('./is-element'),
		isPrivateName: require('./is-private-name'),
		isRegExp: require('./is-regex'),
		isEmpty: require('./is-empty')
	};
	
	},{"./has":39,"./is-array":42,"./is-array-like":41,"./is-bool":43,"./is-element":44,"./is-empty":45,"./is-fn":46,"./is-number":47,"./is-object":48,"./is-plain":49,"./is-private-name":50,"./is-regex":51,"./is-string":52}],41:[function(require,module,exports){
	var isString = require('./is-string');
	var isArray = require('./is-array');
	var isFn = require('./is-fn');
	
	//FIXME: add tests from http://jsfiddle.net/ku9LS/1/
	module.exports = function (a){
		return isArray(a) || (a && !isString(a) && !a.nodeType && (typeof window != 'undefined' ? a != window : true) && !isFn(a) && typeof a.length === 'number');
	}
	},{"./is-array":42,"./is-fn":46,"./is-string":52}],42:[function(require,module,exports){
	module.exports = function(a){
		return a instanceof Array;
	}
	},{}],43:[function(require,module,exports){
	module.exports = function(a){
		return typeof a === 'boolean' || a instanceof Boolean;
	}
	},{}],44:[function(require,module,exports){
	module.exports = function(target){
		return typeof document !== 'undefined' && target instanceof HTMLElement;
	};
	},{}],45:[function(require,module,exports){
	module.exports = function(a){
		if (!a) return true;
		for (var k in a) {
			return false;
		}
		return true;
	}
	},{}],46:[function(require,module,exports){
	module.exports = function(a){
		return !!(a && a.apply);
	}
	},{}],47:[function(require,module,exports){
	module.exports = function(a){
		return typeof a === 'number' || a instanceof Number;
	}
	},{}],48:[function(require,module,exports){
	/**
	 * @module mutype/is-object
	 */
	
	//TODO: add st8 tests
	
	//isPlainObject indeed
	module.exports = function(o){
		// return obj === Object(obj);
		return !!o && typeof o === 'object' && o.constructor === Object;
	};
	
	},{}],49:[function(require,module,exports){
	var isString = require('./is-string'),
		isNumber = require('./is-number'),
		isBool = require('./is-bool');
	
	module.exports = function isPlain(a){
		return !a || isString(a) || isNumber(a) || isBool(a);
	};
	},{"./is-bool":43,"./is-number":47,"./is-string":52}],50:[function(require,module,exports){
	module.exports = function(n){
		return n[0] === '_' && n.length > 1;
	}
	
	},{}],51:[function(require,module,exports){
	module.exports = function(target){
		return target instanceof RegExp;
	}
	},{}],52:[function(require,module,exports){
	module.exports = function(a){
		return typeof a === 'string' || a instanceof String;
	}
	},{}],53:[function(require,module,exports){
	/**
	 * @module parenthesis
	 */
	
	var parse = require('./parse');
	var stringify = require('./stringify');
	parse.parse = parse;
	parse.stringify = stringify;
	
	module.exports = parse;
	},{"./parse":54,"./stringify":55}],54:[function(require,module,exports){
	/**
	 * @module  parenthesis/parse
	 *
	 * Parse a string with parenthesis.
	 *
	 * @param {string} str A string with parenthesis
	 *
	 * @return {Array} A list with parsed parens, where 0 is initial string.
	 */
	
	//TODO: implement sequential parser of this algorithm, compare performance.
	module.exports = function(str, bracket){
		//pretend non-string parsed per-se
		if (typeof str !== 'string') return [str];
	
		var res = [], prevStr;
	
		bracket = bracket || '()';
	
		//create parenthesis regex
		var pRE = new RegExp(['\\', bracket[0], '[^\\', bracket[0], '\\', bracket[1], ']*\\', bracket[1]].join(''));
	
		function replaceToken(token, idx, str){
			//save token to res
			var refId = res.push(token.slice(1,-1));
	
			return '\\' + refId;
		}
	
		//replace paren tokens till there’s none
		while (str != prevStr) {
			prevStr = str;
			str = str.replace(pRE, replaceToken);
		}
	
		//save resulting str
		res.unshift(str);
	
		return res;
	};
	},{}],55:[function(require,module,exports){
	/**
	 * @module parenthesis/stringify
	 *
	 * Stringify an array/object with parenthesis references
	 *
	 * @param {Array|Object} arr An array or object where 0 is initial string
	 *                           and every other key/value is reference id/value to replace
	 *
	 * @return {string} A string with inserted regex references
	 */
	
	//FIXME: circular references cause recursions here
	//TODO: there’s possible a recursive version of this algorithm, so test it & compare
	module.exports = function (str, refs, bracket){
		var prevStr;
	
		//pretend bad string stringified with no parentheses
		if (!str) return '';
	
		if (typeof str !== 'string') {
			bracket = refs;
			refs = str;
			str = refs[0];
		}
	
		bracket = bracket || '()';
	
		function replaceRef(token, idx, str){
			return bracket[0] + refs[token.slice(1)] + bracket[1];
		}
	
		while (str != prevStr) {
			prevStr = str;
			str = str.replace(/\\[0-9]+/, replaceRef);
		}
	
		return str;
	};
	},{}],56:[function(require,module,exports){
	/**
	 * @module queried/lib/index
	 */
	
	
	var slice = require('sliced');
	var unique = require('array-unique');
	var getUid = require('get-uid');
	var paren = require('parenthesis');
	var isString = require('mutype/is-string');
	var isArray = require('mutype/is-array');
	var isArrayLike = require('mutype/is-array-like');
	var arrayify = require('arrayify-compact');
	var doc = require('get-doc');
	
	
	/**
	 * Query wrapper - main method to query elements.
	 */
	function queryMultiple(selector, el) {
		//ignore bad selector
		if (!selector) return [];
	
		//return elements passed as a selector unchanged (cover params case)
		if (!isString(selector)) {
			if (isArray(selector)) {
				return unique(arrayify(selector.map(function (sel) {
					return queryMultiple(sel, el);
				})));
			} else {
				return [selector];
			}
		}
	
		//catch polyfillable first `:scope` selector - just erase it, works just fine
		if (pseudos.scope) {
			selector = selector.replace(/^\s*:scope/, '');
		}
	
		//ignore non-queryable containers
		if (!el) {
			el = [querySingle.document];
		}
	
		//treat passed list
		else if (isArrayLike(el)) {
			el = arrayify(el);
		}
	
		//if element isn’t a node - make it q.document
		else if (!el.querySelector) {
			el = [querySingle.document];
		}
	
		//make any ok element a list
		else {
			el = [el];
		}
	
		return qPseudos(el, selector);
	}
	
	
	/** Query single element - no way better than return first of multiple selector */
	function querySingle(selector, el){
		return queryMultiple(selector, el)[0];
	}
	
	
	/**
	 * Return query result based off target list.
	 * Parse and apply polyfilled pseudos
	 */
	function qPseudos(list, selector) {
		//ignore empty selector
		selector = selector.trim();
		if (!selector) return list;
	
		// console.group(selector);
	
		//scopify immediate children selector
		if (selector[0] === '>') {
			if (!pseudos.scope) {
				//scope as the first element in selector scopifies current element just ok
				selector = ':scope' + selector;
			}
			else {
				var id = getUid();
				list.forEach(function(el){el.setAttribute('__scoped', id);});
				selector = '[__scoped="' + id + '"]' + selector;
			}
		}
	
		var pseudo, pseudoFn, pseudoParam, pseudoParamId;
	
		//catch pseudo
		var parts = paren.parse(selector);
		var match = parts[0].match(pseudoRE);
	
		//if pseudo found
		if (match) {
			//grab pseudo details
			pseudo = match[1];
			pseudoParamId = match[2];
	
			if (pseudoParamId) {
				pseudoParam = paren.stringify(parts[pseudoParamId.slice(1)], parts);
			}
	
			//pre-select elements before pseudo
			var preSelector = paren.stringify(parts[0].slice(0, match.index), parts);
	
			//fix for query-relative
			if (!preSelector && !mappers[pseudo]) preSelector = '*';
			if (preSelector) list = qList(list, preSelector);
	
	
			//apply pseudo filter/mapper on the list
			pseudoFn = function(el) {return pseudos[pseudo](el, pseudoParam); };
			if (filters[pseudo]) {
				list = list.filter(pseudoFn);
			}
			else if (mappers[pseudo]) {
				list = unique(arrayify(list.map(pseudoFn)));
			}
	
			//shorten selector
			selector = parts[0].slice(match.index + match[0].length);
	
			// console.groupEnd();
	
			//query once again
			return qPseudos(list, paren.stringify(selector, parts));
		}
	
		//just query list
		else {
			// console.groupEnd();
			return qList(list, selector);
		}
	}
	
	
	/** Apply selector on a list of elements, no polyfilled pseudos */
	function qList(list, selector){
		return unique(arrayify(list.map(function(el){
			return slice(el.querySelectorAll(selector));
		})));
	}
	
	
	/** Registered pseudos */
	var pseudos = {};
	var filters = {};
	var mappers = {};
	
	
	/** Regexp to grab pseudos with params */
	var pseudoRE;
	
	
	/**
	 * Append a new filtering (classic) pseudo
	 *
	 * @param {string} name Pseudo name
	 * @param {Function} filter A filtering function
	 */
	function registerFilter(name, filter, incSelf){
		if (pseudos[name]) return;
	
		//save pseudo filter
		pseudos[name] = filter;
		pseudos[name].includeSelf = incSelf;
		filters[name] = true;
	
		regenerateRegExp();
	}
	
	
	/**
	 * Append a new mapping (relative-like) pseudo
	 *
	 * @param {string} name pseudo name
	 * @param {Function} mapper map function
	 */
	function registerMapper(name, mapper, incSelf){
		if (pseudos[name]) return;
	
		pseudos[name] = mapper;
		pseudos[name].includeSelf = incSelf;
		mappers[name] = true;
	
		regenerateRegExp();
	}
	
	
	/** Update regexp catching pseudos */
	function regenerateRegExp(){
		pseudoRE = new RegExp('::?(' + Object.keys(pseudos).join('|') + ')(\\\\[0-9]+)?');
	}
	
	
	
	/** Exports */
	querySingle.all = queryMultiple;
	querySingle.registerFilter = registerFilter;
	querySingle.registerMapper = registerMapper;
	
	/** Default document representative to use for DOM */
	querySingle.document = doc;
	
	
	module.exports = querySingle;
	},{"array-unique":2,"arrayify-compact":3,"get-doc":10,"get-uid":11,"mutype/is-array":42,"mutype/is-array-like":41,"mutype/is-string":52,"parenthesis":53,"sliced":62}],57:[function(require,module,exports){
	var q = require('..');
	
	function has(el, subSelector){
		return !!q(subSelector, el);
	}
	
	module.exports = has;
	},{"..":56}],58:[function(require,module,exports){
	/** :matches pseudo */
	
	var q = require('..');
	
	function matches(el, selector){
		if (!el.parentNode) {
			var fragment = q.document.createDocumentFragment();
			fragment.appendChild(el);
		}
	
		return q.all(selector, el.parentNode).indexOf(el) > -1;
	}
	
	module.exports = matches;
	},{"..":56}],59:[function(require,module,exports){
	var matches = require('./matches');
	
	function not(el, selector){
		return !matches(el, selector);
	}
	
	module.exports = not;
	},{"./matches":58}],60:[function(require,module,exports){
	var q = require('..');
	
	module.exports = function root(el){
		return el === q.document.documentElement;
	};
	},{"..":56}],61:[function(require,module,exports){
	/**
	 * :scope pseudo
	 * Return element if it has `scoped` attribute.
	 *
	 * @link http://dev.w3.org/csswg/selectors-4/#the-scope-pseudo
	 */
	
	module.exports = function scope(el){
		return el.hasAttribute('scoped');
	};
	},{}],62:[function(require,module,exports){
	module.exports = exports = require('./lib/sliced');
	
	},{"./lib/sliced":63}],63:[function(require,module,exports){
	
	/**
	 * An Array.prototype.slice.call(arguments) alternative
	 *
	 * @param {Object} args something with a length
	 * @param {Number} slice
	 * @param {Number} sliceEnd
	 * @api public
	 */
	
	module.exports = function (args, slice, sliceEnd) {
		var ret = [];
		var len = args.length;
	
		if (0 === len) return ret;
	
		var start = slice < 0
			? Math.max(0, slice + len)
			: slice || 0;
	
		if (sliceEnd !== undefined) {
			len = sliceEnd < 0
				? sliceEnd + len
				: sliceEnd
		}
	
		while (len-- > start) {
			ret[len - start] = args[len];
		}
	
		return ret;
	}
	
	
	},{}],64:[function(require,module,exports){
	arguments[4][63][0].apply(exports,arguments)
	},{"dup":63}],65:[function(require,module,exports){
	var type = require('mutype');
	var extend = require('xtend/mutable');
	
	module.exports = splitKeys;
	
	
	/**
	 * Disentangle listed keys
	 *
	 * @param {Object} obj An object with key including listed declarations
	 * @example {'a,b,c': 1}
	 *
	 * @param {boolean} deep Whether to flatten nested objects
	 *
	 * @todo Think to provide such method on object prototype
	 *
	 * @return {oblect} Source set passed {@link set}
	 */
	function splitKeys(obj, deep, separator){
		//swap args, if needed
		if ((deep || separator) && (type.isBoolean(separator) || type.isString(deep) || type.isRegExp(deep))) {
			var tmp = deep;
			deep = separator;
			separator = tmp;
		}
	
		//ensure separator
		separator = separator === undefined ? splitKeys.separator : separator;
	
		var list, value;
	
		for(var keys in obj){
			value = obj[keys];
	
			if (deep && type.isObject(value)) splitKeys(value, deep, separator);
	
			list = keys.split(separator);
	
			if (list.length > 1){
				delete obj[keys];
				list.forEach(setKey);
			}
		}
	
		function setKey(key){
			//if existing key - extend, if possible
			//FIXME: obj[key] might be not an object, but function, for example
			if (value !== obj[key] && type.isObject(value) && type.isObject(obj[key])) {
				obj[key] = extend({}, obj[key], value);
			}
			//or replace
			else {
				obj[key] = value;
			}
		}
	
		return obj;
	}
	
	
	/** default separator */
	splitKeys.separator = /\s?,\s?/;
	},{"mutype":40,"xtend/mutable":67}],66:[function(require,module,exports){
	/**
	 * @module  st8
	 *
	 * Micro state machine.
	 */
	
	
	var Emitter = require('events');
	var isObject = require('is-plain-object');
	
	
	/** Defaults */
	
	State.options = {
		leaveCallback: 'after',
		enterCallback: 'before',
		changeCallback: 'change',
		remainderState: '_'
	};
	
	
	/**
	 * Create a new state controller based on states passed
	 *
	 * @constructor
	 *
	 * @param {object} settings Initial states
	 */
	
	function State(states, context){
		//ignore existing state
		if (states instanceof State) return states;
	
		//ensure new state instance is created
		if (!(this instanceof State)) return new State(states);
	
		//save states object
		this.states = states || {};
	
		//save context
		this.context = context || this;
	
		//initedFlag
		this.isInit = false;
	}
	
	
	/** Inherit State from Emitter */
	
	var proto = State.prototype = Object.create(Emitter.prototype);
	
	
	/**
	 * Go to a state
	 *
	 * @param {*} value Any new state to enter
	 */
	
	proto.set = function (value) {
		var oldValue = this.state, states = this.states;
		// console.group('set', value, oldValue);
	
		//leave old state
		var oldStateName = states[oldValue] !== undefined ? oldValue : State.options.remainderState;
		var oldState = states[oldStateName];
	
		var leaveResult, leaveFlag = State.options.leaveCallback + oldStateName;
	
		if (this.isInit) {
			if (isObject(oldState)) {
				if (!this[leaveFlag]) {
					this[leaveFlag] = true;
	
					//if oldstate has after method - call it
					leaveResult = getValue(oldState, State.options.leaveCallback, this.context);
	
					//ignore changing if leave result is falsy
					if (leaveResult === false) {
						this[leaveFlag] = false;
						// console.groupEnd();
						return false;
					}
	
					//redirect, if returned anything
					else if (leaveResult !== undefined && leaveResult !== value) {
						this.set(leaveResult);
						this[leaveFlag] = false;
						// console.groupEnd();
						return false;
					}
	
					this[leaveFlag] = false;
	
					//ignore redirect
					if (this.state !== oldValue) {
						return;
					}
				}
	
			}
	
			//ignore not changed value
			if (value === oldValue) return false;
		}
		else {
			this.isInit = true;
		}
	
	
		//set current value
		this.state = value;
	
	
		//try to enter new state
		var newStateName = states[value] !== undefined ? value : State.options.remainderState;
		var newState = states[newStateName];
		var enterFlag = State.options.enterCallback + newStateName;
		var enterResult;
	
		if (!this[enterFlag]) {
			this[enterFlag] = true;
	
			if (isObject(newState)) {
				enterResult = getValue(newState, State.options.enterCallback, this.context);
			} else {
				enterResult = getValue(states, newStateName, this.context);
			}
	
			//ignore entering falsy state
			if (enterResult === false) {
				this.set(oldValue);
				this[enterFlag] = false;
				// console.groupEnd();
				return false;
			}
	
			//redirect if returned anything but current state
			else if (enterResult !== undefined && enterResult !== value) {
				this.set(enterResult);
				this[enterFlag] = false;
				// console.groupEnd();
				return false;
			}
	
			this[enterFlag] = false;
		}
	
	
	
		//notify change
		if (value !== oldValue)	{
			this.emit(State.options.changeCallback, value, oldValue);
		}
	
	
		// console.groupEnd();
	
		//return context to chain calls
		return this.context;
	};
	
	
	/** Get current state */
	
	proto.get = function(){
		return this.state;
	};
	
	
	/** Return value or fn result */
	function getValue(holder, meth, ctx){
		if (typeof holder[meth] === 'function') {
			return holder[meth].call(ctx);
		}
	
		return holder[meth];
	}
	
	
	module.exports = State;
	},{"events":68,"is-plain-object":18}],67:[function(require,module,exports){
	module.exports = extend
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	function extend(target) {
			for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i]
	
					for (var key in source) {
							if (hasOwnProperty.call(source, key)) {
									target[key] = source[key]
							}
					}
			}
	
			return target
	}
	
	},{}],68:[function(require,module,exports){
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var objectCreate = Object.create || objectCreatePolyfill
	var objectKeys = Object.keys || objectKeysPolyfill
	var bind = Function.prototype.bind || functionBindPolyfill
	
	function EventEmitter() {
		if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
			this._events = objectCreate(null);
			this._eventsCount = 0;
		}
	
		this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	var defaultMaxListeners = 10;
	
	var hasDefineProperty;
	try {
		var o = {};
		if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
		hasDefineProperty = o.x === 0;
	} catch (err) { hasDefineProperty = false }
	if (hasDefineProperty) {
		Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
			enumerable: true,
			get: function() {
				return defaultMaxListeners;
			},
			set: function(arg) {
				// check whether the input is a positive number (whose value is zero or
				// greater and not a NaN).
				if (typeof arg !== 'number' || arg < 0 || arg !== arg)
					throw new TypeError('"defaultMaxListeners" must be a positive number');
				defaultMaxListeners = arg;
			}
		});
	} else {
		EventEmitter.defaultMaxListeners = defaultMaxListeners;
	}
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
		if (typeof n !== 'number' || n < 0 || isNaN(n))
			throw new TypeError('"n" argument must be a positive number');
		this._maxListeners = n;
		return this;
	};
	
	function $getMaxListeners(that) {
		if (that._maxListeners === undefined)
			return EventEmitter.defaultMaxListeners;
		return that._maxListeners;
	}
	
	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
		return $getMaxListeners(this);
	};
	
	// These standalone emit* functions are used to optimize calling of event
	// handlers for fast cases because emit() itself often has a variable number of
	// arguments and can be deoptimized because of that. These functions always have
	// the same number of arguments and thus do not get deoptimized, so the code
	// inside them can execute faster.
	function emitNone(handler, isFn, self) {
		if (isFn)
			handler.call(self);
		else {
			var len = handler.length;
			var listeners = arrayClone(handler, len);
			for (var i = 0; i < len; ++i)
				listeners[i].call(self);
		}
	}
	function emitOne(handler, isFn, self, arg1) {
		if (isFn)
			handler.call(self, arg1);
		else {
			var len = handler.length;
			var listeners = arrayClone(handler, len);
			for (var i = 0; i < len; ++i)
				listeners[i].call(self, arg1);
		}
	}
	function emitTwo(handler, isFn, self, arg1, arg2) {
		if (isFn)
			handler.call(self, arg1, arg2);
		else {
			var len = handler.length;
			var listeners = arrayClone(handler, len);
			for (var i = 0; i < len; ++i)
				listeners[i].call(self, arg1, arg2);
		}
	}
	function emitThree(handler, isFn, self, arg1, arg2, arg3) {
		if (isFn)
			handler.call(self, arg1, arg2, arg3);
		else {
			var len = handler.length;
			var listeners = arrayClone(handler, len);
			for (var i = 0; i < len; ++i)
				listeners[i].call(self, arg1, arg2, arg3);
		}
	}
	
	function emitMany(handler, isFn, self, args) {
		if (isFn)
			handler.apply(self, args);
		else {
			var len = handler.length;
			var listeners = arrayClone(handler, len);
			for (var i = 0; i < len; ++i)
				listeners[i].apply(self, args);
		}
	}
	
	EventEmitter.prototype.emit = function emit(type) {
		var er, handler, len, args, i, events;
		var doError = (type === 'error');
	
		events = this._events;
		if (events)
			doError = (doError && events.error == null);
		else if (!doError)
			return false;
	
		// If there is no 'error' event listener then throw.
		if (doError) {
			if (arguments.length > 1)
				er = arguments[1];
			if (er instanceof Error) {
				throw er; // Unhandled 'error' event
			} else {
				// At least give some kind of context to the user
				var err = new Error('Unhandled "error" event. (' + er + ')');
				err.context = er;
				throw err;
			}
			return false;
		}
	
		handler = events[type];
	
		if (!handler)
			return false;
	
		var isFn = typeof handler === 'function';
		len = arguments.length;
		switch (len) {
				// fast cases
			case 1:
				emitNone(handler, isFn, this);
				break;
			case 2:
				emitOne(handler, isFn, this, arguments[1]);
				break;
			case 3:
				emitTwo(handler, isFn, this, arguments[1], arguments[2]);
				break;
			case 4:
				emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
				break;
				// slower
			default:
				args = new Array(len - 1);
				for (i = 1; i < len; i++)
					args[i - 1] = arguments[i];
				emitMany(handler, isFn, this, args);
		}
	
		return true;
	};
	
	function _addListener(target, type, listener, prepend) {
		var m;
		var events;
		var existing;
	
		if (typeof listener !== 'function')
			throw new TypeError('"listener" argument must be a function');
	
		events = target._events;
		if (!events) {
			events = target._events = objectCreate(null);
			target._eventsCount = 0;
		} else {
			// To avoid recursion in the case that type === "newListener"! Before
			// adding it to the listeners, first emit "newListener".
			if (events.newListener) {
				target.emit('newListener', type,
						listener.listener ? listener.listener : listener);
	
				// Re-assign `events` because a newListener handler could have caused the
				// this._events to be assigned to a new object
				events = target._events;
			}
			existing = events[type];
		}
	
		if (!existing) {
			// Optimize the case of one listener. Don't need the extra array object.
			existing = events[type] = listener;
			++target._eventsCount;
		} else {
			if (typeof existing === 'function') {
				// Adding the second element, need to change to array.
				existing = events[type] =
						prepend ? [listener, existing] : [existing, listener];
			} else {
				// If we've already got an array, just append.
				if (prepend) {
					existing.unshift(listener);
				} else {
					existing.push(listener);
				}
			}
	
			// Check for listener leak
			if (!existing.warned) {
				m = $getMaxListeners(target);
				if (m && m > 0 && existing.length > m) {
					existing.warned = true;
					var w = new Error('Possible EventEmitter memory leak detected. ' +
							existing.length + ' "' + String(type) + '" listeners ' +
							'added. Use emitter.setMaxListeners() to ' +
							'increase limit.');
					w.name = 'MaxListenersExceededWarning';
					w.emitter = target;
					w.type = type;
					w.count = existing.length;
					if (typeof console === 'object' && console.warn) {
						console.warn('%s: %s', w.name, w.message);
					}
				}
			}
		}
	
		return target;
	}
	
	EventEmitter.prototype.addListener = function addListener(type, listener) {
		return _addListener(this, type, listener, false);
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.prependListener =
			function prependListener(type, listener) {
				return _addListener(this, type, listener, true);
			};
	
	function onceWrapper() {
		if (!this.fired) {
			this.target.removeListener(this.type, this.wrapFn);
			this.fired = true;
			switch (arguments.length) {
				case 0:
					return this.listener.call(this.target);
				case 1:
					return this.listener.call(this.target, arguments[0]);
				case 2:
					return this.listener.call(this.target, arguments[0], arguments[1]);
				case 3:
					return this.listener.call(this.target, arguments[0], arguments[1],
							arguments[2]);
				default:
					var args = new Array(arguments.length);
					for (var i = 0; i < args.length; ++i)
						args[i] = arguments[i];
					this.listener.apply(this.target, args);
			}
		}
	}
	
	function _onceWrap(target, type, listener) {
		var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
		var wrapped = bind.call(onceWrapper, state);
		wrapped.listener = listener;
		state.wrapFn = wrapped;
		return wrapped;
	}
	
	EventEmitter.prototype.once = function once(type, listener) {
		if (typeof listener !== 'function')
			throw new TypeError('"listener" argument must be a function');
		this.on(type, _onceWrap(this, type, listener));
		return this;
	};
	
	EventEmitter.prototype.prependOnceListener =
			function prependOnceListener(type, listener) {
				if (typeof listener !== 'function')
					throw new TypeError('"listener" argument must be a function');
				this.prependListener(type, _onceWrap(this, type, listener));
				return this;
			};
	
	// Emits a 'removeListener' event if and only if the listener was removed.
	EventEmitter.prototype.removeListener =
			function removeListener(type, listener) {
				var list, events, position, i, originalListener;
	
				if (typeof listener !== 'function')
					throw new TypeError('"listener" argument must be a function');
	
				events = this._events;
				if (!events)
					return this;
	
				list = events[type];
				if (!list)
					return this;
	
				if (list === listener || list.listener === listener) {
					if (--this._eventsCount === 0)
						this._events = objectCreate(null);
					else {
						delete events[type];
						if (events.removeListener)
							this.emit('removeListener', type, list.listener || listener);
					}
				} else if (typeof list !== 'function') {
					position = -1;
	
					for (i = list.length - 1; i >= 0; i--) {
						if (list[i] === listener || list[i].listener === listener) {
							originalListener = list[i].listener;
							position = i;
							break;
						}
					}
	
					if (position < 0)
						return this;
	
					if (position === 0)
						list.shift();
					else
						spliceOne(list, position);
	
					if (list.length === 1)
						events[type] = list[0];
	
					if (events.removeListener)
						this.emit('removeListener', type, originalListener || listener);
				}
	
				return this;
			};
	
	EventEmitter.prototype.removeAllListeners =
			function removeAllListeners(type) {
				var listeners, events, i;
	
				events = this._events;
				if (!events)
					return this;
	
				// not listening for removeListener, no need to emit
				if (!events.removeListener) {
					if (arguments.length === 0) {
						this._events = objectCreate(null);
						this._eventsCount = 0;
					} else if (events[type]) {
						if (--this._eventsCount === 0)
							this._events = objectCreate(null);
						else
							delete events[type];
					}
					return this;
				}
	
				// emit removeListener for all listeners on all events
				if (arguments.length === 0) {
					var keys = objectKeys(events);
					var key;
					for (i = 0; i < keys.length; ++i) {
						key = keys[i];
						if (key === 'removeListener') continue;
						this.removeAllListeners(key);
					}
					this.removeAllListeners('removeListener');
					this._events = objectCreate(null);
					this._eventsCount = 0;
					return this;
				}
	
				listeners = events[type];
	
				if (typeof listeners === 'function') {
					this.removeListener(type, listeners);
				} else if (listeners) {
					// LIFO order
					for (i = listeners.length - 1; i >= 0; i--) {
						this.removeListener(type, listeners[i]);
					}
				}
	
				return this;
			};
	
	EventEmitter.prototype.listeners = function listeners(type) {
		var evlistener;
		var ret;
		var events = this._events;
	
		if (!events)
			ret = [];
		else {
			evlistener = events[type];
			if (!evlistener)
				ret = [];
			else if (typeof evlistener === 'function')
				ret = [evlistener.listener || evlistener];
			else
				ret = unwrapListeners(evlistener);
		}
	
		return ret;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
		if (typeof emitter.listenerCount === 'function') {
			return emitter.listenerCount(type);
		} else {
			return listenerCount.call(emitter, type);
		}
	};
	
	EventEmitter.prototype.listenerCount = listenerCount;
	function listenerCount(type) {
		var events = this._events;
	
		if (events) {
			var evlistener = events[type];
	
			if (typeof evlistener === 'function') {
				return 1;
			} else if (evlistener) {
				return evlistener.length;
			}
		}
	
		return 0;
	}
	
	EventEmitter.prototype.eventNames = function eventNames() {
		return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
	};
	
	// About 1.5x faster than the two-arg version of Array#splice().
	function spliceOne(list, index) {
		for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
			list[i] = list[k];
		list.pop();
	}
	
	function arrayClone(arr, n) {
		var copy = new Array(n);
		for (var i = 0; i < n; ++i)
			copy[i] = arr[i];
		return copy;
	}
	
	function unwrapListeners(arr) {
		var ret = new Array(arr.length);
		for (var i = 0; i < ret.length; ++i) {
			ret[i] = arr[i].listener || arr[i];
		}
		return ret;
	}
	
	function objectCreatePolyfill(proto) {
		var F = function() {};
		F.prototype = proto;
		return new F;
	}
	function objectKeysPolyfill(obj) {
		var keys = [];
		for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
			keys.push(k);
		}
		return k;
	}
	function functionBindPolyfill(context) {
		var fn = this;
		return function () {
			return fn.apply(context, arguments);
		};
	}
	
	},{}],"domify":[function(require,module,exports){
	
	/**
	 * Expose `parse`.
	 */
	
	module.exports = parse;
	
	/**
	 * Tests for browser support.
	 */
	
	var innerHTMLBug = false;
	var bugTestDiv;
	if (typeof document !== 'undefined') {
		bugTestDiv = document.createElement('div');
		// Setup
		bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
		bugTestDiv = undefined;
	}
	
	/**
	 * Wrap map from jquery.
	 */
	
	var map = {
		legend: [1, '<fieldset>', '</fieldset>'],
		tr: [2, '<table><tbody>', '</tbody></table>'],
		col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
		// for script/link/style tags to work in IE6-8, you have to wrap
		// in a div with a non-whitespace character in front, ha!
		_default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
	};
	
	map.td =
	map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
	
	map.option =
	map.optgroup = [1, '<select multiple="multiple">', '</select>'];
	
	map.thead =
	map.tbody =
	map.colgroup =
	map.caption =
	map.tfoot = [1, '<table>', '</table>'];
	
	map.polyline =
	map.ellipse =
	map.polygon =
	map.circle =
	map.text =
	map.line =
	map.path =
	map.rect =
	map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];
	
	/**
	 * Parse `html` and return a DOM Node instance, which could be a TextNode,
	 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
	 * instance, depending on the contents of the `html` string.
	 *
	 * @param {String} html - HTML string to "domify"
	 * @param {Document} doc - The `document` instance to create the Node for
	 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
	 * @api private
	 */
	
	function parse(html, doc) {
		if ('string' != typeof html) throw new TypeError('String expected');
	
		// default to the global `document` object
		if (!doc) doc = document;
	
		// tag name
		var m = /<([\w:]+)/.exec(html);
		if (!m) return doc.createTextNode(html);
	
		html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace
	
		var tag = m[1];
	
		// body support
		if (tag == 'body') {
			var el = doc.createElement('html');
			el.innerHTML = html;
			return el.removeChild(el.lastChild);
		}
	
		// wrap map
		var wrap = map[tag] || map._default;
		var depth = wrap[0];
		var prefix = wrap[1];
		var suffix = wrap[2];
		var el = doc.createElement('div');
		el.innerHTML = prefix + html + suffix;
		while (depth--) el = el.lastChild;
	
		// one element
		if (el.firstChild == el.lastChild) {
			return el.removeChild(el.firstChild);
		}
	
		// several elements
		var fragment = doc.createDocumentFragment();
		while (el.firstChild) {
			fragment.appendChild(el.removeChild(el.firstChild));
		}
	
		return fragment;
	}
	
	},{}],"draggy":[function(require,module,exports){
	/**
	 * Simple draggable component
	 *
	 * @module draggy
	 */
	
	
	//work with css
	const css = require('mucss/css');
	const parseCSSValue = require('mucss/parse-value');
	const selection = require('mucss/selection');
	const offsets = require('mucss/offset');
	const getTranslate = require('mucss/translate');
	const intersect = require('intersects');
	const isFixed = require('mucss/is-fixed');
	
	//events
	const on = require('emmy/on');
	const off = require('emmy/off');
	const emit = require('emmy/emit');
	const Emitter = require('events');
	const getClientX = require('get-client-xy').x;
	const getClientY = require('get-client-xy').y;
	
	//utils
	const isArray = require('mutype/is-array');
	const isNumber = require('mutype/is-number');
	const isString = require('mutype/is-string');
	const isFn = require('mutype/is-fn');
	const defineState = require('define-state');
	const extend = require('xtend/mutable');
	const round = require('mumath/round');
	const between = require('mumath/clamp');
	const loop = require('mumath/mod');
	const getUid = require('get-uid');
	const inherits =  require('inherits');
	
	
	const win = window, doc = document, root = doc.documentElement;
	
	
	/**
	 * Draggable controllers associated with elements.
	 *
	 * Storing them on elements is
	 * - leak-prone,
	 * - pollutes element’s namespace,
	 * - requires some artificial key to store,
	 * - unable to retrieve controller easily.
	 *
	 * That is why weakmap.
	 */
	const draggableCache = Draggable.cache = new WeakMap;
	
	
	
	/**
	 * Make an element draggable.
	 *
	 * @constructor
	 *
	 * @param {HTMLElement} target An element whether in/out of DOM
	 * @param {Object} options An draggable options
	 *
	 * @return {HTMLElement} Target element
	 */
	function Draggable(target, options) {
		if (!(this instanceof Draggable)) {
			return new Draggable(target, options);
		}
	
		var that = this;
	
		//ignore existing instance
		var instance = draggableCache.get(target);
		if (instance) {
			instance.state = 'reset';
	
			//take over options
			extend(instance, options);
	
			instance.update();
	
			return instance;
		}
	
		else {
			//get unique id for instance
			//needed to track event binders
			that.id = getUid();
			that._ns = '.draggy_' + that.id;
	
			//save element passed
			that.element = target;
	
			draggableCache.set(target, that);
		}
	
		//define state behaviour
		defineState(that, 'state', that.state);
	
		//preset handles
		that.currentHandles = [];
	
		//take over options
		extend(that, options);
	
		//define handle
		if (that.handle === undefined) {
			that.handle = that.element;
		}
	
		//setup droppable
		if (that.droppable) {
			that.initDroppable();
		}
	
		//try to calc out basic limits
		that.update();
	
		//go to initial state
		that.state = 'idle';
	}
	
	
	/** Inherit draggable from Emitter */
	inherits(Draggable, Emitter);
	
	
	//enable css3 by default
	Draggable.prototype.css3 = true;
	
	//both axes by default
	Draggable.prototype.axis = null;
	
	
	/** Init droppable "plugin" */
	Draggable.prototype.initDroppable = function () {
		var that = this;
	
		on(that, 'dragstart', function () {
			var that = this;
			that.dropTargets = q(that.droppable);
		});
	
		on(that, 'drag', function () {
			var that = this;
	
			if (!that.dropTargets) {
				return;
			}
	
			var thatRect = offsets(that.element);
	
			that.dropTargets.forEach(function (dropTarget) {
				var targetRect = offsets(dropTarget);
	
				if (intersect(thatRect, targetRect, that.droppableTolerance)) {
					if (that.droppableClass) {
						dropTarget.classList.add(that.droppableClass);
					}
					if (!that.dropTarget) {
						that.dropTarget = dropTarget;
	
						emit(that, 'dragover', dropTarget);
						emit(dropTarget, 'dragover', that);
					}
				}
				else {
					if (that.dropTarget) {
						emit(that, 'dragout', dropTarget);
						emit(dropTarget, 'dragout', that);
	
						that.dropTarget = null;
					}
					if (that.droppableClass) {
						dropTarget.classList.remove(that.droppableClass);
					}
				}
			});
		});
	
		on(that, 'dragend', function () {
			var that = this;
	
			//emit drop, if any
			if (that.dropTarget) {
				emit(that.dropTarget, 'drop', that);
				emit(that, 'drop', that.dropTarget);
				that.dropTarget.classList.remove(that.droppableClass);
				that.dropTarget = null;
			}
		});
	};
	
	
	/**
	 * Draggable behaviour
	 * @enum {string}
	 * @default is 'idle'
	 */
	Draggable.prototype.state = {
		//idle
		_: {
			before: function () {
				var that = this;
	
				that.element.classList.add('draggy-idle');
	
				//emit drag evts on element
				emit(that.element, 'idle', null, true);
				that.emit('idle');
	
				//reset keys
				that.ctrlKey = false;
				that.shiftKey = false;
				that.metaKey = false;
				that.altKey = false;
	
				//reset movement params
				that.movementX = 0;
				that.movementY = 0;
				that.deltaX = 0;
				that.deltaY = 0;
	
				on(doc, 'mousedown' + that._ns + ' touchstart' + that._ns, function (e) {
					//ignore non-draggy events
					if (!e.draggies) {
						return;
					}
	
					//ignore dragstart for not registered draggies
					if (e.draggies.indexOf(that) < 0) {
						return;
					}
	
					//if target is focused - ignore drag
					//FIXME: detect focused by whitelist of tags, name supposition may be wrong (idk, form elements have names, so likely to be focused by click)
					if (e.target.name !== undefined) {
						return;
					}
	
					//multitouch has multiple starts
					that.setTouch(e);
	
					//update movement params
					that.update(e);
	
					//go to threshold state
					that.state = 'threshold';
				});
			},
			after: function () {
				var that = this;
	
				that.element.classList.remove('draggy-idle');
	
				off(doc, that._ns);
	
				//set up tracking
				if (that.release) {
					that._trackingInterval = setInterval(function (e) {
						var now = Date.now();
						var elapsed = now - that.timestamp;
	
						//get delta movement since the last track
						var dX = that.prevX - that.frame[0];
						var dY = that.prevY - that.frame[1];
						that.frame[0] = that.prevX;
						that.frame[1] = that.prevY;
	
						var delta = Math.sqrt(dX * dX + dY * dY);
	
						//get speed as average of prev and current (prevent div by zero)
						var v = Math.min(that.velocity * delta / (1 + elapsed), that.maxSpeed);
						that.speed = 0.8 * v + 0.2 * that.speed;
	
						//get new angle as a last diff
						//NOTE: vector average isn’t the same as speed scalar average
						that.angle = Math.atan2(dY, dX);
	
						that.emit('track');
	
						return that;
					}, that.framerate);
				}
			}
		},
	
		threshold: {
			before: function () {
				var that = this;
	
				//ignore threshold state, if threshold is none
				if (isZeroArray(that.threshold)) {
					that.state = 'drag';
					return;
				}
	
				that.element.classList.add('draggy-threshold');
	
				//emit drag evts on element
				that.emit('threshold');
				emit(that.element, 'threshold');
	
				//listen to doc movement
				on(doc, 'touchmove' + that._ns + ' mousemove' + that._ns, function (e) {
					e.preventDefault();
	
					//compare movement to the threshold
					var clientX = getClientX(e, that.touchIdx);
					var clientY = getClientY(e, that.touchIdx);
					var difX = that.prevMouseX - clientX;
					var difY = that.prevMouseY - clientY;
	
					if (difX < that.threshold[0] || difX > that.threshold[2] || difY < that.threshold[1] || difY > that.threshold[3]) {
						that.update(e);
						that.state = 'drag';
					}
				});
				on(doc, 'mouseup' + that._ns + ' touchend' + that._ns + '', function (e) {
					e.preventDefault();
	
					//forget touches
					that.resetTouch();
	
					that.state = 'idle';
				});
			},
	
			after: function () {
				var that = this;
	
				that.element.classList.remove('draggy-threshold');
	
				off(doc, that._ns);
			}
		},
	
		drag: {
			before: function () {
				var that = this;
	
				//reduce dragging clutter
				selection.disable(root);
	
				that.element.classList.add('draggy-drag');
	
				//emit drag evts on element
				that.emit('dragstart');
				emit(that.element, 'dragstart', null, true);
	
				//emit drag events on that
				that.emit('drag');
				emit(that.element, 'drag', null, true);
	
				//stop drag on leave
				on(doc, 'touchend' + that._ns + ' mouseup' + that._ns + ' mouseleave' + that._ns, function (e) {
					e.preventDefault();
	
					//forget touches - dragend is called once
					that.resetTouch();
	
					//manage release movement
					if (that.speed > 1) {
						that.state = 'release';
					}
	
					else {
						that.state = 'idle';
					}
				});
	
				//move via transform
				on(doc, 'touchmove' + that._ns + ' mousemove' + that._ns, function (e) {
					that.drag(e);
				});
			},
	
			after: function () {
				var that = this;
	
				//enable document interactivity
				selection.enable(root);
	
				that.element.classList.remove('draggy-drag');
	
				//emit dragend on element, this
				that.emit('dragend');
				emit(that.element, 'dragend', null, true);
	
				//unbind drag events
				off(doc, that._ns);
	
				clearInterval(that._trackingInterval);
			}
		},
	
		release: {
			before: function () {
				var that = this;
	
				that.element.classList.add('draggy-release');
	
				//enter animation mode
				clearTimeout(that._animateTimeout);
	
				//set proper transition
				css(that.element, {
					'transition': (that.releaseDuration) + 'ms ease-out ' + (that.css3 ? 'transform' : 'position')
				});
	
				//plan leaving anim mode
				that._animateTimeout = setTimeout(function () {
					that.state = 'idle';
				}, that.releaseDuration);
	
	
				//calc target point & animate to it
				that.move(
					that.prevX + that.speed * Math.cos(that.angle),
					that.prevY + that.speed * Math.sin(that.angle)
				);
	
				that.speed = 0;
				that.emit('track');
			},
	
			after: function () {
				var that = this;
	
				that.element.classList.remove('draggy-release');
	
				css(this.element, {
					'transition': null
				});
			}
		},
	
		reset: function () {
			var that = this;
	
			that.currentHandles.forEach(function (handle) {
				off(handle, that._ns);
			});
	
			clearTimeout(that._animateTimeout);
	
			off(doc, that._ns);
			off(that.element, that._ns);
	
			return '_';
		}
	};
	
	
	/** Drag handler. Needed to provide drag movement emulation via API */
	Draggable.prototype.drag = function (e) {
		var that = this;
	
		e.preventDefault();
	
		var mouseX = getClientX(e, that.touchIdx),
			mouseY = getClientY(e, that.touchIdx);
	
		//calc mouse movement diff
		var diffMouseX = mouseX - that.prevMouseX,
			diffMouseY = mouseY - that.prevMouseY;
	
		//absolute mouse coordinate
		var mouseAbsX = mouseX,
			mouseAbsY = mouseY;
	
		//if we are not fixed, our absolute position is relative to the doc
		if (!that._isFixed) {
			mouseAbsX += win.pageXOffset;
			mouseAbsY += win.pageYOffset;
		}
	
		//calc sniper offset, if any
		if (e.ctrlKey || e.metaKey) {
			that.sniperOffsetX += diffMouseX * that.sniperSlowdown;
			that.sniperOffsetY += diffMouseY * that.sniperSlowdown;
		}
	
		//save refs to the meta keys
		that.ctrlKey = e.ctrlKey;
		that.shiftKey = e.shiftKey;
		that.metaKey = e.metaKey;
		that.altKey = e.altKey;
	
		//calc movement x and y
		//take absolute placing as it is the only reliable way (2x proved)
		var x = (mouseAbsX - that.initOffsetX) - that.innerOffsetX - that.sniperOffsetX,
			y = (mouseAbsY - that.initOffsetY) - that.innerOffsetY - that.sniperOffsetY;
	
		//move element
		that.move(x, y);
	
		//save prevClientXY for calculating diff
		that.prevMouseX = mouseX;
		that.prevMouseY = mouseY;
	
		//emit drag
		that.emit('drag');
		emit(that.element, 'drag', null, true);
	};
	
	
	/** Current number of draggable touches */
	var touches = 0;
	
	
	/** Manage touches */
	Draggable.prototype.setTouch = function (e) {
		if (!e.touches || this.isTouched()) return this;
	
		//current touch index
		this.touchIdx = touches;
		touches++;
	
		return this;
	};
	Draggable.prototype.resetTouch = function () {
		touches = 0;
		this.touchIdx = null;
	
		return this;
	};
	Draggable.prototype.isTouched = function () {
		return this.touchIdx !== null;
	};
	
	
	/** Index to fetch touch number from event */
	Draggable.prototype.touchIdx = null;
	
	
	/**
	 * Update movement limits.
	 * Refresh that.withinOffsets and that.limits.
	 */
	Draggable.prototype.update = function (e) {
		var that = this;
	
		that._isFixed = isFixed(that.element);
	
		//enforce abs position
		if (!that.css3) {
			css(this.element, 'position', 'absolute');
		}
	
		//update handles
		that.currentHandles.forEach(function (handle) {
			off(handle, that._ns);
		});
	
		var cancelEls = q(that.cancel);
	
		that.currentHandles = q(that.handle);
	
		that.currentHandles.forEach(function (handle) {
			on(handle, 'mousedown' + that._ns + ' touchstart' + that._ns, function (e) {
				//mark event as belonging to the draggy
				if (!e.draggies) {
					e.draggies = [];
				}
	
				//ignore draggies containing other draggies
				if (e.draggies.some(function (draggy) {
					return that.element.contains(draggy.element);
				})) {
					return;
				}
				//ignore events happened within cancelEls
				if (cancelEls.some(function (cancelEl) {
					return cancelEl.contains(e.target);
				})) {
					return;
				}
	
				//register draggy
				e.draggies.push(that);
			});
		});
	
		//update limits
		that.updateLimits();
	
		//preset inner offsets
		that.innerOffsetX = that.pin[0];
		that.innerOffsetY = that.pin[1];
	
		var thatClientRect = that.element.getBoundingClientRect();
	
		//if event passed - update acc to event
		if (e) {
			//take last mouse position from the event
			that.prevMouseX = getClientX(e, that.touchIdx);
			that.prevMouseY = getClientY(e, that.touchIdx);
	
			//if mouse is within the element - take offset normally as rel displacement
			that.innerOffsetX = -thatClientRect.left + getClientX(e, that.touchIdx);
			that.innerOffsetY = -thatClientRect.top + getClientY(e, that.touchIdx);
		}
		//if no event - suppose pin-centered event
		else {
			//take mouse position & inner offset as center of pin
			var pinX = (that.pin[0] + that.pin[2] ) * 0.5;
			var pinY = (that.pin[1] + that.pin[3] ) * 0.5;
			that.prevMouseX = thatClientRect.left + pinX;
			that.prevMouseY = thatClientRect.top + pinY;
			that.innerOffsetX = pinX;
			that.innerOffsetY = pinY;
		}
	
		//set initial kinetic props
		that.speed = 0;
		that.amplitude = 0;
		that.angle = 0;
		that.timestamp = +new Date();
		that.frame = [that.prevX, that.prevY];
	
		//set sniper offset
		that.sniperOffsetX = 0;
		that.sniperOffsetY = 0;
	};
	
	/**
	 * Update limits only from current position
	 */
	Draggable.prototype.updateLimits = function () {
		var that = this;
	
		//initial translation offsets
		var initXY = that.getCoords();
	
		//calc initial coords
		that.prevX = initXY[0];
		that.prevY = initXY[1];
		that.initX = initXY[0];
		that.initY = initXY[1];
	
		//container rect might be outside the vp, so calc absolute offsets
		//zero-position offsets, with translation(0,0)
		var thatOffsets = offsets(that.element);
	
		that.initOffsetX = thatOffsets.left - that.prevX;
		that.initOffsetY = thatOffsets.top - that.prevY;
		that.offsets = thatOffsets;
	
		//handle parent case
		var within = that.within;
		if (that.within === 'parent' || that.within === true) {
			within = that.element.parentNode;
		}
		within = within || doc;
	
		//absolute offsets of a container
		var withinOffsets = offsets(within);
	
		if (within === win && that._isFixed) {
			withinOffsets.top -= win.pageYOffset;
			withinOffsets.left -= win.pageXOffset;
			withinOffsets.bottom -= win.pageYOffset;
			withinOffsets.right -= win.pageXOffset;
		}
		that.withinOffsets = withinOffsets;
	
		//calculate movement limits - pin width might be wider than constraints
		that.overflowX = that.pin.width - withinOffsets.width;
		that.overflowY = that.pin.height - withinOffsets.height;
	
		that.limits = {
			left: withinOffsets.left - that.initOffsetX - that.pin[0] - (that.overflowX < 0 ? 0 : that.overflowX),
			top: withinOffsets.top - that.initOffsetY - that.pin[1] - (that.overflowY < 0 ? 0 : that.overflowY),
			right: that.overflowX > 0 ? 0 : withinOffsets.right - that.initOffsetX - that.pin[2],
			bottom: (that.overflowY > 0 ? 0 : withinOffsets.bottom - that.initOffsetY - that.pin[3])
		};
	};
	
	/**
	 * Update info regarding of movement
	 */
	Draggable.prototype.updateInfo = function (x, y) {
		var that = this;
	
		//provide delta from prev state
		that.deltaX = x - that.prevX;
		that.deltaY = y - that.prevY;
	
		//save prev coords to use as a start point next time
		that.prevX = x;
		that.prevY = y;
	
		//provide movement delta from initial state
		that.movementX = x - that.initX;
		that.movementY = y - that.initY;
	
	}
	
	
	/**
	 * Way of placement:
	 * - css3 === false (slower but more precise and cross-browser)
	 * - css3 === true (faster but may cause blurs on linux systems)
	 */
	Draggable.prototype.getCoords = function () {
		if (!this.css3) {
			// return [this.element.offsetLeft, this.element.offsetTop];
			return [parseCSSValue(css(this.element,'left')), parseCSSValue(css(this.element, 'top'))];
		}
		else {
			return getTranslate(this.element).slice(0, 2) || [0,0];
		}
	};
	Draggable.prototype.setCoords = function (x, y) {
		if (this.css3) {
			if (x == null) x = this.prevX;
			if (y == null) y = this.prevY;
	
			x = round(x, this.precision);
			y = round(y, this.precision);
	
			css(this.element, 'transform', ['translate3d(', x, 'px,', y, 'px, 0)'].join(''));
	
			this.updateInfo(x, y);
		}
		else {
			if (x == null) x = this.prevX;
			if (y == null) y = this.prevY;
	
			x = round(x, this.precision);
			y = round(y, this.precision);
	
			css(this.element, {
				left: x,
				top: y
			});
	
			//update movement info
			this.updateInfo(x, y);
		}
	};
	
	
	/**
	 * Restricting container
	 * @type {Element|object}
	 * @default doc.documentElement
	 */
	Draggable.prototype.within = doc;
	
	
	/** Handle to drag */
	Draggable.prototype.handle;
	
	
	Object.defineProperties(Draggable.prototype, {
		/**
		 * Which area of draggable should not be outside the restriction area.
		 * @type {(Array|number)}
		 * @default [0,0,this.element.offsetWidth, this.element.offsetHeight]
		 */
		pin: {
			set: function (value) {
				if (isArray(value)) {
					if (value.length === 2) {
						this._pin = [value[0], value[1], value[0], value[1]];
					} else if (value.length === 4) {
						this._pin = value;
					}
				}
	
				else if (isNumber(value)) {
					this._pin = [value, value, value, value];
				}
	
				else {
					this._pin = value;
				}
	
				//calc pin params
				this._pin.width = this._pin[2] - this._pin[0];
				this._pin.height = this._pin[3] - this._pin[1];
			},
	
			get: function () {
				if (this._pin) return this._pin;
	
				//returning autocalculated pin, if private pin is none
				var pin = [0,0, this.offsets.width, this.offsets.height];
				pin.width = this.offsets.width;
				pin.height = this.offsets.height;
				return pin;
			}
		},
	
		/** Avoid initial mousemove */
		threshold: {
			set: function (val) {
				if (isNumber(val)) {
					this._threshold = [-val*0.5, -val*0.5, val*0.5, val*0.5];
				} else if (val.length === 2) {
					//Array(w,h)
					this._threshold = [-val[0]*0.5, -val[1]*0.5, val[0]*0.5, val[1]*0.5];
				} else if (val.length === 4) {
					//Array(x1,y1,x2,y2)
					this._threshold = val;
				} else if (isFn(val)) {
					//custom val funciton
					this._threshold = val();
				} else {
					this._threshold = [0,0,0,0];
				}
			},
	
			get: function () {
				return this._threshold || [0,0,0,0];
			}
		}
	});
	
	
	
	/**
	 * For how long to release movement
	 *
	 * @type {(number|false)}
	 * @default false
	 * @todo
	 */
	Draggable.prototype.release = false;
	Draggable.prototype.releaseDuration = 500;
	Draggable.prototype.velocity = 1000;
	Draggable.prototype.maxSpeed = 250;
	Draggable.prototype.framerate = 50;
	
	
	/** To what extent round position */
	Draggable.prototype.precision = 1;
	
	
	/** Droppable params */
	Draggable.prototype.droppable = null;
	Draggable.prototype.droppableTolerance = 0.5;
	Draggable.prototype.droppableClass = null;
	
	
	/** Slow down movement by pressing ctrl/cmd */
	Draggable.prototype.sniper = true;
	
	
	/** How much to slow sniper drag */
	Draggable.prototype.sniperSlowdown = .85;
	
	
	/**
	 * Restrict movement by axis
	 *
	 * @default undefined
	 * @enum {string}
	 */
	Draggable.prototype.move = function (x, y) {
		if (this.axis === 'x') {
			if (x == null) x = this.prevX;
			if (y == null) y = this.prevY;
	
			var limits = this.limits;
	
			if (this.repeat) {
				var w = (limits.right - limits.left);
				var oX = - this.initOffsetX + this.withinOffsets.left - this.pin[0] - Math.max(0, this.overflowX);
				x = loop(x - oX, w) + oX;
			} else {
				x = between(x, limits.left, limits.right);
			}
	
			this.setCoords(x);
		}
		else if (this.axis === 'y') {
			if (x == null) x = this.prevX;
			if (y == null) y = this.prevY;
	
			var limits = this.limits;
	
			if (this.repeat) {
				var h = (limits.bottom - limits.top);
				var oY = - this.initOffsetY + this.withinOffsets.top - this.pin[1] - Math.max(0, this.overflowY);
				y = loop(y - oY, h) + oY;
			} else {
				y = between(y, limits.top, limits.bottom);
			}
	
			this.setCoords(null, y);
		}
		else {
			if (x == null) x = this.prevX;
			if (y == null) y = this.prevY;
	
			var limits = this.limits;
	
			if (this.repeat) {
				var w = (limits.right - limits.left);
				var h = (limits.bottom - limits.top);
				var oX = - this.initOffsetX + this.withinOffsets.left - this.pin[0] - Math.max(0, this.overflowX);
				var oY = - this.initOffsetY + this.withinOffsets.top - this.pin[1] - Math.max(0, this.overflowY);
				if (this.repeat === 'x') {
					x = loop(x - oX, w) + oX;
				}
				else if (this.repeat === 'y') {
					y = loop(y - oY, h) + oY;
				}
				else {
					x = loop(x - oX, w) + oX;
					y = loop(y - oY, h) + oY;
				}
			}
	
			x = between(x, limits.left, limits.right);
			y = between(y, limits.top, limits.bottom);
	
			this.setCoords(x, y);
		}
	};
	
	
	/** Repeat movement by one of axises */
	Draggable.prototype.repeat = false;
	
	
	/** Check whether arr is filled with zeros */
	function isZeroArray(arr) {
		if (!arr[0] && !arr[1] && !arr[2] && !arr[3]) return true;
	}
	
	
	
	/** Clean all memory-related things */
	Draggable.prototype.destroy = function () {
		var that = this;
	
		that.currentHandles.forEach(function (handle) {
			off(handle, that._ns);
		});
	
		that.state = 'destroy';
	
		clearTimeout(that._animateTimeout);
	
		off(doc, that._ns);
		off(that.element, that._ns);
	
	
		that.element = null;
		that.within = null;
	};
	
	
	
	//little helpers
	
	function q (str) {
		if (Array.isArray(str)) {
			return str.map(q).reduce(function(prev, curr) { return prev.concat(curr); }, [] );
		}
		else if (str instanceof HTMLElement) {
			return [str];
		}
		else {
			return [].slice.call(document.querySelectorAll(str));
		}
	}
	
	
	module.exports = Draggable;
	},{"define-state":4,"emmy/emit":5,"emmy/off":7,"emmy/on":8,"events":68,"get-client-xy":9,"get-uid":11,"inherits":14,"intersects":15,"mucss/css":21,"mucss/is-fixed":24,"mucss/offset":26,"mucss/parse-value":28,"mucss/selection":32,"mucss/translate":33,"mumath/clamp":34,"mumath/mod":35,"mumath/round":37,"mutype/is-array":42,"mutype/is-fn":46,"mutype/is-number":47,"mutype/is-string":52,"xtend/mutable":67}],"queried":[function(require,module,exports){
	/**
	 * @module  queried
	 */
	
	
	var doc = require('get-doc');
	var q = require('./lib/');
	
	
	/**
	 * Detect unsupported css4 features, polyfill them
	 */
	
	//detect `:scope`
	try {
		doc.querySelector(':scope');
	}
	catch (e) {
		q.registerFilter('scope', require('./lib/pseudos/scope'));
	}
	
	
	//detect `:has`
	try {
		doc.querySelector(':has');
	}
	catch (e) {
		q.registerFilter('has', require('./lib/pseudos/has'));
	
		//polyfilled :has requires artificial :not to make `:not(:has(...))`.
		q.registerFilter('not', require('./lib/pseudos/not'));
	}
	
	
	//detect `:root`
	try {
		doc.querySelector(':root');
	}
	catch (e) {
		q.registerFilter('root', require('./lib/pseudos/root'));
	}
	
	
	//detect `:matches`
	try {
		doc.querySelector(':matches');
	}
	catch (e) {
		q.registerFilter('matches', require('./lib/pseudos/matches'));
	}
	
	
	/** Helper methods */
	q.matches = require('./lib/pseudos/matches');
	
	
	module.exports = q;
	},{"./lib/":56,"./lib/pseudos/has":57,"./lib/pseudos/matches":58,"./lib/pseudos/not":59,"./lib/pseudos/root":60,"./lib/pseudos/scope":61,"get-doc":10}],"resizable":[function(require,module,exports){
	'use strict';
	
	/**
	 * @module  resizable
	 */
	
	var Draggable = require('draggy');
	var emit = require('emmy/emit');
	var on = require('emmy/on');
	var isArray = require('mutype/is-array');
	var isString = require('mutype/is-string');
	var isObject = require('mutype/is-object');
	var extend = require('xtend/mutable');
	var inherit = require('inherits');
	var Emitter = require('events');
	var between = require('mumath/clamp');
	var splitKeys = require('split-keys');
	var css = require('mucss/css');
	var paddings = require('mucss/padding');
	var borders = require('mucss/border');
	var margins = require('mucss/margin');
	var offsets = require('mucss/offset');
	
	var doc = document,
			win = window,
			root = doc.documentElement;
	
	/**
	 * Make an element resizable.
	 *
	 * Note that we don’t need a container option
	 * as arbitrary container is emulatable via fake resizable.
	 *
	 * @constructor
	 */
	function Resizable(el, options) {
		var self = this;
	
		if (!(self instanceof Resizable)) {
			return new Resizable(el, options);
		}
	
		self.element = el;
	
		extend(self, options);
	
		//if element isn’t draggable yet - force it to be draggable, without movements
		if (self.draggable === true) {
			self.draggable = new Draggable(self.element, {
				within: self.within,
				css3: self.css3
			});
		} else if (self.draggable) {
			self.draggable = new Draggable(self.element, self.draggable);
			self.draggable.css3 = self.css3;
		} else {
			self.draggable = new Draggable(self.element, {
				handle: null
			});
		}
	
		self.createHandles();
	
		//bind event, if any
		if (self.resize) {
			self.on('resize', self.resize);
		}
	}
	
	inherit(Resizable, Emitter);
	
	var proto = Resizable.prototype;
	
	/** Use css3 for draggable, if any */
	proto.css3 = true;
	
	/** Make itself draggable to the row */
	proto.draggable = false;
	
	/** Create handles according to options */
	proto.createHandles = function () {
		var self = this;
	
		//init handles
		var handles;
	
		//parse value
		if (isArray(self.handles)) {
			handles = {};
			for (var i = self.handles.length; i--;) {
				handles[self.handles[i]] = null;
			}
		} else if (isString(self.handles)) {
			handles = {};
			var arr = self.handles.match(/([swne]+)/g);
			for (var i = arr.length; i--;) {
				handles[arr[i]] = null;
			}
		} else if (isObject(self.handles)) {
			handles = self.handles;
		}
		//default set of handles depends on position.
		else {
				var position = getComputedStyle(self.element).position;
				var display = getComputedStyle(self.element).display;
				//if display is inline-like - provide only three handles
				//it is position: static or display: inline
				if (/inline/.test(display) || /static/.test(position)) {
					handles = {
						s: null,
						se: null,
						e: null
					};
	
					//ensure position is not static
					css(self.element, 'position', 'relative');
				}
				//else - all handles
				else {
						handles = {
							s: null,
							se: null,
							e: null,
							ne: null,
							n: null,
							nw: null,
							w: null,
							sw: null
						};
					}
			}
	
		//create proper number of handles
		var handle;
		for (var direction in handles) {
			handles[direction] = self.createHandle(handles[direction], direction);
		}
	
		//save handles elements
		self.handles = handles;
	};
	
	/** Create handle for the direction */
	proto.createHandle = function (handle, direction) {
		var self = this;
	
		var el = self.element;
	
		//make handle element
		if (!handle) {
			handle = document.createElement('div');
			handle.classList.add('resizable-handle');
		}
	
		//insert handle to the element
		self.element.appendChild(handle);
	
		//save direction
		handle.direction = direction;
	
		//detect self.within
		//FIXME: may be painful if resizable is created on detached element
		var within = self.within === 'parent' ? self.element.parentNode : self.within;
	
		//make handle draggable
		var draggy = new Draggable(handle, {
			within: within,
			//can’t use abs pos, as we engage it in styling
			// css3: false,
			threshold: self.threshold,
			axis: /^[ns]$/.test(direction) ? 'y' : /^[we]$/.test(direction) ? 'x' : 'both'
		});
	
		draggy.on('dragstart', function (e) {
			self.m = margins(el);
			self.b = borders(el);
			self.p = paddings(el);
	
			//update draggalbe params
			self.draggable.update(e);
	
			//save initial dragging offsets
			var s = getComputedStyle(el);
			self.offsets = self.draggable.getCoords();
	
			//recalc border-box
			if (getComputedStyle(el).boxSizing === 'border-box') {
				self.p.top = 0;
				self.p.bottom = 0;
				self.p.left = 0;
				self.p.right = 0;
				self.b.top = 0;
				self.b.bottom = 0;
				self.b.left = 0;
				self.b.right = 0;
			}
	
			//save initial size
			self.initSize = [el.offsetWidth - self.b.left - self.b.right - self.p.left - self.p.right, el.offsetHeight - self.b.top - self.b.bottom - self.p.top - self.p.bottom];
	
			//save initial full size
			self.initSizeFull = [el.offsetWidth, el.offsetHeight];
	
			//movement prev coords
			self.prevCoords = [0, 0];
	
			//shift-caused offset
			self.shiftOffset = [0, 0];
	
			//central initial coords
			self.center = [self.offsets[0] + self.initSize[0] / 2, self.offsets[1] + self.initSize[1] / 2];
	
			//calc limits (max height/width from left/right)
			if (self.within) {
				var po = offsets(within);
				var o = offsets(el);
				self.maxSize = [o.left - po.left + self.initSize[0], o.top - po.top + self.initSize[1], po.right - o.right + self.initSize[0], po.bottom - o.bottom + self.initSize[1]];
			} else {
				self.maxSize = [9999, 9999, 9999, 9999];
			}
	
			//preset mouse cursor
			css(root, {
				'cursor': direction + '-resize'
			});
	
			//clear cursors
			for (var h in self.handles) {
				css(self.handles[h], 'cursor', null);
			}
		});
	
		draggy.on('drag', function () {
			var coords = draggy.getCoords();
	
			var prevSize = [el.offsetWidth, el.offsetHeight];
	
			//change width/height properly
			if (draggy.shiftKey) {
				switch (direction) {
					case 'se':
					case 's':
					case 'e':
						break;
					case 'nw':
						coords[0] = -coords[0];
						coords[1] = -coords[1];
						break;
					case 'n':
						coords[1] = -coords[1];
						break;
					case 'w':
						coords[0] = -coords[0];
						break;
					case 'ne':
						coords[1] = -coords[1];
						break;
					case 'sw':
						coords[0] = -coords[0];
						break;
				};
	
				//set placement is relative to initial center line
				css(el, {
					width: Math.min(self.initSize[0] + coords[0] * 2, self.maxSize[2] + coords[0], self.maxSize[0] + coords[0]),
					height: Math.min(self.initSize[1] + coords[1] * 2, self.maxSize[3] + coords[1], self.maxSize[1] + coords[1])
				});
	
				var difX = prevSize[0] - el.offsetWidth;
				var difY = prevSize[1] - el.offsetHeight;
	
				//update draggable limits
				self.draggable.updateLimits();
	
				if (difX) {
					self.draggable.move(self.center[0] - self.initSize[0] / 2 - coords[0]);
				}
	
				if (difY) {
					self.draggable.move(null, self.center[1] - self.initSize[1] / 2 - coords[1]);
				}
			} else {
				switch (direction) {
					case 'se':
						css(el, {
							width: Math.min(self.initSize[0] + coords[0], self.maxSize[2]),
							height: Math.min(self.initSize[1] + coords[1], self.maxSize[3])
						});
	
					case 's':
						css(el, {
							height: Math.min(self.initSize[1] + coords[1], self.maxSize[3])
						});
	
					case 'e':
						css(el, {
							width: Math.min(self.initSize[0] + coords[0], self.maxSize[2])
						});
					case 'se':
					case 's':
					case 'e':
						self.draggable.updateLimits();
	
						self.draggable.move(self.center[0] - self.initSize[0] / 2, self.center[1] - self.initSize[1] / 2);
	
						break;
	
					case 'nw':
						css(el, {
							width: between(self.initSize[0] - coords[0], 0, self.maxSize[0]),
							height: between(self.initSize[1] - coords[1], 0, self.maxSize[1])
						});
					case 'n':
						css(el, {
							height: between(self.initSize[1] - coords[1], 0, self.maxSize[1])
						});
					case 'w':
						css(el, {
							width: between(self.initSize[0] - coords[0], 0, self.maxSize[0])
						});
					case 'nw':
					case 'n':
					case 'w':
						self.draggable.updateLimits();
	
						//subtract t/l on changed size
						var deltaX = self.initSizeFull[0] - el.offsetWidth;
						var deltaY = self.initSizeFull[1] - el.offsetHeight;
	
						self.draggable.move(self.offsets[0] + deltaX, self.offsets[1] + deltaY);
						break;
	
					case 'ne':
						css(el, {
							width: between(self.initSize[0] + coords[0], 0, self.maxSize[2]),
							height: between(self.initSize[1] - coords[1], 0, self.maxSize[1])
						});
	
						self.draggable.updateLimits();
	
						//subtract t/l on changed size
						var deltaY = self.initSizeFull[1] - el.offsetHeight;
	
						self.draggable.move(null, self.offsets[1] + deltaY);
						break;
					case 'sw':
						css(el, {
							width: between(self.initSize[0] - coords[0], 0, self.maxSize[0]),
							height: between(self.initSize[1] + coords[1], 0, self.maxSize[3])
						});
	
						self.draggable.updateLimits();
	
						//subtract t/l on changed size
						var deltaX = self.initSizeFull[0] - el.offsetWidth;
	
						self.draggable.move(self.offsets[0] + deltaX);
						break;
				};
			}
	
			//trigger callbacks
			emit(self, 'resize');
			emit(el, 'resize');
	
			draggy.setCoords(0, 0);
		});
	
		draggy.on('dragend', function () {
			//clear cursor & pointer-events
			css(root, {
				'cursor': null
			});
	
			//get back cursors
			for (var h in self.handles) {
				css(self.handles[h], 'cursor', self.handles[h].direction + '-resize');
			}
		});
	
		//append styles
		css(handle, handleStyles[direction]);
		css(handle, 'cursor', direction + '-resize');
	
		//append proper class
		handle.classList.add('resizable-handle-' + direction);
	
		return handle;
	};
	
	/** deconstructor - removes any memory bindings */
	proto.destroy = function () {
		//remove all handles
		for (var hName in this.handles) {
			this.element.removeChild(this.handles[hName]);
			Draggable.cache.get(this.handles[hName]).destroy();
		}
	
		//remove references
		this.element = null;
	};
	
	var w = 10;
	
	/** Threshold size */
	proto.threshold = w;
	
	/** Styles for handles */
	var handleStyles = splitKeys({
		'e,w,n,s,nw,ne,sw,se': {
			'position': 'absolute'
		},
		'e,w': {
			'top, bottom': 0,
			'width': w
		},
		'e': {
			'left': 'auto',
			'right': -w / 2
		},
		'w': {
			'right': 'auto',
			'left': -w / 2
		},
		's': {
			'top': 'auto',
			'bottom': -w / 2
		},
		'n': {
			'bottom': 'auto',
			'top': -w / 2
		},
		'n,s': {
			'left, right': 0,
			'height': w
		},
		'nw,ne,sw,se': {
			'width': w,
			'height': w,
			'z-index': 1
		},
		'nw': {
			'top, left': -w / 2,
			'bottom, right': 'auto'
		},
		'ne': {
			'top, right': -w / 2,
			'bottom, left': 'auto'
		},
		'sw': {
			'bottom, left': -w / 2,
			'top, right': 'auto'
		},
		'se': {
			'bottom, right': -w / 2,
			'top, left': 'auto'
		}
	}, true);
	
	/**
	 * @module resizable
	 */
	module.exports = Resizable;
	
	},{"draggy":"draggy","emmy/emit":5,"emmy/on":8,"events":68,"inherits":14,"mucss/border":20,"mucss/css":21,"mucss/margin":25,"mucss/offset":26,"mucss/padding":27,"mumath/clamp":34,"mutype/is-array":42,"mutype/is-object":48,"mutype/is-string":52,"split-keys":65,"xtend/mutable":67}]},{},[])("resizable")
	});