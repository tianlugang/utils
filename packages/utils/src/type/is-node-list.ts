// 是否是 DOM List
export const isNodeList = (el: any) => el != null && (el instanceof HTMLCollection || el instanceof NodeList);