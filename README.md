#create-element

Utility for easily creating web components

## To Install

    bower install clubajax/create-element --save
    
You may also use `npm` if you prefer. Or, you can clone the repository with your generic clone commands as a standalone 
repository or submodule.

	git clone git://github.com/clubajax/create-element.git

It is recommended that you set the config.path of RequireJS to make `create-element` accessible as an
absolute path.

create-element has dependencies on [clubajax/on](https://github.com/clubajax/on) and [clubajax/dom](https://github.com/clubajax/dom)

## Support

create-element works out of the box with Chrome.

Using the [webcomponents shim](https://github.com/webcomponents/webcomponentsjs), it supports all modern browsers, 
IE11 and up. It should work on IE10.

A good resource to learn about web components is HTML5 Rocks

    http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
    
## Docs

Basic element creation and usage:

    // create
    create({
        tag: 'my-custom'
    });
    
    // programmatic usage:
    var element = document.createElement('my-custom');

    // markup:
    <my-custom></my-custom>

Because of create-element's reliance upon [clubajax/dom](https://github.com/clubajax/dom) you could use shorthand:

    dom('my-custom', {}, document.body);

### lifecycle

create-element follows the v0 spec for lifecycle methods under the hood, and exposes them via shorthand methods:

 * createdCallback() -> created()
 * attachedCallback() -> attached()
 * detachedCallback() -> detached()
 * attributeChangedCallback() -> attributeChanged()
 
Note that attached and detached (as well as their under-the-hood callers) are not very useful, since they are called
multiple times if the element is added and removed multiple times from the document, as some frameworks tend to do.
Because of this, create-element provides additional lifecycle methods:

 * domReady()
 * destroy()
 
#### domReady

domReady is called after the following criteria has been met:
 * Element is attached to the document
 * An asynchronous amount of time has passed to allow for children to be added programmatically
 * The element's children are in a 'domready' state

domReady has to be triggered asynchronously because of the following:

    var element = dom('my-parent', {}, document.body);
    var child = dom('my-child', {}, element); 

In this scenario, `attached` will be called synchronously before the child has been added. Typically an element needs to
know about its children to set itself up. This setup can be done in `domReady`, which is called after a 
`requestAnimationFrame`.

`domReady` is guaranteed to only be called once per custom element.

#### destroy

`destroy` is not called automatically, it must be explicitly called. Under the hood, all eventListeners will be 
disconnected, while in the element code, other cleanup can be done, like destroying child custom elements.

#### Handling Asynchronous lifecycle

Because a majority of setup happens in `domReady`, there needs to be a way to know when the element is done setting up.
Ideally it could be done like this:

    var element = dom('my-custom', {}, document.body);
    element.on('domready', function () {
        // can continue work here
    });

However, that does not always work with the webcomponentsjs shim in browsers outside of Chrome. Due to the limitations of
the shim, element hydration (moving from UnknownElement to a custom element with lifecycle methods) happens asynchronously,
and helper methods like `element.on` have not been added immediately. This could be solved without the shorthand:

    var element = dom('my-custom', {}, document.body);
    element.addEventListener('domready', function () {
        // can continue work here
    });
    
Or the convenience function in `create` can be used:

    var element = dom('my-custom', {}, document.body);
    create.onDomReady(element, function (element) {
        // can continue work here
    });
    
The benefit of `create.onDomReady` over `element.addEventListener` is that if the element is already in the `domready` 
state the callback will still fire. Also, the event listener is cleaned up under the hood, while using 
`element.addEventListener` leaves that up to you.
   
## Event Handling
 
create-element uses the [clubajax/on](https://github.com/clubajax/on) library to handle events.
   
   
## Plugins

`create-element` uses a plugin architecture, which not only helps keep the code clean and maintainable, it allows for
flexibility. A plugin looks like this:

    create.addPlugin({
            name: PLUGIN_NAME,
            order: ORDER_OF_EXECUTION,
            define                  - fires during element definition
            preCreate               - fires before created is called
            postCreate              - fires after created is called
            preAttach               - fires before attached is called
            postAttach              - fires after created is called
            preDomReady             - fires before domReady is called
            postDomReady            - fires after domReady is called
            preAttributeChanged     - fires before attributeChanged is called
    });

The `name` should be unique, and the `order` determines, if multiple plugins all have the same callback (such as 
preDomReady) which plugin fires in what order.

All the callbacks fire with the custom element as an argument, except for `define`, which fires with the element 
definition and the options. The definition is an empty object at this stage, and could/should be populated with 
[property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). 
`options` is the object that is passed into the create function; the properties and methods can be anything.

### template plugin

The template plugin allows for the association of HTML, via a templateId property, with a custom element. The template 
can be created in a [template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template), which is not 
exposed to the document until it is cloned. 

    <template id="my-custom-template">
        <div>This will be inserted into the custom element</div>
    </template>
    
    create({
        tag: 'my-custom',
        templateId: 'my-custom-template'
    });

The script and template should be in the same document, especially if using 
[HTML Imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/).

Alternatively, an HTML string can be used with the 'tempateString' property:

    create({
        tag: 'my-custom',
        templateString: '<div>my-custom-template</div>'
    });

### refs plugin

The refs plugin allows for `ref` attributes to be used in the template as shortcuts for properties. The value of the 
`ref` attribute will be added as a property in the node and assigned the value of the node that contained the attribute.

    <template id="my-custom-template">
        <div ref="coolNode">Cool</div>
        <div ref="uncoolNode">Uncool</div>
    </template>
    
    create({
        tag: 'my-custom',
        templateId: 'my-custom-template',
        domReady: function () {
            console.log(this.coolNode.innerHTML); // Cool
            console.log(this.uncoolNode.innerHTML); // Uncool
        }
    });

To associate events, use an `on` attribute, with a colon-delineated event-method pair:

    <template id="my-custom-template">
        <div on="click:onClick">Cool</div>
        <div on="change:onChange">Uncool</div>
    </template>
    
    create({
        tag: 'my-custom',
        templateId: 'my-custom-template',
        onClick: function () {},
        onChange: function () {}
    });
    
## attrs plugin

The attr plugin is used to sync attributes with properties. If there is a property with the same name as an attribute, 
the property will be assigned that (normalized) value.

    create({
        tag: 'my-custom',
        foo: null,
        'my-prop':null,
        value:{
            set: function (value) {
                this.__value = value;
            },
            get: function () {
                return this.__value;
            }
        },
        set disabled (value) {
            this.__disabled = value;
        },
        get disabled () {
            return this.__disabled || false;
        }
    });
    
    <my-custom disabled="true" value="47" foo="fu" bar="bar" my-prop="props!"></my-custom>

All of the properties above will be set and ready on domReady, except for `bar` - since bar was not declared, it is 
undefined and therefore ignored.

Properties will also be set if later, `setAttribute` is used.

### reflect

`this.reflect` can be used in the opposite manner. If a property is set, calling `reflect` will set that attribute. If 
the value is `null` or `undefined`, the attribute is removed.

    create({
        tag: 'my-custom',
        value:{
            set: function (value) {
                this.__value = value;
                this.reflect('value', value);
            },
            get: function () {
                return this.__value;
            }
        }
    });
    
    <my-custom value="47"></my-custom>
    
    var element = dom.query('my-custom');
    console.log(element.value); // 47
    console.log(element.getAttribute('value')); // 47
    
    element.value = 'something else';
    console.log(element.value); // something else
    console.log(element.getAttribute('value')); // something else
    
    
## Shadow DOM (not used!)

create-element purposely does not use the Shadow DOM. There are only a few use cases for Shadow DOM, and due to the 
difficulty in styling, the cons outweigh the pros. This also keeps the library simple.

## License

This uses the [MIT license](./LICENSE). Feel free to use, and redistribute at will.