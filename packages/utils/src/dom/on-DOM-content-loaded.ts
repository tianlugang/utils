export function onDOMContentLoaded(callback: () => void) {
  const DOMContentLoaded = () => {
    document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false);
    callback();
  };

  if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
    setTimeout(() => callback(), 0);
  } else {
    document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
  }
}
