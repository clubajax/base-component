require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
const BaseComponent = require('BaseComponent');
const dom = require('dom');
//const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const r = /\{\{\w*}}/g;

// TODO: switch to ES6 literals? Maybe not...

// FIXME: time current process
// Try a new one where meta data is created, instead of a template

function createCondition(name, value) {
    // FIXME name?
    value = value.replace(r, function (w) {
        w = w.replace('{{', '').replace('}}', '');
        return 'item["' + w + '"]';
    });
    //console.log('createCondition', name, value);
    return function (item) {
        return eval(value);
    };
}

function walkDom(node, refs) {

    let item = {
        node: node
    };

    refs.nodes.push(item);

    if (node.attributes) {
        for (let i = 0; i < node.attributes.length; i++) {
            let
                name = node.attributes[i].name,
                value = node.attributes[i].value;
            //console.log('  ', name, value);
            if (name === 'if') {
                item.conditional = createCondition(name, value);
            }
            else if (/\{\{/.test(value)) {
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
            let prop = node.innerHTML.replace('{{', '').replace('}}', '');
            item.text = item.text || {};
            item.text[prop] = node.innerHTML;
            refs[prop] = node;
        }
        return;
    }

    for (let i = 0; i < node.children.length; i++) {
        walkDom(node.children[i], refs);
    }
}

function updateItemTemplate(frag) {
    let refs = {
        nodes: []
    };
    walkDom(frag, refs);
    return refs;
}

BaseComponent.prototype.renderList = function (items, container, itemTemplate) {
    let
        frag = document.createDocumentFragment(),
        tmpl = itemTemplate || this.itemTemplate,
        refs = tmpl.itemRefs,
        clone,
        defer;

    function warn(name) {
        clearTimeout(defer);
        defer = setTimeout(function () {
            console.warn('Attempted to set attribute from non-existent item property:', name);
        }, 1);
    }

    items.forEach(function (item) {

        let
            ifCount = 0,
            deletions = [];

        refs.nodes.forEach(function (ref) {

            //
            // can't swap because the innerHTML is being changed
            // can't clone because then there is not a node reference
            //
            let
                value,
                node = ref.node,
                hasNode = true;
            if (ref.conditional) {
                if (!ref.conditional(item)) {
                    hasNode = false;
                    ifCount++;
                    // can't actually delete, because this is the original template
                    // instead, adding attribute to track node, to be deleted in clone
                    // then after, remove temporary attribute from template
                    ref.node.setAttribute('ifs', ifCount+'');
                    deletions.push('[ifs="'+ifCount+'"]');
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
                        node.innerHTML = value.replace(value, item[key])
                    });
                }
            }
        });

        clone = tmpl.cloneNode(true);

        deletions.forEach(function (del) {
            let node = clone.querySelector(del);
            if(node) {
                dom.destroy(node);
                let tmplNode = tmpl.querySelector(del);
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
    preDomReady: function (node) {
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
},{"BaseComponent":"BaseComponent","dom":"dom"}],3:[function(require,module,exports){
const BaseComponent = require('BaseComponent');
const dom = require('dom');

function setBoolean (node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			return node.hasAttribute(prop);
		},
		set (value) {
			this.isSettingAttribute = true;
			if (value) {
				this.setAttribute(prop, '');
			} else {
				this.removeAttribute(prop);
			}
			const fn = this[onify(prop)];
			if(fn){
				fn.call(this, value);
			}

			this.isSettingAttribute = false;
		}
	});
}

function setProperty (node, prop) {
	let propValue;
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			return propValue !== undefined ? propValue : dom.normalize(this.getAttribute(prop));
		},
		set (value) {
			this.isSettingAttribute = true;
			this.setAttribute(prop, value);
			const fn = this[onify(prop)];
			if(fn){
				onDomReady(this, () => {
					value = fn.call(this, value) || value;
					if(value !== undefined){
						propValue = value;
					}
				});
			}
			this.isSettingAttribute = false;
		}
	});
}

function setObject (node, prop) {
	Object.defineProperty(node, prop, {
		enumerable: true,
		configurable: true,
		get () {
			return this['__' + prop];
		},
		set (value) {
			this['__' + prop] = value;
		}
	});
}

function setProperties (node) {
	let props = node.props || node.properties;
	if (props) {
		props.forEach(function (prop) {
			if (prop === 'disabled') {
				setBoolean(node, prop);
			}
			else {
				setProperty(node, prop);
			}
		});
	}
}

function setBooleans (node) {
	let props = node.bools || node.booleans;
	if (props) {
		props.forEach(function (prop) {
			setBoolean(node, prop);
		});
	}
}

function setObjects (node) {
	let props = node.objects;
	if (props) {
		props.forEach(function (prop) {
			setObject(node, prop);
		});
	}
}

function cap (name) {
	return name.substring(0,1).toUpperCase() + name.substring(1);
}

function onify (name) {
	return 'on' + name.split('-').map(word => cap(word)).join('');
}

function isBool (node, name) {
	return (node.bools || node.booleans || []).indexOf(name) > -1;
}

function boolNorm (value) {
	if(value === ''){
		return true;
	}
	return dom.normalize(value);
}

function propNorm (value) {
	return dom.normalize(value);
}

BaseComponent.addPlugin({
	name: 'properties',
	order: 10,
	init: function (node) {
		setProperties(node);
		setBooleans(node);
	},
	preAttributeChanged: function (node, name, value) {
		if (node.isSettingAttribute) {
			return false;
		}
		if(isBool(node, name)){
			value = boolNorm(value);
			node[name] = !!value;
			if(!value){
				node[name] = false;
				node.isSettingAttribute = true;
				node.removeAttribute(name);
				node.isSettingAttribute = false;
			} else {
				node[name] = true;
			}
			return;
		}

		node[name] = propNorm(value);
	}
});
},{"BaseComponent":"BaseComponent","dom":"dom"}],4:[function(require,module,exports){
const dom = require('dom');
const BaseComponent = require('BaseComponent');

function assignRefs (node) {
    dom.queryAll(node, '[ref]').forEach(function (child) {
        let name = child.getAttribute('ref');
        node[name] = child;
    });
}

function assignEvents (node) {
    // <div on="click:onClick">
    dom.queryAll(node, '[on]').forEach(function (child) {
        let
            keyValue = child.getAttribute('on'),
            event = keyValue.split(':')[0].trim(),
            method = keyValue.split(':')[1].trim();
        node.on(child, event, function (e) {
            node[method](e)
        })
    });
}

BaseComponent.addPlugin({
    name: 'refs',
    order: 30,
    preConnected: function (node) {
        assignRefs(node);
        assignEvents(node);
    }
});
},{"BaseComponent":"BaseComponent","dom":"dom"}],5:[function(require,module,exports){
const BaseComponent  = require('BaseComponent');
const dom = require('dom');

var
    lightNodes = {},
    inserted = {};

function insert (node) {
    if(inserted[node._uid] || !hasTemplate(node)){
        return;
    }
    collectLightNodes(node);
    insertTemplate(node);
    inserted[node._uid] = true;
}

function collectLightNodes(node){
    lightNodes[node._uid] = lightNodes[node._uid] || [];
    while(node.childNodes.length){
        lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
    }
}

function hasTemplate (node) {
    return !!node.getTemplateNode();
}

function insertTemplateChain (node) {
    var templates = node.getTemplateChain();
    templates.reverse().forEach(function (template) {
        getContainer(node).appendChild(BaseComponent.clone(template));
    });
    insertChildren(node);
}

function insertTemplate (node) {
    if(node.nestedTemplate){
        insertTemplateChain(node);
        return;
    }
    var
        templateNode = node.getTemplateNode();

    if(templateNode) {
        node.appendChild(BaseComponent.clone(templateNode));
    }
    insertChildren(node);
}

function getContainer (node) {
    var containers = node.querySelectorAll('[ref="container"]');
    if(!containers || !containers.length){
        return node;
    }
    return containers[containers.length - 1];
}

function insertChildren (node) {
    var i,
        container = getContainer(node),
        children = lightNodes[node._uid];

    if(container && children && children.length){
        for(i = 0; i < children.length; i++){
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
            this.templateNode = dom.byId(this.templateId.replace('#',''));
        }
        else if (this.templateString) {
            this.templateNode = dom.toDom('<template>' + this.templateString + '</template>');
        }
    //}
    return this.templateNode;
};

BaseComponent.prototype.getTemplateChain = function () {

    let
        context = this,
        templates = [],
        template;

    // walk the prototype chain; Babel doesn't allow using
    // `super` since we are outside of the Class
    while(context){
        context = Object.getPrototypeOf(context);
        if(!context){ break; }
        // skip prototypes without a template
        // (else it will pull an inherited template and cause duplicates)
        if(context.hasOwnProperty('templateString') || context.hasOwnProperty('templateId')) {
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
    preConnected: function (node) {
        insert(node);
    }
});
},{"BaseComponent":"BaseComponent","dom":"dom"}],6:[function(require,module,exports){
window['no-native-shim'] = true;
require('custom-elements-polyfill');
window.on = require('on');
window.dom = require('dom');
},{"custom-elements-polyfill":1,"dom":"dom","on":"on"}],7:[function(require,module,exports){
const BaseComponent  = require('../../src/BaseComponent');
const properties = require('../../src/properties');
const template = require('../../src/template');
const refs = require('../../src/refs');
const itemTemplate = require('../../src/item-template');

class TestProps extends BaseComponent {

    static get observedAttributes() { return ['min', 'max', 'foo', 'bar', 'nbc', 'cbs', 'disabled', 'readonly', 'tabindex', 'my-complex-prop']; }
    get props () { return ['foo', 'bar', 'tabindex', 'min', 'max', 'my-complex-prop']; }
    get bools () { return ['nbc', 'cbs', 'disabled', 'readonly']; }

    attributeChanged (name, value) {
        this[name + '-changed'] = dom.normalize(value) || value !== null;
    }
}

customElements.define('test-props', TestProps);

class TestLifecycle extends BaseComponent {

    static get observedAttributes() {return ['foo', 'bar']; }

    set foo (value) {
        this.__foo = value;
    }

    get foo () {
        return this.__foo;
    }

    set bar (value) {
        this.__bar = value;
    }

    get bar () {
        return this.__bar || 'NOTSET';
    }

    constructor(...args) {
        super();
    }

    connected () {
        on.fire(document, 'connected-called', this);
    }

    domReady () {
        on.fire(document, 'domready-called', this);
    }

    disconnected () {
        on.fire(document, 'disconnected-called', this);
    }

}

customElements.define('test-lifecycle', TestLifecycle);

BaseComponent.addPlugin({
    init: function (node, a, b, c) {
        on.fire(document, 'init-called');
    },
    preConnected: function (node, a, b, c) {
        on.fire(document, 'preConnected-called');
    },
    postConnected: function (node, a, b, c) {
        on.fire(document, 'postConnected-called');
    },
    preDomReady: function (node, a, b, c) {
        on.fire(document, 'preDomReady-called');
    },
    postDomReady: function (node, a, b, c) {
        on.fire(document, 'postDomReady-called');
    }
});


class TestTmplString extends BaseComponent {
    get templateString () {
        return `<div>This is a simple template</div>`;
    }
}
customElements.define('test-tmpl-string', TestTmplString);

class TestTmplId extends BaseComponent {
    get templateId () {
        return 'test-tmpl-id-template';
    }
}
customElements.define('test-tmpl-id', TestTmplId);


class TestTmplRefs extends BaseComponent {
    get templateString () {
        return `<div on="click:onClick" ref="clickNode">
            <label ref="labelNode">label:</label>
            <span ref="valueNode">value</span>
        </div>`;
    }

    onClick () {
        on.fire(document, 'ref-click-called');
    }
}
customElements.define('test-tmpl-refs', TestTmplRefs);

class TestTmplContainer extends BaseComponent {
    get templateString () {
        return `<div>
            <label ref="labelNode">label:</label>
            <span ref="valueNode">value</span>
            <div ref="container"></div>
        </div>`;
    }
}
customElements.define('test-tmpl-container', TestTmplContainer);


// simple nested templates
class TestTmplNestedA extends BaseComponent {
    constructor () {
        super();
        this.nestedTemplate = true;
    }

    get templateString () {
        return `<section>
            <div>content A before</div>
            <section ref="container"></section>
            <div>content A after</div>
        </section>`;
    }
}
customElements.define('test-tmpl-nested-a', TestTmplNestedA);

class TestTmplNestedB extends TestTmplNestedA {
    constructor () {
        super();
    }
    get templateString () {
        return `<div>content B</div>`;
    }
}
customElements.define('test-tmpl-nested-b', TestTmplNestedB);


// nested plus light dom
class TestTmplNestedC extends TestTmplNestedA {
    constructor () {
        super();
    }
    get templateString () {
        return `<section>
            <div>content C before</div>
            <div ref="container"></div>
            <div>content C after</div>
        </section>`;
    }
}
customElements.define('test-tmpl-nested-c', TestTmplNestedC);


// 5-deep nested templates
class TestA extends BaseComponent {}
class TestB extends TestA {
    constructor () {
        super();
    }
    get templateString () {
        return `<section>
            <div>content B before</div>
            <section ref="container"></section>
            <div>content B after</div>
        </section>`;
    }
}
class TestC extends TestB {}
class TestD extends TestC {
    constructor () {
        super();
    }
    get templateString () {
        return `<div>content D</div>`;
    }
}
class TestE extends TestD {
    constructor () {
        super();
        this.nestedTemplate = true;
    }
}
customElements.define('test-a', TestA);
customElements.define('test-b', TestB);
customElements.define('test-c', TestC);
customElements.define('test-d', TestD);
customElements.define('test-e', TestE);

class TestList extends BaseComponent {

    static get observedAttributes() { return ['list-title']; }
    get props () { return ['list-title']; }

    constructor () {
        super();
    }

    get templateString () {
        return `
            <div class="title" ref="titleNode"></div>
            <div ref="container"></div>`;
    }
    
    set data (items) {
        this.renderList(items, this.container);
    }

    domReady () {
        this.titleNode.innerHTML = this['list-title'];
    }
}
customElements.define('test-list', TestList);



window.itemTemplateString = `<template>
    <div id="{{id}}">
        <span>{{first}}</span>
        <span>{{last}}</span>
        <span>{{role}}</span>
    </div>
</template>`;

window.ifAttrTemplateString = `<template>
    <div id="{{id}}">
        <span>{{first}}</span>
        <span>{{last}}</span>
        <span>{{role}}</span>
        <span if="{{amount}} < 2" class="amount">{{amount}}</span>
        <span if="{{type}} === 'sane'" class="sanity">{{type}}</span>
    </div>
</template>`;

function dev () {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var s = '{{amount}} + {{num}} + 3';
    var list = [{amount: 1, num: 2}, {amount: 3, num: 4}, {amount: 5, num: 6}];
    var r = /\{\{\w*}}/g;
    var fn = [];
    var args = [];
    var f;
    s = s.replace(r, function(w){
        console.log('word', w);
        var v = alphabet.shift();
        fn.push(v);
        args.push(/\w+/g.exec(w)[0]);
        return v;
    });
    fn.push(s);

    console.log('fn', fn);
    console.log('args', args);
    //s = 'return ' + s + ';';
    console.log('s', s);

    window.f = new Function(s);

    var dynFn = function (a,b,c,d,e,f) {
        var r = eval(s);
        return r;
    };

    console.log('  f:', dynFn(1,2));
    //
    list.forEach(function (item) {
        var a = args.map(function (arg) {
            return item[arg];
        });
        var r = dynFn.apply(null, a);
        console.log('r', r);
    });


}
//dev();
},{"../../src/BaseComponent":"BaseComponent","../../src/item-template":2,"../../src/properties":3,"../../src/refs":4,"../../src/template":5}],"BaseComponent":[function(require,module,exports){
"use strict";

// class/component rules
// always call super() first in the ctor. This also calls the extended class' ctor.
// cannot call NEW on a Component class

// Classes http://exploringjs.com/es6/ch_classes.html#_the-species-pattern-in-static-methods

const on = require('on');
const dom = require('dom');

class BaseComponent extends HTMLElement {
	constructor() {
		super();
		this._uid = dom.uid(this.localName);
		privates[this._uid] = {DOMSTATE: 'created'};
		privates[this._uid].handleList = [];
		plugin('init', this);
	}

	connectedCallback() {
		privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
		plugin('preConnected', this);
		nextTick(onCheckDomReady.bind(this));
		if (this.connected) {
			this.connected();
		}
		this.fire('connected');
		plugin('postConnected', this);
	}

	disconnectedCallback() {
		privates[this._uid].DOMSTATE = 'disconnected';
		plugin('preDisconnected', this);
		if (this.disconnected) {
			this.disconnected();
		}
		this.fire('disconnected');

		let time, dod = BaseComponent.destroyOnDisconnect;
		if (dod) {
			time = typeof dod === 'number' ? doc : 300;
			setTimeout(() => {
				if(this.DOMSTATE === 'disconnected'){
					this.destroy();
				}
			}, time);
		}
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		plugin('preAttributeChanged', this, attrName, newVal, oldVal);
		if (this.attributeChanged) {
			this.attributeChanged(attrName, newVal, oldVal);
		}
	}

	destroy() {
		this.fire('destroy');
		privates[this._uid].handleList.forEach(function (handle) {
			handle.remove();
		});
		dom.destroy(this);
	}

	fire(eventName, eventDetail, bubbles) {
		return on.fire(this, eventName, eventDetail, bubbles);
	}

	emit(eventName, value) {
		return on.emit(this, eventName, value);
	}

	on(node, eventName, selector, callback) {
		return this.registerHandle(
			typeof node !== 'string' ? // no node is supplied
				on(node, eventName, selector, callback) :
				on(this, node, eventName, selector));
	}

	once(node, eventName, selector, callback) {
		return this.registerHandle(
			typeof node !== 'string' ? // no node is supplied
				on.once(node, eventName, selector, callback) :
				on.once(this, node, eventName, selector, callback));
	}

	attr (key, value, toggle) {
		this.isSettingAttribute = true;
		const add = toggle === undefined ? true : !!toggle;
		if(add){
			this.setAttribute(key, value);
		}else{
			this.removeAttribute(key);
		}
		this.isSettingAttribute = false;
	}

	registerHandle(handle) {
		privates[this._uid].handleList.push(handle);
		return handle;
	}

	get DOMSTATE() {
		return privates[this._uid].DOMSTATE;
	}

	static set destroyOnDisconnect(value) {
		privates['destroyOnDisconnect'] = value;
	}

	static get destroyOnDisconnect() {
		return privates['destroyOnDisconnect'];
	}

	static clone(template) {
		if (template.content && template.content.children) {
			return document.importNode(template.content, true);
		}
		const frag = document.createDocumentFragment();
		const cloneNode = document.createElement('div');
		cloneNode.innerHTML = template.innerHTML;

		while (cloneNode.children.length) {
			frag.appendChild(cloneNode.children[0]);
		}
		return frag;
	}

	static addPlugin(plug) {
		let i, order = plug.order || 100;
		if (!plugins.length) {
			plugins.push(plug);
		}
		else if (plugins.length === 1) {
			if (plugins[0].order <= order) {
				plugins.push(plug);
			}
			else {
				plugins.unshift(plug);
			}
		}
		else if (plugins[0].order > order) {
			plugins.unshift(plug);
		}
		else {

			for (i = 1; i < plugins.length; i++) {
				if (order === plugins[i - 1].order || (order > plugins[i - 1].order && order < plugins[i].order)) {
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

function plugin(method, node, a, b, c) {
	plugins.forEach(function (plug) {
		if (plug[method]) {
			plug[method](node, a, b, c);
		}
	});
}

function onCheckDomReady() {
	if (this.DOMSTATE !== 'connected' || privates[this._uid].domReadyFired) {
		return;
	}

	let
		count = 0,
		children = getChildCustomNodes(this),
		ourDomReady = onDomReady.bind(this);

	function addReady() {
		count++;
		if (count === children.length) {
			ourDomReady();
		}
	}

	// If no children, we're good - leaf node. Commence with onDomReady
	//
	if (!children.length) {
		ourDomReady();
	}
	else {
		// else, wait for all children to fire their `ready` events
		//
		children.forEach(function (child) {
			// check if child is already ready
			// also check for connected - this handles moving a node from another node
			// NOPE, that failed. removed for now child.DOMSTATE === 'connected'
			if (child.DOMSTATE === 'domready') {
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
	let i, nodes = [];
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
	}
	else {
		node.addEventListener('domready', onReady);
	}
};

module.exports = BaseComponent;
},{"dom":"dom","on":"on"}]},{},[6,7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsL2luZGV4LmpzIiwic3JjL2l0ZW0tdGVtcGxhdGUuanMiLCJzcmMvcHJvcGVydGllcy5qcyIsInNyYy9yZWZzLmpzIiwic3JjL3RlbXBsYXRlLmpzIiwidGVzdHMvc3JjL2dsb2JhbHMuanMiLCJ0ZXN0cy9zcmMvbGlmZWN5Y2xlLmpzIiwic3JjL0Jhc2VDb21wb25lbnQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBzdXBwb3J0c1YxID0gJ2N1c3RvbUVsZW1lbnRzJyBpbiB3aW5kb3c7XG52YXIgc3VwcG9ydHNQcm9taXNlID0gJ1Byb21pc2UnIGluIHdpbmRvdztcbnZhciBuYXRpdmVTaGltQmFzZTY0ID0gXCJablZ1WTNScGIyNGdibUYwYVhabFUyaHBiU2dwZXlnb0tUMCtleWQxYzJVZ2MzUnlhV04wSnp0cFppZ2hkMmx1Wkc5M0xtTjFjM1J2YlVWc1pXMWxiblJ6S1hKbGRIVnlianRqYjI1emRDQmhQWGRwYm1SdmR5NUlWRTFNUld4bGJXVnVkQ3hpUFhkcGJtUnZkeTVqZFhOMGIyMUZiR1Z0Wlc1MGN5NWtaV1pwYm1Vc1l6MTNhVzVrYjNjdVkzVnpkRzl0Uld4bGJXVnVkSE11WjJWMExHUTlibVYzSUUxaGNDeGxQVzVsZHlCTllYQTdiR1YwSUdZOUlURXNaejBoTVR0M2FXNWtiM2N1U0ZSTlRFVnNaVzFsYm5ROVpuVnVZM1JwYjI0b0tYdHBaaWdoWmlsN1kyOXVjM1FnYWoxa0xtZGxkQ2gwYUdsekxtTnZibk4wY25WamRHOXlLU3hyUFdNdVkyRnNiQ2gzYVc1a2IzY3VZM1Z6ZEc5dFJXeGxiV1Z1ZEhNc2FpazdaejBoTUR0amIyNXpkQ0JzUFc1bGR5QnJPM0psZEhWeWJpQnNmV1k5SVRFN2ZTeDNhVzVrYjNjdVNGUk5URVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxQV0V1Y0hKdmRHOTBlWEJsTzA5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDNhVzVrYjNjc0oyTjFjM1J2YlVWc1pXMWxiblJ6Snl4N2RtRnNkV1U2ZDJsdVpHOTNMbU4xYzNSdmJVVnNaVzFsYm5SekxHTnZibVpwWjNWeVlXSnNaVG9oTUN4M2NtbDBZV0pzWlRvaE1IMHBMRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoM2FXNWtiM2N1WTNWemRHOXRSV3hsYldWdWRITXNKMlJsWm1sdVpTY3NlM1poYkhWbE9paHFMR3NwUFQ1N1kyOXVjM1FnYkQxckxuQnliM1J2ZEhsd1pTeHRQV05zWVhOeklHVjRkR1Z1WkhNZ1lYdGpiMjV6ZEhKMVkzUnZjaWdwZTNOMWNHVnlLQ2tzVDJKcVpXTjBMbk5sZEZCeWIzUnZkSGx3WlU5bUtIUm9hWE1zYkNrc1ozeDhLR1k5SVRBc2F5NWpZV3hzS0hSb2FYTXBLU3huUFNFeE8zMTlMRzQ5YlM1d2NtOTBiM1I1Y0dVN2JTNXZZbk5sY25abFpFRjBkSEpwWW5WMFpYTTlheTV2WW5ObGNuWmxaRUYwZEhKcFluVjBaWE1zYmk1amIyNXVaV04wWldSRFlXeHNZbUZqYXoxc0xtTnZibTVsWTNSbFpFTmhiR3hpWVdOckxHNHVaR2x6WTI5dWJtVmpkR1ZrUTJGc2JHSmhZMnM5YkM1a2FYTmpiMjV1WldOMFpXUkRZV3hzWW1GamF5eHVMbUYwZEhKcFluVjBaVU5vWVc1blpXUkRZV3hzWW1GamF6MXNMbUYwZEhKcFluVjBaVU5vWVc1blpXUkRZV3hzWW1GamF5eHVMbUZrYjNCMFpXUkRZV3hzWW1GamF6MXNMbUZrYjNCMFpXUkRZV3hzWW1GamF5eGtMbk5sZENockxHb3BMR1V1YzJWMEtHb3NheWtzWWk1allXeHNLSGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3l4cUxHMHBPMzBzWTI5dVptbG5kWEpoWW14bE9pRXdMSGR5YVhSaFlteGxPaUV3ZlNrc1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLSGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3l3bloyVjBKeXg3ZG1Gc2RXVTZLR29wUFQ1bExtZGxkQ2hxS1N4amIyNW1hV2QxY21GaWJHVTZJVEFzZDNKcGRHRmliR1U2SVRCOUtUdDlLU2dwTzMwPVwiO1xuaWYoc3VwcG9ydHNWMSAmJiAhd2luZG93Wyduby1uYXRpdmUtc2hpbSddKXtcblx0ZXZhbCh3aW5kb3cuYXRvYihuYXRpdmVTaGltQmFzZTY0KSk7XG5cdG5hdGl2ZVNoaW0oKTtcbn1lbHNle1xuXHRjdXN0b21FbGVtZW50cygpO1xufVxuaWYgKCFzdXBwb3J0c1Byb21pc2UpIHtcblx0cHJvbWlzZVBvbHlmaWxsKCk7XG59XG5cbmZ1bmN0aW9uIGN1c3RvbUVsZW1lbnRzKCkge1xuKGZ1bmN0aW9uKCl7XG4ndXNlIHN0cmljdCc7dmFyIGc9bmV3IGZ1bmN0aW9uKCl7fTt2YXIgYWE9bmV3IFNldChcImFubm90YXRpb24teG1sIGNvbG9yLXByb2ZpbGUgZm9udC1mYWNlIGZvbnQtZmFjZS1zcmMgZm9udC1mYWNlLXVyaSBmb250LWZhY2UtZm9ybWF0IGZvbnQtZmFjZS1uYW1lIG1pc3NpbmctZ2x5cGhcIi5zcGxpdChcIiBcIikpO2Z1bmN0aW9uIGsoYil7dmFyIGE9YWEuaGFzKGIpO2I9L15bYS16XVsuMC05X2Etel0qLVtcXC0uMC05X2Etel0qJC8udGVzdChiKTtyZXR1cm4hYSYmYn1mdW5jdGlvbiBsKGIpe3ZhciBhPWIuaXNDb25uZWN0ZWQ7aWYodm9pZCAwIT09YSlyZXR1cm4gYTtmb3IoO2ImJiEoYi5fX0NFX2lzSW1wb3J0RG9jdW1lbnR8fGIgaW5zdGFuY2VvZiBEb2N1bWVudCk7KWI9Yi5wYXJlbnROb2RlfHwod2luZG93LlNoYWRvd1Jvb3QmJmIgaW5zdGFuY2VvZiBTaGFkb3dSb290P2IuaG9zdDp2b2lkIDApO3JldHVybiEoIWJ8fCEoYi5fX0NFX2lzSW1wb3J0RG9jdW1lbnR8fGIgaW5zdGFuY2VvZiBEb2N1bWVudCkpfVxuZnVuY3Rpb24gbShiLGEpe2Zvcig7YSYmYSE9PWImJiFhLm5leHRTaWJsaW5nOylhPWEucGFyZW50Tm9kZTtyZXR1cm4gYSYmYSE9PWI/YS5uZXh0U2libGluZzpudWxsfVxuZnVuY3Rpb24gbihiLGEsZSl7ZT1lP2U6bmV3IFNldDtmb3IodmFyIGM9YjtjOyl7aWYoYy5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFKXt2YXIgZD1jO2EoZCk7dmFyIGg9ZC5sb2NhbE5hbWU7aWYoXCJsaW5rXCI9PT1oJiZcImltcG9ydFwiPT09ZC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikpe2M9ZC5pbXBvcnQ7aWYoYyBpbnN0YW5jZW9mIE5vZGUmJiFlLmhhcyhjKSlmb3IoZS5hZGQoYyksYz1jLmZpcnN0Q2hpbGQ7YztjPWMubmV4dFNpYmxpbmcpbihjLGEsZSk7Yz1tKGIsZCk7Y29udGludWV9ZWxzZSBpZihcInRlbXBsYXRlXCI9PT1oKXtjPW0oYixkKTtjb250aW51ZX1pZihkPWQuX19DRV9zaGFkb3dSb290KWZvcihkPWQuZmlyc3RDaGlsZDtkO2Q9ZC5uZXh0U2libGluZyluKGQsYSxlKX1jPWMuZmlyc3RDaGlsZD9jLmZpcnN0Q2hpbGQ6bShiLGMpfX1mdW5jdGlvbiBxKGIsYSxlKXtiW2FdPWV9O2Z1bmN0aW9uIHIoKXt0aGlzLmE9bmV3IE1hcDt0aGlzLmY9bmV3IE1hcDt0aGlzLmM9W107dGhpcy5iPSExfWZ1bmN0aW9uIGJhKGIsYSxlKXtiLmEuc2V0KGEsZSk7Yi5mLnNldChlLmNvbnN0cnVjdG9yLGUpfWZ1bmN0aW9uIHQoYixhKXtiLmI9ITA7Yi5jLnB1c2goYSl9ZnVuY3Rpb24gdihiLGEpe2IuYiYmbihhLGZ1bmN0aW9uKGEpe3JldHVybiB3KGIsYSl9KX1mdW5jdGlvbiB3KGIsYSl7aWYoYi5iJiYhYS5fX0NFX3BhdGNoZWQpe2EuX19DRV9wYXRjaGVkPSEwO2Zvcih2YXIgZT0wO2U8Yi5jLmxlbmd0aDtlKyspYi5jW2VdKGEpfX1mdW5jdGlvbiB4KGIsYSl7dmFyIGU9W107bihhLGZ1bmN0aW9uKGIpe3JldHVybiBlLnB1c2goYil9KTtmb3IoYT0wO2E8ZS5sZW5ndGg7YSsrKXt2YXIgYz1lW2FdOzE9PT1jLl9fQ0Vfc3RhdGU/Yi5jb25uZWN0ZWRDYWxsYmFjayhjKTp5KGIsYyl9fVxuZnVuY3Rpb24geihiLGEpe3ZhciBlPVtdO24oYSxmdW5jdGlvbihiKXtyZXR1cm4gZS5wdXNoKGIpfSk7Zm9yKGE9MDthPGUubGVuZ3RoO2ErKyl7dmFyIGM9ZVthXTsxPT09Yy5fX0NFX3N0YXRlJiZiLmRpc2Nvbm5lY3RlZENhbGxiYWNrKGMpfX1cbmZ1bmN0aW9uIEEoYixhLGUpe2U9ZT9lOm5ldyBTZXQ7dmFyIGM9W107bihhLGZ1bmN0aW9uKGQpe2lmKFwibGlua1wiPT09ZC5sb2NhbE5hbWUmJlwiaW1wb3J0XCI9PT1kLmdldEF0dHJpYnV0ZShcInJlbFwiKSl7dmFyIGE9ZC5pbXBvcnQ7YSBpbnN0YW5jZW9mIE5vZGUmJlwiY29tcGxldGVcIj09PWEucmVhZHlTdGF0ZT8oYS5fX0NFX2lzSW1wb3J0RG9jdW1lbnQ9ITAsYS5fX0NFX2hhc1JlZ2lzdHJ5PSEwKTpkLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oKXt2YXIgYT1kLmltcG9ydDthLl9fQ0VfZG9jdW1lbnRMb2FkSGFuZGxlZHx8KGEuX19DRV9kb2N1bWVudExvYWRIYW5kbGVkPSEwLGEuX19DRV9pc0ltcG9ydERvY3VtZW50PSEwLGEuX19DRV9oYXNSZWdpc3RyeT0hMCxuZXcgU2V0KGUpLGUuZGVsZXRlKGEpLEEoYixhLGUpKX0pfWVsc2UgYy5wdXNoKGQpfSxlKTtpZihiLmIpZm9yKGE9MDthPGMubGVuZ3RoO2ErKyl3KGIsY1thXSk7Zm9yKGE9MDthPGMubGVuZ3RoO2ErKyl5KGIsXG5jW2FdKX1cbmZ1bmN0aW9uIHkoYixhKXtpZih2b2lkIDA9PT1hLl9fQ0Vfc3RhdGUpe3ZhciBlPWIuYS5nZXQoYS5sb2NhbE5hbWUpO2lmKGUpe2UuY29uc3RydWN0aW9uU3RhY2sucHVzaChhKTt2YXIgYz1lLmNvbnN0cnVjdG9yO3RyeXt0cnl7aWYobmV3IGMhPT1hKXRocm93IEVycm9yKFwiVGhlIGN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9yIGRpZCBub3QgcHJvZHVjZSB0aGUgZWxlbWVudCBiZWluZyB1cGdyYWRlZC5cIik7fWZpbmFsbHl7ZS5jb25zdHJ1Y3Rpb25TdGFjay5wb3AoKX19Y2F0Y2goZil7dGhyb3cgYS5fX0NFX3N0YXRlPTIsZjt9YS5fX0NFX3N0YXRlPTE7YS5fX0NFX2RlZmluaXRpb249ZTtpZihlLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaylmb3IoZT1lLm9ic2VydmVkQXR0cmlidXRlcyxjPTA7YzxlLmxlbmd0aDtjKyspe3ZhciBkPWVbY10saD1hLmdldEF0dHJpYnV0ZShkKTtudWxsIT09aCYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYSxkLG51bGwsaCxudWxsKX1sKGEpJiZiLmNvbm5lY3RlZENhbGxiYWNrKGEpfX19XG5yLnByb3RvdHlwZS5jb25uZWN0ZWRDYWxsYmFjaz1mdW5jdGlvbihiKXt2YXIgYT1iLl9fQ0VfZGVmaW5pdGlvbjthLmNvbm5lY3RlZENhbGxiYWNrJiZhLmNvbm5lY3RlZENhbGxiYWNrLmNhbGwoYil9O3IucHJvdG90eXBlLmRpc2Nvbm5lY3RlZENhbGxiYWNrPWZ1bmN0aW9uKGIpe3ZhciBhPWIuX19DRV9kZWZpbml0aW9uO2EuZGlzY29ubmVjdGVkQ2FsbGJhY2smJmEuZGlzY29ubmVjdGVkQ2FsbGJhY2suY2FsbChiKX07ci5wcm90b3R5cGUuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrPWZ1bmN0aW9uKGIsYSxlLGMsZCl7dmFyIGg9Yi5fX0NFX2RlZmluaXRpb247aC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2smJi0xPGgub2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YoYSkmJmguYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrLmNhbGwoYixhLGUsYyxkKX07ZnVuY3Rpb24gQihiLGEpe3RoaXMuYz1iO3RoaXMuYT1hO3RoaXMuYj12b2lkIDA7QSh0aGlzLmMsdGhpcy5hKTtcImxvYWRpbmdcIj09PXRoaXMuYS5yZWFkeVN0YXRlJiYodGhpcy5iPW5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZi5iaW5kKHRoaXMpKSx0aGlzLmIub2JzZXJ2ZSh0aGlzLmEse2NoaWxkTGlzdDohMCxzdWJ0cmVlOiEwfSkpfWZ1bmN0aW9uIEMoYil7Yi5iJiZiLmIuZGlzY29ubmVjdCgpfUIucHJvdG90eXBlLmY9ZnVuY3Rpb24oYil7dmFyIGE9dGhpcy5hLnJlYWR5U3RhdGU7XCJpbnRlcmFjdGl2ZVwiIT09YSYmXCJjb21wbGV0ZVwiIT09YXx8Qyh0aGlzKTtmb3IoYT0wO2E8Yi5sZW5ndGg7YSsrKWZvcih2YXIgZT1iW2FdLmFkZGVkTm9kZXMsYz0wO2M8ZS5sZW5ndGg7YysrKUEodGhpcy5jLGVbY10pfTtmdW5jdGlvbiBjYSgpe3ZhciBiPXRoaXM7dGhpcy5iPXRoaXMuYT12b2lkIDA7dGhpcy5jPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEpe2IuYj1hO2IuYSYmYShiLmEpfSl9ZnVuY3Rpb24gRChiKXtpZihiLmEpdGhyb3cgRXJyb3IoXCJBbHJlYWR5IHJlc29sdmVkLlwiKTtiLmE9dm9pZCAwO2IuYiYmYi5iKHZvaWQgMCl9O2Z1bmN0aW9uIEUoYil7dGhpcy5mPSExO3RoaXMuYT1iO3RoaXMuaD1uZXcgTWFwO3RoaXMuZz1mdW5jdGlvbihiKXtyZXR1cm4gYigpfTt0aGlzLmI9ITE7dGhpcy5jPVtdO3RoaXMuaj1uZXcgQihiLGRvY3VtZW50KX1cbkUucHJvdG90eXBlLmw9ZnVuY3Rpb24oYixhKXt2YXIgZT10aGlzO2lmKCEoYSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3JzIG11c3QgYmUgZnVuY3Rpb25zLlwiKTtpZighayhiKSl0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJUaGUgZWxlbWVudCBuYW1lICdcIitiK1wiJyBpcyBub3QgdmFsaWQuXCIpO2lmKHRoaXMuYS5hLmdldChiKSl0aHJvdyBFcnJvcihcIkEgY3VzdG9tIGVsZW1lbnQgd2l0aCBuYW1lICdcIitiK1wiJyBoYXMgYWxyZWFkeSBiZWVuIGRlZmluZWQuXCIpO2lmKHRoaXMuZil0aHJvdyBFcnJvcihcIkEgY3VzdG9tIGVsZW1lbnQgaXMgYWxyZWFkeSBiZWluZyBkZWZpbmVkLlwiKTt0aGlzLmY9ITA7dmFyIGMsZCxoLGYsdTt0cnl7dmFyIHA9ZnVuY3Rpb24oYil7dmFyIGE9UFtiXTtpZih2b2lkIDAhPT1hJiYhKGEgaW5zdGFuY2VvZiBGdW5jdGlvbikpdGhyb3cgRXJyb3IoXCJUaGUgJ1wiK2IrXCInIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi5cIik7XG5yZXR1cm4gYX0sUD1hLnByb3RvdHlwZTtpZighKFAgaW5zdGFuY2VvZiBPYmplY3QpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgY3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3IncyBwcm90b3R5cGUgaXMgbm90IGFuIG9iamVjdC5cIik7Yz1wKFwiY29ubmVjdGVkQ2FsbGJhY2tcIik7ZD1wKFwiZGlzY29ubmVjdGVkQ2FsbGJhY2tcIik7aD1wKFwiYWRvcHRlZENhbGxiYWNrXCIpO2Y9cChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiKTt1PWEub2JzZXJ2ZWRBdHRyaWJ1dGVzfHxbXX1jYXRjaCh2YSl7cmV0dXJufWZpbmFsbHl7dGhpcy5mPSExfWJhKHRoaXMuYSxiLHtsb2NhbE5hbWU6Yixjb25zdHJ1Y3RvcjphLGNvbm5lY3RlZENhbGxiYWNrOmMsZGlzY29ubmVjdGVkQ2FsbGJhY2s6ZCxhZG9wdGVkQ2FsbGJhY2s6aCxhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6ZixvYnNlcnZlZEF0dHJpYnV0ZXM6dSxjb25zdHJ1Y3Rpb25TdGFjazpbXX0pO3RoaXMuYy5wdXNoKGIpO3RoaXMuYnx8KHRoaXMuYj1cbiEwLHRoaXMuZyhmdW5jdGlvbigpe2lmKCExIT09ZS5iKWZvcihlLmI9ITEsQShlLmEsZG9jdW1lbnQpOzA8ZS5jLmxlbmd0aDspe3ZhciBiPWUuYy5zaGlmdCgpOyhiPWUuaC5nZXQoYikpJiZEKGIpfX0pKX07RS5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGIpe2lmKGI9dGhpcy5hLmEuZ2V0KGIpKXJldHVybiBiLmNvbnN0cnVjdG9yfTtFLnByb3RvdHlwZS5vPWZ1bmN0aW9uKGIpe2lmKCFrKGIpKXJldHVybiBQcm9taXNlLnJlamVjdChuZXcgU3ludGF4RXJyb3IoXCInXCIrYitcIicgaXMgbm90IGEgdmFsaWQgY3VzdG9tIGVsZW1lbnQgbmFtZS5cIikpO3ZhciBhPXRoaXMuaC5nZXQoYik7aWYoYSlyZXR1cm4gYS5jO2E9bmV3IGNhO3RoaXMuaC5zZXQoYixhKTt0aGlzLmEuYS5nZXQoYikmJi0xPT09dGhpcy5jLmluZGV4T2YoYikmJkQoYSk7cmV0dXJuIGEuY307RS5wcm90b3R5cGUubT1mdW5jdGlvbihiKXtDKHRoaXMuaik7dmFyIGE9dGhpcy5nO3RoaXMuZz1mdW5jdGlvbihlKXtyZXR1cm4gYihmdW5jdGlvbigpe3JldHVybiBhKGUpfSl9fTtcbndpbmRvdy5DdXN0b21FbGVtZW50UmVnaXN0cnk9RTtFLnByb3RvdHlwZS5kZWZpbmU9RS5wcm90b3R5cGUubDtFLnByb3RvdHlwZS5nZXQ9RS5wcm90b3R5cGUuZ2V0O0UucHJvdG90eXBlLndoZW5EZWZpbmVkPUUucHJvdG90eXBlLm87RS5wcm90b3R5cGUucG9seWZpbGxXcmFwRmx1c2hDYWxsYmFjaz1FLnByb3RvdHlwZS5tO3ZhciBGPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCxkYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnROUyxlYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmltcG9ydE5vZGUsZmE9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5wcmVwZW5kLGdhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuYXBwZW5kLEc9d2luZG93Lk5vZGUucHJvdG90eXBlLmNsb25lTm9kZSxIPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5hcHBlbmRDaGlsZCxJPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5pbnNlcnRCZWZvcmUsSj13aW5kb3cuTm9kZS5wcm90b3R5cGUucmVtb3ZlQ2hpbGQsSz13aW5kb3cuTm9kZS5wcm90b3R5cGUucmVwbGFjZUNoaWxkLEw9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuTm9kZS5wcm90b3R5cGUsXCJ0ZXh0Q29udGVudFwiKSxNPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hdHRhY2hTaGFkb3csTj1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSxcblwiaW5uZXJIVE1MXCIpLE89d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZSxRPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUsUj13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlLFM9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZU5TLFQ9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZU5TLFU9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZU5TLFY9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmluc2VydEFkamFjZW50RWxlbWVudCxoYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucHJlcGVuZCxpYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYXBwZW5kLGphPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5iZWZvcmUsa2E9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmFmdGVyLGxhPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZXBsYWNlV2l0aCxtYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlLFxubmE9d2luZG93LkhUTUxFbGVtZW50LFc9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlLFwiaW5uZXJIVE1MXCIpLFg9d2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZS5pbnNlcnRBZGphY2VudEVsZW1lbnQ7ZnVuY3Rpb24gb2EoKXt2YXIgYj1ZO3dpbmRvdy5IVE1MRWxlbWVudD1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoKXt2YXIgYT10aGlzLmNvbnN0cnVjdG9yLGM9Yi5mLmdldChhKTtpZighYyl0aHJvdyBFcnJvcihcIlRoZSBjdXN0b20gZWxlbWVudCBiZWluZyBjb25zdHJ1Y3RlZCB3YXMgbm90IHJlZ2lzdGVyZWQgd2l0aCBgY3VzdG9tRWxlbWVudHNgLlwiKTt2YXIgZD1jLmNvbnN0cnVjdGlvblN0YWNrO2lmKCFkLmxlbmd0aClyZXR1cm4gZD1GLmNhbGwoZG9jdW1lbnQsYy5sb2NhbE5hbWUpLE9iamVjdC5zZXRQcm90b3R5cGVPZihkLGEucHJvdG90eXBlKSxkLl9fQ0Vfc3RhdGU9MSxkLl9fQ0VfZGVmaW5pdGlvbj1jLHcoYixkKSxkO3ZhciBjPWQubGVuZ3RoLTEsaD1kW2NdO2lmKGg9PT1nKXRocm93IEVycm9yKFwiVGhlIEhUTUxFbGVtZW50IGNvbnN0cnVjdG9yIHdhcyBlaXRoZXIgY2FsbGVkIHJlZW50cmFudGx5IGZvciB0aGlzIGNvbnN0cnVjdG9yIG9yIGNhbGxlZCBtdWx0aXBsZSB0aW1lcy5cIik7XG5kW2NdPWc7T2JqZWN0LnNldFByb3RvdHlwZU9mKGgsYS5wcm90b3R5cGUpO3coYixoKTtyZXR1cm4gaH1hLnByb3RvdHlwZT1uYS5wcm90b3R5cGU7cmV0dXJuIGF9KCl9O2Z1bmN0aW9uIHBhKGIsYSxlKXthLnByZXBlbmQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBkPVtdLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7KytjKWRbYy0wXT1hcmd1bWVudHNbY107Yz1kLmZpbHRlcihmdW5jdGlvbihiKXtyZXR1cm4gYiBpbnN0YW5jZW9mIE5vZGUmJmwoYil9KTtlLmkuYXBwbHkodGhpcyxkKTtmb3IodmFyIGY9MDtmPGMubGVuZ3RoO2YrKyl6KGIsY1tmXSk7aWYobCh0aGlzKSlmb3IoYz0wO2M8ZC5sZW5ndGg7YysrKWY9ZFtjXSxmIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGYpfTthLmFwcGVuZD1mdW5jdGlvbihhKXtmb3IodmFyIGQ9W10sYz0wO2M8YXJndW1lbnRzLmxlbmd0aDsrK2MpZFtjLTBdPWFyZ3VtZW50c1tjXTtjPWQuZmlsdGVyKGZ1bmN0aW9uKGIpe3JldHVybiBiIGluc3RhbmNlb2YgTm9kZSYmbChiKX0pO2UuYXBwZW5kLmFwcGx5KHRoaXMsZCk7Zm9yKHZhciBmPTA7ZjxjLmxlbmd0aDtmKyspeihiLGNbZl0pO2lmKGwodGhpcykpZm9yKGM9MDtjPFxuZC5sZW5ndGg7YysrKWY9ZFtjXSxmIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGYpfX07ZnVuY3Rpb24gcWEoKXt2YXIgYj1ZO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiY3JlYXRlRWxlbWVudFwiLGZ1bmN0aW9uKGEpe2lmKHRoaXMuX19DRV9oYXNSZWdpc3RyeSl7dmFyIGU9Yi5hLmdldChhKTtpZihlKXJldHVybiBuZXcgZS5jb25zdHJ1Y3Rvcn1hPUYuY2FsbCh0aGlzLGEpO3coYixhKTtyZXR1cm4gYX0pO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiaW1wb3J0Tm9kZVwiLGZ1bmN0aW9uKGEsZSl7YT1lYS5jYWxsKHRoaXMsYSxlKTt0aGlzLl9fQ0VfaGFzUmVnaXN0cnk/QShiLGEpOnYoYixhKTtyZXR1cm4gYX0pO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiY3JlYXRlRWxlbWVudE5TXCIsZnVuY3Rpb24oYSxlKXtpZih0aGlzLl9fQ0VfaGFzUmVnaXN0cnkmJihudWxsPT09YXx8XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI9PT1hKSl7dmFyIGM9Yi5hLmdldChlKTtpZihjKXJldHVybiBuZXcgYy5jb25zdHJ1Y3Rvcn1hPWRhLmNhbGwodGhpcyxhLGUpO3coYixhKTtyZXR1cm4gYX0pO1xucGEoYixEb2N1bWVudC5wcm90b3R5cGUse2k6ZmEsYXBwZW5kOmdhfSl9O2Z1bmN0aW9uIHJhKCl7dmFyIGI9WTtmdW5jdGlvbiBhKGEsYyl7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsXCJ0ZXh0Q29udGVudFwiLHtlbnVtZXJhYmxlOmMuZW51bWVyYWJsZSxjb25maWd1cmFibGU6ITAsZ2V0OmMuZ2V0LHNldDpmdW5jdGlvbihhKXtpZih0aGlzLm5vZGVUeXBlPT09Tm9kZS5URVhUX05PREUpYy5zZXQuY2FsbCh0aGlzLGEpO2Vsc2V7dmFyIGQ9dm9pZCAwO2lmKHRoaXMuZmlyc3RDaGlsZCl7dmFyIGU9dGhpcy5jaGlsZE5vZGVzLHU9ZS5sZW5ndGg7aWYoMDx1JiZsKHRoaXMpKWZvcih2YXIgZD1BcnJheSh1KSxwPTA7cDx1O3ArKylkW3BdPWVbcF19Yy5zZXQuY2FsbCh0aGlzLGEpO2lmKGQpZm9yKGE9MDthPGQubGVuZ3RoO2ErKyl6KGIsZFthXSl9fX0pfXEoTm9kZS5wcm90b3R5cGUsXCJpbnNlcnRCZWZvcmVcIixmdW5jdGlvbihhLGMpe2lmKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTtcbmE9SS5jYWxsKHRoaXMsYSxjKTtpZihsKHRoaXMpKWZvcihjPTA7YzxkLmxlbmd0aDtjKyspeChiLGRbY10pO3JldHVybiBhfWQ9bChhKTtjPUkuY2FsbCh0aGlzLGEsYyk7ZCYmeihiLGEpO2wodGhpcykmJngoYixhKTtyZXR1cm4gY30pO3EoTm9kZS5wcm90b3R5cGUsXCJhcHBlbmRDaGlsZFwiLGZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTthPUguY2FsbCh0aGlzLGEpO2lmKGwodGhpcykpZm9yKHZhciBkPTA7ZDxjLmxlbmd0aDtkKyspeChiLGNbZF0pO3JldHVybiBhfWM9bChhKTtkPUguY2FsbCh0aGlzLGEpO2MmJnooYixhKTtsKHRoaXMpJiZ4KGIsYSk7cmV0dXJuIGR9KTtxKE5vZGUucHJvdG90eXBlLFwiY2xvbmVOb2RlXCIsZnVuY3Rpb24oYSl7YT1HLmNhbGwodGhpcyxhKTt0aGlzLm93bmVyRG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT9BKGIsYSk6dihiLGEpO1xucmV0dXJuIGF9KTtxKE5vZGUucHJvdG90eXBlLFwicmVtb3ZlQ2hpbGRcIixmdW5jdGlvbihhKXt2YXIgYz1sKGEpLGQ9Si5jYWxsKHRoaXMsYSk7YyYmeihiLGEpO3JldHVybiBkfSk7cShOb2RlLnByb3RvdHlwZSxcInJlcGxhY2VDaGlsZFwiLGZ1bmN0aW9uKGEsYyl7aWYoYSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhLmNoaWxkTm9kZXMpO2E9Sy5jYWxsKHRoaXMsYSxjKTtpZihsKHRoaXMpKWZvcih6KGIsYyksYz0wO2M8ZC5sZW5ndGg7YysrKXgoYixkW2NdKTtyZXR1cm4gYX12YXIgZD1sKGEpLGU9Sy5jYWxsKHRoaXMsYSxjKSxmPWwodGhpcyk7ZiYmeihiLGMpO2QmJnooYixhKTtmJiZ4KGIsYSk7cmV0dXJuIGV9KTtMJiZMLmdldD9hKE5vZGUucHJvdG90eXBlLEwpOnQoYixmdW5jdGlvbihiKXthKGIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe2Zvcih2YXIgYT1bXSxiPVxuMDtiPHRoaXMuY2hpbGROb2Rlcy5sZW5ndGg7YisrKWEucHVzaCh0aGlzLmNoaWxkTm9kZXNbYl0udGV4dENvbnRlbnQpO3JldHVybiBhLmpvaW4oXCJcIil9LHNldDpmdW5jdGlvbihhKXtmb3IoO3RoaXMuZmlyc3RDaGlsZDspSi5jYWxsKHRoaXMsdGhpcy5maXJzdENoaWxkKTtILmNhbGwodGhpcyxkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSl9fSl9KX07ZnVuY3Rpb24gc2EoYil7dmFyIGE9RWxlbWVudC5wcm90b3R5cGU7YS5iZWZvcmU9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGFyZ3VtZW50cy5sZW5ndGg7KytkKWNbZC0wXT1hcmd1bWVudHNbZF07ZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KTtqYS5hcHBseSh0aGlzLGMpO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKXooYixkW2VdKTtpZihsKHRoaXMpKWZvcihkPTA7ZDxjLmxlbmd0aDtkKyspZT1jW2RdLGUgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZSl9O2EuYWZ0ZXI9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGFyZ3VtZW50cy5sZW5ndGg7KytkKWNbZC0wXT1hcmd1bWVudHNbZF07ZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KTtrYS5hcHBseSh0aGlzLGMpO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKXooYixkW2VdKTtpZihsKHRoaXMpKWZvcihkPVxuMDtkPGMubGVuZ3RoO2QrKyllPWNbZF0sZSBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixlKX07YS5yZXBsYWNlV2l0aD1mdW5jdGlvbihhKXtmb3IodmFyIGM9W10sZD0wO2Q8YXJndW1lbnRzLmxlbmd0aDsrK2QpY1tkLTBdPWFyZ3VtZW50c1tkXTt2YXIgZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KSxlPWwodGhpcyk7bGEuYXBwbHkodGhpcyxjKTtmb3IodmFyIGY9MDtmPGQubGVuZ3RoO2YrKyl6KGIsZFtmXSk7aWYoZSlmb3IoeihiLHRoaXMpLGQ9MDtkPGMubGVuZ3RoO2QrKyllPWNbZF0sZSBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixlKX07YS5yZW1vdmU9ZnVuY3Rpb24oKXt2YXIgYT1sKHRoaXMpO21hLmNhbGwodGhpcyk7YSYmeihiLHRoaXMpfX07ZnVuY3Rpb24gdGEoKXt2YXIgYj1ZO2Z1bmN0aW9uIGEoYSxjKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxcImlubmVySFRNTFwiLHtlbnVtZXJhYmxlOmMuZW51bWVyYWJsZSxjb25maWd1cmFibGU6ITAsZ2V0OmMuZ2V0LHNldDpmdW5jdGlvbihhKXt2YXIgZD10aGlzLGU9dm9pZCAwO2wodGhpcykmJihlPVtdLG4odGhpcyxmdW5jdGlvbihhKXthIT09ZCYmZS5wdXNoKGEpfSkpO2Muc2V0LmNhbGwodGhpcyxhKTtpZihlKWZvcih2YXIgZj0wO2Y8ZS5sZW5ndGg7ZisrKXt2YXIgaD1lW2ZdOzE9PT1oLl9fQ0Vfc3RhdGUmJmIuZGlzY29ubmVjdGVkQ2FsbGJhY2soaCl9dGhpcy5vd25lckRvY3VtZW50Ll9fQ0VfaGFzUmVnaXN0cnk/QShiLHRoaXMpOnYoYix0aGlzKTtyZXR1cm4gYX19KX1mdW5jdGlvbiBlKGEsYyl7cShhLFwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50XCIsZnVuY3Rpb24oYSxkKXt2YXIgZT1sKGQpO2E9Yy5jYWxsKHRoaXMsYSxkKTtlJiZ6KGIsZCk7bChhKSYmeChiLGQpO1xucmV0dXJuIGF9KX1NP3EoRWxlbWVudC5wcm90b3R5cGUsXCJhdHRhY2hTaGFkb3dcIixmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fX0NFX3NoYWRvd1Jvb3Q9YT1NLmNhbGwodGhpcyxhKX0pOmNvbnNvbGUud2FybihcIkN1c3RvbSBFbGVtZW50czogYEVsZW1lbnQjYXR0YWNoU2hhZG93YCB3YXMgbm90IHBhdGNoZWQuXCIpO2lmKE4mJk4uZ2V0KWEoRWxlbWVudC5wcm90b3R5cGUsTik7ZWxzZSBpZihXJiZXLmdldClhKEhUTUxFbGVtZW50LnByb3RvdHlwZSxXKTtlbHNle3ZhciBjPUYuY2FsbChkb2N1bWVudCxcImRpdlwiKTt0KGIsZnVuY3Rpb24oYil7YShiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gRy5jYWxsKHRoaXMsITApLmlubmVySFRNTH0sc2V0OmZ1bmN0aW9uKGEpe3ZhciBiPVwidGVtcGxhdGVcIj09PXRoaXMubG9jYWxOYW1lP3RoaXMuY29udGVudDp0aGlzO2ZvcihjLmlubmVySFRNTD1hOzA8Yi5jaGlsZE5vZGVzLmxlbmd0aDspSi5jYWxsKGIsXG5iLmNoaWxkTm9kZXNbMF0pO2Zvcig7MDxjLmNoaWxkTm9kZXMubGVuZ3RoOylILmNhbGwoYixjLmNoaWxkTm9kZXNbMF0pfX0pfSl9cShFbGVtZW50LnByb3RvdHlwZSxcInNldEF0dHJpYnV0ZVwiLGZ1bmN0aW9uKGEsYyl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gUS5jYWxsKHRoaXMsYSxjKTt2YXIgZD1PLmNhbGwodGhpcyxhKTtRLmNhbGwodGhpcyxhLGMpO2M9Ty5jYWxsKHRoaXMsYSk7ZCE9PWMmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYSxkLGMsbnVsbCl9KTtxKEVsZW1lbnQucHJvdG90eXBlLFwic2V0QXR0cmlidXRlTlNcIixmdW5jdGlvbihhLGMsZSl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gVC5jYWxsKHRoaXMsYSxjLGUpO3ZhciBkPVMuY2FsbCh0aGlzLGEsYyk7VC5jYWxsKHRoaXMsYSxjLGUpO2U9Uy5jYWxsKHRoaXMsYSxjKTtkIT09ZSYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcyxjLGQsZSxhKX0pO3EoRWxlbWVudC5wcm90b3R5cGUsXG5cInJlbW92ZUF0dHJpYnV0ZVwiLGZ1bmN0aW9uKGEpe2lmKDEhPT10aGlzLl9fQ0Vfc3RhdGUpcmV0dXJuIFIuY2FsbCh0aGlzLGEpO3ZhciBjPU8uY2FsbCh0aGlzLGEpO1IuY2FsbCh0aGlzLGEpO251bGwhPT1jJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGEsYyxudWxsLG51bGwpfSk7cShFbGVtZW50LnByb3RvdHlwZSxcInJlbW92ZUF0dHJpYnV0ZU5TXCIsZnVuY3Rpb24oYSxjKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBVLmNhbGwodGhpcyxhLGMpO3ZhciBkPVMuY2FsbCh0aGlzLGEsYyk7VS5jYWxsKHRoaXMsYSxjKTt2YXIgZT1TLmNhbGwodGhpcyxhLGMpO2QhPT1lJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGMsZCxlLGEpfSk7WD9lKEhUTUxFbGVtZW50LnByb3RvdHlwZSxYKTpWP2UoRWxlbWVudC5wcm90b3R5cGUsVik6Y29uc29sZS53YXJuKFwiQ3VzdG9tIEVsZW1lbnRzOiBgRWxlbWVudCNpbnNlcnRBZGphY2VudEVsZW1lbnRgIHdhcyBub3QgcGF0Y2hlZC5cIik7XG5wYShiLEVsZW1lbnQucHJvdG90eXBlLHtpOmhhLGFwcGVuZDppYX0pO3NhKGIpfTtcbnZhciBaPXdpbmRvdy5jdXN0b21FbGVtZW50cztpZighWnx8Wi5mb3JjZVBvbHlmaWxsfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBaLmRlZmluZXx8XCJmdW5jdGlvblwiIT10eXBlb2YgWi5nZXQpe3ZhciBZPW5ldyByO29hKCk7cWEoKTtyYSgpO3RhKCk7ZG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT0hMDt2YXIgdWE9bmV3IEUoWSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdyxcImN1c3RvbUVsZW1lbnRzXCIse2NvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwLHZhbHVlOnVhfSl9O1xufSkuY2FsbChzZWxmKTtcbn1cbi8vIEBsaWNlbnNlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcblxuXG5mdW5jdGlvbiBwcm9taXNlUG9seWZpbGwgKCkge1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RheWxvcmhha2VzL3Byb21pc2UtcG9seWZpbGwvYmxvYi9tYXN0ZXIvcHJvbWlzZS5qc1xudmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcbmZ1bmN0aW9uIG5vb3AoKSB7fVxuZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xucmV0dXJuIGZ1bmN0aW9uICgpIHtcbmZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG59O1xufVxuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuaWYgKHR5cGVvZiB0aGlzICE9PSAnb2JqZWN0JykgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG5pZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xudGhpcy5fc3RhdGUgPSAwO1xudGhpcy5faGFuZGxlZCA9IGZhbHNlO1xudGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG50aGlzLl9kZWZlcnJlZHMgPSBbXTtcblxuZG9SZXNvbHZlKGZuLCB0aGlzKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xud2hpbGUgKHNlbGYuX3N0YXRlID09PSAzKSB7XG5zZWxmID0gc2VsZi5fdmFsdWU7XG59XG5pZiAoc2VsZi5fc3RhdGUgPT09IDApIHtcbnNlbGYuX2RlZmVycmVkcy5wdXNoKGRlZmVycmVkKTtcbnJldHVybjtcbn1cbnNlbGYuX2hhbmRsZWQgPSB0cnVlO1xuUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24gKCkge1xudmFyIGNiID0gc2VsZi5fc3RhdGUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG5pZiAoY2IgPT09IG51bGwpIHtcbihzZWxmLl9zdGF0ZSA9PT0gMSA/IHJlc29sdmUgOiByZWplY3QpKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbnJldHVybjtcbn1cbnZhciByZXQ7XG50cnkge1xucmV0ID0gY2Ioc2VsZi5fdmFsdWUpO1xufSBjYXRjaCAoZSkge1xucmVqZWN0KGRlZmVycmVkLnByb21pc2UsIGUpO1xucmV0dXJuO1xufVxucmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xufSk7XG59XG5mdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG50cnkge1xuLy8gUHJvbWlzZSBSZXNvbHV0aW9uIFByb2NlZHVyZTogaHR0cHM6Ly9naXRodWIuY29tL3Byb21pc2VzLWFwbHVzL3Byb21pc2VzLXNwZWMjdGhlLXByb21pc2UtcmVzb2x1dGlvbi1wcm9jZWR1cmVcbmlmIChuZXdWYWx1ZSA9PT0gc2VsZikgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKTtcbmlmIChuZXdWYWx1ZSAmJiAodHlwZW9mIG5ld1ZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpKSB7XG52YXIgdGhlbiA9IG5ld1ZhbHVlLnRoZW47XG5pZiAobmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5zZWxmLl9zdGF0ZSA9IDM7XG5zZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuZmluYWxlKHNlbGYpO1xucmV0dXJuO1xufSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbnJldHVybjtcbn1cbn1cbnNlbGYuX3N0YXRlID0gMTtcbnNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG5maW5hbGUoc2VsZik7XG59IGNhdGNoIChlKSB7XG5yZWplY3Qoc2VsZiwgZSk7XG59XG59XG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbnNlbGYuX3N0YXRlID0gMjtcbnNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG5maW5hbGUoc2VsZik7XG59XG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuaWYgKHNlbGYuX3N0YXRlID09PSAyICYmIHNlbGYuX2RlZmVycmVkcy5sZW5ndGggPT09IDApIHtcblByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG5Qcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbihzZWxmLl92YWx1ZSk7XG59XG59KTtcbn1cblxuZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGYuX2RlZmVycmVkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuaGFuZGxlKHNlbGYsIHNlbGYuX2RlZmVycmVkc1tpXSk7XG59XG5zZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xufVxuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSkge1xudGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbnRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG50aGlzLnByb21pc2UgPSBwcm9taXNlO1xufVxuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG52YXIgZG9uZSA9IGZhbHNlO1xudHJ5IHtcbmZuKGZ1bmN0aW9uICh2YWx1ZSkge1xuaWYgKGRvbmUpIHJldHVybjtcbmRvbmUgPSB0cnVlO1xucmVzb2x2ZShzZWxmLCB2YWx1ZSk7XG59LCBmdW5jdGlvbiAocmVhc29uKSB7XG5pZiAoZG9uZSkgcmV0dXJuO1xuZG9uZSA9IHRydWU7XG5yZWplY3Qoc2VsZiwgcmVhc29uKTtcbn0pO1xufSBjYXRjaCAoZXgpIHtcbmlmIChkb25lKSByZXR1cm47XG5kb25lID0gdHJ1ZTtcbnJlamVjdChzZWxmLCBleCk7XG59XG59XG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG5yZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xufTtcblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbnZhciBwcm9tID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yKShub29wKTtcblxuaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9tKSk7XG5yZXR1cm4gcHJvbTtcbn07XG5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uIChhcnIpIHtcbnZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbnJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5pZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbnZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcblxuZnVuY3Rpb24gcmVzKGksIHZhbCkge1xudHJ5IHtcbmlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG52YXIgdGhlbiA9IHZhbC50aGVuO1xuaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG50aGVuLmNhbGwodmFsLCBmdW5jdGlvbiAodmFsKSB7XG5yZXMoaSwgdmFsKTtcbn0sIHJlamVjdCk7XG5yZXR1cm47XG59XG59XG5hcmdzW2ldID0gdmFsO1xuaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG5yZXNvbHZlKGFyZ3MpO1xufVxufSBjYXRjaCAoZXgpIHtcbnJlamVjdChleCk7XG59XG59XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xucmVzKGksIGFyZ3NbaV0pO1xufVxufSk7XG59O1xuUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5pZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gUHJvbWlzZSkge1xucmV0dXJuIHZhbHVlO1xufVxuXG5yZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbnJlc29sdmUodmFsdWUpO1xufSk7XG59O1xuUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbnJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5yZWplY3QodmFsdWUpO1xufSk7XG59O1xuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xucmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbmZvciAodmFyIGkgPSAwLCBsZW4gPSB2YWx1ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbnZhbHVlc1tpXS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG59XG59KTtcbn07XG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9ICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmIGZ1bmN0aW9uIChmbikgeyBzZXRJbW1lZGlhdGUoZm4pOyB9KSB8fFxuZnVuY3Rpb24gKGZuKSB7XG5zZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG59O1xuUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG5pZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbmNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxufVxufTtcblByb21pc2UuX3NldEltbWVkaWF0ZUZuID0gZnVuY3Rpb24gX3NldEltbWVkaWF0ZUZuKGZuKSB7XG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9IGZuO1xufTtcblByb21pc2UuX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuKGZuKSB7XG5Qcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbiA9IGZuO1xufTtcbmNvbnNvbGUubG9nKCdQcm9taXNlIHBvbHlmaWxsJyk7XG53aW5kb3cuUHJvbWlzZSA9IFByb21pc2U7XG59XG4iLCJjb25zdCBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZSgnQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG4vL2NvbnN0IGFscGhhYmV0ID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jy5zcGxpdCgnJyk7XG5jb25zdCByID0gL1xce1xce1xcdyp9fS9nO1xuXG4vLyBUT0RPOiBzd2l0Y2ggdG8gRVM2IGxpdGVyYWxzPyBNYXliZSBub3QuLi5cblxuLy8gRklYTUU6IHRpbWUgY3VycmVudCBwcm9jZXNzXG4vLyBUcnkgYSBuZXcgb25lIHdoZXJlIG1ldGEgZGF0YSBpcyBjcmVhdGVkLCBpbnN0ZWFkIG9mIGEgdGVtcGxhdGVcblxuZnVuY3Rpb24gY3JlYXRlQ29uZGl0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgLy8gRklYTUUgbmFtZT9cbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UociwgZnVuY3Rpb24gKHcpIHtcbiAgICAgICAgdyA9IHcucmVwbGFjZSgne3snLCAnJykucmVwbGFjZSgnfX0nLCAnJyk7XG4gICAgICAgIHJldHVybiAnaXRlbVtcIicgKyB3ICsgJ1wiXSc7XG4gICAgfSk7XG4gICAgLy9jb25zb2xlLmxvZygnY3JlYXRlQ29uZGl0aW9uJywgbmFtZSwgdmFsdWUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gZXZhbCh2YWx1ZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gd2Fsa0RvbShub2RlLCByZWZzKSB7XG5cbiAgICBsZXQgaXRlbSA9IHtcbiAgICAgICAgbm9kZTogbm9kZVxuICAgIH07XG5cbiAgICByZWZzLm5vZGVzLnB1c2goaXRlbSk7XG5cbiAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXRcbiAgICAgICAgICAgICAgICBuYW1lID0gbm9kZS5hdHRyaWJ1dGVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBub2RlLmF0dHJpYnV0ZXNbaV0udmFsdWU7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCcgICcsIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnaWYnKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jb25kaXRpb25hbCA9IGNyZWF0ZUNvbmRpdGlvbihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgvXFx7XFx7Ly50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIDxkaXYgaWQ9XCJ7e2lkfX1cIj5cbiAgICAgICAgICAgICAgICByZWZzLmF0dHJpYnV0ZXMgPSByZWZzLmF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgICAgICAgICAgaXRlbS5hdHRyaWJ1dGVzID0gaXRlbS5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIGNvdWxkIGJlIG1vcmUgdGhhbiBvbmU/P1xuICAgICAgICAgICAgICAgIC8vIHNhbWUgd2l0aCBub2RlP1xuICAgICAgICAgICAgICAgIHJlZnMuYXR0cmlidXRlc1tuYW1lXSA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzaG91bGQgcHJvYmFibHkgbG9vcCBvdmVyIGNoaWxkTm9kZXMgYW5kIGNoZWNrIHRleHQgbm9kZXMgZm9yIHJlcGxhY2VtZW50c1xuICAgIC8vXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBpZiAoL1xce1xcey8udGVzdChub2RlLmlubmVySFRNTCkpIHtcbiAgICAgICAgICAgIC8vIEZJWE1FIC0gaW5uZXJIVE1MIGFzIHZhbHVlIHRvbyBuYWl2ZVxuICAgICAgICAgICAgbGV0IHByb3AgPSBub2RlLmlubmVySFRNTC5yZXBsYWNlKCd7eycsICcnKS5yZXBsYWNlKCd9fScsICcnKTtcbiAgICAgICAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dCB8fCB7fTtcbiAgICAgICAgICAgIGl0ZW0udGV4dFtwcm9wXSA9IG5vZGUuaW5uZXJIVE1MO1xuICAgICAgICAgICAgcmVmc1twcm9wXSA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB3YWxrRG9tKG5vZGUuY2hpbGRyZW5baV0sIHJlZnMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlSXRlbVRlbXBsYXRlKGZyYWcpIHtcbiAgICBsZXQgcmVmcyA9IHtcbiAgICAgICAgbm9kZXM6IFtdXG4gICAgfTtcbiAgICB3YWxrRG9tKGZyYWcsIHJlZnMpO1xuICAgIHJldHVybiByZWZzO1xufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5yZW5kZXJMaXN0ID0gZnVuY3Rpb24gKGl0ZW1zLCBjb250YWluZXIsIGl0ZW1UZW1wbGF0ZSkge1xuICAgIGxldFxuICAgICAgICBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICB0bXBsID0gaXRlbVRlbXBsYXRlIHx8IHRoaXMuaXRlbVRlbXBsYXRlLFxuICAgICAgICByZWZzID0gdG1wbC5pdGVtUmVmcyxcbiAgICAgICAgY2xvbmUsXG4gICAgICAgIGRlZmVyO1xuXG4gICAgZnVuY3Rpb24gd2FybihuYW1lKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChkZWZlcik7XG4gICAgICAgIGRlZmVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0F0dGVtcHRlZCB0byBzZXQgYXR0cmlidXRlIGZyb20gbm9uLWV4aXN0ZW50IGl0ZW0gcHJvcGVydHk6JywgbmFtZSk7XG4gICAgICAgIH0sIDEpO1xuICAgIH1cblxuICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblxuICAgICAgICBsZXRcbiAgICAgICAgICAgIGlmQ291bnQgPSAwLFxuICAgICAgICAgICAgZGVsZXRpb25zID0gW107XG5cbiAgICAgICAgcmVmcy5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZWYpIHtcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGNhbid0IHN3YXAgYmVjYXVzZSB0aGUgaW5uZXJIVE1MIGlzIGJlaW5nIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIGNhbid0IGNsb25lIGJlY2F1c2UgdGhlbiB0aGVyZSBpcyBub3QgYSBub2RlIHJlZmVyZW5jZVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIGxldFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIG5vZGUgPSByZWYubm9kZSxcbiAgICAgICAgICAgICAgICBoYXNOb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChyZWYuY29uZGl0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZi5jb25kaXRpb25hbChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNOb2RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuJ3QgYWN0dWFsbHkgZGVsZXRlLCBiZWNhdXNlIHRoaXMgaXMgdGhlIG9yaWdpbmFsIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc3RlYWQsIGFkZGluZyBhdHRyaWJ1dGUgdG8gdHJhY2sgbm9kZSwgdG8gYmUgZGVsZXRlZCBpbiBjbG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGFmdGVyLCByZW1vdmUgdGVtcG9yYXJ5IGF0dHJpYnV0ZSBmcm9tIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgIHJlZi5ub2RlLnNldEF0dHJpYnV0ZSgnaWZzJywgaWZDb3VudCsnJyk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0aW9ucy5wdXNoKCdbaWZzPVwiJytpZkNvdW50KydcIl0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZWYuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhyZWYuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZi5hdHRyaWJ1dGVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZWYubm9kZS5zZXRBdHRyaWJ1dGUoa2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3dhcCBhdHQnLCBrZXksIHZhbHVlLCByZWYubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVmLnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVmLnRleHQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWYudGV4dFtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc3dhcCB0ZXh0Jywga2V5LCBpdGVtW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSB2YWx1ZS5yZXBsYWNlKHZhbHVlLCBpdGVtW2tleV0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2xvbmUgPSB0bXBsLmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICBkZWxldGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZGVsKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IGNsb25lLnF1ZXJ5U2VsZWN0b3IoZGVsKTtcbiAgICAgICAgICAgIGlmKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkb20uZGVzdHJveShub2RlKTtcbiAgICAgICAgICAgICAgICBsZXQgdG1wbE5vZGUgPSB0bXBsLnF1ZXJ5U2VsZWN0b3IoZGVsKTtcbiAgICAgICAgICAgICAgICB0bXBsTm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2lmcycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnKTtcblxuICAgIC8vaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgIC8vICAgIE9iamVjdC5rZXlzKGl0ZW0pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIC8vICAgICAgICBpZihyZWZzW2tleV0pe1xuICAgIC8vICAgICAgICAgICAgcmVmc1trZXldLmlubmVySFRNTCA9IGl0ZW1ba2V5XTtcbiAgICAvLyAgICAgICAgfVxuICAgIC8vICAgIH0pO1xuICAgIC8vICAgIGlmKHJlZnMuYXR0cmlidXRlcyl7XG4gICAgLy8gICAgICAgIE9iamVjdC5rZXlzKHJlZnMuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIC8vICAgICAgICAgICAgbGV0IG5vZGUgPSByZWZzLmF0dHJpYnV0ZXNbbmFtZV07XG4gICAgLy8gICAgICAgICAgICBpZihpdGVtW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCBpdGVtW25hbWVdKTtcbiAgICAvLyAgICAgICAgICAgIH1lbHNle1xuICAgIC8vICAgICAgICAgICAgICAgIHdhcm4obmFtZSk7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy8gICAgICAgIH0pO1xuICAgIC8vICAgIH1cbiAgICAvL1xuICAgIC8vICAgIGNsb25lID0gdG1wbC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgLy8gICAgZnJhZy5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgLy99KTtcblxuICAgIC8vY29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWcpO1xufTtcblxuQmFzZUNvbXBvbmVudC5hZGRQbHVnaW4oe1xuICAgIG5hbWU6ICdpdGVtLXRlbXBsYXRlJyxcbiAgICBvcmRlcjogNDAsXG4gICAgcHJlRG9tUmVhZHk6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlID0gZG9tLnF1ZXJ5KG5vZGUsICd0ZW1wbGF0ZScpO1xuICAgICAgICBpZiAobm9kZS5pdGVtVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZS5pdGVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgbm9kZS5pdGVtVGVtcGxhdGUgPSBCYXNlQ29tcG9uZW50LmNsb25lKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlLml0ZW1SZWZzID0gdXBkYXRlSXRlbVRlbXBsYXRlKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0J2l0ZW0tdGVtcGxhdGUnOiB0cnVlXG59OyIsImNvbnN0IEJhc2VDb21wb25lbnQgPSByZXF1aXJlKCdCYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxuZnVuY3Rpb24gc2V0Qm9vbGVhbiAobm9kZSwgcHJvcCkge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRyZXR1cm4gbm9kZS5oYXNBdHRyaWJ1dGUocHJvcCk7XG5cdFx0fSxcblx0XHRzZXQgKHZhbHVlKSB7XG5cdFx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHRpZiAodmFsdWUpIHtcblx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgJycpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBmbiA9IHRoaXNbb25pZnkocHJvcCldO1xuXHRcdFx0aWYoZm4pe1xuXHRcdFx0XHRmbi5jYWxsKHRoaXMsIHZhbHVlKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eSAobm9kZSwgcHJvcCkge1xuXHRsZXQgcHJvcFZhbHVlO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGdldCAoKSB7XG5cdFx0XHRyZXR1cm4gcHJvcFZhbHVlICE9PSB1bmRlZmluZWQgPyBwcm9wVmFsdWUgOiBkb20ubm9ybWFsaXplKHRoaXMuZ2V0QXR0cmlidXRlKHByb3ApKTtcblx0XHR9LFxuXHRcdHNldCAodmFsdWUpIHtcblx0XHRcdHRoaXMuaXNTZXR0aW5nQXR0cmlidXRlID0gdHJ1ZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKHByb3AsIHZhbHVlKTtcblx0XHRcdGNvbnN0IGZuID0gdGhpc1tvbmlmeShwcm9wKV07XG5cdFx0XHRpZihmbil7XG5cdFx0XHRcdG9uRG9tUmVhZHkodGhpcywgKCkgPT4ge1xuXHRcdFx0XHRcdHZhbHVlID0gZm4uY2FsbCh0aGlzLCB2YWx1ZSkgfHwgdmFsdWU7XG5cdFx0XHRcdFx0aWYodmFsdWUgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRcdFx0XHRwcm9wVmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRPYmplY3QgKG5vZGUsIHByb3ApIHtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRnZXQgKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbJ19fJyArIHByb3BdO1xuXHRcdH0sXG5cdFx0c2V0ICh2YWx1ZSkge1xuXHRcdFx0dGhpc1snX18nICsgcHJvcF0gPSB2YWx1ZTtcblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wZXJ0aWVzIChub2RlKSB7XG5cdGxldCBwcm9wcyA9IG5vZGUucHJvcHMgfHwgbm9kZS5wcm9wZXJ0aWVzO1xuXHRpZiAocHJvcHMpIHtcblx0XHRwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG5cdFx0XHRpZiAocHJvcCA9PT0gJ2Rpc2FibGVkJykge1xuXHRcdFx0XHRzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNldFByb3BlcnR5KG5vZGUsIHByb3ApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldEJvb2xlYW5zIChub2RlKSB7XG5cdGxldCBwcm9wcyA9IG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucztcblx0aWYgKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0Qm9vbGVhbihub2RlLCBwcm9wKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXRPYmplY3RzIChub2RlKSB7XG5cdGxldCBwcm9wcyA9IG5vZGUub2JqZWN0cztcblx0aWYgKHByb3BzKSB7XG5cdFx0cHJvcHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0c2V0T2JqZWN0KG5vZGUsIHByb3ApO1xuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNhcCAobmFtZSkge1xuXHRyZXR1cm4gbmFtZS5zdWJzdHJpbmcoMCwxKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zdWJzdHJpbmcoMSk7XG59XG5cbmZ1bmN0aW9uIG9uaWZ5IChuYW1lKSB7XG5cdHJldHVybiAnb24nICsgbmFtZS5zcGxpdCgnLScpLm1hcCh3b3JkID0+IGNhcCh3b3JkKSkuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGlzQm9vbCAobm9kZSwgbmFtZSkge1xuXHRyZXR1cm4gKG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucyB8fCBbXSkuaW5kZXhPZihuYW1lKSA+IC0xO1xufVxuXG5mdW5jdGlvbiBib29sTm9ybSAodmFsdWUpIHtcblx0aWYodmFsdWUgPT09ICcnKXtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZG9tLm5vcm1hbGl6ZSh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHByb3BOb3JtICh2YWx1ZSkge1xuXHRyZXR1cm4gZG9tLm5vcm1hbGl6ZSh2YWx1ZSk7XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcblx0bmFtZTogJ3Byb3BlcnRpZXMnLFxuXHRvcmRlcjogMTAsXG5cdGluaXQ6IGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0c2V0UHJvcGVydGllcyhub2RlKTtcblx0XHRzZXRCb29sZWFucyhub2RlKTtcblx0fSxcblx0cHJlQXR0cmlidXRlQ2hhbmdlZDogZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG5cdFx0aWYgKG5vZGUuaXNTZXR0aW5nQXR0cmlidXRlKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGlmKGlzQm9vbChub2RlLCBuYW1lKSl7XG5cdFx0XHR2YWx1ZSA9IGJvb2xOb3JtKHZhbHVlKTtcblx0XHRcdG5vZGVbbmFtZV0gPSAhIXZhbHVlO1xuXHRcdFx0aWYoIXZhbHVlKXtcblx0XHRcdFx0bm9kZVtuYW1lXSA9IGZhbHNlO1xuXHRcdFx0XHRub2RlLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0XHRcdG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuXHRcdFx0XHRub2RlLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IGZhbHNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bm9kZVtuYW1lXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bm9kZVtuYW1lXSA9IHByb3BOb3JtKHZhbHVlKTtcblx0fVxufSk7IiwiY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5jb25zdCBCYXNlQ29tcG9uZW50ID0gcmVxdWlyZSgnQmFzZUNvbXBvbmVudCcpO1xuXG5mdW5jdGlvbiBhc3NpZ25SZWZzIChub2RlKSB7XG4gICAgZG9tLnF1ZXJ5QWxsKG5vZGUsICdbcmVmXScpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGxldCBuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGNoaWxkO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhc3NpZ25FdmVudHMgKG5vZGUpIHtcbiAgICAvLyA8ZGl2IG9uPVwiY2xpY2s6b25DbGlja1wiPlxuICAgIGRvbS5xdWVyeUFsbChub2RlLCAnW29uXScpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGxldFxuICAgICAgICAgICAga2V5VmFsdWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ29uJyksXG4gICAgICAgICAgICBldmVudCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMF0udHJpbSgpLFxuICAgICAgICAgICAgbWV0aG9kID0ga2V5VmFsdWUuc3BsaXQoJzonKVsxXS50cmltKCk7XG4gICAgICAgIG5vZGUub24oY2hpbGQsIGV2ZW50LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbm9kZVttZXRob2RdKGUpXG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAncmVmcycsXG4gICAgb3JkZXI6IDMwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgYXNzaWduUmVmcyhub2RlKTtcbiAgICAgICAgYXNzaWduRXZlbnRzKG5vZGUpO1xuICAgIH1cbn0pOyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbnZhclxuICAgIGxpZ2h0Tm9kZXMgPSB7fSxcbiAgICBpbnNlcnRlZCA9IHt9O1xuXG5mdW5jdGlvbiBpbnNlcnQgKG5vZGUpIHtcbiAgICBpZihpbnNlcnRlZFtub2RlLl91aWRdIHx8ICFoYXNUZW1wbGF0ZShub2RlKSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29sbGVjdExpZ2h0Tm9kZXMobm9kZSk7XG4gICAgaW5zZXJ0VGVtcGxhdGUobm9kZSk7XG4gICAgaW5zZXJ0ZWRbbm9kZS5fdWlkXSA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RMaWdodE5vZGVzKG5vZGUpe1xuICAgIGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXSB8fCBbXTtcbiAgICB3aGlsZShub2RlLmNoaWxkTm9kZXMubGVuZ3RoKXtcbiAgICAgICAgbGlnaHROb2Rlc1tub2RlLl91aWRdLnB1c2gobm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkTm9kZXNbMF0pKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhc1RlbXBsYXRlIChub2RlKSB7XG4gICAgcmV0dXJuICEhbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGVDaGFpbiAobm9kZSkge1xuICAgIHZhciB0ZW1wbGF0ZXMgPSBub2RlLmdldFRlbXBsYXRlQ2hhaW4oKTtcbiAgICB0ZW1wbGF0ZXMucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgIGdldENvbnRhaW5lcihub2RlKS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlKSk7XG4gICAgfSk7XG4gICAgaW5zZXJ0Q2hpbGRyZW4obm9kZSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydFRlbXBsYXRlIChub2RlKSB7XG4gICAgaWYobm9kZS5uZXN0ZWRUZW1wbGF0ZSl7XG4gICAgICAgIGluc2VydFRlbXBsYXRlQ2hhaW4obm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyXG4gICAgICAgIHRlbXBsYXRlTm9kZSA9IG5vZGUuZ2V0VGVtcGxhdGVOb2RlKCk7XG5cbiAgICBpZih0ZW1wbGF0ZU5vZGUpIHtcbiAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChCYXNlQ29tcG9uZW50LmNsb25lKHRlbXBsYXRlTm9kZSkpO1xuICAgIH1cbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyIChub2RlKSB7XG4gICAgdmFyIGNvbnRhaW5lcnMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZWY9XCJjb250YWluZXJcIl0nKTtcbiAgICBpZighY29udGFpbmVycyB8fCAhY29udGFpbmVycy5sZW5ndGgpe1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRhaW5lcnNbY29udGFpbmVycy5sZW5ndGggLSAxXTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0Q2hpbGRyZW4gKG5vZGUpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKG5vZGUpLFxuICAgICAgICBjaGlsZHJlbiA9IGxpZ2h0Tm9kZXNbbm9kZS5fdWlkXTtcblxuICAgIGlmKGNvbnRhaW5lciAmJiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICBmb3IoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRMaWdodE5vZGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsaWdodE5vZGVzW3RoaXMuX3VpZF07XG59O1xuXG5CYXNlQ29tcG9uZW50LnByb3RvdHlwZS5nZXRUZW1wbGF0ZU5vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY2FjaGluZyBjYXVzZXMgZGlmZmVyZW50IGNsYXNzZXMgdG8gcHVsbCB0aGUgc2FtZSB0ZW1wbGF0ZSAtIHdhdD9cbiAgICAvL2lmKCF0aGlzLnRlbXBsYXRlTm9kZSkge1xuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZUlkKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlTm9kZSA9IGRvbS5ieUlkKHRoaXMudGVtcGxhdGVJZC5yZXBsYWNlKCcjJywnJykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMudGVtcGxhdGVTdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gZG9tLnRvRG9tKCc8dGVtcGxhdGU+JyArIHRoaXMudGVtcGxhdGVTdHJpbmcgKyAnPC90ZW1wbGF0ZT4nKTtcbiAgICAgICAgfVxuICAgIC8vfVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlTm9kZTtcbn07XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlQ2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBsZXRcbiAgICAgICAgY29udGV4dCA9IHRoaXMsXG4gICAgICAgIHRlbXBsYXRlcyA9IFtdLFxuICAgICAgICB0ZW1wbGF0ZTtcblxuICAgIC8vIHdhbGsgdGhlIHByb3RvdHlwZSBjaGFpbjsgQmFiZWwgZG9lc24ndCBhbGxvdyB1c2luZ1xuICAgIC8vIGBzdXBlcmAgc2luY2Ugd2UgYXJlIG91dHNpZGUgb2YgdGhlIENsYXNzXG4gICAgd2hpbGUoY29udGV4dCl7XG4gICAgICAgIGNvbnRleHQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29udGV4dCk7XG4gICAgICAgIGlmKCFjb250ZXh0KXsgYnJlYWs7IH1cbiAgICAgICAgLy8gc2tpcCBwcm90b3R5cGVzIHdpdGhvdXQgYSB0ZW1wbGF0ZVxuICAgICAgICAvLyAoZWxzZSBpdCB3aWxsIHB1bGwgYW4gaW5oZXJpdGVkIHRlbXBsYXRlIGFuZCBjYXVzZSBkdXBsaWNhdGVzKVxuICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZVN0cmluZycpIHx8IGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlSWQnKSkge1xuICAgICAgICAgICAgdGVtcGxhdGUgPSBjb250ZXh0LmdldFRlbXBsYXRlTm9kZSgpO1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzLnB1c2godGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZW1wbGF0ZXM7XG59O1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgbmFtZTogJ3RlbXBsYXRlJyxcbiAgICBvcmRlcjogMjAsXG4gICAgcHJlQ29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpbnNlcnQobm9kZSk7XG4gICAgfVxufSk7Iiwid2luZG93Wyduby1uYXRpdmUtc2hpbSddID0gdHJ1ZTtcbnJlcXVpcmUoJ2N1c3RvbS1lbGVtZW50cy1wb2x5ZmlsbCcpO1xud2luZG93Lm9uID0gcmVxdWlyZSgnb24nKTtcbndpbmRvdy5kb20gPSByZXF1aXJlKCdkb20nKTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4uLy4uL3NyYy9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3Byb3BlcnRpZXMnKTtcbmNvbnN0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vc3JjL3RlbXBsYXRlJyk7XG5jb25zdCByZWZzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3JlZnMnKTtcbmNvbnN0IGl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uL3NyYy9pdGVtLXRlbXBsYXRlJyk7XG5cbmNsYXNzIFRlc3RQcm9wcyBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7IHJldHVybiBbJ21pbicsICdtYXgnLCAnZm9vJywgJ2JhcicsICduYmMnLCAnY2JzJywgJ2Rpc2FibGVkJywgJ3JlYWRvbmx5JywgJ3RhYmluZGV4JywgJ215LWNvbXBsZXgtcHJvcCddOyB9XG4gICAgZ2V0IHByb3BzICgpIHsgcmV0dXJuIFsnZm9vJywgJ2JhcicsICd0YWJpbmRleCcsICdtaW4nLCAnbWF4JywgJ215LWNvbXBsZXgtcHJvcCddOyB9XG4gICAgZ2V0IGJvb2xzICgpIHsgcmV0dXJuIFsnbmJjJywgJ2NicycsICdkaXNhYmxlZCcsICdyZWFkb25seSddOyB9XG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICB0aGlzW25hbWUgKyAnLWNoYW5nZWQnXSA9IGRvbS5ub3JtYWxpemUodmFsdWUpIHx8IHZhbHVlICE9PSBudWxsO1xuICAgIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXByb3BzJywgVGVzdFByb3BzKTtcblxuY2xhc3MgVGVzdExpZmVjeWNsZSBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7cmV0dXJuIFsnZm9vJywgJ2JhciddOyB9XG5cbiAgICBzZXQgZm9vICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fZm9vID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGZvbyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZm9vO1xuICAgIH1cblxuICAgIHNldCBiYXIgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX19iYXIgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgYmFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19iYXIgfHwgJ05PVFNFVCc7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGNvbm5lY3RlZCAoKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdjb25uZWN0ZWQtY2FsbGVkJywgdGhpcyk7XG4gICAgfVxuXG4gICAgZG9tUmVhZHkgKCkge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAnZG9tcmVhZHktY2FsbGVkJywgdGhpcyk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkICgpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ2Rpc2Nvbm5lY3RlZC1jYWxsZWQnLCB0aGlzKTtcbiAgICB9XG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWxpZmVjeWNsZScsIFRlc3RMaWZlY3ljbGUpO1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgaW5pdDogZnVuY3Rpb24gKG5vZGUsIGEsIGIsIGMpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ2luaXQtY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdwcmVDb25uZWN0ZWQtY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwb3N0Q29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncG9zdENvbm5lY3RlZC1jYWxsZWQnKTtcbiAgICB9LFxuICAgIHByZURvbVJlYWR5OiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncHJlRG9tUmVhZHktY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwb3N0RG9tUmVhZHk6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdwb3N0RG9tUmVhZHktY2FsbGVkJyk7XG4gICAgfVxufSk7XG5cblxuY2xhc3MgVGVzdFRtcGxTdHJpbmcgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXY+VGhpcyBpcyBhIHNpbXBsZSB0ZW1wbGF0ZTwvZGl2PmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtc3RyaW5nJywgVGVzdFRtcGxTdHJpbmcpO1xuXG5jbGFzcyBUZXN0VG1wbElkIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgZ2V0IHRlbXBsYXRlSWQgKCkge1xuICAgICAgICByZXR1cm4gJ3Rlc3QtdG1wbC1pZC10ZW1wbGF0ZSc7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtaWQnLCBUZXN0VG1wbElkKTtcblxuXG5jbGFzcyBUZXN0VG1wbFJlZnMgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgb249XCJjbGljazpvbkNsaWNrXCIgcmVmPVwiY2xpY2tOb2RlXCI+XG4gICAgICAgICAgICA8bGFiZWwgcmVmPVwibGFiZWxOb2RlXCI+bGFiZWw6PC9sYWJlbD5cbiAgICAgICAgICAgIDxzcGFuIHJlZj1cInZhbHVlTm9kZVwiPnZhbHVlPC9zcGFuPlxuICAgICAgICA8L2Rpdj5gO1xuICAgIH1cblxuICAgIG9uQ2xpY2sgKCkge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncmVmLWNsaWNrLWNhbGxlZCcpO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLXJlZnMnLCBUZXN0VG1wbFJlZnMpO1xuXG5jbGFzcyBUZXN0VG1wbENvbnRhaW5lciBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPGRpdj5cbiAgICAgICAgICAgIDxsYWJlbCByZWY9XCJsYWJlbE5vZGVcIj5sYWJlbDo8L2xhYmVsPlxuICAgICAgICAgICAgPHNwYW4gcmVmPVwidmFsdWVOb2RlXCI+dmFsdWU8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IHJlZj1cImNvbnRhaW5lclwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLWNvbnRhaW5lcicsIFRlc3RUbXBsQ29udGFpbmVyKTtcblxuXG4vLyBzaW1wbGUgbmVzdGVkIHRlbXBsYXRlc1xuY2xhc3MgVGVzdFRtcGxOZXN0ZWRBIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5lc3RlZFRlbXBsYXRlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uPlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEEgYmVmb3JlPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiByZWY9XCJjb250YWluZXJcIj48L3NlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQSBhZnRlcjwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+YDtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1uZXN0ZWQtYScsIFRlc3RUbXBsTmVzdGVkQSk7XG5cbmNsYXNzIFRlc3RUbXBsTmVzdGVkQiBleHRlbmRzIFRlc3RUbXBsTmVzdGVkQSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXY+Y29udGVudCBCPC9kaXY+YDtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1uZXN0ZWQtYicsIFRlc3RUbXBsTmVzdGVkQik7XG5cblxuLy8gbmVzdGVkIHBsdXMgbGlnaHQgZG9tXG5jbGFzcyBUZXN0VG1wbE5lc3RlZEMgZXh0ZW5kcyBUZXN0VG1wbE5lc3RlZEEge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBDIGJlZm9yZTwvZGl2PlxuICAgICAgICAgICAgPGRpdiByZWY9XCJjb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBDIGFmdGVyPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLW5lc3RlZC1jJywgVGVzdFRtcGxOZXN0ZWRDKTtcblxuXG4vLyA1LWRlZXAgbmVzdGVkIHRlbXBsYXRlc1xuY2xhc3MgVGVzdEEgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHt9XG5jbGFzcyBUZXN0QiBleHRlbmRzIFRlc3RBIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQiBiZWZvcmU8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIHJlZj1cImNvbnRhaW5lclwiPjwvc2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBCIGFmdGVyPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn1cbmNsYXNzIFRlc3RDIGV4dGVuZHMgVGVzdEIge31cbmNsYXNzIFRlc3REIGV4dGVuZHMgVGVzdEMge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2PmNvbnRlbnQgRDwvZGl2PmA7XG4gICAgfVxufVxuY2xhc3MgVGVzdEUgZXh0ZW5kcyBUZXN0RCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5lc3RlZFRlbXBsYXRlID0gdHJ1ZTtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtYScsIFRlc3RBKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1iJywgVGVzdEIpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWMnLCBUZXN0Qyk7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZCcsIFRlc3REKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lJywgVGVzdEUpO1xuXG5jbGFzcyBUZXN0TGlzdCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7IHJldHVybiBbJ2xpc3QtdGl0bGUnXTsgfVxuICAgIGdldCBwcm9wcyAoKSB7IHJldHVybiBbJ2xpc3QtdGl0bGUnXTsgfVxuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIiByZWY9XCJ0aXRsZU5vZGVcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgcmVmPVwiY29udGFpbmVyXCI+PC9kaXY+YDtcbiAgICB9XG4gICAgXG4gICAgc2V0IGRhdGEgKGl0ZW1zKSB7XG4gICAgICAgIHRoaXMucmVuZGVyTGlzdChpdGVtcywgdGhpcy5jb250YWluZXIpO1xuICAgIH1cblxuICAgIGRvbVJlYWR5ICgpIHtcbiAgICAgICAgdGhpcy50aXRsZU5vZGUuaW5uZXJIVE1MID0gdGhpc1snbGlzdC10aXRsZSddO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1saXN0JywgVGVzdExpc3QpO1xuXG5cblxud2luZG93Lml0ZW1UZW1wbGF0ZVN0cmluZyA9IGA8dGVtcGxhdGU+XG4gICAgPGRpdiBpZD1cInt7aWR9fVwiPlxuICAgICAgICA8c3Bhbj57e2ZpcnN0fX08L3NwYW4+XG4gICAgICAgIDxzcGFuPnt7bGFzdH19PC9zcGFuPlxuICAgICAgICA8c3Bhbj57e3JvbGV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbjwvdGVtcGxhdGU+YDtcblxud2luZG93LmlmQXR0clRlbXBsYXRlU3RyaW5nID0gYDx0ZW1wbGF0ZT5cbiAgICA8ZGl2IGlkPVwie3tpZH19XCI+XG4gICAgICAgIDxzcGFuPnt7Zmlyc3R9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4+e3tsYXN0fX08L3NwYW4+XG4gICAgICAgIDxzcGFuPnt7cm9sZX19PC9zcGFuPlxuICAgICAgICA8c3BhbiBpZj1cInt7YW1vdW50fX0gPCAyXCIgY2xhc3M9XCJhbW91bnRcIj57e2Ftb3VudH19PC9zcGFuPlxuICAgICAgICA8c3BhbiBpZj1cInt7dHlwZX19ID09PSAnc2FuZSdcIiBjbGFzcz1cInNhbml0eVwiPnt7dHlwZX19PC9zcGFuPlxuICAgIDwvZGl2PlxuPC90ZW1wbGF0ZT5gO1xuXG5mdW5jdGlvbiBkZXYgKCkge1xuICAgIHZhciBhbHBoYWJldCA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicuc3BsaXQoJycpO1xuICAgIHZhciBzID0gJ3t7YW1vdW50fX0gKyB7e251bX19ICsgMyc7XG4gICAgdmFyIGxpc3QgPSBbe2Ftb3VudDogMSwgbnVtOiAyfSwge2Ftb3VudDogMywgbnVtOiA0fSwge2Ftb3VudDogNSwgbnVtOiA2fV07XG4gICAgdmFyIHIgPSAvXFx7XFx7XFx3Kn19L2c7XG4gICAgdmFyIGZuID0gW107XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICB2YXIgZjtcbiAgICBzID0gcy5yZXBsYWNlKHIsIGZ1bmN0aW9uKHcpe1xuICAgICAgICBjb25zb2xlLmxvZygnd29yZCcsIHcpO1xuICAgICAgICB2YXIgdiA9IGFscGhhYmV0LnNoaWZ0KCk7XG4gICAgICAgIGZuLnB1c2godik7XG4gICAgICAgIGFyZ3MucHVzaCgvXFx3Ky9nLmV4ZWModylbMF0pO1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9KTtcbiAgICBmbi5wdXNoKHMpO1xuXG4gICAgY29uc29sZS5sb2coJ2ZuJywgZm4pO1xuICAgIGNvbnNvbGUubG9nKCdhcmdzJywgYXJncyk7XG4gICAgLy9zID0gJ3JldHVybiAnICsgcyArICc7JztcbiAgICBjb25zb2xlLmxvZygncycsIHMpO1xuXG4gICAgd2luZG93LmYgPSBuZXcgRnVuY3Rpb24ocyk7XG5cbiAgICB2YXIgZHluRm4gPSBmdW5jdGlvbiAoYSxiLGMsZCxlLGYpIHtcbiAgICAgICAgdmFyIHIgPSBldmFsKHMpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coJyAgZjonLCBkeW5GbigxLDIpKTtcbiAgICAvL1xuICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB2YXIgYSA9IGFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2FyZ107XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgciA9IGR5bkZuLmFwcGx5KG51bGwsIGEpO1xuICAgICAgICBjb25zb2xlLmxvZygncicsIHIpO1xuICAgIH0pO1xuXG5cbn1cbi8vZGV2KCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGNsYXNzL2NvbXBvbmVudCBydWxlc1xuLy8gYWx3YXlzIGNhbGwgc3VwZXIoKSBmaXJzdCBpbiB0aGUgY3Rvci4gVGhpcyBhbHNvIGNhbGxzIHRoZSBleHRlbmRlZCBjbGFzcycgY3Rvci5cbi8vIGNhbm5vdCBjYWxsIE5FVyBvbiBhIENvbXBvbmVudCBjbGFzc1xuXG4vLyBDbGFzc2VzIGh0dHA6Ly9leHBsb3Jpbmdqcy5jb20vZXM2L2NoX2NsYXNzZXMuaHRtbCNfdGhlLXNwZWNpZXMtcGF0dGVybi1pbi1zdGF0aWMtbWV0aG9kc1xuXG5jb25zdCBvbiA9IHJlcXVpcmUoJ29uJyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxuY2xhc3MgQmFzZUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl91aWQgPSBkb20udWlkKHRoaXMubG9jYWxOYW1lKTtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdID0ge0RPTVNUQVRFOiAnY3JlYXRlZCd9O1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdCA9IFtdO1xuXHRcdHBsdWdpbignaW5pdCcsIHRoaXMpO1xuXHR9XG5cblx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA/ICdkb21yZWFkeScgOiAnY29ubmVjdGVkJztcblx0XHRwbHVnaW4oJ3ByZUNvbm5lY3RlZCcsIHRoaXMpO1xuXHRcdG5leHRUaWNrKG9uQ2hlY2tEb21SZWFkeS5iaW5kKHRoaXMpKTtcblx0XHRpZiAodGhpcy5jb25uZWN0ZWQpIHtcblx0XHRcdHRoaXMuY29ubmVjdGVkKCk7XG5cdFx0fVxuXHRcdHRoaXMuZmlyZSgnY29ubmVjdGVkJyk7XG5cdFx0cGx1Z2luKCdwb3N0Q29ubmVjdGVkJywgdGhpcyk7XG5cdH1cblxuXHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG5cdFx0cGx1Z2luKCdwcmVEaXNjb25uZWN0ZWQnLCB0aGlzKTtcblx0XHRpZiAodGhpcy5kaXNjb25uZWN0ZWQpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdGVkKCk7XG5cdFx0fVxuXHRcdHRoaXMuZmlyZSgnZGlzY29ubmVjdGVkJyk7XG5cblx0XHRsZXQgdGltZSwgZG9kID0gQmFzZUNvbXBvbmVudC5kZXN0cm95T25EaXNjb25uZWN0O1xuXHRcdGlmIChkb2QpIHtcblx0XHRcdHRpbWUgPSB0eXBlb2YgZG9kID09PSAnbnVtYmVyJyA/IGRvYyA6IDMwMDtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRpZih0aGlzLkRPTVNUQVRFID09PSAnZGlzY29ubmVjdGVkJyl7XG5cdFx0XHRcdFx0dGhpcy5kZXN0cm95KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRpbWUpO1xuXHRcdH1cblx0fVxuXG5cdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcblx0XHRwbHVnaW4oJ3ByZUF0dHJpYnV0ZUNoYW5nZWQnLCB0aGlzLCBhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdGlmICh0aGlzLmF0dHJpYnV0ZUNoYW5nZWQpIHtcblx0XHRcdHRoaXMuYXR0cmlidXRlQ2hhbmdlZChhdHRyTmFtZSwgbmV3VmFsLCBvbGRWYWwpO1xuXHRcdH1cblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy5maXJlKCdkZXN0cm95Jyk7XG5cdFx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xuXHRcdFx0aGFuZGxlLnJlbW92ZSgpO1xuXHRcdH0pO1xuXHRcdGRvbS5kZXN0cm95KHRoaXMpO1xuXHR9XG5cblx0ZmlyZShldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG5cdFx0cmV0dXJuIG9uLmZpcmUodGhpcywgZXZlbnROYW1lLCBldmVudERldGFpbCwgYnViYmxlcyk7XG5cdH1cblxuXHRlbWl0KGV2ZW50TmFtZSwgdmFsdWUpIHtcblx0XHRyZXR1cm4gb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcblx0fVxuXG5cdG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG5cdFx0XHR0eXBlb2Ygbm9kZSAhPT0gJ3N0cmluZycgPyAvLyBubyBub2RlIGlzIHN1cHBsaWVkXG5cdFx0XHRcdG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG5cdFx0XHRcdG9uKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IpKTtcblx0fVxuXG5cdG9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcblx0XHRyZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcblx0XHRcdHR5cGVvZiBub2RlICE9PSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcblx0XHRcdFx0b24ub25jZShub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykgOlxuXHRcdFx0XHRvbi5vbmNlKHRoaXMsIG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSk7XG5cdH1cblxuXHRhdHRyIChrZXksIHZhbHVlLCB0b2dnbGUpIHtcblx0XHR0aGlzLmlzU2V0dGluZ0F0dHJpYnV0ZSA9IHRydWU7XG5cdFx0Y29uc3QgYWRkID0gdG9nZ2xlID09PSB1bmRlZmluZWQgPyB0cnVlIDogISF0b2dnbGU7XG5cdFx0aWYoYWRkKXtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuXHRcdH1lbHNle1xuXHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcblx0XHR9XG5cdFx0dGhpcy5pc1NldHRpbmdBdHRyaWJ1dGUgPSBmYWxzZTtcblx0fVxuXG5cdHJlZ2lzdGVySGFuZGxlKGhhbmRsZSkge1xuXHRcdHByaXZhdGVzW3RoaXMuX3VpZF0uaGFuZGxlTGlzdC5wdXNoKGhhbmRsZSk7XG5cdFx0cmV0dXJuIGhhbmRsZTtcblx0fVxuXG5cdGdldCBET01TVEFURSgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURTtcblx0fVxuXG5cdHN0YXRpYyBzZXQgZGVzdHJveU9uRGlzY29ubmVjdCh2YWx1ZSkge1xuXHRcdHByaXZhdGVzWydkZXN0cm95T25EaXNjb25uZWN0J10gPSB2YWx1ZTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgZGVzdHJveU9uRGlzY29ubmVjdCgpIHtcblx0XHRyZXR1cm4gcHJpdmF0ZXNbJ2Rlc3Ryb3lPbkRpc2Nvbm5lY3QnXTtcblx0fVxuXG5cdHN0YXRpYyBjbG9uZSh0ZW1wbGF0ZSkge1xuXHRcdGlmICh0ZW1wbGF0ZS5jb250ZW50ICYmIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pIHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuXHRcdH1cblx0XHRjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGNvbnN0IGNsb25lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGNsb25lTm9kZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZS5pbm5lckhUTUw7XG5cblx0XHR3aGlsZSAoY2xvbmVOb2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0ZnJhZy5hcHBlbmRDaGlsZChjbG9uZU5vZGUuY2hpbGRyZW5bMF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gZnJhZztcblx0fVxuXG5cdHN0YXRpYyBhZGRQbHVnaW4ocGx1Zykge1xuXHRcdGxldCBpLCBvcmRlciA9IHBsdWcub3JkZXIgfHwgMTAwO1xuXHRcdGlmICghcGx1Z2lucy5sZW5ndGgpIHtcblx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAocGx1Z2lucy5sZW5ndGggPT09IDEpIHtcblx0XHRcdGlmIChwbHVnaW5zWzBdLm9yZGVyIDw9IG9yZGVyKSB7XG5cdFx0XHRcdHBsdWdpbnMucHVzaChwbHVnKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRwbHVnaW5zLnVuc2hpZnQocGx1Zyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPiBvcmRlcikge1xuXHRcdFx0cGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0Zm9yIChpID0gMTsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKG9yZGVyID09PSBwbHVnaW5zW2kgLSAxXS5vcmRlciB8fCAob3JkZXIgPiBwbHVnaW5zW2kgLSAxXS5vcmRlciAmJiBvcmRlciA8IHBsdWdpbnNbaV0ub3JkZXIpKSB7XG5cdFx0XHRcdFx0cGx1Z2lucy5zcGxpY2UoaSwgMCwgcGx1Zyk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyB3YXMgbm90IGluc2VydGVkLi4uXG5cdFx0XHRwbHVnaW5zLnB1c2gocGx1Zyk7XG5cdFx0fVxuXHR9XG59XG5cbmxldFxuXHRwcml2YXRlcyA9IHt9LFxuXHRwbHVnaW5zID0gW107XG5cbmZ1bmN0aW9uIHBsdWdpbihtZXRob2QsIG5vZGUsIGEsIGIsIGMpIHtcblx0cGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnKSB7XG5cdFx0aWYgKHBsdWdbbWV0aG9kXSkge1xuXHRcdFx0cGx1Z1ttZXRob2RdKG5vZGUsIGEsIGIsIGMpO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hlY2tEb21SZWFkeSgpIHtcblx0aWYgKHRoaXMuRE9NU1RBVEUgIT09ICdjb25uZWN0ZWQnIHx8IHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGxldFxuXHRcdGNvdW50ID0gMCxcblx0XHRjaGlsZHJlbiA9IGdldENoaWxkQ3VzdG9tTm9kZXModGhpcyksXG5cdFx0b3VyRG9tUmVhZHkgPSBvbkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cblx0ZnVuY3Rpb24gYWRkUmVhZHkoKSB7XG5cdFx0Y291bnQrKztcblx0XHRpZiAoY291bnQgPT09IGNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0b3VyRG9tUmVhZHkoKTtcblx0XHR9XG5cdH1cblxuXHQvLyBJZiBubyBjaGlsZHJlbiwgd2UncmUgZ29vZCAtIGxlYWYgbm9kZS4gQ29tbWVuY2Ugd2l0aCBvbkRvbVJlYWR5XG5cdC8vXG5cdGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0b3VyRG9tUmVhZHkoKTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuXHRcdC8vXG5cdFx0Y2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdC8vIGNoZWNrIGlmIGNoaWxkIGlzIGFscmVhZHkgcmVhZHlcblx0XHRcdC8vIGFsc28gY2hlY2sgZm9yIGNvbm5lY3RlZCAtIHRoaXMgaGFuZGxlcyBtb3ZpbmcgYSBub2RlIGZyb20gYW5vdGhlciBub2RlXG5cdFx0XHQvLyBOT1BFLCB0aGF0IGZhaWxlZC4gcmVtb3ZlZCBmb3Igbm93IGNoaWxkLkRPTVNUQVRFID09PSAnY29ubmVjdGVkJ1xuXHRcdFx0aWYgKGNoaWxkLkRPTVNUQVRFID09PSAnZG9tcmVhZHknKSB7XG5cdFx0XHRcdGFkZFJlYWR5KCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBpZiBub3QsIHdhaXQgZm9yIGV2ZW50XG5cdFx0XHRjaGlsZC5vbignZG9tcmVhZHknLCBhZGRSZWFkeSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gb25Eb21SZWFkeSgpIHtcblx0cHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG5cdC8vIGRvbVJlYWR5IHNob3VsZCBvbmx5IGV2ZXIgZmlyZSBvbmNlXG5cdHByaXZhdGVzW3RoaXMuX3VpZF0uZG9tUmVhZHlGaXJlZCA9IHRydWU7XG5cdHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcblx0Ly8gY2FsbCB0aGlzLmRvbVJlYWR5IGZpcnN0LCBzbyB0aGF0IHRoZSBjb21wb25lbnRcblx0Ly8gY2FuIGZpbmlzaCBpbml0aWFsaXppbmcgYmVmb3JlIGZpcmluZyBhbnlcblx0Ly8gc3Vic2VxdWVudCBldmVudHNcblx0aWYgKHRoaXMuZG9tUmVhZHkpIHtcblx0XHR0aGlzLmRvbVJlYWR5KCk7XG5cdFx0dGhpcy5kb21SZWFkeSA9IGZ1bmN0aW9uICgpIHt9O1xuXHR9XG5cblx0dGhpcy5maXJlKCdkb21yZWFkeScpO1xuXG5cdHBsdWdpbigncG9zdERvbVJlYWR5JywgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkQ3VzdG9tTm9kZXMobm9kZSkge1xuXHQvLyBjb2xsZWN0IGFueSBjaGlsZHJlbiB0aGF0IGFyZSBjdXN0b20gbm9kZXNcblx0Ly8gdXNlZCB0byBjaGVjayBpZiB0aGVpciBkb20gaXMgcmVhZHkgYmVmb3JlXG5cdC8vIGRldGVybWluaW5nIGlmIHRoaXMgaXMgcmVhZHlcblx0bGV0IGksIG5vZGVzID0gW107XG5cdGZvciAoaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKG5vZGUuY2hpbGRyZW5baV0ubm9kZU5hbWUuaW5kZXhPZignLScpID4gLTEpIHtcblx0XHRcdG5vZGVzLnB1c2gobm9kZS5jaGlsZHJlbltpXSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBub2Rlcztcbn1cblxuZnVuY3Rpb24gbmV4dFRpY2soY2IpIHtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbn1cblxud2luZG93Lm9uRG9tUmVhZHkgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcblx0ZnVuY3Rpb24gb25SZWFkeSgpIHtcblx0XHRjYWxsYmFjayhub2RlKTtcblx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG5cdH1cblxuXHRpZiAobm9kZS5ET01TVEFURSA9PT0gJ2RvbXJlYWR5Jykge1xuXHRcdGNhbGxiYWNrKG5vZGUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9tcmVhZHknLCBvblJlYWR5KTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ29tcG9uZW50OyJdfQ==
