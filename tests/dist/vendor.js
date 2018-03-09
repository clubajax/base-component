require=(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({"@clubajax/custom-elements-polyfill":[function(require,module,exports){
(function () {
if(window['force-no-ce-shim']){
	return;
}
var supportsV1 = 'customElements' in window;
var nativeShimBase64 = "ZnVuY3Rpb24gbmF0aXZlU2hpbSgpeygoKT0+eyd1c2Ugc3RyaWN0JztpZighd2luZG93LmN1c3RvbUVsZW1lbnRzKXJldHVybjtjb25zdCBhPXdpbmRvdy5IVE1MRWxlbWVudCxiPXdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUsYz13aW5kb3cuY3VzdG9tRWxlbWVudHMuZ2V0LGQ9bmV3IE1hcCxlPW5ldyBNYXA7bGV0IGY9ITEsZz0hMTt3aW5kb3cuSFRNTEVsZW1lbnQ9ZnVuY3Rpb24oKXtpZighZil7Y29uc3Qgaj1kLmdldCh0aGlzLmNvbnN0cnVjdG9yKSxrPWMuY2FsbCh3aW5kb3cuY3VzdG9tRWxlbWVudHMsaik7Zz0hMDtjb25zdCBsPW5ldyBrO3JldHVybiBsfWY9ITE7fSx3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlPWEucHJvdG90eXBlO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csJ2N1c3RvbUVsZW1lbnRzJyx7dmFsdWU6d2luZG93LmN1c3RvbUVsZW1lbnRzLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cuY3VzdG9tRWxlbWVudHMsJ2RlZmluZScse3ZhbHVlOihqLGspPT57Y29uc3QgbD1rLnByb3RvdHlwZSxtPWNsYXNzIGV4dGVuZHMgYXtjb25zdHJ1Y3Rvcigpe3N1cGVyKCksT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsbCksZ3x8KGY9ITAsay5jYWxsKHRoaXMpKSxnPSExO319LG49bS5wcm90b3R5cGU7bS5vYnNlcnZlZEF0dHJpYnV0ZXM9ay5vYnNlcnZlZEF0dHJpYnV0ZXMsbi5jb25uZWN0ZWRDYWxsYmFjaz1sLmNvbm5lY3RlZENhbGxiYWNrLG4uZGlzY29ubmVjdGVkQ2FsbGJhY2s9bC5kaXNjb25uZWN0ZWRDYWxsYmFjayxuLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaz1sLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayxuLmFkb3B0ZWRDYWxsYmFjaz1sLmFkb3B0ZWRDYWxsYmFjayxkLnNldChrLGopLGUuc2V0KGosayksYi5jYWxsKHdpbmRvdy5jdXN0b21FbGVtZW50cyxqLG0pO30sY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5jdXN0b21FbGVtZW50cywnZ2V0Jyx7dmFsdWU6KGopPT5lLmdldChqKSxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTt9KSgpO30=";

if(supportsV1 && !window['force-ce-shim']){
	var noNativeShim = typeof NO_NATIVE_SHIM !== "undefined" ? NO_NATIVE_SHIM : window['no-native-shim'];
if(!noNativeShim) {
eval(window.atob(nativeShimBase64));
nativeShim();
}
}else{
customElements();
}

function customElements() {
(function(){
// @license Polymer Project Authors. http://polymer.github.io/LICENSE.txt
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
return a})}M?q(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=M.call(this,a)}):null;if(N&&N.get)a(Element.prototype,N);else if(W&&W.get)a(HTMLElement.prototype,W);else{var c=F.call(document,"div");t(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return G.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName?this.content:this;for(c.innerHTML=a;0<b.childNodes.length;)J.call(b,
b.childNodes[0]);for(;0<c.childNodes.length;)H.call(b,c.childNodes[0])}})})}q(Element.prototype,"setAttribute",function(a,c){if(1!==this.__CE_state)return Q.call(this,a,c);var d=O.call(this,a);Q.call(this,a,c);c=O.call(this,a);d!==c&&b.attributeChangedCallback(this,a,d,c,null)});q(Element.prototype,"setAttributeNS",function(a,c,e){if(1!==this.__CE_state)return T.call(this,a,c,e);var d=S.call(this,a,c);T.call(this,a,c,e);e=S.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});q(Element.prototype,
"removeAttribute",function(a){if(1!==this.__CE_state)return R.call(this,a);var c=O.call(this,a);R.call(this,a);null!==c&&b.attributeChangedCallback(this,a,c,null,null)});q(Element.prototype,"removeAttributeNS",function(a,c){if(1!==this.__CE_state)return U.call(this,a,c);var d=S.call(this,a,c);U.call(this,a,c);var e=S.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});X?e(HTMLElement.prototype,X):V?e(Element.prototype,V):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");
pa(b,Element.prototype,{i:ha,append:ia});sa(b)};
var Z=window.customElements;if(!Z||Z.forcePolyfill||"function"!=typeof Z.define||"function"!=typeof Z.get){var Y=new r;oa();qa();ra();ta();document.__CE_hasRegistry=!0;var ua=new E(Y);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:ua})};
}).call(self);
}
}());
},{}],"@clubajax/dom":[function(require,module,exports){
/* UMD.define */
(function (root, factory) {
	if (typeof customLoader === 'function') {
		customLoader(factory, 'dom');
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.returnExports = factory();
		window.dom = factory();
	}
}(this, function () {
	'use strict';
	var
		uids = {},
		destroyer = document.createElement('div');

	function isDimension (prop) {
		return !/opacity|index|flex|weight|^sdcsdcorder|tab|miter|group|zoom/i.test(prop)
	}

	function isNumber (value) {
		if (/\s/.test(value)) {
			return false;
		}
		return !isNaN(parseFloat(value));
	}

	function uid (type) {
		type = type || 'uid';
		if (uids[type] === undefined) {
			uids[type] = 0;
		}
		var id = type + '-' + (uids[type] + 1);
		uids[type]++;
		return id;
	}

	function isNode (item) {
		// safer test for custom elements in FF (with wc shim)
		// fragment is a special case
		return !!item && typeof item === 'object' && (typeof item.innerHTML === 'string' || item.nodeName === '#document-fragment');
	}

	function byId (item) {
		if (typeof item === 'string') {
			return document.getElementById(item);
		}
		return item;
	}

	function style (node, prop, value) {
		var key, computed, result;
		if (typeof prop === 'object') {
			// object setter
			Object.keys(prop).forEach(function (key) {
				style(node, key, prop[key]);
			});
			return null;
		} else if (value !== undefined) {
			// property setter
			if (typeof value === 'number' && isDimension(prop)) {
				value += 'px';
			}
			node.style[prop] = value;
		}

		// getter, if a simple style
		if (node.style[prop]) {
			result = node.style[prop];
			if (/px/.test(result)) {
				return parseFloat(result);
			}
			if (/%/.test(result)) {
				return parseFloat(result) * 0.01;
			}
			if (isNumber(result)) {
				return parseFloat(result);
			}
			return result;
		}

		// getter, computed
		computed = window.getComputedStyle(node);
		if (computed[prop]) {
			result = computed[prop];
			if (isNumber(result)) {
				return parseFloat(result);
			}
			return computed[prop];
		}
		return '';
	}

	function attr (node, prop, value) {
		var key;

		if (typeof prop === 'object') {

			var bools = {};
			var strings = {};
			var objects = {};
			var events = {};
			Object.keys(prop).forEach(function (key) {
				if (typeof prop[key] === 'boolean') {
					bools[key] = prop[key];
				} else if (typeof prop[key] === 'object') {
					objects[key] = prop[key];
				} else if (typeof prop[key] === 'function') {
					if (/on[A-Z]/.test(key)) {
						events[key] = prop[key];
					} else {
						console.warn('dom warning: function used with `onEvent` syntax');
					}
				} else {
					strings[key] = prop[key];
				}
			});

			// assigning properties in specific order of type, namely objects last
			Object.keys(bools).forEach(function (key) { attr(node, key, prop[key]); });
			Object.keys(strings).forEach(function (key) { attr(node, key, prop[key]); });
			Object.keys(events).forEach(function (key) { attr(node, key, prop[key]); });
			Object.keys(objects).forEach(function (key) { attr(node, key, prop[key]); });

			return null;
		}
		else if (value !== undefined) {
			if (prop === 'text' || prop === 'html' || prop === 'innerHTML') {
				// ignore, handled during creation
				return;
			}
			else if (prop === 'className' || prop === 'class') {
				dom.classList.add(node, value);
			}
			else if (prop === 'style') {
				style(node, value);
			}
			else if (prop === 'attr') {
				// back compat
				attr(node, value);
			}
			else if (typeof value === 'function') {
				attachEvent(node, prop, value);
			}
			else if (typeof value === 'object') {
				// object, like 'data'
				node[prop] = value;
			}
			else {
				if (value === false) {
					node.removeAttribute(prop);
				} else {
					node.setAttribute(prop, value);
				}
			}
		}

		return node.getAttribute(prop);
	}

	function attachEvent (node, prop, value) {
		var event = prop.replace('on', '').toLowerCase();
		node.addEventListener(event, value);

		var callback = function(mutationsList) {
			mutationsList.forEach(function (mutation) {
				for (var i = 0; i < mutation.removedNodes.length; i++) {
					var n = mutation.removedNodes[i];
					if (n === node) {
						node.removeEventListener(event, value);
						observer.disconnect();
						break;
					}
				}
			});
		};
		var observer = new MutationObserver(callback);
		observer.observe(node.parentNode || document.body, { childList: true });
	}

	function box (node) {
		if (node === window) {
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

	function relBox (node, parentNode) {
		const parent = parentNode || node.parentNode;
		const pBox = box(parent);
		const bx = box(node);

		return {
			w: bx.w,
			h: bx.h,
			x: bx.left - pBox.left,
			y: bx.top - pBox.top
		};
	}

	function size (node, type) {
		if (node === window) {
			node = document.documentElement;
		}
		if (type === 'scroll') {
			return {
				w: node.scrollWidth,
				h: node.scrollHeight
			};
		}
		if (type === 'client') {
			return {
				w: node.clientWidth,
				h: node.clientHeight
			};
		}
		return {
			w: node.offsetWidth,
			h: node.offsetHeight
		};
	}

	function query (node, selector) {
		if (!selector) {
			selector = node;
			node = document;
		}
		return node.querySelector(selector);
	}

	function queryAll (node, selector) {
		if (!selector) {
			selector = node;
			node = document;
		}
		var nodes = node.querySelectorAll(selector);

		if (!nodes.length) {
			return [];
		}

		// convert to Array and return it
		return Array.prototype.slice.call(nodes);
	}

	function toDom (html, options, parent) {
		var node = dom('div', { html: html });
		parent = byId(parent || options);
		if (parent) {
			while (node.firstChild) {
				parent.appendChild(node.firstChild);
			}
			return node.firstChild;
		}
		if (html.indexOf('<') !== 0) {
			return node;
		}
		return node.firstChild;
	}

	function fromDom (node) {
		function getAttrs (node) {
			var att, i, attrs = {};
			for (i = 0; i < node.attributes.length; i++) {
				att = node.attributes[i];
				attrs[att.localName] = normalize(att.value === '' ? true : att.value);
			}
			return attrs;
		}

		function getText (node) {
			var i, t, text = '';
			for (i = 0; i < node.childNodes.length; i++) {
				t = node.childNodes[i];
				if (t.nodeType === 3 && t.textContent.trim()) {
					text += t.textContent.trim();
				}
			}
			return text;
		}

		var i, object = getAttrs(node);
		object.text = getText(node);
		object.children = [];
		if (node.children.length) {
			for (i = 0; i < node.children.length; i++) {
				object.children.push(fromDom(node.children[i]));
			}
		}
		return object;
	}

	function addChildren (node, children) {
		if (Array.isArray(children)) {
			for (var i = 0; i < children.length; i++) {
				if (children[i]) {
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
		if (options.html !== undefined || options.innerHTML !== undefined) {
			html = options.html || options.innerHTML || '';
			if (typeof html === 'object') {
				addChildren(node, html);
			} else {
				// careful assuming textContent -
				// misses some HTML, such as entities (&npsp;)
				node.innerHTML = html;
			}
		}
		if (options.text) {
			node.appendChild(document.createTextNode(options.text));
		}
		if (options.children) {
			addChildren(node, options.children);
		}
	}

	function dom (nodeType, options, parent, prepend) {
		options = options || {};

		// if first argument is a string and starts with <, pass to toDom()
		if (nodeType.indexOf('<') === 0) {
			return toDom(nodeType, options, parent);
		}

		var node = document.createElement(nodeType);

		parent = byId(parent);

		addContent(node, options);

		attr(node, options);

		if (parent && isNode(parent)) {
			if (prepend && parent.hasChildNodes()) {
				parent.insertBefore(node, parent.children[0]);
			} else {
				parent.appendChild(node);
			}
		}

		return node;
	}

	function insertAfter (refNode, node) {
		var sibling = refNode.nextElementSibling;
		if (!sibling) {
			refNode.parentNode.appendChild(node);
		} else {
			refNode.parentNode.insertBefore(node, sibling);
		}
		return sibling;
	}

	function destroy (node) {
		// destroys a node completely
		//
		if (node) {
			node.destroyed = true;
			destroyer.appendChild(node);
			destroyer.innerHTML = '';
		}
	}

	function clean (node, dispose) {
		//	Removes all child nodes
		//		dispose: destroy child nodes
		if (dispose) {
			while (node.children.length) {
				destroy(node.children[0]);
			}
			return;
		}
		while (node.children.length) {
			node.removeChild(node.children[0]);
		}
	}

	dom.frag = function (nodes) {
		var frag = document.createDocumentFragment();
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				frag.appendChild(arguments[i]);
			}
		} else {
			if (Array.isArray(nodes)) {
				nodes.forEach(function (n) {
					frag.appendChild(n);
				});
			} else {
				frag.appendChild(nodes);
			}
		}
		return frag;
	};

	dom.classList = {
		// in addition to fixing IE11-toggle,
		// these methods also handle arrays
		remove: function (node, names) {
			toArray(names).forEach(function (name) {
				node.classList.remove(name);
			});
		},
		add: function (node, names) {
			toArray(names).forEach(function (name) {
				node.classList.add(name);
			});
		},
		contains: function (node, names) {
			return toArray(names).every(function (name) {
				return node.classList.contains(name);
			});
		},
		toggle: function (node, names, value) {
			names = toArray(names);
			if (typeof value === 'undefined') {
				// use standard functionality, supported by IE
				names.forEach(function (name) {
					node.classList.toggle(name, value);
				});
			}
			// IE11 does not support the second parameter
			else if (value) {
				names.forEach(function (name) {
					node.classList.add(name);
				});
			}
			else {
				names.forEach(function (name) {
					node.classList.remove(name);
				});
			}
		}
	};

	function toArray (names) {
		if (!names) {
			return [];
		}
		return names.split(' ').map(function (name) {
			return name.trim();
		}).filter(function (name) {
			return !!name;
		});
	}

	function normalize (val) {
		if (typeof val === 'string') {
			val = val.trim();
			if (val === 'false') {
				return false;
			} else if (val === 'null') {
				return null;
			} else if (val === 'true') {
				return true;
			}
			// finds strings that start with numbers, but are not numbers:
			// '2team' '123 Street', '1-2-3', etc
			if (('' + val).replace(/-?\d*\.?\d*/, '').length) {
				return val;
			}
		}
		if (!isNaN(parseFloat(val))) {
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
	dom.size = size;
	dom.relBox = relBox;

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
		return function onKeyHandler (node, callback) {
			return on(node, keyEventName, function onKey (e) {
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
		return function normalizeKeys (e) {
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
		return function normalizeWheel (e) {
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

	function getDoc (node) {
		return node === document || node === window ? document : node.ownerDocument;
	}

	// public functions

	on.once = function (node, eventName, filter, callback) {
		var h;
		if (filter && callback) {
			h = on(node, eventName, filter, function once () {
				callback.apply(window, arguments);
				h.remove();
			});
		} else {
			h = on(node, eventName, function once () {
				filter.apply(window, arguments);
				h.remove();
			});
		}
		return h;
	};

	on.emit = function (node, eventName, value) {
		node = typeof node === 'string' ? getNodeById(node) : node;
		var event = getDoc(node).createEvent('HTMLEvents');
		event.initEvent(eventName, true, true); // event type, bubbling, cancelable
		return node.dispatchEvent(mix(event, value));
	};

	on.fire = function (node, eventName, eventDetail, bubbles) {
		node = typeof node === 'string' ? getNodeById(node) : node;
		var event = getDoc(node).createEvent('CustomEvent');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJAY2x1YmFqYXgvY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsIiwiQGNsdWJhamF4L2RvbSIsIkBjbHViYWpheC9vbiIsInJhbmRvbWl6ZXIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Z0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9ZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiKGZ1bmN0aW9uICgpIHtcbmlmKHdpbmRvd1snZm9yY2Utbm8tY2Utc2hpbSddKXtcblx0cmV0dXJuO1xufVxudmFyIHN1cHBvcnRzVjEgPSAnY3VzdG9tRWxlbWVudHMnIGluIHdpbmRvdztcbnZhciBuYXRpdmVTaGltQmFzZTY0ID0gXCJablZ1WTNScGIyNGdibUYwYVhabFUyaHBiU2dwZXlnb0tUMCtleWQxYzJVZ2MzUnlhV04wSnp0cFppZ2hkMmx1Wkc5M0xtTjFjM1J2YlVWc1pXMWxiblJ6S1hKbGRIVnlianRqYjI1emRDQmhQWGRwYm1SdmR5NUlWRTFNUld4bGJXVnVkQ3hpUFhkcGJtUnZkeTVqZFhOMGIyMUZiR1Z0Wlc1MGN5NWtaV1pwYm1Vc1l6MTNhVzVrYjNjdVkzVnpkRzl0Uld4bGJXVnVkSE11WjJWMExHUTlibVYzSUUxaGNDeGxQVzVsZHlCTllYQTdiR1YwSUdZOUlURXNaejBoTVR0M2FXNWtiM2N1U0ZSTlRFVnNaVzFsYm5ROVpuVnVZM1JwYjI0b0tYdHBaaWdoWmlsN1kyOXVjM1FnYWoxa0xtZGxkQ2gwYUdsekxtTnZibk4wY25WamRHOXlLU3hyUFdNdVkyRnNiQ2gzYVc1a2IzY3VZM1Z6ZEc5dFJXeGxiV1Z1ZEhNc2FpazdaejBoTUR0amIyNXpkQ0JzUFc1bGR5QnJPM0psZEhWeWJpQnNmV1k5SVRFN2ZTeDNhVzVrYjNjdVNGUk5URVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxQV0V1Y0hKdmRHOTBlWEJsTzA5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDNhVzVrYjNjc0oyTjFjM1J2YlVWc1pXMWxiblJ6Snl4N2RtRnNkV1U2ZDJsdVpHOTNMbU4xYzNSdmJVVnNaVzFsYm5SekxHTnZibVpwWjNWeVlXSnNaVG9oTUN4M2NtbDBZV0pzWlRvaE1IMHBMRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoM2FXNWtiM2N1WTNWemRHOXRSV3hsYldWdWRITXNKMlJsWm1sdVpTY3NlM1poYkhWbE9paHFMR3NwUFQ1N1kyOXVjM1FnYkQxckxuQnliM1J2ZEhsd1pTeHRQV05zWVhOeklHVjRkR1Z1WkhNZ1lYdGpiMjV6ZEhKMVkzUnZjaWdwZTNOMWNHVnlLQ2tzVDJKcVpXTjBMbk5sZEZCeWIzUnZkSGx3WlU5bUtIUm9hWE1zYkNrc1ozeDhLR1k5SVRBc2F5NWpZV3hzS0hSb2FYTXBLU3huUFNFeE8zMTlMRzQ5YlM1d2NtOTBiM1I1Y0dVN2JTNXZZbk5sY25abFpFRjBkSEpwWW5WMFpYTTlheTV2WW5ObGNuWmxaRUYwZEhKcFluVjBaWE1zYmk1amIyNXVaV04wWldSRFlXeHNZbUZqYXoxc0xtTnZibTVsWTNSbFpFTmhiR3hpWVdOckxHNHVaR2x6WTI5dWJtVmpkR1ZrUTJGc2JHSmhZMnM5YkM1a2FYTmpiMjV1WldOMFpXUkRZV3hzWW1GamF5eHVMbUYwZEhKcFluVjBaVU5vWVc1blpXUkRZV3hzWW1GamF6MXNMbUYwZEhKcFluVjBaVU5vWVc1blpXUkRZV3hzWW1GamF5eHVMbUZrYjNCMFpXUkRZV3hzWW1GamF6MXNMbUZrYjNCMFpXUkRZV3hzWW1GamF5eGtMbk5sZENockxHb3BMR1V1YzJWMEtHb3NheWtzWWk1allXeHNLSGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3l4cUxHMHBPMzBzWTI5dVptbG5kWEpoWW14bE9pRXdMSGR5YVhSaFlteGxPaUV3ZlNrc1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLSGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3l3bloyVjBKeXg3ZG1Gc2RXVTZLR29wUFQ1bExtZGxkQ2hxS1N4amIyNW1hV2QxY21GaWJHVTZJVEFzZDNKcGRHRmliR1U2SVRCOUtUdDlLU2dwTzMwPVwiO1xuXG5pZihzdXBwb3J0c1YxICYmICF3aW5kb3dbJ2ZvcmNlLWNlLXNoaW0nXSl7XG5cdHZhciBub05hdGl2ZVNoaW0gPSB0eXBlb2YgTk9fTkFUSVZFX1NISU0gIT09IFwidW5kZWZpbmVkXCIgPyBOT19OQVRJVkVfU0hJTSA6IHdpbmRvd1snbm8tbmF0aXZlLXNoaW0nXTtcbmlmKCFub05hdGl2ZVNoaW0pIHtcbmV2YWwod2luZG93LmF0b2IobmF0aXZlU2hpbUJhc2U2NCkpO1xubmF0aXZlU2hpbSgpO1xufVxufWVsc2V7XG5jdXN0b21FbGVtZW50cygpO1xufVxuXG5mdW5jdGlvbiBjdXN0b21FbGVtZW50cygpIHtcbihmdW5jdGlvbigpe1xuLy8gQGxpY2Vuc2UgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuJ3VzZSBzdHJpY3QnO3ZhciBnPW5ldyBmdW5jdGlvbigpe307dmFyIGFhPW5ldyBTZXQoXCJhbm5vdGF0aW9uLXhtbCBjb2xvci1wcm9maWxlIGZvbnQtZmFjZSBmb250LWZhY2Utc3JjIGZvbnQtZmFjZS11cmkgZm9udC1mYWNlLWZvcm1hdCBmb250LWZhY2UtbmFtZSBtaXNzaW5nLWdseXBoXCIuc3BsaXQoXCIgXCIpKTtmdW5jdGlvbiBrKGIpe3ZhciBhPWFhLmhhcyhiKTtiPS9eW2Etel1bLjAtOV9hLXpdKi1bXFwtLjAtOV9hLXpdKiQvLnRlc3QoYik7cmV0dXJuIWEmJmJ9ZnVuY3Rpb24gbChiKXt2YXIgYT1iLmlzQ29ubmVjdGVkO2lmKHZvaWQgMCE9PWEpcmV0dXJuIGE7Zm9yKDtiJiYhKGIuX19DRV9pc0ltcG9ydERvY3VtZW50fHxiIGluc3RhbmNlb2YgRG9jdW1lbnQpOyliPWIucGFyZW50Tm9kZXx8KHdpbmRvdy5TaGFkb3dSb290JiZiIGluc3RhbmNlb2YgU2hhZG93Um9vdD9iLmhvc3Q6dm9pZCAwKTtyZXR1cm4hKCFifHwhKGIuX19DRV9pc0ltcG9ydERvY3VtZW50fHxiIGluc3RhbmNlb2YgRG9jdW1lbnQpKX1cbmZ1bmN0aW9uIG0oYixhKXtmb3IoO2EmJmEhPT1iJiYhYS5uZXh0U2libGluZzspYT1hLnBhcmVudE5vZGU7cmV0dXJuIGEmJmEhPT1iP2EubmV4dFNpYmxpbmc6bnVsbH1cbmZ1bmN0aW9uIG4oYixhLGUpe2U9ZT9lOm5ldyBTZXQ7Zm9yKHZhciBjPWI7Yzspe2lmKGMubm9kZVR5cGU9PT1Ob2RlLkVMRU1FTlRfTk9ERSl7dmFyIGQ9YzthKGQpO3ZhciBoPWQubG9jYWxOYW1lO2lmKFwibGlua1wiPT09aCYmXCJpbXBvcnRcIj09PWQuZ2V0QXR0cmlidXRlKFwicmVsXCIpKXtjPWQuaW1wb3J0O2lmKGMgaW5zdGFuY2VvZiBOb2RlJiYhZS5oYXMoYykpZm9yKGUuYWRkKGMpLGM9Yy5maXJzdENoaWxkO2M7Yz1jLm5leHRTaWJsaW5nKW4oYyxhLGUpO2M9bShiLGQpO2NvbnRpbnVlfWVsc2UgaWYoXCJ0ZW1wbGF0ZVwiPT09aCl7Yz1tKGIsZCk7Y29udGludWV9aWYoZD1kLl9fQ0Vfc2hhZG93Um9vdClmb3IoZD1kLmZpcnN0Q2hpbGQ7ZDtkPWQubmV4dFNpYmxpbmcpbihkLGEsZSl9Yz1jLmZpcnN0Q2hpbGQ/Yy5maXJzdENoaWxkOm0oYixjKX19ZnVuY3Rpb24gcShiLGEsZSl7YlthXT1lfTtmdW5jdGlvbiByKCl7dGhpcy5hPW5ldyBNYXA7dGhpcy5mPW5ldyBNYXA7dGhpcy5jPVtdO3RoaXMuYj0hMX1mdW5jdGlvbiBiYShiLGEsZSl7Yi5hLnNldChhLGUpO2IuZi5zZXQoZS5jb25zdHJ1Y3RvcixlKX1mdW5jdGlvbiB0KGIsYSl7Yi5iPSEwO2IuYy5wdXNoKGEpfWZ1bmN0aW9uIHYoYixhKXtiLmImJm4oYSxmdW5jdGlvbihhKXtyZXR1cm4gdyhiLGEpfSl9ZnVuY3Rpb24gdyhiLGEpe2lmKGIuYiYmIWEuX19DRV9wYXRjaGVkKXthLl9fQ0VfcGF0Y2hlZD0hMDtmb3IodmFyIGU9MDtlPGIuYy5sZW5ndGg7ZSsrKWIuY1tlXShhKX19ZnVuY3Rpb24geChiLGEpe3ZhciBlPVtdO24oYSxmdW5jdGlvbihiKXtyZXR1cm4gZS5wdXNoKGIpfSk7Zm9yKGE9MDthPGUubGVuZ3RoO2ErKyl7dmFyIGM9ZVthXTsxPT09Yy5fX0NFX3N0YXRlP2IuY29ubmVjdGVkQ2FsbGJhY2soYyk6eShiLGMpfX1cbmZ1bmN0aW9uIHooYixhKXt2YXIgZT1bXTtuKGEsZnVuY3Rpb24oYil7cmV0dXJuIGUucHVzaChiKX0pO2ZvcihhPTA7YTxlLmxlbmd0aDthKyspe3ZhciBjPWVbYV07MT09PWMuX19DRV9zdGF0ZSYmYi5kaXNjb25uZWN0ZWRDYWxsYmFjayhjKX19XG5mdW5jdGlvbiBBKGIsYSxlKXtlPWU/ZTpuZXcgU2V0O3ZhciBjPVtdO24oYSxmdW5jdGlvbihkKXtpZihcImxpbmtcIj09PWQubG9jYWxOYW1lJiZcImltcG9ydFwiPT09ZC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikpe3ZhciBhPWQuaW1wb3J0O2EgaW5zdGFuY2VvZiBOb2RlJiZcImNvbXBsZXRlXCI9PT1hLnJlYWR5U3RhdGU/KGEuX19DRV9pc0ltcG9ydERvY3VtZW50PSEwLGEuX19DRV9oYXNSZWdpc3RyeT0hMCk6ZC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGZ1bmN0aW9uKCl7dmFyIGE9ZC5pbXBvcnQ7YS5fX0NFX2RvY3VtZW50TG9hZEhhbmRsZWR8fChhLl9fQ0VfZG9jdW1lbnRMb2FkSGFuZGxlZD0hMCxhLl9fQ0VfaXNJbXBvcnREb2N1bWVudD0hMCxhLl9fQ0VfaGFzUmVnaXN0cnk9ITAsbmV3IFNldChlKSxlLmRlbGV0ZShhKSxBKGIsYSxlKSl9KX1lbHNlIGMucHVzaChkKX0sZSk7aWYoYi5iKWZvcihhPTA7YTxjLmxlbmd0aDthKyspdyhiLGNbYV0pO2ZvcihhPTA7YTxjLmxlbmd0aDthKyspeShiLFxuY1thXSl9XG5mdW5jdGlvbiB5KGIsYSl7aWYodm9pZCAwPT09YS5fX0NFX3N0YXRlKXt2YXIgZT1iLmEuZ2V0KGEubG9jYWxOYW1lKTtpZihlKXtlLmNvbnN0cnVjdGlvblN0YWNrLnB1c2goYSk7dmFyIGM9ZS5jb25zdHJ1Y3Rvcjt0cnl7dHJ5e2lmKG5ldyBjIT09YSl0aHJvdyBFcnJvcihcIlRoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvciBkaWQgbm90IHByb2R1Y2UgdGhlIGVsZW1lbnQgYmVpbmcgdXBncmFkZWQuXCIpO31maW5hbGx5e2UuY29uc3RydWN0aW9uU3RhY2sucG9wKCl9fWNhdGNoKGYpe3Rocm93IGEuX19DRV9zdGF0ZT0yLGY7fWEuX19DRV9zdGF0ZT0xO2EuX19DRV9kZWZpbml0aW9uPWU7aWYoZS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2spZm9yKGU9ZS5vYnNlcnZlZEF0dHJpYnV0ZXMsYz0wO2M8ZS5sZW5ndGg7YysrKXt2YXIgZD1lW2NdLGg9YS5nZXRBdHRyaWJ1dGUoZCk7bnVsbCE9PWgmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGEsZCxudWxsLGgsbnVsbCl9bChhKSYmYi5jb25uZWN0ZWRDYWxsYmFjayhhKX19fVxuci5wcm90b3R5cGUuY29ubmVjdGVkQ2FsbGJhY2s9ZnVuY3Rpb24oYil7dmFyIGE9Yi5fX0NFX2RlZmluaXRpb247YS5jb25uZWN0ZWRDYWxsYmFjayYmYS5jb25uZWN0ZWRDYWxsYmFjay5jYWxsKGIpfTtyLnByb3RvdHlwZS5kaXNjb25uZWN0ZWRDYWxsYmFjaz1mdW5jdGlvbihiKXt2YXIgYT1iLl9fQ0VfZGVmaW5pdGlvbjthLmRpc2Nvbm5lY3RlZENhbGxiYWNrJiZhLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmNhbGwoYil9O3IucHJvdG90eXBlLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaz1mdW5jdGlvbihiLGEsZSxjLGQpe3ZhciBoPWIuX19DRV9kZWZpbml0aW9uO2guYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJiYtMTxoLm9ic2VydmVkQXR0cmlidXRlcy5pbmRleE9mKGEpJiZoLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjay5jYWxsKGIsYSxlLGMsZCl9O2Z1bmN0aW9uIEIoYixhKXt0aGlzLmM9Yjt0aGlzLmE9YTt0aGlzLmI9dm9pZCAwO0EodGhpcy5jLHRoaXMuYSk7XCJsb2FkaW5nXCI9PT10aGlzLmEucmVhZHlTdGF0ZSYmKHRoaXMuYj1uZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmYuYmluZCh0aGlzKSksdGhpcy5iLm9ic2VydmUodGhpcy5hLHtjaGlsZExpc3Q6ITAsc3VidHJlZTohMH0pKX1mdW5jdGlvbiBDKGIpe2IuYiYmYi5iLmRpc2Nvbm5lY3QoKX1CLnByb3RvdHlwZS5mPWZ1bmN0aW9uKGIpe3ZhciBhPXRoaXMuYS5yZWFkeVN0YXRlO1wiaW50ZXJhY3RpdmVcIiE9PWEmJlwiY29tcGxldGVcIiE9PWF8fEModGhpcyk7Zm9yKGE9MDthPGIubGVuZ3RoO2ErKylmb3IodmFyIGU9YlthXS5hZGRlZE5vZGVzLGM9MDtjPGUubGVuZ3RoO2MrKylBKHRoaXMuYyxlW2NdKX07ZnVuY3Rpb24gY2EoKXt2YXIgYj10aGlzO3RoaXMuYj10aGlzLmE9dm9pZCAwO3RoaXMuYz1uZXcgUHJvbWlzZShmdW5jdGlvbihhKXtiLmI9YTtiLmEmJmEoYi5hKX0pfWZ1bmN0aW9uIEQoYil7aWYoYi5hKXRocm93IEVycm9yKFwiQWxyZWFkeSByZXNvbHZlZC5cIik7Yi5hPXZvaWQgMDtiLmImJmIuYih2b2lkIDApfTtmdW5jdGlvbiBFKGIpe3RoaXMuZj0hMTt0aGlzLmE9Yjt0aGlzLmg9bmV3IE1hcDt0aGlzLmc9ZnVuY3Rpb24oYil7cmV0dXJuIGIoKX07dGhpcy5iPSExO3RoaXMuYz1bXTt0aGlzLmo9bmV3IEIoYixkb2N1bWVudCl9XG5FLnByb3RvdHlwZS5sPWZ1bmN0aW9uKGIsYSl7dmFyIGU9dGhpcztpZighKGEgaW5zdGFuY2VvZiBGdW5jdGlvbikpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9ycyBtdXN0IGJlIGZ1bmN0aW9ucy5cIik7aWYoIWsoYikpdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVGhlIGVsZW1lbnQgbmFtZSAnXCIrYitcIicgaXMgbm90IHZhbGlkLlwiKTtpZih0aGlzLmEuYS5nZXQoYikpdGhyb3cgRXJyb3IoXCJBIGN1c3RvbSBlbGVtZW50IHdpdGggbmFtZSAnXCIrYitcIicgaGFzIGFscmVhZHkgYmVlbiBkZWZpbmVkLlwiKTtpZih0aGlzLmYpdGhyb3cgRXJyb3IoXCJBIGN1c3RvbSBlbGVtZW50IGlzIGFscmVhZHkgYmVpbmcgZGVmaW5lZC5cIik7dGhpcy5mPSEwO3ZhciBjLGQsaCxmLHU7dHJ5e3ZhciBwPWZ1bmN0aW9uKGIpe3ZhciBhPVBbYl07aWYodm9pZCAwIT09YSYmIShhIGluc3RhbmNlb2YgRnVuY3Rpb24pKXRocm93IEVycm9yKFwiVGhlICdcIitiK1wiJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24uXCIpO1xucmV0dXJuIGF9LFA9YS5wcm90b3R5cGU7aWYoIShQIGluc3RhbmNlb2YgT2JqZWN0KSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIGN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9yJ3MgcHJvdG90eXBlIGlzIG5vdCBhbiBvYmplY3QuXCIpO2M9cChcImNvbm5lY3RlZENhbGxiYWNrXCIpO2Q9cChcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIpO2g9cChcImFkb3B0ZWRDYWxsYmFja1wiKTtmPXAoXCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcIik7dT1hLm9ic2VydmVkQXR0cmlidXRlc3x8W119Y2F0Y2godmEpe3JldHVybn1maW5hbGx5e3RoaXMuZj0hMX1iYSh0aGlzLmEsYix7bG9jYWxOYW1lOmIsY29uc3RydWN0b3I6YSxjb25uZWN0ZWRDYWxsYmFjazpjLGRpc2Nvbm5lY3RlZENhbGxiYWNrOmQsYWRvcHRlZENhbGxiYWNrOmgsYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOmYsb2JzZXJ2ZWRBdHRyaWJ1dGVzOnUsY29uc3RydWN0aW9uU3RhY2s6W119KTt0aGlzLmMucHVzaChiKTt0aGlzLmJ8fCh0aGlzLmI9XG4hMCx0aGlzLmcoZnVuY3Rpb24oKXtpZighMSE9PWUuYilmb3IoZS5iPSExLEEoZS5hLGRvY3VtZW50KTswPGUuYy5sZW5ndGg7KXt2YXIgYj1lLmMuc2hpZnQoKTsoYj1lLmguZ2V0KGIpKSYmRChiKX19KSl9O0UucHJvdG90eXBlLmdldD1mdW5jdGlvbihiKXtpZihiPXRoaXMuYS5hLmdldChiKSlyZXR1cm4gYi5jb25zdHJ1Y3Rvcn07RS5wcm90b3R5cGUubz1mdW5jdGlvbihiKXtpZighayhiKSlyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFN5bnRheEVycm9yKFwiJ1wiK2IrXCInIGlzIG5vdCBhIHZhbGlkIGN1c3RvbSBlbGVtZW50IG5hbWUuXCIpKTt2YXIgYT10aGlzLmguZ2V0KGIpO2lmKGEpcmV0dXJuIGEuYzthPW5ldyBjYTt0aGlzLmguc2V0KGIsYSk7dGhpcy5hLmEuZ2V0KGIpJiYtMT09PXRoaXMuYy5pbmRleE9mKGIpJiZEKGEpO3JldHVybiBhLmN9O0UucHJvdG90eXBlLm09ZnVuY3Rpb24oYil7Qyh0aGlzLmopO3ZhciBhPXRoaXMuZzt0aGlzLmc9ZnVuY3Rpb24oZSl7cmV0dXJuIGIoZnVuY3Rpb24oKXtyZXR1cm4gYShlKX0pfX07XG53aW5kb3cuQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5PUU7RS5wcm90b3R5cGUuZGVmaW5lPUUucHJvdG90eXBlLmw7RS5wcm90b3R5cGUuZ2V0PUUucHJvdG90eXBlLmdldDtFLnByb3RvdHlwZS53aGVuRGVmaW5lZD1FLnByb3RvdHlwZS5vO0UucHJvdG90eXBlLnBvbHlmaWxsV3JhcEZsdXNoQ2FsbGJhY2s9RS5wcm90b3R5cGUubTt2YXIgRj13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQsZGE9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50TlMsZWE9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5pbXBvcnROb2RlLGZhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUucHJlcGVuZCxnYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmFwcGVuZCxHPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5jbG9uZU5vZGUsSD13aW5kb3cuTm9kZS5wcm90b3R5cGUuYXBwZW5kQ2hpbGQsST13aW5kb3cuTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlLEo9d2luZG93Lk5vZGUucHJvdG90eXBlLnJlbW92ZUNoaWxkLEs9d2luZG93Lk5vZGUucHJvdG90eXBlLnJlcGxhY2VDaGlsZCxMPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93Lk5vZGUucHJvdG90eXBlLFwidGV4dENvbnRlbnRcIiksTT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoU2hhZG93LE49T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsXG5cImlubmVySFRNTFwiKSxPPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGUsUT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlLFI9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZSxTPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVOUyxUPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGVOUyxVPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVOUyxWPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5pbnNlcnRBZGphY2VudEVsZW1lbnQsaGE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnByZXBlbmQsaWE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmFwcGVuZCxqYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYmVmb3JlLGthPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hZnRlcixsYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVwbGFjZVdpdGgsbWE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZSxcbm5hPXdpbmRvdy5IVE1MRWxlbWVudCxXPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZSxcImlubmVySFRNTFwiKSxYPXdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGUuaW5zZXJ0QWRqYWNlbnRFbGVtZW50O2Z1bmN0aW9uIG9hKCl7dmFyIGI9WTt3aW5kb3cuSFRNTEVsZW1lbnQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKCl7dmFyIGE9dGhpcy5jb25zdHJ1Y3RvcixjPWIuZi5nZXQoYSk7aWYoIWMpdGhyb3cgRXJyb3IoXCJUaGUgY3VzdG9tIGVsZW1lbnQgYmVpbmcgY29uc3RydWN0ZWQgd2FzIG5vdCByZWdpc3RlcmVkIHdpdGggYGN1c3RvbUVsZW1lbnRzYC5cIik7dmFyIGQ9Yy5jb25zdHJ1Y3Rpb25TdGFjaztpZighZC5sZW5ndGgpcmV0dXJuIGQ9Ri5jYWxsKGRvY3VtZW50LGMubG9jYWxOYW1lKSxPYmplY3Quc2V0UHJvdG90eXBlT2YoZCxhLnByb3RvdHlwZSksZC5fX0NFX3N0YXRlPTEsZC5fX0NFX2RlZmluaXRpb249Yyx3KGIsZCksZDt2YXIgYz1kLmxlbmd0aC0xLGg9ZFtjXTtpZihoPT09Zyl0aHJvdyBFcnJvcihcIlRoZSBIVE1MRWxlbWVudCBjb25zdHJ1Y3RvciB3YXMgZWl0aGVyIGNhbGxlZCByZWVudHJhbnRseSBmb3IgdGhpcyBjb25zdHJ1Y3RvciBvciBjYWxsZWQgbXVsdGlwbGUgdGltZXMuXCIpO1xuZFtjXT1nO09iamVjdC5zZXRQcm90b3R5cGVPZihoLGEucHJvdG90eXBlKTt3KGIsaCk7cmV0dXJuIGh9YS5wcm90b3R5cGU9bmEucHJvdG90eXBlO3JldHVybiBhfSgpfTtmdW5jdGlvbiBwYShiLGEsZSl7YS5wcmVwZW5kPWZ1bmN0aW9uKGEpe2Zvcih2YXIgZD1bXSxjPTA7Yzxhcmd1bWVudHMubGVuZ3RoOysrYylkW2MtMF09YXJndW1lbnRzW2NdO2M9ZC5maWx0ZXIoZnVuY3Rpb24oYil7cmV0dXJuIGIgaW5zdGFuY2VvZiBOb2RlJiZsKGIpfSk7ZS5pLmFwcGx5KHRoaXMsZCk7Zm9yKHZhciBmPTA7ZjxjLmxlbmd0aDtmKyspeihiLGNbZl0pO2lmKGwodGhpcykpZm9yKGM9MDtjPGQubGVuZ3RoO2MrKylmPWRbY10sZiBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixmKX07YS5hcHBlbmQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBkPVtdLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7KytjKWRbYy0wXT1hcmd1bWVudHNbY107Yz1kLmZpbHRlcihmdW5jdGlvbihiKXtyZXR1cm4gYiBpbnN0YW5jZW9mIE5vZGUmJmwoYil9KTtlLmFwcGVuZC5hcHBseSh0aGlzLGQpO2Zvcih2YXIgZj0wO2Y8Yy5sZW5ndGg7ZisrKXooYixjW2ZdKTtpZihsKHRoaXMpKWZvcihjPTA7YzxcbmQubGVuZ3RoO2MrKylmPWRbY10sZiBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixmKX19O2Z1bmN0aW9uIHFhKCl7dmFyIGI9WTtxKERvY3VtZW50LnByb3RvdHlwZSxcImNyZWF0ZUVsZW1lbnRcIixmdW5jdGlvbihhKXtpZih0aGlzLl9fQ0VfaGFzUmVnaXN0cnkpe3ZhciBlPWIuYS5nZXQoYSk7aWYoZSlyZXR1cm4gbmV3IGUuY29uc3RydWN0b3J9YT1GLmNhbGwodGhpcyxhKTt3KGIsYSk7cmV0dXJuIGF9KTtxKERvY3VtZW50LnByb3RvdHlwZSxcImltcG9ydE5vZGVcIixmdW5jdGlvbihhLGUpe2E9ZWEuY2FsbCh0aGlzLGEsZSk7dGhpcy5fX0NFX2hhc1JlZ2lzdHJ5P0EoYixhKTp2KGIsYSk7cmV0dXJuIGF9KTtxKERvY3VtZW50LnByb3RvdHlwZSxcImNyZWF0ZUVsZW1lbnROU1wiLGZ1bmN0aW9uKGEsZSl7aWYodGhpcy5fX0NFX2hhc1JlZ2lzdHJ5JiYobnVsbD09PWF8fFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiPT09YSkpe3ZhciBjPWIuYS5nZXQoZSk7aWYoYylyZXR1cm4gbmV3IGMuY29uc3RydWN0b3J9YT1kYS5jYWxsKHRoaXMsYSxlKTt3KGIsYSk7cmV0dXJuIGF9KTtcbnBhKGIsRG9jdW1lbnQucHJvdG90eXBlLHtpOmZhLGFwcGVuZDpnYX0pfTtmdW5jdGlvbiByYSgpe3ZhciBiPVk7ZnVuY3Rpb24gYShhLGMpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLFwidGV4dENvbnRlbnRcIix7ZW51bWVyYWJsZTpjLmVudW1lcmFibGUsY29uZmlndXJhYmxlOiEwLGdldDpjLmdldCxzZXQ6ZnVuY3Rpb24oYSl7aWYodGhpcy5ub2RlVHlwZT09PU5vZGUuVEVYVF9OT0RFKWMuc2V0LmNhbGwodGhpcyxhKTtlbHNle3ZhciBkPXZvaWQgMDtpZih0aGlzLmZpcnN0Q2hpbGQpe3ZhciBlPXRoaXMuY2hpbGROb2Rlcyx1PWUubGVuZ3RoO2lmKDA8dSYmbCh0aGlzKSlmb3IodmFyIGQ9QXJyYXkodSkscD0wO3A8dTtwKyspZFtwXT1lW3BdfWMuc2V0LmNhbGwodGhpcyxhKTtpZihkKWZvcihhPTA7YTxkLmxlbmd0aDthKyspeihiLGRbYV0pfX19KX1xKE5vZGUucHJvdG90eXBlLFwiaW5zZXJ0QmVmb3JlXCIsZnVuY3Rpb24oYSxjKXtpZihhIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCl7dmFyIGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGEuY2hpbGROb2Rlcyk7XG5hPUkuY2FsbCh0aGlzLGEsYyk7aWYobCh0aGlzKSlmb3IoYz0wO2M8ZC5sZW5ndGg7YysrKXgoYixkW2NdKTtyZXR1cm4gYX1kPWwoYSk7Yz1JLmNhbGwodGhpcyxhLGMpO2QmJnooYixhKTtsKHRoaXMpJiZ4KGIsYSk7cmV0dXJuIGN9KTtxKE5vZGUucHJvdG90eXBlLFwiYXBwZW5kQ2hpbGRcIixmdW5jdGlvbihhKXtpZihhIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCl7dmFyIGM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGEuY2hpbGROb2Rlcyk7YT1ILmNhbGwodGhpcyxhKTtpZihsKHRoaXMpKWZvcih2YXIgZD0wO2Q8Yy5sZW5ndGg7ZCsrKXgoYixjW2RdKTtyZXR1cm4gYX1jPWwoYSk7ZD1ILmNhbGwodGhpcyxhKTtjJiZ6KGIsYSk7bCh0aGlzKSYmeChiLGEpO3JldHVybiBkfSk7cShOb2RlLnByb3RvdHlwZSxcImNsb25lTm9kZVwiLGZ1bmN0aW9uKGEpe2E9Ry5jYWxsKHRoaXMsYSk7dGhpcy5vd25lckRvY3VtZW50Ll9fQ0VfaGFzUmVnaXN0cnk/QShiLGEpOnYoYixhKTtcbnJldHVybiBhfSk7cShOb2RlLnByb3RvdHlwZSxcInJlbW92ZUNoaWxkXCIsZnVuY3Rpb24oYSl7dmFyIGM9bChhKSxkPUouY2FsbCh0aGlzLGEpO2MmJnooYixhKTtyZXR1cm4gZH0pO3EoTm9kZS5wcm90b3R5cGUsXCJyZXBsYWNlQ2hpbGRcIixmdW5jdGlvbihhLGMpe2lmKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTthPUsuY2FsbCh0aGlzLGEsYyk7aWYobCh0aGlzKSlmb3IoeihiLGMpLGM9MDtjPGQubGVuZ3RoO2MrKyl4KGIsZFtjXSk7cmV0dXJuIGF9dmFyIGQ9bChhKSxlPUsuY2FsbCh0aGlzLGEsYyksZj1sKHRoaXMpO2YmJnooYixjKTtkJiZ6KGIsYSk7ZiYmeChiLGEpO3JldHVybiBlfSk7TCYmTC5nZXQ/YShOb2RlLnByb3RvdHlwZSxMKTp0KGIsZnVuY3Rpb24oYil7YShiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtmb3IodmFyIGE9W10sYj1cbjA7Yjx0aGlzLmNoaWxkTm9kZXMubGVuZ3RoO2IrKylhLnB1c2godGhpcy5jaGlsZE5vZGVzW2JdLnRleHRDb250ZW50KTtyZXR1cm4gYS5qb2luKFwiXCIpfSxzZXQ6ZnVuY3Rpb24oYSl7Zm9yKDt0aGlzLmZpcnN0Q2hpbGQ7KUouY2FsbCh0aGlzLHRoaXMuZmlyc3RDaGlsZCk7SC5jYWxsKHRoaXMsZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpfX0pfSl9O2Z1bmN0aW9uIHNhKGIpe3ZhciBhPUVsZW1lbnQucHJvdG90eXBlO2EuYmVmb3JlPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxkPTA7ZDxhcmd1bWVudHMubGVuZ3RoOysrZCljW2QtMF09YXJndW1lbnRzW2RdO2Q9Yy5maWx0ZXIoZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBOb2RlJiZsKGEpfSk7amEuYXBwbHkodGhpcyxjKTtmb3IodmFyIGU9MDtlPGQubGVuZ3RoO2UrKyl6KGIsZFtlXSk7aWYobCh0aGlzKSlmb3IoZD0wO2Q8Yy5sZW5ndGg7ZCsrKWU9Y1tkXSxlIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGUpfTthLmFmdGVyPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxkPTA7ZDxhcmd1bWVudHMubGVuZ3RoOysrZCljW2QtMF09YXJndW1lbnRzW2RdO2Q9Yy5maWx0ZXIoZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBOb2RlJiZsKGEpfSk7a2EuYXBwbHkodGhpcyxjKTtmb3IodmFyIGU9MDtlPGQubGVuZ3RoO2UrKyl6KGIsZFtlXSk7aWYobCh0aGlzKSlmb3IoZD1cbjA7ZDxjLmxlbmd0aDtkKyspZT1jW2RdLGUgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZSl9O2EucmVwbGFjZVdpdGg9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGFyZ3VtZW50cy5sZW5ndGg7KytkKWNbZC0wXT1hcmd1bWVudHNbZF07dmFyIGQ9Yy5maWx0ZXIoZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBOb2RlJiZsKGEpfSksZT1sKHRoaXMpO2xhLmFwcGx5KHRoaXMsYyk7Zm9yKHZhciBmPTA7ZjxkLmxlbmd0aDtmKyspeihiLGRbZl0pO2lmKGUpZm9yKHooYix0aGlzKSxkPTA7ZDxjLmxlbmd0aDtkKyspZT1jW2RdLGUgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZSl9O2EucmVtb3ZlPWZ1bmN0aW9uKCl7dmFyIGE9bCh0aGlzKTttYS5jYWxsKHRoaXMpO2EmJnooYix0aGlzKX19O2Z1bmN0aW9uIHRhKCl7dmFyIGI9WTtmdW5jdGlvbiBhKGEsYyl7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsXCJpbm5lckhUTUxcIix7ZW51bWVyYWJsZTpjLmVudW1lcmFibGUsY29uZmlndXJhYmxlOiEwLGdldDpjLmdldCxzZXQ6ZnVuY3Rpb24oYSl7dmFyIGQ9dGhpcyxlPXZvaWQgMDtsKHRoaXMpJiYoZT1bXSxuKHRoaXMsZnVuY3Rpb24oYSl7YSE9PWQmJmUucHVzaChhKX0pKTtjLnNldC5jYWxsKHRoaXMsYSk7aWYoZSlmb3IodmFyIGY9MDtmPGUubGVuZ3RoO2YrKyl7dmFyIGg9ZVtmXTsxPT09aC5fX0NFX3N0YXRlJiZiLmRpc2Nvbm5lY3RlZENhbGxiYWNrKGgpfXRoaXMub3duZXJEb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5P0EoYix0aGlzKTp2KGIsdGhpcyk7cmV0dXJuIGF9fSl9ZnVuY3Rpb24gZShhLGMpe3EoYSxcImluc2VydEFkamFjZW50RWxlbWVudFwiLGZ1bmN0aW9uKGEsZCl7dmFyIGU9bChkKTthPWMuY2FsbCh0aGlzLGEsZCk7ZSYmeihiLGQpO2woYSkmJngoYixkKTtcbnJldHVybiBhfSl9TT9xKEVsZW1lbnQucHJvdG90eXBlLFwiYXR0YWNoU2hhZG93XCIsZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX19DRV9zaGFkb3dSb290PWE9TS5jYWxsKHRoaXMsYSl9KTpudWxsO2lmKE4mJk4uZ2V0KWEoRWxlbWVudC5wcm90b3R5cGUsTik7ZWxzZSBpZihXJiZXLmdldClhKEhUTUxFbGVtZW50LnByb3RvdHlwZSxXKTtlbHNle3ZhciBjPUYuY2FsbChkb2N1bWVudCxcImRpdlwiKTt0KGIsZnVuY3Rpb24oYil7YShiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gRy5jYWxsKHRoaXMsITApLmlubmVySFRNTH0sc2V0OmZ1bmN0aW9uKGEpe3ZhciBiPVwidGVtcGxhdGVcIj09PXRoaXMubG9jYWxOYW1lP3RoaXMuY29udGVudDp0aGlzO2ZvcihjLmlubmVySFRNTD1hOzA8Yi5jaGlsZE5vZGVzLmxlbmd0aDspSi5jYWxsKGIsXG5iLmNoaWxkTm9kZXNbMF0pO2Zvcig7MDxjLmNoaWxkTm9kZXMubGVuZ3RoOylILmNhbGwoYixjLmNoaWxkTm9kZXNbMF0pfX0pfSl9cShFbGVtZW50LnByb3RvdHlwZSxcInNldEF0dHJpYnV0ZVwiLGZ1bmN0aW9uKGEsYyl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gUS5jYWxsKHRoaXMsYSxjKTt2YXIgZD1PLmNhbGwodGhpcyxhKTtRLmNhbGwodGhpcyxhLGMpO2M9Ty5jYWxsKHRoaXMsYSk7ZCE9PWMmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYSxkLGMsbnVsbCl9KTtxKEVsZW1lbnQucHJvdG90eXBlLFwic2V0QXR0cmlidXRlTlNcIixmdW5jdGlvbihhLGMsZSl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gVC5jYWxsKHRoaXMsYSxjLGUpO3ZhciBkPVMuY2FsbCh0aGlzLGEsYyk7VC5jYWxsKHRoaXMsYSxjLGUpO2U9Uy5jYWxsKHRoaXMsYSxjKTtkIT09ZSYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcyxjLGQsZSxhKX0pO3EoRWxlbWVudC5wcm90b3R5cGUsXG5cInJlbW92ZUF0dHJpYnV0ZVwiLGZ1bmN0aW9uKGEpe2lmKDEhPT10aGlzLl9fQ0Vfc3RhdGUpcmV0dXJuIFIuY2FsbCh0aGlzLGEpO3ZhciBjPU8uY2FsbCh0aGlzLGEpO1IuY2FsbCh0aGlzLGEpO251bGwhPT1jJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGEsYyxudWxsLG51bGwpfSk7cShFbGVtZW50LnByb3RvdHlwZSxcInJlbW92ZUF0dHJpYnV0ZU5TXCIsZnVuY3Rpb24oYSxjKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBVLmNhbGwodGhpcyxhLGMpO3ZhciBkPVMuY2FsbCh0aGlzLGEsYyk7VS5jYWxsKHRoaXMsYSxjKTt2YXIgZT1TLmNhbGwodGhpcyxhLGMpO2QhPT1lJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGMsZCxlLGEpfSk7WD9lKEhUTUxFbGVtZW50LnByb3RvdHlwZSxYKTpWP2UoRWxlbWVudC5wcm90b3R5cGUsVik6Y29uc29sZS53YXJuKFwiQ3VzdG9tIEVsZW1lbnRzOiBgRWxlbWVudCNpbnNlcnRBZGphY2VudEVsZW1lbnRgIHdhcyBub3QgcGF0Y2hlZC5cIik7XG5wYShiLEVsZW1lbnQucHJvdG90eXBlLHtpOmhhLGFwcGVuZDppYX0pO3NhKGIpfTtcbnZhciBaPXdpbmRvdy5jdXN0b21FbGVtZW50cztpZighWnx8Wi5mb3JjZVBvbHlmaWxsfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBaLmRlZmluZXx8XCJmdW5jdGlvblwiIT10eXBlb2YgWi5nZXQpe3ZhciBZPW5ldyByO29hKCk7cWEoKTtyYSgpO3RhKCk7ZG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT0hMDt2YXIgdWE9bmV3IEUoWSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdyxcImN1c3RvbUVsZW1lbnRzXCIse2NvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwLHZhbHVlOnVhfSl9O1xufSkuY2FsbChzZWxmKTtcbn1cbn0oKSk7IiwiLyogVU1ELmRlZmluZSAqL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgY3VzdG9tTG9hZGVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Y3VzdG9tTG9hZGVyKGZhY3RvcnksICdkb20nKTtcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9IGVsc2Uge1xuXHRcdHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHR3aW5kb3cuZG9tID0gZmFjdG9yeSgpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXJcblx0XHR1aWRzID0ge30sXG5cdFx0ZGVzdHJveWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cblx0ZnVuY3Rpb24gaXNEaW1lbnNpb24gKHByb3ApIHtcblx0XHRyZXR1cm4gIS9vcGFjaXR5fGluZGV4fGZsZXh8d2VpZ2h0fF5zZGNzZGNvcmRlcnx0YWJ8bWl0ZXJ8Z3JvdXB8em9vbS9pLnRlc3QocHJvcClcblx0fVxuXG5cdGZ1bmN0aW9uIGlzTnVtYmVyICh2YWx1ZSkge1xuXHRcdGlmICgvXFxzLy50ZXN0KHZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHVpZCAodHlwZSkge1xuXHRcdHR5cGUgPSB0eXBlIHx8ICd1aWQnO1xuXHRcdGlmICh1aWRzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHVpZHNbdHlwZV0gPSAwO1xuXHRcdH1cblx0XHR2YXIgaWQgPSB0eXBlICsgJy0nICsgKHVpZHNbdHlwZV0gKyAxKTtcblx0XHR1aWRzW3R5cGVdKys7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cblx0ZnVuY3Rpb24gaXNOb2RlIChpdGVtKSB7XG5cdFx0Ly8gc2FmZXIgdGVzdCBmb3IgY3VzdG9tIGVsZW1lbnRzIGluIEZGICh3aXRoIHdjIHNoaW0pXG5cdFx0Ly8gZnJhZ21lbnQgaXMgYSBzcGVjaWFsIGNhc2Vcblx0XHRyZXR1cm4gISFpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAodHlwZW9mIGl0ZW0uaW5uZXJIVE1MID09PSAnc3RyaW5nJyB8fCBpdGVtLm5vZGVOYW1lID09PSAnI2RvY3VtZW50LWZyYWdtZW50Jyk7XG5cdH1cblxuXHRmdW5jdGlvbiBieUlkIChpdGVtKSB7XG5cdFx0aWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW0pO1xuXHRcdH1cblx0XHRyZXR1cm4gaXRlbTtcblx0fVxuXG5cdGZ1bmN0aW9uIHN0eWxlIChub2RlLCBwcm9wLCB2YWx1ZSkge1xuXHRcdHZhciBrZXksIGNvbXB1dGVkLCByZXN1bHQ7XG5cdFx0aWYgKHR5cGVvZiBwcm9wID09PSAnb2JqZWN0Jykge1xuXHRcdFx0Ly8gb2JqZWN0IHNldHRlclxuXHRcdFx0T2JqZWN0LmtleXMocHJvcCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdHN0eWxlKG5vZGUsIGtleSwgcHJvcFtrZXldKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSBlbHNlIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBwcm9wZXJ0eSBzZXR0ZXJcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRGltZW5zaW9uKHByb3ApKSB7XG5cdFx0XHRcdHZhbHVlICs9ICdweCc7XG5cdFx0XHR9XG5cdFx0XHRub2RlLnN0eWxlW3Byb3BdID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gZ2V0dGVyLCBpZiBhIHNpbXBsZSBzdHlsZVxuXHRcdGlmIChub2RlLnN0eWxlW3Byb3BdKSB7XG5cdFx0XHRyZXN1bHQgPSBub2RlLnN0eWxlW3Byb3BdO1xuXHRcdFx0aWYgKC9weC8udGVzdChyZXN1bHQpKSB7XG5cdFx0XHRcdHJldHVybiBwYXJzZUZsb2F0KHJlc3VsdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoLyUvLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdChyZXN1bHQpICogMC4wMTtcblx0XHRcdH1cblx0XHRcdGlmIChpc051bWJlcihyZXN1bHQpKSB7XG5cdFx0XHRcdHJldHVybiBwYXJzZUZsb2F0KHJlc3VsdCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdC8vIGdldHRlciwgY29tcHV0ZWRcblx0XHRjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuXHRcdGlmIChjb21wdXRlZFtwcm9wXSkge1xuXHRcdFx0cmVzdWx0ID0gY29tcHV0ZWRbcHJvcF07XG5cdFx0XHRpZiAoaXNOdW1iZXIocmVzdWx0KSkge1xuXHRcdFx0XHRyZXR1cm4gcGFyc2VGbG9hdChyZXN1bHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNvbXB1dGVkW3Byb3BdO1xuXHRcdH1cblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRmdW5jdGlvbiBhdHRyIChub2RlLCBwcm9wLCB2YWx1ZSkge1xuXHRcdHZhciBrZXk7XG5cblx0XHRpZiAodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKSB7XG5cblx0XHRcdHZhciBib29scyA9IHt9O1xuXHRcdFx0dmFyIHN0cmluZ3MgPSB7fTtcblx0XHRcdHZhciBvYmplY3RzID0ge307XG5cdFx0XHR2YXIgZXZlbnRzID0ge307XG5cdFx0XHRPYmplY3Qua2V5cyhwcm9wKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBwcm9wW2tleV0gPT09ICdib29sZWFuJykge1xuXHRcdFx0XHRcdGJvb2xzW2tleV0gPSBwcm9wW2tleV07XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIHByb3Bba2V5XSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0XHRvYmplY3RzW2tleV0gPSBwcm9wW2tleV07XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIHByb3Bba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGlmICgvb25bQS1aXS8udGVzdChrZXkpKSB7XG5cdFx0XHRcdFx0XHRldmVudHNba2V5XSA9IHByb3Bba2V5XTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc29sZS53YXJuKCdkb20gd2FybmluZzogZnVuY3Rpb24gdXNlZCB3aXRoIGBvbkV2ZW50YCBzeW50YXgnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3RyaW5nc1trZXldID0gcHJvcFtrZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gYXNzaWduaW5nIHByb3BlcnRpZXMgaW4gc3BlY2lmaWMgb3JkZXIgb2YgdHlwZSwgbmFtZWx5IG9iamVjdHMgbGFzdFxuXHRcdFx0T2JqZWN0LmtleXMoYm9vbHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBhdHRyKG5vZGUsIGtleSwgcHJvcFtrZXldKTsgfSk7XG5cdFx0XHRPYmplY3Qua2V5cyhzdHJpbmdzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgYXR0cihub2RlLCBrZXksIHByb3Bba2V5XSk7IH0pO1xuXHRcdFx0T2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgYXR0cihub2RlLCBrZXksIHByb3Bba2V5XSk7IH0pO1xuXHRcdFx0T2JqZWN0LmtleXMob2JqZWN0cykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IGF0dHIobm9kZSwga2V5LCBwcm9wW2tleV0pOyB9KTtcblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGlmIChwcm9wID09PSAndGV4dCcgfHwgcHJvcCA9PT0gJ2h0bWwnIHx8IHByb3AgPT09ICdpbm5lckhUTUwnKSB7XG5cdFx0XHRcdC8vIGlnbm9yZSwgaGFuZGxlZCBkdXJpbmcgY3JlYXRpb25cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocHJvcCA9PT0gJ2NsYXNzTmFtZScgfHwgcHJvcCA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRkb20uY2xhc3NMaXN0LmFkZChub2RlLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChwcm9wID09PSAnc3R5bGUnKSB7XG5cdFx0XHRcdHN0eWxlKG5vZGUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHByb3AgPT09ICdhdHRyJykge1xuXHRcdFx0XHQvLyBiYWNrIGNvbXBhdFxuXHRcdFx0XHRhdHRyKG5vZGUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRhdHRhY2hFdmVudChub2RlLCBwcm9wLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdC8vIG9iamVjdCwgbGlrZSAnZGF0YSdcblx0XHRcdFx0bm9kZVtwcm9wXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRub2RlLnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUocHJvcCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhdHRhY2hFdmVudCAobm9kZSwgcHJvcCwgdmFsdWUpIHtcblx0XHR2YXIgZXZlbnQgPSBwcm9wLnJlcGxhY2UoJ29uJywgJycpLnRvTG93ZXJDYXNlKCk7XG5cdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCB2YWx1ZSk7XG5cblx0XHR2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbihtdXRhdGlvbnNMaXN0KSB7XG5cdFx0XHRtdXRhdGlvbnNMaXN0LmZvckVhY2goZnVuY3Rpb24gKG11dGF0aW9uKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb24ucmVtb3ZlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFyIG4gPSBtdXRhdGlvbi5yZW1vdmVkTm9kZXNbaV07XG5cdFx0XHRcdFx0aWYgKG4gPT09IG5vZGUpIHtcblx0XHRcdFx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdmFsdWUpO1xuXHRcdFx0XHRcdFx0b2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcblx0XHRvYnNlcnZlci5vYnNlcnZlKG5vZGUucGFyZW50Tm9kZSB8fCBkb2N1bWVudC5ib2R5LCB7IGNoaWxkTGlzdDogdHJ1ZSB9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJveCAobm9kZSkge1xuXHRcdGlmIChub2RlID09PSB3aW5kb3cpIHtcblx0XHRcdG5vZGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0fVxuXHRcdC8vIG5vZGUgZGltZW5zaW9uc1xuXHRcdC8vIHJldHVybmVkIG9iamVjdCBpcyBpbW11dGFibGVcblx0XHQvLyBhZGQgc2Nyb2xsIHBvc2l0aW9uaW5nIGFuZCBjb252ZW5pZW5jZSBhYmJyZXZpYXRpb25zXG5cdFx0dmFyXG5cdFx0XHRkaW1lbnNpb25zID0gYnlJZChub2RlKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dG9wOiBkaW1lbnNpb25zLnRvcCxcblx0XHRcdHJpZ2h0OiBkaW1lbnNpb25zLnJpZ2h0LFxuXHRcdFx0Ym90dG9tOiBkaW1lbnNpb25zLmJvdHRvbSxcblx0XHRcdGxlZnQ6IGRpbWVuc2lvbnMubGVmdCxcblx0XHRcdGhlaWdodDogZGltZW5zaW9ucy5oZWlnaHQsXG5cdFx0XHRoOiBkaW1lbnNpb25zLmhlaWdodCxcblx0XHRcdHdpZHRoOiBkaW1lbnNpb25zLndpZHRoLFxuXHRcdFx0dzogZGltZW5zaW9ucy53aWR0aCxcblx0XHRcdHNjcm9sbFk6IHdpbmRvdy5zY3JvbGxZLFxuXHRcdFx0c2Nyb2xsWDogd2luZG93LnNjcm9sbFgsXG5cdFx0XHR4OiBkaW1lbnNpb25zLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQsXG5cdFx0XHR5OiBkaW1lbnNpb25zLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiByZWxCb3ggKG5vZGUsIHBhcmVudE5vZGUpIHtcblx0XHRjb25zdCBwYXJlbnQgPSBwYXJlbnROb2RlIHx8IG5vZGUucGFyZW50Tm9kZTtcblx0XHRjb25zdCBwQm94ID0gYm94KHBhcmVudCk7XG5cdFx0Y29uc3QgYnggPSBib3gobm9kZSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dzogYngudyxcblx0XHRcdGg6IGJ4LmgsXG5cdFx0XHR4OiBieC5sZWZ0IC0gcEJveC5sZWZ0LFxuXHRcdFx0eTogYngudG9wIC0gcEJveC50b3Bcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gc2l6ZSAobm9kZSwgdHlwZSkge1xuXHRcdGlmIChub2RlID09PSB3aW5kb3cpIHtcblx0XHRcdG5vZGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0fVxuXHRcdGlmICh0eXBlID09PSAnc2Nyb2xsJykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dzogbm9kZS5zY3JvbGxXaWR0aCxcblx0XHRcdFx0aDogbm9kZS5zY3JvbGxIZWlnaHRcblx0XHRcdH07XG5cdFx0fVxuXHRcdGlmICh0eXBlID09PSAnY2xpZW50Jykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dzogbm9kZS5jbGllbnRXaWR0aCxcblx0XHRcdFx0aDogbm9kZS5jbGllbnRIZWlnaHRcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHR3OiBub2RlLm9mZnNldFdpZHRoLFxuXHRcdFx0aDogbm9kZS5vZmZzZXRIZWlnaHRcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcXVlcnkgKG5vZGUsIHNlbGVjdG9yKSB7XG5cdFx0aWYgKCFzZWxlY3Rvcikge1xuXHRcdFx0c2VsZWN0b3IgPSBub2RlO1xuXHRcdFx0bm9kZSA9IGRvY3VtZW50O1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHF1ZXJ5QWxsIChub2RlLCBzZWxlY3Rvcikge1xuXHRcdGlmICghc2VsZWN0b3IpIHtcblx0XHRcdHNlbGVjdG9yID0gbm9kZTtcblx0XHRcdG5vZGUgPSBkb2N1bWVudDtcblx0XHR9XG5cdFx0dmFyIG5vZGVzID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuXHRcdGlmICghbm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0byBBcnJheSBhbmQgcmV0dXJuIGl0XG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvRG9tIChodG1sLCBvcHRpb25zLCBwYXJlbnQpIHtcblx0XHR2YXIgbm9kZSA9IGRvbSgnZGl2JywgeyBodG1sOiBodG1sIH0pO1xuXHRcdHBhcmVudCA9IGJ5SWQocGFyZW50IHx8IG9wdGlvbnMpO1xuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdHdoaWxlIChub2RlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdFx0cGFyZW50LmFwcGVuZENoaWxkKG5vZGUuZmlyc3RDaGlsZCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbm9kZS5maXJzdENoaWxkO1xuXHRcdH1cblx0XHRpZiAoaHRtbC5pbmRleE9mKCc8JykgIT09IDApIHtcblx0XHRcdHJldHVybiBub2RlO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZS5maXJzdENoaWxkO1xuXHR9XG5cblx0ZnVuY3Rpb24gZnJvbURvbSAobm9kZSkge1xuXHRcdGZ1bmN0aW9uIGdldEF0dHJzIChub2RlKSB7XG5cdFx0XHR2YXIgYXR0LCBpLCBhdHRycyA9IHt9O1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRhdHQgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG5cdFx0XHRcdGF0dHJzW2F0dC5sb2NhbE5hbWVdID0gbm9ybWFsaXplKGF0dC52YWx1ZSA9PT0gJycgPyB0cnVlIDogYXR0LnZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhdHRycztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRUZXh0IChub2RlKSB7XG5cdFx0XHR2YXIgaSwgdCwgdGV4dCA9ICcnO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR0ID0gbm9kZS5jaGlsZE5vZGVzW2ldO1xuXHRcdFx0XHRpZiAodC5ub2RlVHlwZSA9PT0gMyAmJiB0LnRleHRDb250ZW50LnRyaW0oKSkge1xuXHRcdFx0XHRcdHRleHQgKz0gdC50ZXh0Q29udGVudC50cmltKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0ZXh0O1xuXHRcdH1cblxuXHRcdHZhciBpLCBvYmplY3QgPSBnZXRBdHRycyhub2RlKTtcblx0XHRvYmplY3QudGV4dCA9IGdldFRleHQobm9kZSk7XG5cdFx0b2JqZWN0LmNoaWxkcmVuID0gW107XG5cdFx0aWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRvYmplY3QuY2hpbGRyZW4ucHVzaChmcm9tRG9tKG5vZGUuY2hpbGRyZW5baV0pKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZENoaWxkcmVuIChub2RlLCBjaGlsZHJlbikge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoY2hpbGRyZW5baV0pIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGNoaWxkcmVuW2ldID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0bm9kZS5hcHBlbmRDaGlsZCh0b0RvbShjaGlsZHJlbltpXSkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKGNoaWxkcmVuW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoY2hpbGRyZW4pIHtcblx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGRyZW4pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGFkZENvbnRlbnQgKG5vZGUsIG9wdGlvbnMpIHtcblx0XHR2YXIgaHRtbDtcblx0XHRpZiAob3B0aW9ucy5odG1sICE9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5pbm5lckhUTUwgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aHRtbCA9IG9wdGlvbnMuaHRtbCB8fCBvcHRpb25zLmlubmVySFRNTCB8fCAnJztcblx0XHRcdGlmICh0eXBlb2YgaHRtbCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0YWRkQ2hpbGRyZW4obm9kZSwgaHRtbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBjYXJlZnVsIGFzc3VtaW5nIHRleHRDb250ZW50IC1cblx0XHRcdFx0Ly8gbWlzc2VzIHNvbWUgSFRNTCwgc3VjaCBhcyBlbnRpdGllcyAoJm5wc3A7KVxuXHRcdFx0XHRub2RlLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChvcHRpb25zLnRleHQpIHtcblx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob3B0aW9ucy50ZXh0KSk7XG5cdFx0fVxuXHRcdGlmIChvcHRpb25zLmNoaWxkcmVuKSB7XG5cdFx0XHRhZGRDaGlsZHJlbihub2RlLCBvcHRpb25zLmNoaWxkcmVuKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBkb20gKG5vZGVUeXBlLCBvcHRpb25zLCBwYXJlbnQsIHByZXBlbmQpIHtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdC8vIGlmIGZpcnN0IGFyZ3VtZW50IGlzIGEgc3RyaW5nIGFuZCBzdGFydHMgd2l0aCA8LCBwYXNzIHRvIHRvRG9tKClcblx0XHRpZiAobm9kZVR5cGUuaW5kZXhPZignPCcpID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gdG9Eb20obm9kZVR5cGUsIG9wdGlvbnMsIHBhcmVudCk7XG5cdFx0fVxuXG5cdFx0dmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVUeXBlKTtcblxuXHRcdHBhcmVudCA9IGJ5SWQocGFyZW50KTtcblxuXHRcdGFkZENvbnRlbnQobm9kZSwgb3B0aW9ucyk7XG5cblx0XHRhdHRyKG5vZGUsIG9wdGlvbnMpO1xuXG5cdFx0aWYgKHBhcmVudCAmJiBpc05vZGUocGFyZW50KSkge1xuXHRcdFx0aWYgKHByZXBlbmQgJiYgcGFyZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuXHRcdFx0XHRwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudC5jaGlsZHJlblswXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cblxuXHRmdW5jdGlvbiBpbnNlcnRBZnRlciAocmVmTm9kZSwgbm9kZSkge1xuXHRcdHZhciBzaWJsaW5nID0gcmVmTm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG5cdFx0aWYgKCFzaWJsaW5nKSB7XG5cdFx0XHRyZWZOb2RlLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlZk5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgc2libGluZyk7XG5cdFx0fVxuXHRcdHJldHVybiBzaWJsaW5nO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGVzdHJveSAobm9kZSkge1xuXHRcdC8vIGRlc3Ryb3lzIGEgbm9kZSBjb21wbGV0ZWx5XG5cdFx0Ly9cblx0XHRpZiAobm9kZSkge1xuXHRcdFx0bm9kZS5kZXN0cm95ZWQgPSB0cnVlO1xuXHRcdFx0ZGVzdHJveWVyLmFwcGVuZENoaWxkKG5vZGUpO1xuXHRcdFx0ZGVzdHJveWVyLmlubmVySFRNTCA9ICcnO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFuIChub2RlLCBkaXNwb3NlKSB7XG5cdFx0Ly9cdFJlbW92ZXMgYWxsIGNoaWxkIG5vZGVzXG5cdFx0Ly9cdFx0ZGlzcG9zZTogZGVzdHJveSBjaGlsZCBub2Rlc1xuXHRcdGlmIChkaXNwb3NlKSB7XG5cdFx0XHR3aGlsZSAobm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0ZGVzdHJveShub2RlLmNoaWxkcmVuWzBdKTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0d2hpbGUgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRub2RlLnJlbW92ZUNoaWxkKG5vZGUuY2hpbGRyZW5bMF0pO1xuXHRcdH1cblx0fVxuXG5cdGRvbS5mcmFnID0gZnVuY3Rpb24gKG5vZGVzKSB7XG5cdFx0dmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnLmFwcGVuZENoaWxkKGFyZ3VtZW50c1tpXSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KG5vZGVzKSkge1xuXHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRcdFx0ZnJhZy5hcHBlbmRDaGlsZChuKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmcmFnLmFwcGVuZENoaWxkKG5vZGVzKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZyYWc7XG5cdH07XG5cblx0ZG9tLmNsYXNzTGlzdCA9IHtcblx0XHQvLyBpbiBhZGRpdGlvbiB0byBmaXhpbmcgSUUxMS10b2dnbGUsXG5cdFx0Ly8gdGhlc2UgbWV0aG9kcyBhbHNvIGhhbmRsZSBhcnJheXNcblx0XHRyZW1vdmU6IGZ1bmN0aW9uIChub2RlLCBuYW1lcykge1xuXHRcdFx0dG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGFkZDogZnVuY3Rpb24gKG5vZGUsIG5hbWVzKSB7XG5cdFx0XHR0b0FycmF5KG5hbWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRcdG5vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Y29udGFpbnM6IGZ1bmN0aW9uIChub2RlLCBuYW1lcykge1xuXHRcdFx0cmV0dXJuIHRvQXJyYXkobmFtZXMpLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRcdHJldHVybiBub2RlLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0dG9nZ2xlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMsIHZhbHVlKSB7XG5cdFx0XHRuYW1lcyA9IHRvQXJyYXkobmFtZXMpO1xuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0Ly8gdXNlIHN0YW5kYXJkIGZ1bmN0aW9uYWxpdHksIHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0XHRuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRcdFx0bm9kZS5jbGFzc0xpc3QudG9nZ2xlKG5hbWUsIHZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHQvLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgdGhlIHNlY29uZCBwYXJhbWV0ZXJcblx0XHRcdGVsc2UgaWYgKHZhbHVlKSB7XG5cdFx0XHRcdG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0XHRub2RlLmNsYXNzTGlzdC5hZGQobmFtZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiB0b0FycmF5IChuYW1lcykge1xuXHRcdGlmICghbmFtZXMpIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdFx0cmV0dXJuIG5hbWVzLnNwbGl0KCcgJykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRyZXR1cm4gbmFtZS50cmltKCk7XG5cdFx0fSkuZmlsdGVyKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRyZXR1cm4gISFuYW1lO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplICh2YWwpIHtcblx0XHRpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHZhbCA9IHZhbC50cmltKCk7XG5cdFx0XHRpZiAodmFsID09PSAnZmFsc2UnKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gZWxzZSBpZiAodmFsID09PSAnbnVsbCcpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9IGVsc2UgaWYgKHZhbCA9PT0gJ3RydWUnKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Ly8gZmluZHMgc3RyaW5ncyB0aGF0IHN0YXJ0IHdpdGggbnVtYmVycywgYnV0IGFyZSBub3QgbnVtYmVyczpcblx0XHRcdC8vICcydGVhbScgJzEyMyBTdHJlZXQnLCAnMS0yLTMnLCBldGNcblx0XHRcdGlmICgoJycgKyB2YWwpLnJlcGxhY2UoLy0/XFxkKlxcLj9cXGQqLywgJycpLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIWlzTmFOKHBhcnNlRmxvYXQodmFsKSkpIHtcblx0XHRcdHJldHVybiBwYXJzZUZsb2F0KHZhbCk7XG5cdFx0fVxuXHRcdHJldHVybiB2YWw7XG5cdH1cblxuXHRkb20ubm9ybWFsaXplID0gbm9ybWFsaXplO1xuXHRkb20uY2xlYW4gPSBjbGVhbjtcblx0ZG9tLnF1ZXJ5ID0gcXVlcnk7XG5cdGRvbS5xdWVyeUFsbCA9IHF1ZXJ5QWxsO1xuXHRkb20uYnlJZCA9IGJ5SWQ7XG5cdGRvbS5hdHRyID0gYXR0cjtcblx0ZG9tLmJveCA9IGJveDtcblx0ZG9tLnN0eWxlID0gc3R5bGU7XG5cdGRvbS5kZXN0cm95ID0gZGVzdHJveTtcblx0ZG9tLnVpZCA9IHVpZDtcblx0ZG9tLmlzTm9kZSA9IGlzTm9kZTtcblx0ZG9tLnRvRG9tID0gdG9Eb207XG5cdGRvbS5mcm9tRG9tID0gZnJvbURvbTtcblx0ZG9tLmluc2VydEFmdGVyID0gaW5zZXJ0QWZ0ZXI7XG5cdGRvbS5zaXplID0gc2l6ZTtcblx0ZG9tLnJlbEJveCA9IHJlbEJveDtcblxuXHRyZXR1cm4gZG9tO1xufSkpO1xuIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgY3VzdG9tTG9hZGVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Y3VzdG9tTG9hZGVyKGZhY3RvcnksICdvbicpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdH0gZWxzZSB7XG5cdFx0cm9vdC5yZXR1cm5FeHBvcnRzID0gd2luZG93Lm9uID0gZmFjdG9yeSgpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIG1haW4gZnVuY3Rpb25cblxuXHRmdW5jdGlvbiBvbiAobm9kZSwgZXZlbnROYW1lLCBmaWx0ZXIsIGhhbmRsZXIpIHtcblx0XHQvLyBub3JtYWxpemUgcGFyYW1ldGVyc1xuXHRcdGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdG5vZGUgPSBnZXROb2RlQnlJZChub2RlKTtcblx0XHR9XG5cblx0XHQvLyBwcmVwYXJlIGEgY2FsbGJhY2tcblx0XHR2YXIgY2FsbGJhY2sgPSBtYWtlQ2FsbGJhY2sobm9kZSwgZmlsdGVyLCBoYW5kbGVyKTtcblxuXHRcdC8vIGZ1bmN0aW9uYWwgZXZlbnRcblx0XHRpZiAodHlwZW9mIGV2ZW50TmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmV0dXJuIGV2ZW50TmFtZShub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gc3BlY2lhbCBjYXNlOiBrZXlkb3duL2tleXVwIHdpdGggYSBsaXN0IG9mIGV4cGVjdGVkIGtleXNcblx0XHQvLyBUT0RPOiBjb25zaWRlciByZXBsYWNpbmcgd2l0aCBhbiBleHBsaWNpdCBldmVudCBmdW5jdGlvbjpcblx0XHQvLyB2YXIgaCA9IG9uKG5vZGUsIG9uS2V5RXZlbnQoJ2tleXVwJywgL0VudGVyLEVzYy8pLCBjYWxsYmFjayk7XG5cdFx0dmFyIGtleUV2ZW50ID0gL14oa2V5dXB8a2V5ZG93bik6KC4rKSQvLmV4ZWMoZXZlbnROYW1lKTtcblx0XHRpZiAoa2V5RXZlbnQpIHtcblx0XHRcdHJldHVybiBvbktleUV2ZW50KGtleUV2ZW50WzFdLCBuZXcgUmVnRXhwKGtleUV2ZW50WzJdLnNwbGl0KCcsJykuam9pbignfCcpKSkobm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIGhhbmRsZSBtdWx0aXBsZSBldmVudCB0eXBlcywgbGlrZTogb24obm9kZSwgJ21vdXNldXAsIG1vdXNlZG93bicsIGNhbGxiYWNrKTtcblx0XHRpZiAoLywvLnRlc3QoZXZlbnROYW1lKSkge1xuXHRcdFx0cmV0dXJuIG9uLm1ha2VNdWx0aUhhbmRsZShldmVudE5hbWUuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIG5hbWUudHJpbSgpO1xuXHRcdFx0fSkuZmlsdGVyKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRcdHJldHVybiBuYW1lO1xuXHRcdFx0fSkubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHRcdHJldHVybiBvbihub2RlLCBuYW1lLCBjYWxsYmFjayk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIHJlZ2lzdGVyZWQgZnVuY3Rpb25hbCBldmVudHNcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9uLmV2ZW50cywgZXZlbnROYW1lKSkge1xuXHRcdFx0cmV0dXJuIG9uLmV2ZW50c1tldmVudE5hbWVdKG5vZGUsIGNhbGxiYWNrKTtcblx0XHR9XG5cblx0XHQvLyBzcGVjaWFsIGNhc2U6IGxvYWRpbmcgYW4gaW1hZ2Vcblx0XHRpZiAoZXZlbnROYW1lID09PSAnbG9hZCcgJiYgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdpbWcnKSB7XG5cdFx0XHRyZXR1cm4gb25JbWFnZUxvYWQobm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIHNwZWNpYWwgY2FzZTogbW91c2V3aGVlbFxuXHRcdGlmIChldmVudE5hbWUgPT09ICd3aGVlbCcpIHtcblx0XHRcdC8vIHBhc3MgdGhyb3VnaCwgYnV0IGZpcnN0IGN1cnJ5IGNhbGxiYWNrIHRvIHdoZWVsIGV2ZW50c1xuXHRcdFx0Y2FsbGJhY2sgPSBub3JtYWxpemVXaGVlbEV2ZW50KGNhbGxiYWNrKTtcblx0XHRcdGlmICghaGFzV2hlZWwpIHtcblx0XHRcdFx0Ly8gb2xkIEZpcmVmb3gsIG9sZCBJRSwgQ2hyb21lXG5cdFx0XHRcdHJldHVybiBvbi5tYWtlTXVsdGlIYW5kbGUoW1xuXHRcdFx0XHRcdG9uKG5vZGUsICdET01Nb3VzZVNjcm9sbCcsIGNhbGxiYWNrKSxcblx0XHRcdFx0XHRvbihub2RlLCAnbW91c2V3aGVlbCcsIGNhbGxiYWNrKVxuXHRcdFx0XHRdKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBzcGVjaWFsIGNhc2U6IGtleWJvYXJkXG5cdFx0aWYgKC9ea2V5Ly50ZXN0KGV2ZW50TmFtZSkpIHtcblx0XHRcdGNhbGxiYWNrID0gbm9ybWFsaXplS2V5RXZlbnQoY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIGRlZmF1bHQgY2FzZVxuXHRcdHJldHVybiBvbi5vbkRvbUV2ZW50KG5vZGUsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuXHR9XG5cblx0Ly8gcmVnaXN0ZXJlZCBmdW5jdGlvbmFsIGV2ZW50c1xuXHRvbi5ldmVudHMgPSB7XG5cdFx0Ly8gaGFuZGxlIGNsaWNrIGFuZCBFbnRlclxuXHRcdGJ1dHRvbjogZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG5cdFx0XHRyZXR1cm4gb24ubWFrZU11bHRpSGFuZGxlKFtcblx0XHRcdFx0b24obm9kZSwgJ2NsaWNrJywgY2FsbGJhY2spLFxuXHRcdFx0XHRvbihub2RlLCAna2V5dXA6RW50ZXInLCBjYWxsYmFjaylcblx0XHRcdF0pO1xuXHRcdH0sXG5cblx0XHQvLyBjdXN0b20gLSB1c2VkIGZvciBwb3B1cHMgJ24gc3R1ZmZcblx0XHRjbGlja29mZjogZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG5cdFx0XHQvLyBpbXBvcnRhbnQgbm90ZSFcblx0XHRcdC8vIHN0YXJ0cyBwYXVzZWRcblx0XHRcdC8vXG5cdFx0XHR2YXIgYkhhbmRsZSA9IG9uKG5vZGUub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSBlLnRhcmdldDtcblx0XHRcdFx0aWYgKHRhcmdldC5ub2RlVHlwZSAhPT0gMSkge1xuXHRcdFx0XHRcdHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0YXJnZXQgJiYgIW5vZGUuY29udGFpbnModGFyZ2V0KSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dmFyIGhhbmRsZSA9IHtcblx0XHRcdFx0c3RhdGU6ICdyZXN1bWVkJyxcblx0XHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRiSGFuZGxlLnJlc3VtZSgpO1xuXHRcdFx0XHRcdH0sIDEwMCk7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdyZXN1bWVkJztcblx0XHRcdFx0fSxcblx0XHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRiSGFuZGxlLnBhdXNlKCk7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdwYXVzZWQnO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRiSGFuZGxlLnJlbW92ZSgpO1xuXHRcdFx0XHRcdHRoaXMuc3RhdGUgPSAncmVtb3ZlZCc7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRoYW5kbGUucGF1c2UoKTtcblxuXHRcdFx0cmV0dXJuIGhhbmRsZTtcblx0XHR9XG5cdH07XG5cblx0Ly8gaW50ZXJuYWwgZXZlbnQgaGFuZGxlcnNcblxuXHRmdW5jdGlvbiBvbkRvbUV2ZW50IChub2RlLCBldmVudE5hbWUsIGNhbGxiYWNrKSB7XG5cdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBmYWxzZSk7XG5cdFx0XHRcdG5vZGUgPSBjYWxsYmFjayA9IG51bGw7XG5cdFx0XHRcdHRoaXMucmVtb3ZlID0gdGhpcy5wYXVzZSA9IHRoaXMucmVzdW1lID0gZnVuY3Rpb24gKCkge307XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdH0sXG5cdFx0XHRyZXN1bWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gb25JbWFnZUxvYWQgKG5vZGUsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGhhbmRsZSA9IG9uLm1ha2VNdWx0aUhhbmRsZShbXG5cdFx0XHRvbi5vbkRvbUV2ZW50KG5vZGUsICdsb2FkJywgb25JbWFnZUxvYWQpLFxuXHRcdFx0b24obm9kZSwgJ2Vycm9yJywgY2FsbGJhY2spXG5cdFx0XSk7XG5cblx0XHRyZXR1cm4gaGFuZGxlO1xuXG5cdFx0ZnVuY3Rpb24gb25JbWFnZUxvYWQgKGUpIHtcblx0XHRcdHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKG5vZGUubmF0dXJhbFdpZHRoIHx8IG5vZGUubmF0dXJhbEhlaWdodCkge1xuXHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXHRcdFx0XHRcdGUud2lkdGggID0gZS5uYXR1cmFsV2lkdGggID0gbm9kZS5uYXR1cmFsV2lkdGg7XG5cdFx0XHRcdFx0ZS5oZWlnaHQgPSBlLm5hdHVyYWxIZWlnaHQgPSBub2RlLm5hdHVyYWxIZWlnaHQ7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDEwMCk7XG5cdFx0XHRoYW5kbGUucmVtb3ZlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25LZXlFdmVudCAoa2V5RXZlbnROYW1lLCByZSkge1xuXHRcdHJldHVybiBmdW5jdGlvbiBvbktleUhhbmRsZXIgKG5vZGUsIGNhbGxiYWNrKSB7XG5cdFx0XHRyZXR1cm4gb24obm9kZSwga2V5RXZlbnROYW1lLCBmdW5jdGlvbiBvbktleSAoZSkge1xuXHRcdFx0XHRpZiAocmUudGVzdChlLmtleSkpIHtcblx0XHRcdFx0XHRjYWxsYmFjayhlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblx0fVxuXG5cdC8vIGludGVybmFsIHV0aWxpdGllc1xuXG5cdHZhciBoYXNXaGVlbCA9IChmdW5jdGlvbiBoYXNXaGVlbFRlc3QgKCkge1xuXHRcdHZhclxuXHRcdFx0aXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignVHJpZGVudCcpID4gLTEsXG5cdFx0XHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRyZXR1cm4gXCJvbndoZWVsXCIgaW4gZGl2IHx8IFwid2hlZWxcIiBpbiBkaXYgfHxcblx0XHRcdChpc0lFICYmIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoXCJFdmVudHMud2hlZWxcIiwgXCIzLjBcIikpOyAvLyBJRSBmZWF0dXJlIGRldGVjdGlvblxuXHR9KSgpO1xuXG5cdHZhciBtYXRjaGVzO1xuXHRbJ21hdGNoZXMnLCAnbWF0Y2hlc1NlbGVjdG9yJywgJ3dlYmtpdCcsICdtb3onLCAnbXMnLCAnbyddLnNvbWUoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRpZiAobmFtZS5sZW5ndGggPCA3KSB7IC8vIHByZWZpeFxuXHRcdFx0bmFtZSArPSAnTWF0Y2hlc1NlbGVjdG9yJztcblx0XHR9XG5cdFx0aWYgKEVsZW1lbnQucHJvdG90eXBlW25hbWVdKSB7XG5cdFx0XHRtYXRjaGVzID0gbmFtZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGNsb3Nlc3QgKGVsZW1lbnQsIHNlbGVjdG9yLCBwYXJlbnQpIHtcblx0XHR3aGlsZSAoZWxlbWVudCkge1xuXHRcdFx0aWYgKGVsZW1lbnRbb24ubWF0Y2hlc10gJiYgZWxlbWVudFtvbi5tYXRjaGVzXShzZWxlY3RvcikpIHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZWxlbWVudCA9PT0gcGFyZW50KSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHR2YXIgSU5WQUxJRF9QUk9QUyA9IHtcblx0XHRpc1RydXN0ZWQ6IDFcblx0fTtcblx0ZnVuY3Rpb24gbWl4IChvYmplY3QsIHZhbHVlKSB7XG5cdFx0aWYgKCF2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIG9iamVjdDtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGZvcih2YXIga2V5IGluIHZhbHVlKXtcblx0XHRcdFx0aWYgKCFJTlZBTElEX1BST1BTW2tleV0pIHtcblx0XHRcdFx0XHRvYmplY3Rba2V5XSA9IHZhbHVlW2tleV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0b2JqZWN0LnZhbHVlID0gdmFsdWU7XG5cdFx0fVxuXHRcdHJldHVybiBvYmplY3Q7XG5cdH1cblxuXHR2YXIgaWVLZXlzID0ge1xuXHRcdC8vYTogJ1RFU1QnLFxuXHRcdFVwOiAnQXJyb3dVcCcsXG5cdFx0RG93bjogJ0Fycm93RG93bicsXG5cdFx0TGVmdDogJ0Fycm93TGVmdCcsXG5cdFx0UmlnaHQ6ICdBcnJvd1JpZ2h0Jyxcblx0XHRFc2M6ICdFc2NhcGUnLFxuXHRcdFNwYWNlYmFyOiAnICcsXG5cdFx0V2luOiAnQ29tbWFuZCdcblx0fTtcblxuXHRmdW5jdGlvbiBub3JtYWxpemVLZXlFdmVudCAoY2FsbGJhY2spIHtcblx0XHQvLyBJRSB1c2VzIG9sZCBzcGVjXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIG5vcm1hbGl6ZUtleXMgKGUpIHtcblx0XHRcdGlmIChpZUtleXNbZS5rZXldKSB7XG5cdFx0XHRcdHZhciBmYWtlRXZlbnQgPSBtaXgoe30sIGUpO1xuXHRcdFx0XHRmYWtlRXZlbnQua2V5ID0gaWVLZXlzW2Uua2V5XTtcblx0XHRcdFx0Y2FsbGJhY2soZmFrZUV2ZW50KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHZhclxuXHRcdEZBQ1RPUiA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignV2luZG93cycpID4gLTEgPyAxMCA6IDAuMSxcblx0XHRYTFI4ID0gMCxcblx0XHRtb3VzZVdoZWVsSGFuZGxlO1xuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVdoZWVsRXZlbnQgKGNhbGxiYWNrKSB7XG5cdFx0Ly8gbm9ybWFsaXplcyBhbGwgYnJvd3NlcnMnIGV2ZW50cyB0byBhIHN0YW5kYXJkOlxuXHRcdC8vIGRlbHRhLCB3aGVlbFksIHdoZWVsWFxuXHRcdC8vIGFsc28gYWRkcyBhY2NlbGVyYXRpb24gYW5kIGRlY2VsZXJhdGlvbiB0byBtYWtlXG5cdFx0Ly8gTWFjIGFuZCBXaW5kb3dzIGJlaGF2ZSBzaW1pbGFybHlcblx0XHRyZXR1cm4gZnVuY3Rpb24gbm9ybWFsaXplV2hlZWwgKGUpIHtcblx0XHRcdFhMUjggKz0gRkFDVE9SO1xuXHRcdFx0dmFyXG5cdFx0XHRcdGRlbHRhWSA9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCAoZS53aGVlbERlbHRhWSB8fCBlLmRlbHRhWSkpKSxcblx0XHRcdFx0ZGVsdGFYID0gTWF0aC5tYXgoLTEwLCBNYXRoLm1pbigxMCwgKGUud2hlZWxEZWx0YVggfHwgZS5kZWx0YVgpKSk7XG5cblx0XHRcdGRlbHRhWSA9IGRlbHRhWSA8PSAwID8gZGVsdGFZIC0gWExSOCA6IGRlbHRhWSArIFhMUjg7XG5cblx0XHRcdGUuZGVsdGEgID0gZGVsdGFZO1xuXHRcdFx0ZS53aGVlbFkgPSBkZWx0YVk7XG5cdFx0XHRlLndoZWVsWCA9IGRlbHRhWDtcblxuXHRcdFx0Y2xlYXJUaW1lb3V0KG1vdXNlV2hlZWxIYW5kbGUpO1xuXHRcdFx0bW91c2VXaGVlbEhhbmRsZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRYTFI4ID0gMDtcblx0XHRcdH0sIDMwMCk7XG5cdFx0XHRjYWxsYmFjayhlKTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xvc2VzdEZpbHRlciAoZWxlbWVudCwgc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcblx0XHRcdHJldHVybiBvbi5jbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3RvciwgZWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VNdWx0aUhhbmRsZSAoaGFuZGxlcykge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdGF0ZTogJ3Jlc3VtZWQnLFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaCkge1xuXHRcdFx0XHRcdC8vIGFsbG93IGZvciBhIHNpbXBsZSBmdW5jdGlvbiBpbiB0aGUgbGlzdFxuXHRcdFx0XHRcdGlmIChoLnJlbW92ZSkge1xuXHRcdFx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBoID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRoKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aGFuZGxlcyA9IFtdO1xuXHRcdFx0XHR0aGlzLnJlbW92ZSA9IHRoaXMucGF1c2UgPSB0aGlzLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHt9O1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gJ3JlbW92ZWQnO1xuXHRcdFx0fSxcblx0XHRcdHBhdXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaCkge1xuXHRcdFx0XHRcdGlmIChoLnBhdXNlKSB7XG5cdFx0XHRcdFx0XHRoLnBhdXNlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdwYXVzZWQnO1xuXHRcdFx0fSxcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRoYW5kbGVzLmZvckVhY2goZnVuY3Rpb24gKGgpIHtcblx0XHRcdFx0XHRpZiAoaC5yZXN1bWUpIHtcblx0XHRcdFx0XHRcdGgucmVzdW1lKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdyZXN1bWVkJztcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Tm9kZUJ5SWQgKGlkKSB7XG5cdFx0dmFyIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cdFx0aWYgKCFub2RlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdgb25gIENvdWxkIG5vdCBmaW5kOicsIGlkKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlQ2FsbGJhY2sgKG5vZGUsIGZpbHRlciwgaGFuZGxlcikge1xuXHRcdGlmIChmaWx0ZXIgJiYgaGFuZGxlcikge1xuXHRcdFx0aWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGZpbHRlciA9IGNsb3Nlc3RGaWx0ZXIobm9kZSwgZmlsdGVyKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gZmlsdGVyKGUpO1xuXHRcdFx0XHRpZiAocmVzdWx0KSB7XG5cdFx0XHRcdFx0ZS5maWx0ZXJlZFRhcmdldCA9IHJlc3VsdDtcblx0XHRcdFx0XHRoYW5kbGVyKGUsIHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiBmaWx0ZXIgfHwgaGFuZGxlcjtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldERvYyAobm9kZSkge1xuXHRcdHJldHVybiBub2RlID09PSBkb2N1bWVudCB8fCBub2RlID09PSB3aW5kb3cgPyBkb2N1bWVudCA6IG5vZGUub3duZXJEb2N1bWVudDtcblx0fVxuXG5cdC8vIHB1YmxpYyBmdW5jdGlvbnNcblxuXHRvbi5vbmNlID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgZmlsdGVyLCBjYWxsYmFjaykge1xuXHRcdHZhciBoO1xuXHRcdGlmIChmaWx0ZXIgJiYgY2FsbGJhY2spIHtcblx0XHRcdGggPSBvbihub2RlLCBldmVudE5hbWUsIGZpbHRlciwgZnVuY3Rpb24gb25jZSAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcblx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoID0gb24obm9kZSwgZXZlbnROYW1lLCBmdW5jdGlvbiBvbmNlICgpIHtcblx0XHRcdFx0ZmlsdGVyLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcblx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gaDtcblx0fTtcblxuXHRvbi5lbWl0ID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgdmFsdWUpIHtcblx0XHRub2RlID0gdHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnID8gZ2V0Tm9kZUJ5SWQobm9kZSkgOiBub2RlO1xuXHRcdHZhciBldmVudCA9IGdldERvYyhub2RlKS5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIHRydWUpOyAvLyBldmVudCB0eXBlLCBidWJibGluZywgY2FuY2VsYWJsZVxuXHRcdHJldHVybiBub2RlLmRpc3BhdGNoRXZlbnQobWl4KGV2ZW50LCB2YWx1ZSkpO1xuXHR9O1xuXG5cdG9uLmZpcmUgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcykge1xuXHRcdG5vZGUgPSB0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgPyBnZXROb2RlQnlJZChub2RlKSA6IG5vZGU7XG5cdFx0dmFyIGV2ZW50ID0gZ2V0RG9jKG5vZGUpLmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuXHRcdGV2ZW50LmluaXRDdXN0b21FdmVudChldmVudE5hbWUsICEhYnViYmxlcywgdHJ1ZSwgZXZlbnREZXRhaWwpOyAvLyBldmVudCB0eXBlLCBidWJibGluZywgY2FuY2VsYWJsZSwgdmFsdWVcblx0XHRyZXR1cm4gbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0fTtcblxuXHQvLyBUT0RPOiBERVBSRUNBVEVEXG5cdG9uLmlzQWxwaGFOdW1lcmljID0gZnVuY3Rpb24gKHN0cikge1xuXHRcdHJldHVybiAvXlswLTlhLXpdJC9pLnRlc3Qoc3RyKTtcblx0fTtcblxuXHRvbi5tYWtlTXVsdGlIYW5kbGUgPSBtYWtlTXVsdGlIYW5kbGU7XG5cdG9uLm9uRG9tRXZlbnQgPSBvbkRvbUV2ZW50OyAvLyB1c2UgZGlyZWN0bHkgdG8gcHJldmVudCBwb3NzaWJsZSBkZWZpbml0aW9uIGxvb3BzXG5cdG9uLmNsb3Nlc3QgPSBjbG9zZXN0O1xuXHRvbi5tYXRjaGVzID0gbWF0Y2hlcztcblxuXHRyZXR1cm4gb247XG59KSk7XG4iLCIvLyBDbHViIEFKQVggR2VuZXJhbCBQdXJwb3NlIENvZGVcbi8vXG4vLyBSYW5kb21pemVyXG4vL1xuLy8gYXV0aG9yOlxuLy8gICAgICAgICAgICAgIE1pa2UgV2lsY294XG4vLyBzaXRlOlxuLy8gICAgICAgICAgICAgIGh0dHA6Ly9jbHViYWpheC5vcmdcbi8vIHN1cHBvcnQ6XG4vLyAgICAgICAgICAgICAgaHR0cDovL2dyb3Vwcy5nb29nbGUuY29tL2dyb3VwL2NsdWJhamF4XG4vL1xuLy8gY2x1YmFqYXgubGFuZy5yYW5kXG4vL1xuLy8gICAgICBERVNDUklQVElPTjpcbi8vICAgICAgICAgICAgICBBIHJhbmRvbWl6ZXIgbGlicmFyeSB0aGF0J3MgZ3JlYXQgZm9yIHByb2R1Y2luZyBtb2NrIGRhdGEuXG4vLyAgICAgICAgICAgICAgQWxsb3dzIGRvemVucyBvZiB3YXlzIHRvIHJhbmRvbWl6ZSBudW1iZXJzLCBzdHJpbmdzLCB3b3Jkcyxcbi8vICAgICAgICAgICAgICBzZW50ZW5jZXMsIGFuZCBkYXRlcy4gSW5jbHVkZXMgdGlueSBsaWJyYXJpZXMgb2YgdGhlIG1vc3Rcbi8vICAgICAgICAgICAgICBjb21tb25seSB1c2VkIHdvcmRzIChpbiBvcmRlciksIHRoZSBtb3N0IGNvbW1vbmx5IHVzZWQgbGV0dGVyc1xuLy8gICAgICAgICAgICAgIChpbiBvcmRlcikgYW5kIHBlcnNvbmFsIG5hbWVzIHRoYXQgY2FuIGJlIHVzZWQgYXMgZmlyc3Qgb3IgbGFzdC5cbi8vICAgICAgICAgICAgICBGb3IgbWFraW5nIHNlbnRlbmNlcywgXCJ3dXJkc1wiIGFyZSB1c2VkIC0gd29yZHMgd2l0aCBzY3JhbWJsZWQgdm93ZWxzXG4vLyAgICAgICAgICAgICAgc28gdGhleSBhcmVuJ3QgYWN0dWFsIHdvcmRzLCBidXQgbG9vayBtb3JlIGxpa2UgbG9yZW0gaXBzdW0uIENoYW5nZSB0aGVcbi8vICAgICAgICAgICAgICBwcm9wZXJ0eSByZWFsIHRvIHRydWUgdG8gdXNlIFwid29yZHNcIiBpbnN0ZWFkIG9mIFwid3VyZHNcIiAoaXQgY2FuXG4vLyAgICAgICAgICAgICAgYWxzbyBwcm9kdWNlIGh1bW9yb3VzIHJlc3VsdHMpLlxuXG4vLyAgICAgIFVTQUdFOlxuLy8gICAgICAgICAgICAgIGluY2x1ZGUgZmlsZTpcbi8vICAgICAgICAgICAgICAgICAgICAgIDxzY3JpcHQgc3JjPVwiY2x1YmFqYXgvbGFuZy9yYW5kLmpzXCI+PC9zY3JpcHQ+XG4vL1xuLy8gVEVTVFM6XG4vLyAgICAgICAgICAgICAgU2VlIHRlc3RzL3JhbmQuaHRtbFxuLy9cbi8qIFVNRC5kZWZpbmUgKi8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpeyBkZWZpbmUoW10sIGZhY3RvcnkpOyB9ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpeyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTsgfWVsc2V7IHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTsgd2luZG93LnJhbmQgPSBmYWN0b3J5KCk7IH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHRcblx0dmFyXG5cdFx0cmFuZCxcblx0XHRjaXR5U3RhdGVzID0gW1wiTmV3IFlvcmssIE5ldyBZb3JrXCIsIFwiTG9zIEFuZ2VsZXMsIENhbGlmb3JuaWFcIiwgXCJDaGljYWdvLCBJbGxpbm9pc1wiLCBcIkhvdXN0b24sIFRleGFzXCIsIFwiUGhpbGFkZWxwaGlhLCBQZW5uc3lsdmFuaWFcIiwgXCJQaG9lbml4LCBBcml6b25hXCIsIFwiU2FuIERpZWdvLCBDYWxpZm9ybmlhXCIsIFwiU2FuIEFudG9uaW8sIFRleGFzXCIsIFwiRGFsbGFzLCBUZXhhc1wiLCBcIkRldHJvaXQsIE1pY2hpZ2FuXCIsIFwiU2FuIEpvc2UsIENhbGlmb3JuaWFcIiwgXCJJbmRpYW5hcG9saXMsIEluZGlhbmFcIiwgXCJKYWNrc29udmlsbGUsIEZsb3JpZGFcIiwgXCJTYW4gRnJhbmNpc2NvLCBDYWxpZm9ybmlhXCIsIFwiQ29sdW1idXMsIE9oaW9cIiwgXCJBdXN0aW4sIFRleGFzXCIsIFwiTWVtcGhpcywgVGVubmVzc2VlXCIsIFwiQmFsdGltb3JlLCBNYXJ5bGFuZFwiLCBcIkNoYXJsb3R0ZSwgTm9ydGggQ2Fyb2xpbmFcIiwgXCJGb3J0IFdvcnRoLCBUZXhhc1wiLCBcIkJvc3RvbiwgTWFzc2FjaHVzZXR0c1wiLCBcIk1pbHdhdWtlZSwgV2lzY29uc2luXCIsIFwiRWwgUGFzbywgVGV4YXNcIiwgXCJXYXNoaW5ndG9uLCBEaXN0cmljdCBvZiBDb2x1bWJpYVwiLCBcIk5hc2h2aWxsZS1EYXZpZHNvbiwgVGVubmVzc2VlXCIsIFwiU2VhdHRsZSwgV2FzaGluZ3RvblwiLCBcIkRlbnZlciwgQ29sb3JhZG9cIiwgXCJMYXMgVmVnYXMsIE5ldmFkYVwiLCBcIlBvcnRsYW5kLCBPcmVnb25cIiwgXCJPa2xhaG9tYSBDaXR5LCBPa2xhaG9tYVwiLCBcIlR1Y3NvbiwgQXJpem9uYVwiLCBcIkFsYnVxdWVycXVlLCBOZXcgTWV4aWNvXCIsIFwiQXRsYW50YSwgR2VvcmdpYVwiLCBcIkxvbmcgQmVhY2gsIENhbGlmb3JuaWFcIiwgXCJLYW5zYXMgQ2l0eSwgTWlzc291cmlcIiwgXCJGcmVzbm8sIENhbGlmb3JuaWFcIiwgXCJOZXcgT3JsZWFucywgTG91aXNpYW5hXCIsIFwiQ2xldmVsYW5kLCBPaGlvXCIsIFwiU2FjcmFtZW50bywgQ2FsaWZvcm5pYVwiLCBcIk1lc2EsIEFyaXpvbmFcIiwgXCJWaXJnaW5pYSBCZWFjaCwgVmlyZ2luaWFcIiwgXCJPbWFoYSwgTmVicmFza2FcIiwgXCJDb2xvcmFkbyBTcHJpbmdzLCBDb2xvcmFkb1wiLCBcIk9ha2xhbmQsIENhbGlmb3JuaWFcIiwgXCJNaWFtaSwgRmxvcmlkYVwiLCBcIlR1bHNhLCBPa2xhaG9tYVwiLCBcIk1pbm5lYXBvbGlzLCBNaW5uZXNvdGFcIiwgXCJIb25vbHVsdSwgSGF3YWlpXCIsIFwiQXJsaW5ndG9uLCBUZXhhc1wiLCBcIldpY2hpdGEsIEthbnNhc1wiLCBcIlN0LiBMb3VpcywgTWlzc291cmlcIiwgXCJSYWxlaWdoLCBOb3J0aCBDYXJvbGluYVwiLCBcIlNhbnRhIEFuYSwgQ2FsaWZvcm5pYVwiLCBcIkNpbmNpbm5hdGksIE9oaW9cIiwgXCJBbmFoZWltLCBDYWxpZm9ybmlhXCIsIFwiVGFtcGEsIEZsb3JpZGFcIiwgXCJUb2xlZG8sIE9oaW9cIiwgXCJQaXR0c2J1cmdoLCBQZW5uc3lsdmFuaWFcIiwgXCJBdXJvcmEsIENvbG9yYWRvXCIsIFwiQmFrZXJzZmllbGQsIENhbGlmb3JuaWFcIiwgXCJSaXZlcnNpZGUsIENhbGlmb3JuaWFcIiwgXCJTdG9ja3RvbiwgQ2FsaWZvcm5pYVwiLCBcIkNvcnB1cyBDaHJpc3RpLCBUZXhhc1wiLCBcIkxleGluZ3Rvbi1GYXlldHRlLCBLZW50dWNreVwiLCBcIkJ1ZmZhbG8sIE5ldyBZb3JrXCIsIFwiU3QuIFBhdWwsIE1pbm5lc290YVwiLCBcIkFuY2hvcmFnZSwgQWxhc2thXCIsIFwiTmV3YXJrLCBOZXcgSmVyc2V5XCIsIFwiUGxhbm8sIFRleGFzXCIsIFwiRm9ydCBXYXluZSwgSW5kaWFuYVwiLCBcIlN0LiBQZXRlcnNidXJnLCBGbG9yaWRhXCIsIFwiR2xlbmRhbGUsIEFyaXpvbmFcIiwgXCJMaW5jb2xuLCBOZWJyYXNrYVwiLCBcIk5vcmZvbGssIFZpcmdpbmlhXCIsIFwiSmVyc2V5IENpdHksIE5ldyBKZXJzZXlcIiwgXCJHcmVlbnNib3JvLCBOb3J0aCBDYXJvbGluYVwiLCBcIkNoYW5kbGVyLCBBcml6b25hXCIsIFwiQmlybWluZ2hhbSwgQWxhYmFtYVwiLCBcIkhlbmRlcnNvbiwgTmV2YWRhXCIsIFwiU2NvdHRzZGFsZSwgQXJpem9uYVwiLCBcIk5vcnRoIEhlbXBzdGVhZCwgTmV3IFlvcmtcIiwgXCJNYWRpc29uLCBXaXNjb25zaW5cIiwgXCJIaWFsZWFoLCBGbG9yaWRhXCIsIFwiQmF0b24gUm91Z2UsIExvdWlzaWFuYVwiLCBcIkNoZXNhcGVha2UsIFZpcmdpbmlhXCIsIFwiT3JsYW5kbywgRmxvcmlkYVwiLCBcIkx1YmJvY2ssIFRleGFzXCIsIFwiR2FybGFuZCwgVGV4YXNcIiwgXCJBa3JvbiwgT2hpb1wiLCBcIlJvY2hlc3RlciwgTmV3IFlvcmtcIiwgXCJDaHVsYSBWaXN0YSwgQ2FsaWZvcm5pYVwiLCBcIlJlbm8sIE5ldmFkYVwiLCBcIkxhcmVkbywgVGV4YXNcIiwgXCJEdXJoYW0sIE5vcnRoIENhcm9saW5hXCIsIFwiTW9kZXN0bywgQ2FsaWZvcm5pYVwiLCBcIkh1bnRpbmd0b24sIE5ldyBZb3JrXCIsIFwiTW9udGdvbWVyeSwgQWxhYmFtYVwiLCBcIkJvaXNlLCBJZGFob1wiLCBcIkFybGluZ3RvbiwgVmlyZ2luaWFcIiwgXCJTYW4gQmVybmFyZGlubywgQ2FsaWZvcm5pYVwiXSxcblx0XHRzdHJlZXRTdWZmaXhlcyA9ICdSb2FkLERyaXZlLEF2ZW51ZSxCbHZkLExhbmUsU3RyZWV0LFdheSxDaXJjbGUnLnNwbGl0KCcsJyksXG5cdFx0c3RyZWV0cyA9IFwiRmlyc3QsRm91cnRoLFBhcmssRmlmdGgsTWFpbixTaXh0aCxPYWssU2V2ZW50aCxQaW5lLE1hcGxlLENlZGFyLEVpZ2h0aCxFbG0sVmlldyxXYXNoaW5ndG9uLE5pbnRoLExha2UsSGlsbCxIaWdoLFN0YXRpb24sTWFpbixQYXJrLENodXJjaCxDaHVyY2gsTG9uZG9uLFZpY3RvcmlhLEdyZWVuLE1hbm9yLENodXJjaCxQYXJrLFRoZSBDcmVzY2VudCxRdWVlbnMsTmV3LEdyYW5nZSxLaW5ncyxLaW5nc3dheSxXaW5kc29yLEhpZ2hmaWVsZCxNaWxsLEFsZXhhbmRlcixZb3JrLFN0LiBKb2huXFwncyxNYWluLEJyb2Fkd2F5LEtpbmcsVGhlIEdyZWVuLFNwcmluZ2ZpZWxkLEdlb3JnZSxQYXJrLFZpY3RvcmlhLEFsYmVydCxRdWVlbnN3YXksTmV3LFF1ZWVuLFdlc3QsTm9ydGgsTWFuY2hlc3RlcixUaGUgR3JvdmUsUmljaG1vbmQsR3JvdmUsU291dGgsU2Nob29sLE5vcnRoLFN0YW5sZXksQ2hlc3RlcixNaWxsLFwiLnNwbGl0KCcsJyksXG5cdFx0c3RhdGVzID0gW1wiQWxhYmFtYVwiLCBcIkFsYXNrYVwiLCBcIkFtZXJpY2FuIFNhbW9hXCIsIFwiQXJpem9uYVwiLCBcIkFya2Fuc2FzXCIsIFwiQXJtZWQgRm9yY2VzIEV1cm9wZVwiLCBcIkFybWVkIEZvcmNlcyBQYWNpZmljXCIsIFwiQXJtZWQgRm9yY2VzIHRoZSBBbWVyaWNhc1wiLCBcIkNhbGlmb3JuaWFcIiwgXCJDb2xvcmFkb1wiLCBcIkNvbm5lY3RpY3V0XCIsIFwiRGVsYXdhcmVcIiwgXCJEaXN0cmljdCBvZiBDb2x1bWJpYVwiLCBcIkZlZGVyYXRlZCBTdGF0ZXMgb2YgTWljcm9uZXNpYVwiLCBcIkZsb3JpZGFcIiwgXCJHZW9yZ2lhXCIsIFwiR3VhbVwiLCBcIkhhd2FpaVwiLCBcIklkYWhvXCIsIFwiSWxsaW5vaXNcIiwgXCJJbmRpYW5hXCIsIFwiSW93YVwiLCBcIkthbnNhc1wiLCBcIktlbnR1Y2t5XCIsIFwiTG91aXNpYW5hXCIsIFwiTWFpbmVcIiwgXCJNYXJzaGFsbCBJc2xhbmRzXCIsIFwiTWFyeWxhbmRcIiwgXCJNYXNzYWNodXNldHRzXCIsIFwiTWljaGlnYW5cIiwgXCJNaW5uZXNvdGFcIiwgXCJNaXNzaXNzaXBwaVwiLCBcIk1pc3NvdXJpXCIsIFwiTW9udGFuYVwiLCBcIk5lYnJhc2thXCIsIFwiTmV2YWRhXCIsIFwiTmV3IEhhbXBzaGlyZVwiLCBcIk5ldyBKZXJzZXlcIiwgXCJOZXcgTWV4aWNvXCIsIFwiTmV3IFlvcmtcIiwgXCJOb3J0aCBDYXJvbGluYVwiLCBcIk5vcnRoIERha290YVwiLCBcIk5vcnRoZXJuIE1hcmlhbmEgSXNsYW5kc1wiLCBcIk9oaW9cIiwgXCJPa2xhaG9tYVwiLCBcIk9yZWdvblwiLCBcIlBlbm5zeWx2YW5pYVwiLCBcIlB1ZXJ0byBSaWNvXCIsIFwiUmhvZGUgSXNsYW5kXCIsIFwiU291dGggQ2Fyb2xpbmFcIiwgXCJTb3V0aCBEYWtvdGFcIiwgXCJUZW5uZXNzZWVcIiwgXCJUZXhhc1wiLCBcIlV0YWhcIiwgXCJWZXJtb250XCIsIFwiVmlyZ2luIElzbGFuZHMsIFUuUy5cIiwgXCJWaXJnaW5pYVwiLCBcIldhc2hpbmd0b25cIiwgXCJXZXN0IFZpcmdpbmlhXCIsIFwiV2lzY29uc2luXCIsIFwiV3lvbWluZ1wiXSxcblx0XHRzdGF0ZUFiYnIgPSBbXCJBTFwiLCBcIkFLXCIsIFwiQVNcIiwgXCJBWlwiLCBcIkFSXCIsIFwiQUVcIiwgXCJBUFwiLCBcIkFBXCIsIFwiQ0FcIiwgXCJDT1wiLCBcIkNUXCIsIFwiREVcIiwgXCJEQ1wiLCBcIkZNXCIsIFwiRkxcIiwgXCJHQVwiLCBcIkdVXCIsIFwiSElcIiwgXCJJRFwiLCBcIklMXCIsIFwiSU5cIiwgXCJJQVwiLCBcIktTXCIsIFwiS1lcIiwgXCJMQVwiLCBcIk1FXCIsIFwiTUhcIiwgXCJNRFwiLCBcIk1BXCIsIFwiTUlcIiwgXCJNTlwiLCBcIk1TXCIsIFwiTU9cIiwgXCJNVFwiLCBcIk5FXCIsIFwiTlZcIiwgXCJOSFwiLCBcIk5KXCIsIFwiTk1cIiwgXCJOWVwiLCBcIk5DXCIsIFwiTkRcIiwgXCJNUFwiLCBcIk9IXCIsIFwiT0tcIiwgXCJPUlwiLCBcIlBBXCIsIFwiUFJcIiwgXCJSSVwiLCBcIlNDXCIsIFwiU0RcIiwgXCJUTlwiLCBcIlRYXCIsIFwiVVRcIiwgXCJWVFwiLCBcIlZJXCIsIFwiVkFcIiwgXCJXQVwiLCBcIldWXCIsIFwiV0lcIiwgXCJXWVwiXSxcblx0XHRuYW1lcyA9IFwiQWJyYWhhbSxBbGJlcnQsQWxleGlzLEFsbGVuLEFsbGlzb24sQWxleGFuZGVyLEFtb3MsQW50b24sQXJub2xkLEFydGh1cixBc2hsZXksQmFycnksQmVsaW5kYSxCZWxsZSxCZW5qYW1pbixCZW5ueSxCZXJuYXJkLEJyYWRsZXksQnJldHQsVHksQnJpdHRhbnksQnJ1Y2UsQnJ5YW50LENhcnJleSxDYXJtZW4sQ2Fycm9sbCxDaGFybGVzLENocmlzdG9waGVyLENocmlzdGllLENsYXJrLENsYXksQ2xpZmYsQ29ucmFkLENyYWlnLENyeXN0YWwsQ3VydGlzLERhbW9uLERhbmEsRGF2aWQsRGVhbixEZWUsRGVubmlzLERlbm55LERpY2ssRG91Z2xhcyxEdW5jYW4sRHdpZ2h0LER5bGFuLEVkZHksRWxsaW90LEV2ZXJldHQsRmF5ZSxGcmFuY2lzLEZyYW5rLEZyYW5rbGluLEdhcnRoLEdheWxlLEdlb3JnZSxHaWxiZXJ0LEdsZW5uLEdvcmRvbixHcmFjZSxHcmFoYW0sR3JhbnQsR3JlZ29yeSxHb3R0ZnJpZWQsR3V5LEhhcnJpc29uLEhhcnJ5LEhhcnZleSxIZW5yeSxIZXJiZXJ0LEhpbGxhcnksSG9sbHksSG9wZSxIb3dhcmQsSHVnbyxIdW1waHJleSxJcnZpbmcsSXNhYWssSmFuaXMsSmF5LEpvZWwsSm9obixKb3JkYW4sSm95Y2UsSnVhbixKdWRkLEp1bGlhLEtheWUsS2VsbHksS2VpdGgsTGF1cmllLExhd3JlbmNlLExlZSxMZWlnaCxMZW9uYXJkLExlc2xpZSxMZXN0ZXIsTGV3aXMsTGlsbHksTGxveWQsR2VvcmdlLExvdWlzLExvdWlzZSxMdWNhcyxMdXRoZXIsTHlubixNYWNrLE1hcmllLE1hcnNoYWxsLE1hcnRpbixNYXJ2aW4sTWF5LE1pY2hhZWwsTWljaGVsbGUsTWlsdG9uLE1pcmFuZGEsTWl0Y2hlbGwsTW9yZ2FuLE1vcnJpcyxNdXJyYXksTmV3dG9uLE5vcm1hbixPd2VuLFBhdHJpY2ssUGF0dGksUGF1bCxQZW5ueSxQZXJyeSxQcmVzdG9uLFF1aW5uLFJheSxSaWNoLFJpY2hhcmQsUm9sYW5kLFJvc2UsUm9zcyxSb3ksUnVieSxSdXNzZWxsLFJ1dGgsUnlhbixTY290dCxTZXltb3VyLFNoYW5ub24sU2hhd24sU2hlbGxleSxTaGVybWFuLFNpbW9uLFN0YW5sZXksU3Rld2FydCxTdXNhbm4sU3lkbmV5LFRheWxvcixUaG9tYXMsVG9kZCxUb20sVHJhY3ksVHJhdmlzLFR5bGVyLFR5bGVyLFZpbmNlbnQsV2FsbGFjZSxXYWx0ZXIsUGVubixXYXluZSxXaWxsLFdpbGxhcmQsV2lsbGlzXCIsXG5cdFx0d29yZHMgPSBcInRoZSxvZixhbmQsYSx0byxpbixpcyx5b3UsdGhhdCxpdCxoZSxmb3Isd2FzLG9uLGFyZSxhcyx3aXRoLGhpcyx0aGV5LGF0LGJlLHRoaXMsZnJvbSxJLGhhdmUsb3IsYnksb25lLGhhZCxub3QsYnV0LHdoYXQsYWxsLHdlcmUsd2hlbix3ZSx0aGVyZSxjYW4sYW4seW91cix3aGljaCx0aGVpcixzYWlkLGlmLGRvLHdpbGwsZWFjaCxhYm91dCxob3csdXAsb3V0LHRoZW0sdGhlbixzaGUsbWFueSxzb21lLHNvLHRoZXNlLHdvdWxkLG90aGVyLGludG8saGFzLG1vcmUsaGVyLHR3byxsaWtlLGhpbSxzZWUsdGltZSxjb3VsZCxubyxtYWtlLHRoYW4sZmlyc3QsYmVlbixpdHMsd2hvLG5vdyxwZW9wbGUsbXksbWFkZSxvdmVyLGRpZCxkb3duLG9ubHksd2F5LGZpbmQsdXNlLG1heSx3YXRlcixsb25nLGxpdHRsZSx2ZXJ5LGFmdGVyLHdvcmRzLGNhbGxlZCxqdXN0LHdoZXJlLG1vc3Qsa25vdyxnZXQsdGhyb3VnaCxiYWNrLG11Y2gsYmVmb3JlLGdvLGdvb2QsbmV3LHdyaXRlLG91dCx1c2VkLG1lLG1hbix0b28sYW55LGRheSxzYW1lLHJpZ2h0LGxvb2ssdGhpbmssYWxzbyxhcm91bmQsYW5vdGhlcixjYW1lLGNvbWUsd29yayx0aHJlZSx3b3JkLG11c3QsYmVjYXVzZSxkb2VzLHBhcnQsZXZlbixwbGFjZSx3ZWxsLHN1Y2gsaGVyZSx0YWtlLHdoeSx0aGluZ3MsaGVscCxwdXQseWVhcnMsZGlmZmVyZW50LGF3YXksYWdhaW4sb2ZmLHdlbnQsb2xkLG51bWJlcixncmVhdCx0ZWxsLG1lbixzYXksc21hbGwsZXZlcnksZm91bmQsc3RpbGwsYmV0d2VlbixuYW1lLHNob3VsZCxob21lLGJpZyxnaXZlLGFpcixsaW5lLHNldCxvd24sdW5kZXIscmVhZCxsYXN0LG5ldmVyLHVzLGxlZnQsZW5kLGFsb25nLHdoaWxlLG1pZ2h0LG5leHQsc291bmQsYmVsb3csc2F3LHNvbWV0aGluZyx0aG91Z2h0LGJvdGgsZmV3LHRob3NlLGFsd2F5cyxsb29rZWQsc2hvdyxsYXJnZSxvZnRlbix0b2dldGhlcixhc2tlZCxob3VzZSxkb24ndCx3b3JsZCxnb2luZyx3YW50LHNjaG9vbCxpbXBvcnRhbnQsdW50aWwsZm9ybSxmb29kLGtlZXAsY2hpbGRyZW4sZmVldCxsYW5kLHNpZGUsd2l0aG91dCxib3ksb25jZSxhbmltYWxzLGxpZmUsZW5vdWdoLHRvb2ssc29tZXRpbWVzLGZvdXIsaGVhZCxhYm92ZSxraW5kLGJlZ2FuLGFsbW9zdCxsaXZlLHBhZ2UsZ290LGVhcnRoLG5lZWQsZmFyLGhhbmQsaGlnaCx5ZWFyLG1vdGhlcixsaWdodCxwYXJ0cyxjb3VudHJ5LGZhdGhlcixsZXQsbmlnaHQsZm9sbG93aW5nLHBpY3R1cmUsYmVpbmcsc3R1ZHksc2Vjb25kLGV5ZXMsc29vbix0aW1lcyxzdG9yeSxib3lzLHNpbmNlLHdoaXRlLGRheXMsZXZlcixwYXBlcixoYXJkLG5lYXIsc2VudGVuY2UsYmV0dGVyLGJlc3QsYWNyb3NzLGR1cmluZyx0b2RheSxvdGhlcnMsaG93ZXZlcixzdXJlLG1lYW5zLGtuZXcsaXRzLHRyeSx0b2xkLHlvdW5nLG1pbGVzLHN1bix3YXlzLHRoaW5nLHdob2xlLGhlYXIsZXhhbXBsZSxoZWFyZCxzZXZlcmFsLGNoYW5nZSxhbnN3ZXIscm9vbSxzZWEsYWdhaW5zdCx0b3AsdHVybmVkLGxlYXJuLHBvaW50LGNpdHkscGxheSx0b3dhcmQsZml2ZSx1c2luZyxoaW1zZWxmLHVzdWFsbHlcIixcblx0XHRsZXR0ZXJzID0gKFwiZXRhb25pc3JobGRjbXVmcGd3eWJ2a2p4cXpcIikuc3BsaXQoXCJcIiksXG5cdFx0c2l0ZXMgPSBcIkdvb2dsZSxGYWNlYm9vayxZb3VUdWJlLFlhaG9vLExpdmUsQmluZyxXaWtpcGVkaWEsQmxvZ2dlcixNU04sVHdpdHRlcixXb3JkcHJlc3MsTXlTcGFjZSxNaWNyb3NvZnQsQW1hem9uLGVCYXksTGlua2VkSW4sZmxpY2tyLENyYWlnc2xpc3QsUmFwaWRzaGFyZSxDb25kdWl0LElNREIsQkJDLEdvLEFPTCxEb3VibGVjbGljayxBcHBsZSxCbG9nc3BvdCxPcmt1dCxQaG90b2J1Y2tldCxBc2ssQ05OLEFkb2JlLEFib3V0LG1lZGlhZmlyZSxDTkVULEVTUE4sSW1hZ2VTaGFjayxMaXZlSm91cm5hbCxNZWdhdXBsb2FkLE1lZ2F2aWRlbyxIb3RmaWxlLFBheVBhbCxOWVRpbWVzLEdsb2JvLEFsaWJhYmEsR29EYWRkeSxEZXZpYW50QXJ0LFJlZGlmZixEYWlseU1vdGlvbixEaWdnLFdlYXRoZXIsbmluZyxQYXJ0eVBva2VyLGVIb3csRG93bmxvYWQsQW5zd2VycyxUd2l0UGljLE5ldGZsaXgsVGlueXBpYyxTb3VyY2Vmb3JnZSxIdWx1LENvbWNhc3QsQXJjaGl2ZSxEZWxsLFN0dW1ibGV1cG9uLEhQLEZveE5ld3MsTWV0YWNhZmUsVmltZW8sU2t5cGUsQ2hhc2UsUmV1dGVycyxXU0osWWVscCxSZWRkaXQsR2VvY2l0aWVzLFVTUFMsVVBTLFVwbG9hZCxUZWNoQ3J1bmNoLFBvZ28sUGFuZG9yYSxMQVRpbWVzLFVTQVRvZGF5LElCTSxBbHRhVmlzdGEsTWF0Y2gsTW9uc3RlcixKb3RTcG90LEJldHRlclZpZGVvLENsdWJBSkFYLE5leHBsb3JlLEtheWFrLFNsYXNoZG90XCI7XG5cdFxuXHRyYW5kID0ge1xuXHRcdHJlYWw6ZmFsc2UsXG5cdFx0d29yZHM6d29yZHMuc3BsaXQoXCIsXCIpLFxuXHRcdHd1cmRzOltdLFxuXHRcdG5hbWVzOm5hbWVzLnNwbGl0KFwiLFwiKSxcblx0XHRsZXR0ZXJzOmxldHRlcnMsXG5cdFx0c2l0ZXM6c2l0ZXMuc3BsaXQoXCIsXCIpLFxuXG5cdFx0dG9BcnJheTogZnVuY3Rpb24odGhpbmcpe1xuXHRcdFx0dmFyXG5cdFx0XHRcdG5tLCBpLFxuXHRcdFx0XHRhID0gW107XG5cblx0XHRcdGlmKHR5cGVvZih0aGluZykgPT09IFwib2JqZWN0XCIgJiYgISghIXRoaW5nLnB1c2ggfHwgISF0aGluZy5pdGVtKSl7XG5cdFx0XHRcdGZvcihubSBpbiB0aGluZyl7IGlmKHRoaW5nLmhhc093blByb3BlcnR5KG5tKSl7YS5wdXNoKHRoaW5nW25tXSk7fSB9XG5cdFx0XHRcdHRoaW5nID0gYTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYodHlwZW9mKHRoaW5nKSA9PT0gXCJzdHJpbmdcIil7XG5cdFx0XHRcdGlmKC9cXC4vLnRlc3QodGhpbmcpKXtcblx0XHRcdFx0XHR0aGluZyA9IHRoaW5nLnNwbGl0KFwiLlwiKTtcblx0XHRcdFx0XHR0aGluZy5wb3AoKTtcblx0XHRcdFx0XHRpID0gdGhpbmcubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlKGktLSl7XG5cdFx0XHRcdFx0XHR0aGluZ1tpXSA9IHRoaXMudHJpbSh0aGluZ1tpXSkgKyBcIi5cIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1lbHNlIGlmKC8sLy50ZXN0KHRoaW5nKSl7XG5cdFx0XHRcdFx0XHR0aGluZyA9IHRoaW5nLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0fWVsc2UgaWYoL1xccy8udGVzdCh0aGluZykpe1xuXHRcdFx0XHRcdFx0dGhpbmcgPSB0aGluZy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0dGhpbmcgPSB0aGluZy5zcGxpdChcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaW5nOyAvL0FycmF5XG5cdFx0fSxcblxuXHRcdHRyaW06IGZ1bmN0aW9uKHMpeyAvLyB0aGFua3MgdG8gRG9qbzpcblx0XHRcdHJldHVybiBTdHJpbmcucHJvdG90eXBlLnRyaW0gPyBzLnRyaW0oKSA6XG5cdFx0XHRzLnJlcGxhY2UoL15cXHNcXHMqLywgJycpLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xuXHRcdH0sXG5cblx0XHRwYWQ6IGZ1bmN0aW9uKG4sIGFtdCwgY2hyKXtcblx0XHRcdFx0dmFyIGMgPSBjaHIgfHwgXCIwXCI7IGFtdCA9IGFtdCB8fCAyO1xuXHRcdFx0XHRyZXR1cm4gKGMrYytjK2MrYytjK2MrYytjK2Mrbikuc2xpY2UoLWFtdCk7XG5cdFx0fSxcblxuXHRcdGNhcDogZnVuY3Rpb24odyl7XG5cdFx0XHRyZXR1cm4gdy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHcuc3Vic3RyaW5nKDEpO1xuXHRcdH0sXG5cblx0XHR3ZWlnaHQ6IGZ1bmN0aW9uKG4sIGV4cCl7XG5cdFx0XHR2YXJcblx0XHRcdFx0cmVzLFxuXHRcdFx0XHRyZXYgPSBleHAgPCAwO1xuXHRcdFx0ZXhwID0gZXhwPT09dW5kZWZpbmVkID8gMSA6IE1hdGguYWJzKGV4cCkrMTtcblx0XHRcdHJlcyA9IE1hdGgucG93KG4sIGV4cCk7XG5cdFx0XHRyZXR1cm4gcmV2ID8gMSAtIHJlcyA6IHJlcztcblx0XHR9LFxuXG5cdFx0bjogZnVuY3Rpb24obiwgdyl7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcigobiB8fCAxMCkgKiB0aGlzLndlaWdodChNYXRoLnJhbmRvbSgpLCB3KSk7XG5cdFx0fSxcblxuXHRcdHJhbmdlOiBmdW5jdGlvbihtaW4sIG1heCwgdyl7XG5cdFx0XHRtYXggPSBtYXggfHwgMDtcblx0XHRcdHJldHVybiB0aGlzLm4oTWF0aC5hYnMobWF4LW1pbikrMSwgdykgKyAobWluPG1heD9taW46bWF4KTtcblx0XHR9LFxuXG5cdFx0ZWxlbWVudDogZnVuY3Rpb24odGhpbmcsIHcpe1xuXHRcdFx0Ly8gcmV0dXJuIHJhbmQgc2xvdCwgY2hhciwgcHJvcCBvciByYW5nZVxuXHRcdFx0aWYodHlwZW9mKHRoaW5nKSA9PT0gXCJudW1iZXJcIil7IHJldHVybiB0aGlzLm4odGhpbmcsIHcpOyB9XG5cdFx0XHR0aGluZyA9IHRoaXMudG9BcnJheSh0aGluZyk7XG5cdFx0XHRyZXR1cm4gdGhpbmdbdGhpcy5uKHRoaW5nLmxlbmd0aCwgdyldO1xuXHRcdH0sXG5cblx0XHRzY3JhbWJsZTogZnVuY3Rpb24oYXJ5KXtcblx0XHRcdHZhclxuXHRcdFx0XHRhID0gYXJ5LmNvbmNhdChbXSksXG5cdFx0XHRcdHNkID0gW10sXG5cdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0XHRzZC5wdXNoKGEuc3BsaWNlKHRoaXMubihhLmxlbmd0aCksIDEpWzBdKTtcblx0XHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNkO1xuXHRcdH0sXG5cblx0XHRiaWdudW1iZXI6IGZ1bmN0aW9uKGxlbil7XG5cdFx0XHR2YXIgdD1cIlwiO1xuXHRcdFx0d2hpbGUobGVuLS0pe1xuXHRcdFx0XHRcdHQgKz0gdGhpcy5uKDkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHQ7XG5cdFx0fSxcblxuXHRcdGRhdGU6IGZ1bmN0aW9uKG8pe1xuXHRcdFx0byA9IG8gfHwge307XG5cdFx0XHR2YXJcblx0XHRcdFx0ZCxcblx0XHRcdFx0ZDEgPSBuZXcgRGF0ZShvLm1pbiB8fCBuZXcgRGF0ZSgpKSxcblx0XHRcdFx0ZDIgPSBuZXcgRGF0ZShvLm1heCB8fCBuZXcgRGF0ZSgpLnNldEZ1bGxZZWFyKGQxLmdldEZ1bGxZZWFyKCkrKG8ueWVhclJhbmdlfHwxKSkpLmdldFRpbWUoKTtcblx0XHRcdGQxID0gZDEuZ2V0VGltZSgpO1xuXHRcdFx0ZCA9IG5ldyBEYXRlKHRoaXMucmFuZ2UoZDEsZDIsby53ZWlnaHQpKTtcblx0XHRcdGlmKG8uc2Vjb25kcyl7XG5cdFx0XHRcdHJldHVybiBkLmdldFRpbWUoKTtcblx0XHRcdH1lbHNlIGlmKG8uZGVsaW1pdGVyKXtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFkKGQuZ2V0TW9udGgoKSsxKStvLmRlbGltaXRlcit0aGlzLnBhZChkLmdldERhdGUoKSsxKStvLmRlbGltaXRlcisoZC5nZXRGdWxsWWVhcigpKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkO1xuXHRcdH0sXG5cblx0XHRib29sOiBmdW5jdGlvbih3KXtcblx0XHRcdHJldHVybiB0aGlzLm4oMiwgdykgPCAxO1xuXHRcdH0sXG5cblx0XHRjb2xvcjogZnVuY3Rpb24odyl7XG5cdFx0XHRyZXR1cm4gXCIjXCIrdGhpcy5wYWQodGhpcy5uKDI1NSwgdykudG9TdHJpbmcoMTYpKSt0aGlzLnBhZCh0aGlzLm4oMjU1LCB3KS50b1N0cmluZygxNikpK3RoaXMucGFkKHRoaXMubigyNTUsIHcpLnRvU3RyaW5nKDE2KSk7XG5cdFx0fSxcblxuXHRcdGNoYXJzOmZ1bmN0aW9uKG1pbiwgbWF4LCB3KXtcblx0XHRcdHZhciBzID0gXCJcIixcblx0XHRcdGkgPSB0aGlzLnJhbmdlKG1pbiwgbWF4LCB3KTtcblx0XHRcdHdoaWxlKGktLSl7XG5cdFx0XHRcdHMgKz0gdGhpcy5sZXR0ZXJzW3RoaXMubih0aGlzLmxldHRlcnMubGVuZ3RoKV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcztcblx0XHR9LFxuXG5cdFx0bmFtZTogZnVuY3Rpb24oY3NlKXtcblx0XHRcdC8vIGNzZTogMCB0aXRsZSBjYXNlLCAxIGxvd2VyY2FzZSwgMiB1cHBlciBjYXNlXG5cdFx0XHR2YXIgcyA9IHRoaXMubmFtZXNbdGhpcy5uKHRoaXMubmFtZXMubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdGNpdHlTdGF0ZTogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBjaXR5U3RhdGVzW3RoaXMubihjaXR5U3RhdGVzLmxlbmd0aCldO1xuXHRcdH0sXG5cblx0XHRzdGF0ZTogZnVuY3Rpb24oY3NlKXtcblx0XHRcdC8vIGNzZTogMCB0aXRsZSBjYXNlLCAxIGxvd2VyY2FzZSwgMiB1cHBlciBjYXNlXG5cdFx0XHR2YXIgcyA9IHN0YXRlc1t0aGlzLm4oc3RhdGVzLmxlbmd0aCldO1xuXHRcdFx0cmV0dXJuICFjc2UgPyBzIDogY3NlID09PSAxID8gcy50b0xvd2VyQ2FzZSgpIDogcy50b1VwcGVyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHRzdGF0ZUNvZGU6IGZ1bmN0aW9uKGNzZSl7XG5cdFx0XHRjc2UgPSBjc2UgPT09IHVuZGVmaW5lZCA/IDIgOiBjc2U7XG5cdFx0XHQvLyBjc2U6IDAgdGl0bGUgY2FzZSwgMSBsb3dlcmNhc2UsIDIgdXBwZXIgY2FzZVxuXHRcdFx0dmFyIHMgPSBzdGF0ZUFiYnJbdGhpcy5uKHN0YXRlQWJici5sZW5ndGgpXTtcblx0XHRcdHJldHVybiAhY3NlID8gcyA6IGNzZSA9PT0gMSA/IHMudG9Mb3dlckNhc2UoKSA6IHMudG9VcHBlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0c3RyZWV0OiBmdW5jdGlvbihub1N1ZmZpeCl7XG5cdFx0XHR2YXIgcyA9IHN0cmVldHNbdGhpcy5uKHN0cmVldHMubGVuZ3RoKV07XG5cdFx0XHRpZighbm9TdWZmaXgpe1xuXHRcdFx0XHRzKz0gJyAnICsgc3RyZWV0U3VmZml4ZXNbdGhpcy5uKHN0cmVldFN1ZmZpeGVzLmxlbmd0aCldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHM7XG5cdFx0fSxcblxuXHRcdHNpdGU6IGZ1bmN0aW9uKGNzZSl7XG5cdFx0XHQvLyBjc2U6IDAgdGl0bGUgY2FzZSwgMSBsb3dlcmNhc2UsIDIgdXBwZXIgY2FzZVxuXHRcdFx0dmFyIHMgPSB0aGlzLnNpdGVzW3RoaXMubih0aGlzLnNpdGVzLmxlbmd0aCldO1xuXHRcdFx0cmV0dXJuICFjc2UgPyBzIDogY3NlID09PSAxID8gcy50b0xvd2VyQ2FzZSgpIDogcy50b1VwcGVyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHR1cmw6IGZ1bmN0aW9uKHVzZXd3dywgeHQpe1xuXHRcdFx0dmFyIHcgPSB1c2V3d3cgPyBcInd3dy5cIiA6IFwiXCI7XG5cdFx0XHR4dCA9IHh0IHx8IFwiLmNvbVwiO1xuXHRcdFx0cmV0dXJuIFwiaHR0cDovL1wiICsgdyArIHRoaXMuc2l0ZSgxKSArIHh0O1xuXHRcdH0sXG5cblx0XHR3b3JkOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHcgPSB0aGlzLnJlYWwgPyB0aGlzLndvcmRzIDogdGhpcy53dXJkcztcblx0XHRcdHJldHVybiB3W3RoaXMubih3Lmxlbmd0aCldO1xuXHRcdH0sXG5cblx0XHRzZW50ZW5jZXM6IGZ1bmN0aW9uKG1pbkFtdCwgbWF4QW10LCBtaW5MZW4sIG1heExlbil7XG5cdFx0XHQvLyBhbXQ6IHNlbnRlbmNlcywgbGVuOiB3b3Jkc1xuXHRcdFx0bWluQW10ID0gbWluQW10IHx8IDE7XG5cdFx0XHRtYXhBbXQgPSBtYXhBbXQgfHwgbWluQW10O1xuXHRcdFx0bWluTGVuID0gbWluTGVuIHx8IDU7XG5cdFx0XHRtYXhMZW4gPSBtYXhMZW4gfHwgbWluTGVuO1xuXG5cdFx0XHR2YXJcblx0XHRcdFx0aWksXG5cdFx0XHRcdHMgPSBbXSxcblx0XHRcdFx0dCA9IFwiXCIsXG5cdFx0XHRcdHcgPSB0aGlzLnJlYWwgPyB0aGlzLndvcmRzIDogdGhpcy53dXJkcyxcblx0XHRcdFx0aSA9IHRoaXMucmFuZ2UobWluQW10LCBtYXhBbXQpO1xuXG5cdFx0XHR3aGlsZShpLS0pe1xuXG5cdFx0XHRcdGlpID0gdGhpcy5yYW5nZShtaW5MZW4sIG1heExlbik7IHdoaWxlKGlpLS0pe1xuXHRcdFx0XHRcdHMucHVzaCh3W3RoaXMubih3Lmxlbmd0aCldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0ICs9IHRoaXMuY2FwKHMuam9pbihcIiBcIikpICtcIi4gXCI7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9LFxuXG5cdFx0dGl0bGU6IGZ1bmN0aW9uKG1pbiwgbWF4KXtcblx0XHRcdG1pbiA9IG1pbiB8fCAxOyBtYXggPSBtYXggfHwgbWluO1xuXHRcdFx0dmFyXG5cdFx0XHRcdGEgPSBbXSxcblx0XHRcdFx0dyA9IHRoaXMucmVhbCA/IHRoaXMud29yZHMgOiB0aGlzLnd1cmRzLFxuXHRcdFx0XHRpID0gdGhpcy5yYW5nZShtaW4sIG1heCk7XG5cdFx0XHR3aGlsZShpLS0pe1xuXHRcdFx0XHRhLnB1c2godGhpcy5jYXAod1t0aGlzLm4ody5sZW5ndGgpXSkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGEuam9pbihcIiBcIik7XG5cdFx0fSxcblx0XHRkYXRhOiBmdW5jdGlvbihhbXQpe1xuXHRcdFx0dmFyXG5cdFx0XHRcdHN0LFxuXHRcdFx0XHRpdGVtcyA9IFtdLFxuXHRcdFx0XHRpdGVtLFxuXHRcdFx0XHRpO1xuXHRcdFx0Zm9yKGkgPSAwOyBpIDwgYW10OyBpKyspe1xuXHRcdFx0XHRpdGVtID0ge1xuXHRcdFx0XHRcdGZpcnN0TmFtZTogdGhpcy5uYW1lKCksXG5cdFx0XHRcdFx0bGFzdE5hbWU6IHRoaXMubmFtZSgpLFxuXHRcdFx0XHRcdGNvbXBhbnk6IHRoaXMuc2l0ZSgpLFxuXHRcdFx0XHRcdGFkZHJlc3MxOiB0aGlzLmJpZ251bWJlcih0aGlzLnJhbmdlKDMsIDUpKSxcblx0XHRcdFx0XHRhZGRyZXNzMjogdGhpcy5zdHJlZXQoKSxcblx0XHRcdFx0XHRiaXJ0aGRheTogdGhpcy5kYXRlKHtkZWxpbWl0ZXI6Jy8nfSlcblx0XHRcdFx0fTtcblx0XHRcdFx0aXRlbS5lbWFpbCA9IChpdGVtLmZpcnN0TmFtZS5zdWJzdHJpbmcoMCwxKSArIGl0ZW0ubGFzdE5hbWUgKyAnQCcgKyBpdGVtLmNvbXBhbnkgKyAnLmNvbScpLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdHN0ID0gdGhpcy5jaXR5U3RhdGUoKTtcblx0XHRcdFx0aXRlbS5jaXR5ID0gc3Quc3BsaXQoJywgJylbMF07XG5cdFx0XHRcdGl0ZW0uc3RhdGUgPSBzdC5zcGxpdCgnLCAnKVsxXTtcblx0XHRcdFx0aXRlbS56aXBjb2RlID0gdGhpcy5iaWdudW1iZXIoNSk7XG5cdFx0XHRcdGl0ZW0ucGhvbmUgPSB0aGlzLmZvcm1hdCh0aGlzLmJpZ251bWJlcigxMCksICdwaG9uZScpO1xuXHRcdFx0XHRpdGVtLnNzbiA9IHRoaXMuZm9ybWF0KHRoaXMuYmlnbnVtYmVyKDkpLCAnc3NuJyk7XG5cdFx0XHRcdGl0ZW1zLnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaXRlbXM7XG5cdFx0fSxcblxuXHRcdGZvcm1hdDogZnVuY3Rpb24gKG4sIHR5cGUpIHtcblx0XHRcdHZhciBkID0gJy0nO1xuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgJ3Bob25lJzpcblx0XHRcdFx0XHRuID0gJycgKyBuO1xuXHRcdFx0XHRcdHJldHVybiBuLnN1YnN0cmluZygwLDMpICsgZCArIG4uc3Vic3RyaW5nKDMsNikgKyBkICsgbi5zdWJzdHJpbmcoNik7XG5cdFx0XHRcdGNhc2UgJ3Nzbic6XG5cdFx0XHRcdFx0biA9ICcnICsgbjtcblx0XHRcdFx0XHRyZXR1cm4gbi5zdWJzdHJpbmcoMCwzKSArIGQgKyBuLnN1YnN0cmluZygzLDUpICsgZCArIG4uc3Vic3RyaW5nKDUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmFuZC53dXJkcyA9IHdvcmRzLnJlcGxhY2UoL2F8ZXxpfG98dS9nLCBmdW5jdGlvbihjKXsgcmV0dXJuIChcImFlaW91XCIpW3JhbmQubig1KV07IH0pLnNwbGl0KFwiLFwiKTtcblxuXHRyZXR1cm4gcmFuZDtcbn0pKTtcbiJdfQ==
