export default class BaseElement extends HTMLElement {
    constructor() {
        super();
        this._uid = dom.uid(this.localName);
        privates[this._uid] = { DOMSTATE: 'created' };
        console.log('this._uid', this._uid);
        console.log('Base.constructor');
    }

    connectedCallback () {
        console.log('Base.connected!', this.id);
    }
}

let privates = {};

function nextTick (cb) {
    requestAnimationFrame(cb);
}