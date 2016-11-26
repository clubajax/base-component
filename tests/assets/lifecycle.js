import BaseElement from '../../src/BaseComponent';

class AppThinger extends BaseElement {

    get id () {
        return 'UID';
    }

    set id (value) {
        this._id = value;
    }

    constructor(...args) {
        super();
    }
}