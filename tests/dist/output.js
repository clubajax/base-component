require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const BaseComponent = require('BaseComponent');
const dom = require('dom');
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const r = /\{\{\w*}}/g;

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

    let item = {
        node: node
    };

    refs.nodes.push(item);

    if (node.attributes) {
        for (let i = 0; i < node.attributes.length; i++) {
            let
                name = node.attributes[i].name,
                value = node.attributes[i].value;
            console.log('  ', name, value);
            if (name === 'if') {
                item.conditional = createCondition(name, value);
            }
            else if (/\{\{/.test(value)) {
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
            let prop = node.innerHTML.replace('{{', '').replace('}}', '');
            item.text = item.text || {};
            item.text[prop] = node.innerHTML;
            refs[prop] = node;
        }
        return;
    }

    for (let i = 0; i < node.children.length; i++) {
        walkDom(node.children[i], refs);
    }
}

function updateItemTemplate(frag) {
    let refs = {
        nodes: []
    };
    walkDom(frag, refs);
    return refs;
}

BaseComponent.prototype.renderList = function (items, container, itemTemplate) {
    let
        frag = document.createDocumentFragment(),
        tmpl = itemTemplate || this.itemTemplate,
        refs = tmpl.itemRefs,
        clone,
        defer;

    function warn(name) {
        clearTimeout(defer);
        defer = setTimeout(function () {
            console.warn('Attempted to set attribute from non-existent item property:', name);
        }, 1);
    }

    items.forEach(function (item) {

        let
            ifCount = 0,
            deletions = [];

        refs.nodes.forEach(function (ref) {

            //
            // can't swap because the innerHTML is being changed
            // can't clone because then there is not a node reference
            //
            let
                value,
                node = ref.node,
                hasNode = true;
            if (ref.conditional) {
                if (!ref.conditional(item)) {
                    hasNode = false;
                    ifCount++;
                    // can't actually delete, because this is the original template
                    // instead, adding attribute to track node, to be deleted in clone
                    // then after, remove temporary attribute from template
                    ref.node.setAttribute('ifs', ifCount+'');
                    deletions.push('[ifs="'+ifCount+'"]');
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
                        node.innerHTML = value.replace(value, item[key])
                    });
                }
            }
        });

        clone = tmpl.cloneNode(true);

        deletions.forEach(function (del) {
            let node = clone.querySelector(del);
            if(node) {
                dom.destroy(node);
                let tmplNode = tmpl.querySelector(del);
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
    preDomReady: function (node) {
        node.itemTemplate = dom.query(node, 'template');
        if (node.itemTemplate) {
            node.itemTemplate.parentNode.removeChild(node.itemTemplate);
            node.itemTemplate = BaseComponent.clone(node.itemTemplate);
            node.itemTemplate.itemRefs = updateItemTemplate(node.itemTemplate);
        }
    }
});

module.exports = {
	'item-template': true
};
},{"BaseComponent":"BaseComponent","dom":"dom"}],2:[function(require,module,exports){
const BaseComponent = require('BaseComponent');
const dom = require('dom');

function onify (name) {
	return 'on' + name.substring(0,1).toUpperCase() + name.substring(1);
}

function setBoolean (node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			return node.hasAttribute(prop);
		},
		set (value) {
			this.isSettingAttribute = true;
			if (value) {
				this.setAttribute(prop, '');
			} else {
				this.removeAttribute(prop);
			}
			const fn = this[onify(prop)];
			if(fn){
				fn(value);
			}

			this.isSettingAttribute = false;
		}
	});
}

function setProperty (node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			return dom.normalize(this.getAttribute(prop));
		},
		set (value) {
			this.isSettingAttribute = true;
			this.setAttribute(prop, value);
			const fn = this[onify(prop)];
			if(fn){
				fn(value);
			}
			this.isSettingAttribute = false;
		}
	});
}

function setObject (node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			return this['__' + prop];
		},
		set (value) {
			this['__' + prop] = value;
		}
	});
}

function setProperties (node) {
	let props = node.props || node.properties;
	if (props) {
		props.forEach(function (prop) {
			if (prop === 'disabled') {
				setBoolean(node, prop);
			}
			else {
				setProperty(node, prop);
			}
		});
	}
}

function setBooleans (node) {
	let props = node.bools || node.booleans;
	if (props) {
		props.forEach(function (prop) {
			setBoolean(node, prop);
		});
	}
}

function setObjects (node) {
	let props = node.objects;
	if (props) {
		props.forEach(function (prop) {
			setObject(node, prop);
		});
	}
}

BaseComponent.addPlugin({
	name: 'properties',
	order: 10,
	init: function (node) {
		setProperties(node);
		setBooleans(node);
	},
	preAttributeChanged: function (node, name, value) {
		if (node.isSettingAttribute) {
			return false;
		}
		node[name] = dom.normalize(value);
		if (value === null && (node.bools || node.booleans || []).indexOf(name)) {
			node.removeAttribute(name);
		}
	}
});
},{"BaseComponent":"BaseComponent","dom":"dom"}],3:[function(require,module,exports){
const dom = require('dom');
const BaseComponent = require('BaseComponent');

function assignRefs (node) {
    dom.queryAll(node, '[ref]').forEach(function (child) {
        let name = child.getAttribute('ref');
        node[name] = child;
    });
}

function assignEvents (node) {
    // <div on="click:onClick">
    dom.queryAll(node, '[on]').forEach(function (child) {
        let
            keyValue = child.getAttribute('on'),
            event = keyValue.split(':')[0].trim(),
            method = keyValue.split(':')[1].trim();
        node.on(child, event, function (e) {
            node[method](e)
        })
    });
}

BaseComponent.addPlugin({
    name: 'refs',
    order: 30,
    preConnected: function (node) {
        assignRefs(node);
        assignEvents(node);
    }
});
},{"BaseComponent":"BaseComponent","dom":"dom"}],4:[function(require,module,exports){
const BaseComponent  = require('BaseComponent');
const dom = require('dom');

var
    lightNodes = {},
    inserted = {};

function insert (node) {
    if(inserted[node._uid] || !hasTemplate(node)){
        return;
    }
    collectLightNodes(node);
    insertTemplate(node);
    inserted[node._uid] = true;
}

function collectLightNodes(node){
    lightNodes[node._uid] = lightNodes[node._uid] || [];
    while(node.childNodes.length){
        lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
    }
}

function hasTemplate (node) {
    return !!node.getTemplateNode();
}

function insertTemplateChain (node) {
    var templates = node.getTemplateChain();
    templates.reverse().forEach(function (template) {
        getContainer(node).appendChild(BaseComponent.clone(template));
    });
    insertChildren(node);
}

function insertTemplate (node) {
    if(node.nestedTemplate){
        insertTemplateChain(node);
        return;
    }
    var
        templateNode = node.getTemplateNode();

    if(templateNode) {
        node.appendChild(BaseComponent.clone(templateNode));
    }
    insertChildren(node);
}

function getContainer (node) {
    var containers = node.querySelectorAll('[ref="container"]');
    if(!containers || !containers.length){
        return node;
    }
    return containers[containers.length - 1];
}

function insertChildren (node) {
    var i,
        container = getContainer(node),
        children = lightNodes[node._uid];

    if(container && children && children.length){
        for(i = 0; i < children.length; i++){
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
            this.templateNode = dom.byId(this.templateId.replace('#',''));
        }
        else if (this.templateString) {
            this.templateNode = dom.toDom('<template>' + this.templateString + '</template>');
        }
    //}
    return this.templateNode;
};

BaseComponent.prototype.getTemplateChain = function () {

    let
        context = this,
        templates = [],
        template;

    // walk the prototype chain; Babel doesn't allow using
    // `super` since we are outside of the Class
    while(context){
        context = Object.getPrototypeOf(context);
        if(!context){ break; }
        // skip prototypes without a template
        // (else it will pull an inherited template and cause duplicates)
        if(context.hasOwnProperty('templateString') || context.hasOwnProperty('templateId')) {
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
    preConnected: function (node) {
        insert(node);
    }
});
},{"BaseComponent":"BaseComponent","dom":"dom"}],5:[function(require,module,exports){
const BaseComponent  = require('../../src/BaseComponent');
const properties = require('../../src/properties');
const template = require('../../src/template');
const refs = require('../../src/refs');
const itemTemplate = require('../../src/item-template');

class TestProps extends BaseComponent {

    static get observedAttributes() { return ['foo', 'bar', 'nbc', 'cbs', 'disabled', 'readonly', 'tabindex']; }
    get props () { return ['foo', 'bar', 'tabindex']; }
    get bools () { return ['nbc', 'cbs', 'disabled', 'readonly']; }

    attributeChanged (name, value) {
        this[name + '-changed'] = dom.normalize(value) || value !== null;
    }
}

customElements.define('test-props', TestProps);

class TestLifecycle extends BaseComponent {

    static get observedAttributes() {return ['foo', 'bar']; }

    set foo (value) {
        this.__foo = value;
    }

    get foo () {
        return this.__foo;
    }

    set bar (value) {
        this.__bar = value;
    }

    get bar () {
        return this.__bar || 'NOTSET';
    }

    constructor(...args) {
        super();
    }

    connected () {
        on.fire(document, 'connected-called', this);
    }

    domReady () {
        on.fire(document, 'domready-called', this);
    }

    disconnected () {
        on.fire(document, 'disconnected-called', this);
    }

}

customElements.define('test-lifecycle', TestLifecycle);

BaseComponent.addPlugin({
    init: function (node, a, b, c) {
        on.fire(document, 'init-called');
    },
    preConnected: function (node, a, b, c) {
        on.fire(document, 'preConnected-called');
    },
    postConnected: function (node, a, b, c) {
        on.fire(document, 'postConnected-called');
    },
    preDomReady: function (node, a, b, c) {
        on.fire(document, 'preDomReady-called');
    },
    postDomReady: function (node, a, b, c) {
        on.fire(document, 'postDomReady-called');
    }
});


class TestTmplString extends BaseComponent {
    get templateString () {
        return `<div>This is a simple template</div>`;
    }
}
customElements.define('test-tmpl-string', TestTmplString);

class TestTmplId extends BaseComponent {
    get templateId () {
        return 'test-tmpl-id-template';
    }
}
customElements.define('test-tmpl-id', TestTmplId);


class TestTmplRefs extends BaseComponent {
    get templateString () {
        return `<div on="click:onClick" ref="clickNode">
            <label ref="labelNode">label:</label>
            <span ref="valueNode">value</span>
        </div>`;
    }

    onClick () {
        on.fire(document, 'ref-click-called');
    }
}
customElements.define('test-tmpl-refs', TestTmplRefs);

class TestTmplContainer extends BaseComponent {
    get templateString () {
        return `<div>
            <label ref="labelNode">label:</label>
            <span ref="valueNode">value</span>
            <div ref="container"></div>
        </div>`;
    }
}
customElements.define('test-tmpl-container', TestTmplContainer);


// simple nested templates
class TestTmplNestedA extends BaseComponent {
    constructor () {
        super();
        this.nestedTemplate = true;
    }

    get templateString () {
        return `<section>
            <div>content A before</div>
            <section ref="container"></section>
            <div>content A after</div>
        </section>`;
    }
}
customElements.define('test-tmpl-nested-a', TestTmplNestedA);

class TestTmplNestedB extends TestTmplNestedA {
    constructor () {
        super();
    }
    get templateString () {
        return `<div>content B</div>`;
    }
}
customElements.define('test-tmpl-nested-b', TestTmplNestedB);


// nested plus light dom
class TestTmplNestedC extends TestTmplNestedA {
    constructor () {
        super();
    }
    get templateString () {
        return `<section>
            <div>content C before</div>
            <div ref="container"></div>
            <div>content C after</div>
        </section>`;
    }
}
customElements.define('test-tmpl-nested-c', TestTmplNestedC);


// 5-deep nested templates
class TestA extends BaseComponent {}
class TestB extends TestA {
    constructor () {
        super();
    }
    get templateString () {
        return `<section>
            <div>content B before</div>
            <section ref="container"></section>
            <div>content B after</div>
        </section>`;
    }
}
class TestC extends TestB {}
class TestD extends TestC {
    constructor () {
        super();
    }
    get templateString () {
        return `<div>content D</div>`;
    }
}
class TestE extends TestD {
    constructor () {
        super();
        this.nestedTemplate = true;
    }
}
customElements.define('test-a', TestA);
customElements.define('test-b', TestB);
customElements.define('test-c', TestC);
customElements.define('test-d', TestD);
customElements.define('test-e', TestE);

class TestList extends BaseComponent {

    static get observedAttributes() { return ['list-title']; }
    get props () { return ['list-title']; }

    constructor () {
        super();
    }

    get templateString () {
        return `
            <div class="title" ref="titleNode"></div>
            <div ref="container"></div>`;
    }
    
    set data (items) {
        this.renderList(items, this.container);
    }

    domReady () {
        this.titleNode.innerHTML = this['list-title'];
    }
}
customElements.define('test-list', TestList);



window.itemTemplateString = `<template>
    <div id="{{id}}">
        <span>{{first}}</span>
        <span>{{last}}</span>
        <span>{{role}}</span>
    </div>
</template>`;

window.ifAttrTemplateString = `<template>
    <div id="{{id}}">
        <span>{{first}}</span>
        <span>{{last}}</span>
        <span>{{role}}</span>
        <span if="{{amount}} < 2" class="amount">{{amount}}</span>
        <span if="{{type}} === 'sane'" class="sanity">{{type}}</span>
    </div>
</template>`;

function dev () {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var s = '{{amount}} + {{num}} + 3';
    var list = [{amount: 1, num: 2}, {amount: 3, num: 4}, {amount: 5, num: 6}];
    var r = /\{\{\w*}}/g;
    var fn = [];
    var args = [];
    var f;
    s = s.replace(r, function(w){
        console.log('word', w);
        var v = alphabet.shift();
        fn.push(v);
        args.push(/\w+/g.exec(w)[0]);
        return v;
    });
    fn.push(s);

    console.log('fn', fn);
    console.log('args', args);
    //s = 'return ' + s + ';';
    console.log('s', s);

    window.f = new Function(s);

    var dynFn = function (a,b,c,d,e,f) {
        var r = eval(s);
        return r;
    };

    console.log('  f:', dynFn(1,2));
    //
    list.forEach(function (item) {
        var a = args.map(function (arg) {
            return item[arg];
        });
        var r = dynFn.apply(null, a);
        console.log('r', r);
    });


}
//dev();
},{"../../src/BaseComponent":"BaseComponent","../../src/item-template":1,"../../src/properties":2,"../../src/refs":3,"../../src/template":4}],"BaseComponent":[function(require,module,exports){
"use strict";

// class/component rules
// always call super() first in the ctor. This also calls the extended class' ctor.
// cannot call NEW on a Component class

// Classes http://exploringjs.com/es6/ch_classes.html#_the-species-pattern-in-static-methods

const on = require('on');
const dom = require('dom');

class BaseComponent extends HTMLElement {
	constructor() {
		super();
		this._uid = dom.uid(this.localName);
		privates[this._uid] = {DOMSTATE: 'created'};
		privates[this._uid].handleList = [];
		plugin('init', this);
	}

	connectedCallback() {
		privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
		plugin('preConnected', this);
		nextTick(onCheckDomReady.bind(this));
		if (this.connected) {
			this.connected();
		}
		this.fire('connected');
		plugin('postConnected', this);
	}

	disconnectedCallback() {
		privates[this._uid].DOMSTATE = 'disconnected';
		plugin('preDisconnected', this);
		if (this.disconnected) {
			this.disconnected();
		}
		this.fire('disconnected');

		let time, dod = BaseComponent.destroyOnDisconnect;
		if (dod) {
			time = typeof doc === 'number' ? doc : 300;
			setTimeout(() => {
				if(this.DOMSTATE === 'disconnected'){
					this.destroy();
				}
			}, time);
		}
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		plugin('preAttributeChanged', this, attrName, newVal, oldVal);
		if (this.attributeChanged) {
			this.attributeChanged(attrName, newVal, oldVal);
		}
	}

	destroy() {
		this.fire('destroy');
		privates[this._uid].handleList.forEach(function (handle) {
			handle.remove();
		});
		dom.destroy(this);
	}

	fire(eventName, eventDetail, bubbles) {
		return on.fire(this, eventName, eventDetail, bubbles);
	}

	emit(eventName, value) {
		return on.emit(this, eventName, value);
	}

	on(node, eventName, selector, callback) {
		return this.registerHandle(
			typeof node !== 'string' ? // no node is supplied
				on(node, eventName, selector, callback) :
				on(this, node, eventName, selector));
	}

	once(node, eventName, selector, callback) {
		return this.registerHandle(
			typeof node !== 'string' ? // no node is supplied
				on.once(node, eventName, selector, callback) :
				on.once(this, node, eventName, selector, callback));
	}

	registerHandle(handle) {
		privates[this._uid].handleList.push(handle);
		return handle;
	}

	get DOMSTATE() {
		return privates[this._uid].DOMSTATE;
	}

	static set destroyOnDisconnect(value) {
		privates['destroyOnDisconnect'] = value;
	}

	static get destroyOnDisconnect() {
		return privates['destroyOnDisconnect'];
	}

	static clone(template) {
		if (template.content && template.content.children) {
			return document.importNode(template.content, true);
		}
		var
			frag = document.createDocumentFragment(),
			cloneNode = document.createElement('div');
		cloneNode.innerHTML = template.innerHTML;

		while (cloneNode.children.length) {
			frag.appendChild(cloneNode.children[0]);
		}
		return frag;
	}

	static addPlugin(plug) {
		var i, order = plug.order || 100;
		if (!plugins.length) {
			plugins.push(plug);
		}
		else if (plugins.length === 1) {
			if (plugins[0].order <= order) {
				plugins.push(plug);
			}
			else {
				plugins.unshift(plug);
			}
		}
		else if (plugins[0].order > order) {
			plugins.unshift(plug);
		}
		else {

			for (i = 1; i < plugins.length; i++) {
				if (order === plugins[i - 1].order || (order > plugins[i - 1].order && order < plugins[i].order)) {
					plugins.splice(i, 0, plug);
					return;
				}
			}
			// was not inserted...
			plugins.push(plug);
		}
	}
}

let
	privates = {},
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

	let
		count = 0,
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
	}
	else {
		// else, wait for all children to fire their `ready` events
		//
		children.forEach(function (child) {
			// check if child is already ready
			// also check for connected - this handles moving a node from another node
			if (child.DOMSTATE === 'domready' || child.DOMSTATE === 'connected') {
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
		this.domReady = function () {
		};
	}

	this.fire('domready');

	plugin('postDomReady', this);
}

function getChildCustomNodes(node) {
	// collect any children that are custom nodes
	// used to check if their dom is ready before
	// determining if this is ready
	var i, nodes = [];
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
	}
	else {
		node.addEventListener('domready', onReady);
	}
};

module.exports = BaseComponent;
},{"dom":"dom","on":"on"}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaXRlbS10ZW1wbGF0ZS5qcyIsInNyYy9wcm9wZXJ0aWVzLmpzIiwic3JjL3JlZnMuanMiLCJzcmMvdGVtcGxhdGUuanMiLCJ0ZXN0cy9zcmMvbGlmZWN5Y2xlLmpzIiwic3JjL0Jhc2VDb21wb25lbnQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IEJhc2VDb21wb25lbnQgPSByZXF1aXJlKCdCYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcbmNvbnN0IGFscGhhYmV0ID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jy5zcGxpdCgnJyk7XG5jb25zdCByID0gL1xce1xce1xcdyp9fS9nO1xuXG4vLyBUT0RPOiBzd2l0Y2ggdG8gRVM2IGxpdGVyYWxzPyBNYXliZSBub3QuLi5cblxuLy8gRklYTUU6IHRpbWUgY3VycmVudCBwcm9jZXNzXG4vLyBUcnkgYSBuZXcgb25lIHdoZXJlIG1ldGEgZGF0YSBpcyBjcmVhdGVkLCBpbnN0ZWFkIG9mIGEgdGVtcGxhdGVcblxuZnVuY3Rpb24gY3JlYXRlQ29uZGl0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgLy8gRklYTUUgbmFtZT9cbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UociwgZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgdyA9IHcucmVwbGFjZSgne3snLCAnJykucmVwbGFjZSgnfX0nLCAnJyk7XG4gICAgICAgIHJldHVybiAnaXRlbVtcIicgKyB3ICsgJ1wiXSc7XG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coJ2NyZWF0ZUNvbmRpdGlvbicsIG5hbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGV2YWwodmFsdWUpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHdhbGtEb20obm9kZSwgcmVmcykge1xuXG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICAgIG5vZGU6IG5vZGVcbiAgICB9O1xuXG4gICAgcmVmcy5ub2Rlcy5wdXNoKGl0ZW0pO1xuXG4gICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vZGUuYXR0cmlidXRlc1tpXS5uYW1lLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gbm9kZS5hdHRyaWJ1dGVzW2ldLnZhbHVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyAgJywgbmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdpZicpIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNvbmRpdGlvbmFsID0gY3JlYXRlQ29uZGl0aW9uKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKC9cXHtcXHsvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgLy8gPGRpdiBpZD1cInt7aWR9fVwiPlxuICAgICAgICAgICAgICAgIHJlZnMuYXR0cmlidXRlcyA9IHJlZnMuYXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBpdGVtLmF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gY291bGQgYmUgbW9yZSB0aGFuIG9uZT8/XG4gICAgICAgICAgICAgICAgLy8gc2FtZSB3aXRoIG5vZGU/XG4gICAgICAgICAgICAgICAgcmVmcy5hdHRyaWJ1dGVzW25hbWVdID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNob3VsZCBwcm9iYWJseSBsb29wIG92ZXIgY2hpbGROb2RlcyBhbmQgY2hlY2sgdGV4dCBub2RlcyBmb3IgcmVwbGFjZW1lbnRzXG4gICAgLy9cbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIGlmICgvXFx7XFx7Ly50ZXN0KG5vZGUuaW5uZXJIVE1MKSkge1xuICAgICAgICAgICAgLy8gRklYTUUgLSBpbm5lckhUTUwgYXMgdmFsdWUgdG9vIG5haXZlXG4gICAgICAgICAgICBsZXQgcHJvcCA9IG5vZGUuaW5uZXJIVE1MLnJlcGxhY2UoJ3t7JywgJycpLnJlcGxhY2UoJ319JywgJycpO1xuICAgICAgICAgICAgaXRlbS50ZXh0ID0gaXRlbS50ZXh0IHx8IHt9O1xuICAgICAgICAgICAgaXRlbS50ZXh0W3Byb3BdID0gbm9kZS5pbm5lckhUTUw7XG4gICAgICAgICAgICByZWZzW3Byb3BdID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHdhbGtEb20obm9kZS5jaGlsZHJlbltpXSwgcmVmcyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVJdGVtVGVtcGxhdGUoZnJhZykge1xuICAgIGxldCByZWZzID0ge1xuICAgICAgICBub2RlczogW11cbiAgICB9O1xuICAgIHdhbGtEb20oZnJhZywgcmVmcyk7XG4gICAgcmV0dXJuIHJlZnM7XG59XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLnJlbmRlckxpc3QgPSBmdW5jdGlvbiAoaXRlbXMsIGNvbnRhaW5lciwgaXRlbVRlbXBsYXRlKSB7XG4gICAgbGV0XG4gICAgICAgIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgIHRtcGwgPSBpdGVtVGVtcGxhdGUgfHwgdGhpcy5pdGVtVGVtcGxhdGUsXG4gICAgICAgIHJlZnMgPSB0bXBsLml0ZW1SZWZzLFxuICAgICAgICBjbG9uZSxcbiAgICAgICAgZGVmZXI7XG5cbiAgICBmdW5jdGlvbiB3YXJuKG5hbWUpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGRlZmVyKTtcbiAgICAgICAgZGVmZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQXR0ZW1wdGVkIHRvIHNldCBhdHRyaWJ1dGUgZnJvbSBub24tZXhpc3RlbnQgaXRlbSBwcm9wZXJ0eTonLCBuYW1lKTtcbiAgICAgICAgfSwgMSk7XG4gICAgfVxuXG4gICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXG4gICAgICAgIGxldFxuICAgICAgICAgICAgaWZDb3VudCA9IDAsXG4gICAgICAgICAgICBkZWxldGlvbnMgPSBbXTtcblxuICAgICAgICByZWZzLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHJlZikge1xuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gY2FuJ3Qgc3dhcCBiZWNhdXNlIHRoZSBpbm5lckhUTUwgaXMgYmVpbmcgY2hhbmdlZFxuICAgICAgICAgICAgLy8gY2FuJ3QgY2xvbmUgYmVjYXVzZSB0aGVuIHRoZXJlIGlzIG5vdCBhIG5vZGUgcmVmZXJlbmNlXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgbGV0XG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgbm9kZSA9IHJlZi5ub2RlLFxuICAgICAgICAgICAgICAgIGhhc05vZGUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHJlZi5jb25kaXRpb25hbCkge1xuICAgICAgICAgICAgICAgIGlmICghcmVmLmNvbmRpdGlvbmFsKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc05vZGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWZDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4ndCBhY3R1YWxseSBkZWxldGUsIGJlY2F1c2UgdGhpcyBpcyB0aGUgb3JpZ2luYWwgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zdGVhZCwgYWRkaW5nIGF0dHJpYnV0ZSB0byB0cmFjayBub2RlLCB0byBiZSBkZWxldGVkIGluIGNsb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gYWZ0ZXIsIHJlbW92ZSB0ZW1wb3JhcnkgYXR0cmlidXRlIGZyb20gdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgcmVmLm5vZGUuc2V0QXR0cmlidXRlKCdpZnMnLCBpZkNvdW50KycnKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRpb25zLnB1c2goJ1tpZnM9XCInK2lmQ291bnQrJ1wiXScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZi5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlZi5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVmLmF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZi5ub2RlLnNldEF0dHJpYnV0ZShrZXksIGl0ZW1ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzd2FwIGF0dCcsIGtleSwgdmFsdWUsIHJlZi5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZWYudGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZWYudGV4dCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZi50ZXh0W2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzd2FwIHRleHQnLCBrZXksIGl0ZW1ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IHZhbHVlLnJlcGxhY2UodmFsdWUsIGl0ZW1ba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjbG9uZSA9IHRtcGwuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgIGRlbGV0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChkZWwpIHtcbiAgICAgICAgICAgIGxldCBub2RlID0gY2xvbmUucXVlcnlTZWxlY3RvcihkZWwpO1xuICAgICAgICAgICAgaWYobm9kZSkge1xuICAgICAgICAgICAgICAgIGRvbS5kZXN0cm95KG5vZGUpO1xuICAgICAgICAgICAgICAgIGxldCB0bXBsTm9kZSA9IHRtcGwucXVlcnlTZWxlY3RvcihkZWwpO1xuICAgICAgICAgICAgICAgIHRtcGxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnaWZzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWcpO1xuXG4gICAgLy9pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgLy8gICAgT2JqZWN0LmtleXMoaXRlbSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgLy8gICAgICAgIGlmKHJlZnNba2V5XSl7XG4gICAgLy8gICAgICAgICAgICByZWZzW2tleV0uaW5uZXJIVE1MID0gaXRlbVtrZXldO1xuICAgIC8vICAgICAgICB9XG4gICAgLy8gICAgfSk7XG4gICAgLy8gICAgaWYocmVmcy5hdHRyaWJ1dGVzKXtcbiAgICAvLyAgICAgICAgT2JqZWN0LmtleXMocmVmcy5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgLy8gICAgICAgICAgICBsZXQgbm9kZSA9IHJlZnMuYXR0cmlidXRlc1tuYW1lXTtcbiAgICAvLyAgICAgICAgICAgIGlmKGl0ZW1bbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgIC8vICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIGl0ZW1bbmFtZV0pO1xuICAgIC8vICAgICAgICAgICAgfWVsc2V7XG4gICAgLy8gICAgICAgICAgICAgICAgd2FybihuYW1lKTtcbiAgICAvLyAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgfSk7XG4gICAgLy8gICAgfVxuICAgIC8vXG4gICAgLy8gICAgY2xvbmUgPSB0bXBsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAvLyAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAvL30pO1xuXG4gICAgLy9jb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZyk7XG59O1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ2l0ZW0tdGVtcGxhdGUnLFxuICAgIG9yZGVyOiA0MCxcbiAgICBwcmVEb21SZWFkeTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUgPSBkb20ucXVlcnkobm9kZSwgJ3RlbXBsYXRlJyk7XG4gICAgICAgIGlmIChub2RlLml0ZW1UZW1wbGF0ZSkge1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZSA9IEJhc2VDb21wb25lbnQuY2xvbmUobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUuaXRlbVJlZnMgPSB1cGRhdGVJdGVtVGVtcGxhdGUobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHQnaXRlbS10ZW1wbGF0ZSc6IHRydWVcbn07IiwiY29uc3QgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJ0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuXG5mdW5jdGlvbiBvbmlmeSAobmFtZSkge1xuXHRyZXR1cm4gJ29uJyArIG5hbWUuc3Vic3RyaW5nKDAsMSkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyaW5nKDEpO1xufVxuXG5mdW5jdGlvbiBzZXRCb29sZWFuIChub2RlLCBwcm9wKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0Z2V0ICgpIHtcblx0XHRcdHJldHVybiBub2RlLmhhc0F0dHJpYnV0ZShwcm9wKTtcblx0XHR9LFxuXHRcdHNldCAodmFsdWUpIHtcblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCAnJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGZuID0gdGhpc1tvbmlmeShwcm9wKV07XG5cdFx0XHRpZihmbil7XG5cdFx0XHRcdGZuKHZhbHVlKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eSAobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRyZXR1cm4gZG9tLm5vcm1hbGl6ZSh0aGlzLmdldEF0dHJpYnV0ZShwcm9wKSk7XG5cdFx0fSxcblx0XHRzZXQgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG5cdFx0XHRjb25zdCBmbiA9IHRoaXNbb25pZnkocHJvcCldO1xuXHRcdFx0aWYoZm4pe1xuXHRcdFx0XHRmbih2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdCAobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1snX18nICsgcHJvcF07XG5cdFx0fSxcblx0XHRzZXQgKHZhbHVlKSB7XG5cdFx0XHR0aGlzWydfXycgKyBwcm9wXSA9IHZhbHVlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXMgKG5vZGUpIHtcblx0bGV0IHByb3BzID0gbm9kZS5wcm9wcyB8fCBub2RlLnByb3BlcnRpZXM7XG5cdGlmIChwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdGlmIChwcm9wID09PSAnZGlzYWJsZWQnKSB7XG5cdFx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2V0UHJvcGVydHkobm9kZSwgcHJvcCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0Qm9vbGVhbnMgKG5vZGUpIHtcblx0bGV0IHByb3BzID0gbm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zO1xuXHRpZiAocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdHMgKG5vZGUpIHtcblx0bGV0IHByb3BzID0gbm9kZS5vYmplY3RzO1xuXHRpZiAocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRzZXRPYmplY3Qobm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuXHRuYW1lOiAncHJvcGVydGllcycsXG5cdG9yZGVyOiAxMCxcblx0aW5pdDogZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRzZXRQcm9wZXJ0aWVzKG5vZGUpO1xuXHRcdHNldEJvb2xlYW5zKG5vZGUpO1xuXHR9LFxuXHRwcmVBdHRyaWJ1dGVDaGFuZ2VkOiBmdW5jdGlvbiAobm9kZSwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobm9kZS5pc1NldHRpbmdBdHRyaWJ1dGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0bm9kZVtuYW1lXSA9IGRvbS5ub3JtYWxpemUodmFsdWUpO1xuXHRcdGlmICh2YWx1ZSA9PT0gbnVsbCAmJiAobm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zIHx8IFtdKS5pbmRleE9mKG5hbWUpKSB7XG5cdFx0XHRub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHR9XG5cdH1cbn0pOyIsImNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuY29uc3QgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJ0Jhc2VDb21wb25lbnQnKTtcblxuZnVuY3Rpb24gYXNzaWduUmVmcyAobm9kZSkge1xuICAgIGRvbS5xdWVyeUFsbChub2RlLCAnW3JlZl0nKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBsZXQgbmFtZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgncmVmJyk7XG4gICAgICAgIG5vZGVbbmFtZV0gPSBjaGlsZDtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYXNzaWduRXZlbnRzIChub2RlKSB7XG4gICAgLy8gPGRpdiBvbj1cImNsaWNrOm9uQ2xpY2tcIj5cbiAgICBkb20ucXVlcnlBbGwobm9kZSwgJ1tvbl0nKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBsZXRcbiAgICAgICAgICAgIGtleVZhbHVlID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdvbicpLFxuICAgICAgICAgICAgZXZlbnQgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzBdLnRyaW0oKSxcbiAgICAgICAgICAgIG1ldGhvZCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMV0udHJpbSgpO1xuICAgICAgICBub2RlLm9uKGNoaWxkLCBldmVudCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIG5vZGVbbWV0aG9kXShlKVxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3JlZnMnLFxuICAgIG9yZGVyOiAzMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGFzc2lnblJlZnMobm9kZSk7XG4gICAgICAgIGFzc2lnbkV2ZW50cyhub2RlKTtcbiAgICB9XG59KTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJ0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuXG52YXJcbiAgICBsaWdodE5vZGVzID0ge30sXG4gICAgaW5zZXJ0ZWQgPSB7fTtcblxuZnVuY3Rpb24gaW5zZXJ0IChub2RlKSB7XG4gICAgaWYoaW5zZXJ0ZWRbbm9kZS5fdWlkXSB8fCAhaGFzVGVtcGxhdGUobm9kZSkpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbGxlY3RMaWdodE5vZGVzKG5vZGUpO1xuICAgIGluc2VydFRlbXBsYXRlKG5vZGUpO1xuICAgIGluc2VydGVkW25vZGUuX3VpZF0gPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKXtcbiAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0gPSBsaWdodE5vZGVzW25vZGUuX3VpZF0gfHwgW107XG4gICAgd2hpbGUobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCl7XG4gICAgICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXS5wdXNoKG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5jaGlsZE5vZGVzWzBdKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYXNUZW1wbGF0ZSAobm9kZSkge1xuICAgIHJldHVybiAhIW5vZGUuZ2V0VGVtcGxhdGVOb2RlKCk7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlQ2hhaW4gKG5vZGUpIHtcbiAgICB2YXIgdGVtcGxhdGVzID0gbm9kZS5nZXRUZW1wbGF0ZUNoYWluKCk7XG4gICAgdGVtcGxhdGVzLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICBnZXRDb250YWluZXIobm9kZSkuYXBwZW5kQ2hpbGQoQmFzZUNvbXBvbmVudC5jbG9uZSh0ZW1wbGF0ZSkpO1xuICAgIH0pO1xuICAgIGluc2VydENoaWxkcmVuKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRUZW1wbGF0ZSAobm9kZSkge1xuICAgIGlmKG5vZGUubmVzdGVkVGVtcGxhdGUpe1xuICAgICAgICBpbnNlcnRUZW1wbGF0ZUNoYWluKG5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhclxuICAgICAgICB0ZW1wbGF0ZU5vZGUgPSBub2RlLmdldFRlbXBsYXRlTm9kZSgpO1xuXG4gICAgaWYodGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoQmFzZUNvbXBvbmVudC5jbG9uZSh0ZW1wbGF0ZU5vZGUpKTtcbiAgICB9XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRhaW5lciAobm9kZSkge1xuICAgIHZhciBjb250YWluZXJzID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbcmVmPVwiY29udGFpbmVyXCJdJyk7XG4gICAgaWYoIWNvbnRhaW5lcnMgfHwgIWNvbnRhaW5lcnMubGVuZ3RoKXtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXJzW2NvbnRhaW5lcnMubGVuZ3RoIC0gMV07XG59XG5cbmZ1bmN0aW9uIGluc2VydENoaWxkcmVuIChub2RlKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGNvbnRhaW5lciA9IGdldENvbnRhaW5lcihub2RlKSxcbiAgICAgICAgY2hpbGRyZW4gPSBsaWdodE5vZGVzW25vZGUuX3VpZF07XG5cbiAgICBpZihjb250YWluZXIgJiYgY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0TGlnaHROb2RlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbGlnaHROb2Rlc1t0aGlzLl91aWRdO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVOb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGNhY2hpbmcgY2F1c2VzIGRpZmZlcmVudCBjbGFzc2VzIHRvIHB1bGwgdGhlIHNhbWUgdGVtcGxhdGUgLSB3YXQ/XG4gICAgLy9pZighdGhpcy50ZW1wbGF0ZU5vZGUpIHtcbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVJZCkge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSBkb20uYnlJZCh0aGlzLnRlbXBsYXRlSWQucmVwbGFjZSgnIycsJycpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnRlbXBsYXRlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlTm9kZSA9IGRvbS50b0RvbSgnPHRlbXBsYXRlPicgKyB0aGlzLnRlbXBsYXRlU3RyaW5nICsgJzwvdGVtcGxhdGU+Jyk7XG4gICAgICAgIH1cbiAgICAvL31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZU5vZGU7XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZUNoYWluID0gZnVuY3Rpb24gKCkge1xuXG4gICAgbGV0XG4gICAgICAgIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICB0ZW1wbGF0ZXMgPSBbXSxcbiAgICAgICAgdGVtcGxhdGU7XG5cbiAgICAvLyB3YWxrIHRoZSBwcm90b3R5cGUgY2hhaW47IEJhYmVsIGRvZXNuJ3QgYWxsb3cgdXNpbmdcbiAgICAvLyBgc3VwZXJgIHNpbmNlIHdlIGFyZSBvdXRzaWRlIG9mIHRoZSBDbGFzc1xuICAgIHdoaWxlKGNvbnRleHQpe1xuICAgICAgICBjb250ZXh0ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRleHQpO1xuICAgICAgICBpZighY29udGV4dCl7IGJyZWFrOyB9XG4gICAgICAgIC8vIHNraXAgcHJvdG90eXBlcyB3aXRob3V0IGEgdGVtcGxhdGVcbiAgICAgICAgLy8gKGVsc2UgaXQgd2lsbCBwdWxsIGFuIGluaGVyaXRlZCB0ZW1wbGF0ZSBhbmQgY2F1c2UgZHVwbGljYXRlcylcbiAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVTdHJpbmcnKSB8fCBjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZUlkJykpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gY29udGV4dC5nZXRUZW1wbGF0ZU5vZGUoKTtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5wdXNoKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGVzO1xufTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICd0ZW1wbGF0ZScsXG4gICAgb3JkZXI6IDIwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaW5zZXJ0KG5vZGUpO1xuICAgIH1cbn0pOyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi4vLi4vc3JjL0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi8uLi9zcmMvcHJvcGVydGllcycpO1xuY29uc3QgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi9zcmMvdGVtcGxhdGUnKTtcbmNvbnN0IHJlZnMgPSByZXF1aXJlKCcuLi8uLi9zcmMvcmVmcycpO1xuY29uc3QgaXRlbVRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vc3JjL2l0ZW0tdGVtcGxhdGUnKTtcblxuY2xhc3MgVGVzdFByb3BzIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHsgcmV0dXJuIFsnZm9vJywgJ2JhcicsICduYmMnLCAnY2JzJywgJ2Rpc2FibGVkJywgJ3JlYWRvbmx5JywgJ3RhYmluZGV4J107IH1cbiAgICBnZXQgcHJvcHMgKCkgeyByZXR1cm4gWydmb28nLCAnYmFyJywgJ3RhYmluZGV4J107IH1cbiAgICBnZXQgYm9vbHMgKCkgeyByZXR1cm4gWyduYmMnLCAnY2JzJywgJ2Rpc2FibGVkJywgJ3JlYWRvbmx5J107IH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWQgKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRoaXNbbmFtZSArICctY2hhbmdlZCddID0gZG9tLm5vcm1hbGl6ZSh2YWx1ZSkgfHwgdmFsdWUgIT09IG51bGw7XG4gICAgfVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtcHJvcHMnLCBUZXN0UHJvcHMpO1xuXG5jbGFzcyBUZXN0TGlmZWN5Y2xlIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtyZXR1cm4gWydmb28nLCAnYmFyJ107IH1cblxuICAgIHNldCBmb28gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX19mb28gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgZm9vICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19mb287XG4gICAgfVxuXG4gICAgc2V0IGJhciAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fX2JhciA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBiYXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2JhciB8fCAnTk9UU0VUJztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgY29ubmVjdGVkICgpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ2Nvbm5lY3RlZC1jYWxsZWQnLCB0aGlzKTtcbiAgICB9XG5cbiAgICBkb21SZWFkeSAoKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdkb21yZWFkeS1jYWxsZWQnLCB0aGlzKTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWQgKCkge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAnZGlzY29ubmVjdGVkLWNhbGxlZCcsIHRoaXMpO1xuICAgIH1cblxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtbGlmZWN5Y2xlJywgVGVzdExpZmVjeWNsZSk7XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBpbml0OiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAnaW5pdC1jYWxsZWQnKTtcbiAgICB9LFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gKG5vZGUsIGEsIGIsIGMpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ3ByZUNvbm5lY3RlZC1jYWxsZWQnKTtcbiAgICB9LFxuICAgIHBvc3RDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdwb3N0Q29ubmVjdGVkLWNhbGxlZCcpO1xuICAgIH0sXG4gICAgcHJlRG9tUmVhZHk6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdwcmVEb21SZWFkeS1jYWxsZWQnKTtcbiAgICB9LFxuICAgIHBvc3REb21SZWFkeTogZnVuY3Rpb24gKG5vZGUsIGEsIGIsIGMpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ3Bvc3REb21SZWFkeS1jYWxsZWQnKTtcbiAgICB9XG59KTtcblxuXG5jbGFzcyBUZXN0VG1wbFN0cmluZyBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPGRpdj5UaGlzIGlzIGEgc2ltcGxlIHRlbXBsYXRlPC9kaXY+YDtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1zdHJpbmcnLCBUZXN0VG1wbFN0cmluZyk7XG5cbmNsYXNzIFRlc3RUbXBsSWQgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBnZXQgdGVtcGxhdGVJZCAoKSB7XG4gICAgICAgIHJldHVybiAndGVzdC10bXBsLWlkLXRlbXBsYXRlJztcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1pZCcsIFRlc3RUbXBsSWQpO1xuXG5cbmNsYXNzIFRlc3RUbXBsUmVmcyBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPGRpdiBvbj1cImNsaWNrOm9uQ2xpY2tcIiByZWY9XCJjbGlja05vZGVcIj5cbiAgICAgICAgICAgIDxsYWJlbCByZWY9XCJsYWJlbE5vZGVcIj5sYWJlbDo8L2xhYmVsPlxuICAgICAgICAgICAgPHNwYW4gcmVmPVwidmFsdWVOb2RlXCI+dmFsdWU8L3NwYW4+XG4gICAgICAgIDwvZGl2PmA7XG4gICAgfVxuXG4gICAgb25DbGljayAoKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdyZWYtY2xpY2stY2FsbGVkJyk7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtcmVmcycsIFRlc3RUbXBsUmVmcyk7XG5cbmNsYXNzIFRlc3RUbXBsQ29udGFpbmVyIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsIHJlZj1cImxhYmVsTm9kZVwiPmxhYmVsOjwvbGFiZWw+XG4gICAgICAgICAgICA8c3BhbiByZWY9XCJ2YWx1ZU5vZGVcIj52YWx1ZTwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXYgcmVmPVwiY29udGFpbmVyXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtY29udGFpbmVyJywgVGVzdFRtcGxDb250YWluZXIpO1xuXG5cbi8vIHNpbXBsZSBuZXN0ZWQgdGVtcGxhdGVzXG5jbGFzcyBUZXN0VG1wbE5lc3RlZEEgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmVzdGVkVGVtcGxhdGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQSBiZWZvcmU8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIHJlZj1cImNvbnRhaW5lclwiPjwvc2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBBIGFmdGVyPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLW5lc3RlZC1hJywgVGVzdFRtcGxOZXN0ZWRBKTtcblxuY2xhc3MgVGVzdFRtcGxOZXN0ZWRCIGV4dGVuZHMgVGVzdFRtcGxOZXN0ZWRBIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPGRpdj5jb250ZW50IEI8L2Rpdj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLW5lc3RlZC1iJywgVGVzdFRtcGxOZXN0ZWRCKTtcblxuXG4vLyBuZXN0ZWQgcGx1cyBsaWdodCBkb21cbmNsYXNzIFRlc3RUbXBsTmVzdGVkQyBleHRlbmRzIFRlc3RUbXBsTmVzdGVkQSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uPlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEMgYmVmb3JlPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHJlZj1cImNvbnRhaW5lclwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEMgYWZ0ZXI8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtbmVzdGVkLWMnLCBUZXN0VG1wbE5lc3RlZEMpO1xuXG5cbi8vIDUtZGVlcCBuZXN0ZWQgdGVtcGxhdGVzXG5jbGFzcyBUZXN0QSBleHRlbmRzIEJhc2VDb21wb25lbnQge31cbmNsYXNzIFRlc3RCIGV4dGVuZHMgVGVzdEEge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBCIGJlZm9yZTwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gcmVmPVwiY29udGFpbmVyXCI+PC9zZWN0aW9uPlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEIgYWZ0ZXI8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxufVxuY2xhc3MgVGVzdEMgZXh0ZW5kcyBUZXN0QiB7fVxuY2xhc3MgVGVzdEQgZXh0ZW5kcyBUZXN0QyB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXY+Y29udGVudCBEPC9kaXY+YDtcbiAgICB9XG59XG5jbGFzcyBUZXN0RSBleHRlbmRzIFRlc3REIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmVzdGVkVGVtcGxhdGUgPSB0cnVlO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1hJywgVGVzdEEpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWInLCBUZXN0Qik7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtYycsIFRlc3RDKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1kJywgVGVzdEQpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWUnLCBUZXN0RSk7XG5cbmNsYXNzIFRlc3RMaXN0IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHsgcmV0dXJuIFsnbGlzdC10aXRsZSddOyB9XG4gICAgZ2V0IHByb3BzICgpIHsgcmV0dXJuIFsnbGlzdC10aXRsZSddOyB9XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiIHJlZj1cInRpdGxlTm9kZVwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiByZWY9XCJjb250YWluZXJcIj48L2Rpdj5gO1xuICAgIH1cbiAgICBcbiAgICBzZXQgZGF0YSAoaXRlbXMpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJMaXN0KGl0ZW1zLCB0aGlzLmNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgZG9tUmVhZHkgKCkge1xuICAgICAgICB0aGlzLnRpdGxlTm9kZS5pbm5lckhUTUwgPSB0aGlzWydsaXN0LXRpdGxlJ107XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWxpc3QnLCBUZXN0TGlzdCk7XG5cblxuXG53aW5kb3cuaXRlbVRlbXBsYXRlU3RyaW5nID0gYDx0ZW1wbGF0ZT5cbiAgICA8ZGl2IGlkPVwie3tpZH19XCI+XG4gICAgICAgIDxzcGFuPnt7Zmlyc3R9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4+e3tsYXN0fX08L3NwYW4+XG4gICAgICAgIDxzcGFuPnt7cm9sZX19PC9zcGFuPlxuICAgIDwvZGl2PlxuPC90ZW1wbGF0ZT5gO1xuXG53aW5kb3cuaWZBdHRyVGVtcGxhdGVTdHJpbmcgPSBgPHRlbXBsYXRlPlxuICAgIDxkaXYgaWQ9XCJ7e2lkfX1cIj5cbiAgICAgICAgPHNwYW4+e3tmaXJzdH19PC9zcGFuPlxuICAgICAgICA8c3Bhbj57e2xhc3R9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4+e3tyb2xlfX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGlmPVwie3thbW91bnR9fSA8IDJcIiBjbGFzcz1cImFtb3VudFwiPnt7YW1vdW50fX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGlmPVwie3t0eXBlfX0gPT09ICdzYW5lJ1wiIGNsYXNzPVwic2FuaXR5XCI+e3t0eXBlfX08L3NwYW4+XG4gICAgPC9kaXY+XG48L3RlbXBsYXRlPmA7XG5cbmZ1bmN0aW9uIGRldiAoKSB7XG4gICAgdmFyIGFscGhhYmV0ID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jy5zcGxpdCgnJyk7XG4gICAgdmFyIHMgPSAne3thbW91bnR9fSArIHt7bnVtfX0gKyAzJztcbiAgICB2YXIgbGlzdCA9IFt7YW1vdW50OiAxLCBudW06IDJ9LCB7YW1vdW50OiAzLCBudW06IDR9LCB7YW1vdW50OiA1LCBudW06IDZ9XTtcbiAgICB2YXIgciA9IC9cXHtcXHtcXHcqfX0vZztcbiAgICB2YXIgZm4gPSBbXTtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciBmO1xuICAgIHMgPSBzLnJlcGxhY2UociwgZnVuY3Rpb24odyl7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3b3JkJywgdyk7XG4gICAgICAgIHZhciB2ID0gYWxwaGFiZXQuc2hpZnQoKTtcbiAgICAgICAgZm4ucHVzaCh2KTtcbiAgICAgICAgYXJncy5wdXNoKC9cXHcrL2cuZXhlYyh3KVswXSk7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH0pO1xuICAgIGZuLnB1c2gocyk7XG5cbiAgICBjb25zb2xlLmxvZygnZm4nLCBmbik7XG4gICAgY29uc29sZS5sb2coJ2FyZ3MnLCBhcmdzKTtcbiAgICAvL3MgPSAncmV0dXJuICcgKyBzICsgJzsnO1xuICAgIGNvbnNvbGUubG9nKCdzJywgcyk7XG5cbiAgICB3aW5kb3cuZiA9IG5ldyBGdW5jdGlvbihzKTtcblxuICAgIHZhciBkeW5GbiA9IGZ1bmN0aW9uIChhLGIsYyxkLGUsZikge1xuICAgICAgICB2YXIgciA9IGV2YWwocyk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZygnICBmOicsIGR5bkZuKDEsMikpO1xuICAgIC8vXG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHZhciBhID0gYXJncy5tYXAoZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bYXJnXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciByID0gZHluRm4uYXBwbHkobnVsbCwgYSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyJywgcik7XG4gICAgfSk7XG5cblxufVxuLy9kZXYoKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gY2xhc3MvY29tcG9uZW50IHJ1bGVzXG4vLyBhbHdheXMgY2FsbCBzdXBlcigpIGZpcnN0IGluIHRoZSBjdG9yLiBUaGlzIGFsc28gY2FsbHMgdGhlIGV4dGVuZGVkIGNsYXNzJyBjdG9yLlxuLy8gY2Fubm90IGNhbGwgTkVXIG9uIGEgQ29tcG9uZW50IGNsYXNzXG5cbi8vIENsYXNzZXMgaHR0cDovL2V4cGxvcmluZ2pzLmNvbS9lczYvY2hfY2xhc3Nlcy5odG1sI190aGUtc3BlY2llcy1wYXR0ZXJuLWluLXN0YXRpYy1tZXRob2RzXG5cbmNvbnN0IG9uID0gcmVxdWlyZSgnb24nKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuXG5jbGFzcyBCYXNlQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuX3VpZCA9IGRvbS51aWQodGhpcy5sb2NhbE5hbWUpO1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0gPSB7RE9NU1RBVEU6ICdjcmVhdGVkJ307XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0ID0gW107XG5cdFx0cGx1Z2luKCdpbml0JywgdGhpcyk7XG5cdH1cblxuXHRjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkID8gJ2RvbXJlYWR5JyA6ICdjb25uZWN0ZWQnO1xuXHRcdHBsdWdpbigncHJlQ29ubmVjdGVkJywgdGhpcyk7XG5cdFx0bmV4dFRpY2sob25DaGVja0RvbVJlYWR5LmJpbmQodGhpcykpO1xuXHRcdGlmICh0aGlzLmNvbm5lY3RlZCkge1xuXHRcdFx0dGhpcy5jb25uZWN0ZWQoKTtcblx0XHR9XG5cdFx0dGhpcy5maXJlKCdjb25uZWN0ZWQnKTtcblx0XHRwbHVnaW4oJ3Bvc3RDb25uZWN0ZWQnLCB0aGlzKTtcblx0fVxuXG5cdGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZGlzY29ubmVjdGVkJztcblx0XHRwbHVnaW4oJ3ByZURpc2Nvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdGlmICh0aGlzLmRpc2Nvbm5lY3RlZCkge1xuXHRcdFx0dGhpcy5kaXNjb25uZWN0ZWQoKTtcblx0XHR9XG5cdFx0dGhpcy5maXJlKCdkaXNjb25uZWN0ZWQnKTtcblxuXHRcdGxldCB0aW1lLCBkb2QgPSBCYXNlQ29tcG9uZW50LmRlc3Ryb3lPbkRpc2Nvbm5lY3Q7XG5cdFx0aWYgKGRvZCkge1xuXHRcdFx0dGltZSA9IHR5cGVvZiBkb2MgPT09ICdudW1iZXInID8gZG9jIDogMzAwO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGlmKHRoaXMuRE9NU1RBVEUgPT09ICdkaXNjb25uZWN0ZWQnKXtcblx0XHRcdFx0XHR0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGltZSk7XG5cdFx0fVxuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJOYW1lLCBvbGRWYWwsIG5ld1ZhbCkge1xuXHRcdHBsdWdpbigncHJlQXR0cmlidXRlQ2hhbmdlZCcsIHRoaXMsIGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0aWYgKHRoaXMuYXR0cmlidXRlQ2hhbmdlZCkge1xuXHRcdFx0dGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG5cdFx0fVxuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLmZpcmUoJ2Rlc3Ryb3knKTtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XG5cdFx0XHRoYW5kbGUucmVtb3ZlKCk7XG5cdFx0fSk7XG5cdFx0ZG9tLmRlc3Ryb3kodGhpcyk7XG5cdH1cblxuXHRmaXJlKGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcblx0XHRyZXR1cm4gb24uZmlyZSh0aGlzLCBldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKTtcblx0fVxuXG5cdGVtaXQoZXZlbnROYW1lLCB2YWx1ZSkge1xuXHRcdHJldHVybiBvbi5lbWl0KHRoaXMsIGV2ZW50TmFtZSwgdmFsdWUpO1xuXHR9XG5cblx0b24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcblx0XHRyZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcblx0XHRcdHR5cGVvZiBub2RlICE9PSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcblx0XHRcdFx0b24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcblx0XHRcdFx0b24odGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvcikpO1xuXHR9XG5cblx0b25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXHRcdHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKFxuXHRcdFx0dHlwZW9mIG5vZGUgIT09ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuXHRcdFx0XHRvbi5vbmNlKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG5cdFx0XHRcdG9uLm9uY2UodGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spKTtcblx0fVxuXG5cdHJlZ2lzdGVySGFuZGxlKGhhbmRsZSkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG5cdFx0cmV0dXJuIGhhbmRsZTtcblx0fVxuXG5cdGdldCBET01TVEFURSgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURTtcblx0fVxuXG5cdHN0YXRpYyBzZXQgZGVzdHJveU9uRGlzY29ubmVjdCh2YWx1ZSkge1xuXHRcdHByaXZhdGVzWydkZXN0cm95T25EaXNjb25uZWN0J10gPSB2YWx1ZTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgZGVzdHJveU9uRGlzY29ubmVjdCgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXTtcblx0fVxuXG5cdHN0YXRpYyBjbG9uZSh0ZW1wbGF0ZSkge1xuXHRcdGlmICh0ZW1wbGF0ZS5jb250ZW50ICYmIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pIHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXHRcdH1cblx0XHR2YXJcblx0XHRcdGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG5cdFx0XHRjbG9uZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG5cdFx0d2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmVOb2RlLmNoaWxkcmVuWzBdKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZyYWc7XG5cdH1cblxuXHRzdGF0aWMgYWRkUGx1Z2luKHBsdWcpIHtcblx0XHR2YXIgaSwgb3JkZXIgPSBwbHVnLm9yZGVyIHx8IDEwMDtcblx0XHRpZiAoIXBsdWdpbnMubGVuZ3RoKSB7XG5cdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHBsdWdpbnMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRpZiAocGx1Z2luc1swXS5vcmRlciA8PSBvcmRlcikge1xuXHRcdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChwbHVnaW5zWzBdLm9yZGVyID4gb3JkZXIpIHtcblx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cblx0XHRcdGZvciAoaSA9IDE7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChvcmRlciA9PT0gcGx1Z2luc1tpIC0gMV0ub3JkZXIgfHwgKG9yZGVyID4gcGx1Z2luc1tpIC0gMV0ub3JkZXIgJiYgb3JkZXIgPCBwbHVnaW5zW2ldLm9yZGVyKSkge1xuXHRcdFx0XHRcdHBsdWdpbnMuc3BsaWNlKGksIDAsIHBsdWcpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gd2FzIG5vdCBpbnNlcnRlZC4uLlxuXHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdH1cblx0fVxufVxuXG5sZXRcblx0cHJpdmF0ZXMgPSB7fSxcblx0cGx1Z2lucyA9IFtdO1xuXG5mdW5jdGlvbiBwbHVnaW4obWV0aG9kLCBub2RlLCBhLCBiLCBjKSB7XG5cdHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Zykge1xuXHRcdGlmIChwbHVnW21ldGhvZF0pIHtcblx0XHRcdHBsdWdbbWV0aG9kXShub2RlLCBhLCBiLCBjKTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBvbkNoZWNrRG9tUmVhZHkoKSB7XG5cdGlmICh0aGlzLkRPTVNUQVRFICE9PSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRsZXRcblx0XHRjb3VudCA9IDAsXG5cdFx0Y2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuXHRcdG91ckRvbVJlYWR5ID0gb25Eb21SZWFkeS5iaW5kKHRoaXMpO1xuXG5cdGZ1bmN0aW9uIGFkZFJlYWR5KCkge1xuXHRcdGNvdW50Kys7XG5cdFx0aWYgKGNvdW50ID09PSBjaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdG91ckRvbVJlYWR5KCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gSWYgbm8gY2hpbGRyZW4sIHdlJ3JlIGdvb2QgLSBsZWFmIG5vZGUuIENvbW1lbmNlIHdpdGggb25Eb21SZWFkeVxuXHQvL1xuXHRpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdG91ckRvbVJlYWR5KCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gZWxzZSwgd2FpdCBmb3IgYWxsIGNoaWxkcmVuIHRvIGZpcmUgdGhlaXIgYHJlYWR5YCBldmVudHNcblx0XHQvL1xuXHRcdGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHQvLyBjaGVjayBpZiBjaGlsZCBpcyBhbHJlYWR5IHJlYWR5XG5cdFx0XHQvLyBhbHNvIGNoZWNrIGZvciBjb25uZWN0ZWQgLSB0aGlzIGhhbmRsZXMgbW92aW5nIGEgbm9kZSBmcm9tIGFub3RoZXIgbm9kZVxuXHRcdFx0aWYgKGNoaWxkLkRPTVNUQVRFID09PSAnZG9tcmVhZHknIHx8IGNoaWxkLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJykge1xuXHRcdFx0XHRhZGRSZWFkeSgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYgbm90LCB3YWl0IGZvciBldmVudFxuXHRcdFx0Y2hpbGQub24oJ2RvbXJlYWR5JywgYWRkUmVhZHkpO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9uRG9tUmVhZHkoKSB7XG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZG9tcmVhZHknO1xuXHQvLyBkb21SZWFkeSBzaG91bGQgb25seSBldmVyIGZpcmUgb25jZVxuXHRwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPSB0cnVlO1xuXHRwbHVnaW4oJ3ByZURvbVJlYWR5JywgdGhpcyk7XG5cdC8vIGNhbGwgdGhpcy5kb21SZWFkeSBmaXJzdCwgc28gdGhhdCB0aGUgY29tcG9uZW50XG5cdC8vIGNhbiBmaW5pc2ggaW5pdGlhbGl6aW5nIGJlZm9yZSBmaXJpbmcgYW55XG5cdC8vIHN1YnNlcXVlbnQgZXZlbnRzXG5cdGlmICh0aGlzLmRvbVJlYWR5KSB7XG5cdFx0dGhpcy5kb21SZWFkeSgpO1xuXHRcdHRoaXMuZG9tUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG5cdFx0fTtcblx0fVxuXG5cdHRoaXMuZmlyZSgnZG9tcmVhZHknKTtcblxuXHRwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzKG5vZGUpIHtcblx0Ly8gY29sbGVjdCBhbnkgY2hpbGRyZW4gdGhhdCBhcmUgY3VzdG9tIG5vZGVzXG5cdC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuXHQvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG5cdHZhciBpLCBub2RlcyA9IFtdO1xuXHRmb3IgKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChub2RlLmNoaWxkcmVuW2ldLm5vZGVOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG5cdFx0XHRub2Rlcy5wdXNoKG5vZGUuY2hpbGRyZW5baV0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbm9kZXM7XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrKGNiKSB7XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZShjYik7XG59XG5cbndpbmRvdy5vbkRvbVJlYWR5ID0gZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIG9uUmVhZHkoKSB7XG5cdFx0Y2FsbGJhY2sobm9kZSk7XG5cdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuXHR9XG5cblx0aWYgKG5vZGUuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRjYWxsYmFjayhub2RlKTtcblx0fVxuXHRlbHNlIHtcblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbXBvbmVudDsiXX0=
