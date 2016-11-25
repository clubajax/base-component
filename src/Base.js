export default class Base {
    constructor() {
        // In a derived class, you must call super() before you can use this:
        super();
        // throws:
        //this.id = 'fancy';
        console.log('Base.constructor');
    }

    connectedCallback () {
        console.log('Base.connected!', this.id);
    }
}