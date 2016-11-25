console.log('LOADING APP @!@ ');

import Base from './Base';

class App extends Base{

    get id () {
        return 'UID';
    }

    set id (value) {
        this._id = value;
    }

    constructor() {
        super(); // always call super() first in the ctor. This also calls the extended class' ctor.
        console.log('App.constructor', this.id);
    }
}

class AppDrawer extends HTMLElement{

    constructor() {
        super(); // always call super() first in the ctor. This also calls the extended class' ctor.

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
    Base: Base
};
console.log('APP/LIB LOADED');