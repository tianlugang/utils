/**
 * 字节长度（汉字等占2个字节）
 */
export const byteLen = (str: string) => str.replace(/[^\x00-\xff]/g, '**').length;