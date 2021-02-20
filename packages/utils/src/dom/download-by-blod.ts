let URL = window.URL || window.webkitURL;

const global = window as any;

const bom = (blob: any, autoBom: boolean = false) => {
  if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], {
      type: blob.type
    });
  }

  return blob;
}

const download = (url: string, name: string = 'download', autoBom: boolean = false) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    saveAs(xhr.response, name, autoBom)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

const corsEnabled = (url: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, false);
  try {
    xhr.send();
  } catch (e) { }

  return xhr.status >= 200 && xhr.status <= 299;
}

const click = (el: HTMLElement) => {
  try {
    el.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    el.dispatchEvent(evt);
  }
}

const isMacOSWebView = /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)

const aSaveAs = (blob: any, name: string = 'download', autoBom?: boolean) => {
  const a = document.createElement('a');

  a.download = name;
  a.rel = 'noopener';

  if (typeof blob === 'string') {
    a.href = blob;
    if (a.origin !== location.origin) {
      corsEnabled(a.href) ? download(blob, name, autoBom) : (click(a), a.target = '_blank');
    } else {
      click(a);
    }
  } else {
    a.href = URL.createObjectURL(blob);
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 4E4); // 40s
    setTimeout(function () {
      click(a);
    }, 0);
  }
}

const msSaveAs = function (blob: any, name: string = 'download', autoBom?: boolean) {
  if (typeof blob === 'string') {
    if (corsEnabled(blob)) {
      download(blob, name, autoBom);
    } else {
      const a = document.createElement('a');
      a.href = blob;
      a.target = '_blank';
      setTimeout(function () {
        click(a);
      });
    }
  } else {
    navigator.msSaveOrOpenBlob(bom(blob, autoBom), name);
  }
}

const corsSaveAs = (blob: any, name: string = 'download', autoBom?: boolean, popup: Window | null = null) => {
  popup = popup || open('', '_blank');
  if (popup) {
    popup.document.title = popup.document.body.innerText = 'downloading...';
  }

  if (typeof blob === 'string') {
    return download(blob, name, autoBom);
  }

  const force = blob.type === 'application/octet-stream';
  const isSafari = /constructor/i.test(global.HTMLElement) || global.safari;
  const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

  if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
    const reader = new FileReader();
    reader.onloadend = function () {
      let url = reader.result;
      url = isChromeIOS ? url : (url as string).replace(/^data:[^;]*;/, 'data:attachment/file;');
      if (popup) {
        (popup.location.href as any) = url;
      } else {
        (location.href as any) = url;
      }
      popup = null;
    }
    reader.readAsDataURL(blob);
  } else {
    const url = URL.createObjectURL(blob);
    if (popup) {
      (popup.location.href as any) = url;
    } else {
      location.href = url;
    }
    popup = null;
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 4E4);
  }
}

const saveAs = ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
  ? aSaveAs
  : 'msSaveOrOpenBlob' in navigator
    ? msSaveAs
    : corsSaveAs;

export const downloadSaveAsBlod = saveAs;