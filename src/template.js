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
        lightNodes[node._uid] = lightNodes[node._uid] || [];
        while(node.childNodes.length){
            lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
        }
    }

    function hasTemplate (node) {
        return !!node.getTemplateNode();
    }

    function insertTemplateChain (node) {
        //collectLightNodes(node);
        var templates = node.getTemplateChain();
        templates.forEach(function (template) {
            getContainer(node).appendChild(create.clone(template));
        });
        insertChildren(node);
    }

    function insertTemplate (node) {
        if(node.nestedTemplate){
            insertTemplateChain(node);
            return;
        }
        var
            templateNode = node.getTemplateNode(),
            superTemplate = node.getProto().templateNode;

        if(superTemplate){
            node.appendChild(create.clone(superTemplate));
            insertChildren(node);
            collectLightNodes(node);
        }

        if(templateNode) {
            node.appendChild(create.clone(templateNode));
        }
        insertChildren(node);
    }

    function getContainer (node) {
        var containers = node.querySelectorAll('[ref="container"]');
        if(containers.length) {
            //debugger
            console.log('', containers);
        }
        if(!containers || !containers.length){
            return node;
        }
        return containers[containers.length - 1];
    }

    function insertChildren (node) {
        var i,
            container = getContainer(node),
            children = lightNodes[node._uid];


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


            // FIXME: options getting mixed between instances!!!!!

            // TODO mechanism for adding methods that is not confusing
            // diff between def and options:
            //      options will get mixed into every node in the hierarchy
            //      def will only work in the top level node (lower hierarchy methods will get skipped)
            // options DO get registered in mc/inheritableMethods
            // def functions do NOT get registered in mc/inheritableMethods
            
            //console.log('def', options);
            var
                template,
                importDoc = window.globalImportDoc || (document._currentScript || document.currentScript).ownerDocument;

            def.importDoc = {
                get: function() { return importDoc; }
            };

            def.getLightNodes = function () {
                return lightNodes[this._uid];
            };

            if(options.templateString){
                def.templateNode = dom.toDom('<template>' + options.templateString + '</template>');
            }
            else if (options.templateId) {
                // get the template
                template = importDoc.getElementById(options.templateId);
                def.templateNode = template;
            }
    
            // accesses templateNode from above block
            // will return the top-most template in the chain
            def.getTemplateNode =  function () {
                return this.templateNode;
            };
            
            // FIXME: redundant with above, but in a totally different scope
            // Used in getTemplateChain block below.
            // Uses functional scope with options
            function getTemplateNode () {
                if(options.templateNode) {
                    return options.templateNode;
                }
                else if(options.templateString){
                    options.templateNode = dom.toDom('<template>' + options.templateString + '</template>');
                    return options.templateNode;
                }
                else if (options.templateId) {
                    // get the template
                    template = importDoc.getElementById(options.templateId);
                    options.templateNode = template;
                    return options.templateNode;
                }
            }

            
            //console.log('CREATE TMPL CHAIN', def);
            options.getTemplateChain =  function () {
                var
                    templates = this.super('getTemplateChain') || [],
                    template = getTemplateNode();

                if(template){
                    console.log('template', template.id);
                    if(!template.id){debugger}
                    templates.push(template);
                }
                return templates;
            }
        },

        preAttach: function (node) {
            insert(node);

        }
    });

}(window.create, window.dom, window.on));