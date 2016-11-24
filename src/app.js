class Base {
    constructor() {
        console.log('base!');
    }
}
class App extends Base{
    constructor() {
        super(); // always call super() first in the ctor. This also calls the extended class' ctor.
        console.log('App.constructor');
    }
}