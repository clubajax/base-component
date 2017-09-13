require('@clubajax/custom-elements-polyfill');
const BaseComponent  = require('../../dist/index');

console.log('BaseComponent', BaseComponent);

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
