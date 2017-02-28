(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
	'use strict';
	var g = new function () {
	};
	var aa = new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));

	function k(b) {
		var a = aa.has(b);
		b = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(b);
		return !a && b
	}

	function l(b) {
		var a = b.isConnected;
		if (void 0 !== a) {
			return a;
		}
		for (; b && !(b.__CE_isImportDocument || b instanceof Document);) {
			b = b.parentNode || (window.ShadowRoot && b instanceof ShadowRoot ? b.host : void 0);
		}
		return !(!b || !(b.__CE_isImportDocument || b instanceof Document))
	}

	function m(b, a) {
		for (; a && a !== b && !a.nextSibling;) {
			a = a.parentNode;
		}
		return a && a !== b ? a.nextSibling : null
	}

	function n(b, a, e) {
		e = e ? e : new Set;
		for (var c = b; c;) {
			if (c.nodeType === Node.ELEMENT_NODE) {
				var d = c;
				a(d);
				var h = d.localName;
				if ("link" === h && "import" === d.getAttribute("rel")) {
					c = d.import;
					if (c instanceof Node && !e.has(c)) {
						for (e.add(c), c = c.firstChild; c; c = c.nextSibling) {
							n(c, a, e);
						}
					}
					c = m(b, d);
					continue
				}
				else if ("template" === h) {
					c = m(b, d);
					continue
				}
				if (d = d.__CE_shadowRoot) {
					for (d = d.firstChild; d; d = d.nextSibling) {
						n(d, a, e)
					}
				}
			}
			c = c.firstChild ? c.firstChild : m(b, c)
		}
	}

	function q(b, a, e) {
		b[a] = e
	};
	function r() {
		this.a = new Map;
		this.f = new Map;
		this.c = [];
		this.b = !1
	}

	function ba(b, a, e) {
		b.a.set(a, e);
		b.f.set(e.constructor, e)
	}

	function t(b, a) {
		b.b = !0;
		b.c.push(a)
	}

	function v(b, a) {
		b.b && n(a, function (a) {
			return w(b, a)
		})
	}

	function w(b, a) {
		if (b.b && !a.__CE_patched) {
			a.__CE_patched = !0;
			for (var e = 0; e < b.c.length; e++) {
				b.c[e](a)
			}
		}
	}

	function x(b, a) {
		var e = [];
		n(a, function (b) {
			return e.push(b)
		});
		for (a = 0; a < e.length; a++) {
			var c = e[a];
			1 === c.__CE_state ? b.connectedCallback(c) : y(b, c)
		}
	}

	function z(b, a) {
		var e = [];
		n(a, function (b) {
			return e.push(b)
		});
		for (a = 0; a < e.length; a++) {
			var c = e[a];
			1 === c.__CE_state && b.disconnectedCallback(c)
		}
	}

	function A(b, a, e) {
		e = e ? e : new Set;
		var c = [];
		n(a, function (d) {
			if ("link" === d.localName && "import" === d.getAttribute("rel")) {
				var a = d.import;
				a instanceof Node && "complete" === a.readyState ? (a.__CE_isImportDocument = !0, a.__CE_hasRegistry = !0) : d.addEventListener("load", function () {
						var a = d.import;
						a.__CE_documentLoadHandled || (a.__CE_documentLoadHandled = !0, a.__CE_isImportDocument = !0, a.__CE_hasRegistry = !0, new Set(e), e.delete(a), A(b, a, e))
					})
			}
			else {
				c.push(d)
			}
		}, e);
		if (b.b) {
			for (a = 0; a < c.length; a++) {
				w(b, c[a]);
			}
		}
		for (a = 0; a < c.length; a++) {
			y(b,
				c[a])
		}
	}

	function y(b, a) {
		if (void 0 === a.__CE_state) {
			var e = b.a.get(a.localName);
			if (e) {
				e.constructionStack.push(a);
				var c = e.constructor;
				try {
					try {
						if (new c !== a) {
							throw Error("The custom element constructor did not produce the element being upgraded.");
						}
					} finally {
						e.constructionStack.pop()
					}
				} catch (f) {
					throw a.__CE_state = 2, f;
				}
				a.__CE_state = 1;
				a.__CE_definition = e;
				if (e.attributeChangedCallback) {
					for (e = e.observedAttributes, c = 0; c < e.length; c++) {
						var d = e[c], h = a.getAttribute(d);
						null !== h && b.attributeChangedCallback(a, d, null, h, null)
					}
				}
				l(a) && b.connectedCallback(a)
			}
		}
	}

	r.prototype.connectedCallback = function (b) {
		var a = b.__CE_definition;
		a.connectedCallback && a.connectedCallback.call(b)
	};
	r.prototype.disconnectedCallback = function (b) {
		var a = b.__CE_definition;
		a.disconnectedCallback && a.disconnectedCallback.call(b)
	};
	r.prototype.attributeChangedCallback = function (b, a, e, c, d) {
		var h = b.__CE_definition;
		h.attributeChangedCallback && -1 < h.observedAttributes.indexOf(a) && h.attributeChangedCallback.call(b, a, e, c, d)
	};
	function B(b, a) {
		this.c = b;
		this.a = a;
		this.b = void 0;
		A(this.c, this.a);
		"loading" === this.a.readyState && (this.b = new MutationObserver(this.f.bind(this)), this.b.observe(this.a, {
			childList: !0,
			subtree: !0
		}))
	}

	function C(b) {
		b.b && b.b.disconnect()
	}

	B.prototype.f = function (b) {
		var a = this.a.readyState;
		"interactive" !== a && "complete" !== a || C(this);
		for (a = 0; a < b.length; a++) {
			for (var e = b[a].addedNodes, c = 0; c < e.length; c++) {
				A(this.c, e[c])
			}
		}
	};
	function ca() {
		var b = this;
		this.b = this.a = void 0;
		this.c = new Promise(function (a) {
			b.b = a;
			b.a && a(b.a)
		})
	}

	function D(b) {
		if (b.a) {
			throw Error("Already resolved.");
		}
		b.a = void 0;
		b.b && b.b(void 0)
	};
	function E(b) {
		this.f = !1;
		this.a = b;
		this.h = new Map;
		this.g = function (b) {
			return b()
		};
		this.b = !1;
		this.c = [];
		this.j = new B(b, document)
	}

	E.prototype.l = function (b, a) {
		var e = this;
		if (!(a instanceof Function)) {
			throw new TypeError("Custom element constructors must be functions.");
		}
		if (!k(b)) {
			throw new SyntaxError("The element name '" + b + "' is not valid.");
		}
		if (this.a.a.get(b)) {
			throw Error("A custom element with name '" + b + "' has already been defined.");
		}
		if (this.f) {
			throw Error("A custom element is already being defined.");
		}
		this.f = !0;
		var c, d, h, f, u;
		try {
			var p = function (b) {
				var a = P[b];
				if (void 0 !== a && !(a instanceof Function)) {
					throw Error("The '" + b + "' callback must be a function.");
				}
				return a
			}, P = a.prototype;
			if (!(P instanceof Object)) {
				throw new TypeError("The custom element constructor's prototype is not an object.");
			}
			c = p("connectedCallback");
			d = p("disconnectedCallback");
			h = p("adoptedCallback");
			f = p("attributeChangedCallback");
			u = a.observedAttributes || []
		} catch (va) {
			return
		} finally {
			this.f = !1
		}
		ba(this.a, b, {
			localName: b,
			constructor: a,
			connectedCallback: c,
			disconnectedCallback: d,
			adoptedCallback: h,
			attributeChangedCallback: f,
			observedAttributes: u,
			constructionStack: []
		});
		this.c.push(b);
		this.b || (this.b = !0, this.g(function () {
			if (!1 !== e.b) {
				for (e.b = !1, A(e.a, document); 0 < e.c.length;) {
					var b = e.c.shift();
					(b = e.h.get(b)) && D(b)
				}
			}
		}))
	};
	E.prototype.get = function (b) {
		if (b = this.a.a.get(b)) {
			return b.constructor
		}
	};
	E.prototype.o = function (b) {
		if (!k(b)) {
			return Promise.reject(new SyntaxError("'" + b + "' is not a valid custom element name."));
		}
		var a = this.h.get(b);
		if (a) {
			return a.c;
		}
		a = new ca;
		this.h.set(b, a);
		this.a.a.get(b) && -1 === this.c.indexOf(b) && D(a);
		return a.c
	};
	E.prototype.m = function (b) {
		C(this.j);
		var a = this.g;
		this.g = function (e) {
			return b(function () {
				return a(e)
			})
		}
	};
	window.CustomElementRegistry = E;
	E.prototype.define = E.prototype.l;
	E.prototype.get = E.prototype.get;
	E.prototype.whenDefined = E.prototype.o;
	E.prototype.polyfillWrapFlushCallback = E.prototype.m;
	var F = window.Document.prototype.createElement, da = window.Document.prototype.createElementNS, ea = window.Document.prototype.importNode, fa = window.Document.prototype.prepend, ga = window.Document.prototype.append, G = window.Node.prototype.cloneNode, H = window.Node.prototype.appendChild, I = window.Node.prototype.insertBefore, J = window.Node.prototype.removeChild, K = window.Node.prototype.replaceChild, L = Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent"), M = window.Element.prototype.attachShadow, N = Object.getOwnPropertyDescriptor(window.Element.prototype,
		"innerHTML"), O = window.Element.prototype.getAttribute, Q = window.Element.prototype.setAttribute, R = window.Element.prototype.removeAttribute, S = window.Element.prototype.getAttributeNS, T = window.Element.prototype.setAttributeNS, U = window.Element.prototype.removeAttributeNS, V = window.Element.prototype.insertAdjacentElement, ha = window.Element.prototype.prepend, ia = window.Element.prototype.append, ja = window.Element.prototype.before, ka = window.Element.prototype.after, la = window.Element.prototype.replaceWith, ma = window.Element.prototype.remove,
		na = window.HTMLElement, W = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerHTML"), X = window.HTMLElement.prototype.insertAdjacentElement;

	function oa() {
		var b = Y;
		window.HTMLElement = function () {
			function a() {
				var a = this.constructor, c = b.f.get(a);
				if (!c) {
					throw Error("The custom element being constructed was not registered with `customElements`.");
				}
				var d = c.constructionStack;
				if (!d.length) {
					return d = F.call(document, c.localName), Object.setPrototypeOf(d, a.prototype), d.__CE_state = 1, d.__CE_definition = c, w(b, d), d;
				}
				var c = d.length - 1, h = d[c];
				if (h === g) {
					throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
				}
				d[c] = g;
				Object.setPrototypeOf(h, a.prototype);
				w(b, h);
				return h
			}

			a.prototype = na.prototype;
			return a
		}()
	};
	function pa(b, a, e) {
		a.prepend = function (a) {
			for (var d = [], c = 0; c < arguments.length; ++c) {
				d[c - 0] = arguments[c];
			}
			c = d.filter(function (b) {
				return b instanceof Node && l(b)
			});
			e.i.apply(this, d);
			for (var f = 0; f < c.length; f++) {
				z(b, c[f]);
			}
			if (l(this)) {
				for (c = 0; c < d.length; c++) {
					f = d[c], f instanceof Element && x(b, f)
				}
			}
		};
		a.append = function (a) {
			for (var d = [], c = 0; c < arguments.length; ++c) {
				d[c - 0] = arguments[c];
			}
			c = d.filter(function (b) {
				return b instanceof Node && l(b)
			});
			e.append.apply(this, d);
			for (var f = 0; f < c.length; f++) {
				z(b, c[f]);
			}
			if (l(this)) {
				for (c = 0; c <
				d.length; c++) {
					f = d[c], f instanceof Element && x(b, f)
				}
			}
		}
	};
	function qa() {
		var b = Y;
		q(Document.prototype, "createElement", function (a) {
			if (this.__CE_hasRegistry) {
				var e = b.a.get(a);
				if (e) {
					return new e.constructor
				}
			}
			a = F.call(this, a);
			w(b, a);
			return a
		});
		q(Document.prototype, "importNode", function (a, e) {
			a = ea.call(this, a, e);
			this.__CE_hasRegistry ? A(b, a) : v(b, a);
			return a
		});
		q(Document.prototype, "createElementNS", function (a, e) {
			if (this.__CE_hasRegistry && (null === a || "http://www.w3.org/1999/xhtml" === a)) {
				var c = b.a.get(e);
				if (c) {
					return new c.constructor
				}
			}
			a = da.call(this, a, e);
			w(b, a);
			return a
		});
		pa(b, Document.prototype, {i: fa, append: ga})
	};
	function ra() {
		var b = Y;

		function a(a, c) {
			Object.defineProperty(a, "textContent", {
				enumerable: c.enumerable,
				configurable: !0,
				get: c.get,
				set: function (a) {
					if (this.nodeType === Node.TEXT_NODE) {
						c.set.call(this, a);
					}
					else {
						var d = void 0;
						if (this.firstChild) {
							var e = this.childNodes, u = e.length;
							if (0 < u && l(this)) {
								for (var d = Array(u), p = 0; p < u; p++) {
									d[p] = e[p]
								}
							}
						}
						c.set.call(this, a);
						if (d) {
							for (a = 0; a < d.length; a++) {
								z(b, d[a])
							}
						}
					}
				}
			})
		}

		q(Node.prototype, "insertBefore", function (a, c) {
			if (a instanceof DocumentFragment) {
				var d = Array.prototype.slice.apply(a.childNodes);
				a = I.call(this, a, c);
				if (l(this)) {
					for (c = 0; c < d.length; c++) {
						x(b, d[c]);
					}
				}
				return a
			}
			d = l(a);
			c = I.call(this, a, c);
			d && z(b, a);
			l(this) && x(b, a);
			return c
		});
		q(Node.prototype, "appendChild", function (a) {
			if (a instanceof DocumentFragment) {
				var c = Array.prototype.slice.apply(a.childNodes);
				a = H.call(this, a);
				if (l(this)) {
					for (var d = 0; d < c.length; d++) {
						x(b, c[d]);
					}
				}
				return a
			}
			c = l(a);
			d = H.call(this, a);
			c && z(b, a);
			l(this) && x(b, a);
			return d
		});
		q(Node.prototype, "cloneNode", function (a) {
			a = G.call(this, a);
			this.ownerDocument.__CE_hasRegistry ? A(b, a) : v(b, a);
			return a
		});
		q(Node.prototype, "removeChild", function (a) {
			var c = l(a), d = J.call(this, a);
			c && z(b, a);
			return d
		});
		q(Node.prototype, "replaceChild", function (a, c) {
			if (a instanceof DocumentFragment) {
				var d = Array.prototype.slice.apply(a.childNodes);
				a = K.call(this, a, c);
				if (l(this)) {
					for (z(b, c), c = 0; c < d.length; c++) {
						x(b, d[c]);
					}
				}
				return a
			}
			var d = l(a), e = K.call(this, a, c), f = l(this);
			f && z(b, c);
			d && z(b, a);
			f && x(b, a);
			return e
		});
		L && L.get ? a(Node.prototype, L) : t(b, function (b) {
				a(b, {
					enumerable: !0, configurable: !0, get: function () {
						for (var a = [], b =
							0; b < this.childNodes.length; b++) {
							a.push(this.childNodes[b].textContent);
						}
						return a.join("")
					}, set: function (a) {
						for (; this.firstChild;) {
							J.call(this, this.firstChild);
						}
						H.call(this, document.createTextNode(a))
					}
				})
			})
	};
	function sa(b) {
		var a = Element.prototype;
		a.before = function (a) {
			for (var c = [], d = 0; d < arguments.length; ++d) {
				c[d - 0] = arguments[d];
			}
			d = c.filter(function (a) {
				return a instanceof Node && l(a)
			});
			ja.apply(this, c);
			for (var e = 0; e < d.length; e++) {
				z(b, d[e]);
			}
			if (l(this)) {
				for (d = 0; d < c.length; d++) {
					e = c[d], e instanceof Element && x(b, e)
				}
			}
		};
		a.after = function (a) {
			for (var c = [], d = 0; d < arguments.length; ++d) {
				c[d - 0] = arguments[d];
			}
			d = c.filter(function (a) {
				return a instanceof Node && l(a)
			});
			ka.apply(this, c);
			for (var e = 0; e < d.length; e++) {
				z(b, d[e]);
			}
			if (l(this)) {
				for (d =
						 0; d < c.length; d++) {
					e = c[d], e instanceof Element && x(b, e)
				}
			}
		};
		a.replaceWith = function (a) {
			for (var c = [], d = 0; d < arguments.length; ++d) {
				c[d - 0] = arguments[d];
			}
			var d = c.filter(function (a) {
				return a instanceof Node && l(a)
			}), e = l(this);
			la.apply(this, c);
			for (var f = 0; f < d.length; f++) {
				z(b, d[f]);
			}
			if (e) {
				for (z(b, this), d = 0; d < c.length; d++) {
					e = c[d], e instanceof Element && x(b, e)
				}
			}
		};
		a.remove = function () {
			var a = l(this);
			ma.call(this);
			a && z(b, this)
		}
	};
	function ta() {
		var b = Y;

		function a(a, c) {
			Object.defineProperty(a, "innerHTML", {
				enumerable: c.enumerable,
				configurable: !0,
				get: c.get,
				set: function (a) {
					var d = this, e = void 0;
					l(this) && (e = [], n(this, function (a) {
						a !== d && e.push(a)
					}));
					c.set.call(this, a);
					if (e) {
						for (var f = 0; f < e.length; f++) {
							var h = e[f];
							1 === h.__CE_state && b.disconnectedCallback(h)
						}
					}
					this.ownerDocument.__CE_hasRegistry ? A(b, this) : v(b, this);
					return a
				}
			})
		}

		function e(a, c) {
			q(a, "insertAdjacentElement", function (a, d) {
				var e = l(d);
				a = c.call(this, a, d);
				e && z(b, d);
				l(a) && x(b, d);
				return a
			})
		}

		M ? q(Element.prototype, "attachShadow", function (a) {
				return this.__CE_shadowRoot = a = M.call(this, a)
			}) : console.warn("Custom Elements: `Element#attachShadow` was not patched.");
		if (N && N.get) {
			a(Element.prototype, N);
		}
		else if (W && W.get) {
			a(HTMLElement.prototype, W);
		}
		else {
			var c = F.call(document, "div");
			t(b, function (b) {
				a(b, {
					enumerable: !0, configurable: !0, get: function () {
						return G.call(this, !0).innerHTML
					}, set: function (a) {
						var b = "template" === this.localName ? this.content : this;
						for (c.innerHTML = a; 0 < b.childNodes.length;) {
							J.call(b,
								b.childNodes[0]);
						}
						for (; 0 < c.childNodes.length;) {
							H.call(b, c.childNodes[0])
						}
					}
				})
			})
		}
		q(Element.prototype, "setAttribute", function (a, c) {
			if (1 !== this.__CE_state) {
				return Q.call(this, a, c);
			}
			var d = O.call(this, a);
			Q.call(this, a, c);
			c = O.call(this, a);
			d !== c && b.attributeChangedCallback(this, a, d, c, null)
		});
		q(Element.prototype, "setAttributeNS", function (a, c, e) {
			if (1 !== this.__CE_state) {
				return T.call(this, a, c, e);
			}
			var d = S.call(this, a, c);
			T.call(this, a, c, e);
			e = S.call(this, a, c);
			d !== e && b.attributeChangedCallback(this, c, d, e, a)
		});
		q(Element.prototype,
			"removeAttribute", function (a) {
				if (1 !== this.__CE_state) {
					return R.call(this, a);
				}
				var c = O.call(this, a);
				R.call(this, a);
				null !== c && b.attributeChangedCallback(this, a, c, null, null)
			});
		q(Element.prototype, "removeAttributeNS", function (a, c) {
			if (1 !== this.__CE_state) {
				return U.call(this, a, c);
			}
			var d = S.call(this, a, c);
			U.call(this, a, c);
			var e = S.call(this, a, c);
			d !== e && b.attributeChangedCallback(this, c, d, e, a)
		});
		X ? e(HTMLElement.prototype, X) : V ? e(Element.prototype, V) : console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");
		pa(b, Element.prototype, {i: ha, append: ia});
		sa(b)
	};
	/*

	 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
	 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
	 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
	 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
	 Code distributed by Google as part of the polymer project is also
	 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
	 */
	var Z = window.customElements;
	if (!Z || Z.forcePolyfill || "function" != typeof Z.define || "function" != typeof Z.get) {
		var Y = new r;
		oa();
		qa();
		ra();
		ta();
		document.__CE_hasRegistry = !0;
		var ua = new E(Y);
		Object.defineProperty(window, "customElements", {configurable: !0, enumerable: !0, value: ua})
	}
	;
}).call(self);



},{}],2:[function(require,module,exports){
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements.
 *
 * ES5-style classes don't work with native Custom Elements because the
 * HTMLElement constructor uses the value of `new.target` to look up the custom
 * element definition for the currently called constructor. `new.target` is only
 * set when `new` is called and is only propagated via super() calls. super()
 * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works
 * when extending other ES5-style classes, and does not propagate `new.target`.
 *
 * This shim allows the native HTMLElement constructor to work by generating and
 * registering a stand-in class instead of the users custom element class. This
 * stand-in class's constructor has an actual call to super().
 * `customElements.define()` and `customElements.get()` are both overridden to
 * hide this stand-in class from users.
 *
 * In order to create instance of the user-defined class, rather than the stand
 * in, the stand-in's constructor swizzles its instances prototype and invokes
 * the user-defined constructor. When the user-defined constructor is called
 * directly it creates an instance of the stand-in class to get a real extension
 * of HTMLElement and returns that.
 *
 * There are two important constructors: A patched HTMLElement constructor, and
 * the StandInElement constructor. They both will be called to create an element
 * but which is called first depends on whether the browser creates the element
 * or the user-defined constructor is called directly. The variables
 * `browserConstruction` and `userConstruction` control the flow between the
 * two constructors.
 *
 * This shim should be better than forcing the polyfill because:
 *   1. It's smaller
 *   2. All reaction timings are the same as native (mostly synchronous)
 *   3. All reaction triggering DOM operations are automatically supported
 *
 * There are some restrictions and requirements on ES5 constructors:
 *   1. All constructors in a inheritance hierarchy must be ES5-style, so that
 *      they can be called with Function.call(). This effectively means that the
 *      whole application must be compiled to ES5.
 *   2. Constructors must return the value of the emulated super() call. Like
 *      `return SuperClass.call(this)`
 *   3. The `this` reference should not be used before the emulated super() call
 *      just like `this` is illegal to use before super() in ES6.
 *   4. Constructors should not create other custom elements before the emulated
 *      super() call. This is the same restriction as with native custom
 *      elements.
 *
 *  Compiling valid class-based custom elements to ES5 will satisfy these
 *  requirements with the latest version of popular transpilers.
 */
(() => {
  'use strict';

  // Do nothing if `customElements` does not exist.
  if (!window.customElements) return;

  const NativeHTMLElement = window.HTMLElement;
  const nativeDefine = window.customElements.define;
  const nativeGet = window.customElements.get;

  /**
   * Map of user-provided constructors to tag names.
   *
   * @type {Map<Function, string>}
   */
  const tagnameByConstructor = new Map();

  /**
   * Map of tag names to user-provided constructors.
   *
   * @type {Map<string, Function>}
   */
  const constructorByTagname = new Map();


  /**
   * Whether the constructors are being called by a browser process, ie parsing
   * or createElement.
   */
  let browserConstruction = false;

  /**
   * Whether the constructors are being called by a user-space process, ie
   * calling an element constructor.
   */
  let userConstruction = false;

  window.HTMLElement = function() {
    if (!browserConstruction) {
      const tagname = tagnameByConstructor.get(this.constructor);
      const fakeClass = nativeGet.call(window.customElements, tagname);

      // Make sure that the fake constructor doesn't call back to this constructor
      userConstruction = true;
      const instance = new (fakeClass)();
      return instance;
    }
    // Else do nothing. This will be reached by ES5-style classes doing
    // HTMLElement.call() during initialization
    browserConstruction = false;
  };
  // By setting the patched HTMLElement's prototype property to the native
  // HTMLElement's prototype we make sure that:
  //     document.createElement('a') instanceof HTMLElement
  // works because instanceof uses HTMLElement.prototype, which is on the
  // ptototype chain of built-in elements.
  window.HTMLElement.prototype = NativeHTMLElement.prototype;

  window.customElements.define = (tagname, elementClass) => {
    const elementProto = elementClass.prototype;
    const StandInElement = class extends NativeHTMLElement {
      constructor() {
        // Call the native HTMLElement constructor, this gives us the
        // under-construction instance as `this`:
        super();

        // The prototype will be wrong up because the browser used our fake
        // class, so fix it:
        Object.setPrototypeOf(this, elementProto);

        if (!userConstruction) {
          // Make sure that user-defined constructor bottom's out to a do-nothing
          // HTMLElement() call
          browserConstruction = true;
          // Call the user-defined constructor on our instance:
          elementClass.call(this);
        }
        userConstruction = false;
      }
    };
    const standInProto = StandInElement.prototype;
    StandInElement.observedAttributes = elementClass.observedAttributes;
    standInProto.connectedCallback = elementProto.connectedCallback;
    standInProto.disconnectedCallback = elementProto.disconnectedCallback;
    standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;
    standInProto.adoptedCallback = elementProto.adoptedCallback;

    tagnameByConstructor.set(elementClass, tagname);
    constructorByTagname.set(tagname, elementClass);
    nativeDefine.call(window.customElements, tagname, StandInElement);
  };

  window.customElements.get = (tagname) => constructorByTagname.get(tagname);

})();

},{}],3:[function(require,module,exports){
"use strict";

// class/component rules
// always call super() first in the ctor. This also calls the extended class' ctor.
// cannot call NEW on a Component class

// Classes http://exploringjs.com/es6/ch_classes.html#_the-species-pattern-in-static-methods

require('./custom-elements-shim');
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
        privates[this._uid].DOMSTATE = 'connected';
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
            typeof node != 'string' ? // no node is supplied
                on(node, eventName, selector, callback) :
                on(this, node, eventName, selector));
    }

    once(node, eventName, selector, callback) {
        return this.registerHandle(
            typeof node != 'string' ? // no node is supplied
                on.once(node, eventName, selector, callback) :
                on.once(this, node, eventName, selector, callback));
    }

    registerHandle(handle) {
        privates[this._uid].handleList.push(handle);
        return handle;
    }

    get DOMSTATE() {
        return privates[this._uid].DOMSTATE;
    }

    static clone(template) {
        if (template.content && template.content.children) {
            return document.importNode(template.content, true);
        }
        var
            frag = document.createDocumentFragment(),
            cloneNode = document.createElement('div');
        cloneNode.innerHTML = template.innerHTML;

        while (cloneNode.children.length) {
            frag.appendChild(cloneNode.children[0]);
        }
        return frag;
    }

    static addPlugin(plug) {
        var i, order = plug.order || 100;
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
    if (this.DOMSTATE != 'connected' || privates[this._uid].domReadyFired) {
        return;
    }

    var
        count = 0,
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
    }
    else {
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
    var i, nodes = [];
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
    function onReady () {
        callback(node);
        node.removeEventListener('domready', onReady);
    }
    if(node.DOMSTATE === 'domready'){
        callback(node);
    }else{
        node.addEventListener('domready', onReady);
    }
};

module.exports = BaseComponent;
},{"./custom-elements-shim":4,"dom":"dom","on":"on"}],4:[function(require,module,exports){
require('@webcomponents/custom-elements/src/native-shim');
require('@webcomponents/custom-elements/custom-elements.min');
},{"@webcomponents/custom-elements/custom-elements.min":1,"@webcomponents/custom-elements/src/native-shim":2}],5:[function(require,module,exports){
const BaseComponent = require('./BaseComponent');
const dom = require('dom');
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
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
    console.log('createCondition', name, value);
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
            console.log('  ', name, value);
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

module.exports = {};
},{"./BaseComponent":3,"dom":"dom"}],6:[function(require,module,exports){
const BaseComponent  = require('./BaseComponent');
const dom = require('dom');

function setBoolean (node, prop) {
    Object.defineProperty(node, prop, {
        enumerable: true,
        get () {
            if(node.hasAttribute(prop)){
                return dom.normalize(node.getAttribute(prop));
            }
            return false;
        },
        set (value) {
            if(value){
                this.setAttribute(prop, '');
            }else{
                this.removeAttribute(prop);
            }
        }
    });
}

function setProperty (node, prop) {
    Object.defineProperty(node, prop, {
        enumerable: true,
        get () {
            return dom.normalize(this.getAttribute(prop));
        },
        set (value) {
            this.setAttribute(prop, value);
        }
    });
}

function setProperties (node) {
    let props = node.props || node.properties;
    if(props) {
        props.forEach(function (prop) {
            if(prop === 'disabled'){
                setBoolean(node, prop);
            }
            else{
                setProperty(node, prop);
            }
        });
    }
}

function setBooleans (node) {
    let props = node.bools || node.booleans;
    if(props) {
        props.forEach(function (prop) {
            setBoolean(node, prop);
        });
    }
}

BaseComponent.addPlugin({
    name: 'properties',
    order: 10,
    init: function (node) {
        setProperties(node);
        setBooleans(node);
    },
    preAttributeChanged: function (node, name, value) {
        this[name] = dom.normalize(value);
        if(!value && (node.bools || node.booleans || []).indexOf(name)){
            node.removeAttribute(name);
        }
    }
});

module.exports = {};
},{"./BaseComponent":3,"dom":"dom"}],7:[function(require,module,exports){
const BaseComponent  = require('./BaseComponent');

function assignRefs (node) {
    dom.queryAll(node, '[ref]').forEach(function (child) {
        var name = child.getAttribute('ref');
        node[name] = child;
    });
}

function assignEvents (node) {
    // <div on="click:onClick">
    dom.queryAll(node, '[on]').forEach(function (child) {
        var
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

module.exports = {};
},{"./BaseComponent":3}],8:[function(require,module,exports){
const BaseComponent  = require('./BaseComponent');
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

module.exports = {};
},{"./BaseComponent":3,"dom":"dom"}],9:[function(require,module,exports){
const BaseComponent  = require('../../src/BaseComponent');
const properties = require('../../src/properties');
const template = require('../../src/template');
const refs = require('../../src/refs');
const itemTemplate = require('../../src/item-template');

class TestProps extends BaseComponent {

    static get observedAttributes() { return ['foo', 'bar', 'nbc', 'cbs', 'disabled']; }
    get props () { return ['foo', 'bar']; }
    get bools () { return ['nbc', 'cbs']; }

    attributeChanged (name, value) {
        //console.log('CHG', name, value);
        //this[name] = dom.normalize(value);
        this[name + '-changed'] = dom.normalize(value);
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
},{"../../src/BaseComponent":3,"../../src/item-template":5,"../../src/properties":6,"../../src/refs":7,"../../src/template":8}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQHdlYmNvbXBvbmVudHMvY3VzdG9tLWVsZW1lbnRzL2N1c3RvbS1lbGVtZW50cy5taW4uanMiLCJub2RlX21vZHVsZXMvQHdlYmNvbXBvbmVudHMvY3VzdG9tLWVsZW1lbnRzL3NyYy9uYXRpdmUtc2hpbS5qcyIsInNyYy9CYXNlQ29tcG9uZW50LmpzIiwic3JjL2N1c3RvbS1lbGVtZW50cy1zaGltLmpzIiwic3JjL2l0ZW0tdGVtcGxhdGUuanMiLCJzcmMvcHJvcGVydGllcy5qcyIsInNyYy9yZWZzLmpzIiwic3JjL3RlbXBsYXRlLmpzIiwidGVzdHMvc3JjL2xpZmVjeWNsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuT0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBnID0gbmV3IGZ1bmN0aW9uICgpIHtcblx0fTtcblx0dmFyIGFhID0gbmV3IFNldChcImFubm90YXRpb24teG1sIGNvbG9yLXByb2ZpbGUgZm9udC1mYWNlIGZvbnQtZmFjZS1zcmMgZm9udC1mYWNlLXVyaSBmb250LWZhY2UtZm9ybWF0IGZvbnQtZmFjZS1uYW1lIG1pc3NpbmctZ2x5cGhcIi5zcGxpdChcIiBcIikpO1xuXG5cdGZ1bmN0aW9uIGsoYikge1xuXHRcdHZhciBhID0gYWEuaGFzKGIpO1xuXHRcdGIgPSAvXlthLXpdWy4wLTlfYS16XSotW1xcLS4wLTlfYS16XSokLy50ZXN0KGIpO1xuXHRcdHJldHVybiAhYSAmJiBiXG5cdH1cblxuXHRmdW5jdGlvbiBsKGIpIHtcblx0XHR2YXIgYSA9IGIuaXNDb25uZWN0ZWQ7XG5cdFx0aWYgKHZvaWQgMCAhPT0gYSkge1xuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fVxuXHRcdGZvciAoOyBiICYmICEoYi5fX0NFX2lzSW1wb3J0RG9jdW1lbnQgfHwgYiBpbnN0YW5jZW9mIERvY3VtZW50KTspIHtcblx0XHRcdGIgPSBiLnBhcmVudE5vZGUgfHwgKHdpbmRvdy5TaGFkb3dSb290ICYmIGIgaW5zdGFuY2VvZiBTaGFkb3dSb290ID8gYi5ob3N0IDogdm9pZCAwKTtcblx0XHR9XG5cdFx0cmV0dXJuICEoIWIgfHwgIShiLl9fQ0VfaXNJbXBvcnREb2N1bWVudCB8fCBiIGluc3RhbmNlb2YgRG9jdW1lbnQpKVxuXHR9XG5cblx0ZnVuY3Rpb24gbShiLCBhKSB7XG5cdFx0Zm9yICg7IGEgJiYgYSAhPT0gYiAmJiAhYS5uZXh0U2libGluZzspIHtcblx0XHRcdGEgPSBhLnBhcmVudE5vZGU7XG5cdFx0fVxuXHRcdHJldHVybiBhICYmIGEgIT09IGIgPyBhLm5leHRTaWJsaW5nIDogbnVsbFxuXHR9XG5cblx0ZnVuY3Rpb24gbihiLCBhLCBlKSB7XG5cdFx0ZSA9IGUgPyBlIDogbmV3IFNldDtcblx0XHRmb3IgKHZhciBjID0gYjsgYzspIHtcblx0XHRcdGlmIChjLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdFx0XHR2YXIgZCA9IGM7XG5cdFx0XHRcdGEoZCk7XG5cdFx0XHRcdHZhciBoID0gZC5sb2NhbE5hbWU7XG5cdFx0XHRcdGlmIChcImxpbmtcIiA9PT0gaCAmJiBcImltcG9ydFwiID09PSBkLmdldEF0dHJpYnV0ZShcInJlbFwiKSkge1xuXHRcdFx0XHRcdGMgPSBkLmltcG9ydDtcblx0XHRcdFx0XHRpZiAoYyBpbnN0YW5jZW9mIE5vZGUgJiYgIWUuaGFzKGMpKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGUuYWRkKGMpLCBjID0gYy5maXJzdENoaWxkOyBjOyBjID0gYy5uZXh0U2libGluZykge1xuXHRcdFx0XHRcdFx0XHRuKGMsIGEsIGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjID0gbShiLCBkKTtcblx0XHRcdFx0XHRjb250aW51ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKFwidGVtcGxhdGVcIiA9PT0gaCkge1xuXHRcdFx0XHRcdGMgPSBtKGIsIGQpO1xuXHRcdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGQgPSBkLl9fQ0Vfc2hhZG93Um9vdCkge1xuXHRcdFx0XHRcdGZvciAoZCA9IGQuZmlyc3RDaGlsZDsgZDsgZCA9IGQubmV4dFNpYmxpbmcpIHtcblx0XHRcdFx0XHRcdG4oZCwgYSwgZSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGMgPSBjLmZpcnN0Q2hpbGQgPyBjLmZpcnN0Q2hpbGQgOiBtKGIsIGMpXG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcShiLCBhLCBlKSB7XG5cdFx0YlthXSA9IGVcblx0fTtcblx0ZnVuY3Rpb24gcigpIHtcblx0XHR0aGlzLmEgPSBuZXcgTWFwO1xuXHRcdHRoaXMuZiA9IG5ldyBNYXA7XG5cdFx0dGhpcy5jID0gW107XG5cdFx0dGhpcy5iID0gITFcblx0fVxuXG5cdGZ1bmN0aW9uIGJhKGIsIGEsIGUpIHtcblx0XHRiLmEuc2V0KGEsIGUpO1xuXHRcdGIuZi5zZXQoZS5jb25zdHJ1Y3RvciwgZSlcblx0fVxuXG5cdGZ1bmN0aW9uIHQoYiwgYSkge1xuXHRcdGIuYiA9ICEwO1xuXHRcdGIuYy5wdXNoKGEpXG5cdH1cblxuXHRmdW5jdGlvbiB2KGIsIGEpIHtcblx0XHRiLmIgJiYgbihhLCBmdW5jdGlvbiAoYSkge1xuXHRcdFx0cmV0dXJuIHcoYiwgYSlcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gdyhiLCBhKSB7XG5cdFx0aWYgKGIuYiAmJiAhYS5fX0NFX3BhdGNoZWQpIHtcblx0XHRcdGEuX19DRV9wYXRjaGVkID0gITA7XG5cdFx0XHRmb3IgKHZhciBlID0gMDsgZSA8IGIuYy5sZW5ndGg7IGUrKykge1xuXHRcdFx0XHRiLmNbZV0oYSlcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB4KGIsIGEpIHtcblx0XHR2YXIgZSA9IFtdO1xuXHRcdG4oYSwgZnVuY3Rpb24gKGIpIHtcblx0XHRcdHJldHVybiBlLnB1c2goYilcblx0XHR9KTtcblx0XHRmb3IgKGEgPSAwOyBhIDwgZS5sZW5ndGg7IGErKykge1xuXHRcdFx0dmFyIGMgPSBlW2FdO1xuXHRcdFx0MSA9PT0gYy5fX0NFX3N0YXRlID8gYi5jb25uZWN0ZWRDYWxsYmFjayhjKSA6IHkoYiwgYylcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB6KGIsIGEpIHtcblx0XHR2YXIgZSA9IFtdO1xuXHRcdG4oYSwgZnVuY3Rpb24gKGIpIHtcblx0XHRcdHJldHVybiBlLnB1c2goYilcblx0XHR9KTtcblx0XHRmb3IgKGEgPSAwOyBhIDwgZS5sZW5ndGg7IGErKykge1xuXHRcdFx0dmFyIGMgPSBlW2FdO1xuXHRcdFx0MSA9PT0gYy5fX0NFX3N0YXRlICYmIGIuZGlzY29ubmVjdGVkQ2FsbGJhY2soYylcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBBKGIsIGEsIGUpIHtcblx0XHRlID0gZSA/IGUgOiBuZXcgU2V0O1xuXHRcdHZhciBjID0gW107XG5cdFx0bihhLCBmdW5jdGlvbiAoZCkge1xuXHRcdFx0aWYgKFwibGlua1wiID09PSBkLmxvY2FsTmFtZSAmJiBcImltcG9ydFwiID09PSBkLmdldEF0dHJpYnV0ZShcInJlbFwiKSkge1xuXHRcdFx0XHR2YXIgYSA9IGQuaW1wb3J0O1xuXHRcdFx0XHRhIGluc3RhbmNlb2YgTm9kZSAmJiBcImNvbXBsZXRlXCIgPT09IGEucmVhZHlTdGF0ZSA/IChhLl9fQ0VfaXNJbXBvcnREb2N1bWVudCA9ICEwLCBhLl9fQ0VfaGFzUmVnaXN0cnkgPSAhMCkgOiBkLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBhID0gZC5pbXBvcnQ7XG5cdFx0XHRcdFx0XHRhLl9fQ0VfZG9jdW1lbnRMb2FkSGFuZGxlZCB8fCAoYS5fX0NFX2RvY3VtZW50TG9hZEhhbmRsZWQgPSAhMCwgYS5fX0NFX2lzSW1wb3J0RG9jdW1lbnQgPSAhMCwgYS5fX0NFX2hhc1JlZ2lzdHJ5ID0gITAsIG5ldyBTZXQoZSksIGUuZGVsZXRlKGEpLCBBKGIsIGEsIGUpKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Yy5wdXNoKGQpXG5cdFx0XHR9XG5cdFx0fSwgZSk7XG5cdFx0aWYgKGIuYikge1xuXHRcdFx0Zm9yIChhID0gMDsgYSA8IGMubGVuZ3RoOyBhKyspIHtcblx0XHRcdFx0dyhiLCBjW2FdKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yIChhID0gMDsgYSA8IGMubGVuZ3RoOyBhKyspIHtcblx0XHRcdHkoYixcblx0XHRcdFx0Y1thXSlcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB5KGIsIGEpIHtcblx0XHRpZiAodm9pZCAwID09PSBhLl9fQ0Vfc3RhdGUpIHtcblx0XHRcdHZhciBlID0gYi5hLmdldChhLmxvY2FsTmFtZSk7XG5cdFx0XHRpZiAoZSkge1xuXHRcdFx0XHRlLmNvbnN0cnVjdGlvblN0YWNrLnB1c2goYSk7XG5cdFx0XHRcdHZhciBjID0gZS5jb25zdHJ1Y3Rvcjtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0aWYgKG5ldyBjICE9PSBhKSB7XG5cdFx0XHRcdFx0XHRcdHRocm93IEVycm9yKFwiVGhlIGN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9yIGRpZCBub3QgcHJvZHVjZSB0aGUgZWxlbWVudCBiZWluZyB1cGdyYWRlZC5cIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRcdGUuY29uc3RydWN0aW9uU3RhY2sucG9wKClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKGYpIHtcblx0XHRcdFx0XHR0aHJvdyBhLl9fQ0Vfc3RhdGUgPSAyLCBmO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEuX19DRV9zdGF0ZSA9IDE7XG5cdFx0XHRcdGEuX19DRV9kZWZpbml0aW9uID0gZTtcblx0XHRcdFx0aWYgKGUuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0Zm9yIChlID0gZS5vYnNlcnZlZEF0dHJpYnV0ZXMsIGMgPSAwOyBjIDwgZS5sZW5ndGg7IGMrKykge1xuXHRcdFx0XHRcdFx0dmFyIGQgPSBlW2NdLCBoID0gYS5nZXRBdHRyaWJ1dGUoZCk7XG5cdFx0XHRcdFx0XHRudWxsICE9PSBoICYmIGIuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGEsIGQsIG51bGwsIGgsIG51bGwpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGwoYSkgJiYgYi5jb25uZWN0ZWRDYWxsYmFjayhhKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHIucHJvdG90eXBlLmNvbm5lY3RlZENhbGxiYWNrID0gZnVuY3Rpb24gKGIpIHtcblx0XHR2YXIgYSA9IGIuX19DRV9kZWZpbml0aW9uO1xuXHRcdGEuY29ubmVjdGVkQ2FsbGJhY2sgJiYgYS5jb25uZWN0ZWRDYWxsYmFjay5jYWxsKGIpXG5cdH07XG5cdHIucHJvdG90eXBlLmRpc2Nvbm5lY3RlZENhbGxiYWNrID0gZnVuY3Rpb24gKGIpIHtcblx0XHR2YXIgYSA9IGIuX19DRV9kZWZpbml0aW9uO1xuXHRcdGEuZGlzY29ubmVjdGVkQ2FsbGJhY2sgJiYgYS5kaXNjb25uZWN0ZWRDYWxsYmFjay5jYWxsKGIpXG5cdH07XG5cdHIucHJvdG90eXBlLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uIChiLCBhLCBlLCBjLCBkKSB7XG5cdFx0dmFyIGggPSBiLl9fQ0VfZGVmaW5pdGlvbjtcblx0XHRoLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayAmJiAtMSA8IGgub2JzZXJ2ZWRBdHRyaWJ1dGVzLmluZGV4T2YoYSkgJiYgaC5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2suY2FsbChiLCBhLCBlLCBjLCBkKVxuXHR9O1xuXHRmdW5jdGlvbiBCKGIsIGEpIHtcblx0XHR0aGlzLmMgPSBiO1xuXHRcdHRoaXMuYSA9IGE7XG5cdFx0dGhpcy5iID0gdm9pZCAwO1xuXHRcdEEodGhpcy5jLCB0aGlzLmEpO1xuXHRcdFwibG9hZGluZ1wiID09PSB0aGlzLmEucmVhZHlTdGF0ZSAmJiAodGhpcy5iID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5mLmJpbmQodGhpcykpLCB0aGlzLmIub2JzZXJ2ZSh0aGlzLmEsIHtcblx0XHRcdGNoaWxkTGlzdDogITAsXG5cdFx0XHRzdWJ0cmVlOiAhMFxuXHRcdH0pKVxuXHR9XG5cblx0ZnVuY3Rpb24gQyhiKSB7XG5cdFx0Yi5iICYmIGIuYi5kaXNjb25uZWN0KClcblx0fVxuXG5cdEIucHJvdG90eXBlLmYgPSBmdW5jdGlvbiAoYikge1xuXHRcdHZhciBhID0gdGhpcy5hLnJlYWR5U3RhdGU7XG5cdFx0XCJpbnRlcmFjdGl2ZVwiICE9PSBhICYmIFwiY29tcGxldGVcIiAhPT0gYSB8fCBDKHRoaXMpO1xuXHRcdGZvciAoYSA9IDA7IGEgPCBiLmxlbmd0aDsgYSsrKSB7XG5cdFx0XHRmb3IgKHZhciBlID0gYlthXS5hZGRlZE5vZGVzLCBjID0gMDsgYyA8IGUubGVuZ3RoOyBjKyspIHtcblx0XHRcdFx0QSh0aGlzLmMsIGVbY10pXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRmdW5jdGlvbiBjYSgpIHtcblx0XHR2YXIgYiA9IHRoaXM7XG5cdFx0dGhpcy5iID0gdGhpcy5hID0gdm9pZCAwO1xuXHRcdHRoaXMuYyA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhKSB7XG5cdFx0XHRiLmIgPSBhO1xuXHRcdFx0Yi5hICYmIGEoYi5hKVxuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBEKGIpIHtcblx0XHRpZiAoYi5hKSB7XG5cdFx0XHR0aHJvdyBFcnJvcihcIkFscmVhZHkgcmVzb2x2ZWQuXCIpO1xuXHRcdH1cblx0XHRiLmEgPSB2b2lkIDA7XG5cdFx0Yi5iICYmIGIuYih2b2lkIDApXG5cdH07XG5cdGZ1bmN0aW9uIEUoYikge1xuXHRcdHRoaXMuZiA9ICExO1xuXHRcdHRoaXMuYSA9IGI7XG5cdFx0dGhpcy5oID0gbmV3IE1hcDtcblx0XHR0aGlzLmcgPSBmdW5jdGlvbiAoYikge1xuXHRcdFx0cmV0dXJuIGIoKVxuXHRcdH07XG5cdFx0dGhpcy5iID0gITE7XG5cdFx0dGhpcy5jID0gW107XG5cdFx0dGhpcy5qID0gbmV3IEIoYiwgZG9jdW1lbnQpXG5cdH1cblxuXHRFLnByb3RvdHlwZS5sID0gZnVuY3Rpb24gKGIsIGEpIHtcblx0XHR2YXIgZSA9IHRoaXM7XG5cdFx0aWYgKCEoYSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIkN1c3RvbSBlbGVtZW50IGNvbnN0cnVjdG9ycyBtdXN0IGJlIGZ1bmN0aW9ucy5cIik7XG5cdFx0fVxuXHRcdGlmICghayhiKSkge1xuXHRcdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVGhlIGVsZW1lbnQgbmFtZSAnXCIgKyBiICsgXCInIGlzIG5vdCB2YWxpZC5cIik7XG5cdFx0fVxuXHRcdGlmICh0aGlzLmEuYS5nZXQoYikpIHtcblx0XHRcdHRocm93IEVycm9yKFwiQSBjdXN0b20gZWxlbWVudCB3aXRoIG5hbWUgJ1wiICsgYiArIFwiJyBoYXMgYWxyZWFkeSBiZWVuIGRlZmluZWQuXCIpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5mKSB7XG5cdFx0XHR0aHJvdyBFcnJvcihcIkEgY3VzdG9tIGVsZW1lbnQgaXMgYWxyZWFkeSBiZWluZyBkZWZpbmVkLlwiKTtcblx0XHR9XG5cdFx0dGhpcy5mID0gITA7XG5cdFx0dmFyIGMsIGQsIGgsIGYsIHU7XG5cdFx0dHJ5IHtcblx0XHRcdHZhciBwID0gZnVuY3Rpb24gKGIpIHtcblx0XHRcdFx0dmFyIGEgPSBQW2JdO1xuXHRcdFx0XHRpZiAodm9pZCAwICE9PSBhICYmICEoYSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xuXHRcdFx0XHRcdHRocm93IEVycm9yKFwiVGhlICdcIiArIGIgKyBcIicgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gYVxuXHRcdFx0fSwgUCA9IGEucHJvdG90eXBlO1xuXHRcdFx0aWYgKCEoUCBpbnN0YW5jZW9mIE9iamVjdCkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZSBjdXN0b20gZWxlbWVudCBjb25zdHJ1Y3RvcidzIHByb3RvdHlwZSBpcyBub3QgYW4gb2JqZWN0LlwiKTtcblx0XHRcdH1cblx0XHRcdGMgPSBwKFwiY29ubmVjdGVkQ2FsbGJhY2tcIik7XG5cdFx0XHRkID0gcChcImRpc2Nvbm5lY3RlZENhbGxiYWNrXCIpO1xuXHRcdFx0aCA9IHAoXCJhZG9wdGVkQ2FsbGJhY2tcIik7XG5cdFx0XHRmID0gcChcImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFja1wiKTtcblx0XHRcdHUgPSBhLm9ic2VydmVkQXR0cmlidXRlcyB8fCBbXVxuXHRcdH0gY2F0Y2ggKHZhKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0dGhpcy5mID0gITFcblx0XHR9XG5cdFx0YmEodGhpcy5hLCBiLCB7XG5cdFx0XHRsb2NhbE5hbWU6IGIsXG5cdFx0XHRjb25zdHJ1Y3RvcjogYSxcblx0XHRcdGNvbm5lY3RlZENhbGxiYWNrOiBjLFxuXHRcdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2s6IGQsXG5cdFx0XHRhZG9wdGVkQ2FsbGJhY2s6IGgsXG5cdFx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6IGYsXG5cdFx0XHRvYnNlcnZlZEF0dHJpYnV0ZXM6IHUsXG5cdFx0XHRjb25zdHJ1Y3Rpb25TdGFjazogW11cblx0XHR9KTtcblx0XHR0aGlzLmMucHVzaChiKTtcblx0XHR0aGlzLmIgfHwgKHRoaXMuYiA9ICEwLCB0aGlzLmcoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCExICE9PSBlLmIpIHtcblx0XHRcdFx0Zm9yIChlLmIgPSAhMSwgQShlLmEsIGRvY3VtZW50KTsgMCA8IGUuYy5sZW5ndGg7KSB7XG5cdFx0XHRcdFx0dmFyIGIgPSBlLmMuc2hpZnQoKTtcblx0XHRcdFx0XHQoYiA9IGUuaC5nZXQoYikpICYmIEQoYilcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pKVxuXHR9O1xuXHRFLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoYikge1xuXHRcdGlmIChiID0gdGhpcy5hLmEuZ2V0KGIpKSB7XG5cdFx0XHRyZXR1cm4gYi5jb25zdHJ1Y3RvclxuXHRcdH1cblx0fTtcblx0RS5wcm90b3R5cGUubyA9IGZ1bmN0aW9uIChiKSB7XG5cdFx0aWYgKCFrKGIpKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFN5bnRheEVycm9yKFwiJ1wiICsgYiArIFwiJyBpcyBub3QgYSB2YWxpZCBjdXN0b20gZWxlbWVudCBuYW1lLlwiKSk7XG5cdFx0fVxuXHRcdHZhciBhID0gdGhpcy5oLmdldChiKTtcblx0XHRpZiAoYSkge1xuXHRcdFx0cmV0dXJuIGEuYztcblx0XHR9XG5cdFx0YSA9IG5ldyBjYTtcblx0XHR0aGlzLmguc2V0KGIsIGEpO1xuXHRcdHRoaXMuYS5hLmdldChiKSAmJiAtMSA9PT0gdGhpcy5jLmluZGV4T2YoYikgJiYgRChhKTtcblx0XHRyZXR1cm4gYS5jXG5cdH07XG5cdEUucHJvdG90eXBlLm0gPSBmdW5jdGlvbiAoYikge1xuXHRcdEModGhpcy5qKTtcblx0XHR2YXIgYSA9IHRoaXMuZztcblx0XHR0aGlzLmcgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0cmV0dXJuIGIoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gYShlKVxuXHRcdFx0fSlcblx0XHR9XG5cdH07XG5cdHdpbmRvdy5DdXN0b21FbGVtZW50UmVnaXN0cnkgPSBFO1xuXHRFLnByb3RvdHlwZS5kZWZpbmUgPSBFLnByb3RvdHlwZS5sO1xuXHRFLnByb3RvdHlwZS5nZXQgPSBFLnByb3RvdHlwZS5nZXQ7XG5cdEUucHJvdG90eXBlLndoZW5EZWZpbmVkID0gRS5wcm90b3R5cGUubztcblx0RS5wcm90b3R5cGUucG9seWZpbGxXcmFwRmx1c2hDYWxsYmFjayA9IEUucHJvdG90eXBlLm07XG5cdHZhciBGID0gd2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50LCBkYSA9IHdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudE5TLCBlYSA9IHdpbmRvdy5Eb2N1bWVudC5wcm90b3R5cGUuaW1wb3J0Tm9kZSwgZmEgPSB3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLnByZXBlbmQsIGdhID0gd2luZG93LkRvY3VtZW50LnByb3RvdHlwZS5hcHBlbmQsIEcgPSB3aW5kb3cuTm9kZS5wcm90b3R5cGUuY2xvbmVOb2RlLCBIID0gd2luZG93Lk5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkLCBJID0gd2luZG93Lk5vZGUucHJvdG90eXBlLmluc2VydEJlZm9yZSwgSiA9IHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5yZW1vdmVDaGlsZCwgSyA9IHdpbmRvdy5Ob2RlLnByb3RvdHlwZS5yZXBsYWNlQ2hpbGQsIEwgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5Ob2RlLnByb3RvdHlwZSwgXCJ0ZXh0Q29udGVudFwiKSwgTSA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hdHRhY2hTaGFkb3csIE4gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSxcblx0XHRcImlubmVySFRNTFwiKSwgTyA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGUsIFEgPSB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlLCBSID0gd2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZSwgUyA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVOUywgVCA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGVOUywgVSA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGVOUywgViA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5pbnNlcnRBZGphY2VudEVsZW1lbnQsIGhhID0gd2luZG93LkVsZW1lbnQucHJvdG90eXBlLnByZXBlbmQsIGlhID0gd2luZG93LkVsZW1lbnQucHJvdG90eXBlLmFwcGVuZCwgamEgPSB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUuYmVmb3JlLCBrYSA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5hZnRlciwgbGEgPSB3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUucmVwbGFjZVdpdGgsIG1hID0gd2luZG93LkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZSxcblx0XHRuYSA9IHdpbmRvdy5IVE1MRWxlbWVudCwgVyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZSwgXCJpbm5lckhUTUxcIiksIFggPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlLmluc2VydEFkamFjZW50RWxlbWVudDtcblxuXHRmdW5jdGlvbiBvYSgpIHtcblx0XHR2YXIgYiA9IFk7XG5cdFx0d2luZG93LkhUTUxFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZnVuY3Rpb24gYSgpIHtcblx0XHRcdFx0dmFyIGEgPSB0aGlzLmNvbnN0cnVjdG9yLCBjID0gYi5mLmdldChhKTtcblx0XHRcdFx0aWYgKCFjKSB7XG5cdFx0XHRcdFx0dGhyb3cgRXJyb3IoXCJUaGUgY3VzdG9tIGVsZW1lbnQgYmVpbmcgY29uc3RydWN0ZWQgd2FzIG5vdCByZWdpc3RlcmVkIHdpdGggYGN1c3RvbUVsZW1lbnRzYC5cIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGQgPSBjLmNvbnN0cnVjdGlvblN0YWNrO1xuXHRcdFx0XHRpZiAoIWQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGQgPSBGLmNhbGwoZG9jdW1lbnQsIGMubG9jYWxOYW1lKSwgT2JqZWN0LnNldFByb3RvdHlwZU9mKGQsIGEucHJvdG90eXBlKSwgZC5fX0NFX3N0YXRlID0gMSwgZC5fX0NFX2RlZmluaXRpb24gPSBjLCB3KGIsIGQpLCBkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBjID0gZC5sZW5ndGggLSAxLCBoID0gZFtjXTtcblx0XHRcdFx0aWYgKGggPT09IGcpIHtcblx0XHRcdFx0XHR0aHJvdyBFcnJvcihcIlRoZSBIVE1MRWxlbWVudCBjb25zdHJ1Y3RvciB3YXMgZWl0aGVyIGNhbGxlZCByZWVudHJhbnRseSBmb3IgdGhpcyBjb25zdHJ1Y3RvciBvciBjYWxsZWQgbXVsdGlwbGUgdGltZXMuXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRbY10gPSBnO1xuXHRcdFx0XHRPYmplY3Quc2V0UHJvdG90eXBlT2YoaCwgYS5wcm90b3R5cGUpO1xuXHRcdFx0XHR3KGIsIGgpO1xuXHRcdFx0XHRyZXR1cm4gaFxuXHRcdFx0fVxuXG5cdFx0XHRhLnByb3RvdHlwZSA9IG5hLnByb3RvdHlwZTtcblx0XHRcdHJldHVybiBhXG5cdFx0fSgpXG5cdH07XG5cdGZ1bmN0aW9uIHBhKGIsIGEsIGUpIHtcblx0XHRhLnByZXBlbmQgPSBmdW5jdGlvbiAoYSkge1xuXHRcdFx0Zm9yICh2YXIgZCA9IFtdLCBjID0gMDsgYyA8IGFyZ3VtZW50cy5sZW5ndGg7ICsrYykge1xuXHRcdFx0XHRkW2MgLSAwXSA9IGFyZ3VtZW50c1tjXTtcblx0XHRcdH1cblx0XHRcdGMgPSBkLmZpbHRlcihmdW5jdGlvbiAoYikge1xuXHRcdFx0XHRyZXR1cm4gYiBpbnN0YW5jZW9mIE5vZGUgJiYgbChiKVxuXHRcdFx0fSk7XG5cdFx0XHRlLmkuYXBwbHkodGhpcywgZCk7XG5cdFx0XHRmb3IgKHZhciBmID0gMDsgZiA8IGMubGVuZ3RoOyBmKyspIHtcblx0XHRcdFx0eihiLCBjW2ZdKTtcblx0XHRcdH1cblx0XHRcdGlmIChsKHRoaXMpKSB7XG5cdFx0XHRcdGZvciAoYyA9IDA7IGMgPCBkLmxlbmd0aDsgYysrKSB7XG5cdFx0XHRcdFx0ZiA9IGRbY10sIGYgaW5zdGFuY2VvZiBFbGVtZW50ICYmIHgoYiwgZilcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0YS5hcHBlbmQgPSBmdW5jdGlvbiAoYSkge1xuXHRcdFx0Zm9yICh2YXIgZCA9IFtdLCBjID0gMDsgYyA8IGFyZ3VtZW50cy5sZW5ndGg7ICsrYykge1xuXHRcdFx0XHRkW2MgLSAwXSA9IGFyZ3VtZW50c1tjXTtcblx0XHRcdH1cblx0XHRcdGMgPSBkLmZpbHRlcihmdW5jdGlvbiAoYikge1xuXHRcdFx0XHRyZXR1cm4gYiBpbnN0YW5jZW9mIE5vZGUgJiYgbChiKVxuXHRcdFx0fSk7XG5cdFx0XHRlLmFwcGVuZC5hcHBseSh0aGlzLCBkKTtcblx0XHRcdGZvciAodmFyIGYgPSAwOyBmIDwgYy5sZW5ndGg7IGYrKykge1xuXHRcdFx0XHR6KGIsIGNbZl0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGwodGhpcykpIHtcblx0XHRcdFx0Zm9yIChjID0gMDsgYyA8XG5cdFx0XHRcdGQubGVuZ3RoOyBjKyspIHtcblx0XHRcdFx0XHRmID0gZFtjXSwgZiBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgeChiLCBmKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRmdW5jdGlvbiBxYSgpIHtcblx0XHR2YXIgYiA9IFk7XG5cdFx0cShEb2N1bWVudC5wcm90b3R5cGUsIFwiY3JlYXRlRWxlbWVudFwiLCBmdW5jdGlvbiAoYSkge1xuXHRcdFx0aWYgKHRoaXMuX19DRV9oYXNSZWdpc3RyeSkge1xuXHRcdFx0XHR2YXIgZSA9IGIuYS5nZXQoYSk7XG5cdFx0XHRcdGlmIChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBlLmNvbnN0cnVjdG9yXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGEgPSBGLmNhbGwodGhpcywgYSk7XG5cdFx0XHR3KGIsIGEpO1xuXHRcdFx0cmV0dXJuIGFcblx0XHR9KTtcblx0XHRxKERvY3VtZW50LnByb3RvdHlwZSwgXCJpbXBvcnROb2RlXCIsIGZ1bmN0aW9uIChhLCBlKSB7XG5cdFx0XHRhID0gZWEuY2FsbCh0aGlzLCBhLCBlKTtcblx0XHRcdHRoaXMuX19DRV9oYXNSZWdpc3RyeSA/IEEoYiwgYSkgOiB2KGIsIGEpO1xuXHRcdFx0cmV0dXJuIGFcblx0XHR9KTtcblx0XHRxKERvY3VtZW50LnByb3RvdHlwZSwgXCJjcmVhdGVFbGVtZW50TlNcIiwgZnVuY3Rpb24gKGEsIGUpIHtcblx0XHRcdGlmICh0aGlzLl9fQ0VfaGFzUmVnaXN0cnkgJiYgKG51bGwgPT09IGEgfHwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIgPT09IGEpKSB7XG5cdFx0XHRcdHZhciBjID0gYi5hLmdldChlKTtcblx0XHRcdFx0aWYgKGMpIHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IGMuY29uc3RydWN0b3Jcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YSA9IGRhLmNhbGwodGhpcywgYSwgZSk7XG5cdFx0XHR3KGIsIGEpO1xuXHRcdFx0cmV0dXJuIGFcblx0XHR9KTtcblx0XHRwYShiLCBEb2N1bWVudC5wcm90b3R5cGUsIHtpOiBmYSwgYXBwZW5kOiBnYX0pXG5cdH07XG5cdGZ1bmN0aW9uIHJhKCkge1xuXHRcdHZhciBiID0gWTtcblxuXHRcdGZ1bmN0aW9uIGEoYSwgYykge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsIFwidGV4dENvbnRlbnRcIiwge1xuXHRcdFx0XHRlbnVtZXJhYmxlOiBjLmVudW1lcmFibGUsXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogITAsXG5cdFx0XHRcdGdldDogYy5nZXQsXG5cdFx0XHRcdHNldDogZnVuY3Rpb24gKGEpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcblx0XHRcdFx0XHRcdGMuc2V0LmNhbGwodGhpcywgYSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyIGQgPSB2b2lkIDA7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5maXJzdENoaWxkKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBlID0gdGhpcy5jaGlsZE5vZGVzLCB1ID0gZS5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGlmICgwIDwgdSAmJiBsKHRoaXMpKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgZCA9IEFycmF5KHUpLCBwID0gMDsgcCA8IHU7IHArKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZFtwXSA9IGVbcF1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGMuc2V0LmNhbGwodGhpcywgYSk7XG5cdFx0XHRcdFx0XHRpZiAoZCkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGEgPSAwOyBhIDwgZC5sZW5ndGg7IGErKykge1xuXHRcdFx0XHRcdFx0XHRcdHooYiwgZFthXSlcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRxKE5vZGUucHJvdG90eXBlLCBcImluc2VydEJlZm9yZVwiLCBmdW5jdGlvbiAoYSwgYykge1xuXHRcdFx0aWYgKGEgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG5cdFx0XHRcdHZhciBkID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGEuY2hpbGROb2Rlcyk7XG5cdFx0XHRcdGEgPSBJLmNhbGwodGhpcywgYSwgYyk7XG5cdFx0XHRcdGlmIChsKHRoaXMpKSB7XG5cdFx0XHRcdFx0Zm9yIChjID0gMDsgYyA8IGQubGVuZ3RoOyBjKyspIHtcblx0XHRcdFx0XHRcdHgoYiwgZFtjXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBhXG5cdFx0XHR9XG5cdFx0XHRkID0gbChhKTtcblx0XHRcdGMgPSBJLmNhbGwodGhpcywgYSwgYyk7XG5cdFx0XHRkICYmIHooYiwgYSk7XG5cdFx0XHRsKHRoaXMpICYmIHgoYiwgYSk7XG5cdFx0XHRyZXR1cm4gY1xuXHRcdH0pO1xuXHRcdHEoTm9kZS5wcm90b3R5cGUsIFwiYXBwZW5kQ2hpbGRcIiwgZnVuY3Rpb24gKGEpIHtcblx0XHRcdGlmIChhIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCkge1xuXHRcdFx0XHR2YXIgYyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhLmNoaWxkTm9kZXMpO1xuXHRcdFx0XHRhID0gSC5jYWxsKHRoaXMsIGEpO1xuXHRcdFx0XHRpZiAobCh0aGlzKSkge1xuXHRcdFx0XHRcdGZvciAodmFyIGQgPSAwOyBkIDwgYy5sZW5ndGg7IGQrKykge1xuXHRcdFx0XHRcdFx0eChiLCBjW2RdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGFcblx0XHRcdH1cblx0XHRcdGMgPSBsKGEpO1xuXHRcdFx0ZCA9IEguY2FsbCh0aGlzLCBhKTtcblx0XHRcdGMgJiYgeihiLCBhKTtcblx0XHRcdGwodGhpcykgJiYgeChiLCBhKTtcblx0XHRcdHJldHVybiBkXG5cdFx0fSk7XG5cdFx0cShOb2RlLnByb3RvdHlwZSwgXCJjbG9uZU5vZGVcIiwgZnVuY3Rpb24gKGEpIHtcblx0XHRcdGEgPSBHLmNhbGwodGhpcywgYSk7XG5cdFx0XHR0aGlzLm93bmVyRG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeSA/IEEoYiwgYSkgOiB2KGIsIGEpO1xuXHRcdFx0cmV0dXJuIGFcblx0XHR9KTtcblx0XHRxKE5vZGUucHJvdG90eXBlLCBcInJlbW92ZUNoaWxkXCIsIGZ1bmN0aW9uIChhKSB7XG5cdFx0XHR2YXIgYyA9IGwoYSksIGQgPSBKLmNhbGwodGhpcywgYSk7XG5cdFx0XHRjICYmIHooYiwgYSk7XG5cdFx0XHRyZXR1cm4gZFxuXHRcdH0pO1xuXHRcdHEoTm9kZS5wcm90b3R5cGUsIFwicmVwbGFjZUNoaWxkXCIsIGZ1bmN0aW9uIChhLCBjKSB7XG5cdFx0XHRpZiAoYSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcblx0XHRcdFx0dmFyIGQgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYS5jaGlsZE5vZGVzKTtcblx0XHRcdFx0YSA9IEsuY2FsbCh0aGlzLCBhLCBjKTtcblx0XHRcdFx0aWYgKGwodGhpcykpIHtcblx0XHRcdFx0XHRmb3IgKHooYiwgYyksIGMgPSAwOyBjIDwgZC5sZW5ndGg7IGMrKykge1xuXHRcdFx0XHRcdFx0eChiLCBkW2NdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGFcblx0XHRcdH1cblx0XHRcdHZhciBkID0gbChhKSwgZSA9IEsuY2FsbCh0aGlzLCBhLCBjKSwgZiA9IGwodGhpcyk7XG5cdFx0XHRmICYmIHooYiwgYyk7XG5cdFx0XHRkICYmIHooYiwgYSk7XG5cdFx0XHRmICYmIHgoYiwgYSk7XG5cdFx0XHRyZXR1cm4gZVxuXHRcdH0pO1xuXHRcdEwgJiYgTC5nZXQgPyBhKE5vZGUucHJvdG90eXBlLCBMKSA6IHQoYiwgZnVuY3Rpb24gKGIpIHtcblx0XHRcdFx0YShiLCB7XG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogITAsIGNvbmZpZ3VyYWJsZTogITAsIGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgYSA9IFtdLCBiID1cblx0XHRcdFx0XHRcdFx0MDsgYiA8IHRoaXMuY2hpbGROb2Rlcy5sZW5ndGg7IGIrKykge1xuXHRcdFx0XHRcdFx0XHRhLnB1c2godGhpcy5jaGlsZE5vZGVzW2JdLnRleHRDb250ZW50KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBhLmpvaW4oXCJcIilcblx0XHRcdFx0XHR9LCBzZXQ6IGZ1bmN0aW9uIChhKSB7XG5cdFx0XHRcdFx0XHRmb3IgKDsgdGhpcy5maXJzdENoaWxkOykge1xuXHRcdFx0XHRcdFx0XHRKLmNhbGwodGhpcywgdGhpcy5maXJzdENoaWxkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdEguY2FsbCh0aGlzLCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHR9O1xuXHRmdW5jdGlvbiBzYShiKSB7XG5cdFx0dmFyIGEgPSBFbGVtZW50LnByb3RvdHlwZTtcblx0XHRhLmJlZm9yZSA9IGZ1bmN0aW9uIChhKSB7XG5cdFx0XHRmb3IgKHZhciBjID0gW10sIGQgPSAwOyBkIDwgYXJndW1lbnRzLmxlbmd0aDsgKytkKSB7XG5cdFx0XHRcdGNbZCAtIDBdID0gYXJndW1lbnRzW2RdO1xuXHRcdFx0fVxuXHRcdFx0ZCA9IGMuZmlsdGVyKGZ1bmN0aW9uIChhKSB7XG5cdFx0XHRcdHJldHVybiBhIGluc3RhbmNlb2YgTm9kZSAmJiBsKGEpXG5cdFx0XHR9KTtcblx0XHRcdGphLmFwcGx5KHRoaXMsIGMpO1xuXHRcdFx0Zm9yICh2YXIgZSA9IDA7IGUgPCBkLmxlbmd0aDsgZSsrKSB7XG5cdFx0XHRcdHooYiwgZFtlXSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobCh0aGlzKSkge1xuXHRcdFx0XHRmb3IgKGQgPSAwOyBkIDwgYy5sZW5ndGg7IGQrKykge1xuXHRcdFx0XHRcdGUgPSBjW2RdLCBlIGluc3RhbmNlb2YgRWxlbWVudCAmJiB4KGIsIGUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdGEuYWZ0ZXIgPSBmdW5jdGlvbiAoYSkge1xuXHRcdFx0Zm9yICh2YXIgYyA9IFtdLCBkID0gMDsgZCA8IGFyZ3VtZW50cy5sZW5ndGg7ICsrZCkge1xuXHRcdFx0XHRjW2QgLSAwXSA9IGFyZ3VtZW50c1tkXTtcblx0XHRcdH1cblx0XHRcdGQgPSBjLmZpbHRlcihmdW5jdGlvbiAoYSkge1xuXHRcdFx0XHRyZXR1cm4gYSBpbnN0YW5jZW9mIE5vZGUgJiYgbChhKVxuXHRcdFx0fSk7XG5cdFx0XHRrYS5hcHBseSh0aGlzLCBjKTtcblx0XHRcdGZvciAodmFyIGUgPSAwOyBlIDwgZC5sZW5ndGg7IGUrKykge1xuXHRcdFx0XHR6KGIsIGRbZV0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGwodGhpcykpIHtcblx0XHRcdFx0Zm9yIChkID1cblx0XHRcdFx0XHRcdCAwOyBkIDwgYy5sZW5ndGg7IGQrKykge1xuXHRcdFx0XHRcdGUgPSBjW2RdLCBlIGluc3RhbmNlb2YgRWxlbWVudCAmJiB4KGIsIGUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdGEucmVwbGFjZVdpdGggPSBmdW5jdGlvbiAoYSkge1xuXHRcdFx0Zm9yICh2YXIgYyA9IFtdLCBkID0gMDsgZCA8IGFyZ3VtZW50cy5sZW5ndGg7ICsrZCkge1xuXHRcdFx0XHRjW2QgLSAwXSA9IGFyZ3VtZW50c1tkXTtcblx0XHRcdH1cblx0XHRcdHZhciBkID0gYy5maWx0ZXIoZnVuY3Rpb24gKGEpIHtcblx0XHRcdFx0cmV0dXJuIGEgaW5zdGFuY2VvZiBOb2RlICYmIGwoYSlcblx0XHRcdH0pLCBlID0gbCh0aGlzKTtcblx0XHRcdGxhLmFwcGx5KHRoaXMsIGMpO1xuXHRcdFx0Zm9yICh2YXIgZiA9IDA7IGYgPCBkLmxlbmd0aDsgZisrKSB7XG5cdFx0XHRcdHooYiwgZFtmXSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZSkge1xuXHRcdFx0XHRmb3IgKHooYiwgdGhpcyksIGQgPSAwOyBkIDwgYy5sZW5ndGg7IGQrKykge1xuXHRcdFx0XHRcdGUgPSBjW2RdLCBlIGluc3RhbmNlb2YgRWxlbWVudCAmJiB4KGIsIGUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdGEucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGEgPSBsKHRoaXMpO1xuXHRcdFx0bWEuY2FsbCh0aGlzKTtcblx0XHRcdGEgJiYgeihiLCB0aGlzKVxuXHRcdH1cblx0fTtcblx0ZnVuY3Rpb24gdGEoKSB7XG5cdFx0dmFyIGIgPSBZO1xuXG5cdFx0ZnVuY3Rpb24gYShhLCBjKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoYSwgXCJpbm5lckhUTUxcIiwge1xuXHRcdFx0XHRlbnVtZXJhYmxlOiBjLmVudW1lcmFibGUsXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogITAsXG5cdFx0XHRcdGdldDogYy5nZXQsXG5cdFx0XHRcdHNldDogZnVuY3Rpb24gKGEpIHtcblx0XHRcdFx0XHR2YXIgZCA9IHRoaXMsIGUgPSB2b2lkIDA7XG5cdFx0XHRcdFx0bCh0aGlzKSAmJiAoZSA9IFtdLCBuKHRoaXMsIGZ1bmN0aW9uIChhKSB7XG5cdFx0XHRcdFx0XHRhICE9PSBkICYmIGUucHVzaChhKVxuXHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHRjLnNldC5jYWxsKHRoaXMsIGEpO1xuXHRcdFx0XHRcdGlmIChlKSB7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBmID0gMDsgZiA8IGUubGVuZ3RoOyBmKyspIHtcblx0XHRcdFx0XHRcdFx0dmFyIGggPSBlW2ZdO1xuXHRcdFx0XHRcdFx0XHQxID09PSBoLl9fQ0Vfc3RhdGUgJiYgYi5kaXNjb25uZWN0ZWRDYWxsYmFjayhoKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLm93bmVyRG9jdW1lbnQuX19DRV9oYXNSZWdpc3RyeSA/IEEoYiwgdGhpcykgOiB2KGIsIHRoaXMpO1xuXHRcdFx0XHRcdHJldHVybiBhXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZShhLCBjKSB7XG5cdFx0XHRxKGEsIFwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50XCIsIGZ1bmN0aW9uIChhLCBkKSB7XG5cdFx0XHRcdHZhciBlID0gbChkKTtcblx0XHRcdFx0YSA9IGMuY2FsbCh0aGlzLCBhLCBkKTtcblx0XHRcdFx0ZSAmJiB6KGIsIGQpO1xuXHRcdFx0XHRsKGEpICYmIHgoYiwgZCk7XG5cdFx0XHRcdHJldHVybiBhXG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdE0gPyBxKEVsZW1lbnQucHJvdG90eXBlLCBcImF0dGFjaFNoYWRvd1wiLCBmdW5jdGlvbiAoYSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fX0NFX3NoYWRvd1Jvb3QgPSBhID0gTS5jYWxsKHRoaXMsIGEpXG5cdFx0XHR9KSA6IGNvbnNvbGUud2FybihcIkN1c3RvbSBFbGVtZW50czogYEVsZW1lbnQjYXR0YWNoU2hhZG93YCB3YXMgbm90IHBhdGNoZWQuXCIpO1xuXHRcdGlmIChOICYmIE4uZ2V0KSB7XG5cdFx0XHRhKEVsZW1lbnQucHJvdG90eXBlLCBOKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoVyAmJiBXLmdldCkge1xuXHRcdFx0YShIVE1MRWxlbWVudC5wcm90b3R5cGUsIFcpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHZhciBjID0gRi5jYWxsKGRvY3VtZW50LCBcImRpdlwiKTtcblx0XHRcdHQoYiwgZnVuY3Rpb24gKGIpIHtcblx0XHRcdFx0YShiLCB7XG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogITAsIGNvbmZpZ3VyYWJsZTogITAsIGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIEcuY2FsbCh0aGlzLCAhMCkuaW5uZXJIVE1MXG5cdFx0XHRcdFx0fSwgc2V0OiBmdW5jdGlvbiAoYSkge1xuXHRcdFx0XHRcdFx0dmFyIGIgPSBcInRlbXBsYXRlXCIgPT09IHRoaXMubG9jYWxOYW1lID8gdGhpcy5jb250ZW50IDogdGhpcztcblx0XHRcdFx0XHRcdGZvciAoYy5pbm5lckhUTUwgPSBhOyAwIDwgYi5jaGlsZE5vZGVzLmxlbmd0aDspIHtcblx0XHRcdFx0XHRcdFx0Si5jYWxsKGIsXG5cdFx0XHRcdFx0XHRcdFx0Yi5jaGlsZE5vZGVzWzBdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGZvciAoOyAwIDwgYy5jaGlsZE5vZGVzLmxlbmd0aDspIHtcblx0XHRcdFx0XHRcdFx0SC5jYWxsKGIsIGMuY2hpbGROb2Rlc1swXSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHRcdH1cblx0XHRxKEVsZW1lbnQucHJvdG90eXBlLCBcInNldEF0dHJpYnV0ZVwiLCBmdW5jdGlvbiAoYSwgYykge1xuXHRcdFx0aWYgKDEgIT09IHRoaXMuX19DRV9zdGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gUS5jYWxsKHRoaXMsIGEsIGMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGQgPSBPLmNhbGwodGhpcywgYSk7XG5cdFx0XHRRLmNhbGwodGhpcywgYSwgYyk7XG5cdFx0XHRjID0gTy5jYWxsKHRoaXMsIGEpO1xuXHRcdFx0ZCAhPT0gYyAmJiBiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLCBhLCBkLCBjLCBudWxsKVxuXHRcdH0pO1xuXHRcdHEoRWxlbWVudC5wcm90b3R5cGUsIFwic2V0QXR0cmlidXRlTlNcIiwgZnVuY3Rpb24gKGEsIGMsIGUpIHtcblx0XHRcdGlmICgxICE9PSB0aGlzLl9fQ0Vfc3RhdGUpIHtcblx0XHRcdFx0cmV0dXJuIFQuY2FsbCh0aGlzLCBhLCBjLCBlKTtcblx0XHRcdH1cblx0XHRcdHZhciBkID0gUy5jYWxsKHRoaXMsIGEsIGMpO1xuXHRcdFx0VC5jYWxsKHRoaXMsIGEsIGMsIGUpO1xuXHRcdFx0ZSA9IFMuY2FsbCh0aGlzLCBhLCBjKTtcblx0XHRcdGQgIT09IGUgJiYgYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcywgYywgZCwgZSwgYSlcblx0XHR9KTtcblx0XHRxKEVsZW1lbnQucHJvdG90eXBlLFxuXHRcdFx0XCJyZW1vdmVBdHRyaWJ1dGVcIiwgZnVuY3Rpb24gKGEpIHtcblx0XHRcdFx0aWYgKDEgIT09IHRoaXMuX19DRV9zdGF0ZSkge1xuXHRcdFx0XHRcdHJldHVybiBSLmNhbGwodGhpcywgYSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGMgPSBPLmNhbGwodGhpcywgYSk7XG5cdFx0XHRcdFIuY2FsbCh0aGlzLCBhKTtcblx0XHRcdFx0bnVsbCAhPT0gYyAmJiBiLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLCBhLCBjLCBudWxsLCBudWxsKVxuXHRcdFx0fSk7XG5cdFx0cShFbGVtZW50LnByb3RvdHlwZSwgXCJyZW1vdmVBdHRyaWJ1dGVOU1wiLCBmdW5jdGlvbiAoYSwgYykge1xuXHRcdFx0aWYgKDEgIT09IHRoaXMuX19DRV9zdGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gVS5jYWxsKHRoaXMsIGEsIGMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGQgPSBTLmNhbGwodGhpcywgYSwgYyk7XG5cdFx0XHRVLmNhbGwodGhpcywgYSwgYyk7XG5cdFx0XHR2YXIgZSA9IFMuY2FsbCh0aGlzLCBhLCBjKTtcblx0XHRcdGQgIT09IGUgJiYgYi5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sodGhpcywgYywgZCwgZSwgYSlcblx0XHR9KTtcblx0XHRYID8gZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIFgpIDogViA/IGUoRWxlbWVudC5wcm90b3R5cGUsIFYpIDogY29uc29sZS53YXJuKFwiQ3VzdG9tIEVsZW1lbnRzOiBgRWxlbWVudCNpbnNlcnRBZGphY2VudEVsZW1lbnRgIHdhcyBub3QgcGF0Y2hlZC5cIik7XG5cdFx0cGEoYiwgRWxlbWVudC5wcm90b3R5cGUsIHtpOiBoYSwgYXBwZW5kOiBpYX0pO1xuXHRcdHNhKGIpXG5cdH07XG5cdC8qXG5cblx0IENvcHlyaWdodCAoYykgMjAxNiBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cdCBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG5cdCBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuXHQgVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG5cdCBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuXHQgc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcblx0ICovXG5cdHZhciBaID0gd2luZG93LmN1c3RvbUVsZW1lbnRzO1xuXHRpZiAoIVogfHwgWi5mb3JjZVBvbHlmaWxsIHx8IFwiZnVuY3Rpb25cIiAhPSB0eXBlb2YgWi5kZWZpbmUgfHwgXCJmdW5jdGlvblwiICE9IHR5cGVvZiBaLmdldCkge1xuXHRcdHZhciBZID0gbmV3IHI7XG5cdFx0b2EoKTtcblx0XHRxYSgpO1xuXHRcdHJhKCk7XG5cdFx0dGEoKTtcblx0XHRkb2N1bWVudC5fX0NFX2hhc1JlZ2lzdHJ5ID0gITA7XG5cdFx0dmFyIHVhID0gbmV3IEUoWSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgXCJjdXN0b21FbGVtZW50c1wiLCB7Y29uZmlndXJhYmxlOiAhMCwgZW51bWVyYWJsZTogITAsIHZhbHVlOiB1YX0pXG5cdH1cblx0O1xufSkuY2FsbChzZWxmKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3VzdG9tLWVsZW1lbnRzLm1pbi5qcy5tYXBcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNiBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuXG4vKipcbiAqIFRoaXMgc2hpbSBhbGxvd3MgZWxlbWVudHMgd3JpdHRlbiBpbiwgb3IgY29tcGlsZWQgdG8sIEVTNSB0byB3b3JrIG9uIG5hdGl2ZVxuICogaW1wbGVtZW50YXRpb25zIG9mIEN1c3RvbSBFbGVtZW50cy5cbiAqXG4gKiBFUzUtc3R5bGUgY2xhc3NlcyBkb24ndCB3b3JrIHdpdGggbmF0aXZlIEN1c3RvbSBFbGVtZW50cyBiZWNhdXNlIHRoZVxuICogSFRNTEVsZW1lbnQgY29uc3RydWN0b3IgdXNlcyB0aGUgdmFsdWUgb2YgYG5ldy50YXJnZXRgIHRvIGxvb2sgdXAgdGhlIGN1c3RvbVxuICogZWxlbWVudCBkZWZpbml0aW9uIGZvciB0aGUgY3VycmVudGx5IGNhbGxlZCBjb25zdHJ1Y3Rvci4gYG5ldy50YXJnZXRgIGlzIG9ubHlcbiAqIHNldCB3aGVuIGBuZXdgIGlzIGNhbGxlZCBhbmQgaXMgb25seSBwcm9wYWdhdGVkIHZpYSBzdXBlcigpIGNhbGxzLiBzdXBlcigpXG4gKiBpcyBub3QgZW11bGF0YWJsZSBpbiBFUzUuIFRoZSBwYXR0ZXJuIG9mIGBTdXBlckNsYXNzLmNhbGwodGhpcylgYCBvbmx5IHdvcmtzXG4gKiB3aGVuIGV4dGVuZGluZyBvdGhlciBFUzUtc3R5bGUgY2xhc3NlcywgYW5kIGRvZXMgbm90IHByb3BhZ2F0ZSBgbmV3LnRhcmdldGAuXG4gKlxuICogVGhpcyBzaGltIGFsbG93cyB0aGUgbmF0aXZlIEhUTUxFbGVtZW50IGNvbnN0cnVjdG9yIHRvIHdvcmsgYnkgZ2VuZXJhdGluZyBhbmRcbiAqIHJlZ2lzdGVyaW5nIGEgc3RhbmQtaW4gY2xhc3MgaW5zdGVhZCBvZiB0aGUgdXNlcnMgY3VzdG9tIGVsZW1lbnQgY2xhc3MuIFRoaXNcbiAqIHN0YW5kLWluIGNsYXNzJ3MgY29uc3RydWN0b3IgaGFzIGFuIGFjdHVhbCBjYWxsIHRvIHN1cGVyKCkuXG4gKiBgY3VzdG9tRWxlbWVudHMuZGVmaW5lKClgIGFuZCBgY3VzdG9tRWxlbWVudHMuZ2V0KClgIGFyZSBib3RoIG92ZXJyaWRkZW4gdG9cbiAqIGhpZGUgdGhpcyBzdGFuZC1pbiBjbGFzcyBmcm9tIHVzZXJzLlxuICpcbiAqIEluIG9yZGVyIHRvIGNyZWF0ZSBpbnN0YW5jZSBvZiB0aGUgdXNlci1kZWZpbmVkIGNsYXNzLCByYXRoZXIgdGhhbiB0aGUgc3RhbmRcbiAqIGluLCB0aGUgc3RhbmQtaW4ncyBjb25zdHJ1Y3RvciBzd2l6emxlcyBpdHMgaW5zdGFuY2VzIHByb3RvdHlwZSBhbmQgaW52b2tlc1xuICogdGhlIHVzZXItZGVmaW5lZCBjb25zdHJ1Y3Rvci4gV2hlbiB0aGUgdXNlci1kZWZpbmVkIGNvbnN0cnVjdG9yIGlzIGNhbGxlZFxuICogZGlyZWN0bHkgaXQgY3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgc3RhbmQtaW4gY2xhc3MgdG8gZ2V0IGEgcmVhbCBleHRlbnNpb25cbiAqIG9mIEhUTUxFbGVtZW50IGFuZCByZXR1cm5zIHRoYXQuXG4gKlxuICogVGhlcmUgYXJlIHR3byBpbXBvcnRhbnQgY29uc3RydWN0b3JzOiBBIHBhdGNoZWQgSFRNTEVsZW1lbnQgY29uc3RydWN0b3IsIGFuZFxuICogdGhlIFN0YW5kSW5FbGVtZW50IGNvbnN0cnVjdG9yLiBUaGV5IGJvdGggd2lsbCBiZSBjYWxsZWQgdG8gY3JlYXRlIGFuIGVsZW1lbnRcbiAqIGJ1dCB3aGljaCBpcyBjYWxsZWQgZmlyc3QgZGVwZW5kcyBvbiB3aGV0aGVyIHRoZSBicm93c2VyIGNyZWF0ZXMgdGhlIGVsZW1lbnRcbiAqIG9yIHRoZSB1c2VyLWRlZmluZWQgY29uc3RydWN0b3IgaXMgY2FsbGVkIGRpcmVjdGx5LiBUaGUgdmFyaWFibGVzXG4gKiBgYnJvd3NlckNvbnN0cnVjdGlvbmAgYW5kIGB1c2VyQ29uc3RydWN0aW9uYCBjb250cm9sIHRoZSBmbG93IGJldHdlZW4gdGhlXG4gKiB0d28gY29uc3RydWN0b3JzLlxuICpcbiAqIFRoaXMgc2hpbSBzaG91bGQgYmUgYmV0dGVyIHRoYW4gZm9yY2luZyB0aGUgcG9seWZpbGwgYmVjYXVzZTpcbiAqICAgMS4gSXQncyBzbWFsbGVyXG4gKiAgIDIuIEFsbCByZWFjdGlvbiB0aW1pbmdzIGFyZSB0aGUgc2FtZSBhcyBuYXRpdmUgKG1vc3RseSBzeW5jaHJvbm91cylcbiAqICAgMy4gQWxsIHJlYWN0aW9uIHRyaWdnZXJpbmcgRE9NIG9wZXJhdGlvbnMgYXJlIGF1dG9tYXRpY2FsbHkgc3VwcG9ydGVkXG4gKlxuICogVGhlcmUgYXJlIHNvbWUgcmVzdHJpY3Rpb25zIGFuZCByZXF1aXJlbWVudHMgb24gRVM1IGNvbnN0cnVjdG9yczpcbiAqICAgMS4gQWxsIGNvbnN0cnVjdG9ycyBpbiBhIGluaGVyaXRhbmNlIGhpZXJhcmNoeSBtdXN0IGJlIEVTNS1zdHlsZSwgc28gdGhhdFxuICogICAgICB0aGV5IGNhbiBiZSBjYWxsZWQgd2l0aCBGdW5jdGlvbi5jYWxsKCkuIFRoaXMgZWZmZWN0aXZlbHkgbWVhbnMgdGhhdCB0aGVcbiAqICAgICAgd2hvbGUgYXBwbGljYXRpb24gbXVzdCBiZSBjb21waWxlZCB0byBFUzUuXG4gKiAgIDIuIENvbnN0cnVjdG9ycyBtdXN0IHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGVtdWxhdGVkIHN1cGVyKCkgY2FsbC4gTGlrZVxuICogICAgICBgcmV0dXJuIFN1cGVyQ2xhc3MuY2FsbCh0aGlzKWBcbiAqICAgMy4gVGhlIGB0aGlzYCByZWZlcmVuY2Ugc2hvdWxkIG5vdCBiZSB1c2VkIGJlZm9yZSB0aGUgZW11bGF0ZWQgc3VwZXIoKSBjYWxsXG4gKiAgICAgIGp1c3QgbGlrZSBgdGhpc2AgaXMgaWxsZWdhbCB0byB1c2UgYmVmb3JlIHN1cGVyKCkgaW4gRVM2LlxuICogICA0LiBDb25zdHJ1Y3RvcnMgc2hvdWxkIG5vdCBjcmVhdGUgb3RoZXIgY3VzdG9tIGVsZW1lbnRzIGJlZm9yZSB0aGUgZW11bGF0ZWRcbiAqICAgICAgc3VwZXIoKSBjYWxsLiBUaGlzIGlzIHRoZSBzYW1lIHJlc3RyaWN0aW9uIGFzIHdpdGggbmF0aXZlIGN1c3RvbVxuICogICAgICBlbGVtZW50cy5cbiAqXG4gKiAgQ29tcGlsaW5nIHZhbGlkIGNsYXNzLWJhc2VkIGN1c3RvbSBlbGVtZW50cyB0byBFUzUgd2lsbCBzYXRpc2Z5IHRoZXNlXG4gKiAgcmVxdWlyZW1lbnRzIHdpdGggdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIHBvcHVsYXIgdHJhbnNwaWxlcnMuXG4gKi9cbigoKSA9PiB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBEbyBub3RoaW5nIGlmIGBjdXN0b21FbGVtZW50c2AgZG9lcyBub3QgZXhpc3QuXG4gIGlmICghd2luZG93LmN1c3RvbUVsZW1lbnRzKSByZXR1cm47XG5cbiAgY29uc3QgTmF0aXZlSFRNTEVsZW1lbnQgPSB3aW5kb3cuSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IG5hdGl2ZURlZmluZSA9IHdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmU7XG4gIGNvbnN0IG5hdGl2ZUdldCA9IHdpbmRvdy5jdXN0b21FbGVtZW50cy5nZXQ7XG5cbiAgLyoqXG4gICAqIE1hcCBvZiB1c2VyLXByb3ZpZGVkIGNvbnN0cnVjdG9ycyB0byB0YWcgbmFtZXMuXG4gICAqXG4gICAqIEB0eXBlIHtNYXA8RnVuY3Rpb24sIHN0cmluZz59XG4gICAqL1xuICBjb25zdCB0YWduYW1lQnlDb25zdHJ1Y3RvciA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogTWFwIG9mIHRhZyBuYW1lcyB0byB1c2VyLXByb3ZpZGVkIGNvbnN0cnVjdG9ycy5cbiAgICpcbiAgICogQHR5cGUge01hcDxzdHJpbmcsIEZ1bmN0aW9uPn1cbiAgICovXG4gIGNvbnN0IGNvbnN0cnVjdG9yQnlUYWduYW1lID0gbmV3IE1hcCgpO1xuXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNvbnN0cnVjdG9ycyBhcmUgYmVpbmcgY2FsbGVkIGJ5IGEgYnJvd3NlciBwcm9jZXNzLCBpZSBwYXJzaW5nXG4gICAqIG9yIGNyZWF0ZUVsZW1lbnQuXG4gICAqL1xuICBsZXQgYnJvd3NlckNvbnN0cnVjdGlvbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjb25zdHJ1Y3RvcnMgYXJlIGJlaW5nIGNhbGxlZCBieSBhIHVzZXItc3BhY2UgcHJvY2VzcywgaWVcbiAgICogY2FsbGluZyBhbiBlbGVtZW50IGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgbGV0IHVzZXJDb25zdHJ1Y3Rpb24gPSBmYWxzZTtcblxuICB3aW5kb3cuSFRNTEVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWJyb3dzZXJDb25zdHJ1Y3Rpb24pIHtcbiAgICAgIGNvbnN0IHRhZ25hbWUgPSB0YWduYW1lQnlDb25zdHJ1Y3Rvci5nZXQodGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgICBjb25zdCBmYWtlQ2xhc3MgPSBuYXRpdmVHZXQuY2FsbCh3aW5kb3cuY3VzdG9tRWxlbWVudHMsIHRhZ25hbWUpO1xuXG4gICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgZmFrZSBjb25zdHJ1Y3RvciBkb2Vzbid0IGNhbGwgYmFjayB0byB0aGlzIGNvbnN0cnVjdG9yXG4gICAgICB1c2VyQ29uc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IChmYWtlQ2xhc3MpKCk7XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICAgIC8vIEVsc2UgZG8gbm90aGluZy4gVGhpcyB3aWxsIGJlIHJlYWNoZWQgYnkgRVM1LXN0eWxlIGNsYXNzZXMgZG9pbmdcbiAgICAvLyBIVE1MRWxlbWVudC5jYWxsKCkgZHVyaW5nIGluaXRpYWxpemF0aW9uXG4gICAgYnJvd3NlckNvbnN0cnVjdGlvbiA9IGZhbHNlO1xuICB9O1xuICAvLyBCeSBzZXR0aW5nIHRoZSBwYXRjaGVkIEhUTUxFbGVtZW50J3MgcHJvdG90eXBlIHByb3BlcnR5IHRvIHRoZSBuYXRpdmVcbiAgLy8gSFRNTEVsZW1lbnQncyBwcm90b3R5cGUgd2UgbWFrZSBzdXJlIHRoYXQ6XG4gIC8vICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICAvLyB3b3JrcyBiZWNhdXNlIGluc3RhbmNlb2YgdXNlcyBIVE1MRWxlbWVudC5wcm90b3R5cGUsIHdoaWNoIGlzIG9uIHRoZVxuICAvLyBwdG90b3R5cGUgY2hhaW4gb2YgYnVpbHQtaW4gZWxlbWVudHMuXG4gIHdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGUgPSBOYXRpdmVIVE1MRWxlbWVudC5wcm90b3R5cGU7XG5cbiAgd2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZSA9ICh0YWduYW1lLCBlbGVtZW50Q2xhc3MpID0+IHtcbiAgICBjb25zdCBlbGVtZW50UHJvdG8gPSBlbGVtZW50Q2xhc3MucHJvdG90eXBlO1xuICAgIGNvbnN0IFN0YW5kSW5FbGVtZW50ID0gY2xhc3MgZXh0ZW5kcyBOYXRpdmVIVE1MRWxlbWVudCB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gQ2FsbCB0aGUgbmF0aXZlIEhUTUxFbGVtZW50IGNvbnN0cnVjdG9yLCB0aGlzIGdpdmVzIHVzIHRoZVxuICAgICAgICAvLyB1bmRlci1jb25zdHJ1Y3Rpb24gaW5zdGFuY2UgYXMgYHRoaXNgOlxuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIC8vIFRoZSBwcm90b3R5cGUgd2lsbCBiZSB3cm9uZyB1cCBiZWNhdXNlIHRoZSBicm93c2VyIHVzZWQgb3VyIGZha2VcbiAgICAgICAgLy8gY2xhc3MsIHNvIGZpeCBpdDpcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIGVsZW1lbnRQcm90byk7XG5cbiAgICAgICAgaWYgKCF1c2VyQ29uc3RydWN0aW9uKSB7XG4gICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdXNlci1kZWZpbmVkIGNvbnN0cnVjdG9yIGJvdHRvbSdzIG91dCB0byBhIGRvLW5vdGhpbmdcbiAgICAgICAgICAvLyBIVE1MRWxlbWVudCgpIGNhbGxcbiAgICAgICAgICBicm93c2VyQ29uc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAvLyBDYWxsIHRoZSB1c2VyLWRlZmluZWQgY29uc3RydWN0b3Igb24gb3VyIGluc3RhbmNlOlxuICAgICAgICAgIGVsZW1lbnRDbGFzcy5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJDb25zdHJ1Y3Rpb24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHN0YW5kSW5Qcm90byA9IFN0YW5kSW5FbGVtZW50LnByb3RvdHlwZTtcbiAgICBTdGFuZEluRWxlbWVudC5vYnNlcnZlZEF0dHJpYnV0ZXMgPSBlbGVtZW50Q2xhc3Mub2JzZXJ2ZWRBdHRyaWJ1dGVzO1xuICAgIHN0YW5kSW5Qcm90by5jb25uZWN0ZWRDYWxsYmFjayA9IGVsZW1lbnRQcm90by5jb25uZWN0ZWRDYWxsYmFjaztcbiAgICBzdGFuZEluUHJvdG8uZGlzY29ubmVjdGVkQ2FsbGJhY2sgPSBlbGVtZW50UHJvdG8uZGlzY29ubmVjdGVkQ2FsbGJhY2s7XG4gICAgc3RhbmRJblByb3RvLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayA9IGVsZW1lbnRQcm90by5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s7XG4gICAgc3RhbmRJblByb3RvLmFkb3B0ZWRDYWxsYmFjayA9IGVsZW1lbnRQcm90by5hZG9wdGVkQ2FsbGJhY2s7XG5cbiAgICB0YWduYW1lQnlDb25zdHJ1Y3Rvci5zZXQoZWxlbWVudENsYXNzLCB0YWduYW1lKTtcbiAgICBjb25zdHJ1Y3RvckJ5VGFnbmFtZS5zZXQodGFnbmFtZSwgZWxlbWVudENsYXNzKTtcbiAgICBuYXRpdmVEZWZpbmUuY2FsbCh3aW5kb3cuY3VzdG9tRWxlbWVudHMsIHRhZ25hbWUsIFN0YW5kSW5FbGVtZW50KTtcbiAgfTtcblxuICB3aW5kb3cuY3VzdG9tRWxlbWVudHMuZ2V0ID0gKHRhZ25hbWUpID0+IGNvbnN0cnVjdG9yQnlUYWduYW1lLmdldCh0YWduYW1lKTtcblxufSkoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBjbGFzcy9jb21wb25lbnQgcnVsZXNcbi8vIGFsd2F5cyBjYWxsIHN1cGVyKCkgZmlyc3QgaW4gdGhlIGN0b3IuIFRoaXMgYWxzbyBjYWxscyB0aGUgZXh0ZW5kZWQgY2xhc3MnIGN0b3IuXG4vLyBjYW5ub3QgY2FsbCBORVcgb24gYSBDb21wb25lbnQgY2xhc3NcblxuLy8gQ2xhc3NlcyBodHRwOi8vZXhwbG9yaW5nanMuY29tL2VzNi9jaF9jbGFzc2VzLmh0bWwjX3RoZS1zcGVjaWVzLXBhdHRlcm4taW4tc3RhdGljLW1ldGhvZHNcblxucmVxdWlyZSgnLi9jdXN0b20tZWxlbWVudHMtc2hpbScpO1xuY29uc3Qgb24gPSByZXF1aXJlKCdvbicpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbmNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3VpZCA9IGRvbS51aWQodGhpcy5sb2NhbE5hbWUpO1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdID0ge0RPTVNUQVRFOiAnY3JlYXRlZCd9O1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QgPSBbXTtcbiAgICAgICAgcGx1Z2luKCdpbml0JywgdGhpcyk7XG4gICAgfVxuICAgIFxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Nvbm5lY3RlZCc7XG4gICAgICAgIHBsdWdpbigncHJlQ29ubmVjdGVkJywgdGhpcyk7XG4gICAgICAgIG5leHRUaWNrKG9uQ2hlY2tEb21SZWFkeS5iaW5kKHRoaXMpKTtcbiAgICAgICAgaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlyZSgnY29ubmVjdGVkJyk7XG4gICAgICAgIHBsdWdpbigncG9zdENvbm5lY3RlZCcsIHRoaXMpO1xuICAgIH1cblxuICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLkRPTVNUQVRFID0gJ2Rpc2Nvbm5lY3RlZCc7XG4gICAgICAgIHBsdWdpbigncHJlRGlzY29ubmVjdGVkJywgdGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmRpc2Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpcmUoJ2Rpc2Nvbm5lY3RlZCcpO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyTmFtZSwgb2xkVmFsLCBuZXdWYWwpIHtcbiAgICAgICAgcGx1Z2luKCdwcmVBdHRyaWJ1dGVDaGFuZ2VkJywgdGhpcywgYXR0ck5hbWUsIG5ld1ZhbCwgb2xkVmFsKTtcbiAgICAgICAgaWYgKHRoaXMuYXR0cmlidXRlQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVDaGFuZ2VkKGF0dHJOYW1lLCBuZXdWYWwsIG9sZFZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmZpcmUoJ2Rlc3Ryb3knKTtcbiAgICAgICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5oYW5kbGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgICAgICAgICAgaGFuZGxlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9tLmRlc3Ryb3kodGhpcyk7XG4gICAgfVxuXG4gICAgZmlyZShldmVudE5hbWUsIGV2ZW50RGV0YWlsLCBidWJibGVzKSB7XG4gICAgICAgIHJldHVybiBvbi5maXJlKHRoaXMsIGV2ZW50TmFtZSwgZXZlbnREZXRhaWwsIGJ1YmJsZXMpO1xuICAgIH1cblxuICAgIGVtaXQoZXZlbnROYW1lLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gb24uZW1pdCh0aGlzLCBldmVudE5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBvbihub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlckhhbmRsZShcbiAgICAgICAgICAgIHR5cGVvZiBub2RlICE9ICdzdHJpbmcnID8gLy8gbm8gbm9kZSBpcyBzdXBwbGllZFxuICAgICAgICAgICAgICAgIG9uKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG4gICAgICAgICAgICAgICAgb24odGhpcywgbm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvcikpO1xuICAgIH1cblxuICAgIG9uY2Uobm9kZSwgZXZlbnROYW1lLCBzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJIYW5kbGUoXG4gICAgICAgICAgICB0eXBlb2Ygbm9kZSAhPSAnc3RyaW5nJyA/IC8vIG5vIG5vZGUgaXMgc3VwcGxpZWRcbiAgICAgICAgICAgICAgICBvbi5vbmNlKG5vZGUsIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSA6XG4gICAgICAgICAgICAgICAgb24ub25jZSh0aGlzLCBub2RlLCBldmVudE5hbWUsIHNlbGVjdG9yLCBjYWxsYmFjaykpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVySGFuZGxlKGhhbmRsZSkge1xuICAgICAgICBwcml2YXRlc1t0aGlzLl91aWRdLmhhbmRsZUxpc3QucHVzaChoYW5kbGUpO1xuICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgIH1cblxuICAgIGdldCBET01TVEFURSgpIHtcbiAgICAgICAgcmV0dXJuIHByaXZhdGVzW3RoaXMuX3VpZF0uRE9NU1RBVEU7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsb25lKHRlbXBsYXRlKSB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZW50ICYmIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhclxuICAgICAgICAgICAgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgICAgIGNsb25lTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjbG9uZU5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuXG4gICAgICAgIHdoaWxlIChjbG9uZU5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNsb25lTm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZyYWc7XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZFBsdWdpbihwbHVnKSB7XG4gICAgICAgIHZhciBpLCBvcmRlciA9IHBsdWcub3JkZXIgfHwgMTAwO1xuICAgICAgICBpZiAoIXBsdWdpbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwbHVnaW5zLnB1c2gocGx1Zyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGx1Z2lucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGlmIChwbHVnaW5zWzBdLm9yZGVyIDw9IG9yZGVyKSB7XG4gICAgICAgICAgICAgICAgcGx1Z2lucy5wdXNoKHBsdWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBsdWdpbnNbMF0ub3JkZXIgPiBvcmRlcikge1xuICAgICAgICAgICAgcGx1Z2lucy51bnNoaWZ0KHBsdWcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChvcmRlciA9PT0gcGx1Z2luc1tpIC0gMV0ub3JkZXIgfHwgKG9yZGVyID4gcGx1Z2luc1tpIC0gMV0ub3JkZXIgJiYgb3JkZXIgPCBwbHVnaW5zW2ldLm9yZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW5zLnNwbGljZShpLCAwLCBwbHVnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHdhcyBub3QgaW5zZXJ0ZWQuLi5cbiAgICAgICAgICAgIHBsdWdpbnMucHVzaChwbHVnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubGV0XG4gICAgcHJpdmF0ZXMgPSB7fSxcbiAgICBwbHVnaW5zID0gW107XG5cbmZ1bmN0aW9uIHBsdWdpbihtZXRob2QsIG5vZGUsIGEsIGIsIGMpIHtcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWcpIHtcbiAgICAgICAgaWYgKHBsdWdbbWV0aG9kXSkge1xuICAgICAgICAgICAgcGx1Z1ttZXRob2RdKG5vZGUsIGEsIGIsIGMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uQ2hlY2tEb21SZWFkeSgpIHtcbiAgICBpZiAodGhpcy5ET01TVEFURSAhPSAnY29ubmVjdGVkJyB8fCBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhclxuICAgICAgICBjb3VudCA9IDAsXG4gICAgICAgIGNoaWxkcmVuID0gZ2V0Q2hpbGRDdXN0b21Ob2Rlcyh0aGlzKSxcbiAgICAgICAgb3VyRG9tUmVhZHkgPSBvbkRvbVJlYWR5LmJpbmQodGhpcyk7XG5cbiAgICBmdW5jdGlvbiBhZGRSZWFkeSgpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgaWYgKGNvdW50ID09IGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgb3VyRG9tUmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG5vIGNoaWxkcmVuLCB3ZSdyZSBnb29kIC0gbGVhZiBub2RlLiBDb21tZW5jZSB3aXRoIG9uRG9tUmVhZHlcbiAgICAvL1xuICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIG91ckRvbVJlYWR5KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBlbHNlLCB3YWl0IGZvciBhbGwgY2hpbGRyZW4gdG8gZmlyZSB0aGVpciBgcmVhZHlgIGV2ZW50c1xuICAgICAgICAvL1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgY2hpbGQgaXMgYWxyZWFkeSByZWFkeVxuICAgICAgICAgICAgaWYgKGNoaWxkLkRPTVNUQVRFID09ICdkb21yZWFkeScpIHtcbiAgICAgICAgICAgICAgICBhZGRSZWFkeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgbm90LCB3YWl0IGZvciBldmVudFxuICAgICAgICAgICAgY2hpbGQub24oJ2RvbXJlYWR5JywgYWRkUmVhZHkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9tUmVhZHkoKSB7XG4gICAgcHJpdmF0ZXNbdGhpcy5fdWlkXS5ET01TVEFURSA9ICdkb21yZWFkeSc7XG4gICAgLy8gZG9tUmVhZHkgc2hvdWxkIG9ubHkgZXZlciBmaXJlIG9uY2VcbiAgICBwcml2YXRlc1t0aGlzLl91aWRdLmRvbVJlYWR5RmlyZWQgPSB0cnVlO1xuICAgIHBsdWdpbigncHJlRG9tUmVhZHknLCB0aGlzKTtcbiAgICAvLyBjYWxsIHRoaXMuZG9tUmVhZHkgZmlyc3QsIHNvIHRoYXQgdGhlIGNvbXBvbmVudFxuICAgIC8vIGNhbiBmaW5pc2ggaW5pdGlhbGl6aW5nIGJlZm9yZSBmaXJpbmcgYW55XG4gICAgLy8gc3Vic2VxdWVudCBldmVudHNcbiAgICBpZiAodGhpcy5kb21SZWFkeSkge1xuICAgICAgICB0aGlzLmRvbVJlYWR5KCk7XG4gICAgICAgIHRoaXMuZG9tUmVhZHkgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLmZpcmUoJ2RvbXJlYWR5Jyk7XG5cbiAgICBwbHVnaW4oJ3Bvc3REb21SZWFkeScsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZEN1c3RvbU5vZGVzKG5vZGUpIHtcbiAgICAvLyBjb2xsZWN0IGFueSBjaGlsZHJlbiB0aGF0IGFyZSBjdXN0b20gbm9kZXNcbiAgICAvLyB1c2VkIHRvIGNoZWNrIGlmIHRoZWlyIGRvbSBpcyByZWFkeSBiZWZvcmVcbiAgICAvLyBkZXRlcm1pbmluZyBpZiB0aGlzIGlzIHJlYWR5XG4gICAgdmFyIGksIG5vZGVzID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW5baV0ubm9kZU5hbWUuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZS5jaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBuZXh0VGljayhjYikge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYik7XG59XG5cbndpbmRvdy5vbkRvbVJlYWR5ID0gZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgZnVuY3Rpb24gb25SZWFkeSAoKSB7XG4gICAgICAgIGNhbGxiYWNrKG5vZGUpO1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RvbXJlYWR5Jywgb25SZWFkeSk7XG4gICAgfVxuICAgIGlmKG5vZGUuRE9NU1RBVEUgPT09ICdkb21yZWFkeScpe1xuICAgICAgICBjYWxsYmFjayhub2RlKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb21yZWFkeScsIG9uUmVhZHkpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNvbXBvbmVudDsiLCJyZXF1aXJlKCdAd2ViY29tcG9uZW50cy9jdXN0b20tZWxlbWVudHMvc3JjL25hdGl2ZS1zaGltJyk7XG5yZXF1aXJlKCdAd2ViY29tcG9uZW50cy9jdXN0b20tZWxlbWVudHMvY3VzdG9tLWVsZW1lbnRzLm1pbicpOyIsImNvbnN0IEJhc2VDb21wb25lbnQgPSByZXF1aXJlKCcuL0Jhc2VDb21wb25lbnQnKTtcbmNvbnN0IGRvbSA9IHJlcXVpcmUoJ2RvbScpO1xuY29uc3QgYWxwaGFiZXQgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0KCcnKTtcbmNvbnN0IHIgPSAvXFx7XFx7XFx3Kn19L2c7XG5cbi8vIFRPRE86IHN3aXRjaCB0byBFUzYgbGl0ZXJhbHM/IE1heWJlIG5vdC4uLlxuXG4vLyBGSVhNRTogdGltZSBjdXJyZW50IHByb2Nlc3Ncbi8vIFRyeSBhIG5ldyBvbmUgd2hlcmUgbWV0YSBkYXRhIGlzIGNyZWF0ZWQsIGluc3RlYWQgb2YgYSB0ZW1wbGF0ZVxuXG5mdW5jdGlvbiBjcmVhdGVDb25kaXRpb24obmFtZSwgdmFsdWUpIHtcbiAgICAvLyBGSVhNRSBuYW1lP1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyLCBmdW5jdGlvbiAodykge1xuICAgICAgICB3ID0gdy5yZXBsYWNlKCd7eycsICcnKS5yZXBsYWNlKCd9fScsICcnKTtcbiAgICAgICAgcmV0dXJuICdpdGVtW1wiJyArIHcgKyAnXCJdJztcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZygnY3JlYXRlQ29uZGl0aW9uJywgbmFtZSwgdmFsdWUpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gZXZhbCh2YWx1ZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gd2Fsa0RvbShub2RlLCByZWZzKSB7XG5cbiAgICBsZXQgaXRlbSA9IHtcbiAgICAgICAgbm9kZTogbm9kZVxuICAgIH07XG5cbiAgICByZWZzLm5vZGVzLnB1c2goaXRlbSk7XG5cbiAgICBpZiAobm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXRcbiAgICAgICAgICAgICAgICBuYW1lID0gbm9kZS5hdHRyaWJ1dGVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBub2RlLmF0dHJpYnV0ZXNbaV0udmFsdWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnICAnLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2lmJykge1xuICAgICAgICAgICAgICAgIGl0ZW0uY29uZGl0aW9uYWwgPSBjcmVhdGVDb25kaXRpb24obmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoL1xce1xcey8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAvLyA8ZGl2IGlkPVwie3tpZH19XCI+XG4gICAgICAgICAgICAgICAgcmVmcy5hdHRyaWJ1dGVzID0gcmVmcy5hdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICAgICAgICAgIGl0ZW0uYXR0cmlidXRlcyA9IGl0ZW0uYXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBjb3VsZCBiZSBtb3JlIHRoYW4gb25lPz9cbiAgICAgICAgICAgICAgICAvLyBzYW1lIHdpdGggbm9kZT9cbiAgICAgICAgICAgICAgICByZWZzLmF0dHJpYnV0ZXNbbmFtZV0gPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2hvdWxkIHByb2JhYmx5IGxvb3Agb3ZlciBjaGlsZE5vZGVzIGFuZCBjaGVjayB0ZXh0IG5vZGVzIGZvciByZXBsYWNlbWVudHNcbiAgICAvL1xuICAgIGlmICghbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKC9cXHtcXHsvLnRlc3Qobm9kZS5pbm5lckhUTUwpKSB7XG4gICAgICAgICAgICAvLyBGSVhNRSAtIGlubmVySFRNTCBhcyB2YWx1ZSB0b28gbmFpdmVcbiAgICAgICAgICAgIGxldCBwcm9wID0gbm9kZS5pbm5lckhUTUwucmVwbGFjZSgne3snLCAnJykucmVwbGFjZSgnfX0nLCAnJyk7XG4gICAgICAgICAgICBpdGVtLnRleHQgPSBpdGVtLnRleHQgfHwge307XG4gICAgICAgICAgICBpdGVtLnRleHRbcHJvcF0gPSBub2RlLmlubmVySFRNTDtcbiAgICAgICAgICAgIHJlZnNbcHJvcF0gPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgd2Fsa0RvbShub2RlLmNoaWxkcmVuW2ldLCByZWZzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUl0ZW1UZW1wbGF0ZShmcmFnKSB7XG4gICAgbGV0IHJlZnMgPSB7XG4gICAgICAgIG5vZGVzOiBbXVxuICAgIH07XG4gICAgd2Fsa0RvbShmcmFnLCByZWZzKTtcbiAgICByZXR1cm4gcmVmcztcbn1cblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyTGlzdCA9IGZ1bmN0aW9uIChpdGVtcywgY29udGFpbmVyLCBpdGVtVGVtcGxhdGUpIHtcbiAgICBsZXRcbiAgICAgICAgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgdG1wbCA9IGl0ZW1UZW1wbGF0ZSB8fCB0aGlzLml0ZW1UZW1wbGF0ZSxcbiAgICAgICAgcmVmcyA9IHRtcGwuaXRlbVJlZnMsXG4gICAgICAgIGNsb25lLFxuICAgICAgICBkZWZlcjtcblxuICAgIGZ1bmN0aW9uIHdhcm4obmFtZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVmZXIpO1xuICAgICAgICBkZWZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdBdHRlbXB0ZWQgdG8gc2V0IGF0dHJpYnV0ZSBmcm9tIG5vbi1leGlzdGVudCBpdGVtIHByb3BlcnR5OicsIG5hbWUpO1xuICAgICAgICB9LCAxKTtcbiAgICB9XG5cbiAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cbiAgICAgICAgbGV0XG4gICAgICAgICAgICBpZkNvdW50ID0gMCxcbiAgICAgICAgICAgIGRlbGV0aW9ucyA9IFtdO1xuXG4gICAgICAgIHJlZnMubm9kZXMuZm9yRWFjaChmdW5jdGlvbiAocmVmKSB7XG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBjYW4ndCBzd2FwIGJlY2F1c2UgdGhlIGlubmVySFRNTCBpcyBiZWluZyBjaGFuZ2VkXG4gICAgICAgICAgICAvLyBjYW4ndCBjbG9uZSBiZWNhdXNlIHRoZW4gdGhlcmUgaXMgbm90IGEgbm9kZSByZWZlcmVuY2VcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICBsZXRcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICBub2RlID0gcmVmLm5vZGUsXG4gICAgICAgICAgICAgICAgaGFzTm9kZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAocmVmLmNvbmRpdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWYuY29uZGl0aW9uYWwoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzTm9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZkNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbid0IGFjdHVhbGx5IGRlbGV0ZSwgYmVjYXVzZSB0aGlzIGlzIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkLCBhZGRpbmcgYXR0cmlidXRlIHRvIHRyYWNrIG5vZGUsIHRvIGJlIGRlbGV0ZWQgaW4gY2xvbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBhZnRlciwgcmVtb3ZlIHRlbXBvcmFyeSBhdHRyaWJ1dGUgZnJvbSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICByZWYubm9kZS5zZXRBdHRyaWJ1dGUoJ2lmcycsIGlmQ291bnQrJycpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGlvbnMucHVzaCgnW2lmcz1cIicraWZDb3VudCsnXCJdJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc05vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVmLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVmLmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWYuYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmLm5vZGUuc2V0QXR0cmlidXRlKGtleSwgaXRlbVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N3YXAgYXR0Jywga2V5LCB2YWx1ZSwgcmVmLm5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlZi50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHJlZi50ZXh0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVmLnRleHRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3N3YXAgdGV4dCcsIGtleSwgaXRlbVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gdmFsdWUucmVwbGFjZSh2YWx1ZSwgaXRlbVtrZXldKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNsb25lID0gdG1wbC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgZGVsZXRpb25zLmZvckVhY2goZnVuY3Rpb24gKGRlbCkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBjbG9uZS5xdWVyeVNlbGVjdG9yKGRlbCk7XG4gICAgICAgICAgICBpZihub2RlKSB7XG4gICAgICAgICAgICAgICAgZG9tLmRlc3Ryb3kobm9kZSk7XG4gICAgICAgICAgICAgICAgbGV0IHRtcGxOb2RlID0gdG1wbC5xdWVyeVNlbGVjdG9yKGRlbCk7XG4gICAgICAgICAgICAgICAgdG1wbE5vZGUucmVtb3ZlQXR0cmlidXRlKCdpZnMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZyk7XG5cbiAgICAvL2l0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAvLyAgICBPYmplY3Qua2V5cyhpdGVtKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvLyAgICAgICAgaWYocmVmc1trZXldKXtcbiAgICAvLyAgICAgICAgICAgIHJlZnNba2V5XS5pbm5lckhUTUwgPSBpdGVtW2tleV07XG4gICAgLy8gICAgICAgIH1cbiAgICAvLyAgICB9KTtcbiAgICAvLyAgICBpZihyZWZzLmF0dHJpYnV0ZXMpe1xuICAgIC8vICAgICAgICBPYmplY3Qua2V5cyhyZWZzLmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAvLyAgICAgICAgICAgIGxldCBub2RlID0gcmVmcy5hdHRyaWJ1dGVzW25hbWVdO1xuICAgIC8vICAgICAgICAgICAgaWYoaXRlbVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgaXRlbVtuYW1lXSk7XG4gICAgLy8gICAgICAgICAgICB9ZWxzZXtcbiAgICAvLyAgICAgICAgICAgICAgICB3YXJuKG5hbWUpO1xuICAgIC8vICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICB9KTtcbiAgICAvLyAgICB9XG4gICAgLy9cbiAgICAvLyAgICBjbG9uZSA9IHRtcGwuY2xvbmVOb2RlKHRydWUpO1xuICAgIC8vICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgIC8vfSk7XG5cbiAgICAvL2NvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnKTtcbn07XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAnaXRlbS10ZW1wbGF0ZScsXG4gICAgb3JkZXI6IDQwLFxuICAgIHByZURvbVJlYWR5OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZSA9IGRvbS5xdWVyeShub2RlLCAndGVtcGxhdGUnKTtcbiAgICAgICAgaWYgKG5vZGUuaXRlbVRlbXBsYXRlKSB7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUuaXRlbVRlbXBsYXRlKTtcbiAgICAgICAgICAgIG5vZGUuaXRlbVRlbXBsYXRlID0gQmFzZUNvbXBvbmVudC5jbG9uZShub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgICAgICBub2RlLml0ZW1UZW1wbGF0ZS5pdGVtUmVmcyA9IHVwZGF0ZUl0ZW1UZW1wbGF0ZShub2RlLml0ZW1UZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuY29uc3QgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbmZ1bmN0aW9uIHNldEJvb2xlYW4gKG5vZGUsIHByb3ApIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobm9kZSwgcHJvcCwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgaWYobm9kZS5oYXNBdHRyaWJ1dGUocHJvcCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkb20ubm9ybWFsaXplKG5vZGUuZ2V0QXR0cmlidXRlKHByb3ApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYodmFsdWUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKHByb3AsICcnKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnR5IChub2RlLCBwcm9wKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vZGUsIHByb3AsIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiBkb20ubm9ybWFsaXplKHRoaXMuZ2V0QXR0cmlidXRlKHByb3ApKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUocHJvcCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXMgKG5vZGUpIHtcbiAgICBsZXQgcHJvcHMgPSBub2RlLnByb3BzIHx8IG5vZGUucHJvcGVydGllcztcbiAgICBpZihwcm9wcykge1xuICAgICAgICBwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICBpZihwcm9wID09PSAnZGlzYWJsZWQnKXtcbiAgICAgICAgICAgICAgICBzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBzZXRQcm9wZXJ0eShub2RlLCBwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRCb29sZWFucyAobm9kZSkge1xuICAgIGxldCBwcm9wcyA9IG5vZGUuYm9vbHMgfHwgbm9kZS5ib29sZWFucztcbiAgICBpZihwcm9wcykge1xuICAgICAgICBwcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgICAgICAgICBzZXRCb29sZWFuKG5vZGUsIHByb3ApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAncHJvcGVydGllcycsXG4gICAgb3JkZXI6IDEwLFxuICAgIGluaXQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHNldFByb3BlcnRpZXMobm9kZSk7XG4gICAgICAgIHNldEJvb2xlYW5zKG5vZGUpO1xuICAgIH0sXG4gICAgcHJlQXR0cmlidXRlQ2hhbmdlZDogZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRoaXNbbmFtZV0gPSBkb20ubm9ybWFsaXplKHZhbHVlKTtcbiAgICAgICAgaWYoIXZhbHVlICYmIChub2RlLmJvb2xzIHx8IG5vZGUuYm9vbGVhbnMgfHwgW10pLmluZGV4T2YobmFtZSkpe1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4vQmFzZUNvbXBvbmVudCcpO1xuXG5mdW5jdGlvbiBhc3NpZ25SZWZzIChub2RlKSB7XG4gICAgZG9tLnF1ZXJ5QWxsKG5vZGUsICdbcmVmXScpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhciBuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGNoaWxkO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhc3NpZ25FdmVudHMgKG5vZGUpIHtcbiAgICAvLyA8ZGl2IG9uPVwiY2xpY2s6b25DbGlja1wiPlxuICAgIGRvbS5xdWVyeUFsbChub2RlLCAnW29uXScpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAga2V5VmFsdWUgPSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ29uJyksXG4gICAgICAgICAgICBldmVudCA9IGtleVZhbHVlLnNwbGl0KCc6JylbMF0udHJpbSgpLFxuICAgICAgICAgICAgbWV0aG9kID0ga2V5VmFsdWUuc3BsaXQoJzonKVsxXS50cmltKCk7XG4gICAgICAgIG5vZGUub24oY2hpbGQsIGV2ZW50LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbm9kZVttZXRob2RdKGUpXG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAncmVmcycsXG4gICAgb3JkZXI6IDMwLFxuICAgIHByZUNvbm5lY3RlZDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgYXNzaWduUmVmcyhub2RlKTtcbiAgICAgICAgYXNzaWduRXZlbnRzKG5vZGUpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9OyIsImNvbnN0IEJhc2VDb21wb25lbnQgID0gcmVxdWlyZSgnLi9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBkb20gPSByZXF1aXJlKCdkb20nKTtcblxudmFyXG4gICAgbGlnaHROb2RlcyA9IHt9LFxuICAgIGluc2VydGVkID0ge307XG5cbmZ1bmN0aW9uIGluc2VydCAobm9kZSkge1xuICAgIGlmKGluc2VydGVkW25vZGUuX3VpZF0gfHwgIWhhc1RlbXBsYXRlKG5vZGUpKXtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb2xsZWN0TGlnaHROb2Rlcyhub2RlKTtcbiAgICBpbnNlcnRUZW1wbGF0ZShub2RlKTtcbiAgICBpbnNlcnRlZFtub2RlLl91aWRdID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdExpZ2h0Tm9kZXMobm9kZSl7XG4gICAgbGlnaHROb2Rlc1tub2RlLl91aWRdID0gbGlnaHROb2Rlc1tub2RlLl91aWRdIHx8IFtdO1xuICAgIHdoaWxlKG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpe1xuICAgICAgICBsaWdodE5vZGVzW25vZGUuX3VpZF0ucHVzaChub2RlLnJlbW92ZUNoaWxkKG5vZGUuY2hpbGROb2Rlc1swXSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFzVGVtcGxhdGUgKG5vZGUpIHtcbiAgICByZXR1cm4gISFub2RlLmdldFRlbXBsYXRlTm9kZSgpO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRUZW1wbGF0ZUNoYWluIChub2RlKSB7XG4gICAgdmFyIHRlbXBsYXRlcyA9IG5vZGUuZ2V0VGVtcGxhdGVDaGFpbigpO1xuICAgIHRlbXBsYXRlcy5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgZ2V0Q29udGFpbmVyKG5vZGUpLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGUpKTtcbiAgICB9KTtcbiAgICBpbnNlcnRDaGlsZHJlbihub2RlKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VGVtcGxhdGUgKG5vZGUpIHtcbiAgICBpZihub2RlLm5lc3RlZFRlbXBsYXRlKXtcbiAgICAgICAgaW5zZXJ0VGVtcGxhdGVDaGFpbihub2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXJcbiAgICAgICAgdGVtcGxhdGVOb2RlID0gbm9kZS5nZXRUZW1wbGF0ZU5vZGUoKTtcblxuICAgIGlmKHRlbXBsYXRlTm9kZSkge1xuICAgICAgICBub2RlLmFwcGVuZENoaWxkKEJhc2VDb21wb25lbnQuY2xvbmUodGVtcGxhdGVOb2RlKSk7XG4gICAgfVxuICAgIGluc2VydENoaWxkcmVuKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb250YWluZXIgKG5vZGUpIHtcbiAgICB2YXIgY29udGFpbmVycyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW3JlZj1cImNvbnRhaW5lclwiXScpO1xuICAgIGlmKCFjb250YWluZXJzIHx8ICFjb250YWluZXJzLmxlbmd0aCl7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyc1tjb250YWluZXJzLmxlbmd0aCAtIDFdO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRDaGlsZHJlbiAobm9kZSkge1xuICAgIHZhciBpLFxuICAgICAgICBjb250YWluZXIgPSBnZXRDb250YWluZXIobm9kZSksXG4gICAgICAgIGNoaWxkcmVuID0gbGlnaHROb2Rlc1tub2RlLl91aWRdO1xuXG4gICAgaWYoY29udGFpbmVyICYmIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgIGZvcihpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldExpZ2h0Tm9kZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxpZ2h0Tm9kZXNbdGhpcy5fdWlkXTtcbn07XG5cbkJhc2VDb21wb25lbnQucHJvdG90eXBlLmdldFRlbXBsYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBjYWNoaW5nIGNhdXNlcyBkaWZmZXJlbnQgY2xhc3NlcyB0byBwdWxsIHRoZSBzYW1lIHRlbXBsYXRlIC0gd2F0P1xuICAgIC8vaWYoIXRoaXMudGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlSWQpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVOb2RlID0gZG9tLmJ5SWQodGhpcy50ZW1wbGF0ZUlkLnJlcGxhY2UoJyMnLCcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy50ZW1wbGF0ZVN0cmluZykge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZU5vZGUgPSBkb20udG9Eb20oJzx0ZW1wbGF0ZT4nICsgdGhpcy50ZW1wbGF0ZVN0cmluZyArICc8L3RlbXBsYXRlPicpO1xuICAgICAgICB9XG4gICAgLy99XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVOb2RlO1xufTtcblxuQmFzZUNvbXBvbmVudC5wcm90b3R5cGUuZ2V0VGVtcGxhdGVDaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGxldFxuICAgICAgICBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgdGVtcGxhdGVzID0gW10sXG4gICAgICAgIHRlbXBsYXRlO1xuXG4gICAgLy8gd2FsayB0aGUgcHJvdG90eXBlIGNoYWluOyBCYWJlbCBkb2Vzbid0IGFsbG93IHVzaW5nXG4gICAgLy8gYHN1cGVyYCBzaW5jZSB3ZSBhcmUgb3V0c2lkZSBvZiB0aGUgQ2xhc3NcbiAgICB3aGlsZShjb250ZXh0KXtcbiAgICAgICAgY29udGV4dCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250ZXh0KTtcbiAgICAgICAgaWYoIWNvbnRleHQpeyBicmVhazsgfVxuICAgICAgICAvLyBza2lwIHByb3RvdHlwZXMgd2l0aG91dCBhIHRlbXBsYXRlXG4gICAgICAgIC8vIChlbHNlIGl0IHdpbGwgcHVsbCBhbiBpbmhlcml0ZWQgdGVtcGxhdGUgYW5kIGNhdXNlIGR1cGxpY2F0ZXMpXG4gICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlU3RyaW5nJykgfHwgY29udGV4dC5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGVJZCcpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IGNvbnRleHQuZ2V0VGVtcGxhdGVOb2RlKCk7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMucHVzaCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlcztcbn07XG5cbkJhc2VDb21wb25lbnQuYWRkUGx1Z2luKHtcbiAgICBuYW1lOiAndGVtcGxhdGUnLFxuICAgIG9yZGVyOiAyMCxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGluc2VydChub2RlKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJjb25zdCBCYXNlQ29tcG9uZW50ICA9IHJlcXVpcmUoJy4uLy4uL3NyYy9CYXNlQ29tcG9uZW50Jyk7XG5jb25zdCBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3Byb3BlcnRpZXMnKTtcbmNvbnN0IHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vc3JjL3RlbXBsYXRlJyk7XG5jb25zdCByZWZzID0gcmVxdWlyZSgnLi4vLi4vc3JjL3JlZnMnKTtcbmNvbnN0IGl0ZW1UZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uL3NyYy9pdGVtLXRlbXBsYXRlJyk7XG5cbmNsYXNzIFRlc3RQcm9wcyBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7IHJldHVybiBbJ2ZvbycsICdiYXInLCAnbmJjJywgJ2NicycsICdkaXNhYmxlZCddOyB9XG4gICAgZ2V0IHByb3BzICgpIHsgcmV0dXJuIFsnZm9vJywgJ2JhciddOyB9XG4gICAgZ2V0IGJvb2xzICgpIHsgcmV0dXJuIFsnbmJjJywgJ2NicyddOyB9XG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdDSEcnLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgIC8vdGhpc1tuYW1lXSA9IGRvbS5ub3JtYWxpemUodmFsdWUpO1xuICAgICAgICB0aGlzW25hbWUgKyAnLWNoYW5nZWQnXSA9IGRvbS5ub3JtYWxpemUodmFsdWUpO1xuICAgIH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXByb3BzJywgVGVzdFByb3BzKTtcblxuY2xhc3MgVGVzdExpZmVjeWNsZSBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7cmV0dXJuIFsnZm9vJywgJ2JhciddOyB9XG5cbiAgICBzZXQgZm9vICh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9fZm9vID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IGZvbyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZm9vO1xuICAgIH1cblxuICAgIHNldCBiYXIgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX19iYXIgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXQgYmFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19iYXIgfHwgJ05PVFNFVCc7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGNvbm5lY3RlZCAoKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdjb25uZWN0ZWQtY2FsbGVkJywgdGhpcyk7XG4gICAgfVxuXG4gICAgZG9tUmVhZHkgKCkge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAnZG9tcmVhZHktY2FsbGVkJywgdGhpcyk7XG4gICAgfVxuXG4gICAgZGlzY29ubmVjdGVkICgpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ2Rpc2Nvbm5lY3RlZC1jYWxsZWQnLCB0aGlzKTtcbiAgICB9XG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWxpZmVjeWNsZScsIFRlc3RMaWZlY3ljbGUpO1xuXG5CYXNlQ29tcG9uZW50LmFkZFBsdWdpbih7XG4gICAgaW5pdDogZnVuY3Rpb24gKG5vZGUsIGEsIGIsIGMpIHtcbiAgICAgICAgb24uZmlyZShkb2N1bWVudCwgJ2luaXQtY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwcmVDb25uZWN0ZWQ6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdwcmVDb25uZWN0ZWQtY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwb3N0Q29ubmVjdGVkOiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncG9zdENvbm5lY3RlZC1jYWxsZWQnKTtcbiAgICB9LFxuICAgIHByZURvbVJlYWR5OiBmdW5jdGlvbiAobm9kZSwgYSwgYiwgYykge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncHJlRG9tUmVhZHktY2FsbGVkJyk7XG4gICAgfSxcbiAgICBwb3N0RG9tUmVhZHk6IGZ1bmN0aW9uIChub2RlLCBhLCBiLCBjKSB7XG4gICAgICAgIG9uLmZpcmUoZG9jdW1lbnQsICdwb3N0RG9tUmVhZHktY2FsbGVkJyk7XG4gICAgfVxufSk7XG5cblxuY2xhc3MgVGVzdFRtcGxTdHJpbmcgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXY+VGhpcyBpcyBhIHNpbXBsZSB0ZW1wbGF0ZTwvZGl2PmA7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtc3RyaW5nJywgVGVzdFRtcGxTdHJpbmcpO1xuXG5jbGFzcyBUZXN0VG1wbElkIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgZ2V0IHRlbXBsYXRlSWQgKCkge1xuICAgICAgICByZXR1cm4gJ3Rlc3QtdG1wbC1pZC10ZW1wbGF0ZSc7XG4gICAgfVxufVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LXRtcGwtaWQnLCBUZXN0VG1wbElkKTtcblxuXG5jbGFzcyBUZXN0VG1wbFJlZnMgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHtcbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXYgb249XCJjbGljazpvbkNsaWNrXCIgcmVmPVwiY2xpY2tOb2RlXCI+XG4gICAgICAgICAgICA8bGFiZWwgcmVmPVwibGFiZWxOb2RlXCI+bGFiZWw6PC9sYWJlbD5cbiAgICAgICAgICAgIDxzcGFuIHJlZj1cInZhbHVlTm9kZVwiPnZhbHVlPC9zcGFuPlxuICAgICAgICA8L2Rpdj5gO1xuICAgIH1cblxuICAgIG9uQ2xpY2sgKCkge1xuICAgICAgICBvbi5maXJlKGRvY3VtZW50LCAncmVmLWNsaWNrLWNhbGxlZCcpO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLXJlZnMnLCBUZXN0VG1wbFJlZnMpO1xuXG5jbGFzcyBUZXN0VG1wbENvbnRhaW5lciBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPGRpdj5cbiAgICAgICAgICAgIDxsYWJlbCByZWY9XCJsYWJlbE5vZGVcIj5sYWJlbDo8L2xhYmVsPlxuICAgICAgICAgICAgPHNwYW4gcmVmPVwidmFsdWVOb2RlXCI+dmFsdWU8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IHJlZj1cImNvbnRhaW5lclwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLWNvbnRhaW5lcicsIFRlc3RUbXBsQ29udGFpbmVyKTtcblxuXG4vLyBzaW1wbGUgbmVzdGVkIHRlbXBsYXRlc1xuY2xhc3MgVGVzdFRtcGxOZXN0ZWRBIGV4dGVuZHMgQmFzZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5lc3RlZFRlbXBsYXRlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uPlxuICAgICAgICAgICAgPGRpdj5jb250ZW50IEEgYmVmb3JlPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiByZWY9XCJjb250YWluZXJcIj48L3NlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQSBhZnRlcjwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+YDtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1uZXN0ZWQtYScsIFRlc3RUbXBsTmVzdGVkQSk7XG5cbmNsYXNzIFRlc3RUbXBsTmVzdGVkQiBleHRlbmRzIFRlc3RUbXBsTmVzdGVkQSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBnZXQgdGVtcGxhdGVTdHJpbmcgKCkge1xuICAgICAgICByZXR1cm4gYDxkaXY+Y29udGVudCBCPC9kaXY+YDtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtdG1wbC1uZXN0ZWQtYicsIFRlc3RUbXBsTmVzdGVkQik7XG5cblxuLy8gbmVzdGVkIHBsdXMgbGlnaHQgZG9tXG5jbGFzcyBUZXN0VG1wbE5lc3RlZEMgZXh0ZW5kcyBUZXN0VG1wbE5lc3RlZEEge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8c2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBDIGJlZm9yZTwvZGl2PlxuICAgICAgICAgICAgPGRpdiByZWY9XCJjb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBDIGFmdGVyPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC10bXBsLW5lc3RlZC1jJywgVGVzdFRtcGxOZXN0ZWRDKTtcblxuXG4vLyA1LWRlZXAgbmVzdGVkIHRlbXBsYXRlc1xuY2xhc3MgVGVzdEEgZXh0ZW5kcyBCYXNlQ29tcG9uZW50IHt9XG5jbGFzcyBUZXN0QiBleHRlbmRzIFRlc3RBIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgPHNlY3Rpb24+XG4gICAgICAgICAgICA8ZGl2PmNvbnRlbnQgQiBiZWZvcmU8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIHJlZj1cImNvbnRhaW5lclwiPjwvc2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXY+Y29udGVudCBCIGFmdGVyPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuICAgIH1cbn1cbmNsYXNzIFRlc3RDIGV4dGVuZHMgVGVzdEIge31cbmNsYXNzIFRlc3REIGV4dGVuZHMgVGVzdEMge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgZ2V0IHRlbXBsYXRlU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGA8ZGl2PmNvbnRlbnQgRDwvZGl2PmA7XG4gICAgfVxufVxuY2xhc3MgVGVzdEUgZXh0ZW5kcyBUZXN0RCB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5lc3RlZFRlbXBsYXRlID0gdHJ1ZTtcbiAgICB9XG59XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtYScsIFRlc3RBKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1iJywgVGVzdEIpO1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCd0ZXN0LWMnLCBUZXN0Qyk7XG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ3Rlc3QtZCcsIFRlc3REKTtcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1lJywgVGVzdEUpO1xuXG5jbGFzcyBUZXN0TGlzdCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7IHJldHVybiBbJ2xpc3QtdGl0bGUnXTsgfVxuICAgIGdldCBwcm9wcyAoKSB7IHJldHVybiBbJ2xpc3QtdGl0bGUnXTsgfVxuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldCB0ZW1wbGF0ZVN0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIiByZWY9XCJ0aXRsZU5vZGVcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgcmVmPVwiY29udGFpbmVyXCI+PC9kaXY+YDtcbiAgICB9XG4gICAgXG4gICAgc2V0IGRhdGEgKGl0ZW1zKSB7XG4gICAgICAgIHRoaXMucmVuZGVyTGlzdChpdGVtcywgdGhpcy5jb250YWluZXIpO1xuICAgIH1cblxuICAgIGRvbVJlYWR5ICgpIHtcbiAgICAgICAgdGhpcy50aXRsZU5vZGUuaW5uZXJIVE1MID0gdGhpc1snbGlzdC10aXRsZSddO1xuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGVzdC1saXN0JywgVGVzdExpc3QpO1xuXG5cblxud2luZG93Lml0ZW1UZW1wbGF0ZVN0cmluZyA9IGA8dGVtcGxhdGU+XG4gICAgPGRpdiBpZD1cInt7aWR9fVwiPlxuICAgICAgICA8c3Bhbj57e2ZpcnN0fX08L3NwYW4+XG4gICAgICAgIDxzcGFuPnt7bGFzdH19PC9zcGFuPlxuICAgICAgICA8c3Bhbj57e3JvbGV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbjwvdGVtcGxhdGU+YDtcblxud2luZG93LmlmQXR0clRlbXBsYXRlU3RyaW5nID0gYDx0ZW1wbGF0ZT5cbiAgICA8ZGl2IGlkPVwie3tpZH19XCI+XG4gICAgICAgIDxzcGFuPnt7Zmlyc3R9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4+e3tsYXN0fX08L3NwYW4+XG4gICAgICAgIDxzcGFuPnt7cm9sZX19PC9zcGFuPlxuICAgICAgICA8c3BhbiBpZj1cInt7YW1vdW50fX0gPCAyXCIgY2xhc3M9XCJhbW91bnRcIj57e2Ftb3VudH19PC9zcGFuPlxuICAgICAgICA8c3BhbiBpZj1cInt7dHlwZX19ID09PSAnc2FuZSdcIiBjbGFzcz1cInNhbml0eVwiPnt7dHlwZX19PC9zcGFuPlxuICAgIDwvZGl2PlxuPC90ZW1wbGF0ZT5gO1xuXG5mdW5jdGlvbiBkZXYgKCkge1xuICAgIHZhciBhbHBoYWJldCA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicuc3BsaXQoJycpO1xuICAgIHZhciBzID0gJ3t7YW1vdW50fX0gKyB7e251bX19ICsgMyc7XG4gICAgdmFyIGxpc3QgPSBbe2Ftb3VudDogMSwgbnVtOiAyfSwge2Ftb3VudDogMywgbnVtOiA0fSwge2Ftb3VudDogNSwgbnVtOiA2fV07XG4gICAgdmFyIHIgPSAvXFx7XFx7XFx3Kn19L2c7XG4gICAgdmFyIGZuID0gW107XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICB2YXIgZjtcbiAgICBzID0gcy5yZXBsYWNlKHIsIGZ1bmN0aW9uKHcpe1xuICAgICAgICBjb25zb2xlLmxvZygnd29yZCcsIHcpO1xuICAgICAgICB2YXIgdiA9IGFscGhhYmV0LnNoaWZ0KCk7XG4gICAgICAgIGZuLnB1c2godik7XG4gICAgICAgIGFyZ3MucHVzaCgvXFx3Ky9nLmV4ZWModylbMF0pO1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9KTtcbiAgICBmbi5wdXNoKHMpO1xuXG4gICAgY29uc29sZS5sb2coJ2ZuJywgZm4pO1xuICAgIGNvbnNvbGUubG9nKCdhcmdzJywgYXJncyk7XG4gICAgLy9zID0gJ3JldHVybiAnICsgcyArICc7JztcbiAgICBjb25zb2xlLmxvZygncycsIHMpO1xuXG4gICAgd2luZG93LmYgPSBuZXcgRnVuY3Rpb24ocyk7XG5cbiAgICB2YXIgZHluRm4gPSBmdW5jdGlvbiAoYSxiLGMsZCxlLGYpIHtcbiAgICAgICAgdmFyIHIgPSBldmFsKHMpO1xuICAgICAgICByZXR1cm4gcjtcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coJyAgZjonLCBkeW5GbigxLDIpKTtcbiAgICAvL1xuICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB2YXIgYSA9IGFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2FyZ107XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgciA9IGR5bkZuLmFwcGx5KG51bGwsIGEpO1xuICAgICAgICBjb25zb2xlLmxvZygncicsIHIpO1xuICAgIH0pO1xuXG5cbn1cbi8vZGV2KCk7Il19
