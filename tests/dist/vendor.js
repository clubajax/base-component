require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"dom":[function(require,module,exports){
/* UMD.define */ (function (root, factory) {
    if (typeof customLoader === 'function'){ customLoader(factory, 'dom'); }else if (typeof define === 'function' && define.amd) { define([], factory); } else if (typeof exports === 'object') { module.exports = factory(); } else { root.returnExports = factory(); window.dom = factory(); }
}(this, function () {
    //  convenience library for common DOM methods
    //      dom()
    //          create dom nodes
    //      dom.style()
    //          set/get node style
    //      dom.attr()
    //          set/get attributes
    //      dom.destroy()
    //          obliterates a node
    //      dom.box()
    //          get node dimensions
    //      dom.uid()
    //          get a unique ID (not dom specific)
    //
    var
        isFloat = {
            opacity: 1,
            zIndex: 1,
            'z-index': 1
        },
        isDimension = {
            width:1,
            height:1,
            top:1,
            left:1,
            right:1,
            bottom:1,
            maxWidth:1,
            'max-width':1,
            minWidth:1,
            'min-width':1,
            maxHeight:1,
            'max-height':1
        },
        uids = {},
        destroyer = document.createElement('div');

    function uid (type){
        if(!uids[type]){
            uids[type] = [];
        }
        var id = type + '-' + (uids[type].length + 1);
        uids[type].push(id);
        return id;
    }

    function isNode (item){
        // safer test for custom elements in FF (with wc shim)
        return !!item && typeof item === 'object' && typeof item.innerHTML === 'string';
    }

    function getNode (item){

        if(!item){ return item; }
        if(typeof item === 'string'){
            return document.getElementById(item);
        }
        // de-jqueryify
        return item.get ? item.get(0) :
            // item is a dom node
            item;
    }

    function byId (id){
        return getNode(id);
    }

    function style (node, prop, value){
        // get/set node style(s)
        //      prop: string or object
        //
        var key, computed;
        if(typeof prop === 'object'){
            // object setter
            for(key in prop){
                if(prop.hasOwnProperty(key)){
                    style(node, key, prop[key]);
                }
            }
            return null;
        }else if(value !== undefined){
            // property setter
            if(typeof value === 'number' && isDimension[prop]){
                value += 'px';
            }
            node.style[prop] = value;

            if(prop === 'userSelect'){
                value = !!value ? 'text' : 'none';
                style(node, {
                    webkitTouchCallout: value,
                    webkitUserSelect: value,
                    khtmlUserSelect: value,
                    mozUserSelect: value,
                    msUserSelect: value
                });
            }
        }

        // getter, if a simple style
        if(node.style[prop]){
            if(isDimension[prop]){
                return parseInt(node.style[prop], 10);
            }
            if(isFloat[prop]){
                return parseFloat(node.style[prop]);
            }
            return node.style[prop];
        }

        // getter, computed
        computed = getComputedStyle(node, prop);
        if(computed[prop]){
            if(/\d/.test(computed[prop])){
                if(!isNaN(parseInt(computed[prop], 10))){
                    return parseInt(computed[prop], 10);
                }
                return computed[prop];
            }
            return computed[prop];
        }
        return '';
    }

    function attr (node, prop, value){
        // get/set node attribute(s)
        //      prop: string or object
        //
        var key;
        if(typeof prop === 'object'){
            for(key in prop){
                if(prop.hasOwnProperty(key)){
                    attr(node, key, prop[key]);
                }
            }
            return null;
        }
        else if(value !== undefined){
            if(prop === 'text' || prop === 'html' || prop === 'innerHTML'){
                node.innerHTML = value;
            }else{
                node.setAttribute(prop, value);
            }
        }

        return node.getAttribute(prop);
    }

    function box (node){
        if(node === window){
            node = document.documentElement;
        }
        // node dimensions
        // returned object is immutable
        // add scroll positioning and convenience abbreviations
        var
            dimensions = getNode(node).getBoundingClientRect();
        return {
            top: dimensions.top,
            right: dimensions.right,
            bottom: dimensions.bottom,
            left: dimensions.left,
            height: dimensions.height,
            h: dimensions.height,
            width: dimensions.width,
            w: dimensions.width,
            scrollY: window.scrollY,
            scrollX: window.scrollX,
            x: dimensions.left + window.pageXOffset,
            y: dimensions.top + window.pageYOffset
        };
    }

    function query (node, selector){
        if(!selector){
            selector = node;
            node = document;
        }
        return node.querySelector(selector);
    }
    
    function queryAll (node, selector){
        if(!selector){
            selector = node;
            node = document;
        }
        var nodes = node.querySelectorAll(selector);

        if(!nodes.length){ return []; }

        // convert to Array and return it
        return Array.prototype.slice.call(nodes);
    }

    function toDom (html, options, parent){
        // create a node from an HTML string
        var node = dom('div', {html: html});
        parent = byId(parent || options);
        if(parent){
            while(node.firstChild){
                parent.appendChild(node.firstChild);
            }
            return node.firstChild;
        }
        if(html.indexOf('<') !== 0){
            return node;
        }
        return node.firstChild;
    }

    function fromDom (node) {
        function getAttrs (node) {
            var att, i, attrs = {};
            for(i = 0; i < node.attributes.length; i++){
                att = node.attributes[i];
                attrs[att.localName] = normalize(att.value === '' ? true : att.value);
            }
            return attrs;
        }
        function getText (node) {
            var i, t, text = '';
            for(i = 0; i < node.childNodes.length; i++){
                t = node.childNodes[i];
                if(t.nodeType === 3 && t.textContent.trim()){
                    text += t.textContent.trim();
                }
            }
            return text;
        }
        var i, object = getAttrs(node);
        object.text = getText(node);
        object.children = [];
        if(node.children.length){
            for(i = 0; i < node.children.length; i++){
                object.children.push(fromDom(node.children[i]));
            }
        }
        return object;
    }

    function addChildren (node, children) {
        if(Array.isArray(children)){
            for(var i = 0; i < children.length; i++){
                node.appendChild(children[i]);
            }
        }
        else{
            node.appendChild(children);
        }
    }

    function addContent (node, options) {
        var html;
        if(options.html !== undefined || options.innerHTML !== undefined){
            html = options.html || options.innerHTML || '';
            if(typeof html === 'object'){
                addChildren(node, html);
            }else{
                node.innerHTML = html;
            }

            // misses some HTML, such as entities (&npsp;)
            //else if(html.indexOf('<') === 0) {
            //    node.innerHTML = html;
            //}
            //else{
            //    node.appendChild(document.createTextNode(html));
            //}
        }
        if(options.text){
            node.appendChild(document.createTextNode(options.text));
        }
        if(options.children){
            addChildren(node, options.children);
        }
    }
    
    function dom (nodeType, options, parent, prepend){
        // create a node
        // if first argument is a string and starts with <, it is assumed
        // to use toDom, and creates a node from HTML. Optional second arg is
        // parent to append to
        // else:
        //      nodeType: string, type of node to create
        //      options: object with style, className, or attr properties
        //          (can also be objects)
        //      parent: Node, optional node to append to
        //      prepend: truthy, to append node as the first child
        //
        if(nodeType.indexOf('<') === 0){
            return toDom(nodeType, options, parent);
        }

        options = options || {};
        var
            className = options.css || options.className || options.class,
            node = document.createElement(nodeType);

        parent = getNode(parent);

        if(className){
            node.className = className;
        }
        
        addContent(node, options);
        
        if(options.cssText){
            node.style.cssText = options.cssText;
        }

        if(options.id){
            node.id = options.id;
        }

        if(options.style){
            style(node, options.style);
        }

        if(options.attr){
            attr(node, options.attr);
        }

        if(parent && isNode(parent)){
            if(prepend && parent.hasChildNodes()){
                parent.insertBefore(node, parent.children[0]);
            }else{
                parent.appendChild(node);
            }
        }

        return node;
    }

    function getNextSibling (node) {
        var sibling = node;
        while(sibling){
            sibling = sibling.nextSibling;
            if(sibling && sibling.nodeType === 1){
                return sibling;
            }
        }
        return null;
    }

    function insertAfter (refNode, node) {
        var sibling = getNextSibling(refNode);
        if(!sibling){
            refNode.parentNode.appendChild(node);
        }else{
            refNode.parentNode.insertBefore(node, sibling);
        }
        return sibling;
    }

    function destroy (node){
        // destroys a node completely
        //
        if(node) {
            destroyer.appendChild(node);
            destroyer.innerHTML = '';
        }
    }

    function clean (node, dispose){
        //	Removes all child nodes
        //		dispose: destroy child nodes
        if(dispose){
            while(node.children.length){
                destroy(node.children[0]);
            }
            return;
        }
        while(node.children.length){
            node.removeChild(node.children[0]);
        }
    }

    function ancestor (node, selector){
        // TODO: replace this with 'closest' and 'matches'
        // gets the ancestor of node based on selector criteria
        // useful for getting the target node when a child node is clicked upon
        //
        // USAGE
        //      on.selector(childNode, '.app.active');
        //      on.selector(childNode, '#thinger');
        //      on.selector(childNode, 'div');
        //	DOES NOT SUPPORT:
        //		combinations of above
        var
            test,
            parent = node;

        if(selector.indexOf('.') === 0){
            // className
            selector = selector.replace('.', ' ').trim();
            test = function(n){
                return n.classList.contains(selector);
            };
        }
        else if(selector.indexOf('#') === 0){
            // node id
            selector = selector.replace('#', '').trim();
            test = function(n){
                return n.id === selector;
            };
        }
        else if(selector.indexOf('[') > -1){
            // attribute
            console.error('attribute selectors are not yet supported');
        }
        else{
            // assuming node name
            selector = selector.toUpperCase();
            test = function(n){
                return n.nodeName === selector;
            };
        }

        while(parent){
            if(parent === document.body || parent === document){ return false; }
            if(test(parent)){ break; }
            parent = parent.parentNode;
        }

        return parent;
    }

    dom.classList = {
        remove: function (node, names){
            toArray(names).forEach(function(name){
                node.classList.remove(name);
            });
        },
        add: function (node, names){
            toArray(names).forEach(function(name){
                node.classList.add(name);
            });
        },
        contains: function (node, names){
            return toArray(names).every(function (name) {
                return node.classList.contains(name);
            });
        },
        toggle: function (node, names, value){
            names = toArray(names);
            if(typeof value === 'undefined') {
                // use standard functionality, supported by IE
                names.forEach(function (name) {
                    node.classList.toggle(name, value);
                });
            }
            // IE11 does not support the second parameter  
            else if(value){
                names.forEach(function (name) {
                    node.classList.add(name);
                });
            }
            else{
                names.forEach(function (name) {
                    node.classList.remove(name);
                });
            }
        }
    };

    function toArray (names){
        if(!names){
            console.error('dom.classList should include a node and a className');
            return [];
        }
        return names.split(' ').map(function (name) {
            return name.trim();
        });
    }

    if (!window.requestAnimationFrame) {
        dom.requestAnimationFrame = function(callback){
            setTimeout(callback, 0);
        };
    }else{
        dom.requestAnimationFrame = function(cb){
            window.requestAnimationFrame(cb);
        };
    }
    
    function normalize (val){
        if(val === 'false'){
            return false;
        }else if(val === 'true'){
            return true;
        }
        if(!isNaN(parseFloat(val))){
            return parseFloat(val);
        }
        return val;
    }

    dom.normalize = normalize;
    dom.clean = clean;
    dom.query = query;
    dom.queryAll = queryAll;
    dom.byId = byId;
    dom.attr = attr;
    dom.box = box;
    dom.style = style;
    dom.destroy = destroy;
    dom.uid = uid;
    dom.isNode = isNode;
    dom.ancestor = ancestor;
    dom.toDom = toDom;
    dom.fromDom = fromDom;
    dom.insertAfter = insertAfter;
    dom.getNextSibling = getNextSibling;

    return dom;
}));

},{}],"keyboardevent-key-polyfill":[function(require,module,exports){
/* global define, KeyboardEvent, module */

(function () {

  var keyboardeventKeyPolyfill = {
    polyfill: polyfill,
    keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    }
  };

  // Function keys (F1-24).
  var i;
  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  }

  // Printable ASCII characters.
  var letter = '';
  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }

  function polyfill () {
    if (!('KeyboardEvent' in window) ||
        'key' in KeyboardEvent.prototype) {
      return false;
    }

    // Polyfill `key` on `KeyboardEvent`.
    var proto = {
      get: function (x) {
        var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];

        if (Array.isArray(key)) {
          key = key[+this.shiftKey];
        }

        return key;
      }
    };
    Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
    return proto;
  }

  if (typeof define === 'function' && define.amd) {
    define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = keyboardeventKeyPolyfill;
  } else if (window) {
    window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
  }

})();

},{}],"on":[function(require,module,exports){
/* global define, KeyboardEvent, module */

(function () {

  var keyboardeventKeyPolyfill = {
    polyfill: polyfill,
    keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    }
  };

  // Function keys (F1-24).
  var i;
  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  }

  // Printable ASCII characters.
  var letter = '';
  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }

  function polyfill () {
    if (!('KeyboardEvent' in window) ||
        'key' in KeyboardEvent.prototype) {
      return false;
    }

    // Polyfill `key` on `KeyboardEvent`.
    var proto = {
      get: function (x) {
        var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];

        if (Array.isArray(key)) {
          key = key[+this.shiftKey];
        }

        return key;
      }
    };
    Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
    return proto;
  }

  if (typeof define === 'function' && define.amd) {
    define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = keyboardeventKeyPolyfill;
  } else if (window) {
    window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
  }

})();
/* UMD.define */ (function (root, factory) {
	if (typeof customLoader === 'function'){ customLoader(factory, 'on'); }else if (typeof define === 'function' && define.amd){ define([], factory); }else if(typeof exports === 'object'){ module.exports = factory(); }else{ root.returnExports = factory(); window.on = factory(); }
}(this, function () {
	// `on` is a simple library for attaching events to nodes. Its primary feature
	// is it returns a handle, from which you can pause, resume and remove the
	// event. Handles are much easier to manipulate than using removeEventListener
	// and recreating (sometimes complex or recursive) function signatures.
	//
	// `on` is touch-friendly and will normalize touch events.
	//
	// `on` also supports a custom `clickoff` event, to detect if you've clicked
	// anywhere in the document other than the passed node
	//
	// USAGE
	//      var handle = on(node, 'clickoff', callback);
	//      //  callback fires if something other than node is clicked
	//
	// USAGE
	//      var handle = on(node, 'mousedown', onStart);
	//      handle.pause();
	//      handle.resume();
	//      handle.remove();
	//
	//  `on` also supports multiple event types at once. The following example is
	//  useful for handling both desktop mouseovers and tablet clicks:
	//
	// USAGE
	//      var handle = on(node, 'mouseover,click', onStart);
	//
	// `on` supports selector filters. The targeted element will be in the event
	// as filteredTarget
	//
	// USAGE
	//      on(node, 'click', 'div.tab span', callback);
	//

	'use strict';

	// v1.7.5

	try{
		if (typeof require === 'function') {
			require('keyboardevent-key-polyfill');
		} else {
			window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
		}
	}catch(e){
		console.error('on/src/key-poly is required for the event.key property');
	}

	function hasWheelTest(){
		var
			isIE = navigator.userAgent.indexOf('Trident') > -1,
			div = document.createElement('div');
		return  "onwheel" in div || "wheel" in div ||
			(isIE && document.implementation.hasFeature("Events.wheel", "3.0")); // IE feature detection
	}

	var
		INVALID_PROPS,
		matches,
		hasWheel = hasWheelTest(),
		isWin = navigator.userAgent.indexOf('Windows')>-1,
		FACTOR = isWin ? 10 : 0.1,
		XLR8 = 0,
		mouseWheelHandle;


	['matches', 'matchesSelector', 'webkit', 'moz', 'ms', 'o'].some(function (name) {
		if (name.length < 7) { // prefix
			name += 'MatchesSelector';
		}
		if (Element.prototype[name]) {
			matches = name;
			return true;
		}
		return false;
	});

	function closest (element, selector, parent) {
		while (element) {
			if (element[matches] && element[matches](selector)) {
				return element;
			}
			if (element === parent) {
				break;
			}
			element = element.parentElement;
		}
		return null;
	}

	function closestFilter (element, selector) {
		return function (e) {
			return closest(e.target, selector, element);
		};
	}

	function makeMultiHandle (handles){
		return {
			remove: function(){
				handles.forEach(function(h){
					// allow for a simple function in the list
					if(h.remove) {
						h.remove();
					}else if(typeof h === 'function'){
						h();
					}
				});
				handles = [];
				this.remove = this.pause = this.resume = function(){};
			},
			pause: function(){
				handles.forEach(function(h){ if(h.pause){ h.pause(); }});
			},
			resume: function(){
				handles.forEach(function(h){ if(h.resume){ h.resume(); }});
			}
		};
	}

	function onClickoff (node, callback){
		// important note!
		// starts paused
		//
		var
			handle,
			bHandle = on(document.body, 'click', function(event){
				var target = event.target;
				if(target.nodeType !== 1){
					target = target.parentNode;
				}
				if(target && !node.contains(target)) {
					callback(event);
				}
			});

		handle = {
			resume: function () {
				setTimeout(function () {
					bHandle.resume();
				}, 100);
			},
			pause: function () {
				bHandle.pause();
			},
			remove: function () {
				bHandle.remove();
			}
		};

		handle.pause();

		return handle;
	}

	function onImageLoad (img, callback) {
		function onImageLoad (e) {
				var h = setInterval(function () {
					if(img.naturalWidth){
						e.width = img.naturalWidth;
						e.naturalWidth = img.naturalWidth;
						e.height = img.naturalHeight;
						e.naturalHeight = img.naturalHeight;
						callback(e);
						clearInterval(h);
					}
				}, 100);
			img.removeEventListener('load', onImageLoad);
			img.removeEventListener('error', callback);
		}
		img.addEventListener('load', onImageLoad);
		img.addEventListener('error', callback);
		return {
			pause: function () {},
			resume: function () {},
			remove: function () {
				img.removeEventListener('load', onImageLoad);
				img.removeEventListener('error', callback);
			}
		}
	}

	function getNode(str){
		if(typeof str !== 'string'){
			return str;
		}
		var node;
		if(/\#|\.|\s/.test(str)){
			node = document.body.querySelector(str);
		}else{
			node = document.getElementById(str);
		}
		if(!node){
			console.error('localLib/on Could not find:', str);
		}
		return node;
	}

	function normalizeWheelEvent (callback){
		// normalizes all browsers' events to a standard:
		// delta, wheelY, wheelX
		// also adds acceleration and deceleration to make
		// Mac and Windows behave similarly
		return function(e){
			XLR8 += FACTOR;
			var
				deltaY = Math.max(-1, Math.min(1, (e.wheelDeltaY || e.deltaY))),
				deltaX = Math.max(-10, Math.min(10, (e.wheelDeltaX || e.deltaX)));

			deltaY = deltaY <= 0 ? deltaY - XLR8 : deltaY + XLR8;

			e.delta = deltaY;
			e.wheelY = deltaY;
			e.wheelX = deltaX;

			clearTimeout(mouseWheelHandle);
			mouseWheelHandle = setTimeout(function(){
				XLR8 = 0;
			}, 300);
			callback(e);
		};
	}

	function on (node, eventType, filter, handler){
		//  USAGE
		//      var handle = on(this.node, 'mousedown', this, 'onStart');
		//      handle.pause();
		//      handle.resume();
		//      handle.remove();
		//
		var
			callback,
			handles,
			handle;

		if(/,/.test(eventType)){
			// handle multiple event types, like:
			// on(node, 'mouseup, mousedown', callback);
			//
			handles = [];
			eventType.split(',').forEach(function(eStr){
				handles.push(on(node, eStr.trim(), filter, handler));
			});
			return makeMultiHandle(handles);
		}

		node = getNode(node);

		if(filter && handler){
			if (typeof filter == 'string') {
				filter = closestFilter(node, filter);
			}
			// else it is a custom function
			callback = function (e) {
				var result = filter(e);
				if (result) {
					e.filteredTarget = result;
					handler(e, result);
				}
			};
		}else{
			callback = filter || handler;
		}

		if(eventType === 'clickoff'){
			// custom - used for popups 'n stuff
			return onClickoff(node, callback);
		}

		if (eventType === 'load' && node.localName === 'img'){
			return onImageLoad(node, callback);
		}

		if(eventType === 'wheel'){
			// mousewheel events, natch
			if(hasWheel){
				// pass through, but first curry callback to wheel events
				callback = normalizeWheelEvent(callback);
			}else{
				// old Firefox, old IE, Chrome
				return makeMultiHandle([
					on(node, 'DOMMouseScroll', normalizeWheelEvent(callback)),
					on(node, 'mousewheel', normalizeWheelEvent(callback))
				]);
			}
		}

		node.addEventListener(eventType, callback, false);

		handle = {
			remove: function() {
				node.removeEventListener(eventType, callback, false);
				node = callback = null;
				this.remove = this.pause = this.resume = function(){};
			},
			pause: function(){
				node.removeEventListener(eventType, callback, false);
			},
			resume: function(){
				node.addEventListener(eventType, callback, false);
			}
		};

		return handle;
	}

	on.once = function (node, eventType, filter, callback){
		var h;
		if(filter && callback){
			h = on(node, eventType, filter, function () {
				callback.apply(window, arguments);
				h.remove();
			});
		}else{
			h = on(node, eventType, function () {
				filter.apply(window, arguments);
				h.remove();
			});
		}
		return h;
	};

	INVALID_PROPS = {
		isTrusted:1
	};
	function mix(object, value){
		if(!value){
			return object;
		}
		if(typeof value === 'object') {
			Object.keys(value).forEach(function (key) {
				if(!INVALID_PROPS[key]) {
					object[key] = value[key];
				}
			});
		}else{
			object.value = value;
		}
		return object;
	}

	on.emit = function (node, eventName, value) {
		node = getNode(node);
		var event = document.createEvent('HTMLEvents');
		event.initEvent(eventName, true, true); // event type, bubbling, cancelable
		return node.dispatchEvent(mix(event, value));
	};

	on.fire = function (node, eventName, eventDetail, bubbles) {
		var event = document.createEvent('CustomEvent');
		event.initCustomEvent(eventName, !!bubbles, true, eventDetail); // event type, bubbling, cancelable
		return node.dispatchEvent(event);
	};

	on.isAlphaNumeric = function (str) {
		if(str.length > 1){ return false; }
		if(str === ' '){ return false; }
		if(!isNaN(Number(str))){ return true; }
		var code = str.toLowerCase().charCodeAt(0);
		return code >= 97 && code <= 122;
	};

	on.makeMultiHandle = makeMultiHandle;
	on.closest = closest;
	on.matches = matches;

	return on;

}));

},{"keyboardevent-key-polyfill":"keyboardevent-key-polyfill"}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkb20iLCJrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCIsIm9uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogVU1ELmRlZmluZSAqLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGN1c3RvbUxvYWRlciA9PT0gJ2Z1bmN0aW9uJyl7IGN1c3RvbUxvYWRlcihmYWN0b3J5LCAnZG9tJyk7IH1lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHsgZGVmaW5lKFtdLCBmYWN0b3J5KTsgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHsgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7IH0gZWxzZSB7IHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTsgd2luZG93LmRvbSA9IGZhY3RvcnkoKTsgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gIGNvbnZlbmllbmNlIGxpYnJhcnkgZm9yIGNvbW1vbiBET00gbWV0aG9kc1xuICAgIC8vICAgICAgZG9tKClcbiAgICAvLyAgICAgICAgICBjcmVhdGUgZG9tIG5vZGVzXG4gICAgLy8gICAgICBkb20uc3R5bGUoKVxuICAgIC8vICAgICAgICAgIHNldC9nZXQgbm9kZSBzdHlsZVxuICAgIC8vICAgICAgZG9tLmF0dHIoKVxuICAgIC8vICAgICAgICAgIHNldC9nZXQgYXR0cmlidXRlc1xuICAgIC8vICAgICAgZG9tLmRlc3Ryb3koKVxuICAgIC8vICAgICAgICAgIG9ibGl0ZXJhdGVzIGEgbm9kZVxuICAgIC8vICAgICAgZG9tLmJveCgpXG4gICAgLy8gICAgICAgICAgZ2V0IG5vZGUgZGltZW5zaW9uc1xuICAgIC8vICAgICAgZG9tLnVpZCgpXG4gICAgLy8gICAgICAgICAgZ2V0IGEgdW5pcXVlIElEIChub3QgZG9tIHNwZWNpZmljKVxuICAgIC8vXG4gICAgdmFyXG4gICAgICAgIGlzRmxvYXQgPSB7XG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgekluZGV4OiAxLFxuICAgICAgICAgICAgJ3otaW5kZXgnOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGlzRGltZW5zaW9uID0ge1xuICAgICAgICAgICAgd2lkdGg6MSxcbiAgICAgICAgICAgIGhlaWdodDoxLFxuICAgICAgICAgICAgdG9wOjEsXG4gICAgICAgICAgICBsZWZ0OjEsXG4gICAgICAgICAgICByaWdodDoxLFxuICAgICAgICAgICAgYm90dG9tOjEsXG4gICAgICAgICAgICBtYXhXaWR0aDoxLFxuICAgICAgICAgICAgJ21heC13aWR0aCc6MSxcbiAgICAgICAgICAgIG1pbldpZHRoOjEsXG4gICAgICAgICAgICAnbWluLXdpZHRoJzoxLFxuICAgICAgICAgICAgbWF4SGVpZ2h0OjEsXG4gICAgICAgICAgICAnbWF4LWhlaWdodCc6MVxuICAgICAgICB9LFxuICAgICAgICB1aWRzID0ge30sXG4gICAgICAgIGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgZnVuY3Rpb24gdWlkICh0eXBlKXtcbiAgICAgICAgaWYoIXVpZHNbdHlwZV0pe1xuICAgICAgICAgICAgdWlkc1t0eXBlXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZCA9IHR5cGUgKyAnLScgKyAodWlkc1t0eXBlXS5sZW5ndGggKyAxKTtcbiAgICAgICAgdWlkc1t0eXBlXS5wdXNoKGlkKTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTm9kZSAoaXRlbSl7XG4gICAgICAgIC8vIHNhZmVyIHRlc3QgZm9yIGN1c3RvbSBlbGVtZW50cyBpbiBGRiAod2l0aCB3YyBzaGltKVxuICAgICAgICByZXR1cm4gISFpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgaXRlbS5pbm5lckhUTUwgPT09ICdzdHJpbmcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE5vZGUgKGl0ZW0pe1xuXG4gICAgICAgIGlmKCFpdGVtKXsgcmV0dXJuIGl0ZW07IH1cbiAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkZS1qcXVlcnlpZnlcbiAgICAgICAgcmV0dXJuIGl0ZW0uZ2V0ID8gaXRlbS5nZXQoMCkgOlxuICAgICAgICAgICAgLy8gaXRlbSBpcyBhIGRvbSBub2RlXG4gICAgICAgICAgICBpdGVtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ5SWQgKGlkKXtcbiAgICAgICAgcmV0dXJuIGdldE5vZGUoaWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0eWxlIChub2RlLCBwcm9wLCB2YWx1ZSl7XG4gICAgICAgIC8vIGdldC9zZXQgbm9kZSBzdHlsZShzKVxuICAgICAgICAvLyAgICAgIHByb3A6IHN0cmluZyBvciBvYmplY3RcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIGtleSwgY29tcHV0ZWQ7XG4gICAgICAgIGlmKHR5cGVvZiBwcm9wID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAvLyBvYmplY3Qgc2V0dGVyXG4gICAgICAgICAgICBmb3Ioa2V5IGluIHByb3Ape1xuICAgICAgICAgICAgICAgIGlmKHByb3AuaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlKG5vZGUsIGtleSwgcHJvcFtrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfWVsc2UgaWYodmFsdWUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBzZXR0ZXJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNEaW1lbnNpb25bcHJvcF0pe1xuICAgICAgICAgICAgICAgIHZhbHVlICs9ICdweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlLnN0eWxlW3Byb3BdID0gdmFsdWU7XG5cbiAgICAgICAgICAgIGlmKHByb3AgPT09ICd1c2VyU2VsZWN0Jyl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAhIXZhbHVlID8gJ3RleHQnIDogJ25vbmUnO1xuICAgICAgICAgICAgICAgIHN0eWxlKG5vZGUsIHtcbiAgICAgICAgICAgICAgICAgICAgd2Via2l0VG91Y2hDYWxsb3V0OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgd2Via2l0VXNlclNlbGVjdDogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGtodG1sVXNlclNlbGVjdDogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG1velVzZXJTZWxlY3Q6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBtc1VzZXJTZWxlY3Q6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXR0ZXIsIGlmIGEgc2ltcGxlIHN0eWxlXG4gICAgICAgIGlmKG5vZGUuc3R5bGVbcHJvcF0pe1xuICAgICAgICAgICAgaWYoaXNEaW1lbnNpb25bcHJvcF0pe1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChub2RlLnN0eWxlW3Byb3BdLCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihpc0Zsb2F0W3Byb3BdKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChub2RlLnN0eWxlW3Byb3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlLnN0eWxlW3Byb3BdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0dGVyLCBjb21wdXRlZFxuICAgICAgICBjb21wdXRlZCA9IGdldENvbXB1dGVkU3R5bGUobm9kZSwgcHJvcCk7XG4gICAgICAgIGlmKGNvbXB1dGVkW3Byb3BdKXtcbiAgICAgICAgICAgIGlmKC9cXGQvLnRlc3QoY29tcHV0ZWRbcHJvcF0pKXtcbiAgICAgICAgICAgICAgICBpZighaXNOYU4ocGFyc2VJbnQoY29tcHV0ZWRbcHJvcF0sIDEwKSkpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoY29tcHV0ZWRbcHJvcF0sIDEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXB1dGVkW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbXB1dGVkW3Byb3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhdHRyIChub2RlLCBwcm9wLCB2YWx1ZSl7XG4gICAgICAgIC8vIGdldC9zZXQgbm9kZSBhdHRyaWJ1dGUocylcbiAgICAgICAgLy8gICAgICBwcm9wOiBzdHJpbmcgb3Igb2JqZWN0XG4gICAgICAgIC8vXG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIGlmKHR5cGVvZiBwcm9wID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICBmb3Ioa2V5IGluIHByb3Ape1xuICAgICAgICAgICAgICAgIGlmKHByb3AuaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIobm9kZSwga2V5LCBwcm9wW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodmFsdWUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBpZihwcm9wID09PSAndGV4dCcgfHwgcHJvcCA9PT0gJ2h0bWwnIHx8IHByb3AgPT09ICdpbm5lckhUTUwnKXtcbiAgICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUocHJvcCwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKHByb3ApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJveCAobm9kZSl7XG4gICAgICAgIGlmKG5vZGUgPT09IHdpbmRvdyl7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vZGUgZGltZW5zaW9uc1xuICAgICAgICAvLyByZXR1cm5lZCBvYmplY3QgaXMgaW1tdXRhYmxlXG4gICAgICAgIC8vIGFkZCBzY3JvbGwgcG9zaXRpb25pbmcgYW5kIGNvbnZlbmllbmNlIGFiYnJldmlhdGlvbnNcbiAgICAgICAgdmFyXG4gICAgICAgICAgICBkaW1lbnNpb25zID0gZ2V0Tm9kZShub2RlKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogZGltZW5zaW9ucy50b3AsXG4gICAgICAgICAgICByaWdodDogZGltZW5zaW9ucy5yaWdodCxcbiAgICAgICAgICAgIGJvdHRvbTogZGltZW5zaW9ucy5ib3R0b20sXG4gICAgICAgICAgICBsZWZ0OiBkaW1lbnNpb25zLmxlZnQsXG4gICAgICAgICAgICBoZWlnaHQ6IGRpbWVuc2lvbnMuaGVpZ2h0LFxuICAgICAgICAgICAgaDogZGltZW5zaW9ucy5oZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogZGltZW5zaW9ucy53aWR0aCxcbiAgICAgICAgICAgIHc6IGRpbWVuc2lvbnMud2lkdGgsXG4gICAgICAgICAgICBzY3JvbGxZOiB3aW5kb3cuc2Nyb2xsWSxcbiAgICAgICAgICAgIHNjcm9sbFg6IHdpbmRvdy5zY3JvbGxYLFxuICAgICAgICAgICAgeDogZGltZW5zaW9ucy5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0LFxuICAgICAgICAgICAgeTogZGltZW5zaW9ucy50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxdWVyeSAobm9kZSwgc2VsZWN0b3Ipe1xuICAgICAgICBpZighc2VsZWN0b3Ipe1xuICAgICAgICAgICAgc2VsZWN0b3IgPSBub2RlO1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBxdWVyeUFsbCAobm9kZSwgc2VsZWN0b3Ipe1xuICAgICAgICBpZighc2VsZWN0b3Ipe1xuICAgICAgICAgICAgc2VsZWN0b3IgPSBub2RlO1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50O1xuICAgICAgICB9XG4gICAgICAgIHZhciBub2RlcyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgICAgICAgaWYoIW5vZGVzLmxlbmd0aCl7IHJldHVybiBbXTsgfVxuXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gQXJyYXkgYW5kIHJldHVybiBpdFxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvRG9tIChodG1sLCBvcHRpb25zLCBwYXJlbnQpe1xuICAgICAgICAvLyBjcmVhdGUgYSBub2RlIGZyb20gYW4gSFRNTCBzdHJpbmdcbiAgICAgICAgdmFyIG5vZGUgPSBkb20oJ2RpdicsIHtodG1sOiBodG1sfSk7XG4gICAgICAgIHBhcmVudCA9IGJ5SWQocGFyZW50IHx8IG9wdGlvbnMpO1xuICAgICAgICBpZihwYXJlbnQpe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5maXJzdENoaWxkKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYoaHRtbC5pbmRleE9mKCc8JykgIT09IDApe1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tRG9tIChub2RlKSB7XG4gICAgICAgIGZ1bmN0aW9uIGdldEF0dHJzIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgYXR0LCBpLCBhdHRycyA9IHt9O1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBhdHQgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgYXR0cnNbYXR0LmxvY2FsTmFtZV0gPSBub3JtYWxpemUoYXR0LnZhbHVlID09PSAnJyA/IHRydWUgOiBhdHQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF0dHJzO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFRleHQgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBpLCB0LCB0ZXh0ID0gJyc7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHQgPSBub2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgaWYodC5ub2RlVHlwZSA9PT0gMyAmJiB0LnRleHRDb250ZW50LnRyaW0oKSl7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gdC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGksIG9iamVjdCA9IGdldEF0dHJzKG5vZGUpO1xuICAgICAgICBvYmplY3QudGV4dCA9IGdldFRleHQobm9kZSk7XG4gICAgICAgIG9iamVjdC5jaGlsZHJlbiA9IFtdO1xuICAgICAgICBpZihub2RlLmNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBvYmplY3QuY2hpbGRyZW4ucHVzaChmcm9tRG9tKG5vZGUuY2hpbGRyZW5baV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZENoaWxkcmVuIChub2RlLCBjaGlsZHJlbikge1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGNoaWxkcmVuKSl7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZENvbnRlbnQgKG5vZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGh0bWw7XG4gICAgICAgIGlmKG9wdGlvbnMuaHRtbCAhPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuaW5uZXJIVE1MICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgaHRtbCA9IG9wdGlvbnMuaHRtbCB8fCBvcHRpb25zLmlubmVySFRNTCB8fCAnJztcbiAgICAgICAgICAgIGlmKHR5cGVvZiBodG1sID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAgICAgYWRkQ2hpbGRyZW4obm9kZSwgaHRtbCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG1pc3NlcyBzb21lIEhUTUwsIHN1Y2ggYXMgZW50aXRpZXMgKCZucHNwOylcbiAgICAgICAgICAgIC8vZWxzZSBpZihodG1sLmluZGV4T2YoJzwnKSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gICAgbm9kZS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAvL2Vsc2V7XG4gICAgICAgICAgICAvLyAgICBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGh0bWwpKTtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICB9XG4gICAgICAgIGlmKG9wdGlvbnMudGV4dCl7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG9wdGlvbnMudGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9wdGlvbnMuY2hpbGRyZW4pe1xuICAgICAgICAgICAgYWRkQ2hpbGRyZW4obm9kZSwgb3B0aW9ucy5jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZG9tIChub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50LCBwcmVwZW5kKXtcbiAgICAgICAgLy8gY3JlYXRlIGEgbm9kZVxuICAgICAgICAvLyBpZiBmaXJzdCBhcmd1bWVudCBpcyBhIHN0cmluZyBhbmQgc3RhcnRzIHdpdGggPCwgaXQgaXMgYXNzdW1lZFxuICAgICAgICAvLyB0byB1c2UgdG9Eb20sIGFuZCBjcmVhdGVzIGEgbm9kZSBmcm9tIEhUTUwuIE9wdGlvbmFsIHNlY29uZCBhcmcgaXNcbiAgICAgICAgLy8gcGFyZW50IHRvIGFwcGVuZCB0b1xuICAgICAgICAvLyBlbHNlOlxuICAgICAgICAvLyAgICAgIG5vZGVUeXBlOiBzdHJpbmcsIHR5cGUgb2Ygbm9kZSB0byBjcmVhdGVcbiAgICAgICAgLy8gICAgICBvcHRpb25zOiBvYmplY3Qgd2l0aCBzdHlsZSwgY2xhc3NOYW1lLCBvciBhdHRyIHByb3BlcnRpZXNcbiAgICAgICAgLy8gICAgICAgICAgKGNhbiBhbHNvIGJlIG9iamVjdHMpXG4gICAgICAgIC8vICAgICAgcGFyZW50OiBOb2RlLCBvcHRpb25hbCBub2RlIHRvIGFwcGVuZCB0b1xuICAgICAgICAvLyAgICAgIHByZXBlbmQ6IHRydXRoeSwgdG8gYXBwZW5kIG5vZGUgYXMgdGhlIGZpcnN0IGNoaWxkXG4gICAgICAgIC8vXG4gICAgICAgIGlmKG5vZGVUeXBlLmluZGV4T2YoJzwnKSA9PT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gdG9Eb20obm9kZVR5cGUsIG9wdGlvbnMsIHBhcmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdmFyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBvcHRpb25zLmNzcyB8fCBvcHRpb25zLmNsYXNzTmFtZSB8fCBvcHRpb25zLmNsYXNzLFxuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZVR5cGUpO1xuXG4gICAgICAgIHBhcmVudCA9IGdldE5vZGUocGFyZW50KTtcblxuICAgICAgICBpZihjbGFzc05hbWUpe1xuICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGFkZENvbnRlbnQobm9kZSwgb3B0aW9ucyk7XG4gICAgICAgIFxuICAgICAgICBpZihvcHRpb25zLmNzc1RleHQpe1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gb3B0aW9ucy5jc3NUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYob3B0aW9ucy5pZCl7XG4gICAgICAgICAgICBub2RlLmlkID0gb3B0aW9ucy5pZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG9wdGlvbnMuc3R5bGUpe1xuICAgICAgICAgICAgc3R5bGUobm9kZSwgb3B0aW9ucy5zdHlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zLmF0dHIpe1xuICAgICAgICAgICAgYXR0cihub2RlLCBvcHRpb25zLmF0dHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYocGFyZW50ICYmIGlzTm9kZShwYXJlbnQpKXtcbiAgICAgICAgICAgIGlmKHByZXBlbmQgJiYgcGFyZW50Lmhhc0NoaWxkTm9kZXMoKSl7XG4gICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TmV4dFNpYmxpbmcgKG5vZGUpIHtcbiAgICAgICAgdmFyIHNpYmxpbmcgPSBub2RlO1xuICAgICAgICB3aGlsZShzaWJsaW5nKXtcbiAgICAgICAgICAgIHNpYmxpbmcgPSBzaWJsaW5nLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgaWYoc2libGluZyAmJiBzaWJsaW5nLm5vZGVUeXBlID09PSAxKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnNlcnRBZnRlciAocmVmTm9kZSwgbm9kZSkge1xuICAgICAgICB2YXIgc2libGluZyA9IGdldE5leHRTaWJsaW5nKHJlZk5vZGUpO1xuICAgICAgICBpZighc2libGluZyl7XG4gICAgICAgICAgICByZWZOb2RlLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmVmTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBzaWJsaW5nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2libGluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95IChub2RlKXtcbiAgICAgICAgLy8gZGVzdHJveXMgYSBub2RlIGNvbXBsZXRlbHlcbiAgICAgICAgLy9cbiAgICAgICAgaWYobm9kZSkge1xuICAgICAgICAgICAgZGVzdHJveWVyLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgZGVzdHJveWVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW4gKG5vZGUsIGRpc3Bvc2Upe1xuICAgICAgICAvL1x0UmVtb3ZlcyBhbGwgY2hpbGQgbm9kZXNcbiAgICAgICAgLy9cdFx0ZGlzcG9zZTogZGVzdHJveSBjaGlsZCBub2Rlc1xuICAgICAgICBpZihkaXNwb3NlKXtcbiAgICAgICAgICAgIHdoaWxlKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBkZXN0cm95KG5vZGUuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhbmNlc3RvciAobm9kZSwgc2VsZWN0b3Ipe1xuICAgICAgICAvLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCAnY2xvc2VzdCcgYW5kICdtYXRjaGVzJ1xuICAgICAgICAvLyBnZXRzIHRoZSBhbmNlc3RvciBvZiBub2RlIGJhc2VkIG9uIHNlbGVjdG9yIGNyaXRlcmlhXG4gICAgICAgIC8vIHVzZWZ1bCBmb3IgZ2V0dGluZyB0aGUgdGFyZ2V0IG5vZGUgd2hlbiBhIGNoaWxkIG5vZGUgaXMgY2xpY2tlZCB1cG9uXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFVTQUdFXG4gICAgICAgIC8vICAgICAgb24uc2VsZWN0b3IoY2hpbGROb2RlLCAnLmFwcC5hY3RpdmUnKTtcbiAgICAgICAgLy8gICAgICBvbi5zZWxlY3RvcihjaGlsZE5vZGUsICcjdGhpbmdlcicpO1xuICAgICAgICAvLyAgICAgIG9uLnNlbGVjdG9yKGNoaWxkTm9kZSwgJ2RpdicpO1xuICAgICAgICAvL1x0RE9FUyBOT1QgU1VQUE9SVDpcbiAgICAgICAgLy9cdFx0Y29tYmluYXRpb25zIG9mIGFib3ZlXG4gICAgICAgIHZhclxuICAgICAgICAgICAgdGVzdCxcbiAgICAgICAgICAgIHBhcmVudCA9IG5vZGU7XG5cbiAgICAgICAgaWYoc2VsZWN0b3IuaW5kZXhPZignLicpID09PSAwKXtcbiAgICAgICAgICAgIC8vIGNsYXNzTmFtZVxuICAgICAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKCcuJywgJyAnKS50cmltKCk7XG4gICAgICAgICAgICB0ZXN0ID0gZnVuY3Rpb24obil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4uY2xhc3NMaXN0LmNvbnRhaW5zKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihzZWxlY3Rvci5pbmRleE9mKCcjJykgPT09IDApe1xuICAgICAgICAgICAgLy8gbm9kZSBpZFxuICAgICAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKCcjJywgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIHRlc3QgPSBmdW5jdGlvbihuKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbi5pZCA9PT0gc2VsZWN0b3I7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZignWycpID4gLTEpe1xuICAgICAgICAgICAgLy8gYXR0cmlidXRlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdhdHRyaWJ1dGUgc2VsZWN0b3JzIGFyZSBub3QgeWV0IHN1cHBvcnRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICAvLyBhc3N1bWluZyBub2RlIG5hbWVcbiAgICAgICAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIHRlc3QgPSBmdW5jdGlvbihuKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbi5ub2RlTmFtZSA9PT0gc2VsZWN0b3I7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUocGFyZW50KXtcbiAgICAgICAgICAgIGlmKHBhcmVudCA9PT0gZG9jdW1lbnQuYm9keSB8fCBwYXJlbnQgPT09IGRvY3VtZW50KXsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgICAgICBpZih0ZXN0KHBhcmVudCkpeyBicmVhazsgfVxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgIH1cblxuICAgIGRvbS5jbGFzc0xpc3QgPSB7XG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKG5vZGUsIG5hbWVzKXtcbiAgICAgICAgICAgIHRvQXJyYXkobmFtZXMpLmZvckVhY2goZnVuY3Rpb24obmFtZSl7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKG5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGFkZDogZnVuY3Rpb24gKG5vZGUsIG5hbWVzKXtcbiAgICAgICAgICAgIHRvQXJyYXkobmFtZXMpLmZvckVhY2goZnVuY3Rpb24obmFtZSl7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgcmV0dXJuIHRvQXJyYXkobmFtZXMpLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRvZ2dsZTogZnVuY3Rpb24gKG5vZGUsIG5hbWVzLCB2YWx1ZSl7XG4gICAgICAgICAgICBuYW1lcyA9IHRvQXJyYXkobmFtZXMpO1xuICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIC8vIHVzZSBzdGFuZGFyZCBmdW5jdGlvbmFsaXR5LCBzdXBwb3J0ZWQgYnkgSUVcbiAgICAgICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LnRvZ2dsZShuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgdGhlIHNlY29uZCBwYXJhbWV0ZXIgIFxuICAgICAgICAgICAgZWxzZSBpZih2YWx1ZSl7XG4gICAgICAgICAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHRvQXJyYXkgKG5hbWVzKXtcbiAgICAgICAgaWYoIW5hbWVzKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2RvbS5jbGFzc0xpc3Qgc2hvdWxkIGluY2x1ZGUgYSBub2RlIGFuZCBhIGNsYXNzTmFtZScpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lcy5zcGxpdCgnICcpLm1hcChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWUudHJpbSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgZG9tLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApO1xuICAgICAgICB9O1xuICAgIH1lbHNle1xuICAgICAgICBkb20ucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2Ipe1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjYik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZSAodmFsKXtcbiAgICAgICAgaWYodmFsID09PSAnZmFsc2UnKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfWVsc2UgaWYodmFsID09PSAndHJ1ZScpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWlzTmFOKHBhcnNlRmxvYXQodmFsKSkpe1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIGRvbS5ub3JtYWxpemUgPSBub3JtYWxpemU7XG4gICAgZG9tLmNsZWFuID0gY2xlYW47XG4gICAgZG9tLnF1ZXJ5ID0gcXVlcnk7XG4gICAgZG9tLnF1ZXJ5QWxsID0gcXVlcnlBbGw7XG4gICAgZG9tLmJ5SWQgPSBieUlkO1xuICAgIGRvbS5hdHRyID0gYXR0cjtcbiAgICBkb20uYm94ID0gYm94O1xuICAgIGRvbS5zdHlsZSA9IHN0eWxlO1xuICAgIGRvbS5kZXN0cm95ID0gZGVzdHJveTtcbiAgICBkb20udWlkID0gdWlkO1xuICAgIGRvbS5pc05vZGUgPSBpc05vZGU7XG4gICAgZG9tLmFuY2VzdG9yID0gYW5jZXN0b3I7XG4gICAgZG9tLnRvRG9tID0gdG9Eb207XG4gICAgZG9tLmZyb21Eb20gPSBmcm9tRG9tO1xuICAgIGRvbS5pbnNlcnRBZnRlciA9IGluc2VydEFmdGVyO1xuICAgIGRvbS5nZXROZXh0U2libGluZyA9IGdldE5leHRTaWJsaW5nO1xuXG4gICAgcmV0dXJuIGRvbTtcbn0pKTtcbiIsIi8qIGdsb2JhbCBkZWZpbmUsIEtleWJvYXJkRXZlbnQsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSB7XG4gICAgcG9seWZpbGw6IHBvbHlmaWxsLFxuICAgIGtleXM6IHtcbiAgICAgIDM6ICdDYW5jZWwnLFxuICAgICAgNjogJ0hlbHAnLFxuICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICA5OiAnVGFiJyxcbiAgICAgIDEyOiAnQ2xlYXInLFxuICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAxNjogJ1NoaWZ0JyxcbiAgICAgIDE3OiAnQ29udHJvbCcsXG4gICAgICAxODogJ0FsdCcsXG4gICAgICAxOTogJ1BhdXNlJyxcbiAgICAgIDIwOiAnQ2Fwc0xvY2snLFxuICAgICAgMjc6ICdFc2NhcGUnLFxuICAgICAgMjg6ICdDb252ZXJ0JyxcbiAgICAgIDI5OiAnTm9uQ29udmVydCcsXG4gICAgICAzMDogJ0FjY2VwdCcsXG4gICAgICAzMTogJ01vZGVDaGFuZ2UnLFxuICAgICAgMzI6ICcgJyxcbiAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgIDM0OiAnUGFnZURvd24nLFxuICAgICAgMzU6ICdFbmQnLFxuICAgICAgMzY6ICdIb21lJyxcbiAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgNDE6ICdTZWxlY3QnLFxuICAgICAgNDI6ICdQcmludCcsXG4gICAgICA0MzogJ0V4ZWN1dGUnLFxuICAgICAgNDQ6ICdQcmludFNjcmVlbicsXG4gICAgICA0NTogJ0luc2VydCcsXG4gICAgICA0NjogJ0RlbGV0ZScsXG4gICAgICA0ODogWycwJywgJyknXSxcbiAgICAgIDQ5OiBbJzEnLCAnISddLFxuICAgICAgNTA6IFsnMicsICdAJ10sXG4gICAgICA1MTogWyczJywgJyMnXSxcbiAgICAgIDUyOiBbJzQnLCAnJCddLFxuICAgICAgNTM6IFsnNScsICclJ10sXG4gICAgICA1NDogWyc2JywgJ14nXSxcbiAgICAgIDU1OiBbJzcnLCAnJiddLFxuICAgICAgNTY6IFsnOCcsICcqJ10sXG4gICAgICA1NzogWyc5JywgJygnXSxcbiAgICAgIDkxOiAnT1MnLFxuICAgICAgOTM6ICdDb250ZXh0TWVudScsXG4gICAgICAxNDQ6ICdOdW1Mb2NrJyxcbiAgICAgIDE0NTogJ1Njcm9sbExvY2snLFxuICAgICAgMTgxOiAnVm9sdW1lTXV0ZScsXG4gICAgICAxODI6ICdWb2x1bWVEb3duJyxcbiAgICAgIDE4MzogJ1ZvbHVtZVVwJyxcbiAgICAgIDE4NjogWyc7JywgJzonXSxcbiAgICAgIDE4NzogWyc9JywgJysnXSxcbiAgICAgIDE4ODogWycsJywgJzwnXSxcbiAgICAgIDE4OTogWyctJywgJ18nXSxcbiAgICAgIDE5MDogWycuJywgJz4nXSxcbiAgICAgIDE5MTogWycvJywgJz8nXSxcbiAgICAgIDE5MjogWydgJywgJ34nXSxcbiAgICAgIDIxOTogWydbJywgJ3snXSxcbiAgICAgIDIyMDogWydcXFxcJywgJ3wnXSxcbiAgICAgIDIyMTogWyddJywgJ30nXSxcbiAgICAgIDIyMjogW1wiJ1wiLCAnXCInXSxcbiAgICAgIDIyNDogJ01ldGEnLFxuICAgICAgMjI1OiAnQWx0R3JhcGgnLFxuICAgICAgMjQ2OiAnQXR0bicsXG4gICAgICAyNDc6ICdDclNlbCcsXG4gICAgICAyNDg6ICdFeFNlbCcsXG4gICAgICAyNDk6ICdFcmFzZUVvZicsXG4gICAgICAyNTA6ICdQbGF5JyxcbiAgICAgIDI1MTogJ1pvb21PdXQnXG4gICAgfVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIGtleXMgKEYxLTI0KS5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCAyNTsgaSsrKSB7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbMTExICsgaV0gPSAnRicgKyBpO1xuICB9XG5cbiAgLy8gUHJpbnRhYmxlIEFTQ0lJIGNoYXJhY3RlcnMuXG4gIHZhciBsZXR0ZXIgPSAnJztcbiAgZm9yIChpID0gNjU7IGkgPCA5MTsgaSsrKSB7XG4gICAgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1tpXSA9IFtsZXR0ZXIudG9Mb3dlckNhc2UoKSwgbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWZpbGwgKCkge1xuICAgIGlmICghKCdLZXlib2FyZEV2ZW50JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICdrZXknIGluIEtleWJvYXJkRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgYGtleWAgb24gYEtleWJvYXJkRXZlbnRgLlxuICAgIHZhciBwcm90byA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW3RoaXMud2hpY2ggfHwgdGhpcy5rZXlDb2RlXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5Wyt0aGlzLnNoaWZ0S2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm90byk7XG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnLCBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH1cblxufSkoKTtcbiIsIi8qIGdsb2JhbCBkZWZpbmUsIEtleWJvYXJkRXZlbnQsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSB7XG4gICAgcG9seWZpbGw6IHBvbHlmaWxsLFxuICAgIGtleXM6IHtcbiAgICAgIDM6ICdDYW5jZWwnLFxuICAgICAgNjogJ0hlbHAnLFxuICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICA5OiAnVGFiJyxcbiAgICAgIDEyOiAnQ2xlYXInLFxuICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAxNjogJ1NoaWZ0JyxcbiAgICAgIDE3OiAnQ29udHJvbCcsXG4gICAgICAxODogJ0FsdCcsXG4gICAgICAxOTogJ1BhdXNlJyxcbiAgICAgIDIwOiAnQ2Fwc0xvY2snLFxuICAgICAgMjc6ICdFc2NhcGUnLFxuICAgICAgMjg6ICdDb252ZXJ0JyxcbiAgICAgIDI5OiAnTm9uQ29udmVydCcsXG4gICAgICAzMDogJ0FjY2VwdCcsXG4gICAgICAzMTogJ01vZGVDaGFuZ2UnLFxuICAgICAgMzI6ICcgJyxcbiAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgIDM0OiAnUGFnZURvd24nLFxuICAgICAgMzU6ICdFbmQnLFxuICAgICAgMzY6ICdIb21lJyxcbiAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgNDE6ICdTZWxlY3QnLFxuICAgICAgNDI6ICdQcmludCcsXG4gICAgICA0MzogJ0V4ZWN1dGUnLFxuICAgICAgNDQ6ICdQcmludFNjcmVlbicsXG4gICAgICA0NTogJ0luc2VydCcsXG4gICAgICA0NjogJ0RlbGV0ZScsXG4gICAgICA0ODogWycwJywgJyknXSxcbiAgICAgIDQ5OiBbJzEnLCAnISddLFxuICAgICAgNTA6IFsnMicsICdAJ10sXG4gICAgICA1MTogWyczJywgJyMnXSxcbiAgICAgIDUyOiBbJzQnLCAnJCddLFxuICAgICAgNTM6IFsnNScsICclJ10sXG4gICAgICA1NDogWyc2JywgJ14nXSxcbiAgICAgIDU1OiBbJzcnLCAnJiddLFxuICAgICAgNTY6IFsnOCcsICcqJ10sXG4gICAgICA1NzogWyc5JywgJygnXSxcbiAgICAgIDkxOiAnT1MnLFxuICAgICAgOTM6ICdDb250ZXh0TWVudScsXG4gICAgICAxNDQ6ICdOdW1Mb2NrJyxcbiAgICAgIDE0NTogJ1Njcm9sbExvY2snLFxuICAgICAgMTgxOiAnVm9sdW1lTXV0ZScsXG4gICAgICAxODI6ICdWb2x1bWVEb3duJyxcbiAgICAgIDE4MzogJ1ZvbHVtZVVwJyxcbiAgICAgIDE4NjogWyc7JywgJzonXSxcbiAgICAgIDE4NzogWyc9JywgJysnXSxcbiAgICAgIDE4ODogWycsJywgJzwnXSxcbiAgICAgIDE4OTogWyctJywgJ18nXSxcbiAgICAgIDE5MDogWycuJywgJz4nXSxcbiAgICAgIDE5MTogWycvJywgJz8nXSxcbiAgICAgIDE5MjogWydgJywgJ34nXSxcbiAgICAgIDIxOTogWydbJywgJ3snXSxcbiAgICAgIDIyMDogWydcXFxcJywgJ3wnXSxcbiAgICAgIDIyMTogWyddJywgJ30nXSxcbiAgICAgIDIyMjogW1wiJ1wiLCAnXCInXSxcbiAgICAgIDIyNDogJ01ldGEnLFxuICAgICAgMjI1OiAnQWx0R3JhcGgnLFxuICAgICAgMjQ2OiAnQXR0bicsXG4gICAgICAyNDc6ICdDclNlbCcsXG4gICAgICAyNDg6ICdFeFNlbCcsXG4gICAgICAyNDk6ICdFcmFzZUVvZicsXG4gICAgICAyNTA6ICdQbGF5JyxcbiAgICAgIDI1MTogJ1pvb21PdXQnXG4gICAgfVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIGtleXMgKEYxLTI0KS5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCAyNTsgaSsrKSB7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbMTExICsgaV0gPSAnRicgKyBpO1xuICB9XG5cbiAgLy8gUHJpbnRhYmxlIEFTQ0lJIGNoYXJhY3RlcnMuXG4gIHZhciBsZXR0ZXIgPSAnJztcbiAgZm9yIChpID0gNjU7IGkgPCA5MTsgaSsrKSB7XG4gICAgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1tpXSA9IFtsZXR0ZXIudG9Mb3dlckNhc2UoKSwgbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWZpbGwgKCkge1xuICAgIGlmICghKCdLZXlib2FyZEV2ZW50JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICdrZXknIGluIEtleWJvYXJkRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgYGtleWAgb24gYEtleWJvYXJkRXZlbnRgLlxuICAgIHZhciBwcm90byA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW3RoaXMud2hpY2ggfHwgdGhpcy5rZXlDb2RlXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5Wyt0aGlzLnNoaWZ0S2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm90byk7XG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnLCBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH1cblxufSkoKTtcbi8qIFVNRC5kZWZpbmUgKi8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgY3VzdG9tTG9hZGVyID09PSAnZnVuY3Rpb24nKXsgY3VzdG9tTG9hZGVyKGZhY3RvcnksICdvbicpOyB9ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKXsgZGVmaW5lKFtdLCBmYWN0b3J5KTsgfWVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKXsgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7IH1lbHNleyByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7IHdpbmRvdy5vbiA9IGZhY3RvcnkoKTsgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdC8vIGBvbmAgaXMgYSBzaW1wbGUgbGlicmFyeSBmb3IgYXR0YWNoaW5nIGV2ZW50cyB0byBub2Rlcy4gSXRzIHByaW1hcnkgZmVhdHVyZVxuXHQvLyBpcyBpdCByZXR1cm5zIGEgaGFuZGxlLCBmcm9tIHdoaWNoIHlvdSBjYW4gcGF1c2UsIHJlc3VtZSBhbmQgcmVtb3ZlIHRoZVxuXHQvLyBldmVudC4gSGFuZGxlcyBhcmUgbXVjaCBlYXNpZXIgdG8gbWFuaXB1bGF0ZSB0aGFuIHVzaW5nIHJlbW92ZUV2ZW50TGlzdGVuZXJcblx0Ly8gYW5kIHJlY3JlYXRpbmcgKHNvbWV0aW1lcyBjb21wbGV4IG9yIHJlY3Vyc2l2ZSkgZnVuY3Rpb24gc2lnbmF0dXJlcy5cblx0Ly9cblx0Ly8gYG9uYCBpcyB0b3VjaC1mcmllbmRseSBhbmQgd2lsbCBub3JtYWxpemUgdG91Y2ggZXZlbnRzLlxuXHQvL1xuXHQvLyBgb25gIGFsc28gc3VwcG9ydHMgYSBjdXN0b20gYGNsaWNrb2ZmYCBldmVudCwgdG8gZGV0ZWN0IGlmIHlvdSd2ZSBjbGlja2VkXG5cdC8vIGFueXdoZXJlIGluIHRoZSBkb2N1bWVudCBvdGhlciB0aGFuIHRoZSBwYXNzZWQgbm9kZVxuXHQvL1xuXHQvLyBVU0FHRVxuXHQvLyAgICAgIHZhciBoYW5kbGUgPSBvbihub2RlLCAnY2xpY2tvZmYnLCBjYWxsYmFjayk7XG5cdC8vICAgICAgLy8gIGNhbGxiYWNrIGZpcmVzIGlmIHNvbWV0aGluZyBvdGhlciB0aGFuIG5vZGUgaXMgY2xpY2tlZFxuXHQvL1xuXHQvLyBVU0FHRVxuXHQvLyAgICAgIHZhciBoYW5kbGUgPSBvbihub2RlLCAnbW91c2Vkb3duJywgb25TdGFydCk7XG5cdC8vICAgICAgaGFuZGxlLnBhdXNlKCk7XG5cdC8vICAgICAgaGFuZGxlLnJlc3VtZSgpO1xuXHQvLyAgICAgIGhhbmRsZS5yZW1vdmUoKTtcblx0Ly9cblx0Ly8gIGBvbmAgYWxzbyBzdXBwb3J0cyBtdWx0aXBsZSBldmVudCB0eXBlcyBhdCBvbmNlLiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaXNcblx0Ly8gIHVzZWZ1bCBmb3IgaGFuZGxpbmcgYm90aCBkZXNrdG9wIG1vdXNlb3ZlcnMgYW5kIHRhYmxldCBjbGlja3M6XG5cdC8vXG5cdC8vIFVTQUdFXG5cdC8vICAgICAgdmFyIGhhbmRsZSA9IG9uKG5vZGUsICdtb3VzZW92ZXIsY2xpY2snLCBvblN0YXJ0KTtcblx0Ly9cblx0Ly8gYG9uYCBzdXBwb3J0cyBzZWxlY3RvciBmaWx0ZXJzLiBUaGUgdGFyZ2V0ZWQgZWxlbWVudCB3aWxsIGJlIGluIHRoZSBldmVudFxuXHQvLyBhcyBmaWx0ZXJlZFRhcmdldFxuXHQvL1xuXHQvLyBVU0FHRVxuXHQvLyAgICAgIG9uKG5vZGUsICdjbGljaycsICdkaXYudGFiIHNwYW4nLCBjYWxsYmFjayk7XG5cdC8vXG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIHYxLjcuNVxuXG5cdHRyeXtcblx0XHRpZiAodHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHJlcXVpcmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG5cdFx0fVxuXHR9Y2F0Y2goZSl7XG5cdFx0Y29uc29sZS5lcnJvcignb24vc3JjL2tleS1wb2x5IGlzIHJlcXVpcmVkIGZvciB0aGUgZXZlbnQua2V5IHByb3BlcnR5Jyk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYXNXaGVlbFRlc3QoKXtcblx0XHR2YXJcblx0XHRcdGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLFxuXHRcdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cmV0dXJuICBcIm9ud2hlZWxcIiBpbiBkaXYgfHwgXCJ3aGVlbFwiIGluIGRpdiB8fFxuXHRcdFx0KGlzSUUgJiYgZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uaGFzRmVhdHVyZShcIkV2ZW50cy53aGVlbFwiLCBcIjMuMFwiKSk7IC8vIElFIGZlYXR1cmUgZGV0ZWN0aW9uXG5cdH1cblxuXHR2YXJcblx0XHRJTlZBTElEX1BST1BTLFxuXHRcdG1hdGNoZXMsXG5cdFx0aGFzV2hlZWwgPSBoYXNXaGVlbFRlc3QoKSxcblx0XHRpc1dpbiA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignV2luZG93cycpPi0xLFxuXHRcdEZBQ1RPUiA9IGlzV2luID8gMTAgOiAwLjEsXG5cdFx0WExSOCA9IDAsXG5cdFx0bW91c2VXaGVlbEhhbmRsZTtcblxuXG5cdFsnbWF0Y2hlcycsICdtYXRjaGVzU2VsZWN0b3InLCAnd2Via2l0JywgJ21veicsICdtcycsICdvJ10uc29tZShmdW5jdGlvbiAobmFtZSkge1xuXHRcdGlmIChuYW1lLmxlbmd0aCA8IDcpIHsgLy8gcHJlZml4XG5cdFx0XHRuYW1lICs9ICdNYXRjaGVzU2VsZWN0b3InO1xuXHRcdH1cblx0XHRpZiAoRWxlbWVudC5wcm90b3R5cGVbbmFtZV0pIHtcblx0XHRcdG1hdGNoZXMgPSBuYW1lO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gY2xvc2VzdCAoZWxlbWVudCwgc2VsZWN0b3IsIHBhcmVudCkge1xuXHRcdHdoaWxlIChlbGVtZW50KSB7XG5cdFx0XHRpZiAoZWxlbWVudFttYXRjaGVzXSAmJiBlbGVtZW50W21hdGNoZXNdKHNlbGVjdG9yKSkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdH1cblx0XHRcdGlmIChlbGVtZW50ID09PSBwYXJlbnQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsb3Nlc3RGaWx0ZXIgKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRyZXR1cm4gY2xvc2VzdChlLnRhcmdldCwgc2VsZWN0b3IsIGVsZW1lbnQpO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlTXVsdGlIYW5kbGUgKGhhbmRsZXMpe1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbihoKXtcblx0XHRcdFx0XHQvLyBhbGxvdyBmb3IgYSBzaW1wbGUgZnVuY3Rpb24gaW4gdGhlIGxpc3Rcblx0XHRcdFx0XHRpZihoLnJlbW92ZSkge1xuXHRcdFx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdFx0XHR9ZWxzZSBpZih0eXBlb2YgaCA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRcdFx0XHRoKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aGFuZGxlcyA9IFtdO1xuXHRcdFx0XHR0aGlzLnJlbW92ZSA9IHRoaXMucGF1c2UgPSB0aGlzLnJlc3VtZSA9IGZ1bmN0aW9uKCl7fTtcblx0XHRcdH0sXG5cdFx0XHRwYXVzZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uKGgpeyBpZihoLnBhdXNlKXsgaC5wYXVzZSgpOyB9fSk7XG5cdFx0XHR9LFxuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRoYW5kbGVzLmZvckVhY2goZnVuY3Rpb24oaCl7IGlmKGgucmVzdW1lKXsgaC5yZXN1bWUoKTsgfX0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNsaWNrb2ZmIChub2RlLCBjYWxsYmFjayl7XG5cdFx0Ly8gaW1wb3J0YW50IG5vdGUhXG5cdFx0Ly8gc3RhcnRzIHBhdXNlZFxuXHRcdC8vXG5cdFx0dmFyXG5cdFx0XHRoYW5kbGUsXG5cdFx0XHRiSGFuZGxlID0gb24oZG9jdW1lbnQuYm9keSwgJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0XHRpZih0YXJnZXQubm9kZVR5cGUgIT09IDEpe1xuXHRcdFx0XHRcdHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHRhcmdldCAmJiAhbm9kZS5jb250YWlucyh0YXJnZXQpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZXZlbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdGhhbmRsZSA9IHtcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRiSGFuZGxlLnJlc3VtZSgpO1xuXHRcdFx0XHR9LCAxMDApO1xuXHRcdFx0fSxcblx0XHRcdHBhdXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJIYW5kbGUucGF1c2UoKTtcblx0XHRcdH0sXG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0YkhhbmRsZS5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aGFuZGxlLnBhdXNlKCk7XG5cblx0XHRyZXR1cm4gaGFuZGxlO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25JbWFnZUxvYWQgKGltZywgY2FsbGJhY2spIHtcblx0XHRmdW5jdGlvbiBvbkltYWdlTG9hZCAoZSkge1xuXHRcdFx0XHR2YXIgaCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZihpbWcubmF0dXJhbFdpZHRoKXtcblx0XHRcdFx0XHRcdGUud2lkdGggPSBpbWcubmF0dXJhbFdpZHRoO1xuXHRcdFx0XHRcdFx0ZS5uYXR1cmFsV2lkdGggPSBpbWcubmF0dXJhbFdpZHRoO1xuXHRcdFx0XHRcdFx0ZS5oZWlnaHQgPSBpbWcubmF0dXJhbEhlaWdodDtcblx0XHRcdFx0XHRcdGUubmF0dXJhbEhlaWdodCA9IGltZy5uYXR1cmFsSGVpZ2h0O1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdFx0XHRjbGVhckludGVydmFsKGgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgMTAwKTtcblx0XHRcdGltZy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25JbWFnZUxvYWQpO1xuXHRcdFx0aW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgY2FsbGJhY2spO1xuXHRcdH1cblx0XHRpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uSW1hZ2VMb2FkKTtcblx0XHRpbWcuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBjYWxsYmFjayk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHBhdXNlOiBmdW5jdGlvbiAoKSB7fSxcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24gKCkge30sXG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkltYWdlTG9hZCk7XG5cdFx0XHRcdGltZy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGNhbGxiYWNrKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZXROb2RlKHN0cil7XG5cdFx0aWYodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpe1xuXHRcdFx0cmV0dXJuIHN0cjtcblx0XHR9XG5cdFx0dmFyIG5vZGU7XG5cdFx0aWYoL1xcI3xcXC58XFxzLy50ZXN0KHN0cikpe1xuXHRcdFx0bm9kZSA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihzdHIpO1xuXHRcdH1lbHNle1xuXHRcdFx0bm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0cik7XG5cdFx0fVxuXHRcdGlmKCFub2RlKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2xvY2FsTGliL29uIENvdWxkIG5vdCBmaW5kOicsIHN0cik7XG5cdFx0fVxuXHRcdHJldHVybiBub2RlO1xuXHR9XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplV2hlZWxFdmVudCAoY2FsbGJhY2spe1xuXHRcdC8vIG5vcm1hbGl6ZXMgYWxsIGJyb3dzZXJzJyBldmVudHMgdG8gYSBzdGFuZGFyZDpcblx0XHQvLyBkZWx0YSwgd2hlZWxZLCB3aGVlbFhcblx0XHQvLyBhbHNvIGFkZHMgYWNjZWxlcmF0aW9uIGFuZCBkZWNlbGVyYXRpb24gdG8gbWFrZVxuXHRcdC8vIE1hYyBhbmQgV2luZG93cyBiZWhhdmUgc2ltaWxhcmx5XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpe1xuXHRcdFx0WExSOCArPSBGQUNUT1I7XG5cdFx0XHR2YXJcblx0XHRcdFx0ZGVsdGFZID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIChlLndoZWVsRGVsdGFZIHx8IGUuZGVsdGFZKSkpLFxuXHRcdFx0XHRkZWx0YVggPSBNYXRoLm1heCgtMTAsIE1hdGgubWluKDEwLCAoZS53aGVlbERlbHRhWCB8fCBlLmRlbHRhWCkpKTtcblxuXHRcdFx0ZGVsdGFZID0gZGVsdGFZIDw9IDAgPyBkZWx0YVkgLSBYTFI4IDogZGVsdGFZICsgWExSODtcblxuXHRcdFx0ZS5kZWx0YSA9IGRlbHRhWTtcblx0XHRcdGUud2hlZWxZID0gZGVsdGFZO1xuXHRcdFx0ZS53aGVlbFggPSBkZWx0YVg7XG5cblx0XHRcdGNsZWFyVGltZW91dChtb3VzZVdoZWVsSGFuZGxlKTtcblx0XHRcdG1vdXNlV2hlZWxIYW5kbGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFhMUjggPSAwO1xuXHRcdFx0fSwgMzAwKTtcblx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBvbiAobm9kZSwgZXZlbnRUeXBlLCBmaWx0ZXIsIGhhbmRsZXIpe1xuXHRcdC8vICBVU0FHRVxuXHRcdC8vICAgICAgdmFyIGhhbmRsZSA9IG9uKHRoaXMubm9kZSwgJ21vdXNlZG93bicsIHRoaXMsICdvblN0YXJ0Jyk7XG5cdFx0Ly8gICAgICBoYW5kbGUucGF1c2UoKTtcblx0XHQvLyAgICAgIGhhbmRsZS5yZXN1bWUoKTtcblx0XHQvLyAgICAgIGhhbmRsZS5yZW1vdmUoKTtcblx0XHQvL1xuXHRcdHZhclxuXHRcdFx0Y2FsbGJhY2ssXG5cdFx0XHRoYW5kbGVzLFxuXHRcdFx0aGFuZGxlO1xuXG5cdFx0aWYoLywvLnRlc3QoZXZlbnRUeXBlKSl7XG5cdFx0XHQvLyBoYW5kbGUgbXVsdGlwbGUgZXZlbnQgdHlwZXMsIGxpa2U6XG5cdFx0XHQvLyBvbihub2RlLCAnbW91c2V1cCwgbW91c2Vkb3duJywgY2FsbGJhY2spO1xuXHRcdFx0Ly9cblx0XHRcdGhhbmRsZXMgPSBbXTtcblx0XHRcdGV2ZW50VHlwZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oZVN0cil7XG5cdFx0XHRcdGhhbmRsZXMucHVzaChvbihub2RlLCBlU3RyLnRyaW0oKSwgZmlsdGVyLCBoYW5kbGVyKSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYWtlTXVsdGlIYW5kbGUoaGFuZGxlcyk7XG5cdFx0fVxuXG5cdFx0bm9kZSA9IGdldE5vZGUobm9kZSk7XG5cblx0XHRpZihmaWx0ZXIgJiYgaGFuZGxlcil7XG5cdFx0XHRpZiAodHlwZW9mIGZpbHRlciA9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRmaWx0ZXIgPSBjbG9zZXN0RmlsdGVyKG5vZGUsIGZpbHRlcik7XG5cdFx0XHR9XG5cdFx0XHQvLyBlbHNlIGl0IGlzIGEgY3VzdG9tIGZ1bmN0aW9uXG5cdFx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBmaWx0ZXIoZSk7XG5cdFx0XHRcdGlmIChyZXN1bHQpIHtcblx0XHRcdFx0XHRlLmZpbHRlcmVkVGFyZ2V0ID0gcmVzdWx0O1xuXHRcdFx0XHRcdGhhbmRsZXIoZSwgcmVzdWx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9ZWxzZXtcblx0XHRcdGNhbGxiYWNrID0gZmlsdGVyIHx8IGhhbmRsZXI7XG5cdFx0fVxuXG5cdFx0aWYoZXZlbnRUeXBlID09PSAnY2xpY2tvZmYnKXtcblx0XHRcdC8vIGN1c3RvbSAtIHVzZWQgZm9yIHBvcHVwcyAnbiBzdHVmZlxuXHRcdFx0cmV0dXJuIG9uQ2xpY2tvZmYobm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdGlmIChldmVudFR5cGUgPT09ICdsb2FkJyAmJiBub2RlLmxvY2FsTmFtZSA9PT0gJ2ltZycpe1xuXHRcdFx0cmV0dXJuIG9uSW1hZ2VMb2FkKG5vZGUsIGNhbGxiYWNrKTtcblx0XHR9XG5cblx0XHRpZihldmVudFR5cGUgPT09ICd3aGVlbCcpe1xuXHRcdFx0Ly8gbW91c2V3aGVlbCBldmVudHMsIG5hdGNoXG5cdFx0XHRpZihoYXNXaGVlbCl7XG5cdFx0XHRcdC8vIHBhc3MgdGhyb3VnaCwgYnV0IGZpcnN0IGN1cnJ5IGNhbGxiYWNrIHRvIHdoZWVsIGV2ZW50c1xuXHRcdFx0XHRjYWxsYmFjayA9IG5vcm1hbGl6ZVdoZWVsRXZlbnQoY2FsbGJhY2spO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdC8vIG9sZCBGaXJlZm94LCBvbGQgSUUsIENocm9tZVxuXHRcdFx0XHRyZXR1cm4gbWFrZU11bHRpSGFuZGxlKFtcblx0XHRcdFx0XHRvbihub2RlLCAnRE9NTW91c2VTY3JvbGwnLCBub3JtYWxpemVXaGVlbEV2ZW50KGNhbGxiYWNrKSksXG5cdFx0XHRcdFx0b24obm9kZSwgJ21vdXNld2hlZWwnLCBub3JtYWxpemVXaGVlbEV2ZW50KGNhbGxiYWNrKSlcblx0XHRcdFx0XSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcblxuXHRcdGhhbmRsZSA9IHtcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG5cdFx0XHRcdG5vZGUgPSBjYWxsYmFjayA9IG51bGw7XG5cdFx0XHRcdHRoaXMucmVtb3ZlID0gdGhpcy5wYXVzZSA9IHRoaXMucmVzdW1lID0gZnVuY3Rpb24oKXt9O1xuXHRcdFx0fSxcblx0XHRcdHBhdXNlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fSxcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIGhhbmRsZTtcblx0fVxuXG5cdG9uLm9uY2UgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnRUeXBlLCBmaWx0ZXIsIGNhbGxiYWNrKXtcblx0XHR2YXIgaDtcblx0XHRpZihmaWx0ZXIgJiYgY2FsbGJhY2spe1xuXHRcdFx0aCA9IG9uKG5vZGUsIGV2ZW50VHlwZSwgZmlsdGVyLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcblx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0aCA9IG9uKG5vZGUsIGV2ZW50VHlwZSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRmaWx0ZXIuYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xuXHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBoO1xuXHR9O1xuXG5cdElOVkFMSURfUFJPUFMgPSB7XG5cdFx0aXNUcnVzdGVkOjFcblx0fTtcblx0ZnVuY3Rpb24gbWl4KG9iamVjdCwgdmFsdWUpe1xuXHRcdGlmKCF2YWx1ZSl7XG5cdFx0XHRyZXR1cm4gb2JqZWN0O1xuXHRcdH1cblx0XHRpZih0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdGlmKCFJTlZBTElEX1BST1BTW2tleV0pIHtcblx0XHRcdFx0XHRvYmplY3Rba2V5XSA9IHZhbHVlW2tleV07XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0b2JqZWN0LnZhbHVlID0gdmFsdWU7XG5cdFx0fVxuXHRcdHJldHVybiBvYmplY3Q7XG5cdH1cblxuXHRvbi5lbWl0ID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgdmFsdWUpIHtcblx0XHRub2RlID0gZ2V0Tm9kZShub2RlKTtcblx0XHR2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIHRydWUpOyAvLyBldmVudCB0eXBlLCBidWJibGluZywgY2FuY2VsYWJsZVxuXHRcdHJldHVybiBub2RlLmRpc3BhdGNoRXZlbnQobWl4KGV2ZW50LCB2YWx1ZSkpO1xuXHR9O1xuXG5cdG9uLmZpcmUgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcykge1xuXHRcdHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuXHRcdGV2ZW50LmluaXRDdXN0b21FdmVudChldmVudE5hbWUsICEhYnViYmxlcywgdHJ1ZSwgZXZlbnREZXRhaWwpOyAvLyBldmVudCB0eXBlLCBidWJibGluZywgY2FuY2VsYWJsZVxuXHRcdHJldHVybiBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9O1xuXG5cdG9uLmlzQWxwaGFOdW1lcmljID0gZnVuY3Rpb24gKHN0cikge1xuXHRcdGlmKHN0ci5sZW5ndGggPiAxKXsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0aWYoc3RyID09PSAnICcpeyByZXR1cm4gZmFsc2U7IH1cblx0XHRpZighaXNOYU4oTnVtYmVyKHN0cikpKXsgcmV0dXJuIHRydWU7IH1cblx0XHR2YXIgY29kZSA9IHN0ci50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XG5cdFx0cmV0dXJuIGNvZGUgPj0gOTcgJiYgY29kZSA8PSAxMjI7XG5cdH07XG5cblx0b24ubWFrZU11bHRpSGFuZGxlID0gbWFrZU11bHRpSGFuZGxlO1xuXHRvbi5jbG9zZXN0ID0gY2xvc2VzdDtcblx0b24ubWF0Y2hlcyA9IG1hdGNoZXM7XG5cblx0cmV0dXJuIG9uO1xuXG59KSk7XG4iXX0=
