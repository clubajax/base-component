require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"@clubajax/custom-elements-polyfill":[function(require,module,exports){
(function () {
if(window['force-no-ce-shim']){
	return;
}
var supportsV1 = 'customElements' in window;
var nativeShimBase64 = "ZnVuY3Rpb24gbmF0aXZlU2hpbSgpeygoKT0+eyd1c2Ugc3RyaWN0JztpZighd2luZG93LmN1c3RvbUVsZW1lbnRzKXJldHVybjtjb25zdCBhPXdpbmRvdy5IVE1MRWxlbWVudCxiPXdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUsYz13aW5kb3cuY3VzdG9tRWxlbWVudHMuZ2V0LGQ9bmV3IE1hcCxlPW5ldyBNYXA7bGV0IGY9ITEsZz0hMTt3aW5kb3cuSFRNTEVsZW1lbnQ9ZnVuY3Rpb24oKXtpZighZil7Y29uc3Qgaj1kLmdldCh0aGlzLmNvbnN0cnVjdG9yKSxrPWMuY2FsbCh3aW5kb3cuY3VzdG9tRWxlbWVudHMsaik7Zz0hMDtjb25zdCBsPW5ldyBrO3JldHVybiBsfWY9ITE7fSx3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlPWEucHJvdG90eXBlO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csJ2N1c3RvbUVsZW1lbnRzJyx7dmFsdWU6d2luZG93LmN1c3RvbUVsZW1lbnRzLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3cuY3VzdG9tRWxlbWVudHMsJ2RlZmluZScse3ZhbHVlOihqLGspPT57Y29uc3QgbD1rLnByb3RvdHlwZSxtPWNsYXNzIGV4dGVuZHMgYXtjb25zdHJ1Y3Rvcigpe3N1cGVyKCksT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsbCksZ3x8KGY9ITAsay5jYWxsKHRoaXMpKSxnPSExO319LG49bS5wcm90b3R5cGU7bS5vYnNlcnZlZEF0dHJpYnV0ZXM9ay5vYnNlcnZlZEF0dHJpYnV0ZXMsbi5jb25uZWN0ZWRDYWxsYmFjaz1sLmNvbm5lY3RlZENhbGxiYWNrLG4uZGlzY29ubmVjdGVkQ2FsbGJhY2s9bC5kaXNjb25uZWN0ZWRDYWxsYmFjayxuLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaz1sLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayxuLmFkb3B0ZWRDYWxsYmFjaz1sLmFkb3B0ZWRDYWxsYmFjayxkLnNldChrLGopLGUuc2V0KGosayksYi5jYWxsKHdpbmRvdy5jdXN0b21FbGVtZW50cyxqLG0pO30sY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdy5jdXN0b21FbGVtZW50cywnZ2V0Jyx7dmFsdWU6KGopPT5lLmdldChqKSxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTt9KSgpO30=";

if(supportsV1 && !window['force-ce-shim']){
if(!window['no-native-shim']) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJAY2x1YmFqYXgvY3VzdG9tLWVsZW1lbnRzLXBvbHlmaWxsIiwiQGNsdWJhamF4L2RvbSIsIkBjbHViYWpheC9vbiIsInJhbmRvbWl6ZXIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoKSB7XG5pZih3aW5kb3dbJ2ZvcmNlLW5vLWNlLXNoaW0nXSl7XG5cdHJldHVybjtcbn1cbnZhciBzdXBwb3J0c1YxID0gJ2N1c3RvbUVsZW1lbnRzJyBpbiB3aW5kb3c7XG52YXIgbmF0aXZlU2hpbUJhc2U2NCA9IFwiWm5WdVkzUnBiMjRnYm1GMGFYWmxVMmhwYlNncGV5Z29LVDArZXlkMWMyVWdjM1J5YVdOMEp6dHBaaWdoZDJsdVpHOTNMbU4xYzNSdmJVVnNaVzFsYm5SektYSmxkSFZ5Ymp0amIyNXpkQ0JoUFhkcGJtUnZkeTVJVkUxTVJXeGxiV1Z1ZEN4aVBYZHBibVJ2ZHk1amRYTjBiMjFGYkdWdFpXNTBjeTVrWldacGJtVXNZejEzYVc1a2IzY3VZM1Z6ZEc5dFJXeGxiV1Z1ZEhNdVoyVjBMR1E5Ym1WM0lFMWhjQ3hsUFc1bGR5Qk5ZWEE3YkdWMElHWTlJVEVzWnowaE1UdDNhVzVrYjNjdVNGUk5URVZzWlcxbGJuUTlablZ1WTNScGIyNG9LWHRwWmlnaFppbDdZMjl1YzNRZ2FqMWtMbWRsZENoMGFHbHpMbU52Ym5OMGNuVmpkRzl5S1N4clBXTXVZMkZzYkNoM2FXNWtiM2N1WTNWemRHOXRSV3hsYldWdWRITXNhaWs3WnowaE1EdGpiMjV6ZENCc1BXNWxkeUJyTzNKbGRIVnliaUJzZldZOUlURTdmU3gzYVc1a2IzY3VTRlJOVEVWc1pXMWxiblF1Y0hKdmRHOTBlWEJsUFdFdWNISnZkRzkwZVhCbE8wOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2gzYVc1a2IzY3NKMk4xYzNSdmJVVnNaVzFsYm5Sekp5eDdkbUZzZFdVNmQybHVaRzkzTG1OMWMzUnZiVVZzWlcxbGJuUnpMR052Ym1acFozVnlZV0pzWlRvaE1DeDNjbWwwWVdKc1pUb2hNSDBwTEU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDNhVzVrYjNjdVkzVnpkRzl0Uld4bGJXVnVkSE1zSjJSbFptbHVaU2NzZTNaaGJIVmxPaWhxTEdzcFBUNTdZMjl1YzNRZ2JEMXJMbkJ5YjNSdmRIbHdaU3h0UFdOc1lYTnpJR1Y0ZEdWdVpITWdZWHRqYjI1emRISjFZM1J2Y2lncGUzTjFjR1Z5S0Nrc1QySnFaV04wTG5ObGRGQnliM1J2ZEhsd1pVOW1LSFJvYVhNc2JDa3NaM3g4S0dZOUlUQXNheTVqWVd4c0tIUm9hWE1wS1N4blBTRXhPMzE5TEc0OWJTNXdjbTkwYjNSNWNHVTdiUzV2WW5ObGNuWmxaRUYwZEhKcFluVjBaWE05YXk1dlluTmxjblpsWkVGMGRISnBZblYwWlhNc2JpNWpiMjV1WldOMFpXUkRZV3hzWW1GamF6MXNMbU52Ym01bFkzUmxaRU5oYkd4aVlXTnJMRzR1WkdselkyOXVibVZqZEdWa1EyRnNiR0poWTJzOWJDNWthWE5qYjI1dVpXTjBaV1JEWVd4c1ltRmpheXh1TG1GMGRISnBZblYwWlVOb1lXNW5aV1JEWVd4c1ltRmphejFzTG1GMGRISnBZblYwWlVOb1lXNW5aV1JEWVd4c1ltRmpheXh1TG1Ga2IzQjBaV1JEWVd4c1ltRmphejFzTG1Ga2IzQjBaV1JEWVd4c1ltRmpheXhrTG5ObGRDaHJMR29wTEdVdWMyVjBLR29zYXlrc1lpNWpZV3hzS0hkcGJtUnZkeTVqZFhOMGIyMUZiR1Z0Wlc1MGN5eHFMRzBwTzMwc1kyOXVabWxuZFhKaFlteGxPaUV3TEhkeWFYUmhZbXhsT2lFd2ZTa3NUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0hkcGJtUnZkeTVqZFhOMGIyMUZiR1Z0Wlc1MGN5d25aMlYwSnl4N2RtRnNkV1U2S0dvcFBUNWxMbWRsZENocUtTeGpiMjVtYVdkMWNtRmliR1U2SVRBc2QzSnBkR0ZpYkdVNklUQjlLVHQ5S1NncE8zMD1cIjtcblxuaWYoc3VwcG9ydHNWMSAmJiAhd2luZG93Wydmb3JjZS1jZS1zaGltJ10pe1xuaWYoIXdpbmRvd1snbm8tbmF0aXZlLXNoaW0nXSkge1xuZXZhbCh3aW5kb3cuYXRvYihuYXRpdmVTaGltQmFzZTY0KSk7XG5uYXRpdmVTaGltKCk7XG59XG59ZWxzZXtcbmN1c3RvbUVsZW1lbnRzKCk7XG59XG5cbmZ1bmN0aW9uIGN1c3RvbUVsZW1lbnRzKCkge1xuKGZ1bmN0aW9uKCl7XG4vLyBAbGljZW5zZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4ndXNlIHN0cmljdCc7dmFyIGc9bmV3IGZ1bmN0aW9uKCl7fTt2YXIgYWE9bmV3IFNldChcImFubm90YXRpb24teG1sIGNvbG9yLXByb2ZpbGUgZm9udC1mYWNlIGZvbnQtZmFjZS1zcmMgZm9udC1mYWNlLXVyaSBmb250LWZhY2UtZm9ybWF0IGZvbnQtZmFjZS1uYW1lIG1pc3NpbmctZ2x5cGhcIi5zcGxpdChcIiBcIikpO2Z1bmN0aW9uIGsoYil7dmFyIGE9YWEuaGFzKGIpO2I9L15bYS16XVsuMC05X2Etel0qLVtcXC0uMC05X2Etel0qJC8udGVzdChiKTtyZXR1cm4hYSYmYn1mdW5jdGlvbiBsKGIpe3ZhciBhPWIuaXNDb25uZWN0ZWQ7aWYodm9pZCAwIT09YSlyZXR1cm4gYTtmb3IoO2ImJiEoYi5fX0NFX2lzSW1wb3J0RG9jdW1lbnR8fGIgaW5zdGFuY2VvZiBEb2N1bWVudCk7KWI9Yi5wYXJlbnROb2RlfHwod2luZG93LlNoYWRvd1Jvb3QmJmIgaW5zdGFuY2VvZiBTaGFkb3dSb290P2IuaG9zdDp2b2lkIDApO3JldHVybiEoIWJ8fCEoYi5fX0NFX2lzSW1wb3J0RG9jdW1lbnR8fGIgaW5zdGFuY2VvZiBEb2N1bWVudCkpfVxuZnVuY3Rpb24gbShiLGEpe2Zvcig7YSYmYSE9PWImJiFhLm5leHRTaWJsaW5nOylhPWEucGFyZW50Tm9kZTtyZXR1cm4gYSYmYSE9PWI/YS5uZXh0U2libGluZzpudWxsfVxuZnVuY3Rpb24gbihiLGEsZSl7ZT1lP2U6bmV3IFNldDtmb3IodmFyIGM9YjtjOyl7aWYoYy5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFKXt2YXIgZD1jO2EoZCk7dmFyIGg9ZC5sb2NhbE5hbWU7aWYoXCJsaW5rXCI9PT1oJiZcImltcG9ydFwiPT09ZC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikpe2M9ZC5pbXBvcnQ7aWYoYyBpbnN0YW5jZW9mIE5vZGUmJiFlLmhhcyhjKSlmb3IoZS5hZGQoYyksYz1jLmZpcnN0Q2hpbGQ7YztjPWMubmV4dFNpYmxpbmcpbihjLGEsZSk7Yz1tKGIsZCk7Y29udGludWV9ZWxzZSBpZihcInRlbXBsYXRlXCI9PT1oKXtjPW0oYixkKTtjb250aW51ZX1pZihkPWQuX19DRV9zaGFkb3dSb290KWZvcihkPWQuZmlyc3RDaGlsZDtkO2Q9ZC5uZXh0U2libGluZyluKGQsYSxlKX1jPWMuZmlyc3RDaGlsZD9jLmZpcnN0Q2hpbGQ6bShiLGMpfX1mdW5jdGlvbiBxKGIsYSxlKXtiW2FdPWV9O2Z1bmN0aW9uIHIoKXt0aGlzLmE9bmV3IE1hcDt0aGlzLmY9bmV3IE1hcDt0aGlzLmM9W107dGhpcy5iPSExfWZ1bmN0aW9uIGJhKGIsYSxlKXtiLmEuc2V0KGEsZSk7Yi5mLnNldChlLmNvbnN0cnVjdG9yLGUpfWZ1bmN0aW9uIHQoYixhKXtiLmI9ITA7Yi5jLnB1c2goYSl9ZnVuY3Rpb24gdihiLGEpe2IuYiYmbihhLGZ1bmN0aW9uKGEpe3JldHVybiB3KGIsYSl9KX1mdW5jdGlvbiB3KGIsYSl7aWYoYi5iJiYhYS5fX0NFX3BhdGNoZWQpe2EuX19DRV9wYXRjaGVkPSEwO2Zvcih2YXIgZT0wO2U8Yi5jLmxlbmd0aDtlKyspYi5jW2VdKGEpfX1mdW5jdGlvbiB4KGIsYSl7dmFyIGU9W107bihhLGZ1bmN0aW9uKGIpe3JldHVybiBlLnB1c2goYil9KTtmb3IoYT0wO2E8ZS5sZW5ndGg7YSsrKXt2YXIgYz1lW2FdOzE9PT1jLl9fQ0Vfc3RhdGU/Yi5jb25uZWN0ZWRDYWxsYmFjayhjKTp5KGIsYyl9fVxuZnVuY3Rpb24geihiLGEpe3ZhciBlPVtdO24oYSxmdW5jdGlvbihiKXtyZXR1cm4gZS5wdXNoKGIpfSk7Zm9yKGE9MDthPGUubGVuZ3RoO2ErKyl7dmFyIGM9ZVthXTsxPT09Yy5fX0NFX3N0YXRlJiZiLmRpc2Nvbm5lY3RlZENhbGxiYWNrKGMpfX1cbmZ1bmN0aW9uIEEoYixhLGUpe2U9ZT9lOm5ldyBTZXQ7dmFyIGM9W107bihhLGZ1bmN0aW9uKGQpe2lmKFwibGlua1wiPT09ZC5sb2NhbE5hbWUmJlwiaW1wb3J0XCI9PT1kLmdldEF0dHJpYnV0ZShcInJlbFwiKSl7dmFyIGE9ZC5pbXBvcnQ7YSBpbnN0YW5jZW9mIE5vZGUmJlwiY29tcGxldGVcIj09PWEucmVhZHlTdGF0ZT8oYS5fX0NFX2lzSW1wb3J0RG9jdW1lbnQ9ITAsYS5fX0NFX2hhc1JlZ2lzdHJ5PSEwKTpkLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oKXt2YXIgYT1kLmltcG9ydDthLl9fQ0VfZG9jdW1lbnRMb2FkSGFuZGxlZHx8KGEuX19DRV9kb2N1bWVudExvYWRIYW5kbGVkPSEwLGEuX19DRV9pc0ltcG9ydERvY3VtZW50PSEwLGEuX19DRV9oYXNSZWdpc3RyeT0hMCxuZXcgU2V0KGUpLGUuZGVsZXRlKGEpLEEoYixhLGUpKX0pfWVsc2UgYy5wdXNoKGQpfSxlKTtpZihiLmIpZm9yKGE9MDthPGMubGVuZ3RoO2ErKyl3KGIsY1thXSk7Zm9yKGE9MDthPGMubGVuZ3RoO2ErKyl5KGIsXG5jW2FdKX1cbmZ1bmN0aW9uIHkoYixhKXtpZih2b2lkIDA9PT1hLl9fQ0Vfc3RhdGUpe3ZhciBlPWIuYS5nZXQoYS5sb2NhbE5hbWUpO2lmKGUpe2UuY29uc3RydWN0aW9uU3RhY2sucHVzaChhKTt2YXIgYz1lLmNvbnN0cnVjdG9yO3RyeXt0cnl7aWYobmV3IGMhPT1hKXRocm93IEVycm9yKFwiVGhlIGN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9yIGRpZCBub3QgcHJvZHVjZSB0aGUgZWxlbWVudCBiZWluZyB1cGdyYWRlZC5cIik7fWZpbmFsbHl7ZS5jb25zdHJ1Y3Rpb25TdGFjay5wb3AoKX19Y2F0Y2goZil7dGhyb3cgYS5fX0NFX3N0YXRlPTIsZjt9YS5fX0NFX3N0YXRlPTE7YS5fX0NFX2RlZmluaXRpb249ZTtpZihlLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaylmb3IoZT1lLm9ic2VydmVkQXR0cmlidXRlcyxjPTA7YzxlLmxlbmd0aDtjKyspe3ZhciBkPWVbY10saD1hLmdldEF0dHJpYnV0ZShkKTtudWxsIT09aCYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYSxkLG51bGwsaCxudWxsKX1sKGEpJiZiLmNvbm5lY3RlZENhbGxiYWNrKGEpfX19XG5yLnByb3RvdHlwZS5jb25uZWN0ZWRDYWxsYmFjaz1mdW5jdGlvbihiKXt2YXIgYT1iLl9fQ0VfZGVmaW5pdGlvbjthLmNvbm5lY3RlZENhbGxiYWNrJiZhLmNvbm5lY3RlZENhbGxiYWNrLmNhbGwoYil9O3IucHJvdG90eXBlLmRpc2Nvbm5lY3RlZENhbGxiYWNrPWZ1bmN0aW9uKGIpe3ZhciBhPWIuX19DRV9kZWZpbml0aW9uO2EuZGlzY29ubmVjdGVkQ2FsbGJhY2smJmEuZGlzY29ubmVjdGVkQ2FsbGJhY2suY2FsbChiKX07ci5wcm90b3R5cGUuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrPWZ1bmN0aW9uKGIsYSxlLGMsZCl7dmFyIGg9Yi5fX0NFX2RlZmluaXRpb247aC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2smJi0xPGgub2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YoYSkmJmguYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrLmNhbGwoYixhLGUsYyxkKX07ZnVuY3Rpb24gQihiLGEpe3RoaXMuYz1iO3RoaXMuYT1hO3RoaXMuYj12b2lkIDA7QSh0aGlzLmMsdGhpcy5hKTtcImxvYWRpbmdcIj09PXRoaXMuYS5yZWFkeVN0YXRlJiYodGhpcy5iPW5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZi5iaW5kKHRoaXMpKSx0aGlzLmIub2JzZXJ2ZSh0aGlzLmEse2NoaWxkTGlzdDohMCxzdWJ0cmVlOiEwfSkpfWZ1bmN0aW9uIEMoYil7Yi5iJiZiLmIuZGlzY29ubmVjdCgpfUIucHJvdG90eXBlLmY9ZnVuY3Rpb24oYil7dmFyIGE9dGhpcy5hLnJlYWR5U3RhdGU7XCJpbnRlcmFjdGl2ZVwiIT09YSYmXCJjb21wbGV0ZVwiIT09YXx8Qyh0aGlzKTtmb3IoYT0wO2E8Yi5sZW5ndGg7YSsrKWZvcih2YXIgZT1iW2FdLmFkZGVkTm9kZXMsYz0wO2M8ZS5sZW5ndGg7YysrKUEodGhpcy5jLGVbY10pfTtmdW5jdGlvbiBjYSgpe3ZhciBiPXRoaXM7dGhpcy5iPXRoaXMuYT12b2lkIDA7dGhpcy5jPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEpe2IuYj1hO2IuYSYmYShiLmEpfSl9ZnVuY3Rpb24gRChiKXtpZihiLmEpdGhyb3cgRXJyb3IoXCJBbHJlYWR5IHJlc29sdmVkLlwiKTtiLmE9dm9pZCAwO2IuYiYmYi5iKHZvaWQgMCl9O2Z1bmN0aW9uIEUoYil7dGhpcy5mPSExO3RoaXMuYT1iO3RoaXMuaD1uZXcgTWFwO3RoaXMuZz1mdW5jdGlvbihiKXtyZXR1cm4gYigpfTt0aGlzLmI9ITE7dGhpcy5jPVtdO3RoaXMuaj1uZXcgQihiLGRvY3VtZW50KX1cbkUucHJvdG90eXBlLmw9ZnVuY3Rpb24oYixhKXt2YXIgZT10aGlzO2lmKCEoYSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3JzIG11c3QgYmUgZnVuY3Rpb25zLlwiKTtpZighayhiKSl0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJUaGUgZWxlbWVudCBuYW1lICdcIitiK1wiJyBpcyBub3QgdmFsaWQuXCIpO2lmKHRoaXMuYS5hLmdldChiKSl0aHJvdyBFcnJvcihcIkEgY3VzdG9tIGVsZW1lbnQgd2l0aCBuYW1lICdcIitiK1wiJyBoYXMgYWxyZWFkeSBiZWVuIGRlZmluZWQuXCIpO2lmKHRoaXMuZil0aHJvdyBFcnJvcihcIkEgY3VzdG9tIGVsZW1lbnQgaXMgYWxyZWFkeSBiZWluZyBkZWZpbmVkLlwiKTt0aGlzLmY9ITA7dmFyIGMsZCxoLGYsdTt0cnl7dmFyIHA9ZnVuY3Rpb24oYil7dmFyIGE9UFtiXTtpZih2b2lkIDAhPT1hJiYhKGEgaW5zdGFuY2VvZiBGdW5jdGlvbikpdGhyb3cgRXJyb3IoXCJUaGUgJ1wiK2IrXCInIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi5cIik7XG5yZXR1cm4gYX0sUD1hLnByb3RvdHlwZTtpZighKFAgaW5zdGFuY2VvZiBPYmplY3QpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgY3VzdG9tIGVsZW1lbnQgY29uc3RydWN0b3IncyBwcm90b3R5cGUgaXMgbm90IGFuIG9iamVjdC5cIik7Yz1wKFwiY29ubmVjdGVkQ2FsbGJhY2tcIik7ZD1wKFwiZGlzY29ubmVjdGVkQ2FsbGJhY2tcIik7aD1wKFwiYWRvcHRlZENhbGxiYWNrXCIpO2Y9cChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiKTt1PWEub2JzZXJ2ZWRBdHRyaWJ1dGVzfHxbXX1jYXRjaCh2YSl7cmV0dXJufWZpbmFsbHl7dGhpcy5mPSExfWJhKHRoaXMuYSxiLHtsb2NhbE5hbWU6Yixjb25zdHJ1Y3RvcjphLGNvbm5lY3RlZENhbGxiYWNrOmMsZGlzY29ubmVjdGVkQ2FsbGJhY2s6ZCxhZG9wdGVkQ2FsbGJhY2s6aCxhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6ZixvYnNlcnZlZEF0dHJpYnV0ZXM6dSxjb25zdHJ1Y3Rpb25TdGFjazpbXX0pO3RoaXMuYy5wdXNoKGIpO3RoaXMuYnx8KHRoaXMuYj1cbiEwLHRoaXMuZyhmdW5jdGlvbigpe2lmKCExIT09ZS5iKWZvcihlLmI9ITEsQShlLmEsZG9jdW1lbnQpOzA8ZS5jLmxlbmd0aDspe3ZhciBiPWUuYy5zaGlmdCgpOyhiPWUuaC5nZXQoYikpJiZEKGIpfX0pKX07RS5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGIpe2lmKGI9dGhpcy5hLmEuZ2V0KGIpKXJldHVybiBiLmNvbnN0cnVjdG9yfTtFLnByb3RvdHlwZS5vPWZ1bmN0aW9uKGIpe2lmKCFrKGIpKXJldHVybiBQcm9taXNlLnJlamVjdChuZXcgU3ludGF4RXJyb3IoXCInXCIrYitcIicgaXMgbm90IGEgdmFsaWQgY3VzdG9tIGVsZW1lbnQgbmFtZS5cIikpO3ZhciBhPXRoaXMuaC5nZXQoYik7aWYoYSlyZXR1cm4gYS5jO2E9bmV3IGNhO3RoaXMuaC5zZXQoYixhKTt0aGlzLmEuYS5nZXQoYikmJi0xPT09dGhpcy5jLmluZGV4T2YoYikmJkQoYSk7cmV0dXJuIGEuY307RS5wcm90b3R5cGUubT1mdW5jdGlvbihiKXtDKHRoaXMuaik7dmFyIGE9dGhpcy5nO3RoaXMuZz1mdW5jdGlvbihlKXtyZXR1cm4gYihmdW5jdGlvbigpe3JldHVybiBhKGUpfSl9fTtcbndpbmRvdy5DdXN0b21FbGVtZW50UmVnaXN0cnk9RTtFLnByb3RvdHlwZS5kZWZpbmU9RS5wcm90b3R5cGUubDtFLnByb3RvdHlwZS5nZXQ9RS5wcm90b3R5cGUuZ2V0O0UucHJvdG90eXBlLndoZW5EZWZpbmVkPUUucHJvdG90eXBlLm87RS5wcm90b3R5cGUucG9seWZpbGxXcmFwRmx1c2hDYWxsYmFjaz1FLnByb3RvdHlwZS5tO3ZhciBGPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCxkYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnROUyxlYT13aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLmltcG9ydE5vZGUsZmE9d2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5wcmVwZW5kLGdhPXdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuYXBwZW5kLEc9d2luZG93Lk5vZGUucHJvdG90eXBlLmNsb25lTm9kZSxIPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5hcHBlbmRDaGlsZCxJPXdpbmRvdy5Ob2RlLnByb3RvdHlwZS5pbnNlcnRCZWZvcmUsSj13aW5kb3cuTm9kZS5wcm90b3R5cGUucmVtb3ZlQ2hpbGQsSz13aW5kb3cuTm9kZS5wcm90b3R5cGUucmVwbGFjZUNoaWxkLEw9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuTm9kZS5wcm90b3R5cGUsXCJ0ZXh0Q29udGVudFwiKSxNPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hdHRhY2hTaGFkb3csTj1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSxcblwiaW5uZXJIVE1MXCIpLE89d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZSxRPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUsUj13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlQXR0cmlidXRlLFM9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmdldEF0dHJpYnV0ZU5TLFQ9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZU5TLFU9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZU5TLFY9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmluc2VydEFkamFjZW50RWxlbWVudCxoYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucHJlcGVuZCxpYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYXBwZW5kLGphPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5iZWZvcmUsa2E9d2luZG93LkVsZW1lbnQucHJvdG90eXBlLmFmdGVyLGxhPXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZXBsYWNlV2l0aCxtYT13aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlLFxubmE9d2luZG93LkhUTUxFbGVtZW50LFc9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlLFwiaW5uZXJIVE1MXCIpLFg9d2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZS5pbnNlcnRBZGphY2VudEVsZW1lbnQ7ZnVuY3Rpb24gb2EoKXt2YXIgYj1ZO3dpbmRvdy5IVE1MRWxlbWVudD1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoKXt2YXIgYT10aGlzLmNvbnN0cnVjdG9yLGM9Yi5mLmdldChhKTtpZighYyl0aHJvdyBFcnJvcihcIlRoZSBjdXN0b20gZWxlbWVudCBiZWluZyBjb25zdHJ1Y3RlZCB3YXMgbm90IHJlZ2lzdGVyZWQgd2l0aCBgY3VzdG9tRWxlbWVudHNgLlwiKTt2YXIgZD1jLmNvbnN0cnVjdGlvblN0YWNrO2lmKCFkLmxlbmd0aClyZXR1cm4gZD1GLmNhbGwoZG9jdW1lbnQsYy5sb2NhbE5hbWUpLE9iamVjdC5zZXRQcm90b3R5cGVPZihkLGEucHJvdG90eXBlKSxkLl9fQ0Vfc3RhdGU9MSxkLl9fQ0VfZGVmaW5pdGlvbj1jLHcoYixkKSxkO3ZhciBjPWQubGVuZ3RoLTEsaD1kW2NdO2lmKGg9PT1nKXRocm93IEVycm9yKFwiVGhlIEhUTUxFbGVtZW50IGNvbnN0cnVjdG9yIHdhcyBlaXRoZXIgY2FsbGVkIHJlZW50cmFudGx5IGZvciB0aGlzIGNvbnN0cnVjdG9yIG9yIGNhbGxlZCBtdWx0aXBsZSB0aW1lcy5cIik7XG5kW2NdPWc7T2JqZWN0LnNldFByb3RvdHlwZU9mKGgsYS5wcm90b3R5cGUpO3coYixoKTtyZXR1cm4gaH1hLnByb3RvdHlwZT1uYS5wcm90b3R5cGU7cmV0dXJuIGF9KCl9O2Z1bmN0aW9uIHBhKGIsYSxlKXthLnByZXBlbmQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBkPVtdLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7KytjKWRbYy0wXT1hcmd1bWVudHNbY107Yz1kLmZpbHRlcihmdW5jdGlvbihiKXtyZXR1cm4gYiBpbnN0YW5jZW9mIE5vZGUmJmwoYil9KTtlLmkuYXBwbHkodGhpcyxkKTtmb3IodmFyIGY9MDtmPGMubGVuZ3RoO2YrKyl6KGIsY1tmXSk7aWYobCh0aGlzKSlmb3IoYz0wO2M8ZC5sZW5ndGg7YysrKWY9ZFtjXSxmIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGYpfTthLmFwcGVuZD1mdW5jdGlvbihhKXtmb3IodmFyIGQ9W10sYz0wO2M8YXJndW1lbnRzLmxlbmd0aDsrK2MpZFtjLTBdPWFyZ3VtZW50c1tjXTtjPWQuZmlsdGVyKGZ1bmN0aW9uKGIpe3JldHVybiBiIGluc3RhbmNlb2YgTm9kZSYmbChiKX0pO2UuYXBwZW5kLmFwcGx5KHRoaXMsZCk7Zm9yKHZhciBmPTA7ZjxjLmxlbmd0aDtmKyspeihiLGNbZl0pO2lmKGwodGhpcykpZm9yKGM9MDtjPFxuZC5sZW5ndGg7YysrKWY9ZFtjXSxmIGluc3RhbmNlb2YgRWxlbWVudCYmeChiLGYpfX07ZnVuY3Rpb24gcWEoKXt2YXIgYj1ZO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiY3JlYXRlRWxlbWVudFwiLGZ1bmN0aW9uKGEpe2lmKHRoaXMuX19DRV9oYXNSZWdpc3RyeSl7dmFyIGU9Yi5hLmdldChhKTtpZihlKXJldHVybiBuZXcgZS5jb25zdHJ1Y3Rvcn1hPUYuY2FsbCh0aGlzLGEpO3coYixhKTtyZXR1cm4gYX0pO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiaW1wb3J0Tm9kZVwiLGZ1bmN0aW9uKGEsZSl7YT1lYS5jYWxsKHRoaXMsYSxlKTt0aGlzLl9fQ0VfaGFzUmVnaXN0cnk/QShiLGEpOnYoYixhKTtyZXR1cm4gYX0pO3EoRG9jdW1lbnQucHJvdG90eXBlLFwiY3JlYXRlRWxlbWVudE5TXCIsZnVuY3Rpb24oYSxlKXtpZih0aGlzLl9fQ0VfaGFzUmVnaXN0cnkmJihudWxsPT09YXx8XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI9PT1hKSl7dmFyIGM9Yi5hLmdldChlKTtpZihjKXJldHVybiBuZXcgYy5jb25zdHJ1Y3Rvcn1hPWRhLmNhbGwodGhpcyxhLGUpO3coYixhKTtyZXR1cm4gYX0pO1xucGEoYixEb2N1bWVudC5wcm90b3R5cGUse2k6ZmEsYXBwZW5kOmdhfSl9O2Z1bmN0aW9uIHJhKCl7dmFyIGI9WTtmdW5jdGlvbiBhKGEsYyl7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsXCJ0ZXh0Q29udGVudFwiLHtlbnVtZXJhYmxlOmMuZW51bWVyYWJsZSxjb25maWd1cmFibGU6ITAsZ2V0OmMuZ2V0LHNldDpmdW5jdGlvbihhKXtpZih0aGlzLm5vZGVUeXBlPT09Tm9kZS5URVhUX05PREUpYy5zZXQuY2FsbCh0aGlzLGEpO2Vsc2V7dmFyIGQ9dm9pZCAwO2lmKHRoaXMuZmlyc3RDaGlsZCl7dmFyIGU9dGhpcy5jaGlsZE5vZGVzLHU9ZS5sZW5ndGg7aWYoMDx1JiZsKHRoaXMpKWZvcih2YXIgZD1BcnJheSh1KSxwPTA7cDx1O3ArKylkW3BdPWVbcF19Yy5zZXQuY2FsbCh0aGlzLGEpO2lmKGQpZm9yKGE9MDthPGQubGVuZ3RoO2ErKyl6KGIsZFthXSl9fX0pfXEoTm9kZS5wcm90b3R5cGUsXCJpbnNlcnRCZWZvcmVcIixmdW5jdGlvbihhLGMpe2lmKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTtcbmE9SS5jYWxsKHRoaXMsYSxjKTtpZihsKHRoaXMpKWZvcihjPTA7YzxkLmxlbmd0aDtjKyspeChiLGRbY10pO3JldHVybiBhfWQ9bChhKTtjPUkuY2FsbCh0aGlzLGEsYyk7ZCYmeihiLGEpO2wodGhpcykmJngoYixhKTtyZXR1cm4gY30pO3EoTm9kZS5wcm90b3R5cGUsXCJhcHBlbmRDaGlsZFwiLGZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTthPUguY2FsbCh0aGlzLGEpO2lmKGwodGhpcykpZm9yKHZhciBkPTA7ZDxjLmxlbmd0aDtkKyspeChiLGNbZF0pO3JldHVybiBhfWM9bChhKTtkPUguY2FsbCh0aGlzLGEpO2MmJnooYixhKTtsKHRoaXMpJiZ4KGIsYSk7cmV0dXJuIGR9KTtxKE5vZGUucHJvdG90eXBlLFwiY2xvbmVOb2RlXCIsZnVuY3Rpb24oYSl7YT1HLmNhbGwodGhpcyxhKTt0aGlzLm93bmVyRG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT9BKGIsYSk6dihiLGEpO1xucmV0dXJuIGF9KTtxKE5vZGUucHJvdG90eXBlLFwicmVtb3ZlQ2hpbGRcIixmdW5jdGlvbihhKXt2YXIgYz1sKGEpLGQ9Si5jYWxsKHRoaXMsYSk7YyYmeihiLGEpO3JldHVybiBkfSk7cShOb2RlLnByb3RvdHlwZSxcInJlcGxhY2VDaGlsZFwiLGZ1bmN0aW9uKGEsYyl7aWYoYSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhLmNoaWxkTm9kZXMpO2E9Sy5jYWxsKHRoaXMsYSxjKTtpZihsKHRoaXMpKWZvcih6KGIsYyksYz0wO2M8ZC5sZW5ndGg7YysrKXgoYixkW2NdKTtyZXR1cm4gYX12YXIgZD1sKGEpLGU9Sy5jYWxsKHRoaXMsYSxjKSxmPWwodGhpcyk7ZiYmeihiLGMpO2QmJnooYixhKTtmJiZ4KGIsYSk7cmV0dXJuIGV9KTtMJiZMLmdldD9hKE5vZGUucHJvdG90eXBlLEwpOnQoYixmdW5jdGlvbihiKXthKGIse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe2Zvcih2YXIgYT1bXSxiPVxuMDtiPHRoaXMuY2hpbGROb2Rlcy5sZW5ndGg7YisrKWEucHVzaCh0aGlzLmNoaWxkTm9kZXNbYl0udGV4dENvbnRlbnQpO3JldHVybiBhLmpvaW4oXCJcIil9LHNldDpmdW5jdGlvbihhKXtmb3IoO3RoaXMuZmlyc3RDaGlsZDspSi5jYWxsKHRoaXMsdGhpcy5maXJzdENoaWxkKTtILmNhbGwodGhpcyxkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSl9fSl9KX07ZnVuY3Rpb24gc2EoYil7dmFyIGE9RWxlbWVudC5wcm90b3R5cGU7YS5iZWZvcmU9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGFyZ3VtZW50cy5sZW5ndGg7KytkKWNbZC0wXT1hcmd1bWVudHNbZF07ZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KTtqYS5hcHBseSh0aGlzLGMpO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKXooYixkW2VdKTtpZihsKHRoaXMpKWZvcihkPTA7ZDxjLmxlbmd0aDtkKyspZT1jW2RdLGUgaW5zdGFuY2VvZiBFbGVtZW50JiZ4KGIsZSl9O2EuYWZ0ZXI9ZnVuY3Rpb24oYSl7Zm9yKHZhciBjPVtdLGQ9MDtkPGFyZ3VtZW50cy5sZW5ndGg7KytkKWNbZC0wXT1hcmd1bWVudHNbZF07ZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KTtrYS5hcHBseSh0aGlzLGMpO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKXooYixkW2VdKTtpZihsKHRoaXMpKWZvcihkPVxuMDtkPGMubGVuZ3RoO2QrKyllPWNbZF0sZSBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixlKX07YS5yZXBsYWNlV2l0aD1mdW5jdGlvbihhKXtmb3IodmFyIGM9W10sZD0wO2Q8YXJndW1lbnRzLmxlbmd0aDsrK2QpY1tkLTBdPWFyZ3VtZW50c1tkXTt2YXIgZD1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUmJmwoYSl9KSxlPWwodGhpcyk7bGEuYXBwbHkodGhpcyxjKTtmb3IodmFyIGY9MDtmPGQubGVuZ3RoO2YrKyl6KGIsZFtmXSk7aWYoZSlmb3IoeihiLHRoaXMpLGQ9MDtkPGMubGVuZ3RoO2QrKyllPWNbZF0sZSBpbnN0YW5jZW9mIEVsZW1lbnQmJngoYixlKX07YS5yZW1vdmU9ZnVuY3Rpb24oKXt2YXIgYT1sKHRoaXMpO21hLmNhbGwodGhpcyk7YSYmeihiLHRoaXMpfX07ZnVuY3Rpb24gdGEoKXt2YXIgYj1ZO2Z1bmN0aW9uIGEoYSxjKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxcImlubmVySFRNTFwiLHtlbnVtZXJhYmxlOmMuZW51bWVyYWJsZSxjb25maWd1cmFibGU6ITAsZ2V0OmMuZ2V0LHNldDpmdW5jdGlvbihhKXt2YXIgZD10aGlzLGU9dm9pZCAwO2wodGhpcykmJihlPVtdLG4odGhpcyxmdW5jdGlvbihhKXthIT09ZCYmZS5wdXNoKGEpfSkpO2Muc2V0LmNhbGwodGhpcyxhKTtpZihlKWZvcih2YXIgZj0wO2Y8ZS5sZW5ndGg7ZisrKXt2YXIgaD1lW2ZdOzE9PT1oLl9fQ0Vfc3RhdGUmJmIuZGlzY29ubmVjdGVkQ2FsbGJhY2soaCl9dGhpcy5vd25lckRvY3VtZW50Ll9fQ0VfaGFzUmVnaXN0cnk/QShiLHRoaXMpOnYoYix0aGlzKTtyZXR1cm4gYX19KX1mdW5jdGlvbiBlKGEsYyl7cShhLFwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50XCIsZnVuY3Rpb24oYSxkKXt2YXIgZT1sKGQpO2E9Yy5jYWxsKHRoaXMsYSxkKTtlJiZ6KGIsZCk7bChhKSYmeChiLGQpO1xucmV0dXJuIGF9KX1NP3EoRWxlbWVudC5wcm90b3R5cGUsXCJhdHRhY2hTaGFkb3dcIixmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fX0NFX3NoYWRvd1Jvb3Q9YT1NLmNhbGwodGhpcyxhKX0pOmNvbnNvbGUud2FybihcIkN1c3RvbSBFbGVtZW50czogYEVsZW1lbnQjYXR0YWNoU2hhZG93YCB3YXMgbm90IHBhdGNoZWQuXCIpO2lmKE4mJk4uZ2V0KWEoRWxlbWVudC5wcm90b3R5cGUsTik7ZWxzZSBpZihXJiZXLmdldClhKEhUTUxFbGVtZW50LnByb3RvdHlwZSxXKTtlbHNle3ZhciBjPUYuY2FsbChkb2N1bWVudCxcImRpdlwiKTt0KGIsZnVuY3Rpb24oYil7YShiLHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gRy5jYWxsKHRoaXMsITApLmlubmVySFRNTH0sc2V0OmZ1bmN0aW9uKGEpe3ZhciBiPVwidGVtcGxhdGVcIj09PXRoaXMubG9jYWxOYW1lP3RoaXMuY29udGVudDp0aGlzO2ZvcihjLmlubmVySFRNTD1hOzA8Yi5jaGlsZE5vZGVzLmxlbmd0aDspSi5jYWxsKGIsXG5iLmNoaWxkTm9kZXNbMF0pO2Zvcig7MDxjLmNoaWxkTm9kZXMubGVuZ3RoOylILmNhbGwoYixjLmNoaWxkTm9kZXNbMF0pfX0pfSl9cShFbGVtZW50LnByb3RvdHlwZSxcInNldEF0dHJpYnV0ZVwiLGZ1bmN0aW9uKGEsYyl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gUS5jYWxsKHRoaXMsYSxjKTt2YXIgZD1PLmNhbGwodGhpcyxhKTtRLmNhbGwodGhpcyxhLGMpO2M9Ty5jYWxsKHRoaXMsYSk7ZCE9PWMmJmIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKHRoaXMsYSxkLGMsbnVsbCl9KTtxKEVsZW1lbnQucHJvdG90eXBlLFwic2V0QXR0cmlidXRlTlNcIixmdW5jdGlvbihhLGMsZSl7aWYoMSE9PXRoaXMuX19DRV9zdGF0ZSlyZXR1cm4gVC5jYWxsKHRoaXMsYSxjLGUpO3ZhciBkPVMuY2FsbCh0aGlzLGEsYyk7VC5jYWxsKHRoaXMsYSxjLGUpO2U9Uy5jYWxsKHRoaXMsYSxjKTtkIT09ZSYmYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcyxjLGQsZSxhKX0pO3EoRWxlbWVudC5wcm90b3R5cGUsXG5cInJlbW92ZUF0dHJpYnV0ZVwiLGZ1bmN0aW9uKGEpe2lmKDEhPT10aGlzLl9fQ0Vfc3RhdGUpcmV0dXJuIFIuY2FsbCh0aGlzLGEpO3ZhciBjPU8uY2FsbCh0aGlzLGEpO1IuY2FsbCh0aGlzLGEpO251bGwhPT1jJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGEsYyxudWxsLG51bGwpfSk7cShFbGVtZW50LnByb3RvdHlwZSxcInJlbW92ZUF0dHJpYnV0ZU5TXCIsZnVuY3Rpb24oYSxjKXtpZigxIT09dGhpcy5fX0NFX3N0YXRlKXJldHVybiBVLmNhbGwodGhpcyxhLGMpO3ZhciBkPVMuY2FsbCh0aGlzLGEsYyk7VS5jYWxsKHRoaXMsYSxjKTt2YXIgZT1TLmNhbGwodGhpcyxhLGMpO2QhPT1lJiZiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLGMsZCxlLGEpfSk7WD9lKEhUTUxFbGVtZW50LnByb3RvdHlwZSxYKTpWP2UoRWxlbWVudC5wcm90b3R5cGUsVik6Y29uc29sZS53YXJuKFwiQ3VzdG9tIEVsZW1lbnRzOiBgRWxlbWVudCNpbnNlcnRBZGphY2VudEVsZW1lbnRgIHdhcyBub3QgcGF0Y2hlZC5cIik7XG5wYShiLEVsZW1lbnQucHJvdG90eXBlLHtpOmhhLGFwcGVuZDppYX0pO3NhKGIpfTtcbnZhciBaPXdpbmRvdy5jdXN0b21FbGVtZW50cztpZighWnx8Wi5mb3JjZVBvbHlmaWxsfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBaLmRlZmluZXx8XCJmdW5jdGlvblwiIT10eXBlb2YgWi5nZXQpe3ZhciBZPW5ldyByO29hKCk7cWEoKTtyYSgpO3RhKCk7ZG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeT0hMDt2YXIgdWE9bmV3IEUoWSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdyxcImN1c3RvbUVsZW1lbnRzXCIse2NvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwLHZhbHVlOnVhfSl9O1xufSkuY2FsbChzZWxmKTtcbn1cbn0oKSk7IiwiLyogVU1ELmRlZmluZSAqLyAoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGN1c3RvbUxvYWRlciA9PT0gJ2Z1bmN0aW9uJyl7IGN1c3RvbUxvYWRlcihmYWN0b3J5LCAnZG9tJyk7IH1lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHsgZGVmaW5lKFtdLCBmYWN0b3J5KTsgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHsgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7IH0gZWxzZSB7IHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTsgd2luZG93LmRvbSA9IGZhY3RvcnkoKTsgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXJcbiAgICAgICAgaXNGbG9hdCA9IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgICAgICAnei1pbmRleCc6IDFcbiAgICAgICAgfSxcbiAgICAgICAgaXNEaW1lbnNpb24gPSB7XG4gICAgICAgICAgICB3aWR0aDoxLFxuICAgICAgICAgICAgaGVpZ2h0OjEsXG4gICAgICAgICAgICB0b3A6MSxcbiAgICAgICAgICAgIGxlZnQ6MSxcbiAgICAgICAgICAgIHJpZ2h0OjEsXG4gICAgICAgICAgICBib3R0b206MSxcbiAgICAgICAgICAgIG1heFdpZHRoOjEsXG4gICAgICAgICAgICAnbWF4LXdpZHRoJzoxLFxuICAgICAgICAgICAgbWluV2lkdGg6MSxcbiAgICAgICAgICAgICdtaW4td2lkdGgnOjEsXG4gICAgICAgICAgICBtYXhIZWlnaHQ6MSxcbiAgICAgICAgICAgICdtYXgtaGVpZ2h0JzoxXG4gICAgICAgIH0sXG4gICAgICAgIHVpZHMgPSB7fSxcbiAgICAgICAgZGVzdHJveWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBmdW5jdGlvbiB1aWQgKHR5cGUpe1xuXHRcdHR5cGUgPSB0eXBlIHx8ICd1aWQnO1xuICAgICAgICBpZih1aWRzW3R5cGVdID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdWlkc1t0eXBlXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkID0gdHlwZSArICctJyArICh1aWRzW3R5cGVdICsgMSk7XG4gICAgICAgIHVpZHNbdHlwZV0rKztcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTm9kZSAoaXRlbSl7XG4gICAgICAgIC8vIHNhZmVyIHRlc3QgZm9yIGN1c3RvbSBlbGVtZW50cyBpbiBGRiAod2l0aCB3YyBzaGltKVxuXHQgICAgLy8gZnJhZ21lbnQgaXMgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgcmV0dXJuICEhaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgKHR5cGVvZiBpdGVtLmlubmVySFRNTCA9PT0gJ3N0cmluZycgfHwgaXRlbS5ub2RlTmFtZSA9PT0gJyNkb2N1bWVudC1mcmFnbWVudCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ5SWQgKGl0ZW0pe1xuXHRcdGlmKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyl7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbSk7XG5cdFx0fVxuXHRcdHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0eWxlIChub2RlLCBwcm9wLCB2YWx1ZSl7XG4gICAgICAgIHZhciBrZXksIGNvbXB1dGVkO1xuICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgLy8gb2JqZWN0IHNldHRlclxuICAgICAgICAgICAgZm9yKGtleSBpbiBwcm9wKXtcbiAgICAgICAgICAgICAgICBpZihwcm9wLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICBzdHlsZShub2RlLCBrZXksIHByb3Bba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1lbHNlIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgLy8gcHJvcGVydHkgc2V0dGVyXG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRGltZW5zaW9uW3Byb3BdKXtcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0dGVyLCBpZiBhIHNpbXBsZSBzdHlsZVxuICAgICAgICBpZihub2RlLnN0eWxlW3Byb3BdKXtcbiAgICAgICAgICAgIGlmKGlzRGltZW5zaW9uW3Byb3BdKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQobm9kZS5zdHlsZVtwcm9wXSwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoaXNGbG9hdFtwcm9wXSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobm9kZS5zdHlsZVtwcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5zdHlsZVtwcm9wXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldHRlciwgY29tcHV0ZWRcbiAgICAgICAgY29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUsIHByb3ApO1xuICAgICAgICBpZihjb21wdXRlZFtwcm9wXSl7XG4gICAgICAgICAgICBpZigvXFxkLy50ZXN0KGNvbXB1dGVkW3Byb3BdKSl7XG4gICAgICAgICAgICAgICAgaWYoIWlzTmFOKHBhcnNlSW50KGNvbXB1dGVkW3Byb3BdLCAxMCkpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGNvbXB1dGVkW3Byb3BdLCAxMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXR0ciAobm9kZSwgcHJvcCwgdmFsdWUpe1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgZm9yKGtleSBpbiBwcm9wKXtcbiAgICAgICAgICAgICAgICBpZihwcm9wLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgICAgICBhdHRyKG5vZGUsIGtleSwgcHJvcFtrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgaWYocHJvcCA9PT0gJ3RleHQnIHx8IHByb3AgPT09ICdodG1sJyB8fCBwcm9wID09PSAnaW5uZXJIVE1MJykge1xuICAgICAgICAgICAgXHQvLyBpZ25vcmUsIGhhbmRsZWQgZHVyaW5nIGNyZWF0aW9uXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYocHJvcCA9PT0gJ2NsYXNzTmFtZScgfHwgcHJvcCA9PT0gJ2NsYXNzJykge1xuXHRcdFx0XHRub2RlLmNsYXNzTmFtZSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZihwcm9wID09PSAnc3R5bGUnKSB7XG5cdFx0XHRcdHN0eWxlKG5vZGUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYocHJvcCA9PT0gJ2F0dHInKSB7XG4gICAgICAgICAgICBcdC8vIGJhY2sgY29tcGF0XG5cdFx0XHRcdGF0dHIobm9kZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIFx0Ly8gb2JqZWN0LCBsaWtlICdkYXRhJ1xuXHRcdFx0XHRub2RlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHByb3AsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShwcm9wKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBib3ggKG5vZGUpe1xuICAgICAgICBpZihub2RlID09PSB3aW5kb3cpe1xuICAgICAgICAgICAgbm9kZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBub2RlIGRpbWVuc2lvbnNcbiAgICAgICAgLy8gcmV0dXJuZWQgb2JqZWN0IGlzIGltbXV0YWJsZVxuICAgICAgICAvLyBhZGQgc2Nyb2xsIHBvc2l0aW9uaW5nIGFuZCBjb252ZW5pZW5jZSBhYmJyZXZpYXRpb25zXG4gICAgICAgIHZhclxuICAgICAgICAgICAgZGltZW5zaW9ucyA9IGJ5SWQobm9kZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IGRpbWVuc2lvbnMudG9wLFxuICAgICAgICAgICAgcmlnaHQ6IGRpbWVuc2lvbnMucmlnaHQsXG4gICAgICAgICAgICBib3R0b206IGRpbWVuc2lvbnMuYm90dG9tLFxuICAgICAgICAgICAgbGVmdDogZGltZW5zaW9ucy5sZWZ0LFxuICAgICAgICAgICAgaGVpZ2h0OiBkaW1lbnNpb25zLmhlaWdodCxcbiAgICAgICAgICAgIGg6IGRpbWVuc2lvbnMuaGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IGRpbWVuc2lvbnMud2lkdGgsXG4gICAgICAgICAgICB3OiBkaW1lbnNpb25zLndpZHRoLFxuICAgICAgICAgICAgc2Nyb2xsWTogd2luZG93LnNjcm9sbFksXG4gICAgICAgICAgICBzY3JvbGxYOiB3aW5kb3cuc2Nyb2xsWCxcbiAgICAgICAgICAgIHg6IGRpbWVuc2lvbnMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgIHk6IGRpbWVuc2lvbnMudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVlcnkgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIXNlbGVjdG9yKXtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcXVlcnlBbGwgKG5vZGUsIHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIXNlbGVjdG9yKXtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBkb2N1bWVudDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm9kZXMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgICAgIGlmKCFub2Rlcy5sZW5ndGgpeyByZXR1cm4gW107IH1cblxuICAgICAgICAvLyBjb252ZXJ0IHRvIEFycmF5IGFuZCByZXR1cm4gaXRcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0RvbSAoaHRtbCwgb3B0aW9ucywgcGFyZW50KXtcbiAgICAgICAgdmFyIG5vZGUgPSBkb20oJ2RpdicsIHtodG1sOiBodG1sfSk7XG4gICAgICAgIHBhcmVudCA9IGJ5SWQocGFyZW50IHx8IG9wdGlvbnMpO1xuICAgICAgICBpZihwYXJlbnQpe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5maXJzdENoaWxkKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYoaHRtbC5pbmRleE9mKCc8JykgIT09IDApe1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tRG9tIChub2RlKSB7XG4gICAgICAgIGZ1bmN0aW9uIGdldEF0dHJzIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgYXR0LCBpLCBhdHRycyA9IHt9O1xuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBhdHQgPSBub2RlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgYXR0cnNbYXR0LmxvY2FsTmFtZV0gPSBub3JtYWxpemUoYXR0LnZhbHVlID09PSAnJyA/IHRydWUgOiBhdHQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF0dHJzO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGdldFRleHQgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBpLCB0LCB0ZXh0ID0gJyc7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHQgPSBub2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgaWYodC5ub2RlVHlwZSA9PT0gMyAmJiB0LnRleHRDb250ZW50LnRyaW0oKSl7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gdC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGksIG9iamVjdCA9IGdldEF0dHJzKG5vZGUpO1xuICAgICAgICBvYmplY3QudGV4dCA9IGdldFRleHQobm9kZSk7XG4gICAgICAgIG9iamVjdC5jaGlsZHJlbiA9IFtdO1xuICAgICAgICBpZihub2RlLmNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBvYmplY3QuY2hpbGRyZW4ucHVzaChmcm9tRG9tKG5vZGUuY2hpbGRyZW5baV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuXHRmdW5jdGlvbiBhZGRDaGlsZHJlbiAobm9kZSwgY2hpbGRyZW4pIHtcblx0XHRpZihBcnJheS5pc0FycmF5KGNoaWxkcmVuKSl7XG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRpZihjaGlsZHJlbltpXSkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgY2hpbGRyZW5baV0gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRub2RlLmFwcGVuZENoaWxkKHRvRG9tKGNoaWxkcmVuW2ldKSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGRyZW5baV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChjaGlsZHJlbikge1xuXHRcdFx0bm9kZS5hcHBlbmRDaGlsZChjaGlsZHJlbik7XG5cdFx0fVxuXHR9XG5cbiAgICBmdW5jdGlvbiBhZGRDb250ZW50IChub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBodG1sO1xuICAgICAgICBpZihvcHRpb25zLmh0bWwgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLmlubmVySFRNTCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGh0bWwgPSBvcHRpb25zLmh0bWwgfHwgb3B0aW9ucy5pbm5lckhUTUwgfHwgJyc7XG4gICAgICAgICAgICBpZih0eXBlb2YgaHRtbCA9PT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgICAgIGFkZENoaWxkcmVuKG5vZGUsIGh0bWwpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBcdC8vIGNhcmVmdWwgYXNzdW1pbmcgdGV4dENvbnRlbnQgLVxuXHRcdFx0XHQvLyBtaXNzZXMgc29tZSBIVE1MLCBzdWNoIGFzIGVudGl0aWVzICgmbnBzcDspXG4gICAgICAgICAgICAgICAgbm9kZS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKG9wdGlvbnMudGV4dCl7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG9wdGlvbnMudGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9wdGlvbnMuY2hpbGRyZW4pe1xuICAgICAgICAgICAgYWRkQ2hpbGRyZW4obm9kZSwgb3B0aW9ucy5jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZG9tIChub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50LCBwcmVwZW5kKXtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdC8vIGlmIGZpcnN0IGFyZ3VtZW50IGlzIGEgc3RyaW5nIGFuZCBzdGFydHMgd2l0aCA8LCBwYXNzIHRvIHRvRG9tKClcbiAgICAgICAgaWYobm9kZVR5cGUuaW5kZXhPZignPCcpID09PSAwKXtcbiAgICAgICAgICAgIHJldHVybiB0b0RvbShub2RlVHlwZSwgb3B0aW9ucywgcGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlVHlwZSk7XG5cbiAgICAgICAgcGFyZW50ID0gYnlJZChwYXJlbnQpO1xuXG4gICAgICAgIGFkZENvbnRlbnQobm9kZSwgb3B0aW9ucyk7XG5cblx0XHRhdHRyKG5vZGUsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKHBhcmVudCAmJiBpc05vZGUocGFyZW50KSl7XG4gICAgICAgICAgICBpZihwcmVwZW5kICYmIHBhcmVudC5oYXNDaGlsZE5vZGVzKCkpe1xuICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc2VydEFmdGVyIChyZWZOb2RlLCBub2RlKSB7XG4gICAgICAgIHZhciBzaWJsaW5nID0gcmVmTm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIGlmKCFzaWJsaW5nKXtcbiAgICAgICAgICAgIHJlZk5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZWZOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIHNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaWJsaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3kgKG5vZGUpe1xuICAgICAgICAvLyBkZXN0cm95cyBhIG5vZGUgY29tcGxldGVseVxuICAgICAgICAvL1xuICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICBkZXN0cm95ZXIuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICBkZXN0cm95ZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbiAobm9kZSwgZGlzcG9zZSl7XG4gICAgICAgIC8vXHRSZW1vdmVzIGFsbCBjaGlsZCBub2Rlc1xuICAgICAgICAvL1x0XHRkaXNwb3NlOiBkZXN0cm95IGNoaWxkIG5vZGVzXG4gICAgICAgIGlmKGRpc3Bvc2Upe1xuICAgICAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIGRlc3Ryb3kobm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUobm9kZS5jaGlsZHJlbi5sZW5ndGgpe1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChub2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRvbS5jbGFzc0xpc3QgPSB7XG4gICAgXHQvLyBpbiBhZGRpdGlvbiB0byBmaXhpbmcgSUUxMSB0b2dnbGVcblx0XHQvLyB0aGVzZSBtZXRob2RzIGFsc28gaGFuZGxlIGFycmF5c1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICB0b0FycmF5KG5hbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBhZGQ6IGZ1bmN0aW9uIChub2RlLCBuYW1lcyl7XG4gICAgICAgICAgICB0b0FycmF5KG5hbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBjb250YWluczogZnVuY3Rpb24gKG5vZGUsIG5hbWVzKXtcbiAgICAgICAgICAgIHJldHVybiB0b0FycmF5KG5hbWVzKS5ldmVyeShmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uIChub2RlLCBuYW1lcywgdmFsdWUpe1xuICAgICAgICAgICAgbmFtZXMgPSB0b0FycmF5KG5hbWVzKTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAvLyB1c2Ugc3RhbmRhcmQgZnVuY3Rpb25hbGl0eSwgc3VwcG9ydGVkIGJ5IElFXG4gICAgICAgICAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC50b2dnbGUobmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IHRoZSBzZWNvbmQgcGFyYW1ldGVyICBcbiAgICAgICAgICAgIGVsc2UgaWYodmFsdWUpe1xuICAgICAgICAgICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiB0b0FycmF5IChuYW1lcyl7XG4gICAgICAgIGlmKCFuYW1lcyl7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdkb20uY2xhc3NMaXN0IHNob3VsZCBpbmNsdWRlIGEgbm9kZSBhbmQgYSBjbGFzc05hbWUnKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZXMuc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lLnRyaW0oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZSAodmFsKXtcbiAgICAgICAgaWYodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgXHR2YWwgPSB2YWwudHJpbSgpO1xuXHRcdFx0aWYodmFsID09PSAnZmFsc2UnKXtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih2YWwgPT09ICdudWxsJyl7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih2YWwgPT09ICd0cnVlJyl7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbC5pbmRleE9mKCcvJykgPiAtMSB8fCB2YWwuaW5kZXhPZignICcpID4gLTEgfHwgdmFsLmluZGV4T2YoJy0nKSA+IDApIHtcblx0XHRcdFx0cmV0dXJuIHZhbDtcblx0XHRcdH1cblx0XHR9XG4gICAgICAgIGlmKCFpc05hTihwYXJzZUZsb2F0KHZhbCkpKXtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG5cbiAgICBkb20ubm9ybWFsaXplID0gbm9ybWFsaXplO1xuICAgIGRvbS5jbGVhbiA9IGNsZWFuO1xuICAgIGRvbS5xdWVyeSA9IHF1ZXJ5O1xuICAgIGRvbS5xdWVyeUFsbCA9IHF1ZXJ5QWxsO1xuICAgIGRvbS5ieUlkID0gYnlJZDtcbiAgICBkb20uYXR0ciA9IGF0dHI7XG4gICAgZG9tLmJveCA9IGJveDtcbiAgICBkb20uc3R5bGUgPSBzdHlsZTtcbiAgICBkb20uZGVzdHJveSA9IGRlc3Ryb3k7XG4gICAgZG9tLnVpZCA9IHVpZDtcbiAgICBkb20uaXNOb2RlID0gaXNOb2RlO1xuICAgIGRvbS50b0RvbSA9IHRvRG9tO1xuICAgIGRvbS5mcm9tRG9tID0gZnJvbURvbTtcbiAgICBkb20uaW5zZXJ0QWZ0ZXIgPSBpbnNlcnRBZnRlcjtcblxuICAgIHJldHVybiBkb207XG59KSk7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBjdXN0b21Mb2FkZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRjdXN0b21Mb2FkZXIoZmFjdG9yeSwgJ29uJyk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHtcblx0XHRyb290LnJldHVybkV4cG9ydHMgPSB3aW5kb3cub24gPSBmYWN0b3J5KCk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0Ly8gbWFpbiBmdW5jdGlvblxuXG5cdGZ1bmN0aW9uIG9uIChub2RlLCBldmVudE5hbWUsIGZpbHRlciwgaGFuZGxlcikge1xuXHRcdC8vIG5vcm1hbGl6ZSBwYXJhbWV0ZXJzXG5cdFx0aWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykge1xuXHRcdFx0bm9kZSA9IGdldE5vZGVCeUlkKG5vZGUpO1xuXHRcdH1cblxuXHRcdC8vIHByZXBhcmUgYSBjYWxsYmFja1xuXHRcdHZhciBjYWxsYmFjayA9IG1ha2VDYWxsYmFjayhub2RlLCBmaWx0ZXIsIGhhbmRsZXIpO1xuXG5cdFx0Ly8gZnVuY3Rpb25hbCBldmVudFxuXHRcdGlmICh0eXBlb2YgZXZlbnROYW1lID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4gZXZlbnROYW1lKG5vZGUsIGNhbGxiYWNrKTtcblx0XHR9XG5cblx0XHQvLyBzcGVjaWFsIGNhc2U6IGtleWRvd24va2V5dXAgd2l0aCBhIGxpc3Qgb2YgZXhwZWN0ZWQga2V5c1xuXHRcdC8vIFRPRE86IGNvbnNpZGVyIHJlcGxhY2luZyB3aXRoIGFuIGV4cGxpY2l0IGV2ZW50IGZ1bmN0aW9uOlxuXHRcdC8vIHZhciBoID0gb24obm9kZSwgb25LZXlFdmVudCgna2V5dXAnLCAvRW50ZXIsRXNjLyksIGNhbGxiYWNrKTtcblx0XHR2YXIga2V5RXZlbnQgPSAvXihrZXl1cHxrZXlkb3duKTooLispJC8uZXhlYyhldmVudE5hbWUpO1xuXHRcdGlmIChrZXlFdmVudCkge1xuXHRcdFx0cmV0dXJuIG9uS2V5RXZlbnQoa2V5RXZlbnRbMV0sIG5ldyBSZWdFeHAoa2V5RXZlbnRbMl0uc3BsaXQoJywnKS5qb2luKCd8JykpKShub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIG11bHRpcGxlIGV2ZW50IHR5cGVzLCBsaWtlOiBvbihub2RlLCAnbW91c2V1cCwgbW91c2Vkb3duJywgY2FsbGJhY2spO1xuXHRcdGlmICgvLC8udGVzdChldmVudE5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gb24ubWFrZU11bHRpSGFuZGxlKGV2ZW50TmFtZS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0XHRyZXR1cm4gbmFtZS50cmltKCk7XG5cdFx0XHR9KS5maWx0ZXIoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0XHR9KS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIG9uKG5vZGUsIG5hbWUsIGNhbGxiYWNrKTtcblx0XHRcdH0pKTtcblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgcmVnaXN0ZXJlZCBmdW5jdGlvbmFsIGV2ZW50c1xuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob24uZXZlbnRzLCBldmVudE5hbWUpKSB7XG5cdFx0XHRyZXR1cm4gb24uZXZlbnRzW2V2ZW50TmFtZV0obm9kZSwgY2FsbGJhY2spO1xuXHRcdH1cblxuXHRcdC8vIHNwZWNpYWwgY2FzZTogbG9hZGluZyBhbiBpbWFnZVxuXHRcdGlmIChldmVudE5hbWUgPT09ICdsb2FkJyAmJiBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2ltZycpIHtcblx0XHRcdHJldHVybiBvbkltYWdlTG9hZChub2RlLCBjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gc3BlY2lhbCBjYXNlOiBtb3VzZXdoZWVsXG5cdFx0aWYgKGV2ZW50TmFtZSA9PT0gJ3doZWVsJykge1xuXHRcdFx0Ly8gcGFzcyB0aHJvdWdoLCBidXQgZmlyc3QgY3VycnkgY2FsbGJhY2sgdG8gd2hlZWwgZXZlbnRzXG5cdFx0XHRjYWxsYmFjayA9IG5vcm1hbGl6ZVdoZWVsRXZlbnQoY2FsbGJhY2spO1xuXHRcdFx0aWYgKCFoYXNXaGVlbCkge1xuXHRcdFx0XHQvLyBvbGQgRmlyZWZveCwgb2xkIElFLCBDaHJvbWVcblx0XHRcdFx0cmV0dXJuIG9uLm1ha2VNdWx0aUhhbmRsZShbXG5cdFx0XHRcdFx0b24obm9kZSwgJ0RPTU1vdXNlU2Nyb2xsJywgY2FsbGJhY2spLFxuXHRcdFx0XHRcdG9uKG5vZGUsICdtb3VzZXdoZWVsJywgY2FsbGJhY2spXG5cdFx0XHRcdF0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHNwZWNpYWwgY2FzZToga2V5Ym9hcmRcblx0XHRpZiAoL15rZXkvLnRlc3QoZXZlbnROYW1lKSkge1xuXHRcdFx0Y2FsbGJhY2sgPSBub3JtYWxpemVLZXlFdmVudChjYWxsYmFjayk7XG5cdFx0fVxuXG5cdFx0Ly8gZGVmYXVsdCBjYXNlXG5cdFx0cmV0dXJuIG9uLm9uRG9tRXZlbnQobm9kZSwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG5cdH1cblxuXHQvLyByZWdpc3RlcmVkIGZ1bmN0aW9uYWwgZXZlbnRzXG5cdG9uLmV2ZW50cyA9IHtcblx0XHQvLyBoYW5kbGUgY2xpY2sgYW5kIEVudGVyXG5cdFx0YnV0dG9uOiBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcblx0XHRcdHJldHVybiBvbi5tYWtlTXVsdGlIYW5kbGUoW1xuXHRcdFx0XHRvbihub2RlLCAnY2xpY2snLCBjYWxsYmFjayksXG5cdFx0XHRcdG9uKG5vZGUsICdrZXl1cDpFbnRlcicsIGNhbGxiYWNrKVxuXHRcdFx0XSk7XG5cdFx0fSxcblxuXHRcdC8vIGN1c3RvbSAtIHVzZWQgZm9yIHBvcHVwcyAnbiBzdHVmZlxuXHRcdGNsaWNrb2ZmOiBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcblx0XHRcdC8vIGltcG9ydGFudCBub3RlIVxuXHRcdFx0Ly8gc3RhcnRzIHBhdXNlZFxuXHRcdFx0Ly9cblx0XHRcdHZhciBiSGFuZGxlID0gb24obm9kZS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuXHRcdFx0XHRpZiAodGFyZ2V0Lm5vZGVUeXBlICE9PSAxKSB7XG5cdFx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRhcmdldCAmJiAhbm9kZS5jb250YWlucyh0YXJnZXQpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgaGFuZGxlID0ge1xuXHRcdFx0XHRzdGF0ZTogJ3Jlc3VtZWQnLFxuXHRcdFx0XHRyZXN1bWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGJIYW5kbGUucmVzdW1lKCk7XG5cdFx0XHRcdFx0fSwgMTAwKTtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gJ3Jlc3VtZWQnO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRwYXVzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJIYW5kbGUucGF1c2UoKTtcblx0XHRcdFx0XHR0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJlbW92ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJIYW5kbGUucmVtb3ZlKCk7XG5cdFx0XHRcdFx0dGhpcy5zdGF0ZSA9ICdyZW1vdmVkJztcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGhhbmRsZS5wYXVzZSgpO1xuXG5cdFx0XHRyZXR1cm4gaGFuZGxlO1xuXHRcdH1cblx0fTtcblxuXHQvLyBpbnRlcm5hbCBldmVudCBoYW5kbGVyc1xuXG5cdGZ1bmN0aW9uIG9uRG9tRXZlbnQgKG5vZGUsIGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2ssIGZhbHNlKTtcblx0XHRcdFx0bm9kZSA9IGNhbGxiYWNrID0gbnVsbDtcblx0XHRcdFx0dGhpcy5yZW1vdmUgPSB0aGlzLnBhdXNlID0gdGhpcy5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdH0sXG5cdFx0XHRwYXVzZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fSxcblx0XHRcdHJlc3VtZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBvbkltYWdlTG9hZCAobm9kZSwgY2FsbGJhY2spIHtcblx0XHR2YXIgaGFuZGxlID0gb24ubWFrZU11bHRpSGFuZGxlKFtcblx0XHRcdG9uLm9uRG9tRXZlbnQobm9kZSwgJ2xvYWQnLCBvbkltYWdlTG9hZCksXG5cdFx0XHRvbihub2RlLCAnZXJyb3InLCBjYWxsYmFjaylcblx0XHRdKTtcblxuXHRcdHJldHVybiBoYW5kbGU7XG5cblx0XHRmdW5jdGlvbiBvbkltYWdlTG9hZCAoZSkge1xuXHRcdFx0dmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAobm9kZS5uYXR1cmFsV2lkdGggfHwgbm9kZS5uYXR1cmFsSGVpZ2h0KSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG5cdFx0XHRcdFx0ZS53aWR0aCAgPSBlLm5hdHVyYWxXaWR0aCAgPSBub2RlLm5hdHVyYWxXaWR0aDtcblx0XHRcdFx0XHRlLmhlaWdodCA9IGUubmF0dXJhbEhlaWdodCA9IG5vZGUubmF0dXJhbEhlaWdodDtcblx0XHRcdFx0XHRjYWxsYmFjayhlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgMTAwKTtcblx0XHRcdGhhbmRsZS5yZW1vdmUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvbktleUV2ZW50IChrZXlFdmVudE5hbWUsIHJlKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIG9uKG5vZGUsIGtleUV2ZW50TmFtZSwgZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKHJlLnRlc3QoZS5rZXkpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cdH1cblxuXHQvLyBpbnRlcm5hbCB1dGlsaXRpZXNcblxuXHR2YXIgaGFzV2hlZWwgPSAoZnVuY3Rpb24gaGFzV2hlZWxUZXN0ICgpIHtcblx0XHR2YXJcblx0XHRcdGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xLFxuXHRcdFx0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cmV0dXJuIFwib253aGVlbFwiIGluIGRpdiB8fCBcIndoZWVsXCIgaW4gZGl2IHx8XG5cdFx0XHQoaXNJRSAmJiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiRXZlbnRzLndoZWVsXCIsIFwiMy4wXCIpKTsgLy8gSUUgZmVhdHVyZSBkZXRlY3Rpb25cblx0fSkoKTtcblxuXHR2YXIgbWF0Y2hlcztcblx0WydtYXRjaGVzJywgJ21hdGNoZXNTZWxlY3RvcicsICd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nXS5zb21lKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0aWYgKG5hbWUubGVuZ3RoIDwgNykgeyAvLyBwcmVmaXhcblx0XHRcdG5hbWUgKz0gJ01hdGNoZXNTZWxlY3Rvcic7XG5cdFx0fVxuXHRcdGlmIChFbGVtZW50LnByb3RvdHlwZVtuYW1lXSkge1xuXHRcdFx0bWF0Y2hlcyA9IG5hbWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBjbG9zZXN0IChlbGVtZW50LCBzZWxlY3RvciwgcGFyZW50KSB7XG5cdFx0d2hpbGUgKGVsZW1lbnQpIHtcblx0XHRcdGlmIChlbGVtZW50W29uLm1hdGNoZXNdICYmIGVsZW1lbnRbb24ubWF0Y2hlc10oc2VsZWN0b3IpKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVsZW1lbnQgPT09IHBhcmVudCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0dmFyIElOVkFMSURfUFJPUFMgPSB7XG5cdFx0aXNUcnVzdGVkOiAxXG5cdH07XG5cdGZ1bmN0aW9uIG1peCAob2JqZWN0LCB2YWx1ZSkge1xuXHRcdGlmICghdmFsdWUpIHtcblx0XHRcdHJldHVybiBvYmplY3Q7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRmb3IodmFyIGtleSBpbiB2YWx1ZSl7XG5cdFx0XHRcdGlmICghSU5WQUxJRF9QUk9QU1trZXldKSB7XG5cdFx0XHRcdFx0b2JqZWN0W2tleV0gPSB2YWx1ZVtrZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9iamVjdC52YWx1ZSA9IHZhbHVlO1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0dmFyIGllS2V5cyA9IHtcblx0XHQvL2E6ICdURVNUJyxcblx0XHRVcDogJ0Fycm93VXAnLFxuXHRcdERvd246ICdBcnJvd0Rvd24nLFxuXHRcdExlZnQ6ICdBcnJvd0xlZnQnLFxuXHRcdFJpZ2h0OiAnQXJyb3dSaWdodCcsXG5cdFx0RXNjOiAnRXNjYXBlJyxcblx0XHRTcGFjZWJhcjogJyAnLFxuXHRcdFdpbjogJ0NvbW1hbmQnXG5cdH07XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplS2V5RXZlbnQgKGNhbGxiYWNrKSB7XG5cdFx0Ly8gSUUgdXNlcyBvbGQgc3BlY1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKGllS2V5c1tlLmtleV0pIHtcblx0XHRcdFx0dmFyIGZha2VFdmVudCA9IG1peCh7fSwgZSk7XG5cdFx0XHRcdGZha2VFdmVudC5rZXkgPSBpZUtleXNbZS5rZXldO1xuXHRcdFx0XHRjYWxsYmFjayhmYWtlRXZlbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2FsbGJhY2soZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dmFyXG5cdFx0RkFDVE9SID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdXaW5kb3dzJykgPiAtMSA/IDEwIDogMC4xLFxuXHRcdFhMUjggPSAwLFxuXHRcdG1vdXNlV2hlZWxIYW5kbGU7XG5cblx0ZnVuY3Rpb24gbm9ybWFsaXplV2hlZWxFdmVudCAoY2FsbGJhY2spIHtcblx0XHQvLyBub3JtYWxpemVzIGFsbCBicm93c2VycycgZXZlbnRzIHRvIGEgc3RhbmRhcmQ6XG5cdFx0Ly8gZGVsdGEsIHdoZWVsWSwgd2hlZWxYXG5cdFx0Ly8gYWxzbyBhZGRzIGFjY2VsZXJhdGlvbiBhbmQgZGVjZWxlcmF0aW9uIHRvIG1ha2Vcblx0XHQvLyBNYWMgYW5kIFdpbmRvd3MgYmVoYXZlIHNpbWlsYXJseVxuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0WExSOCArPSBGQUNUT1I7XG5cdFx0XHR2YXJcblx0XHRcdFx0ZGVsdGFZID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIChlLndoZWVsRGVsdGFZIHx8IGUuZGVsdGFZKSkpLFxuXHRcdFx0XHRkZWx0YVggPSBNYXRoLm1heCgtMTAsIE1hdGgubWluKDEwLCAoZS53aGVlbERlbHRhWCB8fCBlLmRlbHRhWCkpKTtcblxuXHRcdFx0ZGVsdGFZID0gZGVsdGFZIDw9IDAgPyBkZWx0YVkgLSBYTFI4IDogZGVsdGFZICsgWExSODtcblxuXHRcdFx0ZS5kZWx0YSAgPSBkZWx0YVk7XG5cdFx0XHRlLndoZWVsWSA9IGRlbHRhWTtcblx0XHRcdGUud2hlZWxYID0gZGVsdGFYO1xuXG5cdFx0XHRjbGVhclRpbWVvdXQobW91c2VXaGVlbEhhbmRsZSk7XG5cdFx0XHRtb3VzZVdoZWVsSGFuZGxlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFhMUjggPSAwO1xuXHRcdFx0fSwgMzAwKTtcblx0XHRcdGNhbGxiYWNrKGUpO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBjbG9zZXN0RmlsdGVyIChlbGVtZW50LCBzZWxlY3Rvcikge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0cmV0dXJuIG9uLmNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yLCBlbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFrZU11bHRpSGFuZGxlIChoYW5kbGVzKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN0YXRlOiAncmVzdW1lZCcsXG5cdFx0XHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoKSB7XG5cdFx0XHRcdFx0Ly8gYWxsb3cgZm9yIGEgc2ltcGxlIGZ1bmN0aW9uIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0aWYgKGgucmVtb3ZlKSB7XG5cdFx0XHRcdFx0XHRoLnJlbW92ZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGggPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdGgoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRoYW5kbGVzID0gW107XG5cdFx0XHRcdHRoaXMucmVtb3ZlID0gdGhpcy5wYXVzZSA9IHRoaXMucmVzdW1lID0gZnVuY3Rpb24gKCkge307XG5cdFx0XHRcdHRoaXMuc3RhdGUgPSAncmVtb3ZlZCc7XG5cdFx0XHR9LFxuXHRcdFx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoKSB7XG5cdFx0XHRcdFx0aWYgKGgucGF1c2UpIHtcblx0XHRcdFx0XHRcdGgucGF1c2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG5cdFx0XHR9LFxuXHRcdFx0cmVzdW1lOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaCkge1xuXHRcdFx0XHRcdGlmIChoLnJlc3VtZSkge1xuXHRcdFx0XHRcdFx0aC5yZXN1bWUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnN0YXRlID0gJ3Jlc3VtZWQnO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBnZXROb2RlQnlJZCAoaWQpIHtcblx0XHR2YXIgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblx0XHRpZiAoIW5vZGUpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2BvbmAgQ291bGQgbm90IGZpbmQ6JywgaWQpO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9kZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1ha2VDYWxsYmFjayAobm9kZSwgZmlsdGVyLCBoYW5kbGVyKSB7XG5cdFx0aWYgKGZpbHRlciAmJiBoYW5kbGVyKSB7XG5cdFx0XHRpZiAodHlwZW9mIGZpbHRlciA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0ZmlsdGVyID0gY2xvc2VzdEZpbHRlcihub2RlLCBmaWx0ZXIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBmaWx0ZXIoZSk7XG5cdFx0XHRcdGlmIChyZXN1bHQpIHtcblx0XHRcdFx0XHRlLmZpbHRlcmVkVGFyZ2V0ID0gcmVzdWx0O1xuXHRcdFx0XHRcdGhhbmRsZXIoZSwgcmVzdWx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIGZpbHRlciB8fCBoYW5kbGVyO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0RG9jIChub2RlKSB7XG5cdFx0cmV0dXJuIG5vZGUgPT09IGRvY3VtZW50IHx8IG5vZGUgPT09IHdpbmRvdyA/IGRvY3VtZW50IDogbm9kZS5vd25lckRvY3VtZW50O1xuXHR9XG5cblx0Ly8gcHVibGljIGZ1bmN0aW9uc1xuXG5cdG9uLm9uY2UgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBmaWx0ZXIsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGg7XG5cdFx0aWYgKGZpbHRlciAmJiBjYWxsYmFjaykge1xuXHRcdFx0aCA9IG9uKG5vZGUsIGV2ZW50TmFtZSwgZmlsdGVyLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHdpbmRvdywgYXJndW1lbnRzKTtcblx0XHRcdFx0aC5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoID0gb24obm9kZSwgZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGZpbHRlci5hcHBseSh3aW5kb3csIGFyZ3VtZW50cyk7XG5cdFx0XHRcdGgucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGg7XG5cdH07XG5cblx0b24uZW1pdCA9IGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIHZhbHVlKSB7XG5cdFx0bm9kZSA9IHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyA/IGdldE5vZGVCeUlkKG5vZGUpIDogbm9kZTtcblx0XHR2YXIgZXZlbnQgPSBnZXREb2Mobm9kZSkuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcblx0XHRldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlKTsgLy8gZXZlbnQgdHlwZSwgYnViYmxpbmcsIGNhbmNlbGFibGVcblx0XHRyZXR1cm4gbm9kZS5kaXNwYXRjaEV2ZW50KG1peChldmVudCwgdmFsdWUpKTtcblx0fTtcblxuXHRvbi5maXJlID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpIHtcblx0XHRub2RlID0gdHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnID8gZ2V0Tm9kZUJ5SWQobm9kZSkgOiBub2RlO1xuXHRcdHZhciBldmVudCA9IGdldERvYyhub2RlKS5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcblx0XHRldmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnROYW1lLCAhIWJ1YmJsZXMsIHRydWUsIGV2ZW50RGV0YWlsKTsgLy8gZXZlbnQgdHlwZSwgYnViYmxpbmcsIGNhbmNlbGFibGUsIHZhbHVlXG5cdFx0cmV0dXJuIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH07XG5cblx0Ly8gVE9ETzogREVQUkVDQVRFRFxuXHRvbi5pc0FscGhhTnVtZXJpYyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0XHRyZXR1cm4gL15bMC05YS16XSQvaS50ZXN0KHN0cik7XG5cdH07XG5cblx0b24ubWFrZU11bHRpSGFuZGxlID0gbWFrZU11bHRpSGFuZGxlO1xuXHRvbi5vbkRvbUV2ZW50ID0gb25Eb21FdmVudDsgLy8gdXNlIGRpcmVjdGx5IHRvIHByZXZlbnQgcG9zc2libGUgZGVmaW5pdGlvbiBsb29wc1xuXHRvbi5jbG9zZXN0ID0gY2xvc2VzdDtcblx0b24ubWF0Y2hlcyA9IG1hdGNoZXM7XG5cblx0cmV0dXJuIG9uO1xufSkpO1xuIiwiLy8gQ2x1YiBBSkFYIEdlbmVyYWwgUHVycG9zZSBDb2RlXG4vL1xuLy8gUmFuZG9taXplclxuLy9cbi8vIGF1dGhvcjpcbi8vICAgICAgICAgICAgICBNaWtlIFdpbGNveFxuLy8gc2l0ZTpcbi8vICAgICAgICAgICAgICBodHRwOi8vY2x1YmFqYXgub3JnXG4vLyBzdXBwb3J0OlxuLy8gICAgICAgICAgICAgIGh0dHA6Ly9ncm91cHMuZ29vZ2xlLmNvbS9ncm91cC9jbHViYWpheFxuLy9cbi8vIGNsdWJhamF4LmxhbmcucmFuZFxuLy9cbi8vICAgICAgREVTQ1JJUFRJT046XG4vLyAgICAgICAgICAgICAgQSByYW5kb21pemVyIGxpYnJhcnkgdGhhdCdzIGdyZWF0IGZvciBwcm9kdWNpbmcgbW9jayBkYXRhLlxuLy8gICAgICAgICAgICAgIEFsbG93cyBkb3plbnMgb2Ygd2F5cyB0byByYW5kb21pemUgbnVtYmVycywgc3RyaW5ncywgd29yZHMsXG4vLyAgICAgICAgICAgICAgc2VudGVuY2VzLCBhbmQgZGF0ZXMuIEluY2x1ZGVzIHRpbnkgbGlicmFyaWVzIG9mIHRoZSBtb3N0XG4vLyAgICAgICAgICAgICAgY29tbW9ubHkgdXNlZCB3b3JkcyAoaW4gb3JkZXIpLCB0aGUgbW9zdCBjb21tb25seSB1c2VkIGxldHRlcnNcbi8vICAgICAgICAgICAgICAoaW4gb3JkZXIpIGFuZCBwZXJzb25hbCBuYW1lcyB0aGF0IGNhbiBiZSB1c2VkIGFzIGZpcnN0IG9yIGxhc3QuXG4vLyAgICAgICAgICAgICAgRm9yIG1ha2luZyBzZW50ZW5jZXMsIFwid3VyZHNcIiBhcmUgdXNlZCAtIHdvcmRzIHdpdGggc2NyYW1ibGVkIHZvd2Vsc1xuLy8gICAgICAgICAgICAgIHNvIHRoZXkgYXJlbid0IGFjdHVhbCB3b3JkcywgYnV0IGxvb2sgbW9yZSBsaWtlIGxvcmVtIGlwc3VtLiBDaGFuZ2UgdGhlXG4vLyAgICAgICAgICAgICAgcHJvcGVydHkgcmVhbCB0byB0cnVlIHRvIHVzZSBcIndvcmRzXCIgaW5zdGVhZCBvZiBcInd1cmRzXCIgKGl0IGNhblxuLy8gICAgICAgICAgICAgIGFsc28gcHJvZHVjZSBodW1vcm91cyByZXN1bHRzKS5cblxuLy8gICAgICBVU0FHRTpcbi8vICAgICAgICAgICAgICBpbmNsdWRlIGZpbGU6XG4vLyAgICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHNyYz1cImNsdWJhamF4L2xhbmcvcmFuZC5qc1wiPjwvc2NyaXB0PlxuLy9cbi8vIFRFU1RTOlxuLy8gICAgICAgICAgICAgIFNlZSB0ZXN0cy9yYW5kLmh0bWxcbi8vXG4vKiBVTUQuZGVmaW5lICovIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKXsgZGVmaW5lKFtdLCBmYWN0b3J5KTsgfWVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKXsgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7IH1lbHNleyByb290LnJldHVybkV4cG9ydHMgPSBmYWN0b3J5KCk7IHdpbmRvdy5yYW5kID0gZmFjdG9yeSgpOyB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0XG5cdHZhclxuXHRcdHJhbmQsXG5cdFx0Y2l0eVN0YXRlcyA9IFtcIk5ldyBZb3JrLCBOZXcgWW9ya1wiLCBcIkxvcyBBbmdlbGVzLCBDYWxpZm9ybmlhXCIsIFwiQ2hpY2FnbywgSWxsaW5vaXNcIiwgXCJIb3VzdG9uLCBUZXhhc1wiLCBcIlBoaWxhZGVscGhpYSwgUGVubnN5bHZhbmlhXCIsIFwiUGhvZW5peCwgQXJpem9uYVwiLCBcIlNhbiBEaWVnbywgQ2FsaWZvcm5pYVwiLCBcIlNhbiBBbnRvbmlvLCBUZXhhc1wiLCBcIkRhbGxhcywgVGV4YXNcIiwgXCJEZXRyb2l0LCBNaWNoaWdhblwiLCBcIlNhbiBKb3NlLCBDYWxpZm9ybmlhXCIsIFwiSW5kaWFuYXBvbGlzLCBJbmRpYW5hXCIsIFwiSmFja3NvbnZpbGxlLCBGbG9yaWRhXCIsIFwiU2FuIEZyYW5jaXNjbywgQ2FsaWZvcm5pYVwiLCBcIkNvbHVtYnVzLCBPaGlvXCIsIFwiQXVzdGluLCBUZXhhc1wiLCBcIk1lbXBoaXMsIFRlbm5lc3NlZVwiLCBcIkJhbHRpbW9yZSwgTWFyeWxhbmRcIiwgXCJDaGFybG90dGUsIE5vcnRoIENhcm9saW5hXCIsIFwiRm9ydCBXb3J0aCwgVGV4YXNcIiwgXCJCb3N0b24sIE1hc3NhY2h1c2V0dHNcIiwgXCJNaWx3YXVrZWUsIFdpc2NvbnNpblwiLCBcIkVsIFBhc28sIFRleGFzXCIsIFwiV2FzaGluZ3RvbiwgRGlzdHJpY3Qgb2YgQ29sdW1iaWFcIiwgXCJOYXNodmlsbGUtRGF2aWRzb24sIFRlbm5lc3NlZVwiLCBcIlNlYXR0bGUsIFdhc2hpbmd0b25cIiwgXCJEZW52ZXIsIENvbG9yYWRvXCIsIFwiTGFzIFZlZ2FzLCBOZXZhZGFcIiwgXCJQb3J0bGFuZCwgT3JlZ29uXCIsIFwiT2tsYWhvbWEgQ2l0eSwgT2tsYWhvbWFcIiwgXCJUdWNzb24sIEFyaXpvbmFcIiwgXCJBbGJ1cXVlcnF1ZSwgTmV3IE1leGljb1wiLCBcIkF0bGFudGEsIEdlb3JnaWFcIiwgXCJMb25nIEJlYWNoLCBDYWxpZm9ybmlhXCIsIFwiS2Fuc2FzIENpdHksIE1pc3NvdXJpXCIsIFwiRnJlc25vLCBDYWxpZm9ybmlhXCIsIFwiTmV3IE9ybGVhbnMsIExvdWlzaWFuYVwiLCBcIkNsZXZlbGFuZCwgT2hpb1wiLCBcIlNhY3JhbWVudG8sIENhbGlmb3JuaWFcIiwgXCJNZXNhLCBBcml6b25hXCIsIFwiVmlyZ2luaWEgQmVhY2gsIFZpcmdpbmlhXCIsIFwiT21haGEsIE5lYnJhc2thXCIsIFwiQ29sb3JhZG8gU3ByaW5ncywgQ29sb3JhZG9cIiwgXCJPYWtsYW5kLCBDYWxpZm9ybmlhXCIsIFwiTWlhbWksIEZsb3JpZGFcIiwgXCJUdWxzYSwgT2tsYWhvbWFcIiwgXCJNaW5uZWFwb2xpcywgTWlubmVzb3RhXCIsIFwiSG9ub2x1bHUsIEhhd2FpaVwiLCBcIkFybGluZ3RvbiwgVGV4YXNcIiwgXCJXaWNoaXRhLCBLYW5zYXNcIiwgXCJTdC4gTG91aXMsIE1pc3NvdXJpXCIsIFwiUmFsZWlnaCwgTm9ydGggQ2Fyb2xpbmFcIiwgXCJTYW50YSBBbmEsIENhbGlmb3JuaWFcIiwgXCJDaW5jaW5uYXRpLCBPaGlvXCIsIFwiQW5haGVpbSwgQ2FsaWZvcm5pYVwiLCBcIlRhbXBhLCBGbG9yaWRhXCIsIFwiVG9sZWRvLCBPaGlvXCIsIFwiUGl0dHNidXJnaCwgUGVubnN5bHZhbmlhXCIsIFwiQXVyb3JhLCBDb2xvcmFkb1wiLCBcIkJha2Vyc2ZpZWxkLCBDYWxpZm9ybmlhXCIsIFwiUml2ZXJzaWRlLCBDYWxpZm9ybmlhXCIsIFwiU3RvY2t0b24sIENhbGlmb3JuaWFcIiwgXCJDb3JwdXMgQ2hyaXN0aSwgVGV4YXNcIiwgXCJMZXhpbmd0b24tRmF5ZXR0ZSwgS2VudHVja3lcIiwgXCJCdWZmYWxvLCBOZXcgWW9ya1wiLCBcIlN0LiBQYXVsLCBNaW5uZXNvdGFcIiwgXCJBbmNob3JhZ2UsIEFsYXNrYVwiLCBcIk5ld2FyaywgTmV3IEplcnNleVwiLCBcIlBsYW5vLCBUZXhhc1wiLCBcIkZvcnQgV2F5bmUsIEluZGlhbmFcIiwgXCJTdC4gUGV0ZXJzYnVyZywgRmxvcmlkYVwiLCBcIkdsZW5kYWxlLCBBcml6b25hXCIsIFwiTGluY29sbiwgTmVicmFza2FcIiwgXCJOb3Jmb2xrLCBWaXJnaW5pYVwiLCBcIkplcnNleSBDaXR5LCBOZXcgSmVyc2V5XCIsIFwiR3JlZW5zYm9ybywgTm9ydGggQ2Fyb2xpbmFcIiwgXCJDaGFuZGxlciwgQXJpem9uYVwiLCBcIkJpcm1pbmdoYW0sIEFsYWJhbWFcIiwgXCJIZW5kZXJzb24sIE5ldmFkYVwiLCBcIlNjb3R0c2RhbGUsIEFyaXpvbmFcIiwgXCJOb3J0aCBIZW1wc3RlYWQsIE5ldyBZb3JrXCIsIFwiTWFkaXNvbiwgV2lzY29uc2luXCIsIFwiSGlhbGVhaCwgRmxvcmlkYVwiLCBcIkJhdG9uIFJvdWdlLCBMb3Vpc2lhbmFcIiwgXCJDaGVzYXBlYWtlLCBWaXJnaW5pYVwiLCBcIk9ybGFuZG8sIEZsb3JpZGFcIiwgXCJMdWJib2NrLCBUZXhhc1wiLCBcIkdhcmxhbmQsIFRleGFzXCIsIFwiQWtyb24sIE9oaW9cIiwgXCJSb2NoZXN0ZXIsIE5ldyBZb3JrXCIsIFwiQ2h1bGEgVmlzdGEsIENhbGlmb3JuaWFcIiwgXCJSZW5vLCBOZXZhZGFcIiwgXCJMYXJlZG8sIFRleGFzXCIsIFwiRHVyaGFtLCBOb3J0aCBDYXJvbGluYVwiLCBcIk1vZGVzdG8sIENhbGlmb3JuaWFcIiwgXCJIdW50aW5ndG9uLCBOZXcgWW9ya1wiLCBcIk1vbnRnb21lcnksIEFsYWJhbWFcIiwgXCJCb2lzZSwgSWRhaG9cIiwgXCJBcmxpbmd0b24sIFZpcmdpbmlhXCIsIFwiU2FuIEJlcm5hcmRpbm8sIENhbGlmb3JuaWFcIl0sXG5cdFx0c3RyZWV0U3VmZml4ZXMgPSAnUm9hZCxEcml2ZSxBdmVudWUsQmx2ZCxMYW5lLFN0cmVldCxXYXksQ2lyY2xlJy5zcGxpdCgnLCcpLFxuXHRcdHN0cmVldHMgPSBcIkZpcnN0LEZvdXJ0aCxQYXJrLEZpZnRoLE1haW4sU2l4dGgsT2FrLFNldmVudGgsUGluZSxNYXBsZSxDZWRhcixFaWdodGgsRWxtLFZpZXcsV2FzaGluZ3RvbixOaW50aCxMYWtlLEhpbGwsSGlnaCxTdGF0aW9uLE1haW4sUGFyayxDaHVyY2gsQ2h1cmNoLExvbmRvbixWaWN0b3JpYSxHcmVlbixNYW5vcixDaHVyY2gsUGFyayxUaGUgQ3Jlc2NlbnQsUXVlZW5zLE5ldyxHcmFuZ2UsS2luZ3MsS2luZ3N3YXksV2luZHNvcixIaWdoZmllbGQsTWlsbCxBbGV4YW5kZXIsWW9yayxTdC4gSm9oblxcJ3MsTWFpbixCcm9hZHdheSxLaW5nLFRoZSBHcmVlbixTcHJpbmdmaWVsZCxHZW9yZ2UsUGFyayxWaWN0b3JpYSxBbGJlcnQsUXVlZW5zd2F5LE5ldyxRdWVlbixXZXN0LE5vcnRoLE1hbmNoZXN0ZXIsVGhlIEdyb3ZlLFJpY2htb25kLEdyb3ZlLFNvdXRoLFNjaG9vbCxOb3J0aCxTdGFubGV5LENoZXN0ZXIsTWlsbCxcIi5zcGxpdCgnLCcpLFxuXHRcdHN0YXRlcyA9IFtcIkFsYWJhbWFcIiwgXCJBbGFza2FcIiwgXCJBbWVyaWNhbiBTYW1vYVwiLCBcIkFyaXpvbmFcIiwgXCJBcmthbnNhc1wiLCBcIkFybWVkIEZvcmNlcyBFdXJvcGVcIiwgXCJBcm1lZCBGb3JjZXMgUGFjaWZpY1wiLCBcIkFybWVkIEZvcmNlcyB0aGUgQW1lcmljYXNcIiwgXCJDYWxpZm9ybmlhXCIsIFwiQ29sb3JhZG9cIiwgXCJDb25uZWN0aWN1dFwiLCBcIkRlbGF3YXJlXCIsIFwiRGlzdHJpY3Qgb2YgQ29sdW1iaWFcIiwgXCJGZWRlcmF0ZWQgU3RhdGVzIG9mIE1pY3JvbmVzaWFcIiwgXCJGbG9yaWRhXCIsIFwiR2VvcmdpYVwiLCBcIkd1YW1cIiwgXCJIYXdhaWlcIiwgXCJJZGFob1wiLCBcIklsbGlub2lzXCIsIFwiSW5kaWFuYVwiLCBcIklvd2FcIiwgXCJLYW5zYXNcIiwgXCJLZW50dWNreVwiLCBcIkxvdWlzaWFuYVwiLCBcIk1haW5lXCIsIFwiTWFyc2hhbGwgSXNsYW5kc1wiLCBcIk1hcnlsYW5kXCIsIFwiTWFzc2FjaHVzZXR0c1wiLCBcIk1pY2hpZ2FuXCIsIFwiTWlubmVzb3RhXCIsIFwiTWlzc2lzc2lwcGlcIiwgXCJNaXNzb3VyaVwiLCBcIk1vbnRhbmFcIiwgXCJOZWJyYXNrYVwiLCBcIk5ldmFkYVwiLCBcIk5ldyBIYW1wc2hpcmVcIiwgXCJOZXcgSmVyc2V5XCIsIFwiTmV3IE1leGljb1wiLCBcIk5ldyBZb3JrXCIsIFwiTm9ydGggQ2Fyb2xpbmFcIiwgXCJOb3J0aCBEYWtvdGFcIiwgXCJOb3J0aGVybiBNYXJpYW5hIElzbGFuZHNcIiwgXCJPaGlvXCIsIFwiT2tsYWhvbWFcIiwgXCJPcmVnb25cIiwgXCJQZW5uc3lsdmFuaWFcIiwgXCJQdWVydG8gUmljb1wiLCBcIlJob2RlIElzbGFuZFwiLCBcIlNvdXRoIENhcm9saW5hXCIsIFwiU291dGggRGFrb3RhXCIsIFwiVGVubmVzc2VlXCIsIFwiVGV4YXNcIiwgXCJVdGFoXCIsIFwiVmVybW9udFwiLCBcIlZpcmdpbiBJc2xhbmRzLCBVLlMuXCIsIFwiVmlyZ2luaWFcIiwgXCJXYXNoaW5ndG9uXCIsIFwiV2VzdCBWaXJnaW5pYVwiLCBcIldpc2NvbnNpblwiLCBcIld5b21pbmdcIl0sXG5cdFx0c3RhdGVBYmJyID0gW1wiQUxcIiwgXCJBS1wiLCBcIkFTXCIsIFwiQVpcIiwgXCJBUlwiLCBcIkFFXCIsIFwiQVBcIiwgXCJBQVwiLCBcIkNBXCIsIFwiQ09cIiwgXCJDVFwiLCBcIkRFXCIsIFwiRENcIiwgXCJGTVwiLCBcIkZMXCIsIFwiR0FcIiwgXCJHVVwiLCBcIkhJXCIsIFwiSURcIiwgXCJJTFwiLCBcIklOXCIsIFwiSUFcIiwgXCJLU1wiLCBcIktZXCIsIFwiTEFcIiwgXCJNRVwiLCBcIk1IXCIsIFwiTURcIiwgXCJNQVwiLCBcIk1JXCIsIFwiTU5cIiwgXCJNU1wiLCBcIk1PXCIsIFwiTVRcIiwgXCJORVwiLCBcIk5WXCIsIFwiTkhcIiwgXCJOSlwiLCBcIk5NXCIsIFwiTllcIiwgXCJOQ1wiLCBcIk5EXCIsIFwiTVBcIiwgXCJPSFwiLCBcIk9LXCIsIFwiT1JcIiwgXCJQQVwiLCBcIlBSXCIsIFwiUklcIiwgXCJTQ1wiLCBcIlNEXCIsIFwiVE5cIiwgXCJUWFwiLCBcIlVUXCIsIFwiVlRcIiwgXCJWSVwiLCBcIlZBXCIsIFwiV0FcIiwgXCJXVlwiLCBcIldJXCIsIFwiV1lcIl0sXG5cdFx0bmFtZXMgPSBcIkFicmFoYW0sQWxiZXJ0LEFsZXhpcyxBbGxlbixBbGxpc29uLEFsZXhhbmRlcixBbW9zLEFudG9uLEFybm9sZCxBcnRodXIsQXNobGV5LEJhcnJ5LEJlbGluZGEsQmVsbGUsQmVuamFtaW4sQmVubnksQmVybmFyZCxCcmFkbGV5LEJyZXR0LFR5LEJyaXR0YW55LEJydWNlLEJyeWFudCxDYXJyZXksQ2FybWVuLENhcnJvbGwsQ2hhcmxlcyxDaHJpc3RvcGhlcixDaHJpc3RpZSxDbGFyayxDbGF5LENsaWZmLENvbnJhZCxDcmFpZyxDcnlzdGFsLEN1cnRpcyxEYW1vbixEYW5hLERhdmlkLERlYW4sRGVlLERlbm5pcyxEZW5ueSxEaWNrLERvdWdsYXMsRHVuY2FuLER3aWdodCxEeWxhbixFZGR5LEVsbGlvdCxFdmVyZXR0LEZheWUsRnJhbmNpcyxGcmFuayxGcmFua2xpbixHYXJ0aCxHYXlsZSxHZW9yZ2UsR2lsYmVydCxHbGVubixHb3Jkb24sR3JhY2UsR3JhaGFtLEdyYW50LEdyZWdvcnksR290dGZyaWVkLEd1eSxIYXJyaXNvbixIYXJyeSxIYXJ2ZXksSGVucnksSGVyYmVydCxIaWxsYXJ5LEhvbGx5LEhvcGUsSG93YXJkLEh1Z28sSHVtcGhyZXksSXJ2aW5nLElzYWFrLEphbmlzLEpheSxKb2VsLEpvaG4sSm9yZGFuLEpveWNlLEp1YW4sSnVkZCxKdWxpYSxLYXllLEtlbGx5LEtlaXRoLExhdXJpZSxMYXdyZW5jZSxMZWUsTGVpZ2gsTGVvbmFyZCxMZXNsaWUsTGVzdGVyLExld2lzLExpbGx5LExsb3lkLEdlb3JnZSxMb3VpcyxMb3Vpc2UsTHVjYXMsTHV0aGVyLEx5bm4sTWFjayxNYXJpZSxNYXJzaGFsbCxNYXJ0aW4sTWFydmluLE1heSxNaWNoYWVsLE1pY2hlbGxlLE1pbHRvbixNaXJhbmRhLE1pdGNoZWxsLE1vcmdhbixNb3JyaXMsTXVycmF5LE5ld3RvbixOb3JtYW4sT3dlbixQYXRyaWNrLFBhdHRpLFBhdWwsUGVubnksUGVycnksUHJlc3RvbixRdWlubixSYXksUmljaCxSaWNoYXJkLFJvbGFuZCxSb3NlLFJvc3MsUm95LFJ1YnksUnVzc2VsbCxSdXRoLFJ5YW4sU2NvdHQsU2V5bW91cixTaGFubm9uLFNoYXduLFNoZWxsZXksU2hlcm1hbixTaW1vbixTdGFubGV5LFN0ZXdhcnQsU3VzYW5uLFN5ZG5leSxUYXlsb3IsVGhvbWFzLFRvZGQsVG9tLFRyYWN5LFRyYXZpcyxUeWxlcixUeWxlcixWaW5jZW50LFdhbGxhY2UsV2FsdGVyLFBlbm4sV2F5bmUsV2lsbCxXaWxsYXJkLFdpbGxpc1wiLFxuXHRcdHdvcmRzID0gXCJ0aGUsb2YsYW5kLGEsdG8saW4saXMseW91LHRoYXQsaXQsaGUsZm9yLHdhcyxvbixhcmUsYXMsd2l0aCxoaXMsdGhleSxhdCxiZSx0aGlzLGZyb20sSSxoYXZlLG9yLGJ5LG9uZSxoYWQsbm90LGJ1dCx3aGF0LGFsbCx3ZXJlLHdoZW4sd2UsdGhlcmUsY2FuLGFuLHlvdXIsd2hpY2gsdGhlaXIsc2FpZCxpZixkbyx3aWxsLGVhY2gsYWJvdXQsaG93LHVwLG91dCx0aGVtLHRoZW4sc2hlLG1hbnksc29tZSxzbyx0aGVzZSx3b3VsZCxvdGhlcixpbnRvLGhhcyxtb3JlLGhlcix0d28sbGlrZSxoaW0sc2VlLHRpbWUsY291bGQsbm8sbWFrZSx0aGFuLGZpcnN0LGJlZW4saXRzLHdobyxub3cscGVvcGxlLG15LG1hZGUsb3ZlcixkaWQsZG93bixvbmx5LHdheSxmaW5kLHVzZSxtYXksd2F0ZXIsbG9uZyxsaXR0bGUsdmVyeSxhZnRlcix3b3JkcyxjYWxsZWQsanVzdCx3aGVyZSxtb3N0LGtub3csZ2V0LHRocm91Z2gsYmFjayxtdWNoLGJlZm9yZSxnbyxnb29kLG5ldyx3cml0ZSxvdXQsdXNlZCxtZSxtYW4sdG9vLGFueSxkYXksc2FtZSxyaWdodCxsb29rLHRoaW5rLGFsc28sYXJvdW5kLGFub3RoZXIsY2FtZSxjb21lLHdvcmssdGhyZWUsd29yZCxtdXN0LGJlY2F1c2UsZG9lcyxwYXJ0LGV2ZW4scGxhY2Usd2VsbCxzdWNoLGhlcmUsdGFrZSx3aHksdGhpbmdzLGhlbHAscHV0LHllYXJzLGRpZmZlcmVudCxhd2F5LGFnYWluLG9mZix3ZW50LG9sZCxudW1iZXIsZ3JlYXQsdGVsbCxtZW4sc2F5LHNtYWxsLGV2ZXJ5LGZvdW5kLHN0aWxsLGJldHdlZW4sbmFtZSxzaG91bGQsaG9tZSxiaWcsZ2l2ZSxhaXIsbGluZSxzZXQsb3duLHVuZGVyLHJlYWQsbGFzdCxuZXZlcix1cyxsZWZ0LGVuZCxhbG9uZyx3aGlsZSxtaWdodCxuZXh0LHNvdW5kLGJlbG93LHNhdyxzb21ldGhpbmcsdGhvdWdodCxib3RoLGZldyx0aG9zZSxhbHdheXMsbG9va2VkLHNob3csbGFyZ2Usb2Z0ZW4sdG9nZXRoZXIsYXNrZWQsaG91c2UsZG9uJ3Qsd29ybGQsZ29pbmcsd2FudCxzY2hvb2wsaW1wb3J0YW50LHVudGlsLGZvcm0sZm9vZCxrZWVwLGNoaWxkcmVuLGZlZXQsbGFuZCxzaWRlLHdpdGhvdXQsYm95LG9uY2UsYW5pbWFscyxsaWZlLGVub3VnaCx0b29rLHNvbWV0aW1lcyxmb3VyLGhlYWQsYWJvdmUsa2luZCxiZWdhbixhbG1vc3QsbGl2ZSxwYWdlLGdvdCxlYXJ0aCxuZWVkLGZhcixoYW5kLGhpZ2gseWVhcixtb3RoZXIsbGlnaHQscGFydHMsY291bnRyeSxmYXRoZXIsbGV0LG5pZ2h0LGZvbGxvd2luZyxwaWN0dXJlLGJlaW5nLHN0dWR5LHNlY29uZCxleWVzLHNvb24sdGltZXMsc3RvcnksYm95cyxzaW5jZSx3aGl0ZSxkYXlzLGV2ZXIscGFwZXIsaGFyZCxuZWFyLHNlbnRlbmNlLGJldHRlcixiZXN0LGFjcm9zcyxkdXJpbmcsdG9kYXksb3RoZXJzLGhvd2V2ZXIsc3VyZSxtZWFucyxrbmV3LGl0cyx0cnksdG9sZCx5b3VuZyxtaWxlcyxzdW4sd2F5cyx0aGluZyx3aG9sZSxoZWFyLGV4YW1wbGUsaGVhcmQsc2V2ZXJhbCxjaGFuZ2UsYW5zd2VyLHJvb20sc2VhLGFnYWluc3QsdG9wLHR1cm5lZCxsZWFybixwb2ludCxjaXR5LHBsYXksdG93YXJkLGZpdmUsdXNpbmcsaGltc2VsZix1c3VhbGx5XCIsXG5cdFx0bGV0dGVycyA9IChcImV0YW9uaXNyaGxkY211ZnBnd3lidmtqeHF6XCIpLnNwbGl0KFwiXCIpLFxuXHRcdHNpdGVzID0gXCJHb29nbGUsRmFjZWJvb2ssWW91VHViZSxZYWhvbyxMaXZlLEJpbmcsV2lraXBlZGlhLEJsb2dnZXIsTVNOLFR3aXR0ZXIsV29yZHByZXNzLE15U3BhY2UsTWljcm9zb2Z0LEFtYXpvbixlQmF5LExpbmtlZEluLGZsaWNrcixDcmFpZ3NsaXN0LFJhcGlkc2hhcmUsQ29uZHVpdCxJTURCLEJCQyxHbyxBT0wsRG91YmxlY2xpY2ssQXBwbGUsQmxvZ3Nwb3QsT3JrdXQsUGhvdG9idWNrZXQsQXNrLENOTixBZG9iZSxBYm91dCxtZWRpYWZpcmUsQ05FVCxFU1BOLEltYWdlU2hhY2ssTGl2ZUpvdXJuYWwsTWVnYXVwbG9hZCxNZWdhdmlkZW8sSG90ZmlsZSxQYXlQYWwsTllUaW1lcyxHbG9ibyxBbGliYWJhLEdvRGFkZHksRGV2aWFudEFydCxSZWRpZmYsRGFpbHlNb3Rpb24sRGlnZyxXZWF0aGVyLG5pbmcsUGFydHlQb2tlcixlSG93LERvd25sb2FkLEFuc3dlcnMsVHdpdFBpYyxOZXRmbGl4LFRpbnlwaWMsU291cmNlZm9yZ2UsSHVsdSxDb21jYXN0LEFyY2hpdmUsRGVsbCxTdHVtYmxldXBvbixIUCxGb3hOZXdzLE1ldGFjYWZlLFZpbWVvLFNreXBlLENoYXNlLFJldXRlcnMsV1NKLFllbHAsUmVkZGl0LEdlb2NpdGllcyxVU1BTLFVQUyxVcGxvYWQsVGVjaENydW5jaCxQb2dvLFBhbmRvcmEsTEFUaW1lcyxVU0FUb2RheSxJQk0sQWx0YVZpc3RhLE1hdGNoLE1vbnN0ZXIsSm90U3BvdCxCZXR0ZXJWaWRlbyxDbHViQUpBWCxOZXhwbG9yZSxLYXlhayxTbGFzaGRvdFwiO1xuXHRcblx0cmFuZCA9IHtcblx0XHRyZWFsOmZhbHNlLFxuXHRcdHdvcmRzOndvcmRzLnNwbGl0KFwiLFwiKSxcblx0XHR3dXJkczpbXSxcblx0XHRuYW1lczpuYW1lcy5zcGxpdChcIixcIiksXG5cdFx0bGV0dGVyczpsZXR0ZXJzLFxuXHRcdHNpdGVzOnNpdGVzLnNwbGl0KFwiLFwiKSxcblxuXHRcdHRvQXJyYXk6IGZ1bmN0aW9uKHRoaW5nKXtcblx0XHRcdHZhclxuXHRcdFx0XHRubSwgaSxcblx0XHRcdFx0YSA9IFtdO1xuXG5cdFx0XHRpZih0eXBlb2YodGhpbmcpID09PSBcIm9iamVjdFwiICYmICEoISF0aGluZy5wdXNoIHx8ICEhdGhpbmcuaXRlbSkpe1xuXHRcdFx0XHRmb3Iobm0gaW4gdGhpbmcpeyBpZih0aGluZy5oYXNPd25Qcm9wZXJ0eShubSkpe2EucHVzaCh0aGluZ1tubV0pO30gfVxuXHRcdFx0XHR0aGluZyA9IGE7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKHR5cGVvZih0aGluZykgPT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHRpZigvXFwuLy50ZXN0KHRoaW5nKSl7XG5cdFx0XHRcdFx0dGhpbmcgPSB0aGluZy5zcGxpdChcIi5cIik7XG5cdFx0XHRcdFx0dGhpbmcucG9wKCk7XG5cdFx0XHRcdFx0aSA9IHRoaW5nLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZShpLS0pe1xuXHRcdFx0XHRcdFx0dGhpbmdbaV0gPSB0aGlzLnRyaW0odGhpbmdbaV0pICsgXCIuXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZSBpZigvLC8udGVzdCh0aGluZykpe1xuXHRcdFx0XHRcdFx0dGhpbmcgPSB0aGluZy5zcGxpdChcIixcIik7XG5cdFx0XHRcdH1lbHNlIGlmKC9cXHMvLnRlc3QodGhpbmcpKXtcblx0XHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHRoaW5nID0gdGhpbmcuc3BsaXQoXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGluZzsgLy9BcnJheVxuXHRcdH0sXG5cblx0XHR0cmltOiBmdW5jdGlvbihzKXsgLy8gdGhhbmtzIHRvIERvam86XG5cdFx0XHRyZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50cmltID8gcy50cmltKCkgOlxuXHRcdFx0cy5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKS5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcblx0XHR9LFxuXG5cdFx0cGFkOiBmdW5jdGlvbihuLCBhbXQsIGNocil7XG5cdFx0XHRcdHZhciBjID0gY2hyIHx8IFwiMFwiOyBhbXQgPSBhbXQgfHwgMjtcblx0XHRcdFx0cmV0dXJuIChjK2MrYytjK2MrYytjK2MrYytjK24pLnNsaWNlKC1hbXQpO1xuXHRcdH0sXG5cblx0XHRjYXA6IGZ1bmN0aW9uKHcpe1xuXHRcdFx0cmV0dXJuIHcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3LnN1YnN0cmluZygxKTtcblx0XHR9LFxuXG5cdFx0d2VpZ2h0OiBmdW5jdGlvbihuLCBleHApe1xuXHRcdFx0dmFyXG5cdFx0XHRcdHJlcyxcblx0XHRcdFx0cmV2ID0gZXhwIDwgMDtcblx0XHRcdGV4cCA9IGV4cD09PXVuZGVmaW5lZCA/IDEgOiBNYXRoLmFicyhleHApKzE7XG5cdFx0XHRyZXMgPSBNYXRoLnBvdyhuLCBleHApO1xuXHRcdFx0cmV0dXJuIHJldiA/IDEgLSByZXMgOiByZXM7XG5cdFx0fSxcblxuXHRcdG46IGZ1bmN0aW9uKG4sIHcpe1xuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoKG4gfHwgMTApICogdGhpcy53ZWlnaHQoTWF0aC5yYW5kb20oKSwgdykpO1xuXHRcdH0sXG5cblx0XHRyYW5nZTogZnVuY3Rpb24obWluLCBtYXgsIHcpe1xuXHRcdFx0bWF4ID0gbWF4IHx8IDA7XG5cdFx0XHRyZXR1cm4gdGhpcy5uKE1hdGguYWJzKG1heC1taW4pKzEsIHcpICsgKG1pbjxtYXg/bWluOm1heCk7XG5cdFx0fSxcblxuXHRcdGVsZW1lbnQ6IGZ1bmN0aW9uKHRoaW5nLCB3KXtcblx0XHRcdC8vIHJldHVybiByYW5kIHNsb3QsIGNoYXIsIHByb3Agb3IgcmFuZ2Vcblx0XHRcdGlmKHR5cGVvZih0aGluZykgPT09IFwibnVtYmVyXCIpeyByZXR1cm4gdGhpcy5uKHRoaW5nLCB3KTsgfVxuXHRcdFx0dGhpbmcgPSB0aGlzLnRvQXJyYXkodGhpbmcpO1xuXHRcdFx0cmV0dXJuIHRoaW5nW3RoaXMubih0aGluZy5sZW5ndGgsIHcpXTtcblx0XHR9LFxuXG5cdFx0c2NyYW1ibGU6IGZ1bmN0aW9uKGFyeSl7XG5cdFx0XHR2YXJcblx0XHRcdFx0YSA9IGFyeS5jb25jYXQoW10pLFxuXHRcdFx0XHRzZCA9IFtdLFxuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlKGktLSl7XG5cdFx0XHRcdFx0c2QucHVzaChhLnNwbGljZSh0aGlzLm4oYS5sZW5ndGgpLCAxKVswXSk7XG5cdFx0XHRcdH1cblx0XHRcdHJldHVybiBzZDtcblx0XHR9LFxuXG5cdFx0YmlnbnVtYmVyOiBmdW5jdGlvbihsZW4pe1xuXHRcdFx0dmFyIHQ9XCJcIjtcblx0XHRcdHdoaWxlKGxlbi0tKXtcblx0XHRcdFx0XHR0ICs9IHRoaXMubig5KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0O1xuXHRcdH0sXG5cblx0XHRkYXRlOiBmdW5jdGlvbihvKXtcblx0XHRcdG8gPSBvIHx8IHt9O1xuXHRcdFx0dmFyXG5cdFx0XHRcdGQsXG5cdFx0XHRcdGQxID0gbmV3IERhdGUoby5taW4gfHwgbmV3IERhdGUoKSksXG5cdFx0XHRcdGQyID0gbmV3IERhdGUoby5tYXggfHwgbmV3IERhdGUoKS5zZXRGdWxsWWVhcihkMS5nZXRGdWxsWWVhcigpKyhvLnllYXJSYW5nZXx8MSkpKS5nZXRUaW1lKCk7XG5cdFx0XHRkMSA9IGQxLmdldFRpbWUoKTtcblx0XHRcdGQgPSBuZXcgRGF0ZSh0aGlzLnJhbmdlKGQxLGQyLG8ud2VpZ2h0KSk7XG5cdFx0XHRpZihvLnNlY29uZHMpe1xuXHRcdFx0XHRyZXR1cm4gZC5nZXRUaW1lKCk7XG5cdFx0XHR9ZWxzZSBpZihvLmRlbGltaXRlcil7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhZChkLmdldE1vbnRoKCkrMSkrby5kZWxpbWl0ZXIrdGhpcy5wYWQoZC5nZXREYXRlKCkrMSkrby5kZWxpbWl0ZXIrKGQuZ2V0RnVsbFllYXIoKSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZDtcblx0XHR9LFxuXG5cdFx0Ym9vbDogZnVuY3Rpb24odyl7XG5cdFx0XHRyZXR1cm4gdGhpcy5uKDIsIHcpIDwgMTtcblx0XHR9LFxuXG5cdFx0Y29sb3I6IGZ1bmN0aW9uKHcpe1xuXHRcdFx0cmV0dXJuIFwiI1wiK3RoaXMucGFkKHRoaXMubigyNTUsIHcpLnRvU3RyaW5nKDE2KSkrdGhpcy5wYWQodGhpcy5uKDI1NSwgdykudG9TdHJpbmcoMTYpKSt0aGlzLnBhZCh0aGlzLm4oMjU1LCB3KS50b1N0cmluZygxNikpO1xuXHRcdH0sXG5cblx0XHRjaGFyczpmdW5jdGlvbihtaW4sIG1heCwgdyl7XG5cdFx0XHR2YXIgcyA9IFwiXCIsXG5cdFx0XHRpID0gdGhpcy5yYW5nZShtaW4sIG1heCwgdyk7XG5cdFx0XHR3aGlsZShpLS0pe1xuXHRcdFx0XHRzICs9IHRoaXMubGV0dGVyc1t0aGlzLm4odGhpcy5sZXR0ZXJzLmxlbmd0aCldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHM7XG5cdFx0fSxcblxuXHRcdG5hbWU6IGZ1bmN0aW9uKGNzZSl7XG5cdFx0XHQvLyBjc2U6IDAgdGl0bGUgY2FzZSwgMSBsb3dlcmNhc2UsIDIgdXBwZXIgY2FzZVxuXHRcdFx0dmFyIHMgPSB0aGlzLm5hbWVzW3RoaXMubih0aGlzLm5hbWVzLmxlbmd0aCldO1xuXHRcdFx0cmV0dXJuICFjc2UgPyBzIDogY3NlID09PSAxID8gcy50b0xvd2VyQ2FzZSgpIDogcy50b1VwcGVyQ2FzZSgpO1xuXHRcdH0sXG5cblx0XHRjaXR5U3RhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gY2l0eVN0YXRlc1t0aGlzLm4oY2l0eVN0YXRlcy5sZW5ndGgpXTtcblx0XHR9LFxuXG5cdFx0c3RhdGU6IGZ1bmN0aW9uKGNzZSl7XG5cdFx0XHQvLyBjc2U6IDAgdGl0bGUgY2FzZSwgMSBsb3dlcmNhc2UsIDIgdXBwZXIgY2FzZVxuXHRcdFx0dmFyIHMgPSBzdGF0ZXNbdGhpcy5uKHN0YXRlcy5sZW5ndGgpXTtcblx0XHRcdHJldHVybiAhY3NlID8gcyA6IGNzZSA9PT0gMSA/IHMudG9Mb3dlckNhc2UoKSA6IHMudG9VcHBlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0c3RhdGVDb2RlOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Y3NlID0gY3NlID09PSB1bmRlZmluZWQgPyAyIDogY3NlO1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gc3RhdGVBYmJyW3RoaXMubihzdGF0ZUFiYnIubGVuZ3RoKV07XG5cdFx0XHRyZXR1cm4gIWNzZSA/IHMgOiBjc2UgPT09IDEgPyBzLnRvTG93ZXJDYXNlKCkgOiBzLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdHN0cmVldDogZnVuY3Rpb24obm9TdWZmaXgpe1xuXHRcdFx0dmFyIHMgPSBzdHJlZXRzW3RoaXMubihzdHJlZXRzLmxlbmd0aCldO1xuXHRcdFx0aWYoIW5vU3VmZml4KXtcblx0XHRcdFx0cys9ICcgJyArIHN0cmVldFN1ZmZpeGVzW3RoaXMubihzdHJlZXRTdWZmaXhlcy5sZW5ndGgpXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzO1xuXHRcdH0sXG5cblx0XHRzaXRlOiBmdW5jdGlvbihjc2Upe1xuXHRcdFx0Ly8gY3NlOiAwIHRpdGxlIGNhc2UsIDEgbG93ZXJjYXNlLCAyIHVwcGVyIGNhc2Vcblx0XHRcdHZhciBzID0gdGhpcy5zaXRlc1t0aGlzLm4odGhpcy5zaXRlcy5sZW5ndGgpXTtcblx0XHRcdHJldHVybiAhY3NlID8gcyA6IGNzZSA9PT0gMSA/IHMudG9Mb3dlckNhc2UoKSA6IHMudG9VcHBlckNhc2UoKTtcblx0XHR9LFxuXG5cdFx0dXJsOiBmdW5jdGlvbih1c2V3d3csIHh0KXtcblx0XHRcdHZhciB3ID0gdXNld3d3ID8gXCJ3d3cuXCIgOiBcIlwiO1xuXHRcdFx0eHQgPSB4dCB8fCBcIi5jb21cIjtcblx0XHRcdHJldHVybiBcImh0dHA6Ly9cIiArIHcgKyB0aGlzLnNpdGUoMSkgKyB4dDtcblx0XHR9LFxuXG5cdFx0d29yZDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciB3ID0gdGhpcy5yZWFsID8gdGhpcy53b3JkcyA6IHRoaXMud3VyZHM7XG5cdFx0XHRyZXR1cm4gd1t0aGlzLm4ody5sZW5ndGgpXTtcblx0XHR9LFxuXG5cdFx0c2VudGVuY2VzOiBmdW5jdGlvbihtaW5BbXQsIG1heEFtdCwgbWluTGVuLCBtYXhMZW4pe1xuXHRcdFx0Ly8gYW10OiBzZW50ZW5jZXMsIGxlbjogd29yZHNcblx0XHRcdG1pbkFtdCA9IG1pbkFtdCB8fCAxO1xuXHRcdFx0bWF4QW10ID0gbWF4QW10IHx8IG1pbkFtdDtcblx0XHRcdG1pbkxlbiA9IG1pbkxlbiB8fCA1O1xuXHRcdFx0bWF4TGVuID0gbWF4TGVuIHx8IG1pbkxlbjtcblxuXHRcdFx0dmFyXG5cdFx0XHRcdGlpLFxuXHRcdFx0XHRzID0gW10sXG5cdFx0XHRcdHQgPSBcIlwiLFxuXHRcdFx0XHR3ID0gdGhpcy5yZWFsID8gdGhpcy53b3JkcyA6IHRoaXMud3VyZHMsXG5cdFx0XHRcdGkgPSB0aGlzLnJhbmdlKG1pbkFtdCwgbWF4QW10KTtcblxuXHRcdFx0d2hpbGUoaS0tKXtcblxuXHRcdFx0XHRpaSA9IHRoaXMucmFuZ2UobWluTGVuLCBtYXhMZW4pOyB3aGlsZShpaS0tKXtcblx0XHRcdFx0XHRzLnB1c2god1t0aGlzLm4ody5sZW5ndGgpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dCArPSB0aGlzLmNhcChzLmpvaW4oXCIgXCIpKSArXCIuIFwiO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHQ7XG5cdFx0fSxcblxuXHRcdHRpdGxlOiBmdW5jdGlvbihtaW4sIG1heCl7XG5cdFx0XHRtaW4gPSBtaW4gfHwgMTsgbWF4ID0gbWF4IHx8IG1pbjtcblx0XHRcdHZhclxuXHRcdFx0XHRhID0gW10sXG5cdFx0XHRcdHcgPSB0aGlzLnJlYWwgPyB0aGlzLndvcmRzIDogdGhpcy53dXJkcyxcblx0XHRcdFx0aSA9IHRoaXMucmFuZ2UobWluLCBtYXgpO1xuXHRcdFx0d2hpbGUoaS0tKXtcblx0XHRcdFx0YS5wdXNoKHRoaXMuY2FwKHdbdGhpcy5uKHcubGVuZ3RoKV0pKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhLmpvaW4oXCIgXCIpO1xuXHRcdH0sXG5cdFx0ZGF0YTogZnVuY3Rpb24oYW10KXtcblx0XHRcdHZhclxuXHRcdFx0XHRzdCxcblx0XHRcdFx0aXRlbXMgPSBbXSxcblx0XHRcdFx0aXRlbSxcblx0XHRcdFx0aTtcblx0XHRcdGZvcihpID0gMDsgaSA8IGFtdDsgaSsrKXtcblx0XHRcdFx0aXRlbSA9IHtcblx0XHRcdFx0XHRmaXJzdE5hbWU6IHRoaXMubmFtZSgpLFxuXHRcdFx0XHRcdGxhc3ROYW1lOiB0aGlzLm5hbWUoKSxcblx0XHRcdFx0XHRjb21wYW55OiB0aGlzLnNpdGUoKSxcblx0XHRcdFx0XHRhZGRyZXNzMTogdGhpcy5iaWdudW1iZXIodGhpcy5yYW5nZSgzLCA1KSksXG5cdFx0XHRcdFx0YWRkcmVzczI6IHRoaXMuc3RyZWV0KCksXG5cdFx0XHRcdFx0YmlydGhkYXk6IHRoaXMuZGF0ZSh7ZGVsaW1pdGVyOicvJ30pXG5cdFx0XHRcdH07XG5cdFx0XHRcdGl0ZW0uZW1haWwgPSAoaXRlbS5maXJzdE5hbWUuc3Vic3RyaW5nKDAsMSkgKyBpdGVtLmxhc3ROYW1lICsgJ0AnICsgaXRlbS5jb21wYW55ICsgJy5jb20nKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRzdCA9IHRoaXMuY2l0eVN0YXRlKCk7XG5cdFx0XHRcdGl0ZW0uY2l0eSA9IHN0LnNwbGl0KCcsICcpWzBdO1xuXHRcdFx0XHRpdGVtLnN0YXRlID0gc3Quc3BsaXQoJywgJylbMV07XG5cdFx0XHRcdGl0ZW0uemlwY29kZSA9IHRoaXMuYmlnbnVtYmVyKDUpO1xuXHRcdFx0XHRpdGVtLnBob25lID0gdGhpcy5mb3JtYXQodGhpcy5iaWdudW1iZXIoMTApLCAncGhvbmUnKTtcblx0XHRcdFx0aXRlbS5zc24gPSB0aGlzLmZvcm1hdCh0aGlzLmJpZ251bWJlcig5KSwgJ3NzbicpO1xuXHRcdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGl0ZW1zO1xuXHRcdH0sXG5cblx0XHRmb3JtYXQ6IGZ1bmN0aW9uIChuLCB0eXBlKSB7XG5cdFx0XHR2YXIgZCA9ICctJztcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICdwaG9uZSc6XG5cdFx0XHRcdFx0biA9ICcnICsgbjtcblx0XHRcdFx0XHRyZXR1cm4gbi5zdWJzdHJpbmcoMCwzKSArIGQgKyBuLnN1YnN0cmluZygzLDYpICsgZCArIG4uc3Vic3RyaW5nKDYpO1xuXHRcdFx0XHRjYXNlICdzc24nOlxuXHRcdFx0XHRcdG4gPSAnJyArIG47XG5cdFx0XHRcdFx0cmV0dXJuIG4uc3Vic3RyaW5nKDAsMykgKyBkICsgbi5zdWJzdHJpbmcoMyw1KSArIGQgKyBuLnN1YnN0cmluZyg1KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJhbmQud3VyZHMgPSB3b3Jkcy5yZXBsYWNlKC9hfGV8aXxvfHUvZywgZnVuY3Rpb24oYyl7IHJldHVybiAoXCJhZWlvdVwiKVtyYW5kLm4oNSldOyB9KS5zcGxpdChcIixcIik7XG5cblx0cmV0dXJuIHJhbmQ7XG59KSk7XG4iXX0=
