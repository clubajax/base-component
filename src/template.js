(function (create, dom, on) {

    var
        lightNodes = {},
        inserted = {};

    function insertTemplate (node){
        console.log('insert..', node.innerHTML);
        if(node.templateNode) {
            node.appendChild(create.clone(node.templateNode));
            //assignRefs(node);
            //assignEvents(node);
            inserted[node._uid] = true;
        }
    }

    function collectLightNodes(node){
        lightNodes[node._uid] = [];
        for(var i = 0; i < node.childNodes.length; i++){
            lightNodes[node._uid].push(node.childNodes[0]);
        }
        return;
        //while(node.childNodes.length){
        //    lightNodes[node._uid].push(node.childNodes[0]);
        //    node.removeChild(node.childNodes[0]);
        //}
    }

    create.addPlugin({
        name: 'template',
        order: 10,
        define: function (def, options) {
            var
                importDoc = window.globalImportDoc || (document._currentScript || document.currentScript).ownerDocument;

            def.importDoc = {
                get: function() { return importDoc; }
            };

            def.getLightNodes = {
                value: function () {
                    return lightNodes[this._uid];
                }
            };

            if (options.templateId) {
                // get the template
                template = importDoc.getElementById(options.templateId);
                def.templateNode = {value: template};
            } else {
                def.templateNode = {value: null};
            }
        },

        preAttach: function (node) {
            if(!inserted[node._uid] && node.templateNode){
                collectLightNodes(node);
                insertTemplate(node);
            }
        }
    });

}(window.create, window.dom, window.on));