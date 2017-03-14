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

module.exports = {
	'properties': true
};