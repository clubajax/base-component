(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        privates[this._uid].DOMSTATE = 'connected';
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
            typeof node != 'string' ? // no node is supplied
                on(node, eventName, selector, callback) :
                on(this, node, eventName, selector));
    }

    once(node, eventName, selector, callback) {
        return this.registerHandle(
            typeof node != 'string' ? // no node is supplied
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
    if (this.DOMSTATE != 'connected' || privates[this._uid].domReadyFired) {
        return;
    }

    var
        count = 0,
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
    }
    else {
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
    function onReady () {
        callback(node);
        node.removeEventListener('domready', onReady);
    }
    if(node.DOMSTATE === 'domready'){
        callback(node);
    }else{
        node.addEventListener('domready', onReady);
    }
};

module.exports = BaseComponent;
},{"dom":"dom","on":"on"}],2:[function(require,module,exports){
const BaseComponent = require('./BaseComponent');
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

module.exports = {};
},{"./BaseComponent":1,"dom":"dom"}],3:[function(require,module,exports){
const BaseComponent  = require('./BaseComponent');
const dom = require('dom');

function setBoolean (node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		get () {
			if(node.hasAttribute(prop)){
				return dom.normalize(node.getAttribute(prop));
			}
			return false;
		},
		set (value) {
			if(value){
				this.setAttribute(prop, '');
			}else{
				this.removeAttribute(prop);
			}
		}
	});
}

function setProperty (node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		get () {
			return dom.normalize(this.getAttribute(prop));
		},
		set (value) {
			this.setAttribute(prop, value);
		}
	});
}

function setObject (node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
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
	if(props) {
		props.forEach(function (prop) {
			if(prop === 'disabled'){
				setBoolean(node, prop);
			}
			else{
				setProperty(node, prop);
			}
		});
	}
}

function setBooleans (node) {
	let props = node.bools || node.booleans;
	if(props) {
		props.forEach(function (prop) {
			setBoolean(node, prop);
		});
	}
}

function setObjects (node) {
	let props = node.objects;
	if(props) {
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
		this[name] = dom.normalize(value);
		if(!value && (node.bools || node.booleans || []).indexOf(name)){
			node.removeAttribute(name);
		}
	}
});

module.exports = {};
},{"./BaseComponent":1,"dom":"dom"}],4:[function(require,module,exports){
const BaseComponent  = require('./BaseComponent');

function assignRefs (node) {
    dom.queryAll(node, '[ref]').forEach(function (child) {
        var name = child.getAttribute('ref');
        node[name] = child;
    });
}

function assignEvents (node) {
    // <div on="click:onClick">
    dom.queryAll(node, '[on]').forEach(function (child) {
        var
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

module.exports = {};
},{"./BaseComponent":1}],5:[function(require,module,exports){
const BaseComponent  = require('./BaseComponent');
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

module.exports = {};
},{"./BaseComponent":1,"dom":"dom"}],6:[function(require,module,exports){
const BaseComponent  = require('../../src/BaseComponent');
const properties = require('../../src/properties');
const template = require('../../src/template');
const refs = require('../../src/refs');
const itemTemplate = require('../../src/item-template');

class TestProps extends BaseComponent {

    static get observedAttributes() { return ['foo', 'bar', 'nbc', 'cbs', 'disabled']; }
    get props () { return ['foo', 'bar']; }
    get bools () { return ['nbc', 'cbs']; }

    attributeChanged (name, value) {
        //console.log('CHG', name, value);
        //this[name] = dom.normalize(value);
        this[name + '-changed'] = dom.normalize(value);
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
},{"../../src/BaseComponent":1,"../../src/item-template":2,"../../src/properties":3,"../../src/refs":4,"../../src/template":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQmFzZUNvbXBvbmVudC5qcyIsInNyYy9pdGVtLXRlbXBsYXRlLmpzIiwic3JjL3Byb3BlcnRpZXMuanMiLCJzcmMvcmVmcy5qcyIsInNyYy90ZW1wbGF0ZS5qcyIsInRlc3RzL3NyYy9saWZlY3ljbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gY2xhc3MvY29tcG9uZW50IHJ1bGVzXG4vLyBhbHdheXMgY2FsbCBzdXBlcigpIGZpcnN0IGluIHRoZSBjdG9yLiBUaGlzIGFsc28gY2FsbHMgdGhlIGV4dGVuZGVkIGNsYXNzJyBjdG9yLlxuLy8gY2Fubm90IGNhbGwgTkVXIG9uIGEgQ29tcG9uZW50IGNsYXNzXG5cbi8vIENsYXNzZXMgaHR0cDovL2V4cGxvcmluZ2pzLmNvbS9lczYvY2hfY2xhc3Nlcy5odG1sI190aGUtc3BlY2llcy1wYXR0ZXJuLWluLXN0YXRpYy1tZXRob2RzXG5cbmNvbnN0IG9uID0gcmVxdWlyZSgnb24nKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuXG5jbGFzcyBCYXNlQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl91aWQgPSBkb20udWlkKHRoaXMubG9jYWxOYW1lKTtcbiAgICAgICAgcHJpdmF0ZXNbdGhpcy5fdWlkXSA9IHtET01TVEFURTogJ2NyZWF0ZWQnfTtcbiAgICAgICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0ID0gW107XG4gICAgICAgIHBsdWdpbignaW5pdCcsIHRoaXMpO1xuICAgIH1cbiAgICBcbiAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdjb25uZWN0ZWQnO1xuICAgICAgICBwbHVnaW4oJ3ByZUNvbm5lY3RlZCcsIHRoaXMpO1xuICAgICAgICBuZXh0VGljayhvbkNoZWNrRG9tUmVhZHkuYmluZCh0aGlzKSk7XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpcmUoJ2Nvbm5lY3RlZCcpO1xuICAgICAgICBwbHVnaW4oJ3Bvc3RDb25uZWN0ZWQnLCB0aGlzKTtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkaXNjb25uZWN0ZWQnO1xuICAgICAgICBwbHVnaW4oJ3ByZURpc2Nvbm5lY3RlZCcsIHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5kaXNjb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maXJlKCdkaXNjb25uZWN0ZWQnKTtcbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ck5hbWUsIG9sZFZhbCwgbmV3VmFsKSB7XG4gICAgICAgIHBsdWdpbigncHJlQXR0cmlidXRlQ2hhbmdlZCcsIHRoaXMsIGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG4gICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlQ2hhbmdlZChhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5maXJlKCdkZXN0cm95Jyk7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcbiAgICAgICAgICAgIGhhbmRsZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvbS5kZXN0cm95KHRoaXMpO1xuICAgIH1cblxuICAgIGZpcmUoZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcykge1xuICAgICAgICByZXR1cm4gb24uZmlyZSh0aGlzLCBldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKTtcbiAgICB9XG5cbiAgICBlbWl0KGV2ZW50TmFtZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG9uLmVtaXQodGhpcywgZXZlbnROYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgb24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG4gICAgICAgICAgICB0eXBlb2Ygbm9kZSAhPSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcbiAgICAgICAgICAgICAgICBvbihub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykgOlxuICAgICAgICAgICAgICAgIG9uKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IpKTtcbiAgICB9XG5cbiAgICBvbmNlKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKFxuICAgICAgICAgICAgdHlwZW9mIG5vZGUgIT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG4gICAgICAgICAgICAgICAgb24ub25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykgOlxuICAgICAgICAgICAgICAgIG9uLm9uY2UodGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spKTtcbiAgICB9XG5cbiAgICByZWdpc3RlckhhbmRsZShoYW5kbGUpIHtcbiAgICAgICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LnB1c2goaGFuZGxlKTtcbiAgICAgICAgcmV0dXJuIGhhbmRsZTtcbiAgICB9XG5cbiAgICBnZXQgRE9NU1RBVEUoKSB7XG4gICAgICAgIHJldHVybiBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFO1xuICAgIH1cblxuICAgIHN0YXRpYyBjbG9uZSh0ZW1wbGF0ZSkge1xuICAgICAgICBpZiAodGVtcGxhdGUuY29udGVudCAmJiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXJcbiAgICAgICAgICAgIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgICAgICBjbG9uZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2xvbmVOb2RlLmlubmVySFRNTCA9IHRlbXBsYXRlLmlubmVySFRNTDtcblxuICAgICAgICB3aGlsZSAoY2xvbmVOb2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjbG9uZU5vZGUuY2hpbGRyZW5bMF0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmcmFnO1xuICAgIH1cblxuICAgIHN0YXRpYyBhZGRQbHVnaW4ocGx1Zykge1xuICAgICAgICB2YXIgaSwgb3JkZXIgPSBwbHVnLm9yZGVyIHx8IDEwMDtcbiAgICAgICAgaWYgKCFwbHVnaW5zLmxlbmd0aCkge1xuICAgICAgICAgICAgcGx1Z2lucy5wdXNoKHBsdWcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBsdWdpbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBpZiAocGx1Z2luc1swXS5vcmRlciA8PSBvcmRlcikge1xuICAgICAgICAgICAgICAgIHBsdWdpbnMucHVzaChwbHVnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBsdWdpbnMudW5zaGlmdChwbHVnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwbHVnaW5zWzBdLm9yZGVyID4gb3JkZXIpIHtcbiAgICAgICAgICAgIHBsdWdpbnMudW5zaGlmdChwbHVnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAob3JkZXIgPT09IHBsdWdpbnNbaSAtIDFdLm9yZGVyIHx8IChvcmRlciA+IHBsdWdpbnNbaSAtIDFdLm9yZGVyICYmIG9yZGVyIDwgcGx1Z2luc1tpXS5vcmRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2lucy5zcGxpY2UoaSwgMCwgcGx1Zyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB3YXMgbm90IGluc2VydGVkLi4uXG4gICAgICAgICAgICBwbHVnaW5zLnB1c2gocGx1Zyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmxldFxuICAgIHByaXZhdGVzID0ge30sXG4gICAgcGx1Z2lucyA9IFtdO1xuXG5mdW5jdGlvbiBwbHVnaW4obWV0aG9kLCBub2RlLCBhLCBiLCBjKSB7XG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnKSB7XG4gICAgICAgIGlmIChwbHVnW21ldGhvZF0pIHtcbiAgICAgICAgICAgIHBsdWdbbWV0aG9kXShub2RlLCBhLCBiLCBjKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBvbkNoZWNrRG9tUmVhZHkoKSB7XG4gICAgaWYgKHRoaXMuRE9NU1RBVEUgIT0gJ2Nvbm5lY3RlZCcgfHwgcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXJcbiAgICAgICAgY291bnQgPSAwLFxuICAgICAgICBjaGlsZHJlbiA9IGdldENoaWxkQ3VzdG9tTm9kZXModGhpcyksXG4gICAgICAgIG91ckRvbVJlYWR5ID0gb25Eb21SZWFkeS5iaW5kKHRoaXMpO1xuXG4gICAgZnVuY3Rpb24gYWRkUmVhZHkoKSB7XG4gICAgICAgIGNvdW50Kys7XG4gICAgICAgIGlmIChjb3VudCA9PSBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIG91ckRvbVJlYWR5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBubyBjaGlsZHJlbiwgd2UncmUgZ29vZCAtIGxlYWYgbm9kZS4gQ29tbWVuY2Ugd2l0aCBvbkRvbVJlYWR5XG4gICAgLy9cbiAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBvdXJEb21SZWFkeSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gZWxzZSwgd2FpdCBmb3IgYWxsIGNoaWxkcmVuIHRvIGZpcmUgdGhlaXIgYHJlYWR5YCBldmVudHNcbiAgICAgICAgLy9cbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGNoaWxkIGlzIGFscmVhZHkgcmVhZHlcbiAgICAgICAgICAgIGlmIChjaGlsZC5ET01TVEFURSA9PSAnZG9tcmVhZHknKSB7XG4gICAgICAgICAgICAgICAgYWRkUmVhZHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIG5vdCwgd2FpdCBmb3IgZXZlbnRcbiAgICAgICAgICAgIGNoaWxkLm9uKCdkb21yZWFkeScsIGFkZFJlYWR5KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBvbkRvbVJlYWR5KCkge1xuICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZG9tcmVhZHknO1xuICAgIC8vIGRvbVJlYWR5IHNob3VsZCBvbmx5IGV2ZXIgZmlyZSBvbmNlXG4gICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkID0gdHJ1ZTtcbiAgICBwbHVnaW4oJ3ByZURvbVJlYWR5JywgdGhpcyk7XG4gICAgLy8gY2FsbCB0aGlzLmRvbVJlYWR5IGZpcnN0LCBzbyB0aGF0IHRoZSBjb21wb25lbnRcbiAgICAvLyBjYW4gZmluaXNoIGluaXRpYWxpemluZyBiZWZvcmUgZmlyaW5nIGFueVxuICAgIC8vIHN1YnNlcXVlbnQgZXZlbnRzXG4gICAgaWYgKHRoaXMuZG9tUmVhZHkpIHtcbiAgICAgICAgdGhpcy5kb21SZWFkeSgpO1xuICAgICAgICB0aGlzLmRvbVJlYWR5ID0gZnVuY3Rpb24gKCkge307XG4gICAgfVxuXG4gICAgdGhpcy5maXJlKCdkb21yZWFkeScpO1xuXG4gICAgcGx1Z2luKCdwb3N0RG9tUmVhZHknLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyhub2RlKSB7XG4gICAgLy8gY29sbGVjdCBhbnkgY2hpbGRyZW4gdGhhdCBhcmUgY3VzdG9tIG5vZGVzXG4gICAgLy8gdXNlZCB0byBjaGVjayBpZiB0aGVpciBkb20gaXMgcmVhZHkgYmVmb3JlXG4gICAgLy8gZGV0ZXJtaW5pbmcgaWYgdGhpcyBpcyByZWFkeVxuICAgIHZhciBpLCBub2RlcyA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuW2ldLm5vZGVOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKG5vZGUuY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2Rlcztcbn1cblxuZnVuY3Rpb24gbmV4dFRpY2soY2IpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xufVxuXG53aW5kb3cub25Eb21SZWFkeSA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuICAgIGZ1bmN0aW9uIG9uUmVhZHkgKCkge1xuICAgICAgICBjYWxsYmFjayhub2RlKTtcbiAgICAgICAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuICAgIH1cbiAgICBpZihub2RlLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKXtcbiAgICAgICAgY2FsbGJhY2sobm9kZSk7XG4gICAgfWVsc2V7XG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VDb21wb25lbnQ7IiwiY29uc3QgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5jb25zdCBhbHBoYWJldCA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicuc3BsaXQoJycpO1xuY29uc3QgciA9IC9cXHtcXHtcXHcqfX0vZztcblxuLy8gVE9ETzogc3dpdGNoIHRvIEVTNiBsaXRlcmFscz8gTWF5YmUgbm90Li4uXG5cbi8vIEZJWE1FOiB0aW1lIGN1cnJlbnQgcHJvY2Vzc1xuLy8gVHJ5IGEgbmV3IG9uZSB3aGVyZSBtZXRhIGRhdGEgaXMgY3JlYXRlZCwgaW5zdGVhZCBvZiBhIHRlbXBsYXRlXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbmRpdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIC8vIEZJWE1FIG5hbWU/XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHIsIGZ1bmN0aW9uICh3KSB7XG4gICAgICAgIHcgPSB3LnJlcGxhY2UoJ3t7JywgJycpLnJlcGxhY2UoJ319JywgJycpO1xuICAgICAgICByZXR1cm4gJ2l0ZW1bXCInICsgdyArICdcIl0nO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKCdjcmVhdGVDb25kaXRpb24nLCBuYW1lLCB2YWx1ZSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBldmFsKHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiB3YWxrRG9tKG5vZGUsIHJlZnMpIHtcblxuICAgIGxldCBpdGVtID0ge1xuICAgICAgICBub2RlOiBub2RlXG4gICAgfTtcblxuICAgIHJlZnMubm9kZXMucHVzaChpdGVtKTtcblxuICAgIGlmIChub2RlLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldFxuICAgICAgICAgICAgICAgIG5hbWUgPSBub2RlLmF0dHJpYnV0ZXNbaV0ubmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5vZGUuYXR0cmlidXRlc1tpXS52YWx1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcgICcsIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnaWYnKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jb25kaXRpb25hbCA9IGNyZWF0ZUNvbmRpdGlvbihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgvXFx7XFx7Ly50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIDxkaXYgaWQ9XCJ7e2lkfX1cIj5cbiAgICAgICAgICAgICAgICByZWZzLmF0dHJpYnV0ZXMgPSByZWZzLmF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gaXRlbS5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIGNvdWxkIGJlIG1vcmUgdGhhbiBvbmU/P1xuICAgICAgICAgICAgICAgIC8vIHNhbWUgd2l0aCBub2RlP1xuICAgICAgICAgICAgICAgIHJlZnMuYXR0cmlidXRlc1tuYW1lXSA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzaG91bGQgcHJvYmFibHkgbG9vcCBvdmVyIGNoaWxkTm9kZXMgYW5kIGNoZWNrIHRleHQgbm9kZXMgZm9yIHJlcGxhY2VtZW50c1xuICAgIC8vXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBpZiAoL1xce1xcey8udGVzdChub2RlLmlubmVySFRNTCkpIHtcbiAgICAgICAgICAgIC8vIEZJWE1FIC0gaW5uZXJIVE1MIGFzIHZhbHVlIHRvbyBuYWl2ZVxuICAgICAgICAgICAgbGV0IHByb3AgPSBub2RlLmlubmVySFRNTC5yZXBsYWNlKCd7eycsICcnKS5yZXBsYWNlKCd9fScsICcnKTtcbiAgICAgICAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dCB8fCB7fTtcbiAgICAgICAgICAgIGl0ZW0udGV4dFtwcm9wXSA9IG5vZGUuaW5uZXJIVE1MO1xuICAgICAgICAgICAgcmVmc1twcm9wXSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB3YWxrRG9tKG5vZGUuY2hpbGRyZW5baV0sIHJlZnMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlSXRlbVRlbXBsYXRlKGZyYWcpIHtcbiAgICBsZXQgcmVmcyA9IHtcbiAgICAgICAgbm9kZXM6IFtdXG4gICAgfTtcbiAgICB3YWxrRG9tKGZyYWcsIHJlZnMpO1xuICAgIHJldHVybiByZWZzO1xufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5yZW5kZXJMaXN0ID0gZnVuY3Rpb24gKGl0ZW1zLCBjb250YWluZXIsIGl0ZW1UZW1wbGF0ZSkge1xuICAgIGxldFxuICAgICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICB0bXBsID0gaXRlbVRlbXBsYXRlIHx8IHRoaXMuaXRlbVRlbXBsYXRlLFxuICAgICAgICByZWZzID0gdG1wbC5pdGVtUmVmcyxcbiAgICAgICAgY2xvbmUsXG4gICAgICAgIGRlZmVyO1xuXG4gICAgZnVuY3Rpb24gd2FybihuYW1lKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChkZWZlcik7XG4gICAgICAgIGRlZmVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0F0dGVtcHRlZCB0byBzZXQgYXR0cmlidXRlIGZyb20gbm9uLWV4aXN0ZW50IGl0ZW0gcHJvcGVydHk6JywgbmFtZSk7XG4gICAgICAgIH0sIDEpO1xuICAgIH1cblxuICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblxuICAgICAgICBsZXRcbiAgICAgICAgICAgIGlmQ291bnQgPSAwLFxuICAgICAgICAgICAgZGVsZXRpb25zID0gW107XG5cbiAgICAgICAgcmVmcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZWYpIHtcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGNhbid0IHN3YXAgYmVjYXVzZSB0aGUgaW5uZXJIVE1MIGlzIGJlaW5nIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIGNhbid0IGNsb25lIGJlY2F1c2UgdGhlbiB0aGVyZSBpcyBub3QgYSBub2RlIHJlZmVyZW5jZVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGxldFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIG5vZGUgPSByZWYubm9kZSxcbiAgICAgICAgICAgICAgICBoYXNOb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChyZWYuY29uZGl0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZi5jb25kaXRpb25hbChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNOb2RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuJ3QgYWN0dWFsbHkgZGVsZXRlLCBiZWNhdXNlIHRoaXMgaXMgdGhlIG9yaWdpbmFsIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc3RlYWQsIGFkZGluZyBhdHRyaWJ1dGUgdG8gdHJhY2sgbm9kZSwgdG8gYmUgZGVsZXRlZCBpbiBjbG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGFmdGVyLCByZW1vdmUgdGVtcG9yYXJ5IGF0dHJpYnV0ZSBmcm9tIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIHJlZi5ub2RlLnNldEF0dHJpYnV0ZSgnaWZzJywgaWZDb3VudCsnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0aW9ucy5wdXNoKCdbaWZzPVwiJytpZkNvdW50KydcIl0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZWYuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZWYuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZi5hdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZWYubm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3dhcCBhdHQnLCBrZXksIHZhbHVlLCByZWYubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVmLnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVmLnRleHQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWYudGV4dFtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3dhcCB0ZXh0Jywga2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSB2YWx1ZS5yZXBsYWNlKHZhbHVlLCBpdGVtW2tleV0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2xvbmUgPSB0bXBsLmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICBkZWxldGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZGVsKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoZGVsKTtcbiAgICAgICAgICAgIGlmKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkb20uZGVzdHJveShub2RlKTtcbiAgICAgICAgICAgICAgICBsZXQgdG1wbE5vZGUgPSB0bXBsLnF1ZXJ5U2VsZWN0b3IoZGVsKTtcbiAgICAgICAgICAgICAgICB0bXBsTm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2lmcycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnKTtcblxuICAgIC8vaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgIC8vICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIC8vICAgICAgICBpZihyZWZzW2tleV0pe1xuICAgIC8vICAgICAgICAgICAgcmVmc1trZXldLmlubmVySFRNTCA9IGl0ZW1ba2V5XTtcbiAgICAvLyAgICAgICAgfVxuICAgIC8vICAgIH0pO1xuICAgIC8vICAgIGlmKHJlZnMuYXR0cmlidXRlcyl7XG4gICAgLy8gICAgICAgIE9iamVjdC5rZXlzKHJlZnMuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIC8vICAgICAgICAgICAgbGV0IG5vZGUgPSByZWZzLmF0dHJpYnV0ZXNbbmFtZV07XG4gICAgLy8gICAgICAgICAgICBpZihpdGVtW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCBpdGVtW25hbWVdKTtcbiAgICAvLyAgICAgICAgICAgIH1lbHNle1xuICAgIC8vICAgICAgICAgICAgICAgIHdhcm4obmFtZSk7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy8gICAgICAgIH0pO1xuICAgIC8vICAgIH1cbiAgICAvL1xuICAgIC8vICAgIGNsb25lID0gdG1wbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgLy8gICAgZnJhZy5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgLy99KTtcblxuICAgIC8vY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWcpO1xufTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICdpdGVtLXRlbXBsYXRlJyxcbiAgICBvcmRlcjogNDAsXG4gICAgcHJlRG9tUmVhZHk6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlID0gZG9tLnF1ZXJ5KG5vZGUsICd0ZW1wbGF0ZScpO1xuICAgICAgICBpZiAobm9kZS5pdGVtVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUgPSBCYXNlQ29tcG9uZW50LmNsb25lKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlLml0ZW1SZWZzID0gdXBkYXRlSXRlbVRlbXBsYXRlKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9OyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxuZnVuY3Rpb24gc2V0Qm9vbGVhbiAobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0ICgpIHtcblx0XHRcdGlmKG5vZGUuaGFzQXR0cmlidXRlKHByb3ApKXtcblx0XHRcdFx0cmV0dXJuIGRvbS5ub3JtYWxpemUobm9kZS5nZXRBdHRyaWJ1dGUocHJvcCkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cdFx0c2V0ICh2YWx1ZSkge1xuXHRcdFx0aWYodmFsdWUpe1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCAnJyk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0UHJvcGVydHkgKG5vZGUsIHByb3ApIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRyZXR1cm4gZG9tLm5vcm1hbGl6ZSh0aGlzLmdldEF0dHJpYnV0ZShwcm9wKSk7XG5cdFx0fSxcblx0XHRzZXQgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0T2JqZWN0IChub2RlLCBwcm9wKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQgKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJ19fJyArIHByb3BdO1xuXHRcdH0sXG5cdFx0c2V0ICh2YWx1ZSkge1xuXHRcdFx0dGhpc1snX18nICsgcHJvcF0gPSB2YWx1ZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzIChub2RlKSB7XG5cdGxldCBwcm9wcyA9IG5vZGUucHJvcHMgfHwgbm9kZS5wcm9wZXJ0aWVzO1xuXHRpZihwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdGlmKHByb3AgPT09ICdkaXNhYmxlZCcpe1xuXHRcdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0c2V0UHJvcGVydHkobm9kZSwgcHJvcCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0Qm9vbGVhbnMgKG5vZGUpIHtcblx0bGV0IHByb3BzID0gbm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zO1xuXHRpZihwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0T2JqZWN0cyAobm9kZSkge1xuXHRsZXQgcHJvcHMgPSBub2RlLm9iamVjdHM7XG5cdGlmKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0T2JqZWN0KG5vZGUsIHByb3ApO1xuXHRcdH0pO1xuXHR9XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcblx0bmFtZTogJ3Byb3BlcnRpZXMnLFxuXHRvcmRlcjogMTAsXG5cdGluaXQ6IGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0c2V0UHJvcGVydGllcyhub2RlKTtcblx0XHRzZXRCb29sZWFucyhub2RlKTtcblx0fSxcblx0cHJlQXR0cmlidXRlQ2hhbmdlZDogZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG5cdFx0dGhpc1tuYW1lXSA9IGRvbS5ub3JtYWxpemUodmFsdWUpO1xuXHRcdGlmKCF2YWx1ZSAmJiAobm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zIHx8IFtdKS5pbmRleE9mKG5hbWUpKXtcblx0XHRcdG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge307IiwiY29uc3QgQmFzZUNvbXBvbmVudCAgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcblxuZnVuY3Rpb24gYXNzaWduUmVmcyAobm9kZSkge1xuICAgIGRvbS5xdWVyeUFsbChub2RlLCAnW3JlZl0nKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgncmVmJyk7XG4gICAgICAgIG5vZGVbbmFtZV0gPSBjaGlsZDtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYXNzaWduRXZlbnRzIChub2RlKSB7XG4gICAgLy8gPGRpdiBvbj1cImNsaWNrOm9uQ2xpY2tcIj5cbiAgICBkb20ucXVlcnlBbGwobm9kZSwgJ1tvbl0nKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGtleVZhbHVlID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdvbicpLFxuICAgICAgICAgICAgZXZlbnQgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzBdLnRyaW0oKSxcbiAgICAgICAgICAgIG1ldGhvZCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMV0udHJpbSgpO1xuICAgICAgICBub2RlLm9uKGNoaWxkLCBldmVudCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIG5vZGVbbWV0aG9kXShlKVxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3JlZnMnLFxuICAgIG9yZGVyOiAzMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGFzc2lnblJlZnMobm9kZSk7XG4gICAgICAgIGFzc2lnbkV2ZW50cyhub2RlKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbnZhclxuICAgIGxpZ2h0Tm9kZXMgPSB7fSxcbiAgICBpbnNlcnRlZCA9IHt9O1xuXG5mdW5jdGlvbiBpbnNlcnQgKG5vZGUpIHtcbiAgICBpZihpbnNlcnRlZFtub2RlLl91aWRdIHx8ICFoYXNUZW1wbGF0ZShub2RlKSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29sbGVjdExpZ2h0Tm9kZXMobm9kZSk7XG4gICAgaW5zZXJ0VGVtcGxhdGUobm9kZSk7XG4gICAgaW5zZXJ0ZWRbbm9kZS5fdWlkXSA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RMaWdodE5vZGVzKG5vZGUpe1xuICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSB8fCBbXTtcbiAgICB3aGlsZShub2RlLmNoaWxkTm9kZXMubGVuZ3RoKXtcbiAgICAgICAgbGlnaHROb2Rlc1tub2RlLl91aWRdLnB1c2gobm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkTm9kZXNbMF0pKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhc1RlbXBsYXRlIChub2RlKSB7XG4gICAgcmV0dXJuICEhbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGVDaGFpbiAobm9kZSkge1xuICAgIHZhciB0ZW1wbGF0ZXMgPSBub2RlLmdldFRlbXBsYXRlQ2hhaW4oKTtcbiAgICB0ZW1wbGF0ZXMucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgIGdldENvbnRhaW5lcihub2RlKS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlKSk7XG4gICAgfSk7XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlIChub2RlKSB7XG4gICAgaWYobm9kZS5uZXN0ZWRUZW1wbGF0ZSl7XG4gICAgICAgIGluc2VydFRlbXBsYXRlQ2hhaW4obm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyXG4gICAgICAgIHRlbXBsYXRlTm9kZSA9IG5vZGUuZ2V0VGVtcGxhdGVOb2RlKCk7XG5cbiAgICBpZih0ZW1wbGF0ZU5vZGUpIHtcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlTm9kZSkpO1xuICAgIH1cbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyIChub2RlKSB7XG4gICAgdmFyIGNvbnRhaW5lcnMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWY9XCJjb250YWluZXJcIl0nKTtcbiAgICBpZighY29udGFpbmVycyB8fCAhY29udGFpbmVycy5sZW5ndGgpe1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRhaW5lcnNbY29udGFpbmVycy5sZW5ndGggLSAxXTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0Q2hpbGRyZW4gKG5vZGUpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKG5vZGUpLFxuICAgICAgICBjaGlsZHJlbiA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXTtcblxuICAgIGlmKGNvbnRhaW5lciAmJiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICBmb3IoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRMaWdodE5vZGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsaWdodE5vZGVzW3RoaXMuX3VpZF07XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZU5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2FjaGluZyBjYXVzZXMgZGlmZmVyZW50IGNsYXNzZXMgdG8gcHVsbCB0aGUgc2FtZSB0ZW1wbGF0ZSAtIHdhdD9cbiAgICAvL2lmKCF0aGlzLnRlbXBsYXRlTm9kZSkge1xuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZUlkKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlTm9kZSA9IGRvbS5ieUlkKHRoaXMudGVtcGxhdGVJZC5yZXBsYWNlKCcjJywnJykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMudGVtcGxhdGVTdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gZG9tLnRvRG9tKCc8dGVtcGxhdGU+JyArIHRoaXMudGVtcGxhdGVTdHJpbmcgKyAnPC90ZW1wbGF0ZT4nKTtcbiAgICAgICAgfVxuICAgIC8vfVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlTm9kZTtcbn07XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlQ2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBsZXRcbiAgICAgICAgY29udGV4dCA9IHRoaXMsXG4gICAgICAgIHRlbXBsYXRlcyA9IFtdLFxuICAgICAgICB0ZW1wbGF0ZTtcblxuICAgIC8vIHdhbGsgdGhlIHByb3RvdHlwZSBjaGFpbjsgQmFiZWwgZG9lc24ndCBhbGxvdyB1c2luZ1xuICAgIC8vIGBzdXBlcmAgc2luY2Ugd2UgYXJlIG91dHNpZGUgb2YgdGhlIENsYXNzXG4gICAgd2hpbGUoY29udGV4dCl7XG4gICAgICAgIGNvbnRleHQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udGV4dCk7XG4gICAgICAgIGlmKCFjb250ZXh0KXsgYnJlYWs7IH1cbiAgICAgICAgLy8gc2tpcCBwcm90b3R5cGVzIHdpdGhvdXQgYSB0ZW1wbGF0ZVxuICAgICAgICAvLyAoZWxzZSBpdCB3aWxsIHB1bGwgYW4gaW5oZXJpdGVkIHRlbXBsYXRlIGFuZCBjYXVzZSBkdXBsaWNhdGVzKVxuICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZVN0cmluZycpIHx8IGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlSWQnKSkge1xuICAgICAgICAgICAgdGVtcGxhdGUgPSBjb250ZXh0LmdldFRlbXBsYXRlTm9kZSgpO1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzLnB1c2godGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZW1wbGF0ZXM7XG59O1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3RlbXBsYXRlJyxcbiAgICBvcmRlcjogMjAsXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpbnNlcnQobm9kZSk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge307IiwiY29uc3QgQmFzZUNvbXBvbmVudCAgPSByZXF1aXJlKCcuLi8uLi9zcmMvQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uLy4uL3NyYy9wcm9wZXJ0aWVzJyk7XG5jb25zdCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uL3NyYy90ZW1wbGF0ZScpO1xuY29uc3QgcmVmcyA9IHJlcXVpcmUoJy4uLy4uL3NyYy9yZWZzJyk7XG5jb25zdCBpdGVtVGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi9zcmMvaXRlbS10ZW1wbGF0ZScpO1xuXG5jbGFzcyBUZXN0UHJvcHMgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkgeyByZXR1cm4gWydmb28nLCAnYmFyJywgJ25iYycsICdjYnMnLCAnZGlzYWJsZWQnXTsgfVxuICAgIGdldCBwcm9wcyAoKSB7IHJldHVybiBbJ2ZvbycsICdiYXInXTsgfVxuICAgIGdldCBib29scyAoKSB7IHJldHVybiBbJ25iYycsICdjYnMnXTsgfVxuXG4gICAgYXR0cmlidXRlQ2hhbmdlZCAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnQ0hHJywgbmFtZSwgdmFsdWUpO1xuICAgICAgICAvL3RoaXNbbmFtZV0gPSBkb20ubm9ybWFsaXplKHZhbHVlKTtcbiAgICAgICAgdGhpc1tuYW1lICsgJy1jaGFuZ2VkJ10gPSBkb20ubm9ybWFsaXplKHZhbHVlKTtcbiAgICB9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1wcm9wcycsIFRlc3RQcm9wcyk7XG5cbmNsYXNzIFRlc3RMaWZlY3ljbGUgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge3JldHVybiBbJ2ZvbycsICdiYXInXTsgfVxuXG4gICAgc2V0IGZvbyAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fX2ZvbyA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBmb28gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2ZvbztcbiAgICB9XG5cbiAgICBzZXQgYmFyICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fYmFyID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGJhciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fYmFyIHx8ICdOT1RTRVQnO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBjb25uZWN0ZWQgKCkge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAnY29ubmVjdGVkLWNhbGxlZCcsIHRoaXMpO1xuICAgIH1cblxuICAgIGRvbVJlYWR5ICgpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ2RvbXJlYWR5LWNhbGxlZCcsIHRoaXMpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZCAoKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdkaXNjb25uZWN0ZWQtY2FsbGVkJywgdGhpcyk7XG4gICAgfVxuXG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1saWZlY3ljbGUnLCBUZXN0TGlmZWN5Y2xlKTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIGluaXQ6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdpbml0LWNhbGxlZCcpO1xuICAgIH0sXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncHJlQ29ubmVjdGVkLWNhbGxlZCcpO1xuICAgIH0sXG4gICAgcG9zdENvbm5lY3RlZDogZnVuY3Rpb24gKG5vZGUsIGEsIGIsIGMpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ3Bvc3RDb25uZWN0ZWQtY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwcmVEb21SZWFkeTogZnVuY3Rpb24gKG5vZGUsIGEsIGIsIGMpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ3ByZURvbVJlYWR5LWNhbGxlZCcpO1xuICAgIH0sXG4gICAgcG9zdERvbVJlYWR5OiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncG9zdERvbVJlYWR5LWNhbGxlZCcpO1xuICAgIH1cbn0pO1xuXG5cbmNsYXNzIFRlc3RUbXBsU3RyaW5nIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2PlRoaXMgaXMgYSBzaW1wbGUgdGVtcGxhdGU8L2Rpdj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLXN0cmluZycsIFRlc3RUbXBsU3RyaW5nKTtcblxuY2xhc3MgVGVzdFRtcGxJZCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICAgIGdldCB0ZW1wbGF0ZUlkICgpIHtcbiAgICAgICAgcmV0dXJuICd0ZXN0LXRtcGwtaWQtdGVtcGxhdGUnO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLWlkJywgVGVzdFRtcGxJZCk7XG5cblxuY2xhc3MgVGVzdFRtcGxSZWZzIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2IG9uPVwiY2xpY2s6b25DbGlja1wiIHJlZj1cImNsaWNrTm9kZVwiPlxuICAgICAgICAgICAgPGxhYmVsIHJlZj1cImxhYmVsTm9kZVwiPmxhYmVsOjwvbGFiZWw+XG4gICAgICAgICAgICA8c3BhbiByZWY9XCJ2YWx1ZU5vZGVcIj52YWx1ZTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+YDtcbiAgICB9XG5cbiAgICBvbkNsaWNrICgpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ3JlZi1jbGljay1jYWxsZWQnKTtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1yZWZzJywgVGVzdFRtcGxSZWZzKTtcblxuY2xhc3MgVGVzdFRtcGxDb250YWluZXIgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXY+XG4gICAgICAgICAgICA8bGFiZWwgcmVmPVwibGFiZWxOb2RlXCI+bGFiZWw6PC9sYWJlbD5cbiAgICAgICAgICAgIDxzcGFuIHJlZj1cInZhbHVlTm9kZVwiPnZhbHVlPC9zcGFuPlxuICAgICAgICAgICAgPGRpdiByZWY9XCJjb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+YDtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1jb250YWluZXInLCBUZXN0VG1wbENvbnRhaW5lcik7XG5cblxuLy8gc2ltcGxlIG5lc3RlZCB0ZW1wbGF0ZXNcbmNsYXNzIFRlc3RUbXBsTmVzdGVkQSBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uZXN0ZWRUZW1wbGF0ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBBIGJlZm9yZTwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gcmVmPVwiY29udGFpbmVyXCI+PC9zZWN0aW9uPlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEEgYWZ0ZXI8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtbmVzdGVkLWEnLCBUZXN0VG1wbE5lc3RlZEEpO1xuXG5jbGFzcyBUZXN0VG1wbE5lc3RlZEIgZXh0ZW5kcyBUZXN0VG1wbE5lc3RlZEEge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2PmNvbnRlbnQgQjwvZGl2PmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtbmVzdGVkLWInLCBUZXN0VG1wbE5lc3RlZEIpO1xuXG5cbi8vIG5lc3RlZCBwbHVzIGxpZ2h0IGRvbVxuY2xhc3MgVGVzdFRtcGxOZXN0ZWRDIGV4dGVuZHMgVGVzdFRtcGxOZXN0ZWRBIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQyBiZWZvcmU8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgcmVmPVwiY29udGFpbmVyXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQyBhZnRlcjwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+YDtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1uZXN0ZWQtYycsIFRlc3RUbXBsTmVzdGVkQyk7XG5cblxuLy8gNS1kZWVwIG5lc3RlZCB0ZW1wbGF0ZXNcbmNsYXNzIFRlc3RBIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7fVxuY2xhc3MgVGVzdEIgZXh0ZW5kcyBUZXN0QSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uPlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEIgYmVmb3JlPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiByZWY9XCJjb250YWluZXJcIj48L3NlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQiBhZnRlcjwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+YDtcbiAgICB9XG59XG5jbGFzcyBUZXN0QyBleHRlbmRzIFRlc3RCIHt9XG5jbGFzcyBUZXN0RCBleHRlbmRzIFRlc3RDIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPGRpdj5jb250ZW50IEQ8L2Rpdj5gO1xuICAgIH1cbn1cbmNsYXNzIFRlc3RFIGV4dGVuZHMgVGVzdEQge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uZXN0ZWRUZW1wbGF0ZSA9IHRydWU7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWEnLCBUZXN0QSk7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtYicsIFRlc3RCKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1jJywgVGVzdEMpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWQnLCBUZXN0RCk7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZScsIFRlc3RFKTtcblxuY2xhc3MgVGVzdExpc3QgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkgeyByZXR1cm4gWydsaXN0LXRpdGxlJ107IH1cbiAgICBnZXQgcHJvcHMgKCkgeyByZXR1cm4gWydsaXN0LXRpdGxlJ107IH1cblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCIgcmVmPVwidGl0bGVOb2RlXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHJlZj1cImNvbnRhaW5lclwiPjwvZGl2PmA7XG4gICAgfVxuICAgIFxuICAgIHNldCBkYXRhIChpdGVtcykge1xuICAgICAgICB0aGlzLnJlbmRlckxpc3QoaXRlbXMsIHRoaXMuY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICBkb21SZWFkeSAoKSB7XG4gICAgICAgIHRoaXMudGl0bGVOb2RlLmlubmVySFRNTCA9IHRoaXNbJ2xpc3QtdGl0bGUnXTtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtbGlzdCcsIFRlc3RMaXN0KTtcblxuXG5cbndpbmRvdy5pdGVtVGVtcGxhdGVTdHJpbmcgPSBgPHRlbXBsYXRlPlxuICAgIDxkaXYgaWQ9XCJ7e2lkfX1cIj5cbiAgICAgICAgPHNwYW4+e3tmaXJzdH19PC9zcGFuPlxuICAgICAgICA8c3Bhbj57e2xhc3R9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4+e3tyb2xlfX08L3NwYW4+XG4gICAgPC9kaXY+XG48L3RlbXBsYXRlPmA7XG5cbndpbmRvdy5pZkF0dHJUZW1wbGF0ZVN0cmluZyA9IGA8dGVtcGxhdGU+XG4gICAgPGRpdiBpZD1cInt7aWR9fVwiPlxuICAgICAgICA8c3Bhbj57e2ZpcnN0fX08L3NwYW4+XG4gICAgICAgIDxzcGFuPnt7bGFzdH19PC9zcGFuPlxuICAgICAgICA8c3Bhbj57e3JvbGV9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gaWY9XCJ7e2Ftb3VudH19IDwgMlwiIGNsYXNzPVwiYW1vdW50XCI+e3thbW91bnR9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gaWY9XCJ7e3R5cGV9fSA9PT0gJ3NhbmUnXCIgY2xhc3M9XCJzYW5pdHlcIj57e3R5cGV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbjwvdGVtcGxhdGU+YDtcblxuZnVuY3Rpb24gZGV2ICgpIHtcbiAgICB2YXIgYWxwaGFiZXQgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0KCcnKTtcbiAgICB2YXIgcyA9ICd7e2Ftb3VudH19ICsge3tudW19fSArIDMnO1xuICAgIHZhciBsaXN0ID0gW3thbW91bnQ6IDEsIG51bTogMn0sIHthbW91bnQ6IDMsIG51bTogNH0sIHthbW91bnQ6IDUsIG51bTogNn1dO1xuICAgIHZhciByID0gL1xce1xce1xcdyp9fS9nO1xuICAgIHZhciBmbiA9IFtdO1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGY7XG4gICAgcyA9IHMucmVwbGFjZShyLCBmdW5jdGlvbih3KXtcbiAgICAgICAgY29uc29sZS5sb2coJ3dvcmQnLCB3KTtcbiAgICAgICAgdmFyIHYgPSBhbHBoYWJldC5zaGlmdCgpO1xuICAgICAgICBmbi5wdXNoKHYpO1xuICAgICAgICBhcmdzLnB1c2goL1xcdysvZy5leGVjKHcpWzBdKTtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSk7XG4gICAgZm4ucHVzaChzKTtcblxuICAgIGNvbnNvbGUubG9nKCdmbicsIGZuKTtcbiAgICBjb25zb2xlLmxvZygnYXJncycsIGFyZ3MpO1xuICAgIC8vcyA9ICdyZXR1cm4gJyArIHMgKyAnOyc7XG4gICAgY29uc29sZS5sb2coJ3MnLCBzKTtcblxuICAgIHdpbmRvdy5mID0gbmV3IEZ1bmN0aW9uKHMpO1xuXG4gICAgdmFyIGR5bkZuID0gZnVuY3Rpb24gKGEsYixjLGQsZSxmKSB7XG4gICAgICAgIHZhciByID0gZXZhbChzKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfTtcblxuICAgIGNvbnNvbGUubG9nKCcgIGY6JywgZHluRm4oMSwyKSk7XG4gICAgLy9cbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdmFyIGEgPSBhcmdzLm1hcChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVthcmddO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHIgPSBkeW5Gbi5hcHBseShudWxsLCBhKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3InLCByKTtcbiAgICB9KTtcblxuXG59XG4vL2RldigpOyJdfQ==
