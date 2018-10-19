require=(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
const BaseComponent = require('./BaseComponent');

const r = /\{\{\w*}}/g;
const destroyer = document.createElement('div');

// FIXME: time current process
// Try a new one where meta data is created, instead of a template

function createCondition(name, value) {
    // FIXME name?
    value = value.replace(r, function (w) {
        w = w.replace('{{', '').replace('}}', '');
        return 'item["' + w + '"]';
    });
    //console.log('createCondition', name, value);
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
            //console.log('  ', name, value);
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

function destroy (node) {
	if(node) {
		destroyer.appendChild(node);
		destroyer.innerHTML = '';
	}
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
                destroy(node);
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
        node.itemTemplate = node.querySelector('template');
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
},{"./BaseComponent":"BaseComponent"}],2:[function(require,module,exports){
const BaseComponent = require('./BaseComponent');

function setBoolean (node, prop) {
	let propValue;
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			const att = this.getAttribute(prop);
			return (att !== undefined && att !== null && att !== 'false' && att !== false);
		},
		set (value) {
			this.isSettingAttribute = true;
			value = (value !== false && value !== null && value !== undefined);
			if (value) {
				this.setAttribute(prop, '');
			} else {
				this.removeAttribute(prop);
			}
			if (this.attributeChanged) {
				this.attributeChanged(prop, value);
			}
			const fn = this[onify(prop)];
			if (fn) {
				const eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
				window[eventName](this, () => {

					if (value !== undefined && propValue !== value) {
						value = fn.call(this, value) || value;
					}
					propValue = value;
				});
			}

			this.isSettingAttribute = false;
		}
	});
}

function setProperty (node, prop) {
	let propValue;
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			return propValue !== undefined ? propValue : normalize(this.getAttribute(prop));
		},
		set (value) {
			this.isSettingAttribute = true;
			if (typeof value === 'object') {
				propValue = value;
			} else {
				this.setAttribute(prop, value);
				if (this.attributeChanged) {
					this.attributeChanged(prop, value);
				}
			}
			const fn = this[onify(prop)];
			if(fn){
				const eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
				window[eventName](this, () => {
					if(value !== undefined){
						propValue = value;
					}

					value = fn.call(this, value) || value;
				});
			}
			this.isSettingAttribute = false;
		}
	});
}

function setProperties (node) {
	let props = node.constructor.props || node.props;
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
	let props = node.constructor.bools || node.bools;
	if (props) {
		props.forEach(function (prop) {
			setBoolean(node, prop);
		});
	}
}

function cap (name) {
	return name.substring(0,1).toUpperCase() + name.substring(1);
}

function onify (name) {
	return 'on' + name.split('-').map(word => cap(word)).join('');
}

function isBool (node, name) {
	return (node.bools || node.booleans || []).indexOf(name) > -1;
}

function boolNorm (value) {
	if(value === ''){
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
BaseComponent.normalize = normalize;
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
		if(isBool(node, name)){
			value = boolNorm(value);
			node[name] = !!value;
			if(!value){
				node[name] = false;
				node.isSettingAttribute = true;
				node.removeAttribute(name);
				node.isSettingAttribute = false;
			} else {
				node[name] = true;
			}
			return;
		}

		const v = normalize(value);

		node[name] = v;
	}
});
},{"./BaseComponent":"BaseComponent"}],3:[function(require,module,exports){
const BaseComponent = require('./BaseComponent');

function assignRefs (node) {

    [...node.querySelectorAll('[ref]')].forEach(function (child) {
        let name = child.getAttribute('ref');
		child.removeAttribute('ref');
        node[name] = child;
    });
}

function assignEvents (node) {
    // <div on="click:onClick">
	[...node.querySelectorAll('[on]')].forEach(function (child, i, children) {
		if(child === node){
			return;
		}
		let
            keyValue = child.getAttribute('on'),
            event = keyValue.split(':')[0].trim(),
            method = keyValue.split(':')[1].trim();
		// remove, so parent does not try to use it
		child.removeAttribute('on');

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
},{"./BaseComponent":"BaseComponent"}],4:[function(require,module,exports){
const BaseComponent  = require('./BaseComponent');

const lightNodes = {};
const inserted = {};

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
	return node.templateString || node.templateId;
}

function insertTemplateChain (node) {
    const templates = node.getTemplateChain();
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
    const templateNode = node.getTemplateNode();

    if(templateNode) {
        node.appendChild(BaseComponent.clone(templateNode));
    }
    insertChildren(node);
}

function getContainer (node) {
    const containers = node.querySelectorAll('[ref="container"]');
    if(!containers || !containers.length){
        return node;
    }
    return containers[containers.length - 1];
}

function insertChildren (node) {
    let i;
	const container = getContainer(node);
	const children = lightNodes[node._uid];

    if(container && children && children.length){
        for(i = 0; i < children.length; i++){
            container.appendChild(children[i]);
        }
    }
}

function toDom (html){
	const node = document.createElement('div');
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
		this.templateNode = document.getElementById(this.templateId.replace('#',''));
	}
	else if (this.templateString) {
		this.templateNode = toDom('<template>' + this.templateString + '</template>');
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
},{"./BaseComponent":"BaseComponent"}],5:[function(require,module,exports){
window['no-native-shim'] = true;
require('@clubajax/custom-elements-polyfill');
window.on = require('@clubajax/on');
window.dom = require('@clubajax/dom');


document.addEventListener('DOMContentLoaded', function () {
	const isIE = /Trident/.test(navigator.userAgent);
	function CustomError (msg) {
		Error.call(this);
		Error.stackTraceLimit = 10;
		Error.prepareStackTrace = function (err, stack) {
			return stack;
		};
		try {
			Error.captureStackTrace(this, arguments.callee);
		} catch (er) {
			// throw new Error(msg);
		}
		this.message = msg;
		this.name = 'CustomError';
	}

	CustomError.prototype.__proto__ = Error.prototype;

	function getFileName (frame) {
		const filename = frame.getFileName();
		return filename ? filename.split('/')[filename.split('/').length - 1] : '';
	}

	chai.Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {

		if (!chai.util.test(this, arguments)) {
			msg = chai.util.getMessage(this, arguments);
			let e;

			e = new CustomError(msg);
			if (e.stack) {
				const stack = [msg];
				for (let i = 0; i < e.stack.length; i++) {
					const frame = e.stack[i];
					// method is usually anonymous in expectations because it is in a ready() function
					const method = frame.getFunctionName() || frame.getMethodName() || 'anonymous';
					const filename = getFileName(frame);
					const line = frame.getLineNumber();
					if (!/globals|chai|output/.test(filename)) {
						stack.push('    ' + method + ' ' + filename + ':' + line);
					}
				}
				throw new Error(stack.join('\n'));
			} else {
				if (isIE) {
					console.trace('');
				}
				throw new Error(msg);
			}
		}
	};

});
},{"@clubajax/custom-elements-polyfill":"@clubajax/custom-elements-polyfill","@clubajax/dom":"@clubajax/dom","@clubajax/on":"@clubajax/on"}],6:[function(require,module,exports){
const BaseComponent  = require('../../src/BaseComponent');
const properties = require('../../src/properties');
const template = require('../../src/template');
const refs = require('../../src/refs');
const itemTemplate = require('../../src/item-template');
window.rand = require('randomizer');

// no actual test for this - it should just not cause an error
class TestNoProps extends BaseComponent {
	constructor() { 
		super();
	}
}
BaseComponent.define('test-no-props', TestNoProps);



class TestInheritPropsBase extends BaseComponent {
	constructor() {
		super();
		this.fooBaseCalled = false;
		this.barBaseCalled = false;
	}
	onFoo(value) {
		this.fooBaseCalled = true;
	}
	onBar(value) {
		this.barBaseCalled = true;
	}
}
BaseComponent.define('test-inherit-props-base', TestInheritPropsBase, {
	props: ['foo', 'bar'],
	bools: ['readonly'],
	attrs: ['display']
});

class TestInheritProps extends TestInheritPropsBase {
	constructor() {
		super();
	}
	attributeChanged(prop, value) {
		this[`attr-${prop}`] = value;
	}
	onFoo(value) {
		super.onFoo(value);
	}
}
BaseComponent.define('test-inherit-props', TestInheritProps, {
	props: ['bazz', 'buzz'],
	bools: ['disabled'],
	attrs: ['value']
});




class TestValue extends BaseComponent {

	attributeChanged (name, value) {
		if (name === 'value') {
			this.value = dom.normalize(value);
		}
	}

	set value (value) {
		this.__value = value;
	}

	get value () {
		return this.__value;
	}
}

BaseComponent.define('test-value', TestValue, {
	props: [],
	bools: [],
	attrs: ['value']
});

class TestDefine extends BaseComponent {

	constructor(...args) {
		super();
	}

	onFoo () {
		on.fire(document, 'foo-called');
	}

	onNbc () {
		on.fire(document, 'nbc-called');
	}

	attributeChanged (name, value) {
		this[name + '-changed'] = dom.normalize(value) || value !== null;
	}
}

BaseComponent.define('test-define', TestDefine, {
	props: ['foo'],
	bools: ['nbc']
});

class TestProps extends BaseComponent {

	constructor(...args) {
		super();
	}

    onFoo () {
		on.fire(document, 'foo-called');
	}

	onNbc () {
		on.fire(document, 'nbc-called');
	}

    attributeChanged (name, value) {
        this[name + '-changed'] = dom.normalize(value) || value !== null;
	}
}


BaseComponent.define('test-props', TestProps, {
	props: ['foo', 'bar', 'tabindex', 'min', 'max', 'my-complex-prop'],
	bools: ['nbc', 'cbs', 'disabled', 'readonly']
});

class TestNewProps extends BaseComponent {

	constructor(...args) {
		super();
		console.log('NEW!');
		//this.setProps(['foo']);
	}

	getProps () {
		return ['foo']
	}

	// static get observedAttributes() {
	// 	debugger
	// 	return ['nbc']
	// }

	attributeChanged (name, value) {
		console.log(' ---- change', name, value);
	}
}
customElements.define('test-new-props', TestNewProps);
window.TestNewProps = TestNewProps;

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


class ChildButton extends BaseComponent {
	get templateString () {
		return `<button ref="btnNode" on="click:onClick">Click Me</button>`;
	}

	onClick () {
		this.emit('change', {value: this.getAttribute('value')});
	}

}
customElements.define('child-button', ChildButton);

class TestTmplCmptRefs extends BaseComponent {
	get templateString () {
		return `<div>
			<child-button on="change:onChange" value="A" ></child-button>
			<child-button on="change:onChange" value="B" ></child-button>
			<child-button on="change:onChange" value="C" ></child-button>
        </div>`;
	}

	onChange (e) {
		on.fire(document, 'ref-change-called', {value:e.value});
	}
}
customElements.define('test-tmpl-cmpt-refs', TestTmplCmptRefs);

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

class TestListComponent extends BaseComponent {

	static get observedAttributes() { return ['item-tag']; }
	get props () { return ['item-tag']; }

	constructor () {
		super();
	}

	set data (items) {
		this.items = items;
		this.onConnected(this.renderItems.bind(this));
	}

	renderItems () {
		const frag = document.createDocumentFragment();
		const tag = this['item-tag'];
		const self = this;
		this.items.forEach(function (item) {
			const node = dom(tag, {}, frag);
			node.data = item;
		});
		this.onDomReady(() => {
			this.appendChild(frag);
		});
	}

	domReady () {

	}
}
customElements.define('test-list-component', TestListComponent);

// address1:"6441"
// address2:"Alexander Way"
// birthday:"01/14/2018"
// city:"Durham"
// company:"Craigslist"
// email:"jcurtis@craigslist.com"
// firstName:"Jordan"
// lastName:"Curtis"
// phone:"704-750-4316"
// ssn:"361-17-6344"
// state:"North Carolina"
// zipcode:"86310"


class TestListComponentItem extends BaseComponent {

	static get observedAttributes() { return ['list-title']; }
	get props () { return ['list-title']; }

	constructor () {
		super();
	}

	set data (item) {
		this.item = item;
		this.onConnected(this.renderItem.bind(this));
	}

	renderItem () {
		const item = this.item;
		const self = this;

		dom('div', {html:[
			dom('label', {html: 'Name:'}),
			dom('span', {html: item.firstName}),
			dom('span', {html: item.lastName})
		]}, this);

		dom('div', {html:[
			dom('div', {class: 'indent', html:[
				dom('div', {html:[
					dom('label', {html: 'Address:'}),
					dom('span', {html: item.address1}),
					dom('span', {html: item.address2}),
					dom('span', {html: item.city}),
					dom('span', {html: item.state}),
					dom('span', {html: item.zipcode})
				]}),
				dom('div', {html:[
					dom('label', {html: 'Company:'}),
					dom('span', {html: item.company})
				]}),
				dom('div', {html:[
					dom('label', {html: 'Birthday:'}),
					dom('span', {html: item.birthday})
				]}),
				dom('div', {html:[
					dom('label', {html: 'SSN:'}),
					dom('span', {html: item.ssn})
				]})
			]})
		]}, this);
	}

	domReady () {

	}
}
customElements.define('test-list-component-item', TestListComponentItem);

class TestListComponentTmpl extends BaseComponent {

	static get observedAttributes() { return ['list-title']; }
	get props () { return ['list-title']; }

	constructor () {
		super();
	}

	get templateString () {
		return `
            <div>
            	<label>Name:</label><span ref="firstName"></span><span ref="lastName"></span>
			</div>
			<div class="indent">
				<div>
					<label>Address:</label><span ref="address1"></span><span ref="address2"></span><span ref="city"></span><span ref="state"></span><span ref="zipcode"></span>
				</div>
				<div>
					<label>Company:</label><span ref="company"></span>
				</div>
				<div>
					<label>DOB:</label><span ref="birthday"></span>
				</div>
				<div>
					<label>SSN:</label><span ref="ssn"></span>
				</div>
			</div>
		`;
	}

	set data (item) {
		this.item = item;
		this.onConnected(this.renderItem.bind(this));
	}

	renderItem () {
		const item = this.item;
		const self = this;
		Object.keys(item).forEach(function (key) {
			if(self[key]){
				let node = document.createTextNode(item[key]);
				self[key].appendChild(node);
			}
		})
	}

	domReady () {

	}
}
customElements.define('test-list-component-tmpl', TestListComponentTmpl);

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
},{"../../src/BaseComponent":"BaseComponent","../../src/item-template":1,"../../src/properties":2,"../../src/refs":3,"../../src/template":4,"randomizer":"randomizer"}],"BaseComponent":[function(require,module,exports){
const on = require('@clubajax/on');

class BaseComponent extends HTMLElement {
	constructor () {
		super();
		this._uid = uid(this.localName);
		privates[this._uid] = { DOMSTATE: 'created' };
		privates[this._uid].handleList = [];
		plugin('init', this);
	}

	connectedCallback () {
		privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
		plugin('preConnected', this);
		nextTick(onCheckDomReady.bind(this));
		if (this.connected) {
			this.connected();
		}
		this.fire('connected');
		plugin('postConnected', this);
	}

	onConnected (callback) {
		if (this.DOMSTATE === 'connected' || this.DOMSTATE === 'domready') {
			callback(this);
			return;
		}
		this.once('connected', () => {
			callback(this);
		});
	}

	onDomReady (callback) {
		if (this.DOMSTATE === 'domready') {
			callback(this);
			return;
		}
		this.once('domready', () => {
			callback(this);
		});
	}

	disconnectedCallback () {
		privates[this._uid].DOMSTATE = 'disconnected';
		plugin('preDisconnected', this);
		if (this.disconnected) {
			this.disconnected();
		}
		this.fire('disconnected');

		let time, dod = BaseComponent.destroyOnDisconnect;
		if (dod) {
			time = typeof dod === 'number' ? doc : 300;
			setTimeout(() => {
				if (this.DOMSTATE === 'disconnected') {
					this.destroy();
				}
			}, time);
		}
	}

	attributeChangedCallback (attrName, oldVal, newVal) {
		if (!this.isSettingAttribute) {
			newVal = BaseComponent.normalize(newVal);
			plugin('preAttributeChanged', this, attrName, newVal, oldVal);
			if (this.attributeChanged && BaseComponent.normalize(oldVal) !== newVal) {
				this.attributeChanged(attrName, newVal, oldVal);
			}
		}
	}

	destroy () {
		this.fire('destroy');
		privates[this._uid].handleList.forEach(function (handle) {
			handle.remove();
		});
		destroy(this);
	}

	fire (eventName, eventDetail, bubbles) {
		return on.fire(this, eventName, eventDetail, bubbles);
	}

	emit (eventName, value) {
		return on.emit(this, eventName, value);
	}

	on (node, eventName, selector, callback) {
		return this.registerHandle(
			typeof node !== 'string' ? // no node is supplied
				on(node, eventName, selector, callback) :
				on(this, node, eventName, selector));
	}

	once (node, eventName, selector, callback) {
		return this.registerHandle(
			typeof node !== 'string' ? // no node is supplied
				on.once(node, eventName, selector, callback) :
				on.once(this, node, eventName, selector, callback));
	}

	attr (key, value, toggle) {
		this.isSettingAttribute = true;
		const add = toggle === undefined ? true : !!toggle;
		if (add) {
			this.setAttribute(key, value);
		} else {
			this.removeAttribute(key);
		}
		this.isSettingAttribute = false;
	}

	registerHandle (handle) {
		privates[this._uid].handleList.push(handle);
		return handle;
	}

	get DOMSTATE () {
		return privates[this._uid].DOMSTATE;
	}

	static set destroyOnDisconnect (value) {
		privates['destroyOnDisconnect'] = value;
	}

	static get destroyOnDisconnect () {
		return privates['destroyOnDisconnect'];
	}

	static clone (template) {
		if (template.content && template.content.children) {
			return document.importNode(template.content, true);
		}
		const frag = document.createDocumentFragment();
		const cloneNode = document.createElement('div');
		cloneNode.innerHTML = template.innerHTML;

		while (cloneNode.children.length) {
			frag.appendChild(cloneNode.children[0]);
		}
		return frag;
	}

	static addPlugin (plug) {
		let i, order = plug.order || 100;
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

function plugin (method, node, a, b, c) {
	plugins.forEach(function (plug) {
		if (plug[method]) {
			plug[method](node, a, b, c);
		}
	});
}

function onCheckDomReady () {
	if (this.DOMSTATE !== 'connected' || privates[this._uid].domReadyFired) {
		return;
	}

	let
		count = 0,
		children = getChildCustomNodes(this),
		ourDomReady = onSelfDomReady.bind(this);

	function addReady () {
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
			// NOPE, that failed. removed for now child.DOMSTATE === 'connected'
			if (child.DOMSTATE === 'domready') {
				addReady();
			}
			// if not, wait for event
			child.on('domready', addReady);
		});
	}
}

function onSelfDomReady () {
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

function getChildCustomNodes (node) {
	// collect any children that are custom nodes
	// used to check if their dom is ready before
	// determining if this is ready
	let i, nodes = [];
	for (i = 0; i < node.children.length; i++) {
		if (node.children[i].nodeName.indexOf('-') > -1) {
			nodes.push(node.children[i]);
		}
	}
	return nodes;
}

function nextTick (cb) {
	requestAnimationFrame(cb);
}

const uids = {};
function uid (type = 'uid') {
	if (uids[type] === undefined) {
		uids[type] = 0;
	}
	const id = type + '-' + (uids[type] + 1);
	uids[type]++;
	return id;
}

const destroyer = document.createElement('div');
function destroy (node) {
	if (node) {
		destroyer.appendChild(node);
		destroyer.innerHTML = '';
	}
}

function makeGlobalListeners (name, eventName) {
	window[name] = function (nodeOrNodes, callback) {
		function handleDomReady (node, cb) {
			function onReady () {
				cb(node);
				node.removeEventListener(eventName, onReady);
			}

			if (node.DOMSTATE === eventName || node.DOMSTATE === 'domready') {
				cb(node);
			}
			else {
				node.addEventListener(eventName, onReady);
			}
		}

		if (!Array.isArray(nodeOrNodes)) {
			handleDomReady(nodeOrNodes, callback);
			return;
		}

		let count = 0;

		function onArrayNodeReady () {
			count++;
			if (count === nodeOrNodes.length) {
				callback(nodeOrNodes);
			}
		}

		for (let i = 0; i < nodeOrNodes.length; i++) {
			handleDomReady(nodeOrNodes[i], onArrayNodeReady);
		}
	};
}

makeGlobalListeners('onDomReady', 'domready');
makeGlobalListeners('onConnected', 'connected');

function testOptions(options) {
	const tests = {
		'prop': 'props',
		'bool': 'bools',
		'attr': 'attrs',
		'properties': 'props',
		'booleans': 'bools',
		'property': 'props',
		'boolean': 'bools'
	}
	Object.keys(tests).forEach((key) => { 
		if (options[key]) {
			console.error(`BaseComponent.define found "${key}"; Did you mean: "${tests[key]}"?` );
		}
	})
}

BaseComponent.injectProps = function (Constructor, { props = [], bools = [], attrs = [] }) {
	Constructor.bools = [...(Constructor.bools || []), ...bools];
	Constructor.props = [...(Constructor.props || []), ...props];
	Constructor.attrs = [...(Constructor.attrs || []), ...attrs];
	Constructor.observedAttributes = [...Constructor.bools, ...Constructor.props, ...Constructor.attrs];
};

BaseComponent.define = function (tagName, Constructor, options = {}) {
	testOptions(options);
	BaseComponent.injectProps(Constructor, options);
	customElements.define(tagName, Constructor);
	return Constructor;
};

module.exports = BaseComponent;
},{"@clubajax/on":"@clubajax/on"}]},{},[5,6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaXRlbS10ZW1wbGF0ZS5qcyIsInNyYy9wcm9wZXJ0aWVzLmpzIiwic3JjL3JlZnMuanMiLCJzcmMvdGVtcGxhdGUuanMiLCJ0ZXN0cy9zcmMvZ2xvYmFscy5qcyIsInRlc3RzL3NyYy9saWZlY3ljbGUuanMiLCJzcmMvQmFzZUNvbXBvbmVudCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiY29uc3QgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuXG5jb25zdCByID0gL1xce1xce1xcdyp9fS9nO1xuY29uc3QgZGVzdHJveWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbi8vIEZJWE1FOiB0aW1lIGN1cnJlbnQgcHJvY2Vzc1xuLy8gVHJ5IGEgbmV3IG9uZSB3aGVyZSBtZXRhIGRhdGEgaXMgY3JlYXRlZCwgaW5zdGVhZCBvZiBhIHRlbXBsYXRlXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbmRpdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIC8vIEZJWE1FIG5hbWU/XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHIsIGZ1bmN0aW9uICh3KSB7XG4gICAgICAgIHcgPSB3LnJlcGxhY2UoJ3t7JywgJycpLnJlcGxhY2UoJ319JywgJycpO1xuICAgICAgICByZXR1cm4gJ2l0ZW1bXCInICsgdyArICdcIl0nO1xuICAgIH0pO1xuICAgIC8vY29uc29sZS5sb2coJ2NyZWF0ZUNvbmRpdGlvbicsIG5hbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGV2YWwodmFsdWUpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHdhbGtEb20obm9kZSwgcmVmcykge1xuXG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICAgIG5vZGU6IG5vZGVcbiAgICB9O1xuXG4gICAgcmVmcy5ub2Rlcy5wdXNoKGl0ZW0pO1xuXG4gICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vZGUuYXR0cmlidXRlc1tpXS5uYW1lLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gbm9kZS5hdHRyaWJ1dGVzW2ldLnZhbHVlO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnICAnLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2lmJykge1xuICAgICAgICAgICAgICAgIGl0ZW0uY29uZGl0aW9uYWwgPSBjcmVhdGVDb25kaXRpb24obmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoL1xce1xcey8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAvLyA8ZGl2IGlkPVwie3tpZH19XCI+XG4gICAgICAgICAgICAgICAgcmVmcy5hdHRyaWJ1dGVzID0gcmVmcy5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGl0ZW0uYXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBjb3VsZCBiZSBtb3JlIHRoYW4gb25lPz9cbiAgICAgICAgICAgICAgICAvLyBzYW1lIHdpdGggbm9kZT9cbiAgICAgICAgICAgICAgICByZWZzLmF0dHJpYnV0ZXNbbmFtZV0gPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2hvdWxkIHByb2JhYmx5IGxvb3Agb3ZlciBjaGlsZE5vZGVzIGFuZCBjaGVjayB0ZXh0IG5vZGVzIGZvciByZXBsYWNlbWVudHNcbiAgICAvL1xuICAgIGlmICghbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKC9cXHtcXHsvLnRlc3Qobm9kZS5pbm5lckhUTUwpKSB7XG4gICAgICAgICAgICAvLyBGSVhNRSAtIGlubmVySFRNTCBhcyB2YWx1ZSB0b28gbmFpdmVcbiAgICAgICAgICAgIGxldCBwcm9wID0gbm9kZS5pbm5lckhUTUwucmVwbGFjZSgne3snLCAnJykucmVwbGFjZSgnfX0nLCAnJyk7XG4gICAgICAgICAgICBpdGVtLnRleHQgPSBpdGVtLnRleHQgfHwge307XG4gICAgICAgICAgICBpdGVtLnRleHRbcHJvcF0gPSBub2RlLmlubmVySFRNTDtcbiAgICAgICAgICAgIHJlZnNbcHJvcF0gPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgd2Fsa0RvbShub2RlLmNoaWxkcmVuW2ldLCByZWZzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUl0ZW1UZW1wbGF0ZShmcmFnKSB7XG4gICAgbGV0IHJlZnMgPSB7XG4gICAgICAgIG5vZGVzOiBbXVxuICAgIH07XG4gICAgd2Fsa0RvbShmcmFnLCByZWZzKTtcbiAgICByZXR1cm4gcmVmcztcbn1cblxuZnVuY3Rpb24gZGVzdHJveSAobm9kZSkge1xuXHRpZihub2RlKSB7XG5cdFx0ZGVzdHJveWVyLmFwcGVuZENoaWxkKG5vZGUpO1xuXHRcdGRlc3Ryb3llci5pbm5lckhUTUwgPSAnJztcblx0fVxufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5yZW5kZXJMaXN0ID0gZnVuY3Rpb24gKGl0ZW1zLCBjb250YWluZXIsIGl0ZW1UZW1wbGF0ZSkge1xuICAgIGxldFxuICAgICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICB0bXBsID0gaXRlbVRlbXBsYXRlIHx8IHRoaXMuaXRlbVRlbXBsYXRlLFxuICAgICAgICByZWZzID0gdG1wbC5pdGVtUmVmcyxcbiAgICAgICAgY2xvbmUsXG4gICAgICAgIGRlZmVyO1xuXG4gICAgZnVuY3Rpb24gd2FybihuYW1lKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChkZWZlcik7XG4gICAgICAgIGRlZmVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0F0dGVtcHRlZCB0byBzZXQgYXR0cmlidXRlIGZyb20gbm9uLWV4aXN0ZW50IGl0ZW0gcHJvcGVydHk6JywgbmFtZSk7XG4gICAgICAgIH0sIDEpO1xuICAgIH1cblxuICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblxuICAgICAgICBsZXRcbiAgICAgICAgICAgIGlmQ291bnQgPSAwLFxuICAgICAgICAgICAgZGVsZXRpb25zID0gW107XG5cbiAgICAgICAgcmVmcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZWYpIHtcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGNhbid0IHN3YXAgYmVjYXVzZSB0aGUgaW5uZXJIVE1MIGlzIGJlaW5nIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIGNhbid0IGNsb25lIGJlY2F1c2UgdGhlbiB0aGVyZSBpcyBub3QgYSBub2RlIHJlZmVyZW5jZVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGxldFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIG5vZGUgPSByZWYubm9kZSxcbiAgICAgICAgICAgICAgICBoYXNOb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChyZWYuY29uZGl0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZi5jb25kaXRpb25hbChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNOb2RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuJ3QgYWN0dWFsbHkgZGVsZXRlLCBiZWNhdXNlIHRoaXMgaXMgdGhlIG9yaWdpbmFsIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc3RlYWQsIGFkZGluZyBhdHRyaWJ1dGUgdG8gdHJhY2sgbm9kZSwgdG8gYmUgZGVsZXRlZCBpbiBjbG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGFmdGVyLCByZW1vdmUgdGVtcG9yYXJ5IGF0dHJpYnV0ZSBmcm9tIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIHJlZi5ub2RlLnNldEF0dHJpYnV0ZSgnaWZzJywgaWZDb3VudCsnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0aW9ucy5wdXNoKCdbaWZzPVwiJytpZkNvdW50KydcIl0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZWYuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZWYuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZi5hdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZWYubm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3dhcCBhdHQnLCBrZXksIHZhbHVlLCByZWYubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVmLnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVmLnRleHQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWYudGV4dFtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3dhcCB0ZXh0Jywga2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSB2YWx1ZS5yZXBsYWNlKHZhbHVlLCBpdGVtW2tleV0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2xvbmUgPSB0bXBsLmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICBkZWxldGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZGVsKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoZGVsKTtcbiAgICAgICAgICAgIGlmKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkZXN0cm95KG5vZGUpO1xuICAgICAgICAgICAgICAgIGxldCB0bXBsTm9kZSA9IHRtcGwucXVlcnlTZWxlY3RvcihkZWwpO1xuICAgICAgICAgICAgICAgIHRtcGxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnaWZzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWcpO1xuXG4gICAgLy9pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgLy8gICAgT2JqZWN0LmtleXMoaXRlbSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgLy8gICAgICAgIGlmKHJlZnNba2V5XSl7XG4gICAgLy8gICAgICAgICAgICByZWZzW2tleV0uaW5uZXJIVE1MID0gaXRlbVtrZXldO1xuICAgIC8vICAgICAgICB9XG4gICAgLy8gICAgfSk7XG4gICAgLy8gICAgaWYocmVmcy5hdHRyaWJ1dGVzKXtcbiAgICAvLyAgICAgICAgT2JqZWN0LmtleXMocmVmcy5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgLy8gICAgICAgICAgICBsZXQgbm9kZSA9IHJlZnMuYXR0cmlidXRlc1tuYW1lXTtcbiAgICAvLyAgICAgICAgICAgIGlmKGl0ZW1bbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgIC8vICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIGl0ZW1bbmFtZV0pO1xuICAgIC8vICAgICAgICAgICAgfWVsc2V7XG4gICAgLy8gICAgICAgICAgICAgICAgd2FybihuYW1lKTtcbiAgICAvLyAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgfSk7XG4gICAgLy8gICAgfVxuICAgIC8vXG4gICAgLy8gICAgY2xvbmUgPSB0bXBsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAvLyAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAvL30pO1xuXG4gICAgLy9jb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZyk7XG59O1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ2l0ZW0tdGVtcGxhdGUnLFxuICAgIG9yZGVyOiA0MCxcbiAgICBwcmVEb21SZWFkeTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUgPSBub2RlLnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyk7XG4gICAgICAgIGlmIChub2RlLml0ZW1UZW1wbGF0ZSkge1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZSA9IEJhc2VDb21wb25lbnQuY2xvbmUobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUuaXRlbVJlZnMgPSB1cGRhdGVJdGVtVGVtcGxhdGUobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHQnaXRlbS10ZW1wbGF0ZSc6IHRydWVcbn07IiwiY29uc3QgQmFzZUNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuXG5mdW5jdGlvbiBzZXRCb29sZWFuIChub2RlLCBwcm9wKSB7XG5cdGxldCBwcm9wVmFsdWU7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0Z2V0ICgpIHtcblx0XHRcdGNvbnN0IGF0dCA9IHRoaXMuZ2V0QXR0cmlidXRlKHByb3ApO1xuXHRcdFx0cmV0dXJuIChhdHQgIT09IHVuZGVmaW5lZCAmJiBhdHQgIT09IG51bGwgJiYgYXR0ICE9PSAnZmFsc2UnICYmIGF0dCAhPT0gZmFsc2UpO1xuXHRcdH0sXG5cdFx0c2V0ICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0dmFsdWUgPSAodmFsdWUgIT09IGZhbHNlICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpO1xuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKHByb3AsICcnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKHByb3ApO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuYXR0cmlidXRlQ2hhbmdlZCkge1xuXHRcdFx0XHR0aGlzLmF0dHJpYnV0ZUNoYW5nZWQocHJvcCwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgZm4gPSB0aGlzW29uaWZ5KHByb3ApXTtcblx0XHRcdGlmIChmbikge1xuXHRcdFx0XHRjb25zdCBldmVudE5hbWUgPSB0aGlzLnByb3BzT25SZWFkeSA/ICdvbkRvbVJlYWR5JyA6ICdvbkNvbm5lY3RlZCc7XG5cdFx0XHRcdHdpbmRvd1tldmVudE5hbWVdKHRoaXMsICgpID0+IHtcblxuXHRcdFx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHByb3BWYWx1ZSAhPT0gdmFsdWUpIHtcblx0XHRcdFx0XHRcdHZhbHVlID0gZm4uY2FsbCh0aGlzLCB2YWx1ZSkgfHwgdmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHByb3BWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eSAobm9kZSwgcHJvcCkge1xuXHRsZXQgcHJvcFZhbHVlO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRyZXR1cm4gcHJvcFZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wVmFsdWUgOiBub3JtYWxpemUodGhpcy5nZXRBdHRyaWJ1dGUocHJvcCkpO1xuXHRcdH0sXG5cdFx0c2V0ICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0cHJvcFZhbHVlID0gdmFsdWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG5cdFx0XHRcdGlmICh0aGlzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcblx0XHRcdFx0XHR0aGlzLmF0dHJpYnV0ZUNoYW5nZWQocHJvcCwgdmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBmbiA9IHRoaXNbb25pZnkocHJvcCldO1xuXHRcdFx0aWYoZm4pe1xuXHRcdFx0XHRjb25zdCBldmVudE5hbWUgPSB0aGlzLnByb3BzT25SZWFkeSA/ICdvbkRvbVJlYWR5JyA6ICdvbkNvbm5lY3RlZCc7XG5cdFx0XHRcdHdpbmRvd1tldmVudE5hbWVdKHRoaXMsICgpID0+IHtcblx0XHRcdFx0XHRpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0XHRcdHByb3BWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhbHVlID0gZm4uY2FsbCh0aGlzLCB2YWx1ZSkgfHwgdmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzIChub2RlKSB7XG5cdGxldCBwcm9wcyA9IG5vZGUuY29uc3RydWN0b3IucHJvcHMgfHwgbm9kZS5wcm9wcztcblx0aWYgKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0aWYgKHByb3AgPT09ICdkaXNhYmxlZCcpIHtcblx0XHRcdFx0c2V0Qm9vbGVhbihub2RlLCBwcm9wKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzZXRQcm9wZXJ0eShub2RlLCBwcm9wKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXRCb29sZWFucyAobm9kZSkge1xuXHRsZXQgcHJvcHMgPSBub2RlLmNvbnN0cnVjdG9yLmJvb2xzIHx8IG5vZGUuYm9vbHM7XG5cdGlmIChwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY2FwIChuYW1lKSB7XG5cdHJldHVybiBuYW1lLnN1YnN0cmluZygwLDEpLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cmluZygxKTtcbn1cblxuZnVuY3Rpb24gb25pZnkgKG5hbWUpIHtcblx0cmV0dXJuICdvbicgKyBuYW1lLnNwbGl0KCctJykubWFwKHdvcmQgPT4gY2FwKHdvcmQpKS5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gaXNCb29sIChub2RlLCBuYW1lKSB7XG5cdHJldHVybiAobm9kZS5ib29scyB8fCBub2RlLmJvb2xlYW5zIHx8IFtdKS5pbmRleE9mKG5hbWUpID4gLTE7XG59XG5cbmZ1bmN0aW9uIGJvb2xOb3JtICh2YWx1ZSkge1xuXHRpZih2YWx1ZSA9PT0gJycpe1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBub3JtYWxpemUodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemUodmFsKSB7XG5cdGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuXHRcdHZhbCA9IHZhbC50cmltKCk7XG5cdFx0aWYgKHZhbCA9PT0gJ2ZhbHNlJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gZWxzZSBpZiAodmFsID09PSAnbnVsbCcpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0gZWxzZSBpZiAodmFsID09PSAndHJ1ZScpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQvLyBmaW5kcyBzdHJpbmdzIHRoYXQgc3RhcnQgd2l0aCBudW1iZXJzLCBidXQgYXJlIG5vdCBudW1iZXJzOlxuXHRcdC8vICcxdGVhbScgJzEyMyBTdHJlZXQnLCAnMS0yLTMnLCBldGNcblx0XHRpZiAoKCcnICsgdmFsKS5yZXBsYWNlKC8tP1xcZCpcXC4/XFxkKi8sICcnKS5sZW5ndGgpIHtcblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fVxuXHR9XG5cdGlmICghaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSkge1xuXHRcdHJldHVybiBwYXJzZUZsb2F0KHZhbCk7XG5cdH1cblx0cmV0dXJuIHZhbDtcbn1cbkJhc2VDb21wb25lbnQubm9ybWFsaXplID0gbm9ybWFsaXplO1xuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuXHRuYW1lOiAncHJvcGVydGllcycsXG5cdG9yZGVyOiAxMCxcblx0aW5pdDogZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRzZXRQcm9wZXJ0aWVzKG5vZGUpO1xuXHRcdHNldEJvb2xlYW5zKG5vZGUpO1xuXHR9LFxuXHRwcmVBdHRyaWJ1dGVDaGFuZ2VkOiBmdW5jdGlvbiAobm9kZSwgbmFtZSwgdmFsdWUpIHtcblx0XHRpZiAobm9kZS5pc1NldHRpbmdBdHRyaWJ1dGUpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYoaXNCb29sKG5vZGUsIG5hbWUpKXtcblx0XHRcdHZhbHVlID0gYm9vbE5vcm0odmFsdWUpO1xuXHRcdFx0bm9kZVtuYW1lXSA9ICEhdmFsdWU7XG5cdFx0XHRpZighdmFsdWUpe1xuXHRcdFx0XHRub2RlW25hbWVdID0gZmFsc2U7XG5cdFx0XHRcdG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdFx0bm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0XHRcdG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlID0gZmFsc2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRub2RlW25hbWVdID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB2ID0gbm9ybWFsaXplKHZhbHVlKTtcblxuXHRcdG5vZGVbbmFtZV0gPSB2O1xuXHR9XG59KTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5cbmZ1bmN0aW9uIGFzc2lnblJlZnMgKG5vZGUpIHtcblxuICAgIFsuLi5ub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWZdJyldLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGxldCBuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcblx0XHRjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICBub2RlW25hbWVdID0gY2hpbGQ7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbkV2ZW50cyAobm9kZSkge1xuICAgIC8vIDxkaXYgb249XCJjbGljazpvbkNsaWNrXCI+XG5cdFsuLi5ub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tvbl0nKV0uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGksIGNoaWxkcmVuKSB7XG5cdFx0aWYoY2hpbGQgPT09IG5vZGUpe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXRcbiAgICAgICAgICAgIGtleVZhbHVlID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdvbicpLFxuICAgICAgICAgICAgZXZlbnQgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzBdLnRyaW0oKSxcbiAgICAgICAgICAgIG1ldGhvZCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMV0udHJpbSgpO1xuXHRcdC8vIHJlbW92ZSwgc28gcGFyZW50IGRvZXMgbm90IHRyeSB0byB1c2UgaXRcblx0XHRjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ29uJyk7XG5cbiAgICAgICAgbm9kZS5vbihjaGlsZCwgZXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBub2RlW21ldGhvZF0oZSlcbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICdyZWZzJyxcbiAgICBvcmRlcjogMzAsXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBhc3NpZ25SZWZzKG5vZGUpO1xuICAgICAgICBhc3NpZ25FdmVudHMobm9kZSk7XG4gICAgfVxufSk7IiwiY29uc3QgQmFzZUNvbXBvbmVudCAgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcblxuY29uc3QgbGlnaHROb2RlcyA9IHt9O1xuY29uc3QgaW5zZXJ0ZWQgPSB7fTtcblxuZnVuY3Rpb24gaW5zZXJ0IChub2RlKSB7XG4gICAgaWYoaW5zZXJ0ZWRbbm9kZS5fdWlkXSB8fCAhaGFzVGVtcGxhdGUobm9kZSkpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbGxlY3RMaWdodE5vZGVzKG5vZGUpO1xuICAgIGluc2VydFRlbXBsYXRlKG5vZGUpO1xuICAgIGluc2VydGVkW25vZGUuX3VpZF0gPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKXtcbiAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0gPSBsaWdodE5vZGVzW25vZGUuX3VpZF0gfHwgW107XG4gICAgd2hpbGUobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCl7XG4gICAgICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXS5wdXNoKG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5jaGlsZE5vZGVzWzBdKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYXNUZW1wbGF0ZSAobm9kZSkge1xuXHRyZXR1cm4gbm9kZS50ZW1wbGF0ZVN0cmluZyB8fCBub2RlLnRlbXBsYXRlSWQ7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlQ2hhaW4gKG5vZGUpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZXMgPSBub2RlLmdldFRlbXBsYXRlQ2hhaW4oKTtcbiAgICB0ZW1wbGF0ZXMucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgIGdldENvbnRhaW5lcihub2RlKS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlKSk7XG4gICAgfSk7XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlIChub2RlKSB7XG4gICAgaWYobm9kZS5uZXN0ZWRUZW1wbGF0ZSl7XG4gICAgICAgIGluc2VydFRlbXBsYXRlQ2hhaW4obm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGVtcGxhdGVOb2RlID0gbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcblxuICAgIGlmKHRlbXBsYXRlTm9kZSkge1xuICAgICAgICBub2RlLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGVOb2RlKSk7XG4gICAgfVxuICAgIGluc2VydENoaWxkcmVuKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250YWluZXIgKG5vZGUpIHtcbiAgICBjb25zdCBjb250YWluZXJzID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbcmVmPVwiY29udGFpbmVyXCJdJyk7XG4gICAgaWYoIWNvbnRhaW5lcnMgfHwgIWNvbnRhaW5lcnMubGVuZ3RoKXtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXJzW2NvbnRhaW5lcnMubGVuZ3RoIC0gMV07XG59XG5cbmZ1bmN0aW9uIGluc2VydENoaWxkcmVuIChub2RlKSB7XG4gICAgbGV0IGk7XG5cdGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcihub2RlKTtcblx0Y29uc3QgY2hpbGRyZW4gPSBsaWdodE5vZGVzW25vZGUuX3VpZF07XG5cbiAgICBpZihjb250YWluZXIgJiYgY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdG9Eb20gKGh0bWwpe1xuXHRjb25zdCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcblx0cmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbn1cblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0TGlnaHROb2RlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbGlnaHROb2Rlc1t0aGlzLl91aWRdO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVOb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGNhY2hpbmcgY2F1c2VzIGRpZmZlcmVudCBjbGFzc2VzIHRvIHB1bGwgdGhlIHNhbWUgdGVtcGxhdGUgLSB3YXQ/XG4gICAgLy9pZighdGhpcy50ZW1wbGF0ZU5vZGUpIHtcblx0aWYgKHRoaXMudGVtcGxhdGVJZCkge1xuXHRcdHRoaXMudGVtcGxhdGVOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZW1wbGF0ZUlkLnJlcGxhY2UoJyMnLCcnKSk7XG5cdH1cblx0ZWxzZSBpZiAodGhpcy50ZW1wbGF0ZVN0cmluZykge1xuXHRcdHRoaXMudGVtcGxhdGVOb2RlID0gdG9Eb20oJzx0ZW1wbGF0ZT4nICsgdGhpcy50ZW1wbGF0ZVN0cmluZyArICc8L3RlbXBsYXRlPicpO1xuXHR9XG4gICAgLy99XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVOb2RlO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVDaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGxldFxuICAgICAgICBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgdGVtcGxhdGVzID0gW10sXG4gICAgICAgIHRlbXBsYXRlO1xuXG4gICAgLy8gd2FsayB0aGUgcHJvdG90eXBlIGNoYWluOyBCYWJlbCBkb2Vzbid0IGFsbG93IHVzaW5nXG4gICAgLy8gYHN1cGVyYCBzaW5jZSB3ZSBhcmUgb3V0c2lkZSBvZiB0aGUgQ2xhc3NcbiAgICB3aGlsZShjb250ZXh0KXtcbiAgICAgICAgY29udGV4dCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250ZXh0KTtcbiAgICAgICAgaWYoIWNvbnRleHQpeyBicmVhazsgfVxuICAgICAgICAvLyBza2lwIHByb3RvdHlwZXMgd2l0aG91dCBhIHRlbXBsYXRlXG4gICAgICAgIC8vIChlbHNlIGl0IHdpbGwgcHVsbCBhbiBpbmhlcml0ZWQgdGVtcGxhdGUgYW5kIGNhdXNlIGR1cGxpY2F0ZXMpXG4gICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlU3RyaW5nJykgfHwgY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVJZCcpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IGNvbnRleHQuZ2V0VGVtcGxhdGVOb2RlKCk7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMucHVzaCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlcztcbn07XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAndGVtcGxhdGUnLFxuICAgIG9yZGVyOiAyMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGluc2VydChub2RlKTtcbiAgICB9XG59KTsiLCJ3aW5kb3dbJ25vLW5hdGl2ZS1zaGltJ10gPSB0cnVlO1xucmVxdWlyZSgnQGNsdWJhamF4L2N1c3RvbS1lbGVtZW50cy1wb2x5ZmlsbCcpO1xud2luZG93Lm9uID0gcmVxdWlyZSgnQGNsdWJhamF4L29uJyk7XG53aW5kb3cuZG9tID0gcmVxdWlyZSgnQGNsdWJhamF4L2RvbScpO1xuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG5cdGNvbnN0IGlzSUUgPSAvVHJpZGVudC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblx0ZnVuY3Rpb24gQ3VzdG9tRXJyb3IgKG1zZykge1xuXHRcdEVycm9yLmNhbGwodGhpcyk7XG5cdFx0RXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gMTA7XG5cdFx0RXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBmdW5jdGlvbiAoZXJyLCBzdGFjaykge1xuXHRcdFx0cmV0dXJuIHN0YWNrO1xuXHRcdH07XG5cdFx0dHJ5IHtcblx0XHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIGFyZ3VtZW50cy5jYWxsZWUpO1xuXHRcdH0gY2F0Y2ggKGVyKSB7XG5cdFx0XHQvLyB0aHJvdyBuZXcgRXJyb3IobXNnKTtcblx0XHR9XG5cdFx0dGhpcy5tZXNzYWdlID0gbXNnO1xuXHRcdHRoaXMubmFtZSA9ICdDdXN0b21FcnJvcic7XG5cdH1cblxuXHRDdXN0b21FcnJvci5wcm90b3R5cGUuX19wcm90b19fID0gRXJyb3IucHJvdG90eXBlO1xuXG5cdGZ1bmN0aW9uIGdldEZpbGVOYW1lIChmcmFtZSkge1xuXHRcdGNvbnN0IGZpbGVuYW1lID0gZnJhbWUuZ2V0RmlsZU5hbWUoKTtcblx0XHRyZXR1cm4gZmlsZW5hbWUgPyBmaWxlbmFtZS5zcGxpdCgnLycpW2ZpbGVuYW1lLnNwbGl0KCcvJykubGVuZ3RoIC0gMV0gOiAnJztcblx0fVxuXG5cdGNoYWkuQXNzZXJ0aW9uLnByb3RvdHlwZS5hc3NlcnQgPSBmdW5jdGlvbiAoZXhwciwgbXNnLCBuZWdhdGVNc2csIGV4cGVjdGVkLCBfYWN0dWFsLCBzaG93RGlmZikge1xuXG5cdFx0aWYgKCFjaGFpLnV0aWwudGVzdCh0aGlzLCBhcmd1bWVudHMpKSB7XG5cdFx0XHRtc2cgPSBjaGFpLnV0aWwuZ2V0TWVzc2FnZSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0bGV0IGU7XG5cblx0XHRcdGUgPSBuZXcgQ3VzdG9tRXJyb3IobXNnKTtcblx0XHRcdGlmIChlLnN0YWNrKSB7XG5cdFx0XHRcdGNvbnN0IHN0YWNrID0gW21zZ107XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZS5zdGFjay5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGNvbnN0IGZyYW1lID0gZS5zdGFja1tpXTtcblx0XHRcdFx0XHQvLyBtZXRob2QgaXMgdXN1YWxseSBhbm9ueW1vdXMgaW4gZXhwZWN0YXRpb25zIGJlY2F1c2UgaXQgaXMgaW4gYSByZWFkeSgpIGZ1bmN0aW9uXG5cdFx0XHRcdFx0Y29uc3QgbWV0aG9kID0gZnJhbWUuZ2V0RnVuY3Rpb25OYW1lKCkgfHwgZnJhbWUuZ2V0TWV0aG9kTmFtZSgpIHx8ICdhbm9ueW1vdXMnO1xuXHRcdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gZ2V0RmlsZU5hbWUoZnJhbWUpO1xuXHRcdFx0XHRcdGNvbnN0IGxpbmUgPSBmcmFtZS5nZXRMaW5lTnVtYmVyKCk7XG5cdFx0XHRcdFx0aWYgKCEvZ2xvYmFsc3xjaGFpfG91dHB1dC8udGVzdChmaWxlbmFtZSkpIHtcblx0XHRcdFx0XHRcdHN0YWNrLnB1c2goJyAgICAnICsgbWV0aG9kICsgJyAnICsgZmlsZW5hbWUgKyAnOicgKyBsaW5lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKHN0YWNrLmpvaW4oJ1xcbicpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChpc0lFKSB7XG5cdFx0XHRcdFx0Y29uc29sZS50cmFjZSgnJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG1zZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG59KTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4uLy4uL3NyYy9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3Byb3BlcnRpZXMnKTtcbmNvbnN0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vc3JjL3RlbXBsYXRlJyk7XG5jb25zdCByZWZzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3JlZnMnKTtcbmNvbnN0IGl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uL3NyYy9pdGVtLXRlbXBsYXRlJyk7XG53aW5kb3cucmFuZCA9IHJlcXVpcmUoJ3JhbmRvbWl6ZXInKTtcblxuLy8gbm8gYWN0dWFsIHRlc3QgZm9yIHRoaXMgLSBpdCBzaG91bGQganVzdCBub3QgY2F1c2UgYW4gZXJyb3JcbmNsYXNzIFRlc3ROb1Byb3BzIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKCkgeyBcblx0XHRzdXBlcigpO1xuXHR9XG59XG5CYXNlQ29tcG9uZW50LmRlZmluZSgndGVzdC1uby1wcm9wcycsIFRlc3ROb1Byb3BzKTtcblxuXG5cbmNsYXNzIFRlc3RJbmhlcml0UHJvcHNCYXNlIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5mb29CYXNlQ2FsbGVkID0gZmFsc2U7XG5cdFx0dGhpcy5iYXJCYXNlQ2FsbGVkID0gZmFsc2U7XG5cdH1cblx0b25Gb28odmFsdWUpIHtcblx0XHR0aGlzLmZvb0Jhc2VDYWxsZWQgPSB0cnVlO1xuXHR9XG5cdG9uQmFyKHZhbHVlKSB7XG5cdFx0dGhpcy5iYXJCYXNlQ2FsbGVkID0gdHJ1ZTtcblx0fVxufVxuQmFzZUNvbXBvbmVudC5kZWZpbmUoJ3Rlc3QtaW5oZXJpdC1wcm9wcy1iYXNlJywgVGVzdEluaGVyaXRQcm9wc0Jhc2UsIHtcblx0cHJvcHM6IFsnZm9vJywgJ2JhciddLFxuXHRib29sczogWydyZWFkb25seSddLFxuXHRhdHRyczogWydkaXNwbGF5J11cbn0pO1xuXG5jbGFzcyBUZXN0SW5oZXJpdFByb3BzIGV4dGVuZHMgVGVzdEluaGVyaXRQcm9wc0Jhc2Uge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cdGF0dHJpYnV0ZUNoYW5nZWQocHJvcCwgdmFsdWUpIHtcblx0XHR0aGlzW2BhdHRyLSR7cHJvcH1gXSA9IHZhbHVlO1xuXHR9XG5cdG9uRm9vKHZhbHVlKSB7XG5cdFx0c3VwZXIub25Gb28odmFsdWUpO1xuXHR9XG59XG5CYXNlQ29tcG9uZW50LmRlZmluZSgndGVzdC1pbmhlcml0LXByb3BzJywgVGVzdEluaGVyaXRQcm9wcywge1xuXHRwcm9wczogWydiYXp6JywgJ2J1enonXSxcblx0Ym9vbHM6IFsnZGlzYWJsZWQnXSxcblx0YXR0cnM6IFsndmFsdWUnXVxufSk7XG5cblxuXG5cbmNsYXNzIFRlc3RWYWx1ZSBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG5cdGF0dHJpYnV0ZUNoYW5nZWQgKG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKG5hbWUgPT09ICd2YWx1ZScpIHtcblx0XHRcdHRoaXMudmFsdWUgPSBkb20ubm9ybWFsaXplKHZhbHVlKTtcblx0XHR9XG5cdH1cblxuXHRzZXQgdmFsdWUgKHZhbHVlKSB7XG5cdFx0dGhpcy5fX3ZhbHVlID0gdmFsdWU7XG5cdH1cblxuXHRnZXQgdmFsdWUgKCkge1xuXHRcdHJldHVybiB0aGlzLl9fdmFsdWU7XG5cdH1cbn1cblxuQmFzZUNvbXBvbmVudC5kZWZpbmUoJ3Rlc3QtdmFsdWUnLCBUZXN0VmFsdWUsIHtcblx0cHJvcHM6IFtdLFxuXHRib29sczogW10sXG5cdGF0dHJzOiBbJ3ZhbHVlJ11cbn0pO1xuXG5jbGFzcyBUZXN0RGVmaW5lIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cblx0Y29uc3RydWN0b3IoLi4uYXJncykge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRvbkZvbyAoKSB7XG5cdFx0b24uZmlyZShkb2N1bWVudCwgJ2Zvby1jYWxsZWQnKTtcblx0fVxuXG5cdG9uTmJjICgpIHtcblx0XHRvbi5maXJlKGRvY3VtZW50LCAnbmJjLWNhbGxlZCcpO1xuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZCAobmFtZSwgdmFsdWUpIHtcblx0XHR0aGlzW25hbWUgKyAnLWNoYW5nZWQnXSA9IGRvbS5ub3JtYWxpemUodmFsdWUpIHx8IHZhbHVlICE9PSBudWxsO1xuXHR9XG59XG5cbkJhc2VDb21wb25lbnQuZGVmaW5lKCd0ZXN0LWRlZmluZScsIFRlc3REZWZpbmUsIHtcblx0cHJvcHM6IFsnZm9vJ10sXG5cdGJvb2xzOiBbJ25iYyddXG59KTtcblxuY2xhc3MgVGVzdFByb3BzIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cblx0Y29uc3RydWN0b3IoLi4uYXJncykge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuICAgIG9uRm9vICgpIHtcblx0XHRvbi5maXJlKGRvY3VtZW50LCAnZm9vLWNhbGxlZCcpO1xuXHR9XG5cblx0b25OYmMgKCkge1xuXHRcdG9uLmZpcmUoZG9jdW1lbnQsICduYmMtY2FsbGVkJyk7XG5cdH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWQgKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRoaXNbbmFtZSArICctY2hhbmdlZCddID0gZG9tLm5vcm1hbGl6ZSh2YWx1ZSkgfHwgdmFsdWUgIT09IG51bGw7XG5cdH1cbn1cblxuXG5CYXNlQ29tcG9uZW50LmRlZmluZSgndGVzdC1wcm9wcycsIFRlc3RQcm9wcywge1xuXHRwcm9wczogWydmb28nLCAnYmFyJywgJ3RhYmluZGV4JywgJ21pbicsICdtYXgnLCAnbXktY29tcGxleC1wcm9wJ10sXG5cdGJvb2xzOiBbJ25iYycsICdjYnMnLCAnZGlzYWJsZWQnLCAncmVhZG9ubHknXVxufSk7XG5cbmNsYXNzIFRlc3ROZXdQcm9wcyBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcblx0XHRzdXBlcigpO1xuXHRcdGNvbnNvbGUubG9nKCdORVchJyk7XG5cdFx0Ly90aGlzLnNldFByb3BzKFsnZm9vJ10pO1xuXHR9XG5cblx0Z2V0UHJvcHMgKCkge1xuXHRcdHJldHVybiBbJ2ZvbyddXG5cdH1cblxuXHQvLyBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHtcblx0Ly8gXHRkZWJ1Z2dlclxuXHQvLyBcdHJldHVybiBbJ25iYyddXG5cdC8vIH1cblxuXHRhdHRyaWJ1dGVDaGFuZ2VkIChuYW1lLCB2YWx1ZSkge1xuXHRcdGNvbnNvbGUubG9nKCcgLS0tLSBjaGFuZ2UnLCBuYW1lLCB2YWx1ZSk7XG5cdH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1uZXctcHJvcHMnLCBUZXN0TmV3UHJvcHMpO1xud2luZG93LlRlc3ROZXdQcm9wcyA9IFRlc3ROZXdQcm9wcztcblxuY2xhc3MgVGVzdExpZmVjeWNsZSBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7cmV0dXJuIFsnZm9vJywgJ2JhciddOyB9XG5cbiAgICBzZXQgZm9vICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fZm9vID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGZvbyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZm9vO1xuICAgIH1cblxuICAgIHNldCBiYXIgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX19iYXIgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgYmFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19iYXIgfHwgJ05PVFNFVCc7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGNvbm5lY3RlZCAoKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdjb25uZWN0ZWQtY2FsbGVkJywgdGhpcyk7XG4gICAgfVxuXG4gICAgZG9tUmVhZHkgKCkge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAnZG9tcmVhZHktY2FsbGVkJywgdGhpcyk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkICgpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ2Rpc2Nvbm5lY3RlZC1jYWxsZWQnLCB0aGlzKTtcbiAgICB9XG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWxpZmVjeWNsZScsIFRlc3RMaWZlY3ljbGUpO1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgaW5pdDogZnVuY3Rpb24gKG5vZGUsIGEsIGIsIGMpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ2luaXQtY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdwcmVDb25uZWN0ZWQtY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwb3N0Q29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncG9zdENvbm5lY3RlZC1jYWxsZWQnKTtcbiAgICB9LFxuICAgIHByZURvbVJlYWR5OiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncHJlRG9tUmVhZHktY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwb3N0RG9tUmVhZHk6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdwb3N0RG9tUmVhZHktY2FsbGVkJyk7XG4gICAgfVxufSk7XG5cblxuY2xhc3MgVGVzdFRtcGxTdHJpbmcgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXY+VGhpcyBpcyBhIHNpbXBsZSB0ZW1wbGF0ZTwvZGl2PmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtc3RyaW5nJywgVGVzdFRtcGxTdHJpbmcpO1xuXG5jbGFzcyBUZXN0VG1wbElkIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgZ2V0IHRlbXBsYXRlSWQgKCkge1xuICAgICAgICByZXR1cm4gJ3Rlc3QtdG1wbC1pZC10ZW1wbGF0ZSc7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtaWQnLCBUZXN0VG1wbElkKTtcblxuXG5jbGFzcyBUZXN0VG1wbFJlZnMgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgb249XCJjbGljazpvbkNsaWNrXCIgcmVmPVwiY2xpY2tOb2RlXCI+XG4gICAgICAgICAgICA8bGFiZWwgcmVmPVwibGFiZWxOb2RlXCI+bGFiZWw6PC9sYWJlbD5cbiAgICAgICAgICAgIDxzcGFuIHJlZj1cInZhbHVlTm9kZVwiPnZhbHVlPC9zcGFuPlxuICAgICAgICA8L2Rpdj5gO1xuICAgIH1cblxuICAgIG9uQ2xpY2sgKCkge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncmVmLWNsaWNrLWNhbGxlZCcpO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLXJlZnMnLCBUZXN0VG1wbFJlZnMpO1xuXG5cbmNsYXNzIENoaWxkQnV0dG9uIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cdGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG5cdFx0cmV0dXJuIGA8YnV0dG9uIHJlZj1cImJ0bk5vZGVcIiBvbj1cImNsaWNrOm9uQ2xpY2tcIj5DbGljayBNZTwvYnV0dG9uPmA7XG5cdH1cblxuXHRvbkNsaWNrICgpIHtcblx0XHR0aGlzLmVtaXQoJ2NoYW5nZScsIHt2YWx1ZTogdGhpcy5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyl9KTtcblx0fVxuXG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NoaWxkLWJ1dHRvbicsIENoaWxkQnV0dG9uKTtcblxuY2xhc3MgVGVzdFRtcGxDbXB0UmVmcyBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXHRnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuXHRcdHJldHVybiBgPGRpdj5cblx0XHRcdDxjaGlsZC1idXR0b24gb249XCJjaGFuZ2U6b25DaGFuZ2VcIiB2YWx1ZT1cIkFcIiA+PC9jaGlsZC1idXR0b24+XG5cdFx0XHQ8Y2hpbGQtYnV0dG9uIG9uPVwiY2hhbmdlOm9uQ2hhbmdlXCIgdmFsdWU9XCJCXCIgPjwvY2hpbGQtYnV0dG9uPlxuXHRcdFx0PGNoaWxkLWJ1dHRvbiBvbj1cImNoYW5nZTpvbkNoYW5nZVwiIHZhbHVlPVwiQ1wiID48L2NoaWxkLWJ1dHRvbj5cbiAgICAgICAgPC9kaXY+YDtcblx0fVxuXG5cdG9uQ2hhbmdlIChlKSB7XG5cdFx0b24uZmlyZShkb2N1bWVudCwgJ3JlZi1jaGFuZ2UtY2FsbGVkJywge3ZhbHVlOmUudmFsdWV9KTtcblx0fVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtY21wdC1yZWZzJywgVGVzdFRtcGxDbXB0UmVmcyk7XG5cbmNsYXNzIFRlc3RUbXBsQ29udGFpbmVyIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2PlxuICAgICAgICAgICAgPGxhYmVsIHJlZj1cImxhYmVsTm9kZVwiPmxhYmVsOjwvbGFiZWw+XG4gICAgICAgICAgICA8c3BhbiByZWY9XCJ2YWx1ZU5vZGVcIj52YWx1ZTwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXYgcmVmPVwiY29udGFpbmVyXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtY29udGFpbmVyJywgVGVzdFRtcGxDb250YWluZXIpO1xuXG5cbi8vIHNpbXBsZSBuZXN0ZWQgdGVtcGxhdGVzXG5jbGFzcyBUZXN0VG1wbE5lc3RlZEEgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmVzdGVkVGVtcGxhdGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQSBiZWZvcmU8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIHJlZj1cImNvbnRhaW5lclwiPjwvc2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBBIGFmdGVyPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLW5lc3RlZC1hJywgVGVzdFRtcGxOZXN0ZWRBKTtcblxuY2xhc3MgVGVzdFRtcGxOZXN0ZWRCIGV4dGVuZHMgVGVzdFRtcGxOZXN0ZWRBIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPGRpdj5jb250ZW50IEI8L2Rpdj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLW5lc3RlZC1iJywgVGVzdFRtcGxOZXN0ZWRCKTtcblxuXG4vLyBuZXN0ZWQgcGx1cyBsaWdodCBkb21cbmNsYXNzIFRlc3RUbXBsTmVzdGVkQyBleHRlbmRzIFRlc3RUbXBsTmVzdGVkQSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uPlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEMgYmVmb3JlPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHJlZj1cImNvbnRhaW5lclwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEMgYWZ0ZXI8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtbmVzdGVkLWMnLCBUZXN0VG1wbE5lc3RlZEMpO1xuXG5cbi8vIDUtZGVlcCBuZXN0ZWQgdGVtcGxhdGVzXG5jbGFzcyBUZXN0QSBleHRlbmRzIEJhc2VDb21wb25lbnQge31cbmNsYXNzIFRlc3RCIGV4dGVuZHMgVGVzdEEge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBCIGJlZm9yZTwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gcmVmPVwiY29udGFpbmVyXCI+PC9zZWN0aW9uPlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEIgYWZ0ZXI8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfVxufVxuY2xhc3MgVGVzdEMgZXh0ZW5kcyBUZXN0QiB7fVxuY2xhc3MgVGVzdEQgZXh0ZW5kcyBUZXN0QyB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXY+Y29udGVudCBEPC9kaXY+YDtcbiAgICB9XG59XG5jbGFzcyBUZXN0RSBleHRlbmRzIFRlc3REIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmVzdGVkVGVtcGxhdGUgPSB0cnVlO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1hJywgVGVzdEEpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWInLCBUZXN0Qik7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtYycsIFRlc3RDKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1kJywgVGVzdEQpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWUnLCBUZXN0RSk7XG5cbmNsYXNzIFRlc3RMaXN0IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHsgcmV0dXJuIFsnbGlzdC10aXRsZSddOyB9XG4gICAgZ2V0IHByb3BzICgpIHsgcmV0dXJuIFsnbGlzdC10aXRsZSddOyB9XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiIHJlZj1cInRpdGxlTm9kZVwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiByZWY9XCJjb250YWluZXJcIj48L2Rpdj5gO1xuICAgIH1cbiAgICBcbiAgICBzZXQgZGF0YSAoaXRlbXMpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJMaXN0KGl0ZW1zLCB0aGlzLmNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgZG9tUmVhZHkgKCkge1xuICAgICAgICB0aGlzLnRpdGxlTm9kZS5pbm5lckhUTUwgPSB0aGlzWydsaXN0LXRpdGxlJ107XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWxpc3QnLCBUZXN0TGlzdCk7XG5cbmNsYXNzIFRlc3RMaXN0Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7IHJldHVybiBbJ2l0ZW0tdGFnJ107IH1cblx0Z2V0IHByb3BzICgpIHsgcmV0dXJuIFsnaXRlbS10YWcnXTsgfVxuXG5cdGNvbnN0cnVjdG9yICgpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0c2V0IGRhdGEgKGl0ZW1zKSB7XG5cdFx0dGhpcy5pdGVtcyA9IGl0ZW1zO1xuXHRcdHRoaXMub25Db25uZWN0ZWQodGhpcy5yZW5kZXJJdGVtcy5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHJlbmRlckl0ZW1zICgpIHtcblx0XHRjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGNvbnN0IHRhZyA9IHRoaXNbJ2l0ZW0tdGFnJ107XG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRjb25zdCBub2RlID0gZG9tKHRhZywge30sIGZyYWcpO1xuXHRcdFx0bm9kZS5kYXRhID0gaXRlbTtcblx0XHR9KTtcblx0XHR0aGlzLm9uRG9tUmVhZHkoKCkgPT4ge1xuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChmcmFnKTtcblx0XHR9KTtcblx0fVxuXG5cdGRvbVJlYWR5ICgpIHtcblxuXHR9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtbGlzdC1jb21wb25lbnQnLCBUZXN0TGlzdENvbXBvbmVudCk7XG5cbi8vIGFkZHJlc3MxOlwiNjQ0MVwiXG4vLyBhZGRyZXNzMjpcIkFsZXhhbmRlciBXYXlcIlxuLy8gYmlydGhkYXk6XCIwMS8xNC8yMDE4XCJcbi8vIGNpdHk6XCJEdXJoYW1cIlxuLy8gY29tcGFueTpcIkNyYWlnc2xpc3RcIlxuLy8gZW1haWw6XCJqY3VydGlzQGNyYWlnc2xpc3QuY29tXCJcbi8vIGZpcnN0TmFtZTpcIkpvcmRhblwiXG4vLyBsYXN0TmFtZTpcIkN1cnRpc1wiXG4vLyBwaG9uZTpcIjcwNC03NTAtNDMxNlwiXG4vLyBzc246XCIzNjEtMTctNjM0NFwiXG4vLyBzdGF0ZTpcIk5vcnRoIENhcm9saW5hXCJcbi8vIHppcGNvZGU6XCI4NjMxMFwiXG5cblxuY2xhc3MgVGVzdExpc3RDb21wb25lbnRJdGVtIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7IHJldHVybiBbJ2xpc3QtdGl0bGUnXTsgfVxuXHRnZXQgcHJvcHMgKCkgeyByZXR1cm4gWydsaXN0LXRpdGxlJ107IH1cblxuXHRjb25zdHJ1Y3RvciAoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdHNldCBkYXRhIChpdGVtKSB7XG5cdFx0dGhpcy5pdGVtID0gaXRlbTtcblx0XHR0aGlzLm9uQ29ubmVjdGVkKHRoaXMucmVuZGVySXRlbS5iaW5kKHRoaXMpKTtcblx0fVxuXG5cdHJlbmRlckl0ZW0gKCkge1xuXHRcdGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW07XG5cdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRkb20oJ2RpdicsIHtodG1sOltcblx0XHRcdGRvbSgnbGFiZWwnLCB7aHRtbDogJ05hbWU6J30pLFxuXHRcdFx0ZG9tKCdzcGFuJywge2h0bWw6IGl0ZW0uZmlyc3ROYW1lfSksXG5cdFx0XHRkb20oJ3NwYW4nLCB7aHRtbDogaXRlbS5sYXN0TmFtZX0pXG5cdFx0XX0sIHRoaXMpO1xuXG5cdFx0ZG9tKCdkaXYnLCB7aHRtbDpbXG5cdFx0XHRkb20oJ2RpdicsIHtjbGFzczogJ2luZGVudCcsIGh0bWw6W1xuXHRcdFx0XHRkb20oJ2RpdicsIHtodG1sOltcblx0XHRcdFx0XHRkb20oJ2xhYmVsJywge2h0bWw6ICdBZGRyZXNzOid9KSxcblx0XHRcdFx0XHRkb20oJ3NwYW4nLCB7aHRtbDogaXRlbS5hZGRyZXNzMX0pLFxuXHRcdFx0XHRcdGRvbSgnc3BhbicsIHtodG1sOiBpdGVtLmFkZHJlc3MyfSksXG5cdFx0XHRcdFx0ZG9tKCdzcGFuJywge2h0bWw6IGl0ZW0uY2l0eX0pLFxuXHRcdFx0XHRcdGRvbSgnc3BhbicsIHtodG1sOiBpdGVtLnN0YXRlfSksXG5cdFx0XHRcdFx0ZG9tKCdzcGFuJywge2h0bWw6IGl0ZW0uemlwY29kZX0pXG5cdFx0XHRcdF19KSxcblx0XHRcdFx0ZG9tKCdkaXYnLCB7aHRtbDpbXG5cdFx0XHRcdFx0ZG9tKCdsYWJlbCcsIHtodG1sOiAnQ29tcGFueTonfSksXG5cdFx0XHRcdFx0ZG9tKCdzcGFuJywge2h0bWw6IGl0ZW0uY29tcGFueX0pXG5cdFx0XHRcdF19KSxcblx0XHRcdFx0ZG9tKCdkaXYnLCB7aHRtbDpbXG5cdFx0XHRcdFx0ZG9tKCdsYWJlbCcsIHtodG1sOiAnQmlydGhkYXk6J30pLFxuXHRcdFx0XHRcdGRvbSgnc3BhbicsIHtodG1sOiBpdGVtLmJpcnRoZGF5fSlcblx0XHRcdFx0XX0pLFxuXHRcdFx0XHRkb20oJ2RpdicsIHtodG1sOltcblx0XHRcdFx0XHRkb20oJ2xhYmVsJywge2h0bWw6ICdTU046J30pLFxuXHRcdFx0XHRcdGRvbSgnc3BhbicsIHtodG1sOiBpdGVtLnNzbn0pXG5cdFx0XHRcdF19KVxuXHRcdFx0XX0pXG5cdFx0XX0sIHRoaXMpO1xuXHR9XG5cblx0ZG9tUmVhZHkgKCkge1xuXG5cdH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1saXN0LWNvbXBvbmVudC1pdGVtJywgVGVzdExpc3RDb21wb25lbnRJdGVtKTtcblxuY2xhc3MgVGVzdExpc3RDb21wb25lbnRUbXBsIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG5cblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7IHJldHVybiBbJ2xpc3QtdGl0bGUnXTsgfVxuXHRnZXQgcHJvcHMgKCkgeyByZXR1cm4gWydsaXN0LXRpdGxlJ107IH1cblxuXHRjb25zdHJ1Y3RvciAoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG5cdFx0cmV0dXJuIGBcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICBcdDxsYWJlbD5OYW1lOjwvbGFiZWw+PHNwYW4gcmVmPVwiZmlyc3ROYW1lXCI+PC9zcGFuPjxzcGFuIHJlZj1cImxhc3ROYW1lXCI+PC9zcGFuPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiaW5kZW50XCI+XG5cdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0PGxhYmVsPkFkZHJlc3M6PC9sYWJlbD48c3BhbiByZWY9XCJhZGRyZXNzMVwiPjwvc3Bhbj48c3BhbiByZWY9XCJhZGRyZXNzMlwiPjwvc3Bhbj48c3BhbiByZWY9XCJjaXR5XCI+PC9zcGFuPjxzcGFuIHJlZj1cInN0YXRlXCI+PC9zcGFuPjxzcGFuIHJlZj1cInppcGNvZGVcIj48L3NwYW4+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdDxsYWJlbD5Db21wYW55OjwvbGFiZWw+PHNwYW4gcmVmPVwiY29tcGFueVwiPjwvc3Bhbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0PGxhYmVsPkRPQjo8L2xhYmVsPjxzcGFuIHJlZj1cImJpcnRoZGF5XCI+PC9zcGFuPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdj5cblx0XHRcdFx0XHQ8bGFiZWw+U1NOOjwvbGFiZWw+PHNwYW4gcmVmPVwic3NuXCI+PC9zcGFuPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cdH1cblxuXHRzZXQgZGF0YSAoaXRlbSkge1xuXHRcdHRoaXMuaXRlbSA9IGl0ZW07XG5cdFx0dGhpcy5vbkNvbm5lY3RlZCh0aGlzLnJlbmRlckl0ZW0uYmluZCh0aGlzKSk7XG5cdH1cblxuXHRyZW5kZXJJdGVtICgpIHtcblx0XHRjb25zdCBpdGVtID0gdGhpcy5pdGVtO1xuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXHRcdE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0aWYoc2VsZltrZXldKXtcblx0XHRcdFx0bGV0IG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpdGVtW2tleV0pO1xuXHRcdFx0XHRzZWxmW2tleV0uYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG5cdGRvbVJlYWR5ICgpIHtcblxuXHR9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtbGlzdC1jb21wb25lbnQtdG1wbCcsIFRlc3RMaXN0Q29tcG9uZW50VG1wbCk7XG5cbndpbmRvdy5pdGVtVGVtcGxhdGVTdHJpbmcgPSBgPHRlbXBsYXRlPlxuICAgIDxkaXYgaWQ9XCJ7e2lkfX1cIj5cbiAgICAgICAgPHNwYW4+e3tmaXJzdH19PC9zcGFuPlxuICAgICAgICA8c3Bhbj57e2xhc3R9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4+e3tyb2xlfX08L3NwYW4+XG4gICAgPC9kaXY+XG48L3RlbXBsYXRlPmA7XG5cbndpbmRvdy5pZkF0dHJUZW1wbGF0ZVN0cmluZyA9IGA8dGVtcGxhdGU+XG4gICAgPGRpdiBpZD1cInt7aWR9fVwiPlxuICAgICAgICA8c3Bhbj57e2ZpcnN0fX08L3NwYW4+XG4gICAgICAgIDxzcGFuPnt7bGFzdH19PC9zcGFuPlxuICAgICAgICA8c3Bhbj57e3JvbGV9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gaWY9XCJ7e2Ftb3VudH19IDwgMlwiIGNsYXNzPVwiYW1vdW50XCI+e3thbW91bnR9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gaWY9XCJ7e3R5cGV9fSA9PT0gJ3NhbmUnXCIgY2xhc3M9XCJzYW5pdHlcIj57e3R5cGV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbjwvdGVtcGxhdGU+YDtcblxuZnVuY3Rpb24gZGV2ICgpIHtcbiAgICB2YXIgYWxwaGFiZXQgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0KCcnKTtcbiAgICB2YXIgcyA9ICd7e2Ftb3VudH19ICsge3tudW19fSArIDMnO1xuICAgIHZhciBsaXN0ID0gW3thbW91bnQ6IDEsIG51bTogMn0sIHthbW91bnQ6IDMsIG51bTogNH0sIHthbW91bnQ6IDUsIG51bTogNn1dO1xuICAgIHZhciByID0gL1xce1xce1xcdyp9fS9nO1xuICAgIHZhciBmbiA9IFtdO1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGY7XG4gICAgcyA9IHMucmVwbGFjZShyLCBmdW5jdGlvbih3KXtcbiAgICAgICAgY29uc29sZS5sb2coJ3dvcmQnLCB3KTtcbiAgICAgICAgdmFyIHYgPSBhbHBoYWJldC5zaGlmdCgpO1xuICAgICAgICBmbi5wdXNoKHYpO1xuICAgICAgICBhcmdzLnB1c2goL1xcdysvZy5leGVjKHcpWzBdKTtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfSk7XG4gICAgZm4ucHVzaChzKTtcblxuICAgIGNvbnNvbGUubG9nKCdmbicsIGZuKTtcbiAgICBjb25zb2xlLmxvZygnYXJncycsIGFyZ3MpO1xuICAgIC8vcyA9ICdyZXR1cm4gJyArIHMgKyAnOyc7XG4gICAgY29uc29sZS5sb2coJ3MnLCBzKTtcblxuICAgIHdpbmRvdy5mID0gbmV3IEZ1bmN0aW9uKHMpO1xuXG4gICAgdmFyIGR5bkZuID0gZnVuY3Rpb24gKGEsYixjLGQsZSxmKSB7XG4gICAgICAgIHZhciByID0gZXZhbChzKTtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfTtcblxuICAgIGNvbnNvbGUubG9nKCcgIGY6JywgZHluRm4oMSwyKSk7XG4gICAgLy9cbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdmFyIGEgPSBhcmdzLm1hcChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVthcmddO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHIgPSBkeW5Gbi5hcHBseShudWxsLCBhKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3InLCByKTtcbiAgICB9KTtcblxuXG59XG4vL2RldigpOyIsImNvbnN0IG9uID0gcmVxdWlyZSgnQGNsdWJhamF4L29uJyk7XG5cbmNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdGNvbnN0cnVjdG9yICgpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuX3VpZCA9IHVpZCh0aGlzLmxvY2FsTmFtZSk7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXSA9IHsgRE9NU1RBVEU6ICdjcmVhdGVkJyB9O1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdCA9IFtdO1xuXHRcdHBsdWdpbignaW5pdCcsIHRoaXMpO1xuXHR9XG5cblx0Y29ubmVjdGVkQ2FsbGJhY2sgKCkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPyAnZG9tcmVhZHknIDogJ2Nvbm5lY3RlZCc7XG5cdFx0cGx1Z2luKCdwcmVDb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRuZXh0VGljayhvbkNoZWNrRG9tUmVhZHkuYmluZCh0aGlzKSk7XG5cdFx0aWYgKHRoaXMuY29ubmVjdGVkKSB7XG5cdFx0XHR0aGlzLmNvbm5lY3RlZCgpO1xuXHRcdH1cblx0XHR0aGlzLmZpcmUoJ2Nvbm5lY3RlZCcpO1xuXHRcdHBsdWdpbigncG9zdENvbm5lY3RlZCcsIHRoaXMpO1xuXHR9XG5cblx0b25Db25uZWN0ZWQgKGNhbGxiYWNrKSB7XG5cdFx0aWYgKHRoaXMuRE9NU1RBVEUgPT09ICdjb25uZWN0ZWQnIHx8IHRoaXMuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpIHtcblx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLm9uY2UoJ2Nvbm5lY3RlZCcsICgpID0+IHtcblx0XHRcdGNhbGxiYWNrKHRoaXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0b25Eb21SZWFkeSAoY2FsbGJhY2spIHtcblx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0Y2FsbGJhY2sodGhpcyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMub25jZSgnZG9tcmVhZHknLCAoKSA9PiB7XG5cdFx0XHRjYWxsYmFjayh0aGlzKTtcblx0XHR9KTtcblx0fVxuXG5cdGRpc2Nvbm5lY3RlZENhbGxiYWNrICgpIHtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG5cdFx0cGx1Z2luKCdwcmVEaXNjb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRpZiAodGhpcy5kaXNjb25uZWN0ZWQpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkKCk7XG5cdFx0fVxuXHRcdHRoaXMuZmlyZSgnZGlzY29ubmVjdGVkJyk7XG5cblx0XHRsZXQgdGltZSwgZG9kID0gQmFzZUNvbXBvbmVudC5kZXN0cm95T25EaXNjb25uZWN0O1xuXHRcdGlmIChkb2QpIHtcblx0XHRcdHRpbWUgPSB0eXBlb2YgZG9kID09PSAnbnVtYmVyJyA/IGRvYyA6IDMwMDtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5ET01TVEFURSA9PT0gJ2Rpc2Nvbm5lY3RlZCcpIHtcblx0XHRcdFx0XHR0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGltZSk7XG5cdFx0fVxuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIChhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcblx0XHRpZiAoIXRoaXMuaXNTZXR0aW5nQXR0cmlidXRlKSB7XG5cdFx0XHRuZXdWYWwgPSBCYXNlQ29tcG9uZW50Lm5vcm1hbGl6ZShuZXdWYWwpO1xuXHRcdFx0cGx1Z2luKCdwcmVBdHRyaWJ1dGVDaGFuZ2VkJywgdGhpcywgYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcblx0XHRcdGlmICh0aGlzLmF0dHJpYnV0ZUNoYW5nZWQgJiYgQmFzZUNvbXBvbmVudC5ub3JtYWxpemUob2xkVmFsKSAhPT0gbmV3VmFsKSB7XG5cdFx0XHRcdHRoaXMuYXR0cmlidXRlQ2hhbmdlZChhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGRlc3Ryb3kgKCkge1xuXHRcdHRoaXMuZmlyZSgnZGVzdHJveScpO1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcblx0XHRcdGhhbmRsZS5yZW1vdmUoKTtcblx0XHR9KTtcblx0XHRkZXN0cm95KHRoaXMpO1xuXHR9XG5cblx0ZmlyZSAoZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcykge1xuXHRcdHJldHVybiBvbi5maXJlKHRoaXMsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpO1xuXHR9XG5cblx0ZW1pdCAoZXZlbnROYW1lLCB2YWx1ZSkge1xuXHRcdHJldHVybiBvbi5lbWl0KHRoaXMsIGV2ZW50TmFtZSwgdmFsdWUpO1xuXHR9XG5cblx0b24gKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG5cdFx0XHR0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRcdG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG5cdFx0XHRcdG9uKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IpKTtcblx0fVxuXG5cdG9uY2UgKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG5cdFx0XHR0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRcdG9uLm9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcblx0XHRcdFx0b24ub25jZSh0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykpO1xuXHR9XG5cblx0YXR0ciAoa2V5LCB2YWx1ZSwgdG9nZ2xlKSB7XG5cdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSB0cnVlO1xuXHRcdGNvbnN0IGFkZCA9IHRvZ2dsZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6ICEhdG9nZ2xlO1xuXHRcdGlmIChhZGQpIHtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuXHRcdH1cblx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHR9XG5cblx0cmVnaXN0ZXJIYW5kbGUgKGhhbmRsZSkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG5cdFx0cmV0dXJuIGhhbmRsZTtcblx0fVxuXG5cdGdldCBET01TVEFURSAoKSB7XG5cdFx0cmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG5cdH1cblxuXHRzdGF0aWMgc2V0IGRlc3Ryb3lPbkRpc2Nvbm5lY3QgKHZhbHVlKSB7XG5cdFx0cHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXSA9IHZhbHVlO1xuXHR9XG5cblx0c3RhdGljIGdldCBkZXN0cm95T25EaXNjb25uZWN0ICgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXTtcblx0fVxuXG5cdHN0YXRpYyBjbG9uZSAodGVtcGxhdGUpIHtcblx0XHRpZiAodGVtcGxhdGUuY29udGVudCAmJiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuKSB7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcblx0XHR9XG5cdFx0Y29uc3QgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRjb25zdCBjbG9uZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG5cdFx0d2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmVOb2RlLmNoaWxkcmVuWzBdKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZyYWc7XG5cdH1cblxuXHRzdGF0aWMgYWRkUGx1Z2luIChwbHVnKSB7XG5cdFx0bGV0IGksIG9yZGVyID0gcGx1Zy5vcmRlciB8fCAxMDA7XG5cdFx0aWYgKCFwbHVnaW5zLmxlbmd0aCkge1xuXHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0aWYgKHBsdWdpbnNbMF0ub3JkZXIgPD0gb3JkZXIpIHtcblx0XHRcdFx0cGx1Z2lucy5wdXNoKHBsdWcpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHBsdWdpbnMudW5zaGlmdChwbHVnKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAocGx1Z2luc1swXS5vcmRlciA+IG9yZGVyKSB7XG5cdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXG5cdFx0XHRmb3IgKGkgPSAxOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAob3JkZXIgPT09IHBsdWdpbnNbaSAtIDFdLm9yZGVyIHx8IChvcmRlciA+IHBsdWdpbnNbaSAtIDFdLm9yZGVyICYmIG9yZGVyIDwgcGx1Z2luc1tpXS5vcmRlcikpIHtcblx0XHRcdFx0XHRwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIHdhcyBub3QgaW5zZXJ0ZWQuLi5cblx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHR9XG5cdH1cbn1cblxubGV0XG5cdHByaXZhdGVzID0ge30sXG5cdHBsdWdpbnMgPSBbXTtcblxuZnVuY3Rpb24gcGx1Z2luIChtZXRob2QsIG5vZGUsIGEsIGIsIGMpIHtcblx0cGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnKSB7XG5cdFx0aWYgKHBsdWdbbWV0aG9kXSkge1xuXHRcdFx0cGx1Z1ttZXRob2RdKG5vZGUsIGEsIGIsIGMpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hlY2tEb21SZWFkeSAoKSB7XG5cdGlmICh0aGlzLkRPTVNUQVRFICE9PSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRsZXRcblx0XHRjb3VudCA9IDAsXG5cdFx0Y2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuXHRcdG91ckRvbVJlYWR5ID0gb25TZWxmRG9tUmVhZHkuYmluZCh0aGlzKTtcblxuXHRmdW5jdGlvbiBhZGRSZWFkeSAoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IGNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0b3VyRG9tUmVhZHkoKTtcblx0XHR9XG5cdH1cblxuXHQvLyBJZiBubyBjaGlsZHJlbiwgd2UncmUgZ29vZCAtIGxlYWYgbm9kZS4gQ29tbWVuY2Ugd2l0aCBvbkRvbVJlYWR5XG5cdC8vXG5cdGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0b3VyRG9tUmVhZHkoKTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuXHRcdC8vXG5cdFx0Y2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdC8vIGNoZWNrIGlmIGNoaWxkIGlzIGFscmVhZHkgcmVhZHlcblx0XHRcdC8vIGFsc28gY2hlY2sgZm9yIGNvbm5lY3RlZCAtIHRoaXMgaGFuZGxlcyBtb3ZpbmcgYSBub2RlIGZyb20gYW5vdGhlciBub2RlXG5cdFx0XHQvLyBOT1BFLCB0aGF0IGZhaWxlZC4gcmVtb3ZlZCBmb3Igbm93IGNoaWxkLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJ1xuXHRcdFx0aWYgKGNoaWxkLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGFkZFJlYWR5KCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiBub3QsIHdhaXQgZm9yIGV2ZW50XG5cdFx0XHRjaGlsZC5vbignZG9tcmVhZHknLCBhZGRSZWFkeSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gb25TZWxmRG9tUmVhZHkgKCkge1xuXHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2RvbXJlYWR5Jztcblx0Ly8gZG9tUmVhZHkgc2hvdWxkIG9ubHkgZXZlciBmaXJlIG9uY2Vcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5kb21SZWFkeUZpcmVkID0gdHJ1ZTtcblx0cGx1Z2luKCdwcmVEb21SZWFkeScsIHRoaXMpO1xuXHQvLyBjYWxsIHRoaXMuZG9tUmVhZHkgZmlyc3QsIHNvIHRoYXQgdGhlIGNvbXBvbmVudFxuXHQvLyBjYW4gZmluaXNoIGluaXRpYWxpemluZyBiZWZvcmUgZmlyaW5nIGFueVxuXHQvLyBzdWJzZXF1ZW50IGV2ZW50c1xuXHRpZiAodGhpcy5kb21SZWFkeSkge1xuXHRcdHRoaXMuZG9tUmVhZHkoKTtcblx0XHR0aGlzLmRvbVJlYWR5ID0gZnVuY3Rpb24gKCkge307XG5cdH1cblxuXHQvLyBhbGxvdyBjb21wb25lbnQgdG8gZmlyZSB0aGlzIGV2ZW50XG5cdC8vIGRvbVJlYWR5KCkgd2lsbCBzdGlsbCBiZSBjYWxsZWRcblx0aWYgKCF0aGlzLmZpcmVPd25Eb21yZWFkeSkge1xuXHRcdHRoaXMuZmlyZSgnZG9tcmVhZHknKTtcblx0fVxuXG5cdHBsdWdpbigncG9zdERvbVJlYWR5JywgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkQ3VzdG9tTm9kZXMgKG5vZGUpIHtcblx0Ly8gY29sbGVjdCBhbnkgY2hpbGRyZW4gdGhhdCBhcmUgY3VzdG9tIG5vZGVzXG5cdC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuXHQvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG5cdGxldCBpLCBub2RlcyA9IFtdO1xuXHRmb3IgKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChub2RlLmNoaWxkcmVuW2ldLm5vZGVOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG5cdFx0XHRub2Rlcy5wdXNoKG5vZGUuY2hpbGRyZW5baV0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbm9kZXM7XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrIChjYikge1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xufVxuXG5jb25zdCB1aWRzID0ge307XG5mdW5jdGlvbiB1aWQgKHR5cGUgPSAndWlkJykge1xuXHRpZiAodWlkc1t0eXBlXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dWlkc1t0eXBlXSA9IDA7XG5cdH1cblx0Y29uc3QgaWQgPSB0eXBlICsgJy0nICsgKHVpZHNbdHlwZV0gKyAxKTtcblx0dWlkc1t0eXBlXSsrO1xuXHRyZXR1cm4gaWQ7XG59XG5cbmNvbnN0IGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZnVuY3Rpb24gZGVzdHJveSAobm9kZSkge1xuXHRpZiAobm9kZSkge1xuXHRcdGRlc3Ryb3llci5hcHBlbmRDaGlsZChub2RlKTtcblx0XHRkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFrZUdsb2JhbExpc3RlbmVycyAobmFtZSwgZXZlbnROYW1lKSB7XG5cdHdpbmRvd1tuYW1lXSA9IGZ1bmN0aW9uIChub2RlT3JOb2RlcywgY2FsbGJhY2spIHtcblx0XHRmdW5jdGlvbiBoYW5kbGVEb21SZWFkeSAobm9kZSwgY2IpIHtcblx0XHRcdGZ1bmN0aW9uIG9uUmVhZHkgKCkge1xuXHRcdFx0XHRjYihub2RlKTtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25SZWFkeSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChub2RlLkRPTVNUQVRFID09PSBldmVudE5hbWUgfHwgbm9kZS5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdFx0XHRjYihub2RlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvblJlYWR5KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIUFycmF5LmlzQXJyYXkobm9kZU9yTm9kZXMpKSB7XG5cdFx0XHRoYW5kbGVEb21SZWFkeShub2RlT3JOb2RlcywgY2FsbGJhY2spO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBjb3VudCA9IDA7XG5cblx0XHRmdW5jdGlvbiBvbkFycmF5Tm9kZVJlYWR5ICgpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0XHRpZiAoY291bnQgPT09IG5vZGVPck5vZGVzLmxlbmd0aCkge1xuXHRcdFx0XHRjYWxsYmFjayhub2RlT3JOb2Rlcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBub2RlT3JOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aGFuZGxlRG9tUmVhZHkobm9kZU9yTm9kZXNbaV0sIG9uQXJyYXlOb2RlUmVhZHkpO1xuXHRcdH1cblx0fTtcbn1cblxubWFrZUdsb2JhbExpc3RlbmVycygnb25Eb21SZWFkeScsICdkb21yZWFkeScpO1xubWFrZUdsb2JhbExpc3RlbmVycygnb25Db25uZWN0ZWQnLCAnY29ubmVjdGVkJyk7XG5cbmZ1bmN0aW9uIHRlc3RPcHRpb25zKG9wdGlvbnMpIHtcblx0Y29uc3QgdGVzdHMgPSB7XG5cdFx0J3Byb3AnOiAncHJvcHMnLFxuXHRcdCdib29sJzogJ2Jvb2xzJyxcblx0XHQnYXR0cic6ICdhdHRycycsXG5cdFx0J3Byb3BlcnRpZXMnOiAncHJvcHMnLFxuXHRcdCdib29sZWFucyc6ICdib29scycsXG5cdFx0J3Byb3BlcnR5JzogJ3Byb3BzJyxcblx0XHQnYm9vbGVhbic6ICdib29scydcblx0fVxuXHRPYmplY3Qua2V5cyh0ZXN0cykuZm9yRWFjaCgoa2V5KSA9PiB7IFxuXHRcdGlmIChvcHRpb25zW2tleV0pIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYEJhc2VDb21wb25lbnQuZGVmaW5lIGZvdW5kIFwiJHtrZXl9XCI7IERpZCB5b3UgbWVhbjogXCIke3Rlc3RzW2tleV19XCI/YCApO1xuXHRcdH1cblx0fSlcbn1cblxuQmFzZUNvbXBvbmVudC5pbmplY3RQcm9wcyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgeyBwcm9wcyA9IFtdLCBib29scyA9IFtdLCBhdHRycyA9IFtdIH0pIHtcblx0Q29uc3RydWN0b3IuYm9vbHMgPSBbLi4uKENvbnN0cnVjdG9yLmJvb2xzIHx8IFtdKSwgLi4uYm9vbHNdO1xuXHRDb25zdHJ1Y3Rvci5wcm9wcyA9IFsuLi4oQ29uc3RydWN0b3IucHJvcHMgfHwgW10pLCAuLi5wcm9wc107XG5cdENvbnN0cnVjdG9yLmF0dHJzID0gWy4uLihDb25zdHJ1Y3Rvci5hdHRycyB8fCBbXSksIC4uLmF0dHJzXTtcblx0Q29uc3RydWN0b3Iub2JzZXJ2ZWRBdHRyaWJ1dGVzID0gWy4uLkNvbnN0cnVjdG9yLmJvb2xzLCAuLi5Db25zdHJ1Y3Rvci5wcm9wcywgLi4uQ29uc3RydWN0b3IuYXR0cnNdO1xufTtcblxuQmFzZUNvbXBvbmVudC5kZWZpbmUgPSBmdW5jdGlvbiAodGFnTmFtZSwgQ29uc3RydWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuXHR0ZXN0T3B0aW9ucyhvcHRpb25zKTtcblx0QmFzZUNvbXBvbmVudC5pbmplY3RQcm9wcyhDb25zdHJ1Y3Rvciwgb3B0aW9ucyk7XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWdOYW1lLCBDb25zdHJ1Y3Rvcik7XG5cdHJldHVybiBDb25zdHJ1Y3Rvcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbXBvbmVudDsiXX0=
