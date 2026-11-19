/** 離散型確率変数の分布。x の値と、その値をとる確率 p の組 */
export type Dist = { x: number; p: number }[]

export const expectation = (d: Dist) => d.reduce((s, { x, p }) => s + x * p, 0)

export const varianceOf = (d: Dist) => {
  const m = expectation(d)
  return d.reduce((s, { x, p }) => s + (x - m) ** 2 * p, 0)
}

/** Y = aX + b の分布。a = 0 のときは1点に集まる */
export const transform = (d: Dist, a: number, b: number): Dist => {
  const map = new Map<number, number>()
  for (const { x, p } of d) {
    const y = Number((a * x + b).toFixed(10))
    map.set(y, (map.get(y) ?? 0) + p)
  }
  return [...map.entries()].map(([x, p]) => ({ x, p })).sort((u, v) => u.x - v.x)
}

export const die: Dist = [1, 2, 3, 4, 5, 6].map((x) => ({ x, p: 1 / 6 }))
