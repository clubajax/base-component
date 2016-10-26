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
        node.getTemplateChain();
        //console.log('HAZ:', node.getTemplateNode());
        return !!node.getTemplateNode();


        //node.simple();
        //node.complex();

        return !!node.templateNode;// || node.getProto().templateNode;
    }

    function insertTemplate (node){
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

    function insertChildren (node) {
        var i,
            container = node.querySelector('[ref="container"]') || node,
            children = lightNodes[node._uid];

        //console.log('container', container);
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
                    tmpls = this.super('getTemplateChain') || [],
                    node = getTemplateNode();
                if(node){
                    tmpls.push(node);
                }
                return tmpls;
            }
        },

        preAttach: function (node) {
            insert(node);

        }
    });

}(window.create, window.dom, window.on));