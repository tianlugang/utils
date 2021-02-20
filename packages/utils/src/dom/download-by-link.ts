export const downloadByAnchor = (url: string, name: string, target: string = '_blank') => {
  const link = document.createElement('a');

  link.download = name;
  link.href = url;
  link.target = target;
  link.click();
}
