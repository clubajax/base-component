const on = require('@clubajax/on');
const dom = require('dom');
const BaseComponent = require('./BaseComponent');
const properties = require('./properties');
const template = require('./template');
const refs = require('./refs');
const itemTemplate = require('./item-template');

module.exports = {
	on: on,
	dom: dom,
	BaseComponent: BaseComponent,
	properties: properties,
	template: template,
	refs: refs,
	itemTemplate: itemTemplate
};