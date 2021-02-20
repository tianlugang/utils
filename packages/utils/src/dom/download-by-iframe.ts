// 无闪现下载
export const downloadByIframe = function download(url: string) {
  const iframe = document.createElement('iframe');
  const iframeLoad = () => {
    const win = iframe.contentWindow;
    if (!win) {
      return
    }
    const doc = win.document;
    if (win.location.href === url) {
      if (doc.body.childNodes.length > 0) {
        // response is error
      }

      document.body.removeChild(iframe)
    }
  };
  const timeout = () => {
    const win = iframe.contentWindow;
    clearTimeout(timer);
    if (!win) {
      return
    }
    win.location.href = url;
  };

  iframe.style.display = 'none';
  iframe.onload = iframeLoad;
  iframe.src = '';
  document.body.appendChild(iframe);
  const timer = setTimeout(timeout, 50);
}
