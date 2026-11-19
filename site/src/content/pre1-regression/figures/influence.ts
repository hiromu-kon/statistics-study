// 回帰診断の図で使う計算（単回帰）。数値は numpy で計算した値と突き合わせてある。

export const baseX = [1, 2, 3, 4, 5, 6, 7, 8, 9]
export const baseY = [2.8, 2.6, 3.9, 3.7, 4.9, 4.6, 5.8, 5.7, 6.6]

export type Diagnostics = {
  a: number
  b: number
  /** てこ比 hii */
  h: number[]
  /** 残差 */
  e: number[]
  /** 標準化残差 ei / (s √(1 − hii)) */
  r: number[]
  /** Cook の距離 */
  D: number[]
  s2: number
}

/** 単回帰の当てはめと、各点のてこ比・標準化残差・Cook の距離 */
export function diagnose(xs: number[], ys: number[]): Diagnostics {
  const n = xs.length
  const mx = xs.reduce((s, v) => s + v, 0) / n
  const my = ys.reduce((s, v) => s + v, 0) / n
  const sxx = xs.reduce((s, v) => s + (v - mx) ** 2, 0)
  const sxy = xs.reduce((s, v, i) => s + (v - mx) * (ys[i] - my), 0)
  const b = sxy / sxx
  const a = my - b * mx
  const e = ys.map((y, i) => y - a - b * xs[i])
  const s2 = e.reduce((s, v) => s + v * v, 0) / (n - 2)
  const h = xs.map((x) => 1 / n + (x - mx) ** 2 / sxx)
  const r = e.map((v, i) => v / Math.sqrt(s2 * (1 - h[i])))
  // パラメータは切片と傾きの2個
  const D = e.map((v, i) => ((v * v) / (2 * s2)) * (h[i] / (1 - h[i]) ** 2))
  return { a, b, h, e, r, D, s2 }
}
