(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(["BaseComponent"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node / CommonJS
        module.exports = factory(require('BaseComponent'));
    } else {
        // Browser globals (root is window)
        root['undefined'] = factory(root.BaseComponent);
    }
	}(this, function (BaseComponent) {
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function assignRefs(node) {

    [].concat(_toConsumableArray(node.querySelectorAll('[ref]'))).forEach(function (child) {
        var name = child.getAttribute('ref');
        child.removeAttribute('ref');
        node[name] = child;
    });
}

function assignEvents(node) {
    // <div on="click:onClick">
    [].concat(_toConsumableArray(node.querySelectorAll('[on]'))).forEach(function (child, i, children) {
        if (child === node) {
            return;
        }
        var keyValue = child.getAttribute('on'),
            event = keyValue.split(':')[0].trim(),
            method = keyValue.split(':')[1].trim();
        // remove, so parent does not try to use it
        child.removeAttribute('on');

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