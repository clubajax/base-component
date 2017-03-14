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

module.exports = {
	BaseComponent: BaseComponent,
	properties: properties,
	template: template,
	refs: refs,
	itemTemplate: itemTemplate
};

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

function setObject(node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmFzZUNvbXBvbmVudC5qcyIsInNyYy9kZXBsb3kuanMiLCJzcmMvaXRlbS10ZW1wbGF0ZS5qcyIsInNyYy9wcm9wZXJ0aWVzLmpzIiwic3JjL3JlZnMuanMiLCJzcmMvdGVtcGxhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNLE1BQUssUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNLE1BQU0sUUFBUSxLQUFSLENBQVo7O0lBRU0sYTs7O0FBQ0YsNkJBQWM7QUFBQTs7QUFBQTs7QUFFVixjQUFLLElBQUwsR0FBWSxJQUFJLEdBQUosQ0FBUSxNQUFLLFNBQWIsQ0FBWjtBQUNBLGlCQUFTLE1BQUssSUFBZCxJQUFzQixFQUFDLFVBQVUsU0FBWCxFQUF0QjtBQUNBLGlCQUFTLE1BQUssSUFBZCxFQUFvQixVQUFwQixHQUFpQyxFQUFqQztBQUNBLGVBQU8sTUFBUDtBQUxVO0FBTWI7Ozs7NENBRW1CO0FBQ2hCLHFCQUFTLEtBQUssSUFBZCxFQUFvQixRQUFwQixHQUErQixXQUEvQjtBQUNBLG1CQUFPLGNBQVAsRUFBdUIsSUFBdkI7QUFDQSxxQkFBUyxnQkFBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBVDtBQUNBLGdCQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNoQixxQkFBSyxTQUFMO0FBQ0g7QUFDRCxpQkFBSyxJQUFMLENBQVUsV0FBVjtBQUNBLG1CQUFPLGVBQVAsRUFBd0IsSUFBeEI7QUFDSDs7OytDQUVzQjtBQUNuQixxQkFBUyxLQUFLLElBQWQsRUFBb0IsUUFBcEIsR0FBK0IsY0FBL0I7QUFDQSxtQkFBTyxpQkFBUCxFQUEwQixJQUExQjtBQUNBLGdCQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNuQixxQkFBSyxZQUFMO0FBQ0g7QUFDRCxpQkFBSyxJQUFMLENBQVUsY0FBVjtBQUNI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LENBQVQsQ0FBcEI7QUFDSCxLQUZELE1BR0ssSUFBSSxLQUFLLGNBQVQsRUFBeUI7QUFDMUIsYUFBSyxZQUFMLEdBQW9CLElBQUksS0FBSixDQUFVLGVBQWUsS0FBSyxjQUFwQixHQUFxQyxhQUEvQyxDQUFwQjtBQUNIO0FBQ0w7QUFDQSxXQUFPLEtBQUssWUFBWjtBQUNILENBWEQ7O0FBYUEsY0FBYyxTQUFkLENBQXdCLGdCQUF4QixHQUEyQyxZQUFZOztBQUVuRCxRQUNJLFVBQVUsSUFEZDtBQUFBLFFBRUksWUFBWSxFQUZoQjtBQUFBLFFBR0ksaUJBSEo7O0FBS0E7QUFDQTtBQUNBLFdBQU0sT0FBTixFQUFjO0FBQ1Ysa0JBQVUsT0FBTyxjQUFQLENBQXNCLE9BQXRCLENBQVY7QUFDQSxZQUFHLENBQUMsT0FBSixFQUFZO0FBQUU7QUFBUTtBQUN0QjtBQUNBO0FBQ0EsWUFBRyxRQUFRLGNBQVIsQ0FBdUIsZ0JBQXZCLEtBQTRDLFFBQVEsY0FBUixDQUF1QixZQUF2QixDQUEvQyxFQUFxRjtBQUNqRix1QkFBVyxRQUFRLGVBQVIsRUFBWDtBQUNBLGdCQUFJLFFBQUosRUFBYztBQUNWLDBCQUFVLElBQVYsQ0FBZSxRQUFmO0FBQ0g7QUFDSjtBQUNKO0FBQ0QsV0FBTyxTQUFQO0FBQ0gsQ0F0QkQ7O0FBd0JBLGNBQWMsU0FBZCxDQUF3QjtBQUNwQixVQUFNLFVBRGM7QUFFcEIsV0FBTyxFQUZhO0FBR3BCLGtCQUFjLHNCQUFVLElBQVYsRUFBZ0I7QUFDMUIsZUFBTyxJQUFQO0FBQ0g7QUFMbUIsQ0FBeEI7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLEVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBjbGFzcy9jb21wb25lbnQgcnVsZXNcbi8vIGFsd2F5cyBjYWxsIHN1cGVyKCkgZmlyc3QgaW4gdGhlIGN0b3IuIFRoaXMgYWxzbyBjYWxscyB0aGUgZXh0ZW5kZWQgY2xhc3MnIGN0b3IuXG4vLyBjYW5ub3QgY2FsbCBORVcgb24gYSBDb21wb25lbnQgY2xhc3NcblxuLy8gQ2xhc3NlcyBodHRwOi8vZXhwbG9yaW5nanMuY29tL2VzNi9jaF9jbGFzc2VzLmh0bWwjX3RoZS1zcGVjaWVzLXBhdHRlcm4taW4tc3RhdGljLW1ldGhvZHNcblxuY29uc3Qgb24gPSByZXF1aXJlKCdvbicpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbmNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3VpZCA9IGRvbS51aWQodGhpcy5sb2NhbE5hbWUpO1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdID0ge0RPTVNUQVRFOiAnY3JlYXRlZCd9O1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QgPSBbXTtcbiAgICAgICAgcGx1Z2luKCdpbml0JywgdGhpcyk7XG4gICAgfVxuICAgIFxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Nvbm5lY3RlZCc7XG4gICAgICAgIHBsdWdpbigncHJlQ29ubmVjdGVkJywgdGhpcyk7XG4gICAgICAgIG5leHRUaWNrKG9uQ2hlY2tEb21SZWFkeS5iaW5kKHRoaXMpKTtcbiAgICAgICAgaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlyZSgnY29ubmVjdGVkJyk7XG4gICAgICAgIHBsdWdpbigncG9zdENvbm5lY3RlZCcsIHRoaXMpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG4gICAgICAgIHBsdWdpbigncHJlRGlzY29ubmVjdGVkJywgdGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmRpc2Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpcmUoJ2Rpc2Nvbm5lY3RlZCcpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcbiAgICAgICAgcGx1Z2luKCdwcmVBdHRyaWJ1dGVDaGFuZ2VkJywgdGhpcywgYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcbiAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmZpcmUoJ2Rlc3Ryb3knKTtcbiAgICAgICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9tLmRlc3Ryb3kodGhpcyk7XG4gICAgfVxuXG4gICAgZmlyZShldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG4gICAgICAgIHJldHVybiBvbi5maXJlKHRoaXMsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpO1xuICAgIH1cblxuICAgIGVtaXQoZXZlbnROYW1lLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBvbihub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcbiAgICAgICAgICAgIHR5cGVvZiBub2RlICE9ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuICAgICAgICAgICAgICAgIG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG4gICAgICAgICAgICAgICAgb24odGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvcikpO1xuICAgIH1cblxuICAgIG9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG4gICAgICAgICAgICB0eXBlb2Ygbm9kZSAhPSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcbiAgICAgICAgICAgICAgICBvbi5vbmNlKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG4gICAgICAgICAgICAgICAgb24ub25jZSh0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVySGFuZGxlKGhhbmRsZSkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QucHVzaChoYW5kbGUpO1xuICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgIH1cblxuICAgIGdldCBET01TVEFURSgpIHtcbiAgICAgICAgcmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsb25lKHRlbXBsYXRlKSB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZW50ICYmIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhclxuICAgICAgICAgICAgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgICAgIGNsb25lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG4gICAgICAgIHdoaWxlIChjbG9uZU5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lTm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZyYWc7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFBsdWdpbihwbHVnKSB7XG4gICAgICAgIHZhciBpLCBvcmRlciA9IHBsdWcub3JkZXIgfHwgMTAwO1xuICAgICAgICBpZiAoIXBsdWdpbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwbHVnaW5zLnB1c2gocGx1Zyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGx1Z2lucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGlmIChwbHVnaW5zWzBdLm9yZGVyIDw9IG9yZGVyKSB7XG4gICAgICAgICAgICAgICAgcGx1Z2lucy5wdXNoKHBsdWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPiBvcmRlcikge1xuICAgICAgICAgICAgcGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChvcmRlciA9PT0gcGx1Z2luc1tpIC0gMV0ub3JkZXIgfHwgKG9yZGVyID4gcGx1Z2luc1tpIC0gMV0ub3JkZXIgJiYgb3JkZXIgPCBwbHVnaW5zW2ldLm9yZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdhcyBub3QgaW5zZXJ0ZWQuLi5cbiAgICAgICAgICAgIHBsdWdpbnMucHVzaChwbHVnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubGV0XG4gICAgcHJpdmF0ZXMgPSB7fSxcbiAgICBwbHVnaW5zID0gW107XG5cbmZ1bmN0aW9uIHBsdWdpbihtZXRob2QsIG5vZGUsIGEsIGIsIGMpIHtcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWcpIHtcbiAgICAgICAgaWYgKHBsdWdbbWV0aG9kXSkge1xuICAgICAgICAgICAgcGx1Z1ttZXRob2RdKG5vZGUsIGEsIGIsIGMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hlY2tEb21SZWFkeSgpIHtcbiAgICBpZiAodGhpcy5ET01TVEFURSAhPSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhclxuICAgICAgICBjb3VudCA9IDAsXG4gICAgICAgIGNoaWxkcmVuID0gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyh0aGlzKSxcbiAgICAgICAgb3VyRG9tUmVhZHkgPSBvbkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cbiAgICBmdW5jdGlvbiBhZGRSZWFkeSgpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgaWYgKGNvdW50ID09IGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgb3VyRG9tUmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG5vIGNoaWxkcmVuLCB3ZSdyZSBnb29kIC0gbGVhZiBub2RlLiBDb21tZW5jZSB3aXRoIG9uRG9tUmVhZHlcbiAgICAvL1xuICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIG91ckRvbVJlYWR5KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuICAgICAgICAvL1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgY2hpbGQgaXMgYWxyZWFkeSByZWFkeVxuICAgICAgICAgICAgaWYgKGNoaWxkLkRPTVNUQVRFID09ICdkb21yZWFkeScpIHtcbiAgICAgICAgICAgICAgICBhZGRSZWFkeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgbm90LCB3YWl0IGZvciBldmVudFxuICAgICAgICAgICAgY2hpbGQub24oJ2RvbXJlYWR5JywgYWRkUmVhZHkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9tUmVhZHkoKSB7XG4gICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG4gICAgLy8gZG9tUmVhZHkgc2hvdWxkIG9ubHkgZXZlciBmaXJlIG9uY2VcbiAgICBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPSB0cnVlO1xuICAgIHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcbiAgICAvLyBjYWxsIHRoaXMuZG9tUmVhZHkgZmlyc3QsIHNvIHRoYXQgdGhlIGNvbXBvbmVudFxuICAgIC8vIGNhbiBmaW5pc2ggaW5pdGlhbGl6aW5nIGJlZm9yZSBmaXJpbmcgYW55XG4gICAgLy8gc3Vic2VxdWVudCBldmVudHNcbiAgICBpZiAodGhpcy5kb21SZWFkeSkge1xuICAgICAgICB0aGlzLmRvbVJlYWR5KCk7XG4gICAgICAgIHRoaXMuZG9tUmVhZHkgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cbiAgICBwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzKG5vZGUpIHtcbiAgICAvLyBjb2xsZWN0IGFueSBjaGlsZHJlbiB0aGF0IGFyZSBjdXN0b20gbm9kZXNcbiAgICAvLyB1c2VkIHRvIGNoZWNrIGlmIHRoZWlyIGRvbSBpcyByZWFkeSBiZWZvcmVcbiAgICAvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG4gICAgdmFyIGksIG5vZGVzID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW5baV0ubm9kZU5hbWUuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZS5jaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayhjYikge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYik7XG59XG5cbndpbmRvdy5vbkRvbVJlYWR5ID0gZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgZnVuY3Rpb24gb25SZWFkeSAoKSB7XG4gICAgICAgIGNhbGxiYWNrKG5vZGUpO1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG4gICAgfVxuICAgIGlmKG5vZGUuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpe1xuICAgICAgICBjYWxsYmFjayhub2RlKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbXBvbmVudDsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4vcHJvcGVydGllcycpO1xuY29uc3QgdGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlJyk7XG5jb25zdCByZWZzID0gcmVxdWlyZSgnLi9yZWZzJyk7XG5jb25zdCBpdGVtVGVtcGxhdGUgPSByZXF1aXJlKCcuL2l0ZW0tdGVtcGxhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdEJhc2VDb21wb25lbnQsXG5cdHByb3BlcnRpZXMsXG5cdHRlbXBsYXRlLFxuXHRyZWZzLFxuXHRpdGVtVGVtcGxhdGVcbn07IiwiY29uc3QgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5jb25zdCBhbHBoYWJldCA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicuc3BsaXQoJycpO1xuY29uc3QgciA9IC9cXHtcXHtcXHcqfX0vZztcblxuLy8gVE9ETzogc3dpdGNoIHRvIEVTNiBsaXRlcmFscz8gTWF5YmUgbm90Li4uXG5cbi8vIEZJWE1FOiB0aW1lIGN1cnJlbnQgcHJvY2Vzc1xuLy8gVHJ5IGEgbmV3IG9uZSB3aGVyZSBtZXRhIGRhdGEgaXMgY3JlYXRlZCwgaW5zdGVhZCBvZiBhIHRlbXBsYXRlXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbmRpdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIC8vIEZJWE1FIG5hbWU/XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHIsIGZ1bmN0aW9uICh3KSB7XG4gICAgICAgIHcgPSB3LnJlcGxhY2UoJ3t7JywgJycpLnJlcGxhY2UoJ319JywgJycpO1xuICAgICAgICByZXR1cm4gJ2l0ZW1bXCInICsgdyArICdcIl0nO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKCdjcmVhdGVDb25kaXRpb24nLCBuYW1lLCB2YWx1ZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBldmFsKHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiB3YWxrRG9tKG5vZGUsIHJlZnMpIHtcblxuICAgIGxldCBpdGVtID0ge1xuICAgICAgICBub2RlOiBub2RlXG4gICAgfTtcblxuICAgIHJlZnMubm9kZXMucHVzaChpdGVtKTtcblxuICAgIGlmIChub2RlLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldFxuICAgICAgICAgICAgICAgIG5hbWUgPSBub2RlLmF0dHJpYnV0ZXNbaV0ubmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5vZGUuYXR0cmlidXRlc1tpXS52YWx1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcgICcsIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnaWYnKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jb25kaXRpb25hbCA9IGNyZWF0ZUNvbmRpdGlvbihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgvXFx7XFx7Ly50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIDxkaXYgaWQ9XCJ7e2lkfX1cIj5cbiAgICAgICAgICAgICAgICByZWZzLmF0dHJpYnV0ZXMgPSByZWZzLmF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gaXRlbS5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIGNvdWxkIGJlIG1vcmUgdGhhbiBvbmU/P1xuICAgICAgICAgICAgICAgIC8vIHNhbWUgd2l0aCBub2RlP1xuICAgICAgICAgICAgICAgIHJlZnMuYXR0cmlidXRlc1tuYW1lXSA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzaG91bGQgcHJvYmFibHkgbG9vcCBvdmVyIGNoaWxkTm9kZXMgYW5kIGNoZWNrIHRleHQgbm9kZXMgZm9yIHJlcGxhY2VtZW50c1xuICAgIC8vXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBpZiAoL1xce1xcey8udGVzdChub2RlLmlubmVySFRNTCkpIHtcbiAgICAgICAgICAgIC8vIEZJWE1FIC0gaW5uZXJIVE1MIGFzIHZhbHVlIHRvbyBuYWl2ZVxuICAgICAgICAgICAgbGV0IHByb3AgPSBub2RlLmlubmVySFRNTC5yZXBsYWNlKCd7eycsICcnKS5yZXBsYWNlKCd9fScsICcnKTtcbiAgICAgICAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dCB8fCB7fTtcbiAgICAgICAgICAgIGl0ZW0udGV4dFtwcm9wXSA9IG5vZGUuaW5uZXJIVE1MO1xuICAgICAgICAgICAgcmVmc1twcm9wXSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB3YWxrRG9tKG5vZGUuY2hpbGRyZW5baV0sIHJlZnMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlSXRlbVRlbXBsYXRlKGZyYWcpIHtcbiAgICBsZXQgcmVmcyA9IHtcbiAgICAgICAgbm9kZXM6IFtdXG4gICAgfTtcbiAgICB3YWxrRG9tKGZyYWcsIHJlZnMpO1xuICAgIHJldHVybiByZWZzO1xufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5yZW5kZXJMaXN0ID0gZnVuY3Rpb24gKGl0ZW1zLCBjb250YWluZXIsIGl0ZW1UZW1wbGF0ZSkge1xuICAgIGxldFxuICAgICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICB0bXBsID0gaXRlbVRlbXBsYXRlIHx8IHRoaXMuaXRlbVRlbXBsYXRlLFxuICAgICAgICByZWZzID0gdG1wbC5pdGVtUmVmcyxcbiAgICAgICAgY2xvbmUsXG4gICAgICAgIGRlZmVyO1xuXG4gICAgZnVuY3Rpb24gd2FybihuYW1lKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChkZWZlcik7XG4gICAgICAgIGRlZmVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0F0dGVtcHRlZCB0byBzZXQgYXR0cmlidXRlIGZyb20gbm9uLWV4aXN0ZW50IGl0ZW0gcHJvcGVydHk6JywgbmFtZSk7XG4gICAgICAgIH0sIDEpO1xuICAgIH1cblxuICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblxuICAgICAgICBsZXRcbiAgICAgICAgICAgIGlmQ291bnQgPSAwLFxuICAgICAgICAgICAgZGVsZXRpb25zID0gW107XG5cbiAgICAgICAgcmVmcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZWYpIHtcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGNhbid0IHN3YXAgYmVjYXVzZSB0aGUgaW5uZXJIVE1MIGlzIGJlaW5nIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIGNhbid0IGNsb25lIGJlY2F1c2UgdGhlbiB0aGVyZSBpcyBub3QgYSBub2RlIHJlZmVyZW5jZVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGxldFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIG5vZGUgPSByZWYubm9kZSxcbiAgICAgICAgICAgICAgICBoYXNOb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChyZWYuY29uZGl0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZi5jb25kaXRpb25hbChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNOb2RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuJ3QgYWN0dWFsbHkgZGVsZXRlLCBiZWNhdXNlIHRoaXMgaXMgdGhlIG9yaWdpbmFsIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc3RlYWQsIGFkZGluZyBhdHRyaWJ1dGUgdG8gdHJhY2sgbm9kZSwgdG8gYmUgZGVsZXRlZCBpbiBjbG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGFmdGVyLCByZW1vdmUgdGVtcG9yYXJ5IGF0dHJpYnV0ZSBmcm9tIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIHJlZi5ub2RlLnNldEF0dHJpYnV0ZSgnaWZzJywgaWZDb3VudCsnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0aW9ucy5wdXNoKCdbaWZzPVwiJytpZkNvdW50KydcIl0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZWYuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZWYuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZi5hdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZWYubm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3dhcCBhdHQnLCBrZXksIHZhbHVlLCByZWYubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVmLnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVmLnRleHQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWYudGV4dFtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3dhcCB0ZXh0Jywga2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSB2YWx1ZS5yZXBsYWNlKHZhbHVlLCBpdGVtW2tleV0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2xvbmUgPSB0bXBsLmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICBkZWxldGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZGVsKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoZGVsKTtcbiAgICAgICAgICAgIGlmKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkb20uZGVzdHJveShub2RlKTtcbiAgICAgICAgICAgICAgICBsZXQgdG1wbE5vZGUgPSB0bXBsLnF1ZXJ5U2VsZWN0b3IoZGVsKTtcbiAgICAgICAgICAgICAgICB0bXBsTm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2lmcycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnKTtcblxuICAgIC8vaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgIC8vICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIC8vICAgICAgICBpZihyZWZzW2tleV0pe1xuICAgIC8vICAgICAgICAgICAgcmVmc1trZXldLmlubmVySFRNTCA9IGl0ZW1ba2V5XTtcbiAgICAvLyAgICAgICAgfVxuICAgIC8vICAgIH0pO1xuICAgIC8vICAgIGlmKHJlZnMuYXR0cmlidXRlcyl7XG4gICAgLy8gICAgICAgIE9iamVjdC5rZXlzKHJlZnMuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIC8vICAgICAgICAgICAgbGV0IG5vZGUgPSByZWZzLmF0dHJpYnV0ZXNbbmFtZV07XG4gICAgLy8gICAgICAgICAgICBpZihpdGVtW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCBpdGVtW25hbWVdKTtcbiAgICAvLyAgICAgICAgICAgIH1lbHNle1xuICAgIC8vICAgICAgICAgICAgICAgIHdhcm4obmFtZSk7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy8gICAgICAgIH0pO1xuICAgIC8vICAgIH1cbiAgICAvL1xuICAgIC8vICAgIGNsb25lID0gdG1wbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgLy8gICAgZnJhZy5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgLy99KTtcblxuICAgIC8vY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWcpO1xufTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICdpdGVtLXRlbXBsYXRlJyxcbiAgICBvcmRlcjogNDAsXG4gICAgcHJlRG9tUmVhZHk6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlID0gZG9tLnF1ZXJ5KG5vZGUsICd0ZW1wbGF0ZScpO1xuICAgICAgICBpZiAobm9kZS5pdGVtVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUgPSBCYXNlQ29tcG9uZW50LmNsb25lKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlLml0ZW1SZWZzID0gdXBkYXRlSXRlbVRlbXBsYXRlKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9OyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxuZnVuY3Rpb24gc2V0Qm9vbGVhbiAobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0ICgpIHtcblx0XHRcdGlmKG5vZGUuaGFzQXR0cmlidXRlKHByb3ApKXtcblx0XHRcdFx0cmV0dXJuIGRvbS5ub3JtYWxpemUobm9kZS5nZXRBdHRyaWJ1dGUocHJvcCkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cdFx0c2V0ICh2YWx1ZSkge1xuXHRcdFx0aWYodmFsdWUpe1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCAnJyk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0UHJvcGVydHkgKG5vZGUsIHByb3ApIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRyZXR1cm4gZG9tLm5vcm1hbGl6ZSh0aGlzLmdldEF0dHJpYnV0ZShwcm9wKSk7XG5cdFx0fSxcblx0XHRzZXQgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0T2JqZWN0IChub2RlLCBwcm9wKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQgKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJ19fJyArIHByb3BdO1xuXHRcdH0sXG5cdFx0c2V0ICh2YWx1ZSkge1xuXHRcdFx0dGhpc1snX18nICsgcHJvcF0gPSB2YWx1ZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzIChub2RlKSB7XG5cdGxldCBwcm9wcyA9IG5vZGUucHJvcHMgfHwgbm9kZS5wcm9wZXJ0aWVzO1xuXHRpZihwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdGlmKHByb3AgPT09ICdkaXNhYmxlZCcpe1xuXHRcdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0c2V0UHJvcGVydHkobm9kZSwgcHJvcCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0Qm9vbGVhbnMgKG5vZGUpIHtcblx0bGV0IHByb3BzID0gbm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zO1xuXHRpZihwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0T2JqZWN0cyAobm9kZSkge1xuXHRsZXQgcHJvcHMgPSBub2RlLm9iamVjdHM7XG5cdGlmKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0T2JqZWN0KG5vZGUsIHByb3ApO1xuXHRcdH0pO1xuXHR9XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcblx0bmFtZTogJ3Byb3BlcnRpZXMnLFxuXHRvcmRlcjogMTAsXG5cdGluaXQ6IGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0c2V0UHJvcGVydGllcyhub2RlKTtcblx0XHRzZXRCb29sZWFucyhub2RlKTtcblx0fSxcblx0cHJlQXR0cmlidXRlQ2hhbmdlZDogZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG5cdFx0dGhpc1tuYW1lXSA9IGRvbS5ub3JtYWxpemUodmFsdWUpO1xuXHRcdGlmKCF2YWx1ZSAmJiAobm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zIHx8IFtdKS5pbmRleE9mKG5hbWUpKXtcblx0XHRcdG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge307IiwiY29uc3QgQmFzZUNvbXBvbmVudCAgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcblxuZnVuY3Rpb24gYXNzaWduUmVmcyAobm9kZSkge1xuICAgIGRvbS5xdWVyeUFsbChub2RlLCAnW3JlZl0nKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgncmVmJyk7XG4gICAgICAgIG5vZGVbbmFtZV0gPSBjaGlsZDtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYXNzaWduRXZlbnRzIChub2RlKSB7XG4gICAgLy8gPGRpdiBvbj1cImNsaWNrOm9uQ2xpY2tcIj5cbiAgICBkb20ucXVlcnlBbGwobm9kZSwgJ1tvbl0nKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGtleVZhbHVlID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdvbicpLFxuICAgICAgICAgICAgZXZlbnQgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzBdLnRyaW0oKSxcbiAgICAgICAgICAgIG1ldGhvZCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMV0udHJpbSgpO1xuICAgICAgICBub2RlLm9uKGNoaWxkLCBldmVudCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIG5vZGVbbWV0aG9kXShlKVxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3JlZnMnLFxuICAgIG9yZGVyOiAzMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGFzc2lnblJlZnMobm9kZSk7XG4gICAgICAgIGFzc2lnbkV2ZW50cyhub2RlKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbnZhclxuICAgIGxpZ2h0Tm9kZXMgPSB7fSxcbiAgICBpbnNlcnRlZCA9IHt9O1xuXG5mdW5jdGlvbiBpbnNlcnQgKG5vZGUpIHtcbiAgICBpZihpbnNlcnRlZFtub2RlLl91aWRdIHx8ICFoYXNUZW1wbGF0ZShub2RlKSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29sbGVjdExpZ2h0Tm9kZXMobm9kZSk7XG4gICAgaW5zZXJ0VGVtcGxhdGUobm9kZSk7XG4gICAgaW5zZXJ0ZWRbbm9kZS5fdWlkXSA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RMaWdodE5vZGVzKG5vZGUpe1xuICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSB8fCBbXTtcbiAgICB3aGlsZShub2RlLmNoaWxkTm9kZXMubGVuZ3RoKXtcbiAgICAgICAgbGlnaHROb2Rlc1tub2RlLl91aWRdLnB1c2gobm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkTm9kZXNbMF0pKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhc1RlbXBsYXRlIChub2RlKSB7XG4gICAgcmV0dXJuICEhbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGVDaGFpbiAobm9kZSkge1xuICAgIHZhciB0ZW1wbGF0ZXMgPSBub2RlLmdldFRlbXBsYXRlQ2hhaW4oKTtcbiAgICB0ZW1wbGF0ZXMucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgIGdldENvbnRhaW5lcihub2RlKS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlKSk7XG4gICAgfSk7XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlIChub2RlKSB7XG4gICAgaWYobm9kZS5uZXN0ZWRUZW1wbGF0ZSl7XG4gICAgICAgIGluc2VydFRlbXBsYXRlQ2hhaW4obm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyXG4gICAgICAgIHRlbXBsYXRlTm9kZSA9IG5vZGUuZ2V0VGVtcGxhdGVOb2RlKCk7XG5cbiAgICBpZih0ZW1wbGF0ZU5vZGUpIHtcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlTm9kZSkpO1xuICAgIH1cbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyIChub2RlKSB7XG4gICAgdmFyIGNvbnRhaW5lcnMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWY9XCJjb250YWluZXJcIl0nKTtcbiAgICBpZighY29udGFpbmVycyB8fCAhY29udGFpbmVycy5sZW5ndGgpe1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRhaW5lcnNbY29udGFpbmVycy5sZW5ndGggLSAxXTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0Q2hpbGRyZW4gKG5vZGUpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKG5vZGUpLFxuICAgICAgICBjaGlsZHJlbiA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXTtcblxuICAgIGlmKGNvbnRhaW5lciAmJiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICBmb3IoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRMaWdodE5vZGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsaWdodE5vZGVzW3RoaXMuX3VpZF07XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZU5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2FjaGluZyBjYXVzZXMgZGlmZmVyZW50IGNsYXNzZXMgdG8gcHVsbCB0aGUgc2FtZSB0ZW1wbGF0ZSAtIHdhdD9cbiAgICAvL2lmKCF0aGlzLnRlbXBsYXRlTm9kZSkge1xuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZUlkKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlTm9kZSA9IGRvbS5ieUlkKHRoaXMudGVtcGxhdGVJZC5yZXBsYWNlKCcjJywnJykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMudGVtcGxhdGVTdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gZG9tLnRvRG9tKCc8dGVtcGxhdGU+JyArIHRoaXMudGVtcGxhdGVTdHJpbmcgKyAnPC90ZW1wbGF0ZT4nKTtcbiAgICAgICAgfVxuICAgIC8vfVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlTm9kZTtcbn07XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlQ2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBsZXRcbiAgICAgICAgY29udGV4dCA9IHRoaXMsXG4gICAgICAgIHRlbXBsYXRlcyA9IFtdLFxuICAgICAgICB0ZW1wbGF0ZTtcblxuICAgIC8vIHdhbGsgdGhlIHByb3RvdHlwZSBjaGFpbjsgQmFiZWwgZG9lc24ndCBhbGxvdyB1c2luZ1xuICAgIC8vIGBzdXBlcmAgc2luY2Ugd2UgYXJlIG91dHNpZGUgb2YgdGhlIENsYXNzXG4gICAgd2hpbGUoY29udGV4dCl7XG4gICAgICAgIGNvbnRleHQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udGV4dCk7XG4gICAgICAgIGlmKCFjb250ZXh0KXsgYnJlYWs7IH1cbiAgICAgICAgLy8gc2tpcCBwcm90b3R5cGVzIHdpdGhvdXQgYSB0ZW1wbGF0ZVxuICAgICAgICAvLyAoZWxzZSBpdCB3aWxsIHB1bGwgYW4gaW5oZXJpdGVkIHRlbXBsYXRlIGFuZCBjYXVzZSBkdXBsaWNhdGVzKVxuICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZVN0cmluZycpIHx8IGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlSWQnKSkge1xuICAgICAgICAgICAgdGVtcGxhdGUgPSBjb250ZXh0LmdldFRlbXBsYXRlTm9kZSgpO1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzLnB1c2godGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZW1wbGF0ZXM7XG59O1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3RlbXBsYXRlJyxcbiAgICBvcmRlcjogMjAsXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpbnNlcnQobm9kZSk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge307Il19
