(function (create, dom, on) {

    function setAttr (node, name, value) {
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

        preDomReady: function (node) {
            var i, value, name;
            for(i = 0; i < node.attributes.length; i++){
                name = node.attributes[i].name;
                value = dom.normalize(node.attributes[i].value);
                setAttr(node, name, value);
            }
        },

        preAttributeChanged: function (node, name, value, oldValue) {
            setAttr(node, name, value);
        }
    });

}(window.create, window.dom, window.on));