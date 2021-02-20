export namespace URI {
  export function decode(s: string) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  }

  export function encode(s: string) {
    return encodeURIComponent(s).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
  }
}