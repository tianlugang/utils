interface IObject {
  [x: string]: any
  [x: number]: any
}
type IIgnoreKyes = keyof IObject

// 获取两个对象的交集
export const intersection = (target: IObject, refere: IObject, ignoreKeys: IIgnoreKyes[] = []) => {
  const temp: IObject = {}
  const keys = Object.keys(refere)

  Object.keys(target).forEach(key => {
    if (keys.includes(key) && !ignoreKeys.includes(key)) {
      temp[key] = target[key];
    }
  })

  return temp
}
