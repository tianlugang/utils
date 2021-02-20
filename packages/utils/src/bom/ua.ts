/**
 * 获取用户与浏览器信息
 */
export namespace UA {
  export const userAgent = navigator.userAgent;
  export const platform = navigator.platform;

  const webkit = userAgent.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
  const android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/);
  const osx = !!userAgent.match(/\(Macintosh\; Intel /);
  const ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = userAgent.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
  const webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
  const win = /Win\d{2}|Windows/.test(platform);
  const wp = userAgent.match(/Windows Phone ([\d.]+)/);
  const touchpad = webos && userAgent.match(/TouchPad/);
  const kindle = userAgent.match(/Kindle\/([\d.]+)/);
  const silk = userAgent.match(/Silk\/([\d._]+)/);
  const blackberry = userAgent.match(/(BlackBerry).*Version\/([\d.]+)/);
  const bb10 = userAgent.match(/(BB10).*Version\/([\d.]+)/);
  const rimtabletos = userAgent.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
  const playbook = userAgent.match(/PlayBook/);
  const chrome = userAgent.match(/Chrome\/([\d.]+)/) || userAgent.match(/CriOS\/([\d.]+)/);
  const firefox = userAgent.match(/Firefox\/([\d.]+)/);
  const firefoxos = userAgent.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/);
  const ie = userAgent.match(/MSIE\s([\d.]+)/) || userAgent.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/);
  const webview = !chrome && userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);
  const safari = webview || userAgent.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
  export const bs = {
    version: '',
    webkit: false,
    android: false,
    ios: false,
    iphone: false,
    ipad: false,
    ipod: false,
    wp: false,
    webos: false,
    touchpad: false,
    blackberry: false,
    bb10: false,
    rimtabletos: false,
    playbook: false,
    kindle: false,
    silk: false,
    chrome: false,
    firefox: false,
    firefoxos: false,
    ie: false,
    safari: false,
    webview: false,
    tablet: false,
    phone: false
  }

  if (webkit) bs.webkit = true, bs.version = webkit[1];
  if (android) bs.android = true, bs.version = android[2];
  if (iphone && !ipod) bs.ios = bs.iphone = true, bs.version = iphone[2].replace(/_/g, '.');
  if (ipad) bs.ios = bs.ipad = true, bs.version = ipad[2].replace(/_/g, '.');
  if (ipod) bs.ios = bs.ipod = true, bs.version = ipod[3] ? ipod[3].replace(/_/g, '.') : '';
  if (wp) bs.wp = true, bs.version = wp[1];
  if (webos) bs.webos = true, bs.version = webos[2];
  if (touchpad) bs.touchpad = true;
  if (blackberry) bs.blackberry = true, bs.version = blackberry[2];
  if (bb10) bs.bb10 = true, bs.version = bb10[2];
  if (rimtabletos) bs.rimtabletos = true, bs.version = rimtabletos[2];
  if (playbook) bs.playbook = true;
  if (kindle) bs.kindle = true, bs.version = kindle[1];
  if (silk) bs.silk = true, bs.version = silk[1];
  if (!silk && bs.android && userAgent.match(/Kindle Fire/)) bs.silk = true;
  if (chrome) bs.chrome = true, bs.version = chrome[1];
  if (firefox) bs.firefox = true, bs.version = firefox[1];
  if (firefoxos) bs.firefoxos = true, bs.version = firefoxos[1];
  if (ie) bs.ie = true, bs.version = ie[1];
  if (safari && (osx || bs.ios || win)) {
    bs.safari = true;
    if (!bs.ios) bs.version = safari[1];
  }
  if (webview) bs.webview = true;
  bs.tablet = !!(ipad || playbook || (android && !userAgent.match(/Mobile/)) ||
    (firefox && userAgent.match(/Tablet/)) || (ie && !userAgent.match(/Phone/) && userAgent.match(/Touch/)));
  bs.phone = !!(!bs.tablet && !bs.ipod && (android || iphone || webos || blackberry || bb10 ||
    (chrome && userAgent.match(/Android/)) || (chrome && userAgent.match(/CriOS\/([\d.]+)/)) ||
    (firefox && userAgent.match(/Mobile/)) || (ie && userAgent.match(/Touch/))));
}