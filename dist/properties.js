(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(["BaseComponent"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node / CommonJS
        module.exports = factory(require('BaseComponent'));
    } else {
        // Browser globals (root is window)
        root['undefined'] = factory(root.BaseComponent);
    }
	}(this, function (BaseComponent) {
'use strict';

function setBoolean(node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get: function get() {
			return node.hasAttribute(prop);
		},
		set: function set(value) {
			this.isSettingAttribute = true;
			if (value) {
				this.setAttribute(prop, '');
			} else {
				this.removeAttribute(prop);
			}
			var fn = this[onify(prop)];
			if (fn) {
				fn.call(this, value);
			}

			this.isSettingAttribute = false;
		}
	});
}

function setProperty(node, prop) {
	var propValue = void 0;
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get: function get() {
			return propValue !== undefined ? propValue : normalize(this.getAttribute(prop));
		},
		set: function set(value) {
			var _this = this;

			this.isSettingAttribute = true;
			this.setAttribute(prop, value);
			var fn = this[onify(prop)];
			if (fn) {
				onDomReady(this, function () {
					if (value !== undefined) {
						propValue = value;
					}
					value = fn.call(_this, value) || value;
				});
			}
			this.isSettingAttribute = false;
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

function propNorm(value) {
	return normalize(value);
}

function normalize(val) {
	if (typeof val === 'string') {
		if (val === 'false') {
			return false;
		} else if (val === 'null') {
			return null;
		} else if (val === 'true') {
			return true;
		}
		if (val.indexOf('/') > -1 || (val.match(/-/g) || []).length > 1) {
			// type of date
			return val;
		}
	}
	if (!isNaN(parseFloat(val))) {
		return parseFloat(val);
	}
	return val;
}

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

		node[name] = propNorm(value);
	}
});

}));