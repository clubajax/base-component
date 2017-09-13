(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BaseComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(["@clubajax/on"], factory);
	} else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
		// Node / CommonJS
		module.exports = factory(require('@clubajax/on'));
	} else {
		// Browser globals (root is window)
		root['BaseComponent'] = factory(root.on);
	}
})(undefined, function (on) {
	"use strict";

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
			}
		}return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
		};
	}();

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
		}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var BaseComponent = function (_HTMLElement) {
		_inherits(BaseComponent, _HTMLElement);

		function BaseComponent() {
			_classCallCheck(this, BaseComponent);

			var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));

			_this._uid = uid(_this.localName);
			privates[_this._uid] = { DOMSTATE: 'created' };
			privates[_this._uid].handleList = [];
			plugin('init', _this);
			return _this;
		}

		_createClass(BaseComponent, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
				plugin('preConnected', this);
				nextTick(onCheckDomReady.bind(this));
				if (this.connected) {
					this.connected();
				}
				this.fire('connected');
				plugin('postConnected', this);
			}
		}, {
			key: 'onConnected',
			value: function onConnected(callback) {
				var _this2 = this;

				if (this.DOMSTATE === 'connected' || this.DOMSTATE === 'domready') {
					callback(this);
					return;
				}
				this.once('connected', function () {
					callback(_this2);
				});
			}
		}, {
			key: 'onDomReady',
			value: function onDomReady(callback) {
				var _this3 = this;

				if (this.DOMSTATE === 'domready') {
					callback(this);
					return;
				}
				this.once('domready', function () {
					callback(_this3);
				});
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				var _this4 = this;

				privates[this._uid].DOMSTATE = 'disconnected';
				plugin('preDisconnected', this);
				if (this.disconnected) {
					this.disconnected();
				}
				this.fire('disconnected');

				var time = void 0,
				    dod = BaseComponent.destroyOnDisconnect;
				if (dod) {
					time = typeof dod === 'number' ? doc : 300;
					setTimeout(function () {
						if (_this4.DOMSTATE === 'disconnected') {
							_this4.destroy();
						}
					}, time);
				}
			}
		}, {
			key: 'attributeChangedCallback',
			value: function attributeChangedCallback(attrName, oldVal, newVal) {
				plugin('preAttributeChanged', this, attrName, newVal, oldVal);
				if (this.attributeChanged) {
					this.attributeChanged(attrName, newVal, oldVal);
				}
			}
		}, {
			key: 'destroy',
			value: function destroy() {
				this.fire('destroy');
				privates[this._uid].handleList.forEach(function (handle) {
					handle.remove();
				});
				_destroy(this);
			}
		}, {
			key: 'fire',
			value: function fire(eventName, eventDetail, bubbles) {
				return on.fire(this, eventName, eventDetail, bubbles);
			}
		}, {
			key: 'emit',
			value: function emit(eventName, value) {
				return on.emit(this, eventName, value);
			}
		}, {
			key: 'on',
			value: function (_on) {
				function on(_x, _x2, _x3, _x4) {
					return _on.apply(this, arguments);
				}

				on.toString = function () {
					return _on.toString();
				};

				return on;
			}(function (node, eventName, selector, callback) {
				return this.registerHandle(typeof node !== 'string' ? // no node is supplied
				on(node, eventName, selector, callback) : on(this, node, eventName, selector));
			})
		}, {
			key: 'once',
			value: function once(node, eventName, selector, callback) {
				return this.registerHandle(typeof node !== 'string' ? // no node is supplied
				on.once(node, eventName, selector, callback) : on.once(this, node, eventName, selector, callback));
			}
		}, {
			key: 'attr',
			value: function attr(key, value, toggle) {
				this.isSettingAttribute = true;
				var add = toggle === undefined ? true : !!toggle;
				if (add) {
					this.setAttribute(key, value);
				} else {
					this.removeAttribute(key);
				}
				this.isSettingAttribute = false;
			}
		}, {
			key: 'registerHandle',
			value: function registerHandle(handle) {
				privates[this._uid].handleList.push(handle);
				return handle;
			}
		}, {
			key: 'DOMSTATE',
			get: function get() {
				return privates[this._uid].DOMSTATE;
			}
		}], [{
			key: 'clone',
			value: function clone(template) {
				if (template.content && template.content.children) {
					return document.importNode(template.content, true);
				}
				var frag = document.createDocumentFragment();
				var cloneNode = document.createElement('div');
				cloneNode.innerHTML = template.innerHTML;

				while (cloneNode.children.length) {
					frag.appendChild(cloneNode.children[0]);
				}
				return frag;
			}
		}, {
			key: 'addPlugin',
			value: function addPlugin(plug) {
				var i = void 0,
				    order = plug.order || 100;
				if (!plugins.length) {
					plugins.push(plug);
				} else if (plugins.length === 1) {
					if (plugins[0].order <= order) {
						plugins.push(plug);
					} else {
						plugins.unshift(plug);
					}
				} else if (plugins[0].order > order) {
					plugins.unshift(plug);
				} else {

					for (i = 1; i < plugins.length; i++) {
						if (order === plugins[i - 1].order || order > plugins[i - 1].order && order < plugins[i].order) {
							plugins.splice(i, 0, plug);
							return;
						}
					}
					// was not inserted...
					plugins.push(plug);
				}
			}
		}, {
			key: 'destroyOnDisconnect',
			set: function set(value) {
				privates['destroyOnDisconnect'] = value;
			},
			get: function get() {
				return privates['destroyOnDisconnect'];
			}
		}]);

		return BaseComponent;
	}(HTMLElement);

	var privates = {},
	    plugins = [];

	function plugin(method, node, a, b, c) {
		plugins.forEach(function (plug) {
			if (plug[method]) {
				plug[method](node, a, b, c);
			}
		});
	}

	function onCheckDomReady() {
		if (this.DOMSTATE !== 'connected' || privates[this._uid].domReadyFired) {
			return;
		}

		var count = 0,
		    children = getChildCustomNodes(this),
		    ourDomReady = onDomReady.bind(this);

		function addReady() {
			count++;
			if (count === children.length) {
				ourDomReady();
			}
		}

		// If no children, we're good - leaf node. Commence with onDomReady
		//
		if (!children.length) {
			ourDomReady();
		} else {
			// else, wait for all children to fire their `ready` events
			//
			children.forEach(function (child) {
				// check if child is already ready
				// also check for connected - this handles moving a node from another node
				// NOPE, that failed. removed for now child.DOMSTATE === 'connected'
				if (child.DOMSTATE === 'domready') {
					addReady();
				}
				// if not, wait for event
				child.on('domready', addReady);
			});
		}
	}

	function onDomReady() {
		privates[this._uid].DOMSTATE = 'domready';
		// domReady should only ever fire once
		privates[this._uid].domReadyFired = true;
		plugin('preDomReady', this);
		// call this.domReady first, so that the component
		// can finish initializing before firing any
		// subsequent events
		if (this.domReady) {
			this.domReady();
			this.domReady = function () {};
		}

		// allow component to fire this event
		// domReady() will still be called
		if (!this.fireOwnDomready) {
			this.fire('domready');
		}

		plugin('postDomReady', this);
	}

	function getChildCustomNodes(node) {
		// collect any children that are custom nodes
		// used to check if their dom is ready before
		// determining if this is ready
		var i = void 0,
		    nodes = [];
		for (i = 0; i < node.children.length; i++) {
			if (node.children[i].nodeName.indexOf('-') > -1) {
				nodes.push(node.children[i]);
			}
		}
		return nodes;
	}

	function nextTick(cb) {
		requestAnimationFrame(cb);
	}

	var uids = {};
	function uid() {
		var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uid';

		if (uids[type] === undefined) {
			uids[type] = 0;
		}
		var id = type + '-' + (uids[type] + 1);
		uids[type]++;
		return id;
	}

	var destroyer = document.createElement('div');
	function _destroy(node) {
		if (node) {
			destroyer.appendChild(node);
			destroyer.innerHTML = '';
		}
	}

	window.onDomReady = function (nodeOrNodes, callback) {
		function handleDomReady(node, cb) {
			function onReady() {
				cb(node);
				node.removeEventListener('domready', onReady);
			}

			if (node.DOMSTATE === 'domready') {
				cb(node);
			} else {
				node.addEventListener('domready', onReady);
			}
		}

		if (!Array.isArray(nodeOrNodes)) {
			handleDomReady(nodeOrNodes, callback);
			return;
		}

		var count = 0;

		function onArrayNodeReady() {
			count++;
			if (count === nodeOrNodes.length) {
				callback(nodeOrNodes);
			}
		}

		for (var i = 0; i < nodeOrNodes.length; i++) {
			handleDomReady(nodeOrNodes[i], onArrayNodeReady);
		}
	};

	return BaseComponent;
});

},{"@clubajax/on":"@clubajax/on"}],2:[function(require,module,exports){
(function (global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
	if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.BaseComponent = f();
	}
})(function () {
	var define, module, exports;return function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
				}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}return n[o].exports;
		}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
			s(r[o]);
		}return s;
	}({ 1: [function (require, module, exports) {
			"use strict";

			var _createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
					}
				}return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
				};
			}();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
				}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
			}

			var _on = require('@clubajax/on');

			var BaseComponent = function (_HTMLElement) {
				_inherits(BaseComponent, _HTMLElement);

				function BaseComponent() {
					_classCallCheck(this, BaseComponent);

					var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));

					_this._uid = uid(_this.localName);
					privates[_this._uid] = { DOMSTATE: 'created' };
					privates[_this._uid].handleList = [];
					plugin('init', _this);
					return _this;
				}

				_createClass(BaseComponent, [{
					key: 'connectedCallback',
					value: function connectedCallback() {
						privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
						plugin('preConnected', this);
						nextTick(onCheckDomReady.bind(this));
						if (this.connected) {
							this.connected();
						}
						this.fire('connected');
						plugin('postConnected', this);
					}
				}, {
					key: 'onConnected',
					value: function onConnected(callback) {
						var _this2 = this;

						if (this.DOMSTATE === 'connected' || this.DOMSTATE === 'domready') {
							callback(this);
							return;
						}
						this.once('connected', function () {
							callback(_this2);
						});
					}
				}, {
					key: 'onDomReady',
					value: function onDomReady(callback) {
						var _this3 = this;

						if (this.DOMSTATE === 'domready') {
							callback(this);
							return;
						}
						this.once('domready', function () {
							callback(_this3);
						});
					}
				}, {
					key: 'disconnectedCallback',
					value: function disconnectedCallback() {
						var _this4 = this;

						privates[this._uid].DOMSTATE = 'disconnected';
						plugin('preDisconnected', this);
						if (this.disconnected) {
							this.disconnected();
						}
						this.fire('disconnected');

						var time = void 0,
						    dod = BaseComponent.destroyOnDisconnect;
						if (dod) {
							time = typeof dod === 'number' ? doc : 300;
							setTimeout(function () {
								if (_this4.DOMSTATE === 'disconnected') {
									_this4.destroy();
								}
							}, time);
						}
					}
				}, {
					key: 'attributeChangedCallback',
					value: function attributeChangedCallback(attrName, oldVal, newVal) {
						plugin('preAttributeChanged', this, attrName, newVal, oldVal);
						if (this.attributeChanged) {
							this.attributeChanged(attrName, newVal, oldVal);
						}
					}
				}, {
					key: 'destroy',
					value: function destroy() {
						this.fire('destroy');
						privates[this._uid].handleList.forEach(function (handle) {
							handle.remove();
						});
						_destroy(this);
					}
				}, {
					key: 'fire',
					value: function fire(eventName, eventDetail, bubbles) {
						return _on.fire(this, eventName, eventDetail, bubbles);
					}
				}, {
					key: 'emit',
					value: function emit(eventName, value) {
						return _on.emit(this, eventName, value);
					}
				}, {
					key: 'on',
					value: function on(node, eventName, selector, callback) {
						return this.registerHandle(typeof node !== 'string' ? // no node is supplied
						_on(node, eventName, selector, callback) : _on(this, node, eventName, selector));
					}
				}, {
					key: 'once',
					value: function once(node, eventName, selector, callback) {
						return this.registerHandle(typeof node !== 'string' ? // no node is supplied
						_on.once(node, eventName, selector, callback) : _on.once(this, node, eventName, selector, callback));
					}
				}, {
					key: 'attr',
					value: function attr(key, value, toggle) {
						this.isSettingAttribute = true;
						var add = toggle === undefined ? true : !!toggle;
						if (add) {
							this.setAttribute(key, value);
						} else {
							this.removeAttribute(key);
						}
						this.isSettingAttribute = false;
					}
				}, {
					key: 'registerHandle',
					value: function registerHandle(handle) {
						privates[this._uid].handleList.push(handle);
						return handle;
					}
				}, {
					key: 'DOMSTATE',
					get: function get() {
						return privates[this._uid].DOMSTATE;
					}
				}], [{
					key: 'clone',
					value: function clone(template) {
						if (template.content && template.content.children) {
							return document.importNode(template.content, true);
						}
						var frag = document.createDocumentFragment();
						var cloneNode = document.createElement('div');
						cloneNode.innerHTML = template.innerHTML;

						while (cloneNode.children.length) {
							frag.appendChild(cloneNode.children[0]);
						}
						return frag;
					}
				}, {
					key: 'addPlugin',
					value: function addPlugin(plug) {
						var i = void 0,
						    order = plug.order || 100;
						if (!plugins.length) {
							plugins.push(plug);
						} else if (plugins.length === 1) {
							if (plugins[0].order <= order) {
								plugins.push(plug);
							} else {
								plugins.unshift(plug);
							}
						} else if (plugins[0].order > order) {
							plugins.unshift(plug);
						} else {

							for (i = 1; i < plugins.length; i++) {
								if (order === plugins[i - 1].order || order > plugins[i - 1].order && order < plugins[i].order) {
									plugins.splice(i, 0, plug);
									return;
								}
							}
							// was not inserted...
							plugins.push(plug);
						}
					}
				}, {
					key: 'destroyOnDisconnect',
					set: function set(value) {
						privates['destroyOnDisconnect'] = value;
					},
					get: function get() {
						return privates['destroyOnDisconnect'];
					}
				}]);

				return BaseComponent;
			}(HTMLElement);

			var privates = {},
			    plugins = [];

			function plugin(method, node, a, b, c) {
				plugins.forEach(function (plug) {
					if (plug[method]) {
						plug[method](node, a, b, c);
					}
				});
			}

			function onCheckDomReady() {
				if (this.DOMSTATE !== 'connected' || privates[this._uid].domReadyFired) {
					return;
				}

				var count = 0,
				    children = getChildCustomNodes(this),
				    ourDomReady = onDomReady.bind(this);

				function addReady() {
					count++;
					if (count === children.length) {
						ourDomReady();
					}
				}

				// If no children, we're good - leaf node. Commence with onDomReady
				//
				if (!children.length) {
					ourDomReady();
				} else {
					// else, wait for all children to fire their `ready` events
					//
					children.forEach(function (child) {
						// check if child is already ready
						// also check for connected - this handles moving a node from another node
						// NOPE, that failed. removed for now child.DOMSTATE === 'connected'
						if (child.DOMSTATE === 'domready') {
							addReady();
						}
						// if not, wait for event
						child.on('domready', addReady);
					});
				}
			}

			function onDomReady() {
				privates[this._uid].DOMSTATE = 'domready';
				// domReady should only ever fire once
				privates[this._uid].domReadyFired = true;
				plugin('preDomReady', this);
				// call this.domReady first, so that the component
				// can finish initializing before firing any
				// subsequent events
				if (this.domReady) {
					this.domReady();
					this.domReady = function () {};
				}

				// allow component to fire this event
				// domReady() will still be called
				if (!this.fireOwnDomready) {
					this.fire('domready');
				}

				plugin('postDomReady', this);
			}

			function getChildCustomNodes(node) {
				// collect any children that are custom nodes
				// used to check if their dom is ready before
				// determining if this is ready
				var i = void 0,
				    nodes = [];
				for (i = 0; i < node.children.length; i++) {
					if (node.children[i].nodeName.indexOf('-') > -1) {
						nodes.push(node.children[i]);
					}
				}
				return nodes;
			}

			function nextTick(cb) {
				requestAnimationFrame(cb);
			}

			var uids = {};
			function uid() {
				var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uid';

				if (uids[type] === undefined) {
					uids[type] = 0;
				}
				var id = type + '-' + (uids[type] + 1);
				uids[type]++;
				return id;
			}

			var destroyer = document.createElement('div');
			function _destroy(node) {
				if (node) {
					destroyer.appendChild(node);
					destroyer.innerHTML = '';
				}
			}

			window.onDomReady = function (nodeOrNodes, callback) {
				function handleDomReady(node, cb) {
					function onReady() {
						cb(node);
						node.removeEventListener('domready', onReady);
					}

					if (node.DOMSTATE === 'domready') {
						cb(node);
					} else {
						node.addEventListener('domready', onReady);
					}
				}

				if (!Array.isArray(nodeOrNodes)) {
					handleDomReady(nodeOrNodes, callback);
					return;
				}

				var count = 0;

				function onArrayNodeReady() {
					count++;
					if (count === nodeOrNodes.length) {
						callback(nodeOrNodes);
					}
				}

				for (var i = 0; i < nodeOrNodes.length; i++) {
					handleDomReady(nodeOrNodes[i], onArrayNodeReady);
				}
			};

			module.exports = BaseComponent;
		}, { "@clubajax/on": "@clubajax/on" }], 2: [function (require, module, exports) {
			'use strict';

			var on = require('@clubajax/on');
			var BaseComponent = require('./BaseComponent');
			require('./properties');
			require('./template');
			require('./refs');
			//const itemTemplate = require('./item-template');

			module.exports = BaseComponent;
		}, { "./BaseComponent": 1, "./properties": 3, "./refs": 4, "./template": 5, "@clubajax/on": "@clubajax/on" }], 3: [function (require, module, exports) {
			'use strict';

			var BaseComponent = require('./BaseComponent');

			function setBoolean(node, prop) {
				Object.defineProperty(node, prop, {
					enumerable: true,
					configurable: true,
					get: function get() {
						return node.hasAttribute(prop);
					},
					set: function set(value) {
						this.isSettingAttribute = true;
						if (value) {
							this.setAttribute(prop, '');
						} else {
							this.removeAttribute(prop);
						}
						var fn = this[onify(prop)];
						if (fn) {
							fn.call(this, value);
						}

						this.isSettingAttribute = false;
					}
				});
			}

			function setProperty(node, prop) {
				var propValue = void 0;
				Object.defineProperty(node, prop, {
					enumerable: true,
					configurable: true,
					get: function get() {
						return propValue !== undefined ? propValue : normalize(this.getAttribute(prop));
					},
					set: function set(value) {
						var _this = this;

						this.isSettingAttribute = true;
						this.setAttribute(prop, value);
						var fn = this[onify(prop)];
						if (fn) {
							onDomReady(this, function () {
								if (value !== undefined) {
									propValue = value;
								}
								value = fn.call(_this, value) || value;
							});
						}
						this.isSettingAttribute = false;
					}
				});
			}

			function setObject(node, prop) {
				Object.defineProperty(node, prop, {
					enumerable: true,
					configurable: true,
					get: function get() {
						return this['__' + prop];
					},
					set: function set(value) {
						this['__' + prop] = value;
					}
				});
			}

			function setProperties(node) {
				var props = node.props || node.properties;
				if (props) {
					props.forEach(function (prop) {
						if (prop === 'disabled') {
							setBoolean(node, prop);
						} else {
							setProperty(node, prop);
						}
					});
				}
			}

			function setBooleans(node) {
				var props = node.bools || node.booleans;
				if (props) {
					props.forEach(function (prop) {
						setBoolean(node, prop);
					});
				}
			}

			function setObjects(node) {
				var props = node.objects;
				if (props) {
					props.forEach(function (prop) {
						setObject(node, prop);
					});
				}
			}

			function cap(name) {
				return name.substring(0, 1).toUpperCase() + name.substring(1);
			}

			function onify(name) {
				return 'on' + name.split('-').map(function (word) {
					return cap(word);
				}).join('');
			}

			function isBool(node, name) {
				return (node.bools || node.booleans || []).indexOf(name) > -1;
			}

			function boolNorm(value) {
				if (value === '') {
					return true;
				}
				return normalize(value);
			}

			function propNorm(value) {
				return normalize(value);
			}

			function normalize(val) {
				if (typeof val === 'string') {
					if (val === 'false') {
						return false;
					} else if (val === 'null') {
						return null;
					} else if (val === 'true') {
						return true;
					}
					if (val.indexOf('/') > -1 || (val.match(/-/g) || []).length > 1) {
						// type of date
						return val;
					}
				}
				if (!isNaN(parseFloat(val))) {
					return parseFloat(val);
				}
				return val;
			}

			BaseComponent.addPlugin({
				name: 'properties',
				order: 10,
				init: function init(node) {
					setProperties(node);
					setBooleans(node);
				},
				preAttributeChanged: function preAttributeChanged(node, name, value) {
					if (node.isSettingAttribute) {
						return false;
					}
					if (isBool(node, name)) {
						value = boolNorm(value);
						node[name] = !!value;
						if (!value) {
							node[name] = false;
							node.isSettingAttribute = true;
							node.removeAttribute(name);
							node.isSettingAttribute = false;
						} else {
							node[name] = true;
						}
						return;
					}

					node[name] = propNorm(value);
				}
			});
		}, { "./BaseComponent": 1 }], 4: [function (require, module, exports) {
			'use strict';

			function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
						arr2[i] = arr[i];
					}return arr2;
				} else {
					return Array.from(arr);
				}
			}

			var BaseComponent = require('./BaseComponent');

			function assignRefs(node) {

				[].concat(_toConsumableArray(node.querySelectorAll('[ref]'))).forEach(function (child) {
					var name = child.getAttribute('ref');
					child.removeAttribute('ref');
					node[name] = child;
				});
			}

			function assignEvents(node) {
				// <div on="click:onClick">
				[].concat(_toConsumableArray(node.querySelectorAll('[on]'))).forEach(function (child, i, children) {
					if (child === node) {
						return;
					}
					var keyValue = child.getAttribute('on'),
					    event = keyValue.split(':')[0].trim(),
					    method = keyValue.split(':')[1].trim();
					// remove, so parent does not try to use it
					child.removeAttribute('on');

					node.on(child, event, function (e) {
						node[method](e);
					});
				});
			}

			BaseComponent.addPlugin({
				name: 'refs',
				order: 30,
				preConnected: function preConnected(node) {
					assignRefs(node);
					assignEvents(node);
				}
			});
		}, { "./BaseComponent": 1 }], 5: [function (require, module, exports) {
			'use strict';

			var BaseComponent = require('./BaseComponent');

			var lightNodes = {};
			var inserted = {};

			function insert(node) {
				if (inserted[node._uid] || !hasTemplate(node)) {
					return;
				}
				collectLightNodes(node);
				insertTemplate(node);
				inserted[node._uid] = true;
			}

			function collectLightNodes(node) {
				lightNodes[node._uid] = lightNodes[node._uid] || [];
				while (node.childNodes.length) {
					lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
				}
			}

			function hasTemplate(node) {
				return node.templateString || node.templateId;
			}

			function insertTemplateChain(node) {
				var templates = node.getTemplateChain();
				templates.reverse().forEach(function (template) {
					getContainer(node).appendChild(BaseComponent.clone(template));
				});
				insertChildren(node);
			}

			function insertTemplate(node) {
				if (node.nestedTemplate) {
					insertTemplateChain(node);
					return;
				}
				var templateNode = node.getTemplateNode();

				if (templateNode) {
					node.appendChild(BaseComponent.clone(templateNode));
				}
				insertChildren(node);
			}

			function getContainer(node) {
				var containers = node.querySelectorAll('[ref="container"]');
				if (!containers || !containers.length) {
					return node;
				}
				return containers[containers.length - 1];
			}

			function insertChildren(node) {
				var i = void 0;
				var container = getContainer(node);
				var children = lightNodes[node._uid];

				if (container && children && children.length) {
					for (i = 0; i < children.length; i++) {
						container.appendChild(children[i]);
					}
				}
			}

			function toDom(html) {
				var node = document.createElement('div');
				node.innerHTML = html;
				return node.firstChild;
			}

			BaseComponent.prototype.getLightNodes = function () {
				return lightNodes[this._uid];
			};

			BaseComponent.prototype.getTemplateNode = function () {
				// caching causes different classes to pull the same template - wat?
				//if(!this.templateNode) {
				if (this.templateId) {
					this.templateNode = document.getElementById(this.templateId.replace('#', ''));
				} else if (this.templateString) {
					this.templateNode = toDom('<template>' + this.templateString + '</template>');
				}
				//}
				return this.templateNode;
			};

			BaseComponent.prototype.getTemplateChain = function () {

				var context = this,
				    templates = [],
				    template = void 0;

				// walk the prototype chain; Babel doesn't allow using
				// `super` since we are outside of the Class
				while (context) {
					context = Object.getPrototypeOf(context);
					if (!context) {
						break;
					}
					// skip prototypes without a template
					// (else it will pull an inherited template and cause duplicates)
					if (context.hasOwnProperty('templateString') || context.hasOwnProperty('templateId')) {
						template = context.getTemplateNode();
						if (template) {
							templates.push(template);
						}
					}
				}
				return templates;
			};

			BaseComponent.addPlugin({
				name: 'template',
				order: 20,
				preConnected: function preConnected(node) {
					insert(node);
				}
			});
		}, { "./BaseComponent": 1 }] }, {}, [2])(2);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./BaseComponent":1,"./properties":3,"./refs":4,"./template":5,"@clubajax/on":"@clubajax/on"}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(["BaseComponent"], factory);
	} else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
		// Node / CommonJS
		module.exports = factory(require('BaseComponent'));
	} else {
		// Browser globals (root is window)
		root['undefined'] = factory(root.BaseComponent);
	}
})(undefined, function (BaseComponent) {
	'use strict';

	function setBoolean(node, prop) {
		Object.defineProperty(node, prop, {
			enumerable: true,
			configurable: true,
			get: function get() {
				return node.hasAttribute(prop);
			},
			set: function set(value) {
				this.isSettingAttribute = true;
				if (value) {
					this.setAttribute(prop, '');
				} else {
					this.removeAttribute(prop);
				}
				var fn = this[onify(prop)];
				if (fn) {
					fn.call(this, value);
				}

				this.isSettingAttribute = false;
			}
		});
	}

	function setProperty(node, prop) {
		var propValue = void 0;
		Object.defineProperty(node, prop, {
			enumerable: true,
			configurable: true,
			get: function get() {
				return propValue !== undefined ? propValue : normalize(this.getAttribute(prop));
			},
			set: function set(value) {
				var _this = this;

				this.isSettingAttribute = true;
				this.setAttribute(prop, value);
				var fn = this[onify(prop)];
				if (fn) {
					onDomReady(this, function () {
						if (value !== undefined) {
							propValue = value;
						}
						value = fn.call(_this, value) || value;
					});
				}
				this.isSettingAttribute = false;
			}
		});
	}

	function setObject(node, prop) {
		Object.defineProperty(node, prop, {
			enumerable: true,
			configurable: true,
			get: function get() {
				return this['__' + prop];
			},
			set: function set(value) {
				this['__' + prop] = value;
			}
		});
	}

	function setProperties(node) {
		var props = node.props || node.properties;
		if (props) {
			props.forEach(function (prop) {
				if (prop === 'disabled') {
					setBoolean(node, prop);
				} else {
					setProperty(node, prop);
				}
			});
		}
	}

	function setBooleans(node) {
		var props = node.bools || node.booleans;
		if (props) {
			props.forEach(function (prop) {
				setBoolean(node, prop);
			});
		}
	}

	function setObjects(node) {
		var props = node.objects;
		if (props) {
			props.forEach(function (prop) {
				setObject(node, prop);
			});
		}
	}

	function cap(name) {
		return name.substring(0, 1).toUpperCase() + name.substring(1);
	}

	function onify(name) {
		return 'on' + name.split('-').map(function (word) {
			return cap(word);
		}).join('');
	}

	function isBool(node, name) {
		return (node.bools || node.booleans || []).indexOf(name) > -1;
	}

	function boolNorm(value) {
		if (value === '') {
			return true;
		}
		return normalize(value);
	}

	function propNorm(value) {
		return normalize(value);
	}

	function normalize(val) {
		if (typeof val === 'string') {
			if (val === 'false') {
				return false;
			} else if (val === 'null') {
				return null;
			} else if (val === 'true') {
				return true;
			}
			if (val.indexOf('/') > -1 || (val.match(/-/g) || []).length > 1) {
				// type of date
				return val;
			}
		}
		if (!isNaN(parseFloat(val))) {
			return parseFloat(val);
		}
		return val;
	}

	BaseComponent.addPlugin({
		name: 'properties',
		order: 10,
		init: function init(node) {
			setProperties(node);
			setBooleans(node);
		},
		preAttributeChanged: function preAttributeChanged(node, name, value) {
			if (node.isSettingAttribute) {
				return false;
			}
			if (isBool(node, name)) {
				value = boolNorm(value);
				node[name] = !!value;
				if (!value) {
					node[name] = false;
					node.isSettingAttribute = true;
					node.removeAttribute(name);
					node.isSettingAttribute = false;
				} else {
					node[name] = true;
				}
				return;
			}

			node[name] = propNorm(value);
		}
	});
});

},{"BaseComponent":"BaseComponent"}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(["BaseComponent"], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        // Node / CommonJS
        module.exports = factory(require('BaseComponent'));
    } else {
        // Browser globals (root is window)
        root['undefined'] = factory(root.BaseComponent);
    }
})(undefined, function (BaseComponent) {
    'use strict';

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }return arr2;
        } else {
            return Array.from(arr);
        }
    }

    function assignRefs(node) {

        [].concat(_toConsumableArray(node.querySelectorAll('[ref]'))).forEach(function (child) {
            var name = child.getAttribute('ref');
            child.removeAttribute('ref');
            node[name] = child;
        });
    }

    function assignEvents(node) {
        // <div on="click:onClick">
        [].concat(_toConsumableArray(node.querySelectorAll('[on]'))).forEach(function (child, i, children) {
            if (child === node) {
                return;
            }
            var keyValue = child.getAttribute('on'),
                event = keyValue.split(':')[0].trim(),
                method = keyValue.split(':')[1].trim();
            // remove, so parent does not try to use it
            child.removeAttribute('on');

            node.on(child, event, function (e) {
                node[method](e);
            });
        });
    }

    BaseComponent.addPlugin({
        name: 'refs',
        order: 30,
        preConnected: function preConnected(node) {
            assignRefs(node);
            assignEvents(node);
        }
    });
});

},{"BaseComponent":"BaseComponent"}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(["BaseComponent"], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        // Node / CommonJS
        module.exports = factory(require('BaseComponent'));
    } else {
        // Browser globals (root is window)
        root['undefined'] = factory(root.BaseComponent);
    }
})(undefined, function (BaseComponent) {
    'use strict';

    var lightNodes = {};
    var inserted = {};

    function insert(node) {
        if (inserted[node._uid] || !hasTemplate(node)) {
            return;
        }
        collectLightNodes(node);
        insertTemplate(node);
        inserted[node._uid] = true;
    }

    function collectLightNodes(node) {
        lightNodes[node._uid] = lightNodes[node._uid] || [];
        while (node.childNodes.length) {
            lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
        }
    }

    function hasTemplate(node) {
        return node.templateString || node.templateId;
    }

    function insertTemplateChain(node) {
        var templates = node.getTemplateChain();
        templates.reverse().forEach(function (template) {
            getContainer(node).appendChild(BaseComponent.clone(template));
        });
        insertChildren(node);
    }

    function insertTemplate(node) {
        if (node.nestedTemplate) {
            insertTemplateChain(node);
            return;
        }
        var templateNode = node.getTemplateNode();

        if (templateNode) {
            node.appendChild(BaseComponent.clone(templateNode));
        }
        insertChildren(node);
    }

    function getContainer(node) {
        var containers = node.querySelectorAll('[ref="container"]');
        if (!containers || !containers.length) {
            return node;
        }
        return containers[containers.length - 1];
    }

    function insertChildren(node) {
        var i = void 0;
        var container = getContainer(node);
        var children = lightNodes[node._uid];

        if (container && children && children.length) {
            for (i = 0; i < children.length; i++) {
                container.appendChild(children[i]);
            }
        }
    }

    function toDom(html) {
        var node = document.createElement('div');
        node.innerHTML = html;
        return node.firstChild;
    }

    BaseComponent.prototype.getLightNodes = function () {
        return lightNodes[this._uid];
    };

    BaseComponent.prototype.getTemplateNode = function () {
        // caching causes different classes to pull the same template - wat?
        //if(!this.templateNode) {
        if (this.templateId) {
            this.templateNode = document.getElementById(this.templateId.replace('#', ''));
        } else if (this.templateString) {
            this.templateNode = toDom('<template>' + this.templateString + '</template>');
        }
        //}
        return this.templateNode;
    };

    BaseComponent.prototype.getTemplateChain = function () {

        var context = this,
            templates = [],
            template = void 0;

        // walk the prototype chain; Babel doesn't allow using
        // `super` since we are outside of the Class
        while (context) {
            context = Object.getPrototypeOf(context);
            if (!context) {
                break;
            }
            // skip prototypes without a template
            // (else it will pull an inherited template and cause duplicates)
            if (context.hasOwnProperty('templateString') || context.hasOwnProperty('templateId')) {
                template = context.getTemplateNode();
                if (template) {
                    templates.push(template);
                }
            }
        }
        return templates;
    };

    BaseComponent.addPlugin({
        name: 'template',
        order: 20,
        preConnected: function preConnected(node) {
            insert(node);
        }
    });
});

},{"BaseComponent":"BaseComponent"}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('custom-elements-polyfill');
var BaseComponent = require('../../dist/index');

console.log('BaseComponent', BaseComponent);

var TestLifecycle = function (_BaseComponent) {
	_inherits(TestLifecycle, _BaseComponent);

	_createClass(TestLifecycle, [{
		key: 'foo',
		set: function set(value) {
			this.__foo = value;
		},
		get: function get() {
			return this.__foo;
		}
	}, {
		key: 'bar',
		set: function set(value) {
			this.__bar = value;
		},
		get: function get() {
			return this.__bar || 'NOTSET';
		}
	}], [{
		key: 'observedAttributes',
		get: function get() {
			return ['foo', 'bar'];
		}
	}]);

	function TestLifecycle() {
		_classCallCheck(this, TestLifecycle);

		return _possibleConstructorReturn(this, (TestLifecycle.__proto__ || Object.getPrototypeOf(TestLifecycle)).call(this));
	}

	_createClass(TestLifecycle, [{
		key: 'connected',
		value: function connected() {
			on.fire(document, 'connected-called', this);
		}
	}, {
		key: 'domReady',
		value: function domReady() {
			on.fire(document, 'domready-called', this);
		}
	}, {
		key: 'disconnected',
		value: function disconnected() {
			on.fire(document, 'disconnected-called', this);
		}
	}]);

	return TestLifecycle;
}(BaseComponent);

customElements.define('test-lifecycle', TestLifecycle);

},{"../../dist/index":2,"custom-elements-polyfill":"custom-elements-polyfill"}],7:[function(require,module,exports){
'use strict';

//window['no-native-shim'] = true;
require('custom-elements-polyfill');
window.on = require('@clubajax/on');
window.dom = require('@clubajax/dom');

},{"@clubajax/dom":"@clubajax/dom","@clubajax/on":"@clubajax/on","custom-elements-polyfill":"custom-elements-polyfill"}],"BaseComponent":[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _on = require('@clubajax/on');

var BaseComponent = function (_HTMLElement) {
	_inherits(BaseComponent, _HTMLElement);

	function BaseComponent() {
		_classCallCheck(this, BaseComponent);

		var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));

		_this._uid = uid(_this.localName);
		privates[_this._uid] = { DOMSTATE: 'created' };
		privates[_this._uid].handleList = [];
		plugin('init', _this);
		return _this;
	}

	_createClass(BaseComponent, [{
		key: 'connectedCallback',
		value: function connectedCallback() {
			privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
			plugin('preConnected', this);
			nextTick(onCheckDomReady.bind(this));
			if (this.connected) {
				this.connected();
			}
			this.fire('connected');
			plugin('postConnected', this);
		}
	}, {
		key: 'onConnected',
		value: function onConnected(callback) {
			var _this2 = this;

			if (this.DOMSTATE === 'connected' || this.DOMSTATE === 'domready') {
				callback(this);
				return;
			}
			this.once('connected', function () {
				callback(_this2);
			});
		}
	}, {
		key: 'onDomReady',
		value: function onDomReady(callback) {
			var _this3 = this;

			if (this.DOMSTATE === 'domready') {
				callback(this);
				return;
			}
			this.once('domready', function () {
				callback(_this3);
			});
		}
	}, {
		key: 'disconnectedCallback',
		value: function disconnectedCallback() {
			var _this4 = this;

			privates[this._uid].DOMSTATE = 'disconnected';
			plugin('preDisconnected', this);
			if (this.disconnected) {
				this.disconnected();
			}
			this.fire('disconnected');

			var time = void 0,
			    dod = BaseComponent.destroyOnDisconnect;
			if (dod) {
				time = typeof dod === 'number' ? doc : 300;
				setTimeout(function () {
					if (_this4.DOMSTATE === 'disconnected') {
						_this4.destroy();
					}
				}, time);
			}
		}
	}, {
		key: 'attributeChangedCallback',
		value: function attributeChangedCallback(attrName, oldVal, newVal) {
			plugin('preAttributeChanged', this, attrName, newVal, oldVal);
			if (this.attributeChanged) {
				this.attributeChanged(attrName, newVal, oldVal);
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.fire('destroy');
			privates[this._uid].handleList.forEach(function (handle) {
				handle.remove();
			});
			_destroy(this);
		}
	}, {
		key: 'fire',
		value: function fire(eventName, eventDetail, bubbles) {
			return _on.fire(this, eventName, eventDetail, bubbles);
		}
	}, {
		key: 'emit',
		value: function emit(eventName, value) {
			return _on.emit(this, eventName, value);
		}
	}, {
		key: 'on',
		value: function on(node, eventName, selector, callback) {
			return this.registerHandle(typeof node !== 'string' ? // no node is supplied
			_on(node, eventName, selector, callback) : _on(this, node, eventName, selector));
		}
	}, {
		key: 'once',
		value: function once(node, eventName, selector, callback) {
			return this.registerHandle(typeof node !== 'string' ? // no node is supplied
			_on.once(node, eventName, selector, callback) : _on.once(this, node, eventName, selector, callback));
		}
	}, {
		key: 'attr',
		value: function attr(key, value, toggle) {
			this.isSettingAttribute = true;
			var add = toggle === undefined ? true : !!toggle;
			if (add) {
				this.setAttribute(key, value);
			} else {
				this.removeAttribute(key);
			}
			this.isSettingAttribute = false;
		}
	}, {
		key: 'registerHandle',
		value: function registerHandle(handle) {
			privates[this._uid].handleList.push(handle);
			return handle;
		}
	}, {
		key: 'DOMSTATE',
		get: function get() {
			return privates[this._uid].DOMSTATE;
		}
	}], [{
		key: 'clone',
		value: function clone(template) {
			if (template.content && template.content.children) {
				return document.importNode(template.content, true);
			}
			var frag = document.createDocumentFragment();
			var cloneNode = document.createElement('div');
			cloneNode.innerHTML = template.innerHTML;

			while (cloneNode.children.length) {
				frag.appendChild(cloneNode.children[0]);
			}
			return frag;
		}
	}, {
		key: 'addPlugin',
		value: function addPlugin(plug) {
			var i = void 0,
			    order = plug.order || 100;
			if (!plugins.length) {
				plugins.push(plug);
			} else if (plugins.length === 1) {
				if (plugins[0].order <= order) {
					plugins.push(plug);
				} else {
					plugins.unshift(plug);
				}
			} else if (plugins[0].order > order) {
				plugins.unshift(plug);
			} else {

				for (i = 1; i < plugins.length; i++) {
					if (order === plugins[i - 1].order || order > plugins[i - 1].order && order < plugins[i].order) {
						plugins.splice(i, 0, plug);
						return;
					}
				}
				// was not inserted...
				plugins.push(plug);
			}
		}
	}, {
		key: 'destroyOnDisconnect',
		set: function set(value) {
			privates['destroyOnDisconnect'] = value;
		},
		get: function get() {
			return privates['destroyOnDisconnect'];
		}
	}]);

	return BaseComponent;
}(HTMLElement);

var privates = {},
    plugins = [];

function plugin(method, node, a, b, c) {
	plugins.forEach(function (plug) {
		if (plug[method]) {
			plug[method](node, a, b, c);
		}
	});
}

function onCheckDomReady() {
	if (this.DOMSTATE !== 'connected' || privates[this._uid].domReadyFired) {
		return;
	}

	var count = 0,
	    children = getChildCustomNodes(this),
	    ourDomReady = onDomReady.bind(this);

	function addReady() {
		count++;
		if (count === children.length) {
			ourDomReady();
		}
	}

	// If no children, we're good - leaf node. Commence with onDomReady
	//
	if (!children.length) {
		ourDomReady();
	} else {
		// else, wait for all children to fire their `ready` events
		//
		children.forEach(function (child) {
			// check if child is already ready
			// also check for connected - this handles moving a node from another node
			// NOPE, that failed. removed for now child.DOMSTATE === 'connected'
			if (child.DOMSTATE === 'domready') {
				addReady();
			}
			// if not, wait for event
			child.on('domready', addReady);
		});
	}
}

function onDomReady() {
	privates[this._uid].DOMSTATE = 'domready';
	// domReady should only ever fire once
	privates[this._uid].domReadyFired = true;
	plugin('preDomReady', this);
	// call this.domReady first, so that the component
	// can finish initializing before firing any
	// subsequent events
	if (this.domReady) {
		this.domReady();
		this.domReady = function () {};
	}

	// allow component to fire this event
	// domReady() will still be called
	if (!this.fireOwnDomready) {
		this.fire('domready');
	}

	plugin('postDomReady', this);
}

function getChildCustomNodes(node) {
	// collect any children that are custom nodes
	// used to check if their dom is ready before
	// determining if this is ready
	var i = void 0,
	    nodes = [];
	for (i = 0; i < node.children.length; i++) {
		if (node.children[i].nodeName.indexOf('-') > -1) {
			nodes.push(node.children[i]);
		}
	}
	return nodes;
}

function nextTick(cb) {
	requestAnimationFrame(cb);
}

var uids = {};
function uid() {
	var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uid';

	if (uids[type] === undefined) {
		uids[type] = 0;
	}
	var id = type + '-' + (uids[type] + 1);
	uids[type]++;
	return id;
}

var destroyer = document.createElement('div');
function _destroy(node) {
	if (node) {
		destroyer.appendChild(node);
		destroyer.innerHTML = '';
	}
}

window.onDomReady = function (nodeOrNodes, callback) {
	function handleDomReady(node, cb) {
		function onReady() {
			cb(node);
			node.removeEventListener('domready', onReady);
		}

		if (node.DOMSTATE === 'domready') {
			cb(node);
		} else {
			node.addEventListener('domready', onReady);
		}
	}

	if (!Array.isArray(nodeOrNodes)) {
		handleDomReady(nodeOrNodes, callback);
		return;
	}

	var count = 0;

	function onArrayNodeReady() {
		count++;
		if (count === nodeOrNodes.length) {
			callback(nodeOrNodes);
		}
	}

	for (var i = 0; i < nodeOrNodes.length; i++) {
		handleDomReady(nodeOrNodes[i], onArrayNodeReady);
	}
};

module.exports = BaseComponent;

},{"@clubajax/on":"@clubajax/on"}]},{},[7,6])("BaseComponent")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L0Jhc2VDb21wb25lbnQuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9wcm9wZXJ0aWVzLmpzIiwiZGlzdC9yZWZzLmpzIiwiZGlzdC90ZW1wbGF0ZS5qcyIsInRlc3RzL3NyYy9kaXN0LXRlc3QuanMiLCJ0ZXN0cy9zcmMvZ2xvYmFscy5qcyIsInNyYy9CYXNlQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FDLFdBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QjtBQUN0QixLQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQzVDO0FBQ0EsU0FBTyxDQUFDLGNBQUQsQ0FBUCxFQUF5QixPQUF6QjtBQUNILEVBSEQsTUFHTyxJQUFJLFFBQU8sTUFBUCx5Q0FBTyxNQUFQLE9BQWtCLFFBQWxCLElBQThCLE9BQU8sT0FBekMsRUFBa0Q7QUFDckQ7QUFDQSxTQUFPLE9BQVAsR0FBaUIsUUFBUSxRQUFRLGNBQVIsQ0FBUixDQUFqQjtBQUNILEVBSE0sTUFHQTtBQUNIO0FBQ0EsT0FBSyxlQUFMLElBQXdCLFFBQVEsS0FBSyxFQUFiLENBQXhCO0FBQ0g7QUFDSCxDQVhELGFBV1EsVUFBVSxFQUFWLEVBQWM7QUFDdkI7O0FBRUEsS0FBSSxlQUFlLFlBQVk7QUFBRSxXQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQUUsUUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFBRSxRQUFJLGFBQWEsTUFBTSxDQUFOLENBQWpCLENBQTJCLFdBQVcsVUFBWCxHQUF3QixXQUFXLFVBQVgsSUFBeUIsS0FBakQsQ0FBd0QsV0FBVyxZQUFYLEdBQTBCLElBQTFCLENBQWdDLElBQUksV0FBVyxVQUFmLEVBQTJCLFdBQVcsUUFBWCxH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QUFFQSxVQUFTLGdCQUFULEdBQTZCO0FBQzVCO0FBQ0EsTUFBSSxVQUFVLFlBQVksTUFBMUIsRUFBa0M7QUFDakMsWUFBUyxXQUFUO0FBQ0E7QUFDRDs7QUFFRCxNQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksWUFBWSxNQUFoQyxFQUF3QyxHQUF4QyxFQUE2QztBQUM1QyxpQkFBZSxZQUFZLENBQVosQ0FBZixFQUErQixnQkFBL0I7QUFDQTtBQUVELENBakNEOztBQW1DQSxPQUFPLE9BQVAsR0FBaUIsYUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTURcbiAgICAgICAgZGVmaW5lKFtcIkBjbHViYWpheC9vblwiXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAvLyBOb2RlIC8gQ29tbW9uSlNcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ0BjbHViYWpheC9vbicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgICAgICByb290WydCYXNlQ29tcG9uZW50J10gPSBmYWN0b3J5KHJvb3Qub24pO1xuICAgIH1cblx0fSh0aGlzLCBmdW5jdGlvbiAob24pIHtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBCYXNlQ29tcG9uZW50ID0gZnVuY3Rpb24gKF9IVE1MRWxlbWVudCkge1xuXHRfaW5oZXJpdHMoQmFzZUNvbXBvbmVudCwgX0hUTUxFbGVtZW50KTtcblxuXHRmdW5jdGlvbiBCYXNlQ29tcG9uZW50KCkge1xuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCYXNlQ29tcG9uZW50KTtcblxuXHRcdHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChCYXNlQ29tcG9uZW50Ll9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQmFzZUNvbXBvbmVudCkpLmNhbGwodGhpcykpO1xuXG5cdFx0X3RoaXMuX3VpZCA9IHVpZChfdGhpcy5sb2NhbE5hbWUpO1xuXHRcdHByaXZhdGVzW190aGlzLl91aWRdID0geyBET01TVEFURTogJ2NyZWF0ZWQnIH07XG5cdFx0cHJpdmF0ZXNbX3RoaXMuX3VpZF0uaGFuZGxlTGlzdCA9IFtdO1xuXHRcdHBsdWdpbignaW5pdCcsIF90aGlzKTtcblx0XHRyZXR1cm4gX3RoaXM7XG5cdH1cblxuXHRfY3JlYXRlQ2xhc3MoQmFzZUNvbXBvbmVudCwgW3tcblx0XHRrZXk6ICdjb25uZWN0ZWRDYWxsYmFjaycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA/ICdkb21yZWFkeScgOiAnY29ubmVjdGVkJztcblx0XHRcdHBsdWdpbigncHJlQ29ubmVjdGVkJywgdGhpcyk7XG5cdFx0XHRuZXh0VGljayhvbkNoZWNrRG9tUmVhZHkuYmluZCh0aGlzKSk7XG5cdFx0XHRpZiAodGhpcy5jb25uZWN0ZWQpIHtcblx0XHRcdFx0dGhpcy5jb25uZWN0ZWQoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuZmlyZSgnY29ubmVjdGVkJyk7XG5cdFx0XHRwbHVnaW4oJ3Bvc3RDb25uZWN0ZWQnLCB0aGlzKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbkNvbm5lY3RlZCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uQ29ubmVjdGVkKGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnIHx8IHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMub25jZSgnY29ubmVjdGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYWxsYmFjayhfdGhpczIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb25Eb21SZWFkeScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uRG9tUmVhZHkoY2FsbGJhY2spIHtcblx0XHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5vbmNlKCdkb21yZWFkeScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y2FsbGJhY2soX3RoaXMzKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHR2YXIgX3RoaXM0ID0gdGhpcztcblxuXHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkaXNjb25uZWN0ZWQnO1xuXHRcdFx0cGx1Z2luKCdwcmVEaXNjb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRcdGlmICh0aGlzLmRpc2Nvbm5lY3RlZCkge1xuXHRcdFx0XHR0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5maXJlKCdkaXNjb25uZWN0ZWQnKTtcblxuXHRcdFx0dmFyIHRpbWUgPSB2b2lkIDAsXG5cdFx0XHQgICAgZG9kID0gQmFzZUNvbXBvbmVudC5kZXN0cm95T25EaXNjb25uZWN0O1xuXHRcdFx0aWYgKGRvZCkge1xuXHRcdFx0XHR0aW1lID0gdHlwZW9mIGRvZCA9PT0gJ251bWJlcicgPyBkb2MgOiAzMDA7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmIChfdGhpczQuRE9NU1RBVEUgPT09ICdkaXNjb25uZWN0ZWQnKSB7XG5cdFx0XHRcdFx0XHRfdGhpczQuZGVzdHJveSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGltZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJOYW1lLCBvbGRWYWwsIG5ld1ZhbCkge1xuXHRcdFx0cGx1Z2luKCdwcmVBdHRyaWJ1dGVDaGFuZ2VkJywgdGhpcywgYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcblx0XHRcdGlmICh0aGlzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcblx0XHRcdFx0dGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZGVzdHJveScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdFx0XHR0aGlzLmZpcmUoJ2Rlc3Ryb3knKTtcblx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcblx0XHRcdFx0aGFuZGxlLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHRfZGVzdHJveSh0aGlzKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdmaXJlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZmlyZShldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG5cdFx0XHRyZXR1cm4gb24uZmlyZSh0aGlzLCBldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdlbWl0Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIChfb24pIHtcblx0XHRcdGZ1bmN0aW9uIG9uKF94LCBfeDIsIF94MywgX3g0KSB7XG5cdFx0XHRcdHJldHVybiBfb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdH1cblxuXHRcdFx0b24udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBfb24udG9TdHJpbmcoKTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBvbjtcblx0XHR9KGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUodHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0b24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDogb24odGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvcikpO1xuXHRcdH0pXG5cdH0sIHtcblx0XHRrZXk6ICdvbmNlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gb25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUodHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0b24ub25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykgOiBvbi5vbmNlKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnYXR0cicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWx1ZSwgdG9nZ2xlKSB7XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHR2YXIgYWRkID0gdG9nZ2xlID09PSB1bmRlZmluZWQgPyB0cnVlIDogISF0b2dnbGU7XG5cdFx0XHRpZiAoYWRkKSB7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAncmVnaXN0ZXJIYW5kbGUnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiByZWdpc3RlckhhbmRsZShoYW5kbGUpIHtcblx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG5cdFx0XHRyZXR1cm4gaGFuZGxlO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ0RPTVNUQVRFJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFO1xuXHRcdH1cblx0fV0sIFt7XG5cdFx0a2V5OiAnY2xvbmUnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBjbG9uZSh0ZW1wbGF0ZSkge1xuXHRcdFx0aWYgKHRlbXBsYXRlLmNvbnRlbnQgJiYgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikge1xuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdFx0dmFyIGNsb25lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y2xvbmVOb2RlLmlubmVySFRNTCA9IHRlbXBsYXRlLmlubmVySFRNTDtcblxuXHRcdFx0d2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0ZnJhZy5hcHBlbmRDaGlsZChjbG9uZU5vZGUuY2hpbGRyZW5bMF0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWc7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnYWRkUGx1Z2luJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYWRkUGx1Z2luKHBsdWcpIHtcblx0XHRcdHZhciBpID0gdm9pZCAwLFxuXHRcdFx0ICAgIG9yZGVyID0gcGx1Zy5vcmRlciB8fCAxMDA7XG5cdFx0XHRpZiAoIXBsdWdpbnMubGVuZ3RoKSB7XG5cdFx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHRcdH0gZWxzZSBpZiAocGx1Z2lucy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0aWYgKHBsdWdpbnNbMF0ub3JkZXIgPD0gb3JkZXIpIHtcblx0XHRcdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPiBvcmRlcikge1xuXHRcdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGZvciAoaSA9IDE7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKG9yZGVyID09PSBwbHVnaW5zW2kgLSAxXS5vcmRlciB8fCBvcmRlciA+IHBsdWdpbnNbaSAtIDFdLm9yZGVyICYmIG9yZGVyIDwgcGx1Z2luc1tpXS5vcmRlcikge1xuXHRcdFx0XHRcdFx0cGx1Z2lucy5zcGxpY2UoaSwgMCwgcGx1Zyk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHdhcyBub3QgaW5zZXJ0ZWQuLi5cblx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG5cdFx0XHRwcml2YXRlc1snZGVzdHJveU9uRGlzY29ubmVjdCddID0gdmFsdWU7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBwcml2YXRlc1snZGVzdHJveU9uRGlzY29ubmVjdCddO1xuXHRcdH1cblx0fV0pO1xuXG5cdHJldHVybiBCYXNlQ29tcG9uZW50O1xufShIVE1MRWxlbWVudCk7XG5cbnZhciBwcml2YXRlcyA9IHt9LFxuICAgIHBsdWdpbnMgPSBbXTtcblxuZnVuY3Rpb24gcGx1Z2luKG1ldGhvZCwgbm9kZSwgYSwgYiwgYykge1xuXHRwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWcpIHtcblx0XHRpZiAocGx1Z1ttZXRob2RdKSB7XG5cdFx0XHRwbHVnW21ldGhvZF0obm9kZSwgYSwgYiwgYyk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gb25DaGVja0RvbVJlYWR5KCkge1xuXHRpZiAodGhpcy5ET01TVEFURSAhPT0gJ2Nvbm5lY3RlZCcgfHwgcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNvdW50ID0gMCxcblx0ICAgIGNoaWxkcmVuID0gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyh0aGlzKSxcblx0ICAgIG91ckRvbVJlYWR5ID0gb25Eb21SZWFkeS5iaW5kKHRoaXMpO1xuXG5cdGZ1bmN0aW9uIGFkZFJlYWR5KCkge1xuXHRcdGNvdW50Kys7XG5cdFx0aWYgKGNvdW50ID09PSBjaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdG91ckRvbVJlYWR5KCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gSWYgbm8gY2hpbGRyZW4sIHdlJ3JlIGdvb2QgLSBsZWFmIG5vZGUuIENvbW1lbmNlIHdpdGggb25Eb21SZWFkeVxuXHQvL1xuXHRpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdG91ckRvbVJlYWR5KCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gZWxzZSwgd2FpdCBmb3IgYWxsIGNoaWxkcmVuIHRvIGZpcmUgdGhlaXIgYHJlYWR5YCBldmVudHNcblx0XHQvL1xuXHRcdGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHQvLyBjaGVjayBpZiBjaGlsZCBpcyBhbHJlYWR5IHJlYWR5XG5cdFx0XHQvLyBhbHNvIGNoZWNrIGZvciBjb25uZWN0ZWQgLSB0aGlzIGhhbmRsZXMgbW92aW5nIGEgbm9kZSBmcm9tIGFub3RoZXIgbm9kZVxuXHRcdFx0Ly8gTk9QRSwgdGhhdCBmYWlsZWQuIHJlbW92ZWQgZm9yIG5vdyBjaGlsZC5ET01TVEFURSA9PT0gJ2Nvbm5lY3RlZCdcblx0XHRcdGlmIChjaGlsZC5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0XHRhZGRSZWFkeSgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYgbm90LCB3YWl0IGZvciBldmVudFxuXHRcdFx0Y2hpbGQub24oJ2RvbXJlYWR5JywgYWRkUmVhZHkpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9uRG9tUmVhZHkoKSB7XG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZG9tcmVhZHknO1xuXHQvLyBkb21SZWFkeSBzaG91bGQgb25seSBldmVyIGZpcmUgb25jZVxuXHRwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPSB0cnVlO1xuXHRwbHVnaW4oJ3ByZURvbVJlYWR5JywgdGhpcyk7XG5cdC8vIGNhbGwgdGhpcy5kb21SZWFkeSBmaXJzdCwgc28gdGhhdCB0aGUgY29tcG9uZW50XG5cdC8vIGNhbiBmaW5pc2ggaW5pdGlhbGl6aW5nIGJlZm9yZSBmaXJpbmcgYW55XG5cdC8vIHN1YnNlcXVlbnQgZXZlbnRzXG5cdGlmICh0aGlzLmRvbVJlYWR5KSB7XG5cdFx0dGhpcy5kb21SZWFkeSgpO1xuXHRcdHRoaXMuZG9tUmVhZHkgPSBmdW5jdGlvbiAoKSB7fTtcblx0fVxuXG5cdC8vIGFsbG93IGNvbXBvbmVudCB0byBmaXJlIHRoaXMgZXZlbnRcblx0Ly8gZG9tUmVhZHkoKSB3aWxsIHN0aWxsIGJlIGNhbGxlZFxuXHRpZiAoIXRoaXMuZmlyZU93bkRvbXJlYWR5KSB7XG5cdFx0dGhpcy5maXJlKCdkb21yZWFkeScpO1xuXHR9XG5cblx0cGx1Z2luKCdwb3N0RG9tUmVhZHknLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyhub2RlKSB7XG5cdC8vIGNvbGxlY3QgYW55IGNoaWxkcmVuIHRoYXQgYXJlIGN1c3RvbSBub2Rlc1xuXHQvLyB1c2VkIHRvIGNoZWNrIGlmIHRoZWlyIGRvbSBpcyByZWFkeSBiZWZvcmVcblx0Ly8gZGV0ZXJtaW5pbmcgaWYgdGhpcyBpcyByZWFkeVxuXHR2YXIgaSA9IHZvaWQgMCxcblx0ICAgIG5vZGVzID0gW107XG5cdGZvciAoaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKG5vZGUuY2hpbGRyZW5baV0ubm9kZU5hbWUuaW5kZXhPZignLScpID4gLTEpIHtcblx0XHRcdG5vZGVzLnB1c2gobm9kZS5jaGlsZHJlbltpXSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBub2Rlcztcbn1cblxuZnVuY3Rpb24gbmV4dFRpY2soY2IpIHtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbn1cblxudmFyIHVpZHMgPSB7fTtcbmZ1bmN0aW9uIHVpZCgpIHtcblx0dmFyIHR5cGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICd1aWQnO1xuXG5cdGlmICh1aWRzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcblx0XHR1aWRzW3R5cGVdID0gMDtcblx0fVxuXHR2YXIgaWQgPSB0eXBlICsgJy0nICsgKHVpZHNbdHlwZV0gKyAxKTtcblx0dWlkc1t0eXBlXSsrO1xuXHRyZXR1cm4gaWQ7XG59XG5cbnZhciBkZXN0cm95ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmZ1bmN0aW9uIF9kZXN0cm95KG5vZGUpIHtcblx0aWYgKG5vZGUpIHtcblx0XHRkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0ZGVzdHJveWVyLmlubmVySFRNTCA9ICcnO1xuXHR9XG59XG5cbndpbmRvdy5vbkRvbVJlYWR5ID0gZnVuY3Rpb24gKG5vZGVPck5vZGVzLCBjYWxsYmFjaykge1xuXHRmdW5jdGlvbiBoYW5kbGVEb21SZWFkeShub2RlLCBjYikge1xuXHRcdGZ1bmN0aW9uIG9uUmVhZHkoKSB7XG5cdFx0XHRjYihub2RlKTtcblx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcblx0XHR9XG5cblx0XHRpZiAobm9kZS5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0Y2Iobm9kZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIUFycmF5LmlzQXJyYXkobm9kZU9yTm9kZXMpKSB7XG5cdFx0aGFuZGxlRG9tUmVhZHkobm9kZU9yTm9kZXMsIGNhbGxiYWNrKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgY291bnQgPSAwO1xuXG5cdGZ1bmN0aW9uIG9uQXJyYXlOb2RlUmVhZHkoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IG5vZGVPck5vZGVzLmxlbmd0aCkge1xuXHRcdFx0Y2FsbGJhY2sobm9kZU9yTm9kZXMpO1xuXHRcdH1cblx0fVxuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZU9yTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRoYW5kbGVEb21SZWFkeShub2RlT3JOb2Rlc1tpXSwgb25BcnJheU5vZGVSZWFkeSk7XG5cdH1cbn07XG5cblx0cmV0dXJuIEJhc2VDb21wb25lbnQ7XG5cbn0pKTsiLCIoZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5CYXNlQ29tcG9uZW50ID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9vbiA9IHJlcXVpcmUoJ0BjbHViYWpheC9vbicpO1xuXG52YXIgQmFzZUNvbXBvbmVudCA9IGZ1bmN0aW9uIChfSFRNTEVsZW1lbnQpIHtcblx0X2luaGVyaXRzKEJhc2VDb21wb25lbnQsIF9IVE1MRWxlbWVudCk7XG5cblx0ZnVuY3Rpb24gQmFzZUNvbXBvbmVudCgpIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFzZUNvbXBvbmVudCk7XG5cblx0XHR2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQmFzZUNvbXBvbmVudC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEJhc2VDb21wb25lbnQpKS5jYWxsKHRoaXMpKTtcblxuXHRcdF90aGlzLl91aWQgPSB1aWQoX3RoaXMubG9jYWxOYW1lKTtcblx0XHRwcml2YXRlc1tfdGhpcy5fdWlkXSA9IHsgRE9NU1RBVEU6ICdjcmVhdGVkJyB9O1xuXHRcdHByaXZhdGVzW190aGlzLl91aWRdLmhhbmRsZUxpc3QgPSBbXTtcblx0XHRwbHVnaW4oJ2luaXQnLCBfdGhpcyk7XG5cdFx0cmV0dXJuIF90aGlzO1xuXHR9XG5cblx0X2NyZWF0ZUNsYXNzKEJhc2VDb21wb25lbnQsIFt7XG5cdFx0a2V5OiAnY29ubmVjdGVkQ2FsbGJhY2snLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPyAnZG9tcmVhZHknIDogJ2Nvbm5lY3RlZCc7XG5cdFx0XHRwbHVnaW4oJ3ByZUNvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdFx0bmV4dFRpY2sob25DaGVja0RvbVJlYWR5LmJpbmQodGhpcykpO1xuXHRcdFx0aWYgKHRoaXMuY29ubmVjdGVkKSB7XG5cdFx0XHRcdHRoaXMuY29ubmVjdGVkKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmZpcmUoJ2Nvbm5lY3RlZCcpO1xuXHRcdFx0cGx1Z2luKCdwb3N0Q29ubmVjdGVkJywgdGhpcyk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb25Db25uZWN0ZWQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvbkNvbm5lY3RlZChjYWxsYmFjaykge1xuXHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdGlmICh0aGlzLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJyB8fCB0aGlzLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLm9uY2UoJ2Nvbm5lY3RlZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y2FsbGJhY2soX3RoaXMyKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ29uRG9tUmVhZHknLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvbkRvbVJlYWR5KGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgX3RoaXMzID0gdGhpcztcblxuXHRcdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMub25jZSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrKF90aGlzMyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdkaXNjb25uZWN0ZWRDYWxsYmFjaycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0dmFyIF90aGlzNCA9IHRoaXM7XG5cblx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZGlzY29ubmVjdGVkJztcblx0XHRcdHBsdWdpbigncHJlRGlzY29ubmVjdGVkJywgdGhpcyk7XG5cdFx0XHRpZiAodGhpcy5kaXNjb25uZWN0ZWQpIHtcblx0XHRcdFx0dGhpcy5kaXNjb25uZWN0ZWQoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuZmlyZSgnZGlzY29ubmVjdGVkJyk7XG5cblx0XHRcdHZhciB0aW1lID0gdm9pZCAwLFxuXHRcdFx0ICAgIGRvZCA9IEJhc2VDb21wb25lbnQuZGVzdHJveU9uRGlzY29ubmVjdDtcblx0XHRcdGlmIChkb2QpIHtcblx0XHRcdFx0dGltZSA9IHR5cGVvZiBkb2QgPT09ICdudW1iZXInID8gZG9jIDogMzAwO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoX3RoaXM0LkRPTVNUQVRFID09PSAnZGlzY29ubmVjdGVkJykge1xuXHRcdFx0XHRcdFx0X3RoaXM0LmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRpbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcblx0XHRcdHBsdWdpbigncHJlQXR0cmlidXRlQ2hhbmdlZCcsIHRoaXMsIGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0XHRpZiAodGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKSB7XG5cdFx0XHRcdHRoaXMuYXR0cmlidXRlQ2hhbmdlZChhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2Rlc3Ryb3knLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHRcdFx0dGhpcy5maXJlKCdkZXN0cm95Jyk7XG5cdFx0XHRwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XG5cdFx0XHRcdGhhbmRsZS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0X2Rlc3Ryb3kodGhpcyk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZmlyZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGZpcmUoZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcykge1xuXHRcdFx0cmV0dXJuIF9vbi5maXJlKHRoaXMsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2VtaXQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBlbWl0KGV2ZW50TmFtZSwgdmFsdWUpIHtcblx0XHRcdHJldHVybiBfb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZSh0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRfb24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDogX29uKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IpKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbmNlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gb25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUodHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0X29uLm9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDogX29uLm9uY2UodGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdhdHRyJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0cihrZXksIHZhbHVlLCB0b2dnbGUpIHtcblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdHZhciBhZGQgPSB0b2dnbGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIXRvZ2dsZTtcblx0XHRcdGlmIChhZGQpIHtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdyZWdpc3RlckhhbmRsZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHJlZ2lzdGVySGFuZGxlKGhhbmRsZSkge1xuXHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LnB1c2goaGFuZGxlKTtcblx0XHRcdHJldHVybiBoYW5kbGU7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnRE9NU1RBVEUnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG5cdFx0fVxuXHR9XSwgW3tcblx0XHRrZXk6ICdjbG9uZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGNsb25lKHRlbXBsYXRlKSB7XG5cdFx0XHRpZiAodGVtcGxhdGUuY29udGVudCAmJiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKSB7XG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0XHR2YXIgY2xvbmVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG5cdFx0XHR3aGlsZSAoY2xvbmVOb2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRmcmFnLmFwcGVuZENoaWxkKGNsb25lTm9kZS5jaGlsZHJlblswXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZztcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdhZGRQbHVnaW4nLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBhZGRQbHVnaW4ocGx1Zykge1xuXHRcdFx0dmFyIGkgPSB2b2lkIDAsXG5cdFx0XHQgICAgb3JkZXIgPSBwbHVnLm9yZGVyIHx8IDEwMDtcblx0XHRcdGlmICghcGx1Z2lucy5sZW5ndGgpIHtcblx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0fSBlbHNlIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRpZiAocGx1Z2luc1swXS5vcmRlciA8PSBvcmRlcikge1xuXHRcdFx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAocGx1Z2luc1swXS5vcmRlciA+IG9yZGVyKSB7XG5cdFx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Zm9yIChpID0gMTsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAob3JkZXIgPT09IHBsdWdpbnNbaSAtIDFdLm9yZGVyIHx8IG9yZGVyID4gcGx1Z2luc1tpIC0gMV0ub3JkZXIgJiYgb3JkZXIgPCBwbHVnaW5zW2ldLm9yZGVyKSB7XG5cdFx0XHRcdFx0XHRwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gd2FzIG5vdCBpbnNlcnRlZC4uLlxuXHRcdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZGVzdHJveU9uRGlzY29ubmVjdCcsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdHByaXZhdGVzWydkZXN0cm95T25EaXNjb25uZWN0J10gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHByaXZhdGVzWydkZXN0cm95T25EaXNjb25uZWN0J107XG5cdFx0fVxuXHR9XSk7XG5cblx0cmV0dXJuIEJhc2VDb21wb25lbnQ7XG59KEhUTUxFbGVtZW50KTtcblxudmFyIHByaXZhdGVzID0ge30sXG4gICAgcGx1Z2lucyA9IFtdO1xuXG5mdW5jdGlvbiBwbHVnaW4obWV0aG9kLCBub2RlLCBhLCBiLCBjKSB7XG5cdHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Zykge1xuXHRcdGlmIChwbHVnW21ldGhvZF0pIHtcblx0XHRcdHBsdWdbbWV0aG9kXShub2RlLCBhLCBiLCBjKTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBvbkNoZWNrRG9tUmVhZHkoKSB7XG5cdGlmICh0aGlzLkRPTVNUQVRFICE9PSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgY291bnQgPSAwLFxuXHQgICAgY2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuXHQgICAgb3VyRG9tUmVhZHkgPSBvbkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cblx0ZnVuY3Rpb24gYWRkUmVhZHkoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IGNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0b3VyRG9tUmVhZHkoKTtcblx0XHR9XG5cdH1cblxuXHQvLyBJZiBubyBjaGlsZHJlbiwgd2UncmUgZ29vZCAtIGxlYWYgbm9kZS4gQ29tbWVuY2Ugd2l0aCBvbkRvbVJlYWR5XG5cdC8vXG5cdGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0b3VyRG9tUmVhZHkoKTtcblx0fSBlbHNlIHtcblx0XHQvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuXHRcdC8vXG5cdFx0Y2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdC8vIGNoZWNrIGlmIGNoaWxkIGlzIGFscmVhZHkgcmVhZHlcblx0XHRcdC8vIGFsc28gY2hlY2sgZm9yIGNvbm5lY3RlZCAtIHRoaXMgaGFuZGxlcyBtb3ZpbmcgYSBub2RlIGZyb20gYW5vdGhlciBub2RlXG5cdFx0XHQvLyBOT1BFLCB0aGF0IGZhaWxlZC4gcmVtb3ZlZCBmb3Igbm93IGNoaWxkLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJ1xuXHRcdFx0aWYgKGNoaWxkLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGFkZFJlYWR5KCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiBub3QsIHdhaXQgZm9yIGV2ZW50XG5cdFx0XHRjaGlsZC5vbignZG9tcmVhZHknLCBhZGRSZWFkeSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gb25Eb21SZWFkeSgpIHtcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG5cdC8vIGRvbVJlYWR5IHNob3VsZCBvbmx5IGV2ZXIgZmlyZSBvbmNlXG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG5cdHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcblx0Ly8gY2FsbCB0aGlzLmRvbVJlYWR5IGZpcnN0LCBzbyB0aGF0IHRoZSBjb21wb25lbnRcblx0Ly8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcblx0Ly8gc3Vic2VxdWVudCBldmVudHNcblx0aWYgKHRoaXMuZG9tUmVhZHkpIHtcblx0XHR0aGlzLmRvbVJlYWR5KCk7XG5cdFx0dGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuXHR9XG5cblx0Ly8gYWxsb3cgY29tcG9uZW50IHRvIGZpcmUgdGhpcyBldmVudFxuXHQvLyBkb21SZWFkeSgpIHdpbGwgc3RpbGwgYmUgY2FsbGVkXG5cdGlmICghdGhpcy5maXJlT3duRG9tcmVhZHkpIHtcblx0XHR0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cdH1cblxuXHRwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzKG5vZGUpIHtcblx0Ly8gY29sbGVjdCBhbnkgY2hpbGRyZW4gdGhhdCBhcmUgY3VzdG9tIG5vZGVzXG5cdC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuXHQvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG5cdHZhciBpID0gdm9pZCAwLFxuXHQgICAgbm9kZXMgPSBbXTtcblx0Zm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobm9kZS5jaGlsZHJlbltpXS5ub2RlTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuXHRcdFx0bm9kZXMucHVzaChub2RlLmNoaWxkcmVuW2ldKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayhjYikge1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xufVxuXG52YXIgdWlkcyA9IHt9O1xuZnVuY3Rpb24gdWlkKCkge1xuXHR2YXIgdHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ3VpZCc7XG5cblx0aWYgKHVpZHNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdHVpZHNbdHlwZV0gPSAwO1xuXHR9XG5cdHZhciBpZCA9IHR5cGUgKyAnLScgKyAodWlkc1t0eXBlXSArIDEpO1xuXHR1aWRzW3R5cGVdKys7XG5cdHJldHVybiBpZDtcbn1cblxudmFyIGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZnVuY3Rpb24gX2Rlc3Ryb3kobm9kZSkge1xuXHRpZiAobm9kZSkge1xuXHRcdGRlc3Ryb3llci5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG5cdH1cbn1cblxud2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZU9yTm9kZXMsIGNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGhhbmRsZURvbVJlYWR5KG5vZGUsIGNiKSB7XG5cdFx0ZnVuY3Rpb24gb25SZWFkeSgpIHtcblx0XHRcdGNiKG5vZGUpO1xuXHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuXHRcdH1cblxuXHRcdGlmIChub2RlLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRjYihub2RlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuXHRcdH1cblx0fVxuXG5cdGlmICghQXJyYXkuaXNBcnJheShub2RlT3JOb2RlcykpIHtcblx0XHRoYW5kbGVEb21SZWFkeShub2RlT3JOb2RlcywgY2FsbGJhY2spO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjb3VudCA9IDA7XG5cblx0ZnVuY3Rpb24gb25BcnJheU5vZGVSZWFkeSgpIHtcblx0XHRjb3VudCsrO1xuXHRcdGlmIChjb3VudCA9PT0gbm9kZU9yTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRjYWxsYmFjayhub2RlT3JOb2Rlcyk7XG5cdFx0fVxuXHR9XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBub2RlT3JOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdGhhbmRsZURvbVJlYWR5KG5vZGVPck5vZGVzW2ldLCBvbkFycmF5Tm9kZVJlYWR5KTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ29tcG9uZW50O1xuXG59LHtcIkBjbHViYWpheC9vblwiOlwiQGNsdWJhamF4L29uXCJ9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIG9uID0gcmVxdWlyZSgnQGNsdWJhamF4L29uJyk7XG52YXIgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xucmVxdWlyZSgnLi9wcm9wZXJ0aWVzJyk7XG5yZXF1aXJlKCcuL3RlbXBsYXRlJyk7XG5yZXF1aXJlKCcuL3JlZnMnKTtcbi8vY29uc3QgaXRlbVRlbXBsYXRlID0gcmVxdWlyZSgnLi9pdGVtLXRlbXBsYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbXBvbmVudDtcblxufSx7XCIuL0Jhc2VDb21wb25lbnRcIjoxLFwiLi9wcm9wZXJ0aWVzXCI6MyxcIi4vcmVmc1wiOjQsXCIuL3RlbXBsYXRlXCI6NSxcIkBjbHViYWpheC9vblwiOlwiQGNsdWJhamF4L29uXCJ9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIEJhc2VDb21wb25lbnQgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcblxuZnVuY3Rpb24gc2V0Qm9vbGVhbihub2RlLCBwcm9wKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gbm9kZS5oYXNBdHRyaWJ1dGUocHJvcCk7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKHByb3AsICcnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKHByb3ApO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZuID0gdGhpc1tvbmlmeShwcm9wKV07XG5cdFx0XHRpZiAoZm4pIHtcblx0XHRcdFx0Zm4uY2FsbCh0aGlzLCB2YWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0UHJvcGVydHkobm9kZSwgcHJvcCkge1xuXHR2YXIgcHJvcFZhbHVlID0gdm9pZCAwO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHByb3BWYWx1ZSAhPT0gdW5kZWZpbmVkID8gcHJvcFZhbHVlIDogbm9ybWFsaXplKHRoaXMuZ2V0QXR0cmlidXRlKHByb3ApKTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG5cdFx0XHR2YXIgZm4gPSB0aGlzW29uaWZ5KHByb3ApXTtcblx0XHRcdGlmIChmbikge1xuXHRcdFx0XHRvbkRvbVJlYWR5KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0cHJvcFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhbHVlID0gZm4uY2FsbChfdGhpcywgdmFsdWUpIHx8IHZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0T2JqZWN0KG5vZGUsIHByb3ApIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzWydfXycgKyBwcm9wXTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG5cdFx0XHR0aGlzWydfXycgKyBwcm9wXSA9IHZhbHVlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXMobm9kZSkge1xuXHR2YXIgcHJvcHMgPSBub2RlLnByb3BzIHx8IG5vZGUucHJvcGVydGllcztcblx0aWYgKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0aWYgKHByb3AgPT09ICdkaXNhYmxlZCcpIHtcblx0XHRcdFx0c2V0Qm9vbGVhbihub2RlLCBwcm9wKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNldFByb3BlcnR5KG5vZGUsIHByb3ApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldEJvb2xlYW5zKG5vZGUpIHtcblx0dmFyIHByb3BzID0gbm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zO1xuXHRpZiAocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdHMobm9kZSkge1xuXHR2YXIgcHJvcHMgPSBub2RlLm9iamVjdHM7XG5cdGlmIChwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdHNldE9iamVjdChub2RlLCBwcm9wKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBjYXAobmFtZSkge1xuXHRyZXR1cm4gbmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEpO1xufVxuXG5mdW5jdGlvbiBvbmlmeShuYW1lKSB7XG5cdHJldHVybiAnb24nICsgbmFtZS5zcGxpdCgnLScpLm1hcChmdW5jdGlvbiAod29yZCkge1xuXHRcdHJldHVybiBjYXAod29yZCk7XG5cdH0pLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBpc0Jvb2wobm9kZSwgbmFtZSkge1xuXHRyZXR1cm4gKG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucyB8fCBbXSkuaW5kZXhPZihuYW1lKSA+IC0xO1xufVxuXG5mdW5jdGlvbiBib29sTm9ybSh2YWx1ZSkge1xuXHRpZiAodmFsdWUgPT09ICcnKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIG5vcm1hbGl6ZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHByb3BOb3JtKHZhbHVlKSB7XG5cdHJldHVybiBub3JtYWxpemUodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemUodmFsKSB7XG5cdGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuXHRcdGlmICh2YWwgPT09ICdmYWxzZScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2UgaWYgKHZhbCA9PT0gJ251bGwnKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9IGVsc2UgaWYgKHZhbCA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKHZhbC5pbmRleE9mKCcvJykgPiAtMSB8fCAodmFsLm1hdGNoKC8tL2cpIHx8IFtdKS5sZW5ndGggPiAxKSB7XG5cdFx0XHQvLyB0eXBlIG9mIGRhdGVcblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fVxuXHR9XG5cdGlmICghaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSkge1xuXHRcdHJldHVybiBwYXJzZUZsb2F0KHZhbCk7XG5cdH1cblx0cmV0dXJuIHZhbDtcbn1cblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuXHRuYW1lOiAncHJvcGVydGllcycsXG5cdG9yZGVyOiAxMCxcblx0aW5pdDogZnVuY3Rpb24gaW5pdChub2RlKSB7XG5cdFx0c2V0UHJvcGVydGllcyhub2RlKTtcblx0XHRzZXRCb29sZWFucyhub2RlKTtcblx0fSxcblx0cHJlQXR0cmlidXRlQ2hhbmdlZDogZnVuY3Rpb24gcHJlQXR0cmlidXRlQ2hhbmdlZChub2RlLCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChub2RlLmlzU2V0dGluZ0F0dHJpYnV0ZSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoaXNCb29sKG5vZGUsIG5hbWUpKSB7XG5cdFx0XHR2YWx1ZSA9IGJvb2xOb3JtKHZhbHVlKTtcblx0XHRcdG5vZGVbbmFtZV0gPSAhIXZhbHVlO1xuXHRcdFx0aWYgKCF2YWx1ZSkge1xuXHRcdFx0XHRub2RlW25hbWVdID0gZmFsc2U7XG5cdFx0XHRcdG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdFx0bm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlW25hbWVdID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRub2RlW25hbWVdID0gcHJvcE5vcm0odmFsdWUpO1xuXHR9XG59KTtcblxufSx7XCIuL0Jhc2VDb21wb25lbnRcIjoxfV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuXG5mdW5jdGlvbiBhc3NpZ25SZWZzKG5vZGUpIHtcblxuICAgIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkobm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbcmVmXScpKSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICBjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICBub2RlW25hbWVdID0gY2hpbGQ7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbkV2ZW50cyhub2RlKSB7XG4gICAgLy8gPGRpdiBvbj1cImNsaWNrOm9uQ2xpY2tcIj5cbiAgICBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW29uXScpKSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGksIGNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChjaGlsZCA9PT0gbm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlWYWx1ZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnb24nKSxcbiAgICAgICAgICAgIGV2ZW50ID0ga2V5VmFsdWUuc3BsaXQoJzonKVswXS50cmltKCksXG4gICAgICAgICAgICBtZXRob2QgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzFdLnRyaW0oKTtcbiAgICAgICAgLy8gcmVtb3ZlLCBzbyBwYXJlbnQgZG9lcyBub3QgdHJ5IHRvIHVzZSBpdFxuICAgICAgICBjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ29uJyk7XG5cbiAgICAgICAgbm9kZS5vbihjaGlsZCwgZXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBub2RlW21ldGhvZF0oZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3JlZnMnLFxuICAgIG9yZGVyOiAzMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIHByZUNvbm5lY3RlZChub2RlKSB7XG4gICAgICAgIGFzc2lnblJlZnMobm9kZSk7XG4gICAgICAgIGFzc2lnbkV2ZW50cyhub2RlKTtcbiAgICB9XG59KTtcblxufSx7XCIuL0Jhc2VDb21wb25lbnRcIjoxfV0sNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5cbnZhciBsaWdodE5vZGVzID0ge307XG52YXIgaW5zZXJ0ZWQgPSB7fTtcblxuZnVuY3Rpb24gaW5zZXJ0KG5vZGUpIHtcbiAgICBpZiAoaW5zZXJ0ZWRbbm9kZS5fdWlkXSB8fCAhaGFzVGVtcGxhdGUobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKTtcbiAgICBpbnNlcnRUZW1wbGF0ZShub2RlKTtcbiAgICBpbnNlcnRlZFtub2RlLl91aWRdID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdExpZ2h0Tm9kZXMobm9kZSkge1xuICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSB8fCBbXTtcbiAgICB3aGlsZSAobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0ucHVzaChub2RlLnJlbW92ZUNoaWxkKG5vZGUuY2hpbGROb2Rlc1swXSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFzVGVtcGxhdGUobm9kZSkge1xuICAgIHJldHVybiBub2RlLnRlbXBsYXRlU3RyaW5nIHx8IG5vZGUudGVtcGxhdGVJZDtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGVDaGFpbihub2RlKSB7XG4gICAgdmFyIHRlbXBsYXRlcyA9IG5vZGUuZ2V0VGVtcGxhdGVDaGFpbigpO1xuICAgIHRlbXBsYXRlcy5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgZ2V0Q29udGFpbmVyKG5vZGUpLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGUpKTtcbiAgICB9KTtcbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGUobm9kZSkge1xuICAgIGlmIChub2RlLm5lc3RlZFRlbXBsYXRlKSB7XG4gICAgICAgIGluc2VydFRlbXBsYXRlQ2hhaW4obm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRlbXBsYXRlTm9kZSA9IG5vZGUuZ2V0VGVtcGxhdGVOb2RlKCk7XG5cbiAgICBpZiAodGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoQmFzZUNvbXBvbmVudC5jbG9uZSh0ZW1wbGF0ZU5vZGUpKTtcbiAgICB9XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRhaW5lcihub2RlKSB7XG4gICAgdmFyIGNvbnRhaW5lcnMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWY9XCJjb250YWluZXJcIl0nKTtcbiAgICBpZiAoIWNvbnRhaW5lcnMgfHwgIWNvbnRhaW5lcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyc1tjb250YWluZXJzLmxlbmd0aCAtIDFdO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRDaGlsZHJlbihub2RlKSB7XG4gICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgdmFyIGNvbnRhaW5lciA9IGdldENvbnRhaW5lcihub2RlKTtcbiAgICB2YXIgY2hpbGRyZW4gPSBsaWdodE5vZGVzW25vZGUuX3VpZF07XG5cbiAgICBpZiAoY29udGFpbmVyICYmIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRvRG9tKGh0bWwpIHtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRMaWdodE5vZGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsaWdodE5vZGVzW3RoaXMuX3VpZF07XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZU5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2FjaGluZyBjYXVzZXMgZGlmZmVyZW50IGNsYXNzZXMgdG8gcHVsbCB0aGUgc2FtZSB0ZW1wbGF0ZSAtIHdhdD9cbiAgICAvL2lmKCF0aGlzLnRlbXBsYXRlTm9kZSkge1xuICAgIGlmICh0aGlzLnRlbXBsYXRlSWQpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRlbXBsYXRlSWQucmVwbGFjZSgnIycsICcnKSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRlbXBsYXRlU3RyaW5nKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gdG9Eb20oJzx0ZW1wbGF0ZT4nICsgdGhpcy50ZW1wbGF0ZVN0cmluZyArICc8L3RlbXBsYXRlPicpO1xuICAgIH1cbiAgICAvL31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZU5vZGU7XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZUNoYWluID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICB0ZW1wbGF0ZXMgPSBbXSxcbiAgICAgICAgdGVtcGxhdGUgPSB2b2lkIDA7XG5cbiAgICAvLyB3YWxrIHRoZSBwcm90b3R5cGUgY2hhaW47IEJhYmVsIGRvZXNuJ3QgYWxsb3cgdXNpbmdcbiAgICAvLyBgc3VwZXJgIHNpbmNlIHdlIGFyZSBvdXRzaWRlIG9mIHRoZSBDbGFzc1xuICAgIHdoaWxlIChjb250ZXh0KSB7XG4gICAgICAgIGNvbnRleHQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udGV4dCk7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2tpcCBwcm90b3R5cGVzIHdpdGhvdXQgYSB0ZW1wbGF0ZVxuICAgICAgICAvLyAoZWxzZSBpdCB3aWxsIHB1bGwgYW4gaW5oZXJpdGVkIHRlbXBsYXRlIGFuZCBjYXVzZSBkdXBsaWNhdGVzKVxuICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVTdHJpbmcnKSB8fCBjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZUlkJykpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gY29udGV4dC5nZXRUZW1wbGF0ZU5vZGUoKTtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5wdXNoKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGVzO1xufTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICd0ZW1wbGF0ZScsXG4gICAgb3JkZXI6IDIwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gcHJlQ29ubmVjdGVkKG5vZGUpIHtcbiAgICAgICAgaW5zZXJ0KG5vZGUpO1xuICAgIH1cbn0pO1xuXG59LHtcIi4vQmFzZUNvbXBvbmVudFwiOjF9XX0se30sWzJdKSgyKVxufSk7IiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTURcbiAgICAgICAgZGVmaW5lKFtcIkJhc2VDb21wb25lbnRcIl0sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgLy8gTm9kZSAvIENvbW1vbkpTXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdCYXNlQ29tcG9uZW50JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgICAgIHJvb3RbJ3VuZGVmaW5lZCddID0gZmFjdG9yeShyb290LkJhc2VDb21wb25lbnQpO1xuICAgIH1cblx0fSh0aGlzLCBmdW5jdGlvbiAoQmFzZUNvbXBvbmVudCkge1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBzZXRCb29sZWFuKG5vZGUsIHByb3ApIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBub2RlLmhhc0F0dHJpYnV0ZShwcm9wKTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgJycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZm4gPSB0aGlzW29uaWZ5KHByb3ApXTtcblx0XHRcdGlmIChmbikge1xuXHRcdFx0XHRmbi5jYWxsKHRoaXMsIHZhbHVlKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShub2RlLCBwcm9wKSB7XG5cdHZhciBwcm9wVmFsdWUgPSB2b2lkIDA7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gcHJvcFZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wVmFsdWUgOiBub3JtYWxpemUodGhpcy5nZXRBdHRyaWJ1dGUocHJvcCkpO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKHByb3AsIHZhbHVlKTtcblx0XHRcdHZhciBmbiA9IHRoaXNbb25pZnkocHJvcCldO1xuXHRcdFx0aWYgKGZuKSB7XG5cdFx0XHRcdG9uRG9tUmVhZHkodGhpcywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRwcm9wVmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFsdWUgPSBmbi5jYWxsKF90aGlzLCB2YWx1ZSkgfHwgdmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRPYmplY3Qobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJ19fJyArIHByb3BdO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdHRoaXNbJ19fJyArIHByb3BdID0gdmFsdWU7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0UHJvcGVydGllcyhub2RlKSB7XG5cdHZhciBwcm9wcyA9IG5vZGUucHJvcHMgfHwgbm9kZS5wcm9wZXJ0aWVzO1xuXHRpZiAocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRpZiAocHJvcCA9PT0gJ2Rpc2FibGVkJykge1xuXHRcdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2V0UHJvcGVydHkobm9kZSwgcHJvcCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0Qm9vbGVhbnMobm9kZSkge1xuXHR2YXIgcHJvcHMgPSBub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnM7XG5cdGlmIChwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0T2JqZWN0cyhub2RlKSB7XG5cdHZhciBwcm9wcyA9IG5vZGUub2JqZWN0cztcblx0aWYgKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0T2JqZWN0KG5vZGUsIHByb3ApO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNhcChuYW1lKSB7XG5cdHJldHVybiBuYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHJpbmcoMSk7XG59XG5cbmZ1bmN0aW9uIG9uaWZ5KG5hbWUpIHtcblx0cmV0dXJuICdvbicgKyBuYW1lLnNwbGl0KCctJykubWFwKGZ1bmN0aW9uICh3b3JkKSB7XG5cdFx0cmV0dXJuIGNhcCh3b3JkKTtcblx0fSkuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGlzQm9vbChub2RlLCBuYW1lKSB7XG5cdHJldHVybiAobm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zIHx8IFtdKS5pbmRleE9mKG5hbWUpID4gLTE7XG59XG5cbmZ1bmN0aW9uIGJvb2xOb3JtKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSA9PT0gJycpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gbm9ybWFsaXplKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcHJvcE5vcm0odmFsdWUpIHtcblx0cmV0dXJuIG5vcm1hbGl6ZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWwpIHtcblx0aWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG5cdFx0aWYgKHZhbCA9PT0gJ2ZhbHNlJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gZWxzZSBpZiAodmFsID09PSAnbnVsbCcpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0gZWxzZSBpZiAodmFsID09PSAndHJ1ZScpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRpZiAodmFsLmluZGV4T2YoJy8nKSA+IC0xIHx8ICh2YWwubWF0Y2goLy0vZykgfHwgW10pLmxlbmd0aCA+IDEpIHtcblx0XHRcdC8vIHR5cGUgb2YgZGF0ZVxuXHRcdFx0cmV0dXJuIHZhbDtcblx0XHR9XG5cdH1cblx0aWYgKCFpc05hTihwYXJzZUZsb2F0KHZhbCkpKSB7XG5cdFx0cmV0dXJuIHBhcnNlRmxvYXQodmFsKTtcblx0fVxuXHRyZXR1cm4gdmFsO1xufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG5cdG5hbWU6ICdwcm9wZXJ0aWVzJyxcblx0b3JkZXI6IDEwLFxuXHRpbml0OiBmdW5jdGlvbiBpbml0KG5vZGUpIHtcblx0XHRzZXRQcm9wZXJ0aWVzKG5vZGUpO1xuXHRcdHNldEJvb2xlYW5zKG5vZGUpO1xuXHR9LFxuXHRwcmVBdHRyaWJ1dGVDaGFuZ2VkOiBmdW5jdGlvbiBwcmVBdHRyaWJ1dGVDaGFuZ2VkKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGlmIChpc0Jvb2wobm9kZSwgbmFtZSkpIHtcblx0XHRcdHZhbHVlID0gYm9vbE5vcm0odmFsdWUpO1xuXHRcdFx0bm9kZVtuYW1lXSA9ICEhdmFsdWU7XG5cdFx0XHRpZiAoIXZhbHVlKSB7XG5cdFx0XHRcdG5vZGVbbmFtZV0gPSBmYWxzZTtcblx0XHRcdFx0bm9kZS5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0XHRub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHRcdFx0bm9kZS5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGVbbmFtZV0gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5vZGVbbmFtZV0gPSBwcm9wTm9ybSh2YWx1ZSk7XG5cdH1cbn0pO1xuXG59KSk7IiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTURcbiAgICAgICAgZGVmaW5lKFtcIkJhc2VDb21wb25lbnRcIl0sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgLy8gTm9kZSAvIENvbW1vbkpTXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdCYXNlQ29tcG9uZW50JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgICAgIHJvb3RbJ3VuZGVmaW5lZCddID0gZmFjdG9yeShyb290LkJhc2VDb21wb25lbnQpO1xuICAgIH1cblx0fSh0aGlzLCBmdW5jdGlvbiAoQmFzZUNvbXBvbmVudCkge1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxuZnVuY3Rpb24gYXNzaWduUmVmcyhub2RlKSB7XG5cbiAgICBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW3JlZl0nKSkpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhciBuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgY2hpbGQucmVtb3ZlQXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGNoaWxkO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhc3NpZ25FdmVudHMobm9kZSkge1xuICAgIC8vIDxkaXYgb249XCJjbGljazpvbkNsaWNrXCI+XG4gICAgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tvbl0nKSkpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBpLCBjaGlsZHJlbikge1xuICAgICAgICBpZiAoY2hpbGQgPT09IG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIga2V5VmFsdWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ29uJyksXG4gICAgICAgICAgICBldmVudCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMF0udHJpbSgpLFxuICAgICAgICAgICAgbWV0aG9kID0ga2V5VmFsdWUuc3BsaXQoJzonKVsxXS50cmltKCk7XG4gICAgICAgIC8vIHJlbW92ZSwgc28gcGFyZW50IGRvZXMgbm90IHRyeSB0byB1c2UgaXRcbiAgICAgICAgY2hpbGQucmVtb3ZlQXR0cmlidXRlKCdvbicpO1xuXG4gICAgICAgIG5vZGUub24oY2hpbGQsIGV2ZW50LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbm9kZVttZXRob2RdKGUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICdyZWZzJyxcbiAgICBvcmRlcjogMzAsXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiBwcmVDb25uZWN0ZWQobm9kZSkge1xuICAgICAgICBhc3NpZ25SZWZzKG5vZGUpO1xuICAgICAgICBhc3NpZ25FdmVudHMobm9kZSk7XG4gICAgfVxufSk7XG5cbn0pKTsiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRFxuICAgICAgICBkZWZpbmUoW1wiQmFzZUNvbXBvbmVudFwiXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAvLyBOb2RlIC8gQ29tbW9uSlNcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ0Jhc2VDb21wb25lbnQnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdFsndW5kZWZpbmVkJ10gPSBmYWN0b3J5KHJvb3QuQmFzZUNvbXBvbmVudCk7XG4gICAgfVxuXHR9KHRoaXMsIGZ1bmN0aW9uIChCYXNlQ29tcG9uZW50KSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBsaWdodE5vZGVzID0ge307XG52YXIgaW5zZXJ0ZWQgPSB7fTtcblxuZnVuY3Rpb24gaW5zZXJ0KG5vZGUpIHtcbiAgICBpZiAoaW5zZXJ0ZWRbbm9kZS5fdWlkXSB8fCAhaGFzVGVtcGxhdGUobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKTtcbiAgICBpbnNlcnRUZW1wbGF0ZShub2RlKTtcbiAgICBpbnNlcnRlZFtub2RlLl91aWRdID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdExpZ2h0Tm9kZXMobm9kZSkge1xuICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSB8fCBbXTtcbiAgICB3aGlsZSAobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0ucHVzaChub2RlLnJlbW92ZUNoaWxkKG5vZGUuY2hpbGROb2Rlc1swXSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFzVGVtcGxhdGUobm9kZSkge1xuICAgIHJldHVybiBub2RlLnRlbXBsYXRlU3RyaW5nIHx8IG5vZGUudGVtcGxhdGVJZDtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGVDaGFpbihub2RlKSB7XG4gICAgdmFyIHRlbXBsYXRlcyA9IG5vZGUuZ2V0VGVtcGxhdGVDaGFpbigpO1xuICAgIHRlbXBsYXRlcy5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgZ2V0Q29udGFpbmVyKG5vZGUpLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGUpKTtcbiAgICB9KTtcbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGUobm9kZSkge1xuICAgIGlmIChub2RlLm5lc3RlZFRlbXBsYXRlKSB7XG4gICAgICAgIGluc2VydFRlbXBsYXRlQ2hhaW4obm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRlbXBsYXRlTm9kZSA9IG5vZGUuZ2V0VGVtcGxhdGVOb2RlKCk7XG5cbiAgICBpZiAodGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoQmFzZUNvbXBvbmVudC5jbG9uZSh0ZW1wbGF0ZU5vZGUpKTtcbiAgICB9XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRhaW5lcihub2RlKSB7XG4gICAgdmFyIGNvbnRhaW5lcnMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWY9XCJjb250YWluZXJcIl0nKTtcbiAgICBpZiAoIWNvbnRhaW5lcnMgfHwgIWNvbnRhaW5lcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyc1tjb250YWluZXJzLmxlbmd0aCAtIDFdO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRDaGlsZHJlbihub2RlKSB7XG4gICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgdmFyIGNvbnRhaW5lciA9IGdldENvbnRhaW5lcihub2RlKTtcbiAgICB2YXIgY2hpbGRyZW4gPSBsaWdodE5vZGVzW25vZGUuX3VpZF07XG5cbiAgICBpZiAoY29udGFpbmVyICYmIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRvRG9tKGh0bWwpIHtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRMaWdodE5vZGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsaWdodE5vZGVzW3RoaXMuX3VpZF07XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZU5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2FjaGluZyBjYXVzZXMgZGlmZmVyZW50IGNsYXNzZXMgdG8gcHVsbCB0aGUgc2FtZSB0ZW1wbGF0ZSAtIHdhdD9cbiAgICAvL2lmKCF0aGlzLnRlbXBsYXRlTm9kZSkge1xuICAgIGlmICh0aGlzLnRlbXBsYXRlSWQpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRlbXBsYXRlSWQucmVwbGFjZSgnIycsICcnKSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRlbXBsYXRlU3RyaW5nKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gdG9Eb20oJzx0ZW1wbGF0ZT4nICsgdGhpcy50ZW1wbGF0ZVN0cmluZyArICc8L3RlbXBsYXRlPicpO1xuICAgIH1cbiAgICAvL31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZU5vZGU7XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZUNoYWluID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICB0ZW1wbGF0ZXMgPSBbXSxcbiAgICAgICAgdGVtcGxhdGUgPSB2b2lkIDA7XG5cbiAgICAvLyB3YWxrIHRoZSBwcm90b3R5cGUgY2hhaW47IEJhYmVsIGRvZXNuJ3QgYWxsb3cgdXNpbmdcbiAgICAvLyBgc3VwZXJgIHNpbmNlIHdlIGFyZSBvdXRzaWRlIG9mIHRoZSBDbGFzc1xuICAgIHdoaWxlIChjb250ZXh0KSB7XG4gICAgICAgIGNvbnRleHQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udGV4dCk7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2tpcCBwcm90b3R5cGVzIHdpdGhvdXQgYSB0ZW1wbGF0ZVxuICAgICAgICAvLyAoZWxzZSBpdCB3aWxsIHB1bGwgYW4gaW5oZXJpdGVkIHRlbXBsYXRlIGFuZCBjYXVzZSBkdXBsaWNhdGVzKVxuICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVTdHJpbmcnKSB8fCBjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZUlkJykpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gY29udGV4dC5nZXRUZW1wbGF0ZU5vZGUoKTtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5wdXNoKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGVzO1xufTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICd0ZW1wbGF0ZScsXG4gICAgb3JkZXI6IDIwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gcHJlQ29ubmVjdGVkKG5vZGUpIHtcbiAgICAgICAgaW5zZXJ0KG5vZGUpO1xuICAgIH1cbn0pO1xuXG59KSk7IiwicmVxdWlyZSgnY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsJyk7XG5jb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4uLy4uL2Rpc3QvaW5kZXgnKTtcblxuY29uc29sZS5sb2coJ0Jhc2VDb21wb25lbnQnLCBCYXNlQ29tcG9uZW50KTtcblxuY2xhc3MgVGVzdExpZmVjeWNsZSBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge3JldHVybiBbJ2ZvbycsICdiYXInXTsgfVxuXG5cdHNldCBmb28gKHZhbHVlKSB7XG5cdFx0dGhpcy5fX2ZvbyA9IHZhbHVlO1xuXHR9XG5cblx0Z2V0IGZvbyAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19mb287XG5cdH1cblxuXHRzZXQgYmFyICh2YWx1ZSkge1xuXHRcdHRoaXMuX19iYXIgPSB2YWx1ZTtcblx0fVxuXG5cdGdldCBiYXIgKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYmFyIHx8ICdOT1RTRVQnO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoLi4uYXJncykge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRjb25uZWN0ZWQgKCkge1xuXHRcdG9uLmZpcmUoZG9jdW1lbnQsICdjb25uZWN0ZWQtY2FsbGVkJywgdGhpcyk7XG5cdH1cblxuXHRkb21SZWFkeSAoKSB7XG5cdFx0b24uZmlyZShkb2N1bWVudCwgJ2RvbXJlYWR5LWNhbGxlZCcsIHRoaXMpO1xuXHR9XG5cblx0ZGlzY29ubmVjdGVkICgpIHtcblx0XHRvbi5maXJlKGRvY3VtZW50LCAnZGlzY29ubmVjdGVkLWNhbGxlZCcsIHRoaXMpO1xuXHR9XG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWxpZmVjeWNsZScsIFRlc3RMaWZlY3ljbGUpO1xuIiwiLy93aW5kb3dbJ25vLW5hdGl2ZS1zaGltJ10gPSB0cnVlO1xucmVxdWlyZSgnY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsJyk7XG53aW5kb3cub24gPSByZXF1aXJlKCdAY2x1YmFqYXgvb24nKTtcbndpbmRvdy5kb20gPSByZXF1aXJlKCdAY2x1YmFqYXgvZG9tJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IG9uID0gcmVxdWlyZSgnQGNsdWJhamF4L29uJyk7XG5cbmNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdGNvbnN0cnVjdG9yICgpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuX3VpZCA9IHVpZCh0aGlzLmxvY2FsTmFtZSk7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXSA9IHsgRE9NU1RBVEU6ICdjcmVhdGVkJyB9O1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdCA9IFtdO1xuXHRcdHBsdWdpbignaW5pdCcsIHRoaXMpO1xuXHR9XG5cblx0Y29ubmVjdGVkQ2FsbGJhY2sgKCkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPyAnZG9tcmVhZHknIDogJ2Nvbm5lY3RlZCc7XG5cdFx0cGx1Z2luKCdwcmVDb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRuZXh0VGljayhvbkNoZWNrRG9tUmVhZHkuYmluZCh0aGlzKSk7XG5cdFx0aWYgKHRoaXMuY29ubmVjdGVkKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZCgpO1xuXHRcdH1cblx0XHR0aGlzLmZpcmUoJ2Nvbm5lY3RlZCcpO1xuXHRcdHBsdWdpbigncG9zdENvbm5lY3RlZCcsIHRoaXMpO1xuXHR9XG5cblx0b25Db25uZWN0ZWQgKGNhbGxiYWNrKSB7XG5cdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnIHx8IHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLm9uY2UoJ2Nvbm5lY3RlZCcsICgpID0+IHtcblx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0b25Eb21SZWFkeSAoY2FsbGJhY2spIHtcblx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMub25jZSgnZG9tcmVhZHknLCAoKSA9PiB7XG5cdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHR9KTtcblx0fVxuXG5cdGRpc2Nvbm5lY3RlZENhbGxiYWNrICgpIHtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG5cdFx0cGx1Z2luKCdwcmVEaXNjb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRpZiAodGhpcy5kaXNjb25uZWN0ZWQpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkKCk7XG5cdFx0fVxuXHRcdHRoaXMuZmlyZSgnZGlzY29ubmVjdGVkJyk7XG5cblx0XHRsZXQgdGltZSwgZG9kID0gQmFzZUNvbXBvbmVudC5kZXN0cm95T25EaXNjb25uZWN0O1xuXHRcdGlmIChkb2QpIHtcblx0XHRcdHRpbWUgPSB0eXBlb2YgZG9kID09PSAnbnVtYmVyJyA/IGRvYyA6IDMwMDtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2Rpc2Nvbm5lY3RlZCcpIHtcblx0XHRcdFx0XHR0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGltZSk7XG5cdFx0fVxuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIChhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcblx0XHRwbHVnaW4oJ3ByZUF0dHJpYnV0ZUNoYW5nZWQnLCB0aGlzLCBhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdGlmICh0aGlzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcblx0XHRcdHRoaXMuYXR0cmlidXRlQ2hhbmdlZChhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdH1cblx0fVxuXG5cdGRlc3Ryb3kgKCkge1xuXHRcdHRoaXMuZmlyZSgnZGVzdHJveScpO1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcblx0XHRcdGhhbmRsZS5yZW1vdmUoKTtcblx0XHR9KTtcblx0XHRkZXN0cm95KHRoaXMpO1xuXHR9XG5cblx0ZmlyZSAoZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcykge1xuXHRcdHJldHVybiBvbi5maXJlKHRoaXMsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpO1xuXHR9XG5cblx0ZW1pdCAoZXZlbnROYW1lLCB2YWx1ZSkge1xuXHRcdHJldHVybiBvbi5lbWl0KHRoaXMsIGV2ZW50TmFtZSwgdmFsdWUpO1xuXHR9XG5cblx0b24gKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG5cdFx0XHR0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRcdG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG5cdFx0XHRcdG9uKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IpKTtcblx0fVxuXG5cdG9uY2UgKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG5cdFx0XHR0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRcdG9uLm9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcblx0XHRcdFx0b24ub25jZSh0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykpO1xuXHR9XG5cblx0YXR0ciAoa2V5LCB2YWx1ZSwgdG9nZ2xlKSB7XG5cdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdGNvbnN0IGFkZCA9IHRvZ2dsZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6ICEhdG9nZ2xlO1xuXHRcdGlmIChhZGQpIHtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuXHRcdH1cblx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHR9XG5cblx0cmVnaXN0ZXJIYW5kbGUgKGhhbmRsZSkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG5cdFx0cmV0dXJuIGhhbmRsZTtcblx0fVxuXG5cdGdldCBET01TVEFURSAoKSB7XG5cdFx0cmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG5cdH1cblxuXHRzdGF0aWMgc2V0IGRlc3Ryb3lPbkRpc2Nvbm5lY3QgKHZhbHVlKSB7XG5cdFx0cHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXSA9IHZhbHVlO1xuXHR9XG5cblx0c3RhdGljIGdldCBkZXN0cm95T25EaXNjb25uZWN0ICgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXTtcblx0fVxuXG5cdHN0YXRpYyBjbG9uZSAodGVtcGxhdGUpIHtcblx0XHRpZiAodGVtcGxhdGUuY29udGVudCAmJiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcblx0XHR9XG5cdFx0Y29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRjb25zdCBjbG9uZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG5cdFx0d2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmVOb2RlLmNoaWxkcmVuWzBdKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZyYWc7XG5cdH1cblxuXHRzdGF0aWMgYWRkUGx1Z2luIChwbHVnKSB7XG5cdFx0bGV0IGksIG9yZGVyID0gcGx1Zy5vcmRlciB8fCAxMDA7XG5cdFx0aWYgKCFwbHVnaW5zLmxlbmd0aCkge1xuXHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0aWYgKHBsdWdpbnNbMF0ub3JkZXIgPD0gb3JkZXIpIHtcblx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAocGx1Z2luc1swXS5vcmRlciA+IG9yZGVyKSB7XG5cdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXG5cdFx0XHRmb3IgKGkgPSAxOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAob3JkZXIgPT09IHBsdWdpbnNbaSAtIDFdLm9yZGVyIHx8IChvcmRlciA+IHBsdWdpbnNbaSAtIDFdLm9yZGVyICYmIG9yZGVyIDwgcGx1Z2luc1tpXS5vcmRlcikpIHtcblx0XHRcdFx0XHRwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIHdhcyBub3QgaW5zZXJ0ZWQuLi5cblx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHR9XG5cdH1cbn1cblxubGV0XG5cdHByaXZhdGVzID0ge30sXG5cdHBsdWdpbnMgPSBbXTtcblxuZnVuY3Rpb24gcGx1Z2luIChtZXRob2QsIG5vZGUsIGEsIGIsIGMpIHtcblx0cGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnKSB7XG5cdFx0aWYgKHBsdWdbbWV0aG9kXSkge1xuXHRcdFx0cGx1Z1ttZXRob2RdKG5vZGUsIGEsIGIsIGMpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hlY2tEb21SZWFkeSAoKSB7XG5cdGlmICh0aGlzLkRPTVNUQVRFICE9PSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRsZXRcblx0XHRjb3VudCA9IDAsXG5cdFx0Y2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuXHRcdG91ckRvbVJlYWR5ID0gb25Eb21SZWFkeS5iaW5kKHRoaXMpO1xuXG5cdGZ1bmN0aW9uIGFkZFJlYWR5ICgpIHtcblx0XHRjb3VudCsrO1xuXHRcdGlmIChjb3VudCA9PT0gY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRvdXJEb21SZWFkeSgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIElmIG5vIGNoaWxkcmVuLCB3ZSdyZSBnb29kIC0gbGVhZiBub2RlLiBDb21tZW5jZSB3aXRoIG9uRG9tUmVhZHlcblx0Ly9cblx0aWYgKCFjaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRvdXJEb21SZWFkeSgpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIGVsc2UsIHdhaXQgZm9yIGFsbCBjaGlsZHJlbiB0byBmaXJlIHRoZWlyIGByZWFkeWAgZXZlbnRzXG5cdFx0Ly9cblx0XHRjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0Ly8gY2hlY2sgaWYgY2hpbGQgaXMgYWxyZWFkeSByZWFkeVxuXHRcdFx0Ly8gYWxzbyBjaGVjayBmb3IgY29ubmVjdGVkIC0gdGhpcyBoYW5kbGVzIG1vdmluZyBhIG5vZGUgZnJvbSBhbm90aGVyIG5vZGVcblx0XHRcdC8vIE5PUEUsIHRoYXQgZmFpbGVkLiByZW1vdmVkIGZvciBub3cgY2hpbGQuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnXG5cdFx0XHRpZiAoY2hpbGQuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0YWRkUmVhZHkoKTtcblx0XHRcdH1cblx0XHRcdC8vIGlmIG5vdCwgd2FpdCBmb3IgZXZlbnRcblx0XHRcdGNoaWxkLm9uKCdkb21yZWFkeScsIGFkZFJlYWR5KTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBvbkRvbVJlYWR5ICgpIHtcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG5cdC8vIGRvbVJlYWR5IHNob3VsZCBvbmx5IGV2ZXIgZmlyZSBvbmNlXG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG5cdHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcblx0Ly8gY2FsbCB0aGlzLmRvbVJlYWR5IGZpcnN0LCBzbyB0aGF0IHRoZSBjb21wb25lbnRcblx0Ly8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcblx0Ly8gc3Vic2VxdWVudCBldmVudHNcblx0aWYgKHRoaXMuZG9tUmVhZHkpIHtcblx0XHR0aGlzLmRvbVJlYWR5KCk7XG5cdFx0dGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuXHR9XG5cblx0Ly8gYWxsb3cgY29tcG9uZW50IHRvIGZpcmUgdGhpcyBldmVudFxuXHQvLyBkb21SZWFkeSgpIHdpbGwgc3RpbGwgYmUgY2FsbGVkXG5cdGlmICghdGhpcy5maXJlT3duRG9tcmVhZHkpIHtcblx0XHR0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cdH1cblxuXHRwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzIChub2RlKSB7XG5cdC8vIGNvbGxlY3QgYW55IGNoaWxkcmVuIHRoYXQgYXJlIGN1c3RvbSBub2Rlc1xuXHQvLyB1c2VkIHRvIGNoZWNrIGlmIHRoZWlyIGRvbSBpcyByZWFkeSBiZWZvcmVcblx0Ly8gZGV0ZXJtaW5pbmcgaWYgdGhpcyBpcyByZWFkeVxuXHRsZXQgaSwgbm9kZXMgPSBbXTtcblx0Zm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobm9kZS5jaGlsZHJlbltpXS5ub2RlTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuXHRcdFx0bm9kZXMucHVzaChub2RlLmNoaWxkcmVuW2ldKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayAoY2IpIHtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbn1cblxuY29uc3QgdWlkcyA9IHt9O1xuZnVuY3Rpb24gdWlkICh0eXBlID0gJ3VpZCcpIHtcblx0aWYgKHVpZHNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdHVpZHNbdHlwZV0gPSAwO1xuXHR9XG5cdGNvbnN0IGlkID0gdHlwZSArICctJyArICh1aWRzW3R5cGVdICsgMSk7XG5cdHVpZHNbdHlwZV0rKztcblx0cmV0dXJuIGlkO1xufVxuXG5jb25zdCBkZXN0cm95ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmZ1bmN0aW9uIGRlc3Ryb3kgKG5vZGUpIHtcblx0aWYgKG5vZGUpIHtcblx0XHRkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0ZGVzdHJveWVyLmlubmVySFRNTCA9ICcnO1xuXHR9XG59XG5cblxud2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZU9yTm9kZXMsIGNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGhhbmRsZURvbVJlYWR5IChub2RlLCBjYikge1xuXHRcdGZ1bmN0aW9uIG9uUmVhZHkgKCkge1xuXHRcdFx0Y2Iobm9kZSk7XG5cdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG5cdFx0fVxuXG5cdFx0aWYgKG5vZGUuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdGNiKG5vZGUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIUFycmF5LmlzQXJyYXkobm9kZU9yTm9kZXMpKSB7XG5cdFx0aGFuZGxlRG9tUmVhZHkobm9kZU9yTm9kZXMsIGNhbGxiYWNrKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRsZXQgY291bnQgPSAwO1xuXG5cdGZ1bmN0aW9uIG9uQXJyYXlOb2RlUmVhZHkgKCkge1xuXHRcdGNvdW50Kys7XG5cdFx0aWYgKGNvdW50ID09PSBub2RlT3JOb2Rlcy5sZW5ndGgpIHtcblx0XHRcdGNhbGxiYWNrKG5vZGVPck5vZGVzKTtcblx0XHR9XG5cdH1cblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVPck5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aGFuZGxlRG9tUmVhZHkobm9kZU9yTm9kZXNbaV0sIG9uQXJyYXlOb2RlUmVhZHkpO1xuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbXBvbmVudDsiXX0=
