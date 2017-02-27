(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// class/component rules
// always call super() first in the ctor. This also calls the extended class' ctor.
// cannot call NEW on a Component class

// Classes http://exploringjs.com/es6/ch_classes.html#_the-species-pattern-in-static-methods

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _on = require('on');
var dom = require('dom');

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

module.exports = BaseComponent;

},{"dom":"dom","on":"on"}],2:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');
var properties = require('./properties');
var template = require('./template');
var refs = require('./refs');
var itemTemplate = require('./item-template');

},{"./BaseComponent":1,"./item-template":3,"./properties":4,"./refs":5,"./template":6}],3:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');
var dom = require('dom');
var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
var r = /\{\{\w*}}/g;

// TODO: switch to ES6 literals? Maybe not...

// FIXME: time current process
// Try a new one where meta data is created, instead of a template

function createCondition(name, value) {
    // FIXME name?
    value = value.replace(r, function (w) {
        w = w.replace('{{', '').replace('}}', '');
        return 'item["' + w + '"]';
    });
    console.log('createCondition', name, value);
    return function (item) {
        return eval(value);
    };
}

function walkDom(node, refs) {

    var item = {
        node: node
    };

    refs.nodes.push(item);

    if (node.attributes) {
        for (var i = 0; i < node.attributes.length; i++) {
            var name = node.attributes[i].name,
                value = node.attributes[i].value;
            console.log('  ', name, value);
            if (name === 'if') {
                item.conditional = createCondition(name, value);
            } else if (/\{\{/.test(value)) {
                // <div id="{{id}}">
                refs.attributes = refs.attributes || {};
                item.attributes = item.attributes || {};
                item.attributes[name] = value;
                // could be more than one??
                // same with node?
                refs.attributes[name] = node;
            }
        }
    }

    // should probably loop over childNodes and check text nodes for replacements
    //
    if (!node.children.length) {
        if (/\{\{/.test(node.innerHTML)) {
            // FIXME - innerHTML as value too naive
            var prop = node.innerHTML.replace('{{', '').replace('}}', '');
            item.text = item.text || {};
            item.text[prop] = node.innerHTML;
            refs[prop] = node;
        }
        return;
    }

    for (var _i = 0; _i < node.children.length; _i++) {
        walkDom(node.children[_i], refs);
    }
}

function updateItemTemplate(frag) {
    var refs = {
        nodes: []
    };
    walkDom(frag, refs);
    return refs;
}

BaseComponent.prototype.renderList = function (items, container, itemTemplate) {
    var frag = document.createDocumentFragment(),
        tmpl = itemTemplate || this.itemTemplate,
        refs = tmpl.itemRefs,
        clone = void 0,
        defer = void 0;

    function warn(name) {
        clearTimeout(defer);
        defer = setTimeout(function () {
            console.warn('Attempted to set attribute from non-existent item property:', name);
        }, 1);
    }

    items.forEach(function (item) {

        var ifCount = 0,
            deletions = [];

        refs.nodes.forEach(function (ref) {

            //
            // can't swap because the innerHTML is being changed
            // can't clone because then there is not a node reference
            //
            var value = void 0,
                node = ref.node,
                hasNode = true;
            if (ref.conditional) {
                if (!ref.conditional(item)) {
                    hasNode = false;
                    ifCount++;
                    // can't actually delete, because this is the original template
                    // instead, adding attribute to track node, to be deleted in clone
                    // then after, remove temporary attribute from template
                    ref.node.setAttribute('ifs', ifCount + '');
                    deletions.push('[ifs="' + ifCount + '"]');
                }
            }
            if (hasNode) {
                if (ref.attributes) {
                    Object.keys(ref.attributes).forEach(function (key) {
                        value = ref.attributes[key];
                        ref.node.setAttribute(key, item[key]);
                        //console.log('swap att', key, value, ref.node);
                    });
                }
                if (ref.text) {
                    Object.keys(ref.text).forEach(function (key) {
                        value = ref.text[key];
                        //console.log('swap text', key, item[key]);
                        node.innerHTML = value.replace(value, item[key]);
                    });
                }
            }
        });

        clone = tmpl.cloneNode(true);

        deletions.forEach(function (del) {
            var node = clone.querySelector(del);
            if (node) {
                dom.destroy(node);
                var tmplNode = tmpl.querySelector(del);
                tmplNode.removeAttribute('ifs');
            }
        });

        frag.appendChild(clone);
    });

    container.appendChild(frag);

    //items.forEach(function (item) {
    //    Object.keys(item).forEach(function (key) {
    //        if(refs[key]){
    //            refs[key].innerHTML = item[key];
    //        }
    //    });
    //    if(refs.attributes){
    //        Object.keys(refs.attributes).forEach(function (name) {
    //            let node = refs.attributes[name];
    //            if(item[name] !== undefined) {
    //                node.setAttribute(name, item[name]);
    //            }else{
    //                warn(name);
    //            }
    //        });
    //    }
    //
    //    clone = tmpl.cloneNode(true);
    //    frag.appendChild(clone);
    //});

    //container.appendChild(frag);
};

BaseComponent.addPlugin({
    name: 'item-template',
    order: 40,
    preDomReady: function preDomReady(node) {
        node.itemTemplate = dom.query(node, 'template');
        if (node.itemTemplate) {
            node.itemTemplate.parentNode.removeChild(node.itemTemplate);
            node.itemTemplate = BaseComponent.clone(node.itemTemplate);
            node.itemTemplate.itemRefs = updateItemTemplate(node.itemTemplate);
        }
    }
});

module.exports = {};

},{"./BaseComponent":1,"dom":"dom"}],4:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');
var dom = require('dom');

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

BaseComponent.addPlugin({
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

module.exports = {};

},{"./BaseComponent":1,"dom":"dom"}],5:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');

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

BaseComponent.addPlugin({
    name: 'refs',
    order: 30,
    preConnected: function preConnected(node) {
        assignRefs(node);
        assignEvents(node);
    }
});

module.exports = {};

},{"./BaseComponent":1}],6:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');
var dom = require('dom');

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
    var i,
        container = getContainer(node),
        children = lightNodes[node._uid];

    if (container && children && children.length) {
        for (i = 0; i < children.length; i++) {
            container.appendChild(children[i]);
        }
    }
}

BaseComponent.prototype.getLightNodes = function () {
    return lightNodes[this._uid];
};

BaseComponent.prototype.getTemplateNode = function () {
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

module.exports = {};

},{"./BaseComponent":1,"dom":"dom"}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmFzZUNvbXBvbmVudC5qcyIsInNyYy9kZXBsb3kuanMiLCJzcmMvaXRlbS10ZW1wbGF0ZS5qcyIsInNyYy9wcm9wZXJ0aWVzLmpzIiwic3JjL3JlZnMuanMiLCJzcmMvdGVtcGxhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNLE1BQUssUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNLE1BQU0sUUFBUSxLQUFSLENBQVo7O0lBRU0sYTs7O0FBQ0YsNkJBQWM7QUFBQTs7QUFBQTs7QUFFVixjQUFLLElBQUwsR0FBWSxJQUFJLEdBQUosQ0FBUSxNQUFLLFNBQWIsQ0FBWjtBQUNBLGlCQUFTLE1BQUssSUFBZCxJQUFzQixFQUFDLFVBQVUsU0FBWCxFQUF0QjtBQUNBLGlCQUFTLE1BQUssSUFBZCxFQUFvQixVQUFwQixHQUFpQyxFQUFqQztBQUNBLGVBQU8sTUFBUDtBQUxVO0FBTWI7Ozs7NENBRW1CO0FBQ2hCLHFCQUFTLEtBQUssSUFBZCxFQUFvQixRQUFwQixHQUErQixXQUEvQjtBQUNBLG1CQUFPLGNBQVAsRUFBdUIsSUFBdkI7QUFDQSxxQkFBUyxnQkFBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBVDtBQUNBLGdCQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNoQixxQkFBSyxTQUFMO0FBQ0g7QUFDRCxpQkFBSyxJQUFMLENBQVUsV0FBVjtBQUNBLG1CQUFPLGVBQVAsRUFBd0IsSUFBeEI7QUFDSDs7OytDQUVzQjtBQUNuQixxQkFBUyxLQUFLLElBQWQsRUFBb0IsUUFBcEIsR0FBK0IsY0FBL0I7QUFDQSxtQkFBTyxpQkFBUCxFQUEwQixJQUExQjtBQUNBLGdCQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNuQixxQkFBSyxZQUFMO0FBQ0g7QUFDRCxpQkFBSyxJQUFMLENBQVUsY0FBVjtBQUNI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Q1YsMEJBQVUsSUFBVixDQUFlLFFBQWY7QUFDSDtBQUNKO0FBQ0o7QUFDRCxXQUFPLFNBQVA7QUFDSCxDQXRCRDs7QUF3QkEsY0FBYyxTQUFkLENBQXdCO0FBQ3BCLFVBQU0sVUFEYztBQUVwQixXQUFPLEVBRmE7QUFHcEIsa0JBQWMsc0JBQVUsSUFBVixFQUFnQjtBQUMxQixlQUFPLElBQVA7QUFDSDtBQUxtQixDQUF4Qjs7QUFRQSxPQUFPLE9BQVAsR0FBaUIsRUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGNsYXNzL2NvbXBvbmVudCBydWxlc1xuLy8gYWx3YXlzIGNhbGwgc3VwZXIoKSBmaXJzdCBpbiB0aGUgY3Rvci4gVGhpcyBhbHNvIGNhbGxzIHRoZSBleHRlbmRlZCBjbGFzcycgY3Rvci5cbi8vIGNhbm5vdCBjYWxsIE5FVyBvbiBhIENvbXBvbmVudCBjbGFzc1xuXG4vLyBDbGFzc2VzIGh0dHA6Ly9leHBsb3Jpbmdqcy5jb20vZXM2L2NoX2NsYXNzZXMuaHRtbCNfdGhlLXNwZWNpZXMtcGF0dGVybi1pbi1zdGF0aWMtbWV0aG9kc1xuXG5jb25zdCBvbiA9IHJlcXVpcmUoJ29uJyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxuY2xhc3MgQmFzZUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fdWlkID0gZG9tLnVpZCh0aGlzLmxvY2FsTmFtZSk7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0gPSB7RE9NU1RBVEU6ICdjcmVhdGVkJ307XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdCA9IFtdO1xuICAgICAgICBwbHVnaW4oJ2luaXQnLCB0aGlzKTtcbiAgICB9XG4gICAgXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnY29ubmVjdGVkJztcbiAgICAgICAgcGx1Z2luKCdwcmVDb25uZWN0ZWQnLCB0aGlzKTtcbiAgICAgICAgbmV4dFRpY2sob25DaGVja0RvbVJlYWR5LmJpbmQodGhpcykpO1xuICAgICAgICBpZiAodGhpcy5jb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maXJlKCdjb25uZWN0ZWQnKTtcbiAgICAgICAgcGx1Z2luKCdwb3N0Q29ubmVjdGVkJywgdGhpcyk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZGlzY29ubmVjdGVkJztcbiAgICAgICAgcGx1Z2luKCdwcmVEaXNjb25uZWN0ZWQnLCB0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuZGlzY29ubmVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlyZSgnZGlzY29ubmVjdGVkJyk7XG4gICAgfVxuXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJOYW1lLCBvbGRWYWwsIG5ld1ZhbCkge1xuICAgICAgICBwbHVnaW4oJ3ByZUF0dHJpYnV0ZUNoYW5nZWQnLCB0aGlzLCBhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZUNoYW5nZWQoYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZmlyZSgnZGVzdHJveScpO1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICAgICAgICBoYW5kbGUucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb20uZGVzdHJveSh0aGlzKTtcbiAgICB9XG5cbiAgICBmaXJlKGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcbiAgICAgICAgcmV0dXJuIG9uLmZpcmUodGhpcywgZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcyk7XG4gICAgfVxuXG4gICAgZW1pdChldmVudE5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBvbi5lbWl0KHRoaXMsIGV2ZW50TmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKFxuICAgICAgICAgICAgdHlwZW9mIG5vZGUgIT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG4gICAgICAgICAgICAgICAgb24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcbiAgICAgICAgICAgICAgICBvbih0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yKSk7XG4gICAgfVxuXG4gICAgb25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcbiAgICAgICAgICAgIHR5cGVvZiBub2RlICE9ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuICAgICAgICAgICAgICAgIG9uLm9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcbiAgICAgICAgICAgICAgICBvbi5vbmNlKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJIYW5kbGUoaGFuZGxlKSB7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG4gICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgfVxuXG4gICAgZ2V0IERPTVNUQVRFKCkge1xuICAgICAgICByZXR1cm4gcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY2xvbmUodGVtcGxhdGUpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRlbnQgJiYgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyXG4gICAgICAgICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICAgICAgY2xvbmVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNsb25lTm9kZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZS5pbm5lckhUTUw7XG5cbiAgICAgICAgd2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmVOb2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnJhZztcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkUGx1Z2luKHBsdWcpIHtcbiAgICAgICAgdmFyIGksIG9yZGVyID0gcGx1Zy5vcmRlciB8fCAxMDA7XG4gICAgICAgIGlmICghcGx1Z2lucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBsdWdpbnMucHVzaChwbHVnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPD0gb3JkZXIpIHtcbiAgICAgICAgICAgICAgICBwbHVnaW5zLnB1c2gocGx1Zyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGx1Z2luc1swXS5vcmRlciA+IG9yZGVyKSB7XG4gICAgICAgICAgICBwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9yZGVyID09PSBwbHVnaW5zW2kgLSAxXS5vcmRlciB8fCAob3JkZXIgPiBwbHVnaW5zW2kgLSAxXS5vcmRlciAmJiBvcmRlciA8IHBsdWdpbnNbaV0ub3JkZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbnMuc3BsaWNlKGksIDAsIHBsdWcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2FzIG5vdCBpbnNlcnRlZC4uLlxuICAgICAgICAgICAgcGx1Z2lucy5wdXNoKHBsdWcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5sZXRcbiAgICBwcml2YXRlcyA9IHt9LFxuICAgIHBsdWdpbnMgPSBbXTtcblxuZnVuY3Rpb24gcGx1Z2luKG1ldGhvZCwgbm9kZSwgYSwgYiwgYykge1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Zykge1xuICAgICAgICBpZiAocGx1Z1ttZXRob2RdKSB7XG4gICAgICAgICAgICBwbHVnW21ldGhvZF0obm9kZSwgYSwgYiwgYyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gb25DaGVja0RvbVJlYWR5KCkge1xuICAgIGlmICh0aGlzLkRPTVNUQVRFICE9ICdjb25uZWN0ZWQnIHx8IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyXG4gICAgICAgIGNvdW50ID0gMCxcbiAgICAgICAgY2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuICAgICAgICBvdXJEb21SZWFkeSA9IG9uRG9tUmVhZHkuYmluZCh0aGlzKTtcblxuICAgIGZ1bmN0aW9uIGFkZFJlYWR5KCkge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoY291bnQgPT0gY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXJEb21SZWFkeSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gY2hpbGRyZW4sIHdlJ3JlIGdvb2QgLSBsZWFmIG5vZGUuIENvbW1lbmNlIHdpdGggb25Eb21SZWFkeVxuICAgIC8vXG4gICAgaWYgKCFjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgb3VyRG9tUmVhZHkoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGVsc2UsIHdhaXQgZm9yIGFsbCBjaGlsZHJlbiB0byBmaXJlIHRoZWlyIGByZWFkeWAgZXZlbnRzXG4gICAgICAgIC8vXG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBjaGlsZCBpcyBhbHJlYWR5IHJlYWR5XG4gICAgICAgICAgICBpZiAoY2hpbGQuRE9NU1RBVEUgPT0gJ2RvbXJlYWR5Jykge1xuICAgICAgICAgICAgICAgIGFkZFJlYWR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBub3QsIHdhaXQgZm9yIGV2ZW50XG4gICAgICAgICAgICBjaGlsZC5vbignZG9tcmVhZHknLCBhZGRSZWFkeSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gb25Eb21SZWFkeSgpIHtcbiAgICBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2RvbXJlYWR5JztcbiAgICAvLyBkb21SZWFkeSBzaG91bGQgb25seSBldmVyIGZpcmUgb25jZVxuICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG4gICAgcGx1Z2luKCdwcmVEb21SZWFkeScsIHRoaXMpO1xuICAgIC8vIGNhbGwgdGhpcy5kb21SZWFkeSBmaXJzdCwgc28gdGhhdCB0aGUgY29tcG9uZW50XG4gICAgLy8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcbiAgICAvLyBzdWJzZXF1ZW50IGV2ZW50c1xuICAgIGlmICh0aGlzLmRvbVJlYWR5KSB7XG4gICAgICAgIHRoaXMuZG9tUmVhZHkoKTtcbiAgICAgICAgdGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIH1cblxuICAgIHRoaXMuZmlyZSgnZG9tcmVhZHknKTtcblxuICAgIHBsdWdpbigncG9zdERvbVJlYWR5JywgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkQ3VzdG9tTm9kZXMobm9kZSkge1xuICAgIC8vIGNvbGxlY3QgYW55IGNoaWxkcmVuIHRoYXQgYXJlIGN1c3RvbSBub2Rlc1xuICAgIC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuICAgIC8vIGRldGVybWluaW5nIGlmIHRoaXMgaXMgcmVhZHlcbiAgICB2YXIgaSwgbm9kZXMgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbltpXS5ub2RlTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgbm9kZXMucHVzaChub2RlLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZXM7XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrKGNiKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbn1cblxud2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcbiAgICBmdW5jdGlvbiBvblJlYWR5ICgpIHtcbiAgICAgICAgY2FsbGJhY2sobm9kZSk7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcbiAgICB9XG4gICAgaWYobm9kZS5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jyl7XG4gICAgICAgIGNhbGxiYWNrKG5vZGUpO1xuICAgIH1lbHNle1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ29tcG9uZW50OyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi9wcm9wZXJ0aWVzJyk7XG5jb25zdCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKTtcbmNvbnN0IHJlZnMgPSByZXF1aXJlKCcuL3JlZnMnKTtcbmNvbnN0IGl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vaXRlbS10ZW1wbGF0ZScpOyIsImNvbnN0IEJhc2VDb21wb25lbnQgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuY29uc3QgYWxwaGFiZXQgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0KCcnKTtcbmNvbnN0IHIgPSAvXFx7XFx7XFx3Kn19L2c7XG5cbi8vIFRPRE86IHN3aXRjaCB0byBFUzYgbGl0ZXJhbHM/IE1heWJlIG5vdC4uLlxuXG4vLyBGSVhNRTogdGltZSBjdXJyZW50IHByb2Nlc3Ncbi8vIFRyeSBhIG5ldyBvbmUgd2hlcmUgbWV0YSBkYXRhIGlzIGNyZWF0ZWQsIGluc3RlYWQgb2YgYSB0ZW1wbGF0ZVxuXG5mdW5jdGlvbiBjcmVhdGVDb25kaXRpb24obmFtZSwgdmFsdWUpIHtcbiAgICAvLyBGSVhNRSBuYW1lP1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyLCBmdW5jdGlvbiAodykge1xuICAgICAgICB3ID0gdy5yZXBsYWNlKCd7eycsICcnKS5yZXBsYWNlKCd9fScsICcnKTtcbiAgICAgICAgcmV0dXJuICdpdGVtW1wiJyArIHcgKyAnXCJdJztcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZygnY3JlYXRlQ29uZGl0aW9uJywgbmFtZSwgdmFsdWUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gZXZhbCh2YWx1ZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gd2Fsa0RvbShub2RlLCByZWZzKSB7XG5cbiAgICBsZXQgaXRlbSA9IHtcbiAgICAgICAgbm9kZTogbm9kZVxuICAgIH07XG5cbiAgICByZWZzLm5vZGVzLnB1c2goaXRlbSk7XG5cbiAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXRcbiAgICAgICAgICAgICAgICBuYW1lID0gbm9kZS5hdHRyaWJ1dGVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBub2RlLmF0dHJpYnV0ZXNbaV0udmFsdWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnICAnLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2lmJykge1xuICAgICAgICAgICAgICAgIGl0ZW0uY29uZGl0aW9uYWwgPSBjcmVhdGVDb25kaXRpb24obmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoL1xce1xcey8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAvLyA8ZGl2IGlkPVwie3tpZH19XCI+XG4gICAgICAgICAgICAgICAgcmVmcy5hdHRyaWJ1dGVzID0gcmVmcy5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGl0ZW0uYXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBjb3VsZCBiZSBtb3JlIHRoYW4gb25lPz9cbiAgICAgICAgICAgICAgICAvLyBzYW1lIHdpdGggbm9kZT9cbiAgICAgICAgICAgICAgICByZWZzLmF0dHJpYnV0ZXNbbmFtZV0gPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2hvdWxkIHByb2JhYmx5IGxvb3Agb3ZlciBjaGlsZE5vZGVzIGFuZCBjaGVjayB0ZXh0IG5vZGVzIGZvciByZXBsYWNlbWVudHNcbiAgICAvL1xuICAgIGlmICghbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKC9cXHtcXHsvLnRlc3Qobm9kZS5pbm5lckhUTUwpKSB7XG4gICAgICAgICAgICAvLyBGSVhNRSAtIGlubmVySFRNTCBhcyB2YWx1ZSB0b28gbmFpdmVcbiAgICAgICAgICAgIGxldCBwcm9wID0gbm9kZS5pbm5lckhUTUwucmVwbGFjZSgne3snLCAnJykucmVwbGFjZSgnfX0nLCAnJyk7XG4gICAgICAgICAgICBpdGVtLnRleHQgPSBpdGVtLnRleHQgfHwge307XG4gICAgICAgICAgICBpdGVtLnRleHRbcHJvcF0gPSBub2RlLmlubmVySFRNTDtcbiAgICAgICAgICAgIHJlZnNbcHJvcF0gPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgd2Fsa0RvbShub2RlLmNoaWxkcmVuW2ldLCByZWZzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUl0ZW1UZW1wbGF0ZShmcmFnKSB7XG4gICAgbGV0IHJlZnMgPSB7XG4gICAgICAgIG5vZGVzOiBbXVxuICAgIH07XG4gICAgd2Fsa0RvbShmcmFnLCByZWZzKTtcbiAgICByZXR1cm4gcmVmcztcbn1cblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyTGlzdCA9IGZ1bmN0aW9uIChpdGVtcywgY29udGFpbmVyLCBpdGVtVGVtcGxhdGUpIHtcbiAgICBsZXRcbiAgICAgICAgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgdG1wbCA9IGl0ZW1UZW1wbGF0ZSB8fCB0aGlzLml0ZW1UZW1wbGF0ZSxcbiAgICAgICAgcmVmcyA9IHRtcGwuaXRlbVJlZnMsXG4gICAgICAgIGNsb25lLFxuICAgICAgICBkZWZlcjtcblxuICAgIGZ1bmN0aW9uIHdhcm4obmFtZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVmZXIpO1xuICAgICAgICBkZWZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdBdHRlbXB0ZWQgdG8gc2V0IGF0dHJpYnV0ZSBmcm9tIG5vbi1leGlzdGVudCBpdGVtIHByb3BlcnR5OicsIG5hbWUpO1xuICAgICAgICB9LCAxKTtcbiAgICB9XG5cbiAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cbiAgICAgICAgbGV0XG4gICAgICAgICAgICBpZkNvdW50ID0gMCxcbiAgICAgICAgICAgIGRlbGV0aW9ucyA9IFtdO1xuXG4gICAgICAgIHJlZnMubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAocmVmKSB7XG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBjYW4ndCBzd2FwIGJlY2F1c2UgdGhlIGlubmVySFRNTCBpcyBiZWluZyBjaGFuZ2VkXG4gICAgICAgICAgICAvLyBjYW4ndCBjbG9uZSBiZWNhdXNlIHRoZW4gdGhlcmUgaXMgbm90IGEgbm9kZSByZWZlcmVuY2VcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBsZXRcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBub2RlID0gcmVmLm5vZGUsXG4gICAgICAgICAgICAgICAgaGFzTm9kZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAocmVmLmNvbmRpdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWYuY29uZGl0aW9uYWwoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzTm9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZkNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbid0IGFjdHVhbGx5IGRlbGV0ZSwgYmVjYXVzZSB0aGlzIGlzIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkLCBhZGRpbmcgYXR0cmlidXRlIHRvIHRyYWNrIG5vZGUsIHRvIGJlIGRlbGV0ZWQgaW4gY2xvbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBhZnRlciwgcmVtb3ZlIHRlbXBvcmFyeSBhdHRyaWJ1dGUgZnJvbSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICByZWYubm9kZS5zZXRBdHRyaWJ1dGUoJ2lmcycsIGlmQ291bnQrJycpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGlvbnMucHVzaCgnW2lmcz1cIicraWZDb3VudCsnXCJdJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc05vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVmLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVmLmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWYuYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmLm5vZGUuc2V0QXR0cmlidXRlKGtleSwgaXRlbVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N3YXAgYXR0Jywga2V5LCB2YWx1ZSwgcmVmLm5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlZi50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlZi50ZXh0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVmLnRleHRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N3YXAgdGV4dCcsIGtleSwgaXRlbVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gdmFsdWUucmVwbGFjZSh2YWx1ZSwgaXRlbVtrZXldKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNsb25lID0gdG1wbC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgZGVsZXRpb25zLmZvckVhY2goZnVuY3Rpb24gKGRlbCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKGRlbCk7XG4gICAgICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICAgICAgZG9tLmRlc3Ryb3kobm9kZSk7XG4gICAgICAgICAgICAgICAgbGV0IHRtcGxOb2RlID0gdG1wbC5xdWVyeVNlbGVjdG9yKGRlbCk7XG4gICAgICAgICAgICAgICAgdG1wbE5vZGUucmVtb3ZlQXR0cmlidXRlKCdpZnMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZyk7XG5cbiAgICAvL2l0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAvLyAgICBPYmplY3Qua2V5cyhpdGVtKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvLyAgICAgICAgaWYocmVmc1trZXldKXtcbiAgICAvLyAgICAgICAgICAgIHJlZnNba2V5XS5pbm5lckhUTUwgPSBpdGVtW2tleV07XG4gICAgLy8gICAgICAgIH1cbiAgICAvLyAgICB9KTtcbiAgICAvLyAgICBpZihyZWZzLmF0dHJpYnV0ZXMpe1xuICAgIC8vICAgICAgICBPYmplY3Qua2V5cyhyZWZzLmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAvLyAgICAgICAgICAgIGxldCBub2RlID0gcmVmcy5hdHRyaWJ1dGVzW25hbWVdO1xuICAgIC8vICAgICAgICAgICAgaWYoaXRlbVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgaXRlbVtuYW1lXSk7XG4gICAgLy8gICAgICAgICAgICB9ZWxzZXtcbiAgICAvLyAgICAgICAgICAgICAgICB3YXJuKG5hbWUpO1xuICAgIC8vICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICB9KTtcbiAgICAvLyAgICB9XG4gICAgLy9cbiAgICAvLyAgICBjbG9uZSA9IHRtcGwuY2xvbmVOb2RlKHRydWUpO1xuICAgIC8vICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIC8vfSk7XG5cbiAgICAvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnKTtcbn07XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAnaXRlbS10ZW1wbGF0ZScsXG4gICAgb3JkZXI6IDQwLFxuICAgIHByZURvbVJlYWR5OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZSA9IGRvbS5xdWVyeShub2RlLCAndGVtcGxhdGUnKTtcbiAgICAgICAgaWYgKG5vZGUuaXRlbVRlbXBsYXRlKSB7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlID0gQmFzZUNvbXBvbmVudC5jbG9uZShub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZS5pdGVtUmVmcyA9IHVwZGF0ZUl0ZW1UZW1wbGF0ZShub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbmZ1bmN0aW9uIHNldEJvb2xlYW4gKG5vZGUsIHByb3ApIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgaWYobm9kZS5oYXNBdHRyaWJ1dGUocHJvcCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkb20ubm9ybWFsaXplKG5vZGUuZ2V0QXR0cmlidXRlKHByb3ApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYodmFsdWUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKHByb3AsICcnKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnR5IChub2RlLCBwcm9wKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiBkb20ubm9ybWFsaXplKHRoaXMuZ2V0QXR0cmlidXRlKHByb3ApKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXMgKG5vZGUpIHtcbiAgICBsZXQgcHJvcHMgPSBub2RlLnByb3BzIHx8IG5vZGUucHJvcGVydGllcztcbiAgICBpZihwcm9wcykge1xuICAgICAgICBwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICBpZihwcm9wID09PSAnZGlzYWJsZWQnKXtcbiAgICAgICAgICAgICAgICBzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBzZXRQcm9wZXJ0eShub2RlLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRCb29sZWFucyAobm9kZSkge1xuICAgIGxldCBwcm9wcyA9IG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucztcbiAgICBpZihwcm9wcykge1xuICAgICAgICBwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICBzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAncHJvcGVydGllcycsXG4gICAgb3JkZXI6IDEwLFxuICAgIGluaXQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHNldFByb3BlcnRpZXMobm9kZSk7XG4gICAgICAgIHNldEJvb2xlYW5zKG5vZGUpO1xuICAgIH0sXG4gICAgcHJlQXR0cmlidXRlQ2hhbmdlZDogZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRoaXNbbmFtZV0gPSBkb20ubm9ybWFsaXplKHZhbHVlKTtcbiAgICAgICAgaWYoIXZhbHVlICYmIChub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnMgfHwgW10pLmluZGV4T2YobmFtZSkpe1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuXG5mdW5jdGlvbiBhc3NpZ25SZWZzIChub2RlKSB7XG4gICAgZG9tLnF1ZXJ5QWxsKG5vZGUsICdbcmVmXScpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhciBuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGNoaWxkO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhc3NpZ25FdmVudHMgKG5vZGUpIHtcbiAgICAvLyA8ZGl2IG9uPVwiY2xpY2s6b25DbGlja1wiPlxuICAgIGRvbS5xdWVyeUFsbChub2RlLCAnW29uXScpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAga2V5VmFsdWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ29uJyksXG4gICAgICAgICAgICBldmVudCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMF0udHJpbSgpLFxuICAgICAgICAgICAgbWV0aG9kID0ga2V5VmFsdWUuc3BsaXQoJzonKVsxXS50cmltKCk7XG4gICAgICAgIG5vZGUub24oY2hpbGQsIGV2ZW50LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbm9kZVttZXRob2RdKGUpXG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAncmVmcycsXG4gICAgb3JkZXI6IDMwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgYXNzaWduUmVmcyhub2RlKTtcbiAgICAgICAgYXNzaWduRXZlbnRzKG5vZGUpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9OyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxudmFyXG4gICAgbGlnaHROb2RlcyA9IHt9LFxuICAgIGluc2VydGVkID0ge307XG5cbmZ1bmN0aW9uIGluc2VydCAobm9kZSkge1xuICAgIGlmKGluc2VydGVkW25vZGUuX3VpZF0gfHwgIWhhc1RlbXBsYXRlKG5vZGUpKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKTtcbiAgICBpbnNlcnRUZW1wbGF0ZShub2RlKTtcbiAgICBpbnNlcnRlZFtub2RlLl91aWRdID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdExpZ2h0Tm9kZXMobm9kZSl7XG4gICAgbGlnaHROb2Rlc1tub2RlLl91aWRdID0gbGlnaHROb2Rlc1tub2RlLl91aWRdIHx8IFtdO1xuICAgIHdoaWxlKG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpe1xuICAgICAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0ucHVzaChub2RlLnJlbW92ZUNoaWxkKG5vZGUuY2hpbGROb2Rlc1swXSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFzVGVtcGxhdGUgKG5vZGUpIHtcbiAgICByZXR1cm4gISFub2RlLmdldFRlbXBsYXRlTm9kZSgpO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRUZW1wbGF0ZUNoYWluIChub2RlKSB7XG4gICAgdmFyIHRlbXBsYXRlcyA9IG5vZGUuZ2V0VGVtcGxhdGVDaGFpbigpO1xuICAgIHRlbXBsYXRlcy5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgZ2V0Q29udGFpbmVyKG5vZGUpLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGUpKTtcbiAgICB9KTtcbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGUgKG5vZGUpIHtcbiAgICBpZihub2RlLm5lc3RlZFRlbXBsYXRlKXtcbiAgICAgICAgaW5zZXJ0VGVtcGxhdGVDaGFpbihub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXJcbiAgICAgICAgdGVtcGxhdGVOb2RlID0gbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcblxuICAgIGlmKHRlbXBsYXRlTm9kZSkge1xuICAgICAgICBub2RlLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGVOb2RlKSk7XG4gICAgfVxuICAgIGluc2VydENoaWxkcmVuKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250YWluZXIgKG5vZGUpIHtcbiAgICB2YXIgY29udGFpbmVycyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW3JlZj1cImNvbnRhaW5lclwiXScpO1xuICAgIGlmKCFjb250YWluZXJzIHx8ICFjb250YWluZXJzLmxlbmd0aCl7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyc1tjb250YWluZXJzLmxlbmd0aCAtIDFdO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRDaGlsZHJlbiAobm9kZSkge1xuICAgIHZhciBpLFxuICAgICAgICBjb250YWluZXIgPSBnZXRDb250YWluZXIobm9kZSksXG4gICAgICAgIGNoaWxkcmVuID0gbGlnaHROb2Rlc1tub2RlLl91aWRdO1xuXG4gICAgaWYoY29udGFpbmVyICYmIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgIGZvcihpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldExpZ2h0Tm9kZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxpZ2h0Tm9kZXNbdGhpcy5fdWlkXTtcbn07XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBjYWNoaW5nIGNhdXNlcyBkaWZmZXJlbnQgY2xhc3NlcyB0byBwdWxsIHRoZSBzYW1lIHRlbXBsYXRlIC0gd2F0P1xuICAgIC8vaWYoIXRoaXMudGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlSWQpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gZG9tLmJ5SWQodGhpcy50ZW1wbGF0ZUlkLnJlcGxhY2UoJyMnLCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy50ZW1wbGF0ZVN0cmluZykge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSBkb20udG9Eb20oJzx0ZW1wbGF0ZT4nICsgdGhpcy50ZW1wbGF0ZVN0cmluZyArICc8L3RlbXBsYXRlPicpO1xuICAgICAgICB9XG4gICAgLy99XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVOb2RlO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVDaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGxldFxuICAgICAgICBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgdGVtcGxhdGVzID0gW10sXG4gICAgICAgIHRlbXBsYXRlO1xuXG4gICAgLy8gd2FsayB0aGUgcHJvdG90eXBlIGNoYWluOyBCYWJlbCBkb2Vzbid0IGFsbG93IHVzaW5nXG4gICAgLy8gYHN1cGVyYCBzaW5jZSB3ZSBhcmUgb3V0c2lkZSBvZiB0aGUgQ2xhc3NcbiAgICB3aGlsZShjb250ZXh0KXtcbiAgICAgICAgY29udGV4dCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250ZXh0KTtcbiAgICAgICAgaWYoIWNvbnRleHQpeyBicmVhazsgfVxuICAgICAgICAvLyBza2lwIHByb3RvdHlwZXMgd2l0aG91dCBhIHRlbXBsYXRlXG4gICAgICAgIC8vIChlbHNlIGl0IHdpbGwgcHVsbCBhbiBpbmhlcml0ZWQgdGVtcGxhdGUgYW5kIGNhdXNlIGR1cGxpY2F0ZXMpXG4gICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlU3RyaW5nJykgfHwgY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVJZCcpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IGNvbnRleHQuZ2V0VGVtcGxhdGVOb2RlKCk7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMucHVzaCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlcztcbn07XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAndGVtcGxhdGUnLFxuICAgIG9yZGVyOiAyMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGluc2VydChub2RlKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiXX0=
