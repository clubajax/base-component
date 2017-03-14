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

module.exports = {
    'item-template': true
};

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

module.exports = {
	'properties': true
};

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

module.exports = {
    'refs': true
};

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

module.exports = {
    'template': true
};

},{"./BaseComponent":4,"dom":1}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tL3NyYy9kb20uanMiLCJub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb24vZGlzdC9vbi5qcyIsInNyYy9CYXNlQ29tcG9uZW50LmpzIiwic3JjL2RlcGxveS5qcyIsInNyYy9pdGVtLXRlbXBsYXRlLmpzIiwic3JjL3Byb3BlcnRpZXMuanMiLCJzcmMvcmVmcy5qcyIsInNyYy90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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VixDQUFlLFFBQWY7QUFDSDtBQUNKO0FBQ0o7QUFDRCxXQUFPLFNBQVA7QUFDSCxDQXRCRDs7QUF3QkEsY0FBYyxTQUFkLENBQXdCO0FBQ3BCLFVBQU0sVUFEYztBQUVwQixXQUFPLEVBRmE7QUFHcEIsa0JBQWMsc0JBQVUsSUFBVixFQUFnQjtBQUMxQixlQUFPLElBQVA7QUFDSDtBQUxtQixDQUF4Qjs7QUFRQSxPQUFPLE9BQVAsR0FBaUI7QUFDaEIsZ0JBQVk7QUFESSxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBVTUQuZGVmaW5lICovIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgY3VzdG9tTG9hZGVyID09PSAnZnVuY3Rpb24nKXsgY3VzdG9tTG9hZGVyKGZhY3RvcnksICdkb20nKTsgfWVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgeyBkZWZpbmUoW10sIGZhY3RvcnkpOyB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JykgeyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTsgfSBlbHNlIHsgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpOyB3aW5kb3cuZG9tID0gZmFjdG9yeSgpOyB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgY29udmVuaWVuY2UgbGlicmFyeSBmb3IgY29tbW9uIERPTSBtZXRob2RzXG4gICAgLy8gICAgICBkb20oKVxuICAgIC8vICAgICAgICAgIGNyZWF0ZSBkb20gbm9kZXNcbiAgICAvLyAgICAgIGRvbS5zdHlsZSgpXG4gICAgLy8gICAgICAgICAgc2V0L2dldCBub2RlIHN0eWxlXG4gICAgLy8gICAgICBkb20uYXR0cigpXG4gICAgLy8gICAgICAgICAgc2V0L2dldCBhdHRyaWJ1dGVzXG4gICAgLy8gICAgICBkb20uZGVzdHJveSgpXG4gICAgLy8gICAgICAgICAgb2JsaXRlcmF0ZXMgYSBub2RlXG4gICAgLy8gICAgICBkb20uYm94KClcbiAgICAvLyAgICAgICAgICBnZXQgbm9kZSBkaW1lbnNpb25zXG4gICAgLy8gICAgICBkb20udWlkKClcbiAgICAvLyAgICAgICAgICBnZXQgYSB1bmlxdWUgSUQgKG5vdCBkb20gc3BlY2lmaWMpXG4gICAgLy9cbiAgICB2YXJcbiAgICAgICAgaXNGbG9hdCA9IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgICAgICAnei1pbmRleCc6IDFcbiAgICAgICAgfSxcbiAgICAgICAgaXNEaW1lbnNpb24gPSB7XG4gICAgICAgICAgICB3aWR0aDoxLFxuICAgICAgICAgICAgaGVpZ2h0OjEsXG4gICAgICAgICAgICB0b3A6MSxcbiAgICAgICAgICAgIGxlZnQ6MSxcbiAgICAgICAgICAgIHJpZ2h0OjEsXG4gICAgICAgICAgICBib3R0b206MSxcbiAgICAgICAgICAgIG1heFdpZHRoOjEsXG4gICAgICAgICAgICAnbWF4LXdpZHRoJzoxLFxuICAgICAgICAgICAgbWluV2lkdGg6MSxcbiAgICAgICAgICAgICdtaW4td2lkdGgnOjEsXG4gICAgICAgICAgICBtYXhIZWlnaHQ6MSxcbiAgICAgICAgICAgICdtYXgtaGVpZ2h0JzoxXG4gICAgICAgIH0sXG4gICAgICAgIHVpZHMgPSB7fSxcbiAgICAgICAgZGVzdHJveWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBmdW5jdGlvbiB1aWQgKHR5cGUpe1xuICAgICAgICBpZighdWlkc1t0eXBlXSl7XG4gICAgICAgICAgICB1aWRzW3R5cGVdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkID0gdHlwZSArICctJyArICh1aWRzW3R5cGVdLmxlbmd0aCArIDEpO1xuICAgICAgICB1aWRzW3R5cGVdLnB1c2goaWQpO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNOb2RlIChpdGVtKXtcbiAgICAgICAgLy8gc2FmZXIgdGVzdCBmb3IgY3VzdG9tIGVsZW1lbnRzIGluIEZGICh3aXRoIHdjIHNoaW0pXG4gICAgICAgIHJldHVybiAhIWl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBpdGVtLmlubmVySFRNTCA9PT0gJ3N0cmluZyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Tm9kZSAoaXRlbSl7XG5cbiAgICAgICAgaWYoIWl0ZW0peyByZXR1cm4gaXRlbTsgfVxuICAgICAgICBpZih0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlLWpxdWVyeWlmeVxuICAgICAgICByZXR1cm4gaXRlbS5nZXQgPyBpdGVtLmdldCgwKSA6XG4gICAgICAgICAgICAvLyBpdGVtIGlzIGEgZG9tIG5vZGVcbiAgICAgICAgICAgIGl0ZW07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnlJZCAoaWQpe1xuICAgICAgICByZXR1cm4gZ2V0Tm9kZShpZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3R5bGUgKG5vZGUsIHByb3AsIHZhbHVlKXtcbiAgICAgICAgLy8gZ2V0L3NldCBub2RlIHN0eWxlKHMpXG4gICAgICAgIC8vICAgICAgcHJvcDogc3RyaW5nIG9yIG9iamVjdFxuICAgICAgICAvL1xuICAgICAgICB2YXIga2V5LCBjb21wdXRlZDtcbiAgICAgICAgaWYodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIC8vIG9iamVjdCBzZXR0ZXJcbiAgICAgICAgICAgIGZvcihrZXkgaW4gcHJvcCl7XG4gICAgICAgICAgICAgICAgaWYocHJvcC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUobm9kZSwga2V5LCBwcm9wW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9ZWxzZSBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IHNldHRlclxuICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0RpbWVuc2lvbltwcm9wXSl7XG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYocHJvcCA9PT0gJ3VzZXJTZWxlY3QnKXtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICEhdmFsdWUgPyAndGV4dCcgOiAnbm9uZSc7XG4gICAgICAgICAgICAgICAgc3R5bGUobm9kZSwge1xuICAgICAgICAgICAgICAgICAgICB3ZWJraXRUb3VjaENhbGxvdXQ6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB3ZWJraXRVc2VyU2VsZWN0OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAga2h0bWxVc2VyU2VsZWN0OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgbW96VXNlclNlbGVjdDogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG1zVXNlclNlbGVjdDogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldHRlciwgaWYgYSBzaW1wbGUgc3R5bGVcbiAgICAgICAgaWYobm9kZS5zdHlsZVtwcm9wXSl7XG4gICAgICAgICAgICBpZihpc0RpbWVuc2lvbltwcm9wXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG5vZGUuc3R5bGVbcHJvcF0sIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGlzRmxvYXRbcHJvcF0pe1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG5vZGUuc3R5bGVbcHJvcF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuc3R5bGVbcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXR0ZXIsIGNvbXB1dGVkXG4gICAgICAgIGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBwcm9wKTtcbiAgICAgICAgaWYoY29tcHV0ZWRbcHJvcF0pe1xuICAgICAgICAgICAgaWYoL1xcZC8udGVzdChjb21wdXRlZFtwcm9wXSkpe1xuICAgICAgICAgICAgICAgIGlmKCFpc05hTihwYXJzZUludChjb21wdXRlZFtwcm9wXSwgMTApKSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChjb21wdXRlZFtwcm9wXSwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRbcHJvcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGF0dHIgKG5vZGUsIHByb3AsIHZhbHVlKXtcbiAgICAgICAgLy8gZ2V0L3NldCBub2RlIGF0dHJpYnV0ZShzKVxuICAgICAgICAvLyAgICAgIHByb3A6IHN0cmluZyBvciBvYmplY3RcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgaWYodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIGZvcihrZXkgaW4gcHJvcCl7XG4gICAgICAgICAgICAgICAgaWYocHJvcC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIHByb3Bba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGlmKHByb3AgPT09ICd0ZXh0JyB8fCBwcm9wID09PSAnaHRtbCcgfHwgcHJvcCA9PT0gJ2lubmVySFRNTCcpe1xuICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUocHJvcCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm94IChub2RlKXtcbiAgICAgICAgaWYobm9kZSA9PT0gd2luZG93KXtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm9kZSBkaW1lbnNpb25zXG4gICAgICAgIC8vIHJldHVybmVkIG9iamVjdCBpcyBpbW11dGFibGVcbiAgICAgICAgLy8gYWRkIHNjcm9sbCBwb3NpdGlvbmluZyBhbmQgY29udmVuaWVuY2UgYWJicmV2aWF0aW9uc1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBnZXROb2RlKG5vZGUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBkaW1lbnNpb25zLnRvcCxcbiAgICAgICAgICAgIHJpZ2h0OiBkaW1lbnNpb25zLnJpZ2h0LFxuICAgICAgICAgICAgYm90dG9tOiBkaW1lbnNpb25zLmJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IGRpbWVuc2lvbnMubGVmdCxcbiAgICAgICAgICAgIGhlaWdodDogZGltZW5zaW9ucy5oZWlnaHQsXG4gICAgICAgICAgICBoOiBkaW1lbnNpb25zLmhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiBkaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgICAgdzogZGltZW5zaW9ucy53aWR0aCxcbiAgICAgICAgICAgIHNjcm9sbFk6IHdpbmRvdy5zY3JvbGxZLFxuICAgICAgICAgICAgc2Nyb2xsWDogd2luZG93LnNjcm9sbFgsXG4gICAgICAgICAgICB4OiBkaW1lbnNpb25zLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQsXG4gICAgICAgICAgICB5OiBkaW1lbnNpb25zLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHF1ZXJ5IChub2RlLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKCFzZWxlY3Rvcil7XG4gICAgICAgICAgICBzZWxlY3RvciA9IG5vZGU7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHF1ZXJ5QWxsIChub2RlLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKCFzZWxlY3Rvcil7XG4gICAgICAgICAgICBzZWxlY3RvciA9IG5vZGU7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5vZGVzID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgICBpZighbm9kZXMubGVuZ3RoKXsgcmV0dXJuIFtdOyB9XG5cbiAgICAgICAgLy8gY29udmVydCB0byBBcnJheSBhbmQgcmV0dXJuIGl0XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2Rlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9Eb20gKGh0bWwsIG9wdGlvbnMsIHBhcmVudCl7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5vZGUgZnJvbSBhbiBIVE1MIHN0cmluZ1xuICAgICAgICB2YXIgbm9kZSA9IGRvbSgnZGl2Jywge2h0bWw6IGh0bWx9KTtcbiAgICAgICAgcGFyZW50ID0gYnlJZChwYXJlbnQgfHwgb3B0aW9ucyk7XG4gICAgICAgIGlmKHBhcmVudCl7XG4gICAgICAgICAgICB3aGlsZShub2RlLmZpcnN0Q2hpbGQpe1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZihodG1sLmluZGV4T2YoJzwnKSAhPT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21Eb20gKG5vZGUpIHtcbiAgICAgICAgZnVuY3Rpb24gZ2V0QXR0cnMgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBhdHQsIGksIGF0dHJzID0ge307XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGF0dCA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICBhdHRyc1thdHQubG9jYWxOYW1lXSA9IG5vcm1hbGl6ZShhdHQudmFsdWUgPT09ICcnID8gdHJ1ZSA6IGF0dC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXR0cnM7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGV4dCAobm9kZSkge1xuICAgICAgICAgICAgdmFyIGksIHQsIHRleHQgPSAnJztcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdCA9IG5vZGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICBpZih0Lm5vZGVUeXBlID09PSAzICYmIHQudGV4dENvbnRlbnQudHJpbSgpKXtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSB0LnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSwgb2JqZWN0ID0gZ2V0QXR0cnMobm9kZSk7XG4gICAgICAgIG9iamVjdC50ZXh0ID0gZ2V0VGV4dChub2RlKTtcbiAgICAgICAgb2JqZWN0LmNoaWxkcmVuID0gW107XG4gICAgICAgIGlmKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIG9iamVjdC5jaGlsZHJlbi5wdXNoKGZyb21Eb20obm9kZS5jaGlsZHJlbltpXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ2hpbGRyZW4gKG5vZGUsIGNoaWxkcmVuKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKXtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ29udGVudCAobm9kZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgaHRtbDtcbiAgICAgICAgaWYob3B0aW9ucy5odG1sICE9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5pbm5lckhUTUwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBodG1sID0gb3B0aW9ucy5odG1sIHx8IG9wdGlvbnMuaW5uZXJIVE1MIHx8ICcnO1xuICAgICAgICAgICAgaWYodHlwZW9mIGh0bWwgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgICAgICBhZGRDaGlsZHJlbihub2RlLCBodG1sKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbWlzc2VzIHNvbWUgSFRNTCwgc3VjaCBhcyBlbnRpdGllcyAoJm5wc3A7KVxuICAgICAgICAgICAgLy9lbHNlIGlmKGh0bWwuaW5kZXhPZignPCcpID09PSAwKSB7XG4gICAgICAgICAgICAvLyAgICBub2RlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vZWxzZXtcbiAgICAgICAgICAgIC8vICAgIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaHRtbCkpO1xuICAgICAgICAgICAgLy99XG4gICAgICAgIH1cbiAgICAgICAgaWYob3B0aW9ucy50ZXh0KXtcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob3B0aW9ucy50ZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYob3B0aW9ucy5jaGlsZHJlbil7XG4gICAgICAgICAgICBhZGRDaGlsZHJlbihub2RlLCBvcHRpb25zLmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBkb20gKG5vZGVUeXBlLCBvcHRpb25zLCBwYXJlbnQsIHByZXBlbmQpe1xuICAgICAgICAvLyBjcmVhdGUgYSBub2RlXG4gICAgICAgIC8vIGlmIGZpcnN0IGFyZ3VtZW50IGlzIGEgc3RyaW5nIGFuZCBzdGFydHMgd2l0aCA8LCBpdCBpcyBhc3N1bWVkXG4gICAgICAgIC8vIHRvIHVzZSB0b0RvbSwgYW5kIGNyZWF0ZXMgYSBub2RlIGZyb20gSFRNTC4gT3B0aW9uYWwgc2Vjb25kIGFyZyBpc1xuICAgICAgICAvLyBwYXJlbnQgdG8gYXBwZW5kIHRvXG4gICAgICAgIC8vIGVsc2U6XG4gICAgICAgIC8vICAgICAgbm9kZVR5cGU6IHN0cmluZywgdHlwZSBvZiBub2RlIHRvIGNyZWF0ZVxuICAgICAgICAvLyAgICAgIG9wdGlvbnM6IG9iamVjdCB3aXRoIHN0eWxlLCBjbGFzc05hbWUsIG9yIGF0dHIgcHJvcGVydGllc1xuICAgICAgICAvLyAgICAgICAgICAoY2FuIGFsc28gYmUgb2JqZWN0cylcbiAgICAgICAgLy8gICAgICBwYXJlbnQ6IE5vZGUsIG9wdGlvbmFsIG5vZGUgdG8gYXBwZW5kIHRvXG4gICAgICAgIC8vICAgICAgcHJlcGVuZDogdHJ1dGh5LCB0byBhcHBlbmQgbm9kZSBhcyB0aGUgZmlyc3QgY2hpbGRcbiAgICAgICAgLy9cbiAgICAgICAgaWYobm9kZVR5cGUuaW5kZXhPZignPCcpID09PSAwKXtcbiAgICAgICAgICAgIHJldHVybiB0b0RvbShub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IG9wdGlvbnMuY3NzIHx8IG9wdGlvbnMuY2xhc3NOYW1lIHx8IG9wdGlvbnMuY2xhc3MsXG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlVHlwZSk7XG5cbiAgICAgICAgcGFyZW50ID0gZ2V0Tm9kZShwYXJlbnQpO1xuXG4gICAgICAgIGlmKGNsYXNzTmFtZSl7XG4gICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYWRkQ29udGVudChub2RlLCBvcHRpb25zKTtcbiAgICAgICAgXG4gICAgICAgIGlmKG9wdGlvbnMuY3NzVGV4dCl7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmNzc1RleHQgPSBvcHRpb25zLmNzc1RleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zLmlkKXtcbiAgICAgICAgICAgIG5vZGUuaWQgPSBvcHRpb25zLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYob3B0aW9ucy5zdHlsZSl7XG4gICAgICAgICAgICBzdHlsZShub2RlLCBvcHRpb25zLnN0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG9wdGlvbnMuYXR0cil7XG4gICAgICAgICAgICBhdHRyKG5vZGUsIG9wdGlvbnMuYXR0cik7XG4gICAgICAgIH1cblxuICAgICAgICBpZihwYXJlbnQgJiYgaXNOb2RlKHBhcmVudCkpe1xuICAgICAgICAgICAgaWYocHJlcGVuZCAmJiBwYXJlbnQuaGFzQ2hpbGROb2RlcygpKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudC5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXROZXh0U2libGluZyAobm9kZSkge1xuICAgICAgICB2YXIgc2libGluZyA9IG5vZGU7XG4gICAgICAgIHdoaWxlKHNpYmxpbmcpe1xuICAgICAgICAgICAgc2libGluZyA9IHNpYmxpbmcubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBpZihzaWJsaW5nICYmIHNpYmxpbmcubm9kZVR5cGUgPT09IDEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBzaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc2VydEFmdGVyIChyZWZOb2RlLCBub2RlKSB7XG4gICAgICAgIHZhciBzaWJsaW5nID0gZ2V0TmV4dFNpYmxpbmcocmVmTm9kZSk7XG4gICAgICAgIGlmKCFzaWJsaW5nKXtcbiAgICAgICAgICAgIHJlZk5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZWZOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIHNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWJsaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3kgKG5vZGUpe1xuICAgICAgICAvLyBkZXN0cm95cyBhIG5vZGUgY29tcGxldGVseVxuICAgICAgICAvL1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICBkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICBkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbiAobm9kZSwgZGlzcG9zZSl7XG4gICAgICAgIC8vXHRSZW1vdmVzIGFsbCBjaGlsZCBub2Rlc1xuICAgICAgICAvL1x0XHRkaXNwb3NlOiBkZXN0cm95IGNoaWxkIG5vZGVzXG4gICAgICAgIGlmKGRpc3Bvc2Upe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGRlc3Ryb3kobm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFuY2VzdG9yIChub2RlLCBzZWxlY3Rvcil7XG4gICAgICAgIC8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoICdjbG9zZXN0JyBhbmQgJ21hdGNoZXMnXG4gICAgICAgIC8vIGdldHMgdGhlIGFuY2VzdG9yIG9mIG5vZGUgYmFzZWQgb24gc2VsZWN0b3IgY3JpdGVyaWFcbiAgICAgICAgLy8gdXNlZnVsIGZvciBnZXR0aW5nIHRoZSB0YXJnZXQgbm9kZSB3aGVuIGEgY2hpbGQgbm9kZSBpcyBjbGlja2VkIHVwb25cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVVNBR0VcbiAgICAgICAgLy8gICAgICBvbi5zZWxlY3RvcihjaGlsZE5vZGUsICcuYXBwLmFjdGl2ZScpO1xuICAgICAgICAvLyAgICAgIG9uLnNlbGVjdG9yKGNoaWxkTm9kZSwgJyN0aGluZ2VyJyk7XG4gICAgICAgIC8vICAgICAgb24uc2VsZWN0b3IoY2hpbGROb2RlLCAnZGl2Jyk7XG4gICAgICAgIC8vXHRET0VTIE5PVCBTVVBQT1JUOlxuICAgICAgICAvL1x0XHRjb21iaW5hdGlvbnMgb2YgYWJvdmVcbiAgICAgICAgdmFyXG4gICAgICAgICAgICB0ZXN0LFxuICAgICAgICAgICAgcGFyZW50ID0gbm9kZTtcblxuICAgICAgICBpZihzZWxlY3Rvci5pbmRleE9mKCcuJykgPT09IDApe1xuICAgICAgICAgICAgLy8gY2xhc3NOYW1lXG4gICAgICAgICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoJy4nLCAnICcpLnRyaW0oKTtcbiAgICAgICAgICAgIHRlc3QgPSBmdW5jdGlvbihuKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbi5jbGFzc0xpc3QuY29udGFpbnMoc2VsZWN0b3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoJyMnKSA9PT0gMCl7XG4gICAgICAgICAgICAvLyBub2RlIGlkXG4gICAgICAgICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoJyMnLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgdGVzdCA9IGZ1bmN0aW9uKG4pe1xuICAgICAgICAgICAgICAgIHJldHVybiBuLmlkID09PSBzZWxlY3RvcjtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihzZWxlY3Rvci5pbmRleE9mKCdbJykgPiAtMSl7XG4gICAgICAgICAgICAvLyBhdHRyaWJ1dGVcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2F0dHJpYnV0ZSBzZWxlY3RvcnMgYXJlIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIC8vIGFzc3VtaW5nIG5vZGUgbmFtZVxuICAgICAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgdGVzdCA9IGZ1bmN0aW9uKG4pe1xuICAgICAgICAgICAgICAgIHJldHVybiBuLm5vZGVOYW1lID09PSBzZWxlY3RvcjtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZShwYXJlbnQpe1xuICAgICAgICAgICAgaWYocGFyZW50ID09PSBkb2N1bWVudC5ib2R5IHx8IHBhcmVudCA9PT0gZG9jdW1lbnQpeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgICAgIGlmKHRlc3QocGFyZW50KSl7IGJyZWFrOyB9XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfVxuXG4gICAgZG9tLmNsYXNzTGlzdCA9IHtcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgdG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgdG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICByZXR1cm4gdG9BcnJheShuYW1lcykuZXZlcnkoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5jbGFzc0xpc3QuY29udGFpbnMobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMsIHZhbHVlKXtcbiAgICAgICAgICAgIG5hbWVzID0gdG9BcnJheShuYW1lcyk7XG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHN0YW5kYXJkIGZ1bmN0aW9uYWxpdHksIHN1cHBvcnRlZCBieSBJRVxuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QudG9nZ2xlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCB0aGUgc2Vjb25kIHBhcmFtZXRlciAgXG4gICAgICAgICAgICBlbHNlIGlmKHZhbHVlKXtcbiAgICAgICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAobmFtZXMpe1xuICAgICAgICBpZighbmFtZXMpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZG9tLmNsYXNzTGlzdCBzaG91bGQgaW5jbHVkZSBhIG5vZGUgYW5kIGEgY2xhc3NOYW1lJyk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWVzLnNwbGl0KCcgJykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZS50cmltKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICBkb20ucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgICAgICAgc2V0VGltZW91dChjYWxsYmFjaywgMCk7XG4gICAgICAgIH07XG4gICAgfWVsc2V7XG4gICAgICAgIGRvbS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYil7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplICh2YWwpe1xuICAgICAgICBpZih2YWwgPT09ICdmYWxzZScpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9ZWxzZSBpZih2YWwgPT09ICd0cnVlJyl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZighaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSl7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgZG9tLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcbiAgICBkb20uY2xlYW4gPSBjbGVhbjtcbiAgICBkb20ucXVlcnkgPSBxdWVyeTtcbiAgICBkb20ucXVlcnlBbGwgPSBxdWVyeUFsbDtcbiAgICBkb20uYnlJZCA9IGJ5SWQ7XG4gICAgZG9tLmF0dHIgPSBhdHRyO1xuICAgIGRvbS5ib3ggPSBib3g7XG4gICAgZG9tLnN0eWxlID0gc3R5bGU7XG4gICAgZG9tLmRlc3Ryb3kgPSBkZXN0cm95O1xuICAgIGRvbS51aWQgPSB1aWQ7XG4gICAgZG9tLmlzTm9kZSA9IGlzTm9kZTtcbiAgICBkb20uYW5jZXN0b3IgPSBhbmNlc3RvcjtcbiAgICBkb20udG9Eb20gPSB0b0RvbTtcbiAgICBkb20uZnJvbURvbSA9IGZyb21Eb207XG4gICAgZG9tLmluc2VydEFmdGVyID0gaW5zZXJ0QWZ0ZXI7XG4gICAgZG9tLmdldE5leHRTaWJsaW5nID0gZ2V0TmV4dFNpYmxpbmc7XG5cbiAgICByZXR1cm4gZG9tO1xufSkpO1xuIiwiLyogZ2xvYmFsIGRlZmluZSwgS2V5Ym9hcmRFdmVudCwgbW9kdWxlICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IHtcbiAgICBwb2x5ZmlsbDogcG9seWZpbGwsXG4gICAga2V5czoge1xuICAgICAgMzogJ0NhbmNlbCcsXG4gICAgICA2OiAnSGVscCcsXG4gICAgICA4OiAnQmFja3NwYWNlJyxcbiAgICAgIDk6ICdUYWInLFxuICAgICAgMTI6ICdDbGVhcicsXG4gICAgICAxMzogJ0VudGVyJyxcbiAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgMTc6ICdDb250cm9sJyxcbiAgICAgIDE4OiAnQWx0JyxcbiAgICAgIDE5OiAnUGF1c2UnLFxuICAgICAgMjA6ICdDYXBzTG9jaycsXG4gICAgICAyNzogJ0VzY2FwZScsXG4gICAgICAyODogJ0NvbnZlcnQnLFxuICAgICAgMjk6ICdOb25Db252ZXJ0JyxcbiAgICAgIDMwOiAnQWNjZXB0JyxcbiAgICAgIDMxOiAnTW9kZUNoYW5nZScsXG4gICAgICAzMjogJyAnLFxuICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAzNTogJ0VuZCcsXG4gICAgICAzNjogJ0hvbWUnLFxuICAgICAgMzc6ICdBcnJvd0xlZnQnLFxuICAgICAgMzg6ICdBcnJvd1VwJyxcbiAgICAgIDM5OiAnQXJyb3dSaWdodCcsXG4gICAgICA0MDogJ0Fycm93RG93bicsXG4gICAgICA0MTogJ1NlbGVjdCcsXG4gICAgICA0MjogJ1ByaW50JyxcbiAgICAgIDQzOiAnRXhlY3V0ZScsXG4gICAgICA0NDogJ1ByaW50U2NyZWVuJyxcbiAgICAgIDQ1OiAnSW5zZXJ0JyxcbiAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgIDQ4OiBbJzAnLCAnKSddLFxuICAgICAgNDk6IFsnMScsICchJ10sXG4gICAgICA1MDogWycyJywgJ0AnXSxcbiAgICAgIDUxOiBbJzMnLCAnIyddLFxuICAgICAgNTI6IFsnNCcsICckJ10sXG4gICAgICA1MzogWyc1JywgJyUnXSxcbiAgICAgIDU0OiBbJzYnLCAnXiddLFxuICAgICAgNTU6IFsnNycsICcmJ10sXG4gICAgICA1NjogWyc4JywgJyonXSxcbiAgICAgIDU3OiBbJzknLCAnKCddLFxuICAgICAgOTE6ICdPUycsXG4gICAgICA5MzogJ0NvbnRleHRNZW51JyxcbiAgICAgIDE0NDogJ051bUxvY2snLFxuICAgICAgMTQ1OiAnU2Nyb2xsTG9jaycsXG4gICAgICAxODE6ICdWb2x1bWVNdXRlJyxcbiAgICAgIDE4MjogJ1ZvbHVtZURvd24nLFxuICAgICAgMTgzOiAnVm9sdW1lVXAnLFxuICAgICAgMTg2OiBbJzsnLCAnOiddLFxuICAgICAgMTg3OiBbJz0nLCAnKyddLFxuICAgICAgMTg4OiBbJywnLCAnPCddLFxuICAgICAgMTg5OiBbJy0nLCAnXyddLFxuICAgICAgMTkwOiBbJy4nLCAnPiddLFxuICAgICAgMTkxOiBbJy8nLCAnPyddLFxuICAgICAgMTkyOiBbJ2AnLCAnfiddLFxuICAgICAgMjE5OiBbJ1snLCAneyddLFxuICAgICAgMjIwOiBbJ1xcXFwnLCAnfCddLFxuICAgICAgMjIxOiBbJ10nLCAnfSddLFxuICAgICAgMjIyOiBbXCInXCIsICdcIiddLFxuICAgICAgMjI0OiAnTWV0YScsXG4gICAgICAyMjU6ICdBbHRHcmFwaCcsXG4gICAgICAyNDY6ICdBdHRuJyxcbiAgICAgIDI0NzogJ0NyU2VsJyxcbiAgICAgIDI0ODogJ0V4U2VsJyxcbiAgICAgIDI0OTogJ0VyYXNlRW9mJyxcbiAgICAgIDI1MDogJ1BsYXknLFxuICAgICAgMjUxOiAnWm9vbU91dCdcbiAgICB9XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24ga2V5cyAoRjEtMjQpLlxuICB2YXIgaTtcbiAgZm9yIChpID0gMTsgaSA8IDI1OyBpKyspIHtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1sxMTEgKyBpXSA9ICdGJyArIGk7XG4gIH1cblxuICAvLyBQcmludGFibGUgQVNDSUkgY2hhcmFjdGVycy5cbiAgdmFyIGxldHRlciA9ICcnO1xuICBmb3IgKGkgPSA2NTsgaSA8IDkxOyBpKyspIHtcbiAgICBsZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW2ldID0gW2xldHRlci50b0xvd2VyQ2FzZSgpLCBsZXR0ZXIudG9VcHBlckNhc2UoKV07XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbCAoKSB7XG4gICAgaWYgKCEoJ0tleWJvYXJkRXZlbnQnIGluIHdpbmRvdykgfHxcbiAgICAgICAgJ2tleScgaW4gS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQb2x5ZmlsbCBga2V5YCBvbiBgS2V5Ym9hcmRFdmVudGAuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbdGhpcy53aGljaCB8fCB0aGlzLmtleUNvZGVdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXlbK3RoaXMuc2hpZnRLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShLZXlib2FyZEV2ZW50LnByb3RvdHlwZSwgJ2tleScsIHByb3RvKTtcbiAgICByZXR1cm4gcHJvdG87XG4gIH1cblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcsIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgd2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfVxuXG59KSgpO1xuIiwiLyogZ2xvYmFsIGRlZmluZSwgS2V5Ym9hcmRFdmVudCwgbW9kdWxlICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IHtcbiAgICBwb2x5ZmlsbDogcG9seWZpbGwsXG4gICAga2V5czoge1xuICAgICAgMzogJ0NhbmNlbCcsXG4gICAgICA2OiAnSGVscCcsXG4gICAgICA4OiAnQmFja3NwYWNlJyxcbiAgICAgIDk6ICdUYWInLFxuICAgICAgMTI6ICdDbGVhcicsXG4gICAgICAxMzogJ0VudGVyJyxcbiAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgMTc6ICdDb250cm9sJyxcbiAgICAgIDE4OiAnQWx0JyxcbiAgICAgIDE5OiAnUGF1c2UnLFxuICAgICAgMjA6ICdDYXBzTG9jaycsXG4gICAgICAyNzogJ0VzY2FwZScsXG4gICAgICAyODogJ0NvbnZlcnQnLFxuICAgICAgMjk6ICdOb25Db252ZXJ0JyxcbiAgICAgIDMwOiAnQWNjZXB0JyxcbiAgICAgIDMxOiAnTW9kZUNoYW5nZScsXG4gICAgICAzMjogJyAnLFxuICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAzNTogJ0VuZCcsXG4gICAgICAzNjogJ0hvbWUnLFxuICAgICAgMzc6ICdBcnJvd0xlZnQnLFxuICAgICAgMzg6ICdBcnJvd1VwJyxcbiAgICAgIDM5OiAnQXJyb3dSaWdodCcsXG4gICAgICA0MDogJ0Fycm93RG93bicsXG4gICAgICA0MTogJ1NlbGVjdCcsXG4gICAgICA0MjogJ1ByaW50JyxcbiAgICAgIDQzOiAnRXhlY3V0ZScsXG4gICAgICA0NDogJ1ByaW50U2NyZWVuJyxcbiAgICAgIDQ1OiAnSW5zZXJ0JyxcbiAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgIDQ4OiBbJzAnLCAnKSddLFxuICAgICAgNDk6IFsnMScsICchJ10sXG4gICAgICA1MDogWycyJywgJ0AnXSxcbiAgICAgIDUxOiBbJzMnLCAnIyddLFxuICAgICAgNTI6IFsnNCcsICckJ10sXG4gICAgICA1MzogWyc1JywgJyUnXSxcbiAgICAgIDU0OiBbJzYnLCAnXiddLFxuICAgICAgNTU6IFsnNycsICcmJ10sXG4gICAgICA1NjogWyc4JywgJyonXSxcbiAgICAgIDU3OiBbJzknLCAnKCddLFxuICAgICAgOTE6ICdPUycsXG4gICAgICA5MzogJ0NvbnRleHRNZW51JyxcbiAgICAgIDE0NDogJ051bUxvY2snLFxuICAgICAgMTQ1OiAnU2Nyb2xsTG9jaycsXG4gICAgICAxODE6ICdWb2x1bWVNdXRlJyxcbiAgICAgIDE4MjogJ1ZvbHVtZURvd24nLFxuICAgICAgMTgzOiAnVm9sdW1lVXAnLFxuICAgICAgMTg2OiBbJzsnLCAnOiddLFxuICAgICAgMTg3OiBbJz0nLCAnKyddLFxuICAgICAgMTg4OiBbJywnLCAnPCddLFxuICAgICAgMTg5OiBbJy0nLCAnXyddLFxuICAgICAgMTkwOiBbJy4nLCAnPiddLFxuICAgICAgMTkxOiBbJy8nLCAnPyddLFxuICAgICAgMTkyOiBbJ2AnLCAnfiddLFxuICAgICAgMjE5OiBbJ1snLCAneyddLFxuICAgICAgMjIwOiBbJ1xcXFwnLCAnfCddLFxuICAgICAgMjIxOiBbJ10nLCAnfSddLFxuICAgICAgMjIyOiBbXCInXCIsICdcIiddLFxuICAgICAgMjI0OiAnTWV0YScsXG4gICAgICAyMjU6ICdBbHRHcmFwaCcsXG4gICAgICAyNDY6ICdBdHRuJyxcbiAgICAgIDI0NzogJ0NyU2VsJyxcbiAgICAgIDI0ODogJ0V4U2VsJyxcbiAgICAgIDI0OTogJ0VyYXNlRW9mJyxcbiAgICAgIDI1MDogJ1BsYXknLFxuICAgICAgMjUxOiAnWm9vbU91dCdcbiAgICB9XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24ga2V5cyAoRjEtMjQpLlxuICB2YXIgaTtcbiAgZm9yIChpID0gMTsgaSA8IDI1OyBpKyspIHtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1sxMTEgKyBpXSA9ICdGJyArIGk7XG4gIH1cblxuICAvLyBQcmludGFibGUgQVNDSUkgY2hhcmFjdGVycy5cbiAgdmFyIGxldHRlciA9ICcnO1xuICBmb3IgKGkgPSA2NTsgaSA8IDkxOyBpKyspIHtcbiAgICBsZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW2ldID0gW2xldHRlci50b0xvd2VyQ2FzZSgpLCBsZXR0ZXIudG9VcHBlckNhc2UoKV07XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbCAoKSB7XG4gICAgaWYgKCEoJ0tleWJvYXJkRXZlbnQnIGluIHdpbmRvdykgfHxcbiAgICAgICAgJ2tleScgaW4gS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQb2x5ZmlsbCBga2V5YCBvbiBgS2V5Ym9hcmRFdmVudGAuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbdGhpcy53aGljaCB8fCB0aGlzLmtleUNvZGVdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXlbK3RoaXMuc2hpZnRLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShLZXlib2FyZEV2ZW50LnByb3RvdHlwZSwgJ2tleScsIHByb3RvKTtcbiAgICByZXR1cm4gcHJvdG87XG4gIH1cblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcsIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgd2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfVxuXG59KSgpO1xuLyogVU1ELmRlZmluZSAqLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBjdXN0b21Mb2FkZXIgPT09ICdmdW5jdGlvbicpeyBjdXN0b21Mb2FkZXIoZmFjdG9yeSwgJ29uJyk7IH1lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpeyBkZWZpbmUoW10sIGZhY3RvcnkpOyB9ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpeyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTsgfWVsc2V7IHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTsgd2luZG93Lm9uID0gZmFjdG9yeSgpOyB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0Ly8gYG9uYCBpcyBhIHNpbXBsZSBsaWJyYXJ5IGZvciBhdHRhY2hpbmcgZXZlbnRzIHRvIG5vZGVzLiBJdHMgcHJpbWFyeSBmZWF0dXJlXG5cdC8vIGlzIGl0IHJldHVybnMgYSBoYW5kbGUsIGZyb20gd2hpY2ggeW91IGNhbiBwYXVzZSwgcmVzdW1lIGFuZCByZW1vdmUgdGhlXG5cdC8vIGV2ZW50LiBIYW5kbGVzIGFyZSBtdWNoIGVhc2llciB0byBtYW5pcHVsYXRlIHRoYW4gdXNpbmcgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuXHQvLyBhbmQgcmVjcmVhdGluZyAoc29tZXRpbWVzIGNvbXBsZXggb3IgcmVjdXJzaXZlKSBmdW5jdGlvbiBzaWduYXR1cmVzLlxuXHQvL1xuXHQvLyBgb25gIGlzIHRvdWNoLWZyaWVuZGx5IGFuZCB3aWxsIG5vcm1hbGl6ZSB0b3VjaCBldmVudHMuXG5cdC8vXG5cdC8vIGBvbmAgYWxzbyBzdXBwb3J0cyBhIGN1c3RvbSBgY2xpY2tvZmZgIGV2ZW50LCB0byBkZXRlY3QgaWYgeW91J3ZlIGNsaWNrZWRcblx0Ly8gYW55d2hlcmUgaW4gdGhlIGRvY3VtZW50IG90aGVyIHRoYW4gdGhlIHBhc3NlZCBub2RlXG5cdC8vXG5cdC8vIFVTQUdFXG5cdC8vICAgICAgdmFyIGhhbmRsZSA9IG9uKG5vZGUsICdjbGlja29mZicsIGNhbGxiYWNrKTtcblx0Ly8gICAgICAvLyAgY2FsbGJhY2sgZmlyZXMgaWYgc29tZXRoaW5nIG90aGVyIHRoYW4gbm9kZSBpcyBjbGlja2VkXG5cdC8vXG5cdC8vIFVTQUdFXG5cdC8vICAgICAgdmFyIGhhbmRsZSA9IG9uKG5vZGUsICdtb3VzZWRvd24nLCBvblN0YXJ0KTtcblx0Ly8gICAgICBoYW5kbGUucGF1c2UoKTtcblx0Ly8gICAgICBoYW5kbGUucmVzdW1lKCk7XG5cdC8vICAgICAgaGFuZGxlLnJlbW92ZSgpO1xuXHQvL1xuXHQvLyAgYG9uYCBhbHNvIHN1cHBvcnRzIG11bHRpcGxlIGV2ZW50IHR5cGVzIGF0IG9uY2UuIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpc1xuXHQvLyAgdXNlZnVsIGZvciBoYW5kbGluZyBib3RoIGRlc2t0b3AgbW91c2VvdmVycyBhbmQgdGFibGV0IGNsaWNrczpcblx0Ly9cblx0Ly8gVVNBR0Vcblx0Ly8gICAgICB2YXIgaGFuZGxlID0gb24obm9kZSwgJ21vdXNlb3ZlcixjbGljaycsIG9uU3RhcnQpO1xuXHQvL1xuXHQvLyBgb25gIHN1cHBvcnRzIHNlbGVjdG9yIGZpbHRlcnMuIFRoZSB0YXJnZXRlZCBlbGVtZW50IHdpbGwgYmUgaW4gdGhlIGV2ZW50XG5cdC8vIGFzIGZpbHRlcmVkVGFyZ2V0XG5cdC8vXG5cdC8vIFVTQUdFXG5cdC8vICAgICAgb24obm9kZSwgJ2NsaWNrJywgJ2Rpdi50YWIgc3BhbicsIGNhbGxiYWNrKTtcblx0Ly9cblxuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gdjEuNy41XG5cblx0dHJ5e1xuXHRcdGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmVxdWlyZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcblx0XHR9XG5cdH1jYXRjaChlKXtcblx0XHRjb25zb2xlLmVycm9yKCdvbi9zcmMva2V5LXBvbHkgaXMgcmVxdWlyZWQgZm9yIHRoZSBldmVudC5rZXkgcHJvcGVydHknKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhc1doZWVsVGVzdCgpe1xuXHRcdHZhclxuXHRcdFx0aXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignVHJpZGVudCcpID4gLTEsXG5cdFx0XHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRyZXR1cm4gIFwib253aGVlbFwiIGluIGRpdiB8fCBcIndoZWVsXCIgaW4gZGl2IHx8XG5cdFx0XHQoaXNJRSAmJiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiRXZlbnRzLndoZWVsXCIsIFwiMy4wXCIpKTsgLy8gSUUgZmVhdHVyZSBkZXRlY3Rpb25cblx0fVxuXG5cdHZhclxuXHRcdElOVkFMSURfUFJPUFMsXG5cdFx0bWF0Y2hlcyxcblx0XHRoYXNXaGVlbCA9IGhhc1doZWVsVGVzdCgpLFxuXHRcdGlzV2luID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdXaW5kb3dzJyk+LTEsXG5cdFx0RkFDVE9SID0gaXNXaW4gPyAxMCA6IDAuMSxcblx0XHRYTFI4ID0gMCxcblx0XHRtb3VzZVdoZWVsSGFuZGxlO1xuXG5cblx0WydtYXRjaGVzJywgJ21hdGNoZXNTZWxlY3RvcicsICd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nXS5zb21lKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0aWYgKG5hbWUubGVuZ3RoIDwgNykgeyAvLyBwcmVmaXhcblx0XHRcdG5hbWUgKz0gJ01hdGNoZXNTZWxlY3Rvcic7XG5cdFx0fVxuXHRcdGlmIChFbGVtZW50LnByb3RvdHlwZVtuYW1lXSkge1xuXHRcdFx0bWF0Y2hlcyA9IG5hbWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBjbG9zZXN0IChlbGVtZW50LCBzZWxlY3RvciwgcGFyZW50KSB7XG5cdFx0d2hpbGUgKGVsZW1lbnQpIHtcblx0XHRcdGlmIChlbGVtZW50W21hdGNoZXNdICYmIGVsZW1lbnRbbWF0Y2hlc10oc2VsZWN0b3IpKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVsZW1lbnQgPT09IHBhcmVudCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xvc2VzdEZpbHRlciAoZWxlbWVudCwgc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcblx0XHRcdHJldHVybiBjbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3RvciwgZWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VNdWx0aUhhbmRsZSAoaGFuZGxlcyl7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uKGgpe1xuXHRcdFx0XHRcdC8vIGFsbG93IGZvciBhIHNpbXBsZSBmdW5jdGlvbiBpbiB0aGUgbGlzdFxuXHRcdFx0XHRcdGlmKGgucmVtb3ZlKSB7XG5cdFx0XHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH1lbHNlIGlmKHR5cGVvZiBoID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHRcdGgoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRoYW5kbGVzID0gW107XG5cdFx0XHRcdHRoaXMucmVtb3ZlID0gdGhpcy5wYXVzZSA9IHRoaXMucmVzdW1lID0gZnVuY3Rpb24oKXt9O1xuXHRcdFx0fSxcblx0XHRcdHBhdXNlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRoYW5kbGVzLmZvckVhY2goZnVuY3Rpb24oaCl7IGlmKGgucGF1c2UpeyBoLnBhdXNlKCk7IH19KTtcblx0XHRcdH0sXG5cdFx0XHRyZXN1bWU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbihoKXsgaWYoaC5yZXN1bWUpeyBoLnJlc3VtZSgpOyB9fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ2xpY2tvZmYgKG5vZGUsIGNhbGxiYWNrKXtcblx0XHQvLyBpbXBvcnRhbnQgbm90ZSFcblx0XHQvLyBzdGFydHMgcGF1c2VkXG5cdFx0Ly9cblx0XHR2YXJcblx0XHRcdGhhbmRsZSxcblx0XHRcdGJIYW5kbGUgPSBvbihkb2N1bWVudC5ib2R5LCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdGlmKHRhcmdldC5ub2RlVHlwZSAhPT0gMSl7XG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodGFyZ2V0ICYmICFub2RlLmNvbnRhaW5zKHRhcmdldCkpIHtcblx0XHRcdFx0XHRjYWxsYmFjayhldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0aGFuZGxlID0ge1xuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJIYW5kbGUucmVzdW1lKCk7XG5cdFx0XHRcdH0sIDEwMCk7XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0YkhhbmRsZS5wYXVzZSgpO1xuXHRcdFx0fSxcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRiSGFuZGxlLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRoYW5kbGUucGF1c2UoKTtcblxuXHRcdHJldHVybiBoYW5kbGU7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkltYWdlTG9hZCAoaW1nLCBjYWxsYmFjaykge1xuXHRcdGZ1bmN0aW9uIG9uSW1hZ2VMb2FkIChlKSB7XG5cdFx0XHRcdHZhciBoID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKGltZy5uYXR1cmFsV2lkdGgpe1xuXHRcdFx0XHRcdFx0ZS53aWR0aCA9IGltZy5uYXR1cmFsV2lkdGg7XG5cdFx0XHRcdFx0XHRlLm5hdHVyYWxXaWR0aCA9IGltZy5uYXR1cmFsV2lkdGg7XG5cdFx0XHRcdFx0XHRlLmhlaWdodCA9IGltZy5uYXR1cmFsSGVpZ2h0O1xuXHRcdFx0XHRcdFx0ZS5uYXR1cmFsSGVpZ2h0ID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhlKTtcblx0XHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoaCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCAxMDApO1xuXHRcdFx0aW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkltYWdlTG9hZCk7XG5cdFx0XHRpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBjYWxsYmFjayk7XG5cdFx0fVxuXHRcdGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25JbWFnZUxvYWQpO1xuXHRcdGltZy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGNhbGxiYWNrKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHt9LFxuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7fSxcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uSW1hZ2VMb2FkKTtcblx0XHRcdFx0aW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgY2FsbGJhY2spO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGdldE5vZGUoc3RyKXtcblx0XHRpZih0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJyl7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0XHR2YXIgbm9kZTtcblx0XHRpZigvXFwjfFxcLnxcXHMvLnRlc3Qoc3RyKSl7XG5cdFx0XHRub2RlID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKHN0cik7XG5cdFx0fWVsc2V7XG5cdFx0XHRub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RyKTtcblx0XHR9XG5cdFx0aWYoIW5vZGUpe1xuXHRcdFx0Y29uc29sZS5lcnJvcignbG9jYWxMaWIvb24gQ291bGQgbm90IGZpbmQ6Jywgc3RyKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cblxuXHRmdW5jdGlvbiBub3JtYWxpemVXaGVlbEV2ZW50IChjYWxsYmFjayl7XG5cdFx0Ly8gbm9ybWFsaXplcyBhbGwgYnJvd3NlcnMnIGV2ZW50cyB0byBhIHN0YW5kYXJkOlxuXHRcdC8vIGRlbHRhLCB3aGVlbFksIHdoZWVsWFxuXHRcdC8vIGFsc28gYWRkcyBhY2NlbGVyYXRpb24gYW5kIGRlY2VsZXJhdGlvbiB0byBtYWtlXG5cdFx0Ly8gTWFjIGFuZCBXaW5kb3dzIGJlaGF2ZSBzaW1pbGFybHlcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSl7XG5cdFx0XHRYTFI4ICs9IEZBQ1RPUjtcblx0XHRcdHZhclxuXHRcdFx0XHRkZWx0YVkgPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgKGUud2hlZWxEZWx0YVkgfHwgZS5kZWx0YVkpKSksXG5cdFx0XHRcdGRlbHRhWCA9IE1hdGgubWF4KC0xMCwgTWF0aC5taW4oMTAsIChlLndoZWVsRGVsdGFYIHx8IGUuZGVsdGFYKSkpO1xuXG5cdFx0XHRkZWx0YVkgPSBkZWx0YVkgPD0gMCA/IGRlbHRhWSAtIFhMUjggOiBkZWx0YVkgKyBYTFI4O1xuXG5cdFx0XHRlLmRlbHRhID0gZGVsdGFZO1xuXHRcdFx0ZS53aGVlbFkgPSBkZWx0YVk7XG5cdFx0XHRlLndoZWVsWCA9IGRlbHRhWDtcblxuXHRcdFx0Y2xlYXJUaW1lb3V0KG1vdXNlV2hlZWxIYW5kbGUpO1xuXHRcdFx0bW91c2VXaGVlbEhhbmRsZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0WExSOCA9IDA7XG5cdFx0XHR9LCAzMDApO1xuXHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uIChub2RlLCBldmVudFR5cGUsIGZpbHRlciwgaGFuZGxlcil7XG5cdFx0Ly8gIFVTQUdFXG5cdFx0Ly8gICAgICB2YXIgaGFuZGxlID0gb24odGhpcy5ub2RlLCAnbW91c2Vkb3duJywgdGhpcywgJ29uU3RhcnQnKTtcblx0XHQvLyAgICAgIGhhbmRsZS5wYXVzZSgpO1xuXHRcdC8vICAgICAgaGFuZGxlLnJlc3VtZSgpO1xuXHRcdC8vICAgICAgaGFuZGxlLnJlbW92ZSgpO1xuXHRcdC8vXG5cdFx0dmFyXG5cdFx0XHRjYWxsYmFjayxcblx0XHRcdGhhbmRsZXMsXG5cdFx0XHRoYW5kbGU7XG5cblx0XHRpZigvLC8udGVzdChldmVudFR5cGUpKXtcblx0XHRcdC8vIGhhbmRsZSBtdWx0aXBsZSBldmVudCB0eXBlcywgbGlrZTpcblx0XHRcdC8vIG9uKG5vZGUsICdtb3VzZXVwLCBtb3VzZWRvd24nLCBjYWxsYmFjayk7XG5cdFx0XHQvL1xuXHRcdFx0aGFuZGxlcyA9IFtdO1xuXHRcdFx0ZXZlbnRUeXBlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihlU3RyKXtcblx0XHRcdFx0aGFuZGxlcy5wdXNoKG9uKG5vZGUsIGVTdHIudHJpbSgpLCBmaWx0ZXIsIGhhbmRsZXIpKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1ha2VNdWx0aUhhbmRsZShoYW5kbGVzKTtcblx0XHR9XG5cblx0XHRub2RlID0gZ2V0Tm9kZShub2RlKTtcblxuXHRcdGlmKGZpbHRlciAmJiBoYW5kbGVyKXtcblx0XHRcdGlmICh0eXBlb2YgZmlsdGVyID09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGZpbHRlciA9IGNsb3Nlc3RGaWx0ZXIobm9kZSwgZmlsdGVyKTtcblx0XHRcdH1cblx0XHRcdC8vIGVsc2UgaXQgaXMgYSBjdXN0b20gZnVuY3Rpb25cblx0XHRcdGNhbGxiYWNrID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IGZpbHRlcihlKTtcblx0XHRcdFx0aWYgKHJlc3VsdCkge1xuXHRcdFx0XHRcdGUuZmlsdGVyZWRUYXJnZXQgPSByZXN1bHQ7XG5cdFx0XHRcdFx0aGFuZGxlcihlLCByZXN1bHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1lbHNle1xuXHRcdFx0Y2FsbGJhY2sgPSBmaWx0ZXIgfHwgaGFuZGxlcjtcblx0XHR9XG5cblx0XHRpZihldmVudFR5cGUgPT09ICdjbGlja29mZicpe1xuXHRcdFx0Ly8gY3VzdG9tIC0gdXNlZCBmb3IgcG9wdXBzICduIHN0dWZmXG5cdFx0XHRyZXR1cm4gb25DbGlja29mZihub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50VHlwZSA9PT0gJ2xvYWQnICYmIG5vZGUubG9jYWxOYW1lID09PSAnaW1nJyl7XG5cdFx0XHRyZXR1cm4gb25JbWFnZUxvYWQobm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdGlmKGV2ZW50VHlwZSA9PT0gJ3doZWVsJyl7XG5cdFx0XHQvLyBtb3VzZXdoZWVsIGV2ZW50cywgbmF0Y2hcblx0XHRcdGlmKGhhc1doZWVsKXtcblx0XHRcdFx0Ly8gcGFzcyB0aHJvdWdoLCBidXQgZmlyc3QgY3VycnkgY2FsbGJhY2sgdG8gd2hlZWwgZXZlbnRzXG5cdFx0XHRcdGNhbGxiYWNrID0gbm9ybWFsaXplV2hlZWxFdmVudChjYWxsYmFjayk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Ly8gb2xkIEZpcmVmb3gsIG9sZCBJRSwgQ2hyb21lXG5cdFx0XHRcdHJldHVybiBtYWtlTXVsdGlIYW5kbGUoW1xuXHRcdFx0XHRcdG9uKG5vZGUsICdET01Nb3VzZVNjcm9sbCcsIG5vcm1hbGl6ZVdoZWVsRXZlbnQoY2FsbGJhY2spKSxcblx0XHRcdFx0XHRvbihub2RlLCAnbW91c2V3aGVlbCcsIG5vcm1hbGl6ZVdoZWVsRXZlbnQoY2FsbGJhY2spKVxuXHRcdFx0XHRdKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuXG5cdFx0aGFuZGxlID0ge1xuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdFx0bm9kZSA9IGNhbGxiYWNrID0gbnVsbDtcblx0XHRcdFx0dGhpcy5yZW1vdmUgPSB0aGlzLnBhdXNlID0gdGhpcy5yZXN1bWUgPSBmdW5jdGlvbigpe307XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG5cdFx0XHR9LFxuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gaGFuZGxlO1xuXHR9XG5cblx0b24ub25jZSA9IGZ1bmN0aW9uIChub2RlLCBldmVudFR5cGUsIGZpbHRlciwgY2FsbGJhY2spe1xuXHRcdHZhciBoO1xuXHRcdGlmKGZpbHRlciAmJiBjYWxsYmFjayl7XG5cdFx0XHRoID0gb24obm9kZSwgZXZlbnRUeXBlLCBmaWx0ZXIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y2FsbGJhY2suYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xuXHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRoID0gb24obm9kZSwgZXZlbnRUeXBlLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZpbHRlci5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG5cdFx0XHRcdGgucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGg7XG5cdH07XG5cblx0SU5WQUxJRF9QUk9QUyA9IHtcblx0XHRpc1RydXN0ZWQ6MVxuXHR9O1xuXHRmdW5jdGlvbiBtaXgob2JqZWN0LCB2YWx1ZSl7XG5cdFx0aWYoIXZhbHVlKXtcblx0XHRcdHJldHVybiBvYmplY3Q7XG5cdFx0fVxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYoIUlOVkFMSURfUFJPUFNba2V5XSkge1xuXHRcdFx0XHRcdG9iamVjdFtrZXldID0gdmFsdWVba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRvYmplY3QudmFsdWUgPSB2YWx1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdG9uLmVtaXQgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCB2YWx1ZSkge1xuXHRcdG5vZGUgPSBnZXROb2RlKG5vZGUpO1xuXHRcdHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0ZXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgdHJ1ZSk7IC8vIGV2ZW50IHR5cGUsIGJ1YmJsaW5nLCBjYW5jZWxhYmxlXG5cdFx0cmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChtaXgoZXZlbnQsIHZhbHVlKSk7XG5cdH07XG5cblx0b24uZmlyZSA9IGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG5cdFx0dmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG5cdFx0ZXZlbnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgISFidWJibGVzLCB0cnVlLCBldmVudERldGFpbCk7IC8vIGV2ZW50IHR5cGUsIGJ1YmJsaW5nLCBjYW5jZWxhYmxlXG5cdFx0cmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH07XG5cblx0b24uaXNBbHBoYU51bWVyaWMgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdFx0aWYoc3RyLmxlbmd0aCA+IDEpeyByZXR1cm4gZmFsc2U7IH1cblx0XHRpZihzdHIgPT09ICcgJyl7IHJldHVybiBmYWxzZTsgfVxuXHRcdGlmKCFpc05hTihOdW1iZXIoc3RyKSkpeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdHZhciBjb2RlID0gc3RyLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcblx0XHRyZXR1cm4gY29kZSA+PSA5NyAmJiBjb2RlIDw9IDEyMjtcblx0fTtcblxuXHRvbi5tYWtlTXVsdGlIYW5kbGUgPSBtYWtlTXVsdGlIYW5kbGU7XG5cdG9uLmNsb3Nlc3QgPSBjbG9zZXN0O1xuXHRvbi5tYXRjaGVzID0gbWF0Y2hlcztcblxuXHRyZXR1cm4gb247XG5cbn0pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBjbGFzcy9jb21wb25lbnQgcnVsZXNcbi8vIGFsd2F5cyBjYWxsIHN1cGVyKCkgZmlyc3QgaW4gdGhlIGN0b3IuIFRoaXMgYWxzbyBjYWxscyB0aGUgZXh0ZW5kZWQgY2xhc3MnIGN0b3IuXG4vLyBjYW5ub3QgY2FsbCBORVcgb24gYSBDb21wb25lbnQgY2xhc3NcblxuLy8gQ2xhc3NlcyBodHRwOi8vZXhwbG9yaW5nanMuY29tL2VzNi9jaF9jbGFzc2VzLmh0bWwjX3RoZS1zcGVjaWVzLXBhdHRlcm4taW4tc3RhdGljLW1ldGhvZHNcblxuY29uc3Qgb24gPSByZXF1aXJlKCdvbicpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbmNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3VpZCA9IGRvbS51aWQodGhpcy5sb2NhbE5hbWUpO1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdID0ge0RPTVNUQVRFOiAnY3JlYXRlZCd9O1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QgPSBbXTtcbiAgICAgICAgcGx1Z2luKCdpbml0JywgdGhpcyk7XG4gICAgfVxuICAgIFxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Nvbm5lY3RlZCc7XG4gICAgICAgIHBsdWdpbigncHJlQ29ubmVjdGVkJywgdGhpcyk7XG4gICAgICAgIG5leHRUaWNrKG9uQ2hlY2tEb21SZWFkeS5iaW5kKHRoaXMpKTtcbiAgICAgICAgaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlyZSgnY29ubmVjdGVkJyk7XG4gICAgICAgIHBsdWdpbigncG9zdENvbm5lY3RlZCcsIHRoaXMpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG4gICAgICAgIHBsdWdpbigncHJlRGlzY29ubmVjdGVkJywgdGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmRpc2Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpcmUoJ2Rpc2Nvbm5lY3RlZCcpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcbiAgICAgICAgcGx1Z2luKCdwcmVBdHRyaWJ1dGVDaGFuZ2VkJywgdGhpcywgYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcbiAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmZpcmUoJ2Rlc3Ryb3knKTtcbiAgICAgICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9tLmRlc3Ryb3kodGhpcyk7XG4gICAgfVxuXG4gICAgZmlyZShldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG4gICAgICAgIHJldHVybiBvbi5maXJlKHRoaXMsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpO1xuICAgIH1cblxuICAgIGVtaXQoZXZlbnROYW1lLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBvbihub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcbiAgICAgICAgICAgIHR5cGVvZiBub2RlICE9ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuICAgICAgICAgICAgICAgIG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG4gICAgICAgICAgICAgICAgb24odGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvcikpO1xuICAgIH1cblxuICAgIG9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG4gICAgICAgICAgICB0eXBlb2Ygbm9kZSAhPSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcbiAgICAgICAgICAgICAgICBvbi5vbmNlKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG4gICAgICAgICAgICAgICAgb24ub25jZSh0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVySGFuZGxlKGhhbmRsZSkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QucHVzaChoYW5kbGUpO1xuICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgIH1cblxuICAgIGdldCBET01TVEFURSgpIHtcbiAgICAgICAgcmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsb25lKHRlbXBsYXRlKSB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZW50ICYmIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhclxuICAgICAgICAgICAgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgICAgIGNsb25lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG4gICAgICAgIHdoaWxlIChjbG9uZU5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lTm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZyYWc7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFBsdWdpbihwbHVnKSB7XG4gICAgICAgIHZhciBpLCBvcmRlciA9IHBsdWcub3JkZXIgfHwgMTAwO1xuICAgICAgICBpZiAoIXBsdWdpbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwbHVnaW5zLnB1c2gocGx1Zyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGx1Z2lucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGlmIChwbHVnaW5zWzBdLm9yZGVyIDw9IG9yZGVyKSB7XG4gICAgICAgICAgICAgICAgcGx1Z2lucy5wdXNoKHBsdWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPiBvcmRlcikge1xuICAgICAgICAgICAgcGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChvcmRlciA9PT0gcGx1Z2luc1tpIC0gMV0ub3JkZXIgfHwgKG9yZGVyID4gcGx1Z2luc1tpIC0gMV0ub3JkZXIgJiYgb3JkZXIgPCBwbHVnaW5zW2ldLm9yZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdhcyBub3QgaW5zZXJ0ZWQuLi5cbiAgICAgICAgICAgIHBsdWdpbnMucHVzaChwbHVnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubGV0XG4gICAgcHJpdmF0ZXMgPSB7fSxcbiAgICBwbHVnaW5zID0gW107XG5cbmZ1bmN0aW9uIHBsdWdpbihtZXRob2QsIG5vZGUsIGEsIGIsIGMpIHtcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWcpIHtcbiAgICAgICAgaWYgKHBsdWdbbWV0aG9kXSkge1xuICAgICAgICAgICAgcGx1Z1ttZXRob2RdKG5vZGUsIGEsIGIsIGMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hlY2tEb21SZWFkeSgpIHtcbiAgICBpZiAodGhpcy5ET01TVEFURSAhPSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhclxuICAgICAgICBjb3VudCA9IDAsXG4gICAgICAgIGNoaWxkcmVuID0gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyh0aGlzKSxcbiAgICAgICAgb3VyRG9tUmVhZHkgPSBvbkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cbiAgICBmdW5jdGlvbiBhZGRSZWFkeSgpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgaWYgKGNvdW50ID09IGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgb3VyRG9tUmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG5vIGNoaWxkcmVuLCB3ZSdyZSBnb29kIC0gbGVhZiBub2RlLiBDb21tZW5jZSB3aXRoIG9uRG9tUmVhZHlcbiAgICAvL1xuICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIG91ckRvbVJlYWR5KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuICAgICAgICAvL1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgY2hpbGQgaXMgYWxyZWFkeSByZWFkeVxuICAgICAgICAgICAgaWYgKGNoaWxkLkRPTVNUQVRFID09ICdkb21yZWFkeScpIHtcbiAgICAgICAgICAgICAgICBhZGRSZWFkeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgbm90LCB3YWl0IGZvciBldmVudFxuICAgICAgICAgICAgY2hpbGQub24oJ2RvbXJlYWR5JywgYWRkUmVhZHkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9tUmVhZHkoKSB7XG4gICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG4gICAgLy8gZG9tUmVhZHkgc2hvdWxkIG9ubHkgZXZlciBmaXJlIG9uY2VcbiAgICBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPSB0cnVlO1xuICAgIHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcbiAgICAvLyBjYWxsIHRoaXMuZG9tUmVhZHkgZmlyc3QsIHNvIHRoYXQgdGhlIGNvbXBvbmVudFxuICAgIC8vIGNhbiBmaW5pc2ggaW5pdGlhbGl6aW5nIGJlZm9yZSBmaXJpbmcgYW55XG4gICAgLy8gc3Vic2VxdWVudCBldmVudHNcbiAgICBpZiAodGhpcy5kb21SZWFkeSkge1xuICAgICAgICB0aGlzLmRvbVJlYWR5KCk7XG4gICAgICAgIHRoaXMuZG9tUmVhZHkgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cbiAgICBwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzKG5vZGUpIHtcbiAgICAvLyBjb2xsZWN0IGFueSBjaGlsZHJlbiB0aGF0IGFyZSBjdXN0b20gbm9kZXNcbiAgICAvLyB1c2VkIHRvIGNoZWNrIGlmIHRoZWlyIGRvbSBpcyByZWFkeSBiZWZvcmVcbiAgICAvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG4gICAgdmFyIGksIG5vZGVzID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW5baV0ubm9kZU5hbWUuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZS5jaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayhjYikge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYik7XG59XG5cbndpbmRvdy5vbkRvbVJlYWR5ID0gZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgZnVuY3Rpb24gb25SZWFkeSAoKSB7XG4gICAgICAgIGNhbGxiYWNrKG5vZGUpO1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG4gICAgfVxuICAgIGlmKG5vZGUuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpe1xuICAgICAgICBjYWxsYmFjayhub2RlKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbXBvbmVudDsiLCJjb25zdCBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi9wcm9wZXJ0aWVzJyk7XG5jb25zdCB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKTtcbmNvbnN0IHJlZnMgPSByZXF1aXJlKCcuL3JlZnMnKTtcbmNvbnN0IGl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vaXRlbS10ZW1wbGF0ZScpO1xuXG4vLyBjb25zdCBlbERlcGxveU9MaXN0aWMgPSAnRk9PJztcbi8vIG1vZHVsZS5leHBvcnRzID0ge1xuLy8gXHRlbERlcGxveU9MaXN0aWM6IGVsRGVwbG95T0xpc3RpYyxcbi8vIFx0QmFzZUNvbXBvbmVudDogQmFzZUNvbXBvbmVudCxcbi8vIFx0cHJvcGVydGllczogcHJvcGVydGllcyxcbi8vIFx0dGVtcGxhdGU6IHRlbXBsYXRlLFxuLy8gXHRyZWZzOiByZWZzLFxuLy8gXHRpdGVtVGVtcGxhdGU6IGl0ZW1UZW1wbGF0ZVxuLy8gfTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcbmNvbnN0IGFscGhhYmV0ID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jy5zcGxpdCgnJyk7XG5jb25zdCByID0gL1xce1xce1xcdyp9fS9nO1xuXG4vLyBUT0RPOiBzd2l0Y2ggdG8gRVM2IGxpdGVyYWxzPyBNYXliZSBub3QuLi5cblxuLy8gRklYTUU6IHRpbWUgY3VycmVudCBwcm9jZXNzXG4vLyBUcnkgYSBuZXcgb25lIHdoZXJlIG1ldGEgZGF0YSBpcyBjcmVhdGVkLCBpbnN0ZWFkIG9mIGEgdGVtcGxhdGVcblxuZnVuY3Rpb24gY3JlYXRlQ29uZGl0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgLy8gRklYTUUgbmFtZT9cbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UociwgZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgdyA9IHcucmVwbGFjZSgne3snLCAnJykucmVwbGFjZSgnfX0nLCAnJyk7XG4gICAgICAgIHJldHVybiAnaXRlbVtcIicgKyB3ICsgJ1wiXSc7XG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coJ2NyZWF0ZUNvbmRpdGlvbicsIG5hbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGV2YWwodmFsdWUpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHdhbGtEb20obm9kZSwgcmVmcykge1xuXG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICAgIG5vZGU6IG5vZGVcbiAgICB9O1xuXG4gICAgcmVmcy5ub2Rlcy5wdXNoKGl0ZW0pO1xuXG4gICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vZGUuYXR0cmlidXRlc1tpXS5uYW1lLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gbm9kZS5hdHRyaWJ1dGVzW2ldLnZhbHVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyAgJywgbmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdpZicpIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNvbmRpdGlvbmFsID0gY3JlYXRlQ29uZGl0aW9uKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKC9cXHtcXHsvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgLy8gPGRpdiBpZD1cInt7aWR9fVwiPlxuICAgICAgICAgICAgICAgIHJlZnMuYXR0cmlidXRlcyA9IHJlZnMuYXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBpdGVtLmF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gY291bGQgYmUgbW9yZSB0aGFuIG9uZT8/XG4gICAgICAgICAgICAgICAgLy8gc2FtZSB3aXRoIG5vZGU/XG4gICAgICAgICAgICAgICAgcmVmcy5hdHRyaWJ1dGVzW25hbWVdID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNob3VsZCBwcm9iYWJseSBsb29wIG92ZXIgY2hpbGROb2RlcyBhbmQgY2hlY2sgdGV4dCBub2RlcyBmb3IgcmVwbGFjZW1lbnRzXG4gICAgLy9cbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIGlmICgvXFx7XFx7Ly50ZXN0KG5vZGUuaW5uZXJIVE1MKSkge1xuICAgICAgICAgICAgLy8gRklYTUUgLSBpbm5lckhUTUwgYXMgdmFsdWUgdG9vIG5haXZlXG4gICAgICAgICAgICBsZXQgcHJvcCA9IG5vZGUuaW5uZXJIVE1MLnJlcGxhY2UoJ3t7JywgJycpLnJlcGxhY2UoJ319JywgJycpO1xuICAgICAgICAgICAgaXRlbS50ZXh0ID0gaXRlbS50ZXh0IHx8IHt9O1xuICAgICAgICAgICAgaXRlbS50ZXh0W3Byb3BdID0gbm9kZS5pbm5lckhUTUw7XG4gICAgICAgICAgICByZWZzW3Byb3BdID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHdhbGtEb20obm9kZS5jaGlsZHJlbltpXSwgcmVmcyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVJdGVtVGVtcGxhdGUoZnJhZykge1xuICAgIGxldCByZWZzID0ge1xuICAgICAgICBub2RlczogW11cbiAgICB9O1xuICAgIHdhbGtEb20oZnJhZywgcmVmcyk7XG4gICAgcmV0dXJuIHJlZnM7XG59XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLnJlbmRlckxpc3QgPSBmdW5jdGlvbiAoaXRlbXMsIGNvbnRhaW5lciwgaXRlbVRlbXBsYXRlKSB7XG4gICAgbGV0XG4gICAgICAgIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG4gICAgICAgIHRtcGwgPSBpdGVtVGVtcGxhdGUgfHwgdGhpcy5pdGVtVGVtcGxhdGUsXG4gICAgICAgIHJlZnMgPSB0bXBsLml0ZW1SZWZzLFxuICAgICAgICBjbG9uZSxcbiAgICAgICAgZGVmZXI7XG5cbiAgICBmdW5jdGlvbiB3YXJuKG5hbWUpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGRlZmVyKTtcbiAgICAgICAgZGVmZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQXR0ZW1wdGVkIHRvIHNldCBhdHRyaWJ1dGUgZnJvbSBub24tZXhpc3RlbnQgaXRlbSBwcm9wZXJ0eTonLCBuYW1lKTtcbiAgICAgICAgfSwgMSk7XG4gICAgfVxuXG4gICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXG4gICAgICAgIGxldFxuICAgICAgICAgICAgaWZDb3VudCA9IDAsXG4gICAgICAgICAgICBkZWxldGlvbnMgPSBbXTtcblxuICAgICAgICByZWZzLm5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHJlZikge1xuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gY2FuJ3Qgc3dhcCBiZWNhdXNlIHRoZSBpbm5lckhUTUwgaXMgYmVpbmcgY2hhbmdlZFxuICAgICAgICAgICAgLy8gY2FuJ3QgY2xvbmUgYmVjYXVzZSB0aGVuIHRoZXJlIGlzIG5vdCBhIG5vZGUgcmVmZXJlbmNlXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgbGV0XG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgbm9kZSA9IHJlZi5ub2RlLFxuICAgICAgICAgICAgICAgIGhhc05vZGUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHJlZi5jb25kaXRpb25hbCkge1xuICAgICAgICAgICAgICAgIGlmICghcmVmLmNvbmRpdGlvbmFsKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc05vZGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWZDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4ndCBhY3R1YWxseSBkZWxldGUsIGJlY2F1c2UgdGhpcyBpcyB0aGUgb3JpZ2luYWwgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zdGVhZCwgYWRkaW5nIGF0dHJpYnV0ZSB0byB0cmFjayBub2RlLCB0byBiZSBkZWxldGVkIGluIGNsb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gYWZ0ZXIsIHJlbW92ZSB0ZW1wb3JhcnkgYXR0cmlidXRlIGZyb20gdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgcmVmLm5vZGUuc2V0QXR0cmlidXRlKCdpZnMnLCBpZkNvdW50KycnKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRpb25zLnB1c2goJ1tpZnM9XCInK2lmQ291bnQrJ1wiXScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZi5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlZi5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVmLmF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZi5ub2RlLnNldEF0dHJpYnV0ZShrZXksIGl0ZW1ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzd2FwIGF0dCcsIGtleSwgdmFsdWUsIHJlZi5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZWYudGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZWYudGV4dCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZi50ZXh0W2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzd2FwIHRleHQnLCBrZXksIGl0ZW1ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmlubmVySFRNTCA9IHZhbHVlLnJlcGxhY2UodmFsdWUsIGl0ZW1ba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjbG9uZSA9IHRtcGwuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgIGRlbGV0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChkZWwpIHtcbiAgICAgICAgICAgIGxldCBub2RlID0gY2xvbmUucXVlcnlTZWxlY3RvcihkZWwpO1xuICAgICAgICAgICAgaWYobm9kZSkge1xuICAgICAgICAgICAgICAgIGRvbS5kZXN0cm95KG5vZGUpO1xuICAgICAgICAgICAgICAgIGxldCB0bXBsTm9kZSA9IHRtcGwucXVlcnlTZWxlY3RvcihkZWwpO1xuICAgICAgICAgICAgICAgIHRtcGxOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnaWZzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWcpO1xuXG4gICAgLy9pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgLy8gICAgT2JqZWN0LmtleXMoaXRlbSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgLy8gICAgICAgIGlmKHJlZnNba2V5XSl7XG4gICAgLy8gICAgICAgICAgICByZWZzW2tleV0uaW5uZXJIVE1MID0gaXRlbVtrZXldO1xuICAgIC8vICAgICAgICB9XG4gICAgLy8gICAgfSk7XG4gICAgLy8gICAgaWYocmVmcy5hdHRyaWJ1dGVzKXtcbiAgICAvLyAgICAgICAgT2JqZWN0LmtleXMocmVmcy5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgLy8gICAgICAgICAgICBsZXQgbm9kZSA9IHJlZnMuYXR0cmlidXRlc1tuYW1lXTtcbiAgICAvLyAgICAgICAgICAgIGlmKGl0ZW1bbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgIC8vICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIGl0ZW1bbmFtZV0pO1xuICAgIC8vICAgICAgICAgICAgfWVsc2V7XG4gICAgLy8gICAgICAgICAgICAgICAgd2FybihuYW1lKTtcbiAgICAvLyAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgfSk7XG4gICAgLy8gICAgfVxuICAgIC8vXG4gICAgLy8gICAgY2xvbmUgPSB0bXBsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAvLyAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAvL30pO1xuXG4gICAgLy9jb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZyk7XG59O1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ2l0ZW0tdGVtcGxhdGUnLFxuICAgIG9yZGVyOiA0MCxcbiAgICBwcmVEb21SZWFkeTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUgPSBkb20ucXVlcnkobm9kZSwgJ3RlbXBsYXRlJyk7XG4gICAgICAgIGlmIChub2RlLml0ZW1UZW1wbGF0ZSkge1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZSA9IEJhc2VDb21wb25lbnQuY2xvbmUobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUuaXRlbVJlZnMgPSB1cGRhdGVJdGVtVGVtcGxhdGUobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHQnaXRlbS10ZW1wbGF0ZSc6IHRydWVcbn07IiwiY29uc3QgQmFzZUNvbXBvbmVudCAgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuXG5mdW5jdGlvbiBzZXRCb29sZWFuIChub2RlLCBwcm9wKSB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlLCBwcm9wLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQgKCkge1xuXHRcdFx0aWYobm9kZS5oYXNBdHRyaWJ1dGUocHJvcCkpe1xuXHRcdFx0XHRyZXR1cm4gZG9tLm5vcm1hbGl6ZShub2RlLmdldEF0dHJpYnV0ZShwcm9wKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHRzZXQgKHZhbHVlKSB7XG5cdFx0XHRpZih2YWx1ZSl7XG5cdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKHByb3AsICcnKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eSAobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0ICgpIHtcblx0XHRcdHJldHVybiBkb20ubm9ybWFsaXplKHRoaXMuZ2V0QXR0cmlidXRlKHByb3ApKTtcblx0XHR9LFxuXHRcdHNldCAodmFsdWUpIHtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKHByb3AsIHZhbHVlKTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRPYmplY3QgKG5vZGUsIHByb3ApIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1snX18nICsgcHJvcF07XG5cdFx0fSxcblx0XHRzZXQgKHZhbHVlKSB7XG5cdFx0XHR0aGlzWydfXycgKyBwcm9wXSA9IHZhbHVlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXMgKG5vZGUpIHtcblx0bGV0IHByb3BzID0gbm9kZS5wcm9wcyB8fCBub2RlLnByb3BlcnRpZXM7XG5cdGlmKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0aWYocHJvcCA9PT0gJ2Rpc2FibGVkJyl7XG5cdFx0XHRcdHNldEJvb2xlYW4obm9kZSwgcHJvcCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzZXRQcm9wZXJ0eShub2RlLCBwcm9wKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXRCb29sZWFucyAobm9kZSkge1xuXHRsZXQgcHJvcHMgPSBub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnM7XG5cdGlmKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0Qm9vbGVhbihub2RlLCBwcm9wKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXRPYmplY3RzIChub2RlKSB7XG5cdGxldCBwcm9wcyA9IG5vZGUub2JqZWN0cztcblx0aWYocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRzZXRPYmplY3Qobm9kZSwgcHJvcCk7XG5cdFx0fSk7XG5cdH1cbn1cblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuXHRuYW1lOiAncHJvcGVydGllcycsXG5cdG9yZGVyOiAxMCxcblx0aW5pdDogZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRzZXRQcm9wZXJ0aWVzKG5vZGUpO1xuXHRcdHNldEJvb2xlYW5zKG5vZGUpO1xuXHR9LFxuXHRwcmVBdHRyaWJ1dGVDaGFuZ2VkOiBmdW5jdGlvbiAobm9kZSwgbmFtZSwgdmFsdWUpIHtcblx0XHR0aGlzW25hbWVdID0gZG9tLm5vcm1hbGl6ZSh2YWx1ZSk7XG5cdFx0aWYoIXZhbHVlICYmIChub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnMgfHwgW10pLmluZGV4T2YobmFtZSkpe1xuXHRcdFx0bm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0fVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdCdwcm9wZXJ0aWVzJzogdHJ1ZVxufTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuXG5mdW5jdGlvbiBhc3NpZ25SZWZzIChub2RlKSB7XG4gICAgZG9tLnF1ZXJ5QWxsKG5vZGUsICdbcmVmXScpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhciBuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGNoaWxkO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhc3NpZ25FdmVudHMgKG5vZGUpIHtcbiAgICAvLyA8ZGl2IG9uPVwiY2xpY2s6b25DbGlja1wiPlxuICAgIGRvbS5xdWVyeUFsbChub2RlLCAnW29uXScpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAga2V5VmFsdWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ29uJyksXG4gICAgICAgICAgICBldmVudCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMF0udHJpbSgpLFxuICAgICAgICAgICAgbWV0aG9kID0ga2V5VmFsdWUuc3BsaXQoJzonKVsxXS50cmltKCk7XG4gICAgICAgIG5vZGUub24oY2hpbGQsIGV2ZW50LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbm9kZVttZXRob2RdKGUpXG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAncmVmcycsXG4gICAgb3JkZXI6IDMwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgYXNzaWduUmVmcyhub2RlKTtcbiAgICAgICAgYXNzaWduRXZlbnRzKG5vZGUpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0J3JlZnMnOiB0cnVlXG59OyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxudmFyXG4gICAgbGlnaHROb2RlcyA9IHt9LFxuICAgIGluc2VydGVkID0ge307XG5cbmZ1bmN0aW9uIGluc2VydCAobm9kZSkge1xuICAgIGlmKGluc2VydGVkW25vZGUuX3VpZF0gfHwgIWhhc1RlbXBsYXRlKG5vZGUpKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKTtcbiAgICBpbnNlcnRUZW1wbGF0ZShub2RlKTtcbiAgICBpbnNlcnRlZFtub2RlLl91aWRdID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdExpZ2h0Tm9kZXMobm9kZSl7XG4gICAgbGlnaHROb2Rlc1tub2RlLl91aWRdID0gbGlnaHROb2Rlc1tub2RlLl91aWRdIHx8IFtdO1xuICAgIHdoaWxlKG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpe1xuICAgICAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0ucHVzaChub2RlLnJlbW92ZUNoaWxkKG5vZGUuY2hpbGROb2Rlc1swXSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFzVGVtcGxhdGUgKG5vZGUpIHtcbiAgICByZXR1cm4gISFub2RlLmdldFRlbXBsYXRlTm9kZSgpO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRUZW1wbGF0ZUNoYWluIChub2RlKSB7XG4gICAgdmFyIHRlbXBsYXRlcyA9IG5vZGUuZ2V0VGVtcGxhdGVDaGFpbigpO1xuICAgIHRlbXBsYXRlcy5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgZ2V0Q29udGFpbmVyKG5vZGUpLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGUpKTtcbiAgICB9KTtcbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGUgKG5vZGUpIHtcbiAgICBpZihub2RlLm5lc3RlZFRlbXBsYXRlKXtcbiAgICAgICAgaW5zZXJ0VGVtcGxhdGVDaGFpbihub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXJcbiAgICAgICAgdGVtcGxhdGVOb2RlID0gbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcblxuICAgIGlmKHRlbXBsYXRlTm9kZSkge1xuICAgICAgICBub2RlLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGVOb2RlKSk7XG4gICAgfVxuICAgIGluc2VydENoaWxkcmVuKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250YWluZXIgKG5vZGUpIHtcbiAgICB2YXIgY29udGFpbmVycyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW3JlZj1cImNvbnRhaW5lclwiXScpO1xuICAgIGlmKCFjb250YWluZXJzIHx8ICFjb250YWluZXJzLmxlbmd0aCl7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyc1tjb250YWluZXJzLmxlbmd0aCAtIDFdO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRDaGlsZHJlbiAobm9kZSkge1xuICAgIHZhciBpLFxuICAgICAgICBjb250YWluZXIgPSBnZXRDb250YWluZXIobm9kZSksXG4gICAgICAgIGNoaWxkcmVuID0gbGlnaHROb2Rlc1tub2RlLl91aWRdO1xuXG4gICAgaWYoY29udGFpbmVyICYmIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgIGZvcihpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldExpZ2h0Tm9kZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxpZ2h0Tm9kZXNbdGhpcy5fdWlkXTtcbn07XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBjYWNoaW5nIGNhdXNlcyBkaWZmZXJlbnQgY2xhc3NlcyB0byBwdWxsIHRoZSBzYW1lIHRlbXBsYXRlIC0gd2F0P1xuICAgIC8vaWYoIXRoaXMudGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlSWQpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gZG9tLmJ5SWQodGhpcy50ZW1wbGF0ZUlkLnJlcGxhY2UoJyMnLCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy50ZW1wbGF0ZVN0cmluZykge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSBkb20udG9Eb20oJzx0ZW1wbGF0ZT4nICsgdGhpcy50ZW1wbGF0ZVN0cmluZyArICc8L3RlbXBsYXRlPicpO1xuICAgICAgICB9XG4gICAgLy99XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVOb2RlO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVDaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGxldFxuICAgICAgICBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgdGVtcGxhdGVzID0gW10sXG4gICAgICAgIHRlbXBsYXRlO1xuXG4gICAgLy8gd2FsayB0aGUgcHJvdG90eXBlIGNoYWluOyBCYWJlbCBkb2Vzbid0IGFsbG93IHVzaW5nXG4gICAgLy8gYHN1cGVyYCBzaW5jZSB3ZSBhcmUgb3V0c2lkZSBvZiB0aGUgQ2xhc3NcbiAgICB3aGlsZShjb250ZXh0KXtcbiAgICAgICAgY29udGV4dCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250ZXh0KTtcbiAgICAgICAgaWYoIWNvbnRleHQpeyBicmVhazsgfVxuICAgICAgICAvLyBza2lwIHByb3RvdHlwZXMgd2l0aG91dCBhIHRlbXBsYXRlXG4gICAgICAgIC8vIChlbHNlIGl0IHdpbGwgcHVsbCBhbiBpbmhlcml0ZWQgdGVtcGxhdGUgYW5kIGNhdXNlIGR1cGxpY2F0ZXMpXG4gICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlU3RyaW5nJykgfHwgY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVJZCcpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IGNvbnRleHQuZ2V0VGVtcGxhdGVOb2RlKCk7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMucHVzaCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlcztcbn07XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAndGVtcGxhdGUnLFxuICAgIG9yZGVyOiAyMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGluc2VydChub2RlKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdCd0ZW1wbGF0ZSc6IHRydWVcbn07Il19
