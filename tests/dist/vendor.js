require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"@clubajax/custom-elements-polyfill":[function(require,module,exports){
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
return a})}M?q(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=M.call(this,a)}):console.warn("Custom Elements: `Element#attachShadow` was not patched.");if(N&&N.get)a(Element.prototype,N);else if(W&&W.get)a(HTMLElement.prototype,W);else{var c=F.call(document,"div");t(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return G.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName?this.content:this;for(c.innerHTML=a;0<b.childNodes.length;)J.call(b,
b.childNodes[0]);for(;0<c.childNodes.length;)H.call(b,c.childNodes[0])}})})}q(Element.prototype,"setAttribute",function(a,c){if(1!==this.__CE_state)return Q.call(this,a,c);var d=O.call(this,a);Q.call(this,a,c);c=O.call(this,a);d!==c&&b.attributeChangedCallback(this,a,d,c,null)});q(Element.prototype,"setAttributeNS",function(a,c,e){if(1!==this.__CE_state)return T.call(this,a,c,e);var d=S.call(this,a,c);T.call(this,a,c,e);e=S.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});q(Element.prototype,
"removeAttribute",function(a){if(1!==this.__CE_state)return R.call(this,a);var c=O.call(this,a);R.call(this,a);null!==c&&b.attributeChangedCallback(this,a,c,null,null)});q(Element.prototype,"removeAttributeNS",function(a,c){if(1!==this.__CE_state)return U.call(this,a,c);var d=S.call(this,a,c);U.call(this,a,c);var e=S.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});X?e(HTMLElement.prototype,X):V?e(Element.prototype,V):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");
pa(b,Element.prototype,{i:ha,append:ia});sa(b)};
var Z=window.customElements;if(!Z||Z.forcePolyfill||"function"!=typeof Z.define||"function"!=typeof Z.get){var Y=new r;oa();qa();ra();ta();document.__CE_hasRegistry=!0;var ua=new E(Y);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:ua})};
}).call(self);
}
}());
},{}],"@clubajax/dom":[function(require,module,exports){
/* UMD.define */ (function (root, factory) {
    if (typeof customLoader === 'function'){ customLoader(factory, 'dom'); }else if (typeof define === 'function' && define.amd) { define([], factory); } else if (typeof exports === 'object') { module.exports = factory(); } else { root.returnExports = factory(); window.dom = factory(); }
}(this, function () {
	'use strict';
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
				dom.classList.add(node, value);
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

	function normalize(val) {
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
			// '1team' '123 Street', '1-2-3', etc
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

	function getDoc (node) {
		return node === document || node === window ? document : node.ownerDocument;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJAY2x1YmFqYXgvY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsIiwiQGNsdWJhamF4L2RvbSIsIkBjbHViYWpheC9vbiIsInJhbmRvbWl6ZXIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3phQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcbmlmKHdpbmRvd1snZm9yY2Utbm8tY2Utc2hpbSddKXtcblx0cmV0dXJuO1xufVxudmFyIHN1cHBvcnRzVjEgPSAnY3VzdG9tRWxlbWVudHMnIGluIHdpbmRvdztcbnZhciBuYXRpdmVTaGltQmFzZTY0ID0gXCJablZ1WTNScGIyNGdibUYwYVhabFUyaHBiU2dwZXlnb0tUMCtleWQxYzJVZ2MzUnlhV04wSnp0cFppZ2hkMmx1Wkc5M0xtTjFjM1J2YlVWc1pXMWxiblJ6S1hKbGRIVnlianRqYjI1emRDQmhQWGRwYm1SdmR5NUlWRTFNUld4bGJXVnVkQ3hpUFhkcGJtUnZkeTVqZFhOMGIyMUZiR1Z0Wlc1MGN5NWtaV1pwYm1Vc1l6MTNhVzVrYjNjdVkzVnpkRzl0Uld4bGJXVnVkSE11WjJWMExHUTlibVYzSUUxaGNDeGxQVzVsZHlCTllYQTdiR1YwSUdZOUlURXNaejBoTVR0M2FXNWtiM2N1U0ZSTlRFVnNaVzFsYm5ROVpuVnVZM1JwYjI0b0tYdHBaaWdoWmlsN1kyOXVjM1FnYWoxa0xtZGxkQ2gwYUdsekxtTnZibk4wY25WamRHOXlLU3hyUFdNdVkyRnNiQ2gzYVc1a2IzY3VZM1Z6ZEc5dFJXeGxiV1Z1ZEhNc2FpazdaejBoTUR0amIyNXpkQ0JzUFc1bGR5QnJPM0psZEhWeWJpQnNmV1k5SVRFN2ZTeDNhVzVrYjNjdVNGUk5URVZzWlcxbGJuUXVjSEp2ZEc5MGVYQmxQV0V1Y0hKdmRHOTBlWEJsTzA5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDNhVzVrYjNjc0oyTjFjM1J2YlVWc1pXMWxiblJ6Snl4N2RtRnNkV1U2ZDJsdVpHOTNMbU4xYzNSdmJVVnNaVzFsYm5SekxHTnZibVpwWjNWeVlXSnNaVG9oTUN4M2NtbDBZV0pzWlRvaE1IMHBMRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoM2FXNWtiM2N1WTNWemRHOXRSV3hsYldWdWRITXNKMlJsWm1sdVpTY3NlM1poYkhWbE9paHFMR3NwUFQ1N1kyOXVjM1FnYkQxckxuQnliM1J2ZEhsd1pTeHRQV05zWVhOeklHVjRkR1Z1WkhNZ1lYdGpiMjV6ZEhKMVkzUnZjaWdwZTNOMWNHVnlLQ2tzVDJKcVpXTjBMbk5sZEZCeWIzUnZkSGx3WlU5bUtIUm9hWE1zYkNrc1ozeDhLR1k5SVRBc2F5NWpZV3hzS0hSb2FYTXBLU3huUFNFeE8zMTlMRzQ5YlM1d2NtOTBiM1I1Y0dVN2JTNXZZbk5sY25abFpFRjBkSEpwWW5WMFpYTTlheTV2WW5ObGNuWmxaRUYwZEhKcFluVjBaWE1zYmk1amIyNXVaV04wWldSRFlXeHNZbUZqYXoxc0xtTnZibTVsWTNSbFpFTmhiR3hpWVdOckxHNHVaR2x6WTI5dWJtVmpkR1ZrUTJGc2JHSmhZMnM5YkM1a2FYTmpiMjV1WldOMFpXUkRZV3hzWW1GamF5eHVMbUYwZEhKcFluVjBaVU5vWVc1blpXUkRZV3hzWW1GamF6MXNMbUYwZEhKcFluVjBaVU5vWVc1blpXUkRZV3hzWW1GamF5eHVMbUZrYjNCMFpXUkRZV3hzWW1GamF6MXNMbUZrYjNCMFpXUkRZV3hzWW1GamF5eGtMbk5sZENockxHb3BMR1V1YzJWMEtHb3NheWtzWWk1allXeHNLSGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3l4cUxHMHBPMzBzWTI5dVptbG5kWEpoWW14bE9pRXdMSGR5YVhSaFlteGxPaUV3ZlNrc1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLSGRwYm1SdmR5NWpkWE4wYjIxRmJHVnRaVzUwY3l3bloyVjBKeXg3ZG1Gc2RXVTZLR29wUFQ1bExtZGxkQ2hxS1N4amIyNW1hV2QxY21GaWJHVTZJVEFzZDNKcGRHRmliR1U2SVRCOUtUdDlLU2dwTzMwPVwiO1xuXG5pZihzdXBwb3J0c1YxICYmICF3aW5kb3dbJ2ZvcmNlLWNlLXNoaW0nXSl7XG5cdHZhciBub05hdGl2ZVNoaW0gPSB0eXBlb2YgTk9fTkFUSVZFX1NISU0gIT09IFwidW5kZWZpbmVkXCIgPyBOT19OQVRJVkVfU0hJTSA6IHdpbmRvd1snbm8tbmF0aXZlLXNoaW0nXTtcbmlmKCFub05hdGl2ZVNoaW0pIHtcbmV2YWwod2luZG93LmF0b2IobmF0aXZlU2hpbUJhc2U2NCkpO1xubmF0aXZlU2hpbSgpO1xufVxufWVsc2V7XG5jdXN0b21FbGVtZW50cygpO1xufVxuXG5mdW5jdGlvbiBjdXN0b21FbGVtZW50cygpIHtcbihmdW5jdGlvbigpe1xuLy8gQGxpY2Vuc2UgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9MSUNFTlNFLnR4dFxuJ3VzZSBzdHJpY3QnO3ZhciBnPW5ldyBmdW5jdGlvbigpe307dmFyIGFhPW5ldyBTZXQoXCJhbm5vdGF0aW9uLXhtbCBjb2xvci1wcm9maWxlIGZvbnQtZmFjZSBmb250LWZhY2Utc3JjIGZvbnQtZmFjZS11cmkgZm9udC1mYWNlLWZvcm1hdCBmb250LWZhY2UtbmFtZSBtaXNzaW5nLWdseXBoXCIuc3BsaXQoXCIgXCIpKTtmdW5jdGlvbiBrKGIpe3ZhciBhPWFhLmhhcyhiKTtiPS9eW2Etel1bLjAtOV9hLXpdKi1bXFwtLjAtOV9hLXpdKiQvLnRlc3QoYik7cmV0dXJuIWEmJmJ9ZnVuY3Rpb24gbChiKXt2YXIgYT1iLmlzQ29ubmVjdGVkO2lmKHZvaWQgMCE9PWEpcmV0dXJuIGE7Zm9yKDtiJiYhKGIuX19DRV9pc0ltcG9ydERvY3VtZW50fHxiIGluc3RhbmNlb2YgRG9jdW1lbnQpOyliPWIucGFyZW50Tm9kZXx8KHdpbmRvdy5TaGFkb3dSb290JiZiIGluc3RhbmNlb2YgU2hhZG93Um9vdD9iLmhvc3Q6dm9pZCAwKTtyZXR1cm4hKCFifHwhKGIuX19DRV9pc0ltcG9ydERvY3VtZW50fHxiIGluc3RhbmNlb2YgRG9jdW1lbnQpKX1cbmZ1bmN0aW9uIG0oYixhKXtmb3IoO2EmJmEhPT1iJiYhYS5uZXh0U2libGluZzspYT1hLnBhcmVudE5vZGU7cmV0dXJuIGEmJmEhPT1iP2EubmV4dFNpYmxpbmc6bnVsbH1cbmZ1bmN0aW9uIG4oYixhLGUpe2U9ZT9lOm5ldyBTZXQ7Zm9yKHZhciBjPWI7Yzspe2lmKGMubm9kZVR5cGU9PT1Ob2RlLkVMRU1FTlRfTk9ERSl7dmFyIGQ9YzthKGQpO3ZhciBoPWQubG9jYWxOYW1lO2lmKFwibGlua1wiPT09aCYmXCJpbXBvcnRcIj09PWQuZ2V0QXR0cmlidXRlKFwicmVsXCIpKXtjPWQuaW1wb3J0O2lmKGMgaW5zdGFuY2VvZiBOb2RlJiYhZS5oYXMoYykpZm9yKGUuYWRkKGMpLGM9Yy5maXJzdENoaWxkO2M7Yz1jLm5leHRTaWJsaW5nKW4oYyxhLGUpO2M9bShiLGQpO2NvbnRpbnVlfWVsc2UgaWYoXCJ0ZW1wbGF0ZVwiPT09aCl7Yz1tKGIsZCk7Y29udGludWV9aWYoZD1kLl9fQ0Vfc2hhZG93Um9vdClmb3IoZD1kLmZpcnN0Q2hpbGQ7ZDtkPWQubmV4dFNpYmxpbmcpbihkLGEsZSl9Yz1jLmZpcnN0Q2hpbGQ/Yy5maXJzdENoaWxkOm0oYixjKX19ZnVuY3Rpb24gcShiLGEsZSl7YlthXT1lfTtmdW5jdGlvbiByKCl7dGhpcy5hPW5ldyBNYXA7dGhpcy5mPW5ldyBNYXA7dGhpcy5jPVtdO3RoaXMuYj0hMX1mdW5jdGlvbiBiYShiLGEsZSl7Yi5hLnNldChhLGUpO2IuZi5zZXQoZS5jb25zdHJ1Y3RvcixlKX1mdW5jdGlvbiB0KGIsYSl7Yi5iPSEwO2IuYy5wdXNoKGEpfWZ1bmN0aW9uIHYoYixhKXtiLmImJm4oYSxmdW5jdGlvbihhKXtyZXR1cm4gdyhiLGEpfSl9ZnVuY3Rpb24gdyhiLGEpe2lmKGIuYiYmIWEuX19DRV9wYXRjaGVkKXthLl9fQ0VfcGF0Y2hlZD0hMDtmb3IodmFyIGU9MDtlPGIuYy5sZW5ndGg7ZSsrKWIuY1tlXShhKX19ZnVuY3Rpb24geChiLGEpe3ZhciBlPVtdO24oYSxmdW5jdGlvbihiKXtyZXR1cm4gZS5wdXNoKGIpfSk7Zm9yKGE9MDthPGUubGVuZ3RoO2ErKyl7dmFyIGM9ZVthXTsxPT09Yy5fX0NFX3N0YXRlP2IuY29ubmVjdGVkQ2FsbGJhY2soYyk6eShiLGMpfX1cbmZ1bmN0aW9uIHooYixhKXt2YXIgZT1bXTtuKGEsZnVuY3Rpb24oYil7cmV0dXJuIGUucHVzaChiKX0pO2ZvcihhPTA7YTxlLmxlbmd0aDthKyspe3ZhciBjPWVbYV07MT09PWMuX19DRV9zdGF0ZSYmYi5kaXNjb25uZWN0ZWRDYWxsYmFjayhjKX19XG5mdW5jdGlvbiBBKGIsYSxlKXtlPWU/ZTpuZXcgU2V0O3ZhciBjPVtdO24oYSxmdW5jdGlvbihkKXtpZihcImxpbmtcIj09PWQubG9jYWxOYW1lJiZcImltcG9ydFwiPT09ZC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikpe3ZhciBhPWQuaW1wb3J0O2EgaW5zdGFuY2VvZiBOb2RlJiZcImNvbXBsZXRlXCI9PT1hLnJlYWR5U3RhdGU/KGEuX19DRV9pc0ltcG9ydERvY3VtZW50PSEwLGEuX19DRV9oYXNSZWdpc3RyeT0hMCk6ZC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGZ1bmN0aW9uKCl7dmFyIGE9ZC5pbXBvcnQ7YS5fX0NFX2RvY3VtZW50TG9hZEhhbmRsZWR8fChhLl9fQ0VfZG9jdW1lbnRMb2FkSGFuZGxlZD0hMCxhLl9fQ0VfaXNJbXBvcnREb2N1bWVudD0hMCxhLl9fQ0VfaGFzUmVnaXN0cnk9ITAsbmV3IFNldChlKSxlLmRlbGV0ZShhKSxBKGIsYSxlKSl9KX1lbHNlIGMucHVzaChkKX0sZSk7aWYoYi5iKWZvcihhPTA7YTxjLmxlbmd0aDthKyspdyhiLGNbYV0pO2ZvcihhPTA7YTxjLmxlbmd0aDthKyspeShiLFxuY1thXSl9XG5mdW5jdGlvbiB5KGIsYSl7aWYodm9pZCAwPT09YS5fX0NFX3N0YXRlKXt2YXIgZT1iLmEuZ2V0KGEubG9jYWxOYW1lKTtpZihlKXtlLmNvbnN0cnVjdGlvblN0YWNrLnB1c2goYSk7dmFyIGM9ZS5jb25zdHJ1Y3Rvcjt0cnl7dHJ5e2lmKG5ldyBjIT09YSl0aHJvdyBFcnJvcihcIlRoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvciBkaWQgbm90IHByb2R1Y2UgdGhlIGVsZW1lbnQgYmVpbmcgdXBncmFkZWQuXCIpO31maW5hbGx5e2UuY29uc3RydWN0aW9uU3RhY2sucG9wKCl9fWNhdGNoKGYpe3Rocm93IGEuX19DRV9zdGF0ZT0yLGY7fWEuX19DRV9zdGF0ZT0xO2EuX19DRV9kZWZpbml0aW9uPWU7aWYoZS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2spZm9yKGU9ZS5vYnNlcnZlZEF0dHJpYnV0ZXMsYz0wO2M8ZS5sZW5ndGg7YysrKXt2YXIgZD1lW2NdLGg9YS5nZXRBdHRyaWJ1dGUoZCk7bnVsbCE9PWgmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGEsZCxudWxsLGgsbnVsbCl9bChhKSYmYi5jb25uZWN0ZWRDYWxsYmFjayhhKX19fVxuci5wcm90b3R5cGUuY29ubmVjdGVkQ2FsbGJhY2s9ZnVuY3Rpb24oYil7dmFyIGE9Yi5fX0NFX2RlZmluaXRpb247YS5jb25uZWN0ZWRDYWxsYmFjayYmYS5jb25uZWN0ZWRDYWxsYmFjay5jYWxsKGIpfTtyLnByb3RvdHlwZS5kaXNjb25uZWN0ZWRDYWxsYmFjaz1mdW5jdGlvbihiKXt2YXIgYT1iLl9fQ0VfZGVmaW5pdGlvbjthLmRpc2Nvbm5lY3RlZENhbGxiYWNrJiZhLmRpc2Nvbm5lY3RlZENhbGxiYWNrLmNhbGwoYil9O3IucHJvdG90eXBlLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaz1mdW5jdGlvbihiLGEsZSxjLGQpe3ZhciBoPWIuX19DRV9kZWZpbml0aW9uO2guYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJiYtMTxoLm9ic2VydmVkQXR0cmlidXRlcy5pbmRleE9mKGEpJiZoLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjay5jYWxsKGIsYSxlLGMsZCl9O2Z1bmN0aW9uIEIoYixhKXt0aGlzLmM9Yjt0aGlzLmE9YTt0aGlzLmI9dm9pZCAwO0EodGhpcy5jLHRoaXMuYSk7XCJsb2FkaW5nXCI9PT10aGlzLmEucmVhZHlTdGF0ZSYmKHRoaXMuYj1uZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmYuYmluZCh0aGlzKSksdGhpcy5iLm9ic2VydmUodGhpcy5hLHtjaGlsZExpc3Q6ITAsc3VidHJlZTohMH0pKX1mdW5jdGlvbiBDKGIpe2IuYiYmYi5iLmRpc2Nvbm5lY3QoKX1CLnByb3RvdHlwZS5mPWZ1bmN0aW9uKGIpe3ZhciBhPXRoaXMuYS5yZWFkeVN0YXRlO1wiaW50ZXJhY3RpdmVcIiE9PWEmJlwiY29tcGxldGVcIiE9PWF8fEModGhpcyk7Zm9yKGE9MDthPGIubGVuZ3RoO2ErKylmb3IodmFyIGU9YlthXS5hZGRlZE5vZGVzLGM9MDtjPGUubGVuZ3RoO2MrKylBKHRoaXMuYyxlW2NdKX07ZnVuY3Rpb24gY2EoKXt2YXIgYj10aGlzO3RoaXMuYj10aGlzLmE9dm9pZCAwO3RoaXMuYz1uZXcgUHJvbWlzZShmdW5jdGlvbihhKXtiLmI9YTtiLmEmJmEoYi5hKX0pfWZ1bmN0aW9uIEQoYil7aWYoYi5hKXRocm93IEVycm9yKFwiQWxyZWFkeSByZXNvbHZlZC5cIik7Yi5hPXZvaWQgMDtiLmImJmIuYih2b2lkIDApfTtmdW5jdGlvbiBFKGIpe3RoaXMuZj0hMTt0aGlzLmE9Yjt0aGlzLmg9bmV3IE1hcDt0aGlzLmc9ZnVuY3Rpb24oYil7cmV0dXJuIGIoKX07dGhpcy5iPSExO3RoaXMuYz1bXTt0aGlzLmo9bmV3IEIoYixkb2N1bWVudCl9XG5FLnByb3RvdHlwZS5sPWZ1bmN0aW9uKGIsYSl7dmFyIGU9dGhpcztpZighKGEgaW5zdGFuY2VvZiBGdW5jdGlvbikpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9ycyBtdXN0IGJlIGZ1bmN0aW9ucy5cIik7aWYoIWsoYikpdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVGhlIGVsZW1lbnQgbmFtZSAnXCIrYitcIicgaXMgbm90IHZhbGlkLlwiKTtpZih0aGlzLmEuYS5nZXQoYikpdGhyb3cgRXJyb3IoXCJBIGN1c3RvbSBlbGVtZW50IHdpdGggbmFtZSAnXCIrYitcIicgaGFzIGFscmVhZHkgYmVlbiBkZWZpbmVkLlwiKTtpZih0aGlzLmYpdGhyb3cgRXJyb3IoXCJBIGN1c3RvbSBlbGVtZW50IGlzIGFscmVhZHkgYmVpbmcgZGVmaW5lZC5cIik7dGhpcy5mPSEwO3ZhciBjLGQsaCxmLHU7dHJ5e3ZhciBwPWZ1bmN0aW9uKGIpe3ZhciBhPVBbYl07aWYodm9pZCAwIT09YSYmIShhIGluc3RhbmNlb2YgRnVuY3Rpb24pKXRocm93IEVycm9yKFwiVGhlICdcIitiK1wiJyBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24uXCIpO1xucmV0dXJuIGF9LFA9YS5wcm90b3R5cGU7aWYoIShQIGluc3RhbmNlb2YgT2JqZWN0KSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIGN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9yJ3MgcHJvdG90eXBlIGlzIG5vdCBhbiBvYmplY3QuXCIpO2M9cChcImNvbm5lY3RlZENhbGxiYWNrXCIpO2Q9cChcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIpO2g9cChcImFkb3B0ZWRDYWxsYmFja1wiKTtmPXAoXCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2tcIik7dT1hLm9ic2VydmVkQXR0cmlidXRlc3x8W119Y2F0Y2godmEpe3JldHVybn1maW5hbGx5e3RoaXMuZj0hMX1iYSh0aGlzLmEsYix7bG9jYWxOYW1lOmIsY29uc3RydWN0b3I6YSxjb25uZWN0ZWRDYWxsYmFjazpjLGRpc2Nvbm5lY3RlZENhbGxiYWNrOmQsYWRvcHRlZENhbGxiYWNrOmgsYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrOmYsb2JzZXJ2ZWRBdHRyaWJ1dGVzOnUsY29uc3RydWN0aW9uU3RhY2s6W119KTt0aGlzLmMucHVzaChiKTt0aGlzLmJ8fCh0aGlzLmI9XG4hMCx0aGlzLmcoZnVuY3Rpb24oKXtpZighMSE9PWUuYilmb3IoZS5iPSExLEEoZS5hLGRvY3VtZW50KTswPGUuYy5sZW5ndGg7KXt2YXIgYj1lLmMuc2hpZnQoKTsoYj1lLmguZ2V0KGIpKSYmRChiKX19KSl9O0UucHJvdG90eXBlLmdldD1mdW5jdGlvbihiKXtpZihiPXRoaXMuYS5hLmdldChiKSlyZXR1cm4gYi5jb25zdHJ1Y3Rvcn07RS5wcm90b3R5cGUubz1mdW5jdGlvbihiKXtpZighayhiKSlyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFN5bnRheEVycm9yKFwiJ1wiK2IrXCInIGlzIG5vdCBhIHZhbGlkIGN1c3RvbSBlbGVtZW50IG5hbWUuXCIpKTt2YXIgYT10aGlzLmguZ2V0KGIpO2lmKGEpcmV0dXJuIGEuYzthPW5ldyBjYTt0aGlzLmguc2V0KGIsYSk7dGhpcy5hLmEuZ2V0KGIpJiYtMT09PXRoaXMuYy5pbmRleE9mKGIpJiZEKGEpO3JldHVybiBhLmN9O0UucHJvdG90eXBlLm09ZnVuY3Rpb24oYil7Qyh0aGlzLmopO3ZhciBhPXRoaXMuZzt0aGlzLmc9ZnVuY3Rpb24oZSl7cmV0dXJuIGIoZnVuY3Rpb24oKXtyZXR1cm4gYShlKX0pfX07XG53aW5kb3cuQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5PUU7RS5wcm90b3R5cGUuZGVmaW5lPUUucHJvdG90eXBlLmw7RS5wcm90b3R5cGUuZ2V0PUUucHJvdG90eXBlLmdldDtFLnByb3RvdHlwZS53aGVuRGVmaW5lZD1FLnByb3RvdHlwZS5vO0UucHJvdG90eXBlLnBvbHlmaWxsV3JhcEZsdXNoQ2FsbGJhY2s9RS5wcm90b3R5cGUubTt2YXIgRj13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQsZGE9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50TlMsZWE9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5pbXBvcnROb2RlLGZhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUucHJlcGVuZCxnYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmFwcGVuZCxHPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5jbG9uZU5vZGUsSD13aW5kb3cuTm9kZS5wcm90b3R5cGUuYXBwZW5kQ2hpbGQsST13aW5kb3cuTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlLEo9d2luZG93Lk5vZGUucHJvdG90eXBlLnJlbW92ZUNoaWxkLEs9d2luZG93Lk5vZGUucHJvdG90eXBlLnJlcGxhY2VDaGlsZCxMPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93Lk5vZGUucHJvdG90eXBlLFwidGV4dENvbnRlbnRcIiksTT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYXR0YWNoU2hhZG93LE49T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsXG5cImlubmVySFRNTFwiKSxPPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGUsUT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlLFI9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZSxTPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVOUyxUPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGVOUyxVPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVOUyxWPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5pbnNlcnRBZGphY2VudEVsZW1lbnQsaGE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnByZXBlbmQsaWE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmFwcGVuZCxqYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYmVmb3JlLGthPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hZnRlcixsYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVwbGFjZVdpdGgsbWE9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZSxcbm5hPXdpbmRvdy5IVE1MRWxlbWVudCxXPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZSxcImlubmVySFRNTFwiKSxYPXdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGUuaW5zZXJ0QWRqYWNlbnRFbGVtZW50O2Z1bmN0aW9uIG9hKCl7dmFyIGI9WTt3aW5kb3cuSFRNTEVsZW1lbnQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKCl7dmFyIGE9dGhpcy5jb25zdHJ1Y3RvcixjPWIuZi5nZXQoYSk7aWYoIWMpdGhyb3cgRXJyb3IoXCJUaGUgY3VzdG9tIGVsZW1lbnQgYmVpbmcgY29uc3RydWN0ZWQgd2FzIG5vdCByZWdpc3RlcmVkIHdpdGggYGN1c3RvbUVsZW1lbnRzYC5cIik7dmFyIGQ9Yy5jb25zdHJ1Y3Rpb25TdGFjaztpZighZC5sZW5ndGgpcmV0dXJuIGQ9Ri5jYWxsKGRvY3VtZW50LGMubG9jYWxOYW1lKSxPYmplY3Quc2V0UHJvdG90eXBlT2YoZCxhLnByb3RvdHlwZSksZC5fX0NFX3N0YXRlPTEsZC5fX0NFX2RlZmluaXRpb249Yyx3KGIsZCksZDt2YXIgYz1kLmxlbmd0aC0xLGg9ZFtjXTtpZihoPT09Zyl0aHJvdyBFcnJvcihcIlRoZSBIVE1MRWxlbWVudCBjb25zdHJ1Y3RvciB3YXMgZWl0aGVyIGNhbGxlZCByZWVudHJhbnRseSBmb3IgdGhpcyBjb25zdHJ1Y3RvciBvciBjYWxsZWQgbXVsdGlwbGUgdGltZXMuXCIpO1xuZFtjXT1nO09iamVjdC5zZXRQcm90b3R5cGVPZihoLGEucHJvdG90eXBlKTt3KGIsaCk7cmV0dXJuIGh9YS5wcm90b3R5cGU9bmEucHJvdG90eXBlO3JldHVybiBhfSgpfTtmdW5jdGlvbiBwYShiLGEsZSl7YS5wcmVwZW5kPWZ1bmN0aW9uKGEpe2Zvcih2YXIgZD1bXSxjPTA7Yzxhcmd1bWVudHMubGVuZ3RoOysrYylkW2MtMF09YXJndW1lbnRzW2NdO2M9ZC5maWx0ZXIoZnVuY3Rpb24oYil7cmV0dXJuIGIgaW5zdGFuY2VvZiBOb2RlJiZsKGIpfSk7ZS5pLmFwcGx5KHRoaXMsZCk7Zm9yKHZhciBmPTA7ZjxjLmxlbmd0aDtmKyspeihiLGNbZl0pO2lmKGwodGhpcykpZm9yKGM9MDtjPGQubGVuZ3RoO2MrKylmPWRbY10sZiBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixmKX07YS5hcHBlbmQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBkPVtdLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7KytjKWRbYy0wXT1hcmd1bWVudHNbY107Yz1kLmZpbHRlcihmdW5jdGlvbihiKXtyZXR1cm4gYiBpbnN0YW5jZW9mIE5vZGUmJmwoYil9KTtlLmFwcGVuZC5hcHBseSh0aGlzLGQpO2Zvcih2YXIgZj0wO2Y8Yy5sZW5ndGg7ZisrKXooYixjW2ZdKTtpZihsKHRoaXMpKWZvcihjPTA7YzxcbmQubGVuZ3RoO2MrKylmPWRbY10sZiBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixmKX19O2Z1bmN0aW9uIHFhKCl7dmFyIGI9WTtxKERvY3VtZW50LnByb3RvdHlwZSxcImNyZWF0ZUVsZW1lbnRcIixmdW5jdGlvbihhKXtpZih0aGlzLl9fQ0VfaGFzUmVnaXN0cnkpe3ZhciBlPWIuYS5nZXQoYSk7aWYoZSlyZXR1cm4gbmV3IGUuY29uc3RydWN0b3J9YT1GLmNhbGwodGhpcyxhKTt3KGIsYSk7cmV0dXJuIGF9KTtxKERvY3VtZW50LnByb3RvdHlwZSxcImltcG9ydE5vZGVcIixmdW5jdGlvbihhLGUpe2E9ZWEuY2FsbCh0aGlzLGEsZSk7dGhpcy5fX0NFX2hhc1JlZ2lzdHJ5P0EoYixhKTp2KGIsYSk7cmV0dXJuIGF9KTtxKERvY3VtZW50LnByb3RvdHlwZSxcImNyZWF0ZUVsZW1lbnROU1wiLGZ1bmN0aW9uKGEsZSl7aWYodGhpcy5fX0NFX2hhc1JlZ2lzdHJ5JiYobnVsbD09PWF8fFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiPT09YSkpe3ZhciBjPWIuYS5nZXQoZSk7aWYoYylyZXR1cm4gbmV3IGMuY29uc3RydWN0b3J9YT1kYS5jYWxsKHRoaXMsYSxlKTt3KGIsYSk7cmV0dXJuIGF9KTtcbnBhKGIsRG9jdW1lbnQucHJvdG90eXBlLHtpOmZhLGFwcGVuZDpnYX0pfTtmdW5jdGlvbiByYSgpe3ZhciBiPVk7ZnVuY3Rpb24gYShhLGMpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLFwidGV4dENvbnRlbnRcIix7ZW51bWVyYWJsZTpjLmVudW1lcmFibGUsY29uZmlndXJhYmxlOiEwLGdldDpjLmdldCxzZXQ6ZnVuY3Rpb24oYSl7aWYodGhpcy5ub2RlVHlwZT09PU5vZGUuVEVYVF9OT0RFKWMuc2V0LmNhbGwodGhpcyxhKTtlbHNle3ZhciBkPXZvaWQgMDtpZih0aGlzLmZpcnN0Q2hpbGQpe3ZhciBlPXRoaXMuY2hpbGROb2Rlcyx1PWUubGVuZ3RoO2lmKDA8dSYmbCh0aGlzKSlmb3IodmFyIGQ9QXJyYXkodSkscD0wO3A8dTtwKyspZFtwXT1lW3BdfWMuc2V0LmNhbGwodGhpcyxhKTtpZihkKWZvcihhPTA7YTxkLmxlbmd0aDthKyspeihiLGRbYV0pfX19KX1xKE5vZGUucHJvdG90eXBlLFwiaW5zZXJ0QmVmb3JlXCIsZnVuY3Rpb24oYSxjKXtpZihhIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCl7dmFyIGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGEuY2hpbGROb2Rlcyk7XG5hPUkuY2FsbCh0aGlzLGEsYyk7aWYobCh0aGlzKSlmb3IoYz0wO2M8ZC5sZW5ndGg7YysrKXgoYixkW2NdKTtyZXR1cm4gYX1kPWwoYSk7Yz1JLmNhbGwodGhpcyxhLGMpO2QmJnooYixhKTtsKHRoaXMpJiZ4KGIsYSk7cmV0dXJuIGN9KTtxKE5vZGUucHJvdG90eXBlLFwiYXBwZW5kQ2hpbGRcIixmdW5jdGlvbihhKXtpZihhIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCl7dmFyIGM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGEuY2hpbGROb2Rlcyk7YT1ILmNhbGwodGhpcyxhKTtpZihsKHRoaXMpKWZvcih2YXIgZD0wO2Q8Yy5sZW5ndGg7ZCsrKXgoYixjW2RdKTtyZXR1cm4gYX1jPWwoYSk7ZD1ILmNhbGwodGhpcyxhKTtjJiZ6KGIsYSk7bCh0aGlzKSYmeChiLGEpO3JldHVybiBkfSk7cShOb2RlLnByb3RvdHlwZSxcImNsb25lTm9kZVwiLGZ1bmN0aW9uKGEpe2E9Ry5jYWxsKHRoaXMsYSk7dGhpcy5vd25lckRvY3VtZW50Ll9fQ0VfaGFzUmVnaXN0cnk/QShiLGEpOnYoYixhKTtcbnJldHVybiBhfSk7cShOb2RlLnByb3RvdHlwZSxcInJlbW92ZUNoaWxkXCIsZnVuY3Rpb24oYSl7dmFyIGM9bChhKSxkPUouY2FsbCh0aGlzLGEpO2MmJnooYixhKTtyZXR1cm4gZH0pO3EoTm9kZS5wcm90b3R5cGUsXCJyZXBsYWNlQ2hpbGRcIixmdW5jdGlvbihhLGMpe2lmKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTthPUsuY2FsbCh0aGlzLGEsYyk7aWYobCh0aGlzKSlmb3IoeihiLGMpLGM9MDtjPGQubGVuZ3RoO2MrKyl4KGIsZFtjXSk7cmV0dXJuIGF9dmFyIGQ9bChhKSxlPUsuY2FsbCh0aGlzLGEsYyksZj1sKHRoaXMpO2YmJnooYixjKTtkJiZ6KGIsYSk7ZiYmeChiLGEpO3JldHVybiBlfSk7TCYmTC5nZXQ/YShOb2RlLnByb3RvdHlwZSxMKTp0KGIsZnVuY3Rpb24oYil7YShiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtmb3IodmFyIGE9W10sYj1cbjA7Yjx0aGlzLmNoaWxkTm9kZXMubGVuZ3RoO2IrKylhLnB1c2godGhpcy5jaGlsZE5vZGVzW2JdLnRleHRDb250ZW50KTtyZXR1cm4gYS5qb2luKFwiXCIpfSxzZXQ6ZnVuY3Rpb24oYSl7Zm9yKDt0aGlzLmZpcnN0Q2hpbGQ7KUouY2FsbCh0aGlzLHRoaXMuZmlyc3RDaGlsZCk7SC5jYWxsKHRoaXMsZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpfX0pfSl9O2Z1bmN0aW9uIHNhKGIpe3ZhciBhPUVsZW1lbnQucHJvdG90eXBlO2EuYmVmb3JlPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxkPTA7ZDxhcmd1bWVudHMubGVuZ3RoOysrZCljW2QtMF09YXJndW1lbnRzW2RdO2Q9Yy5maWx0ZXIoZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBOb2RlJiZsKGEpfSk7amEuYXBwbHkodGhpcyxjKTtmb3IodmFyIGU9MDtlPGQubGVuZ3RoO2UrKyl6KGIsZFtlXSk7aWYobCh0aGlzKSlmb3IoZD0wO2Q8Yy5sZW5ndGg7ZCsrKWU9Y1tkXSxlIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGUpfTthLmFmdGVyPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz1bXSxkPTA7ZDxhcmd1bWVudHMubGVuZ3RoOysrZCljW2QtMF09YXJndW1lbnRzW2RdO2Q9Yy5maWx0ZXIoZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBOb2RlJiZsKGEpfSk7a2EuYXBwbHkodGhpcyxjKTtmb3IodmFyIGU9MDtlPGQubGVuZ3RoO2UrKyl6KGIsZFtlXSk7aWYobCh0aGlzKSlmb3IoZD1cbjA7ZDxjLmxlbmd0aDtkKyspZT1jW2RdLGUgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZSl9O2EucmVwbGFjZVdpdGg9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGFyZ3VtZW50cy5sZW5ndGg7KytkKWNbZC0wXT1hcmd1bWVudHNbZF07dmFyIGQ9Yy5maWx0ZXIoZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBOb2RlJiZsKGEpfSksZT1sKHRoaXMpO2xhLmFwcGx5KHRoaXMsYyk7Zm9yKHZhciBmPTA7ZjxkLmxlbmd0aDtmKyspeihiLGRbZl0pO2lmKGUpZm9yKHooYix0aGlzKSxkPTA7ZDxjLmxlbmd0aDtkKyspZT1jW2RdLGUgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZSl9O2EucmVtb3ZlPWZ1bmN0aW9uKCl7dmFyIGE9bCh0aGlzKTttYS5jYWxsKHRoaXMpO2EmJnooYix0aGlzKX19O2Z1bmN0aW9uIHRhKCl7dmFyIGI9WTtmdW5jdGlvbiBhKGEsYyl7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsXCJpbm5lckhUTUxcIix7ZW51bWVyYWJsZTpjLmVudW1lcmFibGUsY29uZmlndXJhYmxlOiEwLGdldDpjLmdldCxzZXQ6ZnVuY3Rpb24oYSl7dmFyIGQ9dGhpcyxlPXZvaWQgMDtsKHRoaXMpJiYoZT1bXSxuKHRoaXMsZnVuY3Rpb24oYSl7YSE9PWQmJmUucHVzaChhKX0pKTtjLnNldC5jYWxsKHRoaXMsYSk7aWYoZSlmb3IodmFyIGY9MDtmPGUubGVuZ3RoO2YrKyl7dmFyIGg9ZVtmXTsxPT09aC5fX0NFX3N0YXRlJiZiLmRpc2Nvbm5lY3RlZENhbGxiYWNrKGgpfXRoaXMub3duZXJEb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5P0EoYix0aGlzKTp2KGIsdGhpcyk7cmV0dXJuIGF9fSl9ZnVuY3Rpb24gZShhLGMpe3EoYSxcImluc2VydEFkamFjZW50RWxlbWVudFwiLGZ1bmN0aW9uKGEsZCl7dmFyIGU9bChkKTthPWMuY2FsbCh0aGlzLGEsZCk7ZSYmeihiLGQpO2woYSkmJngoYixkKTtcbnJldHVybiBhfSl9TT9xKEVsZW1lbnQucHJvdG90eXBlLFwiYXR0YWNoU2hhZG93XCIsZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX19DRV9zaGFkb3dSb290PWE9TS5jYWxsKHRoaXMsYSl9KTpjb25zb2xlLndhcm4oXCJDdXN0b20gRWxlbWVudHM6IGBFbGVtZW50I2F0dGFjaFNoYWRvd2Agd2FzIG5vdCBwYXRjaGVkLlwiKTtpZihOJiZOLmdldClhKEVsZW1lbnQucHJvdG90eXBlLE4pO2Vsc2UgaWYoVyYmVy5nZXQpYShIVE1MRWxlbWVudC5wcm90b3R5cGUsVyk7ZWxzZXt2YXIgYz1GLmNhbGwoZG9jdW1lbnQsXCJkaXZcIik7dChiLGZ1bmN0aW9uKGIpe2EoYix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEcuY2FsbCh0aGlzLCEwKS5pbm5lckhUTUx9LHNldDpmdW5jdGlvbihhKXt2YXIgYj1cInRlbXBsYXRlXCI9PT10aGlzLmxvY2FsTmFtZT90aGlzLmNvbnRlbnQ6dGhpcztmb3IoYy5pbm5lckhUTUw9YTswPGIuY2hpbGROb2Rlcy5sZW5ndGg7KUouY2FsbChiLFxuYi5jaGlsZE5vZGVzWzBdKTtmb3IoOzA8Yy5jaGlsZE5vZGVzLmxlbmd0aDspSC5jYWxsKGIsYy5jaGlsZE5vZGVzWzBdKX19KX0pfXEoRWxlbWVudC5wcm90b3R5cGUsXCJzZXRBdHRyaWJ1dGVcIixmdW5jdGlvbihhLGMpe2lmKDEhPT10aGlzLl9fQ0Vfc3RhdGUpcmV0dXJuIFEuY2FsbCh0aGlzLGEsYyk7dmFyIGQ9Ty5jYWxsKHRoaXMsYSk7US5jYWxsKHRoaXMsYSxjKTtjPU8uY2FsbCh0aGlzLGEpO2QhPT1jJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGEsZCxjLG51bGwpfSk7cShFbGVtZW50LnByb3RvdHlwZSxcInNldEF0dHJpYnV0ZU5TXCIsZnVuY3Rpb24oYSxjLGUpe2lmKDEhPT10aGlzLl9fQ0Vfc3RhdGUpcmV0dXJuIFQuY2FsbCh0aGlzLGEsYyxlKTt2YXIgZD1TLmNhbGwodGhpcyxhLGMpO1QuY2FsbCh0aGlzLGEsYyxlKTtlPVMuY2FsbCh0aGlzLGEsYyk7ZCE9PWUmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYyxkLGUsYSl9KTtxKEVsZW1lbnQucHJvdG90eXBlLFxuXCJyZW1vdmVBdHRyaWJ1dGVcIixmdW5jdGlvbihhKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBSLmNhbGwodGhpcyxhKTt2YXIgYz1PLmNhbGwodGhpcyxhKTtSLmNhbGwodGhpcyxhKTtudWxsIT09YyYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcyxhLGMsbnVsbCxudWxsKX0pO3EoRWxlbWVudC5wcm90b3R5cGUsXCJyZW1vdmVBdHRyaWJ1dGVOU1wiLGZ1bmN0aW9uKGEsYyl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gVS5jYWxsKHRoaXMsYSxjKTt2YXIgZD1TLmNhbGwodGhpcyxhLGMpO1UuY2FsbCh0aGlzLGEsYyk7dmFyIGU9Uy5jYWxsKHRoaXMsYSxjKTtkIT09ZSYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcyxjLGQsZSxhKX0pO1g/ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsWCk6Vj9lKEVsZW1lbnQucHJvdG90eXBlLFYpOmNvbnNvbGUud2FybihcIkN1c3RvbSBFbGVtZW50czogYEVsZW1lbnQjaW5zZXJ0QWRqYWNlbnRFbGVtZW50YCB3YXMgbm90IHBhdGNoZWQuXCIpO1xucGEoYixFbGVtZW50LnByb3RvdHlwZSx7aTpoYSxhcHBlbmQ6aWF9KTtzYShiKX07XG52YXIgWj13aW5kb3cuY3VzdG9tRWxlbWVudHM7aWYoIVp8fFouZm9yY2VQb2x5ZmlsbHx8XCJmdW5jdGlvblwiIT10eXBlb2YgWi5kZWZpbmV8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIFouZ2V0KXt2YXIgWT1uZXcgcjtvYSgpO3FhKCk7cmEoKTt0YSgpO2RvY3VtZW50Ll9fQ0VfaGFzUmVnaXN0cnk9ITA7dmFyIHVhPW5ldyBFKFkpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csXCJjdXN0b21FbGVtZW50c1wiLHtjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCx2YWx1ZTp1YX0pfTtcbn0pLmNhbGwoc2VsZik7XG59XG59KCkpOyIsIi8qIFVNRC5kZWZpbmUgKi8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBjdXN0b21Mb2FkZXIgPT09ICdmdW5jdGlvbicpeyBjdXN0b21Mb2FkZXIoZmFjdG9yeSwgJ2RvbScpOyB9ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7IGRlZmluZShbXSwgZmFjdG9yeSk7IH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpOyB9IGVsc2UgeyByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7IHdpbmRvdy5kb20gPSBmYWN0b3J5KCk7IH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyXG4gICAgICAgIGlzRmxvYXQgPSB7XG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgekluZGV4OiAxLFxuICAgICAgICAgICAgJ3otaW5kZXgnOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGlzRGltZW5zaW9uID0ge1xuICAgICAgICAgICAgd2lkdGg6MSxcbiAgICAgICAgICAgIGhlaWdodDoxLFxuICAgICAgICAgICAgdG9wOjEsXG4gICAgICAgICAgICBsZWZ0OjEsXG4gICAgICAgICAgICByaWdodDoxLFxuICAgICAgICAgICAgYm90dG9tOjEsXG4gICAgICAgICAgICBtYXhXaWR0aDoxLFxuICAgICAgICAgICAgJ21heC13aWR0aCc6MSxcbiAgICAgICAgICAgIG1pbldpZHRoOjEsXG4gICAgICAgICAgICAnbWluLXdpZHRoJzoxLFxuICAgICAgICAgICAgbWF4SGVpZ2h0OjEsXG4gICAgICAgICAgICAnbWF4LWhlaWdodCc6MVxuICAgICAgICB9LFxuICAgICAgICB1aWRzID0ge30sXG4gICAgICAgIGRlc3Ryb3llciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgZnVuY3Rpb24gdWlkICh0eXBlKXtcblx0XHR0eXBlID0gdHlwZSB8fCAndWlkJztcbiAgICAgICAgaWYodWlkc1t0eXBlXSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHVpZHNbdHlwZV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZCA9IHR5cGUgKyAnLScgKyAodWlkc1t0eXBlXSArIDEpO1xuICAgICAgICB1aWRzW3R5cGVdKys7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc05vZGUgKGl0ZW0pe1xuICAgICAgICAvLyBzYWZlciB0ZXN0IGZvciBjdXN0b20gZWxlbWVudHMgaW4gRkYgKHdpdGggd2Mgc2hpbSlcblx0ICAgIC8vIGZyYWdtZW50IGlzIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgIHJldHVybiAhIWl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICh0eXBlb2YgaXRlbS5pbm5lckhUTUwgPT09ICdzdHJpbmcnIHx8IGl0ZW0ubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQtZnJhZ21lbnQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBieUlkIChpdGVtKXtcblx0XHRpZih0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpe1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW0pO1xuXHRcdH1cblx0XHRyZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHlsZSAobm9kZSwgcHJvcCwgdmFsdWUpe1xuICAgICAgICB2YXIga2V5LCBjb21wdXRlZDtcbiAgICAgICAgaWYodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIC8vIG9iamVjdCBzZXR0ZXJcbiAgICAgICAgICAgIGZvcihrZXkgaW4gcHJvcCl7XG4gICAgICAgICAgICAgICAgaWYocHJvcC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUobm9kZSwga2V5LCBwcm9wW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9ZWxzZSBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IHNldHRlclxuICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0RpbWVuc2lvbltwcm9wXSl7XG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJ3B4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldHRlciwgaWYgYSBzaW1wbGUgc3R5bGVcbiAgICAgICAgaWYobm9kZS5zdHlsZVtwcm9wXSl7XG4gICAgICAgICAgICBpZihpc0RpbWVuc2lvbltwcm9wXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG5vZGUuc3R5bGVbcHJvcF0sIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGlzRmxvYXRbcHJvcF0pe1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG5vZGUuc3R5bGVbcHJvcF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuc3R5bGVbcHJvcF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXR0ZXIsIGNvbXB1dGVkXG4gICAgICAgIGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBwcm9wKTtcbiAgICAgICAgaWYoY29tcHV0ZWRbcHJvcF0pe1xuICAgICAgICAgICAgaWYoL1xcZC8udGVzdChjb21wdXRlZFtwcm9wXSkpe1xuICAgICAgICAgICAgICAgIGlmKCFpc05hTihwYXJzZUludChjb21wdXRlZFtwcm9wXSwgMTApKSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChjb21wdXRlZFtwcm9wXSwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRbcHJvcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGF0dHIgKG5vZGUsIHByb3AsIHZhbHVlKXtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgaWYodHlwZW9mIHByb3AgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIGZvcihrZXkgaW4gcHJvcCl7XG4gICAgICAgICAgICAgICAgaWYocHJvcC5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIHByb3Bba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGlmKHByb3AgPT09ICd0ZXh0JyB8fCBwcm9wID09PSAnaHRtbCcgfHwgcHJvcCA9PT0gJ2lubmVySFRNTCcpIHtcbiAgICAgICAgICAgIFx0Ly8gaWdub3JlLCBoYW5kbGVkIGR1cmluZyBjcmVhdGlvblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHByb3AgPT09ICdjbGFzc05hbWUnIHx8IHByb3AgPT09ICdjbGFzcycpIHtcblx0XHRcdFx0ZG9tLmNsYXNzTGlzdC5hZGQobm9kZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZihwcm9wID09PSAnc3R5bGUnKSB7XG5cdFx0XHRcdHN0eWxlKG5vZGUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYocHJvcCA9PT0gJ2F0dHInKSB7XG4gICAgICAgICAgICBcdC8vIGJhY2sgY29tcGF0XG5cdFx0XHRcdGF0dHIobm9kZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIFx0Ly8gb2JqZWN0LCBsaWtlICdkYXRhJ1xuXHRcdFx0XHRub2RlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShwcm9wKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib3ggKG5vZGUpe1xuICAgICAgICBpZihub2RlID09PSB3aW5kb3cpe1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBub2RlIGRpbWVuc2lvbnNcbiAgICAgICAgLy8gcmV0dXJuZWQgb2JqZWN0IGlzIGltbXV0YWJsZVxuICAgICAgICAvLyBhZGQgc2Nyb2xsIHBvc2l0aW9uaW5nIGFuZCBjb252ZW5pZW5jZSBhYmJyZXZpYXRpb25zXG4gICAgICAgIHZhclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IGJ5SWQobm9kZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGRpbWVuc2lvbnMudG9wLFxuICAgICAgICAgICAgcmlnaHQ6IGRpbWVuc2lvbnMucmlnaHQsXG4gICAgICAgICAgICBib3R0b206IGRpbWVuc2lvbnMuYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogZGltZW5zaW9ucy5sZWZ0LFxuICAgICAgICAgICAgaGVpZ2h0OiBkaW1lbnNpb25zLmhlaWdodCxcbiAgICAgICAgICAgIGg6IGRpbWVuc2lvbnMuaGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IGRpbWVuc2lvbnMud2lkdGgsXG4gICAgICAgICAgICB3OiBkaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgICAgc2Nyb2xsWTogd2luZG93LnNjcm9sbFksXG4gICAgICAgICAgICBzY3JvbGxYOiB3aW5kb3cuc2Nyb2xsWCxcbiAgICAgICAgICAgIHg6IGRpbWVuc2lvbnMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgIHk6IGRpbWVuc2lvbnMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVlcnkgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIXNlbGVjdG9yKXtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcXVlcnlBbGwgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIXNlbGVjdG9yKXtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm9kZXMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgICAgIGlmKCFub2Rlcy5sZW5ndGgpeyByZXR1cm4gW107IH1cblxuICAgICAgICAvLyBjb252ZXJ0IHRvIEFycmF5IGFuZCByZXR1cm4gaXRcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0RvbSAoaHRtbCwgb3B0aW9ucywgcGFyZW50KXtcbiAgICAgICAgdmFyIG5vZGUgPSBkb20oJ2RpdicsIHtodG1sOiBodG1sfSk7XG4gICAgICAgIHBhcmVudCA9IGJ5SWQocGFyZW50IHx8IG9wdGlvbnMpO1xuICAgICAgICBpZihwYXJlbnQpe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5maXJzdENoaWxkKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYoaHRtbC5pbmRleE9mKCc8JykgIT09IDApe1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tRG9tIChub2RlKSB7XG4gICAgICAgIGZ1bmN0aW9uIGdldEF0dHJzIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgYXR0LCBpLCBhdHRycyA9IHt9O1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBhdHQgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgYXR0cnNbYXR0LmxvY2FsTmFtZV0gPSBub3JtYWxpemUoYXR0LnZhbHVlID09PSAnJyA/IHRydWUgOiBhdHQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF0dHJzO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFRleHQgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBpLCB0LCB0ZXh0ID0gJyc7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHQgPSBub2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgaWYodC5ub2RlVHlwZSA9PT0gMyAmJiB0LnRleHRDb250ZW50LnRyaW0oKSl7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gdC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGksIG9iamVjdCA9IGdldEF0dHJzKG5vZGUpO1xuICAgICAgICBvYmplY3QudGV4dCA9IGdldFRleHQobm9kZSk7XG4gICAgICAgIG9iamVjdC5jaGlsZHJlbiA9IFtdO1xuICAgICAgICBpZihub2RlLmNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBvYmplY3QuY2hpbGRyZW4ucHVzaChmcm9tRG9tKG5vZGUuY2hpbGRyZW5baV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuXHRmdW5jdGlvbiBhZGRDaGlsZHJlbiAobm9kZSwgY2hpbGRyZW4pIHtcblx0XHRpZihBcnJheS5pc0FycmF5KGNoaWxkcmVuKSl7XG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRpZihjaGlsZHJlbltpXSkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgY2hpbGRyZW5baV0gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKHRvRG9tKGNoaWxkcmVuW2ldKSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGRyZW5baV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChjaGlsZHJlbikge1xuXHRcdFx0bm9kZS5hcHBlbmRDaGlsZChjaGlsZHJlbik7XG5cdFx0fVxuXHR9XG5cbiAgICBmdW5jdGlvbiBhZGRDb250ZW50IChub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBodG1sO1xuICAgICAgICBpZihvcHRpb25zLmh0bWwgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmlubmVySFRNTCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGh0bWwgPSBvcHRpb25zLmh0bWwgfHwgb3B0aW9ucy5pbm5lckhUTUwgfHwgJyc7XG4gICAgICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgIGFkZENoaWxkcmVuKG5vZGUsIGh0bWwpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBcdC8vIGNhcmVmdWwgYXNzdW1pbmcgdGV4dENvbnRlbnQgLVxuXHRcdFx0XHQvLyBtaXNzZXMgc29tZSBIVE1MLCBzdWNoIGFzIGVudGl0aWVzICgmbnBzcDspXG4gICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKG9wdGlvbnMudGV4dCl7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG9wdGlvbnMudGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9wdGlvbnMuY2hpbGRyZW4pe1xuICAgICAgICAgICAgYWRkQ2hpbGRyZW4obm9kZSwgb3B0aW9ucy5jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZG9tIChub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50LCBwcmVwZW5kKXtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdC8vIGlmIGZpcnN0IGFyZ3VtZW50IGlzIGEgc3RyaW5nIGFuZCBzdGFydHMgd2l0aCA8LCBwYXNzIHRvIHRvRG9tKClcbiAgICAgICAgaWYobm9kZVR5cGUuaW5kZXhPZignPCcpID09PSAwKXtcbiAgICAgICAgICAgIHJldHVybiB0b0RvbShub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlVHlwZSk7XG5cbiAgICAgICAgcGFyZW50ID0gYnlJZChwYXJlbnQpO1xuXG4gICAgICAgIGFkZENvbnRlbnQobm9kZSwgb3B0aW9ucyk7XG5cblx0XHRhdHRyKG5vZGUsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKHBhcmVudCAmJiBpc05vZGUocGFyZW50KSl7XG4gICAgICAgICAgICBpZihwcmVwZW5kICYmIHBhcmVudC5oYXNDaGlsZE5vZGVzKCkpe1xuICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc2VydEFmdGVyIChyZWZOb2RlLCBub2RlKSB7XG4gICAgICAgIHZhciBzaWJsaW5nID0gcmVmTm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmKCFzaWJsaW5nKXtcbiAgICAgICAgICAgIHJlZk5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZWZOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIHNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWJsaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3kgKG5vZGUpe1xuICAgICAgICAvLyBkZXN0cm95cyBhIG5vZGUgY29tcGxldGVseVxuICAgICAgICAvL1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICBkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICBkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbiAobm9kZSwgZGlzcG9zZSl7XG4gICAgICAgIC8vXHRSZW1vdmVzIGFsbCBjaGlsZCBub2Rlc1xuICAgICAgICAvL1x0XHRkaXNwb3NlOiBkZXN0cm95IGNoaWxkIG5vZGVzXG4gICAgICAgIGlmKGRpc3Bvc2Upe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGRlc3Ryb3kobm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRvbS5mcmFnID0gZnVuY3Rpb24gKG5vZGVzKSB7XG5cdFx0dmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRmcmFnLmFwcGVuZENoaWxkKGFyZ3VtZW50c1tpXSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KG5vZGVzKSkge1xuXHRcdFx0XHRub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRcdFx0ZnJhZy5hcHBlbmRDaGlsZChuKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmcmFnLmFwcGVuZENoaWxkKG5vZGVzKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZyYWc7XG5cdH07XG5cbiAgICBkb20uY2xhc3NMaXN0ID0ge1xuICAgIFx0Ly8gaW4gYWRkaXRpb24gdG8gZml4aW5nIElFMTEgdG9nZ2xlXG5cdFx0Ly8gdGhlc2UgbWV0aG9kcyBhbHNvIGhhbmRsZSBhcnJheXNcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgdG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYWRkOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMpe1xuICAgICAgICAgICAgdG9BcnJheShuYW1lcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICByZXR1cm4gdG9BcnJheShuYW1lcykuZXZlcnkoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5jbGFzc0xpc3QuY29udGFpbnMobmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbiAobm9kZSwgbmFtZXMsIHZhbHVlKXtcbiAgICAgICAgICAgIG5hbWVzID0gdG9BcnJheShuYW1lcyk7XG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlIHN0YW5kYXJkIGZ1bmN0aW9uYWxpdHksIHN1cHBvcnRlZCBieSBJRVxuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QudG9nZ2xlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCB0aGUgc2Vjb25kIHBhcmFtZXRlciAgXG4gICAgICAgICAgICBlbHNlIGlmKHZhbHVlKXtcbiAgICAgICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdG9BcnJheSAobmFtZXMpe1xuICAgICAgICBpZighbmFtZXMpe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignZG9tLmNsYXNzTGlzdCBzaG91bGQgaW5jbHVkZSBhIG5vZGUgYW5kIGEgY2xhc3NOYW1lJyk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWVzLnNwbGl0KCcgJykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZS50cmltKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXHRmdW5jdGlvbiBub3JtYWxpemUodmFsKSB7XG5cdFx0aWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR2YWwgPSB2YWwudHJpbSgpO1xuXHRcdFx0aWYgKHZhbCA9PT0gJ2ZhbHNlJykge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9IGVsc2UgaWYgKHZhbCA9PT0gJ251bGwnKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fSBlbHNlIGlmICh2YWwgPT09ICd0cnVlJykge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdC8vIGZpbmRzIHN0cmluZ3MgdGhhdCBzdGFydCB3aXRoIG51bWJlcnMsIGJ1dCBhcmUgbm90IG51bWJlcnM6XG5cdFx0XHQvLyAnMXRlYW0nICcxMjMgU3RyZWV0JywgJzEtMi0zJywgZXRjXG5cdFx0XHRpZiAoKCcnICsgdmFsKS5yZXBsYWNlKC8tP1xcZCpcXC4/XFxkKi8sICcnKS5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCFpc05hTihwYXJzZUZsb2F0KHZhbCkpKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VGbG9hdCh2YWwpO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsO1xuXHR9XG5cbiAgICBkb20ubm9ybWFsaXplID0gbm9ybWFsaXplO1xuICAgIGRvbS5jbGVhbiA9IGNsZWFuO1xuICAgIGRvbS5xdWVyeSA9IHF1ZXJ5O1xuICAgIGRvbS5xdWVyeUFsbCA9IHF1ZXJ5QWxsO1xuICAgIGRvbS5ieUlkID0gYnlJZDtcbiAgICBkb20uYXR0ciA9IGF0dHI7XG4gICAgZG9tLmJveCA9IGJveDtcbiAgICBkb20uc3R5bGUgPSBzdHlsZTtcbiAgICBkb20uZGVzdHJveSA9IGRlc3Ryb3k7XG4gICAgZG9tLnVpZCA9IHVpZDtcbiAgICBkb20uaXNOb2RlID0gaXNOb2RlO1xuICAgIGRvbS50b0RvbSA9IHRvRG9tO1xuICAgIGRvbS5mcm9tRG9tID0gZnJvbURvbTtcbiAgICBkb20uaW5zZXJ0QWZ0ZXIgPSBpbnNlcnRBZnRlcjtcblxuICAgIHJldHVybiBkb207XG59KSk7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBjdXN0b21Mb2FkZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRjdXN0b21Mb2FkZXIoZmFjdG9yeSwgJ29uJyk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHtcblx0XHRyb290LnJldHVybkV4cG9ydHMgPSB3aW5kb3cub24gPSBmYWN0b3J5KCk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gbWFpbiBmdW5jdGlvblxuXG5cdGZ1bmN0aW9uIG9uIChub2RlLCBldmVudE5hbWUsIGZpbHRlciwgaGFuZGxlcikge1xuXHRcdC8vIG5vcm1hbGl6ZSBwYXJhbWV0ZXJzXG5cdFx0aWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykge1xuXHRcdFx0bm9kZSA9IGdldE5vZGVCeUlkKG5vZGUpO1xuXHRcdH1cblxuXHRcdC8vIHByZXBhcmUgYSBjYWxsYmFja1xuXHRcdHZhciBjYWxsYmFjayA9IG1ha2VDYWxsYmFjayhub2RlLCBmaWx0ZXIsIGhhbmRsZXIpO1xuXG5cdFx0Ly8gZnVuY3Rpb25hbCBldmVudFxuXHRcdGlmICh0eXBlb2YgZXZlbnROYW1lID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4gZXZlbnROYW1lKG5vZGUsIGNhbGxiYWNrKTtcblx0XHR9XG5cblx0XHQvLyBzcGVjaWFsIGNhc2U6IGtleWRvd24va2V5dXAgd2l0aCBhIGxpc3Qgb2YgZXhwZWN0ZWQga2V5c1xuXHRcdC8vIFRPRE86IGNvbnNpZGVyIHJlcGxhY2luZyB3aXRoIGFuIGV4cGxpY2l0IGV2ZW50IGZ1bmN0aW9uOlxuXHRcdC8vIHZhciBoID0gb24obm9kZSwgb25LZXlFdmVudCgna2V5dXAnLCAvRW50ZXIsRXNjLyksIGNhbGxiYWNrKTtcblx0XHR2YXIga2V5RXZlbnQgPSAvXihrZXl1cHxrZXlkb3duKTooLispJC8uZXhlYyhldmVudE5hbWUpO1xuXHRcdGlmIChrZXlFdmVudCkge1xuXHRcdFx0cmV0dXJuIG9uS2V5RXZlbnQoa2V5RXZlbnRbMV0sIG5ldyBSZWdFeHAoa2V5RXZlbnRbMl0uc3BsaXQoJywnKS5qb2luKCd8JykpKShub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIG11bHRpcGxlIGV2ZW50IHR5cGVzLCBsaWtlOiBvbihub2RlLCAnbW91c2V1cCwgbW91c2Vkb3duJywgY2FsbGJhY2spO1xuXHRcdGlmICgvLC8udGVzdChldmVudE5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gb24ubWFrZU11bHRpSGFuZGxlKGV2ZW50TmFtZS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0XHRyZXR1cm4gbmFtZS50cmltKCk7XG5cdFx0XHR9KS5maWx0ZXIoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0XHR9KS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIG9uKG5vZGUsIG5hbWUsIGNhbGxiYWNrKTtcblx0XHRcdH0pKTtcblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgcmVnaXN0ZXJlZCBmdW5jdGlvbmFsIGV2ZW50c1xuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob24uZXZlbnRzLCBldmVudE5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gb24uZXZlbnRzW2V2ZW50TmFtZV0obm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIHNwZWNpYWwgY2FzZTogbG9hZGluZyBhbiBpbWFnZVxuXHRcdGlmIChldmVudE5hbWUgPT09ICdsb2FkJyAmJiBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ltZycpIHtcblx0XHRcdHJldHVybiBvbkltYWdlTG9hZChub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gc3BlY2lhbCBjYXNlOiBtb3VzZXdoZWVsXG5cdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ3doZWVsJykge1xuXHRcdFx0Ly8gcGFzcyB0aHJvdWdoLCBidXQgZmlyc3QgY3VycnkgY2FsbGJhY2sgdG8gd2hlZWwgZXZlbnRzXG5cdFx0XHRjYWxsYmFjayA9IG5vcm1hbGl6ZVdoZWVsRXZlbnQoY2FsbGJhY2spO1xuXHRcdFx0aWYgKCFoYXNXaGVlbCkge1xuXHRcdFx0XHQvLyBvbGQgRmlyZWZveCwgb2xkIElFLCBDaHJvbWVcblx0XHRcdFx0cmV0dXJuIG9uLm1ha2VNdWx0aUhhbmRsZShbXG5cdFx0XHRcdFx0b24obm9kZSwgJ0RPTU1vdXNlU2Nyb2xsJywgY2FsbGJhY2spLFxuXHRcdFx0XHRcdG9uKG5vZGUsICdtb3VzZXdoZWVsJywgY2FsbGJhY2spXG5cdFx0XHRcdF0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHNwZWNpYWwgY2FzZToga2V5Ym9hcmRcblx0XHRpZiAoL15rZXkvLnRlc3QoZXZlbnROYW1lKSkge1xuXHRcdFx0Y2FsbGJhY2sgPSBub3JtYWxpemVLZXlFdmVudChjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gZGVmYXVsdCBjYXNlXG5cdFx0cmV0dXJuIG9uLm9uRG9tRXZlbnQobm9kZSwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH1cblxuXHQvLyByZWdpc3RlcmVkIGZ1bmN0aW9uYWwgZXZlbnRzXG5cdG9uLmV2ZW50cyA9IHtcblx0XHQvLyBoYW5kbGUgY2xpY2sgYW5kIEVudGVyXG5cdFx0YnV0dG9uOiBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcblx0XHRcdHJldHVybiBvbi5tYWtlTXVsdGlIYW5kbGUoW1xuXHRcdFx0XHRvbihub2RlLCAnY2xpY2snLCBjYWxsYmFjayksXG5cdFx0XHRcdG9uKG5vZGUsICdrZXl1cDpFbnRlcicsIGNhbGxiYWNrKVxuXHRcdFx0XSk7XG5cdFx0fSxcblxuXHRcdC8vIGN1c3RvbSAtIHVzZWQgZm9yIHBvcHVwcyAnbiBzdHVmZlxuXHRcdGNsaWNrb2ZmOiBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcblx0XHRcdC8vIGltcG9ydGFudCBub3RlIVxuXHRcdFx0Ly8gc3RhcnRzIHBhdXNlZFxuXHRcdFx0Ly9cblx0XHRcdHZhciBiSGFuZGxlID0gb24obm9kZS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuXHRcdFx0XHRpZiAodGFyZ2V0Lm5vZGVUeXBlICE9PSAxKSB7XG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRhcmdldCAmJiAhbm9kZS5jb250YWlucyh0YXJnZXQpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgaGFuZGxlID0ge1xuXHRcdFx0XHRzdGF0ZTogJ3Jlc3VtZWQnLFxuXHRcdFx0XHRyZXN1bWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGJIYW5kbGUucmVzdW1lKCk7XG5cdFx0XHRcdFx0fSwgMTAwKTtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gJ3Jlc3VtZWQnO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRwYXVzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJIYW5kbGUucGF1c2UoKTtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJlbW92ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJIYW5kbGUucmVtb3ZlKCk7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdyZW1vdmVkJztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGhhbmRsZS5wYXVzZSgpO1xuXG5cdFx0XHRyZXR1cm4gaGFuZGxlO1xuXHRcdH1cblx0fTtcblxuXHQvLyBpbnRlcm5hbCBldmVudCBoYW5kbGVyc1xuXG5cdGZ1bmN0aW9uIG9uRG9tRXZlbnQgKG5vZGUsIGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdFx0bm9kZSA9IGNhbGxiYWNrID0gbnVsbDtcblx0XHRcdFx0dGhpcy5yZW1vdmUgPSB0aGlzLnBhdXNlID0gdGhpcy5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdH0sXG5cdFx0XHRwYXVzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fSxcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBvbkltYWdlTG9hZCAobm9kZSwgY2FsbGJhY2spIHtcblx0XHR2YXIgaGFuZGxlID0gb24ubWFrZU11bHRpSGFuZGxlKFtcblx0XHRcdG9uLm9uRG9tRXZlbnQobm9kZSwgJ2xvYWQnLCBvbkltYWdlTG9hZCksXG5cdFx0XHRvbihub2RlLCAnZXJyb3InLCBjYWxsYmFjaylcblx0XHRdKTtcblxuXHRcdHJldHVybiBoYW5kbGU7XG5cblx0XHRmdW5jdGlvbiBvbkltYWdlTG9hZCAoZSkge1xuXHRcdFx0dmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAobm9kZS5uYXR1cmFsV2lkdGggfHwgbm9kZS5uYXR1cmFsSGVpZ2h0KSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG5cdFx0XHRcdFx0ZS53aWR0aCAgPSBlLm5hdHVyYWxXaWR0aCAgPSBub2RlLm5hdHVyYWxXaWR0aDtcblx0XHRcdFx0XHRlLmhlaWdodCA9IGUubmF0dXJhbEhlaWdodCA9IG5vZGUubmF0dXJhbEhlaWdodDtcblx0XHRcdFx0XHRjYWxsYmFjayhlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgMTAwKTtcblx0XHRcdGhhbmRsZS5yZW1vdmUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvbktleUV2ZW50IChrZXlFdmVudE5hbWUsIHJlKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIG9uKG5vZGUsIGtleUV2ZW50TmFtZSwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKHJlLnRlc3QoZS5rZXkpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cdH1cblxuXHQvLyBpbnRlcm5hbCB1dGlsaXRpZXNcblxuXHR2YXIgaGFzV2hlZWwgPSAoZnVuY3Rpb24gaGFzV2hlZWxUZXN0ICgpIHtcblx0XHR2YXJcblx0XHRcdGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLFxuXHRcdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cmV0dXJuIFwib253aGVlbFwiIGluIGRpdiB8fCBcIndoZWVsXCIgaW4gZGl2IHx8XG5cdFx0XHQoaXNJRSAmJiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiRXZlbnRzLndoZWVsXCIsIFwiMy4wXCIpKTsgLy8gSUUgZmVhdHVyZSBkZXRlY3Rpb25cblx0fSkoKTtcblxuXHR2YXIgbWF0Y2hlcztcblx0WydtYXRjaGVzJywgJ21hdGNoZXNTZWxlY3RvcicsICd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nXS5zb21lKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0aWYgKG5hbWUubGVuZ3RoIDwgNykgeyAvLyBwcmVmaXhcblx0XHRcdG5hbWUgKz0gJ01hdGNoZXNTZWxlY3Rvcic7XG5cdFx0fVxuXHRcdGlmIChFbGVtZW50LnByb3RvdHlwZVtuYW1lXSkge1xuXHRcdFx0bWF0Y2hlcyA9IG5hbWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBjbG9zZXN0IChlbGVtZW50LCBzZWxlY3RvciwgcGFyZW50KSB7XG5cdFx0d2hpbGUgKGVsZW1lbnQpIHtcblx0XHRcdGlmIChlbGVtZW50W29uLm1hdGNoZXNdICYmIGVsZW1lbnRbb24ubWF0Y2hlc10oc2VsZWN0b3IpKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVsZW1lbnQgPT09IHBhcmVudCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0dmFyIElOVkFMSURfUFJPUFMgPSB7XG5cdFx0aXNUcnVzdGVkOiAxXG5cdH07XG5cdGZ1bmN0aW9uIG1peCAob2JqZWN0LCB2YWx1ZSkge1xuXHRcdGlmICghdmFsdWUpIHtcblx0XHRcdHJldHVybiBvYmplY3Q7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRmb3IodmFyIGtleSBpbiB2YWx1ZSl7XG5cdFx0XHRcdGlmICghSU5WQUxJRF9QUk9QU1trZXldKSB7XG5cdFx0XHRcdFx0b2JqZWN0W2tleV0gPSB2YWx1ZVtrZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9iamVjdC52YWx1ZSA9IHZhbHVlO1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0dmFyIGllS2V5cyA9IHtcblx0XHQvL2E6ICdURVNUJyxcblx0XHRVcDogJ0Fycm93VXAnLFxuXHRcdERvd246ICdBcnJvd0Rvd24nLFxuXHRcdExlZnQ6ICdBcnJvd0xlZnQnLFxuXHRcdFJpZ2h0OiAnQXJyb3dSaWdodCcsXG5cdFx0RXNjOiAnRXNjYXBlJyxcblx0XHRTcGFjZWJhcjogJyAnLFxuXHRcdFdpbjogJ0NvbW1hbmQnXG5cdH07XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplS2V5RXZlbnQgKGNhbGxiYWNrKSB7XG5cdFx0Ly8gSUUgdXNlcyBvbGQgc3BlY1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKGllS2V5c1tlLmtleV0pIHtcblx0XHRcdFx0dmFyIGZha2VFdmVudCA9IG1peCh7fSwgZSk7XG5cdFx0XHRcdGZha2VFdmVudC5rZXkgPSBpZUtleXNbZS5rZXldO1xuXHRcdFx0XHRjYWxsYmFjayhmYWtlRXZlbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dmFyXG5cdFx0RkFDVE9SID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdXaW5kb3dzJykgPiAtMSA/IDEwIDogMC4xLFxuXHRcdFhMUjggPSAwLFxuXHRcdG1vdXNlV2hlZWxIYW5kbGU7XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplV2hlZWxFdmVudCAoY2FsbGJhY2spIHtcblx0XHQvLyBub3JtYWxpemVzIGFsbCBicm93c2VycycgZXZlbnRzIHRvIGEgc3RhbmRhcmQ6XG5cdFx0Ly8gZGVsdGEsIHdoZWVsWSwgd2hlZWxYXG5cdFx0Ly8gYWxzbyBhZGRzIGFjY2VsZXJhdGlvbiBhbmQgZGVjZWxlcmF0aW9uIHRvIG1ha2Vcblx0XHQvLyBNYWMgYW5kIFdpbmRvd3MgYmVoYXZlIHNpbWlsYXJseVxuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0WExSOCArPSBGQUNUT1I7XG5cdFx0XHR2YXJcblx0XHRcdFx0ZGVsdGFZID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIChlLndoZWVsRGVsdGFZIHx8IGUuZGVsdGFZKSkpLFxuXHRcdFx0XHRkZWx0YVggPSBNYXRoLm1heCgtMTAsIE1hdGgubWluKDEwLCAoZS53aGVlbERlbHRhWCB8fCBlLmRlbHRhWCkpKTtcblxuXHRcdFx0ZGVsdGFZID0gZGVsdGFZIDw9IDAgPyBkZWx0YVkgLSBYTFI4IDogZGVsdGFZICsgWExSODtcblxuXHRcdFx0ZS5kZWx0YSAgPSBkZWx0YVk7XG5cdFx0XHRlLndoZWVsWSA9IGRlbHRhWTtcblx0XHRcdGUud2hlZWxYID0gZGVsdGFYO1xuXG5cdFx0XHRjbGVhclRpbWVvdXQobW91c2VXaGVlbEhhbmRsZSk7XG5cdFx0XHRtb3VzZVdoZWVsSGFuZGxlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFhMUjggPSAwO1xuXHRcdFx0fSwgMzAwKTtcblx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBjbG9zZXN0RmlsdGVyIChlbGVtZW50LCBzZWxlY3Rvcikge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0cmV0dXJuIG9uLmNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yLCBlbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZU11bHRpSGFuZGxlIChoYW5kbGVzKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN0YXRlOiAncmVzdW1lZCcsXG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoKSB7XG5cdFx0XHRcdFx0Ly8gYWxsb3cgZm9yIGEgc2ltcGxlIGZ1bmN0aW9uIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0aWYgKGgucmVtb3ZlKSB7XG5cdFx0XHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGggPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdGgoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRoYW5kbGVzID0gW107XG5cdFx0XHRcdHRoaXMucmVtb3ZlID0gdGhpcy5wYXVzZSA9IHRoaXMucmVzdW1lID0gZnVuY3Rpb24gKCkge307XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAncmVtb3ZlZCc7XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoKSB7XG5cdFx0XHRcdFx0aWYgKGgucGF1c2UpIHtcblx0XHRcdFx0XHRcdGgucGF1c2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG5cdFx0XHR9LFxuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaCkge1xuXHRcdFx0XHRcdGlmIChoLnJlc3VtZSkge1xuXHRcdFx0XHRcdFx0aC5yZXN1bWUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gJ3Jlc3VtZWQnO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBnZXROb2RlQnlJZCAoaWQpIHtcblx0XHR2YXIgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblx0XHRpZiAoIW5vZGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2BvbmAgQ291bGQgbm90IGZpbmQ6JywgaWQpO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VDYWxsYmFjayAobm9kZSwgZmlsdGVyLCBoYW5kbGVyKSB7XG5cdFx0aWYgKGZpbHRlciAmJiBoYW5kbGVyKSB7XG5cdFx0XHRpZiAodHlwZW9mIGZpbHRlciA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0ZmlsdGVyID0gY2xvc2VzdEZpbHRlcihub2RlLCBmaWx0ZXIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBmaWx0ZXIoZSk7XG5cdFx0XHRcdGlmIChyZXN1bHQpIHtcblx0XHRcdFx0XHRlLmZpbHRlcmVkVGFyZ2V0ID0gcmVzdWx0O1xuXHRcdFx0XHRcdGhhbmRsZXIoZSwgcmVzdWx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIGZpbHRlciB8fCBoYW5kbGVyO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0RG9jIChub2RlKSB7XG5cdFx0cmV0dXJuIG5vZGUgPT09IGRvY3VtZW50IHx8IG5vZGUgPT09IHdpbmRvdyA/IGRvY3VtZW50IDogbm9kZS5vd25lckRvY3VtZW50O1xuXHR9XG5cblx0Ly8gcHVibGljIGZ1bmN0aW9uc1xuXG5cdG9uLm9uY2UgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBmaWx0ZXIsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGg7XG5cdFx0aWYgKGZpbHRlciAmJiBjYWxsYmFjaykge1xuXHRcdFx0aCA9IG9uKG5vZGUsIGV2ZW50TmFtZSwgZmlsdGVyLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcblx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoID0gb24obm9kZSwgZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZpbHRlci5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG5cdFx0XHRcdGgucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGg7XG5cdH07XG5cblx0b24uZW1pdCA9IGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIHZhbHVlKSB7XG5cdFx0bm9kZSA9IHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyA/IGdldE5vZGVCeUlkKG5vZGUpIDogbm9kZTtcblx0XHR2YXIgZXZlbnQgPSBnZXREb2Mobm9kZSkuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlKTsgLy8gZXZlbnQgdHlwZSwgYnViYmxpbmcsIGNhbmNlbGFibGVcblx0XHRyZXR1cm4gbm9kZS5kaXNwYXRjaEV2ZW50KG1peChldmVudCwgdmFsdWUpKTtcblx0fTtcblxuXHRvbi5maXJlID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcblx0XHRub2RlID0gdHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnID8gZ2V0Tm9kZUJ5SWQobm9kZSkgOiBub2RlO1xuXHRcdHZhciBldmVudCA9IGdldERvYyhub2RlKS5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcblx0XHRldmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnROYW1lLCAhIWJ1YmJsZXMsIHRydWUsIGV2ZW50RGV0YWlsKTsgLy8gZXZlbnQgdHlwZSwgYnViYmxpbmcsIGNhbmNlbGFibGUsIHZhbHVlXG5cdFx0cmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH07XG5cblx0Ly8gVE9ETzogREVQUkVDQVRFRFxuXHRvbi5pc0FscGhhTnVtZXJpYyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0XHRyZXR1cm4gL15bMC05YS16XSQvaS50ZXN0KHN0cik7XG5cdH07XG5cblx0b24ubWFrZU11bHRpSGFuZGxlID0gbWFrZU11bHRpSGFuZGxlO1xuXHRvbi5vbkRvbUV2ZW50ID0gb25Eb21FdmVudDsgLy8gdXNlIGRpcmVjdGx5IHRvIHByZXZlbnQgcG9zc2libGUgZGVmaW5pdGlvbiBsb29wc1xuXHRvbi5jbG9zZXN0ID0gY2xvc2VzdDtcblx0b24ubWF0Y2hlcyA9IG1hdGNoZXM7XG5cblx0cmV0dXJuIG9uO1xufSkpO1xuIiwiLy8gQ2x1YiBBSkFYIEdlbmVyYWwgUHVycG9zZSBDb2RlXG4vL1xuLy8gUmFuZG9taXplclxuLy9cbi8vIGF1dGhvcjpcbi8vICAgICAgICAgICAgICBNaWtlIFdpbGNveFxuLy8gc2l0ZTpcbi8vICAgICAgICAgICAgICBodHRwOi8vY2x1YmFqYXgub3JnXG4vLyBzdXBwb3J0OlxuLy8gICAgICAgICAgICAgIGh0dHA6Ly9ncm91cHMuZ29vZ2xlLmNvbS9ncm91cC9jbHViYWpheFxuLy9cbi8vIGNsdWJhamF4LmxhbmcucmFuZFxuLy9cbi8vICAgICAgREVTQ1JJUFRJT046XG4vLyAgICAgICAgICAgICAgQSByYW5kb21pemVyIGxpYnJhcnkgdGhhdCdzIGdyZWF0IGZvciBwcm9kdWNpbmcgbW9jayBkYXRhLlxuLy8gICAgICAgICAgICAgIEFsbG93cyBkb3plbnMgb2Ygd2F5cyB0byByYW5kb21pemUgbnVtYmVycywgc3RyaW5ncywgd29yZHMsXG4vLyAgICAgICAgICAgICAgc2VudGVuY2VzLCBhbmQgZGF0ZXMuIEluY2x1ZGVzIHRpbnkgbGlicmFyaWVzIG9mIHRoZSBtb3N0XG4vLyAgICAgICAgICAgICAgY29tbW9ubHkgdXNlZCB3b3JkcyAoaW4gb3JkZXIpLCB0aGUgbW9zdCBjb21tb25seSB1c2VkIGxldHRlcnNcbi8vICAgICAgICAgICAgICAoaW4gb3JkZXIpIGFuZCBwZXJzb25hbCBuYW1lcyB0aGF0IGNhbiBiZSB1c2VkIGFzIGZpcnN0IG9yIGxhc3QuXG4vLyAgICAgICAgICAgICAgRm9yIG1ha2luZyBzZW50ZW5jZXMsIFwid3VyZHNcIiBhcmUgdXNlZCAtIHdvcmRzIHdpdGggc2NyYW1ibGVkIHZvd2Vsc1xuLy8gICAgICAgICAgICAgIHNvIHRoZXkgYXJlbid0IGFjdHVhbCB3b3JkcywgYnV0IGxvb2sgbW9yZSBsaWtlIGxvcmVtIGlwc3VtLiBDaGFuZ2UgdGhlXG4vLyAgICAgICAgICAgICAgcHJvcGVydHkgcmVhbCB0byB0cnVlIHRvIHVzZSBcIndvcmRzXCIgaW5zdGVhZCBvZiBcInd1cmRzXCIgKGl0IGNhblxuLy8gICAgICAgICAgICAgIGFsc28gcHJvZHVjZSBodW1vcm91cyByZXN1bHRzKS5cblxuLy8gICAgICBVU0FHRTpcbi8vICAgICAgICAgICAgICBpbmNsdWRlIGZpbGU6XG4vLyAgICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHNyYz1cImNsdWJhamF4L2xhbmcvcmFuZC5qc1wiPjwvc2NyaXB0PlxuLy9cbi8vIFRFU1RTOlxuLy8gICAgICAgICAgICAgIFNlZSB0ZXN0cy9yYW5kLmh0bWxcbi8vXG4vKiBVTUQuZGVmaW5lICovIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKXsgZGVmaW5lKFtdLCBmYWN0b3J5KTsgfWVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKXsgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7IH1lbHNleyByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7IHdpbmRvdy5yYW5kID0gZmFjdG9yeSgpOyB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0XG5cdHZhclxuXHRcdHJhbmQsXG5cdFx0Y2l0eVN0YXRlcyA9IFtcIk5ldyBZb3JrLCBOZXcgWW9ya1wiLCBcIkxvcyBBbmdlbGVzLCBDYWxpZm9ybmlhXCIsIFwiQ2hpY2FnbywgSWxsaW5vaXNcIiwgXCJIb3VzdG9uLCBUZXhhc1wiLCBcIlBoaWxhZGVscGhpYSwgUGVubnN5bHZhbmlhXCIsIFwiUGhvZW5peCwgQXJpem9uYVwiLCBcIlNhbiBEaWVnbywgQ2FsaWZvcm5pYVwiLCBcIlNhbiBBbnRvbmlvLCBUZXhhc1wiLCBcIkRhbGxhcywgVGV4YXNcIiwgXCJEZXRyb2l0LCBNaWNoaWdhblwiLCBcIlNhbiBKb3NlLCBDYWxpZm9ybmlhXCIsIFwiSW5kaWFuYXBvbGlzLCBJbmRpYW5hXCIsIFwiSmFja3NvbnZpbGxlLCBGbG9yaWRhXCIsIFwiU2FuIEZyYW5jaXNjbywgQ2FsaWZvcm5pYVwiLCBcIkNvbHVtYnVzLCBPaGlvXCIsIFwiQXVzdGluLCBUZXhhc1wiLCBcIk1lbXBoaXMsIFRlbm5lc3NlZVwiLCBcIkJhbHRpbW9yZSwgTWFyeWxhbmRcIiwgXCJDaGFybG90dGUsIE5vcnRoIENhcm9saW5hXCIsIFwiRm9ydCBXb3J0aCwgVGV4YXNcIiwgXCJCb3N0b24sIE1hc3NhY2h1c2V0dHNcIiwgXCJNaWx3YXVrZWUsIFdpc2NvbnNpblwiLCBcIkVsIFBhc28sIFRleGFzXCIsIFwiV2FzaGluZ3RvbiwgRGlzdHJpY3Qgb2YgQ29sdW1iaWFcIiwgXCJOYXNodmlsbGUtRGF2aWRzb24sIFRlbm5lc3NlZVwiLCBcIlNlYXR0bGUsIFdhc2hpbmd0b25cIiwgXCJEZW52ZXIsIENvbG9yYWRvXCIsIFwiTGFzIFZlZ2FzLCBOZXZhZGFcIiwgXCJQb3J0bGFuZCwgT3JlZ29uXCIsIFwiT2tsYWhvbWEgQ2l0eSwgT2tsYWhvbWFcIiwgXCJUdWNzb24sIEFyaXpvbmFcIiwgXCJBbGJ1cXVlcnF1ZSwgTmV3IE1leGljb1wiLCBcIkF0bGFudGEsIEdlb3JnaWFcIiwgXCJMb25nIEJlYWNoLCBDYWxpZm9ybmlhXCIsIFwiS2Fuc2FzIENpdHksIE1pc3NvdXJpXCIsIFwiRnJlc25vLCBDYWxpZm9ybmlhXCIsIFwiTmV3IE9ybGVhbnMsIExvdWlzaWFuYVwiLCBcIkNsZXZlbGFuZCwgT2hpb1wiLCBcIlNhY3JhbWVudG8sIENhbGlmb3JuaWFcIiwgXCJNZXNhLCBBcml6b25hXCIsIFwiVmlyZ2luaWEgQmVhY2gsIFZpcmdpbmlhXCIsIFwiT21haGEsIE5lYnJhc2thXCIsIFwiQ29sb3JhZG8gU3ByaW5ncywgQ29sb3JhZG9cIiwgXCJPYWtsYW5kLCBDYWxpZm9ybmlhXCIsIFwiTWlhbWksIEZsb3JpZGFcIiwgXCJUdWxzYSwgT2tsYWhvbWFcIiwgXCJNaW5uZWFwb2xpcywgTWlubmVzb3RhXCIsIFwiSG9ub2x1bHUsIEhhd2FpaVwiLCBcIkFybGluZ3RvbiwgVGV4YXNcIiwgXCJXaWNoaXRhLCBLYW5zYXNcIiwgXCJTdC4gTG91aXMsIE1pc3NvdXJpXCIsIFwiUmFsZWlnaCwgTm9ydGggQ2Fyb2xpbmFcIiwgXCJTYW50YSBBbmEsIENhbGlmb3JuaWFcIiwgXCJDaW5jaW5uYXRpLCBPaGlvXCIsIFwiQW5haGVpbSwgQ2FsaWZvcm5pYVwiLCBcIlRhbXBhLCBGbG9yaWRhXCIsIFwiVG9sZWRvLCBPaGlvXCIsIFwiUGl0dHNidXJnaCwgUGVubnN5bHZhbmlhXCIsIFwiQXVyb3JhLCBDb2xvcmFkb1wiLCBcIkJha2Vyc2ZpZWxkLCBDYWxpZm9ybmlhXCIsIFwiUml2ZXJzaWRlLCBDYWxpZm9ybmlhXCIsIFwiU3RvY2t0b24sIENhbGlmb3JuaWFcIiwgXCJDb3JwdXMgQ2hyaXN0aSwgVGV4YXNcIiwgXCJMZXhpbmd0b24tRmF5ZXR0ZSwgS2VudHVja3lcIiwgXCJCdWZmYWxvLCBOZXcgWW9ya1wiLCBcIlN0LiBQYXVsLCBNaW5uZXNvdGFcIiwgXCJBbmNob3JhZ2UsIEFsYXNrYVwiLCBcIk5ld2FyaywgTmV3IEplcnNleVwiLCBcIlBsYW5vLCBUZXhhc1wiLCBcIkZvcnQgV2F5bmUsIEluZGlhbmFcIiwgXCJTdC4gUGV0ZXJzYnVyZywgRmxvcmlkYVwiLCBcIkdsZW5kYWxlLCBBcml6b25hXCIsIFwiTGluY29sbiwgTmVicmFza2FcIiwgXCJOb3Jmb2xrLCBWaXJnaW5pYVwiLCBcIkplcnNleSBDaXR5LCBOZXcgSmVyc2V5XCIsIFwiR3JlZW5zYm9ybywgTm9ydGggQ2Fyb2xpbmFcIiwgXCJDaGFuZGxlciwgQXJpem9uYVwiLCBcIkJpcm1pbmdoYW0sIEFsYWJhbWFcIiwgXCJIZW5kZXJzb24sIE5ldmFkYVwiLCBcIlNjb3R0c2RhbGUsIEFyaXpvbmFcIiwgXCJOb3J0aCBIZW1wc3RlYWQsIE5ldyBZb3JrXCIsIFwiTWFkaXNvbiwgV2lzY29uc2luXCIsIFwiSGlhbGVhaCwgRmxvcmlkYVwiLCBcIkJhdG9uIFJvdWdlLCBMb3Vpc2lhbmFcIiwgXCJDaGVzYXBlYWtlLCBWaXJnaW5pYVwiLCBcIk9ybGFuZG8sIEZsb3JpZGFcIiwgXCJMdWJib2NrLCBUZXhhc1wiLCBcIkdhcmxhbmQsIFRleGFzXCIsIFwiQWtyb24sIE9oaW9cIiwgXCJSb2NoZXN0ZXIsIE5ldyBZb3JrXCIsIFwiQ2h1bGEgVmlzdGEsIENhbGlmb3JuaWFcIiwgXCJSZW5vLCBOZXZhZGFcIiwgXCJMYXJlZG8sIFRleGFzXCIsIFwiRHVyaGFtLCBOb3J0aCBDYXJvbGluYVwiLCBcIk1vZGVzdG8sIENhbGlmb3JuaWFcIiwgXCJIdW50aW5ndG9uLCBOZXcgWW9ya1wiLCBcIk1vbnRnb21lcnksIEFsYWJhbWFcIiwgXCJCb2lzZSwgSWRhaG9cIiwgXCJBcmxpbmd0b24sIFZpcmdpbmlhXCIsIFwiU2FuIEJlcm5hcmRpbm8sIENhbGlmb3JuaWFcIl0sXG5cdFx0c3RyZWV0U3VmZml4ZXMgPSAnUm9hZCxEcml2ZSxBdmVudWUsQmx2ZCxMYW5lLFN0cmVldCxXYXksQ2lyY2xlJy5zcGxpdCgnLCcpLFxuXHRcdHN0cmVldHMgPSBcIkZpcnN0LEZvdXJ0aCxQYXJrLEZpZnRoLE1haW4sU2l4dGgsT2FrLFNldmVudGgsUGluZSxNYXBsZSxDZWRhcixFaWdodGgsRWxtLFZpZXcsV2FzaGluZ3RvbixOaW50aCxMYWtlLEhpbGwsSGlnaCxTdGF0aW9uLE1haW4sUGFyayxDaHVyY2gsQ2h1cmNoLExvbmRvbixWaWN0b3JpYSxHcmVlbixNYW5vcixDaHVyY2gsUGFyayxUaGUgQ3Jlc2NlbnQsUXVlZW5zLE5ldyxHcmFuZ2UsS2luZ3MsS2luZ3N3YXksV2luZHNvcixIaWdoZmllbGQsTWlsbCxBbGV4YW5kZXIsWW9yayxTdC4gSm9oblxcJ3MsTWFpbixCcm9hZHdheSxLaW5nLFRoZSBHcmVlbixTcHJpbmdmaWVsZCxHZW9yZ2UsUGFyayxWaWN0b3JpYSxBbGJlcnQsUXVlZW5zd2F5LE5ldyxRdWVlbixXZXN0LE5vcnRoLE1hbmNoZXN0ZXIsVGhlIEdyb3ZlLFJpY2htb25kLEdyb3ZlLFNvdXRoLFNjaG9vbCxOb3J0aCxTdGFubGV5LENoZXN0ZXIsTWlsbCxcIi5zcGxpdCgnLCcpLFxuXHRcdHN0YXRlcyA9IFtcIkFsYWJhbWFcIiwgXCJBbGFza2FcIiwgXCJBbWVyaWNhbiBTYW1vYVwiLCBcIkFyaXpvbmFcIiwgXCJBcmthbnNhc1wiLCBcIkFybWVkIEZvcmNlcyBFdXJvcGVcIiwgXCJBcm1lZCBGb3JjZXMgUGFjaWZpY1wiLCBcIkFybWVkIEZvcmNlcyB0aGUgQW1lcmljYXNcIiwgXCJDYWxpZm9ybmlhXCIsIFwiQ29sb3JhZG9cIiwgXCJDb25uZWN0aWN1dFwiLCBcIkRlbGF3YXJlXCIsIFwiRGlzdHJpY3Qgb2YgQ29sdW1iaWFcIiwgXCJGZWRlcmF0ZWQgU3RhdGVzIG9mIE1pY3JvbmVzaWFcIiwgXCJGbG9yaWRhXCIsIFwiR2VvcmdpYVwiLCBcIkd1YW1cIiwgXCJIYXdhaWlcIiwgXCJJZGFob1wiLCBcIklsbGlub2lzXCIsIFwiSW5kaWFuYVwiLCBcIklvd2FcIiwgXCJLYW5zYXNcIiwgXCJLZW50dWNreVwiLCBcIkxvdWlzaWFuYVwiLCBcIk1haW5lXCIsIFwiTWFyc2hhbGwgSXNsYW5kc1wiLCBcIk1hcnlsYW5kXCIsIFwiTWFzc2FjaHVzZXR0c1wiLCBcIk1pY2hpZ2FuXCIsIFwiTWlubmVzb3RhXCIsIFwiTWlzc2lzc2lwcGlcIiwgXCJNaXNzb3VyaVwiLCBcIk1vbnRhbmFcIiwgXCJOZWJyYXNrYVwiLCBcIk5ldmFkYVwiLCBcIk5ldyBIYW1wc2hpcmVcIiwgXCJOZXcgSmVyc2V5XCIsIFwiTmV3IE1leGljb1wiLCBcIk5ldyBZb3JrXCIsIFwiTm9ydGggQ2Fyb2xpbmFcIiwgXCJOb3J0aCBEYWtvdGFcIiwgXCJOb3J0aGVybiBNYXJpYW5hIElzbGFuZHNcIiwgXCJPaGlvXCIsIFwiT2tsYWhvbWFcIiwgXCJPcmVnb25cIiwgXCJQZW5uc3lsdmFuaWFcIiwgXCJQdWVydG8gUmljb1wiLCBcIlJob2RlIElzbGFuZFwiLCBcIlNvdXRoIENhcm9saW5hXCIsIFwiU291dGggRGFrb3RhXCIsIFwiVGVubmVzc2VlXCIsIFwiVGV4YXNcIiwgXCJVdGFoXCIsIFwiVmVybW9udFwiLCBcIlZpcmdpbiBJc2xhbmRzLCBVLlMuXCIsIFwiVmlyZ2luaWFcIiwgXCJXYXNoaW5ndG9uXCIsIFwiV2VzdCBWaXJnaW5pYVwiLCBcIldpc2NvbnNpblwiLCBcIld5b21pbmdcIl0sXG5cdFx0c3RhdGVBYmJyID0gW1wiQUxcIiwgXCJBS1wiLCBcIkFTXCIsIFwiQVpcIiwgXCJBUlwiLCBcIkFFXCIsIFwiQVBcIiwgXCJBQVwiLCBcIkNBXCIsIFwiQ09cIiwgXCJDVFwiLCBcIkRFXCIsIFwiRENcIiwgXCJGTVwiLCBcIkZMXCIsIFwiR0FcIiwgXCJHVVwiLCBcIkhJXCIsIFwiSURcIiwgXCJJTFwiLCBcIklOXCIsIFwiSUFcIiwgXCJLU1wiLCBcIktZXCIsIFwiTEFcIiwgXCJNRVwiLCBcIk1IXCIsIFwiTURcIiwgXCJNQVwiLCBcIk1JXCIsIFwiTU5cIiwgXCJNU1wiLCBcIk1PXCIsIFwiTVRcIiwgXCJORVwiLCBcIk5WXCIsIFwiTkhcIiwgXCJOSlwiLCBcIk5NXCIsIFwiTllcIiwgXCJOQ1wiLCBcIk5EXCIsIFwiTVBcIiwgXCJPSFwiLCBcIk9LXCIsIFwiT1JcIiwgXCJQQVwiLCBcIlBSXCIsIFwiUklcIiwgXCJTQ1wiLCBcIlNEXCIsIFwiVE5cIiwgXCJUWFwiLCBcIlVUXCIsIFwiVlRcIiwgXCJWSVwiLCBcIlZBXCIsIFwiV0FcIiwgXCJXVlwiLCBcIldJXCIsIFwiV1lcIl0sXG5cdFx0bmFtZXMgPSBcIkFicmFoYW0sQWxiZXJ0LEFsZXhpcyxBbGxlbixBbGxpc29uLEFsZXhhbmRlcixBbW9zLEFudG9uLEFybm9sZCxBcnRodXIsQXNobGV5LEJhcnJ5LEJlbGluZGEsQmVsbGUsQmVuamFtaW4sQmVubnksQmVybmFyZCxCcmFkbGV5LEJyZXR0LFR5LEJyaXR0YW55LEJydWNlLEJyeWFudCxDYXJyZXksQ2FybWVuLENhcnJvbGwsQ2hhcmxlcyxDaHJpc3RvcGhlcixDaHJpc3RpZSxDbGFyayxDbGF5LENsaWZmLENvbnJhZCxDcmFpZyxDcnlzdGFsLEN1cnRpcyxEYW1vbixEYW5hLERhdmlkLERlYW4sRGVlLERlbm5pcyxEZW5ueSxEaWNrLERvdWdsYXMsRHVuY2FuLER3aWdodCxEeWxhbixFZGR5LEVsbGlvdCxFdmVyZXR0LEZheWUsRnJhbmNpcyxGcmFuayxGcmFua2xpbixHYXJ0aCxHYXlsZSxHZW9yZ2UsR2lsYmVydCxHbGVubixHb3Jkb24sR3JhY2UsR3JhaGFtLEdyYW50LEdyZWdvcnksR290dGZyaWVkLEd1eSxIYXJyaXNvbixIYXJyeSxIYXJ2ZXksSGVucnksSGVyYmVydCxIaWxsYXJ5LEhvbGx5LEhvcGUsSG93YXJkLEh1Z28sSHVtcGhyZXksSXJ2aW5nLElzYWFrLEphbmlzLEpheSxKb2VsLEpvaG4sSm9yZGFuLEpveWNlLEp1YW4sSnVkZCxKdWxpYSxLYXllLEtlbGx5LEtlaXRoLExhdXJpZSxMYXdyZW5jZSxMZWUsTGVpZ2gsTGVvbmFyZCxMZXNsaWUsTGVzdGVyLExld2lzLExpbGx5LExsb3lkLEdlb3JnZSxMb3VpcyxMb3Vpc2UsTHVjYXMsTHV0aGVyLEx5bm4sTWFjayxNYXJpZSxNYXJzaGFsbCxNYXJ0aW4sTWFydmluLE1heSxNaWNoYWVsLE1pY2hlbGxlLE1pbHRvbixNaXJhbmRhLE1pdGNoZWxsLE1vcmdhbixNb3JyaXMsTXVycmF5LE5ld3RvbixOb3JtYW4sT3dlbixQYXRyaWNrLFBhdHRpLFBhdWwsUGVubnksUGVycnksUHJlc3RvbixRdWlubixSYXksUmljaCxSaWNoYXJkLFJvbGFuZCxSb3NlLFJvc3MsUm95LFJ1YnksUnVzc2VsbCxSdXRoLFJ5YW4sU2NvdHQsU2V5bW91cixTaGFubm9uLFNoYXduLFNoZWxsZXksU2hlcm1hbixTaW1vbixTdGFubGV5LFN0ZXdhcnQsU3VzYW5uLFN5ZG5leSxUYXlsb3IsVGhvbWFzLFRvZGQsVG9tLFRyYWN5LFRyYXZpcyxUeWxlcixUeWxlcixWaW5jZW50LFdhbGxhY2UsV2FsdGVyLFBlbm4sV2F5bmUsV2lsbCxXaWxsYXJkLFdpbGxpc1wiLFxuXHRcdHdvcmRzID0gXCJ0aGUsb2YsYW5kLGEsdG8saW4saXMseW91LHRoYXQsaXQsaGUsZm9yLHdhcyxvbixhcmUsYXMsd2l0aCxoaXMsdGhleSxhdCxiZSx0aGlzLGZyb20sSSxoYXZlLG9yLGJ5LG9uZSxoYWQsbm90LGJ1dCx3aGF0LGFsbCx3ZXJlLHdoZW4sd2UsdGhlcmUsY2FuLGFuLHlvdXIsd2hpY2gsdGhlaXIsc2FpZCxpZixkbyx3aWxsLGVhY2gsYWJvdXQsaG93LHVwLG91dCx0aGVtLHRoZW4sc2hlLG1hbnksc29tZSxzbyx0aGVzZSx3b3VsZCxvdGhlcixpbnRvLGhhcyxtb3JlLGhlcix0d28sbGlrZSxoaW0sc2VlLHRpbWUsY291bGQsbm8sbWFrZSx0aGFuLGZpcnN0LGJlZW4saXRzLHdobyxub3cscGVvcGxlLG15LG1hZGUsb3ZlcixkaWQsZG93bixvbmx5LHdheSxmaW5kLHVzZSxtYXksd2F0ZXIsbG9uZyxsaXR0bGUsdmVyeSxhZnRlcix3b3JkcyxjYWxsZWQsanVzdCx3aGVyZSxtb3N0LGtub3csZ2V0LHRocm91Z2gsYmFjayxtdWNoLGJlZm9yZSxnbyxnb29kLG5ldyx3cml0ZSxvdXQsdXNlZCxtZSxtYW4sdG9vLGFueSxkYXksc2FtZSxyaWdodCxsb29rLHRoaW5rLGFsc28sYXJvdW5kLGFub3RoZXIsY2FtZSxjb21lLHdvcmssdGhyZWUsd29yZCxtdXN0LGJlY2F1c2UsZG9lcyxwYXJ0LGV2ZW4scGxhY2Usd2VsbCxzdWNoLGhlcmUsdGFrZSx3aHksdGhpbmdzLGhlbHAscHV0LHllYXJzLGRpZmZlcmVudCxhd2F5LGFnYWluLG9mZix3ZW50LG9sZCxudW1iZXIsZ3JlYXQsdGVsbCxtZW4sc2F5LHNtYWxsLGV2ZXJ5LGZvdW5kLHN0aWxsLGJldHdlZW4sbmFtZSxzaG91bGQsaG9tZSxiaWcsZ2l2ZSxhaXIsbGluZSxzZXQsb3duLHVuZGVyLHJlYWQsbGFzdCxuZXZlcix1cyxsZWZ0LGVuZCxhbG9uZyx3aGlsZSxtaWdodCxuZXh0LHNvdW5kLGJlbG93LHNhdyxzb21ldGhpbmcsdGhvdWdodCxib3RoLGZldyx0aG9zZSxhbHdheXMsbG9va2VkLHNob3csbGFyZ2Usb2Z0ZW4sdG9nZXRoZXIsYXNrZWQsaG91c2UsZG9uJ3Qsd29ybGQsZ29pbmcsd2FudCxzY2hvb2wsaW1wb3J0YW50LHVudGlsLGZvcm0sZm9vZCxrZWVwLGNoaWxkcmVuLGZlZXQsbGFuZCxzaWRlLHdpdGhvdXQsYm95LG9uY2UsYW5pbWFscyxsaWZlLGVub3VnaCx0b29rLHNvbWV0aW1lcyxmb3VyLGhlYWQsYWJvdmUsa2luZCxiZWdhbixhbG1vc3QsbGl2ZSxwYWdlLGdvdCxlYXJ0aCxuZWVkLGZhcixoYW5kLGhpZ2gseWVhcixtb3RoZXIsbGlnaHQscGFydHMsY291bnRyeSxmYXRoZXIsbGV0LG5pZ2h0LGZvbGxvd2luZyxwaWN0dXJlLGJlaW5nLHN0dWR5LHNlY29uZCxleWVzLHNvb24sdGltZXMsc3RvcnksYm95cyxzaW5jZSx3aGl0ZSxkYXlzLGV2ZXIscGFwZXIsaGFyZCxuZWFyLHNlbnRlbmNlLGJldHRlcixiZXN0LGFjcm9zcyxkdXJpbmcsdG9kYXksb3RoZXJzLGhvd2V2ZXIsc3VyZSxtZWFucyxrbmV3LGl0cyx0cnksdG9sZCx5b3VuZyxtaWxlcyxzdW4sd2F5cyx0aGluZyx3aG9sZSxoZWFyLGV4YW1wbGUsaGVhcmQsc2V2ZXJhbCxjaGFuZ2UsYW5zd2VyLHJvb20sc2VhLGFnYWluc3QsdG9wLHR1cm5lZCxsZWFybixwb2ludCxjaXR5LHBsYXksdG93YXJkLGZpdmUsdXNpbmcsaGltc2VsZix1c3VhbGx5XCIsXG5cdFx0bGV0dGVycyA9IChcImV0YW9uaXNyaGxkY211ZnBnd3lidmtqeHF6XCIpLnNwbGl0KFwiXCIpLFxuXHRcdHNpdGVzID0gXCJHb29nbGUsRmFjZWJvb2ssWW91VHViZSxZYWhvbyxMaXZlLEJpbmcsV2lraXBlZGlhLEJsb2dnZXIsTVNOLFR3aXR0ZXIsV29yZHByZXNzLE15U3BhY2UsTWljcm9zb2Z0LEFtYXpvbixlQmF5LExpbmtlZEluLGZsaWNrcixDcmFpZ3NsaXN0LFJhcGlkc2hhcmUsQ29uZHVpdCxJTURCLEJCQyxHbyxBT0wsRG91YmxlY2xpY2ssQXBwbGUsQmxvZ3Nwb3QsT3JrdXQsUGhvdG9idWNrZXQsQXNrLENOTixBZG9iZSxBYm91dCxtZWRpYWZpcmUsQ05FVCxFU1BOLEltYWdlU2hhY2ssTGl2ZUpvdXJuYWwsTWVnYXVwbG9hZCxNZWdhdmlkZW8sSG90ZmlsZSxQYXlQYWwsTllUaW1lcyxHbG9ibyxBbGliYWJhLEdvRGFkZHksRGV2aWFudEFydCxSZWRpZmYsRGFpbHlNb3Rpb24sRGlnZyxXZWF0aGVyLG5pbmcsUGFydHlQb2tlcixlSG93LERvd25sb2FkLEFuc3dlcnMsVHdpdFBpYyxOZXRmbGl4LFRpbnlwaWMsU291cmNlZm9yZ2UsSHVsdSxDb21jYXN0LEFyY2hpdmUsRGVsbCxTdHVtYmxldXBvbixIUCxGb3hOZXdzLE1ldGFjYWZlLFZpbWVvLFNreXBlLENoYXNlLFJldXRlcnMsV1NKLFllbHAsUmVkZGl0LEdlb2NpdGllcyxVU1BTLFVQUyxVcGxvYWQsVGVjaENydW5jaCxQb2dvLFBhbmRvcmEsTEFUaW1lcyxVU0FUb2RheSxJQk0sQWx0YVZpc3RhLE1hdGNoLE1vbnN0ZXIsSm90U3BvdCxCZXR0ZXJWaWRlbyxDbHViQUpBWCxOZXhwbG9yZSxLYXlhayxTbGFzaGRvdFwiO1xuXHRcblx0cmFuZCA9IHtcblx0XHRyZWFsOmZhbHNlLFxuXHRcdHdvcmRzOndvcmRzLnNwbGl0KFwiLFwiKSxcblx0XHR3dXJkczpbXSxcblx0XHRuYW1lczpuYW1lcy5zcGxpdChcIixcIiksXG5cdFx0bGV0dGVyczpsZXR0ZXJzLFxuXHRcdHNpdGVzOnNpdGVzLnNwbGl0KFwiLFwiKSxcblxuXHRcdHRvQXJyYXk6IGZ1bmN0aW9uKHRoaW5nKXtcblx0XHRcdHZhclxuXHRcdFx0XHRubSwgaSxcblx0XHRcdFx0YSA9IFtdO1xuXG5cdFx0XHRpZih0eXBlb2YodGhpbmcpID09PSBcIm9iamVjdFwiICYmICEoISF0aGluZy5wdXNoIHx8ICEhdGhpbmcuaXRlbSkpe1xuXHRcdFx0XHRmb3Iobm0gaW4gdGhpbmcpeyBpZih0aGluZy5oYXNPd25Qcm9wZXJ0eShubSkpe2EucHVzaCh0aGluZ1tubV0pO30gfVxuXHRcdFx0XHR0aGluZyA9IGE7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHR5cGVvZih0aGluZykgPT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHRpZigvXFwuLy50ZXN0KHRoaW5nKSl7XG5cdFx0XHRcdFx0dGhpbmcgPSB0aGluZy5zcGxpdChcIi5cIik7XG5cdFx0XHRcdFx0dGhpbmcucG9wKCk7XG5cdFx0XHRcdFx0aSA9IHRoaW5nLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZShpLS0pe1xuXHRcdFx0XHRcdFx0dGhpbmdbaV0gPSB0aGlzLnRyaW0odGhpbmdbaV0pICsgXCIuXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZSBpZigvLC8udGVzdCh0aGluZykpe1xuXHRcdFx0XHRcdFx0dGhpbmcgPSB0aGluZy5zcGxpdChcIixcIik7XG5cdFx0XHRcdH1lbHNlIGlmKC9cXHMvLnRlc3QodGhpbmcpKXtcblx0XHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGluZzsgLy9BcnJheVxuXHRcdH0sXG5cblx0XHR0cmltOiBmdW5jdGlvbihzKXsgLy8gdGhhbmtzIHRvIERvam86XG5cdFx0XHRyZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50cmltID8gcy50cmltKCkgOlxuXHRcdFx0cy5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKS5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcblx0XHR9LFxuXG5cdFx0cGFkOiBmdW5jdGlvbihuLCBhbXQsIGNocil7XG5cdFx0XHRcdHZhciBjID0gY2hyIHx8IFwiMFwiOyBhbXQgPSBhbXQgfHwgMjtcblx0XHRcdFx0cmV0dXJuIChjK2MrYytjK2MrYytjK2MrYytjK24pLnNsaWNlKC1hbXQpO1xuXHRcdH0sXG5cblx0XHRjYXA6IGZ1bmN0aW9uKHcpe1xuXHRcdFx0cmV0dXJuIHcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3LnN1YnN0cmluZygxKTtcblx0XHR9LFxuXG5cdFx0d2VpZ2h0OiBmdW5jdGlvbihuLCBleHApe1xuXHRcdFx0dmFyXG5cdFx0XHRcdHJlcyxcblx0XHRcdFx0cmV2ID0gZXhwIDwgMDtcblx0XHRcdGV4cCA9IGV4cD09PXVuZGVmaW5lZCA/IDEgOiBNYXRoLmFicyhleHApKzE7XG5cdFx0XHRyZXMgPSBNYXRoLnBvdyhuLCBleHApO1xuXHRcdFx0cmV0dXJuIHJldiA/IDEgLSByZXMgOiByZXM7XG5cdFx0fSxcblxuXHRcdG46IGZ1bmN0aW9uKG4sIHcpe1xuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoKG4gfHwgMTApICogdGhpcy53ZWlnaHQoTWF0aC5yYW5kb20oKSwgdykpO1xuXHRcdH0sXG5cblx0XHRyYW5nZTogZnVuY3Rpb24obWluLCBtYXgsIHcpe1xuXHRcdFx0bWF4ID0gbWF4IHx8IDA7XG5cdFx0XHRyZXR1cm4gdGhpcy5uKE1hdGguYWJzKG1heC1taW4pKzEsIHcpICsgKG1pbjxtYXg/bWluOm1heCk7XG5cdFx0fSxcblxuXHRcdGVsZW1lbnQ6IGZ1bmN0aW9uKHRoaW5nLCB3KXtcblx0XHRcdC8vIHJldHVybiByYW5kIHNsb3QsIGNoYXIsIHByb3Agb3IgcmFuZ2Vcblx0XHRcdGlmKHR5cGVvZih0aGluZykgPT09IFwibnVtYmVyXCIpeyByZXR1cm4gdGhpcy5uKHRoaW5nLCB3KTsgfVxuXHRcdFx0dGhpbmcgPSB0aGlzLnRvQXJyYXkodGhpbmcpO1xuXHRcdFx0cmV0dXJuIHRoaW5nW3RoaXMubih0aGluZy5sZW5ndGgsIHcpXTtcblx0XHR9LFxuXG5cdFx0c2NyYW1ibGU6IGZ1bmN0aW9uKGFyeSl7XG5cdFx0XHR2YXJcblx0XHRcdFx0YSA9IGFyeS5jb25jYXQoW10pLFxuXHRcdFx0XHRzZCA9IFtdLFxuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlKGktLSl7XG5cdFx0XHRcdFx0c2QucHVzaChhLnNwbGljZSh0aGlzLm4oYS5sZW5ndGgpLCAxKVswXSk7XG5cdFx0XHRcdH1cblx0XHRcdHJldHVybiBzZDtcblx0XHR9LFxuXG5cdFx0YmlnbnVtYmVyOiBmdW5jdGlvbihsZW4pe1xuXHRcdFx0dmFyIHQ9XCJcIjtcblx0XHRcdHdoaWxlKGxlbi0tKXtcblx0XHRcdFx0XHR0ICs9IHRoaXMubig5KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0O1xuXHRcdH0sXG5cblx0XHRkYXRlOiBmdW5jdGlvbihvKXtcblx0XHRcdG8gPSBvIHx8IHt9O1xuXHRcdFx0dmFyXG5cdFx0XHRcdGQsXG5cdFx0XHRcdGQxID0gbmV3IERhdGUoby5taW4gfHwgbmV3IERhdGUoKSksXG5cdFx0XHRcdGQyID0gbmV3IERhdGUoby5tYXggfHwgbmV3IERhdGUoKS5zZXRGdWxsWWVhcihkMS5nZXRGdWxsWWVhcigpKyhvLnllYXJSYW5nZXx8MSkpKS5nZXRUaW1lKCk7XG5cdFx0XHRkMSA9IGQxLmdldFRpbWUoKTtcblx0XHRcdGQgPSBuZXcgRGF0ZSh0aGlzLnJhbmdlKGQxLGQyLG8ud2VpZ2h0KSk7XG5cdFx0XHRpZihvLnNlY29uZHMpe1xuXHRcdFx0XHRyZXR1cm4gZC5nZXRUaW1lKCk7XG5cdFx0XHR9ZWxzZSBpZihvLmRlbGltaXRlcil7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhZChkLmdldE1vbnRoKCkrMSkrby5kZWxpbWl0ZXIrdGhpcy5wYWQoZC5nZXREYXRlKCkrMSkrby5kZWxpbWl0ZXIrKGQuZ2V0RnVsbFllYXIoKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZDtcblx0XHR9LFxuXG5cdFx0Ym9vbDogZnVuY3Rpb24odyl7XG5cdFx0XHRyZXR1cm4gdGhpcy5uKDIsIHcpIDwgMTtcblx0XHR9LFxuXG5cdFx0Y29sb3I6IGZ1bmN0aW9uKHcpe1xuXHRcdFx0cmV0dXJuIFwiI1wiK3RoaXMucGFkKHRoaXMubigyNTUsIHcpLnRvU3RyaW5nKDE2KSkrdGhpcy5wYWQodGhpcy5uKDI1NSwgdykudG9TdHJpbmcoMTYpKSt0aGlzLnBhZCh0aGlzLm4oMjU1LCB3KS50b1N0cmluZygxNikpO1xuXHRcdH0sXG5cblx0XHRjaGFyczpmdW5jdGlvbihtaW4sIG1heCwgdyl7XG5cdFx0XHR2YXIgcyA9IFwiXCIsXG5cdFx0XHRpID0gdGhpcy5yYW5nZShtaW4sIG1heCwgdyk7XG5cdFx0XHR3aGlsZShpLS0pe1xuXHRcdFx0XHRzICs9IHRoaXMubGV0dGVyc1t0aGlzLm4odGhpcy5sZXR0ZXJzLmxlbmd0aCldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHM7XG5cdFx0fSxcblxuXHRcdG5hbWU6IGZ1bmN0aW9uKGNzZSl7XG5cdFx0XHQvLyBjc2U6IDAgdGl0bGUgY2FzZSwgMSBsb3dlcmNhc2UsIDIgdXBwZXIgY2FzZVxuXHRcdFx0dmFyIHMgPSB0aGlzLm5hbWVzW3RoaXMubih0aGlzLm5hbWVzLmxlbmd0aCldO1xuXHRcdFx0cmV0dXJuICFjc2UgPyBzIDogY3NlID09PSAxID8gcy50b0xvd2VyQ2FzZSgpIDogcy50b1VwcGVyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHRjaXR5U3RhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gY2l0eVN0YXRlc1t0aGlzLm4oY2l0eVN0YXRlcy5sZW5ndGgpXTtcblx0XHR9LFxuXG5cdFx0c3RhdGU6IGZ1bmN0aW9uKGNzZSl7XG5cdFx0XHQvLyBjc2U6IDAgdGl0bGUgY2FzZSwgMSBsb3dlcmNhc2UsIDIgdXBwZXIgY2FzZVxuXHRcdFx0dmFyIHMgPSBzdGF0ZXNbdGhpcy5uKHN0YXRlcy5sZW5ndGgpXTtcblx0XHRcdHJldHVybiAhY3NlID8gcyA6IGNzZSA9PT0gMSA/IHMudG9Mb3dlckNhc2UoKSA6IHMudG9VcHBlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0c3RhdGVDb2RlOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Y3NlID0gY3NlID09PSB1bmRlZmluZWQgPyAyIDogY3NlO1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gc3RhdGVBYmJyW3RoaXMubihzdGF0ZUFiYnIubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdHN0cmVldDogZnVuY3Rpb24obm9TdWZmaXgpe1xuXHRcdFx0dmFyIHMgPSBzdHJlZXRzW3RoaXMubihzdHJlZXRzLmxlbmd0aCldO1xuXHRcdFx0aWYoIW5vU3VmZml4KXtcblx0XHRcdFx0cys9ICcgJyArIHN0cmVldFN1ZmZpeGVzW3RoaXMubihzdHJlZXRTdWZmaXhlcy5sZW5ndGgpXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzO1xuXHRcdH0sXG5cblx0XHRzaXRlOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gdGhpcy5zaXRlc1t0aGlzLm4odGhpcy5zaXRlcy5sZW5ndGgpXTtcblx0XHRcdHJldHVybiAhY3NlID8gcyA6IGNzZSA9PT0gMSA/IHMudG9Mb3dlckNhc2UoKSA6IHMudG9VcHBlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0dXJsOiBmdW5jdGlvbih1c2V3d3csIHh0KXtcblx0XHRcdHZhciB3ID0gdXNld3d3ID8gXCJ3d3cuXCIgOiBcIlwiO1xuXHRcdFx0eHQgPSB4dCB8fCBcIi5jb21cIjtcblx0XHRcdHJldHVybiBcImh0dHA6Ly9cIiArIHcgKyB0aGlzLnNpdGUoMSkgKyB4dDtcblx0XHR9LFxuXG5cdFx0d29yZDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciB3ID0gdGhpcy5yZWFsID8gdGhpcy53b3JkcyA6IHRoaXMud3VyZHM7XG5cdFx0XHRyZXR1cm4gd1t0aGlzLm4ody5sZW5ndGgpXTtcblx0XHR9LFxuXG5cdFx0c2VudGVuY2VzOiBmdW5jdGlvbihtaW5BbXQsIG1heEFtdCwgbWluTGVuLCBtYXhMZW4pe1xuXHRcdFx0Ly8gYW10OiBzZW50ZW5jZXMsIGxlbjogd29yZHNcblx0XHRcdG1pbkFtdCA9IG1pbkFtdCB8fCAxO1xuXHRcdFx0bWF4QW10ID0gbWF4QW10IHx8IG1pbkFtdDtcblx0XHRcdG1pbkxlbiA9IG1pbkxlbiB8fCA1O1xuXHRcdFx0bWF4TGVuID0gbWF4TGVuIHx8IG1pbkxlbjtcblxuXHRcdFx0dmFyXG5cdFx0XHRcdGlpLFxuXHRcdFx0XHRzID0gW10sXG5cdFx0XHRcdHQgPSBcIlwiLFxuXHRcdFx0XHR3ID0gdGhpcy5yZWFsID8gdGhpcy53b3JkcyA6IHRoaXMud3VyZHMsXG5cdFx0XHRcdGkgPSB0aGlzLnJhbmdlKG1pbkFtdCwgbWF4QW10KTtcblxuXHRcdFx0d2hpbGUoaS0tKXtcblxuXHRcdFx0XHRpaSA9IHRoaXMucmFuZ2UobWluTGVuLCBtYXhMZW4pOyB3aGlsZShpaS0tKXtcblx0XHRcdFx0XHRzLnB1c2god1t0aGlzLm4ody5sZW5ndGgpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dCArPSB0aGlzLmNhcChzLmpvaW4oXCIgXCIpKSArXCIuIFwiO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHQ7XG5cdFx0fSxcblxuXHRcdHRpdGxlOiBmdW5jdGlvbihtaW4sIG1heCl7XG5cdFx0XHRtaW4gPSBtaW4gfHwgMTsgbWF4ID0gbWF4IHx8IG1pbjtcblx0XHRcdHZhclxuXHRcdFx0XHRhID0gW10sXG5cdFx0XHRcdHcgPSB0aGlzLnJlYWwgPyB0aGlzLndvcmRzIDogdGhpcy53dXJkcyxcblx0XHRcdFx0aSA9IHRoaXMucmFuZ2UobWluLCBtYXgpO1xuXHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0YS5wdXNoKHRoaXMuY2FwKHdbdGhpcy5uKHcubGVuZ3RoKV0pKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhLmpvaW4oXCIgXCIpO1xuXHRcdH0sXG5cdFx0ZGF0YTogZnVuY3Rpb24oYW10KXtcblx0XHRcdHZhclxuXHRcdFx0XHRzdCxcblx0XHRcdFx0aXRlbXMgPSBbXSxcblx0XHRcdFx0aXRlbSxcblx0XHRcdFx0aTtcblx0XHRcdGZvcihpID0gMDsgaSA8IGFtdDsgaSsrKXtcblx0XHRcdFx0aXRlbSA9IHtcblx0XHRcdFx0XHRmaXJzdE5hbWU6IHRoaXMubmFtZSgpLFxuXHRcdFx0XHRcdGxhc3ROYW1lOiB0aGlzLm5hbWUoKSxcblx0XHRcdFx0XHRjb21wYW55OiB0aGlzLnNpdGUoKSxcblx0XHRcdFx0XHRhZGRyZXNzMTogdGhpcy5iaWdudW1iZXIodGhpcy5yYW5nZSgzLCA1KSksXG5cdFx0XHRcdFx0YWRkcmVzczI6IHRoaXMuc3RyZWV0KCksXG5cdFx0XHRcdFx0YmlydGhkYXk6IHRoaXMuZGF0ZSh7ZGVsaW1pdGVyOicvJ30pXG5cdFx0XHRcdH07XG5cdFx0XHRcdGl0ZW0uZW1haWwgPSAoaXRlbS5maXJzdE5hbWUuc3Vic3RyaW5nKDAsMSkgKyBpdGVtLmxhc3ROYW1lICsgJ0AnICsgaXRlbS5jb21wYW55ICsgJy5jb20nKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRzdCA9IHRoaXMuY2l0eVN0YXRlKCk7XG5cdFx0XHRcdGl0ZW0uY2l0eSA9IHN0LnNwbGl0KCcsICcpWzBdO1xuXHRcdFx0XHRpdGVtLnN0YXRlID0gc3Quc3BsaXQoJywgJylbMV07XG5cdFx0XHRcdGl0ZW0uemlwY29kZSA9IHRoaXMuYmlnbnVtYmVyKDUpO1xuXHRcdFx0XHRpdGVtLnBob25lID0gdGhpcy5mb3JtYXQodGhpcy5iaWdudW1iZXIoMTApLCAncGhvbmUnKTtcblx0XHRcdFx0aXRlbS5zc24gPSB0aGlzLmZvcm1hdCh0aGlzLmJpZ251bWJlcig5KSwgJ3NzbicpO1xuXHRcdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH0sXG5cblx0XHRmb3JtYXQ6IGZ1bmN0aW9uIChuLCB0eXBlKSB7XG5cdFx0XHR2YXIgZCA9ICctJztcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICdwaG9uZSc6XG5cdFx0XHRcdFx0biA9ICcnICsgbjtcblx0XHRcdFx0XHRyZXR1cm4gbi5zdWJzdHJpbmcoMCwzKSArIGQgKyBuLnN1YnN0cmluZygzLDYpICsgZCArIG4uc3Vic3RyaW5nKDYpO1xuXHRcdFx0XHRjYXNlICdzc24nOlxuXHRcdFx0XHRcdG4gPSAnJyArIG47XG5cdFx0XHRcdFx0cmV0dXJuIG4uc3Vic3RyaW5nKDAsMykgKyBkICsgbi5zdWJzdHJpbmcoMyw1KSArIGQgKyBuLnN1YnN0cmluZyg1KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJhbmQud3VyZHMgPSB3b3Jkcy5yZXBsYWNlKC9hfGV8aXxvfHUvZywgZnVuY3Rpb24oYyl7IHJldHVybiAoXCJhZWlvdVwiKVtyYW5kLm4oNSldOyB9KS5zcGxpdChcIixcIik7XG5cblx0cmV0dXJuIHJhbmQ7XG59KSk7XG4iXX0=
