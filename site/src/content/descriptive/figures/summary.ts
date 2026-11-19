import { mean, sum } from '../../../lib/stats'

// この章の図と問題で使う計算。lib/stats.ts は他の章と共有なので、章でしか使わないものはここに置く。

export type BoxSummary = {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  /** 外れ値として点で描く値。ひげはこれを除いた最小値・最大値まで */
  outliers?: number[]
  mean?: number
}

function medianOfSorted(s: number[]): number {
  const n = s.length
  return n % 2 === 1 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
}

/**
 * 四分位数。中央値で前半・後半に分け、それぞれの中央値を Q1・Q3 とする。
 * データ数が奇数のときは、真ん中の値をどちらの半分にも入れない（統計WEB の箱ひげ図の解説と同じ方法）。
 * Excel の QUARTILE.INC や numpy の既定値は別の流儀なので、値が少しずれることがある。
 */
export function quartiles(xs: number[]): { q1: number; median: number; q3: number } {
  const s = [...xs].sort((a, b) => a - b)
  const n = s.length
  const half = Math.floor(n / 2)
  return {
    q1: medianOfSorted(s.slice(0, half)),
    median: medianOfSorted(s),
    q3: medianOfSorted(s.slice(n - half)),
  }
}

/** 箱ひげ図に描く値。withOutliers なら Q1 − 1.5×IQR 〜 Q3 + 1.5×IQR の外を外れ値とする */
export function summarize(xs: number[], label: string, withOutliers = false): BoxSummary {
  const { q1, median, q3 } = quartiles(xs)
  const iqr = q3 - q1
  const lo = q1 - 1.5 * iqr
  const hi = q3 + 1.5 * iqr
  const inside = withOutliers ? xs.filter((x) => x >= lo && x <= hi) : xs
  return {
    label,
    min: Math.min(...inside),
    q1,
    median,
    q3,
    max: Math.max(...inside),
    outliers: withOutliers ? xs.filter((x) => x < lo || x > hi) : [],
    mean: mean(xs),
  }
}

/** 累積相対度数（ローレンツ曲線の縦軸）。値を小さい順に並べ、0 から始める */
export function lorenzPoints(values: number[]): { x: number; y: number }[] {
  const s = [...values].sort((a, b) => a - b)
  const total = sum(s)
  let acc = 0
  const pts = [{ x: 0, y: 0 }]
  s.forEach((v, i) => {
    acc += v
    pts.push({ x: (i + 1) / s.length, y: acc / total })
  })
  return pts
}

/** ジニ係数 = 1 − 2 ×（ローレンツ曲線の下の面積）。面積は台形の和で求める */
export function gini(values: number[]): number {
  const pts = lorenzPoints(values)
  let area = 0
  for (let i = 1; i < pts.length; i++) area += ((pts[i].x - pts[i - 1].x) * (pts[i].y + pts[i - 1].y)) / 2
  return 1 - 2 * area
}

/** 一様な頻度（どれも同じ回数）からのずれ Σ(観測 − 期待)² / 期待 */
export function chiSquareUniform(observed: number[]): { expected: number; terms: number[]; total: number } {
  const expected = sum(observed) / observed.length
  const terms = observed.map((o) => (o - expected) ** 2 / expected)
  return { expected, terms, total: sum(terms) }
}

/** 待ち時間（分）50人分。右に裾が長い。箱ひげ図とヒストグラムの対応の問題で使う */
export const WAIT_TIMES = [
  3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 8, 8, 8, 8, 8, 9, 9, 9, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 13,
  14, 14, 15, 15, 15, 15, 15, 15, 17, 19, 20, 24, 30,
]
