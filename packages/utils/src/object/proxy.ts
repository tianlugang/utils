type IObjectKeys = string | number | symbol

const isPrivateProp = (key: IObjectKeys) => typeof key === 'string' && key[0] === '_'
const invariant = (key: IObjectKeys, action: string) => {
    // 禁止操作内部属性
    if (isPrivateProp(key)) {
        throw new Error(`forbid "${action}" props: ${key.toString()}.`);
    }
}

export const defineBlockObject = (object: any) => {
    return new Proxy(object, {
        get(target, key) {
            invariant(key, 'get');
            return target[key];
        },
        set(target, key, value) {
            invariant(key, 'set');
            target[key] = value;
            return true;
        },
        has(target, key) {
            return isPrivateProp(key) ? false : (key in target);
        },
        deleteProperty(_target, key) {
            invariant(key, 'delete');
            return true;
        },
        getOwnPropertyDescriptor(target, key) {
            return isPrivateProp(key) ? void 0 : Object.getOwnPropertyDescriptor(target, key);
        },
        getPrototypeOf() {
            return null;
        },
        isExtensible() {
            return false;
        },
        ownKeys(target) {
            return Reflect.ownKeys(target).filter(key => isPrivateProp(key));
        },
        preventExtensions(target) {
            Object.preventExtensions(target);
            return true;
        },
        setPrototypeOf(target) {
            throw new Error(`disable set proto ${target}`);
        }
    });
}

