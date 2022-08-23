!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("base-component",[],e):"object"==typeof exports?exports["base-component"]=e():t["base-component"]=e()}("undefined"!=typeof self?self:this,(()=>{return t={175:function(t,e){var n,i,o,r;r=function(){"use strict";function t(e,n,i,r){"string"==typeof e&&(e=f(e));var l=function(e,n,i){return n&&i?("string"==typeof n&&(o=e,r=n,n=function(e){return t.closest(e.target,r,o)}),function(t){var e=n(t);e&&(t.filteredTarget=e,i(t,e))}):n||i;var o,r}(e,i,r);if("function"==typeof n)return n(e,l);var h,p,m=/^(keyup|keydown):(.+)$/.exec(n);return m?(h=m[1],p=new RegExp(m[2].split(",").join("|")),function(e,n){return t(e,h,(function(t){p.test(t.key)&&n(t)}))})(e,l):/,/.test(n)?t.makeMultiHandle(n.split(",").map((function(t){return t.trim()})).filter((function(t){return t})).map((function(n){return t(e,n,l)}))):Object.prototype.hasOwnProperty.call(t.events,n)?t.events[n](e,l):"load"===n&&"img"===e.tagName.toLowerCase()?function(e,n){var i=t.makeMultiHandle([t.onDomEvent(e,"load",(function(t){var o=setInterval((function(){(e.naturalWidth||e.naturalHeight)&&(clearInterval(o),t.width=t.naturalWidth=e.naturalWidth,t.height=t.naturalHeight=e.naturalHeight,n(t))}),100);i.remove()})),t(e,"error",n)]);return i}(e,l):"wheel"!==n||(l=function(t){return function(e){d+=a;var n=Math.max(-1,Math.min(1,e.wheelDeltaY||e.deltaY)),i=Math.max(-10,Math.min(10,e.wheelDeltaX||e.deltaX));n=n<=0?n-d:n+d,e.delta=n,e.wheelY=n,e.wheelX=i,clearTimeout(u),u=setTimeout((function(){d=0}),300),t(e)}}(l),o)?(/^key/.test(n)&&(l=function(t){return function(e){if(c[e.key]){var n=s({},e);n.key=c[e.key],t(n)}else t(e)}}(l)),t.onDomEvent(e,n,l)):t.makeMultiHandle([t(e,"DOMMouseScroll",l),t(e,"mousewheel",l)])}t.events={button:function(e,n){return t.makeMultiHandle([t(e,"click",n),t(e,"keyup:Enter",n)])},clickoff:function(e,n){var i=e.ownerDocument.documentElement,o=l([t(i,"click",(function(t){var i=t.target;1!==i.nodeType&&(i=i.parentNode),i&&!e.contains(i)&&n(t)})),t(i,"keyup",(function(t){"Escape"===t.key&&n(t)}))]),r={state:"resumed",resume:function(){setTimeout((function(){o.resume()}),100),this.state="resumed"},pause:function(){o.pause(),this.state="paused"},remove:function(){o.remove(),this.state="removed"}};return r.pause(),r}};var e,n,i,o=(e=navigator.userAgent.indexOf("Trident")>-1,"onwheel"in(n=document.createElement("div"))||"wheel"in n||e&&document.implementation.hasFeature("Events.wheel","3.0"));["matches","matchesSelector","webkit","moz","ms","o"].some((function(t){return t.length<7&&(t+="MatchesSelector"),!!Element.prototype[t]&&(i=t,!0)}));var r={isTrusted:1};function s(t,e){if(!e)return t;if("object"==typeof e)for(var n in e)r[n]||(t[n]=e[n]);else t.value=e;return t}var u,c={Up:"ArrowUp",Down:"ArrowDown",Left:"ArrowLeft",Right:"ArrowRight",Esc:"Escape",Spacebar:" ",Win:"Command"},a=navigator.userAgent.indexOf("Windows")>-1?10:.1,d=0;function l(t){return{state:"resumed",remove:function(){t.forEach((function(t){t.remove?t.remove():"function"==typeof t&&t()})),t=[],this.remove=this.pause=this.resume=function(){},this.state="removed"},pause:function(){t.forEach((function(t){t.pause&&t.pause()})),this.state="paused"},resume:function(){t.forEach((function(t){t.resume&&t.resume()})),this.state="resumed"}}}function f(t){var e=document.getElementById(t);return e||console.error("`on` Could not find:",t),e}function h(t){return t===document||t===window?document:t.ownerDocument}return t.once=function(e,n,i,o){var r;return r=i&&o?t(e,n,i,(function(){o.apply(window,arguments),r.remove()})):t(e,n,(function(){i.apply(window,arguments),r.remove()})),r},t.emit=function(t,e,n){var i=h(t="string"==typeof t?f(t):t).createEvent("HTMLEvents");return i.initEvent(e,!0,!0),t.dispatchEvent(s(i,n))},t.fire=function(t,e,n,i){var o=h(t="string"==typeof t?f(t):t).createEvent("CustomEvent");return o.initCustomEvent(e,!!i,!0,n),t.dispatchEvent(o)},t.isAlphaNumeric=function(t){return/^[0-9a-z]$/i.test(t)},t.makeMultiHandle=l,t.onDomEvent=function(t,e,n){return t.addEventListener(e,n,!1),{remove:function(){t.removeEventListener(e,n,!1),t=n=null,this.remove=this.pause=this.resume=function(){}},pause:function(){t.removeEventListener(e,n,!1)},resume:function(){t.addEventListener(e,n,!1)}}},t.closest=function(e,n,i){for(;e;){if(e[t.matches]&&e[t.matches](n))return e;if(e===i)break;e=e.parentElement}return null},t.matches=i,t},"function"==typeof customLoader?customLoader(r,"on"):(i=[],void 0===(o="function"==typeof(n=r)?n.apply(e,i):n)||(t.exports=o))},323:(t,e,n)=>{const i=n(175);class o extends HTMLElement{constructor(){super(),this._uid=function(t="uid"){void 0===d[t]&&(d[t]=0);const e=t+"-"+(d[t]+1);return d[t]++,e}(this.localName),r[this._uid]={DOMSTATE:"created"},r[this._uid].handleList=[],u("init",this)}connectedCallback(){var t;r[this._uid].DOMSTATE=r[this._uid].domReadyFired?"domready":"connected",u("preConnected",this),t=c.bind(this),requestAnimationFrame(t),this.connected&&this.connected(),this.fire("connected"),u("postConnected",this)}onConnected(t){"connected"!==this.DOMSTATE&&"domready"!==this.DOMSTATE?this.once("connected",(()=>{t(this)})):t(this)}onDomReady(t){"domready"!==this.DOMSTATE?this.once("domready",(()=>{t(this)})):t(this)}disconnectedCallback(){let t;r[this._uid].DOMSTATE="disconnected",u("preDisconnected",this),this.disconnected&&this.disconnected(),this.fire("disconnected");const e=void 0!==this.destroyOnDisconnect?this.destroyOnDisconnect:o.destroyOnDisconnect;e&&(t="number"==typeof e?e:300,setTimeout((()=>{"disconnected"===this.DOMSTATE&&this.destroy()}),t))}attributeChangedCallback(t,e,n){this.isSettingAttribute!==t&&(u("preAttributeChanged",this,t,n=o.normalize(n),e),this.attributeChanged&&o.normalize(e)!==n&&this.attributeChanged(t,n,e))}destroy(){this.fire("destroy"),r[this._uid].handleList.forEach((function(t){t.remove()})),this&&(l.appendChild(this),l.innerHTML="")}fire(t,e,n){return i.fire(this,t,e,n)}emit(t,e){return i.emit(this,t,e)}on(t,e,n,o){return this.registerHandle("string"!=typeof t?i(t,e,n,o):i(this,t,e,n))}once(t,e,n,o){return this.registerHandle("string"!=typeof t?i.once(t,e,n,o):i.once(this,t,e,n,o))}attr(t,e,n){this.isSettingAttribute=t,void 0===n||n?this.setAttribute(t,e):this.removeAttribute(t),this.isSettingAttribute=!1}registerHandle(t){return r[this._uid].handleList.push(t),t}get DOMSTATE(){return r[this._uid].DOMSTATE}static set destroyOnDisconnect(t){r.destroyOnDisconnect=t}static get destroyOnDisconnect(){return r.destroyOnDisconnect}static clone(t){if(t.content&&t.content.children)return document.importNode(t.content,!0);const e=document.createDocumentFragment(),n=document.createElement("div");for(n.innerHTML=t.innerHTML;n.children.length;)e.appendChild(n.children[0]);return e}static addPlugin(t){let e,n=t.order||100;if(s.length)if(1===s.length)s[0].order<=n?s.push(t):s.unshift(t);else if(s[0].order>n)s.unshift(t);else{for(e=1;e<s.length;e++)if(n===s[e-1].order||n>s[e-1].order&&n<s[e].order)return void s.splice(e,0,t);s.push(t)}else s.push(t)}}let r={},s=[];function u(t,e,n,i,o){s.forEach((function(r){r[t]&&r[t](e,n,i,o)}))}function c(){if("connected"!==this.DOMSTATE||r[this._uid].domReadyFired)return;let t=0,e=function(t){let e,n=[];for(e=0;e<t.children.length;e++)t.children[e].nodeName.indexOf("-")>-1&&n.push(t.children[e]);return n}(this),n=a.bind(this);function i(){t++,t===e.length&&n()}e.length?e.forEach((function(t){"domready"===t.DOMSTATE&&i(),t.on("domready",i)})):n()}function a(){r[this._uid].DOMSTATE="domready",r[this._uid].domReadyFired=!0,u("preDomReady",this),this.domReady&&(this.domReady(),this.domReady=function(){}),this.fireOwnDomready||this.fire("domready"),u("postDomReady",this)}const d={},l=document.createElement("div");function f(t,e){window[t]=function(t,n){function i(t,n){t.DOMSTATE===e||"domready"===t.DOMSTATE?n(t):t.addEventListener(e,(function i(){n(t),t.removeEventListener(e,i)}))}if(!Array.isArray(t))return void i(t,n);let o=0;function r(){o++,o===t.length&&n(t)}for(let e=0;e<t.length;e++)i(t[e],r)}}f("onDomReady","domready"),f("onConnected","connected"),o.injectProps=function(t,{props:e=[],bools:n=[],attrs:i=[]}){t.bools=[...t.bools||[],...n],t.props=[...t.props||[],...e],t.attrs=[...t.attrs||[],...i],t.observedAttributes=[...t.bools,...t.props,...t.attrs]},o.define=function(t,e,n={}){return function(t){const e={prop:"props",bool:"bools",attr:"attrs",properties:"props",booleans:"bools",property:"props",boolean:"bools"};Object.keys(e).forEach((n=>{t[n]&&console.error(`BaseComponent.define found "${n}"; Did you mean: "${e[n]}"?`)}))}(n),o.injectProps(e,n),customElements.define(t,e),e},t.exports=o},579:(t,e,n)=>{t.exports=n(323),n(657),n(502),n(543)},502:(t,e,n)=>{const i=n(323);function o(t,e){let n;Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get(){const t=this.getAttribute(e);return null!=t&&"false"!==t&&!1!==t},set(t){this.isSettingAttribute=e,(t=!1!==t&&null!=t)?this.setAttribute(e,""):this.removeAttribute(e),this.attributeChanged&&this.attributeChanged(e,t);const i=this[r(e)];if(i){const e=this.propsOnReady?"onDomReady":"onConnected";window[e](this,(()=>{void 0!==t&&n!==t&&(t=i.call(this,t)||t),n=t}))}this.isSettingAttribute=!1}})}function r(t){return"on"+t.split("-").map((t=>function(t){return t.substring(0,1).toUpperCase()+t.substring(1)}(t))).join("")}function s(t){if("string"==typeof t){if("false"===(t=t.trim()))return!1;if("null"===t)return null;if("true"===t)return!0;if((""+t).replace(/-?\d*\.?\d*/,"").length)return t}return isNaN(parseFloat(t))?t:parseFloat(t)}i.normalize=s,i.addPlugin({name:"properties",order:10,init:function(t){(function(t){let e=t.constructor.props||t.props;e&&e.forEach((function(e){"disabled"===e?o(t,e):function(t,e){let n;Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get(){return void 0!==n?n:s(this.getAttribute(e))},set(t){this.isSettingAttribute=e,"object"==typeof t||"function"==typeof t?n=t:(this.setAttribute(e,t),this.attributeChanged&&this.attributeChanged(e,t));const i=this[r(e)];if(i){const e=this.propsOnReady?"onDomReady":"onConnected";window[e](this,(()=>{void 0!==t&&(n=t),t=i.call(this,t)||t}))}this.isSettingAttribute=!1}})}(t,e)}))})(t),function(t){let e=t.constructor.bools||t.bools;e&&e.forEach((function(e){o(t,e)}))}(t)},preAttributeChanged:function(t,e,n){if(t.isSettingAttribute)return!1;if(function(t,e){return(t.bools||t.booleans||[]).indexOf(e)>-1}(t,e))return n=function(t){return""===t||s(t)}(n),t[e]=!!n,void(n?t[e]=!0:(t[e]=!1,t.isSettingAttribute=e,t.removeAttribute(e),t.isSettingAttribute=!1));const i=s(n);t[e]=i}})},543:(t,e,n)=>{n(323).addPlugin({name:"refs",order:30,preConnected:function(t){!function(t){[...t.querySelectorAll("[ref]")].forEach((function(e){let n=e.getAttribute("ref");e.removeAttribute("ref"),t[n]=e}))}(t),function(t){[...t.querySelectorAll("[on]")].forEach((function(e,n,i){if(e===t)return;let o=e.getAttribute("on"),r=o.split(":")[0].trim(),s=o.split(":")[1].trim();e.removeAttribute("on"),t.on(e,r,(function(e){t[s](e)}))}))}(t)}})},657:(t,e,n)=>{const i=n(323),o={},r={};function s(t){const e=t.querySelectorAll('[ref="container"]');return e&&e.length?e[e.length-1]:t}function u(t){let e;const n=s(t),i=o[t._uid];if(n&&i&&i.length)for(e=0;e<i.length;e++)n.appendChild(i[e])}i.prototype.getLightNodes=function(){return o[this._uid]},i.prototype.getTemplateNode=function(){return this.templateId?this.templateNode=document.getElementById(this.templateId.replace("#","")):this.templateString&&(this.templateNode=function(t){const e=document.createElement("div");return e.innerHTML=t,e.firstChild}("<template>"+this.templateString+"</template>")),this.templateNode},i.prototype.getTemplateChain=function(){let t,e=this,n=[];for(;e&&(e=Object.getPrototypeOf(e),e);)(e.hasOwnProperty("templateString")||e.hasOwnProperty("templateId"))&&(t=e.getTemplateNode(),t&&n.push(t));return n},i.addPlugin({name:"template",order:20,preConnected:function(t){!function(t){!r[t._uid]&&function(t){return t.templateString||t.templateId}(t)&&(function(t){for(o[t._uid]=o[t._uid]||[];t.childNodes.length;)o[t._uid].push(t.removeChild(t.childNodes[0]))}(t),function(t){if(t.nestedTemplate)return void function(t){t.getTemplateChain().reverse().forEach((function(e){s(t).appendChild(i.clone(e))})),u(t)}(t);const e=t.getTemplateNode();e&&t.appendChild(i.clone(e)),u(t)}(t),r[t._uid]=!0)}(t)}})}},e={},function n(i){var o=e[i];if(void 0!==o)return o.exports;var r=e[i]={exports:{}};return t[i].call(r.exports,r,r.exports,n),r.exports}(579);var t,e}));
//# sourceMappingURL=index.js.map