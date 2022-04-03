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

        let time
        const dod = this.destroyOnDisconnect !== undefined ? this.destroyOnDisconnect : BaseComponent.destroyOnDisconnect;
		if (dod) {
			time = typeof dod === 'number' ? dod : 300;
			setTimeout(() => {
				if (this.DOMSTATE === 'disconnected') {
					this.destroy();
				}
			}, time);
		}
	}

    attributeChangedCallback(attrName, oldVal, newVal) {
		if (this.isSettingAttribute !== attrName) {
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

    attr(key, value, toggle) {
		this.isSettingAttribute = key;
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


(function () {
				
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
			this.isSettingAttribute = prop;
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
			this.isSettingAttribute = prop;
			if (typeof value === 'object' || typeof value === 'function') {
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
				node.isSettingAttribute = name;
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
}());

(function () {
				
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
}());

(function () {
				
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
}());

	return BaseComponent;

}));