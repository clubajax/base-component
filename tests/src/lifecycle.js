const BaseComponent  = require('../../src/BaseComponent');
const properties = require('../../src/properties');
const template = require('../../src/template');
const refs = require('../../src/refs');
const itemTemplate = require('../../src/item-template');
window.rand = require('randomizer');

class TestProps extends BaseComponent {

    static get observedAttributes() { return ['min', 'max', 'foo', 'bar', 'nbc', 'cbs', 'disabled', 'readonly', 'tabindex', 'my-complex-prop']; }
    get props () { return ['foo', 'bar', 'tabindex', 'min', 'max', 'my-complex-prop']; }
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