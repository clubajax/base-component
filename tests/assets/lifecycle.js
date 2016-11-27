import BaseComponent from '../../src/BaseComponent';

class TestLifecycle extends BaseComponent {

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

console.log('Lifecycle Loaded');