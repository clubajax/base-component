(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BaseComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"@clubajax/on":"@clubajax/on"}],2:[function(require,module,exports){
'use strict';

var on = require('@clubajax/on');
var BaseComponent = require('./BaseComponent');
require('./properties');
require('./template');
require('./refs');
//const itemTemplate = require('./item-template');

module.exports = BaseComponent;

},{"./BaseComponent":1,"./properties":3,"./refs":4,"./template":5,"@clubajax/on":"@clubajax/on"}],3:[function(require,module,exports){
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

},{"./BaseComponent":1}],4:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

},{"./BaseComponent":1}],5:[function(require,module,exports){
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

},{"./BaseComponent":1}]},{},[2])(2)
});