require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],"dom":[function(require,module,exports){
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
        return !!item && typeof item === 'object' && (typeof item.innerHTML === 'string' || item.nodeName === '#document-fragment');
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

},{"keyboardevent-key-polyfill":1}],"randomizer":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwvaW5kZXguanMiLCJjdXN0b20tZWxlbWVudHMtcG9seWZpbGwiLCJkb20iLCJvbiIsInJhbmRvbWl6ZXIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBkZWZpbmUsIEtleWJvYXJkRXZlbnQsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSB7XG4gICAgcG9seWZpbGw6IHBvbHlmaWxsLFxuICAgIGtleXM6IHtcbiAgICAgIDM6ICdDYW5jZWwnLFxuICAgICAgNjogJ0hlbHAnLFxuICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICA5OiAnVGFiJyxcbiAgICAgIDEyOiAnQ2xlYXInLFxuICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAxNjogJ1NoaWZ0JyxcbiAgICAgIDE3OiAnQ29udHJvbCcsXG4gICAgICAxODogJ0FsdCcsXG4gICAgICAxOTogJ1BhdXNlJyxcbiAgICAgIDIwOiAnQ2Fwc0xvY2snLFxuICAgICAgMjc6ICdFc2NhcGUnLFxuICAgICAgMjg6ICdDb252ZXJ0JyxcbiAgICAgIDI5OiAnTm9uQ29udmVydCcsXG4gICAgICAzMDogJ0FjY2VwdCcsXG4gICAgICAzMTogJ01vZGVDaGFuZ2UnLFxuICAgICAgMzI6ICcgJyxcbiAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgIDM0OiAnUGFnZURvd24nLFxuICAgICAgMzU6ICdFbmQnLFxuICAgICAgMzY6ICdIb21lJyxcbiAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgNDE6ICdTZWxlY3QnLFxuICAgICAgNDI6ICdQcmludCcsXG4gICAgICA0MzogJ0V4ZWN1dGUnLFxuICAgICAgNDQ6ICdQcmludFNjcmVlbicsXG4gICAgICA0NTogJ0luc2VydCcsXG4gICAgICA0NjogJ0RlbGV0ZScsXG4gICAgICA0ODogWycwJywgJyknXSxcbiAgICAgIDQ5OiBbJzEnLCAnISddLFxuICAgICAgNTA6IFsnMicsICdAJ10sXG4gICAgICA1MTogWyczJywgJyMnXSxcbiAgICAgIDUyOiBbJzQnLCAnJCddLFxuICAgICAgNTM6IFsnNScsICclJ10sXG4gICAgICA1NDogWyc2JywgJ14nXSxcbiAgICAgIDU1OiBbJzcnLCAnJiddLFxuICAgICAgNTY6IFsnOCcsICcqJ10sXG4gICAgICA1NzogWyc5JywgJygnXSxcbiAgICAgIDkxOiAnT1MnLFxuICAgICAgOTM6ICdDb250ZXh0TWVudScsXG4gICAgICAxNDQ6ICdOdW1Mb2NrJyxcbiAgICAgIDE0NTogJ1Njcm9sbExvY2snLFxuICAgICAgMTgxOiAnVm9sdW1lTXV0ZScsXG4gICAgICAxODI6ICdWb2x1bWVEb3duJyxcbiAgICAgIDE4MzogJ1ZvbHVtZVVwJyxcbiAgICAgIDE4NjogWyc7JywgJzonXSxcbiAgICAgIDE4NzogWyc9JywgJysnXSxcbiAgICAgIDE4ODogWycsJywgJzwnXSxcbiAgICAgIDE4OTogWyctJywgJ18nXSxcbiAgICAgIDE5MDogWycuJywgJz4nXSxcbiAgICAgIDE5MTogWycvJywgJz8nXSxcbiAgICAgIDE5MjogWydgJywgJ34nXSxcbiAgICAgIDIxOTogWydbJywgJ3snXSxcbiAgICAgIDIyMDogWydcXFxcJywgJ3wnXSxcbiAgICAgIDIyMTogWyddJywgJ30nXSxcbiAgICAgIDIyMjogW1wiJ1wiLCAnXCInXSxcbiAgICAgIDIyNDogJ01ldGEnLFxuICAgICAgMjI1OiAnQWx0R3JhcGgnLFxuICAgICAgMjQ2OiAnQXR0bicsXG4gICAgICAyNDc6ICdDclNlbCcsXG4gICAgICAyNDg6ICdFeFNlbCcsXG4gICAgICAyNDk6ICdFcmFzZUVvZicsXG4gICAgICAyNTA6ICdQbGF5JyxcbiAgICAgIDI1MTogJ1pvb21PdXQnXG4gICAgfVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIGtleXMgKEYxLTI0KS5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCAyNTsgaSsrKSB7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbMTExICsgaV0gPSAnRicgKyBpO1xuICB9XG5cbiAgLy8gUHJpbnRhYmxlIEFTQ0lJIGNoYXJhY3RlcnMuXG4gIHZhciBsZXR0ZXIgPSAnJztcbiAgZm9yIChpID0gNjU7IGkgPCA5MTsgaSsrKSB7XG4gICAgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1tpXSA9IFtsZXR0ZXIudG9Mb3dlckNhc2UoKSwgbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWZpbGwgKCkge1xuICAgIGlmICghKCdLZXlib2FyZEV2ZW50JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICdrZXknIGluIEtleWJvYXJkRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgYGtleWAgb24gYEtleWJvYXJkRXZlbnRgLlxuICAgIHZhciBwcm90byA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW3RoaXMud2hpY2ggfHwgdGhpcy5rZXlDb2RlXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5Wyt0aGlzLnNoaWZ0S2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm90byk7XG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnLCBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH1cblxufSkoKTtcbiIsInZhciBzdXBwb3J0c1YxID0gJ2N1c3RvbUVsZW1lbnRzJyBpbiB3aW5kb3c7XG52YXIgc3VwcG9ydHNQcm9taXNlID0gJ1Byb21pc2UnIGluIHdpbmRvdztcbnZhciBuYXRpdmVTaGltQmFzZTY0ID0gXCJablZ1WTNScGIyNGdibUYwYVhabFUyaHBiU2dwZXlnb0tUMCtleWQxYzJVZ2MzUnlhV04wSnp0cFppZ2hkMmx1Wkc5M0xtTjFjM1J2YlVWc1pXMWxiblJ6S1hKbGRIVnlianRqYjI1emRDQmhQWGRwYm1SdmR5NUlWRTFNUld4bGJXVnVkQ3hpUFhkcGJtUnZkeTVqZFhOMGIyMUZiR1Z0Wlc1MGN5NWtaV1pwYm1Vc1l6MTNhVzVrYjNjdVkzVnpkRzl0Uld4bGJXVnVkSE11WjJWMExHUTlibVYzSUUxaGNDeGxQVzVsZHlCTllYQTdiR1YwSUdZOUlURXNaejBoTVR0M2FXNWtiM2N1U0ZSTlRFVnNaVzFsYm5ROVpuVnVZM1JwYjI0b0tYdHBaaWdoWmlsN1kyOXVjM1FnYWoxa0xtZGxkQ2gwYUdsekxtTnZibk4wY25WamRHOXlLU3hyUFdNdVkyRnNiQ2gzYVc1a2IzY3VZM1Z6ZEc5dFJXeGxiV1Z1ZEhNc2FpazdaejBoTUR0amIyNXpkQ0JzUFc1bGR5QnJPM0psZEhWeWJpQnNmV1k5SVRFN2ZTeDNhVzVrYjNjdVNGUk5URVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxQV0V1Y0hKdmRHOTBlWEJsTzA5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDNhVzVrYjNjc0oyTjFjM1J2YlVWc1pXMWxiblJ6Snl4N2RtRnNkV1U2ZDJsdVpHOTNMbU4xYzNSdmJVVnNaVzFsYm5SekxHTnZibVpwWjNWeVlXSnNaVG9oTUN4M2NtbDBZV0pzWlRvaE1IMHBMRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoM2FXNWtiM2N1WTNWemRHOXRSV3hsYldWdWRITXNKMlJsWm1sdVpTY3NlM1poYkhWbE9paHFMR3NwUFQ1N1kyOXVjM1FnYkQxckxuQnliM1J2ZEhsd1pTeHRQV05zWVhOeklHVjRkR1Z1WkhNZ1lYdGpiMjV6ZEhKMVkzUnZjaWdwZTNOMWNHVnlLQ2tzVDJKcVpXTjBMbk5sZEZCeWIzUnZkSGx3WlU5bUtIUm9hWE1zYkNrc1ozeDhLR1k5SVRBc2F5NWpZV3hzS0hSb2FYTXBLU3huUFNFeE8zMTlMRzQ5YlM1d2NtOTBiM1I1Y0dVN2JTNXZZbk5sY25abFpFRjBkSEpwWW5WMFpYTTlheTV2WW5ObGNuWmxaRUYwZEhKcFluVjBaWE1zYmk1amIyNXVaV04wWldSRFlXeHNZbUZqYXoxc0xtTnZibTVsWTNSbFpFTmhiR3hpWVdOckxHNHVaR2x6WTI5dWJtVmpkR1ZrUTJGc2JHSmhZMnM5YkM1a2FYTmpiMjV1WldOMFpXUkRZV3hzWW1GamF5eHVMbUYwZEhKcFluVjBaVU5vWVc1blpXUkRZV3hzWW1GamF6MXNMbUYwZEhKcFluVjBaVU5vWVc1blpXUkRZV3hzWW1GamF5eHVMbUZrYjNCMFpXUkRZV3hzWW1GamF6MXNMbUZrYjNCMFpXUkRZV3hzWW1GamF5eGtMbk5sZENockxHb3BMR1V1YzJWMEtHb3NheWtzWWk1allXeHNLSGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3l4cUxHMHBPMzBzWTI5dVptbG5kWEpoWW14bE9pRXdMSGR5YVhSaFlteGxPaUV3ZlNrc1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLSGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3l3bloyVjBKeXg3ZG1Gc2RXVTZLR29wUFQ1bExtZGxkQ2hxS1N4amIyNW1hV2QxY21GaWJHVTZJVEFzZDNKcGRHRmliR1U2SVRCOUtUdDlLU2dwTzMwPVwiO1xuaWYoc3VwcG9ydHNWMSAmJiAhd2luZG93Wyduby1uYXRpdmUtc2hpbSddKXtcblx0ZXZhbCh3aW5kb3cuYXRvYihuYXRpdmVTaGltQmFzZTY0KSk7XG5cdG5hdGl2ZVNoaW0oKTtcbn1lbHNle1xuXHRjdXN0b21FbGVtZW50cygpO1xufVxuaWYgKCFzdXBwb3J0c1Byb21pc2UpIHtcblx0cHJvbWlzZVBvbHlmaWxsKCk7XG59XG5cbmZ1bmN0aW9uIGN1c3RvbUVsZW1lbnRzKCkge1xuKGZ1bmN0aW9uKCl7XG4ndXNlIHN0cmljdCc7dmFyIGc9bmV3IGZ1bmN0aW9uKCl7fTt2YXIgYWE9bmV3IFNldChcImFubm90YXRpb24teG1sIGNvbG9yLXByb2ZpbGUgZm9udC1mYWNlIGZvbnQtZmFjZS1zcmMgZm9udC1mYWNlLXVyaSBmb250LWZhY2UtZm9ybWF0IGZvbnQtZmFjZS1uYW1lIG1pc3NpbmctZ2x5cGhcIi5zcGxpdChcIiBcIikpO2Z1bmN0aW9uIGsoYil7dmFyIGE9YWEuaGFzKGIpO2I9L15bYS16XVsuMC05X2Etel0qLVtcXC0uMC05X2Etel0qJC8udGVzdChiKTtyZXR1cm4hYSYmYn1mdW5jdGlvbiBsKGIpe3ZhciBhPWIuaXNDb25uZWN0ZWQ7aWYodm9pZCAwIT09YSlyZXR1cm4gYTtmb3IoO2ImJiEoYi5fX0NFX2lzSW1wb3J0RG9jdW1lbnR8fGIgaW5zdGFuY2VvZiBEb2N1bWVudCk7KWI9Yi5wYXJlbnROb2RlfHwod2luZG93LlNoYWRvd1Jvb3QmJmIgaW5zdGFuY2VvZiBTaGFkb3dSb290P2IuaG9zdDp2b2lkIDApO3JldHVybiEoIWJ8fCEoYi5fX0NFX2lzSW1wb3J0RG9jdW1lbnR8fGIgaW5zdGFuY2VvZiBEb2N1bWVudCkpfVxuZnVuY3Rpb24gbShiLGEpe2Zvcig7YSYmYSE9PWImJiFhLm5leHRTaWJsaW5nOylhPWEucGFyZW50Tm9kZTtyZXR1cm4gYSYmYSE9PWI/YS5uZXh0U2libGluZzpudWxsfVxuZnVuY3Rpb24gbihiLGEsZSl7ZT1lP2U6bmV3IFNldDtmb3IodmFyIGM9YjtjOyl7aWYoYy5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFKXt2YXIgZD1jO2EoZCk7dmFyIGg9ZC5sb2NhbE5hbWU7aWYoXCJsaW5rXCI9PT1oJiZcImltcG9ydFwiPT09ZC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikpe2M9ZC5pbXBvcnQ7aWYoYyBpbnN0YW5jZW9mIE5vZGUmJiFlLmhhcyhjKSlmb3IoZS5hZGQoYyksYz1jLmZpcnN0Q2hpbGQ7YztjPWMubmV4dFNpYmxpbmcpbihjLGEsZSk7Yz1tKGIsZCk7Y29udGludWV9ZWxzZSBpZihcInRlbXBsYXRlXCI9PT1oKXtjPW0oYixkKTtjb250aW51ZX1pZihkPWQuX19DRV9zaGFkb3dSb290KWZvcihkPWQuZmlyc3RDaGlsZDtkO2Q9ZC5uZXh0U2libGluZyluKGQsYSxlKX1jPWMuZmlyc3RDaGlsZD9jLmZpcnN0Q2hpbGQ6bShiLGMpfX1mdW5jdGlvbiBxKGIsYSxlKXtiW2FdPWV9O2Z1bmN0aW9uIHIoKXt0aGlzLmE9bmV3IE1hcDt0aGlzLmY9bmV3IE1hcDt0aGlzLmM9W107dGhpcy5iPSExfWZ1bmN0aW9uIGJhKGIsYSxlKXtiLmEuc2V0KGEsZSk7Yi5mLnNldChlLmNvbnN0cnVjdG9yLGUpfWZ1bmN0aW9uIHQoYixhKXtiLmI9ITA7Yi5jLnB1c2goYSl9ZnVuY3Rpb24gdihiLGEpe2IuYiYmbihhLGZ1bmN0aW9uKGEpe3JldHVybiB3KGIsYSl9KX1mdW5jdGlvbiB3KGIsYSl7aWYoYi5iJiYhYS5fX0NFX3BhdGNoZWQpe2EuX19DRV9wYXRjaGVkPSEwO2Zvcih2YXIgZT0wO2U8Yi5jLmxlbmd0aDtlKyspYi5jW2VdKGEpfX1mdW5jdGlvbiB4KGIsYSl7dmFyIGU9W107bihhLGZ1bmN0aW9uKGIpe3JldHVybiBlLnB1c2goYil9KTtmb3IoYT0wO2E8ZS5sZW5ndGg7YSsrKXt2YXIgYz1lW2FdOzE9PT1jLl9fQ0Vfc3RhdGU/Yi5jb25uZWN0ZWRDYWxsYmFjayhjKTp5KGIsYyl9fVxuZnVuY3Rpb24geihiLGEpe3ZhciBlPVtdO24oYSxmdW5jdGlvbihiKXtyZXR1cm4gZS5wdXNoKGIpfSk7Zm9yKGE9MDthPGUubGVuZ3RoO2ErKyl7dmFyIGM9ZVthXTsxPT09Yy5fX0NFX3N0YXRlJiZiLmRpc2Nvbm5lY3RlZENhbGxiYWNrKGMpfX1cbmZ1bmN0aW9uIEEoYixhLGUpe2U9ZT9lOm5ldyBTZXQ7dmFyIGM9W107bihhLGZ1bmN0aW9uKGQpe2lmKFwibGlua1wiPT09ZC5sb2NhbE5hbWUmJlwiaW1wb3J0XCI9PT1kLmdldEF0dHJpYnV0ZShcInJlbFwiKSl7dmFyIGE9ZC5pbXBvcnQ7YSBpbnN0YW5jZW9mIE5vZGUmJlwiY29tcGxldGVcIj09PWEucmVhZHlTdGF0ZT8oYS5fX0NFX2lzSW1wb3J0RG9jdW1lbnQ9ITAsYS5fX0NFX2hhc1JlZ2lzdHJ5PSEwKTpkLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oKXt2YXIgYT1kLmltcG9ydDthLl9fQ0VfZG9jdW1lbnRMb2FkSGFuZGxlZHx8KGEuX19DRV9kb2N1bWVudExvYWRIYW5kbGVkPSEwLGEuX19DRV9pc0ltcG9ydERvY3VtZW50PSEwLGEuX19DRV9oYXNSZWdpc3RyeT0hMCxuZXcgU2V0KGUpLGUuZGVsZXRlKGEpLEEoYixhLGUpKX0pfWVsc2UgYy5wdXNoKGQpfSxlKTtpZihiLmIpZm9yKGE9MDthPGMubGVuZ3RoO2ErKyl3KGIsY1thXSk7Zm9yKGE9MDthPGMubGVuZ3RoO2ErKyl5KGIsXG5jW2FdKX1cbmZ1bmN0aW9uIHkoYixhKXtpZih2b2lkIDA9PT1hLl9fQ0Vfc3RhdGUpe3ZhciBlPWIuYS5nZXQoYS5sb2NhbE5hbWUpO2lmKGUpe2UuY29uc3RydWN0aW9uU3RhY2sucHVzaChhKTt2YXIgYz1lLmNvbnN0cnVjdG9yO3RyeXt0cnl7aWYobmV3IGMhPT1hKXRocm93IEVycm9yKFwiVGhlIGN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9yIGRpZCBub3QgcHJvZHVjZSB0aGUgZWxlbWVudCBiZWluZyB1cGdyYWRlZC5cIik7fWZpbmFsbHl7ZS5jb25zdHJ1Y3Rpb25TdGFjay5wb3AoKX19Y2F0Y2goZil7dGhyb3cgYS5fX0NFX3N0YXRlPTIsZjt9YS5fX0NFX3N0YXRlPTE7YS5fX0NFX2RlZmluaXRpb249ZTtpZihlLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaylmb3IoZT1lLm9ic2VydmVkQXR0cmlidXRlcyxjPTA7YzxlLmxlbmd0aDtjKyspe3ZhciBkPWVbY10saD1hLmdldEF0dHJpYnV0ZShkKTtudWxsIT09aCYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYSxkLG51bGwsaCxudWxsKX1sKGEpJiZiLmNvbm5lY3RlZENhbGxiYWNrKGEpfX19XG5yLnByb3RvdHlwZS5jb25uZWN0ZWRDYWxsYmFjaz1mdW5jdGlvbihiKXt2YXIgYT1iLl9fQ0VfZGVmaW5pdGlvbjthLmNvbm5lY3RlZENhbGxiYWNrJiZhLmNvbm5lY3RlZENhbGxiYWNrLmNhbGwoYil9O3IucHJvdG90eXBlLmRpc2Nvbm5lY3RlZENhbGxiYWNrPWZ1bmN0aW9uKGIpe3ZhciBhPWIuX19DRV9kZWZpbml0aW9uO2EuZGlzY29ubmVjdGVkQ2FsbGJhY2smJmEuZGlzY29ubmVjdGVkQ2FsbGJhY2suY2FsbChiKX07ci5wcm90b3R5cGUuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrPWZ1bmN0aW9uKGIsYSxlLGMsZCl7dmFyIGg9Yi5fX0NFX2RlZmluaXRpb247aC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2smJi0xPGgub2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YoYSkmJmguYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrLmNhbGwoYixhLGUsYyxkKX07ZnVuY3Rpb24gQihiLGEpe3RoaXMuYz1iO3RoaXMuYT1hO3RoaXMuYj12b2lkIDA7QSh0aGlzLmMsdGhpcy5hKTtcImxvYWRpbmdcIj09PXRoaXMuYS5yZWFkeVN0YXRlJiYodGhpcy5iPW5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZi5iaW5kKHRoaXMpKSx0aGlzLmIub2JzZXJ2ZSh0aGlzLmEse2NoaWxkTGlzdDohMCxzdWJ0cmVlOiEwfSkpfWZ1bmN0aW9uIEMoYil7Yi5iJiZiLmIuZGlzY29ubmVjdCgpfUIucHJvdG90eXBlLmY9ZnVuY3Rpb24oYil7dmFyIGE9dGhpcy5hLnJlYWR5U3RhdGU7XCJpbnRlcmFjdGl2ZVwiIT09YSYmXCJjb21wbGV0ZVwiIT09YXx8Qyh0aGlzKTtmb3IoYT0wO2E8Yi5sZW5ndGg7YSsrKWZvcih2YXIgZT1iW2FdLmFkZGVkTm9kZXMsYz0wO2M8ZS5sZW5ndGg7YysrKUEodGhpcy5jLGVbY10pfTtmdW5jdGlvbiBjYSgpe3ZhciBiPXRoaXM7dGhpcy5iPXRoaXMuYT12b2lkIDA7dGhpcy5jPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEpe2IuYj1hO2IuYSYmYShiLmEpfSl9ZnVuY3Rpb24gRChiKXtpZihiLmEpdGhyb3cgRXJyb3IoXCJBbHJlYWR5IHJlc29sdmVkLlwiKTtiLmE9dm9pZCAwO2IuYiYmYi5iKHZvaWQgMCl9O2Z1bmN0aW9uIEUoYil7dGhpcy5mPSExO3RoaXMuYT1iO3RoaXMuaD1uZXcgTWFwO3RoaXMuZz1mdW5jdGlvbihiKXtyZXR1cm4gYigpfTt0aGlzLmI9ITE7dGhpcy5jPVtdO3RoaXMuaj1uZXcgQihiLGRvY3VtZW50KX1cbkUucHJvdG90eXBlLmw9ZnVuY3Rpb24oYixhKXt2YXIgZT10aGlzO2lmKCEoYSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3JzIG11c3QgYmUgZnVuY3Rpb25zLlwiKTtpZighayhiKSl0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJUaGUgZWxlbWVudCBuYW1lICdcIitiK1wiJyBpcyBub3QgdmFsaWQuXCIpO2lmKHRoaXMuYS5hLmdldChiKSl0aHJvdyBFcnJvcihcIkEgY3VzdG9tIGVsZW1lbnQgd2l0aCBuYW1lICdcIitiK1wiJyBoYXMgYWxyZWFkeSBiZWVuIGRlZmluZWQuXCIpO2lmKHRoaXMuZil0aHJvdyBFcnJvcihcIkEgY3VzdG9tIGVsZW1lbnQgaXMgYWxyZWFkeSBiZWluZyBkZWZpbmVkLlwiKTt0aGlzLmY9ITA7dmFyIGMsZCxoLGYsdTt0cnl7dmFyIHA9ZnVuY3Rpb24oYil7dmFyIGE9UFtiXTtpZih2b2lkIDAhPT1hJiYhKGEgaW5zdGFuY2VvZiBGdW5jdGlvbikpdGhyb3cgRXJyb3IoXCJUaGUgJ1wiK2IrXCInIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi5cIik7XG5yZXR1cm4gYX0sUD1hLnByb3RvdHlwZTtpZighKFAgaW5zdGFuY2VvZiBPYmplY3QpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgY3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3IncyBwcm90b3R5cGUgaXMgbm90IGFuIG9iamVjdC5cIik7Yz1wKFwiY29ubmVjdGVkQ2FsbGJhY2tcIik7ZD1wKFwiZGlzY29ubmVjdGVkQ2FsbGJhY2tcIik7aD1wKFwiYWRvcHRlZENhbGxiYWNrXCIpO2Y9cChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiKTt1PWEub2JzZXJ2ZWRBdHRyaWJ1dGVzfHxbXX1jYXRjaCh2YSl7cmV0dXJufWZpbmFsbHl7dGhpcy5mPSExfWJhKHRoaXMuYSxiLHtsb2NhbE5hbWU6Yixjb25zdHJ1Y3RvcjphLGNvbm5lY3RlZENhbGxiYWNrOmMsZGlzY29ubmVjdGVkQ2FsbGJhY2s6ZCxhZG9wdGVkQ2FsbGJhY2s6aCxhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6ZixvYnNlcnZlZEF0dHJpYnV0ZXM6dSxjb25zdHJ1Y3Rpb25TdGFjazpbXX0pO3RoaXMuYy5wdXNoKGIpO3RoaXMuYnx8KHRoaXMuYj1cbiEwLHRoaXMuZyhmdW5jdGlvbigpe2lmKCExIT09ZS5iKWZvcihlLmI9ITEsQShlLmEsZG9jdW1lbnQpOzA8ZS5jLmxlbmd0aDspe3ZhciBiPWUuYy5zaGlmdCgpOyhiPWUuaC5nZXQoYikpJiZEKGIpfX0pKX07RS5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGIpe2lmKGI9dGhpcy5hLmEuZ2V0KGIpKXJldHVybiBiLmNvbnN0cnVjdG9yfTtFLnByb3RvdHlwZS5vPWZ1bmN0aW9uKGIpe2lmKCFrKGIpKXJldHVybiBQcm9taXNlLnJlamVjdChuZXcgU3ludGF4RXJyb3IoXCInXCIrYitcIicgaXMgbm90IGEgdmFsaWQgY3VzdG9tIGVsZW1lbnQgbmFtZS5cIikpO3ZhciBhPXRoaXMuaC5nZXQoYik7aWYoYSlyZXR1cm4gYS5jO2E9bmV3IGNhO3RoaXMuaC5zZXQoYixhKTt0aGlzLmEuYS5nZXQoYikmJi0xPT09dGhpcy5jLmluZGV4T2YoYikmJkQoYSk7cmV0dXJuIGEuY307RS5wcm90b3R5cGUubT1mdW5jdGlvbihiKXtDKHRoaXMuaik7dmFyIGE9dGhpcy5nO3RoaXMuZz1mdW5jdGlvbihlKXtyZXR1cm4gYihmdW5jdGlvbigpe3JldHVybiBhKGUpfSl9fTtcbndpbmRvdy5DdXN0b21FbGVtZW50UmVnaXN0cnk9RTtFLnByb3RvdHlwZS5kZWZpbmU9RS5wcm90b3R5cGUubDtFLnByb3RvdHlwZS5nZXQ9RS5wcm90b3R5cGUuZ2V0O0UucHJvdG90eXBlLndoZW5EZWZpbmVkPUUucHJvdG90eXBlLm87RS5wcm90b3R5cGUucG9seWZpbGxXcmFwRmx1c2hDYWxsYmFjaz1FLnByb3RvdHlwZS5tO3ZhciBGPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCxkYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnROUyxlYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmltcG9ydE5vZGUsZmE9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5wcmVwZW5kLGdhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuYXBwZW5kLEc9d2luZG93Lk5vZGUucHJvdG90eXBlLmNsb25lTm9kZSxIPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5hcHBlbmRDaGlsZCxJPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5pbnNlcnRCZWZvcmUsSj13aW5kb3cuTm9kZS5wcm90b3R5cGUucmVtb3ZlQ2hpbGQsSz13aW5kb3cuTm9kZS5wcm90b3R5cGUucmVwbGFjZUNoaWxkLEw9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuTm9kZS5wcm90b3R5cGUsXCJ0ZXh0Q29udGVudFwiKSxNPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hdHRhY2hTaGFkb3csTj1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSxcblwiaW5uZXJIVE1MXCIpLE89d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZSxRPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUsUj13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlLFM9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZU5TLFQ9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZU5TLFU9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZU5TLFY9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmluc2VydEFkamFjZW50RWxlbWVudCxoYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucHJlcGVuZCxpYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYXBwZW5kLGphPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5iZWZvcmUsa2E9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmFmdGVyLGxhPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZXBsYWNlV2l0aCxtYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlLFxubmE9d2luZG93LkhUTUxFbGVtZW50LFc9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlLFwiaW5uZXJIVE1MXCIpLFg9d2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZS5pbnNlcnRBZGphY2VudEVsZW1lbnQ7ZnVuY3Rpb24gb2EoKXt2YXIgYj1ZO3dpbmRvdy5IVE1MRWxlbWVudD1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoKXt2YXIgYT10aGlzLmNvbnN0cnVjdG9yLGM9Yi5mLmdldChhKTtpZighYyl0aHJvdyBFcnJvcihcIlRoZSBjdXN0b20gZWxlbWVudCBiZWluZyBjb25zdHJ1Y3RlZCB3YXMgbm90IHJlZ2lzdGVyZWQgd2l0aCBgY3VzdG9tRWxlbWVudHNgLlwiKTt2YXIgZD1jLmNvbnN0cnVjdGlvblN0YWNrO2lmKCFkLmxlbmd0aClyZXR1cm4gZD1GLmNhbGwoZG9jdW1lbnQsYy5sb2NhbE5hbWUpLE9iamVjdC5zZXRQcm90b3R5cGVPZihkLGEucHJvdG90eXBlKSxkLl9fQ0Vfc3RhdGU9MSxkLl9fQ0VfZGVmaW5pdGlvbj1jLHcoYixkKSxkO3ZhciBjPWQubGVuZ3RoLTEsaD1kW2NdO2lmKGg9PT1nKXRocm93IEVycm9yKFwiVGhlIEhUTUxFbGVtZW50IGNvbnN0cnVjdG9yIHdhcyBlaXRoZXIgY2FsbGVkIHJlZW50cmFudGx5IGZvciB0aGlzIGNvbnN0cnVjdG9yIG9yIGNhbGxlZCBtdWx0aXBsZSB0aW1lcy5cIik7XG5kW2NdPWc7T2JqZWN0LnNldFByb3RvdHlwZU9mKGgsYS5wcm90b3R5cGUpO3coYixoKTtyZXR1cm4gaH1hLnByb3RvdHlwZT1uYS5wcm90b3R5cGU7cmV0dXJuIGF9KCl9O2Z1bmN0aW9uIHBhKGIsYSxlKXthLnByZXBlbmQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBkPVtdLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7KytjKWRbYy0wXT1hcmd1bWVudHNbY107Yz1kLmZpbHRlcihmdW5jdGlvbihiKXtyZXR1cm4gYiBpbnN0YW5jZW9mIE5vZGUmJmwoYil9KTtlLmkuYXBwbHkodGhpcyxkKTtmb3IodmFyIGY9MDtmPGMubGVuZ3RoO2YrKyl6KGIsY1tmXSk7aWYobCh0aGlzKSlmb3IoYz0wO2M8ZC5sZW5ndGg7YysrKWY9ZFtjXSxmIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGYpfTthLmFwcGVuZD1mdW5jdGlvbihhKXtmb3IodmFyIGQ9W10sYz0wO2M8YXJndW1lbnRzLmxlbmd0aDsrK2MpZFtjLTBdPWFyZ3VtZW50c1tjXTtjPWQuZmlsdGVyKGZ1bmN0aW9uKGIpe3JldHVybiBiIGluc3RhbmNlb2YgTm9kZSYmbChiKX0pO2UuYXBwZW5kLmFwcGx5KHRoaXMsZCk7Zm9yKHZhciBmPTA7ZjxjLmxlbmd0aDtmKyspeihiLGNbZl0pO2lmKGwodGhpcykpZm9yKGM9MDtjPFxuZC5sZW5ndGg7YysrKWY9ZFtjXSxmIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGYpfX07ZnVuY3Rpb24gcWEoKXt2YXIgYj1ZO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiY3JlYXRlRWxlbWVudFwiLGZ1bmN0aW9uKGEpe2lmKHRoaXMuX19DRV9oYXNSZWdpc3RyeSl7dmFyIGU9Yi5hLmdldChhKTtpZihlKXJldHVybiBuZXcgZS5jb25zdHJ1Y3Rvcn1hPUYuY2FsbCh0aGlzLGEpO3coYixhKTtyZXR1cm4gYX0pO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiaW1wb3J0Tm9kZVwiLGZ1bmN0aW9uKGEsZSl7YT1lYS5jYWxsKHRoaXMsYSxlKTt0aGlzLl9fQ0VfaGFzUmVnaXN0cnk/QShiLGEpOnYoYixhKTtyZXR1cm4gYX0pO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiY3JlYXRlRWxlbWVudE5TXCIsZnVuY3Rpb24oYSxlKXtpZih0aGlzLl9fQ0VfaGFzUmVnaXN0cnkmJihudWxsPT09YXx8XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI9PT1hKSl7dmFyIGM9Yi5hLmdldChlKTtpZihjKXJldHVybiBuZXcgYy5jb25zdHJ1Y3Rvcn1hPWRhLmNhbGwodGhpcyxhLGUpO3coYixhKTtyZXR1cm4gYX0pO1xucGEoYixEb2N1bWVudC5wcm90b3R5cGUse2k6ZmEsYXBwZW5kOmdhfSl9O2Z1bmN0aW9uIHJhKCl7dmFyIGI9WTtmdW5jdGlvbiBhKGEsYyl7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsXCJ0ZXh0Q29udGVudFwiLHtlbnVtZXJhYmxlOmMuZW51bWVyYWJsZSxjb25maWd1cmFibGU6ITAsZ2V0OmMuZ2V0LHNldDpmdW5jdGlvbihhKXtpZih0aGlzLm5vZGVUeXBlPT09Tm9kZS5URVhUX05PREUpYy5zZXQuY2FsbCh0aGlzLGEpO2Vsc2V7dmFyIGQ9dm9pZCAwO2lmKHRoaXMuZmlyc3RDaGlsZCl7dmFyIGU9dGhpcy5jaGlsZE5vZGVzLHU9ZS5sZW5ndGg7aWYoMDx1JiZsKHRoaXMpKWZvcih2YXIgZD1BcnJheSh1KSxwPTA7cDx1O3ArKylkW3BdPWVbcF19Yy5zZXQuY2FsbCh0aGlzLGEpO2lmKGQpZm9yKGE9MDthPGQubGVuZ3RoO2ErKyl6KGIsZFthXSl9fX0pfXEoTm9kZS5wcm90b3R5cGUsXCJpbnNlcnRCZWZvcmVcIixmdW5jdGlvbihhLGMpe2lmKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTtcbmE9SS5jYWxsKHRoaXMsYSxjKTtpZihsKHRoaXMpKWZvcihjPTA7YzxkLmxlbmd0aDtjKyspeChiLGRbY10pO3JldHVybiBhfWQ9bChhKTtjPUkuY2FsbCh0aGlzLGEsYyk7ZCYmeihiLGEpO2wodGhpcykmJngoYixhKTtyZXR1cm4gY30pO3EoTm9kZS5wcm90b3R5cGUsXCJhcHBlbmRDaGlsZFwiLGZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTthPUguY2FsbCh0aGlzLGEpO2lmKGwodGhpcykpZm9yKHZhciBkPTA7ZDxjLmxlbmd0aDtkKyspeChiLGNbZF0pO3JldHVybiBhfWM9bChhKTtkPUguY2FsbCh0aGlzLGEpO2MmJnooYixhKTtsKHRoaXMpJiZ4KGIsYSk7cmV0dXJuIGR9KTtxKE5vZGUucHJvdG90eXBlLFwiY2xvbmVOb2RlXCIsZnVuY3Rpb24oYSl7YT1HLmNhbGwodGhpcyxhKTt0aGlzLm93bmVyRG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT9BKGIsYSk6dihiLGEpO1xucmV0dXJuIGF9KTtxKE5vZGUucHJvdG90eXBlLFwicmVtb3ZlQ2hpbGRcIixmdW5jdGlvbihhKXt2YXIgYz1sKGEpLGQ9Si5jYWxsKHRoaXMsYSk7YyYmeihiLGEpO3JldHVybiBkfSk7cShOb2RlLnByb3RvdHlwZSxcInJlcGxhY2VDaGlsZFwiLGZ1bmN0aW9uKGEsYyl7aWYoYSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhLmNoaWxkTm9kZXMpO2E9Sy5jYWxsKHRoaXMsYSxjKTtpZihsKHRoaXMpKWZvcih6KGIsYyksYz0wO2M8ZC5sZW5ndGg7YysrKXgoYixkW2NdKTtyZXR1cm4gYX12YXIgZD1sKGEpLGU9Sy5jYWxsKHRoaXMsYSxjKSxmPWwodGhpcyk7ZiYmeihiLGMpO2QmJnooYixhKTtmJiZ4KGIsYSk7cmV0dXJuIGV9KTtMJiZMLmdldD9hKE5vZGUucHJvdG90eXBlLEwpOnQoYixmdW5jdGlvbihiKXthKGIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe2Zvcih2YXIgYT1bXSxiPVxuMDtiPHRoaXMuY2hpbGROb2Rlcy5sZW5ndGg7YisrKWEucHVzaCh0aGlzLmNoaWxkTm9kZXNbYl0udGV4dENvbnRlbnQpO3JldHVybiBhLmpvaW4oXCJcIil9LHNldDpmdW5jdGlvbihhKXtmb3IoO3RoaXMuZmlyc3RDaGlsZDspSi5jYWxsKHRoaXMsdGhpcy5maXJzdENoaWxkKTtILmNhbGwodGhpcyxkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSl9fSl9KX07ZnVuY3Rpb24gc2EoYil7dmFyIGE9RWxlbWVudC5wcm90b3R5cGU7YS5iZWZvcmU9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGFyZ3VtZW50cy5sZW5ndGg7KytkKWNbZC0wXT1hcmd1bWVudHNbZF07ZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KTtqYS5hcHBseSh0aGlzLGMpO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKXooYixkW2VdKTtpZihsKHRoaXMpKWZvcihkPTA7ZDxjLmxlbmd0aDtkKyspZT1jW2RdLGUgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZSl9O2EuYWZ0ZXI9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGFyZ3VtZW50cy5sZW5ndGg7KytkKWNbZC0wXT1hcmd1bWVudHNbZF07ZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KTtrYS5hcHBseSh0aGlzLGMpO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKXooYixkW2VdKTtpZihsKHRoaXMpKWZvcihkPVxuMDtkPGMubGVuZ3RoO2QrKyllPWNbZF0sZSBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixlKX07YS5yZXBsYWNlV2l0aD1mdW5jdGlvbihhKXtmb3IodmFyIGM9W10sZD0wO2Q8YXJndW1lbnRzLmxlbmd0aDsrK2QpY1tkLTBdPWFyZ3VtZW50c1tkXTt2YXIgZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KSxlPWwodGhpcyk7bGEuYXBwbHkodGhpcyxjKTtmb3IodmFyIGY9MDtmPGQubGVuZ3RoO2YrKyl6KGIsZFtmXSk7aWYoZSlmb3IoeihiLHRoaXMpLGQ9MDtkPGMubGVuZ3RoO2QrKyllPWNbZF0sZSBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixlKX07YS5yZW1vdmU9ZnVuY3Rpb24oKXt2YXIgYT1sKHRoaXMpO21hLmNhbGwodGhpcyk7YSYmeihiLHRoaXMpfX07ZnVuY3Rpb24gdGEoKXt2YXIgYj1ZO2Z1bmN0aW9uIGEoYSxjKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxcImlubmVySFRNTFwiLHtlbnVtZXJhYmxlOmMuZW51bWVyYWJsZSxjb25maWd1cmFibGU6ITAsZ2V0OmMuZ2V0LHNldDpmdW5jdGlvbihhKXt2YXIgZD10aGlzLGU9dm9pZCAwO2wodGhpcykmJihlPVtdLG4odGhpcyxmdW5jdGlvbihhKXthIT09ZCYmZS5wdXNoKGEpfSkpO2Muc2V0LmNhbGwodGhpcyxhKTtpZihlKWZvcih2YXIgZj0wO2Y8ZS5sZW5ndGg7ZisrKXt2YXIgaD1lW2ZdOzE9PT1oLl9fQ0Vfc3RhdGUmJmIuZGlzY29ubmVjdGVkQ2FsbGJhY2soaCl9dGhpcy5vd25lckRvY3VtZW50Ll9fQ0VfaGFzUmVnaXN0cnk/QShiLHRoaXMpOnYoYix0aGlzKTtyZXR1cm4gYX19KX1mdW5jdGlvbiBlKGEsYyl7cShhLFwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50XCIsZnVuY3Rpb24oYSxkKXt2YXIgZT1sKGQpO2E9Yy5jYWxsKHRoaXMsYSxkKTtlJiZ6KGIsZCk7bChhKSYmeChiLGQpO1xucmV0dXJuIGF9KX1NP3EoRWxlbWVudC5wcm90b3R5cGUsXCJhdHRhY2hTaGFkb3dcIixmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fX0NFX3NoYWRvd1Jvb3Q9YT1NLmNhbGwodGhpcyxhKX0pOmNvbnNvbGUud2FybihcIkN1c3RvbSBFbGVtZW50czogYEVsZW1lbnQjYXR0YWNoU2hhZG93YCB3YXMgbm90IHBhdGNoZWQuXCIpO2lmKE4mJk4uZ2V0KWEoRWxlbWVudC5wcm90b3R5cGUsTik7ZWxzZSBpZihXJiZXLmdldClhKEhUTUxFbGVtZW50LnByb3RvdHlwZSxXKTtlbHNle3ZhciBjPUYuY2FsbChkb2N1bWVudCxcImRpdlwiKTt0KGIsZnVuY3Rpb24oYil7YShiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gRy5jYWxsKHRoaXMsITApLmlubmVySFRNTH0sc2V0OmZ1bmN0aW9uKGEpe3ZhciBiPVwidGVtcGxhdGVcIj09PXRoaXMubG9jYWxOYW1lP3RoaXMuY29udGVudDp0aGlzO2ZvcihjLmlubmVySFRNTD1hOzA8Yi5jaGlsZE5vZGVzLmxlbmd0aDspSi5jYWxsKGIsXG5iLmNoaWxkTm9kZXNbMF0pO2Zvcig7MDxjLmNoaWxkTm9kZXMubGVuZ3RoOylILmNhbGwoYixjLmNoaWxkTm9kZXNbMF0pfX0pfSl9cShFbGVtZW50LnByb3RvdHlwZSxcInNldEF0dHJpYnV0ZVwiLGZ1bmN0aW9uKGEsYyl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gUS5jYWxsKHRoaXMsYSxjKTt2YXIgZD1PLmNhbGwodGhpcyxhKTtRLmNhbGwodGhpcyxhLGMpO2M9Ty5jYWxsKHRoaXMsYSk7ZCE9PWMmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYSxkLGMsbnVsbCl9KTtxKEVsZW1lbnQucHJvdG90eXBlLFwic2V0QXR0cmlidXRlTlNcIixmdW5jdGlvbihhLGMsZSl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gVC5jYWxsKHRoaXMsYSxjLGUpO3ZhciBkPVMuY2FsbCh0aGlzLGEsYyk7VC5jYWxsKHRoaXMsYSxjLGUpO2U9Uy5jYWxsKHRoaXMsYSxjKTtkIT09ZSYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcyxjLGQsZSxhKX0pO3EoRWxlbWVudC5wcm90b3R5cGUsXG5cInJlbW92ZUF0dHJpYnV0ZVwiLGZ1bmN0aW9uKGEpe2lmKDEhPT10aGlzLl9fQ0Vfc3RhdGUpcmV0dXJuIFIuY2FsbCh0aGlzLGEpO3ZhciBjPU8uY2FsbCh0aGlzLGEpO1IuY2FsbCh0aGlzLGEpO251bGwhPT1jJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGEsYyxudWxsLG51bGwpfSk7cShFbGVtZW50LnByb3RvdHlwZSxcInJlbW92ZUF0dHJpYnV0ZU5TXCIsZnVuY3Rpb24oYSxjKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBVLmNhbGwodGhpcyxhLGMpO3ZhciBkPVMuY2FsbCh0aGlzLGEsYyk7VS5jYWxsKHRoaXMsYSxjKTt2YXIgZT1TLmNhbGwodGhpcyxhLGMpO2QhPT1lJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGMsZCxlLGEpfSk7WD9lKEhUTUxFbGVtZW50LnByb3RvdHlwZSxYKTpWP2UoRWxlbWVudC5wcm90b3R5cGUsVik6Y29uc29sZS53YXJuKFwiQ3VzdG9tIEVsZW1lbnRzOiBgRWxlbWVudCNpbnNlcnRBZGphY2VudEVsZW1lbnRgIHdhcyBub3QgcGF0Y2hlZC5cIik7XG5wYShiLEVsZW1lbnQucHJvdG90eXBlLHtpOmhhLGFwcGVuZDppYX0pO3NhKGIpfTtcbnZhciBaPXdpbmRvdy5jdXN0b21FbGVtZW50cztpZighWnx8Wi5mb3JjZVBvbHlmaWxsfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBaLmRlZmluZXx8XCJmdW5jdGlvblwiIT10eXBlb2YgWi5nZXQpe3ZhciBZPW5ldyByO29hKCk7cWEoKTtyYSgpO3RhKCk7ZG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT0hMDt2YXIgdWE9bmV3IEUoWSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdyxcImN1c3RvbUVsZW1lbnRzXCIse2NvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwLHZhbHVlOnVhfSl9O1xufSkuY2FsbChzZWxmKTtcbn1cbi8vIEBsaWNlbnNlIFBvbHltZXIgUHJvamVjdCBBdXRob3JzLiBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcblxuXG5mdW5jdGlvbiBwcm9taXNlUG9seWZpbGwgKCkge1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RheWxvcmhha2VzL3Byb21pc2UtcG9seWZpbGwvYmxvYi9tYXN0ZXIvcHJvbWlzZS5qc1xudmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcbmZ1bmN0aW9uIG5vb3AoKSB7fVxuZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xucmV0dXJuIGZ1bmN0aW9uICgpIHtcbmZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG59O1xufVxuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuaWYgKHR5cGVvZiB0aGlzICE9PSAnb2JqZWN0JykgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG5pZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xudGhpcy5fc3RhdGUgPSAwO1xudGhpcy5faGFuZGxlZCA9IGZhbHNlO1xudGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG50aGlzLl9kZWZlcnJlZHMgPSBbXTtcblxuZG9SZXNvbHZlKGZuLCB0aGlzKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xud2hpbGUgKHNlbGYuX3N0YXRlID09PSAzKSB7XG5zZWxmID0gc2VsZi5fdmFsdWU7XG59XG5pZiAoc2VsZi5fc3RhdGUgPT09IDApIHtcbnNlbGYuX2RlZmVycmVkcy5wdXNoKGRlZmVycmVkKTtcbnJldHVybjtcbn1cbnNlbGYuX2hhbmRsZWQgPSB0cnVlO1xuUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24gKCkge1xudmFyIGNiID0gc2VsZi5fc3RhdGUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG5pZiAoY2IgPT09IG51bGwpIHtcbihzZWxmLl9zdGF0ZSA9PT0gMSA/IHJlc29sdmUgOiByZWplY3QpKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbnJldHVybjtcbn1cbnZhciByZXQ7XG50cnkge1xucmV0ID0gY2Ioc2VsZi5fdmFsdWUpO1xufSBjYXRjaCAoZSkge1xucmVqZWN0KGRlZmVycmVkLnByb21pc2UsIGUpO1xucmV0dXJuO1xufVxucmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xufSk7XG59XG5mdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG50cnkge1xuLy8gUHJvbWlzZSBSZXNvbHV0aW9uIFByb2NlZHVyZTogaHR0cHM6Ly9naXRodWIuY29tL3Byb21pc2VzLWFwbHVzL3Byb21pc2VzLXNwZWMjdGhlLXByb21pc2UtcmVzb2x1dGlvbi1wcm9jZWR1cmVcbmlmIChuZXdWYWx1ZSA9PT0gc2VsZikgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKTtcbmlmIChuZXdWYWx1ZSAmJiAodHlwZW9mIG5ld1ZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpKSB7XG52YXIgdGhlbiA9IG5ld1ZhbHVlLnRoZW47XG5pZiAobmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5zZWxmLl9zdGF0ZSA9IDM7XG5zZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuZmluYWxlKHNlbGYpO1xucmV0dXJuO1xufSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbnJldHVybjtcbn1cbn1cbnNlbGYuX3N0YXRlID0gMTtcbnNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG5maW5hbGUoc2VsZik7XG59IGNhdGNoIChlKSB7XG5yZWplY3Qoc2VsZiwgZSk7XG59XG59XG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbnNlbGYuX3N0YXRlID0gMjtcbnNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG5maW5hbGUoc2VsZik7XG59XG5mdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuaWYgKHNlbGYuX3N0YXRlID09PSAyICYmIHNlbGYuX2RlZmVycmVkcy5sZW5ndGggPT09IDApIHtcblByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG5Qcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbihzZWxmLl92YWx1ZSk7XG59XG59KTtcbn1cblxuZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGYuX2RlZmVycmVkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuaGFuZGxlKHNlbGYsIHNlbGYuX2RlZmVycmVkc1tpXSk7XG59XG5zZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xufVxuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSkge1xudGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbnRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG50aGlzLnByb21pc2UgPSBwcm9taXNlO1xufVxuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG52YXIgZG9uZSA9IGZhbHNlO1xudHJ5IHtcbmZuKGZ1bmN0aW9uICh2YWx1ZSkge1xuaWYgKGRvbmUpIHJldHVybjtcbmRvbmUgPSB0cnVlO1xucmVzb2x2ZShzZWxmLCB2YWx1ZSk7XG59LCBmdW5jdGlvbiAocmVhc29uKSB7XG5pZiAoZG9uZSkgcmV0dXJuO1xuZG9uZSA9IHRydWU7XG5yZWplY3Qoc2VsZiwgcmVhc29uKTtcbn0pO1xufSBjYXRjaCAoZXgpIHtcbmlmIChkb25lKSByZXR1cm47XG5kb25lID0gdHJ1ZTtcbnJlamVjdChzZWxmLCBleCk7XG59XG59XG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG5yZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xufTtcblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbnZhciBwcm9tID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yKShub29wKTtcblxuaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9tKSk7XG5yZXR1cm4gcHJvbTtcbn07XG5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uIChhcnIpIHtcbnZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbnJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5pZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbnZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcblxuZnVuY3Rpb24gcmVzKGksIHZhbCkge1xudHJ5IHtcbmlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG52YXIgdGhlbiA9IHZhbC50aGVuO1xuaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG50aGVuLmNhbGwodmFsLCBmdW5jdGlvbiAodmFsKSB7XG5yZXMoaSwgdmFsKTtcbn0sIHJlamVjdCk7XG5yZXR1cm47XG59XG59XG5hcmdzW2ldID0gdmFsO1xuaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG5yZXNvbHZlKGFyZ3MpO1xufVxufSBjYXRjaCAoZXgpIHtcbnJlamVjdChleCk7XG59XG59XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xucmVzKGksIGFyZ3NbaV0pO1xufVxufSk7XG59O1xuUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5pZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gUHJvbWlzZSkge1xucmV0dXJuIHZhbHVlO1xufVxuXG5yZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbnJlc29sdmUodmFsdWUpO1xufSk7XG59O1xuUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbnJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5yZWplY3QodmFsdWUpO1xufSk7XG59O1xuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xucmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbmZvciAodmFyIGkgPSAwLCBsZW4gPSB2YWx1ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbnZhbHVlc1tpXS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG59XG59KTtcbn07XG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9ICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmIGZ1bmN0aW9uIChmbikgeyBzZXRJbW1lZGlhdGUoZm4pOyB9KSB8fFxuZnVuY3Rpb24gKGZuKSB7XG5zZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG59O1xuUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG5pZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbmNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxufVxufTtcblByb21pc2UuX3NldEltbWVkaWF0ZUZuID0gZnVuY3Rpb24gX3NldEltbWVkaWF0ZUZuKGZuKSB7XG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9IGZuO1xufTtcblByb21pc2UuX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuKGZuKSB7XG5Qcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbiA9IGZuO1xufTtcbmNvbnNvbGUubG9nKCdQcm9taXNlIHBvbHlmaWxsJyk7XG53aW5kb3cuUHJvbWlzZSA9IFByb21pc2U7XG59XG4iLCIvKiBVTUQuZGVmaW5lICovIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgY3VzdG9tTG9hZGVyID09PSAnZnVuY3Rpb24nKXsgY3VzdG9tTG9hZGVyKGZhY3RvcnksICdkb20nKTsgfWVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgeyBkZWZpbmUoW10sIGZhY3RvcnkpOyB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JykgeyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTsgfSBlbHNlIHsgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpOyB3aW5kb3cuZG9tID0gZmFjdG9yeSgpOyB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgY29udmVuaWVuY2UgbGlicmFyeSBmb3IgY29tbW9uIERPTSBtZXRob2RzXG4gICAgLy8gICAgICBkb20oKVxuICAgIC8vICAgICAgICAgIGNyZWF0ZSBkb20gbm9kZXNcbiAgICAvLyAgICAgIGRvbS5zdHlsZSgpXG4gICAgLy8gICAgICAgICAgc2V0L2dldCBub2RlIHN0eWxlXG4gICAgLy8gICAgICBkb20uYXR0cigpXG4gICAgLy8gICAgICAgICAgc2V0L2dldCBhdHRyaWJ1dGVzXG4gICAgLy8gICAgICBkb20uZGVzdHJveSgpXG4gICAgLy8gICAgICAgICAgb2JsaXRlcmF0ZXMgYSBub2RlXG4gICAgLy8gICAgICBkb20uYm94KClcbiAgICAvLyAgICAgICAgICBnZXQgbm9kZSBkaW1lbnNpb25zXG4gICAgLy8gICAgICBkb20udWlkKClcbiAgICAvLyAgICAgICAgICBnZXQgYSB1bmlxdWUgSUQgKG5vdCBkb20gc3BlY2lmaWMpXG4gICAgLy9cbiAgICB2YXJcbiAgICAgICAgaXNGbG9hdCA9IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgICAgICAnei1pbmRleCc6IDFcbiAgICAgICAgfSxcbiAgICAgICAgaXNEaW1lbnNpb24gPSB7XG4gICAgICAgICAgICB3aWR0aDoxLFxuICAgICAgICAgICAgaGVpZ2h0OjEsXG4gICAgICAgICAgICB0b3A6MSxcbiAgICAgICAgICAgIGxlZnQ6MSxcbiAgICAgICAgICAgIHJpZ2h0OjEsXG4gICAgICAgICAgICBib3R0b206MSxcbiAgICAgICAgICAgIG1heFdpZHRoOjEsXG4gICAgICAgICAgICAnbWF4LXdpZHRoJzoxLFxuICAgICAgICAgICAgbWluV2lkdGg6MSxcbiAgICAgICAgICAgICdtaW4td2lkdGgnOjEsXG4gICAgICAgICAgICBtYXhIZWlnaHQ6MSxcbiAgICAgICAgICAgICdtYXgtaGVpZ2h0JzoxXG4gICAgICAgIH0sXG4gICAgICAgIHVpZHMgPSB7fSxcbiAgICAgICAgZGVzdHJveWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBmdW5jdGlvbiB1aWQgKHR5cGUpe1xuICAgICAgICBpZighdWlkc1t0eXBlXSl7XG4gICAgICAgICAgICB1aWRzW3R5cGVdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkID0gdHlwZSArICctJyArICh1aWRzW3R5cGVdLmxlbmd0aCArIDEpO1xuICAgICAgICB1aWRzW3R5cGVdLnB1c2goaWQpO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNOb2RlIChpdGVtKXtcbiAgICAgICAgLy8gc2FmZXIgdGVzdCBmb3IgY3VzdG9tIGVsZW1lbnRzIGluIEZGICh3aXRoIHdjIHNoaW0pXG4gICAgICAgIHJldHVybiAhIWl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICh0eXBlb2YgaXRlbS5pbm5lckhUTUwgPT09ICdzdHJpbmcnIHx8IGl0ZW0ubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQtZnJhZ21lbnQnKTtcblx0fVxuXG4gICAgZnVuY3Rpb24gZ2V0Tm9kZSAoaXRlbSl7XG5cbiAgICAgICAgaWYoIWl0ZW0peyByZXR1cm4gaXRlbTsgfVxuICAgICAgICBpZih0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlLWpxdWVyeWlmeVxuICAgICAgICByZXR1cm4gaXRlbS5nZXQgPyBpdGVtLmdldCgwKSA6XG4gICAgICAgICAgICAvLyBpdGVtIGlzIGEgZG9tIG5vZGVcbiAgICAgICAgICAgIGl0ZW07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnlJZCAoaWQpe1xuICAgICAgICByZXR1cm4gZ2V0Tm9kZShpZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3R5bGUgKG5vZGUsIHByb3AsIHZhbHVlKXtcbiAgICAgICAgLy8gZ2V0L3NldCBub2RlIHN0eWxlKHMpXG4gICAgICAgIC8vICAgICAgcHJvcDogc3RyaW5nIG9yIG9iamVjdFxuICAgICAgICAvL1xuICAgICAgICB2YXIga2V5LCBjb21wdXRlZDtcbiAgICAgICAgaWYodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIC8vIG9iamVjdCBzZXR0ZXJcbiAgICAgICAgICAgIGZvcihrZXkgaW4gcHJvcCl7XG4gICAgICAgICAgICAgICAgaWYocHJvcC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUobm9kZSwga2V5LCBwcm9wW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9ZWxzZSBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IHNldHRlclxuICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0RpbWVuc2lvbltwcm9wXSl7XG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYocHJvcCA9PT0gJ3VzZXJTZWxlY3QnKXtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICEhdmFsdWUgPyAndGV4dCcgOiAnbm9uZSc7XG4gICAgICAgICAgICAgICAgc3R5bGUobm9kZSwge1xuICAgICAgICAgICAgICAgICAgICB3ZWJraXRUb3VjaENhbGxvdXQ6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB3ZWJraXRVc2VyU2VsZWN0OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAga2h0bWxVc2VyU2VsZWN0OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgbW96VXNlclNlbGVjdDogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG1zVXNlclNlbGVjdDogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldHRlciwgaWYgYSBzaW1wbGUgc3R5bGVcbiAgICAgICAgaWYobm9kZS5zdHlsZVtwcm9wXSl7XG4gICAgICAgICAgICBpZihpc0RpbWVuc2lvbltwcm9wXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG5vZGUuc3R5bGVbcHJvcF0sIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGlzRmxvYXRbcHJvcF0pe1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG5vZGUuc3R5bGVbcHJvcF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuc3R5bGVbcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXR0ZXIsIGNvbXB1dGVkXG4gICAgICAgIGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBwcm9wKTtcbiAgICAgICAgaWYoY29tcHV0ZWRbcHJvcF0pe1xuICAgICAgICAgICAgaWYoL1xcZC8udGVzdChjb21wdXRlZFtwcm9wXSkpe1xuICAgICAgICAgICAgICAgIGlmKCFpc05hTihwYXJzZUludChjb21wdXRlZFtwcm9wXSwgMTApKSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChjb21wdXRlZFtwcm9wXSwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRbcHJvcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGF0dHIgKG5vZGUsIHByb3AsIHZhbHVlKXtcbiAgICAgICAgLy8gZ2V0L3NldCBub2RlIGF0dHJpYnV0ZShzKVxuICAgICAgICAvLyAgICAgIHByb3A6IHN0cmluZyBvciBvYmplY3RcbiAgICAgICAgLy9cbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgaWYodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIGZvcihrZXkgaW4gcHJvcCl7XG4gICAgICAgICAgICAgICAgaWYocHJvcC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIHByb3Bba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGlmKHByb3AgPT09ICd0ZXh0JyB8fCBwcm9wID09PSAnaHRtbCcgfHwgcHJvcCA9PT0gJ2lubmVySFRNTCcpe1xuICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShwcm9wLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUocHJvcCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm94IChub2RlKXtcbiAgICAgICAgaWYobm9kZSA9PT0gd2luZG93KXtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm9kZSBkaW1lbnNpb25zXG4gICAgICAgIC8vIHJldHVybmVkIG9iamVjdCBpcyBpbW11dGFibGVcbiAgICAgICAgLy8gYWRkIHNjcm9sbCBwb3NpdGlvbmluZyBhbmQgY29udmVuaWVuY2UgYWJicmV2aWF0aW9uc1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBnZXROb2RlKG5vZGUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBkaW1lbnNpb25zLnRvcCxcbiAgICAgICAgICAgIHJpZ2h0OiBkaW1lbnNpb25zLnJpZ2h0LFxuICAgICAgICAgICAgYm90dG9tOiBkaW1lbnNpb25zLmJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IGRpbWVuc2lvbnMubGVmdCxcbiAgICAgICAgICAgIGhlaWdodDogZGltZW5zaW9ucy5oZWlnaHQsXG4gICAgICAgICAgICBoOiBkaW1lbnNpb25zLmhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiBkaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgICAgdzogZGltZW5zaW9ucy53aWR0aCxcbiAgICAgICAgICAgIHNjcm9sbFk6IHdpbmRvdy5zY3JvbGxZLFxuICAgICAgICAgICAgc2Nyb2xsWDogd2luZG93LnNjcm9sbFgsXG4gICAgICAgICAgICB4OiBkaW1lbnNpb25zLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQsXG4gICAgICAgICAgICB5OiBkaW1lbnNpb25zLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHF1ZXJ5IChub2RlLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKCFzZWxlY3Rvcil7XG4gICAgICAgICAgICBzZWxlY3RvciA9IG5vZGU7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHF1ZXJ5QWxsIChub2RlLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKCFzZWxlY3Rvcil7XG4gICAgICAgICAgICBzZWxlY3RvciA9IG5vZGU7XG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5vZGVzID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgICBpZighbm9kZXMubGVuZ3RoKXsgcmV0dXJuIFtdOyB9XG5cbiAgICAgICAgLy8gY29udmVydCB0byBBcnJheSBhbmQgcmV0dXJuIGl0XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2Rlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9Eb20gKGh0bWwsIG9wdGlvbnMsIHBhcmVudCl7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5vZGUgZnJvbSBhbiBIVE1MIHN0cmluZ1xuICAgICAgICB2YXIgbm9kZSA9IGRvbSgnZGl2Jywge2h0bWw6IGh0bWx9KTtcbiAgICAgICAgcGFyZW50ID0gYnlJZChwYXJlbnQgfHwgb3B0aW9ucyk7XG4gICAgICAgIGlmKHBhcmVudCl7XG4gICAgICAgICAgICB3aGlsZShub2RlLmZpcnN0Q2hpbGQpe1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZihodG1sLmluZGV4T2YoJzwnKSAhPT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb21Eb20gKG5vZGUpIHtcbiAgICAgICAgZnVuY3Rpb24gZ2V0QXR0cnMgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBhdHQsIGksIGF0dHJzID0ge307XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGF0dCA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICBhdHRyc1thdHQubG9jYWxOYW1lXSA9IG5vcm1hbGl6ZShhdHQudmFsdWUgPT09ICcnID8gdHJ1ZSA6IGF0dC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXR0cnM7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGV4dCAobm9kZSkge1xuICAgICAgICAgICAgdmFyIGksIHQsIHRleHQgPSAnJztcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdCA9IG5vZGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICBpZih0Lm5vZGVUeXBlID09PSAzICYmIHQudGV4dENvbnRlbnQudHJpbSgpKXtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCArPSB0LnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSwgb2JqZWN0ID0gZ2V0QXR0cnMobm9kZSk7XG4gICAgICAgIG9iamVjdC50ZXh0ID0gZ2V0VGV4dChub2RlKTtcbiAgICAgICAgb2JqZWN0LmNoaWxkcmVuID0gW107XG4gICAgICAgIGlmKG5vZGUuY2hpbGRyZW4ubGVuZ3RoKXtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIG9iamVjdC5jaGlsZHJlbi5wdXNoKGZyb21Eb20obm9kZS5jaGlsZHJlbltpXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ2hpbGRyZW4gKG5vZGUsIGNoaWxkcmVuKSB7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKXtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkQ29udGVudCAobm9kZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgaHRtbDtcbiAgICAgICAgaWYob3B0aW9ucy5odG1sICE9PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5pbm5lckhUTUwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBodG1sID0gb3B0aW9ucy5odG1sIHx8IG9wdGlvbnMuaW5uZXJIVE1MIHx8ICcnO1xuICAgICAgICAgICAgaWYodHlwZW9mIGh0bWwgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgICAgICBhZGRDaGlsZHJlbihub2RlLCBodG1sKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbWlzc2VzIHNvbWUgSFRNTCwgc3VjaCBhcyBlbnRpdGllcyAoJm5wc3A7KVxuICAgICAgICAgICAgLy9lbHNlIGlmKGh0bWwuaW5kZXhPZignPCcpID09PSAwKSB7XG4gICAgICAgICAgICAvLyAgICBub2RlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vZWxzZXtcbiAgICAgICAgICAgIC8vICAgIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaHRtbCkpO1xuICAgICAgICAgICAgLy99XG4gICAgICAgIH1cbiAgICAgICAgaWYob3B0aW9ucy50ZXh0KXtcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob3B0aW9ucy50ZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYob3B0aW9ucy5jaGlsZHJlbil7XG4gICAgICAgICAgICBhZGRDaGlsZHJlbihub2RlLCBvcHRpb25zLmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBkb20gKG5vZGVUeXBlLCBvcHRpb25zLCBwYXJlbnQsIHByZXBlbmQpe1xuICAgICAgICAvLyBjcmVhdGUgYSBub2RlXG4gICAgICAgIC8vIGlmIGZpcnN0IGFyZ3VtZW50IGlzIGEgc3RyaW5nIGFuZCBzdGFydHMgd2l0aCA8LCBpdCBpcyBhc3N1bWVkXG4gICAgICAgIC8vIHRvIHVzZSB0b0RvbSwgYW5kIGNyZWF0ZXMgYSBub2RlIGZyb20gSFRNTC4gT3B0aW9uYWwgc2Vjb25kIGFyZyBpc1xuICAgICAgICAvLyBwYXJlbnQgdG8gYXBwZW5kIHRvXG4gICAgICAgIC8vIGVsc2U6XG4gICAgICAgIC8vICAgICAgbm9kZVR5cGU6IHN0cmluZywgdHlwZSBvZiBub2RlIHRvIGNyZWF0ZVxuICAgICAgICAvLyAgICAgIG9wdGlvbnM6IG9iamVjdCB3aXRoIHN0eWxlLCBjbGFzc05hbWUsIG9yIGF0dHIgcHJvcGVydGllc1xuICAgICAgICAvLyAgICAgICAgICAoY2FuIGFsc28gYmUgb2JqZWN0cylcbiAgICAgICAgLy8gICAgICBwYXJlbnQ6IE5vZGUsIG9wdGlvbmFsIG5vZGUgdG8gYXBwZW5kIHRvXG4gICAgICAgIC8vICAgICAgcHJlcGVuZDogdHJ1dGh5LCB0byBhcHBlbmQgbm9kZSBhcyB0aGUgZmlyc3QgY2hpbGRcbiAgICAgICAgLy9cbiAgICAgICAgaWYobm9kZVR5cGUuaW5kZXhPZignPCcpID09PSAwKXtcbiAgICAgICAgICAgIHJldHVybiB0b0RvbShub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB2YXJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IG9wdGlvbnMuY3NzIHx8IG9wdGlvbnMuY2xhc3NOYW1lIHx8IG9wdGlvbnMuY2xhc3MsXG4gICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlVHlwZSk7XG5cbiAgICAgICAgcGFyZW50ID0gZ2V0Tm9kZShwYXJlbnQpO1xuXG4gICAgICAgIGlmKGNsYXNzTmFtZSl7XG4gICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYWRkQ29udGVudChub2RlLCBvcHRpb25zKTtcbiAgICAgICAgXG4gICAgICAgIGlmKG9wdGlvbnMuY3NzVGV4dCl7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmNzc1RleHQgPSBvcHRpb25zLmNzc1RleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZihvcHRpb25zLmlkKXtcbiAgICAgICAgICAgIG5vZGUuaWQgPSBvcHRpb25zLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYob3B0aW9ucy5zdHlsZSl7XG4gICAgICAgICAgICBzdHlsZShub2RlLCBvcHRpb25zLnN0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG9wdGlvbnMuYXR0cil7XG4gICAgICAgICAgICBhdHRyKG5vZGUsIG9wdGlvbnMuYXR0cik7XG4gICAgICAgIH1cblxuICAgICAgICBpZihwYXJlbnQgJiYgaXNOb2RlKHBhcmVudCkpe1xuICAgICAgICAgICAgaWYocHJlcGVuZCAmJiBwYXJlbnQuaGFzQ2hpbGROb2RlcygpKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudC5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXROZXh0U2libGluZyAobm9kZSkge1xuICAgICAgICB2YXIgc2libGluZyA9IG5vZGU7XG4gICAgICAgIHdoaWxlKHNpYmxpbmcpe1xuICAgICAgICAgICAgc2libGluZyA9IHNpYmxpbmcubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBpZihzaWJsaW5nICYmIHNpYmxpbmcubm9kZVR5cGUgPT09IDEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBzaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc2VydEFmdGVyIChyZWZOb2RlLCBub2RlKSB7XG4gICAgICAgIHZhciBzaWJsaW5nID0gZ2V0TmV4dFNpYmxpbmcocmVmTm9kZSk7XG4gICAgICAgIGlmKCFzaWJsaW5nKXtcbiAgICAgICAgICAgIHJlZk5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZWZOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIHNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWJsaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3kgKG5vZGUpe1xuICAgICAgICAvLyBkZXN0cm95cyBhIG5vZGUgY29tcGxldGVseVxuICAgICAgICAvL1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICBkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICBkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbiAobm9kZSwgZGlzcG9zZSl7XG4gICAgICAgIC8vXHRSZW1vdmVzIGFsbCBjaGlsZCBub2Rlc1xuICAgICAgICAvL1x0XHRkaXNwb3NlOiBkZXN0cm95IGNoaWxkIG5vZGVzXG4gICAgICAgIGlmKGRpc3Bvc2Upe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGRlc3Ryb3kobm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFuY2VzdG9yIChub2RlLCBzZWxlY3Rvcil7XG4gICAgICAgIC8vIFRPRE86IHJlcGxhY2UgdGhpcyB3aXRoICdjbG9zZXN0JyBhbmQgJ21hdGNoZXMnXG4gICAgICAgIC8vIGdldHMgdGhlIGFuY2VzdG9yIG9mIG5vZGUgYmFzZWQgb24gc2VsZWN0b3IgY3JpdGVyaWFcbiAgICAgICAgLy8gdXNlZnVsIGZvciBnZXR0aW5nIHRoZSB0YXJnZXQgbm9kZSB3aGVuIGEgY2hpbGQgbm9kZSBpcyBjbGlja2VkIHVwb25cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVVNBR0VcbiAgICAgICAgLy8gICAgICBvbi5zZWxlY3RvcihjaGlsZE5vZGUsICcuYXBwLmFjdGl2ZScpO1xuICAgICAgICAvLyAgICAgIG9uLnNlbGVjdG9yKGNoaWxkTm9kZSwgJyN0aGluZ2VyJyk7XG4gICAgICAgIC8vICAgICAgb24uc2VsZWN0b3IoY2hpbGROb2RlLCAnZGl2Jyk7XG4gICAgICAgIC8vXHRET0VTIE5PVCBTVVBQT1JUOlxuICAgICAgICAvL1x0XHRjb21iaW5hdGlvbnMgb2YgYWJvdmVcbiAgICAgICAgdmFyXG4gICAgICAgICAgICB0ZXN0LFxuICAgICAgICAgICAgcGFyZW50ID0gbm9kZTtcblxuICAgICAgICBpZihzZWxlY3Rvci5pbmRleE9mKCcuJykgPT09IDApe1xuICAgICAgICAgICAgLy8gY2xhc3NOYW1lXG4gICAgICAgICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoJy4nLCAnICcpLnRyaW0oKTtcbiAgICAgICAgICAgIHRlc3QgPSBmdW5jdGlvbihuKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gbi5jbGFzc0xpc3QuY29udGFpbnMoc2VsZWN0b3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoJyMnKSA9PT0gMCl7XG4gICAgICAgICAgICAvLyBub2RlIGlkXG4gICAgICAgICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoJyMnLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgdGVzdCA9IGZ1bmN0aW9uKG4pe1xuICAgICAgICAgICAgICAgIHJldHVybiBuLmlkID09PSBzZWxlY3RvcjtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihzZWxlY3Rvci5pbmRleE9mKCdbJykgPiAtMSl7XG4gICAgICAgICAgICAvLyBhdHRyaWJ1dGVcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2F0dHJpYnV0ZSBzZWxlY3RvcnMgYXJlIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIC8vIGFzc3VtaW5nIG5vZGUgbmFtZVxuICAgICAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgdGVzdCA9IGZ1bmN0aW9uKG4pe1xuICAgICAgICAgICAgICAgIHJldHVybiBuLm5vZGVOYW1lID09PSBzZWxlY3RvcjtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZShwYXJlbnQpe1xuICAgICAgICAgICAgaWYocGFyZW50ID09PSBkb2N1bWVudC5ib2R5IHx8IHBhcmVudCA9PT0gZG9jdW1lbnQpeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgICAgIGlmKHRlc3QocGFyZW50KSl7IGJyZWFrOyB9XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfVxuXG4gICAgZG9tLmNsYXNzTGlzdCA9IHtcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgdG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgdG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICByZXR1cm4gdG9BcnJheShuYW1lcykuZXZlcnkoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5jbGFzc0xpc3QuY29udGFpbnMobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMsIHZhbHVlKXtcbiAgICAgICAgICAgIG5hbWVzID0gdG9BcnJheShuYW1lcyk7XG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHN0YW5kYXJkIGZ1bmN0aW9uYWxpdHksIHN1cHBvcnRlZCBieSBJRVxuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QudG9nZ2xlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCB0aGUgc2Vjb25kIHBhcmFtZXRlciAgXG4gICAgICAgICAgICBlbHNlIGlmKHZhbHVlKXtcbiAgICAgICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAobmFtZXMpe1xuICAgICAgICBpZighbmFtZXMpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZG9tLmNsYXNzTGlzdCBzaG91bGQgaW5jbHVkZSBhIG5vZGUgYW5kIGEgY2xhc3NOYW1lJyk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWVzLnNwbGl0KCcgJykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZS50cmltKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgICAgICBkb20ucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgICAgICAgc2V0VGltZW91dChjYWxsYmFjaywgMCk7XG4gICAgICAgIH07XG4gICAgfWVsc2V7XG4gICAgICAgIGRvbS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYil7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplICh2YWwpe1xuICAgICAgICBpZih2YWwgPT09ICdmYWxzZScpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9ZWxzZSBpZih2YWwgPT09ICd0cnVlJyl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZighaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSl7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG4gICAgZG9tLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcbiAgICBkb20uY2xlYW4gPSBjbGVhbjtcbiAgICBkb20ucXVlcnkgPSBxdWVyeTtcbiAgICBkb20ucXVlcnlBbGwgPSBxdWVyeUFsbDtcbiAgICBkb20uYnlJZCA9IGJ5SWQ7XG4gICAgZG9tLmF0dHIgPSBhdHRyO1xuICAgIGRvbS5ib3ggPSBib3g7XG4gICAgZG9tLnN0eWxlID0gc3R5bGU7XG4gICAgZG9tLmRlc3Ryb3kgPSBkZXN0cm95O1xuICAgIGRvbS51aWQgPSB1aWQ7XG4gICAgZG9tLmlzTm9kZSA9IGlzTm9kZTtcbiAgICBkb20uYW5jZXN0b3IgPSBhbmNlc3RvcjtcbiAgICBkb20udG9Eb20gPSB0b0RvbTtcbiAgICBkb20uZnJvbURvbSA9IGZyb21Eb207XG4gICAgZG9tLmluc2VydEFmdGVyID0gaW5zZXJ0QWZ0ZXI7XG4gICAgZG9tLmdldE5leHRTaWJsaW5nID0gZ2V0TmV4dFNpYmxpbmc7XG5cbiAgICByZXR1cm4gZG9tO1xufSkpO1xuIiwiLyogZ2xvYmFsIGRlZmluZSwgS2V5Ym9hcmRFdmVudCwgbW9kdWxlICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IHtcbiAgICBwb2x5ZmlsbDogcG9seWZpbGwsXG4gICAga2V5czoge1xuICAgICAgMzogJ0NhbmNlbCcsXG4gICAgICA2OiAnSGVscCcsXG4gICAgICA4OiAnQmFja3NwYWNlJyxcbiAgICAgIDk6ICdUYWInLFxuICAgICAgMTI6ICdDbGVhcicsXG4gICAgICAxMzogJ0VudGVyJyxcbiAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgMTc6ICdDb250cm9sJyxcbiAgICAgIDE4OiAnQWx0JyxcbiAgICAgIDE5OiAnUGF1c2UnLFxuICAgICAgMjA6ICdDYXBzTG9jaycsXG4gICAgICAyNzogJ0VzY2FwZScsXG4gICAgICAyODogJ0NvbnZlcnQnLFxuICAgICAgMjk6ICdOb25Db252ZXJ0JyxcbiAgICAgIDMwOiAnQWNjZXB0JyxcbiAgICAgIDMxOiAnTW9kZUNoYW5nZScsXG4gICAgICAzMjogJyAnLFxuICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAzNTogJ0VuZCcsXG4gICAgICAzNjogJ0hvbWUnLFxuICAgICAgMzc6ICdBcnJvd0xlZnQnLFxuICAgICAgMzg6ICdBcnJvd1VwJyxcbiAgICAgIDM5OiAnQXJyb3dSaWdodCcsXG4gICAgICA0MDogJ0Fycm93RG93bicsXG4gICAgICA0MTogJ1NlbGVjdCcsXG4gICAgICA0MjogJ1ByaW50JyxcbiAgICAgIDQzOiAnRXhlY3V0ZScsXG4gICAgICA0NDogJ1ByaW50U2NyZWVuJyxcbiAgICAgIDQ1OiAnSW5zZXJ0JyxcbiAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgIDQ4OiBbJzAnLCAnKSddLFxuICAgICAgNDk6IFsnMScsICchJ10sXG4gICAgICA1MDogWycyJywgJ0AnXSxcbiAgICAgIDUxOiBbJzMnLCAnIyddLFxuICAgICAgNTI6IFsnNCcsICckJ10sXG4gICAgICA1MzogWyc1JywgJyUnXSxcbiAgICAgIDU0OiBbJzYnLCAnXiddLFxuICAgICAgNTU6IFsnNycsICcmJ10sXG4gICAgICA1NjogWyc4JywgJyonXSxcbiAgICAgIDU3OiBbJzknLCAnKCddLFxuICAgICAgOTE6ICdPUycsXG4gICAgICA5MzogJ0NvbnRleHRNZW51JyxcbiAgICAgIDE0NDogJ051bUxvY2snLFxuICAgICAgMTQ1OiAnU2Nyb2xsTG9jaycsXG4gICAgICAxODE6ICdWb2x1bWVNdXRlJyxcbiAgICAgIDE4MjogJ1ZvbHVtZURvd24nLFxuICAgICAgMTgzOiAnVm9sdW1lVXAnLFxuICAgICAgMTg2OiBbJzsnLCAnOiddLFxuICAgICAgMTg3OiBbJz0nLCAnKyddLFxuICAgICAgMTg4OiBbJywnLCAnPCddLFxuICAgICAgMTg5OiBbJy0nLCAnXyddLFxuICAgICAgMTkwOiBbJy4nLCAnPiddLFxuICAgICAgMTkxOiBbJy8nLCAnPyddLFxuICAgICAgMTkyOiBbJ2AnLCAnfiddLFxuICAgICAgMjE5OiBbJ1snLCAneyddLFxuICAgICAgMjIwOiBbJ1xcXFwnLCAnfCddLFxuICAgICAgMjIxOiBbJ10nLCAnfSddLFxuICAgICAgMjIyOiBbXCInXCIsICdcIiddLFxuICAgICAgMjI0OiAnTWV0YScsXG4gICAgICAyMjU6ICdBbHRHcmFwaCcsXG4gICAgICAyNDY6ICdBdHRuJyxcbiAgICAgIDI0NzogJ0NyU2VsJyxcbiAgICAgIDI0ODogJ0V4U2VsJyxcbiAgICAgIDI0OTogJ0VyYXNlRW9mJyxcbiAgICAgIDI1MDogJ1BsYXknLFxuICAgICAgMjUxOiAnWm9vbU91dCdcbiAgICB9XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24ga2V5cyAoRjEtMjQpLlxuICB2YXIgaTtcbiAgZm9yIChpID0gMTsgaSA8IDI1OyBpKyspIHtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1sxMTEgKyBpXSA9ICdGJyArIGk7XG4gIH1cblxuICAvLyBQcmludGFibGUgQVNDSUkgY2hhcmFjdGVycy5cbiAgdmFyIGxldHRlciA9ICcnO1xuICBmb3IgKGkgPSA2NTsgaSA8IDkxOyBpKyspIHtcbiAgICBsZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW2ldID0gW2xldHRlci50b0xvd2VyQ2FzZSgpLCBsZXR0ZXIudG9VcHBlckNhc2UoKV07XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbCAoKSB7XG4gICAgaWYgKCEoJ0tleWJvYXJkRXZlbnQnIGluIHdpbmRvdykgfHxcbiAgICAgICAgJ2tleScgaW4gS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQb2x5ZmlsbCBga2V5YCBvbiBgS2V5Ym9hcmRFdmVudGAuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbdGhpcy53aGljaCB8fCB0aGlzLmtleUNvZGVdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXlbK3RoaXMuc2hpZnRLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShLZXlib2FyZEV2ZW50LnByb3RvdHlwZSwgJ2tleScsIHByb3RvKTtcbiAgICByZXR1cm4gcHJvdG87XG4gIH1cblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcsIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgd2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfVxuXG59KSgpO1xuLyogVU1ELmRlZmluZSAqLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBjdXN0b21Mb2FkZXIgPT09ICdmdW5jdGlvbicpeyBjdXN0b21Mb2FkZXIoZmFjdG9yeSwgJ29uJyk7IH1lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpeyBkZWZpbmUoW10sIGZhY3RvcnkpOyB9ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpeyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTsgfWVsc2V7IHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTsgd2luZG93Lm9uID0gZmFjdG9yeSgpOyB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0Ly8gYG9uYCBpcyBhIHNpbXBsZSBsaWJyYXJ5IGZvciBhdHRhY2hpbmcgZXZlbnRzIHRvIG5vZGVzLiBJdHMgcHJpbWFyeSBmZWF0dXJlXG5cdC8vIGlzIGl0IHJldHVybnMgYSBoYW5kbGUsIGZyb20gd2hpY2ggeW91IGNhbiBwYXVzZSwgcmVzdW1lIGFuZCByZW1vdmUgdGhlXG5cdC8vIGV2ZW50LiBIYW5kbGVzIGFyZSBtdWNoIGVhc2llciB0byBtYW5pcHVsYXRlIHRoYW4gdXNpbmcgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuXHQvLyBhbmQgcmVjcmVhdGluZyAoc29tZXRpbWVzIGNvbXBsZXggb3IgcmVjdXJzaXZlKSBmdW5jdGlvbiBzaWduYXR1cmVzLlxuXHQvL1xuXHQvLyBgb25gIGlzIHRvdWNoLWZyaWVuZGx5IGFuZCB3aWxsIG5vcm1hbGl6ZSB0b3VjaCBldmVudHMuXG5cdC8vXG5cdC8vIGBvbmAgYWxzbyBzdXBwb3J0cyBhIGN1c3RvbSBgY2xpY2tvZmZgIGV2ZW50LCB0byBkZXRlY3QgaWYgeW91J3ZlIGNsaWNrZWRcblx0Ly8gYW55d2hlcmUgaW4gdGhlIGRvY3VtZW50IG90aGVyIHRoYW4gdGhlIHBhc3NlZCBub2RlXG5cdC8vXG5cdC8vIFVTQUdFXG5cdC8vICAgICAgdmFyIGhhbmRsZSA9IG9uKG5vZGUsICdjbGlja29mZicsIGNhbGxiYWNrKTtcblx0Ly8gICAgICAvLyAgY2FsbGJhY2sgZmlyZXMgaWYgc29tZXRoaW5nIG90aGVyIHRoYW4gbm9kZSBpcyBjbGlja2VkXG5cdC8vXG5cdC8vIFVTQUdFXG5cdC8vICAgICAgdmFyIGhhbmRsZSA9IG9uKG5vZGUsICdtb3VzZWRvd24nLCBvblN0YXJ0KTtcblx0Ly8gICAgICBoYW5kbGUucGF1c2UoKTtcblx0Ly8gICAgICBoYW5kbGUucmVzdW1lKCk7XG5cdC8vICAgICAgaGFuZGxlLnJlbW92ZSgpO1xuXHQvL1xuXHQvLyAgYG9uYCBhbHNvIHN1cHBvcnRzIG11bHRpcGxlIGV2ZW50IHR5cGVzIGF0IG9uY2UuIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpc1xuXHQvLyAgdXNlZnVsIGZvciBoYW5kbGluZyBib3RoIGRlc2t0b3AgbW91c2VvdmVycyBhbmQgdGFibGV0IGNsaWNrczpcblx0Ly9cblx0Ly8gVVNBR0Vcblx0Ly8gICAgICB2YXIgaGFuZGxlID0gb24obm9kZSwgJ21vdXNlb3ZlcixjbGljaycsIG9uU3RhcnQpO1xuXHQvL1xuXHQvLyBgb25gIHN1cHBvcnRzIHNlbGVjdG9yIGZpbHRlcnMuIFRoZSB0YXJnZXRlZCBlbGVtZW50IHdpbGwgYmUgaW4gdGhlIGV2ZW50XG5cdC8vIGFzIGZpbHRlcmVkVGFyZ2V0XG5cdC8vXG5cdC8vIFVTQUdFXG5cdC8vICAgICAgb24obm9kZSwgJ2NsaWNrJywgJ2Rpdi50YWIgc3BhbicsIGNhbGxiYWNrKTtcblx0Ly9cblxuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gdjEuNy41XG5cblx0dHJ5e1xuXHRcdGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmVxdWlyZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcblx0XHR9XG5cdH1jYXRjaChlKXtcblx0XHRjb25zb2xlLmVycm9yKCdvbi9zcmMva2V5LXBvbHkgaXMgcmVxdWlyZWQgZm9yIHRoZSBldmVudC5rZXkgcHJvcGVydHknKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhc1doZWVsVGVzdCgpe1xuXHRcdHZhclxuXHRcdFx0aXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignVHJpZGVudCcpID4gLTEsXG5cdFx0XHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRyZXR1cm4gIFwib253aGVlbFwiIGluIGRpdiB8fCBcIndoZWVsXCIgaW4gZGl2IHx8XG5cdFx0XHQoaXNJRSAmJiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiRXZlbnRzLndoZWVsXCIsIFwiMy4wXCIpKTsgLy8gSUUgZmVhdHVyZSBkZXRlY3Rpb25cblx0fVxuXG5cdHZhclxuXHRcdElOVkFMSURfUFJPUFMsXG5cdFx0bWF0Y2hlcyxcblx0XHRoYXNXaGVlbCA9IGhhc1doZWVsVGVzdCgpLFxuXHRcdGlzV2luID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdXaW5kb3dzJyk+LTEsXG5cdFx0RkFDVE9SID0gaXNXaW4gPyAxMCA6IDAuMSxcblx0XHRYTFI4ID0gMCxcblx0XHRtb3VzZVdoZWVsSGFuZGxlO1xuXG5cblx0WydtYXRjaGVzJywgJ21hdGNoZXNTZWxlY3RvcicsICd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nXS5zb21lKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0aWYgKG5hbWUubGVuZ3RoIDwgNykgeyAvLyBwcmVmaXhcblx0XHRcdG5hbWUgKz0gJ01hdGNoZXNTZWxlY3Rvcic7XG5cdFx0fVxuXHRcdGlmIChFbGVtZW50LnByb3RvdHlwZVtuYW1lXSkge1xuXHRcdFx0bWF0Y2hlcyA9IG5hbWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBjbG9zZXN0IChlbGVtZW50LCBzZWxlY3RvciwgcGFyZW50KSB7XG5cdFx0d2hpbGUgKGVsZW1lbnQpIHtcblx0XHRcdGlmIChlbGVtZW50W21hdGNoZXNdICYmIGVsZW1lbnRbbWF0Y2hlc10oc2VsZWN0b3IpKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVsZW1lbnQgPT09IHBhcmVudCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xvc2VzdEZpbHRlciAoZWxlbWVudCwgc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGUpIHtcblx0XHRcdHJldHVybiBjbG9zZXN0KGUudGFyZ2V0LCBzZWxlY3RvciwgZWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VNdWx0aUhhbmRsZSAoaGFuZGxlcyl7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uKGgpe1xuXHRcdFx0XHRcdC8vIGFsbG93IGZvciBhIHNpbXBsZSBmdW5jdGlvbiBpbiB0aGUgbGlzdFxuXHRcdFx0XHRcdGlmKGgucmVtb3ZlKSB7XG5cdFx0XHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH1lbHNlIGlmKHR5cGVvZiBoID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHRcdGgoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRoYW5kbGVzID0gW107XG5cdFx0XHRcdHRoaXMucmVtb3ZlID0gdGhpcy5wYXVzZSA9IHRoaXMucmVzdW1lID0gZnVuY3Rpb24oKXt9O1xuXHRcdFx0fSxcblx0XHRcdHBhdXNlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRoYW5kbGVzLmZvckVhY2goZnVuY3Rpb24oaCl7IGlmKGgucGF1c2UpeyBoLnBhdXNlKCk7IH19KTtcblx0XHRcdH0sXG5cdFx0XHRyZXN1bWU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbihoKXsgaWYoaC5yZXN1bWUpeyBoLnJlc3VtZSgpOyB9fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ2xpY2tvZmYgKG5vZGUsIGNhbGxiYWNrKXtcblx0XHQvLyBpbXBvcnRhbnQgbm90ZSFcblx0XHQvLyBzdGFydHMgcGF1c2VkXG5cdFx0Ly9cblx0XHR2YXJcblx0XHRcdGhhbmRsZSxcblx0XHRcdGJIYW5kbGUgPSBvbihkb2N1bWVudC5ib2R5LCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdGlmKHRhcmdldC5ub2RlVHlwZSAhPT0gMSl7XG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYodGFyZ2V0ICYmICFub2RlLmNvbnRhaW5zKHRhcmdldCkpIHtcblx0XHRcdFx0XHRjYWxsYmFjayhldmVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0aGFuZGxlID0ge1xuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJIYW5kbGUucmVzdW1lKCk7XG5cdFx0XHRcdH0sIDEwMCk7XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0YkhhbmRsZS5wYXVzZSgpO1xuXHRcdFx0fSxcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRiSGFuZGxlLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRoYW5kbGUucGF1c2UoKTtcblxuXHRcdHJldHVybiBoYW5kbGU7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkltYWdlTG9hZCAoaW1nLCBjYWxsYmFjaykge1xuXHRcdGZ1bmN0aW9uIG9uSW1hZ2VMb2FkIChlKSB7XG5cdFx0XHRcdHZhciBoID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmKGltZy5uYXR1cmFsV2lkdGgpe1xuXHRcdFx0XHRcdFx0ZS53aWR0aCA9IGltZy5uYXR1cmFsV2lkdGg7XG5cdFx0XHRcdFx0XHRlLm5hdHVyYWxXaWR0aCA9IGltZy5uYXR1cmFsV2lkdGg7XG5cdFx0XHRcdFx0XHRlLmhlaWdodCA9IGltZy5uYXR1cmFsSGVpZ2h0O1xuXHRcdFx0XHRcdFx0ZS5uYXR1cmFsSGVpZ2h0ID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayhlKTtcblx0XHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoaCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCAxMDApO1xuXHRcdFx0aW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkltYWdlTG9hZCk7XG5cdFx0XHRpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBjYWxsYmFjayk7XG5cdFx0fVxuXHRcdGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25JbWFnZUxvYWQpO1xuXHRcdGltZy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGNhbGxiYWNrKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHt9LFxuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7fSxcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uSW1hZ2VMb2FkKTtcblx0XHRcdFx0aW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgY2FsbGJhY2spO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGdldE5vZGUoc3RyKXtcblx0XHRpZih0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJyl7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblx0XHR2YXIgbm9kZTtcblx0XHRpZigvXFwjfFxcLnxcXHMvLnRlc3Qoc3RyKSl7XG5cdFx0XHRub2RlID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKHN0cik7XG5cdFx0fWVsc2V7XG5cdFx0XHRub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RyKTtcblx0XHR9XG5cdFx0aWYoIW5vZGUpe1xuXHRcdFx0Y29uc29sZS5lcnJvcignbG9jYWxMaWIvb24gQ291bGQgbm90IGZpbmQ6Jywgc3RyKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5vZGU7XG5cdH1cblxuXHRmdW5jdGlvbiBub3JtYWxpemVXaGVlbEV2ZW50IChjYWxsYmFjayl7XG5cdFx0Ly8gbm9ybWFsaXplcyBhbGwgYnJvd3NlcnMnIGV2ZW50cyB0byBhIHN0YW5kYXJkOlxuXHRcdC8vIGRlbHRhLCB3aGVlbFksIHdoZWVsWFxuXHRcdC8vIGFsc28gYWRkcyBhY2NlbGVyYXRpb24gYW5kIGRlY2VsZXJhdGlvbiB0byBtYWtlXG5cdFx0Ly8gTWFjIGFuZCBXaW5kb3dzIGJlaGF2ZSBzaW1pbGFybHlcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSl7XG5cdFx0XHRYTFI4ICs9IEZBQ1RPUjtcblx0XHRcdHZhclxuXHRcdFx0XHRkZWx0YVkgPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgKGUud2hlZWxEZWx0YVkgfHwgZS5kZWx0YVkpKSksXG5cdFx0XHRcdGRlbHRhWCA9IE1hdGgubWF4KC0xMCwgTWF0aC5taW4oMTAsIChlLndoZWVsRGVsdGFYIHx8IGUuZGVsdGFYKSkpO1xuXG5cdFx0XHRkZWx0YVkgPSBkZWx0YVkgPD0gMCA/IGRlbHRhWSAtIFhMUjggOiBkZWx0YVkgKyBYTFI4O1xuXG5cdFx0XHRlLmRlbHRhID0gZGVsdGFZO1xuXHRcdFx0ZS53aGVlbFkgPSBkZWx0YVk7XG5cdFx0XHRlLndoZWVsWCA9IGRlbHRhWDtcblxuXHRcdFx0Y2xlYXJUaW1lb3V0KG1vdXNlV2hlZWxIYW5kbGUpO1xuXHRcdFx0bW91c2VXaGVlbEhhbmRsZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0WExSOCA9IDA7XG5cdFx0XHR9LCAzMDApO1xuXHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uIChub2RlLCBldmVudFR5cGUsIGZpbHRlciwgaGFuZGxlcil7XG5cdFx0Ly8gIFVTQUdFXG5cdFx0Ly8gICAgICB2YXIgaGFuZGxlID0gb24odGhpcy5ub2RlLCAnbW91c2Vkb3duJywgdGhpcywgJ29uU3RhcnQnKTtcblx0XHQvLyAgICAgIGhhbmRsZS5wYXVzZSgpO1xuXHRcdC8vICAgICAgaGFuZGxlLnJlc3VtZSgpO1xuXHRcdC8vICAgICAgaGFuZGxlLnJlbW92ZSgpO1xuXHRcdC8vXG5cdFx0dmFyXG5cdFx0XHRjYWxsYmFjayxcblx0XHRcdGhhbmRsZXMsXG5cdFx0XHRoYW5kbGU7XG5cblx0XHRpZigvLC8udGVzdChldmVudFR5cGUpKXtcblx0XHRcdC8vIGhhbmRsZSBtdWx0aXBsZSBldmVudCB0eXBlcywgbGlrZTpcblx0XHRcdC8vIG9uKG5vZGUsICdtb3VzZXVwLCBtb3VzZWRvd24nLCBjYWxsYmFjayk7XG5cdFx0XHQvL1xuXHRcdFx0aGFuZGxlcyA9IFtdO1xuXHRcdFx0ZXZlbnRUeXBlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihlU3RyKXtcblx0XHRcdFx0aGFuZGxlcy5wdXNoKG9uKG5vZGUsIGVTdHIudHJpbSgpLCBmaWx0ZXIsIGhhbmRsZXIpKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1ha2VNdWx0aUhhbmRsZShoYW5kbGVzKTtcblx0XHR9XG5cblx0XHRub2RlID0gZ2V0Tm9kZShub2RlKTtcblxuXHRcdGlmKGZpbHRlciAmJiBoYW5kbGVyKXtcblx0XHRcdGlmICh0eXBlb2YgZmlsdGVyID09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGZpbHRlciA9IGNsb3Nlc3RGaWx0ZXIobm9kZSwgZmlsdGVyKTtcblx0XHRcdH1cblx0XHRcdC8vIGVsc2UgaXQgaXMgYSBjdXN0b20gZnVuY3Rpb25cblx0XHRcdGNhbGxiYWNrID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IGZpbHRlcihlKTtcblx0XHRcdFx0aWYgKHJlc3VsdCkge1xuXHRcdFx0XHRcdGUuZmlsdGVyZWRUYXJnZXQgPSByZXN1bHQ7XG5cdFx0XHRcdFx0aGFuZGxlcihlLCByZXN1bHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1lbHNle1xuXHRcdFx0Y2FsbGJhY2sgPSBmaWx0ZXIgfHwgaGFuZGxlcjtcblx0XHR9XG5cblx0XHRpZihldmVudFR5cGUgPT09ICdjbGlja29mZicpe1xuXHRcdFx0Ly8gY3VzdG9tIC0gdXNlZCBmb3IgcG9wdXBzICduIHN0dWZmXG5cdFx0XHRyZXR1cm4gb25DbGlja29mZihub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50VHlwZSA9PT0gJ2xvYWQnICYmIG5vZGUubG9jYWxOYW1lID09PSAnaW1nJyl7XG5cdFx0XHRyZXR1cm4gb25JbWFnZUxvYWQobm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdGlmKGV2ZW50VHlwZSA9PT0gJ3doZWVsJyl7XG5cdFx0XHQvLyBtb3VzZXdoZWVsIGV2ZW50cywgbmF0Y2hcblx0XHRcdGlmKGhhc1doZWVsKXtcblx0XHRcdFx0Ly8gcGFzcyB0aHJvdWdoLCBidXQgZmlyc3QgY3VycnkgY2FsbGJhY2sgdG8gd2hlZWwgZXZlbnRzXG5cdFx0XHRcdGNhbGxiYWNrID0gbm9ybWFsaXplV2hlZWxFdmVudChjYWxsYmFjayk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0Ly8gb2xkIEZpcmVmb3gsIG9sZCBJRSwgQ2hyb21lXG5cdFx0XHRcdHJldHVybiBtYWtlTXVsdGlIYW5kbGUoW1xuXHRcdFx0XHRcdG9uKG5vZGUsICdET01Nb3VzZVNjcm9sbCcsIG5vcm1hbGl6ZVdoZWVsRXZlbnQoY2FsbGJhY2spKSxcblx0XHRcdFx0XHRvbihub2RlLCAnbW91c2V3aGVlbCcsIG5vcm1hbGl6ZVdoZWVsRXZlbnQoY2FsbGJhY2spKVxuXHRcdFx0XHRdKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuXG5cdFx0aGFuZGxlID0ge1xuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdFx0bm9kZSA9IGNhbGxiYWNrID0gbnVsbDtcblx0XHRcdFx0dGhpcy5yZW1vdmUgPSB0aGlzLnBhdXNlID0gdGhpcy5yZXN1bWUgPSBmdW5jdGlvbigpe307XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG5cdFx0XHR9LFxuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gaGFuZGxlO1xuXHR9XG5cblx0b24ub25jZSA9IGZ1bmN0aW9uIChub2RlLCBldmVudFR5cGUsIGZpbHRlciwgY2FsbGJhY2spe1xuXHRcdHZhciBoO1xuXHRcdGlmKGZpbHRlciAmJiBjYWxsYmFjayl7XG5cdFx0XHRoID0gb24obm9kZSwgZXZlbnRUeXBlLCBmaWx0ZXIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y2FsbGJhY2suYXBwbHkod2luZG93LCBhcmd1bWVudHMpO1xuXHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRoID0gb24obm9kZSwgZXZlbnRUeXBlLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZpbHRlci5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG5cdFx0XHRcdGgucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGg7XG5cdH07XG5cblx0SU5WQUxJRF9QUk9QUyA9IHtcblx0XHRpc1RydXN0ZWQ6MVxuXHR9O1xuXHRmdW5jdGlvbiBtaXgob2JqZWN0LCB2YWx1ZSl7XG5cdFx0aWYoIXZhbHVlKXtcblx0XHRcdHJldHVybiBvYmplY3Q7XG5cdFx0fVxuXHRcdGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0aWYoIUlOVkFMSURfUFJPUFNba2V5XSkge1xuXHRcdFx0XHRcdG9iamVjdFtrZXldID0gdmFsdWVba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHRvYmplY3QudmFsdWUgPSB2YWx1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdDtcblx0fVxuXG5cdG9uLmVtaXQgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCB2YWx1ZSkge1xuXHRcdG5vZGUgPSBnZXROb2RlKG5vZGUpO1xuXHRcdHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0ZXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgdHJ1ZSk7IC8vIGV2ZW50IHR5cGUsIGJ1YmJsaW5nLCBjYW5jZWxhYmxlXG5cdFx0cmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChtaXgoZXZlbnQsIHZhbHVlKSk7XG5cdH07XG5cblx0b24uZmlyZSA9IGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG5cdFx0dmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG5cdFx0ZXZlbnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgISFidWJibGVzLCB0cnVlLCBldmVudERldGFpbCk7IC8vIGV2ZW50IHR5cGUsIGJ1YmJsaW5nLCBjYW5jZWxhYmxlXG5cdFx0cmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH07XG5cblx0b24uaXNBbHBoYU51bWVyaWMgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdFx0aWYoc3RyLmxlbmd0aCA+IDEpeyByZXR1cm4gZmFsc2U7IH1cblx0XHRpZihzdHIgPT09ICcgJyl7IHJldHVybiBmYWxzZTsgfVxuXHRcdGlmKCFpc05hTihOdW1iZXIoc3RyKSkpeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdHZhciBjb2RlID0gc3RyLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcblx0XHRyZXR1cm4gY29kZSA+PSA5NyAmJiBjb2RlIDw9IDEyMjtcblx0fTtcblxuXHRvbi5tYWtlTXVsdGlIYW5kbGUgPSBtYWtlTXVsdGlIYW5kbGU7XG5cdG9uLmNsb3Nlc3QgPSBjbG9zZXN0O1xuXHRvbi5tYXRjaGVzID0gbWF0Y2hlcztcblxuXHRyZXR1cm4gb247XG5cbn0pKTtcbiIsIi8vIENsdWIgQUpBWCBHZW5lcmFsIFB1cnBvc2UgQ29kZVxuLy9cbi8vIFJhbmRvbWl6ZXJcbi8vXG4vLyBhdXRob3I6XG4vLyAgICAgICAgICAgICAgTWlrZSBXaWxjb3hcbi8vIHNpdGU6XG4vLyAgICAgICAgICAgICAgaHR0cDovL2NsdWJhamF4Lm9yZ1xuLy8gc3VwcG9ydDpcbi8vICAgICAgICAgICAgICBodHRwOi8vZ3JvdXBzLmdvb2dsZS5jb20vZ3JvdXAvY2x1YmFqYXhcbi8vXG4vLyBjbHViYWpheC5sYW5nLnJhbmRcbi8vXG4vLyAgICAgIERFU0NSSVBUSU9OOlxuLy8gICAgICAgICAgICAgIEEgcmFuZG9taXplciBsaWJyYXJ5IHRoYXQncyBncmVhdCBmb3IgcHJvZHVjaW5nIG1vY2sgZGF0YS5cbi8vICAgICAgICAgICAgICBBbGxvd3MgZG96ZW5zIG9mIHdheXMgdG8gcmFuZG9taXplIG51bWJlcnMsIHN0cmluZ3MsIHdvcmRzLFxuLy8gICAgICAgICAgICAgIHNlbnRlbmNlcywgYW5kIGRhdGVzLiBJbmNsdWRlcyB0aW55IGxpYnJhcmllcyBvZiB0aGUgbW9zdFxuLy8gICAgICAgICAgICAgIGNvbW1vbmx5IHVzZWQgd29yZHMgKGluIG9yZGVyKSwgdGhlIG1vc3QgY29tbW9ubHkgdXNlZCBsZXR0ZXJzXG4vLyAgICAgICAgICAgICAgKGluIG9yZGVyKSBhbmQgcGVyc29uYWwgbmFtZXMgdGhhdCBjYW4gYmUgdXNlZCBhcyBmaXJzdCBvciBsYXN0LlxuLy8gICAgICAgICAgICAgIEZvciBtYWtpbmcgc2VudGVuY2VzLCBcInd1cmRzXCIgYXJlIHVzZWQgLSB3b3JkcyB3aXRoIHNjcmFtYmxlZCB2b3dlbHNcbi8vICAgICAgICAgICAgICBzbyB0aGV5IGFyZW4ndCBhY3R1YWwgd29yZHMsIGJ1dCBsb29rIG1vcmUgbGlrZSBsb3JlbSBpcHN1bS4gQ2hhbmdlIHRoZVxuLy8gICAgICAgICAgICAgIHByb3BlcnR5IHJlYWwgdG8gdHJ1ZSB0byB1c2UgXCJ3b3Jkc1wiIGluc3RlYWQgb2YgXCJ3dXJkc1wiIChpdCBjYW5cbi8vICAgICAgICAgICAgICBhbHNvIHByb2R1Y2UgaHVtb3JvdXMgcmVzdWx0cykuXG5cbi8vICAgICAgVVNBR0U6XG4vLyAgICAgICAgICAgICAgaW5jbHVkZSBmaWxlOlxuLy8gICAgICAgICAgICAgICAgICAgICAgPHNjcmlwdCBzcmM9XCJjbHViYWpheC9sYW5nL3JhbmQuanNcIj48L3NjcmlwdD5cbi8vXG4vLyBURVNUUzpcbi8vICAgICAgICAgICAgICBTZWUgdGVzdHMvcmFuZC5odG1sXG4vL1xuLyogVU1ELmRlZmluZSAqLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCl7IGRlZmluZShbXSwgZmFjdG9yeSk7IH1lbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jyl7IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpOyB9ZWxzZXsgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpOyB3aW5kb3cucmFuZCA9IGZhY3RvcnkoKTsgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdFxuXHR2YXJcblx0XHRyYW5kLFxuXHRcdGNpdHlTdGF0ZXMgPSBbXCJOZXcgWW9yaywgTmV3IFlvcmtcIiwgXCJMb3MgQW5nZWxlcywgQ2FsaWZvcm5pYVwiLCBcIkNoaWNhZ28sIElsbGlub2lzXCIsIFwiSG91c3RvbiwgVGV4YXNcIiwgXCJQaGlsYWRlbHBoaWEsIFBlbm5zeWx2YW5pYVwiLCBcIlBob2VuaXgsIEFyaXpvbmFcIiwgXCJTYW4gRGllZ28sIENhbGlmb3JuaWFcIiwgXCJTYW4gQW50b25pbywgVGV4YXNcIiwgXCJEYWxsYXMsIFRleGFzXCIsIFwiRGV0cm9pdCwgTWljaGlnYW5cIiwgXCJTYW4gSm9zZSwgQ2FsaWZvcm5pYVwiLCBcIkluZGlhbmFwb2xpcywgSW5kaWFuYVwiLCBcIkphY2tzb252aWxsZSwgRmxvcmlkYVwiLCBcIlNhbiBGcmFuY2lzY28sIENhbGlmb3JuaWFcIiwgXCJDb2x1bWJ1cywgT2hpb1wiLCBcIkF1c3RpbiwgVGV4YXNcIiwgXCJNZW1waGlzLCBUZW5uZXNzZWVcIiwgXCJCYWx0aW1vcmUsIE1hcnlsYW5kXCIsIFwiQ2hhcmxvdHRlLCBOb3J0aCBDYXJvbGluYVwiLCBcIkZvcnQgV29ydGgsIFRleGFzXCIsIFwiQm9zdG9uLCBNYXNzYWNodXNldHRzXCIsIFwiTWlsd2F1a2VlLCBXaXNjb25zaW5cIiwgXCJFbCBQYXNvLCBUZXhhc1wiLCBcIldhc2hpbmd0b24sIERpc3RyaWN0IG9mIENvbHVtYmlhXCIsIFwiTmFzaHZpbGxlLURhdmlkc29uLCBUZW5uZXNzZWVcIiwgXCJTZWF0dGxlLCBXYXNoaW5ndG9uXCIsIFwiRGVudmVyLCBDb2xvcmFkb1wiLCBcIkxhcyBWZWdhcywgTmV2YWRhXCIsIFwiUG9ydGxhbmQsIE9yZWdvblwiLCBcIk9rbGFob21hIENpdHksIE9rbGFob21hXCIsIFwiVHVjc29uLCBBcml6b25hXCIsIFwiQWxidXF1ZXJxdWUsIE5ldyBNZXhpY29cIiwgXCJBdGxhbnRhLCBHZW9yZ2lhXCIsIFwiTG9uZyBCZWFjaCwgQ2FsaWZvcm5pYVwiLCBcIkthbnNhcyBDaXR5LCBNaXNzb3VyaVwiLCBcIkZyZXNubywgQ2FsaWZvcm5pYVwiLCBcIk5ldyBPcmxlYW5zLCBMb3Vpc2lhbmFcIiwgXCJDbGV2ZWxhbmQsIE9oaW9cIiwgXCJTYWNyYW1lbnRvLCBDYWxpZm9ybmlhXCIsIFwiTWVzYSwgQXJpem9uYVwiLCBcIlZpcmdpbmlhIEJlYWNoLCBWaXJnaW5pYVwiLCBcIk9tYWhhLCBOZWJyYXNrYVwiLCBcIkNvbG9yYWRvIFNwcmluZ3MsIENvbG9yYWRvXCIsIFwiT2FrbGFuZCwgQ2FsaWZvcm5pYVwiLCBcIk1pYW1pLCBGbG9yaWRhXCIsIFwiVHVsc2EsIE9rbGFob21hXCIsIFwiTWlubmVhcG9saXMsIE1pbm5lc290YVwiLCBcIkhvbm9sdWx1LCBIYXdhaWlcIiwgXCJBcmxpbmd0b24sIFRleGFzXCIsIFwiV2ljaGl0YSwgS2Fuc2FzXCIsIFwiU3QuIExvdWlzLCBNaXNzb3VyaVwiLCBcIlJhbGVpZ2gsIE5vcnRoIENhcm9saW5hXCIsIFwiU2FudGEgQW5hLCBDYWxpZm9ybmlhXCIsIFwiQ2luY2lubmF0aSwgT2hpb1wiLCBcIkFuYWhlaW0sIENhbGlmb3JuaWFcIiwgXCJUYW1wYSwgRmxvcmlkYVwiLCBcIlRvbGVkbywgT2hpb1wiLCBcIlBpdHRzYnVyZ2gsIFBlbm5zeWx2YW5pYVwiLCBcIkF1cm9yYSwgQ29sb3JhZG9cIiwgXCJCYWtlcnNmaWVsZCwgQ2FsaWZvcm5pYVwiLCBcIlJpdmVyc2lkZSwgQ2FsaWZvcm5pYVwiLCBcIlN0b2NrdG9uLCBDYWxpZm9ybmlhXCIsIFwiQ29ycHVzIENocmlzdGksIFRleGFzXCIsIFwiTGV4aW5ndG9uLUZheWV0dGUsIEtlbnR1Y2t5XCIsIFwiQnVmZmFsbywgTmV3IFlvcmtcIiwgXCJTdC4gUGF1bCwgTWlubmVzb3RhXCIsIFwiQW5jaG9yYWdlLCBBbGFza2FcIiwgXCJOZXdhcmssIE5ldyBKZXJzZXlcIiwgXCJQbGFubywgVGV4YXNcIiwgXCJGb3J0IFdheW5lLCBJbmRpYW5hXCIsIFwiU3QuIFBldGVyc2J1cmcsIEZsb3JpZGFcIiwgXCJHbGVuZGFsZSwgQXJpem9uYVwiLCBcIkxpbmNvbG4sIE5lYnJhc2thXCIsIFwiTm9yZm9saywgVmlyZ2luaWFcIiwgXCJKZXJzZXkgQ2l0eSwgTmV3IEplcnNleVwiLCBcIkdyZWVuc2Jvcm8sIE5vcnRoIENhcm9saW5hXCIsIFwiQ2hhbmRsZXIsIEFyaXpvbmFcIiwgXCJCaXJtaW5naGFtLCBBbGFiYW1hXCIsIFwiSGVuZGVyc29uLCBOZXZhZGFcIiwgXCJTY290dHNkYWxlLCBBcml6b25hXCIsIFwiTm9ydGggSGVtcHN0ZWFkLCBOZXcgWW9ya1wiLCBcIk1hZGlzb24sIFdpc2NvbnNpblwiLCBcIkhpYWxlYWgsIEZsb3JpZGFcIiwgXCJCYXRvbiBSb3VnZSwgTG91aXNpYW5hXCIsIFwiQ2hlc2FwZWFrZSwgVmlyZ2luaWFcIiwgXCJPcmxhbmRvLCBGbG9yaWRhXCIsIFwiTHViYm9jaywgVGV4YXNcIiwgXCJHYXJsYW5kLCBUZXhhc1wiLCBcIkFrcm9uLCBPaGlvXCIsIFwiUm9jaGVzdGVyLCBOZXcgWW9ya1wiLCBcIkNodWxhIFZpc3RhLCBDYWxpZm9ybmlhXCIsIFwiUmVubywgTmV2YWRhXCIsIFwiTGFyZWRvLCBUZXhhc1wiLCBcIkR1cmhhbSwgTm9ydGggQ2Fyb2xpbmFcIiwgXCJNb2Rlc3RvLCBDYWxpZm9ybmlhXCIsIFwiSHVudGluZ3RvbiwgTmV3IFlvcmtcIiwgXCJNb250Z29tZXJ5LCBBbGFiYW1hXCIsIFwiQm9pc2UsIElkYWhvXCIsIFwiQXJsaW5ndG9uLCBWaXJnaW5pYVwiLCBcIlNhbiBCZXJuYXJkaW5vLCBDYWxpZm9ybmlhXCJdLFxuXHRcdHN0cmVldFN1ZmZpeGVzID0gJ1JvYWQsRHJpdmUsQXZlbnVlLEJsdmQsTGFuZSxTdHJlZXQsV2F5LENpcmNsZScuc3BsaXQoJywnKSxcblx0XHRzdHJlZXRzID0gXCJGaXJzdCxGb3VydGgsUGFyayxGaWZ0aCxNYWluLFNpeHRoLE9hayxTZXZlbnRoLFBpbmUsTWFwbGUsQ2VkYXIsRWlnaHRoLEVsbSxWaWV3LFdhc2hpbmd0b24sTmludGgsTGFrZSxIaWxsLEhpZ2gsU3RhdGlvbixNYWluLFBhcmssQ2h1cmNoLENodXJjaCxMb25kb24sVmljdG9yaWEsR3JlZW4sTWFub3IsQ2h1cmNoLFBhcmssVGhlIENyZXNjZW50LFF1ZWVucyxOZXcsR3JhbmdlLEtpbmdzLEtpbmdzd2F5LFdpbmRzb3IsSGlnaGZpZWxkLE1pbGwsQWxleGFuZGVyLFlvcmssU3QuIEpvaG5cXCdzLE1haW4sQnJvYWR3YXksS2luZyxUaGUgR3JlZW4sU3ByaW5nZmllbGQsR2VvcmdlLFBhcmssVmljdG9yaWEsQWxiZXJ0LFF1ZWVuc3dheSxOZXcsUXVlZW4sV2VzdCxOb3J0aCxNYW5jaGVzdGVyLFRoZSBHcm92ZSxSaWNobW9uZCxHcm92ZSxTb3V0aCxTY2hvb2wsTm9ydGgsU3RhbmxleSxDaGVzdGVyLE1pbGwsXCIuc3BsaXQoJywnKSxcblx0XHRzdGF0ZXMgPSBbXCJBbGFiYW1hXCIsIFwiQWxhc2thXCIsIFwiQW1lcmljYW4gU2Ftb2FcIiwgXCJBcml6b25hXCIsIFwiQXJrYW5zYXNcIiwgXCJBcm1lZCBGb3JjZXMgRXVyb3BlXCIsIFwiQXJtZWQgRm9yY2VzIFBhY2lmaWNcIiwgXCJBcm1lZCBGb3JjZXMgdGhlIEFtZXJpY2FzXCIsIFwiQ2FsaWZvcm5pYVwiLCBcIkNvbG9yYWRvXCIsIFwiQ29ubmVjdGljdXRcIiwgXCJEZWxhd2FyZVwiLCBcIkRpc3RyaWN0IG9mIENvbHVtYmlhXCIsIFwiRmVkZXJhdGVkIFN0YXRlcyBvZiBNaWNyb25lc2lhXCIsIFwiRmxvcmlkYVwiLCBcIkdlb3JnaWFcIiwgXCJHdWFtXCIsIFwiSGF3YWlpXCIsIFwiSWRhaG9cIiwgXCJJbGxpbm9pc1wiLCBcIkluZGlhbmFcIiwgXCJJb3dhXCIsIFwiS2Fuc2FzXCIsIFwiS2VudHVja3lcIiwgXCJMb3Vpc2lhbmFcIiwgXCJNYWluZVwiLCBcIk1hcnNoYWxsIElzbGFuZHNcIiwgXCJNYXJ5bGFuZFwiLCBcIk1hc3NhY2h1c2V0dHNcIiwgXCJNaWNoaWdhblwiLCBcIk1pbm5lc290YVwiLCBcIk1pc3Npc3NpcHBpXCIsIFwiTWlzc291cmlcIiwgXCJNb250YW5hXCIsIFwiTmVicmFza2FcIiwgXCJOZXZhZGFcIiwgXCJOZXcgSGFtcHNoaXJlXCIsIFwiTmV3IEplcnNleVwiLCBcIk5ldyBNZXhpY29cIiwgXCJOZXcgWW9ya1wiLCBcIk5vcnRoIENhcm9saW5hXCIsIFwiTm9ydGggRGFrb3RhXCIsIFwiTm9ydGhlcm4gTWFyaWFuYSBJc2xhbmRzXCIsIFwiT2hpb1wiLCBcIk9rbGFob21hXCIsIFwiT3JlZ29uXCIsIFwiUGVubnN5bHZhbmlhXCIsIFwiUHVlcnRvIFJpY29cIiwgXCJSaG9kZSBJc2xhbmRcIiwgXCJTb3V0aCBDYXJvbGluYVwiLCBcIlNvdXRoIERha290YVwiLCBcIlRlbm5lc3NlZVwiLCBcIlRleGFzXCIsIFwiVXRhaFwiLCBcIlZlcm1vbnRcIiwgXCJWaXJnaW4gSXNsYW5kcywgVS5TLlwiLCBcIlZpcmdpbmlhXCIsIFwiV2FzaGluZ3RvblwiLCBcIldlc3QgVmlyZ2luaWFcIiwgXCJXaXNjb25zaW5cIiwgXCJXeW9taW5nXCJdLFxuXHRcdHN0YXRlQWJiciA9IFtcIkFMXCIsIFwiQUtcIiwgXCJBU1wiLCBcIkFaXCIsIFwiQVJcIiwgXCJBRVwiLCBcIkFQXCIsIFwiQUFcIiwgXCJDQVwiLCBcIkNPXCIsIFwiQ1RcIiwgXCJERVwiLCBcIkRDXCIsIFwiRk1cIiwgXCJGTFwiLCBcIkdBXCIsIFwiR1VcIiwgXCJISVwiLCBcIklEXCIsIFwiSUxcIiwgXCJJTlwiLCBcIklBXCIsIFwiS1NcIiwgXCJLWVwiLCBcIkxBXCIsIFwiTUVcIiwgXCJNSFwiLCBcIk1EXCIsIFwiTUFcIiwgXCJNSVwiLCBcIk1OXCIsIFwiTVNcIiwgXCJNT1wiLCBcIk1UXCIsIFwiTkVcIiwgXCJOVlwiLCBcIk5IXCIsIFwiTkpcIiwgXCJOTVwiLCBcIk5ZXCIsIFwiTkNcIiwgXCJORFwiLCBcIk1QXCIsIFwiT0hcIiwgXCJPS1wiLCBcIk9SXCIsIFwiUEFcIiwgXCJQUlwiLCBcIlJJXCIsIFwiU0NcIiwgXCJTRFwiLCBcIlROXCIsIFwiVFhcIiwgXCJVVFwiLCBcIlZUXCIsIFwiVklcIiwgXCJWQVwiLCBcIldBXCIsIFwiV1ZcIiwgXCJXSVwiLCBcIldZXCJdLFxuXHRcdG5hbWVzID0gXCJBYnJhaGFtLEFsYmVydCxBbGV4aXMsQWxsZW4sQWxsaXNvbixBbGV4YW5kZXIsQW1vcyxBbnRvbixBcm5vbGQsQXJ0aHVyLEFzaGxleSxCYXJyeSxCZWxpbmRhLEJlbGxlLEJlbmphbWluLEJlbm55LEJlcm5hcmQsQnJhZGxleSxCcmV0dCxUeSxCcml0dGFueSxCcnVjZSxCcnlhbnQsQ2FycmV5LENhcm1lbixDYXJyb2xsLENoYXJsZXMsQ2hyaXN0b3BoZXIsQ2hyaXN0aWUsQ2xhcmssQ2xheSxDbGlmZixDb25yYWQsQ3JhaWcsQ3J5c3RhbCxDdXJ0aXMsRGFtb24sRGFuYSxEYXZpZCxEZWFuLERlZSxEZW5uaXMsRGVubnksRGljayxEb3VnbGFzLER1bmNhbixEd2lnaHQsRHlsYW4sRWRkeSxFbGxpb3QsRXZlcmV0dCxGYXllLEZyYW5jaXMsRnJhbmssRnJhbmtsaW4sR2FydGgsR2F5bGUsR2VvcmdlLEdpbGJlcnQsR2xlbm4sR29yZG9uLEdyYWNlLEdyYWhhbSxHcmFudCxHcmVnb3J5LEdvdHRmcmllZCxHdXksSGFycmlzb24sSGFycnksSGFydmV5LEhlbnJ5LEhlcmJlcnQsSGlsbGFyeSxIb2xseSxIb3BlLEhvd2FyZCxIdWdvLEh1bXBocmV5LElydmluZyxJc2FhayxKYW5pcyxKYXksSm9lbCxKb2huLEpvcmRhbixKb3ljZSxKdWFuLEp1ZGQsSnVsaWEsS2F5ZSxLZWxseSxLZWl0aCxMYXVyaWUsTGF3cmVuY2UsTGVlLExlaWdoLExlb25hcmQsTGVzbGllLExlc3RlcixMZXdpcyxMaWxseSxMbG95ZCxHZW9yZ2UsTG91aXMsTG91aXNlLEx1Y2FzLEx1dGhlcixMeW5uLE1hY2ssTWFyaWUsTWFyc2hhbGwsTWFydGluLE1hcnZpbixNYXksTWljaGFlbCxNaWNoZWxsZSxNaWx0b24sTWlyYW5kYSxNaXRjaGVsbCxNb3JnYW4sTW9ycmlzLE11cnJheSxOZXd0b24sTm9ybWFuLE93ZW4sUGF0cmljayxQYXR0aSxQYXVsLFBlbm55LFBlcnJ5LFByZXN0b24sUXVpbm4sUmF5LFJpY2gsUmljaGFyZCxSb2xhbmQsUm9zZSxSb3NzLFJveSxSdWJ5LFJ1c3NlbGwsUnV0aCxSeWFuLFNjb3R0LFNleW1vdXIsU2hhbm5vbixTaGF3bixTaGVsbGV5LFNoZXJtYW4sU2ltb24sU3RhbmxleSxTdGV3YXJ0LFN1c2FubixTeWRuZXksVGF5bG9yLFRob21hcyxUb2RkLFRvbSxUcmFjeSxUcmF2aXMsVHlsZXIsVHlsZXIsVmluY2VudCxXYWxsYWNlLFdhbHRlcixQZW5uLFdheW5lLFdpbGwsV2lsbGFyZCxXaWxsaXNcIixcblx0XHR3b3JkcyA9IFwidGhlLG9mLGFuZCxhLHRvLGluLGlzLHlvdSx0aGF0LGl0LGhlLGZvcix3YXMsb24sYXJlLGFzLHdpdGgsaGlzLHRoZXksYXQsYmUsdGhpcyxmcm9tLEksaGF2ZSxvcixieSxvbmUsaGFkLG5vdCxidXQsd2hhdCxhbGwsd2VyZSx3aGVuLHdlLHRoZXJlLGNhbixhbix5b3VyLHdoaWNoLHRoZWlyLHNhaWQsaWYsZG8sd2lsbCxlYWNoLGFib3V0LGhvdyx1cCxvdXQsdGhlbSx0aGVuLHNoZSxtYW55LHNvbWUsc28sdGhlc2Usd291bGQsb3RoZXIsaW50byxoYXMsbW9yZSxoZXIsdHdvLGxpa2UsaGltLHNlZSx0aW1lLGNvdWxkLG5vLG1ha2UsdGhhbixmaXJzdCxiZWVuLGl0cyx3aG8sbm93LHBlb3BsZSxteSxtYWRlLG92ZXIsZGlkLGRvd24sb25seSx3YXksZmluZCx1c2UsbWF5LHdhdGVyLGxvbmcsbGl0dGxlLHZlcnksYWZ0ZXIsd29yZHMsY2FsbGVkLGp1c3Qsd2hlcmUsbW9zdCxrbm93LGdldCx0aHJvdWdoLGJhY2ssbXVjaCxiZWZvcmUsZ28sZ29vZCxuZXcsd3JpdGUsb3V0LHVzZWQsbWUsbWFuLHRvbyxhbnksZGF5LHNhbWUscmlnaHQsbG9vayx0aGluayxhbHNvLGFyb3VuZCxhbm90aGVyLGNhbWUsY29tZSx3b3JrLHRocmVlLHdvcmQsbXVzdCxiZWNhdXNlLGRvZXMscGFydCxldmVuLHBsYWNlLHdlbGwsc3VjaCxoZXJlLHRha2Usd2h5LHRoaW5ncyxoZWxwLHB1dCx5ZWFycyxkaWZmZXJlbnQsYXdheSxhZ2FpbixvZmYsd2VudCxvbGQsbnVtYmVyLGdyZWF0LHRlbGwsbWVuLHNheSxzbWFsbCxldmVyeSxmb3VuZCxzdGlsbCxiZXR3ZWVuLG5hbWUsc2hvdWxkLGhvbWUsYmlnLGdpdmUsYWlyLGxpbmUsc2V0LG93bix1bmRlcixyZWFkLGxhc3QsbmV2ZXIsdXMsbGVmdCxlbmQsYWxvbmcsd2hpbGUsbWlnaHQsbmV4dCxzb3VuZCxiZWxvdyxzYXcsc29tZXRoaW5nLHRob3VnaHQsYm90aCxmZXcsdGhvc2UsYWx3YXlzLGxvb2tlZCxzaG93LGxhcmdlLG9mdGVuLHRvZ2V0aGVyLGFza2VkLGhvdXNlLGRvbid0LHdvcmxkLGdvaW5nLHdhbnQsc2Nob29sLGltcG9ydGFudCx1bnRpbCxmb3JtLGZvb2Qsa2VlcCxjaGlsZHJlbixmZWV0LGxhbmQsc2lkZSx3aXRob3V0LGJveSxvbmNlLGFuaW1hbHMsbGlmZSxlbm91Z2gsdG9vayxzb21ldGltZXMsZm91cixoZWFkLGFib3ZlLGtpbmQsYmVnYW4sYWxtb3N0LGxpdmUscGFnZSxnb3QsZWFydGgsbmVlZCxmYXIsaGFuZCxoaWdoLHllYXIsbW90aGVyLGxpZ2h0LHBhcnRzLGNvdW50cnksZmF0aGVyLGxldCxuaWdodCxmb2xsb3dpbmcscGljdHVyZSxiZWluZyxzdHVkeSxzZWNvbmQsZXllcyxzb29uLHRpbWVzLHN0b3J5LGJveXMsc2luY2Usd2hpdGUsZGF5cyxldmVyLHBhcGVyLGhhcmQsbmVhcixzZW50ZW5jZSxiZXR0ZXIsYmVzdCxhY3Jvc3MsZHVyaW5nLHRvZGF5LG90aGVycyxob3dldmVyLHN1cmUsbWVhbnMsa25ldyxpdHMsdHJ5LHRvbGQseW91bmcsbWlsZXMsc3VuLHdheXMsdGhpbmcsd2hvbGUsaGVhcixleGFtcGxlLGhlYXJkLHNldmVyYWwsY2hhbmdlLGFuc3dlcixyb29tLHNlYSxhZ2FpbnN0LHRvcCx0dXJuZWQsbGVhcm4scG9pbnQsY2l0eSxwbGF5LHRvd2FyZCxmaXZlLHVzaW5nLGhpbXNlbGYsdXN1YWxseVwiLFxuXHRcdGxldHRlcnMgPSAoXCJldGFvbmlzcmhsZGNtdWZwZ3d5YnZranhxelwiKS5zcGxpdChcIlwiKSxcblx0XHRzaXRlcyA9IFwiR29vZ2xlLEZhY2Vib29rLFlvdVR1YmUsWWFob28sTGl2ZSxCaW5nLFdpa2lwZWRpYSxCbG9nZ2VyLE1TTixUd2l0dGVyLFdvcmRwcmVzcyxNeVNwYWNlLE1pY3Jvc29mdCxBbWF6b24sZUJheSxMaW5rZWRJbixmbGlja3IsQ3JhaWdzbGlzdCxSYXBpZHNoYXJlLENvbmR1aXQsSU1EQixCQkMsR28sQU9MLERvdWJsZWNsaWNrLEFwcGxlLEJsb2dzcG90LE9ya3V0LFBob3RvYnVja2V0LEFzayxDTk4sQWRvYmUsQWJvdXQsbWVkaWFmaXJlLENORVQsRVNQTixJbWFnZVNoYWNrLExpdmVKb3VybmFsLE1lZ2F1cGxvYWQsTWVnYXZpZGVvLEhvdGZpbGUsUGF5UGFsLE5ZVGltZXMsR2xvYm8sQWxpYmFiYSxHb0RhZGR5LERldmlhbnRBcnQsUmVkaWZmLERhaWx5TW90aW9uLERpZ2csV2VhdGhlcixuaW5nLFBhcnR5UG9rZXIsZUhvdyxEb3dubG9hZCxBbnN3ZXJzLFR3aXRQaWMsTmV0ZmxpeCxUaW55cGljLFNvdXJjZWZvcmdlLEh1bHUsQ29tY2FzdCxBcmNoaXZlLERlbGwsU3R1bWJsZXVwb24sSFAsRm94TmV3cyxNZXRhY2FmZSxWaW1lbyxTa3lwZSxDaGFzZSxSZXV0ZXJzLFdTSixZZWxwLFJlZGRpdCxHZW9jaXRpZXMsVVNQUyxVUFMsVXBsb2FkLFRlY2hDcnVuY2gsUG9nbyxQYW5kb3JhLExBVGltZXMsVVNBVG9kYXksSUJNLEFsdGFWaXN0YSxNYXRjaCxNb25zdGVyLEpvdFNwb3QsQmV0dGVyVmlkZW8sQ2x1YkFKQVgsTmV4cGxvcmUsS2F5YWssU2xhc2hkb3RcIjtcblx0XG5cdHJhbmQgPSB7XG5cdFx0cmVhbDpmYWxzZSxcblx0XHR3b3Jkczp3b3Jkcy5zcGxpdChcIixcIiksXG5cdFx0d3VyZHM6W10sXG5cdFx0bmFtZXM6bmFtZXMuc3BsaXQoXCIsXCIpLFxuXHRcdGxldHRlcnM6bGV0dGVycyxcblx0XHRzaXRlczpzaXRlcy5zcGxpdChcIixcIiksXG5cblx0XHR0b0FycmF5OiBmdW5jdGlvbih0aGluZyl7XG5cdFx0XHR2YXJcblx0XHRcdFx0bm0sIGksXG5cdFx0XHRcdGEgPSBbXTtcblxuXHRcdFx0aWYodHlwZW9mKHRoaW5nKSA9PT0gXCJvYmplY3RcIiAmJiAhKCEhdGhpbmcucHVzaCB8fCAhIXRoaW5nLml0ZW0pKXtcblx0XHRcdFx0Zm9yKG5tIGluIHRoaW5nKXsgaWYodGhpbmcuaGFzT3duUHJvcGVydHkobm0pKXthLnB1c2godGhpbmdbbm1dKTt9IH1cblx0XHRcdFx0dGhpbmcgPSBhO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0eXBlb2YodGhpbmcpID09PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0aWYoL1xcLi8udGVzdCh0aGluZykpe1xuXHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRcdHRoaW5nLnBvcCgpO1xuXHRcdFx0XHRcdGkgPSB0aGluZy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0XHRcdHRoaW5nW2ldID0gdGhpcy50cmltKHRoaW5nW2ldKSArIFwiLlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2UgaWYoLywvLnRlc3QodGhpbmcpKXtcblx0XHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZigvXFxzLy50ZXN0KHRoaW5nKSl7XG5cdFx0XHRcdFx0XHR0aGluZyA9IHRoaW5nLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR0aGluZyA9IHRoaW5nLnNwbGl0KFwiXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpbmc7IC8vQXJyYXlcblx0XHR9LFxuXG5cdFx0dHJpbTogZnVuY3Rpb24ocyl7IC8vIHRoYW5rcyB0byBEb2pvOlxuXHRcdFx0cmV0dXJuIFN0cmluZy5wcm90b3R5cGUudHJpbSA/IHMudHJpbSgpIDpcblx0XHRcdHMucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG5cdFx0fSxcblxuXHRcdHBhZDogZnVuY3Rpb24obiwgYW10LCBjaHIpe1xuXHRcdFx0XHR2YXIgYyA9IGNociB8fCBcIjBcIjsgYW10ID0gYW10IHx8IDI7XG5cdFx0XHRcdHJldHVybiAoYytjK2MrYytjK2MrYytjK2MrYytuKS5zbGljZSgtYW10KTtcblx0XHR9LFxuXG5cdFx0Y2FwOiBmdW5jdGlvbih3KXtcblx0XHRcdHJldHVybiB3LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdy5zdWJzdHJpbmcoMSk7XG5cdFx0fSxcblxuXHRcdHdlaWdodDogZnVuY3Rpb24obiwgZXhwKXtcblx0XHRcdHZhclxuXHRcdFx0XHRyZXMsXG5cdFx0XHRcdHJldiA9IGV4cCA8IDA7XG5cdFx0XHRleHAgPSBleHA9PT11bmRlZmluZWQgPyAxIDogTWF0aC5hYnMoZXhwKSsxO1xuXHRcdFx0cmVzID0gTWF0aC5wb3cobiwgZXhwKTtcblx0XHRcdHJldHVybiByZXYgPyAxIC0gcmVzIDogcmVzO1xuXHRcdH0sXG5cblx0XHRuOiBmdW5jdGlvbihuLCB3KXtcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKChuIHx8IDEwKSAqIHRoaXMud2VpZ2h0KE1hdGgucmFuZG9tKCksIHcpKTtcblx0XHR9LFxuXG5cdFx0cmFuZ2U6IGZ1bmN0aW9uKG1pbiwgbWF4LCB3KXtcblx0XHRcdG1heCA9IG1heCB8fCAwO1xuXHRcdFx0cmV0dXJuIHRoaXMubihNYXRoLmFicyhtYXgtbWluKSsxLCB3KSArIChtaW48bWF4P21pbjptYXgpO1xuXHRcdH0sXG5cblx0XHRlbGVtZW50OiBmdW5jdGlvbih0aGluZywgdyl7XG5cdFx0XHQvLyByZXR1cm4gcmFuZCBzbG90LCBjaGFyLCBwcm9wIG9yIHJhbmdlXG5cdFx0XHRpZih0eXBlb2YodGhpbmcpID09PSBcIm51bWJlclwiKXsgcmV0dXJuIHRoaXMubih0aGluZywgdyk7IH1cblx0XHRcdHRoaW5nID0gdGhpcy50b0FycmF5KHRoaW5nKTtcblx0XHRcdHJldHVybiB0aGluZ1t0aGlzLm4odGhpbmcubGVuZ3RoLCB3KV07XG5cdFx0fSxcblxuXHRcdHNjcmFtYmxlOiBmdW5jdGlvbihhcnkpe1xuXHRcdFx0dmFyXG5cdFx0XHRcdGEgPSBhcnkuY29uY2F0KFtdKSxcblx0XHRcdFx0c2QgPSBbXSxcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZShpLS0pe1xuXHRcdFx0XHRcdHNkLnB1c2goYS5zcGxpY2UodGhpcy5uKGEubGVuZ3RoKSwgMSlbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRyZXR1cm4gc2Q7XG5cdFx0fSxcblxuXHRcdGJpZ251bWJlcjogZnVuY3Rpb24obGVuKXtcblx0XHRcdHZhciB0PVwiXCI7XG5cdFx0XHR3aGlsZShsZW4tLSl7XG5cdFx0XHRcdFx0dCArPSB0aGlzLm4oOSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9LFxuXG5cdFx0ZGF0ZTogZnVuY3Rpb24obyl7XG5cdFx0XHRvID0gbyB8fCB7fTtcblx0XHRcdHZhclxuXHRcdFx0XHRkLFxuXHRcdFx0XHRkMSA9IG5ldyBEYXRlKG8ubWluIHx8IG5ldyBEYXRlKCkpLFxuXHRcdFx0XHRkMiA9IG5ldyBEYXRlKG8ubWF4IHx8IG5ldyBEYXRlKCkuc2V0RnVsbFllYXIoZDEuZ2V0RnVsbFllYXIoKSsoby55ZWFyUmFuZ2V8fDEpKSkuZ2V0VGltZSgpO1xuXHRcdFx0ZDEgPSBkMS5nZXRUaW1lKCk7XG5cdFx0XHRkID0gbmV3IERhdGUodGhpcy5yYW5nZShkMSxkMixvLndlaWdodCkpO1xuXHRcdFx0aWYoby5zZWNvbmRzKXtcblx0XHRcdFx0cmV0dXJuIGQuZ2V0VGltZSgpO1xuXHRcdFx0fWVsc2UgaWYoby5kZWxpbWl0ZXIpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYWQoZC5nZXRNb250aCgpKzEpK28uZGVsaW1pdGVyK3RoaXMucGFkKGQuZ2V0RGF0ZSgpKzEpK28uZGVsaW1pdGVyKyhkLmdldEZ1bGxZZWFyKCkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGQ7XG5cdFx0fSxcblxuXHRcdGJvb2w6IGZ1bmN0aW9uKHcpe1xuXHRcdFx0cmV0dXJuIHRoaXMubigyLCB3KSA8IDE7XG5cdFx0fSxcblxuXHRcdGNvbG9yOiBmdW5jdGlvbih3KXtcblx0XHRcdHJldHVybiBcIiNcIit0aGlzLnBhZCh0aGlzLm4oMjU1LCB3KS50b1N0cmluZygxNikpK3RoaXMucGFkKHRoaXMubigyNTUsIHcpLnRvU3RyaW5nKDE2KSkrdGhpcy5wYWQodGhpcy5uKDI1NSwgdykudG9TdHJpbmcoMTYpKTtcblx0XHR9LFxuXG5cdFx0Y2hhcnM6ZnVuY3Rpb24obWluLCBtYXgsIHcpe1xuXHRcdFx0dmFyIHMgPSBcIlwiLFxuXHRcdFx0aSA9IHRoaXMucmFuZ2UobWluLCBtYXgsIHcpO1xuXHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0cyArPSB0aGlzLmxldHRlcnNbdGhpcy5uKHRoaXMubGV0dGVycy5sZW5ndGgpXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzO1xuXHRcdH0sXG5cblx0XHRuYW1lOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gdGhpcy5uYW1lc1t0aGlzLm4odGhpcy5uYW1lcy5sZW5ndGgpXTtcblx0XHRcdHJldHVybiAhY3NlID8gcyA6IGNzZSA9PT0gMSA/IHMudG9Mb3dlckNhc2UoKSA6IHMudG9VcHBlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0Y2l0eVN0YXRlOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGNpdHlTdGF0ZXNbdGhpcy5uKGNpdHlTdGF0ZXMubGVuZ3RoKV07XG5cdFx0fSxcblxuXHRcdHN0YXRlOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gc3RhdGVzW3RoaXMubihzdGF0ZXMubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdHN0YXRlQ29kZTogZnVuY3Rpb24oY3NlKXtcblx0XHRcdGNzZSA9IGNzZSA9PT0gdW5kZWZpbmVkID8gMiA6IGNzZTtcblx0XHRcdC8vIGNzZTogMCB0aXRsZSBjYXNlLCAxIGxvd2VyY2FzZSwgMiB1cHBlciBjYXNlXG5cdFx0XHR2YXIgcyA9IHN0YXRlQWJiclt0aGlzLm4oc3RhdGVBYmJyLmxlbmd0aCldO1xuXHRcdFx0cmV0dXJuICFjc2UgPyBzIDogY3NlID09PSAxID8gcy50b0xvd2VyQ2FzZSgpIDogcy50b1VwcGVyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHRzdHJlZXQ6IGZ1bmN0aW9uKG5vU3VmZml4KXtcblx0XHRcdHZhciBzID0gc3RyZWV0c1t0aGlzLm4oc3RyZWV0cy5sZW5ndGgpXTtcblx0XHRcdGlmKCFub1N1ZmZpeCl7XG5cdFx0XHRcdHMrPSAnICcgKyBzdHJlZXRTdWZmaXhlc1t0aGlzLm4oc3RyZWV0U3VmZml4ZXMubGVuZ3RoKV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcztcblx0XHR9LFxuXG5cdFx0c2l0ZTogZnVuY3Rpb24oY3NlKXtcblx0XHRcdC8vIGNzZTogMCB0aXRsZSBjYXNlLCAxIGxvd2VyY2FzZSwgMiB1cHBlciBjYXNlXG5cdFx0XHR2YXIgcyA9IHRoaXMuc2l0ZXNbdGhpcy5uKHRoaXMuc2l0ZXMubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdHVybDogZnVuY3Rpb24odXNld3d3LCB4dCl7XG5cdFx0XHR2YXIgdyA9IHVzZXd3dyA/IFwid3d3LlwiIDogXCJcIjtcblx0XHRcdHh0ID0geHQgfHwgXCIuY29tXCI7XG5cdFx0XHRyZXR1cm4gXCJodHRwOi8vXCIgKyB3ICsgdGhpcy5zaXRlKDEpICsgeHQ7XG5cdFx0fSxcblxuXHRcdHdvcmQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgdyA9IHRoaXMucmVhbCA/IHRoaXMud29yZHMgOiB0aGlzLnd1cmRzO1xuXHRcdFx0cmV0dXJuIHdbdGhpcy5uKHcubGVuZ3RoKV07XG5cdFx0fSxcblxuXHRcdHNlbnRlbmNlczogZnVuY3Rpb24obWluQW10LCBtYXhBbXQsIG1pbkxlbiwgbWF4TGVuKXtcblx0XHRcdC8vIGFtdDogc2VudGVuY2VzLCBsZW46IHdvcmRzXG5cdFx0XHRtaW5BbXQgPSBtaW5BbXQgfHwgMTtcblx0XHRcdG1heEFtdCA9IG1heEFtdCB8fCBtaW5BbXQ7XG5cdFx0XHRtaW5MZW4gPSBtaW5MZW4gfHwgNTtcblx0XHRcdG1heExlbiA9IG1heExlbiB8fCBtaW5MZW47XG5cblx0XHRcdHZhclxuXHRcdFx0XHRpaSxcblx0XHRcdFx0cyA9IFtdLFxuXHRcdFx0XHR0ID0gXCJcIixcblx0XHRcdFx0dyA9IHRoaXMucmVhbCA/IHRoaXMud29yZHMgOiB0aGlzLnd1cmRzLFxuXHRcdFx0XHRpID0gdGhpcy5yYW5nZShtaW5BbXQsIG1heEFtdCk7XG5cblx0XHRcdHdoaWxlKGktLSl7XG5cblx0XHRcdFx0aWkgPSB0aGlzLnJhbmdlKG1pbkxlbiwgbWF4TGVuKTsgd2hpbGUoaWktLSl7XG5cdFx0XHRcdFx0cy5wdXNoKHdbdGhpcy5uKHcubGVuZ3RoKV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQgKz0gdGhpcy5jYXAocy5qb2luKFwiIFwiKSkgK1wiLiBcIjtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0O1xuXHRcdH0sXG5cblx0XHR0aXRsZTogZnVuY3Rpb24obWluLCBtYXgpe1xuXHRcdFx0bWluID0gbWluIHx8IDE7IG1heCA9IG1heCB8fCBtaW47XG5cdFx0XHR2YXJcblx0XHRcdFx0YSA9IFtdLFxuXHRcdFx0XHR3ID0gdGhpcy5yZWFsID8gdGhpcy53b3JkcyA6IHRoaXMud3VyZHMsXG5cdFx0XHRcdGkgPSB0aGlzLnJhbmdlKG1pbiwgbWF4KTtcblx0XHRcdHdoaWxlKGktLSl7XG5cdFx0XHRcdGEucHVzaCh0aGlzLmNhcCh3W3RoaXMubih3Lmxlbmd0aCldKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYS5qb2luKFwiIFwiKTtcblx0XHR9LFxuXHRcdGRhdGE6IGZ1bmN0aW9uKGFtdCl7XG5cdFx0XHR2YXJcblx0XHRcdFx0c3QsXG5cdFx0XHRcdGl0ZW1zID0gW10sXG5cdFx0XHRcdGl0ZW0sXG5cdFx0XHRcdGk7XG5cdFx0XHRmb3IoaSA9IDA7IGkgPCBhbXQ7IGkrKyl7XG5cdFx0XHRcdGl0ZW0gPSB7XG5cdFx0XHRcdFx0Zmlyc3ROYW1lOiB0aGlzLm5hbWUoKSxcblx0XHRcdFx0XHRsYXN0TmFtZTogdGhpcy5uYW1lKCksXG5cdFx0XHRcdFx0Y29tcGFueTogdGhpcy5zaXRlKCksXG5cdFx0XHRcdFx0YWRkcmVzczE6IHRoaXMuYmlnbnVtYmVyKHRoaXMucmFuZ2UoMywgNSkpLFxuXHRcdFx0XHRcdGFkZHJlc3MyOiB0aGlzLnN0cmVldCgpLFxuXHRcdFx0XHRcdGJpcnRoZGF5OiB0aGlzLmRhdGUoe2RlbGltaXRlcjonLyd9KVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpdGVtLmVtYWlsID0gKGl0ZW0uZmlyc3ROYW1lLnN1YnN0cmluZygwLDEpICsgaXRlbS5sYXN0TmFtZSArICdAJyArIGl0ZW0uY29tcGFueSArICcuY29tJykudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0c3QgPSB0aGlzLmNpdHlTdGF0ZSgpO1xuXHRcdFx0XHRpdGVtLmNpdHkgPSBzdC5zcGxpdCgnLCAnKVswXTtcblx0XHRcdFx0aXRlbS5zdGF0ZSA9IHN0LnNwbGl0KCcsICcpWzFdO1xuXHRcdFx0XHRpdGVtLnppcGNvZGUgPSB0aGlzLmJpZ251bWJlcig1KTtcblx0XHRcdFx0aXRlbS5waG9uZSA9IHRoaXMuZm9ybWF0KHRoaXMuYmlnbnVtYmVyKDEwKSwgJ3Bob25lJyk7XG5cdFx0XHRcdGl0ZW0uc3NuID0gdGhpcy5mb3JtYXQodGhpcy5iaWdudW1iZXIoOSksICdzc24nKTtcblx0XHRcdFx0aXRlbXMucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpdGVtcztcblx0XHR9LFxuXG5cdFx0Zm9ybWF0OiBmdW5jdGlvbiAobiwgdHlwZSkge1xuXHRcdFx0dmFyIGQgPSAnLSc7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAncGhvbmUnOlxuXHRcdFx0XHRcdG4gPSAnJyArIG47XG5cdFx0XHRcdFx0cmV0dXJuIG4uc3Vic3RyaW5nKDAsMykgKyBkICsgbi5zdWJzdHJpbmcoMyw2KSArIGQgKyBuLnN1YnN0cmluZyg2KTtcblx0XHRcdFx0Y2FzZSAnc3NuJzpcblx0XHRcdFx0XHRuID0gJycgKyBuO1xuXHRcdFx0XHRcdHJldHVybiBuLnN1YnN0cmluZygwLDMpICsgZCArIG4uc3Vic3RyaW5nKDMsNSkgKyBkICsgbi5zdWJzdHJpbmcoNSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyYW5kLnd1cmRzID0gd29yZHMucmVwbGFjZSgvYXxlfGl8b3x1L2csIGZ1bmN0aW9uKGMpeyByZXR1cm4gKFwiYWVpb3VcIilbcmFuZC5uKDUpXTsgfSkuc3BsaXQoXCIsXCIpO1xuXG5cdHJldHVybiByYW5kO1xufSkpO1xuIl19
