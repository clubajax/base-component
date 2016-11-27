import BaseComponent from '../../src/BaseComponent';

class TestLifecycle extends BaseComponent {

    get id () {
        return 'UID';
    }

    set id (value) {
        this._id = value;
    }

    constructor(...args) {
        super();
    }

    connected () {
        on.fire(document, 'connected-called');
    }

    domReady () {
        on.fire(document, 'domready-called');
    }

    disconnected () {
        on.fire(document, 'disconnected-called');
    }

}

customElements.define('test-lifecycle', TestLifecycle);

console.log('Lifecycle Loaded');