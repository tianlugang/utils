export function inherits(subClass: Function, superClass: Function) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });

  if (superClass) _setPrototypeOf(subClass, superClass);
}

let _setPrototypeOf = <T>(o: T, p: object | null): T => {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o: any, p: object | null) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
