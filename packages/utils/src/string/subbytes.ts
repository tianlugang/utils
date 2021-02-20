import { byteLen } from './byte-size';

/**
 * 按字节来截取长度
 */
export const subBytes = (str: string, n: number) => {
    while (byteLen(str) > n) {
        str = str.substr(0, str.length - 1);
    }

    return str;
}
