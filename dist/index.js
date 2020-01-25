(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(["@clubajax/on"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node / CommonJS
        module.exports = factory(require('@clubajax/on'));
    } else {
        // Browser globals (root is window)
        root['BaseComponent'] = factory(root.on);
    }
	}(this, function (on) {
"use strict";
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var _gPO = Object.getPrototypeOf || function _gPO(o) { return o.__proto__; };

var _sPO = Object.setPrototypeOf || function _sPO(o, p) { o.__proto__ = p; return o; };

var _construct = _typeof(Reflect) === "object" && Reflect.construct || function _construct(Parent, args, Class) { var Constructor, a = [null]; a.push.apply(a, args); Constructor = Parent.bind.apply(Parent, a); return _sPO(new Constructor(), Class.prototype); };

var _cache = typeof Map === "function" && new Map();

function _wrapNativeSuper(Class) { if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() {} Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writeable: true, configurable: true } }); return _sPO(Wrapper, _sPO(function Super() { return _construct(Class, arguments, _gPO(this).constructor); }, Class)); }

var BaseComponent =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(BaseComponent, _HTMLElement);

  function BaseComponent() {
    var _this;

    _classCallCheck(this, BaseComponent);

    _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));
    _this._uid = uid(_this.localName);
    privates[_this._uid] = {
      DOMSTATE: 'created'
    };
    privates[_this._uid].handleList = [];
    plugin('init', _assertThisInitialized(_this));
    return _this;
  }

  _createClass(BaseComponent, [{
    key: "connectedCallback",
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
    key: "onConnected",
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
    key: "onDomReady",
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
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var _this4 = this;

      privates[this._uid].DOMSTATE = 'disconnected';
      plugin('preDisconnected', this);

      if (this.disconnected) {
        this.disconnected();
      }

      this.fire('disconnected');
      var time,
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
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(attrName, oldVal, newVal) {
      if (!this.isSettingAttribute) {
        newVal = BaseComponent.normalize(newVal);
        plugin('preAttributeChanged', this, attrName, newVal, oldVal);

        if (this.attributeChanged && BaseComponent.normalize(oldVal) !== newVal) {
          this.attributeChanged(attrName, newVal, oldVal);
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.fire('destroy');

      privates[this._uid].handleList.forEach(function (handle) {
        handle.remove();
      });

      _destroy(this);
    }
  }, {
    key: "fire",
    value: function fire(eventName, eventDetail, bubbles) {
      return on.fire(this, eventName, eventDetail, bubbles);
    }
  }, {
    key: "emit",
    value: function emit(eventName, value) {
      return on.emit(this, eventName, value);
    }
  }, {
    key: "on",
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
    key: "once",
    value: function once(node, eventName, selector, callback) {
      return this.registerHandle(typeof node !== 'string' ? // no node is supplied
      on.once(node, eventName, selector, callback) : on.once(this, node, eventName, selector, callback));
    }
  }, {
    key: "attr",
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
    key: "registerHandle",
    value: function registerHandle(handle) {
      privates[this._uid].handleList.push(handle);

      return handle;
    }
  }, {
    key: "DOMSTATE",
    get: function get() {
      return privates[this._uid].DOMSTATE;
    }
  }], [{
    key: "clone",
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
    key: "addPlugin",
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
        } // was not inserted...


        plugins.push(plug);
      }
    }
  }, {
    key: "destroyOnDisconnect",
    set: function set(value) {
      privates['destroyOnDisconnect'] = value;
    },
    get: function get() {
      return privates['destroyOnDisconnect'];
    }
  }]);

  return BaseComponent;
}(_wrapNativeSuper(HTMLElement));

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
  } // If no children, we're good - leaf node. Commence with onDomReady
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
      } // if not, wait for event


      child.on('domready', addReady);
    });
  }
}

function onSelfDomReady() {
  privates[this._uid].DOMSTATE = 'domready'; // domReady should only ever fire once

  privates[this._uid].domReadyFired = true;
  plugin('preDomReady', this); // call this.domReady first, so that the component
  // can finish initializing before firing any
  // subsequent events

  if (this.domReady) {
    this.domReady();

    this.domReady = function () {};
  } // allow component to fire this event
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

      if (node.DOMSTATE === eventName || node.DOMSTATE === 'domready') {
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

function testOptions(options) {
  var tests = {
    'prop': 'props',
    'bool': 'bools',
    'attr': 'attrs',
    'properties': 'props',
    'booleans': 'bools',
    'property': 'props',
    'boolean': 'bools'
  };
  Object.keys(tests).forEach(function (key) {
    if (options[key]) {
      console.error("BaseComponent.define found \"".concat(key, "\"; Did you mean: \"").concat(tests[key], "\"?"));
    }
  });
}

BaseComponent.injectProps = function (Constructor, _ref) {
  var _ref$props = _ref.props,
      props = _ref$props === void 0 ? [] : _ref$props,
      _ref$bools = _ref.bools,
      bools = _ref$bools === void 0 ? [] : _ref$bools,
      _ref$attrs = _ref.attrs,
      attrs = _ref$attrs === void 0 ? [] : _ref$attrs;
  Constructor.bools = _toConsumableArray(Constructor.bools || []).concat(_toConsumableArray(bools));
  Constructor.props = _toConsumableArray(Constructor.props || []).concat(_toConsumableArray(props));
  Constructor.attrs = _toConsumableArray(Constructor.attrs || []).concat(_toConsumableArray(attrs));
  Constructor.observedAttributes = _toConsumableArray(Constructor.bools).concat(_toConsumableArray(Constructor.props), _toConsumableArray(Constructor.attrs));
};

BaseComponent.define = function (tagName, Constructor) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  testOptions(options);
  BaseComponent.injectProps(Constructor, options);
  customElements.define(tagName, Constructor);
  return Constructor;
};

(function () {
				function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function setBoolean(node, prop) {
  var propValue;
  Object.defineProperty(node, prop, {
    enumerable: true,
    configurable: true,
    get: function get() {
      var att = this.getAttribute(prop);
      return att !== undefined && att !== null && att !== 'false' && att !== false;
    },
    set: function set(value) {
      var _this = this;

      this.isSettingAttribute = true;
      value = value !== false && value !== null && value !== undefined;

      if (value) {
        this.setAttribute(prop, '');
      } else {
        this.removeAttribute(prop);
      }

      if (this.attributeChanged) {
        this.attributeChanged(prop, value);
      }

      var fn = this[onify(prop)];

      if (fn) {
        var eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
        window[eventName](this, function () {
          if (value !== undefined && propValue !== value) {
            value = fn.call(_this, value) || value;
          }

          propValue = value;
        });
      }

      this.isSettingAttribute = false;
    }
  });
}

function setProperty(node, prop) {
  var propValue;
  Object.defineProperty(node, prop, {
    enumerable: true,
    configurable: true,
    get: function get() {
      return propValue !== undefined ? propValue : normalize(this.getAttribute(prop));
    },
    set: function set(value) {
      var _this2 = this;

      this.isSettingAttribute = true;

      if (_typeof(value) === 'object') {
        propValue = value;
      } else {
        this.setAttribute(prop, value);

        if (this.attributeChanged) {
          this.attributeChanged(prop, value);
        }
      }

      var fn = this[onify(prop)];

      if (fn) {
        var eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
        window[eventName](this, function () {
          if (value !== undefined) {
            propValue = value;
          }

          value = fn.call(_this2, value) || value;
        });
      }

      this.isSettingAttribute = false;
    }
  });
}

function setProperties(node) {
  var props = node.constructor.props || node.props;

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
  var props = node.constructor.bools || node.bools;

  if (props) {
    props.forEach(function (prop) {
      setBoolean(node, prop);
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

function normalize(val) {
  if (typeof val === 'string') {
    val = val.trim();

    if (val === 'false') {
      return false;
    } else if (val === 'null') {
      return null;
    } else if (val === 'true') {
      return true;
    } // finds strings that start with numbers, but are not numbers:
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

BaseComponent.normalize = normalize;
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

    var v = normalize(value);
    node[name] = v;
  }
});			
}());

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
  var i;
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
  } //}


  return this.templateNode;
};

BaseComponent.prototype.getTemplateChain = function () {
  var context = this,
      templates = [],
      template; // walk the prototype chain; Babel doesn't allow using
  // `super` since we are outside of the Class

  while (context) {
    context = Object.getPrototypeOf(context);

    if (!context) {
      break;
    } // skip prototypes without a template
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
}());

(function () {
				function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function assignRefs(node) {
  _toConsumableArray(node.querySelectorAll('[ref]')).forEach(function (child) {
    var name = child.getAttribute('ref');
    child.removeAttribute('ref');
    node[name] = child;
  });
}

function assignEvents(node) {
  // <div on="click:onClick">
  _toConsumableArray(node.querySelectorAll('[on]')).forEach(function (child, i, children) {
    if (child === node) {
      return;
    }

    var keyValue = child.getAttribute('on'),
        event = keyValue.split(':')[0].trim(),
        method = keyValue.split(':')[1].trim(); // remove, so parent does not try to use it

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
}());

	return BaseComponent;

}));