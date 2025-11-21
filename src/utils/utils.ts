
export function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

export function deepEqual<T>(v1: T, v2: T): boolean {
  return JSON.stringify(v1) === JSON.stringify(v2)
}

export function uniqBy<T, K = any>(a: T[], key: (v: T) => K) {
  const seen = new Set();
  return a.filter(item => {
    const k = key(item)
    if (seen.has(k)) {
      return false
    }
    seen.add(k)
    return true
  })
}
