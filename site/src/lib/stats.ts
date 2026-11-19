// 図・分布表・シミュレーションで使う統計計算。
// 外部ライブラリ（jStat など）を使わないのは、必要な関数が少なく、
// 分布表の値を scripts/verify-stats.py で scipy と突き合わせて検証できるようにするため。

// ---------- 基本 ----------

export function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0)
}

export function mean(xs: number[]): number {
  return sum(xs) / xs.length
}

/** 分散。ddof=1 で n-1 で割る（不偏分散）、ddof=0 で n で割る */
export function variance(xs: number[], ddof: 0 | 1 = 0): number {
  const m = mean(xs)
  return sum(xs.map((x) => (x - m) ** 2)) / (xs.length - ddof)
}

export function sd(xs: number[], ddof: 0 | 1 = 0): number {
  return Math.sqrt(variance(xs, ddof))
}

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b)
  const n = s.length
  return n % 2 === 1 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
}

export function covariance(xs: number[], ys: number[], ddof: 0 | 1 = 0): number {
  const mx = mean(xs)
  const my = mean(ys)
  return sum(xs.map((x, i) => (x - mx) * (ys[i] - my))) / (xs.length - ddof)
}

export function correlation(xs: number[], ys: number[]): number {
  return covariance(xs, ys) / (sd(xs) * sd(ys))
}

/** 最小二乗法による回帰直線 y = a + b x */
export function linearRegression(xs: number[], ys: number[]): { a: number; b: number; r2: number } {
  const b = covariance(xs, ys) / variance(xs)
  const a = mean(ys) - b * mean(xs)
  const r = correlation(xs, ys)
  return { a, b, r2: r * r }
}

export function round(x: number, digits = 3): number {
  const p = 10 ** digits
  return Math.round(x * p) / p
}

// ---------- 組合せ・ガンマ関数 ----------

export function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

export function combination(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  k = Math.min(k, n - k)
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return r
}

// Lanczos 近似（g=7, n=9）
const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
]

export function logGamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x)
  x -= 1
  let a = LANCZOS[0]
  const t = x + 7.5
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i)
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a)
}

/** 正則化不完全ガンマ関数 P(a, x) */
function gammaP(a: number, x: number): number {
  if (x <= 0) return 0
  if (x < a + 1) {
    let term = 1 / a
    let s = term
    for (let n = 1; n < 500; n++) {
      term *= x / (a + n)
      s += term
      if (Math.abs(term) < Math.abs(s) * 1e-15) break
    }
    return s * Math.exp(-x + a * Math.log(x) - logGamma(a))
  }
  // 連分数（Lentz 法）で Q を求めて 1 - Q
  let b = x + 1 - a
  let c = 1 / 1e-300
  let d = 1 / b
  let h = d
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a)
    b += 2
    d = an * d + b
    if (Math.abs(d) < 1e-300) d = 1e-300
    c = b + an / c
    if (Math.abs(c) < 1e-300) c = 1e-300
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 1e-15) break
  }
  return 1 - Math.exp(-x + a * Math.log(x) - logGamma(a)) * h
}

function betaContinuedFraction(a: number, b: number, x: number): number {
  const qab = a + b
  const qap = a + 1
  const qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap
  if (Math.abs(d) < 1e-300) d = 1e-300
  d = 1 / d
  let h = d
  for (let m = 1; m < 500; m++) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < 1e-300) d = 1e-300
    c = 1 + aa / c
    if (Math.abs(c) < 1e-300) c = 1e-300
    d = 1 / d
    h *= d * c
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < 1e-300) d = 1e-300
    c = 1 + aa / c
    if (Math.abs(c) < 1e-300) c = 1e-300
    d = 1 / d
    const del = d * c
    h *= del
    if (Math.abs(del - 1) < 1e-15) break
  }
  return h
}

/** 正則化不完全ベータ関数 I_x(a, b) */
function betaI(a: number, b: number, x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x))
  if (x < (a + 1) / (a + b + 2)) return (bt * betaContinuedFraction(a, b, x)) / a
  return 1 - (bt * betaContinuedFraction(b, a, 1 - x)) / b
}

/** 単調増加な累積分布関数の逆関数を二分法で求める */
function invert(cdf: (x: number) => number, p: number, lo: number, hi: number): number {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (cdf(mid) < p) lo = mid
    else hi = mid
    if (hi - lo < 1e-12) break
  }
  return (lo + hi) / 2
}

// ---------- 正規分布 ----------

export function normalPdf(x: number, mu = 0, sigma = 1): number {
  const z = (x - mu) / sigma
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI))
}

export function normalCdf(x: number, mu = 0, sigma = 1): number {
  const z = (x - mu) / sigma
  // Φ(z) = P(1/2, z²/2) を使う（z<0 は対称性）
  const p = 0.5 * gammaP(0.5, (z * z) / 2)
  return z >= 0 ? 0.5 + p : 0.5 - p
}

export function normalQuantile(p: number, mu = 0, sigma = 1): number {
  return mu + sigma * invert((z) => normalCdf(z), p, -40, 40)
}

// ---------- t 分布 ----------

export function tPdf(x: number, df: number): number {
  return Math.exp(
    logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + (x * x) / df),
  )
}

export function tCdf(x: number, df: number): number {
  const ib = betaI(df / 2, 0.5, df / (df + x * x))
  return x >= 0 ? 1 - 0.5 * ib : 0.5 * ib
}

export function tQuantile(p: number, df: number): number {
  return invert((x) => tCdf(x, df), p, -1000, 1000)
}

// ---------- カイ二乗分布 ----------

export function chi2Pdf(x: number, df: number): number {
  if (x <= 0) return 0
  return Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - (df / 2) * Math.log(2) - logGamma(df / 2))
}

export function chi2Cdf(x: number, df: number): number {
  return gammaP(df / 2, x / 2)
}

export function chi2Quantile(p: number, df: number): number {
  return invert((x) => chi2Cdf(x, df), p, 0, 2000)
}

// ---------- F 分布 ----------

export function fPdf(x: number, d1: number, d2: number): number {
  if (x <= 0) return 0
  return Math.exp(
    0.5 * (d1 * Math.log(d1 * x) + d2 * Math.log(d2) - (d1 + d2) * Math.log(d1 * x + d2)) -
      Math.log(x) -
      (logGamma(d1 / 2) + logGamma(d2 / 2) - logGamma((d1 + d2) / 2)),
  )
}

export function fCdf(x: number, d1: number, d2: number): number {
  if (x <= 0) return 0
  return betaI(d1 / 2, d2 / 2, (d1 * x) / (d1 * x + d2))
}

export function fQuantile(p: number, d1: number, d2: number): number {
  return invert((x) => fCdf(x, d1, d2), p, 0, 10000)
}

// ---------- 離散分布 ----------

export function binomialPmf(k: number, n: number, p: number): number {
  return combination(n, k) * p ** k * (1 - p) ** (n - k)
}

export function poissonPmf(k: number, lambda: number): number {
  return Math.exp(k * Math.log(lambda) - lambda - logGamma(k + 1))
}

export function geometricPmf(k: number, p: number): number {
  // 初めて成功するまでの試行回数 k (k = 1, 2, ...)
  return (1 - p) ** (k - 1) * p
}

export function exponentialPdf(x: number, lambda: number): number {
  return x < 0 ? 0 : lambda * Math.exp(-lambda * x)
}

// ---------- 乱数（シード付き） ----------

export function createRng(seed = 1): () => number {
  // mulberry32: 図を毎回同じ形で描けるようにシードを固定できる
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomNormal(rng: () => number, mu = 0, sigma = 1): number {
  let u = 0
  while (u === 0) u = rng()
  const v = rng()
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
