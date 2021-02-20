import { noop } from '../base';

type IImageCutterTarget = string | File;
type IImageCutterOptions = {
  width: number
  height: number
  onError(err: Error): void
  onLoad(dataURL: string): void
}

const createError = (message: string) => {
  var error = new Error(message);

  error.name = '[Cutter-Error]';
  return error
}

export namespace Cutter {
  export function image(src: IImageCutterTarget, { width = 200, height = 200, onError = noop, onLoad }: IImageCutterOptions) {
    const cvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');
    if (!ctx) {
      return onError(createError('Not support Canvas'));
    }
    const img = new Image();
    const handleLoad = () => {
      let naturalWidth = img.naturalWidth;
      let naturalHeight = img.naturalHeight;
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (naturalWidth < naturalHeight) {
        drawHeight = naturalHeight * (height / naturalWidth);
        offsetY = -(drawHeight - drawWidth) / 2;
      } else {
        drawWidth = naturalWidth * (width / naturalHeight);
        offsetX = -(drawWidth - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      let dataURL = cvs.toDataURL();

      src instanceof File ? window.URL.revokeObjectURL(img.src) : void 0;
      onLoad(dataURL);
    }
    const handleError = () => {
      onError(createError('Image load failed, src: ' + img.src))
    }

    cvs.width = width;
    cvs.height = height;
    cvs.style.cssText = 'position: fixed; left: 0; top: 0; width: '.concat(width + 'px; height: ').concat(height + 'px; z-index: 9999; display: none;');
    img.setAttribute('crossorigin', 'anonymous');
    img.onload = handleLoad;
    img.onerror = handleError
    img.src = src instanceof File ? window.URL.createObjectURL(src) : src;
  }

  export const promise = (src: IImageCutterTarget, width: number = 200, height: number = 200) => {
    return new Promise((resolve, reject) => {
      Cutter.image(src, {
        width,
        height,
        onError: reject,
        onLoad: resolve
      });
    });
  }
}
