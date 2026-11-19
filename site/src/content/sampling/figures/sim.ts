import { createRng, mean, randomNormal, round, sd } from '../../../lib/stats'

// 図のシミュレーションで使う乱数の道具。シードを決めれば毎回同じ結果になる。

export type Rng = () => number

/** サイコロを1回振る（1〜6） */
export const rollDie = (rng: Rng) => 1 + Math.floor(rng() * 6)

/** 平均 1/λ の指数分布に従う乱数（逆関数法） */
export const randomExp = (rng: Rng, lambda = 1) => -Math.log(1 - rng()) / lambda

/** 1つの標本（大きさ n）をとって、その平均を返すことを reps 回くり返す */
export function simulateMeans(draw: (rng: Rng) => number, n: number, reps: number, seed: number): number[] {
  const rng = createRng(seed)
  const out: number[] = []
  for (let r = 0; r < reps; r++) {
    let s = 0
    for (let i = 0; i < n; i++) s += draw(rng)
    out.push(s / n)
  }
  return out
}

/** 母集団の例：ある町の大人 2000 人の身長（cm）。平均 160・標準偏差 8 くらいになるように作る */
export const heightPopulation: number[] = (() => {
  const rng = createRng(20260729)
  return Array.from({ length: 2000 }, () => round(randomNormal(rng, 160, 8), 1))
})()

export const heightMu = mean(heightPopulation)
export const heightSigma = sd(heightPopulation)

/** 母集団から n 人を選ぶ（同じ人を選び直してもよい＝独立に選ぶ） */
export function drawFrom(pop: number[], n: number, seed: number): number[] {
  const rng = createRng(seed)
  return Array.from({ length: n }, () => pop[Math.floor(rng() * pop.length)])
}
