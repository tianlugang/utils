// 是否为原生事件
export const isNativeEvent = (event: string) => event in window;
