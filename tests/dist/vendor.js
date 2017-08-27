require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"@clubajax/dom":[function(require,module,exports){
/* UMD.define */ (function (root, factory) {
    if (typeof customLoader === 'function'){ customLoader(factory, 'dom'); }else if (typeof define === 'function' && define.amd) { define([], factory); } else if (typeof exports === 'object') { module.exports = factory(); } else { root.returnExports = factory(); window.dom = factory(); }
}(this, function () {

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
		type = type || 'uid';
        if(uids[type] === undefined){
            uids[type] = 0;
        }
        var id = type + '-' + (uids[type] + 1);
        uids[type]++;
        return id;
    }

    function isNode (item){
        // safer test for custom elements in FF (with wc shim)
	    // fragment is a special case
        return !!item && typeof item === 'object' && (typeof item.innerHTML === 'string' || item.nodeName === '#document-fragment');
    }

    function byId (item){
		if(typeof item === 'string'){
			return document.getElementById(item);
		}
		return item;
    }

    function style (node, prop, value){
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
            if(prop === 'text' || prop === 'html' || prop === 'innerHTML') {
            	// ignore, handled during creation
				return;
			}
			else if(prop === 'className' || prop === 'class') {
				node.className = value;
			}
			else if(prop === 'style') {
				style(node, value);
			}
			else if(prop === 'attr') {
            	// back compat
				attr(node, value);
			}
			else if(typeof value === 'object'){
            	// object, like 'data'
				node[prop] = value;
            }
            else{
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
            dimensions = byId(node).getBoundingClientRect();
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
				if(children[i]) {
					if (typeof children[i] === 'string') {
						node.appendChild(toDom(children[i]));
					} else {
						node.appendChild(children[i]);
					}
				}
			}
		}
		else if (children) {
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
            	// careful assuming textContent -
				// misses some HTML, such as entities (&npsp;)
                node.innerHTML = html;
            }
        }
        if(options.text){
            node.appendChild(document.createTextNode(options.text));
        }
        if(options.children){
            addChildren(node, options.children);
        }
    }
    
    function dom (nodeType, options, parent, prepend){
		options = options || {};

		// if first argument is a string and starts with <, pass to toDom()
        if(nodeType.indexOf('<') === 0){
            return toDom(nodeType, options, parent);
        }

        var node = document.createElement(nodeType);

        parent = byId(parent);

        addContent(node, options);

		attr(node, options);

        if(parent && isNode(parent)){
            if(prepend && parent.hasChildNodes()){
                parent.insertBefore(node, parent.children[0]);
            }else{
                parent.appendChild(node);
            }
        }

        return node;
    }

    function insertAfter (refNode, node) {
        var sibling = refNode.nextElementSibling;
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

    dom.classList = {
    	// in addition to fixing IE11 toggle
		// these methods also handle arrays
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
    
    function normalize (val){
        if(typeof val === 'string') {
        	val = val.trim();
			if(val === 'false'){
				return false;
			}
			else if(val === 'null'){
				return null;
			}
			else if(val === 'true'){
				return true;
			}
			if (val.indexOf('/') > -1 || val.indexOf(' ') > -1 || val.indexOf('-') > 0) {
				return val;
			}
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
    dom.toDom = toDom;
    dom.fromDom = fromDom;
    dom.insertAfter = insertAfter;

    return dom;
}));

},{}],"@clubajax/on":[function(require,module,exports){
(function (root, factory) {
	if (typeof customLoader === 'function') {
		customLoader(factory, 'on');
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.returnExports = window.on = factory();
	}
}(this, function () {
	'use strict';

	// main function

	function on (node, eventName, filter, handler) {
		// normalize parameters
		if (typeof node === 'string') {
			node = getNodeById(node);
		}

		// prepare a callback
		var callback = makeCallback(node, filter, handler);

		// functional event
		if (typeof eventName === 'function') {
			return eventName(node, callback);
		}

		// special case: keydown/keyup with a list of expected keys
		// TODO: consider replacing with an explicit event function:
		// var h = on(node, onKeyEvent('keyup', /Enter,Esc/), callback);
		var keyEvent = /^(keyup|keydown):(.+)$/.exec(eventName);
		if (keyEvent) {
			return onKeyEvent(keyEvent[1], new RegExp(keyEvent[2].split(',').join('|')))(node, callback);
		}

		// handle multiple event types, like: on(node, 'mouseup, mousedown', callback);
		if (/,/.test(eventName)) {
			return on.makeMultiHandle(eventName.split(',').map(function (name) {
				return name.trim();
			}).filter(function (name) {
				return name;
			}).map(function (name) {
				return on(node, name, callback);
			}));
		}

		// handle registered functional events
		if (Object.prototype.hasOwnProperty.call(on.events, eventName)) {
			return on.events[eventName](node, callback);
		}

		// special case: loading an image
		if (eventName === 'load' && node.tagName.toLowerCase() === 'img') {
			return onImageLoad(node, callback);
		}

		// special case: mousewheel
		if (eventName === 'wheel') {
			// pass through, but first curry callback to wheel events
			callback = normalizeWheelEvent(callback);
			if (!hasWheel) {
				// old Firefox, old IE, Chrome
				return on.makeMultiHandle([
					on(node, 'DOMMouseScroll', callback),
					on(node, 'mousewheel', callback)
				]);
			}
		}

		// special case: keyboard
		if (/^key/.test(eventName)) {
			callback = normalizeKeyEvent(callback);
		}

		// default case
		return on.onDomEvent(node, eventName, callback);
	}

	// registered functional events
	on.events = {
		// handle click and Enter
		button: function (node, callback) {
			return on.makeMultiHandle([
				on(node, 'click', callback),
				on(node, 'keyup:Enter', callback)
			]);
		},

		// custom - used for popups 'n stuff
		clickoff: function (node, callback) {
			// important note!
			// starts paused
			//
			var bHandle = on(node.ownerDocument.documentElement, 'click', function (e) {
				var target = e.target;
				if (target.nodeType !== 1) {
					target = target.parentNode;
				}
				if (target && !node.contains(target)) {
					callback(e);
				}
			});

			var handle = {
				state: 'resumed',
				resume: function () {
					setTimeout(function () {
						bHandle.resume();
					}, 100);
					this.state = 'resumed';
				},
				pause: function () {
					bHandle.pause();
					this.state = 'paused';
				},
				remove: function () {
					bHandle.remove();
					this.state = 'removed';
				}
			};
			handle.pause();

			return handle;
		}
	};

	// internal event handlers

	function onDomEvent (node, eventName, callback) {
		node.addEventListener(eventName, callback, false);
		return {
			remove: function () {
				node.removeEventListener(eventName, callback, false);
				node = callback = null;
				this.remove = this.pause = this.resume = function () {};
			},
			pause: function () {
				node.removeEventListener(eventName, callback, false);
			},
			resume: function () {
				node.addEventListener(eventName, callback, false);
			}
		};
	}

	function onImageLoad (node, callback) {
		var handle = on.makeMultiHandle([
			on.onDomEvent(node, 'load', onImageLoad),
			on(node, 'error', callback)
		]);

		return handle;

		function onImageLoad (e) {
			var interval = setInterval(function () {
				if (node.naturalWidth || node.naturalHeight) {
					clearInterval(interval);
					e.width  = e.naturalWidth  = node.naturalWidth;
					e.height = e.naturalHeight = node.naturalHeight;
					callback(e);
				}
			}, 100);
			handle.remove();
		}
	}

	function onKeyEvent (keyEventName, re) {
		return function (node, callback) {
			return on(node, keyEventName, function (e) {
				if (re.test(e.key)) {
					callback(e);
				}
			});
		};
	}

	// internal utilities

	var hasWheel = (function hasWheelTest () {
		var
			isIE = navigator.userAgent.indexOf('Trident') > -1,
			div = document.createElement('div');
		return "onwheel" in div || "wheel" in div ||
			(isIE && document.implementation.hasFeature("Events.wheel", "3.0")); // IE feature detection
	})();

	var matches;
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
			if (element[on.matches] && element[on.matches](selector)) {
				return element;
			}
			if (element === parent) {
				break;
			}
			element = element.parentElement;
		}
		return null;
	}

	var INVALID_PROPS = {
		isTrusted: 1
	};
	function mix (object, value) {
		if (!value) {
			return object;
		}
		if (typeof value === 'object') {
			for(var key in value){
				if (!INVALID_PROPS[key]) {
					object[key] = value[key];
				}
			}
		} else {
			object.value = value;
		}
		return object;
	}

	var ieKeys = {
		//a: 'TEST',
		Up: 'ArrowUp',
		Down: 'ArrowDown',
		Left: 'ArrowLeft',
		Right: 'ArrowRight',
		Esc: 'Escape',
		Spacebar: ' ',
		Win: 'Command'
	};

	function normalizeKeyEvent (callback) {
		// IE uses old spec
		return function (e) {
			if (ieKeys[e.key]) {
				var fakeEvent = mix({}, e);
				fakeEvent.key = ieKeys[e.key];
				callback(fakeEvent);
			} else {
				callback(e);
			}
		}
	}

	var
		FACTOR = navigator.userAgent.indexOf('Windows') > -1 ? 10 : 0.1,
		XLR8 = 0,
		mouseWheelHandle;

	function normalizeWheelEvent (callback) {
		// normalizes all browsers' events to a standard:
		// delta, wheelY, wheelX
		// also adds acceleration and deceleration to make
		// Mac and Windows behave similarly
		return function (e) {
			XLR8 += FACTOR;
			var
				deltaY = Math.max(-1, Math.min(1, (e.wheelDeltaY || e.deltaY))),
				deltaX = Math.max(-10, Math.min(10, (e.wheelDeltaX || e.deltaX)));

			deltaY = deltaY <= 0 ? deltaY - XLR8 : deltaY + XLR8;

			e.delta  = deltaY;
			e.wheelY = deltaY;
			e.wheelX = deltaX;

			clearTimeout(mouseWheelHandle);
			mouseWheelHandle = setTimeout(function () {
				XLR8 = 0;
			}, 300);
			callback(e);
		};
	}

	function closestFilter (element, selector) {
		return function (e) {
			return on.closest(e.target, selector, element);
		};
	}

	function makeMultiHandle (handles) {
		return {
			state: 'resumed',
			remove: function () {
				handles.forEach(function (h) {
					// allow for a simple function in the list
					if (h.remove) {
						h.remove();
					} else if (typeof h === 'function') {
						h();
					}
				});
				handles = [];
				this.remove = this.pause = this.resume = function () {};
				this.state = 'removed';
			},
			pause: function () {
				handles.forEach(function (h) {
					if (h.pause) {
						h.pause();
					}
				});
				this.state = 'paused';
			},
			resume: function () {
				handles.forEach(function (h) {
					if (h.resume) {
						h.resume();
					}
				});
				this.state = 'resumed';
			}
		};
	}

	function getNodeById (id) {
		var node = document.getElementById(id);
		if (!node) {
			console.error('`on` Could not find:', id);
		}
		return node;
	}

	function makeCallback (node, filter, handler) {
		if (filter && handler) {
			if (typeof filter === 'string') {
				filter = closestFilter(node, filter);
			}
			return function (e) {
				var result = filter(e);
				if (result) {
					e.filteredTarget = result;
					handler(e, result);
				}
			};
		}
		return filter || handler;
	}

	// public functions

	on.once = function (node, eventName, filter, callback) {
		var h;
		if (filter && callback) {
			h = on(node, eventName, filter, function () {
				callback.apply(window, arguments);
				h.remove();
			});
		} else {
			h = on(node, eventName, function () {
				filter.apply(window, arguments);
				h.remove();
			});
		}
		return h;
	};

	on.emit = function (node, eventName, value) {
		node = typeof node === 'string' ? getNodeById(node) : node;
		var event = (node === document ? document : node.ownerDocument).createEvent('HTMLEvents');
		event.initEvent(eventName, true, true); // event type, bubbling, cancelable
		return node.dispatchEvent(mix(event, value));
	};

	on.fire = function (node, eventName, eventDetail, bubbles) {
		node = typeof node === 'string' ? getNodeById(node) : node;
		var event = (node === document ? document : node.ownerDocument).createEvent('CustomEvent');
		event.initCustomEvent(eventName, !!bubbles, true, eventDetail); // event type, bubbling, cancelable, value
		return node.dispatchEvent(event);
	};

	// TODO: DEPRECATED
	on.isAlphaNumeric = function (str) {
		return /^[0-9a-z]$/i.test(str);
	};

	on.makeMultiHandle = makeMultiHandle;
	on.onDomEvent = onDomEvent; // use directly to prevent possible definition loops
	on.closest = closest;
	on.matches = matches;

	return on;
}));

},{}],"custom-elements-polyfill":[function(require,module,exports){
var supportsV1 = 'customElements' in window;
var supportsPromise = 'Promise' in window;
var nativeShimBase64 = "ZnVuY3Rpb24gbmF0aXZlU2hpbSgpeygoKT0+eyd1c2Ugc3RyaWN0JztpZighd2luZG93LmN1c3RvbUVsZW1lbnRzKXJldHVybjtjb25zdCBhPXdpbmRvdy5IVE1MRWxlbWVudCxiPXdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUsYz13aW5kb3cuY3VzdG9tRWxlbWVudHMuZ2V0LGQ9bmV3IE1hcCxlPW5ldyBNYXA7bGV0IGY9ITEsZz0hMTt3aW5kb3cuSFRNTEVsZW1lbnQ9ZnVuY3Rpb24oKXtpZighZil7Y29uc3Qgaj1kLmdldCh0aGlzLmNvbnN0cnVjdG9yKSxrPWMuY2FsbCh3aW5kb3cuY3VzdG9tRWxlbWVudHMsaik7Zz0hMDtjb25zdCBsPW5ldyBrO3JldHVybiBsfWY9ITE7fSx3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlPWEucHJvdG90eXBlO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csJ2N1c3RvbUVsZW1lbnRzJyx7dmFsdWU6d2luZG93LmN1c3RvbUVsZW1lbnRzLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cuY3VzdG9tRWxlbWVudHMsJ2RlZmluZScse3ZhbHVlOihqLGspPT57Y29uc3QgbD1rLnByb3RvdHlwZSxtPWNsYXNzIGV4dGVuZHMgYXtjb25zdHJ1Y3Rvcigpe3N1cGVyKCksT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsbCksZ3x8KGY9ITAsay5jYWxsKHRoaXMpKSxnPSExO319LG49bS5wcm90b3R5cGU7bS5vYnNlcnZlZEF0dHJpYnV0ZXM9ay5vYnNlcnZlZEF0dHJpYnV0ZXMsbi5jb25uZWN0ZWRDYWxsYmFjaz1sLmNvbm5lY3RlZENhbGxiYWNrLG4uZGlzY29ubmVjdGVkQ2FsbGJhY2s9bC5kaXNjb25uZWN0ZWRDYWxsYmFjayxuLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaz1sLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayxuLmFkb3B0ZWRDYWxsYmFjaz1sLmFkb3B0ZWRDYWxsYmFjayxkLnNldChrLGopLGUuc2V0KGosayksYi5jYWxsKHdpbmRvdy5jdXN0b21FbGVtZW50cyxqLG0pO30sY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5jdXN0b21FbGVtZW50cywnZ2V0Jyx7dmFsdWU6KGopPT5lLmdldChqKSxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTt9KSgpO30=";
if(supportsV1 && !window['no-native-shim']){
	eval(window.atob(nativeShimBase64));
	nativeShim();
}else{
	customElements();
}
if (!supportsPromise) {
	promisePolyfill();
}

function customElements() {
(function(){
'use strict';var g=new function(){};var aa=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function k(b){var a=aa.has(b);b=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(b);return!a&&b}function l(b){var a=b.isConnected;if(void 0!==a)return a;for(;b&&!(b.__CE_isImportDocument||b instanceof Document);)b=b.parentNode||(window.ShadowRoot&&b instanceof ShadowRoot?b.host:void 0);return!(!b||!(b.__CE_isImportDocument||b instanceof Document))}
function m(b,a){for(;a&&a!==b&&!a.nextSibling;)a=a.parentNode;return a&&a!==b?a.nextSibling:null}
function n(b,a,e){e=e?e:new Set;for(var c=b;c;){if(c.nodeType===Node.ELEMENT_NODE){var d=c;a(d);var h=d.localName;if("link"===h&&"import"===d.getAttribute("rel")){c=d.import;if(c instanceof Node&&!e.has(c))for(e.add(c),c=c.firstChild;c;c=c.nextSibling)n(c,a,e);c=m(b,d);continue}else if("template"===h){c=m(b,d);continue}if(d=d.__CE_shadowRoot)for(d=d.firstChild;d;d=d.nextSibling)n(d,a,e)}c=c.firstChild?c.firstChild:m(b,c)}}function q(b,a,e){b[a]=e};function r(){this.a=new Map;this.f=new Map;this.c=[];this.b=!1}function ba(b,a,e){b.a.set(a,e);b.f.set(e.constructor,e)}function t(b,a){b.b=!0;b.c.push(a)}function v(b,a){b.b&&n(a,function(a){return w(b,a)})}function w(b,a){if(b.b&&!a.__CE_patched){a.__CE_patched=!0;for(var e=0;e<b.c.length;e++)b.c[e](a)}}function x(b,a){var e=[];n(a,function(b){return e.push(b)});for(a=0;a<e.length;a++){var c=e[a];1===c.__CE_state?b.connectedCallback(c):y(b,c)}}
function z(b,a){var e=[];n(a,function(b){return e.push(b)});for(a=0;a<e.length;a++){var c=e[a];1===c.__CE_state&&b.disconnectedCallback(c)}}
function A(b,a,e){e=e?e:new Set;var c=[];n(a,function(d){if("link"===d.localName&&"import"===d.getAttribute("rel")){var a=d.import;a instanceof Node&&"complete"===a.readyState?(a.__CE_isImportDocument=!0,a.__CE_hasRegistry=!0):d.addEventListener("load",function(){var a=d.import;a.__CE_documentLoadHandled||(a.__CE_documentLoadHandled=!0,a.__CE_isImportDocument=!0,a.__CE_hasRegistry=!0,new Set(e),e.delete(a),A(b,a,e))})}else c.push(d)},e);if(b.b)for(a=0;a<c.length;a++)w(b,c[a]);for(a=0;a<c.length;a++)y(b,
c[a])}
function y(b,a){if(void 0===a.__CE_state){var e=b.a.get(a.localName);if(e){e.constructionStack.push(a);var c=e.constructor;try{try{if(new c!==a)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{e.constructionStack.pop()}}catch(f){throw a.__CE_state=2,f;}a.__CE_state=1;a.__CE_definition=e;if(e.attributeChangedCallback)for(e=e.observedAttributes,c=0;c<e.length;c++){var d=e[c],h=a.getAttribute(d);null!==h&&b.attributeChangedCallback(a,d,null,h,null)}l(a)&&b.connectedCallback(a)}}}
r.prototype.connectedCallback=function(b){var a=b.__CE_definition;a.connectedCallback&&a.connectedCallback.call(b)};r.prototype.disconnectedCallback=function(b){var a=b.__CE_definition;a.disconnectedCallback&&a.disconnectedCallback.call(b)};r.prototype.attributeChangedCallback=function(b,a,e,c,d){var h=b.__CE_definition;h.attributeChangedCallback&&-1<h.observedAttributes.indexOf(a)&&h.attributeChangedCallback.call(b,a,e,c,d)};function B(b,a){this.c=b;this.a=a;this.b=void 0;A(this.c,this.a);"loading"===this.a.readyState&&(this.b=new MutationObserver(this.f.bind(this)),this.b.observe(this.a,{childList:!0,subtree:!0}))}function C(b){b.b&&b.b.disconnect()}B.prototype.f=function(b){var a=this.a.readyState;"interactive"!==a&&"complete"!==a||C(this);for(a=0;a<b.length;a++)for(var e=b[a].addedNodes,c=0;c<e.length;c++)A(this.c,e[c])};function ca(){var b=this;this.b=this.a=void 0;this.c=new Promise(function(a){b.b=a;b.a&&a(b.a)})}function D(b){if(b.a)throw Error("Already resolved.");b.a=void 0;b.b&&b.b(void 0)};function E(b){this.f=!1;this.a=b;this.h=new Map;this.g=function(b){return b()};this.b=!1;this.c=[];this.j=new B(b,document)}
E.prototype.l=function(b,a){var e=this;if(!(a instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!k(b))throw new SyntaxError("The element name '"+b+"' is not valid.");if(this.a.a.get(b))throw Error("A custom element with name '"+b+"' has already been defined.");if(this.f)throw Error("A custom element is already being defined.");this.f=!0;var c,d,h,f,u;try{var p=function(b){var a=P[b];if(void 0!==a&&!(a instanceof Function))throw Error("The '"+b+"' callback must be a function.");
return a},P=a.prototype;if(!(P instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");c=p("connectedCallback");d=p("disconnectedCallback");h=p("adoptedCallback");f=p("attributeChangedCallback");u=a.observedAttributes||[]}catch(va){return}finally{this.f=!1}ba(this.a,b,{localName:b,constructor:a,connectedCallback:c,disconnectedCallback:d,adoptedCallback:h,attributeChangedCallback:f,observedAttributes:u,constructionStack:[]});this.c.push(b);this.b||(this.b=
!0,this.g(function(){if(!1!==e.b)for(e.b=!1,A(e.a,document);0<e.c.length;){var b=e.c.shift();(b=e.h.get(b))&&D(b)}}))};E.prototype.get=function(b){if(b=this.a.a.get(b))return b.constructor};E.prototype.o=function(b){if(!k(b))return Promise.reject(new SyntaxError("'"+b+"' is not a valid custom element name."));var a=this.h.get(b);if(a)return a.c;a=new ca;this.h.set(b,a);this.a.a.get(b)&&-1===this.c.indexOf(b)&&D(a);return a.c};E.prototype.m=function(b){C(this.j);var a=this.g;this.g=function(e){return b(function(){return a(e)})}};
window.CustomElementRegistry=E;E.prototype.define=E.prototype.l;E.prototype.get=E.prototype.get;E.prototype.whenDefined=E.prototype.o;E.prototype.polyfillWrapFlushCallback=E.prototype.m;var F=window.Document.prototype.createElement,da=window.Document.prototype.createElementNS,ea=window.Document.prototype.importNode,fa=window.Document.prototype.prepend,ga=window.Document.prototype.append,G=window.Node.prototype.cloneNode,H=window.Node.prototype.appendChild,I=window.Node.prototype.insertBefore,J=window.Node.prototype.removeChild,K=window.Node.prototype.replaceChild,L=Object.getOwnPropertyDescriptor(window.Node.prototype,"textContent"),M=window.Element.prototype.attachShadow,N=Object.getOwnPropertyDescriptor(window.Element.prototype,
"innerHTML"),O=window.Element.prototype.getAttribute,Q=window.Element.prototype.setAttribute,R=window.Element.prototype.removeAttribute,S=window.Element.prototype.getAttributeNS,T=window.Element.prototype.setAttributeNS,U=window.Element.prototype.removeAttributeNS,V=window.Element.prototype.insertAdjacentElement,ha=window.Element.prototype.prepend,ia=window.Element.prototype.append,ja=window.Element.prototype.before,ka=window.Element.prototype.after,la=window.Element.prototype.replaceWith,ma=window.Element.prototype.remove,
na=window.HTMLElement,W=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),X=window.HTMLElement.prototype.insertAdjacentElement;function oa(){var b=Y;window.HTMLElement=function(){function a(){var a=this.constructor,c=b.f.get(a);if(!c)throw Error("The custom element being constructed was not registered with `customElements`.");var d=c.constructionStack;if(!d.length)return d=F.call(document,c.localName),Object.setPrototypeOf(d,a.prototype),d.__CE_state=1,d.__CE_definition=c,w(b,d),d;var c=d.length-1,h=d[c];if(h===g)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
d[c]=g;Object.setPrototypeOf(h,a.prototype);w(b,h);return h}a.prototype=na.prototype;return a}()};function pa(b,a,e){a.prepend=function(a){for(var d=[],c=0;c<arguments.length;++c)d[c-0]=arguments[c];c=d.filter(function(b){return b instanceof Node&&l(b)});e.i.apply(this,d);for(var f=0;f<c.length;f++)z(b,c[f]);if(l(this))for(c=0;c<d.length;c++)f=d[c],f instanceof Element&&x(b,f)};a.append=function(a){for(var d=[],c=0;c<arguments.length;++c)d[c-0]=arguments[c];c=d.filter(function(b){return b instanceof Node&&l(b)});e.append.apply(this,d);for(var f=0;f<c.length;f++)z(b,c[f]);if(l(this))for(c=0;c<
d.length;c++)f=d[c],f instanceof Element&&x(b,f)}};function qa(){var b=Y;q(Document.prototype,"createElement",function(a){if(this.__CE_hasRegistry){var e=b.a.get(a);if(e)return new e.constructor}a=F.call(this,a);w(b,a);return a});q(Document.prototype,"importNode",function(a,e){a=ea.call(this,a,e);this.__CE_hasRegistry?A(b,a):v(b,a);return a});q(Document.prototype,"createElementNS",function(a,e){if(this.__CE_hasRegistry&&(null===a||"http://www.w3.org/1999/xhtml"===a)){var c=b.a.get(e);if(c)return new c.constructor}a=da.call(this,a,e);w(b,a);return a});
pa(b,Document.prototype,{i:fa,append:ga})};function ra(){var b=Y;function a(a,c){Object.defineProperty(a,"textContent",{enumerable:c.enumerable,configurable:!0,get:c.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)c.set.call(this,a);else{var d=void 0;if(this.firstChild){var e=this.childNodes,u=e.length;if(0<u&&l(this))for(var d=Array(u),p=0;p<u;p++)d[p]=e[p]}c.set.call(this,a);if(d)for(a=0;a<d.length;a++)z(b,d[a])}}})}q(Node.prototype,"insertBefore",function(a,c){if(a instanceof DocumentFragment){var d=Array.prototype.slice.apply(a.childNodes);
a=I.call(this,a,c);if(l(this))for(c=0;c<d.length;c++)x(b,d[c]);return a}d=l(a);c=I.call(this,a,c);d&&z(b,a);l(this)&&x(b,a);return c});q(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=H.call(this,a);if(l(this))for(var d=0;d<c.length;d++)x(b,c[d]);return a}c=l(a);d=H.call(this,a);c&&z(b,a);l(this)&&x(b,a);return d});q(Node.prototype,"cloneNode",function(a){a=G.call(this,a);this.ownerDocument.__CE_hasRegistry?A(b,a):v(b,a);
return a});q(Node.prototype,"removeChild",function(a){var c=l(a),d=J.call(this,a);c&&z(b,a);return d});q(Node.prototype,"replaceChild",function(a,c){if(a instanceof DocumentFragment){var d=Array.prototype.slice.apply(a.childNodes);a=K.call(this,a,c);if(l(this))for(z(b,c),c=0;c<d.length;c++)x(b,d[c]);return a}var d=l(a),e=K.call(this,a,c),f=l(this);f&&z(b,c);d&&z(b,a);f&&x(b,a);return e});L&&L.get?a(Node.prototype,L):t(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=[],b=
0;b<this.childNodes.length;b++)a.push(this.childNodes[b].textContent);return a.join("")},set:function(a){for(;this.firstChild;)J.call(this,this.firstChild);H.call(this,document.createTextNode(a))}})})};function sa(b){var a=Element.prototype;a.before=function(a){for(var c=[],d=0;d<arguments.length;++d)c[d-0]=arguments[d];d=c.filter(function(a){return a instanceof Node&&l(a)});ja.apply(this,c);for(var e=0;e<d.length;e++)z(b,d[e]);if(l(this))for(d=0;d<c.length;d++)e=c[d],e instanceof Element&&x(b,e)};a.after=function(a){for(var c=[],d=0;d<arguments.length;++d)c[d-0]=arguments[d];d=c.filter(function(a){return a instanceof Node&&l(a)});ka.apply(this,c);for(var e=0;e<d.length;e++)z(b,d[e]);if(l(this))for(d=
0;d<c.length;d++)e=c[d],e instanceof Element&&x(b,e)};a.replaceWith=function(a){for(var c=[],d=0;d<arguments.length;++d)c[d-0]=arguments[d];var d=c.filter(function(a){return a instanceof Node&&l(a)}),e=l(this);la.apply(this,c);for(var f=0;f<d.length;f++)z(b,d[f]);if(e)for(z(b,this),d=0;d<c.length;d++)e=c[d],e instanceof Element&&x(b,e)};a.remove=function(){var a=l(this);ma.call(this);a&&z(b,this)}};function ta(){var b=Y;function a(a,c){Object.defineProperty(a,"innerHTML",{enumerable:c.enumerable,configurable:!0,get:c.get,set:function(a){var d=this,e=void 0;l(this)&&(e=[],n(this,function(a){a!==d&&e.push(a)}));c.set.call(this,a);if(e)for(var f=0;f<e.length;f++){var h=e[f];1===h.__CE_state&&b.disconnectedCallback(h)}this.ownerDocument.__CE_hasRegistry?A(b,this):v(b,this);return a}})}function e(a,c){q(a,"insertAdjacentElement",function(a,d){var e=l(d);a=c.call(this,a,d);e&&z(b,d);l(a)&&x(b,d);
return a})}M?q(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=M.call(this,a)}):console.warn("Custom Elements: `Element#attachShadow` was not patched.");if(N&&N.get)a(Element.prototype,N);else if(W&&W.get)a(HTMLElement.prototype,W);else{var c=F.call(document,"div");t(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return G.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName?this.content:this;for(c.innerHTML=a;0<b.childNodes.length;)J.call(b,
b.childNodes[0]);for(;0<c.childNodes.length;)H.call(b,c.childNodes[0])}})})}q(Element.prototype,"setAttribute",function(a,c){if(1!==this.__CE_state)return Q.call(this,a,c);var d=O.call(this,a);Q.call(this,a,c);c=O.call(this,a);d!==c&&b.attributeChangedCallback(this,a,d,c,null)});q(Element.prototype,"setAttributeNS",function(a,c,e){if(1!==this.__CE_state)return T.call(this,a,c,e);var d=S.call(this,a,c);T.call(this,a,c,e);e=S.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});q(Element.prototype,
"removeAttribute",function(a){if(1!==this.__CE_state)return R.call(this,a);var c=O.call(this,a);R.call(this,a);null!==c&&b.attributeChangedCallback(this,a,c,null,null)});q(Element.prototype,"removeAttributeNS",function(a,c){if(1!==this.__CE_state)return U.call(this,a,c);var d=S.call(this,a,c);U.call(this,a,c);var e=S.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});X?e(HTMLElement.prototype,X):V?e(Element.prototype,V):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");
pa(b,Element.prototype,{i:ha,append:ia});sa(b)};
var Z=window.customElements;if(!Z||Z.forcePolyfill||"function"!=typeof Z.define||"function"!=typeof Z.get){var Y=new r;oa();qa();ra();ta();document.__CE_hasRegistry=!0;var ua=new E(Y);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:ua})};
}).call(self);
}
// @license Polymer Project Authors. http://polymer.github.io/LICENSE.txt


function promisePolyfill () {
// https://github.com/taylorhakes/promise-polyfill/blob/master/promise.js
var setTimeoutFunc = setTimeout;
function noop() {}
function bind(fn, thisArg) {
return function () {
fn.apply(thisArg, arguments);
};
}
function Promise(fn) {
if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
if (typeof fn !== 'function') throw new TypeError('not a function');
this._state = 0;
this._handled = false;
this._value = undefined;
this._deferreds = [];

doResolve(fn, this);
}
function handle(self, deferred) {
while (self._state === 3) {
self = self._value;
}
if (self._state === 0) {
self._deferreds.push(deferred);
return;
}
self._handled = true;
Promise._immediateFn(function () {
var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
if (cb === null) {
(self._state === 1 ? resolve : reject)(deferred.promise, self._value);
return;
}
var ret;
try {
ret = cb(self._value);
} catch (e) {
reject(deferred.promise, e);
return;
}
resolve(deferred.promise, ret);
});
}
function resolve(self, newValue) {
try {
// Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
var then = newValue.then;
if (newValue instanceof Promise) {
self._state = 3;
self._value = newValue;
finale(self);
return;
} else if (typeof then === 'function') {
doResolve(bind(then, newValue), self);
return;
}
}
self._state = 1;
self._value = newValue;
finale(self);
} catch (e) {
reject(self, e);
}
}
function reject(self, newValue) {
self._state = 2;
self._value = newValue;
finale(self);
}
function finale(self) {
if (self._state === 2 && self._deferreds.length === 0) {
Promise._immediateFn(function() {
if (!self._handled) {
Promise._unhandledRejectionFn(self._value);
}
});
}

for (var i = 0, len = self._deferreds.length; i < len; i++) {
handle(self, self._deferreds[i]);
}
self._deferreds = null;
}
function Handler(onFulfilled, onRejected, promise) {
this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
this.onRejected = typeof onRejected === 'function' ? onRejected : null;
this.promise = promise;
}
function doResolve(fn, self) {
var done = false;
try {
fn(function (value) {
if (done) return;
done = true;
resolve(self, value);
}, function (reason) {
if (done) return;
done = true;
reject(self, reason);
});
} catch (ex) {
if (done) return;
done = true;
reject(self, ex);
}
}
Promise.prototype['catch'] = function (onRejected) {
return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
var prom = new (this.constructor)(noop);

handle(this, new Handler(onFulfilled, onRejected, prom));
return prom;
};
Promise.all = function (arr) {
var args = Array.prototype.slice.call(arr);
return new Promise(function (resolve, reject) {
if (args.length === 0) return resolve([]);
var remaining = args.length;

function res(i, val) {
try {
if (val && (typeof val === 'object' || typeof val === 'function')) {
var then = val.then;
if (typeof then === 'function') {
then.call(val, function (val) {
res(i, val);
}, reject);
return;
}
}
args[i] = val;
if (--remaining === 0) {
resolve(args);
}
} catch (ex) {
reject(ex);
}
}

for (var i = 0; i < args.length; i++) {
res(i, args[i]);
}
});
};
Promise.resolve = function (value) {
if (value && typeof value === 'object' && value.constructor === Promise) {
return value;
}

return new Promise(function (resolve) {
resolve(value);
});
};
Promise.reject = function (value) {
return new Promise(function (resolve, reject) {
reject(value);
});
};
Promise.race = function (values) {
return new Promise(function (resolve, reject) {
for (var i = 0, len = values.length; i < len; i++) {
values[i].then(resolve, reject);
}
});
};
Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
function (fn) {
setTimeoutFunc(fn, 0);
};
Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
if (typeof console !== 'undefined' && console) {
console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
}
};
Promise._setImmediateFn = function _setImmediateFn(fn) {
Promise._immediateFn = fn;
};
Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
Promise._unhandledRejectionFn = fn;
};
console.log('Promise polyfill');
window.Promise = Promise;
}

},{}],"randomizer":[function(require,module,exports){
// Club AJAX General Purpose Code
//
// Randomizer
//
// author:
//              Mike Wilcox
// site:
//              http://clubajax.org
// support:
//              http://groups.google.com/group/clubajax
//
// clubajax.lang.rand
//
//      DESCRIPTION:
//              A randomizer library that's great for producing mock data.
//              Allows dozens of ways to randomize numbers, strings, words,
//              sentences, and dates. Includes tiny libraries of the most
//              commonly used words (in order), the most commonly used letters
//              (in order) and personal names that can be used as first or last.
//              For making sentences, "wurds" are used - words with scrambled vowels
//              so they aren't actual words, but look more like lorem ipsum. Change the
//              property real to true to use "words" instead of "wurds" (it can
//              also produce humorous results).

//      USAGE:
//              include file:
//                      <script src="clubajax/lang/rand.js"></script>
//
// TESTS:
//              See tests/rand.html
//
/* UMD.define */ (function (root, factory) {
	if (typeof define === 'function' && define.amd){ define([], factory); }else if(typeof exports === 'object'){ module.exports = factory(); }else{ root.returnExports = factory(); window.rand = factory(); }
}(this, function () {
	
	var
		rand,
		cityStates = ["New York, New York", "Los Angeles, California", "Chicago, Illinois", "Houston, Texas", "Philadelphia, Pennsylvania", "Phoenix, Arizona", "San Diego, California", "San Antonio, Texas", "Dallas, Texas", "Detroit, Michigan", "San Jose, California", "Indianapolis, Indiana", "Jacksonville, Florida", "San Francisco, California", "Columbus, Ohio", "Austin, Texas", "Memphis, Tennessee", "Baltimore, Maryland", "Charlotte, North Carolina", "Fort Worth, Texas", "Boston, Massachusetts", "Milwaukee, Wisconsin", "El Paso, Texas", "Washington, District of Columbia", "Nashville-Davidson, Tennessee", "Seattle, Washington", "Denver, Colorado", "Las Vegas, Nevada", "Portland, Oregon", "Oklahoma City, Oklahoma", "Tucson, Arizona", "Albuquerque, New Mexico", "Atlanta, Georgia", "Long Beach, California", "Kansas City, Missouri", "Fresno, California", "New Orleans, Louisiana", "Cleveland, Ohio", "Sacramento, California", "Mesa, Arizona", "Virginia Beach, Virginia", "Omaha, Nebraska", "Colorado Springs, Colorado", "Oakland, California", "Miami, Florida", "Tulsa, Oklahoma", "Minneapolis, Minnesota", "Honolulu, Hawaii", "Arlington, Texas", "Wichita, Kansas", "St. Louis, Missouri", "Raleigh, North Carolina", "Santa Ana, California", "Cincinnati, Ohio", "Anaheim, California", "Tampa, Florida", "Toledo, Ohio", "Pittsburgh, Pennsylvania", "Aurora, Colorado", "Bakersfield, California", "Riverside, California", "Stockton, California", "Corpus Christi, Texas", "Lexington-Fayette, Kentucky", "Buffalo, New York", "St. Paul, Minnesota", "Anchorage, Alaska", "Newark, New Jersey", "Plano, Texas", "Fort Wayne, Indiana", "St. Petersburg, Florida", "Glendale, Arizona", "Lincoln, Nebraska", "Norfolk, Virginia", "Jersey City, New Jersey", "Greensboro, North Carolina", "Chandler, Arizona", "Birmingham, Alabama", "Henderson, Nevada", "Scottsdale, Arizona", "North Hempstead, New York", "Madison, Wisconsin", "Hialeah, Florida", "Baton Rouge, Louisiana", "Chesapeake, Virginia", "Orlando, Florida", "Lubbock, Texas", "Garland, Texas", "Akron, Ohio", "Rochester, New York", "Chula Vista, California", "Reno, Nevada", "Laredo, Texas", "Durham, North Carolina", "Modesto, California", "Huntington, New York", "Montgomery, Alabama", "Boise, Idaho", "Arlington, Virginia", "San Bernardino, California"],
		streetSuffixes = 'Road,Drive,Avenue,Blvd,Lane,Street,Way,Circle'.split(','),
		streets = "First,Fourth,Park,Fifth,Main,Sixth,Oak,Seventh,Pine,Maple,Cedar,Eighth,Elm,View,Washington,Ninth,Lake,Hill,High,Station,Main,Park,Church,Church,London,Victoria,Green,Manor,Church,Park,The Crescent,Queens,New,Grange,Kings,Kingsway,Windsor,Highfield,Mill,Alexander,York,St. John\'s,Main,Broadway,King,The Green,Springfield,George,Park,Victoria,Albert,Queensway,New,Queen,West,North,Manchester,The Grove,Richmond,Grove,South,School,North,Stanley,Chester,Mill,".split(','),
		states = ["Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "Armed Forces Europe", "Armed Forces Pacific", "Armed Forces the Americas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Federated States of Micronesia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Marshall Islands", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virgin Islands, U.S.", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
		stateAbbr = ["AL", "AK", "AS", "AZ", "AR", "AE", "AP", "AA", "CA", "CO", "CT", "DE", "DC", "FM", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MH", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY"],
		names = "Abraham,Albert,Alexis,Allen,Allison,Alexander,Amos,Anton,Arnold,Arthur,Ashley,Barry,Belinda,Belle,Benjamin,Benny,Bernard,Bradley,Brett,Ty,Brittany,Bruce,Bryant,Carrey,Carmen,Carroll,Charles,Christopher,Christie,Clark,Clay,Cliff,Conrad,Craig,Crystal,Curtis,Damon,Dana,David,Dean,Dee,Dennis,Denny,Dick,Douglas,Duncan,Dwight,Dylan,Eddy,Elliot,Everett,Faye,Francis,Frank,Franklin,Garth,Gayle,George,Gilbert,Glenn,Gordon,Grace,Graham,Grant,Gregory,Gottfried,Guy,Harrison,Harry,Harvey,Henry,Herbert,Hillary,Holly,Hope,Howard,Hugo,Humphrey,Irving,Isaak,Janis,Jay,Joel,John,Jordan,Joyce,Juan,Judd,Julia,Kaye,Kelly,Keith,Laurie,Lawrence,Lee,Leigh,Leonard,Leslie,Lester,Lewis,Lilly,Lloyd,George,Louis,Louise,Lucas,Luther,Lynn,Mack,Marie,Marshall,Martin,Marvin,May,Michael,Michelle,Milton,Miranda,Mitchell,Morgan,Morris,Murray,Newton,Norman,Owen,Patrick,Patti,Paul,Penny,Perry,Preston,Quinn,Ray,Rich,Richard,Roland,Rose,Ross,Roy,Ruby,Russell,Ruth,Ryan,Scott,Seymour,Shannon,Shawn,Shelley,Sherman,Simon,Stanley,Stewart,Susann,Sydney,Taylor,Thomas,Todd,Tom,Tracy,Travis,Tyler,Tyler,Vincent,Wallace,Walter,Penn,Wayne,Will,Willard,Willis",
		words = "the,of,and,a,to,in,is,you,that,it,he,for,was,on,are,as,with,his,they,at,be,this,from,I,have,or,by,one,had,not,but,what,all,were,when,we,there,can,an,your,which,their,said,if,do,will,each,about,how,up,out,them,then,she,many,some,so,these,would,other,into,has,more,her,two,like,him,see,time,could,no,make,than,first,been,its,who,now,people,my,made,over,did,down,only,way,find,use,may,water,long,little,very,after,words,called,just,where,most,know,get,through,back,much,before,go,good,new,write,out,used,me,man,too,any,day,same,right,look,think,also,around,another,came,come,work,three,word,must,because,does,part,even,place,well,such,here,take,why,things,help,put,years,different,away,again,off,went,old,number,great,tell,men,say,small,every,found,still,between,name,should,home,big,give,air,line,set,own,under,read,last,never,us,left,end,along,while,might,next,sound,below,saw,something,thought,both,few,those,always,looked,show,large,often,together,asked,house,don't,world,going,want,school,important,until,form,food,keep,children,feet,land,side,without,boy,once,animals,life,enough,took,sometimes,four,head,above,kind,began,almost,live,page,got,earth,need,far,hand,high,year,mother,light,parts,country,father,let,night,following,picture,being,study,second,eyes,soon,times,story,boys,since,white,days,ever,paper,hard,near,sentence,better,best,across,during,today,others,however,sure,means,knew,its,try,told,young,miles,sun,ways,thing,whole,hear,example,heard,several,change,answer,room,sea,against,top,turned,learn,point,city,play,toward,five,using,himself,usually",
		letters = ("etaonisrhldcmufpgwybvkjxqz").split(""),
		sites = "Google,Facebook,YouTube,Yahoo,Live,Bing,Wikipedia,Blogger,MSN,Twitter,Wordpress,MySpace,Microsoft,Amazon,eBay,LinkedIn,flickr,Craigslist,Rapidshare,Conduit,IMDB,BBC,Go,AOL,Doubleclick,Apple,Blogspot,Orkut,Photobucket,Ask,CNN,Adobe,About,mediafire,CNET,ESPN,ImageShack,LiveJournal,Megaupload,Megavideo,Hotfile,PayPal,NYTimes,Globo,Alibaba,GoDaddy,DeviantArt,Rediff,DailyMotion,Digg,Weather,ning,PartyPoker,eHow,Download,Answers,TwitPic,Netflix,Tinypic,Sourceforge,Hulu,Comcast,Archive,Dell,Stumbleupon,HP,FoxNews,Metacafe,Vimeo,Skype,Chase,Reuters,WSJ,Yelp,Reddit,Geocities,USPS,UPS,Upload,TechCrunch,Pogo,Pandora,LATimes,USAToday,IBM,AltaVista,Match,Monster,JotSpot,BetterVideo,ClubAJAX,Nexplore,Kayak,Slashdot";
	
	rand = {
		real:false,
		words:words.split(","),
		wurds:[],
		names:names.split(","),
		letters:letters,
		sites:sites.split(","),

		toArray: function(thing){
			var
				nm, i,
				a = [];

			if(typeof(thing) === "object" && !(!!thing.push || !!thing.item)){
				for(nm in thing){ if(thing.hasOwnProperty(nm)){a.push(thing[nm]);} }
				thing = a;
			}
			else if(typeof(thing) === "string"){
				if(/\./.test(thing)){
					thing = thing.split(".");
					thing.pop();
					i = thing.length;
					while(i--){
						thing[i] = this.trim(thing[i]) + ".";
					}
				}else if(/,/.test(thing)){
						thing = thing.split(",");
				}else if(/\s/.test(thing)){
						thing = thing.split(" ");
				}else{
						thing = thing.split("");
				}
			}
			return thing; //Array
		},

		trim: function(s){ // thanks to Dojo:
			return String.prototype.trim ? s.trim() :
			s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		},

		pad: function(n, amt, chr){
				var c = chr || "0"; amt = amt || 2;
				return (c+c+c+c+c+c+c+c+c+c+n).slice(-amt);
		},

		cap: function(w){
			return w.charAt(0).toUpperCase() + w.substring(1);
		},

		weight: function(n, exp){
			var
				res,
				rev = exp < 0;
			exp = exp===undefined ? 1 : Math.abs(exp)+1;
			res = Math.pow(n, exp);
			return rev ? 1 - res : res;
		},

		n: function(n, w){
			return Math.floor((n || 10) * this.weight(Math.random(), w));
		},

		range: function(min, max, w){
			max = max || 0;
			return this.n(Math.abs(max-min)+1, w) + (min<max?min:max);
		},

		element: function(thing, w){
			// return rand slot, char, prop or range
			if(typeof(thing) === "number"){ return this.n(thing, w); }
			thing = this.toArray(thing);
			return thing[this.n(thing.length, w)];
		},

		scramble: function(ary){
			var
				a = ary.concat([]),
				sd = [],
				i = a.length;
				while(i--){
					sd.push(a.splice(this.n(a.length), 1)[0]);
				}
			return sd;
		},

		bignumber: function(len){
			var t="";
			while(len--){
					t += this.n(9);
			}
			return t;
		},

		date: function(o){
			o = o || {};
			var
				d,
				d1 = new Date(o.min || new Date()),
				d2 = new Date(o.max || new Date().setFullYear(d1.getFullYear()+(o.yearRange||1))).getTime();
			d1 = d1.getTime();
			d = new Date(this.range(d1,d2,o.weight));
			if(o.seconds){
				return d.getTime();
			}else if(o.delimiter){
				return this.pad(d.getMonth()+1)+o.delimiter+this.pad(d.getDate()+1)+o.delimiter+(d.getFullYear());
			}
			return d;
		},

		bool: function(w){
			return this.n(2, w) < 1;
		},

		color: function(w){
			return "#"+this.pad(this.n(255, w).toString(16))+this.pad(this.n(255, w).toString(16))+this.pad(this.n(255, w).toString(16));
		},

		chars:function(min, max, w){
			var s = "",
			i = this.range(min, max, w);
			while(i--){
				s += this.letters[this.n(this.letters.length)];
			}
			return s;
		},

		name: function(cse){
			// cse: 0 title case, 1 lowercase, 2 upper case
			var s = this.names[this.n(this.names.length)];
			return !cse ? s : cse === 1 ? s.toLowerCase() : s.toUpperCase();
		},

		cityState: function(){
			return cityStates[this.n(cityStates.length)];
		},

		state: function(cse){
			// cse: 0 title case, 1 lowercase, 2 upper case
			var s = states[this.n(states.length)];
			return !cse ? s : cse === 1 ? s.toLowerCase() : s.toUpperCase();
		},

		stateCode: function(cse){
			cse = cse === undefined ? 2 : cse;
			// cse: 0 title case, 1 lowercase, 2 upper case
			var s = stateAbbr[this.n(stateAbbr.length)];
			return !cse ? s : cse === 1 ? s.toLowerCase() : s.toUpperCase();
		},

		street: function(noSuffix){
			var s = streets[this.n(streets.length)];
			if(!noSuffix){
				s+= ' ' + streetSuffixes[this.n(streetSuffixes.length)];
			}
			return s;
		},

		site: function(cse){
			// cse: 0 title case, 1 lowercase, 2 upper case
			var s = this.sites[this.n(this.sites.length)];
			return !cse ? s : cse === 1 ? s.toLowerCase() : s.toUpperCase();
		},

		url: function(usewww, xt){
			var w = usewww ? "www." : "";
			xt = xt || ".com";
			return "http://" + w + this.site(1) + xt;
		},

		word: function(){
			var w = this.real ? this.words : this.wurds;
			return w[this.n(w.length)];
		},

		sentences: function(minAmt, maxAmt, minLen, maxLen){
			// amt: sentences, len: words
			minAmt = minAmt || 1;
			maxAmt = maxAmt || minAmt;
			minLen = minLen || 5;
			maxLen = maxLen || minLen;

			var
				ii,
				s = [],
				t = "",
				w = this.real ? this.words : this.wurds,
				i = this.range(minAmt, maxAmt);

			while(i--){

				ii = this.range(minLen, maxLen); while(ii--){
					s.push(w[this.n(w.length)]);
				}
				t += this.cap(s.join(" ")) +". ";
			}
			return t;
		},

		title: function(min, max){
			min = min || 1; max = max || min;
			var
				a = [],
				w = this.real ? this.words : this.wurds,
				i = this.range(min, max);
			while(i--){
				a.push(this.cap(w[this.n(w.length)]));
			}
			return a.join(" ");
		},
		data: function(amt){
			var
				st,
				items = [],
				item,
				i;
			for(i = 0; i < amt; i++){
				item = {
					firstName: this.name(),
					lastName: this.name(),
					company: this.site(),
					address1: this.bignumber(this.range(3, 5)),
					address2: this.street(),
					birthday: this.date({delimiter:'/'})
				};
				item.email = (item.firstName.substring(0,1) + item.lastName + '@' + item.company + '.com').toLowerCase();
				st = this.cityState();
				item.city = st.split(', ')[0];
				item.state = st.split(', ')[1];
				item.zipcode = this.bignumber(5);
				item.phone = this.format(this.bignumber(10), 'phone');
				item.ssn = this.format(this.bignumber(9), 'ssn');
				items.push(item);
			}
			return items;
		},

		format: function (n, type) {
			var d = '-';
			switch (type) {
				case 'phone':
					n = '' + n;
					return n.substring(0,3) + d + n.substring(3,6) + d + n.substring(6);
				case 'ssn':
					n = '' + n;
					return n.substring(0,3) + d + n.substring(3,5) + d + n.substring(5);
			}
		}
	};
	rand.wurds = words.replace(/a|e|i|o|u/g, function(c){ return ("aeiou")[rand.n(5)]; }).split(",");

	return rand;
}));

},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJAY2x1YmFqYXgvZG9tIiwiQGNsdWJhamF4L29uIiwiY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsIiwicmFuZG9taXplciJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogVU1ELmRlZmluZSAqLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGN1c3RvbUxvYWRlciA9PT0gJ2Z1bmN0aW9uJyl7IGN1c3RvbUxvYWRlcihmYWN0b3J5LCAnZG9tJyk7IH1lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHsgZGVmaW5lKFtdLCBmYWN0b3J5KTsgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHsgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7IH0gZWxzZSB7IHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTsgd2luZG93LmRvbSA9IGZhY3RvcnkoKTsgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXJcbiAgICAgICAgaXNGbG9hdCA9IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgICAgICAnei1pbmRleCc6IDFcbiAgICAgICAgfSxcbiAgICAgICAgaXNEaW1lbnNpb24gPSB7XG4gICAgICAgICAgICB3aWR0aDoxLFxuICAgICAgICAgICAgaGVpZ2h0OjEsXG4gICAgICAgICAgICB0b3A6MSxcbiAgICAgICAgICAgIGxlZnQ6MSxcbiAgICAgICAgICAgIHJpZ2h0OjEsXG4gICAgICAgICAgICBib3R0b206MSxcbiAgICAgICAgICAgIG1heFdpZHRoOjEsXG4gICAgICAgICAgICAnbWF4LXdpZHRoJzoxLFxuICAgICAgICAgICAgbWluV2lkdGg6MSxcbiAgICAgICAgICAgICdtaW4td2lkdGgnOjEsXG4gICAgICAgICAgICBtYXhIZWlnaHQ6MSxcbiAgICAgICAgICAgICdtYXgtaGVpZ2h0JzoxXG4gICAgICAgIH0sXG4gICAgICAgIHVpZHMgPSB7fSxcbiAgICAgICAgZGVzdHJveWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBmdW5jdGlvbiB1aWQgKHR5cGUpe1xuXHRcdHR5cGUgPSB0eXBlIHx8ICd1aWQnO1xuICAgICAgICBpZih1aWRzW3R5cGVdID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdWlkc1t0eXBlXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkID0gdHlwZSArICctJyArICh1aWRzW3R5cGVdICsgMSk7XG4gICAgICAgIHVpZHNbdHlwZV0rKztcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTm9kZSAoaXRlbSl7XG4gICAgICAgIC8vIHNhZmVyIHRlc3QgZm9yIGN1c3RvbSBlbGVtZW50cyBpbiBGRiAod2l0aCB3YyBzaGltKVxuXHQgICAgLy8gZnJhZ21lbnQgaXMgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgcmV0dXJuICEhaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgKHR5cGVvZiBpdGVtLmlubmVySFRNTCA9PT0gJ3N0cmluZycgfHwgaXRlbS5ub2RlTmFtZSA9PT0gJyNkb2N1bWVudC1mcmFnbWVudCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ5SWQgKGl0ZW0pe1xuXHRcdGlmKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyl7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbSk7XG5cdFx0fVxuXHRcdHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0eWxlIChub2RlLCBwcm9wLCB2YWx1ZSl7XG4gICAgICAgIHZhciBrZXksIGNvbXB1dGVkO1xuICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgLy8gb2JqZWN0IHNldHRlclxuICAgICAgICAgICAgZm9yKGtleSBpbiBwcm9wKXtcbiAgICAgICAgICAgICAgICBpZihwcm9wLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICBzdHlsZShub2RlLCBrZXksIHByb3Bba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1lbHNlIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgLy8gcHJvcGVydHkgc2V0dGVyXG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRGltZW5zaW9uW3Byb3BdKXtcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0dGVyLCBpZiBhIHNpbXBsZSBzdHlsZVxuICAgICAgICBpZihub2RlLnN0eWxlW3Byb3BdKXtcbiAgICAgICAgICAgIGlmKGlzRGltZW5zaW9uW3Byb3BdKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQobm9kZS5zdHlsZVtwcm9wXSwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoaXNGbG9hdFtwcm9wXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobm9kZS5zdHlsZVtwcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5zdHlsZVtwcm9wXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldHRlciwgY29tcHV0ZWRcbiAgICAgICAgY29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUsIHByb3ApO1xuICAgICAgICBpZihjb21wdXRlZFtwcm9wXSl7XG4gICAgICAgICAgICBpZigvXFxkLy50ZXN0KGNvbXB1dGVkW3Byb3BdKSl7XG4gICAgICAgICAgICAgICAgaWYoIWlzTmFOKHBhcnNlSW50KGNvbXB1dGVkW3Byb3BdLCAxMCkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGNvbXB1dGVkW3Byb3BdLCAxMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXR0ciAobm9kZSwgcHJvcCwgdmFsdWUpe1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgZm9yKGtleSBpbiBwcm9wKXtcbiAgICAgICAgICAgICAgICBpZihwcm9wLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICBhdHRyKG5vZGUsIGtleSwgcHJvcFtrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgaWYocHJvcCA9PT0gJ3RleHQnIHx8IHByb3AgPT09ICdodG1sJyB8fCBwcm9wID09PSAnaW5uZXJIVE1MJykge1xuICAgICAgICAgICAgXHQvLyBpZ25vcmUsIGhhbmRsZWQgZHVyaW5nIGNyZWF0aW9uXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYocHJvcCA9PT0gJ2NsYXNzTmFtZScgfHwgcHJvcCA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRub2RlLmNsYXNzTmFtZSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZihwcm9wID09PSAnc3R5bGUnKSB7XG5cdFx0XHRcdHN0eWxlKG5vZGUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYocHJvcCA9PT0gJ2F0dHInKSB7XG4gICAgICAgICAgICBcdC8vIGJhY2sgY29tcGF0XG5cdFx0XHRcdGF0dHIobm9kZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIFx0Ly8gb2JqZWN0LCBsaWtlICdkYXRhJ1xuXHRcdFx0XHRub2RlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShwcm9wKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib3ggKG5vZGUpe1xuICAgICAgICBpZihub2RlID09PSB3aW5kb3cpe1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBub2RlIGRpbWVuc2lvbnNcbiAgICAgICAgLy8gcmV0dXJuZWQgb2JqZWN0IGlzIGltbXV0YWJsZVxuICAgICAgICAvLyBhZGQgc2Nyb2xsIHBvc2l0aW9uaW5nIGFuZCBjb252ZW5pZW5jZSBhYmJyZXZpYXRpb25zXG4gICAgICAgIHZhclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IGJ5SWQobm9kZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGRpbWVuc2lvbnMudG9wLFxuICAgICAgICAgICAgcmlnaHQ6IGRpbWVuc2lvbnMucmlnaHQsXG4gICAgICAgICAgICBib3R0b206IGRpbWVuc2lvbnMuYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogZGltZW5zaW9ucy5sZWZ0LFxuICAgICAgICAgICAgaGVpZ2h0OiBkaW1lbnNpb25zLmhlaWdodCxcbiAgICAgICAgICAgIGg6IGRpbWVuc2lvbnMuaGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IGRpbWVuc2lvbnMud2lkdGgsXG4gICAgICAgICAgICB3OiBkaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgICAgc2Nyb2xsWTogd2luZG93LnNjcm9sbFksXG4gICAgICAgICAgICBzY3JvbGxYOiB3aW5kb3cuc2Nyb2xsWCxcbiAgICAgICAgICAgIHg6IGRpbWVuc2lvbnMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgIHk6IGRpbWVuc2lvbnMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVlcnkgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIXNlbGVjdG9yKXtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcXVlcnlBbGwgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIXNlbGVjdG9yKXtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm9kZXMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgICAgIGlmKCFub2Rlcy5sZW5ndGgpeyByZXR1cm4gW107IH1cblxuICAgICAgICAvLyBjb252ZXJ0IHRvIEFycmF5IGFuZCByZXR1cm4gaXRcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0RvbSAoaHRtbCwgb3B0aW9ucywgcGFyZW50KXtcbiAgICAgICAgdmFyIG5vZGUgPSBkb20oJ2RpdicsIHtodG1sOiBodG1sfSk7XG4gICAgICAgIHBhcmVudCA9IGJ5SWQocGFyZW50IHx8IG9wdGlvbnMpO1xuICAgICAgICBpZihwYXJlbnQpe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5maXJzdENoaWxkKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYoaHRtbC5pbmRleE9mKCc8JykgIT09IDApe1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tRG9tIChub2RlKSB7XG4gICAgICAgIGZ1bmN0aW9uIGdldEF0dHJzIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgYXR0LCBpLCBhdHRycyA9IHt9O1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBhdHQgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgYXR0cnNbYXR0LmxvY2FsTmFtZV0gPSBub3JtYWxpemUoYXR0LnZhbHVlID09PSAnJyA/IHRydWUgOiBhdHQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF0dHJzO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFRleHQgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBpLCB0LCB0ZXh0ID0gJyc7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHQgPSBub2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgaWYodC5ub2RlVHlwZSA9PT0gMyAmJiB0LnRleHRDb250ZW50LnRyaW0oKSl7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gdC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGksIG9iamVjdCA9IGdldEF0dHJzKG5vZGUpO1xuICAgICAgICBvYmplY3QudGV4dCA9IGdldFRleHQobm9kZSk7XG4gICAgICAgIG9iamVjdC5jaGlsZHJlbiA9IFtdO1xuICAgICAgICBpZihub2RlLmNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBvYmplY3QuY2hpbGRyZW4ucHVzaChmcm9tRG9tKG5vZGUuY2hpbGRyZW5baV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuXHRmdW5jdGlvbiBhZGRDaGlsZHJlbiAobm9kZSwgY2hpbGRyZW4pIHtcblx0XHRpZihBcnJheS5pc0FycmF5KGNoaWxkcmVuKSl7XG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRpZihjaGlsZHJlbltpXSkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgY2hpbGRyZW5baV0gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKHRvRG9tKGNoaWxkcmVuW2ldKSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGRyZW5baV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChjaGlsZHJlbikge1xuXHRcdFx0bm9kZS5hcHBlbmRDaGlsZChjaGlsZHJlbik7XG5cdFx0fVxuXHR9XG5cbiAgICBmdW5jdGlvbiBhZGRDb250ZW50IChub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBodG1sO1xuICAgICAgICBpZihvcHRpb25zLmh0bWwgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmlubmVySFRNTCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGh0bWwgPSBvcHRpb25zLmh0bWwgfHwgb3B0aW9ucy5pbm5lckhUTUwgfHwgJyc7XG4gICAgICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgIGFkZENoaWxkcmVuKG5vZGUsIGh0bWwpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBcdC8vIGNhcmVmdWwgYXNzdW1pbmcgdGV4dENvbnRlbnQgLVxuXHRcdFx0XHQvLyBtaXNzZXMgc29tZSBIVE1MLCBzdWNoIGFzIGVudGl0aWVzICgmbnBzcDspXG4gICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKG9wdGlvbnMudGV4dCl7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG9wdGlvbnMudGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9wdGlvbnMuY2hpbGRyZW4pe1xuICAgICAgICAgICAgYWRkQ2hpbGRyZW4obm9kZSwgb3B0aW9ucy5jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZG9tIChub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50LCBwcmVwZW5kKXtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdC8vIGlmIGZpcnN0IGFyZ3VtZW50IGlzIGEgc3RyaW5nIGFuZCBzdGFydHMgd2l0aCA8LCBwYXNzIHRvIHRvRG9tKClcbiAgICAgICAgaWYobm9kZVR5cGUuaW5kZXhPZignPCcpID09PSAwKXtcbiAgICAgICAgICAgIHJldHVybiB0b0RvbShub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlVHlwZSk7XG5cbiAgICAgICAgcGFyZW50ID0gYnlJZChwYXJlbnQpO1xuXG4gICAgICAgIGFkZENvbnRlbnQobm9kZSwgb3B0aW9ucyk7XG5cblx0XHRhdHRyKG5vZGUsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKHBhcmVudCAmJiBpc05vZGUocGFyZW50KSl7XG4gICAgICAgICAgICBpZihwcmVwZW5kICYmIHBhcmVudC5oYXNDaGlsZE5vZGVzKCkpe1xuICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc2VydEFmdGVyIChyZWZOb2RlLCBub2RlKSB7XG4gICAgICAgIHZhciBzaWJsaW5nID0gcmVmTm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmKCFzaWJsaW5nKXtcbiAgICAgICAgICAgIHJlZk5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZWZOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIHNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWJsaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3kgKG5vZGUpe1xuICAgICAgICAvLyBkZXN0cm95cyBhIG5vZGUgY29tcGxldGVseVxuICAgICAgICAvL1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICBkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICBkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbiAobm9kZSwgZGlzcG9zZSl7XG4gICAgICAgIC8vXHRSZW1vdmVzIGFsbCBjaGlsZCBub2Rlc1xuICAgICAgICAvL1x0XHRkaXNwb3NlOiBkZXN0cm95IGNoaWxkIG5vZGVzXG4gICAgICAgIGlmKGRpc3Bvc2Upe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGRlc3Ryb3kobm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRvbS5jbGFzc0xpc3QgPSB7XG4gICAgXHQvLyBpbiBhZGRpdGlvbiB0byBmaXhpbmcgSUUxMSB0b2dnbGVcblx0XHQvLyB0aGVzZSBtZXRob2RzIGFsc28gaGFuZGxlIGFycmF5c1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICB0b0FycmF5KG5hbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBhZGQ6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICB0b0FycmF5KG5hbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjb250YWluczogZnVuY3Rpb24gKG5vZGUsIG5hbWVzKXtcbiAgICAgICAgICAgIHJldHVybiB0b0FycmF5KG5hbWVzKS5ldmVyeShmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIChub2RlLCBuYW1lcywgdmFsdWUpe1xuICAgICAgICAgICAgbmFtZXMgPSB0b0FycmF5KG5hbWVzKTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAvLyB1c2Ugc3RhbmRhcmQgZnVuY3Rpb25hbGl0eSwgc3VwcG9ydGVkIGJ5IElFXG4gICAgICAgICAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC50b2dnbGUobmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBzZWNvbmQgcGFyYW1ldGVyICBcbiAgICAgICAgICAgIGVsc2UgaWYodmFsdWUpe1xuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiB0b0FycmF5IChuYW1lcyl7XG4gICAgICAgIGlmKCFuYW1lcyl7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdkb20uY2xhc3NMaXN0IHNob3VsZCBpbmNsdWRlIGEgbm9kZSBhbmQgYSBjbGFzc05hbWUnKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZXMuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lLnRyaW0oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZSAodmFsKXtcbiAgICAgICAgaWYodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgXHR2YWwgPSB2YWwudHJpbSgpO1xuXHRcdFx0aWYodmFsID09PSAnZmFsc2UnKXtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih2YWwgPT09ICdudWxsJyl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih2YWwgPT09ICd0cnVlJyl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbC5pbmRleE9mKCcvJykgPiAtMSB8fCB2YWwuaW5kZXhPZignICcpID4gLTEgfHwgdmFsLmluZGV4T2YoJy0nKSA+IDApIHtcblx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdH1cblx0XHR9XG4gICAgICAgIGlmKCFpc05hTihwYXJzZUZsb2F0KHZhbCkpKXtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBkb20ubm9ybWFsaXplID0gbm9ybWFsaXplO1xuICAgIGRvbS5jbGVhbiA9IGNsZWFuO1xuICAgIGRvbS5xdWVyeSA9IHF1ZXJ5O1xuICAgIGRvbS5xdWVyeUFsbCA9IHF1ZXJ5QWxsO1xuICAgIGRvbS5ieUlkID0gYnlJZDtcbiAgICBkb20uYXR0ciA9IGF0dHI7XG4gICAgZG9tLmJveCA9IGJveDtcbiAgICBkb20uc3R5bGUgPSBzdHlsZTtcbiAgICBkb20uZGVzdHJveSA9IGRlc3Ryb3k7XG4gICAgZG9tLnVpZCA9IHVpZDtcbiAgICBkb20uaXNOb2RlID0gaXNOb2RlO1xuICAgIGRvbS50b0RvbSA9IHRvRG9tO1xuICAgIGRvbS5mcm9tRG9tID0gZnJvbURvbTtcbiAgICBkb20uaW5zZXJ0QWZ0ZXIgPSBpbnNlcnRBZnRlcjtcblxuICAgIHJldHVybiBkb207XG59KSk7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBjdXN0b21Mb2FkZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRjdXN0b21Mb2FkZXIoZmFjdG9yeSwgJ29uJyk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHtcblx0XHRyb290LnJldHVybkV4cG9ydHMgPSB3aW5kb3cub24gPSBmYWN0b3J5KCk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gbWFpbiBmdW5jdGlvblxuXG5cdGZ1bmN0aW9uIG9uIChub2RlLCBldmVudE5hbWUsIGZpbHRlciwgaGFuZGxlcikge1xuXHRcdC8vIG5vcm1hbGl6ZSBwYXJhbWV0ZXJzXG5cdFx0aWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykge1xuXHRcdFx0bm9kZSA9IGdldE5vZGVCeUlkKG5vZGUpO1xuXHRcdH1cblxuXHRcdC8vIHByZXBhcmUgYSBjYWxsYmFja1xuXHRcdHZhciBjYWxsYmFjayA9IG1ha2VDYWxsYmFjayhub2RlLCBmaWx0ZXIsIGhhbmRsZXIpO1xuXG5cdFx0Ly8gZnVuY3Rpb25hbCBldmVudFxuXHRcdGlmICh0eXBlb2YgZXZlbnROYW1lID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4gZXZlbnROYW1lKG5vZGUsIGNhbGxiYWNrKTtcblx0XHR9XG5cblx0XHQvLyBzcGVjaWFsIGNhc2U6IGtleWRvd24va2V5dXAgd2l0aCBhIGxpc3Qgb2YgZXhwZWN0ZWQga2V5c1xuXHRcdC8vIFRPRE86IGNvbnNpZGVyIHJlcGxhY2luZyB3aXRoIGFuIGV4cGxpY2l0IGV2ZW50IGZ1bmN0aW9uOlxuXHRcdC8vIHZhciBoID0gb24obm9kZSwgb25LZXlFdmVudCgna2V5dXAnLCAvRW50ZXIsRXNjLyksIGNhbGxiYWNrKTtcblx0XHR2YXIga2V5RXZlbnQgPSAvXihrZXl1cHxrZXlkb3duKTooLispJC8uZXhlYyhldmVudE5hbWUpO1xuXHRcdGlmIChrZXlFdmVudCkge1xuXHRcdFx0cmV0dXJuIG9uS2V5RXZlbnQoa2V5RXZlbnRbMV0sIG5ldyBSZWdFeHAoa2V5RXZlbnRbMl0uc3BsaXQoJywnKS5qb2luKCd8JykpKShub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIG11bHRpcGxlIGV2ZW50IHR5cGVzLCBsaWtlOiBvbihub2RlLCAnbW91c2V1cCwgbW91c2Vkb3duJywgY2FsbGJhY2spO1xuXHRcdGlmICgvLC8udGVzdChldmVudE5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gb24ubWFrZU11bHRpSGFuZGxlKGV2ZW50TmFtZS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0XHRyZXR1cm4gbmFtZS50cmltKCk7XG5cdFx0XHR9KS5maWx0ZXIoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0XHR9KS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIG9uKG5vZGUsIG5hbWUsIGNhbGxiYWNrKTtcblx0XHRcdH0pKTtcblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgcmVnaXN0ZXJlZCBmdW5jdGlvbmFsIGV2ZW50c1xuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob24uZXZlbnRzLCBldmVudE5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gb24uZXZlbnRzW2V2ZW50TmFtZV0obm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIHNwZWNpYWwgY2FzZTogbG9hZGluZyBhbiBpbWFnZVxuXHRcdGlmIChldmVudE5hbWUgPT09ICdsb2FkJyAmJiBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ltZycpIHtcblx0XHRcdHJldHVybiBvbkltYWdlTG9hZChub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gc3BlY2lhbCBjYXNlOiBtb3VzZXdoZWVsXG5cdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ3doZWVsJykge1xuXHRcdFx0Ly8gcGFzcyB0aHJvdWdoLCBidXQgZmlyc3QgY3VycnkgY2FsbGJhY2sgdG8gd2hlZWwgZXZlbnRzXG5cdFx0XHRjYWxsYmFjayA9IG5vcm1hbGl6ZVdoZWVsRXZlbnQoY2FsbGJhY2spO1xuXHRcdFx0aWYgKCFoYXNXaGVlbCkge1xuXHRcdFx0XHQvLyBvbGQgRmlyZWZveCwgb2xkIElFLCBDaHJvbWVcblx0XHRcdFx0cmV0dXJuIG9uLm1ha2VNdWx0aUhhbmRsZShbXG5cdFx0XHRcdFx0b24obm9kZSwgJ0RPTU1vdXNlU2Nyb2xsJywgY2FsbGJhY2spLFxuXHRcdFx0XHRcdG9uKG5vZGUsICdtb3VzZXdoZWVsJywgY2FsbGJhY2spXG5cdFx0XHRcdF0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHNwZWNpYWwgY2FzZToga2V5Ym9hcmRcblx0XHRpZiAoL15rZXkvLnRlc3QoZXZlbnROYW1lKSkge1xuXHRcdFx0Y2FsbGJhY2sgPSBub3JtYWxpemVLZXlFdmVudChjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gZGVmYXVsdCBjYXNlXG5cdFx0cmV0dXJuIG9uLm9uRG9tRXZlbnQobm9kZSwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH1cblxuXHQvLyByZWdpc3RlcmVkIGZ1bmN0aW9uYWwgZXZlbnRzXG5cdG9uLmV2ZW50cyA9IHtcblx0XHQvLyBoYW5kbGUgY2xpY2sgYW5kIEVudGVyXG5cdFx0YnV0dG9uOiBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcblx0XHRcdHJldHVybiBvbi5tYWtlTXVsdGlIYW5kbGUoW1xuXHRcdFx0XHRvbihub2RlLCAnY2xpY2snLCBjYWxsYmFjayksXG5cdFx0XHRcdG9uKG5vZGUsICdrZXl1cDpFbnRlcicsIGNhbGxiYWNrKVxuXHRcdFx0XSk7XG5cdFx0fSxcblxuXHRcdC8vIGN1c3RvbSAtIHVzZWQgZm9yIHBvcHVwcyAnbiBzdHVmZlxuXHRcdGNsaWNrb2ZmOiBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcblx0XHRcdC8vIGltcG9ydGFudCBub3RlIVxuXHRcdFx0Ly8gc3RhcnRzIHBhdXNlZFxuXHRcdFx0Ly9cblx0XHRcdHZhciBiSGFuZGxlID0gb24obm9kZS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuXHRcdFx0XHRpZiAodGFyZ2V0Lm5vZGVUeXBlICE9PSAxKSB7XG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRhcmdldCAmJiAhbm9kZS5jb250YWlucyh0YXJnZXQpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgaGFuZGxlID0ge1xuXHRcdFx0XHRzdGF0ZTogJ3Jlc3VtZWQnLFxuXHRcdFx0XHRyZXN1bWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGJIYW5kbGUucmVzdW1lKCk7XG5cdFx0XHRcdFx0fSwgMTAwKTtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gJ3Jlc3VtZWQnO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRwYXVzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJIYW5kbGUucGF1c2UoKTtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJlbW92ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJIYW5kbGUucmVtb3ZlKCk7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdyZW1vdmVkJztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGhhbmRsZS5wYXVzZSgpO1xuXG5cdFx0XHRyZXR1cm4gaGFuZGxlO1xuXHRcdH1cblx0fTtcblxuXHQvLyBpbnRlcm5hbCBldmVudCBoYW5kbGVyc1xuXG5cdGZ1bmN0aW9uIG9uRG9tRXZlbnQgKG5vZGUsIGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdFx0bm9kZSA9IGNhbGxiYWNrID0gbnVsbDtcblx0XHRcdFx0dGhpcy5yZW1vdmUgPSB0aGlzLnBhdXNlID0gdGhpcy5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdH0sXG5cdFx0XHRwYXVzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fSxcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBvbkltYWdlTG9hZCAobm9kZSwgY2FsbGJhY2spIHtcblx0XHR2YXIgaGFuZGxlID0gb24ubWFrZU11bHRpSGFuZGxlKFtcblx0XHRcdG9uLm9uRG9tRXZlbnQobm9kZSwgJ2xvYWQnLCBvbkltYWdlTG9hZCksXG5cdFx0XHRvbihub2RlLCAnZXJyb3InLCBjYWxsYmFjaylcblx0XHRdKTtcblxuXHRcdHJldHVybiBoYW5kbGU7XG5cblx0XHRmdW5jdGlvbiBvbkltYWdlTG9hZCAoZSkge1xuXHRcdFx0dmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAobm9kZS5uYXR1cmFsV2lkdGggfHwgbm9kZS5uYXR1cmFsSGVpZ2h0KSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG5cdFx0XHRcdFx0ZS53aWR0aCAgPSBlLm5hdHVyYWxXaWR0aCAgPSBub2RlLm5hdHVyYWxXaWR0aDtcblx0XHRcdFx0XHRlLmhlaWdodCA9IGUubmF0dXJhbEhlaWdodCA9IG5vZGUubmF0dXJhbEhlaWdodDtcblx0XHRcdFx0XHRjYWxsYmFjayhlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgMTAwKTtcblx0XHRcdGhhbmRsZS5yZW1vdmUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvbktleUV2ZW50IChrZXlFdmVudE5hbWUsIHJlKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIG9uKG5vZGUsIGtleUV2ZW50TmFtZSwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKHJlLnRlc3QoZS5rZXkpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cdH1cblxuXHQvLyBpbnRlcm5hbCB1dGlsaXRpZXNcblxuXHR2YXIgaGFzV2hlZWwgPSAoZnVuY3Rpb24gaGFzV2hlZWxUZXN0ICgpIHtcblx0XHR2YXJcblx0XHRcdGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLFxuXHRcdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cmV0dXJuIFwib253aGVlbFwiIGluIGRpdiB8fCBcIndoZWVsXCIgaW4gZGl2IHx8XG5cdFx0XHQoaXNJRSAmJiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiRXZlbnRzLndoZWVsXCIsIFwiMy4wXCIpKTsgLy8gSUUgZmVhdHVyZSBkZXRlY3Rpb25cblx0fSkoKTtcblxuXHR2YXIgbWF0Y2hlcztcblx0WydtYXRjaGVzJywgJ21hdGNoZXNTZWxlY3RvcicsICd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nXS5zb21lKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0aWYgKG5hbWUubGVuZ3RoIDwgNykgeyAvLyBwcmVmaXhcblx0XHRcdG5hbWUgKz0gJ01hdGNoZXNTZWxlY3Rvcic7XG5cdFx0fVxuXHRcdGlmIChFbGVtZW50LnByb3RvdHlwZVtuYW1lXSkge1xuXHRcdFx0bWF0Y2hlcyA9IG5hbWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBjbG9zZXN0IChlbGVtZW50LCBzZWxlY3RvciwgcGFyZW50KSB7XG5cdFx0d2hpbGUgKGVsZW1lbnQpIHtcblx0XHRcdGlmIChlbGVtZW50W29uLm1hdGNoZXNdICYmIGVsZW1lbnRbb24ubWF0Y2hlc10oc2VsZWN0b3IpKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVsZW1lbnQgPT09IHBhcmVudCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0dmFyIElOVkFMSURfUFJPUFMgPSB7XG5cdFx0aXNUcnVzdGVkOiAxXG5cdH07XG5cdGZ1bmN0aW9uIG1peCAob2JqZWN0LCB2YWx1ZSkge1xuXHRcdGlmICghdmFsdWUpIHtcblx0XHRcdHJldHVybiBvYmplY3Q7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRmb3IodmFyIGtleSBpbiB2YWx1ZSl7XG5cdFx0XHRcdGlmICghSU5WQUxJRF9QUk9QU1trZXldKSB7XG5cdFx0XHRcdFx0b2JqZWN0W2tleV0gPSB2YWx1ZVtrZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9iamVjdC52YWx1ZSA9IHZhbHVlO1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0dmFyIGllS2V5cyA9IHtcblx0XHQvL2E6ICdURVNUJyxcblx0XHRVcDogJ0Fycm93VXAnLFxuXHRcdERvd246ICdBcnJvd0Rvd24nLFxuXHRcdExlZnQ6ICdBcnJvd0xlZnQnLFxuXHRcdFJpZ2h0OiAnQXJyb3dSaWdodCcsXG5cdFx0RXNjOiAnRXNjYXBlJyxcblx0XHRTcGFjZWJhcjogJyAnLFxuXHRcdFdpbjogJ0NvbW1hbmQnXG5cdH07XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplS2V5RXZlbnQgKGNhbGxiYWNrKSB7XG5cdFx0Ly8gSUUgdXNlcyBvbGQgc3BlY1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKGllS2V5c1tlLmtleV0pIHtcblx0XHRcdFx0dmFyIGZha2VFdmVudCA9IG1peCh7fSwgZSk7XG5cdFx0XHRcdGZha2VFdmVudC5rZXkgPSBpZUtleXNbZS5rZXldO1xuXHRcdFx0XHRjYWxsYmFjayhmYWtlRXZlbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dmFyXG5cdFx0RkFDVE9SID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdXaW5kb3dzJykgPiAtMSA/IDEwIDogMC4xLFxuXHRcdFhMUjggPSAwLFxuXHRcdG1vdXNlV2hlZWxIYW5kbGU7XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplV2hlZWxFdmVudCAoY2FsbGJhY2spIHtcblx0XHQvLyBub3JtYWxpemVzIGFsbCBicm93c2VycycgZXZlbnRzIHRvIGEgc3RhbmRhcmQ6XG5cdFx0Ly8gZGVsdGEsIHdoZWVsWSwgd2hlZWxYXG5cdFx0Ly8gYWxzbyBhZGRzIGFjY2VsZXJhdGlvbiBhbmQgZGVjZWxlcmF0aW9uIHRvIG1ha2Vcblx0XHQvLyBNYWMgYW5kIFdpbmRvd3MgYmVoYXZlIHNpbWlsYXJseVxuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0WExSOCArPSBGQUNUT1I7XG5cdFx0XHR2YXJcblx0XHRcdFx0ZGVsdGFZID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIChlLndoZWVsRGVsdGFZIHx8IGUuZGVsdGFZKSkpLFxuXHRcdFx0XHRkZWx0YVggPSBNYXRoLm1heCgtMTAsIE1hdGgubWluKDEwLCAoZS53aGVlbERlbHRhWCB8fCBlLmRlbHRhWCkpKTtcblxuXHRcdFx0ZGVsdGFZID0gZGVsdGFZIDw9IDAgPyBkZWx0YVkgLSBYTFI4IDogZGVsdGFZICsgWExSODtcblxuXHRcdFx0ZS5kZWx0YSAgPSBkZWx0YVk7XG5cdFx0XHRlLndoZWVsWSA9IGRlbHRhWTtcblx0XHRcdGUud2hlZWxYID0gZGVsdGFYO1xuXG5cdFx0XHRjbGVhclRpbWVvdXQobW91c2VXaGVlbEhhbmRsZSk7XG5cdFx0XHRtb3VzZVdoZWVsSGFuZGxlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFhMUjggPSAwO1xuXHRcdFx0fSwgMzAwKTtcblx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBjbG9zZXN0RmlsdGVyIChlbGVtZW50LCBzZWxlY3Rvcikge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0cmV0dXJuIG9uLmNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yLCBlbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZU11bHRpSGFuZGxlIChoYW5kbGVzKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN0YXRlOiAncmVzdW1lZCcsXG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoKSB7XG5cdFx0XHRcdFx0Ly8gYWxsb3cgZm9yIGEgc2ltcGxlIGZ1bmN0aW9uIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0aWYgKGgucmVtb3ZlKSB7XG5cdFx0XHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGggPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdGgoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRoYW5kbGVzID0gW107XG5cdFx0XHRcdHRoaXMucmVtb3ZlID0gdGhpcy5wYXVzZSA9IHRoaXMucmVzdW1lID0gZnVuY3Rpb24gKCkge307XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAncmVtb3ZlZCc7XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoKSB7XG5cdFx0XHRcdFx0aWYgKGgucGF1c2UpIHtcblx0XHRcdFx0XHRcdGgucGF1c2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG5cdFx0XHR9LFxuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaCkge1xuXHRcdFx0XHRcdGlmIChoLnJlc3VtZSkge1xuXHRcdFx0XHRcdFx0aC5yZXN1bWUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gJ3Jlc3VtZWQnO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBnZXROb2RlQnlJZCAoaWQpIHtcblx0XHR2YXIgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblx0XHRpZiAoIW5vZGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2BvbmAgQ291bGQgbm90IGZpbmQ6JywgaWQpO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VDYWxsYmFjayAobm9kZSwgZmlsdGVyLCBoYW5kbGVyKSB7XG5cdFx0aWYgKGZpbHRlciAmJiBoYW5kbGVyKSB7XG5cdFx0XHRpZiAodHlwZW9mIGZpbHRlciA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0ZmlsdGVyID0gY2xvc2VzdEZpbHRlcihub2RlLCBmaWx0ZXIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBmaWx0ZXIoZSk7XG5cdFx0XHRcdGlmIChyZXN1bHQpIHtcblx0XHRcdFx0XHRlLmZpbHRlcmVkVGFyZ2V0ID0gcmVzdWx0O1xuXHRcdFx0XHRcdGhhbmRsZXIoZSwgcmVzdWx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIGZpbHRlciB8fCBoYW5kbGVyO1xuXHR9XG5cblx0Ly8gcHVibGljIGZ1bmN0aW9uc1xuXG5cdG9uLm9uY2UgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBmaWx0ZXIsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGg7XG5cdFx0aWYgKGZpbHRlciAmJiBjYWxsYmFjaykge1xuXHRcdFx0aCA9IG9uKG5vZGUsIGV2ZW50TmFtZSwgZmlsdGVyLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcblx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoID0gb24obm9kZSwgZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZpbHRlci5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG5cdFx0XHRcdGgucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGg7XG5cdH07XG5cblx0b24uZW1pdCA9IGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIHZhbHVlKSB7XG5cdFx0bm9kZSA9IHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyA/IGdldE5vZGVCeUlkKG5vZGUpIDogbm9kZTtcblx0XHR2YXIgZXZlbnQgPSAobm9kZSA9PT0gZG9jdW1lbnQgPyBkb2N1bWVudCA6IG5vZGUub3duZXJEb2N1bWVudCkuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlKTsgLy8gZXZlbnQgdHlwZSwgYnViYmxpbmcsIGNhbmNlbGFibGVcblx0XHRyZXR1cm4gbm9kZS5kaXNwYXRjaEV2ZW50KG1peChldmVudCwgdmFsdWUpKTtcblx0fTtcblxuXHRvbi5maXJlID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcblx0XHRub2RlID0gdHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnID8gZ2V0Tm9kZUJ5SWQobm9kZSkgOiBub2RlO1xuXHRcdHZhciBldmVudCA9IChub2RlID09PSBkb2N1bWVudCA/IGRvY3VtZW50IDogbm9kZS5vd25lckRvY3VtZW50KS5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcblx0XHRldmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnROYW1lLCAhIWJ1YmJsZXMsIHRydWUsIGV2ZW50RGV0YWlsKTsgLy8gZXZlbnQgdHlwZSwgYnViYmxpbmcsIGNhbmNlbGFibGUsIHZhbHVlXG5cdFx0cmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH07XG5cblx0Ly8gVE9ETzogREVQUkVDQVRFRFxuXHRvbi5pc0FscGhhTnVtZXJpYyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0XHRyZXR1cm4gL15bMC05YS16XSQvaS50ZXN0KHN0cik7XG5cdH07XG5cblx0b24ubWFrZU11bHRpSGFuZGxlID0gbWFrZU11bHRpSGFuZGxlO1xuXHRvbi5vbkRvbUV2ZW50ID0gb25Eb21FdmVudDsgLy8gdXNlIGRpcmVjdGx5IHRvIHByZXZlbnQgcG9zc2libGUgZGVmaW5pdGlvbiBsb29wc1xuXHRvbi5jbG9zZXN0ID0gY2xvc2VzdDtcblx0b24ubWF0Y2hlcyA9IG1hdGNoZXM7XG5cblx0cmV0dXJuIG9uO1xufSkpO1xuIiwidmFyIHN1cHBvcnRzVjEgPSAnY3VzdG9tRWxlbWVudHMnIGluIHdpbmRvdztcbnZhciBzdXBwb3J0c1Byb21pc2UgPSAnUHJvbWlzZScgaW4gd2luZG93O1xudmFyIG5hdGl2ZVNoaW1CYXNlNjQgPSBcIlpuVnVZM1JwYjI0Z2JtRjBhWFpsVTJocGJTZ3BleWdvS1QwK2V5ZDFjMlVnYzNSeWFXTjBKenRwWmlnaGQybHVaRzkzTG1OMWMzUnZiVVZzWlcxbGJuUnpLWEpsZEhWeWJqdGpiMjV6ZENCaFBYZHBibVJ2ZHk1SVZFMU1SV3hsYldWdWRDeGlQWGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3k1a1pXWnBibVVzWXoxM2FXNWtiM2N1WTNWemRHOXRSV3hsYldWdWRITXVaMlYwTEdROWJtVjNJRTFoY0N4bFBXNWxkeUJOWVhBN2JHVjBJR1k5SVRFc1p6MGhNVHQzYVc1a2IzY3VTRlJOVEVWc1pXMWxiblE5Wm5WdVkzUnBiMjRvS1h0cFppZ2haaWw3WTI5dWMzUWdhajFrTG1kbGRDaDBhR2x6TG1OdmJuTjBjblZqZEc5eUtTeHJQV011WTJGc2JDaDNhVzVrYjNjdVkzVnpkRzl0Uld4bGJXVnVkSE1zYWlrN1p6MGhNRHRqYjI1emRDQnNQVzVsZHlCck8zSmxkSFZ5YmlCc2ZXWTlJVEU3ZlN4M2FXNWtiM2N1U0ZSTlRFVnNaVzFsYm5RdWNISnZkRzkwZVhCbFBXRXVjSEp2ZEc5MGVYQmxPMDlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoM2FXNWtiM2NzSjJOMWMzUnZiVVZzWlcxbGJuUnpKeXg3ZG1Gc2RXVTZkMmx1Wkc5M0xtTjFjM1J2YlVWc1pXMWxiblJ6TEdOdmJtWnBaM1Z5WVdKc1pUb2hNQ3gzY21sMFlXSnNaVG9oTUgwcExFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2gzYVc1a2IzY3VZM1Z6ZEc5dFJXeGxiV1Z1ZEhNc0oyUmxabWx1WlNjc2UzWmhiSFZsT2locUxHc3BQVDU3WTI5dWMzUWdiRDFyTG5CeWIzUnZkSGx3WlN4dFBXTnNZWE56SUdWNGRHVnVaSE1nWVh0amIyNXpkSEoxWTNSdmNpZ3BlM04xY0dWeUtDa3NUMkpxWldOMExuTmxkRkJ5YjNSdmRIbHdaVTltS0hSb2FYTXNiQ2tzWjN4OEtHWTlJVEFzYXk1allXeHNLSFJvYVhNcEtTeG5QU0V4TzMxOUxHNDliUzV3Y205MGIzUjVjR1U3YlM1dlluTmxjblpsWkVGMGRISnBZblYwWlhNOWF5NXZZbk5sY25abFpFRjBkSEpwWW5WMFpYTXNiaTVqYjI1dVpXTjBaV1JEWVd4c1ltRmphejFzTG1OdmJtNWxZM1JsWkVOaGJHeGlZV05yTEc0dVpHbHpZMjl1Ym1WamRHVmtRMkZzYkdKaFkyczliQzVrYVhOamIyNXVaV04wWldSRFlXeHNZbUZqYXl4dUxtRjBkSEpwWW5WMFpVTm9ZVzVuWldSRFlXeHNZbUZqYXoxc0xtRjBkSEpwWW5WMFpVTm9ZVzVuWldSRFlXeHNZbUZqYXl4dUxtRmtiM0IwWldSRFlXeHNZbUZqYXoxc0xtRmtiM0IwWldSRFlXeHNZbUZqYXl4a0xuTmxkQ2hyTEdvcExHVXVjMlYwS0dvc2F5a3NZaTVqWVd4c0tIZHBibVJ2ZHk1amRYTjBiMjFGYkdWdFpXNTBjeXhxTEcwcE8zMHNZMjl1Wm1sbmRYSmhZbXhsT2lFd0xIZHlhWFJoWW14bE9pRXdmU2tzVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtIZHBibVJ2ZHk1amRYTjBiMjFGYkdWdFpXNTBjeXduWjJWMEp5eDdkbUZzZFdVNktHb3BQVDVsTG1kbGRDaHFLU3hqYjI1bWFXZDFjbUZpYkdVNklUQXNkM0pwZEdGaWJHVTZJVEI5S1R0OUtTZ3BPMzA9XCI7XG5pZihzdXBwb3J0c1YxICYmICF3aW5kb3dbJ25vLW5hdGl2ZS1zaGltJ10pe1xuXHRldmFsKHdpbmRvdy5hdG9iKG5hdGl2ZVNoaW1CYXNlNjQpKTtcblx0bmF0aXZlU2hpbSgpO1xufWVsc2V7XG5cdGN1c3RvbUVsZW1lbnRzKCk7XG59XG5pZiAoIXN1cHBvcnRzUHJvbWlzZSkge1xuXHRwcm9taXNlUG9seWZpbGwoKTtcbn1cblxuZnVuY3Rpb24gY3VzdG9tRWxlbWVudHMoKSB7XG4oZnVuY3Rpb24oKXtcbid1c2Ugc3RyaWN0Jzt2YXIgZz1uZXcgZnVuY3Rpb24oKXt9O3ZhciBhYT1uZXcgU2V0KFwiYW5ub3RhdGlvbi14bWwgY29sb3ItcHJvZmlsZSBmb250LWZhY2UgZm9udC1mYWNlLXNyYyBmb250LWZhY2UtdXJpIGZvbnQtZmFjZS1mb3JtYXQgZm9udC1mYWNlLW5hbWUgbWlzc2luZy1nbHlwaFwiLnNwbGl0KFwiIFwiKSk7ZnVuY3Rpb24gayhiKXt2YXIgYT1hYS5oYXMoYik7Yj0vXlthLXpdWy4wLTlfYS16XSotW1xcLS4wLTlfYS16XSokLy50ZXN0KGIpO3JldHVybiFhJiZifWZ1bmN0aW9uIGwoYil7dmFyIGE9Yi5pc0Nvbm5lY3RlZDtpZih2b2lkIDAhPT1hKXJldHVybiBhO2Zvcig7YiYmIShiLl9fQ0VfaXNJbXBvcnREb2N1bWVudHx8YiBpbnN0YW5jZW9mIERvY3VtZW50KTspYj1iLnBhcmVudE5vZGV8fCh3aW5kb3cuU2hhZG93Um9vdCYmYiBpbnN0YW5jZW9mIFNoYWRvd1Jvb3Q/Yi5ob3N0OnZvaWQgMCk7cmV0dXJuISghYnx8IShiLl9fQ0VfaXNJbXBvcnREb2N1bWVudHx8YiBpbnN0YW5jZW9mIERvY3VtZW50KSl9XG5mdW5jdGlvbiBtKGIsYSl7Zm9yKDthJiZhIT09YiYmIWEubmV4dFNpYmxpbmc7KWE9YS5wYXJlbnROb2RlO3JldHVybiBhJiZhIT09Yj9hLm5leHRTaWJsaW5nOm51bGx9XG5mdW5jdGlvbiBuKGIsYSxlKXtlPWU/ZTpuZXcgU2V0O2Zvcih2YXIgYz1iO2M7KXtpZihjLm5vZGVUeXBlPT09Tm9kZS5FTEVNRU5UX05PREUpe3ZhciBkPWM7YShkKTt2YXIgaD1kLmxvY2FsTmFtZTtpZihcImxpbmtcIj09PWgmJlwiaW1wb3J0XCI9PT1kLmdldEF0dHJpYnV0ZShcInJlbFwiKSl7Yz1kLmltcG9ydDtpZihjIGluc3RhbmNlb2YgTm9kZSYmIWUuaGFzKGMpKWZvcihlLmFkZChjKSxjPWMuZmlyc3RDaGlsZDtjO2M9Yy5uZXh0U2libGluZyluKGMsYSxlKTtjPW0oYixkKTtjb250aW51ZX1lbHNlIGlmKFwidGVtcGxhdGVcIj09PWgpe2M9bShiLGQpO2NvbnRpbnVlfWlmKGQ9ZC5fX0NFX3NoYWRvd1Jvb3QpZm9yKGQ9ZC5maXJzdENoaWxkO2Q7ZD1kLm5leHRTaWJsaW5nKW4oZCxhLGUpfWM9Yy5maXJzdENoaWxkP2MuZmlyc3RDaGlsZDptKGIsYyl9fWZ1bmN0aW9uIHEoYixhLGUpe2JbYV09ZX07ZnVuY3Rpb24gcigpe3RoaXMuYT1uZXcgTWFwO3RoaXMuZj1uZXcgTWFwO3RoaXMuYz1bXTt0aGlzLmI9ITF9ZnVuY3Rpb24gYmEoYixhLGUpe2IuYS5zZXQoYSxlKTtiLmYuc2V0KGUuY29uc3RydWN0b3IsZSl9ZnVuY3Rpb24gdChiLGEpe2IuYj0hMDtiLmMucHVzaChhKX1mdW5jdGlvbiB2KGIsYSl7Yi5iJiZuKGEsZnVuY3Rpb24oYSl7cmV0dXJuIHcoYixhKX0pfWZ1bmN0aW9uIHcoYixhKXtpZihiLmImJiFhLl9fQ0VfcGF0Y2hlZCl7YS5fX0NFX3BhdGNoZWQ9ITA7Zm9yKHZhciBlPTA7ZTxiLmMubGVuZ3RoO2UrKyliLmNbZV0oYSl9fWZ1bmN0aW9uIHgoYixhKXt2YXIgZT1bXTtuKGEsZnVuY3Rpb24oYil7cmV0dXJuIGUucHVzaChiKX0pO2ZvcihhPTA7YTxlLmxlbmd0aDthKyspe3ZhciBjPWVbYV07MT09PWMuX19DRV9zdGF0ZT9iLmNvbm5lY3RlZENhbGxiYWNrKGMpOnkoYixjKX19XG5mdW5jdGlvbiB6KGIsYSl7dmFyIGU9W107bihhLGZ1bmN0aW9uKGIpe3JldHVybiBlLnB1c2goYil9KTtmb3IoYT0wO2E8ZS5sZW5ndGg7YSsrKXt2YXIgYz1lW2FdOzE9PT1jLl9fQ0Vfc3RhdGUmJmIuZGlzY29ubmVjdGVkQ2FsbGJhY2soYyl9fVxuZnVuY3Rpb24gQShiLGEsZSl7ZT1lP2U6bmV3IFNldDt2YXIgYz1bXTtuKGEsZnVuY3Rpb24oZCl7aWYoXCJsaW5rXCI9PT1kLmxvY2FsTmFtZSYmXCJpbXBvcnRcIj09PWQuZ2V0QXR0cmlidXRlKFwicmVsXCIpKXt2YXIgYT1kLmltcG9ydDthIGluc3RhbmNlb2YgTm9kZSYmXCJjb21wbGV0ZVwiPT09YS5yZWFkeVN0YXRlPyhhLl9fQ0VfaXNJbXBvcnREb2N1bWVudD0hMCxhLl9fQ0VfaGFzUmVnaXN0cnk9ITApOmQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixmdW5jdGlvbigpe3ZhciBhPWQuaW1wb3J0O2EuX19DRV9kb2N1bWVudExvYWRIYW5kbGVkfHwoYS5fX0NFX2RvY3VtZW50TG9hZEhhbmRsZWQ9ITAsYS5fX0NFX2lzSW1wb3J0RG9jdW1lbnQ9ITAsYS5fX0NFX2hhc1JlZ2lzdHJ5PSEwLG5ldyBTZXQoZSksZS5kZWxldGUoYSksQShiLGEsZSkpfSl9ZWxzZSBjLnB1c2goZCl9LGUpO2lmKGIuYilmb3IoYT0wO2E8Yy5sZW5ndGg7YSsrKXcoYixjW2FdKTtmb3IoYT0wO2E8Yy5sZW5ndGg7YSsrKXkoYixcbmNbYV0pfVxuZnVuY3Rpb24geShiLGEpe2lmKHZvaWQgMD09PWEuX19DRV9zdGF0ZSl7dmFyIGU9Yi5hLmdldChhLmxvY2FsTmFtZSk7aWYoZSl7ZS5jb25zdHJ1Y3Rpb25TdGFjay5wdXNoKGEpO3ZhciBjPWUuY29uc3RydWN0b3I7dHJ5e3RyeXtpZihuZXcgYyE9PWEpdGhyb3cgRXJyb3IoXCJUaGUgY3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3IgZGlkIG5vdCBwcm9kdWNlIHRoZSBlbGVtZW50IGJlaW5nIHVwZ3JhZGVkLlwiKTt9ZmluYWxseXtlLmNvbnN0cnVjdGlvblN0YWNrLnBvcCgpfX1jYXRjaChmKXt0aHJvdyBhLl9fQ0Vfc3RhdGU9MixmO31hLl9fQ0Vfc3RhdGU9MTthLl9fQ0VfZGVmaW5pdGlvbj1lO2lmKGUuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKWZvcihlPWUub2JzZXJ2ZWRBdHRyaWJ1dGVzLGM9MDtjPGUubGVuZ3RoO2MrKyl7dmFyIGQ9ZVtjXSxoPWEuZ2V0QXR0cmlidXRlKGQpO251bGwhPT1oJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhLGQsbnVsbCxoLG51bGwpfWwoYSkmJmIuY29ubmVjdGVkQ2FsbGJhY2soYSl9fX1cbnIucHJvdG90eXBlLmNvbm5lY3RlZENhbGxiYWNrPWZ1bmN0aW9uKGIpe3ZhciBhPWIuX19DRV9kZWZpbml0aW9uO2EuY29ubmVjdGVkQ2FsbGJhY2smJmEuY29ubmVjdGVkQ2FsbGJhY2suY2FsbChiKX07ci5wcm90b3R5cGUuZGlzY29ubmVjdGVkQ2FsbGJhY2s9ZnVuY3Rpb24oYil7dmFyIGE9Yi5fX0NFX2RlZmluaXRpb247YS5kaXNjb25uZWN0ZWRDYWxsYmFjayYmYS5kaXNjb25uZWN0ZWRDYWxsYmFjay5jYWxsKGIpfTtyLnByb3RvdHlwZS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s9ZnVuY3Rpb24oYixhLGUsYyxkKXt2YXIgaD1iLl9fQ0VfZGVmaW5pdGlvbjtoLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmLTE8aC5vYnNlcnZlZEF0dHJpYnV0ZXMuaW5kZXhPZihhKSYmaC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbChiLGEsZSxjLGQpfTtmdW5jdGlvbiBCKGIsYSl7dGhpcy5jPWI7dGhpcy5hPWE7dGhpcy5iPXZvaWQgMDtBKHRoaXMuYyx0aGlzLmEpO1wibG9hZGluZ1wiPT09dGhpcy5hLnJlYWR5U3RhdGUmJih0aGlzLmI9bmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5mLmJpbmQodGhpcykpLHRoaXMuYi5vYnNlcnZlKHRoaXMuYSx7Y2hpbGRMaXN0OiEwLHN1YnRyZWU6ITB9KSl9ZnVuY3Rpb24gQyhiKXtiLmImJmIuYi5kaXNjb25uZWN0KCl9Qi5wcm90b3R5cGUuZj1mdW5jdGlvbihiKXt2YXIgYT10aGlzLmEucmVhZHlTdGF0ZTtcImludGVyYWN0aXZlXCIhPT1hJiZcImNvbXBsZXRlXCIhPT1hfHxDKHRoaXMpO2ZvcihhPTA7YTxiLmxlbmd0aDthKyspZm9yKHZhciBlPWJbYV0uYWRkZWROb2RlcyxjPTA7YzxlLmxlbmd0aDtjKyspQSh0aGlzLmMsZVtjXSl9O2Z1bmN0aW9uIGNhKCl7dmFyIGI9dGhpczt0aGlzLmI9dGhpcy5hPXZvaWQgMDt0aGlzLmM9bmV3IFByb21pc2UoZnVuY3Rpb24oYSl7Yi5iPWE7Yi5hJiZhKGIuYSl9KX1mdW5jdGlvbiBEKGIpe2lmKGIuYSl0aHJvdyBFcnJvcihcIkFscmVhZHkgcmVzb2x2ZWQuXCIpO2IuYT12b2lkIDA7Yi5iJiZiLmIodm9pZCAwKX07ZnVuY3Rpb24gRShiKXt0aGlzLmY9ITE7dGhpcy5hPWI7dGhpcy5oPW5ldyBNYXA7dGhpcy5nPWZ1bmN0aW9uKGIpe3JldHVybiBiKCl9O3RoaXMuYj0hMTt0aGlzLmM9W107dGhpcy5qPW5ldyBCKGIsZG9jdW1lbnQpfVxuRS5wcm90b3R5cGUubD1mdW5jdGlvbihiLGEpe3ZhciBlPXRoaXM7aWYoIShhIGluc3RhbmNlb2YgRnVuY3Rpb24pKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvcnMgbXVzdCBiZSBmdW5jdGlvbnMuXCIpO2lmKCFrKGIpKXRocm93IG5ldyBTeW50YXhFcnJvcihcIlRoZSBlbGVtZW50IG5hbWUgJ1wiK2IrXCInIGlzIG5vdCB2YWxpZC5cIik7aWYodGhpcy5hLmEuZ2V0KGIpKXRocm93IEVycm9yKFwiQSBjdXN0b20gZWxlbWVudCB3aXRoIG5hbWUgJ1wiK2IrXCInIGhhcyBhbHJlYWR5IGJlZW4gZGVmaW5lZC5cIik7aWYodGhpcy5mKXRocm93IEVycm9yKFwiQSBjdXN0b20gZWxlbWVudCBpcyBhbHJlYWR5IGJlaW5nIGRlZmluZWQuXCIpO3RoaXMuZj0hMDt2YXIgYyxkLGgsZix1O3RyeXt2YXIgcD1mdW5jdGlvbihiKXt2YXIgYT1QW2JdO2lmKHZvaWQgMCE9PWEmJiEoYSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSl0aHJvdyBFcnJvcihcIlRoZSAnXCIrYitcIicgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLlwiKTtcbnJldHVybiBhfSxQPWEucHJvdG90eXBlO2lmKCEoUCBpbnN0YW5jZW9mIE9iamVjdCkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvcidzIHByb3RvdHlwZSBpcyBub3QgYW4gb2JqZWN0LlwiKTtjPXAoXCJjb25uZWN0ZWRDYWxsYmFja1wiKTtkPXAoXCJkaXNjb25uZWN0ZWRDYWxsYmFja1wiKTtoPXAoXCJhZG9wdGVkQ2FsbGJhY2tcIik7Zj1wKFwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXCIpO3U9YS5vYnNlcnZlZEF0dHJpYnV0ZXN8fFtdfWNhdGNoKHZhKXtyZXR1cm59ZmluYWxseXt0aGlzLmY9ITF9YmEodGhpcy5hLGIse2xvY2FsTmFtZTpiLGNvbnN0cnVjdG9yOmEsY29ubmVjdGVkQ2FsbGJhY2s6YyxkaXNjb25uZWN0ZWRDYWxsYmFjazpkLGFkb3B0ZWRDYWxsYmFjazpoLGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjazpmLG9ic2VydmVkQXR0cmlidXRlczp1LGNvbnN0cnVjdGlvblN0YWNrOltdfSk7dGhpcy5jLnB1c2goYik7dGhpcy5ifHwodGhpcy5iPVxuITAsdGhpcy5nKGZ1bmN0aW9uKCl7aWYoITEhPT1lLmIpZm9yKGUuYj0hMSxBKGUuYSxkb2N1bWVudCk7MDxlLmMubGVuZ3RoOyl7dmFyIGI9ZS5jLnNoaWZ0KCk7KGI9ZS5oLmdldChiKSkmJkQoYil9fSkpfTtFLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oYil7aWYoYj10aGlzLmEuYS5nZXQoYikpcmV0dXJuIGIuY29uc3RydWN0b3J9O0UucHJvdG90eXBlLm89ZnVuY3Rpb24oYil7aWYoIWsoYikpcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBTeW50YXhFcnJvcihcIidcIitiK1wiJyBpcyBub3QgYSB2YWxpZCBjdXN0b20gZWxlbWVudCBuYW1lLlwiKSk7dmFyIGE9dGhpcy5oLmdldChiKTtpZihhKXJldHVybiBhLmM7YT1uZXcgY2E7dGhpcy5oLnNldChiLGEpO3RoaXMuYS5hLmdldChiKSYmLTE9PT10aGlzLmMuaW5kZXhPZihiKSYmRChhKTtyZXR1cm4gYS5jfTtFLnByb3RvdHlwZS5tPWZ1bmN0aW9uKGIpe0ModGhpcy5qKTt2YXIgYT10aGlzLmc7dGhpcy5nPWZ1bmN0aW9uKGUpe3JldHVybiBiKGZ1bmN0aW9uKCl7cmV0dXJuIGEoZSl9KX19O1xud2luZG93LkN1c3RvbUVsZW1lbnRSZWdpc3RyeT1FO0UucHJvdG90eXBlLmRlZmluZT1FLnByb3RvdHlwZS5sO0UucHJvdG90eXBlLmdldD1FLnByb3RvdHlwZS5nZXQ7RS5wcm90b3R5cGUud2hlbkRlZmluZWQ9RS5wcm90b3R5cGUubztFLnByb3RvdHlwZS5wb2x5ZmlsbFdyYXBGbHVzaENhbGxiYWNrPUUucHJvdG90eXBlLm07dmFyIEY9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50LGRhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudE5TLGVhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuaW1wb3J0Tm9kZSxmYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLnByZXBlbmQsZ2E9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5hcHBlbmQsRz13aW5kb3cuTm9kZS5wcm90b3R5cGUuY2xvbmVOb2RlLEg9d2luZG93Lk5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkLEk9d2luZG93Lk5vZGUucHJvdG90eXBlLmluc2VydEJlZm9yZSxKPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5yZW1vdmVDaGlsZCxLPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5yZXBsYWNlQ2hpbGQsTD1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5Ob2RlLnByb3RvdHlwZSxcInRleHRDb250ZW50XCIpLE09d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmF0dGFjaFNoYWRvdyxOPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93LkVsZW1lbnQucHJvdG90eXBlLFxuXCJpbm5lckhUTUxcIiksTz13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlLFE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZSxSPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGUsUz13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlTlMsVD13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlTlMsVT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlTlMsVj13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuaW5zZXJ0QWRqYWNlbnRFbGVtZW50LGhhPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5wcmVwZW5kLGlhPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hcHBlbmQsamE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmJlZm9yZSxrYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYWZ0ZXIsbGE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlcGxhY2VXaXRoLG1hPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZW1vdmUsXG5uYT13aW5kb3cuSFRNTEVsZW1lbnQsVz1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGUsXCJpbm5lckhUTUxcIiksWD13aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlLmluc2VydEFkamFjZW50RWxlbWVudDtmdW5jdGlvbiBvYSgpe3ZhciBiPVk7d2luZG93LkhUTUxFbGVtZW50PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYSgpe3ZhciBhPXRoaXMuY29uc3RydWN0b3IsYz1iLmYuZ2V0KGEpO2lmKCFjKXRocm93IEVycm9yKFwiVGhlIGN1c3RvbSBlbGVtZW50IGJlaW5nIGNvbnN0cnVjdGVkIHdhcyBub3QgcmVnaXN0ZXJlZCB3aXRoIGBjdXN0b21FbGVtZW50c2AuXCIpO3ZhciBkPWMuY29uc3RydWN0aW9uU3RhY2s7aWYoIWQubGVuZ3RoKXJldHVybiBkPUYuY2FsbChkb2N1bWVudCxjLmxvY2FsTmFtZSksT2JqZWN0LnNldFByb3RvdHlwZU9mKGQsYS5wcm90b3R5cGUpLGQuX19DRV9zdGF0ZT0xLGQuX19DRV9kZWZpbml0aW9uPWMsdyhiLGQpLGQ7dmFyIGM9ZC5sZW5ndGgtMSxoPWRbY107aWYoaD09PWcpdGhyb3cgRXJyb3IoXCJUaGUgSFRNTEVsZW1lbnQgY29uc3RydWN0b3Igd2FzIGVpdGhlciBjYWxsZWQgcmVlbnRyYW50bHkgZm9yIHRoaXMgY29uc3RydWN0b3Igb3IgY2FsbGVkIG11bHRpcGxlIHRpbWVzLlwiKTtcbmRbY109ZztPYmplY3Quc2V0UHJvdG90eXBlT2YoaCxhLnByb3RvdHlwZSk7dyhiLGgpO3JldHVybiBofWEucHJvdG90eXBlPW5hLnByb3RvdHlwZTtyZXR1cm4gYX0oKX07ZnVuY3Rpb24gcGEoYixhLGUpe2EucHJlcGVuZD1mdW5jdGlvbihhKXtmb3IodmFyIGQ9W10sYz0wO2M8YXJndW1lbnRzLmxlbmd0aDsrK2MpZFtjLTBdPWFyZ3VtZW50c1tjXTtjPWQuZmlsdGVyKGZ1bmN0aW9uKGIpe3JldHVybiBiIGluc3RhbmNlb2YgTm9kZSYmbChiKX0pO2UuaS5hcHBseSh0aGlzLGQpO2Zvcih2YXIgZj0wO2Y8Yy5sZW5ndGg7ZisrKXooYixjW2ZdKTtpZihsKHRoaXMpKWZvcihjPTA7YzxkLmxlbmd0aDtjKyspZj1kW2NdLGYgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZil9O2EuYXBwZW5kPWZ1bmN0aW9uKGEpe2Zvcih2YXIgZD1bXSxjPTA7Yzxhcmd1bWVudHMubGVuZ3RoOysrYylkW2MtMF09YXJndW1lbnRzW2NdO2M9ZC5maWx0ZXIoZnVuY3Rpb24oYil7cmV0dXJuIGIgaW5zdGFuY2VvZiBOb2RlJiZsKGIpfSk7ZS5hcHBlbmQuYXBwbHkodGhpcyxkKTtmb3IodmFyIGY9MDtmPGMubGVuZ3RoO2YrKyl6KGIsY1tmXSk7aWYobCh0aGlzKSlmb3IoYz0wO2M8XG5kLmxlbmd0aDtjKyspZj1kW2NdLGYgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZil9fTtmdW5jdGlvbiBxYSgpe3ZhciBiPVk7cShEb2N1bWVudC5wcm90b3R5cGUsXCJjcmVhdGVFbGVtZW50XCIsZnVuY3Rpb24oYSl7aWYodGhpcy5fX0NFX2hhc1JlZ2lzdHJ5KXt2YXIgZT1iLmEuZ2V0KGEpO2lmKGUpcmV0dXJuIG5ldyBlLmNvbnN0cnVjdG9yfWE9Ri5jYWxsKHRoaXMsYSk7dyhiLGEpO3JldHVybiBhfSk7cShEb2N1bWVudC5wcm90b3R5cGUsXCJpbXBvcnROb2RlXCIsZnVuY3Rpb24oYSxlKXthPWVhLmNhbGwodGhpcyxhLGUpO3RoaXMuX19DRV9oYXNSZWdpc3RyeT9BKGIsYSk6dihiLGEpO3JldHVybiBhfSk7cShEb2N1bWVudC5wcm90b3R5cGUsXCJjcmVhdGVFbGVtZW50TlNcIixmdW5jdGlvbihhLGUpe2lmKHRoaXMuX19DRV9oYXNSZWdpc3RyeSYmKG51bGw9PT1hfHxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIj09PWEpKXt2YXIgYz1iLmEuZ2V0KGUpO2lmKGMpcmV0dXJuIG5ldyBjLmNvbnN0cnVjdG9yfWE9ZGEuY2FsbCh0aGlzLGEsZSk7dyhiLGEpO3JldHVybiBhfSk7XG5wYShiLERvY3VtZW50LnByb3RvdHlwZSx7aTpmYSxhcHBlbmQ6Z2F9KX07ZnVuY3Rpb24gcmEoKXt2YXIgYj1ZO2Z1bmN0aW9uIGEoYSxjKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxcInRleHRDb250ZW50XCIse2VudW1lcmFibGU6Yy5lbnVtZXJhYmxlLGNvbmZpZ3VyYWJsZTohMCxnZXQ6Yy5nZXQsc2V0OmZ1bmN0aW9uKGEpe2lmKHRoaXMubm9kZVR5cGU9PT1Ob2RlLlRFWFRfTk9ERSljLnNldC5jYWxsKHRoaXMsYSk7ZWxzZXt2YXIgZD12b2lkIDA7aWYodGhpcy5maXJzdENoaWxkKXt2YXIgZT10aGlzLmNoaWxkTm9kZXMsdT1lLmxlbmd0aDtpZigwPHUmJmwodGhpcykpZm9yKHZhciBkPUFycmF5KHUpLHA9MDtwPHU7cCsrKWRbcF09ZVtwXX1jLnNldC5jYWxsKHRoaXMsYSk7aWYoZClmb3IoYT0wO2E8ZC5sZW5ndGg7YSsrKXooYixkW2FdKX19fSl9cShOb2RlLnByb3RvdHlwZSxcImluc2VydEJlZm9yZVwiLGZ1bmN0aW9uKGEsYyl7aWYoYSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhLmNoaWxkTm9kZXMpO1xuYT1JLmNhbGwodGhpcyxhLGMpO2lmKGwodGhpcykpZm9yKGM9MDtjPGQubGVuZ3RoO2MrKyl4KGIsZFtjXSk7cmV0dXJuIGF9ZD1sKGEpO2M9SS5jYWxsKHRoaXMsYSxjKTtkJiZ6KGIsYSk7bCh0aGlzKSYmeChiLGEpO3JldHVybiBjfSk7cShOb2RlLnByb3RvdHlwZSxcImFwcGVuZENoaWxkXCIsZnVuY3Rpb24oYSl7aWYoYSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpe3ZhciBjPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhLmNoaWxkTm9kZXMpO2E9SC5jYWxsKHRoaXMsYSk7aWYobCh0aGlzKSlmb3IodmFyIGQ9MDtkPGMubGVuZ3RoO2QrKyl4KGIsY1tkXSk7cmV0dXJuIGF9Yz1sKGEpO2Q9SC5jYWxsKHRoaXMsYSk7YyYmeihiLGEpO2wodGhpcykmJngoYixhKTtyZXR1cm4gZH0pO3EoTm9kZS5wcm90b3R5cGUsXCJjbG9uZU5vZGVcIixmdW5jdGlvbihhKXthPUcuY2FsbCh0aGlzLGEpO3RoaXMub3duZXJEb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5P0EoYixhKTp2KGIsYSk7XG5yZXR1cm4gYX0pO3EoTm9kZS5wcm90b3R5cGUsXCJyZW1vdmVDaGlsZFwiLGZ1bmN0aW9uKGEpe3ZhciBjPWwoYSksZD1KLmNhbGwodGhpcyxhKTtjJiZ6KGIsYSk7cmV0dXJuIGR9KTtxKE5vZGUucHJvdG90eXBlLFwicmVwbGFjZUNoaWxkXCIsZnVuY3Rpb24oYSxjKXtpZihhIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCl7dmFyIGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGEuY2hpbGROb2Rlcyk7YT1LLmNhbGwodGhpcyxhLGMpO2lmKGwodGhpcykpZm9yKHooYixjKSxjPTA7YzxkLmxlbmd0aDtjKyspeChiLGRbY10pO3JldHVybiBhfXZhciBkPWwoYSksZT1LLmNhbGwodGhpcyxhLGMpLGY9bCh0aGlzKTtmJiZ6KGIsYyk7ZCYmeihiLGEpO2YmJngoYixhKTtyZXR1cm4gZX0pO0wmJkwuZ2V0P2EoTm9kZS5wcm90b3R5cGUsTCk6dChiLGZ1bmN0aW9uKGIpe2EoYix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7Zm9yKHZhciBhPVtdLGI9XG4wO2I8dGhpcy5jaGlsZE5vZGVzLmxlbmd0aDtiKyspYS5wdXNoKHRoaXMuY2hpbGROb2Rlc1tiXS50ZXh0Q29udGVudCk7cmV0dXJuIGEuam9pbihcIlwiKX0sc2V0OmZ1bmN0aW9uKGEpe2Zvcig7dGhpcy5maXJzdENoaWxkOylKLmNhbGwodGhpcyx0aGlzLmZpcnN0Q2hpbGQpO0guY2FsbCh0aGlzLGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKX19KX0pfTtmdW5jdGlvbiBzYShiKXt2YXIgYT1FbGVtZW50LnByb3RvdHlwZTthLmJlZm9yZT1mdW5jdGlvbihhKXtmb3IodmFyIGM9W10sZD0wO2Q8YXJndW1lbnRzLmxlbmd0aDsrK2QpY1tkLTBdPWFyZ3VtZW50c1tkXTtkPWMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgTm9kZSYmbChhKX0pO2phLmFwcGx5KHRoaXMsYyk7Zm9yKHZhciBlPTA7ZTxkLmxlbmd0aDtlKyspeihiLGRbZV0pO2lmKGwodGhpcykpZm9yKGQ9MDtkPGMubGVuZ3RoO2QrKyllPWNbZF0sZSBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixlKX07YS5hZnRlcj1mdW5jdGlvbihhKXtmb3IodmFyIGM9W10sZD0wO2Q8YXJndW1lbnRzLmxlbmd0aDsrK2QpY1tkLTBdPWFyZ3VtZW50c1tkXTtkPWMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgTm9kZSYmbChhKX0pO2thLmFwcGx5KHRoaXMsYyk7Zm9yKHZhciBlPTA7ZTxkLmxlbmd0aDtlKyspeihiLGRbZV0pO2lmKGwodGhpcykpZm9yKGQ9XG4wO2Q8Yy5sZW5ndGg7ZCsrKWU9Y1tkXSxlIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGUpfTthLnJlcGxhY2VXaXRoPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxkPTA7ZDxhcmd1bWVudHMubGVuZ3RoOysrZCljW2QtMF09YXJndW1lbnRzW2RdO3ZhciBkPWMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgTm9kZSYmbChhKX0pLGU9bCh0aGlzKTtsYS5hcHBseSh0aGlzLGMpO2Zvcih2YXIgZj0wO2Y8ZC5sZW5ndGg7ZisrKXooYixkW2ZdKTtpZihlKWZvcih6KGIsdGhpcyksZD0wO2Q8Yy5sZW5ndGg7ZCsrKWU9Y1tkXSxlIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGUpfTthLnJlbW92ZT1mdW5jdGlvbigpe3ZhciBhPWwodGhpcyk7bWEuY2FsbCh0aGlzKTthJiZ6KGIsdGhpcyl9fTtmdW5jdGlvbiB0YSgpe3ZhciBiPVk7ZnVuY3Rpb24gYShhLGMpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLFwiaW5uZXJIVE1MXCIse2VudW1lcmFibGU6Yy5lbnVtZXJhYmxlLGNvbmZpZ3VyYWJsZTohMCxnZXQ6Yy5nZXQsc2V0OmZ1bmN0aW9uKGEpe3ZhciBkPXRoaXMsZT12b2lkIDA7bCh0aGlzKSYmKGU9W10sbih0aGlzLGZ1bmN0aW9uKGEpe2EhPT1kJiZlLnB1c2goYSl9KSk7Yy5zZXQuY2FsbCh0aGlzLGEpO2lmKGUpZm9yKHZhciBmPTA7ZjxlLmxlbmd0aDtmKyspe3ZhciBoPWVbZl07MT09PWguX19DRV9zdGF0ZSYmYi5kaXNjb25uZWN0ZWRDYWxsYmFjayhoKX10aGlzLm93bmVyRG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT9BKGIsdGhpcyk6dihiLHRoaXMpO3JldHVybiBhfX0pfWZ1bmN0aW9uIGUoYSxjKXtxKGEsXCJpbnNlcnRBZGphY2VudEVsZW1lbnRcIixmdW5jdGlvbihhLGQpe3ZhciBlPWwoZCk7YT1jLmNhbGwodGhpcyxhLGQpO2UmJnooYixkKTtsKGEpJiZ4KGIsZCk7XG5yZXR1cm4gYX0pfU0/cShFbGVtZW50LnByb3RvdHlwZSxcImF0dGFjaFNoYWRvd1wiLGZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9fQ0Vfc2hhZG93Um9vdD1hPU0uY2FsbCh0aGlzLGEpfSk6Y29uc29sZS53YXJuKFwiQ3VzdG9tIEVsZW1lbnRzOiBgRWxlbWVudCNhdHRhY2hTaGFkb3dgIHdhcyBub3QgcGF0Y2hlZC5cIik7aWYoTiYmTi5nZXQpYShFbGVtZW50LnByb3RvdHlwZSxOKTtlbHNlIGlmKFcmJlcuZ2V0KWEoSFRNTEVsZW1lbnQucHJvdG90eXBlLFcpO2Vsc2V7dmFyIGM9Ri5jYWxsKGRvY3VtZW50LFwiZGl2XCIpO3QoYixmdW5jdGlvbihiKXthKGIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBHLmNhbGwodGhpcywhMCkuaW5uZXJIVE1MfSxzZXQ6ZnVuY3Rpb24oYSl7dmFyIGI9XCJ0ZW1wbGF0ZVwiPT09dGhpcy5sb2NhbE5hbWU/dGhpcy5jb250ZW50OnRoaXM7Zm9yKGMuaW5uZXJIVE1MPWE7MDxiLmNoaWxkTm9kZXMubGVuZ3RoOylKLmNhbGwoYixcbmIuY2hpbGROb2Rlc1swXSk7Zm9yKDswPGMuY2hpbGROb2Rlcy5sZW5ndGg7KUguY2FsbChiLGMuY2hpbGROb2Rlc1swXSl9fSl9KX1xKEVsZW1lbnQucHJvdG90eXBlLFwic2V0QXR0cmlidXRlXCIsZnVuY3Rpb24oYSxjKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBRLmNhbGwodGhpcyxhLGMpO3ZhciBkPU8uY2FsbCh0aGlzLGEpO1EuY2FsbCh0aGlzLGEsYyk7Yz1PLmNhbGwodGhpcyxhKTtkIT09YyYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcyxhLGQsYyxudWxsKX0pO3EoRWxlbWVudC5wcm90b3R5cGUsXCJzZXRBdHRyaWJ1dGVOU1wiLGZ1bmN0aW9uKGEsYyxlKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBULmNhbGwodGhpcyxhLGMsZSk7dmFyIGQ9Uy5jYWxsKHRoaXMsYSxjKTtULmNhbGwodGhpcyxhLGMsZSk7ZT1TLmNhbGwodGhpcyxhLGMpO2QhPT1lJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGMsZCxlLGEpfSk7cShFbGVtZW50LnByb3RvdHlwZSxcblwicmVtb3ZlQXR0cmlidXRlXCIsZnVuY3Rpb24oYSl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gUi5jYWxsKHRoaXMsYSk7dmFyIGM9Ty5jYWxsKHRoaXMsYSk7Ui5jYWxsKHRoaXMsYSk7bnVsbCE9PWMmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYSxjLG51bGwsbnVsbCl9KTtxKEVsZW1lbnQucHJvdG90eXBlLFwicmVtb3ZlQXR0cmlidXRlTlNcIixmdW5jdGlvbihhLGMpe2lmKDEhPT10aGlzLl9fQ0Vfc3RhdGUpcmV0dXJuIFUuY2FsbCh0aGlzLGEsYyk7dmFyIGQ9Uy5jYWxsKHRoaXMsYSxjKTtVLmNhbGwodGhpcyxhLGMpO3ZhciBlPVMuY2FsbCh0aGlzLGEsYyk7ZCE9PWUmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYyxkLGUsYSl9KTtYP2UoSFRNTEVsZW1lbnQucHJvdG90eXBlLFgpOlY/ZShFbGVtZW50LnByb3RvdHlwZSxWKTpjb25zb2xlLndhcm4oXCJDdXN0b20gRWxlbWVudHM6IGBFbGVtZW50I2luc2VydEFkamFjZW50RWxlbWVudGAgd2FzIG5vdCBwYXRjaGVkLlwiKTtcbnBhKGIsRWxlbWVudC5wcm90b3R5cGUse2k6aGEsYXBwZW5kOmlhfSk7c2EoYil9O1xudmFyIFo9d2luZG93LmN1c3RvbUVsZW1lbnRzO2lmKCFafHxaLmZvcmNlUG9seWZpbGx8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIFouZGVmaW5lfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBaLmdldCl7dmFyIFk9bmV3IHI7b2EoKTtxYSgpO3JhKCk7dGEoKTtkb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5PSEwO3ZhciB1YT1uZXcgRShZKTtPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LFwiY3VzdG9tRWxlbWVudHNcIix7Y29uZmlndXJhYmxlOiEwLGVudW1lcmFibGU6ITAsdmFsdWU6dWF9KX07XG59KS5jYWxsKHNlbGYpO1xufVxuLy8gQGxpY2Vuc2UgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuXG5cbmZ1bmN0aW9uIHByb21pc2VQb2x5ZmlsbCAoKSB7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGF5bG9yaGFrZXMvcHJvbWlzZS1wb2x5ZmlsbC9ibG9iL21hc3Rlci9wcm9taXNlLmpzXG52YXIgc2V0VGltZW91dEZ1bmMgPSBzZXRUaW1lb3V0O1xuZnVuY3Rpb24gbm9vcCgpIHt9XG5mdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG5yZXR1cm4gZnVuY3Rpb24gKCkge1xuZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbn07XG59XG5mdW5jdGlvbiBQcm9taXNlKGZuKSB7XG5pZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbmlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG50aGlzLl9zdGF0ZSA9IDA7XG50aGlzLl9oYW5kbGVkID0gZmFsc2U7XG50aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbnRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG5kb1Jlc29sdmUoZm4sIHRoaXMpO1xufVxuZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG53aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbnNlbGYgPSBzZWxmLl92YWx1ZTtcbn1cbmlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xucmV0dXJuO1xufVxuc2VsZi5faGFuZGxlZCA9IHRydWU7XG5Qcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbiAoKSB7XG52YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbmlmIChjYiA9PT0gbnVsbCkge1xuKHNlbGYuX3N0YXRlID09PSAxID8gcmVzb2x2ZSA6IHJlamVjdCkoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fdmFsdWUpO1xucmV0dXJuO1xufVxudmFyIHJldDtcbnRyeSB7XG5yZXQgPSBjYihzZWxmLl92YWx1ZSk7XG59IGNhdGNoIChlKSB7XG5yZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG5yZXR1cm47XG59XG5yZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG59KTtcbn1cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbnRyeSB7XG4vLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpO1xuaWYgKG5ld1ZhbHVlICYmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbnZhciB0aGVuID0gbmV3VmFsdWUudGhlbjtcbmlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbnNlbGYuX3N0YXRlID0gMztcbnNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG5maW5hbGUoc2VsZik7XG5yZXR1cm47XG59IGVsc2UgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG5kb1Jlc29sdmUoYmluZCh0aGVuLCBuZXdWYWx1ZSksIHNlbGYpO1xucmV0dXJuO1xufVxufVxuc2VsZi5fc3RhdGUgPSAxO1xuc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbmZpbmFsZShzZWxmKTtcbn0gY2F0Y2ggKGUpIHtcbnJlamVjdChzZWxmLCBlKTtcbn1cbn1cbmZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuc2VsZi5fc3RhdGUgPSAyO1xuc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbmZpbmFsZShzZWxmKTtcbn1cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG5pZiAoc2VsZi5fc3RhdGUgPT09IDIgJiYgc2VsZi5fZGVmZXJyZWRzLmxlbmd0aCA9PT0gMCkge1xuUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG5pZiAoIXNlbGYuX2hhbmRsZWQpIHtcblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuKHNlbGYuX3ZhbHVlKTtcbn1cbn0pO1xufVxuXG5mb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5fZGVmZXJyZWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5oYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbn1cbnNlbGYuX2RlZmVycmVkcyA9IG51bGw7XG59XG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKSB7XG50aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xudGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbnRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5mdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHNlbGYpIHtcbnZhciBkb25lID0gZmFsc2U7XG50cnkge1xuZm4oZnVuY3Rpb24gKHZhbHVlKSB7XG5pZiAoZG9uZSkgcmV0dXJuO1xuZG9uZSA9IHRydWU7XG5yZXNvbHZlKHNlbGYsIHZhbHVlKTtcbn0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbmlmIChkb25lKSByZXR1cm47XG5kb25lID0gdHJ1ZTtcbnJlamVjdChzZWxmLCByZWFzb24pO1xufSk7XG59IGNhdGNoIChleCkge1xuaWYgKGRvbmUpIHJldHVybjtcbmRvbmUgPSB0cnVlO1xucmVqZWN0KHNlbGYsIGV4KTtcbn1cbn1cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbnJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG59O1xuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xudmFyIHByb20gPSBuZXcgKHRoaXMuY29uc3RydWN0b3IpKG5vb3ApO1xuXG5oYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb20pKTtcbnJldHVybiBwcm9tO1xufTtcblByb21pc2UuYWxsID0gZnVuY3Rpb24gKGFycikge1xudmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xucmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbmlmIChhcmdzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc29sdmUoW10pO1xudmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG5mdW5jdGlvbiByZXMoaSwgdmFsKSB7XG50cnkge1xuaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbnZhciB0aGVuID0gdmFsLnRoZW47XG5pZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbnRoZW4uY2FsbCh2YWwsIGZ1bmN0aW9uICh2YWwpIHtcbnJlcyhpLCB2YWwpO1xufSwgcmVqZWN0KTtcbnJldHVybjtcbn1cbn1cbmFyZ3NbaV0gPSB2YWw7XG5pZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbnJlc29sdmUoYXJncyk7XG59XG59IGNhdGNoIChleCkge1xucmVqZWN0KGV4KTtcbn1cbn1cblxuZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5yZXMoaSwgYXJnc1tpXSk7XG59XG59KTtcbn07XG5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbmlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG5yZXR1cm4gdmFsdWU7XG59XG5cbnJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xucmVzb2x2ZSh2YWx1ZSk7XG59KTtcbn07XG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xucmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbnJlamVjdCh2YWx1ZSk7XG59KTtcbn07XG5Qcm9taXNlLnJhY2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG5yZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xudmFsdWVzW2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbn1cbn0pO1xufTtcblByb21pc2UuX2ltbWVkaWF0ZUZuID0gKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiYgZnVuY3Rpb24gKGZuKSB7IHNldEltbWVkaWF0ZShmbik7IH0pIHx8XG5mdW5jdGlvbiAoZm4pIHtcbnNldFRpbWVvdXRGdW5jKGZuLCAwKTtcbn07XG5Qcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbiA9IGZ1bmN0aW9uIF91bmhhbmRsZWRSZWplY3Rpb25GbihlcnIpIHtcbmlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSkge1xuY29uc29sZS53YXJuKCdQb3NzaWJsZSBVbmhhbmRsZWQgUHJvbWlzZSBSZWplY3Rpb246JywgZXJyKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG59XG59O1xuUHJvbWlzZS5fc2V0SW1tZWRpYXRlRm4gPSBmdW5jdGlvbiBfc2V0SW1tZWRpYXRlRm4oZm4pIHtcblByb21pc2UuX2ltbWVkaWF0ZUZuID0gZm47XG59O1xuUHJvbWlzZS5fc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm4oZm4pIHtcblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZm47XG59O1xuY29uc29sZS5sb2coJ1Byb21pc2UgcG9seWZpbGwnKTtcbndpbmRvdy5Qcm9taXNlID0gUHJvbWlzZTtcbn1cbiIsIi8vIENsdWIgQUpBWCBHZW5lcmFsIFB1cnBvc2UgQ29kZVxuLy9cbi8vIFJhbmRvbWl6ZXJcbi8vXG4vLyBhdXRob3I6XG4vLyAgICAgICAgICAgICAgTWlrZSBXaWxjb3hcbi8vIHNpdGU6XG4vLyAgICAgICAgICAgICAgaHR0cDovL2NsdWJhamF4Lm9yZ1xuLy8gc3VwcG9ydDpcbi8vICAgICAgICAgICAgICBodHRwOi8vZ3JvdXBzLmdvb2dsZS5jb20vZ3JvdXAvY2x1YmFqYXhcbi8vXG4vLyBjbHViYWpheC5sYW5nLnJhbmRcbi8vXG4vLyAgICAgIERFU0NSSVBUSU9OOlxuLy8gICAgICAgICAgICAgIEEgcmFuZG9taXplciBsaWJyYXJ5IHRoYXQncyBncmVhdCBmb3IgcHJvZHVjaW5nIG1vY2sgZGF0YS5cbi8vICAgICAgICAgICAgICBBbGxvd3MgZG96ZW5zIG9mIHdheXMgdG8gcmFuZG9taXplIG51bWJlcnMsIHN0cmluZ3MsIHdvcmRzLFxuLy8gICAgICAgICAgICAgIHNlbnRlbmNlcywgYW5kIGRhdGVzLiBJbmNsdWRlcyB0aW55IGxpYnJhcmllcyBvZiB0aGUgbW9zdFxuLy8gICAgICAgICAgICAgIGNvbW1vbmx5IHVzZWQgd29yZHMgKGluIG9yZGVyKSwgdGhlIG1vc3QgY29tbW9ubHkgdXNlZCBsZXR0ZXJzXG4vLyAgICAgICAgICAgICAgKGluIG9yZGVyKSBhbmQgcGVyc29uYWwgbmFtZXMgdGhhdCBjYW4gYmUgdXNlZCBhcyBmaXJzdCBvciBsYXN0LlxuLy8gICAgICAgICAgICAgIEZvciBtYWtpbmcgc2VudGVuY2VzLCBcInd1cmRzXCIgYXJlIHVzZWQgLSB3b3JkcyB3aXRoIHNjcmFtYmxlZCB2b3dlbHNcbi8vICAgICAgICAgICAgICBzbyB0aGV5IGFyZW4ndCBhY3R1YWwgd29yZHMsIGJ1dCBsb29rIG1vcmUgbGlrZSBsb3JlbSBpcHN1bS4gQ2hhbmdlIHRoZVxuLy8gICAgICAgICAgICAgIHByb3BlcnR5IHJlYWwgdG8gdHJ1ZSB0byB1c2UgXCJ3b3Jkc1wiIGluc3RlYWQgb2YgXCJ3dXJkc1wiIChpdCBjYW5cbi8vICAgICAgICAgICAgICBhbHNvIHByb2R1Y2UgaHVtb3JvdXMgcmVzdWx0cykuXG5cbi8vICAgICAgVVNBR0U6XG4vLyAgICAgICAgICAgICAgaW5jbHVkZSBmaWxlOlxuLy8gICAgICAgICAgICAgICAgICAgICAgPHNjcmlwdCBzcmM9XCJjbHViYWpheC9sYW5nL3JhbmQuanNcIj48L3NjcmlwdD5cbi8vXG4vLyBURVNUUzpcbi8vICAgICAgICAgICAgICBTZWUgdGVzdHMvcmFuZC5odG1sXG4vL1xuLyogVU1ELmRlZmluZSAqLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCl7IGRlZmluZShbXSwgZmFjdG9yeSk7IH1lbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jyl7IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpOyB9ZWxzZXsgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpOyB3aW5kb3cucmFuZCA9IGZhY3RvcnkoKTsgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdFxuXHR2YXJcblx0XHRyYW5kLFxuXHRcdGNpdHlTdGF0ZXMgPSBbXCJOZXcgWW9yaywgTmV3IFlvcmtcIiwgXCJMb3MgQW5nZWxlcywgQ2FsaWZvcm5pYVwiLCBcIkNoaWNhZ28sIElsbGlub2lzXCIsIFwiSG91c3RvbiwgVGV4YXNcIiwgXCJQaGlsYWRlbHBoaWEsIFBlbm5zeWx2YW5pYVwiLCBcIlBob2VuaXgsIEFyaXpvbmFcIiwgXCJTYW4gRGllZ28sIENhbGlmb3JuaWFcIiwgXCJTYW4gQW50b25pbywgVGV4YXNcIiwgXCJEYWxsYXMsIFRleGFzXCIsIFwiRGV0cm9pdCwgTWljaGlnYW5cIiwgXCJTYW4gSm9zZSwgQ2FsaWZvcm5pYVwiLCBcIkluZGlhbmFwb2xpcywgSW5kaWFuYVwiLCBcIkphY2tzb252aWxsZSwgRmxvcmlkYVwiLCBcIlNhbiBGcmFuY2lzY28sIENhbGlmb3JuaWFcIiwgXCJDb2x1bWJ1cywgT2hpb1wiLCBcIkF1c3RpbiwgVGV4YXNcIiwgXCJNZW1waGlzLCBUZW5uZXNzZWVcIiwgXCJCYWx0aW1vcmUsIE1hcnlsYW5kXCIsIFwiQ2hhcmxvdHRlLCBOb3J0aCBDYXJvbGluYVwiLCBcIkZvcnQgV29ydGgsIFRleGFzXCIsIFwiQm9zdG9uLCBNYXNzYWNodXNldHRzXCIsIFwiTWlsd2F1a2VlLCBXaXNjb25zaW5cIiwgXCJFbCBQYXNvLCBUZXhhc1wiLCBcIldhc2hpbmd0b24sIERpc3RyaWN0IG9mIENvbHVtYmlhXCIsIFwiTmFzaHZpbGxlLURhdmlkc29uLCBUZW5uZXNzZWVcIiwgXCJTZWF0dGxlLCBXYXNoaW5ndG9uXCIsIFwiRGVudmVyLCBDb2xvcmFkb1wiLCBcIkxhcyBWZWdhcywgTmV2YWRhXCIsIFwiUG9ydGxhbmQsIE9yZWdvblwiLCBcIk9rbGFob21hIENpdHksIE9rbGFob21hXCIsIFwiVHVjc29uLCBBcml6b25hXCIsIFwiQWxidXF1ZXJxdWUsIE5ldyBNZXhpY29cIiwgXCJBdGxhbnRhLCBHZW9yZ2lhXCIsIFwiTG9uZyBCZWFjaCwgQ2FsaWZvcm5pYVwiLCBcIkthbnNhcyBDaXR5LCBNaXNzb3VyaVwiLCBcIkZyZXNubywgQ2FsaWZvcm5pYVwiLCBcIk5ldyBPcmxlYW5zLCBMb3Vpc2lhbmFcIiwgXCJDbGV2ZWxhbmQsIE9oaW9cIiwgXCJTYWNyYW1lbnRvLCBDYWxpZm9ybmlhXCIsIFwiTWVzYSwgQXJpem9uYVwiLCBcIlZpcmdpbmlhIEJlYWNoLCBWaXJnaW5pYVwiLCBcIk9tYWhhLCBOZWJyYXNrYVwiLCBcIkNvbG9yYWRvIFNwcmluZ3MsIENvbG9yYWRvXCIsIFwiT2FrbGFuZCwgQ2FsaWZvcm5pYVwiLCBcIk1pYW1pLCBGbG9yaWRhXCIsIFwiVHVsc2EsIE9rbGFob21hXCIsIFwiTWlubmVhcG9saXMsIE1pbm5lc290YVwiLCBcIkhvbm9sdWx1LCBIYXdhaWlcIiwgXCJBcmxpbmd0b24sIFRleGFzXCIsIFwiV2ljaGl0YSwgS2Fuc2FzXCIsIFwiU3QuIExvdWlzLCBNaXNzb3VyaVwiLCBcIlJhbGVpZ2gsIE5vcnRoIENhcm9saW5hXCIsIFwiU2FudGEgQW5hLCBDYWxpZm9ybmlhXCIsIFwiQ2luY2lubmF0aSwgT2hpb1wiLCBcIkFuYWhlaW0sIENhbGlmb3JuaWFcIiwgXCJUYW1wYSwgRmxvcmlkYVwiLCBcIlRvbGVkbywgT2hpb1wiLCBcIlBpdHRzYnVyZ2gsIFBlbm5zeWx2YW5pYVwiLCBcIkF1cm9yYSwgQ29sb3JhZG9cIiwgXCJCYWtlcnNmaWVsZCwgQ2FsaWZvcm5pYVwiLCBcIlJpdmVyc2lkZSwgQ2FsaWZvcm5pYVwiLCBcIlN0b2NrdG9uLCBDYWxpZm9ybmlhXCIsIFwiQ29ycHVzIENocmlzdGksIFRleGFzXCIsIFwiTGV4aW5ndG9uLUZheWV0dGUsIEtlbnR1Y2t5XCIsIFwiQnVmZmFsbywgTmV3IFlvcmtcIiwgXCJTdC4gUGF1bCwgTWlubmVzb3RhXCIsIFwiQW5jaG9yYWdlLCBBbGFza2FcIiwgXCJOZXdhcmssIE5ldyBKZXJzZXlcIiwgXCJQbGFubywgVGV4YXNcIiwgXCJGb3J0IFdheW5lLCBJbmRpYW5hXCIsIFwiU3QuIFBldGVyc2J1cmcsIEZsb3JpZGFcIiwgXCJHbGVuZGFsZSwgQXJpem9uYVwiLCBcIkxpbmNvbG4sIE5lYnJhc2thXCIsIFwiTm9yZm9saywgVmlyZ2luaWFcIiwgXCJKZXJzZXkgQ2l0eSwgTmV3IEplcnNleVwiLCBcIkdyZWVuc2Jvcm8sIE5vcnRoIENhcm9saW5hXCIsIFwiQ2hhbmRsZXIsIEFyaXpvbmFcIiwgXCJCaXJtaW5naGFtLCBBbGFiYW1hXCIsIFwiSGVuZGVyc29uLCBOZXZhZGFcIiwgXCJTY290dHNkYWxlLCBBcml6b25hXCIsIFwiTm9ydGggSGVtcHN0ZWFkLCBOZXcgWW9ya1wiLCBcIk1hZGlzb24sIFdpc2NvbnNpblwiLCBcIkhpYWxlYWgsIEZsb3JpZGFcIiwgXCJCYXRvbiBSb3VnZSwgTG91aXNpYW5hXCIsIFwiQ2hlc2FwZWFrZSwgVmlyZ2luaWFcIiwgXCJPcmxhbmRvLCBGbG9yaWRhXCIsIFwiTHViYm9jaywgVGV4YXNcIiwgXCJHYXJsYW5kLCBUZXhhc1wiLCBcIkFrcm9uLCBPaGlvXCIsIFwiUm9jaGVzdGVyLCBOZXcgWW9ya1wiLCBcIkNodWxhIFZpc3RhLCBDYWxpZm9ybmlhXCIsIFwiUmVubywgTmV2YWRhXCIsIFwiTGFyZWRvLCBUZXhhc1wiLCBcIkR1cmhhbSwgTm9ydGggQ2Fyb2xpbmFcIiwgXCJNb2Rlc3RvLCBDYWxpZm9ybmlhXCIsIFwiSHVudGluZ3RvbiwgTmV3IFlvcmtcIiwgXCJNb250Z29tZXJ5LCBBbGFiYW1hXCIsIFwiQm9pc2UsIElkYWhvXCIsIFwiQXJsaW5ndG9uLCBWaXJnaW5pYVwiLCBcIlNhbiBCZXJuYXJkaW5vLCBDYWxpZm9ybmlhXCJdLFxuXHRcdHN0cmVldFN1ZmZpeGVzID0gJ1JvYWQsRHJpdmUsQXZlbnVlLEJsdmQsTGFuZSxTdHJlZXQsV2F5LENpcmNsZScuc3BsaXQoJywnKSxcblx0XHRzdHJlZXRzID0gXCJGaXJzdCxGb3VydGgsUGFyayxGaWZ0aCxNYWluLFNpeHRoLE9hayxTZXZlbnRoLFBpbmUsTWFwbGUsQ2VkYXIsRWlnaHRoLEVsbSxWaWV3LFdhc2hpbmd0b24sTmludGgsTGFrZSxIaWxsLEhpZ2gsU3RhdGlvbixNYWluLFBhcmssQ2h1cmNoLENodXJjaCxMb25kb24sVmljdG9yaWEsR3JlZW4sTWFub3IsQ2h1cmNoLFBhcmssVGhlIENyZXNjZW50LFF1ZWVucyxOZXcsR3JhbmdlLEtpbmdzLEtpbmdzd2F5LFdpbmRzb3IsSGlnaGZpZWxkLE1pbGwsQWxleGFuZGVyLFlvcmssU3QuIEpvaG5cXCdzLE1haW4sQnJvYWR3YXksS2luZyxUaGUgR3JlZW4sU3ByaW5nZmllbGQsR2VvcmdlLFBhcmssVmljdG9yaWEsQWxiZXJ0LFF1ZWVuc3dheSxOZXcsUXVlZW4sV2VzdCxOb3J0aCxNYW5jaGVzdGVyLFRoZSBHcm92ZSxSaWNobW9uZCxHcm92ZSxTb3V0aCxTY2hvb2wsTm9ydGgsU3RhbmxleSxDaGVzdGVyLE1pbGwsXCIuc3BsaXQoJywnKSxcblx0XHRzdGF0ZXMgPSBbXCJBbGFiYW1hXCIsIFwiQWxhc2thXCIsIFwiQW1lcmljYW4gU2Ftb2FcIiwgXCJBcml6b25hXCIsIFwiQXJrYW5zYXNcIiwgXCJBcm1lZCBGb3JjZXMgRXVyb3BlXCIsIFwiQXJtZWQgRm9yY2VzIFBhY2lmaWNcIiwgXCJBcm1lZCBGb3JjZXMgdGhlIEFtZXJpY2FzXCIsIFwiQ2FsaWZvcm5pYVwiLCBcIkNvbG9yYWRvXCIsIFwiQ29ubmVjdGljdXRcIiwgXCJEZWxhd2FyZVwiLCBcIkRpc3RyaWN0IG9mIENvbHVtYmlhXCIsIFwiRmVkZXJhdGVkIFN0YXRlcyBvZiBNaWNyb25lc2lhXCIsIFwiRmxvcmlkYVwiLCBcIkdlb3JnaWFcIiwgXCJHdWFtXCIsIFwiSGF3YWlpXCIsIFwiSWRhaG9cIiwgXCJJbGxpbm9pc1wiLCBcIkluZGlhbmFcIiwgXCJJb3dhXCIsIFwiS2Fuc2FzXCIsIFwiS2VudHVja3lcIiwgXCJMb3Vpc2lhbmFcIiwgXCJNYWluZVwiLCBcIk1hcnNoYWxsIElzbGFuZHNcIiwgXCJNYXJ5bGFuZFwiLCBcIk1hc3NhY2h1c2V0dHNcIiwgXCJNaWNoaWdhblwiLCBcIk1pbm5lc290YVwiLCBcIk1pc3Npc3NpcHBpXCIsIFwiTWlzc291cmlcIiwgXCJNb250YW5hXCIsIFwiTmVicmFza2FcIiwgXCJOZXZhZGFcIiwgXCJOZXcgSGFtcHNoaXJlXCIsIFwiTmV3IEplcnNleVwiLCBcIk5ldyBNZXhpY29cIiwgXCJOZXcgWW9ya1wiLCBcIk5vcnRoIENhcm9saW5hXCIsIFwiTm9ydGggRGFrb3RhXCIsIFwiTm9ydGhlcm4gTWFyaWFuYSBJc2xhbmRzXCIsIFwiT2hpb1wiLCBcIk9rbGFob21hXCIsIFwiT3JlZ29uXCIsIFwiUGVubnN5bHZhbmlhXCIsIFwiUHVlcnRvIFJpY29cIiwgXCJSaG9kZSBJc2xhbmRcIiwgXCJTb3V0aCBDYXJvbGluYVwiLCBcIlNvdXRoIERha290YVwiLCBcIlRlbm5lc3NlZVwiLCBcIlRleGFzXCIsIFwiVXRhaFwiLCBcIlZlcm1vbnRcIiwgXCJWaXJnaW4gSXNsYW5kcywgVS5TLlwiLCBcIlZpcmdpbmlhXCIsIFwiV2FzaGluZ3RvblwiLCBcIldlc3QgVmlyZ2luaWFcIiwgXCJXaXNjb25zaW5cIiwgXCJXeW9taW5nXCJdLFxuXHRcdHN0YXRlQWJiciA9IFtcIkFMXCIsIFwiQUtcIiwgXCJBU1wiLCBcIkFaXCIsIFwiQVJcIiwgXCJBRVwiLCBcIkFQXCIsIFwiQUFcIiwgXCJDQVwiLCBcIkNPXCIsIFwiQ1RcIiwgXCJERVwiLCBcIkRDXCIsIFwiRk1cIiwgXCJGTFwiLCBcIkdBXCIsIFwiR1VcIiwgXCJISVwiLCBcIklEXCIsIFwiSUxcIiwgXCJJTlwiLCBcIklBXCIsIFwiS1NcIiwgXCJLWVwiLCBcIkxBXCIsIFwiTUVcIiwgXCJNSFwiLCBcIk1EXCIsIFwiTUFcIiwgXCJNSVwiLCBcIk1OXCIsIFwiTVNcIiwgXCJNT1wiLCBcIk1UXCIsIFwiTkVcIiwgXCJOVlwiLCBcIk5IXCIsIFwiTkpcIiwgXCJOTVwiLCBcIk5ZXCIsIFwiTkNcIiwgXCJORFwiLCBcIk1QXCIsIFwiT0hcIiwgXCJPS1wiLCBcIk9SXCIsIFwiUEFcIiwgXCJQUlwiLCBcIlJJXCIsIFwiU0NcIiwgXCJTRFwiLCBcIlROXCIsIFwiVFhcIiwgXCJVVFwiLCBcIlZUXCIsIFwiVklcIiwgXCJWQVwiLCBcIldBXCIsIFwiV1ZcIiwgXCJXSVwiLCBcIldZXCJdLFxuXHRcdG5hbWVzID0gXCJBYnJhaGFtLEFsYmVydCxBbGV4aXMsQWxsZW4sQWxsaXNvbixBbGV4YW5kZXIsQW1vcyxBbnRvbixBcm5vbGQsQXJ0aHVyLEFzaGxleSxCYXJyeSxCZWxpbmRhLEJlbGxlLEJlbmphbWluLEJlbm55LEJlcm5hcmQsQnJhZGxleSxCcmV0dCxUeSxCcml0dGFueSxCcnVjZSxCcnlhbnQsQ2FycmV5LENhcm1lbixDYXJyb2xsLENoYXJsZXMsQ2hyaXN0b3BoZXIsQ2hyaXN0aWUsQ2xhcmssQ2xheSxDbGlmZixDb25yYWQsQ3JhaWcsQ3J5c3RhbCxDdXJ0aXMsRGFtb24sRGFuYSxEYXZpZCxEZWFuLERlZSxEZW5uaXMsRGVubnksRGljayxEb3VnbGFzLER1bmNhbixEd2lnaHQsRHlsYW4sRWRkeSxFbGxpb3QsRXZlcmV0dCxGYXllLEZyYW5jaXMsRnJhbmssRnJhbmtsaW4sR2FydGgsR2F5bGUsR2VvcmdlLEdpbGJlcnQsR2xlbm4sR29yZG9uLEdyYWNlLEdyYWhhbSxHcmFudCxHcmVnb3J5LEdvdHRmcmllZCxHdXksSGFycmlzb24sSGFycnksSGFydmV5LEhlbnJ5LEhlcmJlcnQsSGlsbGFyeSxIb2xseSxIb3BlLEhvd2FyZCxIdWdvLEh1bXBocmV5LElydmluZyxJc2FhayxKYW5pcyxKYXksSm9lbCxKb2huLEpvcmRhbixKb3ljZSxKdWFuLEp1ZGQsSnVsaWEsS2F5ZSxLZWxseSxLZWl0aCxMYXVyaWUsTGF3cmVuY2UsTGVlLExlaWdoLExlb25hcmQsTGVzbGllLExlc3RlcixMZXdpcyxMaWxseSxMbG95ZCxHZW9yZ2UsTG91aXMsTG91aXNlLEx1Y2FzLEx1dGhlcixMeW5uLE1hY2ssTWFyaWUsTWFyc2hhbGwsTWFydGluLE1hcnZpbixNYXksTWljaGFlbCxNaWNoZWxsZSxNaWx0b24sTWlyYW5kYSxNaXRjaGVsbCxNb3JnYW4sTW9ycmlzLE11cnJheSxOZXd0b24sTm9ybWFuLE93ZW4sUGF0cmljayxQYXR0aSxQYXVsLFBlbm55LFBlcnJ5LFByZXN0b24sUXVpbm4sUmF5LFJpY2gsUmljaGFyZCxSb2xhbmQsUm9zZSxSb3NzLFJveSxSdWJ5LFJ1c3NlbGwsUnV0aCxSeWFuLFNjb3R0LFNleW1vdXIsU2hhbm5vbixTaGF3bixTaGVsbGV5LFNoZXJtYW4sU2ltb24sU3RhbmxleSxTdGV3YXJ0LFN1c2FubixTeWRuZXksVGF5bG9yLFRob21hcyxUb2RkLFRvbSxUcmFjeSxUcmF2aXMsVHlsZXIsVHlsZXIsVmluY2VudCxXYWxsYWNlLFdhbHRlcixQZW5uLFdheW5lLFdpbGwsV2lsbGFyZCxXaWxsaXNcIixcblx0XHR3b3JkcyA9IFwidGhlLG9mLGFuZCxhLHRvLGluLGlzLHlvdSx0aGF0LGl0LGhlLGZvcix3YXMsb24sYXJlLGFzLHdpdGgsaGlzLHRoZXksYXQsYmUsdGhpcyxmcm9tLEksaGF2ZSxvcixieSxvbmUsaGFkLG5vdCxidXQsd2hhdCxhbGwsd2VyZSx3aGVuLHdlLHRoZXJlLGNhbixhbix5b3VyLHdoaWNoLHRoZWlyLHNhaWQsaWYsZG8sd2lsbCxlYWNoLGFib3V0LGhvdyx1cCxvdXQsdGhlbSx0aGVuLHNoZSxtYW55LHNvbWUsc28sdGhlc2Usd291bGQsb3RoZXIsaW50byxoYXMsbW9yZSxoZXIsdHdvLGxpa2UsaGltLHNlZSx0aW1lLGNvdWxkLG5vLG1ha2UsdGhhbixmaXJzdCxiZWVuLGl0cyx3aG8sbm93LHBlb3BsZSxteSxtYWRlLG92ZXIsZGlkLGRvd24sb25seSx3YXksZmluZCx1c2UsbWF5LHdhdGVyLGxvbmcsbGl0dGxlLHZlcnksYWZ0ZXIsd29yZHMsY2FsbGVkLGp1c3Qsd2hlcmUsbW9zdCxrbm93LGdldCx0aHJvdWdoLGJhY2ssbXVjaCxiZWZvcmUsZ28sZ29vZCxuZXcsd3JpdGUsb3V0LHVzZWQsbWUsbWFuLHRvbyxhbnksZGF5LHNhbWUscmlnaHQsbG9vayx0aGluayxhbHNvLGFyb3VuZCxhbm90aGVyLGNhbWUsY29tZSx3b3JrLHRocmVlLHdvcmQsbXVzdCxiZWNhdXNlLGRvZXMscGFydCxldmVuLHBsYWNlLHdlbGwsc3VjaCxoZXJlLHRha2Usd2h5LHRoaW5ncyxoZWxwLHB1dCx5ZWFycyxkaWZmZXJlbnQsYXdheSxhZ2FpbixvZmYsd2VudCxvbGQsbnVtYmVyLGdyZWF0LHRlbGwsbWVuLHNheSxzbWFsbCxldmVyeSxmb3VuZCxzdGlsbCxiZXR3ZWVuLG5hbWUsc2hvdWxkLGhvbWUsYmlnLGdpdmUsYWlyLGxpbmUsc2V0LG93bix1bmRlcixyZWFkLGxhc3QsbmV2ZXIsdXMsbGVmdCxlbmQsYWxvbmcsd2hpbGUsbWlnaHQsbmV4dCxzb3VuZCxiZWxvdyxzYXcsc29tZXRoaW5nLHRob3VnaHQsYm90aCxmZXcsdGhvc2UsYWx3YXlzLGxvb2tlZCxzaG93LGxhcmdlLG9mdGVuLHRvZ2V0aGVyLGFza2VkLGhvdXNlLGRvbid0LHdvcmxkLGdvaW5nLHdhbnQsc2Nob29sLGltcG9ydGFudCx1bnRpbCxmb3JtLGZvb2Qsa2VlcCxjaGlsZHJlbixmZWV0LGxhbmQsc2lkZSx3aXRob3V0LGJveSxvbmNlLGFuaW1hbHMsbGlmZSxlbm91Z2gsdG9vayxzb21ldGltZXMsZm91cixoZWFkLGFib3ZlLGtpbmQsYmVnYW4sYWxtb3N0LGxpdmUscGFnZSxnb3QsZWFydGgsbmVlZCxmYXIsaGFuZCxoaWdoLHllYXIsbW90aGVyLGxpZ2h0LHBhcnRzLGNvdW50cnksZmF0aGVyLGxldCxuaWdodCxmb2xsb3dpbmcscGljdHVyZSxiZWluZyxzdHVkeSxzZWNvbmQsZXllcyxzb29uLHRpbWVzLHN0b3J5LGJveXMsc2luY2Usd2hpdGUsZGF5cyxldmVyLHBhcGVyLGhhcmQsbmVhcixzZW50ZW5jZSxiZXR0ZXIsYmVzdCxhY3Jvc3MsZHVyaW5nLHRvZGF5LG90aGVycyxob3dldmVyLHN1cmUsbWVhbnMsa25ldyxpdHMsdHJ5LHRvbGQseW91bmcsbWlsZXMsc3VuLHdheXMsdGhpbmcsd2hvbGUsaGVhcixleGFtcGxlLGhlYXJkLHNldmVyYWwsY2hhbmdlLGFuc3dlcixyb29tLHNlYSxhZ2FpbnN0LHRvcCx0dXJuZWQsbGVhcm4scG9pbnQsY2l0eSxwbGF5LHRvd2FyZCxmaXZlLHVzaW5nLGhpbXNlbGYsdXN1YWxseVwiLFxuXHRcdGxldHRlcnMgPSAoXCJldGFvbmlzcmhsZGNtdWZwZ3d5YnZranhxelwiKS5zcGxpdChcIlwiKSxcblx0XHRzaXRlcyA9IFwiR29vZ2xlLEZhY2Vib29rLFlvdVR1YmUsWWFob28sTGl2ZSxCaW5nLFdpa2lwZWRpYSxCbG9nZ2VyLE1TTixUd2l0dGVyLFdvcmRwcmVzcyxNeVNwYWNlLE1pY3Jvc29mdCxBbWF6b24sZUJheSxMaW5rZWRJbixmbGlja3IsQ3JhaWdzbGlzdCxSYXBpZHNoYXJlLENvbmR1aXQsSU1EQixCQkMsR28sQU9MLERvdWJsZWNsaWNrLEFwcGxlLEJsb2dzcG90LE9ya3V0LFBob3RvYnVja2V0LEFzayxDTk4sQWRvYmUsQWJvdXQsbWVkaWFmaXJlLENORVQsRVNQTixJbWFnZVNoYWNrLExpdmVKb3VybmFsLE1lZ2F1cGxvYWQsTWVnYXZpZGVvLEhvdGZpbGUsUGF5UGFsLE5ZVGltZXMsR2xvYm8sQWxpYmFiYSxHb0RhZGR5LERldmlhbnRBcnQsUmVkaWZmLERhaWx5TW90aW9uLERpZ2csV2VhdGhlcixuaW5nLFBhcnR5UG9rZXIsZUhvdyxEb3dubG9hZCxBbnN3ZXJzLFR3aXRQaWMsTmV0ZmxpeCxUaW55cGljLFNvdXJjZWZvcmdlLEh1bHUsQ29tY2FzdCxBcmNoaXZlLERlbGwsU3R1bWJsZXVwb24sSFAsRm94TmV3cyxNZXRhY2FmZSxWaW1lbyxTa3lwZSxDaGFzZSxSZXV0ZXJzLFdTSixZZWxwLFJlZGRpdCxHZW9jaXRpZXMsVVNQUyxVUFMsVXBsb2FkLFRlY2hDcnVuY2gsUG9nbyxQYW5kb3JhLExBVGltZXMsVVNBVG9kYXksSUJNLEFsdGFWaXN0YSxNYXRjaCxNb25zdGVyLEpvdFNwb3QsQmV0dGVyVmlkZW8sQ2x1YkFKQVgsTmV4cGxvcmUsS2F5YWssU2xhc2hkb3RcIjtcblx0XG5cdHJhbmQgPSB7XG5cdFx0cmVhbDpmYWxzZSxcblx0XHR3b3Jkczp3b3Jkcy5zcGxpdChcIixcIiksXG5cdFx0d3VyZHM6W10sXG5cdFx0bmFtZXM6bmFtZXMuc3BsaXQoXCIsXCIpLFxuXHRcdGxldHRlcnM6bGV0dGVycyxcblx0XHRzaXRlczpzaXRlcy5zcGxpdChcIixcIiksXG5cblx0XHR0b0FycmF5OiBmdW5jdGlvbih0aGluZyl7XG5cdFx0XHR2YXJcblx0XHRcdFx0bm0sIGksXG5cdFx0XHRcdGEgPSBbXTtcblxuXHRcdFx0aWYodHlwZW9mKHRoaW5nKSA9PT0gXCJvYmplY3RcIiAmJiAhKCEhdGhpbmcucHVzaCB8fCAhIXRoaW5nLml0ZW0pKXtcblx0XHRcdFx0Zm9yKG5tIGluIHRoaW5nKXsgaWYodGhpbmcuaGFzT3duUHJvcGVydHkobm0pKXthLnB1c2godGhpbmdbbm1dKTt9IH1cblx0XHRcdFx0dGhpbmcgPSBhO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0eXBlb2YodGhpbmcpID09PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0aWYoL1xcLi8udGVzdCh0aGluZykpe1xuXHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRcdHRoaW5nLnBvcCgpO1xuXHRcdFx0XHRcdGkgPSB0aGluZy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0XHRcdHRoaW5nW2ldID0gdGhpcy50cmltKHRoaW5nW2ldKSArIFwiLlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2UgaWYoLywvLnRlc3QodGhpbmcpKXtcblx0XHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZigvXFxzLy50ZXN0KHRoaW5nKSl7XG5cdFx0XHRcdFx0XHR0aGluZyA9IHRoaW5nLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR0aGluZyA9IHRoaW5nLnNwbGl0KFwiXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpbmc7IC8vQXJyYXlcblx0XHR9LFxuXG5cdFx0dHJpbTogZnVuY3Rpb24ocyl7IC8vIHRoYW5rcyB0byBEb2pvOlxuXHRcdFx0cmV0dXJuIFN0cmluZy5wcm90b3R5cGUudHJpbSA/IHMudHJpbSgpIDpcblx0XHRcdHMucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG5cdFx0fSxcblxuXHRcdHBhZDogZnVuY3Rpb24obiwgYW10LCBjaHIpe1xuXHRcdFx0XHR2YXIgYyA9IGNociB8fCBcIjBcIjsgYW10ID0gYW10IHx8IDI7XG5cdFx0XHRcdHJldHVybiAoYytjK2MrYytjK2MrYytjK2MrYytuKS5zbGljZSgtYW10KTtcblx0XHR9LFxuXG5cdFx0Y2FwOiBmdW5jdGlvbih3KXtcblx0XHRcdHJldHVybiB3LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdy5zdWJzdHJpbmcoMSk7XG5cdFx0fSxcblxuXHRcdHdlaWdodDogZnVuY3Rpb24obiwgZXhwKXtcblx0XHRcdHZhclxuXHRcdFx0XHRyZXMsXG5cdFx0XHRcdHJldiA9IGV4cCA8IDA7XG5cdFx0XHRleHAgPSBleHA9PT11bmRlZmluZWQgPyAxIDogTWF0aC5hYnMoZXhwKSsxO1xuXHRcdFx0cmVzID0gTWF0aC5wb3cobiwgZXhwKTtcblx0XHRcdHJldHVybiByZXYgPyAxIC0gcmVzIDogcmVzO1xuXHRcdH0sXG5cblx0XHRuOiBmdW5jdGlvbihuLCB3KXtcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKChuIHx8IDEwKSAqIHRoaXMud2VpZ2h0KE1hdGgucmFuZG9tKCksIHcpKTtcblx0XHR9LFxuXG5cdFx0cmFuZ2U6IGZ1bmN0aW9uKG1pbiwgbWF4LCB3KXtcblx0XHRcdG1heCA9IG1heCB8fCAwO1xuXHRcdFx0cmV0dXJuIHRoaXMubihNYXRoLmFicyhtYXgtbWluKSsxLCB3KSArIChtaW48bWF4P21pbjptYXgpO1xuXHRcdH0sXG5cblx0XHRlbGVtZW50OiBmdW5jdGlvbih0aGluZywgdyl7XG5cdFx0XHQvLyByZXR1cm4gcmFuZCBzbG90LCBjaGFyLCBwcm9wIG9yIHJhbmdlXG5cdFx0XHRpZih0eXBlb2YodGhpbmcpID09PSBcIm51bWJlclwiKXsgcmV0dXJuIHRoaXMubih0aGluZywgdyk7IH1cblx0XHRcdHRoaW5nID0gdGhpcy50b0FycmF5KHRoaW5nKTtcblx0XHRcdHJldHVybiB0aGluZ1t0aGlzLm4odGhpbmcubGVuZ3RoLCB3KV07XG5cdFx0fSxcblxuXHRcdHNjcmFtYmxlOiBmdW5jdGlvbihhcnkpe1xuXHRcdFx0dmFyXG5cdFx0XHRcdGEgPSBhcnkuY29uY2F0KFtdKSxcblx0XHRcdFx0c2QgPSBbXSxcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZShpLS0pe1xuXHRcdFx0XHRcdHNkLnB1c2goYS5zcGxpY2UodGhpcy5uKGEubGVuZ3RoKSwgMSlbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRyZXR1cm4gc2Q7XG5cdFx0fSxcblxuXHRcdGJpZ251bWJlcjogZnVuY3Rpb24obGVuKXtcblx0XHRcdHZhciB0PVwiXCI7XG5cdFx0XHR3aGlsZShsZW4tLSl7XG5cdFx0XHRcdFx0dCArPSB0aGlzLm4oOSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9LFxuXG5cdFx0ZGF0ZTogZnVuY3Rpb24obyl7XG5cdFx0XHRvID0gbyB8fCB7fTtcblx0XHRcdHZhclxuXHRcdFx0XHRkLFxuXHRcdFx0XHRkMSA9IG5ldyBEYXRlKG8ubWluIHx8IG5ldyBEYXRlKCkpLFxuXHRcdFx0XHRkMiA9IG5ldyBEYXRlKG8ubWF4IHx8IG5ldyBEYXRlKCkuc2V0RnVsbFllYXIoZDEuZ2V0RnVsbFllYXIoKSsoby55ZWFyUmFuZ2V8fDEpKSkuZ2V0VGltZSgpO1xuXHRcdFx0ZDEgPSBkMS5nZXRUaW1lKCk7XG5cdFx0XHRkID0gbmV3IERhdGUodGhpcy5yYW5nZShkMSxkMixvLndlaWdodCkpO1xuXHRcdFx0aWYoby5zZWNvbmRzKXtcblx0XHRcdFx0cmV0dXJuIGQuZ2V0VGltZSgpO1xuXHRcdFx0fWVsc2UgaWYoby5kZWxpbWl0ZXIpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYWQoZC5nZXRNb250aCgpKzEpK28uZGVsaW1pdGVyK3RoaXMucGFkKGQuZ2V0RGF0ZSgpKzEpK28uZGVsaW1pdGVyKyhkLmdldEZ1bGxZZWFyKCkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGQ7XG5cdFx0fSxcblxuXHRcdGJvb2w6IGZ1bmN0aW9uKHcpe1xuXHRcdFx0cmV0dXJuIHRoaXMubigyLCB3KSA8IDE7XG5cdFx0fSxcblxuXHRcdGNvbG9yOiBmdW5jdGlvbih3KXtcblx0XHRcdHJldHVybiBcIiNcIit0aGlzLnBhZCh0aGlzLm4oMjU1LCB3KS50b1N0cmluZygxNikpK3RoaXMucGFkKHRoaXMubigyNTUsIHcpLnRvU3RyaW5nKDE2KSkrdGhpcy5wYWQodGhpcy5uKDI1NSwgdykudG9TdHJpbmcoMTYpKTtcblx0XHR9LFxuXG5cdFx0Y2hhcnM6ZnVuY3Rpb24obWluLCBtYXgsIHcpe1xuXHRcdFx0dmFyIHMgPSBcIlwiLFxuXHRcdFx0aSA9IHRoaXMucmFuZ2UobWluLCBtYXgsIHcpO1xuXHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0cyArPSB0aGlzLmxldHRlcnNbdGhpcy5uKHRoaXMubGV0dGVycy5sZW5ndGgpXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzO1xuXHRcdH0sXG5cblx0XHRuYW1lOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gdGhpcy5uYW1lc1t0aGlzLm4odGhpcy5uYW1lcy5sZW5ndGgpXTtcblx0XHRcdHJldHVybiAhY3NlID8gcyA6IGNzZSA9PT0gMSA/IHMudG9Mb3dlckNhc2UoKSA6IHMudG9VcHBlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0Y2l0eVN0YXRlOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGNpdHlTdGF0ZXNbdGhpcy5uKGNpdHlTdGF0ZXMubGVuZ3RoKV07XG5cdFx0fSxcblxuXHRcdHN0YXRlOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gc3RhdGVzW3RoaXMubihzdGF0ZXMubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdHN0YXRlQ29kZTogZnVuY3Rpb24oY3NlKXtcblx0XHRcdGNzZSA9IGNzZSA9PT0gdW5kZWZpbmVkID8gMiA6IGNzZTtcblx0XHRcdC8vIGNzZTogMCB0aXRsZSBjYXNlLCAxIGxvd2VyY2FzZSwgMiB1cHBlciBjYXNlXG5cdFx0XHR2YXIgcyA9IHN0YXRlQWJiclt0aGlzLm4oc3RhdGVBYmJyLmxlbmd0aCldO1xuXHRcdFx0cmV0dXJuICFjc2UgPyBzIDogY3NlID09PSAxID8gcy50b0xvd2VyQ2FzZSgpIDogcy50b1VwcGVyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHRzdHJlZXQ6IGZ1bmN0aW9uKG5vU3VmZml4KXtcblx0XHRcdHZhciBzID0gc3RyZWV0c1t0aGlzLm4oc3RyZWV0cy5sZW5ndGgpXTtcblx0XHRcdGlmKCFub1N1ZmZpeCl7XG5cdFx0XHRcdHMrPSAnICcgKyBzdHJlZXRTdWZmaXhlc1t0aGlzLm4oc3RyZWV0U3VmZml4ZXMubGVuZ3RoKV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcztcblx0XHR9LFxuXG5cdFx0c2l0ZTogZnVuY3Rpb24oY3NlKXtcblx0XHRcdC8vIGNzZTogMCB0aXRsZSBjYXNlLCAxIGxvd2VyY2FzZSwgMiB1cHBlciBjYXNlXG5cdFx0XHR2YXIgcyA9IHRoaXMuc2l0ZXNbdGhpcy5uKHRoaXMuc2l0ZXMubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdHVybDogZnVuY3Rpb24odXNld3d3LCB4dCl7XG5cdFx0XHR2YXIgdyA9IHVzZXd3dyA/IFwid3d3LlwiIDogXCJcIjtcblx0XHRcdHh0ID0geHQgfHwgXCIuY29tXCI7XG5cdFx0XHRyZXR1cm4gXCJodHRwOi8vXCIgKyB3ICsgdGhpcy5zaXRlKDEpICsgeHQ7XG5cdFx0fSxcblxuXHRcdHdvcmQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgdyA9IHRoaXMucmVhbCA/IHRoaXMud29yZHMgOiB0aGlzLnd1cmRzO1xuXHRcdFx0cmV0dXJuIHdbdGhpcy5uKHcubGVuZ3RoKV07XG5cdFx0fSxcblxuXHRcdHNlbnRlbmNlczogZnVuY3Rpb24obWluQW10LCBtYXhBbXQsIG1pbkxlbiwgbWF4TGVuKXtcblx0XHRcdC8vIGFtdDogc2VudGVuY2VzLCBsZW46IHdvcmRzXG5cdFx0XHRtaW5BbXQgPSBtaW5BbXQgfHwgMTtcblx0XHRcdG1heEFtdCA9IG1heEFtdCB8fCBtaW5BbXQ7XG5cdFx0XHRtaW5MZW4gPSBtaW5MZW4gfHwgNTtcblx0XHRcdG1heExlbiA9IG1heExlbiB8fCBtaW5MZW47XG5cblx0XHRcdHZhclxuXHRcdFx0XHRpaSxcblx0XHRcdFx0cyA9IFtdLFxuXHRcdFx0XHR0ID0gXCJcIixcblx0XHRcdFx0dyA9IHRoaXMucmVhbCA/IHRoaXMud29yZHMgOiB0aGlzLnd1cmRzLFxuXHRcdFx0XHRpID0gdGhpcy5yYW5nZShtaW5BbXQsIG1heEFtdCk7XG5cblx0XHRcdHdoaWxlKGktLSl7XG5cblx0XHRcdFx0aWkgPSB0aGlzLnJhbmdlKG1pbkxlbiwgbWF4TGVuKTsgd2hpbGUoaWktLSl7XG5cdFx0XHRcdFx0cy5wdXNoKHdbdGhpcy5uKHcubGVuZ3RoKV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQgKz0gdGhpcy5jYXAocy5qb2luKFwiIFwiKSkgK1wiLiBcIjtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0O1xuXHRcdH0sXG5cblx0XHR0aXRsZTogZnVuY3Rpb24obWluLCBtYXgpe1xuXHRcdFx0bWluID0gbWluIHx8IDE7IG1heCA9IG1heCB8fCBtaW47XG5cdFx0XHR2YXJcblx0XHRcdFx0YSA9IFtdLFxuXHRcdFx0XHR3ID0gdGhpcy5yZWFsID8gdGhpcy53b3JkcyA6IHRoaXMud3VyZHMsXG5cdFx0XHRcdGkgPSB0aGlzLnJhbmdlKG1pbiwgbWF4KTtcblx0XHRcdHdoaWxlKGktLSl7XG5cdFx0XHRcdGEucHVzaCh0aGlzLmNhcCh3W3RoaXMubih3Lmxlbmd0aCldKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYS5qb2luKFwiIFwiKTtcblx0XHR9LFxuXHRcdGRhdGE6IGZ1bmN0aW9uKGFtdCl7XG5cdFx0XHR2YXJcblx0XHRcdFx0c3QsXG5cdFx0XHRcdGl0ZW1zID0gW10sXG5cdFx0XHRcdGl0ZW0sXG5cdFx0XHRcdGk7XG5cdFx0XHRmb3IoaSA9IDA7IGkgPCBhbXQ7IGkrKyl7XG5cdFx0XHRcdGl0ZW0gPSB7XG5cdFx0XHRcdFx0Zmlyc3ROYW1lOiB0aGlzLm5hbWUoKSxcblx0XHRcdFx0XHRsYXN0TmFtZTogdGhpcy5uYW1lKCksXG5cdFx0XHRcdFx0Y29tcGFueTogdGhpcy5zaXRlKCksXG5cdFx0XHRcdFx0YWRkcmVzczE6IHRoaXMuYmlnbnVtYmVyKHRoaXMucmFuZ2UoMywgNSkpLFxuXHRcdFx0XHRcdGFkZHJlc3MyOiB0aGlzLnN0cmVldCgpLFxuXHRcdFx0XHRcdGJpcnRoZGF5OiB0aGlzLmRhdGUoe2RlbGltaXRlcjonLyd9KVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpdGVtLmVtYWlsID0gKGl0ZW0uZmlyc3ROYW1lLnN1YnN0cmluZygwLDEpICsgaXRlbS5sYXN0TmFtZSArICdAJyArIGl0ZW0uY29tcGFueSArICcuY29tJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0c3QgPSB0aGlzLmNpdHlTdGF0ZSgpO1xuXHRcdFx0XHRpdGVtLmNpdHkgPSBzdC5zcGxpdCgnLCAnKVswXTtcblx0XHRcdFx0aXRlbS5zdGF0ZSA9IHN0LnNwbGl0KCcsICcpWzFdO1xuXHRcdFx0XHRpdGVtLnppcGNvZGUgPSB0aGlzLmJpZ251bWJlcig1KTtcblx0XHRcdFx0aXRlbS5waG9uZSA9IHRoaXMuZm9ybWF0KHRoaXMuYmlnbnVtYmVyKDEwKSwgJ3Bob25lJyk7XG5cdFx0XHRcdGl0ZW0uc3NuID0gdGhpcy5mb3JtYXQodGhpcy5iaWdudW1iZXIoOSksICdzc24nKTtcblx0XHRcdFx0aXRlbXMucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9LFxuXG5cdFx0Zm9ybWF0OiBmdW5jdGlvbiAobiwgdHlwZSkge1xuXHRcdFx0dmFyIGQgPSAnLSc7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAncGhvbmUnOlxuXHRcdFx0XHRcdG4gPSAnJyArIG47XG5cdFx0XHRcdFx0cmV0dXJuIG4uc3Vic3RyaW5nKDAsMykgKyBkICsgbi5zdWJzdHJpbmcoMyw2KSArIGQgKyBuLnN1YnN0cmluZyg2KTtcblx0XHRcdFx0Y2FzZSAnc3NuJzpcblx0XHRcdFx0XHRuID0gJycgKyBuO1xuXHRcdFx0XHRcdHJldHVybiBuLnN1YnN0cmluZygwLDMpICsgZCArIG4uc3Vic3RyaW5nKDMsNSkgKyBkICsgbi5zdWJzdHJpbmcoNSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyYW5kLnd1cmRzID0gd29yZHMucmVwbGFjZSgvYXxlfGl8b3x1L2csIGZ1bmN0aW9uKGMpeyByZXR1cm4gKFwiYWVpb3VcIilbcmFuZC5uKDUpXTsgfSkuc3BsaXQoXCIsXCIpO1xuXG5cdHJldHVybiByYW5kO1xufSkpO1xuIl19
