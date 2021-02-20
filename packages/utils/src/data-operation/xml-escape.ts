var HTML_DECODE = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&nbsp;": " ",
  "&quot;": "\""
};

// html escape
export function escapeXML(xml: string) {
  return xml.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g, function ($0) {
    var c = $0.charCodeAt(0), r = ["&#"]

    c = (c == 0x20) ? 0xA0 : c;
    r.push(c.toString(), ';');
    return r.join("");
  });
}

/**
 * xml 转义
 * @param {string} xml
 */
export function descapeXML(xml: string) {
  return xml.replace(/&\w+;|&#(\d+);/g, function ($0, $1) {
    var c = (HTML_DECODE as any)[$0];
    if (c == undefined) {
      if (!isNaN($1)) {
        c = String.fromCharCode(($1 == 160) ? 32 : $1);
      } else {
        c = $0;
      }
    }
    return c;
  });
}
