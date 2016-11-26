/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Base = function (_HTMLElement) {\n    _inherits(Base, _HTMLElement);\n\n    function Base() {\n        _classCallCheck(this, Base);\n\n        return _possibleConstructorReturn(this, (Base.__proto__ || Object.getPrototypeOf(Base)).call(this));\n        //this._uid = dom.uid(this.localName);\n        //privates[this._uid] = { DOMSTATE: 'created' };\n        //console.log('this._uid', this._uid);\n        //console.log('Base.constructor');\n    }\n\n    _createClass(Base, [{\n        key: 'connectedCallback',\n        value: function connectedCallback() {\n            console.log('Base.connected!', this.id);\n        }\n    }]);\n\n    return Base;\n}(HTMLElement);\n\nexports.default = Base;\n\n\nvar privates = {};\n\nfunction nextTick(cb) {\n    requestAnimationFrame(cb);\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./Base.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./Base.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
eval("'use strict';\n\nvar _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if (\"value\" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Base3 = __webpack_require__(0);\n\nvar _Base4 = _interopRequireDefault(_Base3);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nconsole.log('LOADING APP >!< ');\n\nvar App = function (_Base) {\n    _inherits(App, _Base);\n\n    _createClass(App, [{\n        key: 'id',\n        get: function get() {\n            return 'UID';\n        },\n        set: function set(value) {\n            this._id = value;\n        }\n    }]);\n\n    function App() {\n        _classCallCheck(this, App);\n\n        // always call super() first in the ctor. This also calls the extended class' ctor.\n        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));\n\n        console.log(' --------- UID!', _this._uid);\n        console.log('App.constructor', _this.id);\n\n        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n            args[_key] = arguments[_key];\n        }\n\n        console.log('arguments:', args);\n\n        return _this;\n    }\n\n    return App;\n}(_Base4.default);\n\nvar AppDrawer = function (_Base2) {\n    _inherits(AppDrawer, _Base2);\n\n    function AppDrawer() {\n        _classCallCheck(this, AppDrawer);\n\n        // always call super() first in the ctor. This also calls the extended class' ctor.\n        var _this2 = _possibleConstructorReturn(this, (AppDrawer.__proto__ || Object.getPrototypeOf(AppDrawer)).call(this));\n\n        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {\n            args[_key2] = arguments[_key2];\n        }\n\n        console.log(' ----->------ arguments:', args);\n        //this.id = 8;\n        //console.log('AppDrawer.super', this.id);\n        //this.id = 'app';\n        return _this2;\n    }\n\n    _createClass(AppDrawer, [{\n        key: 'connectedCallback',\n        value: function connectedCallback() {\n            console.log('AppDrawer.connected!', this.id);\n            console.log('AppDrawer.anotherMethod', AppDrawer.anotherMethod());\n        }\n    }, {\n        key: 'toggleDrawer',\n        value: function toggleDrawer() {\n            // Possibly different toggle implementation?\n            // Use ES2015 if you need to call the parent method.\n            // super.toggleDrawer()\n        }\n    }], [{\n        key: 'anotherMethod',\n        value: function anotherMethod() {\n            return 'static';\n        }\n    }]);\n\n    return AppDrawer;\n}(_Base4.default);\n\nvar FancyDrawer = function (_AppDrawer) {\n    _inherits(FancyDrawer, _AppDrawer);\n\n    function FancyDrawer() {\n        _classCallCheck(this, FancyDrawer);\n\n        // throws:\n        //this.id = 'fancy';\n        var _this3 = _possibleConstructorReturn(this, (FancyDrawer.__proto__ || Object.getPrototypeOf(FancyDrawer)).call(this));\n        // In a derived class, you must call super() before you can use this:\n\n\n        console.log('FancyDrawer.super');\n        return _this3;\n    }\n\n    _createClass(FancyDrawer, [{\n        key: 'connectedCallback',\n        value: function connectedCallback() {\n            _get(FancyDrawer.prototype.__proto__ || Object.getPrototypeOf(FancyDrawer.prototype), 'connectedCallback', this).call(this);\n            console.log('HOT FancyDrawer.connected!', this.id);\n        }\n    }, {\n        key: 'toggleDrawer',\n        value: function toggleDrawer() {\n            // Possibly different toggle implementation?\n            // Use ES2015 if you need to call the parent method.\n            // super.toggleDrawer()\n        }\n    }, {\n        key: 'anotherMethod',\n        value: function anotherMethod() {}\n    }]);\n\n    return FancyDrawer;\n}(AppDrawer);\n\ncustomElements.define('app-drawer', AppDrawer);\ncustomElements.define('fancy-app-drawer', FancyDrawer);\n\nwindow.lib = {\n    App: App,\n    Base: _Base4.default,\n    AppDrawer: AppDrawer\n};\nconsole.log('APP/LIB FOO');\n\n//////////////////\n// WEBPACK FOOTER\n// ./app.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./app.js?");

/***/ }
/******/ ]);