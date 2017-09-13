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
		    ourDomReady = onSelfDomReady.bind(this);

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

	function onSelfDomReady() {
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

	(function () {

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
				val = val.trim();
				if (val === 'false') {
					return false;
				} else if (val === 'null') {
					return null;
				} else if (val === 'true') {
					return true;
				}
				// finds strings that start with numbers, but are not numbers:
				// '1team' '123 Street', '1-2-3', etc
				if (('' + val).replace(/\d*/, '').length) {
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
	})();

	(function () {

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
	})();

	(function () {

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
	})();

	return BaseComponent;
});

},{"@clubajax/on":"@clubajax/on"}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('@clubajax/custom-elements-polyfill');
var BaseComponent = require('../../dist/index');

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

},{"../../dist/index":1,"@clubajax/custom-elements-polyfill":"@clubajax/custom-elements-polyfill"}],3:[function(require,module,exports){
'use strict';

//window['no-native-shim'] = true;
require('@clubajax/custom-elements-polyfill');
window.on = require('@clubajax/on');
window.dom = require('@clubajax/dom');

},{"@clubajax/custom-elements-polyfill":"@clubajax/custom-elements-polyfill","@clubajax/dom":"@clubajax/dom","@clubajax/on":"@clubajax/on"}],"BaseComponent":[function(require,module,exports){
'use strict';

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
	    ourDomReady = onSelfDomReady.bind(this);

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

function onSelfDomReady() {
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

},{"@clubajax/on":"@clubajax/on"}]},{},[3,2])("BaseComponent")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwidGVzdHMvc3JjL2Rpc3QtdGVzdC5qcyIsInRlc3RzL3NyYy9nbG9iYWxzLmpzIiwic3JjL0Jhc2VDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUMsV0FBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCO0FBQ3RCLEtBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDNUM7QUFDQSxTQUFPLENBQUMsY0FBRCxDQUFQLEVBQXlCLE9BQXpCO0FBQ0gsRUFIRCxNQUdPLElBQUksUUFBTyxNQUFQLHlDQUFPLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEIsT0FBTyxPQUF6QyxFQUFrRDtBQUNyRDtBQUNBLFNBQU8sT0FBUCxHQUFpQixRQUFRLFFBQVEsY0FBUixDQUFSLENBQWpCO0FBQ0gsRUFITSxNQUdBO0FBQ0g7QUFDQSxPQUFLLGVBQUwsSUFBd0IsUUFBUSxLQUFLLEVBQWIsQ0FBeEI7QUFDSDtBQUNILENBWEQsYUFXUSxVQUFVLEVBQVYsRUFBYztBQUN2Qjs7QUFHQSxLQUFJLGVBQWUsWUFBWTtBQUFFLFdBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsS0FBbEMsRUFBeUM7QUFBRSxRQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUFFLFFBQUksYUFBYSxNQUFNLENBQU4sQ0FBakIsQ0FBMkIsV0FBVyxVQUFYLEdBQXdCLFdBQVcsVUFBWCxJQUF5QixLQUFqRCxDQUF3RCxXQUFXLFlBQVgsR0FBMEIsSUFBMUIsQ0FBZ0MsSUFBSSxXQUFXLFVBQWYsRUFBMkIsV0FBVyxRQUFYLEdBQXNCLElBQXRCLENBQTRCLE9BQU8sY0FBUCxDQUFzQixNQUF0QixFQUE4QixXQUFXLEdBQXpDLEVBQThDLFVBQTlDO0FBQTREO0FBQUUs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U0FBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCO0FBQ3ZCLEtBQUksSUFBSixFQUFVO0FBQ1QsWUFBVSxXQUFWLENBQXNCLElBQXRCO0FBQ0EsWUFBVSxTQUFWLEdBQXNCLEVBQXRCO0FBQ0E7QUFDRDs7QUFHRCxPQUFPLFVBQVAsR0FBb0IsVUFBVSxXQUFWLEVBQXVCLFFBQXZCLEVBQWlDO0FBQ3BELFVBQVMsY0FBVCxDQUF5QixJQUF6QixFQUErQixFQUEvQixFQUFtQztBQUNsQyxXQUFTLE9BQVQsR0FBb0I7QUFDbkIsTUFBRyxJQUFIO0FBQ0EsUUFBSyxtQkFBTCxDQUF5QixVQUF6QixFQUFxQyxPQUFyQztBQUNBOztBQUVELE1BQUksS0FBSyxRQUFMLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ2pDLE1BQUcsSUFBSDtBQUNBLEdBRkQsTUFHSztBQUNKLFFBQUssZ0JBQUwsQ0FBc0IsVUFBdEIsRUFBa0MsT0FBbEM7QUFDQTtBQUNEOztBQUVELEtBQUksQ0FBQyxNQUFNLE9BQU4sQ0FBYyxXQUFkLENBQUwsRUFBaUM7QUFDaEMsaUJBQWUsV0FBZixFQUE0QixRQUE1QjtBQUNBO0FBQ0E7O0FBRUQsS0FBSSxRQUFRLENBQVo7O0FBRUEsVUFBUyxnQkFBVCxHQUE2QjtBQUM1QjtBQUNBLE1BQUksVUFBVSxZQUFZLE1BQTFCLEVBQWtDO0FBQ2pDLFlBQVMsV0FBVDtBQUNBO0FBQ0Q7O0FBRUQsTUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFlBQVksTUFBaEMsRUFBd0MsR0FBeEMsRUFBNkM7QUFDNUMsaUJBQWUsWUFBWSxDQUFaLENBQWYsRUFBK0IsZ0JBQS9CO0FBQ0E7QUFFRCxDQWpDRDs7QUFtQ0EsT0FBTyxPQUFQLEdBQWlCLGFBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1EXG4gICAgICAgIGRlZmluZShbXCJAY2x1YmFqYXgvb25cIl0sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgLy8gTm9kZSAvIENvbW1vbkpTXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdAY2x1YmFqYXgvb24nKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdFsnQmFzZUNvbXBvbmVudCddID0gZmFjdG9yeShyb290Lm9uKTtcbiAgICB9XG5cdH0odGhpcywgZnVuY3Rpb24gKG9uKSB7XG5cInVzZSBzdHJpY3RcIjtcblxuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBCYXNlQ29tcG9uZW50ID0gZnVuY3Rpb24gKF9IVE1MRWxlbWVudCkge1xuXHRfaW5oZXJpdHMoQmFzZUNvbXBvbmVudCwgX0hUTUxFbGVtZW50KTtcblxuXHRmdW5jdGlvbiBCYXNlQ29tcG9uZW50KCkge1xuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCYXNlQ29tcG9uZW50KTtcblxuXHRcdHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChCYXNlQ29tcG9uZW50Ll9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQmFzZUNvbXBvbmVudCkpLmNhbGwodGhpcykpO1xuXG5cdFx0X3RoaXMuX3VpZCA9IHVpZChfdGhpcy5sb2NhbE5hbWUpO1xuXHRcdHByaXZhdGVzW190aGlzLl91aWRdID0geyBET01TVEFURTogJ2NyZWF0ZWQnIH07XG5cdFx0cHJpdmF0ZXNbX3RoaXMuX3VpZF0uaGFuZGxlTGlzdCA9IFtdO1xuXHRcdHBsdWdpbignaW5pdCcsIF90aGlzKTtcblx0XHRyZXR1cm4gX3RoaXM7XG5cdH1cblxuXHRfY3JlYXRlQ2xhc3MoQmFzZUNvbXBvbmVudCwgW3tcblx0XHRrZXk6ICdjb25uZWN0ZWRDYWxsYmFjaycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA/ICdkb21yZWFkeScgOiAnY29ubmVjdGVkJztcblx0XHRcdHBsdWdpbigncHJlQ29ubmVjdGVkJywgdGhpcyk7XG5cdFx0XHRuZXh0VGljayhvbkNoZWNrRG9tUmVhZHkuYmluZCh0aGlzKSk7XG5cdFx0XHRpZiAodGhpcy5jb25uZWN0ZWQpIHtcblx0XHRcdFx0dGhpcy5jb25uZWN0ZWQoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuZmlyZSgnY29ubmVjdGVkJyk7XG5cdFx0XHRwbHVnaW4oJ3Bvc3RDb25uZWN0ZWQnLCB0aGlzKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbkNvbm5lY3RlZCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uQ29ubmVjdGVkKGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnIHx8IHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMub25jZSgnY29ubmVjdGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYWxsYmFjayhfdGhpczIpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb25Eb21SZWFkeScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uRG9tUmVhZHkoY2FsbGJhY2spIHtcblx0XHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5vbmNlKCdkb21yZWFkeScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y2FsbGJhY2soX3RoaXMzKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHR2YXIgX3RoaXM0ID0gdGhpcztcblxuXHRcdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkaXNjb25uZWN0ZWQnO1xuXHRcdFx0cGx1Z2luKCdwcmVEaXNjb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRcdGlmICh0aGlzLmRpc2Nvbm5lY3RlZCkge1xuXHRcdFx0XHR0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5maXJlKCdkaXNjb25uZWN0ZWQnKTtcblxuXHRcdFx0dmFyIHRpbWUgPSB2b2lkIDAsXG5cdFx0XHQgICAgZG9kID0gQmFzZUNvbXBvbmVudC5kZXN0cm95T25EaXNjb25uZWN0O1xuXHRcdFx0aWYgKGRvZCkge1xuXHRcdFx0XHR0aW1lID0gdHlwZW9mIGRvZCA9PT0gJ251bWJlcicgPyBkb2MgOiAzMDA7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmIChfdGhpczQuRE9NU1RBVEUgPT09ICdkaXNjb25uZWN0ZWQnKSB7XG5cdFx0XHRcdFx0XHRfdGhpczQuZGVzdHJveSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdGltZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJOYW1lLCBvbGRWYWwsIG5ld1ZhbCkge1xuXHRcdFx0cGx1Z2luKCdwcmVBdHRyaWJ1dGVDaGFuZ2VkJywgdGhpcywgYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcblx0XHRcdGlmICh0aGlzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcblx0XHRcdFx0dGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZGVzdHJveScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdFx0XHR0aGlzLmZpcmUoJ2Rlc3Ryb3knKTtcblx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcblx0XHRcdFx0aGFuZGxlLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHRfZGVzdHJveSh0aGlzKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdmaXJlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZmlyZShldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG5cdFx0XHRyZXR1cm4gb24uZmlyZSh0aGlzLCBldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdlbWl0Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdvbicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIChfb24pIHtcblx0XHRcdGZ1bmN0aW9uIG9uKF94LCBfeDIsIF94MywgX3g0KSB7XG5cdFx0XHRcdHJldHVybiBfb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdH1cblxuXHRcdFx0b24udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBfb24udG9TdHJpbmcoKTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBvbjtcblx0XHR9KGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUodHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0b24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDogb24odGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvcikpO1xuXHRcdH0pXG5cdH0sIHtcblx0XHRrZXk6ICdvbmNlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gb25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUodHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0b24ub25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykgOiBvbi5vbmNlKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnYXR0cicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWx1ZSwgdG9nZ2xlKSB7XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHR2YXIgYWRkID0gdG9nZ2xlID09PSB1bmRlZmluZWQgPyB0cnVlIDogISF0b2dnbGU7XG5cdFx0XHRpZiAoYWRkKSB7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAncmVnaXN0ZXJIYW5kbGUnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiByZWdpc3RlckhhbmRsZShoYW5kbGUpIHtcblx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG5cdFx0XHRyZXR1cm4gaGFuZGxlO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ0RPTVNUQVRFJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFO1xuXHRcdH1cblx0fV0sIFt7XG5cdFx0a2V5OiAnY2xvbmUnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBjbG9uZSh0ZW1wbGF0ZSkge1xuXHRcdFx0aWYgKHRlbXBsYXRlLmNvbnRlbnQgJiYgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikge1xuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdFx0dmFyIGNsb25lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0Y2xvbmVOb2RlLmlubmVySFRNTCA9IHRlbXBsYXRlLmlubmVySFRNTDtcblxuXHRcdFx0d2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0ZnJhZy5hcHBlbmRDaGlsZChjbG9uZU5vZGUuY2hpbGRyZW5bMF0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZyYWc7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnYWRkUGx1Z2luJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gYWRkUGx1Z2luKHBsdWcpIHtcblx0XHRcdHZhciBpID0gdm9pZCAwLFxuXHRcdFx0ICAgIG9yZGVyID0gcGx1Zy5vcmRlciB8fCAxMDA7XG5cdFx0XHRpZiAoIXBsdWdpbnMubGVuZ3RoKSB7XG5cdFx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHRcdH0gZWxzZSBpZiAocGx1Z2lucy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0aWYgKHBsdWdpbnNbMF0ub3JkZXIgPD0gb3JkZXIpIHtcblx0XHRcdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPiBvcmRlcikge1xuXHRcdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGZvciAoaSA9IDE7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKG9yZGVyID09PSBwbHVnaW5zW2kgLSAxXS5vcmRlciB8fCBvcmRlciA+IHBsdWdpbnNbaSAtIDFdLm9yZGVyICYmIG9yZGVyIDwgcGx1Z2luc1tpXS5vcmRlcikge1xuXHRcdFx0XHRcdFx0cGx1Z2lucy5zcGxpY2UoaSwgMCwgcGx1Zyk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHdhcyBub3QgaW5zZXJ0ZWQuLi5cblx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG5cdFx0XHRwcml2YXRlc1snZGVzdHJveU9uRGlzY29ubmVjdCddID0gdmFsdWU7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBwcml2YXRlc1snZGVzdHJveU9uRGlzY29ubmVjdCddO1xuXHRcdH1cblx0fV0pO1xuXG5cdHJldHVybiBCYXNlQ29tcG9uZW50O1xufShIVE1MRWxlbWVudCk7XG5cbnZhciBwcml2YXRlcyA9IHt9LFxuICAgIHBsdWdpbnMgPSBbXTtcblxuZnVuY3Rpb24gcGx1Z2luKG1ldGhvZCwgbm9kZSwgYSwgYiwgYykge1xuXHRwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWcpIHtcblx0XHRpZiAocGx1Z1ttZXRob2RdKSB7XG5cdFx0XHRwbHVnW21ldGhvZF0obm9kZSwgYSwgYiwgYyk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gb25DaGVja0RvbVJlYWR5KCkge1xuXHRpZiAodGhpcy5ET01TVEFURSAhPT0gJ2Nvbm5lY3RlZCcgfHwgcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNvdW50ID0gMCxcblx0ICAgIGNoaWxkcmVuID0gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyh0aGlzKSxcblx0ICAgIG91ckRvbVJlYWR5ID0gb25TZWxmRG9tUmVhZHkuYmluZCh0aGlzKTtcblxuXHRmdW5jdGlvbiBhZGRSZWFkeSgpIHtcblx0XHRjb3VudCsrO1xuXHRcdGlmIChjb3VudCA9PT0gY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRvdXJEb21SZWFkeSgpO1xuXHRcdH1cblx0fVxuXG5cdC8vIElmIG5vIGNoaWxkcmVuLCB3ZSdyZSBnb29kIC0gbGVhZiBub2RlLiBDb21tZW5jZSB3aXRoIG9uRG9tUmVhZHlcblx0Ly9cblx0aWYgKCFjaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRvdXJEb21SZWFkeSgpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIGVsc2UsIHdhaXQgZm9yIGFsbCBjaGlsZHJlbiB0byBmaXJlIHRoZWlyIGByZWFkeWAgZXZlbnRzXG5cdFx0Ly9cblx0XHRjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0Ly8gY2hlY2sgaWYgY2hpbGQgaXMgYWxyZWFkeSByZWFkeVxuXHRcdFx0Ly8gYWxzbyBjaGVjayBmb3IgY29ubmVjdGVkIC0gdGhpcyBoYW5kbGVzIG1vdmluZyBhIG5vZGUgZnJvbSBhbm90aGVyIG5vZGVcblx0XHRcdC8vIE5PUEUsIHRoYXQgZmFpbGVkLiByZW1vdmVkIGZvciBub3cgY2hpbGQuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnXG5cdFx0XHRpZiAoY2hpbGQuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0YWRkUmVhZHkoKTtcblx0XHRcdH1cblx0XHRcdC8vIGlmIG5vdCwgd2FpdCBmb3IgZXZlbnRcblx0XHRcdGNoaWxkLm9uKCdkb21yZWFkeScsIGFkZFJlYWR5KTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBvblNlbGZEb21SZWFkeSgpIHtcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG5cdC8vIGRvbVJlYWR5IHNob3VsZCBvbmx5IGV2ZXIgZmlyZSBvbmNlXG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG5cdHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcblx0Ly8gY2FsbCB0aGlzLmRvbVJlYWR5IGZpcnN0LCBzbyB0aGF0IHRoZSBjb21wb25lbnRcblx0Ly8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcblx0Ly8gc3Vic2VxdWVudCBldmVudHNcblx0aWYgKHRoaXMuZG9tUmVhZHkpIHtcblx0XHR0aGlzLmRvbVJlYWR5KCk7XG5cdFx0dGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuXHR9XG5cblx0Ly8gYWxsb3cgY29tcG9uZW50IHRvIGZpcmUgdGhpcyBldmVudFxuXHQvLyBkb21SZWFkeSgpIHdpbGwgc3RpbGwgYmUgY2FsbGVkXG5cdGlmICghdGhpcy5maXJlT3duRG9tcmVhZHkpIHtcblx0XHR0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cdH1cblxuXHRwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzKG5vZGUpIHtcblx0Ly8gY29sbGVjdCBhbnkgY2hpbGRyZW4gdGhhdCBhcmUgY3VzdG9tIG5vZGVzXG5cdC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuXHQvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG5cdHZhciBpID0gdm9pZCAwLFxuXHQgICAgbm9kZXMgPSBbXTtcblx0Zm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobm9kZS5jaGlsZHJlbltpXS5ub2RlTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuXHRcdFx0bm9kZXMucHVzaChub2RlLmNoaWxkcmVuW2ldKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayhjYikge1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xufVxuXG52YXIgdWlkcyA9IHt9O1xuZnVuY3Rpb24gdWlkKCkge1xuXHR2YXIgdHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJ3VpZCc7XG5cblx0aWYgKHVpZHNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdHVpZHNbdHlwZV0gPSAwO1xuXHR9XG5cdHZhciBpZCA9IHR5cGUgKyAnLScgKyAodWlkc1t0eXBlXSArIDEpO1xuXHR1aWRzW3R5cGVdKys7XG5cdHJldHVybiBpZDtcbn1cblxudmFyIGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZnVuY3Rpb24gX2Rlc3Ryb3kobm9kZSkge1xuXHRpZiAobm9kZSkge1xuXHRcdGRlc3Ryb3llci5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG5cdH1cbn1cblxud2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZU9yTm9kZXMsIGNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGhhbmRsZURvbVJlYWR5KG5vZGUsIGNiKSB7XG5cdFx0ZnVuY3Rpb24gb25SZWFkeSgpIHtcblx0XHRcdGNiKG5vZGUpO1xuXHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuXHRcdH1cblxuXHRcdGlmIChub2RlLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRjYihub2RlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuXHRcdH1cblx0fVxuXG5cdGlmICghQXJyYXkuaXNBcnJheShub2RlT3JOb2RlcykpIHtcblx0XHRoYW5kbGVEb21SZWFkeShub2RlT3JOb2RlcywgY2FsbGJhY2spO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjb3VudCA9IDA7XG5cblx0ZnVuY3Rpb24gb25BcnJheU5vZGVSZWFkeSgpIHtcblx0XHRjb3VudCsrO1xuXHRcdGlmIChjb3VudCA9PT0gbm9kZU9yTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRjYWxsYmFjayhub2RlT3JOb2Rlcyk7XG5cdFx0fVxuXHR9XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBub2RlT3JOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdGhhbmRsZURvbVJlYWR5KG5vZGVPck5vZGVzW2ldLCBvbkFycmF5Tm9kZVJlYWR5KTtcblx0fVxufTtcblxuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XG5cbmZ1bmN0aW9uIHNldEJvb2xlYW4obm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIG5vZGUuaGFzQXR0cmlidXRlKHByb3ApO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCAnJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcblx0XHRcdH1cblx0XHRcdHZhciBmbiA9IHRoaXNbb25pZnkocHJvcCldO1xuXHRcdFx0aWYgKGZuKSB7XG5cdFx0XHRcdGZuLmNhbGwodGhpcywgdmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnR5KG5vZGUsIHByb3ApIHtcblx0dmFyIHByb3BWYWx1ZSA9IHZvaWQgMDtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBwcm9wVmFsdWUgIT09IHVuZGVmaW5lZCA/IHByb3BWYWx1ZSA6IG5vcm1hbGl6ZSh0aGlzLmdldEF0dHJpYnV0ZShwcm9wKSk7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgdmFsdWUpO1xuXHRcdFx0dmFyIGZuID0gdGhpc1tvbmlmeShwcm9wKV07XG5cdFx0XHRpZiAoZm4pIHtcblx0XHRcdFx0b25Eb21SZWFkeSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHByb3BWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YWx1ZSA9IGZuLmNhbGwoX3RoaXMsIHZhbHVlKSB8fCB2YWx1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdChub2RlLCBwcm9wKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1snX18nICsgcHJvcF07XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuXHRcdFx0dGhpc1snX18nICsgcHJvcF0gPSB2YWx1ZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzKG5vZGUpIHtcblx0dmFyIHByb3BzID0gbm9kZS5wcm9wcyB8fCBub2RlLnByb3BlcnRpZXM7XG5cdGlmIChwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdGlmIChwcm9wID09PSAnZGlzYWJsZWQnKSB7XG5cdFx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZXRQcm9wZXJ0eShub2RlLCBwcm9wKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXRCb29sZWFucyhub2RlKSB7XG5cdHZhciBwcm9wcyA9IG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucztcblx0aWYgKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0Qm9vbGVhbihub2RlLCBwcm9wKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXRPYmplY3RzKG5vZGUpIHtcblx0dmFyIHByb3BzID0gbm9kZS5vYmplY3RzO1xuXHRpZiAocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRzZXRPYmplY3Qobm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY2FwKG5hbWUpIHtcblx0cmV0dXJuIG5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cmluZygxKTtcbn1cblxuZnVuY3Rpb24gb25pZnkobmFtZSkge1xuXHRyZXR1cm4gJ29uJyArIG5hbWUuc3BsaXQoJy0nKS5tYXAoZnVuY3Rpb24gKHdvcmQpIHtcblx0XHRyZXR1cm4gY2FwKHdvcmQpO1xuXHR9KS5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gaXNCb29sKG5vZGUsIG5hbWUpIHtcblx0cmV0dXJuIChub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnMgfHwgW10pLmluZGV4T2YobmFtZSkgPiAtMTtcbn1cblxuZnVuY3Rpb24gYm9vbE5vcm0odmFsdWUpIHtcblx0aWYgKHZhbHVlID09PSAnJykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBub3JtYWxpemUodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBwcm9wTm9ybSh2YWx1ZSkge1xuXHRyZXR1cm4gbm9ybWFsaXplKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplKHZhbCkge1xuXHRpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcblx0XHR2YWwgPSB2YWwudHJpbSgpO1xuXHRcdGlmICh2YWwgPT09ICdmYWxzZScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2UgaWYgKHZhbCA9PT0gJ251bGwnKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9IGVsc2UgaWYgKHZhbCA9PT0gJ3RydWUnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0Ly8gZmluZHMgc3RyaW5ncyB0aGF0IHN0YXJ0IHdpdGggbnVtYmVycywgYnV0IGFyZSBub3QgbnVtYmVyczpcblx0XHQvLyAnMXRlYW0nICcxMjMgU3RyZWV0JywgJzEtMi0zJywgZXRjXG5cdFx0aWYgKCgnJyArIHZhbCkucmVwbGFjZSgvXFxkKi8sICcnKS5sZW5ndGgpIHtcblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fVxuXHR9XG5cdGlmICghaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSkge1xuXHRcdHJldHVybiBwYXJzZUZsb2F0KHZhbCk7XG5cdH1cblx0cmV0dXJuIHZhbDtcbn1cblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuXHRuYW1lOiAncHJvcGVydGllcycsXG5cdG9yZGVyOiAxMCxcblx0aW5pdDogZnVuY3Rpb24gaW5pdChub2RlKSB7XG5cdFx0c2V0UHJvcGVydGllcyhub2RlKTtcblx0XHRzZXRCb29sZWFucyhub2RlKTtcblx0fSxcblx0cHJlQXR0cmlidXRlQ2hhbmdlZDogZnVuY3Rpb24gcHJlQXR0cmlidXRlQ2hhbmdlZChub2RlLCBuYW1lLCB2YWx1ZSkge1xuXHRcdGlmIChub2RlLmlzU2V0dGluZ0F0dHJpYnV0ZSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRpZiAoaXNCb29sKG5vZGUsIG5hbWUpKSB7XG5cdFx0XHR2YWx1ZSA9IGJvb2xOb3JtKHZhbHVlKTtcblx0XHRcdG5vZGVbbmFtZV0gPSAhIXZhbHVlO1xuXHRcdFx0aWYgKCF2YWx1ZSkge1xuXHRcdFx0XHRub2RlW25hbWVdID0gZmFsc2U7XG5cdFx0XHRcdG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdFx0bm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlW25hbWVdID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRub2RlW25hbWVdID0gcHJvcE5vcm0odmFsdWUpO1xuXHR9XG59KTtcdFx0XHRcbn0oKSk7XG5cbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFxuXG52YXIgbGlnaHROb2RlcyA9IHt9O1xudmFyIGluc2VydGVkID0ge307XG5cbmZ1bmN0aW9uIGluc2VydChub2RlKSB7XG4gICAgaWYgKGluc2VydGVkW25vZGUuX3VpZF0gfHwgIWhhc1RlbXBsYXRlKG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29sbGVjdExpZ2h0Tm9kZXMobm9kZSk7XG4gICAgaW5zZXJ0VGVtcGxhdGUobm9kZSk7XG4gICAgaW5zZXJ0ZWRbbm9kZS5fdWlkXSA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RMaWdodE5vZGVzKG5vZGUpIHtcbiAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0gPSBsaWdodE5vZGVzW25vZGUuX3VpZF0gfHwgW107XG4gICAgd2hpbGUgKG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgbGlnaHROb2Rlc1tub2RlLl91aWRdLnB1c2gobm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkTm9kZXNbMF0pKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhc1RlbXBsYXRlKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS50ZW1wbGF0ZVN0cmluZyB8fCBub2RlLnRlbXBsYXRlSWQ7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlQ2hhaW4obm9kZSkge1xuICAgIHZhciB0ZW1wbGF0ZXMgPSBub2RlLmdldFRlbXBsYXRlQ2hhaW4oKTtcbiAgICB0ZW1wbGF0ZXMucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgIGdldENvbnRhaW5lcihub2RlKS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlKSk7XG4gICAgfSk7XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlKG5vZGUpIHtcbiAgICBpZiAobm9kZS5uZXN0ZWRUZW1wbGF0ZSkge1xuICAgICAgICBpbnNlcnRUZW1wbGF0ZUNoYWluKG5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0ZW1wbGF0ZU5vZGUgPSBub2RlLmdldFRlbXBsYXRlTm9kZSgpO1xuXG4gICAgaWYgKHRlbXBsYXRlTm9kZSkge1xuICAgICAgICBub2RlLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGVOb2RlKSk7XG4gICAgfVxuICAgIGluc2VydENoaWxkcmVuKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250YWluZXIobm9kZSkge1xuICAgIHZhciBjb250YWluZXJzID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbcmVmPVwiY29udGFpbmVyXCJdJyk7XG4gICAgaWYgKCFjb250YWluZXJzIHx8ICFjb250YWluZXJzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRhaW5lcnNbY29udGFpbmVycy5sZW5ndGggLSAxXTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0Q2hpbGRyZW4obm9kZSkge1xuICAgIHZhciBpID0gdm9pZCAwO1xuICAgIHZhciBjb250YWluZXIgPSBnZXRDb250YWluZXIobm9kZSk7XG4gICAgdmFyIGNoaWxkcmVuID0gbGlnaHROb2Rlc1tub2RlLl91aWRdO1xuXG4gICAgaWYgKGNvbnRhaW5lciAmJiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0b0RvbShodG1sKSB7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBub2RlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbn1cblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0TGlnaHROb2RlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbGlnaHROb2Rlc1t0aGlzLl91aWRdO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVOb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGNhY2hpbmcgY2F1c2VzIGRpZmZlcmVudCBjbGFzc2VzIHRvIHB1bGwgdGhlIHNhbWUgdGVtcGxhdGUgLSB3YXQ/XG4gICAgLy9pZighdGhpcy50ZW1wbGF0ZU5vZGUpIHtcbiAgICBpZiAodGhpcy50ZW1wbGF0ZUlkKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZW1wbGF0ZUlkLnJlcGxhY2UoJyMnLCAnJykpO1xuICAgIH0gZWxzZSBpZiAodGhpcy50ZW1wbGF0ZVN0cmluZykge1xuICAgICAgICB0aGlzLnRlbXBsYXRlTm9kZSA9IHRvRG9tKCc8dGVtcGxhdGU+JyArIHRoaXMudGVtcGxhdGVTdHJpbmcgKyAnPC90ZW1wbGF0ZT4nKTtcbiAgICB9XG4gICAgLy99XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVOb2RlO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVDaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgdGVtcGxhdGVzID0gW10sXG4gICAgICAgIHRlbXBsYXRlID0gdm9pZCAwO1xuXG4gICAgLy8gd2FsayB0aGUgcHJvdG90eXBlIGNoYWluOyBCYWJlbCBkb2Vzbid0IGFsbG93IHVzaW5nXG4gICAgLy8gYHN1cGVyYCBzaW5jZSB3ZSBhcmUgb3V0c2lkZSBvZiB0aGUgQ2xhc3NcbiAgICB3aGlsZSAoY29udGV4dCkge1xuICAgICAgICBjb250ZXh0ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRleHQpO1xuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNraXAgcHJvdG90eXBlcyB3aXRob3V0IGEgdGVtcGxhdGVcbiAgICAgICAgLy8gKGVsc2UgaXQgd2lsbCBwdWxsIGFuIGluaGVyaXRlZCB0ZW1wbGF0ZSBhbmQgY2F1c2UgZHVwbGljYXRlcylcbiAgICAgICAgaWYgKGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlU3RyaW5nJykgfHwgY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVJZCcpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IGNvbnRleHQuZ2V0VGVtcGxhdGVOb2RlKCk7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMucHVzaCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlcztcbn07XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAndGVtcGxhdGUnLFxuICAgIG9yZGVyOiAyMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIHByZUNvbm5lY3RlZChub2RlKSB7XG4gICAgICAgIGluc2VydChub2RlKTtcbiAgICB9XG59KTtcdFx0XHRcbn0oKSk7XG5cbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxuZnVuY3Rpb24gYXNzaWduUmVmcyhub2RlKSB7XG5cbiAgICBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW3JlZl0nKSkpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhciBuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgY2hpbGQucmVtb3ZlQXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGNoaWxkO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhc3NpZ25FdmVudHMobm9kZSkge1xuICAgIC8vIDxkaXYgb249XCJjbGljazpvbkNsaWNrXCI+XG4gICAgW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tvbl0nKSkpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBpLCBjaGlsZHJlbikge1xuICAgICAgICBpZiAoY2hpbGQgPT09IG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIga2V5VmFsdWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ29uJyksXG4gICAgICAgICAgICBldmVudCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMF0udHJpbSgpLFxuICAgICAgICAgICAgbWV0aG9kID0ga2V5VmFsdWUuc3BsaXQoJzonKVsxXS50cmltKCk7XG4gICAgICAgIC8vIHJlbW92ZSwgc28gcGFyZW50IGRvZXMgbm90IHRyeSB0byB1c2UgaXRcbiAgICAgICAgY2hpbGQucmVtb3ZlQXR0cmlidXRlKCdvbicpO1xuXG4gICAgICAgIG5vZGUub24oY2hpbGQsIGV2ZW50LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbm9kZVttZXRob2RdKGUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICdyZWZzJyxcbiAgICBvcmRlcjogMzAsXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiBwcmVDb25uZWN0ZWQobm9kZSkge1xuICAgICAgICBhc3NpZ25SZWZzKG5vZGUpO1xuICAgICAgICBhc3NpZ25FdmVudHMobm9kZSk7XG4gICAgfVxufSk7XHRcdFx0XG59KCkpO1xuXG5cdHJldHVybiBCYXNlQ29tcG9uZW50O1xuXG59KSk7IiwicmVxdWlyZSgnQGNsdWJhamF4L2N1c3RvbS1lbGVtZW50cy1wb2x5ZmlsbCcpO1xuY29uc3QgQmFzZUNvbXBvbmVudCAgPSByZXF1aXJlKCcuLi8uLi9kaXN0L2luZGV4Jyk7XG5cbmNsYXNzIFRlc3RMaWZlY3ljbGUgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcblxuXHRzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtyZXR1cm4gWydmb28nLCAnYmFyJ107IH1cblxuXHRzZXQgZm9vICh2YWx1ZSkge1xuXHRcdHRoaXMuX19mb28gPSB2YWx1ZTtcblx0fVxuXG5cdGdldCBmb28gKCkge1xuXHRcdHJldHVybiB0aGlzLl9fZm9vO1xuXHR9XG5cblx0c2V0IGJhciAodmFsdWUpIHtcblx0XHR0aGlzLl9fYmFyID0gdmFsdWU7XG5cdH1cblxuXHRnZXQgYmFyICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2JhciB8fCAnTk9UU0VUJztcblx0fVxuXG5cdGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0Y29ubmVjdGVkICgpIHtcblx0XHRvbi5maXJlKGRvY3VtZW50LCAnY29ubmVjdGVkLWNhbGxlZCcsIHRoaXMpO1xuXHR9XG5cblx0ZG9tUmVhZHkgKCkge1xuXHRcdG9uLmZpcmUoZG9jdW1lbnQsICdkb21yZWFkeS1jYWxsZWQnLCB0aGlzKTtcblx0fVxuXG5cdGRpc2Nvbm5lY3RlZCAoKSB7XG5cdFx0b24uZmlyZShkb2N1bWVudCwgJ2Rpc2Nvbm5lY3RlZC1jYWxsZWQnLCB0aGlzKTtcblx0fVxuXG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1saWZlY3ljbGUnLCBUZXN0TGlmZWN5Y2xlKTtcbiIsIi8vd2luZG93Wyduby1uYXRpdmUtc2hpbSddID0gdHJ1ZTtcbnJlcXVpcmUoJ0BjbHViYWpheC9jdXN0b20tZWxlbWVudHMtcG9seWZpbGwnKTtcbndpbmRvdy5vbiA9IHJlcXVpcmUoJ0BjbHViYWpheC9vbicpO1xud2luZG93LmRvbSA9IHJlcXVpcmUoJ0BjbHViYWpheC9kb20nKTsiLCJjb25zdCBvbiA9IHJlcXVpcmUoJ0BjbHViYWpheC9vbicpO1xuXG5jbGFzcyBCYXNlQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRjb25zdHJ1Y3RvciAoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl91aWQgPSB1aWQodGhpcy5sb2NhbE5hbWUpO1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0gPSB7IERPTVNUQVRFOiAnY3JlYXRlZCcgfTtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QgPSBbXTtcblx0XHRwbHVnaW4oJ2luaXQnLCB0aGlzKTtcblx0fVxuXG5cdGNvbm5lY3RlZENhbGxiYWNrICgpIHtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkID8gJ2RvbXJlYWR5JyA6ICdjb25uZWN0ZWQnO1xuXHRcdHBsdWdpbigncHJlQ29ubmVjdGVkJywgdGhpcyk7XG5cdFx0bmV4dFRpY2sob25DaGVja0RvbVJlYWR5LmJpbmQodGhpcykpO1xuXHRcdGlmICh0aGlzLmNvbm5lY3RlZCkge1xuXHRcdFx0dGhpcy5jb25uZWN0ZWQoKTtcblx0XHR9XG5cdFx0dGhpcy5maXJlKCdjb25uZWN0ZWQnKTtcblx0XHRwbHVnaW4oJ3Bvc3RDb25uZWN0ZWQnLCB0aGlzKTtcblx0fVxuXG5cdG9uQ29ubmVjdGVkIChjYWxsYmFjaykge1xuXHRcdGlmICh0aGlzLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJyB8fCB0aGlzLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5vbmNlKCdjb25uZWN0ZWQnLCAoKSA9PiB7XG5cdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHR9KTtcblx0fVxuXG5cdG9uRG9tUmVhZHkgKGNhbGxiYWNrKSB7XG5cdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLm9uY2UoJ2RvbXJlYWR5JywgKCkgPT4ge1xuXHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0fSk7XG5cdH1cblxuXHRkaXNjb25uZWN0ZWRDYWxsYmFjayAoKSB7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkaXNjb25uZWN0ZWQnO1xuXHRcdHBsdWdpbigncHJlRGlzY29ubmVjdGVkJywgdGhpcyk7XG5cdFx0aWYgKHRoaXMuZGlzY29ubmVjdGVkKSB7XG5cdFx0XHR0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuXHRcdH1cblx0XHR0aGlzLmZpcmUoJ2Rpc2Nvbm5lY3RlZCcpO1xuXG5cdFx0bGV0IHRpbWUsIGRvZCA9IEJhc2VDb21wb25lbnQuZGVzdHJveU9uRGlzY29ubmVjdDtcblx0XHRpZiAoZG9kKSB7XG5cdFx0XHR0aW1lID0gdHlwZW9mIGRvZCA9PT0gJ251bWJlcicgPyBkb2MgOiAzMDA7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdkaXNjb25uZWN0ZWQnKSB7XG5cdFx0XHRcdFx0dGhpcy5kZXN0cm95KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRpbWUpO1xuXHRcdH1cblx0fVxuXG5cdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAoYXR0ck5hbWUsIG9sZFZhbCwgbmV3VmFsKSB7XG5cdFx0cGx1Z2luKCdwcmVBdHRyaWJ1dGVDaGFuZ2VkJywgdGhpcywgYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcblx0XHRpZiAodGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKSB7XG5cdFx0XHR0aGlzLmF0dHJpYnV0ZUNoYW5nZWQoYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcblx0XHR9XG5cdH1cblxuXHRkZXN0cm95ICgpIHtcblx0XHR0aGlzLmZpcmUoJ2Rlc3Ryb3knKTtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XG5cdFx0XHRoYW5kbGUucmVtb3ZlKCk7XG5cdFx0fSk7XG5cdFx0ZGVzdHJveSh0aGlzKTtcblx0fVxuXG5cdGZpcmUgKGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcblx0XHRyZXR1cm4gb24uZmlyZSh0aGlzLCBldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKTtcblx0fVxuXG5cdGVtaXQgKGV2ZW50TmFtZSwgdmFsdWUpIHtcblx0XHRyZXR1cm4gb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcblx0fVxuXG5cdG9uIChub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKFxuXHRcdFx0dHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0XHRvbihub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykgOlxuXHRcdFx0XHRvbih0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yKSk7XG5cdH1cblxuXHRvbmNlIChub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKFxuXHRcdFx0dHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0XHRvbi5vbmNlKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG5cdFx0XHRcdG9uLm9uY2UodGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spKTtcblx0fVxuXG5cdGF0dHIgKGtleSwgdmFsdWUsIHRvZ2dsZSkge1xuXHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRjb25zdCBhZGQgPSB0b2dnbGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIXRvZ2dsZTtcblx0XHRpZiAoYWRkKSB7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcblx0XHR9XG5cdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0fVxuXG5cdHJlZ2lzdGVySGFuZGxlIChoYW5kbGUpIHtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QucHVzaChoYW5kbGUpO1xuXHRcdHJldHVybiBoYW5kbGU7XG5cdH1cblxuXHRnZXQgRE9NU1RBVEUgKCkge1xuXHRcdHJldHVybiBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFO1xuXHR9XG5cblx0c3RhdGljIHNldCBkZXN0cm95T25EaXNjb25uZWN0ICh2YWx1ZSkge1xuXHRcdHByaXZhdGVzWydkZXN0cm95T25EaXNjb25uZWN0J10gPSB2YWx1ZTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgZGVzdHJveU9uRGlzY29ubmVjdCAoKSB7XG5cdFx0cmV0dXJuIHByaXZhdGVzWydkZXN0cm95T25EaXNjb25uZWN0J107XG5cdH1cblxuXHRzdGF0aWMgY2xvbmUgKHRlbXBsYXRlKSB7XG5cdFx0aWYgKHRlbXBsYXRlLmNvbnRlbnQgJiYgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG5cdFx0fVxuXHRcdGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0Y29uc3QgY2xvbmVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0Y2xvbmVOb2RlLmlubmVySFRNTCA9IHRlbXBsYXRlLmlubmVySFRNTDtcblxuXHRcdHdoaWxlIChjbG9uZU5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRmcmFnLmFwcGVuZENoaWxkKGNsb25lTm9kZS5jaGlsZHJlblswXSk7XG5cdFx0fVxuXHRcdHJldHVybiBmcmFnO1xuXHR9XG5cblx0c3RhdGljIGFkZFBsdWdpbiAocGx1Zykge1xuXHRcdGxldCBpLCBvcmRlciA9IHBsdWcub3JkZXIgfHwgMTAwO1xuXHRcdGlmICghcGx1Z2lucy5sZW5ndGgpIHtcblx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAocGx1Z2lucy5sZW5ndGggPT09IDEpIHtcblx0XHRcdGlmIChwbHVnaW5zWzBdLm9yZGVyIDw9IG9yZGVyKSB7XG5cdFx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPiBvcmRlcikge1xuXHRcdFx0cGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0Zm9yIChpID0gMTsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKG9yZGVyID09PSBwbHVnaW5zW2kgLSAxXS5vcmRlciB8fCAob3JkZXIgPiBwbHVnaW5zW2kgLSAxXS5vcmRlciAmJiBvcmRlciA8IHBsdWdpbnNbaV0ub3JkZXIpKSB7XG5cdFx0XHRcdFx0cGx1Z2lucy5zcGxpY2UoaSwgMCwgcGx1Zyk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyB3YXMgbm90IGluc2VydGVkLi4uXG5cdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0fVxuXHR9XG59XG5cbmxldFxuXHRwcml2YXRlcyA9IHt9LFxuXHRwbHVnaW5zID0gW107XG5cbmZ1bmN0aW9uIHBsdWdpbiAobWV0aG9kLCBub2RlLCBhLCBiLCBjKSB7XG5cdHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Zykge1xuXHRcdGlmIChwbHVnW21ldGhvZF0pIHtcblx0XHRcdHBsdWdbbWV0aG9kXShub2RlLCBhLCBiLCBjKTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBvbkNoZWNrRG9tUmVhZHkgKCkge1xuXHRpZiAodGhpcy5ET01TVEFURSAhPT0gJ2Nvbm5lY3RlZCcgfHwgcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bGV0XG5cdFx0Y291bnQgPSAwLFxuXHRcdGNoaWxkcmVuID0gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyh0aGlzKSxcblx0XHRvdXJEb21SZWFkeSA9IG9uU2VsZkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cblx0ZnVuY3Rpb24gYWRkUmVhZHkgKCkge1xuXHRcdGNvdW50Kys7XG5cdFx0aWYgKGNvdW50ID09PSBjaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdG91ckRvbVJlYWR5KCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gSWYgbm8gY2hpbGRyZW4sIHdlJ3JlIGdvb2QgLSBsZWFmIG5vZGUuIENvbW1lbmNlIHdpdGggb25Eb21SZWFkeVxuXHQvL1xuXHRpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdG91ckRvbVJlYWR5KCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gZWxzZSwgd2FpdCBmb3IgYWxsIGNoaWxkcmVuIHRvIGZpcmUgdGhlaXIgYHJlYWR5YCBldmVudHNcblx0XHQvL1xuXHRcdGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHQvLyBjaGVjayBpZiBjaGlsZCBpcyBhbHJlYWR5IHJlYWR5XG5cdFx0XHQvLyBhbHNvIGNoZWNrIGZvciBjb25uZWN0ZWQgLSB0aGlzIGhhbmRsZXMgbW92aW5nIGEgbm9kZSBmcm9tIGFub3RoZXIgbm9kZVxuXHRcdFx0Ly8gTk9QRSwgdGhhdCBmYWlsZWQuIHJlbW92ZWQgZm9yIG5vdyBjaGlsZC5ET01TVEFURSA9PT0gJ2Nvbm5lY3RlZCdcblx0XHRcdGlmIChjaGlsZC5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0XHRhZGRSZWFkeSgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYgbm90LCB3YWl0IGZvciBldmVudFxuXHRcdFx0Y2hpbGQub24oJ2RvbXJlYWR5JywgYWRkUmVhZHkpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9uU2VsZkRvbVJlYWR5ICgpIHtcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG5cdC8vIGRvbVJlYWR5IHNob3VsZCBvbmx5IGV2ZXIgZmlyZSBvbmNlXG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG5cdHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcblx0Ly8gY2FsbCB0aGlzLmRvbVJlYWR5IGZpcnN0LCBzbyB0aGF0IHRoZSBjb21wb25lbnRcblx0Ly8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcblx0Ly8gc3Vic2VxdWVudCBldmVudHNcblx0aWYgKHRoaXMuZG9tUmVhZHkpIHtcblx0XHR0aGlzLmRvbVJlYWR5KCk7XG5cdFx0dGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuXHR9XG5cblx0Ly8gYWxsb3cgY29tcG9uZW50IHRvIGZpcmUgdGhpcyBldmVudFxuXHQvLyBkb21SZWFkeSgpIHdpbGwgc3RpbGwgYmUgY2FsbGVkXG5cdGlmICghdGhpcy5maXJlT3duRG9tcmVhZHkpIHtcblx0XHR0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cdH1cblxuXHRwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzIChub2RlKSB7XG5cdC8vIGNvbGxlY3QgYW55IGNoaWxkcmVuIHRoYXQgYXJlIGN1c3RvbSBub2Rlc1xuXHQvLyB1c2VkIHRvIGNoZWNrIGlmIHRoZWlyIGRvbSBpcyByZWFkeSBiZWZvcmVcblx0Ly8gZGV0ZXJtaW5pbmcgaWYgdGhpcyBpcyByZWFkeVxuXHRsZXQgaSwgbm9kZXMgPSBbXTtcblx0Zm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobm9kZS5jaGlsZHJlbltpXS5ub2RlTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuXHRcdFx0bm9kZXMucHVzaChub2RlLmNoaWxkcmVuW2ldKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayAoY2IpIHtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbn1cblxuY29uc3QgdWlkcyA9IHt9O1xuZnVuY3Rpb24gdWlkICh0eXBlID0gJ3VpZCcpIHtcblx0aWYgKHVpZHNbdHlwZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdHVpZHNbdHlwZV0gPSAwO1xuXHR9XG5cdGNvbnN0IGlkID0gdHlwZSArICctJyArICh1aWRzW3R5cGVdICsgMSk7XG5cdHVpZHNbdHlwZV0rKztcblx0cmV0dXJuIGlkO1xufVxuXG5jb25zdCBkZXN0cm95ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmZ1bmN0aW9uIGRlc3Ryb3kgKG5vZGUpIHtcblx0aWYgKG5vZGUpIHtcblx0XHRkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0ZGVzdHJveWVyLmlubmVySFRNTCA9ICcnO1xuXHR9XG59XG5cblxud2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZU9yTm9kZXMsIGNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGhhbmRsZURvbVJlYWR5IChub2RlLCBjYikge1xuXHRcdGZ1bmN0aW9uIG9uUmVhZHkgKCkge1xuXHRcdFx0Y2Iobm9kZSk7XG5cdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG5cdFx0fVxuXG5cdFx0aWYgKG5vZGUuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdGNiKG5vZGUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIUFycmF5LmlzQXJyYXkobm9kZU9yTm9kZXMpKSB7XG5cdFx0aGFuZGxlRG9tUmVhZHkobm9kZU9yTm9kZXMsIGNhbGxiYWNrKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRsZXQgY291bnQgPSAwO1xuXG5cdGZ1bmN0aW9uIG9uQXJyYXlOb2RlUmVhZHkgKCkge1xuXHRcdGNvdW50Kys7XG5cdFx0aWYgKGNvdW50ID09PSBub2RlT3JOb2Rlcy5sZW5ndGgpIHtcblx0XHRcdGNhbGxiYWNrKG5vZGVPck5vZGVzKTtcblx0XHR9XG5cdH1cblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVPck5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aGFuZGxlRG9tUmVhZHkobm9kZU9yTm9kZXNbaV0sIG9uQXJyYXlOb2RlUmVhZHkpO1xuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbXBvbmVudDsiXX0=
