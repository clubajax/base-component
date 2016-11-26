import BaseElement from './BaseElement';

BaseElement.addPlugin({
    init: function (node, a, b, c) {
        console.log(' * plugin.init', node._uid);
    },
    preConnected: function (node, a, b, c) {
        console.log(' * plugin.preConnected', node._uid);
    },
    postConnected: function (node, a, b, c) {
        console.log(' * plugin.postConnected', node._uid);
    }
});

export default {};