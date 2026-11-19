import { createRng, linearRegression, mean, randomNormal, sd } from '../../../lib/stats'

// この章の図と問題で使うデータ。
// 図の中で乱数から作らず数値を書いておくのは、本文や問題で引用する r などの値を Python で検算できるようにするため。

export type XY = { xs: number[]; ys: number[] }

/** 共分散の部屋分けの図で使う3つのデータ（各12人） */
export const quadrantData: Record<'pos' | 'neg' | 'none', XY> = {
  pos: {
    xs: [60, 65, 36, 58, 23, 72, 35, 55, 39, 36, 56, 65],
    ys: [65, 72, 38, 52, 35, 51, 35, 63, 36, 26, 68, 60],
  },
  neg: {
    xs: [46, 70, 24, 81, 44, 42, 57, 48, 30, 59, 46, 54],
    ys: [54, 32, 79, 21, 61, 53, 35, 39, 53, 61, 58, 54],
  },
  none: {
    xs: [27, 39, 32, 47, 62, 61, 49, 72, 57, 74, 32, 48],
    ys: [39, 44, 49, 79, 45, 41, 58, 34, 70, 60, 58, 24],
  },
}

/** 外れ値の図：関係のない10点のかたまり（r ≈ 0.07） */
export const outlierCluster: XY = {
  xs: [2, 3, 3, 4, 4, 5, 5, 6, 3, 5],
  ys: [4, 2, 5, 3, 6, 2, 5, 4, 3.5, 4.5],
}

/** 山形の関係：室温（℃）と作業のはかどり具合（点）。r ≈ 0.09 */
export const curvedData: XY = {
  xs: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
  ys: [23, 32, 42, 55, 66, 72, 79, 78, 80, 79, 81, 72, 69, 61, 52, 35, 26],
}

/** 層別の図：学年ごとの身長（cm）と計算テストの点。全体 r ≈ 0.70、学年内はほぼ 0 */
export const gradeGroups = [
  { label: '2年生', grade: 2, xs: [123, 124, 118, 130, 120, 120, 117, 124], ys: [47, 44, 47, 57, 39, 64, 58, 44] },
  { label: '4年生', grade: 4, xs: [135, 137, 130, 124, 135, 138, 132, 132], ys: [65, 64, 44, 67, 69, 55, 63, 69] },
  { label: '6年生', grade: 6, xs: [142, 148, 146, 135, 147, 146, 147, 141], ys: [91, 72, 80, 66, 65, 73, 69, 76] },
]

/** 逆転の図：年代ごとの1週間の運動時間（時間）と血圧（mmHg）。全体 r ≈ 0.51、年代内 r ≈ −0.79 */
export const ageGroups = [
  { label: '30代', xs: [1.5, 1.0, 1.5, 1.7, 1.4, 1.9, 4.3, 2.7], ys: [124, 127, 120, 119, 119, 128, 110, 113] },
  { label: '50代', xs: [3.7, 4.5, 2.8, 3.5, 4.2, 6.1, 4.5, 2.8], ys: [131, 121, 138, 136, 135, 124, 132, 139] },
  { label: '70代', xs: [5.3, 6.6, 5.2, 8.2, 5.5, 6.5, 5.7, 5.0], ys: [146, 144, 154, 132, 143, 140, 149, 143] },
]

/** 回帰の例：最高気温（℃）とアイスの売上（個）。ŷ = −30 + 5x、残差平方和 56 */
export const iceData: XY = {
  xs: [22, 24, 26, 28, 30],
  ys: [82, 86, 104, 106, 122],
}

/** 対数変換の例：サービス開始からの月数と会員数（人） */
export const growthData: XY = {
  xs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ys: [224, 292, 425, 471, 659, 1085, 1075, 1578, 2266, 2980, 4426],
}

/** 残差プロットの見本：直線でうまく表せるデータ */
export const goodLinearData: XY = {
  xs: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5],
  ys: [10.2, 11.2, 15.4, 14.6, 16.3, 15.5, 17.2, 21.8, 17.5, 21.9, 22.2, 21.4, 22.4, 25.8, 24.8, 25.6, 27.2, 27.7, 31.9, 31.0],
}

/** 残差プロットの見本：x が大きいほど散らばりが大きくなるデータ */
export const funnelData: XY = {
  xs: goodLinearData.xs,
  ys: [12.2, 12.0, 15.9, 13.8, 16.5, 16.5, 20.2, 17.6, 20.9, 19.9, 27.3, 21.6, 28.6, 19.8, 32.4, 25.0, 34.6, 22.5, 36.7, 26.8],
}

/**
 * 標本相関係数がちょうど r になる2変数を作るための土台（平均0・標準偏差1で互いに無相関な z1, z2）。
 * x = z1, y = r·z1 + √(1 − r²)·z2 とすれば、乱数のゆらぎに関係なく相関係数が r ぴったりになる。
 */
export function uncorrelatedPair(n: number, seed: number): { z1: number[]; z2: number[] } {
  const rng = createRng(seed)
  const a = Array.from({ length: n }, () => randomNormal(rng))
  const b = Array.from({ length: n }, () => randomNormal(rng))
  const ma = mean(a)
  const sa = sd(a)
  const z1 = a.map((v) => (v - ma) / sa)
  const mb = mean(b)
  const bc = b.map((v) => v - mb)
  const proj = bc.reduce((s, v, i) => s + v * z1[i], 0) / z1.reduce((s, v) => s + v * v, 0)
  const resid = bc.map((v, i) => v - proj * z1[i])
  const sr = sd(resid)
  return { z1, z2: resid.map((v) => v / sr) }
}

export function correlatedData(n: number, seed: number, r: number, center = 50, scale = 10): XY {
  const { z1, z2 } = uncorrelatedPair(n, seed)
  const k = Math.sqrt(Math.max(0, 1 - r * r))
  return {
    xs: z1.map((v) => center + scale * v),
    ys: z1.map((v, i) => center + scale * (r * v + k * z2[i])),
  }
}

/** ys を zs で回帰したときの残差（z の影響を直線的に取り除いた残り） */
export function residualsOn(ys: number[], zs: number[]): number[] {
  const { a, b } = linearRegression(zs, ys)
  return ys.map((y, i) => y - (a + b * zs[i]))
}

/** 値の範囲に少し余白をつけた軸の範囲 */
export function extent(values: number[], padRatio = 0.08): [number, number] {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const pad = (hi - lo || 1) * padRatio
  return [lo - pad, hi + pad]
}
