type IRafCallback = {
  (): void
}
type IRef = number | null

export var raf = function (callback: IRafCallback) {
  raf =
    typeof window.requestAnimationFrame === 'function'
      ? function (callback: IRafCallback) {
        if (typeof callback !== 'function') return;
        let rafId: IRef = window.requestAnimationFrame(function () {
          if (rafId) {
            window.cancelAnimationFrame(rafId);
          }
          callback();
          rafId = null;
        });
      } :
      function (callback: IRafCallback) {
        if (typeof callback !== 'function') return;
        let timer: IRef = setTimeout(function () {
          if (timer) {
            clearTimeout(timer);
          }
          callback();
          timer = null;
        });
      };

  raf(callback);
}

