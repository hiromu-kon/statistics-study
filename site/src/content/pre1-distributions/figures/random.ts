// 図のシミュレーションで使う乱数。lib/stats.ts にない分布だけをここに置く。

/** 指数分布の乱数（平均 mean）。逆関数法 */
export function randomExp(rng: () => number, mean: number): number {
  return -mean * Math.log(1 - rng())
}

/** 標準コーシー分布の乱数。逆関数法 */
export function randomCauchy(rng: () => number): number {
  return Math.tan(Math.PI * (rng() - 0.5))
}
