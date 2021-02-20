if (window !== window.window) {
  throw new Error('This script runs only on the browser side.')
}

function handleDOMContentLoaded() {
  if (document.addEventListener) {
    document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded, false);
    emitReady();
  } else if (document.readyState === "complete") {
    (document as any).detachEvent("onreadystatechange", handleDOMContentLoaded);
    emitReady();
  }
};

function emitReady() {

}

if (document.readyState === "complete") {
  setTimeout(emitReady);
} else if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, false);
} else {
  document.attachEvent("onreadystatechange", handleDOMContentLoaded);
  let top = false;
  try {
    top = window.frameElement == null && document.documentElement;
  } catch (e) { }

  if (top && top.doScroll) {
    ~ function deferredCheck() {
      if (!lck.isReady) {
        try {
          top.doScroll("left");
        } catch (e) {
          return setTimeout(deferredCheck, 50);
        }
        emitReady();
      }
    }();
  }
}
