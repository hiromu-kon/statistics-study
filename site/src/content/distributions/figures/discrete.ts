import { combination } from '../../../lib/stats'

// stats.ts にない離散分布の確率と、図の目盛りの補助。

/** 超幾何分布：N 個（うち当たり M 個）から戻さずに n 個取り出したとき、当たりがちょうど k 個の確率 */
export function hypergeometricPmf(k: number, N: number, M: number, n: number): number {
  return (combination(M, k) * combination(N - M, n - k)) / combination(N, n)
}

/** 負の二項分布：成功確率 p の試行で、r 回目の成功が k 回目の試行で起こる確率（k = r, r+1, ...） */
export function negativeBinomialPmf(k: number, r: number, p: number): number {
  if (k < r) return 0
  return combination(k - 1, r - 1) * p ** r * (1 - p) ** (k - r)
}

export function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i)
}

/** 個数を数える軸なので、目盛りは整数だけにする（Plot の自動目盛りは 2.5 刻みになることがある） */
export function intTicks(from: number, to: number, count = 8): number[] {
  const raw = (to - from) / count
  const step = [1, 2, 5, 10, 20, 50].find((s) => s >= raw) ?? 100
  return range(Math.ceil(from / step), Math.floor(to / step)).map((i) => i * step)
}
