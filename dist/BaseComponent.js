(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"keyboardevent-key-polyfill":2}],4:[function(require,module,exports){
"use strict";

// class/component rules
// always call super() first in the ctor. This also calls the extended class' ctor.
// cannot call NEW on a Component class

// Classes http://exploringjs.com/es6/ch_classes.html#_the-species-pattern-in-static-methods

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _on = require('on');
var dom = require('dom');

var BaseComponent = function (_HTMLElement) {
    _inherits(BaseComponent, _HTMLElement);

    function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));

        _this._uid = dom.uid(_this.localName);
        privates[_this._uid] = { DOMSTATE: 'created' };
        privates[_this._uid].handleList = [];
        plugin('init', _this);
        return _this;
    }

    _createClass(BaseComponent, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            privates[this._uid].DOMSTATE = 'connected';
            plugin('preConnected', this);
            nextTick(onCheckDomReady.bind(this));
            if (this.connected) {
                this.connected();
            }
            this.fire('connected');
            plugin('postConnected', this);
        }
    }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
            privates[this._uid].DOMSTATE = 'disconnected';
            plugin('preDisconnected', this);
            if (this.disconnected) {
                this.disconnected();
            }
            this.fire('disconnected');
        }
    }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(attrName, oldVal, newVal) {
            plugin('preAttributeChanged', this, attrName, newVal, oldVal);
            if (this.attributeChanged) {
                this.attributeChanged(attrName, newVal, oldVal);
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.fire('destroy');
            privates[this._uid].handleList.forEach(function (handle) {
                handle.remove();
            });
            dom.destroy(this);
        }
    }, {
        key: 'fire',
        value: function fire(eventName, eventDetail, bubbles) {
            return _on.fire(this, eventName, eventDetail, bubbles);
        }
    }, {
        key: 'emit',
        value: function emit(eventName, value) {
            return _on.emit(this, eventName, value);
        }
    }, {
        key: 'on',
        value: function on(node, eventName, selector, callback) {
            return this.registerHandle(typeof node != 'string' ? // no node is supplied
            _on(node, eventName, selector, callback) : _on(this, node, eventName, selector));
        }
    }, {
        key: 'once',
        value: function once(node, eventName, selector, callback) {
            return this.registerHandle(typeof node != 'string' ? // no node is supplied
            _on.once(node, eventName, selector, callback) : _on.once(this, node, eventName, selector, callback));
        }
    }, {
        key: 'registerHandle',
        value: function registerHandle(handle) {
            privates[this._uid].handleList.push(handle);
            return handle;
        }
    }, {
        key: 'DOMSTATE',
        get: function get() {
            return privates[this._uid].DOMSTATE;
        }
    }], [{
        key: 'clone',
        value: function clone(template) {
            if (template.content && template.content.children) {
                return document.importNode(template.content, true);
            }
            var frag = document.createDocumentFragment(),
                cloneNode = document.createElement('div');
            cloneNode.innerHTML = template.innerHTML;

            while (cloneNode.children.length) {
                frag.appendChild(cloneNode.children[0]);
            }
            return frag;
        }
    }, {
        key: 'addPlugin',
        value: function addPlugin(plug) {
            var i,
                order = plug.order || 100;
            if (!plugins.length) {
                plugins.push(plug);
            } else if (plugins.length === 1) {
                if (plugins[0].order <= order) {
                    plugins.push(plug);
                } else {
                    plugins.unshift(plug);
                }
            } else if (plugins[0].order > order) {
                plugins.unshift(plug);
            } else {

                for (i = 1; i < plugins.length; i++) {
                    if (order === plugins[i - 1].order || order > plugins[i - 1].order && order < plugins[i].order) {
                        plugins.splice(i, 0, plug);
                        return;
                    }
                }
                // was not inserted...
                plugins.push(plug);
            }
        }
    }]);

    return BaseComponent;
}(HTMLElement);

var privates = {},
    plugins = [];

function plugin(method, node, a, b, c) {
    plugins.forEach(function (plug) {
        if (plug[method]) {
            plug[method](node, a, b, c);
        }
    });
}

function onCheckDomReady() {
    if (this.DOMSTATE != 'connected' || privates[this._uid].domReadyFired) {
        return;
    }

    var count = 0,
        children = getChildCustomNodes(this),
        ourDomReady = onDomReady.bind(this);

    function addReady() {
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

function onDomReady() {
    privates[this._uid].DOMSTATE = 'domready';
    // domReady should only ever fire once
    privates[this._uid].domReadyFired = true;
    plugin('preDomReady', this);
    // call this.domReady first, so that the component
    // can finish initializing before firing any
    // subsequent events
    if (this.domReady) {
        this.domReady();
        this.domReady = function () {};
    }

    this.fire('domready');

    plugin('postDomReady', this);
}

function getChildCustomNodes(node) {
    // collect any children that are custom nodes
    // used to check if their dom is ready before
    // determining if this is ready
    var i,
        nodes = [];
    for (i = 0; i < node.children.length; i++) {
        if (node.children[i].nodeName.indexOf('-') > -1) {
            nodes.push(node.children[i]);
        }
    }
    return nodes;
}

function nextTick(cb) {
    requestAnimationFrame(cb);
}

window.onDomReady = function (node, callback) {
    function onReady() {
        callback(node);
        node.removeEventListener('domready', onReady);
    }
    if (node.DOMSTATE === 'domready') {
        callback(node);
    } else {
        node.addEventListener('domready', onReady);
    }
};

module.exports = BaseComponent;

},{"dom":1,"on":3}],5:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');
var properties = require('./properties');
var template = require('./template');
var refs = require('./refs');
var itemTemplate = require('./item-template');

// const elDeployOListic = 'FOO';
// module.exports = {
// 	elDeployOListic: elDeployOListic,
// 	BaseComponent: BaseComponent,
// 	properties: properties,
// 	template: template,
// 	refs: refs,
// 	itemTemplate: itemTemplate
// };

},{"./BaseComponent":4,"./item-template":6,"./properties":7,"./refs":8,"./template":9}],6:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');
var dom = require('dom');
var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
var r = /\{\{\w*}}/g;

// TODO: switch to ES6 literals? Maybe not...

// FIXME: time current process
// Try a new one where meta data is created, instead of a template

function createCondition(name, value) {
    // FIXME name?
    value = value.replace(r, function (w) {
        w = w.replace('{{', '').replace('}}', '');
        return 'item["' + w + '"]';
    });
    console.log('createCondition', name, value);
    return function (item) {
        return eval(value);
    };
}

function walkDom(node, refs) {

    var item = {
        node: node
    };

    refs.nodes.push(item);

    if (node.attributes) {
        for (var i = 0; i < node.attributes.length; i++) {
            var name = node.attributes[i].name,
                value = node.attributes[i].value;
            console.log('  ', name, value);
            if (name === 'if') {
                item.conditional = createCondition(name, value);
            } else if (/\{\{/.test(value)) {
                // <div id="{{id}}">
                refs.attributes = refs.attributes || {};
                item.attributes = item.attributes || {};
                item.attributes[name] = value;
                // could be more than one??
                // same with node?
                refs.attributes[name] = node;
            }
        }
    }

    // should probably loop over childNodes and check text nodes for replacements
    //
    if (!node.children.length) {
        if (/\{\{/.test(node.innerHTML)) {
            // FIXME - innerHTML as value too naive
            var prop = node.innerHTML.replace('{{', '').replace('}}', '');
            item.text = item.text || {};
            item.text[prop] = node.innerHTML;
            refs[prop] = node;
        }
        return;
    }

    for (var _i = 0; _i < node.children.length; _i++) {
        walkDom(node.children[_i], refs);
    }
}

function updateItemTemplate(frag) {
    var refs = {
        nodes: []
    };
    walkDom(frag, refs);
    return refs;
}

BaseComponent.prototype.renderList = function (items, container, itemTemplate) {
    var frag = document.createDocumentFragment(),
        tmpl = itemTemplate || this.itemTemplate,
        refs = tmpl.itemRefs,
        clone = void 0,
        defer = void 0;

    function warn(name) {
        clearTimeout(defer);
        defer = setTimeout(function () {
            console.warn('Attempted to set attribute from non-existent item property:', name);
        }, 1);
    }

    items.forEach(function (item) {

        var ifCount = 0,
            deletions = [];

        refs.nodes.forEach(function (ref) {

            //
            // can't swap because the innerHTML is being changed
            // can't clone because then there is not a node reference
            //
            var value = void 0,
                node = ref.node,
                hasNode = true;
            if (ref.conditional) {
                if (!ref.conditional(item)) {
                    hasNode = false;
                    ifCount++;
                    // can't actually delete, because this is the original template
                    // instead, adding attribute to track node, to be deleted in clone
                    // then after, remove temporary attribute from template
                    ref.node.setAttribute('ifs', ifCount + '');
                    deletions.push('[ifs="' + ifCount + '"]');
                }
            }
            if (hasNode) {
                if (ref.attributes) {
                    Object.keys(ref.attributes).forEach(function (key) {
                        value = ref.attributes[key];
                        ref.node.setAttribute(key, item[key]);
                        //console.log('swap att', key, value, ref.node);
                    });
                }
                if (ref.text) {
                    Object.keys(ref.text).forEach(function (key) {
                        value = ref.text[key];
                        //console.log('swap text', key, item[key]);
                        node.innerHTML = value.replace(value, item[key]);
                    });
                }
            }
        });

        clone = tmpl.cloneNode(true);

        deletions.forEach(function (del) {
            var node = clone.querySelector(del);
            if (node) {
                dom.destroy(node);
                var tmplNode = tmpl.querySelector(del);
                tmplNode.removeAttribute('ifs');
            }
        });

        frag.appendChild(clone);
    });

    container.appendChild(frag);

    //items.forEach(function (item) {
    //    Object.keys(item).forEach(function (key) {
    //        if(refs[key]){
    //            refs[key].innerHTML = item[key];
    //        }
    //    });
    //    if(refs.attributes){
    //        Object.keys(refs.attributes).forEach(function (name) {
    //            let node = refs.attributes[name];
    //            if(item[name] !== undefined) {
    //                node.setAttribute(name, item[name]);
    //            }else{
    //                warn(name);
    //            }
    //        });
    //    }
    //
    //    clone = tmpl.cloneNode(true);
    //    frag.appendChild(clone);
    //});

    //container.appendChild(frag);
};

BaseComponent.addPlugin({
    name: 'item-template',
    order: 40,
    preDomReady: function preDomReady(node) {
        node.itemTemplate = dom.query(node, 'template');
        if (node.itemTemplate) {
            node.itemTemplate.parentNode.removeChild(node.itemTemplate);
            node.itemTemplate = BaseComponent.clone(node.itemTemplate);
            node.itemTemplate.itemRefs = updateItemTemplate(node.itemTemplate);
        }
    }
});

module.exports = {};

},{"./BaseComponent":4,"dom":1}],7:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');
var dom = require('dom');

function setBoolean(node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		get: function get() {
			if (node.hasAttribute(prop)) {
				return dom.normalize(node.getAttribute(prop));
			}
			return false;
		},
		set: function set(value) {
			if (value) {
				this.setAttribute(prop, '');
			} else {
				this.removeAttribute(prop);
			}
		}
	});
}

function setProperty(node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		get: function get() {
			return dom.normalize(this.getAttribute(prop));
		},
		set: function set(value) {
			this.setAttribute(prop, value);
		}
	});
}

function setObject(node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		get: function get() {
			return this['__' + prop];
		},
		set: function set(value) {
			this['__' + prop] = value;
		}
	});
}

function setProperties(node) {
	var props = node.props || node.properties;
	if (props) {
		props.forEach(function (prop) {
			if (prop === 'disabled') {
				setBoolean(node, prop);
			} else {
				setProperty(node, prop);
			}
		});
	}
}

function setBooleans(node) {
	var props = node.bools || node.booleans;
	if (props) {
		props.forEach(function (prop) {
			setBoolean(node, prop);
		});
	}
}

function setObjects(node) {
	var props = node.objects;
	if (props) {
		props.forEach(function (prop) {
			setObject(node, prop);
		});
	}
}

BaseComponent.addPlugin({
	name: 'properties',
	order: 10,
	init: function init(node) {
		setProperties(node);
		setBooleans(node);
	},
	preAttributeChanged: function preAttributeChanged(node, name, value) {
		this[name] = dom.normalize(value);
		if (!value && (node.bools || node.booleans || []).indexOf(name)) {
			node.removeAttribute(name);
		}
	}
});

module.exports = {};

},{"./BaseComponent":4,"dom":1}],8:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');

function assignRefs(node) {
    dom.queryAll(node, '[ref]').forEach(function (child) {
        var name = child.getAttribute('ref');
        node[name] = child;
    });
}

function assignEvents(node) {
    // <div on="click:onClick">
    dom.queryAll(node, '[on]').forEach(function (child) {
        var keyValue = child.getAttribute('on'),
            event = keyValue.split(':')[0].trim(),
            method = keyValue.split(':')[1].trim();
        node.on(child, event, function (e) {
            node[method](e);
        });
    });
}

BaseComponent.addPlugin({
    name: 'refs',
    order: 30,
    preConnected: function preConnected(node) {
        assignRefs(node);
        assignEvents(node);
    }
});

module.exports = {};

},{"./BaseComponent":4}],9:[function(require,module,exports){
'use strict';

var BaseComponent = require('./BaseComponent');
var dom = require('dom');

var lightNodes = {},
    inserted = {};

function insert(node) {
    if (inserted[node._uid] || !hasTemplate(node)) {
        return;
    }
    collectLightNodes(node);
    insertTemplate(node);
    inserted[node._uid] = true;
}

function collectLightNodes(node) {
    lightNodes[node._uid] = lightNodes[node._uid] || [];
    while (node.childNodes.length) {
        lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
    }
}

function hasTemplate(node) {
    return !!node.getTemplateNode();
}

function insertTemplateChain(node) {
    var templates = node.getTemplateChain();
    templates.reverse().forEach(function (template) {
        getContainer(node).appendChild(BaseComponent.clone(template));
    });
    insertChildren(node);
}

function insertTemplate(node) {
    if (node.nestedTemplate) {
        insertTemplateChain(node);
        return;
    }
    var templateNode = node.getTemplateNode();

    if (templateNode) {
        node.appendChild(BaseComponent.clone(templateNode));
    }
    insertChildren(node);
}

function getContainer(node) {
    var containers = node.querySelectorAll('[ref="container"]');
    if (!containers || !containers.length) {
        return node;
    }
    return containers[containers.length - 1];
}

function insertChildren(node) {
    var i,
        container = getContainer(node),
        children = lightNodes[node._uid];

    if (container && children && children.length) {
        for (i = 0; i < children.length; i++) {
            container.appendChild(children[i]);
        }
    }
}

BaseComponent.prototype.getLightNodes = function () {
    return lightNodes[this._uid];
};

BaseComponent.prototype.getTemplateNode = function () {
    // caching causes different classes to pull the same template - wat?
    //if(!this.templateNode) {
    if (this.templateId) {
        this.templateNode = dom.byId(this.templateId.replace('#', ''));
    } else if (this.templateString) {
        this.templateNode = dom.toDom('<template>' + this.templateString + '</template>');
    }
    //}
    return this.templateNode;
};

BaseComponent.prototype.getTemplateChain = function () {

    var context = this,
        templates = [],
        template = void 0;

    // walk the prototype chain; Babel doesn't allow using
    // `super` since we are outside of the Class
    while (context) {
        context = Object.getPrototypeOf(context);
        if (!context) {
            break;
        }
        // skip prototypes without a template
        // (else it will pull an inherited template and cause duplicates)
        if (context.hasOwnProperty('templateString') || context.hasOwnProperty('templateId')) {
            template = context.getTemplateNode();
            if (template) {
                templates.push(template);
            }
        }
    }
    return templates;
};

BaseComponent.addPlugin({
    name: 'template',
    order: 20,
    preConnected: function preConnected(node) {
        insert(node);
    }
});

module.exports = {};

},{"./BaseComponent":4,"dom":1}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tL3NyYy9kb20uanMiLCJub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb24vZGlzdC9vbi5qcyIsInNyYy9CYXNlQ29tcG9uZW50LmpzIiwic3JjL2RlcGxveS5qcyIsInNyYy9pdGVtLXRlbXBsYXRlLmpzIiwic3JjL3Byb3BlcnRpZXMuanMiLCJzcmMvcmVmcy5qcyIsInNyYy90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QkQ7O0FBd0JBLGNBQWMsU0FBZCxDQUF3QjtBQUNwQixVQUFNLFVBRGM7QUFFcEIsV0FBTyxFQUZhO0FBR3BCLGtCQUFjLHNCQUFVLElBQVYsRUFBZ0I7QUFDMUIsZUFBTyxJQUFQO0FBQ0g7QUFMbUIsQ0FBeEI7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLEVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFVNRC5kZWZpbmUgKi8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBjdXN0b21Mb2FkZXIgPT09ICdmdW5jdGlvbicpeyBjdXN0b21Mb2FkZXIoZmFjdG9yeSwgJ2RvbScpOyB9ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7IGRlZmluZShbXSwgZmFjdG9yeSk7IH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpOyB9IGVsc2UgeyByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7IHdpbmRvdy5kb20gPSBmYWN0b3J5KCk7IH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIC8vICBjb252ZW5pZW5jZSBsaWJyYXJ5IGZvciBjb21tb24gRE9NIG1ldGhvZHNcbiAgICAvLyAgICAgIGRvbSgpXG4gICAgLy8gICAgICAgICAgY3JlYXRlIGRvbSBub2Rlc1xuICAgIC8vICAgICAgZG9tLnN0eWxlKClcbiAgICAvLyAgICAgICAgICBzZXQvZ2V0IG5vZGUgc3R5bGVcbiAgICAvLyAgICAgIGRvbS5hdHRyKClcbiAgICAvLyAgICAgICAgICBzZXQvZ2V0IGF0dHJpYnV0ZXNcbiAgICAvLyAgICAgIGRvbS5kZXN0cm95KClcbiAgICAvLyAgICAgICAgICBvYmxpdGVyYXRlcyBhIG5vZGVcbiAgICAvLyAgICAgIGRvbS5ib3goKVxuICAgIC8vICAgICAgICAgIGdldCBub2RlIGRpbWVuc2lvbnNcbiAgICAvLyAgICAgIGRvbS51aWQoKVxuICAgIC8vICAgICAgICAgIGdldCBhIHVuaXF1ZSBJRCAobm90IGRvbSBzcGVjaWZpYylcbiAgICAvL1xuICAgIHZhclxuICAgICAgICBpc0Zsb2F0ID0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgICAgICd6LWluZGV4JzogMVxuICAgICAgICB9LFxuICAgICAgICBpc0RpbWVuc2lvbiA9IHtcbiAgICAgICAgICAgIHdpZHRoOjEsXG4gICAgICAgICAgICBoZWlnaHQ6MSxcbiAgICAgICAgICAgIHRvcDoxLFxuICAgICAgICAgICAgbGVmdDoxLFxuICAgICAgICAgICAgcmlnaHQ6MSxcbiAgICAgICAgICAgIGJvdHRvbToxLFxuICAgICAgICAgICAgbWF4V2lkdGg6MSxcbiAgICAgICAgICAgICdtYXgtd2lkdGgnOjEsXG4gICAgICAgICAgICBtaW5XaWR0aDoxLFxuICAgICAgICAgICAgJ21pbi13aWR0aCc6MSxcbiAgICAgICAgICAgIG1heEhlaWdodDoxLFxuICAgICAgICAgICAgJ21heC1oZWlnaHQnOjFcbiAgICAgICAgfSxcbiAgICAgICAgdWlkcyA9IHt9LFxuICAgICAgICBkZXN0cm95ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIGZ1bmN0aW9uIHVpZCAodHlwZSl7XG4gICAgICAgIGlmKCF1aWRzW3R5cGVdKXtcbiAgICAgICAgICAgIHVpZHNbdHlwZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWQgPSB0eXBlICsgJy0nICsgKHVpZHNbdHlwZV0ubGVuZ3RoICsgMSk7XG4gICAgICAgIHVpZHNbdHlwZV0ucHVzaChpZCk7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc05vZGUgKGl0ZW0pe1xuICAgICAgICAvLyBzYWZlciB0ZXN0IGZvciBjdXN0b20gZWxlbWVudHMgaW4gRkYgKHdpdGggd2Mgc2hpbSlcbiAgICAgICAgcmV0dXJuICEhaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGl0ZW0uaW5uZXJIVE1MID09PSAnc3RyaW5nJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXROb2RlIChpdGVtKXtcblxuICAgICAgICBpZighaXRlbSl7IHJldHVybiBpdGVtOyB9XG4gICAgICAgIGlmKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGUtanF1ZXJ5aWZ5XG4gICAgICAgIHJldHVybiBpdGVtLmdldCA/IGl0ZW0uZ2V0KDApIDpcbiAgICAgICAgICAgIC8vIGl0ZW0gaXMgYSBkb20gbm9kZVxuICAgICAgICAgICAgaXRlbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBieUlkIChpZCl7XG4gICAgICAgIHJldHVybiBnZXROb2RlKGlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHlsZSAobm9kZSwgcHJvcCwgdmFsdWUpe1xuICAgICAgICAvLyBnZXQvc2V0IG5vZGUgc3R5bGUocylcbiAgICAgICAgLy8gICAgICBwcm9wOiBzdHJpbmcgb3Igb2JqZWN0XG4gICAgICAgIC8vXG4gICAgICAgIHZhciBrZXksIGNvbXB1dGVkO1xuICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgLy8gb2JqZWN0IHNldHRlclxuICAgICAgICAgICAgZm9yKGtleSBpbiBwcm9wKXtcbiAgICAgICAgICAgICAgICBpZihwcm9wLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICBzdHlsZShub2RlLCBrZXksIHByb3Bba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1lbHNlIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgLy8gcHJvcGVydHkgc2V0dGVyXG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRGltZW5zaW9uW3Byb3BdKXtcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZihwcm9wID09PSAndXNlclNlbGVjdCcpe1xuICAgICAgICAgICAgICAgIHZhbHVlID0gISF2YWx1ZSA/ICd0ZXh0JyA6ICdub25lJztcbiAgICAgICAgICAgICAgICBzdHlsZShub2RlLCB7XG4gICAgICAgICAgICAgICAgICAgIHdlYmtpdFRvdWNoQ2FsbG91dDogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHdlYmtpdFVzZXJTZWxlY3Q6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBraHRtbFVzZXJTZWxlY3Q6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBtb3pVc2VyU2VsZWN0OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgbXNVc2VyU2VsZWN0OiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0dGVyLCBpZiBhIHNpbXBsZSBzdHlsZVxuICAgICAgICBpZihub2RlLnN0eWxlW3Byb3BdKXtcbiAgICAgICAgICAgIGlmKGlzRGltZW5zaW9uW3Byb3BdKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQobm9kZS5zdHlsZVtwcm9wXSwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoaXNGbG9hdFtwcm9wXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobm9kZS5zdHlsZVtwcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5zdHlsZVtwcm9wXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldHRlciwgY29tcHV0ZWRcbiAgICAgICAgY29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUsIHByb3ApO1xuICAgICAgICBpZihjb21wdXRlZFtwcm9wXSl7XG4gICAgICAgICAgICBpZigvXFxkLy50ZXN0KGNvbXB1dGVkW3Byb3BdKSl7XG4gICAgICAgICAgICAgICAgaWYoIWlzTmFOKHBhcnNlSW50KGNvbXB1dGVkW3Byb3BdLCAxMCkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGNvbXB1dGVkW3Byb3BdLCAxMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXR0ciAobm9kZSwgcHJvcCwgdmFsdWUpe1xuICAgICAgICAvLyBnZXQvc2V0IG5vZGUgYXR0cmlidXRlKHMpXG4gICAgICAgIC8vICAgICAgcHJvcDogc3RyaW5nIG9yIG9iamVjdFxuICAgICAgICAvL1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgZm9yKGtleSBpbiBwcm9wKXtcbiAgICAgICAgICAgICAgICBpZihwcm9wLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICBhdHRyKG5vZGUsIGtleSwgcHJvcFtrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgaWYocHJvcCA9PT0gJ3RleHQnIHx8IHByb3AgPT09ICdodG1sJyB8fCBwcm9wID09PSAnaW5uZXJIVE1MJyl7XG4gICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShwcm9wKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib3ggKG5vZGUpe1xuICAgICAgICBpZihub2RlID09PSB3aW5kb3cpe1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBub2RlIGRpbWVuc2lvbnNcbiAgICAgICAgLy8gcmV0dXJuZWQgb2JqZWN0IGlzIGltbXV0YWJsZVxuICAgICAgICAvLyBhZGQgc2Nyb2xsIHBvc2l0aW9uaW5nIGFuZCBjb252ZW5pZW5jZSBhYmJyZXZpYXRpb25zXG4gICAgICAgIHZhclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IGdldE5vZGUobm9kZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGRpbWVuc2lvbnMudG9wLFxuICAgICAgICAgICAgcmlnaHQ6IGRpbWVuc2lvbnMucmlnaHQsXG4gICAgICAgICAgICBib3R0b206IGRpbWVuc2lvbnMuYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogZGltZW5zaW9ucy5sZWZ0LFxuICAgICAgICAgICAgaGVpZ2h0OiBkaW1lbnNpb25zLmhlaWdodCxcbiAgICAgICAgICAgIGg6IGRpbWVuc2lvbnMuaGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IGRpbWVuc2lvbnMud2lkdGgsXG4gICAgICAgICAgICB3OiBkaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgICAgc2Nyb2xsWTogd2luZG93LnNjcm9sbFksXG4gICAgICAgICAgICBzY3JvbGxYOiB3aW5kb3cuc2Nyb2xsWCxcbiAgICAgICAgICAgIHg6IGRpbWVuc2lvbnMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgIHk6IGRpbWVuc2lvbnMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVlcnkgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIXNlbGVjdG9yKXtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcXVlcnlBbGwgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIXNlbGVjdG9yKXtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm9kZXMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgICAgIGlmKCFub2Rlcy5sZW5ndGgpeyByZXR1cm4gW107IH1cblxuICAgICAgICAvLyBjb252ZXJ0IHRvIEFycmF5IGFuZCByZXR1cm4gaXRcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0RvbSAoaHRtbCwgb3B0aW9ucywgcGFyZW50KXtcbiAgICAgICAgLy8gY3JlYXRlIGEgbm9kZSBmcm9tIGFuIEhUTUwgc3RyaW5nXG4gICAgICAgIHZhciBub2RlID0gZG9tKCdkaXYnLCB7aHRtbDogaHRtbH0pO1xuICAgICAgICBwYXJlbnQgPSBieUlkKHBhcmVudCB8fCBvcHRpb25zKTtcbiAgICAgICAgaWYocGFyZW50KXtcbiAgICAgICAgICAgIHdoaWxlKG5vZGUuZmlyc3RDaGlsZCl7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIGlmKGh0bWwuaW5kZXhPZignPCcpICE9PSAwKXtcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbURvbSAobm9kZSkge1xuICAgICAgICBmdW5jdGlvbiBnZXRBdHRycyAobm9kZSkge1xuICAgICAgICAgICAgdmFyIGF0dCwgaSwgYXR0cnMgPSB7fTtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgYXR0ID0gbm9kZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgIGF0dHJzW2F0dC5sb2NhbE5hbWVdID0gbm9ybWFsaXplKGF0dC52YWx1ZSA9PT0gJycgPyB0cnVlIDogYXR0LnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhdHRycztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRUZXh0IChub2RlKSB7XG4gICAgICAgICAgICB2YXIgaSwgdCwgdGV4dCA9ICcnO1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0ID0gbm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmKHQubm9kZVR5cGUgPT09IDMgJiYgdC50ZXh0Q29udGVudC50cmltKCkpe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHQudGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHZhciBpLCBvYmplY3QgPSBnZXRBdHRycyhub2RlKTtcbiAgICAgICAgb2JqZWN0LnRleHQgPSBnZXRUZXh0KG5vZGUpO1xuICAgICAgICBvYmplY3QuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgaWYobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgb2JqZWN0LmNoaWxkcmVuLnB1c2goZnJvbURvbShub2RlLmNoaWxkcmVuW2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRDaGlsZHJlbiAobm9kZSwgY2hpbGRyZW4pIHtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpe1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChjaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRDb250ZW50IChub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBodG1sO1xuICAgICAgICBpZihvcHRpb25zLmh0bWwgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmlubmVySFRNTCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGh0bWwgPSBvcHRpb25zLmh0bWwgfHwgb3B0aW9ucy5pbm5lckhUTUwgfHwgJyc7XG4gICAgICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgIGFkZENoaWxkcmVuKG5vZGUsIGh0bWwpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBtaXNzZXMgc29tZSBIVE1MLCBzdWNoIGFzIGVudGl0aWVzICgmbnBzcDspXG4gICAgICAgICAgICAvL2Vsc2UgaWYoaHRtbC5pbmRleE9mKCc8JykgPT09IDApIHtcbiAgICAgICAgICAgIC8vICAgIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgLy9lbHNle1xuICAgICAgICAgICAgLy8gICAgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShodG1sKSk7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgfVxuICAgICAgICBpZihvcHRpb25zLnRleHQpe1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShvcHRpb25zLnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICBpZihvcHRpb25zLmNoaWxkcmVuKXtcbiAgICAgICAgICAgIGFkZENoaWxkcmVuKG5vZGUsIG9wdGlvbnMuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGRvbSAobm9kZVR5cGUsIG9wdGlvbnMsIHBhcmVudCwgcHJlcGVuZCl7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5vZGVcbiAgICAgICAgLy8gaWYgZmlyc3QgYXJndW1lbnQgaXMgYSBzdHJpbmcgYW5kIHN0YXJ0cyB3aXRoIDwsIGl0IGlzIGFzc3VtZWRcbiAgICAgICAgLy8gdG8gdXNlIHRvRG9tLCBhbmQgY3JlYXRlcyBhIG5vZGUgZnJvbSBIVE1MLiBPcHRpb25hbCBzZWNvbmQgYXJnIGlzXG4gICAgICAgIC8vIHBhcmVudCB0byBhcHBlbmQgdG9cbiAgICAgICAgLy8gZWxzZTpcbiAgICAgICAgLy8gICAgICBub2RlVHlwZTogc3RyaW5nLCB0eXBlIG9mIG5vZGUgdG8gY3JlYXRlXG4gICAgICAgIC8vICAgICAgb3B0aW9uczogb2JqZWN0IHdpdGggc3R5bGUsIGNsYXNzTmFtZSwgb3IgYXR0ciBwcm9wZXJ0aWVzXG4gICAgICAgIC8vICAgICAgICAgIChjYW4gYWxzbyBiZSBvYmplY3RzKVxuICAgICAgICAvLyAgICAgIHBhcmVudDogTm9kZSwgb3B0aW9uYWwgbm9kZSB0byBhcHBlbmQgdG9cbiAgICAgICAgLy8gICAgICBwcmVwZW5kOiB0cnV0aHksIHRvIGFwcGVuZCBub2RlIGFzIHRoZSBmaXJzdCBjaGlsZFxuICAgICAgICAvL1xuICAgICAgICBpZihub2RlVHlwZS5pbmRleE9mKCc8JykgPT09IDApe1xuICAgICAgICAgICAgcmV0dXJuIHRvRG9tKG5vZGVUeXBlLCBvcHRpb25zLCBwYXJlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gb3B0aW9ucy5jc3MgfHwgb3B0aW9ucy5jbGFzc05hbWUgfHwgb3B0aW9ucy5jbGFzcyxcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVUeXBlKTtcblxuICAgICAgICBwYXJlbnQgPSBnZXROb2RlKHBhcmVudCk7XG5cbiAgICAgICAgaWYoY2xhc3NOYW1lKXtcbiAgICAgICAgICAgIG5vZGUuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBhZGRDb250ZW50KG5vZGUsIG9wdGlvbnMpO1xuICAgICAgICBcbiAgICAgICAgaWYob3B0aW9ucy5jc3NUZXh0KXtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuY3NzVGV4dCA9IG9wdGlvbnMuY3NzVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG9wdGlvbnMuaWQpe1xuICAgICAgICAgICAgbm9kZS5pZCA9IG9wdGlvbnMuaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zLnN0eWxlKXtcbiAgICAgICAgICAgIHN0eWxlKG5vZGUsIG9wdGlvbnMuc3R5bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYob3B0aW9ucy5hdHRyKXtcbiAgICAgICAgICAgIGF0dHIobm9kZSwgb3B0aW9ucy5hdHRyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHBhcmVudCAmJiBpc05vZGUocGFyZW50KSl7XG4gICAgICAgICAgICBpZihwcmVwZW5kICYmIHBhcmVudC5oYXNDaGlsZE5vZGVzKCkpe1xuICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE5leHRTaWJsaW5nIChub2RlKSB7XG4gICAgICAgIHZhciBzaWJsaW5nID0gbm9kZTtcbiAgICAgICAgd2hpbGUoc2libGluZyl7XG4gICAgICAgICAgICBzaWJsaW5nID0gc2libGluZy5uZXh0U2libGluZztcbiAgICAgICAgICAgIGlmKHNpYmxpbmcgJiYgc2libGluZy5ub2RlVHlwZSA9PT0gMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zZXJ0QWZ0ZXIgKHJlZk5vZGUsIG5vZGUpIHtcbiAgICAgICAgdmFyIHNpYmxpbmcgPSBnZXROZXh0U2libGluZyhyZWZOb2RlKTtcbiAgICAgICAgaWYoIXNpYmxpbmcpe1xuICAgICAgICAgICAgcmVmTm9kZS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJlZk5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgc2libGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpYmxpbmc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSAobm9kZSl7XG4gICAgICAgIC8vIGRlc3Ryb3lzIGEgbm9kZSBjb21wbGV0ZWx5XG4gICAgICAgIC8vXG4gICAgICAgIGlmKG5vZGUpIHtcbiAgICAgICAgICAgIGRlc3Ryb3llci5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIGRlc3Ryb3llci5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFuIChub2RlLCBkaXNwb3NlKXtcbiAgICAgICAgLy9cdFJlbW92ZXMgYWxsIGNoaWxkIG5vZGVzXG4gICAgICAgIC8vXHRcdGRpc3Bvc2U6IGRlc3Ryb3kgY2hpbGQgbm9kZXNcbiAgICAgICAgaWYoZGlzcG9zZSl7XG4gICAgICAgICAgICB3aGlsZShub2RlLmNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgZGVzdHJveShub2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZShub2RlLmNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUNoaWxkKG5vZGUuY2hpbGRyZW5bMF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYW5jZXN0b3IgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgLy8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggJ2Nsb3Nlc3QnIGFuZCAnbWF0Y2hlcydcbiAgICAgICAgLy8gZ2V0cyB0aGUgYW5jZXN0b3Igb2Ygbm9kZSBiYXNlZCBvbiBzZWxlY3RvciBjcml0ZXJpYVxuICAgICAgICAvLyB1c2VmdWwgZm9yIGdldHRpbmcgdGhlIHRhcmdldCBub2RlIHdoZW4gYSBjaGlsZCBub2RlIGlzIGNsaWNrZWQgdXBvblxuICAgICAgICAvL1xuICAgICAgICAvLyBVU0FHRVxuICAgICAgICAvLyAgICAgIG9uLnNlbGVjdG9yKGNoaWxkTm9kZSwgJy5hcHAuYWN0aXZlJyk7XG4gICAgICAgIC8vICAgICAgb24uc2VsZWN0b3IoY2hpbGROb2RlLCAnI3RoaW5nZXInKTtcbiAgICAgICAgLy8gICAgICBvbi5zZWxlY3RvcihjaGlsZE5vZGUsICdkaXYnKTtcbiAgICAgICAgLy9cdERPRVMgTk9UIFNVUFBPUlQ6XG4gICAgICAgIC8vXHRcdGNvbWJpbmF0aW9ucyBvZiBhYm92ZVxuICAgICAgICB2YXJcbiAgICAgICAgICAgIHRlc3QsXG4gICAgICAgICAgICBwYXJlbnQgPSBub2RlO1xuXG4gICAgICAgIGlmKHNlbGVjdG9yLmluZGV4T2YoJy4nKSA9PT0gMCl7XG4gICAgICAgICAgICAvLyBjbGFzc05hbWVcbiAgICAgICAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgnLicsICcgJykudHJpbSgpO1xuICAgICAgICAgICAgdGVzdCA9IGZ1bmN0aW9uKG4pe1xuICAgICAgICAgICAgICAgIHJldHVybiBuLmNsYXNzTGlzdC5jb250YWlucyhzZWxlY3Rvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZignIycpID09PSAwKXtcbiAgICAgICAgICAgIC8vIG5vZGUgaWRcbiAgICAgICAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgnIycsICcnKS50cmltKCk7XG4gICAgICAgICAgICB0ZXN0ID0gZnVuY3Rpb24obil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4uaWQgPT09IHNlbGVjdG9yO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoJ1snKSA+IC0xKXtcbiAgICAgICAgICAgIC8vIGF0dHJpYnV0ZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignYXR0cmlidXRlIHNlbGVjdG9ycyBhcmUgbm90IHlldCBzdXBwb3J0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgLy8gYXNzdW1pbmcgbm9kZSBuYW1lXG4gICAgICAgICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB0ZXN0ID0gZnVuY3Rpb24obil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4ubm9kZU5hbWUgPT09IHNlbGVjdG9yO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlKHBhcmVudCl7XG4gICAgICAgICAgICBpZihwYXJlbnQgPT09IGRvY3VtZW50LmJvZHkgfHwgcGFyZW50ID09PSBkb2N1bWVudCl7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICAgICAgaWYodGVzdChwYXJlbnQpKXsgYnJlYWs7IH1cbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICB9XG5cbiAgICBkb20uY2xhc3NMaXN0ID0ge1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICB0b0FycmF5KG5hbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBhZGQ6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICB0b0FycmF5KG5hbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjb250YWluczogZnVuY3Rpb24gKG5vZGUsIG5hbWVzKXtcbiAgICAgICAgICAgIHJldHVybiB0b0FycmF5KG5hbWVzKS5ldmVyeShmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIChub2RlLCBuYW1lcywgdmFsdWUpe1xuICAgICAgICAgICAgbmFtZXMgPSB0b0FycmF5KG5hbWVzKTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAvLyB1c2Ugc3RhbmRhcmQgZnVuY3Rpb25hbGl0eSwgc3VwcG9ydGVkIGJ5IElFXG4gICAgICAgICAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC50b2dnbGUobmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBzZWNvbmQgcGFyYW1ldGVyICBcbiAgICAgICAgICAgIGVsc2UgaWYodmFsdWUpe1xuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiB0b0FycmF5IChuYW1lcyl7XG4gICAgICAgIGlmKCFuYW1lcyl7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdkb20uY2xhc3NMaXN0IHNob3VsZCBpbmNsdWRlIGEgbm9kZSBhbmQgYSBjbGFzc05hbWUnKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZXMuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lLnRyaW0oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICAgIGRvbS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKTtcbiAgICAgICAgfTtcbiAgICB9ZWxzZXtcbiAgICAgICAgZG9tLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNiKXtcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBub3JtYWxpemUgKHZhbCl7XG4gICAgICAgIGlmKHZhbCA9PT0gJ2ZhbHNlJyl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1lbHNlIGlmKHZhbCA9PT0gJ3RydWUnKXtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFpc05hTihwYXJzZUZsb2F0KHZhbCkpKXtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBkb20ubm9ybWFsaXplID0gbm9ybWFsaXplO1xuICAgIGRvbS5jbGVhbiA9IGNsZWFuO1xuICAgIGRvbS5xdWVyeSA9IHF1ZXJ5O1xuICAgIGRvbS5xdWVyeUFsbCA9IHF1ZXJ5QWxsO1xuICAgIGRvbS5ieUlkID0gYnlJZDtcbiAgICBkb20uYXR0ciA9IGF0dHI7XG4gICAgZG9tLmJveCA9IGJveDtcbiAgICBkb20uc3R5bGUgPSBzdHlsZTtcbiAgICBkb20uZGVzdHJveSA9IGRlc3Ryb3k7XG4gICAgZG9tLnVpZCA9IHVpZDtcbiAgICBkb20uaXNOb2RlID0gaXNOb2RlO1xuICAgIGRvbS5hbmNlc3RvciA9IGFuY2VzdG9yO1xuICAgIGRvbS50b0RvbSA9IHRvRG9tO1xuICAgIGRvbS5mcm9tRG9tID0gZnJvbURvbTtcbiAgICBkb20uaW5zZXJ0QWZ0ZXIgPSBpbnNlcnRBZnRlcjtcbiAgICBkb20uZ2V0TmV4dFNpYmxpbmcgPSBnZXROZXh0U2libGluZztcblxuICAgIHJldHVybiBkb207XG59KSk7XG4iLCIvKiBnbG9iYWwgZGVmaW5lLCBLZXlib2FyZEV2ZW50LCBtb2R1bGUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICB2YXIga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ge1xuICAgIHBvbHlmaWxsOiBwb2x5ZmlsbCxcbiAgICBrZXlzOiB7XG4gICAgICAzOiAnQ2FuY2VsJyxcbiAgICAgIDY6ICdIZWxwJyxcbiAgICAgIDg6ICdCYWNrc3BhY2UnLFxuICAgICAgOTogJ1RhYicsXG4gICAgICAxMjogJ0NsZWFyJyxcbiAgICAgIDEzOiAnRW50ZXInLFxuICAgICAgMTY6ICdTaGlmdCcsXG4gICAgICAxNzogJ0NvbnRyb2wnLFxuICAgICAgMTg6ICdBbHQnLFxuICAgICAgMTk6ICdQYXVzZScsXG4gICAgICAyMDogJ0NhcHNMb2NrJyxcbiAgICAgIDI3OiAnRXNjYXBlJyxcbiAgICAgIDI4OiAnQ29udmVydCcsXG4gICAgICAyOTogJ05vbkNvbnZlcnQnLFxuICAgICAgMzA6ICdBY2NlcHQnLFxuICAgICAgMzE6ICdNb2RlQ2hhbmdlJyxcbiAgICAgIDMyOiAnICcsXG4gICAgICAzMzogJ1BhZ2VVcCcsXG4gICAgICAzNDogJ1BhZ2VEb3duJyxcbiAgICAgIDM1OiAnRW5kJyxcbiAgICAgIDM2OiAnSG9tZScsXG4gICAgICAzNzogJ0Fycm93TGVmdCcsXG4gICAgICAzODogJ0Fycm93VXAnLFxuICAgICAgMzk6ICdBcnJvd1JpZ2h0JyxcbiAgICAgIDQwOiAnQXJyb3dEb3duJyxcbiAgICAgIDQxOiAnU2VsZWN0JyxcbiAgICAgIDQyOiAnUHJpbnQnLFxuICAgICAgNDM6ICdFeGVjdXRlJyxcbiAgICAgIDQ0OiAnUHJpbnRTY3JlZW4nLFxuICAgICAgNDU6ICdJbnNlcnQnLFxuICAgICAgNDY6ICdEZWxldGUnLFxuICAgICAgNDg6IFsnMCcsICcpJ10sXG4gICAgICA0OTogWycxJywgJyEnXSxcbiAgICAgIDUwOiBbJzInLCAnQCddLFxuICAgICAgNTE6IFsnMycsICcjJ10sXG4gICAgICA1MjogWyc0JywgJyQnXSxcbiAgICAgIDUzOiBbJzUnLCAnJSddLFxuICAgICAgNTQ6IFsnNicsICdeJ10sXG4gICAgICA1NTogWyc3JywgJyYnXSxcbiAgICAgIDU2OiBbJzgnLCAnKiddLFxuICAgICAgNTc6IFsnOScsICcoJ10sXG4gICAgICA5MTogJ09TJyxcbiAgICAgIDkzOiAnQ29udGV4dE1lbnUnLFxuICAgICAgMTQ0OiAnTnVtTG9jaycsXG4gICAgICAxNDU6ICdTY3JvbGxMb2NrJyxcbiAgICAgIDE4MTogJ1ZvbHVtZU11dGUnLFxuICAgICAgMTgyOiAnVm9sdW1lRG93bicsXG4gICAgICAxODM6ICdWb2x1bWVVcCcsXG4gICAgICAxODY6IFsnOycsICc6J10sXG4gICAgICAxODc6IFsnPScsICcrJ10sXG4gICAgICAxODg6IFsnLCcsICc8J10sXG4gICAgICAxODk6IFsnLScsICdfJ10sXG4gICAgICAxOTA6IFsnLicsICc+J10sXG4gICAgICAxOTE6IFsnLycsICc/J10sXG4gICAgICAxOTI6IFsnYCcsICd+J10sXG4gICAgICAyMTk6IFsnWycsICd7J10sXG4gICAgICAyMjA6IFsnXFxcXCcsICd8J10sXG4gICAgICAyMjE6IFsnXScsICd9J10sXG4gICAgICAyMjI6IFtcIidcIiwgJ1wiJ10sXG4gICAgICAyMjQ6ICdNZXRhJyxcbiAgICAgIDIyNTogJ0FsdEdyYXBoJyxcbiAgICAgIDI0NjogJ0F0dG4nLFxuICAgICAgMjQ3OiAnQ3JTZWwnLFxuICAgICAgMjQ4OiAnRXhTZWwnLFxuICAgICAgMjQ5OiAnRXJhc2VFb2YnLFxuICAgICAgMjUwOiAnUGxheScsXG4gICAgICAyNTE6ICdab29tT3V0J1xuICAgIH1cbiAgfTtcblxuICAvLyBGdW5jdGlvbiBrZXlzIChGMS0yNCkuXG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgMjU7IGkrKykge1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzWzExMSArIGldID0gJ0YnICsgaTtcbiAgfVxuXG4gIC8vIFByaW50YWJsZSBBU0NJSSBjaGFyYWN0ZXJzLlxuICB2YXIgbGV0dGVyID0gJyc7XG4gIGZvciAoaSA9IDY1OyBpIDwgOTE7IGkrKykge1xuICAgIGxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbaV0gPSBbbGV0dGVyLnRvTG93ZXJDYXNlKCksIGxldHRlci50b1VwcGVyQ2FzZSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsICgpIHtcbiAgICBpZiAoISgnS2V5Ym9hcmRFdmVudCcgaW4gd2luZG93KSB8fFxuICAgICAgICAna2V5JyBpbiBLZXlib2FyZEV2ZW50LnByb3RvdHlwZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFBvbHlmaWxsIGBrZXlgIG9uIGBLZXlib2FyZEV2ZW50YC5cbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1t0aGlzLndoaWNoIHx8IHRoaXMua2V5Q29kZV07XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIGtleSA9IGtleVsrdGhpcy5zaGlmdEtleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfVxuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEtleWJvYXJkRXZlbnQucHJvdG90eXBlLCAna2V5JywgcHJvdG8pO1xuICAgIHJldHVybiBwcm90bztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJywga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfSBlbHNlIGlmICh3aW5kb3cpIHtcbiAgICB3aW5kb3cua2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9XG5cbn0pKCk7XG4iLCIvKiBnbG9iYWwgZGVmaW5lLCBLZXlib2FyZEV2ZW50LCBtb2R1bGUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICB2YXIga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ge1xuICAgIHBvbHlmaWxsOiBwb2x5ZmlsbCxcbiAgICBrZXlzOiB7XG4gICAgICAzOiAnQ2FuY2VsJyxcbiAgICAgIDY6ICdIZWxwJyxcbiAgICAgIDg6ICdCYWNrc3BhY2UnLFxuICAgICAgOTogJ1RhYicsXG4gICAgICAxMjogJ0NsZWFyJyxcbiAgICAgIDEzOiAnRW50ZXInLFxuICAgICAgMTY6ICdTaGlmdCcsXG4gICAgICAxNzogJ0NvbnRyb2wnLFxuICAgICAgMTg6ICdBbHQnLFxuICAgICAgMTk6ICdQYXVzZScsXG4gICAgICAyMDogJ0NhcHNMb2NrJyxcbiAgICAgIDI3OiAnRXNjYXBlJyxcbiAgICAgIDI4OiAnQ29udmVydCcsXG4gICAgICAyOTogJ05vbkNvbnZlcnQnLFxuICAgICAgMzA6ICdBY2NlcHQnLFxuICAgICAgMzE6ICdNb2RlQ2hhbmdlJyxcbiAgICAgIDMyOiAnICcsXG4gICAgICAzMzogJ1BhZ2VVcCcsXG4gICAgICAzNDogJ1BhZ2VEb3duJyxcbiAgICAgIDM1OiAnRW5kJyxcbiAgICAgIDM2OiAnSG9tZScsXG4gICAgICAzNzogJ0Fycm93TGVmdCcsXG4gICAgICAzODogJ0Fycm93VXAnLFxuICAgICAgMzk6ICdBcnJvd1JpZ2h0JyxcbiAgICAgIDQwOiAnQXJyb3dEb3duJyxcbiAgICAgIDQxOiAnU2VsZWN0JyxcbiAgICAgIDQyOiAnUHJpbnQnLFxuICAgICAgNDM6ICdFeGVjdXRlJyxcbiAgICAgIDQ0OiAnUHJpbnRTY3JlZW4nLFxuICAgICAgNDU6ICdJbnNlcnQnLFxuICAgICAgNDY6ICdEZWxldGUnLFxuICAgICAgNDg6IFsnMCcsICcpJ10sXG4gICAgICA0OTogWycxJywgJyEnXSxcbiAgICAgIDUwOiBbJzInLCAnQCddLFxuICAgICAgNTE6IFsnMycsICcjJ10sXG4gICAgICA1MjogWyc0JywgJyQnXSxcbiAgICAgIDUzOiBbJzUnLCAnJSddLFxuICAgICAgNTQ6IFsnNicsICdeJ10sXG4gICAgICA1NTogWyc3JywgJyYnXSxcbiAgICAgIDU2OiBbJzgnLCAnKiddLFxuICAgICAgNTc6IFsnOScsICcoJ10sXG4gICAgICA5MTogJ09TJyxcbiAgICAgIDkzOiAnQ29udGV4dE1lbnUnLFxuICAgICAgMTQ0OiAnTnVtTG9jaycsXG4gICAgICAxNDU6ICdTY3JvbGxMb2NrJyxcbiAgICAgIDE4MTogJ1ZvbHVtZU11dGUnLFxuICAgICAgMTgyOiAnVm9sdW1lRG93bicsXG4gICAgICAxODM6ICdWb2x1bWVVcCcsXG4gICAgICAxODY6IFsnOycsICc6J10sXG4gICAgICAxODc6IFsnPScsICcrJ10sXG4gICAgICAxODg6IFsnLCcsICc8J10sXG4gICAgICAxODk6IFsnLScsICdfJ10sXG4gICAgICAxOTA6IFsnLicsICc+J10sXG4gICAgICAxOTE6IFsnLycsICc/J10sXG4gICAgICAxOTI6IFsnYCcsICd+J10sXG4gICAgICAyMTk6IFsnWycsICd7J10sXG4gICAgICAyMjA6IFsnXFxcXCcsICd8J10sXG4gICAgICAyMjE6IFsnXScsICd9J10sXG4gICAgICAyMjI6IFtcIidcIiwgJ1wiJ10sXG4gICAgICAyMjQ6ICdNZXRhJyxcbiAgICAgIDIyNTogJ0FsdEdyYXBoJyxcbiAgICAgIDI0NjogJ0F0dG4nLFxuICAgICAgMjQ3OiAnQ3JTZWwnLFxuICAgICAgMjQ4OiAnRXhTZWwnLFxuICAgICAgMjQ5OiAnRXJhc2VFb2YnLFxuICAgICAgMjUwOiAnUGxheScsXG4gICAgICAyNTE6ICdab29tT3V0J1xuICAgIH1cbiAgfTtcblxuICAvLyBGdW5jdGlvbiBrZXlzIChGMS0yNCkuXG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgMjU7IGkrKykge1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzWzExMSArIGldID0gJ0YnICsgaTtcbiAgfVxuXG4gIC8vIFByaW50YWJsZSBBU0NJSSBjaGFyYWN0ZXJzLlxuICB2YXIgbGV0dGVyID0gJyc7XG4gIGZvciAoaSA9IDY1OyBpIDwgOTE7IGkrKykge1xuICAgIGxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbaV0gPSBbbGV0dGVyLnRvTG93ZXJDYXNlKCksIGxldHRlci50b1VwcGVyQ2FzZSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsICgpIHtcbiAgICBpZiAoISgnS2V5Ym9hcmRFdmVudCcgaW4gd2luZG93KSB8fFxuICAgICAgICAna2V5JyBpbiBLZXlib2FyZEV2ZW50LnByb3RvdHlwZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFBvbHlmaWxsIGBrZXlgIG9uIGBLZXlib2FyZEV2ZW50YC5cbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1t0aGlzLndoaWNoIHx8IHRoaXMua2V5Q29kZV07XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIGtleSA9IGtleVsrdGhpcy5zaGlmdEtleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfVxuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEtleWJvYXJkRXZlbnQucHJvdG90eXBlLCAna2V5JywgcHJvdG8pO1xuICAgIHJldHVybiBwcm90bztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJywga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfSBlbHNlIGlmICh3aW5kb3cpIHtcbiAgICB3aW5kb3cua2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9XG5cbn0pKCk7XG4vKiBVTUQuZGVmaW5lICovIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGN1c3RvbUxvYWRlciA9PT0gJ2Z1bmN0aW9uJyl7IGN1c3RvbUxvYWRlcihmYWN0b3J5LCAnb24nKTsgfWVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCl7IGRlZmluZShbXSwgZmFjdG9yeSk7IH1lbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jyl7IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpOyB9ZWxzZXsgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpOyB3aW5kb3cub24gPSBmYWN0b3J5KCk7IH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHQvLyBgb25gIGlzIGEgc2ltcGxlIGxpYnJhcnkgZm9yIGF0dGFjaGluZyBldmVudHMgdG8gbm9kZXMuIEl0cyBwcmltYXJ5IGZlYXR1cmVcblx0Ly8gaXMgaXQgcmV0dXJucyBhIGhhbmRsZSwgZnJvbSB3aGljaCB5b3UgY2FuIHBhdXNlLCByZXN1bWUgYW5kIHJlbW92ZSB0aGVcblx0Ly8gZXZlbnQuIEhhbmRsZXMgYXJlIG11Y2ggZWFzaWVyIHRvIG1hbmlwdWxhdGUgdGhhbiB1c2luZyByZW1vdmVFdmVudExpc3RlbmVyXG5cdC8vIGFuZCByZWNyZWF0aW5nIChzb21ldGltZXMgY29tcGxleCBvciByZWN1cnNpdmUpIGZ1bmN0aW9uIHNpZ25hdHVyZXMuXG5cdC8vXG5cdC8vIGBvbmAgaXMgdG91Y2gtZnJpZW5kbHkgYW5kIHdpbGwgbm9ybWFsaXplIHRvdWNoIGV2ZW50cy5cblx0Ly9cblx0Ly8gYG9uYCBhbHNvIHN1cHBvcnRzIGEgY3VzdG9tIGBjbGlja29mZmAgZXZlbnQsIHRvIGRldGVjdCBpZiB5b3UndmUgY2xpY2tlZFxuXHQvLyBhbnl3aGVyZSBpbiB0aGUgZG9jdW1lbnQgb3RoZXIgdGhhbiB0aGUgcGFzc2VkIG5vZGVcblx0Ly9cblx0Ly8gVVNBR0Vcblx0Ly8gICAgICB2YXIgaGFuZGxlID0gb24obm9kZSwgJ2NsaWNrb2ZmJywgY2FsbGJhY2spO1xuXHQvLyAgICAgIC8vICBjYWxsYmFjayBmaXJlcyBpZiBzb21ldGhpbmcgb3RoZXIgdGhhbiBub2RlIGlzIGNsaWNrZWRcblx0Ly9cblx0Ly8gVVNBR0Vcblx0Ly8gICAgICB2YXIgaGFuZGxlID0gb24obm9kZSwgJ21vdXNlZG93bicsIG9uU3RhcnQpO1xuXHQvLyAgICAgIGhhbmRsZS5wYXVzZSgpO1xuXHQvLyAgICAgIGhhbmRsZS5yZXN1bWUoKTtcblx0Ly8gICAgICBoYW5kbGUucmVtb3ZlKCk7XG5cdC8vXG5cdC8vICBgb25gIGFsc28gc3VwcG9ydHMgbXVsdGlwbGUgZXZlbnQgdHlwZXMgYXQgb25jZS4gVGhlIGZvbGxvd2luZyBleGFtcGxlIGlzXG5cdC8vICB1c2VmdWwgZm9yIGhhbmRsaW5nIGJvdGggZGVza3RvcCBtb3VzZW92ZXJzIGFuZCB0YWJsZXQgY2xpY2tzOlxuXHQvL1xuXHQvLyBVU0FHRVxuXHQvLyAgICAgIHZhciBoYW5kbGUgPSBvbihub2RlLCAnbW91c2VvdmVyLGNsaWNrJywgb25TdGFydCk7XG5cdC8vXG5cdC8vIGBvbmAgc3VwcG9ydHMgc2VsZWN0b3IgZmlsdGVycy4gVGhlIHRhcmdldGVkIGVsZW1lbnQgd2lsbCBiZSBpbiB0aGUgZXZlbnRcblx0Ly8gYXMgZmlsdGVyZWRUYXJnZXRcblx0Ly9cblx0Ly8gVVNBR0Vcblx0Ly8gICAgICBvbihub2RlLCAnY2xpY2snLCAnZGl2LnRhYiBzcGFuJywgY2FsbGJhY2spO1xuXHQvL1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvLyB2MS43LjVcblxuXHR0cnl7XG5cdFx0aWYgKHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXF1aXJlKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cua2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuXHRcdH1cblx0fWNhdGNoKGUpe1xuXHRcdGNvbnNvbGUuZXJyb3IoJ29uL3NyYy9rZXktcG9seSBpcyByZXF1aXJlZCBmb3IgdGhlIGV2ZW50LmtleSBwcm9wZXJ0eScpO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFzV2hlZWxUZXN0KCl7XG5cdFx0dmFyXG5cdFx0XHRpc0lFID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdUcmlkZW50JykgPiAtMSxcblx0XHRcdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHJldHVybiAgXCJvbndoZWVsXCIgaW4gZGl2IHx8IFwid2hlZWxcIiBpbiBkaXYgfHxcblx0XHRcdChpc0lFICYmIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoXCJFdmVudHMud2hlZWxcIiwgXCIzLjBcIikpOyAvLyBJRSBmZWF0dXJlIGRldGVjdGlvblxuXHR9XG5cblx0dmFyXG5cdFx0SU5WQUxJRF9QUk9QUyxcblx0XHRtYXRjaGVzLFxuXHRcdGhhc1doZWVsID0gaGFzV2hlZWxUZXN0KCksXG5cdFx0aXNXaW4gPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1dpbmRvd3MnKT4tMSxcblx0XHRGQUNUT1IgPSBpc1dpbiA/IDEwIDogMC4xLFxuXHRcdFhMUjggPSAwLFxuXHRcdG1vdXNlV2hlZWxIYW5kbGU7XG5cblxuXHRbJ21hdGNoZXMnLCAnbWF0Y2hlc1NlbGVjdG9yJywgJ3dlYmtpdCcsICdtb3onLCAnbXMnLCAnbyddLnNvbWUoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRpZiAobmFtZS5sZW5ndGggPCA3KSB7IC8vIHByZWZpeFxuXHRcdFx0bmFtZSArPSAnTWF0Y2hlc1NlbGVjdG9yJztcblx0XHR9XG5cdFx0aWYgKEVsZW1lbnQucHJvdG90eXBlW25hbWVdKSB7XG5cdFx0XHRtYXRjaGVzID0gbmFtZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGNsb3Nlc3QgKGVsZW1lbnQsIHNlbGVjdG9yLCBwYXJlbnQpIHtcblx0XHR3aGlsZSAoZWxlbWVudCkge1xuXHRcdFx0aWYgKGVsZW1lbnRbbWF0Y2hlc10gJiYgZWxlbWVudFttYXRjaGVzXShzZWxlY3RvcikpIHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZWxlbWVudCA9PT0gcGFyZW50KSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRmdW5jdGlvbiBjbG9zZXN0RmlsdGVyIChlbGVtZW50LCBzZWxlY3Rvcikge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0cmV0dXJuIGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yLCBlbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZU11bHRpSGFuZGxlIChoYW5kbGVzKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRoYW5kbGVzLmZvckVhY2goZnVuY3Rpb24oaCl7XG5cdFx0XHRcdFx0Ly8gYWxsb3cgZm9yIGEgc2ltcGxlIGZ1bmN0aW9uIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0aWYoaC5yZW1vdmUpIHtcblx0XHRcdFx0XHRcdGgucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fWVsc2UgaWYodHlwZW9mIGggPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0XHRcdFx0aCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGhhbmRsZXMgPSBbXTtcblx0XHRcdFx0dGhpcy5yZW1vdmUgPSB0aGlzLnBhdXNlID0gdGhpcy5yZXN1bWUgPSBmdW5jdGlvbigpe307XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbihoKXsgaWYoaC5wYXVzZSl7IGgucGF1c2UoKTsgfX0pO1xuXHRcdFx0fSxcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uKGgpeyBpZihoLnJlc3VtZSl7IGgucmVzdW1lKCk7IH19KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gb25DbGlja29mZiAobm9kZSwgY2FsbGJhY2spe1xuXHRcdC8vIGltcG9ydGFudCBub3RlIVxuXHRcdC8vIHN0YXJ0cyBwYXVzZWRcblx0XHQvL1xuXHRcdHZhclxuXHRcdFx0aGFuZGxlLFxuXHRcdFx0YkhhbmRsZSA9IG9uKGRvY3VtZW50LmJvZHksICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0dmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdFx0aWYodGFyZ2V0Lm5vZGVUeXBlICE9PSAxKXtcblx0XHRcdFx0XHR0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZih0YXJnZXQgJiYgIW5vZGUuY29udGFpbnModGFyZ2V0KSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrKGV2ZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRoYW5kbGUgPSB7XG5cdFx0XHRyZXN1bWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YkhhbmRsZS5yZXN1bWUoKTtcblx0XHRcdFx0fSwgMTAwKTtcblx0XHRcdH0sXG5cdFx0XHRwYXVzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRiSGFuZGxlLnBhdXNlKCk7XG5cdFx0XHR9LFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJIYW5kbGUucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGhhbmRsZS5wYXVzZSgpO1xuXG5cdFx0cmV0dXJuIGhhbmRsZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uSW1hZ2VMb2FkIChpbWcsIGNhbGxiYWNrKSB7XG5cdFx0ZnVuY3Rpb24gb25JbWFnZUxvYWQgKGUpIHtcblx0XHRcdFx0dmFyIGggPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYoaW1nLm5hdHVyYWxXaWR0aCl7XG5cdFx0XHRcdFx0XHRlLndpZHRoID0gaW1nLm5hdHVyYWxXaWR0aDtcblx0XHRcdFx0XHRcdGUubmF0dXJhbFdpZHRoID0gaW1nLm5hdHVyYWxXaWR0aDtcblx0XHRcdFx0XHRcdGUuaGVpZ2h0ID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG5cdFx0XHRcdFx0XHRlLm5hdHVyYWxIZWlnaHQgPSBpbWcubmF0dXJhbEhlaWdodDtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIDEwMCk7XG5cdFx0XHRpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uSW1hZ2VMb2FkKTtcblx0XHRcdGltZy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGNhbGxiYWNrKTtcblx0XHR9XG5cdFx0aW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkltYWdlTG9hZCk7XG5cdFx0aW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgY2FsbGJhY2spO1xuXHRcdHJldHVybiB7XG5cdFx0XHRwYXVzZTogZnVuY3Rpb24gKCkge30sXG5cdFx0XHRyZXN1bWU6IGZ1bmN0aW9uICgpIHt9LFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGltZy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25JbWFnZUxvYWQpO1xuXHRcdFx0XHRpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBjYWxsYmFjayk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Tm9kZShzdHIpe1xuXHRcdGlmKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKXtcblx0XHRcdHJldHVybiBzdHI7XG5cdFx0fVxuXHRcdHZhciBub2RlO1xuXHRcdGlmKC9cXCN8XFwufFxccy8udGVzdChzdHIpKXtcblx0XHRcdG5vZGUgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3Ioc3RyKTtcblx0XHR9ZWxzZXtcblx0XHRcdG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdHIpO1xuXHRcdH1cblx0XHRpZighbm9kZSl7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdsb2NhbExpYi9vbiBDb3VsZCBub3QgZmluZDonLCBzdHIpO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVdoZWVsRXZlbnQgKGNhbGxiYWNrKXtcblx0XHQvLyBub3JtYWxpemVzIGFsbCBicm93c2VycycgZXZlbnRzIHRvIGEgc3RhbmRhcmQ6XG5cdFx0Ly8gZGVsdGEsIHdoZWVsWSwgd2hlZWxYXG5cdFx0Ly8gYWxzbyBhZGRzIGFjY2VsZXJhdGlvbiBhbmQgZGVjZWxlcmF0aW9uIHRvIG1ha2Vcblx0XHQvLyBNYWMgYW5kIFdpbmRvd3MgYmVoYXZlIHNpbWlsYXJseVxuXHRcdHJldHVybiBmdW5jdGlvbihlKXtcblx0XHRcdFhMUjggKz0gRkFDVE9SO1xuXHRcdFx0dmFyXG5cdFx0XHRcdGRlbHRhWSA9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCAoZS53aGVlbERlbHRhWSB8fCBlLmRlbHRhWSkpKSxcblx0XHRcdFx0ZGVsdGFYID0gTWF0aC5tYXgoLTEwLCBNYXRoLm1pbigxMCwgKGUud2hlZWxEZWx0YVggfHwgZS5kZWx0YVgpKSk7XG5cblx0XHRcdGRlbHRhWSA9IGRlbHRhWSA8PSAwID8gZGVsdGFZIC0gWExSOCA6IGRlbHRhWSArIFhMUjg7XG5cblx0XHRcdGUuZGVsdGEgPSBkZWx0YVk7XG5cdFx0XHRlLndoZWVsWSA9IGRlbHRhWTtcblx0XHRcdGUud2hlZWxYID0gZGVsdGFYO1xuXG5cdFx0XHRjbGVhclRpbWVvdXQobW91c2VXaGVlbEhhbmRsZSk7XG5cdFx0XHRtb3VzZVdoZWVsSGFuZGxlID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRYTFI4ID0gMDtcblx0XHRcdH0sIDMwMCk7XG5cdFx0XHRjYWxsYmFjayhlKTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gb24gKG5vZGUsIGV2ZW50VHlwZSwgZmlsdGVyLCBoYW5kbGVyKXtcblx0XHQvLyAgVVNBR0Vcblx0XHQvLyAgICAgIHZhciBoYW5kbGUgPSBvbih0aGlzLm5vZGUsICdtb3VzZWRvd24nLCB0aGlzLCAnb25TdGFydCcpO1xuXHRcdC8vICAgICAgaGFuZGxlLnBhdXNlKCk7XG5cdFx0Ly8gICAgICBoYW5kbGUucmVzdW1lKCk7XG5cdFx0Ly8gICAgICBoYW5kbGUucmVtb3ZlKCk7XG5cdFx0Ly9cblx0XHR2YXJcblx0XHRcdGNhbGxiYWNrLFxuXHRcdFx0aGFuZGxlcyxcblx0XHRcdGhhbmRsZTtcblxuXHRcdGlmKC8sLy50ZXN0KGV2ZW50VHlwZSkpe1xuXHRcdFx0Ly8gaGFuZGxlIG11bHRpcGxlIGV2ZW50IHR5cGVzLCBsaWtlOlxuXHRcdFx0Ly8gb24obm9kZSwgJ21vdXNldXAsIG1vdXNlZG93bicsIGNhbGxiYWNrKTtcblx0XHRcdC8vXG5cdFx0XHRoYW5kbGVzID0gW107XG5cdFx0XHRldmVudFR5cGUuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKGVTdHIpe1xuXHRcdFx0XHRoYW5kbGVzLnB1c2gob24obm9kZSwgZVN0ci50cmltKCksIGZpbHRlciwgaGFuZGxlcikpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbWFrZU11bHRpSGFuZGxlKGhhbmRsZXMpO1xuXHRcdH1cblxuXHRcdG5vZGUgPSBnZXROb2RlKG5vZGUpO1xuXG5cdFx0aWYoZmlsdGVyICYmIGhhbmRsZXIpe1xuXHRcdFx0aWYgKHR5cGVvZiBmaWx0ZXIgPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0ZmlsdGVyID0gY2xvc2VzdEZpbHRlcihub2RlLCBmaWx0ZXIpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gZWxzZSBpdCBpcyBhIGN1c3RvbSBmdW5jdGlvblxuXHRcdFx0Y2FsbGJhY2sgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gZmlsdGVyKGUpO1xuXHRcdFx0XHRpZiAocmVzdWx0KSB7XG5cdFx0XHRcdFx0ZS5maWx0ZXJlZFRhcmdldCA9IHJlc3VsdDtcblx0XHRcdFx0XHRoYW5kbGVyKGUsIHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fWVsc2V7XG5cdFx0XHRjYWxsYmFjayA9IGZpbHRlciB8fCBoYW5kbGVyO1xuXHRcdH1cblxuXHRcdGlmKGV2ZW50VHlwZSA9PT0gJ2NsaWNrb2ZmJyl7XG5cdFx0XHQvLyBjdXN0b20gLSB1c2VkIGZvciBwb3B1cHMgJ24gc3R1ZmZcblx0XHRcdHJldHVybiBvbkNsaWNrb2ZmKG5vZGUsIGNhbGxiYWNrKTtcblx0XHR9XG5cblx0XHRpZiAoZXZlbnRUeXBlID09PSAnbG9hZCcgJiYgbm9kZS5sb2NhbE5hbWUgPT09ICdpbWcnKXtcblx0XHRcdHJldHVybiBvbkltYWdlTG9hZChub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0aWYoZXZlbnRUeXBlID09PSAnd2hlZWwnKXtcblx0XHRcdC8vIG1vdXNld2hlZWwgZXZlbnRzLCBuYXRjaFxuXHRcdFx0aWYoaGFzV2hlZWwpe1xuXHRcdFx0XHQvLyBwYXNzIHRocm91Z2gsIGJ1dCBmaXJzdCBjdXJyeSBjYWxsYmFjayB0byB3aGVlbCBldmVudHNcblx0XHRcdFx0Y2FsbGJhY2sgPSBub3JtYWxpemVXaGVlbEV2ZW50KGNhbGxiYWNrKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHQvLyBvbGQgRmlyZWZveCwgb2xkIElFLCBDaHJvbWVcblx0XHRcdFx0cmV0dXJuIG1ha2VNdWx0aUhhbmRsZShbXG5cdFx0XHRcdFx0b24obm9kZSwgJ0RPTU1vdXNlU2Nyb2xsJywgbm9ybWFsaXplV2hlZWxFdmVudChjYWxsYmFjaykpLFxuXHRcdFx0XHRcdG9uKG5vZGUsICdtb3VzZXdoZWVsJywgbm9ybWFsaXplV2hlZWxFdmVudChjYWxsYmFjaykpXG5cdFx0XHRcdF0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG5cblx0XHRoYW5kbGUgPSB7XG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0XHRub2RlID0gY2FsbGJhY2sgPSBudWxsO1xuXHRcdFx0XHR0aGlzLnJlbW92ZSA9IHRoaXMucGF1c2UgPSB0aGlzLnJlc3VtZSA9IGZ1bmN0aW9uKCl7fTtcblx0XHRcdH0sXG5cdFx0XHRwYXVzZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdH0sXG5cdFx0XHRyZXN1bWU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBoYW5kbGU7XG5cdH1cblxuXHRvbi5vbmNlID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50VHlwZSwgZmlsdGVyLCBjYWxsYmFjayl7XG5cdFx0dmFyIGg7XG5cdFx0aWYoZmlsdGVyICYmIGNhbGxiYWNrKXtcblx0XHRcdGggPSBvbihub2RlLCBldmVudFR5cGUsIGZpbHRlciwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYWxsYmFjay5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG5cdFx0XHRcdGgucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdGggPSBvbihub2RlLCBldmVudFR5cGUsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZmlsdGVyLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcblx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gaDtcblx0fTtcblxuXHRJTlZBTElEX1BST1BTID0ge1xuXHRcdGlzVHJ1c3RlZDoxXG5cdH07XG5cdGZ1bmN0aW9uIG1peChvYmplY3QsIHZhbHVlKXtcblx0XHRpZighdmFsdWUpe1xuXHRcdFx0cmV0dXJuIG9iamVjdDtcblx0XHR9XG5cdFx0aWYodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0T2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRpZighSU5WQUxJRF9QUk9QU1trZXldKSB7XG5cdFx0XHRcdFx0b2JqZWN0W2tleV0gPSB2YWx1ZVtrZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdG9iamVjdC52YWx1ZSA9IHZhbHVlO1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0b24uZW1pdCA9IGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIHZhbHVlKSB7XG5cdFx0bm9kZSA9IGdldE5vZGUobm9kZSk7XG5cdFx0dmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlKTsgLy8gZXZlbnQgdHlwZSwgYnViYmxpbmcsIGNhbmNlbGFibGVcblx0XHRyZXR1cm4gbm9kZS5kaXNwYXRjaEV2ZW50KG1peChldmVudCwgdmFsdWUpKTtcblx0fTtcblxuXHRvbi5maXJlID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcblx0XHR2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcblx0XHRldmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnROYW1lLCAhIWJ1YmJsZXMsIHRydWUsIGV2ZW50RGV0YWlsKTsgLy8gZXZlbnQgdHlwZSwgYnViYmxpbmcsIGNhbmNlbGFibGVcblx0XHRyZXR1cm4gbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fTtcblxuXHRvbi5pc0FscGhhTnVtZXJpYyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0XHRpZihzdHIubGVuZ3RoID4gMSl7IHJldHVybiBmYWxzZTsgfVxuXHRcdGlmKHN0ciA9PT0gJyAnKXsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0aWYoIWlzTmFOKE51bWJlcihzdHIpKSl7IHJldHVybiB0cnVlOyB9XG5cdFx0dmFyIGNvZGUgPSBzdHIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xuXHRcdHJldHVybiBjb2RlID49IDk3ICYmIGNvZGUgPD0gMTIyO1xuXHR9O1xuXG5cdG9uLm1ha2VNdWx0aUhhbmRsZSA9IG1ha2VNdWx0aUhhbmRsZTtcblx0b24uY2xvc2VzdCA9IGNsb3Nlc3Q7XG5cdG9uLm1hdGNoZXMgPSBtYXRjaGVzO1xuXG5cdHJldHVybiBvbjtcblxufSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGNsYXNzL2NvbXBvbmVudCBydWxlc1xuLy8gYWx3YXlzIGNhbGwgc3VwZXIoKSBmaXJzdCBpbiB0aGUgY3Rvci4gVGhpcyBhbHNvIGNhbGxzIHRoZSBleHRlbmRlZCBjbGFzcycgY3Rvci5cbi8vIGNhbm5vdCBjYWxsIE5FVyBvbiBhIENvbXBvbmVudCBjbGFzc1xuXG4vLyBDbGFzc2VzIGh0dHA6Ly9leHBsb3Jpbmdqcy5jb20vZXM2L2NoX2NsYXNzZXMuaHRtbCNfdGhlLXNwZWNpZXMtcGF0dGVybi1pbi1zdGF0aWMtbWV0aG9kc1xuXG5jb25zdCBvbiA9IHJlcXVpcmUoJ29uJyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxuY2xhc3MgQmFzZUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fdWlkID0gZG9tLnVpZCh0aGlzLmxvY2FsTmFtZSk7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0gPSB7RE9NU1RBVEU6ICdjcmVhdGVkJ307XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdCA9IFtdO1xuICAgICAgICBwbHVnaW4oJ2luaXQnLCB0aGlzKTtcbiAgICB9XG4gICAgXG4gICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnY29ubmVjdGVkJztcbiAgICAgICAgcGx1Z2luKCdwcmVDb25uZWN0ZWQnLCB0aGlzKTtcbiAgICAgICAgbmV4dFRpY2sob25DaGVja0RvbVJlYWR5LmJpbmQodGhpcykpO1xuICAgICAgICBpZiAodGhpcy5jb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maXJlKCdjb25uZWN0ZWQnKTtcbiAgICAgICAgcGx1Z2luKCdwb3N0Q29ubmVjdGVkJywgdGhpcyk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEUgPSAnZGlzY29ubmVjdGVkJztcbiAgICAgICAgcGx1Z2luKCdwcmVEaXNjb25uZWN0ZWQnLCB0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuZGlzY29ubmVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlyZSgnZGlzY29ubmVjdGVkJyk7XG4gICAgfVxuXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJOYW1lLCBvbGRWYWwsIG5ld1ZhbCkge1xuICAgICAgICBwbHVnaW4oJ3ByZUF0dHJpYnV0ZUNoYW5nZWQnLCB0aGlzLCBhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuICAgICAgICBpZiAodGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZUNoYW5nZWQoYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZmlyZSgnZGVzdHJveScpO1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICAgICAgICBoYW5kbGUucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb20uZGVzdHJveSh0aGlzKTtcbiAgICB9XG5cbiAgICBmaXJlKGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcbiAgICAgICAgcmV0dXJuIG9uLmZpcmUodGhpcywgZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcyk7XG4gICAgfVxuXG4gICAgZW1pdChldmVudE5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBvbi5lbWl0KHRoaXMsIGV2ZW50TmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdGVySGFuZGxlKFxuICAgICAgICAgICAgdHlwZW9mIG5vZGUgIT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG4gICAgICAgICAgICAgICAgb24obm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcbiAgICAgICAgICAgICAgICBvbih0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yKSk7XG4gICAgfVxuXG4gICAgb25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcbiAgICAgICAgICAgIHR5cGVvZiBub2RlICE9ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuICAgICAgICAgICAgICAgIG9uLm9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIDpcbiAgICAgICAgICAgICAgICBvbi5vbmNlKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJIYW5kbGUoaGFuZGxlKSB7XG4gICAgICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG4gICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgfVxuXG4gICAgZ2V0IERPTVNUQVRFKCkge1xuICAgICAgICByZXR1cm4gcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY2xvbmUodGVtcGxhdGUpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRlbnQgJiYgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlbikge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyXG4gICAgICAgICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICAgICAgY2xvbmVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNsb25lTm9kZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZS5pbm5lckhUTUw7XG5cbiAgICAgICAgd2hpbGUgKGNsb25lTm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmVOb2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnJhZztcbiAgICB9XG5cbiAgICBzdGF0aWMgYWRkUGx1Z2luKHBsdWcpIHtcbiAgICAgICAgdmFyIGksIG9yZGVyID0gcGx1Zy5vcmRlciB8fCAxMDA7XG4gICAgICAgIGlmICghcGx1Z2lucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBsdWdpbnMucHVzaChwbHVnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPD0gb3JkZXIpIHtcbiAgICAgICAgICAgICAgICBwbHVnaW5zLnB1c2gocGx1Zyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGx1Z2luc1swXS5vcmRlciA+IG9yZGVyKSB7XG4gICAgICAgICAgICBwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9yZGVyID09PSBwbHVnaW5zW2kgLSAxXS5vcmRlciB8fCAob3JkZXIgPiBwbHVnaW5zW2kgLSAxXS5vcmRlciAmJiBvcmRlciA8IHBsdWdpbnNbaV0ub3JkZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbnMuc3BsaWNlKGksIDAsIHBsdWcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2FzIG5vdCBpbnNlcnRlZC4uLlxuICAgICAgICAgICAgcGx1Z2lucy5wdXNoKHBsdWcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5sZXRcbiAgICBwcml2YXRlcyA9IHt9LFxuICAgIHBsdWdpbnMgPSBbXTtcblxuZnVuY3Rpb24gcGx1Z2luKG1ldGhvZCwgbm9kZSwgYSwgYiwgYykge1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Zykge1xuICAgICAgICBpZiAocGx1Z1ttZXRob2RdKSB7XG4gICAgICAgICAgICBwbHVnW21ldGhvZF0obm9kZSwgYSwgYiwgYyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gb25DaGVja0RvbVJlYWR5KCkge1xuICAgIGlmICh0aGlzLkRPTVNUQVRFICE9ICdjb25uZWN0ZWQnIHx8IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyXG4gICAgICAgIGNvdW50ID0gMCxcbiAgICAgICAgY2hpbGRyZW4gPSBnZXRDaGlsZEN1c3RvbU5vZGVzKHRoaXMpLFxuICAgICAgICBvdXJEb21SZWFkeSA9IG9uRG9tUmVhZHkuYmluZCh0aGlzKTtcblxuICAgIGZ1bmN0aW9uIGFkZFJlYWR5KCkge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoY291bnQgPT0gY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXJEb21SZWFkeSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gY2hpbGRyZW4sIHdlJ3JlIGdvb2QgLSBsZWFmIG5vZGUuIENvbW1lbmNlIHdpdGggb25Eb21SZWFkeVxuICAgIC8vXG4gICAgaWYgKCFjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgb3VyRG9tUmVhZHkoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGVsc2UsIHdhaXQgZm9yIGFsbCBjaGlsZHJlbiB0byBmaXJlIHRoZWlyIGByZWFkeWAgZXZlbnRzXG4gICAgICAgIC8vXG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBjaGlsZCBpcyBhbHJlYWR5IHJlYWR5XG4gICAgICAgICAgICBpZiAoY2hpbGQuRE9NU1RBVEUgPT0gJ2RvbXJlYWR5Jykge1xuICAgICAgICAgICAgICAgIGFkZFJlYWR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBub3QsIHdhaXQgZm9yIGV2ZW50XG4gICAgICAgICAgICBjaGlsZC5vbignZG9tcmVhZHknLCBhZGRSZWFkeSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gb25Eb21SZWFkeSgpIHtcbiAgICBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2RvbXJlYWR5JztcbiAgICAvLyBkb21SZWFkeSBzaG91bGQgb25seSBldmVyIGZpcmUgb25jZVxuICAgIHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG4gICAgcGx1Z2luKCdwcmVEb21SZWFkeScsIHRoaXMpO1xuICAgIC8vIGNhbGwgdGhpcy5kb21SZWFkeSBmaXJzdCwgc28gdGhhdCB0aGUgY29tcG9uZW50XG4gICAgLy8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcbiAgICAvLyBzdWJzZXF1ZW50IGV2ZW50c1xuICAgIGlmICh0aGlzLmRvbVJlYWR5KSB7XG4gICAgICAgIHRoaXMuZG9tUmVhZHkoKTtcbiAgICAgICAgdGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIH1cblxuICAgIHRoaXMuZmlyZSgnZG9tcmVhZHknKTtcblxuICAgIHBsdWdpbigncG9zdERvbVJlYWR5JywgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkQ3VzdG9tTm9kZXMobm9kZSkge1xuICAgIC8vIGNvbGxlY3QgYW55IGNoaWxkcmVuIHRoYXQgYXJlIGN1c3RvbSBub2Rlc1xuICAgIC8vIHVzZWQgdG8gY2hlY2sgaWYgdGhlaXIgZG9tIGlzIHJlYWR5IGJlZm9yZVxuICAgIC8vIGRldGVybWluaW5nIGlmIHRoaXMgaXMgcmVhZHlcbiAgICB2YXIgaSwgbm9kZXMgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbltpXS5ub2RlTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgICAgICAgbm9kZXMucHVzaChub2RlLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZXM7XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrKGNiKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbn1cblxud2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcbiAgICBmdW5jdGlvbiBvblJlYWR5ICgpIHtcbiAgICAgICAgY2FsbGJhY2sobm9kZSk7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcbiAgICB9XG4gICAgaWYobm9kZS5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jyl7XG4gICAgICAgIGNhbGxiYWNrKG5vZGUpO1xuICAgIH1lbHNle1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ29tcG9uZW50OyIsImNvbnN0IEJhc2VDb21wb25lbnQgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IHByb3BlcnRpZXMgPSByZXF1aXJlKCcuL3Byb3BlcnRpZXMnKTtcbmNvbnN0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZScpO1xuY29uc3QgcmVmcyA9IHJlcXVpcmUoJy4vcmVmcycpO1xuY29uc3QgaXRlbVRlbXBsYXRlID0gcmVxdWlyZSgnLi9pdGVtLXRlbXBsYXRlJyk7XG5cbi8vIGNvbnN0IGVsRGVwbG95T0xpc3RpYyA9ICdGT08nO1xuLy8gbW9kdWxlLmV4cG9ydHMgPSB7XG4vLyBcdGVsRGVwbG95T0xpc3RpYzogZWxEZXBsb3lPTGlzdGljLFxuLy8gXHRCYXNlQ29tcG9uZW50OiBCYXNlQ29tcG9uZW50LFxuLy8gXHRwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxuLy8gXHR0ZW1wbGF0ZTogdGVtcGxhdGUsXG4vLyBcdHJlZnM6IHJlZnMsXG4vLyBcdGl0ZW1UZW1wbGF0ZTogaXRlbVRlbXBsYXRlXG4vLyB9OyIsImNvbnN0IEJhc2VDb21wb25lbnQgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuY29uc3QgYWxwaGFiZXQgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0KCcnKTtcbmNvbnN0IHIgPSAvXFx7XFx7XFx3Kn19L2c7XG5cbi8vIFRPRE86IHN3aXRjaCB0byBFUzYgbGl0ZXJhbHM/IE1heWJlIG5vdC4uLlxuXG4vLyBGSVhNRTogdGltZSBjdXJyZW50IHByb2Nlc3Ncbi8vIFRyeSBhIG5ldyBvbmUgd2hlcmUgbWV0YSBkYXRhIGlzIGNyZWF0ZWQsIGluc3RlYWQgb2YgYSB0ZW1wbGF0ZVxuXG5mdW5jdGlvbiBjcmVhdGVDb25kaXRpb24obmFtZSwgdmFsdWUpIHtcbiAgICAvLyBGSVhNRSBuYW1lP1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyLCBmdW5jdGlvbiAodykge1xuICAgICAgICB3ID0gdy5yZXBsYWNlKCd7eycsICcnKS5yZXBsYWNlKCd9fScsICcnKTtcbiAgICAgICAgcmV0dXJuICdpdGVtW1wiJyArIHcgKyAnXCJdJztcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZygnY3JlYXRlQ29uZGl0aW9uJywgbmFtZSwgdmFsdWUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gZXZhbCh2YWx1ZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gd2Fsa0RvbShub2RlLCByZWZzKSB7XG5cbiAgICBsZXQgaXRlbSA9IHtcbiAgICAgICAgbm9kZTogbm9kZVxuICAgIH07XG5cbiAgICByZWZzLm5vZGVzLnB1c2goaXRlbSk7XG5cbiAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXRcbiAgICAgICAgICAgICAgICBuYW1lID0gbm9kZS5hdHRyaWJ1dGVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBub2RlLmF0dHJpYnV0ZXNbaV0udmFsdWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnICAnLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2lmJykge1xuICAgICAgICAgICAgICAgIGl0ZW0uY29uZGl0aW9uYWwgPSBjcmVhdGVDb25kaXRpb24obmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoL1xce1xcey8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAvLyA8ZGl2IGlkPVwie3tpZH19XCI+XG4gICAgICAgICAgICAgICAgcmVmcy5hdHRyaWJ1dGVzID0gcmVmcy5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGl0ZW0uYXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBjb3VsZCBiZSBtb3JlIHRoYW4gb25lPz9cbiAgICAgICAgICAgICAgICAvLyBzYW1lIHdpdGggbm9kZT9cbiAgICAgICAgICAgICAgICByZWZzLmF0dHJpYnV0ZXNbbmFtZV0gPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2hvdWxkIHByb2JhYmx5IGxvb3Agb3ZlciBjaGlsZE5vZGVzIGFuZCBjaGVjayB0ZXh0IG5vZGVzIGZvciByZXBsYWNlbWVudHNcbiAgICAvL1xuICAgIGlmICghbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKC9cXHtcXHsvLnRlc3Qobm9kZS5pbm5lckhUTUwpKSB7XG4gICAgICAgICAgICAvLyBGSVhNRSAtIGlubmVySFRNTCBhcyB2YWx1ZSB0b28gbmFpdmVcbiAgICAgICAgICAgIGxldCBwcm9wID0gbm9kZS5pbm5lckhUTUwucmVwbGFjZSgne3snLCAnJykucmVwbGFjZSgnfX0nLCAnJyk7XG4gICAgICAgICAgICBpdGVtLnRleHQgPSBpdGVtLnRleHQgfHwge307XG4gICAgICAgICAgICBpdGVtLnRleHRbcHJvcF0gPSBub2RlLmlubmVySFRNTDtcbiAgICAgICAgICAgIHJlZnNbcHJvcF0gPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgd2Fsa0RvbShub2RlLmNoaWxkcmVuW2ldLCByZWZzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUl0ZW1UZW1wbGF0ZShmcmFnKSB7XG4gICAgbGV0IHJlZnMgPSB7XG4gICAgICAgIG5vZGVzOiBbXVxuICAgIH07XG4gICAgd2Fsa0RvbShmcmFnLCByZWZzKTtcbiAgICByZXR1cm4gcmVmcztcbn1cblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyTGlzdCA9IGZ1bmN0aW9uIChpdGVtcywgY29udGFpbmVyLCBpdGVtVGVtcGxhdGUpIHtcbiAgICBsZXRcbiAgICAgICAgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgdG1wbCA9IGl0ZW1UZW1wbGF0ZSB8fCB0aGlzLml0ZW1UZW1wbGF0ZSxcbiAgICAgICAgcmVmcyA9IHRtcGwuaXRlbVJlZnMsXG4gICAgICAgIGNsb25lLFxuICAgICAgICBkZWZlcjtcblxuICAgIGZ1bmN0aW9uIHdhcm4obmFtZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVmZXIpO1xuICAgICAgICBkZWZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdBdHRlbXB0ZWQgdG8gc2V0IGF0dHJpYnV0ZSBmcm9tIG5vbi1leGlzdGVudCBpdGVtIHByb3BlcnR5OicsIG5hbWUpO1xuICAgICAgICB9LCAxKTtcbiAgICB9XG5cbiAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cbiAgICAgICAgbGV0XG4gICAgICAgICAgICBpZkNvdW50ID0gMCxcbiAgICAgICAgICAgIGRlbGV0aW9ucyA9IFtdO1xuXG4gICAgICAgIHJlZnMubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAocmVmKSB7XG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBjYW4ndCBzd2FwIGJlY2F1c2UgdGhlIGlubmVySFRNTCBpcyBiZWluZyBjaGFuZ2VkXG4gICAgICAgICAgICAvLyBjYW4ndCBjbG9uZSBiZWNhdXNlIHRoZW4gdGhlcmUgaXMgbm90IGEgbm9kZSByZWZlcmVuY2VcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBsZXRcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBub2RlID0gcmVmLm5vZGUsXG4gICAgICAgICAgICAgICAgaGFzTm9kZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAocmVmLmNvbmRpdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWYuY29uZGl0aW9uYWwoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzTm9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZkNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbid0IGFjdHVhbGx5IGRlbGV0ZSwgYmVjYXVzZSB0aGlzIGlzIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkLCBhZGRpbmcgYXR0cmlidXRlIHRvIHRyYWNrIG5vZGUsIHRvIGJlIGRlbGV0ZWQgaW4gY2xvbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBhZnRlciwgcmVtb3ZlIHRlbXBvcmFyeSBhdHRyaWJ1dGUgZnJvbSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICByZWYubm9kZS5zZXRBdHRyaWJ1dGUoJ2lmcycsIGlmQ291bnQrJycpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGlvbnMucHVzaCgnW2lmcz1cIicraWZDb3VudCsnXCJdJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc05vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVmLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVmLmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWYuYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmLm5vZGUuc2V0QXR0cmlidXRlKGtleSwgaXRlbVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N3YXAgYXR0Jywga2V5LCB2YWx1ZSwgcmVmLm5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlZi50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlZi50ZXh0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVmLnRleHRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N3YXAgdGV4dCcsIGtleSwgaXRlbVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gdmFsdWUucmVwbGFjZSh2YWx1ZSwgaXRlbVtrZXldKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNsb25lID0gdG1wbC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgZGVsZXRpb25zLmZvckVhY2goZnVuY3Rpb24gKGRlbCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKGRlbCk7XG4gICAgICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICAgICAgZG9tLmRlc3Ryb3kobm9kZSk7XG4gICAgICAgICAgICAgICAgbGV0IHRtcGxOb2RlID0gdG1wbC5xdWVyeVNlbGVjdG9yKGRlbCk7XG4gICAgICAgICAgICAgICAgdG1wbE5vZGUucmVtb3ZlQXR0cmlidXRlKCdpZnMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZyk7XG5cbiAgICAvL2l0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAvLyAgICBPYmplY3Qua2V5cyhpdGVtKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvLyAgICAgICAgaWYocmVmc1trZXldKXtcbiAgICAvLyAgICAgICAgICAgIHJlZnNba2V5XS5pbm5lckhUTUwgPSBpdGVtW2tleV07XG4gICAgLy8gICAgICAgIH1cbiAgICAvLyAgICB9KTtcbiAgICAvLyAgICBpZihyZWZzLmF0dHJpYnV0ZXMpe1xuICAgIC8vICAgICAgICBPYmplY3Qua2V5cyhyZWZzLmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAvLyAgICAgICAgICAgIGxldCBub2RlID0gcmVmcy5hdHRyaWJ1dGVzW25hbWVdO1xuICAgIC8vICAgICAgICAgICAgaWYoaXRlbVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgaXRlbVtuYW1lXSk7XG4gICAgLy8gICAgICAgICAgICB9ZWxzZXtcbiAgICAvLyAgICAgICAgICAgICAgICB3YXJuKG5hbWUpO1xuICAgIC8vICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICB9KTtcbiAgICAvLyAgICB9XG4gICAgLy9cbiAgICAvLyAgICBjbG9uZSA9IHRtcGwuY2xvbmVOb2RlKHRydWUpO1xuICAgIC8vICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIC8vfSk7XG5cbiAgICAvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnKTtcbn07XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAnaXRlbS10ZW1wbGF0ZScsXG4gICAgb3JkZXI6IDQwLFxuICAgIHByZURvbVJlYWR5OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZSA9IGRvbS5xdWVyeShub2RlLCAndGVtcGxhdGUnKTtcbiAgICAgICAgaWYgKG5vZGUuaXRlbVRlbXBsYXRlKSB7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlID0gQmFzZUNvbXBvbmVudC5jbG9uZShub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZS5pdGVtUmVmcyA9IHVwZGF0ZUl0ZW1UZW1wbGF0ZShub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbmZ1bmN0aW9uIHNldEJvb2xlYW4gKG5vZGUsIHByb3ApIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRpZihub2RlLmhhc0F0dHJpYnV0ZShwcm9wKSl7XG5cdFx0XHRcdHJldHVybiBkb20ubm9ybWFsaXplKG5vZGUuZ2V0QXR0cmlidXRlKHByb3ApKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXHRcdHNldCAodmFsdWUpIHtcblx0XHRcdGlmKHZhbHVlKXtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgJycpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKHByb3ApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnR5IChub2RlLCBwcm9wKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQgKCkge1xuXHRcdFx0cmV0dXJuIGRvbS5ub3JtYWxpemUodGhpcy5nZXRBdHRyaWJ1dGUocHJvcCkpO1xuXHRcdH0sXG5cdFx0c2V0ICh2YWx1ZSkge1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgdmFsdWUpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdCAobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0ICgpIHtcblx0XHRcdHJldHVybiB0aGlzWydfXycgKyBwcm9wXTtcblx0XHR9LFxuXHRcdHNldCAodmFsdWUpIHtcblx0XHRcdHRoaXNbJ19fJyArIHByb3BdID0gdmFsdWU7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2V0UHJvcGVydGllcyAobm9kZSkge1xuXHRsZXQgcHJvcHMgPSBub2RlLnByb3BzIHx8IG5vZGUucHJvcGVydGllcztcblx0aWYocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRpZihwcm9wID09PSAnZGlzYWJsZWQnKXtcblx0XHRcdFx0c2V0Qm9vbGVhbihub2RlLCBwcm9wKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHNldFByb3BlcnR5KG5vZGUsIHByb3ApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldEJvb2xlYW5zIChub2RlKSB7XG5cdGxldCBwcm9wcyA9IG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucztcblx0aWYocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdHMgKG5vZGUpIHtcblx0bGV0IHByb3BzID0gbm9kZS5vYmplY3RzO1xuXHRpZihwcm9wcykge1xuXHRcdHByb3BzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdHNldE9iamVjdChub2RlLCBwcm9wKTtcblx0XHR9KTtcblx0fVxufVxuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG5cdG5hbWU6ICdwcm9wZXJ0aWVzJyxcblx0b3JkZXI6IDEwLFxuXHRpbml0OiBmdW5jdGlvbiAobm9kZSkge1xuXHRcdHNldFByb3BlcnRpZXMobm9kZSk7XG5cdFx0c2V0Qm9vbGVhbnMobm9kZSk7XG5cdH0sXG5cdHByZUF0dHJpYnV0ZUNoYW5nZWQ6IGZ1bmN0aW9uIChub2RlLCBuYW1lLCB2YWx1ZSkge1xuXHRcdHRoaXNbbmFtZV0gPSBkb20ubm9ybWFsaXplKHZhbHVlKTtcblx0XHRpZighdmFsdWUgJiYgKG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucyB8fCBbXSkuaW5kZXhPZihuYW1lKSl7XG5cdFx0XHRub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9OyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5cbmZ1bmN0aW9uIGFzc2lnblJlZnMgKG5vZGUpIHtcbiAgICBkb20ucXVlcnlBbGwobm9kZSwgJ1tyZWZdJykuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3JlZicpO1xuICAgICAgICBub2RlW25hbWVdID0gY2hpbGQ7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbkV2ZW50cyAobm9kZSkge1xuICAgIC8vIDxkaXYgb249XCJjbGljazpvbkNsaWNrXCI+XG4gICAgZG9tLnF1ZXJ5QWxsKG5vZGUsICdbb25dJykuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgdmFyXG4gICAgICAgICAgICBrZXlWYWx1ZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnb24nKSxcbiAgICAgICAgICAgIGV2ZW50ID0ga2V5VmFsdWUuc3BsaXQoJzonKVswXS50cmltKCksXG4gICAgICAgICAgICBtZXRob2QgPSBrZXlWYWx1ZS5zcGxpdCgnOicpWzFdLnRyaW0oKTtcbiAgICAgICAgbm9kZS5vbihjaGlsZCwgZXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBub2RlW21ldGhvZF0oZSlcbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICdyZWZzJyxcbiAgICBvcmRlcjogMzAsXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBhc3NpZ25SZWZzKG5vZGUpO1xuICAgICAgICBhc3NpZ25FdmVudHMobm9kZSk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge307IiwiY29uc3QgQmFzZUNvbXBvbmVudCAgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuXG52YXJcbiAgICBsaWdodE5vZGVzID0ge30sXG4gICAgaW5zZXJ0ZWQgPSB7fTtcblxuZnVuY3Rpb24gaW5zZXJ0IChub2RlKSB7XG4gICAgaWYoaW5zZXJ0ZWRbbm9kZS5fdWlkXSB8fCAhaGFzVGVtcGxhdGUobm9kZSkpe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbGxlY3RMaWdodE5vZGVzKG5vZGUpO1xuICAgIGluc2VydFRlbXBsYXRlKG5vZGUpO1xuICAgIGluc2VydGVkW25vZGUuX3VpZF0gPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKXtcbiAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0gPSBsaWdodE5vZGVzW25vZGUuX3VpZF0gfHwgW107XG4gICAgd2hpbGUobm9kZS5jaGlsZE5vZGVzLmxlbmd0aCl7XG4gICAgICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXS5wdXNoKG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5jaGlsZE5vZGVzWzBdKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYXNUZW1wbGF0ZSAobm9kZSkge1xuICAgIHJldHVybiAhIW5vZGUuZ2V0VGVtcGxhdGVOb2RlKCk7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlQ2hhaW4gKG5vZGUpIHtcbiAgICB2YXIgdGVtcGxhdGVzID0gbm9kZS5nZXRUZW1wbGF0ZUNoYWluKCk7XG4gICAgdGVtcGxhdGVzLnJldmVyc2UoKS5mb3JFYWNoKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICBnZXRDb250YWluZXIobm9kZSkuYXBwZW5kQ2hpbGQoQmFzZUNvbXBvbmVudC5jbG9uZSh0ZW1wbGF0ZSkpO1xuICAgIH0pO1xuICAgIGluc2VydENoaWxkcmVuKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRUZW1wbGF0ZSAobm9kZSkge1xuICAgIGlmKG5vZGUubmVzdGVkVGVtcGxhdGUpe1xuICAgICAgICBpbnNlcnRUZW1wbGF0ZUNoYWluKG5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhclxuICAgICAgICB0ZW1wbGF0ZU5vZGUgPSBub2RlLmdldFRlbXBsYXRlTm9kZSgpO1xuXG4gICAgaWYodGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoQmFzZUNvbXBvbmVudC5jbG9uZSh0ZW1wbGF0ZU5vZGUpKTtcbiAgICB9XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbnRhaW5lciAobm9kZSkge1xuICAgIHZhciBjb250YWluZXJzID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbcmVmPVwiY29udGFpbmVyXCJdJyk7XG4gICAgaWYoIWNvbnRhaW5lcnMgfHwgIWNvbnRhaW5lcnMubGVuZ3RoKXtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXJzW2NvbnRhaW5lcnMubGVuZ3RoIC0gMV07XG59XG5cbmZ1bmN0aW9uIGluc2VydENoaWxkcmVuIChub2RlKSB7XG4gICAgdmFyIGksXG4gICAgICAgIGNvbnRhaW5lciA9IGdldENvbnRhaW5lcihub2RlKSxcbiAgICAgICAgY2hpbGRyZW4gPSBsaWdodE5vZGVzW25vZGUuX3VpZF07XG5cbiAgICBpZihjb250YWluZXIgJiYgY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0TGlnaHROb2RlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbGlnaHROb2Rlc1t0aGlzLl91aWRdO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVOb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGNhY2hpbmcgY2F1c2VzIGRpZmZlcmVudCBjbGFzc2VzIHRvIHB1bGwgdGhlIHNhbWUgdGVtcGxhdGUgLSB3YXQ/XG4gICAgLy9pZighdGhpcy50ZW1wbGF0ZU5vZGUpIHtcbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVJZCkge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSBkb20uYnlJZCh0aGlzLnRlbXBsYXRlSWQucmVwbGFjZSgnIycsJycpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnRlbXBsYXRlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlTm9kZSA9IGRvbS50b0RvbSgnPHRlbXBsYXRlPicgKyB0aGlzLnRlbXBsYXRlU3RyaW5nICsgJzwvdGVtcGxhdGU+Jyk7XG4gICAgICAgIH1cbiAgICAvL31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZU5vZGU7XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZUNoYWluID0gZnVuY3Rpb24gKCkge1xuXG4gICAgbGV0XG4gICAgICAgIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICB0ZW1wbGF0ZXMgPSBbXSxcbiAgICAgICAgdGVtcGxhdGU7XG5cbiAgICAvLyB3YWxrIHRoZSBwcm90b3R5cGUgY2hhaW47IEJhYmVsIGRvZXNuJ3QgYWxsb3cgdXNpbmdcbiAgICAvLyBgc3VwZXJgIHNpbmNlIHdlIGFyZSBvdXRzaWRlIG9mIHRoZSBDbGFzc1xuICAgIHdoaWxlKGNvbnRleHQpe1xuICAgICAgICBjb250ZXh0ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRleHQpO1xuICAgICAgICBpZighY29udGV4dCl7IGJyZWFrOyB9XG4gICAgICAgIC8vIHNraXAgcHJvdG90eXBlcyB3aXRob3V0IGEgdGVtcGxhdGVcbiAgICAgICAgLy8gKGVsc2UgaXQgd2lsbCBwdWxsIGFuIGluaGVyaXRlZCB0ZW1wbGF0ZSBhbmQgY2F1c2UgZHVwbGljYXRlcylcbiAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVTdHJpbmcnKSB8fCBjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZUlkJykpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gY29udGV4dC5nZXRUZW1wbGF0ZU5vZGUoKTtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlcy5wdXNoKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGVzO1xufTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICd0ZW1wbGF0ZScsXG4gICAgb3JkZXI6IDIwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaW5zZXJ0KG5vZGUpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9OyJdfQ==
