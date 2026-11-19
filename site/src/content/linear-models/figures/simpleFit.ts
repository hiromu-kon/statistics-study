import { mean, sum } from '../../../lib/stats'

/**
 * 単回帰の推定値と、検定に必要な標準誤差をまとめて求める。
 * lib/stats.ts の linearRegression は傾き・切片・R² だけを返すため、
 * 標準誤差（残差の自由度 n − 2 を使う）はこの章で計算する。
 */
export function simpleFit(xs: number[], ys: number[]) {
  const n = xs.length
  const mx = mean(xs)
  const my = mean(ys)
  const sxx = sum(xs.map((x) => (x - mx) ** 2))
  const sxy = sum(xs.map((x, i) => (x - mx) * (ys[i] - my)))
  const b = sxx === 0 ? 0 : sxy / sxx
  const a = my - b * mx
  const sse = sum(ys.map((y, i) => (y - (a + b * xs[i])) ** 2))
  const sst = sum(ys.map((y) => (y - my) ** 2))
  const s = Math.sqrt(sse / (n - 2))
  const seB = s / Math.sqrt(sxx)
  return { a, b, s, seB, t: b / seB, r2: sst === 0 ? 0 : 1 - sse / sst, df: n - 2 }
}
