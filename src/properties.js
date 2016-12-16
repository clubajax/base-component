import BaseComponent from './BaseComponent';
const dom = require('dom');

function setProperties (node) {
    if(!node.props) {
        return;
    }

    node.props.forEach(function (prop) {
        if(prop === 'disabled'){
            Object.defineProperty(node, prop, {
                enumerable: true,
                get () {
                    return node.hasAttribute(prop);
                },
                set (value) {
                    if(value){
                        this.setAttribute('disabled', '');
                    }else{
                        this.removeAttribute('disabled');
                    }
                }
            });
        }
        else{
            Object.defineProperty(node, prop, {
                enumerable: true,
                get () {
                    return dom.normalize(this.getAttribute(prop));
                },
                set (value) {
                    this.setAttribute(prop, value);
                }
            });
        }
    });
}

BaseComponent.addPlugin({
    name: 'properties',
    order: 10,
    init: function (node) {
        setProperties(node);
    }
});

export default {};