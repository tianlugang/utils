const getMime = (str: string) => {
  const matched = str.match(/:(.*?);/)

  return matched ? matched[1] : ''
}

/**
 * dataUrl转化为blob对象
 * @param {[string]} dataURL url
 */
export function dataURL2Blob(dataURL: string) {
  dataURL = dataURL.trim()
  if (dataURL.length === 0) return new Blob()

  let arr = dataURL.split(',')
  let mime = getMime(arr[0])
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], {
    type: mime
  });
}
