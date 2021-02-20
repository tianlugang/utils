const DT = (window as any).DocumentTouch
// 判断是否Touch屏幕
export const isTouchScreen = () => 'ontouchstart' in window || (DT && document instanceof DT)
