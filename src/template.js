(function (create, dom, on) {

    var
        lightNodes = {},
        inserted = {};

    function insert (node) {
        collectLightNodes(node);
        insertTemplate(node);
        inserted[node._uid] = true;
    }

    function collectLightNodes(node){
        lightNodes[node._uid] = [];

        while(node.childNodes.length){
            lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
        }

        //for(var i = 0; i < node.childNodes.length; i++){
        //    console.log('    chillen', node.childNodes[0].textContent);
        //    lightNodes[node._uid].push(node.childNodes[0]);
        //}
    }

    function insertTemplate (node){
        if(node.super && node.super.templateNode){
            console.log('super.templateNode', node.super.templateNode);
            node.appendChild(create.clone(node.super.templateNode));
            insertChildren(node);
            collectLightNodes(node);
        }

        if(node.templateNode) {
            node.appendChild(create.clone(node.templateNode));
        }
        insertChildren(node);
    }

    function insertChildren (node) {
        console.log('\ninsertChildren');
        var i,
            container = node.querySelector('[ref="container"]') || node,
            children = lightNodes[node._uid]; //node.getLightNodes();

        console.log('container', container);
        if(container && children && children.length){
            for(i = 0; i < children.length; i++){
                console.log('    append', children[i].textContent);
                container.appendChild(children[i]);
            }
        }
    }



    create.addPlugin({
        name: 'template',
        order: 10,
        define: function (def, options) {
            var
                template,
                importDoc = window.globalImportDoc || (document._currentScript || document.currentScript).ownerDocument;

            def.importDoc = {
                get: function() { return importDoc; }
            };

            def.getLightNodes = {
                value: function () {
                    return lightNodes[this._uid];
                }
            };

            if(options.templateString){
                def.templateNode = {value: dom.toDom('<template>' + options.templateString + '</template>')};
            }
            else if (options.templateId) {
                // get the template
                template = importDoc.getElementById(options.templateId);
                def.templateNode = {value: template};
            }
            else {
                def.templateNode = {value: null};
            }
        },

        preAttach: function (node) {
            if(!inserted[node._uid] && node.templateNode){
                insert(node);
            }
        }
    });

}(window.create, window.dom, window.on));