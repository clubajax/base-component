'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Base) {
    _inherits(App, _Base);

    function App() {
        _classCallCheck(this, App);

        // always call super() first in the ctor. This also calls the extended class' ctor.
        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        console.log('App.constructor');
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
            console.log('FancyDrawer.connected!', this.id);
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
//# sourceMappingURL=app.js.map
