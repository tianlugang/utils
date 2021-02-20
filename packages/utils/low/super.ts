let _getPrototypeOf = <T = any>(o: T): T => {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o: any) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }

    return _getPrototypeOf(o);
}

export default function createSuper(Derived: Function) {
    return function () {
        var Super = _getPrototypeOf(Derived),
            call = Super.apply(this, arguments);

        if (call && (typeof call === 'object' || typeof call === 'function')) {
            return call;
        }

        if (this === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return this
    };
}