(function (create, dom, on) {

    var
        lightNodes = {},
        inserted = {};

    function insert (node) {
        if(inserted[node._uid] || !hasTemplate(node)){
            return;
        }
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

    function hasTemplate (node) {

        return !!node.templateNode;
        //console.log('chain:', node.templateChain());
        //return !!node.templateNode || node.getProto().templateNode;
    }

    function insertTemplate (node){
        var superTemplate = node.getProto().templateNode;

        if(superTemplate){
            node.appendChild(create.clone(superTemplate));
            insertChildren(node);
            collectLightNodes(node);
        }

        if(node.templateNode) {
            node.appendChild(create.clone(node.templateNode));
        }
        insertChildren(node);
    }

    function insertChildren (node) {
        var i,
            container = node.querySelector('[ref="container"]') || node,
            children = lightNodes[node._uid];

        console.log('container', container);
        if(container && children && children.length){
            for(i = 0; i < children.length; i++){
                container.appendChild(children[i]);
            }
        }
    }



    create.addPlugin({
        name: 'template',
        order: 10,
        define: function (def, options) {
            //console.log('def', options);
            var
                inheritableMethods = {},
                template,
                importDoc = window.globalImportDoc || (document._currentScript || document.currentScript).ownerDocument;

            // TODO: move this to its own plugin, or into create
            Object.keys(options).forEach(function (key) {
                if(typeof options[key] === 'function'){
                    inheritableMethods[key] = true;
                }
            });
            //inheritableMethods.tag = options.tag;
            options[options.tag + 'inheritableMethods'] = inheritableMethods;

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

                // FIXME - commenting this out gets things moving, but domReady is called multiple times on the same prototype
                //def.templateNode = {value: null};
            }

            def.templateChain = {

                // FIXME - does not seem to be walking the proto chain


                value: function () {
                    console.log('templateChain...', this.getProto());
                    var tmpls = this.super('templateChain') || [];
                    console.log(this._uid, 'tmpls', tmpls);
                    if(this.templateNode){
                        console.log('TEMPLATE');
                        tmpls.push(this.templateNode);
                    }
                    return tmpls;
                }
            }
        },

        preAttach: function (node) {
            console.log('insert...');
            insert(node);

        }
    });

}(window.create, window.dom, window.on));