// {"framework" : "Rax"}
define("index", function(require) {/******/ (function(modules) { // webpackBootstrap
  /******/ 	function hotDisposeChunk(chunkId) {
  /******/ 		delete installedChunks[chunkId];
  /******/ 	}
  /******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
  /******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
  /******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
  /******/ 		hotAddUpdateChunk(chunkId, moreModules);
  /******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
  /******/ 	} ;
  /******/
  /******/ 	// eslint-disable-next-line no-unused-vars
  /******/ 	function hotDownloadUpdateChunk(chunkId) {
  /******/ 		var head = document.getElementsByTagName("head")[0];
  /******/ 		var script = document.createElement("script");
  /******/ 		script.charset = "utf-8";
  /******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
  /******/ 		;
  /******/ 		head.appendChild(script);
  /******/ 	}
  /******/
  /******/ 	// eslint-disable-next-line no-unused-vars
  /******/ 	function hotDownloadManifest(requestTimeout) {
  /******/ 		requestTimeout = requestTimeout || 10000;
  /******/ 		return new Promise(function(resolve, reject) {
  /******/ 			if (typeof XMLHttpRequest === "undefined") {
  /******/ 				return reject(new Error("No browser support"));
  /******/ 			}
  /******/ 			try {
  /******/ 				var request = new XMLHttpRequest();
  /******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
  /******/ 				request.open("GET", requestPath, true);
  /******/ 				request.timeout = requestTimeout;
  /******/ 				request.send(null);
  /******/ 			} catch (err) {
  /******/ 				return reject(err);
  /******/ 			}
  /******/ 			request.onreadystatechange = function() {
  /******/ 				if (request.readyState !== 4) return;
  /******/ 				if (request.status === 0) {
  /******/ 					// timeout
  /******/ 					reject(
  /******/ 						new Error("Manifest request to " + requestPath + " timed out.")
  /******/ 					);
  /******/ 				} else if (request.status === 404) {
  /******/ 					// no update available
  /******/ 					resolve();
  /******/ 				} else if (request.status !== 200 && request.status !== 304) {
  /******/ 					// other failure
  /******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
  /******/ 				} else {
  /******/ 					// success
  /******/ 					try {
  /******/ 						var update = JSON.parse(request.responseText);
  /******/ 					} catch (e) {
  /******/ 						reject(e);
  /******/ 						return;
  /******/ 					}
  /******/ 					resolve(update);
  /******/ 				}
  /******/ 			};
  /******/ 		});
  /******/ 	}
  /******/
  /******/ 	var hotApplyOnUpdate = true;
  /******/ 	var hotCurrentHash = "050217c6668bf807ee12"; // eslint-disable-line no-unused-vars
  /******/ 	var hotRequestTimeout = 10000;
  /******/ 	var hotCurrentModuleData = {};
  /******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
  /******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
  /******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
  /******/
  /******/ 	// eslint-disable-next-line no-unused-vars
  /******/ 	function hotCreateRequire(moduleId) {
  /******/ 		var me = installedModules[moduleId];
  /******/ 		if (!me) return __webpack_require__;
  /******/ 		var fn = function(request) {
  /******/ 			if (me.hot.active) {
  /******/ 				if (installedModules[request]) {
  /******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
  /******/ 						installedModules[request].parents.push(moduleId);
  /******/ 					}
  /******/ 				} else {
  /******/ 					hotCurrentParents = [moduleId];
  /******/ 					hotCurrentChildModule = request;
  /******/ 				}
  /******/ 				if (me.children.indexOf(request) === -1) {
  /******/ 					me.children.push(request);
  /******/ 				}
  /******/ 			} else {
  /******/ 				console.warn(
  /******/ 					"[HMR] unexpected require(" +
  /******/ 						request +
  /******/ 						") from disposed module " +
  /******/ 						moduleId
  /******/ 				);
  /******/ 				hotCurrentParents = [];
  /******/ 			}
  /******/ 			return __webpack_require__(request);
  /******/ 		};
  /******/ 		var ObjectFactory = function ObjectFactory(name) {
  /******/ 			return {
  /******/ 				configurable: true,
  /******/ 				enumerable: true,
  /******/ 				get: function() {
  /******/ 					return __webpack_require__[name];
  /******/ 				},
  /******/ 				set: function(value) {
  /******/ 					__webpack_require__[name] = value;
  /******/ 				}
  /******/ 			};
  /******/ 		};
  /******/ 		for (var name in __webpack_require__) {
  /******/ 			if (
  /******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
  /******/ 				name !== "e" &&
  /******/ 				name !== "t"
  /******/ 			) {
  /******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
  /******/ 			}
  /******/ 		}
  /******/ 		fn.e = function(chunkId) {
  /******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
  /******/ 			hotChunksLoading++;
  /******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
  /******/ 				finishChunkLoading();
  /******/ 				throw err;
  /******/ 			});
  /******/
  /******/ 			function finishChunkLoading() {
  /******/ 				hotChunksLoading--;
  /******/ 				if (hotStatus === "prepare") {
  /******/ 					if (!hotWaitingFilesMap[chunkId]) {
  /******/ 						hotEnsureUpdateChunk(chunkId);
  /******/ 					}
  /******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
  /******/ 						hotUpdateDownloaded();
  /******/ 					}
  /******/ 				}
  /******/ 			}
  /******/ 		};
  /******/ 		fn.t = function(value, mode) {
  /******/ 			if (mode & 1) value = fn(value);
  /******/ 			return __webpack_require__.t(value, mode & ~1);
  /******/ 		};
  /******/ 		return fn;
  /******/ 	}
  /******/
  /******/ 	// eslint-disable-next-line no-unused-vars
  /******/ 	function hotCreateModule(moduleId) {
  /******/ 		var hot = {
  /******/ 			// private stuff
  /******/ 			_acceptedDependencies: {},
  /******/ 			_declinedDependencies: {},
  /******/ 			_selfAccepted: false,
  /******/ 			_selfDeclined: false,
  /******/ 			_disposeHandlers: [],
  /******/ 			_main: hotCurrentChildModule !== moduleId,
  /******/
  /******/ 			// Module API
  /******/ 			active: true,
  /******/ 			accept: function(dep, callback) {
  /******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
  /******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
  /******/ 				else if (typeof dep === "object")
  /******/ 					for (var i = 0; i < dep.length; i++)
  /******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
  /******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
  /******/ 			},
  /******/ 			decline: function(dep) {
  /******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
  /******/ 				else if (typeof dep === "object")
  /******/ 					for (var i = 0; i < dep.length; i++)
  /******/ 						hot._declinedDependencies[dep[i]] = true;
  /******/ 				else hot._declinedDependencies[dep] = true;
  /******/ 			},
  /******/ 			dispose: function(callback) {
  /******/ 				hot._disposeHandlers.push(callback);
  /******/ 			},
  /******/ 			addDisposeHandler: function(callback) {
  /******/ 				hot._disposeHandlers.push(callback);
  /******/ 			},
  /******/ 			removeDisposeHandler: function(callback) {
  /******/ 				var idx = hot._disposeHandlers.indexOf(callback);
  /******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
  /******/ 			},
  /******/
  /******/ 			// Management API
  /******/ 			check: hotCheck,
  /******/ 			apply: hotApply,
  /******/ 			status: function(l) {
  /******/ 				if (!l) return hotStatus;
  /******/ 				hotStatusHandlers.push(l);
  /******/ 			},
  /******/ 			addStatusHandler: function(l) {
  /******/ 				hotStatusHandlers.push(l);
  /******/ 			},
  /******/ 			removeStatusHandler: function(l) {
  /******/ 				var idx = hotStatusHandlers.indexOf(l);
  /******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
  /******/ 			},
  /******/
  /******/ 			//inherit from previous dispose call
  /******/ 			data: hotCurrentModuleData[moduleId]
  /******/ 		};
  /******/ 		hotCurrentChildModule = undefined;
  /******/ 		return hot;
  /******/ 	}
  /******/
  /******/ 	var hotStatusHandlers = [];
  /******/ 	var hotStatus = "idle";
  /******/
  /******/ 	function hotSetStatus(newStatus) {
  /******/ 		hotStatus = newStatus;
  /******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
  /******/ 			hotStatusHandlers[i].call(null, newStatus);
  /******/ 	}
  /******/
  /******/ 	// while downloading
  /******/ 	var hotWaitingFiles = 0;
  /******/ 	var hotChunksLoading = 0;
  /******/ 	var hotWaitingFilesMap = {};
  /******/ 	var hotRequestedFilesMap = {};
  /******/ 	var hotAvailableFilesMap = {};
  /******/ 	var hotDeferred;
  /******/
  /******/ 	// The update info
  /******/ 	var hotUpdate, hotUpdateNewHash;
  /******/
  /******/ 	function toModuleId(id) {
  /******/ 		var isNumber = +id + "" === id;
  /******/ 		return isNumber ? +id : id;
  /******/ 	}
  /******/
  /******/ 	function hotCheck(apply) {
  /******/ 		if (hotStatus !== "idle") {
  /******/ 			throw new Error("check() is only allowed in idle status");
  /******/ 		}
  /******/ 		hotApplyOnUpdate = apply;
  /******/ 		hotSetStatus("check");
  /******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
  /******/ 			if (!update) {
  /******/ 				hotSetStatus("idle");
  /******/ 				return null;
  /******/ 			}
  /******/ 			hotRequestedFilesMap = {};
  /******/ 			hotWaitingFilesMap = {};
  /******/ 			hotAvailableFilesMap = update.c;
  /******/ 			hotUpdateNewHash = update.h;
  /******/
  /******/ 			hotSetStatus("prepare");
  /******/ 			var promise = new Promise(function(resolve, reject) {
  /******/ 				hotDeferred = {
  /******/ 					resolve: resolve,
  /******/ 					reject: reject
  /******/ 				};
  /******/ 			});
  /******/ 			hotUpdate = {};
  /******/ 			var chunkId = "index";
  /******/ 			{
  /******/ 				// eslint-disable-line no-lone-blocks
  /******/ 				/*globals chunkId */
  /******/ 				hotEnsureUpdateChunk(chunkId);
  /******/ 			}
  /******/ 			if (
  /******/ 				hotStatus === "prepare" &&
  /******/ 				hotChunksLoading === 0 &&
  /******/ 				hotWaitingFiles === 0
  /******/ 			) {
  /******/ 				hotUpdateDownloaded();
  /******/ 			}
  /******/ 			return promise;
  /******/ 		});
  /******/ 	}
  /******/
  /******/ 	// eslint-disable-next-line no-unused-vars
  /******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
  /******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
  /******/ 			return;
  /******/ 		hotRequestedFilesMap[chunkId] = false;
  /******/ 		for (var moduleId in moreModules) {
  /******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
  /******/ 				hotUpdate[moduleId] = moreModules[moduleId];
  /******/ 			}
  /******/ 		}
  /******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
  /******/ 			hotUpdateDownloaded();
  /******/ 		}
  /******/ 	}
  /******/
  /******/ 	function hotEnsureUpdateChunk(chunkId) {
  /******/ 		if (!hotAvailableFilesMap[chunkId]) {
  /******/ 			hotWaitingFilesMap[chunkId] = true;
  /******/ 		} else {
  /******/ 			hotRequestedFilesMap[chunkId] = true;
  /******/ 			hotWaitingFiles++;
  /******/ 			hotDownloadUpdateChunk(chunkId);
  /******/ 		}
  /******/ 	}
  /******/
  /******/ 	function hotUpdateDownloaded() {
  /******/ 		hotSetStatus("ready");
  /******/ 		var deferred = hotDeferred;
  /******/ 		hotDeferred = null;
  /******/ 		if (!deferred) return;
  /******/ 		if (hotApplyOnUpdate) {
  /******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
  /******/ 			// avoid triggering uncaught exception warning in Chrome.
  /******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
  /******/ 			Promise.resolve()
  /******/ 				.then(function() {
  /******/ 					return hotApply(hotApplyOnUpdate);
  /******/ 				})
  /******/ 				.then(
  /******/ 					function(result) {
  /******/ 						deferred.resolve(result);
  /******/ 					},
  /******/ 					function(err) {
  /******/ 						deferred.reject(err);
  /******/ 					}
  /******/ 				);
  /******/ 		} else {
  /******/ 			var outdatedModules = [];
  /******/ 			for (var id in hotUpdate) {
  /******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
  /******/ 					outdatedModules.push(toModuleId(id));
  /******/ 				}
  /******/ 			}
  /******/ 			deferred.resolve(outdatedModules);
  /******/ 		}
  /******/ 	}
  /******/
  /******/ 	function hotApply(options) {
  /******/ 		if (hotStatus !== "ready")
  /******/ 			throw new Error("apply() is only allowed in ready status");
  /******/ 		options = options || {};
  /******/
  /******/ 		var cb;
  /******/ 		var i;
  /******/ 		var j;
  /******/ 		var module;
  /******/ 		var moduleId;
  /******/
  /******/ 		function getAffectedStuff(updateModuleId) {
  /******/ 			var outdatedModules = [updateModuleId];
  /******/ 			var outdatedDependencies = {};
  /******/
  /******/ 			var queue = outdatedModules.slice().map(function(id) {
  /******/ 				return {
  /******/ 					chain: [id],
  /******/ 					id: id
  /******/ 				};
  /******/ 			});
  /******/ 			while (queue.length > 0) {
  /******/ 				var queueItem = queue.pop();
  /******/ 				var moduleId = queueItem.id;
  /******/ 				var chain = queueItem.chain;
  /******/ 				module = installedModules[moduleId];
  /******/ 				if (!module || module.hot._selfAccepted) continue;
  /******/ 				if (module.hot._selfDeclined) {
  /******/ 					return {
  /******/ 						type: "self-declined",
  /******/ 						chain: chain,
  /******/ 						moduleId: moduleId
  /******/ 					};
  /******/ 				}
  /******/ 				if (module.hot._main) {
  /******/ 					return {
  /******/ 						type: "unaccepted",
  /******/ 						chain: chain,
  /******/ 						moduleId: moduleId
  /******/ 					};
  /******/ 				}
  /******/ 				for (var i = 0; i < module.parents.length; i++) {
  /******/ 					var parentId = module.parents[i];
  /******/ 					var parent = installedModules[parentId];
  /******/ 					if (!parent) continue;
  /******/ 					if (parent.hot._declinedDependencies[moduleId]) {
  /******/ 						return {
  /******/ 							type: "declined",
  /******/ 							chain: chain.concat([parentId]),
  /******/ 							moduleId: moduleId,
  /******/ 							parentId: parentId
  /******/ 						};
  /******/ 					}
  /******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
  /******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
  /******/ 						if (!outdatedDependencies[parentId])
  /******/ 							outdatedDependencies[parentId] = [];
  /******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
  /******/ 						continue;
  /******/ 					}
  /******/ 					delete outdatedDependencies[parentId];
  /******/ 					outdatedModules.push(parentId);
  /******/ 					queue.push({
  /******/ 						chain: chain.concat([parentId]),
  /******/ 						id: parentId
  /******/ 					});
  /******/ 				}
  /******/ 			}
  /******/
  /******/ 			return {
  /******/ 				type: "accepted",
  /******/ 				moduleId: updateModuleId,
  /******/ 				outdatedModules: outdatedModules,
  /******/ 				outdatedDependencies: outdatedDependencies
  /******/ 			};
  /******/ 		}
  /******/
  /******/ 		function addAllToSet(a, b) {
  /******/ 			for (var i = 0; i < b.length; i++) {
  /******/ 				var item = b[i];
  /******/ 				if (a.indexOf(item) === -1) a.push(item);
  /******/ 			}
  /******/ 		}
  /******/
  /******/ 		// at begin all updates modules are outdated
  /******/ 		// the "outdated" status can propagate to parents if they don't accept the children
  /******/ 		var outdatedDependencies = {};
  /******/ 		var outdatedModules = [];
  /******/ 		var appliedUpdate = {};
  /******/
  /******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
  /******/ 			console.warn(
  /******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
  /******/ 			);
  /******/ 		};
  /******/
  /******/ 		for (var id in hotUpdate) {
  /******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
  /******/ 				moduleId = toModuleId(id);
  /******/ 				/** @type {TODO} */
  /******/ 				var result;
  /******/ 				if (hotUpdate[id]) {
  /******/ 					result = getAffectedStuff(moduleId);
  /******/ 				} else {
  /******/ 					result = {
  /******/ 						type: "disposed",
  /******/ 						moduleId: id
  /******/ 					};
  /******/ 				}
  /******/ 				/** @type {Error|false} */
  /******/ 				var abortError = false;
  /******/ 				var doApply = false;
  /******/ 				var doDispose = false;
  /******/ 				var chainInfo = "";
  /******/ 				if (result.chain) {
  /******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
  /******/ 				}
  /******/ 				switch (result.type) {
  /******/ 					case "self-declined":
  /******/ 						if (options.onDeclined) options.onDeclined(result);
  /******/ 						if (!options.ignoreDeclined)
  /******/ 							abortError = new Error(
  /******/ 								"Aborted because of self decline: " +
  /******/ 									result.moduleId +
  /******/ 									chainInfo
  /******/ 							);
  /******/ 						break;
  /******/ 					case "declined":
  /******/ 						if (options.onDeclined) options.onDeclined(result);
  /******/ 						if (!options.ignoreDeclined)
  /******/ 							abortError = new Error(
  /******/ 								"Aborted because of declined dependency: " +
  /******/ 									result.moduleId +
  /******/ 									" in " +
  /******/ 									result.parentId +
  /******/ 									chainInfo
  /******/ 							);
  /******/ 						break;
  /******/ 					case "unaccepted":
  /******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
  /******/ 						if (!options.ignoreUnaccepted)
  /******/ 							abortError = new Error(
  /******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
  /******/ 							);
  /******/ 						break;
  /******/ 					case "accepted":
  /******/ 						if (options.onAccepted) options.onAccepted(result);
  /******/ 						doApply = true;
  /******/ 						break;
  /******/ 					case "disposed":
  /******/ 						if (options.onDisposed) options.onDisposed(result);
  /******/ 						doDispose = true;
  /******/ 						break;
  /******/ 					default:
  /******/ 						throw new Error("Unexception type " + result.type);
  /******/ 				}
  /******/ 				if (abortError) {
  /******/ 					hotSetStatus("abort");
  /******/ 					return Promise.reject(abortError);
  /******/ 				}
  /******/ 				if (doApply) {
  /******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
  /******/ 					addAllToSet(outdatedModules, result.outdatedModules);
  /******/ 					for (moduleId in result.outdatedDependencies) {
  /******/ 						if (
  /******/ 							Object.prototype.hasOwnProperty.call(
  /******/ 								result.outdatedDependencies,
  /******/ 								moduleId
  /******/ 							)
  /******/ 						) {
  /******/ 							if (!outdatedDependencies[moduleId])
  /******/ 								outdatedDependencies[moduleId] = [];
  /******/ 							addAllToSet(
  /******/ 								outdatedDependencies[moduleId],
  /******/ 								result.outdatedDependencies[moduleId]
  /******/ 							);
  /******/ 						}
  /******/ 					}
  /******/ 				}
  /******/ 				if (doDispose) {
  /******/ 					addAllToSet(outdatedModules, [result.moduleId]);
  /******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
  /******/ 				}
  /******/ 			}
  /******/ 		}
  /******/
  /******/ 		// Store self accepted outdated modules to require them later by the module system
  /******/ 		var outdatedSelfAcceptedModules = [];
  /******/ 		for (i = 0; i < outdatedModules.length; i++) {
  /******/ 			moduleId = outdatedModules[i];
  /******/ 			if (
  /******/ 				installedModules[moduleId] &&
  /******/ 				installedModules[moduleId].hot._selfAccepted
  /******/ 			)
  /******/ 				outdatedSelfAcceptedModules.push({
  /******/ 					module: moduleId,
  /******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
  /******/ 				});
  /******/ 		}
  /******/
  /******/ 		// Now in "dispose" phase
  /******/ 		hotSetStatus("dispose");
  /******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
  /******/ 			if (hotAvailableFilesMap[chunkId] === false) {
  /******/ 				hotDisposeChunk(chunkId);
  /******/ 			}
  /******/ 		});
  /******/
  /******/ 		var idx;
  /******/ 		var queue = outdatedModules.slice();
  /******/ 		while (queue.length > 0) {
  /******/ 			moduleId = queue.pop();
  /******/ 			module = installedModules[moduleId];
  /******/ 			if (!module) continue;
  /******/
  /******/ 			var data = {};
  /******/
  /******/ 			// Call dispose handlers
  /******/ 			var disposeHandlers = module.hot._disposeHandlers;
  /******/ 			for (j = 0; j < disposeHandlers.length; j++) {
  /******/ 				cb = disposeHandlers[j];
  /******/ 				cb(data);
  /******/ 			}
  /******/ 			hotCurrentModuleData[moduleId] = data;
  /******/
  /******/ 			// disable module (this disables requires from this module)
  /******/ 			module.hot.active = false;
  /******/
  /******/ 			// remove module from cache
  /******/ 			delete installedModules[moduleId];
  /******/
  /******/ 			// when disposing there is no need to call dispose handler
  /******/ 			delete outdatedDependencies[moduleId];
  /******/
  /******/ 			// remove "parents" references from all children
  /******/ 			for (j = 0; j < module.children.length; j++) {
  /******/ 				var child = installedModules[module.children[j]];
  /******/ 				if (!child) continue;
  /******/ 				idx = child.parents.indexOf(moduleId);
  /******/ 				if (idx >= 0) {
  /******/ 					child.parents.splice(idx, 1);
  /******/ 				}
  /******/ 			}
  /******/ 		}
  /******/
  /******/ 		// remove outdated dependency from module children
  /******/ 		var dependency;
  /******/ 		var moduleOutdatedDependencies;
  /******/ 		for (moduleId in outdatedDependencies) {
  /******/ 			if (
  /******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
  /******/ 			) {
  /******/ 				module = installedModules[moduleId];
  /******/ 				if (module) {
  /******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
  /******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
  /******/ 						dependency = moduleOutdatedDependencies[j];
  /******/ 						idx = module.children.indexOf(dependency);
  /******/ 						if (idx >= 0) module.children.splice(idx, 1);
  /******/ 					}
  /******/ 				}
  /******/ 			}
  /******/ 		}
  /******/
  /******/ 		// Not in "apply" phase
  /******/ 		hotSetStatus("apply");
  /******/
  /******/ 		hotCurrentHash = hotUpdateNewHash;
  /******/
  /******/ 		// insert new code
  /******/ 		for (moduleId in appliedUpdate) {
  /******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
  /******/ 				modules[moduleId] = appliedUpdate[moduleId];
  /******/ 			}
  /******/ 		}
  /******/
  /******/ 		// call accept handlers
  /******/ 		var error = null;
  /******/ 		for (moduleId in outdatedDependencies) {
  /******/ 			if (
  /******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
  /******/ 			) {
  /******/ 				module = installedModules[moduleId];
  /******/ 				if (module) {
  /******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
  /******/ 					var callbacks = [];
  /******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
  /******/ 						dependency = moduleOutdatedDependencies[i];
  /******/ 						cb = module.hot._acceptedDependencies[dependency];
  /******/ 						if (cb) {
  /******/ 							if (callbacks.indexOf(cb) !== -1) continue;
  /******/ 							callbacks.push(cb);
  /******/ 						}
  /******/ 					}
  /******/ 					for (i = 0; i < callbacks.length; i++) {
  /******/ 						cb = callbacks[i];
  /******/ 						try {
  /******/ 							cb(moduleOutdatedDependencies);
  /******/ 						} catch (err) {
  /******/ 							if (options.onErrored) {
  /******/ 								options.onErrored({
  /******/ 									type: "accept-errored",
  /******/ 									moduleId: moduleId,
  /******/ 									dependencyId: moduleOutdatedDependencies[i],
  /******/ 									error: err
  /******/ 								});
  /******/ 							}
  /******/ 							if (!options.ignoreErrored) {
  /******/ 								if (!error) error = err;
  /******/ 							}
  /******/ 						}
  /******/ 					}
  /******/ 				}
  /******/ 			}
  /******/ 		}
  /******/
  /******/ 		// Load self accepted modules
  /******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
  /******/ 			var item = outdatedSelfAcceptedModules[i];
  /******/ 			moduleId = item.module;
  /******/ 			hotCurrentParents = [moduleId];
  /******/ 			try {
  /******/ 				__webpack_require__(moduleId);
  /******/ 			} catch (err) {
  /******/ 				if (typeof item.errorHandler === "function") {
  /******/ 					try {
  /******/ 						item.errorHandler(err);
  /******/ 					} catch (err2) {
  /******/ 						if (options.onErrored) {
  /******/ 							options.onErrored({
  /******/ 								type: "self-accept-error-handler-errored",
  /******/ 								moduleId: moduleId,
  /******/ 								error: err2,
  /******/ 								originalError: err
  /******/ 							});
  /******/ 						}
  /******/ 						if (!options.ignoreErrored) {
  /******/ 							if (!error) error = err2;
  /******/ 						}
  /******/ 						if (!error) error = err;
  /******/ 					}
  /******/ 				} else {
  /******/ 					if (options.onErrored) {
  /******/ 						options.onErrored({
  /******/ 							type: "self-accept-errored",
  /******/ 							moduleId: moduleId,
  /******/ 							error: err
  /******/ 						});
  /******/ 					}
  /******/ 					if (!options.ignoreErrored) {
  /******/ 						if (!error) error = err;
  /******/ 					}
  /******/ 				}
  /******/ 			}
  /******/ 		}
  /******/
  /******/ 		// handle errors in accept handlers and self accepted module load
  /******/ 		if (error) {
  /******/ 			hotSetStatus("fail");
  /******/ 			return Promise.reject(error);
  /******/ 		}
  /******/
  /******/ 		hotSetStatus("idle");
  /******/ 		return new Promise(function(resolve) {
  /******/ 			resolve(outdatedModules);
  /******/ 		});
  /******/ 	}
  /******/
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {},
  /******/ 			hot: hotCreateModule(moduleId),
  /******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
  /******/ 			children: []
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "/build/";
  /******/
  /******/ 	// __webpack_hash__
  /******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
  /******/ })
  /************************************************************************/
  /******/ ({
  
  /***/ "../../../../.fie/node_modules/_@ali_fie-toolkit-nuke@0.8.5@@ali/fie-toolkit-nuke/lib/hot-dev-utils/formatWebpackMessages.js":
  /*!*****************************************************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_@ali_fie-toolkit-nuke@0.8.5@@ali/fie-toolkit-nuke/lib/hot-dev-utils/formatWebpackMessages.js ***!
    \*****************************************************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  // WARNING: this code is untranspiled and is used in browser too.
  // Please make sure any changes are in ES5 or contribute a Babel compile step.
  
  // Some custom utilities to prettify Webpack output.
  // This is quite hacky and hopefully won't be needed when Webpack fixes this.
  // https://github.com/webpack/webpack/issues/2878
  
  // var chalk = require('chalk');
  
  var friendlySyntaxErrorLabel = 'Syntax error:';
  
  function isLikelyASyntaxError(message) {
    return message.indexOf(friendlySyntaxErrorLabel) !== -1;
  }
  
  // Cleans up webpack error messages.
  // eslint-disable-next-line no-unused-vars
  function formatMessage(message, isError) {
    var lines = message.split('\n');
  
    if (lines.length > 2 && lines[1] === '') {
      // Remove extra newline.
      lines.splice(1, 1);
    }
  
    // Remove webpack-specific loader notation from filename.
    // Before:
    // ./~/css-loader!./~/postcss-loader!./src/App.css
    // After:
    // ./src/App.css
    if (lines[0].lastIndexOf('!') !== -1) {
      lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
    }
  
    lines = lines.filter(function (line) {
      // Webpack adds a list of entry points to warning messages:
      //  @ ./src/index.js
      //  @ multi react-scripts/~/react-dev-utils/webpackHotDevClient.js ...
      // It is misleading (and unrelated to the warnings) so we clean it up.
      // It is only useful for syntax errors but we have beautiful frames for them.
      return line.indexOf(' @ ') !== 0;
    });
  
    // line #0 is filename
    // line #1 is the main error message
    if (!lines[0] || !lines[1]) {
      return lines.join('\n');
    }
  
    // Cleans up verbose "module not found" messages for files and packages.
    if (lines[1].indexOf('Module not found: ') === 0) {
      lines = [lines[0],
      // Clean up message because "Module not found: " is descriptive enough.
      lines[1].replace("Cannot resolve 'file' or 'directory' ", '').replace('Cannot resolve module ', '').replace('Error: ', '').replace('[CaseSensitivePathsPlugin] ', '')];
    }
  
    // Cleans up syntax error messages.
    if (lines[1].indexOf('Module build failed: ') === 0) {
      lines[1] = lines[1].replace('Module build failed: SyntaxError:', friendlySyntaxErrorLabel);
    }
  
    // Clean up export errors.
    // TODO: we should really send a PR to Webpack for this.
    var exportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/;
    if (lines[1].match(exportError)) {
      lines[1] = lines[1].replace(exportError, "$1 '$4' does not contain an export named '$3'.");
    }
  
    // lines[0] = chalk.inverse(lines[0]);
  
    // Reassemble the message.
    message = lines.join('\n');
    // Internal stacks are generally useless so we strip them... with the
    // exception of stacks containing `webpack:` because they're normally
    // from user code generated by WebPack. For more information see
    // https://github.com/facebookincubator/create-react-app/pull/1050
    message = message.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s\)]*(\n|$)/gm, ''); // at ... ...:x:y
  
    return message.trim();
  }
  
  function formatWebpackMessages(json) {
    var formattedErrors = json.errors.map(function (message) {
      return formatMessage(message, true);
    });
    var formattedWarnings = json.warnings.map(function (message) {
      return formatMessage(message, false);
    });
    var result = {
      errors: formattedErrors,
      warnings: formattedWarnings
    };
    if (result.errors.some(isLikelyASyntaxError)) {
      // If there are any syntax errors, show just them.
      // This prevents a confusing ESLint parsing error
      // preceding a much more useful Babel syntax error.
      result.errors = result.errors.filter(isLikelyASyntaxError);
    }
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (result.errors.length > 1) {
      result.errors.length = 1;
    }
    return result;
  }
  
  module.exports = formatWebpackMessages;
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_@ali_fie-toolkit-nuke@0.8.5@@ali/fie-toolkit-nuke/lib/hot-dev-utils/webpackHotDevClient.js":
  /*!***************************************************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_@ali_fie-toolkit-nuke@0.8.5@@ali/fie-toolkit-nuke/lib/hot-dev-utils/webpackHotDevClient.js ***!
    \***************************************************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  // var stripAnsi = require('strip-ansi');
  
  var formatWebpackMessages = __webpack_require__(/*! ./formatWebpackMessages */ "../../../../.fie/node_modules/_@ali_fie-toolkit-nuke@0.8.5@@ali/fie-toolkit-nuke/lib/hot-dev-utils/formatWebpackMessages.js");
  
  var wsUrl = 'ws://' + window.location.hostname + ':' + window.location.port + '/sockjs-node/websocket';
  // Connect to WebpackDevServer via a socket.
  console.log('The development server at', wsUrl);
  var connection = new WebSocket(wsUrl);
  
  // Unlike WebpackDevServer client, we won't try to reconnect
  // to avoid spamming the console. Disconnect usually happens
  // when developer stops the server.
  connection.onclose = function () {
    console.info('The development server has disconnected.\nRefresh the page if necessary.');
  };
  
  connection.onopen = function () {
    console.info('The development server has connected!');
  };
  
  connection.onerror = function (err) {
    console.info('The development server connect faild!');
  };
  
  // Remember some state related to hot module replacement.
  var isFirstCompilation = true;
  var mostRecentCompilationHash = null;
  var hasCompileErrors = false;
  
  function clearOutdatedErrors() {
    // Clean up outdated compile errors, if any.
    if (hasCompileErrors && typeof console.clear === 'function') {
      console.clear();
    }
  }
  
  // Successful compilation.
  function handleSuccess() {
    clearOutdatedErrors();
  
    var isHotUpdate = !isFirstCompilation;
    isFirstCompilation = false;
    hasCompileErrors = false;
  
    // Attempt to apply hot updates or reload.
    if (isHotUpdate) {
      tryApplyUpdates(function onHotUpdateSuccess() {
        // Only destroy it when we're sure it's a hot update.
        // Otherwise it would flicker right before the reload.
      });
    }
  }
  
  // Compilation with warnings (e.g. ESLint).
  function handleWarnings(warnings) {
    clearOutdatedErrors();
  
    var isHotUpdate = !isFirstCompilation;
    isFirstCompilation = false;
    hasCompileErrors = false;
  
    function printWarnings() {
      // Print warnings to the console.
      var formatted = formatWebpackMessages({
        warnings: warnings,
        errors: []
      });
  
      for (var i = 0; i < formatted.warnings.length; i++) {
        console.warn(formatted.warnings[i]);
        // console.warn(stripAnsi(formatted.warnings[i]));
      }
    }
  
    // Attempt to apply hot updates or reload.
    if (isHotUpdate) {
      tryApplyUpdates(function onSuccessfulHotUpdate() {
        // Only print warnings if we aren't refreshing the page.
        // Otherwise they'll disappear right away anyway.
        printWarnings();
        // Only destroy it when we're sure it's a hot update.
        // Otherwise it would flicker right before the reload.
      });
    } else {
      // Print initial warnings immediately.
      printWarnings();
    }
  }
  
  // Compilation with errors (e.g. syntax error or missing modules).
  function handleErrors(errors) {
    clearOutdatedErrors();
  
    isFirstCompilation = false;
    hasCompileErrors = true;
  
    // "Massage" webpack messages.
    var formatted = formatWebpackMessages({
      errors: errors,
      warnings: []
    });
  
    // Also log them to the console.
    for (var i = 0; i < formatted.errors.length; i++) {
      console.error(formatted.errors[i]);
      // console.error(stripAnsi(formatted.errors[i]));
    }
  
    // Do not attempt to reload now.
    // We will reload on next success instead.
  }
  
  // There is a newer version of the code available.
  function handleAvailableHash(hash) {
    // Update last known compilation hash.
    mostRecentCompilationHash = hash;
  }
  
  // Handle messages from the server.
  connection.onmessage = function (e) {
    var message = JSON.parse(e.data);
    switch (message.type) {
      case 'hash':
        handleAvailableHash(message.data);
        break;
      case 'still-ok':
      case 'ok':
        handleSuccess();
        break;
      case 'content-changed':
        // Triggered when a file from `contentBase` changed.
        window.location.reload();
        break;
      case 'warnings':
        handleWarnings(message.data);
        break;
      case 'errors':
        handleErrors(message.data);
        break;
      default:
      // Do nothing.
    }
  };
  
  // Is there a newer version of this code available?
  function isUpdateAvailable() {
    /* globals __webpack_hash__ */
    // __webpack_hash__ is the hash of the current compilation.
    // It's a global variable injected by Webpack.
    return mostRecentCompilationHash !== __webpack_require__.h();
  }
  
  // Webpack disallows updates in other states.
  function canApplyUpdates() {
    return module.hot.status() === 'idle';
  }
  
  // Attempt to update code on the fly, fall back to a hard reload.
  function tryApplyUpdates(onHotUpdateSuccess) {
    if (false) {}
  
    if (!isUpdateAvailable() || !canApplyUpdates()) {
      return;
    }
  
    function handleApplyUpdates(err, updatedModules) {
      console.log('handleApplyUpdates', err, updatedModules);
      if (err || !updatedModules) {
        window.location.reload();
        return;
      }
  
      if (typeof onHotUpdateSuccess === 'function') {
        // Maybe we want to do something.
        onHotUpdateSuccess();
      }
  
      if (isUpdateAvailable()) {
        // While we were updating, there was a new update! Do it again.
        tryApplyUpdates();
      }
    }
  
    // https://webpack.github.io/docs/hot-module-replacement.html#check
    var result = module.hot.check( /* autoApply */true, handleApplyUpdates);
  
    // // Webpack 2 returns a Promise instead of invoking a callback
    if (result && result.then) {
      result.then(function (updatedModules) {
        handleApplyUpdates(null, updatedModules);
      }, function (err) {
        handleApplyUpdates(err, null);
      });
    }
  }
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_global@4.3.2@global/window.js":
  /*!**************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_global@4.3.2@global/window.js ***!
    \**************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  /* WEBPACK VAR INJECTION */(function(global) {var win;
  
  if (typeof window !== "undefined") {
      win = window;
  } else if (typeof global !== "undefined") {
      win = global;
  } else if (typeof self !== "undefined"){
      win = self;
  } else {
      win = {};
  }
  
  module.exports = win;
  
  /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../_webpack@4.12.0@webpack/buildin/global.js */ "../../../../.fie/node_modules/_webpack@4.12.0@webpack/buildin/global.js")))
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_DataView.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_DataView.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getNative = __webpack_require__(/*! ./_getNative */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js"),
      root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js");
  
  /* Built-in method references that are verified to be native. */
  var DataView = getNative(root, 'DataView');
  
  module.exports = DataView;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Hash.js":
  /*!***************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_Hash.js ***!
    \***************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var hashClear = __webpack_require__(/*! ./_hashClear */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashClear.js"),
      hashDelete = __webpack_require__(/*! ./_hashDelete */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashDelete.js"),
      hashGet = __webpack_require__(/*! ./_hashGet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashGet.js"),
      hashHas = __webpack_require__(/*! ./_hashHas */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashHas.js"),
      hashSet = __webpack_require__(/*! ./_hashSet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashSet.js");
  
  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
  
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  
  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  
  module.exports = Hash;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_ListCache.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_ListCache.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheClear.js"),
      listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheDelete.js"),
      listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheGet.js"),
      listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheHas.js"),
      listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheSet.js");
  
  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
  
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  
  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  
  module.exports = ListCache;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Map.js":
  /*!**************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_Map.js ***!
    \**************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getNative = __webpack_require__(/*! ./_getNative */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js"),
      root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js");
  
  /* Built-in method references that are verified to be native. */
  var Map = getNative(root, 'Map');
  
  module.exports = Map;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_MapCache.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_MapCache.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheClear.js"),
      mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheDelete.js"),
      mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheGet.js"),
      mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheHas.js"),
      mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheSet.js");
  
  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
  
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  
  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  
  module.exports = MapCache;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Promise.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_Promise.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getNative = __webpack_require__(/*! ./_getNative */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js"),
      root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js");
  
  /* Built-in method references that are verified to be native. */
  var Promise = getNative(root, 'Promise');
  
  module.exports = Promise;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Set.js":
  /*!**************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_Set.js ***!
    \**************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getNative = __webpack_require__(/*! ./_getNative */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js"),
      root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js");
  
  /* Built-in method references that are verified to be native. */
  var Set = getNative(root, 'Set');
  
  module.exports = Set;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_SetCache.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_SetCache.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var MapCache = __webpack_require__(/*! ./_MapCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_MapCache.js"),
      setCacheAdd = __webpack_require__(/*! ./_setCacheAdd */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_setCacheAdd.js"),
      setCacheHas = __webpack_require__(/*! ./_setCacheHas */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_setCacheHas.js");
  
  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;
  
    this.__data__ = new MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  }
  
  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  
  module.exports = SetCache;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Stack.js":
  /*!****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_Stack.js ***!
    \****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var ListCache = __webpack_require__(/*! ./_ListCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_ListCache.js"),
      stackClear = __webpack_require__(/*! ./_stackClear */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackClear.js"),
      stackDelete = __webpack_require__(/*! ./_stackDelete */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackDelete.js"),
      stackGet = __webpack_require__(/*! ./_stackGet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackGet.js"),
      stackHas = __webpack_require__(/*! ./_stackHas */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackHas.js"),
      stackSet = __webpack_require__(/*! ./_stackSet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackSet.js");
  
  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  
  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  
  module.exports = Stack;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Symbol.js":
  /*!*****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_Symbol.js ***!
    \*****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js");
  
  /** Built-in value references. */
  var Symbol = root.Symbol;
  
  module.exports = Symbol;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Uint8Array.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_Uint8Array.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js");
  
  /** Built-in value references. */
  var Uint8Array = root.Uint8Array;
  
  module.exports = Uint8Array;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_WeakMap.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_WeakMap.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getNative = __webpack_require__(/*! ./_getNative */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js"),
      root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js");
  
  /* Built-in method references that are verified to be native. */
  var WeakMap = getNative(root, 'WeakMap');
  
  module.exports = WeakMap;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_apply.js":
  /*!****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_apply.js ***!
    \****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  
  module.exports = apply;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayFilter.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_arrayFilter.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];
  
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  
  module.exports = arrayFilter;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayIncludes.js":
  /*!************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_arrayIncludes.js ***!
    \************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIndexOf.js");
  
  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }
  
  module.exports = arrayIncludes;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayIncludesWith.js":
  /*!****************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_arrayIncludesWith.js ***!
    \****************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;
  
    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }
  
  module.exports = arrayIncludesWith;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayLikeKeys.js":
  /*!************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_arrayLikeKeys.js ***!
    \************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseTimes = __webpack_require__(/*! ./_baseTimes */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseTimes.js"),
      isArguments = __webpack_require__(/*! ./isArguments */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArguments.js"),
      isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js"),
      isBuffer = __webpack_require__(/*! ./isBuffer */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isBuffer.js"),
      isIndex = __webpack_require__(/*! ./_isIndex */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isIndex.js"),
      isTypedArray = __webpack_require__(/*! ./isTypedArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isTypedArray.js");
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;
  
    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }
  
  module.exports = arrayLikeKeys;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayMap.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_arrayMap.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);
  
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  
  module.exports = arrayMap;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayPush.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_arrayPush.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;
  
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  
  module.exports = arrayPush;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arraySome.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_arraySome.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;
  
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  
  module.exports = arraySome;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_assignValue.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_assignValue.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseAssignValue.js"),
      eq = __webpack_require__(/*! ./eq */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/eq.js");
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }
  
  module.exports = assignValue;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_assocIndexOf.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_assocIndexOf.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var eq = __webpack_require__(/*! ./eq */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/eq.js");
  
  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  
  module.exports = assocIndexOf;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseAssignValue.js":
  /*!**************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseAssignValue.js ***!
    \**************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var defineProperty = __webpack_require__(/*! ./_defineProperty */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_defineProperty.js");
  
  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty) {
      defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }
  
  module.exports = baseAssignValue;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseDifference.js":
  /*!*************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseDifference.js ***!
    \*************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var SetCache = __webpack_require__(/*! ./_SetCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_SetCache.js"),
      arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayIncludes.js"),
      arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayIncludesWith.js"),
      arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayMap.js"),
      baseUnary = __webpack_require__(/*! ./_baseUnary */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseUnary.js"),
      cacheHas = __webpack_require__(/*! ./_cacheHas */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_cacheHas.js");
  
  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;
  
  /**
   * The base implementation of methods like `_.difference` without support
   * for excluding multiple arrays or iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Array} values The values to exclude.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of filtered values.
   */
  function baseDifference(array, values, iteratee, comparator) {
    var index = -1,
        includes = arrayIncludes,
        isCommon = true,
        length = array.length,
        result = [],
        valuesLength = values.length;
  
    if (!length) {
      return result;
    }
    if (iteratee) {
      values = arrayMap(values, baseUnary(iteratee));
    }
    if (comparator) {
      includes = arrayIncludesWith;
      isCommon = false;
    }
    else if (values.length >= LARGE_ARRAY_SIZE) {
      includes = cacheHas;
      isCommon = false;
      values = new SetCache(values);
    }
    outer:
    while (++index < length) {
      var value = array[index],
          computed = iteratee == null ? value : iteratee(value);
  
      value = (comparator || value !== 0) ? value : 0;
      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      }
      else if (!includes(values, computed, comparator)) {
        result.push(value);
      }
    }
    return result;
  }
  
  module.exports = baseDifference;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseFindIndex.js":
  /*!************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseFindIndex.js ***!
    \************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);
  
    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }
  
  module.exports = baseFindIndex;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseFlatten.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseFlatten.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var arrayPush = __webpack_require__(/*! ./_arrayPush */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayPush.js"),
      isFlattenable = __webpack_require__(/*! ./_isFlattenable */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isFlattenable.js");
  
  /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;
  
    predicate || (predicate = isFlattenable);
    result || (result = []);
  
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }
  
  module.exports = baseFlatten;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGet.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseGet.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var castPath = __webpack_require__(/*! ./_castPath */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_castPath.js"),
      toKey = __webpack_require__(/*! ./_toKey */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_toKey.js");
  
  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = castPath(path, object);
  
    var index = 0,
        length = path.length;
  
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }
  
  module.exports = baseGet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGetAllKeys.js":
  /*!*************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseGetAllKeys.js ***!
    \*************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var arrayPush = __webpack_require__(/*! ./_arrayPush */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayPush.js"),
      isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js");
  
  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  
  module.exports = baseGetAllKeys;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGetTag.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseGetTag.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var Symbol = __webpack_require__(/*! ./_Symbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Symbol.js"),
      getRawTag = __webpack_require__(/*! ./_getRawTag */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getRawTag.js"),
      objectToString = __webpack_require__(/*! ./_objectToString */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_objectToString.js");
  
  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';
  
  /** Built-in value references. */
  var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
  
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }
  
  module.exports = baseGetTag;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseHasIn.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseHasIn.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  
  module.exports = baseHasIn;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIndexOf.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIndexOf.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseFindIndex.js"),
      baseIsNaN = __webpack_require__(/*! ./_baseIsNaN */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsNaN.js"),
      strictIndexOf = __webpack_require__(/*! ./_strictIndexOf */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_strictIndexOf.js");
  
  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }
  
  module.exports = baseIndexOf;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsArguments.js":
  /*!**************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIsArguments.js ***!
    \**************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGetTag.js"),
      isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObjectLike.js");
  
  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';
  
  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }
  
  module.exports = baseIsArguments;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsEqual.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIsEqual.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseIsEqualDeep = __webpack_require__(/*! ./_baseIsEqualDeep */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsEqualDeep.js"),
      isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObjectLike.js");
  
  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  
  module.exports = baseIsEqual;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsEqualDeep.js":
  /*!**************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIsEqualDeep.js ***!
    \**************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var Stack = __webpack_require__(/*! ./_Stack */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Stack.js"),
      equalArrays = __webpack_require__(/*! ./_equalArrays */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_equalArrays.js"),
      equalByTag = __webpack_require__(/*! ./_equalByTag */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_equalByTag.js"),
      equalObjects = __webpack_require__(/*! ./_equalObjects */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_equalObjects.js"),
      getTag = __webpack_require__(/*! ./_getTag */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getTag.js"),
      isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js"),
      isBuffer = __webpack_require__(/*! ./isBuffer */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isBuffer.js"),
      isTypedArray = __webpack_require__(/*! ./isTypedArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isTypedArray.js");
  
  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1;
  
  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      objectTag = '[object Object]';
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = objIsArr ? arrayTag : getTag(object),
        othTag = othIsArr ? arrayTag : getTag(other);
  
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
  
    var objIsObj = objTag == objectTag,
        othIsObj = othTag == objectTag,
        isSameTag = objTag == othTag;
  
    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack);
      return (objIsArr || isTypedArray(object))
        ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
        : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
  
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;
  
        stack || (stack = new Stack);
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack);
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  
  module.exports = baseIsEqualDeep;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsMatch.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIsMatch.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var Stack = __webpack_require__(/*! ./_Stack */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Stack.js"),
      baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsEqual.js");
  
  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;
  
  /**
   * The base implementation of `_.isMatch` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Array} matchData The property names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length,
        length = index,
        noCustomizer = !customizer;
  
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if ((noCustomizer && data[2])
            ? data[1] !== object[data[0]]
            : !(data[0] in object)
          ) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
          objValue = object[key],
          srcValue = data[1];
  
      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack;
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === undefined
              ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
              : result
            )) {
          return false;
        }
      }
    }
    return true;
  }
  
  module.exports = baseIsMatch;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsNaN.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIsNaN.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }
  
  module.exports = baseIsNaN;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsNative.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIsNative.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isFunction = __webpack_require__(/*! ./isFunction */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isFunction.js"),
      isMasked = __webpack_require__(/*! ./_isMasked */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isMasked.js"),
      isObject = __webpack_require__(/*! ./isObject */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObject.js"),
      toSource = __webpack_require__(/*! ./_toSource */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_toSource.js");
  
  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  
  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  
  /** Used for built-in method references. */
  var funcProto = Function.prototype,
      objectProto = Object.prototype;
  
  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );
  
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  
  module.exports = baseIsNative;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsTypedArray.js":
  /*!***************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIsTypedArray.js ***!
    \***************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGetTag.js"),
      isLength = __webpack_require__(/*! ./isLength */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isLength.js"),
      isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObjectLike.js");
  
  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';
  
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';
  
  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;
  
  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike(value) &&
      isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  
  module.exports = baseIsTypedArray;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIteratee.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseIteratee.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseMatches = __webpack_require__(/*! ./_baseMatches */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseMatches.js"),
      baseMatchesProperty = __webpack_require__(/*! ./_baseMatchesProperty */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseMatchesProperty.js"),
      identity = __webpack_require__(/*! ./identity */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/identity.js"),
      isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js"),
      property = __webpack_require__(/*! ./property */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/property.js");
  
  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == 'object') {
      return isArray(value)
        ? baseMatchesProperty(value[0], value[1])
        : baseMatches(value);
    }
    return property(value);
  }
  
  module.exports = baseIteratee;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseKeys.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseKeys.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isPrototype = __webpack_require__(/*! ./_isPrototype */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isPrototype.js"),
      nativeKeys = __webpack_require__(/*! ./_nativeKeys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nativeKeys.js");
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }
  
  module.exports = baseKeys;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseMatches.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseMatches.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseIsMatch = __webpack_require__(/*! ./_baseIsMatch */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsMatch.js"),
      getMatchData = __webpack_require__(/*! ./_getMatchData */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getMatchData.js"),
      matchesStrictComparable = __webpack_require__(/*! ./_matchesStrictComparable */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_matchesStrictComparable.js");
  
  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  
  module.exports = baseMatches;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseMatchesProperty.js":
  /*!******************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseMatchesProperty.js ***!
    \******************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsEqual.js"),
      get = __webpack_require__(/*! ./get */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/get.js"),
      hasIn = __webpack_require__(/*! ./hasIn */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/hasIn.js"),
      isKey = __webpack_require__(/*! ./_isKey */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isKey.js"),
      isStrictComparable = __webpack_require__(/*! ./_isStrictComparable */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isStrictComparable.js"),
      matchesStrictComparable = __webpack_require__(/*! ./_matchesStrictComparable */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_matchesStrictComparable.js"),
      toKey = __webpack_require__(/*! ./_toKey */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_toKey.js");
  
  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;
  
  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return (objValue === undefined && objValue === srcValue)
        ? hasIn(object, path)
        : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  
  module.exports = baseMatchesProperty;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseProperty.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseProperty.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }
  
  module.exports = baseProperty;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_basePropertyDeep.js":
  /*!***************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_basePropertyDeep.js ***!
    \***************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseGet = __webpack_require__(/*! ./_baseGet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGet.js");
  
  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  
  module.exports = basePropertyDeep;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseRest.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseRest.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var identity = __webpack_require__(/*! ./identity */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/identity.js"),
      overRest = __webpack_require__(/*! ./_overRest */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_overRest.js"),
      setToString = __webpack_require__(/*! ./_setToString */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_setToString.js");
  
  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }
  
  module.exports = baseRest;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseSetToString.js":
  /*!**************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseSetToString.js ***!
    \**************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var constant = __webpack_require__(/*! ./constant */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/constant.js"),
      defineProperty = __webpack_require__(/*! ./_defineProperty */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_defineProperty.js"),
      identity = __webpack_require__(/*! ./identity */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/identity.js");
  
  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };
  
  module.exports = baseSetToString;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseTimes.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseTimes.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);
  
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  
  module.exports = baseTimes;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseToString.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseToString.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var Symbol = __webpack_require__(/*! ./_Symbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Symbol.js"),
      arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayMap.js"),
      isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js"),
      isSymbol = __webpack_require__(/*! ./isSymbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isSymbol.js");
  
  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;
  
  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;
  
  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }
  
  module.exports = baseToString;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseUnary.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_baseUnary.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  
  module.exports = baseUnary;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_cacheHas.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_cacheHas.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  
  module.exports = cacheHas;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_castPath.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_castPath.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js"),
      isKey = __webpack_require__(/*! ./_isKey */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isKey.js"),
      stringToPath = __webpack_require__(/*! ./_stringToPath */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stringToPath.js"),
      toString = __webpack_require__(/*! ./toString */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/toString.js");
  
  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }
  
  module.exports = castPath;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_copyObject.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_copyObject.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var assignValue = __webpack_require__(/*! ./_assignValue */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_assignValue.js"),
      baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseAssignValue.js");
  
  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
  
    var index = -1,
        length = props.length;
  
    while (++index < length) {
      var key = props[index];
  
      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;
  
      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }
  
  module.exports = copyObject;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_coreJsData.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_coreJsData.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js");
  
  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];
  
  module.exports = coreJsData;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_createAssigner.js":
  /*!*************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_createAssigner.js ***!
    \*************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseRest = __webpack_require__(/*! ./_baseRest */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseRest.js"),
      isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isIterateeCall.js");
  
  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;
  
      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;
  
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  
  module.exports = createAssigner;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_createFind.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_createFind.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIteratee.js"),
      isArrayLike = __webpack_require__(/*! ./isArrayLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArrayLike.js"),
      keys = __webpack_require__(/*! ./keys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/keys.js");
  
  /**
   * Creates a `_.find` or `_.findLast` function.
   *
   * @private
   * @param {Function} findIndexFunc The function to find the collection index.
   * @returns {Function} Returns the new find function.
   */
  function createFind(findIndexFunc) {
    return function(collection, predicate, fromIndex) {
      var iterable = Object(collection);
      if (!isArrayLike(collection)) {
        var iteratee = baseIteratee(predicate, 3);
        collection = keys(collection);
        predicate = function(key) { return iteratee(iterable[key], key, iterable); };
      }
      var index = findIndexFunc(collection, predicate, fromIndex);
      return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
    };
  }
  
  module.exports = createFind;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_defineProperty.js":
  /*!*************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_defineProperty.js ***!
    \*************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getNative = __webpack_require__(/*! ./_getNative */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js");
  
  var defineProperty = (function() {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());
  
  module.exports = defineProperty;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_equalArrays.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_equalArrays.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var SetCache = __webpack_require__(/*! ./_SetCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_SetCache.js"),
      arraySome = __webpack_require__(/*! ./_arraySome */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arraySome.js"),
      cacheHas = __webpack_require__(/*! ./_cacheHas */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_cacheHas.js");
  
  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;
  
  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;
  
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1,
        result = true,
        seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;
  
    stack.set(array, other);
    stack.set(other, array);
  
    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];
  
      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, arrValue, index, other, array, stack)
          : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (seen) {
        if (!arraySome(other, function(othValue, othIndex) {
              if (!cacheHas(seen, othIndex) &&
                  (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
          result = false;
          break;
        }
      } else if (!(
            arrValue === othValue ||
              equalFunc(arrValue, othValue, bitmask, customizer, stack)
          )) {
        result = false;
        break;
      }
    }
    stack['delete'](array);
    stack['delete'](other);
    return result;
  }
  
  module.exports = equalArrays;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_equalByTag.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_equalByTag.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var Symbol = __webpack_require__(/*! ./_Symbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Symbol.js"),
      Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Uint8Array.js"),
      eq = __webpack_require__(/*! ./eq */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/eq.js"),
      equalArrays = __webpack_require__(/*! ./_equalArrays */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_equalArrays.js"),
      mapToArray = __webpack_require__(/*! ./_mapToArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapToArray.js"),
      setToArray = __webpack_require__(/*! ./_setToArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_setToArray.js");
  
  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;
  
  /** `Object#toString` result references. */
  var boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]';
  
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]';
  
  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  
  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if ((object.byteLength != other.byteLength) ||
            (object.byteOffset != other.byteOffset)) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
  
      case arrayBufferTag:
        if ((object.byteLength != other.byteLength) ||
            !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }
        return true;
  
      case boolTag:
      case dateTag:
      case numberTag:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq(+object, +other);
  
      case errorTag:
        return object.name == other.name && object.message == other.message;
  
      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == (other + '');
  
      case mapTag:
        var convert = mapToArray;
  
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
        convert || (convert = setToArray);
  
        if (object.size != other.size && !isPartial) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG;
  
        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack['delete'](object);
        return result;
  
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  
  module.exports = equalByTag;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_equalObjects.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_equalObjects.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getAllKeys.js");
  
  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1;
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        objProps = getAllKeys(object),
        objLength = objProps.length,
        othProps = getAllKeys(other),
        othLength = othProps.length;
  
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
  
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];
  
      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, objValue, key, other, object, stack)
          : customizer(objValue, othValue, key, object, other, stack);
      }
      // Recursively compare objects (susceptible to call stack limits).
      if (!(compared === undefined
            ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
            : compared
          )) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;
  
      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack['delete'](object);
    stack['delete'](other);
    return result;
  }
  
  module.exports = equalObjects;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_freeGlobal.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_freeGlobal.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  /* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
  
  module.exports = freeGlobal;
  
  /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../_webpack@4.12.0@webpack/buildin/global.js */ "../../../../.fie/node_modules/_webpack@4.12.0@webpack/buildin/global.js")))
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getAllKeys.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_getAllKeys.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGetAllKeys.js"),
      getSymbols = __webpack_require__(/*! ./_getSymbols */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getSymbols.js"),
      keys = __webpack_require__(/*! ./keys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/keys.js");
  
  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  
  module.exports = getAllKeys;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getMapData.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_getMapData.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isKeyable = __webpack_require__(/*! ./_isKeyable */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isKeyable.js");
  
  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }
  
  module.exports = getMapData;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getMatchData.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_getMatchData.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isStrictComparable = __webpack_require__(/*! ./_isStrictComparable */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isStrictComparable.js"),
      keys = __webpack_require__(/*! ./keys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/keys.js");
  
  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = keys(object),
        length = result.length;
  
    while (length--) {
      var key = result[length],
          value = object[key];
  
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  
  module.exports = getMatchData;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsNative.js"),
      getValue = __webpack_require__(/*! ./_getValue */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getValue.js");
  
  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }
  
  module.exports = getNative;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getRawTag.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_getRawTag.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var Symbol = __webpack_require__(/*! ./_Symbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Symbol.js");
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;
  
  /** Built-in value references. */
  var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
  
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];
  
    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}
  
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  
  module.exports = getRawTag;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getSymbols.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_getSymbols.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayFilter.js"),
      stubArray = __webpack_require__(/*! ./stubArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/stubArray.js");
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Built-in value references. */
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  
  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  
  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  
  module.exports = getSymbols;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getTag.js":
  /*!*****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_getTag.js ***!
    \*****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var DataView = __webpack_require__(/*! ./_DataView */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_DataView.js"),
      Map = __webpack_require__(/*! ./_Map */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Map.js"),
      Promise = __webpack_require__(/*! ./_Promise */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Promise.js"),
      Set = __webpack_require__(/*! ./_Set */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Set.js"),
      WeakMap = __webpack_require__(/*! ./_WeakMap */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_WeakMap.js"),
      baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGetTag.js"),
      toSource = __webpack_require__(/*! ./_toSource */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_toSource.js");
  
  /** `Object#toString` result references. */
  var mapTag = '[object Map]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      setTag = '[object Set]',
      weakMapTag = '[object WeakMap]';
  
  var dataViewTag = '[object DataView]';
  
  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);
  
  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = baseGetTag;
  
  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
      (Map && getTag(new Map) != mapTag) ||
      (Promise && getTag(Promise.resolve()) != promiseTag) ||
      (Set && getTag(new Set) != setTag) ||
      (WeakMap && getTag(new WeakMap) != weakMapTag)) {
    getTag = function(value) {
      var result = baseGetTag(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : '';
  
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag;
          case mapCtorString: return mapTag;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag;
          case weakMapCtorString: return weakMapTag;
        }
      }
      return result;
    };
  }
  
  module.exports = getTag;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getValue.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_getValue.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }
  
  module.exports = getValue;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hasPath.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_hasPath.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var castPath = __webpack_require__(/*! ./_castPath */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_castPath.js"),
      isArguments = __webpack_require__(/*! ./isArguments */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArguments.js"),
      isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js"),
      isIndex = __webpack_require__(/*! ./_isIndex */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isIndex.js"),
      isLength = __webpack_require__(/*! ./isLength */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isLength.js"),
      toKey = __webpack_require__(/*! ./_toKey */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_toKey.js");
  
  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
  
    var index = -1,
        length = path.length,
        result = false;
  
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) &&
      (isArray(object) || isArguments(object));
  }
  
  module.exports = hasPath;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashClear.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_hashClear.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nativeCreate.js");
  
  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }
  
  module.exports = hashClear;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashDelete.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_hashDelete.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  
  module.exports = hashDelete;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashGet.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_hashGet.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nativeCreate.js");
  
  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }
  
  module.exports = hashGet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashHas.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_hashHas.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nativeCreate.js");
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
  }
  
  module.exports = hashHas;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hashSet.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_hashSet.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nativeCreate.js");
  
  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }
  
  module.exports = hashSet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isFlattenable.js":
  /*!************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_isFlattenable.js ***!
    \************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var Symbol = __webpack_require__(/*! ./_Symbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Symbol.js"),
      isArguments = __webpack_require__(/*! ./isArguments */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArguments.js"),
      isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js");
  
  /** Built-in value references. */
  var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
  
  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) ||
      !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  
  module.exports = isFlattenable;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isIndex.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_isIndex.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;
  
  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;
  
    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }
  
  module.exports = isIndex;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isIterateeCall.js":
  /*!*************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_isIterateeCall.js ***!
    \*************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var eq = __webpack_require__(/*! ./eq */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/eq.js"),
      isArrayLike = __webpack_require__(/*! ./isArrayLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArrayLike.js"),
      isIndex = __webpack_require__(/*! ./_isIndex */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isIndex.js"),
      isObject = __webpack_require__(/*! ./isObject */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObject.js");
  
  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq(object[index], value);
    }
    return false;
  }
  
  module.exports = isIterateeCall;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isKey.js":
  /*!****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_isKey.js ***!
    \****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isArray = __webpack_require__(/*! ./isArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js"),
      isSymbol = __webpack_require__(/*! ./isSymbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isSymbol.js");
  
  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;
  
  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }
  
  module.exports = isKey;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isKeyable.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_isKeyable.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }
  
  module.exports = isKeyable;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isMasked.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_isMasked.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var coreJsData = __webpack_require__(/*! ./_coreJsData */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_coreJsData.js");
  
  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());
  
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }
  
  module.exports = isMasked;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isPrototype.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_isPrototype.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
  
    return value === proto;
  }
  
  module.exports = isPrototype;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isStrictComparable.js":
  /*!*****************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_isStrictComparable.js ***!
    \*****************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isObject = __webpack_require__(/*! ./isObject */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObject.js");
  
  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }
  
  module.exports = isStrictComparable;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheClear.js":
  /*!*************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_listCacheClear.js ***!
    \*************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  
  module.exports = listCacheClear;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheDelete.js":
  /*!**************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_listCacheDelete.js ***!
    \**************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_assocIndexOf.js");
  
  /** Used for built-in method references. */
  var arrayProto = Array.prototype;
  
  /** Built-in value references. */
  var splice = arrayProto.splice;
  
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
  
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  
  module.exports = listCacheDelete;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheGet.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_listCacheGet.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_assocIndexOf.js");
  
  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
  
    return index < 0 ? undefined : data[index][1];
  }
  
  module.exports = listCacheGet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheHas.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_listCacheHas.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_assocIndexOf.js");
  
  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  
  module.exports = listCacheHas;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_listCacheSet.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_listCacheSet.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_assocIndexOf.js");
  
  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
  
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  
  module.exports = listCacheSet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheClear.js":
  /*!************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheClear.js ***!
    \************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var Hash = __webpack_require__(/*! ./_Hash */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Hash.js"),
      ListCache = __webpack_require__(/*! ./_ListCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_ListCache.js"),
      Map = __webpack_require__(/*! ./_Map */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Map.js");
  
  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }
  
  module.exports = mapCacheClear;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheDelete.js":
  /*!*************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheDelete.js ***!
    \*************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getMapData = __webpack_require__(/*! ./_getMapData */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getMapData.js");
  
  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  
  module.exports = mapCacheDelete;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheGet.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheGet.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getMapData = __webpack_require__(/*! ./_getMapData */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getMapData.js");
  
  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  
  module.exports = mapCacheGet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheHas.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheHas.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getMapData = __webpack_require__(/*! ./_getMapData */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getMapData.js");
  
  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  
  module.exports = mapCacheHas;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheSet.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_mapCacheSet.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getMapData = __webpack_require__(/*! ./_getMapData */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getMapData.js");
  
  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;
  
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  
  module.exports = mapCacheSet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_mapToArray.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_mapToArray.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);
  
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  
  module.exports = mapToArray;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_matchesStrictComparable.js":
  /*!**********************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_matchesStrictComparable.js ***!
    \**********************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue &&
        (srcValue !== undefined || (key in Object(object)));
    };
  }
  
  module.exports = matchesStrictComparable;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_memoizeCapped.js":
  /*!************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_memoizeCapped.js ***!
    \************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var memoize = __webpack_require__(/*! ./memoize */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/memoize.js");
  
  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;
  
  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
  
    var cache = result.cache;
    return result;
  }
  
  module.exports = memoizeCapped;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nativeCreate.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_nativeCreate.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var getNative = __webpack_require__(/*! ./_getNative */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_getNative.js");
  
  /* Built-in method references that are verified to be native. */
  var nativeCreate = getNative(Object, 'create');
  
  module.exports = nativeCreate;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nativeKeys.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_nativeKeys.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var overArg = __webpack_require__(/*! ./_overArg */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_overArg.js");
  
  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = overArg(Object.keys, Object);
  
  module.exports = nativeKeys;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nodeUtil.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_nodeUtil.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  /* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_freeGlobal.js");
  
  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
  
  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
  
  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;
  
  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;
  
  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;
  
      if (types) {
        return types;
      }
  
      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());
  
  module.exports = nodeUtil;
  
  /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../_webpack@4.12.0@webpack/buildin/module.js */ "../../../../.fie/node_modules/_webpack@4.12.0@webpack/buildin/module.js")(module)))
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_objectToString.js":
  /*!*************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_objectToString.js ***!
    \*************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;
  
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  
  module.exports = objectToString;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_overArg.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_overArg.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  
  module.exports = overArg;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_overRest.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_overRest.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var apply = __webpack_require__(/*! ./_apply */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_apply.js");
  
  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;
  
  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);
  
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }
  
  module.exports = overRest;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js":
  /*!***************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_root.js ***!
    \***************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_freeGlobal.js");
  
  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  
  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();
  
  module.exports = root;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_setCacheAdd.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_setCacheAdd.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  
  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  
  module.exports = setCacheAdd;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_setCacheHas.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_setCacheHas.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  
  module.exports = setCacheHas;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_setToArray.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_setToArray.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);
  
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  
  module.exports = setToArray;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_setToString.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_setToString.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseSetToString = __webpack_require__(/*! ./_baseSetToString */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseSetToString.js"),
      shortOut = __webpack_require__(/*! ./_shortOut */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_shortOut.js");
  
  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = shortOut(baseSetToString);
  
  module.exports = setToString;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_shortOut.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_shortOut.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;
  
  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeNow = Date.now;
  
  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;
  
    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);
  
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }
  
  module.exports = shortOut;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackClear.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_stackClear.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var ListCache = __webpack_require__(/*! ./_ListCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_ListCache.js");
  
  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
  }
  
  module.exports = stackClear;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackDelete.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_stackDelete.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);
  
    this.size = data.size;
    return result;
  }
  
  module.exports = stackDelete;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackGet.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_stackGet.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }
  
  module.exports = stackGet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackHas.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_stackHas.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }
  
  module.exports = stackHas;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stackSet.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_stackSet.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var ListCache = __webpack_require__(/*! ./_ListCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_ListCache.js"),
      Map = __webpack_require__(/*! ./_Map */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_Map.js"),
      MapCache = __webpack_require__(/*! ./_MapCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_MapCache.js");
  
  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;
  
  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  
  module.exports = stackSet;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_strictIndexOf.js":
  /*!************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_strictIndexOf.js ***!
    \************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;
  
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }
  
  module.exports = strictIndexOf;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_stringToPath.js":
  /*!***********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_stringToPath.js ***!
    \***********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var memoizeCapped = __webpack_require__(/*! ./_memoizeCapped */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_memoizeCapped.js");
  
  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  
  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;
  
  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });
  
  module.exports = stringToPath;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_toKey.js":
  /*!****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_toKey.js ***!
    \****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isSymbol = __webpack_require__(/*! ./isSymbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isSymbol.js");
  
  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;
  
  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }
  
  module.exports = toKey;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_toSource.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/_toSource.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /** Used for built-in method references. */
  var funcProto = Function.prototype;
  
  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;
  
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }
  
  module.exports = toSource;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/assign.js":
  /*!****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/assign.js ***!
    \****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var assignValue = __webpack_require__(/*! ./_assignValue */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_assignValue.js"),
      copyObject = __webpack_require__(/*! ./_copyObject */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_copyObject.js"),
      createAssigner = __webpack_require__(/*! ./_createAssigner */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_createAssigner.js"),
      isArrayLike = __webpack_require__(/*! ./isArrayLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArrayLike.js"),
      isPrototype = __webpack_require__(/*! ./_isPrototype */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isPrototype.js"),
      keys = __webpack_require__(/*! ./keys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/keys.js");
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * Assigns own enumerable string keyed properties of source objects to the
   * destination object. Source objects are applied from left to right.
   * Subsequent sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object` and is loosely based on
   * [`Object.assign`](https://mdn.io/Object/assign).
   *
   * @static
   * @memberOf _
   * @since 0.10.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.assignIn
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * function Bar() {
   *   this.c = 3;
   * }
   *
   * Foo.prototype.b = 2;
   * Bar.prototype.d = 4;
   *
   * _.assign({ 'a': 0 }, new Foo, new Bar);
   * // => { 'a': 1, 'c': 3 }
   */
  var assign = createAssigner(function(object, source) {
    if (isPrototype(source) || isArrayLike(source)) {
      copyObject(source, keys(source), object);
      return;
    }
    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        assignValue(object, key, source[key]);
      }
    }
  });
  
  module.exports = assign;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/constant.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/constant.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }
  
  module.exports = constant;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/difference.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/difference.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseDifference = __webpack_require__(/*! ./_baseDifference */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseDifference.js"),
      baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseFlatten.js"),
      baseRest = __webpack_require__(/*! ./_baseRest */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseRest.js"),
      isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArrayLikeObject.js");
  
  /**
   * Creates an array of `array` values not included in the other given arrays
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. The order and references of result values are
   * determined by the first array.
   *
   * **Note:** Unlike `_.pullAll`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...Array} [values] The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @see _.without, _.xor
   * @example
   *
   * _.difference([2, 1], [2, 3]);
   * // => [1]
   */
  var difference = baseRest(function(array, values) {
    return isArrayLikeObject(array)
      ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
      : [];
  });
  
  module.exports = difference;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/eq.js":
  /*!************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/eq.js ***!
    \************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }
  
  module.exports = eq;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/find.js":
  /*!**************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/find.js ***!
    \**************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var createFind = __webpack_require__(/*! ./_createFind */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_createFind.js"),
      findIndex = __webpack_require__(/*! ./findIndex */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/findIndex.js");
  
  /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.find(users, function(o) { return o.age < 40; });
   * // => object for 'barney'
   *
   * // The `_.matches` iteratee shorthand.
   * _.find(users, { 'age': 1, 'active': true });
   * // => object for 'pebbles'
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.find(users, ['active', false]);
   * // => object for 'fred'
   *
   * // The `_.property` iteratee shorthand.
   * _.find(users, 'active');
   * // => object for 'barney'
   */
  var find = createFind(findIndex);
  
  module.exports = find;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/findIndex.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/findIndex.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseFindIndex.js"),
      baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIteratee.js"),
      toInteger = __webpack_require__(/*! ./toInteger */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/toInteger.js");
  
  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;
  
  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * _.findIndex(users, function(o) { return o.user == 'barney'; });
   * // => 0
   *
   * // The `_.matches` iteratee shorthand.
   * _.findIndex(users, { 'user': 'fred', 'active': false });
   * // => 1
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.findIndex(users, ['active', false]);
   * // => 0
   *
   * // The `_.property` iteratee shorthand.
   * _.findIndex(users, 'active');
   * // => 2
   */
  function findIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax(length + index, 0);
    }
    return baseFindIndex(array, baseIteratee(predicate, 3), index);
  }
  
  module.exports = findIndex;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/get.js":
  /*!*************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/get.js ***!
    \*************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseGet = __webpack_require__(/*! ./_baseGet */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGet.js");
  
  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }
  
  module.exports = get;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/hasIn.js":
  /*!***************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/hasIn.js ***!
    \***************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseHasIn = __webpack_require__(/*! ./_baseHasIn */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseHasIn.js"),
      hasPath = __webpack_require__(/*! ./_hasPath */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_hasPath.js");
  
  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.hasIn(object, 'a');
   * // => true
   *
   * _.hasIn(object, 'a.b');
   * // => true
   *
   * _.hasIn(object, ['a', 'b']);
   * // => true
   *
   * _.hasIn(object, 'b');
   * // => false
   */
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  
  module.exports = hasIn;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/identity.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/identity.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }
  
  module.exports = identity;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArguments.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isArguments.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsArguments.js"),
      isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObjectLike.js");
  
  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  
  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /** Built-in value references. */
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  
  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };
  
  module.exports = isArguments;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArray.js":
  /*!*****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isArray.js ***!
    \*****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;
  
  module.exports = isArray;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArrayLike.js":
  /*!*********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isArrayLike.js ***!
    \*********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isFunction = __webpack_require__(/*! ./isFunction */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isFunction.js"),
      isLength = __webpack_require__(/*! ./isLength */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isLength.js");
  
  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  
  module.exports = isArrayLike;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArrayLikeObject.js":
  /*!***************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isArrayLikeObject.js ***!
    \***************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isArrayLike = __webpack_require__(/*! ./isArrayLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArrayLike.js"),
      isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObjectLike.js");
  
  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  
  module.exports = isArrayLikeObject;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isBuffer.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isBuffer.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  /* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(/*! ./_root */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_root.js"),
      stubFalse = __webpack_require__(/*! ./stubFalse */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/stubFalse.js");
  
  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
  
  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
  
  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;
  
  /** Built-in value references. */
  var Buffer = moduleExports ? root.Buffer : undefined;
  
  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
  
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;
  
  module.exports = isBuffer;
  
  /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../_webpack@4.12.0@webpack/buildin/module.js */ "../../../../.fie/node_modules/_webpack@4.12.0@webpack/buildin/module.js")(module)))
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isFunction.js":
  /*!********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isFunction.js ***!
    \********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGetTag.js"),
      isObject = __webpack_require__(/*! ./isObject */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObject.js");
  
  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';
  
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  
  module.exports = isFunction;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isLength.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isLength.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;
  
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  
  module.exports = isLength;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObject.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isObject.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }
  
  module.exports = isObject;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObjectLike.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isObjectLike.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }
  
  module.exports = isObjectLike;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isSymbol.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isSymbol.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseGetTag.js"),
      isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObjectLike.js");
  
  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';
  
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }
  
  module.exports = isSymbol;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isTypedArray.js":
  /*!**********************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/isTypedArray.js ***!
    \**********************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseIsTypedArray.js"),
      baseUnary = __webpack_require__(/*! ./_baseUnary */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseUnary.js"),
      nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_nodeUtil.js");
  
  /* Node.js helper references. */
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  
  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  
  module.exports = isTypedArray;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/keys.js":
  /*!**************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/keys.js ***!
    \**************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_arrayLikeKeys.js"),
      baseKeys = __webpack_require__(/*! ./_baseKeys */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseKeys.js"),
      isArrayLike = __webpack_require__(/*! ./isArrayLike */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isArrayLike.js");
  
  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  
  module.exports = keys;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/memoize.js":
  /*!*****************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/memoize.js ***!
    \*****************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var MapCache = __webpack_require__(/*! ./_MapCache */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_MapCache.js");
  
  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';
  
  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;
  
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }
  
  // Expose `MapCache`.
  memoize.Cache = MapCache;
  
  module.exports = memoize;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/property.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/property.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseProperty = __webpack_require__(/*! ./_baseProperty */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseProperty.js"),
      basePropertyDeep = __webpack_require__(/*! ./_basePropertyDeep */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_basePropertyDeep.js"),
      isKey = __webpack_require__(/*! ./_isKey */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_isKey.js"),
      toKey = __webpack_require__(/*! ./_toKey */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_toKey.js");
  
  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  
  module.exports = property;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/stubArray.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/stubArray.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }
  
  module.exports = stubArray;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/stubFalse.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/stubFalse.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }
  
  module.exports = stubFalse;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/toFinite.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/toFinite.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var toNumber = __webpack_require__(/*! ./toNumber */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/toNumber.js");
  
  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_INTEGER = 1.7976931348623157e+308;
  
  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  
  module.exports = toFinite;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/toInteger.js":
  /*!*******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/toInteger.js ***!
    \*******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var toFinite = __webpack_require__(/*! ./toFinite */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/toFinite.js");
  
  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */
  function toInteger(value) {
    var result = toFinite(value),
        remainder = result % 1;
  
    return result === result ? (remainder ? result - remainder : result) : 0;
  }
  
  module.exports = toInteger;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/toNumber.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/toNumber.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var isObject = __webpack_require__(/*! ./isObject */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isObject.js"),
      isSymbol = __webpack_require__(/*! ./isSymbol */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/isSymbol.js");
  
  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;
  
  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;
  
  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  
  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;
  
  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;
  
  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;
  
  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }
  
  module.exports = toNumber;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/toString.js":
  /*!******************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_lodash@4.17.10@lodash/toString.js ***!
    \******************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var baseToString = __webpack_require__(/*! ./_baseToString */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/_baseToString.js");
  
  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  
  module.exports = toString;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/lib/patch.dev.js":
  /*!*************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/lib/patch.dev.js ***!
    \*************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var Rax = __webpack_require__(/*! rax */ "rax");
  
  var _require = __webpack_require__(/*! react-proxy */ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/index.js"),
      createProxy = _require.createProxy;
  
  var global = __webpack_require__(/*! global */ "../../../../.fie/node_modules/_global@4.3.2@global/window.js");
  
  var ComponentMap = function () {
    function ComponentMap(useWeakMap) {
      _classCallCheck(this, ComponentMap);
  
      if (useWeakMap) {
        this.wm = new WeakMap();
      } else {
        this.slots = {};
      }
    }
  
    _createClass(ComponentMap, [{
      key: 'getSlot',
      value: function getSlot(type) {
        var key = type.displayName || type.name || 'Unknown';
        if (!this.slots[key]) {
          this.slots[key] = [];
        }
        return this.slots[key];
      }
    }, {
      key: 'get',
      value: function get(type) {
        if (this.wm) {
          return this.wm.get(type);
        }
  
        var slot = this.getSlot(type);
        for (var i = 0; i < slot.length; i++) {
          if (slot[i].key === type) {
            return slot[i].value;
          }
        }
  
        return undefined;
      }
    }, {
      key: 'set',
      value: function set(type, value) {
        if (this.wm) {
          this.wm.set(type, value);
        } else {
          var slot = this.getSlot(type);
          for (var i = 0; i < slot.length; i++) {
            if (slot[i].key === type) {
              slot[i].value = value;
              return;
            }
          }
          slot.push({ key: type, value: value });
        }
      }
    }, {
      key: 'has',
      value: function has(type) {
        if (this.wm) {
          return this.wm.has(type);
        }
  
        var slot = this.getSlot(type);
        for (var i = 0; i < slot.length; i++) {
          if (slot[i].key === type) {
            return true;
          }
        }
        return false;
      }
    }]);
  
    return ComponentMap;
  }();
  
  var proxiesByID = void 0;
  var didWarnAboutID = void 0;
  var hasCreatedElementsByType = void 0;
  var idsByType = void 0;
  
  var hooks = {
    register: function register(type, uniqueLocalName, fileName) {
      if (typeof type !== 'function') {
        return;
      }
      if (!uniqueLocalName || !fileName) {
        return;
      }
      if (typeof uniqueLocalName !== 'string' || typeof fileName !== 'string') {
        return;
      }
      var id = fileName + '#' + uniqueLocalName; // eslint-disable-line prefer-template
      if (!idsByType.has(type) && hasCreatedElementsByType.has(type)) {
        if (!didWarnAboutID[id]) {
          didWarnAboutID[id] = true;
          var baseName = fileName.replace(/^.*[\\\/]/, '');
          console.error('Rax Hot Loader: ' + uniqueLocalName + ' in ' + fileName + ' will not hot reload ' + ('correctly because ' + baseName + ' uses <' + uniqueLocalName + ' /> during ') + ('module definition. For hot reloading to work, move ' + uniqueLocalName + ' ') + ('into a separate file and import it from ' + baseName + '.'));
        }
        return;
      }
  
      // Remember the ID.
      idsByType.set(type, id);
  
      // console.log(id, proxiesByID[id], type);
      // We use React Proxy to generate classes that behave almost
      // the same way as the original classes but are updatable with
      // new versions without destroying original instances.
      if (!proxiesByID[id]) {
        proxiesByID[id] = createProxy(type);
      } else {
        proxiesByID[id].update(type);
      }
    },
    reset: function reset(useWeakMap) {
      proxiesByID = {};
      didWarnAboutID = {};
      hasCreatedElementsByType = new ComponentMap(useWeakMap);
      idsByType = new ComponentMap(useWeakMap);
    }
  };
  
  hooks.reset(typeof WeakMap === 'function');
  
  function resolveType(type) {
    // We only care about composite components
    if (typeof type !== 'function') {
      return type;
    }
  
    hasCreatedElementsByType.set(type, true);
  
    // When available, give proxy class to React instead of the real class.
    var id = idsByType.get(type);
    if (!id) {
      return type;
    }
  
    var proxy = proxiesByID[id];
    if (!proxy) {
      return type;
    }
  
    return proxy.get();
  }
  var createElement = Rax.createElement;
  function patchedCreateElement(type) {
    // Trick React into rendering a proxy so that
    // its state is preserved when the class changes.
    // This will update the proxy if it's for a known type.
    var resolvedType = resolveType(type);
  
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
  
    return createElement.apply(undefined, [resolvedType].concat(args));
  }
  patchedCreateElement.isPatchedByReactHotLoader = true;
  
  function patchedCreateFactory(type) {
    // Patch Rax.createFactory to use patched createElement
    // because the original implementation uses the internal,
    // unpatched ReactElement.createElement
    var factory = patchedCreateElement.bind(null, type);
    factory.type = type;
    return factory;
  }
  patchedCreateFactory.isPatchedByReactHotLoader = true;
  
  if (typeof global.__RAX_HOT_LOADER__ === 'undefined') {
    Rax.createElement = patchedCreateElement;
    Rax.createFactory = patchedCreateFactory;
    global.__RAX_HOT_LOADER__ = hooks;
  }
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/lib/patch.js":
  /*!*********************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/lib/patch.js ***!
    \*********************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  /* eslint-disable global-require */
  
  
  
  if (false) {} else {
    module.exports = __webpack_require__(/*! ./patch.dev */ "../../../../.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/lib/patch.dev.js");
  }
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/patch.js":
  /*!*****************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/patch.js ***!
    \*****************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  module.exports = __webpack_require__(/*! ./lib/patch */ "../../../../.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/lib/patch.js");
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_react-deep-force-update@1.1.1@react-deep-force-update/lib/index.js":
  /*!***************************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_react-deep-force-update@1.1.1@react-deep-force-update/lib/index.js ***!
    \***************************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  // Constant to identify a React Component. It's been extracted from ReactTypeOfWork
  // (https://github.com/facebook/react/blob/master/src/shared/ReactTypeOfWork.js#L20)
  
  
  exports.__esModule = true;
  exports['default'] = getForceUpdate;
  var ReactClassComponent = 2;
  
  function traverseRenderedChildren(internalInstance, callback, argument) {
    callback(internalInstance, argument);
  
    if (internalInstance._renderedComponent) {
      traverseRenderedChildren(internalInstance._renderedComponent, callback, argument);
    } else {
      for (var key in internalInstance._renderedChildren) {
        if (internalInstance._renderedChildren.hasOwnProperty(key)) {
          traverseRenderedChildren(internalInstance._renderedChildren[key], callback, argument);
        }
      }
    }
  }
  
  function setPendingForceUpdate(internalInstance) {
    if (internalInstance._pendingForceUpdate === false) {
      internalInstance._pendingForceUpdate = true;
    }
  }
  
  function forceUpdateIfPending(internalInstance, React) {
    if (internalInstance._pendingForceUpdate === true) {
      var publicInstance = internalInstance._instance;
      React.Component.prototype.forceUpdate.call(publicInstance);
    }
  }
  
  function deepForceUpdateStack(instance, React) {
    var internalInstance = instance._reactInternalInstance;
    traverseRenderedChildren(internalInstance, setPendingForceUpdate);
    traverseRenderedChildren(internalInstance, forceUpdateIfPending, React);
  }
  
  function deepForceUpdate(instance, React) {
    var root = instance._reactInternalFiber || instance._reactInternalInstance;
    if (typeof root.tag !== 'number') {
      // Traverse stack-based React tree.
      return deepForceUpdateStack(instance, React);
    }
  
    var node = root;
    while (true) {
      if (node.tag === ReactClassComponent) {
        var publicInstance = node.stateNode;
        var updater = publicInstance.updater;
  
        if (typeof publicInstance.forceUpdate === 'function') {
          publicInstance.forceUpdate();
        } else if (updater && typeof updater.enqueueForceUpdate === 'function') {
          updater.enqueueForceUpdate(publicInstance);
        }
      }
      if (node.child) {
        node.child['return'] = node;
        node = node.child;
        continue;
      }
      if (node === root) {
        return undefined;
      }
      while (!node.sibling) {
        if (!node['return'] || node['return'] === root) {
          return undefined;
        }
        node = node['return'];
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
    }
  }
  
  function getForceUpdate(React) {
    return function (instance) {
      deepForceUpdate(instance, React);
    };
  }
  
  module.exports = exports['default'];
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/bindAutoBindMethods.js":
  /*!*********************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/bindAutoBindMethods.js ***!
    \*********************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = bindAutoBindMethods;
  /**
   * Copyright 2013-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of React source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * Original:
   * https://github.com/facebook/react/blob/6508b1ad273a6f371e8d90ae676e5390199461b4/src/isomorphic/classic/class/ReactClass.js#L650-L713
   */
  
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
  
    boundMethod.__reactBoundContext = component;
    boundMethod.__reactBoundMethod = method;
    boundMethod.__reactBoundArguments = null;
  
    var componentName = component.constructor.displayName,
        _bind = boundMethod.bind;
  
    boundMethod.bind = function (newThis) {
      var args = Array.prototype.slice.call(arguments, 1);
      if (newThis !== component && newThis !== null) {
        console.warn('bind(): React component methods may only be bound to the ' + 'component instance. See ' + componentName);
      } else if (!args.length) {
        console.warn('bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See ' + componentName);
        return boundMethod;
      }
  
      var reboundMethod = _bind.apply(boundMethod, arguments);
      reboundMethod.__reactBoundContext = component;
      reboundMethod.__reactBoundMethod = method;
      reboundMethod.__reactBoundArguments = args;
  
      return reboundMethod;
    };
  
    return boundMethod;
  }
  
  function bindAutoBindMethodsFromMap(component) {
    for (var autoBindKey in component.__reactAutoBindMap) {
      if (!component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
        return;
      }
  
      // Tweak: skip methods that are already bound.
      // This is to preserve method reference in case it is used
      // as a subscription handler that needs to be detached later.
      if (component.hasOwnProperty(autoBindKey) && component[autoBindKey].__reactBoundContext === component) {
        continue;
      }
  
      var method = component.__reactAutoBindMap[autoBindKey];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }
  
  function bindAutoBindMethods(component) {
    if (component.__reactAutoBindPairs) {
      bindAutoBindMethodsFromArray(component);
    } else if (component.__reactAutoBindMap) {
      bindAutoBindMethodsFromMap(component);
    }
  }
  
  function bindAutoBindMethodsFromArray(component) {
    var pairs = component.__reactAutoBindPairs;
  
    if (!pairs) {
      return;
    }
  
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
  
      if (component.hasOwnProperty(autoBindKey) && component[autoBindKey].__reactBoundContext === component) {
        continue;
      }
  
      var method = pairs[i + 1];
  
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/createClassProxy.js":
  /*!******************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/createClassProxy.js ***!
    \******************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
  
  var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
  
  exports.default = proxyClass;
  exports.default = createClassProxy;
  
  var _find = __webpack_require__(/*! lodash/find */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/find.js");
  
  var _find2 = _interopRequireDefault(_find);
  
  var _createPrototypeProxy = __webpack_require__(/*! ./createPrototypeProxy */ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/createPrototypeProxy.js");
  
  var _createPrototypeProxy2 = _interopRequireDefault(_createPrototypeProxy);
  
  var _bindAutoBindMethods = __webpack_require__(/*! ./bindAutoBindMethods */ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/bindAutoBindMethods.js");
  
  var _bindAutoBindMethods2 = _interopRequireDefault(_bindAutoBindMethods);
  
  var _deleteUnknownAutoBindMethods = __webpack_require__(/*! ./deleteUnknownAutoBindMethods */ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/deleteUnknownAutoBindMethods.js");
  
  var _deleteUnknownAutoBindMethods2 = _interopRequireDefault(_deleteUnknownAutoBindMethods);
  
  var _supportsProtoAssignment = __webpack_require__(/*! ./supportsProtoAssignment */ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/supportsProtoAssignment.js");
  
  var _supportsProtoAssignment2 = _interopRequireDefault(_supportsProtoAssignment);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
  
  var RESERVED_STATICS = ['length', 'name', 'arguments', 'caller', 'prototype', 'toString'];
  
  function isEqualDescriptor(a, b) {
    if (!a && !b) {
      return true;
    }
    if (!a || !b) {
      return false;
    }
    for (var key in a) {
      if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }
  
  // This was originally a WeakMap but we had issues with React Native:
  // https://github.com/gaearon/react-proxy/issues/50#issuecomment-192928066
  var allProxies = [];
  function findProxy(Component) {
    var pair = (0, _find2.default)(allProxies, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1);
  
      var key = _ref2[0];
      return key === Component;
    });
    return pair ? pair[1] : null;
  }
  function addProxy(Component, proxy) {
    allProxies.push([Component, proxy]);
  }
  
  function proxyClass(InitialComponent) {
    // Prevent double wrapping.
    // Given a proxy class, return the existing proxy managing it.
    var existingProxy = findProxy(InitialComponent);
    if (existingProxy) {
      return existingProxy;
    }
  
    var prototypeProxy = (0, _createPrototypeProxy2.default)();
    var CurrentComponent = undefined;
    var ProxyComponent = undefined;
  
    var staticDescriptors = {};
    function wasStaticModifiedByUser(key) {
      // Compare the descriptor with the one we previously set ourselves.
      var currentDescriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);
      return !isEqualDescriptor(staticDescriptors[key], currentDescriptor);
    }
  
    function instantiate(factory, context, params) {
      var component = factory();
  
      try {
        return component.apply(context, params);
      } catch (err) {
        (function () {
          // Native ES6 class instantiation
          var instance = new (Function.prototype.bind.apply(component, [null].concat(_toConsumableArray(params))))();
  
          Object.keys(instance).forEach(function (key) {
            if (RESERVED_STATICS.indexOf(key) > -1) {
              return;
            }
            context[key] = instance[key];
          });
        })();
      }
    }
  
    try {
      // Create a proxy constructor with matching name
      ProxyComponent = new Function('factory', 'instantiate', 'return function ' + (InitialComponent.name || 'ProxyComponent') + '() {\n         return instantiate(factory, this, arguments);\n      }')(function () {
        return CurrentComponent;
      }, instantiate);
    } catch (err) {
      // Some environments may forbid dynamic evaluation
      ProxyComponent = function ProxyComponent() {
        return instantiate(function () {
          return CurrentComponent;
        }, this, arguments);
      };
    }
  
    // Point proxy constructor to the proxy prototype
    ProxyComponent.prototype = prototypeProxy.get();
  
    // Proxy toString() to the current constructor
    ProxyComponent.toString = function toString() {
      return CurrentComponent.toString();
    };
  
    function update(NextComponent) {
      if (typeof NextComponent !== 'function') {
        throw new Error('Expected a constructor.');
      }
  
      // Prevent proxy cycles
      var existingProxy = findProxy(NextComponent);
      if (existingProxy) {
        return update(existingProxy.__getCurrent());
      }
  
      // Save the next constructor so we call it
      CurrentComponent = NextComponent;
  
      // Update the prototype proxy with new methods
      var mountedInstances = prototypeProxy.update(NextComponent.prototype);
  
      // Set up the constructor property so accessing the statics work
      ProxyComponent.prototype.constructor = ProxyComponent;
  
      // Set up the same prototype for inherited statics
      ProxyComponent.__proto__ = NextComponent.__proto__;
  
      // Copy static methods and properties
      Object.getOwnPropertyNames(NextComponent).forEach(function (key) {
        if (RESERVED_STATICS.indexOf(key) > -1) {
          return;
        }
  
        var staticDescriptor = _extends({}, Object.getOwnPropertyDescriptor(NextComponent, key), {
          configurable: true
        });
  
        // Copy static unless user has redefined it at runtime
        if (!wasStaticModifiedByUser(key)) {
          Object.defineProperty(ProxyComponent, key, staticDescriptor);
          staticDescriptors[key] = staticDescriptor;
        }
      });
  
      // Remove old static methods and properties
      Object.getOwnPropertyNames(ProxyComponent).forEach(function (key) {
        if (RESERVED_STATICS.indexOf(key) > -1) {
          return;
        }
  
        // Skip statics that exist on the next class
        if (NextComponent.hasOwnProperty(key)) {
          return;
        }
  
        // Skip non-configurable statics
        var descriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);
        if (descriptor && !descriptor.configurable) {
          return;
        }
  
        // Delete static unless user has redefined it at runtime
        if (!wasStaticModifiedByUser(key)) {
          delete ProxyComponent[key];
          delete staticDescriptors[key];
        }
      });
  
      // Try to infer displayName
      ProxyComponent.displayName = NextComponent.displayName || NextComponent.name;
  
      // We might have added new methods that need to be auto-bound
      mountedInstances.forEach(_bindAutoBindMethods2.default);
      mountedInstances.forEach(_deleteUnknownAutoBindMethods2.default);
  
      // Let the user take care of redrawing
      return mountedInstances;
    };
  
    function get() {
      return ProxyComponent;
    }
  
    function getCurrent() {
      return CurrentComponent;
    }
  
    update(InitialComponent);
  
    var proxy = { get: get, update: update };
    addProxy(ProxyComponent, proxy);
  
    Object.defineProperty(proxy, '__getCurrent', {
      configurable: false,
      writable: false,
      enumerable: false,
      value: getCurrent
    });
  
    return proxy;
  }
  
  function createFallback(Component) {
    var CurrentComponent = Component;
  
    return {
      get: function get() {
        return CurrentComponent;
      },
      update: function update(NextComponent) {
        CurrentComponent = NextComponent;
      }
    };
  }
  
  function createClassProxy(Component) {
    return Component.__proto__ && (0, _supportsProtoAssignment2.default)() ? proxyClass(Component) : createFallback(Component);
  }
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/createPrototypeProxy.js":
  /*!**********************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/createPrototypeProxy.js ***!
    \**********************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createPrototypeProxy;
  
  var _assign = __webpack_require__(/*! lodash/assign */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/assign.js");
  
  var _assign2 = _interopRequireDefault(_assign);
  
  var _difference = __webpack_require__(/*! lodash/difference */ "../../../../.fie/node_modules/_lodash@4.17.10@lodash/difference.js");
  
  var _difference2 = _interopRequireDefault(_difference);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function createPrototypeProxy() {
    var proxy = {};
    var current = null;
    var mountedInstances = [];
  
    /**
     * Creates a proxied toString() method pointing to the current version's toString().
     */
    function proxyToString(name) {
      // Wrap to always call the current version
      return function toString() {
        if (typeof current[name] === 'function') {
          return current[name].toString();
        } else {
          return '<method was deleted>';
        }
      };
    }
  
    /**
     * Creates a proxied method that calls the current version, whenever available.
     */
    function proxyMethod(name) {
      // Wrap to always call the current version
      var proxiedMethod = function proxiedMethod() {
        if (typeof current[name] === 'function') {
          return current[name].apply(this, arguments);
        }
      };
  
      // Copy properties of the original function, if any
      (0, _assign2.default)(proxiedMethod, current[name]);
      proxiedMethod.toString = proxyToString(name);
  
      return proxiedMethod;
    }
  
    /**
     * Augments the original componentDidMount with instance tracking.
     */
    function proxiedComponentDidMount() {
      mountedInstances.push(this);
      if (typeof current.componentDidMount === 'function') {
        return current.componentDidMount.apply(this, arguments);
      }
    }
    proxiedComponentDidMount.toString = proxyToString('componentDidMount');
  
    /**
     * Augments the original componentWillUnmount with instance tracking.
     */
    function proxiedComponentWillUnmount() {
      var index = mountedInstances.indexOf(this);
      // Unless we're in a weird environment without componentDidMount
      if (index !== -1) {
        mountedInstances.splice(index, 1);
      }
      if (typeof current.componentWillUnmount === 'function') {
        return current.componentWillUnmount.apply(this, arguments);
      }
    }
    proxiedComponentWillUnmount.toString = proxyToString('componentWillUnmount');
  
    /**
     * Defines a property on the proxy.
     */
    function defineProxyProperty(name, descriptor) {
      Object.defineProperty(proxy, name, descriptor);
    }
  
    /**
     * Defines a property, attempting to keep the original descriptor configuration.
     */
    function defineProxyPropertyWithValue(name, value) {
      var _ref = Object.getOwnPropertyDescriptor(current, name) || {};
  
      var _ref$enumerable = _ref.enumerable;
      var enumerable = _ref$enumerable === undefined ? false : _ref$enumerable;
      var _ref$writable = _ref.writable;
      var writable = _ref$writable === undefined ? true : _ref$writable;
  
  
      defineProxyProperty(name, {
        configurable: true,
        enumerable: enumerable,
        writable: writable,
        value: value
      });
    }
  
    /**
     * Creates an auto-bind map mimicking the original map, but directed at proxy.
     */
    function createAutoBindMap() {
      if (!current.__reactAutoBindMap) {
        return;
      }
  
      var __reactAutoBindMap = {};
      for (var name in current.__reactAutoBindMap) {
        if (typeof proxy[name] === 'function' && current.__reactAutoBindMap.hasOwnProperty(name)) {
          __reactAutoBindMap[name] = proxy[name];
        }
      }
  
      return __reactAutoBindMap;
    }
  
    /**
     * Creates an auto-bind map mimicking the original map, but directed at proxy.
     */
    function createAutoBindPairs() {
      var __reactAutoBindPairs = [];
  
      for (var i = 0; i < current.__reactAutoBindPairs.length; i += 2) {
        var name = current.__reactAutoBindPairs[i];
        var method = proxy[name];
  
        if (typeof method === 'function') {
          __reactAutoBindPairs.push(name, method);
        }
      }
  
      return __reactAutoBindPairs;
    }
  
    /**
     * Applies the updated prototype.
     */
    function update(next) {
      // Save current source of truth
      current = next;
  
      // Find changed property names
      var currentNames = Object.getOwnPropertyNames(current);
      var previousName = Object.getOwnPropertyNames(proxy);
      var removedNames = (0, _difference2.default)(previousName, currentNames);
  
      // Remove properties and methods that are no longer there
      removedNames.forEach(function (name) {
        delete proxy[name];
      });
  
      // Copy every descriptor
      currentNames.forEach(function (name) {
        var descriptor = Object.getOwnPropertyDescriptor(current, name);
        if (typeof descriptor.value === 'function') {
          // Functions require additional wrapping so they can be bound later
          defineProxyPropertyWithValue(name, proxyMethod(name));
        } else {
          // Other values can be copied directly
          defineProxyProperty(name, descriptor);
        }
      });
  
      // Track mounting and unmounting
      defineProxyPropertyWithValue('componentDidMount', proxiedComponentDidMount);
      defineProxyPropertyWithValue('componentWillUnmount', proxiedComponentWillUnmount);
  
      if (current.hasOwnProperty('__reactAutoBindMap')) {
        defineProxyPropertyWithValue('__reactAutoBindMap', createAutoBindMap());
      }
  
      if (current.hasOwnProperty('__reactAutoBindPairs')) {
        defineProxyPropertyWithValue('__reactAutoBindPairs', createAutoBindPairs());
      }
  
      // Set up the prototype chain
      proxy.__proto__ = next;
  
      return mountedInstances;
    }
  
    /**
     * Returns the up-to-date proxy prototype.
     */
    function get() {
      return proxy;
    }
  
    return {
      update: update,
      get: get
    };
  };
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/deleteUnknownAutoBindMethods.js":
  /*!******************************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/deleteUnknownAutoBindMethods.js ***!
    \******************************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = deleteUnknownAutoBindMethods;
  function shouldDeleteClassicInstanceMethod(component, name) {
    if (component.__reactAutoBindMap && component.__reactAutoBindMap.hasOwnProperty(name)) {
      // It's a known autobound function, keep it
      return false;
    }
  
    if (component.__reactAutoBindPairs && component.__reactAutoBindPairs.indexOf(name) >= 0) {
      // It's a known autobound function, keep it
      return false;
    }
  
    if (component[name].__reactBoundArguments !== null) {
      // It's a function bound to specific args, keep it
      return false;
    }
  
    // It's a cached bound method for a function
    // that was deleted by user, so we delete it from component.
    return true;
  }
  
  function shouldDeleteModernInstanceMethod(component, name) {
    var prototype = component.constructor.prototype;
  
    var prototypeDescriptor = Object.getOwnPropertyDescriptor(prototype, name);
  
    if (!prototypeDescriptor || !prototypeDescriptor.get) {
      // This is definitely not an autobinding getter
      return false;
    }
  
    if (prototypeDescriptor.get().length !== component[name].length) {
      // The length doesn't match, bail out
      return false;
    }
  
    // This seems like a method bound using an autobinding getter on the prototype
    // Hopefully we won't run into too many false positives.
    return true;
  }
  
  function shouldDeleteInstanceMethod(component, name) {
    var descriptor = Object.getOwnPropertyDescriptor(component, name);
    if (typeof descriptor.value !== 'function') {
      // Not a function, or something fancy: bail out
      return;
    }
  
    if (component.__reactAutoBindMap || component.__reactAutoBindPairs) {
      // Classic
      return shouldDeleteClassicInstanceMethod(component, name);
    } else {
      // Modern
      return shouldDeleteModernInstanceMethod(component, name);
    }
  }
  
  /**
   * Deletes autobound methods from the instance.
   *
   * For classic React classes, we only delete the methods that no longer exist in map.
   * This means the user actually deleted them in code.
   *
   * For modern classes, we delete methods that exist on prototype with the same length,
   * and which have getters on prototype, but are normal values on the instance.
   * This is usually an indication that an autobinding decorator is being used,
   * and the getter will re-generate the memoized handler on next access.
   */
  function deleteUnknownAutoBindMethods(component) {
    var names = Object.getOwnPropertyNames(component);
  
    names.forEach(function (name) {
      if (shouldDeleteInstanceMethod(component, name)) {
        delete component[name];
      }
    });
  }
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/index.js":
  /*!*******************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/index.js ***!
    \*******************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getForceUpdate = exports.createProxy = undefined;
  
  var _supportsProtoAssignment = __webpack_require__(/*! ./supportsProtoAssignment */ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/supportsProtoAssignment.js");
  
  var _supportsProtoAssignment2 = _interopRequireDefault(_supportsProtoAssignment);
  
  var _createClassProxy = __webpack_require__(/*! ./createClassProxy */ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/createClassProxy.js");
  
  var _createClassProxy2 = _interopRequireDefault(_createClassProxy);
  
  var _reactDeepForceUpdate = __webpack_require__(/*! react-deep-force-update */ "../../../../.fie/node_modules/_react-deep-force-update@1.1.1@react-deep-force-update/lib/index.js");
  
  var _reactDeepForceUpdate2 = _interopRequireDefault(_reactDeepForceUpdate);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  if (!(0, _supportsProtoAssignment2.default)()) {
    console.warn('This JavaScript environment does not support __proto__. ' + 'This means that react-proxy is unable to proxy React components. ' + 'Features that rely on react-proxy, such as react-transform-hmr, ' + 'will not function as expected.');
  }
  
  exports.createProxy = _createClassProxy2.default;
  exports.getForceUpdate = _reactDeepForceUpdate2.default;
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/supportsProtoAssignment.js":
  /*!*************************************************************************************************************!*\
    !*** /Users/yangpeizhi/.fie/node_modules/_react-proxy@1.1.8@react-proxy/modules/supportsProtoAssignment.js ***!
    \*************************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = supportsProtoAssignment;
  var x = {};
  var y = { supports: true };
  try {
    x.__proto__ = y;
  } catch (err) {}
  
  function supportsProtoAssignment() {
    return x.supports || false;
  };
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_webpack@4.12.0@webpack/buildin/global.js":
  /*!***********************************!*\
    !*** (webpack)/buildin/global.js ***!
    \***********************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  var g;
  
  // This works in non-strict mode
  g = (function() {
    return this;
  })();
  
  try {
    // This works if eval is allowed (see CSP)
    g = g || Function("return this")() || (1, eval)("this");
  } catch (e) {
    // This works if the window reference is available
    if (typeof window === "object") g = window;
  }
  
  // g can still be undefined, but nothing to do about it...
  // We return undefined, instead of nothing here, so it's
  // easier to handle this case. if(!global) { ...}
  
  module.exports = g;
  
  
  /***/ }),
  
  /***/ "../../../../.fie/node_modules/_webpack@4.12.0@webpack/buildin/module.js":
  /*!***********************************!*\
    !*** (webpack)/buildin/module.js ***!
    \***********************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  module.exports = function(module) {
    if (!module.webpackPolyfill) {
      module.deprecate = function() {};
      module.paths = [];
      // module.parent = undefined by default
      if (!module.children) module.children = [];
      Object.defineProperty(module, "loaded", {
        enumerable: true,
        get: function() {
          return module.l;
        }
      });
      Object.defineProperty(module, "id", {
        enumerable: true,
        get: function() {
          return module.i;
        }
      });
      module.webpackPolyfill = 1;
    }
    return module;
  };
  
  
  /***/ }),
  
  /***/ "./pages/index/index.jsx":
  /*!*******************************!*\
    !*** ./pages/index/index.jsx ***!
    \*******************************/
  /*! no exports provided */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony import */ var rax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rax */ "rax");
  /* harmony import */ var rax__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rax__WEBPACK_IMPORTED_MODULE_0__);
  /* harmony import */ var nuke__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nuke */ "nuke");
  /* harmony import */ var nuke__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nuke__WEBPACK_IMPORTED_MODULE_1__);
  /* harmony import */ var QAP_SDK__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! QAP-SDK */ "QAP-SDK");
  /* harmony import */ var QAP_SDK__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(QAP_SDK__WEBPACK_IMPORTED_MODULE_2__);
  /* harmony import */ var _index2_less__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index2.less */ "./pages/index/index2.less");
  /* harmony import */ var _index2_less__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_index2_less__WEBPACK_IMPORTED_MODULE_3__);
  
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  
  
  
  
  // import { HN, HNapi } from "$root/public/js/HN_api.js";
  // import HNcss from '$root/public/css/hn_ui.less';
  
  
  // import NoData from "$root/components/NoData";
  // import IconFont from '$root/components/icon/iconFont';
  // import CheckBox from '$root/components/Checkbox';
  
  var _Dimensions$get = nuke__WEBPACK_IMPORTED_MODULE_1__["Dimensions"].get('window'),
      width = _Dimensions$get.width,
      height = _Dimensions$get.height;
  
  var Home = function (_Component) {
      _inherits(Home, _Component);
  
      function Home(props) {
          _classCallCheck(this, Home);
  
          var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));
  
          _this.renderTFWZ = function () {
              var arr = [];
              for (var i = 0; i < 6; i++) {
                  arr.push(Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                      nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                      { style: [_index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.TFPosition] },
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                          { style: [_index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.p_item_txt, _this.state.TFPosition[i] ? _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.p_item_select : {}] },
                          i != 5 ? '主图' + (i + 1) : '长图'
                      ),
                      _this.state.TFPosition[i] ? Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(nuke__WEBPACK_IMPORTED_MODULE_1__["Image"], { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.TFPosition_icon, source: { uri: 'https://img.alicdn.com/imgextra/i2/281509299/TB2atRoE3aTBuNjSszfXXXgfpXa-281509299.png' }, resizeMode: 'contain' }) : null
                  ));
              }
              return arr;
          };
  
          _this.renderCon = function () {
              var left = 0;
              var top = 0;
              return Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                  nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                  null,
                  Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                      nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                      { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.top },
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                          { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.model_out },
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                              { style: [_index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.model] },
                              Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                                  nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                                  { style: [_index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.model_txt, _this.state.model ? {} : _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.model_select] },
                                  '\u65B9\u56FE\u6A21\u5F0F'
                              )
                          ),
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.model },
                              Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                                  nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                                  { style: [_index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.model_txt, _this.state.model ? _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.model_select : {}] },
                                  '\u957F\u56FE\u6A21\u5F0F'
                              )
                          )
                      ),
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                          null,
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.changeGood },
                              '\u66F4\u6362\u9884\u89C8\u5B9D\u8D1D'
                          )
                      )
                  ),
                  Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                      nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                      { style: { width: width, height: height - 205 } },
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(nuke__WEBPACK_IMPORTED_MODULE_1__["View"], { style: { height: 500 } }),
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                          { style: [{ width: width - 32 }, _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.item] },
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.title },
                              '\u6D3B\u52A8\u540D\u79F0'
                          ),
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.ipt },
                              Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(nuke__WEBPACK_IMPORTED_MODULE_1__["Input"], { ref: 'myinput', style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.input_name, maxLength: 20, value: _this.state.iptVal }),
                              Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                                  nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                                  { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.txtRange },
                                  _this.state.iptVal.length,
                                  '/20'
                              )
                          )
                      ),
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                          { style: [{ width: width - 32 }, _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.item] },
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.title },
                              '\u6295\u653E\u4F4D\u7F6E'
                          ),
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                              null,
                              _this.renderTFWZ()
                          )
                      ),
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                          { style: [{ width: width - 32 }, _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.item] },
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.title },
                              '\u6295\u653E\u65B9\u5F0F'
                          ),
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                              { style: [_index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.method, { marginRight: '100rem' }] },
                              Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                                  nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                                  { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.method_txt },
                                  '\u7ACB\u5373\u6295\u653E'
                              )
                          ),
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.method },
                              Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                                  nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                                  { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.method_txt },
                                  '\u5B9A\u65F6\u6295\u653E'
                              )
                          ),
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(nuke__WEBPACK_IMPORTED_MODULE_1__["Input"], { ref: 'myinput', style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.input_name, maxLength: 20, value: _this.state.iptVal })
                      )
                  ),
                  Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                      nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                      null,
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                          { style: [{ width: width - 32 }, _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.item] },
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.title },
                              '\u5F00\u59CB\u65F6\u95F4'
                          ),
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                              null,
                              Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                                  nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                                  { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.method_txt },
                                  _this.state.time[0]
                              )
                          )
                      ),
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["View"],
                          { style: [{ width: width - 32 }, _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.item] },
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                              { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.title },
                              '\u7ED3\u675F\u65F6\u95F4'
                          ),
                          Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                              nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                              null,
                              Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                                  nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                                  { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.method_txt },
                                  _this.state.time[1]
                              )
                          )
                      )
                  ),
                  Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                      nuke__WEBPACK_IMPORTED_MODULE_1__["Touchable"],
                      { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.foot },
                      Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                          nuke__WEBPACK_IMPORTED_MODULE_1__["Text"],
                          { style: _index2_less__WEBPACK_IMPORTED_MODULE_3___default.a.foot_txt },
                          _this.state.num_iids ? _this.state.isNeedPLJ ? '下一步，设置披露价' : '完成' : '下一步，添加宝贝'
                      )
                  )
              );
          };
  
          _this.state = {
              icon: { water_id: _this.props.water_id },
              num_iids: _this.props.num_iids,
              noData: false,
              list: [],
              indexPic: '',
              iptVal: '投放' + new Date().getTime(), // 活动名称
              model: 0, // 方图/长图模式
              TFPosition: [1, 0, 0, 0, 0, 0], // 投放位置
              method: [2, 0], // 投放方式
              time: ['请选择', '请选择'], // 投放时间（开始/结束）
              isNeedPLJ: null
          };
          return _this;
      }
  
      //组件即将加载
  
  
      _createClass(Home, [{
          key: 'componentWillMount',
          value: function componentWillMount() {}
          // this.getData();
          // this.getIconPosition();
  
  
          // 获取图标位置
          // getIconPosition() {
          //     HN._ajax('Watermark.Index.getDetail', { water_id: this.state.icon.water_id }, 'POST').then(res => {
          //         if (res.code == 800) {
          //             if (res.data) {
  
          //                 if (this.state.num_iids) {
          //                     this.setState({
          //                         isNeedPLJ: res.data.ix_cx
          //                     })
          //                 }
  
          //                 this.setListState('icon', {
          //                     url: res.data.pic_url,
          //                     left: res.data.left,
          //                     top: res.data.top,
          //                 })
          //             }
          //         } else {
          //             Modal.toast(res.msg);
          //         }
          //     })
          // }
  
          // setListState(list, data) {
          //     let newState = Object.assign(this.state[list], data);
          //     this.setState(newState);
          // }
  
          // // 获取10个商品-【更换宝贝】
          // getData() {
          //     HNapi.search.getOnsaleGoods({
          //         page_no: 1,
          //         page_size: 10
          //     }).then(res => {
          //         if (res.code == 800) {
          //             if (res.data.items && res.data.items.item.length > 0) {
          //                 let arr = [];
          //                 res.data.items.item.forEach((item, i) => {
          //                     arr.push(item.pic_url);
          //                 });
          //                 this.setState({
          //                     list: [...arr],
          //                     indexPic: arr[0]
          //                 });
          //             } else {
          //                 //出售中没有去仓库中找
          //                 HNapi.search.getItemsInventory({
          //                     page_no: 1,
          //                     page_size: 10
          //                 }).then(res => {
          //                     if (res.code == 800) {
          //                         if (res.data.items && res.data.items.item.length > 0) {
          //                             res.data.items.item.forEach((item, i) => {
          //                                 arr.push(item.pic_url);
          //                             });
          //                             arr.join(',');
          //                             this.setState({
          //                                 list: [...arr],
          //                             });
          //                         } else {
          //                             this.setState({
          //                                 noData: true,
          //                             });
          //                         }
          //                     }
          //                 })
          //             }
          //         }
          //     })
          // }
  
          // clickBtnSave = () => {
          //     QN.navigator.push({
          //         url: 'qap:///ZTTB-addGoods.js',
          //         query: { type: 'AddGoods' },
          //     })
          // }
  
          // changeModel = (idx) => {
          //     this.setState({
          //         model: idx
          //     })
          // }
  
          // changePic() {
          //     let list = this.state.list;
          //     let num = Math.floor(Math.random() * list.length);
          //     this.setState({
          //         indexPic: list[num]
          //     })
          // }
  
          // //改变输入框的值
          // change = (value) => {
          //     this.setState({ iptVal: value });
          // }
  
          // //投放位置
          // selectTFPosition = (idx) => {
          //     let TFPosition = this.state.TFPosition;
          //     TFPosition[idx] = TFPosition[idx] ? 0 : 1;
          //     this.setState({
          //         TFPosition: TFPosition
          //     })
          // }
  
          // //投放方式
          // selectTFMethod = (idx) => {
          //     let arr = [0, 0];
          //     arr[idx] = 2;
          //     this.setState({
          //         method: arr
          //     })
          // }
  
          // //投放时间
          // selectTFTime = (idx) => {
          //     let date = HN.setNdayDate(7);
          //     TimePicker.show({
          //         title: '请选择时间',
          //         default: idx ? date.old_day.replace(/\//g, '-') : HN.setNMinuteDate(10),
          //         type: 'datetime'
          //     }, (res) => {
          //         let time = res.replace(/\//g, '-');
          //         let _time = this.state.time;
          //         if (!idx) {
          //             let df = HN.timeDifference(date.new_day.replace(/\//g, '-'), time);
          //             if (df._date3 < 1000 * 60 * 10 - 10 * 1000) {
          //                 time = HN.setNMinuteDate(10);
          //                 Modal.toast('开始时间最早为当前时间10分钟以后');
          //             }
          //         }
  
          //         _time[idx] = time;
          //         this.setState({
          //             time: _time
          //         })
          //     });
          // }
  
          // //ajax-创建活动
          // createAct = () => {
          //     let params = {
          //         tpid: this.state.icon.water_id,
          //         act_name: this.state.iptVal,
          //     }
          //     let _arr = [];
          //     this.state.TFPosition.forEach((item, idx) => {
          //         if (item) {
          //             _arr.push(idx + 1);
          //         }
          //     })
  
          //     params.position = _arr.join(',');
          //     params.main_place = [{
          //         left: this.state.icon.left,
          //         top: this.state.icon.top,
          //     }]
  
  
          //     //800*1200下的偏移量
          //     let longLeft = 800 * this.state.icon.left / 750;
          //     let longTop = 1200 * this.state.icon.top / 750;
          //     params.long_place = [{
          //         left: longLeft,
          //         top: longTop,
          //     }]
          //     if (this.state.method[1]) {
          //         params.stime = this.state.time[0];
          //         params.etime = this.state.time[1];
          //     }
          //     QN.showLoading({
          //         query: {
          //             text: '正在创建活动 ~~'
          //         }
          //     })
          //     HN._ajax('Watermark.Index.put_manage', params, 'POST').then(res => {
          //         Modal.toast(res.msg);
          //         QN.hideLoading();
          //         if (res.code == 800) {
          //             this.linkTo(res.data);
          //         }
          //     }, err => {
          //         Modal.toast(err);
          //     })
          // }
  
          // /**
          //  * 点击地步按钮
          //  * 1、从主图跳转过来 -> 添加宝贝页面
          //  * 2、从商品管理过来 ->
          //  *      1）需要设置披露价--> 设置披露价页面
          //  *      2）不需要       --> 主图活动列表页面
          //  * @param {*} _res：商品id
          //  */
          // linkTo(act_id) {
          //     //从主图跳转过来
          //     if (this.state.num_iids) {
          //         //先查商品详情
          //         let num_iids = decodeURIComponent(this.state.num_iids);
          //         HNapi.search.getBatchGoods({
          //             num_iids: num_iids,
          //         }).then(res => {
          //             if (res.code == 800) {
          //                 if (this.state.isNeedPLJ) {//需要设置披露价
          //                     //进入设置批量价页面
          //                     QN.sessionstore.set({
          //                         query: {
          //                             pljData: {
          //                                 list: [...res.data.items.item],
          //                             }
          //                         }
          //                     }).then(result => {
          //                         QN.navigator.go({
          //                             url: 'qap:///ZTTB-addGoods.js',
          //                             query: {
          //                                 type: 'Pilujia',
          //                                 act_id: this.props.act_id
          //                             }
          //                         })
          //                     });
          //                 } else { //完成
          //                     //先创建活动，再进入活动列表页面
          //                     let params = {
          //                         act_id: act_id,
          //                     }
          //                     let _obj;
          //                     let _arr = [];
  
          //                     res.data.items.item.forEach((item, idx) => {
          //                         _obj = {};
          //                         _obj[item.num_iid] = item.price;
          //                         _arr.push(_obj);
          //                     })
          //                     params.items_info = _arr;
          //                     HN._ajax('Watermark.Index.add_goods', params, 'POST').then(res => {
          //                         QN.hideLoading();
          //                         if (res.code == 800) {
          //                             QN.sessionstore.clearSync();
          //                             QN.navigator.push({
          //                                 url: 'qap:///ZTTB-index.js',
          //                             })
  
          //                         } else {
          //                             Modal.toast(res.msg)
          //                         }
          //                     })
          //                 }
          //             } else {
          //                 Modal.toast(res.msg);
          //             }
          //         })
  
          //     } else {
          //         setTimeout(() => {
          //             QN.navigator.go({
          //                 url: 'qap:///ZTTB-addGoods.js',
          //                 query: {
          //                     type: 'AddGoods',
          //                     act_id: act_id
          //                 }
          //             })
          //         }, 500)
          //     }
          // }
  
          // // 点击完成
          // sure = (idx) => {
          //     /**
          //      * 投放方式
          //      * [2, 0]-立即投放
          //      * [0, 2]-定时投放
          //      */
          //     if (this.state.method[0]) {
          //         this.createAct();
          //     } else {
          //         //检验时间
          //         let time = this.state.time;
          //         if (time[0] == '请选择') {
          //             Modal.toast('请选择开始时间');
          //             return;
          //         } else if (time[1] == '请选择') {
          //             Modal.toast('请选择结束时间');
          //             return;
          //         } else {
          //             let df = HN.timeDifference(time[0], time[1]);
          //             if (df._date3 >= 0) {
          //                 this.createAct();
          //             } else {
          //                 Modal.toast('结束时间不能小于开始时间，请重新选择时间段');
          //             }
          //         }
          //     }
  
          // }
  
          // imageArrLoadHandler = (e) => {
          //     if (!e.size) return;
          //     this.setListState('icon', {
          //         width: e.size.naturalWidth,
          //         height: e.size.naturalHeight,
          //     })
          // }
  
      }, {
          key: 'render',
          value: function render() {
              return Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(
                  nuke__WEBPACK_IMPORTED_MODULE_1__["ScrollView"],
                  { style: [{ width: width, height: height, backgroundColor: '#ffffff' }] },
                  this.renderCon()
              );
          }
      }]);
  
      return Home;
  }(rax__WEBPACK_IMPORTED_MODULE_0__["Component"]);
  
  var styles = {
      foot: {
          position: 'fixed',
          width: 750,
          bottom: 0
      }
  };
  
  Object(rax__WEBPACK_IMPORTED_MODULE_0__["render"])(Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(Home, null));
  
  // HMR append by rax-scripts/loaders/module-hot-accept.js
  // @see https://github.com/alibaba/rax
  if (true) {
      module.hot.accept(function (err) {
          if (err) {
              console.log(err);
          } else {
              if (typeof App !== 'undefined') {
                  Object(rax__WEBPACK_IMPORTED_MODULE_0__["render"])(Object(rax__WEBPACK_IMPORTED_MODULE_0__["createElement"])(App, null));
              } else {
                  console.error('`App` components must exist!');
              }
          }
      });
  }
  
  /***/ }),
  
  /***/ "./pages/index/index2.less":
  /*!*********************************!*\
    !*** ./pages/index/index2.less ***!
    \*********************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  var _styles = {
    "top": {
      "width": 750,
      "height": 108,
      "paddingTop": "0rem",
      "paddingRight": "33rem",
      "paddingBottom": "0rem",
      "paddingLeft": "33rem",
      "flexDirection": "row",
      "justifyContent": "space-between",
      "alignItems": "center"
    },
    "model_out": {
      "borderWidth": "2rem",
      "borderStyle": "solid",
      "borderColor": "rgb(240,240,240)",
      "display": "flex",
      "borderRadius": 30,
      "flexDirection": "row",
      "alignItems": "center",
      "overflow": "hidden",
      "backgroundColor": "rgb(250,250,250)"
    },
    "model_txt": {
      "width": 171,
      "height": 60,
      "fontSize": 26,
      "color": "rgb(171,171,176)",
      "backgroundColor": "rgb(250,250,250)",
      "textAlign": "center",
      "lineHeight": "60rem"
    },
    "model_select": {
      "borderRadius": 30,
      "backgroundColor": "rgb(110,110,225)",
      "color": "rgb(255,255,255)"
    },
    "changeGood": {
      "color": "rgb(110,110,225)",
      "alignItems": "center",
      "fontSize": 26
    },
    "tryAgain": {
      "fontSize": 21,
      "paddingLeft": 5,
      "color": "rgb(110,110,225)"
    },
    "pic": {
      "width": 750,
      "height": 750,
      "position": "relative"
    },
    "itemPic": {
      "width": 750,
      "height": 750
    },
    "fucengL": {
      "width": 105,
      "height": 750,
      "position": "absolute",
      "backgroundColor": "rgb(250,250,250)",
      "top": 0,
      "right": 0
    },
    "fucengR": {
      "width": 105,
      "height": 750,
      "position": "absolute",
      "backgroundColor": "rgb(250,250,250)",
      "top": 0,
      "left": 0
    },
    "icon": {
      "position": "absolute"
    },
    "item": {
      "marginLeft": 32,
      "paddingTop": "25rem",
      "paddingRight": "0rem",
      "paddingBottom": "25rem",
      "paddingLeft": "0rem",
      "flexDirection": "row",
      "alignItems": "center",
      "borderBottomWidth": "1rem",
      "borderBottomStyle": "solid",
      "borderBottomColor": "rgb(240,240,240)"
    },
    "title": {
      "color": "rgb(165,165,170)",
      "paddingRight": 24,
      "fontSize": 28
    },
    "ipt": {
      "position": "relative"
    },
    "input_name": {
      "width": 544,
      "height": 72,
      "borderRadius": 5,
      "textIndent": 12,
      "fontSize": 28,
      "color": "rgb(44,44,48)"
    },
    "txtRange": {
      "position": "absolute",
      "right": 12,
      "top": 22,
      "fontSize": 23,
      "color": "rgb(165,165,170)"
    },
    "TFPosition": {
      "width": 80,
      "height": 80,
      "position": "relative",
      "marginRight": 12
    },
    "TFPosition_icon": {
      "width": 22,
      "height": 22,
      "position": "absolute",
      "right": 3,
      "bottom": 3
    },
    "p_item_txt": {
      "width": 80,
      "height": 80,
      "borderWidth": "1rem",
      "borderStyle": "solid",
      "borderColor": "rgb(224,224,224)",
      "textAlign": "center",
      "lineHeight": "80rem",
      "fontSize": 23,
      "color": "rgb(44,44,48)"
    },
    "p_item_select": {
      "borderWidth": "4rem",
      "borderStyle": "solid",
      "borderColor": "rgb(110,110,225)",
      "color": "rgb(110,110,225)",
      "lineHeight": "74rem"
    },
    "method": {
      "flexDirection": "row",
      "alignItems": "center"
    },
    "method_txt": {
      "fontSize": 28,
      "color": "rgb(44,44,48)"
    },
    "CheckBox": {
      "paddingRight": 33,
      "paddingTop": 4
    },
    "pageB": {
      "fontSize": 20,
      "color": "rgb(165,165,170)",
      "marginLeft": 440
    },
    "foot": {
      "width": 750,
      "height": 88,
      "backgroundColor": "rgb(110,110,225)",
      "position": "fixed",
      "bottom": 0,
      "left": 0,
      "justifyContent": "center",
      "alignItems": "center"
    },
    "foot_txt": {
      "color": "rgb(255,255,255)",
      "fontSize": 30
    }
  };
    
    
    
    if (true) {
      console.warn('line: 89, column: 3 - "text-indent: 12" is not valid in ".input_name" selector\n');
    }
      
    module.exports = _styles;
    
  
  /***/ }),
  
  /***/ 0:
  /*!***************************************************************************************************************************************************************************************************************************************************!*\
    !*** multi /Users/yangpeizhi/.fie/node_modules/_@ali_fie-toolkit-nuke@0.8.5@@ali/fie-toolkit-nuke/lib/hot-dev-utils/webpackHotDevClient.js /Users/yangpeizhi/.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/patch.js ./pages/index/index ***!
    \***************************************************************************************************************************************************************************************************************************************************/
  /*! no static exports found */
  /***/ (function(module, exports, __webpack_require__) {
  
  __webpack_require__(/*! /Users/yangpeizhi/.fie/node_modules/_@ali_fie-toolkit-nuke@0.8.5@@ali/fie-toolkit-nuke/lib/hot-dev-utils/webpackHotDevClient.js */"../../../../.fie/node_modules/_@ali_fie-toolkit-nuke@0.8.5@@ali/fie-toolkit-nuke/lib/hot-dev-utils/webpackHotDevClient.js");
  __webpack_require__(/*! /Users/yangpeizhi/.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/patch.js */"../../../../.fie/node_modules/_rax-hot-loader@0.6.5@rax-hot-loader/patch.js");
  module.exports = __webpack_require__(/*! ./pages/index/index */"./pages/index/index.jsx");
  
  
  /***/ }),
  
  /***/ "QAP-SDK":
  /*!**************************!*\
    !*** external "QAP-SDK" ***!
    \**************************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  module.exports = require("QAP-SDK");
  
  /***/ }),
  
  /***/ "nuke":
  /*!***********************!*\
    !*** external "nuke" ***!
    \***********************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  debugger;
  module.exports = require("nuke");
  
  /***/ }),
  
  /***/ "rax":
  /*!**********************!*\
    !*** external "rax" ***!
    \**********************/
  /*! no static exports found */
  /***/ (function(module, exports) {
  
  module.exports = require("rax");
  
  /***/ })
  
  /******/ })}); require("index");;
  //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4uLy4uLy4uLy5maWUvbm9kZV9tb2R1bGVzL19AYWxpX2ZpZS10b29sa2l0LW51a2VAMC44LjVAQGFsaS9maWUtdG9vbGtpdC1udWtlL2xpYi9ob3QtZGV2LXV0aWxzL2Zvcm1hdFdlYnBhY2tNZXNzYWdlcy5qcyIsIndlYnBhY2s6Ly8vLi4vLi4vLi4vLmZpZS9ub2RlX21vZHVsZXMvX0BhbGlfZmllLXRvb2xraXQtbnVrZUAwLjguNUBAYWxpL2ZpZS10b29sa2l0LW51a2UvbGliL2hvdC1kZXYtdXRpbHMvd2VicGFja0hvdERldkNsaWVudC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2dsb2JhbEA0LjMuMkBnbG9iYWwvd2luZG93LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19EYXRhVmlldy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fSGFzaC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fTGlzdENhY2hlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19NYXAuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX01hcENhY2hlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19Qcm9taXNlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19TZXQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX1NldENhY2hlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19TdGFjay5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fU3ltYm9sLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19VaW50OEFycmF5LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19XZWFrTWFwLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19hcHBseS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYXJyYXlGaWx0ZXIuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2FycmF5SW5jbHVkZXMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2FycmF5SW5jbHVkZXNXaXRoLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19hcnJheU1hcC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYXJyYXlQdXNoLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19hcnJheVNvbWUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYmFzZURpZmZlcmVuY2UuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VGaW5kSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VGbGF0dGVuLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlR2V0LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlR2V0QWxsS2V5cy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYmFzZUdldFRhZy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYmFzZUhhc0luLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlSW5kZXhPZi5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlSXNFcXVhbC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYmFzZUlzRXF1YWxEZWVwLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlSXNNYXRjaC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYmFzZUlzTmFOLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VJdGVyYXRlZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYmFzZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VNYXRjaGVzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VQcm9wZXJ0eURlZXAuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VSZXN0LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlU2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fYmFzZVRvU3RyaW5nLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19iYXNlVW5hcnkuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2NhY2hlSGFzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19jYXN0UGF0aC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fY29weU9iamVjdC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fY29yZUpzRGF0YS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fY3JlYXRlQXNzaWduZXIuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2NyZWF0ZUZpbmQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2RlZmluZVByb3BlcnR5LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19lcXVhbEFycmF5cy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fZXF1YWxCeVRhZy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fZXF1YWxPYmplY3RzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19nZXRBbGxLZXlzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19nZXRNYXBEYXRhLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19nZXRNYXRjaERhdGEuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fZ2V0UmF3VGFnLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19nZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2dldFZhbHVlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19oYXNQYXRoLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19oYXNoQ2xlYXIuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2hhc2hEZWxldGUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2hhc2hHZXQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2hhc2hIYXMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2hhc2hTZXQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2lzRmxhdHRlbmFibGUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2lzSXRlcmF0ZWVDYWxsLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19pc0tleS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9faXNLZXlhYmxlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19pc01hc2tlZC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9faXNQcm90b3R5cGUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2lzU3RyaWN0Q29tcGFyYWJsZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fbGlzdENhY2hlQ2xlYXIuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX2xpc3RDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX21hcENhY2hlR2V0LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX21hcFRvQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19tZW1vaXplQ2FwcGVkLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19uYXRpdmVDcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX25hdGl2ZUtleXMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX25vZGVVdGlsLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fb3ZlckFyZy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fb3ZlclJlc3QuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX3Jvb3QuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX3NldENhY2hlQWRkLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19zZXRDYWNoZUhhcy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fc2V0VG9BcnJheS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX3Nob3J0T3V0LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19zdGFja0NsZWFyLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19zdGFja0RlbGV0ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fc3RhY2tHZXQuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvX3N0YWNrSGFzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL19zdGFja1NldC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fc3RyaWN0SW5kZXhPZi5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL190b0tleS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9fdG9Tb3VyY2UuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvYXNzaWduLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL2NvbnN0YW50LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL2RpZmZlcmVuY2UuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvZXEuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvZmluZC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9maW5kSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvZ2V0LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL2hhc0luLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL2lkZW50aXR5LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL2lzQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvaXNBcnJheUxpa2UuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvaXNBcnJheUxpa2VPYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvaXNCdWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9pc09iamVjdExpa2UuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvaXNTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL2tleXMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvbWVtb2l6ZS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC9zdHViQXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19sb2Rhc2hANC4xNy4xMEBsb2Rhc2gvc3R1YkZhbHNlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL3RvRmluaXRlLmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fbG9kYXNoQDQuMTcuMTBAbG9kYXNoL3RvSW50ZWdlci5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC90b051bWJlci5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX2xvZGFzaEA0LjE3LjEwQGxvZGFzaC90b1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX3JheC1ob3QtbG9hZGVyQDAuNi41QHJheC1ob3QtbG9hZGVyL2xpYi9wYXRjaC5kZXYuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19yYXgtaG90LWxvYWRlckAwLjYuNUByYXgtaG90LWxvYWRlci9saWIvcGF0Y2guanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19yYXgtaG90LWxvYWRlckAwLjYuNUByYXgtaG90LWxvYWRlci9wYXRjaC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX3JlYWN0LWRlZXAtZm9yY2UtdXBkYXRlQDEuMS4xQHJlYWN0LWRlZXAtZm9yY2UtdXBkYXRlL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX3JlYWN0LXByb3h5QDEuMS44QHJlYWN0LXByb3h5L21vZHVsZXMvYmluZEF1dG9CaW5kTWV0aG9kcy5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX3JlYWN0LXByb3h5QDEuMS44QHJlYWN0LXByb3h5L21vZHVsZXMvY3JlYXRlQ2xhc3NQcm94eS5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3lhbmdwZWl6aGkvLmZpZS9ub2RlX21vZHVsZXMvX3JlYWN0LXByb3h5QDEuMS44QHJlYWN0LXByb3h5L21vZHVsZXMvY3JlYXRlUHJvdG90eXBlUHJveHkuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19yZWFjdC1wcm94eUAxLjEuOEByZWFjdC1wcm94eS9tb2R1bGVzL2RlbGV0ZVVua25vd25BdXRvQmluZE1ldGhvZHMuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy95YW5ncGVpemhpLy5maWUvbm9kZV9tb2R1bGVzL19yZWFjdC1wcm94eUAxLjEuOEByZWFjdC1wcm94eS9tb2R1bGVzL2luZGV4LmpzIiwid2VicGFjazovLy8vVXNlcnMveWFuZ3BlaXpoaS8uZmllL25vZGVfbW9kdWxlcy9fcmVhY3QtcHJveHlAMS4xLjhAcmVhY3QtcHJveHkvbW9kdWxlcy9zdXBwb3J0c1Byb3RvQXNzaWdubWVudC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vL3NyYy9wYWdlcy9pbmRleC9pbmRleC5qc3giLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvaW5kZXgvaW5kZXgyLmxlc3MiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiUUFQLVNES1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm51a2VcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyYXhcIiJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gd2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XG4gXHRcdGlmIChwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xuIFx0fSA7XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XG4gXHRcdDtcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHtcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcbiBcdFx0XHR9XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XG4gXHRcdFx0XHRcdHJlamVjdChcbiBcdFx0XHRcdFx0XHRuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpXG4gXHRcdFx0XHRcdCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCIwNTAyMTdjNjY2OGJmODA3ZWUxMlwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG4gXHRcdFx0XHRcdFx0cmVxdWVzdCArXG4gXHRcdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0KTtcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xuIFx0XHR9O1xuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XG4gXHRcdFx0XHR9LFxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fTtcbiBcdFx0Zm9yICh2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcImVcIiAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJ0XCJcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKSBob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xuIFx0XHRcdFx0dGhyb3cgZXJyO1xuIFx0XHRcdH0pO1xuXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xuIFx0XHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcbiBcdFx0XHRcdFx0aWYgKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdGZuLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRcdGlmIChtb2RlICYgMSkgdmFsdWUgPSBmbih2YWx1ZSk7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18udCh2YWx1ZSwgbW9kZSAmIH4xKTtcbiBcdFx0fTtcbiBcdFx0cmV0dXJuIGZuO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgaG90ID0ge1xuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXG5cbiBcdFx0XHQvLyBNb2R1bGUgQVBJXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIikgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGlmICghbCkgcmV0dXJuIGhvdFN0YXR1cztcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cbiBcdFx0fTtcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuIFx0XHRyZXR1cm4gaG90O1xuIFx0fVxuXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcblxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XG4gXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuIFx0fVxuXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdERlZmVycmVkO1xuXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcbiBcdFx0dmFyIGlzTnVtYmVyID0gK2lkICsgXCJcIiA9PT0gaWQ7XG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcImlkbGVcIikge1xuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHR9XG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xuIFx0XHRcdGlmICghdXBkYXRlKSB7XG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRcdFx0cmV0dXJuIG51bGw7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XG5cbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0aG90VXBkYXRlID0ge307XG4gXHRcdFx0dmFyIGNodW5rSWQgPSBcImluZGV4XCI7XG4gXHRcdFx0e1xuIFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xuIFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG4gXHRcdFx0KTtcbiBcdFx0fTtcblxuIFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xuIFx0XHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuIFx0XHRcdFx0dmFyIHJlc3VsdDtcbiBcdFx0XHRcdGlmIChob3RVcGRhdGVbaWRdKSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0KVxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoY2IpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYnVpbGQvXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gV0FSTklORzogdGhpcyBjb2RlIGlzIHVudHJhbnNwaWxlZCBhbmQgaXMgdXNlZCBpbiBicm93c2VyIHRvby5cbi8vIFBsZWFzZSBtYWtlIHN1cmUgYW55IGNoYW5nZXMgYXJlIGluIEVTNSBvciBjb250cmlidXRlIGEgQmFiZWwgY29tcGlsZSBzdGVwLlxuXG4vLyBTb21lIGN1c3RvbSB1dGlsaXRpZXMgdG8gcHJldHRpZnkgV2VicGFjayBvdXRwdXQuXG4vLyBUaGlzIGlzIHF1aXRlIGhhY2t5IGFuZCBob3BlZnVsbHkgd29uJ3QgYmUgbmVlZGVkIHdoZW4gV2VicGFjayBmaXhlcyB0aGlzLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2svd2VicGFjay9pc3N1ZXMvMjg3OFxuXG4vLyB2YXIgY2hhbGsgPSByZXF1aXJlKCdjaGFsaycpO1xuXG52YXIgZnJpZW5kbHlTeW50YXhFcnJvckxhYmVsID0gJ1N5bnRheCBlcnJvcjonO1xuXG5mdW5jdGlvbiBpc0xpa2VseUFTeW50YXhFcnJvcihtZXNzYWdlKSB7XG4gIHJldHVybiBtZXNzYWdlLmluZGV4T2YoZnJpZW5kbHlTeW50YXhFcnJvckxhYmVsKSAhPT0gLTE7XG59XG5cbi8vIENsZWFucyB1cCB3ZWJwYWNrIGVycm9yIG1lc3NhZ2VzLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5mdW5jdGlvbiBmb3JtYXRNZXNzYWdlKG1lc3NhZ2UsIGlzRXJyb3IpIHtcbiAgdmFyIGxpbmVzID0gbWVzc2FnZS5zcGxpdCgnXFxuJyk7XG5cbiAgaWYgKGxpbmVzLmxlbmd0aCA+IDIgJiYgbGluZXNbMV0gPT09ICcnKSB7XG4gICAgLy8gUmVtb3ZlIGV4dHJhIG5ld2xpbmUuXG4gICAgbGluZXMuc3BsaWNlKDEsIDEpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHdlYnBhY2stc3BlY2lmaWMgbG9hZGVyIG5vdGF0aW9uIGZyb20gZmlsZW5hbWUuXG4gIC8vIEJlZm9yZTpcbiAgLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vc3JjL0FwcC5jc3NcbiAgLy8gQWZ0ZXI6XG4gIC8vIC4vc3JjL0FwcC5jc3NcbiAgaWYgKGxpbmVzWzBdLmxhc3RJbmRleE9mKCchJykgIT09IC0xKSB7XG4gICAgbGluZXNbMF0gPSBsaW5lc1swXS5zdWJzdHIobGluZXNbMF0ubGFzdEluZGV4T2YoJyEnKSArIDEpO1xuICB9XG5cbiAgbGluZXMgPSBsaW5lcy5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgIC8vIFdlYnBhY2sgYWRkcyBhIGxpc3Qgb2YgZW50cnkgcG9pbnRzIHRvIHdhcm5pbmcgbWVzc2FnZXM6XG4gICAgLy8gIEAgLi9zcmMvaW5kZXguanNcbiAgICAvLyAgQCBtdWx0aSByZWFjdC1zY3JpcHRzL34vcmVhY3QtZGV2LXV0aWxzL3dlYnBhY2tIb3REZXZDbGllbnQuanMgLi4uXG4gICAgLy8gSXQgaXMgbWlzbGVhZGluZyAoYW5kIHVucmVsYXRlZCB0byB0aGUgd2FybmluZ3MpIHNvIHdlIGNsZWFuIGl0IHVwLlxuICAgIC8vIEl0IGlzIG9ubHkgdXNlZnVsIGZvciBzeW50YXggZXJyb3JzIGJ1dCB3ZSBoYXZlIGJlYXV0aWZ1bCBmcmFtZXMgZm9yIHRoZW0uXG4gICAgcmV0dXJuIGxpbmUuaW5kZXhPZignIEAgJykgIT09IDA7XG4gIH0pO1xuXG4gIC8vIGxpbmUgIzAgaXMgZmlsZW5hbWVcbiAgLy8gbGluZSAjMSBpcyB0aGUgbWFpbiBlcnJvciBtZXNzYWdlXG4gIGlmICghbGluZXNbMF0gfHwgIWxpbmVzWzFdKSB7XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgLy8gQ2xlYW5zIHVwIHZlcmJvc2UgXCJtb2R1bGUgbm90IGZvdW5kXCIgbWVzc2FnZXMgZm9yIGZpbGVzIGFuZCBwYWNrYWdlcy5cbiAgaWYgKGxpbmVzWzFdLmluZGV4T2YoJ01vZHVsZSBub3QgZm91bmQ6ICcpID09PSAwKSB7XG4gICAgbGluZXMgPSBbXG4gICAgICBsaW5lc1swXSxcbiAgICAgIC8vIENsZWFuIHVwIG1lc3NhZ2UgYmVjYXVzZSBcIk1vZHVsZSBub3QgZm91bmQ6IFwiIGlzIGRlc2NyaXB0aXZlIGVub3VnaC5cbiAgICAgIGxpbmVzWzFdXG4gICAgICAgIC5yZXBsYWNlKFwiQ2Fubm90IHJlc29sdmUgJ2ZpbGUnIG9yICdkaXJlY3RvcnknIFwiLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ0Nhbm5vdCByZXNvbHZlIG1vZHVsZSAnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ0Vycm9yOiAnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ1tDYXNlU2Vuc2l0aXZlUGF0aHNQbHVnaW5dICcsICcnKVxuICAgIF07XG4gIH1cblxuICAvLyBDbGVhbnMgdXAgc3ludGF4IGVycm9yIG1lc3NhZ2VzLlxuICBpZiAobGluZXNbMV0uaW5kZXhPZignTW9kdWxlIGJ1aWxkIGZhaWxlZDogJykgPT09IDApIHtcbiAgICBsaW5lc1sxXSA9IGxpbmVzWzFdLnJlcGxhY2UoXG4gICAgICAnTW9kdWxlIGJ1aWxkIGZhaWxlZDogU3ludGF4RXJyb3I6JyxcbiAgICAgIGZyaWVuZGx5U3ludGF4RXJyb3JMYWJlbFxuICAgICk7XG4gIH1cblxuICAvLyBDbGVhbiB1cCBleHBvcnQgZXJyb3JzLlxuICAvLyBUT0RPOiB3ZSBzaG91bGQgcmVhbGx5IHNlbmQgYSBQUiB0byBXZWJwYWNrIGZvciB0aGlzLlxuICB2YXIgZXhwb3J0RXJyb3IgPSAvXFxzKiguKz8pXFxzKihcIik/ZXhwb3J0ICcoLis/KScgd2FzIG5vdCBmb3VuZCBpbiAnKC4rPyknLztcbiAgaWYgKGxpbmVzWzFdLm1hdGNoKGV4cG9ydEVycm9yKSkge1xuICAgIGxpbmVzWzFdID0gbGluZXNbMV0ucmVwbGFjZShcbiAgICAgIGV4cG9ydEVycm9yLFxuICAgICAgXCIkMSAnJDQnIGRvZXMgbm90IGNvbnRhaW4gYW4gZXhwb3J0IG5hbWVkICckMycuXCJcbiAgICApO1xuICB9XG5cbiAgLy8gbGluZXNbMF0gPSBjaGFsay5pbnZlcnNlKGxpbmVzWzBdKTtcblxuICAvLyBSZWFzc2VtYmxlIHRoZSBtZXNzYWdlLlxuICBtZXNzYWdlID0gbGluZXMuam9pbignXFxuJyk7XG4gIC8vIEludGVybmFsIHN0YWNrcyBhcmUgZ2VuZXJhbGx5IHVzZWxlc3Mgc28gd2Ugc3RyaXAgdGhlbS4uLiB3aXRoIHRoZVxuICAvLyBleGNlcHRpb24gb2Ygc3RhY2tzIGNvbnRhaW5pbmcgYHdlYnBhY2s6YCBiZWNhdXNlIHRoZXkncmUgbm9ybWFsbHlcbiAgLy8gZnJvbSB1c2VyIGNvZGUgZ2VuZXJhdGVkIGJ5IFdlYlBhY2suIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2tpbmN1YmF0b3IvY3JlYXRlLXJlYWN0LWFwcC9wdWxsLzEwNTBcbiAgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShcbiAgICAvXlxccyphdFxccygoPyF3ZWJwYWNrOikuKSo6XFxkKzpcXGQrW1xcc1xcKV0qKFxcbnwkKS9nbSxcbiAgICAnJ1xuICApOyAvLyBhdCAuLi4gLi4uOng6eVxuXG4gIHJldHVybiBtZXNzYWdlLnRyaW0oKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0V2VicGFja01lc3NhZ2VzKGpzb24pIHtcbiAgdmFyIGZvcm1hdHRlZEVycm9ycyA9IGpzb24uZXJyb3JzLm1hcChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgcmV0dXJuIGZvcm1hdE1lc3NhZ2UobWVzc2FnZSwgdHJ1ZSk7XG4gIH0pO1xuICB2YXIgZm9ybWF0dGVkV2FybmluZ3MgPSBqc29uLndhcm5pbmdzLm1hcChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgcmV0dXJuIGZvcm1hdE1lc3NhZ2UobWVzc2FnZSwgZmFsc2UpO1xuICB9KTtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBlcnJvcnM6IGZvcm1hdHRlZEVycm9ycyxcbiAgICB3YXJuaW5nczogZm9ybWF0dGVkV2FybmluZ3NcbiAgfTtcbiAgaWYgKHJlc3VsdC5lcnJvcnMuc29tZShpc0xpa2VseUFTeW50YXhFcnJvcikpIHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgYW55IHN5bnRheCBlcnJvcnMsIHNob3cganVzdCB0aGVtLlxuICAgIC8vIFRoaXMgcHJldmVudHMgYSBjb25mdXNpbmcgRVNMaW50IHBhcnNpbmcgZXJyb3JcbiAgICAvLyBwcmVjZWRpbmcgYSBtdWNoIG1vcmUgdXNlZnVsIEJhYmVsIHN5bnRheCBlcnJvci5cbiAgICByZXN1bHQuZXJyb3JzID0gcmVzdWx0LmVycm9ycy5maWx0ZXIoaXNMaWtlbHlBU3ludGF4RXJyb3IpO1xuICB9XG4gIC8vIE9ubHkga2VlcCB0aGUgZmlyc3QgZXJyb3IuIE90aGVycyBhcmUgb2Z0ZW4gaW5kaWNhdGl2ZVxuICAvLyBvZiB0aGUgc2FtZSBwcm9ibGVtLCBidXQgY29uZnVzZSB0aGUgcmVhZGVyIHdpdGggbm9pc2UuXG4gIGlmIChyZXN1bHQuZXJyb3JzLmxlbmd0aCA+IDEpIHtcbiAgICByZXN1bHQuZXJyb3JzLmxlbmd0aCA9IDE7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRXZWJwYWNrTWVzc2FnZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIHZhciBzdHJpcEFuc2kgPSByZXF1aXJlKCdzdHJpcC1hbnNpJyk7XG52YXIgZm9ybWF0V2VicGFja01lc3NhZ2VzID0gcmVxdWlyZSgnLi9mb3JtYXRXZWJwYWNrTWVzc2FnZXMnKTtcblxudmFyIHdzVXJsID0gYHdzOi8vJHt3aW5kb3cubG9jYXRpb24uaG9zdG5hbWV9OiR7d2luZG93LmxvY2F0aW9uXG4gIC5wb3J0fS9zb2NranMtbm9kZS93ZWJzb2NrZXRgO1xuLy8gQ29ubmVjdCB0byBXZWJwYWNrRGV2U2VydmVyIHZpYSBhIHNvY2tldC5cbmNvbnNvbGUubG9nKCdUaGUgZGV2ZWxvcG1lbnQgc2VydmVyIGF0Jywgd3NVcmwpO1xudmFyIGNvbm5lY3Rpb24gPSBuZXcgV2ViU29ja2V0KHdzVXJsKTtcblxuLy8gVW5saWtlIFdlYnBhY2tEZXZTZXJ2ZXIgY2xpZW50LCB3ZSB3b24ndCB0cnkgdG8gcmVjb25uZWN0XG4vLyB0byBhdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZS4gRGlzY29ubmVjdCB1c3VhbGx5IGhhcHBlbnNcbi8vIHdoZW4gZGV2ZWxvcGVyIHN0b3BzIHRoZSBzZXJ2ZXIuXG5jb25uZWN0aW9uLm9uY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5pbmZvKFxuICAgICdUaGUgZGV2ZWxvcG1lbnQgc2VydmVyIGhhcyBkaXNjb25uZWN0ZWQuXFxuUmVmcmVzaCB0aGUgcGFnZSBpZiBuZWNlc3NhcnkuJ1xuICApO1xufTtcblxuY29ubmVjdGlvbi5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5pbmZvKCdUaGUgZGV2ZWxvcG1lbnQgc2VydmVyIGhhcyBjb25uZWN0ZWQhJyk7XG59O1xuXG5jb25uZWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcbiAgY29uc29sZS5pbmZvKCdUaGUgZGV2ZWxvcG1lbnQgc2VydmVyIGNvbm5lY3QgZmFpbGQhJyk7XG59O1xuXG4vLyBSZW1lbWJlciBzb21lIHN0YXRlIHJlbGF0ZWQgdG8gaG90IG1vZHVsZSByZXBsYWNlbWVudC5cbnZhciBpc0ZpcnN0Q29tcGlsYXRpb24gPSB0cnVlO1xudmFyIG1vc3RSZWNlbnRDb21waWxhdGlvbkhhc2ggPSBudWxsO1xudmFyIGhhc0NvbXBpbGVFcnJvcnMgPSBmYWxzZTtcblxuZnVuY3Rpb24gY2xlYXJPdXRkYXRlZEVycm9ycygpIHtcbiAgLy8gQ2xlYW4gdXAgb3V0ZGF0ZWQgY29tcGlsZSBlcnJvcnMsIGlmIGFueS5cbiAgaWYgKGhhc0NvbXBpbGVFcnJvcnMgJiYgdHlwZW9mIGNvbnNvbGUuY2xlYXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zb2xlLmNsZWFyKCk7XG4gIH1cbn1cblxuLy8gU3VjY2Vzc2Z1bCBjb21waWxhdGlvbi5cbmZ1bmN0aW9uIGhhbmRsZVN1Y2Nlc3MoKSB7XG4gIGNsZWFyT3V0ZGF0ZWRFcnJvcnMoKTtcblxuICB2YXIgaXNIb3RVcGRhdGUgPSAhaXNGaXJzdENvbXBpbGF0aW9uO1xuICBpc0ZpcnN0Q29tcGlsYXRpb24gPSBmYWxzZTtcbiAgaGFzQ29tcGlsZUVycm9ycyA9IGZhbHNlO1xuXG4gIC8vIEF0dGVtcHQgdG8gYXBwbHkgaG90IHVwZGF0ZXMgb3IgcmVsb2FkLlxuICBpZiAoaXNIb3RVcGRhdGUpIHtcbiAgICB0cnlBcHBseVVwZGF0ZXMoZnVuY3Rpb24gb25Ib3RVcGRhdGVTdWNjZXNzKCkge1xuICAgICAgLy8gT25seSBkZXN0cm95IGl0IHdoZW4gd2UncmUgc3VyZSBpdCdzIGEgaG90IHVwZGF0ZS5cbiAgICAgIC8vIE90aGVyd2lzZSBpdCB3b3VsZCBmbGlja2VyIHJpZ2h0IGJlZm9yZSB0aGUgcmVsb2FkLlxuICAgIH0pO1xuICB9XG59XG5cbi8vIENvbXBpbGF0aW9uIHdpdGggd2FybmluZ3MgKGUuZy4gRVNMaW50KS5cbmZ1bmN0aW9uIGhhbmRsZVdhcm5pbmdzKHdhcm5pbmdzKSB7XG4gIGNsZWFyT3V0ZGF0ZWRFcnJvcnMoKTtcblxuICB2YXIgaXNIb3RVcGRhdGUgPSAhaXNGaXJzdENvbXBpbGF0aW9uO1xuICBpc0ZpcnN0Q29tcGlsYXRpb24gPSBmYWxzZTtcbiAgaGFzQ29tcGlsZUVycm9ycyA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIHByaW50V2FybmluZ3MoKSB7XG4gICAgLy8gUHJpbnQgd2FybmluZ3MgdG8gdGhlIGNvbnNvbGUuXG4gICAgdmFyIGZvcm1hdHRlZCA9IGZvcm1hdFdlYnBhY2tNZXNzYWdlcyh7XG4gICAgICB3YXJuaW5nczogd2FybmluZ3MsXG4gICAgICBlcnJvcnM6IFtdXG4gICAgfSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZvcm1hdHRlZC53YXJuaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc29sZS53YXJuKGZvcm1hdHRlZC53YXJuaW5nc1tpXSk7XG4gICAgICAvLyBjb25zb2xlLndhcm4oc3RyaXBBbnNpKGZvcm1hdHRlZC53YXJuaW5nc1tpXSkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEF0dGVtcHQgdG8gYXBwbHkgaG90IHVwZGF0ZXMgb3IgcmVsb2FkLlxuICBpZiAoaXNIb3RVcGRhdGUpIHtcbiAgICB0cnlBcHBseVVwZGF0ZXMoZnVuY3Rpb24gb25TdWNjZXNzZnVsSG90VXBkYXRlKCkge1xuICAgICAgLy8gT25seSBwcmludCB3YXJuaW5ncyBpZiB3ZSBhcmVuJ3QgcmVmcmVzaGluZyB0aGUgcGFnZS5cbiAgICAgIC8vIE90aGVyd2lzZSB0aGV5J2xsIGRpc2FwcGVhciByaWdodCBhd2F5IGFueXdheS5cbiAgICAgIHByaW50V2FybmluZ3MoKTtcbiAgICAgIC8vIE9ubHkgZGVzdHJveSBpdCB3aGVuIHdlJ3JlIHN1cmUgaXQncyBhIGhvdCB1cGRhdGUuXG4gICAgICAvLyBPdGhlcndpc2UgaXQgd291bGQgZmxpY2tlciByaWdodCBiZWZvcmUgdGhlIHJlbG9hZC5cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBQcmludCBpbml0aWFsIHdhcm5pbmdzIGltbWVkaWF0ZWx5LlxuICAgIHByaW50V2FybmluZ3MoKTtcbiAgfVxufVxuXG4vLyBDb21waWxhdGlvbiB3aXRoIGVycm9ycyAoZS5nLiBzeW50YXggZXJyb3Igb3IgbWlzc2luZyBtb2R1bGVzKS5cbmZ1bmN0aW9uIGhhbmRsZUVycm9ycyhlcnJvcnMpIHtcbiAgY2xlYXJPdXRkYXRlZEVycm9ycygpO1xuXG4gIGlzRmlyc3RDb21waWxhdGlvbiA9IGZhbHNlO1xuICBoYXNDb21waWxlRXJyb3JzID0gdHJ1ZTtcblxuICAvLyBcIk1hc3NhZ2VcIiB3ZWJwYWNrIG1lc3NhZ2VzLlxuICB2YXIgZm9ybWF0dGVkID0gZm9ybWF0V2VicGFja01lc3NhZ2VzKHtcbiAgICBlcnJvcnM6IGVycm9ycyxcbiAgICB3YXJuaW5nczogW11cbiAgfSk7XG5cbiAgLy8gQWxzbyBsb2cgdGhlbSB0byB0aGUgY29uc29sZS5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb3JtYXR0ZWQuZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc29sZS5lcnJvcihmb3JtYXR0ZWQuZXJyb3JzW2ldKTtcbiAgICAvLyBjb25zb2xlLmVycm9yKHN0cmlwQW5zaShmb3JtYXR0ZWQuZXJyb3JzW2ldKSk7XG4gIH1cblxuICAvLyBEbyBub3QgYXR0ZW1wdCB0byByZWxvYWQgbm93LlxuICAvLyBXZSB3aWxsIHJlbG9hZCBvbiBuZXh0IHN1Y2Nlc3MgaW5zdGVhZC5cbn1cblxuLy8gVGhlcmUgaXMgYSBuZXdlciB2ZXJzaW9uIG9mIHRoZSBjb2RlIGF2YWlsYWJsZS5cbmZ1bmN0aW9uIGhhbmRsZUF2YWlsYWJsZUhhc2goaGFzaCkge1xuICAvLyBVcGRhdGUgbGFzdCBrbm93biBjb21waWxhdGlvbiBoYXNoLlxuICBtb3N0UmVjZW50Q29tcGlsYXRpb25IYXNoID0gaGFzaDtcbn1cblxuLy8gSGFuZGxlIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlci5cbmNvbm5lY3Rpb24ub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICB2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICBjYXNlICdoYXNoJzpcbiAgICAgIGhhbmRsZUF2YWlsYWJsZUhhc2gobWVzc2FnZS5kYXRhKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0aWxsLW9rJzpcbiAgICBjYXNlICdvayc6XG4gICAgICBoYW5kbGVTdWNjZXNzKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjb250ZW50LWNoYW5nZWQnOlxuICAgICAgLy8gVHJpZ2dlcmVkIHdoZW4gYSBmaWxlIGZyb20gYGNvbnRlbnRCYXNlYCBjaGFuZ2VkLlxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnd2FybmluZ3MnOlxuICAgICAgaGFuZGxlV2FybmluZ3MobWVzc2FnZS5kYXRhKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Vycm9ycyc6XG4gICAgICBoYW5kbGVFcnJvcnMobWVzc2FnZS5kYXRhKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgLy8gRG8gbm90aGluZy5cbiAgfVxufTtcblxuLy8gSXMgdGhlcmUgYSBuZXdlciB2ZXJzaW9uIG9mIHRoaXMgY29kZSBhdmFpbGFibGU/XG5mdW5jdGlvbiBpc1VwZGF0ZUF2YWlsYWJsZSgpIHtcbiAgLyogZ2xvYmFscyBfX3dlYnBhY2tfaGFzaF9fICovXG4gIC8vIF9fd2VicGFja19oYXNoX18gaXMgdGhlIGhhc2ggb2YgdGhlIGN1cnJlbnQgY29tcGlsYXRpb24uXG4gIC8vIEl0J3MgYSBnbG9iYWwgdmFyaWFibGUgaW5qZWN0ZWQgYnkgV2VicGFjay5cbiAgcmV0dXJuIG1vc3RSZWNlbnRDb21waWxhdGlvbkhhc2ggIT09IF9fd2VicGFja19oYXNoX187XG59XG5cbi8vIFdlYnBhY2sgZGlzYWxsb3dzIHVwZGF0ZXMgaW4gb3RoZXIgc3RhdGVzLlxuZnVuY3Rpb24gY2FuQXBwbHlVcGRhdGVzKCkge1xuICByZXR1cm4gbW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gJ2lkbGUnO1xufVxuXG4vLyBBdHRlbXB0IHRvIHVwZGF0ZSBjb2RlIG9uIHRoZSBmbHksIGZhbGwgYmFjayB0byBhIGhhcmQgcmVsb2FkLlxuZnVuY3Rpb24gdHJ5QXBwbHlVcGRhdGVzKG9uSG90VXBkYXRlU3VjY2Vzcykge1xuICBpZiAoIW1vZHVsZS5ob3QpIHtcbiAgICAvLyBIb3RNb2R1bGVSZXBsYWNlbWVudFBsdWdpbiBpcyBub3QgaW4gV2VicGFjayBjb25maWd1cmF0aW9uLlxuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWlzVXBkYXRlQXZhaWxhYmxlKCkgfHwgIWNhbkFwcGx5VXBkYXRlcygpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQXBwbHlVcGRhdGVzKGVyciwgdXBkYXRlZE1vZHVsZXMpIHtcbiAgICBjb25zb2xlLmxvZygnaGFuZGxlQXBwbHlVcGRhdGVzJywgZXJyLCB1cGRhdGVkTW9kdWxlcyk7XG4gICAgaWYgKGVyciB8fCAhdXBkYXRlZE1vZHVsZXMpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9uSG90VXBkYXRlU3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gTWF5YmUgd2Ugd2FudCB0byBkbyBzb21ldGhpbmcuXG4gICAgICBvbkhvdFVwZGF0ZVN1Y2Nlc3MoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNVcGRhdGVBdmFpbGFibGUoKSkge1xuICAgICAgLy8gV2hpbGUgd2Ugd2VyZSB1cGRhdGluZywgdGhlcmUgd2FzIGEgbmV3IHVwZGF0ZSEgRG8gaXQgYWdhaW4uXG4gICAgICB0cnlBcHBseVVwZGF0ZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBodHRwczovL3dlYnBhY2suZ2l0aHViLmlvL2RvY3MvaG90LW1vZHVsZS1yZXBsYWNlbWVudC5odG1sI2NoZWNrXG4gIHZhciByZXN1bHQgPSBtb2R1bGUuaG90LmNoZWNrKC8qIGF1dG9BcHBseSAqLyB0cnVlLCBoYW5kbGVBcHBseVVwZGF0ZXMpO1xuXG4gIC8vIC8vIFdlYnBhY2sgMiByZXR1cm5zIGEgUHJvbWlzZSBpbnN0ZWFkIG9mIGludm9raW5nIGEgY2FsbGJhY2tcbiAgaWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikge1xuICAgIHJlc3VsdC50aGVuKFxuICAgICAgZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMpIHtcbiAgICAgICAgaGFuZGxlQXBwbHlVcGRhdGVzKG51bGwsIHVwZGF0ZWRNb2R1bGVzKTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaGFuZGxlQXBwbHlVcGRhdGVzKGVyciwgbnVsbCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuIiwidmFyIHdpbjtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW4gPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW4gPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICB3aW4gPSBzZWxmO1xufSBlbHNlIHtcbiAgICB3aW4gPSB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3aW47XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVDbGVhcicpLFxuICAgIG1hcENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVEZWxldGUnKSxcbiAgICBtYXBDYWNoZUdldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlR2V0JyksXG4gICAgbWFwQ2FjaGVIYXMgPSByZXF1aXJlKCcuL19tYXBDYWNoZUhhcycpLFxuICAgIG1hcENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyksXG4gICAgc2V0Q2FjaGVBZGQgPSByZXF1aXJlKCcuL19zZXRDYWNoZUFkZCcpLFxuICAgIHNldENhY2hlSGFzID0gcmVxdWlyZSgnLi9fc2V0Q2FjaGVIYXMnKTtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPT0gbnVsbCA/IDAgOiB2YWx1ZXMubGVuZ3RoO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFNldENhY2hlYC5cblNldENhY2hlLnByb3RvdHlwZS5hZGQgPSBTZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IHNldENhY2hlQWRkO1xuU2V0Q2FjaGUucHJvdG90eXBlLmhhcyA9IHNldENhY2hlSGFzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldENhY2hlO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIHN0YWNrQ2xlYXIgPSByZXF1aXJlKCcuL19zdGFja0NsZWFyJyksXG4gICAgc3RhY2tEZWxldGUgPSByZXF1aXJlKCcuL19zdGFja0RlbGV0ZScpLFxuICAgIHN0YWNrR2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tHZXQnKSxcbiAgICBzdGFja0hhcyA9IHJlcXVpcmUoJy4vX3N0YWNrSGFzJyksXG4gICAgc3RhY2tTZXQgPSByZXF1aXJlKCcuL19zdGFja1NldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gVWludDhBcnJheTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlGaWx0ZXI7XG4iLCJ2YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmNsdWRlc2AgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBzcGVjaWZ5aW5nIGFuIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB0YXJnZXQgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHRhcmdldGAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCAwKSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5SW5jbHVkZXM7XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYXJyYXlJbmNsdWRlc2AgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhIGNvbXBhcmF0b3IuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdGFyZ2V0YCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzV2l0aChhcnJheSwgdmFsdWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChjb21wYXJhdG9yKHZhbHVlLCBhcnJheVtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5SW5jbHVkZXNXaXRoO1xuIiwidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUxpa2VLZXlzO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1hcDtcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5U29tZTtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBTZXRDYWNoZSA9IHJlcXVpcmUoJy4vX1NldENhY2hlJyksXG4gICAgYXJyYXlJbmNsdWRlcyA9IHJlcXVpcmUoJy4vX2FycmF5SW5jbHVkZXMnKSxcbiAgICBhcnJheUluY2x1ZGVzV2l0aCA9IHJlcXVpcmUoJy4vX2FycmF5SW5jbHVkZXNXaXRoJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBtZXRob2RzIGxpa2UgYF8uZGlmZmVyZW5jZWAgd2l0aG91dCBzdXBwb3J0XG4gKiBmb3IgZXhjbHVkaW5nIG11bHRpcGxlIGFycmF5cyBvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGV4Y2x1ZGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VEaWZmZXJlbmNlKGFycmF5LCB2YWx1ZXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaW5jbHVkZXMgPSBhcnJheUluY2x1ZGVzLFxuICAgICAgaXNDb21tb24gPSB0cnVlLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gW10sXG4gICAgICB2YWx1ZXNMZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xuXG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoaXRlcmF0ZWUpIHtcbiAgICB2YWx1ZXMgPSBhcnJheU1hcCh2YWx1ZXMsIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuICB9XG4gIGlmIChjb21wYXJhdG9yKSB7XG4gICAgaW5jbHVkZXMgPSBhcnJheUluY2x1ZGVzV2l0aDtcbiAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICB9XG4gIGVsc2UgaWYgKHZhbHVlcy5sZW5ndGggPj0gTEFSR0VfQVJSQVlfU0laRSkge1xuICAgIGluY2x1ZGVzID0gY2FjaGVIYXM7XG4gICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICB2YWx1ZXMgPSBuZXcgU2V0Q2FjaGUodmFsdWVzKTtcbiAgfVxuICBvdXRlcjpcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPT0gbnVsbCA/IHZhbHVlIDogaXRlcmF0ZWUodmFsdWUpO1xuXG4gICAgdmFsdWUgPSAoY29tcGFyYXRvciB8fCB2YWx1ZSAhPT0gMCkgPyB2YWx1ZSA6IDA7XG4gICAgaWYgKGlzQ29tbW9uICYmIGNvbXB1dGVkID09PSBjb21wdXRlZCkge1xuICAgICAgdmFyIHZhbHVlc0luZGV4ID0gdmFsdWVzTGVuZ3RoO1xuICAgICAgd2hpbGUgKHZhbHVlc0luZGV4LS0pIHtcbiAgICAgICAgaWYgKHZhbHVlc1t2YWx1ZXNJbmRleF0gPT09IGNvbXB1dGVkKSB7XG4gICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWluY2x1ZGVzKHZhbHVlcywgY29tcHV0ZWQsIGNvbXBhcmF0b3IpKSB7XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZURpZmZlcmVuY2U7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMSA6IC0xKTtcblxuICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmluZEluZGV4O1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzRmxhdHRlbmFibGUgPSByZXF1aXJlKCcuL19pc0ZsYXR0ZW5hYmxlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmxhdHRlbmAgd2l0aCBzdXBwb3J0IGZvciByZXN0cmljdGluZyBmbGF0dGVuaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZXB0aCBUaGUgbWF4aW11bSByZWN1cnNpb24gZGVwdGguXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcmVkaWNhdGU9aXNGbGF0dGVuYWJsZV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU3RyaWN0XSBSZXN0cmljdCB0byB2YWx1ZXMgdGhhdCBwYXNzIGBwcmVkaWNhdGVgIGNoZWNrcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHQ9W11dIFRoZSBpbml0aWFsIHJlc3VsdCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZUZsYXR0ZW4oYXJyYXksIGRlcHRoLCBwcmVkaWNhdGUsIGlzU3RyaWN0LCByZXN1bHQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgcHJlZGljYXRlIHx8IChwcmVkaWNhdGUgPSBpc0ZsYXR0ZW5hYmxlKTtcbiAgcmVzdWx0IHx8IChyZXN1bHQgPSBbXSk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKGRlcHRoID4gMCAmJiBwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICBpZiAoZGVwdGggPiAxKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICAgIGJhc2VGbGF0dGVuKHZhbHVlLCBkZXB0aCAtIDEsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheVB1c2gocmVzdWx0LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNTdHJpY3QpIHtcbiAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGbGF0dGVuO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZ2V0YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZmF1bHQgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCkge1xuICBwYXRoID0gY2FzdFBhdGgocGF0aCwgb2JqZWN0KTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldDtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0QWxsS2V5cztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc0luYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzSW4ob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGtleSBpbiBPYmplY3Qob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzSW47XG4iLCJ2YXIgYmFzZUZpbmRJbmRleCA9IHJlcXVpcmUoJy4vX2Jhc2VGaW5kSW5kZXgnKSxcbiAgICBiYXNlSXNOYU4gPSByZXF1aXJlKCcuL19iYXNlSXNOYU4nKSxcbiAgICBzdHJpY3RJbmRleE9mID0gcmVxdWlyZSgnLi9fc3RyaWN0SW5kZXhPZicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmluZGV4T2ZgIHdpdGhvdXQgYGZyb21JbmRleGAgYm91bmRzIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlXG4gICAgPyBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KVxuICAgIDogYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUlzTmFOLCBmcm9tSW5kZXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgYmFzZUlzRXF1YWxEZWVwID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWxEZWVwJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGJhc2VJc0VxdWFsLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWw7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBlcXVhbEJ5VGFnID0gcmVxdWlyZSgnLi9fZXF1YWxCeVRhZycpLFxuICAgIGVxdWFsT2JqZWN0cyA9IHJlcXVpcmUoJy4vX2VxdWFsT2JqZWN0cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBvYmpJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG9iamVjdCksXG4gICAgICBvdGhUYWcgPSBvdGhJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG90aGVyKTtcblxuICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG5cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbERlZXA7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gbWF0Y2hEYXRhIFRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSBtYXRjaERhdGEubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gaW5kZXgsXG4gICAgICBub0N1c3RvbWl6ZXIgPSAhY3VzdG9taXplcjtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSlcbiAgICAgICAgICA/IGRhdGFbMV0gIT09IG9iamVjdFtkYXRhWzBdXVxuICAgICAgICAgIDogIShkYXRhWzBdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgdmFyIGtleSA9IGRhdGFbMF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gZGF0YVsxXTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSkge1xuICAgICAgaWYgKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IG5ldyBTdGFjaztcbiAgICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBDT01QQVJFX1BBUlRJQUxfRkxBRyB8IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcsIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICAgICAgOiByZXN1bHRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWF0Y2g7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmFOYCB3aXRob3V0IHN1cHBvcnQgZm9yIG51bWJlciBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hTjtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsInZhciBiYXNlTWF0Y2hlcyA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzJyksXG4gICAgYmFzZU1hdGNoZXNQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgcHJvcGVydHkgPSByZXF1aXJlKCcuL3Byb3BlcnR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXRlcmF0ZWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IFt2YWx1ZT1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhbiBpdGVyYXRlZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgaXRlcmF0ZWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJdGVyYXRlZSh2YWx1ZSkge1xuICAvLyBEb24ndCBzdG9yZSB0aGUgYHR5cGVvZmAgcmVzdWx0IGluIGEgdmFyaWFibGUgdG8gYXZvaWQgYSBKSVQgYnVnIGluIFNhZmFyaSA5LlxuICAvLyBTZWUgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE1NjAzNCBmb3IgbW9yZSBkZXRhaWxzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBpc0FycmF5KHZhbHVlKVxuICAgICAgPyBiYXNlTWF0Y2hlc1Byb3BlcnR5KHZhbHVlWzBdLCB2YWx1ZVsxXSlcbiAgICAgIDogYmFzZU1hdGNoZXModmFsdWUpO1xuICB9XG4gIHJldHVybiBwcm9wZXJ0eSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUl0ZXJhdGVlO1xuIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCJ2YXIgYmFzZUlzTWF0Y2ggPSByZXF1aXJlKCcuL19iYXNlSXNNYXRjaCcpLFxuICAgIGdldE1hdGNoRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hdGNoRGF0YScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzYCB3aGljaCBkb2Vzbid0IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gIHZhciBtYXRjaERhdGEgPSBnZXRNYXRjaERhdGEoc291cmNlKTtcbiAgaWYgKG1hdGNoRGF0YS5sZW5ndGggPT0gMSAmJiBtYXRjaERhdGFbMF1bMl0pIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUobWF0Y2hEYXRhWzBdWzBdLCBtYXRjaERhdGFbMF1bMV0pO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09PSBzb3VyY2UgfHwgYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXM7XG4iLCJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpLFxuICAgIGdldCA9IHJlcXVpcmUoJy4vZ2V0JyksXG4gICAgaGFzSW4gPSByZXF1aXJlKCcuL2hhc0luJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzUHJvcGVydHlgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNyY1ZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXNQcm9wZXJ0eShwYXRoLCBzcmNWYWx1ZSkge1xuICBpZiAoaXNLZXkocGF0aCkgJiYgaXNTdHJpY3RDb21wYXJhYmxlKHNyY1ZhbHVlKSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSh0b0tleShwYXRoKSwgc3JjVmFsdWUpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIgb2JqVmFsdWUgPSBnZXQob2JqZWN0LCBwYXRoKTtcbiAgICByZXR1cm4gKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgb2JqVmFsdWUgPT09IHNyY1ZhbHVlKVxuICAgICAgPyBoYXNJbihvYmplY3QsIHBhdGgpXG4gICAgICA6IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgfCBDT01QQVJFX1VOT1JERVJFRF9GTEFHKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlc1Byb3BlcnR5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VQcm9wZXJ0eWAgd2hpY2ggc3VwcG9ydHMgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlEZWVwKHBhdGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5RGVlcDtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBvdmVyUmVzdCA9IHJlcXVpcmUoJy4vX292ZXJSZXN0JyksXG4gICAgc2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRUb1N0cmluZycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcbiIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhY2hlSGFzO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhIHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gaXNLZXkodmFsdWUsIG9iamVjdCkgPyBbdmFsdWVdIDogc3RyaW5nVG9QYXRoKHRvU3RyaW5nKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCJ2YXIgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpO1xuXG4vKipcbiAqIENvcGllcyBwcm9wZXJ0aWVzIG9mIGBzb3VyY2VgIHRvIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gY29weS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0PXt9XSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyB0by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvcGllZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBjb3B5T2JqZWN0KHNvdXJjZSwgcHJvcHMsIG9iamVjdCwgY3VzdG9taXplcikge1xuICB2YXIgaXNOZXcgPSAhb2JqZWN0O1xuICBvYmplY3QgfHwgKG9iamVjdCA9IHt9KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG5cbiAgICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNvdXJjZVtrZXldLCBrZXksIG9iamVjdCwgc291cmNlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3VmFsdWUgPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gICAgaWYgKGlzTmV3KSB7XG4gICAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5T2JqZWN0O1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZUpzRGF0YTtcbiIsInZhciBiYXNlUmVzdCA9IHJlcXVpcmUoJy4vX2Jhc2VSZXN0JyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBsaWtlIGBfLmFzc2lnbmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiBiYXNlUmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZDtcblxuICAgIGN1c3RvbWl6ZXIgPSAoYXNzaWduZXIubGVuZ3RoID4gMyAmJiB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKVxuICAgICAgPyAobGVuZ3RoLS0sIGN1c3RvbWl6ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChndWFyZCAmJiBpc0l0ZXJhdGVlQ2FsbChzb3VyY2VzWzBdLCBzb3VyY2VzWzFdLCBndWFyZCkpIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPCAzID8gdW5kZWZpbmVkIDogY3VzdG9taXplcjtcbiAgICAgIGxlbmd0aCA9IDE7XG4gICAgfVxuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgc291cmNlID0gc291cmNlc1tpbmRleF07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGFzc2lnbmVyKG9iamVjdCwgc291cmNlLCBpbmRleCwgY3VzdG9taXplcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFzc2lnbmVyO1xuIiwidmFyIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8uZmluZGAgb3IgYF8uZmluZExhc3RgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmaW5kSW5kZXhGdW5jIFRoZSBmdW5jdGlvbiB0byBmaW5kIHRoZSBjb2xsZWN0aW9uIGluZGV4LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZmluZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmluZChmaW5kSW5kZXhGdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGZyb21JbmRleCkge1xuICAgIHZhciBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICB2YXIgaXRlcmF0ZWUgPSBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKTtcbiAgICAgIGNvbGxlY3Rpb24gPSBrZXlzKGNvbGxlY3Rpb24pO1xuICAgICAgcHJlZGljYXRlID0gZnVuY3Rpb24oa2V5KSB7IHJldHVybiBpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKTsgfTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gZmluZEluZGV4RnVuYyhjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGZyb21JbmRleCk7XG4gICAgcmV0dXJuIGluZGV4ID4gLTEgPyBpdGVyYWJsZVtpdGVyYXRlZSA/IGNvbGxlY3Rpb25baW5kZXhdIDogaW5kZXhdIDogdW5kZWZpbmVkO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZpbmQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZnVuYyA9IGdldE5hdGl2ZShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScpO1xuICAgIGZ1bmMoe30sICcnLCB7fSk7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnR5O1xuIiwidmFyIFNldENhY2hlID0gcmVxdWlyZSgnLi9fU2V0Q2FjaGUnKSxcbiAgICBhcnJheVNvbWUgPSByZXF1aXJlKCcuL19hcnJheVNvbWUnKSxcbiAgICBjYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2NhY2hlSGFzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGFycmF5cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChhcnJheSk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBDT01QQVJFX1VOT1JERVJFRF9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBhcnJheSk7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChzZWVuKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUsIG90aEluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWNhY2hlSGFzKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgIChhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShhcnJheSk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxBcnJheXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKSxcbiAgICBlcXVhbEFycmF5cyA9IHJlcXVpcmUoJy4vX2VxdWFsQXJyYXlzJyksXG4gICAgbWFwVG9BcnJheSA9IHJlcXVpcmUoJy4vX21hcFRvQXJyYXknKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAob2JqZWN0LmJ5dGVPZmZzZXQgIT0gb3RoZXIuYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIG90aGVyID0gb3RoZXIuYnVmZmVyO1xuXG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAhZXF1YWxGdW5jKG5ldyBVaW50OEFycmF5KG9iamVjdCksIG5ldyBVaW50OEFycmF5KG90aGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gQ29lcmNlIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgYW5kIGRhdGVzIHRvIG1pbGxpc2Vjb25kcy5cbiAgICAgIC8vIEludmFsaWQgZGF0ZXMgYXJlIGNvZXJjZWQgdG8gYE5hTmAuXG4gICAgICByZXR1cm4gZXEoK29iamVjdCwgK290aGVyKTtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzLCBwcmltaXRpdmVzIGFuZCBvYmplY3RzLFxuICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICB2YXIgY29udmVydCA9IG1hcFRvQXJyYXk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUc7XG4gICAgICBjb252ZXJ0IHx8IChjb252ZXJ0ID0gc2V0VG9BcnJheSk7XG5cbiAgICAgIGlmIChvYmplY3Quc2l6ZSAhPSBvdGhlci5zaXplICYmICFpc1BhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgICAgIGlmIChzdGFja2VkKSB7XG4gICAgICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICAgICAgfVxuICAgICAgYml0bWFzayB8PSBDT01QQVJFX1VOT1JERVJFRF9GTEFHO1xuXG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgICAgIHZhciByZXN1bHQgPSBlcXVhbEFycmF5cyhjb252ZXJ0KG9iamVjdCksIGNvbnZlcnQob3RoZXIpLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgICAgIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgaWYgKHN5bWJvbFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlT2YuY2FsbChvYmplY3QpID09IHN5bWJvbFZhbHVlT2YuY2FsbChvdGhlcik7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQnlUYWc7XG4iLCJ2YXIgZ2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBnZXRBbGxLZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGdldEFsbEtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxPYmplY3RzO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3Mgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbWF0Y2ggZGF0YSBvZiBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gZ2V0TWF0Y2hEYXRhKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0ga2V5cyhvYmplY3QpLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIga2V5ID0gcmVzdWx0W2xlbmd0aF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG5cbiAgICByZXN1bHRbbGVuZ3RoXSA9IFtrZXksIHZhbHVlLCBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hdGNoRGF0YTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCB8fCArK2luZGV4ICE9IGxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogb2JqZWN0Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc1BhdGg7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ByZWFkYWJsZVN5bWJvbCA9IFN5bWJvbCA/IFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBmbGF0dGVuYWJsZSBgYXJndW1lbnRzYCBvYmplY3Qgb3IgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZmxhdHRlbmFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNGbGF0dGVuYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpIHx8XG4gICAgISEoc3ByZWFkYWJsZVN5bWJvbCAmJiB2YWx1ZSAmJiB2YWx1ZVtzcHJlYWRhYmxlU3ltYm9sXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGbGF0dGVuYWJsZTtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuXG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlID09ICdudW1iZXInIHx8XG4gICAgICAodHlwZSAhPSAnc3ltYm9sJyAmJiByZUlzVWludC50ZXN0KHZhbHVlKSkpICYmXG4gICAgICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgICAgPyAoaXNBcnJheUxpa2Uob2JqZWN0KSAmJiBpc0luZGV4KGluZGV4LCBvYmplY3QubGVuZ3RoKSlcbiAgICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpXG4gICAgICApIHtcbiAgICByZXR1cm4gZXEob2JqZWN0W2luZGV4XSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUlzRGVlcFByb3AgPSAvXFwufFxcWyg/OlteW1xcXV0qfChbXCInXSkoPzooPyFcXDEpW15cXFxcXXxcXFxcLikqP1xcMSlcXF0vLFxuICAgIHJlSXNQbGFpblByb3AgPSAvXlxcdyokLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUgYW5kIG5vdCBhIHByb3BlcnR5IHBhdGguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleSh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJyB8fFxuICAgICAgdmFsdWUgPT0gbnVsbCB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVJc1BsYWluUHJvcC50ZXN0KHZhbHVlKSB8fCAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8XG4gICAgKG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlmIHN1aXRhYmxlIGZvciBzdHJpY3RcbiAqICBlcXVhbGl0eSBjb21wYXJpc29ucywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSAmJiAhaXNPYmplY3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaWN0Q29tcGFyYWJsZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGl0cyBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIG1hcFRvQXJyYXkobWFwKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobWFwLnNpemUpO1xuXG4gIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBba2V5LCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcFRvQXJyYXk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgbWF0Y2hlc1Byb3BlcnR5YCBmb3Igc291cmNlIHZhbHVlcyBzdWl0YWJsZVxuICogZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKGtleSwgc3JjVmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0W2tleV0gPT09IHNyY1ZhbHVlICYmXG4gICAgICAoc3JjVmFsdWUgIT09IHVuZGVmaW5lZCB8fCAoa2V5IGluIE9iamVjdChvYmplY3QpKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlc1N0cmljdENvbXBhcmFibGU7XG4iLCJ2YXIgbWVtb2l6ZSA9IHJlcXVpcmUoJy4vbWVtb2l6ZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgbWF4aW11bSBtZW1vaXplIGNhY2hlIHNpemUuICovXG52YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzXG4gKiBjYWNoZSB3aGVuIGl0IGV4Y2VlZHMgYE1BWF9NRU1PSVpFX1NJWkVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZUNhcHBlZChmdW5jKSB7XG4gIHZhciByZXN1bHQgPSBtZW1vaXplKGZ1bmMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChjYWNoZS5zaXplID09PSBNQVhfTUVNT0laRV9TSVpFKSB7XG4gICAgICBjYWNoZS5jbGVhcigpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9KTtcblxuICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZUNhcHBlZDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVDcmVhdGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICAvLyBVc2UgYHV0aWwudHlwZXNgIGZvciBOb2RlLmpzIDEwKy5cbiAgICB2YXIgdHlwZXMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUucmVxdWlyZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUoJ3V0aWwnKS50eXBlcztcblxuICAgIGlmICh0eXBlcykge1xuICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH1cblxuICAgIC8vIExlZ2FjeSBgcHJvY2Vzcy5iaW5kaW5nKCd1dGlsJylgIGZvciBOb2RlLmpzIDwgMTAuXG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcbiIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCIvKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUFkZDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUhhcztcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG4iLCIvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZUNhcHBlZChmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAoc3RyaW5nLmNoYXJDb2RlQXQoMCkgPT09IDQ2IC8qIC4gKi8pIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN1YlN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3ViU3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGNyZWF0ZUFzc2lnbmVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQXNzaWduZXInKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdHMgdG8gdGhlXG4gKiBkZXN0aW5hdGlvbiBvYmplY3QuIFNvdXJjZSBvYmplY3RzIGFyZSBhcHBsaWVkIGZyb20gbGVmdCB0byByaWdodC5cbiAqIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YCBhbmQgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BPYmplY3QuYXNzaWduYF0oaHR0cHM6Ly9tZG4uaW8vT2JqZWN0L2Fzc2lnbikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEwLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBzZWUgXy5hc3NpZ25JblxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gQmFyKCkge1xuICogICB0aGlzLmMgPSAzO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYiA9IDI7XG4gKiBCYXIucHJvdG90eXBlLmQgPSA0O1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAwIH0sIG5ldyBGb28sIG5ldyBCYXIpO1xuICogLy8gPT4geyAnYSc6IDEsICdjJzogMyB9XG4gKi9cbnZhciBhc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSkge1xuICBpZiAoaXNQcm90b3R5cGUoc291cmNlKSB8fCBpc0FycmF5TGlrZShzb3VyY2UpKSB7XG4gICAgY29weU9iamVjdChzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuIiwidmFyIGJhc2VEaWZmZXJlbmNlID0gcmVxdWlyZSgnLi9fYmFzZURpZmZlcmVuY2UnKSxcbiAgICBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgYmFzZVJlc3QgPSByZXF1aXJlKCcuL19iYXNlUmVzdCcpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgYGFycmF5YCB2YWx1ZXMgbm90IGluY2x1ZGVkIGluIHRoZSBvdGhlciBnaXZlbiBhcnJheXNcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuIFRoZSBvcmRlciBhbmQgcmVmZXJlbmNlcyBvZiByZXN1bHQgdmFsdWVzIGFyZVxuICogZGV0ZXJtaW5lZCBieSB0aGUgZmlyc3QgYXJyYXkuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy5wdWxsQWxsYCwgdGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsuLi5BcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBleGNsdWRlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICogQHNlZSBfLndpdGhvdXQsIF8ueG9yXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGlmZmVyZW5jZShbMiwgMV0sIFsyLCAzXSk7XG4gKiAvLyA9PiBbMV1cbiAqL1xudmFyIGRpZmZlcmVuY2UgPSBiYXNlUmVzdChmdW5jdGlvbihhcnJheSwgdmFsdWVzKSB7XG4gIHJldHVybiBpc0FycmF5TGlrZU9iamVjdChhcnJheSlcbiAgICA/IGJhc2VEaWZmZXJlbmNlKGFycmF5LCBiYXNlRmxhdHRlbih2YWx1ZXMsIDEsIGlzQXJyYXlMaWtlT2JqZWN0LCB0cnVlKSlcbiAgICA6IFtdO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGlmZmVyZW5jZTtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGNyZWF0ZUZpbmQgPSByZXF1aXJlKCcuL19jcmVhdGVGaW5kJyksXG4gICAgZmluZEluZGV4ID0gcmVxdWlyZSgnLi9maW5kSW5kZXgnKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIHRoZSBmaXJzdCBlbGVtZW50XG4gKiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHRocmVlXG4gKiBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcmVkaWNhdGU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXRjaGVkIGVsZW1lbnQsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9LFxuICogICB7ICd1c2VyJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgICdhY3RpdmUnOiB0cnVlIH1cbiAqIF07XG4gKlxuICogXy5maW5kKHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiBvLmFnZSA8IDQwOyB9KTtcbiAqIC8vID0+IG9iamVjdCBmb3IgJ2Jhcm5leSdcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCB7ICdhZ2UnOiAxLCAnYWN0aXZlJzogdHJ1ZSB9KTtcbiAqIC8vID0+IG9iamVjdCBmb3IgJ3BlYmJsZXMnXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdmcmVkJ1xuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdiYXJuZXknXG4gKi9cbnZhciBmaW5kID0gY3JlYXRlRmluZChmaW5kSW5kZXgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmQ7XG4iLCJ2YXIgYmFzZUZpbmRJbmRleCA9IHJlcXVpcmUoJy4vX2Jhc2VGaW5kSW5kZXgnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kYCBleGNlcHQgdGhhdCBpdCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZmlyc3RcbiAqIGVsZW1lbnQgYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yIGluc3RlYWQgb2YgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgLTFgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgICdhY3RpdmUnOiBmYWxzZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FjdGl2ZSc6IHRydWUgfVxuICogXTtcbiAqXG4gKiBfLmZpbmRJbmRleCh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby51c2VyID09ICdiYXJuZXknOyB9KTtcbiAqIC8vID0+IDBcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kSW5kZXgodXNlcnMsIHsgJ3VzZXInOiAnZnJlZCcsICdhY3RpdmUnOiBmYWxzZSB9KTtcbiAqIC8vID0+IDFcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmRJbmRleCh1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gMFxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kSW5kZXgodXNlcnMsICdhY3RpdmUnKTtcbiAqIC8vID0+IDJcbiAqL1xuZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCA9PSBudWxsID8gMCA6IHRvSW50ZWdlcihmcm9tSW5kZXgpO1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgaW5kZXggPSBuYXRpdmVNYXgobGVuZ3RoICsgaW5kZXgsIDApO1xuICB9XG4gIHJldHVybiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKSwgaW5kZXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbmRleDtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBgb2JqZWN0YC4gSWYgdGhlIHJlc29sdmVkIHZhbHVlIGlzXG4gKiBgdW5kZWZpbmVkYCwgdGhlIGBkZWZhdWx0VmFsdWVgIGlzIHJldHVybmVkIGluIGl0cyBwbGFjZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTtcbiAqXG4gKiBfLmdldChvYmplY3QsICdhWzBdLmIuYycpO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgWydhJywgJzAnLCAnYicsICdjJ10pO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2EuYi5jJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICovXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsdWUgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuIiwidmFyIGJhc2VIYXNJbiA9IHJlcXVpcmUoJy4vX2Jhc2VIYXNJbicpLFxuICAgIGhhc1BhdGggPSByZXF1aXJlKCcuL19oYXNQYXRoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBvciBpbmhlcml0ZWQgcHJvcGVydHkgb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYS5iJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsIFsnYScsICdiJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYicpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaGFzSW4ob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhc0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNJbjtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKlxuICogY29uc29sZS5sb2coXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG4iLCJ2YXIgYmFzZUlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9fYmFzZUlzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlT2JqZWN0O1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHknKSxcbiAgICBiYXNlUHJvcGVydHlEZWVwID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5RGVlcCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGEgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7ICdhJzogeyAnYic6IDIgfSB9LFxuICogICB7ICdhJzogeyAnYic6IDEgfSB9XG4gKiBdO1xuICpcbiAqIF8ubWFwKG9iamVjdHMsIF8ucHJvcGVydHkoJ2EuYicpKTtcbiAqIC8vID0+IFsyLCAxXVxuICpcbiAqIF8ubWFwKF8uc29ydEJ5KG9iamVjdHMsIF8ucHJvcGVydHkoWydhJywgJ2InXSkpLCAnYS5iJyk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqL1xuZnVuY3Rpb24gcHJvcGVydHkocGF0aCkge1xuICByZXR1cm4gaXNLZXkocGF0aCkgPyBiYXNlUHJvcGVydHkodG9LZXkocGF0aCkpIDogYmFzZVByb3BlcnR5RGVlcChwYXRoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsInZhciB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBmaW5pdGUgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMi4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9GaW5pdGUoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9GaW5pdGUoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvRmluaXRlKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0Zpbml0ZSgnMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9GaW5pdGUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogMDtcbiAgfVxuICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlID09PSBJTkZJTklUWSB8fCB2YWx1ZSA9PT0gLUlORklOSVRZKSB7XG4gICAgdmFyIHNpZ24gPSAodmFsdWUgPCAwID8gLTEgOiAxKTtcbiAgICByZXR1cm4gc2lnbiAqIE1BWF9JTlRFR0VSO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyB2YWx1ZSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9GaW5pdGU7XG4iLCJ2YXIgdG9GaW5pdGUgPSByZXF1aXJlKCcuL3RvRmluaXRlJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvSW50ZWdlcmBdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2ludGVnZXIpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9JbnRlZ2VyKDMuMik7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b0ludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b0ludGVnZXIoSW5maW5pdHkpO1xuICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAqXG4gKiBfLnRvSW50ZWdlcignMy4yJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gdG9GaW5pdGUodmFsdWUpLFxuICAgICAgcmVtYWluZGVyID0gcmVzdWx0ICUgMTtcblxuICByZXR1cm4gcmVzdWx0ID09PSByZXN1bHQgPyAocmVtYWluZGVyID8gcmVzdWx0IC0gcmVtYWluZGVyIDogcmVzdWx0KSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9JbnRlZ2VyO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG4iLCJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1N0cmluZztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIFJheCA9IHJlcXVpcmUoJ3JheCcpO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdyZWFjdC1wcm94eScpLFxuICAgIGNyZWF0ZVByb3h5ID0gX3JlcXVpcmUuY3JlYXRlUHJveHk7XG5cbnZhciBnbG9iYWwgPSByZXF1aXJlKCdnbG9iYWwnKTtcblxudmFyIENvbXBvbmVudE1hcCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ29tcG9uZW50TWFwKHVzZVdlYWtNYXApIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29tcG9uZW50TWFwKTtcblxuICAgIGlmICh1c2VXZWFrTWFwKSB7XG4gICAgICB0aGlzLndtID0gbmV3IFdlYWtNYXAoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zbG90cyA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDb21wb25lbnRNYXAsIFt7XG4gICAga2V5OiAnZ2V0U2xvdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNsb3QodHlwZSkge1xuICAgICAgdmFyIGtleSA9IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJztcbiAgICAgIGlmICghdGhpcy5zbG90c1trZXldKSB7XG4gICAgICAgIHRoaXMuc2xvdHNba2V5XSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc2xvdHNba2V5XTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQodHlwZSkge1xuICAgICAgaWYgKHRoaXMud20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud20uZ2V0KHR5cGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2xvdCA9IHRoaXMuZ2V0U2xvdCh0eXBlKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xvdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc2xvdFtpXS5rZXkgPT09IHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gc2xvdFtpXS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NldCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldCh0eXBlLCB2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMud20pIHtcbiAgICAgICAgdGhpcy53bS5zZXQodHlwZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNsb3QgPSB0aGlzLmdldFNsb3QodHlwZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xvdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChzbG90W2ldLmtleSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgc2xvdFtpXS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzbG90LnB1c2goeyBrZXk6IHR5cGUsIHZhbHVlOiB2YWx1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYXModHlwZSkge1xuICAgICAgaWYgKHRoaXMud20pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud20uaGFzKHR5cGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2xvdCA9IHRoaXMuZ2V0U2xvdCh0eXBlKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xvdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc2xvdFtpXS5rZXkgPT09IHR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb21wb25lbnRNYXA7XG59KCk7XG5cbnZhciBwcm94aWVzQnlJRCA9IHZvaWQgMDtcbnZhciBkaWRXYXJuQWJvdXRJRCA9IHZvaWQgMDtcbnZhciBoYXNDcmVhdGVkRWxlbWVudHNCeVR5cGUgPSB2b2lkIDA7XG52YXIgaWRzQnlUeXBlID0gdm9pZCAwO1xuXG52YXIgaG9va3MgPSB7XG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiByZWdpc3Rlcih0eXBlLCB1bmlxdWVMb2NhbE5hbWUsIGZpbGVOYW1lKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdW5pcXVlTG9jYWxOYW1lIHx8ICFmaWxlTmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHVuaXF1ZUxvY2FsTmFtZSAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIGZpbGVOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgaWQgPSBmaWxlTmFtZSArICcjJyArIHVuaXF1ZUxvY2FsTmFtZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBwcmVmZXItdGVtcGxhdGVcbiAgICBpZiAoIWlkc0J5VHlwZS5oYXModHlwZSkgJiYgaGFzQ3JlYXRlZEVsZW1lbnRzQnlUeXBlLmhhcyh0eXBlKSkge1xuICAgICAgaWYgKCFkaWRXYXJuQWJvdXRJRFtpZF0pIHtcbiAgICAgICAgZGlkV2FybkFib3V0SURbaWRdID0gdHJ1ZTtcbiAgICAgICAgdmFyIGJhc2VOYW1lID0gZmlsZU5hbWUucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdSYXggSG90IExvYWRlcjogJyArIHVuaXF1ZUxvY2FsTmFtZSArICcgaW4gJyArIGZpbGVOYW1lICsgJyB3aWxsIG5vdCBob3QgcmVsb2FkICcgKyAoJ2NvcnJlY3RseSBiZWNhdXNlICcgKyBiYXNlTmFtZSArICcgdXNlcyA8JyArIHVuaXF1ZUxvY2FsTmFtZSArICcgLz4gZHVyaW5nICcpICsgKCdtb2R1bGUgZGVmaW5pdGlvbi4gRm9yIGhvdCByZWxvYWRpbmcgdG8gd29yaywgbW92ZSAnICsgdW5pcXVlTG9jYWxOYW1lICsgJyAnKSArICgnaW50byBhIHNlcGFyYXRlIGZpbGUgYW5kIGltcG9ydCBpdCBmcm9tICcgKyBiYXNlTmFtZSArICcuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbWVtYmVyIHRoZSBJRC5cbiAgICBpZHNCeVR5cGUuc2V0KHR5cGUsIGlkKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGlkLCBwcm94aWVzQnlJRFtpZF0sIHR5cGUpO1xuICAgIC8vIFdlIHVzZSBSZWFjdCBQcm94eSB0byBnZW5lcmF0ZSBjbGFzc2VzIHRoYXQgYmVoYXZlIGFsbW9zdFxuICAgIC8vIHRoZSBzYW1lIHdheSBhcyB0aGUgb3JpZ2luYWwgY2xhc3NlcyBidXQgYXJlIHVwZGF0YWJsZSB3aXRoXG4gICAgLy8gbmV3IHZlcnNpb25zIHdpdGhvdXQgZGVzdHJveWluZyBvcmlnaW5hbCBpbnN0YW5jZXMuXG4gICAgaWYgKCFwcm94aWVzQnlJRFtpZF0pIHtcbiAgICAgIHByb3hpZXNCeUlEW2lkXSA9IGNyZWF0ZVByb3h5KHR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm94aWVzQnlJRFtpZF0udXBkYXRlKHR5cGUpO1xuICAgIH1cbiAgfSxcbiAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KHVzZVdlYWtNYXApIHtcbiAgICBwcm94aWVzQnlJRCA9IHt9O1xuICAgIGRpZFdhcm5BYm91dElEID0ge307XG4gICAgaGFzQ3JlYXRlZEVsZW1lbnRzQnlUeXBlID0gbmV3IENvbXBvbmVudE1hcCh1c2VXZWFrTWFwKTtcbiAgICBpZHNCeVR5cGUgPSBuZXcgQ29tcG9uZW50TWFwKHVzZVdlYWtNYXApO1xuICB9XG59O1xuXG5ob29rcy5yZXNldCh0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJyk7XG5cbmZ1bmN0aW9uIHJlc29sdmVUeXBlKHR5cGUpIHtcbiAgLy8gV2Ugb25seSBjYXJlIGFib3V0IGNvbXBvc2l0ZSBjb21wb25lbnRzXG4gIGlmICh0eXBlb2YgdHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlO1xuICB9XG5cbiAgaGFzQ3JlYXRlZEVsZW1lbnRzQnlUeXBlLnNldCh0eXBlLCB0cnVlKTtcblxuICAvLyBXaGVuIGF2YWlsYWJsZSwgZ2l2ZSBwcm94eSBjbGFzcyB0byBSZWFjdCBpbnN0ZWFkIG9mIHRoZSByZWFsIGNsYXNzLlxuICB2YXIgaWQgPSBpZHNCeVR5cGUuZ2V0KHR5cGUpO1xuICBpZiAoIWlkKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cblxuICB2YXIgcHJveHkgPSBwcm94aWVzQnlJRFtpZF07XG4gIGlmICghcHJveHkpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuXG4gIHJldHVybiBwcm94eS5nZXQoKTtcbn1cbnZhciBjcmVhdGVFbGVtZW50ID0gUmF4LmNyZWF0ZUVsZW1lbnQ7XG5mdW5jdGlvbiBwYXRjaGVkQ3JlYXRlRWxlbWVudCh0eXBlKSB7XG4gIC8vIFRyaWNrIFJlYWN0IGludG8gcmVuZGVyaW5nIGEgcHJveHkgc28gdGhhdFxuICAvLyBpdHMgc3RhdGUgaXMgcHJlc2VydmVkIHdoZW4gdGhlIGNsYXNzIGNoYW5nZXMuXG4gIC8vIFRoaXMgd2lsbCB1cGRhdGUgdGhlIHByb3h5IGlmIGl0J3MgZm9yIGEga25vd24gdHlwZS5cbiAgdmFyIHJlc29sdmVkVHlwZSA9IHJlc29sdmVUeXBlKHR5cGUpO1xuXG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQuYXBwbHkodW5kZWZpbmVkLCBbcmVzb2x2ZWRUeXBlXS5jb25jYXQoYXJncykpO1xufVxucGF0Y2hlZENyZWF0ZUVsZW1lbnQuaXNQYXRjaGVkQnlSZWFjdEhvdExvYWRlciA9IHRydWU7XG5cbmZ1bmN0aW9uIHBhdGNoZWRDcmVhdGVGYWN0b3J5KHR5cGUpIHtcbiAgLy8gUGF0Y2ggUmF4LmNyZWF0ZUZhY3RvcnkgdG8gdXNlIHBhdGNoZWQgY3JlYXRlRWxlbWVudFxuICAvLyBiZWNhdXNlIHRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbiB1c2VzIHRoZSBpbnRlcm5hbCxcbiAgLy8gdW5wYXRjaGVkIFJlYWN0RWxlbWVudC5jcmVhdGVFbGVtZW50XG4gIHZhciBmYWN0b3J5ID0gcGF0Y2hlZENyZWF0ZUVsZW1lbnQuYmluZChudWxsLCB0eXBlKTtcbiAgZmFjdG9yeS50eXBlID0gdHlwZTtcbiAgcmV0dXJuIGZhY3Rvcnk7XG59XG5wYXRjaGVkQ3JlYXRlRmFjdG9yeS5pc1BhdGNoZWRCeVJlYWN0SG90TG9hZGVyID0gdHJ1ZTtcblxuaWYgKHR5cGVvZiBnbG9iYWwuX19SQVhfSE9UX0xPQURFUl9fID09PSAndW5kZWZpbmVkJykge1xuICBSYXguY3JlYXRlRWxlbWVudCA9IHBhdGNoZWRDcmVhdGVFbGVtZW50O1xuICBSYXguY3JlYXRlRmFjdG9yeSA9IHBhdGNoZWRDcmVhdGVGYWN0b3J5O1xuICBnbG9iYWwuX19SQVhfSE9UX0xPQURFUl9fID0gaG9va3M7XG59IiwiLyogZXNsaW50LWRpc2FibGUgZ2xvYmFsLXJlcXVpcmUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAoIW1vZHVsZS5ob3QgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcGF0Y2gucHJvZCcpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3BhdGNoLmRldicpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvcGF0Y2gnKTsiLCJcbi8vIENvbnN0YW50IHRvIGlkZW50aWZ5IGEgUmVhY3QgQ29tcG9uZW50LiBJdCdzIGJlZW4gZXh0cmFjdGVkIGZyb20gUmVhY3RUeXBlT2ZXb3JrXG4vLyAoaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvbWFzdGVyL3NyYy9zaGFyZWQvUmVhY3RUeXBlT2ZXb3JrLmpzI0wyMClcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGdldEZvcmNlVXBkYXRlO1xudmFyIFJlYWN0Q2xhc3NDb21wb25lbnQgPSAyO1xuXG5mdW5jdGlvbiB0cmF2ZXJzZVJlbmRlcmVkQ2hpbGRyZW4oaW50ZXJuYWxJbnN0YW5jZSwgY2FsbGJhY2ssIGFyZ3VtZW50KSB7XG4gIGNhbGxiYWNrKGludGVybmFsSW5zdGFuY2UsIGFyZ3VtZW50KTtcblxuICBpZiAoaW50ZXJuYWxJbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQpIHtcbiAgICB0cmF2ZXJzZVJlbmRlcmVkQ2hpbGRyZW4oaW50ZXJuYWxJbnN0YW5jZS5fcmVuZGVyZWRDb21wb25lbnQsIGNhbGxiYWNrLCBhcmd1bWVudCk7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIga2V5IGluIGludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ2hpbGRyZW4pIHtcbiAgICAgIGlmIChpbnRlcm5hbEluc3RhbmNlLl9yZW5kZXJlZENoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdHJhdmVyc2VSZW5kZXJlZENoaWxkcmVuKGludGVybmFsSW5zdGFuY2UuX3JlbmRlcmVkQ2hpbGRyZW5ba2V5XSwgY2FsbGJhY2ssIGFyZ3VtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0UGVuZGluZ0ZvcmNlVXBkYXRlKGludGVybmFsSW5zdGFuY2UpIHtcbiAgaWYgKGludGVybmFsSW5zdGFuY2UuX3BlbmRpbmdGb3JjZVVwZGF0ZSA9PT0gZmFsc2UpIHtcbiAgICBpbnRlcm5hbEluc3RhbmNlLl9wZW5kaW5nRm9yY2VVcGRhdGUgPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcmNlVXBkYXRlSWZQZW5kaW5nKGludGVybmFsSW5zdGFuY2UsIFJlYWN0KSB7XG4gIGlmIChpbnRlcm5hbEluc3RhbmNlLl9wZW5kaW5nRm9yY2VVcGRhdGUgPT09IHRydWUpIHtcbiAgICB2YXIgcHVibGljSW5zdGFuY2UgPSBpbnRlcm5hbEluc3RhbmNlLl9pbnN0YW5jZTtcbiAgICBSZWFjdC5Db21wb25lbnQucHJvdG90eXBlLmZvcmNlVXBkYXRlLmNhbGwocHVibGljSW5zdGFuY2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlZXBGb3JjZVVwZGF0ZVN0YWNrKGluc3RhbmNlLCBSZWFjdCkge1xuICB2YXIgaW50ZXJuYWxJbnN0YW5jZSA9IGluc3RhbmNlLl9yZWFjdEludGVybmFsSW5zdGFuY2U7XG4gIHRyYXZlcnNlUmVuZGVyZWRDaGlsZHJlbihpbnRlcm5hbEluc3RhbmNlLCBzZXRQZW5kaW5nRm9yY2VVcGRhdGUpO1xuICB0cmF2ZXJzZVJlbmRlcmVkQ2hpbGRyZW4oaW50ZXJuYWxJbnN0YW5jZSwgZm9yY2VVcGRhdGVJZlBlbmRpbmcsIFJlYWN0KTtcbn1cblxuZnVuY3Rpb24gZGVlcEZvcmNlVXBkYXRlKGluc3RhbmNlLCBSZWFjdCkge1xuICB2YXIgcm9vdCA9IGluc3RhbmNlLl9yZWFjdEludGVybmFsRmliZXIgfHwgaW5zdGFuY2UuX3JlYWN0SW50ZXJuYWxJbnN0YW5jZTtcbiAgaWYgKHR5cGVvZiByb290LnRhZyAhPT0gJ251bWJlcicpIHtcbiAgICAvLyBUcmF2ZXJzZSBzdGFjay1iYXNlZCBSZWFjdCB0cmVlLlxuICAgIHJldHVybiBkZWVwRm9yY2VVcGRhdGVTdGFjayhpbnN0YW5jZSwgUmVhY3QpO1xuICB9XG5cbiAgdmFyIG5vZGUgPSByb290O1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChub2RlLnRhZyA9PT0gUmVhY3RDbGFzc0NvbXBvbmVudCkge1xuICAgICAgdmFyIHB1YmxpY0luc3RhbmNlID0gbm9kZS5zdGF0ZU5vZGU7XG4gICAgICB2YXIgdXBkYXRlciA9IHB1YmxpY0luc3RhbmNlLnVwZGF0ZXI7XG5cbiAgICAgIGlmICh0eXBlb2YgcHVibGljSW5zdGFuY2UuZm9yY2VVcGRhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHVibGljSW5zdGFuY2UuZm9yY2VVcGRhdGUoKTtcbiAgICAgIH0gZWxzZSBpZiAodXBkYXRlciAmJiB0eXBlb2YgdXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUocHVibGljSW5zdGFuY2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9kZS5jaGlsZCkge1xuICAgICAgbm9kZS5jaGlsZFsncmV0dXJuJ10gPSBub2RlO1xuICAgICAgbm9kZSA9IG5vZGUuY2hpbGQ7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IHJvb3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHdoaWxlICghbm9kZS5zaWJsaW5nKSB7XG4gICAgICBpZiAoIW5vZGVbJ3JldHVybiddIHx8IG5vZGVbJ3JldHVybiddID09PSByb290KSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZVsncmV0dXJuJ107XG4gICAgfVxuICAgIG5vZGUuc2libGluZ1sncmV0dXJuJ10gPSBub2RlWydyZXR1cm4nXTtcbiAgICBub2RlID0gbm9kZS5zaWJsaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEZvcmNlVXBkYXRlKFJlYWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICBkZWVwRm9yY2VVcGRhdGUoaW5zdGFuY2UsIFJlYWN0KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gYmluZEF1dG9CaW5kTWV0aG9kcztcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIFJlYWN0IHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBPcmlnaW5hbDpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzY1MDhiMWFkMjczYTZmMzcxZThkOTBhZTY3NmU1MzkwMTk5NDYxYjQvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9jbGFzcy9SZWFjdENsYXNzLmpzI0w2NTAtTDcxM1xuICovXG5cbmZ1bmN0aW9uIGJpbmRBdXRvQmluZE1ldGhvZChjb21wb25lbnQsIG1ldGhvZCkge1xuICB2YXIgYm91bmRNZXRob2QgPSBtZXRob2QuYmluZChjb21wb25lbnQpO1xuXG4gIGJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZENvbnRleHQgPSBjb21wb25lbnQ7XG4gIGJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZE1ldGhvZCA9IG1ldGhvZDtcbiAgYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQXJndW1lbnRzID0gbnVsbDtcblxuICB2YXIgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSxcbiAgICAgIF9iaW5kID0gYm91bmRNZXRob2QuYmluZDtcblxuICBib3VuZE1ldGhvZC5iaW5kID0gZnVuY3Rpb24gKG5ld1RoaXMpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgaWYgKG5ld1RoaXMgIT09IGNvbXBvbmVudCAmJiBuZXdUaGlzICE9PSBudWxsKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2JpbmQoKTogUmVhY3QgY29tcG9uZW50IG1ldGhvZHMgbWF5IG9ubHkgYmUgYm91bmQgdG8gdGhlICcgKyAnY29tcG9uZW50IGluc3RhbmNlLiBTZWUgJyArIGNvbXBvbmVudE5hbWUpO1xuICAgIH0gZWxzZSBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2JpbmQoKTogWW91IGFyZSBiaW5kaW5nIGEgY29tcG9uZW50IG1ldGhvZCB0byB0aGUgY29tcG9uZW50LiAnICsgJ1JlYWN0IGRvZXMgdGhpcyBmb3IgeW91IGF1dG9tYXRpY2FsbHkgaW4gYSBoaWdoLXBlcmZvcm1hbmNlICcgKyAnd2F5LCBzbyB5b3UgY2FuIHNhZmVseSByZW1vdmUgdGhpcyBjYWxsLiBTZWUgJyArIGNvbXBvbmVudE5hbWUpO1xuICAgICAgcmV0dXJuIGJvdW5kTWV0aG9kO1xuICAgIH1cblxuICAgIHZhciByZWJvdW5kTWV0aG9kID0gX2JpbmQuYXBwbHkoYm91bmRNZXRob2QsIGFyZ3VtZW50cyk7XG4gICAgcmVib3VuZE1ldGhvZC5fX3JlYWN0Qm91bmRDb250ZXh0ID0gY29tcG9uZW50O1xuICAgIHJlYm91bmRNZXRob2QuX19yZWFjdEJvdW5kTWV0aG9kID0gbWV0aG9kO1xuICAgIHJlYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQXJndW1lbnRzID0gYXJncztcblxuICAgIHJldHVybiByZWJvdW5kTWV0aG9kO1xuICB9O1xuXG4gIHJldHVybiBib3VuZE1ldGhvZDtcbn1cblxuZnVuY3Rpb24gYmluZEF1dG9CaW5kTWV0aG9kc0Zyb21NYXAoY29tcG9uZW50KSB7XG4gIGZvciAodmFyIGF1dG9CaW5kS2V5IGluIGNvbXBvbmVudC5fX3JlYWN0QXV0b0JpbmRNYXApIHtcbiAgICBpZiAoIWNvbXBvbmVudC5fX3JlYWN0QXV0b0JpbmRNYXAuaGFzT3duUHJvcGVydHkoYXV0b0JpbmRLZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVHdlYWs6IHNraXAgbWV0aG9kcyB0aGF0IGFyZSBhbHJlYWR5IGJvdW5kLlxuICAgIC8vIFRoaXMgaXMgdG8gcHJlc2VydmUgbWV0aG9kIHJlZmVyZW5jZSBpbiBjYXNlIGl0IGlzIHVzZWRcbiAgICAvLyBhcyBhIHN1YnNjcmlwdGlvbiBoYW5kbGVyIHRoYXQgbmVlZHMgdG8gYmUgZGV0YWNoZWQgbGF0ZXIuXG4gICAgaWYgKGNvbXBvbmVudC5oYXNPd25Qcm9wZXJ0eShhdXRvQmluZEtleSkgJiYgY29tcG9uZW50W2F1dG9CaW5kS2V5XS5fX3JlYWN0Qm91bmRDb250ZXh0ID09PSBjb21wb25lbnQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBtZXRob2QgPSBjb21wb25lbnQuX19yZWFjdEF1dG9CaW5kTWFwW2F1dG9CaW5kS2V5XTtcbiAgICBjb21wb25lbnRbYXV0b0JpbmRLZXldID0gYmluZEF1dG9CaW5kTWV0aG9kKGNvbXBvbmVudCwgbWV0aG9kKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBiaW5kQXV0b0JpbmRNZXRob2RzKGNvbXBvbmVudCkge1xuICBpZiAoY29tcG9uZW50Ll9fcmVhY3RBdXRvQmluZFBhaXJzKSB7XG4gICAgYmluZEF1dG9CaW5kTWV0aG9kc0Zyb21BcnJheShjb21wb25lbnQpO1xuICB9IGVsc2UgaWYgKGNvbXBvbmVudC5fX3JlYWN0QXV0b0JpbmRNYXApIHtcbiAgICBiaW5kQXV0b0JpbmRNZXRob2RzRnJvbU1hcChjb21wb25lbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJpbmRBdXRvQmluZE1ldGhvZHNGcm9tQXJyYXkoY29tcG9uZW50KSB7XG4gIHZhciBwYWlycyA9IGNvbXBvbmVudC5fX3JlYWN0QXV0b0JpbmRQYWlycztcblxuICBpZiAoIXBhaXJzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWlycy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHZhciBhdXRvQmluZEtleSA9IHBhaXJzW2ldO1xuXG4gICAgaWYgKGNvbXBvbmVudC5oYXNPd25Qcm9wZXJ0eShhdXRvQmluZEtleSkgJiYgY29tcG9uZW50W2F1dG9CaW5kS2V5XS5fX3JlYWN0Qm91bmRDb250ZXh0ID09PSBjb21wb25lbnQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBtZXRob2QgPSBwYWlyc1tpICsgMV07XG5cbiAgICBjb21wb25lbnRbYXV0b0JpbmRLZXldID0gYmluZEF1dG9CaW5kTWV0aG9kKGNvbXBvbmVudCwgbWV0aG9kKTtcbiAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9zbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9IHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgcmV0dXJuIGFycjsgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHsgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTsgfSBlbHNlIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH0gfTsgfSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBwcm94eUNsYXNzO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlQ2xhc3NQcm94eTtcblxudmFyIF9maW5kID0gcmVxdWlyZSgnbG9kYXNoL2ZpbmQnKTtcblxudmFyIF9maW5kMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZpbmQpO1xuXG52YXIgX2NyZWF0ZVByb3RvdHlwZVByb3h5ID0gcmVxdWlyZSgnLi9jcmVhdGVQcm90b3R5cGVQcm94eScpO1xuXG52YXIgX2NyZWF0ZVByb3RvdHlwZVByb3h5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZVByb3RvdHlwZVByb3h5KTtcblxudmFyIF9iaW5kQXV0b0JpbmRNZXRob2RzID0gcmVxdWlyZSgnLi9iaW5kQXV0b0JpbmRNZXRob2RzJyk7XG5cbnZhciBfYmluZEF1dG9CaW5kTWV0aG9kczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9iaW5kQXV0b0JpbmRNZXRob2RzKTtcblxudmFyIF9kZWxldGVVbmtub3duQXV0b0JpbmRNZXRob2RzID0gcmVxdWlyZSgnLi9kZWxldGVVbmtub3duQXV0b0JpbmRNZXRob2RzJyk7XG5cbnZhciBfZGVsZXRlVW5rbm93bkF1dG9CaW5kTWV0aG9kczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWxldGVVbmtub3duQXV0b0JpbmRNZXRob2RzKTtcblxudmFyIF9zdXBwb3J0c1Byb3RvQXNzaWdubWVudCA9IHJlcXVpcmUoJy4vc3VwcG9ydHNQcm90b0Fzc2lnbm1lbnQnKTtcblxudmFyIF9zdXBwb3J0c1Byb3RvQXNzaWdubWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdXBwb3J0c1Byb3RvQXNzaWdubWVudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgUkVTRVJWRURfU1RBVElDUyA9IFsnbGVuZ3RoJywgJ25hbWUnLCAnYXJndW1lbnRzJywgJ2NhbGxlcicsICdwcm90b3R5cGUnLCAndG9TdHJpbmcnXTtcblxuZnVuY3Rpb24gaXNFcXVhbERlc2NyaXB0b3IoYSwgYikge1xuICBpZiAoIWEgJiYgIWIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoIWEgfHwgIWIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICBpZiAoYVtrZXldICE9PSBiW2tleV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFRoaXMgd2FzIG9yaWdpbmFsbHkgYSBXZWFrTWFwIGJ1dCB3ZSBoYWQgaXNzdWVzIHdpdGggUmVhY3QgTmF0aXZlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dhZWFyb24vcmVhY3QtcHJveHkvaXNzdWVzLzUwI2lzc3VlY29tbWVudC0xOTI5MjgwNjZcbnZhciBhbGxQcm94aWVzID0gW107XG5mdW5jdGlvbiBmaW5kUHJveHkoQ29tcG9uZW50KSB7XG4gIHZhciBwYWlyID0gKDAsIF9maW5kMi5kZWZhdWx0KShhbGxQcm94aWVzLCBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBfcmVmMiA9IF9zbGljZWRUb0FycmF5KF9yZWYsIDEpO1xuXG4gICAgdmFyIGtleSA9IF9yZWYyWzBdO1xuICAgIHJldHVybiBrZXkgPT09IENvbXBvbmVudDtcbiAgfSk7XG4gIHJldHVybiBwYWlyID8gcGFpclsxXSA6IG51bGw7XG59XG5mdW5jdGlvbiBhZGRQcm94eShDb21wb25lbnQsIHByb3h5KSB7XG4gIGFsbFByb3hpZXMucHVzaChbQ29tcG9uZW50LCBwcm94eV0pO1xufVxuXG5mdW5jdGlvbiBwcm94eUNsYXNzKEluaXRpYWxDb21wb25lbnQpIHtcbiAgLy8gUHJldmVudCBkb3VibGUgd3JhcHBpbmcuXG4gIC8vIEdpdmVuIGEgcHJveHkgY2xhc3MsIHJldHVybiB0aGUgZXhpc3RpbmcgcHJveHkgbWFuYWdpbmcgaXQuXG4gIHZhciBleGlzdGluZ1Byb3h5ID0gZmluZFByb3h5KEluaXRpYWxDb21wb25lbnQpO1xuICBpZiAoZXhpc3RpbmdQcm94eSkge1xuICAgIHJldHVybiBleGlzdGluZ1Byb3h5O1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZVByb3h5ID0gKDAsIF9jcmVhdGVQcm90b3R5cGVQcm94eTIuZGVmYXVsdCkoKTtcbiAgdmFyIEN1cnJlbnRDb21wb25lbnQgPSB1bmRlZmluZWQ7XG4gIHZhciBQcm94eUNvbXBvbmVudCA9IHVuZGVmaW5lZDtcblxuICB2YXIgc3RhdGljRGVzY3JpcHRvcnMgPSB7fTtcbiAgZnVuY3Rpb24gd2FzU3RhdGljTW9kaWZpZWRCeVVzZXIoa2V5KSB7XG4gICAgLy8gQ29tcGFyZSB0aGUgZGVzY3JpcHRvciB3aXRoIHRoZSBvbmUgd2UgcHJldmlvdXNseSBzZXQgb3Vyc2VsdmVzLlxuICAgIHZhciBjdXJyZW50RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoUHJveHlDb21wb25lbnQsIGtleSk7XG4gICAgcmV0dXJuICFpc0VxdWFsRGVzY3JpcHRvcihzdGF0aWNEZXNjcmlwdG9yc1trZXldLCBjdXJyZW50RGVzY3JpcHRvcik7XG4gIH1cblxuICBmdW5jdGlvbiBpbnN0YW50aWF0ZShmYWN0b3J5LCBjb250ZXh0LCBwYXJhbXMpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gZmFjdG9yeSgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBjb21wb25lbnQuYXBwbHkoY29udGV4dCwgcGFyYW1zKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIE5hdGl2ZSBFUzYgY2xhc3MgaW5zdGFudGlhdGlvblxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgKEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmFwcGx5KGNvbXBvbmVudCwgW251bGxdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkocGFyYW1zKSkpKSgpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGluc3RhbmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBpZiAoUkVTRVJWRURfU1RBVElDUy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZXh0W2tleV0gPSBpbnN0YW5jZVtrZXldO1xuICAgICAgICB9KTtcbiAgICAgIH0pKCk7XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBDcmVhdGUgYSBwcm94eSBjb25zdHJ1Y3RvciB3aXRoIG1hdGNoaW5nIG5hbWVcbiAgICBQcm94eUNvbXBvbmVudCA9IG5ldyBGdW5jdGlvbignZmFjdG9yeScsICdpbnN0YW50aWF0ZScsICdyZXR1cm4gZnVuY3Rpb24gJyArIChJbml0aWFsQ29tcG9uZW50Lm5hbWUgfHwgJ1Byb3h5Q29tcG9uZW50JykgKyAnKCkge1xcbiAgICAgICAgIHJldHVybiBpbnN0YW50aWF0ZShmYWN0b3J5LCB0aGlzLCBhcmd1bWVudHMpO1xcbiAgICAgIH0nKShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gQ3VycmVudENvbXBvbmVudDtcbiAgICB9LCBpbnN0YW50aWF0ZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIFNvbWUgZW52aXJvbm1lbnRzIG1heSBmb3JiaWQgZHluYW1pYyBldmFsdWF0aW9uXG4gICAgUHJveHlDb21wb25lbnQgPSBmdW5jdGlvbiBQcm94eUNvbXBvbmVudCgpIHtcbiAgICAgIHJldHVybiBpbnN0YW50aWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBDdXJyZW50Q29tcG9uZW50O1xuICAgICAgfSwgdGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUG9pbnQgcHJveHkgY29uc3RydWN0b3IgdG8gdGhlIHByb3h5IHByb3RvdHlwZVxuICBQcm94eUNvbXBvbmVudC5wcm90b3R5cGUgPSBwcm90b3R5cGVQcm94eS5nZXQoKTtcblxuICAvLyBQcm94eSB0b1N0cmluZygpIHRvIHRoZSBjdXJyZW50IGNvbnN0cnVjdG9yXG4gIFByb3h5Q29tcG9uZW50LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIEN1cnJlbnRDb21wb25lbnQudG9TdHJpbmcoKTtcbiAgfTtcblxuICBmdW5jdGlvbiB1cGRhdGUoTmV4dENvbXBvbmVudCkge1xuICAgIGlmICh0eXBlb2YgTmV4dENvbXBvbmVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhIGNvbnN0cnVjdG9yLicpO1xuICAgIH1cblxuICAgIC8vIFByZXZlbnQgcHJveHkgY3ljbGVzXG4gICAgdmFyIGV4aXN0aW5nUHJveHkgPSBmaW5kUHJveHkoTmV4dENvbXBvbmVudCk7XG4gICAgaWYgKGV4aXN0aW5nUHJveHkpIHtcbiAgICAgIHJldHVybiB1cGRhdGUoZXhpc3RpbmdQcm94eS5fX2dldEN1cnJlbnQoKSk7XG4gICAgfVxuXG4gICAgLy8gU2F2ZSB0aGUgbmV4dCBjb25zdHJ1Y3RvciBzbyB3ZSBjYWxsIGl0XG4gICAgQ3VycmVudENvbXBvbmVudCA9IE5leHRDb21wb25lbnQ7XG5cbiAgICAvLyBVcGRhdGUgdGhlIHByb3RvdHlwZSBwcm94eSB3aXRoIG5ldyBtZXRob2RzXG4gICAgdmFyIG1vdW50ZWRJbnN0YW5jZXMgPSBwcm90b3R5cGVQcm94eS51cGRhdGUoTmV4dENvbXBvbmVudC5wcm90b3R5cGUpO1xuXG4gICAgLy8gU2V0IHVwIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBzbyBhY2Nlc3NpbmcgdGhlIHN0YXRpY3Mgd29ya1xuICAgIFByb3h5Q29tcG9uZW50LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByb3h5Q29tcG9uZW50O1xuXG4gICAgLy8gU2V0IHVwIHRoZSBzYW1lIHByb3RvdHlwZSBmb3IgaW5oZXJpdGVkIHN0YXRpY3NcbiAgICBQcm94eUNvbXBvbmVudC5fX3Byb3RvX18gPSBOZXh0Q29tcG9uZW50Ll9fcHJvdG9fXztcblxuICAgIC8vIENvcHkgc3RhdGljIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhOZXh0Q29tcG9uZW50KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmIChSRVNFUlZFRF9TVEFUSUNTLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRpY0Rlc2NyaXB0b3IgPSBfZXh0ZW5kcyh7fSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihOZXh0Q29tcG9uZW50LCBrZXkpLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIENvcHkgc3RhdGljIHVubGVzcyB1c2VyIGhhcyByZWRlZmluZWQgaXQgYXQgcnVudGltZVxuICAgICAgaWYgKCF3YXNTdGF0aWNNb2RpZmllZEJ5VXNlcihrZXkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eUNvbXBvbmVudCwga2V5LCBzdGF0aWNEZXNjcmlwdG9yKTtcbiAgICAgICAgc3RhdGljRGVzY3JpcHRvcnNba2V5XSA9IHN0YXRpY0Rlc2NyaXB0b3I7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgb2xkIHN0YXRpYyBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoUHJveHlDb21wb25lbnQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKFJFU0VSVkVEX1NUQVRJQ1MuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBTa2lwIHN0YXRpY3MgdGhhdCBleGlzdCBvbiB0aGUgbmV4dCBjbGFzc1xuICAgICAgaWYgKE5leHRDb21wb25lbnQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFNraXAgbm9uLWNvbmZpZ3VyYWJsZSBzdGF0aWNzXG4gICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoUHJveHlDb21wb25lbnQsIGtleSk7XG4gICAgICBpZiAoZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci5jb25maWd1cmFibGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBEZWxldGUgc3RhdGljIHVubGVzcyB1c2VyIGhhcyByZWRlZmluZWQgaXQgYXQgcnVudGltZVxuICAgICAgaWYgKCF3YXNTdGF0aWNNb2RpZmllZEJ5VXNlcihrZXkpKSB7XG4gICAgICAgIGRlbGV0ZSBQcm94eUNvbXBvbmVudFtrZXldO1xuICAgICAgICBkZWxldGUgc3RhdGljRGVzY3JpcHRvcnNba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRyeSB0byBpbmZlciBkaXNwbGF5TmFtZVxuICAgIFByb3h5Q29tcG9uZW50LmRpc3BsYXlOYW1lID0gTmV4dENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fCBOZXh0Q29tcG9uZW50Lm5hbWU7XG5cbiAgICAvLyBXZSBtaWdodCBoYXZlIGFkZGVkIG5ldyBtZXRob2RzIHRoYXQgbmVlZCB0byBiZSBhdXRvLWJvdW5kXG4gICAgbW91bnRlZEluc3RhbmNlcy5mb3JFYWNoKF9iaW5kQXV0b0JpbmRNZXRob2RzMi5kZWZhdWx0KTtcbiAgICBtb3VudGVkSW5zdGFuY2VzLmZvckVhY2goX2RlbGV0ZVVua25vd25BdXRvQmluZE1ldGhvZHMyLmRlZmF1bHQpO1xuXG4gICAgLy8gTGV0IHRoZSB1c2VyIHRha2UgY2FyZSBvZiByZWRyYXdpbmdcbiAgICByZXR1cm4gbW91bnRlZEluc3RhbmNlcztcbiAgfTtcblxuICBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIFByb3h5Q29tcG9uZW50O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudCgpIHtcbiAgICByZXR1cm4gQ3VycmVudENvbXBvbmVudDtcbiAgfVxuXG4gIHVwZGF0ZShJbml0aWFsQ29tcG9uZW50KTtcblxuICB2YXIgcHJveHkgPSB7IGdldDogZ2V0LCB1cGRhdGU6IHVwZGF0ZSB9O1xuICBhZGRQcm94eShQcm94eUNvbXBvbmVudCwgcHJveHkpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm94eSwgJ19fZ2V0Q3VycmVudCcsIHtcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogZ2V0Q3VycmVudFxuICB9KTtcblxuICByZXR1cm4gcHJveHk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZhbGxiYWNrKENvbXBvbmVudCkge1xuICB2YXIgQ3VycmVudENvbXBvbmVudCA9IENvbXBvbmVudDtcblxuICByZXR1cm4ge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIEN1cnJlbnRDb21wb25lbnQ7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShOZXh0Q29tcG9uZW50KSB7XG4gICAgICBDdXJyZW50Q29tcG9uZW50ID0gTmV4dENvbXBvbmVudDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNsYXNzUHJveHkoQ29tcG9uZW50KSB7XG4gIHJldHVybiBDb21wb25lbnQuX19wcm90b19fICYmICgwLCBfc3VwcG9ydHNQcm90b0Fzc2lnbm1lbnQyLmRlZmF1bHQpKCkgPyBwcm94eUNsYXNzKENvbXBvbmVudCkgOiBjcmVhdGVGYWxsYmFjayhDb21wb25lbnQpO1xufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZVByb3RvdHlwZVByb3h5O1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ2xvZGFzaC9hc3NpZ24nKTtcblxudmFyIF9hc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXNzaWduKTtcblxudmFyIF9kaWZmZXJlbmNlID0gcmVxdWlyZSgnbG9kYXNoL2RpZmZlcmVuY2UnKTtcblxudmFyIF9kaWZmZXJlbmNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RpZmZlcmVuY2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBjcmVhdGVQcm90b3R5cGVQcm94eSgpIHtcbiAgdmFyIHByb3h5ID0ge307XG4gIHZhciBjdXJyZW50ID0gbnVsbDtcbiAgdmFyIG1vdW50ZWRJbnN0YW5jZXMgPSBbXTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHByb3hpZWQgdG9TdHJpbmcoKSBtZXRob2QgcG9pbnRpbmcgdG8gdGhlIGN1cnJlbnQgdmVyc2lvbidzIHRvU3RyaW5nKCkuXG4gICAqL1xuICBmdW5jdGlvbiBwcm94eVRvU3RyaW5nKG5hbWUpIHtcbiAgICAvLyBXcmFwIHRvIGFsd2F5cyBjYWxsIHRoZSBjdXJyZW50IHZlcnNpb25cbiAgICByZXR1cm4gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRbbmFtZV0udG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnPG1ldGhvZCB3YXMgZGVsZXRlZD4nO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHByb3hpZWQgbWV0aG9kIHRoYXQgY2FsbHMgdGhlIGN1cnJlbnQgdmVyc2lvbiwgd2hlbmV2ZXIgYXZhaWxhYmxlLlxuICAgKi9cbiAgZnVuY3Rpb24gcHJveHlNZXRob2QobmFtZSkge1xuICAgIC8vIFdyYXAgdG8gYWx3YXlzIGNhbGwgdGhlIGN1cnJlbnQgdmVyc2lvblxuICAgIHZhciBwcm94aWVkTWV0aG9kID0gZnVuY3Rpb24gcHJveGllZE1ldGhvZCgpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VycmVudFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gY3VycmVudFtuYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDb3B5IHByb3BlcnRpZXMgb2YgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLCBpZiBhbnlcbiAgICAoMCwgX2Fzc2lnbjIuZGVmYXVsdCkocHJveGllZE1ldGhvZCwgY3VycmVudFtuYW1lXSk7XG4gICAgcHJveGllZE1ldGhvZC50b1N0cmluZyA9IHByb3h5VG9TdHJpbmcobmFtZSk7XG5cbiAgICByZXR1cm4gcHJveGllZE1ldGhvZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdWdtZW50cyB0aGUgb3JpZ2luYWwgY29tcG9uZW50RGlkTW91bnQgd2l0aCBpbnN0YW5jZSB0cmFja2luZy5cbiAgICovXG4gIGZ1bmN0aW9uIHByb3hpZWRDb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBtb3VudGVkSW5zdGFuY2VzLnB1c2godGhpcyk7XG4gICAgaWYgKHR5cGVvZiBjdXJyZW50LmNvbXBvbmVudERpZE1vdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gY3VycmVudC5jb21wb25lbnREaWRNb3VudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuICBwcm94aWVkQ29tcG9uZW50RGlkTW91bnQudG9TdHJpbmcgPSBwcm94eVRvU3RyaW5nKCdjb21wb25lbnREaWRNb3VudCcpO1xuXG4gIC8qKlxuICAgKiBBdWdtZW50cyB0aGUgb3JpZ2luYWwgY29tcG9uZW50V2lsbFVubW91bnQgd2l0aCBpbnN0YW5jZSB0cmFja2luZy5cbiAgICovXG4gIGZ1bmN0aW9uIHByb3hpZWRDb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB2YXIgaW5kZXggPSBtb3VudGVkSW5zdGFuY2VzLmluZGV4T2YodGhpcyk7XG4gICAgLy8gVW5sZXNzIHdlJ3JlIGluIGEgd2VpcmQgZW52aXJvbm1lbnQgd2l0aG91dCBjb21wb25lbnREaWRNb3VudFxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG1vdW50ZWRJbnN0YW5jZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjdXJyZW50LmNvbXBvbmVudFdpbGxVbm1vdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gY3VycmVudC5jb21wb25lbnRXaWxsVW5tb3VudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuICBwcm94aWVkQ29tcG9uZW50V2lsbFVubW91bnQudG9TdHJpbmcgPSBwcm94eVRvU3RyaW5nKCdjb21wb25lbnRXaWxsVW5tb3VudCcpO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgcHJvcGVydHkgb24gdGhlIHByb3h5LlxuICAgKi9cbiAgZnVuY3Rpb24gZGVmaW5lUHJveHlQcm9wZXJ0eShuYW1lLCBkZXNjcmlwdG9yKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3h5LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgcHJvcGVydHksIGF0dGVtcHRpbmcgdG8ga2VlcCB0aGUgb3JpZ2luYWwgZGVzY3JpcHRvciBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gZGVmaW5lUHJveHlQcm9wZXJ0eVdpdGhWYWx1ZShuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBfcmVmID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjdXJyZW50LCBuYW1lKSB8fCB7fTtcblxuICAgIHZhciBfcmVmJGVudW1lcmFibGUgPSBfcmVmLmVudW1lcmFibGU7XG4gICAgdmFyIGVudW1lcmFibGUgPSBfcmVmJGVudW1lcmFibGUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRlbnVtZXJhYmxlO1xuICAgIHZhciBfcmVmJHdyaXRhYmxlID0gX3JlZi53cml0YWJsZTtcbiAgICB2YXIgd3JpdGFibGUgPSBfcmVmJHdyaXRhYmxlID09PSB1bmRlZmluZWQgPyB0cnVlIDogX3JlZiR3cml0YWJsZTtcblxuXG4gICAgZGVmaW5lUHJveHlQcm9wZXJ0eShuYW1lLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBlbnVtZXJhYmxlLFxuICAgICAgd3JpdGFibGU6IHdyaXRhYmxlLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhdXRvLWJpbmQgbWFwIG1pbWlja2luZyB0aGUgb3JpZ2luYWwgbWFwLCBidXQgZGlyZWN0ZWQgYXQgcHJveHkuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVBdXRvQmluZE1hcCgpIHtcbiAgICBpZiAoIWN1cnJlbnQuX19yZWFjdEF1dG9CaW5kTWFwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIF9fcmVhY3RBdXRvQmluZE1hcCA9IHt9O1xuICAgIGZvciAodmFyIG5hbWUgaW4gY3VycmVudC5fX3JlYWN0QXV0b0JpbmRNYXApIHtcbiAgICAgIGlmICh0eXBlb2YgcHJveHlbbmFtZV0gPT09ICdmdW5jdGlvbicgJiYgY3VycmVudC5fX3JlYWN0QXV0b0JpbmRNYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgX19yZWFjdEF1dG9CaW5kTWFwW25hbWVdID0gcHJveHlbbmFtZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9fcmVhY3RBdXRvQmluZE1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGF1dG8tYmluZCBtYXAgbWltaWNraW5nIHRoZSBvcmlnaW5hbCBtYXAsIGJ1dCBkaXJlY3RlZCBhdCBwcm94eS5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUF1dG9CaW5kUGFpcnMoKSB7XG4gICAgdmFyIF9fcmVhY3RBdXRvQmluZFBhaXJzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnQuX19yZWFjdEF1dG9CaW5kUGFpcnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gY3VycmVudC5fX3JlYWN0QXV0b0JpbmRQYWlyc1tpXTtcbiAgICAgIHZhciBtZXRob2QgPSBwcm94eVtuYW1lXTtcblxuICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX19yZWFjdEF1dG9CaW5kUGFpcnMucHVzaChuYW1lLCBtZXRob2QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfX3JlYWN0QXV0b0JpbmRQYWlycztcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSB1cGRhdGVkIHByb3RvdHlwZS5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShuZXh0KSB7XG4gICAgLy8gU2F2ZSBjdXJyZW50IHNvdXJjZSBvZiB0cnV0aFxuICAgIGN1cnJlbnQgPSBuZXh0O1xuXG4gICAgLy8gRmluZCBjaGFuZ2VkIHByb3BlcnR5IG5hbWVzXG4gICAgdmFyIGN1cnJlbnROYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGN1cnJlbnQpO1xuICAgIHZhciBwcmV2aW91c05hbWUgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm94eSk7XG4gICAgdmFyIHJlbW92ZWROYW1lcyA9ICgwLCBfZGlmZmVyZW5jZTIuZGVmYXVsdCkocHJldmlvdXNOYW1lLCBjdXJyZW50TmFtZXMpO1xuXG4gICAgLy8gUmVtb3ZlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgdGhhdCBhcmUgbm8gbG9uZ2VyIHRoZXJlXG4gICAgcmVtb3ZlZE5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGRlbGV0ZSBwcm94eVtuYW1lXTtcbiAgICB9KTtcblxuICAgIC8vIENvcHkgZXZlcnkgZGVzY3JpcHRvclxuICAgIGN1cnJlbnROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY3VycmVudCwgbmFtZSk7XG4gICAgICBpZiAodHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gRnVuY3Rpb25zIHJlcXVpcmUgYWRkaXRpb25hbCB3cmFwcGluZyBzbyB0aGV5IGNhbiBiZSBib3VuZCBsYXRlclxuICAgICAgICBkZWZpbmVQcm94eVByb3BlcnR5V2l0aFZhbHVlKG5hbWUsIHByb3h5TWV0aG9kKG5hbWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyIHZhbHVlcyBjYW4gYmUgY29waWVkIGRpcmVjdGx5XG4gICAgICAgIGRlZmluZVByb3h5UHJvcGVydHkobmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUcmFjayBtb3VudGluZyBhbmQgdW5tb3VudGluZ1xuICAgIGRlZmluZVByb3h5UHJvcGVydHlXaXRoVmFsdWUoJ2NvbXBvbmVudERpZE1vdW50JywgcHJveGllZENvbXBvbmVudERpZE1vdW50KTtcbiAgICBkZWZpbmVQcm94eVByb3BlcnR5V2l0aFZhbHVlKCdjb21wb25lbnRXaWxsVW5tb3VudCcsIHByb3hpZWRDb21wb25lbnRXaWxsVW5tb3VudCk7XG5cbiAgICBpZiAoY3VycmVudC5oYXNPd25Qcm9wZXJ0eSgnX19yZWFjdEF1dG9CaW5kTWFwJykpIHtcbiAgICAgIGRlZmluZVByb3h5UHJvcGVydHlXaXRoVmFsdWUoJ19fcmVhY3RBdXRvQmluZE1hcCcsIGNyZWF0ZUF1dG9CaW5kTWFwKCkpO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50Lmhhc093blByb3BlcnR5KCdfX3JlYWN0QXV0b0JpbmRQYWlycycpKSB7XG4gICAgICBkZWZpbmVQcm94eVByb3BlcnR5V2l0aFZhbHVlKCdfX3JlYWN0QXV0b0JpbmRQYWlycycsIGNyZWF0ZUF1dG9CaW5kUGFpcnMoKSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW5cbiAgICBwcm94eS5fX3Byb3RvX18gPSBuZXh0O1xuXG4gICAgcmV0dXJuIG1vdW50ZWRJbnN0YW5jZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdXAtdG8tZGF0ZSBwcm94eSBwcm90b3R5cGUuXG4gICAqL1xuICBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICBnZXQ6IGdldFxuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBkZWxldGVVbmtub3duQXV0b0JpbmRNZXRob2RzO1xuZnVuY3Rpb24gc2hvdWxkRGVsZXRlQ2xhc3NpY0luc3RhbmNlTWV0aG9kKGNvbXBvbmVudCwgbmFtZSkge1xuICBpZiAoY29tcG9uZW50Ll9fcmVhY3RBdXRvQmluZE1hcCAmJiBjb21wb25lbnQuX19yZWFjdEF1dG9CaW5kTWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgLy8gSXQncyBhIGtub3duIGF1dG9ib3VuZCBmdW5jdGlvbiwga2VlcCBpdFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChjb21wb25lbnQuX19yZWFjdEF1dG9CaW5kUGFpcnMgJiYgY29tcG9uZW50Ll9fcmVhY3RBdXRvQmluZFBhaXJzLmluZGV4T2YobmFtZSkgPj0gMCkge1xuICAgIC8vIEl0J3MgYSBrbm93biBhdXRvYm91bmQgZnVuY3Rpb24sIGtlZXAgaXRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoY29tcG9uZW50W25hbWVdLl9fcmVhY3RCb3VuZEFyZ3VtZW50cyAhPT0gbnVsbCkge1xuICAgIC8vIEl0J3MgYSBmdW5jdGlvbiBib3VuZCB0byBzcGVjaWZpYyBhcmdzLCBrZWVwIGl0XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gSXQncyBhIGNhY2hlZCBib3VuZCBtZXRob2QgZm9yIGEgZnVuY3Rpb25cbiAgLy8gdGhhdCB3YXMgZGVsZXRlZCBieSB1c2VyLCBzbyB3ZSBkZWxldGUgaXQgZnJvbSBjb21wb25lbnQuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBzaG91bGREZWxldGVNb2Rlcm5JbnN0YW5jZU1ldGhvZChjb21wb25lbnQsIG5hbWUpIHtcbiAgdmFyIHByb3RvdHlwZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG5cbiAgdmFyIHByb3RvdHlwZURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG5cbiAgaWYgKCFwcm90b3R5cGVEZXNjcmlwdG9yIHx8ICFwcm90b3R5cGVEZXNjcmlwdG9yLmdldCkge1xuICAgIC8vIFRoaXMgaXMgZGVmaW5pdGVseSBub3QgYW4gYXV0b2JpbmRpbmcgZ2V0dGVyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHByb3RvdHlwZURlc2NyaXB0b3IuZ2V0KCkubGVuZ3RoICE9PSBjb21wb25lbnRbbmFtZV0ubGVuZ3RoKSB7XG4gICAgLy8gVGhlIGxlbmd0aCBkb2Vzbid0IG1hdGNoLCBiYWlsIG91dFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFRoaXMgc2VlbXMgbGlrZSBhIG1ldGhvZCBib3VuZCB1c2luZyBhbiBhdXRvYmluZGluZyBnZXR0ZXIgb24gdGhlIHByb3RvdHlwZVxuICAvLyBIb3BlZnVsbHkgd2Ugd29uJ3QgcnVuIGludG8gdG9vIG1hbnkgZmFsc2UgcG9zaXRpdmVzLlxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkRGVsZXRlSW5zdGFuY2VNZXRob2QoY29tcG9uZW50LCBuYW1lKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb21wb25lbnQsIG5hbWUpO1xuICBpZiAodHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBOb3QgYSBmdW5jdGlvbiwgb3Igc29tZXRoaW5nIGZhbmN5OiBiYWlsIG91dFxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb21wb25lbnQuX19yZWFjdEF1dG9CaW5kTWFwIHx8IGNvbXBvbmVudC5fX3JlYWN0QXV0b0JpbmRQYWlycykge1xuICAgIC8vIENsYXNzaWNcbiAgICByZXR1cm4gc2hvdWxkRGVsZXRlQ2xhc3NpY0luc3RhbmNlTWV0aG9kKGNvbXBvbmVudCwgbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTW9kZXJuXG4gICAgcmV0dXJuIHNob3VsZERlbGV0ZU1vZGVybkluc3RhbmNlTWV0aG9kKGNvbXBvbmVudCwgbmFtZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWxldGVzIGF1dG9ib3VuZCBtZXRob2RzIGZyb20gdGhlIGluc3RhbmNlLlxuICpcbiAqIEZvciBjbGFzc2ljIFJlYWN0IGNsYXNzZXMsIHdlIG9ubHkgZGVsZXRlIHRoZSBtZXRob2RzIHRoYXQgbm8gbG9uZ2VyIGV4aXN0IGluIG1hcC5cbiAqIFRoaXMgbWVhbnMgdGhlIHVzZXIgYWN0dWFsbHkgZGVsZXRlZCB0aGVtIGluIGNvZGUuXG4gKlxuICogRm9yIG1vZGVybiBjbGFzc2VzLCB3ZSBkZWxldGUgbWV0aG9kcyB0aGF0IGV4aXN0IG9uIHByb3RvdHlwZSB3aXRoIHRoZSBzYW1lIGxlbmd0aCxcbiAqIGFuZCB3aGljaCBoYXZlIGdldHRlcnMgb24gcHJvdG90eXBlLCBidXQgYXJlIG5vcm1hbCB2YWx1ZXMgb24gdGhlIGluc3RhbmNlLlxuICogVGhpcyBpcyB1c3VhbGx5IGFuIGluZGljYXRpb24gdGhhdCBhbiBhdXRvYmluZGluZyBkZWNvcmF0b3IgaXMgYmVpbmcgdXNlZCxcbiAqIGFuZCB0aGUgZ2V0dGVyIHdpbGwgcmUtZ2VuZXJhdGUgdGhlIG1lbW9pemVkIGhhbmRsZXIgb24gbmV4dCBhY2Nlc3MuXG4gKi9cbmZ1bmN0aW9uIGRlbGV0ZVVua25vd25BdXRvQmluZE1ldGhvZHMoY29tcG9uZW50KSB7XG4gIHZhciBuYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNvbXBvbmVudCk7XG5cbiAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaG91bGREZWxldGVJbnN0YW5jZU1ldGhvZChjb21wb25lbnQsIG5hbWUpKSB7XG4gICAgICBkZWxldGUgY29tcG9uZW50W25hbWVdO1xuICAgIH1cbiAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5nZXRGb3JjZVVwZGF0ZSA9IGV4cG9ydHMuY3JlYXRlUHJveHkgPSB1bmRlZmluZWQ7XG5cbnZhciBfc3VwcG9ydHNQcm90b0Fzc2lnbm1lbnQgPSByZXF1aXJlKCcuL3N1cHBvcnRzUHJvdG9Bc3NpZ25tZW50Jyk7XG5cbnZhciBfc3VwcG9ydHNQcm90b0Fzc2lnbm1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3VwcG9ydHNQcm90b0Fzc2lnbm1lbnQpO1xuXG52YXIgX2NyZWF0ZUNsYXNzUHJveHkgPSByZXF1aXJlKCcuL2NyZWF0ZUNsYXNzUHJveHknKTtcblxudmFyIF9jcmVhdGVDbGFzc1Byb3h5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzUHJveHkpO1xuXG52YXIgX3JlYWN0RGVlcEZvcmNlVXBkYXRlID0gcmVxdWlyZSgncmVhY3QtZGVlcC1mb3JjZS11cGRhdGUnKTtcblxudmFyIF9yZWFjdERlZXBGb3JjZVVwZGF0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERlZXBGb3JjZVVwZGF0ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmlmICghKDAsIF9zdXBwb3J0c1Byb3RvQXNzaWdubWVudDIuZGVmYXVsdCkoKSkge1xuICBjb25zb2xlLndhcm4oJ1RoaXMgSmF2YVNjcmlwdCBlbnZpcm9ubWVudCBkb2VzIG5vdCBzdXBwb3J0IF9fcHJvdG9fXy4gJyArICdUaGlzIG1lYW5zIHRoYXQgcmVhY3QtcHJveHkgaXMgdW5hYmxlIHRvIHByb3h5IFJlYWN0IGNvbXBvbmVudHMuICcgKyAnRmVhdHVyZXMgdGhhdCByZWx5IG9uIHJlYWN0LXByb3h5LCBzdWNoIGFzIHJlYWN0LXRyYW5zZm9ybS1obXIsICcgKyAnd2lsbCBub3QgZnVuY3Rpb24gYXMgZXhwZWN0ZWQuJyk7XG59XG5cbmV4cG9ydHMuY3JlYXRlUHJveHkgPSBfY3JlYXRlQ2xhc3NQcm94eTIuZGVmYXVsdDtcbmV4cG9ydHMuZ2V0Rm9yY2VVcGRhdGUgPSBfcmVhY3REZWVwRm9yY2VVcGRhdGUyLmRlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBzdXBwb3J0c1Byb3RvQXNzaWdubWVudDtcbnZhciB4ID0ge307XG52YXIgeSA9IHsgc3VwcG9ydHM6IHRydWUgfTtcbnRyeSB7XG4gIHguX19wcm90b19fID0geTtcbn0gY2F0Y2ggKGVycikge31cblxuZnVuY3Rpb24gc3VwcG9ydHNQcm90b0Fzc2lnbm1lbnQoKSB7XG4gIHJldHVybiB4LnN1cHBvcnRzIHx8IGZhbHNlO1xufTsiLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSwgZXZhbCkoXCJ0aGlzXCIpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0aWYgKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XG5cdFx0bW9kdWxlLnBhdGhzID0gW107XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xuXHR9XG5cdHJldHVybiBtb2R1bGU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50LCBDb21wb25lbnQsIHJlbmRlciB9IGZyb20gJ3JheCc7XHJcbmltcG9ydCB7IFZpZXcsIFRleHQsIFRvdWNoYWJsZSwgQ2hlY2tCb3gsIEltYWdlLCBEaW1lbnNpb25zLCBJbnB1dCwgU2Nyb2xsVmlldywgTW9kYWwsIFRpbWVQaWNrZXIgfSBmcm9tICdudWtlJztcclxuaW1wb3J0IFFOIGZyb20gJ1FBUC1TREsnO1xyXG5cclxuLy8gaW1wb3J0IHsgSE4sIEhOYXBpIH0gZnJvbSBcIiRyb290L3B1YmxpYy9qcy9ITl9hcGkuanNcIjtcclxuLy8gaW1wb3J0IEhOY3NzIGZyb20gJyRyb290L3B1YmxpYy9jc3MvaG5fdWkubGVzcyc7XHJcbmltcG9ydCBJbmNzcyBmcm9tICcuL2luZGV4Mi5sZXNzJztcclxuXHJcbi8vIGltcG9ydCBOb0RhdGEgZnJvbSBcIiRyb290L2NvbXBvbmVudHMvTm9EYXRhXCI7XHJcbi8vIGltcG9ydCBJY29uRm9udCBmcm9tICckcm9vdC9jb21wb25lbnRzL2ljb24vaWNvbkZvbnQnO1xyXG4vLyBpbXBvcnQgQ2hlY2tCb3ggZnJvbSAnJHJvb3QvY29tcG9uZW50cy9DaGVja2JveCc7XHJcblxyXG5jb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IERpbWVuc2lvbnMuZ2V0KCd3aW5kb3cnKTtcclxuXHJcbmNsYXNzIEhvbWUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgaWNvbjogeyB3YXRlcl9pZDogdGhpcy5wcm9wcy53YXRlcl9pZCB9LFxyXG4gICAgICAgICAgICBudW1faWlkczogdGhpcy5wcm9wcy5udW1faWlkcyxcclxuICAgICAgICAgICAgbm9EYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgbGlzdDogW10sXHJcbiAgICAgICAgICAgIGluZGV4UGljOiAnJyxcclxuICAgICAgICAgICAgaXB0VmFsOiAn5oqV5pS+JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCAgLy8g5rS75Yqo5ZCN56ewXHJcbiAgICAgICAgICAgIG1vZGVsOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmlrnlm74v6ZW/5Zu+5qih5byPXHJcbiAgICAgICAgICAgIFRGUG9zaXRpb246IFsxLCAwLCAwLCAwLCAwLCAwXSwgICAgICAgICAvLyDmipXmlL7kvY3nva5cclxuICAgICAgICAgICAgbWV0aG9kOiBbMiwgMF0sICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaKleaUvuaWueW8j1xyXG4gICAgICAgICAgICB0aW1lOiBbJ+ivt+mAieaLqScsICfor7fpgInmi6knXSwgICAgICAgICAgICAgIC8vIOaKleaUvuaXtumXtO+8iOW8gOWniy/nu5PmnZ/vvIlcclxuICAgICAgICAgICAgaXNOZWVkUExKOiBudWxsLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy/nu4Tku7bljbPlsIbliqDovb1cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICAvLyB0aGlzLmdldERhdGEoKTtcclxuICAgICAgICAvLyB0aGlzLmdldEljb25Qb3NpdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOiOt+WPluWbvuagh+S9jee9rlxyXG4gICAgLy8gZ2V0SWNvblBvc2l0aW9uKCkge1xyXG4gICAgLy8gICAgIEhOLl9hamF4KCdXYXRlcm1hcmsuSW5kZXguZ2V0RGV0YWlsJywgeyB3YXRlcl9pZDogdGhpcy5zdGF0ZS5pY29uLndhdGVyX2lkIH0sICdQT1NUJykudGhlbihyZXMgPT4ge1xyXG4gICAgLy8gICAgICAgICBpZiAocmVzLmNvZGUgPT0gODAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAocmVzLmRhdGEpIHtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUubnVtX2lpZHMpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBpc05lZWRQTEo6IHJlcy5kYXRhLml4X2N4XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnNldExpc3RTdGF0ZSgnaWNvbicsIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdXJsOiByZXMuZGF0YS5waWNfdXJsLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBsZWZ0OiByZXMuZGF0YS5sZWZ0LFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0b3A6IHJlcy5kYXRhLnRvcCxcclxuICAgIC8vICAgICAgICAgICAgICAgICB9KVxyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgTW9kYWwudG9hc3QocmVzLm1zZyk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHNldExpc3RTdGF0ZShsaXN0LCBkYXRhKSB7XHJcbiAgICAvLyAgICAgbGV0IG5ld1N0YXRlID0gT2JqZWN0LmFzc2lnbih0aGlzLnN0YXRlW2xpc3RdLCBkYXRhKTtcclxuICAgIC8vICAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAvLyDojrflj5YxMOS4quWVhuWTgS3jgJDmm7TmjaLlrp3otJ3jgJFcclxuICAgIC8vIGdldERhdGEoKSB7XHJcbiAgICAvLyAgICAgSE5hcGkuc2VhcmNoLmdldE9uc2FsZUdvb2RzKHtcclxuICAgIC8vICAgICAgICAgcGFnZV9ubzogMSxcclxuICAgIC8vICAgICAgICAgcGFnZV9zaXplOiAxMFxyXG4gICAgLy8gICAgIH0pLnRoZW4ocmVzID0+IHtcclxuICAgIC8vICAgICAgICAgaWYgKHJlcy5jb2RlID09IDgwMCkge1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHJlcy5kYXRhLml0ZW1zICYmIHJlcy5kYXRhLml0ZW1zLml0ZW0ubGVuZ3RoID4gMCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgIC8vICAgICAgICAgICAgICAgICByZXMuZGF0YS5pdGVtcy5pdGVtLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goaXRlbS5waWNfdXJsKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgbGlzdDogWy4uLmFycl0sXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGluZGV4UGljOiBhcnJbMF1cclxuICAgIC8vICAgICAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy/lh7rllK7kuK3msqHmnInljrvku5PlupPkuK3mib5cclxuICAgIC8vICAgICAgICAgICAgICAgICBITmFwaS5zZWFyY2guZ2V0SXRlbXNJbnZlbnRvcnkoe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBwYWdlX25vOiAxLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBwYWdlX3NpemU6IDEwXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfSkudGhlbihyZXMgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmNvZGUgPT0gODAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuaXRlbXMgJiYgcmVzLmRhdGEuaXRlbXMuaXRlbS5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGEuaXRlbXMuaXRlbS5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0ucGljX3VybCk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyLmpvaW4oJywnKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdDogWy4uLmFycl0sXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub0RhdGE6IHRydWUsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICB9KVxyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSlcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBjbGlja0J0blNhdmUgPSAoKSA9PiB7XHJcbiAgICAvLyAgICAgUU4ubmF2aWdhdG9yLnB1c2goe1xyXG4gICAgLy8gICAgICAgICB1cmw6ICdxYXA6Ly8vWlRUQi1hZGRHb29kcy5qcycsXHJcbiAgICAvLyAgICAgICAgIHF1ZXJ5OiB7IHR5cGU6ICdBZGRHb29kcycgfSxcclxuICAgIC8vICAgICB9KVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGNoYW5nZU1vZGVsID0gKGlkeCkgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgLy8gICAgICAgICBtb2RlbDogaWR4XHJcbiAgICAvLyAgICAgfSlcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBjaGFuZ2VQaWMoKSB7XHJcbiAgICAvLyAgICAgbGV0IGxpc3QgPSB0aGlzLnN0YXRlLmxpc3Q7XHJcbiAgICAvLyAgICAgbGV0IG51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxpc3QubGVuZ3RoKTtcclxuICAgIC8vICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgIC8vICAgICAgICAgaW5kZXhQaWM6IGxpc3RbbnVtXVxyXG4gICAgLy8gICAgIH0pXHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gLy/mlLnlj5jovpPlhaXmoYbnmoTlgLxcclxuICAgIC8vIGNoYW5nZSA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMuc2V0U3RhdGUoeyBpcHRWYWw6IHZhbHVlIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIC8v5oqV5pS+5L2N572uXHJcbiAgICAvLyBzZWxlY3RURlBvc2l0aW9uID0gKGlkeCkgPT4ge1xyXG4gICAgLy8gICAgIGxldCBURlBvc2l0aW9uID0gdGhpcy5zdGF0ZS5URlBvc2l0aW9uO1xyXG4gICAgLy8gICAgIFRGUG9zaXRpb25baWR4XSA9IFRGUG9zaXRpb25baWR4XSA/IDAgOiAxO1xyXG4gICAgLy8gICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgLy8gICAgICAgICBURlBvc2l0aW9uOiBURlBvc2l0aW9uXHJcbiAgICAvLyAgICAgfSlcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAvL+aKleaUvuaWueW8j1xyXG4gICAgLy8gc2VsZWN0VEZNZXRob2QgPSAoaWR4KSA9PiB7XHJcbiAgICAvLyAgICAgbGV0IGFyciA9IFswLCAwXTtcclxuICAgIC8vICAgICBhcnJbaWR4XSA9IDI7XHJcbiAgICAvLyAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAvLyAgICAgICAgIG1ldGhvZDogYXJyXHJcbiAgICAvLyAgICAgfSlcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAvL+aKleaUvuaXtumXtFxyXG4gICAgLy8gc2VsZWN0VEZUaW1lID0gKGlkeCkgPT4ge1xyXG4gICAgLy8gICAgIGxldCBkYXRlID0gSE4uc2V0TmRheURhdGUoNyk7XHJcbiAgICAvLyAgICAgVGltZVBpY2tlci5zaG93KHtcclxuICAgIC8vICAgICAgICAgdGl0bGU6ICfor7fpgInmi6nml7bpl7QnLFxyXG4gICAgLy8gICAgICAgICBkZWZhdWx0OiBpZHggPyBkYXRlLm9sZF9kYXkucmVwbGFjZSgvXFwvL2csICctJykgOiBITi5zZXROTWludXRlRGF0ZSgxMCksXHJcbiAgICAvLyAgICAgICAgIHR5cGU6ICdkYXRldGltZSdcclxuICAgIC8vICAgICB9LCAocmVzKSA9PiB7XHJcbiAgICAvLyAgICAgICAgIGxldCB0aW1lID0gcmVzLnJlcGxhY2UoL1xcLy9nLCAnLScpO1xyXG4gICAgLy8gICAgICAgICBsZXQgX3RpbWUgPSB0aGlzLnN0YXRlLnRpbWU7XHJcbiAgICAvLyAgICAgICAgIGlmICghaWR4KSB7XHJcbiAgICAvLyAgICAgICAgICAgICBsZXQgZGYgPSBITi50aW1lRGlmZmVyZW5jZShkYXRlLm5ld19kYXkucmVwbGFjZSgvXFwvL2csICctJyksIHRpbWUpO1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKGRmLl9kYXRlMyA8IDEwMDAgKiA2MCAqIDEwIC0gMTAgKiAxMDAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGltZSA9IEhOLnNldE5NaW51dGVEYXRlKDEwKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICBNb2RhbC50b2FzdCgn5byA5aeL5pe26Ze05pyA5pep5Li65b2T5YmN5pe26Ze0MTDliIbpkp/ku6XlkI4nKTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgICAgX3RpbWVbaWR4XSA9IHRpbWU7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgLy8gICAgICAgICAgICAgdGltZTogX3RpbWVcclxuICAgIC8vICAgICAgICAgfSlcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAvL2FqYXgt5Yib5bu65rS75YqoXHJcbiAgICAvLyBjcmVhdGVBY3QgPSAoKSA9PiB7XHJcbiAgICAvLyAgICAgbGV0IHBhcmFtcyA9IHtcclxuICAgIC8vICAgICAgICAgdHBpZDogdGhpcy5zdGF0ZS5pY29uLndhdGVyX2lkLFxyXG4gICAgLy8gICAgICAgICBhY3RfbmFtZTogdGhpcy5zdGF0ZS5pcHRWYWwsXHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIGxldCBfYXJyID0gW107XHJcbiAgICAvLyAgICAgdGhpcy5zdGF0ZS5URlBvc2l0aW9uLmZvckVhY2goKGl0ZW0sIGlkeCkgPT4ge1xyXG4gICAgLy8gICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgLy8gICAgICAgICAgICAgX2Fyci5wdXNoKGlkeCArIDEpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSlcclxuXHJcbiAgICAvLyAgICAgcGFyYW1zLnBvc2l0aW9uID0gX2Fyci5qb2luKCcsJyk7XHJcbiAgICAvLyAgICAgcGFyYW1zLm1haW5fcGxhY2UgPSBbe1xyXG4gICAgLy8gICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLmljb24ubGVmdCxcclxuICAgIC8vICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLmljb24udG9wLFxyXG4gICAgLy8gICAgIH1dXHJcblxyXG5cclxuICAgIC8vICAgICAvLzgwMCoxMjAw5LiL55qE5YGP56e76YePXHJcbiAgICAvLyAgICAgbGV0IGxvbmdMZWZ0ID0gODAwICogdGhpcy5zdGF0ZS5pY29uLmxlZnQgLyA3NTA7XHJcbiAgICAvLyAgICAgbGV0IGxvbmdUb3AgPSAxMjAwICogdGhpcy5zdGF0ZS5pY29uLnRvcCAvIDc1MDtcclxuICAgIC8vICAgICBwYXJhbXMubG9uZ19wbGFjZSA9IFt7XHJcbiAgICAvLyAgICAgICAgIGxlZnQ6IGxvbmdMZWZ0LFxyXG4gICAgLy8gICAgICAgICB0b3A6IGxvbmdUb3AsXHJcbiAgICAvLyAgICAgfV1cclxuICAgIC8vICAgICBpZiAodGhpcy5zdGF0ZS5tZXRob2RbMV0pIHtcclxuICAgIC8vICAgICAgICAgcGFyYW1zLnN0aW1lID0gdGhpcy5zdGF0ZS50aW1lWzBdO1xyXG4gICAgLy8gICAgICAgICBwYXJhbXMuZXRpbWUgPSB0aGlzLnN0YXRlLnRpbWVbMV07XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIFFOLnNob3dMb2FkaW5nKHtcclxuICAgIC8vICAgICAgICAgcXVlcnk6IHtcclxuICAgIC8vICAgICAgICAgICAgIHRleHQ6ICfmraPlnKjliJvlu7rmtLvliqggfn4nXHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KVxyXG4gICAgLy8gICAgIEhOLl9hamF4KCdXYXRlcm1hcmsuSW5kZXgucHV0X21hbmFnZScsIHBhcmFtcywgJ1BPU1QnKS50aGVuKHJlcyA9PiB7XHJcbiAgICAvLyAgICAgICAgIE1vZGFsLnRvYXN0KHJlcy5tc2cpO1xyXG4gICAgLy8gICAgICAgICBRTi5oaWRlTG9hZGluZygpO1xyXG4gICAgLy8gICAgICAgICBpZiAocmVzLmNvZGUgPT0gODAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmxpbmtUbyhyZXMuZGF0YSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9LCBlcnIgPT4ge1xyXG4gICAgLy8gICAgICAgICBNb2RhbC50b2FzdChlcnIpO1xyXG4gICAgLy8gICAgIH0pXHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gLyoqXHJcbiAgICAvLyAgKiDngrnlh7vlnLDmraXmjInpkq5cclxuICAgIC8vICAqIDHjgIHku47kuLvlm77ot7Povazov4fmnaUgLT4g5re75Yqg5a6d6LSd6aG16Z2iXHJcbiAgICAvLyAgKiAy44CB5LuO5ZWG5ZOB566h55CG6L+H5p2lIC0+XHJcbiAgICAvLyAgKiAgICAgIDHvvInpnIDopoHorr7nva7miqvpnLLku7ctLT4g6K6+572u5oqr6Zyy5Lu36aG16Z2iXHJcbiAgICAvLyAgKiAgICAgIDLvvInkuI3pnIDopoEgICAgICAgLS0+IOS4u+Wbvua0u+WKqOWIl+ihqOmhtemdolxyXG4gICAgLy8gICogQHBhcmFtIHsqfSBfcmVz77ya5ZWG5ZOBaWRcclxuICAgIC8vICAqL1xyXG4gICAgLy8gbGlua1RvKGFjdF9pZCkge1xyXG4gICAgLy8gICAgIC8v5LuO5Li75Zu+6Lez6L2s6L+H5p2lXHJcbiAgICAvLyAgICAgaWYgKHRoaXMuc3RhdGUubnVtX2lpZHMpIHtcclxuICAgIC8vICAgICAgICAgLy/lhYjmn6XllYblk4Hor6bmg4VcclxuICAgIC8vICAgICAgICAgbGV0IG51bV9paWRzID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXMuc3RhdGUubnVtX2lpZHMpO1xyXG4gICAgLy8gICAgICAgICBITmFwaS5zZWFyY2guZ2V0QmF0Y2hHb29kcyh7XHJcbiAgICAvLyAgICAgICAgICAgICBudW1faWlkczogbnVtX2lpZHMsXHJcbiAgICAvLyAgICAgICAgIH0pLnRoZW4ocmVzID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIGlmIChyZXMuY29kZSA9PSA4MDApIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc05lZWRQTEopIHsvL+mcgOimgeiuvue9ruaKq+mcsuS7t1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvL+i/m+WFpeiuvue9ruaJuemHj+S7t+mhtemdolxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBRTi5zZXNzaW9uc3RvcmUuc2V0KHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxqRGF0YToge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBbLi4ucmVzLmRhdGEuaXRlbXMuaXRlbV0sXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBRTi5uYXZpZ2F0b3IuZ28oe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ3FhcDovLy9aVFRCLWFkZEdvb2RzLmpzJyxcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeToge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUGlsdWppYScsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdF9pZDogdGhpcy5wcm9wcy5hY3RfaWRcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvL+WujOaIkFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvL+WFiOWIm+W7uua0u+WKqO+8jOWGjei/m+WFpea0u+WKqOWIl+ihqOmhtemdolxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgYWN0X2lkOiBhY3RfaWQsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgbGV0IF9vYmo7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGxldCBfYXJyID0gW107XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICByZXMuZGF0YS5pdGVtcy5pdGVtLmZvckVhY2goKGl0ZW0sIGlkeCkgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgX29iaiA9IHt9O1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgX29ialtpdGVtLm51bV9paWRdID0gaXRlbS5wcmljZTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIF9hcnIucHVzaChfb2JqKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLml0ZW1zX2luZm8gPSBfYXJyO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBITi5fYWpheCgnV2F0ZXJtYXJrLkluZGV4LmFkZF9nb29kcycsIHBhcmFtcywgJ1BPU1QnKS50aGVuKHJlcyA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBRTi5oaWRlTG9hZGluZygpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlID09IDgwMCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFFOLnNlc3Npb25zdG9yZS5jbGVhclN5bmMoKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBRTi5uYXZpZ2F0b3IucHVzaCh7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ3FhcDovLy9aVFRCLWluZGV4LmpzJyxcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTW9kYWwudG9hc3QocmVzLm1zZylcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIE1vZGFsLnRvYXN0KHJlcy5tc2cpO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9KVxyXG5cclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIFFOLm5hdmlnYXRvci5nbyh7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdXJsOiAncWFwOi8vL1pUVEItYWRkR29vZHMuanMnLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHF1ZXJ5OiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdBZGRHb29kcycsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGFjdF9pZDogYWN0X2lkXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgfSlcclxuICAgIC8vICAgICAgICAgfSwgNTAwKVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyAvLyDngrnlh7vlrozmiJBcclxuICAgIC8vIHN1cmUgPSAoaWR4KSA9PiB7XHJcbiAgICAvLyAgICAgLyoqXHJcbiAgICAvLyAgICAgICog5oqV5pS+5pa55byPXHJcbiAgICAvLyAgICAgICogWzIsIDBdLeeri+WNs+aKleaUvlxyXG4gICAgLy8gICAgICAqIFswLCAyXS3lrprml7bmipXmlL5cclxuICAgIC8vICAgICAgKi9cclxuICAgIC8vICAgICBpZiAodGhpcy5zdGF0ZS5tZXRob2RbMF0pIHtcclxuICAgIC8vICAgICAgICAgdGhpcy5jcmVhdGVBY3QoKTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAvL+ajgOmqjOaXtumXtFxyXG4gICAgLy8gICAgICAgICBsZXQgdGltZSA9IHRoaXMuc3RhdGUudGltZTtcclxuICAgIC8vICAgICAgICAgaWYgKHRpbWVbMF0gPT0gJ+ivt+mAieaLqScpIHtcclxuICAgIC8vICAgICAgICAgICAgIE1vZGFsLnRvYXN0KCfor7fpgInmi6nlvIDlp4vml7bpl7QnKTtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybjtcclxuICAgIC8vICAgICAgICAgfSBlbHNlIGlmICh0aW1lWzFdID09ICfor7fpgInmi6knKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBNb2RhbC50b2FzdCgn6K+36YCJ5oup57uT5p2f5pe26Ze0Jyk7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICBsZXQgZGYgPSBITi50aW1lRGlmZmVyZW5jZSh0aW1lWzBdLCB0aW1lWzFdKTtcclxuICAgIC8vICAgICAgICAgICAgIGlmIChkZi5fZGF0ZTMgPj0gMCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQWN0KCk7XHJcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIE1vZGFsLnRvYXN0KCfnu5PmnZ/ml7bpl7TkuI3og73lsI/kuo7lvIDlp4vml7bpl7TvvIzor7fph43mlrDpgInmi6nml7bpl7TmrrUnKTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyB9XHJcblxyXG4gICAgcmVuZGVyVEZXWiA9ICgpID0+IHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICAgICAgYXJyLnB1c2goXHJcbiAgICAgICAgICAgICAgICA8VG91Y2hhYmxlIHN0eWxlPXtbSW5jc3MuVEZQb3NpdGlvbl19ID5cclxuICAgICAgICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17W0luY3NzLnBfaXRlbV90eHQsIHRoaXMuc3RhdGUuVEZQb3NpdGlvbltpXSA/IEluY3NzLnBfaXRlbV9zZWxlY3QgOiB7fV19PntpICE9IDUgPyAn5Li75Zu+JyArIChpICsgMSkgOiAn6ZW/5Zu+J308L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLlRGUG9zaXRpb25baV0gPyA8SW1hZ2Ugc3R5bGU9e0luY3NzLlRGUG9zaXRpb25faWNvbn0gc291cmNlPXt7IHVyaTogJ2h0dHBzOi8vaW1nLmFsaWNkbi5jb20vaW1nZXh0cmEvaTIvMjgxNTA5Mjk5L1RCMmF0Um9FM2FUQnVOalNzemZYWFhnZnBYYS0yODE1MDkyOTkucG5nJyB9fSByZXNpemVNb2RlPXsnY29udGFpbid9PjwvSW1hZ2U+IDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDwvVG91Y2hhYmxlPlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW1hZ2VBcnJMb2FkSGFuZGxlciA9IChlKSA9PiB7XHJcbiAgICAvLyAgICAgaWYgKCFlLnNpemUpIHJldHVybjtcclxuICAgIC8vICAgICB0aGlzLnNldExpc3RTdGF0ZSgnaWNvbicsIHtcclxuICAgIC8vICAgICAgICAgd2lkdGg6IGUuc2l6ZS5uYXR1cmFsV2lkdGgsXHJcbiAgICAvLyAgICAgICAgIGhlaWdodDogZS5zaXplLm5hdHVyYWxIZWlnaHQsXHJcbiAgICAvLyAgICAgfSlcclxuICAgIC8vIH1cclxuXHJcbiAgICByZW5kZXJDb24gPSAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGxlZnQgPSAwO1xyXG4gICAgICAgIGxldCB0b3AgPSAwO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxWaWV3PlxyXG4gICAgICAgICAgICAgICAgPFZpZXcgc3R5bGU9e0luY3NzLnRvcH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPFZpZXcgc3R5bGU9e0luY3NzLm1vZGVsX291dH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUb3VjaGFibGUgc3R5bGU9e1tJbmNzcy5tb2RlbF19ID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXtbSW5jc3MubW9kZWxfdHh0LCB0aGlzLnN0YXRlLm1vZGVsID8ge30gOiBJbmNzcy5tb2RlbF9zZWxlY3RdfT7mlrnlm77mqKHlvI88L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVG91Y2hhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VG91Y2hhYmxlIHN0eWxlPXtJbmNzcy5tb2RlbH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17W0luY3NzLm1vZGVsX3R4dCwgdGhpcy5zdGF0ZS5tb2RlbCA/IEluY3NzLm1vZGVsX3NlbGVjdCA6IHt9XX0+6ZW/5Zu+5qih5byPPC9UZXh0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RvdWNoYWJsZT5cclxuICAgICAgICAgICAgICAgICAgICA8L1ZpZXc+XHJcbiAgICAgICAgICAgICAgICAgICAgPFRvdWNoYWJsZSA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXtJbmNzcy5jaGFuZ2VHb29kfT7mm7TmjaLpooTop4jlrp3otJ08L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Ub3VjaGFibGU+XHJcbiAgICAgICAgICAgICAgICA8L1ZpZXc+XHJcblxyXG4gICAgICAgICAgICAgICAgPFZpZXcgc3R5bGU9e3sgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCAtIDIwNSB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8VmlldyBzdHlsZT17eyBoZWlnaHQ6IDUwMCB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8L1ZpZXc+XHJcbiAgICAgICAgICAgICAgICAgICAgPFZpZXcgc3R5bGU9e1t7IHdpZHRoOiB3aWR0aCAtIDMyIH0sIEluY3NzLml0ZW1dfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgc3R5bGU9e0luY3NzLnRpdGxlfT7mtLvliqjlkI3np7A8L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxWaWV3IHN0eWxlPXtJbmNzcy5pcHR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPElucHV0IHJlZj1cIm15aW5wdXRcIiBzdHlsZT17SW5jc3MuaW5wdXRfbmFtZX0gbWF4TGVuZ3RoPXsyMH0gdmFsdWU9e3RoaXMuc3RhdGUuaXB0VmFsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgc3R5bGU9e0luY3NzLnR4dFJhbmdlfT57dGhpcy5zdGF0ZS5pcHRWYWwubGVuZ3RofS8yMDwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9WaWV3PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvVmlldz5cclxuICAgICAgICAgICAgICAgICAgICA8VmlldyBzdHlsZT17W3sgd2lkdGg6IHdpZHRoIC0gMzIgfSwgSW5jc3MuaXRlbV19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17SW5jc3MudGl0bGV9PuaKleaUvuS9jee9rjwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFZpZXcgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyVEZXWigpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1ZpZXc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9WaWV3PlxyXG4gICAgICAgICAgICAgICAgICAgIDxWaWV3IHN0eWxlPXtbeyB3aWR0aDogd2lkdGggLSAzMiB9LCBJbmNzcy5pdGVtXX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXtJbmNzcy50aXRsZX0+5oqV5pS+5pa55byPPC9UZXh0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8VG91Y2hhYmxlIHN0eWxlPXtbSW5jc3MubWV0aG9kLCB7IG1hcmdpblJpZ2h0OiAnMTAwcmVtJyB9XX0+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgc3R5bGU9e0luY3NzLm1ldGhvZF90eHR9Pueri+WNs+aKleaUvjwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Ub3VjaGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUb3VjaGFibGUgc3R5bGU9e0luY3NzLm1ldGhvZH0+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgc3R5bGU9e0luY3NzLm1ldGhvZF90eHR9PuWumuaXtuaKleaUvjwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Ub3VjaGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxJbnB1dCByZWY9XCJteWlucHV0XCIgc3R5bGU9e0luY3NzLmlucHV0X25hbWV9IG1heExlbmd0aD17MjB9IHZhbHVlPXt0aGlzLnN0YXRlLmlwdFZhbH0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9WaWV3PlxyXG4gICAgICAgICAgICAgICAgICA8L1ZpZXc+XHJcbiAgICAgICAgICAgICAgICAgICAgPFZpZXc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxWaWV3IHN0eWxlPXtbeyB3aWR0aDogd2lkdGggLSAzMiB9LCBJbmNzcy5pdGVtXX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17SW5jc3MudGl0bGV9PuW8gOWni+aXtumXtDwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUb3VjaGFibGUgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXtJbmNzcy5tZXRob2RfdHh0fT57dGhpcy5zdGF0ZS50aW1lWzBdfTwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVG91Y2hhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1ZpZXc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxWaWV3IHN0eWxlPXtbeyB3aWR0aDogd2lkdGggLSAzMiB9LCBJbmNzcy5pdGVtXX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17SW5jc3MudGl0bGV9Pue7k+adn+aXtumXtDwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUb3VjaGFibGUgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0IHN0eWxlPXtJbmNzcy5tZXRob2RfdHh0fT57dGhpcy5zdGF0ZS50aW1lWzFdfTwvVGV4dD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RvdWNoYWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9WaWV3PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvVmlldz5cclxuICAgICAgICAgICAgICAgICAgICA8VG91Y2hhYmxlIHN0eWxlPXtJbmNzcy5mb290fT5cclxuICAgICAgICAgICAgICAgICAgICA8VGV4dCBzdHlsZT17SW5jc3MuZm9vdF90eHR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5udW1faWlkcyA/ICh0aGlzLnN0YXRlLmlzTmVlZFBMSiA/ICfkuIvkuIDmraXvvIzorr7nva7miqvpnLLku7cnIDogJ+WujOaIkCcpIDogJ+S4i+S4gOatpe+8jOa3u+WKoOWunei0nSd9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9UZXh0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvVG91Y2hhYmxlPlxyXG4gICAgICAgICAgICAgICAgPC9WaWV3PlxyXG5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxTY3JvbGxWaWV3IHN0eWxlPXtbeyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0LCBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJyB9XX0+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJDb24oKX1cclxuICAgICAgICAgICAgPC9TY3JvbGxWaWV3PlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5sZXQgc3R5bGVzID0ge1xyXG4gICAgZm9vdDoge1xyXG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxyXG4gICAgICAgIHdpZHRoOiA3NTAsXHJcbiAgICAgICAgYm90dG9tOiAwLFxyXG4gICAgfVxyXG59XHJcblxyXG5yZW5kZXIoPEhvbWUgLz4pO1xyXG5cbi8vIEhNUiBhcHBlbmQgYnkgcmF4LXNjcmlwdHMvbG9hZGVycy9tb2R1bGUtaG90LWFjY2VwdC5qc1xuLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYWxpYmFiYS9yYXhcbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgQXBwICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZW5kZXIoPEFwcCAvPilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2BBcHBgIGNvbXBvbmVudHMgbXVzdCBleGlzdCEnKVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG4iLCJ2YXIgX3N0eWxlcyA9IHtcbiAgXCJ0b3BcIjoge1xuICAgIFwid2lkdGhcIjogNzUwLFxuICAgIFwiaGVpZ2h0XCI6IDEwOCxcbiAgICBcInBhZGRpbmdUb3BcIjogXCIwcmVtXCIsXG4gICAgXCJwYWRkaW5nUmlnaHRcIjogXCIzM3JlbVwiLFxuICAgIFwicGFkZGluZ0JvdHRvbVwiOiBcIjByZW1cIixcbiAgICBcInBhZGRpbmdMZWZ0XCI6IFwiMzNyZW1cIixcbiAgICBcImZsZXhEaXJlY3Rpb25cIjogXCJyb3dcIixcbiAgICBcImp1c3RpZnlDb250ZW50XCI6IFwic3BhY2UtYmV0d2VlblwiLFxuICAgIFwiYWxpZ25JdGVtc1wiOiBcImNlbnRlclwiXG4gIH0sXG4gIFwibW9kZWxfb3V0XCI6IHtcbiAgICBcImJvcmRlcldpZHRoXCI6IFwiMnJlbVwiLFxuICAgIFwiYm9yZGVyU3R5bGVcIjogXCJzb2xpZFwiLFxuICAgIFwiYm9yZGVyQ29sb3JcIjogXCJyZ2IoMjQwLDI0MCwyNDApXCIsXG4gICAgXCJkaXNwbGF5XCI6IFwiZmxleFwiLFxuICAgIFwiYm9yZGVyUmFkaXVzXCI6IDMwLFxuICAgIFwiZmxleERpcmVjdGlvblwiOiBcInJvd1wiLFxuICAgIFwiYWxpZ25JdGVtc1wiOiBcImNlbnRlclwiLFxuICAgIFwib3ZlcmZsb3dcIjogXCJoaWRkZW5cIixcbiAgICBcImJhY2tncm91bmRDb2xvclwiOiBcInJnYigyNTAsMjUwLDI1MClcIlxuICB9LFxuICBcIm1vZGVsX3R4dFwiOiB7XG4gICAgXCJ3aWR0aFwiOiAxNzEsXG4gICAgXCJoZWlnaHRcIjogNjAsXG4gICAgXCJmb250U2l6ZVwiOiAyNixcbiAgICBcImNvbG9yXCI6IFwicmdiKDE3MSwxNzEsMTc2KVwiLFxuICAgIFwiYmFja2dyb3VuZENvbG9yXCI6IFwicmdiKDI1MCwyNTAsMjUwKVwiLFxuICAgIFwidGV4dEFsaWduXCI6IFwiY2VudGVyXCIsXG4gICAgXCJsaW5lSGVpZ2h0XCI6IFwiNjByZW1cIlxuICB9LFxuICBcIm1vZGVsX3NlbGVjdFwiOiB7XG4gICAgXCJib3JkZXJSYWRpdXNcIjogMzAsXG4gICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMTEwLDExMCwyMjUpXCIsXG4gICAgXCJjb2xvclwiOiBcInJnYigyNTUsMjU1LDI1NSlcIlxuICB9LFxuICBcImNoYW5nZUdvb2RcIjoge1xuICAgIFwiY29sb3JcIjogXCJyZ2IoMTEwLDExMCwyMjUpXCIsXG4gICAgXCJhbGlnbkl0ZW1zXCI6IFwiY2VudGVyXCIsXG4gICAgXCJmb250U2l6ZVwiOiAyNlxuICB9LFxuICBcInRyeUFnYWluXCI6IHtcbiAgICBcImZvbnRTaXplXCI6IDIxLFxuICAgIFwicGFkZGluZ0xlZnRcIjogNSxcbiAgICBcImNvbG9yXCI6IFwicmdiKDExMCwxMTAsMjI1KVwiXG4gIH0sXG4gIFwicGljXCI6IHtcbiAgICBcIndpZHRoXCI6IDc1MCxcbiAgICBcImhlaWdodFwiOiA3NTAsXG4gICAgXCJwb3NpdGlvblwiOiBcInJlbGF0aXZlXCJcbiAgfSxcbiAgXCJpdGVtUGljXCI6IHtcbiAgICBcIndpZHRoXCI6IDc1MCxcbiAgICBcImhlaWdodFwiOiA3NTBcbiAgfSxcbiAgXCJmdWNlbmdMXCI6IHtcbiAgICBcIndpZHRoXCI6IDEwNSxcbiAgICBcImhlaWdodFwiOiA3NTAsXG4gICAgXCJwb3NpdGlvblwiOiBcImFic29sdXRlXCIsXG4gICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMjUwLDI1MCwyNTApXCIsXG4gICAgXCJ0b3BcIjogMCxcbiAgICBcInJpZ2h0XCI6IDBcbiAgfSxcbiAgXCJmdWNlbmdSXCI6IHtcbiAgICBcIndpZHRoXCI6IDEwNSxcbiAgICBcImhlaWdodFwiOiA3NTAsXG4gICAgXCJwb3NpdGlvblwiOiBcImFic29sdXRlXCIsXG4gICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMjUwLDI1MCwyNTApXCIsXG4gICAgXCJ0b3BcIjogMCxcbiAgICBcImxlZnRcIjogMFxuICB9LFxuICBcImljb25cIjoge1xuICAgIFwicG9zaXRpb25cIjogXCJhYnNvbHV0ZVwiXG4gIH0sXG4gIFwiaXRlbVwiOiB7XG4gICAgXCJtYXJnaW5MZWZ0XCI6IDMyLFxuICAgIFwicGFkZGluZ1RvcFwiOiBcIjI1cmVtXCIsXG4gICAgXCJwYWRkaW5nUmlnaHRcIjogXCIwcmVtXCIsXG4gICAgXCJwYWRkaW5nQm90dG9tXCI6IFwiMjVyZW1cIixcbiAgICBcInBhZGRpbmdMZWZ0XCI6IFwiMHJlbVwiLFxuICAgIFwiZmxleERpcmVjdGlvblwiOiBcInJvd1wiLFxuICAgIFwiYWxpZ25JdGVtc1wiOiBcImNlbnRlclwiLFxuICAgIFwiYm9yZGVyQm90dG9tV2lkdGhcIjogXCIxcmVtXCIsXG4gICAgXCJib3JkZXJCb3R0b21TdHlsZVwiOiBcInNvbGlkXCIsXG4gICAgXCJib3JkZXJCb3R0b21Db2xvclwiOiBcInJnYigyNDAsMjQwLDI0MClcIlxuICB9LFxuICBcInRpdGxlXCI6IHtcbiAgICBcImNvbG9yXCI6IFwicmdiKDE2NSwxNjUsMTcwKVwiLFxuICAgIFwicGFkZGluZ1JpZ2h0XCI6IDI0LFxuICAgIFwiZm9udFNpemVcIjogMjhcbiAgfSxcbiAgXCJpcHRcIjoge1xuICAgIFwicG9zaXRpb25cIjogXCJyZWxhdGl2ZVwiXG4gIH0sXG4gIFwiaW5wdXRfbmFtZVwiOiB7XG4gICAgXCJ3aWR0aFwiOiA1NDQsXG4gICAgXCJoZWlnaHRcIjogNzIsXG4gICAgXCJib3JkZXJSYWRpdXNcIjogNSxcbiAgICBcInRleHRJbmRlbnRcIjogMTIsXG4gICAgXCJmb250U2l6ZVwiOiAyOCxcbiAgICBcImNvbG9yXCI6IFwicmdiKDQ0LDQ0LDQ4KVwiXG4gIH0sXG4gIFwidHh0UmFuZ2VcIjoge1xuICAgIFwicG9zaXRpb25cIjogXCJhYnNvbHV0ZVwiLFxuICAgIFwicmlnaHRcIjogMTIsXG4gICAgXCJ0b3BcIjogMjIsXG4gICAgXCJmb250U2l6ZVwiOiAyMyxcbiAgICBcImNvbG9yXCI6IFwicmdiKDE2NSwxNjUsMTcwKVwiXG4gIH0sXG4gIFwiVEZQb3NpdGlvblwiOiB7XG4gICAgXCJ3aWR0aFwiOiA4MCxcbiAgICBcImhlaWdodFwiOiA4MCxcbiAgICBcInBvc2l0aW9uXCI6IFwicmVsYXRpdmVcIixcbiAgICBcIm1hcmdpblJpZ2h0XCI6IDEyXG4gIH0sXG4gIFwiVEZQb3NpdGlvbl9pY29uXCI6IHtcbiAgICBcIndpZHRoXCI6IDIyLFxuICAgIFwiaGVpZ2h0XCI6IDIyLFxuICAgIFwicG9zaXRpb25cIjogXCJhYnNvbHV0ZVwiLFxuICAgIFwicmlnaHRcIjogMyxcbiAgICBcImJvdHRvbVwiOiAzXG4gIH0sXG4gIFwicF9pdGVtX3R4dFwiOiB7XG4gICAgXCJ3aWR0aFwiOiA4MCxcbiAgICBcImhlaWdodFwiOiA4MCxcbiAgICBcImJvcmRlcldpZHRoXCI6IFwiMXJlbVwiLFxuICAgIFwiYm9yZGVyU3R5bGVcIjogXCJzb2xpZFwiLFxuICAgIFwiYm9yZGVyQ29sb3JcIjogXCJyZ2IoMjI0LDIyNCwyMjQpXCIsXG4gICAgXCJ0ZXh0QWxpZ25cIjogXCJjZW50ZXJcIixcbiAgICBcImxpbmVIZWlnaHRcIjogXCI4MHJlbVwiLFxuICAgIFwiZm9udFNpemVcIjogMjMsXG4gICAgXCJjb2xvclwiOiBcInJnYig0NCw0NCw0OClcIlxuICB9LFxuICBcInBfaXRlbV9zZWxlY3RcIjoge1xuICAgIFwiYm9yZGVyV2lkdGhcIjogXCI0cmVtXCIsXG4gICAgXCJib3JkZXJTdHlsZVwiOiBcInNvbGlkXCIsXG4gICAgXCJib3JkZXJDb2xvclwiOiBcInJnYigxMTAsMTEwLDIyNSlcIixcbiAgICBcImNvbG9yXCI6IFwicmdiKDExMCwxMTAsMjI1KVwiLFxuICAgIFwibGluZUhlaWdodFwiOiBcIjc0cmVtXCJcbiAgfSxcbiAgXCJtZXRob2RcIjoge1xuICAgIFwiZmxleERpcmVjdGlvblwiOiBcInJvd1wiLFxuICAgIFwiYWxpZ25JdGVtc1wiOiBcImNlbnRlclwiXG4gIH0sXG4gIFwibWV0aG9kX3R4dFwiOiB7XG4gICAgXCJmb250U2l6ZVwiOiAyOCxcbiAgICBcImNvbG9yXCI6IFwicmdiKDQ0LDQ0LDQ4KVwiXG4gIH0sXG4gIFwiQ2hlY2tCb3hcIjoge1xuICAgIFwicGFkZGluZ1JpZ2h0XCI6IDMzLFxuICAgIFwicGFkZGluZ1RvcFwiOiA0XG4gIH0sXG4gIFwicGFnZUJcIjoge1xuICAgIFwiZm9udFNpemVcIjogMjAsXG4gICAgXCJjb2xvclwiOiBcInJnYigxNjUsMTY1LDE3MClcIixcbiAgICBcIm1hcmdpbkxlZnRcIjogNDQwXG4gIH0sXG4gIFwiZm9vdFwiOiB7XG4gICAgXCJ3aWR0aFwiOiA3NTAsXG4gICAgXCJoZWlnaHRcIjogODgsXG4gICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJyZ2IoMTEwLDExMCwyMjUpXCIsXG4gICAgXCJwb3NpdGlvblwiOiBcImZpeGVkXCIsXG4gICAgXCJib3R0b21cIjogMCxcbiAgICBcImxlZnRcIjogMCxcbiAgICBcImp1c3RpZnlDb250ZW50XCI6IFwiY2VudGVyXCIsXG4gICAgXCJhbGlnbkl0ZW1zXCI6IFwiY2VudGVyXCJcbiAgfSxcbiAgXCJmb290X3R4dFwiOiB7XG4gICAgXCJjb2xvclwiOiBcInJnYigyNTUsMjU1LDI1NSlcIixcbiAgICBcImZvbnRTaXplXCI6IDMwXG4gIH1cbn07XG4gIFxuICBcbiAgXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgY29uc29sZS53YXJuKCdsaW5lOiA4OSwgY29sdW1uOiAzIC0gXCJ0ZXh0LWluZGVudDogMTJcIiBpcyBub3QgdmFsaWQgaW4gXCIuaW5wdXRfbmFtZVwiIHNlbGVjdG9yXFxuJyk7XG4gIH1cbiAgICBcbiAgbW9kdWxlLmV4cG9ydHMgPSBfc3R5bGVzO1xuICAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJRQVAtU0RLXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm51a2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmF4XCIpOyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbnhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFuQkE7QUFxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQzdNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNSQTs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNyQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQURBO0FBaVVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFIQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBOVVBO0FBd1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREE7QUFHQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREE7QUFKQTtBQVFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFEQTtBQVRBO0FBY0E7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGQTtBQUZBO0FBT0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFGQTtBQU1BO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRkE7QUFJQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRkE7QUFJQTtBQVZBO0FBaEJBO0FBOEJBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREE7QUFGQTtBQU1BO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREE7QUFGQTtBQVBBO0FBZUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQURBO0FBNURBO0FBb0VBO0FBQ0E7QUE5WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFGQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBMkVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUlBOzs7O0FBeGFBO0FBQ0E7QUF5YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBREE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDamRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyTEE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==