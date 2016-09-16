(function(dom, on){

    var
        baseElement,
        extOptions,
        privates = {},
        validProperties = {writable: true, enumerable: true, configurable: true, value: true, get: true, set: true};

    function noop () {}

    function nextTick (cb) {
        requestAnimationFrame(cb);
    }

    function isDescriptor (descriptor) {
        return typeof descriptor.value !== 'function' && typeof descriptor.value === 'object';
    }

    function isGetSet (descriptor) {
        return descriptor.get || descriptor.set;
    }

    function isObject (descriptor) {
        if(!isDescriptor(descriptor) || isGetSet(descriptor.value) || descriptor.value.value){ return false; }
        if(Array.isArray(descriptor.value)){ return true; }
        return true;
    }

    function convertOptionsToDefinition (def, options) {
        // converts standard object to property definition
        // ergo: {foo: function(){}} to {foo:{value: function(){}}}
        //
        Object.keys(options).forEach(function (key) {

            var
                tmp = {
                    writable:     true,
                    configurable: true,
                    enumerable:   true,
                    value:{}
                },
                value = options[key],
                descriptor = Object.getOwnPropertyDescriptor(options, key);

            if(isObject(descriptor)){
                // plain
                def._objects = def._objects || {};
                def._objects[key] = value;
                return;
            }

            if(isGetSet(descriptor)) {
                // convert getter/setter to object
                tmp.value.get = descriptor.get;
                tmp.value.set = descriptor.set;
                Object.defineProperty(def, key, tmp);
                return;
            }

            if(isDescriptor(descriptor)) {
                // already an object
                console.log('desc', key, descriptor);
                Object.defineProperty(def, key, descriptor);
                return;
            }



            if (typeof value === 'object') {
                //console.log('OBJECT', key, Object.getOwnPropertyDescriptor(options, key));
                var keys = Object.keys(value),
                    valid = keys.every(function (name) { return validProperties[name] === true; });
                if (valid) {
                    // propertyDefinition (getter/setter)
                    var d = def[key] = {};
                    Object.keys(value).forEach(function (k) {
                        d[k] = value[k];
                    });
                    return;
                }
            }

            // Poor man's inheritance - a sub-destroy method
            if(key === 'destroy'){
                key = '_destroy';
            }
            //console.log('CONVERT', key, Object.getOwnPropertyDescriptor(options, key));
            def[key] = {
                value:    value,
                writable:     true,
                configurable: true,
                enumerable:   true
            };
        });

        return def;
    }

    function getChildCustomNodes (node) {
        // collect any children that are custom nodes
        // used to check if their dom is ready before
        // determining if this is ready
        var i, nodes = [];
        for(i = 0; i < node.children.length; i++){
            if(node.children[i].nodeName.indexOf('-') > -1){
                nodes.push(node.children[i]);
            }
        }
        return nodes;
    }

    function onDomReady() {
        privates[this._uid].DOMSTATE = 'domready';
        plugins('preDomReady', this);
        // call this.domReady first, so that the component
        // can finish initializing before firing any
        // subsequent events
        if (this.domReady) {
            this.domReady();
            // domReady should only ever fire once
            this.domReady = function () {};

        }

        this.fire('domready');

        plugins('postDomReady', this);
    }

    function onCheckDomReady () {
        if (this.DOMSTATE != 'attached') return;

        var
            count = 0,
            children = getChildCustomNodes(this),
            ourDomReady = onDomReady.bind(this);

        function addReady () {
            count++;
            if (count == children.length) {
                ourDomReady();
            }
        }

        // If no children, we're good - leaf node. Commence with onDomReady
        //
        if (!children.length) {
            ourDomReady();
        } else {
            // else, wait for all children to fire their `ready` events
            //
            children.forEach(function (child) {
                // check if child is already ready
                if (child.DOMSTATE == 'domready') {
                    addReady();
                }
                // if not, wait for event
                child.on('domready', addReady);
            });
        }
    }

    function plugins (method, node, option, a, b, c) {
        create.plugins.forEach(function (plugin) {
            if(plugin[method]){
                plugin[method](node, option, a, b, c);
            }
        });
    }

    function clone(template){
        if (template.content && template.content.children) {
            return document.importNode(template.content, true);
        }
        var
            frag = document.createDocumentFragment(),
            cloneNode = document.createElement('div');
        cloneNode.innerHTML = template.innerHTML;

        while (cloneNode.children.length) {
            frag.appendChild(cloneNode.children[0]);
        }
        return frag;
    }

    extOptions = {

        super:{
            get: function () {
                var p = Object.getPrototypeOf(this);
                if(p._tag === this._tag){
                    return Object.getPrototypeOf(p);
                }
                return p;
            }
        },

        connectedCallback: function () {
            console.log('connectedCallback');
        },

        disconnectedCallback: function () {
            console.log('disconnectedCallback');
        },

        createdCallback: {
            value: function () {
                //console.log('tag', this._tag);
                this._uid = dom.uid(this._tag);
                privates[this._uid] = { DOMSTATE: 'created' };
                plugins('preCreate', this);
                // private?
                this._cleanUpList = {};
                this._cleanUpList.next = this._cleanUpList.prev = this._cleanUpList;



                if(this.created){
                    this.created();
                }
                this.fire('created');
            }
        },

        attachedCallback: {
            value: function () {
                privates[this._uid].DOMSTATE = 'attached';
                plugins('preAttach', this);

                nextTick(onCheckDomReady.bind(this));

                if(this.attached){
                    this.attached();
                }
                this.fire('attached');
            }
        },

        detachedCallback: {
            value: function () {
                privates[this._uid].DOMSTATE = 'detached';
                plugins('preDetach', this);
                if(this.detached){
                    this.detached();
                }
                this.fire('detached');
            }
        },

        attributeChangedCallback: {
            value: function (attrName, oldVal, newVal) {
                plugins('preAttributeChanged', this, attrName, newVal, oldVal);
                if(this.attributeChanged){
                    this.attributeChanged(attrName, newVal, oldVal);
                }
            }
        },

        destroy:{
            value: function () {
                if(this._destroy){
                    this._destroy();
                }
                this.fire('destroy');
                while (this._cleanUpList !== this._cleanUpList.next) {
                    var handle = this._cleanUpList.next;
                    handle.remove();
                    if (handle === this._cleanUpList.next) {
                        // exclude a handle from list explicitly
                        handle.prev.next = handle.next;
                        handle.next.prev = handle.prev;
                    }
                }
                dom.destroy(this);
            }
        },

        registerHandle: {
            value: function (handle) {
                if (Array.isArray(handle)) {
                    handle.forEach(function (handle) {
                        this.registerHandle(handle);
                    }, this);
                    return handle;
                }
                // include in a double-linked list
                var oldRemove = handle.remove, head = this._cleanUpList;
                handle.prev = head;
                handle.next = head.next;
                handle.prev.next = handle.next.prev = handle;
                handle.remove = function () {
                    // exclude itself from the list
                    handle.prev.next = handle.next;
                    handle.next.prev = handle.prev;
                    // clean itself up
                    oldRemove.call(handle);
                    handle.remove = noop;
                };
                return handle;
            }
        },

        fire: {
            value: function (eventName, eventDetail, bubbles) {
                return on.fire(this, eventName, eventDetail, bubbles);
            }
        },

        emit: {
            value: function (eventName, value) {
                return on.emit(this, eventName, value);
            }
        },

        on: {
            value: function (node, eventName, selector, callback) {
                return this.registerHandle(
                    typeof node != 'string' ? // no node is supplied
                        on(node, eventName, selector, callback) :
                        on(this, node, eventName, selector));
            }
        },

        once: {
            value: function (node, eventName, selector, callback) {
                return this.registerHandle(
                    typeof node != 'string' ? // no node is supplied
                        on.once(node, eventName, selector, callback) :
                        on.once(this, node, eventName, selector, callback));
            }
        },

        DOMSTATE: {
            get: function (){
                return privates[this._uid].DOMSTATE;
            }
        }
    };

    baseElement = Object.create(HTMLElement.prototype, extOptions);

    function create(options){

        var
            element,
            constructor,
            objects,
            def = {};

        plugins('define', def, options);

        def._tag = {value: options.tag};

        // collect component-specific definitions
        def = convertOptionsToDefinition(def, options);

        if(def._objects){
            objects = def._objects;
            delete def._objects;
        }

        if(options.extends){
            element = Object.create(create.elements[options.extends], def);
        }
        else{
            element = Object.create(baseElement, def);
        }

        if(objects){
            Object.keys(objects).forEach(function (key) {
                element[key] = objects[key];
            });
        }

        create.elements[options.tag] = element;

        constructor = document.registerElement(options.tag, {
            prototype: element
        });

        return constructor;
    }

    create.elements = {};
    create.onDomReady = function (node, callback) {
        if(node.DOMSTATE === 'domready'){
            callback(node);
        }else{
            node.addEventListener('domready', function () {
                callback(node);
                // domReady should only fire once, but it doesn't - it might fire multiple times.
                callback = function () {};
            });
        }
    };


    function addPlugin (plugin) {
        var i, plugins = create.plugins, order = plugin.order || 100;
        if(!plugins.length) {
            plugins.push(plugin);
        }
        else if(plugins.length === 1){
            if(plugins[0].order <= order){
                plugins.push(plugin);
            }else{
                plugins.unshift(plugin);
            }
        }
        else if(plugins[0].order > order){
            plugins.unshift(plugin);
        }
        else{

            for(i = 1; i < plugins.length; i++){
                if(order === plugins[i-1].order || (order > plugins[i-1].order && order < plugins[i].order)){
                    plugins.splice(i, 0, plugin);
                    return;
                }
            }
            // was not inserted...
            plugins.push(plugin);
        }
    }

    create.plugins = [];
    create.addPlugin = addPlugin;
    create.clone = clone;
    window.create = create;

}(window.dom, window.on));