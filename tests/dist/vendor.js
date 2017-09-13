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
console.log('shim...');
var supportsV1 = 'customElements' in window;
var supportsPromise = 'Promise' in window;
var nativeShimBase64 = "ZnVuY3Rpb24gbmF0aXZlU2hpbSgpeygoKT0+eyd1c2Ugc3RyaWN0JztpZighd2luZG93LmN1c3RvbUVsZW1lbnRzKXJldHVybjtjb25zdCBhPXdpbmRvdy5IVE1MRWxlbWVudCxiPXdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUsYz13aW5kb3cuY3VzdG9tRWxlbWVudHMuZ2V0LGQ9bmV3IE1hcCxlPW5ldyBNYXA7bGV0IGY9ITEsZz0hMTt3aW5kb3cuSFRNTEVsZW1lbnQ9ZnVuY3Rpb24oKXtpZighZil7Y29uc3Qgaj1kLmdldCh0aGlzLmNvbnN0cnVjdG9yKSxrPWMuY2FsbCh3aW5kb3cuY3VzdG9tRWxlbWVudHMsaik7Zz0hMDtjb25zdCBsPW5ldyBrO3JldHVybiBsfWY9ITE7fSx3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlPWEucHJvdG90eXBlO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csJ2N1c3RvbUVsZW1lbnRzJyx7dmFsdWU6d2luZG93LmN1c3RvbUVsZW1lbnRzLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cuY3VzdG9tRWxlbWVudHMsJ2RlZmluZScse3ZhbHVlOihqLGspPT57Y29uc3QgbD1rLnByb3RvdHlwZSxtPWNsYXNzIGV4dGVuZHMgYXtjb25zdHJ1Y3Rvcigpe3N1cGVyKCksT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsbCksZ3x8KGY9ITAsay5jYWxsKHRoaXMpKSxnPSExO319LG49bS5wcm90b3R5cGU7bS5vYnNlcnZlZEF0dHJpYnV0ZXM9ay5vYnNlcnZlZEF0dHJpYnV0ZXMsbi5jb25uZWN0ZWRDYWxsYmFjaz1sLmNvbm5lY3RlZENhbGxiYWNrLG4uZGlzY29ubmVjdGVkQ2FsbGJhY2s9bC5kaXNjb25uZWN0ZWRDYWxsYmFjayxuLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaz1sLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayxuLmFkb3B0ZWRDYWxsYmFjaz1sLmFkb3B0ZWRDYWxsYmFjayxkLnNldChrLGopLGUuc2V0KGosayksYi5jYWxsKHdpbmRvdy5jdXN0b21FbGVtZW50cyxqLG0pO30sY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5jdXN0b21FbGVtZW50cywnZ2V0Jyx7dmFsdWU6KGopPT5lLmdldChqKSxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTt9KSgpO30=";
if(supportsV1 && !window['no-native-shim']){
	eval(window.atob(nativeShimBase64));
	console.log('native shim');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJAY2x1YmFqYXgvZG9tIiwiQGNsdWJhamF4L29uIiwiY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsIiwicmFuZG9taXplciJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFVNRC5kZWZpbmUgKi8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBjdXN0b21Mb2FkZXIgPT09ICdmdW5jdGlvbicpeyBjdXN0b21Mb2FkZXIoZmFjdG9yeSwgJ2RvbScpOyB9ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7IGRlZmluZShbXSwgZmFjdG9yeSk7IH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpOyB9IGVsc2UgeyByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7IHdpbmRvdy5kb20gPSBmYWN0b3J5KCk7IH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyXG4gICAgICAgIGlzRmxvYXQgPSB7XG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgekluZGV4OiAxLFxuICAgICAgICAgICAgJ3otaW5kZXgnOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGlzRGltZW5zaW9uID0ge1xuICAgICAgICAgICAgd2lkdGg6MSxcbiAgICAgICAgICAgIGhlaWdodDoxLFxuICAgICAgICAgICAgdG9wOjEsXG4gICAgICAgICAgICBsZWZ0OjEsXG4gICAgICAgICAgICByaWdodDoxLFxuICAgICAgICAgICAgYm90dG9tOjEsXG4gICAgICAgICAgICBtYXhXaWR0aDoxLFxuICAgICAgICAgICAgJ21heC13aWR0aCc6MSxcbiAgICAgICAgICAgIG1pbldpZHRoOjEsXG4gICAgICAgICAgICAnbWluLXdpZHRoJzoxLFxuICAgICAgICAgICAgbWF4SGVpZ2h0OjEsXG4gICAgICAgICAgICAnbWF4LWhlaWdodCc6MVxuICAgICAgICB9LFxuICAgICAgICB1aWRzID0ge30sXG4gICAgICAgIGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgZnVuY3Rpb24gdWlkICh0eXBlKXtcblx0XHR0eXBlID0gdHlwZSB8fCAndWlkJztcbiAgICAgICAgaWYodWlkc1t0eXBlXSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHVpZHNbdHlwZV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZCA9IHR5cGUgKyAnLScgKyAodWlkc1t0eXBlXSArIDEpO1xuICAgICAgICB1aWRzW3R5cGVdKys7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc05vZGUgKGl0ZW0pe1xuICAgICAgICAvLyBzYWZlciB0ZXN0IGZvciBjdXN0b20gZWxlbWVudHMgaW4gRkYgKHdpdGggd2Mgc2hpbSlcblx0ICAgIC8vIGZyYWdtZW50IGlzIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgIHJldHVybiAhIWl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICh0eXBlb2YgaXRlbS5pbm5lckhUTUwgPT09ICdzdHJpbmcnIHx8IGl0ZW0ubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQtZnJhZ21lbnQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBieUlkIChpdGVtKXtcblx0XHRpZih0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpe1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW0pO1xuXHRcdH1cblx0XHRyZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHlsZSAobm9kZSwgcHJvcCwgdmFsdWUpe1xuICAgICAgICB2YXIga2V5LCBjb21wdXRlZDtcbiAgICAgICAgaWYodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIC8vIG9iamVjdCBzZXR0ZXJcbiAgICAgICAgICAgIGZvcihrZXkgaW4gcHJvcCl7XG4gICAgICAgICAgICAgICAgaWYocHJvcC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUobm9kZSwga2V5LCBwcm9wW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9ZWxzZSBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IHNldHRlclxuICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0RpbWVuc2lvbltwcm9wXSl7XG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldHRlciwgaWYgYSBzaW1wbGUgc3R5bGVcbiAgICAgICAgaWYobm9kZS5zdHlsZVtwcm9wXSl7XG4gICAgICAgICAgICBpZihpc0RpbWVuc2lvbltwcm9wXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG5vZGUuc3R5bGVbcHJvcF0sIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGlzRmxvYXRbcHJvcF0pe1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG5vZGUuc3R5bGVbcHJvcF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuc3R5bGVbcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXR0ZXIsIGNvbXB1dGVkXG4gICAgICAgIGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBwcm9wKTtcbiAgICAgICAgaWYoY29tcHV0ZWRbcHJvcF0pe1xuICAgICAgICAgICAgaWYoL1xcZC8udGVzdChjb21wdXRlZFtwcm9wXSkpe1xuICAgICAgICAgICAgICAgIGlmKCFpc05hTihwYXJzZUludChjb21wdXRlZFtwcm9wXSwgMTApKSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChjb21wdXRlZFtwcm9wXSwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRbcHJvcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGF0dHIgKG5vZGUsIHByb3AsIHZhbHVlKXtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgaWYodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIGZvcihrZXkgaW4gcHJvcCl7XG4gICAgICAgICAgICAgICAgaWYocHJvcC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIHByb3Bba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGlmKHByb3AgPT09ICd0ZXh0JyB8fCBwcm9wID09PSAnaHRtbCcgfHwgcHJvcCA9PT0gJ2lubmVySFRNTCcpIHtcbiAgICAgICAgICAgIFx0Ly8gaWdub3JlLCBoYW5kbGVkIGR1cmluZyBjcmVhdGlvblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHByb3AgPT09ICdjbGFzc05hbWUnIHx8IHByb3AgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0bm9kZS5jbGFzc05hbWUgPSB2YWx1ZTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYocHJvcCA9PT0gJ3N0eWxlJykge1xuXHRcdFx0XHRzdHlsZShub2RlLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHByb3AgPT09ICdhdHRyJykge1xuICAgICAgICAgICAgXHQvLyBiYWNrIGNvbXBhdFxuXHRcdFx0XHRhdHRyKG5vZGUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICBcdC8vIG9iamVjdCwgbGlrZSAnZGF0YSdcblx0XHRcdFx0bm9kZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUocHJvcCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm94IChub2RlKXtcbiAgICAgICAgaWYobm9kZSA9PT0gd2luZG93KXtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm9kZSBkaW1lbnNpb25zXG4gICAgICAgIC8vIHJldHVybmVkIG9iamVjdCBpcyBpbW11dGFibGVcbiAgICAgICAgLy8gYWRkIHNjcm9sbCBwb3NpdGlvbmluZyBhbmQgY29udmVuaWVuY2UgYWJicmV2aWF0aW9uc1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBieUlkKG5vZGUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBkaW1lbnNpb25zLnRvcCxcbiAgICAgICAgICAgIHJpZ2h0OiBkaW1lbnNpb25zLnJpZ2h0LFxuICAgICAgICAgICAgYm90dG9tOiBkaW1lbnNpb25zLmJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IGRpbWVuc2lvbnMubGVmdCxcbiAgICAgICAgICAgIGhlaWdodDogZGltZW5zaW9ucy5oZWlnaHQsXG4gICAgICAgICAgICBoOiBkaW1lbnNpb25zLmhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiBkaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgICAgdzogZGltZW5zaW9ucy53aWR0aCxcbiAgICAgICAgICAgIHNjcm9sbFk6IHdpbmRvdy5zY3JvbGxZLFxuICAgICAgICAgICAgc2Nyb2xsWDogd2luZG93LnNjcm9sbFgsXG4gICAgICAgICAgICB4OiBkaW1lbnNpb25zLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQsXG4gICAgICAgICAgICB5OiBkaW1lbnNpb25zLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHF1ZXJ5IChub2RlLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKCFzZWxlY3Rvcil7XG4gICAgICAgICAgICBzZWxlY3RvciA9IG5vZGU7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHF1ZXJ5QWxsIChub2RlLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKCFzZWxlY3Rvcil7XG4gICAgICAgICAgICBzZWxlY3RvciA9IG5vZGU7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5vZGVzID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgICBpZighbm9kZXMubGVuZ3RoKXsgcmV0dXJuIFtdOyB9XG5cbiAgICAgICAgLy8gY29udmVydCB0byBBcnJheSBhbmQgcmV0dXJuIGl0XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2Rlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9Eb20gKGh0bWwsIG9wdGlvbnMsIHBhcmVudCl7XG4gICAgICAgIHZhciBub2RlID0gZG9tKCdkaXYnLCB7aHRtbDogaHRtbH0pO1xuICAgICAgICBwYXJlbnQgPSBieUlkKHBhcmVudCB8fCBvcHRpb25zKTtcbiAgICAgICAgaWYocGFyZW50KXtcbiAgICAgICAgICAgIHdoaWxlKG5vZGUuZmlyc3RDaGlsZCl7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIGlmKGh0bWwuaW5kZXhPZignPCcpICE9PSAwKXtcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbURvbSAobm9kZSkge1xuICAgICAgICBmdW5jdGlvbiBnZXRBdHRycyAobm9kZSkge1xuICAgICAgICAgICAgdmFyIGF0dCwgaSwgYXR0cnMgPSB7fTtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgYXR0ID0gbm9kZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgIGF0dHJzW2F0dC5sb2NhbE5hbWVdID0gbm9ybWFsaXplKGF0dC52YWx1ZSA9PT0gJycgPyB0cnVlIDogYXR0LnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhdHRycztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXRUZXh0IChub2RlKSB7XG4gICAgICAgICAgICB2YXIgaSwgdCwgdGV4dCA9ICcnO1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0ID0gbm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmKHQubm9kZVR5cGUgPT09IDMgJiYgdC50ZXh0Q29udGVudC50cmltKCkpe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IHQudGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHZhciBpLCBvYmplY3QgPSBnZXRBdHRycyhub2RlKTtcbiAgICAgICAgb2JqZWN0LnRleHQgPSBnZXRUZXh0KG5vZGUpO1xuICAgICAgICBvYmplY3QuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgaWYobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgb2JqZWN0LmNoaWxkcmVuLnB1c2goZnJvbURvbShub2RlLmNoaWxkcmVuW2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cblx0ZnVuY3Rpb24gYWRkQ2hpbGRyZW4gKG5vZGUsIGNoaWxkcmVuKSB7XG5cdFx0aWYoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpe1xuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0aWYoY2hpbGRyZW5baV0pIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGNoaWxkcmVuW2ldID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0bm9kZS5hcHBlbmRDaGlsZCh0b0RvbShjaGlsZHJlbltpXSkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKGNoaWxkcmVuW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoY2hpbGRyZW4pIHtcblx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGRyZW4pO1xuXHRcdH1cblx0fVxuXG4gICAgZnVuY3Rpb24gYWRkQ29udGVudCAobm9kZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgaHRtbDtcbiAgICAgICAgaWYob3B0aW9ucy5odG1sICE9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5pbm5lckhUTUwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBodG1sID0gb3B0aW9ucy5odG1sIHx8IG9wdGlvbnMuaW5uZXJIVE1MIHx8ICcnO1xuICAgICAgICAgICAgaWYodHlwZW9mIGh0bWwgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgICAgICBhZGRDaGlsZHJlbihub2RlLCBodG1sKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgXHQvLyBjYXJlZnVsIGFzc3VtaW5nIHRleHRDb250ZW50IC1cblx0XHRcdFx0Ly8gbWlzc2VzIHNvbWUgSFRNTCwgc3VjaCBhcyBlbnRpdGllcyAoJm5wc3A7KVxuICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZihvcHRpb25zLnRleHQpe1xuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShvcHRpb25zLnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICBpZihvcHRpb25zLmNoaWxkcmVuKXtcbiAgICAgICAgICAgIGFkZENoaWxkcmVuKG5vZGUsIG9wdGlvbnMuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGRvbSAobm9kZVR5cGUsIG9wdGlvbnMsIHBhcmVudCwgcHJlcGVuZCl7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHQvLyBpZiBmaXJzdCBhcmd1bWVudCBpcyBhIHN0cmluZyBhbmQgc3RhcnRzIHdpdGggPCwgcGFzcyB0byB0b0RvbSgpXG4gICAgICAgIGlmKG5vZGVUeXBlLmluZGV4T2YoJzwnKSA9PT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gdG9Eb20obm9kZVR5cGUsIG9wdGlvbnMsIHBhcmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZVR5cGUpO1xuXG4gICAgICAgIHBhcmVudCA9IGJ5SWQocGFyZW50KTtcblxuICAgICAgICBhZGRDb250ZW50KG5vZGUsIG9wdGlvbnMpO1xuXG5cdFx0YXR0cihub2RlLCBvcHRpb25zKTtcblxuICAgICAgICBpZihwYXJlbnQgJiYgaXNOb2RlKHBhcmVudCkpe1xuICAgICAgICAgICAgaWYocHJlcGVuZCAmJiBwYXJlbnQuaGFzQ2hpbGROb2RlcygpKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudC5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnNlcnRBZnRlciAocmVmTm9kZSwgbm9kZSkge1xuICAgICAgICB2YXIgc2libGluZyA9IHJlZk5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICBpZighc2libGluZyl7XG4gICAgICAgICAgICByZWZOb2RlLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmVmTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBzaWJsaW5nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2libGluZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95IChub2RlKXtcbiAgICAgICAgLy8gZGVzdHJveXMgYSBub2RlIGNvbXBsZXRlbHlcbiAgICAgICAgLy9cbiAgICAgICAgaWYobm9kZSkge1xuICAgICAgICAgICAgZGVzdHJveWVyLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgZGVzdHJveWVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW4gKG5vZGUsIGRpc3Bvc2Upe1xuICAgICAgICAvL1x0UmVtb3ZlcyBhbGwgY2hpbGQgbm9kZXNcbiAgICAgICAgLy9cdFx0ZGlzcG9zZTogZGVzdHJveSBjaGlsZCBub2Rlc1xuICAgICAgICBpZihkaXNwb3NlKXtcbiAgICAgICAgICAgIHdoaWxlKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBkZXN0cm95KG5vZGUuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb20uY2xhc3NMaXN0ID0ge1xuICAgIFx0Ly8gaW4gYWRkaXRpb24gdG8gZml4aW5nIElFMTEgdG9nZ2xlXG5cdFx0Ly8gdGhlc2UgbWV0aG9kcyBhbHNvIGhhbmRsZSBhcnJheXNcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgdG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgdG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICByZXR1cm4gdG9BcnJheShuYW1lcykuZXZlcnkoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5jbGFzc0xpc3QuY29udGFpbnMobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMsIHZhbHVlKXtcbiAgICAgICAgICAgIG5hbWVzID0gdG9BcnJheShuYW1lcyk7XG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHN0YW5kYXJkIGZ1bmN0aW9uYWxpdHksIHN1cHBvcnRlZCBieSBJRVxuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QudG9nZ2xlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCB0aGUgc2Vjb25kIHBhcmFtZXRlciAgXG4gICAgICAgICAgICBlbHNlIGlmKHZhbHVlKXtcbiAgICAgICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAobmFtZXMpe1xuICAgICAgICBpZighbmFtZXMpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZG9tLmNsYXNzTGlzdCBzaG91bGQgaW5jbHVkZSBhIG5vZGUgYW5kIGEgY2xhc3NOYW1lJyk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWVzLnNwbGl0KCcgJykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZS50cmltKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBub3JtYWxpemUgKHZhbCl7XG4gICAgICAgIGlmKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIFx0dmFsID0gdmFsLnRyaW0oKTtcblx0XHRcdGlmKHZhbCA9PT0gJ2ZhbHNlJyl7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodmFsID09PSAnbnVsbCcpe1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodmFsID09PSAndHJ1ZScpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWwuaW5kZXhPZignLycpID4gLTEgfHwgdmFsLmluZGV4T2YoJyAnKSA+IC0xIHx8IHZhbC5pbmRleE9mKCctJykgPiAwKSB7XG5cdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHR9XG5cdFx0fVxuICAgICAgICBpZighaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSl7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgZG9tLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcbiAgICBkb20uY2xlYW4gPSBjbGVhbjtcbiAgICBkb20ucXVlcnkgPSBxdWVyeTtcbiAgICBkb20ucXVlcnlBbGwgPSBxdWVyeUFsbDtcbiAgICBkb20uYnlJZCA9IGJ5SWQ7XG4gICAgZG9tLmF0dHIgPSBhdHRyO1xuICAgIGRvbS5ib3ggPSBib3g7XG4gICAgZG9tLnN0eWxlID0gc3R5bGU7XG4gICAgZG9tLmRlc3Ryb3kgPSBkZXN0cm95O1xuICAgIGRvbS51aWQgPSB1aWQ7XG4gICAgZG9tLmlzTm9kZSA9IGlzTm9kZTtcbiAgICBkb20udG9Eb20gPSB0b0RvbTtcbiAgICBkb20uZnJvbURvbSA9IGZyb21Eb207XG4gICAgZG9tLmluc2VydEFmdGVyID0gaW5zZXJ0QWZ0ZXI7XG5cbiAgICByZXR1cm4gZG9tO1xufSkpO1xuIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgY3VzdG9tTG9hZGVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Y3VzdG9tTG9hZGVyKGZhY3RvcnksICdvbicpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdH0gZWxzZSB7XG5cdFx0cm9vdC5yZXR1cm5FeHBvcnRzID0gd2luZG93Lm9uID0gZmFjdG9yeSgpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIG1haW4gZnVuY3Rpb25cblxuXHRmdW5jdGlvbiBvbiAobm9kZSwgZXZlbnROYW1lLCBmaWx0ZXIsIGhhbmRsZXIpIHtcblx0XHQvLyBub3JtYWxpemUgcGFyYW1ldGVyc1xuXHRcdGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdG5vZGUgPSBnZXROb2RlQnlJZChub2RlKTtcblx0XHR9XG5cblx0XHQvLyBwcmVwYXJlIGEgY2FsbGJhY2tcblx0XHR2YXIgY2FsbGJhY2sgPSBtYWtlQ2FsbGJhY2sobm9kZSwgZmlsdGVyLCBoYW5kbGVyKTtcblxuXHRcdC8vIGZ1bmN0aW9uYWwgZXZlbnRcblx0XHRpZiAodHlwZW9mIGV2ZW50TmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmV0dXJuIGV2ZW50TmFtZShub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gc3BlY2lhbCBjYXNlOiBrZXlkb3duL2tleXVwIHdpdGggYSBsaXN0IG9mIGV4cGVjdGVkIGtleXNcblx0XHQvLyBUT0RPOiBjb25zaWRlciByZXBsYWNpbmcgd2l0aCBhbiBleHBsaWNpdCBldmVudCBmdW5jdGlvbjpcblx0XHQvLyB2YXIgaCA9IG9uKG5vZGUsIG9uS2V5RXZlbnQoJ2tleXVwJywgL0VudGVyLEVzYy8pLCBjYWxsYmFjayk7XG5cdFx0dmFyIGtleUV2ZW50ID0gL14oa2V5dXB8a2V5ZG93bik6KC4rKSQvLmV4ZWMoZXZlbnROYW1lKTtcblx0XHRpZiAoa2V5RXZlbnQpIHtcblx0XHRcdHJldHVybiBvbktleUV2ZW50KGtleUV2ZW50WzFdLCBuZXcgUmVnRXhwKGtleUV2ZW50WzJdLnNwbGl0KCcsJykuam9pbignfCcpKSkobm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIGhhbmRsZSBtdWx0aXBsZSBldmVudCB0eXBlcywgbGlrZTogb24obm9kZSwgJ21vdXNldXAsIG1vdXNlZG93bicsIGNhbGxiYWNrKTtcblx0XHRpZiAoLywvLnRlc3QoZXZlbnROYW1lKSkge1xuXHRcdFx0cmV0dXJuIG9uLm1ha2VNdWx0aUhhbmRsZShldmVudE5hbWUuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIG5hbWUudHJpbSgpO1xuXHRcdFx0fSkuZmlsdGVyKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRcdHJldHVybiBuYW1lO1xuXHRcdFx0fSkubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRcdHJldHVybiBvbihub2RlLCBuYW1lLCBjYWxsYmFjayk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIHJlZ2lzdGVyZWQgZnVuY3Rpb25hbCBldmVudHNcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9uLmV2ZW50cywgZXZlbnROYW1lKSkge1xuXHRcdFx0cmV0dXJuIG9uLmV2ZW50c1tldmVudE5hbWVdKG5vZGUsIGNhbGxiYWNrKTtcblx0XHR9XG5cblx0XHQvLyBzcGVjaWFsIGNhc2U6IGxvYWRpbmcgYW4gaW1hZ2Vcblx0XHRpZiAoZXZlbnROYW1lID09PSAnbG9hZCcgJiYgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbWcnKSB7XG5cdFx0XHRyZXR1cm4gb25JbWFnZUxvYWQobm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIHNwZWNpYWwgY2FzZTogbW91c2V3aGVlbFxuXHRcdGlmIChldmVudE5hbWUgPT09ICd3aGVlbCcpIHtcblx0XHRcdC8vIHBhc3MgdGhyb3VnaCwgYnV0IGZpcnN0IGN1cnJ5IGNhbGxiYWNrIHRvIHdoZWVsIGV2ZW50c1xuXHRcdFx0Y2FsbGJhY2sgPSBub3JtYWxpemVXaGVlbEV2ZW50KGNhbGxiYWNrKTtcblx0XHRcdGlmICghaGFzV2hlZWwpIHtcblx0XHRcdFx0Ly8gb2xkIEZpcmVmb3gsIG9sZCBJRSwgQ2hyb21lXG5cdFx0XHRcdHJldHVybiBvbi5tYWtlTXVsdGlIYW5kbGUoW1xuXHRcdFx0XHRcdG9uKG5vZGUsICdET01Nb3VzZVNjcm9sbCcsIGNhbGxiYWNrKSxcblx0XHRcdFx0XHRvbihub2RlLCAnbW91c2V3aGVlbCcsIGNhbGxiYWNrKVxuXHRcdFx0XHRdKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBzcGVjaWFsIGNhc2U6IGtleWJvYXJkXG5cdFx0aWYgKC9ea2V5Ly50ZXN0KGV2ZW50TmFtZSkpIHtcblx0XHRcdGNhbGxiYWNrID0gbm9ybWFsaXplS2V5RXZlbnQoY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIGRlZmF1bHQgY2FzZVxuXHRcdHJldHVybiBvbi5vbkRvbUV2ZW50KG5vZGUsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHR9XG5cblx0Ly8gcmVnaXN0ZXJlZCBmdW5jdGlvbmFsIGV2ZW50c1xuXHRvbi5ldmVudHMgPSB7XG5cdFx0Ly8gaGFuZGxlIGNsaWNrIGFuZCBFbnRlclxuXHRcdGJ1dHRvbjogZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG5cdFx0XHRyZXR1cm4gb24ubWFrZU11bHRpSGFuZGxlKFtcblx0XHRcdFx0b24obm9kZSwgJ2NsaWNrJywgY2FsbGJhY2spLFxuXHRcdFx0XHRvbihub2RlLCAna2V5dXA6RW50ZXInLCBjYWxsYmFjaylcblx0XHRcdF0pO1xuXHRcdH0sXG5cblx0XHQvLyBjdXN0b20gLSB1c2VkIGZvciBwb3B1cHMgJ24gc3R1ZmZcblx0XHRjbGlja29mZjogZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG5cdFx0XHQvLyBpbXBvcnRhbnQgbm90ZSFcblx0XHRcdC8vIHN0YXJ0cyBwYXVzZWRcblx0XHRcdC8vXG5cdFx0XHR2YXIgYkhhbmRsZSA9IG9uKG5vZGUub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSBlLnRhcmdldDtcblx0XHRcdFx0aWYgKHRhcmdldC5ub2RlVHlwZSAhPT0gMSkge1xuXHRcdFx0XHRcdHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0YXJnZXQgJiYgIW5vZGUuY29udGFpbnModGFyZ2V0KSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dmFyIGhhbmRsZSA9IHtcblx0XHRcdFx0c3RhdGU6ICdyZXN1bWVkJyxcblx0XHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRiSGFuZGxlLnJlc3VtZSgpO1xuXHRcdFx0XHRcdH0sIDEwMCk7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdyZXN1bWVkJztcblx0XHRcdFx0fSxcblx0XHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRiSGFuZGxlLnBhdXNlKCk7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdwYXVzZWQnO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRiSGFuZGxlLnJlbW92ZSgpO1xuXHRcdFx0XHRcdHRoaXMuc3RhdGUgPSAncmVtb3ZlZCc7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRoYW5kbGUucGF1c2UoKTtcblxuXHRcdFx0cmV0dXJuIGhhbmRsZTtcblx0XHR9XG5cdH07XG5cblx0Ly8gaW50ZXJuYWwgZXZlbnQgaGFuZGxlcnNcblxuXHRmdW5jdGlvbiBvbkRvbUV2ZW50IChub2RlLCBldmVudE5hbWUsIGNhbGxiYWNrKSB7XG5cdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBmYWxzZSk7XG5cdFx0XHRcdG5vZGUgPSBjYWxsYmFjayA9IG51bGw7XG5cdFx0XHRcdHRoaXMucmVtb3ZlID0gdGhpcy5wYXVzZSA9IHRoaXMucmVzdW1lID0gZnVuY3Rpb24gKCkge307XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdH0sXG5cdFx0XHRyZXN1bWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gb25JbWFnZUxvYWQgKG5vZGUsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGhhbmRsZSA9IG9uLm1ha2VNdWx0aUhhbmRsZShbXG5cdFx0XHRvbi5vbkRvbUV2ZW50KG5vZGUsICdsb2FkJywgb25JbWFnZUxvYWQpLFxuXHRcdFx0b24obm9kZSwgJ2Vycm9yJywgY2FsbGJhY2spXG5cdFx0XSk7XG5cblx0XHRyZXR1cm4gaGFuZGxlO1xuXG5cdFx0ZnVuY3Rpb24gb25JbWFnZUxvYWQgKGUpIHtcblx0XHRcdHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKG5vZGUubmF0dXJhbFdpZHRoIHx8IG5vZGUubmF0dXJhbEhlaWdodCkge1xuXHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXHRcdFx0XHRcdGUud2lkdGggID0gZS5uYXR1cmFsV2lkdGggID0gbm9kZS5uYXR1cmFsV2lkdGg7XG5cdFx0XHRcdFx0ZS5oZWlnaHQgPSBlLm5hdHVyYWxIZWlnaHQgPSBub2RlLm5hdHVyYWxIZWlnaHQ7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDEwMCk7XG5cdFx0XHRoYW5kbGUucmVtb3ZlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25LZXlFdmVudCAoa2V5RXZlbnROYW1lLCByZSkge1xuXHRcdHJldHVybiBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcblx0XHRcdHJldHVybiBvbihub2RlLCBrZXlFdmVudE5hbWUsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGlmIChyZS50ZXN0KGUua2V5KSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXHR9XG5cblx0Ly8gaW50ZXJuYWwgdXRpbGl0aWVzXG5cblx0dmFyIGhhc1doZWVsID0gKGZ1bmN0aW9uIGhhc1doZWVsVGVzdCAoKSB7XG5cdFx0dmFyXG5cdFx0XHRpc0lFID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdUcmlkZW50JykgPiAtMSxcblx0XHRcdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHJldHVybiBcIm9ud2hlZWxcIiBpbiBkaXYgfHwgXCJ3aGVlbFwiIGluIGRpdiB8fFxuXHRcdFx0KGlzSUUgJiYgZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uaGFzRmVhdHVyZShcIkV2ZW50cy53aGVlbFwiLCBcIjMuMFwiKSk7IC8vIElFIGZlYXR1cmUgZGV0ZWN0aW9uXG5cdH0pKCk7XG5cblx0dmFyIG1hdGNoZXM7XG5cdFsnbWF0Y2hlcycsICdtYXRjaGVzU2VsZWN0b3InLCAnd2Via2l0JywgJ21veicsICdtcycsICdvJ10uc29tZShmdW5jdGlvbiAobmFtZSkge1xuXHRcdGlmIChuYW1lLmxlbmd0aCA8IDcpIHsgLy8gcHJlZml4XG5cdFx0XHRuYW1lICs9ICdNYXRjaGVzU2VsZWN0b3InO1xuXHRcdH1cblx0XHRpZiAoRWxlbWVudC5wcm90b3R5cGVbbmFtZV0pIHtcblx0XHRcdG1hdGNoZXMgPSBuYW1lO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gY2xvc2VzdCAoZWxlbWVudCwgc2VsZWN0b3IsIHBhcmVudCkge1xuXHRcdHdoaWxlIChlbGVtZW50KSB7XG5cdFx0XHRpZiAoZWxlbWVudFtvbi5tYXRjaGVzXSAmJiBlbGVtZW50W29uLm1hdGNoZXNdKHNlbGVjdG9yKSkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdH1cblx0XHRcdGlmIChlbGVtZW50ID09PSBwYXJlbnQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHZhciBJTlZBTElEX1BST1BTID0ge1xuXHRcdGlzVHJ1c3RlZDogMVxuXHR9O1xuXHRmdW5jdGlvbiBtaXggKG9iamVjdCwgdmFsdWUpIHtcblx0XHRpZiAoIXZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gb2JqZWN0O1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0Zm9yKHZhciBrZXkgaW4gdmFsdWUpe1xuXHRcdFx0XHRpZiAoIUlOVkFMSURfUFJPUFNba2V5XSkge1xuXHRcdFx0XHRcdG9iamVjdFtrZXldID0gdmFsdWVba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRvYmplY3QudmFsdWUgPSB2YWx1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdHZhciBpZUtleXMgPSB7XG5cdFx0Ly9hOiAnVEVTVCcsXG5cdFx0VXA6ICdBcnJvd1VwJyxcblx0XHREb3duOiAnQXJyb3dEb3duJyxcblx0XHRMZWZ0OiAnQXJyb3dMZWZ0Jyxcblx0XHRSaWdodDogJ0Fycm93UmlnaHQnLFxuXHRcdEVzYzogJ0VzY2FwZScsXG5cdFx0U3BhY2ViYXI6ICcgJyxcblx0XHRXaW46ICdDb21tYW5kJ1xuXHR9O1xuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZUtleUV2ZW50IChjYWxsYmFjaykge1xuXHRcdC8vIElFIHVzZXMgb2xkIHNwZWNcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcblx0XHRcdGlmIChpZUtleXNbZS5rZXldKSB7XG5cdFx0XHRcdHZhciBmYWtlRXZlbnQgPSBtaXgoe30sIGUpO1xuXHRcdFx0XHRmYWtlRXZlbnQua2V5ID0gaWVLZXlzW2Uua2V5XTtcblx0XHRcdFx0Y2FsbGJhY2soZmFrZUV2ZW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHZhclxuXHRcdEZBQ1RPUiA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignV2luZG93cycpID4gLTEgPyAxMCA6IDAuMSxcblx0XHRYTFI4ID0gMCxcblx0XHRtb3VzZVdoZWVsSGFuZGxlO1xuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVdoZWVsRXZlbnQgKGNhbGxiYWNrKSB7XG5cdFx0Ly8gbm9ybWFsaXplcyBhbGwgYnJvd3NlcnMnIGV2ZW50cyB0byBhIHN0YW5kYXJkOlxuXHRcdC8vIGRlbHRhLCB3aGVlbFksIHdoZWVsWFxuXHRcdC8vIGFsc28gYWRkcyBhY2NlbGVyYXRpb24gYW5kIGRlY2VsZXJhdGlvbiB0byBtYWtlXG5cdFx0Ly8gTWFjIGFuZCBXaW5kb3dzIGJlaGF2ZSBzaW1pbGFybHlcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcblx0XHRcdFhMUjggKz0gRkFDVE9SO1xuXHRcdFx0dmFyXG5cdFx0XHRcdGRlbHRhWSA9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCAoZS53aGVlbERlbHRhWSB8fCBlLmRlbHRhWSkpKSxcblx0XHRcdFx0ZGVsdGFYID0gTWF0aC5tYXgoLTEwLCBNYXRoLm1pbigxMCwgKGUud2hlZWxEZWx0YVggfHwgZS5kZWx0YVgpKSk7XG5cblx0XHRcdGRlbHRhWSA9IGRlbHRhWSA8PSAwID8gZGVsdGFZIC0gWExSOCA6IGRlbHRhWSArIFhMUjg7XG5cblx0XHRcdGUuZGVsdGEgID0gZGVsdGFZO1xuXHRcdFx0ZS53aGVlbFkgPSBkZWx0YVk7XG5cdFx0XHRlLndoZWVsWCA9IGRlbHRhWDtcblxuXHRcdFx0Y2xlYXJUaW1lb3V0KG1vdXNlV2hlZWxIYW5kbGUpO1xuXHRcdFx0bW91c2VXaGVlbEhhbmRsZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRYTFI4ID0gMDtcblx0XHRcdH0sIDMwMCk7XG5cdFx0XHRjYWxsYmFjayhlKTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xvc2VzdEZpbHRlciAoZWxlbWVudCwgc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcblx0XHRcdHJldHVybiBvbi5jbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3RvciwgZWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VNdWx0aUhhbmRsZSAoaGFuZGxlcykge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdGF0ZTogJ3Jlc3VtZWQnLFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaCkge1xuXHRcdFx0XHRcdC8vIGFsbG93IGZvciBhIHNpbXBsZSBmdW5jdGlvbiBpbiB0aGUgbGlzdFxuXHRcdFx0XHRcdGlmIChoLnJlbW92ZSkge1xuXHRcdFx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBoID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRoKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aGFuZGxlcyA9IFtdO1xuXHRcdFx0XHR0aGlzLnJlbW92ZSA9IHRoaXMucGF1c2UgPSB0aGlzLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHt9O1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gJ3JlbW92ZWQnO1xuXHRcdFx0fSxcblx0XHRcdHBhdXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaCkge1xuXHRcdFx0XHRcdGlmIChoLnBhdXNlKSB7XG5cdFx0XHRcdFx0XHRoLnBhdXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdwYXVzZWQnO1xuXHRcdFx0fSxcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRoYW5kbGVzLmZvckVhY2goZnVuY3Rpb24gKGgpIHtcblx0XHRcdFx0XHRpZiAoaC5yZXN1bWUpIHtcblx0XHRcdFx0XHRcdGgucmVzdW1lKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdyZXN1bWVkJztcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Tm9kZUJ5SWQgKGlkKSB7XG5cdFx0dmFyIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdFx0aWYgKCFub2RlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdgb25gIENvdWxkIG5vdCBmaW5kOicsIGlkKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlQ2FsbGJhY2sgKG5vZGUsIGZpbHRlciwgaGFuZGxlcikge1xuXHRcdGlmIChmaWx0ZXIgJiYgaGFuZGxlcikge1xuXHRcdFx0aWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGZpbHRlciA9IGNsb3Nlc3RGaWx0ZXIobm9kZSwgZmlsdGVyKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gZmlsdGVyKGUpO1xuXHRcdFx0XHRpZiAocmVzdWx0KSB7XG5cdFx0XHRcdFx0ZS5maWx0ZXJlZFRhcmdldCA9IHJlc3VsdDtcblx0XHRcdFx0XHRoYW5kbGVyKGUsIHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiBmaWx0ZXIgfHwgaGFuZGxlcjtcblx0fVxuXG5cdC8vIHB1YmxpYyBmdW5jdGlvbnNcblxuXHRvbi5vbmNlID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgZmlsdGVyLCBjYWxsYmFjaykge1xuXHRcdHZhciBoO1xuXHRcdGlmIChmaWx0ZXIgJiYgY2FsbGJhY2spIHtcblx0XHRcdGggPSBvbihub2RlLCBldmVudE5hbWUsIGZpbHRlciwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYWxsYmFjay5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG5cdFx0XHRcdGgucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aCA9IG9uKG5vZGUsIGV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRmaWx0ZXIuYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xuXHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBoO1xuXHR9O1xuXG5cdG9uLmVtaXQgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCB2YWx1ZSkge1xuXHRcdG5vZGUgPSB0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgPyBnZXROb2RlQnlJZChub2RlKSA6IG5vZGU7XG5cdFx0dmFyIGV2ZW50ID0gKG5vZGUgPT09IGRvY3VtZW50ID8gZG9jdW1lbnQgOiBub2RlLm93bmVyRG9jdW1lbnQpLmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0ZXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgdHJ1ZSk7IC8vIGV2ZW50IHR5cGUsIGJ1YmJsaW5nLCBjYW5jZWxhYmxlXG5cdFx0cmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChtaXgoZXZlbnQsIHZhbHVlKSk7XG5cdH07XG5cblx0b24uZmlyZSA9IGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG5cdFx0bm9kZSA9IHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyA/IGdldE5vZGVCeUlkKG5vZGUpIDogbm9kZTtcblx0XHR2YXIgZXZlbnQgPSAobm9kZSA9PT0gZG9jdW1lbnQgPyBkb2N1bWVudCA6IG5vZGUub3duZXJEb2N1bWVudCkuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG5cdFx0ZXZlbnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgISFidWJibGVzLCB0cnVlLCBldmVudERldGFpbCk7IC8vIGV2ZW50IHR5cGUsIGJ1YmJsaW5nLCBjYW5jZWxhYmxlLCB2YWx1ZVxuXHRcdHJldHVybiBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHR9O1xuXG5cdC8vIFRPRE86IERFUFJFQ0FURURcblx0b24uaXNBbHBoYU51bWVyaWMgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdFx0cmV0dXJuIC9eWzAtOWEtel0kL2kudGVzdChzdHIpO1xuXHR9O1xuXG5cdG9uLm1ha2VNdWx0aUhhbmRsZSA9IG1ha2VNdWx0aUhhbmRsZTtcblx0b24ub25Eb21FdmVudCA9IG9uRG9tRXZlbnQ7IC8vIHVzZSBkaXJlY3RseSB0byBwcmV2ZW50IHBvc3NpYmxlIGRlZmluaXRpb24gbG9vcHNcblx0b24uY2xvc2VzdCA9IGNsb3Nlc3Q7XG5cdG9uLm1hdGNoZXMgPSBtYXRjaGVzO1xuXG5cdHJldHVybiBvbjtcbn0pKTtcbiIsImNvbnNvbGUubG9nKCdzaGltLi4uJyk7XG52YXIgc3VwcG9ydHNWMSA9ICdjdXN0b21FbGVtZW50cycgaW4gd2luZG93O1xudmFyIHN1cHBvcnRzUHJvbWlzZSA9ICdQcm9taXNlJyBpbiB3aW5kb3c7XG52YXIgbmF0aXZlU2hpbUJhc2U2NCA9IFwiWm5WdVkzUnBiMjRnYm1GMGFYWmxVMmhwYlNncGV5Z29LVDArZXlkMWMyVWdjM1J5YVdOMEp6dHBaaWdoZDJsdVpHOTNMbU4xYzNSdmJVVnNaVzFsYm5SektYSmxkSFZ5Ymp0amIyNXpkQ0JoUFhkcGJtUnZkeTVJVkUxTVJXeGxiV1Z1ZEN4aVBYZHBibVJ2ZHk1amRYTjBiMjFGYkdWdFpXNTBjeTVrWldacGJtVXNZejEzYVc1a2IzY3VZM1Z6ZEc5dFJXeGxiV1Z1ZEhNdVoyVjBMR1E5Ym1WM0lFMWhjQ3hsUFc1bGR5Qk5ZWEE3YkdWMElHWTlJVEVzWnowaE1UdDNhVzVrYjNjdVNGUk5URVZzWlcxbGJuUTlablZ1WTNScGIyNG9LWHRwWmlnaFppbDdZMjl1YzNRZ2FqMWtMbWRsZENoMGFHbHpMbU52Ym5OMGNuVmpkRzl5S1N4clBXTXVZMkZzYkNoM2FXNWtiM2N1WTNWemRHOXRSV3hsYldWdWRITXNhaWs3WnowaE1EdGpiMjV6ZENCc1BXNWxkeUJyTzNKbGRIVnliaUJzZldZOUlURTdmU3gzYVc1a2IzY3VTRlJOVEVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsUFdFdWNISnZkRzkwZVhCbE8wOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2gzYVc1a2IzY3NKMk4xYzNSdmJVVnNaVzFsYm5Sekp5eDdkbUZzZFdVNmQybHVaRzkzTG1OMWMzUnZiVVZzWlcxbGJuUnpMR052Ym1acFozVnlZV0pzWlRvaE1DeDNjbWwwWVdKc1pUb2hNSDBwTEU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDNhVzVrYjNjdVkzVnpkRzl0Uld4bGJXVnVkSE1zSjJSbFptbHVaU2NzZTNaaGJIVmxPaWhxTEdzcFBUNTdZMjl1YzNRZ2JEMXJMbkJ5YjNSdmRIbHdaU3h0UFdOc1lYTnpJR1Y0ZEdWdVpITWdZWHRqYjI1emRISjFZM1J2Y2lncGUzTjFjR1Z5S0Nrc1QySnFaV04wTG5ObGRGQnliM1J2ZEhsd1pVOW1LSFJvYVhNc2JDa3NaM3g4S0dZOUlUQXNheTVqWVd4c0tIUm9hWE1wS1N4blBTRXhPMzE5TEc0OWJTNXdjbTkwYjNSNWNHVTdiUzV2WW5ObGNuWmxaRUYwZEhKcFluVjBaWE05YXk1dlluTmxjblpsWkVGMGRISnBZblYwWlhNc2JpNWpiMjV1WldOMFpXUkRZV3hzWW1GamF6MXNMbU52Ym01bFkzUmxaRU5oYkd4aVlXTnJMRzR1WkdselkyOXVibVZqZEdWa1EyRnNiR0poWTJzOWJDNWthWE5qYjI1dVpXTjBaV1JEWVd4c1ltRmpheXh1TG1GMGRISnBZblYwWlVOb1lXNW5aV1JEWVd4c1ltRmphejFzTG1GMGRISnBZblYwWlVOb1lXNW5aV1JEWVd4c1ltRmpheXh1TG1Ga2IzQjBaV1JEWVd4c1ltRmphejFzTG1Ga2IzQjBaV1JEWVd4c1ltRmpheXhrTG5ObGRDaHJMR29wTEdVdWMyVjBLR29zYXlrc1lpNWpZV3hzS0hkcGJtUnZkeTVqZFhOMGIyMUZiR1Z0Wlc1MGN5eHFMRzBwTzMwc1kyOXVabWxuZFhKaFlteGxPaUV3TEhkeWFYUmhZbXhsT2lFd2ZTa3NUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0hkcGJtUnZkeTVqZFhOMGIyMUZiR1Z0Wlc1MGN5d25aMlYwSnl4N2RtRnNkV1U2S0dvcFBUNWxMbWRsZENocUtTeGpiMjVtYVdkMWNtRmliR1U2SVRBc2QzSnBkR0ZpYkdVNklUQjlLVHQ5S1NncE8zMD1cIjtcbmlmKHN1cHBvcnRzVjEgJiYgIXdpbmRvd1snbm8tbmF0aXZlLXNoaW0nXSl7XG5cdGV2YWwod2luZG93LmF0b2IobmF0aXZlU2hpbUJhc2U2NCkpO1xuXHRjb25zb2xlLmxvZygnbmF0aXZlIHNoaW0nKTtcblx0bmF0aXZlU2hpbSgpO1xufWVsc2V7XG5cdGN1c3RvbUVsZW1lbnRzKCk7XG59XG5pZiAoIXN1cHBvcnRzUHJvbWlzZSkge1xuXHRwcm9taXNlUG9seWZpbGwoKTtcbn1cblxuZnVuY3Rpb24gY3VzdG9tRWxlbWVudHMoKSB7XG4oZnVuY3Rpb24oKXtcbid1c2Ugc3RyaWN0Jzt2YXIgZz1uZXcgZnVuY3Rpb24oKXt9O3ZhciBhYT1uZXcgU2V0KFwiYW5ub3RhdGlvbi14bWwgY29sb3ItcHJvZmlsZSBmb250LWZhY2UgZm9udC1mYWNlLXNyYyBmb250LWZhY2UtdXJpIGZvbnQtZmFjZS1mb3JtYXQgZm9udC1mYWNlLW5hbWUgbWlzc2luZy1nbHlwaFwiLnNwbGl0KFwiIFwiKSk7ZnVuY3Rpb24gayhiKXt2YXIgYT1hYS5oYXMoYik7Yj0vXlthLXpdWy4wLTlfYS16XSotW1xcLS4wLTlfYS16XSokLy50ZXN0KGIpO3JldHVybiFhJiZifWZ1bmN0aW9uIGwoYil7dmFyIGE9Yi5pc0Nvbm5lY3RlZDtpZih2b2lkIDAhPT1hKXJldHVybiBhO2Zvcig7YiYmIShiLl9fQ0VfaXNJbXBvcnREb2N1bWVudHx8YiBpbnN0YW5jZW9mIERvY3VtZW50KTspYj1iLnBhcmVudE5vZGV8fCh3aW5kb3cuU2hhZG93Um9vdCYmYiBpbnN0YW5jZW9mIFNoYWRvd1Jvb3Q/Yi5ob3N0OnZvaWQgMCk7cmV0dXJuISghYnx8IShiLl9fQ0VfaXNJbXBvcnREb2N1bWVudHx8YiBpbnN0YW5jZW9mIERvY3VtZW50KSl9XG5mdW5jdGlvbiBtKGIsYSl7Zm9yKDthJiZhIT09YiYmIWEubmV4dFNpYmxpbmc7KWE9YS5wYXJlbnROb2RlO3JldHVybiBhJiZhIT09Yj9hLm5leHRTaWJsaW5nOm51bGx9XG5mdW5jdGlvbiBuKGIsYSxlKXtlPWU/ZTpuZXcgU2V0O2Zvcih2YXIgYz1iO2M7KXtpZihjLm5vZGVUeXBlPT09Tm9kZS5FTEVNRU5UX05PREUpe3ZhciBkPWM7YShkKTt2YXIgaD1kLmxvY2FsTmFtZTtpZihcImxpbmtcIj09PWgmJlwiaW1wb3J0XCI9PT1kLmdldEF0dHJpYnV0ZShcInJlbFwiKSl7Yz1kLmltcG9ydDtpZihjIGluc3RhbmNlb2YgTm9kZSYmIWUuaGFzKGMpKWZvcihlLmFkZChjKSxjPWMuZmlyc3RDaGlsZDtjO2M9Yy5uZXh0U2libGluZyluKGMsYSxlKTtjPW0oYixkKTtjb250aW51ZX1lbHNlIGlmKFwidGVtcGxhdGVcIj09PWgpe2M9bShiLGQpO2NvbnRpbnVlfWlmKGQ9ZC5fX0NFX3NoYWRvd1Jvb3QpZm9yKGQ9ZC5maXJzdENoaWxkO2Q7ZD1kLm5leHRTaWJsaW5nKW4oZCxhLGUpfWM9Yy5maXJzdENoaWxkP2MuZmlyc3RDaGlsZDptKGIsYyl9fWZ1bmN0aW9uIHEoYixhLGUpe2JbYV09ZX07ZnVuY3Rpb24gcigpe3RoaXMuYT1uZXcgTWFwO3RoaXMuZj1uZXcgTWFwO3RoaXMuYz1bXTt0aGlzLmI9ITF9ZnVuY3Rpb24gYmEoYixhLGUpe2IuYS5zZXQoYSxlKTtiLmYuc2V0KGUuY29uc3RydWN0b3IsZSl9ZnVuY3Rpb24gdChiLGEpe2IuYj0hMDtiLmMucHVzaChhKX1mdW5jdGlvbiB2KGIsYSl7Yi5iJiZuKGEsZnVuY3Rpb24oYSl7cmV0dXJuIHcoYixhKX0pfWZ1bmN0aW9uIHcoYixhKXtpZihiLmImJiFhLl9fQ0VfcGF0Y2hlZCl7YS5fX0NFX3BhdGNoZWQ9ITA7Zm9yKHZhciBlPTA7ZTxiLmMubGVuZ3RoO2UrKyliLmNbZV0oYSl9fWZ1bmN0aW9uIHgoYixhKXt2YXIgZT1bXTtuKGEsZnVuY3Rpb24oYil7cmV0dXJuIGUucHVzaChiKX0pO2ZvcihhPTA7YTxlLmxlbmd0aDthKyspe3ZhciBjPWVbYV07MT09PWMuX19DRV9zdGF0ZT9iLmNvbm5lY3RlZENhbGxiYWNrKGMpOnkoYixjKX19XG5mdW5jdGlvbiB6KGIsYSl7dmFyIGU9W107bihhLGZ1bmN0aW9uKGIpe3JldHVybiBlLnB1c2goYil9KTtmb3IoYT0wO2E8ZS5sZW5ndGg7YSsrKXt2YXIgYz1lW2FdOzE9PT1jLl9fQ0Vfc3RhdGUmJmIuZGlzY29ubmVjdGVkQ2FsbGJhY2soYyl9fVxuZnVuY3Rpb24gQShiLGEsZSl7ZT1lP2U6bmV3IFNldDt2YXIgYz1bXTtuKGEsZnVuY3Rpb24oZCl7aWYoXCJsaW5rXCI9PT1kLmxvY2FsTmFtZSYmXCJpbXBvcnRcIj09PWQuZ2V0QXR0cmlidXRlKFwicmVsXCIpKXt2YXIgYT1kLmltcG9ydDthIGluc3RhbmNlb2YgTm9kZSYmXCJjb21wbGV0ZVwiPT09YS5yZWFkeVN0YXRlPyhhLl9fQ0VfaXNJbXBvcnREb2N1bWVudD0hMCxhLl9fQ0VfaGFzUmVnaXN0cnk9ITApOmQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixmdW5jdGlvbigpe3ZhciBhPWQuaW1wb3J0O2EuX19DRV9kb2N1bWVudExvYWRIYW5kbGVkfHwoYS5fX0NFX2RvY3VtZW50TG9hZEhhbmRsZWQ9ITAsYS5fX0NFX2lzSW1wb3J0RG9jdW1lbnQ9ITAsYS5fX0NFX2hhc1JlZ2lzdHJ5PSEwLG5ldyBTZXQoZSksZS5kZWxldGUoYSksQShiLGEsZSkpfSl9ZWxzZSBjLnB1c2goZCl9LGUpO2lmKGIuYilmb3IoYT0wO2E8Yy5sZW5ndGg7YSsrKXcoYixjW2FdKTtmb3IoYT0wO2E8Yy5sZW5ndGg7YSsrKXkoYixcbmNbYV0pfVxuZnVuY3Rpb24geShiLGEpe2lmKHZvaWQgMD09PWEuX19DRV9zdGF0ZSl7dmFyIGU9Yi5hLmdldChhLmxvY2FsTmFtZSk7aWYoZSl7ZS5jb25zdHJ1Y3Rpb25TdGFjay5wdXNoKGEpO3ZhciBjPWUuY29uc3RydWN0b3I7dHJ5e3RyeXtpZihuZXcgYyE9PWEpdGhyb3cgRXJyb3IoXCJUaGUgY3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3IgZGlkIG5vdCBwcm9kdWNlIHRoZSBlbGVtZW50IGJlaW5nIHVwZ3JhZGVkLlwiKTt9ZmluYWxseXtlLmNvbnN0cnVjdGlvblN0YWNrLnBvcCgpfX1jYXRjaChmKXt0aHJvdyBhLl9fQ0Vfc3RhdGU9MixmO31hLl9fQ0Vfc3RhdGU9MTthLl9fQ0VfZGVmaW5pdGlvbj1lO2lmKGUuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKWZvcihlPWUub2JzZXJ2ZWRBdHRyaWJ1dGVzLGM9MDtjPGUubGVuZ3RoO2MrKyl7dmFyIGQ9ZVtjXSxoPWEuZ2V0QXR0cmlidXRlKGQpO251bGwhPT1oJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhLGQsbnVsbCxoLG51bGwpfWwoYSkmJmIuY29ubmVjdGVkQ2FsbGJhY2soYSl9fX1cbnIucHJvdG90eXBlLmNvbm5lY3RlZENhbGxiYWNrPWZ1bmN0aW9uKGIpe3ZhciBhPWIuX19DRV9kZWZpbml0aW9uO2EuY29ubmVjdGVkQ2FsbGJhY2smJmEuY29ubmVjdGVkQ2FsbGJhY2suY2FsbChiKX07ci5wcm90b3R5cGUuZGlzY29ubmVjdGVkQ2FsbGJhY2s9ZnVuY3Rpb24oYil7dmFyIGE9Yi5fX0NFX2RlZmluaXRpb247YS5kaXNjb25uZWN0ZWRDYWxsYmFjayYmYS5kaXNjb25uZWN0ZWRDYWxsYmFjay5jYWxsKGIpfTtyLnByb3RvdHlwZS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s9ZnVuY3Rpb24oYixhLGUsYyxkKXt2YXIgaD1iLl9fQ0VfZGVmaW5pdGlvbjtoLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmLTE8aC5vYnNlcnZlZEF0dHJpYnV0ZXMuaW5kZXhPZihhKSYmaC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbChiLGEsZSxjLGQpfTtmdW5jdGlvbiBCKGIsYSl7dGhpcy5jPWI7dGhpcy5hPWE7dGhpcy5iPXZvaWQgMDtBKHRoaXMuYyx0aGlzLmEpO1wibG9hZGluZ1wiPT09dGhpcy5hLnJlYWR5U3RhdGUmJih0aGlzLmI9bmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5mLmJpbmQodGhpcykpLHRoaXMuYi5vYnNlcnZlKHRoaXMuYSx7Y2hpbGRMaXN0OiEwLHN1YnRyZWU6ITB9KSl9ZnVuY3Rpb24gQyhiKXtiLmImJmIuYi5kaXNjb25uZWN0KCl9Qi5wcm90b3R5cGUuZj1mdW5jdGlvbihiKXt2YXIgYT10aGlzLmEucmVhZHlTdGF0ZTtcImludGVyYWN0aXZlXCIhPT1hJiZcImNvbXBsZXRlXCIhPT1hfHxDKHRoaXMpO2ZvcihhPTA7YTxiLmxlbmd0aDthKyspZm9yKHZhciBlPWJbYV0uYWRkZWROb2RlcyxjPTA7YzxlLmxlbmd0aDtjKyspQSh0aGlzLmMsZVtjXSl9O2Z1bmN0aW9uIGNhKCl7dmFyIGI9dGhpczt0aGlzLmI9dGhpcy5hPXZvaWQgMDt0aGlzLmM9bmV3IFByb21pc2UoZnVuY3Rpb24oYSl7Yi5iPWE7Yi5hJiZhKGIuYSl9KX1mdW5jdGlvbiBEKGIpe2lmKGIuYSl0aHJvdyBFcnJvcihcIkFscmVhZHkgcmVzb2x2ZWQuXCIpO2IuYT12b2lkIDA7Yi5iJiZiLmIodm9pZCAwKX07ZnVuY3Rpb24gRShiKXt0aGlzLmY9ITE7dGhpcy5hPWI7dGhpcy5oPW5ldyBNYXA7dGhpcy5nPWZ1bmN0aW9uKGIpe3JldHVybiBiKCl9O3RoaXMuYj0hMTt0aGlzLmM9W107dGhpcy5qPW5ldyBCKGIsZG9jdW1lbnQpfVxuRS5wcm90b3R5cGUubD1mdW5jdGlvbihiLGEpe3ZhciBlPXRoaXM7aWYoIShhIGluc3RhbmNlb2YgRnVuY3Rpb24pKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvcnMgbXVzdCBiZSBmdW5jdGlvbnMuXCIpO2lmKCFrKGIpKXRocm93IG5ldyBTeW50YXhFcnJvcihcIlRoZSBlbGVtZW50IG5hbWUgJ1wiK2IrXCInIGlzIG5vdCB2YWxpZC5cIik7aWYodGhpcy5hLmEuZ2V0KGIpKXRocm93IEVycm9yKFwiQSBjdXN0b20gZWxlbWVudCB3aXRoIG5hbWUgJ1wiK2IrXCInIGhhcyBhbHJlYWR5IGJlZW4gZGVmaW5lZC5cIik7aWYodGhpcy5mKXRocm93IEVycm9yKFwiQSBjdXN0b20gZWxlbWVudCBpcyBhbHJlYWR5IGJlaW5nIGRlZmluZWQuXCIpO3RoaXMuZj0hMDt2YXIgYyxkLGgsZix1O3RyeXt2YXIgcD1mdW5jdGlvbihiKXt2YXIgYT1QW2JdO2lmKHZvaWQgMCE9PWEmJiEoYSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSl0aHJvdyBFcnJvcihcIlRoZSAnXCIrYitcIicgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLlwiKTtcbnJldHVybiBhfSxQPWEucHJvdG90eXBlO2lmKCEoUCBpbnN0YW5jZW9mIE9iamVjdCkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvcidzIHByb3RvdHlwZSBpcyBub3QgYW4gb2JqZWN0LlwiKTtjPXAoXCJjb25uZWN0ZWRDYWxsYmFja1wiKTtkPXAoXCJkaXNjb25uZWN0ZWRDYWxsYmFja1wiKTtoPXAoXCJhZG9wdGVkQ2FsbGJhY2tcIik7Zj1wKFwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrXCIpO3U9YS5vYnNlcnZlZEF0dHJpYnV0ZXN8fFtdfWNhdGNoKHZhKXtyZXR1cm59ZmluYWxseXt0aGlzLmY9ITF9YmEodGhpcy5hLGIse2xvY2FsTmFtZTpiLGNvbnN0cnVjdG9yOmEsY29ubmVjdGVkQ2FsbGJhY2s6YyxkaXNjb25uZWN0ZWRDYWxsYmFjazpkLGFkb3B0ZWRDYWxsYmFjazpoLGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjazpmLG9ic2VydmVkQXR0cmlidXRlczp1LGNvbnN0cnVjdGlvblN0YWNrOltdfSk7dGhpcy5jLnB1c2goYik7dGhpcy5ifHwodGhpcy5iPVxuITAsdGhpcy5nKGZ1bmN0aW9uKCl7aWYoITEhPT1lLmIpZm9yKGUuYj0hMSxBKGUuYSxkb2N1bWVudCk7MDxlLmMubGVuZ3RoOyl7dmFyIGI9ZS5jLnNoaWZ0KCk7KGI9ZS5oLmdldChiKSkmJkQoYil9fSkpfTtFLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oYil7aWYoYj10aGlzLmEuYS5nZXQoYikpcmV0dXJuIGIuY29uc3RydWN0b3J9O0UucHJvdG90eXBlLm89ZnVuY3Rpb24oYil7aWYoIWsoYikpcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBTeW50YXhFcnJvcihcIidcIitiK1wiJyBpcyBub3QgYSB2YWxpZCBjdXN0b20gZWxlbWVudCBuYW1lLlwiKSk7dmFyIGE9dGhpcy5oLmdldChiKTtpZihhKXJldHVybiBhLmM7YT1uZXcgY2E7dGhpcy5oLnNldChiLGEpO3RoaXMuYS5hLmdldChiKSYmLTE9PT10aGlzLmMuaW5kZXhPZihiKSYmRChhKTtyZXR1cm4gYS5jfTtFLnByb3RvdHlwZS5tPWZ1bmN0aW9uKGIpe0ModGhpcy5qKTt2YXIgYT10aGlzLmc7dGhpcy5nPWZ1bmN0aW9uKGUpe3JldHVybiBiKGZ1bmN0aW9uKCl7cmV0dXJuIGEoZSl9KX19O1xud2luZG93LkN1c3RvbUVsZW1lbnRSZWdpc3RyeT1FO0UucHJvdG90eXBlLmRlZmluZT1FLnByb3RvdHlwZS5sO0UucHJvdG90eXBlLmdldD1FLnByb3RvdHlwZS5nZXQ7RS5wcm90b3R5cGUud2hlbkRlZmluZWQ9RS5wcm90b3R5cGUubztFLnByb3RvdHlwZS5wb2x5ZmlsbFdyYXBGbHVzaENhbGxiYWNrPUUucHJvdG90eXBlLm07dmFyIEY9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50LGRhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudE5TLGVhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuaW1wb3J0Tm9kZSxmYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLnByZXBlbmQsZ2E9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5hcHBlbmQsRz13aW5kb3cuTm9kZS5wcm90b3R5cGUuY2xvbmVOb2RlLEg9d2luZG93Lk5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkLEk9d2luZG93Lk5vZGUucHJvdG90eXBlLmluc2VydEJlZm9yZSxKPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5yZW1vdmVDaGlsZCxLPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5yZXBsYWNlQ2hpbGQsTD1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5Ob2RlLnByb3RvdHlwZSxcInRleHRDb250ZW50XCIpLE09d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmF0dGFjaFNoYWRvdyxOPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93LkVsZW1lbnQucHJvdG90eXBlLFxuXCJpbm5lckhUTUxcIiksTz13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlLFE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZSxSPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGUsUz13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlTlMsVD13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlTlMsVT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlTlMsVj13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuaW5zZXJ0QWRqYWNlbnRFbGVtZW50LGhhPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5wcmVwZW5kLGlhPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hcHBlbmQsamE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmJlZm9yZSxrYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYWZ0ZXIsbGE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlcGxhY2VXaXRoLG1hPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZW1vdmUsXG5uYT13aW5kb3cuSFRNTEVsZW1lbnQsVz1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGUsXCJpbm5lckhUTUxcIiksWD13aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlLmluc2VydEFkamFjZW50RWxlbWVudDtmdW5jdGlvbiBvYSgpe3ZhciBiPVk7d2luZG93LkhUTUxFbGVtZW50PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYSgpe3ZhciBhPXRoaXMuY29uc3RydWN0b3IsYz1iLmYuZ2V0KGEpO2lmKCFjKXRocm93IEVycm9yKFwiVGhlIGN1c3RvbSBlbGVtZW50IGJlaW5nIGNvbnN0cnVjdGVkIHdhcyBub3QgcmVnaXN0ZXJlZCB3aXRoIGBjdXN0b21FbGVtZW50c2AuXCIpO3ZhciBkPWMuY29uc3RydWN0aW9uU3RhY2s7aWYoIWQubGVuZ3RoKXJldHVybiBkPUYuY2FsbChkb2N1bWVudCxjLmxvY2FsTmFtZSksT2JqZWN0LnNldFByb3RvdHlwZU9mKGQsYS5wcm90b3R5cGUpLGQuX19DRV9zdGF0ZT0xLGQuX19DRV9kZWZpbml0aW9uPWMsdyhiLGQpLGQ7dmFyIGM9ZC5sZW5ndGgtMSxoPWRbY107aWYoaD09PWcpdGhyb3cgRXJyb3IoXCJUaGUgSFRNTEVsZW1lbnQgY29uc3RydWN0b3Igd2FzIGVpdGhlciBjYWxsZWQgcmVlbnRyYW50bHkgZm9yIHRoaXMgY29uc3RydWN0b3Igb3IgY2FsbGVkIG11bHRpcGxlIHRpbWVzLlwiKTtcbmRbY109ZztPYmplY3Quc2V0UHJvdG90eXBlT2YoaCxhLnByb3RvdHlwZSk7dyhiLGgpO3JldHVybiBofWEucHJvdG90eXBlPW5hLnByb3RvdHlwZTtyZXR1cm4gYX0oKX07ZnVuY3Rpb24gcGEoYixhLGUpe2EucHJlcGVuZD1mdW5jdGlvbihhKXtmb3IodmFyIGQ9W10sYz0wO2M8YXJndW1lbnRzLmxlbmd0aDsrK2MpZFtjLTBdPWFyZ3VtZW50c1tjXTtjPWQuZmlsdGVyKGZ1bmN0aW9uKGIpe3JldHVybiBiIGluc3RhbmNlb2YgTm9kZSYmbChiKX0pO2UuaS5hcHBseSh0aGlzLGQpO2Zvcih2YXIgZj0wO2Y8Yy5sZW5ndGg7ZisrKXooYixjW2ZdKTtpZihsKHRoaXMpKWZvcihjPTA7YzxkLmxlbmd0aDtjKyspZj1kW2NdLGYgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZil9O2EuYXBwZW5kPWZ1bmN0aW9uKGEpe2Zvcih2YXIgZD1bXSxjPTA7Yzxhcmd1bWVudHMubGVuZ3RoOysrYylkW2MtMF09YXJndW1lbnRzW2NdO2M9ZC5maWx0ZXIoZnVuY3Rpb24oYil7cmV0dXJuIGIgaW5zdGFuY2VvZiBOb2RlJiZsKGIpfSk7ZS5hcHBlbmQuYXBwbHkodGhpcyxkKTtmb3IodmFyIGY9MDtmPGMubGVuZ3RoO2YrKyl6KGIsY1tmXSk7aWYobCh0aGlzKSlmb3IoYz0wO2M8XG5kLmxlbmd0aDtjKyspZj1kW2NdLGYgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZil9fTtmdW5jdGlvbiBxYSgpe3ZhciBiPVk7cShEb2N1bWVudC5wcm90b3R5cGUsXCJjcmVhdGVFbGVtZW50XCIsZnVuY3Rpb24oYSl7aWYodGhpcy5fX0NFX2hhc1JlZ2lzdHJ5KXt2YXIgZT1iLmEuZ2V0KGEpO2lmKGUpcmV0dXJuIG5ldyBlLmNvbnN0cnVjdG9yfWE9Ri5jYWxsKHRoaXMsYSk7dyhiLGEpO3JldHVybiBhfSk7cShEb2N1bWVudC5wcm90b3R5cGUsXCJpbXBvcnROb2RlXCIsZnVuY3Rpb24oYSxlKXthPWVhLmNhbGwodGhpcyxhLGUpO3RoaXMuX19DRV9oYXNSZWdpc3RyeT9BKGIsYSk6dihiLGEpO3JldHVybiBhfSk7cShEb2N1bWVudC5wcm90b3R5cGUsXCJjcmVhdGVFbGVtZW50TlNcIixmdW5jdGlvbihhLGUpe2lmKHRoaXMuX19DRV9oYXNSZWdpc3RyeSYmKG51bGw9PT1hfHxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIj09PWEpKXt2YXIgYz1iLmEuZ2V0KGUpO2lmKGMpcmV0dXJuIG5ldyBjLmNvbnN0cnVjdG9yfWE9ZGEuY2FsbCh0aGlzLGEsZSk7dyhiLGEpO3JldHVybiBhfSk7XG5wYShiLERvY3VtZW50LnByb3RvdHlwZSx7aTpmYSxhcHBlbmQ6Z2F9KX07ZnVuY3Rpb24gcmEoKXt2YXIgYj1ZO2Z1bmN0aW9uIGEoYSxjKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxcInRleHRDb250ZW50XCIse2VudW1lcmFibGU6Yy5lbnVtZXJhYmxlLGNvbmZpZ3VyYWJsZTohMCxnZXQ6Yy5nZXQsc2V0OmZ1bmN0aW9uKGEpe2lmKHRoaXMubm9kZVR5cGU9PT1Ob2RlLlRFWFRfTk9ERSljLnNldC5jYWxsKHRoaXMsYSk7ZWxzZXt2YXIgZD12b2lkIDA7aWYodGhpcy5maXJzdENoaWxkKXt2YXIgZT10aGlzLmNoaWxkTm9kZXMsdT1lLmxlbmd0aDtpZigwPHUmJmwodGhpcykpZm9yKHZhciBkPUFycmF5KHUpLHA9MDtwPHU7cCsrKWRbcF09ZVtwXX1jLnNldC5jYWxsKHRoaXMsYSk7aWYoZClmb3IoYT0wO2E8ZC5sZW5ndGg7YSsrKXooYixkW2FdKX19fSl9cShOb2RlLnByb3RvdHlwZSxcImluc2VydEJlZm9yZVwiLGZ1bmN0aW9uKGEsYyl7aWYoYSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhLmNoaWxkTm9kZXMpO1xuYT1JLmNhbGwodGhpcyxhLGMpO2lmKGwodGhpcykpZm9yKGM9MDtjPGQubGVuZ3RoO2MrKyl4KGIsZFtjXSk7cmV0dXJuIGF9ZD1sKGEpO2M9SS5jYWxsKHRoaXMsYSxjKTtkJiZ6KGIsYSk7bCh0aGlzKSYmeChiLGEpO3JldHVybiBjfSk7cShOb2RlLnByb3RvdHlwZSxcImFwcGVuZENoaWxkXCIsZnVuY3Rpb24oYSl7aWYoYSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpe3ZhciBjPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhLmNoaWxkTm9kZXMpO2E9SC5jYWxsKHRoaXMsYSk7aWYobCh0aGlzKSlmb3IodmFyIGQ9MDtkPGMubGVuZ3RoO2QrKyl4KGIsY1tkXSk7cmV0dXJuIGF9Yz1sKGEpO2Q9SC5jYWxsKHRoaXMsYSk7YyYmeihiLGEpO2wodGhpcykmJngoYixhKTtyZXR1cm4gZH0pO3EoTm9kZS5wcm90b3R5cGUsXCJjbG9uZU5vZGVcIixmdW5jdGlvbihhKXthPUcuY2FsbCh0aGlzLGEpO3RoaXMub3duZXJEb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5P0EoYixhKTp2KGIsYSk7XG5yZXR1cm4gYX0pO3EoTm9kZS5wcm90b3R5cGUsXCJyZW1vdmVDaGlsZFwiLGZ1bmN0aW9uKGEpe3ZhciBjPWwoYSksZD1KLmNhbGwodGhpcyxhKTtjJiZ6KGIsYSk7cmV0dXJuIGR9KTtxKE5vZGUucHJvdG90eXBlLFwicmVwbGFjZUNoaWxkXCIsZnVuY3Rpb24oYSxjKXtpZihhIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCl7dmFyIGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGEuY2hpbGROb2Rlcyk7YT1LLmNhbGwodGhpcyxhLGMpO2lmKGwodGhpcykpZm9yKHooYixjKSxjPTA7YzxkLmxlbmd0aDtjKyspeChiLGRbY10pO3JldHVybiBhfXZhciBkPWwoYSksZT1LLmNhbGwodGhpcyxhLGMpLGY9bCh0aGlzKTtmJiZ6KGIsYyk7ZCYmeihiLGEpO2YmJngoYixhKTtyZXR1cm4gZX0pO0wmJkwuZ2V0P2EoTm9kZS5wcm90b3R5cGUsTCk6dChiLGZ1bmN0aW9uKGIpe2EoYix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7Zm9yKHZhciBhPVtdLGI9XG4wO2I8dGhpcy5jaGlsZE5vZGVzLmxlbmd0aDtiKyspYS5wdXNoKHRoaXMuY2hpbGROb2Rlc1tiXS50ZXh0Q29udGVudCk7cmV0dXJuIGEuam9pbihcIlwiKX0sc2V0OmZ1bmN0aW9uKGEpe2Zvcig7dGhpcy5maXJzdENoaWxkOylKLmNhbGwodGhpcyx0aGlzLmZpcnN0Q2hpbGQpO0guY2FsbCh0aGlzLGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKX19KX0pfTtmdW5jdGlvbiBzYShiKXt2YXIgYT1FbGVtZW50LnByb3RvdHlwZTthLmJlZm9yZT1mdW5jdGlvbihhKXtmb3IodmFyIGM9W10sZD0wO2Q8YXJndW1lbnRzLmxlbmd0aDsrK2QpY1tkLTBdPWFyZ3VtZW50c1tkXTtkPWMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgTm9kZSYmbChhKX0pO2phLmFwcGx5KHRoaXMsYyk7Zm9yKHZhciBlPTA7ZTxkLmxlbmd0aDtlKyspeihiLGRbZV0pO2lmKGwodGhpcykpZm9yKGQ9MDtkPGMubGVuZ3RoO2QrKyllPWNbZF0sZSBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixlKX07YS5hZnRlcj1mdW5jdGlvbihhKXtmb3IodmFyIGM9W10sZD0wO2Q8YXJndW1lbnRzLmxlbmd0aDsrK2QpY1tkLTBdPWFyZ3VtZW50c1tkXTtkPWMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgTm9kZSYmbChhKX0pO2thLmFwcGx5KHRoaXMsYyk7Zm9yKHZhciBlPTA7ZTxkLmxlbmd0aDtlKyspeihiLGRbZV0pO2lmKGwodGhpcykpZm9yKGQ9XG4wO2Q8Yy5sZW5ndGg7ZCsrKWU9Y1tkXSxlIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGUpfTthLnJlcGxhY2VXaXRoPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxkPTA7ZDxhcmd1bWVudHMubGVuZ3RoOysrZCljW2QtMF09YXJndW1lbnRzW2RdO3ZhciBkPWMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgTm9kZSYmbChhKX0pLGU9bCh0aGlzKTtsYS5hcHBseSh0aGlzLGMpO2Zvcih2YXIgZj0wO2Y8ZC5sZW5ndGg7ZisrKXooYixkW2ZdKTtpZihlKWZvcih6KGIsdGhpcyksZD0wO2Q8Yy5sZW5ndGg7ZCsrKWU9Y1tkXSxlIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGUpfTthLnJlbW92ZT1mdW5jdGlvbigpe3ZhciBhPWwodGhpcyk7bWEuY2FsbCh0aGlzKTthJiZ6KGIsdGhpcyl9fTtmdW5jdGlvbiB0YSgpe3ZhciBiPVk7ZnVuY3Rpb24gYShhLGMpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLFwiaW5uZXJIVE1MXCIse2VudW1lcmFibGU6Yy5lbnVtZXJhYmxlLGNvbmZpZ3VyYWJsZTohMCxnZXQ6Yy5nZXQsc2V0OmZ1bmN0aW9uKGEpe3ZhciBkPXRoaXMsZT12b2lkIDA7bCh0aGlzKSYmKGU9W10sbih0aGlzLGZ1bmN0aW9uKGEpe2EhPT1kJiZlLnB1c2goYSl9KSk7Yy5zZXQuY2FsbCh0aGlzLGEpO2lmKGUpZm9yKHZhciBmPTA7ZjxlLmxlbmd0aDtmKyspe3ZhciBoPWVbZl07MT09PWguX19DRV9zdGF0ZSYmYi5kaXNjb25uZWN0ZWRDYWxsYmFjayhoKX10aGlzLm93bmVyRG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT9BKGIsdGhpcyk6dihiLHRoaXMpO3JldHVybiBhfX0pfWZ1bmN0aW9uIGUoYSxjKXtxKGEsXCJpbnNlcnRBZGphY2VudEVsZW1lbnRcIixmdW5jdGlvbihhLGQpe3ZhciBlPWwoZCk7YT1jLmNhbGwodGhpcyxhLGQpO2UmJnooYixkKTtsKGEpJiZ4KGIsZCk7XG5yZXR1cm4gYX0pfU0/cShFbGVtZW50LnByb3RvdHlwZSxcImF0dGFjaFNoYWRvd1wiLGZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9fQ0Vfc2hhZG93Um9vdD1hPU0uY2FsbCh0aGlzLGEpfSk6Y29uc29sZS53YXJuKFwiQ3VzdG9tIEVsZW1lbnRzOiBgRWxlbWVudCNhdHRhY2hTaGFkb3dgIHdhcyBub3QgcGF0Y2hlZC5cIik7aWYoTiYmTi5nZXQpYShFbGVtZW50LnByb3RvdHlwZSxOKTtlbHNlIGlmKFcmJlcuZ2V0KWEoSFRNTEVsZW1lbnQucHJvdG90eXBlLFcpO2Vsc2V7dmFyIGM9Ri5jYWxsKGRvY3VtZW50LFwiZGl2XCIpO3QoYixmdW5jdGlvbihiKXthKGIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBHLmNhbGwodGhpcywhMCkuaW5uZXJIVE1MfSxzZXQ6ZnVuY3Rpb24oYSl7dmFyIGI9XCJ0ZW1wbGF0ZVwiPT09dGhpcy5sb2NhbE5hbWU/dGhpcy5jb250ZW50OnRoaXM7Zm9yKGMuaW5uZXJIVE1MPWE7MDxiLmNoaWxkTm9kZXMubGVuZ3RoOylKLmNhbGwoYixcbmIuY2hpbGROb2Rlc1swXSk7Zm9yKDswPGMuY2hpbGROb2Rlcy5sZW5ndGg7KUguY2FsbChiLGMuY2hpbGROb2Rlc1swXSl9fSl9KX1xKEVsZW1lbnQucHJvdG90eXBlLFwic2V0QXR0cmlidXRlXCIsZnVuY3Rpb24oYSxjKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBRLmNhbGwodGhpcyxhLGMpO3ZhciBkPU8uY2FsbCh0aGlzLGEpO1EuY2FsbCh0aGlzLGEsYyk7Yz1PLmNhbGwodGhpcyxhKTtkIT09YyYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcyxhLGQsYyxudWxsKX0pO3EoRWxlbWVudC5wcm90b3R5cGUsXCJzZXRBdHRyaWJ1dGVOU1wiLGZ1bmN0aW9uKGEsYyxlKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBULmNhbGwodGhpcyxhLGMsZSk7dmFyIGQ9Uy5jYWxsKHRoaXMsYSxjKTtULmNhbGwodGhpcyxhLGMsZSk7ZT1TLmNhbGwodGhpcyxhLGMpO2QhPT1lJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGMsZCxlLGEpfSk7cShFbGVtZW50LnByb3RvdHlwZSxcblwicmVtb3ZlQXR0cmlidXRlXCIsZnVuY3Rpb24oYSl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gUi5jYWxsKHRoaXMsYSk7dmFyIGM9Ty5jYWxsKHRoaXMsYSk7Ui5jYWxsKHRoaXMsYSk7bnVsbCE9PWMmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYSxjLG51bGwsbnVsbCl9KTtxKEVsZW1lbnQucHJvdG90eXBlLFwicmVtb3ZlQXR0cmlidXRlTlNcIixmdW5jdGlvbihhLGMpe2lmKDEhPT10aGlzLl9fQ0Vfc3RhdGUpcmV0dXJuIFUuY2FsbCh0aGlzLGEsYyk7dmFyIGQ9Uy5jYWxsKHRoaXMsYSxjKTtVLmNhbGwodGhpcyxhLGMpO3ZhciBlPVMuY2FsbCh0aGlzLGEsYyk7ZCE9PWUmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYyxkLGUsYSl9KTtYP2UoSFRNTEVsZW1lbnQucHJvdG90eXBlLFgpOlY/ZShFbGVtZW50LnByb3RvdHlwZSxWKTpjb25zb2xlLndhcm4oXCJDdXN0b20gRWxlbWVudHM6IGBFbGVtZW50I2luc2VydEFkamFjZW50RWxlbWVudGAgd2FzIG5vdCBwYXRjaGVkLlwiKTtcbnBhKGIsRWxlbWVudC5wcm90b3R5cGUse2k6aGEsYXBwZW5kOmlhfSk7c2EoYil9O1xudmFyIFo9d2luZG93LmN1c3RvbUVsZW1lbnRzO2lmKCFafHxaLmZvcmNlUG9seWZpbGx8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIFouZGVmaW5lfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBaLmdldCl7dmFyIFk9bmV3IHI7b2EoKTtxYSgpO3JhKCk7dGEoKTtkb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5PSEwO3ZhciB1YT1uZXcgRShZKTtPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LFwiY3VzdG9tRWxlbWVudHNcIix7Y29uZmlndXJhYmxlOiEwLGVudW1lcmFibGU6ITAsdmFsdWU6dWF9KX07XG59KS5jYWxsKHNlbGYpO1xufVxuLy8gQGxpY2Vuc2UgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuXG5cbmZ1bmN0aW9uIHByb21pc2VQb2x5ZmlsbCAoKSB7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGF5bG9yaGFrZXMvcHJvbWlzZS1wb2x5ZmlsbC9ibG9iL21hc3Rlci9wcm9taXNlLmpzXG52YXIgc2V0VGltZW91dEZ1bmMgPSBzZXRUaW1lb3V0O1xuZnVuY3Rpb24gbm9vcCgpIHt9XG5mdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG5yZXR1cm4gZnVuY3Rpb24gKCkge1xuZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbn07XG59XG5mdW5jdGlvbiBQcm9taXNlKGZuKSB7XG5pZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbmlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG50aGlzLl9zdGF0ZSA9IDA7XG50aGlzLl9oYW5kbGVkID0gZmFsc2U7XG50aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbnRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG5kb1Jlc29sdmUoZm4sIHRoaXMpO1xufVxuZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG53aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbnNlbGYgPSBzZWxmLl92YWx1ZTtcbn1cbmlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xucmV0dXJuO1xufVxuc2VsZi5faGFuZGxlZCA9IHRydWU7XG5Qcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbiAoKSB7XG52YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbmlmIChjYiA9PT0gbnVsbCkge1xuKHNlbGYuX3N0YXRlID09PSAxID8gcmVzb2x2ZSA6IHJlamVjdCkoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fdmFsdWUpO1xucmV0dXJuO1xufVxudmFyIHJldDtcbnRyeSB7XG5yZXQgPSBjYihzZWxmLl92YWx1ZSk7XG59IGNhdGNoIChlKSB7XG5yZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG5yZXR1cm47XG59XG5yZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG59KTtcbn1cbmZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbnRyeSB7XG4vLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpO1xuaWYgKG5ld1ZhbHVlICYmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbnZhciB0aGVuID0gbmV3VmFsdWUudGhlbjtcbmlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbnNlbGYuX3N0YXRlID0gMztcbnNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG5maW5hbGUoc2VsZik7XG5yZXR1cm47XG59IGVsc2UgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG5kb1Jlc29sdmUoYmluZCh0aGVuLCBuZXdWYWx1ZSksIHNlbGYpO1xucmV0dXJuO1xufVxufVxuc2VsZi5fc3RhdGUgPSAxO1xuc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbmZpbmFsZShzZWxmKTtcbn0gY2F0Y2ggKGUpIHtcbnJlamVjdChzZWxmLCBlKTtcbn1cbn1cbmZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuc2VsZi5fc3RhdGUgPSAyO1xuc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbmZpbmFsZShzZWxmKTtcbn1cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG5pZiAoc2VsZi5fc3RhdGUgPT09IDIgJiYgc2VsZi5fZGVmZXJyZWRzLmxlbmd0aCA9PT0gMCkge1xuUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG5pZiAoIXNlbGYuX2hhbmRsZWQpIHtcblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuKHNlbGYuX3ZhbHVlKTtcbn1cbn0pO1xufVxuXG5mb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5fZGVmZXJyZWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5oYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbn1cbnNlbGYuX2RlZmVycmVkcyA9IG51bGw7XG59XG5mdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKSB7XG50aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xudGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbnRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5mdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHNlbGYpIHtcbnZhciBkb25lID0gZmFsc2U7XG50cnkge1xuZm4oZnVuY3Rpb24gKHZhbHVlKSB7XG5pZiAoZG9uZSkgcmV0dXJuO1xuZG9uZSA9IHRydWU7XG5yZXNvbHZlKHNlbGYsIHZhbHVlKTtcbn0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbmlmIChkb25lKSByZXR1cm47XG5kb25lID0gdHJ1ZTtcbnJlamVjdChzZWxmLCByZWFzb24pO1xufSk7XG59IGNhdGNoIChleCkge1xuaWYgKGRvbmUpIHJldHVybjtcbmRvbmUgPSB0cnVlO1xucmVqZWN0KHNlbGYsIGV4KTtcbn1cbn1cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbnJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG59O1xuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xudmFyIHByb20gPSBuZXcgKHRoaXMuY29uc3RydWN0b3IpKG5vb3ApO1xuXG5oYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb20pKTtcbnJldHVybiBwcm9tO1xufTtcblByb21pc2UuYWxsID0gZnVuY3Rpb24gKGFycikge1xudmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xucmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbmlmIChhcmdzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc29sdmUoW10pO1xudmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG5mdW5jdGlvbiByZXMoaSwgdmFsKSB7XG50cnkge1xuaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbnZhciB0aGVuID0gdmFsLnRoZW47XG5pZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbnRoZW4uY2FsbCh2YWwsIGZ1bmN0aW9uICh2YWwpIHtcbnJlcyhpLCB2YWwpO1xufSwgcmVqZWN0KTtcbnJldHVybjtcbn1cbn1cbmFyZ3NbaV0gPSB2YWw7XG5pZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbnJlc29sdmUoYXJncyk7XG59XG59IGNhdGNoIChleCkge1xucmVqZWN0KGV4KTtcbn1cbn1cblxuZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5yZXMoaSwgYXJnc1tpXSk7XG59XG59KTtcbn07XG5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbmlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG5yZXR1cm4gdmFsdWU7XG59XG5cbnJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xucmVzb2x2ZSh2YWx1ZSk7XG59KTtcbn07XG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xucmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbnJlamVjdCh2YWx1ZSk7XG59KTtcbn07XG5Qcm9taXNlLnJhY2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG5yZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xudmFsdWVzW2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbn1cbn0pO1xufTtcblByb21pc2UuX2ltbWVkaWF0ZUZuID0gKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiYgZnVuY3Rpb24gKGZuKSB7IHNldEltbWVkaWF0ZShmbik7IH0pIHx8XG5mdW5jdGlvbiAoZm4pIHtcbnNldFRpbWVvdXRGdW5jKGZuLCAwKTtcbn07XG5Qcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbiA9IGZ1bmN0aW9uIF91bmhhbmRsZWRSZWplY3Rpb25GbihlcnIpIHtcbmlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSkge1xuY29uc29sZS53YXJuKCdQb3NzaWJsZSBVbmhhbmRsZWQgUHJvbWlzZSBSZWplY3Rpb246JywgZXJyKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG59XG59O1xuUHJvbWlzZS5fc2V0SW1tZWRpYXRlRm4gPSBmdW5jdGlvbiBfc2V0SW1tZWRpYXRlRm4oZm4pIHtcblByb21pc2UuX2ltbWVkaWF0ZUZuID0gZm47XG59O1xuUHJvbWlzZS5fc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm4oZm4pIHtcblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZm47XG59O1xuY29uc29sZS5sb2coJ1Byb21pc2UgcG9seWZpbGwnKTtcbndpbmRvdy5Qcm9taXNlID0gUHJvbWlzZTtcbn1cbiIsIi8vIENsdWIgQUpBWCBHZW5lcmFsIFB1cnBvc2UgQ29kZVxuLy9cbi8vIFJhbmRvbWl6ZXJcbi8vXG4vLyBhdXRob3I6XG4vLyAgICAgICAgICAgICAgTWlrZSBXaWxjb3hcbi8vIHNpdGU6XG4vLyAgICAgICAgICAgICAgaHR0cDovL2NsdWJhamF4Lm9yZ1xuLy8gc3VwcG9ydDpcbi8vICAgICAgICAgICAgICBodHRwOi8vZ3JvdXBzLmdvb2dsZS5jb20vZ3JvdXAvY2x1YmFqYXhcbi8vXG4vLyBjbHViYWpheC5sYW5nLnJhbmRcbi8vXG4vLyAgICAgIERFU0NSSVBUSU9OOlxuLy8gICAgICAgICAgICAgIEEgcmFuZG9taXplciBsaWJyYXJ5IHRoYXQncyBncmVhdCBmb3IgcHJvZHVjaW5nIG1vY2sgZGF0YS5cbi8vICAgICAgICAgICAgICBBbGxvd3MgZG96ZW5zIG9mIHdheXMgdG8gcmFuZG9taXplIG51bWJlcnMsIHN0cmluZ3MsIHdvcmRzLFxuLy8gICAgICAgICAgICAgIHNlbnRlbmNlcywgYW5kIGRhdGVzLiBJbmNsdWRlcyB0aW55IGxpYnJhcmllcyBvZiB0aGUgbW9zdFxuLy8gICAgICAgICAgICAgIGNvbW1vbmx5IHVzZWQgd29yZHMgKGluIG9yZGVyKSwgdGhlIG1vc3QgY29tbW9ubHkgdXNlZCBsZXR0ZXJzXG4vLyAgICAgICAgICAgICAgKGluIG9yZGVyKSBhbmQgcGVyc29uYWwgbmFtZXMgdGhhdCBjYW4gYmUgdXNlZCBhcyBmaXJzdCBvciBsYXN0LlxuLy8gICAgICAgICAgICAgIEZvciBtYWtpbmcgc2VudGVuY2VzLCBcInd1cmRzXCIgYXJlIHVzZWQgLSB3b3JkcyB3aXRoIHNjcmFtYmxlZCB2b3dlbHNcbi8vICAgICAgICAgICAgICBzbyB0aGV5IGFyZW4ndCBhY3R1YWwgd29yZHMsIGJ1dCBsb29rIG1vcmUgbGlrZSBsb3JlbSBpcHN1bS4gQ2hhbmdlIHRoZVxuLy8gICAgICAgICAgICAgIHByb3BlcnR5IHJlYWwgdG8gdHJ1ZSB0byB1c2UgXCJ3b3Jkc1wiIGluc3RlYWQgb2YgXCJ3dXJkc1wiIChpdCBjYW5cbi8vICAgICAgICAgICAgICBhbHNvIHByb2R1Y2UgaHVtb3JvdXMgcmVzdWx0cykuXG5cbi8vICAgICAgVVNBR0U6XG4vLyAgICAgICAgICAgICAgaW5jbHVkZSBmaWxlOlxuLy8gICAgICAgICAgICAgICAgICAgICAgPHNjcmlwdCBzcmM9XCJjbHViYWpheC9sYW5nL3JhbmQuanNcIj48L3NjcmlwdD5cbi8vXG4vLyBURVNUUzpcbi8vICAgICAgICAgICAgICBTZWUgdGVzdHMvcmFuZC5odG1sXG4vL1xuLyogVU1ELmRlZmluZSAqLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCl7IGRlZmluZShbXSwgZmFjdG9yeSk7IH1lbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jyl7IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpOyB9ZWxzZXsgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpOyB3aW5kb3cucmFuZCA9IGZhY3RvcnkoKTsgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdFxuXHR2YXJcblx0XHRyYW5kLFxuXHRcdGNpdHlTdGF0ZXMgPSBbXCJOZXcgWW9yaywgTmV3IFlvcmtcIiwgXCJMb3MgQW5nZWxlcywgQ2FsaWZvcm5pYVwiLCBcIkNoaWNhZ28sIElsbGlub2lzXCIsIFwiSG91c3RvbiwgVGV4YXNcIiwgXCJQaGlsYWRlbHBoaWEsIFBlbm5zeWx2YW5pYVwiLCBcIlBob2VuaXgsIEFyaXpvbmFcIiwgXCJTYW4gRGllZ28sIENhbGlmb3JuaWFcIiwgXCJTYW4gQW50b25pbywgVGV4YXNcIiwgXCJEYWxsYXMsIFRleGFzXCIsIFwiRGV0cm9pdCwgTWljaGlnYW5cIiwgXCJTYW4gSm9zZSwgQ2FsaWZvcm5pYVwiLCBcIkluZGlhbmFwb2xpcywgSW5kaWFuYVwiLCBcIkphY2tzb252aWxsZSwgRmxvcmlkYVwiLCBcIlNhbiBGcmFuY2lzY28sIENhbGlmb3JuaWFcIiwgXCJDb2x1bWJ1cywgT2hpb1wiLCBcIkF1c3RpbiwgVGV4YXNcIiwgXCJNZW1waGlzLCBUZW5uZXNzZWVcIiwgXCJCYWx0aW1vcmUsIE1hcnlsYW5kXCIsIFwiQ2hhcmxvdHRlLCBOb3J0aCBDYXJvbGluYVwiLCBcIkZvcnQgV29ydGgsIFRleGFzXCIsIFwiQm9zdG9uLCBNYXNzYWNodXNldHRzXCIsIFwiTWlsd2F1a2VlLCBXaXNjb25zaW5cIiwgXCJFbCBQYXNvLCBUZXhhc1wiLCBcIldhc2hpbmd0b24sIERpc3RyaWN0IG9mIENvbHVtYmlhXCIsIFwiTmFzaHZpbGxlLURhdmlkc29uLCBUZW5uZXNzZWVcIiwgXCJTZWF0dGxlLCBXYXNoaW5ndG9uXCIsIFwiRGVudmVyLCBDb2xvcmFkb1wiLCBcIkxhcyBWZWdhcywgTmV2YWRhXCIsIFwiUG9ydGxhbmQsIE9yZWdvblwiLCBcIk9rbGFob21hIENpdHksIE9rbGFob21hXCIsIFwiVHVjc29uLCBBcml6b25hXCIsIFwiQWxidXF1ZXJxdWUsIE5ldyBNZXhpY29cIiwgXCJBdGxhbnRhLCBHZW9yZ2lhXCIsIFwiTG9uZyBCZWFjaCwgQ2FsaWZvcm5pYVwiLCBcIkthbnNhcyBDaXR5LCBNaXNzb3VyaVwiLCBcIkZyZXNubywgQ2FsaWZvcm5pYVwiLCBcIk5ldyBPcmxlYW5zLCBMb3Vpc2lhbmFcIiwgXCJDbGV2ZWxhbmQsIE9oaW9cIiwgXCJTYWNyYW1lbnRvLCBDYWxpZm9ybmlhXCIsIFwiTWVzYSwgQXJpem9uYVwiLCBcIlZpcmdpbmlhIEJlYWNoLCBWaXJnaW5pYVwiLCBcIk9tYWhhLCBOZWJyYXNrYVwiLCBcIkNvbG9yYWRvIFNwcmluZ3MsIENvbG9yYWRvXCIsIFwiT2FrbGFuZCwgQ2FsaWZvcm5pYVwiLCBcIk1pYW1pLCBGbG9yaWRhXCIsIFwiVHVsc2EsIE9rbGFob21hXCIsIFwiTWlubmVhcG9saXMsIE1pbm5lc290YVwiLCBcIkhvbm9sdWx1LCBIYXdhaWlcIiwgXCJBcmxpbmd0b24sIFRleGFzXCIsIFwiV2ljaGl0YSwgS2Fuc2FzXCIsIFwiU3QuIExvdWlzLCBNaXNzb3VyaVwiLCBcIlJhbGVpZ2gsIE5vcnRoIENhcm9saW5hXCIsIFwiU2FudGEgQW5hLCBDYWxpZm9ybmlhXCIsIFwiQ2luY2lubmF0aSwgT2hpb1wiLCBcIkFuYWhlaW0sIENhbGlmb3JuaWFcIiwgXCJUYW1wYSwgRmxvcmlkYVwiLCBcIlRvbGVkbywgT2hpb1wiLCBcIlBpdHRzYnVyZ2gsIFBlbm5zeWx2YW5pYVwiLCBcIkF1cm9yYSwgQ29sb3JhZG9cIiwgXCJCYWtlcnNmaWVsZCwgQ2FsaWZvcm5pYVwiLCBcIlJpdmVyc2lkZSwgQ2FsaWZvcm5pYVwiLCBcIlN0b2NrdG9uLCBDYWxpZm9ybmlhXCIsIFwiQ29ycHVzIENocmlzdGksIFRleGFzXCIsIFwiTGV4aW5ndG9uLUZheWV0dGUsIEtlbnR1Y2t5XCIsIFwiQnVmZmFsbywgTmV3IFlvcmtcIiwgXCJTdC4gUGF1bCwgTWlubmVzb3RhXCIsIFwiQW5jaG9yYWdlLCBBbGFza2FcIiwgXCJOZXdhcmssIE5ldyBKZXJzZXlcIiwgXCJQbGFubywgVGV4YXNcIiwgXCJGb3J0IFdheW5lLCBJbmRpYW5hXCIsIFwiU3QuIFBldGVyc2J1cmcsIEZsb3JpZGFcIiwgXCJHbGVuZGFsZSwgQXJpem9uYVwiLCBcIkxpbmNvbG4sIE5lYnJhc2thXCIsIFwiTm9yZm9saywgVmlyZ2luaWFcIiwgXCJKZXJzZXkgQ2l0eSwgTmV3IEplcnNleVwiLCBcIkdyZWVuc2Jvcm8sIE5vcnRoIENhcm9saW5hXCIsIFwiQ2hhbmRsZXIsIEFyaXpvbmFcIiwgXCJCaXJtaW5naGFtLCBBbGFiYW1hXCIsIFwiSGVuZGVyc29uLCBOZXZhZGFcIiwgXCJTY290dHNkYWxlLCBBcml6b25hXCIsIFwiTm9ydGggSGVtcHN0ZWFkLCBOZXcgWW9ya1wiLCBcIk1hZGlzb24sIFdpc2NvbnNpblwiLCBcIkhpYWxlYWgsIEZsb3JpZGFcIiwgXCJCYXRvbiBSb3VnZSwgTG91aXNpYW5hXCIsIFwiQ2hlc2FwZWFrZSwgVmlyZ2luaWFcIiwgXCJPcmxhbmRvLCBGbG9yaWRhXCIsIFwiTHViYm9jaywgVGV4YXNcIiwgXCJHYXJsYW5kLCBUZXhhc1wiLCBcIkFrcm9uLCBPaGlvXCIsIFwiUm9jaGVzdGVyLCBOZXcgWW9ya1wiLCBcIkNodWxhIFZpc3RhLCBDYWxpZm9ybmlhXCIsIFwiUmVubywgTmV2YWRhXCIsIFwiTGFyZWRvLCBUZXhhc1wiLCBcIkR1cmhhbSwgTm9ydGggQ2Fyb2xpbmFcIiwgXCJNb2Rlc3RvLCBDYWxpZm9ybmlhXCIsIFwiSHVudGluZ3RvbiwgTmV3IFlvcmtcIiwgXCJNb250Z29tZXJ5LCBBbGFiYW1hXCIsIFwiQm9pc2UsIElkYWhvXCIsIFwiQXJsaW5ndG9uLCBWaXJnaW5pYVwiLCBcIlNhbiBCZXJuYXJkaW5vLCBDYWxpZm9ybmlhXCJdLFxuXHRcdHN0cmVldFN1ZmZpeGVzID0gJ1JvYWQsRHJpdmUsQXZlbnVlLEJsdmQsTGFuZSxTdHJlZXQsV2F5LENpcmNsZScuc3BsaXQoJywnKSxcblx0XHRzdHJlZXRzID0gXCJGaXJzdCxGb3VydGgsUGFyayxGaWZ0aCxNYWluLFNpeHRoLE9hayxTZXZlbnRoLFBpbmUsTWFwbGUsQ2VkYXIsRWlnaHRoLEVsbSxWaWV3LFdhc2hpbmd0b24sTmludGgsTGFrZSxIaWxsLEhpZ2gsU3RhdGlvbixNYWluLFBhcmssQ2h1cmNoLENodXJjaCxMb25kb24sVmljdG9yaWEsR3JlZW4sTWFub3IsQ2h1cmNoLFBhcmssVGhlIENyZXNjZW50LFF1ZWVucyxOZXcsR3JhbmdlLEtpbmdzLEtpbmdzd2F5LFdpbmRzb3IsSGlnaGZpZWxkLE1pbGwsQWxleGFuZGVyLFlvcmssU3QuIEpvaG5cXCdzLE1haW4sQnJvYWR3YXksS2luZyxUaGUgR3JlZW4sU3ByaW5nZmllbGQsR2VvcmdlLFBhcmssVmljdG9yaWEsQWxiZXJ0LFF1ZWVuc3dheSxOZXcsUXVlZW4sV2VzdCxOb3J0aCxNYW5jaGVzdGVyLFRoZSBHcm92ZSxSaWNobW9uZCxHcm92ZSxTb3V0aCxTY2hvb2wsTm9ydGgsU3RhbmxleSxDaGVzdGVyLE1pbGwsXCIuc3BsaXQoJywnKSxcblx0XHRzdGF0ZXMgPSBbXCJBbGFiYW1hXCIsIFwiQWxhc2thXCIsIFwiQW1lcmljYW4gU2Ftb2FcIiwgXCJBcml6b25hXCIsIFwiQXJrYW5zYXNcIiwgXCJBcm1lZCBGb3JjZXMgRXVyb3BlXCIsIFwiQXJtZWQgRm9yY2VzIFBhY2lmaWNcIiwgXCJBcm1lZCBGb3JjZXMgdGhlIEFtZXJpY2FzXCIsIFwiQ2FsaWZvcm5pYVwiLCBcIkNvbG9yYWRvXCIsIFwiQ29ubmVjdGljdXRcIiwgXCJEZWxhd2FyZVwiLCBcIkRpc3RyaWN0IG9mIENvbHVtYmlhXCIsIFwiRmVkZXJhdGVkIFN0YXRlcyBvZiBNaWNyb25lc2lhXCIsIFwiRmxvcmlkYVwiLCBcIkdlb3JnaWFcIiwgXCJHdWFtXCIsIFwiSGF3YWlpXCIsIFwiSWRhaG9cIiwgXCJJbGxpbm9pc1wiLCBcIkluZGlhbmFcIiwgXCJJb3dhXCIsIFwiS2Fuc2FzXCIsIFwiS2VudHVja3lcIiwgXCJMb3Vpc2lhbmFcIiwgXCJNYWluZVwiLCBcIk1hcnNoYWxsIElzbGFuZHNcIiwgXCJNYXJ5bGFuZFwiLCBcIk1hc3NhY2h1c2V0dHNcIiwgXCJNaWNoaWdhblwiLCBcIk1pbm5lc290YVwiLCBcIk1pc3Npc3NpcHBpXCIsIFwiTWlzc291cmlcIiwgXCJNb250YW5hXCIsIFwiTmVicmFza2FcIiwgXCJOZXZhZGFcIiwgXCJOZXcgSGFtcHNoaXJlXCIsIFwiTmV3IEplcnNleVwiLCBcIk5ldyBNZXhpY29cIiwgXCJOZXcgWW9ya1wiLCBcIk5vcnRoIENhcm9saW5hXCIsIFwiTm9ydGggRGFrb3RhXCIsIFwiTm9ydGhlcm4gTWFyaWFuYSBJc2xhbmRzXCIsIFwiT2hpb1wiLCBcIk9rbGFob21hXCIsIFwiT3JlZ29uXCIsIFwiUGVubnN5bHZhbmlhXCIsIFwiUHVlcnRvIFJpY29cIiwgXCJSaG9kZSBJc2xhbmRcIiwgXCJTb3V0aCBDYXJvbGluYVwiLCBcIlNvdXRoIERha290YVwiLCBcIlRlbm5lc3NlZVwiLCBcIlRleGFzXCIsIFwiVXRhaFwiLCBcIlZlcm1vbnRcIiwgXCJWaXJnaW4gSXNsYW5kcywgVS5TLlwiLCBcIlZpcmdpbmlhXCIsIFwiV2FzaGluZ3RvblwiLCBcIldlc3QgVmlyZ2luaWFcIiwgXCJXaXNjb25zaW5cIiwgXCJXeW9taW5nXCJdLFxuXHRcdHN0YXRlQWJiciA9IFtcIkFMXCIsIFwiQUtcIiwgXCJBU1wiLCBcIkFaXCIsIFwiQVJcIiwgXCJBRVwiLCBcIkFQXCIsIFwiQUFcIiwgXCJDQVwiLCBcIkNPXCIsIFwiQ1RcIiwgXCJERVwiLCBcIkRDXCIsIFwiRk1cIiwgXCJGTFwiLCBcIkdBXCIsIFwiR1VcIiwgXCJISVwiLCBcIklEXCIsIFwiSUxcIiwgXCJJTlwiLCBcIklBXCIsIFwiS1NcIiwgXCJLWVwiLCBcIkxBXCIsIFwiTUVcIiwgXCJNSFwiLCBcIk1EXCIsIFwiTUFcIiwgXCJNSVwiLCBcIk1OXCIsIFwiTVNcIiwgXCJNT1wiLCBcIk1UXCIsIFwiTkVcIiwgXCJOVlwiLCBcIk5IXCIsIFwiTkpcIiwgXCJOTVwiLCBcIk5ZXCIsIFwiTkNcIiwgXCJORFwiLCBcIk1QXCIsIFwiT0hcIiwgXCJPS1wiLCBcIk9SXCIsIFwiUEFcIiwgXCJQUlwiLCBcIlJJXCIsIFwiU0NcIiwgXCJTRFwiLCBcIlROXCIsIFwiVFhcIiwgXCJVVFwiLCBcIlZUXCIsIFwiVklcIiwgXCJWQVwiLCBcIldBXCIsIFwiV1ZcIiwgXCJXSVwiLCBcIldZXCJdLFxuXHRcdG5hbWVzID0gXCJBYnJhaGFtLEFsYmVydCxBbGV4aXMsQWxsZW4sQWxsaXNvbixBbGV4YW5kZXIsQW1vcyxBbnRvbixBcm5vbGQsQXJ0aHVyLEFzaGxleSxCYXJyeSxCZWxpbmRhLEJlbGxlLEJlbmphbWluLEJlbm55LEJlcm5hcmQsQnJhZGxleSxCcmV0dCxUeSxCcml0dGFueSxCcnVjZSxCcnlhbnQsQ2FycmV5LENhcm1lbixDYXJyb2xsLENoYXJsZXMsQ2hyaXN0b3BoZXIsQ2hyaXN0aWUsQ2xhcmssQ2xheSxDbGlmZixDb25yYWQsQ3JhaWcsQ3J5c3RhbCxDdXJ0aXMsRGFtb24sRGFuYSxEYXZpZCxEZWFuLERlZSxEZW5uaXMsRGVubnksRGljayxEb3VnbGFzLER1bmNhbixEd2lnaHQsRHlsYW4sRWRkeSxFbGxpb3QsRXZlcmV0dCxGYXllLEZyYW5jaXMsRnJhbmssRnJhbmtsaW4sR2FydGgsR2F5bGUsR2VvcmdlLEdpbGJlcnQsR2xlbm4sR29yZG9uLEdyYWNlLEdyYWhhbSxHcmFudCxHcmVnb3J5LEdvdHRmcmllZCxHdXksSGFycmlzb24sSGFycnksSGFydmV5LEhlbnJ5LEhlcmJlcnQsSGlsbGFyeSxIb2xseSxIb3BlLEhvd2FyZCxIdWdvLEh1bXBocmV5LElydmluZyxJc2FhayxKYW5pcyxKYXksSm9lbCxKb2huLEpvcmRhbixKb3ljZSxKdWFuLEp1ZGQsSnVsaWEsS2F5ZSxLZWxseSxLZWl0aCxMYXVyaWUsTGF3cmVuY2UsTGVlLExlaWdoLExlb25hcmQsTGVzbGllLExlc3RlcixMZXdpcyxMaWxseSxMbG95ZCxHZW9yZ2UsTG91aXMsTG91aXNlLEx1Y2FzLEx1dGhlcixMeW5uLE1hY2ssTWFyaWUsTWFyc2hhbGwsTWFydGluLE1hcnZpbixNYXksTWljaGFlbCxNaWNoZWxsZSxNaWx0b24sTWlyYW5kYSxNaXRjaGVsbCxNb3JnYW4sTW9ycmlzLE11cnJheSxOZXd0b24sTm9ybWFuLE93ZW4sUGF0cmljayxQYXR0aSxQYXVsLFBlbm55LFBlcnJ5LFByZXN0b24sUXVpbm4sUmF5LFJpY2gsUmljaGFyZCxSb2xhbmQsUm9zZSxSb3NzLFJveSxSdWJ5LFJ1c3NlbGwsUnV0aCxSeWFuLFNjb3R0LFNleW1vdXIsU2hhbm5vbixTaGF3bixTaGVsbGV5LFNoZXJtYW4sU2ltb24sU3RhbmxleSxTdGV3YXJ0LFN1c2FubixTeWRuZXksVGF5bG9yLFRob21hcyxUb2RkLFRvbSxUcmFjeSxUcmF2aXMsVHlsZXIsVHlsZXIsVmluY2VudCxXYWxsYWNlLFdhbHRlcixQZW5uLFdheW5lLFdpbGwsV2lsbGFyZCxXaWxsaXNcIixcblx0XHR3b3JkcyA9IFwidGhlLG9mLGFuZCxhLHRvLGluLGlzLHlvdSx0aGF0LGl0LGhlLGZvcix3YXMsb24sYXJlLGFzLHdpdGgsaGlzLHRoZXksYXQsYmUsdGhpcyxmcm9tLEksaGF2ZSxvcixieSxvbmUsaGFkLG5vdCxidXQsd2hhdCxhbGwsd2VyZSx3aGVuLHdlLHRoZXJlLGNhbixhbix5b3VyLHdoaWNoLHRoZWlyLHNhaWQsaWYsZG8sd2lsbCxlYWNoLGFib3V0LGhvdyx1cCxvdXQsdGhlbSx0aGVuLHNoZSxtYW55LHNvbWUsc28sdGhlc2Usd291bGQsb3RoZXIsaW50byxoYXMsbW9yZSxoZXIsdHdvLGxpa2UsaGltLHNlZSx0aW1lLGNvdWxkLG5vLG1ha2UsdGhhbixmaXJzdCxiZWVuLGl0cyx3aG8sbm93LHBlb3BsZSxteSxtYWRlLG92ZXIsZGlkLGRvd24sb25seSx3YXksZmluZCx1c2UsbWF5LHdhdGVyLGxvbmcsbGl0dGxlLHZlcnksYWZ0ZXIsd29yZHMsY2FsbGVkLGp1c3Qsd2hlcmUsbW9zdCxrbm93LGdldCx0aHJvdWdoLGJhY2ssbXVjaCxiZWZvcmUsZ28sZ29vZCxuZXcsd3JpdGUsb3V0LHVzZWQsbWUsbWFuLHRvbyxhbnksZGF5LHNhbWUscmlnaHQsbG9vayx0aGluayxhbHNvLGFyb3VuZCxhbm90aGVyLGNhbWUsY29tZSx3b3JrLHRocmVlLHdvcmQsbXVzdCxiZWNhdXNlLGRvZXMscGFydCxldmVuLHBsYWNlLHdlbGwsc3VjaCxoZXJlLHRha2Usd2h5LHRoaW5ncyxoZWxwLHB1dCx5ZWFycyxkaWZmZXJlbnQsYXdheSxhZ2FpbixvZmYsd2VudCxvbGQsbnVtYmVyLGdyZWF0LHRlbGwsbWVuLHNheSxzbWFsbCxldmVyeSxmb3VuZCxzdGlsbCxiZXR3ZWVuLG5hbWUsc2hvdWxkLGhvbWUsYmlnLGdpdmUsYWlyLGxpbmUsc2V0LG93bix1bmRlcixyZWFkLGxhc3QsbmV2ZXIsdXMsbGVmdCxlbmQsYWxvbmcsd2hpbGUsbWlnaHQsbmV4dCxzb3VuZCxiZWxvdyxzYXcsc29tZXRoaW5nLHRob3VnaHQsYm90aCxmZXcsdGhvc2UsYWx3YXlzLGxvb2tlZCxzaG93LGxhcmdlLG9mdGVuLHRvZ2V0aGVyLGFza2VkLGhvdXNlLGRvbid0LHdvcmxkLGdvaW5nLHdhbnQsc2Nob29sLGltcG9ydGFudCx1bnRpbCxmb3JtLGZvb2Qsa2VlcCxjaGlsZHJlbixmZWV0LGxhbmQsc2lkZSx3aXRob3V0LGJveSxvbmNlLGFuaW1hbHMsbGlmZSxlbm91Z2gsdG9vayxzb21ldGltZXMsZm91cixoZWFkLGFib3ZlLGtpbmQsYmVnYW4sYWxtb3N0LGxpdmUscGFnZSxnb3QsZWFydGgsbmVlZCxmYXIsaGFuZCxoaWdoLHllYXIsbW90aGVyLGxpZ2h0LHBhcnRzLGNvdW50cnksZmF0aGVyLGxldCxuaWdodCxmb2xsb3dpbmcscGljdHVyZSxiZWluZyxzdHVkeSxzZWNvbmQsZXllcyxzb29uLHRpbWVzLHN0b3J5LGJveXMsc2luY2Usd2hpdGUsZGF5cyxldmVyLHBhcGVyLGhhcmQsbmVhcixzZW50ZW5jZSxiZXR0ZXIsYmVzdCxhY3Jvc3MsZHVyaW5nLHRvZGF5LG90aGVycyxob3dldmVyLHN1cmUsbWVhbnMsa25ldyxpdHMsdHJ5LHRvbGQseW91bmcsbWlsZXMsc3VuLHdheXMsdGhpbmcsd2hvbGUsaGVhcixleGFtcGxlLGhlYXJkLHNldmVyYWwsY2hhbmdlLGFuc3dlcixyb29tLHNlYSxhZ2FpbnN0LHRvcCx0dXJuZWQsbGVhcm4scG9pbnQsY2l0eSxwbGF5LHRvd2FyZCxmaXZlLHVzaW5nLGhpbXNlbGYsdXN1YWxseVwiLFxuXHRcdGxldHRlcnMgPSAoXCJldGFvbmlzcmhsZGNtdWZwZ3d5YnZranhxelwiKS5zcGxpdChcIlwiKSxcblx0XHRzaXRlcyA9IFwiR29vZ2xlLEZhY2Vib29rLFlvdVR1YmUsWWFob28sTGl2ZSxCaW5nLFdpa2lwZWRpYSxCbG9nZ2VyLE1TTixUd2l0dGVyLFdvcmRwcmVzcyxNeVNwYWNlLE1pY3Jvc29mdCxBbWF6b24sZUJheSxMaW5rZWRJbixmbGlja3IsQ3JhaWdzbGlzdCxSYXBpZHNoYXJlLENvbmR1aXQsSU1EQixCQkMsR28sQU9MLERvdWJsZWNsaWNrLEFwcGxlLEJsb2dzcG90LE9ya3V0LFBob3RvYnVja2V0LEFzayxDTk4sQWRvYmUsQWJvdXQsbWVkaWFmaXJlLENORVQsRVNQTixJbWFnZVNoYWNrLExpdmVKb3VybmFsLE1lZ2F1cGxvYWQsTWVnYXZpZGVvLEhvdGZpbGUsUGF5UGFsLE5ZVGltZXMsR2xvYm8sQWxpYmFiYSxHb0RhZGR5LERldmlhbnRBcnQsUmVkaWZmLERhaWx5TW90aW9uLERpZ2csV2VhdGhlcixuaW5nLFBhcnR5UG9rZXIsZUhvdyxEb3dubG9hZCxBbnN3ZXJzLFR3aXRQaWMsTmV0ZmxpeCxUaW55cGljLFNvdXJjZWZvcmdlLEh1bHUsQ29tY2FzdCxBcmNoaXZlLERlbGwsU3R1bWJsZXVwb24sSFAsRm94TmV3cyxNZXRhY2FmZSxWaW1lbyxTa3lwZSxDaGFzZSxSZXV0ZXJzLFdTSixZZWxwLFJlZGRpdCxHZW9jaXRpZXMsVVNQUyxVUFMsVXBsb2FkLFRlY2hDcnVuY2gsUG9nbyxQYW5kb3JhLExBVGltZXMsVVNBVG9kYXksSUJNLEFsdGFWaXN0YSxNYXRjaCxNb25zdGVyLEpvdFNwb3QsQmV0dGVyVmlkZW8sQ2x1YkFKQVgsTmV4cGxvcmUsS2F5YWssU2xhc2hkb3RcIjtcblx0XG5cdHJhbmQgPSB7XG5cdFx0cmVhbDpmYWxzZSxcblx0XHR3b3Jkczp3b3Jkcy5zcGxpdChcIixcIiksXG5cdFx0d3VyZHM6W10sXG5cdFx0bmFtZXM6bmFtZXMuc3BsaXQoXCIsXCIpLFxuXHRcdGxldHRlcnM6bGV0dGVycyxcblx0XHRzaXRlczpzaXRlcy5zcGxpdChcIixcIiksXG5cblx0XHR0b0FycmF5OiBmdW5jdGlvbih0aGluZyl7XG5cdFx0XHR2YXJcblx0XHRcdFx0bm0sIGksXG5cdFx0XHRcdGEgPSBbXTtcblxuXHRcdFx0aWYodHlwZW9mKHRoaW5nKSA9PT0gXCJvYmplY3RcIiAmJiAhKCEhdGhpbmcucHVzaCB8fCAhIXRoaW5nLml0ZW0pKXtcblx0XHRcdFx0Zm9yKG5tIGluIHRoaW5nKXsgaWYodGhpbmcuaGFzT3duUHJvcGVydHkobm0pKXthLnB1c2godGhpbmdbbm1dKTt9IH1cblx0XHRcdFx0dGhpbmcgPSBhO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0eXBlb2YodGhpbmcpID09PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0aWYoL1xcLi8udGVzdCh0aGluZykpe1xuXHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRcdHRoaW5nLnBvcCgpO1xuXHRcdFx0XHRcdGkgPSB0aGluZy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0XHRcdHRoaW5nW2ldID0gdGhpcy50cmltKHRoaW5nW2ldKSArIFwiLlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2UgaWYoLywvLnRlc3QodGhpbmcpKXtcblx0XHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZigvXFxzLy50ZXN0KHRoaW5nKSl7XG5cdFx0XHRcdFx0XHR0aGluZyA9IHRoaW5nLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR0aGluZyA9IHRoaW5nLnNwbGl0KFwiXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpbmc7IC8vQXJyYXlcblx0XHR9LFxuXG5cdFx0dHJpbTogZnVuY3Rpb24ocyl7IC8vIHRoYW5rcyB0byBEb2pvOlxuXHRcdFx0cmV0dXJuIFN0cmluZy5wcm90b3R5cGUudHJpbSA/IHMudHJpbSgpIDpcblx0XHRcdHMucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG5cdFx0fSxcblxuXHRcdHBhZDogZnVuY3Rpb24obiwgYW10LCBjaHIpe1xuXHRcdFx0XHR2YXIgYyA9IGNociB8fCBcIjBcIjsgYW10ID0gYW10IHx8IDI7XG5cdFx0XHRcdHJldHVybiAoYytjK2MrYytjK2MrYytjK2MrYytuKS5zbGljZSgtYW10KTtcblx0XHR9LFxuXG5cdFx0Y2FwOiBmdW5jdGlvbih3KXtcblx0XHRcdHJldHVybiB3LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdy5zdWJzdHJpbmcoMSk7XG5cdFx0fSxcblxuXHRcdHdlaWdodDogZnVuY3Rpb24obiwgZXhwKXtcblx0XHRcdHZhclxuXHRcdFx0XHRyZXMsXG5cdFx0XHRcdHJldiA9IGV4cCA8IDA7XG5cdFx0XHRleHAgPSBleHA9PT11bmRlZmluZWQgPyAxIDogTWF0aC5hYnMoZXhwKSsxO1xuXHRcdFx0cmVzID0gTWF0aC5wb3cobiwgZXhwKTtcblx0XHRcdHJldHVybiByZXYgPyAxIC0gcmVzIDogcmVzO1xuXHRcdH0sXG5cblx0XHRuOiBmdW5jdGlvbihuLCB3KXtcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKChuIHx8IDEwKSAqIHRoaXMud2VpZ2h0KE1hdGgucmFuZG9tKCksIHcpKTtcblx0XHR9LFxuXG5cdFx0cmFuZ2U6IGZ1bmN0aW9uKG1pbiwgbWF4LCB3KXtcblx0XHRcdG1heCA9IG1heCB8fCAwO1xuXHRcdFx0cmV0dXJuIHRoaXMubihNYXRoLmFicyhtYXgtbWluKSsxLCB3KSArIChtaW48bWF4P21pbjptYXgpO1xuXHRcdH0sXG5cblx0XHRlbGVtZW50OiBmdW5jdGlvbih0aGluZywgdyl7XG5cdFx0XHQvLyByZXR1cm4gcmFuZCBzbG90LCBjaGFyLCBwcm9wIG9yIHJhbmdlXG5cdFx0XHRpZih0eXBlb2YodGhpbmcpID09PSBcIm51bWJlclwiKXsgcmV0dXJuIHRoaXMubih0aGluZywgdyk7IH1cblx0XHRcdHRoaW5nID0gdGhpcy50b0FycmF5KHRoaW5nKTtcblx0XHRcdHJldHVybiB0aGluZ1t0aGlzLm4odGhpbmcubGVuZ3RoLCB3KV07XG5cdFx0fSxcblxuXHRcdHNjcmFtYmxlOiBmdW5jdGlvbihhcnkpe1xuXHRcdFx0dmFyXG5cdFx0XHRcdGEgPSBhcnkuY29uY2F0KFtdKSxcblx0XHRcdFx0c2QgPSBbXSxcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZShpLS0pe1xuXHRcdFx0XHRcdHNkLnB1c2goYS5zcGxpY2UodGhpcy5uKGEubGVuZ3RoKSwgMSlbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRyZXR1cm4gc2Q7XG5cdFx0fSxcblxuXHRcdGJpZ251bWJlcjogZnVuY3Rpb24obGVuKXtcblx0XHRcdHZhciB0PVwiXCI7XG5cdFx0XHR3aGlsZShsZW4tLSl7XG5cdFx0XHRcdFx0dCArPSB0aGlzLm4oOSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9LFxuXG5cdFx0ZGF0ZTogZnVuY3Rpb24obyl7XG5cdFx0XHRvID0gbyB8fCB7fTtcblx0XHRcdHZhclxuXHRcdFx0XHRkLFxuXHRcdFx0XHRkMSA9IG5ldyBEYXRlKG8ubWluIHx8IG5ldyBEYXRlKCkpLFxuXHRcdFx0XHRkMiA9IG5ldyBEYXRlKG8ubWF4IHx8IG5ldyBEYXRlKCkuc2V0RnVsbFllYXIoZDEuZ2V0RnVsbFllYXIoKSsoby55ZWFyUmFuZ2V8fDEpKSkuZ2V0VGltZSgpO1xuXHRcdFx0ZDEgPSBkMS5nZXRUaW1lKCk7XG5cdFx0XHRkID0gbmV3IERhdGUodGhpcy5yYW5nZShkMSxkMixvLndlaWdodCkpO1xuXHRcdFx0aWYoby5zZWNvbmRzKXtcblx0XHRcdFx0cmV0dXJuIGQuZ2V0VGltZSgpO1xuXHRcdFx0fWVsc2UgaWYoby5kZWxpbWl0ZXIpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYWQoZC5nZXRNb250aCgpKzEpK28uZGVsaW1pdGVyK3RoaXMucGFkKGQuZ2V0RGF0ZSgpKzEpK28uZGVsaW1pdGVyKyhkLmdldEZ1bGxZZWFyKCkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGQ7XG5cdFx0fSxcblxuXHRcdGJvb2w6IGZ1bmN0aW9uKHcpe1xuXHRcdFx0cmV0dXJuIHRoaXMubigyLCB3KSA8IDE7XG5cdFx0fSxcblxuXHRcdGNvbG9yOiBmdW5jdGlvbih3KXtcblx0XHRcdHJldHVybiBcIiNcIit0aGlzLnBhZCh0aGlzLm4oMjU1LCB3KS50b1N0cmluZygxNikpK3RoaXMucGFkKHRoaXMubigyNTUsIHcpLnRvU3RyaW5nKDE2KSkrdGhpcy5wYWQodGhpcy5uKDI1NSwgdykudG9TdHJpbmcoMTYpKTtcblx0XHR9LFxuXG5cdFx0Y2hhcnM6ZnVuY3Rpb24obWluLCBtYXgsIHcpe1xuXHRcdFx0dmFyIHMgPSBcIlwiLFxuXHRcdFx0aSA9IHRoaXMucmFuZ2UobWluLCBtYXgsIHcpO1xuXHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0cyArPSB0aGlzLmxldHRlcnNbdGhpcy5uKHRoaXMubGV0dGVycy5sZW5ndGgpXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzO1xuXHRcdH0sXG5cblx0XHRuYW1lOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gdGhpcy5uYW1lc1t0aGlzLm4odGhpcy5uYW1lcy5sZW5ndGgpXTtcblx0XHRcdHJldHVybiAhY3NlID8gcyA6IGNzZSA9PT0gMSA/IHMudG9Mb3dlckNhc2UoKSA6IHMudG9VcHBlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0Y2l0eVN0YXRlOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGNpdHlTdGF0ZXNbdGhpcy5uKGNpdHlTdGF0ZXMubGVuZ3RoKV07XG5cdFx0fSxcblxuXHRcdHN0YXRlOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gc3RhdGVzW3RoaXMubihzdGF0ZXMubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdHN0YXRlQ29kZTogZnVuY3Rpb24oY3NlKXtcblx0XHRcdGNzZSA9IGNzZSA9PT0gdW5kZWZpbmVkID8gMiA6IGNzZTtcblx0XHRcdC8vIGNzZTogMCB0aXRsZSBjYXNlLCAxIGxvd2VyY2FzZSwgMiB1cHBlciBjYXNlXG5cdFx0XHR2YXIgcyA9IHN0YXRlQWJiclt0aGlzLm4oc3RhdGVBYmJyLmxlbmd0aCldO1xuXHRcdFx0cmV0dXJuICFjc2UgPyBzIDogY3NlID09PSAxID8gcy50b0xvd2VyQ2FzZSgpIDogcy50b1VwcGVyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHRzdHJlZXQ6IGZ1bmN0aW9uKG5vU3VmZml4KXtcblx0XHRcdHZhciBzID0gc3RyZWV0c1t0aGlzLm4oc3RyZWV0cy5sZW5ndGgpXTtcblx0XHRcdGlmKCFub1N1ZmZpeCl7XG5cdFx0XHRcdHMrPSAnICcgKyBzdHJlZXRTdWZmaXhlc1t0aGlzLm4oc3RyZWV0U3VmZml4ZXMubGVuZ3RoKV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcztcblx0XHR9LFxuXG5cdFx0c2l0ZTogZnVuY3Rpb24oY3NlKXtcblx0XHRcdC8vIGNzZTogMCB0aXRsZSBjYXNlLCAxIGxvd2VyY2FzZSwgMiB1cHBlciBjYXNlXG5cdFx0XHR2YXIgcyA9IHRoaXMuc2l0ZXNbdGhpcy5uKHRoaXMuc2l0ZXMubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdHVybDogZnVuY3Rpb24odXNld3d3LCB4dCl7XG5cdFx0XHR2YXIgdyA9IHVzZXd3dyA/IFwid3d3LlwiIDogXCJcIjtcblx0XHRcdHh0ID0geHQgfHwgXCIuY29tXCI7XG5cdFx0XHRyZXR1cm4gXCJodHRwOi8vXCIgKyB3ICsgdGhpcy5zaXRlKDEpICsgeHQ7XG5cdFx0fSxcblxuXHRcdHdvcmQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgdyA9IHRoaXMucmVhbCA/IHRoaXMud29yZHMgOiB0aGlzLnd1cmRzO1xuXHRcdFx0cmV0dXJuIHdbdGhpcy5uKHcubGVuZ3RoKV07XG5cdFx0fSxcblxuXHRcdHNlbnRlbmNlczogZnVuY3Rpb24obWluQW10LCBtYXhBbXQsIG1pbkxlbiwgbWF4TGVuKXtcblx0XHRcdC8vIGFtdDogc2VudGVuY2VzLCBsZW46IHdvcmRzXG5cdFx0XHRtaW5BbXQgPSBtaW5BbXQgfHwgMTtcblx0XHRcdG1heEFtdCA9IG1heEFtdCB8fCBtaW5BbXQ7XG5cdFx0XHRtaW5MZW4gPSBtaW5MZW4gfHwgNTtcblx0XHRcdG1heExlbiA9IG1heExlbiB8fCBtaW5MZW47XG5cblx0XHRcdHZhclxuXHRcdFx0XHRpaSxcblx0XHRcdFx0cyA9IFtdLFxuXHRcdFx0XHR0ID0gXCJcIixcblx0XHRcdFx0dyA9IHRoaXMucmVhbCA/IHRoaXMud29yZHMgOiB0aGlzLnd1cmRzLFxuXHRcdFx0XHRpID0gdGhpcy5yYW5nZShtaW5BbXQsIG1heEFtdCk7XG5cblx0XHRcdHdoaWxlKGktLSl7XG5cblx0XHRcdFx0aWkgPSB0aGlzLnJhbmdlKG1pbkxlbiwgbWF4TGVuKTsgd2hpbGUoaWktLSl7XG5cdFx0XHRcdFx0cy5wdXNoKHdbdGhpcy5uKHcubGVuZ3RoKV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQgKz0gdGhpcy5jYXAocy5qb2luKFwiIFwiKSkgK1wiLiBcIjtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0O1xuXHRcdH0sXG5cblx0XHR0aXRsZTogZnVuY3Rpb24obWluLCBtYXgpe1xuXHRcdFx0bWluID0gbWluIHx8IDE7IG1heCA9IG1heCB8fCBtaW47XG5cdFx0XHR2YXJcblx0XHRcdFx0YSA9IFtdLFxuXHRcdFx0XHR3ID0gdGhpcy5yZWFsID8gdGhpcy53b3JkcyA6IHRoaXMud3VyZHMsXG5cdFx0XHRcdGkgPSB0aGlzLnJhbmdlKG1pbiwgbWF4KTtcblx0XHRcdHdoaWxlKGktLSl7XG5cdFx0XHRcdGEucHVzaCh0aGlzLmNhcCh3W3RoaXMubih3Lmxlbmd0aCldKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYS5qb2luKFwiIFwiKTtcblx0XHR9LFxuXHRcdGRhdGE6IGZ1bmN0aW9uKGFtdCl7XG5cdFx0XHR2YXJcblx0XHRcdFx0c3QsXG5cdFx0XHRcdGl0ZW1zID0gW10sXG5cdFx0XHRcdGl0ZW0sXG5cdFx0XHRcdGk7XG5cdFx0XHRmb3IoaSA9IDA7IGkgPCBhbXQ7IGkrKyl7XG5cdFx0XHRcdGl0ZW0gPSB7XG5cdFx0XHRcdFx0Zmlyc3ROYW1lOiB0aGlzLm5hbWUoKSxcblx0XHRcdFx0XHRsYXN0TmFtZTogdGhpcy5uYW1lKCksXG5cdFx0XHRcdFx0Y29tcGFueTogdGhpcy5zaXRlKCksXG5cdFx0XHRcdFx0YWRkcmVzczE6IHRoaXMuYmlnbnVtYmVyKHRoaXMucmFuZ2UoMywgNSkpLFxuXHRcdFx0XHRcdGFkZHJlc3MyOiB0aGlzLnN0cmVldCgpLFxuXHRcdFx0XHRcdGJpcnRoZGF5OiB0aGlzLmRhdGUoe2RlbGltaXRlcjonLyd9KVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpdGVtLmVtYWlsID0gKGl0ZW0uZmlyc3ROYW1lLnN1YnN0cmluZygwLDEpICsgaXRlbS5sYXN0TmFtZSArICdAJyArIGl0ZW0uY29tcGFueSArICcuY29tJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0c3QgPSB0aGlzLmNpdHlTdGF0ZSgpO1xuXHRcdFx0XHRpdGVtLmNpdHkgPSBzdC5zcGxpdCgnLCAnKVswXTtcblx0XHRcdFx0aXRlbS5zdGF0ZSA9IHN0LnNwbGl0KCcsICcpWzFdO1xuXHRcdFx0XHRpdGVtLnppcGNvZGUgPSB0aGlzLmJpZ251bWJlcig1KTtcblx0XHRcdFx0aXRlbS5waG9uZSA9IHRoaXMuZm9ybWF0KHRoaXMuYmlnbnVtYmVyKDEwKSwgJ3Bob25lJyk7XG5cdFx0XHRcdGl0ZW0uc3NuID0gdGhpcy5mb3JtYXQodGhpcy5iaWdudW1iZXIoOSksICdzc24nKTtcblx0XHRcdFx0aXRlbXMucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9LFxuXG5cdFx0Zm9ybWF0OiBmdW5jdGlvbiAobiwgdHlwZSkge1xuXHRcdFx0dmFyIGQgPSAnLSc7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAncGhvbmUnOlxuXHRcdFx0XHRcdG4gPSAnJyArIG47XG5cdFx0XHRcdFx0cmV0dXJuIG4uc3Vic3RyaW5nKDAsMykgKyBkICsgbi5zdWJzdHJpbmcoMyw2KSArIGQgKyBuLnN1YnN0cmluZyg2KTtcblx0XHRcdFx0Y2FzZSAnc3NuJzpcblx0XHRcdFx0XHRuID0gJycgKyBuO1xuXHRcdFx0XHRcdHJldHVybiBuLnN1YnN0cmluZygwLDMpICsgZCArIG4uc3Vic3RyaW5nKDMsNSkgKyBkICsgbi5zdWJzdHJpbmcoNSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyYW5kLnd1cmRzID0gd29yZHMucmVwbGFjZSgvYXxlfGl8b3x1L2csIGZ1bmN0aW9uKGMpeyByZXR1cm4gKFwiYWVpb3VcIilbcmFuZC5uKDUpXTsgfSkuc3BsaXQoXCIsXCIpO1xuXG5cdHJldHVybiByYW5kO1xufSkpO1xuIl19
