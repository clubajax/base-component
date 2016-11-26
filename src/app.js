console.log('LOADING APP >!< ');

import BaseElement from './BaseElement';

// cannot call NEW on a Component!
//class BaseElement extends HTMLElement {
//    constructor() {
//        super();
//        this._uid = dom.uid(this.localName);
//        privates[this._uid] = { DOMSTATE: 'created' };
//        console.log('this._uid', this._uid);
//        console.log('Base.constructor');
//    }
//
//    connectedCallback () {
//        console.log('Base.connected!', this.id);
//    }
//}

class App extends BaseElement {

    get id () {
        return 'UID';
    }

    set id (value) {
        this._id = value;
    }

    constructor(...args) {
        super(); // always call super() first in the ctor. This also calls the extended class' ctor.
        //console.log(' --------- UID!', this._uid);
        //console.log('App.constructor', this.id);
        console.log('arguments:', args);

    }
}

class AppDrawer extends BaseElement {

    constructor(...args) {
        //debugger
        super(); // always call super() first in the ctor. This also calls the extended class' ctor.
        console.log(' AppDrawer -> arguments:', args);
        //this.id = 8;
        //console.log('AppDrawer.super', this.id);
        //this.id = 'app';
    }

    connectedCallback () {
        console.log('AppDrawer.connected!', this.id);
        console.log('AppDrawer.anotherMethod', AppDrawer.anotherMethod());
    }

    toggleDrawer () {
        // Possibly different toggle implementation?
        // Use ES2015 if you need to call the parent method.
        // super.toggleDrawer()
    }

    static anotherMethod () {
        return 'static';
    }
}

class FancyDrawer extends AppDrawer {
    constructor() {
        // In a derived class, you must call super() before you can use this:
        super();
        // throws:
        //this.id = 'fancy';
        console.log('FancyDrawer.super');
    }

    connectedCallback () {
        super.connectedCallback();
        console.log('HOT FancyDrawer.connected!', this.id);
    }

    toggleDrawer () {
        // Possibly different toggle implementation?
        // Use ES2015 if you need to call the parent method.
        // super.toggleDrawer()
    }

    anotherMethod() {

    }
}
customElements.define('app-drawer', AppDrawer);
customElements.define('fancy-app-drawer', FancyDrawer);

window.lib = {
    App: App,
    BaseElement: BaseElement,
    AppDrawer: AppDrawer
};
console.log('APP/LIB BAR');