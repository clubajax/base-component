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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function () {
    function Base() {
        _classCallCheck(this, Base);

        // In a derived class, you must call super() before you can use this:
        //super();
        // throws:
        //this.id = 'fancy';
        console.log('Base.constructor');
    }

    _createClass(Base, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            console.log('Base.connected!', this.id);
        }
    }]);

    return Base;
}();

exports.default = Base;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base2 = __webpack_require__(0);

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

console.log('LOADING APP @!@ ');

var App = function (_Base) {
    _inherits(App, _Base);

    _createClass(App, [{
        key: 'id',
        get: function get() {
            return 'UID';
        },
        set: function set(value) {
            this._id = value;
        }
    }]);

    function App() {
        _classCallCheck(this, App);

        // always call super() first in the ctor. This also calls the extended class' ctor.
        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        console.log('App.constructor', _this.id);
        return _this;
    }

    return App;
}(_Base3.default);

var AppDrawer = function (_HTMLElement) {
    _inherits(AppDrawer, _HTMLElement);

    function AppDrawer() {
        _classCallCheck(this, AppDrawer);

        return _possibleConstructorReturn(this, (AppDrawer.__proto__ || Object.getPrototypeOf(AppDrawer)).call(this)); // always call super() first in the ctor. This also calls the extended class' ctor.

        //this.id = 8;
        //console.log('AppDrawer.super', this.id);
        //this.id = 'app';
    }

    _createClass(AppDrawer, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            console.log('AppDrawer.connected!', this.id);
            console.log('AppDrawer.anotherMethod', AppDrawer.anotherMethod());
        }
    }, {
        key: 'toggleDrawer',
        value: function toggleDrawer() {
            // Possibly different toggle implementation?
            // Use ES2015 if you need to call the parent method.
            // super.toggleDrawer()
        }
    }], [{
        key: 'anotherMethod',
        value: function anotherMethod() {
            return 'static';
        }
    }]);

    return AppDrawer;
}(HTMLElement);

var FancyDrawer = function (_AppDrawer) {
    _inherits(FancyDrawer, _AppDrawer);

    function FancyDrawer() {
        _classCallCheck(this, FancyDrawer);

        // throws:
        //this.id = 'fancy';
        var _this3 = _possibleConstructorReturn(this, (FancyDrawer.__proto__ || Object.getPrototypeOf(FancyDrawer)).call(this));
        // In a derived class, you must call super() before you can use this:


        console.log('FancyDrawer.super');
        return _this3;
    }

    _createClass(FancyDrawer, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            _get(FancyDrawer.prototype.__proto__ || Object.getPrototypeOf(FancyDrawer.prototype), 'connectedCallback', this).call(this);
            console.log('HOT FancyDrawer.connected!', this.id);
        }
    }, {
        key: 'toggleDrawer',
        value: function toggleDrawer() {
            // Possibly different toggle implementation?
            // Use ES2015 if you need to call the parent method.
            // super.toggleDrawer()
        }
    }, {
        key: 'anotherMethod',
        value: function anotherMethod() {}
    }]);

    return FancyDrawer;
}(AppDrawer);

customElements.define('app-drawer', AppDrawer);
customElements.define('fancy-app-drawer', FancyDrawer);

window.lib = {
    App: App,
    Base: _Base3.default
};
console.log('APP/LIB LOADED');

/***/ }
/******/ ]);