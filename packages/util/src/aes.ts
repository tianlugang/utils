import { createCipher, createDecipher } from 'crypto'

function encrypt(buf: NodeJS.ArrayBufferView | Buffer | string, secret: string) {
    var c = createCipher('aes192', secret)
    var b1 = c.update(buf)
    var b2 = c.final()

    return Buffer.concat([b1, b2])
}

function decrypt(buf: NodeJS.ArrayBufferView | Buffer, secret: string) {
    try {
        var c = createDecipher('aes192', secret)
        var b1 = c.update(buf)
        var b2 = c.final()
    } catch (_) {
        return new Buffer(0)
    }

    return Buffer.concat([b1, b2])
}

export const AES = {
    encrypt,
    decrypt
}