const win = window as any

export const isStealthMode = () =>
  new Promise(resolve => {
    const fs = win.RequestFileSystem || win.webkitRequestFileSystem;
    if (!fs) {
      resolve(false);
    } else {
      fs(win.TEMPORARY, 100, function () {
        // '非隐身模式'
        resolve(false);
      }, function () {
        // '隐身模式'
        resolve(true);
      });
    }
  })

