

export const getFlatObjectDiff = (obj1: any, obj2: any) => {
  const result: any = {}
  Object.keys(obj1).forEach(k => {
    if (!obj2.hasOwnProperty(k)) {
      result[k] = null
    } else if (obj1[k] !== obj2[k]) {
      if (obj2[k] !== undefined) {
        result[k] = obj2[k]
      }
    }
  })
  Object.keys(obj2).forEach(k => {
    if (!obj1.hasOwnProperty(k)) {
      if (obj2[k] !== undefined) {
        result[k] = obj2[k]
      }
    }
  })
  return result
}
