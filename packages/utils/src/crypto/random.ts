declare var window: any;
declare var require: any;

let genRandomValues = (buffer: Uint8Array): void => {
    const crypto: any = (
        (typeof window !== 'undefined' && (window.crypto || window.msCrypto)) ||
        (typeof require !== 'undefined' && require('crypto')) || null
    );

    if (crypto && typeof crypto.getRandomValues === 'function') {
        genRandomValues = (buffer: Uint8Array) => crypto.getRandomValues(buffer)
    } else if (crypto && typeof crypto.randomFillSync === 'function') {
        genRandomValues = (buffer: Uint8Array) => crypto.randomFillSync(buffer)
    } else if (crypto && typeof crypto.randomBytes === 'function') {
        genRandomValues = (buffer: Uint8Array) => {
            let bytes = crypto.randomBytes(buffer.length);
            for (let i = 0, n = bytes.length; i < n; ++i) {
                buffer[i] = bytes[i];
            }

            return buffer
        }
    } else {
        genRandomValues = (buffer: Uint8Array) => {
            let value = 0;
            for (let i = 0, n = buffer.length; i < n; ++i) {
                if (i % 4 === 0) {
                    value = Math.random() * 0xFFFFFFFF >>> 0;
                }
                buffer[i] = value & 0xFF;
                value >>>= 8;
            }

            return buffer
        }
    }

    return genRandomValues(buffer)
}

export namespace Random {
    export const getRandomValues = genRandomValues
}