export function contains(root: HTMLElement, el: HTMLElement) {
  var node: HTMLElement | null = el;

  while (node) {
    if (node === root) {
      return true;
    }

    node = node.parentElement;
  }

  return false;
}
