import { createRng, randomNormal } from '../../../lib/stats'

// この章の図で使う小さな行列計算。2×2・3×3 だけなので、一般の線形代数ライブラリは入れない。

export type Vec2 = [number, number]

/** 2×2 の対称行列 [[a, b], [b, c]] の固有値（大きい順）と、それぞれの長さ1の固有ベクトル */
export function eigenSym2(a: number, b: number, c: number): { values: Vec2; vectors: [Vec2, Vec2] } {
  const m = (a + c) / 2
  const r = Math.sqrt(((a - c) / 2) ** 2 + b * b)
  const l1 = m + r
  const l2 = m - r
  let v1: Vec2
  if (Math.abs(b) > 1e-12) v1 = normalize([b, l1 - a])
  else v1 = a >= c ? [1, 0] : [0, 1]
  // 見やすさのため、第1成分が負にならない向きにそろえる（固有ベクトルは −1 倍しても固有ベクトル）
  if (v1[0] < 0 || (v1[0] === 0 && v1[1] < 0)) v1 = [-v1[0], -v1[1]]
  const v2: Vec2 = [-v1[1], v1[0]]
  return { values: [l1, l2], vectors: [v1, v2] }
}

export function normalize(v: Vec2): Vec2 {
  const n = Math.hypot(v[0], v[1])
  return [v[0] / n, v[1] / n]
}

/** 3×3 行列の逆行列（余因子行列 ÷ 行列式） */
export function inverse3(m: number[][]): number[][] {
  const [[a, b, c], [d, e, f], [g, h, i]] = m
  const A = e * i - f * h
  const B = -(d * i - f * g)
  const C = d * h - e * g
  const det = a * A + b * B + c * C
  return [
    [A / det, -(b * i - c * h) / det, (b * f - c * e) / det],
    [B / det, (a * i - c * g) / det, -(a * f - c * d) / det],
    [C / det, -(a * h - b * g) / det, (a * e - b * d) / det],
  ]
}

export function det3(m: number[][]): number {
  const [[a, b, c], [d, e, f], [g, h, i]] = m
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
}

/**
 * 平均0・分散1（n で割る）で、互いの相関がちょうど0の2列を作る。
 * これを混ぜると、標本の相関係数がスライダーの値とぴったり一致する散布図が描ける。
 */
export function whitenedPair(n: number, seed: number): { z1: number[]; z2: number[] } {
  const rng = createRng(seed)
  const a = Array.from({ length: n }, () => randomNormal(rng))
  const b = Array.from({ length: n }, () => randomNormal(rng))
  const center = (xs: number[]) => {
    const m = xs.reduce((s, v) => s + v, 0) / n
    return xs.map((v) => v - m)
  }
  const unit = (xs: number[]) => {
    const s = Math.sqrt(xs.reduce((t, v) => t + v * v, 0) / n)
    return xs.map((v) => v / s)
  }
  const z1 = unit(center(a))
  const bc = center(b)
  const proj = bc.reduce((s, v, i) => s + v * z1[i], 0) / n
  const z2 = unit(bc.map((v, i) => v - proj * z1[i]))
  return { z1, z2 }
}
