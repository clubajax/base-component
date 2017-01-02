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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = undefined;

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = undefined;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

// class/component rules
// always call super() first in the ctor. This also calls the extended class' ctor.
// cannot call NEW on a Component class

// Classes http://exploringjs.com/es6/ch_classes.html#_the-species-pattern-in-static-methods

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _on = __webpack_require__(1);
var dom = __webpack_require__(0);

var BaseComponent = function (_HTMLElement) {
    _inherits(BaseComponent, _HTMLElement);

    function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));

        _this._uid = dom.uid(_this.localName);
        privates[_this._uid] = { DOMSTATE: 'created' };
        privates[_this._uid].handleList = [];
        plugin('init', _this);
        return _this;
    }

    _createClass(BaseComponent, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            privates[this._uid].DOMSTATE = 'connected';
            plugin('preConnected', this);
            nextTick(onCheckDomReady.bind(this));
            if (this.connected) {
                this.connected();
            }
            this.fire('connected');
            plugin('postConnected', this);
        }
    }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
            privates[this._uid].DOMSTATE = 'disconnected';
            plugin('preDisconnected', this);
            if (this.disconnected) {
                this.disconnected();
            }
            this.fire('disconnected');
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
            dom.destroy(this);
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
            return this.registerHandle(typeof node != 'string' ? // no node is supplied
            _on(node, eventName, selector, callback) : _on(this, node, eventName, selector));
        }
    }, {
        key: 'once',
        value: function once(node, eventName, selector, callback) {
            return this.registerHandle(typeof node != 'string' ? // no node is supplied
            _on.once(node, eventName, selector, callback) : _on.once(this, node, eventName, selector, callback));
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
            var frag = document.createDocumentFragment(),
                cloneNode = document.createElement('div');
            cloneNode.innerHTML = template.innerHTML;

            while (cloneNode.children.length) {
                frag.appendChild(cloneNode.children[0]);
            }
            return frag;
        }
    }, {
        key: 'addPlugin',
        value: function addPlugin(plug) {
            var i,
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
    if (this.DOMSTATE != 'connected' || privates[this._uid].domReadyFired) {
        return;
    }

    var count = 0,
        children = getChildCustomNodes(this),
        ourDomReady = onDomReady.bind(this);

    function addReady() {
        count++;
        if (count == children.length) {
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
            if (child.DOMSTATE == 'domready') {
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

    this.fire('domready');

    plugin('postDomReady', this);
}

function getChildCustomNodes(node) {
    // collect any children that are custom nodes
    // used to check if their dom is ready before
    // determining if this is ready
    var i,
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

window.onDomReady = function (node, callback) {
    function onReady() {
        callback(node);
        node.removeEventListener('domready', onReady);
    }
    if (node.DOMSTATE === 'domready') {
        callback(node);
    } else {
        node.addEventListener('domready', onReady);
    }
};

exports.default = BaseComponent;

/***/ }
/******/ ]);
//# sourceMappingURL=basecomponent.js.map