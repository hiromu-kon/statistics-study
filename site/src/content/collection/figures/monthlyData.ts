import { createRng, mean, randomNormal } from '../../../lib/stats'

// 架空の「アイスクリーム店の月次売上」4年分（48か月）。
// 原系列 = トレンド（右上がり） + 季節変動（夏に多い） + 不規則変動（ノイズ）として作る。

export const MONTHS = 48

const rng = createRng(19)

export const trend = Array.from({ length: MONTHS }, (_, t) => 100 + 0.5 * t)
/** 月（0=1月）ごとの季節変動。7月（6）が山、1月（0）が谷 */
export const seasonal = Array.from({ length: MONTHS }, (_, t) => 20 * Math.cos((2 * Math.PI * ((t % 12) - 6)) / 12))
export const noise = Array.from({ length: MONTHS }, () => randomNormal(rng, 0, 3))
export const sales = trend.map((v, t) => v + seasonal[t] + noise[t])

/**
 * 移動平均。k が奇数なら前後 (k-1)/2 個ずつの平均。
 * k が偶数なら中心化移動平均（k 項移動平均をさらに隣どうし平均する = 両端の重みが 1/(2k)）。
 * 計算できない端は null。
 */
export function movingAverage(xs: number[], k: number): (number | null)[] {
  if (k <= 1) return [...xs]
  const n = xs.length
  if (k % 2 === 1) {
    const h = (k - 1) / 2
    return xs.map((_, t) => (t - h < 0 || t + h >= n ? null : mean(xs.slice(t - h, t + h + 1))))
  }
  const h = k / 2
  return xs.map((_, t) => {
    if (t - h < 0 || t + h >= n) return null
    let s = 0.5 * xs[t - h] + 0.5 * xs[t + h]
    for (let j = t - h + 1; j <= t + h - 1; j++) s += xs[j]
    return s / k
  })
}

/** 自己相関係数 r_k = Σ_{t=1}^{n-k}(x_t - x̄)(x_{t+k} - x̄) / Σ_{t=1}^{n}(x_t - x̄)² */
export function autocorrelation(xs: number[], k: number): number {
  const m = mean(xs)
  const d = xs.map((x) => x - m)
  let num = 0
  for (let t = 0; t + k < d.length; t++) num += d[t] * d[t + k]
  const den = d.reduce((a, b) => a + b * b, 0)
  return num / den
}

