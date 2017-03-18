(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(["BaseComponent", "dom"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node / CommonJS
        module.exports = factory(require('BaseComponent'), require('dom'));
    } else {
        // Browser globals (root is window)
        root['undefined'] = factory(root.BaseComponent, root.dom);
    }
	}(this, function (BaseComponent, dom) {
'use strict';

function setBoolean(node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
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
		configurable: true,
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

}));