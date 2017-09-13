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

console.log('BaseComponent...');
(function (f) {
	if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.BaseComponent = f();
	}
})(function () {
	var define, module, exports;
	return function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a) {
						return a(o, !0);
					}
					if (i) {
						return i(o, !0);
					}
					var f = new Error("Cannot find module '" + o + "'");
					throw f.code = "MODULE_NOT_FOUND", f;
				}
				var l = n[o] = { exports: {} };
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}
			return n[o].exports;
		}

		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++) {
			s(r[o]);
		}
		return s;
	}({
		1: [function (require, module, exports) {
			"use strict";

			var _createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) {
							descriptor.writable = true;
						}
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) {
						defineProperties(Constructor.prototype, protoProps);
					}
					if (staticProps) {
						defineProperties(Constructor, staticProps);
					}
					return Constructor;
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
				}
				return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== "function" && superClass !== null) {
					throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: {
						value: subClass,
						enumerable: false,
						writable: true,
						configurable: true
					}
				});
				if (superClass) {
					Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
				}
			}

			var _on = require('@clubajax/on');

			console.log('BaseComponent!');
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
		}, { "@clubajax/on": "@clubajax/on" }],
		2: [function (require, module, exports) {
			'use strict';

			var on = require('@clubajax/on');
			var BaseComponent = require('./BaseComponent');
			require('./properties');
			require('./template');
			require('./refs');
			//const itemTemplate = require('./item-template');

			module.exports = BaseComponent;
		}, { "./BaseComponent": 1, "./properties": 3, "./refs": 4, "./template": 5, "@clubajax/on": "@clubajax/on" }],
		3: [function (require, module, exports) {
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
		}, { "./BaseComponent": 1 }],
		4: [function (require, module, exports) {
			'use strict';

			function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
						arr2[i] = arr[i];
					}
					return arr2;
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
		}, { "./BaseComponent": 1 }],
		5: [function (require, module, exports) {
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
		}, { "./BaseComponent": 1 }]
	}, {}, [2])(2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L0Jhc2VDb21wb25lbnQuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9wcm9wZXJ0aWVzLmpzIiwiZGlzdC9yZWZzLmpzIiwiZGlzdC90ZW1wbGF0ZS5qcyIsInRlc3RzL3NyYy9kaXN0LXRlc3QuanMiLCJ0ZXN0cy9zcmMvZ2xvYmFscy5qcyIsInNyYy9CYXNlQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FDLFdBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QjtBQUN0QixLQUFJLE9BQU8sTUFBUCxLQUFrQixVQUFsQixJQUFnQyxPQUFPLEdBQTNDLEVBQWdEO0FBQzVDO0FBQ0EsU0FBTyxDQUFDLGNBQUQsQ0FBUCxFQUF5QixPQUF6QjtBQUNILEVBSEQsTUFHTyxJQUFJLFFBQU8sTUFBUCx5Q0FBTyxNQUFQLE9BQWtCLFFBQWxCLElBQThCLE9BQU8sT0FBekMsRUFBa0Q7QUFDckQ7QUFDQSxTQUFPLE9BQVAsR0FBaUIsUUFBUSxRQUFRLGNBQVIsQ0FBUixDQUFqQjtBQUNILEVBSE0sTUFHQTtBQUNIO0FBQ0EsT0FBSyxlQUFMLElBQXdCLFFBQVEsS0FBSyxFQUFiLENBQXhCO0FBQ0g7QUFDSCxDQVhELGFBV1EsVUFBVSxFQUFWLEVBQWM7QUFDdkI7O0FBRUEsS0FBSSxlQUFlLFlBQVk7QUFBRSxXQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQUUsUUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFBRSxRQUFJLGFBQWEsTUFBTSxDQUFOLENBQWpCLENBQTJCLFdBQVcsVUFBWCxHQUF3QixXQUFXLFVBQVgsSUFBeUIsS0FBakQsQ0FBd0QsV0FBVyxZQUFYLEdBQTBCLElBQTFCLENBQWdDLElBQUksV0FBVyxVQUFmLEVBQTJCLFdBQVcsUUFBWCxH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LENBQUMsTUFBTSxPQUFOLENBQWMsV0FBZCxDQUFMLEVBQWlDO0FBQ2hDLGlCQUFlLFdBQWYsRUFBNEIsUUFBNUI7QUFDQTtBQUNBOztBQUVELEtBQUksUUFBUSxDQUFaOztBQUVBLFVBQVMsZ0JBQVQsR0FBNkI7QUFDNUI7QUFDQSxNQUFJLFVBQVUsWUFBWSxNQUExQixFQUFrQztBQUNqQyxZQUFTLFdBQVQ7QUFDQTtBQUNEOztBQUVELE1BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxZQUFZLE1BQWhDLEVBQXdDLEdBQXhDLEVBQTZDO0FBQzVDLGlCQUFlLFlBQVksQ0FBWixDQUFmLEVBQStCLGdCQUEvQjtBQUNBO0FBRUQsQ0FqQ0Q7O0FBbUNBLE9BQU8sT0FBUCxHQUFpQixhQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRFxuICAgICAgICBkZWZpbmUoW1wiQGNsdWJhamF4L29uXCJdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIC8vIE5vZGUgLyBDb21tb25KU1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnQGNsdWJhamF4L29uJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgICAgIHJvb3RbJ0Jhc2VDb21wb25lbnQnXSA9IGZhY3Rvcnkocm9vdC5vbik7XG4gICAgfVxuXHR9KHRoaXMsIGZ1bmN0aW9uIChvbikge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIEJhc2VDb21wb25lbnQgPSBmdW5jdGlvbiAoX0hUTUxFbGVtZW50KSB7XG5cdF9pbmhlcml0cyhCYXNlQ29tcG9uZW50LCBfSFRNTEVsZW1lbnQpO1xuXG5cdGZ1bmN0aW9uIEJhc2VDb21wb25lbnQoKSB7XG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJhc2VDb21wb25lbnQpO1xuXG5cdFx0dmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKEJhc2VDb21wb25lbnQuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihCYXNlQ29tcG9uZW50KSkuY2FsbCh0aGlzKSk7XG5cblx0XHRfdGhpcy5fdWlkID0gdWlkKF90aGlzLmxvY2FsTmFtZSk7XG5cdFx0cHJpdmF0ZXNbX3RoaXMuX3VpZF0gPSB7IERPTVNUQVRFOiAnY3JlYXRlZCcgfTtcblx0XHRwcml2YXRlc1tfdGhpcy5fdWlkXS5oYW5kbGVMaXN0ID0gW107XG5cdFx0cGx1Z2luKCdpbml0JywgX3RoaXMpO1xuXHRcdHJldHVybiBfdGhpcztcblx0fVxuXG5cdF9jcmVhdGVDbGFzcyhCYXNlQ29tcG9uZW50LCBbe1xuXHRcdGtleTogJ2Nvbm5lY3RlZENhbGxiYWNrJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkID8gJ2RvbXJlYWR5JyA6ICdjb25uZWN0ZWQnO1xuXHRcdFx0cGx1Z2luKCdwcmVDb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRcdG5leHRUaWNrKG9uQ2hlY2tEb21SZWFkeS5iaW5kKHRoaXMpKTtcblx0XHRcdGlmICh0aGlzLmNvbm5lY3RlZCkge1xuXHRcdFx0XHR0aGlzLmNvbm5lY3RlZCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5maXJlKCdjb25uZWN0ZWQnKTtcblx0XHRcdHBsdWdpbigncG9zdENvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ29uQ29ubmVjdGVkJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gb25Db25uZWN0ZWQoY2FsbGJhY2spIHtcblx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2Nvbm5lY3RlZCcgfHwgdGhpcy5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5vbmNlKCdjb25uZWN0ZWQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrKF90aGlzMik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbkRvbVJlYWR5Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gb25Eb21SZWFkeShjYWxsYmFjaykge1xuXHRcdFx0dmFyIF90aGlzMyA9IHRoaXM7XG5cblx0XHRcdGlmICh0aGlzLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLm9uY2UoJ2RvbXJlYWR5JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYWxsYmFjayhfdGhpczMpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZGlzY29ubmVjdGVkQ2FsbGJhY2snLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdHZhciBfdGhpczQgPSB0aGlzO1xuXG5cdFx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG5cdFx0XHRwbHVnaW4oJ3ByZURpc2Nvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdFx0aWYgKHRoaXMuZGlzY29ubmVjdGVkKSB7XG5cdFx0XHRcdHRoaXMuZGlzY29ubmVjdGVkKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmZpcmUoJ2Rpc2Nvbm5lY3RlZCcpO1xuXG5cdFx0XHR2YXIgdGltZSA9IHZvaWQgMCxcblx0XHRcdCAgICBkb2QgPSBCYXNlQ29tcG9uZW50LmRlc3Ryb3lPbkRpc2Nvbm5lY3Q7XG5cdFx0XHRpZiAoZG9kKSB7XG5cdFx0XHRcdHRpbWUgPSB0eXBlb2YgZG9kID09PSAnbnVtYmVyJyA/IGRvYyA6IDMwMDtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKF90aGlzNC5ET01TVEFURSA9PT0gJ2Rpc2Nvbm5lY3RlZCcpIHtcblx0XHRcdFx0XHRcdF90aGlzNC5kZXN0cm95KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB0aW1lKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ck5hbWUsIG9sZFZhbCwgbmV3VmFsKSB7XG5cdFx0XHRwbHVnaW4oJ3ByZUF0dHJpYnV0ZUNoYW5nZWQnLCB0aGlzLCBhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdFx0aWYgKHRoaXMuYXR0cmlidXRlQ2hhbmdlZCkge1xuXHRcdFx0XHR0aGlzLmF0dHJpYnV0ZUNoYW5nZWQoYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdkZXN0cm95Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRcdHRoaXMuZmlyZSgnZGVzdHJveScpO1xuXHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xuXHRcdFx0XHRoYW5kbGUucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdF9kZXN0cm95KHRoaXMpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2ZpcmUnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBmaXJlKGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcblx0XHRcdHJldHVybiBvbi5maXJlKHRoaXMsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2VtaXQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBlbWl0KGV2ZW50TmFtZSwgdmFsdWUpIHtcblx0XHRcdHJldHVybiBvbi5lbWl0KHRoaXMsIGV2ZW50TmFtZSwgdmFsdWUpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ29uJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gKF9vbikge1xuXHRcdFx0ZnVuY3Rpb24gb24oX3gsIF94MiwgX3gzLCBfeDQpIHtcblx0XHRcdFx0cmV0dXJuIF9vbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0fVxuXG5cdFx0XHRvbi50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIF9vbi50b1N0cmluZygpO1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIG9uO1xuXHRcdH0oZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZSh0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRvbihub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykgOiBvbih0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yKSk7XG5cdFx0fSlcblx0fSwge1xuXHRcdGtleTogJ29uY2UnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvbmNlKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZSh0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRvbi5vbmNlKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6IG9uLm9uY2UodGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdhdHRyJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0cihrZXksIHZhbHVlLCB0b2dnbGUpIHtcblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdHZhciBhZGQgPSB0b2dnbGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIXRvZ2dsZTtcblx0XHRcdGlmIChhZGQpIHtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdyZWdpc3RlckhhbmRsZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHJlZ2lzdGVySGFuZGxlKGhhbmRsZSkge1xuXHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LnB1c2goaGFuZGxlKTtcblx0XHRcdHJldHVybiBoYW5kbGU7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnRE9NU1RBVEUnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG5cdFx0fVxuXHR9XSwgW3tcblx0XHRrZXk6ICdjbG9uZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGNsb25lKHRlbXBsYXRlKSB7XG5cdFx0XHRpZiAodGVtcGxhdGUuY29udGVudCAmJiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKSB7XG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0XHR2YXIgY2xvbmVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG5cdFx0XHR3aGlsZSAoY2xvbmVOb2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHRmcmFnLmFwcGVuZENoaWxkKGNsb25lTm9kZS5jaGlsZHJlblswXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZnJhZztcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdhZGRQbHVnaW4nLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBhZGRQbHVnaW4ocGx1Zykge1xuXHRcdFx0dmFyIGkgPSB2b2lkIDAsXG5cdFx0XHQgICAgb3JkZXIgPSBwbHVnLm9yZGVyIHx8IDEwMDtcblx0XHRcdGlmICghcGx1Z2lucy5sZW5ndGgpIHtcblx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0fSBlbHNlIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRpZiAocGx1Z2luc1swXS5vcmRlciA8PSBvcmRlcikge1xuXHRcdFx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAocGx1Z2luc1swXS5vcmRlciA+IG9yZGVyKSB7XG5cdFx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Zm9yIChpID0gMTsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAob3JkZXIgPT09IHBsdWdpbnNbaSAtIDFdLm9yZGVyIHx8IG9yZGVyID4gcGx1Z2luc1tpIC0gMV0ub3JkZXIgJiYgb3JkZXIgPCBwbHVnaW5zW2ldLm9yZGVyKSB7XG5cdFx0XHRcdFx0XHRwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gd2FzIG5vdCBpbnNlcnRlZC4uLlxuXHRcdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZGVzdHJveU9uRGlzY29ubmVjdCcsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdHByaXZhdGVzWydkZXN0cm95T25EaXNjb25uZWN0J10gPSB2YWx1ZTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHByaXZhdGVzWydkZXN0cm95T25EaXNjb25uZWN0J107XG5cdFx0fVxuXHR9XSk7XG5cblx0cmV0dXJuIEJhc2VDb21wb25lbnQ7XG59KEhUTUxFbGVtZW50KTtcblxudmFyIHByaXZhdGVzID0ge30sXG4gICAgcGx1Z2lucyA9IFtdO1xuXG5mdW5jdGlvbiBwbHVnaW4obWV0aG9kLCBub2RlLCBhLCBiLCBjKSB7XG5cdHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Zykge1xuXHRcdGlmIChwbHVnW21ldGhvZF0pIHtcblx0XHRcdHBsdWdbbWV0aG9kXShub2RlLCBhLCBiLCBjKTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBvbkNoZWNrRG9tUmVhZHkoKSB7XG5cdGlmICh0aGlzLkRPTVNUQVRFICE9PSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgY291bnQgPSAwLFxuXHQgICAgY2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuXHQgICAgb3VyRG9tUmVhZHkgPSBvbkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cblx0ZnVuY3Rpb24gYWRkUmVhZHkoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IGNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0b3VyRG9tUmVhZHkoKTtcblx0XHR9XG5cdH1cblxuXHQvLyBJZiBubyBjaGlsZHJlbiwgd2UncmUgZ29vZCAtIGxlYWYgbm9kZS4gQ29tbWVuY2Ugd2l0aCBvbkRvbVJlYWR5XG5cdC8vXG5cdGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0b3VyRG9tUmVhZHkoKTtcblx0fSBlbHNlIHtcblx0XHQvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuXHRcdC8vXG5cdFx0Y2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdC8vIGNoZWNrIGlmIGNoaWxkIGlzIGFscmVhZHkgcmVhZHlcblx0XHRcdC8vIGFsc28gY2hlY2sgZm9yIGNvbm5lY3RlZCAtIHRoaXMgaGFuZGxlcyBtb3ZpbmcgYSBub2RlIGZyb20gYW5vdGhlciBub2RlXG5cdFx0XHQvLyBOT1BFLCB0aGF0IGZhaWxlZC4gcmVtb3ZlZCBmb3Igbm93IGNoaWxkLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJ1xuXHRcdFx0aWYgKGNoaWxkLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGFkZFJlYWR5KCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiBub3QsIHdhaXQgZm9yIGV2ZW50XG5cdFx0XHRjaGlsZC5vbignZG9tcmVhZHknLCBhZGRSZWFkeSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gb25Eb21SZWFkeSgpIHtcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG5cdC8vIGRvbVJlYWR5IHNob3VsZCBvbmx5IGV2ZXIgZmlyZSBvbmNlXG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG5cdHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcblx0Ly8gY2FsbCB0aGlzLmRvbVJlYWR5IGZpcnN0LCBzbyB0aGF0IHRoZSBjb21wb25lbnRcblx0Ly8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcblx0Ly8gc3Vic2VxdWVudCBldmVudHNcblx0aWYgKHRoaXMuZG9tUmVhZHkpIHtcblx0XHR0aGlzLmRvbVJlYWR5KCk7XG5cdFx0dGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuXHR9XG5cblx0Ly8gYWxsb3cgY29tcG9uZW50IHRvIGZpcmUgdGhpcyBldmVudFxuXHQvLyBkb21SZWFkeSgpIHdpbGwgc3RpbGwgYmUgY2FsbGVkXG5cdGlmICghdGhpcy5maXJlT3duRG9tcmVhZHkpIHtcblx0XHR0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cdH1cblxuXHRwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzKG5vZGUpIHtcblx0Ly8gY29sbGVjdCBhbnkgY2hpbGRyZW4gdGhhdCBhcmUgY3VzdG9tIG5vZGVzXG5cdC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuXHQvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG5cdHZhciBpID0gdm9pZCAwLFxuXHQgICAgbm9kZXMgPSBbXTtcblx0Zm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobm9kZS5jaGlsZHJlbltpXS5ub2RlTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuXHRcdFx0bm9kZXMucHVzaChub2RlLmNoaWxkcmVuW2ldKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayhjYikge1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xufVxuXG52YXIgdWlkcyA9IHt9O1xuZnVuY3Rpb24gdWlkKCkge1xuXHR2YXIgdHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ3VpZCc7XG5cblx0aWYgKHVpZHNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdHVpZHNbdHlwZV0gPSAwO1xuXHR9XG5cdHZhciBpZCA9IHR5cGUgKyAnLScgKyAodWlkc1t0eXBlXSArIDEpO1xuXHR1aWRzW3R5cGVdKys7XG5cdHJldHVybiBpZDtcbn1cblxudmFyIGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZnVuY3Rpb24gX2Rlc3Ryb3kobm9kZSkge1xuXHRpZiAobm9kZSkge1xuXHRcdGRlc3Ryb3llci5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG5cdH1cbn1cblxud2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZU9yTm9kZXMsIGNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGhhbmRsZURvbVJlYWR5KG5vZGUsIGNiKSB7XG5cdFx0ZnVuY3Rpb24gb25SZWFkeSgpIHtcblx0XHRcdGNiKG5vZGUpO1xuXHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuXHRcdH1cblxuXHRcdGlmIChub2RlLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRjYihub2RlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuXHRcdH1cblx0fVxuXG5cdGlmICghQXJyYXkuaXNBcnJheShub2RlT3JOb2RlcykpIHtcblx0XHRoYW5kbGVEb21SZWFkeShub2RlT3JOb2RlcywgY2FsbGJhY2spO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjb3VudCA9IDA7XG5cblx0ZnVuY3Rpb24gb25BcnJheU5vZGVSZWFkeSgpIHtcblx0XHRjb3VudCsrO1xuXHRcdGlmIChjb3VudCA9PT0gbm9kZU9yTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRjYWxsYmFjayhub2RlT3JOb2Rlcyk7XG5cdFx0fVxuXHR9XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBub2RlT3JOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdGhhbmRsZURvbVJlYWR5KG5vZGVPck5vZGVzW2ldLCBvbkFycmF5Tm9kZVJlYWR5KTtcblx0fVxufTtcblxuXHRyZXR1cm4gQmFzZUNvbXBvbmVudDtcblxufSkpOyIsImNvbnNvbGUubG9nKCdCYXNlQ29tcG9uZW50Li4uJyk7XG4oZnVuY3Rpb24gKGYpIHtcblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGYoKVxuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKFtdLCBmKVxuXHR9IGVsc2Uge1xuXHRcdHZhciBnO1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRnID0gd2luZG93XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRnID0gZ2xvYmFsXG5cdFx0fSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0ZyA9IHNlbGZcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZyA9IHRoaXNcblx0XHR9XG5cdFx0Zy5CYXNlQ29tcG9uZW50ID0gZigpXG5cdH1cbn0pKGZ1bmN0aW9uICgpIHtcblx0dmFyIGRlZmluZSwgbW9kdWxlLCBleHBvcnRzO1xuXHRyZXR1cm4gKGZ1bmN0aW9uIGUgKHQsIG4sIHIpIHtcblx0XHRmdW5jdGlvbiBzIChvLCB1KSB7XG5cdFx0XHRpZiAoIW5bb10pIHtcblx0XHRcdFx0aWYgKCF0W29dKSB7XG5cdFx0XHRcdFx0dmFyIGEgPSB0eXBlb2YgcmVxdWlyZSA9PSBcImZ1bmN0aW9uXCIgJiYgcmVxdWlyZTtcblx0XHRcdFx0XHRpZiAoIXUgJiYgYSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGEobywgITApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoaSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGkobywgITApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgZiA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBvICsgXCInXCIpO1xuXHRcdFx0XHRcdHRocm93IGYuY29kZSA9IFwiTU9EVUxFX05PVF9GT1VORFwiLCBmXG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGwgPSBuW29dID0geyBleHBvcnRzOiB7fSB9O1xuXHRcdFx0XHR0W29dWzBdLmNhbGwobC5leHBvcnRzLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdHZhciBuID0gdFtvXVsxXVtlXTtcblx0XHRcdFx0XHRyZXR1cm4gcyhuID8gbiA6IGUpXG5cdFx0XHRcdH0sIGwsIGwuZXhwb3J0cywgZSwgdCwgbiwgcilcblx0XHRcdH1cblx0XHRcdHJldHVybiBuW29dLmV4cG9ydHNcblx0XHR9XG5cblx0XHR2YXIgaSA9IHR5cGVvZiByZXF1aXJlID09IFwiZnVuY3Rpb25cIiAmJiByZXF1aXJlO1xuXHRcdGZvciAodmFyIG8gPSAwOyBvIDwgci5sZW5ndGg7IG8rKykge1xuXHRcdFx0cyhyW29dKTtcblx0XHR9XG5cdFx0cmV0dXJuIHNcblx0fSkoe1xuXHRcdDE6IFtmdW5jdGlvbiAocmVxdWlyZSwgbW9kdWxlLCBleHBvcnRzKSB7XG5cdFx0XHRcInVzZSBzdHJpY3RcIjtcblxuXHRcdFx0dmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyAodGFyZ2V0LCBwcm9wcykge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG5cdFx0XHRcdFx0XHRkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG5cdFx0XHRcdFx0XHRkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIHtcblx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcblx0XHRcdFx0XHRpZiAocHJvdG9Qcm9wcykge1xuXHRcdFx0XHRcdFx0ZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoc3RhdGljUHJvcHMpIHtcblx0XHRcdFx0XHRcdGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIENvbnN0cnVjdG9yO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSgpO1xuXG5cdFx0XHRmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2sgKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuXHRcdFx0XHRpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4gKHNlbGYsIGNhbGwpIHtcblx0XHRcdFx0aWYgKCFzZWxmKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBfaW5oZXJpdHMgKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG5cdFx0XHRcdGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcblx0XHRcdFx0XHRjb25zdHJ1Y3Rvcjoge1xuXHRcdFx0XHRcdFx0dmFsdWU6IHN1YkNsYXNzLFxuXHRcdFx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdFx0XHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmIChzdXBlckNsYXNzKSB7XG5cdFx0XHRcdFx0T2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIF9vbiA9IHJlcXVpcmUoJ0BjbHViYWpheC9vbicpO1xuXG5cdFx0XHRjb25zb2xlLmxvZygnQmFzZUNvbXBvbmVudCEnKTtcblx0XHRcdHZhciBCYXNlQ29tcG9uZW50ID0gZnVuY3Rpb24gKF9IVE1MRWxlbWVudCkge1xuXHRcdFx0XHRfaW5oZXJpdHMoQmFzZUNvbXBvbmVudCwgX0hUTUxFbGVtZW50KTtcblxuXHRcdFx0XHRmdW5jdGlvbiBCYXNlQ29tcG9uZW50ICgpIHtcblx0XHRcdFx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFzZUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHR2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQmFzZUNvbXBvbmVudC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEJhc2VDb21wb25lbnQpKS5jYWxsKHRoaXMpKTtcblxuXHRcdFx0XHRcdF90aGlzLl91aWQgPSB1aWQoX3RoaXMubG9jYWxOYW1lKTtcblx0XHRcdFx0XHRwcml2YXRlc1tfdGhpcy5fdWlkXSA9IHsgRE9NU1RBVEU6ICdjcmVhdGVkJyB9O1xuXHRcdFx0XHRcdHByaXZhdGVzW190aGlzLl91aWRdLmhhbmRsZUxpc3QgPSBbXTtcblx0XHRcdFx0XHRwbHVnaW4oJ2luaXQnLCBfdGhpcyk7XG5cdFx0XHRcdFx0cmV0dXJuIF90aGlzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X2NyZWF0ZUNsYXNzKEJhc2VDb21wb25lbnQsIFt7XG5cdFx0XHRcdFx0a2V5OiAnY29ubmVjdGVkQ2FsbGJhY2snLFxuXHRcdFx0XHRcdHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0ZWRDYWxsYmFjayAoKSB7XG5cdFx0XHRcdFx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkID8gJ2RvbXJlYWR5JyA6ICdjb25uZWN0ZWQnO1xuXHRcdFx0XHRcdFx0cGx1Z2luKCdwcmVDb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRcdFx0XHRcdG5leHRUaWNrKG9uQ2hlY2tEb21SZWFkeS5iaW5kKHRoaXMpKTtcblx0XHRcdFx0XHRcdGlmICh0aGlzLmNvbm5lY3RlZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmNvbm5lY3RlZCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5maXJlKCdjb25uZWN0ZWQnKTtcblx0XHRcdFx0XHRcdHBsdWdpbigncG9zdENvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdGtleTogJ29uQ29ubmVjdGVkJyxcblx0XHRcdFx0XHR2YWx1ZTogZnVuY3Rpb24gb25Db25uZWN0ZWQgKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnIHx8IHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMub25jZSgnY29ubmVjdGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayhfdGhpczIpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiAnb25Eb21SZWFkeScsXG5cdFx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uIG9uRG9tUmVhZHkgKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHR2YXIgX3RoaXMzID0gdGhpcztcblxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMub25jZSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKF90aGlzMyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRrZXk6ICdkaXNjb25uZWN0ZWRDYWxsYmFjaycsXG5cdFx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGRpc2Nvbm5lY3RlZENhbGxiYWNrICgpIHtcblx0XHRcdFx0XHRcdHZhciBfdGhpczQgPSB0aGlzO1xuXG5cdFx0XHRcdFx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG5cdFx0XHRcdFx0XHRwbHVnaW4oJ3ByZURpc2Nvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuZGlzY29ubmVjdGVkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuZGlzY29ubmVjdGVkKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLmZpcmUoJ2Rpc2Nvbm5lY3RlZCcpO1xuXG5cdFx0XHRcdFx0XHR2YXIgdGltZSA9IHZvaWQgMCxcblx0XHRcdFx0XHRcdFx0ZG9kID0gQmFzZUNvbXBvbmVudC5kZXN0cm95T25EaXNjb25uZWN0O1xuXHRcdFx0XHRcdFx0aWYgKGRvZCkge1xuXHRcdFx0XHRcdFx0XHR0aW1lID0gdHlwZW9mIGRvZCA9PT0gJ251bWJlcicgPyBkb2MgOiAzMDA7XG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChfdGhpczQuRE9NU1RBVEUgPT09ICdkaXNjb25uZWN0ZWQnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfdGhpczQuZGVzdHJveSgpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSwgdGltZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyxcblx0XHRcdFx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIChhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcblx0XHRcdFx0XHRcdHBsdWdpbigncHJlQXR0cmlidXRlQ2hhbmdlZCcsIHRoaXMsIGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuYXR0cmlidXRlQ2hhbmdlZChhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdGtleTogJ2Rlc3Ryb3knLFxuXHRcdFx0XHRcdHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95ICgpIHtcblx0XHRcdFx0XHRcdHRoaXMuZmlyZSgnZGVzdHJveScpO1xuXHRcdFx0XHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGUucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdF9kZXN0cm95KHRoaXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdGtleTogJ2ZpcmUnLFxuXHRcdFx0XHRcdHZhbHVlOiBmdW5jdGlvbiBmaXJlIChldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gX29uLmZpcmUodGhpcywgZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiAnZW1pdCcsXG5cdFx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGVtaXQgKGV2ZW50TmFtZSwgdmFsdWUpIHtcblx0XHRcdFx0XHRcdHJldHVybiBfb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRrZXk6ICdvbicsXG5cdFx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uIG9uIChub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUodHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0XHRcdFx0XHRfb24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDogX29uKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRrZXk6ICdvbmNlJyxcblx0XHRcdFx0XHR2YWx1ZTogZnVuY3Rpb24gb25jZSAobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKHR5cGVvZiBub2RlICE9PSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcblx0XHRcdFx0XHRcdFx0X29uLm9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDogX29uLm9uY2UodGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRrZXk6ICdhdHRyJyxcblx0XHRcdFx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0ciAoa2V5LCB2YWx1ZSwgdG9nZ2xlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR2YXIgYWRkID0gdG9nZ2xlID09PSB1bmRlZmluZWQgPyB0cnVlIDogISF0b2dnbGU7XG5cdFx0XHRcdFx0XHRpZiAoYWRkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiAncmVnaXN0ZXJIYW5kbGUnLFxuXHRcdFx0XHRcdHZhbHVlOiBmdW5jdGlvbiByZWdpc3RlckhhbmRsZSAoaGFuZGxlKSB7XG5cdFx0XHRcdFx0XHRwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QucHVzaChoYW5kbGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGhhbmRsZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRrZXk6ICdET01TVEFURScsXG5cdFx0XHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XSwgW3tcblx0XHRcdFx0XHRrZXk6ICdjbG9uZScsXG5cdFx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGNsb25lICh0ZW1wbGF0ZSkge1xuXHRcdFx0XHRcdFx0aWYgKHRlbXBsYXRlLmNvbnRlbnQgJiYgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdFx0XHRcdFx0dmFyIGNsb25lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRcdFx0Y2xvbmVOb2RlLmlubmVySFRNTCA9IHRlbXBsYXRlLmlubmVySFRNTDtcblxuXHRcdFx0XHRcdFx0d2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0ZnJhZy5hcHBlbmRDaGlsZChjbG9uZU5vZGUuY2hpbGRyZW5bMF0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZyYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiAnYWRkUGx1Z2luJyxcblx0XHRcdFx0XHR2YWx1ZTogZnVuY3Rpb24gYWRkUGx1Z2luIChwbHVnKSB7XG5cdFx0XHRcdFx0XHR2YXIgaSA9IHZvaWQgMCxcblx0XHRcdFx0XHRcdFx0b3JkZXIgPSBwbHVnLm9yZGVyIHx8IDEwMDtcblx0XHRcdFx0XHRcdGlmICghcGx1Z2lucy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRpZiAocGx1Z2luc1swXS5vcmRlciA8PSBvcmRlcikge1xuXHRcdFx0XHRcdFx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocGx1Z2luc1swXS5vcmRlciA+IG9yZGVyKSB7XG5cdFx0XHRcdFx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMTsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAob3JkZXIgPT09IHBsdWdpbnNbaSAtIDFdLm9yZGVyIHx8IG9yZGVyID4gcGx1Z2luc1tpIC0gMV0ub3JkZXIgJiYgb3JkZXIgPCBwbHVnaW5zW2ldLm9yZGVyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Ly8gd2FzIG5vdCBpbnNlcnRlZC4uLlxuXHRcdFx0XHRcdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiAnZGVzdHJveU9uRGlzY29ubmVjdCcsXG5cdFx0XHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQgKHZhbHVlKSB7XG5cdFx0XHRcdFx0XHRwcml2YXRlc1snZGVzdHJveU9uRGlzY29ubmVjdCddID0gdmFsdWU7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1dKTtcblxuXHRcdFx0XHRyZXR1cm4gQmFzZUNvbXBvbmVudDtcblx0XHRcdH0oSFRNTEVsZW1lbnQpO1xuXG5cdFx0XHR2YXIgcHJpdmF0ZXMgPSB7fSxcblx0XHRcdFx0cGx1Z2lucyA9IFtdO1xuXG5cdFx0XHRmdW5jdGlvbiBwbHVnaW4gKG1ldGhvZCwgbm9kZSwgYSwgYiwgYykge1xuXHRcdFx0XHRwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWcpIHtcblx0XHRcdFx0XHRpZiAocGx1Z1ttZXRob2RdKSB7XG5cdFx0XHRcdFx0XHRwbHVnW21ldGhvZF0obm9kZSwgYSwgYiwgYyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gb25DaGVja0RvbVJlYWR5ICgpIHtcblx0XHRcdFx0aWYgKHRoaXMuRE9NU1RBVEUgIT09ICdjb25uZWN0ZWQnIHx8IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBjb3VudCA9IDAsXG5cdFx0XHRcdFx0Y2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuXHRcdFx0XHRcdG91ckRvbVJlYWR5ID0gb25Eb21SZWFkeS5iaW5kKHRoaXMpO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGFkZFJlYWR5ICgpIHtcblx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRcdGlmIChjb3VudCA9PT0gY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRvdXJEb21SZWFkeSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIG5vIGNoaWxkcmVuLCB3ZSdyZSBnb29kIC0gbGVhZiBub2RlLiBDb21tZW5jZSB3aXRoIG9uRG9tUmVhZHlcblx0XHRcdFx0Ly9cblx0XHRcdFx0aWYgKCFjaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRvdXJEb21SZWFkeSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGVsc2UsIHdhaXQgZm9yIGFsbCBjaGlsZHJlbiB0byBmaXJlIHRoZWlyIGByZWFkeWAgZXZlbnRzXG5cdFx0XHRcdFx0Ly9cblx0XHRcdFx0XHRjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0XHRcdFx0Ly8gY2hlY2sgaWYgY2hpbGQgaXMgYWxyZWFkeSByZWFkeVxuXHRcdFx0XHRcdFx0Ly8gYWxzbyBjaGVjayBmb3IgY29ubmVjdGVkIC0gdGhpcyBoYW5kbGVzIG1vdmluZyBhIG5vZGUgZnJvbSBhbm90aGVyIG5vZGVcblx0XHRcdFx0XHRcdC8vIE5PUEUsIHRoYXQgZmFpbGVkLiByZW1vdmVkIGZvciBub3cgY2hpbGQuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnXG5cdFx0XHRcdFx0XHRpZiAoY2hpbGQuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0XHRcdFx0YWRkUmVhZHkoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIGlmIG5vdCwgd2FpdCBmb3IgZXZlbnRcblx0XHRcdFx0XHRcdGNoaWxkLm9uKCdkb21yZWFkeScsIGFkZFJlYWR5KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBvbkRvbVJlYWR5ICgpIHtcblx0XHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG5cdFx0XHRcdC8vIGRvbVJlYWR5IHNob3VsZCBvbmx5IGV2ZXIgZmlyZSBvbmNlXG5cdFx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG5cdFx0XHRcdHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcblx0XHRcdFx0Ly8gY2FsbCB0aGlzLmRvbVJlYWR5IGZpcnN0LCBzbyB0aGF0IHRoZSBjb21wb25lbnRcblx0XHRcdFx0Ly8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcblx0XHRcdFx0Ly8gc3Vic2VxdWVudCBldmVudHNcblx0XHRcdFx0aWYgKHRoaXMuZG9tUmVhZHkpIHtcblx0XHRcdFx0XHR0aGlzLmRvbVJlYWR5KCk7XG5cdFx0XHRcdFx0dGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gYWxsb3cgY29tcG9uZW50IHRvIGZpcmUgdGhpcyBldmVudFxuXHRcdFx0XHQvLyBkb21SZWFkeSgpIHdpbGwgc3RpbGwgYmUgY2FsbGVkXG5cdFx0XHRcdGlmICghdGhpcy5maXJlT3duRG9tcmVhZHkpIHtcblx0XHRcdFx0XHR0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzIChub2RlKSB7XG5cdFx0XHRcdC8vIGNvbGxlY3QgYW55IGNoaWxkcmVuIHRoYXQgYXJlIGN1c3RvbSBub2Rlc1xuXHRcdFx0XHQvLyB1c2VkIHRvIGNoZWNrIGlmIHRoZWlyIGRvbSBpcyByZWFkeSBiZWZvcmVcblx0XHRcdFx0Ly8gZGV0ZXJtaW5pbmcgaWYgdGhpcyBpcyByZWFkeVxuXHRcdFx0XHR2YXIgaSA9IHZvaWQgMCxcblx0XHRcdFx0XHRub2RlcyA9IFtdO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmIChub2RlLmNoaWxkcmVuW2ldLm5vZGVOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRub2Rlcy5wdXNoKG5vZGUuY2hpbGRyZW5baV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbm9kZXM7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIG5leHRUaWNrIChjYikge1xuXHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgdWlkcyA9IHt9O1xuXG5cdFx0XHRmdW5jdGlvbiB1aWQgKCkge1xuXHRcdFx0XHR2YXIgdHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ3VpZCc7XG5cblx0XHRcdFx0aWYgKHVpZHNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHVpZHNbdHlwZV0gPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBpZCA9IHR5cGUgKyAnLScgKyAodWlkc1t0eXBlXSArIDEpO1xuXHRcdFx0XHR1aWRzW3R5cGVdKys7XG5cdFx0XHRcdHJldHVybiBpZDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG5cdFx0XHRmdW5jdGlvbiBfZGVzdHJveSAobm9kZSkge1xuXHRcdFx0XHRpZiAobm9kZSkge1xuXHRcdFx0XHRcdGRlc3Ryb3llci5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRcdFx0XHRkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0d2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZU9yTm9kZXMsIGNhbGxiYWNrKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIGhhbmRsZURvbVJlYWR5IChub2RlLCBjYikge1xuXHRcdFx0XHRcdGZ1bmN0aW9uIG9uUmVhZHkgKCkge1xuXHRcdFx0XHRcdFx0Y2Iobm9kZSk7XG5cdFx0XHRcdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKG5vZGUuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0XHRcdGNiKG5vZGUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KG5vZGVPck5vZGVzKSkge1xuXHRcdFx0XHRcdGhhbmRsZURvbVJlYWR5KG5vZGVPck5vZGVzLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGNvdW50ID0gMDtcblxuXHRcdFx0XHRmdW5jdGlvbiBvbkFycmF5Tm9kZVJlYWR5ICgpIHtcblx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRcdGlmIChjb3VudCA9PT0gbm9kZU9yTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhub2RlT3JOb2Rlcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBub2RlT3JOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGhhbmRsZURvbVJlYWR5KG5vZGVPck5vZGVzW2ldLCBvbkFycmF5Tm9kZVJlYWR5KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0bW9kdWxlLmV4cG9ydHMgPSBCYXNlQ29tcG9uZW50O1xuXG5cdFx0fSwgeyBcIkBjbHViYWpheC9vblwiOiBcIkBjbHViYWpheC9vblwiIH1dLFxuXHRcdDI6IFtmdW5jdGlvbiAocmVxdWlyZSwgbW9kdWxlLCBleHBvcnRzKSB7XG5cdFx0XHQndXNlIHN0cmljdCc7XG5cblx0XHRcdHZhciBvbiA9IHJlcXVpcmUoJ0BjbHViYWpheC9vbicpO1xuXHRcdFx0dmFyIEJhc2VDb21wb25lbnQgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcblx0XHRcdHJlcXVpcmUoJy4vcHJvcGVydGllcycpO1xuXHRcdFx0cmVxdWlyZSgnLi90ZW1wbGF0ZScpO1xuXHRcdFx0cmVxdWlyZSgnLi9yZWZzJyk7XG5cdFx0XHQvL2NvbnN0IGl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vaXRlbS10ZW1wbGF0ZScpO1xuXG5cdFx0XHRtb2R1bGUuZXhwb3J0cyA9IEJhc2VDb21wb25lbnQ7XG5cblx0XHR9LCB7IFwiLi9CYXNlQ29tcG9uZW50XCI6IDEsIFwiLi9wcm9wZXJ0aWVzXCI6IDMsIFwiLi9yZWZzXCI6IDQsIFwiLi90ZW1wbGF0ZVwiOiA1LCBcIkBjbHViYWpheC9vblwiOiBcIkBjbHViYWpheC9vblwiIH1dLFxuXHRcdDM6IFtmdW5jdGlvbiAocmVxdWlyZSwgbW9kdWxlLCBleHBvcnRzKSB7XG5cdFx0XHQndXNlIHN0cmljdCc7XG5cblx0XHRcdHZhciBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5cblx0XHRcdGZ1bmN0aW9uIHNldEJvb2xlYW4gKG5vZGUsIHByb3ApIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbm9kZS5oYXNBdHRyaWJ1dGUocHJvcCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldCAodmFsdWUpIHtcblx0XHRcdFx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCAnJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhciBmbiA9IHRoaXNbb25pZnkocHJvcCldO1xuXHRcdFx0XHRcdFx0aWYgKGZuKSB7XG5cdFx0XHRcdFx0XHRcdGZuLmNhbGwodGhpcywgdmFsdWUpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNldFByb3BlcnR5IChub2RlLCBwcm9wKSB7XG5cdFx0XHRcdHZhciBwcm9wVmFsdWUgPSB2b2lkIDA7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByb3BWYWx1ZSAhPT0gdW5kZWZpbmVkID8gcHJvcFZhbHVlIDogbm9ybWFsaXplKHRoaXMuZ2V0QXR0cmlidXRlKHByb3ApKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNldDogZnVuY3Rpb24gc2V0ICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdFx0XHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0dmFyIGZuID0gdGhpc1tvbmlmeShwcm9wKV07XG5cdFx0XHRcdFx0XHRpZiAoZm4pIHtcblx0XHRcdFx0XHRcdFx0b25Eb21SZWFkeSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IGZuLmNhbGwoX3RoaXMsIHZhbHVlKSB8fCB2YWx1ZTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNldE9iamVjdCAobm9kZSwgcHJvcCkge1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGdldDogZnVuY3Rpb24gZ2V0ICgpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzWydfXycgKyBwcm9wXTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNldDogZnVuY3Rpb24gc2V0ICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0dGhpc1snX18nICsgcHJvcF0gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzZXRQcm9wZXJ0aWVzIChub2RlKSB7XG5cdFx0XHRcdHZhciBwcm9wcyA9IG5vZGUucHJvcHMgfHwgbm9kZS5wcm9wZXJ0aWVzO1xuXHRcdFx0XHRpZiAocHJvcHMpIHtcblx0XHRcdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRpZiAocHJvcCA9PT0gJ2Rpc2FibGVkJykge1xuXHRcdFx0XHRcdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c2V0UHJvcGVydHkobm9kZSwgcHJvcCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc2V0Qm9vbGVhbnMgKG5vZGUpIHtcblx0XHRcdFx0dmFyIHByb3BzID0gbm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zO1xuXHRcdFx0XHRpZiAocHJvcHMpIHtcblx0XHRcdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNldE9iamVjdHMgKG5vZGUpIHtcblx0XHRcdFx0dmFyIHByb3BzID0gbm9kZS5vYmplY3RzO1xuXHRcdFx0XHRpZiAocHJvcHMpIHtcblx0XHRcdFx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRcdFx0XHRzZXRPYmplY3Qobm9kZSwgcHJvcCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gY2FwIChuYW1lKSB7XG5cdFx0XHRcdHJldHVybiBuYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHJpbmcoMSk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIG9uaWZ5IChuYW1lKSB7XG5cdFx0XHRcdHJldHVybiAnb24nICsgbmFtZS5zcGxpdCgnLScpLm1hcChmdW5jdGlvbiAod29yZCkge1xuXHRcdFx0XHRcdHJldHVybiBjYXAod29yZCk7XG5cdFx0XHRcdH0pLmpvaW4oJycpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBpc0Jvb2wgKG5vZGUsIG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIChub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnMgfHwgW10pLmluZGV4T2YobmFtZSkgPiAtMTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gYm9vbE5vcm0gKHZhbHVlKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gJycpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbm9ybWFsaXplKHZhbHVlKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gcHJvcE5vcm0gKHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiBub3JtYWxpemUodmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBub3JtYWxpemUgKHZhbCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRpZiAodmFsID09PSAnZmFsc2UnKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPT09ICdudWxsJykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPT09ICd0cnVlJykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh2YWwuaW5kZXhPZignLycpID4gLTEgfHwgKHZhbC5tYXRjaCgvLS9nKSB8fCBbXSkubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0Ly8gdHlwZSBvZiBkYXRlXG5cdFx0XHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWlzTmFOKHBhcnNlRmxvYXQodmFsKSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdCh2YWwpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHR9XG5cblx0XHRcdEJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcblx0XHRcdFx0bmFtZTogJ3Byb3BlcnRpZXMnLFxuXHRcdFx0XHRvcmRlcjogMTAsXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uIGluaXQgKG5vZGUpIHtcblx0XHRcdFx0XHRzZXRQcm9wZXJ0aWVzKG5vZGUpO1xuXHRcdFx0XHRcdHNldEJvb2xlYW5zKG5vZGUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRwcmVBdHRyaWJ1dGVDaGFuZ2VkOiBmdW5jdGlvbiBwcmVBdHRyaWJ1dGVDaGFuZ2VkIChub2RlLCBuYW1lLCB2YWx1ZSkge1xuXHRcdFx0XHRcdGlmIChub2RlLmlzU2V0dGluZ0F0dHJpYnV0ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoaXNCb29sKG5vZGUsIG5hbWUpKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGJvb2xOb3JtKHZhbHVlKTtcblx0XHRcdFx0XHRcdG5vZGVbbmFtZV0gPSAhIXZhbHVlO1xuXHRcdFx0XHRcdFx0aWYgKCF2YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHRub2RlW25hbWVdID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0bm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdFx0XHRcdG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRub2RlW25hbWVdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub2RlW25hbWVdID0gcHJvcE5vcm0odmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH0sIHsgXCIuL0Jhc2VDb21wb25lbnRcIjogMSB9XSxcblx0XHQ0OiBbZnVuY3Rpb24gKHJlcXVpcmUsIG1vZHVsZSwgZXhwb3J0cykge1xuXHRcdFx0J3VzZSBzdHJpY3QnO1xuXG5cdFx0XHRmdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkgKGFycikge1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0YXJyMltpXSA9IGFycltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGFycjI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIEFycmF5LmZyb20oYXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuXG5cdFx0XHRmdW5jdGlvbiBhc3NpZ25SZWZzIChub2RlKSB7XG5cblx0XHRcdFx0W10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWZdJykpKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0XHRcdHZhciBuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcblx0XHRcdFx0XHRjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ3JlZicpO1xuXHRcdFx0XHRcdG5vZGVbbmFtZV0gPSBjaGlsZDtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGFzc2lnbkV2ZW50cyAobm9kZSkge1xuXHRcdFx0XHQvLyA8ZGl2IG9uPVwiY2xpY2s6b25DbGlja1wiPlxuXHRcdFx0XHRbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW29uXScpKSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGksIGNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0aWYgKGNoaWxkID09PSBub2RlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciBrZXlWYWx1ZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnb24nKSxcblx0XHRcdFx0XHRcdGV2ZW50ID0ga2V5VmFsdWUuc3BsaXQoJzonKVswXS50cmltKCksXG5cdFx0XHRcdFx0XHRtZXRob2QgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzFdLnRyaW0oKTtcblx0XHRcdFx0XHQvLyByZW1vdmUsIHNvIHBhcmVudCBkb2VzIG5vdCB0cnkgdG8gdXNlIGl0XG5cdFx0XHRcdFx0Y2hpbGQucmVtb3ZlQXR0cmlidXRlKCdvbicpO1xuXG5cdFx0XHRcdFx0bm9kZS5vbihjaGlsZCwgZXZlbnQsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0XHRub2RlW21ldGhvZF0oZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRCYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG5cdFx0XHRcdG5hbWU6ICdyZWZzJyxcblx0XHRcdFx0b3JkZXI6IDMwLFxuXHRcdFx0XHRwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIHByZUNvbm5lY3RlZCAobm9kZSkge1xuXHRcdFx0XHRcdGFzc2lnblJlZnMobm9kZSk7XG5cdFx0XHRcdFx0YXNzaWduRXZlbnRzKG5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH0sIHsgXCIuL0Jhc2VDb21wb25lbnRcIjogMSB9XSxcblx0XHQ1OiBbZnVuY3Rpb24gKHJlcXVpcmUsIG1vZHVsZSwgZXhwb3J0cykge1xuXHRcdFx0J3VzZSBzdHJpY3QnO1xuXG5cdFx0XHR2YXIgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuXG5cdFx0XHR2YXIgbGlnaHROb2RlcyA9IHt9O1xuXHRcdFx0dmFyIGluc2VydGVkID0ge307XG5cblx0XHRcdGZ1bmN0aW9uIGluc2VydCAobm9kZSkge1xuXHRcdFx0XHRpZiAoaW5zZXJ0ZWRbbm9kZS5fdWlkXSB8fCAhaGFzVGVtcGxhdGUobm9kZSkpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29sbGVjdExpZ2h0Tm9kZXMobm9kZSk7XG5cdFx0XHRcdGluc2VydFRlbXBsYXRlKG5vZGUpO1xuXHRcdFx0XHRpbnNlcnRlZFtub2RlLl91aWRdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gY29sbGVjdExpZ2h0Tm9kZXMgKG5vZGUpIHtcblx0XHRcdFx0bGlnaHROb2Rlc1tub2RlLl91aWRdID0gbGlnaHROb2Rlc1tub2RlLl91aWRdIHx8IFtdO1xuXHRcdFx0XHR3aGlsZSAobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXS5wdXNoKG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5jaGlsZE5vZGVzWzBdKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gaGFzVGVtcGxhdGUgKG5vZGUpIHtcblx0XHRcdFx0cmV0dXJuIG5vZGUudGVtcGxhdGVTdHJpbmcgfHwgbm9kZS50ZW1wbGF0ZUlkO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBpbnNlcnRUZW1wbGF0ZUNoYWluIChub2RlKSB7XG5cdFx0XHRcdHZhciB0ZW1wbGF0ZXMgPSBub2RlLmdldFRlbXBsYXRlQ2hhaW4oKTtcblx0XHRcdFx0dGVtcGxhdGVzLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuXHRcdFx0XHRcdGdldENvbnRhaW5lcihub2RlKS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpbnNlcnRDaGlsZHJlbihub2RlKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGUgKG5vZGUpIHtcblx0XHRcdFx0aWYgKG5vZGUubmVzdGVkVGVtcGxhdGUpIHtcblx0XHRcdFx0XHRpbnNlcnRUZW1wbGF0ZUNoYWluKG5vZGUpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgdGVtcGxhdGVOb2RlID0gbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcblxuXHRcdFx0XHRpZiAodGVtcGxhdGVOb2RlKSB7XG5cdFx0XHRcdFx0bm9kZS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlTm9kZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGluc2VydENoaWxkcmVuKG5vZGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBnZXRDb250YWluZXIgKG5vZGUpIHtcblx0XHRcdFx0dmFyIGNvbnRhaW5lcnMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWY9XCJjb250YWluZXJcIl0nKTtcblx0XHRcdFx0aWYgKCFjb250YWluZXJzIHx8ICFjb250YWluZXJzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiBub2RlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBjb250YWluZXJzW2NvbnRhaW5lcnMubGVuZ3RoIC0gMV07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGluc2VydENoaWxkcmVuIChub2RlKSB7XG5cdFx0XHRcdHZhciBpID0gdm9pZCAwO1xuXHRcdFx0XHR2YXIgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKG5vZGUpO1xuXHRcdFx0XHR2YXIgY2hpbGRyZW4gPSBsaWdodE5vZGVzW25vZGUuX3VpZF07XG5cblx0XHRcdFx0aWYgKGNvbnRhaW5lciAmJiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHRvRG9tIChodG1sKSB7XG5cdFx0XHRcdHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRcdFx0cmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcblx0XHRcdH1cblxuXHRcdFx0QmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0TGlnaHROb2RlcyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIGxpZ2h0Tm9kZXNbdGhpcy5fdWlkXTtcblx0XHRcdH07XG5cblx0XHRcdEJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Ly8gY2FjaGluZyBjYXVzZXMgZGlmZmVyZW50IGNsYXNzZXMgdG8gcHVsbCB0aGUgc2FtZSB0ZW1wbGF0ZSAtIHdhdD9cblx0XHRcdFx0Ly9pZighdGhpcy50ZW1wbGF0ZU5vZGUpIHtcblx0XHRcdFx0aWYgKHRoaXMudGVtcGxhdGVJZCkge1xuXHRcdFx0XHRcdHRoaXMudGVtcGxhdGVOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZW1wbGF0ZUlkLnJlcGxhY2UoJyMnLCAnJykpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMudGVtcGxhdGVTdHJpbmcpIHtcblx0XHRcdFx0XHR0aGlzLnRlbXBsYXRlTm9kZSA9IHRvRG9tKCc8dGVtcGxhdGU+JyArIHRoaXMudGVtcGxhdGVTdHJpbmcgKyAnPC90ZW1wbGF0ZT4nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL31cblx0XHRcdFx0cmV0dXJuIHRoaXMudGVtcGxhdGVOb2RlO1xuXHRcdFx0fTtcblxuXHRcdFx0QmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVDaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHR2YXIgY29udGV4dCA9IHRoaXMsXG5cdFx0XHRcdFx0dGVtcGxhdGVzID0gW10sXG5cdFx0XHRcdFx0dGVtcGxhdGUgPSB2b2lkIDA7XG5cblx0XHRcdFx0Ly8gd2FsayB0aGUgcHJvdG90eXBlIGNoYWluOyBCYWJlbCBkb2Vzbid0IGFsbG93IHVzaW5nXG5cdFx0XHRcdC8vIGBzdXBlcmAgc2luY2Ugd2UgYXJlIG91dHNpZGUgb2YgdGhlIENsYXNzXG5cdFx0XHRcdHdoaWxlIChjb250ZXh0KSB7XG5cdFx0XHRcdFx0Y29udGV4dCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250ZXh0KTtcblx0XHRcdFx0XHRpZiAoIWNvbnRleHQpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBza2lwIHByb3RvdHlwZXMgd2l0aG91dCBhIHRlbXBsYXRlXG5cdFx0XHRcdFx0Ly8gKGVsc2UgaXQgd2lsbCBwdWxsIGFuIGluaGVyaXRlZCB0ZW1wbGF0ZSBhbmQgY2F1c2UgZHVwbGljYXRlcylcblx0XHRcdFx0XHRpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVTdHJpbmcnKSB8fCBjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZUlkJykpIHtcblx0XHRcdFx0XHRcdHRlbXBsYXRlID0gY29udGV4dC5nZXRUZW1wbGF0ZU5vZGUoKTtcblx0XHRcdFx0XHRcdGlmICh0ZW1wbGF0ZSkge1xuXHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZXMucHVzaCh0ZW1wbGF0ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0ZW1wbGF0ZXM7XG5cdFx0XHR9O1xuXG5cdFx0XHRCYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG5cdFx0XHRcdG5hbWU6ICd0ZW1wbGF0ZScsXG5cdFx0XHRcdG9yZGVyOiAyMCxcblx0XHRcdFx0cHJlQ29ubmVjdGVkOiBmdW5jdGlvbiBwcmVDb25uZWN0ZWQgKG5vZGUpIHtcblx0XHRcdFx0XHRpbnNlcnQobm9kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fSwgeyBcIi4vQmFzZUNvbXBvbmVudFwiOiAxIH1dXG5cdH0sIHt9LCBbMl0pKDIpXG59KTsiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRFxuICAgICAgICBkZWZpbmUoW1wiQmFzZUNvbXBvbmVudFwiXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAvLyBOb2RlIC8gQ29tbW9uSlNcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ0Jhc2VDb21wb25lbnQnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdFsndW5kZWZpbmVkJ10gPSBmYWN0b3J5KHJvb3QuQmFzZUNvbXBvbmVudCk7XG4gICAgfVxuXHR9KHRoaXMsIGZ1bmN0aW9uIChCYXNlQ29tcG9uZW50KSB7XG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHNldEJvb2xlYW4obm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIG5vZGUuaGFzQXR0cmlidXRlKHByb3ApO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCAnJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcblx0XHRcdH1cblx0XHRcdHZhciBmbiA9IHRoaXNbb25pZnkocHJvcCldO1xuXHRcdFx0aWYgKGZuKSB7XG5cdFx0XHRcdGZuLmNhbGwodGhpcywgdmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnR5KG5vZGUsIHByb3ApIHtcblx0dmFyIHByb3BWYWx1ZSA9IHZvaWQgMDtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBwcm9wVmFsdWUgIT09IHVuZGVmaW5lZCA/IHByb3BWYWx1ZSA6IG5vcm1hbGl6ZSh0aGlzLmdldEF0dHJpYnV0ZShwcm9wKSk7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgdmFsdWUpO1xuXHRcdFx0dmFyIGZuID0gdGhpc1tvbmlmeShwcm9wKV07XG5cdFx0XHRpZiAoZm4pIHtcblx0XHRcdFx0b25Eb21SZWFkeSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHByb3BWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YWx1ZSA9IGZuLmNhbGwoX3RoaXMsIHZhbHVlKSB8fCB2YWx1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdChub2RlLCBwcm9wKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1snX18nICsgcHJvcF07XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuXHRcdFx0dGhpc1snX18nICsgcHJvcF0gPSB2YWx1ZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzKG5vZGUpIHtcblx0dmFyIHByb3BzID0gbm9kZS5wcm9wcyB8fCBub2RlLnByb3BlcnRpZXM7XG5cdGlmIChwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdGlmIChwcm9wID09PSAnZGlzYWJsZWQnKSB7XG5cdFx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZXRQcm9wZXJ0eShub2RlLCBwcm9wKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXRCb29sZWFucyhub2RlKSB7XG5cdHZhciBwcm9wcyA9IG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucztcblx0aWYgKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0Qm9vbGVhbihub2RlLCBwcm9wKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXRPYmplY3RzKG5vZGUpIHtcblx0dmFyIHByb3BzID0gbm9kZS5vYmplY3RzO1xuXHRpZiAocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRzZXRPYmplY3Qobm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY2FwKG5hbWUpIHtcblx0cmV0dXJuIG5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cmluZygxKTtcbn1cblxuZnVuY3Rpb24gb25pZnkobmFtZSkge1xuXHRyZXR1cm4gJ29uJyArIG5hbWUuc3BsaXQoJy0nKS5tYXAoZnVuY3Rpb24gKHdvcmQpIHtcblx0XHRyZXR1cm4gY2FwKHdvcmQpO1xuXHR9KS5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gaXNCb29sKG5vZGUsIG5hbWUpIHtcblx0cmV0dXJuIChub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnMgfHwgW10pLmluZGV4T2YobmFtZSkgPiAtMTtcbn1cblxuZnVuY3Rpb24gYm9vbE5vcm0odmFsdWUpIHtcblx0aWYgKHZhbHVlID09PSAnJykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBub3JtYWxpemUodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBwcm9wTm9ybSh2YWx1ZSkge1xuXHRyZXR1cm4gbm9ybWFsaXplKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplKHZhbCkge1xuXHRpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcblx0XHRpZiAodmFsID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSBlbHNlIGlmICh2YWwgPT09ICdudWxsJykge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSBlbHNlIGlmICh2YWwgPT09ICd0cnVlJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGlmICh2YWwuaW5kZXhPZignLycpID4gLTEgfHwgKHZhbC5tYXRjaCgvLS9nKSB8fCBbXSkubGVuZ3RoID4gMSkge1xuXHRcdFx0Ly8gdHlwZSBvZiBkYXRlXG5cdFx0XHRyZXR1cm4gdmFsO1xuXHRcdH1cblx0fVxuXHRpZiAoIWlzTmFOKHBhcnNlRmxvYXQodmFsKSkpIHtcblx0XHRyZXR1cm4gcGFyc2VGbG9hdCh2YWwpO1xuXHR9XG5cdHJldHVybiB2YWw7XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcblx0bmFtZTogJ3Byb3BlcnRpZXMnLFxuXHRvcmRlcjogMTAsXG5cdGluaXQ6IGZ1bmN0aW9uIGluaXQobm9kZSkge1xuXHRcdHNldFByb3BlcnRpZXMobm9kZSk7XG5cdFx0c2V0Qm9vbGVhbnMobm9kZSk7XG5cdH0sXG5cdHByZUF0dHJpYnV0ZUNoYW5nZWQ6IGZ1bmN0aW9uIHByZUF0dHJpYnV0ZUNoYW5nZWQobm9kZSwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobm9kZS5pc1NldHRpbmdBdHRyaWJ1dGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKGlzQm9vbChub2RlLCBuYW1lKSkge1xuXHRcdFx0dmFsdWUgPSBib29sTm9ybSh2YWx1ZSk7XG5cdFx0XHRub2RlW25hbWVdID0gISF2YWx1ZTtcblx0XHRcdGlmICghdmFsdWUpIHtcblx0XHRcdFx0bm9kZVtuYW1lXSA9IGZhbHNlO1xuXHRcdFx0XHRub2RlLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHRcdG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRub2RlLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bm9kZVtuYW1lXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bm9kZVtuYW1lXSA9IHByb3BOb3JtKHZhbHVlKTtcblx0fVxufSk7XG5cbn0pKTsiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRFxuICAgICAgICBkZWZpbmUoW1wiQmFzZUNvbXBvbmVudFwiXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAvLyBOb2RlIC8gQ29tbW9uSlNcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ0Jhc2VDb21wb25lbnQnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdFsndW5kZWZpbmVkJ10gPSBmYWN0b3J5KHJvb3QuQmFzZUNvbXBvbmVudCk7XG4gICAgfVxuXHR9KHRoaXMsIGZ1bmN0aW9uIChCYXNlQ29tcG9uZW50KSB7XG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG5mdW5jdGlvbiBhc3NpZ25SZWZzKG5vZGUpIHtcblxuICAgIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkobm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbcmVmXScpKSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICBjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICBub2RlW25hbWVdID0gY2hpbGQ7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbkV2ZW50cyhub2RlKSB7XG4gICAgLy8gPGRpdiBvbj1cImNsaWNrOm9uQ2xpY2tcIj5cbiAgICBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW29uXScpKSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGksIGNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChjaGlsZCA9PT0gbm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlWYWx1ZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnb24nKSxcbiAgICAgICAgICAgIGV2ZW50ID0ga2V5VmFsdWUuc3BsaXQoJzonKVswXS50cmltKCksXG4gICAgICAgICAgICBtZXRob2QgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzFdLnRyaW0oKTtcbiAgICAgICAgLy8gcmVtb3ZlLCBzbyBwYXJlbnQgZG9lcyBub3QgdHJ5IHRvIHVzZSBpdFxuICAgICAgICBjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ29uJyk7XG5cbiAgICAgICAgbm9kZS5vbihjaGlsZCwgZXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBub2RlW21ldGhvZF0oZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3JlZnMnLFxuICAgIG9yZGVyOiAzMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIHByZUNvbm5lY3RlZChub2RlKSB7XG4gICAgICAgIGFzc2lnblJlZnMobm9kZSk7XG4gICAgICAgIGFzc2lnbkV2ZW50cyhub2RlKTtcbiAgICB9XG59KTtcblxufSkpOyIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1EXG4gICAgICAgIGRlZmluZShbXCJCYXNlQ29tcG9uZW50XCJdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIC8vIE5vZGUgLyBDb21tb25KU1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnQmFzZUNvbXBvbmVudCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgICAgICByb290Wyd1bmRlZmluZWQnXSA9IGZhY3Rvcnkocm9vdC5CYXNlQ29tcG9uZW50KTtcbiAgICB9XG5cdH0odGhpcywgZnVuY3Rpb24gKEJhc2VDb21wb25lbnQpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIGxpZ2h0Tm9kZXMgPSB7fTtcbnZhciBpbnNlcnRlZCA9IHt9O1xuXG5mdW5jdGlvbiBpbnNlcnQobm9kZSkge1xuICAgIGlmIChpbnNlcnRlZFtub2RlLl91aWRdIHx8ICFoYXNUZW1wbGF0ZShub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbGxlY3RMaWdodE5vZGVzKG5vZGUpO1xuICAgIGluc2VydFRlbXBsYXRlKG5vZGUpO1xuICAgIGluc2VydGVkW25vZGUuX3VpZF0gPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKSB7XG4gICAgbGlnaHROb2Rlc1tub2RlLl91aWRdID0gbGlnaHROb2Rlc1tub2RlLl91aWRdIHx8IFtdO1xuICAgIHdoaWxlIChub2RlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXS5wdXNoKG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5jaGlsZE5vZGVzWzBdKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYXNUZW1wbGF0ZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUudGVtcGxhdGVTdHJpbmcgfHwgbm9kZS50ZW1wbGF0ZUlkO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRUZW1wbGF0ZUNoYWluKG5vZGUpIHtcbiAgICB2YXIgdGVtcGxhdGVzID0gbm9kZS5nZXRUZW1wbGF0ZUNoYWluKCk7XG4gICAgdGVtcGxhdGVzLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICBnZXRDb250YWluZXIobm9kZSkuYXBwZW5kQ2hpbGQoQmFzZUNvbXBvbmVudC5jbG9uZSh0ZW1wbGF0ZSkpO1xuICAgIH0pO1xuICAgIGluc2VydENoaWxkcmVuKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRUZW1wbGF0ZShub2RlKSB7XG4gICAgaWYgKG5vZGUubmVzdGVkVGVtcGxhdGUpIHtcbiAgICAgICAgaW5zZXJ0VGVtcGxhdGVDaGFpbihub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGVtcGxhdGVOb2RlID0gbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcblxuICAgIGlmICh0ZW1wbGF0ZU5vZGUpIHtcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlTm9kZSkpO1xuICAgIH1cbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyKG5vZGUpIHtcbiAgICB2YXIgY29udGFpbmVycyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW3JlZj1cImNvbnRhaW5lclwiXScpO1xuICAgIGlmICghY29udGFpbmVycyB8fCAhY29udGFpbmVycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXJzW2NvbnRhaW5lcnMubGVuZ3RoIC0gMV07XG59XG5cbmZ1bmN0aW9uIGluc2VydENoaWxkcmVuKG5vZGUpIHtcbiAgICB2YXIgaSA9IHZvaWQgMDtcbiAgICB2YXIgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKG5vZGUpO1xuICAgIHZhciBjaGlsZHJlbiA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXTtcblxuICAgIGlmIChjb250YWluZXIgJiYgY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdG9Eb20oaHRtbCkge1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbm9kZS5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG59XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldExpZ2h0Tm9kZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxpZ2h0Tm9kZXNbdGhpcy5fdWlkXTtcbn07XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBjYWNoaW5nIGNhdXNlcyBkaWZmZXJlbnQgY2xhc3NlcyB0byBwdWxsIHRoZSBzYW1lIHRlbXBsYXRlIC0gd2F0P1xuICAgIC8vaWYoIXRoaXMudGVtcGxhdGVOb2RlKSB7XG4gICAgaWYgKHRoaXMudGVtcGxhdGVJZCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGVtcGxhdGVJZC5yZXBsYWNlKCcjJywgJycpKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGVtcGxhdGVTdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSB0b0RvbSgnPHRlbXBsYXRlPicgKyB0aGlzLnRlbXBsYXRlU3RyaW5nICsgJzwvdGVtcGxhdGU+Jyk7XG4gICAgfVxuICAgIC8vfVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlTm9kZTtcbn07XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlQ2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgIHRlbXBsYXRlcyA9IFtdLFxuICAgICAgICB0ZW1wbGF0ZSA9IHZvaWQgMDtcblxuICAgIC8vIHdhbGsgdGhlIHByb3RvdHlwZSBjaGFpbjsgQmFiZWwgZG9lc24ndCBhbGxvdyB1c2luZ1xuICAgIC8vIGBzdXBlcmAgc2luY2Ugd2UgYXJlIG91dHNpZGUgb2YgdGhlIENsYXNzXG4gICAgd2hpbGUgKGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250ZXh0KTtcbiAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAvLyBza2lwIHByb3RvdHlwZXMgd2l0aG91dCBhIHRlbXBsYXRlXG4gICAgICAgIC8vIChlbHNlIGl0IHdpbGwgcHVsbCBhbiBpbmhlcml0ZWQgdGVtcGxhdGUgYW5kIGNhdXNlIGR1cGxpY2F0ZXMpXG4gICAgICAgIGlmIChjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZVN0cmluZycpIHx8IGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlSWQnKSkge1xuICAgICAgICAgICAgdGVtcGxhdGUgPSBjb250ZXh0LmdldFRlbXBsYXRlTm9kZSgpO1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzLnB1c2godGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZW1wbGF0ZXM7XG59O1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3RlbXBsYXRlJyxcbiAgICBvcmRlcjogMjAsXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiBwcmVDb25uZWN0ZWQobm9kZSkge1xuICAgICAgICBpbnNlcnQobm9kZSk7XG4gICAgfVxufSk7XG5cbn0pKTsiLCJyZXF1aXJlKCdjdXN0b20tZWxlbWVudHMtcG9seWZpbGwnKTtcbmNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi4vLi4vZGlzdC9pbmRleCcpO1xuXG5jb25zb2xlLmxvZygnQmFzZUNvbXBvbmVudCcsIEJhc2VDb21wb25lbnQpO1xuXG5jbGFzcyBUZXN0TGlmZWN5Y2xlIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7cmV0dXJuIFsnZm9vJywgJ2JhciddOyB9XG5cblx0c2V0IGZvbyAodmFsdWUpIHtcblx0XHR0aGlzLl9fZm9vID0gdmFsdWU7XG5cdH1cblxuXHRnZXQgZm9vICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2Zvbztcblx0fVxuXG5cdHNldCBiYXIgKHZhbHVlKSB7XG5cdFx0dGhpcy5fX2JhciA9IHZhbHVlO1xuXHR9XG5cblx0Z2V0IGJhciAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19iYXIgfHwgJ05PVFNFVCc7XG5cdH1cblxuXHRjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdGNvbm5lY3RlZCAoKSB7XG5cdFx0b24uZmlyZShkb2N1bWVudCwgJ2Nvbm5lY3RlZC1jYWxsZWQnLCB0aGlzKTtcblx0fVxuXG5cdGRvbVJlYWR5ICgpIHtcblx0XHRvbi5maXJlKGRvY3VtZW50LCAnZG9tcmVhZHktY2FsbGVkJywgdGhpcyk7XG5cdH1cblxuXHRkaXNjb25uZWN0ZWQgKCkge1xuXHRcdG9uLmZpcmUoZG9jdW1lbnQsICdkaXNjb25uZWN0ZWQtY2FsbGVkJywgdGhpcyk7XG5cdH1cblxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtbGlmZWN5Y2xlJywgVGVzdExpZmVjeWNsZSk7XG4iLCIvL3dpbmRvd1snbm8tbmF0aXZlLXNoaW0nXSA9IHRydWU7XG5yZXF1aXJlKCdjdXN0b20tZWxlbWVudHMtcG9seWZpbGwnKTtcbndpbmRvdy5vbiA9IHJlcXVpcmUoJ0BjbHViYWpheC9vbicpO1xud2luZG93LmRvbSA9IHJlcXVpcmUoJ0BjbHViYWpheC9kb20nKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3Qgb24gPSByZXF1aXJlKCdAY2x1YmFqYXgvb24nKTtcblxuY2xhc3MgQmFzZUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblx0Y29uc3RydWN0b3IgKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5fdWlkID0gdWlkKHRoaXMubG9jYWxOYW1lKTtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdID0geyBET01TVEFURTogJ2NyZWF0ZWQnIH07XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0ID0gW107XG5cdFx0cGx1Z2luKCdpbml0JywgdGhpcyk7XG5cdH1cblxuXHRjb25uZWN0ZWRDYWxsYmFjayAoKSB7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA/ICdkb21yZWFkeScgOiAnY29ubmVjdGVkJztcblx0XHRwbHVnaW4oJ3ByZUNvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdG5leHRUaWNrKG9uQ2hlY2tEb21SZWFkeS5iaW5kKHRoaXMpKTtcblx0XHRpZiAodGhpcy5jb25uZWN0ZWQpIHtcblx0XHRcdHRoaXMuY29ubmVjdGVkKCk7XG5cdFx0fVxuXHRcdHRoaXMuZmlyZSgnY29ubmVjdGVkJyk7XG5cdFx0cGx1Z2luKCdwb3N0Q29ubmVjdGVkJywgdGhpcyk7XG5cdH1cblxuXHRvbkNvbm5lY3RlZCAoY2FsbGJhY2spIHtcblx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2Nvbm5lY3RlZCcgfHwgdGhpcy5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMub25jZSgnY29ubmVjdGVkJywgKCkgPT4ge1xuXHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0fSk7XG5cdH1cblxuXHRvbkRvbVJlYWR5IChjYWxsYmFjaykge1xuXHRcdGlmICh0aGlzLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5vbmNlKCdkb21yZWFkeScsICgpID0+IHtcblx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZGlzY29ubmVjdGVkQ2FsbGJhY2sgKCkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZGlzY29ubmVjdGVkJztcblx0XHRwbHVnaW4oJ3ByZURpc2Nvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdGlmICh0aGlzLmRpc2Nvbm5lY3RlZCkge1xuXHRcdFx0dGhpcy5kaXNjb25uZWN0ZWQoKTtcblx0XHR9XG5cdFx0dGhpcy5maXJlKCdkaXNjb25uZWN0ZWQnKTtcblxuXHRcdGxldCB0aW1lLCBkb2QgPSBCYXNlQ29tcG9uZW50LmRlc3Ryb3lPbkRpc2Nvbm5lY3Q7XG5cdFx0aWYgKGRvZCkge1xuXHRcdFx0dGltZSA9IHR5cGVvZiBkb2QgPT09ICdudW1iZXInID8gZG9jIDogMzAwO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLkRPTVNUQVRFID09PSAnZGlzY29ubmVjdGVkJykge1xuXHRcdFx0XHRcdHRoaXMuZGVzdHJveSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aW1lKTtcblx0XHR9XG5cdH1cblxuXHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgKGF0dHJOYW1lLCBvbGRWYWwsIG5ld1ZhbCkge1xuXHRcdHBsdWdpbigncHJlQXR0cmlidXRlQ2hhbmdlZCcsIHRoaXMsIGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0aWYgKHRoaXMuYXR0cmlidXRlQ2hhbmdlZCkge1xuXHRcdFx0dGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0fVxuXHR9XG5cblx0ZGVzdHJveSAoKSB7XG5cdFx0dGhpcy5maXJlKCdkZXN0cm95Jyk7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xuXHRcdFx0aGFuZGxlLnJlbW92ZSgpO1xuXHRcdH0pO1xuXHRcdGRlc3Ryb3kodGhpcyk7XG5cdH1cblxuXHRmaXJlIChldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG5cdFx0cmV0dXJuIG9uLmZpcmUodGhpcywgZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcyk7XG5cdH1cblxuXHRlbWl0IChldmVudE5hbWUsIHZhbHVlKSB7XG5cdFx0cmV0dXJuIG9uLmVtaXQodGhpcywgZXZlbnROYW1lLCB2YWx1ZSk7XG5cdH1cblxuXHRvbiAobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcblx0XHRyZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcblx0XHRcdHR5cGVvZiBub2RlICE9PSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcblx0XHRcdFx0b24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcblx0XHRcdFx0b24odGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvcikpO1xuXHR9XG5cblx0b25jZSAobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcblx0XHRyZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcblx0XHRcdHR5cGVvZiBub2RlICE9PSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcblx0XHRcdFx0b24ub25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykgOlxuXHRcdFx0XHRvbi5vbmNlKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSk7XG5cdH1cblxuXHRhdHRyIChrZXksIHZhbHVlLCB0b2dnbGUpIHtcblx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0Y29uc3QgYWRkID0gdG9nZ2xlID09PSB1bmRlZmluZWQgPyB0cnVlIDogISF0b2dnbGU7XG5cdFx0aWYgKGFkZCkge1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKGtleSk7XG5cdFx0fVxuXHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdH1cblxuXHRyZWdpc3RlckhhbmRsZSAoaGFuZGxlKSB7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LnB1c2goaGFuZGxlKTtcblx0XHRyZXR1cm4gaGFuZGxlO1xuXHR9XG5cblx0Z2V0IERPTVNUQVRFICgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURTtcblx0fVxuXG5cdHN0YXRpYyBzZXQgZGVzdHJveU9uRGlzY29ubmVjdCAodmFsdWUpIHtcblx0XHRwcml2YXRlc1snZGVzdHJveU9uRGlzY29ubmVjdCddID0gdmFsdWU7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IGRlc3Ryb3lPbkRpc2Nvbm5lY3QgKCkge1xuXHRcdHJldHVybiBwcml2YXRlc1snZGVzdHJveU9uRGlzY29ubmVjdCddO1xuXHR9XG5cblx0c3RhdGljIGNsb25lICh0ZW1wbGF0ZSkge1xuXHRcdGlmICh0ZW1wbGF0ZS5jb250ZW50ICYmIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pIHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXHRcdH1cblx0XHRjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGNvbnN0IGNsb25lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGNsb25lTm9kZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZS5pbm5lckhUTUw7XG5cblx0XHR3aGlsZSAoY2xvbmVOb2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0ZnJhZy5hcHBlbmRDaGlsZChjbG9uZU5vZGUuY2hpbGRyZW5bMF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gZnJhZztcblx0fVxuXG5cdHN0YXRpYyBhZGRQbHVnaW4gKHBsdWcpIHtcblx0XHRsZXQgaSwgb3JkZXIgPSBwbHVnLm9yZGVyIHx8IDEwMDtcblx0XHRpZiAoIXBsdWdpbnMubGVuZ3RoKSB7XG5cdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHBsdWdpbnMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRpZiAocGx1Z2luc1swXS5vcmRlciA8PSBvcmRlcikge1xuXHRcdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChwbHVnaW5zWzBdLm9yZGVyID4gb3JkZXIpIHtcblx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cblx0XHRcdGZvciAoaSA9IDE7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChvcmRlciA9PT0gcGx1Z2luc1tpIC0gMV0ub3JkZXIgfHwgKG9yZGVyID4gcGx1Z2luc1tpIC0gMV0ub3JkZXIgJiYgb3JkZXIgPCBwbHVnaW5zW2ldLm9yZGVyKSkge1xuXHRcdFx0XHRcdHBsdWdpbnMuc3BsaWNlKGksIDAsIHBsdWcpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gd2FzIG5vdCBpbnNlcnRlZC4uLlxuXHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdH1cblx0fVxufVxuXG5sZXRcblx0cHJpdmF0ZXMgPSB7fSxcblx0cGx1Z2lucyA9IFtdO1xuXG5mdW5jdGlvbiBwbHVnaW4gKG1ldGhvZCwgbm9kZSwgYSwgYiwgYykge1xuXHRwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWcpIHtcblx0XHRpZiAocGx1Z1ttZXRob2RdKSB7XG5cdFx0XHRwbHVnW21ldGhvZF0obm9kZSwgYSwgYiwgYyk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gb25DaGVja0RvbVJlYWR5ICgpIHtcblx0aWYgKHRoaXMuRE9NU1RBVEUgIT09ICdjb25uZWN0ZWQnIHx8IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGxldFxuXHRcdGNvdW50ID0gMCxcblx0XHRjaGlsZHJlbiA9IGdldENoaWxkQ3VzdG9tTm9kZXModGhpcyksXG5cdFx0b3VyRG9tUmVhZHkgPSBvbkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cblx0ZnVuY3Rpb24gYWRkUmVhZHkgKCkge1xuXHRcdGNvdW50Kys7XG5cdFx0aWYgKGNvdW50ID09PSBjaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdG91ckRvbVJlYWR5KCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gSWYgbm8gY2hpbGRyZW4sIHdlJ3JlIGdvb2QgLSBsZWFmIG5vZGUuIENvbW1lbmNlIHdpdGggb25Eb21SZWFkeVxuXHQvL1xuXHRpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdG91ckRvbVJlYWR5KCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gZWxzZSwgd2FpdCBmb3IgYWxsIGNoaWxkcmVuIHRvIGZpcmUgdGhlaXIgYHJlYWR5YCBldmVudHNcblx0XHQvL1xuXHRcdGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHQvLyBjaGVjayBpZiBjaGlsZCBpcyBhbHJlYWR5IHJlYWR5XG5cdFx0XHQvLyBhbHNvIGNoZWNrIGZvciBjb25uZWN0ZWQgLSB0aGlzIGhhbmRsZXMgbW92aW5nIGEgbm9kZSBmcm9tIGFub3RoZXIgbm9kZVxuXHRcdFx0Ly8gTk9QRSwgdGhhdCBmYWlsZWQuIHJlbW92ZWQgZm9yIG5vdyBjaGlsZC5ET01TVEFURSA9PT0gJ2Nvbm5lY3RlZCdcblx0XHRcdGlmIChjaGlsZC5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0XHRhZGRSZWFkeSgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYgbm90LCB3YWl0IGZvciBldmVudFxuXHRcdFx0Y2hpbGQub24oJ2RvbXJlYWR5JywgYWRkUmVhZHkpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9uRG9tUmVhZHkgKCkge1xuXHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2RvbXJlYWR5Jztcblx0Ly8gZG9tUmVhZHkgc2hvdWxkIG9ubHkgZXZlciBmaXJlIG9uY2Vcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkID0gdHJ1ZTtcblx0cGx1Z2luKCdwcmVEb21SZWFkeScsIHRoaXMpO1xuXHQvLyBjYWxsIHRoaXMuZG9tUmVhZHkgZmlyc3QsIHNvIHRoYXQgdGhlIGNvbXBvbmVudFxuXHQvLyBjYW4gZmluaXNoIGluaXRpYWxpemluZyBiZWZvcmUgZmlyaW5nIGFueVxuXHQvLyBzdWJzZXF1ZW50IGV2ZW50c1xuXHRpZiAodGhpcy5kb21SZWFkeSkge1xuXHRcdHRoaXMuZG9tUmVhZHkoKTtcblx0XHR0aGlzLmRvbVJlYWR5ID0gZnVuY3Rpb24gKCkge307XG5cdH1cblxuXHQvLyBhbGxvdyBjb21wb25lbnQgdG8gZmlyZSB0aGlzIGV2ZW50XG5cdC8vIGRvbVJlYWR5KCkgd2lsbCBzdGlsbCBiZSBjYWxsZWRcblx0aWYgKCF0aGlzLmZpcmVPd25Eb21yZWFkeSkge1xuXHRcdHRoaXMuZmlyZSgnZG9tcmVhZHknKTtcblx0fVxuXG5cdHBsdWdpbigncG9zdERvbVJlYWR5JywgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkQ3VzdG9tTm9kZXMgKG5vZGUpIHtcblx0Ly8gY29sbGVjdCBhbnkgY2hpbGRyZW4gdGhhdCBhcmUgY3VzdG9tIG5vZGVzXG5cdC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuXHQvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG5cdGxldCBpLCBub2RlcyA9IFtdO1xuXHRmb3IgKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChub2RlLmNoaWxkcmVuW2ldLm5vZGVOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG5cdFx0XHRub2Rlcy5wdXNoKG5vZGUuY2hpbGRyZW5baV0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbm9kZXM7XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrIChjYikge1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xufVxuXG5jb25zdCB1aWRzID0ge307XG5mdW5jdGlvbiB1aWQgKHR5cGUgPSAndWlkJykge1xuXHRpZiAodWlkc1t0eXBlXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dWlkc1t0eXBlXSA9IDA7XG5cdH1cblx0Y29uc3QgaWQgPSB0eXBlICsgJy0nICsgKHVpZHNbdHlwZV0gKyAxKTtcblx0dWlkc1t0eXBlXSsrO1xuXHRyZXR1cm4gaWQ7XG59XG5cbmNvbnN0IGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZnVuY3Rpb24gZGVzdHJveSAobm9kZSkge1xuXHRpZiAobm9kZSkge1xuXHRcdGRlc3Ryb3llci5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG5cdH1cbn1cblxuXG53aW5kb3cub25Eb21SZWFkeSA9IGZ1bmN0aW9uIChub2RlT3JOb2RlcywgY2FsbGJhY2spIHtcblx0ZnVuY3Rpb24gaGFuZGxlRG9tUmVhZHkgKG5vZGUsIGNiKSB7XG5cdFx0ZnVuY3Rpb24gb25SZWFkeSAoKSB7XG5cdFx0XHRjYihub2RlKTtcblx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcblx0XHR9XG5cblx0XHRpZiAobm9kZS5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0Y2Iobm9kZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuXHRcdH1cblx0fVxuXG5cdGlmICghQXJyYXkuaXNBcnJheShub2RlT3JOb2RlcykpIHtcblx0XHRoYW5kbGVEb21SZWFkeShub2RlT3JOb2RlcywgY2FsbGJhY2spO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGxldCBjb3VudCA9IDA7XG5cblx0ZnVuY3Rpb24gb25BcnJheU5vZGVSZWFkeSAoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IG5vZGVPck5vZGVzLmxlbmd0aCkge1xuXHRcdFx0Y2FsbGJhY2sobm9kZU9yTm9kZXMpO1xuXHRcdH1cblx0fVxuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZU9yTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRoYW5kbGVEb21SZWFkeShub2RlT3JOb2Rlc1tpXSwgb25BcnJheU5vZGVSZWFkeSk7XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ29tcG9uZW50OyJdfQ==
