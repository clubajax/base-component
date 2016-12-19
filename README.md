#BaseComponent

A base for more powerful web components

## To Install

    npm install clubajax/BaseComponent --save
    
You may also use `bower` if you prefer, although build tools like webpack prefer node_modules. 

Or, you can clone the repository with your generic clone commands as a standalone repository or submodule.

	git clone git://github.com/clubajax/BaseComponent.git


BaseComponent has dependencies on [clubajax/on](https://github.com/clubajax/on) and [clubajax/dom](https://github.com/clubajax/dom)

## To run the code

To run the tests in `tests/test-v1.html`, start the webpack build and webpack-dev-server:

    npm test
    
To run the webpack build for distribution to be accessed by `tests/test-dist.html`:

    npm run deploy
    
A "globalized" version can be built and accessed with `tests/globalES6.html`. This converts the ES6 `import` and `export` into window globals, but otherwise leaves
the remaining code as ES6. This way the code can be run in Chrome natively, and in Firefox and Edge with the webcomponents
shim. `import` and `export` and not yet a specification standard and are not yet supported in any browers (although it is
closest in Edge).

    npm run globalize

## Browser and ES Version Support

Custom elements use ES6 classes, so, consequently, that is how this library is written and how your code should be written.

## src/loader

TODO: DOC THIS

### ES5

It is possible to use custom elements with ES5, although at the moment, BaseComponent does not have examples or docs.

        https://www.webreflection.co.uk/blog/2016/08/21/custom-elements-v1
        https://lists.w3.org/Archives/Public/public-webapps-github/2016Mar/1932.html
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct

BaseComponent works out of the box with Chrome.

Using the [custom elements shim](https://github.com/webcomponents/custom-elements), it supports all modern browsers, 
IE11 and up. It should work on IE10.

A good resource to learn about web components is Google Developers

    https://developers.google.com/web/fundamentals/getting-started/primers/customelements
    
## Docs

Basic element creation and usage:

    // create
    class MyCustom extends BaseComponent {
        get templateString () {
            return `<div>This is MyCustom</div>`;
        }
    }
    customElements.define('my-custom', MyCustom);
    
    // programmatic usage:
    var element = document.createElement('my-custom');

    // markup:
    <my-custom></my-custom>

Because of BaseComponent's reliance upon [clubajax/dom](https://github.com/clubajax/dom) you could use shorthand:

    dom('my-custom', {}, document.body);

### lifecycle

BaseComponent follows the v1 spec for [lifecycle methods](https://developers.google.com/web/fundamentals/getting-started/primers/customelements#reactions)
 under the hood, and exposes them via shorthand methods:

 * connectedCallback() -> connected()
 * disconnectedCallback() -> disconnected()
 * attributeChangedCallback() -> attributeChanged()
 
Note that connected and disconnected (as well as their under-the-hood callers) are not very useful, since they are called
multiple times if the element is added and removed multiple times from the document, as some frameworks tend to do.
Because of this, BaseComponent provides additional lifecycle methods:

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

In this scenario, `connected` will be called synchronously before the child has been added. Typically an element needs to
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

However, that does not always work with the webcomponents shim in browsers outside of Chrome. Due to the limitations of
the shim, element hydration (moving from UnknownElement to a custom element with lifecycle methods) happens asynchronously,
and helper methods like `element.on` were not been added immediately. This could be solved without the shorthand:

    var element = dom('my-custom', {}, document.body);
    element.addEventListener('domready', function () {
        // can continue work here
    });
    
Or the convenience function (inserted globally from BaseComponent) can be used:

    var element = dom('my-custom', {}, document.body);
    onDomReady(element, function (element) {
        // can continue work here
    });
    
The benefit of `onDomReady` over `element.addEventListener` is that if the element is already in the `domready` 
state the callback will still fire. Also, the event listener is cleaned up under the hood, while using 
`element.addEventListener` leaves that up to you.
   
## Event Handling
 
create-element uses the [clubajax/on](https://github.com/clubajax/on) library to handle events. To add even more power
to custom elements, `on` is included, and its context set to itself. For example:

    myCustomElement.on('click', function (event) {
        // handle click
    });

The power happens by functionality that remembers the events, and when `destroy()` is called, they are all removed. So
all event cleanup is a matter of calling `destroy()`.

While context defaults to the element itself, you can optionally specify a different element (or window in this case):

    myCustomElement.on(window, 'resize', function (event) {
        // handle resize
    });

You can also use the `once` feature:

    myCustomElement.once(img, 'load', function (event) {
        // handle image loading
        // this event will never fire again
    });
   
Also mixed into the custom element are `on`'s `emit` and `fire` methods. Typically, `emit` is for standard events, and
`fire` is for custom events.

    this.emit('change', {value: this.value});
    this.fire('closed');
   
See the [clubajax/on](https://github.com/clubajax/on) documentation for a complete list of features.

## Plugins

`BaseComponent` uses a plugin architecture, which not only helps keep the code clean and maintainable, it allows for
flexibility. A plugin looks like this:

    BaseComponent.addPlugin({
            name: PLUGIN_NAME,
            order: ORDER_OF_EXECUTION,
            init                    - fires after constructor
            preConnected            - fires before connected is called
            postConnected           - fires after connected is called
            preDomReady             - fires before domReady is called
            postDomReady            - fires after domReady is called
            preAttributeChanged     - fires before attributeChanged is called
    });

The `name` should be unique, and the `order` determines, if multiple plugins all have the same callback (such as 
preDomReady) which plugin fires in what order.

All the callbacks fire with the custom element as an argument, with the element and possible options.

### template plugin

The template plugin allows for the association of HTML, via a templateId property, with a custom element. The template 
can be created in a [template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template), which is not 
exposed to the document until it is cloned. 

    <template id="my-custom-template">
        <div>This will be inserted into the custom element</div>
    </template>
    
    class TestTmplId extends BaseComponent {
        get templateId () {
            return 'test-tmpl-id-template';
        }
    }

Alternatively, an HTML string can be used with the 'templateString' property:

    class TestTmplId extends BaseComponent {
        get templateString () {
            return '<div>my-custom-template</div>';
        }
    }

### refs plugin

The refs plugin allows for `ref` attributes to be used in the template as shortcuts for properties. The value of the 
`ref` attribute will be added as a property in the node and assigned the value of the node that contained the attribute.

    <template id="my-custom-template">
        <div ref="coolNode">Cool</div>
        <div ref="uncoolNode">Uncool</div>
    </template>
    
    class TestTmplId extends BaseComponent {
        get templateId () {
            return 'test-tmpl-id-template';
        }
        
        domReady () {
            console.log(this.coolNode.innerHTML); // Cool
            console.log(this.uncoolNode.innerHTML); // Uncool
        }
    }

To associate events, use an `on` attribute, with a colon-delineated event-method pair:

    <template id="my-custom-template">
        <div on="click:onClick">Cool</div>
        <div on="change:onChange">Uncool</div>
    </template>
    
    class TestTmplId extends BaseComponent {
        get templateId () {
            return 'test-tmpl-id-template';
        }
        
        onClick (event) {}
        onChange (event) {}
    }

## properties plugin

The `properties` plugin is used to reduce redundancy on getter setters. The [spec](https://w3c.github.io/webcomponents/spec/custom/#custom-elements-autonomous-example)
 is designed to make it easy to sync properties with attributes; but in doing so, the result is a `get` and `set` for 
 every property that only sets or returns its corresponding attribute.

Using the `properties` plugin, and adding a `props` array that is the same or a subset of the `observedAttributes` array
will automatically add those getters and setters, including the special case for `disabled` which removes the attribute
and checks for existence (don't worry, it just works).

Then do any work in the `attributeChanged` method.

    class TestProps extends BaseComponent {
    
        static get observedAttributes() { return ['foo', 'bar']; }
        get props () { return ['foo', 'bar']; }
     
        attributeChanged (name, value) {
            if(name === 'foo') // do foo things
            if(name === 'bar') // do bar things
        }
    }
    
    
## Inheritance

Use the same inheritance you would use with [ES6 classes](http://exploringjs.com/es6/ch_classes.html#_the-species-pattern-in-static-methods). 

## Shadow DOM (not used!)

create-element purposely does not use the Shadow DOM. There are only a few use cases for Shadow DOM, and due to the 
difficulty in styling, the cons outweigh the pros. This also keeps the library simple.

## ES6 FAQ

Q. Uncaught TypeError: Failed to construct 'HTMLElement': Please use the 'new' operator, this DOM object constructor cannot be called as a function.

A. The webcomponents native-shim.js is missing.

Q. Uncaught TypeError:Super expression must either be null or a function, not object

A. The class is not extending the class correctly. This is because of a typo, a bad class, or when importing, getting a
wrapper around the object; ergo, instead of `extend MyClass`, do `extend MyClass.default`

Q. Uncaught TypeError: Class constructor cannot be invoked without 'new'

A. babel is not transpiling. This could be:
 * wrong version (try "latest" or "es2015")
 * using "excludes" in webpack (this kills babel for some reason)
 
Or, as per the above FAQ, it is _*because*_ you added default to the extended class.

Q. What are the `constructor super()` rules?

A. Super-Rules:
 
 * Do not call `super()` if not extending a class
 * When extending a class and using a constructor, `super()` must be called.
 * `super()` must be called first - or at least before using the `this` keyword.
 
Q. Why are my component methods undefined?

A. Did you remember to do: `customElements.define('my-component', MyComponent)`?

## webpack FAQ

Q. The HMS detects changes, but I do not see them in the document.

A. Webpack uses a virtual directory (`output.publicPath`) to serve files. You are probably pointing to the wrong source 
code in your HTML.

Q. There is an error saying my files are not there - but they are!

A. This can happen if webpack is running while you switch branches.

## License

This uses the [MIT license](./LICENSE). Feel free to use, and redistribute at will.