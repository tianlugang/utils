// 判断是否是移动设备访问
export const isMobile = () => /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(
    window.navigator.userAgent.toLowerCase()
);