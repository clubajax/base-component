import Base from './Base';

class App extends Base{
    constructor() {
        super(); // always call super() first in the ctor. This also calls the extended class' ctor.
        console.log('App.constructor');
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
        console.log('FancyDrawer.connected!', this.id);
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