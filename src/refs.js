(function (create, dom, on) {

    function assignRefs (node) {
        console.log('node', node);
        dom.queryAll(node, '[ref]').forEach(function (child) {
            var name = child.getAttribute('ref');
            node[name] = child;
        });
    }

    function assignEvents (node) {
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

    //function ensureTemplatePlugin () {
    //    for(var i = 0; i < create.plugins.length; i++){
    //        if(create.plugins[i].name === 'template'){
    //            return;
    //        }
    //    }
    //    console.error('template plugin is required before refs plugin');
    //}
    //
    //ensureTemplatePlugin();
    create.addPlugin({
        name: 'refs',
        order: 30,
        preAttach: function (node) {
            console.log('refs.preAttach');
            assignRefs(node);
            assignEvents(node);
        }
    });

}(window.create, window.dom, window.on));