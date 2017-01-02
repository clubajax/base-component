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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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

var _on = __webpack_require__(6);
var dom = __webpack_require__(1);

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

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = undefined;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseComponent = __webpack_require__(0);

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = __webpack_require__(1);

function walkDom(node, refs) {

    if (node.attributes) {
        for (var i = 0; i < node.attributes.length; i++) {
            if (/\{\{/.test(node.attributes[i].value)) {
                refs.attributes = refs.attributes || {};
                // could be more than one??
                // same with node?
                refs.attributes[node.attributes[i].name] = node;
            }
        }
    }

    if (!node.children.length) {
        if (/\{\{/.test(node.innerHTML)) {
            refs[node.innerHTML.replace('{{', '').replace('}}', '')] = node;
            node.innerHTML = '';
        }
        return;
    }
    for (var _i = 0; _i < node.children.length; _i++) {
        walkDom(node.children[_i], refs);
    }
}

function updateItemTemplate(frag) {
    var refs = {};
    walkDom(frag, refs);
    return refs;
}

_BaseComponent2.default.prototype.renderList = function (items, container, itemTemplate) {
    var frag = document.createDocumentFragment(),
        tmpl = itemTemplate || this.itemTemplate,
        refs = tmpl.itemRefs,
        clone = void 0;

    items.forEach(function (item) {
        Object.keys(item).forEach(function (key) {
            if (refs[key]) {
                refs[key].innerHTML = item[key];
            }
        });
        if (refs.attributes) {
            Object.keys(refs.attributes).forEach(function (name) {
                var node = refs.attributes[name];
                node.setAttribute(name, item[name]);
            });
        }

        clone = tmpl.cloneNode(true);
        frag.appendChild(clone);
    });

    container.appendChild(frag);
};

_BaseComponent2.default.addPlugin({
    name: 'item-template',
    order: 40,
    preDomReady: function preDomReady(node) {
        node.itemTemplate = dom.query(node, 'template');
        if (node.itemTemplate) {
            node.itemTemplate.parentNode.removeChild(node.itemTemplate);
            node.itemTemplate = _BaseComponent2.default.clone(node.itemTemplate);
            node.itemTemplate.itemRefs = updateItemTemplate(node.itemTemplate);
        }
    }
});

exports.default = {};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseComponent = __webpack_require__(0);

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = __webpack_require__(1);

function setBoolean(node, prop) {
    Object.defineProperty(node, prop, {
        enumerable: true,
        get: function get() {
            if (node.hasAttribute(prop)) {
                return dom.normalize(node.getAttribute(prop));
            }
            return false;
        },
        set: function set(value) {
            if (value) {
                this.setAttribute(prop, '');
            } else {
                this.removeAttribute(prop);
            }
        }
    });
}

function setProperty(node, prop) {
    Object.defineProperty(node, prop, {
        enumerable: true,
        get: function get() {
            return dom.normalize(this.getAttribute(prop));
        },
        set: function set(value) {
            this.setAttribute(prop, value);
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

_BaseComponent2.default.addPlugin({
    name: 'properties',
    order: 10,
    init: function init(node) {
        setProperties(node);
        setBooleans(node);
    },
    preAttributeChanged: function preAttributeChanged(node, name, value) {
        this[name] = dom.normalize(value);
        if (!value && (node.bools || node.booleans || []).indexOf(name)) {
            node.removeAttribute(name);
        }
    }
});

exports.default = {};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseComponent = __webpack_require__(0);

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function assignRefs(node) {
    dom.queryAll(node, '[ref]').forEach(function (child) {
        var name = child.getAttribute('ref');
        node[name] = child;
    });
}

function assignEvents(node) {
    // <div on="click:onClick">
    dom.queryAll(node, '[on]').forEach(function (child) {
        var keyValue = child.getAttribute('on'),
            event = keyValue.split(':')[0].trim(),
            method = keyValue.split(':')[1].trim();
        node.on(child, event, function (e) {
            node[method](e);
        });
    });
}

_BaseComponent2.default.addPlugin({
    name: 'refs',
    order: 30,
    preConnected: function preConnected(node) {
        assignRefs(node);
        assignEvents(node);
    }
});

exports.default = {};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseComponent = __webpack_require__(0);

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = __webpack_require__(1);

var lightNodes = {},
    inserted = {};

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
    return !!node.getTemplateNode();
}

function insertTemplateChain(node) {
    var templates = node.getTemplateChain();
    templates.reverse().forEach(function (template) {
        getContainer(node).appendChild(_BaseComponent2.default.clone(template));
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
        node.appendChild(_BaseComponent2.default.clone(templateNode));
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
    var i,
        container = getContainer(node),
        children = lightNodes[node._uid];

    if (container && children && children.length) {
        for (i = 0; i < children.length; i++) {
            container.appendChild(children[i]);
        }
    }
}

_BaseComponent2.default.prototype.getLightNodes = function () {
    return lightNodes[this._uid];
};

_BaseComponent2.default.prototype.getTemplateNode = function () {
    // caching causes different classes to pull the same template - wat?
    //if(!this.templateNode) {
    if (this.templateId) {
        this.templateNode = dom.byId(this.templateId.replace('#', ''));
    } else if (this.templateString) {
        this.templateNode = dom.toDom('<template>' + this.templateString + '</template>');
    }
    //}
    return this.templateNode;
};

_BaseComponent2.default.prototype.getTemplateChain = function () {

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

_BaseComponent2.default.addPlugin({
    name: 'template',
    order: 20,
    preConnected: function preConnected(node) {
        insert(node);
    }
});

exports.default = {};

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = undefined;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseComponent10 = __webpack_require__(0);

var _BaseComponent11 = _interopRequireDefault(_BaseComponent10);

var _properties = __webpack_require__(3);

var _properties2 = _interopRequireDefault(_properties);

var _template = __webpack_require__(5);

var _template2 = _interopRequireDefault(_template);

var _refs = __webpack_require__(4);

var _refs2 = _interopRequireDefault(_refs);

var _itemTemplate = __webpack_require__(2);

var _itemTemplate2 = _interopRequireDefault(_itemTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TestProps = function (_BaseComponent) {
    _inherits(TestProps, _BaseComponent);

    function TestProps() {
        _classCallCheck(this, TestProps);

        return _possibleConstructorReturn(this, (TestProps.__proto__ || Object.getPrototypeOf(TestProps)).apply(this, arguments));
    }

    _createClass(TestProps, [{
        key: 'attributeChanged',
        value: function attributeChanged(name, value) {
            //console.log('CHG', name, value);
            //this[name] = dom.normalize(value);
            this[name + '-changed'] = dom.normalize(value);
        }
    }, {
        key: 'props',
        get: function get() {
            return ['foo', 'bar'];
        }
    }, {
        key: 'bools',
        get: function get() {
            return ['nbc', 'cbs'];
        }
    }], [{
        key: 'observedAttributes',
        get: function get() {
            return ['foo', 'bar', 'nbc', 'cbs', 'disabled'];
        }
    }]);

    return TestProps;
}(_BaseComponent11.default);

customElements.define('test-props', TestProps);

var TestLifecycle = function (_BaseComponent2) {
    _inherits(TestLifecycle, _BaseComponent2);

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
}(_BaseComponent11.default);

customElements.define('test-lifecycle', TestLifecycle);

_BaseComponent11.default.addPlugin({
    init: function init(node, a, b, c) {
        on.fire(document, 'init-called');
    },
    preConnected: function preConnected(node, a, b, c) {
        on.fire(document, 'preConnected-called');
    },
    postConnected: function postConnected(node, a, b, c) {
        on.fire(document, 'postConnected-called');
    },
    preDomReady: function preDomReady(node, a, b, c) {
        on.fire(document, 'preDomReady-called');
    },
    postDomReady: function postDomReady(node, a, b, c) {
        on.fire(document, 'postDomReady-called');
    }
});

var TestTmplString = function (_BaseComponent3) {
    _inherits(TestTmplString, _BaseComponent3);

    function TestTmplString() {
        _classCallCheck(this, TestTmplString);

        return _possibleConstructorReturn(this, (TestTmplString.__proto__ || Object.getPrototypeOf(TestTmplString)).apply(this, arguments));
    }

    _createClass(TestTmplString, [{
        key: 'templateString',
        get: function get() {
            return '<div>This is a simple template</div>';
        }
    }]);

    return TestTmplString;
}(_BaseComponent11.default);

customElements.define('test-tmpl-string', TestTmplString);

var TestTmplId = function (_BaseComponent4) {
    _inherits(TestTmplId, _BaseComponent4);

    function TestTmplId() {
        _classCallCheck(this, TestTmplId);

        return _possibleConstructorReturn(this, (TestTmplId.__proto__ || Object.getPrototypeOf(TestTmplId)).apply(this, arguments));
    }

    _createClass(TestTmplId, [{
        key: 'templateId',
        get: function get() {
            return 'test-tmpl-id-template';
        }
    }]);

    return TestTmplId;
}(_BaseComponent11.default);

customElements.define('test-tmpl-id', TestTmplId);

var TestTmplRefs = function (_BaseComponent5) {
    _inherits(TestTmplRefs, _BaseComponent5);

    function TestTmplRefs() {
        _classCallCheck(this, TestTmplRefs);

        return _possibleConstructorReturn(this, (TestTmplRefs.__proto__ || Object.getPrototypeOf(TestTmplRefs)).apply(this, arguments));
    }

    _createClass(TestTmplRefs, [{
        key: 'onClick',
        value: function onClick() {
            on.fire(document, 'ref-click-called');
        }
    }, {
        key: 'templateString',
        get: function get() {
            return '<div on="click:onClick" ref="clickNode">\n            <label ref="labelNode">label:</label>\n            <span ref="valueNode">value</span>\n        </div>';
        }
    }]);

    return TestTmplRefs;
}(_BaseComponent11.default);

customElements.define('test-tmpl-refs', TestTmplRefs);

var TestTmplContainer = function (_BaseComponent6) {
    _inherits(TestTmplContainer, _BaseComponent6);

    function TestTmplContainer() {
        _classCallCheck(this, TestTmplContainer);

        return _possibleConstructorReturn(this, (TestTmplContainer.__proto__ || Object.getPrototypeOf(TestTmplContainer)).apply(this, arguments));
    }

    _createClass(TestTmplContainer, [{
        key: 'templateString',
        get: function get() {
            return '<div>\n            <label ref="labelNode">label:</label>\n            <span ref="valueNode">value</span>\n            <div ref="container"></div>\n        </div>';
        }
    }]);

    return TestTmplContainer;
}(_BaseComponent11.default);

customElements.define('test-tmpl-container', TestTmplContainer);

// simple nested templates

var TestTmplNestedA = function (_BaseComponent7) {
    _inherits(TestTmplNestedA, _BaseComponent7);

    function TestTmplNestedA() {
        _classCallCheck(this, TestTmplNestedA);

        var _this7 = _possibleConstructorReturn(this, (TestTmplNestedA.__proto__ || Object.getPrototypeOf(TestTmplNestedA)).call(this));

        _this7.nestedTemplate = true;
        return _this7;
    }

    _createClass(TestTmplNestedA, [{
        key: 'templateString',
        get: function get() {
            return '<section>\n            <div>content A before</div>\n            <section ref="container"></section>\n            <div>content A after</div>\n        </section>';
        }
    }]);

    return TestTmplNestedA;
}(_BaseComponent11.default);

customElements.define('test-tmpl-nested-a', TestTmplNestedA);

var TestTmplNestedB = function (_TestTmplNestedA) {
    _inherits(TestTmplNestedB, _TestTmplNestedA);

    function TestTmplNestedB() {
        _classCallCheck(this, TestTmplNestedB);

        return _possibleConstructorReturn(this, (TestTmplNestedB.__proto__ || Object.getPrototypeOf(TestTmplNestedB)).call(this));
    }

    _createClass(TestTmplNestedB, [{
        key: 'templateString',
        get: function get() {
            return '<div>content B</div>';
        }
    }]);

    return TestTmplNestedB;
}(TestTmplNestedA);

customElements.define('test-tmpl-nested-b', TestTmplNestedB);

// nested plus light dom

var TestTmplNestedC = function (_TestTmplNestedA2) {
    _inherits(TestTmplNestedC, _TestTmplNestedA2);

    function TestTmplNestedC() {
        _classCallCheck(this, TestTmplNestedC);

        return _possibleConstructorReturn(this, (TestTmplNestedC.__proto__ || Object.getPrototypeOf(TestTmplNestedC)).call(this));
    }

    _createClass(TestTmplNestedC, [{
        key: 'templateString',
        get: function get() {
            return '<section>\n            <div>content C before</div>\n            <div ref="container"></div>\n            <div>content C after</div>\n        </section>';
        }
    }]);

    return TestTmplNestedC;
}(TestTmplNestedA);

customElements.define('test-tmpl-nested-c', TestTmplNestedC);

// 5-deep nested templates

var TestA = function (_BaseComponent8) {
    _inherits(TestA, _BaseComponent8);

    function TestA() {
        _classCallCheck(this, TestA);

        return _possibleConstructorReturn(this, (TestA.__proto__ || Object.getPrototypeOf(TestA)).apply(this, arguments));
    }

    return TestA;
}(_BaseComponent11.default);

var TestB = function (_TestA) {
    _inherits(TestB, _TestA);

    function TestB() {
        _classCallCheck(this, TestB);

        return _possibleConstructorReturn(this, (TestB.__proto__ || Object.getPrototypeOf(TestB)).call(this));
    }

    _createClass(TestB, [{
        key: 'templateString',
        get: function get() {
            return '<section>\n            <div>content B before</div>\n            <section ref="container"></section>\n            <div>content B after</div>\n        </section>';
        }
    }]);

    return TestB;
}(TestA);

var TestC = function (_TestB) {
    _inherits(TestC, _TestB);

    function TestC() {
        _classCallCheck(this, TestC);

        return _possibleConstructorReturn(this, (TestC.__proto__ || Object.getPrototypeOf(TestC)).apply(this, arguments));
    }

    return TestC;
}(TestB);

var TestD = function (_TestC) {
    _inherits(TestD, _TestC);

    function TestD() {
        _classCallCheck(this, TestD);

        return _possibleConstructorReturn(this, (TestD.__proto__ || Object.getPrototypeOf(TestD)).call(this));
    }

    _createClass(TestD, [{
        key: 'templateString',
        get: function get() {
            return '<div>content D</div>';
        }
    }]);

    return TestD;
}(TestC);

var TestE = function (_TestD) {
    _inherits(TestE, _TestD);

    function TestE() {
        _classCallCheck(this, TestE);

        var _this14 = _possibleConstructorReturn(this, (TestE.__proto__ || Object.getPrototypeOf(TestE)).call(this));

        _this14.nestedTemplate = true;
        return _this14;
    }

    return TestE;
}(TestD);

customElements.define('test-a', TestA);
customElements.define('test-b', TestB);
customElements.define('test-c', TestC);
customElements.define('test-d', TestD);
customElements.define('test-e', TestE);

window.itemTemplateString = '<template>\n    <div id="{{id}}">\n        <span>{{first}}</span>\n        <span>{{last}}</span>\n        <span>{{role}}</span>\n    </div>\n</template>';

var TestList = function (_BaseComponent9) {
    _inherits(TestList, _BaseComponent9);

    _createClass(TestList, [{
        key: 'props',
        get: function get() {
            return ['list-title'];
        }
    }], [{
        key: 'observedAttributes',
        get: function get() {
            return ['list-title'];
        }
    }]);

    function TestList() {
        _classCallCheck(this, TestList);

        return _possibleConstructorReturn(this, (TestList.__proto__ || Object.getPrototypeOf(TestList)).call(this));
    }

    _createClass(TestList, [{
        key: 'domReady',
        value: function domReady() {
            this.titleNode.innerHTML = this['list-title'];
        }
    }, {
        key: 'templateString',
        get: function get() {
            return '\n            <div class="title" ref="titleNode"></div>\n            <div ref="container"></div>';
        }
    }, {
        key: 'data',
        set: function set(items) {
            this.renderList(items, this.container);
        }
    }]);

    return TestList;
}(_BaseComponent11.default);

customElements.define('test-list', TestList);

/***/ }
/******/ ]);
//# sourceMappingURL=lifecycle.js.map