console.log('LOADING APP >!< ');

import BaseElement from './BaseComponent';
import test from './test';

class AppThinger extends BaseElement {

    get id () {
        return 'UID';
    }

    set id (value) {
        this._id = value;
    }

    constructor(...args) {
        super();
    }
}

class AppDrawer extends BaseElement {

    constructor(...args) {
        super();
        console.log('AppDrawer.super', this.id);
    }

    connected () {
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
customElements.define('app-thinger', AppThinger);

//new AppThinger();
//new FancyDrawer();
