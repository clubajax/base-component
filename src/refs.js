(function (create, dom, on) {

    function assignRefs (node) {
        dom.queryAll(node, '[ref]').forEach(function (child) {
            var name = child.getAttribute('ref');
            node[name] = child;
        });
    }

    function assignEvents (node) {
        // <div on="click:onClick">
        dom.queryAll(node, '[on]').forEach(function (child) {
            var
                keyValue = child.getAttribute('on'),
                event = keyValue.split(':')[0].trim(),
                method = keyValue.split(':')[1].trim();
            node.on(child, event, function (e) {
                node[method](e)
            })
        });
    }

    create.addPlugin({
        name: 'refs',
        order: 30,
        preAttach: function (node) {
            assignRefs(node);
            assignEvents(node);
        }
    });

}(window.create, window.dom, window.on));