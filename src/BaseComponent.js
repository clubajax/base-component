// class/component rules
// always call super() first in the ctor. This also calls the extended class' ctor.
// cannot call NEW on a Component class
//

let on = require('../bower_components/on/dist/on');

export default class BaseElement extends HTMLElement {
    constructor() {
        super();
        this._uid = dom.uid(this.localName);
        privates[this._uid] = {DOMSTATE: 'created'};
        let hList = privates[this._uid + '-handle-list'] = [];
        
        console.log('this._uid', this._uid);
        console.log('Base.constructor');

        plugin('init', this);

    }
    
    connectedCallback () {
        console.log('Base.connectedCallback!', this._uid);

        privates[this._uid].DOMSTATE = 'connected';
        plugin('preConnected', this);

        //nextTick(onCheckDomReady.bind(this));

        if(this.connected){
            this.connected();
        }
        this.fire('connected');

        plugin('postConnected', this);
    }

    disconnectedCallback () {
        privates[this._uid].DOMSTATE = 'disconnected';
        plugin('preDisconnected', this);
        if(this.disconnected){
            this.disconnected();
        }
        this.fire('disconnected');
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
        plugin('preAttributeChanged', this, attrName, newVal, oldVal);
        if(this.attributeChanged){
            this.attributeChanged(attrName, newVal, oldVal);
        }
    }

    destroy () {
        if (this._destroy) {
            this._destroy();
        }
        this.fire('destroy');
        privates[this._uid + '-handle-list'].forEach(function (handle) {
            handle.remove();
        });
        console.log('destr:', this.localName);
        dom.destroy(this);
    }

    fire (eventName, eventDetail, bubbles) {
        return on.fire(this, eventName, eventDetail, bubbles);
    }

    emit (eventName, value) {
        return on.emit(this, eventName, value);
    }

    on (node, eventName, selector, callback) {
        return this.registerHandle(
            typeof node != 'string' ? // no node is supplied
                on(node, eventName, selector, callback) :
                on(this, node, eventName, selector));
    }

    once (node, eventName, selector, callback) {
        return this.registerHandle(
            typeof node != 'string' ? // no node is supplied
                on.once(node, eventName, selector, callback) :
                on.once(this, node, eventName, selector, callback));
    }

    registerHandle (handle) {
        privates[this._uid + '-handle-list'].push(handle);
        return handle;
    }

    get DOMSTATE (){
        return privates[this._uid].DOMSTATE;
    }

    static addPlugin (plug) {
        console.log(' * addPlugin', plug);
        var i, order = plug.order || 100;
        if(!plugins.length) {
            plugins.push(plug);
        }
        else if(plugins.length === 1){
            if(plugins[0].order <= order){
                plugins.push(plug);
            }else{
                plugins.unshift(plug);
            }
        }
        else if(plugins[0].order > order){
            plugins.unshift(plug);
        }
        else{

            for(i = 1; i < plugins.length; i++){
                if(order === plugins[i-1].order || (order > plugins[i-1].order && order < plugins[i].order)){
                    plugins.splice(i, 0, plug);
                    return;
                }
            }
            // was not inserted...
            plugins.push(plug);
        }
    }
}

let
    privates = {},
    plugins = [];

function plugin (method, node, a, b, c) {
    plugins.forEach(function (plug) {
        //console.log(' * method?', method, plug[method]);
        if(plug[method]){
            plug[method](node, a, b, c);
        }
    });
}

function nextTick(cb) {
    requestAnimationFrame(cb);
}

function noop() {}