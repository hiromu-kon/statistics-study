import { createRng, mean, randomNormal } from '../../../lib/stats'

// この章の図で使う時系列の計算。
// 図ごとに乱数を引き直すと、スライダーを動かすたびに形が変わって「何が変わったか」が見えなくなるので、
// ノイズの列は固定しておき、同じノイズからモデルだけを変えて系列を作る。

export const N = 120

/** 標準正規のノイズ列（シード固定） */
export function noiseSeries(n = N, seed = 7): number[] {
  const rng = createRng(seed)
  return Array.from({ length: n }, () => randomNormal(rng))
}

/**
 * AR(1)：x_t = φ x_{t-1} + ε_t。x_0 は定常分布の標準偏差で始める（|φ| < 1 のとき）。
 * |φ| ≥ 1 のときは 0 から始める（ランダムウォーク・発散する系列）。
 */
export function ar1(phi: number, eps: number[]): number[] {
  const xs: number[] = []
  let prev = Math.abs(phi) < 1 ? eps[0] / Math.sqrt(1 - phi * phi) : 0
  for (let t = 0; t < eps.length; t++) {
    const x = t === 0 ? prev : phi * prev + eps[t]
    xs.push(x)
    prev = x
  }
  return xs
}

/** MA(1)：x_t = ε_t + θ ε_{t-1} */
export function ma1(theta: number, eps: number[]): number[] {
  return eps.map((e, t) => e + theta * (t > 0 ? eps[t - 1] : 0))
}

/** 標本自己相関 r_k（分母は系列全体の偏差の2乗和。2級のレッスンと同じ式） */
export function acf(xs: number[], k: number): number {
  const m = mean(xs)
  const d = xs.map((x) => x - m)
  let num = 0
  for (let t = 0; t + k < d.length; t++) num += d[t] * d[t + k]
  const den = d.reduce((a, b) => a + b * b, 0)
  return den === 0 ? 0 : num / den
}

/**
 * 自己相関 ρ_1, …, ρ_K（rho[0] = ρ_1）から偏自己相関 φ_11, …, φ_KK を求める（ダービン・レビンソンの漸化式）。
 * 回帰を K 回解き直すより速く、図をスライダーで動かしても軽い。
 */
export function pacfFromAcf(rho: number[]): number[] {
  const out: number[] = []
  let prev: number[] = []
  for (let k = 1; k <= rho.length; k++) {
    let phikk: number
    if (k === 1) phikk = rho[0]
    else {
      let num = rho[k - 1]
      let den = 1
      for (let j = 1; j < k; j++) {
        num -= prev[j - 1] * rho[k - j - 1]
        den -= prev[j - 1] * rho[j - 1]
      }
      phikk = den === 0 ? 0 : num / den
    }
    const cur = prev.map((p, j) => p - phikk * prev[k - 2 - j])
    cur.push(phikk)
    prev = cur
    out.push(phikk)
  }
  return out
}

export type ModelKind = 'ar1pos' | 'ar1neg' | 'ar2' | 'ma1' | 'arma11'

/** 理論上の自己相関 ρ_1, …, ρ_K */
export function theoreticalAcf(kind: ModelKind, K: number): number[] {
  const rho: number[] = []
  if (kind === 'ar1pos' || kind === 'ar1neg') {
    const phi = kind === 'ar1pos' ? 0.7 : -0.7
    for (let k = 1; k <= K; k++) rho.push(phi ** k)
  } else if (kind === 'ar2') {
    const [p1, p2] = [0.5, 0.3]
    const r = [1, p1 / (1 - p2)]
    for (let k = 2; k <= K; k++) r.push(p1 * r[k - 1] + p2 * r[k - 2])
    rho.push(...r.slice(1, K + 1))
  } else if (kind === 'ma1') {
    const th = 0.8
    for (let k = 1; k <= K; k++) rho.push(k === 1 ? th / (1 + th * th) : 0)
  } else {
    const [phi, th] = [0.7, 0.5]
    const r1 = ((1 + phi * th) * (phi + th)) / (1 + 2 * phi * th + th * th)
    for (let k = 1; k <= K; k++) rho.push(r1 * phi ** (k - 1))
  }
  return rho
}

/**
 * ペリオドグラム I(f_j) = (n/4)(a_j² + b_j²)、f_j = j/n（j = 1, …, n/2）。
 * a_j, b_j は、周波数 f_j の cos 波・sin 波をあてはめたときの係数。
 */
export function periodogram(xs: number[]): { f: number; I: number }[] {
  const n = xs.length
  const m = mean(xs)
  const out: { f: number; I: number }[] = []
  for (let j = 1; j <= Math.floor(n / 2); j++) {
    const f = j / n
    let c = 0
    let s = 0
    for (let t = 0; t < n; t++) {
      c += (xs[t] - m) * Math.cos(2 * Math.PI * f * (t + 1))
      s += (xs[t] - m) * Math.sin(2 * Math.PI * f * (t + 1))
    }
    out.push({ f, I: (c * c + s * s) / n })
  }
  return out
}

/** ダービン・ワトソン比 DW = Σ(e_t − e_{t−1})² / Σ e_t² */
export function durbinWatson(e: number[]): number {
  let num = 0
  for (let t = 1; t < e.length; t++) num += (e[t] - e[t - 1]) ** 2
  const den = e.reduce((a, b) => a + b * b, 0)
  return num / den
}

/**
 * ローカルレベルモデルのカルマンフィルタ。
 * 状態 α_t = α_{t−1} + η_t（分散 q）、観測 y_t = α_t + ε_t（分散 1）。
 * 初期値は a = y_1、P = 1（散漫な初期値にしないのは、図の最初の数点が極端にならないようにするため）。
 */
export function localLevelFilter(ys: number[], q: number): { level: number[]; gain: number[] } {
  let a = ys[0]
  let P = 1
  const level: number[] = []
  const gain: number[] = []
  for (const y of ys) {
    const Pp = P + q
    const K = Pp / (Pp + 1)
    a = a + K * (y - a)
    P = Pp * (1 - K)
    level.push(a)
    gain.push(K)
  }
  return { level, gain }
}
