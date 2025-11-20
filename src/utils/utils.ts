
export function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

export function deepEqual<T>(v1: T, v2: T): boolean {
  return JSON.stringify(v1) === JSON.stringify(v2)
}