import { chi2Cdf, chi2Pdf, normalCdf, normalPdf, poissonPmf } from '../../../lib/stats'

// 非心分布の図のための計算。lib/stats.ts に入れないのは、この章の図でしか使わず、
// 分布表の値として scipy と突き合わせる対象（scripts/verify-stats.py）でもないため。
// 値は scipy.stats.ncx2 / nct と小数第4位まで一致することを確かめてある。

/**
 * 非心カイ二乗分布（自由度 m、非心度 λ = Σμᵢ²）の密度。
 * 「ポアソン分布 Po(λ/2) で選んだ j に対する χ²(m + 2j)」の混ぜ合わせとして計算する。
 */
export function ncChi2Pdf(x: number, m: number, lambda: number): number {
  if (lambda === 0) return chi2Pdf(x, m)
  let s = 0
  for (let j = 0; j < 200; j++) {
    const w = poissonPmf(j, lambda / 2)
    s += w * chi2Pdf(x, m + 2 * j)
    if (j > lambda && w < 1e-12) break
  }
  return s
}

export function ncChi2Sf(x: number, m: number, lambda: number): number {
  let s = 0
  for (let j = 0; j < 200; j++) {
    const w = poissonPmf(j, lambda / 2)
    s += w * (1 - chi2Cdf(x, m + 2 * j))
    if (j > lambda && w < 1e-12) break
  }
  return s
}

/**
 * χ²(m) に従う V について ∫ g(v) f(v) dv を台形公式で求める。
 * v = u² と置きかえるのは、自由度が小さいと v = 0 の近くで密度が急に変わり、等間隔の台形公式では誤差が大きいため。
 */
const nodeCache = new Map<number, { v: number; w: number }[]>()

function chi2Nodes(m: number): { v: number; w: number }[] {
  const cached = nodeCache.get(m)
  if (cached) return cached
  const upper = Math.sqrt(m + 12 * Math.sqrt(2 * m) + 30)
  const steps = 600
  const h = upper / steps
  const nodes = Array.from({ length: steps }, (_, idx) => {
    const i = idx + 1
    const u = i * h
    const v = u * u
    return { v, w: (i === steps ? 0.5 : 1) * chi2Pdf(v, m) * 2 * u * h }
  })
  nodeCache.set(m, nodes)
  return nodes
}

function integrateOverChi2(m: number, g: (v: number) => number): number {
  let s = 0
  for (const { v, w } of chi2Nodes(m)) s += w * g(v)
  return s
}

/**
 * 非心 t 分布（自由度 m、非心度 δ）の密度。T = (Z + δ) / √(V/m) で、
 * V を固定すると T は正規分布になることを使い、V について積分する。
 */
export function ncTPdf(t: number, m: number, delta: number): number {
  return integrateOverChi2(m, (v) => {
    const s = Math.sqrt(v / m)
    return normalPdf(t * s - delta) * s
  })
}

/** 非心 t 分布の上側確率 P(T > c) */
export function ncTSf(c: number, m: number, delta: number): number {
  return integrateOverChi2(m, (v) => 1 - normalCdf(c * Math.sqrt(v / m) - delta))
}
