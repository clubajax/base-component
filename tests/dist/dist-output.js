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
				if (('' + val).replace(/-?\d*\.?\d*/, '').length) {
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

function makeGlobalListeners(name, eventName) {
	window[name] = function (nodeOrNodes, callback) {
		function handleDomReady(node, cb) {
			function onReady() {
				cb(node);
				node.removeEventListener(eventName, onReady);
			}

			if (node.DOMSTATE === eventName) {
				cb(node);
			} else {
				node.addEventListener(eventName, onReady);
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
}

makeGlobalListeners('onDomReady', 'domready');
makeGlobalListeners('onConnected', 'connected');

module.exports = BaseComponent;

},{"@clubajax/on":"@clubajax/on"}]},{},[3,2])("BaseComponent")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwidGVzdHMvc3JjL2Rpc3QtdGVzdC5qcyIsInRlc3RzL3NyYy9nbG9iYWxzLmpzIiwic3JjL0Jhc2VDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUMsV0FBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCO0FBQ3RCLEtBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDNUM7QUFDQSxTQUFPLENBQUMsY0FBRCxDQUFQLEVBQXlCLE9BQXpCO0FBQ0gsRUFIRCxNQUdPLElBQUksUUFBTyxNQUFQLHlDQUFPLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEIsT0FBTyxPQUF6QyxFQUFrRDtBQUNyRDtBQUNBLFNBQU8sT0FBUCxHQUFpQixRQUFRLFFBQVEsY0FBUixDQUFSLENBQWpCO0FBQ0gsRUFITSxNQUdBO0FBQ0g7QUFDQSxPQUFLLGVBQUwsSUFBd0IsUUFBUSxLQUFLLEVBQWIsQ0FBeEI7QUFDSDtBQUNILENBWEQsYUFXUSxVQUFVLEVBQVYsRUFBYztBQUN2Qjs7QUFHQSxLQUFJLGVBQWUsWUFBWTtBQUFFLFdBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsS0FBbEMsRUFBeUM7QUFBRSxRQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUFFLFFBQUksYUFBYSxNQUFNLENBQU4sQ0FBakIsQ0FBMkIsV0FBVyxVQUFYLEdBQXdCLFdBQVcsVUFBWCxJQUF5QixLQUFqRCxDQUF3RCxXQUFXLFlBQVgsR0FBMEIsSUFBMUIsQ0FBZ0MsSUFBSSxXQUFXLFVBQWYsRUFBMkIsV0FBVyxRQUFYLEdBQXNCLElBQXRCLENBQTRCLE9BQU8sY0FBUCxDQUFzQixNQUF0QixFQUE4QixXQUFXLEdBQXpDLEVBQThDLFVBQTlDO0FBQTREO0FBQUUs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b290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRFxuICAgICAgICBkZWZpbmUoW1wiQGNsdWJhamF4L29uXCJdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIC8vIE5vZGUgLyBDb21tb25KU1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnQGNsdWJhamF4L29uJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgICAgIHJvb3RbJ0Jhc2VDb21wb25lbnQnXSA9IGZhY3Rvcnkocm9vdC5vbik7XG4gICAgfVxuXHR9KHRoaXMsIGZ1bmN0aW9uIChvbikge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgQmFzZUNvbXBvbmVudCA9IGZ1bmN0aW9uIChfSFRNTEVsZW1lbnQpIHtcblx0X2luaGVyaXRzKEJhc2VDb21wb25lbnQsIF9IVE1MRWxlbWVudCk7XG5cblx0ZnVuY3Rpb24gQmFzZUNvbXBvbmVudCgpIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFzZUNvbXBvbmVudCk7XG5cblx0XHR2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQmFzZUNvbXBvbmVudC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEJhc2VDb21wb25lbnQpKS5jYWxsKHRoaXMpKTtcblxuXHRcdF90aGlzLl91aWQgPSB1aWQoX3RoaXMubG9jYWxOYW1lKTtcblx0XHRwcml2YXRlc1tfdGhpcy5fdWlkXSA9IHsgRE9NU1RBVEU6ICdjcmVhdGVkJyB9O1xuXHRcdHByaXZhdGVzW190aGlzLl91aWRdLmhhbmRsZUxpc3QgPSBbXTtcblx0XHRwbHVnaW4oJ2luaXQnLCBfdGhpcyk7XG5cdFx0cmV0dXJuIF90aGlzO1xuXHR9XG5cblx0X2NyZWF0ZUNsYXNzKEJhc2VDb21wb25lbnQsIFt7XG5cdFx0a2V5OiAnY29ubmVjdGVkQ2FsbGJhY2snLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPyAnZG9tcmVhZHknIDogJ2Nvbm5lY3RlZCc7XG5cdFx0XHRwbHVnaW4oJ3ByZUNvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdFx0bmV4dFRpY2sob25DaGVja0RvbVJlYWR5LmJpbmQodGhpcykpO1xuXHRcdFx0aWYgKHRoaXMuY29ubmVjdGVkKSB7XG5cdFx0XHRcdHRoaXMuY29ubmVjdGVkKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmZpcmUoJ2Nvbm5lY3RlZCcpO1xuXHRcdFx0cGx1Z2luKCdwb3N0Q29ubmVjdGVkJywgdGhpcyk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb25Db25uZWN0ZWQnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvbkNvbm5lY3RlZChjYWxsYmFjaykge1xuXHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdGlmICh0aGlzLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJyB8fCB0aGlzLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLm9uY2UoJ2Nvbm5lY3RlZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y2FsbGJhY2soX3RoaXMyKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ29uRG9tUmVhZHknLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvbkRvbVJlYWR5KGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgX3RoaXMzID0gdGhpcztcblxuXHRcdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMub25jZSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrKF90aGlzMyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdkaXNjb25uZWN0ZWRDYWxsYmFjaycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0dmFyIF90aGlzNCA9IHRoaXM7XG5cblx0XHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZGlzY29ubmVjdGVkJztcblx0XHRcdHBsdWdpbigncHJlRGlzY29ubmVjdGVkJywgdGhpcyk7XG5cdFx0XHRpZiAodGhpcy5kaXNjb25uZWN0ZWQpIHtcblx0XHRcdFx0dGhpcy5kaXNjb25uZWN0ZWQoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuZmlyZSgnZGlzY29ubmVjdGVkJyk7XG5cblx0XHRcdHZhciB0aW1lID0gdm9pZCAwLFxuXHRcdFx0ICAgIGRvZCA9IEJhc2VDb21wb25lbnQuZGVzdHJveU9uRGlzY29ubmVjdDtcblx0XHRcdGlmIChkb2QpIHtcblx0XHRcdFx0dGltZSA9IHR5cGVvZiBkb2QgPT09ICdudW1iZXInID8gZG9jIDogMzAwO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoX3RoaXM0LkRPTVNUQVRFID09PSAnZGlzY29ubmVjdGVkJykge1xuXHRcdFx0XHRcdFx0X3RoaXM0LmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHRpbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcblx0XHRcdHBsdWdpbigncHJlQXR0cmlidXRlQ2hhbmdlZCcsIHRoaXMsIGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0XHRpZiAodGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKSB7XG5cdFx0XHRcdHRoaXMuYXR0cmlidXRlQ2hhbmdlZChhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2Rlc3Ryb3knLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHRcdFx0dGhpcy5maXJlKCdkZXN0cm95Jyk7XG5cdFx0XHRwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XG5cdFx0XHRcdGhhbmRsZS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0X2Rlc3Ryb3kodGhpcyk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZmlyZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGZpcmUoZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcykge1xuXHRcdFx0cmV0dXJuIG9uLmZpcmUodGhpcywgZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcyk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZW1pdCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGVtaXQoZXZlbnROYW1lLCB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIG9uLmVtaXQodGhpcywgZXZlbnROYW1lLCB2YWx1ZSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb24nLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiAoX29uKSB7XG5cdFx0XHRmdW5jdGlvbiBvbihfeCwgX3gyLCBfeDMsIF94NCkge1xuXHRcdFx0XHRyZXR1cm4gX29uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHR9XG5cblx0XHRcdG9uLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gX29uLnRvU3RyaW5nKCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gb247XG5cdFx0fShmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcblx0XHRcdHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKHR5cGVvZiBub2RlICE9PSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcblx0XHRcdG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6IG9uKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IpKTtcblx0XHR9KVxuXHR9LCB7XG5cdFx0a2V5OiAnb25jZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcblx0XHRcdHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKHR5cGVvZiBub2RlICE9PSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcblx0XHRcdG9uLm9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDogb24ub25jZSh0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2F0dHInLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBhdHRyKGtleSwgdmFsdWUsIHRvZ2dsZSkge1xuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0dmFyIGFkZCA9IHRvZ2dsZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6ICEhdG9nZ2xlO1xuXHRcdFx0aWYgKGFkZCkge1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKGtleSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3JlZ2lzdGVySGFuZGxlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gcmVnaXN0ZXJIYW5kbGUoaGFuZGxlKSB7XG5cdFx0XHRwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QucHVzaChoYW5kbGUpO1xuXHRcdFx0cmV0dXJuIGhhbmRsZTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdET01TVEFURScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURTtcblx0XHR9XG5cdH1dLCBbe1xuXHRcdGtleTogJ2Nsb25lJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gY2xvbmUodGVtcGxhdGUpIHtcblx0XHRcdGlmICh0ZW1wbGF0ZS5jb250ZW50ICYmIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pIHtcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRcdHZhciBjbG9uZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGNsb25lTm9kZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZS5pbm5lckhUTUw7XG5cblx0XHRcdHdoaWxlIChjbG9uZU5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmVOb2RlLmNoaWxkcmVuWzBdKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFnO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2FkZFBsdWdpbicsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGFkZFBsdWdpbihwbHVnKSB7XG5cdFx0XHR2YXIgaSA9IHZvaWQgMCxcblx0XHRcdCAgICBvcmRlciA9IHBsdWcub3JkZXIgfHwgMTAwO1xuXHRcdFx0aWYgKCFwbHVnaW5zLmxlbmd0aCkge1xuXHRcdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0XHR9IGVsc2UgaWYgKHBsdWdpbnMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdGlmIChwbHVnaW5zWzBdLm9yZGVyIDw9IG9yZGVyKSB7XG5cdFx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChwbHVnaW5zWzBdLm9yZGVyID4gb3JkZXIpIHtcblx0XHRcdFx0cGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmIChvcmRlciA9PT0gcGx1Z2luc1tpIC0gMV0ub3JkZXIgfHwgb3JkZXIgPiBwbHVnaW5zW2kgLSAxXS5vcmRlciAmJiBvcmRlciA8IHBsdWdpbnNbaV0ub3JkZXIpIHtcblx0XHRcdFx0XHRcdHBsdWdpbnMuc3BsaWNlKGksIDAsIHBsdWcpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyB3YXMgbm90IGluc2VydGVkLi4uXG5cdFx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdkZXN0cm95T25EaXNjb25uZWN0Jyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuXHRcdFx0cHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXSA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gcHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXTtcblx0XHR9XG5cdH1dKTtcblxuXHRyZXR1cm4gQmFzZUNvbXBvbmVudDtcbn0oSFRNTEVsZW1lbnQpO1xuXG52YXIgcHJpdmF0ZXMgPSB7fSxcbiAgICBwbHVnaW5zID0gW107XG5cbmZ1bmN0aW9uIHBsdWdpbihtZXRob2QsIG5vZGUsIGEsIGIsIGMpIHtcblx0cGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnKSB7XG5cdFx0aWYgKHBsdWdbbWV0aG9kXSkge1xuXHRcdFx0cGx1Z1ttZXRob2RdKG5vZGUsIGEsIGIsIGMpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hlY2tEb21SZWFkeSgpIHtcblx0aWYgKHRoaXMuRE9NU1RBVEUgIT09ICdjb25uZWN0ZWQnIHx8IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjb3VudCA9IDAsXG5cdCAgICBjaGlsZHJlbiA9IGdldENoaWxkQ3VzdG9tTm9kZXModGhpcyksXG5cdCAgICBvdXJEb21SZWFkeSA9IG9uU2VsZkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cblx0ZnVuY3Rpb24gYWRkUmVhZHkoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IGNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0b3VyRG9tUmVhZHkoKTtcblx0XHR9XG5cdH1cblxuXHQvLyBJZiBubyBjaGlsZHJlbiwgd2UncmUgZ29vZCAtIGxlYWYgbm9kZS4gQ29tbWVuY2Ugd2l0aCBvbkRvbVJlYWR5XG5cdC8vXG5cdGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0b3VyRG9tUmVhZHkoKTtcblx0fSBlbHNlIHtcblx0XHQvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuXHRcdC8vXG5cdFx0Y2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdC8vIGNoZWNrIGlmIGNoaWxkIGlzIGFscmVhZHkgcmVhZHlcblx0XHRcdC8vIGFsc28gY2hlY2sgZm9yIGNvbm5lY3RlZCAtIHRoaXMgaGFuZGxlcyBtb3ZpbmcgYSBub2RlIGZyb20gYW5vdGhlciBub2RlXG5cdFx0XHQvLyBOT1BFLCB0aGF0IGZhaWxlZC4gcmVtb3ZlZCBmb3Igbm93IGNoaWxkLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJ1xuXHRcdFx0aWYgKGNoaWxkLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGFkZFJlYWR5KCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiBub3QsIHdhaXQgZm9yIGV2ZW50XG5cdFx0XHRjaGlsZC5vbignZG9tcmVhZHknLCBhZGRSZWFkeSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gb25TZWxmRG9tUmVhZHkoKSB7XG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZG9tcmVhZHknO1xuXHQvLyBkb21SZWFkeSBzaG91bGQgb25seSBldmVyIGZpcmUgb25jZVxuXHRwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPSB0cnVlO1xuXHRwbHVnaW4oJ3ByZURvbVJlYWR5JywgdGhpcyk7XG5cdC8vIGNhbGwgdGhpcy5kb21SZWFkeSBmaXJzdCwgc28gdGhhdCB0aGUgY29tcG9uZW50XG5cdC8vIGNhbiBmaW5pc2ggaW5pdGlhbGl6aW5nIGJlZm9yZSBmaXJpbmcgYW55XG5cdC8vIHN1YnNlcXVlbnQgZXZlbnRzXG5cdGlmICh0aGlzLmRvbVJlYWR5KSB7XG5cdFx0dGhpcy5kb21SZWFkeSgpO1xuXHRcdHRoaXMuZG9tUmVhZHkgPSBmdW5jdGlvbiAoKSB7fTtcblx0fVxuXG5cdC8vIGFsbG93IGNvbXBvbmVudCB0byBmaXJlIHRoaXMgZXZlbnRcblx0Ly8gZG9tUmVhZHkoKSB3aWxsIHN0aWxsIGJlIGNhbGxlZFxuXHRpZiAoIXRoaXMuZmlyZU93bkRvbXJlYWR5KSB7XG5cdFx0dGhpcy5maXJlKCdkb21yZWFkeScpO1xuXHR9XG5cblx0cGx1Z2luKCdwb3N0RG9tUmVhZHknLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyhub2RlKSB7XG5cdC8vIGNvbGxlY3QgYW55IGNoaWxkcmVuIHRoYXQgYXJlIGN1c3RvbSBub2Rlc1xuXHQvLyB1c2VkIHRvIGNoZWNrIGlmIHRoZWlyIGRvbSBpcyByZWFkeSBiZWZvcmVcblx0Ly8gZGV0ZXJtaW5pbmcgaWYgdGhpcyBpcyByZWFkeVxuXHR2YXIgaSA9IHZvaWQgMCxcblx0ICAgIG5vZGVzID0gW107XG5cdGZvciAoaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKG5vZGUuY2hpbGRyZW5baV0ubm9kZU5hbWUuaW5kZXhPZignLScpID4gLTEpIHtcblx0XHRcdG5vZGVzLnB1c2gobm9kZS5jaGlsZHJlbltpXSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBub2Rlcztcbn1cblxuZnVuY3Rpb24gbmV4dFRpY2soY2IpIHtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbn1cblxudmFyIHVpZHMgPSB7fTtcbmZ1bmN0aW9uIHVpZCgpIHtcblx0dmFyIHR5cGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6ICd1aWQnO1xuXG5cdGlmICh1aWRzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcblx0XHR1aWRzW3R5cGVdID0gMDtcblx0fVxuXHR2YXIgaWQgPSB0eXBlICsgJy0nICsgKHVpZHNbdHlwZV0gKyAxKTtcblx0dWlkc1t0eXBlXSsrO1xuXHRyZXR1cm4gaWQ7XG59XG5cbnZhciBkZXN0cm95ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmZ1bmN0aW9uIF9kZXN0cm95KG5vZGUpIHtcblx0aWYgKG5vZGUpIHtcblx0XHRkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0ZGVzdHJveWVyLmlubmVySFRNTCA9ICcnO1xuXHR9XG59XG5cbndpbmRvdy5vbkRvbVJlYWR5ID0gZnVuY3Rpb24gKG5vZGVPck5vZGVzLCBjYWxsYmFjaykge1xuXHRmdW5jdGlvbiBoYW5kbGVEb21SZWFkeShub2RlLCBjYikge1xuXHRcdGZ1bmN0aW9uIG9uUmVhZHkoKSB7XG5cdFx0XHRjYihub2RlKTtcblx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcblx0XHR9XG5cblx0XHRpZiAobm9kZS5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0Y2Iobm9kZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIUFycmF5LmlzQXJyYXkobm9kZU9yTm9kZXMpKSB7XG5cdFx0aGFuZGxlRG9tUmVhZHkobm9kZU9yTm9kZXMsIGNhbGxiYWNrKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgY291bnQgPSAwO1xuXG5cdGZ1bmN0aW9uIG9uQXJyYXlOb2RlUmVhZHkoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IG5vZGVPck5vZGVzLmxlbmd0aCkge1xuXHRcdFx0Y2FsbGJhY2sobm9kZU9yTm9kZXMpO1xuXHRcdH1cblx0fVxuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZU9yTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRoYW5kbGVEb21SZWFkeShub2RlT3JOb2Rlc1tpXSwgb25BcnJheU5vZGVSZWFkeSk7XG5cdH1cbn07XG5cbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFxuXG5mdW5jdGlvbiBzZXRCb29sZWFuKG5vZGUsIHByb3ApIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBub2RlLmhhc0F0dHJpYnV0ZShwcm9wKTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgJycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZm4gPSB0aGlzW29uaWZ5KHByb3ApXTtcblx0XHRcdGlmIChmbikge1xuXHRcdFx0XHRmbi5jYWxsKHRoaXMsIHZhbHVlKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShub2RlLCBwcm9wKSB7XG5cdHZhciBwcm9wVmFsdWUgPSB2b2lkIDA7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gcHJvcFZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wVmFsdWUgOiBub3JtYWxpemUodGhpcy5nZXRBdHRyaWJ1dGUocHJvcCkpO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKHByb3AsIHZhbHVlKTtcblx0XHRcdHZhciBmbiA9IHRoaXNbb25pZnkocHJvcCldO1xuXHRcdFx0aWYgKGZuKSB7XG5cdFx0XHRcdG9uRG9tUmVhZHkodGhpcywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRwcm9wVmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFsdWUgPSBmbi5jYWxsKF90aGlzLCB2YWx1ZSkgfHwgdmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRPYmplY3Qobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJ19fJyArIHByb3BdO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcblx0XHRcdHRoaXNbJ19fJyArIHByb3BdID0gdmFsdWU7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0UHJvcGVydGllcyhub2RlKSB7XG5cdHZhciBwcm9wcyA9IG5vZGUucHJvcHMgfHwgbm9kZS5wcm9wZXJ0aWVzO1xuXHRpZiAocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRpZiAocHJvcCA9PT0gJ2Rpc2FibGVkJykge1xuXHRcdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2V0UHJvcGVydHkobm9kZSwgcHJvcCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0Qm9vbGVhbnMobm9kZSkge1xuXHR2YXIgcHJvcHMgPSBub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnM7XG5cdGlmIChwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0T2JqZWN0cyhub2RlKSB7XG5cdHZhciBwcm9wcyA9IG5vZGUub2JqZWN0cztcblx0aWYgKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0T2JqZWN0KG5vZGUsIHByb3ApO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNhcChuYW1lKSB7XG5cdHJldHVybiBuYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHJpbmcoMSk7XG59XG5cbmZ1bmN0aW9uIG9uaWZ5KG5hbWUpIHtcblx0cmV0dXJuICdvbicgKyBuYW1lLnNwbGl0KCctJykubWFwKGZ1bmN0aW9uICh3b3JkKSB7XG5cdFx0cmV0dXJuIGNhcCh3b3JkKTtcblx0fSkuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGlzQm9vbChub2RlLCBuYW1lKSB7XG5cdHJldHVybiAobm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zIHx8IFtdKS5pbmRleE9mKG5hbWUpID4gLTE7XG59XG5cbmZ1bmN0aW9uIGJvb2xOb3JtKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSA9PT0gJycpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gbm9ybWFsaXplKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcHJvcE5vcm0odmFsdWUpIHtcblx0cmV0dXJuIG5vcm1hbGl6ZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWwpIHtcblx0aWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG5cdFx0dmFsID0gdmFsLnRyaW0oKTtcblx0XHRpZiAodmFsID09PSAnZmFsc2UnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSBlbHNlIGlmICh2YWwgPT09ICdudWxsJykge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSBlbHNlIGlmICh2YWwgPT09ICd0cnVlJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdC8vIGZpbmRzIHN0cmluZ3MgdGhhdCBzdGFydCB3aXRoIG51bWJlcnMsIGJ1dCBhcmUgbm90IG51bWJlcnM6XG5cdFx0Ly8gJzF0ZWFtJyAnMTIzIFN0cmVldCcsICcxLTItMycsIGV0Y1xuXHRcdGlmICgoJycgKyB2YWwpLnJlcGxhY2UoLy0/XFxkKlxcLj9cXGQqLywgJycpLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHZhbDtcblx0XHR9XG5cdH1cblx0aWYgKCFpc05hTihwYXJzZUZsb2F0KHZhbCkpKSB7XG5cdFx0cmV0dXJuIHBhcnNlRmxvYXQodmFsKTtcblx0fVxuXHRyZXR1cm4gdmFsO1xufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG5cdG5hbWU6ICdwcm9wZXJ0aWVzJyxcblx0b3JkZXI6IDEwLFxuXHRpbml0OiBmdW5jdGlvbiBpbml0KG5vZGUpIHtcblx0XHRzZXRQcm9wZXJ0aWVzKG5vZGUpO1xuXHRcdHNldEJvb2xlYW5zKG5vZGUpO1xuXHR9LFxuXHRwcmVBdHRyaWJ1dGVDaGFuZ2VkOiBmdW5jdGlvbiBwcmVBdHRyaWJ1dGVDaGFuZ2VkKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGlmIChpc0Jvb2wobm9kZSwgbmFtZSkpIHtcblx0XHRcdHZhbHVlID0gYm9vbE5vcm0odmFsdWUpO1xuXHRcdFx0bm9kZVtuYW1lXSA9ICEhdmFsdWU7XG5cdFx0XHRpZiAoIXZhbHVlKSB7XG5cdFx0XHRcdG5vZGVbbmFtZV0gPSBmYWxzZTtcblx0XHRcdFx0bm9kZS5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0XHRub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHRcdFx0bm9kZS5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGVbbmFtZV0gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5vZGVbbmFtZV0gPSBwcm9wTm9ybSh2YWx1ZSk7XG5cdH1cbn0pO1x0XHRcdFxufSgpKTtcblxuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XG5cbnZhciBsaWdodE5vZGVzID0ge307XG52YXIgaW5zZXJ0ZWQgPSB7fTtcblxuZnVuY3Rpb24gaW5zZXJ0KG5vZGUpIHtcbiAgICBpZiAoaW5zZXJ0ZWRbbm9kZS5fdWlkXSB8fCAhaGFzVGVtcGxhdGUobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKTtcbiAgICBpbnNlcnRUZW1wbGF0ZShub2RlKTtcbiAgICBpbnNlcnRlZFtub2RlLl91aWRdID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdExpZ2h0Tm9kZXMobm9kZSkge1xuICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSB8fCBbXTtcbiAgICB3aGlsZSAobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0ucHVzaChub2RlLnJlbW92ZUNoaWxkKG5vZGUuY2hpbGROb2Rlc1swXSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFzVGVtcGxhdGUobm9kZSkge1xuICAgIHJldHVybiBub2RlLnRlbXBsYXRlU3RyaW5nIHx8IG5vZGUudGVtcGxhdGVJZDtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGVDaGFpbihub2RlKSB7XG4gICAgdmFyIHRlbXBsYXRlcyA9IG5vZGUuZ2V0VGVtcGxhdGVDaGFpbigpO1xuICAgIHRlbXBsYXRlcy5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgZ2V0Q29udGFpbmVyKG5vZGUpLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGUpKTtcbiAgICB9KTtcbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGUobm9kZSkge1xuICAgIGlmIChub2RlLm5lc3RlZFRlbXBsYXRlKSB7XG4gICAgICAgIGluc2VydFRlbXBsYXRlQ2hhaW4obm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRlbXBsYXRlTm9kZSA9IG5vZGUuZ2V0VGVtcGxhdGVOb2RlKCk7XG5cbiAgICBpZiAodGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoQmFzZUNvbXBvbmVudC5jbG9uZSh0ZW1wbGF0ZU5vZGUpKTtcbiAgICB9XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRhaW5lcihub2RlKSB7XG4gICAgdmFyIGNvbnRhaW5lcnMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWY9XCJjb250YWluZXJcIl0nKTtcbiAgICBpZiAoIWNvbnRhaW5lcnMgfHwgIWNvbnRhaW5lcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyc1tjb250YWluZXJzLmxlbmd0aCAtIDFdO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRDaGlsZHJlbihub2RlKSB7XG4gICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgdmFyIGNvbnRhaW5lciA9IGdldENvbnRhaW5lcihub2RlKTtcbiAgICB2YXIgY2hpbGRyZW4gPSBsaWdodE5vZGVzW25vZGUuX3VpZF07XG5cbiAgICBpZiAoY29udGFpbmVyICYmIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRvRG9tKGh0bWwpIHtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRMaWdodE5vZGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsaWdodE5vZGVzW3RoaXMuX3VpZF07XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZU5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2FjaGluZyBjYXVzZXMgZGlmZmVyZW50IGNsYXNzZXMgdG8gcHVsbCB0aGUgc2FtZSB0ZW1wbGF0ZSAtIHdhdD9cbiAgICAvL2lmKCF0aGlzLnRlbXBsYXRlTm9kZSkge1xuICAgIGlmICh0aGlzLnRlbXBsYXRlSWQpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRlbXBsYXRlSWQucmVwbGFjZSgnIycsICcnKSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRlbXBsYXRlU3RyaW5nKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gdG9Eb20oJzx0ZW1wbGF0ZT4nICsgdGhpcy50ZW1wbGF0ZVN0cmluZyArICc8L3RlbXBsYXRlPicpO1xuICAgIH1cbiAgICAvL31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZU5vZGU7XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZUNoYWluID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICB0ZW1wbGF0ZXMgPSBbXSxcbiAgICAgICAgdGVtcGxhdGUgPSB2b2lkIDA7XG5cbiAgICAvLyB3YWxrIHRoZSBwcm90b3R5cGUgY2hhaW47IEJhYmVsIGRvZXNuJ3QgYWxsb3cgdXNpbmdcbiAgICAvLyBgc3VwZXJgIHNpbmNlIHdlIGFyZSBvdXRzaWRlIG9mIHRoZSBDbGFzc1xuICAgIHdoaWxlIChjb250ZXh0KSB7XG4gICAgICAgIGNvbnRleHQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udGV4dCk7XG4gICAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2tpcCBwcm90b3R5cGVzIHdpdGhvdXQgYSB0ZW1wbGF0ZVxuICAgICAgICAvLyAoZWxzZSBpdCB3aWxsIHB1bGwgYW4gaW5oZXJpdGVkIHRlbXBsYXRlIGFuZCBjYXVzZSBkdXBsaWNhdGVzKVxuICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVTdHJpbmcnKSB8fCBjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZUlkJykpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gY29udGV4dC5nZXRUZW1wbGF0ZU5vZGUoKTtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5wdXNoKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGVzO1xufTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICd0ZW1wbGF0ZScsXG4gICAgb3JkZXI6IDIwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gcHJlQ29ubmVjdGVkKG5vZGUpIHtcbiAgICAgICAgaW5zZXJ0KG5vZGUpO1xuICAgIH1cbn0pO1x0XHRcdFxufSgpKTtcblxuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG5mdW5jdGlvbiBhc3NpZ25SZWZzKG5vZGUpIHtcblxuICAgIFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkobm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbcmVmXScpKSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICBjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICBub2RlW25hbWVdID0gY2hpbGQ7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbkV2ZW50cyhub2RlKSB7XG4gICAgLy8gPGRpdiBvbj1cImNsaWNrOm9uQ2xpY2tcIj5cbiAgICBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW29uXScpKSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGksIGNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChjaGlsZCA9PT0gbm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlWYWx1ZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnb24nKSxcbiAgICAgICAgICAgIGV2ZW50ID0ga2V5VmFsdWUuc3BsaXQoJzonKVswXS50cmltKCksXG4gICAgICAgICAgICBtZXRob2QgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzFdLnRyaW0oKTtcbiAgICAgICAgLy8gcmVtb3ZlLCBzbyBwYXJlbnQgZG9lcyBub3QgdHJ5IHRvIHVzZSBpdFxuICAgICAgICBjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ29uJyk7XG5cbiAgICAgICAgbm9kZS5vbihjaGlsZCwgZXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBub2RlW21ldGhvZF0oZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3JlZnMnLFxuICAgIG9yZGVyOiAzMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIHByZUNvbm5lY3RlZChub2RlKSB7XG4gICAgICAgIGFzc2lnblJlZnMobm9kZSk7XG4gICAgICAgIGFzc2lnbkV2ZW50cyhub2RlKTtcbiAgICB9XG59KTtcdFx0XHRcbn0oKSk7XG5cblx0cmV0dXJuIEJhc2VDb21wb25lbnQ7XG5cbn0pKTsiLCJyZXF1aXJlKCdAY2x1YmFqYXgvY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsJyk7XG5jb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4uLy4uL2Rpc3QvaW5kZXgnKTtcblxuY2xhc3MgVGVzdExpZmVjeWNsZSBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge3JldHVybiBbJ2ZvbycsICdiYXInXTsgfVxuXG5cdHNldCBmb28gKHZhbHVlKSB7XG5cdFx0dGhpcy5fX2ZvbyA9IHZhbHVlO1xuXHR9XG5cblx0Z2V0IGZvbyAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19mb287XG5cdH1cblxuXHRzZXQgYmFyICh2YWx1ZSkge1xuXHRcdHRoaXMuX19iYXIgPSB2YWx1ZTtcblx0fVxuXG5cdGdldCBiYXIgKCkge1xuXHRcdHJldHVybiB0aGlzLl9fYmFyIHx8ICdOT1RTRVQnO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoLi4uYXJncykge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRjb25uZWN0ZWQgKCkge1xuXHRcdG9uLmZpcmUoZG9jdW1lbnQsICdjb25uZWN0ZWQtY2FsbGVkJywgdGhpcyk7XG5cdH1cblxuXHRkb21SZWFkeSAoKSB7XG5cdFx0b24uZmlyZShkb2N1bWVudCwgJ2RvbXJlYWR5LWNhbGxlZCcsIHRoaXMpO1xuXHR9XG5cblx0ZGlzY29ubmVjdGVkICgpIHtcblx0XHRvbi5maXJlKGRvY3VtZW50LCAnZGlzY29ubmVjdGVkLWNhbGxlZCcsIHRoaXMpO1xuXHR9XG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWxpZmVjeWNsZScsIFRlc3RMaWZlY3ljbGUpO1xuIiwiLy93aW5kb3dbJ25vLW5hdGl2ZS1zaGltJ10gPSB0cnVlO1xucmVxdWlyZSgnQGNsdWJhamF4L2N1c3RvbS1lbGVtZW50cy1wb2x5ZmlsbCcpO1xud2luZG93Lm9uID0gcmVxdWlyZSgnQGNsdWJhamF4L29uJyk7XG53aW5kb3cuZG9tID0gcmVxdWlyZSgnQGNsdWJhamF4L2RvbScpOyIsImNvbnN0IG9uID0gcmVxdWlyZSgnQGNsdWJhamF4L29uJyk7XG5cbmNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdGNvbnN0cnVjdG9yICgpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuX3VpZCA9IHVpZCh0aGlzLmxvY2FsTmFtZSk7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXSA9IHsgRE9NU1RBVEU6ICdjcmVhdGVkJyB9O1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdCA9IFtdO1xuXHRcdHBsdWdpbignaW5pdCcsIHRoaXMpO1xuXHR9XG5cblx0Y29ubmVjdGVkQ2FsbGJhY2sgKCkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPyAnZG9tcmVhZHknIDogJ2Nvbm5lY3RlZCc7XG5cdFx0cGx1Z2luKCdwcmVDb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRuZXh0VGljayhvbkNoZWNrRG9tUmVhZHkuYmluZCh0aGlzKSk7XG5cdFx0aWYgKHRoaXMuY29ubmVjdGVkKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZCgpO1xuXHRcdH1cblx0XHR0aGlzLmZpcmUoJ2Nvbm5lY3RlZCcpO1xuXHRcdHBsdWdpbigncG9zdENvbm5lY3RlZCcsIHRoaXMpO1xuXHR9XG5cblx0b25Db25uZWN0ZWQgKGNhbGxiYWNrKSB7XG5cdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnIHx8IHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLm9uY2UoJ2Nvbm5lY3RlZCcsICgpID0+IHtcblx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0b25Eb21SZWFkeSAoY2FsbGJhY2spIHtcblx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMub25jZSgnZG9tcmVhZHknLCAoKSA9PiB7XG5cdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHR9KTtcblx0fVxuXG5cdGRpc2Nvbm5lY3RlZENhbGxiYWNrICgpIHtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG5cdFx0cGx1Z2luKCdwcmVEaXNjb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRpZiAodGhpcy5kaXNjb25uZWN0ZWQpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkKCk7XG5cdFx0fVxuXHRcdHRoaXMuZmlyZSgnZGlzY29ubmVjdGVkJyk7XG5cblx0XHRsZXQgdGltZSwgZG9kID0gQmFzZUNvbXBvbmVudC5kZXN0cm95T25EaXNjb25uZWN0O1xuXHRcdGlmIChkb2QpIHtcblx0XHRcdHRpbWUgPSB0eXBlb2YgZG9kID09PSAnbnVtYmVyJyA/IGRvYyA6IDMwMDtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2Rpc2Nvbm5lY3RlZCcpIHtcblx0XHRcdFx0XHR0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGltZSk7XG5cdFx0fVxuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIChhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcblx0XHRwbHVnaW4oJ3ByZUF0dHJpYnV0ZUNoYW5nZWQnLCB0aGlzLCBhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdGlmICh0aGlzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcblx0XHRcdHRoaXMuYXR0cmlidXRlQ2hhbmdlZChhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdH1cblx0fVxuXG5cdGRlc3Ryb3kgKCkge1xuXHRcdHRoaXMuZmlyZSgnZGVzdHJveScpO1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcblx0XHRcdGhhbmRsZS5yZW1vdmUoKTtcblx0XHR9KTtcblx0XHRkZXN0cm95KHRoaXMpO1xuXHR9XG5cblx0ZmlyZSAoZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcykge1xuXHRcdHJldHVybiBvbi5maXJlKHRoaXMsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpO1xuXHR9XG5cblx0ZW1pdCAoZXZlbnROYW1lLCB2YWx1ZSkge1xuXHRcdHJldHVybiBvbi5lbWl0KHRoaXMsIGV2ZW50TmFtZSwgdmFsdWUpO1xuXHR9XG5cblx0b24gKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG5cdFx0XHR0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRcdG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG5cdFx0XHRcdG9uKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IpKTtcblx0fVxuXG5cdG9uY2UgKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG5cdFx0XHR0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRcdG9uLm9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcblx0XHRcdFx0b24ub25jZSh0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykpO1xuXHR9XG5cblx0YXR0ciAoa2V5LCB2YWx1ZSwgdG9nZ2xlKSB7XG5cdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdGNvbnN0IGFkZCA9IHRvZ2dsZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6ICEhdG9nZ2xlO1xuXHRcdGlmIChhZGQpIHtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuXHRcdH1cblx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHR9XG5cblx0cmVnaXN0ZXJIYW5kbGUgKGhhbmRsZSkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG5cdFx0cmV0dXJuIGhhbmRsZTtcblx0fVxuXG5cdGdldCBET01TVEFURSAoKSB7XG5cdFx0cmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG5cdH1cblxuXHRzdGF0aWMgc2V0IGRlc3Ryb3lPbkRpc2Nvbm5lY3QgKHZhbHVlKSB7XG5cdFx0cHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXSA9IHZhbHVlO1xuXHR9XG5cblx0c3RhdGljIGdldCBkZXN0cm95T25EaXNjb25uZWN0ICgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXTtcblx0fVxuXG5cdHN0YXRpYyBjbG9uZSAodGVtcGxhdGUpIHtcblx0XHRpZiAodGVtcGxhdGUuY29udGVudCAmJiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcblx0XHR9XG5cdFx0Y29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRjb25zdCBjbG9uZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG5cdFx0d2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmVOb2RlLmNoaWxkcmVuWzBdKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZyYWc7XG5cdH1cblxuXHRzdGF0aWMgYWRkUGx1Z2luIChwbHVnKSB7XG5cdFx0bGV0IGksIG9yZGVyID0gcGx1Zy5vcmRlciB8fCAxMDA7XG5cdFx0aWYgKCFwbHVnaW5zLmxlbmd0aCkge1xuXHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0aWYgKHBsdWdpbnNbMF0ub3JkZXIgPD0gb3JkZXIpIHtcblx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAocGx1Z2luc1swXS5vcmRlciA+IG9yZGVyKSB7XG5cdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXG5cdFx0XHRmb3IgKGkgPSAxOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAob3JkZXIgPT09IHBsdWdpbnNbaSAtIDFdLm9yZGVyIHx8IChvcmRlciA+IHBsdWdpbnNbaSAtIDFdLm9yZGVyICYmIG9yZGVyIDwgcGx1Z2luc1tpXS5vcmRlcikpIHtcblx0XHRcdFx0XHRwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIHdhcyBub3QgaW5zZXJ0ZWQuLi5cblx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHR9XG5cdH1cbn1cblxubGV0XG5cdHByaXZhdGVzID0ge30sXG5cdHBsdWdpbnMgPSBbXTtcblxuZnVuY3Rpb24gcGx1Z2luIChtZXRob2QsIG5vZGUsIGEsIGIsIGMpIHtcblx0cGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnKSB7XG5cdFx0aWYgKHBsdWdbbWV0aG9kXSkge1xuXHRcdFx0cGx1Z1ttZXRob2RdKG5vZGUsIGEsIGIsIGMpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hlY2tEb21SZWFkeSAoKSB7XG5cdGlmICh0aGlzLkRPTVNUQVRFICE9PSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRsZXRcblx0XHRjb3VudCA9IDAsXG5cdFx0Y2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuXHRcdG91ckRvbVJlYWR5ID0gb25TZWxmRG9tUmVhZHkuYmluZCh0aGlzKTtcblxuXHRmdW5jdGlvbiBhZGRSZWFkeSAoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IGNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0b3VyRG9tUmVhZHkoKTtcblx0XHR9XG5cdH1cblxuXHQvLyBJZiBubyBjaGlsZHJlbiwgd2UncmUgZ29vZCAtIGxlYWYgbm9kZS4gQ29tbWVuY2Ugd2l0aCBvbkRvbVJlYWR5XG5cdC8vXG5cdGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0b3VyRG9tUmVhZHkoKTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuXHRcdC8vXG5cdFx0Y2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdC8vIGNoZWNrIGlmIGNoaWxkIGlzIGFscmVhZHkgcmVhZHlcblx0XHRcdC8vIGFsc28gY2hlY2sgZm9yIGNvbm5lY3RlZCAtIHRoaXMgaGFuZGxlcyBtb3ZpbmcgYSBub2RlIGZyb20gYW5vdGhlciBub2RlXG5cdFx0XHQvLyBOT1BFLCB0aGF0IGZhaWxlZC4gcmVtb3ZlZCBmb3Igbm93IGNoaWxkLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJ1xuXHRcdFx0aWYgKGNoaWxkLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGFkZFJlYWR5KCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiBub3QsIHdhaXQgZm9yIGV2ZW50XG5cdFx0XHRjaGlsZC5vbignZG9tcmVhZHknLCBhZGRSZWFkeSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gb25TZWxmRG9tUmVhZHkgKCkge1xuXHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2RvbXJlYWR5Jztcblx0Ly8gZG9tUmVhZHkgc2hvdWxkIG9ubHkgZXZlciBmaXJlIG9uY2Vcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkID0gdHJ1ZTtcblx0cGx1Z2luKCdwcmVEb21SZWFkeScsIHRoaXMpO1xuXHQvLyBjYWxsIHRoaXMuZG9tUmVhZHkgZmlyc3QsIHNvIHRoYXQgdGhlIGNvbXBvbmVudFxuXHQvLyBjYW4gZmluaXNoIGluaXRpYWxpemluZyBiZWZvcmUgZmlyaW5nIGFueVxuXHQvLyBzdWJzZXF1ZW50IGV2ZW50c1xuXHRpZiAodGhpcy5kb21SZWFkeSkge1xuXHRcdHRoaXMuZG9tUmVhZHkoKTtcblx0XHR0aGlzLmRvbVJlYWR5ID0gZnVuY3Rpb24gKCkge307XG5cdH1cblxuXHQvLyBhbGxvdyBjb21wb25lbnQgdG8gZmlyZSB0aGlzIGV2ZW50XG5cdC8vIGRvbVJlYWR5KCkgd2lsbCBzdGlsbCBiZSBjYWxsZWRcblx0aWYgKCF0aGlzLmZpcmVPd25Eb21yZWFkeSkge1xuXHRcdHRoaXMuZmlyZSgnZG9tcmVhZHknKTtcblx0fVxuXG5cdHBsdWdpbigncG9zdERvbVJlYWR5JywgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkQ3VzdG9tTm9kZXMgKG5vZGUpIHtcblx0Ly8gY29sbGVjdCBhbnkgY2hpbGRyZW4gdGhhdCBhcmUgY3VzdG9tIG5vZGVzXG5cdC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuXHQvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG5cdGxldCBpLCBub2RlcyA9IFtdO1xuXHRmb3IgKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChub2RlLmNoaWxkcmVuW2ldLm5vZGVOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG5cdFx0XHRub2Rlcy5wdXNoKG5vZGUuY2hpbGRyZW5baV0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbm9kZXM7XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrIChjYikge1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xufVxuXG5jb25zdCB1aWRzID0ge307XG5mdW5jdGlvbiB1aWQgKHR5cGUgPSAndWlkJykge1xuXHRpZiAodWlkc1t0eXBlXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dWlkc1t0eXBlXSA9IDA7XG5cdH1cblx0Y29uc3QgaWQgPSB0eXBlICsgJy0nICsgKHVpZHNbdHlwZV0gKyAxKTtcblx0dWlkc1t0eXBlXSsrO1xuXHRyZXR1cm4gaWQ7XG59XG5cbmNvbnN0IGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZnVuY3Rpb24gZGVzdHJveSAobm9kZSkge1xuXHRpZiAobm9kZSkge1xuXHRcdGRlc3Ryb3llci5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFrZUdsb2JhbExpc3RlbmVycyAobmFtZSwgZXZlbnROYW1lKSB7XG5cdHdpbmRvd1tuYW1lXSA9IGZ1bmN0aW9uIChub2RlT3JOb2RlcywgY2FsbGJhY2spIHtcblx0XHRmdW5jdGlvbiBoYW5kbGVEb21SZWFkeSAobm9kZSwgY2IpIHtcblx0XHRcdGZ1bmN0aW9uIG9uUmVhZHkgKCkge1xuXHRcdFx0XHRjYihub2RlKTtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25SZWFkeSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChub2RlLkRPTVNUQVRFID09PSBldmVudE5hbWUpIHtcblx0XHRcdFx0Y2Iobm9kZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25SZWFkeSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KG5vZGVPck5vZGVzKSkge1xuXHRcdFx0aGFuZGxlRG9tUmVhZHkobm9kZU9yTm9kZXMsIGNhbGxiYWNrKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgY291bnQgPSAwO1xuXG5cdFx0ZnVuY3Rpb24gb25BcnJheU5vZGVSZWFkeSAoKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdFx0aWYgKGNvdW50ID09PSBub2RlT3JOb2Rlcy5sZW5ndGgpIHtcblx0XHRcdFx0Y2FsbGJhY2sobm9kZU9yTm9kZXMpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZU9yTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGhhbmRsZURvbVJlYWR5KG5vZGVPck5vZGVzW2ldLCBvbkFycmF5Tm9kZVJlYWR5KTtcblx0XHR9XG5cdH07XG59XG5cbm1ha2VHbG9iYWxMaXN0ZW5lcnMoJ29uRG9tUmVhZHknLCAnZG9tcmVhZHknKTtcbm1ha2VHbG9iYWxMaXN0ZW5lcnMoJ29uQ29ubmVjdGVkJywgJ2Nvbm5lY3RlZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VDb21wb25lbnQ7Il19
