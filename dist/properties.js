(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.properties = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var BaseComponent = require('BaseComponent');
var dom = require('dom');

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

},{"BaseComponent":"BaseComponent","dom":"dom"}]},{},[1])(1)
});