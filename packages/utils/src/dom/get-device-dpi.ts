type IScreen = Screen & {
  deviceXDPI: number[]
  deviceYDPI: number[]
}
const screen = window.screen as IScreen

/**
 * 获取当前设备的 DPI
 */
export function getDeviceDPI() {
  let DPI = new Array(2);
  if (typeof screen.deviceXDPI !== 'undefined') {
    DPI[0] = screen.deviceXDPI;
    DPI[1] = screen.deviceYDPI;
  } else {
    let div = document.createElement("DIV");
    div.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
    document.body.appendChild(div);
    DPI[0] = parseInt(div.offsetWidth.toString());
    DPI[1] = parseInt(div.offsetHeight.toString());

    document.body.removeChild(div);
  }

  return DPI;
}
