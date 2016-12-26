import BaseComponent from './BaseComponent';
const dom = require('dom');

function walkDom (node, refs) {

    if(node.attributes) {
        for(let i = 0; i < node.attributes.length; i++){
            if(/\{\{/.test(node.attributes[i].value)){
                refs.attributes = refs.attributes || {};
                // could be more than one??
                // same with node?
                refs.attributes[node.attributes[i].name] = node;
            }
        }
    }

    if(!node.children.length){
        if(/\{\{/.test(node.innerHTML)){
            refs[node.innerHTML.replace('{{','').replace('}}','')] = node;
            node.innerHTML = '';
        }
        return;
    }
    for(let i = 0; i < node.children.length; i++){
        walkDom(node.children[i], refs);
    }
}

function updateItemTemplate (frag) {
    let refs = {};
    walkDom(frag, refs);
    return refs;
}

BaseComponent.prototype.renderList = function (items, container, itemTemplate) {
    let
        frag = document.createDocumentFragment(),
        tmpl = itemTemplate || this.itemTemplate,
        refs = tmpl.itemRefs,
        clone;

    items.forEach(function (item) {
        Object.keys(item).forEach(function (key) {
            if(refs[key]){
                refs[key].innerHTML = item[key];
            }
        });
        if(refs.attributes){
            Object.keys(refs.attributes).forEach(function (name) {
                let node = refs.attributes[name];
                node.setAttribute(name, item[name]);
            });
        }

        clone = tmpl.cloneNode(true);
        frag.appendChild(clone);
    });

    container.appendChild(frag);
};

BaseComponent.addPlugin({
    name: 'item-template',
    order: 40,
    preDomReady: function (node) {
        node.itemTemplate = dom.query(node, 'template');
        if(node.itemTemplate){
            node.itemTemplate.parentNode.removeChild(node.itemTemplate);
            node.itemTemplate = BaseComponent.clone(node.itemTemplate);
            node.itemTemplate.itemRefs = updateItemTemplate(node.itemTemplate);
        }
    }
});

export default {};