(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(["dom", "BaseComponent"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node / CommonJS
        module.exports = factory(require('dom'), require('BaseComponent'));
    } else {
        // Browser globals (root is window)
        root['undefined'] = factory(root.dom, root.BaseComponent);
    }
	}(this, function (dom, BaseComponent) {
'use strict';

function assignRefs(node) {
    dom.queryAll(node, '[ref]').forEach(function (child) {
        var name = child.getAttribute('ref');
        node[name] = child;
    });
}

function assignEvents(node) {
    // <div on="click:onClick">
    dom.queryAll(node, '[on]').forEach(function (child) {
        var keyValue = child.getAttribute('on'),
            event = keyValue.split(':')[0].trim(),
            method = keyValue.split(':')[1].trim();
        node.on(child, event, function (e) {
            node[method](e);
        });
    });
}

BaseComponent.addPlugin({
    name: 'refs',
    order: 30,
    preConnected: function preConnected(node) {
        assignRefs(node);
        assignEvents(node);
    }
});

}));