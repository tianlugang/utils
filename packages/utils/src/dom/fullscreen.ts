
type ICorsDocument = Document & {
  fullscreenElement: Element | null
  mozFullScreenElement: Element | null
  webkitFullscreenElement: Element | null

  exitFullscreen(): unknown
  mozCancelFullScreen(): unknown
  webkitCancelFullScreen(): unknown
  msExitFullscreen(): unknown
}

type ICorsDocumentElement = HTMLElement & {
  requestFullscreen(): unknown
  mozRequestFullScreen(): unknown
  webkitRequestFullScreen(): unknown
  msRequestFullscreen(): unknown
}

const corsDoc = document as ICorsDocument
const corsDocEl = document.documentElement as ICorsDocumentElement

/**
 * 跨浏览器全屏
 */
export function fullScreen() {
  if (!corsDoc.fullscreenElement && !corsDoc.mozFullScreenElement && !corsDoc.webkitFullscreenElement) {
    if (corsDocEl.requestFullscreen) {
      corsDocEl.requestFullscreen()
    } else if (corsDocEl.mozRequestFullScreen) {
      corsDocEl.mozRequestFullScreen()
    } else if (corsDocEl.webkitRequestFullScreen) {
      corsDocEl.webkitRequestFullScreen()
    } else if (corsDocEl.msRequestFullscreen) {
      corsDocEl.msRequestFullscreen()
    }
  } else {
    if (corsDoc.exitFullscreen) {
      corsDoc.exitFullscreen()
    } else if (corsDoc.mozCancelFullScreen) {
      corsDoc.mozCancelFullScreen()
    } else if (corsDoc.webkitCancelFullScreen) {
      corsDoc.webkitCancelFullScreen()
    } else if (corsDoc.msExitFullscreen) {
      corsDoc.msExitFullscreen()
    }
  }
}
