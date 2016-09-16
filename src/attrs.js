(function (create, dom, on) {

    function setProp (node, name, value) {
        value = dom.normalize(value);
        if(name in node){
            if (typeof node[name] === 'function') {
                node[name](value);
            }else{
                node[name] = value;
            }
        }
    }

    create.addPlugin({
        name: 'attrs',
        order: 20,

        define: function (def, options) {
            options.reflect = function (name, value) {
                console.log('REFLECT', name, value);
                if(value === null){
                    this.removeAttribute(name);
                }else{
                    this.setAttribute(name, value);
                }
            }
        },
        preDomReady: function (node) {
            var i, value, name;
            for(i = 0; i < node.attributes.length; i++){
                name = node.attributes[i].name;
                value = dom.normalize(node.attributes[i].value);
                setProp(node, name, value);
            }
        },

        preAttributeChanged: function (node, name, value, oldValue) {
            setProp(node, name, value);
        }
    });

}(window.create, window.dom, window.on));