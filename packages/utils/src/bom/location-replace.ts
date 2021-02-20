export function locationReplace(url: string) {
  if (history.replaceState) {
    history.replaceState(null, document.title, url);
    history.go(0);
  } else {
    location.replace(url);
  }
}
